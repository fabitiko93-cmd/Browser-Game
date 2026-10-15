import { FACTIONS, SHIPS } from './data.js';
import { uid } from './state.js';

export const BATTLE_REPORT_LIMIT = 6;
export const BATTLE_SHIP_LIMIT = 2000;
export const BATTLE_OUTCOMES = {
  held: 'Im Orbit', destroyed: 'Im Gefecht zerstört', retreated: 'Zurückgezogen',
  landed: 'Als Garnison gelandet', lost: 'Beim Rückzug verloren',
};

// Snapshots belong to the strategic resolver. The 3D viewer never settles a battle.
export function beginBattleReport(state, attackers, guards, planet, base) {
  const attacker = attackers[0].owner, defender = planet.owner;
  if (attacker !== 'player' && defender !== 'player') return null;
  return { id: uid(state, 'battle'), day: state.day, planetId: planet.id, planetName: planet.name,
    attacker, defender, victory: false, captured: false,
    defense: { before: planet.defense, after: planet.defense, orbital: base.orbital,
      shieldBefore: planet.shield, shieldAfter: planet.shield, garrison: planet.garrison, fortification: base.fortification },
    ships: [...attackers, ...guards].filter(f => f.hp > 0).map(f => ({ id: f.id, name: f.name, type: f.type, owner: f.owner,
      hpBefore: f.hp, combatHp: f.hp, hpAfter: f.hp, supplyBefore: f.supply, supplyAfter: f.supply, outcome: 'held' })) };
}
export function finishBattleReport(state, report, participants, planet, victory, captured) {
  if (!report) return;
  report.victory = victory; report.captured = captured;
  report.defense.after = planet.defense; report.defense.shieldAfter = planet.shield;
  const byId = new Map(participants.map(f => [f.id, f]));
  for (const ship of report.ships) {
    const f = byId.get(ship.id);
    ship.hpAfter = f.hp; ship.supplyAfter = f.supply;
    ship.outcome = ship.combatHp <= 0 ? 'destroyed'
      : captured && ship.owner === report.attacker && ship.type === 'lander' ? 'landed'
      : f.hp <= 0 ? 'lost' : f.mission ? 'retreated' : 'held';
  }
  state.battleReports ??= [];
  state.battleReports.unshift(report);
  // Bound storage as well as report count; old reports do not retain live fleet objects.
  while (state.battleReports.length > 1 && (state.battleReports.length > BATTLE_REPORT_LIMIT
    || state.battleReports.reduce((n, r) => n + r.ships.length, 0) > 3000
    || JSON.stringify(state.battleReports).length > 650000)) state.battleReports.pop();
}
export function battleResult(report) {
  if (report.captured) return report.attacker === 'player' ? 'Planet erobert' : 'Planet verloren';
  if (report.attacker === 'player') return report.victory ? 'Orbit gesichert' : 'Angriff abgewehrt';
  return report.victory ? 'Orbit durchbrochen' : 'Angriff abgewehrt';
}
export function battleLosses(report, owner = 'player') {
  return report.ships.filter(s => s.owner === owner && ['destroyed', 'lost'].includes(s.outcome)).length;
}
export function validateBattleReports(state) {
  const finite = (v, max = 1e12) => Number.isFinite(v) && v >= 0 && v <= max;
  const text = (v, max = 64) => typeof v === 'string' && v.length > 0 && v.length <= max;
  const known = (dict, id) => typeof id === 'string' && Object.hasOwn(dict, id);
  const reports = state.battleReports, ids = new Set();
  const fail = () => { throw new Error('Ungültige Gefechtsaufzeichnung.'); };
  if (!Array.isArray(reports) || reports.length > BATTLE_REPORT_LIMIT) fail();
  let lastDay = state.day, total = 0;
  for (const r of reports) {
    if (!r || !text(r.id) || ids.has(r.id) || !Number.isInteger(r.day) || !finite(r.day, lastDay)
      || !state.planets.some(p => p.id === r.planetId) && !state.world?.anchors.some(p => p.id === r.planetId)
      || !text(r.planetName) || !known(FACTIONS, r.attacker) || !known(FACTIONS, r.defender)
      || r.attacker === r.defender || ![r.attacker, r.defender].includes('player')
      || typeof r.victory !== 'boolean' || typeof r.captured !== 'boolean' || r.captured && !r.victory
      || !r.defense || !['before', 'after', 'orbital', 'shieldBefore', 'shieldAfter', 'garrison', 'fortification'].every(k => finite(r.defense[k]))
      || r.defense.after > r.defense.before || r.defense.shieldAfter > r.defense.shieldBefore
      || !Array.isArray(r.ships) || !r.ships.length || r.ships.length > BATTLE_SHIP_LIMIT) fail();
    ids.add(r.id); lastDay = r.day; total += r.ships.length;
    const ships = new Set(); let attacking = false;
    for (const s of r.ships) {
      if (!s || !text(s.id) || ships.has(s.id) || !text(s.name) || !known(SHIPS, s.type)
        || ![r.attacker, r.defender].includes(s.owner)
        || !['hpBefore', 'combatHp', 'hpAfter', 'supplyBefore', 'supplyAfter'].every(k => finite(s[k], 100))
        || s.hpBefore <= 0 || s.combatHp > s.hpBefore || s.hpAfter > s.combatHp || s.supplyAfter > s.supplyBefore
        || !known(BATTLE_OUTCOMES, s.outcome)
        || (s.outcome === 'destroyed') !== (s.combatHp === 0)
        || (s.outcome === 'lost') !== (s.combatHp > 0 && s.hpAfter === 0)
        || s.outcome === 'landed' && (!r.captured || s.owner !== r.attacker || s.type !== 'lander')) fail();
      ships.add(s.id); attacking ||= s.owner === r.attacker;
    }
    if (!attacking) fail();
  }
  if (total > 3000 || reports.length > 1 && JSON.stringify(reports).length > 650000) fail();
}
