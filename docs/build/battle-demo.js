// The preview owns its own clock and ships. It never imports or changes a saved empire.
export const DEMO_STEP = 1 / 60;
export const KM_PER_UNIT = .025;
export const FLEET_CENTERS = { friendly: [0, 0, 1000], enemy: [0, 0, -1000] };
export const WEAPONS = {
  torpedo: { name: 'Torpedobatterie', range: 3600, speed: 1700, damage: 32, interval: 2.8, lifetime: 5, color: 0xffae5e },
  rail: { name: 'Massentreiber', range: 3000, speed: 6400, damage: 13, interval: .9, lifetime: 1.2, color: 0xffe3a1 },
  laser: { name: 'Orbital-Laser', range: 2600, speed: 0, damage: 4.2, interval: .42, lifetime: 0, color: 0x79dcff },
  pulse: { name: 'Pulsbatterie', range: 2300, speed: 5200, damage: 1.9, interval: .34, lifetime: 1.1, color: 0xd5a1ff },
};
export const DEMO_CLASSES = {
  cruiser: { name: 'Schlachtkreuzer', model: 'executioner', size: 23, hull: 260, shield: 110, weapon: 'torpedo', retreatSpeed: 210 },
  destroyer: { name: 'Zerstörer', model: 'challenger', size: 16, hull: 140, shield: 70, weapon: 'rail', retreatSpeed: 260 },
  corvette: { name: 'Laserkorvette', model: 'striker', size: 10, hull: 80, shield: 45, weapon: 'laser', retreatSpeed: 360 },
  interceptor: { name: 'Abfangjäger', model: 'spitfire', size: 7, hull: 42, shield: 25, weapon: 'pulse', retreatSpeed: 440 },
};

export function createDemoBattle() {
  const lineup = [
    ['aurora', 'Aurora', 'friendly', 'cruiser', 0, 0, 1045],
    ['pioneer', 'Pioneer', 'friendly', 'destroyer', -92, 10, 1005],
    ['kestrel', 'Kestrel', 'friendly', 'corvette', 92, -8, 970],
    ['echo', 'Echo', 'friendly', 'interceptor', -35, 20, 915],
    ['nemesis', 'Nemesis', 'enemy', 'cruiser', 0, 0, -1045],
    ['revenant', 'Revenant', 'enemy', 'destroyer', -92, -10, -1005],
    ['viper', 'Viper', 'enemy', 'corvette', 92, 8, -970],
    ['wraith', 'Wraith', 'enemy', 'interceptor', -35, -20, -915],
  ];
  return {
    day: 0, remainder: 0, tick: 0, phase: 'engaged', selected: 'aurora', target: 'nemesis', focus: false,
    projectileId: 0, projectiles: [],
    ships: lineup.map(([id, name, side, type, x, y, z], i) => {
      const def = DEMO_CLASSES[type];
      return { id, name, side, type, position: [x, y, z], velocity: [0, 0, 0], hull: def.hull, shield: def.shield,
        nextFire: .12 + i * .08, lastHit: -10, order: 'engage', escaped: false, target: null, salvos: 0 };
    }),
  };
}

export function activeShip(ship) { return ship.hull > 0 && !ship.escaped; }
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
export function fleetCenter(battle, side) {
  const center = [0, 0, 0]; let count = 0;
  for (const ship of battle.ships) if (ship.side === side && activeShip(ship)) {
    for (let i = 0; i < 3; i++) center[i] += ship.position[i];
    count++;
  }
  return count ? center.map(value => value / count) : [...FLEET_CENTERS[side]];
}
export function fleetDistanceKm(battle) { return distance(fleetCenter(battle, 'friendly'), fleetCenter(battle, 'enemy')) * KM_PER_UNIT; }
export function selectDemoShip(battle, id) {
  const ship = battle.ships.find(s => s.id === id && activeShip(s));
  if (!ship) return false;
  if (ship.side === 'friendly') battle.selected = id;
  else battle.target = id;
  return true;
}
export function commandDemo(battle, command) {
  if (battle.phase !== 'engaged') return false;
  if (command === 'focus') battle.focus = !battle.focus;
  else if (command === 'retreat') {
    for (const ship of battle.ships) if (ship.side === 'friendly' && activeShip(ship)) ship.order = 'retreat';
    battle.focus = false;
  } else return false;
  return true;
}

function targetFor(battle, attacker) {
  const range = WEAPONS[DEMO_CLASSES[attacker.type].weapon].range;
  let best, score = Infinity;
  for (const ship of battle.ships) {
    if (ship.side === attacker.side || !activeShip(ship)) continue;
    const separation = distance(ship.position, attacker.position);
    if (separation > range) continue;
    if (attacker.side === 'friendly' && battle.focus && ship.id === battle.target) return ship;
    const candidate = separation - (ship.type === attacker.type ? 300 : 0);
    if (candidate < score) { score = candidate; best = ship; }
  }
  return best;
}
export function demoTarget(battle, ship) {
  return battle.ships.find(target => target.id === ship.target && activeShip(target));
}

function hit(battle, source, target, weapon, damage, events) {
  if (!activeShip(target)) return;
  const shieldDamage = Math.min(target.shield, damage);
  target.shield -= shieldDamage;
  target.hull = Math.max(0, target.hull - (damage - shieldDamage));
  target.lastHit = battle.day;
  events.push({ kind: 'impact', weapon, ship: source, target: target.id, shield: shieldDamage > 0, position: [...target.position], day: battle.day });
  if (!target.hull) events.push({ kind: 'destroy', ship: target.id, position: [...target.position], day: battle.day });
}

