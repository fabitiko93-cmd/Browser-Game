import { regionBiome } from './planet-biomes.js';
import { planetRandom, planetSubseed, regionGroundHeight, regionNoise, regionCreek, REGION_MODULES } from './planet-blueprint.js';

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = (a, b, value) => { const t = clamp((value - a) / (b - a)); return t * t * (3 - 2 * t); };
export const FLORA_ASSETS = Object.freeze({ pine: 'woodland-pine.glb', oak: 'woodland-oak.glb', aspen: 'woodland-aspen.glb', shrub: 'woodland-shrub.glb', fern: 'fern.glb', grass: 'meadow-grass.glb' });

// These shared, continuous fields drive trees, understory and the ground blend.
// Meadow clearings are irregular gaps in woodland, never a circular prop ring.
export function regionHabitat(region, x, z, height, slope = 0) {
  const biome = regionBiome(region);
  if (!biome) return { cover: 0, forest: 0, moisture: 0 };
  const moisture = .25 + regionNoise(region.seed, x / 120, z / 120, 31) * .5 + regionNoise(region.seed, x / 38, z / 38, 32) * .25;
  const shore = region.module === 'coast' ? smooth(.65, 2.4, height) : 1;
  const creek = regionCreek(region, z);
  const bank = creek ? smooth(creek.width * 1.05, creek.width + 3, Math.abs(x - creek.x)) : 1;
  const cover = shore * bank * (1 - smooth(.4, .95, slope));
  const woodland = regionNoise(region.seed, x / 88 + 3.7, z / 88 - 8.1, 41) * .65
    + regionNoise(region.seed, x / 32, z / 32, 42) * .35;
  // Small irregular glades, rather than a huge, empty strip through every
  // region. Vegetation can later be cleared for individual building footprints.
  const gladeX = x + (regionNoise(region.seed, 0, z / 75, 43) - .5) * 22;
  const glade = (1 - smooth(12, 33, Math.abs(gladeX))) * (1 - smooth(15, 45, Math.abs(z)));
  const forest = smooth(.28, .64, woodland + (biome.forest - .55) * .42 - glade * .48) * cover;
  return { cover, forest, moisture };
}
export function regionCover(region, x, z, height, slope = 0) { return regionHabitat(region, x, z, height, slope).cover; }

export function createRegionEnvironment(region) {
  const rocks = [], plants = [], trees = [], module = REGION_MODULES[region.module], biome = regionBiome(region);
  const slopeAt = (x, z, span = 2) => Math.hypot(regionGroundHeight(region, x + span, z) - regionGroundHeight(region, x - span, z), regionGroundHeight(region, x, z + span) - regionGroundHeight(region, x, z - span)) / (span * 2);
  const occupied = new Map();
  if (biome) for (let gz = -32; gz <= 32; gz++) for (let gx = -32; gx <= 32; gx++) {
    const next = planetRandom(planetSubseed(region.seed, `woodland/${gx}/${gz}`));
    const x = (gx + (next() - .5) * .98) * 11, z = (gz + (next() - .5) * .98) * 11;
    const y = regionGroundHeight(region, x, z), slope = slopeAt(x, z), h = regionHabitat(region, x, z, y, slope);
    if (h.forest < .06 || next() > h.forest * .66 || y < 1.5 || slope > .38 || Math.hypot(x, z) > 350) continue;
    const model = biome.trees[Math.floor(next() * biome.trees.length)], young = next() < .18;
    const size = (model === 'pine' ? 10 + next() * 8 : model === 'aspen' ? 9 + next() * 7 : 8 + next() * 6) * (young ? .5 : 1);
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
    if (py < 1.4 || ph.cover < .5 || Math.hypot(px, pz) > 180) continue;
    if (ph.forest > .3 && next() < .08) plants.push({ x: px, y: py - .025, z: pz, size: .9 + next() * 1.2, width: 1, model: 'shrub', variant: Math.floor(next() * 2), rotation: next() * Math.PI * 2, tint: .9 + next() * .15 });
    // Meadows use dense, small grass clumps. Shade shifts toward ferns, with
    // a little green understory remaining beneath the mature tree crowns.
    const count = Math.round(4 + (1 - ph.forest) * 7);
    for (let i = 0; i < count; i++) {
      const x = px + (next() - .5) * 8, z = pz + (next() - .5) * 8;
      const y = regionGroundHeight(region, x, z), h = regionHabitat(region, x, z, y, slopeAt(x, z));
      if (y < 1.4 || next() > h.cover * (.9 - h.forest * .35)) continue;
      const fern = h.forest > .25 && h.moisture > .4 && next() < h.forest * .6;
      plants.push({ x, y: y - .025, z, model: fern ? 'fern' : 'grass', size: fern ? .45 + next() * .6 : biome.grassHeight * (.5 + next() * .75), width: .9 + next() * .3, rotation: next() * Math.PI * 2, variant: fern ? 0 : next() < .92 ? 1 : 0, tint: .9 + next() * .18 });
    }
  }
  for (let gz = -7; gz <= 7; gz++) for (let gx = -7; gx <= 7; gx++) {
    const next = planetRandom(planetSubseed(region.seed, `outcrops/${gx}/${gz}`));
    const cx = (gx + next() - .5) * 46, cz = (gz + next() - .5) * 46;
    const exposure = regionNoise(region.seed, cx / 85, cz / 85, 73);
    for (let i = 0; i < 3; i++) {
      const x = cx + (next() - .5) * 17, z = cz + (next() - .5) * 17;
      if (Math.hypot(x, z) < 95 || Math.hypot(x, z) > 360 || next() > .35 + exposure * .48) continue;
      if (regionGroundHeight(region, x, z) < .6 || slopeAt(x, z, 5) > .38) continue;
      rocks.push({ id: `environment-${gx}-${gz}-${i}`, x, z, scale: i === 0 ? 2 + next() * 5 : .65 + next() * 1.8, rotation: next() * Math.PI * 2, variant: Math.floor(next() * 3), model: module.rockModels[Math.floor(next() * module.rockModels.length)] });
    }
  }
  return { rocks, plants, trees };
}
