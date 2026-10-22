import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createPlanetBlueprint, createRegionBlueprint, regionWater } from '../src/planet-blueprint.js';
import { resourceFieldDensity, extractorProduction } from '../src/planet-resources.js';
import { constructionFootprint } from '../src/planet-construction.js';

export function auditResources(count = 100) {
  const report = { planets: 0, regions: 0, fields: 0, types: {}, outputRange: {}, failures: [] };
  for (const preset of ['temperate', 'arid', 'lunar']) for (let seed = 0; seed < count; seed++) {
    const p = createPlanetBlueprint(seed, { preset, regionCount: 5 }); report.planets++;
    for (const m of p.regions) {
      const r = createRegionBlueprint(p, m.id); report.regions++;
      for (const f of r.resources) {
        report.fields++; report.types[f.type] = (report.types[f.type] ?? 0) + 1;
        const bad = message => report.failures.push(`${preset}/${seed}/${m.id}/${f.id}: ${message}`);
        if (!Object.values(f).filter(v => typeof v === 'number').every(Number.isFinite)) bad('Non-finite recipe');
        if (regionWater(r, f.x, f.z)) bad('Flooded core');
        if (resourceFieldDensity(r, f, f.x, f.z) < .2) bad('Missing core potential');
        const c = Math.cos(f.rotation), s = Math.sin(f.rotation), a = resourceFieldDensity(r, f, f.x + c * f.rx * .99999, f.z + s * f.rx * .99999), b = resourceFieldDensity(r, f, f.x + c * f.rx * 1.00001, f.z + s * f.rx * 1.00001);
        if (Math.abs(a - b) > .0001) bad('Abrupt field boundary');
        const type = { ore: 'mine', crystal: 'crystal', geothermal: 'geothermal' }[f.type], production = extractorProduction(r, { type, footprint: constructionFootprint(f.x, f.z) });
        if (!(production.daily > 0) || !Number.isFinite(production.daily)) bad('Invalid extractor output');
        const range = report.outputRange[f.type] ??= { min: Infinity, max: 0 }; range.min = Math.min(range.min, production.daily); range.max = Math.max(range.max, production.daily);
      }
      const baseline = extractorProduction({ ...r, resources: [] }, { type: 'mine', footprint: constructionFootprint(0, 0) });
      if (baseline.factor > .1 || !(baseline.factor > 0)) report.failures.push(`${preset}/${seed}/${m.id}: Incorrect ordinary-ground baseline`);
    }
  }
  return report;
}
if (process.argv[1] && resolve(process.argv[1]) === import.meta.filename) {
  const report = auditResources(Number(process.argv[2] ?? 100));
  if (process.argv[3]) await writeFile(process.argv[3], JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2)); if (report.failures.length) process.exitCode = 1;
}
