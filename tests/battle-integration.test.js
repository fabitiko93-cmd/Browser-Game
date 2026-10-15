import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, getPlanet, makeStock } from '../src/state.js';
import { orderFleet, tickFleets, resolveBattle, fleetStrength } from '../src/fleets.js';
import { beginWar } from '../src/realm-relations.js';
import { validateSave, parseImport, exportGame } from '../src/save.js';
import { SHIPS, SAVE_VERSION } from '../src/data.js';
import { BATTLE_REPORT_LIMIT, battleLosses, battleResult } from '../src/battle-records.js';
import { createBattleReplay, advanceBattleReplay, REPLAY_MODELS } from '../src/battle-replay.js';
import { DEMO_CLASSES } from '../src/battle-demo.js';
import { battleReportsView } from '../src/battle-report-ui.js';

function ship(state, id, type, owner, planetId, hp = 100, supply = 100) {
  const f = { id, name: id, type, owner, planetId, hp, supply, cargo: makeStock(), mission: null, route: null };
  state.fleets.push(f); return f;
}
function fixture({ capture = false, guards = 3, defense = 28, playerDefends = false, supply = 100 } = {}) {
  const state = createGame({ legacy: true }), planet = getPlanet(state, playerDefends ? 'nereid' : 'veyra');
  beginWar(state, 'player', playerDefends ? 'aster' : 'khepri');
  const owner = playerDefends ? 'aster' : 'player';
  planet.defense = defense; planet.garrison = 30;
  const attackers = [ship(state, 'attacker-1', 'cruiser', owner, planet.id, 83, supply), ship(state, 'attacker-2', 'destroyer', owner, planet.id, 92, supply)];
  if (capture) attackers.push(ship(state, 'lander-1', 'lander', owner, planet.id));
  for (let i = 0; i < guards; i++) ship(state, `guard-${i}`, 'corvette', planet.owner, planet.id, 75, 85);
  return { state, planet, attackers };
}

test('attack arrival records the actual participants and authoritative end state, including planetary-only defense', () => {
  const s = createGame({ legacy: true }), f = s.fleets[0], target = getPlanet(s, 'veyra');
  beginWar(s, 'player', 'khepri'); f.type = 'cruiser'; getPlanet(s, 'nereid').stock.energy = 500;
  assert.equal(orderFleet(s, [f.id], target.id, 'attack'), null);
  const days = f.mission.remaining;
  for (let i = 0; i < days - 1; i++) tickFleets(s, { economyProcessed: true });
  assert.equal(s.battleReports.length, 0);
  tickFleets(s, { economyProcessed: true });
  const r = s.battleReports[0];
  assert.deepEqual(r.ships.map(s => s.id), [f.id]); assert.equal(r.planetId, target.id);
  assert.equal(r.ships[0].hpBefore, 100); assert.equal(r.ships[0].hpAfter, f.hp);
  assert.equal(r.ships[0].supplyAfter, f.supply); assert.equal(r.defense.after, target.defense);
  assert.equal(r.captured, false); assert.equal(r.victory, true); validateSave(s);
});

test('real defenders, wounded ships and retreat fuel losses remain distinct from combat destruction', () => {
  const { state, planet, attackers } = fixture({ defense: 100, guards: 3, supply: 0 });
  const attack = attackers.reduce((n, f) => n + fleetStrength(state, f), 0), before = attackers.map(f => f.hp);
  resolveBattle(state, attackers, planet);
  const r = state.battleReports[0]; assert.equal(r.victory, false); assert.equal(r.ships.length, 5);
  assert.ok(r.ships.some(s => s.outcome === 'lost' && s.combatHp > 0 && s.hpAfter === 0));
  assert.equal(battleLosses(r), r.ships.filter(s => s.owner === 'player' && s.hpAfter === 0).length);
  assert.equal(battleResult(r), 'Angriff abgewehrt'); assert.ok(attack > 0);
  assert.deepEqual(r.ships.slice(0, 2).map(s => s.hpBefore), before); validateSave(state);
});

test('conquest consumes real landers as a garrison, not destroyed ships, and keeps an immutable record', () => {
  const { state, planet, attackers } = fixture({ capture: true, guards: 0, defense: 2 });
  resolveBattle(state, attackers, planet); const r = state.battleReports[0], saved = structuredClone(r);
  assert.equal(planet.owner, 'player'); assert.equal(r.captured, true); assert.equal(battleResult(r), 'Planet erobert');
  assert.equal(r.ships.find(s => s.type === 'lander').outcome, 'landed');
  assert.ok(!state.fleets.some(f => f.id === 'lander-1')); assert.equal(battleLosses(r), 0);
  attackers[0].hp = 100; attackers[0].name = 'Repaired'; planet.name = 'New colony';
  assert.deepEqual(r, saved); assert.deepEqual(parseImport(exportGame(state)), state);
});

test('player defense is recorded even when the last colony falls, while foreign-only wars and canceled attacks reveal no report', () => {
  const { state, planet, attackers } = fixture({ playerDefends: true, capture: true, defense: 0, guards: 0 });
  resolveBattle(state, attackers, planet); assert.equal(state.battleReports.length, 1);
  assert.equal(state.battleReports[0].defender, 'player'); assert.equal(battleResult(state.battleReports[0]), 'Planet verloren');
  assert.equal(state.galaxy.defeat.conqueror, 'aster'); validateSave(state);
  const foreign = createGame({ legacy: true }), p = getPlanet(foreign, 'veyra'), f = ship(foreign, 'enemy', 'cruiser', 'aster', p.id);
  beginWar(foreign, 'aster', 'khepri'); resolveBattle(foreign, [f], p); assert.equal(foreign.battleReports.length, 0);
  const peaceful = createGame({ legacy: true }); resolveBattle(peaceful, [peaceful.fleets[0]], getPlanet(peaceful, 'veyra')); assert.equal(peaceful.battleReports.length, 0);
});

