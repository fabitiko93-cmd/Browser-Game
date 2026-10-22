// ORBIT-authored complete 3D flora. Offline preparation; no runtime generator,
// external pack, textures, billboards or decoder. Run with Node from the repo.
import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const out = 'web/models/planets'; await mkdir(out, { recursive: true });
const rgb = hex => new T.Color(hex), clamp = n => Math.max(0, Math.min(1, n));
function painted(g, paint) {
  const p = g.attributes.position, values = [];
  for (let i = 0; i < p.count; i++) paint(p.getX(i), p.getY(i), p.getZ(i)).toArray(values, values.length);
  g.setAttribute('color', new T.Float32BufferAttribute(values, 3));
  if (!g.attributes.uv) g.setAttribute('uv', new T.Float32BufferAttribute(new Float32Array(p.count * 2), 2));
  return g;
}
const solid = (g, color) => painted(g, () => rgb(color));
function tube(points, radius, level, from, to) {
  const curve = new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p)));
  const sections = [5, 3, 2][level], radial = [5, 4, 3][level], g = new T.TubeGeometry(curve, sections, radius, radial, false), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const t = Math.floor(i / (radial + 1)) / sections, center = curve.getPointAt(t);
    const v = new T.Vector3(p.getX(i), p.getY(i), p.getZ(i)).sub(center).multiplyScalar(1 - t * .62).add(center); p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return painted(g, (x, y, z) => rgb(from).lerp(rgb(to), clamp(y)));
}
function ball(x, y, z, radius, scale, level, color) {
  const g = radius < .02 ? new T.IcosahedronGeometry(radius, 0) : new T.SphereGeometry(radius, [10, 8, 6][level], [6, 5, 4][level]);
  if (!g.index) g.setIndex(Array.from({ length: g.attributes.position.count }, (_, i) => i));
  g.scale(...scale);g.translate(x, y, z);
  return solid(g, color);
}
function cap(cx, y, cz, radius, rise, level, phase) {
  const profile = [new T.Vector2(0, y - rise * .22)], rings = [7, 5, 3][level];
  for (let i = 1; i <= rings; i++) { const u = i / rings; profile.push(new T.Vector2(radius * u, y - rise * .22 * (1 - u))); }
  for (let i = 1; i <= rings; i++) { const u = 1 - i / rings; profile.push(new T.Vector2(radius * u, y + rise * Math.pow(1 - u * u, .7))); }
  const g = new T.LatheGeometry(profile, [32, 20, 12][level]), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), u = Math.hypot(x, z) / radius, a = Math.atan2(z, x);
    const scallop = 1 + .035 * Math.sin(a * 9 + phase) * u ** 3;
    p.setXYZ(i, x * scallop, p.getY(i) + .009 * Math.sin(a * 7 + phase) * u ** 3, z * scallop);
  }
  g.computeVertexNormals();
  painted(g, (x, py, z) => {
    const u = Math.hypot(x, z) / radius, a = Math.atan2(z, x);
    if (py < y + .008) return rgb('#a1b5b7').lerp(rgb('#508f9a'), (.5 + Math.sin(a * 24 + u * 7) * .5) * .55);
    const spores = Math.pow(Math.max(0, Math.sin(x * 79 + phase) * Math.sin(z * 67 - phase)), 10) * .65;
    return rgb('#82648e').lerp(rgb('#b9c7cc'), clamp(u ** 5 * .65)).lerp(rgb('#7bbfca'), spores);
  });g.translate(cx, 0, cz);return g;
}
function spore(variant, level) {
  const stems = [], crowns = [], bend = variant ? -.085 : .07;
  stems.push(tube([[0, .02, 0], [bend * .3, .27, .01], [bend, .55, -.015], [bend, .78, 0]], .043, level, '#515b6b', '#9bb4b1'));
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2;
    stems.push(tube([[Math.cos(a) * .15, .012, Math.sin(a) * .15], [Math.cos(a) * .075, .04, Math.sin(a) * .075], [0, .15, 0]], .013, level, '#4d6070', '#89a5ad'));
  }
  crowns.push(cap(bend, .79, 0, variant ? .29 : .36, .2, level, variant * 2));
  const sign = variant ? 1 : -1, x = bend + sign * .17;
  stems.push(tube([[bend * .5, .33, 0], [x * .7, .45, .03], [x, .59, .04]], .019, level, '#596273', '#9bb6b5'));
  crowns.push(cap(x, .59, .04, variant ? .24 : .15, .12, level, 3));
  if (variant) {
    stems.push(tube([[bend, .52, 0], [bend - .15, .63, -.1], [bend - .18, .7, -.1]], .018, level, '#596273', '#9bb6b5'));
    crowns.push(cap(bend - .18, .71, -.1, .16, .1, level, 5));
  }
  return [mergeGeometries(stems), mergeGeometries(crowns)];
}
function coral(variant, level) {
  const branches = [], tips = [], fingers = [9, 7, 5][level];
  branches.push(tube([[0, .012, 0], [.02, .12, -.01], [0, .3, 0]], .039, level, '#644954', '#b97962'));
  for (let fan = 0; fan < 2; fan++) {
    const rotation = (fan ? 1.1 : -.3) + variant * .32;
    const turn = ([x, y, z]) => [x * Math.cos(rotation) + z * Math.sin(rotation), y, -x * Math.sin(rotation) + z * Math.cos(rotation)];
    // Fleshy, scalloped fan tissue is a closed shell on both faces. The ribs
    // remain raised above it; distant silhouettes retain their broad crown.
    const columns = [18, 12, 8][level], rows = [5, 3, 2][level], positions = [], indices = [];
    for (let side = 0; side < 2; side++) for (let row = 0; row <= rows; row++) for (let col = 0; col <= columns; col++) {
      const t = col / columns * 2 - 1, scallop = .91 + .035 * Math.cos(t * Math.PI * 8), r = .2 + row / rows * (scallop - .2);
      const x = t * (variant ? .43 : .37) * r, y = .22 + (.94 - Math.abs(t) ** 1.5 * .24 - .22) * r;
      const z = Math.sin(t * 3 + variant) * .035 * r + (side ? -.006 : .006) + .009 * Math.sin(t * Math.PI * 8) * r;
      positions.push(...turn([x, y, z]));
      if (row < rows && col < columns) {
        const a = side * (rows + 1) * (columns + 1) + row * (columns + 1) + col, b = a + columns + 1;
        indices.push(...(side ? [a, b, a + 1, a + 1, b, b + 1] : [a, a + 1, b, a + 1, b + 1, b]));
      }
    }
    const face = (rows + 1) * (columns + 1);
    const stitch = (a, b) => indices.push(a, a + face, b, b, a + face, b + face);
    for (let col = 0; col < columns; col++) { stitch(col, col + 1);stitch(rows * (columns + 1) + col, rows * (columns + 1) + col + 1); }
    for (let row = 0; row < rows; row++) { stitch(row * (columns + 1), (row + 1) * (columns + 1));stitch(row * (columns + 1) + columns, (row + 1) * (columns + 1) + columns); }
    const web = new T.BufferGeometry();web.setAttribute('position', new T.Float32BufferAttribute(positions, 3));web.setIndex(indices);web.computeVertexNormals();
    branches.push(painted(web, (x, y, z) => rgb('#784f70').lerp(rgb(variant ? '#dca386' : '#c18775'), clamp((y - .3) * 1.5)).multiplyScalar(.88 + .12 * Math.cos(x * 95 + z * 55))));
    for (let i = 0; i < fingers; i++) {
      const t = i / (fingers - 1) * 2 - 1, x = t * (variant ? .43 : .37), y = .94 - Math.abs(t) ** 1.5 * .24, z = Math.sin(t * 3 + variant) * .035;
      const start = [0, .22 + fan * .08, 0], middle = [x * .45, .55, z * .5], end = [x, y, z];
      branches.push(tube([start, middle, end].map(turn), .019, level, '#965c59', '#e0ad7e'));
      tips.push(ball(...turn(end), .013, [1, 1.4, 1], level, '#85b7c6'));
      for (let j = 0; j < [3, 2, 1][level]; j++) {
        const f = .45 + j * .13, a = [x * f * .7, .23 + (y - .23) * f, z * f];
        const b = [a[0] + (t < 0 ? -1 : 1) * (.065 + j * .009), a[1] + .095, a[2] + (j % 2 ? -.022 : .022)];
        branches.push(tube([a, [(a[0] + b[0]) * .5, b[1] - .025, b[2]], b].map(turn), .006, level, '#af776e', '#e0ad7e'));
        if (level < 2) tips.push(ball(...turn(b), .009, [1, 1.4, 1], level, '#8bbfca'));
      }
    }
  }
  return [mergeGeometries(branches), mergeGeometries(tips)];
}
function pod(variant, level) {
  const stems = [], blooms = [];
  for (let i = 0; i < 3 + variant; i++) {
    const a = i * 2.399, x = Math.cos(a) * .19, z = Math.sin(a) * .19, y = .58 + (i % 3) * .14;
    stems.push(tube([[x * .3, .01, z * .3], [x, y * .4, z], [x * 1.15, y, z]], .018, level, '#3c5265', '#7e9fbb'));
    blooms.push(ball(x * 1.15, y, z, .11, [.8, 1.55, .85], level, i % 2 ? '#87b9bd' : '#b096b7'));
  }
  return [mergeGeometries(stems), mergeGeometries(blooms)];
}
function cup(variant, level) {
  const shells = [], hearts = [];
  for (let i = 0; i < 4; i++) {
    const a = i * 2.399 + variant, x = Math.cos(a) * .23, z = Math.sin(a) * .23, y = .45 + (i % 2) * .21;
    const profile = [[.01, .01], [.045, y * .3], [.06, y * .6], [.15, y * .9], [.18, y], [.16, y * .92], [.09, y * .68], [.035, y * .6]].map(p => new T.Vector2(...p));
    const g = new T.LatheGeometry(profile, [10, 8, 6][level]);g.translate(x, 0, z);
    painted(g, (px, py, pz) => rgb('#6c536e').lerp(rgb('#c59fae'), clamp(py / y) ** 2));shells.push(g);
    hearts.push(ball(x, y * .73, z, .055, [1, .6, 1], level, '#87b6c4'));
  }
  return [mergeGeometries(shells), mergeGeometries(hearts)];
}

