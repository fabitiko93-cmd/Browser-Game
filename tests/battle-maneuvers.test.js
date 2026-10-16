import test from 'node:test';
import assert from 'node:assert/strict';
import { SHIPS } from '../src/data.js';
import { createTrialPlan, planFromRosters, fleetLayout, addPlanShips, addPlanGroup, validateTrialPlan, AUTO_FORMATIONS } from '../src/battle-planner.js';
import { createBattleTrial, advanceBattleTrial, parseTrial, serializeTrial } from '../src/battle-trial.js';
import { commandManeuver, maneuverInfo, maneuverSpec } from '../src/battle-maneuvers.js';
import { commandDemo, DEMO_STEP } from '../src/battle-demo.js';
import { BattleSelectionOverlay } from '../src/battle-selection-scene.js';
import * as THREE from 'three';
const near=(a,b,t=1e-6)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
const vector=(a,b,t=1e-6)=>a.forEach((v,i)=>near(v,b[i],t));
function fixture(own=['cruiser','corvette'],enemy=['cruiser']){
 const roster=types=>types.map((type,i)=>({id:`${type}-${i}`,name:`${SHIPS[type].name} ${i}`,type}));
 // Participant IDs are unique across the two sides, including draft validation.
 const p=planFromRosters({friendly:roster(own).map(s=>({...s,id:'own-'+s.id})),enemy:roster(enemy).map(s=>({...s,id:'enemy-'+s.id}))});
 const b=createBattleTrial({plan:p});for(const s of b.ships)s.nextFire=119;return b;
}
function choose(b,type){const s=b.ships.find(s=>s.side==='friendly'&&s.strategicType===type);b.selected=s.id;b.selectedGroup=s.group;b.scope='group';return s;}

