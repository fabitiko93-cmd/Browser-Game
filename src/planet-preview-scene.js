import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PLANET_PRESETS, REGION_MODULES, ROCK_ASSETS, REGION_BUILD_GRID, REGION_TERRAIN, planetRandom, planetSubseed, regionHeight, regionGroundHeight, regionSite, regionBuildCell, regionTerrainPatches, regionCreek, regionLake } from './planet-blueprint.js';
import { createRegionEnvironment, regionHabitat, FLORA_ASSETS } from './planet-environment.js';
import { readFloraVariants, addFloraBatches } from './planet-flora.js';
import { regionBiome } from './planet-biomes.js';
import { planetSurfacePixels } from './planet-geography.js';
import { blendHabitatGround } from './planet-ground-material.js';
import { constrainRegionCamera, stepRegionFocus, regionOverviewPose } from './planet-camera.js';
import { rockFootprint, fitRockToGround } from './planet-rocks.js';

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
    this.controlStart = () => { this.siteFocus = null; };
    this.controls.addEventListener('start', this.controlStart);
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
    this.textures = new Map(); this.models = new Map(); this.floraModels = new Map(); this.loader = new GLTFLoader();
    this.ray = new THREE.Raycaster(); this.pointer = new THREE.Vector2(); this.mode = 'orbit'; this.generation = 0; this.dirty = true; this.gridVisible = false;
    this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(canvas.parentElement);
    this.pointers = new Set(); this.dragged = false;
    this.down = e => { this.siteFocus = null; this.pointers.add(e.pointerId); this.start = { x: e.clientX, y: e.clientY }; this.dragged = this.pointers.size > 1; };
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
        this.camera.position.lerp(this.cameraDestination, .14).setLength(this.cameraDestination.length());
        if (this.camera.position.distanceTo(this.cameraDestination) < .015) { this.camera.position.copy(this.cameraDestination); this.cameraDestination = null; }
        this.dirty = true;
      }
      this.controls.update();
      this.advanceSiteFocus(delta);
      this.keepCameraAboveGround();
      if (this.mode === 'orbit' && this.clouds && !matchMedia('(prefers-reduced-motion: reduce)').matches) { this.clouds.rotation.y += delta * .004; this.dirty = true; }
      if (this.mode === 'region' && this.waterTime && !matchMedia('(prefers-reduced-motion: reduce)').matches) { this.waterTime.value += delta; this.dirty = true; }
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
      if (repeat !== 1 || /^(meadow|forest-floor)-/.test(name)) { texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(repeat, repeat); }
      return texture;
    }));
    return this.textures.get(key);
  }

  model(name) {
    if (!this.models.has(name)) this.models.set(name, this.loader.loadAsync(new URL(name, ASSETS).href).then(gltf => {
      gltf.scene.updateMatrixWorld(true); const meshes = [];
      gltf.scene.traverse(node => { if (node.isMesh) meshes.push(node); });
      if (!meshes.length) throw new Error(`Modell ${name} enthält keine Geometrie.`);
      const bounds = new THREE.Box3();
      for (const mesh of meshes) { mesh.geometry.applyMatrix4(mesh.matrixWorld); mesh.geometry.computeBoundingBox(); bounds.union(mesh.geometry.boundingBox); }
      const center = bounds.getCenter(new THREE.Vector3()), size = bounds.getSize(new THREE.Vector3()), unit = 1 / Math.max(size.x, size.y, size.z);
      for (const mesh of meshes) {
        mesh.geometry.translate(-center.x, -bounds.min.y, -center.z); mesh.geometry.scale(unit, unit, unit);
        mesh.material.envMapIntensity = .15;
        if (mesh.material.map) mesh.material.map.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
      }
      const result = meshes.map(m => ({ geometry: m.geometry, material: m.material, footprint: rockFootprint(m.geometry) }));
      if (this.disposed) this.disposeModels(result);
      return result;
    }));
    return this.models.get(name);
  }

  vegetation(name) {
    if (!this.floraModels.has(name)) this.floraModels.set(name, this.loader.loadAsync(new URL(name, ASSETS).href).then(gltf => {
      const variants = readFloraVariants(gltf, Math.min(4, this.renderer.capabilities.getMaxAnisotropy()));
      if (!variants.length) throw new Error(`Pflanzenmodell ${name} enthält keine Geometrie.`);
      if (this.disposed) this.disposeModels(variants.flat());
      return variants;
    }));
    return this.floraModels.get(name);
  }

  environmentLODs() {
    if (!this.lods) this.lods = fetch(new URL('rock-lods.json', ASSETS)).then(response => {
      if (!response.ok) throw new Error('Umgebungsmodelle konnten nicht geladen werden.');
      return response.json();
    }).then(({ models }) => Object.fromEntries(Object.entries(models).map(([id, source]) => {
      const geometry = new THREE.BufferGeometry();
      for (const [name, width] of [['position', 3], ['normal', 3], ['uv', 2]]) geometry.setAttribute(name, new THREE.Float32BufferAttribute(source[name], width));
      geometry.setIndex(source.index); const result = { geometry, footprint: rockFootprint(geometry) };
      if (this.disposed) geometry.dispose(); return [id, result];
    })));
    return this.lods;
  }

  keepCameraAboveGround() {
    if (this.mode !== 'region' || !this.region) return;
    const eye = this.camera.position, target = this.controls.target, pose = [...eye.toArray(), ...target.toArray()];
    if (this.groundedRegion === this.region && this.groundedPose?.every((v, i) => Math.abs(v - pose[i]) < 1e-8)) return;
    constrainRegionCamera(this.region, eye, target);
    this.camera.lookAt(target); this.camera.updateMatrixWorld();
    this.groundedRegion = this.region; this.groundedPose = [...eye.toArray(), ...target.toArray()]; this.dirty = true;
  }

  focusSite(site) {
    if (this.mode !== 'region' || !this.region) return;
    const damping = this.controls.enableDamping;
    this.controls.enableDamping = false; this.controls.update(); this.controls.enableDamping = damping;
    this.siteFocus = { startX: this.controls.target.x, startZ: this.controls.target.z, x: site.x, z: site.z, elapsed: 0, duration: .65 };
    if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) this.advanceSiteFocus(.65);
    this.dirty = true;
  }

  advanceSiteFocus(delta) {
    if (!this.siteFocus || this.mode !== 'region' || !this.region) return;
    if (stepRegionFocus(this.siteFocus, this.camera.position, this.controls.target, delta)) this.siteFocus = null;
    this.keepCameraAboveGround(); this.dirty = true;
  }

  clearGroup(group) {
    const geometries = new Set(), materials = new Set();
    for (const child of group.children) child.traverse(node => {
      if (!node.userData.shared && !node.userData.sharedGeometry && node.geometry) geometries.add(node.geometry);
      if (!node.userData.shared && node.material) for (const material of [].concat(node.material)) materials.add(material);
      if (node.isInstancedMesh) node.dispose();
    });
    group.clear(); geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose());
  }

  async setPlanet(planet) {
    const generation = ++this.generation; this.planet = planet; this.mode = 'orbit'; this.region = null; this.siteFocus = null;
    this.clearGroup(this.globe); this.clearGroup(this.land); this.colonyPads = null; this.forest = null; this.terrain = null; this.grid = null; this.siteMark = null; this.clouds = null; this.environmentRecipe = null;
    const preset = PLANET_PRESETS[planet.preset];
    const layers = planet.preset === 'temperate' ? await this.texture('earth-clouds.jpg') : null;
    const pixels = planet.geography ? planetSurfacePixels(planet.geography) : null;
    const map = pixels ? new THREE.DataTexture(pixels.data, pixels.width, pixels.height) : await this.texture(preset.globe, { color: true });
    if (pixels) { map.colorSpace = THREE.SRGBColorSpace; map.magFilter = map.minFilter = THREE.LinearFilter; map.wrapS = THREE.RepeatWrapping; map.needsUpdate = true; }
    if (generation !== this.generation || this.disposed) { if (pixels) map.dispose(); return; }
    const material = new THREE.MeshStandardMaterial({ map, roughness: planet.preset === 'temperate' ? .8 : .92, metalness: .03, envMapIntensity: .05 });
    if (pixels) material.addEventListener('dispose', () => map.dispose());
    this.globe.add(new THREE.Mesh(new THREE.SphereGeometry(2.2, 96, 64), material));
    this.globe.rotation.z = planet.axialTilt;
    if (layers) {
      this.clouds = new THREE.Mesh(new THREE.SphereGeometry(2.227, 64, 48), new THREE.MeshStandardMaterial({ color: 0xdbe5e8, alphaMap: layers, transparent: true, opacity: .78, depthWrite: false, roughness: 1, envMapIntensity: 0 }));
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
    this.generation++; this.mode = 'orbit'; this.siteFocus = null; this.globe.visible = true; this.land.visible = false; this.stars.visible = true;
    this.scene.background = new THREE.Color(0x040a13); this.scene.fog = null;
    this.renderer.toneMappingExposure = 1; this.sun.color.set(0xffe7bf); this.hemi.color.set(0xb8d5e5); this.hemi.groundColor.set(0x615446);
    this.sun.position.set(9, 5, 7); this.sun.target.position.set(0, 0, 0); this.sun.castShadow = false; this.sun.intensity = 3.4; this.hemi.intensity = .07;
    this.controls.target.set(0, 0, 0); this.controls.enablePan = false; this.controls.minDistance = 4.8; this.controls.maxDistance = 18; this.controls.minPolarAngle = .15; this.controls.maxPolarAngle = Math.PI - .15;
    this.cameraDestination = null; this.camera.fov = 43; this.camera.near = .05; this.camera.far = 1000; this.camera.updateProjectionMatrix();
    this.resetCamera(); this.dirty = true;
  }

  focusRegion(region) {
    this.focusedRegion = region;
    if (this.mode !== 'orbit') return;
    const distance = this.globeDistance();
    this.cameraDestination = point(region.latitude, region.longitude, 1).applyAxisAngle(new THREE.Vector3(0, 0, 1), this.planet.axialTilt).multiplyScalar(distance);
    this.dirty = true;
  }

  globeDistance() { return 2.2 / Math.sin(THREE.MathUtils.degToRad(this.camera.fov / 2)) / Math.min(1, this.camera.aspect) * 1.2; }
  resetCamera() {
    this.cameraDestination = null; this.siteFocus = null;
    // Flush residual touch damping before restoring the same reference view.
    this.controls.enableDamping = false; this.controls.update(); this.controls.enableDamping = true;
    if (this.mode === 'orbit') { const r = this.focusedRegion ?? this.planet?.regions[0]; this.camera.position.copy(point(r?.latitude ?? 25, r?.longitude ?? 15, 1).applyAxisAngle(new THREE.Vector3(0, 0, 1), this.planet.axialTilt)).multiplyScalar(this.globeDistance()); this.controls.target.set(0, 0, 0); }
    else {
      const { eye, target, fov } = regionOverviewPose(this.region);
      this.camera.fov = fov; this.camera.updateProjectionMatrix();
      this.controls.target.set(target.x, target.y, target.z); this.camera.position.set(eye.x, eye.y, eye.z);
    }
    this.controls.update(); this.keepCameraAboveGround(); this.dirty = true;
  }

  async showRegion(region) {
    const generation = ++this.generation; this.region = region; this.mode = 'region'; this.siteFocus = null;
    this.clearGroup(this.land); this.colonyPads = null; this.forest = null; this.terrain = null; this.grid = null; this.siteMark = null; this.waterTime = null;
    this.environmentRecipe = createRegionEnvironment(region);
    this.globe.visible = false; this.land.visible = true;
    const module = REGION_MODULES[region.module], biome = regionBiome(region), living = !!biome, airless = region.module === 'regolith';
    this.scene.background = new THREE.Color(biome?.sky ?? module.sky);
    this.scene.fog = airless ? null : new THREE.FogExp2(biome?.fog ?? module.fog, living ? region.module === 'upland' ? .00095 : .0012 : .0015);
    this.stars.visible = airless; this.renderer.toneMappingExposure = living ? .94 : .88;
    const warm = region.module === 'basin';
    this.sun.color.set(living ? '#fff3df' : warm ? '#ffe0bb' : region.module === 'upland' ? '#e8f1ff' : '#fff0d8');
    this.hemi.color.set(biome?.sky ?? module.sky); this.hemi.groundColor.set(living ? '#536348' : module.palette[0]);
    this.sun.position.set(-70, 95, region.module === 'upland' ? 65 : -45); this.sun.target.position.set(0, 0, 0); this.sun.intensity = airless ? 2.5 : living ? 2.6 : 2.3; this.sun.castShadow = true; this.hemi.intensity = airless ? .06 : living ? 1.1 : .85;
    this.controls.enablePan = true; this.controls.minDistance = 14; this.controls.maxDistance = living ? 360 : 260; this.controls.minPolarAngle = .15; this.controls.maxPolarAngle = Math.PI * .48;
    this.camera.near = .2; this.camera.far = 1800; this.camera.updateProjectionMatrix(); this.resetCamera();
    const [color, normal, arm] = await Promise.all([this.texture(`${module.ground}-color.webp`, { color: true, repeat: 18 }), this.texture(`${module.ground}-normal.webp`, { repeat: 18 }), module.ground === 'regolith' ? this.texture('regolith-arm.webp', { repeat: 18 }) : null]);
    const modelIds = [...new Set([...region.rocks, ...this.environmentRecipe.rocks].map(r => r.model))];
    const [assetSets, lods] = await Promise.all([Promise.all(modelIds.map(id => this.model(ROCK_ASSETS[id]))), this.environmentLODs()]);
    const floraIds = [...new Set([...this.environmentRecipe.trees, ...this.environmentRecipe.plants].map(p => p.model).filter(id => id !== 'forest'))];
    const [floraSets, habitatTextures] = await Promise.all([
      Promise.all(floraIds.map(id => this.vegetation(FLORA_ASSETS[id]))),
      living ? Promise.all(['meadow-color.webp', 'meadow-normal.webp', 'forest-floor-color.webp', 'forest-floor-normal.webp'].map((name, i) => this.texture(name, { color: i % 2 === 0, repeat: 1 }))) : null
    ]);
    if (generation !== this.generation || this.disposed) return;
    const geometry = new THREE.PlaneGeometry(region.size, region.size, REGION_TERRAIN.segments, REGION_TERRAIN.segments); geometry.rotateX(-Math.PI / 2);
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) position.setY(i, regionHeight(region, position.getX(i), position.getZ(i)));
    geometry.computeVertexNormals(); this.colorTerrain(geometry);
    const ground = new THREE.MeshStandardMaterial({ map: color, normalMap: normal, normalScale: new THREE.Vector2(living ? .32 : module.ground === 'regolith' ? 1 : .65, living ? .32 : module.ground === 'regolith' ? 1 : .65), vertexColors: true, roughness: 1, envMapIntensity: .12 });
    if (habitatTextures) blendHabitatGround(ground, { meadow: habitatTextures[0], meadowNormal: habitatTextures[1], forest: habitatTextures[2], forestNormal: habitatTextures[3] }, region);
    if (arm && !living) { ground.roughnessMap = arm; ground.aoMap = arm; ground.aoMapIntensity = .4; geometry.setAttribute('uv1', geometry.attributes.uv); }
    this.terrain = new THREE.Mesh(geometry, ground); this.terrain.receiveShadow = true; this.land.add(this.terrain);
    this.addTerrainSurroundings(ground);
    if (!airless) this.addSky();
    if (module.water) this.addWater();
    if (living && region.module === 'basin') this.addCreek();
    if (living && regionLake(region)) this.addLake();
    this.rockPlacements = [];
    for (let type = 0; type < modelIds.length; type++) for (const source of assetSets[type]) {
      const rocks = region.rocks.filter(r => r.model === modelIds[type]);
      const material = source.material.clone(); material.color.multiply(new THREE.Color(module.rockTint)); material.roughness = 1; material.envMapIntensity = .12;
      const batch = new THREE.InstancedMesh(source.geometry, material, rocks.length); batch.userData.sharedGeometry = true; batch.userData.rocks = true; batch.castShadow = true; batch.receiveShadow = true;
      rocks.forEach((rock, i) => {
        const pose = fitRockToGround(region, rock, source.footprint); batch.setMatrixAt(i, pose.matrix);
        batch.setColorAt(i, new THREE.Color().setScalar(.86 + (rock.variant / 2) * .2));
        this.rockPlacements.push({ id: rock.id, model: rock.model, matrix: pose.matrix, footprint: source.footprint });
      });
      batch.instanceMatrix.needsUpdate = true; batch.computeBoundingSphere(); this.land.add(batch);
      const distant = this.environmentRecipe.rocks.filter(r => r.model === modelIds[type]), low = lods[modelIds[type]];
      if (distant.length) {
        const environment = new THREE.InstancedMesh(low.geometry, material, distant.length);
        environment.userData.sharedGeometry = true; environment.userData.rocks = true; environment.receiveShadow = true;
        distant.forEach((rock, i) => {
          const pose = fitRockToGround(region, rock, low.footprint); environment.setMatrixAt(i, pose.matrix);
          environment.setColorAt(i, new THREE.Color().setScalar(.8 + rock.variant * .1));
          this.rockPlacements.push({ id: rock.id, model: rock.model, matrix: pose.matrix, footprint: low.footprint });
        });
        environment.instanceMatrix.needsUpdate = true; environment.computeBoundingSphere(); this.land.add(environment);
      }
    }
    floraIds.forEach((id, i) => addFloraBatches(this.land, [...this.environmentRecipe.trees, ...this.environmentRecipe.plants].filter(p => p.model === id), floraSets[i], { trees: ['pine', 'oak', 'aspen'].includes(id) }));
    if (region.colony) this.addColonySite();
    this.addGrid(); this.addSiteMark(); this.keepCameraAboveGround(); this.dirty = true;
  }

  colorTerrain(geometry) {
    const module = REGION_MODULES[this.region.module], palette = module.palette.map(c => new THREE.Color(c));
    const position = geometry.attributes.position, normal = geometry.attributes.normal;
    const colors = new Float32Array(position.count * 3), habitats = new Float32Array(position.count * 4), c = new THREE.Color();
    const floor = { coast: 3, basin: 4, upland: 12, caldera: 4, regolith: 3 }[this.region.module];
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i), z = position.getZ(i), y = position.getY(i);
      const ny = Math.max(.05, normal.getY(i)), slope = Math.sqrt(Math.max(0, 1 - ny * ny)) / ny;
      const h = regionHabitat(this.region, x, z, y, slope);
      const altitude = THREE.MathUtils.clamp((y - floor) / 45, 0, 1);
      c.copy(palette[0]).lerp(palette[1], altitude).lerp(palette[2], THREE.MathUtils.clamp(slope, 0, .85));
      if (h.cover > 0) c.lerp(new THREE.Color('#ddd9cc'), h.cover);
      if (this.region.module === 'coast' && y < 1.4) c.multiplyScalar(.7 + THREE.MathUtils.clamp(y / 1.4, 0, 1) * .3);
      c.toArray(colors, i * 3); habitats[i * 4] = h.cover; habitats[i * 4 + 1] = h.forest; habitats[i * 4 + 2] = h.moisture; habitats[i * 4 + 3] = h.snow;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('habitat', new THREE.BufferAttribute(habitats, 4));
  }

  addSky() {
    const module = regionBiome(this.region) ?? REGION_MODULES[this.region.module];
    const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 24, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false,
      uniforms: { top: { value: new THREE.Color(module.sky) }, bottom: { value: new THREE.Color(module.fog) } },
      vertexShader: 'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: `uniform vec3 top;uniform vec3 bottom;varying vec3 p;void main(){float h=clamp(normalize(p).y,0.,1.);gl_FragColor=vec4(mix(bottom,top,pow(h,.45)),1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`
    })); this.land.add(sky);
  }

  addTerrainSurroundings(material) {
    // Continue the same surface outside the selectable area. A region is a
    // camera/work area on a planet, not a floating square with a visible edge.
    for (const patch of regionTerrainPatches(this.region)) {
      if (patch.central) continue;
      const geometry = new THREE.PlaneGeometry(patch.maxX - patch.minX, patch.maxZ - patch.minZ, patch.segmentsX, patch.segmentsZ);
      geometry.rotateX(-Math.PI / 2); geometry.translate((patch.minX + patch.maxX) / 2, 0, (patch.minZ + patch.maxZ) / 2);
      const position = geometry.attributes.position, uv = geometry.attributes.uv;
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i), z = position.getZ(i);
        position.setY(i, regionHeight(this.region, x, z)); uv.setXY(i, x / this.region.size + .5, .5 - z / this.region.size);
      }
      geometry.computeVertexNormals(); this.colorTerrain(geometry); if (material.aoMap) geometry.setAttribute('uv1', uv);
      const mesh = new THREE.Mesh(geometry, material); mesh.receiveShadow = true; this.land.add(mesh);
    }
  }

  addCreek() {
    const positions = [], indices = [], segments = 640;
    for (let i = 0; i <= segments; i++) {
      const z = -960 + i * 3, creek = regionCreek(this.region, z), x = creek.x;
      // Across the coarse surroundings the ribbon follows the same sampled
      // terrain as the riverbed, and its banks are hidden under the dry ground.
      const width = creek.width * 1.18, y = regionGroundHeight(this.region, x, z) + creek.depth * .48;
      positions.push(x - width, y, z, x + width, y, z);
      if (i < segments) { const a = i * 2; indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setIndex(indices); geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({ color: '#437e80', roughness: .25, metalness: .12, envMapIntensity: .65, side: THREE.DoubleSide });
    const creek = new THREE.Mesh(geometry, material); creek.receiveShadow = true; this.land.add(creek);
  }

  addLake() {
    const lake = regionLake(this.region), geometry = new THREE.CircleGeometry(1, 96);
    geometry.rotateX(-Math.PI / 2); geometry.scale(lake.rx * 1.12, 1, lake.rz * 1.12); geometry.translate(lake.x, lake.level, lake.z);
    const material = new THREE.MeshStandardMaterial({ color: '#386d77', roughness: .18, metalness: .17, envMapIntensity: .8 });
    const mesh = new THREE.Mesh(geometry, material); mesh.receiveShadow = true; this.land.add(mesh);
  }

  addColonySite() {
    const site = this.region.colony, positions = [], indices = [], uvs = [];
    this.colonyPads = new THREE.Group(); this.colonyPads.visible = this.gridVisible; this.land.add(this.colonyPads);
    const ground = (x, z) => regionGroundHeight(this.region, x, z) + .045;
    for (const path of site.roads) for (let p = 1; p < path.length; p++) {
      const [ax, az] = path[p - 1], [bx, bz] = path[p], length = Math.hypot(bx - ax, bz - az), nx = -(bz - az) / length * 1.8, nz = (bx - ax) / length * 1.8;
      const count = Math.ceil(length / 1.5), base = positions.length / 3;
      for (let i = 0; i <= count; i++) {
        const t = i / count, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
        positions.push(x + nx, ground(x + nx, z + nz), z + nz, x - nx, ground(x - nx, z - nz), z - nz); uvs.push(0, t, 1, t);
        if (i < count) { const n = base + i * 2; indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2); }
      }
    }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setIndex(indices); geometry.computeVertexNormals();
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    const edge = new Uint8Array(8 * 4);
    [0, 65, 185, 255, 255, 185, 65, 0].forEach((v, i) => { edge[i * 4] = edge[i * 4 + 1] = edge[i * 4 + 2] = v; edge[i * 4 + 3] = 255; });
    const alpha = new THREE.DataTexture(edge, 8, 1); alpha.magFilter = alpha.minFilter = THREE.LinearFilter; alpha.needsUpdate = true;
    const material = new THREE.MeshStandardMaterial({ color: site.tint, roughness: 1, side: THREE.DoubleSide, alphaMap: alpha, transparent: true, opacity: .65, depthWrite: false });
    material.addEventListener('dispose', () => alpha.dispose());
    const roads = new THREE.Mesh(geometry, material); roads.receiveShadow = true; this.land.add(roads);
    for (const [x, z, w, d] of site.pads) {
      const geometry = new THREE.PlaneGeometry(w, d, Math.ceil(w / 2), Math.ceil(d / 2)); geometry.rotateX(-Math.PI / 2); geometry.translate(x, 0, z);
      const pos = geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) pos.setY(i, ground(pos.getX(i), pos.getZ(i)));
      geometry.computeVertexNormals();
      const pad = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: site.tint, roughness: 1, transparent: true, opacity: .16, depthWrite: false })); pad.receiveShadow = true; this.colonyPads.add(pad);
    }
  }

  addWater() {
    this.waterTime = { value: 0 };
    const shorePixels = new Uint8Array(256 * 4);
    for (let i = 0; i < 256; i++) {
      const z = -900 + i / 255 * 1800; let wet = -150, dry = 60;
      for (let j = 0; j < 13; j++) { const mid = (wet + dry) / 2; if (regionHeight(this.region, mid, z) < .1) wet = mid; else dry = mid; }
      shorePixels[i * 4] = Math.round(wet + 128); shorePixels[i * 4 + 3] = 255;
    }
    const shoreMap = new THREE.DataTexture(shorePixels, 256, 1); shoreMap.magFilter = shoreMap.minFilter = THREE.LinearFilter; shoreMap.needsUpdate = true;
    const material = new THREE.ShaderMaterial({
      uniforms: { shoreMap: { value: shoreMap }, time: this.waterTime, phase: { value: this.region.phase }, deep: { value: new THREE.Color('#123e56') }, shallow: { value: new THREE.Color('#398d92') }, sky: { value: new THREE.Color(REGION_MODULES.coast.sky) } },
      vertexShader: 'varying vec3 p;void main(){p=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);}',
      fragmentShader: `uniform sampler2D shoreMap;uniform float time;uniform float phase;uniform vec3 deep;uniform vec3 shallow;uniform vec3 sky;varying vec3 p;
      void main(){
        vec3 n=normalize(vec3(.035*sin(p.x*.7+p.z*.23+time*.8)+.018*sin(p.z*1.4-time),1.,.035*cos(p.z*.65+p.x*.2-time*.6)));
        vec3 eye=normalize(cameraPosition-p);float fresnel=.03+.8*pow(1.-max(dot(n,eye),0.),4.);
        float coast=texture2D(shoreMap,vec2(clamp((p.z+900.)/1800.,0.,1.),.5)).r*255.-128.;
        float depth=max(0.,coast-p.x);vec3 color=mix(shallow,deep,1.-exp(-depth*.06));
        color=mix(color,sky,fresnel*.6);
        float glint=pow(max(dot(reflect(-normalize(vec3(-70.,95.,-45.)),n),eye),0.),110.);
        color+=vec3(.8,.78,.67)*glint*.65;gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
    });
    material.addEventListener('dispose', () => shoreMap.dispose());
    const water = new THREE.Mesh(new THREE.PlaneGeometry(1800, 1800), material); water.rotation.x = -Math.PI / 2; water.position.y = .1; this.land.add(water);
    const positions = [], uv = [], indices = [], segments = 240;
    for (let i = 0; i <= segments; i++) {
      const z = -480 + i * 4; let wet = -150, dry = 60;
      for (let j = 0; j < 13; j++) { const mid = (wet + dry) / 2; if (regionHeight(this.region, mid, z) < .1) wet = mid; else dry = mid; }
      positions.push(wet - 2.5, .12, z, wet + .25, .12, z); uv.push(0, z, 1, z);
      if (i < segments) { const a = i * 2; indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geometry.setIndex(indices);
    const foam = new THREE.Mesh(geometry, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { time: this.waterTime }, vertexShader: 'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: `uniform float time;varying vec2 v;void main(){float a=sin(v.x*3.14159)*(.1+.08*sin(v.y*.7-time*.6));gl_FragColor=vec4(vec3(.7,.85,.82),a);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`
    })); this.land.add(foam);
  }

  addGrid() {
    const lines = [], boundary = [], { cells: size, cellSize: cell, halfExtent: half } = REGION_BUILD_GRID;
    const line = (output, x1, z1, x2, z2) => {
      for (let i = 0; i < size; i++) { const a = i / size, b = (i + 1) / size, ax = x1 + (x2 - x1) * a, az = z1 + (z2 - z1) * a, bx = x1 + (x2 - x1) * b, bz = z1 + (z2 - z1) * b;
        output.push(ax, Math.max(.14, regionGroundHeight(this.region, ax, az)) + .07, az, bx, Math.max(.14, regionGroundHeight(this.region, bx, bz)) + .07, bz);
      }
    };
    for (let i = 0; i <= size; i++) { const p = -half + i * cell, output = i === 0 || i === size ? boundary : lines; line(output, -half, p, half, p); line(output, p, -half, p, half); }
    this.grid = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(lines, 3)), new THREE.LineBasicMaterial({ color: 0xd4dcb7, transparent: true, opacity: .21, depthWrite: false }));
    this.grid.visible = this.gridVisible; this.land.add(this.grid);
    this.buildBoundary = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(boundary, 3)), new THREE.LineBasicMaterial({ color: 0xd4dcb7, transparent: true, opacity: .55, depthWrite: false })); this.land.add(this.buildBoundary);
  }

  addSiteMark() {
    const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(16 * 3), 3));
    this.siteMark = new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({ color: 0xf5cc7c, transparent: true, opacity: .95, depthWrite: false }));
    this.siteMark.visible = false; this.land.add(this.siteMark);
  }

  pick(event) {
    if (!this.terrain || !this.region) return;
    this.keepCameraAboveGround();
    const bounds = this.canvas.getBoundingClientRect(); this.pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    this.ray.setFromCamera(this.pointer, this.camera); const hit = this.ray.intersectObject(this.terrain, false)[0];
    const cell = hit && regionBuildCell(hit.point.x, hit.point.z);
    if (!cell) { this.siteFocus = null; this.siteMark.visible = false; this.onSite?.(null); this.dirty = true; return; }
    const { x, z } = cell;
    const site = regionSite(this.region, x, z);
    const position = this.siteMark.geometry.attributes.position, half = REGION_BUILD_GRID.cellSize / 2;
    for (let side = 0; side < 4; side++) for (let i = 0; i < 4; i++) {
      const t = i / 4, corners = [[-half, -half], [half, -half], [half, half], [-half, half]], a = corners[side], b = corners[(side + 1) % 4];
      const px = x + a[0] + (b[0] - a[0]) * t, pz = z + a[1] + (b[1] - a[1]) * t;
      position.setXYZ(side * 4 + i, px, Math.max(.1, regionGroundHeight(this.region, px, pz)) + .12, pz);
    }
    position.needsUpdate = true; this.siteMark.geometry.computeBoundingSphere(); this.siteMark.visible = true; this.siteMark.material.color.set(site.buildable ? '#e9c580' : '#ed927b');
    this.onSite?.(site); this.focusSite(site); this.dirty = true;
  }

  northBearing() {
    if (!this.region) return 0;
    const angle = this.region.rotation ?? 0, center = this.controls.target.clone();
    const north = center.clone().add(new THREE.Vector3(Math.sin(angle) * 20, 0, -Math.cos(angle) * 20));
    center.project(this.camera); north.project(this.camera);
    return Math.atan2((north.x - center.x) * this.width, (north.y - center.y) * this.height);
  }

  markerPosition(region) {
    const p = point(region.latitude, region.longitude).applyMatrix4(this.globe.matrixWorld);
    const normal = p.clone().normalize(), direction = this.camera.position.clone().sub(p).normalize();
    if (normal.dot(direction) < .05) return null;
    p.project(this.camera); if (p.z < -1 || p.z > 1 || Math.abs(p.x) > 1.1 || Math.abs(p.y) > 1.1) return null;
    return { x: (p.x + 1) * this.width / 2, y: (1 - p.y) * this.height / 2 };
  }
  setGrid(visible) { this.gridVisible = visible; if (this.grid) this.grid.visible = visible; if (this.colonyPads) this.colonyPads.visible = visible; this.dirty = true; }
  zoom(factor) { this.siteFocus = null; const offset = this.camera.position.clone().sub(this.controls.target).multiplyScalar(factor); offset.setLength(THREE.MathUtils.clamp(offset.length(), this.controls.minDistance, this.controls.maxDistance)); this.camera.position.copy(this.controls.target).add(offset); this.cameraDestination = null; this.controls.update(); this.keepCameraAboveGround(); this.dirty = true; }
  resize() { const r = this.canvas.parentElement.getBoundingClientRect(); if (!r.width || !r.height) return; this.width = r.width; this.height = r.height; this.renderer.setSize(r.width, r.height, false); this.camera.aspect = r.width / r.height; this.camera.updateProjectionMatrix(); this.dirty = true; }
  disposeModels(models) { for (const { geometry, material } of models) { geometry.dispose(); for (const value of Object.values(material)) if (value?.isTexture) value.dispose(); material.dispose(); } }
  dispose() {
    if (this.disposed) return; this.disposed = true; this.generation++; cancelAnimationFrame(this.frameId); this.resizeObserver.disconnect();
    this.siteFocus = null; this.controls.removeEventListener('start', this.controlStart); this.controls.dispose();
    for (const [name, handler] of [['pointerdown', this.down], ['pointermove', this.move], ['pointerup', this.up], ['pointercancel', this.cancel], ['webglcontextlost', this.contextLost]]) this.canvas.removeEventListener(name, handler);
    this.clearGroup(this.globe); this.clearGroup(this.land);
    if (this.stars) { this.stars.geometry.dispose(); this.stars.material.dispose(); }
    for (const promise of this.textures.values()) promise.then(t => t.dispose()).catch(() => {});
    for (const promise of this.models.values()) promise.then(m => this.disposeModels(m)).catch(() => {});
    for (const promise of this.floraModels.values()) promise.then(variants => this.disposeModels(variants.flat())).catch(() => {});
    this.lods?.then(models => Object.values(models).forEach(m => m.geometry.dispose())).catch(() => {});
    this.sun.shadow.map?.dispose(); this.environment.dispose(); this.renderer.dispose();
  }
}
