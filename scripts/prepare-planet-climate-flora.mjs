// Original, spatial plant meshes prepared offline. The game loads ordinary
// GLBs and two simplified canopy levels; no runtime mesh generator is shipped.
import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { glb } from './planet-flora-writer.mjs';

const out = 'web/models/planets', color = s => new T.Color(s);
function paint(g, a, b = a) {
  if (!g.index) g.setIndex(Array.from({ length: g.attributes.position.count }, (_, i) => i));
  const p = g.attributes.position, c = [];
  for (let i = 0; i < p.count; i++) color(a).lerp(color(b), Math.max(0, Math.min(1, p.getY(i)))).multiplyScalar(.88 + .12 * Math.sin(p.getX(i) * 83 + p.getY(i) * 31 + p.getZ(i) * 61)).toArray(c, c.length);
  g.setAttribute('color', new T.Float32BufferAttribute(c, 3));
  if (!g.attributes.uv) g.setAttribute('uv', new T.Float32BufferAttribute(new Float32Array(p.count * 2), 2));
  return g;
}
function branch(points, radius, level, bark = '#665b43') {
  const curve = new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p))), radial = [7, 5, 4][level], sections = [6, 4, 2][level];
  const g = new T.TubeGeometry(curve, sections, radius, radial, false), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const t = Math.floor(i / (radial + 1)) / sections, c = curve.getPointAt(t), v = new T.Vector3().fromBufferAttribute(p, i).sub(c).multiplyScalar(1 - t * .7).add(c); p.setXYZ(i, v.x, v.y, v.z); }
  g.computeVertexNormals(); return paint(g, bark, '#8a8164');
}
// Individual convex leaves retain gaps and depth. Distant levels preserve a
// lobed three-dimensional crown rather than camera-facing cards.
function crown(x, y, z, rx, ry, rz, level, seed, tint = '#496f36') {
  if (level > 0) {
    const g = level === 1 ? new T.SphereGeometry(1, 10, 6) : new T.IcosahedronGeometry(1, 0);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const a = Math.atan2(p.getZ(i), p.getX(i)), bulge = 1 + Math.sin(a * 5 + seed) * .075; p.setXYZ(i, p.getX(i) * bulge, p.getY(i) * (1 + Math.sin(a * 3 + seed) * .07), p.getZ(i) * bulge); }
    g.scale(rx * 1.03, ry * 1.02, rz * 1.03); g.translate(x, y, z); g.computeVertexNormals();
    return paint(g, tint, '#75904c');
  }
  const parts = [], count = [24, 10, 3][level];
  for (let i = 0; i < count; i++) {
    const a = i * 2.399963 + seed, v = 1 - (i + .5) / count * 2, ring = Math.sqrt(1 - v * v);
    const g = new T.IcosahedronGeometry(1, 0);
    g.scale(rx * .36, ry * .3, rz * .3); g.rotateY(a); g.rotateZ(Math.sin(i * 13 + seed) * .3);
    g.translate(x + Math.cos(a) * ring * rx * .79, y + v * ry * .72, z + Math.sin(a) * ring * rz * .79);
    parts.push(paint(g, tint, '#75904c'));
  }
  return mergeGeometries(parts);
}
function acacia(v, l) {
  const wood = [branch([[0, 0, 0], [.035, .3, 0], [-.03, .57, .02], [0, .72, 0]], .028, l)], leaves = [];
  for (let i = 0; i < 5; i++) {
    const a = i * 2.4 + v, x = Math.cos(a) * .28, z = Math.sin(a) * .28, y = .73 + (i % 2) * .09;
    wood.push(branch([[-.01, .45, .01], [x * .5, .66, z * .5], [x, y, z]], .012, l));
    leaves.push(crown(x, y + .04, z, .27, .085, .23, l, i + v, '#66783b'));
  }
  return [mergeGeometries(wood), mergeGeometries(leaves)];
}
function tropical(v, l) {
  const wood = [branch([[0, 0, 0], [.035, .32, .01], [0, .66, 0], [.025, .87, 0]], .037, l, '#5b6150')], leaves = [];
  for (let i = 0; i < 8; i++) {
    const a = i * 2.4 + v, size = .15 + (i % 3) * .035, y = .56 + (i % 4) * .105, x = Math.cos(a) * .22, z = Math.sin(a) * .22;
    wood.push(branch([[0, y - .21, 0], [x * .6, y - .04, z * .6], [x, y, z]], .014, l));
    leaves.push(crown(x, y + .025, z, size, size * .57, size, l, i + v, '#315b3c'));
  }
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; wood.push(branch([[Math.cos(a) * .11, .01, Math.sin(a) * .11], [0, .19, 0]], .018, l)); }
  return [mergeGeometries(wood), mergeGeometries(leaves)];
}
function palm(v, l) {
  const wood = [branch([[0, 0, 0], [.06, .31, .01], [.08, .7, 0], [.025, .86, 0]], .021, l, '#867759')], leaves = [];
  const count = [11, 9, 7][l], segments = [10, 6, 4][l];
  for (let i = 0; i < count; i++) {
    const a = i / count * Math.PI * 2 + v, positions = [], indices = [];
    for (let j = 0; j <= segments; j++) {
      const t = j / segments, r = t * (.4 + (i % 3) * .025), width = Math.sin(t * Math.PI) * .045;
      const y = .86 + Math.sin(t * Math.PI) * .13 - t * t * .23;
      for (const s of [-1, 1]) positions.push(.025 + Math.cos(a) * r + Math.sin(a) * width * s, y + Math.abs(width) * .2, Math.sin(a) * r - Math.cos(a) * width * s);
      if (j < segments) { const k = j * 2; indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals(); leaves.push(paint(g, '#2d6339', '#70904a'));
    if (l === 0) for (let j = 2; j < 9; j++) for (const s of [-1, 1]) {
      const t = j / 10, r = t * .41, b = a + s * .55, x = .025 + Math.cos(a) * r, z = Math.sin(a) * r, y = .86 + Math.sin(t * Math.PI) * .13 - t * t * .23;
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute([x, y, z, x + Math.cos(b) * .1, y - .035, z + Math.sin(b) * .1, x + Math.cos(a) * .065, y + .003, z + Math.sin(a) * .065], 3)); g.setIndex([0, 1, 2]); g.computeVertexNormals(); leaves.push(paint(g, '#4a793d'));
    }
  }
  return [mergeGeometries(wood), mergeGeometries(leaves)];
}
function willow(v, l) {
  const wood = [branch([[0, 0, 0], [.01, .3, 0], [-.03, .6, .02], [0, .81, 0]], .034, l)], leaves = [];
  for (let i = 0; i < [9, 7, 5][l]; i++) {
    const a = i * 2.4 + v, x = Math.cos(a) * .26, z = Math.sin(a) * .26;
    wood.push(branch([[0, .5, 0], [x * .7, .84, z * .7], [x, .65, z], [x * 1.1, .34, z * 1.1]], .011, l));
    leaves.push(crown(x, .64, z, .11, .25, .1, l, i + v, '#587347'));
  }
  return [mergeGeometries(wood), mergeGeometries(leaves)];
}
function cactus(v, l) {
  const parts = [], radial = [14, 10, 8][l];
  const stem = (x, z, y, height, radius) => { const g = new T.CapsuleGeometry(radius, height - radius * 2, 3, radial); g.translate(x, y + height / 2, z); parts.push(paint(g, '#577662', '#8a9a67')); };
  stem(0, 0, 0, 1, .07);
  for (let i = 0; i < 2 + v; i++) {
    const a = i * 2.4 + v, x = Math.cos(a) * .19, z = Math.sin(a) * .19, y = .32 + i * .12;
    parts.push(branch([[0, y, 0], [x, y, z], [x, y + .13, z]], .038, l, '#6d8a63')); stem(x, z, y + .06, .28, .046);
  }
  return [mergeGeometries(parts)];
}
function reed(v, l) {
  const parts = [];
  for (let i = 0; i < [11, 8, 5][l]; i++) {
    const a = i * 2.4 + v, x = Math.cos(a) * .12, z = Math.sin(a) * .12, height = .6 + (i % 4) * .12;
    parts.push(branch([[x, 0, z], [x * 1.15, height, z * 1.15]], .006, l, '#7c8552'));
    const head = new T.CapsuleGeometry(.016, .11, 2, 5); head.translate(x * 1.15, height - .04, z * 1.15); parts.push(paint(head, '#725c3e'));
    for (let j = 0; j < 2; j++) { const g = new T.BufferGeometry(), y = .18 + j * .15; g.setAttribute('position', new T.Float32BufferAttribute([x, y, z, x + Math.cos(a) * .22, y + .14, z + Math.sin(a) * .22, x + .01, y + .2, z - .01], 3)); g.setIndex([0, 1, 2]); g.computeVertexNormals(); parts.push(paint(g, '#67844a')); }
  }
  return [mergeGeometries(parts)];
}
const models = {}, provenance = [];
for (const [id, grow] of Object.entries({ acacia, tropical, palm, willow, cactus, reed })) {
  const variants = [], levels = [], counts = [];
  for (let v = 0; v < 2; v++) {
    const all = [0, 1, 2].map(l => grow(v, l)), bounds = new T.Box3();
    for (const g of all[0]) { g.computeBoundingBox(); bounds.union(g.boundingBox); }
    const scale = 1 / (bounds.max.y - bounds.min.y);
    for (const parts of all) for (const g of parts) { g.translate(0, -bounds.min.y, 0); g.scale(scale, scale, scale); }
    variants.push(all[0]); counts.push(all.map(parts => parts.reduce((s, g) => s + g.index.count / 3, 0)));
    levels.push(all.slice(1).map(parts => parts.map(g => Object.fromEntries([...['position', 'normal', 'uv', 'color'].map(k => [k, Array.from(g.attributes[k].array, x => Math.round(x * 1e6) / 1e6)]), ['index', Array.from(g.index.array)]]))));
  }
  models[id] = levels;
  const materials = variants[0].map((_, i) => ({ name: i ? 'Climate foliage' : 'Plant structure', doubleSided: true, pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, 1], metallicFactor: 0, roughnessFactor: .95 } }));
  const file = `climate-${id}.glb`, bytes = glb(variants, materials, id); await writeFile(`${out}/${file}`, bytes);
  provenance.push({ id, file, author: 'ORBIT', source: 'scripts/prepare-planet-climate-flora.mjs', license: 'Original project geometry', rootedHeightMetres: 1, variants: 2, trianglesPerVariantAndLod: counts, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
  console.log(id, bytes.length, JSON.stringify(counts));
}
await writeFile(`${out}/climate-flora-lods.json`, JSON.stringify({ models }));
await writeFile(`${out}/climate-flora-provenance.json`, JSON.stringify(provenance, null, 2) + '\n');
