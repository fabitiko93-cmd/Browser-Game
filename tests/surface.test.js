import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, getPlanet, makeStock, terrainAt } from '../src/state.js';
import { GRID, BUILDINGS, SYSTEMS } from '../src/data.js';
import { planetSurface, surfaceTile, placementIssue, siteBonus, geologicalFactor, surfaceConnections, constructionPhase } from '../src/surface.js';
import { buildingPotential, simulatePlanet, placeBuilding } from '../src/economy.js';
import { forecastDay, runDailyEconomy } from '../src/budget.js';
import { parseImport, exportGame } from '../src/save.js';
import { renderMapFoot, renderSheet } from '../src/ui.js';
import { MapRenderer } from '../src/map.js';

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} != ${b}`);
const home = s => getPlanet(s, 'nereid');
const facility = (type, tile, remaining = 0) => ({ id: `test-${type}`, type, x: tile.x, y: tile.y, remaining, enabled: true, status: remaining ? 'Bau' : 'aktiv' });
const ui = () => ({ view: 'planet', planetId: 'nereid', systemId: 'helios', speed: 0, hints: false, panel: null });
const richTile = p => planetSurface(p).tiles.find(t => t.ore === .35);
const neutralTile = p => surfaceTile(p, 6, 6);

test('geology survives forecasts and saves, with three permanent ore fields on every planet', () => {
  const state = createGame(), before = exportGame(state), restored = parseImport(before);
  for (const p of state.planets) {
    const surface = planetSurface(p);
    assert.deepEqual(surface, planetSurface(getPlanet(restored, p.id)));
    assert.equal(surface.tiles.length, GRID.width * GRID.height);
    assert.equal(surface.deposits.length, 3);
    assert.equal(surface.vents.length, p.kind === 'Vulkanisch' ? 4 : 2);
    for (const tile of surface.tiles.filter(t => t.ore || t.vent)) assert.ok(!['water', 'cliff', 'void'].includes(tile.terrain));
  }
  assert.notDeepEqual(planetSurface(home(state)), planetSurface(getPlanet(state, 'elys')));
  const geology = planetSurface(home(state));
  forecastDay(state); assert.deepEqual(planetSurface(home(state)), geology); assert.equal(exportGame(state), before);
});

test('old buildable coordinates stay buildable and colony landing sites keep neutral yields', () => {
  const state = createGame();
  for (const p of state.planets) {
    for (let y = 0; y < GRID.height; y++) for (let x = 0; x < GRID.width; x++) {
      const wasBlocked = x < 2 && y > 7 || x > 9 && y < 4;
      assert.equal(['water', 'cliff'].includes(terrainAt(p, x, y)), wasBlocked);
    }
    for (const b of p.buildings) assert.equal(siteBonus(p, b.type, b.x, b.y), null);
    assert.equal(surfaceTile(p, -.5, 4), null); assert.equal(surfaceTile(p, 2, GRID.height), null);
  }
});

test('ore veins give miners 20–35 percent extra output; preview, forecast and actual bookings agree', () => {
  for (const type of ['mine', 'deepMine']) {
    const s = createGame(), p = home(s), base = facility(type, neutralTile(p)), rich = facility(type, richTile(p));
    p.buildings = [rich]; p.population = 200; p.stock = makeStock({ food: 1000, energy: 1000 });
    const ordinary = buildingPotential(s, p, base).ore, enhanced = buildingPotential(s, p, rich).ore;
    close(enhanced / ordinary, 1.35);
    const edge = planetSurface(p).tiles.find(t => t.ore === .2);
    close(buildingPotential(s, p, facility(type, edge)).ore / ordinary, 1.2);
    const prediction = forecastDay(s); s.day++; const actual = runDailyEconomy(s);
    close(p.net.ore, enhanced); close(p.stock.ore, enhanced);
    close(prediction.planets.find(q => q.id === p.id).net.ore, p.net.ore);
    close(actual.actual, prediction.budget.actual);
    assert.equal(surfaceTile(p, rich.x, rich.y).ore, .35);
  }
});

test('thermal sites multiply planetary, political and research effects without boosting other facilities', () => {
  for (const id of ['nereid', 'nox', 'cinder']) {
    const s = createGame(), p = getPlanet(s, id); p.owner = 'player'; p.population = 200;
    s.player.ideology = 'technocracy'; s.tech = ['grid', 'fusion'];
    const vent = planetSurface(p).tiles.find(t => t.vent), b = facility('geothermal', vent);
    const base = buildingPotential(s, p, facility('geothermal', neutralTile(p))).energy;
    const enhanced = buildingPotential(s, p, b).energy; close(enhanced / base, 1.4);
    p.buildings = [b]; p.stock = makeStock({ food: 1000 }); simulatePlanet(s, p); close(p.net.energy, enhanced);
    close(geologicalFactor(p, facility('solar', vent), 'energy'), p.solarFactor);
    close(geologicalFactor(p, facility('recycler', richTile(p)), 'ore'), p.oreFactor);
    assert.equal(siteBonus(p, 'crystal', richTile(p).x, richTile(p).y), null);
  }
});

test('automatic connections reach remote buildings without charging or claiming any build space', () => {
  const s = createGame(), p = home(s);
  p.buildings = [facility('habitat', { x: 2, y: 10 }), { ...facility('habitat', { x: 8, y: 10 }), id: 'remote' }, facility('lab', { x: 6, y: 4 }, 2)];
  const before = exportGame(s), links = surfaceConnections(p.buildings);
  assert.equal(links.length, 1); assert.deepEqual(links[0], { from: { x: 2, y: 10 }, to: { x: 8, y: 10 } });
  assert.equal(exportGame(s), before); assert.equal(placementIssue(p, 5, 10), null);
  assert.equal(placeBuilding(s, p, 'solar', 5, 10), null);
  const restored = parseImport(exportGame(s)); assert.deepEqual(home(restored).buildings, p.buildings);
  assert.equal(home(restored).buildings.at(-1).remaining, BUILDINGS.solar.days);
});

test('placement controls explain blocked and occupied sites before resources are booked', () => {
  const s = createGame(), p = home(s), controls = { ...ui(), buildType: 'mine', buildTile: { x: 0, y: 10 } };
  const before = exportGame(s);
  assert.match(renderMapFoot(s, controls), /Steilhang/);
  assert.match(renderMapFoot(s, controls), /data-action="build-place"[^>]*disabled/);
  assert.ok(placeBuilding(s, p, 'mine', 0, 10)); assert.ok(placeBuilding(s, p, 'mine', 4, 7));
  assert.equal(exportGame(s), before);
  controls.buildTile = richTile(p);
  const markup = renderMapFoot(s, controls);
  assert.match(markup, /Erzader/); assert.match(markup, /effect-benefit">\+35 %/); assert.match(markup, /Bei Betrieb \/ Tag/);
  assert.doesNotMatch(markup, /data-action="build-place"[^>]*disabled/);
});

test('site inspection exposes research gates and offers no construction on foreign worlds', () => {
  const s = createGame(), p = home(s), tile = planetSurface(p).tiles.find(t => t.vent);
  const controls = { ...ui(), panel: 'terrain', surfaceTile: tile };
  let markup = renderSheet(s, controls);
  assert.match(markup, /Wärmequelle/); assert.match(markup, /\+40 %/);
  assert.match(markup, /Benötigt:/); assert.match(markup, /data-action="build-start"[^>]*disabled/);
  s.tech.push('geothermal'); markup = renderSheet(s, controls); assert.doesNotMatch(markup, /data-action="build-start"[^>]*disabled/);
  controls.planetId = 'thalassa'; controls.surfaceTile = richTile(getPlanet(s, controls.planetId));
  assert.doesNotMatch(renderSheet(s, controls), /data-action="build-start"/);
});

test('construction progresses through foundation, frame and finishing before producing', () => {
  const s = createGame(), p = home(s), b = facility('geothermal', neutralTile(p), 5);
  p.buildings = [b]; p.population = 200; p.stock = makeStock({ food: 1000 });
  assert.equal(constructionPhase(b, 5), 'foundation');
  simulatePlanet(s, p); assert.equal(p.net.energy, 0);
  simulatePlanet(s, p); assert.equal(constructionPhase(b, 5), 'frame'); assert.equal(p.net.energy, 0);
  simulatePlanet(s, p); simulatePlanet(s, p); assert.equal(constructionPhase(b, 5), 'finishing'); assert.equal(p.net.energy, 0);
  simulatePlanet(s, p); assert.equal(constructionPhase(b, 5), 'complete'); assert.ok(p.net.energy > 0);
});

test('portrait tile picking follows the drawn position after dragging and zooming', () => {
  const s = createGame(), controls = ui(), selected = [], map = Object.create(MapRenderer.prototype);
  Object.assign(map, { state: s, ui: controls, width: 320, height: 520, camera: { x: 0, y: 0, zoom: 1 }, hits: [], pointers: new Map(), dragged: false, tap: hit => selected.push(hit), canvas: { getBoundingClientRect: () => ({ left: 12, top: 80 }) }, surfaceRenderer: { render() {} } });
  const ctx = { fillText() {}, save() {}, beginPath() {}, rect() {}, clip() {}, restore() {} };
  for (const [zoom, dx, dy] of [[1, 0, 0], [2.1, 45, -24], [.7, -31, 40]]) {
    map.camera = { zoom, x: dx, y: dy }; map.hits = []; map.surface(ctx, 320, 520, 0);
    assert.ok(map.hits.length > 0 && map.hits.length <= GRID.width * GRID.height);
    for (const hit of map.hits) assert.ok(hit.x >= 0 && hit.y >= 84 && hit.x + hit.w <= 320 + 1e-8 && hit.y + hit.h <= 486 + 1e-8);
    const target = map.hits.find(h => h.tx === 6 && h.ty === 7);
    map.pointers.set(1, { x: target.x, y: target.y }); map.dragged = false;
    map.pointerUp({ pointerId: 1, clientX: 12 + target.x + target.w / 2, clientY: 80 + target.y + target.h / 2 });
    assert.equal(selected.at(-1).tx, 6); assert.equal(selected.at(-1).ty, 7);
  }
});

test('small portrait construction retains tappable tiles and focuses a selected site above the controls', () => {
  const s = createGame(), controls = { ...ui(), buildType: 'mine', buildTile: richTile(home(s)) }, map = Object.create(MapRenderer.prototype);
  Object.assign(map, { state: s, ui: controls, camera: { x: 0, y: 0, zoom: 1 }, hits: [], surfaceRenderer: { render() {} } });
  const ctx = { fillText() {}, save() {}, beginPath() {}, rect() {}, clip() {}, restore() {} };
  map.surface(ctx, 320, 362, 0);
  assert.ok(map.tileSize >= 24);
  const tile = map.hits.find(h => h.tx === controls.buildTile.x && h.ty === controls.buildTile.y);
  assert.ok(tile && tile.w >= 24 && tile.h >= 24);
  assert.ok(tile.y >= 84 && tile.y + tile.h <= 216 + 1e-8);
  // Panning after choosing the site is allowed; animation frames must not snap it back.
  map.camera.y += 36; const afterPan = map.camera.y; map.surface(ctx, 320, 362, 5000); close(map.camera.y, afterPan);
});

test('every system draws all its planets, including the fourth capital worlds, without interrupting the map loop', () => {
  const state = createGame();
  const ctx = new Proxy({ createRadialGradient: () => ({ addColorStop() {} }) }, { get: (target, key) => target[key] ?? (() => {}) });
  for (const system of SYSTEMS) {
    const map = Object.create(MapRenderer.prototype);
    Object.assign(map, { state, ui: { systemId: system.id, planetId: 'nereid' }, camera: { x: 0, y: 0, zoom: 1 }, hits: [] });
    map.system(ctx, 320, 520, 0);
    const planets = map.hits.filter(h => h.kind === 'planet');
    assert.equal(planets.length, state.planets.filter(p => p.system === system.id).length);
    for (const hit of planets) assert.ok(Number.isFinite(hit.x) && Number.isFinite(hit.y) && hit.x >= 0 && hit.x <= 320 && hit.y >= 84 && hit.y <= 520);
  }
});
