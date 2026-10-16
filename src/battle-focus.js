import { activeShip } from './battle-demo.js';

// Camera focus is deliberately independent of orders, recipients and target proposals.
export function focusInfo(battle, focus) {
  if (!focus || !['ship', 'group', 'fleet'].includes(focus.kind)) return null;
  const ships = battle.ships.filter(s => activeShip(s) && (focus.kind === 'ship' ? s.id === focus.id
    : focus.kind === 'group' ? s.group === focus.id : s.side === focus.id));
  if (!ships.length) return null;
  const first = ships[0], group = battle.formations?.find(g => g.id === focus.id);
  return { ...focus, side: first.side, ships, count: ships.length,
    name: focus.kind === 'ship' ? first.name : focus.kind === 'group' ? group?.name ?? 'Verband' : first.side === 'friendly' ? 'Eigene Flotte' : 'Gegnerische Flotte',
    position: [0, 1, 2].map(a => ships.reduce((n, s) => n + s.position[a], 0) / ships.length) };
}
