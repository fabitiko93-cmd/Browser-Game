import { technologyEffectMarkup, effectValueMarkup } from './effect-ui.js';
import { RESEARCH_BRANCHES, TECHNOLOGIES } from './technology-data.js';
import { researchBlock, technologyEffects } from './technology.js';
import { researchDays } from './research.js';
const pct = n => Math.round((n - 1) * 100);
const ordered = (a, b) => TECHNOLOGIES[a].tier - TECHNOLOGIES[b].tier || TECHNOLOGIES[a].cost - TECHNOLOGIES[b].cost || a.localeCompare(b);

// The display groups exclusive siblings without changing the simulation's prerequisites.
export function researchLayout(branch) {
  const ids = Object.keys(TECHNOLOGIES).filter(id => TECHNOLOGIES[id].branch === branch).sort(ordered);
  const units = [], byId = new Map();
  for (const id of ids) {
    if (byId.has(id)) continue;
    const t = TECHNOLOGIES[id];
    const alternative = ids.find(other => (t.excludes ?? []).includes(other) && TECHNOLOGIES[other].requires.join() === t.requires.join());
    const unit = { ids: alternative ? [id, alternative].sort(ordered) : [id], parent: null, children: [] };
    units.push(unit); for (const member of unit.ids) byId.set(member, unit);
  }
  for (const unit of units) {
    const t = TECHNOLOGIES[unit.ids[0]];
    const localAny = (t.requiresAny ?? []).filter(id => byId.has(id));
    const candidates = localAny.length ? localAny : t.requires.filter(id => byId.has(id));
    const parentId = candidates.sort(ordered).at(-1);
    unit.parent = byId.get(parentId) ?? null;
    if (unit.parent) unit.parent.children.push(unit);
  }
  const depth = unit => 1 + Math.max(0, ...unit.children.map(depth));
  for (const unit of units) {
    unit.children.sort((a, b) => depth(b) - depth(a) || b.ids.length - a.ids.length || ordered(a.ids[0], b.ids[0]));
  }
  return units.filter(unit => !unit.parent).sort((a, b) => ordered(a.ids[0], b.ids[0]));
}

function techCard(state, id, main, parent) {
  const t = TECHNOLOGIES[id], done = state.tech.includes(id), running = state.research?.id === id;
  const blocked = researchBlock(state, id);
  const excluded = (t.excludes ?? []).some(other => state.tech.includes(other));
  const status = done ? 'Erforscht' : running ? 'Wird erforscht' : excluded ? 'Andere Spezialisierung gewählt' : blocked ? 'Voraussetzung fehlt' : 'Forschbar';
  const prerequisites = [...t.requires, ...(t.requiresAny ?? [])];
  const extra = t.requires.filter(required => !parent?.ids.includes(required));
  const missingExtra = extra.filter(required => !state.tech.includes(required));
  const days = researchDays(state, id);
  const amount = state.science >= t.cost ? 'enough' : 'short';
  const cost = `<span class="tech-cost-amount ${amount}" aria-label="${t.cost} Forschungspunkte, ${amount === 'enough' ? 'ausreichend vorhanden' : 'zu wenig vorhanden'}">${t.cost}</span> Forschung`;
  const conditions = excluded ? 'Andere Richtung gewählt' : missingExtra.length ? `Benötigt: ${missingExtra.map(required => TECHNOLOGIES[required].name).join(' · ')}` : '';
  return `<details data-tech-id="${id}" class="tech-node ${main ? 'tech-main' : 'tech-upgrade'} ${done ? 'researched' : running ? 'research-running' : excluded ? 'excluded' : blocked ? 'locked' : 'available'}"><summary><span class="tech-status ${done ? 'complete' : running ? 'running' : !blocked ? 'ready' : ''}" role="img" aria-label="${status}">${done ? '✓' : running ? '◌' : '○'}</span><strong class="tech-name">${t.name}</strong><span class="tech-meta">${done ? '<span class="tech-completion">ERFORSCHT</span>' : running ? `Noch ${state.research.remaining} Tage` : `${cost} · ${days} Tage`}</span>${conditions && !done ? `<span class="tech-condition">${conditions}</span>` : ''}</summary><div class="tech-info">${t.focus ? `<p class="tech-focus">Spezialisierung: ${t.focus}</p>` : ''}<p>${t.description ?? technologyEffectMarkup(t.effects)}${t.unlock ? ` · Schaltet frei: ${t.unlock}` : ''}</p>${t.description && Object.keys(t.effects).length ? `<p>${technologyEffectMarkup(t.effects)}</p>` : ''}${prerequisites.length ? `<div class="tech-requires">${t.requiresAny ? 'Benötigt eine der Spezialisierungen sowie die zusätzlichen Grundlagen:' : 'Benötigte Grundlagen:'}<div>${prerequisites.map(required => `<button class="tech-link ${state.tech.includes(required) ? 'done' : ''}" data-action="research-focus" data-id="${required}">${state.tech.includes(required) ? '✓ ' : ''}${TECHNOLOGIES[required].name}</button>`).join('')}</div></div>` : '<p>Grundlagentechnologie · keine Voraussetzung</p>'}${t.excludes ? `<p class="tech-condition">Nur eine Richtung: ${t.excludes.map(other => TECHNOLOGIES[other].name).join(' · ')} wird ausgeschlossen.</p>` : ''}${blocked && !done ? `<p>${blocked}</p>` : ''}${!done && !running ? `<button class="button secondary" data-action="research-start" data-tech="${id}" ${blocked || state.research || state.science < t.cost || state.credits<0 ? 'disabled' : ''}>Erforschen</button>` : ''}</div></details>`;
}

