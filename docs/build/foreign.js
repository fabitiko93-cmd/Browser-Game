import { buildingBlock } from './infrastructure.js';
import { realmAtWar } from './realm-relations.js';
import { realmBalance } from './realm-ai.js';
import { essentialBuilding } from './finance.js';
import { marketDemand } from './trade.js';
import { manageProduction, productionWanted, spareWorkers, investmentAllowed } from './realm-economy.js';
import { housing } from './economy.js';
import { SHIPS } from './data.js';
import { FACTIONS, BUILDINGS, TECHNOLOGIES } from './data.js';
import { initialGovernance, policyEffects, decide, decisionCost } from './governance.js';
import { technologyEffects } from './technology.js';
import { researchDays } from './research.js';
import { terrainAt, uid } from './state.js';
function foundations(ids) {
 const result=new Set();
 const visit=id=>{if(result.has(id))return;for(const prerequisite of TECHNOLOGIES[id].requires)visit(prerequisite);result.add(id);};
 ids.forEach(visit);return [...result];
}
export function initialFactions() {
 const seeds={ilyri:['hydroponics','consumerCulture'],khepri:['computing','electronics'],aster:['lasers','precisionFab'],corona:['consumerCulture','labMethods'],collective:['biomedicine','consumerCulture'],vanguard:['deuterium','supplyPorts'],nexus:['computing','electronics'],concord:['hydroponics','consumerCulture'],houses:['precisionFab'],sanctum:['biomedicine','consumerCulture'],union:['hydroponics'],guild:['computing','electronics'],clans:['precisionFab'],archive:['computing','electronics'],mandate:['deuterium','supplyPorts'],commons:['consumerCulture'],nomads:['hydroponics','consumerCulture'],forge:['precisionFab']};
 return Object.fromEntries(Object.keys(FACTIONS).filter(id=>id!=='player').map(id=>{
  const g=initialGovernance(FACTIONS[id].ideology);
  g.laws.science={democracy:'peer',communism:'state',monarchy:'patronage',military:'military',technocracy:'expert',nationalSocialism:'state',federation:'network',corporate:'patent',oligarchy:'patent',theocracy:'doctrine'}[FACTIONS[id].ideology];
  return [id,{credits:1600,science:0,tech:foundations([...seeds[id],...(FOREIGN_FACILITIES[id]??[]).map(type=>BUILDINGS[type].requiredTech).filter(Boolean),'engineTuning','communications']),research:null,governance:g,nextBuild:60}];
 }));
}
export const FOREIGN_FACILITIES={ilyri:['farm','goodsFactory'],khepri:['crystal','electronicsFactory'],aster:['laser','foundry'],corona:['goodsFactory','farm'],collective:['medicineFactory','clinic'],vanguard:['fuelExtractor','depot'],nexus:['electronicsFactory','tradePort'],concord:['farm','goodsFactory'],houses:['mine','foundry'],sanctum:['medicineFactory','clinic'],union:['farm','farm'],guild:['optics','electronicsFactory'],clans:['mine','mine'],archive:['electronicsFactory','lab'],mandate:['fuelExtractor','depot'],commons:['goodsFactory','farm'],nomads:['farm','farm'],forge:['foundry','foundry']};
export function tickForeignDevelopment(state) {
 for(const [id,f] of Object.entries(state.factions)){
  if(!state.planets.some(p=>p.owner===id&&!p.destroyed))continue;
  const owned=state.planets.filter(p=>p.owner===id&&!p.destroyed);
  if(f.credits<0){
   const candidates=owned.flatMap(p=>p.buildings.filter(b=>b.enabled&&b.remaining<=0&&!essentialBuilding(b.type)).map(b=>({p,b,cost:BUILDINGS[b.type].upkeep})));
   const cut=candidates.sort((a,b)=>(b.b.status==='aktiv'?0:20)-(a.b.status==='aktiv'?0:20)||b.cost-a.cost)[0];
   if(cut){cut.b.enabled=false;cut.b.status='pausiert';}continue;
  }
  const balance=realmBalance(state,id);
  const focus=state.galaxy?.strategies[id]?.focus,doctrine=state.galaxy?.strategies[id]?.doctrine;
  for(const p of owned)manageProduction(state,p);
  if(state.day%30===Object.keys(state.factions).indexOf(id)%30){
   const program=focus==='recovery'&&owned.some(p=>p.net.food<0)?'ration':realmAtWar(state,id)?'mobilize':doctrine==='science'?'grant':doctrine==='trade'?'trade':'industry';
   const useful=program==='ration'||program==='mobilize'&&owned.some(p=>p.queues.some(q=>SHIPS[q.type].strength>0))||program==='grant'&&owned.some(p=>p.lastReport?.science>0)||program==='trade'&&state.fleets.some(ship=>ship.owner===id&&ship.mission?.kind==='commerce')||program==='industry'&&owned.some(p=>Object.keys(p.stock).some(key=>(p.net[key]??0)<0&&p.stock[key]<marketDemand(state,p,key)*30));
   const reserve=['security','expansion'].includes(doctrine)?500:300;
   if(useful&&(program==='ration'&&f.credits>100||balance>6&&investmentAllowed(state,id,decisionCost(state,program,id)+reserve)))decide(state,program,id);
  }
  if(!f.research){
   const available=Object.entries(TECHNOLOGIES).filter(([key,t])=>!f.tech.includes(key)&&t.cost<=f.science&&t.requires.every(q=>f.tech.includes(q))&&(!t.requiresAny||t.requiresAny.some(q=>f.tech.includes(q)))&&!(t.excludes??[]).some(q=>f.tech.includes(q)));
   const priorities=realmAtWar(state,id)||['security','expansion'].includes(doctrine)?['targeting','lasers','fortification','computing','newsNetwork','advancedDiplomacy']:['planetaryAnalysis','computing','newsNetwork','advancedDiplomacy'];
   available.sort((a,b)=>(priorities.includes(a[0])?priorities.indexOf(a[0]):20)-(priorities.includes(b[0])?priorities.indexOf(b[0]):20)||(a[0]==='planetaryAnalysis'?0:1)-(b[0]==='planetaryAnalysis'?0:1)||(a[1].branch===FACTIONS[id].research?0:1)-(b[1].branch===FACTIONS[id].research?0:1)||a[1].tier-b[1].tier||a[1].cost-b[1].cost);
   if(available.length){const [key,t]=available[0];f.science-=t.cost;const total=researchDays(state,key,id);f.research={id:key,remaining:total,total};}
  }
  if(f.tech.includes('politicalReforms')&&f.governance.laws.administration==='local'&&f.governance.lawReady<=state.day){const cost=Math.ceil(60*policyEffects(state,id).reformCost*technologyEffects(state,id).reformCost);if(f.credits>=cost){f.credits-=cost;f.governance.laws.administration={democracy:'federal',communism:'councils',monarchy:'crown',military:'command',technocracy:'experts',nationalSocialism:'directive',federation:'compact',corporate:'concessions',oligarchy:'houses',theocracy:'synod'}[FACTIONS[id].ideology];f.governance.lawReady=state.day+5;}}
  if(state.day<f.nextBuild)continue;f.nextBuild=state.day+45;
  development: for(const p of owned.sort((a,b)=>b.population-a.population)){
  const room=housing(state,p)+p.buildings.filter(b=>b.remaining>0).reduce((n,b)=>n+(BUILDINGS[b.type].housing??0)*technologyEffects(state,id).housing,0);
  const deficits=Object.keys(p.stock).map(key=>({key,days:p.stock[key]/Math.max(.1,marketDemand(state,p,key)),net:(p.lastReport?.productionByResource?.[key]??0)-marketDemand(state,p,key)})).filter(q=>q.days<20&&q.net<0).sort((a,b)=>a.days-b.days);
  const supply=deficits.flatMap(q=>Object.entries(BUILDINGS).filter(([,d])=>d.output?.[q.key]&&(!d.requiredTech||f.tech.includes(d.requiredTech))).map(([key])=>key));
  const military=['security','expansion'].includes(doctrine)&&focus!=='recovery';
  const preferences=[...supply,...(!p.buildings.some(b=>b.type==='commCenter')?['commCenter']:[]),...(room<p.population+Math.max(30,(p.lastReport?.growth??.45)*90)?[...(f.tech.includes('compactCities')?['tower']:[]),'habitat']:[]),...(military&&!p.buildings.some(b=>b.type==='laser')?['laser']:[]),...(realmAtWar(state,id)?['shield','bunker','missileSilo']:[]),...(doctrine==='science'?['academy','lab']:[]),...(doctrine==='trade'?['tradePort','embassy']:['embassy']),...FOREIGN_FACILITIES[id],'solar'];
  for(const type of preferences){
   const d=BUILDINGS[type];if(buildingBlock(state,p,type)||d.requiredTech&&!f.tech.includes(d.requiredTech)||d.unique&&p.buildings.filter(b=>b.type===type).length>=d.unique||p.buildings.filter(b=>b.type===type).length>=(type==='habitat'?6:3))continue;
   if(d.housing&&room>=p.population+Math.max(30,(p.lastReport?.growth??.45)*90))continue;
   if(p.buildings.some(b=>b.type===type&&!b.enabled)||!productionWanted(state,p,type)||spareWorkers(state,p)<d.workers&&!essentialBuilding(type))continue;
   const upkeep=d.upkeep*policyEffects(state,id).upkeep*technologyEffects(state,id).buildingUpkeep;
   if(!essentialBuilding(type)&&!investmentAllowed(state,id,d.cost.credits??0,upkeep))continue;
   if(Object.entries(d.cost).some(([k,v])=>(k==='credits'?f.credits:p.stock[k])<v))continue;
   let tile=null;for(let y=3;y<12&&!tile;y++)for(let x=2;x<10;x++)if(!p.buildings.some(b=>b.x===x&&b.y===y)&&!['water','cliff','void'].includes(terrainAt(p,x,y))){tile={x,y};break;}
   if(!tile)break;
   for(const [k,v] of Object.entries(d.cost))if(k==='credits')f.credits-=v;else p.stock[k]-=v;
   p.buildings.push({id:uid(state,'foreign'),type,...tile,remaining:d.days,enabled:true,status:'Bau'});break development;
  }
  }
 }
}
