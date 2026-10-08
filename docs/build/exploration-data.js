export const DEEP_SYSTEMS = [
  { id: 'silex', name: 'Silex', x: .18, y: .88, color: '#8fbbdf', uncharted: true, description: 'Ein kalter Stern außerhalb der kartierten Sprungkorridore.' },
  { id: 'meridian', name: 'Meridian', x: .5, y: .88, color: '#f1c596', uncharted: true, description: 'Ein abgelegenes System mit starken thermischen Signaturen.' },
  { id: 'vestra', name: 'Vestra', x: .82, y: .88, color: '#bea5ef', uncharted: true, description: 'Ein schwaches Signal jenseits der bekannten Handelswege.' }
];
export const DEEP_PLANETS = [
  ['silex', 'Frostfall', 'Eiswelt', '#9bbfcf', 1.45, .55],
  ['silex', 'Tern', 'Temperiert', '#83a69c', .85, .85],
  ['silex', 'Prisma', 'Kristallwelt', '#bda1de', 1.1, .7],
  ['meridian', 'Caldera', 'Vulkanisch', '#dd9c70', 1.7, 1.25],
  ['meridian', 'Oasis', 'Ozeanisch', '#7fa8d1', .7, 1.15],
  ['meridian', 'Vela', 'Temperiert', '#a1b2a0', 1.05, 1.1],
  ['vestra', 'Silva', 'Temperiert', '#86b3a7', .95, .95],
  ['vestra', 'Kryos', 'Eiswelt', '#a5bccf', 1.3, .65],
  ['vestra', 'Facet', 'Kristallwelt', '#b097d6', 1.2, .8]
].map(([system, name, kind, color, oreFactor, solarFactor], i) => ({
  id: `${system}-${i % 3}`, name, system, owner: null, kind, color,
  oreFactor, solarFactor, seed: 310 + i * 17, population: 0, aliens: 0, orbit: i % 3
}));
export const EXPLORATION_BUILDINGS = {
  commCenter: { name: 'Kommunikationszentrale', group: 'Wissenschaft', glyph: 'C', color: '#94aaca',
    cost: { credits: 90, alloy: 24, optics: 8 }, days: 4, workers: 6, upkeep: 2,
    input: { energy: 2 }, requiredTech: 'communications', unique: 1, service: 'communication',
    description: 'Öffnet den reichsweiten Posteingang. Die Dachzahl zeigt gültige, unbeantwortete Anfragen und Angebote. Maximal eine Zentrale je Planet.' }
};
export const EXPLORATION_SHIPS = {
  probe: { name: 'Analysesonde', color: '#a7bce9', requiredTech: 'planetaryAnalysis',
    cost: { credits: 55, alloy: 12, optics: 10, energy: 8 }, days: 2, strength: 0,
    armor: 0, speed: 1.2, upkeep: 1, troops: 0, cargo: 0,
    description: 'Untersucht Geologie und Oberfläche manuell. Scan: 60 Credits, 8 Energie, 2 Optik und 6 Tage zusätzlich zur Reise. Keine Bevölkerungs-, Regierungs- oder Militärdaten.' }
};
export const SCAN_COST = { credits: 60, energy: 8, optics: 2 };
export const SCAN_DAYS = 6;
