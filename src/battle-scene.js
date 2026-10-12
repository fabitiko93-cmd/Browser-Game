import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DEMO_CLASSES, activeShip, demoTarget } from './battle-demo.js';

const COLORS = { friendly: 0x71bfff, enemy: 0xff8499 };
const AXIS = new THREE.Vector3(0, 1, 0), FORWARD = new THREE.Vector3(0, 0, -1);

export class BattleScene {
  constructor(canvas, { onSelect, onUnavailable, onProgress } = {}) {
    this.canvas = canvas;
    this.onSelect = onSelect;
    this.onUnavailable = onUnavailable;
    this.onProgress = onProgress;
    this.models = new Map();
    this.ships = new Map();
    this.effects = [];
    this.disposed = false;
    this.mode = 'overview';
    this.raycaster = new THREE.Raycaster();
    this.lastQualityCheck = 0;
    this.slowFrames = 0;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.pixelRatio = Math.min(devicePixelRatio || 1, 1.5);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.65;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050813);
    this.camera = new THREE.PerspectiveCamera(44, 1, .2, 1600);
    this.camera.position.copy(this.overviewPosition());
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = .08;
    this.controls.minDistance = 18;
    this.controls.maxDistance = 370;
    this.controls.rotateSpeed = .55;
    this.controls.zoomSpeed = .75;
    this.controls.maxPolarAngle = Math.PI * .88;
    this.controls.target.set(0, 0, 3);
    this.controls.touches.ONE = THREE.TOUCH.ROTATE;
    this.controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
    this.controls.update();
    this.scene.add(new THREE.HemisphereLight(0xb9d4ff, 0x27273d, 2));
    const key = new THREE.DirectionalLight(0xecf2ff, 3.2);
    key.position.set(-40, 75, 70);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x6487ff, 2.6);
    rim.position.set(20, -15, -60);
    this.scene.add(rim);
    this.makeSpace();
    this.makePlanet();
    this.beamGeometry = new THREE.CylinderGeometry(1, 1, 2, 6, 1, true);
    this.sparkGeometry = new THREE.SphereGeometry(1, 8, 6);
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
    for (let i = 0; i < 1700; i++) {
      const direction = new THREE.Vector3(random() - .5, random() - .5, random() - .5).normalize().multiplyScalar(430 + random() * 470);
      coordinates.push(direction.x, direction.y, direction.z);
      const light = .35 + random() * .65;
      colors.push(light * .8, light * .88, light);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(coordinates, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    this.scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({ size: 1.1, vertexColors: true, sizeAttenuation: false, transparent: true, opacity: .85, depthWrite: false })));
    const nebula = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: 'varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec3 vDirection;void main(){vec3 p=normalize(vDirection);float a=sin(p.x*8.+p.z*5.)*sin(p.y*6.-p.x*3.);float b=sin(p.z*13.+p.y*7.)*sin(p.x*17.+p.y*9.);float cloud=pow(max(0.,a*.65+b*.2),3.);vec3 c=vec3(.016,.023,.049)+cloud*vec3(.035,.057,.115);gl_FragColor=vec4(c,1.);}',
    });
    this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(1100, 24, 16), nebula));
  }

  makePlanet() {
    const material = new THREE.ShaderMaterial({
      vertexShader: 'varying vec3 vNormal;varying vec3 vPosition;void main(){vNormal=normalize(normalMatrix*normal);vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: `
        varying vec3 vNormal;varying vec3 vPosition;
        float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
        float noise3(vec3 p){vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1.,0.,0.)),f.x),mix(hash(i+vec3(0.,1.,0.)),hash(i+vec3(1.,1.,0.)),f.x),f.y),mix(mix(hash(i+vec3(0.,0.,1.)),hash(i+vec3(1.,0.,1.)),f.x),mix(hash(i+vec3(0.,1.,1.)),hash(i+vec3(1.,1.,1.)),f.x),f.y),f.z);}
        float terrain(vec3 p){float n=0.;float a=.55;for(int i=0;i<4;i++){n+=noise3(p)*a;p=p*2.13+vec3(3.1,1.7,2.3);a*=.48;}return n;}
        void main(){vec3 p=normalize(vPosition);float n=terrain(p*5.);float land=smoothstep(.47,.53,n);vec3 sea=vec3(.025,.085,.16);vec3 ground=mix(vec3(.11,.17,.17),vec3(.23,.27,.24),n);vec3 c=mix(sea,ground,land);float ice=smoothstep(.78,.98,abs(p.y)+n*.13);c=mix(c,vec3(.6,.71,.76),ice);float cloud=smoothstep(.5,.69,terrain(p*9.+vec3(18.,3.,2.)));c=mix(c,vec3(.56,.65,.74),cloud*.6);float light=max(.045,dot(normalize(vNormal),normalize(vec3(-.65,.6,.5))));float edge=pow(1.-max(0.,vNormal.z),4.);gl_FragColor=vec4(c*light+vec3(.12,.31,.61)*edge*.24,1.);}
      `,
    });
    const planet = new THREE.Mesh(new THREE.SphereGeometry(36, 48, 32), material);
    planet.position.set(-87, -39, -135);
    planet.rotation.z = -.3;
    this.scene.add(planet);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(37.2, 40, 24), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide,
      vertexShader: 'varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec3 vNormal;void main(){float rim=pow(1.-abs(vNormal.z),3.);gl_FragColor=vec4(.15,.38,.8,rim*.24);}',
    }));
    atmosphere.position.copy(planet.position);
    this.scene.add(atmosphere);
  }

  async load(battle) {
    const loader = new GLTFLoader();
    const modelNames = [...new Set(Object.values(DEMO_CLASSES).map(s => s.model))];
    let loaded = 0;
    for (let i = 0; i < modelNames.length; i += 2) {
      const results = await Promise.allSettled(modelNames.slice(i, i + 2).map(async name => {
        const model = await loader.loadAsync(new URL(`../models/quaternius/${name}.glb`, import.meta.url).href);
        if (this.disposed) { this.releaseObjects([model.scene]); return; }
        this.models.set(name, model.scene);
        this.onProgress?.(++loaded, modelNames.length);
      }));
      const failure = results.find(result => result.status === 'rejected');
      if (failure) throw failure.reason;
      if (this.disposed) return;
    }
    for (const ship of battle.ships) this.makeShip(ship);
    this.resize();
  }

  makeShip(ship) {
    const def = DEMO_CLASSES[ship.type], color = COLORS[ship.side];
    const body = this.models.get(def.model).clone(true);
    const bounds = new THREE.Box3().setFromObject(body), sourceSize = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
    const scale = def.size / Math.max(sourceSize.x, sourceSize.y, sourceSize.z);
    body.position.copy(center).multiplyScalar(-scale);
    body.scale.setScalar(scale);
    const bodyRoot = new THREE.Group();
    bodyRoot.add(body);
    bodyRoot.rotation.y = Math.PI;
    body.traverse(object => {
      if (!object.isMesh) return;
      object.userData.shipId = ship.id;
      object.material = object.material.clone();
      object.material.color.set(ship.side === 'friendly' ? 0xcde4ff : 0xf5c5ce);
      object.material.map.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    });
    const group = new THREE.Group();
    group.add(bodyRoot);
    const size = sourceSize.multiplyScalar(scale);
    group.updateWorldMatrix(true, true);
    const attachmentRay = new THREE.Raycaster();
    const surface = (point, direction) => {
      attachmentRay.set(point, direction);
      return attachmentRay.intersectObject(bodyRoot, true)[0]?.point;
    };
    const flameMaterial = new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(color) } }, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform vec3 color;varying vec2 vUv;void main(){float fade=pow(1.-vUv.y,2.)*pow(sin(vUv.x*3.14159),2.);gl_FragColor=vec4(color,fade*.65);}',
    });
    const engines = [];
    for (const sign of [-1, 1]) {
      const engine = new THREE.Group();
      let mount;
      for (const fraction of [.27, .36, .15]) {
        mount = surface(new THREE.Vector3(sign * size.x * fraction, -size.y * .12, size.z), FORWARD);
        if (mount) break;
      }
      if (!mount) continue;
      engine.position.copy(mount); engine.position.z += .15;
      const core = new THREE.Mesh(new THREE.SphereGeometry(.18, 8, 6), new THREE.MeshBasicMaterial({ color: 0xc9ebff, toneMapped: false }));
      const plume = new THREE.Mesh(new THREE.ConeGeometry(.34, 2.9, 10, 1, true), flameMaterial);
      plume.rotation.x = Math.PI / 2; plume.position.z = 1.5;
      engine.add(core, plume);
      group.add(engine);
      engines.push(engine);
    }
    const guns = [];
    const gunMaterial = new THREE.MeshStandardMaterial({ color: 0x637b91, metalness: .75, roughness: .4 });
    for (const sign of [-1, 1]) {
      const pivot = new THREE.Group();
      let mount;
      for (const fraction of [.14, .26, .36, .04]) {
        mount = surface(new THREE.Vector3(sign * size.x * fraction, size.y + 2, -size.z * .05), new THREE.Vector3(0, -1, 0));
        if (mount) break;
      }
      pivot.position.copy(mount ?? new THREE.Vector3(0, 0, 0)); pivot.position.y += .2;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(.45, .6, .45, 8), gunMaterial);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(.12, .17, 1.55, 6), gunMaterial);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.z = -.8;
      pivot.add(base, barrel);
      pivot.visible = Boolean(mount);
      group.add(pivot);
      guns.push(pivot);
    }
    const shield = new THREE.Mesh(new THREE.SphereGeometry(1, 22, 14), new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(color) }, strength: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec3 vNormal;varying vec3 vView;void main(){vec4 p=modelViewMatrix*vec4(position,1.);vNormal=normalize(normalMatrix*normal);vView=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
      fragmentShader: 'uniform vec3 color;uniform float strength;varying vec3 vNormal;varying vec3 vView;void main(){float rim=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),2.);gl_FragColor=vec4(color,(.12+rim*.7)*strength);}',
    }));
    shield.scale.set(size.x * .6 + .6, size.y * .65 + 1.1, size.z * .6 + .6);
    shield.visible = false;
    group.add(shield);
    if (ship.side === 'enemy') group.rotation.y = Math.PI;
    this.scene.add(group);
    this.ships.set(ship.id, { group, body: bodyRoot, engines, guns, shield, size, pulse: 0 });
  }

  resize() {
    const width = this.canvas.clientWidth, height = this.canvas.clientHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    const top = document.querySelector('.battle-toolbar')?.getBoundingClientRect().bottom ?? 0;
    const bottom = document.querySelector('.battle-bottom')?.getBoundingClientRect().top ?? height;
    this.camera.setViewOffset(width, height, 0, height / 2 - (top + bottom) / 2, width, height);
    this.camera.updateProjectionMatrix();
  }

  overviewPosition() {
    const ratio = this.canvas.clientHeight / Math.max(1, this.canvas.clientWidth);
    return new THREE.Vector3(68, 90, 137).multiplyScalar(Math.max(1.06, Math.min(1.3, ratio / 1.8)));
  }

  setMode(mode, battle) {
    this.mode = mode;
    const ship = this.ships.get(battle.selected);
    if (mode === 'ship' && ship) {
      this.controls.target.copy(ship.group.position);
      this.camera.position.copy(ship.group.position).add(new THREE.Vector3(1.6, 1.1, 2.4).multiplyScalar(DEMO_CLASSES[battle.ships.find(s => s.id === battle.selected).type].size));
    } else {
      this.controls.target.set(0, 0, 3);
      this.camera.position.copy(this.overviewPosition());
    }
    this.controls.update();
  }

  beam(from, to, color, time) {
    const midpoint = from.clone().add(to).multiplyScalar(.5), direction = to.clone().sub(from);
    const object = new THREE.Group();
    for (const [thickness, opacity] of [[.065, .95], [.36, .35]]) {
      const ray = new THREE.Mesh(this.beamGeometry, new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
      ray.scale.set(thickness, direction.length() / 2, thickness);
      object.add(ray);
    }
    object.position.copy(midpoint);
    object.quaternion.setFromUnitVectors(AXIS, direction.normalize());
    this.scene.add(object);
    this.effects.push({ object, created: time, duration: .13, kind: 'beam' });
  }

  flash(position, color, time, large = false) {
    const object = new THREE.Group();
    for (let i = 0; i < (large ? 10 : 4); i++) {
      const spark = new THREE.Mesh(this.sparkGeometry, new THREE.MeshBasicMaterial({ color: i === 0 ? 0xffe7c2 : color, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false }));
      spark.userData.velocity = new THREE.Vector3(Math.sin(i * 2.4), Math.cos(i * 1.8), Math.sin(i * 3.7)).multiplyScalar(large ? 13 : 2.7);
      object.add(spark);
    }
    object.position.copy(position);
    this.scene.add(object);
    this.effects.push({ object, created: time, duration: large ? .95 : .18, kind: large ? 'explosion' : 'spark' });
  }

  render(battle, time, events = [], frameSeconds = 0) {
    if (this.disposed) return;
    const frameDelta = Math.min(.1, Math.max(0, frameSeconds));
    for (const ship of battle.ships) {
      const view = this.ships.get(ship.id);
      if (!view) continue;
      view.group.visible = activeShip(ship);
      const previous = view.group.position.clone();
      view.group.position.set(...ship.position);
      view.group.position.y += Math.sin(time * .75 + ship.position[0]) * .25;
      const target = demoTarget(battle, ship);
      const direction = ship.order === 'retreat' ? new THREE.Vector3(0, 0, 1) : target ? new THREE.Vector3(...target.position).sub(view.group.position).normalize() : FORWARD.clone();
      view.group.quaternion.slerp(new THREE.Quaternion().setFromUnitVectors(FORWARD, direction), frameDelta ? 1 - Math.exp(-5 * frameDelta) : 0);
      view.group.updateWorldMatrix(true, true);
      for (const gun of view.guns) {
        if (!target) continue;
        const aim = view.group.worldToLocal(new THREE.Vector3(...target.position));
        gun.rotation.y = Math.atan2(-aim.x, -aim.z);
      }
      for (const engine of view.engines) engine.children[1].scale.y = (ship.order === 'retreat' ? 1.65 : 1) * (1 + Math.sin(time * 19 + ship.position[0]) * .1);
      view.pulse = Math.max(0, view.pulse - frameDelta * 2.2);
      view.shield.visible = view.pulse > .01 && view.group.visible;
      view.shield.material.uniforms.strength.value = view.pulse;
      if (this.mode === 'ship' && ship.id === battle.selected && previous.lengthSq()) {
        const delta = view.group.position.clone().sub(previous);
        this.camera.position.add(delta);
        this.controls.target.add(delta);
        const correction = view.group.position.clone().sub(this.controls.target).multiplyScalar(.1);
        this.camera.position.add(correction);
        this.controls.target.add(correction);
      }
    }
    for (const event of events) {
      const view = this.ships.get(event.ship);
      if (!view) continue;
      if (event.kind === 'fire') {
        const target = this.ships.get(event.target);
        if (!target) continue;
        const source = view.guns[0].localToWorld(new THREE.Vector3(0, .2, -1.6));
        const impact = target.group.position.clone();
        this.beam(source, impact, COLORS[battle.ships.find(s => s.id === event.ship).side], time);
        if (event.shield) target.pulse = .9;
        this.flash(impact, event.shield ? COLORS[battle.ships.find(s => s.id === event.target).side] : 0xffaa65, time);
      } else if (event.kind === 'destroy') this.flash(view.group.position.clone(), 0xff964e, time, true);
    }
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i], age = time - effect.created;
      if (age > effect.duration) {
        this.scene.remove(effect.object);
        effect.object.traverse(object => object.material?.dispose());
        this.effects.splice(i, 1);
        continue;
      }
      for (const child of effect.object.children) {
        child.material.opacity = (effect.kind === 'beam' ? .85 : .9) * Math.max(0, 1 - age / effect.duration);
        if (effect.kind !== 'beam') {
          child.position.copy(child.userData.velocity).multiplyScalar(age);
          child.scale.setScalar(effect.kind === 'explosion' ? .4 + Math.sin(age / effect.duration * Math.PI) * 2.7 : .35);
        }
      }
    }
    if (frameSeconds > .045) this.slowFrames++;
    if (time - this.lastQualityCheck > 4) {
      if (this.slowFrames > 45 && this.pixelRatio > 1) { this.pixelRatio = 1; this.renderer.setPixelRatio(this.pixelRatio); this.resize(); }
      this.slowFrames = 0;
      this.lastQualityCheck = time;
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  labelPosition(id) {
    const view = this.ships.get(id);
    if (!view?.group.visible) return null;
    const position = view.group.position.clone();
    position.y += view.size.y * .6 + 1.5;
    position.project(this.camera);
    if (position.z < -1 || position.z > 1 || Math.abs(position.x) > .95 || Math.abs(position.y) > .95) return null;
    return { x: (position.x + 1) * this.canvas.clientWidth / 2, y: (1 - position.y) * this.canvas.clientHeight / 2 };
  }

  releaseObjects(objects) {
    const geometries = new Set(), materials = new Set(), textures = new Set();
    const collect = root => root.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : object.material ? [object.material] : []) {
        materials.add(material);
        for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      }
    });
    for (const object of objects) collect(object);
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    const images = new Set();
    for (const texture of textures) { if (texture.image) images.add(texture.image); texture.dispose(); }
    for (const image of images) image.close?.();
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.controls.dispose();
    this.canvas.removeEventListener('webglcontextlost', this.contextLost);
    for (const [name, handler] of [['pointerdown', this.pointerStart], ['pointermove', this.pointerMove], ['pointerup', this.pointerEnd], ['pointercancel', this.pointerCancel]]) this.canvas.removeEventListener(name, handler);
    this.releaseObjects([this.scene, ...this.models.values()]);
    this.beamGeometry.dispose(); this.sparkGeometry.dispose();
    this.models.clear(); this.ships.clear(); this.effects.length = 0;
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