test('all automatic formations fill mixed groups, preserve membership and keep civilians eligible',()=>{
 const p=createTrialPlan('5v35'),g=p.sides.friendly.groups[0].id;
 for(const type of Object.keys(SHIPS))addPlanShips(p,'friendly',g,type,1);
 const memberships=p.sides.friendly.ships.map(s=>[s.id,s.groupId]);
 for(const form of AUTO_FORMATIONS){p.sides.friendly.groups[0].formation=form;p.sides.friendly.formation=form;const l=fleetLayout(p,'friendly');assert.equal(l.ships.length,p.sides.friendly.ships.length);assert.deepEqual(p.sides.friendly.ships.map(s=>[s.id,s.groupId]),memberships);assert.ok(l.ships.every(s=>s.position.every(Number.isFinite)));}
});
test('groups and mixed group sizes can exceed the old limits without class splits',()=>{
 const p=createTrialPlan('50v50'),g=p.sides.friendly.groups[0].id;addPlanShips(p,'friendly',g,'freighter',70);addPlanShips(p,'friendly',g,'corvette',60);
 const before=fleetLayout(p,'friendly').ships.map(s=>[s.id,s.position]);
 for(let i=0;i<65;i++)addPlanGroup(p,'friendly');
 assert.deepEqual(fleetLayout(p,'friendly').ships.map(s=>[s.id,s.position]),before);
 const clean=validateTrialPlan(p),b=createBattleTrial({plan:clean});assert.equal(b.ships.filter(s=>s.side==='friendly').length,180);assert.ok(clean.sides.friendly.groups.length>50);assert.equal(b.ships.filter(s=>s.group===g).length,135);parseTrial(serializeTrial(b));
 const overlay=new BattleSelectionOverlay(new THREE.Scene());overlay.update(b,{scope:'fleet',selected:b.selected},true,1);assert.equal(overlay.state.sources.length,180);assert.ok(overlay.points.geometry.attributes.position.count>=b.ships.length);assert.ok(overlay.lines.geometry.attributes.position.count>=overlay.state.links.length*2);
 for(const object of [overlay.lines,overlay.points,overlay.paths]){object.geometry.dispose();object.material.dispose();}
});
test('natural heights are significant, reproducible and stored as real combat positions',()=>{
 const p=createTrialPlan('50v50'),a=fleetLayout(p,'friendly'),b=fleetLayout(structuredClone(p),'friendly');assert.deepEqual(a,b);
 const ys=a.ships.map(s=>s.position[1]);assert.ok(Math.max(...ys)-Math.min(...ys)>50);
 assert.ok(new Set(ys.map(y=>y.toFixed(3))).size>40);
});
test('a flank moves exactly its own group; holding and returning to the fleet are actual orders',()=>{
 const b=fixture(),ship=choose(b,'corvette'),own=b.ships.filter(s=>s.side==='friendly'&&s.group===ship.group),others=b.ships.filter(s=>s.side==='friendly'&&s.group!==ship.group),start=structuredClone(own),fixed=others.map(s=>[...s.position]);
 assert.ok(commandManeuver(b,'flank-left'));assert.equal(maneuverInfo(b).mode,'flank-left');advanceBattleTrial(b,1);assert.ok(Math.hypot(...ship.position.map((v,i)=>v-start[0].position[i]))>50);others.forEach((s,i)=>vector(s.position,fixed[i]));
 assert.ok(commandManeuver(b,'hold'));const stopped=[...ship.position];advanceBattleTrial(b,.5);vector(ship.position,stopped);
 assert.ok(commandManeuver(b,'regroup'));advanceBattleTrial(b,15);vector(ship.position,ship.home);assert.equal(b.navigation.groups.find(g=>g.id===ship.group).mode,'fleet');parseTrial(serializeTrial(b));
});
test('left and right flank routes use opposite sides of the own approach direction',()=>{
 const left=fixture(['corvette']),right=structuredClone(left);choose(left,'corvette');choose(right,'corvette');
 assert.ok(commandManeuver(left,'flank-left'));assert.ok(commandManeuver(right,'flank-right'));
 const a=left.navigation.groups.find(g=>g.id===left.selectedGroup),b=right.navigation.groups.find(g=>g.id===right.selectedGroup);
 assert.ok(a.route[0][0]<a.anchor[0]);assert.ok(b.route[0][0]>b.anchor[0]);advanceBattleTrial(left,1);advanceBattleTrial(right,1);assert.ok(left.ships[0].position[0]<right.ships[0].position[0]);
});
test('whole fleet movement shares its pace and slots; a detached group can collect at a moving fleet',()=>{
 const b=fixture(['cruiser','destroyer','corvette']);b.scope='fleet';assert.ok(commandManeuver(b,'attack'));
 const before=b.ships.filter(s=>s.side==='friendly').map(s=>[...s.position]);advanceBattleTrial(b,.5);
 const own=b.ships.filter(s=>s.side==='friendly'),shift=own[0].position.map((v,i)=>v-before[0][i]);assert.ok(Math.hypot(...shift)>10);for(let i=1;i<own.length;i++)vector(own[i].position,before[i].map((v,a)=>v+shift[a]));
 const s=choose(b,'corvette');assert.ok(commandManeuver(b,'flank-right'));advanceBattleTrial(b,1);assert.ok(commandManeuver(b,'fleet'));advanceBattleTrial(b,20);
 const g=b.navigation.groups.find(g=>g.id===s.group),f=b.navigation.fleets.find(f=>f.side==='friendly');vector(g.anchor,f.anchor.map((v,i)=>v+g.offset[i]));vector(s.position,g.anchor.map((v,i)=>v+s.home[i]-g.home[i]));
});
test('heavy bows physically trail a fast flanker and every real shot respects its weapon arc',()=>{
 const b=fixture(['corvette'],['cruiser']),fast=choose(b,'corvette'),heavy=b.ships.find(s=>s.side==='enemy');for(const s of b.ships)s.nextFire=0;for(const s of b.ships)s.combat.power=.001;
 assert.ok(maneuverSpec(fast).speed>maneuverSpec(heavy).speed);assert.ok(maneuverSpec(fast).turnRate>maneuverSpec(heavy).turnRate);assert.ok(commandManeuver(b,'flank-left'));
 let unable=false,shots=0;
 for(let i=0;i<480;i++){
  const events=advanceBattleTrial(b,DEMO_STEP),toward=fast.position.map((v,a)=>v-heavy.position[a]),length=Math.hypot(...toward),angle=Math.acos(Math.max(-1,Math.min(1,heavy.facing.reduce((n,v,a)=>n+v*toward[a]/length,0))));
  if(angle>maneuverSpec(heavy).fireArc+.03)unable=true;
  for(const e of events.filter(e=>e.kind==='fire')){shots++;const s=b.ships.find(s=>s.id===e.ship),d=e.to.map((v,a)=>v-e.from[a]),n=Math.hypot(...d);assert.ok(s.facing.reduce((sum,v,a)=>sum+v*d[a]/n,0)>=Math.cos(maneuverSpec(s).fireArc)-.001);}
 }
 assert.ok(unable);assert.ok(shots>1);parseTrial(serializeTrial(b));
});
test('collision clearance prevents moving members from passing through a held hull',()=>{
 const b=fixture(['cruiser','corvette']),fast=choose(b,'corvette'),heavy=b.ships.find(s=>s.side==='friendly'&&s!==fast),g=b.navigation.groups.find(g=>g.id===fast.group);
 g.mode='hold';g.anchor=[...heavy.position];
 for(let i=0;i<360;i++){advanceBattleTrial(b,DEMO_STEP);assert.ok(Math.hypot(...fast.position.map((v,a)=>v-heavy.position[a]))>=(fast.length+heavy.length)/2+11.9);}
});
test('maneuver routes are previewed while paused and do not change target commands or resources',()=>{
 const b=fixture(),s=choose(b,'corvette'),before=b.ships.map(s=>({position:[...s.position],targeting:s.targeting,supply:s.supply}));
 assert.ok(commandManeuver(b,'flank-right'));assert.equal(b.tick,0);assert.deepEqual(b.ships.map(s=>({position:[...s.position],targeting:s.targeting,supply:s.supply})),before);
 const overlay=new BattleSelectionOverlay(new THREE.Scene());overlay.update(b,{scope:'group',group:s.group,selected:s.id},true,1);assert.ok(overlay.paths.visible&&overlay.paths.geometry.drawRange.count>=4);
 overlay.update(b,null,true,1);assert.equal(overlay.paths.visible,false);for(const o of [overlay.paths,overlay.lines,overlay.points]){o.geometry.dispose();o.material.dispose();}
 commandDemo(b,'retreat');assert.equal(commandManeuver(b,'attack'),false);b.scope='ship';assert.equal(commandManeuver(b,'fleet'),false);
});
test('maneuvers survive pauses and checkpoints with identical fixed-step results',()=>{
 const a=fixture(['cruiser','corvette'],['cruiser','destroyer']),ship=choose(a,'corvette');commandManeuver(a,'flank-right');const b=parseTrial(serializeTrial(a));
 for(let i=0;i<20;i++)advanceBattleTrial(a,.1);for(let i=0;i<200;i++)advanceBattleTrial(b,.01);near(a.remainder,b.remainder,1e-10);b.remainder=a.remainder;assert.deepEqual(a,b);
 const checkpoint=parseTrial(serializeTrial(a));assert.deepEqual(advanceBattleTrial(a,2),advanceBattleTrial(checkpoint,2));assert.deepEqual(a,checkpoint);
 for(const mutate of [v=>v.navigation.groups[0].mode='teleport',v=>v.navigation.groups[0].anchor=[NaN,0,0],v=>v.navigation.fleets[1].side='friendly',v=>v.navigation.groups[0].target=ship.id,v=>v.navigation.groups.push(v.navigation.groups[0])]){const bad=structuredClone(a);mutate(bad);assert.throws(()=>parseTrial(serializeTrial(bad)));}
});
test('a flank keeps its outside waypoint attached to a moving opponent',()=>{
 const b=fixture(['corvette'],['cruiser']);choose(b,'corvette');assert.ok(commandManeuver(b,'flank-left'));
 const nav=b.navigation.groups.find(g=>g.id===b.selectedGroup),target=b.ships.find(s=>s.id===nav.target),enemy=b.navigation.groups.find(g=>g.id===target.group);
 enemy.mode='attack';const start=[...target.position],outside=nav.route[1].map((v,i)=>v-target.position[i]);
 for(let i=0;i<60;i++){const previous=[...target.position];advanceBattleTrial(b,DEMO_STEP);vector(nav.route[1],previous.map((v,a)=>v+outside[a]));}
 assert.ok(Math.hypot(...target.position.map((v,i)=>v-start[i]))>10);parseTrial(serializeTrial(b));
});
test('older planned checkpoints gain fleet binding without changing saved positions or orders',()=>{
 const b=fixture(),before=b.ships.map(s=>({position:[...s.position],order:s.order,targeting:s.targeting}));delete b.navigation;
 const loaded=parseTrial(serializeTrial(b));assert.equal(loaded.navigation.fleets.length,2);assert.ok(loaded.navigation.groups.every(g=>g.mode==='fleet'));
 assert.deepEqual(loaded.ships.map(s=>({position:[...s.position],order:s.order,targeting:s.targeting})),before);advanceBattleTrial(loaded,1);loaded.ships.forEach((s,i)=>vector(s.position,before[i].position));
});
