import { RESOURCE_KEYS } from './data.js';
import { getPlanet } from './state.js';
import { marketTarget, marketMidpoint, recordTrade } from './trade.js';
import { policyEffects } from './governance.js';

export const emptyTradeBoard = (day=0, exports=false) => ({exports, budget:0, escrow:0, periodStart:day, orders:{}});
export function setTradeBoard(state,id,key,target,maxPrice,budget,exports) {
 const p=getPlanet(state,id);target=Number(target);maxPrice=Number(maxPrice);budget=Number(budget);
 if(p?.owner!=='player'||p.destroyed||!RESOURCE_KEYS.includes(key))return 'Wähle einen eigenen Handelsplatz und ein Gut.';
 if(!Number.isFinite(target)||target<0||target>10000||!Number.isFinite(maxPrice)||maxPrice<=0||maxPrice>100||!Number.isFinite(budget)||budget<0||budget>10000)return 'Ungültiger Zielbestand, Höchstpreis oder Monatsbetrag.';
 const b=p.tradeBoard??emptyTradeBoard(state.day),available=state.credits+b.escrow;
 if(budget>Math.max(0,available))return 'Der Monatsbetrag muss vollständig aus der Staatskasse reserviert werden können.';
 state.credits=available-budget;b.exports=Boolean(exports);b.budget=budget;b.escrow=budget;b.periodStart=state.day;
 if(target)b.orders[key]={target,maxPrice};else delete b.orders[key];
 p.tradeBoard=b;return null;
}
export function tickTradeBoards(state) {
 for(const p of state.planets){const b=p.tradeBoard;if(!b)continue;
  if(p.owner!=='player'||p.destroyed){state.credits+=b.escrow;b.escrow=0;b.budget=0;b.exports=false;b.orders={};continue;}
  if(state.day<b.periodStart+30)continue;
  state.credits+=b.escrow;b.escrow=0;b.periodStart=state.day;
  const funding=Math.min(b.budget,Math.max(0,state.credits-180));state.credits-=funding;b.escrow=funding;
 }
}
export function playerBid(state,p,key) {
 const b=p.tradeBoard,order=b?.orders[key];
 if(p.owner!=='player'||p.destroyed||!order||!b.escrow)return {amount:0,price:0};
 const price=Math.min(order.maxPrice,marketMidpoint(state,p,key)*.9);
 return {price,amount:Math.max(0,Math.min(order.target-p.stock[key],b.escrow/price))};
}
export function playerAsk(state,p,key) {
 if(p.owner!=='player'||p.destroyed||!p.tradeBoard?.exports)return {amount:0,price:0};
 const floor={alloy:120,crystal:40,optics:40,weapons:40,electronics:30,medicine:30,goods:30,fuel:30}[key]??0;
 const reserve=Math.max(floor,marketTarget(state,p,key,30),p.tradeBoard.orders[key]?.target??0);
 const price=marketMidpoint(state,p,key)*Math.max(.7,Math.min(1.5,policyEffects(state).trade));
 return {price,amount:Math.max(0,p.stock[key]-reserve)};
}
export function receivePublicOrder(state,p,key,quantity,seller) {
 const q=playerBid(state,p,key),amount=Math.min(quantity,q.amount),total=amount*q.price;
 if(!amount)return 0;
 p.stock[key]+=amount;p.tradeBoard.escrow=Math.max(0,p.tradeBoard.escrow-total);state.factions[seller].credits+=total;
 state.relations[seller].score=Math.min(100,state.relations[seller].score+1);recordTrade(state,p,key,amount,0,total);return amount;
}
export function buyPublicSurplus(state,p,key,quantity,buyer,maxPrice=100) {
 const q=playerAsk(state,p,key);if(q.price>maxPrice)return {amount:0,total:0};
 const amount=Math.max(0,Math.min(quantity,q.amount,(state.factions[buyer].credits-180)/q.price)),total=amount*q.price;
 if(amount){p.stock[key]-=amount;state.factions[buyer].credits-=total;state.credits+=total;state.relations[buyer].score=Math.min(100,state.relations[buyer].score+1);recordTrade(state,p,key,amount,total);}
 return {amount,total};
}
