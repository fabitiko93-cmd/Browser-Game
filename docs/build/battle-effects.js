import * as THREE from 'three';
import { WEAPONS } from './battle-demo.js';

const MAX_PROJECTILES = 64, MAX_BEAMS = 24, MAX_PARTICLES = 128;
const UP = new THREE.Vector3(0, 1, 0);

// Fixed buffers and shared materials: no new GPU resource is allocated for a shot.
export class BattleEffects {
  constructor(scene, camera) {
    this.scene = scene; this.camera = camera;
    this.beams = []; this.particles = []; this.tracks = new Map();
    this.object = new THREE.Object3D(); this.a = new THREE.Vector3(); this.b = new THREE.Vector3(); this.direction = new THREE.Vector3(); this.color = new THREE.Color();
    const material = () => new THREE.MeshBasicMaterial({ color: 0xffffff, blending: THREE.AdditiveBlending, transparent: true, opacity: .8, depthWrite: false, toneMapped: false });
    const cylinder = new THREE.CylinderGeometry(1, 1, 1, 4, 1, true);
    this.glows = new THREE.InstancedMesh(cylinder, material(), MAX_BEAMS);
    this.heads = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 6, 4), material(), MAX_PROJECTILES);
    this.bolts = new THREE.InstancedMesh(cylinder, material(), MAX_PROJECTILES);
    for (const mesh of [this.glows, this.heads, this.bolts]) {
      mesh.count = 0; mesh.frustumCulled = false; mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(mesh);
    }
    this.lasers = this.lines(MAX_BEAMS);
    this.trails = this.lines(MAX_PROJECTILES * 8);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_PARTICLES * 3), 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MAX_PARTICLES * 3), 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setDrawRange(0, 0);
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 32;
    const ctx = canvas.getContext('2d'), gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, '#ffffff'); gradient.addColorStop(.2, '#ffffffdc'); gradient.addColorStop(1, '#ffffff00');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 32, 32);
    this.sparks = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 10, map: new THREE.CanvasTexture(canvas), vertexColors: true, sizeAttenuation: false, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    this.sparks.frustumCulled = false; scene.add(this.sparks);
  }

  lines(capacity) {
    const geometry = new THREE.BufferGeometry();
    for (const name of ['position', 'color']) geometry.setAttribute(name, new THREE.BufferAttribute(new Float32Array(capacity * 6), 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setDrawRange(0, 0);
    const lines = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: .9, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    lines.frustumCulled = false; this.scene.add(lines); return lines;
  }

  line(lines, index, from, to, color, brightness = 1) {
    const positions = lines.geometry.attributes.position.array, colors = lines.geometry.attributes.color.array;
    this.color.set(color).multiplyScalar(brightness);
    for (let i = 0; i < 3; i++) {
      positions[index * 6 + i] = from[i]; positions[index * 6 + i + 3] = to[i];
      colors[index * 6 + i] = colors[index * 6 + i + 3] = [this.color.r, this.color.g, this.color.b][i];
    }
  }

  cylinder(mesh, index, from, to, radius, color, brightness = 1) {
    this.a.fromArray(from); this.b.fromArray(to); this.direction.subVectors(this.b, this.a);
    this.object.position.copy(this.a).add(this.b).multiplyScalar(.5);
    this.object.quaternion.setFromUnitVectors(UP, this.direction.normalize());
    this.object.scale.set(radius, this.a.distanceTo(this.b), radius); this.object.updateMatrix();
    mesh.setMatrixAt(index, this.object.matrix); mesh.setColorAt(index, this.color.set(color).multiplyScalar(brightness));
  }

  flash(position, color, time, large = false) {
    for (let i = 0; i < (large ? 12 : 4); i++) {
      if (this.particles.length >= MAX_PARTICLES) this.particles.shift();
      this.particles.push({ position: [...position], velocity: [Math.sin(i * 2.4), Math.cos(i * 1.8), Math.sin(i * 3.7)].map(v => v * (large ? 45 : 7)), color: i ? color : 0xffeed1, time, duration: large ? .8 : .22 });
    }
  }

  update(battle, time, events, ships) {
    for (const event of events) {
      if (event.kind === 'fire') {
        let from = event.from;
        const gun = ships.get(event.ship)?.guns[0];
        if (gun) from = gun.localToWorld(this.a.set(0, .2, -1.6)).toArray();
        if (event.weapon === 'laser') {
          if (this.beams.length === MAX_BEAMS) this.beams.shift();
          this.beams.push({ from: [...from], to: event.to, time });
        } else this.flash(from, WEAPONS[event.weapon].color, time);
      } else if (event.kind === 'impact') this.flash(event.position, event.shield ? 0x8fcaff : 0xffac63, time);
      else if (event.kind === 'destroy') this.flash(event.position, 0xff964e, time, true);
    }
    this.beams = this.beams.filter(beam => time - beam.time < .16);
    for (let i = 0; i < this.beams.length; i++) {
      const beam = this.beams[i], fade = 1 - (time - beam.time) / .16;
      this.line(this.lasers, i, beam.from, beam.to, WEAPONS.laser.color, fade);
      this.cylinder(this.glows, i, beam.from, beam.to, .32, WEAPONS.laser.color, fade * .2);
    }
    this.glows.count = this.beams.length;
    this.lasers.geometry.setDrawRange(0, this.beams.length * 2);
    let heads = 0, bolts = 0, segments = 0;
    const live = new Set();
    for (const projectile of battle.projectiles.slice(0, MAX_PROJECTILES)) {
      const { position, velocity, weapon } = projectile, color = WEAPONS[weapon].color;
      live.add(projectile.id);
      this.a.fromArray(position);
      const radius = Math.max(weapon === 'torpedo' ? .65 : .3, this.camera.position.distanceTo(this.a) * .0009);
      this.object.position.copy(this.a); this.object.quaternion.identity(); this.object.scale.setScalar(radius); this.object.updateMatrix();
      this.heads.setMatrixAt(heads, this.object.matrix); this.heads.setColorAt(heads++, this.color.set(color));
      if (weapon === 'torpedo') {
        let track = this.tracks.get(projectile.id);
        if (!track) { track = { points: [], age: -1 }; this.tracks.set(projectile.id, track); }
        if (track.age !== projectile.age) { track.points.push([...position]); if (track.points.length > 8) track.points.shift(); track.age = projectile.age; }
        for (let i = 1; i < track.points.length; i++) this.line(this.trails, segments++, track.points[i - 1], track.points[i], color, i / track.points.length * .55);
      } else {
        this.direction.fromArray(velocity).normalize().multiplyScalar(weapon === 'rail' ? 65 : 18);
        const tail = this.b.copy(this.a).sub(this.direction).toArray();
        this.line(this.trails, segments++, tail, position, color);
        this.cylinder(this.bolts, bolts++, tail, position, radius * .28, color, .75);
      }
    }
    for (const id of this.tracks.keys()) if (!live.has(id)) this.tracks.delete(id);
    this.heads.count = heads; this.bolts.count = bolts;
    this.trails.geometry.setDrawRange(0, segments * 2);
    this.particles = this.particles.filter(particle => time - particle.time < particle.duration);
    const positions = this.sparks.geometry.attributes.position.array, colors = this.sparks.geometry.attributes.color.array;
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i], age = time - particle.time;
      this.color.set(particle.color).multiplyScalar(1 - age / particle.duration);
      for (let axis = 0; axis < 3; axis++) positions[i * 3 + axis] = particle.position[axis] + particle.velocity[axis] * age;
      colors.set([this.color.r, this.color.g, this.color.b], i * 3);
    }
    this.sparks.geometry.setDrawRange(0, this.particles.length);
    for (const lines of [this.lasers, this.trails, this.sparks]) {
      lines.geometry.attributes.position.needsUpdate = true; lines.geometry.attributes.color.needsUpdate = true;
    }
    for (const mesh of [this.heads, this.bolts, this.glows]) {
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.visible = mesh.count > 0;
    }
    this.lasers.visible = this.beams.length > 0; this.trails.visible = segments > 0; this.sparks.visible = this.particles.length > 0;
  }
}
