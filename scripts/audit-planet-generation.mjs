// Bounded, reproducible coverage of the actual region recipes. No render state
// or saved strategic worlds are created by this audit.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { createPlanetBlueprint, createRegionBlueprint, regionGroundHeight, regionSite, regionWater } from '../src/planet-blueprint.js';
import { samplePlanetSurface } from '../src/planet-geography.js';
import { climateBiome } from '../src/planet-climate.js';
import { regionOverviewPose, constrainRegionCamera } from '../src/planet-camera.js';

export function auditPlanets(count = 500) {
  const report = { seedsPerType: count, planets: 0, regions: 0, biomeCounts: {}, landformCounts: {}, layoutCount: 0, minimumUsableFraction: 1, failures: [] }, layouts = new Set();
  for (const preset of ['temperate', 'arid', 'lunar']) for (let seed = 0; seed < count; seed++) {
    try {
      const p = createPlanetBlueprint(seed, { preset, regionCount: 5 }); report.planets++;
      assert.deepEqual(p, JSON.parse(JSON.stringify(p)));
      if (seed % 25 === 0) assert.deepEqual(p.regions.slice(0, 3), createPlanetBlueprint(seed, { preset, regionCount: 3 }).regions);
      for (const m of p.regions) {
        const s = samplePlanetSurface(p.geography, m.latitude, m.longitude), r = createRegionBlueprint(p, m.id); report.regions++;
        assert.equal(s.ocean, false); assert.deepEqual(r, JSON.parse(JSON.stringify(r)));
        for (const key of Object.keys(m.climate)) assert.equal(m.climate[key], s[key]);
        if (preset === 'temperate') { assert.equal(m.climateBiome, climateBiome(s)); report.biomeCounts[m.climateBiome] = (report.biomeCounts[m.climateBiome] ?? 0) + 1; }
        report.landformCounts[m.module] = (report.landformCounts[m.module] ?? 0) + 1;
        assert.equal(regionSite(r, 0, 0).buildable, true);
        assert.ok(r.colony.pads.length >= 2);
        layouts.add(JSON.stringify(r.colony.pads));
        for (const [x, z, w, d] of r.colony.pads) for (const dx of [-w / 2, 0, w / 2]) for (const dz of [-d / 2, 0, d / 2]) assert.ok(regionSite(r, x + dx, z + dz).buildable, `invalid footprint ${x},${z}`);
        for (const path of r.colony.roads) for (let i = 1; i < path.length; i++) for (let t = 0; t <= 1; t += .2) { const x = path[i - 1][0] * (1 - t) + path[i][0] * t, z = path[i - 1][1] * (1 - t) + path[i][1] * t; assert.ok(regionSite(r, x, z).buildable, 'road crosses unsuitable land'); }
        let usable = 0, total = 0;
        for (let z = -56; z <= 56; z += 16) for (let x = -56; x <= 56; x += 16) { const site = regionSite(r, x, z); total++; if (site.buildable) usable++; assert.ok(Number.isFinite(site.height) && Number.isFinite(site.slope)); }
        const fraction = usable / total; report.minimumUsableFraction = Math.min(report.minimumUsableFraction, fraction); assert.ok(fraction >= .45, 'insufficient usable construction area');
        for (const z of [-600, -200, 0, 200, 600]) for (const x of [-600, -200, 0, 200, 600]) assert.ok(Number.isFinite(regionGroundHeight(r, x, z)));
        if (seed % 20 === 0) {
          const pose = regionOverviewPose(r); assert.ok(Object.values(pose.eye).every(Number.isFinite));
          assert.ok(pose.eye.y > regionGroundHeight(r, pose.eye.x, pose.eye.z) + 2);
          for (const x of [-64, 64]) { const eye = { x: x + 25, y: -10, z: -42 }, target = { x, y: 0, z: 32 }; constrainRegionCamera(r, eye, target); assert.ok(eye.y > regionGroundHeight(r, eye.x, eye.z) + 2); }
        }
        for (const l of r.terrain?.lakes ?? []) assert.equal(regionWater(r, l.x, l.z), true, 'lake centre must agree with ground water');
      }
    } catch (e) { report.failures.push({ preset, seed, message: e.message }); }
  }
  report.layoutCount = layouts.size;
  return report;
}
if (process.argv[1]?.endsWith('audit-planet-generation.mjs')) {
  const count = Number(process.argv[2] ?? 500), report = auditPlanets(count);
  console.log(JSON.stringify(report, null, 2));
  if (process.argv[3]) await writeFile(process.argv[3], JSON.stringify(report, null, 2) + '\n');
  if (report.failures.length) process.exitCode = 1;
}
