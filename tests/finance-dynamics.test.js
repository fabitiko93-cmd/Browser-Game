import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, getPlanet, initialBuildings } from '../src/state.js';
import { IDEOLOGIES, TECHNOLOGIES } from '../src/data.js';
import { PROFILES, LAWS, DECISIONS } from '../src/governance.js';
import { financialCondition, localSale, localSaleQuote, austerity } from '../src/finance.js';
import { forecastDay, runDailyEconomy } from '../src/budget.js';
import { stepDay } from '../src/simulation.js';
import { marketMidpoint, marketPrice, sellGoods } from '../src/trade.js';
import { tickForeignCommerce } from '../src/foreign-commerce.js';
import { tickForeignDevelopment } from '../src/foreign.js';
import { tickFleets, orderFleet, buildShip, maintainFleets } from '../src/fleets.js';
import { observePlanet } from '../src/intelligence.js';
import { parseImport, exportGame, validateSave } from '../src/save.js';
import { renderMapHead, renderSheet, renderResources } from '../src/ui.js';
import { tickResearch } from '../src/research.js';
const home=s=>getPlanet(s,'nereid');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const add=(p,type,remaining=0)=>{const b={id:`test-${type}`,type,x:9,y:9,remaining,enabled:true,status:'aktiv'};p.buildings.push(b);return b;};
const unlock=(s,owner,id)=>{const tech=owner==='player'?s.tech:s.factions[owner].tech;const visit=key=>{for(const r of TECHNOLOGIES[key].requires)visit(r);if(!tech.includes(key))tech.push(key);};visit(id);};