test('old saves migrate without creating historical battles or changing empire progress', () => {
  const s = createGame({ legacy: true }); s.version = 11; delete s.battleReports; s.dayProgress = .42;
  const loaded = parseImport(exportGame(s)), expected = { ...s, version: SAVE_VERSION, battleReports: [] };
  assert.deepEqual(loaded, expected); assert.equal(loaded.version, 12);
});

test('reports survive export and import and reject forged participant shapes, outcomes, identities and chronology', () => {
  const { state, planet, attackers } = fixture({ capture: true, guards: 0, defense: 1 }); resolveBattle(state, attackers, planet);
  assert.deepEqual(parseImport(exportGame(state)), state);
  for (const mutate of [
    r => r.ships.push({ ...r.ships[0] }), r => { r.attacker = 'constructor'; }, r => { r.day = 9; },
    r => { r.ships[0].hpAfter = 101; }, r => { r.ships[0].hpAfter = r.ships[0].combatHp + 1; },
    r => { r.ships[0].outcome = 'destroyed'; }, r => { r.ships[0].type = 'interceptor'; },
    r => { r.ships[0].outcome = 'landed'; }, r => { r.defense.shieldAfter = 999; },
    r => { r.planetId = 'missing'; }, r => { r.ships = []; },
  ]) { const s = structuredClone(state); mutate(s.battleReports[0]); assert.throws(() => validateSave(s)); }
});

test('the archive remains bounded without retaining live ship references', () => {
  const { state, planet, attackers } = fixture({ guards: 0, defense: 0 });
  for (let i = 0; i < 10; i++) { attackers.forEach(f => { f.hp = 100; f.supply = 100; }); resolveBattle(state, attackers, planet); }
  assert.equal(state.battleReports.length, BATTLE_REPORT_LIMIT);
  assert.notEqual(state.battleReports[0].ships[0], state.battleReports[1].ships[0]); validateSave(state);
});

test('replay preserves every actual class, never invents fighter fleets, and excludes the orbital asset from ship counts', () => {
  assert.deepEqual(Object.keys(REPLAY_MODELS).sort(), Object.keys(SHIPS).sort());
  const { state, planet, attackers } = fixture({ guards: 0, defense: 0 });
  for (const type of Object.keys(SHIPS)) attackers.push(ship(state, `type-${type}`, type, 'player', planet.id));
  resolveBattle(state, attackers, planet); const r = state.battleReports[0], b = createBattleReplay(r);
  assert.equal(b.ships.filter(s => !s.installation).length, r.ships.length);
  assert.equal(b.ships.filter(s => s.installation).length, 1);
  for (const s of r.ships) { const v = b.ships.find(v => v.id === s.id); assert.equal(v.className, SHIPS[s.type].name); assert.equal(v.hull, DEMO_CLASSES[v.type].hull * s.hpBefore / 100); assert.equal(v.shield, 0); }
});

test('replay is render-rate independent, reproduces the recorded end state and cannot alter a saved empire when repeated', () => {
  const { state, planet, attackers } = fixture({ capture: true, guards: 3, defense: 4 }); resolveBattle(state, attackers, planet);
  const saved = exportGame(state), report = state.battleReports[0], a = createBattleReplay(report), b = createBattleReplay(report);
  const eventsA = [], eventsB = [];
  for (let i = 0; i < 36 * 30; i++) eventsA.push(...advanceBattleReplay(a, 1 / 30));
  for (let i = 0; i < 36 * 60; i++) eventsB.push(...advanceBattleReplay(b, 1 / 60));
  assert.deepEqual(a, b); assert.deepEqual(eventsA, eventsB); assert.equal(a.phase, 'recorded');
  for (const r of report.ships) { const s = a.ships.find(s => s.id === r.id); assert.ok(Math.abs(s.hull / DEMO_CLASSES[s.type].hull * 100 - r.hpAfter) < 1e-7); assert.equal(s.escaped, ['retreated', 'landed', 'lost'].includes(r.outcome)); }
  assert.equal(exportGame(state), saved); assert.deepEqual(advanceBattleReplay(a, 20), []);
  assert.throws(() => advanceBattleReplay(b, NaN));
});

test('only armed ships fire, and visible fixed weapons follow their actual bow toward the selected contact', () => {
  const { state, planet, attackers } = fixture({ defense: 200, guards: 3 });
  attackers.push(ship(state, 'unarmed', 'freighter', 'player', planet.id)); resolveBattle(state, attackers, planet);
  const b = createBattleReplay(state.battleReports[0]); let shots = 0, harbingerShots = 0;
  for (let i = 0; i < 20 * 60; i++) for (const e of advanceBattleReplay(b, 1 / 60)) if (e.kind === 'fire') {
    const s = b.ships.find(s => s.id === e.ship), delta = e.to.map((v, j) => v - e.from[j]), length = Math.hypot(...delta);
    assert.notEqual(e.ship, 'unarmed'); assert.ok(delta.reduce((n, v, j) => n + v / length * s.facing[j], 0) > .999999);
    shots++; if (s.record?.type === 'cruiser') harbingerShots++;
  }
  assert.ok(shots > 0 && harbingerShots > 0);
});

test('battle cards escape saved names and expose real recordings in the game', () => {
  const { state, planet, attackers } = fixture(); planet.name = '<script>bad()</script>'; resolveBattle(state, attackers, planet);
  const html = battleReportsView(state); assert.match(html, /data-action="battle-open"/); assert.match(html, /&lt;script&gt;/); assert.ok(!html.includes('<script>'));
});
