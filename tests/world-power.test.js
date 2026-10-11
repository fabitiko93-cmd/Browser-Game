import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, makeStock, getPlanet, initialBuildings } from '../src/state.js';
import { FACTIONS, TECHNOLOGIES, RESOURCE_KEYS } from '../src/data.js';
import { homePlanet, systemsOf } from '../src/world.js';
import { runDailyEconomy, forecastDay } from '../src/budget.js';
import { orderFleet, tickFleets } from '../src/fleets.js';
import { exploreSystem } from '../src/exploration.js';
import { chartSystem, observePlanet, knowledgeOf, recordContact } from '../src/intelligence.js';
import { orderRelic, RELICS, syncRuins } from '../src/ruins.js';
import { unloadCargo } from '../src/routing.js';
import { buildingBlock } from '../src/infrastructure.js';
import { setTradeBoard, playerAsk, receivePublicOrder, buyPublicSurplus, tickTradeBoards } from '../src/trade-board.js';
import { finishCommerce, tickForeignCommerce } from '../src/foreign-commerce.js';
import { createBloc, joinBloc, joinIssue, blocOf, blocPartners, tickBlocs, orderBlocSupply, hegemonyProgress, tickHegemony, peaceTerms, settlePeace, activeWar } from '../src/power.js';
import { beginWar, endWar, relationBetween } from '../src/realm-relations.js';
import { createOffer, answerMessage, tickCommunications } from '../src/communications.js';
import { knownWarTarget } from '../src/realm-ai.js';
import { decide, decisionCost } from '../src/governance.js';
import { destroyPlanet } from '../src/strategic.js';
import { stepDay } from '../src/simulation.js';
import { validateSave, exportGame, parseImport } from '../src/save.js';
import { renderSheet } from '../src/ui.js';
import { marketPrice } from '../src/trade.js';
import { explorationPanel } from '../src/intelligence-ui.js';

const game=()=>createGame({seed:3077});
function unlock(s,id,owner='player'){const list=owner==='player'?s.tech:s.factions[owner].tech;if(list.includes(id))return;for(const key of TECHNOLOGIES[id].requires)unlock(s,key,owner);if(TECHNOLOGIES[id].requiresAny&&!TECHNOLOGIES[id].requiresAny.some(k=>list.includes(k)))unlock(s,TECHNOLOGIES[id].requiresAny[0],owner);list.push(id);}
function ship(s,type='freighter',owner='player'){const f={id:`test-f-${s.nextId++}`,name:'Testschiff',type,owner,planetId:homePlanet(s,owner).id,hp:100,supply:100,cargo:makeStock(),mission:null,route:null};s.fleets.push(f);return f;}
function flight(s,f,max=150){for(let i=0;i<max&&f.mission;i++){s.day++;tickFleets(s,{economyProcessed:true});}assert.equal(f.mission,null);}
function forum(s,owner='player'){unlock(s,'advancedDiplomacy',owner);const p=homePlanet(s,owner);for(const [i,type]of ['commCenter','embassy'].entries())if(!p.buildings.some(b=>b.type===type))p.buildings.push({id:`test-${owner}-${type}`,type,x:2+i,y:4,remaining:0,enabled:true,status:'aktiv'});(owner==='player'?s:s.factions[owner]).credits=5000;}
function secondWorld(s,owner='player'){const p=s.planets.find(p=>!p.owner&&!p.destroyed&&s.intelligence[owner].chartedSystems.includes(p.system));p.owner=owner;p.population=80;p.buildings=initialBuildings(p.id);p.stock=makeStock({food:500,energy:500,alloy:300});chartSystem(s,owner,p.system);return p;}
function memberBloc(s,leader='player',member='ilyri'){forum(s,leader);forum(s,member);secondWorld(s,leader);Object.assign(relationBetween(s,leader,member),{score:80,trade:true});assert.equal(createBloc(s,leader),null);assert.equal(joinBloc(s,leader,member),null);return blocOf(s,leader);}

