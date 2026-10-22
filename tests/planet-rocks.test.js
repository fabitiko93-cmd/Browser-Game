import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { BufferGeometry, Float32BufferAttribute, Mesh, MeshBasicMaterial, PlaneGeometry, Raycaster, Vector3 } from 'three';
import { createReferencePlanetBlueprint as createPlanetBlueprint, createRegionBlueprint, regionGroundHeight, regionHeight, ROCK_ASSETS } from '../src/planet-blueprint.js';
import { rockFootprint, fitRockToGround } from '../src/planet-rocks.js';

async function scannedGeometry(file) {
  const bytes = await readFile(new URL(`../web/models/planets/${file}`, import.meta.url)), length = bytes.readUInt32LE(12);
  const doc = JSON.parse(bytes.subarray(20, 20 + length)), bin = bytes.subarray(28 + length), primitive = doc.meshes[0].primitives[0];
  function read(index, width) {
    const a = doc.accessors[index], view = doc.bufferViews[a.bufferView], start = (view.byteOffset ?? 0) + (a.byteOffset ?? 0), size = a.componentType === 5123 ? 2 : 4, stride = view.byteStride ?? width * size;
    return Array.from({ length: a.count * width }, (_, i) => { const offset = start + Math.floor(i / width) * stride + i % width * size; return a.componentType === 5126 ? bin.readFloatLE(offset) : size === 2 ? bin.readUInt16LE(offset) : bin.readUInt32LE(offset); });
  }
  const geometry = new BufferGeometry().setAttribute('position', new Float32BufferAttribute(read(primitive.attributes.POSITION, 3), 3)); geometry.setIndex(read(primitive.indices, 1)); geometry.computeBoundingBox();
  const box = geometry.boundingBox, c = box.getCenter(new Vector3()), size = box.getSize(new Vector3()), scale = 1 / Math.max(size.x, size.y, size.z);
  geometry.translate(-c.x, -box.min.y, -c.z); geometry.scale(scale, scale, scale); geometry.computeBoundingBox(); return geometry;
}
const models = new Map(await Promise.all(Object.entries(ROCK_ASSETS).map(async ([id, file]) => { const geometry = await scannedGeometry(file); return [id, { geometry, footprint: rockFootprint(geometry) }]; })));
function openVertices(geometry) {
  const position = geometry.attributes.position, indices = geometry.index.array, weld = new Map(), ids = [], representatives = [], edges = new Map();
  for (let i = 0; i < position.count; i++) {
    const key = [position.getX(i), position.getY(i), position.getZ(i)].map(v => Math.round(v * 1e5)).join('/');
    if (!weld.has(key)) { weld.set(key, weld.size); representatives.push(i); } ids.push(weld.get(key));
  }
  for (let i = 0; i < indices.length; i += 3) for (const [a, b] of [[0, 1], [1, 2], [2, 0]]) {
    const x = ids[indices[i + a]], y = ids[indices[i + b]]; if (x === y) continue;
    const key = Math.min(x, y) + '/' + Math.max(x, y); edges.set(key, (edges.get(key) ?? 0) + 1);
  }
  const open = new Set(); for (const [key, count] of edges) if (count === 1) for (const id of key.split('/')) open.add(representatives[Number(id)]);
  return [...open];
}

test('repeated scan assets are closed above their deliberately buried bases', () => {
  for (const [id, { geometry, footprint }] of models) {
    const open = openVertices(geometry);
    if (id !== 'layered') assert.equal(open.length, 0, `${id} must be a complete all-around scan`);
    assert.ok(open.every(i => geometry.attributes.position.getY(i) <= footprint.height * .24), `${id} has an exposed open scan edge`);
    assert.ok(geometry.index.count / 3 <= 4000);
  }
});

test('scan foundations stay in contact on curved coasts, terraces, craters and slopes', () => {
  const p = new Vector3(); let checked = 0;
  for (const preset of ['temperate', 'arid', 'lunar']) {
    const planet = createPlanetBlueprint('NEREID-3077', { preset });
    for (const r of planet.regions) {
      const region = createRegionBlueprint(planet, r.id);
      for (const rock of region.rocks) {
        const { footprint } = models.get(rock.model), pose = fitRockToGround(region, rock, footprint);
        assert.ok(pose.normal.y > 0 && Number.isFinite(pose.y));
        for (let i = 0; i < footprint.points.length; i += 3) {
          p.fromArray(footprint.points, i).applyMatrix4(pose.matrix);
          assert.ok(p.y <= regionGroundHeight(region, p.x, p.z) - .05, `${r.module}/${rock.id}: airborne foundation`); checked++;
        }
        assert.deepEqual(pose.matrix.toArray(), fitRockToGround(region, rock, footprint).matrix.toArray());
      }
    }
  }
  assert.ok(checked > 10000);
});

test('grounding samples match real rendered triangles rather than only analytic heights', () => {
  const planet = createPlanetBlueprint('NEREID-3077'), ray = new Raycaster(), material = new MeshBasicMaterial();
  let analyticDifference = 0;
  for (const r of planet.regions) {
    const region = createRegionBlueprint(planet, r.id), geometry = new PlaneGeometry(region.size, region.size, 128, 128); geometry.rotateX(-Math.PI / 2);
    // Use the actual public Three.js plane topology as an independent reference.
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) position.setY(i, regionHeight(region, position.getX(i), position.getZ(i)));
    const mesh = new Mesh(geometry, material); mesh.updateMatrixWorld(true);
    for (const [x, z] of [[38.25, -42.6], [65.4, -60.8], [-48.6, 32.2], [13.13, 19.71], [47.81, 53.28], [-69.2, -50.13], [-89.7, 10.32]]) {
      ray.set(new Vector3(x, 200, z), new Vector3(0, -1, 0)); const hit = ray.intersectObject(mesh)[0]; assert.ok(hit);
      assert.ok(Math.abs(hit.point.y - regionGroundHeight(region, x, z)) < 1e-4);
      analyticDifference = Math.max(analyticDifference, Math.abs(hit.point.y - regionHeight(region, x, z)));
    }
    geometry.dispose();
  }
  assert.ok(analyticDifference > .0001); material.dispose();
});
