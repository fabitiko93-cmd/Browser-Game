import { FACTIONS, SYSTEMS } from './data.js';
import { getPlanet, uid, log } from './state.js';
import { technologyEffects } from './technology.js';
import { chartSystem, observePlanet, knowledgeOf, knownTargets, systemKnown } from './intelligence.js';
import { orderFleet, buildShip, fleetTravelDays, fleetUpkeep, maintainFleets } from './fleets.js';

export function exploreSystem(state, fleetId, systemId, owner = 'player') {
  const system = SYSTEMS.find(s => s.id === systemId);
  if (!system?.uncharted || systemKnown(state,systemId,owner)) return 'Dieses System ist bereits kartiert.';
  const target = state.planets.find(p => p.system === systemId);
  return orderFleet(state,[fleetId],target?.id,'explore',{owner});
}
const roll = (id, day, seed) => [...`${id}:${day}:${seed}`].reduce((n,c) => (Math.imul(n,31)+c.charCodeAt(0))>>>0,2166136261)%100;
function returnScout(state, fleet, target, source) {
  const home = source && !source.destroyed ? source : state.planets.find(p => p.owner === fleet.owner && !p.destroyed);
  if (!home || home.id === target.id) return;
  const days = fleetTravelDays(state,target,home,[fleet]);
  fleet.mission = { group:uid(state,'scout-return'),kind:'move',source:target.id,target:home.id,remaining:days,total:days,cargo:null };
}
export function finishScout(state, mission, fleets, target) {
  for (const f of fleets) {
    if (f.type !== 'scout') continue;
    const r = f.owner === 'player' ? state.relations[target.owner] : target.owner === 'player' ? state.relations[f.owner] : null;
    const hostile = target.owner && target.owner !== f.owner && (r?.war || r?.score <= -35);
    // Detection/attack is resolved using the defender's real resources; knowledge is sent only by survivors.
    if (hostile && target.stock.energy >= 3 && target.defense > 0) {
      target.stock.energy -= 3;
      if (roll(f.id,state.day,target.seed) < (r.war ? 45 : 25)) {
        state.fleets = state.fleets.filter(q => q.id !== f.id);
        if (f.owner === 'player') log(state, `${f.name}: Kontakt abgebrochen. Keine verwertbare Beobachtung übertragen.`, 'warning');
        continue;
      }
    }
    chartSystem(state,f.owner,target.system,getPlanet(state,mission.source)?.system);
    const previous = knowledgeOf(state,target,f.owner).occupancy;
    observePlanet(state,f.owner,target,'scout');
    if (f.owner === 'player') {
      const first = !state.surveys.includes(target.id);
      if (first) { state.surveys.push(target.id); state.science += 45*technologyEffects(state).survey; }
      log(state, `${mission.kind==='explore'?`${SYSTEMS.find(s=>s.id===target.system).name}: Flugroute kartiert. `:''}${target.name}: ${target.owner?'bewohnt – Abstand gehalten':'unbewohnt'}${first?' · Forschung gewonnen':''}.`, 'success', 'research');
    } else if (!previous || previous.source !== 'scout') state.factions[f.owner].science += 45*technologyEffects(state,f.owner).survey;
    if (target.owner && target.owner !== f.owner) returnScout(state,f,target,getPlanet(state,mission.source));
  }
}
export function tickExplorationAI(state) {
  for (const [owner,faction] of Object.entries(state.factions)) {
    const own = state.planets.filter(p => p.owner===owner&&!p.destroyed);
    if (!own.length) continue;
    const book=state.intelligence[owner]; if (state.day<book.nextMission) continue;
    book.nextMission=state.day+36;
    const home=own.find(p=>p.buildings.some(b=>b.type==='shipyard'&&b.status==='aktiv'))??own[0];
    const knownEmpty=knownTargets(state,owner).filter(p=>p.inhabited===false&&!p.destroyed);
    if(faction.tech.includes('habitats')&&own.length<3&&faction.credits>500&&knownEmpty.length&&!state.fleets.some(f=>f.owner===owner&&f.type==='colony')&&!own.some(p=>p.queues.some(q=>q.type==='colony')))buildShip(state,home,'colony',owner);
    const colonist=state.fleets.find(f=>f.owner===owner&&f.type==='colony'&&!f.mission&&f.supply>=60);
    if(colonist&&knownEmpty.length){const choice=knownEmpty.find(p=>p.system===home.system)??knownEmpty[0];orderFleet(state,[colonist.id],choice.id,'settle',{owner});}
    const ships=state.fleets.filter(f=>f.owner===owner);
    const analysis=faction.tech.includes('planetaryAnalysis');
    const wanted=ships.some(f=>f.type==='scout')&&analysis?'probe':'scout';
    if (!ships.some(f=>f.type===wanted)&&!own.some(p=>p.queues.some(q=>q.type===wanted))) buildShip(state,home,wanted,owner);
    for (const ship of ships.filter(f=>['scout','probe'].includes(f.type)&&!f.mission&&f.supply>=60)) {
      if (ship.planetId!==home.id) { orderFleet(state,[ship.id],home.id,'move',{owner}); continue; }
      const unknown=SYSTEMS.find(s=>s.uncharted&&!systemKnown(state,s.id,owner));
      if (ship.type==='scout'&&unknown) { exploreSystem(state,ship.id,unknown.id,owner); continue; }
      const targets=knownTargets(state,owner).filter(p=>!p.destroyed&&p.id!==home.id);
      if (ship.type==='probe') {
        const target=targets.find(p=>!p.knowledge.geology);
        if(target) orderFleet(state,[ship.id],target.id,'analyze',{owner});
      } else if(ship.type==='scout') {
        const target=targets.find(p=>!p.knowledge.occupancy || p.knowledge.occupancy.source!=='own'&&state.day-p.knowledge.occupancy.day>=90);
        if(target) orderFleet(state,[ship.id],target.id,'survey',{owner});
      }
    }
  }
}