test('seeded worlds are reproducible, change homes and system composition, and start all nineteen realms with viable supply',()=>{
 const a=game(),b=game(),c=createGame({seed:42});assert.deepEqual(a,b);assert.notEqual(homePlanet(a).id,homePlanet(c).id);assert.notDeepEqual(a.world.systems,c.world.systems);assert.notDeepEqual(a.planets.map(p=>[p.id,p.system,p.kind]),c.planets.map(p=>[p.id,p.system,p.kind]));
 for(const s of[a,c]){assert.equal(systemsOf(s).length,16);assert.equal(s.world.anchors.length,3);assert.ok(s.planets.some(p=>!p.owner&&p.ruin));assert.equal(new Set(s.planets.filter(p=>p.owner).map(p=>p.owner)).size,19);const before=exportGame(s),pred=forecastDay(s);assert.equal(exportGame(s),before);for(const p of pred.planets.filter(p=>p.owner)){assert.equal(p.lastReport.fed,p.lastReport.demand);assert.ok(p.stock.energy>0);}validateSave(s);}
});
test('an empty star is reachable only after a real scout journey and cannot be colonized',()=>{
 const s=game(),p=s.world.anchors.find(p=>!p.ruin),f=ship(s,'scout');unlock(s,'engineTuning');assert.equal(exploreSystem(s,f.id,p.system),null);assert.equal(s.intelligence.player.chartedSystems.includes(p.system),false);assert.ok(!explorationPanel(s,{systemId:p.system}).includes('Leeres Sternsystem'));flight(s,f);assert.ok(s.intelligence.player.chartedSystems.includes(p.system));assert.match(explorationPanel(s,{systemId:p.system}),/keine Planeten/);const colony=ship(s,'colony'),before=exportGame(s);assert.match(orderFleet(s,[colony.id],p.id,'settle'),/nicht besiedelt/);assert.equal(exportGame(s),before);validateSave(s);
});
test('scanning reveals ruin and geology without civil or military secrets; salvage is paid and finite',()=>{
 const s=game(),p=s.world.anchors.find(p=>p.ruin),f=s.fleets.find(f=>f.type==='freighter'),home=homePlanet(s);chartSystem(s,'player',p.system);observePlanet(s,'player',p,'scout');assert.equal(knowledgeOf(s,p).relic,undefined);assert.ok(orderRelic(s,f.id,p.id,'salvage'));unlock(s,'planetaryAnalysis');observePlanet(s,'player',p,'probe');assert.ok(knowledgeOf(s,p).relic);assert.equal(knowledgeOf(s,p).civil,undefined);const cash=s.credits;assert.equal(orderRelic(s,f.id,p.id,'salvage'),null);assert.equal(s.credits,cash-65);flight(s,f);for(const[k,n]of Object.entries(RELICS[p.ruin.type].salvage))assert.equal(f.cargo[k],n);const before=exportGame(s);assert.ok(orderRelic(s,f.id,p.id,'salvage'));assert.equal(exportGame(s),before);const alloy=home.stock.alloy;assert.equal(unloadCargo(s,f.id),null);assert.equal(home.stock.alloy,alloy+RELICS[p.ruin.type].salvage.alloy);validateSave(s);
});
test('orbital restoration consumes delivered material and continuous supplies, with forecast matching the daily budget',()=>{
 const s=game(),p=s.world.anchors.find(p=>p.ruin?.type==='depot'),f=s.fleets.find(f=>f.type==='freighter');unlock(s,'planetaryAnalysis');unlock(s,'supplyPorts');chartSystem(s,'player',p.system);observePlanet(s,'player',p,'probe');assert.equal(orderRelic(s,f.id,p.id,'restore'),null);assert.equal(f.cargo.alloy,16);validateSave(s);flight(s,f);assert.equal(p.ruin.status,'active');assert.equal(p.owner,'player');assert.equal(p.stock.alloy,16);assert.equal(p.population,0);const cash=s.credits,food=p.stock.food,forecast=forecastDay(s),actual=runDailyEconomy(s);assert.ok(Math.abs(s.credits-cash-forecast.budget.net)<1e-8);assert.equal(actual.net,forecast.budget.net);assert.equal(p.stock.food,food-.12);p.stock.energy=0;runDailyEconomy(s);assert.equal(p.active,false);validateSave(s);
});
test('losing a restoration fleet releases the site instead of permanently locking the ruin',()=>{
 const s=game(),p=s.world.anchors.find(p=>p.ruin),f=ship(s);unlock(s,'planetaryAnalysis');unlock(s,RELICS[p.ruin.type].tech);chartSystem(s,'player',p.system);observePlanet(s,'player',p,'probe');orderRelic(s,f.id,p.id,'restore');while(f.mission.phase!=='work'){s.day++;tickFleets(s,{economyProcessed:true});}assert.equal(p.ruin.status,'restoring');s.fleets=s.fleets.filter(q=>q!==f);syncRuins(s);assert.equal(p.ruin.status,'sealed');assert.equal(p.ruin.operator,null);validateSave(s);
});
test('extraction limits are physical, apply to player and foreign construction, and do not deplete yields',()=>{
 const s=game(),p=homePlanet(s),q=homePlanet(s,'ilyri');for(const target of[p,q]){target.buildings=Array.from({length:target.deposits.ore},(_,i)=>({id:`cap-${i}`,type:i?'deepMine':'mine',x:2+i,y:3,remaining:0,enabled:true,status:'aktiv'}));assert.match(buildingBlock(s,target,'mine'),/Förder/);assert.match(buildingBlock(s,target,'deepMine'),/Förder/);}const d=structuredClone(p.deposits);for(let i=0;i<10;i++)runDailyEconomy(s);assert.deepEqual(p.deposits,d);
});
test('public imports reserve real cash, cannot overspend, and cancellation refunds only unused escrow',()=>{
 const s=game(),p=homePlanet(s);s.credits=400;p.stock.food=0;assert.equal(setTradeBoard(s,p.id,'food',50,3,100,false),null);assert.equal(s.credits,300);const before=exportGame(s);assert.ok(setTradeBoard(s,p.id,'food',50,3,900,false));assert.equal(exportGame(s),before);const cash=s.factions.ilyri.credits,amount=receivePublicOrder(s,p,'food',200,'ilyri');assert.ok(amount>0&&amount<=50);assert.equal(p.stock.food,amount);const spent=100-p.tradeBoard.escrow;assert.ok(Math.abs(s.factions.ilyri.credits-cash-spent)<1e-8);assert.equal(setTradeBoard(s,p.id,'food',0,3,0,false),null);assert.ok(Math.abs(s.credits-(400-spent))<1e-8);validateSave(s);
});
test('foreign purchases pay the player, physically return cargo, and never sell protected reserves',()=>{
 const s=game(),p=homePlanet(s),origin=homePlanet(s,'ilyri'),f=ship(s,'freighter','ilyri');Object.assign(s.relations.ilyri,{trade:true,score:60});p.tradeBoard.exports=true;p.stock.food=1000;const ask=playerAsk(s,p,'food'),cash=s.credits,foreignCash=s.factions.ilyri.credits,stock=p.stock.food;
 finishCommerce(s,f,{kind:'commerce',mode:'purchase',source:origin.id,buyer:'ilyri',intent:{resource:'food',amount:40,maxPrice:100},cargo:null},p);assert.equal(f.cargo.food,40);assert.equal(p.stock.food,stock-40);assert.ok(s.credits>cash);assert.ok(Math.abs(s.credits-cash-(foreignCash-s.factions.ilyri.credits))<1e-8);assert.equal(f.mission.target,origin.id);buyPublicSurplus(s,p,'food',10000,'ilyri');assert.ok(p.stock.food>=stock-ask.amount-.000001);p.tradeBoard.exports=false;assert.equal(buyPublicSurplus(s,p,'food',40,'ilyri').amount,0);
});
test('AI routes can deliver funded player orders and select player surplus without reading or granting hidden intelligence',()=>{
 const s=game(),p=homePlanet(s),origin=homePlanet(s,'ilyri'),f=ship(s,'freighter','ilyri');s.day=19;for(const q of s.planets.filter(q=>q.owner==='ilyri'&&q!==origin))q.owner=null;for(const r of Object.values(s.galaxy.relations))r.trade=false;Object.assign(s.relations.ilyri,{trade:true,score:70});recordContact(s,'ilyri',p);origin.stock.food=1000;origin.stock.energy=1000;p.stock.food=0;assert.equal(setTradeBoard(s,p.id,'food',60,3,180,false),null);tickForeignCommerce(s);assert.equal(f.mission.target,p.id);assert.equal(f.mission.kind,'commerce');assert.ok(f.mission.cargo.amount>0);validateSave(s);f.planetId=p.id;const m=f.mission;f.mission=null;finishCommerce(s,f,m,p);assert.ok(p.stock.food>0);assert.equal(knowledgeOf(s,p,'ilyri').civil,undefined);
 f.mission=null;f.planetId=origin.id;f.tradeReady=0;f.cargo=makeStock();p.stock.food=1000;origin.stock.food=0;p.tradeBoard.exports=true;tickForeignCommerce(s);assert.equal(f.mission.mode,'purchase');assert.equal(f.mission.cargo,null);assert.equal(knowledgeOf(s,p,'ilyri').civil,undefined);validateSave(s);
});
test('public order renewal refunds unused cash and preserves the explicit treasury reserve',()=>{
 const s=game(),p=homePlanet(s);s.credits=300;setTradeBoard(s,p.id,'food',500,2,200,false);p.tradeBoard.escrow=50;s.day=30;tickTradeBoards(s);assert.equal(s.credits,150);assert.equal(p.tradeBoard.escrow,0);assert.equal(p.tradeBoard.budget,200);
});
test('binding membership requires consent and funded trust; shared ports do not reveal populations or military data',()=>{
 const s=game();forum(s);forum(s,'ilyri');secondWorld(s);assert.equal(createBloc(s),null);assert.ok(joinIssue(s,'player','ilyri'));Object.assign(s.relations.ilyri,{trade:true,score:80});assert.equal(createOffer(s,'ilyri','bloc',false),null);assert.equal(blocPartners(s,'player','ilyri'),false);s.day=3;tickCommunications(s);assert.equal(blocPartners(s,'player','ilyri'),true);assert.equal(knowledgeOf(s,homePlanet(s,'ilyri')).civil,undefined);assert.equal(knowledgeOf(s,homePlanet(s,'ilyri')).military,undefined);assert.equal(blocOf(s,'ilyri').leader,'player');assert.equal(beginWar(s,'player','ilyri'),false);validateSave(s);
});
test('incoming membership is handled only through the communication center and charges the joining side',()=>{
 const s=game();forum(s,'ilyri');forum(s);secondWorld(s,'ilyri');Object.assign(s.relations.ilyri,{score:80,trade:true});createBloc(s,'ilyri');createOffer(s,'ilyri','bloc',true);const m=s.communications.messages.find(m=>m.type==='bloc'),cash=s.credits;assert.equal(blocOf(s,'player'),null);assert.equal(answerMessage(s,m.id,'accept'),null);assert.equal(s.credits,cash-100);assert.equal(blocOf(s,'player').leader,'ilyri');validateSave(s);
});
test('bloc upkeep is recurring and exactly included in the forecast; unpaid commitments lead to an exit',()=>{
 const s=game(),b=memberBloc(s),before=s.credits,forecast=forecastDay(s);const actual=runDailyEconomy(s);assert.equal(actual.blocIncome,2);assert.equal(actual.blocCosts,4);assert.ok(Math.abs(s.credits-before-forecast.budget.net)<1e-8);s.factions.ilyri.credits=-1;for(let i=0;i<3;i++){s.day+=30;b.terms.ilyri.paidDays=0;tickBlocs(s);}assert.equal(blocOf(s,'ilyri'),null);assert.ok(s.galaxy.blocCooldowns.ilyri>s.day);assert.ok(joinIssue(s,'player','ilyri'));validateSave(s);
});
test('supply obligations move real cargo and cannot double book an in-flight promise',()=>{
 const s=game(),b=memberBloc(s),target=homePlanet(s,'ilyri'),f=s.fleets.find(f=>f.type==='freighter'),source=homePlanet(s);b.terms.ilyri.request={planet:target.id,resource:'food',amount:48,delivered:0,until:60};const stock=target.stock.food,sourceStock=source.stock.food;assert.equal(orderBlocSupply(s,'ilyri',f.id),null);assert.equal(source.stock.food,sourceStock-48);assert.equal(target.stock.food,stock);assert.equal(b.terms.ilyri.request.delivered,0);assert.ok(orderBlocSupply(s,'ilyri'));validateSave(s);flight(s,f);assert.equal(target.stock.food,stock+48);assert.equal(b.terms.ilyri.request.delivered,48);validateSave(s);
});
test('foreign ships using shared player ports credit real service revenue in both forecast and actual treasury',()=>{
 const s=game();memberBloc(s);const f=ship(s,'freighter','ilyri');f.planetId=homePlanet(s).id;f.supply=10;const before=s.credits,foreign=s.factions.ilyri.credits,pred=forecastDay(s),actual=runDailyEconomy(s);assert.ok(actual.portIncome>0);assert.equal(actual.portIncome,pred.budget.portIncome);assert.ok(Math.abs(s.credits-before-pred.budget.net)<1e-8);assert.ok(f.supply>10);assert.ok(s.factions.ilyri.credits<foreign+100);validateSave(s);
});
test('long government programs are paid, scale with colonies, and apply the same modifiers and expiry to the AI',()=>{
 const s=game();assert.equal(decide(s,'grant'),null);assert.equal(s.governance.decisions[0].until,120);const cost=decisionCost(s,'industry');secondWorld(s);assert.ok(decisionCost(s,'industry')>cost);const cash=s.factions.khepri.credits;assert.equal(decide(s,'grant','khepri'),null);assert.equal(s.factions.khepri.credits,cash-420);assert.equal(s.factions.khepri.governance.decisions[0].until,120);validateSave(s);
});
test('an AI trade program changes its real export terms while spending its own treasury',()=>{
 const s=game(),target=homePlanet(s,'ilyri'),before=marketPrice(s,target,'food','sell',0,'aster'),cash=s.factions.aster.credits;assert.equal(decide(s,'trade','aster'),null);assert.equal(s.factions.aster.credits,cash-300);assert.ok(marketPrice(s,target,'food','sell',0,'aster')>before);validateSave(s);
});
test('a member at war can request real military supplies without creating free ships or weapons',()=>{
 const s=game(),b=memberBloc(s),target=homePlanet(s,'ilyri');target.stock.weapons=0;assert.equal(beginWar(s,'ilyri','aster'),true);s.day=Object.keys(FACTIONS).indexOf('ilyri');tickBlocs(s);assert.equal(b.terms.ilyri.request.resource,'weapons');const before=homePlanet(s).stock.weapons,f=s.fleets.find(f=>f.type==='freighter');assert.equal(orderBlocSupply(s,'ilyri',f.id),null);assert.equal(homePlanet(s).stock.weapons,before-16);assert.equal(target.stock.weapons,0);flight(s,f);assert.equal(target.stock.weapons,16);assert.equal(b.terms.ilyri.request.delivered,16);validateSave(s);
});
test('early peace cannot be purchased; a resolved limited claim enables territorial terms and a binding truce',()=>{
 const s=game(),enemy='aster',target=homePlanet(s,enemy);recordContact(s,'player',target);assert.equal(beginWar(s,'player',enemy,target.id),true);assert.equal(activeWar(s,'player',enemy).target,target.id);const before=exportGame(s);assert.ok(settlePeace(s,'player',enemy));assert.equal(exportGame(s),before);target.owner='player';chartSystem(s,'player',target.system);assert.equal(knownWarTarget(s,'player',enemy)?.id,undefined);assert.equal(peaceTerms(s,'player',enemy).accepted,true);assert.equal(settlePeace(s,'player',enemy),null);assert.equal(s.relations.aster.war,false);assert.equal(beginWar(s,'player',enemy),false);assert.equal(activeWar(s,'player',enemy),undefined);validateSave(s);
});
test('defeat in a war requires funded reparations that are actually credited to the other treasury',()=>{
 const s=game(),lost=homePlanet(s);beginWar(s,'aster','player',lost.id);lost.owner='aster';const second=secondWorld(s),cash=s.factions.aster.credits;s.day=30;s.credits=100;assert.equal(peaceTerms(s,'player','aster').accepted,false);s.credits=500;assert.equal(settlePeace(s,'player','aster'),null);assert.equal(s.factions.aster.credits,cash+250);assert.equal(s.credits,250);assert.equal(second.owner,'player');
});
test('system sovereignty requires a majority, empty stars carry no weight, and destruction never lowers the victory denominator',()=>{
 const s=game(),before=hegemonyProgress(s,'player');for(const p of s.world.anchors){p.owner='player';p.population=0;}assert.equal(hegemonyProgress(s,'player').share,before.share);for(const p of s.planets.filter(p=>p.owner!=='player').slice(0,10))destroyPlanet(s,p);const after=hegemonyProgress(s,'player');assert.equal(after.total,before.total);assert.ok(after.share<=before.share);
});
test('hegemony requires uninterrupted healthy control, the AI can win under the same rule, and the result can be continued',()=>{
 for(const owner of['player','ilyri']){const s=game(),retained=homePlanet(s).id;for(const p of s.planets){p.owner=owner!=='player'&&p.id===retained?'player':owner;p.population=100;p.happiness=70;p.stock.food=1000;chartSystem(s,owner,p.system);}for(let i=0;i<50;i++){s.day++;tickHegemony(s);}assert.equal(s.galaxy.hegemony.streak,50);(owner==='player'?s:s.factions[owner]).credits=-1;s.day++;tickHegemony(s);assert.equal(s.galaxy.hegemony.streak,0);(owner==='player'?s:s.factions[owner]).credits=5000;for(let i=0;i<119;i++){s.day++;tickHegemony(s);}assert.equal(s.galaxy.hegemony.winner,null);s.day++;tickHegemony(s);assert.equal(s.galaxy.hegemony.winner.owner,owner);const day=s.day;stepDay(s);assert.equal(s.day,day);s.galaxy.hegemony.continued=true;stepDay(s);assert.equal(s.day,day+1);}
});
test('v9 saves retain their fixed world, balances and in-flight routes; fresh saves retain generated geography exactly',()=>{
 const s=createGame({legacy:true}),home=homePlanet(s);s.version=9;delete s.world;for(const k of['blocs','blocCooldowns','wars','hegemony'])delete s.galaxy[k];for(const p of s.planets){delete p.deposits;delete p.tradeBoard;}const before=structuredClone(s),migrated=parseImport(exportGame(s));assert.equal(migrated.world.generated,false);assert.equal(migrated.credits,before.credits);for(const p of before.planets){const q=migrated.planets.find(q=>q.id===p.id);assert.equal(q.system,p.system);assert.deepEqual(q.stock,p.stock);assert.deepEqual(q.buildings,p.buildings);assert.equal(q.deposits.ore,3);}assert.deepEqual(migrated.fleets,before.fleets);assert.equal(home.name,migrated.planets.find(p=>p.id===home.id).name);const fresh=game();assert.deepEqual(parseImport(exportGame(fresh)),fresh);
});
test('malformed seeds, duplicate bloc membership, fabricated victory weights and unfunded escrow are rejected',()=>{
 const s=game();for(const change of[q=>q.world.seed=-1,q=>q.galaxy.hegemony.planetWeights[q.planets[0].id]=99,q=>q.planets[0].tradeBoard.escrow=10]){const q=structuredClone(s);change(q);assert.throws(()=>validateSave(q));}memberBloc(s);s.galaxy.blocs[0].members.push('player');assert.throws(()=>validateSave(s));
});
test('the existing mobile views expose public orders and the connected endgame without a second inbox or green borders',()=>{
 const s=game(),p=homePlanet(s),ui={planetId:p.id,systemId:p.system,panel:'economy',economyMode:'routes',routeMode:'markets',fleetIds:[]};assert.match(renderSheet(s,ui),/Eigener öffentlicher Handelsplatz/);ui.panel='fleet';ui.fleetMode='goals';const markup=renderSheet(s,ui);assert.match(markup,/Vorherrschaft im Sektor/);assert.match(markup,/Machtbund gründen/);assert.ok(!markup.includes('green-border'));assert.ok(!markup.includes('data-action="inbox"'));
});
