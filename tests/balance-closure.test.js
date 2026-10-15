import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, getPlanet } from '../src/state.js';
import { TECHNOLOGIES, FACTIONS, IDEOLOGIES, BUILDINGS } from '../src/data.js';
import { initialGovernance, PROFILES } from '../src/governance.js';
import { startResearch, researchDays } from '../src/research.js';
import { advanceTime, stepDay } from '../src/simulation.js';
import { forecastDay, runDailyEconomy } from '../src/budget.js';
import { simulatePlanet } from '../src/economy.js';
import { parseImport, exportGame, validateSave } from '../src/save.js';
import { marketPrice, marketDemand, quoteSale, sellGoods, purchaseGoods } from '../src/trade.js';
import { money, moneyAmount, moneyText, moneyMarkup } from '../src/money.js';
import { renderSheet, renderResources } from '../src/ui.js';
import { MILITARY_BUILDINGS, STRATEGIC_WEAPONS } from '../src/military-data.js';
import { fleetUpkeep, maintainFleets } from '../src/fleets.js';
import { homePlanet } from '../src/world.js';
import { launchStrike } from '../src/strategic.js';
import { playerAsk, buyPublicSurplus } from '../src/trade-board.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const home=s=>getPlanet(s,'nereid');
function unlock(s,id) {
  const t=TECHNOLOGIES[id];for(const q of t.requires)unlock(s,q);
  if(t.requiresAny&&!t.requiresAny.some(q=>s.tech.includes(q)))unlock(s,t.requiresAny[0]);
  if(!s.tech.includes(id))s.tech.push(id);
}
const laboratory=()=>{const s=createGame({legacy:true});s.science=10000;s.credits=10000;return s;};

test('a ten percent time reduction completes five days in exactly 4.5 elapsed days, including a fractional start',()=>{
  const saved=PROFILES.technocracy.researchTime;
  try {
    PROFILES.technocracy.researchTime=.9;
    const s=laboratory();s.player.ideology='technocracy';s.tech=['grid'];
    advanceTime(s,.37);assert.equal(startResearch(s,'fusion'),null);assert.equal(s.research.total,4.5);
    advanceTime(s,4.49);assert.ok(s.research);close(s.research.remaining,.01);
    advanceTime(s,.01);assert.equal(s.research,null);assert.ok(s.tech.includes('fusion'));
    assert.equal(s.day,4);close(s.dayProgress,.87);
  }finally{PROFILES.technocracy.researchTime=saved;}
});

test('existing technical, government and law bonuses combine without a hidden two-day floor',()=>{
  const s=laboratory();s.player.ideology='technocracy';unlock(s,'quantumModels');unlock(s,'politicalReforms');
  s.governance.laws.science='expert';s.governance.laws.administration='experts';
  const duration=3*.85*.94*.92*.92*.93;close(researchDays(s,'grid'),duration);assert.ok(duration<2);
  assert.equal(startResearch(s,'grid'),null);advanceTime(s,duration-.0001);assert.ok(s.research);
  advanceTime(s,.0001);assert.equal(s.research,null);assert.ok(s.tech.includes('grid'));
});

test('funding pauses preserve partial research, and save/load preserves both the job and shared day phase',()=>{
  const s=laboratory();s.tech=['labMethods','computing'];
  assert.equal(startResearch(s,'grid'),null);advanceTime(s,.42);
  s.credits=-100;const rest=s.research.remaining;advanceTime(s,.25);close(s.research.remaining,rest);
  const loaded=parseImport(exportGame(s));close(loaded.dayProgress,.67);close(loaded.research.remaining,rest);
  loaded.credits=10000;advanceTime(loaded,rest-.0001);assert.ok(loaded.research);
  advanceTime(loaded,.0001);assert.ok(loaded.tech.includes('grid'));assert.equal(loaded.research,null);
});

