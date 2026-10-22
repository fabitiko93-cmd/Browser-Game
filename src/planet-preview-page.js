import { regionBiome, BIOSPHERES } from './planet-biomes.js';
import { VALLEY_VARIANTS, valleyDefinition } from './planet-valley.js';
import { PlanetPreviewScene } from './planet-preview-scene.js';
import { createPlanetBlueprint, createRegionBlueprint, PLANET_PRESETS, REGION_MODULES, SAMPLE_PLANET_SEED } from './planet-blueprint.js';

const $ = id => document.getElementById(id), app = document.querySelector('.planet-app');
const parameters = new URLSearchParams(location.search), debug = parameters.get('debug') === '1';
const rawSeed = parameters.get('seed') ?? SAMPLE_PLANET_SEED;
const seedValue = value => /^\d+$/.test(value) && Number(value) <= 0xffffffff ? Number(value) : value;
let planet, region, selected, view, busy = true, request = 0, sourceName = parameters.get('name')?.slice(0, 40) || 'Nereid';
let mode = 'orbit', markerButtons = new Map(), selectedSite = null;
let valleyChoice = VALLEY_VARIANTS.some(v => v.id === parameters.get('valley')) ? parameters.get('valley') : null;
let biosphereChoice = Object.hasOwn(BIOSPHERES, parameters.get('biosphere')) ? parameters.get('biosphere') : 'terran', activeSeed = rawSeed;

