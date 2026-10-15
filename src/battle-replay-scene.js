import * as THREE from 'three';
import { HarbingerScene } from './harbinger-scene.js';

// One schematic orbital asset represents the recorded planetary defenses.
// It is never counted or named as a ship or an additional fleet.
export class BattleReplayScene extends HarbingerScene {
  constructor(canvas, callbacks) {
    super(canvas, callbacks);
    const station = new THREE.Group();
    const metal = new THREE.MeshStandardMaterial({ color: 0x718393, metalness: .75, roughness: .4 });
    const core = new THREE.Mesh(new THREE.CylinderGeometry(12, 16, 10, 12), metal); station.add(core);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(25, 2, 6, 32), metal); ring.rotation.x = Math.PI / 2; station.add(ring);
    for (const x of [-23, 23]) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(18, 2, 35), new THREE.MeshStandardMaterial({ color: 0x29495f, metalness: .6, roughness: .45 }));
      panel.position.set(x, 0, 2); station.add(panel);
    }
    const lance = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 32), metal); lance.position.set(0, 0, -19); station.add(lance);
    this.models.set('orbital-defense', station);
  }
  modelName(ship) { return ship.installation ? 'orbital-defense' : super.modelName(ship); }
  orientBody(root, ship) { if (!ship.installation) super.orientBody(root, ship); }
  makeShip(ship) {
    super.makeShip(ship);
    if (ship.installation) {
      const view = this.ships.get(ship.id);
      for (const { engine } of view.engines) engine.removeFromParent();
      view.engines = [];
    }
  }
}
