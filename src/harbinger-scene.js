import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { BattleScene } from './battle-scene.js';
import { DEMO_CLASSES, activeShip, commandedShips, demoTarget, fleetCenter } from './battle-demo.js';

export class HarbingerScene extends BattleScene {
  constructor(canvas, callbacks = {}) {
    super(canvas, callbacks);
    this.abort = new AbortController(); this.graphics = 'auto'; this.onAssetProgress = callbacks.onAssetProgress;
    this.renderer.toneMappingExposure = 1.18; this.scene.environmentIntensity = 1.6;
    this.camera.fov = 38; this.camera.near = .15;
    this.farField = new THREE.Group();
    for (const object of [...this.scene.children]) if (object.isPoints || object.isMesh && object.geometry.parameters?.radius === 27000) this.farField.add(object);
    this.scene.add(this.farField);
    [this.sun, this.rim] = this.scene.children.filter(object => object.isDirectionalLight);
    this.sun.color.set(0xffebd3); this.sun.intensity = 5.6;
    this.rim.color.set(0x9bc4ee); this.rim.intensity = 2.4;
    this.scene.add(this.sun.target, this.rim.target);
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = false; this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    Object.assign(this.sun.shadow.camera, { left: -34, right: 34, top: 34, bottom: -34, near: 10, far: 1500 });
    this.sun.shadow.bias = -.00012; this.sun.shadow.normalBias = .025; this.lastShadow = -10;
    this.ktx = new KTX2Loader(this.loadingManager).setTranscoderPath(new URL('../vendor/basis/', import.meta.url).href).setWorkerLimit(2).detectSupport(this.renderer);
    for (const key of ['coreBatch', 'plumeBatch']) {
      const old = this[key], next = new THREE.InstancedMesh(old.geometry, old.material, 32);
      next.count = 0; next.frustumCulled = false; next.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      old.removeFromParent(); old.dispose(); this.scene.add(next); this[key] = next;
    }
    this.coreBatch.material.color.set(0xffffff).multiplyScalar(3);
    this.plumeBatch.geometry.dispose(); this.plumeBatch.material.dispose();
    const cone = new THREE.ConeGeometry(.42, 3.6, 24, 8, true); cone.rotateX(Math.PI / 2); cone.translate(0, 0, 1.85);
    this.plumeBatch.geometry = cone;
    this.plumeBatch.setColorAt(0, new THREE.Color(0xffba82));
    this.plumeBatch.material = new THREE.ShaderMaterial({ uniforms: { time: { value: 0 } }, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false,
      vertexShader: `varying vec2 vUv;varying vec3 vTint;varying vec3 vNormal;varying vec3 vView;
      void main(){vUv=uv;vTint=instanceColor;vec4 p=modelViewMatrix*instanceMatrix*vec4(position,1.);
      vNormal=normalize(normalMatrix*mat3(instanceMatrix)*normal);vView=normalize(-p.xyz);gl_Position=projectionMatrix*p;}`,
      fragmentShader: `uniform float time;varying vec2 vUv;varying vec3 vTint;varying vec3 vNormal;varying vec3 vView;
      void main(){float edge=pow(abs(dot(normalize(vNormal),normalize(vView))),1.7);float tail=pow(1.-vUv.y,2.4);
      float fade=smoothstep(0.,.06,vUv.y)*(1.-smoothstep(.7,1.,vUv.y));float bands=.85+.15*sin(vUv.y*38.-time*17.);
      gl_FragColor=vec4(mix(vTint*1.7,vTint*.25,vUv.y),edge*tail*bands*fade*.46);}` });
    const coordinates = [];
    for (let p = -2000; p <= 2000; p += 500) coordinates.push(p,-55,-2000,p,-55,2000,-2000,-55,p,2000,-55,p);
    this.grid = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(coordinates,3)),new THREE.LineBasicMaterial({color:0x4b7089,transparent:true,opacity:.18,depthWrite:false}));
    this.scene.add(this.grid);
    this.orders = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(new Float32Array(48),3)),new THREE.LineBasicMaterial({color:0x6a9ab8,transparent:true,opacity:.3,depthWrite:false}));
    this.orders.geometry.setDrawRange(0,0); this.orders.frustumCulled=false; this.scene.add(this.orders);
  }
  makePlanet() {}
  async load(battle) {
    const signal = this.abort.signal, base = new URL('../models/harbinger/', import.meta.url);
    const response = await fetch(new URL('manifest.json', base), { signal });
    if (!response.ok) throw new Error('Model manifest unavailable');
    const manifest = await response.json(), buffers = new Array(manifest.parts.length);
    let cursor = 0, loaded = 0;
    await Promise.all(Array.from({length:4}, async () => {
      while (cursor < manifest.parts.length) {
        const index = cursor++, part = manifest.parts[index];
        const result = await fetch(new URL(part.file, base), { signal });
        if (!result.ok) throw new Error('Model part unavailable');
        const bytes = new Uint8Array(await result.arrayBuffer());
        if (bytes.byteLength !== part.bytes) throw new Error('Incomplete model part');
        buffers[index] = bytes; loaded += bytes.byteLength; this.onAssetProgress?.(loaded, manifest.bytes);
      }
    }));
    const bytes = new Uint8Array(manifest.bytes); let offset = 0;
    for (let i=0;i<buffers.length;i++) { bytes.set(buffers[i],offset); offset+=buffers[i].length; buffers[i]=null; }
    if (new DataView(bytes.buffer).getUint32(8,true) !== manifest.bytes) throw new Error('Incomplete model');
    const loader = new GLTFLoader(this.loadingManager).setKTX2Loader(this.ktx);
    const model = await loader.parseAsync(bytes.buffer, base.href);
    if (this.disposed) { this.releaseObjects([model.scene]); return; }
    this.models.set('harbinger', model.scene);
    for (const name of ['challenger','striker','spitfire']) {
      const value = await loader.loadAsync(new URL(`../models/quaternius/${name}.glb`,import.meta.url).href);
      if (this.disposed) { this.releaseObjects([value.scene]); return; }
      this.models.set(name,value.scene);
    }
    for (const ship of battle.ships) this.makeShip(ship);
    this.resize(); this.setMode('ship',battle,false); this.beforeRender(battle,0);
    await this.renderer.compileAsync(this.scene,this.camera);
  }
  modelName(ship) { return ship.type === 'cruiser' ? 'harbinger' : super.modelName(ship); }
  orientBody(root,ship) { root.rotation.y = ship.type === 'cruiser' ? Math.PI/2 : Math.PI; }
  visibleShip(ship,living,age) {
    if (!super.visibleShip(ship,living,age)) return false;
    if (this.mode === 'ship' || this.mode === 'target') return ship.id === this.focusId;
    return this.mode !== 'fleet' || ship.side === 'friendly';
  }
  prepareMaterial(object,ship) {
    if (ship.type !== 'cruiser') return super.prepareMaterial(object,ship);
    object.material = object.material.clone();
    object.material.envMapIntensity = 1.15; object.material.emissiveIntensity = 2.2;
    object.castShadow = !object.material.transparent; object.receiveShadow = true;
    object.userData.authoredMaterial = true;
    object.userData.baseColor = object.material.color.clone(); object.userData.baseEmissive = object.material.emissive.clone();
    for (const key of ['map','normalMap','metalnessMap','roughnessMap','aoMap']) if(object.material[key]) object.material[key].anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy());
  }
  updateMaterial(object,health,living) {
    if (!object.userData.authoredMaterial) return super.updateMaterial(object,health,living);
    object.material.color.copy(object.userData.baseColor).multiplyScalar(living ? .78+.22*health : .18);
    object.material.emissive.copy(object.userData.baseEmissive); object.material.emissiveIntensity=living ? 2.2*(.5+.5*health) : 0;
  }
  makeShip(ship) {
    super.makeShip(ship); const view = this.ships.get(ship.id);
    if (ship.type !== 'cruiser') return;
    view.authoredGuns=true; view.engineColor=0xffb575;
    let glow; view.body.traverse(object=>{if(object.isMesh && object.material.name==='MainEngineGlow')glow=object;});
    if (!glow) return;
    const position=glow.geometry.attributes.position, normal=glow.geometry.attributes.normal;
    const indices=glow.geometry.index?.array ?? Array.from({length:position.count},(_,i)=>i);
    const parents=Array.from({length:position.count},(_,i)=>i);
    const find=i=>{while(parents[i]!==i){parents[i]=parents[parents[i]];i=parents[i];}return i;};
    const join=(a,b)=>{parents[find(a)]=find(b);}, duplicates=new Map();
    for(let i=0;i<position.count;i++){
      const key=[position.getX(i),position.getY(i),position.getZ(i)].map(x=>Math.round(x*10000)).join(':');
      if(duplicates.has(key))join(i,duplicates.get(key));else duplicates.set(key,i);
    }
    for(let i=0;i<indices.length;i+=3){join(indices[i],indices[i+1]);join(indices[i],indices[i+2]);}
    const parts=new Map();
    for(let i=0;i<position.count;i++){
      const key=find(i);if(!parts.has(key))parts.set(key,{center:new THREE.Vector3(),normal:new THREE.Vector3(),count:0});
      const part=parts.get(key);part.center.add(new THREE.Vector3().fromBufferAttribute(position,i));part.normal.add(new THREE.Vector3().fromBufferAttribute(normal,i));part.count++;
    }
    if(parts.size>8)return;
    for(const old of view.engines)old.engine.removeFromParent();view.engines=[];
    glow.updateWorldMatrix(true,false);const inverse=view.body.getWorldQuaternion(new THREE.Quaternion()).invert();
    for(const part of parts.values()){
      const point=part.center.divideScalar(part.count).applyMatrix4(glow.matrixWorld);
      const direction=part.normal.normalize().transformDirection(glow.matrixWorld).applyQuaternion(inverse).normalize();
      const engine=new THREE.Object3D(),plume=new THREE.Object3D();
      engine.position.copy(view.body.worldToLocal(point)).addScaledVector(direction,.15);engine.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),direction);
      plume.scale.x=plume.scale.y=1.35;engine.add(plume);view.body.add(engine);view.engines.push({engine,plume});
    }
  }
  updateAttachments(battle,time) {
    super.updateAttachments(battle,time);let index=0;
    for(const ship of battle.ships){const view=this.ships.get(ship.id);if(!view?.group.visible||!activeShip(ship))continue;
      for(const engine of view.engines)this.coreBatch.setColorAt(index++,new THREE.Color(view.engineColor??0xa8ddff));
    }
    if(this.coreBatch.instanceColor)this.coreBatch.instanceColor.needsUpdate=true;
  }
  resize() {
    if(this.disposed)return;
    const width=Math.max(1,this.canvas.clientWidth),height=Math.max(1,this.canvas.clientHeight);
    this.renderer.setSize(width,height,false);this.camera.aspect=width/height;this.presentation.resize(width,height,this.pixelRatio);
    this.viewportTop=(document.querySelector('.lab-top')?.getBoundingClientRect().bottom??110)+12;
    this.viewportBottom=(document.querySelector('.lab-dock')?.getBoundingClientRect().top??height-210)-12;
    this.camera.setViewOffset(width,height,0,height/2-(this.viewportTop+this.viewportBottom)/2,width,height);this.camera.updateProjectionMatrix();this.dirty=true;
  }
  setMode(mode,battle,animated=true) {
    const startPosition=this.camera.position.clone(),startTarget=this.controls.target.clone();this.mode=mode;
    this.focusId=mode==='target'?battle.target:battle.selected;
    const focus=this.ships.get(this.focusId),free=Math.max(.3,(this.viewportBottom-this.viewportTop)/this.canvas.clientHeight);
    if((mode==='ship'||mode==='target')&&focus){
      const sign=mode==='target'?-1:1;this.controls.target.copy(focus.group.position);
      this.camera.position.copy(this.controls.target).add(new THREE.Vector3(sign*1.1,1.9,sign*1.8));
      this.controls.minDistance=DEMO_CLASSES[battle.ships.find(s=>s.id===this.focusId).type].size*.75;this.fit([focus]);
    }else if(mode==='overview'){
      const own=new THREE.Vector3().fromArray(fleetCenter(battle,'friendly')),enemy=new THREE.Vector3().fromArray(fleetCenter(battle,'enemy'));
      this.controls.target.copy(own).add(enemy).multiplyScalar(.5);
      this.camera.position.copy(this.controls.target).add(new THREE.Vector3(.2,.86,.48).normalize().multiplyScalar(own.distanceTo(enemy)*.56/Math.tan(THREE.MathUtils.degToRad(19))/free));this.controls.minDistance=80;
    }else{
      this.controls.target.fromArray(fleetCenter(battle,'friendly'));this.camera.position.copy(this.controls.target).add(new THREE.Vector3(90,82,180));this.controls.minDistance=35;
      this.fit(battle.ships.filter(s=>s.side==='friendly'&&activeShip(s)).map(s=>this.ships.get(s.id)));
    }
    this.followed.copy(this.controls.target);
    this.transition=animated&&!matchMedia('(prefers-reduced-motion: reduce)').matches?{position:startPosition,target:startTarget,endPosition:this.camera.position.clone(),endTarget:this.controls.target.clone(),elapsed:0}:null;
    if(this.transition){this.camera.position.copy(startPosition);this.controls.target.copy(startTarget);}
    this.controls.update();this.renderer.shadowMap.needsUpdate=true;this.dirty=true;
  }
  fit(views) {
    this.camera.lookAt(this.controls.target);this.camera.updateMatrixWorld();
    const right=new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld,0),up=new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld,1),back=new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld,2);
    const height=this.canvas.clientHeight,center=(this.viewportTop+this.viewportBottom)/2,sy=this.camera.projectionMatrix.elements[5],sx=this.camera.projectionMatrix.elements[0];
    const upper=Math.max(40,center-this.viewportTop-28)*2/height,lower=Math.max(40,this.viewportBottom-center-24)*2/height;
    let distance=this.controls.minDistance*1.2;const p=new THREE.Vector3(),r=new THREE.Vector3();
    const include=world=>{r.copy(world).sub(this.controls.target);const x=r.dot(right),y=r.dot(up),z=r.dot(back);distance=Math.max(distance,z+Math.abs(x)*sx/.9,z+y*sy/(y>=0?upper:-lower));};
    for(const view of views){view.body.updateWorldMatrix(true,true);view.body.traverse(object=>{if(!object.isMesh)return;const vertices=object.geometry.attributes.position;for(let i=0;i<vertices.count;i++)include(p.fromBufferAttribute(vertices,i).applyMatrix4(object.matrixWorld));});
      for(const {engine}of view.engines)include(engine.localToWorld(p.set(0,0,4)));
    }
    this.camera.position.copy(this.controls.target).addScaledVector(back,distance*1.04);
  }
  beforeRender(battle,time) {
    this.farField.position.copy(this.camera.position);this.plumeBatch.material.uniforms.time.value=time;
    this.grid.visible=this.mode==='overview';this.orders.visible=this.mode==='overview'||this.mode==='fleet';
    let count=0;const points=this.orders.geometry.attributes.position.array;
    for(const ship of commandedShips(battle)){const target=demoTarget(battle,ship);if(target&&count<8){points.set(ship.position,count*6);points.set(target.position,count*6+3);count++;}}
    this.orders.geometry.setDrawRange(0,count*2);this.orders.geometry.attributes.position.needsUpdate=true;
    this.orders.material.color.set(commandedShips(battle).some(s=>s.targeting==='target')?0xe6b282:0x6a9ab8);
    const focus=this.ships.get(this.focusId);if(focus){this.sun.target.position.copy(focus.group.position);this.sun.position.copy(focus.group.position).add(new THREE.Vector3(-400,680,350));this.rim.target.position.copy(focus.group.position);this.rim.position.copy(focus.group.position).add(new THREE.Vector3(400,150,-500));}
    this.sun.castShadow=this.graphics!=='fluid'&&this.mode!=='overview';
    if(time-this.lastShadow>.18||this.transition||this.dirty){this.renderer.shadowMap.needsUpdate=true;this.lastShadow=time;}
  }
  setGraphics(value) {this.graphics=value;this.pixelRatio=value==='detail'?Math.min(1.75,devicePixelRatio||1):value==='fluid'?1:this.quality.ratio;this.renderer.setPixelRatio(this.pixelRatio);this.resize();}
  observeQuality(seconds,running) {if(this.graphics!=='auto'||!this.quality.observe(seconds,running))return false;this.pixelRatio=this.quality.ratio;this.renderer.setPixelRatio(this.pixelRatio);this.resize();return true;}
  dispose() {if(this.disposed)return;this.abort?.abort();this.ktx?.dispose();this.sun?.shadow.dispose();super.dispose();}
}
