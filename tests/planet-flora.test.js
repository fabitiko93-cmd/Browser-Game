import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Group, Vector3, BufferGeometry, Float32BufferAttribute, MeshStandardMaterial } from 'three';
import { createPlanetBlueprint, createRegionBlueprint, regionGroundHeight, regionHeight, regionSite, regionCreek } from '../src/planet-blueprint.js';
import { createRegionEnvironment, regionHabitat } from '../src/planet-environment.js';
import { colonyClearance } from '../src/planet-colony.js';
import { addFloraBatches, floraMatrix } from '../src/planet-flora.js';

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

test('regional woodland follows its climate and preserves rooted trees and site clearings', () => {
  for (const seed of [0, 42, 'NEREID-3077']) {
    const planet = createPlanetBlueprint(seed);
    for (const r of planet.regions) {
      const region = createRegionBlueprint(planet, r.id), e = createRegionEnvironment(region);
      assert.ok(e.trees.length > 15 && e.trees.length < (r.module === 'basin' ? 6000 : 2200), `${seed}/${r.module}: ${e.trees.length}`);
      if (r.module === 'coast' || r.module === 'caldera') assert.ok(e.trees.length < 500);
      if (r.module === 'basin') assert.ok(e.trees.length > 2800);
      assert.ok(e.plants.length > 1000 && e.plants.length < 16000);
      for (const tree of e.trees) {
        const ground = regionGroundHeight(region, tree.x, tree.z), habitat = regionHabitat(region, tree.x, tree.z, ground);
        assert.ok(habitat.forest > .01 && ground > 1.4);
        assert.ok(Math.abs(tree.y - ground + .08) < 1e-9);
        assert.ok(['oak', 'aspen', 'pine'].includes(tree.model));
        assert.ok(tree.size >= 1.8 && tree.size <= 18);
        const up = new Vector3(0, 1, 0).transformDirection(floraMatrix(tree));
        assert.ok(up.distanceTo(new Vector3(0, 1, 0)) < 1e-9, 'trunks must stay upright');
      }
      assert.ok(e.trees.every(t => colonyClearance(region, t.x, t.z) > 4));
      assert.ok(e.plants.every(t => colonyClearance(region, t.x, t.z) >= 2.8));
      for (const fern of e.plants.filter(p => p.model === 'fern')) {
        const h = regionHabitat(region, fern.x, fern.z, fern.y + .025);
        assert.ok(h.moisture > .35 && h.forest > .19);
      }
    }
  }
});

test('prepared plants retain source variants, normals, UVs and real cutout alpha within a mobile budget', async () => {
  for (const [name, variants, triangles] of [['woodland-oak.glb', 2, 18000], ['woodland-aspen.glb', 2, 18000], ['woodland-pine.glb', 2, 18000], ['woodland-shrub.glb', 2, 18000], ['fern.glb', 1, 500], ['meadow-grass.glb', 2, 400]]) {
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
    {
      const material = doc.materials.find(m => m.alphaMode === 'MASK'); assert.ok(material);
      const texture = doc.textures[material.pbrMetallicRoughness.baseColorTexture.index];
      assert.equal(doc.images[texture.source].mimeType, 'image/png');
    }
  }
});

test('complete near trees are instanced in cullable chunks and preserve fixed rooted transforms', () => {
  const geometry = new BufferGeometry(); geometry.setAttribute('position', new Float32BufferAttribute([0,0,0, 1,0,0, 0,1,0], 3));
  const material = new MeshStandardMaterial(), group = new Group();
  const trees = [{ x: 25, y: 4, z: 20, size: 12, width: 1, rotation: .5, variant: 0, tint: 1 }, { x: -160, y: 6, z: -90, size: 16, width: .9, rotation: 1, variant: 0, tint: .95 }];
  addFloraBatches(group, trees, [[{ geometry, material }]], { trees: true });
  assert.equal(group.children.length, 2);
  for (const mesh of group.children) { assert.ok(mesh.isInstancedMesh && mesh.boundingSphere); assert.ok(mesh.frustumCulled); assert.equal(mesh.geometry, geometry); mesh.dispose(); }
  assert.equal(group.children.filter(m => m.castShadow).length, 1);
  geometry.dispose(); material.dispose();
});

test('continuous valley river stays beyond build footprints and excludes plants from its wet bed', () => {
  const planet = createPlanetBlueprint('NEREID-3077'), region = createRegionBlueprint(planet, planet.regions[1].id);
  for (let z = -960; z <= 960; z += 8) { const c = regionCreek(region, z); assert.ok(c.x + c.width < -64); }
  for (let z = -430; z <= -140; z += 10) {
    const c = regionCreek(region, z); assert.ok(c && c.width > 0);
    assert.equal(regionSite(region, c.x, z).water, true);
    assert.equal(regionSite(region, c.x, z).inBuildArea, false);
    const h = regionHabitat(region, c.x, z, regionGroundHeight(region, c.x, z)); assert.equal(h.cover, 0);
  }
});
