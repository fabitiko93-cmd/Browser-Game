import { regionBiome, BIOSPHERES } from './planet-biomes.js';
import { VALLEY_VARIANTS, valleyDefinition } from './planet-valley.js';
import { PlanetPreviewScene } from './planet-preview-scene.js';
import { createPlanetBlueprint, createRegionBlueprint, PLANET_PRESETS, REGION_MODULES, SAMPLE_PLANET_SEED } from './planet-blueprint.js';
import { CLIMATE_MODES, CLIMATE_BIOMES } from './planet-climate.js';
import { PLANET_EXAMPLES } from './planet-examples.js';
import { constructionKey, emptyConstruction, loadConstructionStore, saveConstructionStore } from './planet-construction.js';
import { PROBE_BUILDINGS, RESOURCE_TYPES } from './planet-resources.js';
import { PlanetStudio } from './planet-studio-page.js';

const $ = id => document.getElementById(id), app = document.querySelector('.planet-app');
const parameters = new URLSearchParams(location.search), debug = parameters.get('debug') === '1';
const rawSeed = parameters.get('seed') ?? SAMPLE_PLANET_SEED;
const seedValue = value => /^\d+$/.test(value) && Number(value) <= 0xffffffff ? Number(value) : value;
let planet, region, selected, view, busy = true, request = 0, sourceName = parameters.get('name')?.slice(0, 40) || 'Nereid';
let mode = 'orbit', markerButtons = new Map(), selectedSite = null, studio;
let valleyChoice = VALLEY_VARIANTS.some(v => v.id === parameters.get('valley')) ? parameters.get('valley') : null;
let biosphereChoice = Object.hasOwn(BIOSPHERES, parameters.get('biosphere')) ? parameters.get('biosphere') : 'terran', activeSeed = rawSeed;
let climateChoice = Object.hasOwn(CLIMATE_MODES, parameters.get('climate')) ? parameters.get('climate') : 'auto';
let referenceChoice = parameters.get('reference') === '1';
const probeStorage = { getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) };
const constructionStates = loadConstructionStore(probeStorage);
function regionConstruction(r) { const key = constructionKey(r), state = constructionStates.get(key) ?? emptyConstruction(); constructionStates.delete(key); constructionStates.set(key, state); while (constructionStates.size > 32) constructionStates.delete(constructionStates.keys().next().value); return state; }
function saveProbe() { const saved = saveConstructionStore(probeStorage, constructionStates); $('site-feedback').textContent = saved ? '' : 'Speichern ist hier nicht verfügbar; die Bauprobe bleibt für diese Sitzung erhalten.'; return saved; }

