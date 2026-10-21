// Offline only: rooted, complete 3D trees from EZ-Tree's botanical presets.
// Usage: node scripts/prepare-planet-woodland.mjs <ez-tree source checkout>
// Geometry generator: @dgreenheck/ez-tree 1.1.0 (MIT, Daniel Greenheck).
// Leaves: EZ-Tree (MIT); bark: ambientCG (CC0), supplied by its official demo.
import * as THREE from 'three';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
// The package eagerly creates demo textures. No DOM or GPU is needed to grow
// geometry; the actual source images are embedded explicitly below.
THREE.TextureLoader.prototype.load = function () { return new THREE.Texture(); };
const { Tree } = await import('@dgreenheck/ez-tree');
const source = resolve(process.argv[2]), root = resolve(import.meta.dirname, '..'), out = resolve(root, 'web/models/planets');
const cache = resolve(root, 'artifacts/woodland'); await mkdir(cache, { recursive: true });
const sourceCommit = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const specs = [['oak', 'Oak Medium', 'Bark001', 'oak', 1627], ['aspen', 'Aspen Medium', 'Bark007', 'aspen', 6212], ['pine', 'Pine Medium', 'Bark003', 'pine', 8153], ['shrub', 'Bush 1', 'Bark012', 'ash', 9708]];
const provenance = JSON.parse(await readFile(resolve(out, 'provenance.json'), 'utf8'));
for (const [name, preset, bark, leaf, seed] of specs) {
  const barkSource = resolve(source, `src/app/public/textures/bark/${bark}_1K-JPG/${bark}_1K-JPG_Color.jpg`);
  const leafSource = resolve(source, `src/app/public/textures/leaves/${leaf}.png`);
  const barkFile = resolve(cache, `${name}-bark.jpg`), leafFile = resolve(cache, `${name}-leaves.png`);
  execFileSync('python', ['-c', "from PIL import Image;import sys,numpy as np;i=Image.open(sys.argv[1]);i.thumbnail((512,512),Image.Resampling.LANCZOS);i.convert('RGB').save(sys.argv[2],quality=88);i=Image.open(sys.argv[3]).convert('RGBA');i.thumbnail((512,512),Image.Resampling.LANCZOS);a=np.array(i);c=a[:,:,:3].astype(float);y=c[:,:,0]*.2126+c[:,:,1]*.7152+c[:,:,2]*.0722;a[:,:,:3]=np.clip(np.stack((y*.73,y*1.12,y*.51),axis=2),0,255).astype('uint8') if sys.argv[5]=='aspen' else a[:,:,:3];Image.fromarray(a).save(sys.argv[4],optimize=True)", barkSource, barkFile, leafSource, leafFile, name]);
  const chunks = [], views = [], accessors = []; let length = 0;
  const append = (data, target) => { const padding = (-length & 3); if (padding) { chunks.push(Buffer.alloc(padding)); length += padding; } const id = views.length; views.push({ buffer: 0, byteOffset: length, byteLength: data.length, ...(target ? { target } : {}) }); chunks.push(data); length += data.length; return id; };
  const accessor = (attribute, semantic) => {
    const array = semantic === 'indices' ? Uint32Array.from(attribute.array) : Float32Array.from(attribute.array);
    if (semantic === 'uv') for (let i = 1; i < array.length; i += 2) array[i] = 1 - array[i];
    const count = attribute.count, width = attribute.itemSize, a = { bufferView: append(Buffer.from(array.buffer), semantic === 'indices' ? 34963 : 34962), componentType: semantic === 'indices' ? 5125 : 5126, count, type: ['SCALAR', 'VEC2', 'VEC3', 'VEC4'][width - 1] };
    if (semantic === 'position') { a.min = [Infinity, Infinity, Infinity]; a.max = [-Infinity, -Infinity, -Infinity]; for (let i = 0; i < count; i++) for (let c = 0; c < 3; c++) { a.min[c] = Math.min(a.min[c], array[i * 3 + c]); a.max[c] = Math.max(a.max[c], array[i * 3 + c]); } }
    accessors.push(a); return accessors.length - 1;
  };
  const doc = { asset: { version: '2.0', generator: 'ORBIT complete woodland trees; EZ-Tree 1.1.0 MIT' }, scene: 0, scenes: [{ nodes: [0, 1] }], nodes: [], meshes: [], materials: [
    { name: 'bark', pbrMetallicRoughness: { baseColorTexture: { index: 0 }, metallicFactor: 0, roughnessFactor: 1 } },
    { name: 'canopy', doubleSided: true, alphaMode: 'MASK', alphaCutoff: .36, pbrMetallicRoughness: { baseColorTexture: { index: 1 }, metallicFactor: 0, roughnessFactor: 1 } }
  ], textures: [{ source: 0, sampler: 0 }, { source: 1, sampler: 1 }], samplers: [{ wrapS: 10497, wrapT: 10497 }, { wrapS: 33071, wrapT: 33071 }], images: [{ mimeType: 'image/jpeg', bufferView: append(await readFile(barkFile)) }, { mimeType: 'image/png', bufferView: append(await readFile(leafFile)) }], accessors, bufferViews: views };
  const counts = [];
  for (let variant = 0; variant < 2; variant++) {
    const tree = new Tree(); tree.loadPreset(preset); tree.options.seed = seed + variant * 1409;
    Object.assign(tree.options.branch.sections, { 0: 7, 1: 3, 2: 2, 3: 1 });
    Object.assign(tree.options.branch.segments, { 0: 7, 1: 4, 2: 3, 3: 3 });
    if (name === 'pine') { tree.options.branch.children[0] = 42; tree.options.leaves.count = 18; tree.options.leaves.size *= 1.65; }
    else { tree.options.branch.children[0] = Math.min(5, tree.options.branch.children[0]); tree.options.branch.children[1] = Math.min(3, tree.options.branch.children[1]); tree.options.leaves.count = 10; tree.options.leaves.size *= name === 'oak' ? 1.8 : name === 'aspen' ? 1.65 : 1.5; }
    tree.generate();
    const bounds = new THREE.Box3().setFromObject(tree), height = bounds.max.y - bounds.min.y;
    const primitives = []; let triangles = 0;
    for (const [i, mesh] of [tree.branchesMesh, tree.leavesMesh].entries()) {
      const geometry = mesh.geometry.clone(); geometry.translate(0, -bounds.min.y, 0); geometry.scale(1 / height, 1 / height, 1 / height);
      triangles += geometry.index.count / 3;
      primitives.push({ attributes: { POSITION: accessor(geometry.attributes.position, 'position'), NORMAL: accessor(geometry.attributes.normal, 'normal'), TEXCOORD_0: accessor(geometry.attributes.uv, 'uv') }, indices: accessor(geometry.index, 'indices'), material: i });
    }
    if (triangles > 9000) throw Error(`${name} exceeds geometry budget: ${triangles}`);
    counts.push(triangles); doc.nodes.push({ name: `${name}-${variant}`, mesh: variant }); doc.meshes.push({ name: `${name}-${variant}`, primitives });
  }
  let bin = Buffer.concat(chunks); bin = Buffer.concat([bin, Buffer.alloc(-bin.length & 3)]); doc.buffers = [{ byteLength: bin.length }];
  let json = Buffer.from(JSON.stringify(doc)); json = Buffer.concat([json, Buffer.alloc(-json.length & 3, 32)]);
  const header = Buffer.alloc(20); header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(28 + json.length + bin.length, 8); header.writeUInt32LE(json.length, 12); header.writeUInt32LE(0x4e4f534a, 16);
  const bh = Buffer.alloc(8); bh.writeUInt32LE(bin.length, 0); bh.writeUInt32LE(0x004e4942, 4);
  const file = `woodland-${name}.glb`, data = Buffer.concat([header, json, bh, bin]); await writeFile(resolve(out, file), data);
  provenance.assets = provenance.assets.filter(a => a.file !== file); provenance.assets.push({ file, creator: 'Daniel Greenheck / EZ-Tree; ORBIT preset selection', license: 'MIT; bark textures CC0-1.0', source: 'https://github.com/dgreenheck/ez-tree', sourceCommit, barkSource: `https://ambientcg.com/view?id=${bark}`, preparationScript: 'scripts/prepare-planet-woodland.mjs', changes: 'Botanical preset geometry, two fixed seeds, reduced branch sections with retained full leaf coverage, height-normalized roots; 512 px source bark and cutout leaves embedded, summer-green aspen leaves. No runtime generator.', trianglesPerVariant: counts, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex') });
  console.log(file, data.length, counts);
}
await copyFile(resolve(source, 'LICENSE'), resolve(out, 'EZ-TREE-LICENSE.txt'));
await writeFile(resolve(out, 'provenance.json'), JSON.stringify(provenance, null, 2) + '\n');
