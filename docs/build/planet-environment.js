import { planetRandom, planetSubseed, regionGroundHeight, REGION_MODULES } from './planet-blueprint.js';

// Habitat is a reusable field, not a set of hand-placed objects for Nereid.
// Both the surface palette and ground cover use it, so the patches agree.
export function regionCover(region, x, z, height, slope = 0) {
  if (region.preset !== 'temperate' || region.module === 'regolith' || height < 1) return 0;
  const f = region.phase;
  const moisture = .5 + .23 * Math.sin(x * .037 + f + Math.sin(z * .024)) + .22 * Math.cos(z * .045 - f);
  const density = { coast: .95, basin: .3, upland: .8, caldera: .16 }[region.module];
  const shore = region.module === 'coast' ? Math.max(0, Math.min(1, (height - 2) / 2)) : 1;
  return Math.max(0, Math.min(1, (moisture - .23) * 1.65)) * density * shore * Math.max(0, 1 - slope * 2);
}

export function createRegionEnvironment(region) {
  const rocks = [], plants = [], module = REGION_MODULES[region.module];
  // Independent cell seeds make detail order and future chunk streaming safe.
  for (let gz = -5; gz <= 5; gz++) for (let gx = -5; gx <= 5; gx++) {
    const next = planetRandom(planetSubseed(region.seed, `environment/${gx}/${gz}`));
    const cx = gx * 64 + (next() - .5) * 36, cz = gz * 64 + (next() - .5) * 36;
    for (let i = 0; i < 3; i++) {
      const x = cx + (next() - .5) * 34, z = cz + (next() - .5) * 34, distance = Math.hypot(x, z);
      const scale = i === 0 ? 5 + next() * 13 : .9 + next() * 3;
      const rotation = next() * Math.PI * 2, variant = Math.floor(next() * 3), model = module.rockModels[Math.floor(next() * module.rockModels.length)];
      if (distance < 90 || distance > 360) continue;
      const height = regionGroundHeight(region, x, z), step = Math.max(2, scale * .55);
      const slope = Math.hypot(regionGroundHeight(region, x + step, z) - regionGroundHeight(region, x - step, z), regionGroundHeight(region, x, z + step) - regionGroundHeight(region, x, z - step)) / (2 * step);
      if (height < .5 || slope > .42) continue;
      rocks.push({ id: `environment-${gx}-${gz}-${i}`, x, z, scale, rotation, variant, model });
    }
    for (let patch = 0; patch < 3; patch++) {
      const px = cx + (next() - .5) * 50, pz = cz + (next() - .5) * 50;
      const height = regionGroundHeight(region, px, pz);
      const slope = Math.hypot(regionGroundHeight(region, px + 2, pz) - height, regionGroundHeight(region, px, pz + 2) - height) / 2;
      const cover = regionCover(region, px, pz, height, slope);
      if (next() > cover || Math.hypot(px, pz) > 330) continue;
      for (let i = 0; i < 24; i++) {
        const x = px + (next() - .5) * 18, z = pz + (next() - .5) * 18;
        const y = regionGroundHeight(region, x, z), size = .45 + next() * 1.2, rotation = next() * Math.PI * 2, tint = next();
        if (Math.hypot(x, z) < 24 || regionCover(region, x, z, y) < .08) continue;
        plants.push({ x, y: y - .03, z, size, rotation, tint });
      }
    }
  }
  return { rocks, plants };
}
