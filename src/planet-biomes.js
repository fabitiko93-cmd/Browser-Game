const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
// Biology is independent of physical geography. Matching seeds retain the same
// land, climate, rivers and construction terraces when comparing biospheres.
export const BIOSPHERES = Object.freeze({
  terran: { name: 'Erdflora' },
  spore: { name: 'Sporenwald', alien: true, meadow: '#577f7c', moss: '#394e60', dry: '#8e919b', gravel: ['#424957', '#7e828b'], forest: .9, trees: ['xeno-spore'], treeScale: .92, canopySpacing: 12.2, canopyDensity: .78, grassHeight: 1.3, groundEmission: '#123234', skyTint: '#d2ebe8', water: '#367e85', ocean: [[18, 59, 79], [49, 126, 142]], globe: { dry: [119, 113, 140], wet: [73, 94, 115], cold: [110, 121, 137], rock: [77, 81, 100], sand: [162, 161, 172] } },
  coral: { name: 'Korallenflora', alien: true, meadow: '#838a83', moss: '#535c6b', dry: '#aca08a', gravel: ['#514751', '#938274'], forest: .57, trees: ['xeno-coral'], treeScale: .96, canopySpacing: 13, canopyDensity: .67, grassHeight: 1.1, groundEmission: '#211c25', skyTint: '#ffe5c5', water: '#427c89', ocean: [[27, 66, 91], [81, 143, 158]], globe: { dry: [150, 130, 108], wet: [144, 98, 106], cold: [118, 121, 131], rock: [96, 86, 100], sand: [190, 160, 128] } }
});
export const regionBiosphere = region => BIOSPHERES[region.preset === 'temperate' ? region.biosphere : 'terran'] ?? BIOSPHERES.terran;
const alienNames = {
  spore: { coast: 'Sporenküste', basin: 'Myzel-Flusstal', upland: 'Sporenhochland', caldera: 'Basalt-Sporengarten' },
  coral: { coast: 'Korallenbucht', basin: 'Fächerkorallen-Aue', upland: 'Korallenhochland', caldera: 'Kelchflora-Krater' }
};
const alienDescriptions = {
  spore: 'Gerippte Pilzkronen wachsen in feuchten Hainen über blaugrünen Myzelpolstern. Kleine Leuchtknospen besiedeln die Lichtungen; trockene Kolonieterrassen bleiben frei.',
  coral: 'Bernsteinfarbene Fächerkolonien stehen in lockeren Gruppen über silbrigem Polsterbewuchs. Violette Kelchpflanzen folgen feuchten Senken, während felsige Hänge offen bleiben.'
};
// Landscape identity includes soil, canopy structure and climate, not just tint.
export const TEMPERATE_BIOMES = Object.freeze({
  coast: { name: 'Warme Küstenbucht', meadow: '#74884f', moss: '#506b39', dry: '#a4a06a', forest: .24, trees: ['oak', 'oak', 'pine'], treeScale: .67, grassHeight: .55, sky: '#8ebbd7', fog: '#cbd9d8', description: 'Warme Küstenwiesen, niedrige Eichenhaine und felsige Landzungen an einer geschwungenen Bucht.' },
  basin: { name: 'Laubwald-Flusstal', meadow: '#748b4e', moss: '#485a3b', dry: '#a0a16b', forest: .78, trees: ['oak', 'oak', 'aspen', 'aspen', 'oak'], treeScale: 1, grassHeight: .86, sky: '#a1c1d3', fog: '#cadbd7', description: 'Ein durchgehender Fluss mit feuchter Aue und dichtem Laubwald; die Kolonie liegt auf der trockenen Flussterrasse.' },
  upland: { name: 'Kühles Bergplateau', meadow: '#8a9a6c', moss: '#536b55', dry: '#a4a57b', forest: .63, trees: ['pine', 'pine', 'pine', 'aspen'], treeScale: .87, grassHeight: .35, sky: '#88aac8', fog: '#cbd7de', description: 'Nadelwald an den unteren Hängen, offene Bergwiesen oberhalb der Baumgrenze und schneebedeckte Höhen.' },
  caldera: { name: 'Vulkanisches Moosland', meadow: '#899759', moss: '#526e48', dry: '#9ba178', forest: .19, trees: ['aspen', 'aspen', 'pine'], treeScale: .48, grassHeight: .29, sky: '#9aaeb8', fog: '#c9d2d2', description: 'Ein kalter Kratersee zwischen dunklen Basaltrücken, hellen Moospolstern und einzelnen niedrigen Baumgruppen.' }
});
export function regionBiome(region) {
  if (region.preset !== 'temperate') return null;
  const base = TEMPERATE_BIOMES[region.module];
  if (!base) return null;
  const c = region.climate, biology = regionBiosphere(region);
  const climate = c ? { forest: clamp(base.forest + (c.moisture - .65) * .35, .12, .88), moisture: c.moisture, treeLine: 52 + clamp(c.temperatureC - 5, -2, 7) * 6, snowLine: 91 + clamp(c.temperatureC - 5, -3, 9) * 5 } : {};
  if (!biology.alien) return c ? { ...base, ...climate } : base;
  return { ...base, ...climate, ...biology, name: alienNames[region.biosphere][region.module], description: alienDescriptions[region.biosphere], forest: (climate.forest ?? base.forest) * biology.forest, treeScale: base.treeScale * biology.treeScale };
}
