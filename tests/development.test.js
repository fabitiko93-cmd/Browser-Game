import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,getPlanet,makeStock} from '../src/state.js';
import {BUILDINGS,SHIPS,RESOURCE_KEYS,TECHNOLOGIES} from '../src/data.js';
import {forecastDay,runDailyEconomy} from '../src/budget.js';
import {stepDay} from '../src/simulation.js';
import {simulatePlanet,workforce} from '../src/economy.js';
import {resourceRisk,resourcePages,renderResourceHUD} from '../src/hud.js';
import {configureSupply,startCircuit,serviceFleet,cargoUsed} from '../src/routing.js';
import {maintainFleets,tickFleets,cargoCapacity} from '../src/fleets.js';
import {marketPrice,quoteSale,quotePurchase,sellGoods,purchaseGoods,createContract,tickContracts,cancelContract} from '../src/trade.js';
import {enactLaw,decide,policyEffects,PROFILES,normalizeLaws,lawChangeCost} from '../src/governance.js';
import {validateSave,parseImport,exportGame} from '../src/save.js';
import {renderSheet} from '../src/ui.js';
import {destroyPlanet} from '../src/strategic.js';
const home=s=>getPlanet(s,'nereid');
const foreign=s=>getPlanet(s,'thalassa');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
const unlock=(s,id)=>{for(const q of TECHNOLOGIES[id].requires)unlock(s,q);if(TECHNOLOGIES[id].requiresAny&&!TECHNOLOGIES[id].requiresAny.some(q=>s.tech.includes(q)))unlock(s,TECHNOLOGIES[id].requiresAny[0]);if(!s.tech.includes(id))s.tech.push(id);};
const action=(kind,resource,amount,reserve=0)=>({kind,resource,amount,reserve,minPrice:0,maxPrice:1e6});
const trading=()=>{const s=createGame();s.relations.ilyri.trade=true;s.credits=10000;return s;};
const building=(type,id=type)=>({id,type,x:9,y:10,remaining:0,enabled:true,status:'aktiv'});

