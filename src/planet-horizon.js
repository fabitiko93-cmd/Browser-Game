import { BufferGeometry, Float32BufferAttribute, Color } from 'three';
import { regionTerrainPatches, regionHeight, regionShore } from './planet-blueprint.js';
import { regionBiome } from './planet-biomes.js';

export const REGION_HORIZON_EXTENT = 3400;

// Reuse every boundary vertex of the actual outer patches, including their
// unequal segment sizes. No T-junctions and no changes to the playable surface.
export function regionHorizonGeometry(region) {
  const patches = regionTerrainPatches(region), edge = Math.max(...patches.map(p => p.maxX));
  const xs = new Set(), zs = new Set();
  for (const p of patches) {
    if (p.minZ === -edge) for (let i = 0; i <= p.segmentsX; i++) xs.add(Math.fround(p.minX + (p.maxX - p.minX) * i / p.segmentsX));
    if (p.maxX === edge) for (let i = 0; i <= p.segmentsZ; i++) zs.add(Math.fround(p.minZ + (p.maxZ - p.minZ) * i / p.segmentsZ));
  }
  const x = [...xs].sort((a, b) => a - b), z = [...zs].sort((a, b) => a - b);
  const loop = [...x.slice(0, -1).map(v => [v, -edge]), ...z.slice(0, -1).map(v => [edge, v]), ...x.slice(1).reverse().map(v => [v, edge]), ...z.slice(1).reverse().map(v => [-edge, v])];
  const rings = [edge, 1250, 1750, 2450, REGION_HORIZON_EXTENT], positions = [], colors = [], indices = [];
  const biome = regionBiome(region), phase = region.phase, base = new Color(biome?.meadow ?? '#927f69'), snow = new Color('#bdc8c9');
  for (let ring = 0; ring < rings.length; ring++) for (const [bx, bz] of loop) {
    const scale = rings[ring] / edge, px = Math.fround(bx * scale), pz = Math.fround(bz * scale);
    const t = Math.min(1, (rings[ring] - edge) / 1200), blend = t * t * (3 - 2 * t);
    const wave = .5 + .5 * Math.sin(px * .0018 + phase) * Math.cos(pz * .0013 - phase);
    const mountain = region.module === 'upland', coastal = region.module === 'coast';
    let far = (mountain ? 75 : coastal ? 12 : 30) + wave * (mountain ? 230 : coastal ? 35 : 70);
    if (coastal && px < regionShore(region, pz)) far = -8;
    const height = regionHeight(region, bx, bz) * (1 - blend) + far * blend;
    positions.push(px, height, pz);
    const c = base.clone().multiplyScalar(.76 + wave * .23);
    if (mountain) c.lerp(snow, Math.max(0, Math.min(1, (height - (biome?.snowLine ?? 190)) / 45)));
    c.toArray(colors, colors.length);
    if (ring < rings.length - 1) {
      const i = positions.length / 3 - 1, next = ring * loop.length + (i + 1) % loop.length, outer = i + loop.length, outerNext = next + loop.length;
      indices.push(i, next, outer, next, outerNext, outer);
    }
  }
  const geometry = new BufferGeometry(); geometry.setAttribute('position', new Float32BufferAttribute(positions, 3)); geometry.setAttribute('color', new Float32BufferAttribute(colors, 3)); geometry.setIndex(indices); geometry.computeVertexNormals(); geometry.computeBoundingSphere();
  geometry.userData.innerVertexCount = loop.length;
  return geometry;
}
