import { initialFactions, FOREIGN_FACILITIES } from './foreign.js';
import { initialRelationExtras } from './diplomacy.js';
import { initialEventSchedule } from './events.js';
import { initialGovernance } from './governance.js';
import { PLANET_SEEDS, FACTIONS, SAVE_VERSION, RESOURCE_KEYS } from './data.js';
import { initializeIntelligence } from './intelligence.js';
export { terrainClassAt as terrainAt } from './surface.js';

export const makeStock = (overrides = {}) => Object.assign(Object.fromEntries(RESOURCE_KEYS.map(k => [k, 0])), overrides);
export function initialBuildings(prefix) {
  return [ ['habitat', 4, 7], ['habitat', 5, 7], ['habitat', 6, 7], ['farm', 4, 6], ['solar', 5, 6], ['mine', 6, 6], ['foundry', 4, 5], ['optics', 5, 5], ['lab', 6, 5], ['shipyard', 6, 8] ].map(([type, x, y], i) => ({ id: `${prefix}-b${i}`, type, x, y, remaining: 0, enabled: true, status: 'aktiv' }));
}
export function makePlanet(p) {
  const extra=p.owner&&p.owner!=='player'?FOREIGN_FACILITIES[p.owner].map((type,i)=>({id:`${p.id}-civil${i}`,type,x:3+i,y:8,remaining:0,enabled:true,status:'aktiv'})):[];
  return { ...p, priority:'balanced', needs:[], stock: makeStock(p.owner ? { food: 180, ore: 160, alloy: 200, energy: 180, crystal: 30, optics: 60, weapons: 45 } : {}), buildings: p.owner ? [...initialBuildings(p.id), ...(p.frontier ? [['solar', 7, 5], ['shield', 7, 7], ['missileSilo', 7, 6], ['crystal', 8, 5], ['laser', 8, 6]].map(([type, x, y], i) => ({ id: `${p.id}-base${i}`, type, x, y, remaining: 0, enabled: true, status: 'aktiv' })) : []), ...extra] : [], queues: [], happiness: 72, defense: p.owner && p.owner !== 'player' ? (p.owner === 'aster' ? 35 : 24) : 0, garrison: p.owner && p.owner !== 'player' ? 30 : 0, net: {}, lastReport: null, shield: 0, destroyed: false };
}
export function createGame() {
  const planets = PLANET_SEEDS.map(makePlanet);
  const state = {
    factions:initialFactions(), contracts:[], tradeLedger:[], effects: [], eventSchedule: initialEventSchedule(0), strikes: [], destroyedSystems: [], milestones: [], governance: initialGovernance(), surveys: [], version: SAVE_VERSION, started: false, day: 0, nextId: 1, credits: 800, science: 0,
    player: { name: FACTIONS.player.name, ideology: 'democracy', tax: .16, stability: 75, term: 60, rulingSupport: 55 },
    planets, tech: [], research: null,
    relations: { corona:{...initialRelationExtras(),score:10,war:false,trade:false},collective:{...initialRelationExtras(),score:5,war:false,trade:false},vanguard:{...initialRelationExtras(),score:-15,war:false,trade:false},ilyri: { ...initialRelationExtras(), score: 25, war: false, trade: false }, khepri: { ...initialRelationExtras(), score: -10, war: false, trade: false }, aster: { ...initialRelationExtras(), score: -55, war: false, trade: false } },
    fleets: [ { id: 'starter-c', name: 'NU Vigil', type: 'corvette', owner: 'player', planetId: 'nereid', hp: 100, supply: 100, servicing:false, supplySettings:{threshold:40,target:95,repairBelow:50,repairTo:95,homePort:'nereid',smart:false}, cargo:makeStock(), mission: null, route: null }, { id: 'starter-f', name: 'NU Meridian', type: 'freighter', owner: 'player', planetId: 'nereid', hp: 100, supply: 100, servicing:false, supplySettings:{threshold:40,target:95,repairBelow:50,repairTo:95,homePort:'nereid',smart:false}, cargo:makeStock(), mission: null, route: null } ],
    logs: [{ day: 0, text: 'Nereid ist bereit. Baue deine Wirtschaft auf und erschließe die Sterne.', type: 'info' }], event: null, aiNext: 45
  };
  initializeIntelligence(state);
  state.communications = { messages: [], cooldowns: {}, nextOffer: 12, cursor: 0 };
  return state;
}
export function uid(state, prefix) { return `${prefix}-${state.nextId++}`; }
export function log(state, text, type = 'info', sound = null) {
  state.logs.unshift({ day: state.day, text, type, ...(sound ? {sound} : {}) });
  state.logs = state.logs.slice(0, 60);
}
export const getPlanet = (state, id) => state.planets.find(p => p.id === id);
export const ownedPlanets = state => state.planets.filter(p => p.owner === 'player');
export function canAfford(state, planet, cost, owner = 'player') { return Object.entries(cost).every(([k, v]) => (k === 'credits' ? owner === 'player' ? state.credits : state.factions[owner].credits : planet.stock[k] ?? 0) + 1e-8 >= v); }
export function pay(state, planet, cost, owner = 'player') { for (const [k, v] of Object.entries(cost)) { if (k === 'credits') { if (owner === 'player') state.credits -= v; else state.factions[owner].credits -= v; } else planet.stock[k] -= v; } }
export function dateLabel(day) { const d = new Date(Date.UTC(3077, 0, 1 + day)); return `${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${d.getUTCFullYear()}`; }
