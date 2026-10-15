import { HarbingerScene } from './harbinger-scene.js';
import { OVERVIEW_SCENARIOS } from './battle-overview.js';
import { createBattleTrial, advanceBattleTrial, trialPorts, trialSummary, TRIAL_GROUPS, TRIAL_SAVE_KEY, serializeTrial, parseTrial } from './battle-trial.js';
import { loadGame } from './save.js';
import { selectDemoShip, commandDemo, commandStatus, activeShip, DEMO_CLASSES, KM_PER_UNIT, shipStrength, shipRange, shipClass } from './battle-demo.js';
import { battleSelection, recipientInfo } from './battle-selection.js';
import { formationCenter } from './battle-overview.js';
import { commandDisplay } from './harbinger-display.js';
import { TargetPanel } from './battle-targets-ui.js';
import { contactInfo } from './battle-targets.js';
import { MediaAudio } from './audio-media.js';
import { BattleAudio } from './battle-audio.js';
import { BattlePlanner } from './battle-planner-ui.js';
import { createTrialPlan } from './battle-planner.js';

const $ = id => document.getElementById(id);
const number = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const audio = new MediaAudio(), sound = new BattleAudio(() => audio.settings);
const frames = [], markers = new Map(), ownButtons = new Map(), groupButtons = new Map();
let battle, view, ready = false, paused = false, generation = 0, lastFrame = 0, lastRender = 0, lastHud = 0;
let visualTime = 0, pending = [], noticeTimer, inspectedId = null, returnToOrders = false, ownToOrders = false, graphics = 'auto';
let hasSelection = false, selectionId = null, pauseReason = 'start', contactPicked = null, ignoredContactClosures = 0;
const requested = new URLSearchParams(location.search).get('scenario');
let savedEmpire = null, persistenceFailed = false, lastCheckpoint = 0;
let scenario = Object.hasOwn(OVERVIEW_SCENARIOS, requested) ? requested : '20v20';
function text(id, value) { const node = $(id); if (node.textContent !== String(value)) node.textContent = value; }
function pressed(node, value) { node.setAttribute('aria-pressed', String(value)); }
function closeDialogs() {
  returnToOrders = ownToOrders = false; contactPicked = null;
  if (view) view.highlightId = null;
  if ($('contacts-dialog').open) ignoredContactClosures++;
  for (const dialog of document.querySelectorAll('dialog[open]')) dialog.close();
}
function pauseForMenu() {
  if (!ready || battle.phase !== 'engaged') return;
  if (!paused || pauseReason === 'start') pauseReason = 'tactical';
  paused = true; lastFrame = 0; persistTrial();
}
function menuViewport() {
  const vp = globalThis.visualViewport, height = vp?.height ?? innerHeight, top = vp?.offsetTop ?? 0;
  for (const dialog of document.querySelectorAll('.lab-dialog[open]')) {
    dialog.style.maxHeight = `${height*.88}px`;
    dialog.style.top = dialog.classList.contains('lab-dock') ? 'auto' : `${top+height*.06}px`;
    dialog.style.bottom = dialog.classList.contains('lab-dock') ? `${Math.max(0,innerHeight-height-top)}px` : 'auto';
    dialog.style.margin = '0 auto';
  }
}
function openDialog(id) { pauseForMenu(); closeDialogs(); $(id).showModal(); paint(); menuViewport(); }
function openContacts(fromOrders = false) { pauseForMenu(); closeDialogs(); returnToOrders = fromOrders && hasSelection; contacts.open(); paint(); }
function viewport() {
  if (!view) return;
  view.resize(); $('view-caption').style.top = `${view.viewportTop + 3}px`; $('trial-status').style.top = `${view.viewportTop + 18}px`;
}
function notice(message) {
  if (persistenceFailed) message = 'Diese Probe kann im Browser nicht gespeichert werden. Dein Reich bleibt unberührt.';
  clearTimeout(noticeTimer); text('battle-notice', message);
  noticeTimer = setTimeout(() => text('battle-notice', ''), 3600);
}
function setCamera(mode, animated = true, focusId = null) {
  closeDialogs(); view.setMode(mode, battle, animated, focusId);
  for (const node of document.querySelectorAll('[data-camera]')) pressed(node, node.dataset.camera === mode);
  pressed($('target-view'), mode === 'target');
  text('camera-caption', ({ ship: 'SCHIFFSANSICHT', fleet: 'EIGENE FORMATION', overview: 'GESAMTANSICHT', target: 'GEGNERANSICHT' })[mode]);
  $('battle-canvas').setAttribute('aria-label', '3D-Schlachtansicht. Ein Finger dreht, zwei Finger zoomen und verschieben. Schiffe antippen zum Öffnen ihres Menüs.');
  view.highlightId = null; viewport(); lastRender = 0;
}
function selectContact(id) {
  if (!selectDemoShip(battle, id)) return false;
  const ship = battle.ships.find(s => s.id === id); inspectedId = id;
  if (ship.side === 'friendly') {
    commandDemo(battle, 'scope', 'ship'); hasSelection = true; selectionId = id;
    openDialog('orders-dialog');
  } else if ($('contacts-dialog').open) contactPicked = returnToOrders ? null : id;
  else inspectContact(id);
  paint(); lastRender = 0; return true;
}
function selectGroup(id) {
  const ship = battle.ships.find(s => s.side === 'friendly' && s.group === id && activeShip(s));
  if (!ship) return false;
  battle.selectedGroup = id; battle.selected = ship.id;
  if (!commandDemo(battle, 'scope', 'group')) return false;
  hasSelection = true; selectionId = ship.id; openDialog('orders-dialog'); paint(); lastRender = 0; return true;
}
function inspectContact(id) {
  const ship = battle.ships.find(s => s.id === id); if (!ship) return;
  inspectedId = id; openDialog('info-dialog'); view.highlightId = id; view.dirty = true; lastRender = 0;
}
function clearSelection() {
  hasSelection = false; selectionId = null; closeDialogs(); view.highlightId = null; paint(); lastRender = 0;
}
const contacts = new TargetPanel($('contacts-dialog'), {
  getBattle: () => battle, onSelect: selectContact, groups: TRIAL_GROUPS,
  onInspect: () => { returnToOrders = false; setCamera('target', true, battle.target); },
  onPriority: type => {
    if (!hasSelection || !returnToOrders || !commandDemo(battle, 'priority', type)) return false;
    closeDialogs(); persistTrial(); notice(`${recipientInfo(battle).label}: ${TRIAL_GROUPS[type]} angreifen.`); paint(); lastRender = 0; return true;
  },
});
$('contacts-dialog').addEventListener('close', () => {
  if (ignoredContactClosures) { ignoredContactClosures--; return; }
  const back = returnToOrders, picked = contactPicked; returnToOrders = false; contactPicked = null;
  if (back) openDialog('orders-dialog'); else if (picked) inspectContact(picked);
});
$('info-dialog').addEventListener('close',()=>{if(view&&!$('info-dialog').open){view.highlightId=null;view.dirty=true;}});
function initializeHud() {
  ownButtons.clear(); groupButtons.clear(); markers.clear(); $('ship-selector').replaceChildren(); $('ship-labels').replaceChildren(); $('group-selector').replaceChildren();
  for (const group of battle.formations?.filter(g => g.side === 'friendly') ?? []) {
    if (!battle.ships.some(s => s.group === group.id)) continue;
    const button = document.createElement('button'); button.dataset.group = group.id;
    const name = document.createElement('span'), detail = document.createElement('small'), count = document.createElement('span');
    name.textContent = group.name; detail.textContent = 'Verband gemeinsam auswählen'; name.append(detail);
    button.append(name, count); $('group-selector').append(button); groupButtons.set(group.id, button);
  }
  $('group-selector-heading').hidden = !groupButtons.size;
  $('ship-selector').closest('details').open = !groupButtons.size;
  for (const ship of battle.ships.filter(s => s.side === 'friendly')) {
    const button = document.createElement('button'); button.dataset.ship = ship.id;
    const name = document.createElement('span'), detail = document.createElement('small'), hull = document.createElement('span');
    name.textContent = ship.name; detail.textContent = [ship.className, battle.formations?.find(g => g.id === ship.group)?.name].filter(Boolean).join(' · ');
    name.append(detail); button.append(name, hull); $('ship-selector').append(button); ownButtons.set(ship.id, button);
  }
  for (const side of ['friendly', 'enemy']) {
    const node = document.createElement('button'); node.dataset.marker = `fleet:${side}`;
    node.className = `lab-marker ${side === 'enemy' ? 'enemy' : ''}`;
    node.append(document.createElement('span'), document.createElement('small'));
    $('ship-labels').append(node); markers.set(side, node);
  }
  applySetup(battle.setup);
  $('own-search').value = '';
  text('source-summary', battle.sourceLabel);
  text('trial-summary', battle.sourceLabel);
}
function persistTrial() {
  if (!battle) return;
  try { localStorage.setItem(TRIAL_SAVE_KEY, serializeTrial(battle)); persistenceFailed = false; }
  catch { if (!persistenceFailed) { persistenceFailed = true; notice('Diese Probe kann im Browser nicht gespeichert werden. Dein Reich bleibt unberührt.'); } }
}
function loadSource() {
  try { savedEmpire = loadGame(); } catch { savedEmpire = null; }
  const ports = trialPorts(savedEmpire), select = $('source-planet'); select.replaceChildren();
  for (const port of ports) { const option = document.createElement('option'); option.value = port.id; option.textContent = `${port.name} · ${port.count} freie Schiffe`; option.disabled=port.count>50; select.append(option); }
  for (const option of $('source-mode').options) option.disabled = option.value !== 'baseline' && (!savedEmpire || option.value === 'fleet' && !ports.some(p => p.count <= 50));
  updateSetup();
}
function updateSetup() {
  const fleet = $('source-mode').value === 'fleet';
  $('source-planet-field').hidden = !fleet; $('friendly-supply').disabled = fleet;
}
function applySetup(setup) {
  scenario = setup.scenario; $('scenario-select').value = scenario; $('source-mode').value = setup.mode;
  if(setup.planetId && [...$('source-planet').options].some(o=>o.value===setup.planetId))$('source-planet').value=setup.planetId;
  else $('source-planet').value=[...$('source-planet').options].find(o=>!o.disabled)?.value??''; $('friendly-supply').value = String(setup.friendlySupply); $('enemy-supply').value = String(setup.enemySupply); updateSetup();
}
function resultText() { return ({ victory:'Gegnerische Flotte ausgeschaltet.',defeat:'Eigene Flotte verloren.',withdrawn:'Rückzug abgeschlossen.',stalemate:'Gefecht ohne Entscheidung beendet.',draw:'Beide Flotten im Gefecht verloren.' })[battle.phase]; }
function paintResult() {
  text('result-title', resultText() ?? 'Laufendes Gefecht');
  text('result-source', battle.sourceLabel);
  for (const side of ['friendly','enemy']) { const r=trialSummary(battle,side); text(`result-${side}`,`${r.total} eingesetzt · ${r.destroyed} zerstört · ${r.escaped} entkommen · ${r.active} im Gefecht`); }
}
function showResult() { paintResult(); openDialog('result-dialog'); }
function failed(error) {
  ready = false; paused = true; $('battle-loading').hidden = true; $('battle-error').hidden = false;
  text('battle-error-text', error.message?.includes('WebGL') ? 'Die 3D-Ansicht konnte nicht starten. Bitte in aktuellem Safari erneut öffnen.' : 'Modelle oder Materialien konnten nicht vollständig geladen werden. Bitte Verbindung prüfen und erneut versuchen.');
  console.error('Harbinger initialization:', error);
}
async function start(nextScenario = scenario, resume = false, preparedPlan = null) {
  let candidate = null, restored = false, invalidCheckpoint = false;
  if (resume) { try { const raw=localStorage.getItem(TRIAL_SAVE_KEY); if(raw){candidate=parseTrial(raw);restored=true;} } catch { invalidCheckpoint=true; } }
  if (!candidate) {
    try {
      let plan = preparedPlan;
      if (!plan && $('source-mode').value === 'baseline') {
        plan = resume && planner.plan ? structuredClone(planner.plan) : createTrialPlan(nextScenario);
        if (!resume) { plan.sides.friendly.supply = Number($('friendly-supply').value); plan.sides.enemy.supply = Number($('enemy-supply').value); }
      }
      candidate=createBattleTrial({scenario:nextScenario,mode:$('source-mode').value,state:savedEmpire,planetId:$('source-planet').value||null,friendlySupply:Number($('friendly-supply').value),enemySupply:Number($('enemy-supply').value),plan});
    }
    catch(error){notice(error.message);return false;}
  }
  scenario = candidate.setup.scenario;
  const run = ++generation; ready = false; paused = true; lastFrame = lastRender = lastHud = visualTime = 0;
  pending = []; frames.length = 0; inspectedId = null; hasSelection = false; selectionId = null; pauseReason = 'start'; clearTimeout(noticeTimer); closeDialogs();
  view?.dispose(); view = null; const old = $('battle-canvas'); old.replaceWith(old.cloneNode(false));
  battle = candidate; visualTime = battle.day * 3; contacts.reset(); initializeHud(); text('battle-notice', '');
  const url = new URL(location.href); url.searchParams.set('scenario', scenario); history.replaceState(null, '', url);
  $('battle-error').hidden = true; $('battle-loading').hidden = false; $('load-bar').style.width = '5%'; text('loading-progress', 'Schiffsmodelle laden …');
  try {
    const next = new HarbingerScene($('battle-canvas'), {
      onSelect: id => { if (ready) inspectContact(id); }, onUnavailable: message => failed(new Error(message)),
      onAssetProgress: (loaded, total) => {
        if (run !== generation) return;
        const percent = Math.round(loaded / total * 100);
        text('loading-progress', percent === 100 ? 'Verbände und Licht vorbereiten …' : `Harbinger laden · ${percent} %`);
        $('load-bar').style.width = `${5 + loaded / total * 85}%`;
      },
    });
    view = next; await next.load(battle); if (run !== generation) { next.dispose(); return; }
    next.setGraphics(graphics); next.showSelectionLinks = $('show-target-links').checked; ready = true; $('battle-loading').hidden = true;
    setCamera('overview', false); paint(); view.render(battle, visualTime); labels();
    notice(restored ? 'Gespeicherte Probe geladen · mit ▶ fortsetzen.' : invalidCheckpoint ? 'Ungültige Probe verworfen · neue Probe bereit.' : 'Probe bereit · ▶ starten · unter ⋯ Flotte und Verbände planen.'); persistTrial();
  } catch (error) { if (run !== generation) return; view?.dispose(); view = null; failed(error); }
}
const planner = new BattlePlanner($('planner-dialog'), { getBattle: () => battle, openDialog,
  onApply: plan => start(plan.scenario, false, plan) });
