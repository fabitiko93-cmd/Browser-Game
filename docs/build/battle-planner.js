import { SHIPS } from './data.js';
import { STRATEGIC_MODELS } from './battle-models.js';

export const PLANNER_SAVE_KEY = 'orbit3077-trial-plan';
export const PLAN_LIMIT = 50;
export const FORMATIONS = { staggered: 'Gestaffelt', wedge: 'Keil', line: 'Linie', column: 'Kolonne' };
export const PLAN_SIDES = ['friendly', 'enemy'];
const presets = { '20v20': [20, 20], '5v35': [5, 35], '35v5': [35, 5], '50v50': [50, 50] };
const pattern = ['cruiser', 'destroyer', 'corvette', 'corvette', 'corvette', 'destroyer', 'corvette', 'corvette', 'destroyer', 'corvette'];
const length = s => STRATEGIC_MODELS[s.type][1];
const mean = points => points.length ? [0, 1, 2].map(a => points.reduce((n, p) => n + p[a], 0) / points.length) : [0, 0, 0];
const rotate = (p, degrees) => { const a = degrees * Math.PI / 180; return [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], p[2] * Math.cos(a) - p[0] * Math.sin(a)]; };
const add = (a, b) => a.map((v, i) => v + b[i]);
function noise(seed, id, axis) {
  let h = seed >>> 0;
  for (const c of `${id}:${axis}`) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  h ^= h >>> 16; h = Math.imul(h, 0x45d9f3b); h ^= h >>> 16;
  return (h >>> 0) / 4294967295 * 2 - 1;
}

function slots(count, formation, spacing) {
  const columns = Math.ceil(Math.sqrt(count) * 1.2), points = [];
  for (let i = 0; i < count; i++) {
    if (formation === 'line') points.push([i * spacing, 0, 0]);
    else if (formation === 'column') points.push([0, 0, i * spacing]);
    else if (formation === 'wedge') points.push(i ? [(i % 2 ? -1 : 1) * Math.ceil(i / 2) * spacing, 0, Math.ceil(i / 2) * spacing * .72] : [0, 0, 0]);
    else points.push([(i % columns + (Math.floor(i / columns) % 2) * .45) * spacing, 0, Math.floor(i / columns) * spacing * .92]);
  }
  const center = mean(points);
  return points.map(p => p.map((v, a) => v - center[a]));
}

export function planFromRosters(rosters, scenario = '20v20', seed = 3077) {
  const plan = { version: 1, seed, scenario, nextId: 101, sides: {} };
  for (const side of PLAN_SIDES) {
    const fleet = { formation: 'staggered', spacing: 1, heading: 0, supply: 100, groups: [], ships: [] };
    for (const source of rosters[side]) {
      let group = fleet.groups.find(g => g.type === source.type && fleet.ships.filter(s => s.groupId === g.id).length < 8);
      if (!group) {
        const n = fleet.groups.filter(g => g.type === source.type).length + 1;
        group = { id: `${side}-g${fleet.groups.length + 1}`, name: `${SHIPS[source.type].name} ${n}`, type: source.type, formation: source.type === 'cruiser' ? 'wedge' : 'staggered', spacing: 1, scatter: .65, heading: 0, offset: null };
        fleet.groups.push(group);
      }
      fleet.ships.push({ id: source.id, name: source.name, type: source.type, groupId: group.id, offset: null });
    }
    // Group type is only used to build the initial organization, not a restriction.
    for (const g of fleet.groups) delete g.type;
    plan.sides[side] = fleet;
  }
  return plan;
}
export function createTrialPlan(scenario = '20v20', seed = 3077) {
  if (!Object.hasOwn(presets, scenario)) throw new Error('Unbekannte Testvorlage.');
  const rosters = {};
  PLAN_SIDES.forEach((side, index) => { rosters[side] = Array.from({ length: presets[scenario][index] }, (_, i) => ({ id: `${side}-${i + 1}`, type: pattern[i % pattern.length], name: `${i === 0 ? side === 'friendly' ? 'Harbinger' : 'Nemesis' : SHIPS[pattern[i % pattern.length]].name} ${i + 1}` })); });
  return planFromRosters(rosters, scenario, seed);
}

