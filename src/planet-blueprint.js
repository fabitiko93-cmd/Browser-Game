import { worldSeed } from './world.js';

// Only IDs, choices and transforms belong in a planet recipe. GPU objects and
// textures are presentation data. A new generation algorithm gets a new version.
export const PLANET_GENERATOR_VERSION = 3;
export const SAMPLE_PLANET_SEED = 'NEREID-3077';
export const REGION_BUILD_GRID = Object.freeze({ cells: 64, cellSize: 2, halfExtent: 64 });
export const REGION_TERRAIN = Object.freeze({ segments: 128, outerSegments: 72, extent: 10 });
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
  basin: { name: 'Rotes Becken', ground: 'sand', rock: 'namaqualand', rockModels: ['layered', 'rounded'], water: false, relief: 2.2, tint: '#ffffff', palette: ['#b47e5b', '#e0ae7e', '#915d4a'], sky: '#9f826b', fog: '#baa18a', rockTint: '#b78769', description: 'Ein breites, trockenes Tal zwischen roten Steilstufen und verwitterten Felsterrassen.' },
  upland: { name: 'Felsiges Hochland', ground: 'regolith', rock: 'namaqualand', rockModels: ['rounded', 'layered'], water: false, relief: 3.5, tint: '#ffffff', palette: ['#87968d', '#c6c9bd', '#687778'], sky: '#8ca9b4', fog: '#b4c4ca', rockTint: '#a3afa9', description: 'Kühle, helle Felsrücken, ein erhöhtes Plateau und dichteres Geröll an den Hängen.' },
  caldera: { name: 'Vulkanisches Becken', ground: 'regolith', rock: 'lunar', rockModels: ['lunar', 'rounded'], water: false, relief: 2.8, tint: '#ffffff', palette: ['#383f41', '#727877', '#9b7459'], sky: '#7e807e', fog: '#949a97', rockTint: '#65706e', description: 'Dunkles Vulkangestein in einer weiten Caldera mit einem deutlich erhöhten Kraterrand.' },
  regolith: { name: 'Kraterplateau', ground: 'regolith', rock: 'lunar', rockModels: ['lunar'], water: false, relief: 2.6, tint: '#ffffff', palette: ['#8a8a85', '#c0beb5', '#70716d'], sky: '#03070d', fog: '#03070d', rockTint: '#a9aca7', description: 'Luftloses Gelände mit Einschlagskratern, scharfem Licht und verstreuten Mondgesteinen.' }
});
const smooth = (a, b, value) => { const t = Math.max(0, Math.min(1, (value - a) / (b - a))); return t * t * (3 - 2 * t); };
const gaussian = value => Math.exp(-value * value);

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
  const modules = preset === 'temperate' ? ['coast', 'basin', 'upland', 'caldera', 'coast'] : preset === 'lunar' ? Array(5).fill('regolith') : ['basin', 'upland', 'caldera', 'basin', 'upland'];
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
  const ridges = Array.from({ length: 9 }, () => ({ x: (next() - .5) * 180, z: (next() - .5) * 180, radius: 18 + next() * 30, height: 1 + next() * 4 }));
  const phase = next() * Math.PI * 2;
  const craters = Array.from({ length: 5 }, (_, i) => {
    const r = planetRandom(planetSubseed(region.seed, `crater/${i}`)), angle = i / 5 * Math.PI * 2 + r() * .5, distance = 48 + r() * 26;
    return { x: Math.cos(angle) * distance, z: Math.sin(angle) * distance, radius: 12 + r() * 15 };
  });
  const distant = planetRandom(planetSubseed(region.seed, 'surrounding-relief'));
  const surroundings = Array.from({ length: 24 }, (_, i) => {
    const angle = i / 24 * Math.PI * 2 + distant() * .3, distance = 150 + distant() * 450;
    return { x: Math.cos(angle) * distance, z: Math.sin(angle) * distance, radius: 32 + distant() * 80, height: 8 + distant() * 36 };
  });
  const result = { generatorVersion: planet.generatorVersion, seed: region.seed, regionId, preset: planet.preset, module: region.module, size: 192, phase, ridges, craters, surroundings, rocks: [], resources: [] };
  const counts = { coast: 48, basin: 56, upland: 68, caldera: 60, regolith: 64 };
  for (let i = 0; i < counts[region.module]; i++) {
    const r = planetRandom(planetSubseed(region.seed, `rock/${i}`)), group = i % 8;
    let x, z;
    if (region.module === 'coast') { z = -77 + group * 22 + (r() - .5) * 20; x = -30 + r() * 18 + (group % 3 === 0 ? 52 : 0); }
    else if (region.module === 'basin') { x = (group % 2 ? 1 : -1) * (group % 4 < 2 ? 12 + r() * 7 : 69 + r() * 9); z = (r() - .5) * 150; }
    else { const angle = group / 8 * Math.PI * 2 + (r() - .5) * .5, radius = (region.module === 'caldera' ? group % 2 ? 87 : 34 : 50) + (r() - .5) * (region.module === 'caldera' ? 10 : 30); x = Math.cos(angle) * radius; z = Math.sin(angle) * radius; }
    x = Math.max(-80, Math.min(80, x)); z = Math.max(-80, Math.min(80, z));
    const width = region.module === 'caldera' || region.module === 'regolith' ? 3 + r() * 7 : region.module === 'upland' ? 5 + r() * 12 : 4 + r() * 10;
    // Prefer a stable shelf near each cluster. Loose boulders should not lean
    // out of near-vertical crater walls as though attached to the air.
    let best = null;
    for (let attempt = 0; attempt < 10; attempt++) {
      const cx = attempt ? x + (r() - .5) * 30 : x, cz = attempt ? z + (r() - .5) * 30 : z;
      if (Math.abs(cx) > 80 || Math.abs(cz) > 80 || Math.hypot(cx, cz) <= 24) continue;
      const span = width * .55, dx = (regionGroundHeight(result, cx + span, cz) - regionGroundHeight(result, cx - span, cz)) / (span * 2), dz = (regionGroundHeight(result, cx, cz + span) - regionGroundHeight(result, cx, cz - span)) / (span * 2), slope = Math.hypot(dx, dz);
      if (regionHeight(result, cx, cz) < .2) continue;
      if (!best || slope < best.slope) best = { x: cx, z: cz, slope };
      if (slope < .3) break;
    }
    if (!best || best.slope > .5) continue;
    x = best.x; z = best.z;
    if (Math.hypot(x, z) <= 24) continue;
    result.rocks.push({ id: `rock-${i}`, model: module.rockModels[Math.floor(r() * module.rockModels.length)], x, z, scale: width, rotation: r() * Math.PI * 2, variant: Math.floor(r() * 3) });
  }
  result.resources = Array.from({ length: 4 }, (_, i) => {
    const r = planetRandom(planetSubseed(region.seed, `resource/${i}`));
    return { id: `deposit-${i}`, type: i === 3 ? 'geothermal' : 'ore', x: (r() - .5) * 46, z: (r() - .5) * 46, radius: 4 + r() * 3 };
  });
  return result;
}

