import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Group, PerspectiveCamera, Frustum, Matrix4, Vector3, MeshStandardMaterial } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createReferencePlanetBlueprint as createPlanetBlueprint, createRegionBlueprint, regionGroundHeight, regionSite } from '../src/planet-blueprint.js';
import { BIOSPHERES, regionBiome, regionBiosphere } from '../src/planet-biomes.js';
import { createRegionEnvironment, FLORA_ASSETS } from '../src/planet-environment.js';
import { colonyClearance } from '../src/planet-colony.js';
import { planetSurfacePixels } from '../src/planet-geography.js';
import { regionOverviewPose } from '../src/planet-camera.js';
import { regionSkyProfile } from '../src/planet-sky.js';
import { readFloraVariants, readFloraLods, addFloraBatches, updateFloraLods, CANOPY_MODELS, floraMatrix } from '../src/planet-flora.js';
import { blendHabitatGround } from '../src/planet-ground-material.js';
import { blendBuildGrid } from '../src/planet-grid.js';

const alienIds = ['spore', 'coral'];
const withoutBiology = value => { const { biosphere, ...rest } = value; return rest; };

test('biosphere comparisons retain exact seeded geography, climate, rivers, geology and building constraints', () => {
  for (const seed of [42, 'NEREID-3077']) {
    const earth = createPlanetBlueprint(seed, { valley: 'woodland' });
    assert.deepEqual(earth, createPlanetBlueprint(seed, { valley: 'woodland', biosphere: 'terran' }));
    for (const biosphere of alienIds) {
      const planet = createPlanetBlueprint(seed, { valley: 'woodland', biosphere });
      assert.deepEqual(withoutBiology(planet), earth);
      assert.deepEqual(JSON.parse(JSON.stringify(planet)), planet);
      for (const marker of planet.regions) {
        const a = createRegionBlueprint(planet, marker.id), b = createRegionBlueprint(earth, marker.id);
        assert.deepEqual(withoutBiology(a), b);
        for (let z = -64; z <= 64; z += 16) for (let x = -64; x <= 64; x += 16) assert.deepEqual(regionSite(a, x, z), regionSite(b, x, z));
        assert.ok(regionBiome(a).alien);
      }
      const pixels = planetSurfacePixels(planet.geography, 64, 32, regionBiosphere(planet));
      assert.notDeepEqual(pixels.data, planetSurfacePixels(earth.geography, 64, 32).data);
    }
  }
  assert.throws(() => createPlanetBlueprint(42, { biosphere: 'missing-biome' }), /Biosphäre/);
  assert.throws(() => createPlanetBlueprint(42, { preset: 'lunar', biosphere: 'spore' }), /bewohnbare/);
});

test('alien flora follows wet ground, regional canopy and established construction clearings reproducibly', () => {
  for (const biosphere of alienIds) {
    const planet = createPlanetBlueprint('NEREID-3077', { biosphere, valley: 'woodland' }), populations = [];
    for (const marker of planet.regions) {
      const r = createRegionBlueprint(planet, marker.id), e = createRegionEnvironment(r); populations.push(e.trees.length);
      assert.deepEqual(e, createRegionEnvironment(JSON.parse(JSON.stringify(r))));
      assert.ok(e.trees.length > 10 && e.trees.length < 3500);
      assert.ok(e.plants.length > 700 && e.plants.length < 3500);
      for (const p of [...e.trees, ...e.plants]) {
        assert.ok(p.model.startsWith('xeno-'));
        assert.equal(regionSite(r, p.x, p.z).water, false);
        const tree = CANOPY_MODELS.includes(p.model);
        assert.ok(colonyClearance(r, p.x, p.z) >= (tree ? 4 : 2.8));
        assert.ok(Math.abs(p.y - regionGroundHeight(r, p.x, p.z)) < .09);
        assert.ok(new Vector3(0, 1, 0).transformDirection(floraMatrix(p)).distanceTo(new Vector3(0, 1, 0)) < 1e-9);
      }
    }
    assert.ok(populations[1] > populations[0] * 3);
    assert.ok(populations[1] > populations[3] * 8);
  }
});

const variants = new Map();
async function loadModel(id) {
  if (!variants.has(id)) variants.set(id, (async () => {
    const bytes = await readFile('web/models/planets/' + FLORA_ASSETS[id]);
    const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
    return readFloraVariants(gltf, 1);
  })());
  return variants.get(id);
}

