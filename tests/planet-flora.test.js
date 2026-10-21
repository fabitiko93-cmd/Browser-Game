import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Group, Vector3, Box3 } from 'three';
import { createPlanetBlueprint, createRegionBlueprint, regionGroundHeight, regionHeight, regionSite } from '../src/planet-blueprint.js';
import { createRegionEnvironment, regionHabitat } from '../src/planet-environment.js';
import { createForestBatches, updateForestBatches, floraMatrix } from '../src/planet-flora.js';

// A 16 m building footprint must rest on a terrace rather than cross a rim.
// Shores retain their slope and are checked separately from the inland land.
test('building terraces stay gentle over multi-cell footprints across seeds', () => {
  for (const seed of [0, 42, 'NEREID-3077', 'rolling-geology']) {
    const planet = createPlanetBlueprint(seed);
    for (const r of planet.regions) {
      const region = createRegionBlueprint(planet, r.id);
      for (let z = -55; z <= 55; z += 10) for (let x = -55; x <= 55; x += 10) {
        const site = regionSite(region, x, z);
        if (r.module === 'coast' && site.height < 3) continue;
        const heights = [-8, 0, 8].flatMap(dx => [-8, 0, 8].map(dz => regionGroundHeight(region, x + dx, z + dz)));
        assert.ok(Math.max(...heights) - Math.min(...heights) < 1.6, `${seed}/${r.module}/${x}/${z}`);
        assert.ok(site.slope < .065, `${seed}/${r.module}/${x}/${z}: too steep`);
      }
      for (const [x, z] of [[64, 0], [0, -64], [-64, 60], [64, 64]]) {
        assert.ok(Math.abs(regionHeight(region, x - .001, z) - regionHeight(region, x + .001, z)) < .001);
      }
    }
  }
});

test('woodland follows habitat, stays rooted, and leaves a meadow through the colony', () => {
  for (const seed of [0, 42, 'NEREID-3077']) {
    const planet = createPlanetBlueprint(seed);
    for (const r of planet.regions) {
      const region = createRegionBlueprint(planet, r.id), e = createRegionEnvironment(region);
      assert.ok(e.trees.length > 20 && e.trees.length < 450);
      assert.ok(e.plants.length < 3500);
      for (const tree of e.trees) {
        const ground = regionGroundHeight(region, tree.x, tree.z), habitat = regionHabitat(region, tree.x, tree.z, ground);
        assert.ok(habitat.forest > .01 && ground > 1.4);
        assert.ok(Math.abs(tree.y - ground + .12) < 1e-9);
        assert.ok(tree.model === 'forest' ? Math.hypot(tree.x, tree.z) > 80 : tree.size < 6.3);
        const up = new Vector3(0, 1, 0).transformDirection(floraMatrix(tree));
        assert.ok(up.distanceTo(new Vector3(0, 1, 0)) < 1e-9, 'trunks must stay upright');
      }
      assert.ok(e.trees.filter(t => Math.abs(t.x) < 16 && Math.abs(t.z) < 32).length <= 2);
      for (const fern of e.plants.filter(p => p.model === 'fern')) {
        const h = regionHabitat(region, fern.x, fern.z, fern.y + .025);
        assert.ok(h.moisture > .35 && h.forest > .19);
      }
    }
  }
});

test('prepared plants retain source variants, normals, UVs and real cutout alpha within a mobile budget', async () => {
  for (const [name, variants, triangles] of [['pine-young.glb', 2, 40000], ['fir-young.glb', 1, 20000], ['fern.glb', 1, 500], ['meadow-grass.glb', 2, 400]]) {
    const bytes = await readFile(new URL(`../web/models/planets/${name}`, import.meta.url));
    assert.ok(bytes.length < 3200000); const doc = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)));
    assert.equal(doc.nodes.length, variants);
    let count = 0;
    for (const mesh of doc.meshes) for (const p of mesh.primitives) {
      count += doc.accessors[p.indices].count / 3;
      for (const semantic of ['NORMAL', 'TEXCOORD_0']) assert.ok(Number.isInteger(p.attributes[semantic]));
      const a = doc.accessors[p.attributes.POSITION]; assert.ok(a.min[1] > -.001 && a.max[1] <= 1.001);
    }
    assert.ok(count <= triangles);
    if (name !== 'fir-young.glb') {
      const material = doc.materials.find(m => m.alphaMode === 'MASK'); assert.ok(material);
      const texture = doc.textures[material.pbrMetallicRoughness.baseColorTexture.index];
      assert.equal(doc.images[texture.source].mimeType, 'image/png');
    }
  }
});

test('distant pine views track the camera without moving roots or sharing mutable frame buffers', () => {
  const trees = [{ x: 140, y: 4, z: 20, size: 18, width: 1, rotation: .5, variant: 0, tint: 1 }, { x: -160, y: 6, z: -90, size: 22, width: .9, rotation: 1, variant: 1, tint: .95 }];
  const group = new Group(), forest = createForestBatches(group, trees, null);
  assert.equal(forest.batches.length, 2);
  const buffers = new Set(forest.batches.map(b => b.frames)); assert.equal(buffers.size, 2);
  for (const eye of [new Vector3(70, 100, 130), new Vector3(-80, 60, -70)]) {
    updateForestBatches(forest, eye);
    for (const { mesh, plants, frames } of forest.batches) {
      assert.ok(mesh.boundingSphere && !new Box3().setFromObject(mesh).isEmpty());
      for (let i = 0; i < plants.length; i++) {
        assert.ok(frames.getX(i) >= 0 && frames.getX(i) <= 7);
        assert.equal(frames.getY(i), 1 - plants[i].variant);
      }
    }
  }
  for (const { mesh } of forest.batches) { mesh.geometry.dispose(); mesh.dispose(); }
  forest.batches[0].mesh.material.dispose();
});
