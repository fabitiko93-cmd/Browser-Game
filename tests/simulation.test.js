import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, getPlanet } from '../src/state.js';
import { placeBuilding, forecast, workforce } from '../src/economy.js';
import { changeGovernment, diplomaticAction } from '../src/politics.js';
import { buildShip, orderFleet, travelDays, shipBuildDays } from '../src/fleets.js';
import { stepDay } from '../src/simulation.js';
import { startResearch } from '../src/research.js';
import { parseImport, exportGame } from '../src/save.js';
const days = (s, n) => { for (let i = 0; i < n; i++) stepDay(s); };
const home = s => getPlanet(s, 'nereid');

test('local production consumes input, population consumes food, and forecast does not mutate the game', () => {
  const s = createGame(), snapshot = JSON.stringify(s), p = home(s), initialAlloy = p.stock.alloy;
  const projected = forecast(s, p);
  assert.equal(JSON.stringify(s), snapshot);
  assert.equal(projected.net.alloy, 5);
  days(s, 1);
  assert.equal(p.stock.alloy, initialAlloy + 5);
  assert.ok(p.stock.food > 180); assert.ok(s.science > 0); assert.ok(s.credits > 800);
});
test('building orders are atomic and become functional only after construction', () => {
  const s = createGame(), p = home(s);
  const before = JSON.stringify(s);
  assert.ok(placeBuilding(s, p, 'laser', 4, 7));
  assert.equal(JSON.stringify(s), before);
  assert.equal(placeBuilding(s, p, 'laser', 7, 7), null);
  assert.equal(p.stock.alloy, 172);
  const weaponBefore = p.stock.weapons;
  days(s, 3); assert.equal(p.stock.weapons, weaponBefore);
  days(s, 1); assert.ok(p.stock.weapons > weaponBefore);
});
test('raw material shortages halt production instead of creating negative resources', () => {
  const s = createGame(), p = home(s);
  p.stock.ore = 0; p.buildings.find(b => b.type === 'mine').enabled = false;
  days(s, 1);
  assert.equal(p.buildings.find(b => b.type === 'foundry').status, 'Rohstoffe fehlen');
  for (const v of Object.values(p.stock)) assert.ok(v >= 0);
});
test('research has a real delay and changes output after completion', () => {
  const s = createGame(); s.science = 100;
  assert.equal(startResearch(s, 'fusion'), null);
  assert.equal(s.science, 10);
  days(s, 5); assert.ok(!s.tech.includes('fusion'));
  days(s, 1); assert.ok(s.tech.includes('fusion'));
  const p = home(s); const boosted = forecast(s, p).net.energy;
  s.tech = []; const normal = forecast(s, p).net.energy;
  assert.ok(boosted > normal);
});
test('a colony ship costs resources and settlers, travels, and is consumed into a functional colony', () => {
  const s = createGame(), p = home(s);
  assert.equal(buildShip(s, p, 'colony'), null); assert.equal(p.population, 140);
  days(s, shipBuildDays(s, 'colony'));
  const f = s.fleets.find(f => f.type === 'colony'); assert.ok(f);
  assert.equal(orderFleet(s, [f.id], 'cinder', 'settle'), null);
  const eta = f.mission.remaining;
  days(s, eta - 1); assert.equal(getPlanet(s, 'cinder').owner, null);
  days(s, 1); const colony = getPlanet(s, 'cinder');
  assert.equal(colony.owner, 'player'); assert.equal(colony.population, 40);
  assert.equal(s.fleets.some(ship => ship.id === f.id), false);
  days(s, 10); assert.ok(colony.stock.food > 0); assert.ok(colony.population > 40);
});
test('invalid fleet groups and hostile targets leave fuel, cargo and missions unchanged', () => {
  const s = createGame(); const before = JSON.stringify(s);
  assert.ok(orderFleet(s, ['starter-f'], 'aster', 'transport', { resource: 'ore', amount: 30 }));
  assert.equal(JSON.stringify(s), before);
  assert.ok(orderFleet(s, ['starter-c', 'unknown'], 'cinder', 'move'));
  assert.equal(JSON.stringify(s), before);
  assert.ok(orderFleet(s, ['starter-f'], 'cinder', 'settle'));
  assert.equal(JSON.stringify(s), before);
});
test('cargo is reserved on departure and delivered only at arrival, without sharing planet inventories', () => {
  const s = createGame(), source = home(s), target = getPlanet(s, 'cinder');
  target.owner = 'player'; target.population = 0; target.stock.energy = 100;
  const original = source.stock.ore;
  assert.equal(orderFleet(s, ['starter-f'], target.id, 'transport', { resource: 'ore', amount: 40 }), null);
  assert.equal(source.stock.ore, original - 40); assert.equal(target.stock.ore, 0);
  const eta = s.fleets.find(f => f.id === 'starter-f').mission.remaining;
  days(s, eta - 1); assert.equal(target.stock.ore, 0);
  days(s, 1); assert.equal(target.stock.ore, 40);
});
test('a repeated cargo route reserves only available stock and completes multiple journeys', () => {
  const s = createGame(), source = home(s), target = getPlanet(s, 'cinder');
  target.owner = 'player'; target.population = 0; target.stock.energy = 500;
  source.stock.energy = 1000;
  assert.equal(orderFleet(s, ['starter-f'], 'cinder', 'transport', { resource: 'ore', amount: 40, repeat: true }), null);
  days(s, 35);
  assert.ok(target.stock.ore >= 80);
  assert.ok(s.fleets.find(f => f.id === 'starter-f').route);
});
test('cargo returns when diplomacy changes during transit', () => {
  const s = createGame();
  assert.equal(diplomaticAction(s, 'ilyri', 'trade'), null);
  assert.equal(orderFleet(s, ['starter-f'], 'thalassa', 'transport', { resource: 'crystal', amount: 20 }), null);
  assert.equal(home(s).stock.crystal, 10);
  const eta = s.fleets.find(f => f.id === 'starter-f').mission.remaining;
  diplomaticAction(s, 'ilyri', 'war'); days(s, eta);
  assert.equal(s.fleets.find(f => f.id === 'starter-f').mission.kind, 'return-cargo');
  days(s, eta); assert.equal(home(s).stock.crystal, 30);
});
test('war, fleet combat and landers combine to capture a planet', () => {
  const s = createGame();
  const ships = [];
  for (let i = 0; i < 3; i++) ships.push({ id: 'extra' + i, name: 'Test', type: 'corvette', owner: 'player', planetId: 'nereid', hp: 100, supply: 100, mission: null, route: null });
  ships.push({ id: 'landing', name: 'Landing', type: 'lander', owner: 'player', planetId: 'nereid', hp: 100, supply: 100, mission: null, route: null });
  s.fleets.push(...ships); home(s).stock.energy = 500;
  assert.ok(orderFleet(s, ships.map(f => f.id), 'veyra', 'attack'));
  assert.equal(diplomaticAction(s, 'khepri', 'war'), null);
  assert.equal(orderFleet(s, ships.map(f => f.id), 'veyra', 'attack'), null);
  days(s, 14);
  assert.equal(getPlanet(s, 'veyra').owner, 'player');
  assert.equal(s.fleets.some(f => f.id === 'landing'), false);
});
test('government transition has costs without excluding population by ideology, taxes affect happiness, and elections advance', () => {
  const s = createGame(), p = home(s), before = workforce(s, p);
  assert.equal(changeGovernment(s, 'nationalSocialism'), null);
  assert.equal(workforce(s, p), before); assert.ok(s.player.stability < 75);
  assert.equal(changeGovernment(s, 'democracy'), null);
  const lowTax = structuredClone(s); lowTax.player.tax = .12;
  s.player.tax = .22;
  days(s, 30); days(lowTax, 30); assert.ok(p.happiness < home(lowTax).happiness);
  days(s, 30); assert.equal(s.player.term, 120);
});
test('long simulations stay finite and save/import preserves all progress', () => {
  const s = createGame(); days(s, 365);
  for (const p of s.planets) {
    assert.ok(Number.isFinite(p.population)); assert.ok(Number.isFinite(p.happiness));
    for (const v of Object.values(p.stock)) assert.ok(Number.isFinite(v) && v >= 0);
  }
  assert.deepEqual(parseImport(exportGame(s)), s);
  const invalid = JSON.parse(exportGame(s)); invalid.planets[0].stock.energy = -5;
  assert.throws(() => parseImport(JSON.stringify(invalid)));
});