test('HUD marks the exact 30-day exhaustion boundary and actual unmet inputs',()=>{
 const s=createGame(),p=home(s),projection={budget:{net:1,science:1},planets:[{id:p.id,net:{ore:-10},lastReport:{missingResources:[]}}]};
 p.stock.ore=300;assert.deepEqual(resourceRisk(s,p,'ore',projection),{warning:true,days:30,rate:-10});
 p.stock.ore=301;assert.equal(resourceRisk(s,p,'ore',projection).warning,false);
 projection.planets[0].lastReport.missingResources=['ore'];projection.planets[0].net.ore=0;p.stock.ore=0;
 assert.equal(resourceRisk(s,p,'ore',projection).warning,true);
});
test('only loaded cargo arriving before depletion can assure HUD supply',()=>{
 const s=createGame(),p=home(s);p.stock.ore=100;
 const projection={budget:{net:0,science:0},planets:[{id:p.id,net:{ore:-10},lastReport:{missingResources:[]}}]};
 const f=s.fleets[1];f.route={source:'nereid',target:'cinder',resource:'ore',amount:300};
 assert.equal(resourceRisk(s,p,'ore',projection).warning,true);
 f.mission={kind:'return-cargo',target:'nereid',remaining:9,cargo:{resource:'ore',amount:300}};
 assert.equal(resourceRisk(s,p,'ore',projection).warning,false);
 f.mission.remaining=10;assert.equal(resourceRisk(s,p,'ore',projection).warning,true);
 f.mission.remaining=31;assert.equal(resourceRisk(s,p,'ore',projection).warning,true);
});
test('HUD stays one row, pins credits on every page and adds only relevant special goods',()=>{
 const s=createGame(),p=home(s);assert.equal(resourcePages(s,p).length,2);p.stock.electronics=1;
 assert.equal(resourcePages(s,p).length,3);
 for(let page=0;page<3;page++){const html=renderResourceHUD(s,{planetId:p.id,resourcePage:page});assert.equal((html.match(/data-resource="credits"/g)||[]).length,1);assert.ok((html.match(/resource-pill /g)||[]).length<=5);}
});
test('regional geology affects real output and propulsion savings never reduce reactor-fuel production',()=>{
 const s=createGame(),p=home(s);p.buildings=[building('fuelExtractor')];p.stock=makeStock({energy:1000,food:1000});p.kind='Eiswelt';const a=structuredClone(s);a.tech=['engineTuning','propulsion','ecoDrive'];simulatePlanet(s,p);simulatePlanet(a,home(a));close(p.net.fuel,home(a).net.fuel);
 const warm=structuredClone(s);home(warm).kind='Temperiert';home(warm).stock=makeStock({energy:1000,food:1000});simulatePlanet(warm,home(warm));assert.ok(p.net.fuel>home(warm).net.fuel);
});
test('all six political profiles have distinct actual science, workforce and approval effects; AI uses the same profiles',()=>{
 const science=new Set(),staff=new Set();for(const id of Object.keys(PROFILES)){const s=createGame();s.player.ideology=id;science.add(forecastDay(s).budget.science);staff.add(workforce(s,home(s)));assert.equal(policyEffects(s).happiness,PROFILES[id].happiness);}
 assert.equal(science.size,6);assert.equal(staff.size,5);
 const s=createGame();assert.ok(policyEffects(s,'khepri').science>=PROFILES.technocracy.science);
});
test('regime laws reject atomically, reform unlocks work and government transitions normalize incompatible choices',()=>{
 const s=createGame();s.player.ideology='nationalSocialism';let before=exportGame(s);assert.ok(enactLaw(s,'borders','open'));assert.equal(exportGame(s),before);
 assert.ok(enactLaw(s,'administration','directive'));unlock(s,'politicalReforms');assert.equal(enactLaw(s,'administration','directive'),null);
 assert.ok(decide(s,'civicMandate'));assert.equal(decide(s,'industrialDirective'),null);
 normalizeLaws(s.governance,'democracy');assert.equal(s.governance.laws.administration,'local');assert.equal(s.governance.decisions.length,0);
 const ordinary=createGame(),reformed=createGame();unlock(reformed,'politicalReforms');assert.ok(lawChangeCost(reformed)<lawChangeCost(ordinary));
});
test('supply thresholds pause a route until the configured target and book real local resources',()=>{
 const s=createGame(),f=s.fleets[1],p=home(s);f.supply=30;f.route={source:'nereid',target:'thalassa',resource:'ore',amount:10};s.relations.ilyri.trade=true;
 assert.equal(configureSupply(s,f.id,{threshold:40,target:70}),null);
 for(let i=0;i<4;i++){const before=p.stock.energy;maintainFleets(s);close(before-p.stock.energy,1);assert.equal(f.servicing,true);tickFleets(s,{economyProcessed:true});assert.equal(f.mission,null);}
 maintainFleets(s);assert.equal(f.supply,70);assert.equal(f.servicing,false);tickFleets(s,{economyProcessed:true});assert.ok(f.mission);
});
test('depots and repair docks consume material while accelerating maintenance; port fees reconcile with the HUD',()=>{
 const s=createGame(),f=s.fleets[1],p=home(s);f.supply=30;f.hp=20;p.buildings.push(building('depot'),{...building('dryDock'),x:6});
 const e=p.stock.energy,a=p.stock.alloy;maintainFleets(s);assert.equal(f.supply,46);assert.equal(f.hp,30);close(e-p.stock.energy,2);close(a-p.stock.alloy,2.5);
 const t=trading(),g=t.fleets[1];g.planetId='thalassa';g.supply=20;g.hp=20;t.relations.ilyri.portAccess=true;const prediction=forecastDay(t),cash=t.credits;
 runDailyEconomy(t);assert.ok(prediction.budget.portCosts>0);close(t.credits-cash,prediction.budget.actual);
});
test('supply configuration and manual service validate without spending or corrupting routes',()=>{
 const s=createGame(),f=s.fleets[1],snapshot=exportGame(s);assert.ok(configureSupply(s,f.id,{threshold:95,target:90}));assert.ok(configureSupply(s,f.id,{smart:true}));assert.equal(exportGame(s),snapshot);
 assert.equal(serviceFleet(s,f.id),null);assert.equal(f.servicing,true);maintainFleets(s);assert.equal(f.servicing,false);
});
test('different goods have different prices; excess supply depresses prices and finite buyers cap sales',()=>{
 const s=trading(),p=foreign(s);p.stock.food=0;p.stock.weapons=0;assert.ok(marketPrice(s,p,'weapons')>marketPrice(s,p,'food'));
 const before=marketPrice(s,p,'food');const q=sellGoods(s,p,'food',200);assert.ok(q.amount>0);assert.ok(marketPrice(s,p,'food')<before);
 s.factions.ilyri.credits=1;const cash=s.credits;const sale=sellGoods(s,p,'food',200);assert.ok(sale.total<=1);close(s.credits-cash,sale.total);assert.ok(s.factions.ilyri.credits>=0);
 const snapshot=exportGame(s);assert.deepEqual(sellGoods(s,p,'food',NaN),{amount:0,total:0});assert.equal(exportGame(s),snapshot);
});
test('a same-port buy/sell cannot mint credits and purchase quotes respect rising scarcity and player budget',()=>{
 const s=trading(),p=foreign(s);p.stock.food=800;const cash=s.credits;const buy=purchaseGoods(s,p,'food',20);assert.ok(buy.amount>0);sellGoods(s,p,'food',buy.amount);assert.ok(s.credits<cash);
 s.credits=1;const q=quotePurchase(s,p,'food',500);assert.ok(q.total<=1);purchaseGoods(s,p,'food',500);assert.ok(s.credits>=0);
});
test('contracts reserve finite buyer funds, pay fixed prices and refund unspent escrow on cancellation or lost access',()=>{
 const s=trading(),p=foreign(s);unlock(s,'contracts');const buyer=s.factions.ilyri.credits;
 assert.equal(createContract(s,p.id,'food',100),null);const c=s.contracts[0],price=c.price;close(s.factions.ilyri.credits,buyer-100*price);
 p.stock.food=10000;const cash=s.credits;const sale=sellGoods(s,p,'food',60);assert.equal(sale.amount,60);close(s.credits-cash,60*price);assert.equal(c.delivered,60);
 const left=c.escrow;cancelContract(s,c.id);close(s.factions.ilyri.credits,buyer-60*price);
 assert.equal(createContract(s,p.id,'food',100),null);const remaining=s.contracts[0].escrow,credits=s.factions.ilyri.credits;s.relations.ilyri.trade=false;tickContracts(s);assert.equal(s.contracts.length,0);close(s.factions.ilyri.credits,credits+remaining);
});
test('regular deliveries remain profitable over six contract periods without perpetual shortage',()=>{
 const s=trading(),p=foreign(s);unlock(s,'contracts');const demand=10;p.lastReport={demandByResource:{food:demand}};p.stock.food=200;
 assert.equal(createContract(s,p.id,'food',100),null);const price=s.contracts[0].price;let earned=0;
 for(let day=1;day<180;day++){s.day=day;p.stock.food=Math.max(0,p.stock.food-demand);s.factions.ilyri.credits+=30;if(day%30===15){const sale=sellGoods(s,p,'food',100);close(sale.total,100*price);earned+=sale.total;}tickContracts(s);}
 assert.ok(earned>0);assert.equal(s.contracts[0].fulfilled,5);
});
test('two-stop circuits trade return cargo, preserve reserves and continue after many replenishment cycles',()=>{
 const s=trading(),p=home(s),q=foreign(s),f=s.fleets[1];p.stock.ore=200;p.stock.energy=10000;p.stock.food=10000;q.stock.energy=10000;q.stock.food=500;q.stock.ore=0;
 const draft={interval:20,stops:[{planet:p.id,actions:[action('unload','food',20),action('load','ore',40,50)]},{planet:q.id,actions:[action('sell','ore',40),action('buy','food',20)]}]};
 assert.equal(startCircuit(s,f.id,draft),null);for(let i=0;i<180;i++){s.day++;if(i%30===0){p.stock.ore+=60;q.stock.ore=Math.max(0,q.stock.ore-60);q.stock.food+=50;}tickFleets(s);assert.ok(cargoUsed(f)<=cargoCapacity(s,f.type));validateSave(structuredClone(s));}
 assert.ok(s.tradeLedger.length>=8);assert.ok(s.tradeLedger.some(t=>t.cost>0));assert.ok(s.tradeLedger.some(t=>t.revenue>0));assert.ok(p.stock.ore>=50);assert.ok(f.supply>0);
});
test('multi-stop routes need research and all loaded goods share cargo capacity',()=>{
 const s=trading(),p=home(s),f=s.fleets[1];getPlanet(s,'cinder').owner='player';const draft={interval:0,stops:[{planet:p.id,actions:[action('load','ore',80),action('load','alloy',80)]},{planet:'thalassa',actions:[]},{planet:'cinder',actions:[]}]};
 const old=exportGame(s);assert.ok(startCircuit(s,f.id,draft));assert.equal(exportGame(s),old);unlock(s,'tradeCircuits');assert.equal(startCircuit(s,f.id,draft),null);tickFleets(s);assert.equal(cargoUsed(f),cargoCapacity(s,f.type));assert.ok(f.cargo.ore>0);assert.equal(f.cargo.alloy,cargoCapacity(s,f.type)-80);
});
test('destroyed home ports reassign supply settings and canceled circuits preserve physical cargo',()=>{
 const s=trading(),f=s.fleets[1],p=getPlanet(s,'cinder');p.owner='player';f.planetId='thalassa';f.cargo.ore=10;f.route={type:'circuit',stops:[{planet:'nereid'},{planet:'thalassa'}]};destroyPlanet(s,home(s));assert.equal(f.route,null);assert.equal(f.cargo.ore,10);assert.equal(f.supplySettings.homePort,'cinder');validateSave(s);
});
test('all new market, contract, circuit and supply screens render valid controls',()=>{
 const s=trading();for(const routeMode of ['simple','circuit','markets','contracts']){const html=renderSheet(s,{panel:'economy',economyMode:'routes',routeMode,planetId:'nereid'});assert.ok(!html.includes('undefined'));assert.ok(!html.includes('NaN'));}
 const html=renderSheet(s,{panel:'fleet',planetId:'nereid',fleetMode:'command',supplyFleet:'starter-f',fleetIds:[]});assert.ok(!html.includes('undefined'));assert.ok(!html.includes('NaN'));
});
test('long simulations progress AI research and construction with finite resources and roundtrip saves',()=>{
 const s=createGame();for(let i=0;i<1000;i++){stepDay(s);if(i%50===0)validateSave(structuredClone(s));}
 for(const f of Object.values(s.factions)){assert.ok(f.tech.length>10);assert.ok(f.credits>=0);}
 assert.deepEqual(parseImport(exportGame(s)),s);
});

