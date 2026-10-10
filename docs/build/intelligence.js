import { baseStats } from './strategic.js';
import { fleetStrength } from './fleets.js';
import { relationBetween } from './realm-relations.js';
import { FACTIONS, SYSTEMS, PLANET_SEEDS, BUILDINGS } from './data.js';

export const KNOWLEDGE_DOMAINS = ['occupancy', 'identity', 'geology', 'surface', 'civil', 'installations', 'military'];
export const KNOWLEDGE_SOURCES = { news: 'Öffentliches Nachrichtenregister', contact: 'Diplomatischer Kontakt', scout: 'Erkundung', probe: 'Analysesonde', visit: 'Hafenbesuch', combat: 'Gefechtsbeobachtung', legacy: 'Frühere Reise', own: 'Eigene Verwaltung' };
const network = () => SYSTEMS.filter(s => !s.uncharted).map(s => s.id);
const observation = (value, day, source, precision = 'observed') => ({ value: structuredClone(value), day, source, precision });
export function initializeIntelligence(state, legacy = false) {
  state.intelligence = Object.fromEntries(Object.keys(FACTIONS).map((id, index) => [id, {
    chartedSystems: network(), routes: [], planets: {}, nextMission: state.day + 18 + (index % 6) * 7
  }]));
  for (const id of Object.keys(FACTIONS)) {
    // Existing diplomatic addresses reveal capitals, never their economies or governments.
    for (const faction of Object.keys(FACTIONS)) {
      const capital = state.planets.find(p => p.owner === faction && !p.destroyed);
      if (capital && !SYSTEMS.find(s => s.id === capital.system)?.uncharted) recordContact(state, id, capital, 'contact');
    }
    for (const p of state.planets.filter(p => p.owner === id)) chartSystem(state, id, p.system);
  }
  if (legacy) {
    for (const id of state.surveys ?? []) {
      const p = state.planets.find(p => p.id === id);
      if (p) { chartSystem(state, 'player', p.system); observePlanet(state, 'player', p, 'scout'); }
    }
    for (const f of state.fleets ?? []) {
      const p = state.planets.find(p => p.id === f.planetId);
      if (p) { chartSystem(state, f.owner, p.system); if (!f.mission) observePlanet(state, f.owner, p, f.type === 'scout' ? 'scout' : 'legacy'); }
      for (const pid of [f.mission?.target, ...(f.route?.type === 'circuit' ? f.route.stops.map(s => s.planet) : [f.route?.source, f.route?.target])].filter(Boolean)) {
        const q = state.planets.find(p => p.id === pid); if (q) {chartSystem(state, f.owner, q.system);recordContact(state,f.owner,q,'legacy');}
      }
    }
  }
}
export function chartSystem(state, viewer, systemId, from = null) {
  const book = state.intelligence?.[viewer]; if (!book) return;
  if (!book.chartedSystems.includes(systemId)) book.chartedSystems.push(systemId);
  if (from && from !== systemId && !book.routes.some(r => r.from === from && r.to === systemId || r.to === from && r.from === systemId)) book.routes.push({ from, to: systemId, day: state.day });
}
export const systemKnown = (state, systemId, viewer = 'player') => Boolean(state.intelligence?.[viewer]?.chartedSystems.includes(systemId));
export const reachablePlanet = (state, p, viewer = 'player') => Boolean(p && systemKnown(state, p.system, viewer));
export const portKnown = (state,p,viewer='player') => reachablePlanet(state,p,viewer)&&Boolean(p.owner)&&(p.owner===viewer||state.intelligence[viewer].planets[p.id]?.identity?.value===p.owner);
function put(state, viewer, planet, fields, source, precision = 'observed') {
  const book = state.intelligence?.[viewer]; if (!book) return;
  const record = book.planets[planet.id] ??= {};
  for (const [key, value] of Object.entries(fields)) record[key] = observation(value, state.day, source, precision);
}
export function recordContact(state, viewer, p, source = 'contact') {
  const plan=state.galaxy?.strategies[viewer]?.warPlan;
  if(plan?.target===p.id&&plan.enemy!==p.owner)state.galaxy.strategies[viewer].warPlan=null;
  put(state, viewer, p, { occupancy: Boolean(p.owner), identity: p.owner }, source, ['contact','news'].includes(source) ? 'reported' : 'observed');
}
export function observePlanet(state, viewer, p, source) {
  if (source === 'scout') { put(state, viewer, p, { occupancy: Boolean(p.owner) }, source); return; }
  if (source === 'probe') {
    put(state, viewer, p, { occupancy: Boolean(p.owner), geology: { oreFactor: p.oreFactor, solarFactor: p.solarFactor }, surface: { seed: p.seed, kind: p.kind } }, source);
    return;
  }
  recordContact(state, viewer, p, source);
  if (source === 'visit' || source === 'legacy') {
    put(state, viewer, p, { geology: { oreFactor: p.oreFactor, solarFactor: p.solarFactor }, surface: { seed: p.seed, kind: p.kind },
      civil: { population: p.population, happiness: p.happiness, aliens: p.aliens, ideology: p.owner === 'player' ? state.player.ideology : FACTIONS[p.owner]?.ideology ?? null },
      installations: p.buildings.filter(b => !['Planetare Basen', 'Militär'].includes(BUILDINGS[b.type].group))
    }, source);
  }
  if (source === 'combat') put(state, viewer, p, { military: { defense: p.defense, shield: p.shield, garrison: p.garrison, orbital: baseStats(state,p).orbital, fortification: baseStats(state,p).fortification, fleetStrength: state.fleets.filter(f=>f.owner===p.owner&&!f.mission&&f.planetId===p.id).reduce((n,f)=>n+fleetStrength(state,f),0) } }, source, 'estimate');
}
export function knowledgeOf(state, p, viewer = 'player') {
  if (!p || !reachablePlanet(state, p, viewer)) return {};
  if (p.owner !== viewer) return state.intelligence?.[viewer]?.planets[p.id] ?? {};
  const fields = { occupancy: true, identity: viewer, geology: { oreFactor: p.oreFactor, solarFactor: p.solarFactor }, surface: { seed: p.seed, kind: p.kind },
    civil: { population: p.population, happiness: p.happiness, aliens: p.aliens, ideology: viewer === 'player' ? state.player.ideology : FACTIONS[viewer].ideology },
    installations: p.buildings, military: { defense: p.defense, shield: p.shield, garrison: p.garrison } };
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, { value, day: state.day, source: 'own', precision: 'exact' }]));
}
export function rememberOwnedPlanet(state,p) {
  const viewer=p.owner,book=state.intelligence?.[viewer];if(!viewer||!book)return;
  const own=knowledgeOf(state,p,viewer),record=book.planets[p.id]??={};
  for(const key of ['geology','surface','installations','military'])record[key]=structuredClone(own[key]);
}
export function planetView(state, p, viewer = 'player') {
  if (!reachablePlanet(state, p, viewer)) return null;
  const k = knowledgeOf(state, p, viewer);
  // This is the shared presentation boundary. No mutable foreign economic fields pass it.
  const view = { id: p.id, name: p.name, system: p.system, kind: p.kind, color: p.color, orbit: p.orbit,
    destroyed: p.destroyed, owner: k.identity?.value ?? null, inhabited: k.occupancy?.value ?? null,
    knowledge: k, surfaceKnown: Boolean(k.surface), own: p.owner === viewer };
  if (k.surface) Object.assign(view, k.surface.value);
  if (k.geology) Object.assign(view, k.geology.value);
  if (k.civil) Object.assign(view, k.civil.value);
  if (k.military) Object.assign(view, k.military.value);
  view.buildings = k.installations?.value ?? [];
  return view;
}
export function visitArrival(state, fleet, p) {
  const viewer = fleet.owner;
  if (fleet.type === 'scout') { observePlanet(state, viewer, p, 'scout'); return; }
  if (fleet.type === 'probe') return;
  const rel = relationBetween(state,viewer,p.owner);
  observePlanet(state, viewer, p, rel?.trade && !rel.war && !rel.embargo ? 'visit' : 'contact');
}
export const knownTargets = (state, viewer = 'player') => state.planets.map(p => planetView(state, p, viewer)).filter(Boolean);
export function knowledgeStale(state, field, domain) {
  return Boolean(field && ['civil', 'military', 'installations', 'identity', 'occupancy'].includes(domain) && state.day - field.day > (domain === 'military' ? 12 : ['identity','occupancy'].includes(domain) ? 60 : 30));
}
export const networkSeeds = () => PLANET_SEEDS.filter(p => !SYSTEMS.find(s => s.id === p.system)?.uncharted);