function paint() {
  if (!battle || !view) return;
  if (hasSelection && battle.scope === 'ship' && !battle.ships.some(s => s.id === selectionId && activeShip(s))) {
    hasSelection = false; selectionId = null; notice('Ausgewähltes Schiff außer Gefecht · Auswahl aufgehoben.');
  }
  if (hasSelection && battle.scope === 'group') {
    const members = battle.ships.filter(s => s.side === 'friendly' && s.group === battle.selectedGroup && activeShip(s));
    if (!members.length) { hasSelection = false; selectionId = null; notice('Ausgewählter Verband außer Gefecht · Auswahl aufgehoben.'); }
    else if (!members.some(s => s.id === battle.selected)) { battle.selected = members[0].id; selectionId = battle.selected; }
  }
  if (['ship','target'].includes(view.mode) && !battle.ships.some(s => s.id === view.focusId && activeShip(s))) setCamera('overview');
  const own = battle.ships.filter(s => s.side === 'friendly'), selected = own.find(s => s.id === battle.selected);
  const target = battle.ships.find(s => s.id === battle.target), info = target && contactInfo(target, selected), display = commandDisplay(battle), recipients = recipientInfo(battle);
  const selection = hasSelection ? { scope: battle.scope, selected: battle.selected, group: battle.selectedGroup } : null, marked = battleSelection(battle, selection);
  const selectionKey = selection ? `${selection.scope}:${selection.selected}:${selection.group}` : '';
  if (selectionKey !== view.selectionKey) { view.selectionKey = selectionKey; view.tacticalSelection = selection; view.dirty = true; }
  $('selection-readout').hidden = !hasSelection;
  const multi = battle.scope !== 'ship', groupName = battle.formations?.find(g => g.id === battle.selectedGroup)?.name;
  text('selection-readout', `${battle.scope === 'fleet' ? 'Flotte' : battle.scope === 'group' ? groupName : selected.name} · ${marked.targets.length} ${marked.targets.length === 1 ? 'Ziel' : 'Ziele'}`);
  text('friendly-count', own.filter(activeShip).length); text('enemy-count', battle.ships.filter(s => s.side === 'enemy' && activeShip(s)).length);
  const a = formationCenter(battle, 'friendly'), b = formationCenter(battle, 'enemy');
  text('battle-range', `Linienabstand ${number.format(Math.hypot(...a.map((v, i) => v - b[i])) * KM_PER_UNIT)} km`);
  text('battle-day', `Tag ${number.format(battle.day)}`);
  text('selected-name', battle.scope === 'fleet' ? 'Gesamte eigene Flotte' : battle.scope === 'group' ? groupName : selected.name);
  text('selected-class', multi ? `BEFEHL AN · ${recipients.ships.length} AKTIVE SCHIFFE` : `BEFEHL AN · ${selected.className.toUpperCase()}`);
  text('selected-order', display.label); text('orders-heading', 'Befehle');
  text('recipient-summary', [`${recipients.armed.length} bewaffnet und verfügbar`, recipients.available.length > recipients.armed.length ? `${recipients.available.length-recipients.armed.length} unbewaffnet` : '', recipients.ships.length > recipients.available.length ? `${recipients.ships.length-recipients.available.length} bereits auf Rückzug` : ''].filter(Boolean).join(' · '));
  const hull = Math.round(multi ? recipients.ships.reduce((n,s) => n + s.hull / DEMO_CLASSES[s.type].hull * 100, 0) / Math.max(1,recipients.ships.length) : selected.hull / DEMO_CLASSES[selected.type].hull * 100);
  text('hull-label', multi ? 'Ø Hülle' : 'Hülle'); text('hull-value', `${hull} %`); $('hull-bar').style.width = `${hull}%`;
  text('selected-stats', multi ? `Kampfstärke ${number.format(recipients.armed.reduce((n,s)=>n+shipStrength(s),0))} · Angaben und Kosten gelten für die ausgewählten Schiffe.` : `Stärke ${number.format(shipStrength(selected))} · Panzerung ${Math.round(selected.combat.armor*100)} % · Versorgung ${Math.round(selected.supply)} % · Reichweite ${number.format(shipRange(selected)*KM_PER_UNIT)} km`);
  const distances = info && recipients.armed.map(s => Math.hypot(...s.position.map((v,i)=>v-target.position[i])) * KM_PER_UNIT);
  text('target-name', target?.name ?? 'Kein Gegner');
  text('target-distance', distances?.length && multi ? `${number.format(Math.min(...distances))}–${number.format(Math.max(...distances))} km` : info ? `${number.format(info.distance)} km` : '');
  text('target-state', display.chosenState);
  $('attack-target').disabled = !hasSelection || !display.canAttack; $('auto-target').disabled = !hasSelection || !display.canAuto; $('retreat').disabled = !hasSelection || !display.canRetreat;
  $('target-picker').disabled = !battle.ships.some(s => s.side === 'enemy' && activeShip(s)); $('target-view').disabled = !info?.active;
  pressed($('auto-target'), display.auto); $('attack-target').setAttribute('aria-label', `${recipients.label}: ${target?.name ?? 'Gegner'} angreifen`);
  const inRange = info?.active ? recipients.armed.filter(s => Math.hypot(...s.position.map((v,i)=>v-target.position[i])) <= shipRange(s)).length : 0;
  text('command-help', !recipients.armed.length ? 'Kein bewaffnetes Schiff für einen Angriff verfügbar. Unbewaffnete Schiffe können sich zurückziehen.' : !info?.active ? 'Wähle einen aktiven Gegner. Ein zerstörter Kontakt kann nicht angegriffen werden.' : `${inRange} von ${recipients.armed.length} in Reichweite · Ausführung mit ▶.`);
  const costs = recipients.costs.map(v=>number.format(v)).join(' / ');
  text('retreat-reason', recipients.blocked.length ? `Rückzug blockiert: ${recipients.blocked.map(s=>s.name).join(', ')} haben zu wenig Bordversorgung. Benötigt: ${costs} je Schiff.` : !recipients.available.length ? 'Kein Schiff für einen neuen Rückzug verfügbar.' : `Rückzug: ${costs} Bordversorgung je Schiff · ${recipients.available.length} Empfänger. Vor dem Erteilen bestätigen.`);
  $('retreat-reason').hidden = display.canRetreat;
  text('retreat-recipients', recipients.label); text('retreat-cost', `${recipients.available.length} ${recipients.available.length === 1 ? 'Schiff' : 'Schiffe'} · ${costs} Bordversorgung je Schiff.`); $('confirm-retreat').disabled = !hasSelection || !display.canRetreat;
  for (const node of document.querySelectorAll('[data-scope]')) { pressed(node, node.dataset.scope === battle.scope); if (node.dataset.scope === 'group') node.disabled = !selected.group; }
  text('fleet-recipient', hasSelection ? `Aktuelle Auswahl: ${recipients.label}` : 'Wähle einen Verband, ein einzelnes Schiff oder die gesamte Flotte.');
  $('select-fleet').disabled = !own.some(activeShip);
  if ($('own-dialog').open) {
    for (const [id, button] of groupButtons) {
      const members = own.filter(s => s.group === id), active = members.filter(activeShip);
      button.disabled = !active.length; pressed(button, hasSelection && battle.scope === 'group' && battle.selectedGroup === id);
      button.lastElementChild.textContent = `${active.length} / ${members.length} aktiv`;
    }
    const term = $('own-search').value.trim().toLocaleLowerCase('de'); let visible = 0;
    for (const ship of own) {
      const button = ownButtons.get(ship.id); button.disabled = !activeShip(ship); pressed(button, hasSelection && battle.scope === 'ship' && ship.id === selectionId);
      button.hidden = Boolean(term && !`${ship.name} ${ship.className}`.toLocaleLowerCase('de').includes(term)); if (!button.hidden && activeShip(ship)) visible++;
      button.lastElementChild.textContent = `${Math.round(ship.hull / DEMO_CLASSES[ship.type].hull * 100)} % · ${ship.order === 'retreat' ? 'Rückzug' : ship.combat.power ? 'bewaffnet' : 'unbewaffnet'}`;
    }
    $('own-empty').hidden = visible > 0;
  }
  const inspected = battle.ships.find(s => s.id === inspectedId);
  if (inspected) {
    text('selection-name', inspected.name); text('selection-class', `${inspected.side === 'friendly' ? 'EIGENES SCHIFF' : 'GEGNER'} · ${inspected.className}`);
    text('selection-state', activeShip(inspected) ? `Hülle ${Math.round(inspected.hull / DEMO_CLASSES[inspected.type].hull * 100)} % · Panzerung ${Math.round(inspected.combat.armor*100)} % · Versorgung ${Math.round(inspected.supply)} % · Stärke ${number.format(shipStrength(inspected))}` : 'Außer Gefecht');
    $('select-own-group').hidden = inspected.side !== 'friendly' || !inspected.group;
    $('select-own-group').disabled = !activeShip(inspected);
    text('select-own-group', `${battle.formations?.find(g => g.id === inspected.group)?.name ?? 'Verband'} auswählen`);
    text('selection-order', `Aktueller Auftrag: ${commandStatus(battle, inspected).label}`);
    $('inspect-selected').disabled = !activeShip(inspected); $('select-own').hidden = inspected.side !== 'friendly'; $('select-own').disabled = !activeShip(inspected) || battle.phase !== 'engaged';
    $('use-target').hidden = inspected.side !== 'enemy' || !hasSelection; $('use-target').disabled = !activeShip(inspected) || battle.phase !== 'engaged';
    $('info-own-picker').hidden = inspected.side !== 'enemy' || hasSelection;
  }
  text('battle-state', battle.phase !== 'engaged' ? 'Gefecht beendet' : paused ? pauseReason === 'tactical' ? 'Taktikpause · ▶' : 'Pausiert · ▶' : 'Gefecht läuft');
  text('battle-pause', paused ? '▶' : 'Ⅱ'); $('battle-pause').setAttribute('aria-label', paused ? 'Schlacht fortsetzen' : 'Schlacht pausieren'); $('battle-pause').disabled = battle.phase !== 'engaged';
  text('commands-label', battle.phase === 'engaged' ? 'Befehle' : 'Ergebnis');
  $('commands-open').setAttribute('aria-label', battle.phase !== 'engaged' ? 'Gefechtsergebnis öffnen' : hasSelection ? `Befehle für ${recipients.label}` : 'Befehlseinheit auswählen');
  if ($('contacts-dialog').open) { contacts.paint(); $('contact-priority').hidden = !returnToOrders || !hasSelection; }
  if ($('result-dialog').open) paintResult();
  if ($('render-dialog').open) {
    const median = frames.length ? [...frames].sort((a,b)=>a-b)[Math.floor(frames.length/2)] : 0;
    text('performance-readout', `${median ? Math.round(1/median)+' Bilder/s im letzten Lauf' : 'Noch keine Messung'} · ${graphics === 'auto' ? 'Automatische Auflösung' : graphics === 'detail' ? 'Mehr Details' : 'Flüssiger'}`);
    for (const node of document.querySelectorAll('[data-graphics]')) pressed(node, node.dataset.graphics === graphics);
  }
}
function labels() {
  const overview = view.mode === 'overview';
  for (const [side, node] of markers) {
    const count = battle.ships.filter(s => s.side === side && activeShip(s)).length;
    node.hidden = !overview || !count; if (node.hidden) continue;
    const p = view.labelPosition(`fleet:${side}`, battle); if (!p) { node.hidden = true; continue; }
    node.firstElementChild.textContent = `${p.offscreen ? p.arrow + ' ' : ''}${side === 'friendly' ? 'Eigene' : 'Gegner'}`;
    node.lastElementChild.textContent = String(count);
    // Keep the two labels outside the hull clusters instead of covering the ships.
    const edge = side === 'friendly' ? p.bottom : p.top;
    const y = Number.isFinite(edge) ? edge + (side === 'friendly' ? 24 : -24) : p.y;
    node.style.left = `${Math.max(62, Math.min(innerWidth - 62, p.x))}px`;
    node.style.top = `${Math.max(view.viewportTop + 40, Math.min(view.viewportBottom - 25, y))}px`;
  }
}
document.addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button) return;
  if (button.dataset.close) { $(button.dataset.close).close(); if (button.dataset.close === 'info-dialog' && view) {view.highlightId = null;view.dirty = true;} return; }
  if (button.dataset.return) { openDialog(button.dataset.return); return; }
  if (button.id === 'restart' || button.id === 'retry' || button.id === 'result-restart') { void start($('scenario-select').value,button.id==='retry',button.id==='result-restart'&&battle?.plan?structuredClone(battle.plan):null); return; }
  if (button.id === 'source-refresh') { loadSource(); notice(savedEmpire?'Aktueller Spielstand für die nächste Probe eingelesen.':'Kein lesbarer Spielstand vorhanden.');return; }
  if (!ready) return;
  if (button.hasAttribute('data-open-planner')) { planner.open(); return; }
  if (button.dataset.group) { selectGroup(button.dataset.group); return; }
  if (button.dataset.ship) { selectContact(button.dataset.ship); return; }
  if (button.dataset.marker) { if (button.dataset.marker === 'fleet:friendly') openDialog('own-dialog'); else openContacts(); }
  else if (button.dataset.camera) setCamera(button.dataset.camera);
  else if (button.dataset.scope) {
    if (button.dataset.scope === 'ship' && battle.scope !== 'ship') { openDialog('own-dialog'); $('ship-selector').closest('details').open = true; ownToOrders = true; }
    else {
      if (button.dataset.scope === 'group') battle.selectedGroup = battle.ships.find(s => s.id === battle.selected).group;
      if (commandDemo(battle, 'scope', button.dataset.scope)) { hasSelection = true; selectionId = battle.selected; }
    }
  }
  else if (button.dataset.graphics) { graphics = button.dataset.graphics; view.setGraphics(graphics); }
  else if (button.id === 'battle-pause') { if(document.querySelector('dialog[open]'))return; paused = !paused; pauseReason = paused ? 'manual' : null; lastFrame = 0; persistTrial(); }
  else if (button.id === 'fleet-open' || button.id === 'info-own-picker') openDialog('own-dialog');
  else if (button.id === 'commands-open') { if(battle.phase!=='engaged')showResult();else openDialog(hasSelection?'orders-dialog':'own-dialog'); }
  else if (button.id === 'own-picker') { openDialog('own-dialog'); ownToOrders = true; }
  else if (button.id === 'select-fleet') { commandDemo(battle,'scope','fleet'); hasSelection = true; selectionId = battle.selected; openDialog('orders-dialog'); }
  else if (button.id === 'clear-selection' || button.id === 'clear-orders-selection') clearSelection();
  else if (button.id === 'graphics-open') openDialog('menu-dialog');
  else if (button.id === 'setup-open') openDialog('graphics-dialog');
  else if (button.id === 'render-open') openDialog('render-dialog');
  else if (button.id === 'help-open') openDialog('help-dialog');
  else if (button.id === 'target-picker') openContacts(true);
  else if (button.id === 'enemy-picker') openContacts();
  else if (button.id === 'target-view') setCamera('target', true, battle.target);
  else if (button.id === 'select-own') selectContact(inspectedId);
  else if (button.id === 'select-own-group') selectGroup(battle.ships.find(s => s.id === inspectedId)?.group);
  else if (button.id === 'use-target' && hasSelection) { battle.target = inspectedId; openDialog('orders-dialog'); }
  else if (button.id === 'inspect-selected') { const ship = battle.ships.find(s => s.id === inspectedId); setCamera(ship?.side === 'enemy'?'target':'ship', true, inspectedId); }
  else if (button.id === 'attack-target' && hasSelection && commandDemo(battle, 'attack')) { closeDialogs(); notice(`${recipientInfo(battle).label}: Angriff auf ${battle.ships.find(s=>s.id===battle.target).name} zugewiesen · mit ▶ fortsetzen.`); }
  else if (button.id === 'auto-target' && hasSelection && commandDemo(battle, 'auto')) { closeDialogs(); notice(`${recipientInfo(battle).label}: automatische Zielwahl · mit ▶ fortsetzen.`); }
  else if (button.id === 'retreat' && hasSelection && commandDisplay(battle).canRetreat) openDialog('retreat-dialog');
  else if (button.id === 'confirm-retreat' && hasSelection && commandDemo(battle, 'retreat')) { closeDialogs(); notice('Rückzug verbindlich erteilt · mit ▶ fortsetzen.'); }
  if(button.dataset.scope||['attack-target','auto-target','confirm-retreat'].includes(button.id))persistTrial();
  paint(); lastRender = 0;
});
$('source-mode').addEventListener('change',updateSetup);
$('own-search').addEventListener('input',paint);
$('show-target-links').addEventListener('change',()=>{if(view){view.showSelectionLinks=$('show-target-links').checked;view.dirty=true;lastRender=0;}});
globalThis.visualViewport?.addEventListener('resize',menuViewport);
window.addEventListener('resize',menuViewport);
for (const event of ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']) document.addEventListener(event, () => { void audio.unlock(); sound.unlock(); }, { capture: true, passive: true });
document.addEventListener('visibilitychange', () => { audio.setHidden(document.hidden); sound.hidden(document.hidden); lastFrame = 0; if (document.hidden) { paused = true; pauseReason='manual'; if (battle) {persistTrial();paint();} } });
window.addEventListener('pagehide', event => { persistTrial(); paused = true; sound.hidden(true); audio.setHidden(true); if (!event.persisted || !ready) { ++generation; ready = false; view?.dispose(); sound.dispose(); } });
window.addEventListener('pageshow', () => { audio.setHidden(document.hidden); lastFrame = 0; if (view?.disposed) void start(scenario,true); else viewport(); });
new ResizeObserver(() => { if (view) { viewport(); if (ready) setCamera(view.mode, false); } }).observe($('battle-app'));
function frame(now) {
  const raw = lastFrame ? Math.max(0, (now - lastFrame) / 1000) : 0, seconds = Math.min(.25, raw); lastFrame = now;
  if (ready && !document.hidden) {
    const running = !paused && battle.phase === 'engaged';
    const events = running ? advanceBattleTrial(battle, seconds / 3) : []; pending.push(...events); if (!paused) visualTime += seconds;
    const active = running || !paused && view.animating || view.transition || view.dirty || !lastRender || pending.length;
    if (active && (!lastRender || now - lastRender >= 1000 / 30 - 1)) {
      const duration = lastRender ? Math.max(0, (now - lastRender) / 1000) : 0;
      if (running && duration > 0 && duration < 1) { frames.push(duration); if (frames.length > 120) frames.shift(); }
      if (graphics === 'auto') view.observeQuality(duration / 2, running);
      view.render(battle, visualTime, pending, paused ? 0 : Math.min(.1, duration)); pending.length = 0; lastRender = now; labels();
    }
    if (events.length) {
      sound.play(events, battle, view.mode === 'target' ? battle.target : battle.selected);
      if (events.some(e => e.kind === 'order-complete')) notice('Angriffsziel zerstört · Zielwahl wieder automatisch.');
      if (battle.phase !== 'engaged') {persistTrial();notice(resultText());}
    }
    if(running&&now-lastCheckpoint>1000){persistTrial();lastCheckpoint=now;}
    if (now - lastHud > 200) { paint(); lastHud = now; }
  }
  requestAnimationFrame(frame);
}
loadSource(); void start(scenario,true); requestAnimationFrame(frame);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
if (new URLSearchParams(location.search).has('debug')) globalThis.ORBIT_TRIAL_DEBUG = {
  get battle() { return battle; }, get view() { return view; }, get ready() { return ready; }, get paused() { return paused; },
  get selection() { return hasSelection ? {scope:battle.scope,selected:battle.selected,group:battle.selectedGroup} : null; }, get pauseReason() { return pauseReason; }, inspectContact,
  get planner() { return planner; }, selectGroup,
  get frameDurations() { return [...frames]; }, setCamera, selectContact, paint, start, pause:()=>{paused=true;lastFrame=0;},
  advance:days=>{const events=advanceBattleTrial(battle,days);pending.push(...events);persistTrial();paint();return events;},
};
