import { TECHNOLOGIES } from './data.js';
import { log } from './state.js';
export function startResearch(state, id) {
  const def = TECHNOLOGIES[id];
  if (!Object.hasOwn(TECHNOLOGIES, id)) return 'Unbekannte Technologie.';
  if (state.tech.includes(id)) return 'Diese Technologie ist bereits erforscht.';
  if (state.research) return 'Es läuft bereits ein Forschungsprojekt.';
  if (state.science < def.cost) return 'Es fehlen Forschungspunkte.';
  state.science -= def.cost;
  state.research = { id, remaining: 6, total: 6 };
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
