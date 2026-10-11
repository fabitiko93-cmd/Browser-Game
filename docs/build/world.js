import { SYSTEMS, PLANET_SEEDS, FACTIONS, RESOURCE_KEYS } from './data.js';

export const systemsOf = state => state.world?.systems ?? SYSTEMS;
export const locationsOf = state => [...state.planets, ...(state.world?.anchors ?? [])];
export const systemTarget = (state, id) => state.planets.find(p => p.system === id) ?? state.world?.anchors.find(p => p.system === id);
export const homePlanet = (state, owner = 'player') => state.planets.find(p => p.owner === owner && !p.destroyed);
export function worldSeed(value) {
  if (Number.isInteger(value) && value >= 0 && value <= 0xffffffff) return value >>> 0;
  if (typeof value === 'string') return [...value].reduce((n, c) => Math.imul(n ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
  return globalThis.crypto?.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0] : (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
}
function random(seed) { let n = seed || 0x9e3779b9; return () => { n ^= n << 13; n ^= n >>> 17; n ^= n << 5; return (n >>> 0) / 4294967296; }; }
function shuffle(items, next) { const a = [...items]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const KINDS = ['Temperiert', 'Ozeanisch', 'Eiswelt', 'Vulkanisch', 'Kristallwelt', 'Industriewelt'];
const COLORS = ['#91bba7', '#7da8d9', '#a9c6de', '#d99475', '#b29bdf', '#a6a7b3'];
const EXTRA_STARS = ['aphelion', 'lumen', 'umbriel', 'solace'];
const STAR_NAMES = ['Atria', 'Kepler', 'Mirach', 'Altair', 'Halcyon', 'Seren', 'Talos', 'Arden', 'Mira', 'Nyx', 'Solis', 'Erevan', 'Lacuna', 'Nadir', 'Auriga', 'Thuban'];
const PLANET_NAMES = ['Aurelia', 'Boreas', 'Cyrene', 'Drava', 'Eidon', 'Faron', 'Galene', 'Hesper', 'Iona', 'Juno', 'Kallio', 'Lethra', 'Mavara', 'Nerra', 'Ophira', 'Pelara', 'Quorin', 'Rhea', 'Savana', 'Tethra', 'Uvara', 'Veylon', 'Westra', 'Xanthe', 'Yara', 'Zephra'];
export function depositsFor(kind, seed, buildings = []) {
  const next = random(seed ^ 0x374fc6a1), counts = { ore: 2 + Math.floor(next() * 3), crystal: 1 + Math.floor(next() * 3), fuel: 1 + Math.floor(next() * 3) };
  if (['Vulkanisch', 'Industriewelt'].includes(kind)) counts.ore++;
  if (kind === 'Kristallwelt') counts.crystal++;
  if (['Eiswelt', 'Ozeanisch'].includes(kind)) counts.fuel++;
  const groups = { ore: ['mine', 'deepMine'], crystal: ['crystal'], fuel: ['fuelExtractor'] };
  for (const [key, types] of Object.entries(groups)) counts[key] = Math.max(counts[key], buildings.filter(b => types.includes(b.type)).length);
  return { ...counts, crystalYield: +(.55 + next() * .9).toFixed(2), fuelYield: +(.55 + next() * .9).toFixed(2) };
}
export function legacyDepositsFor(p) {
 const d={ore:3,crystal:3,fuel:3,crystalYield:1,fuelYield:1};
 for(const[key,types]of Object.entries({ore:['mine','deepMine'],crystal:['crystal'],fuel:['fuelExtractor']}))d[key]=Math.max(3,p.buildings.filter(b=>types.includes(b.type)).length);
 return d;
}
export function createWorld(seedValue) {
  const seed = worldSeed(seedValue), next = random(seed);
  const ids = [...SYSTEMS.map(s => s.id), ...EXTRA_STARS], names = shuffle(STAR_NAMES, next), slots = shuffle(ids.map((_, i) => ({ x: [.18, .5, .82][i % 3], y: .06 + Math.floor(i / 3) * .175 })), next);
  const systems = ids.map((id, i) => ({ id, name: names[i], ...slots[i], color: ['#e6bc78', '#aba1e3', '#da8e72', '#9cc9e0'][Math.floor(next() * 4)], uncharted: i >= 9,
    description: 'Die Zusammensetzung dieses Systems wird durch Erkundung bekannt.' }));
  const raw = shuffle(PLANET_SEEDS, next).map((p, i) => {
    const kindIndex = Math.floor(next() * KINDS.length), kind = KINDS[kindIndex], planetSeed = Math.floor(next() * 1e9);
    return { id: p.id, name: `${PLANET_NAMES[i % PLANET_NAMES.length]}${i >= PLANET_NAMES.length ? ' ' + (2 + Math.floor(i / PLANET_NAMES.length - 1)) : ''}`, owner: null, kind, color: COLORS[kindIndex], seed: planetSeed,
      oreFactor: +((['Industriewelt', 'Vulkanisch'].includes(kind) ? 1.25 : .55) + next() * .7).toFixed(2), solarFactor: +((kind === 'Eiswelt' ? .55 : .8) + next() * .45).toFixed(2), population: 0, aliens: 0,
      deposits: depositsFor(kind, planetSeed), generated: true };
  });
  // Nine settled systems, four wild planetary systems, three genuine star-only systems.
  const planetary = systems.slice(0, 13), sizes = Array(13).fill(2);
  for (let remaining = raw.length - 26; remaining > 0; remaining--) { const choices = sizes.map((n, i) => n < 5 ? i : -1).filter(i => i >= 0); sizes[choices[Math.floor(next() * choices.length)]]++; }
  let cursor = 0;
  for (let i = 0; i < planetary.length; i++) for (let orbit = 0; orbit < sizes[i]; orbit++) Object.assign(raw[cursor++], { system: planetary[i].id, orbit, frontier: true });
  const homes = shuffle(raw.filter(p => !systems.find(s => s.id === p.system).uncharted), next).slice(0, Object.keys(FACTIONS).length), owners = shuffle(Object.keys(FACTIONS), next);
  homes.forEach((p, i) => Object.assign(p, { owner: owners[i], population: owners[i] === 'player' ? 180 : 165 + Math.floor(next() * 30), aliens: owners[i] === 'player' ? .12 : .35 + next() * .55, startingWorld: true }));
  const ruins = shuffle(raw.filter(p => !p.owner), next).slice(0, 4);
  ruins.forEach((p, i) => { p.ruin = freshRuin(i % 2 ? 'observatory' : 'depot'); });
  const anchors = systems.slice(13).map((s, i) => ({ id: `anchor-${s.id}`, name: i ? `${s.name} · Orbitales Relikt` : `${s.name} · Sternanker`, system: s.id, orbit: 0, anchor: true, owner: null, kind: 'Orbital', color: '#9ba4c6', seed: Math.floor(next() * 1e9), oreFactor: 1, solarFactor: 1, population: 0, aliens: 0,
    happiness: 70, defense: 0, garrison: 0, shield: 0, destroyed: false, stock: Object.fromEntries(RESOURCE_KEYS.map(k => [k, 0])), buildings: [], queues: [], net: {}, priority: 'balanced', needs: [], ...(i ? { ruin: freshRuin(i === 1 ? 'depot' : 'observatory') } : {}) }));
  return { seeds: raw, world: { seed, generated: true, systems, anchors } };
}
export const freshRuin = type => ({ type, status: 'sealed', remaining: 0, operator: null });
export function legacyWorld(state) {
  return { seed: null, generated: false, systems: structuredClone(SYSTEMS), anchors: [] };
}
