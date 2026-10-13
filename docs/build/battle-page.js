import { BattleScene } from './battle-scene.js';
import { createDemoBattle, advanceDemoBattle, selectDemoShip, commandDemo, activeShip, DEMO_CLASSES, fleetDistanceKm, WEAPONS } from './battle-demo.js';
import { MediaAudio } from './audio-media.js';

const $ = id => document.getElementById(id);
const audio = new MediaAudio();
let battle, view, ready = false, paused = false, speed = 1, lastFrame = 0, lastRender = 0, visualTime = 0, lastHud = 0, lastSound = 0, generation = 0;
let pendingEvents = [];
const shipButtons = new Map(), labelNodes = [];
const cameraModes = ['fleet', 'enemy', 'overview', 'ship'];
const cameraLabels = { fleet: 'Eigene Flotte', enemy: 'Feindflotte', overview: 'Übersicht', ship: 'Schiffskamera' };
const dayFormat = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
function setText(id, text) { const element = $(id); if (element.textContent !== String(text)) element.textContent = text; }
function setDisabled(id, value) { if ($(id).disabled !== value) $(id).disabled = value; }
function initializeHud() {
  shipButtons.clear();
  $('ship-selector').replaceChildren();
  for (const ship of battle.ships.filter(s => s.side === 'friendly')) {
    const button = document.createElement('button'); button.dataset.ship = ship.id; button.textContent = ship.name;
    $('ship-selector').append(button); shipButtons.set(ship.id, button);
  }
  $('ship-labels').replaceChildren(); labelNodes.length = 0;
  for (let i = 0; i < 2; i++) { const label = document.createElement('span'); label.className = 'ship-label'; label.hidden = true; $('ship-labels').append(label); labelNodes.push(label); }
}

function notice(text) { $('battle-notice').textContent = text; }
function failed(message) {
  ready = false; paused = true;
  $('battle-loading').hidden = true;
  $('battle-error-text').textContent = message;
  $('battle-error').hidden = false;
}

async function start() {
  const currentGeneration = ++generation;
  ready = false; paused = false; lastFrame = 0; lastRender = 0; visualTime = 0; lastHud = 0; lastSound = 0; pendingEvents = [];
  view?.dispose(); view = null;
  const oldCanvas = $('battle-canvas');
  oldCanvas.replaceWith(oldCanvas.cloneNode(false));
  battle = createDemoBattle();
  initializeHud();
  $('battle-loading').hidden = false;
  $('battle-error').hidden = true;
  $('loading-progress').textContent = 'Quaternius-Schiffe laden …';
  notice('');
  try {
    view = new BattleScene($('battle-canvas'), {
      onSelect: id => { if (ready && selectDemoShip(battle, id)) { if (view.mode === 'ship') view.setMode('ship', battle); audio.play('confirm'); paint(); lastRender = 0; } },
      onUnavailable: failed,
      onProgress: (loaded, total) => { if (currentGeneration === generation) $('loading-progress').textContent = `${loaded} von ${total} Schiffstypen bereit`; },
    });
    const loadingView = view;
    await loadingView.load(battle);
    if (currentGeneration !== generation) { loadingView.dispose(); return; }
    view.render(battle, 0);
    ready = true;
    $('battle-loading').hidden = true;
    $('camera-mode').querySelector('span').textContent = 'Eigene Flotte';
    $('camera-mode').setAttribute('aria-label', 'Kamera: Eigene Flotte');
    paint(); view.resize();
  } catch (error) {
    if (currentGeneration !== generation) return;
    view?.dispose(); view = null;
    failed(error.message?.includes('WebGL') ? 'Dieser Browser konnte keine 3D-Ansicht starten. Öffne das Spiel in einem aktuellen Safari oder versuche es erneut.' : 'Die Schiffsmodelle konnten nicht vollständig geladen werden. Prüfe die Verbindung und versuche es erneut.');
  }
}

