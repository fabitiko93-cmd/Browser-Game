import { BUILDINGS, RESOURCES, TECHNOLOGIES } from './data.js';
import { PLANET_FACTORS } from './development-data.js';
import { surfaceTile, surfaceName, siteBonus, placementIssue, planetSurface, constructionPhase } from './surface.js';
import { buildingPotential } from './economy.js';

const decimal = value => value.toLocaleString('de-DE', { maximumFractionDigits: 1 });
export function siteMarkup(planet, type, x, y) {
  const tile = surfaceTile(planet, x, y), bonus = siteBonus(planet, type, x, y);
  if (!tile) return '';
  const feature = tile.vent ? 'Wärmequelle' : tile.ore ? 'Erzader' : ({ ground: 'Ebene Fläche', rough: 'Felsiger Boden', rock: 'Gesteinsrücken', cliff: 'Steilhang', water: 'Offenes Wasser' })[tile.terrain];
  return `<div class="site-summary"><span>${feature}</span>${bonus ? `<span>Standortertrag <strong class="effect-benefit">+${Math.round((bonus.factor - 1) * 100)} %</strong></span>` : '<span>Kein Standortbonus</span>'}</div>`;
}
export function potentialMarkup(state, planet, building) {
  const output = buildingPotential(state, planet.owner ? planet : { ...planet, owner: 'player' }, building);
  return Object.entries(output).map(([resource, value]) => `<span><strong>${decimal(value)}</strong> ${RESOURCES[resource].name}</span>`).join(' · ');
}
export function constructionMarkup(building) {
  if (!building || building.remaining <= 0) return '';
  const def = BUILDINGS[building.type], phase = constructionPhase(building, def.days), progress = Math.max(0, Math.min(100, (1 - building.remaining / def.days) * 100));
  return `<div class="construction-status"><span>${{ foundation: 'Fundament', frame: 'Rohbau', finishing: 'Endausbau' }[phase]} · ${building.remaining} Tage verbleiben</span><div class="progress"><span style="width:${progress}%"></span></div></div>`;
}
export function geologyMarkup(planet) {
  const surface = planetSurface(planet), factors = PLANET_FACTORS[planet.kind] ?? {};
  const rates = [['Erzgehalt', planet.oreFactor], ['Solarertrag', planet.solarFactor], ['Agrarertrag', factors.food ?? 1], ['Geothermie', factors.geothermal ?? 1]];
  return `<div class="detail-card geology-card"><div class="eyebrow">${surfaceName(planet)}</div><p>${surface.kind === 'ice' ? 'Gefrorene Ebenen, Eisbrüche und freigelegte Erzadern. Wärmequellen bieten gezielte Energiestandorte.' : surface.kind === 'volcanic' ? 'Basalt, Krater und glühende Bruchzonen. Hoher Erzgehalt und starke Geothermie begünstigen eine Industriekolonie.' : 'Felsrücken und Krater mit örtlichen Erzadern. Platziere Förderanlagen auf den sichtbaren Vorkommen.'}</p>${rates.map(([label, rate]) => `<div class="stat-line"><span>${label}</span><strong class="${rate > 1 ? 'effect-benefit' : rate < 1 ? 'effect-penalty' : ''}">× ${decimal(rate)}</strong></div>`).join('')}<div class="site-summary"><span>◇ ${surface.deposits.length} Erzfelder</span><span>≋ ${surface.vents.length} Wärmequellen</span></div><p class="note">Erzadern: +20–35 % Ertrag für Erzförderer und Tiefenförderanlagen. Wärmequellen: +40 % für Geothermie. Boni gelten zusätzlich zu den Planetenfaktoren und erschöpfen sich nicht.</p></div>`;
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