function unitCard(state, unit, main) {
  if (unit.ids.length === 1) return techCard(state, unit.ids[0], main, unit.parent);
  return `<div class="tech-fork" aria-hidden="true"></div><div class="tech-choices" role="group" aria-label="Eine Spezialisierung wählen">${techCard(state, unit.ids[0], false, unit.parent)}<span class="tech-or">oder</span>${techCard(state, unit.ids[1], false, unit.parent)}</div>`;
}
function sidePath(state, unit) {
  return `${unitCard(state, unit, false)}${unit.children.length === 1 ? `<div class="${unit.ids.length > 1 ? 'tech-merge' : 'tech-arrow'}" aria-hidden="true"></div>${sidePath(state, unit.children[0])}` : unit.children.length ? `<div class="tech-side-forks">${unit.children.map(child => `<div class="tech-side-path">${sidePath(state, child)}</div>`).join('')}</div>` : ''}`;
}
function mainPath(state, root) {
  let html = '', unit = root, afterChoice = false;
  while (unit) {
    const pair = unit.ids.length > 1;
    html += `<div class="${pair ? 'tech-choice-step' : afterChoice ? 'tech-merged-step' : 'tech-main-step'}">${unitCard(state, unit, !pair && !afterChoice)}</div>`;
    const [next, ...sides] = unit.children;
    if (sides.length) html += `<div class="tech-side-forks">${sides.map(child => `<div class="tech-side-path">${sidePath(state, child)}</div>`).join('')}</div>`;
    if (next) html += pair ? '<div class="tech-merge" aria-hidden="true"></div>' : next.ids.length === 2 ? '' : '<div class="tech-main-gap" aria-hidden="true"></div>';
    afterChoice = pair; unit = next;
  }
  return `<div class="research-tree">${html}</div>`;
}
export function researchPanel(state, ui) {
  const branch = Object.hasOwn(RESEARCH_BRANCHES, ui.researchBranch) ? ui.researchBranch : 'energy';
  const active = state.research, effects = technologyEffects(state);
  return `<div class="research-overview"><span>${state.tech.length} / ${Object.keys(TECHNOLOGIES).length} erforscht</span><span>Laborertrag ${effectValueMarkup('science', effects.science, `+${pct(effects.science)} %`)}</span></div>${active ? `<div class="detail-card research-active"><div class="eyebrow">AKTUELLES PROJEKT</div><strong>${TECHNOLOGIES[active.id].name}</strong><p>${state.credits<0?'Finanzierung ausgesetzt · ':''}Noch ${active.remaining} von ${active.total} Tagen</p><div class="progress"><span style="width:${(1 - active.remaining / active.total) * 100}%"></span></div></div>` : '<p class="note">Kein laufendes Forschungsprojekt.</p>'}<div class="research-branches">${Object.entries(RESEARCH_BRANCHES).map(([id, b]) => `<button data-action="research-branch" data-id="${id}" class="${id === branch ? 'active' : ''}" style="--branch-color:${b.color}">${b.name}<small>${state.tech.filter(t => TECHNOLOGIES[t]?.branch === id).length} / ${Object.values(TECHNOLOGIES).filter(t => t.branch === id).length}</small></button>`).join('')}</div><div class="section-title">${RESEARCH_BRANCHES[branch].name}<span>${RESEARCH_BRANCHES[branch].description}</span></div>${researchLayout(branch).map(root => mainPath(state, root)).join('')}<p class="note">Tippe eine Technologie für Wirkung und Voraussetzungen an. Technologien wirken dauerhaft; laufende Projekte behalten ihre Restzeit.</p>`;
}
