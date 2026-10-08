import { BUILDINGS, RESOURCES, TECHNOLOGIES } from './data.js';
import { PLANET_FACTORS } from './development-data.js';
import { surfaceTile, surfaceName, siteBonus, placementIssue, planetSurface, constructionPhase } from './surface.js';
import { buildingPotential } from './economy.js';

const decimal = value => value.toLocaleString('de-DE', { maximumFractionDigits: 1 });
export function siteMarkup(planet, type, x, y) {
  const tile = surfaceTile(planet, x, y), bonus = siteBonus(planet, type, x, y);
  if (!tile) return '';
  const feature = tile.vent ? 'Wärmequelle' : tile.ore ? 'Erzader' : ({ ground: 'Ebene Fläche', rough: 'Felsiger Boden', rock: 'Gesteinsrücken', cliff: 'Steilhang', water: 'Offenes Wasser' })[tile.terrain];
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
