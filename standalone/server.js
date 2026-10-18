// Сервер AI-экосистемы контроля и аудита ГК Садыхан.
// Node.js 18+ без сторонних зависимостей. Отдаёт страницу, хранит базу знаний и файлы
// в папке data/, передаёт запросы ИИ-агентов в Anthropic API с ключом, заданным на сервере.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const fileConf = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8')); } catch { return {}; } })();
const conf = k => process.env[k] !== undefined && process.env[k] !== '' ? process.env[k] : fileConf[k];

const PORT = Number(conf('PORT') || 8080);
const HOST = conf('HOST') || '0.0.0.0';
const DATA = path.resolve(ROOT, conf('DATA_DIR') || 'data');
const PUB = path.join(ROOT, 'public');
const AI_KEY = conf('ANTHROPIC_API_KEY') || '';
const AI_BASE = (conf('AI_BASE_URL') || 'https://api.anthropic.com').replace(/\/$/, '');
const AI_MODEL = conf('AI_MODEL') || 'claude-opus-5-5';
const AI_MODEL_QUICK = conf('AI_MODEL_QUICK') || AI_MODEL;
const AI_MAX_TOKENS = Number(conf('AI_MAX_TOKENS') || 8192);
const BASIC_AUTH = conf('BASIC_AUTH') || '';
const VERSION = '1.0';

// ── хранилище: data/db.json (документы по путям) и data/blobs (файлы)
fs.mkdirSync(path.join(DATA, 'blobs'), { recursive: true });
const DB_FILE = path.join(DATA, 'db.json');
const SEED = path.join(ROOT, 'seed');
if (!fs.existsSync(DB_FILE) && fs.existsSync(path.join(SEED, 'db.json'))) {
  fs.copyFileSync(path.join(SEED, 'db.json'), DB_FILE);
  const sb = path.join(SEED, 'blobs');
  if (fs.existsSync(sb)) for (const f of fs.readdirSync(sb)) fs.copyFileSync(path.join(sb, f), path.join(DATA, 'blobs', f));
  console.log('Начальные данные перенесены из папки seed/.');
}
let docs = {};
try { docs = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { docs = {}; }
let rev = 1; const log = []; const LOG_MAX = 2000; const waiters = new Set();
let saveTimer = null;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { const tmp = DB_FILE + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(docs)); fs.renameSync(tmp, DB_FILE); }, 300);
}
function changed(p) {
  rev++; log.push({ rev, p }); if (log.length > LOG_MAX) log.shift(); persist();
  for (const w of waiters) w(); waiters.clear();
}
function changesSince(since) {
  if (!log.length || since < log[0].rev - 1) return { rev, reset: true, docs };
  const out = {}; for (const e of log) if (e.rev > since) out[e.p] = docs[e.p] === undefined ? null : docs[e.p];
  return { rev, changes: out };
}
const SEG = /^(?!\.\.?$)[A-Za-z0-9_\-.~:@+]{1,200}$/;
const validDocPath = p => { const s = String(p || '').split('/'); return s.length % 2 === 0 && s.length <= 16 && s.every(x => SEG.test(x)); };
const BLOB_ID = /^[0-9a-f]{32}$/;

