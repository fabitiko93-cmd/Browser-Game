import { log } from './state.js';

// Multipliers combine; approval and daily expenses add. No hidden moral score.
export const PROFILES = {
  democracy: { trade: 1.2, envoy: 1.2, shipTime: 1.15 },
  communism: { production: 1.15, trade: .85, upkeep: 1.1 },
  monarchy: { upkeep: .85, tax: 1.1, science: .9 },
  military: { shipTime: .75, combat: 1.15, production: .9 },
  technocracy: { science: 1.25, production: 1.05, upkeep: 1.2 },
  nationalSocialism: { shipTime: .8, combat: 1.1, production: 1.1, trade: .8, upkeep: 1.15 }
};
export const LAWS = {
  economy: { name: 'Wirtschaftsordnung', options: {
    mixed: { name: 'Gemischte Wirtschaft', effects: {} },
    free: { name: 'Freihandel', effects: { trade: 1.3, production: .9 } },
    planned: { name: 'Autarke Planwirtschaft', effects: { production: 1.2, trade: .7, upkeep: 1.1 } }
  } },
  labor: { name: 'Arbeitsrecht', options: {
    standard: { name: 'Reguläre Schichten', effects: {} },
    extended: { name: 'Verlängerte Schichten', effects: { workers: 1.15, production: 1.1, happiness: -8 } },
    protected: { name: 'Sozialgarantien', effects: { happiness: 8, growth: 1.2, upkeep: 1.2 } }
  } },
  service: { name: 'Militärdienst', options: {
    professional: { name: 'Berufsflotte', effects: {} },
    draft: { name: 'Wehrpflicht', effects: { shipTime: .8, combat: 1.1, workers: .9 } },
    reserve: { name: 'Reserveverbände', effects: { combat: 1.2, shipTime: 1.2, fleetUpkeep: 1.25 } }
  } },
  borders: { name: 'Einwanderung', options: {
    controlled: { name: 'Kontrollierte Einreise', effects: {} },
    open: { name: 'Offene Grenzen', effects: { growth: 1.4, envoy: 1.15, foodDemand: 1.15 } },
    closed: { name: 'Geschlossene Grenzen', effects: { foodDemand: .9, growth: .65, envoy: .8 } }
  } },
  science: { name: 'Forschungspolitik', options: {
    balanced: { name: 'Breite Grundlagenforschung', effects: {} },
    priority: { name: 'Forschungspriorität', effects: { science: 1.35, upkeep: 1.2 } },
    military: { name: 'Rüstungsforschung', effects: { combat: 1.15, science: .8 } }
  } },
  administration: { name: 'Verwaltung', options: {
    local: { name: 'Planetare Verwaltung', effects: {} },
    central: { name: 'Zentralverwaltung', effects: { tax: 1.15, happiness: -6 } },
    autonomous: { name: 'Koloniale Autonomie', effects: { happiness: 6, tax: .85 } }
  } }
};
export const DECISIONS = {
  industry: { name: 'Industrieprogramm', description: 'Zusätzliche Schichten und staatliche Lieferaufträge.', cost: 120, duration: 12, cooldown: 24, effects: { production: 1.3, happiness: -4 } },
  grant: { name: 'Forschungsförderung', description: 'Ein zeitlich begrenztes Budget für deine Labore.', cost: 140, duration: 15, cooldown: 30, effects: { science: 1.5 } },
  relief: { name: 'Versorgungspaket', description: 'Zusätzliche Lebensmittel und Hilfen für alle Kolonien.', cost: 90, duration: 12, cooldown: 24, effects: { happiness: 10, foodDemand: 1.15 } },
  ration: { name: 'Notrationierung', description: 'Lebensmittel strecken, um Versorgungsengpässe zu überbrücken.', cost: 40, duration: 10, cooldown: 20, effects: { foodDemand: .65, happiness: -10 } },
  mobilize: { name: 'Flottenmobilisierung', description: 'Werften haben Vorrang bei Personal und Material.', cost: 150, duration: 12, cooldown: 28, effects: { shipTime: .65, combat: 1.15, workers: .85 } },
  trade: { name: 'Handelsmission', description: 'Exportförderung und zusätzliche diplomatische Vertretungen.', cost: 100, duration: 16, cooldown: 30, effects: { trade: 1.4, envoy: 1.4 } }
};
export const EFFECT_LABELS = { production: 'Warenproduktion', science: 'Forschung', workers: 'Arbeitskräfte', tax: 'Steuereinnahmen', trade: 'Exporterlös', envoy: 'Gesandtschaftswirkung', shipTime: 'Schiffbauzeit', combat: 'Kampfstärke', upkeep: 'Gebäudeunterhalt', fleetUpkeep: 'Flottenunterhalt', growth: 'Bevölkerungswachstum', foodDemand: 'Nahrungsbedarf', happiness: 'Zufriedenheit' };
export function effectText(effects) { return Object.entries(effects).map(([k, v]) => `${EFFECT_LABELS[k]} ${k === 'happiness' ? `${v >= 0 ? '+' : ''}${v} Punkte` : `${v >= 1 ? '+' : '−'}${Math.round(Math.abs(v - 1) * 100)} %`}`).join(' · ') || 'Keine zusätzlichen Modifikatoren'; }
export function initialGovernance() { return { laws: Object.fromEntries(Object.entries(LAWS).map(([id, law]) => [id, Object.keys(law.options)[0]])), lawReady: 0, decisions: [], cooldowns: {} }; }
export function policyEffects(state, owner = 'player') {
  const result = Object.fromEntries(Object.keys(EFFECT_LABELS).map(k => [k, k === 'happiness' ? 0 : 1]));
  if (owner !== 'player') return result;
  const sources = [PROFILES[state.player.ideology], ...Object.entries(state.governance?.laws ?? {}).map(([id, choice]) => LAWS[id]?.options[choice]?.effects), ...(state.governance?.decisions ?? []).filter(d => d.until >= state.day).map(d => DECISIONS[d.id]?.effects)];
  for (const source of sources) for (const [k, v] of Object.entries(source ?? {})) result[k] = k === 'happiness' ? result[k] + v : result[k] * v;
  return result;
}
export function enactLaw(state, category, choice) {
  if (!Object.hasOwn(LAWS, category) || !Object.hasOwn(LAWS[category].options, choice)) return 'Unbekanntes Gesetz.';
  if (state.governance.laws[category] === choice) return 'Dieses Gesetz gilt bereits.';
  if (state.day < state.governance.lawReady) return 'Die Verwaltung arbeitet noch an der letzten Gesetzesänderung.';
  if (state.credits < 60) return 'Eine Gesetzesänderung kostet 60 Credits.';
  state.credits -= 60; state.governance.laws[category] = choice; state.governance.lawReady = state.day + 5;
  state.player.stability = Math.max(0, state.player.stability - 3);
  log(state, `Gesetz verabschiedet: ${LAWS[category].options[choice].name}.`, 'politics');
  return null;
}
export function decide(state, id) {
  if (!Object.hasOwn(DECISIONS, id)) return 'Unbekannter Regierungsbeschluss.';
  const d = DECISIONS[id];
  if ((state.governance.cooldowns[id] ?? 0) > state.day) return 'Dieser Beschluss kann noch nicht erneut erlassen werden.';
  if (state.credits < d.cost) return 'Für diesen Beschluss fehlen Credits.';
  state.credits -= d.cost;
  state.governance.decisions.push({ id, until: state.day + d.duration });
  state.governance.cooldowns[id] = state.day + d.cooldown;
  log(state, `${d.name} beschlossen: ${d.duration} Tage Laufzeit.`, 'politics');
  return null;
}
export function tickGovernance(state) {
  state.governance.decisions = state.governance.decisions.filter(d => {
    if (d.until > state.day) return true;
    log(state, `${DECISIONS[d.id].name}: Programm beendet.`, 'politics'); return false;
  });
}
