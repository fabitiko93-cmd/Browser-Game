import { tickContracts } from './trade.js';
import { tickForeignDevelopment } from './foreign.js';
import { tickEvents } from './events.js';
export { resolveEvent } from './events.js';
import { tickDiplomacy } from './diplomacy.js';
import { tickStrikes, tickGoals } from './strategic.js';
import { tickGovernance } from './governance.js';
import { runDailyEconomy } from './budget.js';
import { RESOURCE_KEYS } from './data.js';
import { tickPolitics } from './politics.js';
import { tickShipyards, tickFleets, tickOpponents } from './fleets.js';
import { tickResearch } from './research.js';
import { tickExplorationAI } from './exploration.js';
import { tickCommunications } from './communications.js';

export function stepDay(state) {
  state.day++;
  const before = new Map(state.planets.map(p => [p.id, { ...p.stock }]));
  const openingCredits = state.credits;
  const budget = runDailyEconomy(state);
  const afterRecurring = new Map(state.planets.map(p => [p.id, { ...p.stock }]));
  tickShipyards(state); tickResearch(state); tickForeignDevelopment(state); tickFleets(state, { economyProcessed: true }); tickOpponents(state); tickPolitics(state);
  tickGovernance(state); tickContracts(state); tickStrikes(state); tickGoals(state); tickDiplomacy(state); tickEvents(state);
  tickExplorationAI(state); tickCommunications(state);
  budget.oneOff = state.credits - openingCredits - budget.actual;
  budget.actual = state.credits - openingCredits;
  budget.resources = Object.fromEntries(state.planets.filter(p => p.owner === 'player').map(p => [p.id, Object.fromEntries(RESOURCE_KEYS.map(k => [k, { recurring: afterRecurring.get(p.id)[k] - before.get(p.id)[k], oneOff: p.stock[k] - afterRecurring.get(p.id)[k] }]))]));
  state.lastDayReport = budget;
}
