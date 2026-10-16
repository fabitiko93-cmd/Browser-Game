import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createGame } from '../src/state.js';
import { createBattleTrial, advanceBattleTrial, trialPlan, parseTrial, serializeTrial } from '../src/battle-trial.js';
import { createTrialPlan, addPlanShips } from '../src/battle-planner.js';
import { BattlePlanner } from '../src/battle-planner-ui.js';
import { focusInfo } from '../src/battle-focus.js';
import { HarbingerScene } from '../src/harbinger-scene.js';
import { commandManeuver } from '../src/battle-maneuvers.js';

const model = () => ({ source: null, savedDraft: null, expanded: new Set(), history: [], plan: null });
test('a new probe replaces a stale draft, while reopening its own draft retains edits', () => {
  const planner = model(), old = createBattleTrial({ plan: createTrialPlan('20v20') });
  BattlePlanner.prototype.bind.call(planner, old);
  addPlanShips(planner.plan, 'friendly', planner.plan.sides.friendly.groups[0].id, 'freighter', 2);
  const edited = structuredClone(planner.plan);
  BattlePlanner.prototype.bind.call(planner, old); assert.deepEqual(planner.plan, edited);
  const next = createBattleTrial({ plan: createTrialPlan('50v50') });
  BattlePlanner.prototype.bind.call(planner, next);
  assert.equal(planner.plan.sides.friendly.ships.length, 50);
  assert.equal(planner.plan.sides.enemy.ships.length, 50);
  assert.notEqual(planner.source.id, old.preparation.id);
  const restored = model(); restored.savedDraft = { source: planner.source, plan: edited };
  BattlePlanner.prototype.bind.call(restored, next); assert.deepEqual(restored.plan, edited);
  const foreign = model(); foreign.savedDraft = { source: { id: 'wrong' }, plan: edited };
  BattlePlanner.prototype.bind.call(foreign, next); assert.equal(foreign.plan.sides.friendly.ships.length, 50);
});
test('planning and redeployment retain copied hulls, individual supply and frozen class bonuses', () => {
  const state = createGame({ legacy: true }); state.tech = ['targeting', 'lasers', 'shielding']; state.player.ideology = 'military';
  state.fleets[0].hp = 65; state.fleets[0].supply = 60; state.fleets[1].hp = 40; state.fleets[1].supply = 20;
  const original = JSON.stringify(state), first = createBattleTrial({ mode: 'fleet', state, planetId: 'nereid' });
  const plan = trialPlan(first), initial = first.ships.map(s => ({ id: s.id, hull: s.hull, supply: s.supply, combat: s.combat }));
  advanceBattleTrial(first, 1);
  const next = createBattleTrial({ ...first.setup, plan, preparation: first.preparation });
  assert.equal(next.setup.mode, 'fleet'); assert.equal(next.preparation.id, first.preparation.id);
  assert.deepEqual(next.ships.map(s => ({ id: s.id, hull: s.hull, supply: s.supply, combat: s.combat })), initial);
  assert.equal(next.tick, 0); assert.equal(JSON.stringify(state), original);
  assert.deepEqual(parseTrial(serializeTrial(next)), next);
  plan.sides.friendly.supply = 5;
  const supplied = createBattleTrial({ ...next.setup, plan, preparation: next.preparation });
  assert.ok(supplied.ships.filter(s => s.side === 'friendly').every(s => s.supply === 5));
  const broken = structuredClone(next); broken.preparation.profiles.friendly.cruiser.armor = 2;
  assert.throws(() => parseTrial(serializeTrial(broken)));
});
test('new planned ships use the original research profile after reload without an empire', () => {
  const state = createGame({ legacy: true }); state.tech = ['targeting', 'lasers', 'shielding'];
  const first = createBattleTrial({ mode: 'profile', state }), plan = trialPlan(first);
  addPlanShips(plan, 'friendly', plan.sides.friendly.groups[0].id, 'cruiser', 1);
  const next = createBattleTrial({ ...first.setup, plan, preparation: first.preparation });
  const own = next.ships.filter(s => s.side === 'friendly' && s.strategicType === 'cruiser');
  assert.equal(next.setup.mode, 'profile'); assert.ok(own.every(s => s.combat.armor === first.ships[0].combat.armor));
  assert.ok(own.every(s => s.combat.power === first.ships[0].combat.power));
});
test('ship and group focus use active physical positions without mutating combat or its draft', () => {
  const b = createBattleTrial({ plan: createTrialPlan() }), ship = b.ships.find(s => s.side === 'friendly' && s.strategicType === 'corvette');
  b.scope = 'group'; b.selectedGroup = ship.group; commandManeuver(b, 'flank-left'); advanceBattleTrial(b, 1);
  const before = serializeTrial(b), group = focusInfo(b, { kind: 'group', id: ship.group });
  assert.deepEqual(focusInfo(b, { kind: 'ship', id: ship.id }).position, ship.position);
  assert.ok(group.count > 1); assert.notDeepEqual(group.position, ship.home);
  assert.equal(serializeTrial(b), before);
  for (const s of b.ships.filter(s => s.group === ship.group)) s.hull = 0;
  assert.equal(focusInfo(b, { kind: 'group', id: ship.group }), null);
});
test('overview refocusing preserves the camera offset, distance, FOV and every other ship', () => {
  const b = createBattleTrial({ plan: createTrialPlan() }), ship = b.ships[0];
  const scene = { camera: new THREE.PerspectiveCamera(30, 1, .1, 35000), controls: { target: new THREE.Vector3(0, 0, 1000) },
    effects: {}, followed: new THREE.Vector3(), frameProjection() {}, overviewCenter: HarbingerScene.prototype.overviewCenter };
  scene.camera.position.set(400, 1000, 3000);
  const offset = scene.camera.position.clone().sub(scene.controls.target), before = serializeTrial(b);
  HarbingerScene.prototype.focusOverview.call(scene, { kind: 'ship', id: ship.id }, b, false);
  assert.deepEqual(scene.controls.target.toArray(), ship.position);
  assert.ok(scene.camera.position.clone().sub(scene.controls.target).distanceTo(offset) < 1e-8);
  assert.equal(scene.camera.fov, 30); assert.equal(scene.mode, 'overview'); assert.equal(serializeTrial(b), before);
});
