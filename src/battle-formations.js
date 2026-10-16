import { SHIPS } from './data.js';
import { STRATEGIC_MODELS } from './battle-models.js';

export function maneuverSpec(ship) {
  const size = ship.length ?? 36, speed = SHIPS[ship.strategicType]?.speed ?? 1;
  return { speed: (size >= 60 ? 180 : size >= 28 ? 250 : 520) * speed,
    turnRate: size >= 60 ? .12 : size >= 28 ? .36 : 1.25, fireArc: size >= 60 ? .035 : size >= 28 ? .05 : .07 };
}

export function formationProfile(ship, values = {}) {
  const type = ship.strategicType ?? ship.type, def = SHIPS[type], hp = values.hp ?? 100;
  const power = values.power ?? def.strength, armor = values.armor ?? def.armor ?? 0;
  const mobility = maneuverSpec({ strategicType: type, length: ship.length ?? STRATEGIC_MODELS[type][1] });
  return { power: power * hp / 100 * Math.max(.3, (values.supply ?? 100) / 100),
    endurance: hp / Math.max(.35, 1 - armor), speed: mobility.speed,
    protected: power <= 0 || type === 'lander' || hp < 45, fast: mobility.speed >= 400 };
}

export function planningProfiles(plan, side, preparation) {
  const fleet = plan.sides[side], originals = new Map((preparation?.ships ?? []).filter(s => s.side === side).map(s => [s.id, s]));
  return new Map(fleet.ships.map(s => {
    const original = originals.get(s.id), retained = original?.type === s.type ? original : null;
    const supply = retained && fleet.supply === preparation.supplies[side] ? retained.supply : fleet.supply;
    return [s.id, formationProfile(s, { ...preparation?.profiles[side]?.[s.type], hp: retained?.hp ?? 100, supply })];
  }));
}

export function groupProfile(profiles) {
  const sum = key => profiles.reduce((n, p) => n + p[key], 0);
  return { power: sum('power'), endurance: sum('endurance') / Math.max(1,profiles.length), speed: Math.min(...profiles.map(p => p.speed)),
    protected: profiles.length > 0 && profiles.every(p => p.protected), fast: profiles.length > 0 && profiles.every(p => p.fast) };
}

// Values determine who occupies each slot; no damage or armor bonus is applied.
export function formationSlots(items, formation, gap, profile) {
  const points = new Array(items.length), entries = items.map((item, index) => ({ item, index, p: profile(item) }));
  const sort = (a, b) => b.p.endurance - a.p.endurance || b.p.power - a.p.power || a.item.id.localeCompare(b.item.id);
  const guarded = entries.filter(e => e.p.protected).sort(sort), armed = entries.filter(e => !e.p.protected).sort(sort);
  const place = (e, x, z) => { points[e.index] = [x * gap, 0, z * gap]; };
  const line = (list, z, width) => list.forEach((e, i) => place(e, i % width - (Math.min(width, list.length) - 1) / 2, z + Math.floor(i / width) * .85));
  const balanced = list => {
    const loads = [0, 0];
    list.forEach((e, i) => {
      if (!i) { place(e, 0, -.35); return; }
      const wing = loads[0] <= loads[1] ? 0 : 1, sign = wing ? 1 : -1;
      const count = list.slice(1, i).filter(p => Math.sign(points[p.index][0]) === sign).length;
      place(e, sign * (1 + count % 2), Math.floor(count / 2) * .85 + (e.p.fast ? .45 : 0));
      loads[wing] += e.p.power;
    });
  };
  if (formation === 'line') line(armed, 0, Math.max(1, Math.ceil(Math.sqrt(armed.length) * 2.5)));
  else if (formation === 'wedge') armed.forEach((e, i) => place(e, i ? (i % 2 ? -1 : 1) * Math.ceil(i / 2) * .70 : 0, Math.ceil(i / 2) * .72));
  else balanced(armed);
  const back = Math.max(.8, ...points.filter(Boolean).map(p => p[2] / gap)) + 1.4;
  line(guarded, back, Math.max(1, Math.ceil(Math.sqrt(guarded.length))));
  const center = [0, 1, 2].map(a => points.reduce((n, p) => n + p[a], 0) / Math.max(1, points.length));
  return points.map(p => p.map((v, a) => v - center[a]));
}

export function formationFor(battle, ship) {
  const group = battle.formations?.find(g => g.id === ship.group);
  const fleet = battle.plan?.sides[ship.side];
  return group?.formation && group.formation !== 'auto' ? group.formation : fleet?.formation ?? 'auto';
}

export const FORMATION_HELP = {
  auto: 'Belastbare Einheiten im Kern, Feuerkraft auf beide Seiten verteilt. Empfindliche Schiffe stehen dahinter.',
  line: 'Breite, flache Feuerfront. Die weit auseinanderliegenden Flügel brauchen länger, um sich gegenseitig zu unterstützen.',
  wedge: 'Belastbare Spitze mit konzentrierter Feuerkraft. Automatische Salven berücksichtigen anfliegende Torpedos; manuelle Ziele haben Vorrang.',
  screen: 'Defensive Ausgangsstellung mit unbewaffneten Einheiten hinter der Front. Sie blockiert keine gezielten Angriffe und fängt keine Geschosse ab.',
  staggered: 'Versetzte Reihen mit gleichmäßigen Abständen.',
  column: 'Aufstellung hintereinander mit geringer Breite und großer Tiefe.',
};