function fail(error) {
  busy = false; $('loading').hidden = true; $('planet-error').hidden = false;
  $('error-text').textContent = error?.message || 'Bitte prüfe deine Verbindung und öffne die Ansicht erneut.';
  $('asset-state').textContent = 'Laden fehlgeschlagen'; console.error('Planet preview:', error);
}
function loading(value, label = 'Region wird aufgebaut') {
  busy = value; $('valley-select').disabled = value; $('biosphere-select').disabled = value; $('loading').hidden = !value; $('loading-label').textContent = label; $('region-enter').disabled = value;
  if (value) $('planet-error').hidden = true;
}
function drawMarkers() {
  if (!view || !planet) return;
  if (mode === 'region') { $('north-arrow').style.transform = `rotate(${view.northBearing()}rad)`; return; }
  for (const r of planet.regions) {
    const el = markerButtons.get(r.id), p = view.markerPosition(r);
    el.hidden = !p;
    if (p) { el.style.left = `${p.x}px`; el.style.top = `${p.y}px`; }
  }
}
function updateRegion() {
  const valley = valleyDefinition({ ...selected, preset: planet.preset });
  const biome = regionBiome({ preset: planet.preset, biosphere: planet.biosphere, module: selected.module, climate: selected.climate });
  const config = biome?.alien ? biome : valley ?? biome ?? REGION_MODULES[selected.module];
  $('region-name').textContent = selected.name; $('region-kind').textContent = config.name;
  $('region-description').textContent = config.description;
  const coordinate = (value, positive, negative) => `${Math.abs(value).toLocaleString('de-DE', { maximumFractionDigits: 1 })}° ${value >= 0 ? positive : negative}`;
  $('region-context').textContent = `${coordinate(selected.latitude, 'N', 'S')} · ${coordinate(selected.longitude, 'O', 'W')}${selected.climate ? ` · ${Math.round(selected.climate.elevationM).toLocaleString('de-DE')} m Höhe` : ''}`;
  $('region-context').title = region?.colony?.description ?? '';
  $('region-status').textContent = mode === 'orbit' ? 'Erschlossen' : region?.colony?.name ?? 'Baugebiet · Ansicht';
  for (const button of $('regions').children) button.setAttribute('aria-pressed', String(button.dataset.region === selected.id));
  for (const [id, button] of markerButtons) { button.classList.toggle('selected', selected.id === id); button.setAttribute('aria-pressed', String(selected.id === id)); }
  $('view-description').textContent = mode === 'orbit' ? `${planet.regions.length} Regionen · vollständig erschlossen` : `${selected.name} · ${config.name}`;
  $('region-north').hidden = mode !== 'region';
  $('valley-controls').hidden = !valley || mode !== 'region';
  $('comparison-controls').hidden = planet.preset !== 'temperate';
  $('comparison-controls').dataset.valley = String(!!valley && mode === 'region');
  $('biosphere-select').value = planet.biosphere ?? 'terran';
  $('valley-select').value = valley?.id ?? '';
  $('view-caption').textContent = mode === 'orbit' ? 'ORBITALE ÜBERSICHT' : 'REGIONALE ANSICHT';
  $('gesture-hint').textContent = mode === 'orbit' ? 'Ziehen zum Drehen · Region antippen' : 'Ziehen zum Drehen · Baugebiet antippen';
}
function siteInfo(site) {
  if (!site) { selectedSite = null; $('site-info').hidden = true; return; }
  selectedSite = site; const info = $('site-info'); info.hidden = false; info.replaceChildren();
  const heading = document.createElement('strong'); heading.textContent = site.water ? 'Wasserfläche' : site.buildable ? 'Geeignete Baufläche' : 'Starker Geländehang'; info.append(heading, document.createElement('br'));
  const resource = site.deposits.includes('geothermal') ? 'Wärmequelle' : site.deposits.includes('ore') ? 'Erzvorkommen' : 'Kein erfasstes Vorkommen';
  info.append(document.createTextNode(`${resource} · Neigung ${Math.round(Math.atan(site.slope) * 180 / Math.PI)}°${site.coastDistance != null ? ` · Küste ca. ${Math.round(site.coastDistance)} m` : ''}`));
}
async function selectRegion(id) {
  if (busy) return; selected = planet.regions.find(r => r.id === id) ?? selected; selectedSite = null; $('site-info').hidden = true;
  updateRegion();
  if (mode === 'orbit') { view.focusRegion(selected); return; }
  await enterRegion();
}
async function enterRegion(pose = null) {
  const currentRequest = ++request; mode = 'region'; app.dataset.mode = mode;
  $('markers').hidden = true; $('grid-toggle').hidden = false; $('region-enter').hidden = true; $('orbit-return').hidden = false;
  selectedSite = null; $('site-info').hidden = true; region = createRegionBlueprint(planet, selected.id); updateRegion(); loading(true);
  try {
    await view.showRegion(region); if (currentRequest !== request) return;
    if (pose) { view.camera.position.copy(pose.eye); view.controls.target.copy(pose.target); view.camera.fov = pose.fov; view.camera.updateProjectionMatrix(); view.controls.update(); view.keepCameraAboveGround(); view.dirty = true; }
    loading(false); $('asset-state').textContent = regionBiome(region)?.alien ? 'ORBIT · Alien-Flora' : 'Poly Haven · EZ-Tree'; const url = new URL(location.href); url.searchParams.set('region', selected.id); if (region.valley) url.searchParams.set('valley', region.valley); history.replaceState(null, '', url);
  }
  catch (error) { if (currentRequest === request) fail(error); }
}
function orbit() {
  request++; mode = 'orbit'; region = null; app.dataset.mode = mode;
  $('markers').hidden = false; $('grid-toggle').hidden = true; $('region-enter').hidden = false; $('orbit-return').hidden = true; $('site-info').hidden = true;
  view.showOrbit(); view.focusRegion(selected); updateRegion(); loading(false); $('asset-state').textContent = planet.geography ? 'Seedbasierte Planetengeografie' : 'Solar System Scope';
  const url = new URL(location.href); url.searchParams.delete('region'); history.replaceState(null, '', url);
}
async function generate(seed, preset, regionCount) {
  const currentRequest = ++request;
  activeSeed = seed;
  loading(true, 'Planet wird aufgebaut'); mode = 'orbit'; app.dataset.mode = mode;
  planet = createPlanetBlueprint(seedValue(seed), { preset, regionCount, name: sourceName, valley: valleyChoice, biosphere: preset === 'temperate' ? biosphereChoice : 'terran' }); selected = planet.regions[0]; region = null;
  $('planet-name').textContent = planet.name; document.title = `${planet.name} · ORBIT 3077`;
  $('planet-facts').replaceChildren();
  for (const text of [planet.biosphere ? BIOSPHERES[planet.biosphere].name : PLANET_PRESETS[preset].name, `Ø ${Math.round(planet.radiusKm * 2).toLocaleString('de-DE')} km`, `${planet.regions.length} Regionen`]) { const span = document.createElement('span'); span.textContent = text; $('planet-facts').append(span); }
  $('regions').replaceChildren(); $('markers').replaceChildren(); markerButtons = new Map();
  for (const r of planet.regions) {
    const tab = document.createElement('button'); tab.className = 'region-tab'; tab.dataset.region = r.id; tab.textContent = r.name; tab.addEventListener('click', () => selectRegion(r.id)); $('regions').append(tab);
    const pin = document.createElement('button'); pin.className = 'region-marker'; pin.setAttribute('aria-label', `${r.name} fokussieren`); const label = document.createElement('span'); label.textContent = r.name; pin.append(label); pin.addEventListener('click', () => selectRegion(r.id)); markerButtons.set(r.id, pin); $('markers').append(pin);
  }
  $('seed-input').value = String(seed); $('planet-preset').value = preset; $('region-count').value = String(regionCount);
  $('markers').hidden = false; $('grid-toggle').hidden = true; $('region-enter').hidden = false; $('orbit-return').hidden = true; $('site-info').hidden = true;
  updateRegion();
  try {
    await view.setPlanet(planet); if (currentRequest !== request) return;
    view.focusRegion(selected); loading(false); $('asset-state').textContent = planet.geography ? 'Seedbasierte Planetengeografie' : 'Solar System Scope';
    const url = new URL(location.href); url.searchParams.set('seed', String(seed)); url.searchParams.set('preset', preset); url.searchParams.set('regions', String(regionCount)); url.searchParams.delete('region'); if (valleyChoice) url.searchParams.set('valley', valleyChoice); else url.searchParams.delete('valley'); if (planet.biosphere) url.searchParams.set('biosphere', planet.biosphere); else url.searchParams.delete('biosphere'); history.replaceState(null, '', url);
  } catch (error) { if (currentRequest === request) fail(error); }
}

