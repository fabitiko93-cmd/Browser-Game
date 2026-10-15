import { SHIPS } from './data.js';
import { DEMO_CLASSES, activeShip, WEAPONS } from './battle-demo.js';
import { OVERVIEW_MODELS } from './battle-overview.js';
import { turnToward, weaponPosition } from './battle-geometry.js';

export const REPLAY_DURATION = 36;
const STEP = 1 / 60;
import { STRATEGIC_MODELS as REPLAY_MODELS } from './battle-models.js';
export { REPLAY_MODELS };
const lerp = (a, b, t) => a + (b - a) * Math.min(1, Math.max(0, t));
const direction = (from, to) => { const d = to.map((v, i) => v - from[i]), n = Math.hypot(...d) || 1; return d.map(v => v / n); };
const sideOf = owner => owner === 'player' ? 'friendly' : 'enemy';

export function createBattleReplay(source) {
  const report = structuredClone(source), ships = [];
  for (const side of ['friendly', 'enemy']) {
    const list = report.ships.filter(s => sideOf(s.owner) === side), columns = Math.max(1, Math.ceil(Math.sqrt(list.length) * 1.25)), sign = side === 'friendly' ? 1 : -1;
    list.sort((a, b) => REPLAY_MODELS[b.type][1] - REPLAY_MODELS[a.type][1]);
    for (const [index, record] of list.entries()) {
      const [type, length] = REPLAY_MODELS[record.type], spec = DEMO_CLASSES[type];
      const position = [(index % columns - (Math.min(columns, list.length) - 1) / 2) * 130, (index % 3 - 1) * 8, sign * (1000 + Math.floor(index / columns) * 140)];
      ships.push({ id: record.id, name: record.name, side, type, className: SHIPS[record.type].name, record,
        length, position, home: [...position], facing: [0, 0, -sign], velocity: [0, 0, 0],
        weaponMount: OVERVIEW_MODELS[type].mount, weapon: record.type === 'cruiser' ? 'torpedo' : 'laser',
        armed: SHIPS[record.type].strength > 0, hull: spec.hull * record.hpBefore / 100, shield: 0,
        nextFire: 1.1 + index * .11, lastHit: -10, order: 'engage', targeting: 'auto', escaped: false,
        target: null, salvos: 0, ordinal: index });
    }
  }
  const side = sideOf(report.defender), sign = side === 'friendly' ? 1 : -1;
  const defenders = ships.filter(s => s.side === side), z = sign * (defenders.length ? Math.max(...defenders.map(s => Math.abs(s.position[2]))) + 180 : 1000);
  const d = report.defense, position = [0, -22, z];
  ships.push({ id: `orbit:${report.id}`, name: `Orbit von ${report.planetName}`, side, type: 'corvette', installation: true,
    className: 'Planetare Orbitalverteidigung', length: 100, position, home: [...position], facing: [0, 0, -sign], velocity: [0, 0, 0],
    weaponMount: [0, 0, -.49], weapon: 'laser', armed: d.before + d.orbital > 0,
    hull: DEMO_CLASSES.corvette.hull, shield: d.shieldBefore > 0 ? DEMO_CLASSES.corvette.shield : 0,
    nextFire: 1.8, lastHit: -10, order: 'engage', targeting: 'auto', escaped: false, target: null, salvos: 0, ordinal: 0 });
  return { report, ships, elapsed: 0, day: 0, remainder: 0, phase: 'engaged', scope: 'ship',
    selected: ships.find(s => s.side === 'friendly')?.id, target: ships.find(s => s.side === 'enemy')?.id,
    projectileId: 0, projectiles: [] };
}

