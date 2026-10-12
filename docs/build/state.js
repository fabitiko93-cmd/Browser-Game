import { initializePower } from './power.js';
import { emptyTradeBoard } from './trade-board.js';
import { initializeGalaxy } from './realm-relations.js';
import { initialFactions, FOREIGN_FACILITIES } from './foreign.js';
import { initialRelationExtras } from './diplomacy.js';
import { initialEventSchedule } from './events.js';
import { initialGovernance } from './governance.js';
import { PLANET_SEEDS, FACTIONS, SAVE_VERSION, RESOURCE_KEYS } from './data.js';
import { initializeIntelligence } from './intelligence.js';
import { createWorld, legacyWorld, locationsOf, homePlanet, depositsFor, legacyDepositsFor } from './world.js';
import { PLANET_FACTORS } from './development-data.js';
export { terrainClassAt as terrainAt } from './surface.js';

export const makeStock = (overrides = {}) => Object.assign(Object.fromEntries(RESOURCE_KEYS.map(k => [k, 0])), overrides);
export function initialBuildings(prefix) {
  return [ ['habitat', 4, 7], ['habitat', 5, 7], ['habitat', 6, 7], ['farm', 4, 6], ['solar', 5, 6], ['mine', 6, 6], ['foundry', 4, 5], ['optics', 5, 5], ['lab', 6, 5], ['shipyard', 6, 8] ].map(([type, x, y], i) => ({ id: `${prefix}-b${i}`, type, x, y, remaining: 0, enabled: true, status: 'aktiv' }));
}
export function makePlanet(p) {
  const extra=p.owner&&p.owner!=='player'?(FOREIGN_FACILITIES[p.owner]??[]).map((type,i)=>({id:`${p.id}-civil${i}`,type,x:3+i,y:8,remaining:0,enabled:true,status:'aktiv'})):[];
  const base=p.owner?initialBuildings(p.id):[];
  if(p.owner&&p.owner!=='player'){
    // Early colonies specialize rather than duplicating complete industrial chains.
    const removed=p.kind==='Ozeanisch'?['mine','foundry','optics']:p.kind==='Kristallwelt'?['mine','foundry']:p.kind==='Vulkanisch'?['optics']:['crystal'];
    for(let i=base.length-1;i>=0;i--)if(removed.includes(base[i].type))base.splice(i,1);
  }
  const supply=p.owner&&p.owner!=='player'?{food:90+p.seed%90,ore:40+p.seed%70,alloy:50+p.seed%55,energy:65+p.seed%90,crystal:8+p.seed%25,optics:12+p.seed%30,weapons:10+p.seed%25,goods:20,medicine:8}:null;
  return { ...p, priority:'balanced', needs:[], localMarket:{cash:Math.min(150,p.population*.6),day:-1,sold:0}, stock: makeStock(supply ?? (p.owner ? { food: 180, ore: 160, alloy: 200, energy: 180, crystal: 30, optics: 60, weapons: 45 } : {})), buildings: p.owner ? [...base, ...(p.frontier && !p.expansion ? [['solar', 7, 5], ['crystal', 8, 5]].map(([type, x, y], i) => ({ id: `${p.id}-base${i}`, type, x, y, remaining: 0, enabled: true, status: 'aktiv' })) : []), ...extra] : [], queues: [], happiness: 72, defense: p.owner && p.owner !== 'player' ? (p.owner === 'aster' ? 35 : 24) : 0, garrison: p.owner && p.owner !== 'player' ? 30 : 0, net: {}, lastReport: null, shield: 0, destroyed: false };
}
export function createGame(options = {}) {
  const generated = options.legacy ? null : createWorld(options.seed);
  const planets = (generated?.seeds ?? PLANET_SEEDS).map(makePlanet);
  for (const p of planets.filter(p => p.startingWorld)) prepareStart(p);
  const home = planets.find(p => p.owner === 'player');
  const state = {
    factions:initialFactions(), contracts:[], tradeLedger:[], effects: [], eventSchedule: initialEventSchedule(0), strikes: [], destroyedSystems: [], milestones: [], governance: initialGovernance(), surveys: [], version: SAVE_VERSION, started: false, day: 0, dayProgress: 0, nextId: 1, credits: 800, science: 0,
    player: { name: FACTIONS.player.name, ideology: 'democracy', tax: .16, stability: 75, term: 60, rulingSupport: 55 },
    planets, world: generated?.world ?? legacyWorld(), tech: [], research: null,
    relations: { corona:{...initialRelationExtras(),score:10,war:false,trade:false},collective:{...initialRelationExtras(),score:5,war:false,trade:false},vanguard:{...initialRelationExtras(),score:-15,war:false,trade:false},ilyri: { ...initialRelationExtras(), score: 25, war: false, trade: false }, khepri: { ...initialRelationExtras(), score: -10, war: false, trade: false }, aster: { ...initialRelationExtras(), score: -55, war: false, trade: false } },
    fleets: [ { id: 'starter-c', name: 'NU Vigil', type: 'corvette', owner: 'player', planetId: 'nereid', hp: 100, supply: 100, servicing:false, supplySettings:{threshold:40,target:95,repairBelow:50,repairTo:95,homePort:'nereid',smart:false}, cargo:makeStock(), mission: null, route: null }, { id: 'starter-f', name: 'NU Meridian', type: 'freighter', owner: 'player', planetId: 'nereid', hp: 100, supply: 100, servicing:false, supplySettings:{threshold:40,target:95,repairBelow:50,repairTo:95,homePort:'nereid',smart:false}, cargo:makeStock(), mission: null, route: null } ],
    logs: [{ day: 0, text: 'Nereid ist bereit. Baue deine Wirtschaft auf und erschließe die Sterne.', type: 'info' }], event: null, aiNext: 45
  };
  for (const f of state.fleets) { f.planetId = home.id; f.supplySettings.homePort = home.id; }
  state.logs[0].text = `${home.name} ist bereit. Baue deine Wirtschaft auf und erschließe die Sterne.`;
  for(const id of Object.keys(FACTIONS))if(id!=='player'&&!state.relations[id])state.relations[id]={...initialRelationExtras(),score:15,war:false,trade:false};
  initializeIntelligence(state);
  initializeGalaxy(state);
  initializePower(state);
  for(const p of planets){p.deposits??=legacyDepositsFor(p);p.tradeBoard=emptyTradeBoard(0,!options.legacy&&p.owner==='player');}
  state.communications = { messages: [], cooldowns: {}, nextOffer: 12, cursor: 0 };
  return state;
}
export function uid(state, prefix) { return `${prefix}-${state.nextId++}`; }
export function log(state, text, type = 'info', sound = null) {
  state.logs.unshift({ day: state.day, text, type, ...(sound ? {sound} : {}) });
  state.logs = state.logs.slice(0, 60);
}
export const getPlanet = (state, id) => locationsOf(state).find(p => p.id === id);
export const ownedPlanets = state => state.planets.filter(p => p.owner === 'player');
export function canAfford(state, planet, cost, owner = 'player') { return Object.entries(cost).every(([k, v]) => (k === 'credits' ? owner === 'player' ? state.credits : state.factions[owner].credits : planet.stock[k] ?? 0) + 1e-8 >= v); }
export function pay(state, planet, cost, owner = 'player') { for (const [k, v] of Object.entries(cost)) { if (k === 'credits') { if (owner === 'player') state.credits -= v; else state.factions[owner].credits -= v; } else planet.stock[k] -= v; } }
export function dateLabel(day) { const d = new Date(Date.UTC(3077, 0, 1 + day)); return `${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${d.getUTCFullYear()}`; }

function prepareStart(p) {
  p.priority = 'supply';
  const empty = [[7,6],[8,6],[7,7],[8,7],[7,9],[8,9],[3,9],[4,9],[5,9],[6,9]].filter(([x,y]) => !p.buildings.some(b => b.x === x && b.y === y));
  const add = type => { const [x,y] = empty.shift(); p.buildings.push({id:`${p.id}-start-${type}-${x}`,type,x,y,remaining:0,enabled:true,status:'aktiv'}); };
  const food = PLANET_FACTORS[p.kind]?.food ?? 1;
  while (p.buildings.filter(b=>b.type==='farm').length*16*food < p.population*.065) add('farm');
  const energyNeed = 24 + p.buildings.filter(b=>b.type==='farm').length*2;
  while (p.buildings.filter(b=>b.type==='solar').length*26*p.solarFactor < energyNeed) add('solar');
  p.stock.food = Math.max(p.stock.food, p.population*2);
  p.stock.energy = Math.max(p.stock.energy, 200);
  for(const [key,types]of Object.entries({ore:['mine','deepMine'],crystal:['crystal'],fuel:['fuelExtractor']}))p.deposits[key]=Math.max(p.deposits[key],p.buildings.filter(b=>types.includes(b.type)).length);
}
