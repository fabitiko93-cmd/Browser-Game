import { SHIPS } from './data.js';
import { fleetStrength, shipArmor } from './fleets.js';
import { technologyEffects } from './technology.js';
import { initialGovernance } from './governance.js';
import { STRATEGIC_MODELS } from './battle-models.js';
import { OVERVIEW_MODELS, OVERVIEW_SCENARIOS } from './battle-overview.js';
import { createDemoBattle, advanceDemoBattle, DEMO_CLASSES, DEMO_STEP, activeShip, shipStrength, targetFor } from './battle-demo.js';

export const TRIAL_SAVE_KEY = 'orbit3077-trial';
export const TRIAL_LIMIT = 50;
export const TRIAL_DAMAGE_RATE = .35;
export const TRIAL_GROUPS = { all: 'Alle', ...Object.fromEntries(Object.entries(SHIPS).map(([id, def]) => [id, def.name])) };
const pattern = ['cruiser', 'destroyer', 'corvette', 'corvette', 'corvette', 'destroyer', 'corvette', 'corvette', 'destroyer', 'corvette'];
const baseline = () => ({ day: 0, tech: [], player: { ideology: 'democracy' }, governance: initialGovernance() });
const number = (n, min, max) => Number.isFinite(n) && n >= min && n <= max;

