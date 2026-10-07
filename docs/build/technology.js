import { TECHNOLOGIES } from './technology-data.js';
export const TECHNOLOGY_LABELS = { energy: 'Energieertrag', food: 'Nahrungsertrag', ore: 'Erzförderung', alloy: 'Legierungsproduktion', optics: 'Optikproduktion', weapons: 'Waffenproduktion', crystal: 'Kristallförderung', science: 'Forschungsertrag', researchTime: 'Entwicklungszeit', workers: 'Arbeitskräfte', housing: 'Wohnraum', growth: 'Wachstum', inputEnergy: 'Fabrik-Energiebedarf', inputOre: 'Erzbedarf der Fabriken', inputAlloy: 'Legierungsbedarf der Fabriken', buildingUpkeep: 'Gebäudeunterhalt', fleetUpkeep: 'Flottenunterhalt', shipTime: 'Schiffbauzeit', combat: 'Kampfstärke', armor: 'Schadensreduktion', travelTime: 'Reisezeit', fuel: 'Startenergie', travelSupply: 'Bordverbrauch auf Reisen', cargoCapacity: 'Frachtraum', supply: 'Versorgung im Hafen', tax: 'Steuereinnahmen', trade: 'Exporterlöse', envoy: 'Gesandtschaftswirkung', survey: 'Erkundungsforschung', foodDemand: 'Nahrungsbedarf' };
export function technologyEffects(state, owner = 'player') {
  const result = Object.fromEntries(Object.keys(TECHNOLOGY_LABELS).map(k => [k, k === 'armor' ? 0 : 1]));
  if (owner !== 'player') return result;
  for (const id of state.tech) for (const [k, v] of Object.entries(TECHNOLOGIES[id]?.effects ?? {})) result[k] = k === 'armor' ? result[k] + v : result[k] * v;
  return result;
}
export function technologyText(effects) { return Object.entries(effects).map(([k, v]) => `${TECHNOLOGY_LABELS[k]} ${k === 'armor' ? `+${Math.round(v * 100)} Prozentpunkte` : `${v >= 1 ? '+' : '−'}${Math.round(Math.abs(v - 1) * 100)} %`}`).join(' · '); }
export function researchBlock(state, id) {
  const t = TECHNOLOGIES[id];
  if (!Object.hasOwn(TECHNOLOGIES, id)) return 'Unbekannte Technologie.';
  if (state.tech.includes(id)) return 'Bereits erforscht';
  const excluded = (t.excludes ?? []).find(other => state.tech.includes(other));
  if (excluded) return `Andere Spezialisierung gewählt: ${TECHNOLOGIES[excluded].name}`;
  const missing = t.requires.filter(required => !state.tech.includes(required));
  if (missing.length) return `Benötigt: ${missing.map(required => TECHNOLOGIES[required].name).join(', ')}`;
  if (t.requiresAny && !t.requiresAny.some(required => state.tech.includes(required))) return `Benötigt eine Spezialisierung: ${t.requiresAny.map(required => TECHNOLOGIES[required].name).join(' oder ')}`;
  return null;
}
