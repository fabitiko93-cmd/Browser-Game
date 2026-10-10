import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, getPlanet, makeStock } from '../src/state.js';
import { FACTIONS, TECHNOLOGIES, SHIPS } from '../src/data.js';
import { relationBetween, beginWar, endWar, publicRelations } from '../src/realm-relations.js';
import { tickRealmAI, knownWarTarget, refreshInterest, realmBalance } from '../src/realm-ai.js';
import { buildShip, tickShipyards, tickFleets, fleetUpkeep, orderFleet, resolveBattle } from '../src/fleets.js';
import { launchStrike } from '../src/strategic.js';
import { runDailyEconomy } from '../src/budget.js';
import { stepDay } from '../src/simulation.js';
import { tickForeignCommerce, finishCommerce } from '../src/foreign-commerce.js';
import { recordContact, observePlanet, knowledgeOf, chartSystem } from '../src/intelligence.js';
import { newsReady, newsFor, publishNews, reportTreaty } from '../src/space-news.js';
import { inboxSignal, readInbox, sendOffer, tickCommunications } from '../src/communications.js';
import { communicationPanel } from '../src/communications-ui.js';
import { diplomacyPanel } from '../src/diplomacy-ui.js';
import { validateSave, exportGame, parseImport } from '../src/save.js';

function unlock(s,owner,id) {
  const tech=owner==='player'?s.tech:s.factions[owner].tech;
  for(const q of TECHNOLOGIES[id].requires)unlock(s,owner,q);
  if(TECHNOLOGIES[id].requiresAny&&!TECHNOLOGIES[id].requiresAny.some(q=>tech.includes(q)))unlock(s,owner,TECHNOLOGIES[id].requiresAny[0]);
  if(!tech.includes(id))tech.push(id);
}
function center(s,owner) {
  unlock(s,owner,'communications');const p=s.planets.find(p=>p.owner===owner);
  const b={id:`${owner}-center`,type:'commCenter',x:10,y:10,remaining:0,enabled:true,status:'aktiv'};p.buildings.push(b);return b;
}
function funded(s,id) {
  const p=s.planets.find(p=>p.owner===id);s.factions[id].credits=10000;p.population=320;
  for(const key of Object.keys(p.stock))p.stock[key]=1000;
  p.lastReport={income:150,upkeep:20};p.net={food:10,energy:10};return p;
}
function army(s,id,count=3) {
  const p=funded(s,id);center(s,id);unlock(s,id,'lasers');unlock(s,id,'fortification');
  for(const type of [...Array(count).fill('destroyer'),'lander']){
    assert.equal(buildShip(s,p,type,id),null);
    while(p.queues.length)tickShipyards(s);
  }
  return s.fleets.filter(f=>f.owner===id);
}
function pauseOtherPlans(s,id) {
  for(const [owner,strategy]of Object.entries(s.galaxy.strategies))strategy.nextPlan=owner===id?0:s.day+18;
  for(const r of Object.values(s.galaxy.relations))r.nextAction=s.day+30;
}

