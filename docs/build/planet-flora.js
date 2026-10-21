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
    const key = `${Math.floor(plant.x / 72)}/${Math.floor(plant.z / 72)}/${variant}`;
    if (!chunks.has(key)) chunks.set(key, { variant, plants: [] });
    chunks.get(key).plants.push(plant);
  }
  for (const { variant, plants } of chunks.values()) for (const source of variants[variant]) {
    const mesh = new THREE.InstancedMesh(source.geometry, source.material, plants.length);
    mesh.userData.shared = true; mesh.userData.flora = true;
    mesh.receiveShadow = true;
    mesh.castShadow = trees && plants.some(p => Math.abs(p.x) < 110 && Math.abs(p.z) < 110);
    plants.forEach((plant, i) => { mesh.setMatrixAt(i, floraMatrix(plant)); mesh.setColorAt(i, new THREE.Color().setScalar(plant.tint)); });
    mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); group.add(mesh);
  }
}

// Distant adult pines use eight views of each original source tree. Cylindrical
// billboards keep roots upright; the near saplings above remain real geometry.
export function createForestBatches(group, trees, map) {
  const chunks = new Map(), batches = [];
  const material = new THREE.MeshBasicMaterial({ map, side: THREE.DoubleSide, alphaTest: .38, toneMapped: false, fog: true });
  material.onBeforeCompile = shader => {
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nattribute vec2 atlasFrame;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\nvMapUv=(vMapUv+atlasFrame)*vec2(.125,.5);');
  };
  material.customProgramCacheKey = () => 'orbit-distant-pine-atlas-v1';
  for (const tree of trees) {
    const key = `${Math.floor(tree.x / 72)}/${Math.floor(tree.z / 72)}`;
    if (!chunks.has(key)) chunks.set(key, []); chunks.get(key).push(tree);
  }
  for (const plants of chunks.values()) {
    const geometry = new THREE.PlaneGeometry(.61, 1.22); geometry.translate(0, .5, 0);
    const frames = new THREE.InstancedBufferAttribute(new Float32Array(plants.length * 2), 2); geometry.setAttribute('atlasFrame', frames);
    const mesh = new THREE.InstancedMesh(geometry, material, plants.length); mesh.userData.flora = true;
    mesh.userData.forest = true; group.add(mesh); batches.push({ mesh, plants, frames });
  }
  return { batches, eye: null };
}

export function updateForestBatches(forest, eye) {
  if (!forest || forest.eye?.distanceToSquared(eye) < 1e-8) return;
  forest.eye = eye.clone(); const object = new THREE.Object3D();
  for (const { mesh, plants, frames } of forest.batches) {
    plants.forEach((plant, i) => {
      const angle = Math.atan2(eye.x - plant.x, eye.z - plant.z);
      const frame = ((Math.round((angle - plant.rotation) * 8 / (Math.PI * 2)) % 8) + 8) % 8;
      frames.setXY(i, frame, 1 - plant.variant % 2);
      object.position.set(plant.x, plant.y, plant.z); object.rotation.y = angle;
      object.scale.set(plant.size * plant.width, plant.size, plant.size * plant.width); object.updateMatrix(); mesh.setMatrixAt(i, object.matrix);
      mesh.setColorAt(i, new THREE.Color().setScalar(plant.tint));
    });
    frames.needsUpdate = true; mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere();
  }
}
