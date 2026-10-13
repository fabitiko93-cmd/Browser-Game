import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoBattle, advanceDemoBattle, commandDemo, selectDemoShip, DEMO_CLASSES } from '../src/battle-demo.js';
import { enemyContacts, CONTACT_PAGE_SIZE, contactInfo } from '../src/battle-targets.js';

function largeFleet(count = 1000) {
  const battle = createDemoBattle(), prototype = battle.ships.find(ship => ship.side === 'enemy');
  battle.ships = battle.ships.filter(ship => ship.side === 'friendly');
  for (let i = 0; i < count; i++) {
    const type = ['cruiser', 'destroyer', 'corvette', 'interceptor'][i % 4], def = DEMO_CLASSES[type];
    battle.ships.push({ ...structuredClone(prototype), id: `enemy-${i}`, name: `Kontakt ${i}`, type, position: [i % 20, 0, -900 - i], hull: def.hull, shield: def.shield });
  }
  return battle;
}

test('contact pages cover large fleets exactly once with correct class counts', () => {
  const battle = largeFleet(), first = enemyContacts(battle), ids = [];
  assert.equal(first.counts.all, 1000); assert.equal(first.counts.destroyer, 250);
  assert.equal(first.contacts.length, CONTACT_PAGE_SIZE); assert.equal(first.pages, 84);
  for (let page = 0; page < first.pages; page++) {
    const result = enemyContacts(battle, { page }); assert.ok(result.contacts.length <= CONTACT_PAGE_SIZE);
    ids.push(...result.contacts.map(ship => ship.id));
  }
  assert.equal(ids.length, 1000); assert.equal(new Set(ids).size, 1000);
  assert.equal(enemyContacts(battle, { page: 999 }).page, 83);
  assert.equal(enemyContacts(battle, { page: -1 }).page, 0);
});

test('search, class filters and hull sorting respect actual active enemies', () => {
  const battle = largeFleet(60);
  battle.ships.find(ship => ship.id === 'enemy-1').hull = 20;
  battle.ships.find(ship => ship.id === 'enemy-5').escaped = true;
  const result = enemyContacts(battle, { type: 'destroyer', sort: 'hull' });
  assert.equal(result.total, 14); assert.equal(result.contacts[0].id, 'enemy-1');
  assert.ok(result.contacts.every(ship => ship.type === 'destroyer'));
  assert.deepEqual(enemyContacts(battle, { search: 'Kontakt 37' }).contacts.map(ship => ship.id), ['enemy-37']);
  assert.equal(enemyContacts(battle, { search: 'not present' }).total, 0);
  assert.equal(enemyContacts(battle, { search: 'not present' }).pages, 1);
  const info = contactInfo(battle.ships.at(-1), battle.ships[0]);
  assert.ok(info.distance > 0); assert.equal(info.inRange, true);
  const far = { ...battle.ships.at(-1), position: [0, 0, -9000] };
  assert.equal(contactInfo(far, battle.ships[0]).inRange, false);
});

test('a class priority guides real fire and carries to the next ship of that class', () => {
  const battle = createDemoBattle(), first = battle.ships.find(ship => ship.id === 'wraith');
  const second = { ...structuredClone(first), id: 'wraith-2', name: 'Wraith II', position: [30, -20, -950] }; battle.ships.push(second);
  commandDemo(battle, 'scope', 'fleet');
  assert.equal(commandDemo(battle, 'priority', 'interceptor'), true);
  const opening = advanceDemoBattle(battle, .8);
  assert.ok(opening.filter(event => event.kind === 'fire' && battle.ships.find(ship => ship.id === event.ship).side === 'friendly').every(event => [first.id, second.id].includes(event.target)));
  first.hull = 0;
  const next = advanceDemoBattle(battle, .6);
  assert.ok(next.some(event => event.kind === 'fire' && event.target === second.id));
  second.hull = 0;
  const fallback = advanceDemoBattle(battle, .1);
  assert.ok(battle.ships.filter(ship => ship.side === 'friendly').every(ship => ship.priority === null && ship.targeting === 'auto'));
  assert.ok(fallback.some(event => event.kind === 'order-complete'));
});

