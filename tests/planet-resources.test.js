import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlanetBlueprint, createRegionBlueprint, regionGroundHeight, regionWater } from '../src/planet-blueprint.js';
import { createRegionEnvironment } from '../src/planet-environment.js';
import { RESOURCE_TYPES, PROBE_BUILDINGS, resourceBackground, resourceFieldDensity, sampleResources, extractorProduction } from '../src/planet-resources.js';
import { emptyConstruction, placeConstruction, demolishConstruction, restoreConstruction, constructionKey } from '../src/planet-construction.js';
import { createResourcePresentation, createProbeExtractor, blendResourceGround } from '../src/planet-resource-scene.js';
import { MeshStandardMaterial, ShaderLib } from 'three';

const planet = createPlanetBlueprint(20, { regionCount: 5 }), actual = createRegionBlueprint(planet, 'region-2');
const region = { ...actual, module: 'upland', climateBiome: 'boreal', resources: [] };
const footprint = (x = 0, z = 0) => ({ minX: x - 4, maxX: x + 4, minZ: z - 4, maxZ: z + 4 });
const field = (type = 'ore', x = 0, z = 0, radius = 16) => ({ id: 'test-deposit', type, x, z, radius, rx: radius, rz: radius, rotation: 0, phase: 0, strength: 1 });
const dispose = group => { const geometries = new Set(), materials = new Set(); group.traverse(m => { if (m.isInstancedMesh) m.dispose(); if (m.geometry) geometries.add(m.geometry); if (m.material) materials.add(m.material); }); geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); };

test('resource recipes are reproducible, dry, varied and independent of biosphere and plant generation', () => {
  const recipes = new Set();
  for (const preset of ['temperate', 'arid', 'lunar']) for (const seed of [0, 42, 'NEREID-3077']) {
    const p = createPlanetBlueprint(seed, { preset });
    for (const marker of p.regions) {
      const r = createRegionBlueprint(p, marker.id); assert.equal(r.resourceVersion, 1); assert.equal(r.resources.length, 4);
      assert.deepEqual(r.resources, createRegionBlueprint(JSON.parse(JSON.stringify(p)), marker.id).resources);
      for (const d of r.resources) {
        assert.ok(Object.hasOwn(RESOURCE_TYPES, d.type) && d.strength > 0 && d.strength < 1.7);
        assert.ok(Math.max(Math.abs(d.x), Math.abs(d.z)) < 50);
        assert.equal(regionWater(r, d.x, d.z), false);
        assert.ok(resourceFieldDensity(r, d, d.x, d.z) > .2);
      }
      recipes.add(JSON.stringify(r.resources));
    }
  }
  assert.ok(recipes.size > 24);
  for (const biosphere of ['spore', 'coral']) {
    const alien = createRegionBlueprint(createPlanetBlueprint(20, { regionCount: 5, biosphere }), 'region-2');
    assert.deepEqual(alien.resources, actual.resources); assert.equal(constructionKey(alien), constructionKey(actual));
    createRegionEnvironment(alien); assert.deepEqual(alien.resources, actual.resources);
  }
});

test('ordinary stone produces little, ordinary ice even less, and deposits dominate all three outputs', () => {
  for (const [type, config] of Object.entries(PROBE_BUILDINGS).filter(([, b]) => b.resource)) {
    const building = { type, footprint: footprint() }, stone = extractorProduction(region, building), ice = extractorProduction({ ...region, climateBiome: 'ice' }, building);
    const rich = extractorProduction({ ...region, resources: [field(config.resource)] }, building);
    assert.ok(stone.factor < .1 && stone.factor > ice.factor * 3); assert.ok(ice.factor > 0 && ice.factor < .02);
    assert.ok(rich.daily > stone.daily * 10); assert.ok(rich.daily >= config.rate * .8);
    assert.equal(stone.quality, 'Grundertrag'); assert.equal(rich.quality, 'Ergiebiger Kern');
  }
  assert.ok(resourceBackground(region, 0, 0).ore > resourceBackground({ ...region, climateBiome: 'ice' }, 0, 0).ore);
});

