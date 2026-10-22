import { valleyDefinition, valleyEcology } from './planet-valley.js';
import { regionBiome } from './planet-biomes.js';
import { colonyClearance } from './planet-colony.js';
import { planetRandom, planetSubseed, regionGroundHeight, regionNoise, regionCreek, regionLake, regionLakes, regionWater, REGION_MODULES } from './planet-blueprint.js';

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = (a, b, value) => { const t = clamp((value - a) / (b - a)); return t * t * (3 - 2 * t); };
export const FLORA_ASSETS = Object.freeze({ pine: 'woodland-pine.glb', oak: 'woodland-oak.glb', aspen: 'woodland-aspen.glb', shrub: 'woodland-shrub.glb', fern: 'fern.glb', grass: 'meadow-grass.glb', acacia: 'climate-acacia.glb', tropical: 'climate-tropical.glb', palm: 'climate-palm.glb', willow: 'climate-willow.glb', cactus: 'climate-cactus.glb', reed: 'climate-reed.glb', 'xeno-spore': 'alien-spore.glb', 'xeno-coral': 'alien-coral.glb', 'xeno-pod': 'alien-pod.glb', 'xeno-cup': 'alien-cup.glb' });
export const NATURAL_FLORA_BUDGET = Object.freeze({ trees: 1800, plants: 6500 });
const biomes = new WeakMap();
const cachedBiome = r => { if (!biomes.has(r)) biomes.set(r, regionBiome(r)); return biomes.get(r); };

function naturalHabitat(region, x, z, height, slope) {
  const b = cachedBiome(region);
  if (!b) return { cover: 0, forest: 0, moisture: 0, snow: 0 };
  const c = regionCreek(region, z), lakes = regionLakes(region), underwater = regionWater(region, x, z, height);
  let distance = c ? Math.abs(x - c.x) / Math.sqrt(1 + c.tangent ** 2) - c.width : region.module === 'coast' ? Math.max(0, height * 7) : 180;
  for (const l of lakes) distance = Math.min(distance, Math.abs(Math.hypot((x - l.x) / l.rx, (z - l.z) / l.rz) - 1) * Math.min(l.rx, l.rz));
  const moisture = clamp(b.moisture * .8 + regionNoise(region.seed, x / 105, z / 105, 231) * .2 + Math.exp(-Math.max(0, distance) / 17) * .22);
  const variation = regionNoise(region.seed, x / 65, z / 65, 232);
  const bare = region.module === 'caldera' ? smooth(.3, .67, regionNoise(region.seed, x / 49, z / 49, 233)) * .83 : smooth(.2, .75, slope) * .6;
  const snow = b.id === 'ice' ? (1 - smooth(.55, 1.05, slope) * .6) : smooth(b.snowLine - 16, b.snowLine + 16, height + (variation - .5) * 25) * (1 - smooth(.6, 1.1, slope));
  const shore = region.module === 'coast' ? smooth(.5, 2.8, height) : 1;
  const cover = underwater ? 0 : b.cover * shore * (1 - bare) * (1 - snow) * (1 - smooth(.4, .95, slope));
  const woodland = regionNoise(region.seed, x / 85 + 3, z / 85 - 4, 234) * .7 + regionNoise(region.seed, x / 30, z / 30, 235) * .3;
  const canopy = smooth(.39, .73, woodland + (b.forest - .5) * .55 + Math.exp(-Math.max(0, distance) / 28) * .12);
  const forest = b.trees.length ? (b.id === 'desert' ? .022 + canopy * .055 : canopy) * (1 - snow) * shore * (1 - smooth(.3, .62, slope)) * (1 - smooth(b.treeLine - 12, b.treeLine + 12, height)) * smooth(4, 11, colonyClearance(region, x, z)) * (underwater ? 0 : 1) : 0;
  const sediment = underwater ? 0 : Math.exp(-Math.max(0, distance) / 4) * .7;
  return { cover, forest, moisture, snow, sediment, variation };
}