test('class orders respect range and inspecting another contact preserves the order', () => {
  const battle = createDemoBattle();
  assert.equal(commandDemo(battle, 'priority', 'unknown'), false);
  assert.equal(commandDemo(battle, 'priority', 'cruiser'), true);
  const own = battle.ships.find(ship => ship.id === battle.selected);
  selectDemoShip(battle, 'revenant'); assert.equal(own.priority, 'cruiser'); assert.equal(battle.target, 'revenant');
  commandDemo(battle, 'priority', 'cruiser'); battle.ships.find(ship => ship.id === 'nemesis').position[2] = -12000;
  const events = advanceDemoBattle(battle, 1);
  assert.equal(events.some(event => event.kind === 'fire' && event.target === 'nemesis'), false);
  assert.ok(events.some(event => event.kind === 'fire' && battle.ships.find(ship => ship.id === event.ship).side === 'friendly'));
  commandDemo(battle, 'retreat'); assert.equal(own.priority, null); assert.equal(own.targeting, 'auto');
});

test('selection is inspection, attack only affects the chosen scope, auto releases that scope', () => {
  const battle = createDemoBattle(), aurora = battle.ships.find(s => s.id === 'aurora'), pioneer = battle.ships.find(s => s.id === 'pioneer');
  selectDemoShip(battle, 'wraith');
  assert.ok(battle.ships.every(s => s.targeting === 'auto'));
  commandDemo(battle, 'attack');
  assert.equal(aurora.commandTarget, 'wraith'); assert.equal(pioneer.targeting, 'auto');
  selectDemoShip(battle, 'revenant'); advanceDemoBattle(battle, .4);
  assert.equal(aurora.commandTarget, 'wraith'); assert.equal(aurora.target, 'wraith');
  selectDemoShip(battle, 'pioneer'); commandDemo(battle, 'attack');
  assert.equal(pioneer.commandTarget, 'revenant'); assert.equal(aurora.commandTarget, 'wraith');
  commandDemo(battle, 'auto'); assert.equal(pioneer.targeting, 'auto'); assert.equal(aurora.targeting, 'target');
  commandDemo(battle, 'scope', 'fleet'); commandDemo(battle, 'attack', 'nemesis');
  assert.ok(battle.ships.filter(s => s.side === 'friendly').every(s => s.commandTarget === 'nemesis'));
  commandDemo(battle, 'auto'); assert.ok(battle.ships.every(s => s.targeting === 'auto'));
});

test('manual attacks wait out of range and release after destruction, without changing selected contact', () => {
  const battle = createDemoBattle(), own = battle.ships.find(s => s.id === 'aurora'), enemy = battle.ships.find(s => s.id === 'nemesis');
  commandDemo(battle, 'attack'); enemy.position[2] = -12000;
  const waiting = advanceDemoBattle(battle, 1);
  assert.equal(waiting.some(e => e.kind === 'fire' && e.ship === own.id), false);
  assert.equal(own.commandTarget, enemy.id);
  enemy.hull = 0;
  const resumed = advanceDemoBattle(battle, 3);
  assert.equal(own.targeting, 'auto'); assert.equal(own.commandTarget, null); assert.equal(battle.target, enemy.id);
  assert.ok(resumed.some(e => e.kind === 'order-complete' && e.ship === own.id));
  assert.ok(resumed.some(e => e.kind === 'fire' && e.ship === own.id && e.target !== enemy.id));
});

test('retreat applies only to its scope and attack cannot cancel a retreat', () => {
  const battle = createDemoBattle(), own = battle.ships.find(s => s.id === battle.selected);
  assert.equal(commandDemo(battle, 'retreat'), true);
  assert.equal(own.order, 'retreat'); assert.ok(battle.ships.filter(s => s.side === 'friendly' && s !== own).every(s => s.order === 'engage'));
  assert.equal(commandDemo(battle, 'attack'), false); assert.equal(commandDemo(battle, 'auto'), false);
  commandDemo(battle, 'scope', 'fleet'); commandDemo(battle, 'retreat');
  assert.ok(battle.ships.filter(s => s.side === 'friendly').every(s => s.order === 'retreat'));
  assert.equal(commandDemo(battle, 'scope', 'unknown'), false);
});
