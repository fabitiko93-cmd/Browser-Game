import {createServer} from 'node:http';
import {readFile,mkdir,writeFile,chmod} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..'),output=process.env.ORBIT_QA_OUTPUT_DIR??resolve(root,'review-opening');
let playwright;try{playwright=await import('playwright');}catch(e){if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw e;playwright=createRequire(resolve(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'../package.json'))('playwright');}
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.wasm':'application/wasm','.glb':'model/gltf-binary','.json':'application/json','.mp3':'audio/mpeg'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost'),p=resolve(root,'docs','.'+(u.pathname==='/'?'/index.html':u.pathname));if(!p.startsWith(resolve(root,'docs')+'/'))throw Error('path');const bytes=await readFile(p);res.writeHead(200,{'Content-Type':mime[extname(p)]??'application/octet-stream','Content-Length':bytes.length});res.end(bytes);}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const base=(process.env.ORBIT_QA_BASE_URL??`http://127.0.0.1:${server.address().port}`).replace(/\/$/,'');
const executable=process.env.ORBIT_BROWSER_EXECUTABLE;if(executable)await chmod(executable,0o755);
const browser=await playwright.chromium.launch({executablePath:executable,headless:true,proxy:process.env.ORBIT_QA_USE_PROXY?{server:process.env.HTTPS_PROXY}:undefined,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[],checks=[];let idleMemory;await mkdir(output,{recursive:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true,ignoreHTTPSErrors:true,serviceWorkers:'block'});
const page=await context.newPage();page.setDefaultTimeout(60000);
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/Shader Error|Harbinger initialization/.test(m.text()))errors.push(m.text());});
async function loaded(){await page.waitForFunction(()=>globalThis.ORBIT_TRIAL_DEBUG?.ready||!document.getElementById('battle-error').hidden,null,{timeout:120000});assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.ready),true,await page.locator('#battle-error-text').innerText());assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.paused),true);await page.waitForFunction(()=>!ORBIT_TRIAL_DEBUG.view.transition&&!ORBIT_TRIAL_DEBUG.view.dirty);}
try{
 await page.goto(base+'/battle-trial.html?debug=1',{waitUntil:'domcontentloaded'});await loaded();
 for(const[scenario,width,height]of[['20v20',390,844],['5v35',390,844],['35v5',320,568],['50v50',390,844]]){
  await page.setViewportSize({width,height});await page.locator('#graphics-open').click();await page.locator('#scenario-select').selectOption(scenario);await page.locator('#restart').click();await loaded();
  idleMemory=await page.evaluate(()=>({...ORBIT_TRIAL_DEBUG.view.renderer.info.memory}));
  const shots=await page.evaluate(()=>ORBIT_TRIAL_DEBUG.advance(1/60).filter(e=>e.kind==='fire'));
  await page.waitForFunction(n=>ORBIT_TRIAL_DEBUG.view.effects.beams.length===n,shots.filter(e=>e.weapon==='laser').length);
  const info=await page.evaluate(()=>{const d=ORBIT_TRIAL_DEBUG,v=d.view,b=d.battle,e=v.effects;return{scenario:b.setup.scenario,total:b.ships.length,tick:b.tick,allFired:b.ships.every(s=>s.salvos===1&&v.ships.get(s.id).muzzleTime!=null),beams:e.cores.count,pings:e.pings.filter(p=>!p.impact).length,flashes:e.flashes.count,calls:v.renderer.info.render.calls,triangles:v.renderer.info.render.triangles,memory:{...v.renderer.info.memory},width:innerWidth,scroll:document.body.scrollWidth,clipped:b.ships.filter(s=>s.hull>0&&!s.escaped).map(s=>{const p=v.a.fromArray(s.position).project(v.camera);return{x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2,z:p.z};}).filter(p=>p.x<0||p.x>innerWidth||p.y<v.viewportTop||p.y>v.viewportBottom||p.z< -1||p.z>1)};});
  assert.equal(info.tick,1);assert.equal(shots.length,info.total);assert.equal(new Set(shots.map(s=>s.ship)).size,info.total);assert.ok(shots.every(s=>s.day===1/60));assert.ok(info.allFired);assert.equal(info.beams,shots.filter(s=>s.weapon==='laser').length);assert.equal(info.pings,info.total);assert.ok(info.flashes>=info.total);assert.equal(info.width,info.scroll);assert.deepEqual(info.clipped,[]);assert.ok(info.calls<70&&info.triangles<320000);
  if(scenario==='50v50'||scenario==='35v5')await page.screenshot({path:resolve(output,`opening-${scenario}.png`),timeout:60000});
  checks.push(info);console.log('PASS',JSON.stringify(info));
 }
 await page.locator('#graphics-open').click();await page.locator('#restart').click();await loaded();assert.deepEqual(await page.evaluate(()=>({...ORBIT_TRIAL_DEBUG.view.renderer.info.memory})),idleMemory);
 await page.locator('#battle-pause').click();await page.waitForFunction(()=>ORBIT_TRIAL_DEBUG.battle.tick>1);await page.locator('#battle-pause').click();assert.ok(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.battle.ships.every(s=>s.salvos>=1)));assert.equal(await page.evaluate(()=>localStorage.getItem('orbit3077-save')),null);assert.deepEqual(errors,[]);
 await writeFile(resolve(output,'browser-inspection.json'),JSON.stringify({base,checks,errors,success:true},null,2));console.log('PASS normal play starts the whole fleet; restart keeps GPU resources stable and leaves the empire untouched');
}finally{await browser.close();server.close();}