// These shared, continuous fields drive trees, understory and the ground blend.
// Meadow clearings are irregular gaps in woodland, never a circular prop ring.
export function regionHabitat(region, x, z, height, slope = 0) {
  if (region.terrain) return naturalHabitat(region, x, z, height, slope);
  const biome = regionBiome(region);
  if (!biome) return { cover: 0, forest: 0, moisture: 0, snow: 0 };
  const creek = regionCreek(region, z), lake = regionLake(region);
  if (valleyDefinition(region)) {
    const e = valleyEcology(region, x, z), distance = Math.abs(x - creek.x) / Math.sqrt(1 + creek.tangent ** 2);
    const wet = distance < creek.width / Math.sqrt(1 + creek.tangent ** 2) + 1 && height < creek.level + .2;
    const bank = smooth(creek.level + .08, creek.level + .65, height);
    const sediment = Math.max(e.sediment, (1 - bank) * .8);
    const cover = wet ? 0 : (1 - sediment * .96) * (1 - smooth(.5, .95, slope));
    const forest = e.forest * (biome.alien ? biome.canopyDensity : 1) * (wet ? 0 : 1) * smooth(creek.level + .4, creek.level + 1.5, height) * smooth(4, 11, colonyClearance(region, x, z));
    return { cover, forest, moisture: clamp(e.moisture + ((biome.moisture ?? .65) - .65) * .18), snow: 0, sediment, variation: regionNoise(region.seed, x / 47, z / 47, 107) };
  }
  const wetDistance = creek ? Math.abs(x - creek.x) : lake ? Math.abs(Math.hypot((x - lake.x) / lake.rx, (z - lake.z) / lake.rz) - 1) * 40 : 200;
  const moisture = clamp((biome.moisture ?? .65) * .7 + regionNoise(region.seed, x / 90, z / 90, 31) * .3 + Math.exp(-wetDistance / 20) * .3);
  const shore = region.module === 'coast' ? smooth(.65, 2.4, height) : 1;
  const bank = creek ? smooth(creek.width, creek.width + 4, Math.abs(x - creek.x)) : 1;
  const lakeBank = lake && height < lake.level + .15 && Math.hypot((x - lake.x) / lake.rx, (z - lake.z) / lake.rz) < 1.25 ? 0 : 1;
  const basalt = region.module === 'caldera' ? smooth(.34, .66, regionNoise(region.seed, x / 57, z / 57, 91)) * .96 : 0;
  const rock = region.module === 'upland' ? smooth(.13, .6, slope) * .8 : basalt;
  const snow = region.module === 'upland' ? smooth((biome.snowLine ?? 110) - 12, (biome.snowLine ?? 110) + 12, height) * (1 - smooth(.6, 1.1, slope)) : 0;
  const clearance = colonyClearance(region, x, z);
  const cover = shore * bank * lakeBank * (1 - smooth(.32, .85, slope)) * (1 - rock) * (1 - snow);
  const woodland = regionNoise(region.seed, x / (region.module === 'coast' ? 62 : 88) + 3.7, z / 88 - 8.1, 41) * .65
    + regionNoise(region.seed, x / 32, z / 32, 42) * .35;
  const riparian = creek ? Math.exp(-Math.pow((wetDistance - 20) / 20, 2)) * .22 : 0;
  const treeline = region.module === 'upland' ? 1 - smooth((biome.treeLine ?? 65) - 12, (biome.treeLine ?? 65) + 12, height) : 1;
  const canopy = region.module === 'coast' ? smooth(.36, .62, woodland) * .72 : smooth(.28, .7, woodland + (biome.forest - .55) * .8 + riparian);
  const forest = canopy * cover * treeline * smooth(4, 11, clearance);

  return { cover, forest, moisture, snow };
}
export function regionCover(region, x, z, height, slope = 0) { return regionHabitat(region, x, z, height, slope).cover; }