function interceptDirection(source, target, speed) {
  const relative = target.position.map((v, i) => v - source.position[i]), velocity = target.velocity;
  const a = velocity.reduce((sum, value) => sum + value * value, 0) - speed * speed;
  const b = 2 * relative.reduce((sum, value, i) => sum + value * velocity[i], 0);
  const c = relative.reduce((sum, value) => sum + value * value, 0), discriminant = b * b - 4 * a * c;
  let time = Math.sqrt(c) / speed;
  if (discriminant >= 0 && Math.abs(a) > 1e-10) {
    const root = Math.sqrt(discriminant), roots = [(-b - root) / (2 * a), (-b + root) / (2 * a)].filter(t => t > 0);
    if (roots.length) time = Math.min(...roots);
  }
  const direction = relative.map((v, i) => v + velocity[i] * time), length = Math.hypot(...direction) || 1;
  return direction.map(value => value / length);
}

function fire(battle, ship, target, events) {
  const weapon = DEMO_CLASSES[ship.type].weapon, def = WEAPONS[weapon];
  const damage = def.damage * (ship.order === 'retreat' ? .55 : 1);
  ship.salvos++;
  events.push({ kind: 'fire', weapon, ship: ship.id, target: target.id, from: [...ship.position], to: [...target.position], day: battle.day });
  if (weapon === 'laser') { hit(battle, ship.id, target, weapon, damage, events); return; }
  const velocity = interceptDirection(ship, target, def.speed).map(v => v * def.speed);
  if (weapon === 'torpedo') { velocity[0] += ship.salvos % 2 ? 220 : -220; velocity[1] += 90; }
  battle.projectiles.push({ id: ++battle.projectileId, source: ship.id, target: target.id, side: ship.side, weapon,
    position: [...ship.position], velocity, damage, age: 0 });
}

function moveProjectiles(battle, events) {
  for (let i = battle.projectiles.length - 1; i >= 0; i--) {
    const projectile = battle.projectiles[i], def = WEAPONS[projectile.weapon];
    const target = battle.ships.find(ship => ship.id === projectile.target);
    projectile.age += DEMO_STEP;
    if (!target || !activeShip(target) || projectile.age > def.lifetime) { battle.projectiles.splice(i, 1); continue; }
    if (projectile.weapon === 'torpedo') {
      const gap = target.position.map((v, axis) => v - projectile.position[axis]), length = Math.hypot(...gap) || 1;
      const blend = 1 - Math.exp(-5 * DEMO_STEP);
      for (let axis = 0; axis < 3; axis++) projectile.velocity[axis] += (gap[axis] / length * def.speed - projectile.velocity[axis]) * blend;
    }
    const before = [...projectile.position], delta = projectile.velocity.map(v => v * DEMO_STEP);
    for (let axis = 0; axis < 3; axis++) projectile.position[axis] += delta[axis];
    const lengthSq = delta.reduce((sum, value) => sum + value * value, 0);
    const along = Math.max(0, Math.min(1, delta.reduce((sum, value, axis) => sum + value * (target.position[axis] - before[axis]), 0) / (lengthSq || 1)));
    const closest = before.map((value, axis) => value + delta[axis] * along);
    if (distance(closest, target.position) <= Math.max(3, DEMO_CLASSES[target.type].size * .35)) {
      hit(battle, projectile.source, target, projectile.weapon, projectile.damage, events);
      battle.projectiles.splice(i, 1);
    }
  }
}

export function advanceDemoBattle(battle, days) {
  if (!Number.isFinite(days) || days < 0) throw new RangeError('A finite, non-negative game duration is required');
  if (battle.phase !== 'engaged') return [];
  const events = [];
  battle.remainder += days;
  // A fixed game-time step makes flight, damage and retreat independent of render rate.
  while (battle.remainder + 1e-10 >= DEMO_STEP && battle.phase === 'engaged') {
    battle.remainder = Math.max(0, battle.remainder - DEMO_STEP);
    battle.tick++;
    battle.day = battle.tick * DEMO_STEP;
    for (const ship of battle.ships) {
      if (!activeShip(ship)) continue;
      const def = DEMO_CLASSES[ship.type];
      if (battle.day - ship.lastHit > 1.3) ship.shield = Math.min(def.shield, ship.shield + DEMO_STEP * 2.5);
      if (ship.order === 'retreat') {
        ship.velocity[2] = def.retreatSpeed;
        ship.position[2] += DEMO_STEP * def.retreatSpeed;
        if (ship.position[2] > 2800) { ship.escaped = true; events.push({ kind: 'escape', ship: ship.id, day: battle.day }); }
      }
    }
    moveProjectiles(battle, events);
    for (const ship of battle.ships) {
      if (!activeShip(ship)) continue;
      const def = WEAPONS[DEMO_CLASSES[ship.type].weapon], target = targetFor(battle, ship);
      ship.target = target?.id ?? null;
      if (battle.day + 1e-10 < ship.nextFire) continue;
      ship.nextFire += def.interval;
      if (target) fire(battle, ship, target, events);
    }
    const friendly = battle.ships.filter(s => s.side === 'friendly' && activeShip(s));
    const enemy = battle.ships.filter(s => s.side === 'enemy' && activeShip(s));
    if (!enemy.length) battle.phase = 'victory';
    else if (!friendly.length) battle.phase = battle.ships.some(s => s.side === 'friendly' && s.escaped) ? 'withdrawn' : 'defeat';
    if (!friendly.some(s => s.id === battle.selected) && friendly.length) battle.selected = friendly[0].id;
    if (!enemy.some(s => s.id === battle.target) && enemy.length) battle.target = enemy[0].id;
  }
  if (battle.phase !== 'engaged') { battle.remainder = 0; battle.projectiles.length = 0; }
  return events;
}
