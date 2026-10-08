import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, getPlanet } from '../src/state.js';
import { BUILDINGS } from '../src/data.js';
import { BUILD_CATEGORIES } from '../src/build-ui.js';
import { renderSheet, renderResources } from '../src/ui.js';
import { diplomaticAction } from '../src/politics.js';
import { exportPrice, quoteSale } from '../src/trade.js';
import { routeSelection } from '../src/trade-ui.js';
import { forecastDay } from '../src/budget.js';
import { stepDay, resolveEvent } from '../src/simulation.js';
import { tickDiplomacy } from '../src/diplomacy.js';
import { EVENTS, tickEvents } from '../src/events.js';
import { orderFleet } from '../src/fleets.js';
import { validateSave } from '../src/save.js';
const home=s=>getPlanet(s,'nereid');
const sheet=(s,props)=>renderSheet(s,{planetId:'nereid',...props});

test('all buildings occur in exactly one submenu and specific research requirements remain visible',()=>{
 const ids=Object.values(BUILD_CATEGORIES).flatMap(c=>c.buildings);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(ids.sort(),Object.keys(BUILDINGS).sort());
 const s=createGame();const root=sheet(s,{panel:'build'});assert.equal((root.match(/data-action="build-category"/g)||[]).length,8);assert.ok(!root.includes('data-action="build-detail"'));
 for(const [id,c] of Object.entries(BUILD_CATEGORIES)){const html=sheet(s,{panel:'build',buildCategory:id});assert.equal((html.match(/data-action="build-detail"/g)||[]).length,c.buildings.length);for(const b of c.buildings)if(BUILDINGS[b].requiredTech)assert.ok(html.includes('🔒 Benötigt'));}
 s.tech.push('shieldPhysics');assert.ok(sheet(s,{panel:'build',buildCategory:'defense'}).includes('✓ Erforscht: Makroskopische Schildfelder'));
});
test('resource banks cover every stock and preserve rates with hidden shortage warning',()=>{
 const s=createGame();home(s).stock.food=1;home(s).buildings.find(b=>b.type==='farm').enabled=false;const standard=renderResources(s,{planetId:'nereid',resourcePage:0}),industrial=renderResources(s,{planetId:'nereid',resourcePage:1});
 assert.ok(standard.includes('Forschung'));assert.ok(!standard.includes('>Erz<'));for(const name of ['Erz','Kristalle','Optische Bauteile','Laserwaffen'])assert.ok(industrial.includes(name));assert.ok(industrial.includes('resource-switch warning'));assert.ok(industrial.includes('/T'));
});
test('nonaggression prevents war atomically until cancelled, and envoy cooldown prevents spam',()=>{
 const s=createGame(),r=s.relations.ilyri;s.credits=5000;r.score=50;assert.equal(diplomaticAction(s,'ilyri','pact'),null);let before=structuredClone(s);assert.ok(diplomaticAction(s,'ilyri','war'));assert.deepEqual(s,before);assert.equal(diplomaticAction(s,'ilyri','cancel-pact'),null);assert.equal(r.score,35);assert.equal(diplomaticAction(s,'ilyri','envoy'),null);before=structuredClone(s);assert.ok(diplomaticAction(s,'ilyri','envoy'));assert.deepEqual(s,before);assert.equal(diplomaticAction(s,'ilyri','war'),null);assert.deepEqual(validateSave(structuredClone(s)),s);
});
test('cooperation boosts real research and actual delivery prices and provides conserved wartime aid',()=>{
 const s=createGame();s.credits=5000;s.relations.ilyri.score=50;const baseline=forecastDay(s).budget.science;diplomaticAction(s,'ilyri','trade');const basePrice=exportPrice(s,'ore','ilyri');assert.equal(diplomaticAction(s,'ilyri','cooperation'),null);assert.ok(Math.abs(forecastDay(s).budget.science-baseline*1.08)<1e-8);assert.equal(exportPrice(s,'ore','ilyri'),basePrice*1.12);
 assert.equal(orderFleet(s,['starter-f'],'thalassa','transport',{resource:'ore',amount:20}),null);s.fleets[1].mission.remaining=1;stepDay(s);assert.ok(Math.abs(s.lastDayReport.oneOff-s.tradeLedger[0].revenue)<1e-8);
 s.day=s.relations.ilyri.aidReady;s.relations.aster.war=true;const supplier=getPlanet(s,'thalassa'),a=supplier.stock.alloy,b=home(s).stock.alloy;tickDiplomacy(s);assert.equal(supplier.stock.alloy,a-12);assert.equal(home(s).stock.alloy,b+12);tickDiplomacy(s);assert.equal(home(s).stock.alloy,b+12);
});
test('sanctions stop routes and cooperation, reduce actual foreign output and match the credit forecast',()=>{
 const s=createGame();s.credits=5000;diplomaticAction(s,'ilyri','trade');orderFleet(s,['starter-f'],'thalassa','transport',{resource:'ore',amount:10,repeat:true});const old=forecastDay(s);assert.equal(diplomaticAction(s,'ilyri','embargo'),null);assert.equal(s.fleets[1].route,null);assert.equal(s.relations.ilyri.trade,false);assert.ok(diplomaticAction(s,'ilyri','trade'));const f=forecastDay(s);assert.equal(f.budget.sanctions,1.5);assert.ok(f.planets.find(p=>p.id==='thalassa').net.ore<old.planets.find(p=>p.id==='thalassa').net.ore);const credits=s.credits;stepDay(s);assert.ok(Math.abs(s.credits-credits-f.budget.actual)<1e-8);assert.equal(diplomaticAction(s,'ilyri','lift-embargo'),null);assert.equal(forecastDay(s).budget.sanctions,0);
});
test('trade quote follows the same selection and arrival price as execution, including stale selectors',()=>{
 const s=createGame();diplomaticAction(s,'ilyri','trade');const ui={panel:'economy',economyMode:'routes',planetId:'nereid',routeFleet:'missing',routeTarget:'missing',cargo:'ore',amount:20,repeat:true};const q=routeSelection(s,ui,home(s)),html=renderSheet(s,ui);assert.equal(q.f.id,'starter-f');assert.equal(q.target.owner,'ilyri');assert.ok(html.includes(`${quoteSale(s,q.target,'ore',20).total.toLocaleString('de-DE',{maximumFractionDigits:1})} ¢`));assert.ok(html.includes('5 Flugtage')||html.includes('6 Flugtage')||html.includes('7 Flugtage'));assert.ok(html.includes('8 ENE'));assert.ok(html.includes('Erwarteter Erlös'));assert.ok(!html.includes('undefined'));
});
test('events are four to six times less frequent and never repeat the last four types',()=>{
 const s=createGame();for(let i=0;i<95;i++)stepDay(s);assert.equal(s.event,null);const seen=[];for(let i=0;i<18;i++){s.day=s.eventSchedule.nextDay;tickEvents(s);assert.ok(s.event);assert.ok(!seen.slice(-4).includes(s.event.kind));seen.push(s.event.kind);const day=s.day,choice=EVENTS[s.event.kind].choices.find(([id])=>['skip','decline','store','study','contact','endure'].includes(id))?.[0]??'skip';assert.equal(resolveEvent(s,choice),null);assert.ok(s.eventSchedule.nextDay-day>=84&&s.eventSchedule.nextDay-day<=144);}assert.ok(new Set(seen).size>=7);assert.deepEqual(validateSave(structuredClone(s)),s);
});
test('event purchases reject atomically, settlers need housing, and temporary effects expire in forecasts',()=>{
 const s=createGame();s.event={kind:'migration',planet:'nereid'};home(s).population=240;const before=structuredClone(s);assert.ok(resolveEvent(s,'welcome'));assert.deepEqual(s,before);assert.equal(resolveEvent(s,'decline'),null);
 s.event={kind:'anomaly',planet:'nereid'};home(s).stock.energy=0;const unfunded=structuredClone(s);assert.ok(resolveEvent(s,'scan'));assert.deepEqual(s,unfunded);resolveEvent(s,'skip');
 s.event={kind:'gridPeak',planet:'nereid'};home(s).stock.crystal=100;home(s).stock.energy=100;const baseline=forecastDay(s).planets[0].net.energy;assert.equal(resolveEvent(s,'harness'),null);assert.ok(forecastDay(s).planets[0].net.energy>baseline);s.day=s.effects[0].until-1;const f=forecastDay(s);stepDay(s);assert.equal(s.effects.length,0);assert.ok(Math.abs(home(s).net.energy-f.planets[0].net.energy)<1e-8);
});
test('v4 saves migrate politics and event cadence without changing existing military progress',()=>{
 const s=createGame();s.version=4;delete s.effects;delete s.eventSchedule;for(const r of Object.values(s.relations))for(const k of ['pactUntil','cooperation','embargo','envoyReady','aidReady'])delete r[k];s.event={kind:'storm',planet:'nereid'};const old=structuredClone(s);const next=validateSave(s);assert.equal(next.version,7);assert.deepEqual(next.planets,old.planets);assert.deepEqual(next.strikes,old.strikes);assert.deepEqual(next.event,old.event);assert.ok(next.eventSchedule.nextDay>=96);assert.equal(next.relations.ilyri.cooperation,false);
});
test('new save fields reject broken treaties and unknown or duplicated event effects',()=>{
 for(const edit of [s=>s.relations.ilyri.cooperation=true,s=>s.relations.ilyri.pactUntil=999,s=>s.effects=[{id:'unknown',planet:'nereid',until:5}],s=>s.eventSchedule.history=['signal','signal'],s=>s.event={kind:'bad',planet:'nereid'}]){const s=createGame();edit(s);assert.throws(()=>validateSave(s));}
});
