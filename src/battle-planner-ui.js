import { SHIPS } from './data.js';
import { createRoster, filterRoster } from './battle-roster-ui.js';
import { KM_PER_UNIT } from './battle-demo.js';
import { PLANNER_SAVE_KEY, FORMATIONS, PLAN_SIDES, AUTO_FORMATIONS, createTrialPlan, planFromRosters, validateTrialPlan, fleetLayout, groupLayout, deployTrialPlan, addPlanGroup, addPlanShips, removePlanGroup } from './battle-planner.js';

const $ = id => document.getElementById(id);
const clone = v => structuredClone(v);
const format = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });
const palette = ['#78cde0', '#a7b5ed', '#9bd5ba', '#dab583', '#cc9dbd', '#90b7cc'];
const turn = (p, degrees) => { const a = degrees * Math.PI / 180; return [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], p[2] * Math.cos(a) - p[0] * Math.sin(a)]; };
const options = (select, items, value) => { select.replaceChildren(...items.map(([id, name]) => { const o = document.createElement('option'); o.value = id; o.textContent = name; return o; })); select.value = value; };
const svgNode = (tag, attrs, text) => { const n = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); if (text !== undefined) n.textContent = text; return n; };

export class BattlePlanner {
  constructor(dialog, { getBattle, openDialog, onApply }) {
    this.dialog = dialog; this.getBattle = getBattle; this.openDialog = openDialog; this.onApply = onApply;
    this.side = 'friendly'; this.tab = 'fleet'; this.history = []; this.expanded = new Set(); this.plan = null; this.saved = true;
    try { const raw = localStorage.getItem(PLANNER_SAVE_KEY); if (raw) this.plan = validateTrialPlan(JSON.parse(raw)); }
    catch { this.loadWarning = 'Gespeicherte Planung unlesbar · eine neue Vorlage ist verfügbar.'; }
    dialog.querySelector('.planner-content').innerHTML = `
      <p class="trial-menu-hint">Eigener Entwurf · unabhängig vom Reichsspielstand. Änderungen werden hier gespeichert.</p>
      <div class="plan-switch" aria-label="Geplante Seite"><button data-plan-side="friendly">Eigene Flotte</button><button data-plan-side="enemy">Gegner</button></div>
      <div class="plan-tabs" aria-label="Planungsebene"><button data-plan-tab="fleet">Flottenplaner</button><button data-plan-tab="group">Verbandsplaner</button></div>
      <p id="plan-summary"></p><p id="plan-message" role="status" aria-live="polite"></p>
      <div id="plan-active-formation"></div><div class="plan-chart"><span class="plan-direction">▲ GEGNERSEITE</span><svg id="plan-map" viewBox="0 0 320 230" role="img" aria-label="Aufstellung von oben. Objekt auswählen und Ziel antippen oder direkt ziehen. Freie Fläche zum Verschieben ziehen."></svg><span id="plan-scale"></span></div><div class="plan-map-tools"><button id="plan-zoom-out" aria-label="Plan verkleinern">−</button><button id="plan-fit">Alles zeigen</button><button id="plan-zoom-in" aria-label="Plan vergrößern">+</button></div>
      <p id="plan-map-help" class="trial-menu-hint"></p><button id="plan-auto-place" class="lab-restart">Auswahl automatisch aufstellen</button>
      <div class="plan-pair"><label class="lab-field" for="plan-group">Verband<select id="plan-group"></select></label><button id="plan-new-group" class="plan-add" aria-label="Neuen Verband erstellen">+ Verband</button></div>
      <label class="lab-field" for="plan-search">Verbände und Schiffe finden<input id="plan-search" type="search" placeholder="Name oder Schiffsklasse" autocomplete="off"></label><div id="plan-roster" class="battle-roster"></div><div id="plan-fleet-fields" class="plan-fields">
        <label class="lab-field" for="plan-fleet-formation">Flottenformation<select id="plan-fleet-formation"></select></label>
        <label class="lab-field" for="plan-fleet-spacing">Abstand der Verbände <output id="plan-fleet-spacing-value"></output><input id="plan-fleet-spacing" type="range" min="0.7" max="2" step="0.1"></label>
        <label class="lab-field" for="plan-fleet-heading">Gesamte Aufstellung drehen<select id="plan-fleet-heading"></select></label>
      </div>
      <div id="plan-group-fields" class="plan-fields" hidden>
        <label class="lab-field" for="plan-group-name">Verbandsname<input id="plan-group-name" maxlength="80" autocomplete="off"></label>
        <label class="lab-field" for="plan-group-formation">Innere Formation<select id="plan-group-formation"></select></label>
        <label class="lab-field" for="plan-group-spacing">Abstand der Schiffe <output id="plan-group-spacing-value"></output><input id="plan-group-spacing" type="range" min="0.7" max="2" step="0.1"></label>
        <label class="lab-field" for="plan-group-heading">Aufstellung des Verbandes drehen<select id="plan-group-heading"></select></label>
        <label class="lab-field" for="plan-ship">Schiff auswählen<select id="plan-ship"></select></label>
      </div>
      <fieldset class="plan-position"><legend id="plan-position-label">Verband verschieben</legend><div class="plan-nudges"><button data-plan-move="left" aria-label="Nach links">←</button><button data-plan-move="front" aria-label="Nach vorn">↑</button><button data-plan-move="back" aria-label="Nach hinten">↓</button><button data-plan-move="right" aria-label="Nach rechts">→</button></div><button id="plan-reset-position" class="trial-subtle">Zur Formationsposition zurück</button></fieldset>
      <div id="plan-ship-fields" hidden>
        <label class="lab-field" for="plan-ship-type">Schiffsklasse<select id="plan-ship-type"></select></label><label class="lab-field" for="plan-ship-name">Schiffsname<input id="plan-ship-name" maxlength="160" autocomplete="off"></label>
        <label class="lab-field" for="plan-transfer">Schiff einem Verband zuweisen<select id="plan-transfer"></select></label>
        <button id="plan-remove-ship" class="lab-restart">Ausgewähltes Schiff entfernen</button>
      </div>
      <details class="plan-roster"><summary>Schiffe hinzufügen · alle Spielklassen</summary><label class="lab-field" for="plan-type">Schiffsklasse<select id="plan-type"></select></label><label class="lab-field" for="plan-count">Anzahl<input id="plan-count" type="number" inputmode="numeric" min="1" value="1"></label><button id="plan-add-ships" class="lab-restart">Zum ausgewählten Verband hinzufügen</button><p>Verbände dürfen beliebig zusammengesetzt werden. Forschung und Baukosten begrenzen diese Testflotten nicht. Waffenlose Klassen bleiben waffenlos.</p></details>
      <details class="plan-roster"><summary>Vorlage und weitere Optionen</summary><label class="lab-field" for="plan-supply">Versorgung dieser Flotte<select id="plan-supply"><option value="100">100 % · Voll</option><option value="60">60 %</option><option value="20">20 % · Knapp</option><option value="5">5 % · Kritisch</option></select></label><label class="lab-field" for="plan-preset">Neue Vorlage für beide Seiten<select id="plan-preset"><option value="20v20">20 : 20 · Gemischte Verbände</option><option value="5v35">5 : 35 · Eigene Unterzahl</option><option value="35v5">35 : 5 · Eigene Überzahl</option><option value="50v50">50 : 50 · Große Schlacht</option></select></label><div class="trial-menu"><button id="plan-load-preset">Vorlage als neuen Entwurf laden</button><button id="plan-new-scatter">Natürliche Abweichungen neu verteilen</button><button id="plan-empty-group">Schiffe dieses Verbandes entfernen</button><button id="plan-remove-group">Verband auflösen · Schiffe umgliedern</button></div></details>
      <p class="plan-explanation">Objekt auswählen, freie Zielposition antippen oder direkt ziehen. Ziehen auf freier Fläche verschiebt den Plan. Automatische Formationen übernehmen die Einzelplatzierung. Höhe und natürliche Abstände entstehen automatisch. Ein Verband nimmt seine Schiffe gemeinsam mit.</p>
      <div class="plan-footer"><button id="plan-undo">Änderung zurück</button><button id="plan-apply" class="lab-restart">Mit Planung neu aufstellen</button><small>Ersetzt die laufende Probeschlacht und startet pausiert.</small></div>`;
    for (const id of ['plan-fleet-formation', 'plan-group-formation']) options($(id), Object.entries(FORMATIONS).filter(([id]) => AUTO_FORMATIONS.includes(id)), 'auto');
    const angles = Array.from({ length: 13 }, (_, i) => [(i - 6) * 30, `${(i - 6) * 30}°`]);
    for (const id of ['plan-fleet-heading', 'plan-group-heading']) options($(id), angles, '0');
    for (const id of ['plan-type','plan-ship-type']) options($(id), Object.entries(SHIPS).map(([id, d]) => [id, `${d.name}${d.strength ? '' : ' · unbewaffnet'}`]), 'corvette');
    dialog.addEventListener('click', e => this.click(e));
    dialog.addEventListener('change', e => this.change(e));
    $('plan-search').addEventListener('input', () => this.filter());
    const svg = $('plan-map');
    svg.addEventListener('pointerdown', e => this.pointerDown(e));
    svg.addEventListener('pointermove', e => this.pointerMove(e));
    svg.addEventListener('pointerup', e => this.pointerEnd(e));
    svg.addEventListener('pointercancel', e => this.pointerEnd(e, true));
    dialog.addEventListener('close', () => { if (this.drag) { if(this.drag.before)this.plan = this.drag.before; this.drag = null; this.paint(); } });
  }
  get fleet() { return this.plan.sides[this.side]; }
  get group() { return this.fleet.groups.find(g => g.id === this.groupId) ?? this.fleet.groups[0]; }
  get ship() { return this.fleet.ships.find(s => s.id === this.shipId && s.groupId === this.group.id); }
  remember(before = clone(this.plan)) { this.history.push(before); if (this.history.length > 30) this.history.shift(); }
  save() {
    try { localStorage.setItem(PLANNER_SAVE_KEY, JSON.stringify(validateTrialPlan(this.plan))); this.saved = true; }
    catch { this.saved = false; }
  }
  open() {
    if (!this.plan) {
      const b = this.getBattle();
      this.plan = b.plan ? clone(b.plan) : planFromRosters(Object.fromEntries(PLAN_SIDES.map(side => [side, b.ships.filter(s => s.side === side).map(s => ({ id: s.sourceId, name: s.name, type: s.strategicType }))])), b.setup.scenario);
    }
    this.message = this.loadWarning ?? ''; this.loadWarning = ''; this.drag = null;
    this.save();
    this.paint(); this.openDialog('planner-dialog');
  }
  change(e) {
    const id = e.target.id;
    if (!id.startsWith('plan-')) return;
    if (id === 'plan-group') { this.chartBounds=null;this.groupId = e.target.value; this.shipId = null; this.paint(); return; }
    if (id === 'plan-ship') { this.shipId = e.target.value; this.paint(); return; }
    if (['plan-type', 'plan-count', 'plan-preset', 'plan-search'].includes(id)) return;
    this.mutate(() => {
      const value = e.target.value;
      if (['plan-fleet-formation','plan-group-formation','plan-fleet-spacing','plan-group-spacing','plan-fleet-heading','plan-group-heading'].includes(id)) this.chartBounds=null;
      if (id === 'plan-group-name') { if (!value.trim()) throw new Error('Bitte einen Verbandsnamen eingeben.'); this.group.name = value.trim(); }
      if (id === 'plan-ship-name' && this.ship) { if (!value.trim()) throw new Error('Bitte einen Schiffsnamen eingeben.'); this.ship.name = value.trim(); }
      if (id === 'plan-fleet-formation') { this.fleet.formation = value; for (const g of this.fleet.groups) g.offset = null; }
      if (id === 'plan-group-formation') { this.group.formation = value; for (const s of this.fleet.ships.filter(s => s.groupId === this.group.id)) s.offset = null; }
      if (id === 'plan-fleet-spacing') this.fleet.spacing = Number(value);
      if (id === 'plan-group-spacing') this.group.spacing = Number(value);
      if (id === 'plan-ship-type' && this.ship) this.ship.type = value;
      if (id === 'plan-fleet-heading') this.fleet.heading = Number(value);
      if (id === 'plan-group-heading') this.group.heading = Number(value);
      if (id === 'plan-supply') this.fleet.supply = Number(value);
      if (id === 'plan-transfer' && this.ship) { const ship = this.ship; ship.groupId = value; ship.offset = null; this.groupId = value; }
    });
  }
  mutate(action) {
    const before = clone(this.plan);
    try { action(); this.plan = validateTrialPlan(this.plan); this.remember(before); this.save(); this.message = ''; }
    catch (e) { this.plan = before; this.message = e.message; }
    this.paint();
  }
  click(e) {
    const button = e.target.closest('button'); if (!button) return;
    if (button.dataset.planSelectGroup) { this.groupId=button.dataset.planSelectGroup;this.shipId=null;this.chartBounds=null;this.paint();return; }
    if (button.dataset.planSelectShip) { const ship=this.fleet.ships.find(s=>s.id===button.dataset.planSelectShip);this.shipId=ship.id;this.groupId=ship.groupId;this.tab='group';this.chartBounds=null;this.paint();return; }
    if (button.id==='plan-zoom-in'||button.id==='plan-zoom-out') { this.chartBounds.scale*=button.id==='plan-zoom-in'?1.3:1/1.3;this.chart(this.chartBounds);return; }
    if (button.id==='plan-fit') {this.chartBounds=null;this.chart();return;}
    if (button.dataset.planSide) { this.chartBounds=null;this.side = button.dataset.planSide; this.groupId = this.shipId = null; this.paint(); return; }
    if (button.dataset.planTab) { this.chartBounds=null;this.tab = button.dataset.planTab; this.paint(); return; }
    if (button.dataset.planMove) {
      const direction = { left: [-1, 0, 0], right: [1, 0, 0], front: [0, 0, -1], back: [0, 0, 1], up: [0, 1, 0], down: [0, -1, 0] }[button.dataset.planMove];
      const step = this.tab === 'fleet' ? 30 : 15;
      this.mutate(() => this.move(turn(direction.map(v => v * step), -(this.tab === 'fleet' ? this.fleet.heading : this.group.heading)))); return;
    }
    if (button.id === 'plan-undo') {
      if (this.history.length) { this.plan = this.history.pop(); this.save(); this.message = ''; this.paint(); } return;
    }
    if (button.id === 'plan-apply') { void this.apply(); return; }
    if (!['plan-new-group', 'plan-reset-position', 'plan-remove-ship', 'plan-add-ships', 'plan-remove-group', 'plan-load-preset', 'plan-new-scatter', 'plan-auto-place', 'plan-empty-group'].includes(button.id)) return;
    this.mutate(() => {
      if (['plan-new-group','plan-load-preset','plan-add-ships','plan-remove-group','plan-empty-group','plan-new-scatter'].includes(button.id)) this.chartBounds=null;
      if (button.id === 'plan-auto-place') {if(this.tab==='fleet')for(const g of this.fleet.groups)g.offset=null;else for(const s of this.fleet.ships.filter(s=>s.groupId===this.group.id))s.offset=null;this.chartBounds=null;}
      if (button.id === 'plan-empty-group') {if(this.fleet.ships.every(s=>s.groupId===this.group.id))throw new Error('Mindestens ein Schiff je Seite ist erforderlich.');this.fleet.ships=this.fleet.ships.filter(s=>s.groupId!==this.group.id);this.shipId=null;}
      if (button.id === 'plan-new-group') { this.groupId = addPlanGroup(this.plan, this.side); this.shipId = null; this.tab = 'group'; }
      if (button.id === 'plan-reset-position') { if (this.tab === 'fleet') this.group.offset = null; else if (this.ship) this.ship.offset = null; }
      if (button.id === 'plan-remove-ship' && this.ship) { if (this.fleet.ships.length === 1) throw new Error('Mindestens ein Schiff je Seite ist erforderlich.'); this.fleet.ships = this.fleet.ships.filter(s => s.id !== this.ship.id); this.shipId = null; }
      if (button.id === 'plan-add-ships') { addPlanShips(this.plan, this.side, this.group.id, $('plan-type').value, Number($('plan-count').value)); this.tab = 'group'; }
      if (button.id === 'plan-remove-group') { removePlanGroup(this.plan, this.side, this.group.id); this.groupId = this.shipId = null; }
      if (button.id === 'plan-load-preset') { this.plan = createTrialPlan($('plan-preset').value); this.groupId = this.shipId = null; }
      if (button.id === 'plan-new-scatter') this.plan.seed = (this.plan.seed + 2654435761) >>> 0;
    });
  }
  move(delta, base = null) {
    const object = this.tab === 'fleet' ? this.group : this.ship; if (!object) return;
    if (!base) base = this.tab === 'fleet' ? fleetLayout(this.plan, this.side).groups.find(g => g.id === object.id).slot : groupLayout(this.plan, this.side, this.group.id).find(s => s.id === object.id).slot;
    object.offset = base.map((v, i) => Math.max(-6000, Math.min(6000, v + delta[i])));
  }
  paint() {
    if (!this.plan) return;
    this.groupId = this.group.id;
    const ships = this.fleet.ships.filter(s => s.groupId === this.group.id);
    if (!this.ship) this.shipId = ships[0]?.id ?? null;
    for (const b of this.dialog.querySelectorAll('[data-plan-side]')) b.setAttribute('aria-pressed', String(b.dataset.planSide === this.side));
    for (const b of this.dialog.querySelectorAll('[data-plan-tab]')) b.setAttribute('aria-pressed', String(b.dataset.planTab === this.tab));
    const total = this.plan.sides.friendly.ships.length, enemy = this.plan.sides.enemy.ships.length;
    $('plan-summary').textContent = `${total} eigene : ${enemy} Gegner · ${this.fleet.groups.length} Verbände auf dieser Seite`;
    $('plan-message').textContent = this.message || (!this.saved ? 'Speichern im Browser nicht möglich · Entwurf bleibt für diesen Besuch verfügbar.' : 'Entwurf gespeichert · laufende Schlacht unverändert.');
    $('plan-message').classList.toggle('plan-warning', Boolean(this.message || !this.saved));
    $('plan-fleet-fields').hidden = this.tab !== 'fleet'; $('plan-group-fields').hidden = this.tab !== 'group';
    $('plan-ship-fields').hidden = this.tab !== 'group' || !this.ship;
    options($('plan-group'), this.fleet.groups.map(g => [g.id, `${g.name} · ${this.fleet.ships.filter(s => s.groupId === g.id).length}`]), this.group.id);
    options($('plan-ship'), ships.map(s => [s.id, s.name]), this.shipId);
    options($('plan-transfer'), this.fleet.groups.map(g => [g.id, g.name]), this.group.id);
    $('plan-group-name').value = this.group.name; $('plan-ship-name').value = this.ship?.name ?? '';
    for(const [id,value] of [['plan-fleet-formation',this.fleet.formation],['plan-group-formation',this.group.formation]])options($(id),Object.entries(FORMATIONS).filter(([key])=>AUTO_FORMATIONS.includes(key)||key===value),value);
    $('plan-fleet-heading').value = this.fleet.heading; $('plan-group-heading').value = this.group.heading;
    $('plan-fleet-spacing').value = this.fleet.spacing; $('plan-group-spacing').value = this.group.spacing;
    $('plan-fleet-spacing-value').value = `${format.format(this.fleet.spacing)}×`;
    $('plan-group-spacing-value').value = `${format.format(this.group.spacing)}×`;
    $('plan-supply').value = this.fleet.supply; $('plan-preset').value = this.plan.scenario;
    $('plan-remove-group').disabled = this.fleet.groups.length === 1;
    $('plan-remove-ship').disabled = this.fleet.ships.length === 1;
    $('plan-add-ships').disabled = false;
    $('plan-ship-type').value = this.ship?.type??'corvette';
    $('plan-undo').disabled = !this.history.length;
    $('plan-map-help').textContent = this.tab === 'fleet' ? 'Verband wählen → Zielposition antippen. Freie Fläche ziehen zum Verschieben.' : 'Schiff wählen → Zielposition antippen. Ziehen bleibt ebenfalls möglich.';
    $('plan-position-label').textContent = this.tab === 'fleet' ? `${this.group.name} verschieben` : this.ship ? `${this.ship.name} verschieben` : 'Leerer Verband · Schiffe hinzufügen';
    const empty = this.tab === 'group' && !this.ship;
    for (const b of this.dialog.querySelectorAll('[data-plan-move],#plan-reset-position')) b.disabled = empty;
    this.roster=createRoster($('plan-roster'),this.fleet.groups,this.fleet.ships.map(s=>({...s,className:SHIPS[s.type].name})),{groupAttribute:'data-plan-select-group',shipAttribute:'data-plan-select-ship',expanded:this.expanded,onToggle:()=>this.filter()});
    for(const [id,row] of this.roster.shipButtons){const ship=this.fleet.ships.find(s=>s.id===id);row.lastElementChild.textContent=SHIPS[ship.type].name;row.setAttribute('aria-pressed',String(id===this.shipId&&this.tab==='group'));}
    for(const [id,row] of this.roster.groupButtons)row.setAttribute('aria-pressed',String(id===this.groupId));
    this.filter();
    for(const [id,container] of [['plan-fleet-formation','plan-fleet-fields'],['plan-group-formation','plan-group-fields']]){const active=this.tab==='fleet'?id==='plan-fleet-formation':id==='plan-group-formation';$(active?'plan-active-formation':container).append($(id).closest('label'));}
    this.chart();
  }
  filter(){if(this.roster)filterRoster(this.roster,$('plan-search').value);}
  chart(fixed = this.chartBounds) {
    const layout = fleetLayout(this.plan, this.side), group = layout.groups.find(g => g.id === this.group.id);
    const points = this.tab === 'fleet' ? layout.ships : layout.ships.filter(s => s.groupId === group.id).map(s => ({ ...s, position: turn(s.position.map((v, a) => v - group.position[a]), -this.fleet.heading) }));
    const handles = this.tab === 'fleet' ? layout.groups.map(g => ({ id: g.id, name: g.name, position: g.position })) : points;
    const all = [...points, ...handles], xs = all.map(s => s.position[0]), zs = all.map(s => s.position[2]);
    const bounds = fixed ?? { x: ((Math.min(0, ...xs)) + Math.max(0, ...xs)) / 2, z: (Math.min(0, ...zs) + Math.max(0, ...zs)) / 2, scale: Math.min(260 / Math.max(220, Math.max(...xs, 0) - Math.min(...xs, 0) + 120), 175 / Math.max(160, Math.max(...zs, 0) - Math.min(...zs, 0) + 100)) };
    this.chartBounds = bounds; this.handles = handles;
    const project = p => [160 + (p[0] - bounds.x) * bounds.scale, 115 + (p[2] - bounds.z) * bounds.scale];
    const svg = $('plan-map'); svg.replaceChildren();
    const [ox, oy] = project([0, 0, 0]);
    svg.append(svgNode('path', { d: `M${ox - 8},${oy}h16 M${ox},${oy - 8}v16`, stroke: '#405c70', 'stroke-width': 1, fill: 'none' }));
    for (const s of points) {
      const [x, y] = project(s.position), index = this.fleet.groups.findIndex(g => g.id === s.groupId), selected = this.tab === 'fleet' ? s.groupId === this.group.id : s.id === this.shipId;
      const size = Math.max(3.5, Math.min(12, s.length * bounds.scale * .5));
      const node = svgNode('path', { d: `M${x},${y - size}l${size * .55},${size * 1.65}l${-size * .55},${-size * .35}l${-size * .55},${size * .35}Z`, fill: palette[index % palette.length], opacity: selected ? 1 : .48 });
      node.append(svgNode('title', {}, `${s.name} · ${SHIPS[s.type].name}`)); svg.append(node);
      if (selected && this.tab === 'group') svg.append(svgNode('circle', { cx: x, cy: y, r: Math.max(12, size + 4), stroke: '#e6f8ff', 'stroke-width': 1.2, fill: 'none' }));
    }
    if (this.tab === 'fleet') for (const [i, h] of handles.entries()) {
      const [x, y] = project(h.position), selected = h.id === this.group.id;
      svg.append(svgNode('circle', { cx: x, cy: y, r: 18, fill: '#081622b8', stroke: selected ? '#e6f8ff' : palette[i % palette.length], 'stroke-width': selected ? 2 : 1, 'stroke-dasharray': selected ? 'none' : '3 3' }));
      svg.append(svgNode('text', { x, y: y + 4, 'text-anchor': 'middle', fill: selected ? '#edfaff' : palette[i % palette.length], 'font-size': 12 }, i + 1));
    }
    $('plan-scale').textContent = `Draufsicht · Breite ${format.format(320 / bounds.scale * KM_PER_UNIT)} km`;
  }
  pointerDown(e) {
    if (e.button !== 0 || this.drag) return;
    const rect = $('plan-map').getBoundingClientRect(), x = (e.clientX - rect.left) * 320 / rect.width, y = (e.clientY - rect.top) * 230 / rect.height;
    const b = this.chartBounds, candidates = this.handles.map(h => ({ h, d: Math.hypot(x - (160 + (h.position[0] - b.x) * b.scale), y - (115 + (h.position[2] - b.z) * b.scale)) })).sort((a, c) => a.d - c.d);
    if (!candidates.length || candidates[0].d > 26) {this.drag={id:e.pointerId,x:e.clientX,y:e.clientY,bounds:{...this.chartBounds},pan:true,moved:false};$('plan-map').setPointerCapture(e.pointerId);e.preventDefault();return;}
    if (this.tab === 'fleet') this.groupId = candidates[0].h.id; else this.shipId = candidates[0].h.id;
    const before = clone(this.plan), base = this.tab === 'fleet' ? fleetLayout(this.plan,this.side).groups.find(g=>g.id===this.group.id).slot : groupLayout(this.plan, this.side, this.group.id).find(s => s.id === this.shipId).slot;
    this.paint(); this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, base, before, bounds: this.chartBounds, moved: false };
    $('plan-map').setPointerCapture(e.pointerId); e.preventDefault();
  }
  pointerMove(e) {
    const d = this.drag; if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y; if (Math.hypot(dx, dy) < 4 && !d.moved) return;
    d.moved = true;
    const rect = $('plan-map').getBoundingClientRect(), delta = [dx * 320 / rect.width / d.bounds.scale, 0, dy * 230 / rect.height / d.bounds.scale];
    if(d.pan){this.chart({...d.bounds,x:d.bounds.x-delta[0],z:d.bounds.z-delta[2]});e.preventDefault();return;}
    this.move(turn(delta, -(this.tab === 'fleet' ? this.fleet.heading : this.group.heading)), d.base); this.chart(d.bounds); e.preventDefault();
  }
  pointerEnd(e, cancel = false) {
    const d = this.drag; if (!d || d.id !== e.pointerId) return;
    if(d.pan){this.drag=null;if(!cancel&&!d.moved){const rect=$('plan-map').getBoundingClientRect(),b=this.chartBounds,point=[b.x+((e.clientX-rect.left)*320/rect.width-160)/b.scale,0,b.z+((e.clientY-rect.top)*230/rect.height-115)/b.scale];const current=this.handles.find(h=>h.id===(this.tab==='fleet'?this.group.id:this.shipId));if(current)this.mutate(()=>this.move(turn([point[0]-current.position[0],0,point[2]-current.position[2]],-(this.tab==='fleet'?this.fleet.heading:this.group.heading))));}return;}
    if (cancel) this.plan = d.before;
    else if (d.moved) { this.remember(d.before); this.save(); }
    this.drag = null; this.paint();
  }
  async apply() {
    try {
      const plan = validateTrialPlan(this.plan); deployTrialPlan(plan); this.save();
      $('plan-apply').disabled = true;
      await this.onApply(plan);
    } catch (e) { this.message = e.message; this.paint(); }
    finally { $('plan-apply').disabled = false; }
  }
}
