// Climate is shared by the globe, region selection and the ground ecosystem.
// Flora families never change temperature, water, geology or building rules.
export const CLIMATE_MODES = Object.freeze({
  auto: { name: 'Seed bestimmt das Klima' },
  balanced: { name: 'Gemäßigte Welt', temperature: 0, rain: 1 },
  warm: { name: 'Warme Welt', temperature: 12, rain: .92 },
  cold: { name: 'Kalte Welt', temperature: -13, rain: .83 },
  dry: { name: 'Trockene Kontinente', temperature: 5, rain: .55 },
  wet: { name: 'Feuchte Welt', temperature: 6, rain: 1.4 }
});

export const CLIMATE_BIOMES = Object.freeze({
  temperate: { name: 'Gemäßigter Mischwald', meadow: '#6e854c', moss: '#3f5940', dry: '#ada176', gravel: ['#5d6357', '#a1a18c'], ground: '#a19e7b', forest: .63, trees: ['oak', 'oak', 'aspen', 'pine'], treeScale: .94, grassHeight: .76, cover: 1, understory: 1, canopySpacing: 12, water: '#3e7777', sky: '#94b7cc', fog: '#c3d2d4', description: 'Mischwälder wechseln mit offenen Wiesen; feuchte Senken, trockene Lichtungen und felsige Hänge folgen dem Gelände.' },
  boreal: { name: 'Kühler Nadelwald', meadow: '#7e8a63', moss: '#485c4c', dry: '#9da08b', gravel: ['#525e5b', '#999f96'], ground: '#8d9687', forest: .58, trees: ['pine', 'pine', 'pine', 'aspen'], treeScale: .85, grassHeight: .4, cover: .95, understory: .6, canopySpacing: 13, water: '#436e79', sky: '#8ba7bd', fog: '#bdcbd3', description: 'Dunkle Nadelbäume stehen zwischen Flechten, lichten Bergwiesen und offenen Felsrücken. Oberhalb der Baumgrenze bleibt Schnee liegen.' },
  desert: { name: 'Sand- und Steinwüste', meadow: '#ae9d68', moss: '#817c50', dry: '#c8ac7c', gravel: ['#876951', '#c3ab86'], ground: '#c9ad80', forest: .025, trees: ['cactus'], treeScale: .27, grassHeight: .25, cover: .09, understory: .065, canopySpacing: 19, water: '#699394', sky: '#b6b6ad', fog: '#d3c6ae', description: 'Windgeformte Sandrücken gehen in kiesige Flächen und freiliegende Felsen über. Vereinzelte Sukkulenten besiedeln geschützte Mulden.' },
  steppe: { name: 'Steppe und Savanne', meadow: '#a49d58', moss: '#687447', dry: '#b9a778', gravel: ['#7a7156', '#aaa086'], ground: '#b3a17b', forest: .15, trees: ['acacia', 'acacia', 'oak'], treeScale: .81, grassHeight: .9, cover: .84, understory: .75, canopySpacing: 17, water: '#577f7c', sky: '#aebcc1', fog: '#cbd0c6', description: 'Goldene Grasflächen, flache Schirmkronen und trockene Rücken prägen das offene Land. Feuchtere Ufer bilden grüne Bänder.' },
  rainforest: { name: 'Tropischer Regenwald', meadow: '#51713d', moss: '#2f503b', dry: '#877e54', gravel: ['#515547', '#8c927b'], ground: '#7d805b', forest: .92, trees: ['tropical', 'tropical', 'palm'], treeScale: 1.28, grassHeight: .9, cover: 1, understory: 1.1, canopySpacing: 12.5, water: '#376e64', sky: '#9ebbbc', fog: '#b9cecb', description: 'Mehrschichtige breite Kronen und hohe Palmen schließen sich über feuchtem Unterwuchs. Flussufer und junge Lichtungen bleiben sichtbar.' },
  wetland: { name: 'Sumpf- und Auenland', meadow: '#748052', moss: '#405f4c', dry: '#969273', gravel: ['#586354', '#9a9c7f'], ground: '#92937a', forest: .38, trees: ['willow', 'willow', 'aspen'], treeScale: .9, grassHeight: 1.1, cover: 1, understory: .9, canopySpacing: 15, water: '#4b7164', sky: '#a6bbba', fog: '#c6d1c9', description: 'Weiden, Schilfgürtel und feuchte Wiesen säumen flache Gewässer. Die Kolonie nutzt höhere, trockene Uferterrassen.' },
  tundra: { name: 'Tundra und Flechtenland', meadow: '#939479', moss: '#737f69', dry: '#aaa395', gravel: ['#686e69', '#b0b3a8'], ground: '#a4aa9c', forest: 0, trees: [], treeScale: .2, grassHeight: .19, cover: .72, understory: .24, canopySpacing: 18, water: '#739499', sky: '#a2b7ca', fog: '#d0dce0', description: 'Niedrige Graspolster und Flechten halten sich zwischen Frostschutt und Schneefeldern. Aufrechte Baumkronen fehlen.' },
  ice: { name: 'Eis- und Frostlandschaft', meadow: '#abb9b5', moss: '#889b98', dry: '#c1c9c8', gravel: ['#697e86', '#c0d0d5'], ground: '#aebfc7', forest: 0, trees: [], treeScale: 0, grassHeight: 0, cover: 0, understory: 0, canopySpacing: 20, water: '#a8c8d2', sky: '#9eb9d0', fog: '#d3e0e7', description: 'Helle Schneedecken und bläuliches Eis liegen zwischen vom Wind freigelegten Felsrücken. Die Vegetation ist vollständig zurückgedrängt.' }
});

export function climateBiome(sample) {
  const t = sample.temperatureC, m = sample.moisture;
  if (t < -9) return 'ice';
  if (t < 2) return 'tundra';
  if (m < .25) return 'desert';
  if (m < .43) return 'steppe';
  if (m > .79 && t > 8 && sample.elevationM < 420) return 'wetland';
  if (t >= 22 && m >= .65) return 'rainforest';
  return t < 10 ? 'boreal' : 'temperate';
}

export function naturalBiome(region) {
  if (region.preset === 'lunar') return null;
  const id = region.climateBiome ?? climateBiome(region.climate);
  const p = CLIMATE_BIOMES[id], t = region.climate.temperatureC, m = region.climate.moisture;
  // Local ground heights are relative to the regional datum, not sea level.
  const snowLine = id === 'ice' ? -20 : id === 'tundra' ? 35 : id === 'boreal' ? 70 + t * 4 : Math.max(85, 95 + t * 8);
  const trees = region.preset === 'arid' ? [] : p.trees;
  return { ...p, id, trees, forest: trees.length ? p.forest * (.72 + Math.min(1, m) * .45) : 0, cover: region.preset === 'arid' ? .025 : p.cover, understory: region.preset === 'arid' ? 0 : p.understory, treeLine: Math.max(12, snowLine - 38), snowLine, moisture: m, temperatureC: t, frozen: t < -3, natural: true };
}