test('foreign relationships are symmetric, independent of player ties and bounded to 153 pairs',()=>{
  const s=createGame(),r=relationBetween(s,'aster','clans');assert.equal(Object.keys(s.galaxy.relations).length,153);
  assert.equal(r,relationBetween(s,'clans','aster'));assert.equal(relationBetween(s,'player','aster'),s.relations.aster);
  assert.equal(beginWar(s,'aster','clans'),true);assert.equal(s.relations.aster.war,false);assert.equal(s.relations.clans.war,false);
  assert.ok(publicRelations(s,'aster').some(q=>q.id==='clans'&&q.r.war));validateSave(s);
});
test('interest reacts to own shortages and war, without confusing steady positive production with a shortage',()=>{
  const s=createGame(),p=funded(s,'aster');p.stock.food=0;p.net.food=10;
  assert.equal(refreshInterest(s,'aster').focus,'expansion');p.net.food=-5;
  assert.equal(refreshInterest(s,'aster').focus,'recovery');p.stock.food=1000;p.net.food=10;
  beginWar(s,'aster','clans');assert.equal(refreshInterest(s,'aster').focus,'security');
});
test('a known rival can receive a planned attack; live hidden defense never influences target selection or mobilization',()=>{
  const base=createGame();base.day=200;army(base,'aster');pauseOtherPlans(base,'aster');
  relationBetween(base,'aster','clans').score=-60;
  const changed=structuredClone(base);getPlanet(changed,'clans').defense=9999;getPlanet(changed,'clans').shield=8000;getPlanet(changed,'clans').stock.weapons=90000;
  tickRealmAI(base);tickRealmAI(changed);
  assert.deepEqual(changed.galaxy.strategies.aster.warPlan,base.galaxy.strategies.aster.warPlan);
  assert.equal(base.galaxy.strategies.aster.warPlan.enemy,'clans');assert.equal(relationBetween(base,'aster','clans').war,false);
  for(const s of [base,changed]){s.day+=36;s.galaxy.strategies.aster.nextPlan=0;tickRealmAI(s);assert.equal(relationBetween(s,'aster','clans').war,true);}
  assert.equal(safeKind(base),'none'); // declaration precedes the physical sortie by a planning interval
  base.day+=18;base.galaxy.strategies.aster.nextPlan=0;tickRealmAI(base);
  assert.equal(safeKind(base),'attack');assert.ok(getPlanet(base,'aster').stock.energy<getPlanet(changed,'aster').stock.energy);
});
function safeKind(s){return s.fleets.find(f=>f.owner==='aster'&&f.mission)?.mission.kind??'none';}
test('unknown targets cannot be selected even when their live resources are richer',()=>{
  const s=createGame();s.intelligence.aster.planets={};assert.equal(knownWarTarget(s,'aster','clans'),null);
  recordContact(s,'aster',getPlanet(s,'clans'));assert.equal(knownWarTarget(s,'aster','clans').id,'clans');
  assert.equal(knowledgeOf(s,getPlanet(s,'clans'),'aster').military,undefined);
});
test('improved relations cancel preparations; a pact and peace cooldown prevent repeated war declarations',()=>{
  const s=createGame();s.day=200;army(s,'aster');pauseOtherPlans(s,'aster');const r=relationBetween(s,'aster','clans');r.score=-60;
  tickRealmAI(s);assert.ok(s.galaxy.strategies.aster.warPlan);r.score=0;s.day+=18;s.galaxy.strategies.aster.nextPlan=0;tickRealmAI(s);assert.equal(s.galaxy.strategies.aster.warPlan,null);
  r.score=-60;r.pactUntil=s.day+180;assert.equal(beginWar(s,'aster','clans'),false);
  r.pactUntil=0;beginWar(s,'aster','clans');endWar(s,'aster','clans');r.score=-60;s.galaxy.strategies.aster.nextPlan=0;tickRealmAI(s);assert.equal(s.galaxy.strategies.aster.warPlan,null);assert.equal(r.truceUntil,s.day+180);
});
test('AI military construction pays local materials and its own treasury, respects build time and cannot spend borrowed funds',()=>{
  const s=createGame();s.day=40;const p=funded(s,'aster');pauseOtherPlans(s,'aster');
  const cash=s.factions.aster.credits,player=s.credits,weapons=p.stock.weapons;tickRealmAI(s);
  const q=p.queues[0];assert.ok(q);assert.equal(s.factions.aster.credits,cash-SHIPS[q.type].cost.credits);assert.equal(p.stock.weapons,weapons-SHIPS[q.type].cost.weapons);assert.equal(s.credits,player);assert.equal(s.fleets.filter(f=>f.owner==='aster').length,0);
  tickShipyards(s);assert.ok(p.queues.length);while(p.queues.length)tickShipyards(s);assert.equal(s.fleets.filter(f=>f.owner==='aster').length,1);assert.ok(fleetUpkeep(s,'aster')>0);
  s.factions.aster.credits=-1;s.day+=18;s.galaxy.strategies.aster.nextPlan=0;tickRealmAI(s);assert.equal(p.queues.length,0);
});
test('AI treaties charge both parties exactly once and require trust',()=>{
  const s=createGame();s.day=50;for(const v of Object.values(s.galaxy.strategies))v.nextPlan=s.day+18;
  for(const r of Object.values(s.galaxy.relations))r.nextAction=s.day+30;
  const r=relationBetween(s,'ilyri','khepri');r.score=20;r.nextAction=0;
  const a=s.factions.ilyri.credits,b=s.factions.khepri.credits;tickRealmAI(s);
  assert.equal(r.trade,true);assert.equal(s.factions.ilyri.credits,a-50);assert.equal(s.factions.khepri.credits,b-50);tickRealmAI(s);assert.equal(s.factions.ilyri.credits,a-50);
});
test('protection alliances require developed diplomacy, incur daily upkeep and transfer only real supplies',()=>{
  const s=createGame();s.day=80;for(const v of Object.values(s.galaxy.strategies))v.nextPlan=s.day+18;for(const r of Object.values(s.galaxy.relations))r.nextAction=s.day+30;
  const r=relationBetween(s,'ilyri','khepri');r.score=70;r.trade=true;r.nextAction=0;
  for(const id of ['ilyri','khepri']){const p=funded(s,id);unlock(s,id,'advancedDiplomacy');p.buildings.push({id:`${id}-forum`,type:'embassy',x:10,y:11,enabled:true,remaining:0,status:'aktiv'});}
  tickRealmAI(s);assert.equal(r.defensePact,true);
  const baseline=structuredClone(s);relationBetween(baseline,'ilyri','khepri').defensePact=false;
  runDailyEconomy(s);runDailyEconomy(baseline);assert.ok(Math.abs(baseline.factions.ilyri.credits-s.factions.ilyri.credits-2)<1e-8);
  beginWar(s,'ilyri','aster');r.aidReady=0;const from=getPlanet(s,'veyra'),to=getPlanet(s,'thalassa'),stock=from.stock.weapons,target=to.stock.weapons;
  tickRealmAI(s);assert.equal(from.stock.weapons,stock-4);assert.equal(to.stock.weapons,target+4);
});
test('AI freighters require a real trade treaty and keep cargo if war cancels access en route',()=>{
  const s=createGame(),p=funded(s,'aster'),q=getPlanet(s,'thalassa');p.stock.ore=2000;q.stock.ore=0;q.lastReport={demandByResource:{ore:10},productionByResource:{}};
  for(const x of s.planets)if(x!==q&&x.owner&&x.owner!=='aster')for(const key of Object.keys(x.stock))x.stock[key]=10000;
  const f={...structuredClone(s.fleets[1]),id:'trader',owner:'aster',planetId:p.id,supplySettings:{...s.fleets[1].supplySettings,homePort:p.id}};s.fleets.push(f);
  tickForeignCommerce(s);assert.equal(f.mission,null);f.tradeReady=0;relationBetween(s,'aster','ilyri').trade=true;tickForeignCommerce(s);assert.equal(f.mission.kind,'commerce');
  const m=structuredClone(f.mission),before=q.stock[m.cargo.resource];relationBetween(s,'aster','ilyri').trade=false;beginWar(s,'aster','ilyri');finishCommerce(s,f,m,q);
  assert.equal(q.stock[m.cargo.resource],before);assert.equal(f.cargo[m.cargo.resource],m.cargo.amount);
});
test('supply between AI colonies carries existing goods physically without generating money',()=>{
  const s=createGame(),p=funded(s,'aster'),q=getPlanet(s,'cinder');q.owner='aster';q.population=40;q.stock=makeStock({food:20,energy:100});chartSystem(s,'aster',q.system);
  const f={...structuredClone(s.fleets[1]),id:'supply',owner:'aster',planetId:p.id,supplySettings:{...s.fleets[1].supplySettings,homePort:p.id}};s.fleets.push(f);
  tickForeignCommerce(s);assert.equal(f.mission.kind,'resupply');const m=structuredClone(f.mission),cash=s.factions.aster.credits,before=q.stock[m.cargo.resource];
  while(f.mission?.kind==='resupply')tickFleets(s,{economyProcessed:true});assert.equal(q.stock[m.cargo.resource],before+m.cargo.amount);assert.equal(s.factions.aster.credits,cash);validateSave(s);
});
test('real defender ships affect the same battle rules for both sides',()=>{
  const s=createGame(),attack=army(s,'aster',1).filter(f=>f.type==='destroyer'),q=getPlanet(s,'clans');q.defense=0;beginWar(s,'aster','clans');
  const guards=army(s,'clans',3).filter(f=>f.type==='destroyer');for(const f of attack)f.planetId=q.id;
  resolveBattle(s,attack,q);assert.equal(q.owner,'clans');assert.ok(attack[0].hp<100);assert.ok(guards.some(f=>f.hp<100));assert.ok(attack[0].mission?.target==='aster'||attack[0].hp===0);
});
test('physical landers are consumed by conquest and captured home ports are repaired',()=>{
  const s=createGame(),attack=army(s,'aster'),q=getPlanet(s,'clans');beginWar(s,'aster','clans');q.defense=0;q.garrison=30;
  const defender={...structuredClone(s.fleets[1]),id:'defender-cargo',owner:'clans',planetId:q.id,supplySettings:{...s.fleets[1].supplySettings,homePort:q.id}};s.fleets.push(defender);
  for(const f of attack)f.planetId=q.id;resolveBattle(s,attack,q,'aster');assert.equal(q.owner,'aster');assert.equal(q.garrison,40);assert.ok(!s.fleets.some(f=>f.owner==='aster'&&f.type==='lander'));assert.equal(defender.supplySettings,undefined);validateSave(s);
});
test('peace before arrival cancels a physical attack, including an AI attack on another AI',()=>{
  const s=createGame(),attack=army(s,'aster'),q=getPlanet(s,'clans');beginWar(s,'aster','clans');assert.equal(orderFleet(s,attack.map(f=>f.id),q.id,'attack',{owner:'aster'}),null);
  const old=q.defense;endWar(s,'aster','clans');while(attack.some(f=>f.mission?.kind==='attack'))tickFleets(s,{economyProcessed:true});assert.equal(q.defense,old);assert.equal(q.owner,'clans');
});
test('foreign missiles require the same research, local goods and credit costs as player missiles',()=>{
  const s=createGame(),p=funded(s,'aster');beginWar(s,'aster','clans');p.buildings.push({id:'silo',type:'missileSilo',x:10,y:11,enabled:true,remaining:0,status:'aktiv'});
  assert.ok(launchStrike(s,p.id,'clans','missile',{owner:'aster'}));assert.equal(s.strikes.length,0);
  unlock(s,'aster','missileDoctrine');const before=s.factions.aster.credits,player=s.credits;assert.equal(launchStrike(s,p.id,'clans','missile',{owner:'aster'}),null);assert.ok(s.factions.aster.credits<before);assert.equal(s.credits,player);validateSave(s);
});
test('Space News needs research and a supplied center, has a fixed audience and reveals only public identity',()=>{
  const s=createGame();reportTreaty(s,'aster','clans','war');assert.equal(s.galaxy.news.length,0);
  const b=center(s,'player');unlock(s,'player','newsNetwork');assert.equal(newsReady(s),true);
  const p=getPlanet(s,'cinder');p.owner='aster';p.population=999;p.stock.weapons=999;publishNews(s,'colony',{actors:['aster'],system:p.system,planet:p.id,title:'Neue Siedlung',body:'Ein öffentlicher Hafen ist eröffnet.'});
  const k=knowledgeOf(s,p);assert.equal(k.identity.value,'aster');assert.equal(k.identity.source,'news');assert.equal(k.civil,undefined);assert.equal(k.military,undefined);assert.equal(k.surface,undefined);assert.equal(inboxSignal(s).unread,true);
  readInbox(s,'archive');assert.equal(inboxSignal(s).unread,true);readInbox(s,'news');assert.equal(inboxSignal(s).unread,false);
  b.status='Rohstoffe fehlen';assert.equal(newsReady(s),false);assert.equal(newsFor(s).length,1);
  const previous=s.galaxy.news.length;publishNews(s,'movement',{actors:['aster'],system:'silex',title:'Ferne Flotte',body:'Öffentliche Beobachtung.'});assert.equal(s.galaxy.news.length,previous);
  chartSystem(s,'player','silex');assert.equal(newsFor(s).length,1);validateSave(s);
});
test('unanswered and rejected direct offers remain in the center archive with a reason',()=>{
  const s=createGame();center(s,'player');s.relations.ilyri.score=40;assert.equal(sendOffer(s,'ilyri','pact'),null);s.factions.ilyri.credits=150;s.day=3;tickCommunications(s);
  const m=s.communications.messages[0];assert.equal(m.status,'rejected');assert.match(m.reason,/Versorgung/);assert.equal(s.relations.ilyri.pactUntil,0);assert.equal(inboxSignal(s).unread,true);readInbox(s,'open');assert.equal(inboxSignal(s).unread,true);readInbox(s,'archive');assert.equal(inboxSignal(s).unread,false);
});
test('communication and diplomacy views expose interests and news without a second inbox menu or hidden strength',()=>{
  const s=createGame(),b=center(s,'player'),p=getPlanet(s,'nereid');
  let html=communicationPanel(s,{communicationBuilding:b.id,inboxMode:'news'},p);assert.match(html,/Benötigt: Öffentliches/);
  unlock(s,'player','newsNetwork');reportTreaty(s,'aster','clans','war');html=communicationPanel(s,{communicationBuilding:b.id,inboxMode:'news'},p);assert.match(html,/Krieg erklärt/);assert.ok(!html.includes('Angebot senden'));
  beginWar(s,'aster','clans');const dip=diplomacyPanel(s,{diplomacyFaction:'aster'});assert.match(dip,/Regionalen Einfluss ausweiten/);assert.match(dip,/Kriege/);assert.ok(!dip.includes('99999'));
});
test('v8 migration preserves every colony, mission, balance and observation and adds no retroactive news',()=>{
  const s=createGame();s.version=8;delete s.galaxy;for(const r of Object.values(s.relations)){delete r.warSince;delete r.truceUntil;}
  const old=structuredClone(s),loaded=parseImport(exportGame(s));assert.equal(loaded.version,9);assert.deepEqual(loaded.planets,old.planets);assert.deepEqual(loaded.fleets,old.fleets);assert.deepEqual(loaded.intelligence,old.intelligence);assert.equal(loaded.credits,old.credits);assert.equal(loaded.galaxy.news.length,0);assert.deepEqual(parseImport(exportGame(loaded)),loaded);
});
test('v8 in-flight AI cargo retains its previously permitted trade access without a retroactive treaty charge',()=>{
  const s=createGame(),p=funded(s,'aster'),q=getPlanet(s,'thalassa');q.stock.ore=0;q.lastReport={demandByResource:{ore:10},productionByResource:{}};
  for(const other of s.planets)if(other!==q&&other.owner&&other.owner!=='aster')for(const key of Object.keys(other.stock))other.stock[key]=10000;
  const f={...structuredClone(s.fleets[1]),id:'legacy-cargo',owner:'aster',planetId:p.id,supplySettings:{...s.fleets[1].supplySettings,homePort:p.id}};s.fleets.push(f);relationBetween(s,'aster','ilyri').trade=true;tickForeignCommerce(s);
  const mission=structuredClone(f.mission),cash=s.factions.aster.credits;s.version=8;delete s.galaxy;
  const loaded=parseImport(exportGame(s)),ship=loaded.fleets.find(f=>f.id==='legacy-cargo');
  assert.equal(relationBetween(loaded,'aster','ilyri').trade,true);assert.deepEqual(ship.mission,mission);assert.equal(loaded.factions.aster.credits,cash);
  while(ship.mission?.kind==='commerce')tickFleets(loaded,{economyProcessed:true});assert.ok(getPlanet(loaded,q.id).stock.ore>0);assert.ok(loaded.factions.aster.credits>cash);validateSave(loaded);
});
test('invalid relationship graphs, fabricated plans, secret systems and contradictory defeats are rejected',()=>{
  for(const edit of [s=>delete s.galaxy.relations['aster:clans'],s=>relationBetween(s,'aster','clans').score=101,s=>{const r=relationBetween(s,'aster','clans');r.war=true;r.trade=true;},s=>s.galaxy.strategies.aster.warPlan={enemy:'player',target:'silex-0',declareAt:12},s=>s.galaxy.defeat={day:0,conqueror:'aster'}]){const s=createGame();edit(s);assert.throws(()=>validateSave(s));}
});
test('losing the final player world records a valid defeat and stops further simulation',()=>{
  const s=createGame(),attack=army(s,'aster'),p=getPlanet(s,'nereid');s.relations.aster.war=true;p.defense=0;p.garrison=0;s.fleets=s.fleets.filter(f=>f.owner!=='player');for(const f of attack)f.planetId=p.id;
  resolveBattle(s,attack,p);assert.equal(p.owner,'aster');assert.equal(s.galaxy.defeat.conqueror,'aster');validateSave(s);const before=exportGame(s);stepDay(s);assert.equal(exportGame(s),before);
});
test('a captured former home keeps its recorded terrain and buildings, without tracking the occupier later',()=>{
  const s=createGame(),attack=army(s,'aster'),p=getPlanet(s,'nereid');s.relations.aster.war=true;
  getPlanet(s,'cinder').owner='player';p.defense=0;p.garrison=0;const original=structuredClone(p.buildings);
  for(const f of attack)f.planetId=p.id;resolveBattle(s,attack,p);
  assert.equal(p.owner,'aster');assert.equal(s.galaxy.defeat,null);const k=knowledgeOf(s,p,'player');
  assert.equal(k.identity.value,'aster');assert.equal(k.surface.value.seed,p.seed);assert.deepEqual(k.installations.value,original);assert.equal(k.civil,undefined);
  const military=structuredClone(k.military.value);p.defense=999;p.garrison=999;p.buildings.pop();assert.deepEqual(knowledgeOf(s,p,'player').military.value,military);assert.deepEqual(knowledgeOf(s,p,'player').installations.value,original);validateSave(s);
});
