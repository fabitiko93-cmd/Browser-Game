import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame } from '../src/state.js';
import { createPlanetBlueprint, createRegionBlueprint, regionSite, planetSubseed } from '../src/planet-blueprint.js';

test('planet recipes are reproducible, serializable and independently seeded', () => {
  const a = createPlanetBlueprint('NEREID-3077'), b = createPlanetBlueprint('NEREID-3077');
  assert.deepEqual(a, b);
  assert.deepEqual(JSON.parse(JSON.stringify(a)), a);
  assert.notDeepEqual(a, createPlanetBlueprint('NEREID-3078'));
  const region = createRegionBlueprint(a, a.regions[0].id);
  createRegionBlueprint(a, a.regions[2].id);
  assert.deepEqual(region, createRegionBlueprint(b, b.regions[0].id));
  assert.equal(new Set(a.regions.map(r => r.seed)).size, a.regions.length);
  assert.notEqual(planetSubseed(a.seed, 'terrain'), planetSubseed(a.seed, 'buildings'));
  assert.throws(() => createRegionBlueprint({ ...a, generatorVersion: 999 }, a.regions[0].id), /Version/);
});

test('region modules preserve real constraints and a usable central area', () => {
  for (const preset of ['temperate', 'arid', 'lunar']) {
    const planet = createPlanetBlueprint(0, { preset, regionCount: 5 });
    assert.equal(planet.regions.length, 5);
    for (const r of planet.regions) {
      const region = createRegionBlueprint(planet, r.id);
      assert.equal(regionSite(region, 0, 0).buildable, true);
      assert.ok(region.rocks.every(rock => Math.hypot(rock.x, rock.z) > 24));
      if (r.module === 'coast') {
        assert.equal(regionSite(region, -90, 0).water, true);
        assert.equal(regionSite(region, -90, 0).coastDistance, 0);
        assert.ok(regionSite(region, 0, 0).coastDistance > 35);
      }
      else assert.equal(regionSite(region, -90, 0).water, false);
      assert.equal(regionSite(region, 100, 0).buildable, false);
    }
  }
  assert.throws(() => createPlanetBlueprint('x', { regionCount: 30 }));
  assert.throws(() => createPlanetBlueprint('x', { preset: 'gas-giant-with-ground' }));
});

test('derived presentation recipes never modify a strategic save', () => {
  const game = createGame({ seed: 'planet-fixture' }), before = JSON.stringify(game);
  const p = game.planets.find(p => p.owner === 'player');
  const recipe = createPlanetBlueprint(p.seed, { name: p.name });
  recipe.regions.forEach(r => createRegionBlueprint(recipe, r.id));
  assert.equal(JSON.stringify(game), before);
});
