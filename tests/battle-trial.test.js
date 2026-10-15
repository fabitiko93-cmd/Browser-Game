import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, getPlanet } from '../src/state.js';
import { exportGame } from '../src/save.js';
import { fleetStrength, shipArmor } from '../src/fleets.js';
import { SHIPS } from '../src/data.js';
import { createBattleTrial, advanceBattleTrial, trialSummary, trialPorts, serializeTrial, parseTrial, TRIAL_LIMIT } from '../src/battle-trial.js';
import { activeShip, commandDemo, shipStrength, DEMO_CLASSES, DEMO_STEP } from '../src/battle-demo.js';
import { contactInfo, enemyContacts } from '../src/battle-targets.js';
import { commandDisplay } from '../src/harbinger-display.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
function fleetState(){const s=createGame({legacy:true});s.tech=['targeting','lasers','shielding'];s.player.ideology='military';s.governance.laws.service='reserve';s.governance.decisions=[{id:'mobilize',until:80}];for(const[i,f]of s.fleets.entries()){f.hp=80-i*20;f.supply=60-i*10;}return s;}
function duel(type='cruiser') {const b=createBattleTrial({scenario:'5v35'}), own=b.ships.find(s=>s.side==='friendly'&&s.strategicType===type),enemy=structuredClone(own);enemy.id='duel-enemy';enemy.side='enemy';enemy.position=[0,0,-1000];enemy.home=[...enemy.position];enemy.facing=[0,0,1];own.position=[0,0,1000];own.home=[...own.position];own.facing=[0,0,-1];b.ships=[own,enemy];b.selected=own.id;b.target=enemy.id;return b;}

