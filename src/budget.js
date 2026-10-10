import { relationBetween } from './realm-relations.js';
import { FACTIONS } from './data.js';
import { log } from './state.js';
import { financialCondition, advanceLocalMarket } from './finance.js';
import { diplomacyScience, sanctionUpkeep } from './diplomacy.js';
import { tickShields } from './strategic.js';
import { RESOURCE_KEYS } from './data.js';
import { simulatePlanet } from './economy.js';
import { fleetUpkeep, maintainFleets } from './fleets.js';

// The same recurring-day calculation powers simulation, the HUD and the ledger.
export function runDailyEconomy(state) {
  const before = new Map(state.planets.map(p => [p.id, { ...p.stock }]));
  const openingCredits = state.credits;
  let income = 0, taxes = 0, commerce = 0, buildings = 0, science = 0;
  const interest = financialCondition(state).interest;
  const foreignInterest=Object.fromEntries(Object.keys(state.factions).map(id=>[id,financialCondition(state,id).interest]));
  const foreignTotals=Object.fromEntries(Object.keys(state.factions).map(id=>[id,{credits:0,science:0}]));
  for (const p of state.planets) {
    advanceLocalMarket(p,state.day);
    simulatePlanet(state, p, { deferBudget: true });
    if(p.owner&&p.owner!=='player'&&state.factions?.[p.owner]){const f=foreignTotals[p.owner];f.credits+=p.lastReport.income-p.lastReport.upkeep;f.science+=p.lastReport.science;}
    if (p.owner === 'player') { income += p.lastReport.income; taxes += p.lastReport.taxes; commerce += p.lastReport.commerce; buildings += p.lastReport.upkeep; science += p.lastReport.science; }
  }
  for(const [id,f] of Object.entries(state.factions)){ f.credits+=foreignTotals[id].credits-fleetUpkeep(state,id)-foreignInterest[id]-2*Object.keys(FACTIONS).filter(other=>relationBetween(state,id,other)?.defensePact).length;f.science+=foreignTotals[id].science; maintainFleets(state,f.credits>=0,id); }
  tickShields(state);
  science *= diplomacyScience(state);
  const sanctions = sanctionUpkeep(state), fleets = fleetUpkeep(state);let net = income - buildings - fleets - sanctions - interest;
  const funded = openingCredits + net >= 0;
  state.credits = openingCredits + net;
  state.science += science;
  const beforeMaintenance=state.credits;maintainFleets(state, funded);const portCosts=beforeMaintenance-state.credits;net-=portCosts;
  for (const p of state.planets) {
    if (!p.owner) continue;
    p.net = Object.fromEntries(RESOURCE_KEYS.map(k => [k, p.stock[k] - before.get(p.id)[k]]));
    if (p.owner === 'player') {
      p.lastReport.bankrupt = !funded;
      if (!funded) p.happiness = Math.max(0, p.happiness - 1);
    }
  }
  if(openingCredits>=0&&state.credits<0)log(state,'Zahlungsunfähigkeit: Kosten werden als Schulden gebucht. Prüfe Wirtschaft → Finanzen.','warning');
  else if(openingCredits<0&&state.credits>=0)log(state,'Haushalt erholt: Schulden getilgt. Finanzbedingte Bau- und Forschungspausen enden.','success');
  return { day: state.day, income, taxes, commerce, interest, debt: Math.max(0,-state.credits), buildings, fleets, sanctions, portCosts, science, net, actual: state.credits - openingCredits, unfunded: Math.max(0, -(openingCredits + net)) };
}
export function forecastDay(state) {
  const copy = structuredClone(state);
  copy.day++;
  const budget = runDailyEconomy(copy);
  return { budget, planets: copy.planets };
}
export function forecast(state, planet) { return forecastDay(state).planets.find(p => p.id === planet.id); }