export function createRegionEnvironment(region) {
  if (region.generatorVersion >= 8) return createNaturalEnvironment(region);
  const rocks = [], plants = [], trees = [], module = REGION_MODULES[region.module], biome = regionBiome(region);
  const slopeAt = (x, z, span = 2) => Math.hypot(regionGroundHeight(region, x + span, z) - regionGroundHeight(region, x - span, z), regionGroundHeight(region, x, z + span) - regionGroundHeight(region, x, z - span)) / (span * 2);
  const occupied = new Map(), valley = !!valleyDefinition(region), grid = biome?.canopySpacing ?? (valley ? region.valley === 'woodland' ? 10.2 : 9.5 : 11), count = valley ? biome?.alien ? Math.ceil(660 / grid) : 66 : 32;
  if (biome) for (let gz = -count; gz <= count; gz++) for (let gx = -count; gx <= count; gx++) {
    const next = planetRandom(planetSubseed(region.seed, `woodland/${gx}/${gz}`));
    const x = (gx + (next() - .5) * .98) * grid, z = (gz + (next() - .5) * .98) * grid;
    const y = regionGroundHeight(region, x, z), slope = slopeAt(x, z), h = regionHabitat(region, x, z, y, slope);
    const distance = Math.hypot(x, z), density = (valley ? .97 * (1 - smooth(450, 620, distance)) : .66) * (biome.canopyDensity ?? 1);
    if (h.forest < .06 || next() > h.forest * density || y < 1.5 || slope > (valley ? .58 : .38) || distance > (valley ? 620 : 350)) continue;
    const model = biome.trees[Math.floor(next() * biome.trees.length)], young = next() < .18;
    const size = biome.treeScale * (valley ? (model === 'aspen' ? 13 : 12) + next() * (model === 'aspen' ? 5 : 6) : model === 'pine' ? 10 + next() * 8 : model === 'aspen' ? 9 + next() * 7 : 8 + next() * 6) * (young ? .5 : 1);
    let overlap = false;
    for (let dz = -2; dz <= 2; dz++) for (let dx = -2; dx <= 2; dx++) {
      const other = occupied.get(`${gx + dx}/${gz + dz}`);
      if (other && Math.hypot(x - other.x, z - other.z) < (size + other.size) * .21) overlap = true;
    }
    if (overlap) continue;
    const tree = { x, y: y - .08, z, size, width: .88 + next() * .24, model, variant: Math.floor(next() * 2), rotation: next() * Math.PI * 2, tint: .88 + next() * .2 };
    occupied.set(`${gx}/${gz}`, tree); trees.push(tree);
  }
  if (biome) for (let gz = -22; gz <= 22; gz++) for (let gx = -22; gx <= 22; gx++) {
    const next = planetRandom(planetSubseed(region.seed, `understory/${gx}/${gz}`));
    const px = (gx + next() - .5) * 8, pz = (gz + next() - .5) * 8;
    const py = regionGroundHeight(region, px, pz), ph = regionHabitat(region, px, pz, py, slopeAt(px, pz));
    if (py < 1.4 || colonyClearance(region, px, pz) < 3 || ph.cover < .5 || Math.hypot(px, pz) > 180) continue;
    if (ph.forest > .3 && next() < .08) plants.push({ x: px, y: py - .025, z: pz, size: .9 + next() * 1.2, width: 1, model: biome.alien ? region.biosphere === 'spore' ? 'xeno-pod' : 'xeno-cup' : 'shrub', variant: Math.floor(next() * 2), rotation: next() * Math.PI * 2, tint: .9 + next() * .15 });
    // Meadows use dense, small grass clumps. Shade shifts toward ferns, with
    // a little green understory remaining beneath the mature tree crowns.
    const count = biome.alien ? Math.round(1 + (1 - ph.forest) * 2) : Math.round(4 + (1 - ph.forest) * (valley ? 9 : 7));
    for (let i = 0; i < count; i++) {
      const x = px + (next() - .5) * 8, z = pz + (next() - .5) * 8;
      const y = regionGroundHeight(region, x, z), h = regionHabitat(region, x, z, y, slopeAt(x, z));
      if (y < 1.4 || colonyClearance(region, x, z) < 2.8 || next() > h.cover * (.9 - h.forest * .35)) continue;
      const fern = region.module !== 'caldera' && region.module !== 'upland' && h.forest > .25 && h.moisture > .4 && next() < h.forest * .6;
      if (biome.alien) {
        const pod = region.biosphere === 'spore' ? h.forest > .2 || next() < .7 : h.moisture > .7 && next() < .18;
        plants.push({ x, y: y - .04, z, model: pod ? 'xeno-pod' : 'xeno-cup', size: biome.grassHeight * (.55 + next() * .9), width: .85 + next() * .4, rotation: next() * Math.PI * 2, variant: Math.floor(next() * 2), tint: .86 + next() * .2 });
        continue;
      }
      plants.push({ x, y: y - .025, z, model: fern ? 'fern' : 'grass', size: fern ? .45 + next() * .6 : biome.grassHeight * (.5 + next() * .75), width: .9 + next() * .3, rotation: next() * Math.PI * 2, variant: fern ? 0 : next() < .92 ? 1 : 0, tint: .9 + next() * .18 });
    }
  }
  for (let gz = -7; gz <= 7; gz++) for (let gx = -7; gx <= 7; gx++) {
    const next = planetRandom(planetSubseed(region.seed, `outcrops/${gx}/${gz}`));
    const cx = (gx + next() - .5) * 46, cz = (gz + next() - .5) * 46;
    const exposure = regionNoise(region.seed, cx / 85, cz / 85, 73);
    for (let i = 0; i < 3; i++) {
      const x = cx + (next() - .5) * 17, z = cz + (next() - .5) * 17;
      if (colonyClearance(region, x, z) < 5 || Math.hypot(x, z) < 95 || Math.hypot(x, z) > 360 || next() > .35 + exposure * .48) continue;
      if (regionGroundHeight(region, x, z) < .6 || slopeAt(x, z, 5) > .38) continue;
      if (valley && valleyEcology(region, x, z).sediment < .15 && slopeAt(x,z,5) < .18) continue;
      rocks.push({ id: `environment-${gx}-${gz}-${i}`, x, z, scale: i === 0 ? 2 + next() * 5 : .65 + next() * 1.8, rotation: next() * Math.PI * 2, variant: Math.floor(next() * 3), model: module.rockModels[Math.floor(next() * module.rockModels.length)] });
    }
  }
  if (valley) for (let i = 0; i < 1300; i++) {
    const next = planetRandom(planetSubseed(region.seed, `river-gravel/${i}`)), z = (next() - .5) * 610, c = regionCreek(region,z);
    const x = c.x + (next() < .5 ? -1 : 1) * (c.width + 2 + next() * 20), y = regionGroundHeight(region,x,z);
    if (y < c.level + .16 || y > c.level + 2.8 || valleyEcology(region,x,z).sediment < .22) continue;
    rocks.push({ id: `river-gravel-${i}`, x, z, scale: .18 + next() ** 2 * .8, rotation: next() * Math.PI * 2, variant: Math.floor(next()*3), model: next() < .6 ? 'rounded' : 'layered' });
  }
  return { rocks, plants, trees };
}

