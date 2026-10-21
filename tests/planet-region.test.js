import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineLoop, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Raycaster, Vector2, Vector3 } from 'three';
import { createPlanetBlueprint, createRegionBlueprint, regionBuildCell, regionGroundHeight, regionHeight, regionSite, regionTerrainPatches, REGION_BUILD_GRID } from '../src/planet-blueprint.js';
import { createRegionEnvironment } from '../src/planet-environment.js';
import { constrainRegionCamera } from '../src/planet-camera.js';
import { fitRockToGround, rockFootprint } from '../src/planet-rocks.js';
import { PlanetPreviewScene } from '../src/planet-preview-scene.js';

test('selection is confined to the visible grid and identifies actual cell centres', () => {
  const { halfExtent: half, cells, cellSize } = REGION_BUILD_GRID;
  for (const [x, z] of [[-half - .001, 0], [half, 0], [0, -half - .001], [0, half], [100, 0], [NaN, 0]]) assert.equal(regionBuildCell(x, z), null);
  const planet = createPlanetBlueprint(12), region = createRegionBlueprint(planet, planet.regions[0].id);
  assert.equal(regionSite(region, half + 1, 0).buildable, false);
  assert.equal(regionSite(region, half + 1, 0).inBuildArea, false);
  const visited = new Set();
  for (let row = 0; row < cells; row++) for (let column = 0; column < cells; column++) {
    const x = -half + column * cellSize, z = -half + row * cellSize;
    const cell = regionBuildCell(x + .001, z + .001);
    assert.deepEqual(cell, { column, row, x: x + cellSize / 2, z: z + cellSize / 2 });
    assert.deepEqual(regionBuildCell(x + cellSize - .001, z + cellSize - .001), cell);
    visited.add(`${cell.x}/${cell.z}`);
  }
  assert.equal(visited.size, cells * cells);
});

test('actual ray picking clears outside taps and outlines only the selected raster cell', () => {
  const planet = createPlanetBlueprint('NEREID-3077'), region = createRegionBlueprint(planet, planet.regions[0].id);
  const geometry = new PlaneGeometry(region.size, region.size, 128, 128); geometry.rotateX(-Math.PI / 2);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) position.setY(i, regionHeight(region, position.getX(i), position.getZ(i)));
  const view = Object.create(PlanetPreviewScene.prototype);
  view.region = region; view.mode = 'region'; view.terrain = new Mesh(geometry, new MeshBasicMaterial()); view.terrain.updateMatrixWorld();
  view.canvas = { getBoundingClientRect: () => ({ left: 0, top: 0, width: 390, height: 844 }) };
  view.camera = new PerspectiveCamera(60, 390 / 844, .2, 1800); view.camera.position.set(0, 250, 0); view.camera.up.set(0, 0, -1);
  view.controls = { target: new Vector3(0, 0, 0) }; view.ray = new Raycaster(); view.pointer = new Vector2();
  view.siteMark = new LineLoop(new BufferGeometry().setAttribute('position', new Float32BufferAttribute(new Float32Array(48), 3)), new LineBasicMaterial());
  let selected; view.onSite = site => { selected = site; }; view.keepCameraAboveGround();
  const pick = (x, z) => {
    const point = new Vector3(x, regionGroundHeight(region, x, z), z).project(view.camera);
    view.pick({ clientX: (point.x + 1) * 390 / 2, clientY: (1 - point.y) * 844 / 2 });
  };
  for (const [x, z] of [[.25, .25], [-63.99, 3], [63.99, -4.25], [3, 63.99], [4.25, -63.99]]) {
    pick(x, z); assert.ok(selected); assert.equal(view.siteMark.visible, true);
    const cell = regionBuildCell(x, z); assert.equal(selected.x, cell.x); assert.equal(selected.z, cell.z);
    const mark = view.siteMark.geometry.attributes.position;
    for (let i = 0; i < mark.count; i++) {
      assert.ok(Math.abs(mark.getX(i) - cell.x) <= 1 && Math.abs(mark.getZ(i) - cell.z) <= 1);
      assert.ok(Math.abs(mark.getX(i)) <= 64 && Math.abs(mark.getZ(i)) <= 64);
    }
  }
  for (const [x, z] of [[64.01, 0], [-64.01, 0], [0, 64.01], [0, -64.01], [90, 90]]) {
    pick(0, 0); assert.ok(selected); pick(x, z);
    assert.equal(selected, null); assert.equal(view.siteMark.visible, false);
  }
  geometry.dispose(); view.terrain.material.dispose(); view.siteMark.geometry.dispose(); view.siteMark.material.dispose();
});

