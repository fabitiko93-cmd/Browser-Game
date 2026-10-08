import { TECHNOLOGY_LABELS } from './technology.js';
import { EFFECT_LABELS } from './governance.js';
import { esc } from './ui-format.js';

// Classify the consequence, not the sign: a smaller cost or duration is beneficial.
const lowerIsBetter = new Set(['researchTime','shipTime','travelTime','fuel','travelSupply','inputEnergy','inputOre','inputAlloy','upkeep','buildingUpkeep','fleetUpkeep','foodDemand','reformCost','reformStability']);
const additive = new Set(['happiness','armor']);
export function effectValueMarkup(key, value, text, baseline = additive.has(key) ? 0 : 1) {
  const delta = value - baseline;
  const consequence = Math.abs(delta) < 1e-9 ? 'neutral' : (lowerIsBetter.has(key) ? delta < 0 : delta > 0) ? 'benefit' : 'penalty';
  return `<span class="effect-value effect-${consequence}"${consequence === 'neutral' ? '' : ` aria-label="${esc(text)}, ${consequence === 'benefit' ? 'Vorteil' : 'Nachteil'}"`}>${esc(text)}</span>`;
}
function effectMarkup(effects, labels) {
  return Object.entries(effects).map(([key, value]) => {
    const delta = value - (additive.has(key) ? 0 : 1);
    const magnitude = key === 'happiness' ? Math.abs(value) : Math.round(Math.abs(delta) * 100);
    const text = `${delta < 0 ? '−' : '+'}${magnitude} ${key === 'happiness' ? 'Punkte' : key === 'armor' ? 'Prozentpunkte' : '%'}`;
    return `${esc(labels[key] ?? key)} ${effectValueMarkup(key, value, text)}`;
  }).join(' · ');
}
export const technologyEffectMarkup = effects => effectMarkup(effects, TECHNOLOGY_LABELS);
export const policyEffectMarkup = effects => effectMarkup(effects, EFFECT_LABELS) || 'Keine zusätzlichen Modifikatoren';

// Event labels contain explicitly signed gains/losses; spending requirements stay neutral.
export const eventEffectMarkup = label => esc(label).replace(/([+−-]\d+(?:,\d+)?(?:\s*%)?)/g, text => effectValueMarkup('eventOutcome', Number(text.replace('−','-').replace('%','').replace(',','.').trim()), text, 0));
