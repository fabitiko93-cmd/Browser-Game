import { BUILDINGS } from './data.js';
import { planetRandom, planetSubseed, regionNoise, regionGroundHeight, regionWater } from './planet-blueprint.js';

// Resource generation has its own version. Terrain, camera, flora seeds and
// existing construction identities remain stable when geology is extended.
export const RESOURCE_VERSION = 1;
export const RESOURCE_TYPES = Object.freeze({
  ore: { name: 'Erz', field: 'Erzlagerstätte', color: '#c7ad83', unit: 'Erz' },
  crystal: { name: 'Kristalle', field: 'Kristallvorkommen', color: '#b798eb', unit: 'Kristalle' },
  geothermal: { name: 'Geothermie', field: 'Wärmequelle', color: '#ed9b65', unit: 'Energie' }
});
export const PROBE_BUILDINGS = Object.freeze({
  habitat: { name: 'Habitat' },
  mine: { name: 'Erzförderer', resource: 'ore', rate: BUILDINGS.mine.output.ore, energy: BUILDINGS.mine.input.energy, workers: BUILDINGS.mine.workers, upkeep: BUILDINGS.mine.upkeep },
  crystal: { name: 'Kristallmine', resource: 'crystal', rate: BUILDINGS.crystal.output.crystal, energy: BUILDINGS.crystal.input.energy, workers: BUILDINGS.crystal.workers, upkeep: BUILDINGS.crystal.upkeep },
  geothermal: { name: 'Geothermieanlage', resource: 'geothermal', rate: BUILDINGS.geothermal.output.energy, energy: 0, workers: BUILDINGS.geothermal.workers, upkeep: BUILDINGS.geothermal.upkeep }
});
const clamp = v => Math.max(0, Math.min(1, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const backgrounds = Object.freeze({
  ice: { name: 'Eisuntergrund', ore: .012, crystal: .003, geothermal: .003 },
  rock: { name: 'Steiniger Untergrund', ore: .075, crystal: .018, geothermal: .018 },
  basalt: { name: 'Basaltgrund', ore: .09, crystal: .022, geothermal: .035 },
  sand: { name: 'Sandiger Untergrund', ore: .02, crystal: .007, geothermal: .008 },
  sediment: { name: 'Erdiger Untergrund', ore: .035, crystal: .009, geothermal: .012 }
});

export function resourceSubstrate(region, x, z) {
  if (region.climateBiome === 'ice') return 'ice';
  if (region.module === 'caldera') return 'basalt';
  if (region.module === 'regolith' || region.module === 'upland' || regionNoise(region.seed, x / 44, z / 44, 731) > .67) return 'rock';
  return region.preset === 'arid' || region.climateBiome === 'desert' || region.module === 'coast' ? 'sand' : 'sediment';
}
export const resourceBackground = (region, x, z) => backgrounds[resourceSubstrate(region, x, z)];

export function createResourceFields(region) {
  const fields = [], types = ['ore', 'ore', 'crystal', 'geothermal'];
  for (const [i, type] of types.entries()) {
    const next = planetRandom(planetSubseed(region.seed, `resource-v${RESOURCE_VERSION}/${type}/${i}`)), candidates = [];
    for (let attempt = 0; attempt < 80; attempt++) {
      const x = (next() - .5) * 98, z = (next() - .5) * 98;
      const separation = Math.min(60, ...fields.map(f => Math.hypot(f.x - x, f.z - z)));
      const geology = regionNoise(region.seed, x / (type === 'geothermal' ? 31 : 57), z / 47, 740 + i);
      candidates.push({ x, z, score: geology * .7 + Math.min(1, separation / 36) * .6 + next() * .18 });
    }
    candidates.sort((a, b) => b.score - a.score);
    const site = candidates.find(({ x, z }) => {
      const points = [-4, 0, 4].flatMap(dx => [-4, 0, 4].map(dz => { const height = regionGroundHeight(region, x + dx, z + dz); return { height, water: regionWater(region, x + dx, z + dz, height) }; }));
      return !points.some(p => p.water) && Math.max(...points.map(p => p.height)) - Math.min(...points.map(p => p.height)) <= .9;
    });
    if (!site) continue;
    const { x, z } = site, radius = 13 + next() * 8;
    const volcanic = region.module === 'caldera' ? .2 : 0, rocky = region.module === 'upland' || region.module === 'regolith' ? .12 : 0;
    const strength = (.85 + next() * .45 + (type === 'geothermal' ? volcanic : rocky)) * (type === 'geothermal' && region.preset === 'lunar' ? .28 : 1);
    fields.push({ id: `resource-${i}`, type, x, z, radius, rx: radius * (1 + next() * .35), rz: radius * (.65 + next() * .35), rotation: next() * Math.PI, phase: next() * Math.PI * 2, strength });
  }
  return fields;
}

export function resourceFieldDensity(region, field, x, z) {
  const extent = Math.max(field.rx ?? field.radius, field.rz ?? field.radius) * 1.66;
  if (Math.max(Math.abs(x - field.x), Math.abs(z - field.z)) >= extent) return 0;
  const c = Math.cos(field.rotation ?? 0), s = Math.sin(field.rotation ?? 0), dx = x - field.x, dz = z - field.z;
  const u = (dx * c + dz * s) / (field.rx ?? field.radius), v = (-dx * s + dz * c) / (field.rz ?? field.radius);
  const radius = Math.hypot(u, v), lobe = 1 + .065 * Math.sin(Math.atan2(v, u) * 3 + (field.phase ?? 0));
  // The visible seam is a dense core, surrounded by declining mineralisation.
  // The tail extends beyond the nominal outline and remains continuous there.
  return (field.strength ?? 1) * (1 - smooth(.43, 1.55, radius / lobe));
}

export function sampleResources(region, x, z, { dry = false, height } = {}) {
  const background = resourceBackground(region, x, z), density = { ore: 0, crystal: 0, geothermal: 0 };
  if (!dry && regionWater(region, x, z, height)) return { substrate: background.name, background, density, water: true };
  for (const field of region.resources ?? []) density[field.type] = Math.max(density[field.type] ?? 0, resourceFieldDensity(region, field, x, z));
  return { substrate: background.name, background, density, water: false };
}

// A fixed 2 m sampling lattice represents the footprint and its immediate
// one-cell neighbourhood. Shared access divides the same local potential,
// rather than awarding every nearby extractor the entire deposit's peak.
const accessWeight = (f, x, z) => {
  const dx = Math.max(f.minX - x, 0, x - f.maxX), dz = Math.max(f.minZ - z, 0, z - f.maxZ);
  if (Math.max(dx, dz) >= 2) return 0;
  return dx === 0 && dz === 0 ? 1 : dx > 0 && dz > 0 ? .25 : .5;
};
const pointCache = new WeakMap();
function resourceCell(region, x, z) {
  if (!pointCache.has(region)) pointCache.set(region, new Map());
  const cache = pointCache.get(region), key = `${x}/${z}`;
  if (!cache.has(key)) cache.set(key, sampleResources(region, x, z));
  return cache.get(key);
}

export function extractorProduction(region, building, buildings = []) {
  const config = PROBE_BUILDINGS[building.type]; if (!config?.resource) return null;
  const type = config.resource, f = building.footprint;
  const peers = buildings.filter(b => b !== building && (building.id == null || b.id !== building.id) && PROBE_BUILDINGS[b.type]?.resource === type);
  let weight = 0, base = 0, raw = 0, available = 0;
  for (let z = f.minZ - 1; z < f.maxZ + 2; z += 2) for (let x = f.minX - 1; x < f.maxX + 2; x += 2) {
    const own = accessWeight(f, x, z); if (!own) continue;
    const p = resourceCell(region, x, z), sharing = Math.max(1, own + peers.reduce((sum, b) => sum + accessWeight(b.footprint, x, z), 0));
    weight += own;
    if (p.water) continue;
    base += p.background[type] * own; raw += p.density[type] * own; available += p.density[type] * own / sharing;
  }
  const background = base / weight, deposit = raw / weight, allocated = available / weight, factor = background + allocated;
  return { resource: type, unit: RESOURCE_TYPES[type].unit, factor, background, deposit, competition: Math.max(0, deposit - allocated), daily: config.rate * factor, energy: config.energy, workers: config.workers, upkeep: config.upkeep, quality: deposit >= .75 ? 'Ergiebiger Kern' : deposit >= .35 ? 'Randbereich' : deposit >= .08 ? 'Angrenzendes Vorkommen' : 'Grundertrag' };
}
