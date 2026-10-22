import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createPlanetBlueprint, createReferencePlanetBlueprint, createRegionBlueprint, regionGroundHeight, regionWater } from '../src/planet-blueprint.js';
import { samplePlanetSurface, surfaceColor } from '../src/planet-geography.js';
import { CLIMATE_BIOMES, climateBiome } from '../src/planet-climate.js';
import { regionBiome } from '../src/planet-biomes.js';
import { createRegionEnvironment, NATURAL_FLORA_BUDGET } from '../src/planet-environment.js';
import { colonyClearance } from '../src/planet-colony.js';
import { PLANET_EXAMPLES } from '../src/planet-examples.js';
import { readFloraVariants, readFloraLods } from '../src/planet-flora.js';
import { auditPlanets } from '../scripts/audit-planet-generation.mjs';

test('generated planets cover physical biomes and landforms without repeating a fixed region roster', () => {
  const report = auditPlanets(40);
  assert.deepEqual(report.failures, []);
  assert.deepEqual(Object.keys(report.biomeCounts).sort(), Object.keys(CLIMATE_BIOMES).sort());
  for (const id of ['coast', 'basin', 'upland', 'caldera', 'plain', 'lake', 'regolith']) assert.ok(report.landformCounts[id] > 0);
  assert.ok(report.layoutCount > 100);
  const rosters = new Set(Array.from({ length: 30 }, (_, i) => createPlanetBlueprint(i).regions.map(r => r.module).join('/')));
  assert.ok(rosters.size > 15);
});

test('examples are bookmarks into genuine generated climates and keep their geography across flora comparisons', () => {
  assert.equal(PLANET_EXAMPLES.length, 8);
  for (const example of PLANET_EXAMPLES) {
    const earth = createPlanetBlueprint(example.seed, { climate: example.climate, regionCount: 5 }), marker = earth.regions.find(r => r.id === example.region);
    assert.equal(marker.climateBiome, example.biome); assert.equal(marker.module, example.module);
    for (const biosphere of ['terran', 'spore', 'coral']) {
      const p = createPlanetBlueprint(example.seed, { climate: example.climate, regionCount: 5, biosphere });
      assert.deepEqual(p.regions, earth.regions); assert.deepEqual(p.geography, earth.geography);
      const r = createRegionBlueprint(p, marker.id), b = regionBiome(r), e = createRegionEnvironment(r);
      assert.deepEqual(e, createRegionEnvironment(JSON.parse(JSON.stringify(r))));
      assert.ok(e.trees.length <= NATURAL_FLORA_BUDGET.trees && e.plants.length <= NATURAL_FLORA_BUDGET.plants);
      if (['ice', 'tundra'].includes(example.biome)) assert.equal(e.trees.length, 0);
      if (example.biome === 'ice') assert.equal(e.plants.length, 0);
      if (example.biome === 'rainforest') assert.ok(e.trees.length > 400 && e.plants.length > 1000);
      for (const plant of [...e.trees, ...e.plants]) {
        assert.ok(Math.abs(plant.y - regionGroundHeight(r, plant.x, plant.z)) < .07);
        assert.equal(regionWater(r, plant.x, plant.z), false);
        assert.ok(colonyClearance(r, plant.x, plant.z) >= 2.8);
        if (biosphere !== 'terran') assert.ok(plant.model.startsWith('xeno-'));
      }
      assert.equal(b.id, example.biome);
    }
  }
});

test('world climate changes actual geography classification and dry/airless worlds retain physical constraints', () => {
  const warm = createPlanetBlueprint(42, { climate: 'warm' }), cold = createPlanetBlueprint(42, { climate: 'cold' });
  const a = samplePlanetSurface(warm.geography, 20, 15), b = samplePlanetSurface(cold.geography, 20, 15);
  assert.equal(a.land, b.land); assert.ok(a.temperatureC > b.temperatureC + 20);
  let visiblyDifferent = 0;
  for (let lat = -70; lat <= 70; lat += 14) for (let lon = -170; lon <= 170; lon += 34) {
    const a = samplePlanetSurface(warm.geography, lat, lon), b = samplePlanetSurface(cold.geography, lat, lon);
    if (!a.ocean && JSON.stringify(surfaceColor(a, lat)) !== JSON.stringify(surfaceColor(b, lat))) visiblyDifferent++;
  }
  assert.ok(visiblyDifferent > 10);
  assert.throws(() => createPlanetBlueprint(1, { climate: 'missing' }));
  for (const preset of ['arid', 'lunar']) {
    const p = createPlanetBlueprint(42, { preset });
    for (const m of p.regions) { const r = createRegionBlueprint(p, m.id), e = createRegionEnvironment(r); assert.equal(e.trees.length, 0); assert.equal(e.plants.length, 0); assert.equal(regionWater(r, 0, 0), false); }
  }
  const old = createReferencePlanetBlueprint('NEREID-3077'); assert.equal(old.generatorVersion, 7);
  for (const m of old.regions) assert.deepEqual(createRegionBlueprint(old, m.id), createRegionBlueprint(JSON.parse(JSON.stringify(old)), m.id));
});

test('climate flora uses rooted spatial geometry, verified assets and progressively smaller LODs', async () => {
  const records = JSON.parse(await readFile('web/models/planets/climate-flora-provenance.json', 'utf8'));
  const { models } = JSON.parse(await readFile('web/models/planets/climate-flora-lods.json', 'utf8'));
  assert.equal(records.length, 6);
  for (const record of records) {
    const bytes = await readFile('web/models/planets/' + record.file); assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256);
    const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), ''), variants = readFloraVariants(gltf, 1);
    assert.equal(variants.length, 2); const lods = readFloraLods(models[record.id]);
    for (const [i, parts] of variants.entries()) {
      let lo = Infinity, hi = -Infinity;
      for (const { geometry: g, material } of parts) { g.computeBoundingBox(); lo = Math.min(lo, g.boundingBox.min.y); hi = Math.max(hi, g.boundingBox.max.y); assert.ok(material.vertexColors); assert.ok(g.attributes.position.array.every(Number.isFinite)); }
      assert.ok(Math.abs(lo) < 1e-5 && Math.abs(hi - 1) < 1e-5);
      const counts = [parts.map(p => p.geometry), ...lods[i]].map(gs => gs.reduce((s, g) => s + g.index.count / 3, 0)); assert.ok(counts[2] < counts[1] && counts[1] < counts[0]);
    }
  }
});
