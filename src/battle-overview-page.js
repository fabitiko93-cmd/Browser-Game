import { HarbingerScene } from './harbinger-scene.js';
import { createOverviewBattle, advanceOverviewBattle, OVERVIEW_SCENARIOS } from './battle-overview.js';
import { selectDemoShip, commandDemo, activeShip, DEMO_CLASSES, KM_PER_UNIT } from './battle-demo.js';
import { formationCenter } from './battle-overview.js';
import { commandDisplay } from './harbinger-display.js';
import { TargetPanel } from './battle-targets-ui.js';
import { CONTACT_GROUPS, contactInfo } from './battle-targets.js';
import { MediaAudio } from './audio-media.js';
import { BattleAudio } from './battle-audio.js';

const $ = id => document.getElementById(id);
const number = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const audio = new MediaAudio(), sound = new BattleAudio(() => audio.settings);
const frames = [], markers = new Map(), ownButtons = new Map();
let battle, view, ready = false, paused = false, generation = 0, lastFrame = 0, lastRender = 0, lastHud = 0;
let visualTime = 0, pending = [], noticeTimer, inspectedId = null, returnToOrders = false, ownToOrders = false, graphics = 'auto';
const requested = new URLSearchParams(location.search).get('scenario');
let scenario = Object.hasOwn(OVERVIEW_SCENARIOS, requested) ? requested : '20v20';
function text(id, value) { const node = $(id); if (node.textContent !== String(value)) node.textContent = value; }
function pressed(node, value) { node.setAttribute('aria-pressed', String(value)); }
function closeDialogs() {
  returnToOrders = ownToOrders = false;
  for (const dialog of document.querySelectorAll('dialog[open]')) dialog.close();
}
function openDialog(id) { closeDialogs(); $(id).showModal(); paint(); }
function openContacts(fromOrders = false) { closeDialogs(); returnToOrders = fromOrders; contacts.open(); }
function viewport() {
  if (!view) return;
  view.resize(); $('battle-notice').style.top = `${view.viewportTop + 30}px`; $('view-caption').style.top = `${view.viewportTop + 3}px`;
}
function notice(message) {
  clearTimeout(noticeTimer); text('battle-notice', message);
  noticeTimer = setTimeout(() => text('battle-notice', ''), 3600);
}
function setCamera(mode, animated = true) {
  closeDialogs(); view.setMode(mode, battle, animated);
  for (const node of document.querySelectorAll('[data-camera]')) pressed(node, node.dataset.camera === mode);
  pressed($('target-view'), mode === 'target');
  text('camera-caption', ({ ship: 'SCHIFFSANSICHT', fleet: 'EIGENE FORMATION', overview: 'GESAMTANSICHT', target: 'GEGNERANSICHT' })[mode]);
  $('battle-canvas').setAttribute('aria-label', mode === 'overview' ? '3D-Schlachtübersicht. Ein Finger verschiebt, zwei Finger zoomen. Schiffe antippen zum Auswählen.' : '3D-Schiffsansicht. Ein Finger dreht, zwei Finger zoomen und verschieben.');
  $('selection-card').hidden = true; view.highlightId = null; viewport(); lastRender = 0;
}
function selectContact(id) {
  if (!selectDemoShip(battle, id)) return false;
  const ship = battle.ships.find(s => s.id === id), back = ownToOrders;
  inspectedId = id; $('own-dialog').close(); ownToOrders = false;
  if (ship.side === 'friendly' && view.mode === 'ship') setCamera('ship');
  else if (ship.side === 'enemy' && view.mode === 'target') setCamera('target');
  $('selection-card').hidden = false; view.highlightId = id;
  if (back) openDialog('orders-dialog');
  paint(); lastRender = 0; return true;
}
const contacts = new TargetPanel($('contacts-dialog'), {
  getBattle: () => battle, onSelect: selectContact,
  onInspect: () => { returnToOrders = false; setCamera('target'); },
  onPriority: type => {
    if (!commandDemo(battle, 'priority', type)) return false;
    const target = battle.ships.find(s => s.side === 'enemy' && s.type === type && activeShip(s));
    if (target) selectContact(target.id);
    notice(`Angriffspriorität: ${CONTACT_GROUPS[type]}.`); paint(); return true;
  },
});
$('contacts-dialog').addEventListener('close', () => { if (returnToOrders) { returnToOrders = false; $('orders-dialog').showModal(); } });
function initializeHud() {
  ownButtons.clear(); markers.clear(); $('ship-selector').replaceChildren(); $('ship-labels').replaceChildren();
  for (const ship of battle.ships.filter(s => s.side === 'friendly')) {
    const button = document.createElement('button'); button.dataset.ship = ship.id;
    const name = document.createElement('span'), detail = document.createElement('small'), hull = document.createElement('span');
    name.textContent = ship.name; detail.textContent = DEMO_CLASSES[ship.type].name;
    name.append(detail); button.append(name, hull); $('ship-selector').append(button); ownButtons.set(ship.id, button);
  }
  for (const side of ['friendly', 'enemy']) {
    const node = document.createElement('button'); node.dataset.marker = `fleet:${side}`;
    node.className = `lab-marker ${side === 'enemy' ? 'enemy' : ''}`;
    node.append(document.createElement('span'), document.createElement('small'));
    $('ship-labels').append(node); markers.set(side, node);
  }
  $('scenario-select').value = scenario;
}
function failed(error) {
  ready = false; paused = true; $('battle-loading').hidden = true; $('battle-error').hidden = false;
  text('battle-error-text', error.message?.includes('WebGL') ? 'Die 3D-Ansicht konnte nicht starten. Bitte in aktuellem Safari erneut öffnen.' : 'Modelle oder Materialien konnten nicht vollständig geladen werden. Bitte Verbindung prüfen und erneut versuchen.');
  console.error('Harbinger initialization:', error);
}
async function start(nextScenario = scenario) {
  scenario = Object.hasOwn(OVERVIEW_SCENARIOS, nextScenario) ? nextScenario : '20v20';
  const run = ++generation; ready = false; paused = false; lastFrame = lastRender = lastHud = visualTime = 0;
  pending = []; frames.length = 0; inspectedId = null; clearTimeout(noticeTimer); closeDialogs();
  view?.dispose(); view = null; const old = $('battle-canvas'); old.replaceWith(old.cloneNode(false));
  battle = createOverviewBattle(scenario); contacts.reset(); initializeHud(); text('battle-notice', ''); $('selection-card').hidden = true;
  const url = new URL(location.href); url.searchParams.set('scenario', scenario); history.replaceState(null, '', url);
  $('battle-error').hidden = true; $('battle-loading').hidden = false; $('load-bar').style.width = '5%'; text('loading-progress', 'Schiffsmodelle laden …');
  try {
    const next = new HarbingerScene($('battle-canvas'), {
      onSelect: id => { if (ready) selectContact(id); }, onUnavailable: message => failed(new Error(message)),
      onAssetProgress: (loaded, total) => {
        if (run !== generation) return;
        const percent = Math.round(loaded / total * 100);
        text('loading-progress', percent === 100 ? 'Verbände und Licht vorbereiten …' : `Harbinger laden · ${percent} %`);
        $('load-bar').style.width = `${5 + loaded / total * 85}%`;
      },
    });
    view = next; await next.load(battle); if (run !== generation) { next.dispose(); return; }
    next.setGraphics(graphics); ready = true; $('battle-loading').hidden = true;
    setCamera('overview', false); paint(); view.render(battle, 0); labels();
  } catch (error) { if (run !== generation) return; view?.dispose(); view = null; failed(error); }
}
function paint() {
  const own = battle.ships.filter(s => s.side === 'friendly'), selected = own.find(s => s.id === battle.selected), def = DEMO_CLASSES[selected.type];
  const target = battle.ships.find(s => s.id === battle.target), info = target && contactInfo(target, selected), display = commandDisplay(battle);
  text('friendly-count', own.filter(activeShip).length); text('enemy-count', battle.ships.filter(s => s.side === 'enemy' && activeShip(s)).length);
  const a = formationCenter(battle, 'friendly'), b = formationCenter(battle, 'enemy');
  text('battle-range', `Linienabstand ${number.format(Math.hypot(...a.map((v, i) => v - b[i])) * KM_PER_UNIT)} km`);
  text('battle-day', `Tag ${number.format(battle.day)}`); text('selected-name', selected.name); text('selected-class', def.name.toUpperCase()); text('selected-order', display.label);
  text('orders-heading', battle.scope === 'fleet' ? 'Befehle · Eigene Flotte' : `Befehle · ${selected.name}`);
  const hull = Math.round(selected.hull / def.hull * 100), shield = Math.round(selected.shield / def.shield * 100);
  text('hull-value', hull); text('shield-value', shield); $('hull-bar').style.width = `${hull}%`; $('shield-bar').style.width = `${shield}%`;
  text('target-name', target?.name ?? 'Kein Gegner'); text('target-distance', info ? `${number.format(info.distance)} km` : ''); text('target-state', display.chosenState);
  $('attack-target').disabled = !display.canAttack; $('auto-target').disabled = $('retreat').disabled = !display.canCommand;
  $('target-picker').disabled = !battle.ships.some(s => s.side === 'enemy' && activeShip(s)); $('target-view').disabled = !info?.active;
  pressed($('auto-target'), display.auto); $('attack-target').setAttribute('aria-label', `${battle.scope === 'fleet' ? 'Eigene Flotte' : selected.name}: ${target?.name ?? 'Gegner'} angreifen`);
  for (const node of document.querySelectorAll('[data-scope]')) pressed(node, node.dataset.scope === battle.scope);
  if ($('own-dialog').open) for (const ship of own) {
    const button = ownButtons.get(ship.id); button.disabled = !activeShip(ship); pressed(button, ship.id === selected.id);
    button.lastElementChild.textContent = `${Math.round(ship.hull / DEMO_CLASSES[ship.type].hull * 100)} %`;
  }
  const inspected = battle.ships.find(s => s.id === inspectedId);
  if (inspected) {
    const spec = DEMO_CLASSES[inspected.type]; text('selection-name', inspected.name);
    text('selection-class', `${inspected.side === 'friendly' ? 'EIGENES SCHIFF' : 'GEGNER'} · ${spec.name}`);
    text('selection-state', activeShip(inspected) ? `Hülle ${Math.round(inspected.hull / spec.hull * 100)} % · Schild ${Math.round(inspected.shield / spec.shield * 100)} %` : 'Außer Gefecht');
    $('inspect-selected').disabled = !activeShip(inspected);
  }
  text('battle-pause', paused ? '▶' : 'Ⅱ'); $('battle-pause').setAttribute('aria-label', paused ? 'Gefechtszeit fortsetzen' : 'Gefechtszeit pausieren'); $('battle-pause').disabled = battle.phase !== 'engaged';
  if ($('contacts-dialog').open) contacts.paint();
  if ($('graphics-dialog').open && view) {
    const median = frames.length ? [...frames].sort((a, b) => a - b)[Math.floor(frames.length / 2)] : 0;
    const state = paused ? 'Pausiert' : battle.phase !== 'engaged' ? 'Gefechtsende' : median ? `${Math.round(1 / median)} Bilder/s` : 'Messung läuft';
    text('performance-readout', `${state} · ${graphics === 'auto' ? 'Automatische Auflösung' : graphics === 'detail' ? 'Mehr Details' : 'Flüssiger'}`);
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
  if (button.dataset.close) { $(button.dataset.close).close(); return; }
  if (button.id === 'restart' || button.id === 'retry') { void start($('scenario-select').value); return; }
  if (!ready) return;
  if (button.dataset.ship) { selectContact(button.dataset.ship); return; }
  if (button.dataset.marker) { if (button.dataset.marker === 'fleet:friendly') openDialog('own-dialog'); else openContacts(); }
  else if (button.dataset.camera) setCamera(button.dataset.camera);
  else if (button.dataset.scope) commandDemo(battle, 'scope', button.dataset.scope);
  else if (button.dataset.graphics) { graphics = button.dataset.graphics; view.setGraphics(graphics); }
  else if (button.id === 'battle-pause') { paused = !paused; lastFrame = 0; }
  else if (button.id === 'fleet-open') openDialog('own-dialog');
  else if (button.id === 'commands-open') openDialog('orders-dialog');
  else if (button.id === 'own-picker') { openDialog('own-dialog'); ownToOrders = true; }
  else if (button.id === 'graphics-open') openDialog('graphics-dialog');
  else if (button.id === 'target-picker') openContacts(true);
  else if (button.id === 'enemy-picker') openContacts();
  else if (button.id === 'target-view') setCamera('target');
  else if (button.id === 'selection-close') { $('selection-card').hidden = true; view.highlightId = null; }
  else if (button.id === 'inspect-selected') { const ship = battle.ships.find(s => s.id === inspectedId); setCamera(ship?.side === 'enemy' ? 'target' : 'ship'); }
  else if (button.id === 'attack-target' && commandDemo(battle, 'attack')) { closeDialogs(); notice(`${battle.scope === 'fleet' ? 'Flotte' : battle.ships.find(s => s.id === battle.selected).name} greift ${battle.ships.find(s => s.id === battle.target).name} an.`); }
  else if (button.id === 'auto-target' && commandDemo(battle, 'auto')) { closeDialogs(); notice('Automatische Zielwahl aktiv.'); }
  else if (button.id === 'retreat' && commandDemo(battle, 'retreat')) { closeDialogs(); notice('Rückzug eingeleitet.'); }
  paint(); lastRender = 0;
});
for (const event of ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']) document.addEventListener(event, () => { void audio.unlock(); sound.unlock(); }, { capture: true, passive: true });
document.addEventListener('visibilitychange', () => { audio.setHidden(document.hidden); sound.hidden(document.hidden); lastFrame = 0; if (document.hidden) { paused = true; if (battle) paint(); } });
window.addEventListener('pagehide', event => { paused = true; sound.hidden(true); audio.setHidden(true); if (!event.persisted || !ready) { ++generation; ready = false; view?.dispose(); sound.dispose(); } });
window.addEventListener('pageshow', () => { audio.setHidden(document.hidden); lastFrame = 0; if (view?.disposed) void start(); else viewport(); });
new ResizeObserver(() => { if (view) { viewport(); if (ready) setCamera(view.mode, false); } }).observe($('battle-app'));
function frame(now) {
  const raw = lastFrame ? Math.max(0, (now - lastFrame) / 1000) : 0, seconds = Math.min(.1, raw); lastFrame = now;
  if (ready && !document.hidden) {
    const running = !paused && battle.phase === 'engaged';
    const events = running ? advanceOverviewBattle(battle, seconds / 3) : []; pending.push(...events); if (!paused) visualTime += seconds;
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
      if (battle.phase !== 'engaged') notice(({ victory: 'Gegnerische Flotte ausgeschaltet.', defeat: 'Eigene Flotte verloren.', withdrawn: 'Rückzug abgeschlossen.' })[battle.phase]);
    }
    if (now - lastHud > 200) { paint(); lastHud = now; }
  }
  requestAnimationFrame(frame);
}
void start(); requestAnimationFrame(frame);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
if (new URLSearchParams(location.search).has('debug')) globalThis.ORBIT_HARBINGER_DEBUG = {
  get battle() { return battle; }, get view() { return view; }, get ready() { return ready; }, get paused() { return paused; },
  get frameDurations() { return [...frames]; }, setCamera, selectContact, paint, start,
};
