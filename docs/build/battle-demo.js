// The preview owns its own clock and ships. It never imports or changes a saved empire.
export const DEMO_STEP = 1 / 60;
export const DEMO_CLASSES = {
  cruiser: { name: 'Schlachtkreuzer', model: 'executioner', size: 23, hull: 260, shield: 110, damage: 9, interval: .7, engines: 2 },
  destroyer: { name: 'Laserzerstörer', model: 'challenger', size: 16, hull: 140, shield: 70, damage: 6, interval: .58, engines: 2 },
  corvette: { name: 'Laserkorvette', model: 'striker', size: 10, hull: 80, shield: 45, damage: 3.5, interval: .46, engines: 2 },
  interceptor: { name: 'Abfangjäger', model: 'spitfire', size: 7, hull: 42, shield: 25, damage: 2, interval: .38, engines: 2 },
};

export function createDemoBattle() {
  const lineup = [
    ['aurora', 'Aurora', 'friendly', 'cruiser', -8, 0, 27],
    ['pioneer', 'Pioneer', 'friendly', 'destroyer', 18, -1, 13],
    ['kestrel', 'Kestrel', 'friendly', 'corvette', -27, 2, 4],
    ['echo', 'Echo', 'friendly', 'interceptor', 8, 4, 34],
    ['nemesis', 'Nemesis', 'enemy', 'cruiser', 4, 0, -35],
    ['revenant', 'Revenant', 'enemy', 'destroyer', -20, 2, -23],
    ['viper', 'Viper', 'enemy', 'corvette', 27, -1, -17],
    ['wraith', 'Wraith', 'enemy', 'interceptor', 13, 5, -44],
  ];
  return {
    day: 0, remainder: 0, tick: 0, phase: 'engaged', selected: 'aurora', target: 'nemesis', focus: false,
    ships: lineup.map(([id, name, side, type, x, y, z], i) => {
      const def = DEMO_CLASSES[type];
      return { id, name, side, type, position: [x, y, z], hull: def.hull, shield: def.shield,
        nextFire: .08 + i * .09, lastHit: -10, order: 'engage', escaped: false };
    }),
  };
}

export function activeShip(ship) { return ship.hull > 0 && !ship.escaped; }

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
    for (const ship of battle.ships.filter(s => s.side === 'friendly' && activeShip(s))) ship.order = 'retreat';
    battle.focus = false;
  } else return false;
  return true;
}

function targetFor(battle, attacker) {
  const enemies = battle.ships.filter(s => s.side !== attacker.side && activeShip(s));
  if (attacker.side === 'friendly' && battle.focus) {
    const priority = enemies.find(s => s.id === battle.target);
    if (priority) return priority;
  }
  return enemies.sort((a, b) => {
    const score = ship => Math.hypot(...ship.position.map((v, i) => v - attacker.position[i])) + ship.hull / 20;
    return score(a) - score(b);
  })[0];
}

export function demoTarget(battle, ship) { return targetFor(battle, ship); }

export function advanceDemoBattle(battle, days) {
  if (!Number.isFinite(days) || days < 0) throw new RangeError('A finite, non-negative game duration is required');
  if (battle.phase !== 'engaged') return [];
  const events = [];
  battle.remainder += days;
  // A fixed game-time step makes damage and retreat independent of frame rate.
  while (battle.remainder + 1e-10 >= DEMO_STEP && battle.phase === 'engaged') {
    battle.remainder = Math.max(0, battle.remainder - DEMO_STEP);
    battle.tick += 1;
    battle.day = battle.tick * DEMO_STEP;
    for (const ship of battle.ships) {
      if (!activeShip(ship)) continue;
      const def = DEMO_CLASSES[ship.type];
      if (battle.day - ship.lastHit > 1.3) ship.shield = Math.min(def.shield, ship.shield + DEMO_STEP * 2.5);
      if (ship.order === 'retreat') {
        ship.position[2] += DEMO_STEP * (ship.type === 'cruiser' ? 8 : ship.type === 'destroyer' ? 11 : 17);
        if (ship.position[2] > 112) { ship.escaped = true; events.push({ kind: 'escape', ship: ship.id }); continue; }
      }
      if (battle.day + 1e-10 < ship.nextFire) continue;
      const target = targetFor(battle, ship);
      ship.nextFire += def.interval;
      if (!target || Math.hypot(...ship.position.map((v, i) => v - target.position[i])) > 110) continue;
      const damage = def.damage * (ship.order === 'retreat' ? .55 : 1);
      const shieldDamage = Math.min(target.shield, damage);
      target.shield -= shieldDamage;
      target.hull = Math.max(0, target.hull - (damage - shieldDamage));
      target.lastHit = battle.day;
      events.push({ kind: 'fire', ship: ship.id, target: target.id, shield: shieldDamage > 0 });
      if (!target.hull) events.push({ kind: 'destroy', ship: target.id });
    }
    const friendly = battle.ships.filter(s => s.side === 'friendly' && activeShip(s));
    const enemy = battle.ships.filter(s => s.side === 'enemy' && activeShip(s));
    if (!enemy.length) battle.phase = 'victory';
    else if (!friendly.length) battle.phase = battle.ships.some(s => s.side === 'friendly' && s.escaped) ? 'withdrawn' : 'defeat';
    if (!friendly.some(s => s.id === battle.selected) && friendly.length) battle.selected = friendly[0].id;
    if (!enemy.some(s => s.id === battle.target) && enemy.length) battle.target = enemy[0].id;
  }
  if (battle.phase !== 'engaged') battle.remainder = 0;
  return events;
}
