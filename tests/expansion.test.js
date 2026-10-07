import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, getPlanet } from '../src/state.js';
import { forecast, workforce } from '../src/economy.js';
import { PROFILES, LAWS, DECISIONS, enactLaw, decide, policyEffects } from '../src/governance.js';
import { SHIPS } from '../src/data.js';
import { buildShip, shipBuildDays, orderFleet, tickFleets, resolveBattle, fleetStrength } from '../src/fleets.js';
import { diplomaticAction } from '../src/politics.js';
import { stepDay } from '../src/simulation.js';
import { parseImport, exportGame } from '../src/save.js';
import { renderSheet } from '../src/ui.js';
const home = s => getPlanet(s, 'nereid');
const days = (s, n) => { for (let i = 0; i < n; i++) stepDay(s); };
const addShip = (s, type, id = type, planetId = 'nereid') => { const f = { id, type, name: type, planetId, owner: 'player', hp: 100, supply: 100, mission: null, route: null }; s.fleets.push(f); return f; };

test('each ideology has advantages and tradeoffs, without a blanket happiness or citizenship penalty', () => {
  for (const id of Object.keys(PROFILES)) {
    const s = createGame(); s.player.ideology = id;
    const effects = policyEffects(s);
    const entries = Object.entries(PROFILES[id]);
    const beneficial = ([k, v]) => ['shipTime', 'upkeep', 'fleetUpkeep', 'foodDemand', 'researchTime', 'inputEnergy', 'reformCost', 'reformStability'].includes(k) ? v < 1 : v > 1;
    assert.ok(entries.some(beneficial), id); assert.ok(entries.some(e => !beneficial(e)), id);
    assert.equal(effects.happiness, 0);
    assert.ok(workforce(s, home(s)) >= 125);
    assert.ok(forecast(s, home(s)).lastReport.science > 0);
  }
});
test('laws alter actual production, staff and approval and reject invalid changes atomically', () => {
  const s = createGame(), base = forecast(s, home(s));
  const before = exportGame(s); assert.ok(enactLaw(s, 'missing', 'free')); assert.equal(exportGame(s), before);
  assert.equal(enactLaw(s, 'economy', 'planned'), null);
  assert.ok(forecast(s, home(s)).net.alloy > base.net.alloy);
  assert.equal(s.credits, 731); assert.equal(s.player.stability, 72);
  const locked = exportGame(s); assert.ok(enactLaw(s, 'labor', 'extended')); assert.equal(exportGame(s), locked);
  days(s, 5); assert.equal(enactLaw(s, 'labor', 'extended'), null);
  assert.ok(policyEffects(s).workers > 1); assert.equal(policyEffects(s).happiness, -8);
});
test('every law and decision is available to every political form', () => {
  for (const ideology of Object.keys(PROFILES)) for (const [category, law] of Object.entries(LAWS)) for (const choice of Object.keys(law.options)) {
    const s = createGame(); s.player.ideology = ideology;
    if (s.governance.laws[category] !== choice) assert.equal(enactLaw(s, category, choice), null);
  }
  for (const ideology of Object.keys(PROFILES)) for (const id of Object.keys(DECISIONS)) {
    const s = createGame(); s.player.ideology = ideology; assert.equal(decide(s, id), null);
  }
});
test('temporary decisions expire, cannot be stacked with themselves and survive save/import', () => {
  const s = createGame(), normal = forecast(s, home(s)).lastReport.science;
  assert.equal(decide(s, 'grant'), null); assert.equal(s.credits, 660);
  assert.equal(forecast(s, home(s)).lastReport.science, normal * 1.5);
  const before = exportGame(s); assert.ok(decide(s, 'grant')); assert.equal(exportGame(s), before);
  assert.deepEqual(parseImport(before), s);
  days(s, 15); assert.equal(s.governance.decisions.length, 0); assert.equal(policyEffects(s).science, PROFILES.democracy.science);
  assert.ok(decide(s, 'grant')); days(s, 15); assert.equal(decide(s, 'grant'), null);
});
test('version 1 saves migrate without losing buildings, stocks, population or missions', () => {
  const s = createGame(); orderFleet(s, ['starter-c'], 'cinder'); days(s, 2);
  const old = structuredClone(s); old.version = 1; old.planets = old.planets.slice(0, 7); delete old.governance; delete old.surveys;
  const loaded = parseImport(JSON.stringify(old));
  assert.equal(loaded.version, 5); assert.deepEqual(loaded.planets.slice(0, 7), old.planets); assert.deepEqual(loaded.fleets, old.fleets);
  assert.equal(loaded.credits, old.credits); assert.equal(loaded.day, 2);
  days(loaded, 5); assert.equal(loaded.fleets[0].planetId, 'cinder');
  loaded.governance.laws.economy = 'fake'; assert.throws(() => parseImport(exportGame(loaded)));
});
test('all nine ship types build using current policy times and effective armor reduces battle damage', () => {
  assert.equal(Object.keys(SHIPS).length, 9);
  for (const type of Object.keys(SHIPS)) {
    const s = createGame(); s.credits = 10000; home(s).population = 240;
    for (const k of Object.keys(home(s).stock)) home(s).stock[k] = 10000;
    assert.equal(buildShip(s, home(s), type), null);
    assert.equal(home(s).queues[0].remaining, shipBuildDays(s, type));
    days(s, shipBuildDays(s, type)); assert.ok(s.fleets.some(f => f.type === type));
  }
  const s = createGame(), c = addShip(s, 'cruiser'); diplomaticAction(s, 'ilyri', 'war');
  const p = getPlanet(s, 'thalassa'); const damage = p.defense / fleetStrength(s, c) * 55;
  resolveBattle(s, [c], p); assert.ok(Math.abs(c.hp - (100 - damage * .65)) < 1e-8);
});
test('slow ships determine group arrival; survey awards research once per planet', () => {
  const s = createGame(), scout = addShip(s, 'scout'), cruiser = addShip(s, 'cruiser');
  assert.equal(orderFleet(s, [scout.id, cruiser.id], 'cinder', 'survey'), null);
  assert.equal(scout.mission.total, cruiser.mission.total); assert.equal(scout.mission.total, 8);
  for (let i = 0; i < 8; i++) tickFleets(s);
  assert.equal(s.science, 45); assert.deepEqual(s.surveys, ['cinder']);
  assert.equal(orderFleet(s, [scout.id], 'nereid', 'move'), null);
  while (scout.mission) tickFleets(s);
  const before = exportGame(s); assert.ok(orderFleet(s, [scout.id], 'cinder', 'survey')); assert.equal(exportGame(s), before);
});
test('heavy freighters deliver 200 units, save validation respects individual capacity', () => {
  const s = createGame(), f = addShip(s, 'heavyFreighter'); diplomaticAction(s, 'ilyri', 'trade');
  home(s).stock.ore = 500;
  assert.equal(orderFleet(s, [f.id], 'thalassa', 'transport', { resource: 'ore', amount: 200, repeat: true }), null);
  assert.deepEqual(parseImport(exportGame(s)), s);
  const initial = getPlanet(s, 'thalassa').stock.ore;
  const eta = f.mission.total;
  for (let i = 0; i < eta; i++) tickFleets(s);
  assert.equal(getPlanet(s, 'thalassa').stock.ore, initial + 200);
  const invalid = createGame(); invalid.fleets[1].mission = { group: 'm', kind: 'transport', source: 'nereid', target: 'thalassa', total: 5, remaining: 4, cargo: { resource: 'ore', amount: 81 } };
  assert.throws(() => parseImport(exportGame(invalid)));
});
test('support redistributes existing supply in remote orbits and unpaid upkeep drains supplies', () => {
  const s = createGame(); s.fleets = [];
  const support = addShip(s, 'support', 'support', 'cinder'), c = addShip(s, 'corvette', 'c', 'cinder'); c.supply = 20;
  const total = support.supply + c.supply; tickFleets(s);
  assert.equal(support.supply + c.supply, total); assert.equal(c.supply, 32);
  s.credits = 0; tickFleets(s); assert.equal(support.supply + c.supply, total - 6);
});
test('all new politics pages and shipyard render defined touch controls', () => {
  const s = createGame();
  for (const politicsMode of ['government', 'laws', 'decisions', 'diplomacy']) {
    const html = renderSheet(s, { panel: 'politics', planetId: 'nereid', politicsMode, government: 'nationalSocialism' });
    assert.ok(!html.includes('undefined')); assert.ok(!html.includes('NaN')); assert.ok(html.includes('data-action="subtab"'));
  }
});
