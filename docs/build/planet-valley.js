import { unzlibSync } from 'fflate';
import { VALLEY_DATA } from './planet-valley-data.js';

// Prepared terrain is decoded only when its valley is visited. Recipes contain
// the template ID, never mutable height arrays or renderer-dependent state.
export const VALLEY_VARIANTS = Object.freeze(VALLEY_DATA.map(({ id, name, description }) => Object.freeze({ id, name, description })));
const decoded = new Map();
export function valleyDefinition(region) {
  return region.preset === 'temperate' && region.module === 'basin' ? VALLEY_DATA.find(v => v.id === region.valley) ?? VALLEY_DATA[region.seed % VALLEY_DATA.length] : null;
}
function maps(v) {
  if (!decoded.has(v.id)) {
    const bytes = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
    const h = unzlibSync(bytes(v.packed)), height = new Uint16Array(v.mapSize ** 2), n = v.mapSize;
    if (h.length !== height.length * 2 + v.ecologySize ** 2 * 3) throw new Error('Unvollständige Tallandschaft.');
    const view = new DataView(h.buffer, h.byteOffset, h.byteLength);
    for (let i = 0; i < height.length; i++) {
      const x = i % n, z = Math.floor(i / n);
      height[i] = view.getInt16(i * 2, true) + (x ? height[i - 1] : 0) + (z ? height[i - n] : 0) - (x && z ? height[i - n - 1] : 0);
    }
    decoded.set(v.id, { height, ecology: h.subarray(height.length * 2) });
  }
  return decoded.get(v.id);
}
function sample(array, size, extent, x, z, channels = 1, channel = 0) {
  const u = Math.max(0, Math.min(size - 1, (x / extent + 1) * .5 * (size - 1)));
  const w = Math.max(0, Math.min(size - 1, (z / extent + 1) * .5 * (size - 1)));
  const ix = Math.min(size - 2, Math.floor(u)), iz = Math.min(size - 2, Math.floor(w)), a = u - ix, b = w - iz;
  const p = (iz * size + ix) * channels + channel;
  return (array[p] * (1 - a) + array[p + channels] * a) * (1 - b) + (array[p + size * channels] * (1 - a) + array[p + (size + 1) * channels] * a) * b;
}
export function valleyHeight(region, x, z) {
  const v = valleyDefinition(region);
  return sample(maps(v).height, v.mapSize, v.extent, x, z) / 100 - 16;
}
export function valleyEcology(region, x, z) {
  const v = valleyDefinition(region), { ecology } = maps(v);
  return {
    forest: sample(ecology, v.ecologySize, v.extent, x, z, 3, 0) / 255,
    moisture: sample(ecology, v.ecologySize, v.extent, x, z, 3, 1) / 255,
    sediment: sample(ecology, v.ecologySize, v.extent, x, z, 3, 2) / 255
  };
}
export function valleyRiver(region, z) {
  const v = valleyDefinition(region), f = Math.max(0, Math.min(v.river.length - 1, (z + v.extent) / 3));
  const i = Math.min(v.river.length - 2, Math.floor(f)), t = f - i, a = v.river[i], b = v.river[i + 1];
  const lerp = k => a[k] + (b[k] - a[k]) * t;
  const dx = (b[0] - a[0]) / 3;
  return { x: lerp(0), width: lerp(1) * Math.sqrt(1 + dx * dx), depth: 1.8, level: lerp(2), tangent: dx };
}
export function valleySite(region) {
  const v = valleyDefinition(region);
  return { name: v.site, description: v.description, roads: structuredClone(v.roads), pads: structuredClone(v.pads), tint: '#858677' };
}
