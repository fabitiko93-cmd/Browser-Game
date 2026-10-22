import test from 'node:test';
import assert from 'node:assert/strict';
import { Group, BoxGeometry, MeshStandardMaterial, InstancedMesh, Matrix4, Color, Vector3, PerspectiveCamera } from 'three';
import { createPlanetBlueprint, createReferencePlanetBlueprint, createRegionBlueprint, regionGroundHeight, regionWater } from '../src/planet-blueprint.js';
import { assessConstruction, placeConstruction, demolishConstruction, constructionFootprint, emptyConstruction, clearedObject, constructionKey, restoreConstruction, loadConstructionStore, saveConstructionStore } from '../src/planet-construction.js';
import { applyConstructionClearings, indexConstructionObjects, createProbeHabitat } from '../src/planet-construction-scene.js';
import { addFloraBatches, updateFloraLods } from '../src/planet-flora.js';

const planet = createPlanetBlueprint(20, { regionCount: 5 }), region = createRegionBlueprint(planet, 'region-2');
const object = (id, kind, minX, maxX, removable = true) => ({ id, kind, removable, bounds: { minX, maxX, minZ: -2, maxZ: 2 } });

test('successful construction clears overlapping vegetation and small stones while preserving neighbours and large rocks', () => {
  const state = emptyConstruction(), objects = [object('crown', 'tree', -8, 1), object('grass', 'plant', -1, 1), object('stone', 'stone', 2, 3), object('neighbour', 'tree', 4, 7), object('outcrop', 'stone', 7, 12, false)];
  assert.deepEqual(constructionFootprint(-1, -1), { minX: -4, minZ: -4, maxX: 4, maxZ: 4 });
  const result = placeConstruction(region, state, -1, -1, objects);
  assert.equal(result.issue, null); assert.ok(result.building);
  assert.deepEqual(result.counts, { tree: 1, plant: 1, stone: 1 });
  assert.deepEqual(objects.map(o => clearedObject(o, state.clearings)), [true, true, true, false, false]);
  const snapshot = structuredClone(state);
  assert.match(placeConstruction(region, state, 1, 1, objects).issue, /bereits bebaut/); assert.deepEqual(state, snapshot);
  assert.equal(demolishConstruction(state, result.building.id), true);
  assert.equal(state.buildings.length, 0); assert.equal(state.clearings.length, 1);
  assert.deepEqual(assessConstruction(region, state, -1, -1, objects).counts, { tree: 0, plant: 0, stone: 0 });
  assert.equal(placeConstruction(region, state, -1, -1, objects).issue, null);
  assert.equal(state.clearings.length, 1);
});

test('failed construction is atomic for large rocks, water at the footprint edge, steep slopes and grid boundaries', () => {
  const state = emptyConstruction(), before = structuredClone(state);
  assert.match(placeConstruction(region, state, -1, -1, [object('grass', 'plant', -1, 1), object('bedrock', 'stone', 2, 8, false)]).issue, /Felsblock/);
  assert.deepEqual(state, before);
  for (const [x, z] of [[-65, 0], [-63, 0], [63, 0], [0, 63], [NaN, 0]]) { assert.match(placeConstruction(region, state, x, z).issue, /Baugebiet/); assert.deepEqual(state, before); }
  let wetEdge = false, steep = false;
  for (const seed of [0, 42, 'NEREID-3077']) {
    const p = createReferencePlanetBlueprint(seed), coast = createRegionBlueprint(p, 'region-0');
    for (let z = -55; z < 55 && !(wetEdge && steep); z += 2) for (let x = -59; x < -15 && !(wetEdge && steep); x += 2) {
      const assessment = assessConstruction(coast, state, x, z);
      if (/Wasser/.test(assessment.issue) && !regionWater(coast, x, z)) { wetEdge = true; assert.equal(placeConstruction(coast, state, x, z).building, null); assert.deepEqual(state, before); }
      if (/Steilhang/.test(assessment.issue)) { steep = true; assert.equal(placeConstruction(coast, state, x, z).building, null); assert.deepEqual(state, before); }
    }
  }
  assert.ok(wetEdge, 'dry centre with a wet footprint must be rejected'); assert.ok(steep);
  assert.deepEqual(state, before);
});

