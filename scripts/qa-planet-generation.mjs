import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { PLANET_EXAMPLES } from '../src/planet-examples.js';

const root = resolve(import.meta.dirname, '..'), output = process.env.ORBIT_QA_OUTPUT_DIR ?? '/tmp/orbit-generation-qa';
const require = createRequire(resolve(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '../package.json')), { chromium } = require('playwright');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.glb': 'model/gltf-binary', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  try { const path = resolve(root, 'docs', '.' + new URL(req.url, 'http://localhost').pathname); if (!path.startsWith(resolve(root, 'docs') + '/')) throw Error('path'); const bytes = await readFile(path); res.writeHead(200, { 'Content-Type': mime[extname(path)] ?? 'application/octet-stream' }); res.end(bytes); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done)); await mkdir(output, { recursive: true });
const base = process.env.ORBIT_QA_BASE_URL ?? `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.ORBIT_BROWSER_EXECUTABLE, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: 'reduce', serviceWorkers: 'block' });
const page = await context.newPage(), errors = [], frames = [], checks = [];
page.setDefaultTimeout(60000); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('favicon.ico')) errors.push(`${r.status()} ${r.url()}`); });
async function loaded() {
  await page.waitForFunction(() => globalThis.ORBIT_PLANET_DEBUG && !ORBIT_PLANET_DEBUG.busy || !document.getElementById('planet-error').hidden, null, { timeout: 90000 });
  assert.equal(await page.locator('#planet-error').isVisible(), false, await page.locator('#error-text').textContent());
  await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
}
async function inspect(label) {
  await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(done)))));
  const d = await page.evaluate(() => {
    const d = ORBIT_PLANET_DEBUG, v = d.view, stage = document.getElementById('stage').getBoundingClientRect();
    return { mode: d.mode, biome: d.region?.climateBiome, width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, stageHeight: stage.height, calls: v.renderer.info.render.calls, triangles: v.renderer.info.render.triangles, memory: { ...v.renderer.info.memory }, plants: v.environmentRecipe?.plants.length, trees: v.environmentRecipe?.trees.length, controls: [...document.querySelectorAll('.round-button,.view-tools button:not([hidden]),#orbit-return:not([hidden]),#region-enter:not([hidden]),#biosphere-select')].filter(e => e.getClientRects().length).map(e => { const r = e.getBoundingClientRect(); return { id: e.id, w: r.width, h: r.height, right: r.right, bottom: r.bottom }; }) };
  });
  assert.equal(d.scrollWidth, d.width); assert.ok(d.scrollHeight <= d.height + 1); assert.ok(d.stageHeight >= 185);
  assert.ok(d.controls.every(c => c.w >= 44 && c.h >= 44 && c.right <= d.width && c.bottom <= d.height + 1), JSON.stringify(d));
  assert.ok(d.triangles > 1000 && d.triangles < 6000000); assert.ok(d.calls < 800);
  frames.push({ label, ...d }); console.log('VIEW', label, d.calls, d.triangles, d.stageHeight);
  await page.screenshot({ path: resolve(output, label + '.png'), timeout: 90000 });
}
try {
  for (const example of PLANET_EXAMPLES) {
    await page.goto(`${base}/planet-preview.html?debug=1&seed=${example.seed}&regions=5&climate=${example.climate}&region=${example.region}`, { waitUntil: 'domcontentloaded' }); await loaded();
    assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.region.climateBiome), example.biome);
    await inspect(example.biome + '-390');
  }
  checks.push('Eight real generated climate regions load, render and fit the portrait interface without console or asset errors');
  const before = await page.evaluate(() => ({ region: ORBIT_PLANET_DEBUG.region, camera: ORBIT_PLANET_DEBUG.view.camera.position.toArray() }));
  await page.locator('#biosphere-select').selectOption('spore'); await loaded();
  assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.region.biosphere), 'spore');
  assert.deepEqual(await page.evaluate(() => ORBIT_PLANET_DEBUG.region.climate), before.region.climate);
  await page.locator('#biosphere-select').selectOption('coral'); await loaded(); await inspect('coral-ice-390');
  checks.push('Alien comparisons preserve seed geography and render frozen regions without inappropriate plants');
  await page.locator('#settings-open').click(); await page.locator('.landscape-discovery summary').click(); await page.locator('.landscape-example').filter({ hasText: 'Tropischer Regenwald' }).click(); await loaded(); await inspect('rainforest-example-390');
  for (const biosphere of ['spore', 'coral', 'terran']) { await page.locator('#biosphere-select').selectOption(biosphere); await loaded(); await inspect('rainforest-' + biosphere + '-390'); }
  const controlsBefore = await page.evaluate(() => ({ camera: ORBIT_PLANET_DEBUG.view.camera.position.toArray(), target: ORBIT_PLANET_DEBUG.view.controls.target.toArray() }));
  await page.locator('#grid-toggle').click(); assert.equal(await page.locator('#grid-toggle').getAttribute('aria-pressed'), 'false');
  await inspect('rainforest-landscape-390'); await page.locator('#grid-toggle').click();
  const sitePoint = await page.evaluate(() => { const v = ORBIT_PLANET_DEBUG.view, r = ORBIT_PLANET_DEBUG.region, p = v.controls.target.clone().set(0, r.terrain.level, 0).project(v.camera), b = document.getElementById('planet-canvas').getBoundingClientRect(); return { x: b.x + (p.x + 1) * b.width / 2, y: b.y + (1 - p.y) * b.height / 2 }; });
  await page.mouse.click(sitePoint.x, sitePoint.y); await page.waitForFunction(() => ORBIT_PLANET_DEBUG.site && !ORBIT_PLANET_DEBUG.view.siteFocus);
  assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.site.buildable), true);
  assert.ok(await page.locator('#site-info').isVisible());
  await page.locator('#camera-home').click();
  const distance = await page.evaluate(() => ORBIT_PLANET_DEBUG.view.camera.position.distanceTo(ORBIT_PLANET_DEBUG.view.controls.target));
  await page.locator('#zoom-in').click(); assert.ok(await page.evaluate(() => ORBIT_PLANET_DEBUG.view.camera.position.distanceTo(ORBIT_PLANET_DEBUG.view.controls.target)) < distance);
  await page.locator('#camera-home').click();
  checks.push('Grid visibility, real terrain picking, buildability display, focus and zoom remain operational');
  const cdp = await context.newCDPSession(page), box = await page.locator('#planet-canvas').boundingBox(), x = box.x + box.width * .5, y = box.y + box.height * .45;
  const camera = await page.evaluate(() => ORBIT_PLANET_DEBUG.view.camera.position.toArray());
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
  for (let i = 1; i <= 5; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + i * 10, y: y + i * 2, id: 1 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  assert.notDeepEqual(await page.evaluate(() => ORBIT_PLANET_DEBUG.view.camera.position.toArray()), camera);
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.planet-app')).userSelect), 'none');
  await page.locator('#settings-open').click(); assert.equal(await page.locator('#seed-input').evaluate(e => getComputedStyle(e).userSelect), 'text'); await page.locator('#settings-dialog button').first().click();
  checks.push('Touch camera remains operational; long-press selection is disabled while native text input stays editable');
  await page.setViewportSize({ width: 320, height: 568 }); await inspect('rainforest-320');
  await page.setViewportSize({ width: 375, height: 667 }); await inspect('rainforest-375');
  for (const preset of ['arid', 'lunar']) { await page.goto(`${base}/planet-preview.html?debug=1&preset=${preset}&seed=42&region=region-0`, { waitUntil: 'domcontentloaded' }); await loaded(); await inspect(preset + '-375'); }
  checks.push('Small portrait views and dry/airless worlds retain usable controls and valid rendered geometry');
  assert.deepEqual(errors, []);
  await writeFile(resolve(output, 'browser-inspection.json'), JSON.stringify({ checks, frames, errors }, null, 2));
  console.log('PASS', checks.length, 'browser groups');
} finally { await browser.close(); server.close(); }
