import { resourcePages } from './hud.js';
import { SUPPLY_DEFAULTS, configureSupply, serviceFleet, unloadCargo, startCircuit } from './routing.js';
import { defaultCircuit, circuitPlanets } from './circuit-ui.js';
import { createContract, cancelContract } from './trade.js';
import { marketSelection } from './market-ui.js';
import { setProductionPriority } from './infrastructure.js';
import { SpaceAudio } from './audio.js';
import { routeSelection } from './trade-ui.js';
import { launchStrike, cancelStrike } from './strategic.js';
import { STRATEGIC_WEAPONS } from './military-data.js';
import { TECHNOLOGIES } from './technology-data.js';
import { forecastDay } from './budget.js';
import { enactLaw, decide } from './governance.js';
import { createGame, getPlanet, ownedPlanets, log } from './state.js';
import { placeBuilding, demolish } from './economy.js';
import { changeGovernment, diplomaticAction } from './politics.js';
import { buildShip, orderFleet } from './fleets.js';
import { startResearch } from './research.js';
import { stepDay, resolveEvent } from './simulation.js';
import { loadGame, saveGame, parseImport, exportGame } from './save.js';
import { MapRenderer } from './map.js';
import { icon } from './icons.js';
import { renderHeader, renderResources, renderMapHead, renderMapFoot, renderNavigation, renderSheet, welcomeMarkup } from './ui.js';

