import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, makeStock } from '../src/state.js';
import { initialGovernance } from '../src/governance.js';
import { forecastDay, runDailyEconomy } from '../src/budget.js';
import { diplomacyScience, researchNetwork, researchAgreementGain, treatyAction } from '../src/diplomacy.js';
import { diplomacyPanel } from '../src/diplomacy-ui.js';
import { beginWar } from '../src/realm-relations.js';
import { fleetStrength, fleetUpkeep, shipBuildDays } from '../src/fleets.js';
import { researchDays, startResearch } from '../src/research.js';
import { quoteSale, sellGoods } from '../src/trade.js';
import { TECHNOLOGIES } from '../src/data.js';
import { exportGame, parseImport } from '../src/save.js';

const home=s=>s.planets.find(p=>p.owner==='player');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const percent=value=>(value*100).toFixed(2).replace('.',',');
const building=(type,i)=>({id:`profile-${i}`,type,x:2+i%10,y:2+Math.floor(i/10),remaining:0,enabled:true,status:'aktiv'});
const base=['habitat','habitat','habitat','habitat','farm','solar','mine','foundry','optics','lab','shipyard'];
const industry=['habitat','habitat','habitat','farm','solar','mine','foundry','optics','lab','laser','shipyard','foundry','crystal','laser','mine'];
function economy(ideology,types=base) {
 const s=createGame({legacy:true}),p=home(s);s.player.ideology=ideology;s.governance=initialGovernance(ideology);s.credits=10000;s.fleets=[];
 p.population=240;p.happiness=80;p.stock=makeStock({food:10000,energy:10000,ore:10000,alloy:10000,optics:10000,crystal:10000,electronics:10000});
 p.buildings=types.map(building);return s;
}
function unlock(s,id) { for(const q of TECHNOLOGIES[id].requires)unlock(s,q);if(!s.tech.includes(id))s.tech.push(id); }
function negotiating() {
 const s=createGame({legacy:true});s.credits=10000;unlock(s,'advancedDiplomacy');
 home(s).buildings.push(building('embassy',19));
 for(const r of Object.values(s.relations)){r.trade=true;r.score=60;}
 return s;
}
function fleet(s,count=8) {
 s.fleets=Array.from({length:count},(_,i)=>({id:`profile-fleet-${i}`,type:'destroyer',owner:'player',planetId:home(s).id,hp:100,supply:100,mission:null,route:null,cargo:makeStock(),supplySettings:{auto:false}}));
}

test('the first bilateral research exchanges retain their value and charge their actual agreement costs',()=>{
 const s=negotiating(),baseScience=forecastDay(s).budget.science,cash=s.credits;
 assert.equal(treatyAction(s,'ilyri','cooperation'),null);close(diplomacyScience(s),1.08);close(forecastDay(s).budget.science,baseScience*1.08);
 assert.equal(treatyAction(s,'ilyri','research-pact'),null);close(diplomacyScience(s),1.14);close(forecastDay(s).budget.science,baseScience*1.14);
 assert.equal(s.credits,cash-180-160);assert.equal(researchNetwork(s).partners,1);
});

test('large research networks keep positive but diminishing returns and cannot replace the need for own science',()=>{
 const s=negotiating(),baseScience=forecastDay(s).budget.science,returns=[];
 for(const [id,r]of Object.entries(s.relations)){
  const before=diplomacyScience(s);r.cooperation=true;r.researchPact=true;returns.push(diplomacyScience(s)-before);
 }
 assert.equal(returns.length,18);assert.ok(returns.every(n=>n>0));assert.ok(returns.every((n,i)=>i===0||n<returns[i-1]));
 const network=researchNetwork(s);assert.equal(network.partners,18);assert.ok(network.bonus>.35&&network.bonus<.4);
 close(forecastDay(s).budget.science,baseScience*network.factor);
 home(s).buildings=home(s).buildings.filter(b=>b.type!=='lab');assert.equal(forecastDay(s).budget.science,0);
});

