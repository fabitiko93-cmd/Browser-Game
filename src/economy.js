import { financialCondition, essentialBuilding, commerceIncome } from './finance.js';
import { geologicalFactor, placementIssue } from './surface.js';
import { serviceCount, buildingBlock, orderedBuildings } from './infrastructure.js';
import { technologyEffects } from './technology.js';
import { policyEffects } from './governance.js';
import { BUILDINGS, IDEOLOGIES, FACTIONS, RESOURCE_KEYS } from './data.js';
import { canAfford, pay, uid, log } from './state.js';

export function productionFactor(state, planet, building, resource, effects = policyEffects(state, planet.owner), tech = technologyEffects(state, planet.owner)) {
  let factor = geologicalFactor(planet, building, resource) * (state.relations[planet.owner]?.embargo ? .85 : 1);
  for (const e of state.effects ?? []) if (e.planet === planet.id && e.until > state.day && (e.id === 'energyHarvest' && resource === 'energy' || e.id === 'factoryUpgrade' && resource === 'alloy')) factor *= e.id === 'energyHarvest' ? 1.2 : 1.15;
  const financial=financialCondition(state,planet.owner);
  return factor * (tech[resource === 'fuel' ? 'reactorFuel' : resource] ?? 1) * (resource === 'weapons' ? effects.militaryProduction : effects.civilianProduction) * effects.production * (essentialBuilding(building.type) ? 1 : financial.severe ? 0 : financial.production);
}
export function buildingPotential(state, planet, building) {
  return Object.fromEntries(Object.entries(BUILDINGS[building.type].output ?? {}).map(([k, v]) => [k, v * productionFactor(state, planet, building, k)]));
}

