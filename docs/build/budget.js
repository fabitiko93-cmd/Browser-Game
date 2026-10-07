import { RESOURCE_KEYS } from './data.js';
import { simulatePlanet } from './economy.js';
import { fleetUpkeep, maintainFleets } from './fleets.js';

// The same recurring-day calculation powers simulation, the HUD and the ledger.
export function runDailyEconomy(state) {
  const before = new Map(state.planets.map(p => [p.id, { ...p.stock }]));
  const openingCredits = state.credits;
  let income = 0, buildings = 0, science = 0;
  for (const p of state.planets) {
    simulatePlanet(state, p, { deferBudget: true });
    if (p.owner === 'player') { income += p.lastReport.income; buildings += p.lastReport.upkeep; science += p.lastReport.science; }
  }
  const fleets = fleetUpkeep(state), net = income - buildings - fleets;
  const funded = openingCredits + net >= 0;
  state.credits = Math.max(0, openingCredits + net);
  state.science += science;
  maintainFleets(state, funded);
  for (const p of state.planets) {
    if (!p.owner) continue;
    p.net = Object.fromEntries(RESOURCE_KEYS.map(k => [k, p.stock[k] - before.get(p.id)[k]]));
    if (p.owner === 'player') {
      p.lastReport.bankrupt = !funded;
      if (!funded) p.happiness = Math.max(0, p.happiness - 1);
    }
  }
  return { day: state.day, income, buildings, fleets, science, net, actual: state.credits - openingCredits, unfunded: Math.max(0, -(openingCredits + net)) };
}
export function forecastDay(state) {
  const copy = structuredClone(state);
  copy.day++;
  const budget = runDailyEconomy(copy);
  return { budget, planets: copy.planets };
}
export function forecast(state, planet) { return forecastDay(state).planets.find(p => p.id === planet.id); }
