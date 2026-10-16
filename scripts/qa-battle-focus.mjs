import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, chmod } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { createGame } from '../src/state.js';
const root=resolve(import.meta.dirname,'..'), output=process.env.ORBIT_QA_OUTPUT_DIR??resolve(root,'review-focus');
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
try{
 const seed=createGame({legacy:true});seed.started=true;seed.tech=['targeting','lasers','shielding'];seed.player.ideology='military';seed.fleets[0].hp=80;seed.fleets[0].supply=60;seed.fleets[1].hp=60;seed.fleets[1].supply=50;
 const empire=JSON.stringify(seed);await context.addInitScript(raw=>{if(!sessionStorage.getItem('focus-seed')){localStorage.setItem('orbit3077-save',raw);sessionStorage.setItem('focus-seed','1');}},empire);
 await page.goto(base+'/battle-trial.html?debug=1');await loaded();
 async function setup(scenario,mode='baseline',supply='100'){
   await page.locator('#graphics-open').click();await page.locator('#setup-open').click();await page.locator('#source-mode').selectOption(mode);await page.locator('#scenario-select').selectOption(scenario);if(mode!=='fleet')await page.locator('#friendly-supply').selectOption(supply);await page.locator('#restart').click();await loaded();
 }
 const camera=()=>page.evaluate(()=>{const v=ORBIT_TRIAL_DEBUG.view;return{p:v.camera.position.toArray(),t:v.controls.target.toArray(),r:v.camera.position.distanceTo(v.controls.target),fov:v.camera.fov};});
 const settled=()=>page.waitForFunction(()=>!ORBIT_TRIAL_DEBUG.view.transition&&!ORBIT_TRIAL_DEBUG.view.dirty);
 async function worldPoint(side){return page.evaluate(async side=>{
   await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
   const d=ORBIT_TRIAL_DEBUG,v=d.view,blocked=[...document.querySelectorAll('[data-focus-group]:not([hidden]),.lab-marker:not([hidden])')].map(n=>n.getBoundingClientRect());
   for(const s of d.battle.ships.filter(s=>s.side===side&&s.hull>0&&!s.escaped&&s.id!==d.focus?.id)){
     const p=v.a.fromArray(s.position).project(v.camera),x=(p.x+1)*innerWidth/2,y=(1-p.y)*innerHeight/2;
     if(x>10&&x<innerWidth-10&&y>v.viewportTop+30&&y<v.viewportBottom-30&&document.elementFromPoint(x,y)?.id==='battle-canvas'&&!blocked.some(r=>x>r.left-8&&x<r.right+8&&y>r.top-8&&y<r.bottom+8)&&v.pickContact(x,y)===s.id)return{id:s.id,x,y};
   }return null;
 },side);}
 await openPlanner();await page.locator('[data-plan-tab="group"]').click();await editName('#plan-group-name','Offener Entwurf');const edited=await draft();await page.locator('[data-close="planner-dialog"]').click();await openPlanner();assert.deepEqual(await draft(),edited);await page.locator('[data-close="planner-dialog"]').click();
 await setup('50v50');let b=await state();assert.equal(b.ships.length,100);await openPlanner();let p=await draft();assert.equal(p.sides.friendly.ships.length,50);assert.equal(p.sides.enemy.ships.length,50);assert.ok(!p.sides.friendly.groups.some(g=>g.name==='Offener Entwurf'));await page.locator('[data-close="planner-dialog"]').click();
 pass('A new 50:50 probe replaces a stale 20:20 draft; reopening the same probe preserves unapplied edits');
 const unchanged=await state(),formationMaps={};await openPlanner();
 for(const formation of ['auto','line','wedge','screen']){
   await page.locator('#plan-fleet-formation').selectOption(formation);
   formationMaps[formation]=await page.evaluate(()=>ORBIT_TRIAL_DEBUG.planner.handles.map(h=>[h.id,h.position]));
   assert.ok((await page.locator('#plan-formation-help').innerText()).length>30);
 }
 assert.notDeepEqual(formationMaps.auto,formationMaps.screen);assert.notDeepEqual(formationMaps.auto,formationMaps.line);assert.notDeepEqual(formationMaps.auto,formationMaps.wedge);
 const resizedDraft=await draft();await page.setViewportSize({width:320,height:568});await settled();
 assert.ok(await page.locator('#planner-dialog').evaluate(d=>d.open));assert.deepEqual(await draft(),resizedDraft);
 await page.setViewportSize({width:390,height:844});await settled();assert.ok(await page.locator('#planner-dialog').evaluate(d=>d.open));
 await page.locator('#plan-fleet-formation').selectOption('auto');await page.locator('[data-close="planner-dialog"]').click();assert.deepEqual(await state(),unchanged);
 pass('The actual fleet selector explains distinct formations, preserves its open dialog and draft across portrait resize, and never issues orders');
 const point=await worldPoint('friendly');assert.ok(point);const before=await state(),oldCamera=await camera();await page.touchscreen.tap(point.x,point.y);await settled();
 assert.equal(await page.locator('dialog[open]').count(),0);assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.focus.id),point.id);assert.deepEqual(await state(),before);let cam=await camera();assert.ok(Math.abs(cam.r-oldCamera.r)<1e-5);assert.equal(cam.fov,oldCamera.fov);
 const selected=(await state()).ships.find(s=>s.id===point.id);assert.ok(cam.t.every((v,i)=>Math.abs(v-selected.position[i])<1e-6));
 const projected=await page.evaluate(id=>{const v=ORBIT_TRIAL_DEBUG.view,s=ORBIT_TRIAL_DEBUG.battle.ships.find(s=>s.id===id),p=v.a.fromArray(s.position).project(v.camera);return{y:(1-p.y)*innerHeight/2,center:(v.viewportTop+v.viewportBottom)/2};},point.id);assert.ok(Math.abs(projected.y-projected.center)<1);
 const touchOrigin=await page.evaluate(()=>{const v=ORBIT_TRIAL_DEBUG.view;for(const y of [220,300,400])for(const x of [100,180,260])if([0,8,16,24,32].every(dx=>document.elementFromPoint(x+dx,y)?.id==='battle-canvas'))return{x,y};return null;});assert.ok(touchOrigin);
 const orbitBefore=await camera(),cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...touchOrigin,id:1}]});for(let i=1;i<=4;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:touchOrigin.x+i*8,y:touchOrigin.y,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await settled();const orbitAfter=await camera();assert.notDeepEqual(orbitAfter.p,orbitBefore.p);assert.ok(orbitAfter.t.every((v,i)=>Math.abs(v-orbitBefore.t[i])<1e-6));assert.ok(Math.abs(orbitAfter.r-orbitBefore.r)<1e-5);
 await page.locator('#focus-details').click();assert.ok(await page.locator('#info-dialog').evaluate(d=>d.open));await page.locator('[data-close="info-dialog"]').click();assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.focus.id),point.id);
 await page.locator('#focus-orders').click();assert.equal((await state()).selected,point.id);assert.equal((await state()).scope,'ship');assert.equal(await page.locator('#selected-name').innerText(),selected.name);await page.locator('[data-close="orders-dialog"]').click();
 pass('A real world tap centers the chosen ship without a menu, pause or combat change; zoom and FOV stay stable and explicit actions name its recipient');
 await page.locator('#fleet-open').click();await page.locator('#select-fleet').click();await page.locator('[data-close="orders-dialog"]').click();
 await page.waitForFunction(()=>ORBIT_TRIAL_DEBUG.view.selectionOverlay.state.sources.length===50);
 const fleetReceiver=await page.evaluate(()=>ORBIT_TRIAL_DEBUG.selection),fleetState=await state(),newPoint=await worldPoint('friendly');assert.ok(newPoint);
 await page.touchscreen.tap(newPoint.x,newPoint.y);await settled();
 assert.deepEqual(await state(),fleetState);assert.deepEqual(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.selection),fleetReceiver);
 assert.deepEqual(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.view.selectionOverlay.state.sources),[]);
 assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.view.selectionOverlay.points.visible),false);
 assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.view.selectionOverlay.lines.visible),false);
 assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.view.selectionOverlay.paths.visible),false);
 assert.equal(await page.locator('#selection-readout').isVisible(),false);assert.equal(await page.locator('dialog[open]').count(),0);
 await page.locator('#focus-clear').click();await settled();assert.deepEqual(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.view.selectionOverlay.state.sources),[]);
 const reselected=await worldPoint('friendly');assert.ok(reselected);await page.touchscreen.tap(reselected.x,reselected.y);await settled();await page.locator('#focus-orders').click();
 await page.waitForFunction(()=>ORBIT_TRIAL_DEBUG.view.selectionOverlay.state.sources.length===1);
 assert.equal((await state()).selected,reselected.id);assert.equal((await state()).scope,'ship');
 assert.deepEqual(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.view.selectionOverlay.state.sources),[reselected.id]);await page.locator('[data-close="orders-dialog"]').click();
 pass('A new world focus removes all former fleet marks, targets, routes and readout; orders and recipients stay intact until an explicit new command selection');
 const marker=page.locator('[data-focus-group]:visible').first(),group=await marker.getAttribute('data-focus-group');const markerBox=await marker.boundingBox();await page.touchscreen.tap(markerBox.x+markerBox.width/2,markerBox.y+markerBox.height/2);await settled();assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.focus.kind),'group');
 await page.locator('#focus-orders').click();assert.equal((await state()).selectedGroup,group);assert.equal((await state()).scope,'group');await page.waitForFunction(group=>ORBIT_TRIAL_DEBUG.view.selectionOverlay.state.sources.every(id=>ORBIT_TRIAL_DEBUG.battle.ships.find(s=>s.id===id).group===group)&&ORBIT_TRIAL_DEBUG.view.selectionOverlay.state.sources.length>0,group);await page.locator('#maneuvers-open').click();await page.locator('[data-maneuver="flank-left"]').click();
 const at=await camera();await page.locator('#battle-pause').click();await page.waitForFunction(()=>ORBIT_TRIAL_DEBUG.battle.day>.5);await page.locator('#battle-pause').click();await settled();cam=await camera();
 const center=await page.evaluate(group=>{const ships=ORBIT_TRIAL_DEBUG.battle.ships.filter(s=>s.group===group&&s.hull>0&&!s.escaped);return[0,1,2].map(a=>ships.reduce((n,s)=>n+s.position[a],0)/ships.length);},group);
 assert.ok(cam.t.every((v,i)=>Math.abs(v-center[i])<1e-6));assert.ok(Math.hypot(...cam.t.map((v,i)=>v-at.t[i]))>5);assert.ok(Math.abs(cam.r-at.r)<1e-5);
 await page.setViewportSize({width:320,height:568});await settled();assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.focus.id),group);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),320);for(const node of await page.locator('#focus-bar button:visible').all()){const r=await node.boundingBox();assert.ok(r.height>=44&&r.x>=0&&r.x+r.width<=320);}
 await page.screenshot({path:resolve(output,'group-focus-320.png')});
 await page.locator('#battle-pause').click();await page.waitForFunction(()=>!ORBIT_TRIAL_DEBUG.paused);const runningPoint=await worldPoint('friendly');assert.ok(runningPoint);await page.touchscreen.tap(runningPoint.x,runningPoint.y);assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.paused),false);assert.equal(await page.locator('dialog[open]').count(),0);await page.locator('#battle-pause').click();await settled();assert.deepEqual(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.view.selectionOverlay.state.sources),[]);assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.view.selectionOverlay.paths.visible),false);
 pass('Group markers focus a moving formation, preserve orbital distance across resize, and tapping while combat runs never opens a menu or pauses');
 await page.setViewportSize({width:390,height:844});await page.locator('[data-camera="overview"]').click();await settled();assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.focus),null);assert.equal(await page.locator('#focus-bar').isVisible(),false);
 const ordersBefore=await page.evaluate(()=>ORBIT_TRIAL_DEBUG.battle.ships.map(s=>({id:s.id,order:s.order,targeting:s.targeting,commandTarget:s.commandTarget}))),receiver=(await state()).selected;
 const enemy=await worldPoint('enemy');assert.ok(enemy);await page.touchscreen.tap(enemy.x,enemy.y);await settled();
 assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.focus?.kind),'ship');assert.equal(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.focus?.id),enemy.id);
 assert.equal(await page.locator('dialog[open]').count(),0);assert.equal((await state()).selected,receiver);assert.deepEqual(await page.evaluate(()=>ORBIT_TRIAL_DEBUG.battle.ships.map(s=>({id:s.id,order:s.order,targeting:s.targeting,commandTarget:s.commandTarget}))),ordersBefore);
 await page.locator('#focus-target').click();assert.equal((await state()).target,enemy.id);assert.equal((await state()).selected,receiver);assert.ok(await page.locator('#orders-dialog').evaluate(d=>d.open));await page.locator('[data-close="orders-dialog"]').click();await page.locator('[data-camera="overview"]').click();await settled();
 pass('Enemy focus preserves the existing recipients and weapon orders; only the explicit target action proposes that enemy');
 await setup('35v5','profile','60');b=await state();const bonus=b.ships.find(s=>s.side==='friendly').combat;assert.equal(b.setup.mode,'profile');assert.ok(bonus.armor>.35);await openPlanner();await apply();b=await state();assert.equal(b.setup.mode,'profile');assert.ok(b.ships.filter(s=>s.side==='friendly').every(s=>s.supply===60));assert.deepEqual(b.ships.find(s=>s.side==='friendly').combat,bonus);
 await setup('5v35','fleet');b=await state();const starting=b.ships.filter(s=>s.side==='friendly').map(s=>({id:s.id,hull:s.hull,supply:s.supply,combat:s.combat}));await page.evaluate(()=>ORBIT_TRIAL_DEBUG.advance(.2));await openPlanner();
 const preview=await page.evaluate(async()=>{const p=ORBIT_TRIAL_DEBUG.planner,m=await import('./build/battle-planner.js'),layout=m.fleetLayout(p.plan,p.side,p.source.preparation);return{visible:p.handles.map(h=>[h.id,h.position]),expected:layout.groups.map(g=>[g.id,g.position]),spawn:m.deployTrialPlan(p.plan,p.source.preparation).friendly.ships.map(s=>[s.id,s.position])};});
 assert.deepEqual(preview.visible,preview.expected);await apply();b=await state();assert.equal(b.setup.mode,'fleet');assert.equal(b.tick,0);assert.deepEqual(b.ships.filter(s=>s.side==='friendly').map(s=>({id:s.id,hull:s.hull,supply:s.supply,combat:s.combat})),starting);assert.deepEqual(b.ships.filter(s=>s.side==='friendly').map(s=>[s.sourceId,s.position]),preview.spawn);assert.equal(await page.evaluate(()=>localStorage.getItem('orbit3077-save')),empire);
 await openPlanner();await page.locator('[data-plan-tab="group"]').click();await editName('#plan-group-name','Erhaltener Kopie-Entwurf');p=await draft();await page.locator('[data-close="planner-dialog"]').click();await page.reload();await loaded();await openPlanner();assert.deepEqual(await draft(),p);await page.locator('[data-close="planner-dialog"]').click();
 await context.addInitScript(()=>{if(!sessionStorage.getItem('focus-recover')){localStorage.removeItem('orbit3077-trial');localStorage.removeItem('orbit3077-save');sessionStorage.setItem('focus-recover','1');}});await page.reload();await loaded();assert.equal((await state()).setup.mode,'fleet');assert.deepEqual((await state()).plan,p);assert.deepEqual((await state()).ships.filter(s=>s.side==='friendly').map(s=>({id:s.id,hull:s.hull,supply:s.supply,combat:s.combat})),starting);
 pass('Planning retains research, individual copied starting hull and supply, open edits and a recoverable draft without requiring an empire');
 assert.deepEqual(errors,[]);await writeFile(resolve(output,'browser-inspection.json'),JSON.stringify({checks,errors,success:true},null,2));
}catch(e){await page.screenshot({path:resolve(output,'failure.png')}).catch(()=>{});await writeFile(resolve(output,'failure.json'),JSON.stringify({message:e.message,errors,checks},null,2));throw e;}
finally{await browser.close();server.close();}
