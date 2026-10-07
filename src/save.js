import { technologyEffects } from './technology.js';
import { LAWS, DECISIONS, initialGovernance } from './governance.js';
import { SAVE_VERSION, BUILDINGS, SHIPS, IDEOLOGIES, RESOURCE_KEYS, TECHNOLOGIES, PLANET_SEEDS, FACTIONS, SYSTEMS, GRID } from './data.js';
const KEY = 'orbit3077-save';
export function validateSave(value) {
  if ([1, 2].includes(value?.version)) {
    value = structuredClone(value);
    if (value.version === 1) { value.governance = initialGovernance(); value.surveys = []; }
    if (Array.isArray(value.tech)) {
      if (value.tech.some(id => !['fusion', 'lasers', 'propulsion', 'habitats'].includes(id))) throw new Error('Ungültige Forschung im alten Spielstand.');
      const completed = new Set(value.tech);
      for (const id of [...completed, value.research?.id].filter(Boolean)) for (const required of TECHNOLOGIES[id]?.requires ?? []) completed.add(required);
      value.tech = [...completed];
    }
    value.version = SAVE_VERSION; value.lastDayReport = null;
  }
  const finite = (v, min = 0, max = 1e12) => Number.isFinite(v) && v >= min && v <= max;
  const text = (v, max = 100) => typeof v === 'string' && v.length > 0 && v.length <= max;
  const known = (dict, key) => typeof key === 'string' && Object.hasOwn(dict, key);
  const validCargo = (cargo, capacity) => !cargo || RESOURCE_KEYS.includes(cargo.resource) && finite(cargo.amount, 1, capacity);
  if (!value || value.version !== SAVE_VERSION || !Array.isArray(value.planets) || value.planets.length !== PLANET_SEEDS.length || !Array.isArray(value.fleets) || value.fleets.length > 2000) throw new Error('Unbekanntes Spielstandformat.');
  if (!Number.isInteger(value.day) || !finite(value.day, 0, 1e6) || !finite(value.credits) || !finite(value.science) || !Number.isInteger(value.nextId) || !finite(value.nextId, 1) || typeof value.started !== 'boolean' || !known(IDEOLOGIES, value.player?.ideology) || !text(value.player.name, 32) || !finite(value.player.tax, 0, .5) || !finite(value.player.stability, 0, 100) || !finite(value.player.rulingSupport, 0, 100) || !finite(value.player.term) || !finite(value.aiNext)) throw new Error('Der Spielstand enthält ungültige Werte.');
  const g = value.governance;
  if (!g || !g.laws || Object.keys(g.laws).length !== Object.keys(LAWS).length || Object.entries(LAWS).some(([id, law]) => !known(law.options, g.laws[id])) || !finite(g.lawReady, 0, value.day + 5) || !Array.isArray(g.decisions) || g.decisions.length > Object.keys(DECISIONS).length || new Set(g.decisions.map(d => d.id)).size !== g.decisions.length || g.decisions.some(d => !known(DECISIONS, d.id) || !finite(d.until, value.day, value.day + DECISIONS[d.id].duration)) || !g.cooldowns || typeof g.cooldowns !== 'object' || Array.isArray(g.cooldowns) || Object.entries(g.cooldowns).some(([id, until]) => !known(DECISIONS, id) || !finite(until, 0, value.day + DECISIONS[id].cooldown))) throw new Error('Ungültige Regierungspolitik.');
  if (!Array.isArray(value.surveys) || new Set(value.surveys).size !== value.surveys.length || value.surveys.some(id => !PLANET_SEEDS.some(p => p.id === id))) throw new Error('Ungültige Erkundungsdaten.');
  if (!Array.isArray(value.tech) || value.tech.length > Object.keys(TECHNOLOGIES).length || new Set(value.tech).size !== value.tech.length || value.tech.some(t => !known(TECHNOLOGIES, t))) throw new Error('Ungültige Forschung.');
  if (value.tech.some(id => TECHNOLOGIES[id].requires.some(required => !value.tech.includes(required)) || TECHNOLOGIES[id].requiresAny && !TECHNOLOGIES[id].requiresAny.some(required => value.tech.includes(required)) || (TECHNOLOGIES[id].excludes ?? []).some(other => value.tech.includes(other)))) throw new Error('Ungültige Forschungsabhängigkeiten.');
  if (value.research && (!known(TECHNOLOGIES, value.research.id) || !Number.isInteger(value.research.total) || !finite(value.research.total, 2, 30) || !Number.isInteger(value.research.remaining) || !finite(value.research.remaining, 1, value.research.total) || value.tech.includes(value.research.id) || TECHNOLOGIES[value.research.id].requires.some(required => !value.tech.includes(required)) || TECHNOLOGIES[value.research.id].requiresAny && !TECHNOLOGIES[value.research.id].requiresAny.some(required => value.tech.includes(required)) || (TECHNOLOGIES[value.research.id].excludes ?? []).some(other => value.tech.includes(other)))) throw new Error('Ungültiger Forschungsauftrag.');
  for (const id of Object.keys(FACTIONS).filter(id => id !== 'player')) {
    const rel = value.relations?.[id];
    if (!rel || !finite(rel.score, -100, 100) || typeof rel.war !== 'boolean' || typeof rel.trade !== 'boolean' || rel.war && rel.trade) throw new Error('Ungültige diplomatische Beziehungen.');
  }
  if (Object.keys(value.relations).length !== 3 || !Array.isArray(value.logs) || value.logs.length > 60 || value.logs.some(e => !finite(e.day, 0, value.day) || !text(e.text, 600) || !text(e.type, 24))) throw new Error('Ungültiges Kommandoprotokoll.');
  const ids = new Set();
  for (const p of value.planets) {
    if (!PLANET_SEEDS.some(seed => seed.id === p.id) || ids.has(p.id) || !text(p.name, 64) || !SYSTEMS.some(s => s.id === p.system) || (p.owner !== null && !known(FACTIONS, p.owner)) || !finite(p.population) || !finite(p.happiness, 0, 100) || !finite(p.defense) || !finite(p.garrison) || !finite(p.aliens, 0, 1) || !finite(p.oreFactor, .1, 10) || !finite(p.solarFactor, .1, 10) || !Number.isInteger(p.seed) || !finite(p.orbit, 0, 4) || !text(p.kind, 40) || !/^#[a-f0-9]{6}$/i.test(p.color) || !Array.isArray(p.buildings) || p.buildings.length > GRID.width * GRID.height || !Array.isArray(p.queues) || p.queues.length > 3) throw new Error('Ungültiger Planet.');
    ids.add(p.id);
    for (const k of RESOURCE_KEYS) if (!Number.isFinite(p.stock?.[k]) || p.stock[k] < 0) throw new Error('Ungültiger Warenbestand.');
    const tiles = new Set(), buildings = new Set();
    for (const b of p.buildings) {
      if (!known(BUILDINGS, b.type) || !text(b.id, 64) || buildings.has(b.id) || !Number.isInteger(b.x) || !finite(b.x, 0, GRID.width - 1) || !Number.isInteger(b.y) || !finite(b.y, 0, GRID.height - 1) || !finite(b.remaining, 0, 30) || typeof b.enabled !== 'boolean' || !text(b.status, 64) || tiles.has(`${b.x},${b.y}`)) throw new Error('Ungültiges Gebäude.');
      buildings.add(b.id); tiles.add(`${b.x},${b.y}`);
    }
    for (const q of p.queues) if (!known(SHIPS, q.type) || !finite(q.remaining, 1, 30) || !text(q.id, 64)) throw new Error('Ungültiger Werftauftrag.');
  }
  const fleetIds = new Set();
  for (const f of value.fleets) {
    if (!known(SHIPS, f.type) || !ids.has(f.planetId) || !text(f.id, 64) || fleetIds.has(f.id) || !text(f.name, 64) || !known(FACTIONS, f.owner) || !finite(f.hp, 0, 100) || !finite(f.supply, 0, 100)) throw new Error('Ungültige Flotte.');
    fleetIds.add(f.id);
    const m = f.mission, r = f.route;
    if (m && (!ids.has(m.target) || !ids.has(m.source) || m.target === m.source || !finite(m.remaining, 1, m.total) || !finite(m.total, 1, 100) || !text(m.group, 64) || !['move', 'settle', 'attack', 'transport', 'return-cargo', 'survey'].includes(m.kind) || !validCargo(m.cargo, Math.floor(SHIPS[f.type].cargo * technologyEffects(value).cargoCapacity)))) throw new Error('Ungültiger Flottenauftrag.');
    if (r && (!SHIPS[f.type].cargo || !ids.has(r.source) || !ids.has(r.target) || r.source === r.target || !RESOURCE_KEYS.includes(r.resource) || !finite(r.amount, 1, Math.floor(SHIPS[f.type].cargo * technologyEffects(value).cargoCapacity)))) throw new Error('Ungültige Handelsroute.');
  }
  if (!value.planets.some(p => p.owner === 'player')) throw new Error('Der Spielstand enthält keinen eigenen Planeten.');
  if (value.event && (!['signal', 'storm', 'migration'].includes(value.event.kind) || !ids.has(value.event.planet))) throw new Error('Ungültige Meldung.');
  if (value.lastDayReport != null) {
    const b = value.lastDayReport;
    if (!finite(b.day, 0, value.day) || !['income', 'buildings', 'fleets', 'science', 'unfunded'].every(k => finite(b[k])) || !['net', 'actual', 'oneOff'].every(k => finite(b[k], -1e12, 1e12)) || !b.resources || Object.entries(b.resources).some(([id, rates]) => !ids.has(id) || RESOURCE_KEYS.some(k => !finite(rates[k]?.recurring, -1e12, 1e12) || !finite(rates[k]?.oneOff, -1e12, 1e12)))) throw new Error('Ungültige Haushaltsabrechnung.');
  }
  return value;
}
export function loadGame(storage = globalThis.localStorage) { const raw = storage.getItem(KEY); return raw ? validateSave(JSON.parse(raw)) : null; }
export function saveGame(state, storage = globalThis.localStorage) { storage.setItem(KEY, JSON.stringify(state)); }
export function parseImport(raw) { return validateSave(JSON.parse(raw)); }
export const exportGame = state => JSON.stringify(state, null, 2);
