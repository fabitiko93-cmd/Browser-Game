import { regionNoise } from './planet-blueprint.js';
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const bell = x => Math.exp(-x * x);

export function naturalShore(r, z) {
  const p = r.terrain;
  return p.shore + Math.sin(z / p.wavelength + p.phase) * p.bend + (regionNoise(r.seed, 0, z / 230, 208) - .5) * 22;
}
export function naturalCreek(r, z) {
  if (r.module !== 'basin' || r.preset !== 'temperate') return null;
  const p = r.terrain, curve = z => p.riverX + Math.sin(z / p.wavelength + p.phase) * p.bend + Math.sin(z / 77 + p.phase * 2) * 5;
  return { x: curve(z), width: p.riverWidth * (1 + Math.sin(z / 137 + p.phase) * .12), depth: 2.6, level: p.waterLevel + z * .0013, tangent: (curve(z + 1) - curve(z - 1)) / 2 };
}
export function naturalLakes(r) { return r.terrain?.lakes ?? []; }

export function naturalHeight(r, x, z) {
  const p = r.terrain, n = (s, c) => regionNoise(r.seed, x / s, z / s, c) - .5;
  const d = Math.hypot(x, z), outer = smooth(65, 160, d);
  const broad = n(p.wavelength * 1.9, 201), rolling = n(95, 202), detail = n(24, 203);
  // The selected site is a naturally gentle terrace. Relief grows continuously
  // away from it; no per-seed post-fix or flattened circular platform is added.
  const frost = r.climateBiome === 'ice' ? outer * Math.pow(1 - Math.abs(n(62, 215) * 2), 3) * 7 * p.relief : 0;
  const floor = p.level + x * p.gradeX + z * p.gradeZ + broad * (1.4 + outer * 5) + rolling * (.25 + outer * 2) + detail * (.045 + outer * .25) + frost;
  if (r.module === 'coast') {
    const s = x - naturalShore(r, z), wet = smooth(-28, 26, s), inland = smooth(85, 360, s);
    return -4 + wet * 10 + smooth(25, 90, s) * 1.5 + (rolling * 1.2 + detail * .1) * wet + inland * (12 + broad * p.relief * 42);
  }
  if (r.module === 'basin') {
    const c = naturalCreek(r, z), river = Math.abs(x - c.x) / Math.sqrt(1 + c.tangent ** 2);
    const banks = smooth(c.width * .9, c.width + 12, river);
    const bottom = c.level - c.depth + smooth(0, c.width * .75, river) * c.depth * .24;
    const ridges = smooth(120, 380, Math.abs(x + 25)) * (25 + broad * 20 + rolling * 9) * p.relief;
    return bottom * (1 - banks) + (floor + ridges + smooth(160, 420, -z) * p.relief * 25) * banks;
  }
  if (r.module === 'upland') {
    const ribs = Math.pow(1 - Math.abs(n(75, 214) * 2), 2);
    const ridge = bell((z + p.ridgeZ + Math.sin(x / 170 + p.phase) * 40) / 145) * (75 + p.relief * 65 + rolling * 35) * (.9 + ribs * .15);
    return floor + outer * (ridge + smooth(125, 380, x) * p.relief * 55 + Math.pow(Math.abs(n(70, 207)) * 2, 2) * 28);
  }
  if (r.module === 'caldera') {
    const radius = Math.hypot(x + 90, z + 85), ring = bell((radius - p.ringRadius - broad * 25) / 58);
    const breach = .4 + .6 * smooth(-120, 150, -z + x * .4);
    let y = floor + outer * (ring * p.relief * 75 * breach + Math.max(0, n(40, 211)) * 14);
    for (const l of naturalLakes(r)) { const d = Math.hypot((x - l.x) / l.rx, (z - l.z) / l.rz), bowl = 1 - smooth(.65, 1.2, d); y = y * (1 - bowl) + (l.level - 3.5 + d * .4) * bowl; }
    return y;
  }
  let y = floor;
  if (r.module === 'plain') {
    const dunes = r.climateBiome === 'desert' ? Math.pow(.5 + .5 * Math.sin(x / 21 + z / 73 + broad * 8), 3) * 9 : 0;
    y += outer * (rolling * p.relief * 9 + dunes + smooth(280, 700, -z) * p.relief * 22);
  }
  if (r.module === 'lake') {
    y += outer * (broad * 14 + rolling * 3 + smooth(250, 600, -z) * p.relief * 25);
    for (const l of naturalLakes(r)) {
      const radius = Math.hypot((x - l.x) / l.rx, (z - l.z) / l.rz) + (regionNoise(r.seed, x / 45, z / 45, 216) - .5) * .1;
      const ripple = Math.sin(Math.atan2(z - l.z, x - l.x) * 5 + p.phase) * .045;
      const bowl = 1 - smooth(.72, 1.18, radius + ripple);
      y = y * (1 - bowl) + (l.level - 3.5 + radius * .4) * bowl;
    }
  }
  return y;
}
