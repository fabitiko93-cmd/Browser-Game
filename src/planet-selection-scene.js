import * as THREE from 'three';
import { regionGroundHeight, regionWater } from './planet-blueprint.js';
import { PROBE_BUILDINGS, RESOURCE_TYPES, resourceFieldDensity } from './planet-resources.js';
import { createProbeHabitat } from './planet-construction-scene.js';
import { createProbeExtractor } from './planet-resource-scene.js';

export function resourceAt(region, x, z, preferred) {
  const fields = (region.resources ?? []).map(field => ({ field, density: resourceFieldDensity(region, field, x, z) })).filter(p => p.density > .002);
  fields.sort((a, b) => b.density - a.density || Number(b.field.type === preferred) - Number(a.field.type === preferred));
  return fields[0]?.field ?? null;
}

export function createBuildingPreview(region, type, footprint, foundation, blocked = false) {
  const group = new THREE.Group();
  if (!footprint || !Object.hasOwn(PROBE_BUILDINGS, type)) return group;
  const f = footprint, heights = [[f.minX, f.minZ], [f.minX, f.maxZ], [f.maxX, f.minZ], [f.maxX, f.maxZ]].map(([x, z]) => regionGroundHeight(region, x, z));
  const building = { type, footprint: f, foundation: foundation ?? { top: Math.max(...heights) + .12, bottom: Math.min(...heights) - .12 } };
  const model = type === 'habitat' ? createProbeHabitat(building) : createProbeExtractor(building), color = blocked ? '#ff8068' : '#8ee8d0';
  model.traverse(mesh => {
    if (!mesh.isMesh) return;
    mesh.castShadow = mesh.receiveShadow = false; mesh.renderOrder = 30;
    for (const material of [].concat(mesh.material)) { material.color.set(color); material.transparent = true; material.opacity = .34; material.depthWrite = material.depthTest = false; }
  });
  group.add(model);
  const positions = [], indices = [], steps = 4;
  for (let z = 0; z <= steps; z++) for (let x = 0; x <= steps; x++) {
    const px = f.minX + (f.maxX - f.minX) * x / steps, pz = f.minZ + (f.maxZ - f.minZ) * z / steps;
    positions.push(px, regionGroundHeight(region, px, pz) + .18, pz);
    if (x < steps && z < steps) { const a = z * (steps + 1) + x; indices.push(a, a + steps + 1, a + 1, a + 1, a + steps + 1, a + steps + 2); }
  }
  const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setIndex(indices);
  const floor = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .23, side: THREE.DoubleSide, depthTest: false, depthWrite: false, toneMapped: false }));
  floor.renderOrder = 29; group.add(floor);
  const volume = new THREE.Box3Helper(new THREE.Box3().setFromObject(model), color);
  Object.assign(volume.material, { transparent: true, opacity: .9, depthTest: false, depthWrite: false, toneMapped: false }); volume.renderOrder = 31; group.add(volume);
  group.userData.footprint = { ...f }; group.userData.type = type;
  return group;
}

// The selected deposit uses its actual density function, including the tail
// beyond the nominal outline. It is independent of the construction square.
export function createResourceSelection(region, field) {
  const group = new THREE.Group(); if (!field) return group;
  const extent = Math.max(field.rx ?? field.radius, field.rz ?? field.radius) * 1.66, steps = Math.ceil(extent), vertices = [], densities = [], wet = [], colors = [];
  const base = new THREE.Color(RESOURCE_TYPES[field.type].color), tiers = [.28, .52, .78, 1].map(v => base.clone().multiplyScalar(v).lerp(new THREE.Color('#ffffff'), v === 1 ? .35 : 0));
  for (let z = 0; z <= steps; z++) for (let x = 0; x <= steps; x++) {
    const px = field.x - extent + x * extent * 2 / steps, pz = field.z - extent + z * extent * 2 / steps, y = regionGroundHeight(region, px, pz);
    const density = resourceFieldDensity(region, field, px, pz) / (field.strength ?? 1);
    vertices.push(px, y + .21, pz); densities.push(density); wet.push(regionWater(region, px, pz, y));
    tiers[density >= .75 ? 3 : density >= .5 ? 2 : density >= .25 ? 1 : 0].toArray(colors, colors.length);
  }
  const indices = [], width = steps + 1;
  for (let z = 0; z < steps; z++) for (let x = 0; x < steps; x++) {
    const a = z * width + x;
    for (const triangle of [[a, a + width, a + 1], [a + 1, a + width, a + width + 1]]) if (triangle.some(i => densities[i] > 0) && !triangle.some(i => wet[i])) indices.push(...triangle);
  }
  const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)).setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); geometry.setIndex(indices);
  const fill = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: .48, side: THREE.DoubleSide, depthTest: false, depthWrite: false, toneMapped: false })); fill.renderOrder = 20; group.add(fill);
  // Contours make the steps readable even over dense vegetation.
  for (const level of [.01, .25, .5, .75]) {
    const points = [], c = Math.cos(field.rotation ?? 0), s = Math.sin(field.rotation ?? 0);
    for (let i = 0; i <= 128; i++) {
      const angle = i / 128 * Math.PI * 2; let lo = 0, hi = 1.66;
      const at = r => { const u = Math.cos(angle) * (field.rx ?? field.radius) * r, v = Math.sin(angle) * (field.rz ?? field.radius) * r; return [field.x + u * c - v * s, field.z + u * s + v * c]; };
      for (let j = 0; j < 15; j++) { const mid = (lo + hi) / 2, [x, z] = at(mid); if (resourceFieldDensity(region, field, x, z) / (field.strength ?? 1) > level) lo = mid; else hi = mid; }
      const [x, z] = at((lo + hi) / 2), y = regionGroundHeight(region, x, z); points.push({ x, y: y + .25, z, wet: regionWater(region, x, z, y) });
    }
    const segments = [];
    for (let i = 1; i < points.length; i++) if (!points[i - 1].wet && !points[i].wet) for (const p of [points[i - 1], points[i]]) segments.push(p.x, p.y, p.z);
    const line = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(segments, 3)), new THREE.LineBasicMaterial({ color: tiers[level >= .75 ? 3 : level >= .5 ? 2 : 1], transparent: true, opacity: .9, depthTest: false, depthWrite: false, toneMapped: false })); line.renderOrder = 21; group.add(line);
  }
  group.userData.fieldId = field.id; group.userData.extent = extent; return group;
}
