import { valleyDefinition, valleyHeight, valleyRiver, valleySite } from './planet-valley.js';
import { worldSeed } from './world.js';
import { createPlanetGeography, choosePlanetLocations, samplePlanetSurface, createNaturalGeography, chooseNaturalLocations } from './planet-geography.js';
import { createColonySite, createNaturalColonySite, colonyClearance } from './planet-colony.js';
import { BIOSPHERES } from './planet-biomes.js';
import { naturalHeight, naturalShore, naturalCreek, naturalLakes } from './planet-terrain.js';
import { createResourceFields, resourceFieldDensity, RESOURCE_VERSION } from './planet-resources.js';

// Only IDs, choices and transforms belong in a planet recipe. GPU objects and
// textures are presentation data. A new generation algorithm gets a new version.
export const PLANET_GENERATOR_VERSION = 8;
export const SAMPLE_PLANET_SEED = 'NEREID-3077';
export const REGION_BUILD_GRID = Object.freeze({ cells: 64, cellSize: 2, halfExtent: 64 });
export const REGION_TERRAIN = Object.freeze({ segments: 128, outerSegments: 72, nearSegments: 120, farSegments: 48, nearExtent: 3.5, extent: 10 });
export const PLANET_PRESETS = Object.freeze({
  temperate: { name: 'Erdähnliche Welt', globe: 'earth-day.jpg', atmosphere: '#6cb5ef', radiusKm: 6371, ocean: true },
  arid: { name: 'Trockene Welt', globe: 'mars.jpg', atmosphere: '#d4a984', radiusKm: 4300, ocean: false },
  lunar: { name: 'Luftlose Welt', globe: 'moon.jpg', atmosphere: null, radiusKm: 1737, ocean: false }
});
export const ROCK_ASSETS = Object.freeze({
  rounded: 'boulder-05.glb', layered: 'boulder-02.glb', lunar: 'moon-rock.glb'
});
export const REGION_MODULES = Object.freeze({
  coast: { name: 'Küstenebene', ground: 'sand', rock: 'namaqualand', rockModels: ['rounded', 'layered'], water: true, relief: 1.5, tint: '#ffffff', palette: ['#a6a18a', '#d4cbb0', '#71817c'], sky: '#789eae', fog: '#94afb5', rockTint: '#cbd1c5', description: 'Helle Strandterrassen, blaues Meer und Felsgruppen entlang einer geschwungenen Küste.' },
  basin: { name: 'Talbecken', ground: 'sand', rock: 'namaqualand', rockModels: ['layered', 'rounded'], water: false, relief: 2.2, tint: '#ffffff', palette: ['#b47e5b', '#e0ae7e', '#915d4a'], sky: '#9f826b', fog: '#baa18a', rockTint: '#b78769', description: 'Ein breiter Talboden zwischen verwitterten Hängen. Auf erdähnlichen Welten wachsen Wiesen und lichte Kieferngruppen.' },
  upland: { name: 'Felsiges Hochland', ground: 'regolith', rock: 'namaqualand', rockModels: ['rounded', 'layered'], water: false, relief: 3.5, tint: '#ffffff', palette: ['#87968d', '#c6c9bd', '#687778'], sky: '#8ca9b4', fog: '#b4c4ca', rockTint: '#a3afa9', description: 'Sanfte Hochlandterrassen vor entfernten Bergrücken; auf erdähnlichen Welten mit Wiesen und lockerem Nadelwald.' },
  caldera: { name: 'Vulkanisches Becken', ground: 'regolith', rock: 'lunar', rockModels: ['lunar', 'rounded'], water: false, relief: 2.8, tint: '#ffffff', palette: ['#383f41', '#727877', '#9b7459'], sky: '#7e807e', fog: '#949a97', rockTint: '#65706e', description: 'Eine alte Vulkanebene mit flachem Beckenboden und fernem, aufgebrochenem Rand; auf erdähnlichen Welten kehrt Vegetation zurück.' },
  regolith: { name: 'Kraterplateau', ground: 'regolith', rock: 'lunar', rockModels: ['lunar'], water: false, relief: 2.6, tint: '#ffffff', palette: ['#8a8a85', '#c0beb5', '#70716d'], sky: '#03070d', fog: '#03070d', rockTint: '#a9aca7', description: 'Luftloses Gelände mit Einschlagskratern, scharfem Licht und verstreuten Mondgesteinen.' },
  plain: { name: 'Offene Ebene', ground: 'sand', rock: 'namaqualand', rockModels: ['rounded', 'layered'], water: false, relief: 1.3, tint: '#ffffff', palette: ['#a5a185', '#c4b99c', '#777d70'], sky: '#9aadb9', fog: '#c6ceca', rockTint: '#b3b3a1', description: 'Weite, sanft gewellte Ebenen mit offenen Horizonten und niedrigen Felsrücken.' },
  lake: { name: 'Seenlandschaft', ground: 'sand', rock: 'namaqualand', rockModels: ['rounded', 'layered'], water: false, relief: 1.5, tint: '#ffffff', palette: ['#969c7e', '#bbc3aa', '#707d75'], sky: '#9bb3c3', fog: '#c5d3d4', rockTint: '#aeb7aa', description: 'Unregelmäßige Seen und kleinere Wasserbecken liegen zwischen trockenen Uferterrassen und bewachsenen Rücken.' }
});
const smooth = (a, b, value) => { const t = Math.max(0, Math.min(1, (value - a) / (b - a))); return t * t * (3 - 2 * t); };
const gaussian = value => Math.exp(-value * value);