test('equal player and AI research obey the same duration and finish simultaneously between daily ticks',()=>{
  const s=laboratory(),f=s.factions.khepri;s.player.ideology=FACTIONS.khepri.ideology;
  s.tech=['grid','labMethods','computing'];f.tech=[...s.tech];f.governance=structuredClone(s.governance);f.credits=10000;
  const total=5*.85*.94;close(researchDays(s,'fusion'),total);close(researchDays(s,'fusion','khepri'),total);
  assert.equal(startResearch(s,'fusion'),null);f.research={id:'fusion',total,remaining:total};
  advanceTime(s,total-.0001);assert.ok(s.research);assert.ok(f.research);close(s.research.remaining,f.research.remaining);
  advanceTime(s,.0001);assert.equal(s.research,null);assert.equal(f.research,null);assert.ok(f.tech.includes('fusion'));
});

test('splitting elapsed time into frame-sized pieces does not give extra research or budget ticks',()=>{
  const a=laboratory();a.tech=['labMethods','computing'];startResearch(a,'grid');const b=structuredClone(a);
  advanceTime(a,2.95);for(let i=0;i<295;i++)advanceTime(b,.01);
  assert.equal(a.day,b.day);close(a.dayProgress,b.dayProgress);assert.equal(a.research,null);assert.equal(b.research,null);
  assert.deepEqual(a.tech,b.tech);close(a.credits,b.credits);close(home(a).stock.energy,home(b).stock.energy);
});

test('HUD forecast includes mid-day research completion and matches the next real daily economy',()=>{
  const s=laboratory();s.tech=['labMethods','computing'];startResearch(s,'grid');advanceTime(s,2.75);
  assert.ok(s.research);const unchanged=exportGame(s),forecast=forecastDay(s),cash=s.credits,stock={...home(s).stock};
  assert.equal(exportGame(s),unchanged);advanceTime(s,.25);assert.ok(s.tech.includes('grid'));
  close(s.credits-cash,forecast.budget.net);
  for(const [key,value]of Object.entries(stock))close(home(s).stock[key]-value,forecast.planets.find(p=>p.id==='nereid').net[key]);
  const exact=laboratory();startResearch(exact,'grid');advanceTime(exact,2.75);
  const boundary=forecastDay(exact);advanceTime(exact,.25);
  close(exact.lastDayReport.net,boundary.budget.net);assert.ok(exact.tech.includes('grid'));
  close(home(exact).lastReport.productionByResource.energy,boundary.planets.find(p=>p.id==='nereid').lastReport.productionByResource.energy);
});

test('v10 migration preserves the original world, money, stocks, paid strikes and outstanding research promises',()=>{
  const s=laboratory();s.tech=['grid'];s.research={id:'fusion',total:5,remaining:3};
  unlock(s,'missileDoctrine');home(s).buildings.push({id:'paid-launcher',type:'missileSilo',x:7,y:7,remaining:0,enabled:true,status:'aktiv'});
  s.relations.ilyri.war=true;assert.equal(launchStrike(s,'nereid','thalassa','missile'),null);
  s.factions.khepri.research={id:'grid',remaining:2};s.factions.khepri.tech=s.factions.khepri.tech.filter(k=>k!=='grid');
  s.version=10;delete s.dayProgress;const snapshot=structuredClone(s),loaded=validateSave(s);
  assert.equal(loaded.version,12);assert.equal(loaded.dayProgress,0);assert.deepEqual(s,snapshot);
  for(const key of ['credits','factions','planets','world','fleets','strikes','research','science'])assert.deepEqual(loaded[key],snapshot[key]);
  stepDay(loaded);assert.equal(loaded.research.remaining,2);
});

test('save validation accepts fractional remaining times but rejects corrupt phase or research values',()=>{
  const s=laboratory();s.tech=['grid'];startResearch(s,'fusion');advanceTime(s,.123456);
  assert.deepEqual(parseImport(exportGame(s)),s);
  for(const mutate of [q=>q.dayProgress=-.1,q=>q.dayProgress=1,q=>q.dayProgress=Infinity,q=>q.research.remaining=0,q=>q.research.remaining=q.research.total+.1,q=>q.factions.khepri.research={id:'grid',remaining:-.1}]){
    const bad=structuredClone(s);mutate(bad);assert.throws(()=>validateSave(bad));
  }
});