test('unpaid expenses become actual debt and HUD/forecast keep the exact recurring delta',()=>{
 const s=createGame();s.credits=0;s.player.tax=.02;const before=exportGame(s),forecast=forecastDay(s);
 assert.equal(exportGame(s),before);assert.ok(forecast.budget.net<0);stepDay(s);
 close(s.credits,forecast.budget.net);assert.ok(s.credits<0);assert.ok(renderResources(s,{planetId:'nereid'}).includes('resource-pill warning'));
 const next=forecastDay(s),opening=s.credits;stepDay(s);close(s.credits-opening,next.budget.net);assert.ok(next.budget.interest>0);
 assert.deepEqual(parseImport(exportGame(s)),s);
});
test('debt stops construction, reduces industrial output and cannot be erased by auto-maintenance',()=>{
 const solvent=createGame(),s=structuredClone(solvent);s.credits=-10;
 const pending=add(home(s),'lab',3);s.fleets[0].supply=60;s.fleets[0].hp=60;
 runDailyEconomy(solvent);runDailyEconomy(s);
 assert.equal(pending.remaining,3);assert.equal(pending.status,'Bau wartet auf Finanzierung');
 close(home(s).lastReport.productionByResource.alloy,home(solvent).lastReport.productionByResource.alloy*.8);
 close(home(s).lastReport.science,home(solvent).lastReport.science*.5);
 assert.equal(s.fleets[0].supply,57);assert.equal(s.fleets[0].hp,60);
 assert.ok(home(s).lastReport.productionByResource.food>0);assert.ok(home(s).lastReport.productionByResource.energy>0);
});
test('financial emergency stops nonessential facilities while preserving basic supply and permits recovery',()=>{
 const s=createGame();s.credits=-400;assert.equal(financialCondition(s).severe,true);runDailyEconomy(s);
 assert.equal(home(s).buildings.find(b=>b.type==='lab').status,'Finanznotstand');assert.equal(home(s).lastReport.science,0);
 assert.ok(home(s).lastReport.productionByResource.food>0);assert.ok(s.lastDayReport==null);
 s.credits=50;runDailyEconomy(s);assert.equal(home(s).buildings.find(b=>b.type==='lab').status,'aktiv');assert.ok(home(s).lastReport.science>0);
});
test('austerity and bounded local buyers provide a real early recovery without spawning goods or unlimited money',()=>{
 const s=createGame(),p=home(s);s.credits=-100;
 const opening=s.credits,stock=p.stock.optics,q=localSaleQuote(s,p,'optics',25);
 assert.equal(localSale(s,p,'optics',25),null);close(s.credits-opening,q.total);close(stock-p.stock.optics,q.amount);assert.ok(p.localMarket.cash<108);
 localSale(s,p,'ore',50);assert.ok(p.localMarket.sold<=50);const before=exportGame(s);assert.ok(localSale(s,p,'ore',1));assert.equal(exportGame(s),before);
 assert.equal(austerity(s),null);const forecast=forecastDay(s);assert.ok(forecast.budget.net>0);
 for(let i=0;i<60;i++)stepDay(s);assert.ok(s.credits>0);assert.ok(p.localMarket.cash<=200);validateSave(s);
});
test('local trade is atomic for invalid resources, owners, volumes and exhausted civilian budgets',()=>{
 for(const [key,amount] of [['unknown',25],['ore',NaN],['ore',-2],['ore',Infinity]]){const s=createGame(),before=exportGame(s);assert.ok(localSale(s,home(s),key,amount));assert.equal(exportGame(s),before);}
 const s=createGame(),p=home(s);p.localMarket.cash=0;assert.ok(localSale(s,p,'ore'));assert.ok(localSale(s,getPlanet(s,'thalassa'),'ore'));assert.ok(localSale(s,null,'ore'));
});
test('new income remains small and follows actual wellbeing and basic supply',()=>{
 const s=createGame(),baseline=forecastDay(s).budget.commerce;
 assert.ok(baseline>0&&baseline<4);home(s).happiness=10;home(s).stock.food=0;home(s).buildings.find(b=>b.type==='farm').enabled=false;
 assert.ok(forecastDay(s).budget.commerce<baseline*.4);
});
test('ongoing research pauses in insolvency and resumes without losing its paid project',()=>{
 const s=createGame();s.research={id:'mineralScan',remaining:3,total:3};s.credits=-1;tickResearch(s);assert.equal(s.research.remaining,3);s.credits=1;tickResearch(s);assert.equal(s.research.remaining,2);
});
test('scarcity and surplus production create pronounced prices and deliveries actually relieve the shortage',()=>{
 const s=createGame(),p=getPlanet(s,'aster');s.relations.aster.trade=true;
 p.lastReport={demandByResource:{ore:12},productionByResource:{ore:0}};p.stock.ore=0;
 const scarce=marketMidpoint(s,p,'ore'),bid=marketPrice(s,p,'ore');p.stock.ore=300;
 const abundant=marketMidpoint(s,p,'ore');assert.ok(scarce>abundant*2);
 p.stock.ore=0;const q=sellGoods(s,p,'ore',100);assert.equal(q.amount,100);assert.ok(marketPrice(s,p,'ore')<bid);
 p.stock.ore=40;const deficit=marketMidpoint(s,p,'ore');p.lastReport.productionByResource.ore=30;assert.ok(marketMidpoint(s,p,'ore')<deficit);
});
test('foreign trade uses a built ship, real fuel, physical cargo, arrival prices and both treasuries',()=>{
 const s=createGame(),origin=getPlanet(s,'aster'),target=getPlanet(s,'ilyri')??getPlanet(s,'thalassa');
 origin.stock.ore=500;origin.stock.energy=1000;target.stock.ore=0;
 target.lastReport={demandByResource:{ore:10},productionByResource:{ore:0}};
 for(const p of s.planets)if(p!==target&&p.owner&&p.owner!=='aster')for(const key of Object.keys(p.stock))p.stock[key]=10000;
 const f={...structuredClone(s.fleets[1]),id:'ai-trader',owner:'aster',planetId:origin.id,supplySettings:{...s.fleets[1].supplySettings,homePort:origin.id}};s.fleets.push(f);
 const stock=origin.stock.ore,energy=origin.stock.energy;tickForeignCommerce(s);assert.equal(f.mission.kind,'commerce');assert.equal(f.mission.target,target.id);
 close(origin.stock.ore+f.mission.cargo.amount,stock);assert.ok(origin.stock.energy<energy);
 const amount=f.mission.cargo.amount,price=marketMidpoint(s,target,'ore')*.9,buyer=s.factions.ilyri.credits,seller=s.factions.aster.credits;
 while(f.mission?.kind==='commerce')tickFleets(s,{economyProcessed:true});
 close(target.stock.ore,amount);close(buyer-s.factions.ilyri.credits,amount*price);close(s.factions.aster.credits-seller,amount*price);assert.equal(f.mission.kind,'move');validateSave(s);
});
test('unknown AI harbors cannot be chosen and unfinanced imports are refused',()=>{
 const s=createGame(),p=getPlanet(s,'aster');p.stock.ore=1000;p.stock.energy=1000;
 const f={...structuredClone(s.fleets[1]),id:'ai-trader',owner:'aster',planetId:p.id,supplySettings:{...s.fleets[1].supplySettings,homePort:p.id}};s.fleets.push(f);
 s.intelligence.aster.planets={};tickForeignCommerce(s);assert.equal(f.mission,null);
});
test('18 small foreign states share systems, possess distinctive economies and ten coherent political choices',()=>{
 const s=createGame();assert.equal(Object.keys(s.factions).length,18);assert.equal(Object.keys(IDEOLOGIES).length,10);
 for(const id of Object.keys(s.factions))assert.equal(s.planets.filter(p=>p.owner===id).length,1,id);
 assert.ok(new Set(s.planets.filter(p=>p.owner).map(p=>p.system)).size<Object.keys(s.factions).length);
 assert.notDeepEqual(getPlanet(s,'thalassa').stock,getPlanet(s,'aster').stock);
 assert.ok(!getPlanet(s,'thalassa').buildings.some(b=>b.type==='mine'));assert.ok(getPlanet(s,'aster').buildings.some(b=>b.type==='mine'));
 for(const id of ['federation','corporate','oligarchy','theocracy']){
   assert.ok(Object.values(LAWS.administration.options).some(o=>o.ideologies?.includes(id)&&o.requiredTech));
   assert.ok(Object.values(DECISIONS).some(o=>o.ideologies?.includes(id)));assert.ok(PROFILES[id]);
 }
});
test('the AI cuts expenses when insolvent and avoids building unsustainable optional facilities',()=>{
 const s=createGame();s.factions.aster.credits=-10;const p=getPlanet(s,'aster'),count=p.buildings.filter(b=>b.enabled).length;
 tickForeignDevelopment(s);assert.ok(p.buildings.filter(b=>b.enabled).length<count);assert.ok(s.factions.aster.credits<0);
});
test('AI colonization consumes its own ship and creates its own colony, never a player colony',()=>{
 const s=createGame(),p=getPlanet(s,'cinder');unlock(s,'ilyri','habitats');const source=getPlanet(s,'thalassa');
 Object.assign(source.stock,{alloy:200,food:100,energy:100});source.queues=[];assert.equal(buildShip(s,source,'colony','ilyri'),null);
 const f={...structuredClone(s.fleets[1]),type:'colony',id:'ai-colony',owner:'ilyri',planetId:source.id,cargo:Object.fromEntries(Object.keys(source.stock).map(k=>[k,0])),supplySettings:{...s.fleets[1].supplySettings,homePort:source.id}};s.fleets.push(f);
 observePlanet(s,'ilyri',p,'scout');assert.equal(orderFleet(s,[f.id],p.id,'settle',{owner:'ilyri'}),null);
 while(f.mission)tickFleets(s,{economyProcessed:true});assert.equal(p.owner,'ilyri');assert.equal(p.population,40);assert.ok(!s.fleets.includes(f));assert.equal(s.planets.filter(p=>p.owner==='player').length,1);validateSave(s);
});
test('v7 migration retains ownership, archives, cargo and balances while adding small states',()=>{
 const s=createGame();s.version=7;s.planets=s.planets.filter(p=>!p.expansion);
 for(const id of Object.keys(s.factions))if(!['ilyri','khepri','aster','corona','collective','vanguard'].includes(id)){delete s.factions[id];delete s.relations[id];delete s.intelligence[id];}
 for(const b of Object.values(s.intelligence))for(const pid of Object.keys(b.planets))if(!s.planets.some(p=>p.id===pid))delete b.planets[pid];
 const p=getPlanet(s,'aurora-0');p.owner='player';p.population=100;p.buildings=initialBuildings(p.id);p.stock.ore=777;s.credits=333;
 const old=structuredClone(s),loaded=parseImport(exportGame(s));assert.equal(loaded.version,8);assert.equal(loaded.planets.length,49);assert.equal(loaded.credits,333);
 assert.deepEqual(getPlanet(loaded,'aurora-0'),p);assert.deepEqual(loaded.fleets,old.fleets);assert.deepEqual(loaded.intelligence.player.planets.thalassa,old.intelligence.player.planets.thalassa);
});
test('planet information is directly reachable from the map title and no longer buried in building choices',()=>{
 const s=createGame(),ui={planetId:'nereid',systemId:'helios',view:'planet',panel:'build'};
 assert.ok(renderMapHead(s,ui).includes('data-action="planet-info"'));assert.ok(!renderSheet(s,ui).includes('data-action="planet-info"'));
 for(const economyMode of ['production','finances']){const html=renderSheet(s,{...ui,panel:'economy',economyMode});assert.ok(!html.includes('NaN'));assert.ok(!html.includes('undefined'));}
});
test('malformed debt, local budgets and AI shipping are rejected without accepting infinite money',()=>{
 for(const edit of [s=>s.credits=-Infinity,s=>home(s).localMarket=false,s=>home(s).localMarket.cash=-1,s=>home(s).localMarket.sold=51,s=>s.fleets[1].mission={group:'invalid',kind:'commerce',source:'nereid',target:'thalassa',buyer:'ilyri',remaining:2,total:2,cargo:{resource:'ore',amount:10}}]){const s=createGame();edit(s);assert.throws(()=>validateSave(s));}
});

 test('player insolvency never blocks a solvent foreign fleet from using its own supplies',()=>{
 const s=createGame(),p=getPlanet(s,'thalassa');s.credits=-100;p.stock.food=100;p.stock.energy=100;p.stock.alloy=100;
 const f={...structuredClone(s.fleets[0]),id:'foreign-service',owner:'ilyri',planetId:p.id,supply:40,hp:70,supplySettings:{...s.fleets[0].supplySettings,homePort:p.id}};s.fleets.push(f);
 const cash=s.factions.ilyri.credits;maintainFleets(s,true,'ilyri');assert.ok(f.supply>40);assert.ok(f.hp>70);assert.equal(s.credits,-100);assert.equal(s.factions.ilyri.credits,cash);
 });
