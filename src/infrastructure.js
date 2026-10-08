import { BUILDINGS, RESOURCES } from './data.js';
export const PRIORITIES = {balanced:'Ausgewogen',supply:'Bevölkerung und Versorgung',industry:'Zivile Industrie',defense:'Verteidigung und Werften',science:'Wissenschaft'};
export function serviceCount(planet, service) {
 return planet.buildings.filter(b=>b.enabled&&b.remaining<=0&&b.status==='aktiv'&&BUILDINGS[b.type].service===service).length;
}
export function buildingBlock(state, planet, type) {
 const def=BUILDINGS[type];
 if(!def)return 'Unbekanntes Bauwerk.';
 if(def.unique&&planet.buildings.filter(b=>b.type===type).length>=def.unique)return `Höchstens ${def.unique} ${def.name} je Planet.`;
 return null;
}
export function setProductionPriority(planet, priority) {
 if(planet?.owner!=='player'||!Object.hasOwn(PRIORITIES,priority))return 'Ungültige Produktionspriorität.';
 planet.priority=priority;return null;
}
export function orderedBuildings(planet) {
 const priority=planet.priority??'balanced';
 if(priority==='balanced')return planet.buildings;
 const rank=b=>{
  const d=BUILDINGS[b.type];
  if(priority==='supply')return d.housing||d.output?.food||d.output?.energy||['health','civic','supply'].includes(d.service)?0:1;
  if(priority==='industry')return d.group==='Industrie'||d.group==='Rohstoffe'?0:1;
  if(priority==='defense')return d.group==='Planetare Basen'||b.type==='shipyard'?0:1;
  return d.science||d.group==='Wissenschaft'?0:1;
 };
 return [...planet.buildings].sort((a,b)=>rank(a)-rank(b));
}
export function shortageExplanation(planet) {
 return planet.buildings.filter(b=>b.enabled&&b.remaining<=0&&b.status!=='aktiv').map(b=>{
  const d=BUILDINGS[b.type];
  const missing=Object.keys(d.input??{}).filter(k=>planet.stock[k]<(d.input[k]??0));
  const causes=missing.map(k=>{
   const producers=planet.buildings.filter(other=>BUILDINGS[other.type].output?.[k]);
   return `${RESOURCES[k].name}${producers.length?` (${producers.map(other=>`${BUILDINGS[other.type].name}: ${other.status}`).join('; ')})`:' (keine örtliche Produktion)'} `;
  });
  return {id:b.id,text:`${d.name}: ${b.status}${causes.length&&b.status==='Rohstoffe fehlen'?` → ${causes.join(', ')}`:''}`};
 });
}