function glb(variants, materials, name) {
  const chunks = [], views = [], accessors = []; let length = 0;
  const append = (array, target) => { const data = Buffer.from(array.buffer, array.byteOffset, array.byteLength), pad = -length & 3; if (pad) { chunks.push(Buffer.alloc(pad)); length += pad; } const id = views.length; views.push({ buffer: 0, byteOffset: length, byteLength: data.length, target });chunks.push(data);length += data.length;return id; };
  const attribute = (attr, index = false) => {
    const array = index ? Uint32Array.from(attr.array) : Float32Array.from(attr.array), a = { bufferView: append(array, index ? 34963 : 34962), componentType: index ? 5125 : 5126, count: attr.count, type: ['SCALAR', 'VEC2', 'VEC3', 'VEC4'][attr.itemSize - 1] };
    if (attr.itemSize === 3) { a.min = [Infinity, Infinity, Infinity];a.max = [-Infinity, -Infinity, -Infinity];for (let i = 0; i < attr.count; i++) for (let c = 0; c < 3; c++) { a.min[c] = Math.min(a.min[c], array[i * 3 + c]);a.max[c] = Math.max(a.max[c], array[i * 3 + c]); } }
    accessors.push(a);return accessors.length - 1;
  };
  const meshes = variants.map(parts => ({ primitives: parts.map((g, material) => ({ attributes: { POSITION: attribute(g.attributes.position), NORMAL: attribute(g.attributes.normal), TEXCOORD_0: attribute(g.attributes.uv), COLOR_0: attribute(g.attributes.color) }, indices: attribute(g.index, true), material })) }));
  const doc = { asset: { version: '2.0', generator: 'ORBIT original alien flora; Three.js 0.180.0 geometry tools' }, scene: 0, scenes: [{ nodes: [0, 1] }], nodes: variants.map((_, i) => ({ name: `${name}-${i}`, mesh: i })), meshes, materials, accessors, bufferViews: views, buffers: [{ byteLength: length + (-length & 3) }] };
  let bin = Buffer.concat(chunks);bin = Buffer.concat([bin, Buffer.alloc(-bin.length & 3)]);
  let json = Buffer.from(JSON.stringify(doc));json = Buffer.concat([json, Buffer.alloc(-json.length & 3, 32)]);
  const header = Buffer.alloc(20);header.writeUInt32LE(0x46546c67, 0);header.writeUInt32LE(2, 4);header.writeUInt32LE(28 + json.length + bin.length, 8);header.writeUInt32LE(json.length, 12);header.writeUInt32LE(0x4e4f534a, 16);
  const bh = Buffer.alloc(8);bh.writeUInt32LE(bin.length, 0);bh.writeUInt32LE(0x004e4942, 4);return Buffer.concat([header, json, bh, bin]);
}
const material = (name, emission = [0, 0, 0]) => ({ name, doubleSided: true, pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, 1], metallicFactor: 0, roughnessFactor: .83 }, emissiveFactor: emission });
const models = {}, provenance = [];
for (const [id, grow, canopy, materials] of [
  ['spore', spore, true, [material('Fibrous stalk'), material('Spore crown and gills', [.008, .025, .028])]],
  ['coral', coral, true, [material('Branching coral'), material('Living polyps', [.01, .03, .038])]],
  ['pod', pod, false, [material('Pod stems'), material('Spore buds', [.025, .07, .085])]],
  ['cup', cup, false, [material('Cup colony'), material('Cup hearts', [.025, .065, .08])]]
]) {
  const variants = [], levels = [], counts = [];
  for (let variant = 0; variant < 2; variant++) {
    const parts = grow(variant, 0), lods = canopy ? [grow(variant, 1), grow(variant, 2)] : [];
    const bounds = new T.Box3();for (const g of parts) { g.computeBoundingBox();bounds.union(g.boundingBox); }
    const scale = 1 / (bounds.max.y - bounds.min.y);
    for (const group of [parts, ...lods]) for (const g of group) { g.translate(0, -bounds.min.y, 0);g.scale(scale, scale, scale); }
    variants.push(parts);counts.push([parts, ...lods].map(group => group.reduce((n, g) => n + g.index.count / 3, 0)));
    levels.push(lods.map(group => group.map(g => Object.fromEntries([...['position', 'normal', 'uv', 'color'].map(k => [k, Array.from(g.attributes[k].array, v => Math.round(v * 1e6) / 1e6)]), ['index', Array.from(g.index.array)]]))));
  }
  if (canopy) models['xeno-' + id] = levels;
  const file = `alien-${id}.glb`, bytes = glb(variants, materials, id); await writeFile(`${out}/${file}`, bytes);
  provenance.push({ file, author: 'ORBIT', source: 'scripts/prepare-planet-alien-flora.mjs', rights: 'Original project-authored geometry; no external asset pack or texture. Three.js geometry preparation tools are MIT licensed.', variants: 2, rootedHeightMetres: 1, trianglesPerVariantAndLod: counts, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
  console.log(file, bytes.length, counts);
}
await writeFile(`${out}/alien-flora-lods.json`, JSON.stringify({ models }));
await writeFile(`${out}/alien-flora-provenance.json`, JSON.stringify(provenance, null, 2) + '\n');
