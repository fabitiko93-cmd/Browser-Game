import test from 'node:test';
import assert from 'node:assert/strict';
import { createOverviewBattle, advanceOverviewBattle, OVERVIEW_SCENARIOS, OVERVIEW_MODELS, formationCenter } from '../src/battle-overview.js';
import { DEMO_CLASSES, DEMO_STEP, activeShip, commandDemo } from '../src/battle-demo.js';
import { weaponPosition, turnToward } from '../src/battle-geometry.js';

const near = (a, b, tolerance = 1e-8) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
test('overview fixtures retain exact asymmetric counts and common class dimensions', () => {
  for (const [id, scenario] of Object.entries(OVERVIEW_SCENARIOS)) {
    const battle = createOverviewBattle(id);
    assert.equal(new Set(battle.ships.map(s => s.id)).size, battle.ships.length);
    for (const side of ['friendly', 'enemy']) assert.equal(battle.ships.filter(s => s.side === side).length, scenario[side]);
    for (const ship of battle.ships) { assert.equal(ship.length, OVERVIEW_MODELS[ship.type].length); assert.equal(ship.hull, DEMO_CLASSES[ship.type].hull); assert.deepEqual(ship.position, ship.home); }
    const a = formationCenter(battle, 'friendly'), b = formationCenter(battle, 'enemy');
    assert.ok(Math.abs(a[2] - b[2]) > 1750);
    for (const ship of battle.ships) for (const other of battle.ships) {
      if (ship.id >= other.id) continue;
      assert.ok(Math.hypot(...ship.position.map((v, i) => v - other.position[i])) > (ship.length + other.length) / 2);
    }
  }
  assert.equal(createOverviewBattle('invalid').scenario, '20v20');
});
test('muzzle coordinates follow the same model convention for either fleet and inclined headings', () => {
  const ship = {position:[10, 20, 30], facing:[0, 0, -1], weaponMount:[.1, .2, -.5]};
  assert.deepEqual(weaponPosition(ship, 10), [11, 22, 25]);
  ship.facing = [0, 0, 1]; assert.deepEqual(weaponPosition(ship, 10), [9, 22, 35]);
  ship.facing = [1, 0, 0]; assert.deepEqual(weaponPosition(ship, 10), [15, 22, 31]);
  ship.facing = [0, Math.SQRT1_2, -Math.SQRT1_2];
  near(Math.hypot(...weaponPosition(ship, 10).map((v, i) => v - ship.position[i])), Math.sqrt(30));
});
test('bounded turns remain normalized through a full reversal', () => {
  let facing = [0, 0, -1];
  for (let i = 0; i < 100; i++) { facing = turnToward(facing, [0, 0, 1], .04); near(Math.hypot(...facing), 1); }
  assert.deepEqual(facing, [0, 0, 1]);
});
test('scripted flights, fixed-weapon fire and damage are independent of render rate', () => {
  const slow = createOverviewBattle(), fast = createOverviewBattle();
  const slowEvents = [], fastEvents = [];
  for (let i = 0; i < 40; i++) slowEvents.push(...advanceOverviewBattle(slow, .1));
  for (let i = 0; i < 800; i++) fastEvents.push(...advanceOverviewBattle(fast, .005));
  assert.deepEqual(slow.ships, fast.ships); assert.deepEqual(slowEvents, fastEvents);
  assert.deepEqual(slow.projectiles, fast.projectiles); assert.equal(slow.day, fast.day);
  assert.ok(slowEvents.some(e => e.kind === 'fire' && e.ship === 'aurora'));
  assert.ok(slowEvents.some(e => e.kind === 'impact'));
  assert.ok(slow.ships.filter(s => s.type === 'interceptor').some(s => Math.hypot(...s.position.map((v, i) => v - s.home[i])) > 200));
  for (const ship of slow.ships.filter(s => s.type === 'interceptor' && activeShip(s) && Math.hypot(...s.velocity) > 20)) {
    const speed = Math.hypot(...ship.velocity);
    assert.ok(ship.facing.reduce((n, v, i) => n + v * ship.velocity[i] / speed, 0) > .95);
  }
  for (const ship of slow.ships.filter(s => s.type !== 'interceptor')) assert.deepEqual(ship.position, ship.home);
});
test('bow salvos start at the model exit and cannot fire while turning away from a target', () => {
  const battle = createOverviewBattle();
  const own = battle.ships.find(s => s.id === 'aurora'); let seen = 0;
  for (let i = 0; i < 200; i++) {
    const events = advanceOverviewBattle(battle, DEMO_STEP);
    for (const event of events.filter(e => e.kind === 'fire' && e.ship === own.id)) {
      assert.deepEqual(event.from, weaponPosition(own, own.length));
      const delta = event.to.map((v, axis) => v - own.position[axis]), length = Math.hypot(...delta);
      assert.ok(own.facing.reduce((n, v, axis) => n + v * delta[axis] / length, 0) > Math.cos(.07)); seen++;
    }
  }
  assert.ok(seen > 0);
  commandDemo(battle, 'retreat');
  for (let i = 0; i < 300 && activeShip(own); i++) assert.ok(!advanceOverviewBattle(battle, DEMO_STEP).some(e => e.kind === 'fire' && e.ship === own.id));
});
test('probe motion stops in pause and an ended or invalid advance does not move ships', () => {
  const battle = createOverviewBattle('5v35'), before = structuredClone(battle.ships);
  assert.deepEqual(advanceOverviewBattle(battle, 0), []); assert.deepEqual(battle.ships, before);
  assert.throws(() => advanceOverviewBattle(battle, NaN), RangeError);
  battle.phase = 'defeat'; assert.deepEqual(advanceOverviewBattle(battle, 10), []); assert.deepEqual(battle.ships, before);
});
test('a queued muzzle event stays at the launch point while its projectile advances', () => {
  const battle = createOverviewBattle();
  const events = advanceOverviewBattle(battle, .5), event = events.find(e => e.kind === 'fire' && e.ship === 'aurora');
  assert.ok(event); const from = [...event.from];
  assert.deepEqual(event.from, weaponPosition(battle.ships.find(s => s.id === 'aurora'), OVERVIEW_MODELS.cruiser.length));
  advanceOverviewBattle(battle, .2); assert.deepEqual(event.from, from);
});
