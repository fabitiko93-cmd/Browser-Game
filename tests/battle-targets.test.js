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
  assert.equal(commandDemo(battle, 'priority', 'interceptor'), true);
  const opening = advanceDemoBattle(battle, .8);
  assert.ok(opening.filter(event => event.kind === 'fire' && battle.ships.find(ship => ship.id === event.ship).side === 'friendly').every(event => [first.id, second.id].includes(event.target)));
  first.hull = 0;
  const next = advanceDemoBattle(battle, .6);
  assert.equal(battle.target, second.id);
  assert.ok(next.some(event => event.kind === 'fire' && event.target === second.id));
  second.hull = 0;
  const fallback = advanceDemoBattle(battle, .1);
  assert.equal(battle.priority, null); assert.equal(battle.focus, false);
  assert.ok(fallback.some(event => event.kind === 'priority-end'));
});

test('priority orders reject unavailable classes, respect range, and can be replaced by an individual target', () => {
  const battle = createDemoBattle();
  assert.equal(commandDemo(battle, 'priority', 'unknown'), false);
  assert.equal(commandDemo(battle, 'priority', 'cruiser'), true);
  selectDemoShip(battle, 'revenant'); assert.equal(battle.priority, null); assert.equal(battle.target, 'revenant');
  commandDemo(battle, 'priority', 'cruiser'); battle.ships.find(ship => ship.id === 'nemesis').position[2] = -12000;
  const events = advanceDemoBattle(battle, 1);
  assert.equal(events.some(event => event.kind === 'fire' && event.target === 'nemesis'), false);
  assert.ok(events.some(event => event.kind === 'fire' && battle.ships.find(ship => ship.id === event.ship).side === 'friendly'));
  commandDemo(battle, 'retreat'); assert.equal(battle.priority, null); assert.equal(battle.focus, false);
});
