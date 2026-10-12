import { BUILDINGS, SHIPS } from './data.js';
import { BASE_PRICES } from './development-data.js';
import { workforce, productionFactor } from './economy.js';
import { policyEffects } from './governance.js';
import { technologyEffects } from './technology.js';
import { marketDemand, marketMidpoint } from './trade.js';
import { portKnown } from './intelligence.js';
import { canTrade, realmAtWar } from './realm-relations.js';
import { realmBalance } from './realm-ai.js';

const worlds = (state, owner) => state.planets.filter(p => p.owner === owner && !p.destroyed);
export const militaryCapacity = (state, owner) => {
  const doctrine = state.galaxy?.strategies[owner]?.doctrine;
  return Math.min(12, (realmAtWar(state, owner) ? 8 : doctrine === 'expansion' ? 6 : doctrine === 'security' ? 4 : 2) + Math.max(0, worlds(state, owner).length - 1));
};
export const commerceCapacity = (state, owner) => Math.min(3, state.galaxy?.strategies[owner]?.doctrine === 'trade' ? 2 + Number(worlds(state, owner).length > 1) : Math.max(1, worlds(state, owner).length - 1));
export function plannedUpkeep(state, owner) {
  const e = policyEffects(state, owner), t = technologyEffects(state, owner);
  return worlds(state, owner).reduce((n, p) => n + p.buildings.filter(b => b.enabled && b.remaining > 0).reduce((a, b) => a + BUILDINGS[b.type].upkeep * e.upkeep * t.buildingUpkeep, 0) + p.queues.reduce((a, q) => a + (SHIPS[q.type].upkeep ?? 1) * e.fleetUpkeep * t.fleetUpkeep, 0), 0);
}
export function investmentAllowed(state, owner, cost, upkeep = 0, risk = false) {
  const cash = state.factions[owner]?.credits ?? -1;
  const net = realmBalance(state, owner) - plannedUpkeep(state, owner) - upkeep;
  // A financed campaign may use reserves for a small temporary deficit; civilian expansion needs a surplus.
  return cash >= cost + 180 + Math.max(0, -net) * 120 && net >= (risk ? -2 : 1);
}
export function spareWorkers(state, p) {
  return workforce(state, p) - p.buildings.filter(b => b.enabled).reduce((n, b) => n + BUILDINGS[b.type].workers, 0);
}
function exportBuffer(state, p, key) {
  for (const target of state.planets) {
    if (!target.owner || target.owner === p.owner || !canTrade(state, p.owner, target.owner)) continue;
    if (portKnown(state, target, p.owner) && marketMidpoint(state, target, key) >= BASE_PRICES[key] * .9) return 80;
  }
  return 0;
}
export function productionTarget(state, p, key) {
  const reserve = { food:80, energy:100, ore:70, alloy:180, crystal:50, optics:55, weapons:90, electronics:40, medicine:12, goods:30, fuel:35 }[key] ?? 30;
  const fleets = state.fleets.filter(f => f.owner === p.owner).length;
  return Math.max(reserve, marketDemand(state, p, key) * 75, key === 'energy' ? fleets * 28 : 0) + exportBuffer(state, p, key);
}
export function productionWanted(state, p, type) {
  const def = BUILDINGS[type];
  if (!Object.keys(def.output ?? {}).length) return true;
  const e = policyEffects(state, p.owner), t = technologyEffects(state, p.owner);
  return Object.entries(def.output).some(([key]) => {
    const demand = marketDemand(state, p, key);
    const potential = p.buildings.filter(b => b.enabled && BUILDINGS[b.type].output?.[key]).reduce((n, b) => n + BUILDINGS[b.type].output[key] * productionFactor(state, p, b, key, e, t), 0);
    const deficit = potential < demand * 1.1;
    return deficit || Boolean(exportBuffer(state, p, key) && p.stock[key] < productionTarget(state, p, key) * .5 && potential < demand + 3);
  });
}
export function manageProduction(state, p) {
  const owner = p.owner, index = Object.keys(state.factions).indexOf(owner);
  if (!p.lastReport || state.day % 12 !== index % 12) return;
  // Hysteresis keeps stocks useful without endlessly paying and staffing surplus factories.
  const excess = p.buildings.filter(b => b.enabled && !b.remaining && Object.keys(BUILDINGS[b.type].output ?? {}).length && Object.keys(BUILDINGS[b.type].output).every(key => p.stock[key] > productionTarget(state, p, key) * 1.2));
  const cut = excess.sort((a, b) => BUILDINGS[b.type].workers - BUILDINGS[a.type].workers || BUILDINGS[b.type].upkeep - BUILDINGS[a.type].upkeep)[0];
  if (cut) { cut.enabled = false; cut.status = 'pausiert'; }
  const ships = state.fleets.filter(f => f.owner === owner), doctrine = state.galaxy.strategies[owner].doctrine;
  const military = ships.filter(f => SHIPS[f.type].strength > 0).length;
  const yardWanted = p.queues.length || military < militaryCapacity(state, owner) || ships.filter(f => f.type === 'freighter').length < commerceCapacity(state, owner) || ships.every(f => f.type !== 'scout') || worlds(state, owner).length < 3 && ['settlement', 'expansion'].includes(doctrine);
  const paused = p.buildings.filter(b => !b.enabled && !b.remaining).sort((a, b) => Number(b.type === 'shipyard' && yardWanted) - Number(a.type === 'shipyard' && yardWanted));
  for (const b of paused) {
    const d = BUILDINGS[b.type], essential = d.output?.food || d.output?.energy;
    const produces = Object.keys(d.output ?? {}).length > 0;
    const wanted = produces ? Object.keys(d.output).some(key => p.stock[key] < productionTarget(state, p, key) * .6) : b.type !== 'shipyard' || yardWanted;
    const upkeep = d.upkeep * policyEffects(state, owner).upkeep * technologyEffects(state, owner).buildingUpkeep;
    const financedOperation = state.factions[owner].credits >= 180 + Math.max(0, upkeep - realmBalance(state, owner)) * 90;
    const affordable = produces ? financedOperation : investmentAllowed(state, owner, 0, upkeep, Boolean(b.type === 'shipyard' && ['security', 'expansion'].includes(doctrine)));
    if (!wanted || !essential && spareWorkers(state, p) < d.workers || !essential && !affordable) continue;
    if (Object.entries(d.input ?? {}).some(([key, amount]) => p.stock[key] < amount * 2)) continue;
    b.enabled = true; b.status = 'aktiv'; break;
  }
}