function fail(error) {
  busy = false; $('loading').hidden = true; $('planet-error').hidden = false;
  $('error-text').textContent = error?.message || 'Bitte prüfe deine Verbindung und öffne die Ansicht erneut.';
  $('asset-state').textContent = 'Laden fehlgeschlagen'; console.error('Planet preview:', error);
  studio?.sync();
}
function loading(value, label = 'Region wird aufgebaut') {
  $('probe-type').disabled = value;
  busy = value; $('valley-select').disabled = value; $('biosphere-select').disabled = value; $('loading').hidden = !value; $('loading-label').textContent = label; $('region-enter').disabled = value;
  if (value) $('planet-error').hidden = true;
  studio?.sync();
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
  const recipe = { ...selected, generatorVersion: planet.generatorVersion, preset: planet.preset, biosphere: planet.biosphere };
  const valley = valleyDefinition(recipe), biome = regionBiome(recipe);
  const config = planet.generatorVersion >= 8 ? biome ?? REGION_MODULES[selected.module] : biome?.alien ? biome : valley ?? biome ?? REGION_MODULES[selected.module];
  $('region-name').textContent = selected.name; $('region-kind').textContent = config.name;
  $('region-description').textContent = config.description;
  const coordinate = (value, positive, negative) => `${Math.abs(value).toLocaleString('de-DE', { maximumFractionDigits: 1 })}° ${value >= 0 ? positive : negative}`;
  $('region-context').textContent = `${coordinate(selected.latitude, 'N', 'S')} · ${coordinate(selected.longitude, 'O', 'W')}${selected.climate ? ` · ${Math.round(selected.climate.temperatureC)} °C · ${Math.round(selected.climate.elevationM).toLocaleString('de-DE')} m` : ''}`;
  $('region-landform').textContent = planet.generatorVersion >= 8 ? `${REGION_MODULES[selected.module].name}${selected.climate && planet.preset === 'temperate' ? ` · ${selected.climate.moisture < .3 ? 'trocken' : selected.climate.moisture > .7 ? 'feucht' : 'mäßig feucht'}` : ''}` : '';
  $('region-context').title = region?.colony?.description ?? '';
  $('region-status').textContent = mode === 'orbit' ? 'Erschlossen' : region?.colony?.name ?? 'Baugebiet · Ansicht';
  for (const button of $('regions').children) button.setAttribute('aria-pressed', String(button.dataset.region === selected.id));
  for (const [id, button] of markerButtons) { button.classList.toggle('selected', selected.id === id); button.setAttribute('aria-pressed', String(selected.id === id)); }
  $('view-description').textContent = mode === 'orbit' ? `${planet.regions.length} Regionen · vollständig erschlossen` : `${selected.name} · ${config.name}`;
  $('region-north').hidden = mode !== 'region';
  $('construction-tools').hidden = mode !== 'region';
  $('resource-legend').hidden = mode !== 'region' || $('resource-toggle').getAttribute('aria-pressed') !== 'true';
  $('valley-controls').hidden = !valley || mode !== 'region';
  $('comparison-controls').hidden = planet.preset !== 'temperate';
  $('comparison-controls').dataset.valley = String(!!valley && mode === 'region');
  $('biosphere-select').value = planet.biosphere ?? 'terran';
  $('valley-select').value = valley?.id ?? '';
  $('view-caption').textContent = studio?.active ? 'LANDSCHAFTSVERGLEICH' : mode === 'orbit' ? 'ORBITALE ÜBERSICHT' : 'REGIONALE ANSICHT';
  $('gesture-hint').textContent = mode === 'orbit' ? 'Ziehen zum Drehen · Region antippen' : 'Ziehen zum Drehen · Baugebiet antippen';
}
function siteInfo(site) {
  app.dataset.site = String(!!site);
  $('selection-legend').hidden = !site?.field;
  if (site?.field) { $('selection-resource').textContent = RESOURCE_TYPES[site.field.type].field; $('selection-legend').style.setProperty('--deposit-color', RESOURCE_TYPES[site.field.type].color); }
  if (!site) { selectedSite = null; $('site-info').hidden = true; return; }
  selectedSite = site; $('site-info').hidden = false; const info = $('site-summary'); info.replaceChildren(); $('site-feedback').textContent = '';
  const assessment = site.construction, counts = assessment?.counts;
  const config = PROBE_BUILDINGS[site.building?.type ?? $('probe-type').value];
  const heading = document.createElement('strong'); heading.textContent = site.resourceOnly ? `${RESOURCE_TYPES[site.field.type].field} · Vorkommen` : site.building ? `${config.name} · Bauprobe` : site.water ? 'Wasserfläche' : assessment?.issue ? 'Grundfläche nicht bebaubar' : 'Geeignete Baufläche'; info.append(heading, document.createElement('br'));
  const resource = [...new Set(site.deposits)].map(id => RESOURCE_TYPES[id]?.field).filter(Boolean).join(' / ') || site.resources?.substrate || 'Kein erfasstes Vorkommen';
  info.append(document.createTextNode(`${resource} · Neigung ${Math.round(Math.atan(site.slope) * 180 / Math.PI)}°${site.coastDistance != null ? ` · Küste ca. ${Math.round(site.coastDistance)} m` : ''}`));
  $('site-build').hidden = !!site.building || site.resourceOnly; $('site-build').disabled = !assessment || !!assessment.issue; $('site-demolish').hidden = !site.building;
  $('site-build').textContent = `${config.name} setzen · Probe`;
  $('construction-detail').textContent = site.resourceOnly ? 'Vorkommen außerhalb des Baugebiets · gesamter Dichtebereich markiert.' : site.building ? '4 × 4 Rasterfelder · 8 × 8 m' : assessment?.issue ? `8 × 8 m · Rote Bauvorschau: ${assessment.issue}` : `8 × 8 m · 4 × 4 Rasterfelder · Räumung: ${counts.tree} Bäume, ${counts.plant} Pflanzen, ${counts.stone} kleine Steine.`;
  $('site-production').hidden = !site.production; $('site-production').replaceChildren();
  if (site.production) {
    const p = site.production, amount = value => value.toLocaleString('de-DE', { maximumFractionDigits: 2 });
    const yieldLine = document.createElement('strong'), context = document.createElement('span'); yieldLine.textContent = `${amount(p.daily)} ${p.unit} / Tag · Fördervorschau`;
    context.textContent = `${p.quality} · Standort ${Math.round(p.factor * 100)} %${p.competition > .001 ? ' · geteilter Förderbereich' : ''}`;
    const cost = document.createElement('small'); cost.textContent = `${p.workers} Arbeitskräfte · ${p.energy ? `${p.energy} Energie + ` : ''}${p.upkeep} ¢ / Tag`;
    $('site-production').append(yieldLine, context, cost);
  }
}
async function selectRegion(id) {
  if (busy) return; selected = planet.regions.find(r => r.id === id) ?? selected; siteInfo(null);
  updateRegion();
  if (mode === 'orbit') { view.focusRegion(selected); return; }
  await enterRegion();
}
async function enterRegion(pose = null) {
  const currentRequest = ++request; mode = 'region'; app.dataset.mode = mode;
  $('markers').hidden = true; $('grid-toggle').hidden = false; $('region-enter').hidden = true; $('orbit-return').hidden = false;
  siteInfo(null); loading(true);
  try {
    region = createRegionBlueprint(planet, selected.id); updateRegion();
    view.studioActive = !!studio?.active;
    await view.showRegion(region, studio?.active ? emptyConstruction() : regionConstruction(region)); if (currentRequest !== request) return;
    if (pose) { view.camera.position.copy(pose.eye); view.controls.target.copy(pose.target); view.camera.fov = pose.fov; view.camera.updateProjectionMatrix(); view.controls.update(); view.keepCameraAboveGround(); view.dirty = true; }
    studio?.regionReady(pose);
    loading(false); $('asset-state').textContent = 'Region bereit'; const url = new URL(location.href); url.searchParams.set('region', selected.id); if (region.valley) url.searchParams.set('valley', region.valley); else url.searchParams.delete('valley'); history.replaceState(null, '', url);
  }
  catch (error) { if (currentRequest === request) fail(error); }
}
function orbit() {
  request++; mode = 'orbit'; region = null; app.dataset.mode = mode;
  siteInfo(null);
  $('markers').hidden = false; $('grid-toggle').hidden = true; $('region-enter').hidden = false; $('orbit-return').hidden = true; $('site-info').hidden = true;
  view.showOrbit(); view.focusRegion(selected); updateRegion(); loading(false); $('asset-state').textContent = 'Planet bereit';
  const url = new URL(location.href); url.searchParams.delete('region'); history.replaceState(null, '', url);
}
async function generate(seed, preset, regionCount) {
  const currentRequest = ++request;
  activeSeed = seed;
  loading(true, 'Planet wird aufgebaut'); mode = 'orbit'; app.dataset.mode = mode;
  siteInfo(null);
  try { planet = createPlanetBlueprint(seedValue(seed), { preset, regionCount, name: sourceName, valley: valleyChoice, biosphere: preset === 'temperate' ? biosphereChoice : 'terran', climate: climateChoice, reference: referenceChoice }); }
  catch (error) { if (currentRequest === request) fail(error); return; }
  selected = planet.regions[0]; region = null;
  $('planet-name').textContent = planet.name; document.title = `${planet.name} · ORBIT 3077`;
  $('planet-facts').replaceChildren();
  for (const text of [planet.biosphere ? BIOSPHERES[planet.biosphere].name : PLANET_PRESETS[preset].name, `Ø ${Math.round(planet.radiusKm * 2).toLocaleString('de-DE')} km`, `${planet.regions.length} Regionen`]) { const span = document.createElement('span'); span.textContent = text; $('planet-facts').append(span); }
  $('regions').replaceChildren(); $('markers').replaceChildren(); markerButtons = new Map();
  for (const r of planet.regions) {
    const tab = document.createElement('button'); tab.className = 'region-tab'; tab.dataset.region = r.id; tab.textContent = r.name; tab.addEventListener('click', () => selectRegion(r.id)); $('regions').append(tab);
    const pin = document.createElement('button'); pin.className = 'region-marker'; pin.setAttribute('aria-label', `${r.name} fokussieren`); const label = document.createElement('span'); label.textContent = r.name; pin.append(label); pin.addEventListener('click', () => selectRegion(r.id)); markerButtons.set(r.id, pin); $('markers').append(pin);
  }
  $('seed-input').value = String(seed); $('planet-preset').value = preset; $('region-count').value = String(regionCount);
  $('planet-climate').value = climateChoice; $('planet-climate').disabled = preset !== 'temperate';
  $('markers').hidden = false; $('grid-toggle').hidden = true; $('region-enter').hidden = false; $('orbit-return').hidden = true; $('site-info').hidden = true;
  updateRegion();
  try {
    await view.setPlanet(planet); if (currentRequest !== request) return;
    view.focusRegion(selected); loading(false); $('asset-state').textContent = 'Planet bereit';
    const url = new URL(location.href); url.searchParams.set('seed', String(seed)); url.searchParams.set('preset', preset); url.searchParams.set('regions', String(regionCount)); url.searchParams.set('climate', climateChoice); if (referenceChoice) url.searchParams.set('reference', '1'); else url.searchParams.delete('reference'); url.searchParams.delete('region'); if (referenceChoice && valleyChoice) url.searchParams.set('valley', valleyChoice); else url.searchParams.delete('valley'); if (planet.biosphere) url.searchParams.set('biosphere', planet.biosphere); else url.searchParams.delete('biosphere'); history.replaceState(null, '', url);
  } catch (error) { if (currentRequest === request) fail(error); }
}