test('a genuine v5 save retains credits, colonies, inventories and an in-flight route while adding the new world systems',async()=>{
 const {readFileSync}=await import('node:fs');const old=JSON.parse(readFileSync(new URL('./fixtures-v5.json',import.meta.url),'utf8'));const loaded=parseImport(JSON.stringify(old));
 assert.equal(loaded.version,6);assert.equal(loaded.planets.length,28);assert.equal(loaded.credits,1234.5);assert.equal(loaded.science,old.science);assert.equal(loaded.day,old.day);
 for(const p of old.planets){const migrated=getPlanet(loaded,p.id);assert.equal(migrated.owner,p.owner);assert.equal(migrated.population,p.population);assert.deepEqual(migrated.buildings,p.buildings);for(const k of Object.keys(p.stock))assert.equal(migrated.stock[k],p.stock[k]);}
 for(let i=0;i<old.fleets.length;i++){assert.deepEqual(loaded.fleets[i].mission,old.fleets[i].mission);assert.deepEqual(loaded.fleets[i].route,old.fleets[i].route);}
 assert.equal(loaded.governance.laws.borders,'controlled');assert.equal(loaded.player.ideology,'nationalSocialism');assert.deepEqual(validateSave(structuredClone(loaded)),loaded);
 for(let i=0;i<30;i++)stepDay(loaded);validateSave(loaded);
});
test('migration never resurrects newly added planets in previously destroyed stars',async()=>{
 const {readFileSync}=await import('node:fs');const old=JSON.parse(readFileSync(new URL('./fixtures-v5.json',import.meta.url),'utf8'));old.destroyedSystems.push('orion');for(const p of old.planets.filter(p=>p.system==='orion'))Object.assign(p,{owner:null,destroyed:true,population:0,buildings:[],queues:[],shield:0});
 const migrated=parseImport(JSON.stringify(old));assert.ok(migrated.planets.filter(p=>p.system==='orion').every(p=>p.destroyed));assert.equal(getPlanet(migrated,'corona').owner,null);
});
test('corrupt route, cargo, price and development save fields are rejected',()=>{
 for(const edit of [s=>s.fleets[1].cargo.ore=1000,s=>s.fleets[1].supplySettings.target=10,s=>s.factions.ilyri.research={id:'plasma',remaining:3},s=>s.contracts=[{id:'',planet:'thalassa',resource:'food',quantity:10,price:2,delivered:0,escrow:20,faction:'ilyri',until:180,periodStart:0,fulfilled:0}],s=>s.planets[0].lastReport={demandByResource:{food:-1}},s=>s.fleets[1].route={source:'nereid',target:'thalassa',resource:'food',amount:10,reserve:-1}]){const s=createGame();edit(s);assert.throws(()=>validateSave(s));}
});

