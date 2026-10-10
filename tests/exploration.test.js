import { knownWarTarget } from '../src/realm-ai.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, getPlanet, makeStock } from '../src/state.js';
import { SYSTEMS, PLANET_SEEDS } from '../src/data.js';
import { orderFleet, tickFleets, tickOpponents } from '../src/fleets.js';
import { exploreSystem, tickExplorationAI } from '../src/exploration.js';
import { planetView, knowledgeOf, observePlanet, recordContact, knownTargets, systemKnown } from '../src/intelligence.js';
import { renderSheet, renderMapHead, renderMapFoot, renderResources } from '../src/ui.js';
import { MapRenderer } from '../src/map.js';
import { placeBuilding, demolish } from '../src/economy.js';
import { planetSurface } from '../src/surface.js';
import { diplomaticAction } from '../src/politics.js';
import { createOffer, sendOffer, answerMessage, withdrawMessage, inboxSignal, readInbox, tickCommunications, declareMessage } from '../src/communications.js';
import { parseImport, exportGame } from '../src/save.js';
import { stepDay } from '../src/simulation.js';
import { routeSelection } from '../src/trade-ui.js';
import { marketSelection } from '../src/market-ui.js';

const home=s=>getPlanet(s,'nereid');
const ship=(s,type,id=type,owner='player',planetId='nereid')=>{const f={id,type,name:id,owner,planetId,hp:100,supply:100,mission:null,route:null,cargo:makeStock()};s.fleets.push(f);return f;};
const scanTech=s=>{s.tech=['mineralScan','engineTuning','planetaryAnalysis'];};
const center=(p,id='center')=>{const b={id,type:'commCenter',x:2,y:7,remaining:0,enabled:true,status:'aktiv'};p.buildings.push(b);return b;};
const advanceFlight=(s,f)=>{const n=f.mission.remaining;for(let i=0;i<n;i++)tickFleets(s);};
const ui=(planetId='thalassa')=>({planetId,systemId:'helios',view:'planet',panel:'planet-info',fleetIds:[],speed:0,lastSpeed:1,hints:false});