function paint() {
  const friendly = battle.ships.filter(s => s.side === 'friendly'), enemy = battle.ships.filter(s => s.side === 'enemy' && activeShip(s));
  const ship = friendly.find(s => s.id === battle.selected), def = DEMO_CLASSES[ship.type];
  setText('friendly-count', friendly.filter(activeShip).length);
  setText('enemy-count', enemy.length);
  setText('battle-day', `Tag ${dayFormat.format(battle.day)}`);
  setText('battle-range', `Flottenabstand · ${dayFormat.format(fleetDistanceKm(battle))} km`);
  for (const own of friendly) {
    const button = shipButtons.get(own.id), selected = own.id === battle.selected, disabled = !activeShip(own);
    button.classList.toggle('selected', selected); button.classList.toggle('disabled', disabled);
    if (button.disabled !== disabled) button.disabled = disabled;
    if (button.getAttribute('aria-pressed') !== String(selected)) button.setAttribute('aria-pressed', String(selected));
  }
  setText('selected-name', ship.name); setText('selected-class', def.name);
  const order = ship.escaped ? 'Entkommen' : !ship.hull ? 'Verloren' : ship.order === 'retreat' ? 'Rückzug' : battle.focus ? 'Feuer bündeln' : 'Im Gefecht';
  setText('selected-order', `${WEAPONS[def.weapon].name} · ${order}`);
  const hull = Math.round(ship.hull / def.hull * 100), shield = Math.round(ship.shield / def.shield * 100);
  setText('hull-value', `${hull} %`); setText('shield-value', `${shield} %`);
  if ($('hull-bar').style.width !== `${hull}%`) $('hull-bar').style.width = `${hull}%`;
  if ($('shield-bar').style.width !== `${shield}%`) $('shield-bar').style.width = `${shield}%`;
  $('hull-bar').parentElement.classList.toggle('damaged', hull < 30);
  const target = enemy.find(s => s.id === battle.target);
  setText('target-name', target?.name ?? 'Kein Ziel');
  setDisabled('cycle-target', !enemy.length || battle.phase !== 'engaged');
  if ($('focus-fire').getAttribute('aria-pressed') !== String(battle.focus)) $('focus-fire').setAttribute('aria-pressed', String(battle.focus));
  setText('focus-fire', battle.focus ? 'Feuer gebündelt ✓' : 'Feuer bündeln');
  setDisabled('focus-fire', battle.phase !== 'engaged' || friendly.every(s => !activeShip(s) || s.order === 'retreat'));
  setDisabled('retreat', battle.phase !== 'engaged' || friendly.every(s => !activeShip(s) || s.order === 'retreat'));
  setText('battle-pause', paused ? '▶' : 'Ⅱ');
  const pauseLabel = paused ? 'Probeschlacht fortsetzen' : 'Probeschlacht pausieren';
  if ($('battle-pause').getAttribute('aria-label') !== pauseLabel) $('battle-pause').setAttribute('aria-label', pauseLabel);
  setText('battle-speed', `${speed}×`);
  const results = { victory: 'Gegnerische Flotte ausgeschaltet.', defeat: 'Eigene Flotte verloren.', withdrawn: 'Rückzug abgeschlossen.' };
  if (results[battle.phase]) { notice(results[battle.phase]); setDisabled('battle-pause', true); }
  else setDisabled('battle-pause', false);
}

function labels() {
  const ids = view.mode === 'overview' ? ['fleet:friendly', 'fleet:enemy'] : [view.mode === 'enemy' ? battle.target : battle.selected, view.mode === 'enemy' ? 'fleet:friendly' : 'fleet:enemy'];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i], label = labelNodes[i], ship = battle.ships.find(s => s.id === id), side = ship?.side ?? id.split(':')[1];
    const position = view.labelPosition(id, battle);
    label.hidden = !position || position.y < view.viewportTop + 8 || position.y > view.viewportBottom - 8;
    if (label.hidden) continue;
    const text = ship?.name.toUpperCase() ?? (side === 'friendly' ? 'EIGENE FLOTTE' : 'FEINDFLOTTE');
    if (label.textContent !== text) label.textContent = text;
    label.classList.toggle('enemy', side === 'enemy');
    const x = Math.max(56, Math.min(view.canvas.clientWidth - 56, position.x));
    label.style.transform = `translate3d(${x}px,${position.y}px,0) translate(-50%,-50%)`;
  }
}

