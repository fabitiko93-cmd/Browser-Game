import { RESOURCES, BUILDINGS } from './data.js';
import { getPlanet } from './state.js';
import { forecastDay } from './budget.js';
import { icon } from './icons.js';
import { esc } from './ui-format.js';
export const hudPlanet=(state,ui)=>{const p=getPlanet(state,ui.planetId);return p?.owner==='player'&&!p.destroyed?p:state.planets.find(p=>p.owner==='player'&&!p.destroyed);};
const number=v=>v>9999?`${Math.floor(v/1000)}k`:v.toLocaleString('de-DE',{maximumFractionDigits:1});
const signed=v=>`${v>=0?'+':'−'}${Math.abs(v).toFixed(1).replace('.',',')}`;
export function resourcePages(state,p) {
 const extra=['electronics','medicine','goods','fuel'].filter(k=>state.tech.includes(RESOURCES[k].unlock)||p.stock[k]>0||p.buildings.some(b=>b.enabled&&(BUILDINGS[b.type].input?.[k]||BUILDINGS[b.type].output?.[k]))||state.fleets.some(f=>f.owner==='player'&&(f.cargo?.[k]>0||f.mission?.cargo?.resource===k)));
 return [{name:'Standard',keys:['food','energy','alloy','science']},{name:'Industrie',keys:['ore','crystal','optics','weapons']},...(extra.length?[{name:'Spezialgüter',keys:extra}]:[])];
}
export function assuredDeliveries(state,p,key) {
 const result=[];
 for(const f of state.fleets){
  const m=f.mission;if(f.owner!=='player'||!m||m.target!==p.id||p.owner!=='player'||m.remaining>30)continue;
  if(['transport','return-cargo'].includes(m.kind)&&m.cargo?.resource===key)result.push({day:m.remaining,amount:m.cargo.amount});
  if(m.kind==='circuit'&&f.route?.type==='circuit'){
   const stop=f.route.stops[m.stopIndex];let remaining=f.cargo?.[key]??0,total=0;
   for(const a of stop?.actions??[])if(a.kind==='unload'&&a.resource===key){const amount=Math.min(a.amount,remaining);total+=amount;remaining-=amount;}
   if(total)result.push({day:m.remaining,amount:total});
  }
 }
 return result;
}
export function resourceRisk(state,p,key,projection) {
 const predicted=projection.planets.find(q=>q.id===p.id);
 const stock=key==='credits'?state.credits:key==='science'?state.science:p.stock[key];
 const rate=key==='credits'?projection.budget.net:key==='science'?projection.budget.science:predicted.net[key]??0;
 if(predicted.lastReport?.missingResources?.includes(key))return {warning:true,days:0,rate};
 if(rate>=0)return {warning:false,days:null,rate};
 const incoming=assuredDeliveries(state,p,key);let balance=stock;
 for(let day=1;day<=30;day++){
  // Economy runs before arrivals: a ship arriving after today's shortage cannot erase it.
  balance+=rate;if(balance<=.000001)return {warning:true,days:day,rate};
  balance+=incoming.filter(d=>d.day===day).reduce((n,d)=>n+d.amount,0);
 }
 return {warning:false,days:incoming.length?null:Math.ceil(stock/-rate),rate};
}
export function renderResourceHUD(state,ui) {
 const p=hudPlanet(state,ui),projection=ui.projection??forecastDay(state),pages=resourcePages(state,p);
 const page=pages[(Number(ui.resourcePage)||0)%pages.length],keys=['credits',...page.keys];
 const all=['credits',...pages.flatMap(p=>p.keys)];
 const hiddenWarning=all.some(k=>!keys.includes(k)&&resourceRisk(state,p,k,projection).warning);
 return `<div class="resource-bank" title="Vorräte auf ${esc(p.name)}">${keys.map(k=>{
  const risk=resourceRisk(state,p,k,projection),amount=k==='credits'?state.credits:k==='science'?state.science:p.stock[k],label=k==='credits'?'Credits':k==='science'?'Forschung':RESOURCES[k].name;
  const runway=risk.warning?risk.days===0?' · Mangel':` · ${risk.days} T`:'';
  return `<div class="resource-pill ${risk.warning?'warning':''}" data-resource="${k}" aria-label="${label}: ${number(amount)}, ${signed(risk.rate)} pro Spieltag${runway}"><div class="resource-top">${icon(k,15)}<span class="resource-value">${number(amount)}</span></div><div class="resource-label">${label}${runway}</div><div class="resource-trend ${risk.rate<0?'negative':''}">${signed(risk.rate)}${k==='credits'?' ¢':''}<span>/T</span></div></div>`;
 }).join('')}</div><span class="resource-switch ${hiddenWarning?'warning':''}" aria-label="${page.name}; ${hiddenWarning?'Engpass auf einer anderen Seite; ':''}antippen zum Wechseln">${(Number(ui.resourcePage)||0)%pages.length+1}/${pages.length} ↔${hiddenWarning?' !':''}</span>`;
}