$('settings-open').addEventListener('click', () => $('settings-dialog').showModal());
for (const [id, config] of Object.entries(CLIMATE_MODES)) { const option = document.createElement('option'); option.value = id; option.textContent = config.name; $('planet-climate').append(option); }
$('planet-preset').addEventListener('change', () => { $('planet-climate').disabled = $('planet-preset').value !== 'temperate'; });
for (const example of PLANET_EXAMPLES) {
  const p = CLIMATE_BIOMES[example.biome], button = document.createElement('button'), title = document.createElement('strong'), note = document.createElement('span');
  button.type = 'button'; button.className = 'landscape-example'; button.style.setProperty('--landscape-color', p.meadow); title.textContent = p.name; note.textContent = REGION_MODULES[example.module].name; button.append(title, note);
  button.addEventListener('click', async () => {
    if (busy) return; referenceChoice = false; climateChoice = example.climate; $('settings-dialog').close();
    const expectedRequest = request + 1; await generate(String(example.seed), 'temperate', 5);
    if (request !== expectedRequest || !$('planet-error').hidden) return;
    selected = planet.regions.find(r => r.id === example.region); updateRegion(); await enterRegion();
  });
  $('examples-grid').append(button);
}
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
$('seed-form').addEventListener('submit', e => { e.preventDefault(); const seed = $('seed-input').value.trim(); if (!seed) return; referenceChoice = false; climateChoice = $('planet-climate').value; $('settings-dialog').close(); void generate(seed, $('planet-preset').value, Number($('region-count').value)); });
$('region-enter').addEventListener('click', () => { if (!busy) void enterRegion(); });
$('orbit-return').addEventListener('click', () => { if (!busy) orbit(); });
$('zoom-in').addEventListener('click', () => { view?.zoom(.82); studio?.rememberCamera(); }); $('zoom-out').addEventListener('click', () => { view?.zoom(1.22); studio?.rememberCamera(); });
$('camera-home').addEventListener('click', () => studio?.active ? studio.setCamera('overview') : view?.resetCamera());
$('grid-toggle').addEventListener('click', () => { const visible = $('grid-toggle').getAttribute('aria-pressed') !== 'true'; $('grid-toggle').setAttribute('aria-pressed', String(visible)); $('grid-toggle').setAttribute('aria-label', visible ? 'Bauflächen ausblenden' : 'Bauflächen einblenden'); view?.setGrid(visible); });
$('reload').addEventListener('click', () => location.reload());
for (const [id, config] of Object.entries(PROBE_BUILDINGS)) { const option = document.createElement('option'); option.value = id; option.textContent = config.name; $('probe-type').append(option); }
$('probe-type').addEventListener('change', () => { if (!busy) view?.setProbeType($('probe-type').value); });
$('resource-toggle').addEventListener('click', () => { const visible = $('resource-toggle').getAttribute('aria-pressed') !== 'true'; $('resource-toggle').setAttribute('aria-pressed', String(visible)); $('resource-toggle').setAttribute('aria-label', visible ? 'Vorkommenskarte ausblenden' : 'Vorkommenskarte einblenden'); $('resource-legend').hidden = !visible; view?.setResourceMap(visible); });
$('site-build').addEventListener('click', () => {
  if (busy) return; const result = view?.buildSelected(); if (!result) return;
  if (result.issue) { $('site-feedback').textContent = result.issue; return; }
  if (saveProbe()) $('site-feedback').textContent = `${PROBE_BUILDINGS[result.building.type].name} gesetzt · Fläche geräumt.`;
  $('site-demolish').focus({ preventScroll: true });
});
$('site-demolish').addEventListener('click', () => {
  if (busy || !view?.demolishSelected()) return;
  if (saveProbe()) $('site-feedback').textContent = 'Probebau entfernt · Fläche bleibt geräumt.';
  $('site-build').focus({ preventScroll: true });
});
$('construction-reset').addEventListener('click', () => {
  if (busy) return; constructionStates.clear();
  if (region) { view.construction = regionConstruction(region); view.syncConstruction(); view.refreshSelected(); }
  saveProbe(); $('settings-dialog').close();
});
window.addEventListener('pagehide', () => view?.dispose(), { once: true });
window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });

