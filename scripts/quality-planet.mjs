import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
// Stop at the first failed stage; an absent browser is an incomplete review,
// never a successful visual test. Results remain in review/planet/.
const stages = [
  ['Build', ['scripts/build.mjs']],
  ['Tests', ['--test']],
  ['Build consistency', ['scripts/build.mjs', '--check']],
  ['Resource audit', ['scripts/audit-planet-resources.mjs', '100', 'review/planet/resources-generation.json']],
  ['Construction and selection browser review', ['scripts/qa-planet-selection.mjs']],
  ['Landscape studio browser review', ['scripts/qa-planet-studio.mjs']]
];
for (const [name, args] of stages) {
  console.log(`\n${name}`);
  const code = await new Promise((done, reject) => {
    const child = spawn(process.execPath, args, { cwd: root, stdio: 'inherit', env: process.env }); child.once('error', reject); child.once('exit', done);
  });
  if (code !== 0) { console.error(`${name} failed; review is incomplete.`); process.exit(code || 1); }
}
console.log('\nPlanet checks passed. Rendered images still need visual inspection; physical iPhone/Safari validation is separate.');