$('settings-open').addEventListener('click', () => $('settings-dialog').showModal());
for (const [id, biology] of Object.entries(BIOSPHERES)) { const option = document.createElement('option'); option.value = id; option.textContent = biology.name; $('biosphere-select').append(option); }
$('biosphere-select').addEventListener('change', async () => {
  if (busy || !view) return;
  const id = selected.id, inRegion = mode === 'region', expectedRequest = request + 1;
  const pose = inRegion ? { eye: view.camera.position.clone(), target: view.controls.target.clone(), fov: view.camera.fov } : null;
  biosphereChoice = $('biosphere-select').value;
  await generate(activeSeed, planet.preset, planet.regions.length);
  if (request !== expectedRequest || !$('planet-error').hidden) return;
  selected = planet.regions.find(r => r.id === id) ?? planet.regions[0]; updateRegion();
  if (inRegion) await enterRegion(pose); else view.focusRegion(selected);
});
for (const variant of VALLEY_VARIANTS) { const option = document.createElement('option'); option.value = variant.id; option.textContent = variant.name; $('valley-select').append(option); }
$('valley-select').addEventListener('change', () => { if (busy) return; valleyChoice = $('valley-select').value; selected.valley = valleyChoice; void enterRegion(); });
$('seed-random').addEventListener('click', () => { $('seed-input').value = String(crypto.getRandomValues(new Uint32Array(1))[0]); });
$('seed-form').addEventListener('submit', e => { e.preventDefault(); const seed = $('seed-input').value.trim(); if (!seed) return; $('settings-dialog').close(); void generate(seed, $('planet-preset').value, Number($('region-count').value)); });
$('region-enter').addEventListener('click', () => { if (!busy) void enterRegion(); });
$('orbit-return').addEventListener('click', () => { if (!busy) orbit(); });
$('zoom-in').addEventListener('click', () => view?.zoom(.82)); $('zoom-out').addEventListener('click', () => view?.zoom(1.22));
$('camera-home').addEventListener('click', () => view?.resetCamera());
$('grid-toggle').addEventListener('click', () => { const visible = $('grid-toggle').getAttribute('aria-pressed') !== 'true'; $('grid-toggle').setAttribute('aria-pressed', String(visible)); $('grid-toggle').setAttribute('aria-label', visible ? 'Bauflächen ausblenden' : 'Bauflächen einblenden'); view?.setGrid(visible); });
$('reload').addEventListener('click', () => location.reload());
window.addEventListener('pagehide', () => view?.dispose(), { once: true });
window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
try {
  view = new PlanetPreviewScene($('planet-canvas'), { onSite: siteInfo, onFrame: drawMarkers }); view.failed = fail;
  const preset = Object.hasOwn(PLANET_PRESETS, parameters.get('preset')) ? parameters.get('preset') : 'temperate';
  const count = Number(parameters.get('regions') ?? 4);
  void generate(rawSeed, preset, [3, 4, 5].includes(count) ? count : 4).then(() => { const direct = planet.regions.find(r => r.id === parameters.get('region')); if (direct && $('planet-error').hidden) { selected = direct; return enterRegion(); } });
} catch (error) { fail(error); }

if (debug) globalThis.ORBIT_PLANET_DEBUG = { get planet() { return planet; }, get region() { return region; }, get mode() { return mode; }, get busy() { return busy; }, get selected() { return selected; }, get site() { return selectedSite; }, get view() { return view; } };
