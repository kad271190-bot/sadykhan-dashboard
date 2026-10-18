#!/usr/bin/env node
// Автотест страницы экосистемы: синтаксис, все роли × разделы × вкладки агентов, ошибки JS, ширина на телефоне.
// Использование: node check-page.js [путь к html] [папка с JSON реальных данных для заглушки базы]
// Код возврата 0 — всё чисто, 1 — есть ошибки.
const fs = require('fs'), path = require('path'), os = require('os'), { execSync } = require('child_process');
const html = path.resolve(process.argv[2] || 'demo/sadykhan-ai-ecosystem.html');
const dataDir = process.argv[3];
const fails = [];
// 1. Синтаксис основного скрипта
const src = fs.readFileSync(html, 'utf8'); const scripts = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const tmp = path.join(os.tmpdir(), 'eco-check-' + process.pid + '.js'); fs.writeFileSync(tmp, scripts[scripts.length - 1][1]);
try { execSync(`node --check "${tmp}"`, { stdio:'pipe' }); } catch (e) { fails.push('Синтаксис: ' + String(e.stderr).split('\n').slice(0, 4).join(' ')); }
fs.unlinkSync(tmp);
// 2. Заглушка базы страницы (если передана папка с JSON — подставляется как коллекция proc)
const docs = {};
if (dataDir && fs.existsSync(dataDir)) for (const f of fs.readdirSync(dataDir)) if (f.endsWith('.json')) docs[f.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport:{ width:1360, height:900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(d => {
    const store = { proc:d }; const snap = c => ({ docs:Object.entries(store[c] || {}).map(([id, v]) => ({ id, data:() => v })) });
    const db = { collection:c => ({ onSnapshot:cb => { setTimeout(() => cb(snap(c)), 10); return () => {}; } }),
      doc:p => ({ onSnapshot:cb => { setTimeout(() => cb({ exists:false, data:() => ({}) }), 10); return () => {}; }, set:async () => {}, update:async () => {}, get:async () => ({ exists:false }) }) };
    window.claude = { use:async n => n === 'db' && Object.keys(d).length ? db : n === 'user' ? { id:async () => 'u_test', isOwner:async () => true } : null };
  }, docs);
  await pg.goto('file://' + html); await pg.waitForTimeout(1200);
  const out = await pg.evaluate(() => { const bad = []; const chk = (tag) => { const v = document.getElementById('view').innerText; const m = v.match(/.{0,30}(undefined|NaN|\[object [A-Za-z]+\]).{0,20}/); if (m) bad.push(tag + ' → ' + m[0].replace(/\s+/g, ' ')); };
    const pages = ['home', 'agents', 'mozg', 'cases', 'tasks', 'docs', 'soplist', 'council', 'network', 'assort', 'tests', 'quality', 'sandbox', 'data'].filter(p => V[p]);
    if (V.proc) pages.push('proc');
    const tabs = ['profile', 'daily', 'plan', 'sources', 'results', 'report', 'ask'];
    for (const role of Object.keys(ROLES)) { S.role = role;
      for (const p of pages) { try { go({ page:p }); chk(role + ' / ' + p); } catch (e) { bad.push(role + ' / ' + p + ' ✕ ' + e.message); } }
      if (V.proc && typeof PROC !== 'undefined') for (const t of ['over', 'find', 'checks', 'contracts', 'price', 'tasks', 'hist']) { PROC.tab = t; try { go({ page:'proc' }); chk(role + ' / proc:' + t); } catch (e) { bad.push(role + ' / proc:' + t + ' ✕ ' + e.message); } }
      for (const d of DIRS) { try { go({ page:'dir', id:d.id }); chk(role + ' / dir:' + d.id); } catch (e) { bad.push(role + ' / dir:' + d.id + ' ✕ ' + e.message); } }
      for (const a of AGENTS) for (const t of tabs) { S.agentTab = t; try { go({ page:'agent', id:a.id }); chk(role + ' / ' + a.id + ':' + t); } catch (e) { bad.push(role + ' / ' + a.id + ':' + t + ' ✕ ' + e.message); } } }
    // ограничение роли: руководитель розницы не открывает профиль корпоративного агента
    S.role = 'retail'; S.agentTab = 'profile'; go({ page:'agent', id:'FIN' }); const denied = /Нет доступа/.test(document.getElementById('view').innerText);
    S.role = 'ctl'; go({ page:'home' });
    return { bad, denied, agents:AGENTS.length }; });
  fails.push(...out.bad.slice(0, 40)); if (!out.denied) fails.push('Роли: руководитель розницы видит профиль корпоративного агента FIN');
  await pg.setViewportSize({ width:390, height:844 });
  for (const p of ['home', 'agents', 'proc', 'docs']) { const w = await pg.evaluate(p => { if (!V[p]) return 0; go({ page:p }); return document.documentElement.scrollWidth; }, p); if (w > 391) fails.push(`Телефон: раздел ${p} шире экрана (${w}px)`); }
  const w2 = await pg.evaluate(() => { S.agentTab = 'daily'; go({ page:'agent', id:'RET' }); return document.documentElement.scrollWidth; }); if (w2 > 391) fails.push(`Телефон: профиль агента шире экрана (${w2}px)`);
  fails.push(...[...new Set(errs)].slice(0, 10).map(e => 'Ошибка JS: ' + e));
  await b.close();
  console.log(`Агентов: ${out.agents}; реальные данные в заглушке: ${Object.keys(docs).length ? 'да' : 'нет'}`);
  if (fails.length) { console.log('ПРОВЕРКА НЕ ПРОЙДЕНА:\n- ' + fails.join('\n- ')); process.exit(1); }
  console.log('ПРОВЕРКА ПРОЙДЕНА: синтаксис, все роли и разделы, профили агентов, ограничение роли, ширина на телефоне.');
})().catch(e => { console.error('Сбой теста:', e.message); process.exit(1); });
