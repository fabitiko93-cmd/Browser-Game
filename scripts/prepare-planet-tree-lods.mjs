// Reduce the existing MIT EZ-Tree meshes, retaining their 3D leaf cards, UVs,
// roots and material assignments. No whole-tree billboards or extra textures.
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { MeshoptSimplifier } from 'meshoptimizer';
await MeshoptSimplifier.ready;
const models = {};
for (const id of ['oak', 'aspen', 'pine']) {
  const bytes = await readFile(`web/models/planets/woodland-${id}.glb`);
  const length = bytes.readUInt32LE(12), doc = JSON.parse(bytes.subarray(20, 20 + length)), bin = bytes.subarray(28 + length);
  const array = a => {
    const acc = doc.accessors[a], view = doc.bufferViews[acc.bufferView], width = { SCALAR: 1, VEC2: 2, VEC3: 3 }[acc.type];
    const offset = (view.byteOffset ?? 0) + (acc.byteOffset ?? 0), count = acc.count * width;
    const get = acc.componentType === 5126 ? 'readFloatLE' : acc.componentType === 5125 ? 'readUInt32LE' : 'readUInt16LE';
    const stride = acc.componentType === 5123 ? 2 : 4;
    return Array.from({ length: count }, (_, i) => bin[get](offset + i * stride));
  };
  models[id] = doc.meshes.map(mesh => [0, 1].map(level => mesh.primitives.map((p, part) => {
    const position = array(p.attributes.POSITION), normal = array(p.attributes.NORMAL), uv = array(p.attributes.TEXCOORD_0), index = array(p.indices);
    let selected, scaled = position.slice();
    if (part === 0) {
      [selected] = MeshoptSimplifier.simplify(new Uint32Array(index), new Float32Array(position), 3, (level ? 170 : 500) * 3, level ? .035 : .014, ['Prune']);
    } else {
      // Each leaf consists of four vertices and two triangles. Stratified
      // spatial selection retains all canopy layers and their real orientations.
      const leaves = position.length / 12, centers = new Float32Array(leaves * 3);
      for (let q = 0; q < leaves; q++) for (let axis = 0; axis < 3; axis++) centers[q * 3 + axis] = [0,1,2,3].reduce((s, k) => s + position[q * 12 + k * 3 + axis], 0) / 4;
      const keep = MeshoptSimplifier.simplifyPoints(centers, 3, Math.min(leaves, level ? 200 : 480));
      selected = []; const growth = Math.min(level ? 2.3 : 1.5, Math.sqrt(leaves / keep.length));
      for (const leaf of keep) {
        for (let k = 0; k < 4; k++) for (let axis = 0; axis < 3; axis++) scaled[leaf * 12 + k * 3 + axis] = centers[leaf * 3 + axis] + (position[leaf * 12 + k * 3 + axis] - centers[leaf * 3 + axis]) * growth;
        selected.push(...index.slice(leaf * 6, leaf * 6 + 6));
      }
    }
    // Compact only used vertices; normals and UVs follow the original indices.
    const remap = new Map(), output = { position: [], normal: [], uv: [], index: [] };
    for (const old of selected) {
      if (!remap.has(old)) {
        remap.set(old, remap.size);
        output.position.push(...scaled.slice(old * 3, old * 3 + 3).map(v => +v.toFixed(6)));
        output.normal.push(...normal.slice(old * 3, old * 3 + 3).map(v => +v.toFixed(5)));
        output.uv.push(...uv.slice(old * 2, old * 2 + 2).map(v => +v.toFixed(5)));
      }
      output.index.push(remap.get(old));
    }
    return output;
  })));
  console.log(id, models[id][0].map(l => l.reduce((n,p) => n + p.index.length / 3,0)), 'triangles');
}
await writeFile('web/models/planets/tree-lods.json', JSON.stringify({ source: 'woodland-*.glb; EZ-Tree MIT; scripts/prepare-planet-tree-lods.mjs', models }));

const file='tree-lods.json',provenance=JSON.parse(await readFile('web/models/planets/provenance.json','utf8')),bytes=await readFile(`web/models/planets/${file}`);
provenance.assets=provenance.assets.filter(a=>a.file!==file);
provenance.assets.push({file,creator:'Daniel Greenheck / EZ-Tree; ORBIT LOD preparation',license:'MIT; original bark textures CC0-1.0',source:'https://github.com/dgreenheck/ez-tree',preparationScript:'scripts/prepare-planet-tree-lods.mjs',changes:'Three-dimensional leaf-card selection in the existing spatial canopy, coverage-preserving card scaling, meshoptimizer branch reduction; original UVs, normals, roots and shared source textures retained. No whole-tree billboard.',trianglesPerVariant:Object.fromEntries(Object.entries(models).map(([id,variants])=>[id,variants.map(levels=>levels.map(parts=>parts.reduce((n,p)=>n+p.index.length/3,0)))])),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
await writeFile('web/models/planets/provenance.json',JSON.stringify(provenance,null,2)+'\n');
await copyFile('node_modules/fflate/LICENSE','web/models/planets/FFLATE-LICENSE.txt');
