import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..'), output = process.env.ORBIT_QA_OUTPUT_DIR ?? '/tmp/orbit-resources-qa';
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
const captures = new Set((process.env.ORBIT_QA_CAPTURES ?? 'resource-map-390,ore-extractor-390,geothermal-preview-320').split(','));
page.setDefaultTimeout(60000); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('favicon.ico')) errors.push(`${r.status()} ${r.url()}`); });
async function loaded() {
  await page.waitForFunction(() => globalThis.ORBIT_PLANET_DEBUG && !ORBIT_PLANET_DEBUG.busy || !document.getElementById('planet-error').hidden, null, { timeout: 90000 });
  assert.equal(await page.locator('#planet-error').isVisible(), false, await page.locator('#error-text').textContent());
  await settled(); assert.deepEqual(errors, [], 'Page, asset and shader errors must fail before screenshots');
  console.log('READY', await page.evaluate(() => ORBIT_PLANET_DEBUG.region.id));
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
  frames.push({ label, ...d }); console.log('VIEW', label, d.calls, d.triangles);
  if (captures.has(label)) {
    const capture = await context.newCDPSession(page);
    let timer;
    try {
      const shot = await Promise.race([capture.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false }), new Promise((_, reject) => { timer = setTimeout(() => reject(Error(`Screenshot timed out: ${label}`)), 60000); })]);
      await writeFile(resolve(output, label + '.png'), Buffer.from(shot.data, 'base64'));
    } finally { clearTimeout(timer); await capture.detach(); }
  }
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
async function choose(type, mode = 'core') {
  return page.evaluate(async ({type, mode}) => {
    const v = ORBIT_PLANET_DEBUG.view, resource = {mine:'ore',crystal:'crystal',geothermal:'geothermal'}[type];
    const candidates = [];
    if (mode === 'adjacent') {
      const s = ORBIT_PLANET_DEBUG.site;
      for (const [dx,dz] of [[8,0],[-8,0],[0,8],[0,-8]]) candidates.push({x:s.x+dx,z:s.z+dz});
    } else if (mode === 'weak') {
      for (let z=-53;z<=53;z+=8) for(let x=-53;x<=53;x+=8) candidates.push({x,z});
    } else for (const field of v.region.resources.filter(f=>f.type===resource)) {
      for(const dx of [0,-4,4,-8,8]) for(const dz of [0,-4,4,-8,8]) candidates.push({x:field.x+dx,z:field.z+dz});
    }
    const valid=[];
    for(const p of candidates) {
      const a=v.constructionSite(p.x,p.z);if(a.issue)continue;
      const production=v.productionFor({type,footprint:a.footprint});
      if(mode==='adjacent' && production.competition<.0001)continue;
      valid.push({...p,production});
      if (mode === 'adjacent' || mode === 'weak' && production.deposit < .00001 || mode === 'core' && production.factor >= .75) return valid.at(-1);
    }
    valid.sort((a,b)=>mode==='weak'?a.production.daily-b.production.daily:b.production.daily-a.production.daily);
    return valid[0];
  }, {type,mode});
}
async function select(type, point) {
  await page.locator('#probe-type').selectOption(type);await pick(point.x,point.z);
  assert.equal(await page.locator('#site-build').isEnabled(),true);
  return page.evaluate(()=>({x:ORBIT_PLANET_DEBUG.site.x,z:ORBIT_PLANET_DEBUG.site.z,production:ORBIT_PLANET_DEBUG.site.production}));
}
try {
  await page.goto(`${base}/planet-preview.html?debug=1&seed=28&regions=5&region=region-4`,{waitUntil:'domcontentloaded'});await loaded();
  const weak=await choose('mine','weak');assert.ok(weak);const ice=await select('mine',weak);assert.ok(ice.production.daily>0 && ice.production.daily<1);
  await page.locator('#site-build').click();await assertBatches();await inspect('ice-background-mine-390');
  checks.push('An extractor remains buildable on ordinary ice and yields only a small positive background output');
  await page.goto(`${base}/planet-preview.html?debug=1&seed=20&regions=5&region=region-2`,{waitUntil:'domcontentloaded'});await loaded();
  const ore=await choose('mine');assert.ok(ore);const first=await select('mine',ore);assert.ok(first.production.daily>ice.production.daily*20);
  await page.locator('#resource-toggle').click();assert.equal(await page.locator('#resource-toggle').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#resource-legend').isVisible(),true);await inspect('resource-map-390');
  await page.locator('#resource-toggle').click();for(let i=0;i<4;i++)await page.locator('#zoom-in').click();
  await page.locator('#site-build').click();await assertBatches();await inspect('ore-extractor-390');
  const firstId=await page.evaluate(()=>ORBIT_PLANET_DEBUG.site.building.id), alone=await page.evaluate(()=>ORBIT_PLANET_DEBUG.site.production.daily);
  const neighbour=await choose('mine','adjacent');assert.ok(neighbour);await select('mine',neighbour);await page.locator('#site-build').click();await assertBatches();
  const shared=await page.evaluate(id=>{const v=ORBIT_PLANET_DEBUG.view;return v.productionFor(v.construction.buildings.find(b=>b.id===id));},firstId);
  assert.ok(shared.daily<alone && shared.competition>0);checks.push('The rendered resource map and whole-footprint previews identify rich ore; adjacent extractors share actual local potential instead of cloning the same peak');
  for(const type of ['crystal','geothermal']) {
    const point=await choose(type);assert.ok(point);const selected=await select(type,point);assert.ok(selected.production.factor>.5);
    await page.locator('#site-build').click();await assertBatches();await inspect(type+'-extractor-390');
  }
  const types=await page.evaluate(()=>ORBIT_PLANET_DEBUG.view.construction.buildings.map(b=>b.type));assert.deepEqual(types,['mine','mine','crystal','geothermal']);
  await page.setViewportSize({width:320,height:568});await inspect('geothermal-preview-320');
  await page.setViewportSize({width:375,height:667});await inspect('geothermal-preview-375');
  checks.push('Ore, crystal and geothermal probes use distinct actual 3D models and expose their resource output and operating requirements on three portrait sizes');
  const fields=await page.evaluate(()=>ORBIT_PLANET_DEBUG.region.resources);
  await page.reload({waitUntil:'domcontentloaded'});await loaded();assert.deepEqual(await page.evaluate(()=>ORBIT_PLANET_DEBUG.view.construction.buildings.map(b=>b.type)),types);await assertBatches();
  await page.locator('#biosphere-select').selectOption('spore');await loaded();assert.deepEqual(await page.evaluate(()=>ORBIT_PLANET_DEBUG.region.resources),fields);assert.deepEqual(await page.evaluate(()=>ORBIT_PLANET_DEBUG.view.construction.buildings.map(b=>b.type)),types);await assertBatches();
  await page.locator('#regions [data-region="region-0"]').click();await loaded();assert.equal(await page.evaluate(()=>ORBIT_PLANET_DEBUG.view.construction.buildings.length),0);
  await page.locator('#regions [data-region="region-2"]').click();await loaded();assert.deepEqual(await page.evaluate(()=>ORBIT_PLANET_DEBUG.view.construction.buildings.map(b=>b.type)),types);
  await pick(first.x,first.z);const beforeRemoval=await page.evaluate(()=>ORBIT_PLANET_DEBUG.site.production.daily);
  const second=await page.evaluate(()=>ORBIT_PLANET_DEBUG.view.construction.buildings.filter(b=>b.type==='mine')[1]);await pick((second.footprint.minX+second.footprint.maxX)/2-1,(second.footprint.minZ+second.footprint.maxZ)/2-1);await page.locator('#site-demolish').click();
  await pick(first.x,first.z);assert.ok(await page.evaluate(()=>ORBIT_PLANET_DEBUG.site.production.daily)>beforeRemoval);await assertBatches();
  checks.push('Reload, region switching and alien biospheres preserve deposits, extractor types and clearing; demolition immediately frees shared access for remaining extractors');
  assert.deepEqual(errors,[]);await writeFile(resolve(output,'browser-inspection.json'),JSON.stringify({checks,ice,first,alone,shared,types,frames,errors},null,2));console.log('PASS',checks.length,'resource browser groups');
} finally {await browser.close();server.close();}
