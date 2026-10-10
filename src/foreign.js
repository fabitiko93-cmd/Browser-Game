import { essentialBuilding } from './finance.js';
import { marketDemand } from './trade.js';
import { FACTIONS, BUILDINGS, TECHNOLOGIES } from './data.js';
import { initialGovernance, policyEffects } from './governance.js';
import { technologyEffects } from './technology.js';
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
  const balance=owned.reduce((n,p)=>n+(p.lastReport?.income??0)-(p.lastReport?.upkeep??0),0);
  for(const p of owned){const resume=p.buildings.find(b=>!b.enabled&&b.remaining<=0&&!essentialBuilding(b.type)&&balance>BUILDINGS[b.type].upkeep*policyEffects(state,id).upkeep*technologyEffects(state,id).buildingUpkeep+5);if(resume){resume.enabled=true;break;}}

  if(f.research&&--f.research.remaining<=0){f.tech.push(f.research.id);f.research=null;}
  if(!f.research){
   const available=Object.entries(TECHNOLOGIES).filter(([key,t])=>!f.tech.includes(key)&&t.cost<=f.science&&t.requires.every(q=>f.tech.includes(q))&&(!t.requiresAny||t.requiresAny.some(q=>f.tech.includes(q)))&&!(t.excludes??[]).some(q=>f.tech.includes(q)));
   available.sort((a,b)=>(a[0]==='planetaryAnalysis'?0:1)-(b[0]==='planetaryAnalysis'?0:1)||(a[1].branch===FACTIONS[id].research?0:1)-(b[1].branch===FACTIONS[id].research?0:1)||a[1].tier-b[1].tier||a[1].cost-b[1].cost);
   if(available.length){const [key,t]=available[0];f.science-=t.cost;f.research={id:key,remaining:Math.max(2,Math.ceil(t.days*policyEffects(state,id).researchTime*technologyEffects(state,id).researchTime))};}
  }
  if(f.tech.includes('politicalReforms')&&f.governance.laws.administration==='local'&&f.governance.lawReady<=state.day){const cost=Math.ceil(60*policyEffects(state,id).reformCost*technologyEffects(state,id).reformCost);if(f.credits>=cost){f.credits-=cost;f.governance.laws.administration={democracy:'federal',communism:'councils',monarchy:'crown',military:'command',technocracy:'experts',nationalSocialism:'directive',federation:'compact',corporate:'concessions',oligarchy:'houses',theocracy:'synod'}[FACTIONS[id].ideology];f.governance.lawReady=state.day+5;}}
  if(state.day<f.nextBuild)continue;f.nextBuild=state.day+60;
  const p=state.planets.filter(p=>p.owner===id&&!p.destroyed).sort((a,b)=>(a.lastReport?.missingResources?.length??0)-(b.lastReport?.missingResources?.length??0)||b.population-a.population).at(-1);
  const housing=p.buildings.reduce((n,b)=>n+(b.remaining<=0?BUILDINGS[b.type].housing??0:0),0);
  const deficits=Object.keys(p.stock).map(key=>({key,days:p.stock[key]/Math.max(.1,marketDemand(state,p,key)),net:(p.lastReport?.productionByResource?.[key]??0)-marketDemand(state,p,key)})).filter(q=>q.days<20&&q.net<0).sort((a,b)=>a.days-b.days);
  const supply=deficits.flatMap(q=>Object.entries(BUILDINGS).filter(([,d])=>d.output?.[q.key]&&(!d.requiredTech||f.tech.includes(d.requiredTech))).map(([key])=>key));
  const preferences=[...(state.relations[id]?.war?['shield','missileSilo','laser']:[]),...supply,...(!p.buildings.some(b=>b.type==='commCenter')?['commCenter']:[]),...(housing<p.population+30?['habitat']:[...FOREIGN_FACILITIES[id],'solar','academy','tradePort'])];
  for(const type of preferences){
   const d=BUILDINGS[type];if(d.requiredTech&&!f.tech.includes(d.requiredTech)||d.unique&&p.buildings.filter(b=>b.type===type).length>=d.unique||p.buildings.filter(b=>b.type===type).length>=3)continue;
   if(!essentialBuilding(type)&&balance<d.upkeep*policyEffects(state,id).upkeep*technologyEffects(state,id).buildingUpkeep+3)continue;
   if(Object.entries(d.cost).some(([k,v])=>(k==='credits'?f.credits:p.stock[k])<v))continue;
   let tile=null;for(let y=3;y<12&&!tile;y++)for(let x=2;x<10;x++)if(!p.buildings.some(b=>b.x===x&&b.y===y)&&!['water','cliff','void'].includes(terrainAt(p,x,y))){tile={x,y};break;}
   if(!tile)break;
   for(const [k,v] of Object.entries(d.cost))if(k==='credits')f.credits-=v;else p.stock[k]-=v;
   p.buildings.push({id:uid(state,'foreign'),type,...tile,remaining:d.days,enabled:true,status:'Bau'});break;
  }
 }
}
