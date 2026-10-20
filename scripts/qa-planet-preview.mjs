import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, chmod } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { createGame } from '../src/state.js';

const root = resolve(import.meta.dirname, '..'), output = process.env.ORBIT_QA_OUTPUT_DIR ?? resolve(root, 'review/planet');
let playwright;
try { playwright = await import('playwright'); }
catch (error) { if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error; playwright = createRequire(resolve(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '../package.json'))('playwright'); }
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.glb': 'model/gltf-binary', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://localhost'), path = resolve(root, 'docs', '.' + (u.pathname === '/' ? '/index.html' : u.pathname));
    if (!path.startsWith(resolve(root, 'docs') + '/')) throw Error('path');
    const bytes = await readFile(path); res.writeHead(200, { 'Content-Type': mime[extname(path)] ?? 'application/octet-stream', 'Content-Length': bytes.length }); res.end(bytes);
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const base = (process.env.ORBIT_QA_BASE_URL ?? `http://127.0.0.1:${server.address().port}`).replace(/\/$/, '');
const executable = process.env.ORBIT_BROWSER_EXECUTABLE; if (executable) await chmod(executable, 0o755);
const browser = await playwright.chromium.launch({ executablePath: executable, headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const errors = [], checks = [], inspections = [], requests = new Set();
await mkdir(output, { recursive: true });
const pass = message => { checks.push(message); console.log('PASS', message); };
const original = JSON.stringify(createGame({ seed: 3077 }));
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
await context.addInitScript(raw => { if (!localStorage.getItem('orbit3077-save')) localStorage.setItem('orbit3077-save', raw); }, original);
const page = await context.newPage(); page.setDefaultTimeout(30000);
page.on('pageerror', e => { errors.push(e.message); console.log('ERROR', e.message); });
page.on('console', m => { if (m.type() === 'error') { errors.push(m.text()); console.log('CONSOLE', m.text()); } });
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); if (response.url().includes('/models/planets/')) requests.add(new URL(response.url()).pathname); });
async function loaded() {
  await page.waitForFunction(() => (globalThis.ORBIT_PLANET_DEBUG && !ORBIT_PLANET_DEBUG.busy) || !document.getElementById('planet-error').hidden, null, { timeout: 60000 });
  assert.equal(await page.locator('#planet-error').isVisible(), false, await page.locator('#error-text').textContent());
  await page.waitForFunction(() => !ORBIT_PLANET_DEBUG.view.cameraDestination);
  await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
}
async function inspect(label) {
  const info = await page.evaluate(() => {
    const d = ORBIT_PLANET_DEBUG, view = d.view, stage = document.getElementById('stage').getBoundingClientRect();
    return { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, stageHeight: stage.height, stageBottom: stage.bottom, mode: d.mode, calls: view.renderer.info.render.calls, triangles: view.renderer.info.render.triangles, memory: { ...view.renderer.info.memory }, controls: [...document.querySelectorAll('.planet-header .round-button,.view-tools button:not([hidden]),#region-enter:not([hidden]),#orbit-return:not([hidden])')].map(el => { const r = el.getBoundingClientRect(); return { id: el.id || el.tagName, width: r.width, height: r.height, bottom: r.bottom, right: r.right, tool: el.parentElement.classList.contains('view-tools') }; }) };
  });
  assert.equal(info.scrollWidth, info.width); assert.ok(info.scrollHeight <= info.height + 1); assert.ok(info.stageHeight >= 190);
  assert.ok(info.controls.every(r => r.width >= 44 && r.height >= 44 && r.bottom <= info.height && r.right <= info.width), JSON.stringify(info.controls));
  assert.ok(info.controls.filter(r => r.tool).every(r => r.bottom < info.stageBottom), JSON.stringify(info));
  assert.ok(info.calls < 35 && info.triangles < 650000, JSON.stringify(info));
  inspections.push({ label, ...info }); console.log('INSPECT', JSON.stringify({ label, ...info })); return info;
}
async function snapshot(name) { await page.screenshot({ path: resolve(output, `${name}.png`), timeout: 60000 }); }
async function generate(seed, preset = 'temperate', regions = '4') {
  await page.locator('#settings-open').click(); await page.locator('#seed-input').fill(seed); await page.locator('#planet-preset').selectOption(preset); await page.locator('#region-count').selectOption(regions); await page.locator('#seed-form button[type=submit]').click(); await loaded();
}
const saved = () => page.evaluate(() => localStorage.getItem('orbit3077-save'));
const camera = () => page.evaluate(() => ORBIT_PLANET_DEBUG.view.camera.position.toArray());
try {
  await page.goto(base + '/planet-preview.html?debug=1', { waitUntil: 'domcontentloaded' }); await loaded();
  await snapshot('orbit-390'); await inspect('orbit-390');
  const recipe = await page.evaluate(() => ORBIT_PLANET_DEBUG.planet);
  assert.equal(recipe.regions.length, 4); assert.ok(recipe.regions.every(r => r.explored)); assert.equal(await saved(), original);
  await page.locator('#regions button').nth(1).click(); await loaded(); assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.mode), 'orbit');
  assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.selected.id), 'region-1');
  pass('Region selection focuses the rotating globe; entering terrain is an explicit action');
  await page.locator('#regions button').first().click(); await loaded(); await page.locator('#region-enter').click(); await loaded();
  await snapshot('coast-390'); const initial = await inspect('coast-390');
  assert.ok(requests.has('/models/planets/namaqualand-cliff.glb')); assert.ok(requests.has('/models/planets/sand-normal.webp'));
  const regionRecipe = await page.evaluate(() => ORBIT_PLANET_DEBUG.region);
  const cdp = await context.newCDPSession(page), before = await camera();
  const bounds = await page.locator('#planet-canvas').boundingBox(), x = Math.round(bounds.width * .45), y = Math.round(bounds.y + bounds.height * .48);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
  for (let i = 1; i <= 5; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + i * 8, y: y + i * 3, id: 1 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  assert.notDeepEqual(await camera(), before); assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.site), null);
  const distance = () => page.evaluate(() => ORBIT_PLANET_DEBUG.view.camera.position.distanceTo(ORBIT_PLANET_DEBUG.view.controls.target));
  const beforePinch = await distance();
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x - 35, y, id: 1 }, { x: x + 35, y, id: 2 }] });
  for (let i = 1; i <= 4; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - 35 - i * 6, y, id: 1 }, { x: x + 35 + i * 6, y, id: 2 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  assert.ok(await distance() < beforePinch); assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.site), null);
  await page.locator('#camera-home').click(); await page.locator('#grid-toggle').click(); assert.equal(await page.locator('#grid-toggle').getAttribute('aria-pressed'), 'true');
  await page.touchscreen.tap(Math.round(bounds.width / 2), Math.round(bounds.y + bounds.height / 2)); await page.waitForFunction(() => ORBIT_PLANET_DEBUG.site !== null);
  assert.ok(await page.locator('#site-info').isVisible()); await snapshot('site-390'); await inspect('site-390');
  pass('Original scanned terrain assets render; touch rotation, build grid and ground inspection work without selecting during a drag');
  await page.locator('#grid-toggle').click();
  for (let i = 0; i < 2; i++) { await page.locator('#regions button').nth(1).click(); await loaded(); await page.locator('#regions button').first().click(); await loaded(); }
  assert.deepEqual(await page.evaluate(() => ORBIT_PLANET_DEBUG.region), regionRecipe);
  const repeated = await inspect('repeated-regions'); assert.ok(repeated.memory.geometries <= initial.memory.geometries && repeated.memory.textures === initial.memory.textures);
  await page.locator('#orbit-return').click(); await loaded();
  await generate('NEREID-3077'); assert.deepEqual(await page.evaluate(() => ORBIT_PLANET_DEBUG.planet), recipe);
  await page.reload({ waitUntil: 'domcontentloaded' }); await loaded(); assert.deepEqual(await page.evaluate(() => ORBIT_PLANET_DEBUG.planet), recipe);
  await generate('NEREID-3078'); assert.notDeepEqual(await page.evaluate(() => ORBIT_PLANET_DEBUG.planet), recipe);
  assert.equal(await saved(), original);
  pass('Region switches reuse resources; same seed and reload reproduce the recipe while a different seed changes it without modifying the game save');
  await generate('NEREID-3077', 'lunar', '3'); await page.locator('#region-enter').click(); await loaded(); await snapshot('lunar-390'); await inspect('lunar-390');
  assert.ok(requests.has('/models/planets/moon-rock.glb')); assert.ok(requests.has('/models/planets/regolith-color.webp'));
  await page.locator('#orbit-return').click(); await loaded(); await generate('NEREID-3077', 'arid', '5'); assert.equal(await page.locator('#regions button').count(), 5); await page.locator('#region-enter').click(); await loaded(); await snapshot('arid-390');
  for (const [width, height] of [[375, 667], [320, 568]]) { await page.setViewportSize({ width, height }); await loaded(); await page.locator('#camera-home').click(); await snapshot(`region-${width}`); await inspect(`region-${width}`); const rect = await page.locator('#planet-canvas').boundingBox(); await page.touchscreen.tap(Math.round(rect.width / 2), Math.round(rect.y + rect.height / 2)); await page.waitForFunction(() => ORBIT_PLANET_DEBUG.site !== null); await inspect(`site-${width}`); await page.locator('#orbit-return').click(); await loaded(); await inspect(`orbit-${width}`); await page.locator('#region-enter').click(); await loaded(); }
  pass('Temperate, arid and airless modules work at 390, 375 and 320 pixel portrait widths with reachable touch controls');
  assert.equal(await saved(), original);
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto(base + '/?debug=1', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => globalThis.ORBIT_DEBUG);
  assert.ok(await page.locator('#welcome [data-action="planet-preview"]').isVisible());
  const home = await page.evaluate(() => ORBIT_DEBUG.state.planets.find(p => p.owner === 'player'));
  await page.locator('#welcome [data-action="planet-preview"]').click(); await page.waitForURL(/planet-preview\.html/);
  assert.equal(new URL(page.url()).searchParams.get('seed'), String(home.seed));
  await page.waitForFunction(() => document.getElementById('loading').hidden); assert.equal(await page.locator('#planet-error').isVisible(), false);
  await page.locator('.planet-header>a').click(); await page.waitForURL(/index\.html/);
  assert.equal(JSON.parse(await saved()).day, JSON.parse(original).day);
  pass('The game entry opens a preview based on the actual home planet seed and safely returns to the saved game');
  assert.deepEqual(errors, []);
  await writeFile(resolve(output, 'browser-inspection.json'), JSON.stringify({ checks, inspections, assets: [...requests].sort(), errors }, null, 2) + '\n');
  console.log(JSON.stringify({ checks: checks.length, errors }));
} finally { await context.close(); await browser.close(); server.close(); }
