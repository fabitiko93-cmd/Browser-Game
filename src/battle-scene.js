import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { DEMO_CLASSES, activeShip, demoTarget, fleetCenter } from './battle-demo.js';
import { BattleEffects } from './battle-effects.js';

const COLORS = { friendly: 0x71bfff, enemy: 0xff8499 };
const FORWARD = new THREE.Vector3(0, 0, -1);

export class BattleScene {
  constructor(canvas, { onSelect, onUnavailable, onProgress } = {}) {
    this.canvas = canvas; this.onSelect = onSelect; this.onUnavailable = onUnavailable; this.onProgress = onProgress;
    this.models = new Map(); this.ships = new Map(); this.disposed = false; this.mode = 'ship'; this.dirty = true;
    this.a = new THREE.Vector3(); this.b = new THREE.Vector3(); this.quaternion = new THREE.Quaternion(); this.color = new THREE.Color();
    this.followed = new THREE.Vector3(); this.raycaster = new THREE.Raycaster();
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.pixelRatio = Math.min(devicePixelRatio || 1, 1);
    this.renderer.setPixelRatio(this.pixelRatio); this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.5;
    this.scene = new THREE.Scene(); this.scene.background = new THREE.Color(0x050813);
    this.camera = new THREE.PerspectiveCamera(42, 1, 1, 35000);
    this.camera.position.set(65, 65, 1610);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true; this.controls.dampingFactor = .12;
    this.controls.minDistance = 18; this.controls.maxDistance = 12000;
    this.controls.rotateSpeed = .55; this.controls.zoomSpeed = .75; this.controls.maxPolarAngle = Math.PI * .88;
    this.controls.target.set(0, 0, 1000); this.followed.copy(this.controls.target);
    this.controls.touches.ONE = THREE.TOUCH.ROTATE; this.controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
    this.controls.addEventListener('change', () => { this.dirty = true; }); this.controls.update();
    this.scene.add(new THREE.HemisphereLight(0xb9d4ff, 0x27273d, 2));
    const key = new THREE.DirectionalLight(0xecf2ff, 3.2); key.position.set(-400, 750, 700); this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x6487ff, 2.6); rim.position.set(200, -150, -600); this.scene.add(rim);
    this.makeSpace(); this.makePlanet(); this.makeAttachments(); this.effects = new BattleEffects(this.scene, this.camera);
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
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#050813'; ctx.fillRect(0, 0, 512, 256);
    for (const [x, y, radius, color] of [[110, 120, 200, '#1b2d513b'], [390, 180, 120, '#30335b32']]) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius); gradient.addColorStop(0, color); gradient.addColorStop(1, '#05081300');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 512, 256);
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
    const planet = new THREE.Mesh(new THREE.SphereGeometry(520, 40, 24), new THREE.MeshPhongMaterial({ map: texture, shininess: 8, specular: 0x142a3e }));
    planet.position.set(-3300, -1300, -8300); planet.rotation.z = -.3; this.scene.add(planet);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(531, 32, 20), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide,
      vertexShader: 'varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec3 vNormal;void main(){float rim=pow(1.-abs(vNormal.z),3.);gl_FragColor=vec4(.15,.38,.8,rim*.2);}',
    }));
    atmosphere.position.copy(planet.position); this.scene.add(atmosphere);
  }

  makeAttachments() {
    const base = new THREE.CylinderGeometry(.45, .6, .45, 8), barrel = new THREE.CylinderGeometry(.12, .17, 1.55, 6);
    barrel.rotateX(Math.PI / 2); barrel.translate(0, 0, -.8);
    const geometry = mergeGeometries([base, barrel]); base.dispose(); barrel.dispose();
    this.gunBatch = new THREE.InstancedMesh(geometry, new THREE.MeshPhongMaterial({ color: 0x637b91, shininess: 45 }), 16);
    this.coreBatch = new THREE.InstancedMesh(new THREE.SphereGeometry(.23, 6, 4), new THREE.MeshBasicMaterial({ color: 0xc9ebff, toneMapped: false }), 16);
    const plume = new THREE.ConeGeometry(.34, 2.9, 8, 1, true);
    const uv = plume.attributes.uv, colors = new Float32Array(uv.count * 3);
    for (let i = 0; i < uv.count; i++) { const fade = (1 - uv.getY(i)) ** 2; colors.set([fade, fade, fade], i * 3); }
    plume.setAttribute('color', new THREE.BufferAttribute(colors, 3)); plume.rotateX(Math.PI / 2); plume.translate(0, 0, 1.5);
    this.plumeBatch = new THREE.InstancedMesh(plume, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: .65, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }), 16);
    for (const batch of [this.gunBatch, this.coreBatch, this.plumeBatch]) { batch.count = 0; batch.frustumCulled = false; batch.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.scene.add(batch); }
  }

  async load(battle) {
    const loader = new GLTFLoader(), names = [...new Set(Object.values(DEMO_CLASSES).map(s => s.model))]; let loaded = 0;
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
    this.resize(); this.setMode('ship', battle);
  }

  makeShip(ship) {
    const def = DEMO_CLASSES[ship.type], color = COLORS[ship.side], body = this.models.get(def.model).clone(true);
    const bounds = new THREE.Box3().setFromObject(body), size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
    const scale = def.size / Math.max(size.x, size.y, size.z); size.multiplyScalar(scale);
    body.position.copy(center).multiplyScalar(-scale); body.scale.setScalar(scale);
    const bodyRoot = new THREE.Group(); bodyRoot.add(body); bodyRoot.rotation.y = Math.PI;
    body.traverse(object => {
      if (!object.isMesh) return;
      object.userData.shipId = ship.id;
      object.material = new THREE.MeshPhongMaterial({ map: object.material.map, color: ship.side === 'friendly' ? 0xd5e8ff : 0xffd3d9, shininess: 48, specular: 0x77899c, emissive: 0x142039, emissiveIntensity: .16 });
      if (object.material.map) object.material.map.anisotropy = Math.min(2, this.renderer.capabilities.getMaxAnisotropy());
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
      if (mount) { const gun = new THREE.Object3D(); gun.position.copy(mount); gun.position.y += .2; group.add(gun); guns.push(gun); }
    }
    const shield = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(color) }, strength: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec3 vNormal;varying vec3 vView;void main(){vec4 p=modelViewMatrix*vec4(position,1.);vNormal=normalize(normalMatrix*normal);vView=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
      fragmentShader: 'uniform vec3 color;uniform float strength;varying vec3 vNormal;varying vec3 vView;void main(){float rim=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),2.);gl_FragColor=vec4(color,(.12+rim*.7)*strength);}',
    }));
    shield.scale.set(size.x * .6 + .6, size.y * .65 + 1.1, size.z * .6 + .6); shield.visible = false; group.add(shield);
    group.position.fromArray(ship.position); if (ship.side === 'enemy') group.rotation.y = Math.PI;
    this.scene.add(group); this.ships.set(ship.id, { group, body: bodyRoot, engines, guns, shield, size, pulse: 0 });
  }

  resize() {
    if (this.disposed) return;
    const width = Math.max(1, this.canvas.clientWidth), height = Math.max(1, this.canvas.clientHeight);
    this.renderer.setSize(width, height, false); this.camera.aspect = width / height;
    const toolbar = document.querySelector('.battle-toolbar')?.getBoundingClientRect().bottom ?? 0;
    const notice = document.querySelector('.battle-notice')?.getBoundingClientRect().bottom ?? 0;
    this.viewportTop = Math.max(toolbar + 42, notice + 7);
    this.viewportBottom = document.querySelector('.battle-bottom')?.getBoundingClientRect().top ?? height;
    this.camera.setViewOffset(width, height, 0, height / 2 - (this.viewportTop + this.viewportBottom) / 2, width, height);
    this.camera.updateProjectionMatrix(); this.dirty = true;
  }

  setMode(mode, battle) {
    this.mode = mode;
    const focusId = mode === 'target' ? battle.target : battle.selected, focus = this.ships.get(focusId);
    const enemy = mode === 'target'; this.focusId = focusId;
    const elevation = Math.min(1, Math.max(.25, (this.viewportBottom - this.viewportTop) / 260));
    if ((mode === 'ship' || mode === 'target') && focus) {
      this.controls.target.copy(focus.group.position);
      const sign = enemy ? -1 : 1;
      this.camera.position.copy(focus.group.position).add(this.a.set(sign * .6, .7 * elevation, sign * 4.2).multiplyScalar(DEMO_CLASSES[battle.ships.find(s => s.id === focusId).type].size));
    } else if (mode === 'overview') {
      const friendly = this.a.fromArray(fleetCenter(battle, 'friendly')), hostile = this.b.fromArray(fleetCenter(battle, 'enemy'));
      const separation = friendly.distanceTo(hostile);
      this.controls.target.copy(friendly).add(hostile).multiplyScalar(.5);
      const free = Math.max(.15, (this.viewportBottom - this.viewportTop) / this.canvas.clientHeight);
      const distance = separation * .57 / Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) / free;
      this.camera.position.copy(this.controls.target).add(this.a.set(.16, .84, .52).normalize().multiplyScalar(distance));
    } else {
      this.controls.target.fromArray(fleetCenter(battle, enemy ? 'enemy' : 'friendly'));
      this.camera.position.copy(this.controls.target).add(this.a.set(enemy ? -65 : 65, 65 * elevation, enemy ? -610 : 610));
    }
    this.followed.copy(this.controls.target); this.controls.update(); this.dirty = true;
  }

  updateAttachments(battle, time) {
    let guns = 0, engines = 0;
    for (const ship of battle.ships) {
      const view = this.ships.get(ship.id); if (!view?.group.visible) continue;
      for (const gun of view.guns) this.gunBatch.setMatrixAt(guns++, gun.matrixWorld);
      for (const { engine, plume } of view.engines) {
        this.coreBatch.setMatrixAt(engines, engine.matrixWorld);
        plume.scale.z = (ship.order === 'retreat' ? 1.8 : .65) * (1 + Math.sin(time * 19 + ship.position[0]) * .08);
        plume.updateWorldMatrix(true, false); this.plumeBatch.setMatrixAt(engines, plume.matrixWorld); this.plumeBatch.setColorAt(engines++, this.color.set(COLORS[ship.side]));
      }
    }
    this.gunBatch.count = guns; this.coreBatch.count = this.plumeBatch.count = engines;
    for (const batch of [this.gunBatch, this.coreBatch, this.plumeBatch]) batch.instanceMatrix.needsUpdate = true;
    if (this.plumeBatch.instanceColor) this.plumeBatch.instanceColor.needsUpdate = true;
  }

  render(battle, time, events = [], frameSeconds = 0) {
    if (this.disposed) return;
    const delta = Math.min(.1, Math.max(0, frameSeconds));
    for (const ship of battle.ships) {
      const view = this.ships.get(ship.id); if (!view) continue;
      view.group.visible = activeShip(ship); view.group.position.fromArray(ship.position);
      const target = demoTarget(battle, ship);
      this.a.copy(ship.order === 'retreat' ? this.b.set(0, 0, 1) : target ? this.b.fromArray(target.position).sub(view.group.position).normalize() : ship.side === 'friendly' ? FORWARD : this.b.set(0, 0, 1));
      this.quaternion.setFromUnitVectors(FORWARD, this.a); view.group.quaternion.slerp(this.quaternion, delta ? 1 - Math.exp(-5 * delta) : 0);
      if (target) {
        view.group.updateWorldMatrix(true, false);
        const aim = view.group.worldToLocal(this.a.fromArray(target.position));
        for (const gun of view.guns) gun.rotation.y = Math.atan2(-aim.x, -aim.z);
      }
      view.pulse = Math.max(0, view.pulse - delta * 3);
      view.group.updateWorldMatrix(true, true);
    }
    for (const event of events) if (event.kind === 'impact' && event.shield) { const target = this.ships.get(event.target); if (target) target.pulse = .85; }
    for (const view of this.ships.values()) { view.shield.visible = view.pulse > .01 && view.group.visible; view.shield.material.uniforms.strength.value = view.pulse; }
    const focusId = this.mode === 'target' ? battle.target : battle.selected;
    if ((this.mode === 'ship' || this.mode === 'target') && focusId !== this.focusId) this.setMode(this.mode, battle);
    if (this.mode !== 'overview') {
      if (this.mode === 'ship' || this.mode === 'target') this.a.copy(this.ships.get(focusId)?.group.position ?? this.controls.target);
      else this.a.fromArray(fleetCenter(battle, 'friendly'));
      this.b.subVectors(this.a, this.followed); this.camera.position.add(this.b); this.controls.target.add(this.b); this.followed.copy(this.a);
    }
    this.updateAttachments(battle, time); this.effects.update(battle, time, events, this.ships);
    this.animating = this.effects.beams.length > 0 || this.effects.particles.length > 0 || [...this.ships.values()].some(view => view.pulse > .01);
    this.dirty = false; this.controls.update(); this.renderer.render(this.scene, this.camera);
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
    this.disposed = true; this.controls.dispose(); this.canvas.removeEventListener('webglcontextlost', this.contextLost);
    for (const [name, handler] of [['pointerdown', this.pointerStart], ['pointermove', this.pointerMove], ['pointerup', this.pointerEnd], ['pointercancel', this.pointerCancel]]) this.canvas.removeEventListener(name, handler);
    this.releaseObjects([this.scene, ...this.models.values()]); this.models.clear(); this.ships.clear();
    this.renderer.dispose(); this.renderer.forceContextLoss();
  }
}
