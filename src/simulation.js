import { tickGovernance } from './governance.js';
import { runDailyEconomy } from './budget.js';
import { RESOURCE_KEYS } from './data.js';
import { tickPolitics } from './politics.js';
import { tickShipyards, tickFleets, tickOpponents } from './fleets.js';
import { tickResearch } from './research.js';
import { getPlanet, log } from './state.js';

export function stepDay(state) {
  state.day++;
  const before = new Map(state.planets.map(p => [p.id, { ...p.stock }]));
  const openingCredits = state.credits;
  const budget = runDailyEconomy(state);
  const afterRecurring = new Map(state.planets.map(p => [p.id, { ...p.stock }]));
  tickShipyards(state); tickResearch(state); tickFleets(state, { economyProcessed: true }); tickOpponents(state); tickPolitics(state);
  tickGovernance(state);
  budget.oneOff = state.credits - openingCredits - budget.actual;
  budget.actual = state.credits - openingCredits;
  budget.resources = Object.fromEntries(state.planets.filter(p => p.owner === 'player').map(p => [p.id, Object.fromEntries(RESOURCE_KEYS.map(k => [k, { recurring: afterRecurring.get(p.id)[k] - before.get(p.id)[k], oneOff: p.stock[k] - afterRecurring.get(p.id)[k] }]))]));
  state.lastDayReport = budget;
  if (state.day % 24 === 0 && !state.event) {
    const kinds = ['signal', 'storm', 'migration'];
    state.event = { kind: kinds[Math.floor(state.day / 24 - 1) % kinds.length], planet: state.planets.find(p => p.owner === 'player')?.id };
    log(state, 'Eine neue Meldung wartet auf deine Entscheidung.');
  }
}
export function resolveEvent(state, choice) {
  const event = state.event;
  if (!event) return 'Es gibt keine offene Meldung.';
  const planet = getPlanet(state, event.planet);
  if (!planet || planet.owner !== 'player') { state.event = null; return null; }
  if (event.kind === 'signal') {
    if (choice === 'study') { state.science += 30; log(state, 'Das fremde Signal liefert 30 Forschungspunkte.', 'success'); }
    else if (choice === 'contact') { for (const r of Object.values(state.relations)) if (!r.war) r.score = Math.min(100, r.score + 5); log(state, 'Eine offene Antwort verbessert die diplomatischen Beziehungen.'); }
    else return 'Wähle eine Antwort.';
  } else if (event.kind === 'storm') {
    if (choice === 'protect') { if (state.credits < 70) return 'Für Schutzmaßnahmen fehlen 70 Credits.'; state.credits -= 70; log(state, `${planet.name}: Schutzmaßnahmen verhindern die Schäden.`); }
    else if (choice === 'endure') { planet.stock.energy *= .8; planet.happiness = Math.max(5, planet.happiness - 5); log(state, `${planet.name}: Der Sturm kostet Energie und Zufriedenheit.`, 'warning'); }
    else return 'Wähle eine Antwort.';
  } else {
    if (choice === 'welcome') { planet.population += 12; planet.aliens = Math.min(1, (planet.aliens * (planet.population - 12) + 12) / planet.population); log(state, `${planet.name}: Zwölf fremde Siedler aufgenommen.`); }
    else if (choice === 'decline') { planet.happiness = Math.max(5, planet.happiness - 2); log(state, 'Die Einreise wurde abgelehnt.'); }
    else return 'Wähle eine Antwort.';
  }
  state.event = null;
  return null;
}
