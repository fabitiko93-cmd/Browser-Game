import * as THREE from 'three';
export const TREE_CHUNK_SIZE = 160;

// The prepared meshes are one metre high, rooted at y=0. Tree transforms stay
// upright on gentle slopes; terrain is never used to warp a trunk or building.
export function floraMatrix(plant) {
  const object = new THREE.Object3D();
  object.position.set(plant.x, plant.y, plant.z); object.rotation.y = plant.rotation;
  object.scale.set(plant.size * plant.width, plant.size, plant.size * plant.width); object.updateMatrix();
  return object.matrix;
}

export function readFloraVariants(gltf, anisotropy) {
  gltf.scene.updateMatrixWorld(true);
  return gltf.scene.children.map(root => {
    const meshes = [];
    root.traverse(node => {
      if (!node.isMesh) return;
      node.geometry.applyMatrix4(node.matrixWorld);
      node.material.envMapIntensity = .18; node.material.roughness = 1;
      node.material.forceSinglePass = true;
      if (node.material.map) node.material.map.anisotropy = anisotropy;
      meshes.push({ geometry: node.geometry, material: node.material });
    });
    return meshes;
  }).filter(meshes => meshes.length);
}

export function readFloraLods(source) {
  return source.map(variant => variant.map(level => level.map(part => {
    const g = new THREE.BufferGeometry();
    for (const [name, width] of [['position', 3], ['normal', 3], ['uv', 2]]) g.setAttribute(name, new THREE.Float32BufferAttribute(part[name], width));
    g.setIndex(part.index); g.computeBoundingSphere(); return g;
  })));
}

// Distance follows the camera when the player rotates, zooms or focuses a tile.
// All levels retain the same rooted trunk and spatial canopy, with hysteresis.
export const floraChunkKey = (plant, variants, chunkSize) => `${Math.floor(plant.x / chunkSize)}/${Math.floor(plant.z / chunkSize)}/${plant.variant % variants}`;
export const floraChunkCenter = plants => plants.reduce((p, t) => p.add(new THREE.Vector3(t.x, t.y + t.size * .5, t.z)), new THREE.Vector3()).multiplyScalar(1 / plants.length);
export function floraLodLevel(distance, previous = -1) {
  if (previous === 0) return distance < 90 ? 0 : distance < 228 ? 1 : 2;
  if (previous === 1) return distance < 70 ? 0 : distance > 228 ? 2 : 1;
  if (previous === 2) return distance > 192 ? 2 : distance < 70 ? 0 : 1;
  return distance < 80 ? 0 : distance < 210 ? 1 : 2;
}
export function updateFloraLods(group, camera) {
  let changed = false;
  group.traverse(mesh => {
    const levels = mesh.userData.floraLods;
    if (!mesh.userData.lodCenter) return;
    const d = camera.position.distanceTo(mesh.userData.lodCenter), previous = mesh.userData.lodLevel ?? -1;
    if (mesh.userData.floraRange) {
      const visible = d < mesh.userData.floraRange;
      if (visible !== mesh.visible) { mesh.visible = visible; changed = true; }
    }
    if (!levels) return;
    const target = floraLodLevel(d, previous);
    if (target === previous) return;
    mesh.geometry = levels[target]; mesh.userData.lodLevel = target; changed = true;
  });
  return changed;
}

export function addFloraBatches(group, placements, variants, { trees = false, lods = null } = {}) {
  const chunks = new Map(), chunkSize = lods ? TREE_CHUNK_SIZE : 64;
  for (const plant of placements) {
    const variant = plant.variant % variants.length;
    const key = floraChunkKey(plant, variants.length, chunkSize);
    if (!chunks.has(key)) chunks.set(key, { variant, plants: [] });
    chunks.get(key).plants.push(plant);
  }
  for (const { variant, plants } of chunks.values()) for (const [part, source] of variants[variant].entries()) {
    const mesh = new THREE.InstancedMesh(source.geometry, source.material, plants.length);
    mesh.userData.shared = true; mesh.userData.flora = true;
    mesh.userData.lodCenter = floraChunkCenter(plants);
    if (!trees) mesh.userData.floraRange = 260;
    if (lods) {
      mesh.userData.floraLods = [source.geometry, ...lods[variant].map(level => level[part])];
    }
    mesh.receiveShadow = true;
    mesh.castShadow = trees && plants.some(p => Math.abs(p.x) < 90 && Math.abs(p.z) < 90);
    plants.forEach((plant, i) => { mesh.setMatrixAt(i, floraMatrix(plant)); mesh.setColorAt(i, new THREE.Color().setScalar(plant.tint)); });
    mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); if (lods) mesh.boundingSphere.radius += 4; group.add(mesh);
  }
}