test('agreement previews, logs and cancellation show the same current marginal science as the daily forecast',()=>{
 const s=negotiating();for(const r of Object.values(s.relations)){r.cooperation=true;r.researchPact=true;}s.relations.ilyri.researchPact=false;
 const before=forecastDay(s).budget.science,factor=diplomacyScience(s),gain=researchAgreementGain(s,'ilyri','researchPact'),snapshot=exportGame(s);
 const html=diplomacyPanel(s,{diplomacyFaction:'ilyri'});
 assert.match(html,/Forschungsnetz/);assert.ok(html.includes(`>+${percent(gain)}</span> Prozentpunkte`));assert.ok(!html.includes('Zusätzlich +6 %'));
 assert.equal(exportGame(s),snapshot);assert.equal(treatyAction(s,'ilyri','research-pact'),null);
 close(forecastDay(s).budget.science-before,before/factor*gain);assert.ok(s.logs[0].text.includes(`+${percent(gain)} Prozentpunkte`));
 const activeGain=researchAgreementGain(s,'ilyri','researchPact');close(activeGain,gain);
 assert.equal(treatyAction(s,'ilyri','cancel-research-pact'),null);close(forecastDay(s).budget.science,before);
});

test('a signed research exchange benefits both real treasuries under the same network rule',()=>{
 const s=negotiating();assert.equal(treatyAction(s,'ilyri','cooperation'),null);assert.equal(treatyAction(s,'ilyri','research-pact'),null);
 const predicted=forecastDay(s),science=s.science,foreignScience=s.factions.ilyri.science,cash=s.credits;
 runDailyEconomy(s);close(s.science-science,predicted.budget.science);close(s.credits-cash,predicted.budget.actual);
 const gross=s.planets.filter(p=>p.owner==='ilyri').reduce((n,p)=>n+p.lastReport.science,0);
 close(s.factions.ilyri.science-foreignScience,gross*diplomacyScience(s,'ilyri'));close(diplomacyScience(s,'ilyri'),1.14);
});

test('war, sanctions and loss of the partner worlds remove science instead of preserving a ghost bonus',()=>{
 const s=negotiating();assert.equal(treatyAction(s,'ilyri','cooperation'),null);assert.equal(treatyAction(s,'ilyri','research-pact'),null);
 const war=structuredClone(s);assert.equal(beginWar(war,'player','ilyri'),true);assert.equal(diplomacyScience(war),1);assert.equal(diplomacyScience(war,'ilyri'),1);
 const sanctioned=structuredClone(s);assert.equal(treatyAction(sanctioned,'ilyri','embargo'),null);assert.equal(diplomacyScience(sanctioned),1);
 const eliminated=structuredClone(s);for(const p of eliminated.planets)if(p.owner==='ilyri')p.owner=null;
 assert.equal(diplomacyScience(eliminated),1);assert.equal(diplomacyScience(eliminated,'ilyri'),1);assert.equal(researchAgreementGain(eliminated,'ilyri','researchPact'),0);
});

test('knowledge networks do not bypass debt-related laboratory restrictions',()=>{
 const s=negotiating();for(const r of Object.values(s.relations)){r.cooperation=true;r.researchPact=true;}
 s.credits=-10000;assert.equal(forecastDay(s).budget.science,0);
});

test('political labor capacity changes which real plants can operate in a constrained colony',()=>{
 const planned=economy('communism',industry),commercial=economy('corporate',industry);
 const a=forecastDay(planned).planets.find(p=>p.owner==='player'),b=forecastDay(commercial).planets.find(p=>p.owner==='player');
 assert.ok(a.buildings.every(p=>p.status==='aktiv'));assert.ok(b.buildings.some(p=>p.status==='Arbeitskräfte fehlen'));
 assert.ok(a.lastReport.workers>b.lastReport.workers);assert.ok(a.lastReport.productionByResource.ore>b.lastReport.productionByResource.ore);
 assert.ok(a.lastReport.upkeep>b.lastReport.upkeep);
});