test('surrounding surface heights match actual terrain triangles on every patch and seam', () => {
  const planet = createPlanetBlueprint('terrain-seams'), material = new MeshBasicMaterial(), ray = new Raycaster();
  for (const r of planet.regions) {
    const region = createRegionBlueprint(planet, r.id);
    for (const p of regionTerrainPatches(region)) {
      const geometry = new PlaneGeometry(p.maxX - p.minX, p.maxZ - p.minZ, p.segmentsX, p.segmentsZ);
      geometry.rotateX(-Math.PI / 2); geometry.translate((p.minX + p.maxX) / 2, 0, (p.minZ + p.maxZ) / 2);
      const position = geometry.attributes.position;
      for (let i = 0; i < position.count; i++) position.setY(i, regionHeight(region, position.getX(i), position.getZ(i)));
      const mesh = new Mesh(geometry, material); mesh.updateMatrixWorld(true);
      for (const [u, v] of [[.001, .001], [.123, .718], [.64, .52], [.999, .999]]) {
        const x = p.minX + (p.maxX - p.minX) * u, z = p.minZ + (p.maxZ - p.minZ) * v;
        ray.set(new Vector3(x, 1000, z), new Vector3(0, -1, 0));
        const hit = ray.intersectObject(mesh)[0]; assert.ok(hit);
        assert.ok(Math.abs(hit.point.y - regionGroundHeight(region, x, z)) < .0001, `${r.module}/${x}/${z}`);
      }
      geometry.dispose();
    }
    for (const edge of [-96, 96]) for (const other of [-350, -96, -20, 0, 42, 96, 270]) {
      assert.ok(Math.abs(regionGroundHeight(region, edge - 1e-5, other) - regionGroundHeight(region, edge + 1e-5, other)) < .001);
      assert.ok(Math.abs(regionGroundHeight(region, other, edge - 1e-5) - regionGroundHeight(region, other, edge + 1e-5)) < .001);
    }
  }
  material.dispose();
});

test('camera clears canyon walls, crater rims and near ground across seeds and pan limits', () => {
  let corrected = 0;
  for (const seed of ['NEREID-3077', 0, 'different-geology']) {
    const planet = createPlanetBlueprint(seed);
    for (const r of planet.regions) {
      const region = createRegionBlueprint(planet, r.id);
      for (let direction = 0; direction < 12; direction++) {
        const angle = direction / 12 * Math.PI * 2;
        const target = { x: direction % 3 === 0 ? 140 : -12, y: -15, z: direction % 4 === 0 ? -120 : 8 };
        const eye = { x: target.x + Math.cos(angle) * (direction % 2 ? 230 : 35), y: target.y + 2, z: target.z + Math.sin(angle) * (direction % 2 ? 230 : 35) };
        constrainRegionCamera(region, eye, target); corrected++;
        assert.ok(Math.abs(target.x) <= 88 && Math.abs(target.z) <= 88);
        assert.ok(eye.y >= regionGroundHeight(region, eye.x, eye.z) + 2.9);
        for (let i = 0; i <= 200; i++) {
          const t = i / 200, x = target.x + (eye.x - target.x) * t, z = target.z + (eye.z - target.z) * t;
          const y = target.y + (eye.y - target.y) * t;
          assert.ok(y - regionGroundHeight(region, x, z) > 1.7, `${seed}/${r.module}/${direction}/${t}: ground clipping`);
        }
        const stable = { eye: { ...eye }, target: { ...target } }; constrainRegionCamera(region, eye, target);
        assert.deepEqual({ eye, target }, stable, 'stationary camera must not drift');
      }
    }
  }
  assert.equal(corrected, 144);
});

test('environment is reproducible, extends beyond the colony, and respects the planetary habitat', () => {
  for (const preset of ['temperate', 'arid', 'lunar']) for (const seed of [0, 42, 'NEREID-3077']) {
    const planet = createPlanetBlueprint(seed, { preset });
    for (const r of planet.regions) {
      const region = createRegionBlueprint(planet, r.id), environment = createRegionEnvironment(region);
      assert.deepEqual(environment, createRegionEnvironment(region));
      assert.deepEqual(JSON.parse(JSON.stringify(environment)), environment);
      assert.ok(environment.rocks.length > 40 && environment.rocks.length < 350);
      assert.ok(environment.rocks.some(rock => Math.hypot(rock.x, rock.z) > 250));
      assert.ok(environment.rocks.every(rock => Math.hypot(rock.x, rock.z) >= 90));
      assert.ok(environment.plants.every(p => Math.hypot(p.x, p.z) > 24 && p.y > .9));
      if (preset !== 'temperate') assert.equal(environment.plants.length, 0);
      else if (r.module === 'coast' || r.module === 'upland') assert.ok(environment.plants.length > 100);
    }
  }
});

test('distant scan LODs reuse bounded geometry and stay grounded in the surrounding triangles', async () => {
  const { models } = JSON.parse(await readFile(new URL('../web/models/planets/rock-lods.json', import.meta.url)));
  const lods = Object.fromEntries(Object.entries(models).map(([id, source]) => {
    const geometry = new BufferGeometry().setAttribute('position', new Float32BufferAttribute(source.position, 3)); geometry.setIndex(source.index);
    assert.ok(geometry.index.count / 3 <= 800 && source.relativeError < .09);
    return [id, { geometry, footprint: rockFootprint(geometry) }];
  }));
  const planet = createPlanetBlueprint('NEREID-3077'), p = new Vector3(); let checked = 0;
  for (const r of planet.regions) {
    const region = createRegionBlueprint(planet, r.id);
    for (const rock of createRegionEnvironment(region).rocks) {
      const { footprint } = lods[rock.model], pose = fitRockToGround(region, rock, footprint);
      for (let i = 0; i < footprint.points.length; i += 3) {
        p.fromArray(footprint.points, i).applyMatrix4(pose.matrix);
        assert.ok(p.y <= regionGroundHeight(region, p.x, p.z) - .05); checked++;
      }
    }
  }
  assert.ok(checked > 10000);
  Object.values(lods).forEach(lod => lod.geometry.dispose());
});
