// Локальная замена возможностей Claude для автономной работы на сервере компании.
// Даёт странице тот же интерфейс window.claude.use(name): db, assets, user, downloads, sample.
// Данные хранятся на сервере (server.js), ИИ-запросы идут через сервер с ключом, заданным IT.
(function () {
  'use strict';
  const err = (code, message) => Object.assign(new Error(message), { code });
  async function api(url, opts) {
    let r;
    try { r = await fetch(url, opts); }
    catch (e) { if (e && e.name === 'AbortError') throw err('cancelled', 'Остановлено.'); throw err('network', 'Нет связи с сервером платформы.'); }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw err(j.code || 'server_error', j.message || ('Ошибка сервера ' + r.status));
    return j;
  }
  const clone = x => x === undefined ? undefined : JSON.parse(JSON.stringify(x));
  const info = api('/api/info').catch(() => ({ ai: false }));

  // ── db: документы по путям, изменения приходят длинным опросом
  const store = {}; let rev = 0; const subs = new Set();
  const notify = () => subs.forEach(f => { try { f(); } catch (e) { console.error(e); } });
  const ready = api('/api/db/all').then(j => { Object.assign(store, j.docs); rev = j.rev; poll(); });
  async function poll() {
    for (;;) {
      try {
        const j = await api('/api/db/changes?since=' + rev);
        if (j.reset) { for (const k of Object.keys(store)) delete store[k]; Object.assign(store, j.docs); }
        else for (const [k, v] of Object.entries(j.changes || {})) { if (v === null) delete store[k]; else store[k] = v; }
        if (j.rev !== rev) { rev = j.rev; notify(); }
      } catch { await new Promise(r => setTimeout(r, 3000)); }
    }
  }
  async function write(op, p, data) {
    await ready;
    if (op === 'update' && !store[p]) throw err('not_found', 'Документ не найден');
    await api('/api/db/write', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ op, path: p, data }) });
    if (op === 'set') store[p] = clone(data); else if (op === 'update') store[p] = { ...store[p], ...clone(data) }; else delete store[p];
    notify();
  }
  const snapDoc = p => { const v = store[p]; return { id: p.split('/').pop(), ref: docRef(p), exists: v !== undefined, data: () => clone(v), get: f => v && clone(v[f]), metadata: { hasPendingWrites: false, fromCache: false } }; };
  const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(10)), b => 'abcdefghijklmnopqrstuvwxyz0123456789'[b % 36]).join('');
  function watch(compute, next) {
    let last = null, alive = true;
    const f = () => { if (!alive) return; const s = compute(); const key = JSON.stringify(s.key); if (key !== last) { last = key; next(s.snap); } };
    ready.then(() => { subs.add(f); f(); });
    return () => { alive = false; subs.delete(f); };
  }
  function docRef(p) {
    return {
      id: p.split('/').pop(), path: p,
      get: async () => { await ready; return snapDoc(p); },
      set: d => write('set', p, d), update: d => write('update', p, d), delete: () => write('delete', p),
      onSnapshot: (next, onErr) => watch(() => ({ key: store[p] === undefined ? null : store[p], snap: snapDoc(p) }), next),
      collection: c => colRef(p + '/' + c)
    };
  }
  const OPS = { '==': (a, b) => a === b, '!=': (a, b) => a !== b, '<': (a, b) => a < b, '<=': (a, b) => a <= b, '>': (a, b) => a > b, '>=': (a, b) => a >= b,
    'in': (a, b) => (b || []).includes(a), 'not-in': (a, b) => !(b || []).includes(a), 'array-contains': (a, b) => Array.isArray(a) && a.includes(b) };
  function colRef(p, q = { w: [], o: null, l: 0 }) {
    const n = p.split('/').length;
    const ids = () => {
      let ks = Object.keys(store).filter(k => k.startsWith(p + '/') && k.split('/').length === n + 1)
        .filter(k => q.w.every(([f, op, v]) => (OPS[op] || OPS['=='])(store[k][f], v))).sort();
      if (q.o) { const [f, dir] = q.o; ks.sort((a, b) => { const x = store[a][f], y = store[b][f]; return (x < y ? -1 : x > y ? 1 : 0) * (dir === 'desc' ? -1 : 1); }); }
      return q.l ? ks.slice(0, q.l) : ks;
    };
    const snap = () => { const d = ids().map(snapDoc); return { docs: d, size: d.length, empty: !d.length, forEach: f => d.forEach(f), docChanges: () => [], metadata: { fromCache: false } }; };
    return {
      id: p.split('/').pop(), path: p,
      doc: id => docRef(p + '/' + (id || rid())),
      add: async d => { const r = docRef(p + '/' + rid()); await r.set(d); return r; },
      where: (f, op, v) => colRef(p, { ...q, w: [...q.w, [f, op, v]] }),
      orderBy: (f, dir) => colRef(p, { ...q, o: [f, dir || 'asc'] }),
      limit: k => colRef(p, { ...q, l: k }),
      get: async () => { await ready; return snap(); },
      onSnapshot: (next, onErr) => watch(() => { const ks = ids(); return { key: ks.map(k => [k, store[k]]), snap: snap() }; }, next)
    };
  }
  const db = Object.freeze({ doc: p => docRef(p), collection: p => colRef(p) });

  // ── assets: файлы на сервере, отдаются по /_blob/<id>
  const assets = Object.freeze({
    upload: async (blob, o) => { const type = (o && o.type) || blob.type || 'application/octet-stream';
      return api('/api/assets?type=' + encodeURIComponent(type) + '&name=' + encodeURIComponent((o && o.name) || blob.name || ''), { method: 'POST', headers: { 'content-type': type }, body: blob }); },
    list: () => api('/api/assets'),
    delete: id => api('/api/assets/' + encodeURIComponent(id), { method: 'DELETE' })
  });

  // ── user: сотрудник определяется браузером; права ролей задаёт сама страница (выбор роли)
  let uid = null; try { uid = localStorage.getItem('sadykhan_uid'); } catch {}
  if (!uid) { uid = 'u_' + rid() + rid(); try { localStorage.setItem('sadykhan_uid', uid); } catch {} }
  const user = Object.freeze({ id: async () => uid, me: async () => ({ id: uid, name: '' }), isOwner: async () => true, canEdit: async () => true, can: async () => true, profiles: async () => ({}), search: async () => [] });

  // ── downloads: обычное скачивание файла браузером
  const downloads = Object.freeze({ save: async ({ filename, data }) => {
    const blob = data instanceof Blob ? data : new Blob([data]); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename || 'file'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000); return { status: 'saved' };
  } });

  // ── sample: ИИ через сервер; функции страницы (tools) выполняются здесь, в браузере
  const IMG_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  async function imageBlock(blob) {
    let out = blob;
    try { const bmp = await createImageBitmap(blob); const k = Math.min(1, 1568 / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height); out = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.88)); } catch {}
    const u = new Uint8Array(await out.arrayBuffer()); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    return { type: 'image', source: { type: 'base64', media_type: out.type || 'image/jpeg', data: btoa(s) } };
  }
  async function sample(input, opts = {}) {
    if (!(await info).ai) throw err('not_configured', 'ИИ не настроен на сервере.');
    if (opts.signal && opts.signal.aborted) throw err('cancelled', 'Остановлено.');
    const messages = typeof input === 'string' ? [{ role: 'user', content: input }] : input.map(m => ({ role: m.role, content: m.content }));
    if (opts.images && opts.images.length) { const last = messages[messages.length - 1];
      last.content = [...await Promise.all(opts.images.map(imageBlock)), { type: 'text', text: String(last.content) }]; }
    const tools = opts.tools || [];
    const defs = tools.map(t => ({ name: t.name, description: t.description || '', input_schema: t.inputSchema || { type: 'object', properties: {} } }));
    let text = '', truncated = false;
    for (let round = 0; round < 20; round++) {
      const r = await api('/api/ai', { method: 'POST', signal: opts.signal, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ tier: opts.modelTier, messages, tools: defs }) });
      const blocks = r.content || []; const t = blocks.filter(b => b.type === 'text').map(b => b.text).join('');
      if (t) { text += (text ? '\n\n' : '') + t; opts.onText && opts.onText({ text, delta: t }); }
      if (r.stop_reason !== 'tool_use') { truncated = r.stop_reason === 'max_tokens'; break; }
      messages.push({ role: 'assistant', content: blocks });
      const results = [];
      for (const b of blocks.filter(x => x.type === 'tool_use')) {
        const tool = tools.find(x => x.name === b.name); let out, isErr = false;
        try { if (!tool) throw new Error('нет такой функции'); out = await tool.execute(b.input || {}); } catch (e) { out = 'Ошибка: ' + ((e && e.message) || e); isErr = true; }
        let s = typeof out === 'string' ? out : JSON.stringify(out === undefined ? null : out); if (s.length > 150000) s = s.slice(0, 150000) + '…[обрезано]';
        results.push({ type: 'tool_result', tool_use_id: b.id, content: s, is_error: isErr });
      }
      messages.push({ role: 'user', content: results });
    }
    return { text, truncated };
  }
  sample.json = async (input, opts = {}) => {
    const add = '\n\nВерни только корректный JSON, без пояснений и без разметки markdown.';
    const inp = typeof input === 'string' ? input + add : input.map((m, i) => i === input.length - 1 ? { ...m, content: m.content + add } : m);
    const { text } = await sample(inp, opts);
    let s = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
    try { return JSON.parse(s); } catch {}
    const a = s.search(/[\[{]/), b = Math.max(s.lastIndexOf('}'), s.lastIndexOf(']'));
    if (a >= 0 && b > a) { try { return JSON.parse(s.slice(a, b + 1)); } catch {} }
    throw Object.assign(err('invalid_json', 'ИИ вернул ответ не в формате JSON.'), { text });
  };
  sample.limits = async () => ({ maxPromptBytes: 262144, tools: true, images: { maxCount: 8, maxInputBytes: 20 * 1024 * 1024, mediaTypes: IMG_TYPES } });

  const caps = { db, assets, user, downloads };
  window.claude = Object.freeze({ local: true, use: async name => {
    if (name === 'sample') return (await info).ai ? sample : null;
    if (name in caps) { if (name === 'db') await ready.catch(() => null); return caps[name]; }
    return null;
  } });
})();