// Keep established planet positions and untouched biome recipes stable. The
// recipe version advances independently of this existing random namespace.
export const planetSubseed = (seed, path) => worldSeed(`6:${seed}:${path}`);
export function planetRandom(seed) {
  let n = seed >>> 0;
  return () => { n = (n + 0x6d2b79f5) >>> 0; let t = Math.imul(n ^ n >>> 15, n | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
// Dry and airless planets retain their reference-map locations.
const anchors = [[37, 15], [22, 39], [-28, 19], [61, -17], [8, -8]];
const names = ['Meridian', 'Helion', 'Aster', 'Vesper', 'Eos'];

export function createReferencePlanetBlueprint(seedValue = SAMPLE_PLANET_SEED, { preset = 'temperate', regionCount = 4, name = 'Nereid', valley = null, biosphere = 'terran' } = {}) {
  if (!Object.hasOwn(PLANET_PRESETS, preset)) throw new Error('Unbekannte Planetenvorlage.');
  if (!Object.hasOwn(BIOSPHERES, biosphere) || (biosphere !== 'terran' && preset !== 'temperate')) throw new Error('Diese Biosphäre benötigt eine bewohnbare Welt.');
  if (!Number.isInteger(regionCount) || regionCount < 3 || regionCount > 5) throw new Error('Ein Musterplanet hat drei bis fünf Regionen.');
  const seed = worldSeed(seedValue), next = planetRandom(planetSubseed(seed, 'planet'));
  const modules = preset === 'temperate' ? ['coast', 'basin', 'upland', 'caldera', 'coast'] : preset === 'lunar' ? Array(5).fill('regolith') : ['basin', 'upland', 'caldera', 'basin', 'upland'];
  const geography = preset === 'temperate' ? createPlanetGeography(planetSubseed(seed, 'geography')) : null;
  const locations = geography ? choosePlanetLocations(geography, regionCount) : null;
  const regions = Array.from({ length: regionCount }, (_, i) => {
    const id = `region-${i}`, r = planetRandom(planetSubseed(seed, `${id}/identity`));
    const location = locations?.[i], [lat, lon] = location ? [location.latitude, location.longitude] : anchors[i];
    const climate = location ? { elevationM: location.elevationM, temperatureC: location.temperatureC, moisture: location.moisture, volcanism: location.volcanism, land: location.land } : null;
    const gradient = geography ? [samplePlanetSurface(geography, lat + .1, lon).land - samplePlanetSurface(geography, lat - .1, lon).land, samplePlanetSurface(geography, lat, lon + .1).land - samplePlanetSurface(geography, lat, lon - .1).land] : null;
    return { id, valley: modules[i] === 'basin' && preset === 'temperate' ? (['meadow', 'meander', 'woodland'].includes(valley) ? valley : ['meadow', 'meander', 'woodland'][planetSubseed(seed, id) % 3]) : null, name: names[i], module: modules[i], seed: planetSubseed(seed, id), latitude: lat + (preset === 'temperate' ? 0 : (r() - .5) * 16), longitude: lon + (preset === 'temperate' ? 0 : (r() - .5) * 60), explored: true, climate, rotation: gradient ? Math.atan2(gradient[0], gradient[1] / Math.max(.1, Math.cos(lat * Math.PI / 180))) : Math.floor(r() * 4) * Math.PI / 2, areaKm2: 1200 + Math.floor(r() * 2600) };
  });
  return { generatorVersion: 7, seed, name: String(name).slice(0, 40), preset, ...(biosphere !== 'terran' ? { biosphere } : {}), radiusKm: PLANET_PRESETS[preset].radiusKm * (.94 + next() * .12), axialTilt: .08 + next() * .12, geography, regions };
}

export function createPlanetBlueprint(seedValue = SAMPLE_PLANET_SEED, { preset = 'temperate', regionCount = 4, name = 'Nereid', biosphere = 'terran', climate = 'auto', reference = false, valley = null } = {}) {
  if (reference) return createReferencePlanetBlueprint(seedValue, { preset, regionCount, name, biosphere, valley });
  if (!Object.hasOwn(PLANET_PRESETS, preset)) throw new Error('Unbekannte Planetenvorlage.');
  if (!Object.hasOwn(BIOSPHERES, biosphere) || (biosphere !== 'terran' && preset !== 'temperate')) throw new Error('Diese Biosphäre benötigt eine bewohnbare Welt.');
  if (!Number.isInteger(regionCount) || regionCount < 3 || regionCount > 5) throw new Error('Ein Musterplanet hat drei bis fünf Regionen.');
  const seed = worldSeed(seedValue), next = planetRandom(planetSubseed(seed, '8/planet'));
  const geography = createNaturalGeography(planetSubseed(seed, '8/geography'), { preset, climate });
  const locations = chooseNaturalLocations(geography, regionCount);
  const regions = locations.map((p, i) => {
    const id = `region-${i}`, a = samplePlanetSurface(geography, p.latitude + .1, p.longitude), b = samplePlanetSurface(geography, p.latitude, p.longitude + .1);
    const climate = Object.fromEntries(['elevationM', 'temperatureC', 'moisture', 'volcanism', 'land', 'ridge'].map(k => [k, p[k]]));
    return { id, name: names[i], module: p.module, climateBiome: p.climateBiome, seed: planetSubseed(seed, `8/${id}`), latitude: p.latitude, longitude: p.longitude, rotation: Math.atan2(a.land - p.land, (b.land - p.land) / Math.max(.1, Math.cos(p.latitude * Math.PI / 180))), explored: true, climate, areaKm2: 1200 + Math.floor(planetRandom(planetSubseed(seed, `8/${id}/area`))() * 2600) };
  });
  return { generatorVersion: PLANET_GENERATOR_VERSION, seed, name: String(name).slice(0, 40), preset, ...(biosphere !== 'terran' ? { biosphere } : {}), climateMode: climate, radiusKm: PLANET_PRESETS[preset].radiusKm * (.88 + next() * .24), axialTilt: .04 + next() * .35, geography, regions };
}

function makeNaturalTerrain(region) {
  const n = planetRandom(planetSubseed(region.seed, 'shape'));
  const p = { variant: Math.floor(n() * 3), phase: n() * Math.PI * 2, level: 7.8 + n() * 1.4, relief: .75 + n() * .65, wavelength: 95 + n() * 100, gradeX: (n() - .5) * .008, gradeZ: (n() - .5) * .008, shore: -63 - n() * 16, bend: 8 + n() * 17, riverX: -100 - n() * 24, riverWidth: 8 + n() * 8, waterLevel: 3 + n(), ridgeZ: 230 + n() * 95, ringRadius: 230 + n() * 80, lakes: [] };
  if (region.preset === 'temperate' && (region.module === 'lake' || region.module === 'caldera' && region.climate.moisture > .43)) {
    p.lakes.push({ x: -135 - n() * 28, z: -90 - n() * 60, rx: 68 + n() * 35, rz: 58 + n() * 45, level: p.waterLevel });
    if (region.module === 'lake') for (let i = 0; i < 2 + p.variant; i++) p.lakes.push({ x: (i % 2 ? 1 : -1) * (180 + n() * 160), z: -240 - n() * 210, rx: 30 + n() * 48, rz: 24 + n() * 45, level: p.waterLevel });
  }
  return p;
}

export function createRegionBlueprint(planet, regionId) {
  if (![7, PLANET_GENERATOR_VERSION].includes(planet.generatorVersion)) throw new Error('Diese Planetengenerator-Version wird nicht unterstützt.');
  const region = planet.regions.find(r => r.id === regionId);
  if (!region || !REGION_MODULES[region.module]) throw new Error('Unbekannte Region.');
  const module = REGION_MODULES[region.module];
  const next = planetRandom(planetSubseed(region.seed, 'terrain'));
  const phase = next() * Math.PI * 2;
  const craters = Array.from({ length: 7 }, (_, i) => {
    const r = planetRandom(planetSubseed(region.seed, `crater/${i}`));
    return { x: (r() - .5) * 560, z: -130 - r() * 350, radius: 20 + r() * 48 };
  });
  const result = { generatorVersion: planet.generatorVersion, seed: region.seed, regionId, preset: planet.preset, valley: region.valley ?? null, module: region.module, latitude: region.latitude, longitude: region.longitude, rotation: region.rotation, climate: region.climate, colony: planet.preset === 'temperate' ? createColonySite(region.module) : null, size: 192, phase, craters, rocks: [], resources: [] };
  if (planet.biosphere) result.biosphere = planet.biosphere;
  if (planet.generatorVersion >= 8) {
    result.climateBiome = region.climateBiome;
    if (region.module !== 'regolith') result.terrain = makeNaturalTerrain(result);
    result.colony = createNaturalColonySite(region.module, planetRandom(planetSubseed(region.seed, 'site')), (x, z) => {
      const y = regionGroundHeight(result, x, z), slope = Math.hypot(regionHeight(result, x + 2, z) - regionHeight(result, x - 2, z), regionHeight(result, x, z + 2) - regionHeight(result, x, z - 2)) / 4;
      return { height: y, water: regionWater(result, x, z, y), slope };
    });
  }
  if (valleyDefinition(result)) result.colony = valleySite(result);
  if (result.colony && result.module === 'coast') result.colony.roads[1][0][0] = Math.max(-56, Math.min(8, regionShore(result, 25) + 25));
  // Scattered outcrops follow the same broad geological field. A few modest
  // boulders remain near the colony; no ring of oversized props around it.
  for (let i = 0; i < 100; i++) {
    const r = planetRandom(planetSubseed(region.seed, `rock/${i}`));
    const x = (r() - .5) * 180, z = (r() - .5) * 180;
    if (valleyDefinition(result) && x > -70) continue;
    if (Math.hypot(x, z) < 24 || colonyClearance(result, x, z) < 5 || regionHeight(result, x, z) < .5) continue;
    const exposure = regionNoise(result.seed, x / 43, z / 43, 73);
    if (r() > .16 + exposure * .3) continue;
    result.rocks.push({ id: `rock-${i}`, model: module.rockModels[Math.floor(r() * module.rockModels.length)], x, z, scale: 1.1 + r() ** 2 * 4.2, rotation: r() * Math.PI * 2, variant: Math.floor(r() * 3) });
  }
  result.resources = Array.from({ length: 4 }, (_, i) => {
    const r = planetRandom(planetSubseed(region.seed, `resource/${i}`));
    return { id: `deposit-${i}`, type: i === 3 ? 'geothermal' : 'ore', x: (r() - .5) * 46, z: (r() - .5) * 46, radius: 4 + r() * 3 };
  });
  if (planet.generatorVersion >= 8) { result.resourceVersion = RESOURCE_VERSION; result.resources = createResourceFields(result); }
  return result;
}

// Smooth seeded value noise: neighbouring positions share geology and habitat.
// Unlike independent Gaussian peaks, this makes continuous ridges and valleys.
export function regionNoise(seed, x, z, channel = 0) {
  const ix = Math.floor(x), iz = Math.floor(z), u = smooth(0, 1, x - ix), v = smooth(0, 1, z - iz);
  const hash = (a, b) => {
    let h = seed ^ Math.imul(a, 374761393) ^ Math.imul(b, 668265263) ^ Math.imul(channel, 1274126177);
    h = Math.imul(h ^ h >>> 13, 1274126177);
    return ((h ^ h >>> 16) >>> 0) / 4294967295;
  };
  const a = hash(ix, iz), b = hash(ix + 1, iz), c = hash(ix, iz + 1), d = hash(ix + 1, iz + 1);
  return (a + (b - a) * u) * (1 - v) + (c + (d - c) * u) * v;
}

export function regionShore(region, z) {
  if (region.terrain) return naturalShore(region, z);
  return -58 + 24 * gaussian((z + 25) / 80) - 13 * gaussian((z + 180) / 60) + (regionNoise(region.seed, 0, z / 160, 9) - .5) * 22 + 3 * Math.sin(z * .014 + region.phase);
}

// The valley river and volcanic tarn are shared terrain/water/plant features.
// Both remain beyond the colony's multi-cell building footprints.
export function regionCreek(region, z) {
  if (region.terrain) return naturalCreek(region, z);
  return valleyDefinition(region) ? valleyRiver(region, z) : null;
}
export function regionLake(region) {
  if (region.terrain) return naturalLakes(region)[0] ?? null;
  return region.preset === 'temperate' && region.module === 'caldera' ? { x: -60, z: -153, rx: 68, rz: 46, level: 2.2 } : null;
}
export function regionLakes(region) { return region.terrain ? naturalLakes(region) : regionLake(region) ? [regionLake(region)] : []; }
export function regionWater(region, x, z, height = regionGroundHeight(region, x, z)) {
  if (region.module === 'coast' && height < .1) return true;
  const c = regionCreek(region, z);
  if (c && height < c.level + .12 && Math.abs(x - c.x) < c.width * 1.08) return true;
  return regionLakes(region).some(l => Math.hypot((x - l.x) / l.rx, (z - l.z) / l.rz) < 1.25 && height < l.level + .08);
}

export function regionHeight(region, x, z) {
  if (region.terrain) return naturalHeight(region, x, z);
  if (valleyDefinition(region)) return valleyHeight(region, x, z);
  const n = (scale, channel) => regionNoise(region.seed, x / scale, z / scale, channel) - .5;
  const broad = n(260, 1), rolling = n(110, 2), detail = n(36, 3);
  const floor = 4.5 + x * .006 + z * .003 + broad * 1.8 + rolling * .45 + detail * .08;
  const bend = (regionNoise(region.seed, 0, z / 270, 5) - .5) * 65;
  if (region.module === 'coast') {
    const shore = x - regionShore(region, z);
    const land = smooth(-12, 48, shore);
    return -3 + smooth(-30, 26, shore) * 5.8 + smooth(20, 110, shore) * 1.8
      + land * (rolling * .5 + detail * .06)
      + smooth(100, 340, shore) * (12 + broad * 20 + rolling * 8);
  }
  if (region.module === 'basin') {
    const valley = Math.abs(x - bend);
    const creek = regionCreek(region, z);
    const bed = creek ? creek.depth * gaussian((x - creek.x) / (creek.width + 8)) * smooth(-72, -82, x) : 0;
    return floor + smooth(95, 260, valley) * (52 + broad * 32 + rolling * 10)
      + smooth(180, 480, -z) * (25 + broad * 20) - bed;
  }
  if (region.module === 'upland') {
    const ridge = smooth(100, 340, -z + bend * .3) * gaussian((z + 340 + bend) / 230) * (90 + broad * 46 + rolling * 20);
    return floor + 8 + ridge + smooth(115, 350, x + bend) * (48 + broad * 24)
      + smooth(110, 220, Math.hypot(x, z)) * Math.pow(Math.max(0, n(65, 17) + .5), 3) * 35
      + smooth(130, 330, -z) * Math.pow(1 - Math.abs(n(80, 18) * 2), 2) * 48;
  }
  if (region.module === 'caldera') {
    // Eroded remnants of a much wider rim, outside the colony terrace.
    const d = Math.hypot((x + 115) * .92, z + 70), rim = 64 * gaussian((d - 280 - broad * 35) / 65);
    const breach = .3 + .7 * smooth(-90, 180, -z + x * .4);
    const lake = regionLake(region);
    const l = lake ? Math.hypot((x - lake.x) / lake.rx, (z - lake.z) / lake.rz) : 99;
    const bowl = lake ? (1 - smooth(.7, 1.15, l)) * 8 : 0;
    const basalt = Math.max(0, regionNoise(region.seed, x / 57, z / 57, 91) - .4);
    const ribs = basalt * (7 + n(18, 92) * 4) * smooth(92, 130, Math.hypot(x, z));
    return floor - 1 + ribs + rim * breach * smooth(100, 170, Math.hypot(x, z)) + smooth(110, 260, -z) * rolling * 8 - bowl;
  }
  let height = floor - 1.5;
  for (const crater of region.craters) {
    const d = Math.hypot(x - crater.x, z - crater.z), r = crater.radius;
    height += r * .19 * gaussian((d - r) / (r * .2)) - r * .18 * Math.exp(-Math.pow(d / (r * .72), 4));
  }
  return height + smooth(120, 420, Math.hypot(x, z)) * (broad * 12 + rolling * 4);
}

// Rendering, placement and the camera use the same adaptive surface patches.
// A fine surrounding band resolves riverbanks, lake shores and nearby ridges.
export function regionTerrainPatches(region) {
  const half = region.size / 2, edge = half * REGION_TERRAIN.extent, near = half * REGION_TERRAIN.nearExtent, living = region.preset === 'temperate';
  const edges = living ? [-edge, -near, -half, half, near, edge] : [-edge, -half, half, edge];
  const segments = living ? [REGION_TERRAIN.farSegments, REGION_TERRAIN.nearSegments, REGION_TERRAIN.segments, REGION_TERRAIN.nearSegments, REGION_TERRAIN.farSegments] : [REGION_TERRAIN.outerSegments, REGION_TERRAIN.segments, REGION_TERRAIN.outerSegments];
  const center = living ? 2 : 1, patches = [];
  for (let iz = 0; iz < segments.length; iz++) for (let ix = 0; ix < segments.length; ix++) patches.push({
    minX: edges[ix], maxX: edges[ix + 1], minZ: edges[iz], maxZ: edges[iz + 1],
    segmentsX: segments[ix], segmentsZ: segments[iz], central: ix === center && iz === center
  });
  return patches;
}
export function regionGroundHeight(region, x, z) {
  const half = region.size / 2, edge = half * REGION_TERRAIN.extent, near = half * REGION_TERRAIN.nearExtent, living = region.preset === 'temperate';
  const axis = value => {
    value = Math.max(-edge, Math.min(edge, value));
    const a = Math.abs(value), inner = a <= half, middle = living && a <= near;
    const min = inner ? -half : middle ? value < 0 ? -near : half : value < 0 ? -edge : living ? near : half;
    const span = inner ? region.size : middle ? near - half : edge - (living ? near : half);
    const segments = inner ? REGION_TERRAIN.segments : middle ? REGION_TERRAIN.nearSegments : living ? REGION_TERRAIN.farSegments : REGION_TERRAIN.outerSegments;
    const step = span / segments, i = Math.min(segments - 1, Math.floor((value - min) / step));
    return [min + i * step, step, (value - min - i * step) / step];
  };
  const [x0, sx, u] = axis(x), [z0, sz, v] = axis(z);
  const a = regionHeight(region, x0, z0), b = regionHeight(region, x0 + sx, z0), c = regionHeight(region, x0, z0 + sz), d = regionHeight(region, x0 + sx, z0 + sz);
  return u + v <= 1 ? a + u * (b - a) + v * (c - a) : d + (1 - v) * (b - d) + (1 - u) * (c - d);
}

export function regionBuildCell(x, z) {
  const { halfExtent: half, cellSize: cell } = REGION_BUILD_GRID;
  if (!Number.isFinite(x) || !Number.isFinite(z) || x < -half || x >= half || z < -half || z >= half) return null;
  const column = Math.floor((x + half) / cell), row = Math.floor((z + half) / cell);
  return { column, row, x: -half + (column + .5) * cell, z: -half + (row + .5) * cell };
}

export function regionSite(region, x, z) {
  const height = regionGroundHeight(region, x, z), step = 2;
  const slope = Math.hypot(regionHeight(region, x + step, z) - regionHeight(region, x - step, z), regionHeight(region, x, z + step) - regionHeight(region, x, z - step)) / (step * 2);
  const creek = regionCreek(region, z);
  const lake = regionLake(region);
  const water = region.terrain ? regionWater(region, x, z, height) : (REGION_MODULES[region.module].water && height < .1) || !!(creek && Math.abs(x - creek.x) < creek.width) || !!(lake && Math.hypot((x - lake.x) / lake.rx, (z - lake.z) / lake.rz) < 1.25 && height < lake.level);
  const deposits = region.resources.filter(d => region.resourceVersion ? resourceFieldDensity(region, d, x, z) > .12 : Math.hypot(x - d.x, z - d.z) <= d.radius);
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
  const inBuildArea = regionBuildCell(x, z) !== null;
  return { x, z, height, slope, water, inBuildArea, buildable: inBuildArea && !water && slope < .12, deposits: deposits.map(d => d.type), coastDistance };
}
