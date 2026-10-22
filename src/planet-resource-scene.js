import * as THREE from 'three';
import { planetRandom, planetSubseed, regionGroundHeight, regionWater } from './planet-blueprint.js';
import { resourceFieldDensity } from './planet-resources.js';
import { overlapsFootprint } from './planet-construction.js';

export function blendResourceGround(material, visible = false) {
  const previous = material.onBeforeCompile, previousKey = material.customProgramCacheKey.bind(material), enabled = { value: visible ? 1 : 0 };
  material.onBeforeCompile = shader => {
    previous.call(material, shader);
    shader.uniforms.resourceOverlay = enabled;
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nattribute vec4 resourceMap;varying vec4 vResourceMap;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvResourceMap=resourceMap;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform float resourceOverlay;varying vec4 vResourceMap;')
      .replace('#include <color_fragment>', `#include <color_fragment>
        diffuseColor.rgb*=mix(vec3(1.),vResourceMap.rgb,.06*vResourceMap.a);
        diffuseColor.rgb=mix(diffuseColor.rgb,vResourceMap.rgb,resourceOverlay*vResourceMap.a*.8);`);
  };
  material.customProgramCacheKey = () => `${previousKey()}:orbit-resource-ground-v1`;
  return enabled;
}

export function createResourcePresentation(region, construction, time) {
  const group = new THREE.Group(), deposits = { ore: [], crystal: [], geothermal: [] }, steam = [];
  for (const field of region.resources ?? []) {
    const n = planetRandom(planetSubseed(region.seed, `resource-sign/${field.id}`));
    for (let i = 0; i < 7; i++) {
      const angle = n() * Math.PI * 2, distance = i === 0 ? 0 : Math.sqrt(n()) * field.radius * .65;
      const x = field.x + Math.cos(angle) * distance, z = field.z + Math.sin(angle) * distance, y = regionGroundHeight(region, x, z);
      const size = field.type === 'crystal' ? .6 + n() * 1.5 : 1.1 + n() * 2;
      if (regionWater(region, x, z, y) || resourceFieldDensity(region, field, x, z) < .25 || construction.clearings.some(f => overlapsFootprint(f, { minX: x - size, maxX: x + size, minZ: z - size, maxZ: z + size }))) continue;
      deposits[field.type].push({ x, y, z, size, rotation: n() * Math.PI * 2 });
      if (field.type === 'geothermal' && region.preset !== 'lunar') for (let j = 0; j < 14; j++) steam.push(x + (n() - .5) * size, y + .25, z + (n() - .5) * size, n());
    }
  }
  const batch = (placements, geometry, material, transform) => {
    if (!placements.length) { geometry.dispose(); material.dispose(); return; }
    const mesh = new THREE.InstancedMesh(geometry, material, placements.length), object = new THREE.Object3D();
    placements.forEach((p, i) => { object.position.set(p.x, p.y, p.z); object.rotation.set(0, p.rotation, 0); object.scale.setScalar(1); transform(object, p); object.updateMatrix(); mesh.setMatrixAt(i, object.matrix); });
    mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh);
  };
  batch(deposits.ore, new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color: '#625342', roughness: .92 }), (o, p) => { o.position.y -= p.size * .12; o.scale.set(p.size, p.size * .28, p.size * .65); });
  batch(deposits.ore, new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#bba577', metalness: .45, roughness: .65 }), (o, p) => { o.position.y += .25; o.scale.set(p.size * 1.4, .075, .11); o.rotation.z = .06; });
  const crystals = deposits.crystal.flatMap(p => [-1, 0, 1].map(i => ({ ...p, x: p.x + i * .38, z: p.z + Math.abs(i) * .35, size: p.size * (i === 0 ? 1 : .6) })));
  batch(crystals, new THREE.CylinderGeometry(0, .28, 1, 6, 1), new THREE.MeshStandardMaterial({ color: '#ac8bd3', metalness: .2, roughness: .34, emissive: '#23122f', emissiveIntensity: .15 }), (o, p) => { o.position.y += p.size * .5 - .08; o.scale.set(p.size, p.size * 1.6, p.size); o.rotation.z = .12 * Math.sin(p.rotation); });
  batch(deposits.geothermal, new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color: '#3c3931', roughness: .96 }), (o, p) => { o.position.y -= .12; o.scale.set(p.size, p.size * .16, p.size * .6); });
  batch(deposits.geothermal, new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#927158', roughness: .85 }), (o, p) => { o.position.y += .16; o.scale.set(p.size * 1.2, .055, .08); });
  if (steam.length) {
    const positions = [], phases = [];
    for (let i = 0; i < steam.length; i += 4) { positions.push(...steam.slice(i, i + 3)); phases.push(steam[i + 3]); }
    const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)).setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1));
    const material = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { time, scale: { value: 500 } },
      vertexShader: 'attribute float phase;uniform float time;uniform float scale;varying float a;void main(){float age=fract(phase+time*.09);vec3 p=position;p.y+=age*5.;p.x+=sin(phase*20.+age*2.)*age*1.2;p.z+=cos(phase*13.+age*2.)*age;vec4 v=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*v;gl_PointSize=min(28.,scale*(.6+age)/max(1.,-v.z));a=sin(age*3.14159)*.12;}',
      fragmentShader: 'varying float a;void main(){float r=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(.81,.84,.82,a*(1.-smoothstep(.05,1.,r)));}' });
    const points = new THREE.Points(geometry, material); points.frustumCulled = false; group.add(points);
  }
  return group;
}