test('import rejects incomplete shapes, invalid enums, duplicated tiles and broken missions', () => {
  for (const mutate of [
    s => { delete s.relations; },
    s => { s.player.ideology = 'toString'; },
    s => { s.planets[0].buildings[0].type = 'constructor'; },
    s => { s.planets[0].buildings.push({ ...s.planets[0].buildings[0], id: 'duplicate' }); },
    s => { s.fleets[0].mission = { target: 'missing', source: 'nereid', total: 5, remaining: 3 }; },
    s => { s.logs = null; },
    s => { s.event = { kind: 'unknown', planet: 'nereid' }; },
    s => { s.planets[0].color = 'invalid'; }
  ]) {
    const s = createGame(); mutate(s);
    assert.throws(() => parseImport(JSON.stringify(s)));
  }
});

test('a fleet cannot spend hostile stores when leaving an enemy orbit', () => {
  const s = createGame(), f = s.fleets[0], enemy = getPlanet(s, 'aster');
  diplomaticAction(s, 'aster', 'war'); f.planetId = 'aster';
  const energy = enemy.stock.energy, supply = f.supply;
  assert.equal(orderFleet(s, [f.id], 'nereid'), null);
  assert.equal(enemy.stock.energy, energy); assert.ok(f.supply < supply);
});

test('a transport cannot double-book its cargo and propulsion energy', () => {
  const s = createGame(), p = home(s), target = getPlanet(s, 'cinder'); target.owner = 'player';
  p.stock.energy = 40;
  const before = JSON.stringify(s);
  assert.ok(orderFleet(s, ['starter-f'], 'cinder', 'transport', { resource: 'energy', amount: 40 }));
  assert.equal(JSON.stringify(s), before);
});
