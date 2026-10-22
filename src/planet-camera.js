import { valleyDefinition } from './planet-valley.js';
import { regionGroundHeight, REGION_BUILD_GRID } from './planet-blueprint.js';

const heightAround = (region, x, z) => Math.max(
  regionGroundHeight(region, x, z),
  regionGroundHeight(region, x - 1.5, z - 1.5), regionGroundHeight(region, x + 1.5, z - 1.5),
  regionGroundHeight(region, x - 1.5, z + 1.5), regionGroundHeight(region, x + 1.5, z + 1.5)
);

// Move eye and orbit target together: selecting a tile is a pan, preserving
// the user's zoom and viewing angle. Ground clearance is applied separately.
export function stepRegionFocus(focus, eye, target, delta) {
  focus.elapsed = Math.min(focus.duration, focus.elapsed + Math.max(0, delta));
  const t = focus.elapsed / focus.duration, eased = t * t * (3 - 2 * t);
  const x = focus.startX + (focus.x - focus.startX) * eased, z = focus.startZ + (focus.z - focus.startZ) * eased;
  eye.x += x - target.x; eye.z += z - target.z; target.x = x; target.z = z;
  return t >= 1;
}

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

// One shared portrait overview for the runtime and the independent scene review.
export function regionOverviewPose(region) {
  const centers = { coast: [-8, -20], basin: [-10, -15], upland: [0, -35], caldera: [-10, -55], regolith: [0, 0], plain: [0, -20], lake: [-15, -45] };
  const offsets = { coast: [-160, 145, 230], basin: [170, 150, 220], upland: [160, 85, 260], caldera: [160, 190, 210], regolith: [70, 85, 105], plain: [135, 105, 230], lake: [150, 130, 250] };
  const valley = valleyDefinition(region), [x, z] = valley?.target ?? centers[region.module], offset = valley?.camera ?? offsets[region.module];
  const factor = Math.min(1, (valley ? 500 : region.preset === 'temperate' ? 340 : 230) / Math.hypot(...offset));
  const target = { x, y: regionGroundHeight(region, x, z) + 3.5, z };
  const eye = { x: x + offset[0] * factor, y: target.y + offset[1] * factor, z: z + offset[2] * factor };
  const fov = valley ? 55 : region.preset === 'temperate' && region.module === 'upland' ? 60 : 43;
  if (region.preset !== 'lunar') {
    // Keep a small strip of sky in the portrait overview while retaining the
    // original target and distance. The player can still orbit down to build.
    const horizontal = Math.hypot(eye.x - x, eye.z - z), distance = Math.hypot(horizontal, eye.y - target.y);
    const pitch = Math.min(Math.atan2(eye.y - target.y, horizontal), (fov / 2 - 5) * Math.PI / 180);
    const scale = distance * Math.cos(pitch) / horizontal;
    eye.x = x + (eye.x - x) * scale; eye.z = z + (eye.z - z) * scale; eye.y = target.y + distance * Math.sin(pitch);
  }
  constrainRegionCamera(region, eye, target);
  return { eye, target, fov };
}