export function validateTrialPlan(value) {
  const fail = () => { throw new Error('Ungültige Flottenplanung. Wähle eine neue Testvorlage.'); };
  const num = (v, lo, hi) => Number.isFinite(v) && v >= lo && v <= hi;
  const text = (v, max = 80) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
  const id = v => typeof v === 'string' && /^[a-zA-Z0-9:_-]{1,100}$/.test(v);
  const vector = v => v === null || Array.isArray(v) && v.length === 3 && v.every(n => num(n, -6000, 6000));
  if (!value || value.version !== 1 || !Object.hasOwn(presets, value.scenario) || !Number.isInteger(value.seed) || !num(value.seed, 0, 4294967295)
    || !Number.isInteger(value.nextId) || !num(value.nextId, 1, 1e9) || !value.sides) fail();
  const groups = new Set(), ships = new Set();
  for (const side of PLAN_SIDES) {
    const f = value.sides[side];
    if (!f || !Object.hasOwn(FORMATIONS, f.formation) || !num(f.spacing, .7, 2) || !num(f.heading, -180, 180) || !num(f.supply, 0, 100)
      || !Array.isArray(f.groups) || f.groups.length < 1 || f.groups.length > PLAN_LIMIT || !Array.isArray(f.ships) || f.ships.length < 1 || f.ships.length > PLAN_LIMIT) fail();
    const local = new Set();
    for (const g of f.groups) {
      if (!g || !id(g.id) || groups.has(g.id) || !text(g.name) || !Object.hasOwn(FORMATIONS, g.formation) || !num(g.spacing, .7, 2)
        || !num(g.scatter, 0, 1) || !num(g.heading, -180, 180) || !vector(g.offset)) fail();
      groups.add(g.id); local.add(g.id);
    }
    for (const s of f.ships) {
      if (!s || !id(s.id) || ships.has(s.id) || !text(s.name, 160) || !Object.hasOwn(STRATEGIC_MODELS, s.type) || !local.has(s.groupId) || !vector(s.offset)) fail();
      ships.add(s.id);
    }
  }
  // Return only the supported schema; unknown fields cannot enter battle data.
  const clean = { version: 1, seed: value.seed, scenario: value.scenario, nextId: value.nextId, sides: {} };
  for (const side of PLAN_SIDES) {
    const f = value.sides[side]; clean.sides[side] = { formation: f.formation, spacing: f.spacing, heading: f.heading, supply: f.supply,
      groups: f.groups.map(g => ({ id: g.id, name: g.name, formation: g.formation, spacing: g.spacing, scatter: g.scatter, heading: g.heading, offset: g.offset && [...g.offset] })),
      ships: f.ships.map(s => ({ id: s.id, name: s.name, type: s.type, groupId: s.groupId, offset: s.offset && [...s.offset] })) };
  }
  return clean;
}

export function groupLayout(plan, side, groupId) {
  const f = plan.sides[side], g = f.groups.find(g => g.id === groupId), ships = f.ships.filter(s => s.groupId === groupId);
  const gap = (Math.max(40, ...ships.map(length)) + 40) * g.spacing;
  const positions = slots(ships.length, g.formation, gap);
  return ships.map((s, i) => ({ ...s, length: length(s), slot: [...(s.offset ?? positions[i])], local: add(s.offset ?? positions[i], [noise(plan.seed, s.id, 0) * gap * .10 * g.scatter, noise(plan.seed, s.id, 1) * gap * .075 * g.scatter, noise(plan.seed, s.id, 2) * gap * .10 * g.scatter]) }));
}

