// Offline only. Keep the scanned surface, UVs and normals while reducing the
// number of triangles per repeated rock. No runtime decoder is needed.
import { readFile, writeFile } from 'node:fs/promises';
import { MeshoptSimplifier } from 'meshoptimizer/simplifier';
const path = process.argv[2], target = Number(process.argv[3] ?? 4000);
const foliage = process.argv.includes('--foliage');
const data = await readFile(path), jsonSize = data.readUInt32LE(12);
const doc = JSON.parse(data.subarray(20, 20 + jsonSize)), bin = data.subarray(28 + jsonSize);
const widths = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
function values(index) {
  const a = doc.accessors[index], v = doc.bufferViews[a.bufferView], bytes = a.componentType === 5123 ? 2 : 4;
  const out = a.componentType === 5126 ? new Float32Array(a.count * widths[a.type]) : new Uint32Array(a.count * widths[a.type]);
  const start = (v.byteOffset ?? 0) + (a.byteOffset ?? 0), stride = v.byteStride ?? widths[a.type] * bytes;
  for (let i = 0; i < a.count; i++) for (let c = 0; c < widths[a.type]; c++) out[i * widths[a.type] + c] = a.componentType === 5126 ? bin.readFloatLE(start + i * stride + c * bytes) : bytes === 2 ? bin.readUInt16LE(start + i * stride + c * bytes) : bin.readUInt32LE(start + i * stride + c * bytes);
  return out;
}
const chunks = [], views = [], accessors = []; let byteLength = 0;
function append(bytes, target) {
  const pad = (4 - byteLength % 4) % 4; if (pad) { chunks.push(Buffer.alloc(pad)); byteLength += pad; }
  const index = views.length; views.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, ...(target ? { target } : {}) }); chunks.push(bytes); byteLength += bytes.length; return index;
}
function accessor(array, type) {
  const components = widths[type], a = { bufferView: append(Buffer.from(array.buffer, array.byteOffset, array.byteLength), type === 'SCALAR' ? 34963 : 34962), componentType: array instanceof Float32Array ? 5126 : 5125, count: array.length / components, type };
  if (type === 'VEC3') { a.min = [Infinity, Infinity, Infinity]; a.max = [-Infinity, -Infinity, -Infinity]; for (let i = 0; i < array.length; i++) { a.min[i % 3] = Math.min(a.min[i % 3], array[i]); a.max[i % 3] = Math.max(a.max[i % 3], array[i]); } }
  accessors.push(a); return accessors.length - 1;
}
await MeshoptSimplifier.ready;
let before = 0, after = 0, error = 0;
for (const mesh of doc.meshes) for (const primitive of mesh.primitives) {
  const original = values(primitive.indices), position = values(primitive.attributes.POSITION), normal = values(primitive.attributes.NORMAL), uv = values(primitive.attributes.TEXCOORD_0);
  const attributes = new Float32Array(position.length / 3 * 5);
  for (let i = 0; i < position.length / 3; i++) attributes.set([normal[i * 3], normal[i * 3 + 1], normal[i * 3 + 2], uv[i * 2], uv[i * 2 + 1]], i * 5);
  const [indices, measured] = MeshoptSimplifier.simplifyWithAttributes(original, position, 3, attributes, 5, foliage ? [.02, .02, .02, .1, .1] : [.1, .1, .1, 1, 1], null, Math.min(target * 3, original.length), foliage ? .12 : .035, foliage ? ['Permissive', 'Prune'] : ['LockBorder']);
  const used = [...new Set(indices)], remap = new Map(used.map((old, i) => [old, i]));
  before += original.length / 3; after += indices.length / 3; error = Math.max(error, measured);
  const output = {};
  for (const [semantic, index] of Object.entries(primitive.attributes)) {
    const source = values(index), type = doc.accessors[index].type, width = widths[type], compact = new Float32Array(used.length * width);
    used.forEach((old, i) => compact.set(source.subarray(old * width, (old + 1) * width), i * width)); output[semantic] = accessor(compact, type);
  }
  primitive.attributes = output; primitive.indices = accessor(Uint32Array.from(indices, i => remap.get(i)), 'SCALAR');
}
for (const image of doc.images) { const v = doc.bufferViews[image.bufferView]; image.bufferView = append(bin.subarray(v.byteOffset ?? 0, (v.byteOffset ?? 0) + v.byteLength)); }
doc.bufferViews = views; doc.accessors = accessors; doc.asset.generator = 'ORBIT source scan; meshoptimizer 1.3.0 attribute-aware LOD';
doc.extras = { simplification: { originalTriangles: before, triangles: after, relativeError: error } };
const binPad = (4 - byteLength % 4) % 4; if (binPad) { chunks.push(Buffer.alloc(binPad)); byteLength += binPad; } doc.buffers = [{ byteLength }];
let json = Buffer.from(JSON.stringify(doc)); json = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 0x20)]);
const header = Buffer.alloc(20); header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(28 + json.length + byteLength, 8); header.writeUInt32LE(json.length, 12); header.writeUInt32LE(0x4e4f534a, 16);
const binHeader = Buffer.alloc(8); binHeader.writeUInt32LE(byteLength, 0); binHeader.writeUInt32LE(0x004e4942, 4);
await writeFile(path, Buffer.concat([header, json, binHeader, ...chunks])); console.log(JSON.stringify(doc.extras.simplification));