async function visitStudioScene(recipe) {
  if (busy) return;
  const preset = Object.hasOwn(PLANET_PRESETS, recipe.preset) ? recipe.preset : 'temperate';
  const climate = Object.hasOwn(CLIMATE_MODES, recipe.climate) ? recipe.climate : 'auto';
  const biology = Object.hasOwn(BIOSPHERES, recipe.biosphere) ? recipe.biosphere : 'terran';
  const count = [3, 4, 5].includes(recipe.regions) ? recipe.regions : 5;
  const sameWorld = String(activeSeed) === String(recipe.seed) && planet.preset === preset && planet.regions.length === count && climateChoice === climate && biosphereChoice === biology && referenceChoice === !!recipe.reference && valleyChoice === (recipe.valley ?? null);
  climateChoice = climate; biosphereChoice = biology; referenceChoice = !!recipe.reference; valleyChoice = recipe.valley ?? null;
  if (!sameWorld) await generate(String(recipe.seed), preset, count);
  if (!$('planet-error').hidden) return;
  selected = planet.regions.find(r => r.id === recipe.region) ?? planet.regions[0]; updateRegion();
  if (sameWorld && region?.regionId === selected.id) { studio.regionReady(); studio.sync(); }
  else await enterRegion();
}

studio = new PlanetStudio({
  getState: () => ({ planet, region, selected, view, busy, mode, seed: activeSeed }),
  visit: visitStudioScene,
  toggle: async (active, pose) => { view.studioActive = active; await enterRegion(pose); }
});
try {
  view = new PlanetPreviewScene($('planet-canvas'), { onSite: siteInfo, onFrame: drawMarkers }); view.failed = fail;
  const preset = Object.hasOwn(PLANET_PRESETS, parameters.get('preset')) ? parameters.get('preset') : 'temperate';
  const count = Number(parameters.get('regions') ?? 4);
  void generate(rawSeed, preset, [3, 4, 5].includes(count) ? count : 4).then(() => { if (!planet || !$('planet-error').hidden) return; const direct = planet.regions.find(r => r.id === parameters.get('region')); if (direct || studio.active) { selected = direct ?? planet.regions[0]; return enterRegion(); } });
} catch (error) { fail(error); }

if (debug) globalThis.ORBIT_PLANET_DEBUG = { get planet() { return planet; }, get region() { return region; }, get mode() { return mode; }, get busy() { return busy; }, get selected() { return selected; }, get site() { return selectedSite; }, get view() { return view; }, get studio() { return studio; } };
