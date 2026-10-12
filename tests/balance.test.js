import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, makeStock } from '../src/state.js';
import { placeBuilding, workforce } from '../src/economy.js';
import { stepDay } from '../src/simulation.js';
import { forecastDay, runDailyEconomy } from '../src/budget.js';
import { manageProduction, productionWanted, investmentAllowed, plannedUpkeep, commerceCapacity } from '../src/realm-economy.js';
import { tickForeignDevelopment } from '../src/foreign.js';
import { tickForeignCommerce } from '../src/foreign-commerce.js';
import { realmBalance, tickRealmAI } from '../src/realm-ai.js';
import { buildShip, tickShipyards } from '../src/fleets.js';
import { relationBetween } from '../src/realm-relations.js';
import { TECHNOLOGIES } from '../src/data.js';
import { renderSheet } from '../src/ui.js';
import { exportGame, parseImport } from '../src/save.js';

const home = s => s.planets.find(p => p.owner === 'player');
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-7, `${a} != ${b}`);
const building = (type, i=0) => ({id:`balance-${type}-${i}`,type,x:2+i,y:3,remaining:0,enabled:true,status:'aktiv'});
function unlock(s,owner,id) { for(const q of TECHNOLOGIES[id].requires)unlock(s,owner,q); if(!s.factions[owner].tech.includes(id))s.factions[owner].tech.push(id); }