function separate(ships) {
  const placed = [];
  for (const ship of ships) {
    const wanted = ship.position;
    for (let attempt = 0; attempt < 20000; attempt++) {
      const radius = attempt ? 10 * Math.sqrt(attempt) : 0, angle = attempt * 2.399963229728653;
      const point = [wanted[0] + Math.cos(angle) * radius, wanted[1], wanted[2] + Math.sin(angle) * radius];
      if (placed.every(p => Math.hypot(...p.position.map((v, i) => v - point[i])) >= (p.length + ship.length) / 2 + 12 - 1e-7)) { ship.position = point; placed.push(ship); break; }
      if (attempt === 19999) throw new Error('Die Aufstellung ist zu dicht. Vergrößere die Abstände.');
    }
  }
  return placed;
}

// The planner preview and the combat scene use these exact same positions.
// Seeded offsets are evaluated once on deployment; no render-time jitter.
export function fleetLayout(plan, side) {
  const f = plan.sides[side], layouts = f.groups.map(g => groupLayout(plan, side, g.id));
  const diameters = layouts.map(list => Math.max(60, ...list.map(s => Math.hypot(s.local[0], s.local[2]) * 2 + s.length)));
  const gap = (Math.max(80, ...diameters) + 65) * f.spacing, anchors = slots(f.groups.length, f.formation, gap);
  const ships = [], groups = [];
  f.groups.forEach((g, i) => {
    const anchor = g.offset ?? anchors[i];
    groups.push({ ...g, position: rotate(anchor, f.heading) });
    for (const s of layouts[i]) ships.push({ ...s, position: rotate(add(anchor, rotate(s.local, g.heading)), f.heading) });
  });
  separate(ships);
  return { ships, groups };
}

export function deployTrialPlan(plan) {
  const fleets = Object.fromEntries(PLAN_SIDES.map(side => [side, fleetLayout(plan, side)]));
  // Normally the fleet origins are 50 km apart. Deep columns move back far enough
  // to leave at least 10 km between the nearest opposing hulls.
  const front = Object.fromEntries(PLAN_SIDES.map(side => [side, Math.min(0, ...fleets[side].ships.map(s => s.position[2] - s.length / 2))]));
  const centers = { friendly: Math.max(1000, 200 - front.friendly), enemy: -Math.max(1000, 200 - front.enemy) };
  for (const side of PLAN_SIDES) {
    const sign = side === 'friendly' ? 1 : -1;
    for (const s of fleets[side].ships) s.position = [s.position[0] * sign, s.position[1], centers[side] + s.position[2] * sign];
  }
  return fleets;
}

export function addPlanGroup(plan, side) {
  const f = plan.sides[side]; if (f.groups.length >= PLAN_LIMIT) throw new Error('Höchstens 50 Verbände je Seite.');
  while (f.groups.some(g => g.id === `${side}-g${plan.nextId}`)) plan.nextId++;
  const id = `${side}-g${plan.nextId++}`;
  f.groups.push({ id, name: `Verband ${f.groups.length + 1}`, formation: 'wedge', spacing: 1, scatter: .65, heading: 0, offset: null });
  return id;
}
export function addPlanShips(plan, side, groupId, type, count) {
  const f = plan.sides[side];
  if (!Object.hasOwn(STRATEGIC_MODELS, type) || !f.groups.some(g => g.id === groupId) || !Number.isInteger(count) || count < 1 || f.ships.length + count > PLAN_LIMIT) throw new Error('Wähle 1 bis 50 Schiffe je Seite.');
  for (let i = 0; i < count; i++) { while (f.ships.some(s => s.id === `${side}-${plan.nextId}`)) plan.nextId++; const n = plan.nextId++; f.ships.push({ id: `${side}-${n}`, name: `${SHIPS[type].name} ${n}`, type, groupId, offset: null }); }
}
export function removePlanGroup(plan, side, groupId) {
  const f = plan.sides[side]; if (f.groups.length === 1) throw new Error('Mindestens ein Verband bleibt bestehen.');
  const destination = f.groups.find(g => g.id !== groupId).id;
  for (const s of f.ships) if (s.groupId === groupId) { s.groupId = destination; s.offset = null; }
  f.groups = f.groups.filter(g => g.id !== groupId);
}
