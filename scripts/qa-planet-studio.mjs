import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from './qa-browser-runtime.mjs';

const root = resolve(import.meta.dirname, '..'), output = process.env.ORBIT_QA_OUTPUT_DIR ?? resolve(root, 'review/planet/studio');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.glb': 'model/gltf-binary', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  try {
    const path = resolve(root, 'docs', '.' + new URL(req.url, 'http://localhost').pathname);
    if (!path.startsWith(resolve(root, 'docs') + '/')) throw Error('Invalid path');
    res.writeHead(200, { 'Content-Type': mime[extname(path)] ?? 'application/octet-stream' }); res.end(await readFile(path));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done)); await mkdir(output, { recursive: true });
const base = process.env.ORBIT_QA_BASE_URL ?? `http://127.0.0.1:${server.address().port}`;
let browser, page;
const errors = [], frames = [], scenes = [], checks = [];
async function settled() { await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(done))))); }
async function ready(studio = true) {
  await page.waitForFunction(active => globalThis.ORBIT_PLANET_DEBUG && !ORBIT_PLANET_DEBUG.busy && ORBIT_PLANET_DEBUG.mode === 'region' && ORBIT_PLANET_DEBUG.studio.active === active || !document.getElementById('planet-error').hidden, studio, { timeout: 120000 });
  assert.equal(await page.locator('#planet-error').isVisible(), false, await page.locator('#error-text').textContent());
  await settled(); assert.deepEqual(errors, []);
}
async function screenshot(name) {
  const cdp = await page.context().newCDPSession(page);
  try {
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
    await writeFile(resolve(output, name + '.png'), Buffer.from(shot.data, 'base64'));
  } finally { await cdp.detach(); }
}
async function inspect(label) {
  const frame = await page.evaluate(() => {
    const v = ORBIT_PLANET_DEBUG.view, bounds = document.getElementById('stage').getBoundingClientRect();
    return { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, stage: bounds.height, calls: v.renderer.info.render.calls, triangles: v.renderer.info.render.triangles, controls: [...document.querySelectorAll('#studio-panel button,#studio-panel select')].map(el => { const b = el.getBoundingClientRect(); return { id: el.id || el.textContent, x: b.x, y: b.y, width: b.width, height: b.height, bottom: b.bottom }; }) };
  });
  assert.equal(frame.scrollWidth, frame.width); assert.ok(frame.scrollHeight <= frame.height + 1); assert.ok(frame.stage >= 190, JSON.stringify(frame));
  assert.ok(frame.controls.every(c => c.width >= 44 && c.height >= 44 && c.y >= 0 && c.bottom <= frame.height + 1), JSON.stringify(frame));
  assert.ok(frame.calls > 0 && frame.calls < 800 && frame.triangles > 1000);
  frames.push({ label, ...frame }); console.log('VIEW', label, frame.stage, frame.calls);
}
async function state() {
  return page.evaluate(() => {
    const d = ORBIT_PLANET_DEBUG, v = d.view;
    return { region: JSON.stringify(v.region), terrain: v.terrain.uuid, size: [v.canvas.width, v.canvas.height], geometries: v.renderer.info.memory.geometries, pose: [...v.camera.position.toArray(), ...v.controls.target.toArray(), v.camera.fov], exposure: v.renderer.toneMappingExposure, base: v.baseAppearance.exposure, haze: v.scene.fog?.density ?? null, settings: d.studio.settings, captures: d.studio.captures.length, buildings: v.construction.buildings.length, storage: JSON.stringify(Object.entries(localStorage).sort()) };
  });
}
function samePose(a, b) { assert.ok(a.every((n, i) => Math.abs(n - b[i]) < .002), JSON.stringify({ a, b })); }
try {
  browser = await chromium.launch({ executablePath: process.env.ORBIT_BROWSER_EXECUTABLE, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: 'reduce', serviceWorkers: 'block' });
  page = await context.newPage(); page.setDefaultTimeout(90000);
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('favicon.ico')) errors.push(`${r.status()} ${r.url()}`); });
  await page.goto(`${base}/planet-preview.html?debug=1&seed=42&preset=lunar&regions=5&region=region-0`, { waitUntil: 'domcontentloaded' }); await ready(false);
  // Set up one real saved building through the existing construction action.
  const point = await page.evaluate(() => {
    const v = ORBIT_PLANET_DEBUG.view;
    for (let z = -45; z <= 45; z += 8) for (let x = -45; x <= 45; x += 8) if (!v.constructionSite(x, z).issue) { v.selectedCell = { x, z }; v.selectedPoint = { x, z }; v.refreshSelected(); return { x, z }; }
  }); assert.ok(point); await page.locator('#site-build').click(); assert.equal((await state()).buildings, 1);
  const saved = (await state()).storage;
  await page.locator('#settings-open').click(); await page.locator('#studio-open').click(); await ready();
  assert.equal((await state()).buildings, 0); assert.equal((await state()).storage, saved);
  const canvas = await page.locator('#planet-canvas').boundingBox(); await page.touchscreen.tap(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2);
  assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.site), null);
  assert.equal((await state()).settings.shot, 'overview', 'A tap without camera movement keeps the fixed comparison camera selected');
  const natural = await state(); await inspect('studio-390'); await screenshot('studio-390');
  await page.locator('#studio-capture').click(); assert.equal((await state()).captures, 1);
  await page.getByRole('button', { name: 'Klar', exact: true }).click(); await settled(); const clear = await state();
  samePose(clear.pose, natural.pose); assert.deepEqual(clear.size, natural.size); assert.equal(clear.region, natural.region); assert.equal(clear.terrain, natural.terrain); assert.equal(clear.geometries, natural.geometries); assert.ok(clear.exposure !== natural.exposure);
  await page.locator('#studio-capture').click();
  await page.locator('#studio-adjust').click();
  const slider = await page.locator('#studio-exposure').boundingBox(); assert.ok(slider.height >= 44);
  await page.locator('#studio-exposure').tap({ position: { x: slider.width * .8, y: slider.height / 2 } }); assert.notEqual((await state()).settings.values.exposure, .98);
  await page.locator('#studio-exposure').evaluate(el => { el.value = '1.2'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  assert.equal((await state()).settings.look, 'custom'); assert.ok(Math.abs((await state()).exposure - natural.base * 1.2) < 1e-8);
  await page.getByRole('button', { name: 'Abstimmung schließen' }).click(); await page.locator('#studio-capture').click(); assert.equal((await state()).captures, 3); assert.equal(await page.locator('#studio-capture').isDisabled(), true);
  await page.locator('#studio-compare').click(); assert.equal(await page.locator('.studio-capture img').count(), 3);
  const images = await page.evaluate(() => ORBIT_PLANET_DEBUG.studio.captures.map(s => ({ url: s.url, image: s.image })));
  for (const [i, shot] of images.entries()) { assert.ok(shot.image.startsWith('data:image/jpeg;base64,') && shot.image.length > 10000); await writeFile(resolve(output, `comparison-${i + 1}.jpg`), Buffer.from(shot.image.split(',')[1], 'base64')); }
  await screenshot('comparison-gallery-390');
  await page.locator('.studio-capture').first().getByRole('button', { name: 'Wiederherstellen' }).click(); await ready();
  const restored = await state(); samePose(restored.pose, natural.pose); assert.equal(restored.exposure, natural.exposure); assert.equal(restored.terrain, natural.terrain);
  await page.locator('#studio-compare').click(); await page.locator('.studio-capture').last().getByRole('button', { name: 'Verwerfen' }).click(); assert.equal((await state()).captures, 2);
  await page.getByRole('button', { name: 'Vergleich schließen' }).click(); assert.equal(await page.locator('#studio-capture').isEnabled(), true); await page.locator('#studio-capture').click(); assert.equal((await state()).captures, 3);
  checks.push('Appearance switches preserve geometry, geology and actual camera; snapshots restore their appearance without accumulation.');
  const reloadURL = page.url(); await page.reload({ waitUntil: 'domcontentloaded' }); await ready(); samePose((await state()).pose, restored.pose); assert.equal((await state()).storage, saved); assert.equal((await state()).settings.look, 'natural');
  checks.push('Direct links restore the full view after reload and leave existing construction storage byte-for-byte unchanged.');
  await page.setViewportSize({ width: 320, height: 568 }); await settled(); await inspect('studio-320'); await screenshot('studio-320');
  for (const id of ['ice', 'rainforest', 'temperate']) {
    await page.locator('#studio-scene').selectOption(id);
    await page.waitForFunction(id => !ORBIT_PLANET_DEBUG.busy && ORBIT_PLANET_DEBUG.region?.climateBiome === id, id, { timeout: 120000 }); await ready();
    for (const shot of ['colony', 'ground', 'overview']) { await page.locator(`#studio-cameras [data-choice=${shot}]`).click(); await settled(); assert.ok((await state()).pose.every(Number.isFinite)); }
    if (id === 'temperate') {
      await page.getByRole('button', { name: 'Klar', exact: true }).click();
      const water = await page.evaluate(() => { const v = ORBIT_PLANET_DEBUG.view, values = []; v.land.traverse(m => { if (m.material?.uniforms?.hazeDensity) values.push(m.material.uniforms.hazeDensity.value); }); return { fog: v.scene.fog.density, values }; });
      assert.ok(water.values.length); assert.ok(water.values.every(n => Math.abs(n - water.fog) < 1e-10));
    }
    scenes.push({ id, ...(await page.evaluate(() => ({ biome: ORBIT_PLANET_DEBUG.region.climateBiome, module: ORBIT_PLANET_DEBUG.region.module, seed: ORBIT_PLANET_DEBUG.planet.seed }))) });
    console.log('SCENE', id); await screenshot(`scene-${id}-320`);
    if (id === 'ice') await page.locator('#studio-capture').click();
  }
  await page.locator('#studio-compare').click(); await page.locator('.studio-capture').first().getByRole('button', { name: 'Wiederherstellen' }).click();
  await page.waitForFunction(() => !ORBIT_PLANET_DEBUG.busy && ORBIT_PLANET_DEBUG.region?.climateBiome === 'ice'); await ready();
  assert.equal(await page.locator('#studio-scene').inputValue(), 'ice');
  checks.push('Touch-adjusted sliders work; deleting a snapshot frees its slot; a snapshot restores its original world after switching to other landscapes.');
  await page.locator('#studio-scene').selectOption('lunar'); await page.waitForFunction(() => !ORBIT_PLANET_DEBUG.busy && ORBIT_PLANET_DEBUG.region?.preset === 'lunar'); await ready();
  await page.locator('#studio-adjust').click(); assert.equal(await page.locator('#studio-haze').isDisabled(), true); await page.locator('#studio-share').click();
  await page.waitForFunction(() => /Link kopiert|zum Kopieren/.test(document.getElementById('studio-tuning-status').textContent));
  assert.ok(await page.locator('#studio-tuning-status').textContent()); await page.getByRole('button', { name: 'Abstimmung schließen' }).click();
  await page.locator('#studio-exit').click(); await ready(false);
  assert.equal((await state()).storage, saved); assert.equal((await state()).buildings, 1); assert.equal((await state()).exposure, (await state()).base);
  assert.equal(await page.locator('#construction-tools').isVisible(), true); assert.equal(new URL(page.url()).searchParams.has('studio'), false);
  assert.deepEqual(errors, []);
  checks.push('Portrait controls fit at 320×568 and 390×844; all three cameras work in ice, rainforest and coast scenes; water/terrain haze stays consistent; airless haze is disabled; exiting restores the saved building and original scene lighting.');
  await writeFile(resolve(output, 'browser-inspection.json'), JSON.stringify({ status: 'passed', browser: await browser.version(), frames, scenes, checks, errors }, null, 2) + '\n');
  console.log('PASS landscape studio, snapshots, shareable views, camera isolation, portrait controls and construction preservation');
} catch (error) {
  await writeFile(resolve(output, 'browser-inspection.json'), JSON.stringify({ status: 'failed', error: String(error), frames, scenes, checks, errors }, null, 2) + '\n');
  if (page) await screenshot('failure').catch(() => {}); throw error;
} finally { await browser?.close(); await new Promise(done => server.close(done)); }
