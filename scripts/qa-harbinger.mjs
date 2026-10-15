import {createServer} from 'node:http';
import {readFile,mkdir,writeFile,chmod} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..'),output=process.env.ORBIT_QA_OUTPUT_DIR??resolve(root,'review');
let playwright;try{playwright=await import('playwright');}catch(error){if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw error;playwright=createRequire(resolve(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'../package.json'))('playwright');}
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.wasm':'application/wasm','.glb':'model/gltf-binary','.json':'application/json','.mp3':'audio/mpeg'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost'),p=resolve(root,'docs','.'+(u.pathname==='/'?'/index.html':u.pathname));if(!p.startsWith(resolve(root,'docs')+'/'))throw Error('path');const bytes=await readFile(p);res.writeHead(200,{'Content-Type':mime[extname(p)]??'application/octet-stream','Content-Length':bytes.length});res.end(bytes);}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(done=>server.listen(0,'127.0.0.1',done));const base=(process.env.ORBIT_QA_BASE_URL??`http://127.0.0.1:${server.address().port}`).replace(/\/$/,'');
const executable=process.env.ORBIT_BROWSER_EXECUTABLE;if(executable)await chmod(executable,0o755);
const browser=await playwright.chromium.launch({executablePath:executable,headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});
const page=await context.newPage(),errors=[],checks=[];await mkdir(output,{recursive:true});
page.on('pageerror',error=>{errors.push(error.message);console.log('Page error:',error.message);});
page.on('console',message=>{if(message.type()==='error'){console.log('Console:',message.text().slice(0,500));if(/Shader Error|Harbinger initialization/.test(message.text()))errors.push(message.text());}});
const settled=()=>page.waitForFunction(()=>!ORBIT_HARBINGER_DEBUG.view.transition,null,{timeout:30000});
const capture=async name=>{await settled();await page.screenshot({path:resolve(output,name+'.png')});};
const choose=async id=>{await page.locator('#target-picker').click();await page.locator(`[data-contact-id="${id}"]`).click();};
const orders=()=>page.evaluate(()=>ORBIT_HARBINGER_DEBUG.battle.ships.filter(s=>s.side==='friendly').map(s=>({id:s.id,target:s.commandTarget,targeting:s.targeting,order:s.order})));
try{
 console.log('Opening WebGL:',base);await page.goto(base+'/harbinger.html?debug=1',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>globalThis.ORBIT_HARBINGER_DEBUG?.ready||!document.getElementById('battle-error').hidden,null,{timeout:120000});
 if(!await page.evaluate(()=>ORBIT_HARBINGER_DEBUG.ready))throw Error(await page.locator('#battle-error-text').innerText());
 await page.locator('#battle-pause').click();await capture('harbinger-ship');
 const inspection=await page.evaluate(()=>{
  const v=ORBIT_HARBINGER_DEBUG.view,materials=[],textures=new Set();
  v.ships.get('aurora').body.traverse(o=>{if(!o.isMesh||o.userData.surfaceEffect)return;const m=o.material;materials.push({name:m.name,normal:Boolean(m.normalMap&&m.normalMap!==v.panelMap),authored:o.userData.authoredMaterial,roughness:m.roughness,emissive:m.emissive.toArray()});for(const k of ['map','normalMap','roughnessMap','metalnessMap','aoMap'])if(m[k])textures.add(m[k]);});
  const gl=v.renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');
  return {viewport:[v.viewportTop,v.viewportBottom],fraction:(v.viewportBottom-v.viewportTop)/innerHeight,materials,compressed:[...textures].filter(t=>t.isCompressedTexture).length,textureBytes:[...textures].reduce((n,t)=>n+(t.mipmaps?.reduce((a,m)=>a+(m.data?.byteLength??0),0)??0),0),engines:v.ships.get('aurora').engines.length,drawCalls:v.renderer.info.render.calls,triangles:v.renderer.info.render.triangles,textures:v.renderer.info.memory.textures,geometries:v.renderer.info.memory.geometries,renderer:debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER)};
 });
 assert.equal(inspection.materials.length,17);assert.equal(inspection.materials.filter(m=>m.normal).length,7);assert.equal(inspection.compressed,19);assert.equal(inspection.engines,5);assert.ok(inspection.fraction>.5);checks.push('Native materials, seven authored normal maps, compressed textures and engine anchors');
 console.log('Native model ready.',JSON.stringify({calls:inspection.drawCalls,triangles:inspection.triangles,textureBytes:inspection.textureBytes,fraction:inspection.fraction}));
 await choose('revenant');assert.ok((await orders()).every(s=>s.targeting==='auto'));
 await page.locator('#attack-target').click();assert.equal((await orders()).find(s=>s.id==='aurora').target,'revenant');assert.ok((await orders()).filter(s=>s.id!=='aurora').every(s=>s.targeting==='auto'));
 await page.locator('[data-scope="fleet"]').click();await choose('viper');await page.locator('#attack-target').click();assert.ok((await orders()).every(s=>s.target==='viper'));
 await choose('wraith');assert.ok((await orders()).every(s=>s.target==='viper'));await page.locator('#auto-target').click();assert.ok((await orders()).every(s=>s.targeting==='auto'));
 await page.locator('[data-scope="ship"]').click();await choose('nemesis');checks.push('Contact inspection, single/fleet attack and automatic targeting keep correct recipients');
 for(const mode of ['fleet','overview']){await page.locator(`[data-camera="${mode}"]`).click();await capture('harbinger-'+mode);}
 assert.equal(await page.locator('[data-marker="fleet:friendly"]:visible').count(),1);assert.equal(await page.locator('[data-marker="fleet:enemy"]:visible').count(),1);
 const range=await page.locator('#battle-range').innerText();assert.ok(Math.abs(Number(range.replace(',','.').replace(' km',''))-50)<.2);
 await page.locator('[data-marker="fleet:enemy"]').click();await capture('harbinger-target');assert.equal(await page.evaluate(()=>ORBIT_HARBINGER_DEBUG.view.mode),'target');checks.push('All camera modes use the same 3D battle at 50 km');
 await page.locator('[data-camera="ship"]').click();await settled();const before=await page.evaluate(()=>({camera:ORBIT_HARBINGER_DEBUG.view.camera.position.toArray(),day:ORBIT_HARBINGER_DEBUG.battle.day}));
 const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:210,y:350,id:1}]});
 for(let i=1;i<=5;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:210+i*7,y:350+i*4,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const after=await page.evaluate(()=>({camera:ORBIT_HARBINGER_DEBUG.view.camera.position.toArray(),day:ORBIT_HARBINGER_DEBUG.battle.day}));assert.notDeepEqual(after.camera,before.camera);assert.equal(after.day,before.day);
 for(const id of ['pioneer','aurora']){await page.locator('#own-picker').click();await page.locator(`[data-ship="${id}"]`).click();await settled();assert.equal(await page.evaluate(()=>ORBIT_HARBINGER_DEBUG.battle.selected),id);}checks.push('Native touch drag and ship selector work while paused');
 await page.locator('#graphics-open').click();await page.waitForFunction(()=>document.getElementById('performance-readout').textContent.startsWith('Pausiert'));
 for(const mode of ['fluid','detail','auto']){await page.locator(`[data-graphics="${mode}"]`).click();assert.equal(await page.evaluate(()=>ORBIT_HARBINGER_DEBUG.view.graphics),mode);}
 await page.locator('[data-close="graphics-dialog"]').click();checks.push('Graphics modes and honest paused performance status');
 await page.setViewportSize({width:320,height:568});await page.locator('[data-camera="ship"]').click();await capture('harbinger-small-portrait');
 const small=await page.evaluate(()=>({fraction:(ORBIT_HARBINGER_DEBUG.view.viewportBottom-ORBIT_HARBINGER_DEBUG.view.viewportTop)/innerHeight,width:innerWidth,scroll:document.body.scrollWidth,actions:['attack-target','auto-target','retreat'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return {id,x:r.x,y:r.y,height:r.height,bottom:r.bottom};}),state:document.getElementById('target-state').getBoundingClientRect().height}));
 assert.equal(small.width,small.scroll);assert.ok(small.fraction>.35&&small.state>0);assert.ok(small.actions.every(r=>r.height>=44&&r.bottom<=568&&r.x>=0));assert.ok((await page.locator('#target-name').boundingBox()).x>=10);checks.push('320 × 568 layout keeps contact status and 44 px actions visible');
 await page.setViewportSize({width:390,height:844});await page.locator('#retreat').click();assert.equal((await orders()).find(s=>s.id==='aurora').order,'retreat');assert.ok(await page.locator('#attack-target').isDisabled());checks.push('Retreat prevents incompatible attack');
 const restarts=[];
 for(let i=0;i<2;i++){await page.locator('#restart').click();await page.waitForFunction(()=>ORBIT_HARBINGER_DEBUG.ready,null,{timeout:120000});await page.locator('#battle-pause').click();await settled();restarts.push(await page.evaluate(()=>({...ORBIT_HARBINGER_DEBUG.view.renderer.info.memory})));}
 assert.deepEqual(restarts[0],restarts[1]);checks.push('Two full restarts retain stable WebGL resource counts');
 await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 const policy=await page.evaluate(async()=>{const source=await(await fetch(new URL('./sw.js',location.href))).text();return JSON.parse(source.match(/const ASSETS=(\[[^\n]*\]);/)[1]);});assert.ok(!policy.some(url=>url.endsWith('.part')));
 await page.waitForFunction(async()=>Boolean(await caches.match(new URL('./models/harbinger/hull-000.part',location.href).href)),null,{timeout:30000});
 await context.setOffline(true);const offline=await page.evaluate(async()=>{const r=await fetch(new URL('./models/harbinger/hull-000.part',location.href),{headers:{Range:'bytes=0-11'}});return {status:r.status,range:r.headers.get('Content-Range'),bytes:[...new Uint8Array(await r.arrayBuffer())]};});await context.setOffline(false);
 assert.equal(offline.status,206);assert.deepEqual(offline.bytes.slice(0,4),[103,108,84,70]);checks.push('Optional model parts avoid initial game cache and support offline byte ranges');
 const events=await page.evaluate(async()=>{const {advanceDemoBattle}=await import(new URL('./build/battle-demo.js',location.href)),d=ORBIT_HARBINGER_DEBUG,counts={};for(let i=0;i<60;i++){const events=advanceDemoBattle(d.battle,.05);for(const e of events)counts[e.kind]=(counts[e.kind]??0)+1;d.view.render(d.battle,i*.15,events,.05);await new Promise(requestAnimationFrame);}d.paint();return counts;});
 await page.screenshot({path:resolve(output,'harbinger-combat-sample.png')});assert.ok(events.fire>0&&events.impact>0);checks.push('Real simulation fire and impact events render');
 const old=await context.newPage();old.on('pageerror',e=>errors.push(e.message));await old.goto(base+'/battle.html?debug=1',{waitUntil:'domcontentloaded'});await old.waitForFunction(()=>globalThis.ORBIT_BATTLE_DEBUG?.ready,null,{timeout:120000});await old.locator('#battle-pause').click();await old.waitForFunction(()=>!ORBIT_BATTLE_DEBUG.view.transition);await old.screenshot({path:resolve(output,'battle-before-portrait.png')});
 const previous=await old.evaluate(()=>({viewport:[ORBIT_BATTLE_DEBUG.view.viewportTop,ORBIT_BATTLE_DEBUG.view.viewportBottom],fraction:(ORBIT_BATTLE_DEBUG.view.viewportBottom-ORBIT_BATTLE_DEBUG.view.viewportTop)/innerHeight}));await old.close();
 await writeFile(resolve(output,'browser-inspection.json'),JSON.stringify({base,inspection,range,small,restarts,offline,events,previous,checks,errors},null,2));assert.deepEqual(errors,[]);console.log(JSON.stringify({checks:checks.length,fraction:inspection.fraction,beforeFraction:previous.fraction,errors}));
}finally{await browser.close();server.close();}
