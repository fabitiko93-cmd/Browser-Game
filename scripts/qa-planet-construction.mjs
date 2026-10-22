import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..'), output = process.env.ORBIT_QA_OUTPUT_DIR ?? '/tmp/orbit-construction-qa';
const require = createRequire(resolve(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '../package.json')), { chromium } = require('playwright');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.glb': 'model/gltf-binary', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  try { const path = resolve(root, 'docs', '.' + new URL(req.url, 'http://localhost').pathname); if (!path.startsWith(resolve(root, 'docs') + '/')) throw Error('path'); res.writeHead(200, { 'Content-Type': mime[extname(path)] ?? 'application/octet-stream' }); res.end(await readFile(path)); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done)); await mkdir(output, { recursive: true });
const base = process.env.ORBIT_QA_BASE_URL ?? `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.ORBIT_BROWSER_EXECUTABLE, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: 'reduce', serviceWorkers: 'block' });
const page = await context.newPage(), errors = [], checks = [], frames = [];
page.setDefaultTimeout(60000); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('favicon.ico')) errors.push(`${r.status()} ${r.url()}`); });
async function loaded() {
  await page.waitForFunction(() => globalThis.ORBIT_PLANET_DEBUG && !ORBIT_PLANET_DEBUG.busy || !document.getElementById('planet-error').hidden, null, { timeout: 90000 });
  assert.equal(await page.locator('#planet-error').isVisible(), false, await page.locator('#error-text').textContent());
}
async function settled() { await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(done))))); }
async function pick(x, z) {
  const point = await page.evaluate(({ x, z }) => {
    const v = ORBIT_PLANET_DEBUG.view, delta = v.controls.target.clone().set(x, v.controls.target.y, z).sub(v.controls.target);
    v.siteFocus = null; v.controls.target.add(delta); v.camera.position.add(delta); v.controls.update(); v.keepCameraAboveGround(); v.camera.updateMatrixWorld(); v.dirty = true;
    const p = v.controls.target.clone().set(x, ORBIT_PLANET_DEBUG.region.terrain?.level ?? v.controls.target.y - 3, z).project(v.camera), b = v.canvas.getBoundingClientRect();
    return { x: b.x + (p.x + 1) * b.width / 2, y: b.y + (1 - p.y) * b.height / 2 };
  }, { x, z });
  await settled(); await page.mouse.click(point.x, point.y); await page.waitForFunction(() => ORBIT_PLANET_DEBUG.site && !ORBIT_PLANET_DEBUG.view.siteFocus);
}
async function inspect(label) {
  await settled();
  const d = await page.evaluate(() => {
    const v = ORBIT_PLANET_DEBUG.view, ids = ['orbit-return', document.getElementById('site-build').hidden ? 'site-demolish' : 'site-build'];
    return { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, stage: document.getElementById('stage').getBoundingClientRect().height, buildings: v.construction.buildings.length, clearings: v.construction.clearings.length, calls: v.renderer.info.render.calls, triangles: v.renderer.info.render.triangles, controls: ids.map(id => { const b = document.getElementById(id).getBoundingClientRect(); return { id, top: b.top, bottom: b.bottom, height: b.height }; }) };
  });
  assert.equal(d.scrollWidth, d.width); assert.ok(d.scrollHeight <= d.height + 1); assert.ok(d.stage >= 185); assert.ok(d.calls < 800 && d.triangles > 1000);
  assert.ok(d.controls.every(c => c.height >= 44 && c.top >= 0 && c.bottom <= d.height + 1), JSON.stringify(d));
  frames.push({ label, ...d }); await page.screenshot({ path: resolve(output, label + '.png'), timeout: 90000 }); console.log('VIEW', label, d.calls, d.triangles);
}
async function assertBatches() {
  const issues = await page.evaluate(() => {
    const v = ORBIT_PLANET_DEBUG.view, issues = [], matrix = v.camera.matrix.clone(), overlaps = (a, b) => a.minX < b.maxX - 1e-7 && a.maxX > b.minX + 1e-7 && a.minZ < b.maxZ - 1e-7 && a.maxZ > b.minZ + 1e-7;
    v.land.traverse(m => {
      if (!m.userData.constructionObjects) return;
      const expected = m.userData.constructionObjects.filter(o => !(o.removable && v.construction.clearings.some(f => overlaps(o.bounds, f))));
      if (m.count !== expected.length) issues.push('instance count');
      expected.forEach((o, i) => { m.getMatrixAt(i, matrix); if (!matrix.elements.every((a, k) => Math.abs(a - o.matrix.elements[k]) < .0001)) issues.push(o.id); });
    }); return issues;
  }); assert.deepEqual(issues, []);
}
try {
  await page.goto(`${base}/planet-preview.html?debug=1&seed=20&regions=5&region=region-2`, { waitUntil: 'domcontentloaded' }); await loaded();
  const candidate = await page.evaluate(() => {
    const v = ORBIT_PLANET_DEBUG.view;
    for (const o of v.constructionObjects.filter(o => o.kind === 'tree')) {
      const x = o.matrix.elements[12], z = o.matrix.elements[14]; if (Math.max(Math.abs(x), Math.abs(z)) > 54) continue;
      const a = v.constructionSite(x, z); if (!a.issue && a.counts.tree) return { x, z, counts: a.counts };
    }
  }); assert.ok(candidate, 'generated rainforest needs a genuinely wooded buildable footprint');
  await pick(candidate.x, candidate.z); assert.equal(await page.locator('#site-build').isEnabled(), true);
  for (let i = 0; i < 5; i++) await page.locator('#zoom-in').click();
  await inspect('before-clearing-390');
  const selected = await page.evaluate(() => ({ x: ORBIT_PLANET_DEBUG.site.x, z: ORBIT_PLANET_DEBUG.site.z, counts: ORBIT_PLANET_DEBUG.site.construction.counts })); assert.ok(selected.counts.tree > 0);
  await page.locator('#site-build').click(); assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.view.construction.buildings.length), 1); await assertBatches(); await inspect('habitat-cleared-390');
  checks.push('Real terrain picking and the build button clear intersecting tree crowns, understory and removable stones; all remaining GPU matrices are preserved');
  await page.reload({ waitUntil: 'domcontentloaded' }); await loaded(); assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.view.construction.buildings.length), 1); await assertBatches();
  await page.locator('#biosphere-select').selectOption('spore'); await loaded(); assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.view.construction.buildings.length), 1); await assertBatches();
  await page.locator('[data-region="region-0"]').click(); await loaded(); assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.view.construction.buildings.length), 0);
  await page.locator('[data-region="region-2"]').click(); await loaded(); assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.view.construction.buildings.length), 1);
  await page.locator('#biosphere-select').selectOption('terran'); await loaded(); await assertBatches();
  checks.push('Reload, independent regions and biosphere comparisons preserve construction and cleared footprints');
  await pick(selected.x, selected.z); assert.equal(await page.locator('#site-demolish').isVisible(), true);
  await page.setViewportSize({ width: 320, height: 568 }); await inspect('habitat-cleared-320');
  await page.locator('#site-demolish').click(); assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.view.construction.buildings.length), 0); assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.view.construction.clearings.length), 1); await assertBatches(); await inspect('demolished-320');
  await page.setViewportSize({ width: 375, height: 667 }); await inspect('demolished-375');
  await page.locator('#site-build').click(); await assertBatches(); await inspect('rebuilt-375');
  checks.push('Building, demolition and rebuilding fit 320, 375 and 390 pixel portrait layouts; demolition does not respawn cleared objects');
  await page.locator('#settings-open').click(); await page.locator('details').filter({ has: page.locator('#construction-reset') }).locator('summary').click(); await page.locator('#construction-reset').click();
  assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.view.construction.buildings.length), 0); assert.equal(await page.evaluate(() => ORBIT_PLANET_DEBUG.view.construction.clearings.length), 0); await assertBatches();
  const rock = await page.evaluate(() => { const v = ORBIT_PLANET_DEBUG.view; for (const o of v.constructionObjects.filter(o => o.kind === 'stone' && !o.removable)) { const x = o.matrix.elements[12], z = o.matrix.elements[14]; if (/Felsblock/.test(v.constructionSite(x, z).issue)) return { x, z }; } });
  assert.ok(rock, 'generated region needs an actual blocking outcrop'); await pick(rock.x, rock.z); assert.equal(await page.locator('#site-build').isDisabled(), true);
  const rejected = await page.evaluate(() => { const v = ORBIT_PLANET_DEBUG.view, before = JSON.stringify(v.construction), result = v.buildSelected(); return { issue: result.issue, unchanged: before === JSON.stringify(v.construction) }; });
  assert.match(rejected.issue, /Felsblock/); assert.equal(rejected.unchanged, true); await assertBatches();
  checks.push('Reset restores the original landscape; a real large scanned rock disables building and rejected placement leaves the entire state unchanged');
  assert.deepEqual(errors, []); await writeFile(resolve(output, 'browser-inspection.json'), JSON.stringify({ checks, selected, frames, errors }, null, 2)); console.log('PASS', checks.length, 'construction browser groups');
} finally { await browser.close(); server.close(); }
