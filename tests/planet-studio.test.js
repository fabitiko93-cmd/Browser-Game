import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlanetBlueprint, createRegionBlueprint, regionGroundHeight } from '../src/planet-blueprint.js';
import { STUDIO_SCENES, STUDIO_LOOKS, normalizeStudioValues, normalizeStudioPose, readStudioSettings, studioURL, studioCameraPose, poseArray } from '../src/planet-studio.js';
import { resourceBackground } from '../src/planet-resources.js';

test('comparison bookmarks cover existing climates and airless/dry terrain without replacing procedural generation', () => {
  const biomes = new Set();
  for (const scene of STUDIO_SCENES) {
    const planet = createPlanetBlueprint(scene.seed, { preset: scene.preset, climate: scene.climate, regionCount: scene.regions });
    const recipe = planet.regions.find(r => r.id === scene.region); assert.ok(recipe, scene.id);
    if (scene.biome) { assert.equal(recipe.climateBiome, scene.biome, scene.id); assert.equal(recipe.module, scene.module, scene.id); biomes.add(scene.biome); }
  }
  assert.equal(biomes.size, 8); assert.ok(STUDIO_SCENES.some(s => s.preset === 'lunar')); assert.ok(STUDIO_SCENES.some(s => s.preset === 'arid'));
});

test('a comparison link round-trips the full world recipe, custom appearance and actual camera', () => {
  const input = new URL('https://example.test/planet-preview.html?seed=custom-world&preset=temperate&regions=5&region=region-3&climate=cold&biosphere=spore&name=Aster&v=build');
  const settings = { active: true, look: 'custom', shot: 'free', values: { exposure: 1.12, fill: .9, haze: .65, detail: 1.2 }, pose: [70, 110, 105, 0, 12, 0, 43] };
  const link = studioURL(input, settings), parsed = readStudioSettings(link.searchParams);
  assert.deepEqual(parsed, settings);
  for (const [key, value] of input.searchParams) assert.equal(link.searchParams.get(key), value);
  const exit = studioURL(link, { active: false }); assert.equal(exit.href, input.href);
  assert.equal(studioURL(link, parsed).href, link.href);
});

test('invalid appearance links cannot create unbounded light, haze, detail or camera coordinates', () => {
  assert.deepEqual(normalizeStudioValues({ exposure: 'NaN', fill: -100, haze: 1e30, detail: '' }), { exposure: 1, fill: .5, haze: 1.8, detail: 1 });
  for (const pose of ['1,2', 'Infinity,1,1,0,0,0,43', [0, 0, 0, 0, 0, 0, 43], [5000, 40, 1, 0, 0, 0, 43], [40, 40, 40, 0, 0, 0, 179], [40, 40, 40, 200, 0, 0, 43]]) assert.equal(normalizeStudioPose(pose), null);
  const parsed = readStudioSettings(new URLSearchParams('studio=1&look=unknown&shot=invalid&pose=broken'));
  assert.equal(parsed.look, 'natural'); assert.equal(parsed.shot, 'overview'); assert.equal(parsed.pose, null);
});

test('fixed comparison cameras clear terrain for every reference landscape and are reproducible', () => {
  for (const scene of STUDIO_SCENES) {
    const region = createRegionBlueprint(createPlanetBlueprint(scene.seed, { preset: scene.preset, regionCount: scene.regions, climate: scene.climate }), scene.region);
    for (const shot of ['overview', 'colony', 'ground']) {
      const pose = studioCameraPose(region, shot);
      assert.deepEqual(pose, studioCameraPose(region, shot)); assert.ok(poseArray(pose), `${scene.id}/${shot}`);
      assert.ok(pose.eye.y >= regionGroundHeight(region, pose.eye.x, pose.eye.z) + 2.9, `${scene.id}/${shot}`);
    }
    const before = JSON.stringify(region);
    for (const look of Object.keys(STUDIO_LOOKS)) { normalizeStudioValues({}, look); studioCameraPose(region, 'ground'); }
    assert.equal(JSON.stringify(region), before, 'Visual comparison must not mutate geology or ecology');
  }
});

test('airless regolith stays mineral ground even when its temperature is below freezing', () => {
  for (const r of createPlanetBlueprint(42, { preset: 'lunar', regionCount: 5 }).regions) {
    const region = createRegionBlueprint(createPlanetBlueprint(42, { preset: 'lunar', regionCount: 5 }), r.id);
    assert.equal(region.climateBiome, 'ice'); assert.equal(resourceBackground(region, 0, 0).name, 'Steiniger Untergrund');
  }
  const icy = STUDIO_SCENES.find(s => s.id === 'ice');
  const region = createRegionBlueprint(createPlanetBlueprint(icy.seed, { preset: icy.preset, regionCount: icy.regions }), icy.region);
  assert.equal(resourceBackground(region, 0, 0).name, 'Eisuntergrund');
});