// Different geology modules share the same coordinate/seed contract, not the
// same Gaussian hills. Fine surface detail and rock meshes remain real scans.
export function regionHeight(region, x, z) {
  const erosion = region.ridges.reduce((h, r) => h + r.height * Math.exp(-((x - r.x) ** 2 + (z - r.z) ** 2) / r.radius ** 2), 0);
  const phase = region.phase, radius = Math.hypot(x, z), outer = smooth(22, 48, radius);
  const distant = smooth(90, 150, radius) * region.surroundings.reduce((h, r) => h + r.height * Math.exp(-((x - r.x) ** 2 + (z - r.z) ** 2) / r.radius ** 2), 0);
  if (region.module === 'coast') {
    const shore = -42 + 5 * Math.sin(z * .044 + phase) + 2 * Math.sin(z * .1 + phase);
    return -3.5 + smooth(shore - 12, shore + 20, x) * (7 + erosion * .12) + outer * smooth(14, 65, x) * erosion * .9 + distant * smooth(0, 80, x);
  }
  if (region.module === 'basin') {
    const bend = Math.sin(z * .018 + phase) * 9;
    const walls = smooth(22, 37, Math.abs(x - bend)) * 15 + smooth(41, 58, Math.abs(x - bend)) * 13;
    return 2.5 + erosion * .07 + outer * (walls + erosion * .5) + distant;
  }
  if (region.module === 'upland') {
    const ridge = 28 * gaussian((z + 55 + 8 * Math.sin(x * .04 + phase)) / 20) + 15 * gaussian((x - 57) / 18);
    return 12 + erosion * .08 + outer * (ridge + erosion * 1.2 + 3 * Math.sin(x * .04 + z * .025 + phase) ** 2) + distant;
  }
  if (region.module === 'caldera') {
    const d = Math.hypot(x + 7, z + 9), rim = 31 * gaussian((d - 64) / 13);
    const breach = 1 - .68 * gaussian((x - 14) / 20) * smooth(15, 55, z);
    return 4 + erosion * .1 + outer * (rim * breach + erosion * .3) + distant * .65;
  }
  let height = 3 + erosion * .09;
  for (const crater of region.craters) {
    const d = Math.hypot(x - crater.x, z - crater.z), r = crater.radius;
    height += outer * (r * .22 * gaussian((d - r) / (r * .17)) - r * .22 * Math.exp(-Math.pow(d / (r * .72), 4)));
  }
  return height + distant * .4;
}

// The renderer and every placement/camera query share the same nine patches.
// Outside the work area, query the surrounding mesh instead of extrapolating
// a triangle from the edge of the central patch.
export function regionTerrainPatches(region) {
  const half = region.size / 2, edges = [-half * REGION_TERRAIN.extent, -half, half, half * REGION_TERRAIN.extent];
  const patches = [];
  for (let iz = 0; iz < 3; iz++) for (let ix = 0; ix < 3; ix++) patches.push({
    minX: edges[ix], maxX: edges[ix + 1], minZ: edges[iz], maxZ: edges[iz + 1],
    segmentsX: ix === 1 ? REGION_TERRAIN.segments : REGION_TERRAIN.outerSegments,
    segmentsZ: iz === 1 ? REGION_TERRAIN.segments : REGION_TERRAIN.outerSegments, central: ix === 1 && iz === 1
  });
  return patches;
}
export function regionGroundHeight(region, x, z) {
  const half = region.size / 2, edge = half * REGION_TERRAIN.extent;
  const axis = value => {
    value = Math.max(-edge, Math.min(edge, value));
    const min = value < -half ? -edge : value > half ? half : -half;
    const span = Math.abs(value) > half ? edge - half : region.size;
    const segments = Math.abs(value) > half ? REGION_TERRAIN.outerSegments : REGION_TERRAIN.segments;
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
  const inBuildArea = regionBuildCell(x, z) !== null;
  return { x, z, height, slope, water, inBuildArea, buildable: inBuildArea && !water && slope < .35, deposits: deposits.map(d => d.type), coastDistance };
}