function createNaturalEnvironment(region) {
  const b = cachedBiome(region), trees = [], plants = [], rocks = [], module = REGION_MODULES[region.module];
  const slopeAt = (x, z) => Math.hypot(regionGroundHeight(region, x + 2, z) - regionGroundHeight(region, x - 2, z), regionGroundHeight(region, x, z + 2) - regionGroundHeight(region, x, z - 2)) / 4;
  const grid = b?.canopySpacing ?? 15, extent = 430, count = Math.ceil(extent / grid), occupied = new Map();
  if (b?.trees.length) for (let gz = -count; gz <= count; gz++) for (let gx = -count; gx <= count; gx++) {
    const n = planetRandom(planetSubseed(region.seed, `forest/${gx}/${gz}`)), x = (gx + (n() - .5) * .9) * grid, z = (gz + (n() - .5) * .9) * grid;
    if (Math.hypot(x, z) > extent) continue;
    const y = regionGroundHeight(region, x, z), slope = slopeAt(x, z), h = naturalHabitat(region, x, z, y, slope);
    if (n() > h.forest * .88 * (b.canopyDensity ?? 1) || h.forest < .012 || slope > .42 || colonyClearance(region, x, z) < 4 || regionWater(region, x, z, y)) continue;
    const model = b.trees[Math.floor(n() * b.trees.length)], size = b.treeScale * (9 + n() * 8) * (n() < .18 ? .55 : 1);
    let overlap = false;
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) { const t = occupied.get(`${gx + dx}/${gz + dz}`); if (t && Math.hypot(t.x - x, t.z - z) < (t.size + size) * .2) overlap = true; }
    if (overlap) continue;
    const tree = { x, y: y - .055, z, model, size, width: .82 + n() * .34, variant: Math.floor(n() * 2), rotation: n() * Math.PI * 2, tint: .86 + n() * .22, rank: n() };
    trees.push(tree); occupied.set(`${gx}/${gz}`, tree);
  }
  if (b?.understory > 0) for (let gz = -19; gz <= 19; gz++) for (let gx = -19; gx <= 19; gx++) {
    const n = planetRandom(planetSubseed(region.seed, `groundcover/${gx}/${gz}`)), px = gx * 9, pz = gz * 9;
    const count = Math.round((b.alien ? 3 : 7) * b.understory);
    for (let i = 0; i < count; i++) {
      const x = px + (n() - .5) * 9, z = pz + (n() - .5) * 9;
      if (Math.hypot(x, z) > 180 || colonyClearance(region, x, z) < 2.8) continue;
      const y = regionGroundHeight(region, x, z), slope = slopeAt(x, z), h = naturalHabitat(region, x, z, y, slope);
      if (n() > h.cover * (.88 - h.forest * .28) || regionWater(region, x, z, y)) continue;
      const model = b.alien ? region.biosphere === 'spore' ? 'xeno-pod' : 'xeno-cup' : b.id === 'wetland' && h.moisture > .7 ? 'reed' : h.forest > .35 && h.moisture > .55 && n() < .4 ? 'fern' : 'grass';
      plants.push({ x, y: y - .025, z, model, size: b.grassHeight * (.5 + n() * .85), width: .8 + n() * .4, variant: model === 'fern' ? 0 : Math.floor(n() * 2), rotation: n() * Math.PI * 2, tint: b.id === 'steppe' ? .85 + n() * .12 : .87 + n() * .2, color: !b.alien && (b.id === 'steppe' || b.id === 'tundra') ? '#d1c190' : null, rank: n() });
    }
  }
  for (let gz = -9; gz <= 9; gz++) for (let gx = -9; gx <= 9; gx++) {
    const n = planetRandom(planetSubseed(region.seed, `geology/${gx}/${gz}`)), x = (gx + n() - .5) * 40, z = (gz + n() - .5) * 40;
    const y = regionGroundHeight(region, x, z);
    if (colonyClearance(region, x, z) < 5 || Math.hypot(x, z) < 85 || Math.hypot(x, z) > 390 || n() > .42 || slopeAt(x, z) > .45 || regionWater(region, x, z, y)) continue;
    rocks.push({ id: `geology-${gx}/${gz}`, x, z, scale: .6 + n() ** 2 * 5, rotation: n() * Math.PI * 2, variant: Math.floor(n() * 3), model: module.rockModels[Math.floor(n() * module.rockModels.length)] });
  }
  // Stable random ranks avoid a directional cut when a dense region reaches
  // its mobile budget; detail changes cannot move rocks or the tree population.
  const bounded = (items, max) => { if (items.length > max) { items.sort((a, b) => a.rank - b.rank); items.length = max; } for (const p of items) delete p.rank; return items; };
  return { trees: bounded(trees, NATURAL_FLORA_BUDGET.trees), plants: bounded(plants, NATURAL_FLORA_BUDGET.plants), rocks };
}
