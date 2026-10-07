import { researchBlock, technologyEffects } from './technology.js';
import { policyEffects } from './governance.js';
import { TECHNOLOGIES } from './data.js';
import { log } from './state.js';
export function startResearch(state, id) {
  const def = TECHNOLOGIES[id];
  if (!Object.hasOwn(TECHNOLOGIES, id)) return 'Unbekannte Technologie.';
  if (state.tech.includes(id)) return 'Diese Technologie ist bereits erforscht.';
  if (state.research) return 'Es läuft bereits ein Forschungsprojekt.';
  const blocked = researchBlock(state, id);
  if (blocked) return blocked;
  if (state.science < def.cost) return 'Es fehlen Forschungspunkte.';
  state.science -= def.cost;
  const total = researchDays(state, id);
  state.research = { id, remaining: total, total };
  log(state, `Forschung begonnen: ${def.name}.`);
  return null;
}
export function tickResearch(state) {
  if (!state.research) return;
  if (--state.research.remaining <= 0) {
    const id = state.research.id;
    state.tech.push(id); state.research = null;
    log(state, `Forschung abgeschlossen: ${TECHNOLOGIES[id].name}.`, 'success');
  }
}

export function researchDays(state, id) { return Math.max(2, Math.ceil(TECHNOLOGIES[id].days * policyEffects(state).researchTime * technologyEffects(state).researchTime)); }
