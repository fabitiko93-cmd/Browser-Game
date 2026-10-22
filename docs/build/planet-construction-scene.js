import * as THREE from 'three';
import { clearedObject } from './planet-construction.js';
import { regionGroundHeight } from './planet-blueprint.js';

export const footprintBounds = box => ({ minX: box.min.x, minY: box.min.y, minZ: box.min.z, maxX: box.max.x, maxY: box.max.y, maxZ: box.max.z });

export function indexConstructionObjects(group, region) {
  const indexed = new Map();
  group.traverse(mesh => {
    for (const o of mesh.userData.constructionObjects ?? []) {
      if (!indexed.has(o.id)) indexed.set(o.id, { ...o, bounds: { ...o.bounds } });
      else {
        const b = indexed.get(o.id).bounds;
        for (const key of ['minX', 'minY', 'minZ']) b[key] = Math.min(b[key], o.bounds[key]);
        for (const key of ['maxX', 'maxY', 'maxZ']) b[key] = Math.max(b[key], o.bounds[key]);
      }
    }
  });
  for (const o of indexed.values()) if (o.kind === 'stone') {
    const b = o.bounds, exposed = b.maxY - regionGroundHeight(region, (b.minX + b.maxX) / 2, (b.minZ + b.maxZ) / 2);
    o.removable = Math.max(b.maxX - b.minX, b.maxZ - b.minZ) <= 3 && exposed <= 2;
  }
  group.traverse(mesh => { for (const o of mesh.userData.constructionObjects ?? []) { const full = indexed.get(o.id); o.bounds = full.bounds; o.removable = full.removable; } });
  return [...indexed.values()];
}

// Compact each existing GPU batch instead of deleting its chunk. The same
// matrices survive camera LOD changes; untouched neighbouring plants stay put.
export function applyConstructionClearings(group, state) {
  group.traverse(mesh => {
    const objects = mesh.userData.constructionObjects; if (!objects) return;
    let count = 0;
    for (const o of objects) if (!clearedObject(o, state.clearings)) { mesh.setMatrixAt(count, o.matrix); mesh.setColorAt(count, o.color); count++; }
    mesh.count = count; mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    if (count) { mesh.computeBoundingSphere(); if (mesh.userData.floraLods) mesh.boundingSphere.radius += 4; }
  });
}

export function createProbeHabitat(building) {
  const group = new THREE.Group(), f = building.footprint, top = building.foundation.top;
  group.position.set((f.minX + f.maxX) / 2, top, (f.minZ + f.maxZ) / 2); group.userData.buildingId = building.id;
  const materials = Object.fromEntries(Object.entries({ foundation: '#767b78', shell: '#c2c6bc', roof: '#56656b', glass: '#70a7ae', solar: '#152f43', trim: '#db9654', dark: '#28383e' }).map(([k, color]) => [k, new THREE.MeshStandardMaterial({ color, roughness: k === 'glass' ? .27 : .8, metalness: k === 'solar' ? .25 : .08 })]));
  const parts = new Map();
  const box = (material, x, y, z, w, h, d) => { if (!parts.has(material)) parts.set(material, []); parts.get(material).push([x, y, z, w, h, d]); };
  const depth = top - building.foundation.bottom;
  box('foundation', 0, -depth / 2, 0, 8, depth, 8);
  box('dark', 0, .1, 0, 7.6, .2, 7.6);
  for (const x of [-1.85, 1.85]) {
    box('shell', x, 1.5, 0, 3.15, 2.6, 5.7); box('roof', x, 2.88, 0, 3.35, .2, 5.9);
    box('trim', x, .54, 2.87, 3.1, .16, .09);
    for (const z of [-1.9, -.7, .7, 1.9]) {
      box('glass', x < 0 ? -3.44 : 3.44, 1.65, z, .08, .68, .78);
      box('dark', x, 3.04, z, 2.8, .12, .94); box('solar', x, 3.13, z, 2.65, .08, .82);
    }
  }
  box('shell', 0, 1.2, .4, 1.1, 2.1, 3.8); box('dark', 0, 1.18, 2.32, .9, 1.92, .1);
  box('glass', 0, 1.64, 2.39, .62, .48, .06); box('trim', 0, 2.24, 2.42, 1.12, .13, .18);
  box('roof', 0, .14, 2.95, 1.5, .28, 1.1);
  const geometry = new THREE.BoxGeometry(1, 1, 1), object = new THREE.Object3D();
  for (const [material, instances] of parts) {
    const mesh = new THREE.InstancedMesh(geometry, materials[material], instances.length); mesh.castShadow = true; mesh.receiveShadow = true;
    instances.forEach(([x, y, z, w, h, d], i) => { object.position.set(x, y, z); object.scale.set(w, h, d); object.updateMatrix(); mesh.setMatrixAt(i, object.matrix); });
    mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); group.add(mesh);
  }
  return group;
}
