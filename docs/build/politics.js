import { treatyAction, cancelForeignRoutes } from './diplomacy.js';
import { technologyEffects } from './technology.js';
import { policyEffects, governmentChangeCost } from './governance.js';
import { IDEOLOGIES, FACTIONS } from './data.js';
import { ownedPlanets, log } from './state.js';

export function changeGovernment(state, ideology) {
  if (!Object.hasOwn(IDEOLOGIES, ideology)) return 'Unbekannte Regierungsform.';
  if (state.player.ideology === ideology) return 'Diese Regierung ist bereits im Amt.';
  const cost = governmentChangeCost(state), stabilityCost = 18 * policyEffects(state).reformStability;
  if (state.credits < cost) return `Eine Regierungsumbildung kostet ${cost} Credits.`;
  state.credits -= cost;
  state.player.ideology = ideology;
  state.player.stability = Math.max(5, state.player.stability - stabilityCost);
  state.player.term = state.day + 60;
  for (const p of ownedPlanets(state)) p.happiness = Math.max(5, p.happiness - 8);
  for (const [id, rel] of Object.entries(state.relations)) {
    const same = IDEOLOGIES[FACTIONS[id].ideology].affinity === IDEOLOGIES[ideology].affinity;
    rel.score = Math.max(-100, Math.min(100, rel.score + (same ? 12 : -8)));
  }
  log(state, `Regierungsumbildung: ${IDEOLOGIES[ideology].name}. Die politische Stabilität sinkt vorübergehend.`, 'politics');
  return null;
}
export function diplomaticAction(state, faction, action) {
  const rel = state.relations[faction];
  if (!rel) return 'Keine diplomatische Verbindung.';
  if (['pact','cooperation','cancel-pact','cancel-cooperation','embargo','lift-embargo'].includes(action)) return treatyAction(state,faction,action);
  if (action === 'war') {
    if (rel.war) return 'Ihr befindet euch bereits im Krieg.';
    if (rel.pactUntil > state.day) return 'Kündige zuerst den aktiven Nichtangriffspakt.';
    rel.war = true; rel.trade = false; rel.cooperation = false; cancelForeignRoutes(state,faction); rel.score = Math.max(-100, rel.score - 40);
    log(state, `Krieg erklärt: ${FACTIONS[faction].name}. Frachtrouten in dieses Gebiet werden beendet.`, 'war');
  } else if (action === 'peace') {
    if (!rel.war) return 'Es besteht kein Krieg.';
    if (state.credits < 120) return 'Für einen Waffenstillstand fehlen 120 Credits.';
    state.credits -= 120; rel.war = false; rel.score = Math.min(0, rel.score + 15);
    log(state, `Waffenstillstand mit ${FACTIONS[faction].name}.`, 'politics');
  } else if (action === 'envoy') {
    if (rel.war) return 'Während eines Krieges sind Gesandtschaften nicht möglich.';
    if (rel.envoyReady > state.day) return `Die nächste Gesandtschaft ist in ${rel.envoyReady-state.day} Tagen möglich.`;
    if (state.credits < 60) return 'Für eine Gesandtschaft fehlen 60 Credits.';
    state.credits -= 60; rel.envoyReady = state.day + 10; rel.score = Math.min(100, rel.score + 15 * policyEffects(state).envoy * technologyEffects(state).envoy);
    log(state, `Gesandtschaft zur ${FACTIONS[faction].name}: Beziehungen verbessert.`, 'politics');
  } else if (action === 'trade') {
    if (rel.trade) return 'Das Handelsabkommen besteht bereits.';
    if (rel.embargo) return 'Hebe zuerst die Sanktionen auf.';
    if (rel.war || rel.score < 0) return 'Ein Handelsabkommen braucht Frieden und Beziehungen von mindestens 0.';
    if (state.credits < 50) return 'Für das Handelsabkommen fehlen 50 Credits.';
    state.credits -= 50; rel.trade = true;
    log(state, `Handelsabkommen mit ${FACTIONS[faction].name}. Frachter können Waren verkaufen.`, 'politics');
  } else return 'Unbekannte diplomatische Aktion.';
  return null;
}
export function tickPolitics(state) {
  const planets = ownedPlanets(state);
  const average = planets.reduce((s, p) => s + p.happiness * p.population, 0) / Math.max(1, planets.reduce((s, p) => s + p.population, 0));
  state.player.stability = Math.max(0, Math.min(100, state.player.stability + (average - state.player.stability) * .012));
  state.player.rulingSupport = Math.round(Math.max(10, Math.min(90, average * .75)));
  if (state.player.ideology === 'democracy' && state.day >= state.player.term) {
    if (state.player.rulingSupport < 40) {
      state.player.tax = .12;
      state.player.stability = Math.max(20, state.player.stability - 5);
      log(state, 'Wahl: Eine neue Koalition übernimmt. Die Steuerquote wird auf 12 % gesenkt.', 'politics');
    } else log(state, `Wahl: Die Regierung bleibt mit ${state.player.rulingSupport} % Unterstützung im Amt.`, 'politics');
    state.player.term = state.day + 60;
  }
  for (const p of planets) {
    if (p.happiness < 25 && state.day % 15 === 0) {
      const lost = Math.min(p.stock.alloy, 8);
      p.stock.alloy -= lost;
      log(state, `${p.name}: Unruhen unterbrechen die Produktion. ${lost.toFixed(0)} Legierungen verloren.`, 'warning');
    }
  }
}