export function trialPorts(state) {
  if (!state) return [];
  const ports = new Map();
  for (const f of state.fleets) if (f.owner === 'player' && f.hp > 0 && !f.mission && !f.route) {
    const p = [...state.planets, ...state.world.anchors].find(p => p.id === f.planetId);
    if (!p || p.destroyed) continue;
    if (!ports.has(p.id)) ports.set(p.id, { id: p.id, name: p.name, count: 0 });
    ports.get(p.id).count++;
  }
  return [...ports.values()];
}
export function createBattleTrial({ scenario = '20v20', mode = 'baseline', state = null, planetId = null, friendlySupply = 100, enemySupply = 100 } = {}) {
  if (!Object.hasOwn(OVERVIEW_SCENARIOS, scenario)) throw new Error('Unbekannte Probeschlacht.');
  if (!['baseline', 'profile', 'fleet'].includes(mode)) throw new Error('Unbekannte Aufstellung.');
  if (!number(friendlySupply, 0, 100) || !number(enemySupply, 0, 100)) throw new Error('Ungültige Bordversorgung.');
  if (mode !== 'baseline' && !state) throw new Error('Öffne zuerst dein gespeichertes Reich.');
  const def = OVERVIEW_SCENARIOS[scenario], normal = baseline(), own = mode === 'baseline' ? normal : state;
  const copied = mode === 'fleet' ? state.fleets.filter(f => f.owner === 'player' && f.planetId === planetId && !f.mission && !f.route && f.hp > 0) : null;
  const port = copied && trialPorts(state).find(p => p.id === planetId);
  if (copied && (!port || !copied.length || copied.length > TRIAL_LIMIT)) throw new Error(`Wähle einen Standort mit 1 bis ${TRIAL_LIMIT} freien Schiffen.`);
  const battle = createDemoBattle(); battle.ships = []; battle.mode = 'trial';
  battle.setup = { scenario, mode, planetId, friendlySupply, enemySupply };
  battle.sourceLabel = mode === 'baseline' ? 'Testverbände · Grundwerte' : mode === 'profile' ? `Testverbände · eigene Forschung und Politik · Tag ${state.day}` : `Kopie deiner Schiffe · ${port.name} · Tag ${state.day}`;
  battle.contactGroups = TRIAL_GROUPS; battle.classStrengths = Object.fromEntries(Object.entries(SHIPS).map(([id, d]) => [id, d.strength]));
  for (const side of ['friendly', 'enemy']) {
    const profile = side === 'friendly' ? own : normal, count = side === 'friendly' && copied ? copied.length : def[side];
    const columns = Math.max(1, Math.ceil(Math.sqrt(count) * 1.25)), sign = side === 'friendly' ? 1 : -1;
    for (let i = 0; i < count; i++) {
      const f = side === 'friendly' && copied ? copied[i] : { id: `${side}-${i + 1}`, name: `${i === 0 ? side === 'friendly' ? 'Harbinger' : 'Nemesis' : SHIPS[pattern[i % pattern.length]].name} ${i + 1}`, type: pattern[i % pattern.length], owner: 'player', hp: 100, supply: side === 'friendly' ? friendlySupply : enemySupply };
      const [type, length] = STRATEGIC_MODELS[f.type], spec = DEMO_CLASSES[type];
      const position = [(i % columns - (Math.min(columns, count) - 1) / 2) * 130, (i % 3 - 1) * 8, sign * (1000 + Math.floor(i / columns) * 140)];
      const id = `${side}:${f.id}`;
      battle.ships.push({ id, sourceId: f.id, name: f.name, type, strategicType: f.type, className: SHIPS[f.type].name, side,
        length, position, home: [...position], facing: [0, 0, -sign], velocity: [0, 0, 0], weaponMount: [...OVERVIEW_MODELS[type].mount],
        hull: spec.hull * f.hp / 100, initialHull: spec.hull * f.hp / 100, shield: 0, supply: f.supply,
        combat: { power: fleetStrength(profile, { ...f, hp: 100, supply: 100 }), armor: shipArmor(profile, f),
          weapon: f.type === 'cruiser' ? 'torpedo' : 'laser', damageRate: TRIAL_DAMAGE_RATE, range: 3600,
          retreatSpeed: 260 * (SHIPS[f.type].speed ?? 1), retreatFuel: 8 * technologyEffects(profile).fuel },
        nextFire: 0, lastHit: -10, order: 'engage', targeting: 'auto',
        commandTarget: null, priority: null, target: null, salvos: 0, escaped: false });
    }
  }
  // Deployment happens before combat: fixed bow weapons already face their
  // automatic opening targets. The first salvo never depends on list position.
  for (const ship of battle.ships) {
    const target = targetFor(battle, ship);
    if (!target) continue;
    const direction = target.position.map((p, i) => p - ship.position[i]), length = Math.hypot(...direction);
    ship.facing = direction.map(v => v / length); ship.target = target.id;
  }
  battle.selected = battle.ships.find(s => s.side === 'friendly').id;
  battle.target = battle.ships.find(s => s.side === 'enemy').id;
  return battle;
}
export const advanceBattleTrial = (battle, days) => advanceDemoBattle(battle, days);
export function trialSummary(battle, side) {
  const ships = battle.ships.filter(s => s.side === side);
  return { total: ships.length, active: ships.filter(activeShip).length, destroyed: ships.filter(s => s.hull <= 0).length,
    escaped: ships.filter(s => s.escaped).length, strength: ships.filter(activeShip).reduce((n, s) => n + shipStrength(s), 0) };
}
export function serializeTrial(battle) { return JSON.stringify({ version: 1, battle }); }
export function parseTrial(raw) {
  const value = JSON.parse(raw), b = value?.battle;
  const fail = () => { throw new Error('Ungültiger Stand der Probeschlacht.'); };
  const text = v => typeof v === 'string' && v.length > 0 && v.length <= 160;
  const vector = v => Array.isArray(v) && v.length === 3 && v.every(n => number(n, -1e6, 1e6));
  if (value?.version !== 1 || !b || b.mode !== 'trial' || !['engaged','victory','defeat','withdrawn','stalemate','draw'].includes(b.phase)
    || !['ship','fleet'].includes(b.scope) || !Number.isInteger(b.tick) || !number(b.tick,0,7560)
    || !number(b.day,0,126) || Math.abs(b.day-b.tick*DEMO_STEP)>1e-8 || !number(b.remainder,0,DEMO_STEP)
    || !text(b.sourceLabel) || !Object.hasOwn(OVERVIEW_SCENARIOS,b.setup?.scenario) || !['baseline','profile','fleet'].includes(b.setup.mode)
    || !number(b.setup.friendlySupply,0,100) || !number(b.setup.enemySupply,0,100)
    || !Array.isArray(b.ships) || b.ships.length < 2 || b.ships.length > TRIAL_LIMIT*2 || !Array.isArray(b.projectiles) || b.projectiles.length>1000
    || !Number.isInteger(b.projectileId) || !number(b.projectileId,0,1e7)) fail();
  const ids = new Map();
  for (const s of b.ships) {
    if (!s || !text(s.id) || ids.has(s.id) || !text(s.name) || !text(s.sourceId) || !['friendly','enemy'].includes(s.side)
      || !Object.hasOwn(STRATEGIC_MODELS,s.strategicType) || STRATEGIC_MODELS[s.strategicType][0] !== s.type || STRATEGIC_MODELS[s.strategicType][1] !== s.length
      || !number(s.hull,0,DEMO_CLASSES[s.type].hull) || !number(s.initialHull,s.hull,DEMO_CLASSES[s.type].hull) || s.shield !== 0 || !number(s.supply,0,100)
      || !vector(s.position) || !vector(s.home) || !vector(s.velocity) || !vector(s.facing) || Math.abs(Math.hypot(...s.facing)-1)>1e-6
      || !Array.isArray(s.weaponMount) || s.weaponMount.some((v,i)=>v!==OVERVIEW_MODELS[s.type].mount[i]) || s.weaponMount.length!==3
      || !s.combat || !number(s.combat.power,0,1e6) || !number(s.combat.armor,0,.65) || s.combat.damageRate!==TRIAL_DAMAGE_RATE || s.combat.range!==3600
      || s.combat.weapon !== (s.strategicType==='cruiser'?'torpedo':'laser') || !number(s.combat.retreatFuel,.01,100) || !number(s.combat.retreatSpeed,1,1000)
      || !['engage','retreat'].includes(s.order) || !['auto','target','class'].includes(s.targeting) || typeof s.escaped!=='boolean'
      || !number(s.nextFire,0,130) || !number(s.lastHit,-10,126) || !Number.isInteger(s.salvos) || !number(s.salvos,0,100000)) fail();
    ids.set(s.id,s); s.className=SHIPS[s.strategicType].name;
  }
  for (const side of ['friendly','enemy']) { const n=b.ships.filter(s=>s.side===side).length; if(n<1||n>TRIAL_LIMIT)fail(); }
  if(ids.get(b.selected)?.side!=='friendly'||ids.get(b.target)?.side!=='enemy')fail();
  for(const s of b.ships){
    if(s.commandTarget!==null&&(!ids.has(s.commandTarget)||ids.get(s.commandTarget).side===s.side)||s.target!==null&&(!ids.has(s.target)||ids.get(s.target).side===s.side)
      ||s.priority!==null&&!Object.hasOwn(SHIPS,s.priority)||s.targeting==='target'&&s.commandTarget===null||s.targeting==='class'&&s.priority===null)fail();
  }
  const projectiles=new Set();
  for(const p of b.projectiles){
    if(!p||!Number.isInteger(p.id)||!number(p.id,1,b.projectileId)||projectiles.has(p.id)||!ids.has(p.source)||!ids.has(p.target)
      ||ids.get(p.source).side===ids.get(p.target).side||p.side!==ids.get(p.source).side||p.weapon!=='torpedo'||!vector(p.position)||!vector(p.velocity)||!number(p.damage,0,1e6)||!number(p.age,0,5))fail();
    projectiles.add(p.id);
  }
  if(b.phase!=='engaged'&&b.projectiles.length)fail();
  b.contactGroups=TRIAL_GROUPS;b.classStrengths=Object.fromEntries(Object.entries(SHIPS).map(([id,d])=>[id,d.strength]));
  return b;
}