test('player and AI planets consume the same ordinary and social goods under matching peaceful and wartime conditions',()=>{
  for(const war of [false,true]){
    const s=laboratory();s.player.ideology='democracy';s.tech=['labMethods','computing'];
    const p=home(s),q=structuredClone(p);q.id='same-economy';q.owner='ilyri';s.planets.push(q);
    const f=s.factions.ilyri;f.tech=[...s.tech];f.governance=structuredClone(s.governance);s.relations.aster.war=war;s.galaxy.relations['aster:ilyri'].war=war;
    for(const v of [p,q]){v.population=200;for(const key of Object.keys(v.stock))v.stock[key]=1000;}
    const demand=marketDemand(s,p,'energy');close(demand,marketDemand(s,q,'energy'));
    simulatePlanet(s,p,{deferBudget:true});simulatePlanet(s,q,{deferBudget:true});
    assert.deepEqual(p.lastReport.demandByResource,q.lastReport.demandByResource);assert.deepEqual(p.stock,q.stock);
    close(p.lastReport.demandByResource.weapons,war?1.8:.6);close(p.lastReport.demandByResource.electronics,.6);
  }
});

test('stacked trade laws, research and paid programs still increase actual export prices while retaining the purchase spread',()=>{
  const s=laboratory(),p=getPlanet(s,'thalassa');s.player.ideology='corporate';
  Object.assign(s.relations.ilyri,{trade:true,war:false,embargo:false,cooperation:true});
  p.stock.ore=0;s.factions.ilyri.credits=10000;const prices=[marketPrice(s,p,'ore')];
  s.governance.laws.economy='free';prices.push(marketPrice(s,p,'ore'));
  unlock(s,'merchant');prices.push(marketPrice(s,p,'ore'));
  unlock(s,'tradeNexus');prices.push(marketPrice(s,p,'ore'));
  s.governance.decisions.push({id:'trade',until:120});prices.push(marketPrice(s,p,'ore'));
  for(let i=1;i<prices.length;i++)assert.ok(prices[i]>prices[i-1]);
  assert.ok(prices.at(-1)<marketPrice(s,p,'ore','buy'));
  const quote=quoteSale(s,p,'ore',40),cash=s.credits,buyer=s.factions.ilyri.credits,stock=p.stock.ore;
  const result=sellGoods(s,p,'ore',40);close(result.total,quote.total);close(s.credits-cash,buyer-s.factions.ilyri.credits);close(p.stock.ore-stock,result.amount);
  const before=s.credits,bought=purchaseGoods(s,p,'ore',result.amount);assert.ok(bought.total>result.total);assert.ok(s.credits<cash);close(before-s.credits,bought.total);close(p.stock.ore,stock);
});

test('negative treasuries impose the same recurring approval consequence on AI and player worlds',()=>{
  const s=laboratory(),p=home(s),q=structuredClone(p);q.id='matching-debt';q.owner='ilyri';s.planets.push(q);
  s.credits=-100;s.factions.ilyri.credits=-100;s.factions.ilyri.tech=[...s.tech];s.factions.ilyri.governance=structuredClone(s.governance);
  const reference=structuredClone(s),a=home(reference),b=reference.planets.find(v=>v.id===q.id);
  simulatePlanet(reference,a,{deferBudget:true});simulatePlanet(reference,b,{deferBudget:true});
  runDailyEconomy(s);assert.ok(s.credits<0);assert.ok(s.factions.ilyri.credits<0);
  assert.equal(p.lastReport.bankrupt,true);assert.equal(q.lastReport.bankrupt,true);close(p.happiness,a.happiness-1);close(q.happiness,b.happiness-1);
});

test('public player exports also benefit from trade research and stacked policies without granting buyers free money',()=>{
  const s=laboratory(),p=home(s);s.player.ideology='corporate';s.governance.laws.economy='free';p.tradeBoard.exports=true;p.stock.ore=5000;
  const prices=[playerAsk(s,p,'ore').price];unlock(s,'merchant');prices.push(playerAsk(s,p,'ore').price);
  unlock(s,'tradeNexus');prices.push(playerAsk(s,p,'ore').price);s.governance.decisions.push({id:'trade',until:120});prices.push(playerAsk(s,p,'ore').price);
  for(let i=1;i<prices.length;i++)assert.ok(prices[i]>prices[i-1]);
  const seller=s.credits,buyer=s.factions.ilyri.credits,stock=p.stock.ore,result=buyPublicSurplus(s,p,'ore',40,'ilyri');
  assert.equal(result.amount,40);close(s.credits-seller,buyer-s.factions.ilyri.credits);close(stock-p.stock.ore,result.amount);
  assert.ok(s.factions.ilyri.credits>=180);
});

