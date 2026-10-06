import { initialGovernance } from './governance.js';
import { PLANET_SEEDS, FACTIONS, GRID, SAVE_VERSION, RESOURCE_KEYS } from './data.js';

export const makeStock = (overrides = {}) => Object.assign(Object.fromEntries(RESOURCE_KEYS.map(k => [k, 0])), overrides);
export function terrainAt(planet, x, y) {
  if (x < 0 || y < 0 || x >= GRID.width || y >= GRID.height) return 'void';
  const n = ((x * 37 + y * 53 + planet.seed * 17) % 101) / 101;
  if ((x < 2 && y > 7) || (x > 9 && y < 4)) return planet.kind === 'Ozeanisch' ? 'water' : 'cliff';
  return n < .1 ? 'rock' : n < .32 ? 'rough' : 'ground';
}
export function initialBuildings(prefix) {
  return [ ['habitat', 4, 7], ['habitat', 5, 7], ['habitat', 6, 7], ['farm', 4, 6], ['solar', 5, 6], ['mine', 6, 6], ['foundry', 4, 5], ['optics', 5, 5], ['lab', 6, 5], ['shipyard', 6, 8] ].map(([type, x, y], i) => ({ id: `${prefix}-b${i}`, type, x, y, remaining: 0, enabled: true, status: 'aktiv' }));
}
export function createGame() {
  const planets = PLANET_SEEDS.map(p => ({ ...p, stock: makeStock(p.owner ? { food: 180, ore: 160, alloy: 200, energy: 180, crystal: 30, optics: 60, weapons: 45 } : {}), buildings: p.owner ? initialBuildings(p.id) : [], queues: [], happiness: 72, defense: p.owner && p.owner !== 'player' ? (p.owner === 'aster' ? 35 : 24) : 0, garrison: p.owner && p.owner !== 'player' ? 30 : 0, net: {}, lastReport: null }));
  return {
    governance: initialGovernance(), surveys: [], version: SAVE_VERSION, started: false, day: 0, nextId: 1, credits: 800, science: 0,
    player: { name: FACTIONS.player.name, ideology: 'democracy', tax: .16, stability: 75, term: 60, rulingSupport: 55 },
    planets, tech: [], research: null,
    relations: { ilyri: { score: 25, war: false, trade: false }, khepri: { score: -10, war: false, trade: false }, aster: { score: -55, war: false, trade: false } },
    fleets: [ { id: 'starter-c', name: 'NU Vigil', type: 'corvette', owner: 'player', planetId: 'nereid', hp: 100, supply: 100, mission: null, route: null }, { id: 'starter-f', name: 'NU Meridian', type: 'freighter', owner: 'player', planetId: 'nereid', hp: 100, supply: 100, mission: null, route: null } ],
    logs: [{ day: 0, text: 'Nereid ist bereit. Baue deine Wirtschaft auf und erschließe die Sterne.', type: 'info' }], event: null, aiNext: 45
  };
}
export function uid(state, prefix) { return `${prefix}-${state.nextId++}`; }
export function log(state, text, type = 'info') {
  state.logs.unshift({ day: state.day, text, type });
  state.logs = state.logs.slice(0, 60);
}
export const getPlanet = (state, id) => state.planets.find(p => p.id === id);
export const ownedPlanets = state => state.planets.filter(p => p.owner === 'player');
export function canAfford(state, planet, cost) { return Object.entries(cost).every(([k, v]) => (k === 'credits' ? state.credits : planet.stock[k] ?? 0) + 1e-8 >= v); }
export function pay(state, planet, cost) { for (const [k, v] of Object.entries(cost)) { if (k === 'credits') state.credits -= v; else planet.stock[k] -= v; } }
export function dateLabel(day) { const d = new Date(Date.UTC(3077, 0, 1 + day)); return `${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${d.getUTCFullYear()}`; }
