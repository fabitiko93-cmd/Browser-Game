import { BattleScene } from './battle-scene.js';
import { createDemoBattle, advanceDemoBattle, selectDemoShip, commandDemo, commandedShips, commandStatus, activeShip, DEMO_CLASSES, fleetDistanceKm, WEAPONS } from './battle-demo.js';
import { MediaAudio } from './audio-media.js';
import { BattleAudio } from './battle-audio.js';
import { TargetPanel } from './battle-targets-ui.js';
import { CONTACT_GROUPS, contactInfo } from './battle-targets.js';
import { BattleTactical } from './battle-tactical.js';

const $ = id => document.getElementById(id), audio = new MediaAudio(), battleAudio = new BattleAudio(() => audio.settings);
let battle, view, ready = false, paused = false, speed = 1, lastFrame = 0, lastRender = 0, visualTime = 0, lastHud = 0, generation = 0;
let pendingEvents = [], noticeTimer;
const shipButtons = new Map(), labelNodes = [];
const dayFormat = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
function setText(id, text) { const element = $(id); if (element.textContent !== String(text)) element.textContent = text; }
function setDisabled(id, value) { if ($(id).disabled !== value) $(id).disabled = value; }
function pressed(element, value) { if (element.getAttribute('aria-pressed') !== String(value)) element.setAttribute('aria-pressed', String(value)); }
function scopeName() { return battle.scope === 'fleet' ? 'Eigene Flotte' : battle.ships.find(s => s.id === battle.selected).name; }
function viewport() {
  if (!view) return;
  view.resize();
  $('battle-notice').style.top = `${view.viewportTop + 4}px`;
  $('tactical-view').style.top = `${view.viewportTop}px`;
  $('tactical-view').style.height = `${Math.max(1, view.viewportBottom - view.viewportTop - 8)}px`;
}
function setCamera(mode) {
  view.setMode(mode, battle);
  for (const button of document.querySelectorAll('[data-camera]')) pressed(button, button.dataset.camera === mode);
  pressed($('target-view'), mode === 'target');
  $('target-view').textContent = mode === 'target' ? 'Zurück' : 'Ansehen';
  $('tactical-view').hidden = mode !== 'overview';
  $('target-hud').classList.toggle('tactical', mode === 'overview');
  viewport(); lastRender = 0;
}
function selectContact(id) {
  const side = battle.ships.find(ship => ship.id === id)?.side;
  if (!selectDemoShip(battle, id)) return false;
  if (view.mode === 'ship' && side === 'friendly') setCamera('ship');
  else if (view.mode === 'target' && side === 'enemy') setCamera('target');
  audio.play('confirm'); paint(); lastRender = 0; return true;
}
const tactical = new BattleTactical($('tactical-canvas'), id => { if (ready) selectContact(id); });
const targetPanel = new TargetPanel($('contacts-dialog'), {
  getBattle: () => battle, onSelect: selectContact,
  onPriority: type => {
    if (!commandDemo(battle, 'priority', type)) return false;
    const target = battle.ships.find(ship => ship.side === 'enemy' && ship.type === type && activeShip(ship));
    if (target) selectContact(target.id);
    notice(`${scopeName()}: Angriff auf ${CONTACT_GROUPS[type]}.`); paint(); lastRender = 0; return true;
  },
  onInspect: () => setCamera('target'),
});
function initializeHud() {
  shipButtons.clear(); $('ship-selector').replaceChildren();
  for (const ship of battle.ships.filter(s => s.side === 'friendly')) {
    const button = document.createElement('button'); button.dataset.ship = ship.id; button.textContent = ship.name;
    $('ship-selector').append(button); shipButtons.set(ship.id, button);
  }
  $('ship-labels').replaceChildren(); labelNodes.length = 0;
  for (let i = 0; i < 2; i++) { const label = document.createElement('span'); label.className = 'ship-label'; label.hidden = true; $('ship-labels').append(label); labelNodes.push(label); }
}
function notice(text, persistent = false) {
  clearTimeout(noticeTimer); setText('battle-notice', text); if (ready) viewport();
  if (text && !persistent) noticeTimer = setTimeout(() => { setText('battle-notice', ''); if (ready) viewport(); }, 4200);
}
function failed(message) { ready = false; paused = true; $('battle-loading').hidden = true; setText('battle-error-text', message); $('battle-error').hidden = false; }
async function start() {
  const currentGeneration = ++generation;
  ready = false; paused = false; lastFrame = 0; lastRender = 0; visualTime = 0; lastHud = 0; pendingEvents = [];
  view?.dispose(); view = null;
  const oldCanvas = $('battle-canvas'); oldCanvas.replaceWith(oldCanvas.cloneNode(false));
  battle = createDemoBattle(); targetPanel.reset(); initializeHud();
  $('tactical-view').hidden = true; $('battle-loading').hidden = false; $('battle-error').hidden = true;
  setText('loading-progress', 'Quaternius-Schiffe laden …'); notice('');
  try {
    view = new BattleScene($('battle-canvas'), {
      onSelect: id => { if (ready) selectContact(id); }, onUnavailable: failed,
      onProgress: (loaded, total) => { if (currentGeneration === generation) setText('loading-progress', `${loaded} von ${total} Schiffstypen bereit`); },
    });
    const loadingView = view; await loadingView.load(battle);
    if (currentGeneration !== generation) { loadingView.dispose(); return; }
    ready = true; $('battle-loading').hidden = true;
    paint(); viewport(); view.setMode('ship', battle, false); view.render(battle, 0);
    for (const button of document.querySelectorAll('[data-camera]')) pressed(button, button.dataset.camera === 'ship');
    pressed($('target-view'), false); setText('target-view', 'Ansehen');
  } catch (error) {
    if (currentGeneration !== generation) return;
    view?.dispose(); view = null;
    failed(error.message?.includes('WebGL') ? 'Dieser Browser konnte keine 3D-Ansicht starten. Öffne das Spiel in einem aktuellen Safari oder versuche es erneut.' : 'Die Schiffsmodelle oder die Grafik konnten nicht vollständig geladen werden. Prüfe die Verbindung und versuche es erneut.');
  }
}
function paint() {
  const friendly = battle.ships.filter(s => s.side === 'friendly'), enemy = battle.ships.filter(s => s.side === 'enemy' && activeShip(s));
  const ship = friendly.find(s => s.id === battle.selected), def = DEMO_CLASSES[ship.type];
  setText('friendly-count', friendly.filter(activeShip).length); setText('enemy-count', enemy.length);
  setText('battle-day', `Tag ${dayFormat.format(battle.day)}`); setText('battle-range', `Flottenabstand · ${dayFormat.format(fleetDistanceKm(battle))} km`);
  for (const own of friendly) {
    const button = shipButtons.get(own.id), selected = own.id === battle.selected, disabled = !activeShip(own);
    button.classList.toggle('selected', selected); button.classList.toggle('disabled', disabled); button.disabled = disabled; pressed(button, selected);
  }
  for (const button of document.querySelectorAll('[data-scope]')) pressed(button, battle.scope === button.dataset.scope);
  setText('selected-name', ship.name); setText('selected-class', def.name); setText('selected-weapon', WEAPONS[def.weapon].name);
  const recipients = commandedShips(battle), available = recipients.filter(own => own.order !== 'retreat');
  let status = commandStatus(battle, ship).label;
  if (battle.scope === 'fleet') {
    const keys = new Set(recipients.map(own => `${own.order}:${own.targeting}:${own.commandTarget}:${own.priority}`));
    status = keys.size > 1 ? `Eigene Flotte · gemischte Aufträge (${recipients.length} Schiffe)`
      : recipients.length ? recipients[0].targeting === 'auto' && recipients[0].order !== 'retreat' ? 'Eigene Flotte · automatische Einzelziele' : `Eigene Flotte · ${commandStatus(battle, recipients[0]).label}` : 'Eigene Flotte außer Gefecht';
  }
  setText('selected-order', status);
  const hull = Math.round(ship.hull / def.hull * 100), shield = Math.round(ship.shield / def.shield * 100);
  setText('hull-value', `${hull} %`); setText('shield-value', `${shield} %`);
  $('hull-bar').style.width = `${hull}%`; $('shield-bar').style.width = `${shield}%`;
  $('hull-bar').parentElement.classList.toggle('damaged', hull < 30);
  const target = battle.ships.find(s => s.id === battle.target), info = target && contactInfo(target, ship);
  setText('target-name', target?.name ?? 'Kein Ziel'); setText('target-distance', info ? `${dayFormat.format(info.distance)} km` : '');
  setText('target-health', info ? `Hülle ${info.hull} % · Schild ${info.shield} %` : '');
  $('target-shield-bar').style.width = `${info?.shield ?? 0}%`;
  const assigned = available.filter(own => own.targeting === 'target' && own.commandTarget === target?.id);
  setText('target-state', info && !info.active ? 'Zerstört · neues Ziel wählen' : assigned.length ? `${assigned.length} Angriff${assigned.length === 1 ? '' : 'e'} befohlen` : 'Auswahl für nächsten Auftrag');
  setDisabled('target-picker', !enemy.length); setDisabled('target-view', !info?.active && view?.mode !== 'target');
  setDisabled('attack-target', battle.phase !== 'engaged' || !available.length || !info?.active);
  setDisabled('auto-target', battle.phase !== 'engaged' || !available.length);
  setDisabled('retreat', battle.phase !== 'engaged' || !available.length);
  pressed($('auto-target'), available.length > 0 && available.every(own => own.targeting === 'auto'));
  $('attack-target').setAttribute('aria-label', `${scopeName()}: ${target?.name ?? 'gewähltes Ziel'} angreifen`);
  $('auto-target').setAttribute('aria-label', `${scopeName()}: automatische Zielwahl`);
  $('retreat').setAttribute('aria-label', `${scopeName()}: Rückzug`);
  setText('battle-pause', paused ? '▶' : 'Ⅱ'); $('battle-pause').setAttribute('aria-label', paused ? 'Probeschlacht fortsetzen' : 'Probeschlacht pausieren');
  setText('battle-speed', `${speed}×`);
  const results = { victory: 'Gegnerische Flotte ausgeschaltet.', defeat: 'Eigene Flotte verloren.', withdrawn: 'Rückzug abgeschlossen.' };
  if (results[battle.phase]) { if ($('battle-notice').textContent !== results[battle.phase]) notice(results[battle.phase], true); setDisabled('battle-pause', true); }
  else setDisabled('battle-pause', false);
  if ($('contacts-dialog').open) targetPanel.paint();
}
function labels() {
  if (view.mode === 'overview') { for (const label of labelNodes) label.hidden = true; $('focus-bracket').hidden = true; tactical.render(battle); return; }
  const ids = [view.mode === 'target' ? battle.target : battle.selected, view.mode === 'target' ? 'fleet:friendly' : 'fleet:enemy'];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i], label = labelNodes[i], ship = battle.ships.find(s => s.id === id), side = ship?.side ?? id.split(':')[1], position = view.labelPosition(id, battle);
    label.hidden = !position; if (label.hidden) continue;
    const remote = id.startsWith('fleet:');
    const text = ship?.name.toUpperCase() ?? `${position.offscreen ? position.arrow + ' ' : ''}${side === 'friendly' ? 'EIGENE FLOTTE' : 'FEINDFLOTTE'} · ${dayFormat.format(fleetDistanceKm(battle))} km`;
    if (label.textContent !== text) label.textContent = text;
    label.classList.toggle('enemy', side === 'enemy'); label.classList.toggle('remote', remote);
    const margin = remote ? 90 : 56, x = Math.max(margin, Math.min(view.canvas.clientWidth - margin, position.x));
    label.style.transform = `translate3d(${x}px,${position.y}px,0) translate(-50%,-50%)`;
  }
  const bracket = $('focus-bracket'), bounds = view.focusBounds(battle); bracket.hidden = !bounds;
  if (bounds) { bracket.classList.toggle('enemy', view.mode === 'target'); bracket.style.transform = `translate3d(${bounds.x}px,${bounds.y}px,0)`; bracket.style.width = `${bounds.width}px`; bracket.style.height = `${bounds.height}px`; }
}
document.addEventListener('click', event => {
  const button = event.target.closest('button'), selected = event.target.closest('[data-ship]');
  if (ready && selected && selectContact(selected.dataset.ship)) return;
  const id = button?.id;
  if (['restart', 'retry'].includes(id)) { speed = 1; void start(); return; }
  if (!ready) return;
  if (button?.dataset.camera) setCamera(button.dataset.camera);
  else if (button?.dataset.scope) commandDemo(battle, 'scope', button.dataset.scope);
  else if (id === 'target-view') setCamera(view.mode === 'target' ? 'ship' : 'target');
  else if (id === 'battle-pause') { paused = !paused; lastFrame = 0; }
  else if (id === 'battle-speed') speed = ({ 1: 2, 2: 4, 4: 1 })[speed];
  else if (id === 'target-picker') targetPanel.open();
  else if (id === 'attack-target' && commandDemo(battle, 'attack')) notice(`${scopeName()}: Angriff auf ${battle.ships.find(s => s.id === battle.target).name}.`);
  else if (id === 'auto-target' && commandDemo(battle, 'auto')) notice(`${scopeName()}: automatische Zielwahl. Manuelle Aufträge aufgehoben.`);
  else if (id === 'retreat' && commandDemo(battle, 'retreat')) notice(`${scopeName()}: Rückzug unter Deckungsfeuer.`);
  paint(); lastRender = 0;
});
for (const event of ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']) document.addEventListener(event, () => { void audio.unlock(); battleAudio.unlock(); }, { capture: true, passive: true });
document.addEventListener('visibilitychange', () => { audio.setHidden(document.hidden); battleAudio.hidden(document.hidden); lastFrame = 0; if (document.hidden) { paused = true; if (battle) paint(); } });
window.addEventListener('pageshow', () => { audio.setHidden(document.hidden); lastFrame = 0; if (view?.disposed) void start(); else viewport(); });
window.addEventListener('pagehide', event => { paused = true; lastFrame = 0; audio.setHidden(true); battleAudio.hidden(true); if (!event.persisted || !ready) { ++generation; ready = false; view?.dispose(); battleAudio.dispose(); } });
new ResizeObserver(() => { if (ready) viewport(); }).observe($('battle-app'));
function frame(now) {
  const seconds = lastFrame ? Math.max(0, Math.min(.1, (now - lastFrame) / 1000)) : 0; lastFrame = now;
  if (ready && !document.hidden) {
    const running = !paused && battle.phase === 'engaged', events = running ? advanceDemoBattle(battle, seconds * speed / 3) : [];
    pendingEvents.push(...events); if (!paused) visualTime += seconds;
    if (view.quality.observe(seconds, running) && !paused) { view.pixelRatio = view.quality.ratio; view.renderer.setPixelRatio(view.pixelRatio); viewport(); }
    if ((running || !paused && view.animating || view.transition || view.dirty || !lastRender || pendingEvents.length) && (!lastRender || now - lastRender >= 1000 / 60 - 1)) {
      view.render(battle, visualTime, pendingEvents, !paused ? Math.min(.1, (now - (lastRender || now)) / 1000) : 0);
      pendingEvents.length = 0; lastRender = now; labels();
    }
    if (events.length) {
      const sounded = battleAudio.play(events, battle, view.mode === 'target' ? battle.target : battle.selected);
      if (!sounded && events.some(e => e.kind === 'fire')) audio.play('attack');
      if (events.some(e => e.kind === 'destroy')) audio.play('warning');
      const completed = events.filter(e => e.kind === 'order-complete' && (battle.scope === 'fleet' || e.ship === battle.selected));
      if (completed.length) notice('Angriffsziel ausgeschaltet · betroffene Schiffe wählen wieder automatisch.');
    }
    if (now - lastHud > 200) { paint(); lastHud = now; }
  }
  requestAnimationFrame(frame);
}
void start(); requestAnimationFrame(frame);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
if (new URLSearchParams(location.search).has('debug')) globalThis.ORBIT_BATTLE_DEBUG = { get battle() { return battle; }, get view() { return view; }, get ready() { return ready; }, get paused() { return paused; }, audio, tactical, paint };
