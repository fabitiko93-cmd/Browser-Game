import { BUILDINGS, RESOURCES, TECHNOLOGIES } from './data.js';
import { PLANET_FACTORS } from './development-data.js';
import { surfaceTile, surfaceName, siteBonus, placementIssue, planetSurface, constructionPhase } from './surface.js';
import { buildingPotential } from './economy.js';
import { canAfford } from './state.js';
import { icon } from './icons.js';

const decimal = value => value.toLocaleString('de-DE', { maximumFractionDigits: 1 });
const featureName = tile => tile.vent ? 'Wärmequelle' : tile.ore ? 'Erzader' : ({ ground: 'Ebene Fläche', rough: 'Felsiger Boden', rock: 'Gesteinsrücken', cliff: 'Steilhang', water: 'Offenes Wasser' })[tile.terrain];
const sector = tile => `Sektor ${tile.x + 1} / ${tile.y + 1}`;
const bonusValue = bonus => `<span class="effect-benefit">+${Math.round((bonus.factor - 1) * 100)} %</span>`;
export const compactSurface = ui => ui.view === 'planet' && Boolean(ui.buildType || !ui.expanded && ['terrain', 'building'].includes(ui.panel));
export const surfaceLegend = () => '<div class="surface-legend"><span class="site-key ore">Erz</span><span class="site-key thermal">Wärme</span><span class="site-key neutral">Normal</span></div>';
function heading(title, caption, cancel, details = false) {
  const text = `<strong>${title}</strong><small>${caption}${details ? '<span class="site-details-link"> · Details</span>' : ''}</small>`;
  return `<div class="site-card-heading">${details ? `<button class="site-card-title" data-action="expand" aria-label="Details zu ${title} öffnen">${text}</button>` : `<div class="site-card-title">${text}</div>`}<button class="icon-button" data-action="${cancel}" aria-label="${cancel === 'build-cancel' ? 'Bauplanung abbrechen' : 'Auswahl schließen'}">${icon('close', 18)}</button></div>`;
}
const detailsButton = () => '<button class="button secondary site-card-action" data-action="expand">Details</button>';
export function compactSiteMarkup(state, ui, planet, costs) {
  let header, content, action;
  if (ui.buildType) {
    const type = ui.buildType, def = BUILDINGS[type], position = ui.buildTile;
    const tile = position && surfaceTile(planet, position.x, position.y), issue = position && placementIssue(planet, position.x, position.y);
    const bonus = position && siteBonus(planet, type, position.x, position.y);
    const locked = def.requiredTech && !state.tech.includes(def.requiredTech);
    header = heading(def.name, tile ? `${sector(tile)} · ${featureName(tile)}${bonus ? ` · ${bonusValue(bonus)}` : ''}` : 'Freie Kachel antippen', 'build-cancel');
    const output = tile && !issue && potentialMarkup(state, planet, { type, x: tile.x, y: tile.y });
    content = `${issue ? `<p class="site-warning">${issue}</p>` : output ? `<p class="site-card-output">Bei Betrieb / Tag: ${output}</p>` : ''}${costs(state, planet, def.cost)}${locked ? `<p class="site-warning">Benötigt: ${TECHNOLOGIES[def.requiredTech].name}</p>` : ''}`;
    action = `<button class="button primary site-card-action" data-action="build-place" ${!tile || issue || locked || !canAfford(state, planet, def.cost) ? 'disabled' : ''}>Bauen</button>`;
  } else if (ui.panel === 'building') {
    const b = planet.buildings.find(b => b.id === ui.selectedBuilding);
    if (!b) return `<div class="compact-site">${heading('Anlage nicht verfügbar', 'Die Anlage existiert nicht mehr.', 'close')}</div>${surfaceLegend()}`;
    const def = BUILDINGS[b.type], status = b.remaining > 0 ? `Bau: ${b.remaining} Tage` : !b.enabled ? 'Pausiert' : b.status === 'aktiv' ? 'Aktiv' : 'Versorgung fehlt';
    header = heading(def.name, `${sector(b)} · ${status}`, 'close', true);
    const output = b.remaining <= 0 && potentialMarkup(state, planet, b), bonus = siteBonus(planet, b.type, b.x, b.y);
    content = `${output ? `<p class="site-card-output">Bei Betrieb / Tag: ${output}</p>` : ''}<p class="site-card-note">${bonus ? `Standort ${bonusValue(bonus)} · ` : ''}Unterhalt ${decimal(def.upkeep)} ¢ / Tag</p>`;
    action = detailsButton();
  } else {
    const position = ui.surfaceTile, tile = position && surfaceTile(planet, position.x, position.y);
    if (!tile) return '';
    const type = tile.vent ? 'geothermal' : tile.ore ? 'mine' : null, def = BUILDINGS[type];
    const bonus = siteBonus(planet, type, tile.x, tile.y), issue = placementIssue(planet, tile.x, tile.y);
    const tech = planet.owner && planet.owner !== 'player' ? state.factions?.[planet.owner]?.tech ?? [] : state.tech;
    const locked = def?.requiredTech && !tech.includes(def.requiredTech);
    header = heading(featureName(tile), `${sector(tile)}${bonus ? ` · ${bonusValue(bonus)} Ertrag` : ''}`, 'close', true);
    content = issue ? `<p class="site-warning">${issue}</p>` : def ? `<p class="site-card-note">${def.name}</p>${locked ? `<p class="site-warning">Benötigt: ${TECHNOLOGIES[def.requiredTech].name}</p>` : `<p class="site-card-output">${potentialMarkup(state, planet, { type, x: tile.x, y: tile.y })} / Tag</p>`}` : '<p class="site-card-note">Freie Baufläche · kein Standortbonus</p>';
    action = def && !issue && planet.owner === 'player' ? `<button class="button secondary site-card-action" data-action="build-start" data-type="${type}" data-x="${tile.x}" data-y="${tile.y}" ${locked ? 'disabled' : ''}>Planen</button>` : detailsButton();
  }
  return `<div class="compact-site">${header}<div class="site-card-row"><div class="site-card-summary">${content}</div>${action}</div></div>${surfaceLegend()}`;
}
export function siteMarkup(planet, type, x, y) {
  const tile = surfaceTile(planet, x, y), bonus = siteBonus(planet, type, x, y);
  if (!tile) return '';
  const feature = featureName(tile);
  return `<div class="stat-line"><span>${feature}</span><strong>${bonus ? `Standortertrag <span class="effect-benefit">+${Math.round((bonus.factor - 1) * 100)} %</span>` : 'Kein Standortbonus'}</strong></div>`;
}
export function potentialMarkup(state, planet, building) {
  const output = buildingPotential(state, planet.owner ? planet : { ...planet, owner: 'player' }, building);
  return Object.entries(output).map(([resource, value]) => `<span><strong>${decimal(value)}</strong> ${RESOURCES[resource].name}</span>`).join(' · ');
}
export function constructionMarkup(building) {
  if (!building || building.remaining <= 0) return '';
  const def = BUILDINGS[building.type], phase = constructionPhase(building, def.days), progress = Math.max(0, Math.min(100, (1 - building.remaining / def.days) * 100));
  return `<p class="note">${{ foundation: 'Fundament', frame: 'Rohbau', finishing: 'Endausbau' }[phase]} · ${building.remaining} Tage verbleiben</p><div class="progress"><span style="width:${progress}%"></span></div>`;
}
export function geologyMarkup(planet) {
  const surface = planetSurface(planet), factors = PLANET_FACTORS[planet.kind] ?? {};
  const rates = [['Erzgehalt', planet.oreFactor], ['Solarertrag', planet.solarFactor], ['Agrarertrag', factors.food ?? 1], ['Geothermie', factors.geothermal ?? 1]];
  const locations = [...surface.deposits.map(d => ({ ...d, label: 'Erzader' })), ...surface.vents.map(v => ({ ...v, label: 'Wärmequelle' }))];
  return `<div class="detail-card"><div class="eyebrow">${surfaceName(planet)}</div><p>Planetenfaktoren bestimmen den Grundertrag. Örtliche Vorkommen verbessern passende Anlagen zusätzlich; prüfe ihren Standort durch Antippen einer Baufläche.</p>${rates.map(([label, rate]) => `<div class="stat-line"><span>${label}</span><strong class="${rate > 1 ? 'effect-benefit' : rate < 1 ? 'effect-penalty' : ''}">× ${decimal(rate)}</strong></div>`).join('')}<p class="note">${surface.deposits.length} Erzfelder · ${surface.vents.length} Wärmequellen</p><p class="note">Erzadern: +20–35 % Ertrag für Erzförderer und Tiefenförderanlagen. Wärmequellen: +40 % für Geothermie. Boni gelten zusätzlich zu den Planetenfaktoren und erschöpfen sich nicht.</p></div><div class="section-title">Bekannte Standorte</div><div class="detail-card">${locations.map(t => `<button class="button secondary" data-action="inspect-site" data-x="${t.x}" data-y="${t.y}">${t.label} · Sektor ${t.x + 1} / ${t.y + 1}</button>`).join('')}</div>`;
}
export function terrainPanel(state, ui, planet) {
  const position = ui.surfaceTile, tile = position && surfaceTile(planet, position.x, position.y);
  if (!tile) return '<p class="empty">Wähle eine Fläche auf der Karte.</p>';
  const recommended = tile.vent ? 'geothermal' : tile.ore ? 'mine' : null, def = BUILDINGS[recommended];
  const issue = placementIssue(planet, tile.x, tile.y);
  const tech = planet.owner && planet.owner !== 'player' ? state.factions?.[planet.owner]?.tech ?? [] : state.tech;
  const locked = def?.requiredTech && !tech.includes(def.requiredTech);
  return `<p class="lede">${surfaceName(planet)} · Sektor ${tile.x + 1} / ${tile.y + 1}</p>${siteMarkup(planet, recommended, tile.x, tile.y)}${issue ? `<div class="alert">${issue}</div>` : recommended ? `<div class="detail-card"><strong>${def.name}</strong><div class="stat-line"><span>Ertrag bei Betrieb / Tag</span><strong>${potentialMarkup(state, planet, { type: recommended, x: tile.x, y: tile.y })}</strong></div>${locked ? `<p class="research-condition unmet">Benötigt: ${TECHNOLOGIES[def.requiredTech].name}</p>` : ''}${planet.owner === 'player' ? `<button class="button secondary" data-action="build-start" data-type="${recommended}" data-x="${tile.x}" data-y="${tile.y}" ${locked ? 'disabled' : ''}>Hier ${def.name} planen</button>` : ''}</div>` : '<p class="note">Freie Baufläche für Wohnraum, Industrie und planetare Basen.</p>'}<p class="note">Verbindungen entstehen automatisch. Sie belegen keine Bauflächen; die Versorgung erfolgt aus dem gemeinsamen Planetenvorrat.</p>`;
}
