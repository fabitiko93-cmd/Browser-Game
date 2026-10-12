import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoBattle, advanceDemoBattle, commandDemo, selectDemoShip, activeShip } from '../src/battle-demo.js';

test('preview combat is identical at different render frame rates', () => {
  const batched = createDemoBattle(), frames = createDemoBattle();
  advanceDemoBattle(batched, 20);
  for (let i = 0; i < 3600; i++) advanceDemoBattle(frames, 1 / 180);
  assert.equal(frames.tick, batched.tick);
  assert.equal(frames.phase, batched.phase);
  assert.deepEqual(frames.ships, batched.ships);
  assert.ok(Math.abs(frames.remainder - batched.remainder) < 1e-8);
});

test('a selected target and focus order change actual incoming damage', () => {
  const focused = createDemoBattle(), normal = createDemoBattle();
  selectDemoShip(focused, 'wraith'); commandDemo(focused, 'focus');
  advanceDemoBattle(focused, 1); advanceDemoBattle(normal, 1);
  const shield = b => b.ships.find(s => s.id === 'wraith').shield;
  assert.ok(shield(focused) < shield(normal));
  assert.equal(focused.selected, 'aurora');
  assert.equal(focused.target, 'wraith');
  advanceDemoBattle(focused, 4);
  assert.equal(focused.ships.find(s => s.id === 'wraith').hull, 0);
  assert.notEqual(focused.target, 'wraith');
});

test('retreat moves real preview ships out of firing range and ends in withdrawal', () => {
  const battle = createDemoBattle(); commandDemo(battle, 'retreat');
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