test('new games show astronomy and diplomatic addresses, while sensitive foreign fields stay unknown',()=>{
 const s=createGame(),p=getPlanet(s,'thalassa'),view=planetView(s,p);
 assert.equal(SYSTEMS.length,12);assert.equal(PLANET_SEEDS.length,49);
 assert.equal(view.kind,'Ozeanisch');assert.equal(view.inhabited,true);assert.equal(view.owner,'ilyri');
 for(const key of ['population','happiness','shield','seed','oreFactor','solarFactor'])assert.equal(view[key],undefined,key);
 assert.deepEqual(view.buildings,[]);assert.ok(!view.knowledge.civil);
 assert.equal(planetView(s,getPlanet(s,'silex-0')),null);
 assert.ok(knownTargets(s).every(p=>!p.system.startsWith('silex')));
 const own=planetView(s,home(s));assert.equal(own.population,home(s).population);assert.equal(own.knowledge.civil.source,'own');
});
test('hidden foreign state changes cannot leak through dossier, map labels, diplomacy or resource HUD',()=>{
 const s=createGame(),u=ui(),p=getPlanet(s,'thalassa');
 const views=()=>[renderSheet(s,u),renderMapHead(s,u),renderMapFoot(s,u),renderResources(s,u),renderSheet(s,{...u,panel:'politics',politicsMode:'diplomacy'})];
 const before=views();p.population=123456.7;p.happiness=13.37;p.stock.ore=987654;p.shield=12345;p.oreFactor=3.14;p.buildings.push({id:'secret',type:'stellarForge',x:1,y:1,remaining:0,enabled:true,status:'aktiv'});s.factions.ilyri.tech.push('quantumModels');
 assert.deepEqual(views(),before);assert.ok(before[3].includes('Vorräte auf Nereid'));
});
test('uncharted systems have no planet hit targets or disclosed planet names',()=>{
 const s=createGame(),ctx=new Proxy({createRadialGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]??(()=>{})});
 const map=Object.create(MapRenderer.prototype);Object.assign(map,{state:s,ui:{systemId:'silex',planetId:'nereid'},camera:{x:0,y:0,zoom:1},hits:[]});
 map.system(ctx,320,520,0);assert.equal(map.hits.length,0);
 const html=renderSheet(s,{...ui('nereid'),systemId:'silex',panel:'exploration'});assert.ok(!html.includes('Frostfall'));assert.ok(html.includes('Keine Raumtore'));
});
test('an explorer must chart the route before colony or ordinary fleet departures can use it',()=>{
 const s=createGame(),f=ship(s,'scout');ship(s,'colony','colony');
 const before=exportGame(s);assert.ok(orderFleet(s,['colony'],'silex-0','settle'));assert.equal(exportGame(s),before);
 assert.equal(exploreSystem(s,f.id,'silex'),null);assert.equal(home(s).stock.energy,148);
 assert.equal(systemKnown(s,'silex'),false);assert.ok(!s.logs[0].text.includes('Frostfall'));
 advanceFlight(s,f);assert.equal(systemKnown(s,'silex'),true);assert.equal(s.intelligence.player.routes.length,1);
 const view=planetView(s,getPlanet(s,'silex-0'));assert.equal(view.inhabited,false);assert.equal(view.seed,undefined);assert.equal(view.population,undefined);
 assert.equal(orderFleet(s,['colony'],'silex-0','settle'),null);assert.ok(s.fleets.find(f=>f.id==='colony').mission.total>14);
 assert.deepEqual(parseImport(exportGame(s)),s);
});
test('scouts have no attack capability, only occupancy observations, and leave inhabited orbits',()=>{
 const s=createGame(),f=ship(s,'scout');s.relations.ilyri.war=true;
 assert.ok(orderFleet(s,[f.id],'thalassa','attack'));
 s.relations.ilyri.war=false;assert.equal(orderFleet(s,[f.id],'thalassa','survey'),null);advanceFlight(s,f);
 assert.equal(knowledgeOf(s,getPlanet(s,'thalassa')).occupancy.source,'scout');
 assert.equal(knowledgeOf(s,getPlanet(s,'thalassa')).civil,undefined);assert.equal(knowledgeOf(s,getPlanet(s,'thalassa')).surface,undefined);
 assert.equal(f.mission.target,'nereid');assert.equal(f.mission.kind,'move');
});
test('hostile interception can destroy scouts before transmission without granting secret knowledge or rewards',()=>{
 let losses=0,survivors=0;
 for(let i=0;i<30;i++){
  const s=createGame(),f=ship(s,'scout',`risk-${i}`),p=getPlanet(s,'aster');s.relations.aster.war=true;
  delete s.intelligence.player.planets[p.id];
  assert.equal(orderFleet(s,[f.id],p.id,'survey'),null);f.mission.remaining=1;tickFleets(s);
  if(!s.fleets.includes(f)){losses++;assert.equal(knowledgeOf(s,p).occupancy,undefined);assert.equal(s.science,0);}
  else{survivors++;assert.equal(knowledgeOf(s,p).occupancy.value,true);assert.equal(knowledgeOf(s,p).identity,undefined);assert.equal(f.mission.target,'nereid');}
 }
 assert.ok(losses>0);assert.ok(survivors>0);
});
test('probe scans pay once, take six days after travel, and reveal terrain rather than social or military secrets',()=>{
 const s=createGame(),f=ship(s,'probe'),p=getPlanet(s,'thalassa');scanTech(s);
 assert.equal(orderFleet(s,[f.id],p.id,'analyze'),null);assert.equal(s.credits,740);assert.equal(home(s).stock.energy,164);assert.equal(home(s).stock.optics,58);
 assert.equal(knowledgeOf(s,p).surface,undefined);advanceFlight(s,f);assert.equal(f.mission.phase,'scan');
 for(let i=0;i<5;i++)tickFleets(s);assert.equal(knowledgeOf(s,p).surface,undefined);
 tickFleets(s);const k=knowledgeOf(s,p);assert.equal(k.surface.source,'probe');assert.equal(k.geology.value.oreFactor,p.oreFactor);assert.equal(k.civil,undefined);assert.equal(k.military,undefined);assert.equal(k.installations,undefined);
 assert.equal(f.mission.kind,'move');assert.equal(f.mission.target,'nereid');
 assert.deepEqual(parseImport(exportGame(s)),s);
});
test('missing scan technology or combined fuel and scan costs reject atomically',()=>{
 const s=createGame(),f=ship(s,'probe');let before=exportGame(s);assert.ok(orderFleet(s,[f.id],'cinder','analyze'));assert.equal(exportGame(s),before);
 scanTech(s);home(s).stock.energy=15;before=exportGame(s);assert.ok(orderFleet(s,[f.id],'cinder','analyze'));assert.equal(exportGame(s),before);
});
test('recorded observations stay unchanged when the real planet changes and expose their source and age',()=>{
 const s=createGame(),p=getPlanet(s,'thalassa');s.day=10;observePlanet(s,'player',p,'visit');const recorded=planetView(s,p).population;
 p.population+=99;p.happiness=1;p.buildings=[];s.day=50;
 assert.equal(planetView(s,p).population,recorded);assert.ok(planetView(s,p).buildings.length>0);
 const html=renderSheet(s,ui());assert.ok(html.includes('Hafenbesuch'));assert.ok(html.includes('11.01.3077'));assert.ok(html.includes('Veraltet'));
 const q=planetView(s,p);assert.ok(!q.buildings.some(b=>b.type==='shipyard'));
});
test('trade selectors reveal only known harbor identities and a real visit can open another market',()=>{
 const s=createGame(),p=getPlanet(s,'aurora-0');p.owner='ilyri';diplomaticAction(s,'ilyri','trade');
 assert.ok(!routeSelection(s,{},home(s)).targets.some(q=>q.id===p.id));assert.ok(!marketSelection(s,{}).planets.some(q=>q.id===p.id));
 recordContact(s,'player',p);assert.ok(routeSelection(s,{},home(s)).targets.some(q=>q.id===p.id));assert.ok(marketSelection(s,{}).planets.some(q=>q.id===p.id));
});
test('foreign exploration uses the same order validation, fuel booking and isolated knowledge archive',()=>{
 const s=createGame(),f=ship(s,'scout','foreign-scout','ilyri','thalassa'),p=getPlanet(s,'thalassa'),energy=p.stock.energy;
 assert.equal(exploreSystem(s,f.id,'silex','ilyri'),null);assert.equal(p.stock.energy,energy-32);
 advanceFlight(s,f);assert.equal(systemKnown(s,'silex','ilyri'),true);assert.equal(systemKnown(s,'silex','player'),false);
 assert.equal(knowledgeOf(s,getPlanet(s,'silex-0'),'ilyri').occupancy.value,false);
 assert.deepEqual(parseImport(exportGame(s)),s);
});
test('AI exploration construction and upkeep spend the owning empire budget',()=>{
 const s=createGame(),p=getPlanet(s,'thalassa'),f=s.factions.ilyri,before=f.credits;
 s.day=100;s.intelligence.ilyri.nextMission=0;const credits=s.credits;
 tickExplorationAI(s);assert.ok(p.queues.some(q=>q.type==='scout'));assert.equal(f.credits,before-65);assert.equal(s.credits,credits);
});
test('enemy targets come from recorded knowledge; no fabricated attack appears without a built fleet',()=>{
 const s=createGame(),p=getPlanet(s,'cinder');p.owner='player';p.population=40;p.stock.alloy=50000;
 s.day=1;s.aiNext=0;s.relations.ilyri.war=true;s.intelligence.ilyri.planets={};
 const before=structuredClone(p.stock);tickOpponents(s);assert.deepEqual(p.stock,before);assert.ok(!s.logs.some(e=>e.type==='war'));
 recordContact(s,'ilyri',home(s));s.aiNext=0;tickOpponents(s);assert.deepEqual(p.stock,before);assert.equal(knownWarTarget(s,'ilyri','player').id,'nereid');assert.ok(!s.logs.some(e=>e.type==='war'));assert.ok(!s.fleets.some(f=>f.owner==='ilyri'&&f.mission?.kind==='attack'));
});
test('one communication center per planet includes construction reservations and permits another planet',()=>{
 const s=createGame();s.tech=['communications'];s.credits=2000;home(s).stock.optics=100;
 const tile=p=>planetSurface(p).tiles.find(t=>!['water','cliff'].includes(t.terrain)&&!p.buildings.some(b=>b.x===t.x&&b.y===t.y));
 let a=tile(home(s));assert.equal(placeBuilding(s,home(s),'commCenter',a.x,a.y),null);
 a=tile(home(s));const before=exportGame(s);assert.ok(placeBuilding(s,home(s),'commCenter',a.x,a.y));assert.equal(exportGame(s),before);
 const p=getPlanet(s,'cinder');p.owner='player';p.stock=makeStock({alloy:100,optics:100});a=tile(p);assert.equal(placeBuilding(s,p,'commCenter',a.x,a.y),null);
});
test('roof count includes valid unanswered incoming offers and distinguishes unread declarations',()=>{
 const s=createGame();center(home(s));assert.equal(createOffer(s,'ilyri','trade'),null);assert.equal(createOffer(s,'corona','trade'),null);
 declareMessage(s,'ilyri','Erklärung','Ein öffentliches Schreiben.',true);
 assert.deepEqual(inboxSignal(s),{count:2,urgent:false,unread:true});readInbox(s);assert.equal(inboxSignal(s).count,2);assert.equal(inboxSignal(s).unread,false);
 s.day=23;assert.equal(inboxSignal(s).urgent,true);assert.equal(answerMessage(s,s.communications.messages.find(m=>m.from==='corona').id,'reject'),null);assert.equal(inboxSignal(s).count,1);
});
test('acceptance applies real treaties once and failed answers preserve funds and open offers',()=>{
 const s=createGame();center(home(s));createOffer(s,'ilyri','trade');const m=s.communications.messages[0],foreign=s.factions.ilyri.credits;
 s.credits=49;const before=exportGame(s);assert.ok(answerMessage(s,m.id,'accept'));assert.equal(exportGame(s),before);
 s.credits=800;assert.equal(answerMessage(s,m.id,'accept'),null);assert.equal(s.credits,750);assert.equal(s.factions.ilyri.credits,foreign-50);assert.equal(s.relations.ilyri.trade,true);assert.equal(inboxSignal(s).count,0);
 const accepted=exportGame(s);assert.ok(answerMessage(s,m.id,'accept'));assert.equal(exportGame(s),accepted);
});
test('unanswered offers expire, and changed diplomatic conditions withdraw them without generic penalties',()=>{
 const s=createGame();center(home(s));createOffer(s,'ilyri','trade');const score=s.relations.ilyri.score;
 s.day=30;tickCommunications(s);assert.equal(s.communications.messages[0].status,'expired');assert.equal(inboxSignal(s).count,0);assert.equal(s.relations.ilyri.score,score);
 createOffer(s,'corona','trade');s.relations.corona.war=true;tickCommunications(s);assert.equal(s.communications.messages[0].status,'withdrawn');
});
test('all planetary centers share replies and correspondence survives demolition and rebuilding',()=>{
 const s=createGame(),b=center(home(s)),p=getPlanet(s,'cinder');p.owner='player';center(p,'second-center');
 createOffer(s,'ilyri','trade');const m=s.communications.messages[0];
 const html=renderSheet(s,{...ui('cinder'),panel:'communications',communicationBuilding:'second-center'});assert.ok(html.includes(m.title));
 assert.equal(answerMessage(s,m.id,'reject'),null);assert.equal(inboxSignal(s).count,0);
 demolish(s,home(s),b.id);demolish(s,p,'second-center');assert.equal(s.communications.messages.length,1);
 center(home(s),'rebuilt');assert.ok(renderSheet(s,{...ui('nereid'),panel:'communications',communicationBuilding:'rebuilt',inboxMode:'archive'}).includes('Abgelehnt'));
 assert.deepEqual(parseImport(exportGame(s)),s);
});
test('outgoing offers wait for a reply, can be withdrawn, and do not increase the roof response count',()=>{
 const s=createGame();center(home(s));assert.equal(sendOffer(s,'ilyri','trade'),null);assert.equal(inboxSignal(s).count,0);assert.equal(s.relations.ilyri.trade,false);
 s.day=2;tickCommunications(s);assert.equal(s.relations.ilyri.trade,false);s.day=3;tickCommunications(s);assert.equal(s.relations.ilyri.trade,true);assert.equal(s.communications.messages[0].status,'accepted');
 assert.equal(sendOffer(s,'corona','trade'),null);const id=s.communications.messages[0].id;assert.equal(withdrawMessage(s,id),null);s.day=6;tickCommunications(s);assert.equal(s.relations.corona.trade,false);
 assert.ok(sendOffer(s,'corona','trade'));assert.deepEqual(parseImport(exportGame(s)),s);
});
test('AI request cadence is bounded, cannot duplicate a negotiation, and needs a functioning channel',()=>{
 const s=createGame();center(home(s));center(getPlanet(s,'thalassa'),'foreign-center');s.day=12;tickCommunications(s);
 assert.equal(inboxSignal(s).count,1);assert.equal(s.communications.nextOffer,60);
 for(let i=0;i<15;i++){s.day++;tickCommunications(s);}assert.equal(inboxSignal(s).count,1);
 assert.ok(createOffer(s,s.communications.messages[0].from,'trade'));
});
test('v6 migration keeps running routes and balances, adds nine worlds, and records only plausible earlier visits',()=>{
 const s=createGame();diplomaticAction(s,'ilyri','trade');orderFleet(s,['starter-f'],'thalassa','transport',{resource:'ore',amount:20,repeat:true});
 const old=structuredClone(s);old.version=6;old.planets=old.planets.slice(0,28);delete old.intelligence;delete old.communications;
 const loaded=parseImport(JSON.stringify(old));assert.equal(loaded.version,9);assert.equal(loaded.planets.length,49);assert.equal(loaded.credits,old.credits);
 for(const p of old.planets)assert.deepEqual(getPlanet(loaded,p.id),p);assert.deepEqual(loaded.fleets,old.fleets);
 assert.equal(knowledgeOf(loaded,getPlanet(loaded,'thalassa')).civil,undefined);
 for(let i=0;i<20;i++)stepDay(loaded);assert.deepEqual(parseImport(exportGame(loaded)),loaded);
});
test('migration preserves an existing route to a previously visited frontier harbor without inventing its civil details',()=>{
 const s=createGame();s.relations.ilyri.trade=true;const f=s.fleets[1];f.route={source:'nereid',target:'aurora-0',resource:'ore',amount:20,reserve:0};
 const old=structuredClone(s);old.version=6;old.planets=old.planets.slice(0,28);old.planets.find(p=>p.id==='aurora-0').owner='ilyri';delete old.intelligence;delete old.communications;
 const loaded=parseImport(JSON.stringify(old));assert.deepEqual(loaded.fleets[1].route,f.route);assert.equal(knowledgeOf(loaded,getPlanet(loaded,'aurora-0')).identity.value,'ilyri');assert.equal(knowledgeOf(loaded,getPlanet(loaded,'aurora-0')).civil,undefined);
 stepDay(loaded);assert.ok(loaded.fleets[1].route);assert.ok(loaded.fleets[1].mission);assert.deepEqual(parseImport(exportGame(loaded)),loaded);
});
test('malformed knowledge, deadlines, scan phases and duplicate centers are rejected at import',()=>{
 for(const edit of [s=>s.intelligence.ilyri.planets.nereid.occupancy.day=9,s=>s.intelligence.player.chartedSystems.push('bogus'),s=>s.intelligence.player.planets.cinder={geology:{source:'probe',precision:'observed',day:0,value:{oreFactor:-1,solarFactor:1}}},s=>{center(home(s));createOffer(s,'ilyri','trade');s.communications.messages[0].expires=400;},s=>{center(home(s));center(home(s),'duplicate');}]){const s=createGame();edit(s);assert.throws(()=>parseImport(exportGame(s)));}
 const s=createGame(),f=ship(s,'probe');scanTech(s);orderFleet(s,[f.id],'cinder','analyze');f.mission.phase='scan';assert.throws(()=>parseImport(exportGame(s)));
});