test('plain credit sums retain prices, signs and the same units without altering saves or HTML attributes',()=>{
  assert.equal(money(2400),'2.400 ¢');assert.equal(money(48000),'48.000 ¢');assert.equal(money(-12.5),'−12,5 ¢');
  assert.equal(money(.024),'0,02 ¢');assert.equal(money(0),'0 ¢');
  assert.equal(moneyText('Kosten: 1.200 ¢; Erlös +12.50 Credits.'),'Kosten: 1.200 ¢; Erlös +12,5 ¢.');
  const html='<input value="3" data-name="100 Credits"><p>60 Credits · 35 Optik</p>';
  const formatted=moneyMarkup(html);assert.equal(formatted,'<input value="3" data-name="100 Credits"><p>60 ¢ · 35 Optik</p>');assert.equal(moneyMarkup(formatted),formatted);
  const s=laboratory();s.credits=2400;const snapshot=exportGame(s),forecast=forecastDay(s);
  assert.ok(renderResources(s,{planetId:'nereid',projection:forecast}).includes('2.400'));
  assert.ok(renderResources(s,{planetId:'nereid',projection:forecast}).includes(moneyAmount(forecast.budget.net,{signed:true,compact:true})));
  assert.ok(renderSheet(s,{panel:'economy',economyMode:'finances',planetId:'nereid'}).includes('2.400 ¢'));
  const market=renderSheet(s,{panel:'economy',economyMode:'routes',routeMode:'markets',planetId:'nereid'});
  assert.ok(market.includes('Preisgrenze / Einheit · ¢'));assert.ok(market.includes('Gesamtbudget je 30 Tage · ¢'));assert.ok(market.includes('data-field="boardPrice" value="3"'));
  assert.equal(exportGame(s),snapshot);
});

test('six untouched starts across all governments and tax levels cannot passively finance complete destruction projects in three years',t=>{
  let peak={credits:-Infinity};
  // Conservative supply example: one reactor and crystal extractor, their operation
  // during construction/charging, the launcher and its first paid charge. Actual
  // local material and population requirements are additional, never waived here.
  const project=type=>{
    const w=STRATEGIC_WEAPONS[type],b=BUILDINGS[w.facility],reactor=BUILDINGS.reactor,crystal=BUILDINGS.crystal;
    return b.cost.credits+w.cost.credits+reactor.cost.credits+crystal.cost.credits+
      b.upkeep*w.charge+(reactor.upkeep+crystal.upkeep)*(b.days+w.charge);
  };
  for(const seed of [31,77,3077,42,4096,2026])for(const ideology of Object.keys(IDEOLOGIES))for(const tax of [.12,.16,.22]){
    const s=createGame({seed});s.player.ideology=ideology;s.player.tax=tax;s.governance=initialGovernance(ideology);
    const p=homePlanet(s),count=p.buildings.length;
    for(let day=1;day<=1080;day++){
      s.day=day;simulatePlanet(s,p);s.credits-=fleetUpkeep(s);maintainFleets(s,s.credits>=0);
      if(day===720||day===1080){
        if(s.credits>peak.credits)peak={seed,ideology,tax,day,credits:s.credits};
        // Even the launcher + charge alone exceed these passive savings. This
        // remains true if the supply example needs extra planetary facilities.
        for(const type of ['worldbreaker','starbreaker']){
          const w=STRATEGIC_WEAPONS[type],bare=BUILDINGS[w.facility].cost.credits+w.cost.credits;
          assert.ok(s.credits<bare,`${seed}/${ideology}/${tax}/${day}: ${s.credits} >= ${bare}`);
          assert.ok(s.credits<project(type));
        }
      }
    }
    assert.equal(p.buildings.length,count);assert.deepEqual(s.tech,[]);
  }
  t.diagnostic(`Largest passive treasury: ${JSON.stringify(peak)}; world project: ${project('worldbreaker')}; star project: ${project('starbreaker')}`);
});