test('tax rates trade current cash for population and workforce in the same growing economy',()=>{
 const results=[];
 for(const tax of [.12,.16,.22]){
  const s=createGame({seed:3077}),p=home(s);s.player.tax=tax;
  assert.equal(placeBuilding(s,p,'habitat',2,2),null);assert.equal(placeBuilding(s,p,'habitat',3,2),null);
  for(let i=0;i<180;i++)stepDay(s);
  const pred=forecastDay(s),before=s.credits,pop=p.population;stepDay(s);
  close(s.credits-before,pred.budget.actual);close(p.population-pop,pred.planets.find(q=>q.id===p.id).lastReport.growth);
  results.push({population:p.population,workers:workforce(s,p),cash:s.credits,growth:p.lastReport.growth});
 }
 assert.ok(results[0].population>results[1].population+30);assert.ok(results[1].population>results[2].population+30);
 assert.ok(results[0].workers>results[2].workers+50);assert.ok(results[0].cash<results[1].cash&&results[1].cash<results[2].cash);
 assert.ok(results[0].growth>results[2].growth*3);
});
test('growth still requires food and room, and observed growth survives an exact save roundtrip',()=>{
 const s=createGame({seed:3077}),p=home(s);p.happiness=95;p.population=240;
 assert.equal(forecastDay(s).planets.find(q=>q.id===p.id).lastReport.growth,0);
 p.population=180;p.stock.food=0;for(const b of p.buildings)if(b.type==='farm')b.enabled=false;
 const pred=forecastDay(s);assert.ok(pred.planets.find(q=>q.id===p.id).lastReport.growth<0);stepDay(s);
 assert.deepEqual(parseImport(exportGame(s)),s);
 const html=renderSheet(s,{panel:'economy',economyMode:'production',planetId:p.id});assert.match(html,/Einw\.\/T/);assert.ok(!html.includes('NaN'));
});
test('surplus production releases real workers and upkeep, then restarts before a material shortage',()=>{
 const s=createGame({legacy:true}),p=s.planets.find(p=>p.owner==='clans');
 p.population=180;p.buildings=[building('mine'),building('habitat',1),building('habitat',2),building('habitat',3)];
 p.stock=makeStock({food:10000,energy:10000,ore:10000});s.factions.clans.credits=2000;
 runDailyEconomy(s);s.day=60+Object.keys(s.factions).indexOf('clans')%12;
 const before={...p.stock},upkeep=p.lastReport.upkeep;manageProduction(s,p);
 assert.equal(p.buildings[0].enabled,false);assert.deepEqual(p.stock,before);runDailyEconomy(s);
 assert.ok(p.lastReport.upkeep<upkeep);assert.equal(p.lastReport.workers,0);assert.equal(p.lastReport.productionByResource.ore,0);
 p.stock.ore=0;s.day+=12;manageProduction(s,p);assert.equal(p.buildings[0].enabled,true);runDailyEconomy(s);
 assert.ok(p.lastReport.productionByResource.ore>0);assert.ok(p.lastReport.workers>0);
});
test('unneeded duplicate production is refused, including capacity already under construction',()=>{
 const s=createGame({legacy:true}),p=s.planets.find(p=>p.owner==='clans');
 p.buildings=[building('mine')];p.stock.ore=10000;p.lastReport={demandByResource:{ore:3},productionByResource:{ore:14}};
 assert.equal(productionWanted(s,p,'mine'),false);
 p.buildings[0].remaining=3;p.stock.ore=0;assert.equal(productionWanted(s,p,'mine'),false);
 p.lastReport.demandByResource.ore=40;assert.equal(productionWanted(s,p,'mine'),true);
});
test('service institutions are not surplus factories and remain available with full warehouses',()=>{
 const s=createGame({legacy:true}),p=s.planets.find(p=>p.owner==='collective');
 for(const key of Object.keys(p.stock))p.stock[key]=10000;runDailyEconomy(s);
 s.day=60+Object.keys(s.factions).indexOf('collective')%12;
 const clinic=p.buildings.find(b=>b.type==='clinic');manageProduction(s,p);assert.equal(clinic.enabled,true);
 for(const type of ['embassy','academy','tradePort','depot','clinic'])assert.equal(productionWanted(s,p,type),true);
});
test('a funded upstream plant may restart through a temporary deficit without making new cash or goods',()=>{
 const s=createGame({legacy:true}),p=s.planets.find(p=>p.owner==='clans');p.buildings=[building('mine'),building('foundry',1),building('habitat',2)];
 p.buildings[0].enabled=false;p.population=80;p.stock=makeStock({food:1000,energy:1000,ore:0});s.factions.clans.credits=1500;
 runDailyEconomy(s);p.lastReport.income=2;s.day=60+Object.keys(s.factions).indexOf('clans')%12;
 assert.ok(realmBalance(s,'clans')<0);const cash=s.factions.clans.credits,stock={...p.stock};manageProduction(s,p);
 assert.equal(p.buildings[0].enabled,true);assert.equal(s.factions.clans.credits,cash);assert.deepEqual(p.stock,stock);
});
test('investment reserves count the future upkeep of paid shipyard orders',()=>{
 const s=createGame({legacy:true}),p=s.planets.find(p=>p.owner==='aster');s.factions.aster.credits=5000;p.lastReport={income:36,upkeep:0};
 for(const key of Object.keys(p.stock))p.stock[key]=1000;
 assert.equal(buildShip(s,p,'destroyer','aster'),null);assert.ok(plannedUpkeep(s,'aster')>0);
 assert.equal(investmentAllowed(s,'aster',230,3),false);
 s.factions.aster.credits=0;const queues=p.queues.length;s.galaxy.strategies.aster.nextPlan=0;tickRealmAI(s);assert.equal(p.queues.length,queues);
});
test('industrial government programs are not purchased just to enlarge already full warehouses',()=>{
 const s=createGame({legacy:true}),owner='commons',p=s.planets.find(p=>p.owner===owner),f=s.factions[owner];
 for(const key of Object.keys(p.stock))p.stock[key]=10000;p.net=Object.fromEntries(Object.keys(p.stock).map(key=>[key,10]));p.lastReport={income:100,upkeep:10,demandByResource:{food:10},science:4};
 f.credits=5000;f.nextBuild=9999;s.day=Object.keys(s.factions).indexOf(owner);tickForeignDevelopment(s);
 assert.ok(!f.governance.decisions.some(d=>d.id==='industry'));
});
test('trade doctrine can finance additional real freighters, while idle fleets prevent redundant orders',()=>{
 const s=createGame({legacy:true}),owner='guild',p=s.planets.find(p=>p.owner===owner);s.day=Object.keys(s.factions).indexOf(owner);
 s.factions[owner].credits=5000;p.lastReport={income:100,upkeep:10};assert.equal(commerceCapacity(s,owner),2);
 for(const key of Object.keys(p.stock))p.stock[key]=1000;tickForeignCommerce(s);assert.ok(p.queues.some(q=>q.type==='freighter'));
 p.queues=[];s.fleets.push({...structuredClone(s.fleets[1]),id:'balance-trader',owner,planetId:p.id,cargo:makeStock()});tickForeignCommerce(s);
 assert.equal(p.queues.length,0);
});
test('a solvent expansionist can finance a prepared campaign from reserves with a small recurring margin',()=>{
 const s=createGame({legacy:true}),owner='aster',p=s.planets.find(p=>p.owner===owner);
 p.population=320;for(const key of Object.keys(p.stock))p.stock[key]=1000;s.factions[owner].credits=5000;unlock(s,owner,'fortification');
 p.buildings.push(building('commCenter',4));
 for(const type of ['destroyer','destroyer','destroyer','lander']){assert.equal(buildShip(s,p,type,owner),null);while(p.queues.length)tickShipyards(s);}
 p.lastReport={income:0};p.lastReport.income=1-realmBalance(s,owner);s.factions[owner].credits=2000;
 s.day=200;relationBetween(s,owner,'clans').score=-60;
 for(const r of Object.values(s.galaxy.relations))r.nextAction=9999;for(const strategy of Object.values(s.galaxy.strategies))strategy.nextPlan=9999;
 s.galaxy.strategies[owner].nextPlan=0;tickRealmAI(s);
 assert.equal(s.galaxy.strategies[owner].warPlan?.enemy,'clans');assert.equal(relationBetween(s,owner,'clans').war,false);
 s.factions[owner].credits=200;s.day+=36;s.galaxy.strategies[owner].nextPlan=0;p.lastReport.income=0;tickRealmAI(s);
 assert.equal(relationBetween(s,owner,'clans').war,false);
});