test('mineral density falls continuously through the core, edge and adjacent ground without a nominal-boundary cliff', () => {
  const f = field(), r = { ...region, resources: [f] }, samples = Array.from({ length: 280 }, (_, i) => resourceFieldDensity(r, f, i / 10, 0));
  assert.ok(samples[0] > samples[160] && samples[160] > samples[180] && samples[180] > samples[240]);
  for (let i = 1; i < samples.length; i++) { assert.ok(samples[i] <= samples[i - 1] + 1e-10); assert.ok(Math.abs(samples[i] - samples[i - 1]) < .015); }
  assert.ok(Math.abs(resourceFieldDensity(r, f, 16 - .0001, 0) - resourceFieldDensity(r, f, 16 + .0001, 0)) < .0001);
  const core = extractorProduction(r, { type: 'mine', footprint: footprint() }), edge = extractorProduction(r, { type: 'mine', footprint: footprint(14) }), adjacent = extractorProduction(r, { type: 'mine', footprint: footprint(20) }), distant = extractorProduction(r, { type: 'mine', footprint: footprint(40) });
  assert.ok(core.daily > edge.daily && edge.daily > adjacent.daily && adjacent.daily > distant.daily * 2);
});

test('the full footprint and neighbouring cell contribute; tiny deposits cannot grant every extractor the peak yield', () => {
  const r = { ...region, resources: [field('ore', 5, 1, 1.6)] }, mine = { id: 1, type: 'mine', footprint: footprint() };
  assert.equal(sampleResources(r, 0, 0).density.ore, 0);
  const alone = extractorProduction(r, mine); assert.ok(alone.deposit > 0 && alone.deposit < .06);
  const other = { id: 2, type: 'mine', footprint: footprint(8) }, shared = extractorProduction(r, mine, [mine, other]);
  assert.ok(shared.competition > 0 && shared.daily < alone.daily);
  const copies = [1, 2, 3, 4].map(id => ({ ...mine, id })), rich = { ...region, resources: [field()] };
  const single = extractorProduction(rich, mine), sumDeposit = list => list.reduce((s, b) => { const p = extractorProduction(rich, b, list); return s + p.factor - p.background; }, 0), totalDeposit = sumDeposit(copies);
  assert.ok(totalDeposit <= single.deposit * 1.5);
  assert.ok(Math.abs(totalDeposit - sumDeposit(Array.from({ length: 16 }, (_, i) => ({ ...mine, id: i + 1 })))) < 1e-10, 'extra extractors cannot multiply fully allocated local potential');
  assert.deepEqual(extractorProduction(rich, copies[0], copies), extractorProduction(rich, copies[0], [...copies].reverse()));
  const differentType = { ...other, type: 'crystal' }; assert.equal(extractorProduction(r, mine, [mine, differentType]).daily, alone.daily);
});

test('all extractor types can be built on weak ordinary ground and persist using the existing habitat save schema', () => {
  const state = emptyConstruction();
  for (const [i, type] of ['mine', 'crystal', 'geothermal'].entries()) assert.ok(placeConstruction(region, state, -33 + i * 14, -1, [], type).building);
  assert.deepEqual(restoreConstruction(JSON.parse(JSON.stringify(state))), state);
  assert.equal(state.buildings.every(b => extractorProduction(region, b, state.buildings).daily > 0), true);
  const snapshot = structuredClone(state); assert.equal(placeConstruction(region, state, 35, 35, [], 'fake').building, null); assert.deepEqual(state, snapshot);
  assert.equal(demolishConstruction(state, state.buildings[0].id), true); assert.equal(state.clearings.length, 3);
  for (const type of ['mine', 'crystal', 'geothermal']) { const model = createProbeExtractor({ type, id: 1, footprint: footprint(), foundation: { top: 9, bottom: 8.5 } }); assert.ok(model.children.length <= 5); assert.equal(model.position.y, 9); dispose(model); }
});

test('resource signs clear with construction while the underlying deposit remains, and the overlay composes with standard shaders', () => {
  const before = JSON.stringify(actual.resources), empty = emptyConstruction(), time = { value: 0 }, signs = createResourcePresentation(actual, empty, time);
  assert.ok(signs.children.length >= 5); dispose(signs);
  empty.clearings.push({ minX: -150, maxX: 150, minZ: -150, maxZ: 150 }); const cleared = createResourcePresentation(actual, empty, time); assert.equal(cleared.children.length, 0); dispose(cleared);
  assert.equal(JSON.stringify(actual.resources), before);
  const material = new MeshStandardMaterial(), enabled = blendResourceGround(material), shader = { uniforms: {}, vertexShader: ShaderLib.standard.vertexShader, fragmentShader: ShaderLib.standard.fragmentShader };
  material.onBeforeCompile(shader); assert.equal(shader.uniforms.resourceOverlay, enabled); assert.match(shader.vertexShader, /attribute vec4 resourceMap/); assert.match(shader.fragmentShader, /resourceOverlay\*vResourceMap.a/); enabled.value = 1; assert.equal(shader.uniforms.resourceOverlay.value, 1); material.dispose();
});
