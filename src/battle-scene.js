import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { DEMO_CLASSES, activeShip, demoTarget, fleetCenter } from './battle-demo.js';
import { BattleEffects } from './battle-effects.js';
import { BattlePresentation, environment, panelNormalMap } from './battle-presentation.js';
import { BattleQuality } from './battle-quality.js';

const COLORS = { friendly: 0x71bfff, enemy: 0xff8499 };
const FORWARD = new THREE.Vector3(0, 0, -1);

export class BattleScene {
  constructor(canvas, { onSelect, onUnavailable, onProgress } = {}) {
    this.canvas = canvas; this.onSelect = onSelect; this.onUnavailable = onUnavailable; this.onProgress = onProgress;
    this.models = new Map(); this.ships = new Map(); this.disposed = false; this.mode = 'ship'; this.dirty = true;
    this.loadingManager = new THREE.LoadingManager();
    this.a = new THREE.Vector3(); this.b = new THREE.Vector3(); this.quaternion = new THREE.Quaternion(); this.color = new THREE.Color();
    this.followed = new THREE.Vector3(); this.raycaster = new THREE.Raycaster();
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.quality = new BattleQuality(devicePixelRatio || 1); this.pixelRatio = this.quality.ratio;
    this.renderer.setPixelRatio(this.pixelRatio); this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.15;
    this.presentation = new BattlePresentation(this.renderer); this.environmentTarget = environment(this.renderer); this.panelMap = panelNormalMap();
    this.scene = new THREE.Scene(); this.scene.background = new THREE.Color(0x050813);
    this.scene.environment = this.environmentTarget.texture; this.scene.environmentIntensity = .55;
    this.camera = new THREE.PerspectiveCamera(42, 1, 1, 35000);
    this.camera.position.set(65, 65, 1610);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true; this.controls.dampingFactor = .12;
    this.controls.minDistance = 18; this.controls.maxDistance = 12000;
    this.controls.rotateSpeed = .55; this.controls.zoomSpeed = .75; this.controls.maxPolarAngle = Math.PI * .88;
    this.controls.target.set(0, 0, 1000); this.followed.copy(this.controls.target);
    this.controls.touches.ONE = THREE.TOUCH.ROTATE; this.controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
    this.controls.addEventListener('change', () => { this.dirty = true; }); this.controls.addEventListener('start', () => {
      if (this.transition?.followOverview && this.battle) {
        const target = new THREE.Vector3().fromArray(this.overviewCenter(this.battle));
        this.camera.position.add(target.clone().sub(this.controls.target)); this.controls.target.copy(target); this.followed.copy(target);
      }
      this.transition = null;
    }); this.controls.update();
    this.scene.add(new THREE.HemisphereLight(0xb9d4ff, 0x0a101c, .65));
    const key = new THREE.DirectionalLight(0xffedcd, 3.1); key.position.set(-400, 750, 900); this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x81b7ff, 2.2); rim.position.set(400, 200, -900); this.scene.add(rim);
    this.makeSpace(); this.makePlanet(); this.makeAttachments(); this.effects = this.makeEffects();
    this.bindInput();
    this.contextLost = event => { event.preventDefault(); if (!this.disposed) this.onUnavailable?.('Die 3D-Ansicht wurde vom Browser unterbrochen. Du kannst die Probeschlacht erneut starten.'); };
    canvas.addEventListener('webglcontextlost', this.contextLost);
  }

  bindInput() {
    this.pointerStart = event => {
      if (this.pointer) this.pointer.multiple = true;
      else this.pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false, multiple: false };
    };
    this.pointerMove = event => { if (this.pointer && Math.hypot(event.clientX - this.pointer.x, event.clientY - this.pointer.y) > 7) this.pointer.moved = true; };
    this.pointerEnd = event => {
      const pointer = this.pointer;
      if (!pointer || pointer.id !== event.pointerId) return;
      this.pointer = null;
      if (pointer.moved || pointer.multiple || this.disposed) return;
      const picked = this.pickContact?.(event.clientX, event.clientY);
      if (picked !== undefined) { if (picked) this.onSelect?.(picked); return; }
      const rect = this.canvas.getBoundingClientRect();
      const position = new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
      this.raycaster.setFromCamera(position, this.camera);
      const candidates = [...this.ships.values()].filter(s => s.group.visible).map(s => s.body);
      const hit = this.raycaster.intersectObjects(candidates, true)[0];
      if (hit) this.onSelect?.(hit.object.userData.shipId);
    };
    this.pointerCancel = () => { this.pointer = null; };
    for (const [name, handler] of [['pointerdown', this.pointerStart], ['pointermove', this.pointerMove], ['pointerup', this.pointerEnd], ['pointercancel', this.pointerCancel]]) this.canvas.addEventListener(name, handler);
  }

  makeSpace() {
    let seed = 3077;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const coordinates = [], colors = [];
    for (let i = 0; i < 1000; i++) {
      const direction = this.a.set(random() - .5, random() - .5, random() - .5).normalize().multiplyScalar(14000 + random() * 8000);
      coordinates.push(direction.x, direction.y, direction.z);
      const light = .35 + random() * .65; colors.push(light * .8, light * .88, light);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(coordinates, 3)); geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    this.scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({ size: 1, vertexColors: true, sizeAttenuation: false, transparent: true, opacity: .85, depthWrite: false })));
    // Bake the soft background once, instead of running a full-screen shader every frame.
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#030610'; ctx.fillRect(0, 0, 1024, 512);
    for (const [x, y, radius, color] of [[220, 240, 320, '#16395685'], [760, 180, 240, '#40395d50'], [370, 305, 150, '#5b728f32']]) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius); gradient.addColorStop(0, color); gradient.addColorStop(1, '#05081300');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1024, 512);
    }
    for (let i = 0; i < 32; i++) {
      const x = 160 + random() * 430, y = 230 + Math.sin(i * .22) * 50, radius = 35 + random() * 75;
      const cloud = ctx.createRadialGradient(x, y, 0, x, y, radius); cloud.addColorStop(0, '#00030b36'); cloud.addColorStop(1, '#00030b00');
      ctx.fillStyle = cloud; ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(27000, 24, 16), new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide, depthWrite: false, toneMapped: false })));
  }

  makePlanet() {
    // Procedural surface is evaluated during loading; the animated view samples a texture.
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d'), image = ctx.createImageData(512, 256);
    const hash = (x, y, z) => { let value = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return value - Math.floor(value); };
    const noise = (x, y, z) => {
      const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z); let fx = x - ix, fy = y - iy, fz = z - iz;
      fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
      const mix = (a, b, f) => a + (b - a) * f;
      return mix(mix(mix(hash(ix, iy, iz), hash(ix + 1, iy, iz), fx), mix(hash(ix, iy + 1, iz), hash(ix + 1, iy + 1, iz), fx), fy), mix(mix(hash(ix, iy, iz + 1), hash(ix + 1, iy, iz + 1), fx), mix(hash(ix, iy + 1, iz + 1), hash(ix + 1, iy + 1, iz + 1), fx), fy), fz);
    };
    for (let y = 0; y < 256; y++) for (let x = 0; x < 512; x++) {
      const latitude = y / 255 * Math.PI, longitude = x / 511 * Math.PI * 2;
      const px = Math.sin(latitude) * Math.cos(longitude), py = Math.cos(latitude), pz = Math.sin(latitude) * Math.sin(longitude);
      const terrain = noise(px * 4, py * 4, pz * 4) * .65 + noise(px * 11 + 3, py * 11, pz * 11) * .25 + noise(px * 27, py * 27, pz * 27) * .1;
      const land = Math.max(0, Math.min(1, (terrain - .47) * 15));
      const cloud = Math.max(0, (noise(px * 12 + 18, py * 12 + 3, pz * 12) - .57) * 2.1);
      const ice = Math.max(0, Math.min(1, (Math.abs(py) - .88 + terrain * .05) * 12));
      const sea = [9, 35, 60], ground = [35 + terrain * 28, 51 + terrain * 32, 48 + terrain * 25];
      for (let c = 0; c < 3; c++) {
        let color = sea[c] + (ground[c] - sea[c]) * land; color += ([167, 193, 204][c] - color) * ice; color += (185 - color) * cloud;
        image.data[(y * 512 + x) * 4 + c] = color;
      }
      image.data[(y * 512 + x) * 4 + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    const planet = new THREE.Mesh(new THREE.SphereGeometry(1250, 64, 40), new THREE.MeshStandardMaterial({ map: texture, color: 0x60758b, metalness: .05, roughness: .9, envMapIntensity: .04 }));
    planet.position.set(-2700, -1450, -4400); planet.rotation.z = -.3; this.scene.add(planet);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1275, 48, 28), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide,
      vertexShader: 'varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec3 vNormal;void main(){float rim=pow(1.-abs(vNormal.z),3.);gl_FragColor=vec4(.18,.48,1.,rim*.42);}',
    }));
    atmosphere.position.copy(planet.position); this.scene.add(atmosphere);
  }

  makeAttachments() {
    const base = new THREE.CylinderGeometry(.45, .6, .45, 8), barrel = new THREE.CylinderGeometry(.12, .17, 1.55, 6);
    barrel.rotateX(Math.PI / 2); barrel.translate(0, 0, -.8);
    const geometry = mergeGeometries([base, barrel]); base.dispose(); barrel.dispose();
    this.gunBatch = new THREE.InstancedMesh(geometry, new THREE.MeshStandardMaterial({ color: 0x586b81, metalness: .85, roughness: .3, envMapIntensity: 1.1 }), 16);
    this.coreBatch = new THREE.InstancedMesh(new THREE.SphereGeometry(.23, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xc9ebff).multiplyScalar(4), toneMapped: false }), 16);
    const plume = new THREE.ConeGeometry(.34, 2.9, 8, 1, true);
    const uv = plume.attributes.uv, colors = new Float32Array(uv.count * 3);
    for (let i = 0; i < uv.count; i++) { const fade = (1 - uv.getY(i)) ** 2; colors.set([fade, fade, fade], i * 3); }
    plume.setAttribute('color', new THREE.BufferAttribute(colors, 3)); plume.rotateX(Math.PI / 2); plume.translate(0, 0, 1.5);
    this.plumeBatch = new THREE.InstancedMesh(plume, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: .65, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }), 16);
    for (const batch of [this.gunBatch, this.coreBatch, this.plumeBatch]) { batch.count = 0; batch.frustumCulled = false; batch.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.scene.add(batch); }
  }

  async load(battle) {
    const loader = new GLTFLoader(this.loadingManager), names = [...new Set(Object.values(DEMO_CLASSES).map(s => s.model))]; let loaded = 0;
    for (let i = 0; i < names.length; i += 2) {
      const results = await Promise.allSettled(names.slice(i, i + 2).map(async name => {
        const model = await loader.loadAsync(new URL(`../models/quaternius/${name}.glb`, import.meta.url).href);
        if (this.disposed) { this.releaseObjects([model.scene]); return; }
        this.models.set(name, model.scene); this.onProgress?.(++loaded, names.length);
      }));
      const failure = results.find(result => result.status === 'rejected'); if (failure) throw failure.reason;
      if (this.disposed) return;
    }
    for (const ship of battle.ships) this.makeShip(ship);
    this.resize(); this.setMode('ship', battle, false);
    await this.renderer.compileAsync(this.scene, this.camera);
  }

  makeShip(ship) {
    const def = DEMO_CLASSES[ship.type], color = COLORS[ship.side], body = this.models.get(this.modelName(ship)).clone(true);
    const bounds = new THREE.Box3().setFromObject(body), size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
    const scale = (ship.length ?? def.size) / Math.max(size.x, size.y, size.z); size.multiplyScalar(scale);
    body.position.copy(center).multiplyScalar(-scale); body.scale.setScalar(scale);
    const bodyRoot = new THREE.Group(); bodyRoot.add(body); this.orientBody(bodyRoot, ship);
    bodyRoot.updateWorldMatrix(true, true); new THREE.Box3().setFromObject(bodyRoot).getSize(size);
    body.traverse(object => {
      if (!object.isMesh) return;
      object.userData.shipId = ship.id;
      this.prepareMaterial(object, ship);
    });
    const group = new THREE.Group(); group.add(bodyRoot); group.updateWorldMatrix(true, true);
    const attachmentRay = new THREE.Raycaster();
    const surface = (point, direction) => { attachmentRay.set(point, direction); return attachmentRay.intersectObject(bodyRoot, true)[0]?.point; };
    const engines = [], guns = [];
    for (const sign of [-1, 1]) {
      let mount;
      for (const fraction of [.27, .36, .15]) { mount = surface(this.a.set(sign * size.x * fraction, -size.y * .12, size.z), FORWARD); if (mount) break; }
      if (mount) {
        const engine = new THREE.Object3D(); engine.position.copy(mount); engine.position.z += .15;
        const plume = new THREE.Object3D(); engine.add(plume); group.add(engine); engines.push({ engine, plume });
      }
      mount = null;
      for (const fraction of [.14, .26, .36, .04]) { mount = surface(this.a.set(sign * size.x * fraction, size.y + 2, -size.z * .05), this.b.set(0, -1, 0)); if (mount) break; }
      if (mount) { const gun = new THREE.Object3D(); gun.position.copy(mount); gun.position.y += .2; gun.userData.baseZ = gun.position.z; group.add(gun); guns.push(gun); }
    }
    const shield = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(color).multiplyScalar(2) }, strength: { value: 0 }, hit: { value: new THREE.Vector3(0, 0, -1) }, age: { value: 0 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec3 vNormal;varying vec3 vView;varying vec3 vLocal;void main(){vec4 p=modelViewMatrix*vec4(position,1.);vLocal=normalize(position);vNormal=normalize(normalMatrix*normal);vView=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
      fragmentShader: `uniform vec3 color;uniform float strength;uniform vec3 hit;uniform float age;varying vec3 vNormal;varying vec3 vView;varying vec3 vLocal;
      void main(){float d=acos(clamp(dot(normalize(vLocal),normalize(hit)),-1.,1.));float wave=exp(-pow((d-age*4.)*11.,2.));float spot=exp(-d*d*7.)*exp(-age*3.);float rim=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),3.);
      gl_FragColor=vec4(color,(wave*.48+spot*.6+rim*.08)*strength);}`,
    }));
    shield.scale.set(size.x * .6 + .6, size.y * .65 + 1.1, size.z * .6 + .6); shield.visible = false; group.add(shield);
    group.position.fromArray(ship.position); if (ship.side === 'enemy') group.rotation.y = Math.PI;
    this.scene.add(group); this.ships.set(ship.id, { group, body: bodyRoot, engines, guns, shield, size, pulse: 0, hit: new THREE.Vector3(0, 0, -1), hitAge: 2, death: null, recoil: 0 });
  }

  modelName(ship) { return DEMO_CLASSES[ship.type].model; }
  orientBody(root) { root.rotation.y = Math.PI; }
  makeEffects() { return new BattleEffects(this.scene, this.camera); }
  beforeRender() {}
  visibleShip(ship, living, age) { return living || age < 4; }
  prepareMaterial(object, ship) {
      object.material = object.material.clone();
      object.material.color.multiply(new THREE.Color(ship.side === 'friendly' ? 0xaec4d8 : 0xcfb5b9));
      object.material.metalness = .55; object.material.roughness = .46; object.material.envMapIntensity = .85;
      object.material.normalMap = this.panelMap; object.material.normalScale.set(.22, .22);
      object.material.emissive.set(0x0a1424); object.material.emissiveIntensity = .12;
      object.userData.baseColor = object.material.color.clone();
      if (object.material.map) object.material.map.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
  }
  updateMaterial(object, health, living) {
    object.material.color.copy(object.userData.baseColor).multiplyScalar(living ? .6 + .4 * health : .22);
    object.material.emissive.set(health < .5 ? 0x45140a : 0x0a1424); object.material.emissiveIntensity = health < .5 ? .35 : .12;
  }

  resize() {
    if (this.disposed) return;
    const width = Math.max(1, this.canvas.clientWidth), height = Math.max(1, this.canvas.clientHeight);
    this.renderer.setSize(width, height, false); this.camera.aspect = width / height;
    this.presentation.resize(width, height, this.pixelRatio);
    const toolbar = document.querySelector('.battle-toolbar')?.getBoundingClientRect().bottom ?? 0;
    const targetHud = document.querySelector('.target-hud')?.getBoundingClientRect().bottom ?? 0;
    this.viewportTop = Math.max(toolbar + 18, targetHud + 10);
    this.viewportBottom = document.querySelector('.battle-bottom')?.getBoundingClientRect().top ?? height;
    this.camera.setViewOffset(width, height, 0, height / 2 - (this.viewportTop + this.viewportBottom) / 2, width, height);
    this.camera.updateProjectionMatrix(); this.dirty = true;
  }

  setMode(mode, battle, animated = true) {
    const startPosition = this.camera.position.clone(), startTarget = this.controls.target.clone();
    this.mode = mode;
    const focusId = mode === 'target' ? battle.target : battle.selected, focus = this.ships.get(focusId);
    const enemy = mode === 'target'; this.focusId = focusId;
    const elevation = Math.min(1, Math.max(.25, (this.viewportBottom - this.viewportTop) / 260));
    if ((mode === 'ship' || mode === 'target') && focus) {
      this.controls.target.copy(focus.group.position);
      const sign = enemy ? -1 : 1;
      this.camera.position.copy(focus.group.position).add(this.a.set(sign * 2.65, 1.45 * elevation, sign * 3.65).multiplyScalar(DEMO_CLASSES[battle.ships.find(s => s.id === focusId).type].size));
    } else if (mode === 'overview') {
      const friendly = this.a.fromArray(fleetCenter(battle, 'friendly')), hostile = this.b.fromArray(fleetCenter(battle, 'enemy'));
      const separation = friendly.distanceTo(hostile);
      this.controls.target.copy(friendly).add(hostile).multiplyScalar(.5);
      const free = Math.max(.15, (this.viewportBottom - this.viewportTop) / this.canvas.clientHeight);
      const distance = separation * .57 / Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) / free;
      this.camera.position.copy(this.controls.target).add(this.a.set(.16, .84, .52).normalize().multiplyScalar(distance));
    } else {
      this.controls.target.fromArray(fleetCenter(battle, enemy ? 'enemy' : 'friendly'));
      this.camera.position.copy(this.controls.target).add(this.a.set(enemy ? -60 : 60, 65 * elevation, enemy ? -295 : 295));
    }
    this.followed.copy(this.controls.target);
    if (animated && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.transition = { position: startPosition, target: startTarget, endPosition: this.camera.position.clone(), endTarget: this.controls.target.clone(), elapsed: 0 };
      this.camera.position.copy(startPosition); this.controls.target.copy(startTarget);
    } else this.transition = null;
    this.controls.update(); this.dirty = true;
  }

  updateAttachments(battle, time) {
    let guns = 0, engines = 0;
    for (const ship of battle.ships) {
      const view = this.ships.get(ship.id); if (!view?.group.visible || !activeShip(ship)) continue;
      if (!view.authoredGuns) for (const gun of view.guns) this.gunBatch.setMatrixAt(guns++, gun.matrixWorld);
      for (const { engine, plume } of view.engines) {
        this.coreBatch.setMatrixAt(engines, engine.matrixWorld);
        plume.scale.z = (ship.order === 'retreat' ? 1.8 : .65) * (1 + Math.sin(time * 19 + ship.position[0]) * .08);
        plume.updateWorldMatrix(true, false); this.plumeBatch.setMatrixAt(engines, plume.matrixWorld); this.plumeBatch.setColorAt(engines++, this.color.set(view.engineColor ?? COLORS[ship.side]).multiplyScalar(2));
      }
    }
    this.gunBatch.count = guns; this.coreBatch.count = this.plumeBatch.count = engines;
    for (const batch of [this.gunBatch, this.coreBatch, this.plumeBatch]) batch.instanceMatrix.needsUpdate = true;
    if (this.plumeBatch.instanceColor) this.plumeBatch.instanceColor.needsUpdate = true;
  }

  render(battle, time, events = [], frameSeconds = 0) {
    if (this.disposed) return;
    const delta = Math.min(.1, Math.max(0, frameSeconds));
    const now = performance.now(), cameraDelta = Math.min(.06, Math.max(0, (now - (this.lastCameraFrame ?? now)) / 1000)); this.lastCameraFrame = now;
    for (const event of events) if (event.kind === 'destroy') { const view = this.ships.get(event.ship); if (view) view.death = time; }
    for (const ship of battle.ships) {
      const view = this.ships.get(ship.id); if (!view) continue;
      const living = activeShip(ship), wreckAge = view.death === null ? 100 : time - view.death;
      view.living = living;
      view.group.visible = this.visibleShip(ship, living, wreckAge); view.group.position.fromArray(ship.position);
      if (!living) {
        view.body.rotation.z = wreckAge * .2; view.body.rotation.x = wreckAge * .08;
        view.body.scale.setScalar(Math.max(.15, 1 - Math.max(0, wreckAge - 2) * .4));
      } else view.body.rotation.z = Math.sin(time * .32 + ship.position[0]) * .012;
      const health = ship.hull / DEMO_CLASSES[ship.type].hull;
      view.body.traverse(object => { if (object.isMesh) this.updateMaterial(object, health, living); });
      const target = demoTarget(battle, ship);
      this.a.copy(ship.facing ? this.b.fromArray(ship.facing) : ship.order === 'retreat' ? this.b.set(0, 0, 1) : target ? this.b.fromArray(target.position).sub(view.group.position).normalize() : ship.side === 'friendly' ? FORWARD : this.b.set(0, 0, 1));
      this.quaternion.setFromUnitVectors(FORWARD, this.a);
      if (ship.facing) view.group.quaternion.copy(this.quaternion);
      else view.group.quaternion.slerp(this.quaternion, delta ? 1 - Math.exp(-5 * delta) : 0);
      if (target && !view.fixedWeapons) {
        view.group.updateWorldMatrix(true, false);
        const aim = view.group.worldToLocal(this.a.fromArray(target.position));
        for (const gun of view.guns) gun.rotation.y = Math.atan2(-aim.x, -aim.z);
      }
      view.pulse = Math.max(0, view.pulse - delta * 3);
      view.hitAge += delta; view.recoil = Math.max(0, view.recoil - delta * 7);
      for (const gun of view.guns) gun.position.z = gun.userData.baseZ + view.recoil * .22;
      view.group.updateWorldMatrix(true, true);
    }
    this.effects.update(battle, time, events, this.ships);
    for (const view of this.ships.values()) {
      view.shield.visible = view.pulse > .01 && view.group.visible && view.living;
      view.shield.material.uniforms.strength.value = view.pulse; view.shield.material.uniforms.age.value = view.hitAge; view.shield.material.uniforms.hit.value.copy(view.hit);
    }
    const focusId = this.inspectionId ?? (this.mode === 'target' ? battle.target : battle.selected);
    if ((this.mode === 'ship' || this.mode === 'target') && focusId !== this.focusId) this.setMode(this.mode, battle);
    if (this.transition) {
      const transition = this.transition; transition.elapsed += cameraDelta;
      if (transition.followOverview && this.mode === 'overview') {
        this.a.fromArray(this.overviewCenter(battle)); this.b.subVectors(this.a, this.followed);
        transition.endPosition.add(this.b); transition.endTarget.add(this.b); this.followed.copy(this.a);
      }
      const progress = Math.min(1, transition.elapsed / .65), eased = progress * progress * (3 - 2 * progress);
      this.camera.position.lerpVectors(transition.position, transition.endPosition, eased); this.controls.target.lerpVectors(transition.target, transition.endTarget, eased);
      if (progress === 1) this.transition = null;
    } else if (this.mode !== 'overview' || this.overviewFollowsFleet) {
      if (this.mode === 'ship' || this.mode === 'target') this.a.copy(this.ships.get(focusId)?.group.position ?? this.controls.target);
      else this.a.fromArray(this.overviewCenter?.(battle) ?? fleetCenter(battle, 'friendly'));
      this.b.subVectors(this.a, this.followed); this.camera.position.add(this.b); this.controls.target.add(this.b); this.followed.copy(this.a);
    }
    this.updateAttachments(battle, time);
    this.animating = this.effects.animating || Boolean(this.transition) || [...this.ships.values()].some(view => view.pulse > .01 || view.death !== null && time - view.death < 4);
    this.dirty = false; this.controls.update(); this.beforeRender(battle, time); this.presentation.render(this.scene, this.camera);
  }

  labelPosition(id, battle) {
    if (id.startsWith('fleet:')) this.a.fromArray(fleetCenter(battle, id.split(':')[1]));
    else {
      const view = this.ships.get(id); if (!view?.group.visible) return null;
      this.a.copy(view.group.position); this.a.y += view.size.y * .55 + 1.5;
    }
    this.a.project(this.camera);
    const width = this.canvas.clientWidth, height = this.canvas.clientHeight;
    let x = (this.a.x + 1) * width / 2, y = (1 - this.a.y) * height / 2 - (id.startsWith('fleet:') ? 13 : 8);
    const offscreen = this.a.z < -1 || this.a.z > 1 || x < 12 || x > width - 12 || y < this.viewportTop + 14 || y > this.viewportBottom - 14;
    const arrow = x > width / 2 ? y < (this.viewportTop + this.viewportBottom) / 2 ? '↗' : '↘' : y < (this.viewportTop + this.viewportBottom) / 2 ? '↖' : '↙';
    if (!id.startsWith('fleet:') && this.a.z > 1) return null;
    x = Math.max(14, Math.min(width - 14, x)); y = Math.max(this.viewportTop + 18, Math.min(this.viewportBottom - 18, y));
    return { x, y, offscreen, arrow };
  }

  focusBounds(battle) {
    if (this.mode === 'overview') return null;
    const view = this.ships.get(this.mode === 'target' ? battle.target : battle.selected);
    if (!view?.group.visible) return null;
    let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
    for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
      this.a.set(x * view.size.x / 2, y * view.size.y / 2, z * view.size.z / 2).applyMatrix4(view.group.matrixWorld).project(this.camera);
      if (this.a.z < -1 || this.a.z > 1) return null;
      const px = (this.a.x + 1) * this.canvas.clientWidth / 2, py = (1 - this.a.y) * this.canvas.clientHeight / 2;
      left = Math.min(left, px); right = Math.max(right, px); top = Math.min(top, py); bottom = Math.max(bottom, py);
    }
    left = Math.max(8, left - 7); right = Math.min(this.canvas.clientWidth - 8, right + 7);
    top = Math.max(this.viewportTop + 8, top - 7); bottom = Math.min(this.viewportBottom - 8, bottom + 7);
    if (right - left < 10 || bottom - top < 6) return null;
    return { x: left, y: top, width: right - left, height: bottom - top };
  }

  releaseObjects(objects) {
    const geometries = new Set(), materials = new Set(), textures = new Set();
    for (const root of objects) root.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : object.material ? [object.material] : []) {
        materials.add(material); for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      }
    });
    for (const geometry of geometries) geometry.dispose(); for (const material of materials) material.dispose();
    const images = new Set(); for (const texture of textures) { if (texture.image) images.add(texture.image); texture.dispose(); }
    for (const image of images) image.close?.();
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true; this.loadingManager.abort(); this.controls.dispose(); this.canvas.removeEventListener('webglcontextlost', this.contextLost);
    for (const [name, handler] of [['pointerdown', this.pointerStart], ['pointermove', this.pointerMove], ['pointerup', this.pointerEnd], ['pointercancel', this.pointerCancel]]) this.canvas.removeEventListener(name, handler);
    this.releaseObjects([this.scene, ...this.models.values()]); this.models.clear(); this.ships.clear();
    this.presentation.dispose(); this.environmentTarget.dispose();
    this.renderer.dispose(); this.renderer.forceContextLoss();
  }
}
