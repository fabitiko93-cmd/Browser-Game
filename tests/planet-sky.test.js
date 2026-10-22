import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PlaneGeometry, Vector3, Euler, Texture } from 'three';
import { createPlanetBlueprint, createRegionBlueprint, regionTerrainPatches, regionHeight } from '../src/planet-blueprint.js';
import { regionSkyProfile, createRegionSky } from '../src/planet-sky.js';
import { PLANET_SKIES } from '../src/planet-sky-data.js';
import { regionHorizonGeometry, REGION_HORIZON_EXTENT } from '../src/planet-horizon.js';
import { regionOverviewPose } from '../src/planet-camera.js';

test('sky follows planetary atmosphere and regional climate without changing world recipes', () => {
  for (const preset of ['temperate', 'arid', 'lunar']) {
    const planet = createPlanetBlueprint('NEREID-3077', { preset });
    for (const marker of planet.regions) {
      const r = createRegionBlueprint(planet, marker.id), before = JSON.stringify(r), sky = regionSkyProfile(r);
      assert.equal(JSON.stringify(r), before);
      assert.deepEqual(sky, regionSkyProfile(r));
      if (preset === 'lunar') { assert.equal(sky, null); continue; }
      assert.equal(sky.id, preset === 'arid' ? 'dust' : r.module === 'caldera' ? 'overcast' : 'fair');
      assert.equal(!!sky.file, preset === 'temperate');
      assert.ok(Math.abs(Math.hypot(...sky.sunDirection) - 1) < 1e-12);
      const { eye, target, fov } = regionOverviewPose(r);
      const pitch = Math.atan2(eye.y - target.y, Math.hypot(eye.x - target.x, eye.z - target.z)) * 180 / Math.PI;
      assert.ok(pitch < fov / 2, `${preset}/${r.module}: the actual overview should expose sky`);
    }
  }
});

test('photographed sun, directional shadows and environment sampling use the same world direction', () => {
  const p = createPlanetBlueprint(42);
  for (const marker of p.regions) {
    const sky = regionSkyProfile(createRegionBlueprint(p, marker.id)), source = PLANET_SKIES[sky.id];
    const sourceDirection = new Vector3(Math.cos(source.elevation) * Math.cos(source.azimuth), Math.sin(source.elevation), Math.cos(source.elevation) * Math.sin(source.azimuth));
    const world = sourceDirection.clone().applyEuler(new Euler(0, -sky.yaw, 0));
    assert.ok(world.distanceTo(new Vector3(...sky.sunDirection)) < 1e-12);
    // Three inverts scene.environmentRotation before uploading its matrix.
    const environmentSample = world.clone().applyEuler(new Euler(0, sky.yaw, 0));
    assert.ok(environmentSample.distanceTo(sourceDirection) < 1e-12);
    const mesh = createRegionSky(sky, new Texture());
    assert.equal(mesh.frustumCulled, false); assert.equal(mesh.material.depthTest, false); assert.equal(mesh.material.depthWrite, false);
    assert.equal(mesh.material.toneMapped, false); // prepared sRGB gets no second exposure curve
    assert.ok(mesh.geometry.index.count <= 36);
    mesh.geometry.dispose(); mesh.material.dispose();
  }
});

test('distant landscape joins every rendered boundary vertex and stays outside the playable surface', () => {
  for (const preset of ['temperate', 'arid']) for (const seed of [42, 'NEREID-3077']) {
    const planet = createPlanetBlueprint(seed, { preset });
    for (const marker of planet.regions) {
      const r = createRegionBlueprint(planet, marker.id), g = regionHorizonGeometry(r), pos = g.attributes.position, count = g.userData.innerVertexCount;
      const edge = r.size * 5, keys = new Map();
      for (let i = 0; i < count; i++) keys.set(`${pos.getX(i)},${pos.getZ(i)}`, pos.getY(i));
      for (const p of regionTerrainPatches(r)) {
        const patch = new PlaneGeometry(p.maxX - p.minX, p.maxZ - p.minZ, p.segmentsX, p.segmentsZ); patch.rotateX(-Math.PI / 2); patch.translate((p.minX + p.maxX) / 2, 0, (p.minZ + p.maxZ) / 2);
        const v = patch.attributes.position;
        for (let i = 0; i < v.count; i++) {
          const x = v.getX(i), z = v.getZ(i);
          if (Math.abs(x) !== edge && Math.abs(z) !== edge) continue;
          assert.equal(keys.get(`${x},${z}`), Math.fround(regionHeight(r, x, z)), `${preset}/${r.module}: horizon seam at ${x},${z}`);
        }
        patch.dispose();
      }
      assert.ok(g.index.count / 3 < 20000);
      for (let i = 0; i < pos.count; i++) {
        assert.ok(Number.isFinite(pos.getY(i))); assert.ok(Math.max(Math.abs(pos.getX(i)), Math.abs(pos.getZ(i))) >= edge);
        assert.ok(g.attributes.normal.getY(i) > 0);
      }
      assert.equal(Math.max(...Array.from(pos.array).filter((_, i) => i % 3 === 0)), REGION_HORIZON_EXTENT);
      g.dispose();
    }
  }
});

test('mobile sky assets have official CC0 provenance and verified output hashes', async () => {
  const provenance = JSON.parse(await readFile('web/models/planets/sky-provenance.json', 'utf8'));
  assert.equal(provenance.length, Object.keys(PLANET_SKIES).length);
  assert.equal(provenance.filter(r => !r.derivedFrom).length, 2);
  for (const record of provenance) {
    const bytes = await readFile('web/models/planets/' + record.file);
    assert.equal(record.license, 'CC0-1.0'); assert.ok(record.download.startsWith('https://dl.polyhaven.org/'));
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF'); assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    assert.equal(record.width, 2048); assert.equal(record.height, 1024); assert.ok(bytes.length < 160000);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), record.outputSha256);
    assert.equal(PLANET_SKIES[record.id].file, record.file);
  }
});