test('technocracy produces more science per upkeep and develops sooner while paying its real infrastructure premium',()=>{
 const types=['habitat','habitat','habitat','habitat','farm','solar','solar','lab','lab','lab','lab','lab','lab','academy'];
 const scientific=economy('technocracy',types),democratic=economy('democracy',types);
 const a=forecastDay(scientific),b=forecastDay(democratic),ar=a.planets.find(p=>p.owner==='player').lastReport,br=b.planets.find(p=>p.owner==='player').lastReport;
 assert.ok(a.budget.science>b.budget.science);assert.ok(ar.upkeep>br.upkeep);assert.ok(a.budget.science/ar.upkeep>b.budget.science/br.upkeep);
 assert.ok(ar.demandByResource.energy<br.demandByResource.energy);assert.ok(researchDays(scientific,'quantumModels')<researchDays(democratic,'quantumModels'));
});

test('military institutions sustain more combat power per credit while civil production pays the opportunity cost',()=>{
 const military=economy('military'),royal=economy('monarchy');fleet(military);fleet(royal);
 const strength=s=>s.fleets.reduce((n,f)=>n+fleetStrength(s,f),0);
 assert.ok(strength(military)>strength(royal));assert.ok(fleetUpkeep(military)<fleetUpkeep(royal));
 assert.ok(strength(military)/fleetUpkeep(military)>strength(royal)/fleetUpkeep(royal));
 assert.ok(shipBuildDays(military,'destroyer')<shipBuildDays(royal,'destroyer'));
 const a=forecastDay(military),b=forecastDay(royal);
 assert.ok(a.planets.find(p=>p.owner==='player').lastReport.productionByResource.alloy<b.planets.find(p=>p.owner==='player').lastReport.productionByResource.alloy);
 const credits=military.credits;runDailyEconomy(military);close(military.credits-credits,a.budget.actual);
});

test('mass mobilization and a professional military have different production, staffing and fleet costs',()=>{
 const mass=economy('nationalSocialism',industry),professional=economy('military',industry);fleet(mass);fleet(professional);
 const a=forecastDay(mass).planets.find(p=>p.owner==='player').lastReport,b=forecastDay(professional).planets.find(p=>p.owner==='player').lastReport;
 assert.ok(a.available>b.available);assert.ok(a.productionByResource.weapons>b.productionByResource.weapons);
 assert.ok(fleetUpkeep(mass)>fleetUpkeep(professional));assert.ok(fleetStrength(mass,mass.fleets[0])<fleetStrength(professional,professional.fleets[0]));
});

test('commercial profiles improve real civilian output and paid exports without creating extra buyer funds',()=>{
 const company=economy('corporate',[...base,'goodsFactory']),royal=economy('monarchy',[...base,'goodsFactory']);
 const a=forecastDay(company).planets.find(p=>p.owner==='player').lastReport,b=forecastDay(royal).planets.find(p=>p.owner==='player').lastReport;
 assert.ok(a.productionByResource.goods>b.productionByResource.goods);
 const planet=s=>s.planets.find(p=>p.owner==='ilyri');for(const s of [company,royal]){s.relations.ilyri.trade=true;planet(s).stock.ore=0;}
 const quote=quoteSale(company,planet(company),'ore',10);assert.ok(quote.total>quoteSale(royal,planet(royal),'ore',10).total);
 const buyer=company.factions.ilyri.credits,seller=company.credits,stock=planet(company).stock.ore;
 const sold=sellGoods(company,planet(company),'ore',10);close(sold.total,quote.total);close(company.credits-seller,buyer-company.factions.ilyri.credits);close(planet(company).stock.ore-stock,sold.amount);
});

test('current laws, paid programs, stocks and running research survive a save without rewriting the political balance',()=>{
 const s=negotiating();s.player.ideology='technocracy';s.governance=initialGovernance('technocracy');s.science=1000;
 assert.equal(treatyAction(s,'ilyri','cooperation'),null);assert.equal(treatyAction(s,'ilyri','research-pact'),null);
 const id=Object.entries(TECHNOLOGIES).find(([key,t])=>!s.tech.includes(key)&&!t.requires.length&&!t.requiresAny)?.[0];assert.ok(id);assert.equal(startResearch(s,id),null);
 const restored=parseImport(exportGame(s));assert.deepEqual(restored,s);assert.equal(restored.research.remaining,s.research.remaining);
 close(forecastDay(restored).budget.science,forecastDay(s).budget.science);close(diplomacyScience(restored),diplomacyScience(s));
});
