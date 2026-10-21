const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
// Landscape identity includes soil, canopy structure and climate, not just tint.
export const TEMPERATE_BIOMES = Object.freeze({
  coast: { name: 'Warme Küstenbucht', meadow: '#74884f', moss: '#506b39', dry: '#a4a06a', forest: .24, trees: ['oak', 'oak', 'pine'], treeScale: .67, grassHeight: .55, sky: '#8ebbd7', fog: '#cbd9d8', description: 'Warme Küstenwiesen, niedrige Eichenhaine und felsige Landzungen an einer geschwungenen Bucht.' },
  basin: { name: 'Laubwald-Flusstal', meadow: '#579347', moss: '#335d38', dry: '#8d9b59', forest: .78, trees: ['oak', 'oak', 'aspen', 'aspen', 'oak'], treeScale: 1, grassHeight: .86, sky: '#a1c1d3', fog: '#cadbd7', description: 'Ein durchgehender Fluss mit feuchter Aue und dichtem Laubwald; die Kolonie liegt auf der trockenen Flussterrasse.' },
  upland: { name: 'Kühles Bergplateau', meadow: '#8a9a6c', moss: '#536b55', dry: '#a4a57b', forest: .63, trees: ['pine', 'pine', 'pine', 'aspen'], treeScale: .87, grassHeight: .35, sky: '#88aac8', fog: '#cbd7de', description: 'Nadelwald an den unteren Hängen, offene Bergwiesen oberhalb der Baumgrenze und schneebedeckte Höhen.' },
  caldera: { name: 'Vulkanisches Moosland', meadow: '#899759', moss: '#526e48', dry: '#9ba178', forest: .19, trees: ['aspen', 'aspen', 'pine'], treeScale: .48, grassHeight: .29, sky: '#9aaeb8', fog: '#c9d2d2', description: 'Ein kalter Kratersee zwischen dunklen Basaltrücken, hellen Moospolstern und einzelnen niedrigen Baumgruppen.' }
});
export function regionBiome(region) {
  if (region.preset !== 'temperate') return null;
  const base = TEMPERATE_BIOMES[region.module];
  if (!base) return null;
  const c = region.climate;
  if (!c) return base;
  return { ...base, forest: clamp(base.forest + (c.moisture - .65) * .35, .12, .88), moisture: c.moisture, treeLine: 52 + clamp(c.temperatureC - 5, -2, 7) * 6, snowLine: 91 + clamp(c.temperatureC - 5, -3, 9) * 5 };
}