export function createProbeExtractor(building) {
  const f = building.footprint, group = new THREE.Group(); group.position.set((f.minX + f.maxX) / 2, building.foundation.top, (f.minZ + f.maxZ) / 2); group.userData.buildingId = building.id;
  const geothermal = building.type === 'geothermal', crystal = building.type === 'crystal';
  const colors = { foundation: '#707873', shell: '#a7b6b9', dark: '#273b43', trim: geothermal ? '#c98856' : crystal ? '#a78acb' : '#c5a16b', glass: '#6e9ba8' };
  const materials = Object.fromEntries(Object.entries(colors).map(([id, color]) => [id, new THREE.MeshStandardMaterial({ color, roughness: .72, metalness: .2 })]));
  const parts = new Map(), box = (m, x, y, z, w, h, d) => { if (!parts.has(m)) parts.set(m, []); parts.get(m).push([x, y, z, w, h, d]); };
  const depth = building.foundation.top - building.foundation.bottom;
  box('foundation', 0, -depth / 2, 0, 8, depth, 8); box('dark', 0, .12, 0, 7.6, .24, 7.6);
  box('shell', 1.8, 1.3, 1.2, 2.8, 2.3, 3.8); box('dark', 1.8, 2.55, 1.2, 3, .2, 4);
  box('glass', 1.8, 1.65, 3.12, 1.65, .55, .07); box('trim', 1.8, .55, 3.16, 2.6, .15, .1);
  if (geothermal) {
    for (const x of [-2.7, -.8]) { box('shell', x, 1.5, -1.4, 1.35, 2.7, 2.2); box('dark', x, 2.94, -1.4, 1.5, .18, 2.35); for (const z of [-2, -1.4, -.8]) box('trim', x, 3.06, z, 1.1, .12, .12); }
    for (const z of [1.4, 2.3]) { box('trim', -1.8, .6, z, 3.1, .35, .35); box('dark', -3.25, 1, z, .35, 1.25, .35); }
  } else {
    for (const x of [-2.8, -.2]) { box('trim', x, 2.6, -1.4, .3, 4.8, .4); box('dark', x, 2.2, -.15, .3, 3.9, .3); }
    box('trim', -1.5, 5.05, -1.4, 3, .3, .55); box('dark', -1.5, 2.5, -1.4, .28, 4.6, .28); box('shell', -1.5, 3.8, -1.4, .95, .75, .95);
    box('dark', -1.4, .5, 1.8, 3.3, .65, 1.25); for (const x of [-2.5, -1.6, -.7]) box('trim', x, .88, 1.8, .55, .12, 1.1);
  }
  const geometry = new THREE.BoxGeometry(1, 1, 1), object = new THREE.Object3D();
  for (const [id, list] of parts) {
    const mesh = new THREE.InstancedMesh(geometry, materials[id], list.length); mesh.castShadow = true; mesh.receiveShadow = true;
    list.forEach(([x, y, z, w, h, d], i) => { object.position.set(x, y, z); object.scale.set(w, h, d); object.updateMatrix(); mesh.setMatrixAt(i, object.matrix); }); mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); group.add(mesh);
  }
  return group;
}
