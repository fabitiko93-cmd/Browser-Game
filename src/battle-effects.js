import * as THREE from 'three';
import { WEAPONS, DEMO_CLASSES, activeShip } from './battle-demo.js';

const MAX_PROJECTILES = 64, MAX_BEAMS = 24, MAX_PARTICLES = 192, MAX_DEBRIS = 96;
const UP = new THREE.Vector3(0, 1, 0);
const billboardVertex = `varying vec2 vUv;varying vec3 vTint;
void main(){vUv=uv;vTint=instanceColor;vec4 p=modelViewMatrix*instanceMatrix*vec4(0.,0.,0.,1.);
vec2 size=vec2(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz));p.xy+=position.xy*size;gl_Position=projectionMatrix*p;}`;

// Persistent GPU buffers serve the entire battle, including damage and wrecks.
export class BattleEffects {
  constructor(scene, camera) {
    this.scene = scene; this.camera = camera; this.beams = []; this.particles = []; this.debris = []; this.explosions = [];
    this.tracks = new Map(); this.lastDamage = new Map(); this.pings = [];
    this.object = new THREE.Object3D(); this.a = new THREE.Vector3(); this.b = new THREE.Vector3(); this.direction = new THREE.Vector3(); this.color = new THREE.Color();
    const material = opacity => new THREE.MeshBasicMaterial({ color: 0xffffff, blending: THREE.AdditiveBlending, transparent: true, opacity, depthWrite: false, toneMapped: false });
    this.glows = this.batch(new THREE.CylinderGeometry(1, 1, 1, 6, 1, true), material(.18), MAX_BEAMS);
    this.cores = this.batch(new THREE.CylinderGeometry(1, 1, 1, 6, 1, true), material(.95), MAX_BEAMS);
    this.heads = this.batch(new THREE.ConeGeometry(1, 3, 6), material(.95), MAX_PROJECTILES);
    this.bolts = this.batch(new THREE.CylinderGeometry(1, 1, 1, 5, 1, true), material(.85), MAX_PROJECTILES);
    this.wrecks = this.batch(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x96a3b1, metalness: .8, roughness: .55 }), MAX_DEBRIS);
    this.flashes = this.sprites(48); this.sparks = this.sprites(MAX_PARTICLES); this.smoke = this.sprites(48, true);
    this.rings = this.batch(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: billboardVertex,
      fragmentShader: `varying vec2 vUv;varying vec3 vTint;void main(){float r=length(vUv-.5)*2.;float a=exp(-pow((r-.72)*24.,2.))*(1.-smoothstep(.95,1.,r));gl_FragColor=vec4(vTint,a*.65);}`,
    }), 24);
    const geometry = new THREE.BufferGeometry();
    for (const name of ['position', 'color']) geometry.setAttribute(name, new THREE.BufferAttribute(new Float32Array(MAX_PROJECTILES * 8 * 6), 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setDrawRange(0, 0);
    this.trails = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: .75, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    this.trails.frustumCulled = false; scene.add(this.trails);
    this.lights = Array.from({ length: 3 }, () => { const light = new THREE.PointLight(0xffffff, 0, 55, 2); scene.add(light); return { light, until: -1, power: 0 }; });
  }
  batch(geometry, material, capacity) {
    const mesh = new THREE.InstancedMesh(geometry, material, capacity); mesh.count = 0; mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.setColorAt(0, this.color.set(0xffffff)); this.scene.add(mesh); return mesh;
  }
  sprites(capacity, smoke = false) {
    return this.batch(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: smoke ? THREE.NormalBlending : THREE.AdditiveBlending, vertexShader: billboardVertex,
      fragmentShader: `varying vec2 vUv;varying vec3 vTint;void main(){float r=length(vUv-.5)*2.;float a=exp(-r*r*${smoke ? '3.' : '7.'})*(1.-smoothstep(.75,1.,r));gl_FragColor=vec4(vTint,a*${smoke ? '.35' : '.8'});}`,
    }), capacity);
  }
  sprite(mesh, index, position, radius, color, brightness = 1) {
    this.object.position.fromArray(position); this.object.quaternion.identity(); this.object.scale.setScalar(radius * 2); this.object.updateMatrix();
    mesh.setMatrixAt(index, this.object.matrix); mesh.setColorAt(index, this.color.set(color).multiplyScalar(brightness));
  }
  line(index, from, to, color, brightness = 1) {
    const positions = this.trails.geometry.attributes.position.array, colors = this.trails.geometry.attributes.color.array;
    this.color.set(color).multiplyScalar(brightness);
    for (let i = 0; i < 3; i++) {
      positions[index * 6 + i] = from[i]; positions[index * 6 + i + 3] = to[i];
      colors[index * 6 + i] = colors[index * 6 + i + 3] = [this.color.r, this.color.g, this.color.b][i];
    }
  }
  cylinder(mesh, index, from, to, radius, color, brightness = 1) {
    this.a.fromArray(from); this.b.fromArray(to); this.direction.subVectors(this.b, this.a);
    this.object.position.copy(this.a).add(this.b).multiplyScalar(.5); this.object.quaternion.setFromUnitVectors(UP, this.direction.normalize());
    this.object.scale.set(radius, this.a.distanceTo(this.b), radius); this.object.updateMatrix();
    mesh.setMatrixAt(index, this.object.matrix); mesh.setColorAt(index, this.color.set(color).multiplyScalar(brightness));
  }
  flash(position, color, time, scale = 1, smoke = false) {
    for (let i = 0; i < (smoke ? 1 : 7); i++) {
      if (this.particles.length === MAX_PARTICLES) this.particles.shift();
      this.particles.push({ position: [...position], velocity: [Math.sin(i * 2.4), Math.cos(i * 1.8), Math.sin(i * 3.7)].map(v => v * (smoke ? 2 : 9) * scale),
        color: i ? color : 0xffeed1, time, duration: smoke ? 1.8 : .48, size: smoke ? scale : .3 * scale, smoke });
    }
  }
  light(position, color, time, power) {
    if (this.camera.position.distanceTo(this.a.fromArray(position)) > 300) return;
    const entry = this.lights.find(item => time >= item.until) ?? this.lights[0];
    entry.light.position.fromArray(position); entry.light.color.set(color); entry.until = time + .18; entry.power = power;
  }
  impact(event, ships) {
    const view = ships.get(event.target); if (!view) return event.position;
    this.a.fromArray(event.from ?? event.position).sub(view.group.position).normalize();
    this.b.copy(this.a).applyQuaternion(view.group.quaternion.clone().invert());
    view.hit.copy(this.b); view.hitAge = 0; view.pulse = event.shield ? 1 : view.pulse;
    this.b.multiply(view.shield.scale).multiplyScalar(event.shield ? 1 : .72).applyQuaternion(view.group.quaternion).add(view.group.position);
    return this.b.toArray();
  }
  destroy(event, time, ships) {
    const view = ships.get(event.ship); if (view) view.death = time;
    const size = view ? Math.max(view.size.x, view.size.y, view.size.z) : 15;
    this.explosions.push({ position: [...event.position], size, time });
    for (let i = 0; i < 18; i++) {
      if (this.debris.length === MAX_DEBRIS) this.debris.shift();
      this.debris.push({ position: event.position.map((v, axis) => v + Math.sin(i * (axis + 3)) * size * .22),
        velocity: [Math.sin(i * 4.7), Math.cos(i * 2.6), Math.sin(i * 1.9)].map(v => v * size * .6),
        size: size * (.025 + (i % 5) * .013), time, spin: i * 2.2 });
    }
    this.flash(event.position, 0xff9639, time, size * .15); this.light(event.position, 0xff9d45, time, 850);
  }
  update(battle, time, events, ships) {
    let flashes = 0, rings = 0;
    for (const event of events) {
      if (event.kind === 'fire') {
        const view = ships.get(event.ship), gun = view?.guns[Math.floor(event.day * 60) % 2] ?? view?.guns[0];
        const from = view?.fixedWeapons ? event.from : gun ? gun.localToWorld(this.a.set(0, .2, -1.65)).toArray() : event.from;
        if (view) { view.recoil = 1; view.muzzleTime = time; view.muzzle = [...from]; }
        if (event.weapon === 'laser') {
          if (this.beams.length === MAX_BEAMS) this.beams.shift();
          this.beams.push({ from: [...from], to: event.to, time });
        }
        this.flash(from, WEAPONS[event.weapon].color, time, event.weapon === 'torpedo' ? .7 : .35);
        this.light(from, WEAPONS[event.weapon].color, time, event.weapon === 'torpedo' ? 240 : 120);
        if (this.overview) this.pings.push({position:[...from],time,color:WEAPONS[event.weapon].color,impact:false});
      } else if (event.kind === 'impact') {
        const position = this.impact(event, ships), radius = event.weapon === 'torpedo' ? 2 : .7;
        this.flash(position, event.shield ? 0x8fcaff : 0xffac63, time, radius); this.light(position, event.shield ? 0x6ccaff : 0xff9b50, time, 180 * radius);
        if (this.overview) this.pings.push({position:[...position],time,color:event.shield?0x8fcaff:0xffac63,impact:true});
      } else if (event.kind === 'destroy') this.destroy(event, time, ships);
    }
    this.beams = this.beams.filter(beam => time - beam.time < .23);
    for (let i = 0; i < this.beams.length; i++) {
      const beam = this.beams[i], fade = 1 - (time - beam.time) / .23;
      const pixel=this.overview?this.camera.position.distanceTo(this.a.fromArray(beam.from))*2*Math.tan(THREE.MathUtils.degToRad(this.camera.fov/2))/(this.camera.userData.viewportHeight||844):0;
      this.cylinder(this.cores, i, beam.from, beam.to, Math.max(.11,pixel*.3), WEAPONS.laser.color, fade * 4);
      this.cylinder(this.glows, i, beam.from, beam.to, Math.max(.6,pixel), WEAPONS.laser.color, fade * 1.3);
    }
    this.cores.count = this.glows.count = this.beams.length;
    let heads = 0, bolts = 0, segments = 0;
    const live = new Set();
    for (const projectile of battle.projectiles.slice(0, MAX_PROJECTILES)) {
      const { position, velocity, weapon } = projectile, color = WEAPONS[weapon].color;
      live.add(projectile.id); this.a.fromArray(position);
      const radius = Math.max(weapon === 'torpedo' ? .48 : .2, this.camera.position.distanceTo(this.a) * .00045);
      this.object.position.copy(this.a); this.object.quaternion.setFromUnitVectors(UP, this.direction.fromArray(velocity).normalize());
      this.object.scale.set(radius, radius * (weapon === 'torpedo' ? 1.7 : 1), radius); this.object.updateMatrix();
      this.heads.setMatrixAt(heads, this.object.matrix); this.heads.setColorAt(heads++, this.color.set(color).multiplyScalar(2.5));
      if (flashes < 48) this.sprite(this.flashes, flashes++, position, radius * 3, color, 2);
      if (weapon === 'torpedo') {
        let track = this.tracks.get(projectile.id);
        if (!track) { track = { points: [], age: -1 }; this.tracks.set(projectile.id, track); }
        if (track.age !== projectile.age) { track.points.push([...position]); if (track.points.length > 8) track.points.shift(); track.age = projectile.age; }
        for (let i = 1; i < track.points.length; i++) this.line(segments++, track.points[i - 1], track.points[i], color, i / track.points.length * 1.2);
      } else {
        this.direction.fromArray(velocity).normalize().multiplyScalar(weapon === 'rail' ? 65 : 18);
        const tail = this.b.copy(this.a).sub(this.direction).toArray(); this.line(segments++, tail, position, color, 1.5);
        this.cylinder(this.bolts, bolts++, tail, position, radius * .4, color, 3);
      }
    }
    for (const id of this.tracks.keys()) if (!live.has(id)) this.tracks.delete(id);
    this.heads.count = heads; this.bolts.count = bolts; this.trails.geometry.setDrawRange(0, segments * 2);
    this.explosions = this.explosions.filter(explosion => time - explosion.time < 3.2);
    for (const explosion of this.explosions) {
      const age = time - explosion.time;
      if (flashes < 48) this.sprite(this.flashes, flashes++, explosion.position, explosion.size * (.12 + age * .32), 0xff973f, Math.max(0, 2.5 - age));
      if (rings < 24) this.sprite(this.rings, rings++, explosion.position, explosion.size * (.15 + age * .9), 0xffbf72, Math.max(0, 1 - age / 2));
    }
    this.pings=this.pings.filter(p=>time-p.time<.32).slice(-24);
    if(this.overview)for(const ping of this.pings){if(flashes>=48)break;const age=(time-ping.time)/.32;
      const pixel=this.camera.position.distanceTo(this.a.fromArray(ping.position))*2*Math.tan(THREE.MathUtils.degToRad(this.camera.fov/2))/(this.camera.userData.viewportHeight||844);
      this.sprite(this.flashes,flashes++,ping.position,pixel*(ping.impact?3.2:1.9)*(1+age*.4),ping.color,(1-age)*(ping.impact?1.6:1.1));
    }
    for (const ship of battle.ships) {
      const view = ships.get(ship.id); if (!view || !activeShip(ship)) continue;
      if (time - (view.muzzleTime ?? -10) < .18 && flashes < 48) this.sprite(this.flashes, flashes++, view.muzzle, 1.8, WEAPONS[DEMO_CLASSES[ship.type].weapon].color, 4);
      const health = ship.hull / DEMO_CLASSES[ship.type].hull;
      if (health < .65 && time - (this.lastDamage.get(ship.id) ?? -10) > .25) {
        this.lastDamage.set(ship.id, time);
        const position = view.group.localToWorld(this.a.set(view.size.x * .16, view.size.y * .28, view.size.z * .12)).toArray();
        this.flash(position, 0xff682b, time, 1.2 * (1 - health)); this.flash(position, 0x293140, time, 1.8, true);
      }
    }
    this.flashes.count = flashes; this.rings.count = rings;
    this.particles = this.particles.filter(particle => time - particle.time < particle.duration);
    let sparks = 0, smoke = 0;
    for (const particle of this.particles) {
      const age = time - particle.time, fade = Math.max(0, 1 - age / particle.duration), position = particle.position.map((v, axis) => v + particle.velocity[axis] * age);
      if (particle.smoke) { if (smoke < 48) this.sprite(this.smoke, smoke++, position, particle.size * (1 + age), particle.color, fade); }
      else this.sprite(this.sparks, sparks++, position, particle.size * (1 + age * 2), particle.color, fade * 3);
    }
    this.sparks.count = sparks; this.smoke.count = smoke;
    this.debris = this.debris.filter(piece => time - piece.time < 10);
    for (let i = 0; i < this.debris.length; i++) {
      const piece = this.debris[i], age = time - piece.time, fade = Math.min(1, (10 - age) / 2);
      this.object.position.fromArray(piece.position.map((v, axis) => v + piece.velocity[axis] * age));
      this.object.rotation.set(piece.spin + age * .7, piece.spin * .2 + age, age * .4);
      this.object.scale.set(piece.size * fade, piece.size * .32 * fade, piece.size * .7 * fade); this.object.updateMatrix();
      this.wrecks.setMatrixAt(i, this.object.matrix); this.wrecks.setColorAt(i, this.color.set(i % 4 ? 0x6c798b : 0xbe773f));
    }
    this.wrecks.count = this.debris.length;
    for (const entry of this.lights) entry.light.intensity = Math.max(0, (entry.until - time) / .18) * entry.power;
    for (const mesh of [this.heads, this.bolts, this.glows, this.cores, this.flashes, this.rings, this.sparks, this.smoke, this.wrecks]) {
      mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true; mesh.visible = mesh.count > 0;
    }
    for (const attribute of Object.values(this.trails.geometry.attributes)) attribute.needsUpdate = true;
    this.trails.visible = segments > 0;
    this.animating = this.beams.length > 0 || this.particles.length > 0 || this.debris.length > 0 || this.explosions.length > 0;
  }
}
