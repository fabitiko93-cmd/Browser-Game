import { BUILDINGS, TECHNOLOGIES } from './data.js';
import { canAfford } from './state.js';
export const BUILD_CATEGORIES = {
 population:{name:'Bevölkerung',icon:'H',text:'Wohnraum für deine Kolonien',buildings:['habitat']},
 supply:{name:'Versorgung',icon:'E',text:'Nahrung und Energie',buildings:['farm','solar','reactor']},
 resources:{name:'Rohstoffe',icon:'M',text:'Erz und Kristalle fördern',buildings:['mine','crystal']},
 industry:{name:'Industrie',icon:'S',text:'Legierungen, Optik und Waffen',buildings:['foundry','optics','laser']},
 science:{name:'Forschung',icon:'R',text:'Wissenschaftliche Infrastruktur',buildings:['lab']},
 space:{name:'Raumfahrt',icon:'W',text:'Schiffe und Transport',buildings:['shipyard']},
 defense:{name:'Verteidigung',icon:'D',text:'Festungen, Abfangnetze und Schilde',buildings:['bunker','orbitalGun','interceptor','shield','worldShield','stellarAegis']},
 strategic:{name:'Strategische Anlagen',icon:'X',text:'Fernraketen und Megawaffen',buildings:['missileSilo','planetLance','stellarForge']}
};
export function requirementLine(state, def) { return def.requiredTech ? `<small class="research-condition ${state.tech.includes(def.requiredTech)?'met':'unmet'}">${state.tech.includes(def.requiredTech)?'✓ Erforscht':'🔒 Benötigt'}: ${TECHNOLOGIES[def.requiredTech].name}</small>` : ''; }
export function categoryPanel(state, ui, p, costLine) {
 const category=BUILD_CATEGORIES[ui.buildCategory];
 if(!category)return `<p class="lede">Wähle einen Bereich für den Ausbau deiner Kolonie.</p><div class="building-grid">${Object.entries(BUILD_CATEGORIES).map(([id,c])=>`<button class="building-card category-card" data-action="build-category" data-category="${id}"><span class="building-symbol">${c.icon}</span><strong>${c.name}</strong><small>${c.text}</small><small>${c.buildings.length} Bautypen</small></button>`).join('')}</div>`;
 return `<button class="text-button" data-action="build-categories">← Alle Baubereiche</button><div class="section-title">${category.name}</div><p class="lede">${category.text}. Baumaterial kommt aus dem lokalen Vorrat.</p><div class="building-grid">${category.buildings.map(id=>{const d=BUILDINGS[id],ready=canAfford(state,p,d.cost)&&(!d.requiredTech||state.tech.includes(d.requiredTech));return `<button class="building-card ${ready?'available':'unavailable'}" data-action="build-detail" data-type="${id}"><span class="building-symbol" style="color:${d.color}">${d.glyph}</span><strong>${d.name}</strong><small>${d.days} Bautage · ${d.upkeep} ¢ / Tag</small>${costLine(state,p,d.cost)}${requirementLine(state,d)}</button>`;}).join('')}</div>`;
}
