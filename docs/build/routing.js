import { reachablePlanet } from './intelligence.js';
import { RESOURCE_KEYS, SHIPS } from './data.js';
import { getPlanet, makeStock, log, uid } from './state.js';
import { cargoCapacity, departureFuel, fleetTravelDays, orderFleet } from './fleets.js';
import { technologyEffects } from './technology.js';
import { tradingAccess, sellGoods, purchaseGoods } from './trade.js';
export const SUPPLY_DEFAULTS={threshold:40,target:95,repairBelow:50,repairTo:95,homePort:'nereid',smart:false};
export const routePlanets=r=>r?.type==='circuit'?r.stops.map(s=>s.planet):r?[r.source,r.target]:[];
export const cargoUsed=f=>Object.values(f.cargo??{}).reduce((n,v)=>n+v,0);
export function configureSupply(state,id,settings) {
 const f=state.fleets.find(f=>f.id===id&&f.owner==='player');if(!f)return 'Schiff nicht gefunden.';
 const next={...SUPPLY_DEFAULTS,...f.supplySettings,...settings};
 for(const k of ['threshold','target','repairBelow','repairTo'])if(!Number.isFinite(next[k])||next[k]<0||next[k]>100)return 'Versorgungswerte müssen zwischen 0 und 100 % liegen.';
 if(next.target<=next.threshold||next.repairTo<=next.repairBelow)return 'Zielwert muss über dem Auslösewert liegen.';
 if(getPlanet(state,next.homePort)?.owner!=='player')return 'Wähle einen eigenen Heimathafen.';
 if(f.route&&!routePlanets(f.route).includes(next.homePort))return 'Der Heimathafen muss ein Stopp dieser Route sein.';
 if(next.smart&&!state.tech.includes('smartLogistics'))return 'Benötigt: Bedarfsgesteuerte Logistik.';
 f.supplySettings=next;return null;
}
export function serviceFleet(state,id) {
 const f=state.fleets.find(f=>f.id===id&&f.owner==='player');
 if(!f||f.mission)return 'Wähle ein stationäres Schiff.';
 const p=getPlanet(state,f.planetId),settings={...SUPPLY_DEFAULTS,...f.supplySettings},home=getPlanet(state,settings.homePort);
 if(home?.owner==='player'&&home.id!==p.id){const route=f.route;f.route=null;const error=orderFleet(state,[f.id],home.id,'move');f.route=route;if(error)return error;if(route?.type==='circuit'){f.mission.kind='circuit';f.mission.stopIndex=route.stops.findIndex(s=>s.planet===home.id);}f.servicing=true;return null;}
 if(p.owner!=='player'&&!state.relations[p.owner]?.portAccess)return 'Hier fehlt ein eigener Hafen oder ein Hafenabkommen.';
 f.servicing=true;return null;
}
export function unloadCargo(state,id) {
 const f=state.fleets.find(f=>f.id===id&&f.owner==='player');const p=f&&getPlanet(state,f.planetId);
 if(!f||f.mission||p.owner!=='player')return 'Fracht kann an einem eigenen Planeten entladen werden.';
 for(const k of RESOURCE_KEYS){p.stock[k]+=f.cargo?.[k]??0;if(f.cargo)f.cargo[k]=0;}return null;
}
export function startCircuit(state,id,draft) {
 const f=state.fleets.find(f=>f.id===id&&f.owner==='player');
 if(!f||!SHIPS[f.type].cargo||f.mission||f.route)return 'Wähle einen freien Frachter.';
 const max=state.tech.includes('smartLogistics')?8:state.tech.includes('tradeCircuits')?6:2;
 if(!Array.isArray(draft.stops)||draft.stops.length<2||draft.stops.length>max)return `Aktuell sind 2 bis ${max} Stopps möglich. Weitere Stopps benötigen Handelsforschung.`;
 if(draft.stops[0].planet!==f.planetId||getPlanet(state,f.planetId).owner!=='player')return 'Der erste Stopp muss der eigene Startplanet des Frachters sein.';
 if(!Number.isFinite(draft.interval)||draft.interval<0||draft.interval>120)return 'Routenabstand muss zwischen 0 und 120 Tagen liegen.';
 const stops=structuredClone(draft.stops);
 for(let i=0;i<stops.length;i++){
  const stop=stops[i],p=getPlanet(state,stop.planet),next=stops[(i+1)%stops.length];
  if(!p||!reachablePlanet(state,p)||p.destroyed||!p.owner||p.owner!=='player'&&!tradingAccess(state,p))return 'Ein Stopp ist nicht zugänglich.';
  if(stop.planet===next.planet)return 'Aufeinanderfolgende Stopps müssen verschiedene Planeten sein.';
  if(!Array.isArray(stop.actions)||stop.actions.length>8)return 'Höchstens acht Warenaufträge je Stopp.';
  for(const a of stop.actions){
   if(!['load','unload','buy','sell'].includes(a.kind)||!RESOURCE_KEYS.includes(a.resource)||!Number.isFinite(a.amount)||a.amount<1||a.amount>cargoCapacity(state,f.type))return 'Ungültiger Warenauftrag oder zu große Frachtmenge.';
   if(p.owner==='player'&&!['load','unload'].includes(a.kind)||p.owner!=='player'&&!['buy','sell'].includes(a.kind))return 'Eigene Häfen laden und entladen; fremde Häfen kaufen und verkaufen.';
   a.reserve=Number(a.reserve??0);a.minPrice=Number(a.minPrice??0);a.maxPrice=Number(a.maxPrice??1000000);
   if([a.reserve,a.minPrice,a.maxPrice].some(v=>!Number.isFinite(v)||v<0||v>1e9))return 'Ungültiger Mindestbestand oder Preis.';
  }
 }
 const first=stops[0].actions.find(a=>a.kind==='load');
 f.supplySettings={...SUPPLY_DEFAULTS,...f.supplySettings,homePort:stops.some(s=>s.planet===f.supplySettings?.homePort)?f.supplySettings.homePort:stops[0].planet};
 f.cargo=makeStock(f.cargo??{});f.route={type:'circuit',id:uid(state,'circuit'),stops,index:0,processed:false,interval:draft.interval,nextReady:state.day,lastCycle:state.day,source:stops[0].planet,target:stops[1].planet,resource:first?.resource??'ore',amount:first?.amount??1};
 f.pauseReason='Bereit';log(state,`${f.name}: Handelskreislauf mit ${stops.length} Stopps eingerichtet.`,'success');return null;
}
export function tickCircuit(state,f) {
 const r=f.route,p=getPlanet(state,f.planetId);if(!r||r.type!=='circuit')return;
 if(r.stops.some(s=>{const q=getPlanet(state,s.planet);return !q||q.destroyed||q.owner!=='player'&&!tradingAccess(state,q);})){f.pauseReason='Route blockiert: Handelszugang fehlt';return;}
 if(f.servicing||f.repairing){f.pauseReason='Versorgung / Reparatur';return;}
 if(state.day<r.nextReady){f.pauseReason=`Nächster Umlauf in ${r.nextReady-state.day} Tagen`;return;}
 const stop=r.stops[r.index];
 if(p.id!==stop.planet){f.pauseReason='Route und Schiffsposition stimmen nicht überein';return;}
 if(!r.processed){
  for(const a of stop.actions){
   let amount=Math.min(a.amount,f.cargo[a.resource]??0);
   if(a.kind==='unload'){p.stock[a.resource]+=amount;f.cargo[a.resource]-=amount;}
   else if(a.kind==='sell'){const sale=sellGoods(state,p,a.resource,amount,a.minPrice);f.cargo[a.resource]-=sale.amount;}
   else {
    const room=Math.max(0,cargoCapacity(state,f.type)-cargoUsed(f));amount=Math.min(a.amount,room);
    if(a.kind==='load'){amount=Math.min(amount,Math.max(0,p.stock[a.resource]-a.reserve));p.stock[a.resource]-=amount;f.cargo[a.resource]+=amount;}
    else {const purchase=purchaseGoods(state,p,a.resource,amount,a.maxPrice);f.cargo[a.resource]+=purchase.amount;}
   }
  }
  r.processed=true;
  if(r.index===0&&stop.actions.some(a=>a.kind==='load')&&cargoUsed(f)<.001){r.processed=false;f.pauseReason='Wartet auf Ware über dem Mindestbestand';return;}
 }
 const target=getPlanet(state,r.stops[(r.index+1)%r.stops.length].planet),fuel=departureFuel(state,p,target);
 const days=fleetTravelDays(state,p,target,[f]);
 let reserve=5;for(let n=0;n<r.stops.length;n++){const from=getPlanet(state,r.stops[(r.index+n)%r.stops.length].planet),to=getPlanet(state,r.stops[(r.index+n+1)%r.stops.length].planet);reserve+=fleetTravelDays(state,from,to,[f])*technologyEffects(state).travelSupply;if(to.owner==='player'||state.relations[to.owner]?.portAccess)break;}
 if(reserve>100){f.pauseReason='Route benötigt einen weiteren Versorgungshafen oder sparsamere Antriebe';return;}
 if(f.supply<Math.max(10,reserve)){f.servicing=p.owner==='player'||Boolean(state.relations[p.owner]?.portAccess);f.pauseReason='Versorgung reicht nicht bis zum nächsten Hafen';return;}
 if(p.stock.energy<fuel){f.pauseReason='Wartet auf Startenergie';return;}
 p.stock.energy-=fuel;f.pauseReason='';
 if(r.index===0)r.lastCycle=state.day;
 f.mission={group:uid(state,'circuit-flight'),kind:'circuit',source:p.id,target:target.id,remaining:days,total:days,cargo:null,stopIndex:(r.index+1)%r.stops.length};
}
export function arriveCircuit(state,f,m) {
 if(f.route?.type!=='circuit'){f.pauseReason='Route beendet; Fracht bleibt an Bord';return;}
 f.route.index=m.stopIndex;f.route.processed=false;f.route.nextReady=m.stopIndex===0?Math.max(state.day,f.route.lastCycle+f.route.interval):state.day;
}
