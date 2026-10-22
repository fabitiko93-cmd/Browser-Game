import { REGION_BUILD_GRID, regionBuildCell, regionGroundHeight, regionHeight, regionWater } from './planet-blueprint.js';

// Probe construction is separate from the saved empire and its economy. The
// same footprint is used for validation, clearing, occupancy and presentation.
export const PROBE_HABITAT = Object.freeze({ name: 'Habitat', columns: 4, rows: 4 });
export const PROBE_SAVE_KEY = 'orbit3077-planet-construction-v1';
export const emptyConstruction = () => ({ version: 1, nextId: 1, buildings: [], clearings: [] });
export const constructionKey = r => JSON.stringify([r.generatorVersion, r.seed, r.preset, r.module, r.valley, r.climateBiome, r.terrain]);
export const overlapsFootprint = (a, b) => a.minX < b.maxX - 1e-7 && a.maxX > b.minX + 1e-7 && a.minZ < b.maxZ - 1e-7 && a.maxZ > b.minZ + 1e-7;
export const clearedObject = (object, clearings) => object.removable && clearings.some(f => overlapsFootprint(object.bounds, f));
const sameFootprint = (a, b) => ['minX', 'minZ', 'maxX', 'maxZ'].every(k => a[k] === b[k]);

export function constructionFootprint(x, z) {
  const c = regionBuildCell(x, z); if (!c) return null;
  const { cellSize: s, halfExtent: h } = REGION_BUILD_GRID;
  const minX = -h + (c.column - 1) * s, minZ = -h + (c.row - 1) * s;
  return { minX, minZ, maxX: minX + PROBE_HABITAT.columns * s, maxZ: minZ + PROBE_HABITAT.rows * s };
}

export function assessConstruction(region, state, x, z, objects = []) {
  const footprint = constructionFootprint(x, z), counts = { tree: 0, plant: 0, stone: 0 };
  const occupied = state.buildings.find(b => footprint && overlapsFootprint(b.footprint, footprint));
  const result = { footprint, occupied: occupied ?? null, counts, issue: null, foundation: null };
  const stop = issue => Object.assign(result, { issue });
  if (!footprint || Math.min(footprint.minX, footprint.minZ) < -64 || Math.max(footprint.maxX, footprint.maxZ) > 64) return stop('Die gesamte Grundfläche muss im Baugebiet liegen.');
  if (occupied) return stop('Die Grundfläche ist bereits bebaut.');
  let min = Infinity, max = -Infinity;
  // Inspect every metre, every edge and the actual terrain vertices. A dry
  // centre alone cannot make a foundation crossing a river or rim valid.
  const axis = (lo, hi) => [...new Set([lo, hi, ...Array.from({ length: Math.floor(hi - lo) + 1 }, (_, i) => lo + i), ...Array.from({ length: 8 }, (_, i) => Math.ceil(lo / 1.5) * 1.5 + i * 1.5).filter(v => v >= lo && v <= hi)])];
  const xs = axis(footprint.minX, footprint.maxX), zs = axis(footprint.minZ, footprint.maxZ);
  for (const px of xs) for (const pz of zs) {
    const y = regionGroundHeight(region, px, pz);
    if (regionWater(region, px, pz, y)) return stop('Wasser innerhalb der Grundfläche verhindert den Bau.');
    const slope = Math.hypot(regionHeight(region, px + 1, pz) - regionHeight(region, px - 1, pz), regionHeight(region, px, pz + 1) - regionHeight(region, px, pz - 1)) / 2;
    if (slope >= .12) return stop('Ein Steilhang innerhalb der Grundfläche verhindert den Bau.');
    min = Math.min(min, y); max = Math.max(max, y);
  }
  if (max - min > 1.2) return stop('Der Höhenunterschied ist für dieses Fundament zu groß.');
  for (const o of objects) {
    if (clearedObject(o, state.clearings) || !overlapsFootprint(o.bounds, footprint)) continue;
    if (!o.removable) return stop('Ein großer Felsblock versperrt die Grundfläche.');
    counts[o.kind]++;
  }
  result.foundation = { top: max + .12, bottom: min - .12 };
  return result;
}

export function placeConstruction(region, state, x, z, objects = []) {
  const assessment = assessConstruction(region, state, x, z, objects);
  if (assessment.issue) return { ...assessment, building: null };
  if (state.buildings.length >= 32 || state.clearings.length >= 256 && !state.clearings.some(f => sameFootprint(f, assessment.footprint))) return { ...assessment, issue: 'Die Bauprobe ist voll. Entferne einen Probebau oder setze die Bauprobe in den Optionen zurück.', building: null };
  const building = { id: state.nextId++, type: 'habitat', footprint: assessment.footprint, foundation: assessment.foundation };
  state.buildings.push(building);
  if (!state.clearings.some(f => sameFootprint(f, building.footprint))) state.clearings.push({ ...building.footprint });
  return { ...assessment, building };
}

export function demolishConstruction(state, id) {
  const i = state.buildings.findIndex(b => b.id === id); if (i < 0) return false;
  state.buildings.splice(i, 1); return true; // Cleared ground does not regrow on demolition.
}

const validFootprint = f => f && ['minX', 'minZ', 'maxX', 'maxZ'].every(k => Number.isFinite(f[k]) && Math.abs(f[k]) <= 64) && f.maxX - f.minX === 8 && f.maxZ - f.minZ === 8 && Object.values(f).every(v => v % 2 === 0);
export function restoreConstruction(value) {
  if (value?.version !== 1 || !Array.isArray(value.buildings) || !Array.isArray(value.clearings) || value.buildings.length > 32 || value.clearings.length > 256 || !value.clearings.every(validFootprint)) return emptyConstruction();
  const state = emptyConstruction(); state.clearings = value.clearings.map(f => ({ minX: f.minX, minZ: f.minZ, maxX: f.maxX, maxZ: f.maxZ }));
  for (const b of value.buildings) {
    if (!Number.isSafeInteger(b.id) || b.id < 1 || b.type !== 'habitat' || !validFootprint(b.footprint) || !Number.isFinite(b.foundation?.top) || !Number.isFinite(b.foundation?.bottom) || b.foundation.top <= b.foundation.bottom || b.foundation.top - b.foundation.bottom > 1.45 || Math.abs(b.foundation.top) > 1000 || Math.abs(b.foundation.bottom) > 1000 || state.buildings.some(a => a.id === b.id || overlapsFootprint(a.footprint, b.footprint)) || !state.clearings.some(f => sameFootprint(f, b.footprint))) return emptyConstruction();
    state.buildings.push({ id: b.id, type: 'habitat', footprint: { ...b.footprint }, foundation: { top: b.foundation.top, bottom: b.foundation.bottom } });
  }
  state.nextId = Math.max(0, ...state.buildings.map(b => b.id)) + 1;
  return state;
}

export function loadConstructionStore(storage) {
  try { const data = JSON.parse(storage.getItem(PROBE_SAVE_KEY)); return new Map(Array.isArray(data) ? data.slice(-32).filter(e => Array.isArray(e) && typeof e[0] === 'string').map(([k, v]) => [k, restoreConstruction(v)]) : []); }
  catch { return new Map(); }
}
export function saveConstructionStore(storage, states) {
  try { storage.setItem(PROBE_SAVE_KEY, JSON.stringify([...states].slice(-32))); return true; }
  catch { return false; }
}
