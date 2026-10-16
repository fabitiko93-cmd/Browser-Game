import test from 'node:test';
import assert from 'node:assert/strict';
import { formationProfile, formationFor, maneuverSpec } from '../src/battle-formations.js';
import { createTrialPlan, planFromRosters, fleetLayout, deployTrialPlan } from '../src/battle-planner.js';
import { createBattleTrial, advanceBattleTrial, serializeTrial, parseTrial } from '../src/battle-trial.js';
import { createPreparation, trialBaseline } from '../src/battle-preparation.js';
import { commandDemo, DEMO_STEP, targetFor } from '../src/battle-demo.js';

function fixture(own, enemy) {
  const roster = (types, side) => types.map((type, i) => ({ id: `${side}-${i}`, name: `${type} ${i}`, type }));
  return planFromRosters({ friendly: roster(own, 'own'), enemy: roster(enemy, 'foe') });
}
function preparation(plan) {
  const p = createPreparation(trialBaseline(), 'Formation test');
  p.ships = ['friendly', 'enemy'].flatMap(side => plan.sides[side].ships.map(s => ({ id: s.id, side, type: s.type, hp: 100, supply: 100 })));
  return p;
}
test('placement and navigation agree that corvettes are faster, while damage reduces frontline endurance', () => {
  const cruiser = formationProfile({ type: 'cruiser' }), corvette = formationProfile({ type: 'corvette' });
  assert.equal(corvette.speed, maneuverSpec({ strategicType: 'corvette', length: 14 }).speed);
  assert.ok(corvette.speed > cruiser.speed); assert.equal(corvette.fast, true);
  const damaged = formationProfile({ type: 'cruiser' }, { hp: 35 });
  assert.ok(damaged.endurance < corvette.endurance); assert.ok(damaged.power < cruiser.power);
  assert.equal(damaged.protected, true); assert.equal(formationProfile({ type: 'lander' }).protected, true);
});
test('actual copied starting values determine the layout shared by the preview and deployment', () => {
  const plan = fixture(['cruiser', 'destroyer', 'corvette', 'freighter'], ['destroyer']), origin = preparation(plan);
  const before = fleetLayout(plan, 'friendly', origin);
  origin.ships.find(s => s.side === 'friendly' && s.type === 'cruiser').hp = 35;
  origin.ships.find(s => s.side === 'friendly' && s.type === 'corvette').supply = 20;
  const deployed = deployTrialPlan(plan, origin), battle = createBattleTrial({ plan, preparation: origin });
  assert.notDeepEqual(deployed.friendly.ships.map(s => s.position), before.ships.map(s => s.position));
  for (const side of ['friendly', 'enemy']) for (const s of deployed[side].ships)
    assert.deepEqual(battle.ships.find(p => p.sourceId === s.id && p.side === side).position, s.position);
  const heavy = battle.ships.find(s => s.side === 'friendly' && s.strategicType === 'cruiser');
  const healthy = battle.ships.find(s => s.side === 'friendly' && s.strategicType === 'destroyer');
  assert.ok(heavy.position[2] > healthy.position[2]);
});
test('the four usual fleet choices have distinct layouts and retain every membership and manual slot', () => {
  const plan = createTrialPlan(), membership = plan.sides.friendly.ships.map(s => [s.id, s.groupId]), layouts = new Set();
  for (const formation of ['auto', 'line', 'wedge', 'screen']) {
    plan.sides.friendly.formation = formation;
    for (const g of plan.sides.friendly.groups) g.formation = formation;
    layouts.add(JSON.stringify(fleetLayout(plan, 'friendly').ships.map(s => s.position)));
    assert.deepEqual(plan.sides.friendly.ships.map(s => [s.id, s.groupId]), membership);
  }
  assert.equal(layouts.size, 4);
  const group = plan.sides.friendly.groups[0]; group.offset = [700, 0, 300];
  assert.deepEqual(fleetLayout(plan, 'friendly').groups.find(g => g.id === group.id).slot, group.offset);
});
test('a wedge shares its first salvos across targets already covered by incoming torpedoes', () => {
  const plan = fixture(['cruiser', 'cruiser', 'cruiser'], ['corvette', 'corvette', 'corvette']);
  plan.sides.friendly.formation = 'wedge'; const battle = createBattleTrial({ plan });
  const own = battle.ships.filter(s => s.side === 'friendly'), before = own.map(s => structuredClone(s.combat));
  const first = advanceBattleTrial(battle, DEMO_STEP).filter(e => e.kind === 'fire' && own.some(s => s.id === e.ship));
  assert.equal(first.length, 3); const counts = new Map();
  for (const shot of first) counts.set(shot.target, (counts.get(shot.target) ?? 0) + 1);
  assert.deepEqual([...counts.values()].sort(), [1, 2]);
  const covered = [...counts].find(([, n]) => n === 2)[0];
  // Make another volley ready before arrival to exercise in-flight reservations.
  for (const ship of own) ship.nextFire = battle.day;
  const second = advanceBattleTrial(battle, DEMO_STEP).filter(e => e.kind === 'fire' && own.some(s => s.id === e.ship));
  assert.ok(own.every(s => s.target !== covered)); assert.ok(second.every(e => e.target !== covered));
  assert.deepEqual(own.map(s => s.combat), before);
});
test('manual single targets, class priorities, retreat and explicit inner formations take precedence', () => {
  const plan = fixture(['cruiser', 'cruiser', 'corvette'], ['destroyer', 'corvette']);
  plan.sides.friendly.formation = 'wedge'; const battle = createBattleTrial({ plan });
  const own = battle.ships.filter(s => s.side === 'friendly'), target = battle.ships.find(s => s.side === 'enemy' && s.strategicType === 'destroyer');
  battle.scope = 'fleet'; battle.target = target.id; assert.ok(commandDemo(battle, 'attack'));
  assert.ok(own.every(s => targetFor(battle, s)?.id === target.id));
  assert.ok(commandDemo(battle, 'priority', 'destroyer')); assert.ok(own.every(s => targetFor(battle, s)?.strategicType === 'destroyer'));
  assert.ok(commandDemo(battle, 'retreat')); assert.ok(own.every(s => s.order === 'retreat'));
  battle.formations.find(g => g.id === own[0].group).formation = 'line';
  assert.equal(formationFor(battle, own[0]), 'line');
});
test('coordinated fire remains deterministic across frame chunks, checkpoints and opponent sides', () => {
  for (const side of ['friendly', 'enemy']) {
    const plan = createTrialPlan('5v35'); plan.sides[side].formation = 'wedge';
    const a = createBattleTrial({ plan }), b = parseTrial(serializeTrial(a));
    for (let i = 0; i < 12; i++) advanceBattleTrial(a, .25);
    for (let i = 0; i < 120; i++) advanceBattleTrial(b, .025);
    assert.deepEqual(a, b);
    const restored = parseTrial(serializeTrial(a));
    assert.deepEqual(advanceBattleTrial(a, 3), advanceBattleTrial(restored, 3)); assert.deepEqual(a, restored);
  }
});