export function housing(state, planet) { return planet.buildings.filter(b => BUILDINGS[b.type].housing && b.remaining <= 0 && b.enabled).reduce((n, b) => n + BUILDINGS[b.type].housing * technologyEffects(state, planet.owner).housing, 0); }
export function workforce(state, planet) {
  const regime = IDEOLOGIES[planet.owner === 'player' ? state.player.ideology : FACTIONS[planet.owner]?.ideology ?? 'democracy'];
  return Math.floor(planet.population * .7 * regime.workers * (1 + .06 * Math.min(1, serviceCount(planet,'education'))) * policyEffects(state, planet.owner).workers * technologyEffects(state, planet.owner).workers);
}
export function placeBuilding(state, planet, type, x, y) {
  const def = BUILDINGS[type];
  if (!Object.hasOwn(BUILDINGS, type) || !planet || planet.owner !== 'player') return 'Hier kannst du nicht bauen.';
  if (def.requiredTech && !state.tech.includes(def.requiredTech)) return 'Die erforderliche Technologie fehlt.';
  const blocked=buildingBlock(state,planet,type);if(blocked)return blocked;
  const siteError = placementIssue(planet, x, y); if (siteError) return siteError;
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
  const financial = financialCondition(state, planet.owner);
  const owned = planet.owner === 'player';
  let workers = workforce(state, planet), used = 0, science = 0, upkeep = 0;
  const demandByResource=Object.fromEntries(RESOURCE_KEYS.map(k=>[k,0])), missingResources=new Set(), productionByResource=Object.fromEntries(RESOURCE_KEYS.map(k=>[k,0]));
  for (const b of orderedBuildings(planet)) {
    if (b.remaining > 0) {
      if (financial.crisis && !essentialBuilding(b.type)) { b.status = 'Bau wartet auf Finanzierung'; continue; }
      b.remaining = Math.max(0, b.remaining - 1);
      if (b.remaining > 0) { b.status = 'Bau'; continue; }
      if (planet.owner === 'player') log(state, `${planet.name}: ${BUILDINGS[b.type].name} fertiggestellt.`, 'success', 'build');
    }
    if (!b.enabled) { b.status = 'pausiert'; continue; }
    const def = BUILDINGS[b.type];
    if (financial.severe && !essentialBuilding(b.type)) { upkeep += def.upkeep * effects.upkeep * tech.buildingUpkeep * .25; b.status = 'Finanznotstand'; continue; }
    upkeep += def.upkeep * effects.upkeep * tech.buildingUpkeep;
    if (workers < def.workers) { b.status = 'Arbeitskräfte fehlen'; continue; }
    const inputs = Object.fromEntries(Object.entries(def.input ?? {}).map(([k, v]) => [k, v * (k === 'energy' ? tech.inputEnergy * effects.inputEnergy : k === 'ore' ? tech.inputOre : k === 'alloy' ? tech.inputAlloy : 1)]));
    for(const [k,v] of Object.entries(inputs))demandByResource[k]+=v;
    if (!Object.entries(inputs).every(([k, v]) => planet.stock[k] >= v)) { b.status = 'Rohstoffe fehlen';for(const [k,v] of Object.entries(inputs))if(planet.stock[k]<v)missingResources.add(k); continue; }
    workers -= def.workers; used += def.workers;
    for (const [k, v] of Object.entries(inputs)) planet.stock[k] -= v;
    for (const [k, v] of Object.entries(def.output ?? {})) {
      const output = v * productionFactor(state, planet, b, k, effects, tech); planet.stock[k] += output; productionByResource[k] += output;
    }
    science += (def.science ?? 0) * regime.science * effects.science * tech.science * financial.science;
    b.status = 'aktiv';
  }
  const civic=Math.min(1,serviceCount(planet,'civic')),health=Math.min(2,serviceCount(planet,'health'));
  const demand = planet.population * .05 * effects.foodDemand * tech.foodDemand * (civic?.95:1);
  demandByResource.food+=demand;
  const fed = Math.min(demand, planet.stock.food);
  planet.stock.food = Math.max(0, planet.stock.food - demand);
  if(fed<demand)missingResources.add('food');
  let living=0;planet.needs??=[];
  const ownerTech=owned?state.tech:state.factions?.[planet.owner]?.tech??[];
  for(const [key,unlock,rate] of [['goods','consumerCulture',.008],['medicine','biomedicine',.002]]){
   if(!ownerTech.includes(unlock)&&!planet.needs.includes(key)&&!planet.stock[key])continue;
   if(!planet.needs.includes(key))planet.needs.push(key);
   const ideology=owned?state.player.ideology:FACTIONS[planet.owner].ideology;
   const preference=key==='goods'?({democracy:1.3,monarchy:1.3,corporate:1.45,oligarchy:1.35,communism:.85})[ideology]??1:ideology==='theocracy'?1.3:1;
   const amount=planet.population*rate*preference;
   demandByResource[key]+=amount;const delivered=Math.min(amount,planet.stock[key]);planet.stock[key]-=delivered;
   living+=delivered>=amount?2:-4;if(delivered<amount)missingResources.add(key);
  }
  if(!owned){
   if(ownerTech.includes('computing')){const amount=planet.population*.003;demandByResource.electronics+=amount;planet.stock.electronics=Math.max(0,planet.stock.electronics-amount);if(planet.stock.electronics<amount)missingResources.add('electronics');}
   for(const [key,amount] of [['energy',planet.population*.015],['alloy',planet.population*.003],['weapons',planet.population*.003*(state.relations[planet.owner]?.war?3:1)]]){demandByResource[key]+=amount;planet.stock[key]=Math.max(0,planet.stock[key]-amount);}
  }
  const crowded = planet.population > housing(state, planet);
  const tax = owned ? state.player.tax : .16;
  const target = Math.max(5, Math.min(95, 72 + regime.happiness + effects.happiness + living + health*5 + civic*5 - (tax - .16) * 160 - (fed < demand ? 35 : 0) - (crowded ? 18 : 0)));
  planet.happiness += (target - planet.happiness) * .08;
  if (!crowded && fed >= demand && planet.happiness > 50) planet.population = Math.min(housing(state, planet), planet.population + .45 * effects.growth * tech.growth * (1+health*.1));
  if (fed < demand) planet.population = Math.max(1, planet.population - .3);
  const taxes = planet.population * tax * regime.tax * effects.tax * tech.tax;
  const commerce = commerceIncome(planet, fed >= demand);
  const income = taxes + commerce;
  if (owned && !options.deferBudget) {
    const delta = income - upkeep;
    state.credits += delta;
    if (state.credits < 1 && delta < 0) planet.happiness = Math.max(0, planet.happiness - 1);
    state.science += science;
  }
  planet.net = Object.fromEntries(RESOURCE_KEYS.map(k => [k, planet.stock[k] - before[k]]));
  planet.lastReport = { workers: used, available: workforce(state, planet), housing: housing(state, planet), income, taxes, commerce, upkeep, science, demand, fed, demandByResource, productionByResource, missingResources:[...missingResources], bankrupt: owned && state.credits < 1 };
}
export { forecast } from './budget.js';
