import * as THREE from 'three';

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

export function addFloraBatches(group, placements, variants, { trees = false } = {}) {
  const chunks = new Map();
  for (const plant of placements) {
    const variant = plant.variant % variants.length;
    const key = `${Math.floor(plant.x / 64)}/${Math.floor(plant.z / 64)}/${variant}`;
    if (!chunks.has(key)) chunks.set(key, { variant, plants: [] });
    chunks.get(key).plants.push(plant);
  }
  for (const { variant, plants } of chunks.values()) for (const source of variants[variant]) {
    const mesh = new THREE.InstancedMesh(source.geometry, source.material, plants.length);
    mesh.userData.shared = true; mesh.userData.flora = true;
    mesh.receiveShadow = true;
    mesh.castShadow = trees && plants.some(p => Math.abs(p.x) < 90 && Math.abs(p.z) < 90);
    plants.forEach((plant, i) => { mesh.setMatrixAt(i, floraMatrix(plant)); mesh.setColorAt(i, new THREE.Color().setScalar(plant.tint)); });
    mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); group.add(mesh);
  }
}
