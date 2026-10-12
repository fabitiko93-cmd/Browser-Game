import { BattleScene } from './battle-scene.js';
import { createDemoBattle, advanceDemoBattle, selectDemoShip, commandDemo, activeShip, DEMO_CLASSES } from './battle-demo.js';
import { MediaAudio } from './audio-media.js';

const $ = id => document.getElementById(id);
const audio = new MediaAudio();
let battle, view, ready = false, paused = false, speed = 1, lastFrame = 0, visualTime = 0, lastHud = 0, lastSound = 0, generation = 0;
const dayFormat = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function notice(text) { $('battle-notice').textContent = text; }
function failed(message) {
  ready = false; paused = true;
  $('battle-loading').hidden = true;
  $('battle-error-text').textContent = message;
  $('battle-error').hidden = false;
}

async function start() {
  const currentGeneration = ++generation;
  ready = false; paused = false; lastFrame = 0; visualTime = 0; lastHud = 0; lastSound = 0;
  view?.dispose(); view = null;
  const oldCanvas = $('battle-canvas');
  oldCanvas.replaceWith(oldCanvas.cloneNode(false));
  battle = createDemoBattle();
  $('battle-loading').hidden = false;
  $('battle-error').hidden = true;
  $('loading-progress').textContent = 'Quaternius-Schiffe laden …';
  notice('');
  try {
    view = new BattleScene($('battle-canvas'), {
      onSelect: id => { if (ready && selectDemoShip(battle, id)) { if (view.mode === 'ship') view.setMode('ship', battle); audio.play('confirm'); paint(); } },
      onUnavailable: failed,
      onProgress: (loaded, total) => { if (currentGeneration === generation) $('loading-progress').textContent = `${loaded} von ${total} Schiffstypen bereit`; },
    });
    const loadingView = view;
    await loadingView.load(battle);
    if (currentGeneration !== generation) { loadingView.dispose(); return; }
    view.render(battle, 0);
    ready = true;
    $('battle-loading').hidden = true;
    $('camera-mode').querySelector('span').textContent = 'Übersicht';
    $('camera-mode').setAttribute('aria-label', 'Kamera: Übersicht');
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
  $('friendly-count').textContent = friendly.filter(activeShip).length;
  $('enemy-count').textContent = enemy.length;
  $('battle-day').textContent = `Tag ${dayFormat.format(battle.day)}`;
  const html = friendly.map(s => `<button data-ship="${s.id}" class="${s.id === battle.selected ? 'selected' : ''} ${activeShip(s) ? '' : 'disabled'}" aria-pressed="${s.id === battle.selected}" ${activeShip(s) ? '' : 'disabled'}>${s.name}</button>`).join('');
  if ($('ship-selector').innerHTML !== html) $('ship-selector').innerHTML = html;
  $('selected-name').textContent = ship.name;
  $('selected-class').textContent = def.name;
  $('selected-order').textContent = ship.escaped ? 'Entkommen' : !ship.hull ? 'Verloren' : ship.order === 'retreat' ? 'Rückzug' : battle.focus ? 'Feuer bündeln' : 'Im Gefecht';
  const hull = Math.round(ship.hull / def.hull * 100), shield = Math.round(ship.shield / def.shield * 100);
  $('hull-value').textContent = `${hull} %`; $('shield-value').textContent = `${shield} %`;
  $('hull-bar').style.width = `${hull}%`; $('shield-bar').style.width = `${shield}%`;
  $('hull-bar').parentElement.classList.toggle('damaged', hull < 30);
  const target = enemy.find(s => s.id === battle.target);
  $('cycle-target').innerHTML = `${target?.name ?? 'Kein Ziel'} <span>↻</span>`;
  $('cycle-target').disabled = !enemy.length || battle.phase !== 'engaged';
  $('focus-fire').setAttribute('aria-pressed', String(battle.focus));
  $('focus-fire').textContent = battle.focus ? 'Feuer gebündelt ✓' : 'Feuer bündeln';
  $('focus-fire').disabled = battle.phase !== 'engaged' || friendly.every(s => !activeShip(s) || s.order === 'retreat');
  $('retreat').disabled = battle.phase !== 'engaged' || friendly.every(s => !activeShip(s) || s.order === 'retreat');
  $('battle-pause').textContent = paused ? '▶' : 'Ⅱ';
  $('battle-pause').setAttribute('aria-label', paused ? 'Probeschlacht fortsetzen' : 'Probeschlacht pausieren');
  $('battle-speed').textContent = `${speed}×`;
  const results = { victory: 'Gegnerische Flotte ausgeschaltet.', defeat: 'Eigene Flotte verloren.', withdrawn: 'Rückzug abgeschlossen.' };
  if (results[battle.phase]) { notice(results[battle.phase]); $('battle-pause').disabled = true; }
  else $('battle-pause').disabled = false;
}

function labels() {
  const ids = [battle.selected, battle.target], html = [];
  for (const id of ids) {
    const ship = battle.ships.find(s => s.id === id), position = view.labelPosition(id);
    if (!position || position.y < document.querySelector('.battle-toolbar').getBoundingClientRect().bottom + 8 || position.y > $('battle-bottom').getBoundingClientRect().top - 8) continue;
    html.push(`<span class="ship-label ${ship.side === 'enemy' ? 'enemy' : ''}" style="left:${position.x}px;top:${position.y}px">${ship.name.toUpperCase()}</span>`);
  }
  $('ship-labels').innerHTML = html.join('');
}

document.addEventListener('click', event => {
  const selected = event.target.closest('[data-ship]');
  if (selected && selectDemoShip(battle, selected.dataset.ship)) { if (view?.mode === 'ship') view.setMode('ship', battle); audio.play('confirm'); paint(); return; }
  const id = event.target.closest('button')?.id;
  if (['restart', 'retry'].includes(id)) { speed = 1; void start(); return; }
  if (!ready) return;
  if (id === 'camera-mode') {
    const mode = view.mode === 'overview' ? 'ship' : 'overview';
    view.setMode(mode, battle);
    const label = mode === 'overview' ? 'Übersicht' : 'Schiffskamera';
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
    if (!paused) visualTime += seconds;
    view.render(battle, visualTime, events, running ? seconds : 0);
    if (events.some(e => e.kind === 'fire') && visualTime - lastSound > 1.8) { audio.play('attack'); lastSound = visualTime; }
    if (events.some(e => e.kind === 'destroy')) audio.play('warning');
    if (now - lastHud > 150) { paint(); labels(); lastHud = now; }
  }
  requestAnimationFrame(frame);
}
void start(); requestAnimationFrame(frame);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
if (new URLSearchParams(location.search).has('debug')) globalThis.ORBIT_BATTLE_DEBUG = { get battle() { return battle; }, get view() { return view; }, get ready() { return ready; }, get paused() { return paused; }, audio, paint };
