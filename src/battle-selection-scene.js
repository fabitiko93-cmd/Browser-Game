import * as THREE from 'three';
import { battleSelection } from './battle-selection.js';

export class BattleSelectionOverlay {
  constructor(scene) {
    const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(100 * 6), 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('lineDistance', new THREE.BufferAttribute(new Float32Array(100 * 2), 1).setUsage(THREE.DynamicDrawUsage));
    geometry.setDrawRange(0, 0);
    this.lines = new THREE.LineSegments(geometry, new THREE.LineDashedMaterial({ color: 0x75b4ca, dashSize: 18, gapSize: 16, transparent: true, opacity: .32, depthTest: false, depthWrite: false, toneMapped: false }));
    this.lines.frustumCulled = false; this.lines.renderOrder = 18; this.lines.visible = false;
    const points = new THREE.BufferGeometry();
    for (const [name, size] of [['position', 3], ['role', 1]]) points.setAttribute(name, new THREE.BufferAttribute(new Float32Array(100 * size), size).setUsage(THREE.DynamicDrawUsage));
    points.setDrawRange(0, 0);
    this.points = new THREE.Points(points, new THREE.ShaderMaterial({
      transparent: true, depthTest: false, depthWrite: false, toneMapped: false, uniforms: { pixelRatio: { value: 1 } },
      vertexShader: 'attribute float role;varying float vRole;uniform float pixelRatio;void main(){vRole=role;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=(role>.5?18.:14.)*pixelRatio;}',
      fragmentShader: 'varying float vRole;void main(){vec2 p=gl_PointCoord*2.-1.;float r=vRole>.5?abs(p.x)+abs(p.y):length(p);float a=smoothstep(.65,.77,r)*(1.-smoothstep(.9,1.,r));gl_FragColor=vec4(mix(vec3(.44,.82,.9),vec3(.95,.68,.4),vRole),a*.75);}',
    }));
    this.points.frustumCulled = false; this.points.renderOrder = 22; this.points.visible = false;
    this.paths=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(new Float32Array(100*18),3).setUsage(THREE.DynamicDrawUsage)),new THREE.LineBasicMaterial({color:0x91c5a5,transparent:true,opacity:.32,depthTest:false,depthWrite:false,toneMapped:false}));
    this.paths.geometry.setDrawRange(0,0);this.paths.frustumCulled=false;this.paths.renderOrder=17;
    scene.add(this.lines, this.points,this.paths); this.state = { sources: [], targets: [], links: [] };
  }
  ensureCapacity(count){
    if(this.points.geometry.attributes.position.count>=count)return;
    for(const [name,size] of [['position',3],['role',1]])this.points.geometry.setAttribute(name,new THREE.BufferAttribute(new Float32Array(count*size),size).setUsage(THREE.DynamicDrawUsage));
    for(const [name,size] of [['position',3],['lineDistance',1]])this.lines.geometry.setAttribute(name,new THREE.BufferAttribute(new Float32Array(count*2*size),size).setUsage(THREE.DynamicDrawUsage));
    this.paths.geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(count*18),3).setUsage(THREE.DynamicDrawUsage));
  }
  update(battle, selection, visible, pixelRatio, showLines = true) {
    this.ensureCapacity(battle.ships.length);
    this.state = battleSelection(battle, selection);
    const byId = new Map(battle.ships.map(s => [s.id, s])), positions = this.lines.geometry.attributes.position, distances = this.lines.geometry.attributes.lineDistance;
    let count = 0;
    for (const link of this.state.links) {
      positions.setXYZ(count * 2, ...byId.get(link.source).position); positions.setXYZ(count * 2 + 1, ...byId.get(link.target).position); count++;
      distances.setX(count * 2 - 2, 0); distances.setX(count * 2 - 1, Math.hypot(...byId.get(link.source).position.map((v, i) => v - byId.get(link.target).position[i])));
    }
    positions.needsUpdate = distances.needsUpdate = true; this.lines.geometry.setDrawRange(0, count * 2);
    this.lines.material.opacity = count > 12 ? .16 : .32; this.lines.visible = visible && showLines && count > 0;
    const points = this.points.geometry.attributes; count = 0;
    for (const [ids, role] of [[this.state.sources, 0], [this.state.targets, 1]]) for (const id of ids) {
      points.position.setXYZ(count, ...byId.get(id).position); points.role.setX(count++, role);
    }
    points.position.needsUpdate = points.role.needsUpdate = true; this.points.geometry.setDrawRange(0, count);
    this.points.material.uniforms.pixelRatio.value = pixelRatio; this.points.visible = visible && count > 0;
    const selectedGroups=new Set(this.state.sources.map(id=>byId.get(id)?.group)),path=this.paths.geometry.attributes.position;let vertices=0;
    for(const g of battle.navigation?.groups??[]){
      if(!selectedGroups.has(g.id))continue;
      const fleet=battle.navigation.fleets.find(f=>f.side===g.side);
      let route=['fleet','regroup'].includes(g.mode)?[[...fleet.anchor].map((v,i)=>v+g.offset[i])]:g.route.slice(g.stage);
      if(g.mode==='hold'||g.mode==='fleet'&&fleet.mode==='hold')route=[];
      if(g.mode==='fleet'&&fleet.mode!=='hold')route=fleet.route.slice(fleet.stage).map(p=>p.map((v,i)=>v+g.offset[i]));
      let previous=g.anchor;
      for(const goal of route){if(Math.hypot(...goal.map((v,i)=>v-previous[i]))>5){path.setXYZ(vertices++,...previous);path.setXYZ(vertices++,...goal);}previous=goal;}
    }
    path.needsUpdate=true;this.paths.geometry.setDrawRange(0,vertices);this.paths.visible=visible&&vertices>0;
  }
}