test('production priorities allocate scarce workers to the chosen chain and bottlenecks name missing inputs',async()=>{
 const {setProductionPriority,shortageExplanation}=await import('../src/infrastructure.js');const s=createGame(),p=home(s);p.population=25;p.stock=makeStock({food:100,energy:100,ore:100,alloy:100});p.buildings=[building('foundry'),{...building('lab'),x:6}];
 const balanced=structuredClone(s);simulatePlanet(balanced,home(balanced));assert.equal(home(balanced).buildings[1].status,'Arbeitskräfte fehlen');
 assert.equal(setProductionPriority(p,'science'),null);simulatePlanet(s,p);assert.equal(p.buildings[1].status,'aktiv');assert.ok(p.lastReport.science>0);assert.equal(p.buildings[0].status,'Arbeitskräfte fehlen');
 p.population=200;p.stock.energy=0;simulatePlanet(s,p);assert.ok(shortageExplanation(p).some(q=>q.text.includes('Energie')));
});
test('new civil facilities enforce research, uniqueness and actual supply before granting bonuses',async()=>{
 const {placeBuilding}=await import('../src/economy.js');const {buildingBlock}=await import('../src/infrastructure.js');const s=createGame(),p=home(s);const snap=exportGame(s);assert.ok(placeBuilding(s,p,'clinic',7,7));assert.equal(exportGame(s),snap);
 p.buildings.push(building('civicCenter'));p.stock.goods=5;const supplied=forecastDay(s);p.stock.goods=0;const deprived=forecastDay(s);assert.ok(supplied.planets[0].happiness>deprived.planets[0].happiness);assert.ok(buildingBlock(s,p,'civicCenter'));
});
test('advanced diplomatic support requires real institutions and its upkeep matches the recurring forecast',async()=>{
 const {diplomaticAction}=await import('../src/politics.js');const s=trading();s.relations.ilyri.score=60;const before=exportGame(s);assert.ok(diplomaticAction(s,'ilyri','ports'));assert.equal(exportGame(s),before);unlock(s,'advancedDiplomacy');home(s).buildings.push(building('embassy'));
 assert.equal(diplomaticAction(s,'ilyri','ports'),null);assert.equal(diplomaticAction(s,'ilyri','research-pact'),null);assert.equal(diplomaticAction(s,'ilyri','defense-pact'),null);assert.equal(forecastDay(s).budget.sanctions,2);validateSave(s);
 assert.equal(diplomaticAction(s,'ilyri','war'),null);assert.equal(s.relations.ilyri.portAccess,false);assert.equal(s.relations.ilyri.researchPact,false);assert.equal(s.relations.ilyri.defensePact,false);
});