let state, storageError = false;
try { state = loadGame() ?? createGame(); } catch (e) { state = createGame(); storageError = true; }
const audio = new SpaceAudio();
const ui = {
  audioSettings: audio.settings, resourcePage: 0, buildCategory: null,routeMode:'simple',routeDraft:null,tradeReserve:40,contractAmount:40,
  view: 'planet', planetId: 'nereid', systemId: 'helios', panel: null, expanded: false, speed: 0, lastSpeed: 1,
  buildType: null, buildTile: null, detailType: 'farm', selectedBuilding: null, fleetIds: [],
  fleetTarget: 'cinder', routeTarget: 'thalassa', routeFleet: 'starter-f', cargo: 'ore', amount: 40, repeat: true,
  researchBranch: 'energy', economyMode: 'production', politicsMode: 'government', fleetMode: 'orders', government: state.player.ideology,
  hints: true, demolishConfirm: null, warConfirm: null, resetConfirm: false
};
const $ = id => document.getElementById(id);
const map = new MapRenderer($('map'), state, ui, hit => {
  if (!state.started) return;
  if (hit.kind === 'system') { ui.systemId = hit.id; ui.view = 'system'; ui.panel = null; }
  else if (hit.kind === 'planet') { ui.planetId = hit.id; ui.systemId = getPlanet(state, hit.id).system; ui.panel = 'planet-info'; ui.expanded = false; }
  else if (hit.kind === 'tile') {
    if (ui.buildType) { ui.buildTile = { x: hit.tx, y: hit.ty }; }
    else {
      const b = currentPlanet().buildings.find(b => b.x === hit.tx && b.y === hit.ty);
      if (b) { ui.selectedBuilding = b.id; ui.panel = 'building'; ui.expanded = false; }
    }
  }
  render();
});
$('recenter').innerHTML = icon('target', 18);
function currentPlanet() { return getPlanet(state, ui.planetId); }
function toast(message, error = false) {
  const el = $('toast'); el.textContent = message; el.classList.toggle('error', error); el.classList.add('visible');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('visible'), 3800);
}
function persist() {
  try { saveGame(state); }
  catch { if (!storageError) { storageError = true; toast('Automatisches Speichern ist in diesem Browser nicht verfügbar. Sichere deinen Spielstand als Datei.', true); } }
}
function act(result, success) { audio.play(result?'error':'confirm'); if (result) toast(result, true); else { if (success) toast(success); persist(); } render(); }
function render() {
  if (currentPlanet().destroyed) {
    ui.buildType = null; ui.buildTile = null;
    if (['build', 'build-detail', 'building', 'economy', 'fleet'].includes(ui.panel)) ensureOwned();
  }
  ui.audioSettings = audio.settings;
  ui.projection = forecastDay(state);
  map.state = state;
  $('header').innerHTML = renderHeader(state, ui);
  $('resources').innerHTML = renderResources(state, ui);
  const pages=resourcePages(state,currentPlanet());ui.resourcePage%=pages.length;$('resources').setAttribute('aria-label',`${pages[ui.resourcePage].name}: antippen für ${pages[(ui.resourcePage+1)%pages.length].name}`);
  $('map-head').innerHTML = renderMapHead(state, ui);
  $('map-foot').innerHTML = renderMapFoot(state, ui);
  $('navigation').innerHTML = renderNavigation(ui);
  const sheet = $('sheet');
  const oldScroll = sheet.querySelector('.sheet-content')?.scrollTop ?? 0;
  const openTech = [...sheet.querySelectorAll('details[data-tech-id][open]')].map(el => el.dataset.techId);
  const activeField = document.activeElement?.dataset.field;
  const selectionStart = document.activeElement?.selectionStart;
  sheet.hidden = !ui.panel; sheet.classList.toggle('expanded', ui.expanded);
  if (ui.panel) {
    sheet.innerHTML = renderSheet(state, ui);
    for (const id of openTech) { const card = sheet.querySelector(`[data-tech-id="${id}"]`); if (card) card.open = true; }
    sheet.querySelector('.sheet-content').scrollTop = oldScroll;
    if (ui.focusTech) { const card = sheet.querySelector(`[data-tech-id="${ui.focusTech}"]`); if (card) { card.open = true; card.scrollIntoView({ block: 'center' }); } ui.focusTech = null; }
    if (activeField) {
      const input = sheet.querySelector(`[data-field="${activeField}"]`);
      input?.focus({ preventScroll: true });
      if (selectionStart != null && ['text','search','tel','url','password'].includes(input?.type)) input?.setSelectionRange(selectionStart, selectionStart);
    }
  }
  $('welcome').hidden = state.started;
  if (!state.started && !$('welcome').innerHTML) $('welcome').innerHTML = welcomeMarkup();
}
function panel(name) { ui.panel = name; ui.expanded = false; ui.buildType = null; ui.buildTile = null; ui.demolishConfirm = null; ui.warConfirm = null; ui.resetConfirm = false; }
function ensureOwned() { if (currentPlanet().owner !== 'player') { ui.planetId = ownedPlanets(state)[0]?.id ?? 'nereid'; ui.systemId = currentPlanet().system; } }
function selectedTarget(field) { const el = document.querySelector(`[data-field="${field}"]`); return el?.value ?? ui[field]; }
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el || el.disabled) return;
  void audio.unlock();
  const action = el.dataset.action, p = currentPlanet();
  if (action === 'start') { state.started = true; ui.speed = 1; persist(); }
  else if (action === 'resource-toggle') { ui.resourcePage=(ui.resourcePage+1)%resourcePages(state,p).length; }
  else if (action === 'audio-test') { void audio.unlock().then(()=>audio.play('research')); }
  else if (action === 'build-category') { ui.buildCategory = el.dataset.category; $('sheet').querySelector('.sheet-content').scrollTop = 0; }
  else if (action === 'build-categories') { ui.buildCategory = null; $('sheet').querySelector('.sheet-content').scrollTop = 0; }
  else if (action === 'trade-open') { ensureOwned(); panel('economy'); ui.economyMode='routes'; ui.routeTarget=state.planets.find(q=>q.owner===el.dataset.faction)?.id; ui.expanded=true; }
  else if (action === 'shipyard-open') { ensureOwned(); panel('fleet'); ui.fleetMode='shipyard'; }
  else if (action === 'speed-toggle') { if (ui.speed) { ui.lastSpeed = ui.speed; ui.speed = 0; } else ui.speed = ui.lastSpeed; accumulator = 0; }
  else if (action === 'speed') { ui.lastSpeed = ({ 1: 2, 2: 4, 4: 1 })[ui.speed || ui.lastSpeed]; if (ui.speed) ui.speed = ui.lastSpeed; accumulator = 0; }
  else if (action === 'nav') { if (['build', 'economy'].includes(el.dataset.panel) || el.dataset.panel === 'fleet' && ['shipyard', 'bases', 'arsenal'].includes(ui.fleetMode)) ensureOwned(); panel(el.dataset.panel === 'map' || ui.panel === el.dataset.panel ? null : el.dataset.panel); if (ui.panel === 'build') ui.view = 'planet'; }
  else if (action === 'close') { panel(null); }
  else if (action === 'expand') ui.expanded = !ui.expanded;
  else if (action === 'settings') { ui.speed = 0; panel('settings'); ui.expanded = true; }
  else if (action === 'view') { ui.view = el.dataset.view; ui.systemId = p.system; panel(null); }
  else if (action === 'recenter') map.resetCamera();
  else if (action === 'home') { ensureOwned(); ui.view = 'planet'; panel(null); }
  else if (action === 'surface') { ui.view = 'planet'; panel(null); }
  else if (action === 'build') { ensureOwned(); panel('build'); }
  else if (action === 'build-detail') { ensureOwned(); panel('build-detail'); ui.detailType = el.dataset.type; }
  else if (action === 'build-start') { panel(null); ui.view = 'planet'; ui.buildType = el.dataset.type; }
  else if (action === 'build-cancel') { ui.buildType = null; ui.buildTile = null; }
  else if (action === 'build-place') {
    if (!ui.buildTile) return;
    const error = placeBuilding(state, p, ui.buildType, ui.buildTile.x, ui.buildTile.y);
    if (!error) { ui.buildType = null; ui.buildTile = null; }
    return act(error, 'Bauauftrag erteilt.');
  } else if (action === 'building-toggle') {
    const b = p.buildings.find(b => b.id === el.dataset.id);
    if (b && p.owner === 'player' && b.remaining <= 0) { b.enabled = !b.enabled; b.status = b.enabled ? 'wartet auf Versorgung' : 'pausiert'; persist(); }
  } else if (action === 'inspect-building') { ui.selectedBuilding = el.dataset.id; panel('building'); }
  else if (action === 'demolish') {
    if (ui.demolishConfirm !== el.dataset.id) ui.demolishConfirm = el.dataset.id;
    else { const error = demolish(state, p, el.dataset.id); if (!error) panel('build'); return act(error, 'Anlage abgebaut.'); }
  } else if (action === 'subtab') { ui[el.dataset.field] = el.dataset.value; if (el.dataset.field === 'economyMode' && el.dataset.value === 'research') ui.expanded = true; if (el.dataset.field === 'fleetMode' && ['shipyard', 'bases', 'arsenal'].includes(el.dataset.value)) ensureOwned(); }
  else if (action === 'research') { ensureOwned(); panel('economy'); ui.economyMode = 'research'; ui.expanded = true; }
  else if (action === 'research-branch') { ui.researchBranch = el.dataset.id; $('sheet').querySelector('.sheet-content').scrollTop = 0; }
  else if (action === 'research-focus') { ui.researchBranch = TECHNOLOGIES[el.dataset.id]?.branch ?? 'energy'; ui.focusTech = el.dataset.id; $('sheet').querySelector('.sheet-content').scrollTop = 0; }
  else if (action === 'research-start') return act(startResearch(state, el.dataset.tech), 'Forschungsprojekt gestartet.');
  else if (action === 'tax') { state.player.tax = Number(el.dataset.tax); persist(); }
  else if (action === 'law-enact') return act(enactLaw(state, el.dataset.category, el.dataset.choice), 'Gesetz verabschiedet.');
  else if (action === 'government-decision') return act(decide(state, el.dataset.id), 'Regierungsbeschluss erlassen.');
  else if (action === 'government-change') return act(changeGovernment(state, ui.government), 'Neue Regierung eingesetzt.');
  else if (action === 'diplomacy-open') { panel('politics'); ui.politicsMode = 'diplomacy';if(p.owner&&p.owner!=='player')ui.diplomacyFaction=p.owner; }
  else if (action === 'diplomacy') return act(diplomaticAction(state, el.dataset.faction, el.dataset.kind), 'Diplomatische Aktion ausgeführt.');
  else if (action === 'war-confirm') {
    if (ui.warConfirm !== el.dataset.faction) ui.warConfirm = el.dataset.faction;
    else { ui.warConfirm = null; return act(diplomaticAction(state, el.dataset.faction, 'war'), 'Krieg erklärt.'); }
  } else if (action === 'fleet') { panel('fleet'); ui.fleetMode = 'shipyard'; ensureOwned(); }
  else if (action === 'arsenal-open') { panel('fleet'); ui.fleetMode = 'arsenal'; ensureOwned(); }
  else if (action === 'strike-cancel') return act(cancelStrike(state, el.dataset.id), 'Ladeauftrag abgebrochen.');
  else if (action === 'strike-launch') {
    const {type, source, target} = el.dataset, key = `${type}:${source}:${target}`;
    const w = STRATEGIC_WEAPONS[type];
    if ((w.planetKiller || w.starKiller) && ui.strikeConfirm !== key) { ui.strikeConfirm = key; render(); return; }
    const error = launchStrike(state, source, target, type, {confirmed: ui.strikeConfirm === key}); ui.strikeConfirm = null; return act(error, 'Waffenladung begonnen.');
  }
  else if(action==='diplomacy-focus'){ui.diplomacyFaction=el.dataset.faction;}
  else if(action==='supply-open'){
    const f=state.fleets.find(f=>f.id===el.dataset.id);if(f){const values={...SUPPLY_DEFAULTS,...f.supplySettings};ui.supplyFleet=f.id;ui.supplyThreshold=values.threshold;ui.supplyTarget=values.target;ui.repairBelow=values.repairBelow;ui.repairTo=values.repairTo;ui.supplyHome=values.homePort;ui.supplySmart=values.smart;}ui.expanded=true;
  }
  else if(action==='supply-apply')return act(configureSupply(state,el.dataset.id,{threshold:Number(selectedTarget('supplyThreshold')),target:Number(selectedTarget('supplyTarget')),repairBelow:Number(selectedTarget('repairBelow')),repairTo:Number(selectedTarget('repairTo')),homePort:selectedTarget('supplyHome'),smart:Boolean(ui.supplySmart)}),'Versorgungseinstellungen gespeichert.');
  else if(action==='supply-now')return act(serviceFleet(state,el.dataset.id),'Versorgung angefordert.');
  else if(action==='cargo-unload')return act(unloadCargo(state,el.dataset.id),'Fracht entladen.');
  else if(action.startsWith('circuit-')){
    const q=routeSelection(state,ui,p);if(!q.f||!q.target)return toast('Es fehlen ein freier Frachter und ein erreichbares Ziel.',true);
    ui.routeDraft??=defaultCircuit(state,p,q.target,Math.min(40,q.capacity),q.resource);
    const i=Number(el.dataset.index),j=Number(el.dataset.order);
    if(action==='circuit-add-stop'){const choices=circuitPlanets(state),last=ui.routeDraft.stops.at(-1).planet;const next=choices.find(p=>p.id!==last&&p.id!==ui.routeDraft.stops[0].planet);if(!next)return toast('Erschließe einen weiteren Handelspartner oder eine Kolonie.',true);ui.routeDraft.stops.push({planet:next.id,actions:[]});}
    else if(action==='circuit-remove-stop')ui.routeDraft.stops.splice(i,1);
    else if(action==='circuit-add-action'){const stop=ui.routeDraft.stops[i];stop.actions.push({kind:getPlanet(state,stop.planet).owner==='player'?'load':'sell',resource:'ore',amount:Math.min(40,q.capacity),reserve:0,minPrice:0,maxPrice:1000000});}
    else if(action==='circuit-remove-action')ui.routeDraft.stops[i].actions.splice(j,1);
    else if(action==='circuit-start'){const result=startCircuit(state,q.f.id,ui.routeDraft);if(!result){ui.routeDraft=null;ui.routeMode='simple';}return act(result,'Handelskreislauf eingerichtet.');}
  }
  else if(action==='contract-create'){const {p:target}=marketSelection(state,ui);return act(createContract(state,target?.id,selectedTarget('contractResource'),Number(selectedTarget('contractAmount'))),'Liefervertrag abgeschlossen.');}
  else if(action==='contract-cancel')return act(cancelContract(state,el.dataset.id),'Liefervertrag beendet.');
  else if (action === 'ship-build') return act(buildShip(state, p, el.dataset.type), 'Werftauftrag erteilt.');
  else if (action === 'fleet-order') {
    const error = orderFleet(state, ui.fleetIds, selectedTarget('fleetTarget'), el.dataset.kind);
    if (!error) ui.fleetIds = [];
    return act(error, 'Flottenbefehl erteilt.');
  } else if (action === 'route-start') { const q=routeSelection(state,ui,p); return act(orderFleet(state,[q.f?.id],q.target?.id,'transport',{resource:q.resource,amount:q.amount,reserve:Number(ui.tradeReserve)||0,repeat:ui.repeat}),'Transport gestartet.'); }
  else if (action === 'route-stop') { const f = state.fleets.find(f => f.id === el.dataset.id); if (f) f.route = null; persist(); toast('Route beendet. Eine laufende Lieferung wird noch abgeschlossen.'); }
  else if (action === 'event') panel('event');
  else if (action === 'event-resolve') { const error = resolveEvent(state, el.dataset.choice); if (!error) panel(null); return act(error, 'Entscheidung übermittelt.'); }
  else if (action === 'hints-off') ui.hints = false;
  else if (action === 'export') {
    const blob = new Blob([exportGame(state)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `orbit3077-tag-${state.day}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 3000); toast('Spielstand als Datei gesichert.');
  } else if (action === 'import') { $('import-file').click(); return; }
  else if (action === 'reset') {
    if (!ui.resetConfirm) ui.resetConfirm = true;
    else { state = createGame(); ui.planetId = 'nereid'; ui.systemId = 'helios'; ui.view = 'planet'; ui.fleetIds = []; ui.government = 'democracy';ui.routeDraft=null;ui.supplyFleet=null;ui.resourcePage=0; ui.speed = 0; ui.hints = true; panel(null); persist(); }
  }
  render();
});
document.addEventListener('change', async e => {
  if (e.target.id === 'import-file') {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 2_000_000) { toast('Diese Datei ist zu groß für einen Spielstand.', true); return; }
    try {
      ui.routeDraft=null;ui.supplyFleet=null;state = parseImport(await file.text()); ui.planetId = ownedPlanets(state)[0]?.id ?? state.planets[0].id; ui.systemId = currentPlanet().system; ui.government = state.player.ideology; ui.fleetIds = []; ui.speed = 0; panel(null); persist(); render(); toast('Spielstand geladen. Die Zeit ist pausiert.');
    } catch (error) { toast(`Datei konnte nicht geladen werden: ${error.message}`, true); }
    return;
  }
  const field = e.target.dataset.field; if (!field) return;
  if (field.startsWith('audio-')) { audio.update(field.slice(6),e.target.type==='checkbox'?e.target.checked:Number(e.target.value)/100); void audio.unlock(); render(); return; }
  ui.strikeConfirm = null;
  if (field === 'ownPlanet') {ui.routeDraft=null;ui.supplyFleet=null; ui.planetId = e.target.value; ui.systemId = currentPlanet().system; }
  else if(field==='productionPriority'){act(setProductionPriority(currentPlanet(),e.target.value),'Produktionspriorität geändert.');return;}
  else if(field==='supplySmart'){ui.supplySmart=e.target.checked;}
  else if(field.startsWith('circuit')){
    const q=routeSelection(state,ui,currentPlanet());if(!q.target)return;ui.routeDraft??=defaultCircuit(state,currentPlanet(),q.target,Math.min(40,q.capacity),q.resource);
    const [kind,i,j]=field.split(':');
    if(kind==='circuitInterval')ui.routeDraft.interval=Number(e.target.value);
    else if(kind==='circuitPlanet'){const stop=ui.routeDraft.stops[Number(i)];stop.planet=e.target.value;const own=getPlanet(state,stop.planet).owner==='player';for(const a of stop.actions)a.kind=own?(['load','buy'].includes(a.kind)?'load':'unload'):(['load','buy'].includes(a.kind)?'buy':'sell');}
    else{const a=ui.routeDraft.stops[Number(i)].actions[Number(j)];if(kind==='circuitKind')a.kind=e.target.value;else if(kind==='circuitResource')a.resource=e.target.value;else if(kind==='circuitAmount')a.amount=Number(e.target.value);else if(kind==='circuitLimit')a[a.kind==='load'?'reserve':a.kind==='sell'?'minPrice':'maxPrice']=a.kind==='buy'&&Number(e.target.value)===0?1000000:Number(e.target.value);}
  }
  else if (field === 'fleet') { if (e.target.checked) ui.fleetIds.push(e.target.value); else ui.fleetIds = ui.fleetIds.filter(id => id !== e.target.value); }
  else if (field === 'amount') ui.amount = Number(e.target.value);
  else if (field === 'repeat') ui.repeat = e.target.checked;
  else if (field === 'empireName') { state.player.name = e.target.value.trim().slice(0, 32) || 'Nereid-Union'; persist(); }
  else ui[field] = e.target.value;
  render();
});
document.addEventListener('input', e => {
  if (e.target.dataset.field === 'amount') { ui.amount = Number(e.target.value); e.target.parentNode.querySelector('output').textContent = ui.amount; }
  if (e.target.dataset.field?.startsWith('audio-') && e.target.type==='range') { audio.update(e.target.dataset.field.slice(6),Number(e.target.value)/100); e.target.parentNode.querySelector('output').textContent=`${e.target.value} %`; }
  if (e.target.dataset.field === 'empireName') state.player.name = e.target.value.trim().slice(0, 32) || 'Nereid-Union';
});
document.addEventListener('keydown', e=>{if(e.target.id==='resources'&&['Enter',' '].includes(e.key)){e.preventDefault();e.target.click();}});
document.addEventListener('visibilitychange', () => { audio.setHidden(document.hidden); if (document.hidden) { ui.speed = 0; accumulator = 0; persist(); render(); } });
window.addEventListener('pageshow',()=>audio.setHidden(document.hidden));
window.addEventListener('pagehide', ()=>{audio.setHidden(true);persist();});
let previousTime = performance.now(), accumulator = 0;
function frame(now) {
  const delta = Math.min(500, now - previousTime); previousTime = now;
  if (state.started && ui.speed && !document.hidden) {
    accumulator += delta * ui.speed;
    if (accumulator >= 3000) { accumulator -= 3000; const previous=new Set(state.logs); stepDay(state); audio.notify(state.logs.filter(e=>!previous.has(e))); persist(); render(); }
  }
  map.render(now); requestAnimationFrame(frame);
}
render(); requestAnimationFrame(frame);
if (storageError) toast('Gespeicherter Fortschritt konnte nicht geladen werden. Ein neuer Spielstand ist bereit.', true);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(reg => {
    if (reg.waiting) toast('Eine neue Fassung ist bereit. Öffne das Spiel erneut, um sie zu laden.');
  }).catch(() => {});
}
if (new URLSearchParams(location.search).has('debug')) globalThis.ORBIT_DEBUG = { get state() { return state; }, ui, render, map, step: (days = 1) => { for (let i = 0; i < days; i++) stepDay(state); persist(); render(); } };
