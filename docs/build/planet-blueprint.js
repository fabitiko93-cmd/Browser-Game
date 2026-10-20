import { worldSeed } from './world.js';

// Only IDs, choices and transforms belong in a planet recipe. GPU objects and
// textures are presentation data. A new generation algorithm gets a new version.
export const PLANET_GENERATOR_VERSION = 1;
export const SAMPLE_PLANET_SEED = 'NEREID-3077';
export const PLANET_PRESETS = Object.freeze({
  temperate: { name: 'Bewohnbare Welt', globe: 'earth-day.jpg', atmosphere: '#6cb5ef', radiusKm: 6371, ocean: true },
  arid: { name: 'Trockene Welt', globe: 'mars.jpg', atmosphere: '#d4a984', radiusKm: 4300, ocean: false },
  lunar: { name: 'Luftlose Welt', globe: 'moon.jpg', atmosphere: null, radiusKm: 1737, ocean: false }
});
export const REGION_MODULES = Object.freeze({
  coast: { name: 'Küstenebene', ground: 'sand', rock: 'namaqualand', water: true, relief: 1.5, tint: '#b7b297', description: 'Geschützte Küste mit einer zusammenhängenden Baufläche und Wasserzugang.' },
  basin: { name: 'Trockenes Becken', ground: 'sand', rock: 'namaqualand', water: false, relief: 2.2, tint: '#c3ad88', description: 'Offenes Tal zwischen verwitterten Felsformationen. Viel Platz für weitläufige Anlagen.' },
  upland: { name: 'Felsiges Hochland', ground: 'sand', rock: 'namaqualand', water: false, relief: 3.5, tint: '#aaa699', description: 'Höhenzüge und freiliegendes Gestein um eine flachere zentrale Hochebene.' },
  regolith: { name: 'Regolithplateau', ground: 'regolith', rock: 'lunar', water: false, relief: 2.6, tint: '#aaa9a3', description: 'Luftlose, staubige Oberfläche mit scharfem Licht und vereinzelten Felsgruppen.' }
});

