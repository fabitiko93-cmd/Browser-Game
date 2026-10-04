export const SAVE_VERSION = 1;
export const TITLE = 'ORBIT 3077';
export const GRID = { width: 12, height: 14 };
export const RESOURCES = {
  food: { name: 'Nahrung', short: 'NAH', color: '#c7d69c' },
  ore: { name: 'Erz', short: 'ERZ', color: '#bdab94' },
  alloy: { name: 'Legierungen', short: 'LEG', color: '#b5c9d9' },
  energy: { name: 'Energie', short: 'ENE', color: '#eab871' },
  crystal: { name: 'Kristalle', short: 'KRI', color: '#bb9bec' },
  optics: { name: 'Optische Bauteile', short: 'OPT', color: '#76cace' },
  weapons: { name: 'Laserwaffen', short: 'LAS', color: '#e58c8b' }
};
export const BUILDINGS = {
  habitat: { name: 'Wohnquartier', group: 'Bevölkerung', glyph: 'H', color: '#a1c7d2', cost: { credits: 60, alloy: 18 }, days: 3, workers: 0, upkeep: 1, housing: 80, description: 'Wohnraum für 80 Einwohner. Versorgte Städte ziehen neue Bewohner an.' },
  farm: { name: 'Hydroponik', group: 'Versorgung', glyph: 'F', color: '#a8c885', cost: { credits: 45, alloy: 12 }, days: 2, workers: 12, upkeep: 2, input: { energy: 2 }, output: { food: 16 }, description: 'Energie wird zu Nahrung. Jeder Einwohner benötigt täglich 0,05 Einheiten.' },
  solar: { name: 'Solarfeld', group: 'Versorgung', glyph: 'E', color: '#ecc27f', cost: { credits: 50, alloy: 15 }, days: 2, workers: 6, upkeep: 1, output: { energy: 26 }, description: 'Versorgt Fabriken und Schiffe mit Energie. Der Ertrag hängt vom Planeten ab.' },
  mine: { name: 'Erzförderer', group: 'Rohstoffe', glyph: 'M', color: '#b5a48d', cost: { credits: 65, alloy: 16 }, days: 3, workers: 18, upkeep: 2, input: { energy: 2 }, output: { ore: 14 }, description: 'Fördert Erz. Der Ertrag hängt von den örtlichen Vorkommen ab.' },
  crystal: { name: 'Kristallmine', group: 'Rohstoffe', glyph: 'K', color: '#b49ad5', cost: { credits: 80, alloy: 22 }, days: 3, workers: 16, upkeep: 3, input: { energy: 3 }, output: { crystal: 5 }, description: 'Gewinnt Kristalle für Laser und fortschrittliche Antriebe.' },
  foundry: { name: 'Schmelzwerk', group: 'Industrie', glyph: 'S', color: '#c3b3a1', cost: { credits: 90, alloy: 20 }, days: 4, workers: 16, upkeep: 3, input: { ore: 8, energy: 5 }, output: { alloy: 5 }, description: 'Verarbeitet Erz und Energie zu Legierungen für Gebäude und Schiffe.' },
  optics: { name: 'Optikfabrik', group: 'Industrie', glyph: 'O', color: '#85c6cb', cost: { credits: 80, alloy: 24 }, days: 3, workers: 12, upkeep: 3, input: { ore: 2, energy: 4 }, output: { optics: 3 }, description: 'Präzisionsbauteile für Laserwaffen und Raumschiffe.' },
  laser: { name: 'Laserfabrik', group: 'Industrie', glyph: 'L', color: '#d58e8a', cost: { credits: 110, alloy: 28 }, days: 4, workers: 18, upkeep: 4, input: { alloy: 3, optics: 2, crystal: 1, energy: 5 }, output: { weapons: 3 }, description: 'Eine vollständige Produktionskette für die Bewaffnung deiner Flotte.' },
  lab: { name: 'Forschungslabor', group: 'Wissenschaft', glyph: 'R', color: '#9bace0', cost: { credits: 85, alloy: 22 }, days: 3, workers: 12, upkeep: 4, input: { energy: 4 }, science: 4, description: 'Erzeugt Forschungspunkte. Politische Offenheit beeinflusst den Ertrag.' },
  shipyard: { name: 'Raumwerft', group: 'Militär', glyph: 'W', color: '#7fadb8', cost: { credits: 140, alloy: 45 }, days: 5, workers: 16, upkeep: 5, input: { energy: 2 }, description: 'Baut Korvetten, Frachter, Kolonieschiffe und Landungsschiffe.' }
};
export const IDEOLOGIES = {
  democracy: { name: 'Demokratie', description: 'Gewählte Regierung, politische Opposition und gleiche Bürgerrechte für alle Spezies.', science: 1, workers: 1, tax: 1, happiness: 8, affinity: 'open', citizenship: 'Gleiche Bürgerrechte', leadership: 'Gewählte Regierung', repression: 'Gering', term: 60 },
  communism: { name: 'Kommunismus', description: 'Staatliche Produktion und zentral gelenkte Versorgung. Politischer Wettbewerb ist eingeschränkt.', science: .95, workers: 1.08, tax: .9, happiness: 2, affinity: 'collective', citizenship: 'Gleiche wirtschaftliche Rechte', leadership: 'Zentralrat', repression: 'Hoch' },
  monarchy: { name: 'Monarchie', description: 'Erbliche Herrschaft mit ständischer Ordnung und begrenzter politischer Beteiligung.', science: .9, workers: 1, tax: 1.08, happiness: 0, affinity: 'traditional', citizenship: 'Untertanenstatus', leadership: 'Erbliches Staatsoberhaupt', repression: 'Mittel' },
  military: { name: 'Militärdiktatur', description: 'Eine militärische Führung kontrolliert Regierung und Opposition. Mobilisierung hat Vorrang.', science: .85, workers: .96, tax: 1.08, happiness: -5, affinity: 'authoritarian', citizenship: 'Militärisch verwaltet', leadership: 'Militärrat', repression: 'Hoch' },
  technocracy: { name: 'Technokratie', description: 'Fachgremien bestimmen Forschung und Ressourcenverteilung. Direkte Mitbestimmung ist begrenzt.', science: 1.25, workers: 1, tax: 1, happiness: -2, affinity: 'technical', citizenship: 'Leistungsbezogener Zugang', leadership: 'Fachgremien', repression: 'Mittel' },
  nationalSocialism: { name: 'Nationalsozialismus', description: 'Führerprinzip, politische Repression, expansionistische Ziele und eine rassistische Spezieshierarchie.', science: .75, workers: .86, tax: 1.08, happiness: -12, affinity: 'supremacist', citizenship: 'Andere Spezies ausgeschlossen', leadership: 'Führerprinzip', repression: 'Sehr hoch' }
};
export const TECHNOLOGIES = {
  fusion: { name: 'Fusionsregelung', cost: 90, description: 'Energieertrag aller Solarfelder +30 %.' },
  lasers: { name: 'Kohärente Laser', cost: 120, description: 'Kampfstärke deiner Korvetten +30 %.' },
  propulsion: { name: 'Sprungantrieb II', cost: 140, description: 'Reisezeiten zwischen Planeten −30 %.' },
  habitats: { name: 'Adaptive Habitate', cost: 100, description: 'Wohnkapazität +25 %, Bevölkerungswachstum +40 %.' }
};
export const SHIPS = {
  corvette: { name: 'Laserkorvette', color: '#82c4ca', cost: { credits: 130, alloy: 45, optics: 12, weapons: 12, energy: 20 }, days: 5, strength: 18, troops: 0, cargo: 0, description: 'Sichert den Orbit und bekämpft gegnerische Flotten.' },
  freighter: { name: 'Frachter', color: '#d7b78e', cost: { credits: 80, alloy: 28, energy: 12 }, days: 4, strength: 0, troops: 0, cargo: 80, description: 'Transportiert bis zu 80 Waren und kann eine feste Route bedienen.' },
  colony: { name: 'Kolonieschiff', color: '#acd39f', cost: { credits: 150, alloy: 55, food: 40, energy: 20 }, days: 6, strength: 0, troops: 0, cargo: 0, settlers: 40, description: 'Gründet mit 40 Einwohnern eine Siedlung auf einem unbewohnten Planeten.' },
  lander: { name: 'Landungsschiff', color: '#d49791', cost: { credits: 120, alloy: 35, weapons: 18, food: 20, energy: 15 }, days: 5, strength: 2, troops: 40, cargo: 0, settlers: 40, description: 'Besetzt einen feindlichen Planeten, wenn seine Orbitalverteidigung besiegt ist.' }
};
export const SYSTEMS = [
  { id: 'helios', name: 'Helios', x: .28, y: .43, color: '#e6bc78', description: 'Die Wiege deiner Zivilisation.' },
  { id: 'vesper', name: 'Vesper', x: .74, y: .28, color: '#aba1e3', description: 'Kristallreiche Welten und fremde Gesellschaften.' },
  { id: 'umbra', name: 'Umbra', x: .68, y: .76, color: '#da8e72', description: 'Eine umkämpfte industrielle Grenzregion.' }
];
export const PLANET_SEEDS = [
  { id: 'nereid', name: 'Nereid', system: 'helios', owner: 'player', kind: 'Temperiert', color: '#68b7ac', seed: 31, oreFactor: 1, solarFactor: 1, population: 180, aliens: .12, orbit: 0 },
  { id: 'cinder', name: 'Cinder', system: 'helios', owner: null, kind: 'Vulkanisch', color: '#d98d63', seed: 72, oreFactor: 1.6, solarFactor: 1.15, population: 0, aliens: 0, orbit: 1 },
  { id: 'thalassa', name: 'Thalassa', system: 'helios', owner: 'ilyri', kind: 'Ozeanisch', color: '#7aa5d8', seed: 21, oreFactor: .8, solarFactor: .9, population: 150, aliens: .9, orbit: 2 },
  { id: 'veyra', name: 'Veyra', system: 'vesper', owner: 'khepri', kind: 'Kristallwelt', color: '#b798cf', seed: 18, oreFactor: 1.2, solarFactor: 1, population: 200, aliens: .95, orbit: 0 },
  { id: 'elys', name: 'Elys', system: 'vesper', owner: null, kind: 'Temperiert', color: '#90bfa1', seed: 47, oreFactor: .8, solarFactor: 1.2, population: 0, aliens: 0, orbit: 1 },
  { id: 'aster', name: 'Aster', system: 'umbra', owner: 'aster', kind: 'Industriewelt', color: '#b49a81', seed: 84, oreFactor: 1.4, solarFactor: .85, population: 240, aliens: .18, orbit: 0 },
  { id: 'nox', name: 'Nox', system: 'umbra', owner: null, kind: 'Eiswelt', color: '#95b4c1', seed: 65, oreFactor: 1.3, solarFactor: .65, population: 0, aliens: 0, orbit: 1 }
];
export const RESOURCE_KEYS = Object.keys(RESOURCES);
export const FACTIONS = {
  player: { name: 'Nereid-Union', species: 'Menschen / Ilyri', color: '#77c9c5', ideology: 'democracy' },
  ilyri: { name: 'Ilyrische Liga', species: 'Ilyri', color: '#89b4df', ideology: 'democracy' },
  khepri: { name: 'Khepri-Konsortium', species: 'Khepri', color: '#b89be0', ideology: 'technocracy' },
  aster: { name: 'Direktorat Aster', species: 'Menschen', color: '#d99b83', ideology: 'nationalSocialism' }
};
