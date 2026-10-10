import { NEW_IDEOLOGIES, NEW_FACTIONS, NEW_PLANETS } from './political-expansion.js';
import { NEW_RESOURCES, DEVELOPMENT_BUILDINGS, BULK_SHIPS } from './development-data.js';
import { MILITARY_BUILDINGS } from './military-data.js';
import { DEEP_SYSTEMS, DEEP_PLANETS, EXPLORATION_BUILDINGS, EXPLORATION_SHIPS } from './exploration-data.js';
export const SAVE_VERSION = 8;
export const TITLE = 'ORBIT 3077';
export const GRID = { width: 12, height: 14 };
export const RESOURCES = {
  ...NEW_RESOURCES,
  food: { name: 'Nahrung', short: 'NAH', color: '#c7d69c' },
  ore: { name: 'Erz', short: 'ERZ', color: '#bdab94' },
  alloy: { name: 'Legierungen', short: 'LEG', color: '#b5c9d9' },
  energy: { name: 'Energie', short: 'ENE', color: '#eab871' },
  crystal: { name: 'Kristalle', short: 'KRI', color: '#bb9bec' },
  optics: { name: 'Optische Bauteile', short: 'OPT', color: '#76cace' },
  weapons: { name: 'Laserwaffen', short: 'LAS', color: '#e58c8b' }
};
export const BUILDINGS = {
  ...EXPLORATION_BUILDINGS,
  ...MILITARY_BUILDINGS,
  ...DEVELOPMENT_BUILDINGS,
  habitat: { name: 'Wohnquartier', group: 'Bevölkerung', glyph: 'H', color: '#a1c7d2', cost: { credits: 60, alloy: 18 }, days: 3, workers: 0, upkeep: 1, housing: 80, description: 'Wohnraum für 80 Einwohner. Versorgte Städte ziehen neue Bewohner an.' },
  farm: { name: 'Hydroponik', group: 'Versorgung', glyph: 'F', color: '#a8c885', cost: { credits: 45, alloy: 12 }, days: 2, workers: 12, upkeep: 2, input: { energy: 2 }, output: { food: 16 }, description: 'Energie wird zu Nahrung. Jeder Einwohner benötigt täglich 0,05 Einheiten.' },
  solar: { name: 'Solarfeld', group: 'Versorgung', glyph: 'E', color: '#ecc27f', cost: { credits: 50, alloy: 15 }, days: 2, workers: 6, upkeep: 1, output: { energy: 26 }, description: 'Versorgt Fabriken und Schiffe mit Energie. Der Ertrag hängt vom Planeten ab.' },
  mine: { name: 'Erzförderer', group: 'Rohstoffe', glyph: 'M', color: '#b5a48d', cost: { credits: 65, alloy: 16 }, days: 3, workers: 18, upkeep: 2, input: { energy: 2 }, output: { ore: 14 }, description: 'Fördert Erz. Der Ertrag hängt von den örtlichen Vorkommen ab.' },
  crystal: { name: 'Kristallmine', group: 'Rohstoffe', glyph: 'K', color: '#b49ad5', cost: { credits: 80, alloy: 22 }, days: 3, workers: 16, upkeep: 3, input: { energy: 3 }, output: { crystal: 5 }, description: 'Gewinnt Kristalle für Laser und fortschrittliche Antriebe.' },
  foundry: { name: 'Schmelzwerk', group: 'Industrie', glyph: 'S', color: '#c3b3a1', cost: { credits: 90, alloy: 20 }, days: 4, workers: 16, upkeep: 3, input: { ore: 8, energy: 5 }, output: { alloy: 5 }, description: 'Verarbeitet Erz und Energie zu Legierungen für Gebäude und Schiffe.' },
  optics: { name: 'Optikfabrik', group: 'Industrie', glyph: 'O', color: '#85c6cb', cost: { credits: 80, alloy: 24 }, days: 3, workers: 12, upkeep: 3, input: { ore: 2, energy: 4 }, output: { optics: 3 }, description: 'Präzisionsbauteile für Laserwaffen und Raumschiffe.' },
  laser: { name: 'Laserfabrik', group: 'Industrie', glyph: 'L', color: '#d58e8a', cost: { credits: 110, alloy: 28 }, days: 4, workers: 18, upkeep: 4, input: { alloy: 3, optics: 2, crystal: 1, energy: 5 }, output: { weapons: 3 }, description: 'Eine vollständige Produktionskette für die Bewaffnung deiner Flotte.' },
  lab: { name: 'Forschungslabor', group: 'Wissenschaft', glyph: 'R', color: '#9bace0', cost: { credits: 85, alloy: 22 }, days: 3, workers: 12, upkeep: 4, input: { energy: 4 }, science: 4, description: 'Erzeugt Forschungspunkte. Forschungspolitik und wissenschaftliche Infrastruktur beeinflussen den Ertrag.' },
  shipyard: { name: 'Raumwerft', group: 'Militär', glyph: 'W', color: '#7fadb8', cost: { credits: 140, alloy: 45 }, days: 5, workers: 16, upkeep: 5, input: { energy: 2 }, description: 'Baut zwölf spezialisierte Klassen von Raumfahrzeugen. Baupläne werden durch Forschung erschlossen.' }
};
export const IDEOLOGIES = {
  ...NEW_IDEOLOGIES,
  democracy: { name: 'Demokratie', description: 'Gewählte Regierung, politische Opposition und gleiche Bürgerrechte für alle Spezies.', science: 1, workers: 1, tax: 1, happiness: 0, affinity: 'open', citizenship: 'Gleiche Bürgerrechte', leadership: 'Gewählte Regierung', repression: 'Gering', term: 60 },
  communism: { name: 'Kommunismus', description: 'Staatliche Produktion und zentral gelenkte Versorgung. Politischer Wettbewerb ist eingeschränkt.', science: 1, workers: 1, tax: 1, happiness: 0, affinity: 'collective', citizenship: 'Gleiche wirtschaftliche Rechte', leadership: 'Zentralrat', repression: 'Hoch' },
  monarchy: { name: 'Monarchie', description: 'Erbliche Herrschaft mit ständischer Ordnung und begrenzter politischer Beteiligung.', science: 1, workers: 1, tax: 1, happiness: 0, affinity: 'traditional', citizenship: 'Untertanenstatus', leadership: 'Erbliches Staatsoberhaupt', repression: 'Mittel' },
  military: { name: 'Militärdiktatur', description: 'Eine militärische Führung kontrolliert Regierung und Opposition. Mobilisierung hat Vorrang.', science: 1, workers: 1, tax: 1, happiness: 0, affinity: 'authoritarian', citizenship: 'Militärisch verwaltet', leadership: 'Militärrat', repression: 'Hoch' },
  technocracy: { name: 'Technokratie', description: 'Fachgremien bestimmen Forschung und Ressourcenverteilung. Direkte Mitbestimmung ist begrenzt.', science: 1, workers: 1, tax: 1, happiness: 0, affinity: 'technical', citizenship: 'Leistungsbezogener Zugang', leadership: 'Fachgremien', repression: 'Mittel' },
  nationalSocialism: { name: 'Nationalsozialismus', description: 'Führerprinzip, politische Repression, expansionistische Ziele und eine rassistische Spezieshierarchie.', science: 1, workers: 1, tax: 1, happiness: 0, affinity: 'supremacist', citizenship: 'Hierarchischer Bürgerstatus', leadership: 'Führerprinzip', repression: 'Sehr hoch' }
};
export { TECHNOLOGIES } from './technology-data.js';
export const SHIPS = {
  ...EXPLORATION_SHIPS,
  ...BULK_SHIPS,
  scout: { requiredTech: 'engineTuning', name: 'Erkunder', color: '#a9dce1', cost: { credits: 65, alloy: 20, optics: 8, energy: 10 }, days: 3, strength: 0, armor: 0, speed: 1.5, upkeep: 1, troops: 0, cargo: 0, description: 'Kartiert neue Flugrouten und prüft Bewohnung aus sicherer Entfernung. Liefert keine Regierungs-, Oberflächen- oder Militärdaten. Zieht sich bei bewohnten Welten zurück; aggressive Bewohner können das Schiff zerstören.' },
  destroyer: { requiredTech: 'lasers', name: 'Laserzerstörer', color: '#e1a38b', cost: { credits: 230, alloy: 80, optics: 20, weapons: 30, energy: 30 }, days: 7, strength: 36, armor: .2, speed: 1, upkeep: 3, troops: 0, cargo: 0, description: 'Schwerer Begleitschutz mit 20 % Schadensreduktion und 36 Grundstärke.' },
  cruiser: { requiredTech: 'coordination', name: 'Schlachtkreuzer', color: '#bd9cdc', cost: { credits: 420, alloy: 140, optics: 35, weapons: 55, energy: 50 }, days: 10, strength: 65, armor: .35, speed: .8, upkeep: 6, troops: 0, cargo: 0, description: '65 Grundstärke und 35 % Schadensreduktion. Langsam und teuer im Unterhalt.' },
  heavyFreighter: { requiredTech: 'logistics', name: 'Großfrachter', color: '#e4c893', cost: { credits: 190, alloy: 65, energy: 25 }, days: 6, strength: 0, armor: .1, speed: .8, upkeep: 2, troops: 0, cargo: 200, description: 'Transportiert 200 Waren pro Reise. Größere Lieferung bei längerer Reisezeit.' },
  support: { requiredTech: 'supplyPorts', name: 'Versorgungsschiff', color: '#9dc9a4', cost: { credits: 140, alloy: 45, optics: 8, energy: 35 }, days: 5, strength: 0, speed: 1, upkeep: 2, troops: 0, cargo: 0, description: 'Überträgt täglich bis zu 12 eigene Versorgung auf andere stationäre Schiffe im selben Orbit.' },
  corvette: { name: 'Laserkorvette', color: '#82c4ca', cost: { credits: 130, alloy: 45, optics: 12, weapons: 12, energy: 20 }, days: 5, strength: 18, troops: 0, cargo: 0, description: 'Sichert den Orbit und bekämpft gegnerische Flotten.' },
  freighter: { name: 'Frachter', color: '#d7b78e', cost: { credits: 80, alloy: 28, energy: 12 }, days: 4, strength: 0, troops: 0, cargo: 80, description: 'Transportiert bis zu 80 Waren und kann eine feste Route bedienen.' },
  colony: { requiredTech: 'habitats', name: 'Kolonieschiff', color: '#acd39f', cost: { credits: 150, alloy: 55, food: 40, energy: 20 }, days: 6, strength: 0, troops: 0, cargo: 0, settlers: 40, description: 'Gründet mit 40 Einwohnern eine Siedlung auf einem unbewohnten Planeten.' },
  lander: { requiredTech: 'fortification', name: 'Landungsschiff', color: '#d49791', cost: { credits: 120, alloy: 35, weapons: 18, food: 20, energy: 15 }, days: 5, strength: 2, troops: 40, cargo: 0, settlers: 40, description: 'Besetzt einen feindlichen Planeten, wenn seine Orbitalverteidigung besiegt ist.' }
};
export const SYSTEMS = [
  { id: 'helios', name: 'Helios', x: .18, y: .14, color: '#e6bc78', description: 'Die Wiege deiner Zivilisation.' },
  { id: 'vesper', name: 'Vesper', x: .5, y: .14, color: '#aba1e3', description: 'Kristallreiche Welten und fremde Gesellschaften.' },
  { id: 'umbra', name: 'Umbra', x: .82, y: .14, color: '#da8e72', description: 'Eine umkämpfte industrielle Grenzregion.' }
];
const frontierSystems = [
  ['aurora','Aurora',.18,.44,'#96b8fa'],['lyra','Lyra',.5,.44,'#e6a8dc'],['draco','Draco',.82,.44,'#ffac91'],
  ['orion','Orion',.18,.74,'#b7a3fc'],['caelum','Caelum',.5,.74,'#a8d3eb'],['erebus','Erebus',.82,.74,'#eece8e']
].map(([id,name,x,y,color])=>({id,name,x,y,color,description:'Grenzsystem mit neuen Kolonien und befestigten Außenposten.'}));
SYSTEMS.push(...frontierSystems, ...DEEP_SYSTEMS);
// A fourth row keeps the additional frontier readable in portrait orientation.
for (const s of SYSTEMS) if (!s.uncharted) s.y = s.y < .3 ? .13 : s.y < .6 ? .38 : .63;
export const PLANET_SEEDS = [
  { id: 'nereid', name: 'Nereid', system: 'helios', owner: 'player', kind: 'Temperiert', color: '#7892d9', seed: 31, oreFactor: 1, solarFactor: 1, population: 180, aliens: .12, orbit: 0 },
  { id: 'cinder', name: 'Cinder', system: 'helios', owner: null, kind: 'Vulkanisch', color: '#d98d63', seed: 72, oreFactor: 1.6, solarFactor: 1.15, population: 0, aliens: 0, orbit: 1 },
  { id: 'thalassa', name: 'Thalassa', system: 'helios', owner: 'ilyri', kind: 'Ozeanisch', color: '#7aa5d8', seed: 21, oreFactor: .8, solarFactor: .9, population: 150, aliens: .9, orbit: 2 },
  { id: 'veyra', name: 'Veyra', system: 'vesper', owner: 'khepri', kind: 'Kristallwelt', color: '#b798cf', seed: 18, oreFactor: 1.2, solarFactor: 1, population: 200, aliens: .95, orbit: 0 },
  { id: 'elys', name: 'Elys', system: 'vesper', owner: null, kind: 'Temperiert', color: '#90bfa1', seed: 47, oreFactor: .8, solarFactor: 1.2, population: 0, aliens: 0, orbit: 1 },
  { id: 'aster', name: 'Aster', system: 'umbra', owner: 'aster', kind: 'Industriewelt', color: '#b49a81', seed: 84, oreFactor: 1.4, solarFactor: .85, population: 240, aliens: .18, orbit: 0 },
  { id: 'nox', name: 'Nox', system: 'umbra', owner: null, kind: 'Eiswelt', color: '#95b4c1', seed: 65, oreFactor: 1.3, solarFactor: .65, population: 0, aliens: 0, orbit: 1 }
];
const frontierNames = [['Solace','Ember','Pelagos'],['Lumen','Aeris','Iris'],['Ferrum','Pyra','Dusk'],['Arcadia','Rime','Halo'],['Cobalt','Verdant','Haven'],['Obsidian','Ash','Zenith']];
frontierSystems.forEach((s,i)=>{
  for(let orbit=0;orbit<3;orbit++) PLANET_SEEDS.push({id:`${s.id}-${orbit}`,name:frontierNames[i][orbit],system:s.id,owner:null,kind:['Temperiert','Vulkanisch','Kristallwelt'][orbit],color:['#82a0d4','#d69a7b','#b19cd9'][orbit],seed:110+i*13+orbit*7,oreFactor:.8+(i%3)*.25+orbit*.2,solarFactor:.75+(i%2)*.25+orbit*.15,population:0,aliens:0,orbit,frontier:true});
});
PLANET_SEEDS.push(
  {id:'corona',name:'Corona',system:'orion',owner:'corona',kind:'Temperiert',color:'#e9cd95',seed:230,oreFactor:.85,solarFactor:1.1,population:220,aliens:.3,orbit:3,frontier:true},
  {id:'collective',name:'Synara',system:'caelum',owner:'collective',kind:'Industriewelt',color:'#e3a8bb',seed:241,oreFactor:1.15,solarFactor:.9,population:260,aliens:.7,orbit:3,frontier:true},
  {id:'vanguard',name:'Bastion',system:'erebus',owner:'vanguard',kind:'Eiswelt',color:'#9ac9c1',seed:252,oreFactor:1.2,solarFactor:.7,population:240,aliens:.4,orbit:3,frontier:true}
);
PLANET_SEEDS.push(...DEEP_PLANETS, ...NEW_PLANETS);
export const RESOURCE_KEYS = Object.keys(RESOURCES);
export const FACTIONS = {
  ...NEW_FACTIONS,
  corona:{name:'Sternenkrone Corona',species:'Menschen / Ilyri',color:'#e9cd95',ideology:'monarchy',goal:'Versorgung und stabile Handelsverbindungen',priority:'goods',research:'colonies'},
  collective:{name:'Synarisches Kollektiv',species:'Synari',color:'#e3a8bb',ideology:'communism',goal:'Industrielle Lieferketten und medizinische Versorgung',priority:'medicine',research:'industry'},
  vanguard:{name:'Vanguard-Kommando',species:'Menschen / Khepri',color:'#9ac9c1',ideology:'military',goal:'Flottenversorgung und gesicherte Grenzen',priority:'fuel',research:'defense'},
  player: { name: 'Nereid-Union', species: 'Menschen / Ilyri', color: '#9aaeff', ideology: 'democracy' },
  ilyri: { goal:'Nahrungsexport und zivile Entwicklung',priority:'electronics',research:'colonies', name: 'Ilyrische Liga', species: 'Ilyri', color: '#89b4df', ideology: 'democracy' },
  khepri: { goal:'Kristallexport und wissenschaftlicher Austausch',priority:'food',research:'science', name: 'Khepri-Konsortium', species: 'Khepri', color: '#b89be0', ideology: 'technocracy' },
  aster: { goal:'Rüstungsproduktion und industrielle Unabhängigkeit',priority:'energy',research:'industry', name: 'Direktorat Aster', species: 'Menschen', color: '#d99b83', ideology: 'nationalSocialism' }
};
