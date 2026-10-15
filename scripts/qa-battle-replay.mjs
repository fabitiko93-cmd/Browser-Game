import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, chmod } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { createGame, getPlanet, makeStock } from '../src/state.js';
import { orderFleet, resolveBattle } from '../src/fleets.js';
import { beginWar } from '../src/realm-relations.js';
import { validateSave } from '../src/save.js';

const root = resolve(import.meta.dirname, '..'), output = process.env.ORBIT_QA_OUTPUT_DIR ?? resolve(root, 'review-replay');
let playwright; try { playwright = await import('playwright'); } catch (error) { if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error; playwright = createRequire(resolve(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '../package.json'))('playwright'); }
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.wasm': 'application/wasm', '.json': 'application/json', '.glb': 'model/gltf-binary', '.mp3': 'audio/mpeg' };
const server = createServer(async (req, res) => { try { const u = new URL(req.url, 'http://localhost'), path = resolve(root, 'docs', '.' + (u.pathname === '/' ? '/index.html' : u.pathname)); if (!path.startsWith(resolve(root, 'docs') + '/')) throw Error('path'); const bytes = await readFile(path); res.writeHead(200, { 'Content-Type': mime[extname(path)] ?? 'application/octet-stream', 'Content-Length': bytes.length }); res.end(bytes); } catch { res.writeHead(404); res.end('Not found'); } });
await new Promise(done => server.listen(0, '127.0.0.1', done));
const base = (process.env.ORBIT_QA_BASE_URL ?? `http://127.0.0.1:${server.address().port}`).replace(/\/$/, ''), executable = process.env.ORBIT_BROWSER_EXECUTABLE;
if (executable) await chmod(executable, 0o755);
const browser = await playwright.chromium.launch({ executablePath: executable, headless: true, proxy: process.env.ORBIT_QA_USE_PROXY ? { server: process.env.HTTPS_PROXY } : undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
await mkdir(output, { recursive: true });
const checks = [], errors = [], scales = [], key = 'orbit3077-save';
const pass = label => { checks.push(label); console.log('PASS', label); };
function fixture(own = 5, enemy = 5, capture = true, arrival = false, defends = false) {
  const s = createGame({ legacy: true }); s.started = true; s.fleets = [];
  const p = getPlanet(s, defends ? 'nereid' : 'veyra'), attacker = defends ? 'aster' : 'player', defender = p.owner;
  beginWar(s, attacker, defender); p.defense = 8; p.garrison = 30;
  const add = (id, type, owner, planetId) => { const f = { id, name: id, type, owner, planetId, hp: 100, supply: 100, cargo: makeStock(), mission: null, route: null }; s.fleets.push(f); return f; };
  const attackers = [];
  for (let i = 0; i < (defends ? enemy : own); i++) attackers.push(add(`Attacker-${i + 1}`, i % 3 === 0 ? 'destroyer' : 'cruiser', attacker, arrival ? 'nereid' : p.id));
  if (capture) attackers.push(add('Landing-1', 'lander', attacker, arrival ? 'nereid' : p.id));
  for (let i = 0; i < (defends ? own : enemy); i++) add(`Guard-${i + 1}`, i % 3 === 0 ? 'destroyer' : 'corvette', defender, p.id);
  if (arrival) {
    getPlanet(s, 'nereid').stock.energy = 5000; assert.equal(orderFleet(s, attackers.map(f => f.id), p.id, 'attack'), null);
    for (const f of attackers) f.mission.remaining = 1;
    s.dayProgress = .999;
  } else resolveBattle(s, attackers, p);
  validateSave(s); return s;
}
async function surface(state, width = 390, height = 844) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, hasTouch: true, isMobile: true, ignoreHTTPSErrors: true, serviceWorkers: 'block' });
  await context.addInitScript(raw => { if (!localStorage.getItem('orbit3077-save')) localStorage.setItem('orbit3077-save', raw); }, JSON.stringify(state));
  const page = await context.newPage(); page.setDefaultTimeout(60000);
  page.on('pageerror', error => { errors.push(error.message); console.log('ERROR', error.message); });
  page.on('console', message => { if (message.type() === 'error' && /Shader Error|Battle replay:/.test(message.text())) { errors.push(message.text()); console.log('ERROR', message.text().slice(0, 400)); } });
  // Preserve normal navigation while making the opt-in test inspection available.
  await page.route('**/*', route => { const url = new URL(route.request().url()); if (route.request().isNavigationRequest() && (url.pathname.endsWith('/battle-replay.html') || url.searchParams.get('view') === 'battles') && !url.searchParams.has('debug')) { url.searchParams.set('debug', '1'); return route.fulfill({ status: 302, headers: { Location: url.href }, body: '' }); } return route.continue(); });
  return { context, page };
}
async function loaded(page) {
  await page.waitForURL(/battle-replay\.html/);
  try { await page.waitForFunction(() => globalThis.ORBIT_REPLAY_DEBUG?.ready || !document.getElementById('battle-error').hidden, null, { timeout: 120000 }); } catch (error) { console.log('LOAD STATE', page.url(), await page.evaluate(() => ({ ready: globalThis.ORBIT_REPLAY_DEBUG?.ready, progress: document.getElementById('loading-progress')?.textContent, loading: document.getElementById('battle-loading')?.hidden, error: document.getElementById('battle-error-text')?.textContent }))); throw error; }
  assert.equal(await page.evaluate(() => ORBIT_REPLAY_DEBUG.ready), true, await page.locator('#battle-error-text').innerText());
  await page.evaluate(() => ORBIT_REPLAY_DEBUG.pause());
  await page.waitForFunction(() => !ORBIT_REPLAY_DEBUG.view.transition && !ORBIT_REPLAY_DEBUG.view.dirty);
}
async function inspect(page) {
  return page.evaluate(() => {
    const d = ORBIT_REPLAY_DEBUG, v = d.view, b = d.battle;
    return { mode: v.mode, own: b.ships.filter(s => !s.installation && s.side === 'friendly').length, enemy: b.ships.filter(s => !s.installation && s.side === 'enemy').length, installations: b.ships.filter(s => s.installation).length,
      capacity: v.contactPoints.geometry.attributes.side.count, exhaust: v.coreBatch.instanceMatrix.count, calls: v.renderer.info.render.calls, triangles: v.renderer.info.render.triangles, guns: v.gunBatch.count,
      fraction: (v.viewportBottom - v.viewportTop) / innerHeight, scroll: document.body.scrollWidth, width: innerWidth,
      clipped: b.ships.filter(s => !s.escaped && s.hull > 0).map(s => { const p = v.a.fromArray(s.position).project(v.camera); return { id: s.id, x: (p.x + 1) * innerWidth / 2, y: (1 - p.y) * innerHeight / 2, z: p.z }; }).filter(p => p.x < 0 || p.x > innerWidth || p.y < v.viewportTop || p.y > v.viewportBottom || p.z < -1 || p.z > 1),
      memory: { ...v.renderer.info.memory }, controls: [...document.querySelectorAll('.lab-top button,.lab-bottom button')].map(n => ({ id: n.id, height: n.getBoundingClientRect().height })) };
  });
}
try {
  let first, second, fire;
  if (!process.env.ORBIT_QA_SCALE_ONLY) {
  const initial = fixture(5, 5, true, true), { context, page } = await surface(initial);
  await page.goto(base + '/?debug=1', { waitUntil: 'domcontentloaded' }); await page.waitForFunction(() => Boolean(globalThis.ORBIT_DEBUG));
  assert.equal(await page.evaluate(() => ORBIT_DEBUG.state.battleReports.length), 0);
  await page.locator('[data-action="speed-toggle"]').click();
  await page.waitForFunction(() => ORBIT_DEBUG.state.battleReports.length === 1 && ORBIT_DEBUG.ui.speed === 0);
  assert.equal(await page.evaluate(() => ORBIT_DEBUG.ui.fleetMode), 'battles');
  await page.locator('[data-action="battle-open"]').waitFor();
  const saved = await page.evaluate(key => localStorage.getItem(key), key), report = JSON.parse(saved).battleReports[0];
  assert.equal(report.ships.length, 11); assert.equal(report.captured, true); assert.equal(report.ships.find(s => s.type === 'lander').outcome, 'landed');
  pass('Actual attack arrival pauses the empire and opens the new battle archive with the authoritative conquest');
  await page.locator('[data-action="battle-open"]').click(); await loaded(page);
  first = await inspect(page); assert.equal(first.mode, 'overview'); assert.equal(first.own, 6); assert.equal(first.enemy, 5); assert.equal(first.installations, 1); assert.equal(first.guns, 0);
  assert.ok(first.fraction >= .8); assert.equal(first.scroll, first.width); assert.deepEqual(first.clipped, []); assert.ok(first.controls.every(b => b.height >= 44));
  assert.equal(await page.locator('#commands-open').count(), 0); assert.equal(await page.evaluate(key => localStorage.getItem(key), key), saved);
  await page.screenshot({ path: resolve(output, 'real-battle-overview.png'), timeout: 60000 });
  pass('Real participants enter the accepted 3D camera; orbital defense is separate and the viewer writes no save data');
  const moved = await page.evaluate(() => { const d = ORBIT_REPLAY_DEBUG, before = d.view.camera.position.toArray(); return { before, elapsed: d.battle.elapsed }; });
  const cdp = await context.newCDPSession(page); await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 220, y: 320, id: 1 }] });
  for (let i = 1; i <= 5; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 220 + i * 5, y: 320 + i * 4, id: 1 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForFunction(() => !ORBIT_REPLAY_DEBUG.view.dirty);
  assert.notDeepEqual(await page.evaluate(() => ORBIT_REPLAY_DEBUG.view.camera.position.toArray()), moved.before);
  assert.equal(await page.evaluate(() => ORBIT_REPLAY_DEBUG.battle.elapsed), moved.elapsed);
  await page.evaluate(() => ORBIT_REPLAY_DEBUG.setCamera('overview', false));
  fire = await page.evaluate(() => { const events = ORBIT_REPLAY_DEBUG.advance(8); return events.reduce((a, e) => ({ ...a, [e.kind]: (a[e.kind] ?? 0) + 1 }), {}); });
  assert.ok(fire.fire > 0 && fire.impact > 0); await page.screenshot({ path: resolve(output, 'real-battle-fire.png'), timeout: 60000 });
  await page.locator('#fleet-open').click(); await page.locator('[data-ship="Attacker-2"]').click(); await page.locator('#inspect-selected').click();
  await page.waitForFunction(() => !ORBIT_REPLAY_DEBUG.view.transition); await page.screenshot({ path: resolve(output, 'real-harbinger-close.png'), timeout: 60000 });
  assert.equal(await page.evaluate(() => ORBIT_REPLAY_DEBUG.view.ships.get('Attacker-2').engines.length), 5);
  pass('Touch camera, ship selection, native Harbinger close view and actual bow salvos work while the empire stays paused');
  await page.evaluate(() => { ORBIT_REPLAY_DEBUG.setCamera('overview', false); ORBIT_REPLAY_DEBUG.advance(28); });
  const end = await page.evaluate(() => ({ phase: ORBIT_REPLAY_DEBUG.battle.phase, ships: ORBIT_REPLAY_DEBUG.battle.ships.filter(s => s.record).map(s => ({ id: s.id, hull: s.hull, escaped: s.escaped, outcome: s.record.outcome })) }));
  assert.equal(end.phase, 'recorded'); assert.ok(end.ships.find(s => s.id === 'Landing-1').escaped);
  assert.equal(await page.evaluate(key => localStorage.getItem(key), key), saved);
  await page.locator('#report-open').click(); assert.match(await page.locator('#report-result').innerText(), /Planet erobert/); assert.match(await page.locator('#report-totals').innerText(), /Als Garnison eingesetzt/);
  await page.locator('#replay-again').click(); await loaded(page); second = await inspect(page); assert.deepEqual(second.memory, first.memory);
  assert.equal(await page.evaluate(key => localStorage.getItem(key), key), saved);
  await page.locator('.lab-top>a').click(); await page.waitForFunction(() => globalThis.ORBIT_DEBUG?.ui.fleetMode === 'battles');
  assert.equal(await page.evaluate(() => ORBIT_DEBUG.state.planets.find(p => p.id === 'veyra').owner), 'player'); assert.equal(await page.evaluate(() => ORBIT_DEBUG.state.battleReports.length), 1);
  assert.equal(await page.evaluate(() => ORBIT_DEBUG.state.fleets.some(f => f.id === 'Landing-1')), false);
  pass('Conquest, losses and garrison survive replay, restart and return without duplicate settlement or GPU resource growth'); await context.close();
  }
  for (const [own, enemy, width, height] of [[5,35,390,844],[35,5,320,568],[50,50,390,844]]) {
    const s = fixture(own, enemy, false), { context, page } = await surface(s, width, height), r = s.battleReports[0];
    await page.goto(`${base}/battle-replay.html?battle=${r.id}&debug=1`, { waitUntil: 'domcontentloaded' }); await loaded(page);
    const info = await inspect(page); console.log('SCALE',JSON.stringify({own,enemy,calls:info.calls,triangles:info.triangles})); assert.equal(info.own, own); assert.equal(info.enemy, enemy); assert.ok(info.capacity >= own + enemy + 1); assert.ok(info.exhaust >= (own + enemy + 1) * 5);
    assert.deepEqual(info.clipped, []); assert.equal(info.width, info.scroll); assert.ok(info.fraction >= .8); assert.ok(info.calls < 70); assert.ok(info.triangles < 320000); assert.ok(info.controls.every(b => b.height >= 44));
    await page.locator('#fleet-open').click(); assert.ok(await page.locator('#participant-list>button').count() <= 12); await page.locator('[data-side="enemy"]').click(); assert.ok(await page.locator('#participant-list>button').count() <= 12);
    await page.locator('[data-close="participants-dialog"]').click();
    await page.screenshot({ path: resolve(output, `real-${own}v${enemy}-${width}.png`), timeout: 60000 }); scales.push({ own, enemy, ...info }); await context.close();
  }
  pass('Real 5:35, 35:5 and 50:50 battles fit portrait screens with bounded contact lists and correctly sized GPU buffers');
  const defensive = fixture(0, 4, true, false, true), defenseSurface = await surface(defensive, 320, 568);
  await defenseSurface.page.goto(`${base}/?view=battles&debug=1`, { waitUntil: 'domcontentloaded' }); await defenseSurface.page.locator('[data-action="battle-open"]').click(); await loaded(defenseSurface.page);
  assert.equal(await defenseSurface.page.locator('#friendly-count').innerText(), '0'); await defenseSurface.page.locator('#report-open').click(); assert.equal(await defenseSurface.page.locator('#report-result').innerText(), 'Planet verloren');
  await defenseSurface.page.screenshot({ path: resolve(output, 'last-colony-report.png'), timeout: 60000 }); await defenseSurface.context.close();
  pass('Even a lost final colony with zero defending ships has a readable report and working 3D entry');
  const missing = await surface(createGame({ legacy: true })); await missing.page.goto(base + '/battle-replay.html?battle=missing&debug=1'); await missing.page.locator('#battle-error').waitFor();
  assert.match(await missing.page.locator('#battle-error-text').innerText(), /nicht in diesem Browser/); assert.ok(await missing.page.locator('#retry').isHidden()); await missing.context.close();
  pass('Missing recordings show an explicit empty state instead of inventing a demo battle');
  assert.deepEqual(errors, []); await writeFile(resolve(output, 'browser-inspection.json'), JSON.stringify({ base, checks, first, second, fire, scales, errors }, null, 2)); console.log(JSON.stringify({ checks: checks.length, scales: scales.map(s => ({ own: s.own, enemy: s.enemy, calls: s.calls, triangles: s.triangles })), errors }));
} finally { await browser.close(); server.close(); }