test('GPU batch clearing removes every tree part at every LOD without changing neighbouring matrices or colours', () => {
  const g = new BoxGeometry(.6, 1, .6); g.translate(0, .5, 0);
  const far = g.clone(), material = new MeshStandardMaterial(), group = new Group();
  const trees = [30, 40].map(x => ({ model: 'oak', x, y: 8, z: 0, size: 10, width: 1, rotation: .2, variant: 0, tint: x < 35 ? .8 : 1.1 }));
  addFloraBatches(group, trees, [[{ geometry: g, material }, { geometry: g, material }]], { trees: true, lods: [[[far, far], [far, far]]] });
  const objects = indexConstructionObjects(group, region), state = emptyConstruction();
  // Both source roots lie outside this narrow footprint. Only the first crown overlaps.
  state.clearings.push({ minX: 31, maxX: 33, minZ: -2, maxZ: 2 });
  const neighbour = objects.find(o => o.bounds.minX > 35), matrix = new Matrix4(), color = new Color();
  applyConstructionClearings(group, state);
  const camera = new PerspectiveCamera();
  for (const distance of [20, 120, 300, 20]) {
    camera.position.set(0, distance, 0); updateFloraLods(group, camera);
    for (const mesh of group.children) {
      assert.equal(mesh.count, 1); mesh.getMatrixAt(0, matrix); mesh.getColorAt(0, color);
      assert.ok(matrix.elements.every((v, i) => Math.abs(v - neighbour.matrix.elements[i]) < 1e-5));
      assert.ok(Math.abs(color.r - neighbour.color.r) < 1e-6);
    }
  }
  state.clearings = []; applyConstructionClearings(group, state); assert.ok(group.children.every(m => m.count === 2));
  group.children.forEach(m => m.dispose()); g.dispose(); far.dispose(); material.dispose();
});

test('actual rock model bounds classify loose stones separately from unbuildable outcrops', () => {
  const group = new Group(), g = new BoxGeometry(1, 1, 1), material = new MeshStandardMaterial(), mesh = new InstancedMesh(g, material, 2), y = regionGroundHeight(region, 0, 0);
  mesh.userData.constructionObjects = [1, 5].map((s, i) => ({ id: `rock-${i}`, kind: 'stone', matrix: new Matrix4().makeScale(s, s, s), color: new Color(), bounds: { minX: -s / 2, maxX: s / 2, minZ: -s / 2, maxZ: s / 2, minY: y - .2, maxY: y + s * .8 } })); group.add(mesh);
  const objects = indexConstructionObjects(group, region); assert.deepEqual(objects.map(o => o.removable), [true, false]);
  const state = emptyConstruction(); state.clearings.push({ minX: -4, maxX: 4, minZ: -4, maxZ: 4 }); applyConstructionClearings(group, state); assert.equal(mesh.count, 1);
  mesh.dispose(); g.dispose(); material.dispose();
});

test('construction survives serialization, region/biosphere changes and unavailable storage without touching the empire save', () => {
  const state = emptyConstruction(); assert.ok(placeConstruction(region, state, -1, -1).building);
  assert.deepEqual(restoreConstruction(JSON.parse(JSON.stringify(state))), state);
  assert.equal(constructionKey(region), constructionKey({ ...region, biosphere: 'spore' }));
  assert.notEqual(constructionKey(region), constructionKey({ ...region, seed: region.seed + 1 }));
  let stored; const storage = { getItem: () => stored, setItem: (k, v) => { assert.match(k, /planet-construction/); stored = v; } }, states = new Map([[constructionKey(region), state]]);
  assert.equal(saveConstructionStore(storage, states), true); assert.deepEqual(loadConstructionStore(storage), states);
  for (const bad of [null, { ...state, clearings: [{ minX: NaN }] }, { ...state, buildings: [state.buildings[0], state.buildings[0]] }]) assert.deepEqual(restoreConstruction(bad), emptyConstruction());
  assert.equal(saveConstructionStore({ setItem() { throw Error('quota'); } }, states), false);
  assert.deepEqual(loadConstructionStore({ getItem() { throw Error('disabled'); } }), new Map());
  const model = createProbeHabitat(state.buildings[0]);
  assert.equal(model.children.length, 7); assert.equal(model.userData.buildingId, 1);
  assert.ok(model.children.every(m => m.isInstancedMesh && m.count > 0));
  const seen = new Set(); model.traverse(m => { if (m.isInstancedMesh) m.dispose(); if (m.geometry) seen.add(m.geometry); m.material?.dispose(); }); seen.forEach(g => g.dispose());
});
