import test from 'node:test';
import assert from 'node:assert/strict';
import { BattleQuality } from '../src/battle-quality.js';

test('quality responds to sustained missed frames, not loading or pauses, and remains bounded', () => {
  const quality = new BattleQuality(3);
  assert.equal(quality.ratio, 1.5);
  quality.observe(.5); quality.observe(.02, false); assert.equal(quality.ratio, 1.5);
  for (let i = 0; i < 50; i++) quality.observe(.04);
  assert.ok(quality.ratio < 1.5);
  for (let i = 0; i < 1000; i++) quality.observe(.04);
  assert.equal(quality.ratio, .85);
  for (let i = 0; i < 7000; i++) quality.observe(1 / 60);
  assert.equal(quality.ratio, 1.75);
  assert.equal(new BattleQuality(1).ratio, 1);
});
