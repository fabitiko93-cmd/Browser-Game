import { activeShip, DEMO_CLASSES, WEAPONS, KM_PER_UNIT, shipWeapon, shipRange, shipClass, armedShip } from './battle-demo.js';

export const CONTACT_PAGE_SIZE = 12;
export const CONTACT_GROUPS = { all: 'Alle', cruiser: 'Kreuzer', destroyer: 'Zerstörer', corvette: 'Korvetten', interceptor: 'Jäger' };
const nameOrder = new Intl.Collator('de', { numeric: true });

export function contactInfo(ship, observer) {
  const def = DEMO_CLASSES[ship.type], own = DEMO_CLASSES[observer?.type];
  const distance = observer ? Math.hypot(...ship.position.map((value, i) => value - observer.position[i])) * KM_PER_UNIT : 0;
  return { id: ship.id, name: ship.name, type: shipClass(ship), modelType: ship.type, className: ship.className ?? def.name, active: activeShip(ship), distance,
    hull: Math.round(ship.hull / def.hull * 100), shield: Math.round(ship.shield / def.shield * 100), hasShield: !ship.combat,
    inRange: Boolean(own && armedShip(observer) && distance <= shipRange(observer) * KM_PER_UNIT) };
}

// Only one bounded page reaches the DOM, regardless of the size of the fleet.
export function enemyContacts(battle, { type = 'all', search = '', sort = 'class', page = 0 } = {}) {
  const observer = battle.ships.find(ship => ship.id === battle.selected), counts = Object.fromEntries(Object.keys(battle.contactGroups ?? CONTACT_GROUPS).map(type => [type, 0]));
  const term = search.trim().toLocaleLowerCase('de'), contacts = [];
  for (const ship of battle.ships) {
    if (ship.side !== 'enemy' || !activeShip(ship)) continue;
    counts.all++; counts[shipClass(ship)]++;
    if (type !== 'all' && shipClass(ship) !== type) continue;
    if (term && !`${ship.name} ${ship.className ?? DEMO_CLASSES[ship.type].name}`.toLocaleLowerCase('de').includes(term)) continue;
    contacts.push(contactInfo(ship, observer));
  }
  contacts.sort((a, b) => (sort === 'hull' ? a.hull - b.hull : sort === 'class' ? (battle.classStrengths?.[b.type] ?? DEMO_CLASSES[b.modelType].hull) - (battle.classStrengths?.[a.type] ?? DEMO_CLASSES[a.modelType].hull) : 0)
    || a.distance - b.distance || nameOrder.compare(a.name, b.name) || nameOrder.compare(a.id, b.id));
  const pages = Math.max(1, Math.ceil(contacts.length / CONTACT_PAGE_SIZE));
  const current = Math.max(0, Math.min(pages - 1, Number.isFinite(page) ? Math.floor(page) : 0));
  return { contacts: contacts.slice(current * CONTACT_PAGE_SIZE, (current + 1) * CONTACT_PAGE_SIZE), total: contacts.length, counts, page: current, pages };
}
