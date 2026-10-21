// Optional offline preparation. Reuse the existing CC0 scans and materials;
// distant instances need fewer triangles, not another copy of every texture.
import { readFile, writeFile } from 'node:fs/promises';
import { MeshoptSimplifier } from 'meshoptimizer/simplifier';
import { ROCK_ASSETS } from '../src/planet-blueprint.js';

await MeshoptSimplifier.ready;
const models = {};
for (const [id, file] of Object.entries(ROCK_ASSETS)) {
  const data = await readFile(new URL(`../web/models/planets/${file}`, import.meta.url)), length = data.readUInt32LE(12);
  const doc = JSON.parse(data.subarray(20, 20 + length)), bin = data.subarray(28 + length);
  if (doc.meshes.length !== 1 || doc.meshes[0].primitives.length !== 1) throw new Error(`Unexpected scan layout: ${file}`);
  const primitive = doc.meshes[0].primitives[0];
  const read = (index, width) => {
    const a = doc.accessors[index], v = doc.bufferViews[a.bufferView], size = a.componentType === 5123 ? 2 : 4;
    const start = (v.byteOffset ?? 0) + (a.byteOffset ?? 0), stride = v.byteStride ?? size * width;
    return Array.from({ length: a.count * width }, (_, i) => {
      const offset = start + Math.floor(i / width) * stride + i % width * size;
      return a.componentType === 5126 ? bin.readFloatLE(offset) : size === 2 ? bin.readUInt16LE(offset) : bin.readUInt32LE(offset);
    });
  };
  const position = Float32Array.from(read(primitive.attributes.POSITION, 3)), normal = read(primitive.attributes.NORMAL, 3), uv = read(primitive.attributes.TEXCOORD_0, 2);
  const original = Uint32Array.from(read(primitive.indices, 1));
  const attributes = new Float32Array(position.length / 3 * 5);
  for (let i = 0; i < position.length / 3; i++) attributes.set([...normal.slice(i * 3, i * 3 + 3), ...uv.slice(i * 2, i * 2 + 2)], i * 5);
  const [indices, error] = MeshoptSimplifier.simplifyWithAttributes(original, position, 3, attributes, 5, [.1, .1, .1, .5, .5], null, 420 * 3, .09, ['LockBorder']);
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  position.forEach((v, i) => { min[i % 3] = Math.min(min[i % 3], v); max[i % 3] = Math.max(max[i % 3], v); });
  const scale = 1 / Math.max(...max.map((v, i) => v - min[i]));
  const center = [(min[0] + max[0]) / 2, min[1], (min[2] + max[2]) / 2];
  const used = [...new Set(indices)], remap = new Map(used.map((index, i) => [index, i]));
  const compact = (source, width) => used.flatMap(index => source.slice(index * width, index * width + width));
  const vertices = compact(Array.from(position), 3).map((v, i) => Number(((v - center[i % 3]) * scale).toFixed(7)));
  models[id] = { source: file, triangles: indices.length / 3, relativeError: error, position: vertices, normal: compact(normal, 3).map(v => Number(v.toFixed(6))), uv: compact(uv, 2).map(v => Number(v.toFixed(6))), index: Array.from(indices, i => remap.get(i)) };
}
await writeFile(new URL('../web/models/planets/rock-lods.json', import.meta.url), JSON.stringify({ generator: 'meshoptimizer 1.3.0; normalized source scans; shared original textures', models }) + '\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(models).map(([id, m]) => [id, { triangles: m.triangles, error: m.relativeError }]))));
