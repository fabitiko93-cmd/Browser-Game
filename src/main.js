import { battleReportCard } from './battle-report-ui.js';
import { moneyText, moneyMarkup } from './money.js';
import { setTradeBoard } from './trade-board.js';
import { createBloc, leaveBloc, blocOf, orderBlocSupply } from './power.js';
import { orderRelic } from './ruins.js';
import { homePlanet } from './world.js';
import { unreadNews, realmName } from './space-news.js';
import { esc } from './ui-format.js';
import { localSale, austerity } from './finance.js';
import { resourcePages, hudPlanet } from './hud.js';
import { planetView, systemKnown } from './intelligence.js';
import { exploreSystem } from './exploration.js';
import { readInbox, answerMessage, withdrawMessage, sendOffer, centers, inboxSignal, unreadCorrespondence } from './communications.js';
import { SUPPLY_DEFAULTS, configureSupply, serviceFleet, unloadCargo, startCircuit } from './routing.js';
import { defaultCircuit, circuitPlanets } from './circuit-ui.js';
import { createContract, cancelContract } from './trade.js';
import { marketSelection } from './market-ui.js';
import { setProductionPriority } from './infrastructure.js';
import { audioStatusText } from './audio.js';
import { MediaAudio } from './audio-media.js';
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
import { stepDay, advanceTime, resolveEvent } from './simulation.js';
import { loadGame, saveGame, parseImport, exportGame } from './save.js';
import { MapRenderer } from './map.js';
import { icon } from './icons.js';
import { compactSurface } from './surface-ui.js';
import { renderHeader, renderResources, renderMapHead, renderMapFoot, renderNavigation, renderSheet, welcomeMarkup } from './ui.js';