document.addEventListener('click', event => {
  const selected = event.target.closest('[data-ship]');
  if (selected && selectDemoShip(battle, selected.dataset.ship)) { if (view?.mode === 'ship') view.setMode('ship', battle); audio.play('confirm'); paint(); lastRender = 0; return; }
  const id = event.target.closest('button')?.id;
  if (['restart', 'retry'].includes(id)) { speed = 1; void start(); return; }
  if (!ready) return;
  if (id === 'camera-mode') {
    const mode = cameraModes[(cameraModes.indexOf(view.mode) + 1) % cameraModes.length];
    view.setMode(mode, battle);
    const label = cameraLabels[mode];
    $('camera-mode').querySelector('span').textContent = label;
    $('camera-mode').setAttribute('aria-label', `Kamera: ${label}`);
  } else if (id === 'battle-pause') { paused = !paused; lastFrame = 0; }
  else if (id === 'battle-speed') speed = ({ 1: 2, 2: 4, 4: 1 })[speed];
  else if (id === 'cycle-target') {
    const enemies = battle.ships.filter(s => s.side === 'enemy' && activeShip(s));
    const index = enemies.findIndex(s => s.id === battle.target);
    if (enemies.length) selectDemoShip(battle, enemies[(index + 1) % enemies.length].id);
  } else if (id === 'focus-fire' && commandDemo(battle, 'focus')) notice(battle.focus ? 'Eigene Schiffe konzentrieren ihr Feuer auf das gewählte Ziel.' : 'Schiffe wählen wieder eigene Ziele.');
  else if (id === 'retreat' && commandDemo(battle, 'retreat')) notice('Alle eigenen Schiffe ziehen sich zurück und erwidern das Feuer.');
  paint();
  lastRender = 0;
});
for (const event of ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']) document.addEventListener(event, () => { void audio.unlock(); }, { capture: true, passive: true });
document.addEventListener('visibilitychange', () => {
  audio.setHidden(document.hidden); lastFrame = 0;
  if (document.hidden) { paused = true; if (battle) paint(); }
});
window.addEventListener('pageshow', () => { audio.setHidden(document.hidden); lastFrame = 0; view?.resize(); });
window.addEventListener('pagehide', event => { paused = true; lastFrame = 0; audio.setHidden(true); if (!event.persisted) view?.dispose(); });
new ResizeObserver(() => { if (ready) view?.resize(); }).observe($('battle-app'));

function frame(now) {
  const seconds = lastFrame ? Math.max(0, Math.min(.1, (now - lastFrame) / 1000)) : 0;
  lastFrame = now;
  if (ready && !document.hidden) {
    const running = !paused && battle.phase === 'engaged';
    const events = running ? advanceDemoBattle(battle, seconds * speed / 3) : [];
    pendingEvents.push(...events);
    if (!paused) visualTime += seconds;
    if ((running || (!paused && view.animating) || view.dirty || !lastRender || pendingEvents.length) && (!lastRender || now - lastRender >= 1000 / 30 - 1)) {
      view.render(battle, visualTime, pendingEvents, !paused ? Math.min(.1, (now - (lastRender || now)) / 1000) : 0);
      pendingEvents.length = 0; lastRender = now;
      labels();
    }
    if (events.some(e => e.kind === 'fire') && visualTime - lastSound > 1.8) { audio.play('attack'); lastSound = visualTime; }
    if (events.some(e => e.kind === 'destroy')) audio.play('warning');
    if (now - lastHud > 200) { paint(); lastHud = now; }
  }
  requestAnimationFrame(frame);
}
void start(); requestAnimationFrame(frame);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
if (new URLSearchParams(location.search).has('debug')) globalThis.ORBIT_BATTLE_DEBUG = { get battle() { return battle; }, get view() { return view; }, get ready() { return ready; }, get paused() { return paused; }, audio, paint };
