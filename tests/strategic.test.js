import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, getPlanet } from '../src/state.js';
import { baseStats, tickShields, launchStrike, tickStrikes, destroyPlanet, tickGoals } from '../src/strategic.js';
import { forecastDay } from '../src/budget.js';
import { stepDay } from '../src/simulation.js';
import { placeBuilding } from '../src/economy.js';
import { orderFleet, resolveBattle } from '../src/fleets.js';
import { validateSave } from '../src/save.js';
import { renderSheet } from '../src/ui.js';
import { TECHNOLOGIES, BUILDINGS } from '../src/data.js';
const home=s=>getPlanet(s,'nereid');
const add=(p,type,x=7,y=7)=>{const b={id:`${p.id}-${type}`,type,x,y,remaining:0,enabled:true,status:'aktiv'};p.buildings.push(b);return b;};
function ready(type='missile') {const s=createGame();s.credits=100000;s.tech=['targeting','missileDoctrine','fusionWarheads','annihilator','starBreaker'];for(const k of Object.keys(home(s).stock))home(s).stock[k]=100000;s.relations.ilyri.war=true;add(home(s),type==='starbreaker'?'stellarForge':type==='worldbreaker'?'planetLance':'missileSilo');return s;}
function finish(s){for(let i=0;i<100&&s.strikes.length;i++)tickStrikes(s);}
test('basenbau enforces research before booking and shields require active supplied infrastructure',()=>{
 const s=createGame(),p=home(s),before=structuredClone(s);assert.ok(placeBuilding(s,p,'shield',7,7));assert.deepEqual(s,before);
 const b=add(p,'shield');tickShields(s);assert.equal(p.shield,12);assert.equal(baseStats(s,p).capacity,180);
 b.status='Rohstoffe fehlen';tickShields(s);assert.equal(p.shield,0);b.status='aktiv';s.tech.push('shieldResonance');tickShields(s);assert.ok(Math.abs(p.shield-14.4)<1e-8);
});
test('shield consumption is included in the same recurring forecast as actual simulation',()=>{
 const s=createGame(),p=home(s);p.population=240;add(p,'shield');const f=forecastDay(s),energy=p.stock.energy;stepDay(s);assert.ok(Math.abs(p.stock.energy-energy-f.planets[0].net.energy)<1e-8);assert.equal(p.shield,f.planets[0].shield);
});
test('launch validates diplomacy, costs, research, range and one charge per facility atomically',()=>{
 const s=ready(),p=home(s);s.relations.ilyri.war=false;const before=structuredClone(s);assert.ok(launchStrike(s,p.id,'thalassa','missile'));assert.deepEqual(s,before);
 s.relations.ilyri.war=true;assert.equal(launchStrike(s,p.id,'thalassa','missile'),null);assert.equal(s.credits,99930);assert.equal(s.strikes[0].phase,'charge');const after=structuredClone(s);assert.ok(launchStrike(s,p.id,'thalassa','missile'));assert.deepEqual(s,after);
});
test('charging pauses without supply and a destroyed launcher cancels the charge',()=>{
 const s=ready(),b=home(s).buildings.at(-1);launchStrike(s,'nereid','thalassa','missile');b.status='Rohstoffe fehlen';tickStrikes(s);assert.equal(s.strikes[0].remaining,3);b.status='aktiv';tickStrikes(s);assert.equal(s.strikes[0].remaining,2);home(s).buildings.pop();tickStrikes(s);assert.equal(s.strikes.length,0);
});
test('released weapons survive loss of their launchers, while peace prevents impact',()=>{
 const s=ready();launchStrike(s,'nereid','thalassa','missile');for(let i=0;i<3;i++)tickStrikes(s);home(s).buildings.pop();assert.equal(s.strikes[0].phase,'flight');const p=getPlanet(s,'thalassa'),count=p.buildings.length;finish(s);assert.equal(p.buildings.length,count-1);
 const peace=ready();launchStrike(peace,'nereid','thalassa','missile');peace.relations.ilyri.war=false;finish(peace);assert.equal(getPlanet(peace,'thalassa').buildings.length,count);
});
test('charged shields stop rockets; interceptor capacity is capped and fortresses strengthen invasion resistance',()=>{
 const s=ready(),p=getPlanet(s,'thalassa');add(p,'shield');p.shield=180;launchStrike(s,'nereid',p.id,'missile');const count=p.buildings.length;finish(s);assert.equal(p.buildings.length,count);assert.equal(p.shield,135);
 for(let i=0;i<8;i++)add(p,'interceptor',i,0);assert.equal(baseStats(s,p).interception,.75);
 const battle=createGame(),q=getPlanet(battle,'thalassa');battle.relations.ilyri.war=true;q.defense=0;q.garrison=40;add(q,'bunker');const f={...battle.fleets[0],type:'lander',hp:100,supply:100};battle.fleets=[f];resolveBattle(battle,[f],q);assert.equal(q.owner,'ilyri');assert.equal(baseStats(battle,q).fortification,35);
});
test('worldbreakers require explicit confirmation and permanently remove worlds and docked ships',()=>{
 const s=ready('worldbreaker'),p=getPlanet(s,'thalassa');assert.ok(launchStrike(s,'nereid',p.id,'worldbreaker'));assert.equal(s.strikes.length,0);s.fleets.push({...s.fleets[0],id:'doomed',planetId:p.id});assert.equal(launchStrike(s,'nereid',p.id,'worldbreaker',{confirmed:true}),null);finish(s);assert.ok(p.destroyed);assert.equal(p.owner,null);assert.equal(p.buildings.length,0);assert.ok(!s.fleets.some(f=>f.id==='doomed'));assert.ok(orderFleet(s,['starter-c'],p.id));
});
test('stellar shields counter starbreakers; unprotected systems lose all their worlds',()=>{
 const s=ready('starbreaker'),p=getPlanet(s,'aurora-0');s.tech.push('deepRange');add(p,'stellarAegis',8,7);p.shield=2800;launchStrike(s,'nereid',p.id,'starbreaker',{confirmed:true});finish(s);assert.ok(!p.destroyed);assert.equal(p.shield,0);
 p.buildings=p.buildings.filter(b=>b.type!=='stellarAegis');launchStrike(s,'nereid',p.id,'starbreaker',{confirmed:true});finish(s);assert.ok(s.destroyedSystems.includes('aurora'));assert.ok(s.planets.filter(q=>q.system==='aurora').every(q=>q.destroyed));
});
test('destruction diverts cargo to surviving home and preserves a valid save',()=>{
 const s=createGame(),p=getPlanet(s,'cinder');p.owner='player';p.population=40;orderFleet(s,['starter-f'],p.id,'transport',{resource:'ore',amount:20,repeat:true});destroyPlanet(s,p);const f=s.fleets[1];assert.equal(f.route,null);assert.equal(f.mission.target,'nereid');assert.equal(f.mission.kind,'return-cargo');assert.deepEqual(validateSave(structuredClone(s)),s);
});
test('real v3 saves gain 18 worlds without losing existing colony or fleet progress',()=>{
 const s=createGame();s.version=3;s.planets=s.planets.slice(0,7);for(const p of s.planets){delete p.shield;delete p.destroyed;}delete s.strikes;delete s.milestones;delete s.destroyedSystems;const before=structuredClone(s);const loaded=validateSave(s);assert.equal(loaded.version,4);assert.equal(loaded.planets.length,25);assert.deepEqual(loaded.fleets,before.fleets);for(const p of before.planets)assert.deepEqual(loaded.planets.find(q=>q.id===p.id),{...p,shield:0,destroyed:false});
});
test('meilenstein rewards are paid once and recorded separately from recurring income',()=>{
 const s=createGame();getPlanet(s,'cinder').owner='player';getPlanet(s,'elys').owner='player';const before=s.credits;tickGoals(s);assert.equal(s.credits-before,500);tickGoals(s);assert.equal(s.credits-before,500);assert.ok(s.milestones.includes('colonies3'));
});
test('military views expose controls and every unlock references real technologies and buildings',()=>{
 const s=createGame();for(const mode of ['bases','arsenal','goals']){const html=renderSheet(s,{panel:'fleet',fleetMode:mode,planetId:'nereid'});assert.ok(!html.includes('undefined'));assert.ok(!html.includes('NaN'));assert.ok(html.includes('Fernwaffen'));}for(const b of Object.values(BUILDINGS))if(b.requiredTech)assert.ok(TECHNOLOGIES[b.requiredTech]);
});

test('enemy frontier silos launch visible attacks during sustained wars',()=>{
 const s=createGame();s.relations.ilyri.war=true;for(let i=0;i<181;i++)stepDay(s);assert.ok(s.strikes.some(q=>q.owner==='ilyri'));const html=renderSheet(s,{panel:'fleet',fleetMode:'arsenal',planetId:'nereid'});assert.ok(html.includes('FEINDLICHER FERNANGRIFF'));assert.deepEqual(validateSave(structuredClone(s)),s);
});
test('malformed strategic saves are rejected and legitimate charged weapons roundtrip',()=>{
 const s=createGame();s.tech=['targeting','missileDoctrine'];s.relations.ilyri.war=true;add(home(s),'missileSilo');assert.equal(launchStrike(s,'nereid','thalassa','missile'),null);assert.deepEqual(validateSave(structuredClone(s)),s);for(const edit of [q=>q.strikes[0].remaining=0,q=>q.strikes[0].type='unknown',q=>q.destroyedSystems=['helios'],q=>home(q).shield=-1]){const copy=structuredClone(s);edit(copy);assert.throws(()=>validateSave(copy));}
});