// ── HTTP
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.map': 'application/json' };
const send = (res, code, body, type) => { res.writeHead(code, { 'Content-Type': type || 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body)); };
const fail = (res, code, c, message) => send(res, code, { code: c, message });
function readBody(req, limit) {
  return new Promise((ok, no) => { const parts = []; let n = 0;
    req.on('data', c => { n += c.length; if (n > limit) { no(Object.assign(new Error('Слишком большой запрос'), { status: 413 })); req.destroy(); } else parts.push(c); });
    req.on('end', () => ok(Buffer.concat(parts))); req.on('error', no); });
}
const readJSON = async (req, limit) => JSON.parse((await readBody(req, limit)).toString('utf8') || '{}');
function authorized(req) {
  if (!BASIC_AUTH) return true;
  const h = req.headers.authorization || ''; if (!h.startsWith('Basic ')) return false;
  const a = Buffer.from(h.slice(6), 'base64'), b = Buffer.from(BASIC_AUTH);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function handle(req, res) {
  if (!authorized(req)) { res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Sadykhan audit", charset="UTF-8"' }); return res.end('Требуется вход'); }
  const u = new URL(req.url, 'http://local'); const p = decodeURIComponent(u.pathname);

  if (p === '/api/info') return send(res, 200, { ai: !!AI_KEY, model: AI_KEY ? AI_MODEL : null, version: VERSION });

  if (p === '/api/db/all' && req.method === 'GET') return send(res, 200, { rev, docs });
  if (p === '/api/db/changes' && req.method === 'GET') {
    const since = Number(u.searchParams.get('since') || 0);
    if (since < rev) return send(res, 200, changesSince(since));
    let done = false; const fin = () => { if (done) return; done = true; waiters.delete(fin); clearTimeout(t); send(res, 200, changesSince(since)); };
    const t = setTimeout(fin, 25000); waiters.add(fin); req.on('close', () => { done = true; waiters.delete(fin); clearTimeout(t); });
    return;
  }
  if (p === '/api/db/write' && req.method === 'POST') {
    const { op, path: dp, data } = await readJSON(req, 20 * 1024 * 1024);
    if (!validDocPath(dp)) return fail(res, 400, 'invalid_argument', 'Неверный путь документа');
    if (op === 'set') { if (!data || typeof data !== 'object') return fail(res, 400, 'invalid_argument', 'Нет данных'); docs[dp] = data; }
    else if (op === 'update') { if (!docs[dp]) return fail(res, 404, 'not_found', 'Документ не найден'); docs[dp] = { ...docs[dp], ...data }; }
    else if (op === 'delete') delete docs[dp];
    else return fail(res, 400, 'invalid_argument', 'Неизвестная операция');
    changed(dp); return send(res, 200, { rev });
  }

  if (p === '/api/assets' && req.method === 'POST') {
    const buf = await readBody(req, 25 * 1024 * 1024); const id = crypto.randomBytes(16).toString('hex');
    const type = String(u.searchParams.get('type') || req.headers['content-type'] || 'application/octet-stream').slice(0, 120);
    fs.writeFileSync(path.join(DATA, 'blobs', id), buf);
    fs.writeFileSync(path.join(DATA, 'blobs', id + '.json'), JSON.stringify({ type, size: buf.length, name: String(u.searchParams.get('name') || '').slice(0, 300), at: new Date().toISOString() }));
    return send(res, 200, { id, url: '/_blob/' + id, sizeBytes: buf.length, contentType: type });
  }
  if (p === '/api/assets' && req.method === 'GET') {
    const list = fs.readdirSync(path.join(DATA, 'blobs')).filter(f => f.endsWith('.json')).map(f => { const m = JSON.parse(fs.readFileSync(path.join(DATA, 'blobs', f), 'utf8')); const id = f.slice(0, -5); return { id, url: '/_blob/' + id, sizeBytes: m.size, contentType: m.type, name: m.name }; });
    return send(res, 200, { assets: list, usage: { count: list.length, bytes: list.reduce((s, x) => s + (x.sizeBytes || 0), 0) } });
  }
  let m;
  if ((m = p.match(/^\/api\/assets\/([0-9a-f]{32})$/)) && req.method === 'DELETE') {
    for (const f of [m[1], m[1] + '.json']) { try { fs.unlinkSync(path.join(DATA, 'blobs', f)); } catch {} }
    return send(res, 200, { deleted: true });
  }
  if ((m = p.match(/^\/_blob\/([0-9a-f]{32})$/))) {
    const f = path.join(DATA, 'blobs', m[1]); if (!BLOB_ID.test(m[1]) || !fs.existsSync(f)) return fail(res, 404, 'not_found', 'Файл не найден');
    let meta = {}; try { meta = JSON.parse(fs.readFileSync(f + '.json', 'utf8')); } catch {}
    // загруженные файлы не исполняются как страницы этого сайта (PDF открывается встроенным просмотрщиком браузера)
    const pdf = meta.type === 'application/pdf';
    res.writeHead(200, { 'Content-Type': meta.type || 'application/octet-stream', 'Cache-Control': 'private, max-age=86400', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': pdf ? "default-src 'none'; object-src 'self'" : "default-src 'none'; style-src 'unsafe-inline'; sandbox" });
    return fs.createReadStream(f).pipe(res);
  }

  if (p === '/api/ai' && req.method === 'POST') {
    if (!AI_KEY) return fail(res, 503, 'not_configured', 'ИИ не настроен: на сервере не задан ключ ANTHROPIC_API_KEY.');
    const body = await readJSON(req, 30 * 1024 * 1024);
    const payload = { model: body.tier === 'quick' ? AI_MODEL_QUICK : AI_MODEL, max_tokens: Math.min(Number(body.max_tokens) || AI_MAX_TOKENS, 32000), messages: body.messages };
    if (Array.isArray(body.tools) && body.tools.length) payload.tools = body.tools;
    const ctl = new AbortController(); req.on('close', () => { if (!res.writableEnded) ctl.abort(); });
    const timer = setTimeout(() => ctl.abort(), 10 * 60 * 1000);
    try {
      const r = await fetch(AI_BASE + '/v1/messages', { method: 'POST', signal: ctl.signal, headers: { 'content-type': 'application/json', 'x-api-key': AI_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify(payload) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) return send(res, 200, { content: j.content || [], stop_reason: j.stop_reason, model: j.model });
      const msg = (j.error && j.error.message) || ('HTTP ' + r.status);
      console.error('Ошибка ИИ', r.status, msg);
      if (r.status === 401 || r.status === 403) return fail(res, 502, 'not_configured', 'Ключ ИИ не принят. Проверьте ANTHROPIC_API_KEY на сервере.');
      if (r.status === 429) return fail(res, 429, 'rate_limited', 'Слишком много запросов к ИИ. Подождите и повторите.');
      if (r.status >= 500) return fail(res, 502, 'overloaded', 'Сервис ИИ временно недоступен. Повторите позже.');
      return fail(res, 502, 'bad_request', 'ИИ отклонил запрос: ' + msg);
    } catch (e) {
      if (ctl.signal.aborted) return res.writableEnded || fail(res, 499, 'cancelled', 'Остановлено.');
      console.error('Нет связи с ИИ:', e.message);
      return fail(res, 502, 'network', 'Сервер не может связаться с ' + AI_BASE + '. Проверьте выход в интернет или прокси.');
    } finally { clearTimeout(timer); }
  }

  if (p.startsWith('/api/')) return fail(res, 404, 'not_found', 'Нет такого метода');
  // статика
  const rel = p === '/' ? 'index.html' : p.replace(/^\/+/, '');
  const f = path.resolve(PUB, rel);
  if (!f.startsWith(PUB + path.sep) || !fs.existsSync(f) || !fs.statSync(f).isFile()) return send(res, 404, 'Не найдено', 'text/plain; charset=utf-8');
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': rel === 'index.html' ? 'no-cache' : 'public, max-age=3600', 'X-Content-Type-Options': 'nosniff' });
  fs.createReadStream(f).pipe(res);
}

http.createServer((req, res) => handle(req, res).catch(e => { console.error(e); if (!res.headersSent) fail(res, e.status || 500, 'server_error', e.message || 'Ошибка сервера'); }))
  .listen(PORT, HOST, () => {
    console.log(`AI-экосистема Садыхан: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log('Данные: ' + DATA);
    console.log(AI_KEY ? `ИИ: включён (${AI_MODEL})` : 'ИИ: выключен — задайте ANTHROPIC_API_KEY в config.json или переменной окружения');
    if (!BASIC_AUTH) console.log('Внимание: вход по паролю не включён (BASIC_AUTH). Ограничьте доступ к серверу сетью компании.');
  });
