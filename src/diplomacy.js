import { routePlanets } from './routing.js';
import { serviceCount } from './infrastructure.js';
import { FACTIONS } from './data.js';
import { log, ownedPlanets } from './state.js';
import { declareMessage } from './communications.js';
export const initialRelationExtras = () => ({ pactUntil: 0, cooperation: false, embargo: false, envoyReady: 0, aidReady: 0, portAccess:false, researchPact:false, defensePact:false });
export const cooperationCount = state => Object.values(state.relations).filter(r => r.cooperation && !r.war && !r.embargo).length;
export const diplomacyScience = state => 1 + cooperationCount(state) * .08 + Object.values(state.relations).filter(r=>r.researchPact&&!r.war&&!r.embargo).length*.06;
export const sanctionUpkeep = state => Object.values(state.relations).filter(r => r.embargo).length * 1.5 + Object.values(state.relations).filter(r=>r.defensePact&&!r.war&&!r.embargo).length*2;
export function cancelForeignRoutes(state, faction) {
  for (const f of state.fleets) if (f.route && routePlanets(f.route).some(id => state.planets.find(p => p.id === id)?.owner === faction)) f.route = null;
}
export function treatyAction(state, faction, action) {
  if(['ports','research-pact','defense-pact','cancel-ports','cancel-research-pact','cancel-defense-pact'].includes(action))return advancedTreaty(state,faction,action);
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
    declareMessage(state,faction,'Pakt gekündigt','Unsere Regierung hat den Nichtangriffspakt gekündigt.');
  } else if (action === 'cancel-cooperation') {
    if (!r.cooperation) return 'Es besteht keine Partnerschaft.';
    r.cooperation = false; r.score = Math.max(-100, r.score - 10); log(state, `Partnerschaft mit ${FACTIONS[faction].name} beendet.`, 'politics');
  } else if (action === 'embargo') {
    if (r.embargo) return 'Die Sanktionen sind bereits aktiv.';
    r.embargo = true; r.trade = false; r.cooperation = false;r.portAccess=false;r.researchPact=false;r.defensePact=false; r.score = Math.max(-100, r.score - 20); cancelForeignRoutes(state, faction);
    log(state, `${FACTIONS[faction].name} sanktioniert: Produktion −15 %, Handel gesperrt; Kosten 1,5 Credits / Tag.`, 'politics');
  } else if (action === 'lift-embargo') {
    if (!r.embargo) return 'Es bestehen keine Sanktionen.';
    r.embargo = false; log(state, `Sanktionen gegen ${FACTIONS[faction].name} aufgehoben. Handelsabkommen müssen neu geschlossen werden.`, 'politics');
  } else return 'Unbekannte diplomatische Aktion.';
  return null;
}
export function tickDiplomacy(state) {
  for (const [id,r] of Object.entries(state.relations)) {
    if (r.pactUntil && r.pactUntil <= state.day) { r.pactUntil = 0; declareMessage(state,id,'Nichtangriffspakt ausgelaufen','Der vereinbarte Nichtangriffspakt ist ausgelaufen. Es besteht weiterhin Frieden.',true); }
    if (!state.planets.some(p=>p.owner===id)) { r.cooperation = false; r.trade = false;r.portAccess=false;r.researchPact=false;r.defensePact=false; }
    if ((r.cooperation||r.defensePact) && !r.war && !r.embargo && state.day >= r.aidReady && Object.values(state.relations).some(q=>q.war)) {
      const supplier = state.planets.find(p=>p.owner===id && p.stock.alloy>=12 && p.stock.weapons>=4), target = ownedPlanets(state)[0];
      if (supplier && target) { supplier.stock.alloy-=12; supplier.stock.weapons-=4; target.stock.alloy+=12; target.stock.weapons+=4; target.defense+=r.defensePact?12:4; r.aidReady=state.day+(r.defensePact?30:60); log(state, `${FACTIONS[id].name}: Unterstützung für ${target.name} eingetroffen (+12 Legierungen, +4 Waffen, +${r.defensePact?12:4} Verteidigung).`, 'success', 'delivery'); }
    }
  }
}

export function advancedTreaty(state,faction,action){
 const r=state.relations[faction];if(!r)return 'Unbekannter Handelspartner.';
 const key={'ports':'portAccess','research-pact':'researchPact','defense-pact':'defensePact'};
 const clean=action.replace('cancel-',''),field=key[clean];if(!field)return 'Unbekanntes Abkommen.';
 if(action.startsWith('cancel-')){if(!r[field])return 'Dieses Abkommen besteht nicht.';r[field]=false;log(state,`${FACTIONS[faction].name}: Abkommen beendet.`,'politics');return null;}
 if(!state.tech.includes('advancedDiplomacy')||!ownedPlanets(state).some(p=>serviceCount(p,'diplomacy')))return 'Benötigt: Interstellare Vertragsdiplomatie und ein aktives Diplomatisches Forum.';
 const threshold={ports:15,'research-pact':35,'defense-pact':50}[clean],cost={ports:80,'research-pact':160,'defense-pact':120}[clean];
 if(r[field])return 'Dieses Abkommen besteht bereits.';
 if(r.war||r.embargo||!r.trade||r.score<threshold)return `Benötigt Handel, Frieden und Beziehungen von mindestens ${threshold}.`;
 if(!state.planets.some(p=>p.owner===faction))return 'Dieses Reich besitzt keine Planeten mehr.';
 if(state.credits<cost)return 'Für das Abkommen fehlen Credits.';
 state.credits-=cost;r[field]=true;
 const label={ports:'Hafennutzung: Versorgung und Reparatur gegen örtliche Warenpreise','research-pact':'Forschungsaustausch: +6 % Forschung','defense-pact':'Beistand: verstärkte Versorgungshilfe alle 30 Kriegstage, 2 Credits Unterhalt pro Tag'}[clean];
 log(state,`${FACTIONS[faction].name}: ${label}.`,'politics');return null;
}
