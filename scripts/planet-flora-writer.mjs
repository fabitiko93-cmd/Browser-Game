// Shared GLB writer for offline project-authored geometry.
export function glb(variants, materials, name) {
  const chunks = [], views = [], accessors = []; let length = 0;
  const append = (array, target) => { const data = Buffer.from(array.buffer, array.byteOffset, array.byteLength), pad = -length & 3; if (pad) { chunks.push(Buffer.alloc(pad)); length += pad; } const id = views.length; views.push({ buffer: 0, byteOffset: length, byteLength: data.length, target });chunks.push(data);length += data.length;return id; };
  const attribute = (attr, index = false) => {
    const array = index ? Uint32Array.from(attr.array) : Float32Array.from(attr.array), a = { bufferView: append(array, index ? 34963 : 34962), componentType: index ? 5125 : 5126, count: attr.count, type: ['SCALAR', 'VEC2', 'VEC3', 'VEC4'][attr.itemSize - 1] };
    if (attr.itemSize === 3) { a.min = [Infinity, Infinity, Infinity];a.max = [-Infinity, -Infinity, -Infinity];for (let i = 0; i < attr.count; i++) for (let c = 0; c < 3; c++) { a.min[c] = Math.min(a.min[c], array[i * 3 + c]);a.max[c] = Math.max(a.max[c], array[i * 3 + c]); } }
    accessors.push(a);return accessors.length - 1;
  };
  const meshes = variants.map(parts => ({ primitives: parts.map((g, material) => ({ attributes: { POSITION: attribute(g.attributes.position), NORMAL: attribute(g.attributes.normal), TEXCOORD_0: attribute(g.attributes.uv), COLOR_0: attribute(g.attributes.color) }, indices: attribute(g.index, true), material })) }));
  const doc = { asset: { version: '2.0', generator: 'ORBIT original project flora; Three.js 0.180.0 geometry tools' }, scene: 0, scenes: [{ nodes: [0, 1] }], nodes: variants.map((_, i) => ({ name: `${name}-${i}`, mesh: i })), meshes, materials, accessors, bufferViews: views, buffers: [{ byteLength: length + (-length & 3) }] };
  let bin = Buffer.concat(chunks);bin = Buffer.concat([bin, Buffer.alloc(-bin.length & 3)]);
  let json = Buffer.from(JSON.stringify(doc));json = Buffer.concat([json, Buffer.alloc(-json.length & 3, 32)]);
  const header = Buffer.alloc(20);header.writeUInt32LE(0x46546c67, 0);header.writeUInt32LE(2, 4);header.writeUInt32LE(28 + json.length + bin.length, 8);header.writeUInt32LE(json.length, 12);header.writeUInt32LE(0x4e4f534a, 16);
  const bh = Buffer.alloc(8);bh.writeUInt32LE(bin.length, 0);bh.writeUInt32LE(0x004e4942, 4);return Buffer.concat([header, json, bh, bin]);
}
