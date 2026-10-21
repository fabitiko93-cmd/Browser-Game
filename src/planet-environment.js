import { planetRandom, planetSubseed, regionGroundHeight, regionNoise, REGION_MODULES } from './planet-blueprint.js';

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = (a, b, value) => { const t = clamp((value - a) / (b - a)); return t * t * (3 - 2 * t); };
export const FLORA_ASSETS = Object.freeze({ pine: 'pine-young.glb', fir: 'fir-young.glb', fern: 'fern.glb', grass: 'meadow-grass.glb' });

// These shared, continuous fields drive trees, understory and the ground blend.
// Meadow clearings are irregular gaps in woodland, never a circular prop ring.
export function regionHabitat(region, x, z, height, slope = 0) {
  if (region.preset !== 'temperate' || region.module === 'regolith') return { cover: 0, forest: 0, moisture: 0 };
  const moisture = regionNoise(region.seed, x / 130, z / 130, 31) * .7 + regionNoise(region.seed, x / 47, z / 47, 32) * .3;
  const shore = region.module === 'coast' ? smooth(1.3, 3.1, height) : 1;
  const cover = shore * (1 - smooth(.25, .7, slope));
  const woodland = regionNoise(region.seed, x / 170 + 3.7, z / 170 - 8.1, 41) * .65
    + regionNoise(region.seed, x / 62, z / 62, 42) * .35;
  // A broad meadow through the valley/terrace leaves room for the first colony.
  const meadow = 1 - smooth(12, 45, Math.abs(x - z * .26 + (regionNoise(region.seed, 0, z / 160, 43) - .5) * 28));
  const density = { coast: .9, basin: .74, upland: 1, caldera: .63 }[region.module];
  const forest = smooth(.36, .68, woodland + moisture * .12 - meadow * .25) * cover * density;
  return { cover, forest, moisture };
}
export function regionCover(region, x, z, height, slope = 0) { return regionHabitat(region, x, z, height, slope).cover; }

export function createRegionEnvironment(region) {
  const rocks = [], plants = [], trees = [], module = REGION_MODULES[region.module];
  const slopeAt = (x, z, span = 2) => Math.hypot(regionGroundHeight(region, x + span, z) - regionGroundHeight(region, x - span, z), regionGroundHeight(region, x, z + span) - regionGroundHeight(region, x, z - span)) / (span * 2);
  // Jittered sampling avoids rows while limiting density and overlap. Seeds are
  // per cell, so traversal order cannot change a future streamed environment.
  const occupied = new Map();
  for (let gz = -17; gz <= 17; gz++) for (let gx = -17; gx <= 17; gx++) {
    const next = planetRandom(planetSubseed(region.seed, `woodland/${gx}/${gz}`));
    const x = (gx + (next() - .5) * .95) * 20, z = (gz + (next() - .5) * .95) * 20;
    const y = regionGroundHeight(region, x, z), slope = slopeAt(x, z), habitat = regionHabitat(region, x, z, y, slope);
    if (next() > habitat.forest * .65 || y < 1.4 || slope > .3 || Math.hypot(x, z) > 340) continue;
    const mature = next() < smooth(80, 180, Math.hypot(x, z)) * .92;
    const size = mature ? 12 + next() * 10 : 2.2 + next() ** .7 * 4, width = .8 + next() * .36;
    let overlap = false;
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
      const other = occupied.get(`${gx + dx}/${gz + dz}`);
      if (other && Math.hypot(x - other.x, z - other.z) < (size + other.size) * .29) overlap = true;
    }
    if (overlap) continue;
    const tree = { x, y: y - .12, z, size, width, model: mature ? 'forest' : next() < .72 ? 'pine' : 'fir', variant: Math.floor(next() * 2), rotation: next() * Math.PI * 2, tint: .88 + next() * .16 };
    occupied.set(`${gx}/${gz}`, tree); trees.push(tree);
  }
  for (let gz = -7; gz <= 7; gz++) for (let gx = -7; gx <= 7; gx++) {
    const next = planetRandom(planetSubseed(region.seed, `ground-cover/${gx}/${gz}`));
    for (let i = 0; i < 24; i++) {
      const x = (gx + next() - .5) * 26, z = (gz + next() - .5) * 26;
      const y = regionGroundHeight(region, x, z), slope = slopeAt(x, z), h = regionHabitat(region, x, z, y, slope);
      if (next() > h.cover * .68 || y < 1.4 || slope > .35 || Math.hypot(x, z) > 195) continue;
      const fern = h.forest > .2 && h.moisture > .35 && next() < h.forest * .7;
      plants.push({ x, y: y - .025, z, model: fern ? 'fern' : 'grass', size: fern ? .45 + next() * .6 : .24 + next() ** 2 * .48, width: .85 + next() * .3, rotation: next() * Math.PI * 2, variant: Math.floor(next() * 2), tint: .9 + next() * .17 });
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
