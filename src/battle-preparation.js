import { SHIPS } from './data.js';
import { fleetStrength, shipArmor } from './fleets.js';
import { technologyEffects } from './technology.js';
import { initialGovernance } from './governance.js';

export const trialBaseline = () => ({ day: 0, tech: [], player: { ideology: 'democracy' }, governance: initialGovernance() });

// Only starting combat values are retained. No empire state or references enter the draft.
export function createPreparation(own, label) {
  const profiles = {};
  for (const [side, state] of [['friendly', own], ['enemy', trialBaseline()]]) {
    profiles[side] = Object.fromEntries(Object.keys(SHIPS).map(type => [type, {
      power: fleetStrength(state, { type, owner: 'player', hp: 100, supply: 100 }),
      armor: shipArmor(state, { type, owner: 'player' }),
      retreatFuel: 8 * technologyEffects(state).fuel,
      retreatSpeed: 260 * (SHIPS[type].speed ?? 1),
    }]));
  }
  return { id: crypto.randomUUID(), label, profiles, ships: [], supplies: { friendly: 100, enemy: 100 } };
}

export function validatePreparation(value) {
  const fail = () => { throw new Error('Ungültige Ausgangswerte der Probeschlacht.'); };
  const num = (v, lo, hi) => Number.isFinite(v) && v >= lo && v <= hi;
  const text = v => typeof v === 'string' && v.length > 0 && v.length <= 160;
  if (!value || !text(value.id) || !text(value.label) || !Array.isArray(value.ships)) fail();
  for (const side of ['friendly', 'enemy']) {
    if (!num(value.supplies?.[side], 0, 100)) fail();
    for (const type of Object.keys(SHIPS)) {
      const p = value.profiles?.[side]?.[type];
      if (!p || !num(p.power, 0, 1e6) || !num(p.armor, 0, .65) || !num(p.retreatFuel, .01, 100)
        || p.retreatSpeed !== 260 * (SHIPS[type].speed ?? 1) || (SHIPS[type].strength === 0 && p.power !== 0)) fail();
    }
  }
  const ids = new Set();
  for (const s of value.ships) {
    const key = s?.side + ':' + s?.id;
    if (!s || !text(s.id) || !['friendly', 'enemy'].includes(s.side) || ids.has(key)
      || !Object.hasOwn(SHIPS, s.type) || !num(s.hp, 0, 100) || s.hp <= 0 || !num(s.supply, 0, 100)) fail();
    ids.add(key);
  }
  return structuredClone(value);
}