let state, storageError = false;
try { state = loadGame() ?? createGame(); } catch (e) { state = createGame(); storageError = true; }
const audio = new MediaAudio({onChange:(status,detail)=>{
  const el=document.querySelector('[data-audio-status]');if(el)el.textContent=audioStatusText(status);
  const info=document.querySelector('[data-audio-detail]');if(info){info.textContent=detail;info.hidden=!detail;}
}});
const ui = {
  audioSettings: audio.settings, resourcePage: 0, buildCategory: null,routeMode:'simple',routeDraft:null,tradeReserve:40,contractAmount:40,
  view: 'planet', planetId: (homePlanet(state)??state.planets[0]).id, systemId: (homePlanet(state)??state.planets[0]).system, panel: null, expanded: false, speed: 0, lastSpeed: 1,
  buildType: null, buildTile: null, surfaceTile: null, detailType: 'farm', selectedBuilding: null, fleetIds: [],
  fleetTarget: 'cinder', routeTarget: 'thalassa', routeFleet: 'starter-f', cargo: 'ore', amount: 40, repeat: true,
  researchBranch: 'energy', economyMode: 'production', politicsMode: 'government', fleetMode: 'orders', government: state.player.ideology,
  hints: true, demolishConfirm: null, warConfirm: null, resetConfirm: false
};
if(new URLSearchParams(location.search).get('view')==='battles'){ui.panel='fleet';ui.fleetMode='battles';}
const $ = id => document.getElementById(id);
const map = new MapRenderer($('map'), state, ui, hit => {
  if (!state.started) return;
  if (hit.kind === 'system') { ui.systemId = hit.id; ui.view = 'system'; ui.panel = !systemKnown(state,hit.id)||state.world.anchors.some(p=>p.system===hit.id)?'exploration':null;ui.expanded=false; }
  else if (hit.kind === 'planet') { ui.planetId = hit.id; ui.systemId = getPlanet(state, hit.id).system; ui.panel = 'planet-info'; ui.expanded = false; }
  else if (hit.kind === 'tile') {
    if (ui.buildType) { ui.buildTile = { x: hit.tx, y: hit.ty }; }
    else {
      const view=planetView(state,currentPlanet());
      const b = view?.buildings.find(b => b.x === hit.tx && b.y === hit.ty);
      if (b?.type==='commCenter'&&view.own&&!b.remaining) {const signal=inboxSignal(state);ui.communicationBuilding=b.id;ui.panel='communications';ui.inboxMode=signal.count?'open':unreadNews(state)&&!unreadCorrespondence(state)?'news':signal.unread?'archive':'open';ui.expanded=true;readInbox(state,ui.inboxMode);persist();}
      else if (b) { ui.selectedBuilding = b.id; ui.panel = 'building'; ui.expanded = false; }
      else { ui.surfaceTile = { x: hit.tx, y: hit.ty }; ui.panel = 'terrain'; ui.expanded = false; }
    }
  }
  render();
});
$('recenter').innerHTML = icon('target', 18);
function measureSurfaceViewport() {
  const bounds = $('map').getBoundingClientRect();
  const compact = compactSurface(ui), head = $(compact ? 'map-foot' : 'map-head');
  const header = !head.hidden && head.getBoundingClientRect();
  if (!header || !header.height || !bounds.height) { map.surfaceInsets = null; return; }
  let bottom = 34;
  for (const el of [$('sheet'), $('recenter'), ...(compact ? [] : [$('map-foot')])]) {
    if (el.hidden) continue;
    const rect = el.getBoundingClientRect();
    if (rect.height && rect.top < bounds.bottom) bottom = Math.max(bottom, bounds.bottom - rect.top + 8);
  }
  map.surfaceInsets = { top: Math.max(0, header.bottom - bounds.top + 8), bottom };
}
const surfaceLayout = new ResizeObserver(measureSurfaceViewport);
for (const id of ['map', 'map-head', 'map-foot', 'sheet', 'recenter']) surfaceLayout.observe($(id));
function currentPlanet() { return getPlanet(state, ui.planetId); }
function toast(message, error = false) {
  const el = $('toast'); el.textContent = moneyText(message); el.classList.toggle('error', error); el.classList.add('visible');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('visible'), 3800);
}
function persist() {
  try { saveGame(state); }
  catch { if (!storageError) { storageError = true; toast('Automatisches Speichern ist in diesem Browser nicht verfügbar. Sichere deinen Spielstand als Datei.', true); } }
}
function act(result, success) { audio.play(result?'error':'confirm'); if (result) toast(result, true); else { if (success) toast(success); persist(); } render(); }
function fitResourceNumbers() {
  for(const el of $('resources').querySelectorAll('.resource-value,.resource-trend')){
    el.style.fontSize='';
    const width=el.clientWidth,base=parseFloat(getComputedStyle(el).fontSize),minimum=el.classList.contains('resource-value')?9:8;
    if(width&&el.scrollWidth>width)el.style.fontSize=`${Math.max(minimum,Math.floor(base*width/el.scrollWidth*10)/10)}px`;
  }
}
new ResizeObserver(fitResourceNumbers).observe($('resources'));
function render() {
  if(state.galaxy.defeat) {
    ui.speed=0;ui.panel=null;$('sheet').hidden=true;$('sheet').innerHTML='';
    const el=$('welcome');el.hidden=false;el.dataset.mode='defeat';
    el.innerHTML=`<div class="welcome-header"><div class="brand-name">ORBIT 3077</div></div><div><h1 class="welcome-title">Reich <em>gefallen</em></h1><p>Die letzte eigene Welt wurde an Tag ${state.galaxy.defeat.day} durch ${esc(realmName(state,state.galaxy.defeat.conqueror))} verloren. Die Simulation ist beendet. Dein Spielstand bleibt gespeichert.</p></div>${state.battleReports[0]?battleReportCard(state.battleReports[0]):''}<div class="welcome-footer"><button class="button secondary" data-action="export">Spielstand sichern</button><button class="button secondary" data-action="import">Spielstand laden</button><input class="file-input" id="import-file" type="file" accept=".json,application/json"><button class="button danger" data-action="reset">${ui.resetConfirm?'Neues Spiel bestätigen':'Neues Spiel'}</button></div>`;
    return;
  }
  const victory=state.galaxy.hegemony.winner;
  if(victory&&!state.galaxy.hegemony.continued){ui.speed=0;ui.panel=null;$('sheet').hidden=true;const el=$('welcome');el.hidden=false;el.dataset.mode='hegemony';el.innerHTML=`<div class="welcome-header"><div class="brand-name">ORBIT 3077</div></div><div><h1 class="welcome-title">${victory.owner==='player'?'Sektor <em>geeint</em>':'Neue <em>Vormacht</em>'}</h1><p>${esc(realmName(state,victory.owner))} hat an Tag ${victory.day} die Vorherrschaft errungen: zwei Drittel der Systembedeutung für 120 Tage gehalten. ${victory.owner==='player'?'Deine Kolonien und dein Machtbund haben den Sektor geprägt.':'Dein Reich kann im freien Spiel weiter um Einfluss kämpfen.'}</p></div><div class="welcome-footer"><button class="button primary" data-action="hegemony-continue">Im freien Spiel fortsetzen</button><button class="button secondary" data-action="export">Spielstand sichern</button><button class="button danger" data-action="reset">${ui.resetConfirm?'Neues Spiel bestätigen':'Neue Welt beginnen'}</button></div>`;return;}
  if(['defeat','hegemony'].includes($('welcome').dataset.mode)){ $('welcome').innerHTML='';$('welcome').dataset.mode=''; }
  if (currentPlanet().destroyed) {
    ui.buildType = null; ui.buildTile = null;
    if (['terrain', 'building'].includes(ui.panel)) { ui.panel = 'planet-info'; ui.expanded = false; }
    if (['build', 'build-detail', 'building', 'economy', 'fleet'].includes(ui.panel)) ensureOwned();
  }
  ui.audioSettings = audio.settings;
  ui.audioStatus = audio.status;
  ui.audioDetail = audio.detail;
  ui.projection = forecastDay(state);
  map.state = state;
  $('header').innerHTML = renderHeader(state, ui);
  $('resources').innerHTML = renderResources(state, ui);
  fitResourceNumbers();
  const shown=hudPlanet(state,ui),pages=resourcePages(state,shown);ui.resourcePage%=pages.length;$('resources').setAttribute('aria-label',`Vorräte von ${shown.name}. ${pages[ui.resourcePage].name}: antippen für ${pages[(ui.resourcePage+1)%pages.length].name}`);
  $('map-head').innerHTML = renderMapHead(state, ui);
  $('map-foot').innerHTML = moneyMarkup(renderMapFoot(state, ui));
  const compact = compactSurface(ui);
  $('map-head').hidden = compact;
  $('map-foot').classList.toggle('site-mode', compact);
  $('navigation').innerHTML = renderNavigation(ui);
  const sheet = $('sheet');
  const oldScroll = sheet.querySelector('.sheet-content')?.scrollTop ?? 0;
  const openTech = [...sheet.querySelectorAll('details[data-tech-id][open]')].map(el => el.dataset.techId);
  const openDescriptions = [...sheet.querySelectorAll('details[data-planet-description][open]')].map(el => el.dataset.planetDescription);
  const openManagement=[...sheet.querySelectorAll('details[data-panel-detail][open]')].map(el=>el.dataset.panelDetail);
  const activeField = document.activeElement?.dataset.field;
  const selectionStart = document.activeElement?.selectionStart;
  sheet.hidden = !ui.panel || compact; sheet.classList.toggle('expanded', ui.expanded);
  if (!sheet.hidden) {
    sheet.innerHTML = renderSheet(state, ui);
    for (const id of openTech) { const card = sheet.querySelector(`[data-tech-id="${id}"]`); if (card) card.open = true; }
    for (const id of openDescriptions) { const card=sheet.querySelector(`[data-planet-description="${id}"]`);if(card)card.open=true; }
    for(const id of openManagement){const card=sheet.querySelector(`[data-panel-detail="${id}"]`);if(card)card.open=true;}
    sheet.querySelector('.sheet-content').scrollTop = oldScroll;
    if (ui.focusTech) { const card = sheet.querySelector(`[data-tech-id="${ui.focusTech}"]`); if (card) { card.open = true; card.scrollIntoView({ block: 'center' }); } ui.focusTech = null; }
    if (activeField) {
      const input = sheet.querySelector(`[data-field="${activeField}"]`);
      input?.focus({ preventScroll: true });
      if (selectionStart != null && ['text','search','tel','url','password'].includes(input?.type)) input?.setSelectionRange(selectionStart, selectionStart);
    }
  }
  $('welcome').hidden = state.started;
  if (!state.started && $('welcome').dataset.mode!=='start') { $('welcome').innerHTML=welcomeMarkup();$('welcome').dataset.mode='start'; }
  measureSurfaceViewport();
}
function panel(name) { ui.panel = name; ui.expanded = false; ui.buildType = null; ui.buildTile = null; ui.demolishConfirm = null; ui.warConfirm = null; ui.resetConfirm = false; }
function ensureOwned() { if (currentPlanet().owner !== 'player') { ui.planetId = ownedPlanets(state)[0]?.id ?? 'nereid'; ui.systemId = currentPlanet().system; } }
function selectedTarget(field) { const el = document.querySelector(`[data-field="${field}"]`); return el?.value ?? ui[field]; }
for(const event of ['pointerdown','pointerup','touchend','click','keydown'])document.addEventListener(event,()=>{void audio.unlock();},{capture:true,passive:true});
document.addEventListener('click', e => {
  syncClock(performance.now());
  const el = e.target.closest('[data-action]'); if (!el || el.disabled) return;
  const action = el.dataset.action, p = currentPlanet();
  if (action === 'start') { state.started = true; ui.speed = 1; persist(); }
  else if (action === 'battle-open') {
    const report=state.battleReports.find(r=>r.id===el.dataset.id);if(!report)return;
    ui.speed=0;
    try{saveGame(state);}catch{toast('Die Schlacht konnte nicht gespeichert werden. Bitte Spielstand sichern und den Browserspeicher prüfen.',true);render();return;}
    const url=new URL('./battle-replay.html',location.href);url.searchParams.set('battle',report.id);location.href=url.href;return;
  }
  else if (action === 'battle-preview') { ui.speed = 0; persist(); location.href = new URL('./battle-overview.html', location.href).href; return; }
  else if (action === 'resource-toggle') { ui.resourcePage=(ui.resourcePage+1)%resourcePages(state,hudPlanet(state,ui)).length; }
  else if (action === 'local-sale') return act(localSale(state,p,el.dataset.resource,25),'Waren an örtliche Privatkäufer verkauft.');
  else if (action === 'austerity') return act(austerity(state),'Sparbetrieb aktiviert.');
  else if (action === 'exploration-start') return act(exploreSystem(state,el.dataset.id,el.dataset.system),'Erkundungsflug gestartet.');
  else if(action==='trade-board-save')return act(setTradeBoard(state,el.dataset.id,selectedTarget('boardResource'),selectedTarget('boardTarget'),selectedTarget('boardPrice'),selectedTarget('boardBudget'),selectedTarget('boardExports')==='on'),'Handelsplatz und reserviertes Budget aktualisiert.');
  else if(action==='bloc-create')return act(createBloc(state),'Machtbund gegründet.');
  else if(action==='bloc-leave')return act(leaveBloc(state,'player'),'Blockmitgliedschaft beendet.');
  else if(action==='bloc-invite')return act(sendOffer(state,el.dataset.faction,'bloc'),'Mitgliedschaft angeboten.');
  else if(action==='bloc-supply')return act(orderBlocSupply(state,el.dataset.member),'Versorgungsfrachter gestartet.');
  else if(action==='bloc-auto'){const b=blocOf(state,'player');if(b?.leader==='player'&&state.tech.includes('smartLogistics')){b.autoSupply=!b.autoSupply;persist();}}
  else if(action==='hegemony-continue'){state.galaxy.hegemony.continued=true;ui.speed=0;persist();}
  else if (action === 'relic-order') return act(orderRelic(state,el.dataset.id,el.dataset.target,el.dataset.kind),'Expedition gestartet.');
  else if (action === 'analysis-start') return act(orderFleet(state,[el.dataset.id],el.dataset.target,'analyze'),'Analyseauftrag erteilt.');
  else if (action === 'message-answer') return act(answerMessage(state,el.dataset.id,el.dataset.choice),'Antwort übermittelt.');
  else if (action === 'message-withdraw') return act(withdrawMessage(state,el.dataset.id),'Angebot zurückgezogen.');
  else if (action === 'message-send') return act(sendOffer(state,el.dataset.faction,el.dataset.type),'Angebot übermittelt.');
  else if (action === 'communication-manage') {panel('building');ui.selectedBuilding=el.dataset.id;}
  else if (action === 'audio-test') { void audio.test(); }
  else if (action === 'audio-restart') { void audio.restart();void audio.test(); }
  else if (action === 'build-category') { ui.buildCategory = el.dataset.category; $('sheet').querySelector('.sheet-content').scrollTop = 0; }
  else if (action === 'build-categories') { ui.buildCategory = null; $('sheet').querySelector('.sheet-content').scrollTop = 0; }
  else if (action === 'trade-open') { ensureOwned(); panel('economy'); ui.economyMode='routes'; ui.routeTarget=state.planets.find(q=>q.owner===el.dataset.faction)?.id; ui.expanded=true; }
  else if (action === 'shipyard-open') { ensureOwned(); panel('fleet'); ui.fleetMode='shipyard'; }
  else if (action === 'speed-toggle') { if (ui.speed) { ui.lastSpeed = ui.speed; ui.speed = 0; } else ui.speed = ui.lastSpeed; }
  else if (action === 'speed') { ui.lastSpeed = ({ 1: 2, 2: 4, 4: 1 })[ui.speed || ui.lastSpeed]; if (ui.speed) ui.speed = ui.lastSpeed; }
  else if (action === 'nav') { if (['build', 'economy'].includes(el.dataset.panel) || el.dataset.panel === 'fleet' && ['shipyard', 'bases', 'arsenal'].includes(ui.fleetMode)) ensureOwned(); panel(el.dataset.panel === 'map' || ui.panel === el.dataset.panel ? null : el.dataset.panel); if (ui.panel === 'build') ui.view = 'planet'; }
  else if (action === 'close') { panel(null); }
  else if (action === 'expand') ui.expanded = !ui.expanded;
  else if (action === 'settings') { ui.speed = 0; panel('settings'); ui.expanded = true; }
  else if (action === 'view') { ui.view = el.dataset.view; ui.systemId = p.system; panel(null); }
  else if (action === 'recenter') map.resetCamera();
  else if (action === 'home') { ensureOwned(); ui.view = 'planet'; panel(null); }
  else if (action === 'surface') { if(!planetView(state,p)?.surfaceKnown)return toast('Die Oberfläche muss zuerst analysiert werden.',true);ui.view = 'planet'; panel(null); }
  else if (action === 'planet-info') { panel('planet-info'); }
  else if (action === 'inspect-site') { panel('terrain'); ui.view = 'planet'; ui.surfaceTile = { x: Number(el.dataset.x), y: Number(el.dataset.y) }; }
  else if (action === 'build') { ensureOwned(); panel('build'); }
  else if (action === 'build-detail') { ensureOwned(); panel('build-detail'); ui.detailType = el.dataset.type; }
  else if (action === 'build-start') { panel(null); ui.view = 'planet'; ui.buildType = el.dataset.type; if (el.dataset.x !== undefined && el.dataset.y !== undefined) ui.buildTile = { x: Number(el.dataset.x), y: Number(el.dataset.y) }; }
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
  } else if (action === 'subtab') { ui[el.dataset.field] = el.dataset.value;if(el.dataset.field==='inboxMode'){readInbox(state,ui.inboxMode);persist();} if (el.dataset.field === 'economyMode' && el.dataset.value === 'research') ui.expanded = true; if (el.dataset.field === 'fleetMode' && ['shipyard', 'bases', 'arsenal'].includes(el.dataset.value)) ensureOwned(); }
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
    else { ui.warConfirm = null; return act(diplomaticAction(state, el.dataset.faction, 'war',{target:selectedTarget('warTarget')}), 'Krieg erklärt.'); }
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
    else { state = createGame(); ui.planetId = homePlanet(state).id; ui.systemId = homePlanet(state).system; ui.view = 'planet'; ui.fleetIds = []; ui.government = 'democracy';ui.routeDraft=null;ui.supplyFleet=null;ui.resourcePage=0;for(const k of ['boardPlanet','boardResource','boardTarget','boardPrice','boardBudget','boardExports','relicFleet','warTarget'])delete ui[k]; ui.speed = 0; ui.hints = true; panel(null); persist(); }
  }
  render();
});
document.addEventListener('change', async e => {
  if (e.target.id === 'import-file') {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 2_000_000) { toast('Diese Datei ist zu groß für einen Spielstand.', true); return; }
    try {
      ui.routeDraft=null;ui.supplyFleet=null;for(const k of ['boardPlanet','boardResource','boardTarget','boardPrice','boardBudget','boardExports','relicFleet','warTarget'])delete ui[k];state = parseImport(await file.text()); ui.planetId = ownedPlanets(state)[0]?.id ?? state.planets[0].id; ui.systemId = currentPlanet().system; ui.government = state.player.ideology; ui.fleetIds = []; ui.speed = 0; panel(null); persist(); render(); toast('Spielstand geladen. Die Zeit ist pausiert.');
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
  else if(['boardPlanet','boardResource'].includes(field)){ui[field]=e.target.value;for(const k of ['boardTarget','boardPrice','boardBudget','boardExports'])delete ui[k];}
  else if (field === 'fleet') { if (e.target.checked) ui.fleetIds.push(e.target.value); else ui.fleetIds = ui.fleetIds.filter(id => id !== e.target.value); }
  else if (field === 'amount') ui.amount = Number(e.target.value);
  else if (field === 'repeat') ui.repeat = e.target.checked;
  else if (field === 'empireName') { state.player.name = e.target.value.trim().slice(0, 32) || 'Nereid-Union'; persist(); }
  else ui[field] = e.target.value;
  // Replacing the form during blur would remove the button being tapped on iOS.
  if(e.target.type==='number'&&(field.startsWith('board')||field.startsWith('circuit')))return;
  render();
});
document.addEventListener('input', e => {
  if (e.target.dataset.field === 'amount') { ui.amount = Number(e.target.value); e.target.parentNode.querySelector('output').textContent = ui.amount; }
  if (e.target.dataset.field?.startsWith('audio-') && e.target.type==='range') { audio.update(e.target.dataset.field.slice(6),Number(e.target.value)/100); e.target.parentNode.querySelector('output').textContent=`${e.target.value} %`; }
  if (e.target.dataset.field === 'empireName') state.player.name = e.target.value.trim().slice(0, 32) || 'Nereid-Union';
});
document.addEventListener('keydown', e=>{if(e.target.id==='resources'&&['Enter',' '].includes(e.key)){e.preventDefault();e.target.click();}});
document.addEventListener('visibilitychange', () => { syncClock(performance.now(),{allowHidden:document.hidden}); audio.setHidden(document.hidden); if (document.hidden) { ui.speed = 0; persist(); render(); } });
window.addEventListener('pageshow',()=>audio.setHidden(document.hidden));
window.addEventListener('focus',()=>{if(!document.hidden)void audio.recover();});
window.addEventListener('pagehide', ()=>{syncClock(performance.now(),{allowHidden:true});ui.speed=0;audio.setHidden(true);persist();});
let previousTime = performance.now(), lastResearchPaint = 0;
function syncClock(now,{allowHidden=false}={}) {
  const delta = Math.max(0,Math.min(500,now-previousTime)); previousTime=now;
  if(state.started&&!state.galaxy.defeat&&!(state.galaxy.hegemony.winner&&!state.galaxy.hegemony.continued)&&ui.speed&&(!document.hidden||allowHidden)){
    const day=state.day,previous=new Set(state.logs),battleId=state.battleReports[0]?.id;advanceTime(state,delta*ui.speed/3000);
    if(state.battleReports[0]?.id!==battleId){ui.speed=0;panel('fleet');ui.fleetMode='battles';ui.expanded=true;toast(`Gefecht bei ${state.battleReports[0].planetName} · 3D-Aufzeichnung bereit.`);}
    const added=state.logs.filter(e=>!previous.has(e));audio.notify(added);
    if(added.some(e=>e.type==='communication')&&centers(state).length)toast(added.find(e=>e.type==='communication').text);
    if(state.day!==day||added.length){if(ui.panel==='communications')readInbox(state,ui.inboxMode);persist();render();}
    else if(ui.panel==='economy'&&ui.economyMode==='research'&&state.research&&now-lastResearchPaint>=500){lastResearchPaint=now;render();}
  }
}
function frame(now) {
  syncClock(now);map.render(now);requestAnimationFrame(frame);
}
render(); requestAnimationFrame(frame);
if (storageError) toast('Gespeicherter Fortschritt konnte nicht geladen werden. Ein neuer Spielstand ist bereit.', true);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(reg => {
    if (reg.waiting) toast('Eine neue Fassung ist bereit. Öffne das Spiel erneut, um sie zu laden.');
  }).catch(() => {});
}
if (new URLSearchParams(location.search).has('debug')) globalThis.ORBIT_DEBUG = { get state() { return state; }, ui, render, map, audio, step: (days = 1) => { for (let i = 0; i < days; i++) stepDay(state); persist(); render(); } };
