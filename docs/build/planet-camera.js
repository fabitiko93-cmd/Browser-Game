import { regionGroundHeight, REGION_BUILD_GRID } from './planet-blueprint.js';

const heightAround = (region, x, z) => Math.max(
  regionGroundHeight(region, x, z),
  regionGroundHeight(region, x - 1.5, z - 1.5), regionGroundHeight(region, x + 1.5, z - 1.5),
  regionGroundHeight(region, x - 1.5, z + 1.5), regionGroundHeight(region, x + 1.5, z + 1.5)
);

// Follow the rendered surface while panning. Then raise the eye enough that
// both its near-plane footprint and the sightline clear intervening ridges.
// This also runs after zoom/reset and before picking, not only on drag events.
export function constrainRegionCamera(region, eye, target) {
  const limit = REGION_BUILD_GRID.halfExtent + 24;
  const x = Math.max(-limit, Math.min(limit, target.x)), z = Math.max(-limit, Math.min(limit, target.z));
  const y = heightAround(region, x, z) + 3.5;
  eye.x += x - target.x; eye.y += y - target.y; eye.z += z - target.z;
  target.x = x; target.y = y; target.z = z;
  const dx = eye.x - x, dz = eye.z - z, steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 2));
  let safeY = Math.max(eye.y, heightAround(region, eye.x, eye.z) + 3);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, ground = heightAround(region, x + dx * t, z + dz * t);
    safeY = Math.max(safeY, y + (ground + 2.5 - y) / t);
  }
  eye.y = safeY;
}
