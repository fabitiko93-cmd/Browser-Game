import { realmAtWar } from './realm-relations.js';
export function ordinaryDemand(state,planet) {
  const tech=planet.owner==='player'?state.tech:state.factions?.[planet.owner]?.tech??[];
  return {energy:planet.population*.015,alloy:planet.population*.003,weapons:planet.population*.003*(realmAtWar(state,planet.owner)?3:1),electronics:tech.includes('computing')?planet.population*.003:0};
}
