import { canTrade, relationBetween } from './realm-relations.js';
import { RESOURCE_KEYS, SHIPS } from './data.js';
import { getPlanet, uid } from './state.js';
import { marketMidpoint, marketTarget } from './trade.js';
import { portKnown, observePlanet } from './intelligence.js';
import { buildShip, departureFuel, fleetTravelDays } from './fleets.js';

export function finishCommerce(state, fleet, mission, target) {
  const previous=getPlanet(state,mission.source), origin=previous&&!previous.destroyed&&previous.owner===fleet.owner?previous:state.planets.find(p=>p.owner===fleet.owner&&!p.destroyed), key=mission.cargo.resource;
  if(mission.kind==='resupply'){if(target.owner===fleet.owner&&!target.destroyed)target.stock[key]+=mission.cargo.amount;else fleet.cargo[key]+=mission.cargo.amount;}
  else if(target.owner===mission.buyer&&!target.destroyed&&state.factions[target.owner]&&canTrade(state,fleet.owner,target.owner)){
    const buyer=state.factions[target.owner],seller=state.factions[fleet.owner];
    const price=marketMidpoint(state,target,key)*.9;
    const amount=Math.min(mission.cargo.amount,Math.max(0,buyer.credits-180)/price,Math.max(0,marketTarget(state,target,key,35)-target.stock[key]));
    if(amount>0){target.stock[key]+=amount;buyer.credits-=amount*price;seller.credits+=amount*price;fleet.cargo[key]+=mission.cargo.amount-amount;}
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
      for(const target of planets.filter(p=>p.id!==origin.id))for(const key of RESOURCE_KEYS){
        const surplus=Math.max(0,origin.stock[key]-marketTarget(state,origin,key)),need=Math.max(0,marketTarget(state,target,key)-target.stock[key]),amount=Math.min(SHIPS.freighter.cargo,surplus,need),fuel=departureFuel(state,origin,target,owner)*2;
        if(amount>=8&&origin.stock.energy>=fuel+(key==='energy'?amount:0)){const days=fleetTravelDays(state,origin,target,[f]);offers.push({target,key,amount,fuel,days,value:amount*marketMidpoint(state,target,key)/days*2,internal:true});}
      }
      for(const target of state.planets.filter(p=>p.owner&&p.owner!=='player'&&p.owner!==owner&&!p.destroyed&&portKnown(state,p,owner)&&canTrade(state,owner,p.owner))){
        if(state.factions[target.owner].credits<=30)continue;
        for(const key of RESOURCE_KEYS){
          const reserve=marketTarget(state,origin,key,20);
          const surplus=Math.max(0,origin.stock[key]-reserve);
          // A buyer's public order is observable; hidden inventories or defenses aren't copied into archives.
          const bid=Math.max(0,marketTarget(state,target,key,25)-target.stock[key]);
          const amount=Math.min(SHIPS.freighter.cargo,surplus,bid,Math.max(0,state.factions[target.owner].credits-180)/marketMidpoint(state,target,key));
          const fuel=departureFuel(state,origin,target,owner)*2;
          if(amount<8||origin.stock.energy<fuel+(key==='energy'?amount:0))continue;
          const days=fleetTravelDays(state,origin,target,[f]);
          const value=amount*marketMidpoint(state,target,key)/(days*2);
          offers.push({target,key,amount,fuel,days,value});
        }
      }
      const offer=offers.sort((a,b)=>b.value-a.value)[0];if(!offer)continue;
      origin.stock[offer.key]-=offer.amount;origin.stock.energy-=offer.fuel;
      f.mission={group:uid(state,'commerce'),kind:offer.internal?'resupply':'commerce',source:origin.id,target:offer.target.id,buyer:offer.target.owner,remaining:offer.days,total:offer.days,cargo:{resource:offer.key,amount:offer.amount}};
    }
    if(state.day%30!==Object.keys(state.factions).indexOf(owner)%30||freighters.length||planets.some(p=>p.queues.some(q=>q.type==='freighter')))continue;
    const port=planets.find(p=>p.buildings.some(b=>b.type==='shipyard'&&b.enabled&&b.status==='aktiv'));
    if(port&&faction.credits>250)buildShip(state,port,'freighter',owner);
  }
}