function step(battle) {
  const events = [], t = Math.min(REPLAY_DURATION, battle.elapsed + STEP);
  battle.elapsed = t; battle.day = t / 3;
  for (const s of battle.ships) {
    const oldHull = s.hull;
    if (s.installation) {
      const d = battle.report.defense, initial = d.before + d.orbital;
      const remaining = d.after + (battle.report.captured ? 0 : d.orbital);
      s.hull = DEMO_CLASSES[s.type].hull * (initial ? lerp(1, Math.max(.04, remaining / initial), (t - 3) / 22) : 1);
      s.shield = d.shieldBefore ? DEMO_CLASSES[s.type].shield * lerp(1, d.shieldAfter / d.shieldBefore, (t - 2) / 18) : 0;
    } else {
      const r = s.record, damageEnd = r.combatHp === 0 ? 21 + s.ordinal % 7 * .35 : 25;
      s.hull = DEMO_CLASSES[s.type].hull * lerp(r.hpBefore, r.combatHp, (t - 3) / (damageEnd - 3)) / 100;
      if (t >= damageEnd && r.combatHp === 0) s.hull = 0;
      if (oldHull > 0 && s.hull === 0) events.push({ kind: 'destroy', ship: s.id, position: [...s.position] });
      if (t >= 26 && r.combatHp > 0 && r.outcome !== 'held') {
        const sign = s.side === 'friendly' ? 1 : -1, landing = r.outcome === 'landed';
        s.order = landing ? 'land' : 'retreat';
        const next = [...s.home]; next[2] += (landing ? -sign : sign) * (t - 26) * (landing ? 260 : 180);
        s.velocity = next.map((v, i) => (v - s.position[i]) / STEP); s.position = next;
        s.facing = turnToward(s.facing, direction([0, 0, 0], s.velocity), .6 * STEP);
        if (t >= 35) { s.escaped = true; s.hull = DEMO_CLASSES[s.type].hull * r.hpAfter / 100; }
      }
    }
  }
  const available = { friendly: battle.ships.filter(s => s.side === 'friendly' && activeShip(s)), enemy: battle.ships.filter(s => s.side === 'enemy' && activeShip(s)) };
  for (const s of battle.ships) {
    if (!activeShip(s) || !s.armed || t >= 25) continue;
    const enemies = available[s.side === 'friendly' ? 'enemy' : 'friendly'];
    let target = enemies.find(e => e.id === s.target);
    if (!target) target = enemies[s.ordinal % enemies.length];
    if (!target) continue;
    s.target = target.id;
    s.facing = turnToward(s.facing, direction(weaponPosition(s, s.length), target.position), .6 * STEP);
    const from = weaponPosition(s, s.length), aim = direction(from, target.position);
    if (t < s.nextFire || aim.reduce((n, v, i) => n + v * s.facing[i], 0) < .9999995) continue;
    if (s.weapon !== 'laser' && battle.projectiles.length >= 64) continue;
    const to = [...target.position];
    s.nextFire = t + (s.weapon === 'torpedo' ? 4.8 : s.installation ? 3.2 : 2.2); s.salvos++;
    events.push({ kind: 'fire', ship: s.id, target: target.id, weapon: s.weapon, from, to, day: battle.day });
    if (s.weapon === 'laser') events.push({ kind: 'impact', target: target.id, position: to, from, weapon: s.weapon, shield: target.shield > 0 });
    else {
      const speed = WEAPONS[s.weapon].speed / 3;
      battle.projectiles.push({ id: ++battle.projectileId, ship: s.id, target: target.id, weapon: s.weapon,
        position: [...from], velocity: aim.map(v => v * speed), from: [...from], to, age: 0 });
    }
  }
  battle.projectiles = battle.projectiles.filter(p => {
    p.age += STEP / 3;
    const distance = Math.hypot(...p.position.map((v, i) => v - p.to[i])), speed = Math.hypot(...p.velocity);
    if (distance <= speed * STEP + .01) {
      const target = battle.ships.find(s => s.id === p.target);
      events.push({ kind: 'impact', target: p.target, position: [...p.to], from: p.from, weapon: p.weapon, shield: (target?.shield ?? 0) > 0 });
      return false;
    }
    p.position = p.position.map((v, i) => v + p.velocity[i] * STEP); return true;
  });
  if (t >= REPLAY_DURATION - 1e-8) { battle.elapsed = REPLAY_DURATION; battle.phase = 'recorded'; battle.projectiles = []; }
  return events;
}

// Fixed replay time only. Damage is an interpolation of the stored strategic result,
// not a second combat calculation; trajectories are illustrative, not a hit-by-hit log.
export function advanceBattleReplay(battle, seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) throw new RangeError('Ungültige Wiedergabezeit.');
  const events = []; battle.remainder += Math.min(seconds, REPLAY_DURATION);
  while (battle.remainder + 1e-10 >= STEP && battle.phase === 'engaged') {
    battle.remainder = Math.max(0, battle.remainder - STEP); events.push(...step(battle));
  }
  if (battle.phase !== 'engaged') battle.remainder = 0;
  return events;
}
