import { FACTIONS } from './data.js';
import { log, ownedPlanets } from './state.js';
export const initialRelationExtras = () => ({ pactUntil: 0, cooperation: false, embargo: false, envoyReady: 0, aidReady: 0 });
export const cooperationCount = state => Object.values(state.relations).filter(r => r.cooperation && !r.war && !r.embargo).length;
export const diplomacyScience = state => 1 + cooperationCount(state) * .08;
export const sanctionUpkeep = state => Object.values(state.relations).filter(r => r.embargo).length * 1.5;
export function cancelForeignRoutes(state, faction) {
  for (const f of state.fleets) if (f.route && [f.route.source, f.route.target].some(id => state.planets.find(p => p.id === id)?.owner === faction)) f.route = null;
}
export function treatyAction(state, faction, action) {
  const r = state.relations[faction];
  if (!r) return 'Keine diplomatische Verbindung.';
  const price = { pact: 100, cooperation: 180 }[action];
  if (price != null) {
    const threshold = action === 'pact' ? 35 : 50;
    if (r.war || r.embargo || r.score < threshold) return `Benötigt Frieden, keine Sanktionen und Beziehungen von mindestens ${threshold}.`;
    if (action === 'pact' && r.pactUntil > state.day || action === 'cooperation' && r.cooperation) return 'Dieses Abkommen ist bereits aktiv.';
    if (action === 'cooperation' && !r.trade) return 'Eine Partnerschaft benötigt zuerst ein Handelsabkommen.';
    if (!state.planets.some(p => p.owner === faction)) return 'Dieses Reich besitzt keine Kolonien mehr.';
    if (state.credits < price) return `Für das Abkommen fehlen ${price} Credits.`;
    state.credits -= price;
    if (action === 'pact') r.pactUntil = state.day + 180;
    else { r.cooperation = true; r.aidReady = state.day + 60; }
    log(state, `${FACTIONS[faction].name}: ${action === 'pact' ? 'Nichtangriffspakt für 180 Tage' : 'Partnerschaft: +8 % Forschung, +12 % Exporterlös und Hilfe im Krieg'} vereinbart.`, 'politics');
  } else if (action === 'cancel-pact') {
    if (r.pactUntil <= state.day) return 'Es besteht kein Nichtangriffspakt.';
    r.pactUntil = 0; r.score = Math.max(-100, r.score - 15); log(state, `Nichtangriffspakt mit ${FACTIONS[faction].name} gekündigt; Beziehungen −15.`, 'politics');
  } else if (action === 'cancel-cooperation') {
    if (!r.cooperation) return 'Es besteht keine Partnerschaft.';
    r.cooperation = false; r.score = Math.max(-100, r.score - 10); log(state, `Partnerschaft mit ${FACTIONS[faction].name} beendet.`, 'politics');
  } else if (action === 'embargo') {
    if (r.embargo) return 'Die Sanktionen sind bereits aktiv.';
    r.embargo = true; r.trade = false; r.cooperation = false; r.score = Math.max(-100, r.score - 20); cancelForeignRoutes(state, faction);
    log(state, `${FACTIONS[faction].name} sanktioniert: Produktion −15 %, Handel gesperrt; Kosten 1,5 Credits / Tag.`, 'politics');
  } else if (action === 'lift-embargo') {
    if (!r.embargo) return 'Es bestehen keine Sanktionen.';
    r.embargo = false; log(state, `Sanktionen gegen ${FACTIONS[faction].name} aufgehoben. Handelsabkommen müssen neu geschlossen werden.`, 'politics');
  } else return 'Unbekannte diplomatische Aktion.';
  return null;
}
export function tickDiplomacy(state) {
  for (const [id,r] of Object.entries(state.relations)) {
    if (r.pactUntil && r.pactUntil <= state.day) { r.pactUntil = 0; log(state, `Nichtangriffspakt mit ${FACTIONS[id].name} ausgelaufen.`, 'politics'); }
    if (!state.planets.some(p=>p.owner===id)) { r.cooperation = false; r.trade = false; }
    if (r.cooperation && !r.war && !r.embargo && state.day >= r.aidReady && Object.values(state.relations).some(q=>q.war)) {
      const supplier = state.planets.find(p=>p.owner===id && p.stock.alloy>=12 && p.stock.weapons>=4), target = ownedPlanets(state)[0];
      if (supplier && target) { supplier.stock.alloy-=12; supplier.stock.weapons-=4; target.stock.alloy+=12; target.stock.weapons+=4; target.defense+=4; r.aidReady=state.day+60; log(state, `${FACTIONS[id].name}: Unterstützung für ${target.name} eingetroffen (+12 Legierungen, +4 Waffen, +4 Verteidigung).`, 'success', 'delivery'); }
    }
  }
}
