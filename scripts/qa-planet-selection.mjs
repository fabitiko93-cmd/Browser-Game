import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from './qa-browser-runtime.mjs';
import assert from 'node:assert/strict';
import { createPlanetBlueprint, createRegionBlueprint, regionGroundHeight } from '../src/planet-blueprint.js';
import { resourceAt } from '../src/planet-selection-scene.js';
import { resourceFieldDensity } from '../src/planet-resources.js';

const root = resolve(import.meta.dirname, '..'), output = process.env.ORBIT_QA_OUTPUT_DIR ?? '/tmp/orbit-selection-qa';
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
const captures = new Set((process.env.ORBIT_QA_CAPTURES ?? 'building-preview-390,building-preview-320').split(','));
page.setDefaultTimeout(60000); page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('favicon.ico')) errors.push(`${r.status()} ${r.url()}`); });
async function loaded() {
  await page.waitForFunction(() => globalThis.ORBIT_PLANET_DEBUG && !ORBIT_PLANET_DEBUG.busy || !document.getElementById('planet-error').hidden, null, { timeout: 90000 });
  assert.equal(await page.locator('#planet-error').isVisible(), false, await page.locator('#error-text').textContent());
  await settled(); assert.deepEqual(errors, [], 'Page, asset and shader errors must fail before screenshots');
  console.log('READY');
}
async function settled() { await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(done))))); }
async function pick(x, z, height) {
  const point = await page.evaluate(({ x, z, height }) => {
    const v = ORBIT_PLANET_DEBUG.view, delta = v.controls.target.clone().set(x, v.controls.target.y, z).sub(v.controls.target);
    v.siteFocus = null; v.controls.target.add(delta); v.camera.position.add(delta); v.controls.update(); v.keepCameraAboveGround(); v.camera.updateMatrixWorld(); v.dirty = true;
    const p = v.controls.target.clone().set(x, height ?? v.controls.target.y - 3.5, z).project(v.camera), b = v.canvas.getBoundingClientRect();
    return { x: b.x + (p.x + 1) * b.width / 2, y: b.y + (1 - p.y) * b.height / 2 };
  }, { x, z, height });
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
  await page.goto(`${base}/planet-preview.html?debug=1&seed=42&preset=lunar&regions=5&region=region-0`,{waitUntil:'domcontentloaded',timeout:120000});await loaded();
  const point=await choose('mine');assert.ok(point);await select('mine',point);
  const preview=await page.evaluate(()=>{const v=ORBIT_PLANET_DEBUG.view;return {types:v.buildingPreview.children.map(g=>g.userData.type),field:v.selectionFieldId,contours:v.resourceSelection.children.length,footprint:ORBIT_PLANET_DEBUG.site.construction.footprint};});
  assert.deepEqual(preview.types,['mine']);assert.ok(preview.field);assert.equal(preview.contours,5);assert.equal(await page.locator('#selection-legend').isVisible(),true);
  for(const type of ['habitat','crystal','geothermal','mine']) {await page.locator('#probe-type').selectOption(type);assert.equal(await page.evaluate(()=>ORBIT_PLANET_DEBUG.view.buildingPreview.children[0].userData.type),type);}
  for(let i=0;i<3;i++)await page.locator('#zoom-in').click();
  await inspect('building-preview-390');
  await page.setViewportSize({width:320,height:568});await inspect('building-preview-320');
  const overlap=await page.evaluate(()=>{const a=document.getElementById('selection-legend').getBoundingClientRect(),b=document.querySelector('.view-tools').getBoundingClientRect();return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;});assert.equal(overlap,false,'Legend must not cover camera controls');
  assert.ok(await page.evaluate(()=>document.getElementById('site-build').getBoundingClientRect().bottom<=document.getElementById('orbit-return').getBoundingClientRect().top),'Build and return controls must not overlap');
  await page.setViewportSize({width:390,height:844});
  await page.locator('#site-build').click();assert.equal(await page.evaluate(()=>ORBIT_PLANET_DEBUG.view.buildingPreview.children.length),0);
  await page.locator('#site-demolish').click();assert.equal(await page.evaluate(()=>ORBIT_PLANET_DEBUG.view.buildingPreview.children.length),1);
  const region=createRegionBlueprint(createPlanetBlueprint(42,{preset:'lunar',regionCount:5}),'region-0'), candidates=[];
  for(const x of [-70,-66,66,70])for(let z=-60;z<=60;z+=2){const f=resourceAt(region,x,z);if(f)candidates.push({x,z,height:regionGroundHeight(region,x,z),density:resourceFieldDensity(region,f,x,z)});}
  candidates.sort((a,b)=>b.density-a.density);const outside=candidates[0];assert.ok(outside);await pick(outside.x,outside.z,outside.height);
  assert.equal(await page.evaluate(()=>ORBIT_PLANET_DEBUG.site.resourceOnly),true);assert.equal(await page.locator('#site-build').isVisible(),false);assert.equal(await page.evaluate(()=>ORBIT_PLANET_DEBUG.view.constructionMark.visible),false);assert.equal(await page.evaluate(()=>ORBIT_PLANET_DEBUG.view.buildingPreview.children.length),0);
  const blocked=await page.evaluate(()=>{const v=ORBIT_PLANET_DEBUG.view;for(const o of v.constructionObjects.filter(o=>!o.removable)){const x=o.matrix.elements[12],z=o.matrix.elements[14];if(Math.max(Math.abs(x),Math.abs(z))<55&&v.constructionSite(x,z).issue)return{x,z};}return null;});
  assert.ok(blocked);await pick(blocked.x,blocked.z);assert.equal(await page.locator('#site-build').isDisabled(),true);assert.equal(await page.evaluate(()=>ORBIT_PLANET_DEBUG.view.buildingPreview.children[0].children[1].material.color.getHexString()),'ff8068');
  await page.evaluate(()=>ORBIT_PLANET_DEBUG.view.pick({clientX:-10000,clientY:-10000}));await page.locator('#probe-type').selectOption('crystal');assert.equal(await page.evaluate(()=>ORBIT_PLANET_DEBUG.site),null);assert.equal(await page.locator('#selection-legend').isVisible(),false);
  assert.deepEqual(errors,[]);await writeFile(resolve(output,'browser-inspection.json'),JSON.stringify({preview,outside,blocked,frames,errors},null,2));console.log('PASS ghost scale, type switching, field contours, portrait controls, construction, demolition, outside-grid resource inspection and blocked placement');
}finally{await browser.close();server.close();}
