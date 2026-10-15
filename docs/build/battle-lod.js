import * as THREE from 'three';

// Distant silhouettes retain the source model's shape and material groups. Close views
// always use the untouched authored geometry; clustering runs only once per asset.
export function distantGeometry(source, divisions = 24) {
  const p = source.attributes.position;
  if (p.count < 250) return source;
  source.computeBoundingBox();
  const span = source.boundingBox.getSize(new THREE.Vector3()), cell = Math.max(span.x, span.y, span.z) / divisions;
  if (!cell) return source;
  const clusters = [], keys = new Map(), remap = new Uint32Array(p.count), uv = source.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const key = `${Math.round(x / cell)}:${Math.round(y / cell)}:${Math.round(z / cell)}`;
    let index = keys.get(key);
    if (index === undefined) { index = clusters.length; keys.set(key, index); clusters.push([0, 0, 0, 0, 0, 0]); }
    const c = clusters[index]; c[0] += x; c[1] += y; c[2] += z; c[3] += uv?.getX(i) ?? 0; c[4] += uv?.getY(i) ?? 0; c[5]++; remap[i] = index;
  }
  const original = source.index?.array ?? Uint32Array.from({ length: p.count }, (_, i) => i), indices = [], seen = new Set();
  for (let i = 0; i < original.length; i += 3) {
    const a = remap[original[i]], b = remap[original[i + 1]], c = remap[original[i + 2]];
    if (a === b || b === c || a === c) continue;
    const key = [a, b, c].sort((x, y) => x - y).join(':');
    if (!seen.has(key)) { seen.add(key); indices.push(a, b, c); }
  }
  if (!indices.length || indices.length >= original.length * .85) return source;
  const result = new THREE.BufferGeometry();
  result.setAttribute('position', new THREE.Float32BufferAttribute(clusters.flatMap(c => c.slice(0, 3).map(v => v / c[5])), 3));
  if (uv) result.setAttribute('uv', new THREE.Float32BufferAttribute(clusters.flatMap(c => [c[3] / c[5], c[4] / c[5]]), 2));
  result.setIndex(indices); result.computeVertexNormals(); result.computeBoundingSphere();
  return result;
}
