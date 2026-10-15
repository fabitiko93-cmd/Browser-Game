import { battleResult, battleLosses } from './battle-records.js';
import { esc } from './ui-format.js';

export function battleReportCard(report) {
  const own = report.ships.filter(s => s.owner === 'player').length, enemy = report.ships.length - own;
  const landings = report.ships.filter(s => s.outcome === 'landed' && s.owner === 'player').length;
  return `<article class="battle-preview-card"><small>TAG ${report.day} · GEFECHTSAUFZEICHNUNG</small><strong>${esc(report.planetName)} · ${battleResult(report)}</strong><p>${own} eigene · ${enemy} gegnerische Schiffe${report.defense.before + report.defense.orbital + report.defense.shieldBefore > 0 ? ' · Orbitalverteidigung' : ''}<br>${battleLosses(report)} eigene Verluste${landings ? ` · ${landings} Landungsschiffe als Garnison eingesetzt` : ''}</p><button class="button secondary" data-action="battle-open" data-id="${esc(report.id)}">Schlacht in 3D ansehen</button></article>`;
}
export function battleReportsView(state) {
  return `<p class="lede">Deine letzten Gefechte mit tatsächlichen Teilnehmern und Ergebnissen. Die 3D-Aufzeichnung zeigt das bereits berechnete Gefecht; dein Reich bleibt während der Ansicht pausiert.</p>${state.battleReports.map(battleReportCard).join('') || '<p class="empty">Noch keine Gefechte aufgezeichnet. Nach einem eigenen Angriff oder der Verteidigung einer Kolonie erscheint die Schlacht hier.</p>'}<details><summary>Ansicht ausprobieren</summary><p class="note">Die separate Probeschlacht steht weiterhin für Darstellungsvergleiche bereit.</p><button class="button secondary" data-action="battle-preview">Probeschlacht öffnen</button></details>`;
}
