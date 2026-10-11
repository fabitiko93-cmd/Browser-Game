import { BUILDINGS, SHIPS, RESOURCE_KEYS } from './data.js';
import { getPlanet, canAfford, pay, uid, log } from './state.js';
import { knowledgeOf, observePlanet } from './intelligence.js';
import { orderFleet, fleetTravelDays, departureFuel } from './fleets.js';
import { cargoUsed } from './routing.js';
import { technologyEffects } from './technology.js';
import { placementIssue } from './surface.js';
import { locationsOf } from './world.js';

export const RELICS = {
  depot: { name:'Verlassener Versorgungsknoten', description:'Kann nach Wiederherstellung als Versorgungsdepot genutzt werden.', tech:'supplyPorts', building:'depot', salvage:{alloy:24,crystal:12,optics:10} },
  observatory: { name:'Verlassenes Observatorium', description:'Kann nach Wiederherstellung Forschungsarbeit aufnehmen.', tech:'computing', building:'lab', salvage:{alloy:16,crystal:14,optics:16} }
};
export const RESTORE_COST = {credits:220,alloy:51,optics:8,food:16,energy:32};
const supplies = {alloy:16,food:16,energy:32};
function relicTile(p){for(let y=3;y<12;y++)for(let x=2;x<10;x++)if(!placementIssue(p,x,y))return {x,y};return null;}
export function ruinKnown(state,p,owner='player') { return Boolean(p?.ruin && (p.owner===owner||knowledgeOf(state,p,owner).relic)); }
export function orderRelic(state,fleetId,targetId,action,owner='player') {
  const p=getPlanet(state,targetId),f=state.fleets.find(f=>f.id===fleetId&&f.owner===owner),source=f&&getPlanet(state,f.planetId),tech=owner==='player'?state.tech:state.factions[owner]?.tech;
  if(!p||!f||!['salvage','restore'].includes(action)||!ruinKnown(state,p,owner))return 'Die Ruine muss zuerst durch eine Oberflächenanalyse bekannt sein.';
  if(p.ruin.status!=='sealed'||p.destroyed||state.fleets.some(q=>q.mission?.kind==='relic'&&q.mission.target===p.id))return 'Diese Ruine wird bereits genutzt oder untersucht.';
  if(f.mission||f.route||source.owner!==owner||source.id===p.id)return 'Wähle einen freien Frachter an einem anderen eigenen Hafen.';
  if(p.owner&&p.owner!==owner)return 'Die Ruine liegt in fremdem Hoheitsgebiet.';
  if(!p.anchor&&action==='restore'&&p.owner!==owner)return 'Für einen dauerhaft betriebenen Stützpunkt muss der Planet zuerst kolonisiert werden.';
  const amount=Object.values(action==='restore'?supplies:RELICS[p.ruin.type].salvage).reduce((n,v)=>n+v,0);
  if(cargoUsed(f)+amount>Math.floor((SHIPS[f.type].cargo??0)*technologyEffects(state,owner).cargoCapacity))return `Die Expedition benötigt ${amount} freien Frachtraum.`;
  if(!tech.includes('planetaryAnalysis')||action==='restore'&&!tech.includes(RELICS[p.ruin.type].tech))return `Benötigt: Planetare Analyseverfahren${action==='restore'?' und die entsprechende Betriebsforschung':''}.`;
  const cost=action==='restore'?RESTORE_COST:{credits:65};
  if(!canAfford(state,source,{...cost,energy:(cost.energy??0)+departureFuel(state,source,p,owner)*2},owner))return 'Für die Expedition fehlen Credits, Baustoffe oder Reiseenergie für Hin- und Rückflug.';
  if(action==='restore'&&!p.anchor&&p.buildings.some(b=>b.type===RELICS[p.ruin.type].building&&BUILDINGS[b.type].unique))return 'Auf diesem Planeten steht bereits eine Anlage dieses Typs.';
  if(action==='restore'&&!p.anchor&&!relicTile(p))return 'Für eine wiederhergestellte Anlage fehlt eine freie Fläche.';
  const error=orderFleet(state,[fleetId],targetId,'move',{owner});if(error)return error;
  // The departure has already paid propulsion; the cargo energy is a separate, real stock transfer.
  pay(state,source,cost,owner);
  source.stock.energy-=departureFuel(state,source,p,owner);
  if(action==='restore')for(const [key,n]of Object.entries(supplies))f.cargo[key]+=n;
  Object.assign(f.mission,{kind:'relic',relicAction:action});return null;
}
export function arriveRelic(state,f,m,p) {
  if(p.ruin?.status!=='sealed'||p.owner&&p.owner!==f.owner){returnRelic(state,f,p,m.source);return;}
  if(m.relicAction==='salvage') {
    for(const[key,n]of Object.entries(RELICS[p.ruin.type].salvage))f.cargo[key]+=n;
    p.ruin.status='salvaged';
    if(f.owner==='player')log(state,`${p.name}: Ruinenmaterial geborgen. Fracht kehrt zum Heimathafen zurück.`,'success','delivery');
    returnRelic(state,f,p,m.source);return;
  }
  p.ruin.status='restoring';p.ruin.operator=f.owner;p.ruin.remaining=12;
  f.mission={...m,phase:'work',remaining:12,total:12};
}
export function workRelic(state,f) {
  const m=f.mission,p=getPlanet(state,m.target),r=p?.ruin;
  if(!r||p.destroyed||r.operator!==f.owner||p.owner&&p.owner!==f.owner){if(r?.status==='restoring'){r.status='sealed';r.operator=null;r.remaining=0;}f.mission=null;returnRelic(state,f,p,m.source);return;}
  r.remaining=--m.remaining;f.supply=Math.max(0,f.supply-.3);
  if(m.remaining>0)return;
  const tile=!p.anchor&&relicTile(p),type=RELICS[r.type].building;
  if(!p.anchor&&(!tile||BUILDINGS[type].unique&&p.buildings.some(b=>b.type===type))){r.status='sealed';r.remaining=0;r.operator=null;f.mission=null;returnRelic(state,f,p,m.source);return;}
  r.status='active';r.remaining=0;
  for(const[key,n]of Object.entries(supplies)){f.cargo[key]-=n;p.stock[key]+=n;}
  if(p.anchor)p.owner=f.owner;
  else {
    const id=uid(state,'restored');p.buildings.push({id,type,...tile,remaining:0,enabled:true,status:'aktiv'});r.buildingId=id;
  }
  observePlanet(state,f.owner,p,'probe');
  if(f.owner==='player')log(state,`${p.name}: ${RELICS[r.type].name} wiederhergestellt.`,'success','build');
  f.mission=null;returnRelic(state,f,p,m.source);
}
function returnRelic(state,f,p,sourceId) {
  const home=getPlanet(state,sourceId);
  if(!p||!home||home.destroyed||home.owner!==f.owner){return;}
  const days=fleetTravelDays(state,p,home,[f]);
  f.mission={group:uid(state,'relic-return'),kind:'move',source:p.id,target:home.id,remaining:days,total:days,cargo:null};
}
export function runAnchor(state,p) {
  const r=p.ruin;if(!p.owner||r?.status!=='active'||p.destroyed)return {upkeep:0,science:0};
  const wallet=p.owner==='player'?state:state.factions[p.owner];
  if(wallet.credits<1||p.stock.energy<2||p.stock.food<.12){p.active=false;return{upkeep:0,science:0};}
  p.stock.energy-=2;p.stock.food-=.12;p.active=true;
  return {upkeep:1,science:r.type==='observatory'?2:0};
}
export function syncRuins(state) {
  for(const p of locationsOf(state)){const r=p.ruin;if(!r)continue;
    if(r.status==='restoring'&&!state.fleets.some(f=>f.hp>0&&f.owner===r.operator&&f.mission?.kind==='relic'&&f.mission.target===p.id&&f.mission.phase==='work')){r.status='sealed';r.operator=null;r.remaining=0;}
    if(r.buildingId&&!p.buildings.some(b=>b.id===r.buildingId)){delete r.buildingId;r.status='salvaged';r.operator=null;r.remaining=0;}
    if(r.status==='active'&&p.owner!==r.operator)r.operator=p.owner;
  }
}
