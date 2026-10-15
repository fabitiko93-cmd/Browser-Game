import { BattleReplayScene } from './battle-replay-scene.js';
import { createBattleReplay, advanceBattleReplay, REPLAY_DURATION } from './battle-replay.js';
import { BATTLE_OUTCOMES, battleResult } from './battle-records.js';
import { activeShip, DEMO_CLASSES } from './battle-demo.js';
import { loadGame } from './save.js';
import { realmName } from './space-news.js';
import { MediaAudio } from './audio-media.js';
import { BattleAudio } from './battle-audio.js';

const $ = id => document.getElementById(id), audio = new MediaAudio(), sound = new BattleAudio(() => audio.settings);
let report, battle, view, ready = false, paused = false, generation = 0, previous = 0, lastRender = 0, lastHud = 0, visualTime = 0;
let pending = [], inspectedId = null, listSide = 'friendly', listPage = 0, graphics = 'auto';
const markers = new Map(), frames = [], PAGE = 12;
const text = (id, value) => { const node = $(id); if (node.textContent !== String(value)) node.textContent = value; };
const clock = seconds => `0:${String(Math.floor(seconds)).padStart(2, '0')}`;
function closeDialogs() { for (const node of document.querySelectorAll('dialog[open]')) node.close(); }
function openDialog(id) { closeDialogs(); if (id === 'participants-dialog') participants(); $(id).showModal(); }
function viewport() {
  if (!view) return; view.resize(); $('view-caption').style.top = `${view.viewportTop + 3}px`; $('battle-notice').style.top = `${view.viewportTop + 30}px`;
}
function setCamera(mode, animated = true) {
  if (!view || !battle) return;
  if (mode === 'fleet' && !battle.ships.some(s => s.side === 'friendly' && activeShip(s))) return;
  closeDialogs(); view.setMode(mode, battle, animated); view.highlightId = null; $('selection-card').hidden = true;
  for (const node of document.querySelectorAll('[data-camera]')) node.setAttribute('aria-pressed', String(node.dataset.camera === mode));
  text('camera-caption', ({ overview: 'GESAMTANSICHT', fleet: 'EIGENE FORMATION', ship: 'SCHIFFSANSICHT', target: 'GEGNERANSICHT' })[mode]);
  $('battle-canvas').setAttribute('aria-label', mode === 'overview' ? '3D-Gefechtsübersicht. Ein Finger dreht, zwei Finger zoomen und verschieben. Schiffe antippen zum Auswählen.' : '3D-Nahansicht. Ein Finger dreht, zwei Finger zoomen.');
  viewport(); lastRender = 0;
}
function selectContact(id) {
  const ship = battle.ships.find(s => s.id === id); if (!ship) return;
  inspectedId = id;
  if (ship.side === 'friendly') battle.selected = id; else battle.target = id;
  closeDialogs(); view.highlightId = id; $('selection-card').hidden = false;
  paint(); lastRender = 0;
}
function participantState(ship) {
  if (ship.installation) {
    const d = report.defense, t = Math.max(0, Math.min(1, (battle.elapsed - 3) / 22));
    return `Verteidigung ${Math.round(d.before + (d.after - d.before) * t)} · Schild ${Math.round(d.shieldBefore + (d.shieldAfter - d.shieldBefore) * Math.max(0, Math.min(1, (battle.elapsed - 2) / 18)))}`;
  }
  if (!ship.hull || ship.escaped || battle.phase === 'recorded') return BATTLE_OUTCOMES[ship.record.outcome];
  return `Hülle ${Math.round(ship.hull / DEMO_CLASSES[ship.type].hull * 100)} %${ship.order === 'retreat' ? ' · Rückzug' : ship.order === 'land' ? ' · Landung' : ''}`;
}
function participants() {
  const list = battle.ships.filter(s => s.side === listSide), pages = Math.max(1, Math.ceil(list.length / PAGE));
  listPage = Math.max(0, Math.min(pages - 1, listPage)); $('participant-list').replaceChildren();
  for (const ship of list.slice(listPage * PAGE, (listPage + 1) * PAGE)) {
    const button = document.createElement('button'); button.dataset.ship = ship.id;
    const body = document.createElement('span'), name = document.createElement('span'), type = document.createElement('small'), state = document.createElement('span');
    name.textContent = ship.name; type.textContent = ship.className; body.append(name, type); state.textContent = participantState(ship);
    button.append(body, state); $('participant-list').append(button);
  }
  text('participants-page', `${listPage + 1} / ${pages}`); $('participants-prev').disabled = listPage === 0; $('participants-next').disabled = listPage === pages - 1;
  for (const node of document.querySelectorAll('[data-side]')) node.setAttribute('aria-pressed', String(node.dataset.side === listSide));
}
function stat(label, value) {
  const row = document.createElement('div'); row.className = 'replay-stat';
  const name = document.createElement('span'), result = document.createElement('strong'); name.textContent = label; result.textContent = value;
  row.append(name, result); $('report-totals').append(row);
}
function initialize(state) {
  document.title = `${report.planetName} · Gefecht · ORBIT 3077`; text('battle-title', report.planetName);
  text('report-context', `Tag ${report.day} · ${realmName(state, report.attacker)} greift ${realmName(state, report.defender)} an.`);
  text('report-result', battleResult(report)); $('report-totals').replaceChildren();
  for (const [name, owner] of [['Eigene Schiffe', 'player'], ['Gegnerische Schiffe', report.attacker === 'player' ? report.defender : report.attacker]]) {
    const ships = report.ships.filter(s => s.owner === owner);
    stat(name, String(ships.length));
    stat('Zerstört / beim Rückzug verloren', String(ships.filter(s => ['destroyed', 'lost'].includes(s.outcome)).length));
    stat('Zurückgezogen', String(ships.filter(s => s.outcome === 'retreated').length));
    const landers = ships.filter(s => s.outcome === 'landed').length; if (landers) stat('Als Garnison eingesetzt', String(landers));
  }
  const d = report.defense;
  text('report-defense', `Planetenverteidigung ${Math.round(d.before)} → ${Math.round(d.after)} · Schild ${Math.round(d.shieldBefore)} → ${Math.round(d.shieldAfter)}. ${d.orbital ? `Zusätzliche Orbitalstärke ${Math.round(d.orbital)}. ` : ''}${report.captured ? 'Die Kontrolle über den Planeten hat gewechselt.' : 'Die Kontrolle über den Planeten bleibt bestehen.'}`);
}
function fail(message, error) {
  ready = false; paused = true; $('battle-loading').hidden = true; $('battle-error').hidden = false;
  text('battle-error-text', message); $('retry').hidden = !report; $('error-report').hidden = !report;
  if (error) console.error('Battle replay:', error);
}
async function start() {
  const run = ++generation; ready = false; paused = false; previous = lastRender = lastHud = visualTime = 0; pending = []; frames.length = 0; inspectedId = null;
  closeDialogs(); view?.dispose(); view = null;
  const canvas = $('battle-canvas'); canvas.replaceWith(canvas.cloneNode(false));
  if (!report) {
    try {
      const state = loadGame(), id = new URLSearchParams(location.search).get('battle');
      report = state?.battleReports.find(r => r.id === id);
      if (!report) { fail('Diese Aufzeichnung ist nicht in diesem Browser gespeichert oder wurde durch neuere Gefechte ersetzt. Öffne deine Gefechte im Reich.'); return; }
      initialize(state);
    } catch (error) { fail('Der gespeicherte Spielstand ist nicht verfügbar. Öffne das Reich und lade deinen Spielstand erneut.', error); return; }
  }
  battle = createBattleReplay(report); $('selection-card').hidden = true; $('ship-labels').replaceChildren(); markers.clear();
  for (const side of ['friendly', 'enemy']) {
    const button = document.createElement('button'); button.className = `lab-marker ${side === 'enemy' ? 'enemy' : ''}`; button.dataset.marker = side;
    button.append(document.createElement('span'), document.createElement('small')); $('ship-labels').append(button); markers.set(side, button);
  }
  $('battle-loading').hidden = false; $('battle-error').hidden = true; $('load-bar').style.width = '5%'; text('loading-progress', 'Schiffsmodelle laden …');
  try {
    const next = new BattleReplayScene($('battle-canvas'), { onSelect: id => { if (ready) selectContact(id); },
      onUnavailable: message => fail(message), onAssetProgress: (loaded, total) => { if (run !== generation) return; text('loading-progress', `Harbinger laden · ${Math.round(loaded / total * 100)} %`); $('load-bar').style.width = `${5 + loaded / total * 85}%`; } });
    view = next; await next.load(battle); if (run !== generation) { next.dispose(); return; }
    next.setGraphics(graphics); ready = true; $('battle-loading').hidden = true;
    for (const node of document.querySelectorAll('.lab-top button,.lab-bottom button')) node.disabled = false;
    setCamera('overview', false); paint(); view.render(battle, 0); labels();
  } catch (error) { if (run !== generation) return; view?.dispose(); view = null; fail('Die 3D-Ansicht konnte nicht geladen werden. Du kannst das gespeicherte Ergebnis auch ohne 3D lesen.', error); }
}
function paint() {
  if (view && ['ship','target'].includes(view.mode) && !battle.ships.some(s => s.id === view.focusId && activeShip(s))) setCamera('overview');
  for (const side of ['friendly', 'enemy']) text(`${side}-count`, battle.ships.filter(s => s.side === side && !s.installation && activeShip(s)).length);
  text('replay-time', `${clock(battle.elapsed)} / ${clock(REPLAY_DURATION)}`);
  text('battle-pause', paused ? '▶' : 'Ⅱ'); $('battle-pause').disabled = battle.phase !== 'engaged';
  $('battle-pause').setAttribute('aria-label', paused ? 'Wiedergabe fortsetzen' : 'Wiedergabe pausieren');
  text('battle-notice', battle.phase === 'recorded' ? `${battleResult(report)} · Ergebnis gespeichert` : '');
  const ship = battle.ships.find(s => s.id === inspectedId);
  if (ship) {
    text('selection-name', ship.name); text('selection-class', `${ship.side === 'friendly' ? 'EIGEN' : 'GEGNER'} · ${ship.className}`);
    text('selection-state', participantState(ship)); $('inspect-selected').disabled = !activeShip(ship);
  }
  if ($('participants-dialog').open) for (const row of $('participant-list').children) {
    const ship = battle.ships.find(s => s.id === row.dataset.ship); row.lastElementChild.textContent = participantState(ship);
  }
  for (const node of document.querySelectorAll('[data-camera="fleet"]')) node.disabled = !battle.ships.some(s => s.side === 'friendly' && activeShip(s));
  if ($('graphics-dialog').open) {
    const median = frames.length ? [...frames].sort((a, b) => a - b)[Math.floor(frames.length / 2)] : 0;
    text('performance-readout', `${paused ? 'Pausiert' : battle.phase === 'recorded' ? 'Wiedergabe beendet' : median ? `${Math.round(1 / median)} Bilder/s` : 'Messung läuft …'} · ${graphics === 'auto' ? 'Automatische Auflösung' : graphics === 'detail' ? 'Mehr Details' : 'Flüssiger'}`);
  }
}
function labels() {
  for (const [side, node] of markers) {
    const list = battle.ships.filter(s => s.side === side && activeShip(s)), ships = list.filter(s => !s.installation);
    node.hidden = view.mode !== 'overview' || !list.length; if (node.hidden) continue;
    const p = view.labelPosition(`fleet:${side}`, battle); if (!p) continue;
    node.firstElementChild.textContent = `${p.offscreen ? p.arrow + ' ' : ''}${ships.length ? side === 'friendly' ? 'Eigene' : 'Gegner' : 'Orbitalverteidigung'}`;
    node.lastElementChild.textContent = ships.length ? String(ships.length) : '';
    const edge = side === 'friendly' ? p.bottom : p.top, y = Number.isFinite(edge) ? edge + (side === 'friendly' ? 24 : -24) : p.y;
    node.style.left = `${Math.max(66, Math.min(innerWidth - 66, p.x))}px`; node.style.top = `${Math.max(view.viewportTop + 40, Math.min(view.viewportBottom - 25, y))}px`;
  }
}
document.addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button || button.disabled) return;
  if (button.dataset.close) { $(button.dataset.close).close(); return; }
  if (button.id === 'retry' || button.id === 'replay-again') { void start(); return; }
  if (button.id === 'error-report') { openDialog('report-dialog'); return; }
  if (!ready) return;
  if (button.dataset.camera) setCamera(button.dataset.camera);
  else if (button.dataset.ship) selectContact(button.dataset.ship);
  else if (button.dataset.marker || button.id === 'fleet-open') { listSide = button.dataset.marker ?? listSide; listPage = 0; openDialog('participants-dialog'); }
  else if (button.dataset.side) { listSide = button.dataset.side; listPage = 0; participants(); }
  else if (button.id === 'participants-prev' || button.id === 'participants-next') { listPage += button.id === 'participants-next' ? 1 : -1; participants(); }
  else if (button.id === 'report-open') openDialog('report-dialog');
  else if (button.id === 'graphics-open') openDialog('graphics-dialog');
  else if (button.id === 'battle-pause') { paused = !paused; previous = 0; }
  else if (button.dataset.graphics) { graphics = button.dataset.graphics; view.setGraphics(graphics); for (const node of document.querySelectorAll('[data-graphics]')) node.setAttribute('aria-pressed', String(node.dataset.graphics === graphics)); }
  else if (button.id === 'selection-close') { $('selection-card').hidden = true; view.highlightId = null; }
  else if (button.id === 'inspect-selected') { const ship = battle.ships.find(s => s.id === inspectedId); setCamera(ship.side === 'friendly' ? 'ship' : 'target'); }
  paint(); lastRender = 0;
});
for (const event of ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']) document.addEventListener(event, () => { void audio.unlock(); sound.unlock(); }, { capture: true, passive: true });
document.addEventListener('visibilitychange', () => { audio.setHidden(document.hidden); sound.hidden(document.hidden); previous = 0; if (document.hidden) { paused = true; if (ready) paint(); } });
window.addEventListener('pagehide', event => { paused = true; sound.hidden(true); audio.setHidden(true); if (!event.persisted || !ready) { ++generation; ready = false; view?.dispose(); } });
window.addEventListener('pageshow', () => { audio.setHidden(document.hidden); previous = 0; if (view?.disposed) void start(); else viewport(); });
new ResizeObserver(() => { if (view) { viewport(); if (ready) setCamera(view.mode, false); } }).observe($('battle-app'));
function frame(now) {
  const seconds = previous ? Math.min(.1, Math.max(0, (now - previous) / 1000)) : 0; previous = now;
  if (ready && !document.hidden) {
    const running = !paused && battle.phase === 'engaged', events = running ? advanceBattleReplay(battle, seconds) : [];
    pending.push(...events); if (!paused) visualTime += seconds;
    if ((running || !paused && view.animating || view.transition || view.dirty || !lastRender || pending.length) && (!lastRender || now - lastRender >= 1000 / 30 - 1)) {
      const dt = lastRender ? Math.max(0, (now - lastRender) / 1000) : 0;
      if (running && dt > 0 && dt < 1) { frames.push(dt); if (frames.length > 120) frames.shift(); }
      if (graphics === 'auto') view.observeQuality(dt / 2, running);
      view.render(battle, visualTime, pending, paused ? 0 : Math.min(.1, dt)); pending = []; lastRender = now; labels();
    }
    if (events.length) sound.play(events, battle, view.mode === 'target' ? battle.target : battle.selected);
    if (now - lastHud > 200) { paint(); lastHud = now; }
  }
  requestAnimationFrame(frame);
}
void start(); requestAnimationFrame(frame);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
if (new URLSearchParams(location.search).has('debug')) globalThis.ORBIT_REPLAY_DEBUG = {
  get battle() { return battle; }, get view() { return view; }, get ready() { return ready; }, get paused() { return paused; },
  pause: () => { paused = true; previous = 0; }, setCamera, selectContact, start,
  advance: seconds => { const events = advanceBattleReplay(battle, seconds); view.render(battle, visualTime += seconds, events); paint(); labels(); return events; },
};
