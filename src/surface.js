import { GRID } from './data.js';
import { PLANET_FACTORS } from './development-data.js';

// Geology is derived from the saved planet seed, never from a simulation tick.
const surfaces = new Map();
export const surfaceKind = planet => planet.kind === 'Eiswelt' ? 'ice' : planet.kind === 'Vulkanisch' ? 'volcanic' : 'rock';
export const surfaceName = planet => ({ ice: 'Eisplateau', volcanic: 'Vulkanisches Hochland', rock: planet.kind === 'Ozeanisch' ? 'Küstenplateau' : planet.kind === 'Kristallwelt' ? 'Kristallines Felsplateau' : 'Felsplateau' })[surfaceKind(planet)];
export function surfaceRandom(seed, x, y, salt = 0) {
  let n = Math.imul(seed ^ salt, 374761393) + Math.imul(x, 668265263) + Math.imul(y, 1442695041);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}
export function surfaceNoise(seed, x, y, salt = 0) {
  const ix = Math.floor(x), iy = Math.floor(y), sx = x - ix, sy = y - iy;
  const fx = sx * sx * (3 - 2 * sx), fy = sy * sy * (3 - 2 * sy);
  const a = surfaceRandom(seed, ix, iy, salt), b = surfaceRandom(seed, ix + 1, iy, salt);
  const c = surfaceRandom(seed, ix, iy + 1, salt), d = surfaceRandom(seed, ix + 1, iy + 1, salt);
  return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
}
export function terrainClassAt(planet, x, y) {
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= GRID.width || y >= GRID.height) return 'void';
  // Keep the old coast/escarpment footprint: every existing buildable tile stays buildable.
  if ((x < 2 && y > 7) || (x > 9 && y < 4)) return planet.kind === 'Ozeanisch' ? 'water' : 'cliff';
  // Restore the original visual tile distribution; deposits and yields stay independent.
  const n = ((x * 37 + y * 53 + planet.seed * 17) % 101) / 101;
  return n < .1 ? 'rock' : n < .32 ? 'rough' : 'ground';
}
export function planetSurface(planet) {
  const key = `${planet.seed}:${planet.kind}`;
  if (surfaces.has(key)) return surfaces.get(key);
  const kind = surfaceKind(planet), tiles = [], candidates = [];
  for (let y = 0; y < GRID.height; y++) for (let x = 0; x < GRID.width; x++) {
    const terrain = terrainClassAt(planet, x, y);
    const tile = { x, y, terrain, height: surfaceNoise(planet.seed, x / 2.8, y / 2.8, 19), ore: 0, vent: false };
    tiles.push(tile);
    // The original colony landing area keeps its neutral yields.
    if (!['water', 'cliff'].includes(terrain) && !(x >= 3 && x <= 8 && y >= 5 && y <= 8)) candidates.push(tile);
  }
  candidates.sort((a, b) => surfaceRandom(planet.seed, a.x, a.y, 91) - surfaceRandom(planet.seed, b.x, b.y, 91));
  const deposits = [];
  for (const tile of candidates) {
    if (deposits.some(d => Math.hypot(d.x - tile.x, d.y - tile.y) < 3)) continue;
    deposits.push({ x: tile.x, y: tile.y, radius: 1.45 + surfaceRandom(planet.seed, tile.x, tile.y, 34) * .35 });
    if (deposits.length === 3) break;
  }
  for (const tile of candidates) for (const d of deposits) {
    const distance = Math.hypot(tile.x - d.x, tile.y - d.y);
    if (distance <= d.radius) tile.ore = Math.max(tile.ore, distance === 0 ? .35 : .2);
  }
  const vents = [];
  for (const tile of [...candidates].sort((a, b) => surfaceRandom(planet.seed, a.x, a.y, 203) - surfaceRandom(planet.seed, b.x, b.y, 203))) {
    if (tile.ore || vents.some(v => Math.hypot(v.x - tile.x, v.y - tile.y) < 3)) continue;
    tile.vent = true; vents.push({ x: tile.x, y: tile.y });
    if (vents.length === (kind === 'volcanic' ? 4 : 2)) break;
  }
  const surface = Object.freeze({ kind, deposits: Object.freeze(deposits.map(Object.freeze)), vents: Object.freeze(vents.map(Object.freeze)), tiles: Object.freeze(tiles.map(Object.freeze)) });
  if (surfaces.size >= 64) surfaces.delete(surfaces.keys().next().value);
  surfaces.set(key, surface);
  return surface;
}
export function surfaceTile(planet, x, y) {
  return terrainClassAt(planet, x, y) === 'void' ? null : planetSurface(planet).tiles[y * GRID.width + x];
}
export function placementIssue(planet, x, y) {
  const terrain = terrainClassAt(planet, x, y);
  if (terrain === 'void') return 'Wähle eine Baufläche.';
  if (terrain === 'water') return 'Offenes Wasser · nicht bebaubar.';
  if (terrain === 'cliff') return 'Steilhang · nicht bebaubar.';
  if (planet.buildings.some(b => b.x === x && b.y === y)) return 'Diese Fläche ist bereits bebaut.';
  return null;
}
export function siteBonus(planet, type, x, y) {
  const tile = surfaceTile(planet, x, y);
  if (['mine', 'deepMine'].includes(type) && tile?.ore) return { resource: 'ore', factor: 1 + tile.ore, label: 'Erzader' };
  if (type === 'geothermal' && tile?.vent) return { resource: 'energy', factor: 1.4, label: 'Wärmequelle' };
  return null;
}
export function geologicalFactor(planet, building, resource) {
  let factor = resource === 'ore' ? planet.oreFactor : resource === 'energy' && building.type === 'solar' ? planet.solarFactor : 1;
  if (building.type === 'farm') factor *= PLANET_FACTORS[planet.kind]?.food ?? 1;
  if (resource === 'crystal') factor *= PLANET_FACTORS[planet.kind]?.crystal ?? 1;
  if (building.type === 'fuelExtractor') factor *= PLANET_FACTORS[planet.kind]?.fuel ?? 1;
  if (building.type === 'geothermal') factor *= PLANET_FACTORS[planet.kind]?.geothermal ?? 1;
  const bonus = siteBonus(planet, building.type, building.x, building.y);
  return factor * (bonus?.resource === resource ? bonus.factor : 1);
}
export function constructionPhase(building, totalDays) {
  if (building.remaining <= 0) return 'complete';
  const progress = 1 - building.remaining / totalDays;
  return progress < .34 ? 'foundation' : progress < .72 ? 'frame' : 'finishing';
}

// A visual utility/drone network. Links never reserve tiles or move goods.
export function surfaceConnections(buildings) {
  const ready = buildings.filter(b => b.remaining <= 0).slice().sort((a, b) => a.y - b.y || a.x - b.x);
  if (ready.length < 2) return [];
  const connected = [ready.shift()], links = [];
  while (ready.length) {
    let best = null;
    for (const a of connected) for (let i = 0; i < ready.length; i++) {
      const b = ready[i], distance = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
      if (!best || distance < best.distance) best = { a, b, i, distance };
    }
    links.push({ from: { x: best.a.x, y: best.a.y }, to: { x: best.b.x, y: best.b.y } });
    connected.push(ready.splice(best.i, 1)[0]);
  }
  return links;
}
