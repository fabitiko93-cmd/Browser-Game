import { createDemoBattle, advanceDemoBattle, activeShip, DEMO_CLASSES, DEMO_STEP } from './battle-demo.js';

export const OVERVIEW_SCENARIOS = {
  '20v20': { name: '20 : 20 · Gemischte Verbände', friendly: 20, enemy: 20 },
  '5v35': { name: '5 : 35 · Eigene Unterzahl', friendly: 5, enemy: 35 },
  '35v5': { name: '35 : 5 · Eigene Überzahl', friendly: 35, enemy: 5 },
  '50v50': { name: '50 : 50 · Große Schlacht', friendly: 50, enemy: 50 },
};

// These are presentation fixtures, not new strategic classes or fleet balance.
// One model contract supplies dimensions, authored forward axis and weapon exit.
export const OVERVIEW_MODELS = {
  cruiser: { model: 'harbinger', length: 72, rotationY: Math.PI / 2, mount: [0, .055, -.48] },
  destroyer: { model: 'challenger', length: 36, rotationY: Math.PI, mount: [0, .10, -.46] },
  corvette: { model: 'striker', length: 14, rotationY: Math.PI, mount: [0, .10, -.43] },
  interceptor: { model: 'spitfire', length: 2.4, rotationY: Math.PI, mount: [0, .04, -.45] },
};
const types = ['cruiser', 'destroyer', 'corvette', 'interceptor', 'interceptor', 'destroyer', 'corvette', 'interceptor', 'interceptor', 'interceptor'];
const slots = [[0, 0, 82], [-55, 8, 30], [66, -6, -12], [-86, 12, -87], [18, -10, -106], [58, -4, 58], [-62, 5, -25], [93, -7, -66], [-32, 8, -76], [49, 2, -97]];
const ownNames = ['Harbinger', 'Pioneer', 'Kestrel', 'Echo', 'Swift', 'Vanguard', 'Lancer', 'Arrow', 'Sparrow', 'Comet'];
const enemyNames = ['Nemesis', 'Revenant', 'Viper', 'Wraith', 'Shade', 'Ravager', 'Spectre', 'Talon', 'Ghost', 'Dagger'];
const firstIds = { friendly: ['aurora', 'pioneer', 'kestrel', 'echo'], enemy: ['nemesis', 'revenant', 'viper', 'wraith'] };

export function createOverviewBattle(scenario = '20v20') {
  if (!Object.hasOwn(OVERVIEW_SCENARIOS, scenario)) scenario = '20v20';
  const battle = createDemoBattle(), def = OVERVIEW_SCENARIOS[scenario];
  battle.ships = []; battle.scenario = scenario; battle.probeRemainder = 0;
  for (const side of ['friendly', 'enemy']) {
    const count = def[side], groups = Math.ceil(count / 10), rows = Math.ceil(groups / 2), sign = side === 'friendly' ? 1 : -1;
    for (let i = 0; i < count; i++) {
      const group = Math.floor(i / 10), slot = i % 10, type = types[slot], spec = DEMO_CLASSES[type];
      const [x, y, z] = slots[slot], columns = groups === 1 ? 1 : 2;
      const gx = columns === 1 ? 0 : ((group % 2) - .5) * 260;
      const gz = (Math.floor(group / 2) - (rows - 1) / 2) * 225;
      const position = [sign * (gx + x), y, sign * (1000 + gz + z)];
      const id = firstIds[side][i] ?? `${side}-${i + 1}`;
      const name = (side === 'friendly' ? ownNames : enemyNames)[slot] + (group ? ` ${group + 1}` : '');
      battle.ships.push({ id, name, side, type, position, home: [...position], group: `${side}-${group}`,
        length: OVERVIEW_MODELS[type].length, velocity: [0, 0, 0], facing: [0, 0, -sign], weaponMount: OVERVIEW_MODELS[type].mount,
        hull: spec.hull, shield: spec.shield, nextFire: .12 + slot * .10 + group * .19 + (side === 'enemy' ? .13 : 0),
        lastHit: -10, order: 'engage', targeting: 'auto', commandTarget: null, priority: null,
        escaped: false, target: null, salvos: 0, flightDelay: type === 'interceptor' ? 1 + group * .28 + slot * .11 : null });
    }
  }
  return battle;
}

export function advanceOverviewBattle(battle, days) {
  if (!Number.isFinite(days) || days < 0) throw new RangeError('A finite, non-negative game duration is required');
  if (battle.phase !== 'engaged') return [];
  const events = []; battle.probeRemainder += days;
  // Flight paths and fire share the same fixed simulation clock. No render-only motion.
  while (battle.probeRemainder + 1e-10 >= DEMO_STEP && battle.phase === 'engaged') {
    battle.probeRemainder = Math.max(0, battle.probeRemainder - DEMO_STEP);
    const day = battle.day + DEMO_STEP;
    for (const ship of battle.ships) {
      if (ship.flightDelay === null || !activeShip(ship) || ship.order === 'retreat') continue;
      const sign = ship.side === 'friendly' ? 1 : -1;
      const theta = Math.max(0, day - ship.flightDelay) / 14 * Math.PI * 2, reach = (1 - Math.cos(theta)) / 2;
      const position = [ship.home[0] + sign * (Math.sin(theta) * 110 + reach * 150), ship.home[1] + Math.sin(theta * 2) * 18, ship.home[2] - sign * reach * 1630];
      ship.velocity = position.map((p, i) => (p - ship.position[i]) / DEMO_STEP); ship.position = position;
    }
    events.push(...advanceDemoBattle(battle, DEMO_STEP));
  }
  if (battle.phase !== 'engaged') battle.probeRemainder = 0;
  return events;
}

export function formationCenter(battle, side) {
  const ships = battle.ships.filter(s => s.side === side && activeShip(s));
  const anchors = ships.filter(s => s.type !== 'interceptor');
  const list = anchors.length ? anchors : ships;
  return list.length ? [0, 1, 2].map(axis => list.reduce((n, s) => n + s.position[axis], 0) / list.length) : [0, 0, side === 'friendly' ? 1000 : -1000];
}
