import { BUILDINGS, SYSTEMS } from './data.js';
import { STRATEGIC_WEAPONS, CAMPAIGN_GOALS } from './military-data.js';
import { technologyEffects } from './technology.js';
import { getPlanet, canAfford, pay, uid, log, makeStock } from './state.js';
export function baseStats(state, p) {
  const stats = { capacity: 0, regen: 0, orbital: 0, fortification: 0, interception: 0, starBarrier: 0 };
  for (const b of p.buildings) if (!b.remaining && b.enabled && b.status === 'aktiv') {
    const d = BUILDINGS[b.type];
    stats.capacity += d.shield ?? 0; stats.regen += d.regen ?? 0;
    for (const k of ['orbital', 'fortification', 'interception', 'starBarrier']) stats[k] += d[k] ?? 0;
  }
  const t = technologyEffects(state, p.owner);
  stats.capacity *= t.shieldCapacity; stats.regen *= t.shieldRegen; stats.interception = Math.min(.75, stats.interception);
  return stats;
}
export function tickShields(state) { for (const p of state.planets) { const b = baseStats(state, p); p.shield = p.destroyed ? 0 : Math.min(b.capacity, (p.shield ?? 0) + b.regen); } }
export function absorbShield(p, power) { const absorbed = Math.min(p.shield ?? 0, power); p.shield = Math.max(0, (p.shield ?? 0) - absorbed); return power - absorbed; }
export function strikeDistance(source, target) { const a = SYSTEMS.find(s => s.id === source.system), b = SYSTEMS.find(s => s.id === target.system); return Math.hypot(a.x - b.x, a.y - b.y); }
export function strikeError(state, source, target, type, owner = 'player') {
  const w = STRATEGIC_WEAPONS[type];
  if (!w || !source || !target || source.destroyed || target.destroyed || source.owner !== owner) return 'Wähle einen eigenen Startplaneten und ein intaktes Ziel.';
  if (owner === 'player' && !state.tech.includes(w.tech)) return 'Die erforderliche Waffentechnologie fehlt.';
  if (target.owner === owner || !target.owner || !(owner === 'player' ? state.relations[target.owner]?.war : target.owner === 'player' && state.relations[owner]?.war)) return 'Fernangriffe setzen Krieg mit dem Zielreich voraus.';
  if (w.starKiller && state.planets.some(p => p.system === target.system && p.owner && (p.owner === owner || owner === 'player' && !state.relations[p.owner]?.war))) return 'In diesem System liegen eigene oder nicht feindliche Kolonien.';
  if (strikeDistance(source, target) > w.range * technologyEffects(state, owner).strikeRange) return 'Das Ziel liegt außerhalb der Waffenreichweite. Erforsche Subraum-Reichweite.';
  if (!source.buildings.some(b => b.type === w.facility && !b.remaining && b.enabled && b.status === 'aktiv' && !state.strikes.some(s => s.facilityId === b.id && s.source === source.id && s.phase === 'charge'))) return 'Es fehlt eine versorgte, freie Startanlage.';
  const cost = owner === 'player' ? w.cost : Object.fromEntries(Object.entries(w.cost).filter(([k]) => k !== 'credits'));
  if (!canAfford(state, source, cost)) return 'Für die Ladung fehlen Credits oder lokale Rohstoffe.';
  return null;
}
export function launchStrike(state, sourceId, targetId, type, { confirmed = false, owner = 'player' } = {}) {
  const source = getPlanet(state, sourceId), target = getPlanet(state, targetId), w = STRATEGIC_WEAPONS[type];
  const error = strikeError(state, source, target, type, owner); if (error) return error;
  if ((w.planetKiller || w.starKiller) && !confirmed) return 'Die endgültige Zerstörung muss bestätigt werden.';
  const facility = source.buildings.find(b => b.type === w.facility && !b.remaining && b.enabled && b.status === 'aktiv' && !state.strikes.some(s => s.source === source.id && s.facilityId === b.id && s.phase === 'charge'));
  pay(state, source, owner === 'player' ? w.cost : Object.fromEntries(Object.entries(w.cost).filter(([k]) => k !== 'credits')));
  const flight = source.system === target.system ? 4 : 10 + Math.ceil(strikeDistance(source, target) * 6);
  state.strikes.push({ id: uid(state, 'strike'), type, owner, source: source.id, target: target.id, facilityId: facility.id, phase: 'charge', remaining: w.charge, total: w.charge, flight });
  log(state, `${source.name}: ${w.name} gegen ${target.name} wird geladen (${w.charge} Tage).`, 'war'); return null;
}
export function cancelStrike(state, id) { const s = state.strikes.find(s => s.id === id); if (!s || s.owner !== 'player' || s.phase !== 'charge') return 'Nur eigene Ladeaufträge können abgebrochen werden.'; state.strikes = state.strikes.filter(s => s.id !== id); log(state, 'Ladeauftrag abgebrochen. Verbrauchte Materialien werden nicht erstattet.', 'warning'); return null; }
export function destroyPlanet(state, p) {
  Object.assign(p, { destroyed: true, owner: null, population: 0, defense: 0, garrison: 0, shield: 0, stock: makeStock(), buildings: [], queues: [], net: {}, lastReport: null });
  if (state.event?.planet === p.id) state.event = null;
  state.fleets = state.fleets.filter(f => f.mission || f.planetId !== p.id);
  for (const f of state.fleets) {
    if (f.route && [f.route.source, f.route.target].includes(p.id)) f.route = null;
    if (f.mission?.target === p.id) {
      const home = state.planets.find(q => q.owner === f.owner && !q.destroyed);
      if (home) f.mission = { ...f.mission, kind: f.mission.cargo ? 'return-cargo' : 'move', source: p.id, target: home.id, remaining: 10, total: 10 };
      else f.hp = 0;
    }
  }
  state.fleets = state.fleets.filter(f => f.hp > 0);
}
function impact(state, s) {
  const p = getPlanet(state, s.target), w = STRATEGIC_WEAPONS[s.type];
  if (p.destroyed || !p.owner || !(s.owner === 'player' ? state.relations[p.owner]?.war : p.owner === 'player' && state.relations[s.owner]?.war)) { log(state, 'Fernangriff abgebrochen: Ziel zerstört oder Waffenstillstand.', 'warning'); return; }
  let power = w.power * technologyEffects(state, s.owner).strikePower;
  if (w.starKiller) {
    const worlds = state.planets.filter(q => q.system === p.system && !q.destroyed);
    if (worlds.some(q => q.owner && (q.owner === s.owner || s.owner === 'player' && !state.relations[q.owner]?.war))) { log(state, 'Stellarer Angriff wegen veränderter Systemkontrolle abgebrochen.', 'warning'); return; }
    const barrier = worlds.reduce((n, q) => n + baseStats(state, q).starBarrier, 0);
    for (const q of worlds) power = absorbShield(q, power);
    if (power <= barrier) { log(state, `${p.system}: Stellare Schilde haben den Resonanzbruch aufgehalten.`, 'war'); return; }
    for (const q of worlds) destroyPlanet(state, q);
    if (!state.destroyedSystems.includes(p.system)) state.destroyedSystems.push(p.system);
    log(state, `${p.system}: Stern und ${worlds.length} Planeten sind endgültig zerstört.`, 'war'); return;
  }
  power *= 1 - baseStats(state, p).interception;
  power = absorbShield(p, power);
  if (power <= 0) { log(state, `${p.name}: ${w.name} vollständig abgewehrt.`, 'war'); return; }
  if (w.planetKiller) { destroyPlanet(state, p); log(state, `${p.name}: Der Weltenbrecher hat den Planeten endgültig zerstört.`, 'war'); return; }
  const fraction = Math.min(1, power / w.power), losses = Math.ceil((s.type === 'missile' ? 1 : s.type === 'fusionStrike' ? 3 : 5) * fraction);
  p.defense = Math.max(0, p.defense - power); p.garrison = Math.max(0, p.garrison - power / 3);
  if (s.type !== 'missile') { p.population = Math.max(1, p.population * (1 - .2 * fraction)); for (const k of Object.keys(p.stock)) p.stock[k] *= 1 - .2 * fraction; }
  const targets = [...p.buildings].sort((a, b) => (BUILDINGS[b.type].group === 'Planetare Basen') - (BUILDINGS[a.type].group === 'Planetare Basen'));
  const removed = new Set(targets.slice(0, losses).map(b => b.id)); p.buildings = p.buildings.filter(b => !removed.has(b.id));
  p.shield = Math.min(p.shield, baseStats(state, p).capacity); p.happiness = Math.max(5, p.happiness - 12 * fraction);
  log(state, `${p.name}: ${w.name} trifft; ${removed.size} Anlagen zerstört.`, 'war');
}
export function tickStrikes(state) {
  const completed = new Set();
  for (const s of [...state.strikes]) {
    if (s.phase === 'charge') {
      const p = getPlanet(state, s.source), b = p.buildings.find(b => b.id === s.facilityId);
      if (p.destroyed || p.owner !== s.owner || !b) { completed.add(s.id); log(state, 'Waffenladung verloren: Startanlage zerstört oder besetzt.', 'warning'); continue; }
      if (b.status !== 'aktiv' || !b.enabled || b.remaining) continue;
      if (--s.remaining <= 0) { s.phase = 'flight'; s.remaining = s.total = s.flight; log(state, `${p.name}: ${STRATEGIC_WEAPONS[s.type].name} gestartet. Einschlag in ${s.flight} Tagen.`, 'war'); }
    } else if (--s.remaining <= 0) { impact(state, s); completed.add(s.id); }
  }
  state.strikes = state.strikes.filter(s => !completed.has(s.id));
  if (state.day >= 180 && state.day % 30 === 0) for (const owner of Object.keys(state.relations).filter(id => state.relations[id].war)) {
    const source = state.planets.find(p => p.owner === owner && p.buildings.some(b => b.type === 'missileSilo'));
    const target = state.planets.find(p => p.owner === 'player' && source && !strikeError(state, source, p, 'missile', owner));
    if (source && target) launchStrike(state, source.id, target.id, 'missile', { owner });
  }
}
export function goalValue(state, kind) {
  const owned = state.planets.filter(p => p.owner === 'player');
  if (kind === 'colonies') return owned.length;
  if (kind === 'research') return state.tech.length;
  if (kind === 'shields') return owned.reduce((n, p) => n + p.shield, 0);
  const bases = owned.flatMap(p => p.buildings).filter(b => !b.remaining && BUILDINGS[b.type].group === 'Planetare Basen');
  return kind === 'mega' ? bases.filter(b => b.type === 'stellarForge').length : bases.length;
}
export function tickGoals(state) { for (const g of CAMPAIGN_GOALS) if (!state.milestones.includes(g.id) && goalValue(state, g.kind) >= g.target) { state.milestones.push(g.id); state.credits += g.credits; state.science += g.science; log(state, `${g.name}: Meilenstein erreicht (+${g.credits} Credits, +${g.science} Forschung).`, 'success'); } }
