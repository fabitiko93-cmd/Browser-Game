import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, chmod } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { createGame } from '../src/state.js';
const root=resolve(import.meta.dirname,'..'), output=process.env.ORBIT_QA_OUTPUT_DIR??resolve(root,'review-planner');
let playwright;try{playwright=await import('playwright');}catch(e){if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw e;playwright=createRequire(resolve(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'../package.json'))('playwright');}
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.wasm':'application/wasm','.glb':'model/gltf-binary','.json':'application/json','.mp3':'audio/mpeg'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost'),p=resolve(root,'docs','.'+(u.pathname==='/'?'/index.html':u.pathname));if(!p.startsWith(resolve(root,'docs')+'/'))throw Error('path');const bytes=await readFile(p);res.writeHead(200,{'Content-Type':mime[extname(p)]??'application/octet-stream','Content-Length':bytes.length});res.end(bytes);}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const base=(process.env.ORBIT_QA_BASE_URL??`http://127.0.0.1:${server.address().port}`).replace(/\/$/,''), executable=process.env.ORBIT_BROWSER_EXECUTABLE;
if(executable)await chmod(executable,0o755);
const browser=await playwright.chromium.launch({executablePath:executable,headless:true,proxy:process.env.ORBIT_QA_USE_PROXY?{server:process.env.HTTPS_PROXY}:undefined,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'block',ignoreHTTPSErrors:true});
const page=await context.newPage(), errors=[],checks=[],scales=[];page.setDefaultTimeout(45000);
page.on('pageerror',e=>{errors.push(e.message);console.log('ERROR',e.message);});
page.on('console',m=>{if(m.type()==='error'&&/Shader Error|Harbinger initialization/.test(m.text()))errors.push(m.text());});
await mkdir(output,{recursive:true});
const pass=s=>{checks.push(s);console.log('PASS',s);};
const state=()=>page.evaluate(()=>ORBIT_TRIAL_DEBUG.battle);
const draft=()=>page.evaluate(()=>ORBIT_TRIAL_DEBUG.planner.plan);
async function loaded(){await page.waitForFunction(()=>globalThis.ORBIT_TRIAL_DEBUG?.ready||!document.getElementById('battle-error').hidden,null,{timeout:120000});assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.ready),true,await page.locator('#battle-error-text').innerText());await page.waitForFunction(()=>!ORBIT_TRIAL_DEBUG.view.transition&&!ORBIT_TRIAL_DEBUG.view.dirty);assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.paused),true);}
async function openPlanner(){await page.locator('#graphics-open').click();await page.locator('#planner-open').click();assert.ok(await page.locator('#planner-dialog').evaluate(n=>n.open));}
async function advanced(){if(!await page.locator('#plan-preset').isVisible())await page.locator('.plan-roster>summary').last().click();}
async function editName(id,value){await page.locator(id).fill(value);await page.locator(id).press('Tab');}
async function apply(){await page.locator('#plan-apply').click();await loaded();assert.equal(await page.locator('dialog[open]').count(),0);}
async function inspect(){return page.evaluate(()=>{const d=ORBIT_TRIAL_DEBUG,b=d.battle,v=d.view,own=b.ships.filter(s=>s.side==='friendly'&&s.hull>0&&!s.escaped),center=[0,1,2].map(a=>own.reduce((n,s)=>n+s.position[a],0)/own.length);return{own:own.length,enemy:b.ships.filter(s=>s.side==='enemy').length,target:v.controls.target.toArray(),center,calls:v.renderer.info.render.calls,triangles:v.renderer.info.render.triangles,width:innerWidth,scroll:document.body.scrollWidth,fraction:(v.viewportBottom-v.viewportTop)/innerHeight,clipped:b.ships.filter(s=>s.hull>0&&!s.escaped).map(s=>{const p=v.a.fromArray(s.position).project(v.camera);return{x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2,z:p.z};}).filter(p=>p.x<0||p.x>innerWidth||p.y<v.viewportTop||p.y>v.viewportBottom||p.z< -1||p.z>1)};});}
try {
 await page.goto(base+'/battle-trial.html?debug=1');await loaded();assert.equal(await page.evaluate(()=>localStorage.getItem('orbit3077-save')),null);
 let b=await state();assert.ok(b.plan&&b.formations.length);let info=await inspect();assert.ok(info.target.every((v,i)=>Math.abs(v-info.center[i])<1e-6));assert.deepEqual(info.clipped,[]);
 await page.screenshot({path:resolve(output,'overview-390.png')});
 const cdp=await context.newCDPSession(page), camera=()=>page.evaluate(()=>{const v=ORBIT_TRIAL_DEBUG.view;return{p:v.camera.position.toArray(),t:v.controls.target.toArray(),r:v.camera.position.distanceTo(v.controls.target)};});
 const original=await camera();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:170,y:380,id:1}]});for(let i=1;i<=5;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:170+i*9,y:380-i*2,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForFunction(()=>!ORBIT_TRIAL_DEBUG.view.dirty);const rotated=await camera();assert.notDeepEqual(rotated.p,original.p);assert.ok(rotated.t.every((v,i)=>Math.abs(v-original.t[i])<1e-6));assert.ok(Math.abs(rotated.r-original.r)<1e-5);assert.deepEqual(await state(),b);
 await page.locator('[data-camera="overview"]').click();await loaded();
 pass('A fresh installation needs no empire or fleet; overview touch rotation uses the own fleet center without combat changes');
 await openPlanner();const initial=await state();assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.paused),true);await page.screenshot({path:resolve(output,'fleet-planner-390.png')});
 await page.locator('[data-plan-tab="group"]').click();await editName('#plan-group-name','Schwerer Kern');await page.locator('#plan-group-formation').selectOption('line');
 await page.locator('[data-plan-move="right"]').click();assert.ok((await draft()).sides.friendly.ships[0].offset);
 await page.locator('#plan-undo').click();assert.equal((await draft()).sides.friendly.ships[0].offset,null);
 await page.locator('#plan-map').scrollIntoViewIfNeeded();const svg=await page.locator('#plan-map').boundingBox();
 const handle=await page.evaluate(()=>{const p=ORBIT_TRIAL_DEBUG.planner,h=p.handles.find(h=>h.id===p.shipId),b=p.chartBounds;return{x:160+(h.position[0]-b.x)*b.scale,y:115+(h.position[2]-b.z)*b.scale};});
 const x=svg.x+handle.x/320*svg.width,y=svg.y+handle.y/230*svg.height;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});for(let i=1;i<=5;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+i*5,y:y+i*2,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 assert.ok((await draft()).sides.friendly.ships[0].offset);assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.planner.drag),null);
 await page.locator('#plan-new-group').click();const newGroup=await page.locator('#plan-group').inputValue();await editName('#plan-group-name','Begleitschutz');
 await page.locator('.plan-roster>summary').first().click();await page.locator('#plan-type').selectOption('corvette');await page.locator('#plan-count').fill('3');await page.locator('#plan-add-ships').click();assert.equal((await draft()).sides.friendly.ships.filter(s=>s.groupId===newGroup).length,3);
 await page.locator('#plan-group').selectOption((await draft()).sides.friendly.groups[0].id);const transferred=await page.locator('#plan-ship').inputValue();await page.locator('#plan-transfer').selectOption(newGroup);
 assert.equal((await draft()).sides.friendly.ships.find(s=>s.id===transferred).groupId,newGroup);
 await page.locator('[data-plan-tab="fleet"]').click();await page.locator('[data-plan-move="left"]').click();await page.locator('#plan-fleet-heading').selectOption('30');assert.ok((await draft()).sides.friendly.groups.find(g=>g.id===newGroup).offset);
 const anchor=()=>page.evaluate(async()=>{const {fleetLayout}=await import('./build/battle-planner.js');const p=ORBIT_TRIAL_DEBUG.planner;return fleetLayout(p.plan,p.side).groups.find(g=>g.id===p.groupId).position;});
 const beforeNudge=await anchor();await page.locator('[data-plan-move="right"]').click();const afterNudge=await anchor();assert.ok(Math.abs(afterNudge[0]-beforeNudge[0]-30)<1e-7&&Math.abs(afterNudge[2]-beforeNudge[2])<1e-7);
 await page.locator('[data-plan-side="enemy"]').click();await page.locator('[data-plan-tab="group"]').click();await editName('#plan-group-name','Gegnerischer Kern');
 await advanced();await page.locator('#plan-supply').selectOption('60');await page.locator('[data-plan-side="friendly"]').click();
 await page.locator('#plan-map').scrollIntoViewIfNeeded();await page.screenshot({path:resolve(output,'group-planner-390.png')});
 assert.deepEqual(await state(),initial);assert.equal(await page.evaluate(()=>localStorage.getItem('orbit3077-save')),null);
 const expected=await draft();await apply();b=await state();assert.equal(b.ships.filter(s=>s.side==='friendly').length,23);assert.ok(b.ships.filter(s=>s.side==='enemy').every(s=>s.supply===60));assert.deepEqual(b.plan,expected);
 assert.ok(await page.evaluate(async()=>{const {deployTrialPlan}=await import('./build/battle-planner.js');const b=ORBIT_TRIAL_DEBUG.battle,d=deployTrialPlan(b.plan);return b.ships.every(s=>d[s.side].ships.find(p=>p.id===s.sourceId).position.every((v,i)=>Math.abs(v-s.position[i])<1e-8));}));
 pass('Both planners edit names, formations, membership, touch positions, whole group placement and enemy supply; only explicit deployment replaces combat');
 await page.locator('#fleet-open').click();await page.locator(`[data-group="${newGroup}"]`).click();assert.equal((await state()).scope,'group');assert.match(await page.locator('#selected-name').innerText(),/Begleitschutz/);
 await page.locator('#attack-target').click();await page.waitForFunction(()=>ORBIT_TRIAL_DEBUG.view.selectionOverlay.state.sources.length===4);
 b=await state();assert.ok(b.ships.filter(s=>s.group===newGroup).every(s=>s.targeting==='target'));assert.ok(b.ships.filter(s=>s.side==='friendly'&&s.group!==newGroup).every(s=>s.targeting==='auto'));
 assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.view.selectionOverlay.state.links.length),4);
 const rawDraft=await page.evaluate(()=>localStorage.getItem('orbit3077-trial-plan'));
 const newEmpire=createGame({legacy:true});newEmpire.fleets=[];const empireText=JSON.stringify(newEmpire);
 await page.evaluate(raw=>localStorage.setItem('orbit3077-save',raw),empireText);await page.reload();await loaded();b=await state();assert.equal(b.scope,'group');assert.ok(b.ships.filter(s=>s.group===newGroup).every(s=>s.targeting==='target'));assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.selection),null);
 await openPlanner();assert.deepEqual(await draft(),expected);assert.equal(await page.evaluate(()=>localStorage.getItem('orbit3077-trial-plan')),rawDraft);
 await page.locator('[data-close="planner-dialog"]').click();await page.evaluate(()=>localStorage.removeItem('orbit3077-trial'));await page.reload();await loaded();assert.deepEqual((await state()).plan,expected);assert.equal(await page.evaluate(()=>localStorage.getItem('orbit3077-save')),empireText);
 pass('Group orders and target links affect exact members; drafts and checkpoints survive a new empty empire and reload independently');
 for(const [preset,own,enemy] of [['5v35',5,35],['35v5',35,5],['20v20',20,20],['50v50',50,50]]) {
   await openPlanner();await advanced();await page.locator('#plan-preset').selectOption(preset);await page.locator('#plan-load-preset').click();await apply();
   info=await inspect();assert.equal(info.own,own);assert.equal(info.enemy,enemy);assert.deepEqual(info.clipped,[]);assert.ok(info.target.every((v,i)=>Math.abs(v-info.center[i])<1e-6));assert.ok(info.calls<72&&info.triangles<320000);scales.push({preset,...info});
   const shots=await page.evaluate(()=>ORBIT_TRIAL_DEBUG.advance(1/60).filter(e=>e.kind==='fire'));assert.equal(shots.length,own+enemy);assert.ok(shots.every(e=>Math.abs(e.day-1/60)<1e-9));
 }
 pass('All four planned fleet sizes fit portrait, keep physical dimensions and shared opening fire, and use the own fleet pivot');
 await page.setViewportSize({width:320,height:568});await page.evaluate(()=>ORBIT_TRIAL_DEBUG.setCamera('overview',false));await loaded();info=await inspect();assert.equal(info.width,info.scroll);assert.deepEqual(info.clipped,[]);assert.ok(info.fraction>=.8);await page.screenshot({path:resolve(output,'overview-50v50-320.png')});
 await openPlanner();await page.locator('#plan-map').scrollIntoViewIfNeeded();await page.screenshot({path:resolve(output,'fleet-planner-320.png')});
 for(const selector of ['#plan-new-group','#plan-apply']) {await page.locator(selector).scrollIntoViewIfNeeded();const r=await page.locator(selector).boundingBox();assert.ok(r.height>=44&&r.x>=0&&r.x+r.width<=320&&r.y>=0&&r.y+r.height<=568);}
 await page.locator('[data-plan-tab="group"]').click();await page.locator('#plan-map').scrollIntoViewIfNeeded();await page.screenshot({path:resolve(output,'group-planner-320.png')});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),320);
 await page.evaluate(()=>{globalThis.planSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='orbit3077-trial-plan')throw new DOMException('Quota','QuotaExceededError');return planSetItem.call(this,k,v);};});
 await page.locator('[data-plan-move="right"]').click();assert.match(await page.locator('#plan-message').innerText(),/Speichern im Browser nicht möglich/);await page.evaluate(()=>Storage.prototype.setItem=planSetItem);await page.locator('#plan-undo').click();assert.match(await page.locator('#plan-message').innerText(),/Entwurf gespeichert/);
 await page.locator('[data-close="planner-dialog"]').click();await page.locator('#fleet-open').click();await page.locator('[data-group]').first().click();await page.locator('#retreat').scrollIntoViewIfNeeded();await page.locator('#retreat').click();const supply=(await state()).ships.map(s=>s.supply);await page.locator('#retreat-dialog [data-return]').last().click();assert.deepEqual((await state()).ships.map(s=>s.supply),supply);
 await page.locator('#retreat').click();await page.locator('#confirm-retreat').click();await page.evaluate(()=>ORBIT_TRIAL_DEBUG.advance(2));
 await page.waitForFunction(()=>{const d=ORBIT_TRIAL_DEBUG,own=d.battle.ships.filter(s=>s.side==='friendly'&&s.hull>0&&!s.escaped);return d.view.controls.target.toArray().every((v,i)=>Math.abs(v-own.reduce((n,s)=>n+s.position[i],0)/own.length)<1e-6);},null,{timeout:10000});
 const followed=await inspect();assert.ok(followed.target.every((v,i)=>Math.abs(v-followed.center[i])<1e-6));
 assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.paused),true);assert.equal(await page.evaluate(()=>localStorage.getItem('orbit3077-save')),empireText);assert.deepEqual(errors,[]);
 pass('320px portrait keeps both planners and group orders usable, menus remain paused and normal save data stays untouched');
 await writeFile(resolve(output,'browser-inspection.json'),JSON.stringify({base,checks,scales,errors,success:true},null,2));
} catch(e) {await page.screenshot({path:resolve(output,'failure.png'),timeout:30000}).catch(()=>{});await writeFile(resolve(output,'failure.json'),JSON.stringify({message:e.message,errors,checks},null,2));throw e;}
finally {await browser.close();server.close();}
