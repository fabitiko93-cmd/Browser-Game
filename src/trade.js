import { policyEffects } from './governance.js';
import { technologyEffects } from './technology.js';
import { BUILDINGS, RESOURCE_KEYS } from './data.js';
import { BASE_PRICES } from './development-data.js';
import { serviceCount } from './infrastructure.js';
import { getPlanet, log, uid } from './state.js';
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export function marketDemand(state,p,key) {
 if(p.lastReport?.demandByResource)return p.lastReport.demandByResource[key]??0;
 const effects=policyEffects(state,p.owner),tech=technologyEffects(state,p.owner);
 let demand=p.buildings.filter(b=>b.enabled&&b.remaining<=0).reduce((n,b)=>n+(BUILDINGS[b.type].input?.[key]??0)*(key==='energy'?tech.inputEnergy*effects.inputEnergy:1),0);
 if(key==='food')demand+=p.population*.05*effects.foodDemand*tech.foodDemand;
 if(key==='energy')demand+=p.population*.015;
 if(key==='alloy'||key==='weapons')demand+=p.population*.003;
 if(key==='goods'&&state.factions?.[p.owner]?.tech.includes('consumerCulture'))demand+=p.population*.008;
 if(key==='medicine'&&state.factions?.[p.owner]?.tech.includes('biomedicine'))demand+=p.population*.002;
 return demand;
}
export function marketPrice(state,p,key,side='sell',extraStock=0) {
 const daily=marketDemand(state,p,key),target=Math.max(25,daily*45);
 const scarcity=clamp(1.1+(target-p.stock[key]-extraStock)/target*.65,.45,1.85);
 const midpoint=BASE_PRICES[key]*scarcity;
 if(side==='buy')return midpoint*1.12;
 const partnership=state.relations[p.owner]?.cooperation&&!state.relations[p.owner]?.embargo?1.12:1;
 const terms=Math.min(.92,.7*policyEffects(state).trade*technologyEffects(state).trade*(1+.04*Math.min(1,state.planets.filter(q=>q.owner==='player').reduce((n,q)=>n+serviceCount(q,'trade'),0))))*partnership;
 return midpoint*terms;
}
export function exportPrice(state,resource,faction) {
 const p=state.planets.find(p=>p.owner===faction&&!p.destroyed);
 return p?marketPrice(state,p,resource):0;
}
export function tradingAccess(state,p) { return Boolean(p&&!p.destroyed&&p.owner&&p.owner!=='player'&&state.relations[p.owner]?.trade&&!state.relations[p.owner]?.war&&!state.relations[p.owner]?.embargo); }
function affordable(limit,cash,totalFor){
 if(totalFor(limit)<=cash)return limit;
 let lo=0,hi=limit;for(let i=0;i<36;i++){const mid=(lo+hi)/2;if(totalFor(mid)<=cash)lo=mid;else hi=mid;}return lo;
}
export function quoteSale(state,p,key,quantity) {
 if(!RESOURCE_KEYS.includes(key)||!tradingAccess(state,p)||!Number.isFinite(quantity)||quantity<=0)return {amount:0,price:0,total:0};
 const room=Math.max(0,Math.max(30,marketDemand(state,p,key)*60)*(1+.25*Math.min(1,serviceCount(p,'trade')))-p.stock[key]);
 const average=a=>(marketPrice(state,p,key)+marketPrice(state,p,key,'sell',a))/2;
 const amount=affordable(Math.min(quantity,room),state.factions[p.owner]?.credits??0,a=>a*average(a));
 return {amount,price:average(amount),total:amount*average(amount)};
}
export function quotePurchase(state,p,key,quantity) {
 if(!RESOURCE_KEYS.includes(key)||!tradingAccess(state,p)||!Number.isFinite(quantity)||quantity<=0)return {amount:0,price:0,total:0};
 const average=a=>(marketPrice(state,p,key,'buy')+marketPrice(state,p,key,'buy',-a))/2;
 const amount=affordable(Math.min(quantity,p.stock[key]),state.credits,a=>a*average(a));
 return {amount,price:average(amount),total:amount*average(amount)};
}
export function recordTrade(state,p,key,amount,revenue=0,cost=0) {
 state.tradeLedger??=[];state.tradeLedger.unshift({day:state.day,planet:p.id,resource:key,amount,revenue,cost});state.tradeLedger=state.tradeLedger.slice(0,40);
}
export function sellGoods(state,p,key,quantity,minPrice=0) {
 if(!RESOURCE_KEYS.includes(key)||!tradingAccess(state,p)||!Number.isFinite(quantity)||quantity<=0||!Number.isFinite(minPrice)||minPrice<0)return {amount:0,total:0};
 let remaining=quantity,total=0;
 for(const c of state.contracts??[]){
  if(c.planet!==p.id||c.faction!==p.owner||c.resource!==key||c.until<=state.day||c.price<minPrice||c.escrow<=0)continue;
  const amount=Math.min(remaining,c.quantity-c.delivered,c.escrow/c.price);
  if(amount<=0)continue;c.delivered+=amount;c.escrow=Math.max(0,c.escrow-amount*c.price);remaining-=amount;total+=amount*c.price;p.stock[key]+=amount;
 }
 const q=quoteSale(state,p,key,remaining);
 if(q.amount>0&&q.price>=minPrice){p.stock[key]+=q.amount;state.factions[p.owner].credits=Math.max(0,state.factions[p.owner].credits-q.total);remaining-=q.amount;total+=q.total;}
 state.credits+=total;
 const amount=quantity-remaining;if(amount>0)recordTrade(state,p,key,amount,total);
 return {amount,total};
}
export function purchaseGoods(state,p,key,quantity,maxPrice=Infinity) {
 const q=quotePurchase(state,p,key,quantity);
 if(!q.amount||q.price>maxPrice)return {amount:0,total:0};
 p.stock[key]=Math.max(0,p.stock[key]-q.amount);state.credits=Math.max(0,state.credits-q.total);state.factions[p.owner].credits+=q.total;recordTrade(state,p,key,q.amount,0,q.total);return q;
}
export function createContract(state,planetId,resource,quantity) {
 const p=getPlanet(state,planetId);quantity=Number(quantity);
 if(!state.tech.includes('contracts'))return 'Benötigt: Planetare Vertragsnetze.';
 if(!tradingAccess(state,p)||!RESOURCE_KEYS.includes(resource))return 'Wähle einen erreichbaren Handelspartner und eine Ware.';
 if(!Number.isFinite(quantity)||quantity<1||quantity>2000)return 'Vertragsmenge muss zwischen 1 und 2000 liegen.';
 if((state.contracts??[]).filter(c=>c.until>state.day).length>=20)return 'Höchstens 20 laufende Lieferverträge.';
 if(state.contracts.some(c=>c.planet===planetId&&c.resource===resource&&c.until>state.day))return 'Für diese Ware besteht hier bereits ein Vertrag.';
 if(quantity>Math.max(10,marketDemand(state,p,resource)*30))return 'Diese Vertragsmenge übersteigt den regelmäßigen Bedarf des Partners.';
 const price=marketPrice(state,p,resource),cost=price*quantity;
 if(state.factions[p.owner].credits<cost)return 'Der Handelspartner kann die erste Lieferperiode nicht finanzieren.';
 state.factions[p.owner].credits-=cost;
 state.contracts.push({id:uid(state,'contract'),planet:planetId,faction:p.owner,resource,quantity,price,delivered:0,escrow:cost,periodStart:state.day,until:state.day+180,fulfilled:0});
 log(state,`${p.name}: Liefervertrag über ${quantity} Einheiten je 30 Tage, ${price.toFixed(2)} Credits je Einheit; 180 Tage Laufzeit.`,'politics');return null;
}
export function cancelContract(state,id) {
 const c=state.contracts.find(c=>c.id===id);if(!c)return 'Dieser Vertrag besteht nicht.';
 const p=getPlanet(state,c.planet);if(state.factions[c.faction]){state.factions[c.faction].credits+=c.escrow;state.relations[c.faction].score=Math.max(-100,state.relations[c.faction].score-3);}
 state.contracts=state.contracts.filter(q=>q!==c);return null;
}
export function tickContracts(state) {
 for(const c of [...state.contracts]){
  const p=getPlanet(state,c.planet),f=state.factions[c.faction];
  if(p.owner!==c.faction||!tradingAccess(state,p)||state.day>=c.until){if(f)f.credits+=c.escrow;state.contracts=state.contracts.filter(q=>q!==c);continue;}
  if(state.day<c.periodStart+30)continue;
  const r=state.relations[p.owner];
  if(c.escrow+c.delivered*c.price>0){if(c.delivered>=c.quantity*.9){r.score=Math.min(100,r.score+4);c.fulfilled++;}else r.score=Math.max(-100,r.score-2);}
  f.credits+=c.escrow;c.periodStart=state.day;c.delivered=0;
  c.escrow=Math.min(f.credits,c.quantity*c.price);f.credits-=c.escrow;
 }
}
