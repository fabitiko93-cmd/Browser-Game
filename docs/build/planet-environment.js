import { valleyDefinition, valleyEcology } from './planet-valley.js';
import { regionBiome } from './planet-biomes.js';
import { colonyClearance } from './planet-colony.js';
import { planetRandom, planetSubseed, regionGroundHeight, regionNoise, regionCreek, regionLake, REGION_MODULES } from './planet-blueprint.js';

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = (a, b, value) => { const t = clamp((value - a) / (b - a)); return t * t * (3 - 2 * t); };
export const FLORA_ASSETS = Object.freeze({ pine: 'woodland-pine.glb', oak: 'woodland-oak.glb', aspen: 'woodland-aspen.glb', shrub: 'woodland-shrub.glb', fern: 'fern.glb', grass: 'meadow-grass.glb' });

// These shared, continuous fields drive trees, understory and the ground blend.
// Meadow clearings are irregular gaps in woodland, never a circular prop ring.
export function regionHabitat(region, x, z, height, slope = 0) {
  const biome = regionBiome(region);
  if (!biome) return { cover: 0, forest: 0, moisture: 0, snow: 0 };
  const creek = regionCreek(region, z), lake = regionLake(region);
  if (valleyDefinition(region)) {
    const e = valleyEcology(region, x, z), distance = Math.abs(x - creek.x) / Math.sqrt(1 + creek.tangent ** 2);
    const wet = distance < creek.width / Math.sqrt(1 + creek.tangent ** 2) + 1 && height < creek.level + .2;
    const bank = smooth(creek.level + .08, creek.level + .65, height);
    const sediment = Math.max(e.sediment, (1 - bank) * .8);
    const cover = wet ? 0 : (1 - sediment * .96) * (1 - smooth(.5, .95, slope));
    const forest = e.forest * (wet ? 0 : 1) * smooth(creek.level + .4, creek.level + 1.5, height) * smooth(4, 11, colonyClearance(region, x, z));
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
  const rocks = [], plants = [], trees = [], module = REGION_MODULES[region.module], biome = regionBiome(region);
  const slopeAt = (x, z, span = 2) => Math.hypot(regionGroundHeight(region, x + span, z) - regionGroundHeight(region, x - span, z), regionGroundHeight(region, x, z + span) - regionGroundHeight(region, x, z - span)) / (span * 2);
  const occupied = new Map(), valley = !!valleyDefinition(region), grid = valley ? region.valley === 'woodland' ? 10.2 : 9.5 : 11, count = valley ? 66 : 32;
  if (biome) for (let gz = -count; gz <= count; gz++) for (let gx = -count; gx <= count; gx++) {
    const next = planetRandom(planetSubseed(region.seed, `woodland/${gx}/${gz}`));
    const x = (gx + (next() - .5) * .98) * grid, z = (gz + (next() - .5) * .98) * grid;
    const y = regionGroundHeight(region, x, z), slope = slopeAt(x, z), h = regionHabitat(region, x, z, y, slope);
    const distance = Math.hypot(x, z), density = valley ? .97 * (1 - smooth(450, 620, distance)) : .66;
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
    if (ph.forest > .3 && next() < .08) plants.push({ x: px, y: py - .025, z: pz, size: .9 + next() * 1.2, width: 1, model: 'shrub', variant: Math.floor(next() * 2), rotation: next() * Math.PI * 2, tint: .9 + next() * .15 });
    // Meadows use dense, small grass clumps. Shade shifts toward ferns, with
    // a little green understory remaining beneath the mature tree crowns.
    const count = Math.round(4 + (1 - ph.forest) * (valley ? 9 : 7));
    for (let i = 0; i < count; i++) {
      const x = px + (next() - .5) * 8, z = pz + (next() - .5) * 8;
      const y = regionGroundHeight(region, x, z), h = regionHabitat(region, x, z, y, slopeAt(x, z));
      if (y < 1.4 || colonyClearance(region, x, z) < 2.8 || next() > h.cover * (.9 - h.forest * .35)) continue;
      const fern = region.module !== 'caldera' && region.module !== 'upland' && h.forest > .25 && h.moisture > .4 && next() < h.forest * .6;
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
