import { initializeGalaxy, relationBetween } from './realm-relations.js';
import { validateGalaxy } from './realm-save.js';
import { initialFactions } from './foreign.js';
import { SUPPLY_DEFAULTS } from './routing.js';
import { PRIORITIES } from './infrastructure.js';
import { NEW_RESOURCES } from './development-data.js';
import { SOUND_CUES } from './audio.js';
import { EVENTS, initialEventSchedule } from './events.js';
import { initialRelationExtras } from './diplomacy.js';
import { makePlanet } from './state.js';
import { initializeIntelligence, networkSeeds, recordContact } from './intelligence.js';
import { validateExploration } from './exploration-save.js';
import { STRATEGIC_WEAPONS, CAMPAIGN_GOALS } from './military-data.js';
import { technologyEffects } from './technology.js';
import { LAWS, DECISIONS, initialGovernance, normalizeLaws, lawBlock } from './governance.js';
import { SAVE_VERSION, BUILDINGS, SHIPS, IDEOLOGIES, RESOURCE_KEYS, TECHNOLOGIES, PLANET_SEEDS, FACTIONS, SYSTEMS, GRID } from './data.js';
const KEY = 'orbit3077-save';
export function validateSave(value) {
  if ([1, 2].includes(value?.version)) {
    value = structuredClone(value);
    if (value.version === 1) { value.governance = initialGovernance(); value.surveys = []; }
    if (Array.isArray(value.tech)) {
      if (value.tech.some(id => !['fusion', 'lasers', 'propulsion', 'habitats'].includes(id))) throw new Error('Ungültige Forschung im alten Spielstand.');
      const completed = new Set(value.tech);
      for (const id of [...completed, value.research?.id].filter(Boolean)) for (const required of TECHNOLOGIES[id]?.requires ?? []) completed.add(required);
      value.tech = [...completed];
    }
    value.version = 3; value.lastDayReport = null;
  }
  if (value?.version === 3) {
    value = structuredClone(value);
    const legacyIds = PLANET_SEEDS.slice(0, 7).map(p => p.id);
    if (!Array.isArray(value.planets) || ![7, 25, 28, 37, PLANET_SEEDS.length].includes(value.planets.length) || new Set(value.planets.map(p=>p.id)).size !== value.planets.length || legacyIds.some(id=>!value.planets.some(p=>p.id===id)) || value.planets.some(p=>!PLANET_SEEDS.some(q=>q.id===p.id))) throw new Error('Ungültige alte Sternenkarte.');
    for (const p of value.planets) { p.shield = 0; p.destroyed = false; }
    for (const seed of PLANET_SEEDS) if (!value.planets.some(p=>p.id===seed.id)) value.planets.push(makePlanet(seed));
    value.strikes = []; value.destroyedSystems = []; value.milestones = []; value.version = 4;
  }
  if (value?.version === 4) {
    value = structuredClone(value); value.eventSchedule = initialEventSchedule(value.day); value.effects = [];
    for (const r of Object.values(value.relations ?? {})) Object.assign(r, initialRelationExtras());
    value.version = 5;
  }
  if(value?.version===5){
    value=structuredClone(value);
    if(!Array.isArray(value.planets)||![25,28,37,PLANET_SEEDS.length].includes(value.planets.length)||new Set(value.planets.map(p=>p.id)).size!==value.planets.length||PLANET_SEEDS.slice(0,25).some(p=>!value.planets.some(q=>q.id===p.id)))throw new Error('Ungültige alte Sternenkarte.');
    for(const seed of PLANET_SEEDS)if(!value.planets.some(p=>p.id===seed.id)){
      const planet=makePlanet(seed);
      if(value.destroyedSystems.includes(planet.system)){planet.owner=null;planet.population=0;planet.buildings=[];planet.queues=[];planet.shield=0;planet.defense=0;planet.garrison=0;planet.destroyed=true;for(const k of RESOURCE_KEYS)planet.stock[k]=0;}
      value.planets.push(planet);
    }
    for(const p of value.planets){p.priority??='balanced';p.needs??=[];for(const k of Object.keys(NEW_RESOURCES))p.stock[k]??=0;}
    value.factions??=initialFactions();value.contracts??=[];value.tradeLedger??=[];
    if(['ilyri','khepri','aster'].some(id=>!value.relations?.[id]))throw new Error('Ungültige alte diplomatische Beziehungen.');
    for(const id of Object.keys(FACTIONS).filter(id=>id!=='player'))value.relations[id]={...initialRelationExtras(),score:10,war:false,trade:false,...value.relations[id]};
    if(Object.entries(value.governance.laws).some(([id,key])=>!LAWS[id]?.options[key]))throw new Error('Ungültige alte Gesetze.');
    normalizeLaws(value.governance,value.player.ideology);
    const home=value.planets.find(p=>p.owner==='player')?.id;
    for(const f of value.fleets){f.cargo??=Object.fromEntries(RESOURCE_KEYS.map(k=>[k,0]));for(const k of Object.keys(NEW_RESOURCES))f.cargo[k]??=0;f.supplySettings??={...SUPPLY_DEFAULTS,homePort:f.route&&value.planets.find(p=>p.id===f.route.source)?.owner==='player'?f.route.source:home};f.servicing??=false;}
    if(value.lastDayReport?.resources)for(const rates of Object.values(value.lastDayReport.resources))for(const k of Object.keys(NEW_RESOURCES))rates[k]??={recurring:0,oneOff:0};
    value.version=6;
  }
  if(value?.version===6){
    value=structuredClone(value);
    const oldSeeds=networkSeeds().filter(p=>!p.expansion);
    if(!Array.isArray(value.planets)||![oldSeeds.length,37,PLANET_SEEDS.length].includes(value.planets.length)||new Set(value.planets.map(p=>p.id)).size!==value.planets.length||oldSeeds.some(p=>!value.planets.some(q=>q.id===p.id))||value.planets.some(p=>!PLANET_SEEDS.some(q=>q.id===p.id)))throw new Error('Ungültige alte Sternenkarte.');
    for(const seed of PLANET_SEEDS)if(!value.planets.some(p=>p.id===seed.id))value.planets.push(makePlanet(seed));
    initializeIntelligence(value,true);
    value.communications={messages:[],cooldowns:{},nextOffer:value.day+12,cursor:0};
    value.version=7;
  }

  if(value?.version===7){
    value=structuredClone(value);
    const oldSeeds=PLANET_SEEDS.filter(p=>!p.expansion);
    if(!Array.isArray(value.planets)||![37,PLANET_SEEDS.length].includes(value.planets.length)||new Set(value.planets.map(p=>p.id)).size!==value.planets.length||oldSeeds.some(p=>!value.planets.some(q=>q.id===p.id))||value.planets.some(p=>!PLANET_SEEDS.some(q=>q.id===p.id)))throw new Error('Ungültige alte Sternenkarte.');
    for(const seed of PLANET_SEEDS)if(!value.planets.some(p=>p.id===seed.id)){
      const p=makePlanet(seed);
      if(value.destroyedSystems.includes(p.system)){p.owner=null;p.population=0;p.buildings=[];p.queues=[];p.shield=0;p.defense=0;p.garrison=0;p.destroyed=true;for(const key of RESOURCE_KEYS)p.stock[key]=0;}
      value.planets.push(p);
    }
    const defaults=initialFactions();
    const fresh={...value};initializeIntelligence(fresh);
    for(const [id,f] of Object.entries(defaults))if(!value.factions[id]){value.factions[id]=f;f.nextBuild=value.day+30;value.relations[id]={...initialRelationExtras(),score:15,war:false,trade:false};value.intelligence[id]=fresh.intelligence[id];}
    for(const p of value.planets.filter(p=>p.expansion&&p.owner))for(const id of Object.keys(value.intelligence))recordContact(value,id,p);
    for(const p of value.planets)p.localMarket??={cash:Math.min(150,p.population*.6),day:-1,sold:0};
    for(const f of Object.values(value.factions))if(f.governance.laws.administration==='expert')f.governance.laws.administration='experts';
    value.version=8;
  }
  if(value?.version===8){
    value=structuredClone(value);initializeGalaxy(value);
    for(const f of value.fleets??[])if(f.owner!=='player'&&f.mission?.kind==='commerce'&&f.mission.buyer!=='player'){const r=relationBetween(value,f.owner,f.mission.buyer);if(r){r.trade=true;r.score=Math.max(0,r.score);}}
    for(const r of Object.values(value.relations??{})){r.truceUntil??=0;r.warSince??=0;}
    value.version=SAVE_VERSION;
  }
  const finite = (v, min = 0, max = 1e12) => Number.isFinite(v) && v >= min && v <= max;
  const text = (v, max = 100) => typeof v === 'string' && v.length > 0 && v.length <= max;
  const known = (dict, key) => typeof key === 'string' && Object.hasOwn(dict, key);
  const validCargo = (cargo, capacity) => !cargo || RESOURCE_KEYS.includes(cargo.resource) && finite(cargo.amount, 1, capacity);
  if (!value || value.version !== SAVE_VERSION || !Array.isArray(value.planets) || value.planets.length !== PLANET_SEEDS.length || !Array.isArray(value.fleets) || value.fleets.length > 2000) throw new Error('Unbekanntes Spielstandformat.');
  if (!Number.isInteger(value.day) || !finite(value.day, 0, 1e6) || !finite(value.credits,-1e12) || !finite(value.science) || !Number.isInteger(value.nextId) || !finite(value.nextId, 1) || typeof value.started !== 'boolean' || !known(IDEOLOGIES, value.player?.ideology) || !text(value.player.name, 32) || !finite(value.player.tax, 0, .5) || !finite(value.player.stability, 0, 100) || !finite(value.player.rulingSupport, 0, 100) || !finite(value.player.term) || !finite(value.aiNext)) throw new Error('Der Spielstand enthält ungültige Werte.');
  const g = value.governance;
  if (!g || !g.laws || Object.keys(g.laws).length !== Object.keys(LAWS).length || Object.entries(LAWS).some(([id, law]) => !known(law.options, g.laws[id]) || Boolean(lawBlock(value,id,g.laws[id]))) || !finite(g.lawReady, 0, value.day + 5) || !Array.isArray(g.decisions) || g.decisions.length > Object.keys(DECISIONS).length || new Set(g.decisions.map(d => d.id)).size !== g.decisions.length || g.decisions.some(d => !known(DECISIONS, d.id) || DECISIONS[d.id].ideologies&&!DECISIONS[d.id].ideologies.includes(value.player.ideology) || DECISIONS[d.id].requiredTech&&!value.tech.includes(DECISIONS[d.id].requiredTech) || !finite(d.until, value.day, value.day + DECISIONS[d.id].duration)) || !g.cooldowns || typeof g.cooldowns !== 'object' || Array.isArray(g.cooldowns) || Object.entries(g.cooldowns).some(([id, until]) => !known(DECISIONS, id) || !finite(until, 0, value.day + DECISIONS[id].cooldown))) throw new Error('Ungültige Regierungspolitik.');
  if (!Array.isArray(value.surveys) || new Set(value.surveys).size !== value.surveys.length || value.surveys.some(id => !PLANET_SEEDS.some(p => p.id === id))) throw new Error('Ungültige Erkundungsdaten.');
  if (!Array.isArray(value.tech) || value.tech.length > Object.keys(TECHNOLOGIES).length || new Set(value.tech).size !== value.tech.length || value.tech.some(t => !known(TECHNOLOGIES, t))) throw new Error('Ungültige Forschung.');
  if (value.tech.some(id => TECHNOLOGIES[id].requires.some(required => !value.tech.includes(required)) || TECHNOLOGIES[id].requiresAny && !TECHNOLOGIES[id].requiresAny.some(required => value.tech.includes(required)) || (TECHNOLOGIES[id].excludes ?? []).some(other => value.tech.includes(other)))) throw new Error('Ungültige Forschungsabhängigkeiten.');
  if (value.research && (!known(TECHNOLOGIES, value.research.id) || !Number.isInteger(value.research.total) || !finite(value.research.total, 2, 30) || !Number.isInteger(value.research.remaining) || !finite(value.research.remaining, 1, value.research.total) || value.tech.includes(value.research.id) || TECHNOLOGIES[value.research.id].requires.some(required => !value.tech.includes(required)) || TECHNOLOGIES[value.research.id].requiresAny && !TECHNOLOGIES[value.research.id].requiresAny.some(required => value.tech.includes(required)) || (TECHNOLOGIES[value.research.id].excludes ?? []).some(other => value.tech.includes(other)))) throw new Error('Ungültiger Forschungsauftrag.');
  for (const id of Object.keys(FACTIONS).filter(id => id !== 'player')) {
    const rel = value.relations?.[id];
    if (!rel || !finite(rel.score, -100, 100) || typeof rel.war !== 'boolean' || typeof rel.trade !== 'boolean' || typeof rel.cooperation !== 'boolean' || typeof rel.embargo !== 'boolean' || ['portAccess','researchPact','defensePact'].some(k=>typeof rel[k]!=='boolean') || (rel.war||rel.embargo||!rel.trade)&&['portAccess','researchPact','defensePact'].some(k=>rel[k]) || !finite(rel.pactUntil,0,value.day+180) || !finite(rel.envoyReady,0,value.day+10) || !finite(rel.aidReady,0,value.day+60) || !finite(rel.truceUntil,0,value.day+180) || !finite(rel.warSince,0,value.day) || rel.war && (rel.trade || rel.cooperation || rel.pactUntil>value.day) || rel.embargo && (rel.trade || rel.cooperation) || rel.cooperation && !rel.trade) throw new Error('Ungültige diplomatische Beziehungen.');
  }
  if (Object.keys(value.relations).length !== Object.keys(FACTIONS).length-1 || !Array.isArray(value.logs) || value.logs.length > 60 || value.logs.some(e => !finite(e.day, 0, value.day) || !text(e.text, 600) || !text(e.type, 24) || e.sound != null && !SOUND_CUES.includes(e.sound))) throw new Error('Ungültiges Kommandoprotokoll.');
  const ids = new Set();
  for (const p of value.planets) {
    if (!finite(p.shield) || typeof p.destroyed !== 'boolean' || p.destroyed && (p.owner !== null || p.population !== 0 || p.buildings?.length || p.queues?.length || p.shield !== 0) || !PLANET_SEEDS.some(seed => seed.id === p.id) || ids.has(p.id) || !text(p.name, 64) || !SYSTEMS.some(s => s.id === p.system) || (p.owner !== null && !known(FACTIONS, p.owner)) || !finite(p.population) || !finite(p.happiness, 0, 100) || !finite(p.defense) || !finite(p.garrison) || !finite(p.aliens, 0, 1) || !finite(p.oreFactor, .1, 10) || !finite(p.solarFactor, .1, 10) || !Number.isInteger(p.seed) || !finite(p.orbit, 0, 4) || !text(p.kind, 40) || !/^#[a-f0-9]{6}$/i.test(p.color) || !Array.isArray(p.buildings) || p.buildings.length > GRID.width * GRID.height || !Array.isArray(p.queues) || p.queues.length > 3) throw new Error('Ungültiger Planet.');
    if(p.localMarket!=null&&(typeof p.localMarket!=='object'||Array.isArray(p.localMarket)||!finite(p.localMarket.cash,0,200)||!Number.isInteger(p.localMarket.day)||!finite(p.localMarket.day,-1,value.day)||!finite(p.localMarket.sold,0,50)))throw new Error('Ungültiger örtlicher Markt.');
    if(!known(PRIORITIES,p.priority)||!Array.isArray(p.needs)||new Set(p.needs).size!==p.needs.length||p.needs.some(k=>!['goods','medicine'].includes(k)))throw new Error('Ungültige planetare Versorgung.');
    ids.add(p.id);
    if(p.lastReport){for(const field of ['demandByResource','productionByResource'])if(p.lastReport[field]&&(typeof p.lastReport[field]!=='object'||Object.entries(p.lastReport[field]).some(([key,v])=>!RESOURCE_KEYS.includes(key)||!finite(v))))throw new Error('Ungültige Produktionsabrechnung.');if(p.lastReport.missingResources&&(!Array.isArray(p.lastReport.missingResources)||p.lastReport.missingResources.some(k=>!RESOURCE_KEYS.includes(k))))throw new Error('Ungültige Engpässe.');}
    for (const k of RESOURCE_KEYS) if (!Number.isFinite(p.stock?.[k]) || p.stock[k] < 0) throw new Error('Ungültiger Warenbestand.');
    const tiles = new Set(), buildings = new Set();
    for (const b of p.buildings) {
      if (!known(BUILDINGS, b.type) || !text(b.id, 64) || buildings.has(b.id) || !Number.isInteger(b.x) || !finite(b.x, 0, GRID.width - 1) || !Number.isInteger(b.y) || !finite(b.y, 0, GRID.height - 1) || !finite(b.remaining, 0, 30) || typeof b.enabled !== 'boolean' || !text(b.status, 64) || tiles.has(`${b.x},${b.y}`)) throw new Error('Ungültiges Gebäude.');
      if(BUILDINGS[b.type].unique&&p.buildings.filter(q=>q.type===b.type).length>BUILDINGS[b.type].unique)throw new Error('Zu viele einzigartige Anlagen.');
      buildings.add(b.id); tiles.add(`${b.x},${b.y}`);
    }
    for (const q of p.queues) if (!known(SHIPS, q.type) || !finite(q.remaining, 1, 30) || !text(q.id, 64)) throw new Error('Ungültiger Werftauftrag.');
  }
  if (!Array.isArray(value.destroyedSystems) || new Set(value.destroyedSystems).size !== value.destroyedSystems.length || value.destroyedSystems.some(id => !SYSTEMS.some(s=>s.id===id) || value.planets.some(p=>p.system===id&&!p.destroyed))) throw new Error('Ungültige zerstörte Systeme.');
  if (!Array.isArray(value.milestones) || new Set(value.milestones).size !== value.milestones.length || value.milestones.some(id=>!CAMPAIGN_GOALS.some(g=>g.id===id))) throw new Error('Ungültige Meilensteine.');
  if (!Array.isArray(value.strikes) || value.strikes.length > 200 || new Set(value.strikes.map(s=>s.id)).size !== value.strikes.length || value.strikes.some(s=>!text(s.id,64) || !known(STRATEGIC_WEAPONS,s.type) || !known(FACTIONS,s.owner) || !ids.has(s.source) || !ids.has(s.target) || s.source === s.target || !text(s.facilityId,64) || !['charge','flight'].includes(s.phase) || !Number.isInteger(s.remaining) || !finite(s.remaining,1,s.total) || !Number.isInteger(s.total) || !finite(s.total,1,100) || !Number.isInteger(s.flight) || !finite(s.flight,1,30))) throw new Error('Ungültiger Fernangriff.');
  const fleetIds = new Set();
  for (const f of value.fleets) {
    if (!known(SHIPS, f.type) || !ids.has(f.planetId) || !text(f.id, 64) || fleetIds.has(f.id) || !text(f.name, 64) || !known(FACTIONS, f.owner) || !finite(f.hp, 0, 100) || !finite(f.supply, 0, 100)) throw new Error('Ungültige Flotte.');
    fleetIds.add(f.id);
    if((f.mission?.cargo?.amount??0)+Object.values(f.cargo??{}).reduce((n,v)=>n+v,0)>Math.floor(SHIPS[f.type].cargo*technologyEffects(value,f.owner).cargoCapacity)+.000001)throw new Error('Überladener Frachtraum.');
    const m = f.mission, r = f.route;
    if (m && (!ids.has(m.target) || !ids.has(m.source) || m.target === m.source || !finite(m.remaining, 1, m.total) || !finite(m.total, 1, 100) || !text(m.group, 64) || !['move', 'settle', 'attack', 'transport', 'return-cargo', 'survey','explore','analyze','circuit','commerce','resupply'].includes(m.kind) || !validCargo(m.cargo, Math.floor(SHIPS[f.type].cargo * technologyEffects(value,f.owner).cargoCapacity)))) throw new Error('Ungültiger Flottenauftrag.');
    if(m?.kind==='commerce'&&(f.owner==='player'||f.type!=='freighter'||!known(FACTIONS,m.buyer)||m.buyer==='player'||m.buyer===f.owner||!m.cargo))throw new Error('Ungültige fremde Handelslieferung.');
    if(m?.kind==='resupply'&&(f.owner==='player'||f.type!=='freighter'||m.buyer!==f.owner||!m.cargo))throw new Error('Ungültige eigene Versorgungslieferung.');
    if(f.tradeReady!=null&&!finite(f.tradeReady,0,value.day+20))throw new Error('Ungültige Handelsplanung.');
    if(m?.kind==='analyze'&&(f.type!=='probe'||m.phase!=null&&m.phase!=='scan'||m.phase==='scan'&&f.planetId!==m.target)||m?.kind==='explore'&&f.type!=='scout')throw new Error('Ungültiger Erkundungsauftrag.');
    if (m?.kind==='circuit'&&(!Number.isInteger(m.stopIndex)||!finite(m.stopIndex,0,7)))throw new Error('Ungültiger Routenstopp.');
    if(f.cargo!=null&&(typeof f.cargo!=='object'||Array.isArray(f.cargo)||Object.keys(f.cargo).length!==RESOURCE_KEYS.length||RESOURCE_KEYS.some(k=>!finite(f.cargo[k]))||Object.values(f.cargo).reduce((n,v)=>n+v,0)>SHIPS[f.type].cargo*technologyEffects(value,f.owner).cargoCapacity+.000001))throw new Error('Ungültige Bordfracht.');
    if(f.supplySettings){const s=f.supplySettings;if(!['threshold','target','repairBelow','repairTo'].every(k=>finite(s[k],0,100))||s.target<=s.threshold||s.repairTo<=s.repairBelow||value.planets.find(p=>p.id===s.homePort)?.owner!==f.owner||typeof s.smart!=='boolean')throw new Error('Ungültige Versorgungseinstellungen.');}
    if(f.servicing!=null&&typeof f.servicing!=='boolean'||f.repairing!=null&&typeof f.repairing!=='boolean'||f.pauseReason!=null&&(typeof f.pauseReason!=='string'||f.pauseReason.length>180))throw new Error('Ungültiger Wartungszustand.');
    if(r?.type==='circuit')validateCircuit(value,f,r,ids);
    if (r && r.type!=='circuit' && (!SHIPS[f.type].cargo || !ids.has(r.source) || !ids.has(r.target) || r.source === r.target || !RESOURCE_KEYS.includes(r.resource) || r.reserve!=null&&!finite(r.reserve) || !finite(r.amount, 1, Math.floor(SHIPS[f.type].cargo * technologyEffects(value,f.owner).cargoCapacity)))) throw new Error('Ungültige Handelsroute.');
  }
  validateDevelopment(value,ids);
  validateExploration(value,ids);
  validateGalaxy(value,ids);
  if (value.event && (!known(EVENTS,value.event.kind) || !ids.has(value.event.planet))) throw new Error('Ungültige Meldung.');
  const schedule = value.eventSchedule;
  if (!schedule || !Number.isInteger(schedule.nextDay) || !finite(schedule.nextDay,0,value.day+145) || !Number.isInteger(schedule.counter) || !finite(schedule.counter,0,1e6) || !Array.isArray(schedule.history) || schedule.history.length>4 || new Set(schedule.history).size!==schedule.history.length || schedule.history.some(id=>!known(EVENTS,id))) throw new Error('Ungültiger Ereignisplan.');
  if (!Array.isArray(value.effects) || value.effects.length>value.planets.length*2 || new Set(value.effects.map(e=>`${e.id}:${e.planet}`)).size!==value.effects.length || value.effects.some(e=>!['energyHarvest','factoryUpgrade'].includes(e.id) || !ids.has(e.planet) || !Number.isInteger(e.until) || !finite(e.until,value.day,value.day+45))) throw new Error('Ungültiger Ereigniseffekt.');
  if (value.lastDayReport != null) {
    const b = value.lastDayReport;
    if (!finite(b.day, 0, value.day) || !['income', 'buildings', 'fleets', 'science', 'unfunded'].every(k => finite(b[k])) || !['net', 'actual', 'oneOff'].every(k => finite(b[k], -1e12, 1e12)) || !b.resources || Object.entries(b.resources).some(([id, rates]) => !ids.has(id) || RESOURCE_KEYS.some(k => !finite(rates[k]?.recurring, -1e12, 1e12) || !finite(rates[k]?.oneOff, -1e12, 1e12)))) throw new Error('Ungültige Haushaltsabrechnung.');
  }
  return value;
}
export function loadGame(storage = globalThis.localStorage) { const raw = storage.getItem(KEY); return raw ? validateSave(JSON.parse(raw)) : null; }
export function saveGame(state, storage = globalThis.localStorage) { storage.setItem(KEY, JSON.stringify(state)); }
export function parseImport(raw) { return validateSave(JSON.parse(raw)); }
export const exportGame = state => JSON.stringify(state, null, 2);

function validateCircuit(state,f,r,ids){
 const finite=v=>Number.isFinite(v)&&v>=0&&v<=1e9;
 if(!f.cargo||!Array.isArray(r.stops)||r.stops.length<2||r.stops.length>8||!Number.isInteger(r.index)||r.index<0||r.index>=r.stops.length||typeof r.processed!=='boolean'||!finite(r.interval)||r.interval>120||!finite(r.nextReady)||r.nextReady>state.day+120||!finite(r.lastCycle)||r.lastCycle>state.day)throw new Error('Ungültiger Handelskreislauf.');
 for(let i=0;i<r.stops.length;i++){
  const s=r.stops[i];if(!ids.has(s.planet)||s.planet===r.stops[(i+1)%r.stops.length].planet||!Array.isArray(s.actions)||s.actions.length>8)throw new Error('Ungültiger Handelsstopp.');
  for(const a of s.actions)if(!['load','unload','buy','sell'].includes(a.kind)||!RESOURCE_KEYS.includes(a.resource)||!finite(a.amount)||a.amount<1||a.amount>Math.floor(SHIPS[f.type].cargo*technologyEffects(state,f.owner).cargoCapacity)||!finite(a.reserve)||!finite(a.minPrice)||!finite(a.maxPrice))throw new Error('Ungültiger Warenauftrag.');
 }
 if(f.mission?.kind==='circuit'&&r.stops[f.mission.stopIndex]?.planet!==f.mission.target)throw new Error('Ungültiger Anflugstopp.');
}
function validateDevelopment(state,ids){
 const finite=(v,min=0,max=1e12)=>Number.isFinite(v)&&v>=min&&v<=max;
 if(!state.factions||Object.keys(state.factions).length!==Object.keys(FACTIONS).length-1)throw new Error('Ungültige fremde Reiche.');
 for(const id of Object.keys(FACTIONS).filter(id=>id!=='player')){
  const f=state.factions[id],g=f?.governance;
  if(!f||!finite(f.credits,-1e12)||!finite(f.science)||!finite(f.nextBuild,0,state.day+60)||!Array.isArray(f.tech)||new Set(f.tech).size!==f.tech.length||f.tech.some(key=>!TECHNOLOGIES[key]||TECHNOLOGIES[key].requires.some(q=>!f.tech.includes(q))||(TECHNOLOGIES[key].excludes??[]).some(q=>f.tech.includes(q))||TECHNOLOGIES[key].requiresAny&&!TECHNOLOGIES[key].requiresAny.some(q=>f.tech.includes(q)))||!g||Object.keys(g.laws??{}).length!==Object.keys(LAWS).length||Object.entries(LAWS).some(([key,law])=>!law.options[g.laws[key]]||law.options[g.laws[key]].ideologies&&!law.options[g.laws[key]].ideologies.includes(FACTIONS[id].ideology)||law.options[g.laws[key]].requiredTech&&!f.tech.includes(law.options[g.laws[key]].requiredTech)))throw new Error('Ungültige fremde Wirtschaft oder Forschung.');
  if(!finite(g.lawReady,0,state.day+5)||!Array.isArray(g.decisions)||g.decisions.length||!g.cooldowns||Object.keys(g.cooldowns).length)throw new Error('Ungültige fremde Regierungspolitik.');
  if(f.research&&(!TECHNOLOGIES[f.research.id]||f.tech.includes(f.research.id)||!Number.isInteger(f.research.remaining)||!finite(f.research.remaining,1,45)||TECHNOLOGIES[f.research.id].requires.some(q=>!f.tech.includes(q))||(TECHNOLOGIES[f.research.id].excludes??[]).some(q=>f.tech.includes(q))||TECHNOLOGIES[f.research.id].requiresAny&&!TECHNOLOGIES[f.research.id].requiresAny.some(q=>f.tech.includes(q))))throw new Error('Ungültige fremde Forschung.');
 }
 if(!Array.isArray(state.contracts)||state.contracts.length>20||new Set(state.contracts.map(c=>c.id)).size!==state.contracts.length||state.contracts.some(c=>!ids.has(c.planet)||!state.factions[c.faction]||!RESOURCE_KEYS.includes(c.resource)||typeof c.id!=='string'||!c.id.length||c.id.length>64||!finite(c.quantity,1,2000)||!finite(c.price,.001,1e6)||!finite(c.delivered,0,c.quantity+.000001)||!finite(c.escrow,0,c.quantity*c.price+.000001)||!finite(c.periodStart,0,state.day)||!finite(c.until,state.day,state.day+180)||!Number.isInteger(c.fulfilled)||!finite(c.fulfilled,0,6)))throw new Error('Ungültige Lieferverträge.');
 if(!Array.isArray(state.tradeLedger)||state.tradeLedger.length>40||state.tradeLedger.some(e=>!finite(e.day,0,state.day)||!ids.has(e.planet)||!RESOURCE_KEYS.includes(e.resource)||!finite(e.amount)||!finite(e.revenue)||!finite(e.cost)))throw new Error('Ungültige Handelsabrechnung.');
}
