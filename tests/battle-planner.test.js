import test from 'node:test';
import assert from 'node:assert/strict';
import { SHIPS } from '../src/data.js';
import { createTrialPlan, validateTrialPlan, fleetLayout, deployTrialPlan, addPlanGroup, addPlanShips, removePlanGroup, PLANNER_SAVE_KEY } from '../src/battle-planner.js';
import { createBattleTrial, advanceBattleTrial, parseTrial, serializeTrial, TRIAL_SAVE_KEY } from '../src/battle-trial.js';
import { commandDemo, commandedShips, activeShip, DEMO_STEP, armedShip } from '../src/battle-demo.js';
import { recipientInfo, battleSelection } from '../src/battle-selection.js';
import { commandDisplay } from '../src/harbinger-display.js';
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} != ${b}`);
const vector = (a, b) => a.forEach((v, i) => near(v, b[i]));

test('both planning levels work without an empire and preset participants all belong to named groups', () => {
  assert.notEqual(PLANNER_SAVE_KEY, TRIAL_SAVE_KEY);
  for (const [scenario, own, enemy] of [['20v20',20,20],['5v35',5,35],['35v5',35,5],['50v50',50,50]]) {
    const p = createTrialPlan(scenario), b = createBattleTrial({ plan: p });
    assert.deepEqual(validateTrialPlan(JSON.parse(JSON.stringify(p))), p);
    assert.equal(b.ships.filter(s => s.side === 'friendly').length, own);
    assert.equal(b.ships.filter(s => s.side === 'enemy').length, enemy);
    assert.ok(b.ships.every(s => b.formations.some(g => s.group === g.id && s.side === g.side)));
    assert.equal(new Set(b.ships.map(s => s.id)).size, own + enemy);
    assert.deepEqual(parseTrial(serializeTrial(b)), b);
  }
});
test('all twelve existing classes can be added and regrouped; unarmed classes stay unarmed', () => {
  const p = createTrialPlan('5v35'), f = p.sides.friendly, group = addPlanGroup(p, 'friendly');
  for (const type of Object.keys(SHIPS)) addPlanShips(p, 'friendly', group, type, 1);
  const b = createBattleTrial({ plan: p }), members = b.ships.filter(s => s.group === group);
  assert.equal(members.length, 12);
  for (const s of members) assert.equal(armedShip(s), SHIPS[s.strategicType].strength > 0);
  assert.equal(commandDemo(b, 'scope', 'group'), false);
  b.selectedGroup = group; assert.equal(commandDemo(b, 'scope', 'group'), true);
  assert.equal(commandedShips(b).length, 12);
  assert.equal(recipientInfo(b).armed.length, members.filter(armedShip).length);
  const ships = structuredClone(f.ships); removePlanGroup(p, 'friendly', group);
  assert.equal(f.ships.length, ships.length); assert.ok(f.ships.every(s => f.groups.some(g => g.id === s.groupId)));
  validateTrialPlan(p);
});
test('organic offsets are stable through save, redraw and pause, while a new seed changes real positions', () => {
  const p = createTrialPlan('50v50'), first = deployTrialPlan(p), next = deployTrialPlan(validateTrialPlan(JSON.parse(JSON.stringify(p))));
  assert.deepEqual(first, next);
  const b = createBattleTrial({ plan: p }), before = serializeTrial(b); advanceBattleTrial(b, 0); assert.equal(serializeTrial(b), before);
  const even = structuredClone(p); for (const side of ['friendly','enemy']) for (const g of even.sides[side].groups) g.scatter = 0;
  assert.notDeepEqual(deployTrialPlan(even).friendly.ships.map(s => s.position), first.friendly.ships.map(s => s.position));
  p.seed++; assert.notDeepEqual(deployTrialPlan(p).friendly.ships.map(s => s.position), first.friendly.ships.map(s => s.position));
});
test('minimum hull distances survive crowded manual ship slots and overlapping whole groups', () => {
  const p = createTrialPlan('50v50');
  for (const side of ['friendly','enemy']) {
    for (const g of p.sides[side].groups) { g.offset = [0,0,0]; g.spacing = .7; }
    for (const s of p.sides[side].ships) s.offset = [0,0,0];
  }
  const deployed = deployTrialPlan(p), all = [...deployed.friendly.ships, ...deployed.enemy.ships];
  for (let i = 0; i < all.length; i++) for (let j = i+1; j < all.length; j++)
    assert.ok(Math.hypot(...all[i].position.map((v,a) => v-all[j].position[a])) >= (all[i].length+all[j].length)/2+12-1e-7);
});
test('moving a whole group preserves every internal offset and rotating the fleet rotates both levels', () => {
  const p = createTrialPlan('5v35'), f = p.sides.friendly;
  const first = fleetLayout(p,'friendly'), g = f.groups[0], origin = first.groups[0].slot;
  g.offset = origin.map((v,i) => v + [500,100,0][i]);
  const moved = fleetLayout(p,'friendly');
  for (const s of first.ships) vector(moved.ships.find(n=>n.id===s.id).position, s.position.map((v,i)=>v+(s.groupId===g.id?[500,100,0][i]:0)));
  f.heading = 90; const rotated = fleetLayout(p,'friendly');
  for (const s of moved.ships) vector(rotated.ships.find(n=>n.id===s.id).position,[s.position[2],s.position[1],-s.position[0]]);
});
test('the planner deployment and physical ships share exact positions and neither shares mutable draft state', () => {
  const p = createTrialPlan(), expected = deployTrialPlan(p), b = createBattleTrial({ plan: p });
  for (const side of ['friendly','enemy']) for (const s of expected[side].ships) vector(b.ships.find(n=>n.sourceId===s.id).position,s.position);
  const before = serializeTrial(b); p.sides.friendly.ships[0].name = 'Changed'; p.sides.friendly.groups[0].offset = [500,0,0];
  assert.equal(serializeTrial(b),before);
  const clone = parseTrial(before); clone.plan.seed++; assert.notEqual(clone.plan.seed,b.plan.seed);
});
test('group attacks, class priorities, automatic targets and links affect exactly the selected active group', () => {
  const b = createBattleTrial({ plan: createTrialPlan() }), group = b.formations.find(g=>g.side==='friendly').id;
  b.selectedGroup=group; commandDemo(b,'scope','group'); const members=commandedShips(b), other=b.ships.filter(s=>s.side==='friendly'&&s.group!==group);
  assert.ok(commandDemo(b,'attack')); assert.ok(members.every(s=>s.commandTarget===b.target)); assert.ok(other.every(s=>s.targeting==='auto'));
  const selection={scope:'group',group,selected:b.selected}, marked=battleSelection(b,selection);
  assert.deepEqual(marked.sources.sort(),members.map(s=>s.id).sort()); assert.ok(marked.links.every(l=>l.target===b.target));
  assert.match(recipientInfo(b).label,new RegExp(b.formations[0].name)); assert.match(commandDisplay(b).label,/Verband/);
  assert.ok(commandDemo(b,'priority','destroyer')); assert.ok(members.every(s=>s.priority==='destroyer')); assert.ok(other.every(s=>s.priority===null));
  assert.ok(commandDemo(b,'auto')); assert.ok(members.every(s=>s.targeting==='auto')); assert.equal(b.tick,0);
  members[0].hull=0; assert.equal(commandedShips(b).length,members.length-1);
  assert.deepEqual(parseTrial(serializeTrial(b)),b);
});
test('a group retreat checks all member resources atomically and leaves other groups in combat', () => {
  const b=createBattleTrial({plan:createTrialPlan()}), group=b.formations.find(g=>g.side==='friendly'&&b.ships.filter(s=>s.group===g.id).length>1).id;
  b.selectedGroup=group;commandDemo(b,'scope','group');const own=commandedShips(b),other=b.ships.filter(s=>s.side==='friendly'&&s.group!==group);
  own[1].supply=0;const before=serializeTrial(b);assert.equal(commandDemo(b,'retreat'),false);assert.equal(serializeTrial(b),before);assert.equal(commandDisplay(b).canRetreat,false);
  own[1].supply=100;assert.ok(commandDemo(b,'retreat'));assert.ok(own.every(s=>s.supply===92&&s.order==='retreat'));assert.ok(other.every(s=>s.supply===100&&s.order==='engage'));
  advanceBattleTrial(b,1);assert.deepEqual(parseTrial(serializeTrial(b)),b);
});
test('every armed planned preset opens in one shared tick regardless of processing order', () => {
  for(const scenario of ['20v20','5v35','35v5','50v50']) for(const reverse of [false,true]) {
    const b=createBattleTrial({plan:createTrialPlan(scenario)});if(reverse)b.ships.reverse();
    const shots=advanceBattleTrial(b,DEMO_STEP).filter(e=>e.kind==='fire');
    assert.equal(shots.length,b.ships.length);assert.ok(shots.every(e=>e.day===DEMO_STEP));
  }
});
test('free sizes and invalid references retain safe draft and checkpoint validation', () => {
  const p=createTrialPlan('50v50');addPlanShips(p,'friendly',p.sides.friendly.groups[0].id,'cruiser',25);assert.equal(p.sides.friendly.ships.length,75);
  for(const mutate of [p=>p.version=2,p=>p.seed=-1,p=>p.sides.enemy.ships=[],p=>p.sides.friendly.ships[0].type='fake',p=>p.sides.friendly.ships[0].groupId='missing',p=>p.sides.friendly.groups[0].offset=[NaN,0,0],p=>p.sides.friendly.groups[0].name='',p=>p.sides.friendly.ships[1].id=p.sides.friendly.ships[0].id,p=>p.sides.enemy.groups[0].id=p.sides.friendly.groups[0].id]) {
    const bad=structuredClone(p);mutate(bad);assert.throws(()=>validateTrialPlan(bad));
  }
  const b=createBattleTrial({plan:p});
  for(const mutate of [b=>b.ships[0].group='missing',b=>b.ships[0].strategicType='support',b=>b.formations[0].side='enemy',b=>b.plan.sides.friendly.ships.pop(),b=>{b.scope='group';b.selectedGroup=b.formations.find(g=>g.side==='enemy').id;}]) {
    const bad=structuredClone(b);mutate(bad);assert.throws(()=>parseTrial(serializeTrial(bad)));
  }
});
test('planned group combat is reproducible across frame sizes, saves and completion', () => {
  const a=createBattleTrial({plan:createTrialPlan('5v35')}),b=structuredClone(a);
  for(let i=0;i<20;i++)advanceBattleTrial(a,.5);for(let i=0;i<200;i++)advanceBattleTrial(b,.05);
  assert.deepEqual(a,b);
  const restored=parseTrial(serializeTrial(a));assert.deepEqual(advanceBattleTrial(a,120),advanceBattleTrial(restored,120));assert.deepEqual(a,restored);
  assert.notEqual(a.phase,'engaged');assert.ok(a.ships.some(s=>!activeShip(s)));parseTrial(serializeTrial(a));
});