export const planetSubseed = (seed, path) => worldSeed(`${PLANET_GENERATOR_VERSION}:${seed}:${path}`);
export function planetRandom(seed) {
  let n = seed >>> 0;
  return () => { n = (n + 0x6d2b79f5) >>> 0; let t = Math.imul(n ^ n >>> 15, n | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
// Reference locations deliberately stay on the source Earth map. Keep the
// selectable regions separated enough for a portrait touch display.
const anchors = [[37, 15], [22, 39], [-28, 19], [61, -17], [8, -8]];
const names = ['Meridian', 'Helion', 'Aster', 'Vesper', 'Eos'];

export function createPlanetBlueprint(seedValue = SAMPLE_PLANET_SEED, { preset = 'temperate', regionCount = 4, name = 'Nereid' } = {}) {
  if (!Object.hasOwn(PLANET_PRESETS, preset)) throw new Error('Unbekannte Planetenvorlage.');
  if (!Number.isInteger(regionCount) || regionCount < 3 || regionCount > 5) throw new Error('Ein Musterplanet hat drei bis fünf Regionen.');
  const seed = worldSeed(seedValue), next = planetRandom(planetSubseed(seed, 'planet'));
  const modules = preset === 'temperate' ? ['coast', 'basin', 'upland', 'coast', 'upland'] : preset === 'lunar' ? Array(5).fill('regolith') : ['basin', 'upland', 'basin', 'upland', 'basin'];
  const regions = Array.from({ length: regionCount }, (_, i) => {
    const id = `region-${i}`, r = planetRandom(planetSubseed(seed, `${id}/identity`));
    const [lat, lon] = anchors[i];
    return { id, name: names[i], module: modules[i], seed: planetSubseed(seed, id), latitude: lat + (preset === 'temperate' ? 0 : (r() - .5) * 16), longitude: lon + (preset === 'temperate' ? 0 : (r() - .5) * 60), explored: true, rotation: Math.floor(r() * 4) * Math.PI / 2, areaKm2: 1200 + Math.floor(r() * 2600) };
  });
  return { generatorVersion: PLANET_GENERATOR_VERSION, seed, name: String(name).slice(0, 40), preset, radiusKm: PLANET_PRESETS[preset].radiusKm * (.94 + next() * .12), axialTilt: .08 + next() * .12, regions };
}

export function createRegionBlueprint(planet, regionId) {
  if (planet.generatorVersion !== PLANET_GENERATOR_VERSION) throw new Error('Diese Planetengenerator-Version wird nicht unterstützt.');
  const region = planet.regions.find(r => r.id === regionId);
  if (!region || !REGION_MODULES[region.module]) throw new Error('Unbekannte Region.');
  const module = REGION_MODULES[region.module];
  const next = planetRandom(planetSubseed(region.seed, 'terrain'));
  const ridges = Array.from({ length: 9 }, () => ({ x: (next() - .5) * 170, z: (next() - .5) * 170, radius: 14 + next() * 25, height: (3 + next() * 8) * module.relief }));
  const rocks = Array.from({ length: 100 }, (_, i) => {
    const r = planetRandom(planetSubseed(region.seed, `rock/${i}`));
    return { id: `rock-${i}`, model: module.rock, x: (r() - .5) * 172, z: (r() - .5) * 172, scale: 1.5 + r() * 5.5, rotation: r() * Math.PI * 2, variant: Math.floor(r() * 3) };
  }).filter(r => Math.hypot(r.x, r.z) > 24 && (!module.water || r.x > -48));
  const resources = Array.from({ length: 4 }, (_, i) => {
    const r = planetRandom(planetSubseed(region.seed, `resource/${i}`));
    return { id: `deposit-${i}`, type: i === 3 ? 'geothermal' : 'ore', x: (r() - .5) * 46, z: (r() - .5) * 46, radius: 4 + r() * 3 };
  });
  return { generatorVersion: planet.generatorVersion, seed: region.seed, regionId, module: region.module, size: 192, ridges, rocks, resources };
}

// Broad relief is a deterministic layout. Fine surface detail and all rock
// geometry come from the credited scans; no random primitive rock substitutes.
export function regionHeight(region, x, z) {
  const config = REGION_MODULES[region.module];
  const terrain = region.ridges.reduce((height, r) => height + r.height * Math.exp(-((x - r.x) ** 2 + (z - r.z) ** 2) / (r.radius ** 2)), 0);
  const flat = Math.min(1, Math.max(0, (Math.hypot(x, z) - 19) / 25));
  const base = terrain * flat + .8;
  return config.water ? base - Math.max(0, -x - 35) * .22 : base;
}

export function regionSite(region, x, z) {
  const height = regionHeight(region, x, z), step = 2;
  const slope = Math.hypot(regionHeight(region, x + step, z) - regionHeight(region, x - step, z), regionHeight(region, x, z + step) - regionHeight(region, x, z - step)) / (step * 2);
  const water = REGION_MODULES[region.module].water && height < .1;
  const deposits = region.resources.filter(d => Math.hypot(x - d.x, z - d.z) <= d.radius);
  // Measure against the generated shoreline, not the nominal coast module edge.
  let coastDistance = null;
  if (REGION_MODULES[region.module].water) {
    coastDistance = water ? 0 : Infinity;
    for (let shoreZ = -region.size / 2; shoreZ <= region.size / 2; shoreZ += 4) {
      let wet = -region.size / 2, dry = region.size / 2;
      if (regionHeight(region, wet, shoreZ) >= .1) continue;
      for (let i = 0; i < 10; i++) { const mid = (wet + dry) / 2; if (regionHeight(region, mid, shoreZ) < .1) wet = mid; else dry = mid; }
      coastDistance = Math.min(coastDistance, Math.hypot(x - wet, z - shoreZ));
    }
    if (!Number.isFinite(coastDistance)) coastDistance = null;
  }
  return { x, z, height, slope, water, buildable: Math.abs(x) <= region.size / 2 && Math.abs(z) <= region.size / 2 && !water && slope < .35, deposits: deposits.map(d => d.type), coastDistance };
}