test('original alien assets load through the runtime GLTF path as rooted coloured 3D models', async () => {
  const records = JSON.parse(await readFile('web/models/planets/alien-flora-provenance.json', 'utf8'));
  assert.equal(records.length, 4);
  for (const record of records) {
    const bytes = await readFile('web/models/planets/' + record.file);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256);
    assert.ok(bytes.length < 900000);
    const id = Object.keys(FLORA_ASSETS).find(id => FLORA_ASSETS[id] === record.file), model = await loadModel(id);
    assert.equal(model.length, 2);
    for (const parts of model) {
      let triangles = 0, maxHeight = 0;
      for (const { geometry: g, material } of parts) {
        assert.ok(material.vertexColors); assert.equal(material.transparent, false);
        assert.equal(material.map, null); // actual spatial forms, not tree images
        for (const name of ['normal', 'uv', 'color']) assert.equal(g.attributes[name].count, g.attributes.position.count);
        for (const v of g.attributes.position.array) assert.ok(Number.isFinite(v));
        g.computeBoundingBox();assert.ok(g.boundingBox.min.y >= -.00001);maxHeight = Math.max(maxHeight, g.boundingBox.max.y);
        triangles += g.index.count / 3;
      }
      assert.ok(Math.abs(maxHeight - 1) < .00001);assert.ok(triangles < 6500);
    }
  }
});

test('both alien worlds use camera-dependent coloured LODs within the existing portrait tree budget', async () => {
  const { models } = JSON.parse(await readFile('web/models/planets/alien-flora-lods.json', 'utf8'));
  for (const biosphere of alienIds) for (const valley of ['meadow', 'meander', 'woodland']) {
    const planet = createPlanetBlueprint('NEREID-3077', { biosphere, valley }), r = createRegionBlueprint(planet, 'region-1'), e = createRegionEnvironment(r), group = new Group();
    const id = biosphere === 'spore' ? 'xeno-spore' : 'xeno-coral', source = await loadModel(id), lods = readFloraLods(models[id]);
    for (const variant of lods) for (const level of variant) for (const g of level) assert.equal(g.attributes.color.count, g.attributes.position.count);
    addFloraBatches(group, e.trees, source, { trees: true, lods });
    const pose = regionOverviewPose(r), camera = new PerspectiveCamera(pose.fov, .75, .2, 6000);camera.position.copy(pose.eye);camera.lookAt(pose.target.x, pose.target.y, pose.target.z);camera.updateMatrixWorld();updateFloraLods(group, camera);
    const frustum = new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
    let triangles = 0, draws = 0;
    for (const mesh of group.children) if (frustum.intersectsSphere(mesh.boundingSphere)) { triangles += mesh.geometry.index.count / 3 * mesh.count;draws++; }
    assert.ok(triangles < 2000000, `${biosphere}/${valley}: ${triangles} visible tree triangles`);assert.ok(draws < 240);
    const batch = group.children[0];camera.position.copy(batch.userData.lodCenter).add(new Vector3(25, 15, 15));updateFloraLods(group, camera);assert.equal(batch.userData.lodLevel, 0);
    camera.position.copy(batch.userData.lodCenter).add(new Vector3(310, 90, 0));updateFloraLods(group, camera);assert.equal(batch.userData.lodLevel, 2);
    for (const mesh of group.children) mesh.dispose();for (const v of lods) for (const level of v) for (const g of level) g.dispose();
  }
});

test('ground and build grid compose in every biosphere; atmosphere and reflections share their graded panorama', () => {
  for (const biosphere of Object.keys(BIOSPHERES)) {
    const p = createPlanetBlueprint(42, { biosphere }), r = createRegionBlueprint(p, 'region-1'), mat = new MeshStandardMaterial();
    blendHabitatGround(mat, { meadow: {}, meadowNormal: {}, forest: {}, forestNormal: {} }, r);
    const state = blendBuildGrid(mat, { visible: true });
    const shader = { uniforms: {}, vertexShader: '#include <common>\n#include <begin_vertex>', fragmentShader: '#include <common>\n#include <map_fragment>\n#include <normal_fragment_maps>\n#include <emissivemap_fragment>\n#include <fog_fragment>' };
    mat.onBeforeCompile(shader);assert.equal(shader.uniforms.buildGridEnabled, state.enabled);
    assert.equal(shader.uniforms.alienGround.value, biosphere === 'terran' ? 0 : 1);
    assert.equal(shader.uniforms.meadowTint.value.getHexString(), regionBiome(r).meadow.slice(1));
    const sky = regionSkyProfile(r);
    assert.equal(sky.id, biosphere === 'terran' ? 'fair' : biosphere + '-fair');
    assert.ok(sky.file.includes(sky.id));assert.ok(sky.horizon.startsWith('#'));
    mat.dispose();
  }
});
