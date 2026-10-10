import { finishCommerce } from './foreign-commerce.js';
import { sellGoods, marketPrice } from './trade.js';
import { serviceCount } from './infrastructure.js';
import { SUPPLY_DEFAULTS, cargoUsed, tickCircuit, arriveCircuit } from './routing.js';
import { baseStats, absorbShield } from './strategic.js';
import { technologyEffects } from './technology.js';
import { policyEffects } from './governance.js';
import { SHIPS, FACTIONS, BUILDINGS, SYSTEMS } from './data.js';
import { SCAN_COST, SCAN_DAYS } from './exploration-data.js';
import { reachablePlanet, knowledgeOf, knownTargets, observePlanet, visitArrival, portKnown } from './intelligence.js';
import { finishScout } from './exploration.js';
import { canAfford, pay, uid, getPlanet, log, makeStock } from './state.js';
import { workforce } from './economy.js';

export function fleetStrength(state, fleet) { return SHIPS[fleet.type].strength * fleet.hp / 100 * Math.max(.3, fleet.supply / 100) * technologyEffects(state, fleet.owner).combat * policyEffects(state, fleet.owner).combat; }
export function travelDays(state, source, target, owner = 'player') { const deep = [source, target].some(p => SYSTEMS.find(s => s.id === p.system)?.uncharted); return Math.max(2, Math.ceil((source.system === target.system ? 5 + Math.abs(source.orbit - target.orbit) : deep ? 28 : 14) * technologyEffects(state, owner).travelTime)); }
export function shipBuildDays(state, type, owner = 'player') { return Math.max(1, Math.ceil(SHIPS[type].days * policyEffects(state, owner).shipTime * technologyEffects(state, owner).shipTime)); }
export function fleetTravelDays(state, source, target, fleets) { return Math.max(2, Math.ceil(travelDays(state, source, target, fleets[0]?.owner) / Math.min(...fleets.map(f => SHIPS[f.type].speed ?? 1)))); }
export function buildShip(state, planet, type, owner = 'player') {
  const def = SHIPS[type];
  if (!Object.hasOwn(SHIPS, type) || !planet || planet.owner !== owner) return 'Hier kannst du keine Schiffe bauen.';
  const yard = planet.buildings.find(b => b.type === 'shipyard' && b.enabled && b.remaining <= 0);
  if (!yard) return 'Eine fertige Raumwerft wird benötigt.';
  if (planet.queues.length >= 3) return 'Die Werft hat bereits drei Aufträge.';
  const tech = owner === 'player' ? state.tech : state.factions[owner].tech;
  if(def.requiredTech&&!tech.includes(def.requiredTech))return 'Der Schiffsbauplan muss zuerst erforscht werden.';
  if (!canAfford(state, planet, def.cost, owner)) return 'Für dieses Schiff fehlen Waren oder Credits.';
  if (def.settlers && (planet.population - def.settlers < 60 || workforce(state, planet) < 30)) return 'Es fehlen Einwohner für die Besatzung. Mindestens 60 müssen auf dem Planeten bleiben.';
  pay(state, planet, def.cost, owner);
  if (def.settlers) planet.population -= def.settlers;
  planet.queues.push({ id: uid(state, 'q'), type, remaining: shipBuildDays(state, type, owner) });
  if (owner === 'player') log(state, `${planet.name}: ${def.name} in Auftrag gegeben.`);
  return null;
}
export function tickShipyards(state) {
  for (const p of state.planets.filter(p => p.owner && !p.destroyed)) {
    if (!p.buildings.some(b => b.type === 'shipyard' && b.enabled && b.remaining <= 0 && b.status === 'aktiv')) continue;
    const q = p.queues[0];
    if (!q || --q.remaining > 0) continue;
    p.queues.shift();
    const id = uid(state, 'f');
    state.fleets.push({ id, name: `${p.owner === 'player' ? 'NU' : p.name} ${SHIPS[q.type].name} ${state.nextId}`, type: q.type, owner: p.owner, planetId: p.id, hp: 100, supply: 100, cargo:makeStock(), supplySettings:{...SUPPLY_DEFAULTS,homePort:p.id}, servicing:false, mission: null, route: null });
    if (p.owner === 'player') log(state, `${p.name}: ${SHIPS[q.type].name} einsatzbereit.`, 'success', 'ship');
  }
}
export function orderFleet(state, fleetIds, targetId, kind = 'move', options = {}) {
  if (!['move', 'settle', 'attack', 'transport', 'survey', 'explore', 'analyze'].includes(kind)) return 'Unbekannter Flottenbefehl.';
  const owner = options.owner ?? 'player', tech = owner === 'player' ? state.tech : state.factions[owner]?.tech;
  if (!tech) return 'Unbekanntes Reich.';
  const target = getPlanet(state, targetId);
  const ids = new Set(fleetIds);
  const fleets = state.fleets.filter(f => ids.has(f.id) && f.owner === owner);
  if (!target || target.destroyed || !fleets.length || fleets.length !== ids.size) return 'Wähle eine Flotte und ein Ziel.';
  if (fleets.some(f => f.mission || f.route)) return 'Ein ausgewähltes Schiff hat bereits einen Auftrag.';
  const source = getPlanet(state, fleets[0].planetId);
  if (fleets.some(f => f.planetId !== source.id)) return 'Die Schiffe müssen am selben Planeten stehen.';
  if (source.id === target.id) return 'Die Flotte ist bereits am Ziel.';
  if (kind !== 'explore' && !reachablePlanet(state, target, owner)) return 'Die Flugroute muss zuerst von einem Erkunder kartiert werden.';
  if (kind === 'explore' && (!SYSTEMS.find(s => s.id === target.system)?.uncharted || reachablePlanet(state, target, owner) || fleets.some(f => f.type !== 'scout'))) return 'Wähle einen freien Erkunder und ein unkartiertes System.';
  if (kind === 'settle' && (target.owner || !fleets.some(f => f.type === 'colony'))) return 'Kolonisierung benötigt ein Kolonieschiff und einen unbewohnten Planeten.';
  const previous = knowledgeOf(state, target, owner).occupancy;
  if (kind === 'survey' && (!fleets.some(f => f.type === 'scout') || previous?.source === 'scout' && state.day - previous.day < 30)) return 'Erkundung benötigt einen Erkunder; eine erneute Prüfung ist nach 30 Tagen möglich.';
  if (kind === 'analyze' && (fleets.length !== 1 || fleets[0].type !== 'probe' || !tech.includes('planetaryAnalysis'))) return 'Benötigt eine freie Analysesonde und Planetare Analyseverfahren.';
  if (kind === 'attack' && (!target.owner || target.owner === 'player' || !state.relations[target.owner]?.war)) return 'Ein Angriff setzt eine Kriegserklärung voraus.';
  if (kind === 'attack' && !fleets.some(f => fleetStrength(state, f) > 0)) return 'Diese Schiffe besitzen keine Bewaffnung.';
  if (kind === 'transport' && (fleets.length !== 1 || !SHIPS[fleets[0].type].cargo)) return 'Für eine Route muss genau ein Frachter ausgewählt sein.';
  const targetRelation = owner === 'player' ? state.relations[target.owner] : target.owner === 'player' ? state.relations[owner] : null;
  if (!['attack','survey','explore','analyze'].includes(kind) && target.owner && target.owner !== owner && targetRelation?.war) return 'Das Ziel gehört einer feindlichen Macht.';
  if (kind === 'move' && fleets.some(f => f.type === 'scout') && target.owner && target.owner !== owner) return 'Erkunder prüfen bewohnte Welten mit dem Erkundungsauftrag aus der Distanz.';
  const fuel = fleets.length * departureFuel(state, source, target, owner);
  const sourceRelation = owner === 'player' ? state.relations[source.owner] : source.owner === 'player' ? state.relations[owner] : null;
  const docked = source.owner === owner || sourceRelation?.trade && !sourceRelation.war;
  if (kind === 'analyze' && (source.owner !== owner || !canAfford(state, source, { ...SCAN_COST, energy: SCAN_COST.energy + fuel }, owner))) return 'Für den Scan fehlen 60 Credits, 2 Optik oder Energie einschließlich der Reise am eigenen Startplaneten.';
  if (docked && source.stock.energy < fuel) return 'Am Abflugplaneten fehlt Energie für den Antrieb.';
  if (!docked && fleets.some(f => f.supply < fuel / fleets.length)) return 'Die Bordversorgung reicht nicht für die Reise. Sichere den Planeten oder verlege die Flotte früher.';
  let cargo = null;
  if (kind === 'transport') {
    if(!portKnown(state,target,owner))return 'Der Zielhafen und seine Zugehörigkeit müssen zuerst bekannt sein.';
    if (!target.owner || (target.owner !== 'player' && !state.relations[target.owner]?.trade)) return 'Transport braucht eine eigene Kolonie oder ein Handelsabkommen.';
    const resource = options.resource;
    const amount = Number(options.amount);
    if (!Object.hasOwn(source.stock, resource) || !Number.isFinite(amount) || amount <= 0 || amount > cargoCapacity(state, fleets[0].type)) return `Wähle eine Menge zwischen 1 und ${cargoCapacity(state, fleets[0].type)}.`;
    if(cargoUsed(fleets[0])+amount>cargoCapacity(state,fleets[0].type))return 'Vorhandene Bordfracht belegt den Frachtraum. Entlade sie zuerst im eigenen Hafen.';
    if (source.owner !== 'player') return 'Waren können nur auf deinen eigenen Planeten geladen werden.';
    const reserve=Number(options.reserve??0);if(!Number.isFinite(reserve)||reserve<0)return 'Ungültiger Mindestbestand.';
    const afterFuel = source.stock[resource] - reserve - (resource === 'energy' && docked ? fuel : 0);
    if (afterFuel < amount) return 'Die Ware ist am Abflugplaneten nicht in ausreichender Menge verfügbar.';
    cargo = { resource, amount };
  }
  if (docked) source.stock.energy -= fuel;
  else for (const f of fleets) f.supply -= fuel / fleets.length;
  if (kind === 'analyze') pay(state, source, SCAN_COST, owner);
  if (cargo) source.stock[cargo.resource] -= cargo.amount;
  const group = uid(state, 'm');
  for (const f of fleets) {
    f.mission = { group, kind, source: source.id, target: target.id, remaining: fleetTravelDays(state, source, target, fleets), total: fleetTravelDays(state, source, target, fleets), cargo };
    if (kind === 'transport' && options.repeat) f.route = { source: source.id, target: target.id, resource: cargo.resource, amount: cargo.amount, reserve:Number(options.reserve??0) };
  }
  if (owner === 'player') log(state, `${fleets.length === 1 ? fleets[0].name : `${fleets.length} Schiffe`} unterwegs nach ${kind === 'explore' ? SYSTEMS.find(s => s.id === target.system).name : target.name}.`);
  return null;
}
function settle(state, fleet, target) {
  if (target.owner) { log(state, `${target.name} ist bereits besiedelt. Das Kolonieschiff bleibt im Orbit.`, 'warning'); return; }
  target.owner = fleet.owner; target.population = 40; target.happiness = 70; target.aliens = .1;
  target.stock = makeStock({ food: 60, ore: 40, alloy: 60, energy: 70, crystal: 5 });
  target.buildings = [ { id: uid(state, 'b'), type: 'habitat', x: 5, y: 7, remaining: 0, enabled: true, status: 'aktiv' }, { id: uid(state, 'b'), type: 'solar', x: 5, y: 6, remaining: 0, enabled: true, status: 'aktiv' }, { id: uid(state, 'b'), type: 'farm', x: 4, y: 7, remaining: 0, enabled: true, status: 'aktiv' } ];
  state.fleets = state.fleets.filter(f => f.id !== fleet.id);
  if(fleet.owner==='player') log(state, `Neue Kolonie auf ${target.name}. Das Kolonieschiff wurde zur Siedlung umgebaut.`, 'success', 'colony');
}
export function resolveBattle(state, fleets, target) {
  if (!target.owner || target.owner === 'player' || !state.relations[target.owner]?.war) { log(state, `Angriff auf ${target.name} abgebrochen: Es besteht kein Krieg.`, 'warning'); return; }
  const attack = fleets.reduce((sum, f) => sum + fleetStrength(state, f), 0);
  const base = baseStats(state, target);
  observePlanet(state,'player',target,'combat');
  if(target.owner) { const origin=getPlanet(state,fleets[0]?.mission?.source??fleets[0]?.planetId);if(origin)observePlanet(state,target.owner,origin,'combat'); }
  const defense = target.defense + base.orbital;
  const shieldedAttack = absorbShield(target, attack);
  if (attack <= 0) return;
  const victory = shieldedAttack >= defense && shieldedAttack > 0;
  target.defense = Math.max(0, target.defense - shieldedAttack * (victory ? 1 : .55));
  const damage = victory ? Math.min(65, defense / attack * 55) : Math.min(100, defense / attack * 65);
  for (const f of fleets) { f.hp = Math.max(0, f.hp - damage * (1 - shipArmor(state, f))); f.supply = Math.max(0, f.supply - 25); }
  const survivors = fleets.filter(f => f.hp > 0);
  observePlanet(state,'player',target,'combat');
  state.fleets = state.fleets.filter(f => f.hp > 0);
  if (victory) {
    target.defense = 0;
    const landers = survivors.filter(f => f.type === 'lander');
    const troops = landers.reduce((n, f) => n + SHIPS[f.type].troops, 0);
    if (troops >= target.garrison + base.fortification && landers.length) {
      const previous = target.owner;
      for (const b of target.buildings) if (BUILDINGS[b.type].group === 'Planetare Basen') { b.enabled = false; b.status = 'pausiert'; }
      target.shield = 0;
      target.owner = 'player'; target.garrison = troops; target.happiness = Math.max(15, target.happiness - 25);
      target.queues = []; target.lastReport = null;
      const consumed = new Set(landers.map(f => f.id));
      state.fleets = state.fleets.filter(f => !consumed.has(f.id));
      state.relations[previous].score = -100;
      log(state, `${target.name} besetzt. Die Landungstruppen bilden die neue Garnison.`, 'success');
    } else log(state, `Orbit von ${target.name} gesichert. Für die Besetzung werden mindestens ${target.garrison} Landungstruppen benötigt.`, 'war', 'attack');
  } else {
    for (const f of survivors) {
      const home = state.planets.find(p => p.owner === 'player');
      if (home) f.mission = { group: uid(state, 'retreat'), kind: 'move', source: target.id, target: home.id, remaining: fleetTravelDays(state, target, home, [f]), total: fleetTravelDays(state, target, home, [f]), cargo: null };
    }
    log(state, `Angriff auf ${target.name} gescheitert. ${fleets.length - survivors.length} Schiffe verloren; Überlebende ziehen sich zurück.`, 'war', 'attack');
  }
}
function restartRoute(state, fleet) {
  const route = fleet.route;
  if (!route) return;
  if(route.type==='circuit'){tickCircuit(state,fleet);return;}
  if(fleet.servicing||fleet.repairing){fleet.pauseReason='Versorgung / Reparatur';return;}
  const origin = getPlanet(state, route.source), target = getPlanet(state, route.target);
  if (origin.owner !== 'player' || !target.owner || (target.owner !== 'player' && (!state.relations[target.owner]?.trade || state.relations[target.owner]?.war))) {
    fleet.route = null; log(state, `${fleet.name}: Route beendet, Zugang zum Ziel fehlt.`, 'warning'); return;
  }
  if (fleet.planetId === route.target) {
    const fuel = departureFuel(state, origin, target);
    if (target.stock.energy < fuel) {fleet.pauseReason='Wartet auf Startenergie';return;}
    target.stock.energy -= fuel;
    fleet.mission = { group: uid(state, 'route'), kind: 'move', source: target.id, target: origin.id, remaining: fleetTravelDays(state, target, origin, [fleet]), total: fleetTravelDays(state, target, origin, [fleet]), cargo: null };
  } else if (fleet.planetId === route.source) {
    fleet.route = null;
    const error = orderFleet(state, [fleet.id], route.target, 'transport', { resource: route.resource, amount: route.amount, reserve:route.reserve??0, repeat: true });
    if (error) {fleet.route = route;fleet.pauseReason=error;}else fleet.pauseReason='';
  }
}
export function fleetUpkeep(state, owner = 'player') { return state.fleets.filter(f => f.owner === owner).reduce((n, f) => n + (SHIPS[f.type].upkeep ?? 1), 0) * policyEffects(state, owner).fleetUpkeep * technologyEffects(state, owner).fleetUpkeep; }
export function cargoCapacity(state, type) { return Math.floor(SHIPS[type].cargo * technologyEffects(state).cargoCapacity); }
export function departureFuel(state, source, target, owner = 'player') { return (source.system === target.system ? 8 : [source, target].some(p => SYSTEMS.find(s => s.id === p.system)?.uncharted) ? 32 : 18) * technologyEffects(state, owner).fuel; }
export function shipArmor(state, f) { return Math.min(.65, (SHIPS[f.type].armor ?? 0) + technologyEffects(state, f.owner).armor); }
export function maintainFleets(state, funded = true, owner = 'player') {
  if (!funded) for (const f of state.fleets.filter(f => f.owner === owner)) f.supply = Math.max(0, f.supply - 3);
  if (!funded) return;
  const wallet=owner==='player'?state:state.factions[owner];
  for (const support of state.fleets.filter(f => f.type === 'support' && f.owner === owner && !f.mission)) {
    let budget = Math.min(12, support.supply);
    for (const other of state.fleets.filter(f => f.owner === support.owner && f.id !== support.id && f.type !== 'support' && !f.mission && f.planetId === support.planetId)) {
      const amount = Math.min(budget, 100 - other.supply);
      other.supply += amount; support.supply -= amount; budget -= amount;
      if (!budget) break;
    }
  }
  for (const fleet of state.fleets.filter(f => !f.mission && f.owner === owner)) {
    const p = getPlanet(state, fleet.planetId),settings={...SUPPLY_DEFAULTS,...fleet.supplySettings};
    const port=p.owner===owner||owner==='player'&&state.relations[p.owner]?.portAccess&&!state.relations[p.owner]?.war&&!state.relations[p.owner]?.embargo;
    if(!port)continue;
    let threshold=settings.threshold;
    if(settings.smart&&state.tech.includes('smartLogistics')&&fleet.route){
      const dest=getPlanet(state,fleet.route.type==='circuit'?fleet.route.stops[(fleet.route.index+1)%fleet.route.stops.length].planet:fleet.route.target);
      threshold=Math.min(90,Math.max(threshold,fleetTravelDays(state,p,dest,[fleet])*technologyEffects(state).travelSupply*2+10));
    }
    if(fleet.route&&fleet.supply<threshold)fleet.servicing=true;
    if(fleet.route&&fleet.hp<settings.repairBelow)fleet.repairing=true;
    const rate=8*technologyEffects(state,owner).supply*(serviceCount(p,'supply')?2:1);
    const amount=Math.max(0,Math.min(rate,100-fleet.supply,p.stock.energy*8,p.stock.food*80));
    if(amount>0){
      const fee=p.owner===owner?0:amount/8*marketPrice(state,p,'energy','buy')+amount/80*marketPrice(state,p,'food','buy')+1;
      if(wallet.credits>=fee){p.stock.energy-=amount/8;p.stock.food-=amount/80;fleet.supply+=amount;wallet.credits-=fee;if(fee)state.factions[p.owner].credits+=fee;}
    }
    const repairRate=serviceCount(p,'repair')?10:4;
    const repaired=Math.min(repairRate,100-fleet.hp,p.stock.alloy*4);
    if(repaired>0){const fee=p.owner===owner?0:repaired/4*marketPrice(state,p,'alloy','buy');if(wallet.credits>=fee){p.stock.alloy-=repaired/4;fleet.hp+=repaired;wallet.credits-=fee;if(fee)state.factions[p.owner].credits+=fee;}}
    if(fleet.supply>=settings.target-.00001)fleet.servicing=false;
    if(fleet.hp>=settings.repairTo-.00001)fleet.repairing=false;
    if(fleet.servicing)fleet.pauseReason=p.stock.energy<.01?'Versorgung fehlt: Energie':p.stock.food<.01?'Versorgung fehlt: Nahrung':'Bordversorgung wird aufgefüllt';
  }
}
export function tickFleets(state, options = {}) {
  if (!options.economyProcessed) {
    const upkeep = fleetUpkeep(state), funded = state.credits >= upkeep;
    state.credits -= upkeep; maintainFleets(state, funded);
  }
  const arrivals = new Map();
  for (const fleet of [...state.fleets]) {
    if (!fleet.mission) {
      restartRoute(state, fleet); continue;
    }
    const m = fleet.mission;
    if (m.kind === 'analyze' && m.phase === 'scan') {
      fleet.supply = Math.max(0, fleet.supply - .3);
      if (--m.remaining <= 0) {
        const p = getPlanet(state, m.target); fleet.mission = null;
        if (!p.destroyed) { observePlanet(state, fleet.owner, p, 'probe'); if (fleet.owner === 'player') log(state, `${p.name}: Geologie und Oberfläche analysiert.`, 'success', 'research'); }
        const home = getPlanet(state, m.source);
        if (home && !home.destroyed) fleet.mission = { group: uid(state,'probe-return'), kind:'move', source:p.id,target:home.id,remaining:fleetTravelDays(state,p,home,[fleet]),total:fleetTravelDays(state,p,home,[fleet]),cargo:null };
      }
      continue;
    }
    fleet.supply = Math.max(0, fleet.supply - technologyEffects(state, fleet.owner).travelSupply);
    if (--m.remaining > 0) continue;
    fleet.planetId = m.target;
    fleet.mission = null;
    if (!arrivals.has(m.group)) arrivals.set(m.group, { m, fleets: [] });
    arrivals.get(m.group).fleets.push(fleet);
  }
  for (const { m, fleets } of arrivals.values()) {
    const target = getPlanet(state, m.target);
    if (target.destroyed) continue;
    if (m.kind === 'analyze') {
      for (const f of fleets) { f.mission = { ...m, phase:'scan', remaining:SCAN_DAYS, total:SCAN_DAYS }; if (f.owner==='player') log(state, `${target.name}: Oberflächenanalyse beginnt (${SCAN_DAYS} Tage).`); }
      continue;
    }
    if (m.kind === 'survey' || m.kind === 'explore') { finishScout(state, m, fleets, target); continue; }
    if(m.kind==='commerce'){for(const f of fleets)finishCommerce(state,f,m,target);continue;}
    for (const f of fleets) visitArrival(state,f,target);
    if(m.kind==='circuit'){for(const f of fleets)arriveCircuit(state,f,m);}
    else if (m.kind === 'settle') {
      const colony = fleets.find(f => f.type === 'colony'); if (colony) settle(state, colony, target);
    } else if (m.kind === 'attack') resolveBattle(state, fleets, target);
    else if (m.kind === 'transport' && m.cargo) {
      if (target.owner === 'player') { target.stock[m.cargo.resource] += m.cargo.amount; log(state, `${target.name}: ${m.cargo.amount} Einheiten Fracht eingetroffen.`, 'success', 'delivery'); }
      else if (state.relations[target.owner]?.trade && !state.relations[target.owner]?.war) {
        const sale=sellGoods(state,target,m.cargo.resource,m.cargo.amount);
        if(sale.amount<m.cargo.amount){const origin=getPlanet(state,m.source);fleets[0].mission={group:uid(state,'unsold'),kind:'return-cargo',source:target.id,target:origin.id,remaining:fleetTravelDays(state,target,origin,fleets),total:fleetTravelDays(state,target,origin,fleets),cargo:{resource:m.cargo.resource,amount:m.cargo.amount-sale.amount}};}
        log(state, `${fleets[0].name}: Fracht auf ${target.name} verkauft.`, 'success', 'delivery');
      } else {
        const home = getPlanet(state, m.source);
        fleets[0].mission = { group: uid(state, 'cargo-return'), kind: 'return-cargo', source: target.id, target: home.id, remaining: fleetTravelDays(state, target, home, fleets), total: fleetTravelDays(state, target, home, fleets), cargo: m.cargo };
        fleets[0].route = null;
        log(state, `${fleets[0].name}: Lieferung abgebrochen, Fracht kehrt zurück.`, 'warning');
      }
    } else if (m.kind === 'return-cargo' && m.cargo) {
      target.stock[m.cargo.resource] += m.cargo.amount;
      log(state, `${target.name}: Fracht zurückgebucht.`);
    }
  }
}
export function tickOpponents(state) {
  for (const p of state.planets.filter(p => p.owner && p.owner !== 'player')) {
    if (state.day % 8 === 0 && p.stock.alloy >= 3 && p.stock.energy >= 4) { p.stock.alloy -= 3; p.stock.energy -= 4; p.defense = Math.min(60, p.defense + 2); }
  }
  if (state.day < state.aiNext) return;
  state.aiNext = state.day + 24;
  const foe = Object.entries(state.relations).find(([id, r]) => r.war && state.planets.some(p => p.owner === id));
  if (!foe) return;
  const source = state.planets.find(p => p.owner === foe[0]);
  const candidates = knownTargets(state,foe[0]).filter(p => p.owner === 'player' && !p.destroyed);
  candidates.sort((a,b) => (a.defense??20)-(b.defense??20) || a.id.localeCompare(b.id));
  const target = getPlanet(state,candidates[0]?.id);
  if (!target || source.stock.alloy < 25 || source.stock.energy < 20) return;
  source.stock.alloy -= 25; source.stock.energy -= 20;
  observePlanet(state,foe[0],target,'combat');
  if(target.owner!=='player')return;
  const guards = state.fleets.filter(f => !f.mission && f.planetId === target.id && f.owner === 'player').reduce((sum, f) => sum + fleetStrength(state, f), 0);
  const strength = 20 + state.day / 20;
  if (guards + target.defense + baseStats(state, target).orbital + baseStats(state, target).fortification >= absorbShield(target, strength)) {
    log(state, `${target.name}: Ein Angriff der ${FACTIONS[foe[0]].name} wurde abgewehrt.`, 'war', 'attack');
    for (const f of state.fleets.filter(f => !f.mission && f.planetId === target.id && f.owner === 'player')) f.hp = Math.max(5, f.hp - 12 * (1 - shipArmor(state, f)));
  } else {
    target.stock.alloy = Math.max(0, target.stock.alloy - 25);
    target.stock.energy = Math.max(0, target.stock.energy - 30);
    target.happiness = Math.max(5, target.happiness - 8);
    log(state, `${target.name}: Feindlicher Überfall. Industrie und Versorgung beschädigt.`, 'war', 'attack');
  }
}
