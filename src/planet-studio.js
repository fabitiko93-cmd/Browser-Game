import { PLANET_EXAMPLES } from './planet-examples.js';
import { CLIMATE_BIOMES } from './planet-climate.js';
import { regionOverviewPose, constrainRegionCamera } from './planet-camera.js';
import { regionGroundHeight } from './planet-blueprint.js';

// These are photographic adjustments to the existing scene, not new planet
// types. Never alter terrain, ecology, deposits or construction identities.
export const STUDIO_LOOKS = Object.freeze({
  natural: { name: 'Natürlich', exposure: 1, fill: 1, haze: 1, detail: 1 },
  soft: { name: 'Weich', exposure: 1.03, fill: 1.25, haze: 1.18, detail: .8 },
  clear: { name: 'Klar', exposure: .98, fill: .82, haze: .65, detail: 1.25 }
});
export const STUDIO_CONTROLS = Object.freeze({
  exposure: { name: 'Belichtung', min: .7, max: 1.3 },
  fill: { name: 'Umgebungslicht', min: .5, max: 1.5 },
  haze: { name: 'Dunst', min: .35, max: 1.8 },
  detail: { name: 'Bodendetails', min: .35, max: 1.6 }
});
export const STUDIO_CAMERAS = Object.freeze({ overview: 'Übersicht', colony: 'Baugebiet', ground: 'Bodennähe' });
export const STUDIO_SCENES = Object.freeze([
  ...PLANET_EXAMPLES.map(example => ({ ...example, id: example.biome, name: CLIMATE_BIOMES[example.biome].name, preset: 'temperate', biosphere: 'terran', regions: 5 })),
  { id: 'arid', name: 'Trockene Welt', seed: 42, preset: 'arid', region: 'region-0', regions: 5, climate: 'auto', biosphere: 'terran' },
  { id: 'lunar', name: 'Luftloses Gestein', seed: 42, preset: 'lunar', region: 'region-0', regions: 5, climate: 'auto', biosphere: 'terran' }
]);
const keys = ['studio', 'look', 'shot', 'pose', ...Object.keys(STUDIO_CONTROLS).map(key => `look-${key}`)];
const rounded = value => Math.round(value * 1e6) / 1e6;

export function normalizeStudioValues(values = {}, look = 'natural') {
  const fallback = STUDIO_LOOKS[look] ?? STUDIO_LOOKS.natural;
  return Object.fromEntries(Object.entries(STUDIO_CONTROLS).map(([key, { min, max }]) => {
    const n = values[key] == null || values[key] === '' ? fallback[key] : Number(values[key]);
    return [key, rounded(Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback[key])];
  }));
}

export function normalizeStudioPose(value) {
  const pose = typeof value === 'string' ? value.split(',').map(Number) : value;
  if (!Array.isArray(pose) || pose.length !== 7 || !pose.every(Number.isFinite)) return null;
  if (pose.slice(0, 6).some(n => Math.abs(n) > 2000) || Math.abs(pose[3]) > 88 || Math.abs(pose[5]) > 88 || pose[6] < 28 || pose[6] > 75) return null;
  const distance = Math.hypot(pose[0] - pose[3], pose[1] - pose[4], pose[2] - pose[5]);
  return distance >= 3 && distance <= 1000 ? pose.map(rounded) : null;
}

export function readStudioSettings(parameters) {
  const look = Object.hasOwn(STUDIO_LOOKS, parameters.get('look')) ? parameters.get('look') : parameters.get('look') === 'custom' ? 'custom' : 'natural';
  const shot = Object.hasOwn(STUDIO_CAMERAS, parameters.get('shot')) || parameters.get('shot') === 'free' ? parameters.get('shot') : 'overview';
  const values = Object.fromEntries(Object.keys(STUDIO_CONTROLS).map(key => [key, parameters.get(`look-${key}`)]));
  return { active: parameters.get('studio') === '1', look, shot, values: normalizeStudioValues(values, look), pose: normalizeStudioPose(parameters.get('pose')) };
}

export function studioURL(input, settings) {
  const url = new URL(input);
  for (const key of keys) url.searchParams.delete(key);
  if (!settings.active) return url;
  const look = Object.hasOwn(STUDIO_LOOKS, settings.look) ? settings.look : 'custom';
  url.searchParams.set('studio', '1'); url.searchParams.set('look', look);
  url.searchParams.set('shot', Object.hasOwn(STUDIO_CAMERAS, settings.shot) || settings.shot === 'free' ? settings.shot : 'overview');
  for (const [key, value] of Object.entries(normalizeStudioValues(settings.values, look))) url.searchParams.set(`look-${key}`, String(value));
  const pose = normalizeStudioPose(settings.pose); if (pose) url.searchParams.set('pose', pose.join(','));
  return url;
}

export function studioCameraPose(region, shot = 'overview') {
  if (shot !== 'colony' && shot !== 'ground') return regionOverviewPose(region);
  const target = { x: 0, y: regionGroundHeight(region, 0, 0) + 3.5, z: 0 };
  const offset = shot === 'ground' ? [24, 12, 28] : [75, 70, 95];
  const eye = { x: target.x + offset[0], y: target.y + offset[1], z: target.z + offset[2] };
  constrainRegionCamera(region, eye, target);
  return { eye, target, fov: shot === 'ground' ? 48 : 43 };
}

export function poseArray({ eye, target, fov }) { return normalizeStudioPose([eye.x, eye.y, eye.z, target.x, target.y, target.z, fov]); }
export function poseFromArray(pose) { return { eye: { x: pose[0], y: pose[1], z: pose[2] }, target: { x: pose[3], y: pose[4], z: pose[5] }, fov: pose[6] }; }