test('each preset uses actual strategic classes, equal dimensions, no personal shields and real base strength',()=>{
 for(const[scenario,own,enemy]of[['20v20',20,20],['5v35',5,35],['35v5',35,5],['50v50',50,50]]){
 const b=createBattleTrial({scenario});assert.equal(b.ships.filter(s=>s.side==='friendly').length,own);assert.equal(b.ships.filter(s=>s.side==='enemy').length,enemy);
 for(const s of b.ships){assert.ok(Object.hasOwn(SHIPS,s.strategicType));assert.equal(s.className,SHIPS[s.strategicType].name);assert.equal(s.shield,0);near(shipStrength(s),SHIPS[s.strategicType].strength);near(s.combat.armor,SHIPS[s.strategicType].armor??0);}
 const sizes=new Map();for(const s of b.ships){if(sizes.has(s.strategicType))assert.equal(s.length,sizes.get(s.strategicType));sizes.set(s.strategicType,s.length);}parseTrial(serializeTrial(b));
 }
});
test('copied fleets retain real names, hull, supply, technology and policy effects without touching the empire',()=>{
 const s=fleetState(),before=exportGame(s),ports=trialPorts(s),b=createBattleTrial({mode:'fleet',state:s,planetId:'nereid'});assert.equal(ports[0].count,2);
 for(const f of s.fleets){const v=b.ships.find(v=>v.sourceId===f.id);assert.equal(v.name,f.name);near(v.hull/DEMO_CLASSES[v.type].hull*100,f.hp);assert.equal(v.supply,f.supply);near(shipStrength(v),fleetStrength(s,f));near(v.combat.armor,shipArmor(s,f));}
 commandDemo(b,'scope','fleet');commandDemo(b,'attack');advanceBattleTrial(b,2);commandDemo(b,'retreat');advanceBattleTrial(b,15);assert.equal(exportGame(s),before);
 const reloaded=parseTrial(serializeTrial(b));assert.deepEqual(reloaded,b);
});
test('fleet copies cover all twelve classes and reject busy, empty or oversized groups',()=>{
 const s=fleetState(),prototype=structuredClone(s.fleets[0]);s.fleets=Object.keys(SHIPS).map((type,i)=>({...structuredClone(prototype),id:`f-${i}`,type}));
 const b=createBattleTrial({mode:'fleet',state:s,planetId:'nereid'});assert.equal(b.ships.filter(s=>s.side==='friendly').length,Object.keys(SHIPS).length);
 s.fleets[0].mission={kind:'move'};s.fleets[1].route={};assert.equal(trialPorts(s)[0].count,Object.keys(SHIPS).length-2);
 assert.throws(()=>createBattleTrial({mode:'fleet',state:s,planetId:'missing'}));
 s.fleets=Array.from({length:TRIAL_LIMIT+1},(_,i)=>({...structuredClone(prototype),id:`big-${i}`}));assert.throws(()=>createBattleTrial({mode:'fleet',state:s,planetId:'nereid'}));
 assert.throws(()=>createBattleTrial({mode:'profile'}));assert.throws(()=>createBattleTrial({scenario:'bad'}));
});
test('supply and research affect firepower according to the existing fleet formula',()=>{
 const full=createBattleTrial(),low=createBattleTrial({friendlySupply:20}),s=fleetState(),researched=createBattleTrial({mode:'profile',state:s});
 near(shipStrength(low.ships[0]),shipStrength(full.ships[0])*.3);assert.ok(shipStrength(researched.ships[0])>shipStrength(full.ships[0]));assert.ok(researched.ships[0].combat.armor>full.ships[0].combat.armor);
 const healthy=duel(),damaged=duel();damaged.ships[0].hull*=.5;near(shipStrength(damaged.ships[0]),shipStrength(healthy.ships[0])*.5);
});
test('armor reduces real hit damage, and torpedoes change hull only on impact',()=>{
 const armored=duel(),bare=duel();for(const b of[armored,bare]){b.ships[1].nextFire=100;b.ships[1].combat.power=0;}
 bare.ships[1].combat.armor=0;
 const first=advanceBattleTrial(armored,.4);assert.ok(first.some(e=>e.kind==='fire'));assert.equal(armored.ships[1].hull,armored.ships[1].initialHull);
 advanceBattleTrial(bare,.4);const hits=advanceBattleTrial(armored,1.8);advanceBattleTrial(bare,1.8);assert.ok(hits.some(e=>e.kind==='impact'));
 const a=armored.ships[1],n=bare.ships[1];near(a.initialHull-a.hull,(n.initialHull-n.hull)*(1-a.combat.armor));assert.equal(a.shield,0);
});
test('unarmed support ships cannot fire or receive attacks, but can withdraw if funded',()=>{
 const state=createGame({legacy:true});state.fleets[0].type='support';const b=createBattleTrial({mode:'fleet',state,planetId:'nereid'}),s=b.ships.find(s=>s.side==='friendly'&&s.strategicType==='support');b.selected=s.id;
 assert.equal(commandDemo(b,'attack'),false);assert.equal(commandDemo(b,'priority','cruiser'),false);assert.equal(commandDisplay(b).canAttack,false);assert.equal(commandDisplay(b).canRetreat,true);
 assert.ok(!advanceBattleTrial(b,.1).some(e=>e.kind==='fire'&&e.ship===s.id));assert.equal(commandDemo(b,'retreat'),true);near(s.supply,92);
});
test('retreat is atomic, consumes actual trial energy and cannot be canceled by an attack',()=>{
 const b=createBattleTrial();commandDemo(b,'scope','fleet');const own=b.ships.filter(s=>s.side==='friendly');own[1].supply=1;const before=structuredClone(own);
 assert.equal(commandDemo(b,'retreat'),false);assert.deepEqual(own,before);assert.equal(commandDisplay(b).canRetreat,false);
 own[1].supply=100;assert.equal(commandDemo(b,'retreat'),true);for(const s of own){near(s.supply,92);assert.equal(s.order,'retreat');}
 assert.equal(commandDemo(b,'attack'),false);const events=advanceBattleTrial(b,20);assert.equal(b.phase,'withdrawn');assert.ok(events.some(e=>e.kind==='escape'));const summary=trialSummary(b,'friendly');assert.ok(summary.escaped>0);assert.equal(summary.escaped+summary.destroyed,20);
});
test('orders affect only their scope, real class filters separate landers from corvettes and inspection is harmless',()=>{
 const b=createBattleTrial(),own=b.ships[0],lander=b.ships.find(s=>s.side==='enemy'&&s.strategicType==='corvette');lander.strategicType='lander';lander.className=SHIPS.lander.name;lander.length=20;lander.combat.power=2;b.target=lander.id;assert.equal(own.targeting,'auto');
 assert.equal(commandDemo(b,'priority','lander'),true);assert.equal(own.priority,'lander');assert.equal(b.ships[1].targeting,'auto');
 const hits=advanceBattleTrial(b,2);assert.ok(hits.filter(e=>e.kind==='fire'&&e.ship===own.id).every(e=>e.target===b.target));
 const contacts=enemyContacts(b,{type:'lander'});assert.ok(contacts.contacts.every(c=>c.type==='lander'));assert.ok(contacts.contacts.every(c=>c.className===SHIPS.lander.name));assert.equal(contactInfo(b.ships[0],b.ships[1]).hasShield,false);
});
test('targeting decisions change actual damage and retreat changes the outcome of an otherwise identical match',()=>{
 const normal=duel(),retreat=duel();commandDemo(retreat,'retreat');advanceBattleTrial(retreat,20);assert.equal(retreat.phase,'withdrawn');
 advanceBattleTrial(normal,100);assert.notEqual(normal.phase,'withdrawn');assert.ok(normal.ships.some(s=>s.hull===0));
 const a=createBattleTrial(),b=createBattleTrial();commandDemo(b,'scope','fleet');b.target=b.ships.find(s=>s.side==='enemy'&&s.strategicType==='cruiser').id;commandDemo(b,'attack');advanceBattleTrial(a,6);advanceBattleTrial(b,6);assert.notDeepEqual(a.ships.map(s=>s.hull),b.ships.map(s=>s.hull));
});
test('last salvos remain causal after launchers die and can produce mutual destruction',()=>{
 const b=duel();for(const s of b.ships){s.hull=20;s.combat.power*=20;}
 advanceBattleTrial(b,.5);assert.equal(b.projectiles.length,2);const target=b.ships[1];target.hull=0;
 const events=advanceBattleTrial(b,2);assert.ok(events.some(e=>e.kind==='impact'&&e.ship===target.id));assert.equal(b.ships[0].hull,0);assert.equal(b.phase,'draw');
});
test('render rate, pause, checkpoints and finished-state reload cannot change combat results',()=>{
 const a=createBattleTrial(),b=createBattleTrial(),eventsA=[],eventsB=[];for(let i=0;i<100;i++)eventsA.push(...advanceBattleTrial(a,.1));for(let i=0;i<1000;i++)eventsB.push(...advanceBattleTrial(b,.01));
 assert.deepEqual(a.ships,b.ships);assert.deepEqual(a.projectiles,b.projectiles);assert.deepEqual(eventsA,eventsB);
 const checkpoint=parseTrial(serializeTrial(a));const left=advanceBattleTrial(a,30),right=advanceBattleTrial(checkpoint,30);assert.deepEqual(left,right);assert.deepEqual(a,checkpoint);
 const before=serializeTrial(a);assert.deepEqual(advanceBattleTrial(a,0),[]);assert.equal(serializeTrial(a),before);assert.throws(()=>advanceBattleTrial(a,Infinity));
 advanceBattleTrial(a,120);assert.notEqual(a.phase,'engaged');const ended=parseTrial(serializeTrial(a));assert.deepEqual(advanceBattleTrial(ended,20),[]);assert.deepEqual(ended,a);
});
test('checkpoint validation rejects bad classes, orders, resources, vectors and cross-side identities',()=>{
 const b=createBattleTrial();advanceBattleTrial(b,.5);
 for(const mutate of[v=>v.version=2,v=>v.battle.ships[0].supply=-1,v=>v.battle.ships[0].combat.armor=2,v=>v.battle.ships[0].strategicType='constructor',v=>v.battle.ships[0].hull=1000,v=>v.battle.ships[0].facing=[0,0,0],v=>v.battle.selected=v.battle.target,v=>v.battle.ships[0].commandTarget=v.battle.ships[0].id,v=>v.battle.projectiles[0].damage=-1,v=>v.battle.tick=NaN,v=>v.battle.ships.push(v.battle.ships[0])]){
 const v=JSON.parse(serializeTrial(b));mutate(v);assert.throws(()=>parseTrial(JSON.stringify(v)));
 }
});

test('simultaneous laser salvos do not favor the side processed first',()=>{
 const b=duel('corvette');for(const s of b.ships)s.combat.power=1e5;
 const events=advanceBattleTrial(b,.8);assert.equal(events.filter(e=>e.kind==='fire').length,2);assert.ok(b.ships.every(s=>s.hull===0));assert.equal(b.phase,'draw');
});
test('a checkpoint remains valid while the last torpedoes resolve beyond the firing limit',()=>{
 const b=duel();b.tick=7194;b.day=b.tick*DEMO_STEP;for(const s of b.ships)s.nextFire=119.95;
 advanceBattleTrial(b,.3);assert.equal(b.phase,'engaged');assert.ok(b.projectiles.length>0);const restored=parseTrial(serializeTrial(b));
 const events=advanceBattleTrial(restored,10);assert.ok(!events.some(e=>e.kind==='fire'));assert.equal(restored.phase,'stalemate');parseTrial(serializeTrial(restored));
});
