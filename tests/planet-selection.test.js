import test from 'node:test';
import assert from 'node:assert/strict';
import { Box3 } from 'three';
import { createPlanetBlueprint, createRegionBlueprint } from '../src/planet-blueprint.js';
import { createBuildingPreview, createResourceSelection, resourceAt } from '../src/planet-selection-scene.js';
import { createProbeHabitat } from '../src/planet-construction-scene.js';
import { createProbeExtractor } from '../src/planet-resource-scene.js';
import { resourceFieldDensity } from '../src/planet-resources.js';

const region = createRegionBlueprint(createPlanetBlueprint(42, { preset: 'lunar', regionCount: 5 }), 'region-0');
const footprint = { minX: -4, maxX: 4, minZ: -4, maxZ: 4 }, foundation = { top: 9, bottom: 8.5 };
function dispose(group) { const geometries = new Set(), materials = new Set(); group.traverse(m => { if (m.isInstancedMesh) m.dispose(); if (m.geometry) geometries.add(m.geometry); for (const material of [].concat(m.material ?? [])) materials.add(material); }); geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); }

test('every building ghost has the exact bounds of the eventual building and its complete occupied footprint', () => {
  for (const type of ['habitat', 'mine', 'crystal', 'geothermal']) {
    const b = { type, footprint, foundation }, actual = type === 'habitat' ? createProbeHabitat(b) : createProbeExtractor(b), preview = createBuildingPreview(region, type, footprint, foundation);
    assert.deepEqual(new Box3().setFromObject(preview.children[0]), new Box3().setFromObject(actual));
    const floor = new Box3().setFromObject(preview.children[1]);
    assert.equal(floor.min.x, footprint.minX); assert.equal(floor.max.x, footprint.maxX); assert.equal(floor.min.z, footprint.minZ); assert.equal(floor.max.z, footprint.maxZ);
    preview.traverse(m => { if (!m.isMesh) return; assert.equal(m.castShadow, false); for (const material of [].concat(m.material)) { assert.ok(material.transparent && !material.depthWrite); assert.ok(material.opacity > 0 && material.opacity < 1); } });
    const blocked = createBuildingPreview(region, type, footprint, null, true); assert.notDeepEqual(blocked.children[1].material.color, preview.children[1].material.color);
    assert.ok(new Box3().setFromObject(blocked).min.toArray().every(Number.isFinite));
    dispose(actual); dispose(preview); dispose(blocked);
  }
});

test('selection identifies weak deposit tails, resolves overlapping resources by the chosen extractor and clears outside all deposits', () => {
  const fields = ['ore', 'crystal'].map((type, i) => ({ id: String(i), type, x: 0, z: 0, radius: 16, strength: 1 })), r = { ...region, resources: fields };
  assert.equal(resourceAt(r, 21, 0)?.type, 'ore'); assert.equal(resourceAt(r, 21, 0, 'crystal')?.type, 'crystal'); assert.equal(resourceAt(r, 40, 0), null);
  assert.equal(resourceAt({ ...r, resources: [fields[0], { ...fields[1], strength: 1.2 }] }, 0, 0, 'ore').type, 'crystal', 'A weak tail must not hide the stronger deposit actually tapped');
});

test('selected deposits cover the entire field beyond the building square and their contours follow actual density levels', () => {
  const field = { id: 'outside', type: 'ore', x: 56, z: 0, radius: 16, rx: 22, rz: 14, rotation: .6, phase: .7, strength: 1.2 };
  const selection = createResourceSelection(region, field), fill = selection.children[0], box = new Box3().setFromObject(fill);
  assert.ok(box.max.x > 64); assert.equal(selection.children.length, 5); assert.ok(fill.geometry.index.count > 0);
  const colors = fill.geometry.attributes.color, unique = new Set(); for (let i = 0; i < colors.count; i++) unique.add([colors.getX(i), colors.getY(i), colors.getZ(i)].join('/')); assert.equal(unique.size, 4);
  for (const [i, level] of [.01, .25, .5, .75].entries()) {
    const positions = selection.children[i + 1].geometry.attributes.position; assert.ok(positions.count > 0);
    for (let j = 0; j < positions.count; j++) assert.ok(Math.abs(resourceFieldDensity(region, field, positions.getX(j), positions.getZ(j)) / field.strength - level) < .0001);
  }
  dispose(selection);
});
