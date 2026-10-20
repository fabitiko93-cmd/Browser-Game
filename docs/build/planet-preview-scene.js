import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PLANET_PRESETS, REGION_MODULES, planetRandom, planetSubseed, regionHeight, regionSite } from './planet-blueprint.js';

const ASSETS = new URL('../models/planets/', import.meta.url);
const point = (latitude, longitude, radius = 2.22) => {
  const lat = THREE.MathUtils.degToRad(latitude), lon = THREE.MathUtils.degToRad(longitude);
  return new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), -Math.cos(lat) * Math.sin(lon)).multiplyScalar(radius);
};
const vertex = 'varying vec3 n;varying vec3 p;void main(){n=normalize(mat3(modelMatrix)*normal);p=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';

export class PlanetPreviewScene {
  constructor(canvas, { onSite, onFrame } = {}) {
    this.canvas = canvas; this.onSite = onSite; this.onFrame = onFrame;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.4));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(43, 1, .06, 1800);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true; this.controls.dampingFactor = .09;
    this.controls.enablePan = false; this.controls.rotateSpeed = .55;
    this.controls.addEventListener('change', () => { this.dirty = true; });
    this.hemi = new THREE.HemisphereLight(0xb8d5e5, 0x615446, .5); this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight(0xffe7bf, 3.2); this.scene.add(this.sun); this.scene.add(this.sun.target);
    this.sun.position.set(9, 5, 7);
    this.sun.shadow.mapSize.set(1024, 1024);
    Object.assign(this.sun.shadow.camera, { left: -85, right: 85, top: 85, bottom: -85, near: 1, far: 400 });
    this.sun.shadow.bias = -.0003; this.sun.shadow.normalBias = .08;
    this.pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment(); this.environment = this.pmrem.fromScene(room, .04); room.dispose(); this.pmrem.dispose();
    this.scene.environment = this.environment.texture;
    this.globe = new THREE.Group(); this.land = new THREE.Group(); this.scene.add(this.globe, this.land);
    this.textures = new Map(); this.models = new Map(); this.loader = new GLTFLoader();
    this.ray = new THREE.Raycaster(); this.pointer = new THREE.Vector2(); this.mode = 'orbit'; this.generation = 0; this.dirty = true; this.gridVisible = false;
    this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(canvas.parentElement);
    this.pointers = new Set(); this.dragged = false;
    this.down = e => { this.pointers.add(e.pointerId); this.start = { x: e.clientX, y: e.clientY }; this.dragged = this.pointers.size > 1; };
    this.move = e => { if (this.start && Math.hypot(e.clientX - this.start.x, e.clientY - this.start.y) > 7) this.dragged = true; };
    this.up = e => { const click = !this.dragged && this.pointers.size === 1; this.pointers.delete(e.pointerId); if (click && this.mode === 'region') this.pick(e); if (!this.pointers.size) this.start = null; };
    this.cancel = e => { this.pointers.delete(e.pointerId); this.dragged = true; this.start = null; };
    canvas.addEventListener('pointerdown', this.down); canvas.addEventListener('pointermove', this.move); canvas.addEventListener('pointerup', this.up); canvas.addEventListener('pointercancel', this.cancel);
    this.contextLost = e => { e.preventDefault(); this.failed?.(new Error('Die Grafikverbindung wurde unterbrochen. Bitte Ansicht erneut laden.')); };
    canvas.addEventListener('webglcontextlost', this.contextLost);
    this.lastFrame = 0; this.animate = time => {
      this.frameId = requestAnimationFrame(this.animate);
      if (document.hidden || time - this.lastFrame < 32) return;
      const delta = Math.min(.1, (time - (this.lastFrame || time)) / 1000); this.lastFrame = time;
      if (this.cameraDestination) {
        this.camera.position.lerp(this.cameraDestination, .14);
        if (this.camera.position.distanceTo(this.cameraDestination) < .015) { this.camera.position.copy(this.cameraDestination); this.cameraDestination = null; }
        this.dirty = true;
      }
      this.controls.update();
      if (this.mode === 'orbit' && this.clouds && !matchMedia('(prefers-reduced-motion: reduce)').matches) { this.clouds.rotation.y += delta * .004; this.dirty = true; }
      if (this.dirty) { this.renderer.render(this.scene, this.camera); this.dirty = false; this.onFrame?.(); }
    }; this.frameId = requestAnimationFrame(this.animate);
    this.resize();
  }

  texture(name, { color = false, repeat = 1 } = {}) {
    const key = `${name}:${color}:${repeat}`;
    if (!this.textures.has(key)) this.textures.set(key, new THREE.TextureLoader().loadAsync(new URL(name, ASSETS).href).then(texture => {
      if (this.disposed) { texture.dispose(); throw new Error('Ansicht geschlossen.'); }
      texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      texture.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
      if (repeat !== 1) { texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(repeat, repeat); }
      return texture;
    }));
    return this.textures.get(key);
  }

  model(name) {
    if (!this.models.has(name)) this.models.set(name, this.loader.loadAsync(new URL(name, ASSETS).href).then(gltf => {
      gltf.scene.updateMatrixWorld(true); const meshes = [];
      gltf.scene.traverse(node => { if (node.isMesh) meshes.push(node); });
      if (!meshes.length) throw new Error(`Modell ${name} enthält keine Geometrie.`);
      for (const mesh of meshes) {
        mesh.geometry.applyMatrix4(mesh.matrixWorld); mesh.geometry.computeBoundingBox();
        const box = mesh.geometry.boundingBox, center = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
        mesh.geometry.translate(-center.x, -box.min.y, -center.z);
        mesh.geometry.scale(1 / Math.max(size.x, size.y, size.z), 1 / Math.max(size.x, size.y, size.z), 1 / Math.max(size.x, size.y, size.z));
        mesh.material.envMapIntensity = .35;
        if (mesh.material.map) mesh.material.map.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
      }
      const result = meshes.map(m => ({ geometry: m.geometry, material: m.material }));
      if (this.disposed) this.disposeModels(result);
      return result;
    }));
    return this.models.get(name);
  }

  clearGroup(group) {
    const geometries = new Set(), materials = new Set();
    for (const child of group.children) child.traverse(node => {
      if (!node.userData.shared && node.geometry) geometries.add(node.geometry);
      if (!node.userData.shared && node.material) for (const material of [].concat(node.material)) materials.add(material);
      if (node.isInstancedMesh) node.dispose();
    });
    group.clear(); geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose());
  }

  async setPlanet(planet) {
    const generation = ++this.generation; this.planet = planet; this.mode = 'orbit'; this.region = null;
    this.clearGroup(this.globe); this.clearGroup(this.land); this.terrain = null; this.grid = null; this.siteMark = null; this.clouds = null;
    const preset = PLANET_PRESETS[planet.preset];
    const map = await this.texture(preset.globe, { color: true });
    const layers = planet.preset === 'temperate' ? await Promise.all([this.texture('earth-night.jpg', { color: true }), this.texture('earth-clouds.jpg')]) : null;
    if (generation !== this.generation || this.disposed) return;
    const material = new THREE.MeshStandardMaterial({ map, roughness: planet.preset === 'temperate' ? .72 : .92, metalness: .03, envMapIntensity: .05 });
    if (layers) {
      material.emissive.set(0xffdfae); material.emissiveMap = layers[0]; material.emissiveIntensity = 1.4;
      material.onBeforeCompile = shader => {
        shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\nfloat daylight=dot(normalize(vNormal),normalize((viewMatrix*vec4(9.,5.,7.,0.)).xyz));totalEmissiveRadiance*=1.-smoothstep(-.15,.25,daylight);`);
      };
    }
    this.globe.add(new THREE.Mesh(new THREE.SphereGeometry(2.2, 96, 64), material));
    this.globe.rotation.z = planet.axialTilt;
    if (layers) {
      this.clouds = new THREE.Mesh(new THREE.SphereGeometry(2.227, 64, 48), new THREE.MeshStandardMaterial({ color: 0xdbe5e8, alphaMap: layers[1], transparent: true, opacity: .78, depthWrite: false, roughness: 1, envMapIntensity: 0 }));
      this.globe.add(this.clouds);
    }
    if (preset.atmosphere) this.globe.add(new THREE.Mesh(new THREE.SphereGeometry(2.29, 64, 48), new THREE.ShaderMaterial({
      uniforms: { tint: { value: new THREE.Color(preset.atmosphere) } }, vertexShader: vertex,
      fragmentShader: 'varying vec3 n;varying vec3 p;uniform vec3 tint;void main(){vec3 v=normalize(cameraPosition-p);float rim=pow(1.-abs(dot(normalize(n),v)),3.5);float light=smoothstep(-.3,.6,dot(normalize(n),normalize(vec3(9.,5.,7.))));gl_FragColor=vec4(tint,rim*light*.72);}',
      side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false
    })));
    this.createStars(planet.seed); this.showOrbit();
  }

  createStars(seed) {
    if (this.stars) { this.scene.remove(this.stars); this.stars.geometry.dispose(); this.stars.material.dispose(); }
    const next = planetRandom(planetSubseed(seed, 'stars')), positions = [];
    for (let i = 0; i < 340; i++) { const theta = next() * Math.PI * 2, y = next() * 2 - 1, r = Math.sqrt(1 - y * y); positions.push(Math.cos(theta) * r * 400, y * 400, Math.sin(theta) * r * 400); }
    this.stars = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)), new THREE.PointsMaterial({ color: 0xb3c4d0, size: .6, transparent: true, opacity: .7, sizeAttenuation: true, depthWrite: false }));
    this.scene.add(this.stars);
  }

  showOrbit() {
    this.generation++; this.mode = 'orbit'; this.globe.visible = true; this.land.visible = false; this.stars.visible = true;
    this.scene.background = new THREE.Color(0x040a13); this.scene.fog = null;
    this.sun.position.set(9, 5, 7); this.sun.target.position.set(0, 0, 0); this.sun.castShadow = false; this.sun.intensity = 3.4; this.hemi.intensity = .07;
    this.controls.target.set(0, 0, 0); this.controls.enablePan = false; this.controls.minDistance = 4.8; this.controls.maxDistance = 18; this.controls.minPolarAngle = .15; this.controls.maxPolarAngle = Math.PI - .15;
    this.cameraDestination = null; this.camera.near = .05; this.camera.far = 1000; this.camera.updateProjectionMatrix();
    this.resetCamera(); this.dirty = true;
  }

  focusRegion(region) {
    this.focusedRegion = region;
    if (this.mode !== 'orbit') return;
    const distance = this.globeDistance();
    this.cameraDestination = point(region.latitude * .65, region.longitude - 12, 1).applyAxisAngle(new THREE.Vector3(0, 0, 1), this.planet.axialTilt).multiplyScalar(distance);
    this.dirty = true;
  }

  globeDistance() { return 2.2 / Math.sin(THREE.MathUtils.degToRad(this.camera.fov / 2)) / Math.min(1, this.camera.aspect) * 1.2; }
  resetCamera() {
    this.cameraDestination = null;
    // Flush residual touch damping before restoring the same reference view.
    this.controls.enableDamping = false; this.controls.update(); this.controls.enableDamping = true;
    if (this.mode === 'orbit') { const r = this.focusedRegion ?? this.planet?.regions[0]; this.camera.position.copy(point((r?.latitude ?? 25) * .65, (r?.longitude ?? 15) - 12, 1)).multiplyScalar(this.globeDistance()); this.controls.target.set(0, 0, 0); }
    else {
      this.controls.target.set(this.region?.module === 'coast' ? -24 : 0, 2, 0);
      const offset = new THREE.Vector3(70, 90, 105).multiplyScalar(1 / Math.min(1, this.camera.aspect));
      offset.clampLength(100, 230); this.camera.position.copy(this.controls.target).add(offset);
    }
    this.controls.update(); this.dirty = true;
  }

  async showRegion(region) {
    const generation = ++this.generation; this.region = region; this.mode = 'region';
    this.clearGroup(this.land); this.grid = null; this.siteMark = null;
    this.globe.visible = false; this.land.visible = true;
    const module = REGION_MODULES[region.module], airless = region.module === 'regolith';
    this.scene.background = new THREE.Color(airless ? 0x03070d : 0x889da7);
    this.scene.fog = airless ? null : new THREE.FogExp2(module.water ? 0x82949d : 0xa79a83, .0025);
    this.stars.visible = airless;
    this.sun.position.set(-70, 75, -45); this.sun.target.position.set(0, 0, 0); this.sun.intensity = airless ? 3.4 : 3; this.sun.castShadow = true; this.hemi.intensity = airless ? .08 : .9;
    this.controls.enablePan = true; this.controls.minDistance = 14; this.controls.maxDistance = 260; this.controls.minPolarAngle = .15; this.controls.maxPolarAngle = Math.PI * .48;
    this.camera.near = .2; this.camera.far = 1800; this.camera.updateProjectionMatrix(); this.resetCamera();
    const [color, normal, arm] = await Promise.all([this.texture(`${module.ground}-color.webp`, { color: true, repeat: 18 }), this.texture(`${module.ground}-normal.webp`, { repeat: 18 }), module.ground === 'regolith' ? this.texture('regolith-arm.webp', { repeat: 18 }) : null]);
    const assets = module.rock === 'lunar' ? await this.model('moon-rock.glb') : await this.model('namaqualand-cliff.glb');
    if (generation !== this.generation || this.disposed) return;
    const geometry = new THREE.PlaneGeometry(region.size, region.size, 128, 128); geometry.rotateX(-Math.PI / 2);
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) position.setY(i, regionHeight(region, position.getX(i), position.getZ(i)));
    geometry.computeVertexNormals();
    const ground = new THREE.MeshStandardMaterial({ map: color, normalMap: normal, normalScale: new THREE.Vector2(.8, .8), roughness: 1, color: module.tint, envMapIntensity: .2 });
    if (arm) { ground.roughnessMap = arm; ground.aoMap = arm; ground.aoMapIntensity = .65; geometry.setAttribute('uv1', geometry.attributes.uv); }
    this.terrain = new THREE.Mesh(geometry, ground); this.terrain.receiveShadow = true; this.land.add(this.terrain);
    this.addTerrainSurroundings(ground);
    if (!airless) this.addSky();
    if (module.water) this.addWater();
    for (const source of assets) {
      const rocks = region.rocks.filter((_, i) => i % 2 === 0);
      const batch = new THREE.InstancedMesh(source.geometry, source.material, rocks.length); batch.userData.shared = true; batch.castShadow = true; batch.receiveShadow = true;
      const matrix = new THREE.Matrix4(), rotation = new THREE.Quaternion(), scale = new THREE.Vector3(), pos = new THREE.Vector3();
      rocks.forEach((rock, i) => {
        rotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rock.rotation);
        const width = rock.scale * (module.rock === 'lunar' ? 1.2 : 2.7);
        scale.set(width, width * (.65 + rock.variant * .18), width);
        pos.set(rock.x, regionHeight(region, rock.x, rock.z) - .15, rock.z);
        matrix.compose(pos, rotation, scale); batch.setMatrixAt(i, matrix);
      });
      batch.instanceMatrix.needsUpdate = true; batch.computeBoundingSphere(); this.land.add(batch);
    }
    this.addGrid(); this.addSiteMark(); this.dirty = true;
  }

  addSky() {
    const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 24, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false,
      uniforms: { top: { value: new THREE.Color(this.planet.preset === 'arid' ? '#544f4b' : '#234d68') }, bottom: { value: new THREE.Color('#b1b5ac') } },
      vertexShader: 'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform vec3 top;uniform vec3 bottom;varying vec3 p;void main(){float h=clamp(normalize(p).y,0.,1.);gl_FragColor=vec4(mix(bottom,top,pow(h,.45)),1.);}'
    })); this.land.add(sky);
  }

  addTerrainSurroundings(material) {
    // Continue the same surface outside the selectable area. A region is a
    // camera/work area on a planet, not a floating square with a visible edge.
    const half = this.region.size / 2, edges = [-half * 10, -half, half, half * 10];
    for (let iz = 0; iz < 3; iz++) for (let ix = 0; ix < 3; ix++) {
      if (ix === 1 && iz === 1) continue;
      const width = edges[ix + 1] - edges[ix], depth = edges[iz + 1] - edges[iz];
      const geometry = new THREE.PlaneGeometry(width, depth, ix === 1 ? 128 : 48, iz === 1 ? 128 : 48);
      geometry.rotateX(-Math.PI / 2); geometry.translate((edges[ix] + edges[ix + 1]) / 2, 0, (edges[iz] + edges[iz + 1]) / 2);
      const position = geometry.attributes.position, uv = geometry.attributes.uv;
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i), z = position.getZ(i);
        position.setY(i, regionHeight(this.region, x, z)); uv.setXY(i, x / this.region.size + .5, .5 - z / this.region.size);
      }
      geometry.computeVertexNormals(); if (material.aoMap) geometry.setAttribute('uv1', uv);
      const mesh = new THREE.Mesh(geometry, material); mesh.receiveShadow = true; this.land.add(mesh);
    }
  }

  addWater() {
    const water = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), new THREE.MeshPhysicalMaterial({ color: 0x1b6574, roughness: .27, metalness: .12, clearcoat: .8, clearcoatRoughness: .25, envMapIntensity: .7 }));
    water.rotation.x = -Math.PI / 2; water.position.y = .1; water.receiveShadow = true; this.land.add(water);
  }

  addGrid() {
    const lines = [], size = 64, cell = 2, half = size * cell / 2;
    const line = (x1, z1, x2, z2) => {
      for (let i = 0; i < size; i++) { const a = i / size, b = (i + 1) / size, ax = x1 + (x2 - x1) * a, az = z1 + (z2 - z1) * a, bx = x1 + (x2 - x1) * b, bz = z1 + (z2 - z1) * b;
        lines.push(ax, Math.max(.14, regionHeight(this.region, ax, az)) + .05, az, bx, Math.max(.14, regionHeight(this.region, bx, bz)) + .05, bz);
      }
    };
    for (let i = 0; i <= size; i++) { const p = -half + i * cell; line(-half, p, half, p); line(p, -half, p, half); }
    this.grid = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(lines, 3)), new THREE.LineBasicMaterial({ color: 0xd4dcb7, transparent: true, opacity: .21, depthWrite: false }));
    this.grid.visible = this.gridVisible; this.land.add(this.grid);
  }

  addSiteMark() {
    const geo = new THREE.RingGeometry(1.5, 1.65, 40); geo.rotateX(-Math.PI / 2);
    this.siteMark = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xf5cc7c, transparent: true, opacity: .9, depthWrite: false, side: THREE.DoubleSide }));
    this.siteMark.visible = false; this.land.add(this.siteMark);
  }

  pick(event) {
    if (!this.terrain || !this.region) return;
    const bounds = this.canvas.getBoundingClientRect(); this.pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    this.ray.setFromCamera(this.pointer, this.camera); const hit = this.ray.intersectObject(this.terrain, false)[0]; if (!hit) return;
    const x = Math.round(hit.point.x / 2) * 2, z = Math.round(hit.point.z / 2) * 2;
    const site = regionSite(this.region, x, z);
    this.siteMark.position.set(x, Math.max(.1, site.height) + .1, z); this.siteMark.visible = true; this.siteMark.material.color.set(site.buildable ? '#e9c580' : '#ed927b');
    this.onSite?.(site); this.dirty = true;
  }

  markerPosition(region) {
    const p = point(region.latitude, region.longitude).applyMatrix4(this.globe.matrixWorld);
    const normal = p.clone().normalize(), direction = this.camera.position.clone().sub(p).normalize();
    if (normal.dot(direction) < .05) return null;
    p.project(this.camera); if (p.z < -1 || p.z > 1 || Math.abs(p.x) > 1.1 || Math.abs(p.y) > 1.1) return null;
    return { x: (p.x + 1) * this.width / 2, y: (1 - p.y) * this.height / 2 };
  }
  setGrid(visible) { this.gridVisible = visible; if (this.grid) this.grid.visible = visible; this.dirty = true; }
  zoom(factor) { const offset = this.camera.position.clone().sub(this.controls.target).multiplyScalar(factor); offset.setLength(THREE.MathUtils.clamp(offset.length(), this.controls.minDistance, this.controls.maxDistance)); this.camera.position.copy(this.controls.target).add(offset); this.cameraDestination = null; this.controls.update(); this.dirty = true; }
  resize() { const r = this.canvas.parentElement.getBoundingClientRect(); if (!r.width || !r.height) return; this.width = r.width; this.height = r.height; this.renderer.setSize(r.width, r.height, false); this.camera.aspect = r.width / r.height; this.camera.updateProjectionMatrix(); this.dirty = true; }
  disposeModels(models) { for (const { geometry, material } of models) { geometry.dispose(); for (const value of Object.values(material)) if (value?.isTexture) value.dispose(); material.dispose(); } }
  dispose() {
    if (this.disposed) return; this.disposed = true; this.generation++; cancelAnimationFrame(this.frameId); this.resizeObserver.disconnect();
    this.controls.dispose();
    for (const [name, handler] of [['pointerdown', this.down], ['pointermove', this.move], ['pointerup', this.up], ['pointercancel', this.cancel], ['webglcontextlost', this.contextLost]]) this.canvas.removeEventListener(name, handler);
    this.clearGroup(this.globe); this.clearGroup(this.land);
    if (this.stars) { this.stars.geometry.dispose(); this.stars.material.dispose(); }
    for (const promise of this.textures.values()) promise.then(t => t.dispose()).catch(() => {});
    for (const promise of this.models.values()) promise.then(m => this.disposeModels(m)).catch(() => {});
    this.sun.shadow.map?.dispose(); this.environment.dispose(); this.renderer.dispose();
  }
}
