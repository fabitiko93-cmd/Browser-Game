import { technologyEffects } from './technology.js';
import { policyEffects } from './governance.js';
import { BUILDINGS, IDEOLOGIES, FACTIONS, GRID, RESOURCE_KEYS } from './data.js';
import { canAfford, pay, uid, terrainAt, log } from './state.js';

export function housing(state, planet) { return planet.buildings.filter(b => b.type === 'habitat' && b.remaining <= 0 && b.enabled).reduce((n, b) => n + BUILDINGS[b.type].housing * technologyEffects(state, planet.owner).housing, 0); }
export function workforce(state, planet) {
  const regime = IDEOLOGIES[planet.owner === 'player' ? state.player.ideology : FACTIONS[planet.owner]?.ideology ?? 'democracy'];
  return Math.floor(planet.population * .7 * regime.workers * policyEffects(state, planet.owner).workers * technologyEffects(state, planet.owner).workers);
}
export function placeBuilding(state, planet, type, x, y) {
  const def = BUILDINGS[type];
  if (!Object.hasOwn(BUILDINGS, type) || !planet || planet.owner !== 'player') return 'Hier kannst du nicht bauen.';
  if (def.requiredTech && !state.tech.includes(def.requiredTech)) return 'Die erforderliche Basentechnologie fehlt.';
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= GRID.width || y >= GRID.height) return 'Wähle eine Baufläche.';
  if (['water', 'cliff', 'void'].includes(terrainAt(planet, x, y))) return 'Diese Fläche ist nicht bebaubar.';
  if (planet.buildings.some(b => b.x === x && b.y === y)) return 'Diese Fläche ist bereits bebaut.';
  if (!canAfford(state, planet, def.cost)) return 'Es fehlen Baumaterial oder Credits auf diesem Planeten.';
  pay(state, planet, def.cost);
  planet.buildings.push({ id: uid(state, 'b'), type, x, y, remaining: def.days, enabled: true, status: 'Bau' });
  log(state, `${planet.name}: ${def.name} wird gebaut.`);
  return null;
}
export function demolish(state, planet, id) {
  if (planet?.owner !== 'player') return 'Dieser Planet gehört dir nicht.';
  const b = planet.buildings.find(b => b.id === id);
  if (!b) return 'Gebäude nicht gefunden.';
  const def = BUILDINGS[b.type];
  for (const [k, v] of Object.entries(def.cost)) { if (k !== 'credits') planet.stock[k] += v * .5; }
  planet.buildings = planet.buildings.filter(b => b.id !== id);
  log(state, `${planet.name}: ${def.name} abgebaut. Die Hälfte der Materialien wurde zurückgewonnen.`);
  return null;
}
export function simulatePlanet(state, planet, options = {}) {
  if (!planet.owner) return;
  const regime = IDEOLOGIES[planet.owner === 'player' ? state.player.ideology : FACTIONS[planet.owner].ideology];
  const effects = policyEffects(state, planet.owner);
  const tech = technologyEffects(state, planet.owner);
  const before = { ...planet.stock };
  const owned = planet.owner === 'player';
  let workers = workforce(state, planet), used = 0, science = 0, upkeep = 0;
  for (const b of planet.buildings) {
    if (b.remaining > 0) {
      b.remaining = Math.max(0, b.remaining - 1);
      if (b.remaining > 0) { b.status = 'Bau'; continue; }
    }
    if (!b.enabled) { b.status = 'pausiert'; continue; }
    const def = BUILDINGS[b.type];
    upkeep += def.upkeep * effects.upkeep * tech.buildingUpkeep;
    if (workers < def.workers) { b.status = 'Arbeitskräfte fehlen'; continue; }
    const inputs = Object.fromEntries(Object.entries(def.input ?? {}).map(([k, v]) => [k, v * (k === 'energy' ? tech.inputEnergy * effects.inputEnergy : k === 'ore' ? tech.inputOre : k === 'alloy' ? tech.inputAlloy : 1)]));
    if (!Object.entries(inputs).every(([k, v]) => planet.stock[k] >= v)) { b.status = 'Rohstoffe fehlen'; continue; }
    workers -= def.workers; used += def.workers;
    for (const [k, v] of Object.entries(inputs)) planet.stock[k] -= v;
    for (const [k, v] of Object.entries(def.output ?? {})) {
      let factor = k === 'ore' ? planet.oreFactor : k === 'energy' && b.type === 'solar' ? planet.solarFactor : 1;
      factor *= tech[k] * (k === 'weapons' ? effects.militaryProduction : effects.civilianProduction);
      planet.stock[k] += v * factor * effects.production;
    }
    science += (def.science ?? 0) * regime.science * effects.science * tech.science;
    b.status = 'aktiv';
  }
  const demand = planet.population * .05 * effects.foodDemand * tech.foodDemand;
  const fed = Math.min(demand, planet.stock.food);
  planet.stock.food = Math.max(0, planet.stock.food - demand);
  const crowded = planet.population > housing(state, planet);
  const tax = owned ? state.player.tax : .16;
  const target = Math.max(5, Math.min(95, 72 + regime.happiness + effects.happiness - (tax - .16) * 160 - (fed < demand ? 35 : 0) - (crowded ? 18 : 0)));
  planet.happiness += (target - planet.happiness) * .08;
  if (!crowded && fed >= demand && planet.happiness > 50) planet.population = Math.min(housing(state, planet), planet.population + .45 * effects.growth * tech.growth);
  if (fed < demand) planet.population = Math.max(1, planet.population - .3);
  const income = planet.population * tax * regime.tax * effects.tax * tech.tax;
  if (owned && !options.deferBudget) {
    const delta = income - upkeep;
    state.credits = Math.max(0, state.credits + delta);
    if (state.credits < 1 && delta < 0) planet.happiness = Math.max(0, planet.happiness - 1);
    state.science += science;
  }
  planet.net = Object.fromEntries(RESOURCE_KEYS.map(k => [k, planet.stock[k] - before[k]]));
  planet.lastReport = { workers: used, available: workforce(state, planet), housing: housing(state, planet), income, upkeep, science, demand, fed, bankrupt: owned && state.credits < 1 };
}
export { forecast } from './budget.js';
