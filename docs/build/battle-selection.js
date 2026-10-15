import { activeShip, armedShip, targetFor, shipRange } from './battle-demo.js';

// UI selection is independent of camera focus and never assigns a combat order.
export function battleSelection(battle, selection) {
  const sources = selection ? battle.ships.filter(s => s.side === 'friendly' && activeShip(s)
    && (selection.scope === 'fleet' || s.id === selection.selected)) : [];
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
  const ships = battle.ships.filter(s => s.side === 'friendly' && activeShip(s) && (battle.scope === 'fleet' || s.id === battle.selected));
  const available = ships.filter(s => s.order !== 'retreat'), armed = available.filter(armedShip);
  const blocked = available.filter(s => s.supply < s.combat.retreatFuel);
  const costs = [...new Set(available.map(s => s.combat.retreatFuel))];
  return { ships, available, armed, blocked, costs, label: battle.scope === 'fleet' ? `Gesamte Flotte · ${ships.length} ${ships.length === 1 ? 'Schiff' : 'Schiffe'}` : ships[0]?.name ?? 'Kein aktives Schiff' };
}
