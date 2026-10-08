import { technologyEffects } from './technology.js';
import { FACTIONS } from './data.js';
import { log } from './state.js';

// Multipliers combine; approval and daily expenses add. No hidden moral score.
export const PROFILES = {
  democracy: { workers:1.02, happiness:8, trade: 1.18, envoy: 1.2, science: 1.12, shipTime: 1.12, reformCost: 1.15 },
  communism: { science:1.06, happiness:3, production: 1.12, workers: 1.12, trade: .85, upkeep: 1.08 },
  monarchy: { science:1.04, workers:1.04, happiness:6, upkeep: .88, tax: 1.1, reformStability: .75, reformCost: 1.2 },
  military: { science:1.08, workers:.96, happiness:2, shipTime: .82, militaryProduction: 1.18, fleetUpkeep: .9, civilianProduction: .93 },
  technocracy: { workers:1.04, happiness:2, science: 1.25, researchTime: .85, inputEnergy: .92, upkeep: 1.18 },
  nationalSocialism: { science:1.10, workers:1.10, happiness:2, shipTime: .82, militaryProduction: 1.2, combat: 1.08, reformCost: .8, trade: .85, upkeep: 1.12 }
};
export const PROFILE_REASONS = {
  democracy: 'Wettbewerb und offene Fachdebatten fördern Handel, Diplomatie und Forschung; Mitbestimmung hebt Zustimmung und Beschäftigung. Parlamentarische Abstimmung erhöht Reformkosten und verzögert Werftentscheidungen.',
  communism: 'Zentrale Produktionsplanung und breite Beschäftigung erhöhen Ausstoß und Personalangebot; soziale Grundversorgung stützt Zustimmung und Ausbildung. Verwaltungsaufwand und staatlich geregelter Außenhandel kosten Unterhalt und Exporterlös.',
  monarchy: 'Eine dauerhafte Verwaltung reduziert laufende Kosten und verbessert Abgabenerhebung; Kontinuität stärkt Zustimmung, Ausbildung und Beschäftigung. Eingespielte Machtstrukturen machen Reformen teurer, aber weniger destabiliserend.',
  military: 'Eine gemeinsame Befehlskette standardisiert Flottenbetrieb und priorisiert Rüstung und Werften. Militärische Forschung und Sicherheitsversorgung erhalten Vorrang; zivile Betriebe verlieren Personal und organisatorische Kapazität.',
  technocracy: 'Ausbildung und Fachgremien erhöhen qualifiziertes Personal, sichern Grundversorgung, verkürzen Entwicklung und optimieren Energieeinsatz. Wissenschaftliche Verwaltung und spezialisierte Infrastruktur erhöhen laufende Kosten.',
  nationalSocialism: 'Zentralisierte Mobilisierung und Rüstungsaufträge beschleunigen Werften und Waffenfertigung; staatliche Arbeitslenkung, Zweckforschung und Versorgungsprogramme erweitern Personal und technische Entwicklung. Umfangreiche Kontrollapparate kosten Unterhalt; auf den eigenen Machtblock konzentrierter Handel reduziert Exporterlöse.'
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
export const EFFECT_LABELS = { production: 'Warenproduktion', science: 'Forschung', workers: 'Arbeitskräfte', tax: 'Steuereinnahmen', trade: 'Exporterlös', envoy: 'Gesandtschaftswirkung', shipTime: 'Schiffbauzeit', combat: 'Kampfstärke', upkeep: 'Gebäudeunterhalt', fleetUpkeep: 'Flottenunterhalt', growth: 'Bevölkerungswachstum', foodDemand: 'Nahrungsbedarf', happiness: 'Zufriedenheit', researchTime: 'Entwicklungszeit', inputEnergy: 'Fabrik-Energiebedarf', militaryProduction: 'Waffenproduktion', civilianProduction: 'Zivile Warenproduktion', reformCost: 'Reformkosten', reformStability: 'Stabilitätsverlust bei Reformen' };
export function effectText(effects) { return Object.entries(effects).map(([k, v]) => `${EFFECT_LABELS[k]} ${k === 'happiness' ? `${v >= 0 ? '+' : ''}${v} Punkte` : `${v >= 1 ? '+' : '−'}${Math.round(Math.abs(v - 1) * 100)} %`}`).join(' · ') || 'Keine zusätzlichen Modifikatoren'; }
export function initialGovernance(ideology = 'democracy') { return { laws: Object.fromEntries(Object.entries(LAWS).map(([id, law]) => [id, Object.keys(law.options)[0]])), lawReady: 0, decisions: [], cooldowns: {} }; }
export function policyEffects(state, owner = 'player') {
  const result = Object.fromEntries(Object.keys(EFFECT_LABELS).map(k => [k, k === 'happiness' ? 0 : 1]));
  const ideology = owner === 'player' ? state.player.ideology : FACTIONS[owner]?.ideology;
  const governance = owner === 'player' ? state.governance : state.factions?.[owner]?.governance;
  const sources = [PROFILES[ideology], ...Object.entries(governance?.laws ?? {}).map(([id, choice]) => LAWS[id]?.options[choice]?.effects), ...(governance?.decisions ?? []).filter(d => d.until >= state.day).map(d => DECISIONS[d.id]?.effects)];
  for (const source of sources) for (const [k, v] of Object.entries(source ?? {})) result[k] = k === 'happiness' ? result[k] + v : result[k] * v;
  return result;
}
export function enactLaw(state, category, choice) {
  const blocked = lawBlock(state, category, choice);
  if (blocked) return blocked;
  if (state.governance.laws[category] === choice) return 'Dieses Gesetz gilt bereits.';
  if (state.day < state.governance.lawReady) return 'Die Verwaltung arbeitet noch an der letzten Gesetzesänderung.';
  const cost = lawChangeCost(state);
  if (state.credits < cost) return `Eine Gesetzesänderung kostet ${cost} Credits.`;
  state.credits -= cost; state.governance.laws[category] = choice; state.governance.lawReady = state.day + 5;
  state.player.stability = Math.max(0, state.player.stability - 3 * policyEffects(state).reformStability);
  log(state, `Gesetz verabschiedet: ${LAWS[category].options[choice].name}.`, 'politics');
  return null;
}
export function decide(state, id) {
  if (!Object.hasOwn(DECISIONS, id)) return 'Unbekannter Regierungsbeschluss.';
  const d = DECISIONS[id];
  if (d.ideologies && !d.ideologies.includes(state.player.ideology)) return 'Dieser Beschluss gehört zu einer anderen Regierungsform.';
  if (d.requiredTech && !state.tech.includes(d.requiredTech)) return 'Die institutionelle Reformforschung fehlt.';
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

export function lawChangeCost(state) { return Math.ceil(60 * policyEffects(state).reformCost * technologyEffects(state).reformCost); }
export function governmentChangeCost(state) { return Math.ceil(100 * policyEffects(state).reformCost * technologyEffects(state).reformCost); }

// Shared fundamentals remain available; constitutional and economic reforms have prerequisites.
LAWS.borders.options.open.ideologies = ['democracy','communism','monarchy'];
LAWS.economy.options.free.ideologies = ['democracy','monarchy','technocracy'];
Object.assign(LAWS.borders.options, {
 skilled:{name:'Fachkräftevisa',ideologies:['technocracy','democracy','monarchy'],effects:{workers:1.06,growth:1.1,upkeep:1.03}},
 selective:{name:'Speziesgebundene Einreise',ideologies:['nationalSocialism'],effects:{workers:1.05,growth:.9,envoy:.97}},
 permits:{name:'Militärische Einreisegenehmigung',ideologies:['military'],effects:{workers:1.03,growth:.85,upkeep:1.03}}
});
Object.assign(LAWS.administration.options, {
 federal:{name:'Föderale Verfassung',ideologies:['democracy'],requiredTech:'politicalReforms',effects:{happiness:5,envoy:1.08,upkeep:1.08}},
 councils:{name:'Planetare Produktionsräte',ideologies:['communism'],requiredTech:'politicalReforms',effects:{workers:1.06,production:1.05,upkeep:1.1}},
 crown:{name:'Kronverwaltung',ideologies:['monarchy'],requiredTech:'politicalReforms',effects:{tax:1.08,happiness:3,reformCost:1.1}},
 command:{name:'Militärische Kolonialverwaltung',ideologies:['military'],requiredTech:'politicalReforms',effects:{shipTime:.94,militaryProduction:1.08,civilianProduction:.97}},
 experts:{name:'Wissenschaftliche Fachgremien',ideologies:['technocracy'],requiredTech:'politicalReforms',effects:{researchTime:.93,science:1.08,upkeep:1.1}},
 directive:{name:'Zentrale Staats- und Rüstungslenkung',ideologies:['nationalSocialism'],requiredTech:'politicalReforms',effects:{workers:1.06,militaryProduction:1.08,upkeep:1.1}}
});
Object.assign(LAWS.science.options, {
 peer:{name:'Freier wissenschaftlicher Austausch',ideologies:['democracy'],effects:{science:1.12,envoy:1.05,researchTime:1.04}},
 state:{name:'Staatliche Forschungspläne',ideologies:['communism','nationalSocialism','military'],effects:{science:1.1,researchTime:.95,upkeep:1.08}},
 patronage:{name:'Akademische Kronförderung',ideologies:['monarchy'],effects:{science:1.12,tax:.97}},
 expert:{name:'Fachgesteuerte Forschungsbudgets',ideologies:['technocracy'],effects:{science:1.15,researchTime:.92,upkeep:1.12}}
});
const reform = (name,description,ideology,effects) => ({name,description,ideologies:[ideology],requiredTech:'politicalReforms',cost:180,duration:30,cooldown:60,effects});
Object.assign(DECISIONS, {
 civicMandate:reform('Bürgerkonvent','Öffentliche Reformberatung stärkt Zustimmung und wissenschaftlichen Austausch.','democracy',{happiness:6,science:1.1,upkeep:1.05}),
 productionPlan:reform('Planetarer Produktionsplan','Koordinierte Lieferaufträge und zusätzliche Beschäftigung.','communism',{workers:1.08,production:1.1,upkeep:1.08}),
 crownGrant:reform('Königlicher Akademiefonds','Langfristige Förderung von Wissenschaft und öffentlicher Versorgung.','monarchy',{science:1.18,happiness:3}),
 officerCadre:reform('Offiziers- und Logistikreform','Standardisierte Versorgung beschleunigt die Flotte und bindet ziviles Personal.','military',{shipTime:.9,fleetUpkeep:.92,workers:.97}),
 expertBudget:reform('Fachgremienprogramm','Forschungsbudgets und energieeffiziente Produktionsverfahren.','technocracy',{science:1.15,inputEnergy:.95,upkeep:1.08}),
 industrialDirective:reform('Industrielle Mobilisierung','Zusätzliche industrielle Beschäftigung und gelenkte Rüstungsaufträge.','nationalSocialism',{workers:1.08,militaryProduction:1.12,upkeep:1.08})
});
export function lawBlock(state, category, choice, ideology = state.player.ideology) {
 const option=LAWS[category]?.options[choice];
 if(!option)return 'Unbekanntes Gesetz.';
 if(option.ideologies&&!option.ideologies.includes(ideology))return 'Passt nicht zur aktuellen Regierungsform.';
 if(option.requiredTech&&!state.tech.includes(option.requiredTech))return 'Benötigt: institutionelle Reformverfahren.';
 return null;
}
export function normalizeLaws(governance, ideology) {
 for(const [id,law] of Object.entries(LAWS)) {
  const option=law.options[governance.laws[id]];
  if(!option||option.ideologies&&!option.ideologies.includes(ideology))governance.laws[id]=Object.keys(law.options)[0];
 }
 governance.decisions=governance.decisions.filter(d=>!DECISIONS[d.id]?.ideologies||DECISIONS[d.id].ideologies.includes(ideology));
 return governance;
}
