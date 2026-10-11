import { canTrade, relationBetween } from './realm-relations.js';
import { RESOURCE_KEYS, SHIPS } from './data.js';
import { getPlanet, uid } from './state.js';
import { marketMidpoint, marketTarget, marketPrice } from './trade.js';
import { portKnown, observePlanet } from './intelligence.js';
import { buildShip, departureFuel, fleetTravelDays } from './fleets.js';
import { playerBid, playerAsk, receivePublicOrder, buyPublicSurplus } from './trade-board.js';
import { recordBlocDelivery } from './power.js';
import { orderRelic, ruinKnown } from './ruins.js';
import { locationsOf } from './world.js';

export function finishCommerce(state, fleet, mission, target) {
  const previous=getPlanet(state,mission.source), origin=previous&&!previous.destroyed&&previous.owner===fleet.owner?previous:state.planets.find(p=>p.owner===fleet.owner&&!p.destroyed), key=mission.intent?.resource??mission.cargo.resource;
  if(mission.mode==='purchase'){
    if(target.owner==='player'&&!target.destroyed&&canTrade(state,fleet.owner,'player')){
      const purchase=buyPublicSurplus(state,target,key,mission.intent.amount,fleet.owner,mission.intent.maxPrice);fleet.cargo[key]+=purchase.amount;
      if(purchase.amount)recordBlocDelivery(state,'player',fleet.owner,key,purchase.amount);
    }
  }
  else if(target.owner==='player'&&mission.kind==='commerce'&&canTrade(state,fleet.owner,'player')){
    const amount=receivePublicOrder(state,target,key,mission.cargo.amount,fleet.owner);fleet.cargo[key]+=mission.cargo.amount-amount;recordBlocDelivery(state,fleet.owner,'player',key,amount);
  }
  else if(mission.kind==='resupply'){if(target.owner===fleet.owner&&!target.destroyed)target.stock[key]+=mission.cargo.amount;else fleet.cargo[key]+=mission.cargo.amount;}
  else if(target.owner===mission.buyer&&!target.destroyed&&state.factions[target.owner]&&canTrade(state,fleet.owner,target.owner)){
    const buyer=state.factions[target.owner],seller=state.factions[fleet.owner];
    const price=marketPrice(state,target,key,'sell',0,fleet.owner);
    const amount=Math.min(mission.cargo.amount,Math.max(0,buyer.credits-180)/price,Math.max(0,marketTarget(state,target,key,35)-target.stock[key]));
    if(amount>0){target.stock[key]+=amount;buyer.credits-=amount*price;seller.credits+=amount*price;fleet.cargo[key]+=mission.cargo.amount-amount;recordBlocDelivery(state,fleet.owner,target.owner,key,amount);}
    else fleet.cargo[key]+=mission.cargo.amount;
    if(amount>0){const r=relationBetween(state,fleet.owner,target.owner);r.score=Math.min(100,r.score+1);}
    observePlanet(state,fleet.owner,target,'visit');
  }else fleet.cargo[key]+=mission.cargo.amount;
  if(origin&&origin.id!==target.id){
    const extraFuel=Math.max(0,departureFuel(state,target,origin,fleet.owner)-departureFuel(state,target,previous,fleet.owner));
    if(fleet.supply<extraFuel)return;fleet.supply-=extraFuel;
    const days=fleetTravelDays(state,target,origin,[fleet]);
    fleet.mission={group:uid(state,'commerce-return'),kind:'move',source:target.id,target:origin.id,remaining:days,total:days,cargo:null};
  }
}
export function tickForeignCommerce(state) {
  for(const [owner,faction] of Object.entries(state.factions)){
    const planets=state.planets.filter(p=>p.owner===owner&&!p.destroyed);
    if(!planets.length)continue;
    const freighters=state.fleets.filter(f=>f.owner===owner&&f.type==='freighter');
    for(const f of freighters.filter(f=>!f.mission)){
      const origin=getPlanet(state,f.planetId);
      if(origin.owner!==owner)continue;
      for(const key of RESOURCE_KEYS){origin.stock[key]+=f.cargo[key]??0;f.cargo[key]=0;}
      if(f.supply<55||faction.credits<=0||(f.tradeReady??0)>state.day)continue;
      f.tradeReady=state.day+20;
      const offers=[];
      for(const target of locationsOf(state).filter(p=>p.owner===owner&&!p.destroyed&&p.id!==origin.id))for(const key of RESOURCE_KEYS){
        const surplus=Math.max(0,origin.stock[key]-marketTarget(state,origin,key)),need=Math.max(0,marketTarget(state,target,key,target.anchor?100:30)-target.stock[key]),amount=Math.min(SHIPS.freighter.cargo,surplus,need),fuel=departureFuel(state,origin,target,owner)*2;
        if(amount>=8&&origin.stock.energy>=fuel+(key==='energy'?amount:0)){const days=fleetTravelDays(state,origin,target,[f]);offers.push({target,key,amount,fuel,days,value:amount*marketMidpoint(state,target,key)/days*2,internal:true});}
      }
      for(const target of state.planets.filter(p=>p.owner&&p.owner!==owner&&!p.destroyed&&portKnown(state,p,owner)&&canTrade(state,owner,p.owner))){
        for(const key of RESOURCE_KEYS){
          const reserve=marketTarget(state,origin,key,20);
          const surplus=Math.max(0,origin.stock[key]-reserve);
          // A buyer's public order is observable; hidden inventories or defenses aren't copied into archives.
          const price=marketPrice(state,target,key,'sell',0,owner),publicBid=target.owner==='player'?playerBid(state,target,key):{price,amount:Math.max(0,Math.min(marketTarget(state,target,key,25)-target.stock[key],(state.factions[target.owner].credits-180)/price))};
          const amount=Math.min(SHIPS.freighter.cargo,surplus,publicBid.amount);
          const fuel=departureFuel(state,origin,target,owner)*2;
          if(amount<8||origin.stock.energy<fuel+(key==='energy'?amount:0))continue;
          const days=fleetTravelDays(state,origin,target,[f]);
          const value=(amount*publicBid.price-fuel*.35)/(days*2);
          offers.push({target,key,amount,fuel,days,value});
        }
        if(target.owner==='player')for(const key of RESOURCE_KEYS){
          const ask=playerAsk(state,target,key),need=Math.max(0,marketTarget(state,origin,key,35)-origin.stock[key]),amount=Math.min(SHIPS.freighter.cargo,ask.amount,need,Math.max(0,faction.credits-180)/Math.max(.01,ask.price)),fuel=departureFuel(state,origin,target,owner)*2;
          if(amount<8||origin.stock.energy<fuel||ask.price>marketMidpoint(state,origin,key)*1.2)continue;
          const days=fleetTravelDays(state,origin,target,[f]),value=amount*marketMidpoint(state,origin,key)/(days*2);
          offers.push({target,key,amount,fuel,days,value,purchase:true,maxPrice:ask.price*1.05});
        }
      }
      const offer=offers.filter(o=>o.value>0).sort((a,b)=>b.value-a.value)[0];
      if(!offer){const relic=locationsOf(state).find(p=>ruinKnown(state,p,owner)&&p.ruin.status==='sealed'&&!p.destroyed&&(!p.owner||p.owner===owner)&&p.id!==origin.id);if(relic)orderRelic(state,f.id,relic.id,relic.owner===owner||relic.anchor?'restore':'salvage',owner);continue;}
      if(!offer.purchase)origin.stock[offer.key]-=offer.amount;origin.stock.energy-=offer.fuel;
      f.mission={group:uid(state,'commerce'),kind:offer.internal?'resupply':'commerce',source:origin.id,target:offer.target.id,buyer:offer.purchase?owner:offer.target.owner,remaining:offer.days,total:offer.days,cargo:offer.purchase?null:{resource:offer.key,amount:offer.amount},...(offer.purchase?{mode:'purchase',intent:{resource:offer.key,amount:offer.amount,maxPrice:offer.maxPrice}}:{})};
    }
    if(state.day%30!==Object.keys(state.factions).indexOf(owner)%30||freighters.length||planets.some(p=>p.queues.some(q=>q.type==='freighter')))continue;
    const port=planets.find(p=>p.buildings.some(b=>b.type==='shipyard'&&b.enabled&&b.status==='aktiv'));
    if(port&&faction.credits>250)buildShip(state,port,'freighter',owner);
  }
}
