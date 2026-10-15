import { activeShip, armedShip, targetFor, shipRange, commandedShips, selectionShips } from './battle-demo.js';

// UI selection is independent of camera focus and never assigns a combat order.
export function battleSelection(battle, selection) {
  const sources = selectionShips(battle, selection);
  const links = [], targets = new Set();
  for (const source of sources) {
    if (source.order === 'retreat' || !armedShip(source)) continue;
    const target = source.targeting === 'target' ? battle.ships.find(s => s.id === source.commandTarget && s.side !== source.side && activeShip(s)) : targetFor(battle, source);
    if (!target) continue;
    const distance = Math.hypot(...target.position.map((v, i) => v - source.position[i]));
    links.push({ source: source.id, target: target.id, waiting: distance > shipRange(source), mode: source.targeting });
    targets.add(target.id);
  }
  return { sources: sources.map(s => s.id), targets: [...targets], links };
}

export function recipientInfo(battle) {
  const ships = commandedShips(battle);
  const available = ships.filter(s => s.order !== 'retreat'), armed = available.filter(armedShip);
  const blocked = available.filter(s => s.supply < s.combat.retreatFuel);
  const costs = [...new Set(available.map(s => s.combat.retreatFuel))];
  const group = battle.formations?.find(g => g.id === battle.selectedGroup && g.side === 'friendly');
  return { ships, available, armed, blocked, costs, label: battle.scope === 'fleet' ? `Gesamte Flotte · ${ships.length} ${ships.length === 1 ? 'Schiff' : 'Schiffe'}` : battle.scope === 'group' ? `${group?.name ?? 'Verband'} · ${ships.length} ${ships.length === 1 ? 'Schiff' : 'Schiffe'}` : ships[0]?.name ?? 'Kein aktives Schiff' };
}
