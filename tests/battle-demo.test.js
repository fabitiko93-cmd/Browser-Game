import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoBattle, advanceDemoBattle, commandDemo, selectDemoShip, activeShip, DEMO_CLASSES, WEAPONS, fleetDistanceKm } from '../src/battle-demo.js';

test('preview combat is identical at different render frame rates', () => {
  const batched = createDemoBattle(), frames = createDemoBattle();
  advanceDemoBattle(batched, 20);
  for (let i = 0; i < 3600; i++) advanceDemoBattle(frames, 1 / 180);
  assert.equal(frames.tick, batched.tick);
  assert.equal(frames.phase, batched.phase);
  assert.deepEqual(frames.ships, batched.ships);
  assert.deepEqual(frames.projectiles, batched.projectiles);
  assert.ok(Math.abs(frames.remainder - batched.remainder) < 1e-8);
});

test('opposing fleets hold distant positions throughout an ordinary engagement', () => {
  const battle = createDemoBattle(), positions = battle.ships.map(ship => [...ship.position]);
  assert.ok(fleetDistanceKm(battle) > 49 && fleetDistanceKm(battle) < 51);
  for (const own of battle.ships.filter(ship => ship.side === 'friendly')) {
    for (const enemy of battle.ships.filter(ship => ship.side === 'enemy')) {
      assert.ok(Math.hypot(...own.position.map((value, i) => value - enemy.position[i])) > 1800);
    }
  }
  advanceDemoBattle(battle, 12);
  assert.deepEqual(battle.ships.map(ship => ship.position), positions);
  assert.ok(battle.ships.every(ship => ship.velocity.every(value => value === 0)));
});

test('torpedoes and mass-driver rounds cause damage on arrival, lasers on firing', () => {
  for (const [type, noHitBefore, arrivesBy] of [['cruiser', .8, 1.6], ['destroyer', .4, .7]]) {
    const battle = createDemoBattle(); battle.ships = battle.ships.filter(ship => ship.type === type);
    const target = battle.ships.find(ship => ship.side === 'enemy'), initial = target.shield;
    const earlyEvents = advanceDemoBattle(battle, noHitBefore);
    assert.ok(earlyEvents.some(event => event.kind === 'fire'));
    assert.equal(target.shield, initial);
    assert.ok(battle.projectiles.length > 0);
    const arrivals = advanceDemoBattle(battle, arrivesBy - noHitBefore);
    assert.ok(arrivals.some(event => event.kind === 'impact' && event.target === target.id));
    assert.ok(target.shield < initial);
  }
  const laser = createDemoBattle(); laser.ships = laser.ships.filter(ship => ship.type === 'corvette');
  const events = advanceDemoBattle(laser, .3), fire = events.find(event => event.kind === 'fire');
  const impact = events.find(event => event.kind === 'impact');
  assert.equal(fire.day, impact.day); assert.equal(laser.projectiles.length, 0);
});

test('four weapon types retain range restrictions during withdrawal', () => {
  const battle = createDemoBattle();
  assert.equal(new Set(battle.ships.map(ship => DEMO_CLASSES[ship.type].weapon)).size, 4);
  for (const own of battle.ships.filter(ship => ship.side === 'friendly')) own.position[2] = 8000;
  const events = advanceDemoBattle(battle, 2);
  assert.ok(Object.values(WEAPONS).every(weapon => weapon.range < 8000));
  assert.equal(events.some(event => event.kind === 'fire'), false);
  assert.equal(battle.projectiles.length, 0);
  assert.ok(battle.ships.every(ship => ship.hull === DEMO_CLASSES[ship.type].hull));
});

test('an explicit fleet attack changes real damage without changing inspection', () => {
  const focused = createDemoBattle(), normal = createDemoBattle();
  selectDemoShip(focused, 'wraith'); commandDemo(focused, 'scope', 'fleet'); commandDemo(focused, 'attack');
  advanceDemoBattle(focused, 1); advanceDemoBattle(normal, 1);
  const shield = b => b.ships.find(s => s.id === 'wraith').shield;
  assert.ok(shield(focused) < shield(normal));
  assert.equal(focused.selected, 'aurora');
  assert.equal(focused.target, 'wraith');
  advanceDemoBattle(focused, 4);
  assert.equal(focused.ships.find(s => s.id === 'wraith').hull, 0);
  assert.equal(focused.target, 'wraith');
  assert.ok(focused.ships.filter(s => s.side === 'friendly' && activeShip(s)).every(s => s.targeting === 'auto'));
});

test('retreat moves real preview ships out of firing range and ends in withdrawal', () => {
  const battle = createDemoBattle(); commandDemo(battle, 'scope', 'fleet'); commandDemo(battle, 'retreat');
  advanceDemoBattle(battle, 30);
  assert.equal(battle.phase, 'withdrawn');
  assert.ok(battle.ships.filter(s => s.side === 'friendly').every(s => s.escaped || !s.hull));
  assert.ok(battle.ships.filter(s => s.side === 'friendly').some(s => s.escaped && s.hull > 0));
  assert.ok(battle.ships.filter(s => s.side === 'enemy').some(activeShip));
  const ended = structuredClone(battle); advanceDemoBattle(battle, 10);
  assert.deepEqual(battle, ended);
});

test('preview restart has independent state, and zero duration causes no damage', () => {
  const first = createDemoBattle(), fresh = createDemoBattle();
  advanceDemoBattle(first, 8);
  assert.equal(fresh.day, 0); assert.equal(fresh.ships[0].hull, 260);
  const stopped = structuredClone(first);
  assert.deepEqual(advanceDemoBattle(first, 0), []); assert.deepEqual(first, stopped);
  assert.equal(selectDemoShip(first, 'unknown'), false);
  assert.throws(() => advanceDemoBattle(first, -1), RangeError);
});
