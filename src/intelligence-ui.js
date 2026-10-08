import { FACTIONS, IDEOLOGIES, SYSTEMS } from './data.js';
import { SCAN_DAYS, SCAN_COST } from './exploration-data.js';
import { planetView, KNOWLEDGE_SOURCES, knowledgeStale, systemKnown } from './intelligence.js';
import { dateLabel, getPlanet } from './state.js';
import { geologyMarkup } from './surface-ui.js';
import { baseStats } from './strategic.js';
import { fleetTravelDays, departureFuel } from './fleets.js';
import { esc,fmt,opts,button } from './ui-format.js';

const climates={
  Temperiert:'Gemäßigte Klimazonen begünstigen Landwirtschaft und langfristige Besiedlung. Welche Vorkommen unter der Oberfläche liegen, muss vor Ort untersucht werden.',
  Vulkanisch:'Aktive Vulkanregionen prägen diese Welt. Große Wärmereservoirs sind zu erwarten; die unruhige Oberfläche erschwert klassische Landwirtschaft.',
  Ozeanisch:'Weite Meere dominieren die Oberfläche. Landflächen sind begrenzt, während Wasser und eine vergleichsweise milde Atmosphäre die Versorgung begünstigen.',
  Kristallwelt:'Starke kristalline Spektralsignaturen weisen auf eine mineralreiche Kruste hin. Nutzbare Förderstellen lassen sich erst durch eine Oberflächenanalyse lokalisieren.',
  Industriewelt:'Dichte Gesteinsformationen und mineralische Spektren prägen den Planeten. Sein Name ist eine astronomische Klassifikation; aktuelle Industrie und Gesellschaft sind dadurch nicht bekannt.',
  Eiswelt:'Ein gefrorener Planet mit schwacher Sonneneinstrahlung. Geschützte Habitate und alternative Energiequellen sind für eine spätere Kolonie besonders wichtig.'
};
const descriptions={
  nereid:'Nereid liegt an den inneren Handelswegen von Helios. Seine Küstenregionen bilden den Ausgangspunkt deiner interstellaren Expansion.',
  cinder:'Cinders rötliche Kruste strahlt Wärme in den nahen Raum ab. Die Welt liegt nur eine kurze Reise von Nereid entfernt.',
  thalassa:'Thalassas blauer Ozean reflektiert das Licht von Helios. Aus der Ferne sind große zusammenhängende Meeresflächen erkennbar.',
  nox:'Nox zieht am kalten Rand von Umbra seine Bahn. Dunkle Gesteinsrücken unterbrechen die weitläufigen Eisflächen.',
  'silex-0':'Frostfall liegt weit jenseits der etablierten Sprungkorridore. Seine helle Eiskruste kontrastiert mit dem kalten Stern von Silex.',
  'meridian-0':'Caldera umkreist den warmen Stern von Meridian. Thermische Signaturen zeichnen ein Netz aktiver Vulkanregionen.',
  'vestra-2':'Facets kristalline Oberfläche zeigt sich in charakteristischen Spektrallinien. Eine spätere Erschließung benötigt eine zuverlässige Versorgungsroute.'
};
export function ownerLabel(state,p) {
  const view=planetView(state,p);
  if(!view)return 'Nicht kartiert';
  if(view.owner==='player')return state.player.name;
  if(view.owner)return FACTIONS[view.owner].name;
  return view.inhabited===false?'Unbewohnt':view.inhabited===true?'Bewohnt · Reich unbekannt':'Bewohnung unbekannt';
}
export function sourceLine(state,field,domain) {
  if(!field)return '<span class="knowledge-unknown">Unbekannt</span>';
  const qualifier={exact:'Aktuell',observed:'Beobachtet',reported:'Offiziell gemeldet',estimate:'Schätzung'}[field.precision];
  return `<small class="knowledge-source ${knowledgeStale(state,field,domain)?'stale':''}">${KNOWLEDGE_SOURCES[field.source]} · ${dateLabel(field.day)} · ${qualifier}${knowledgeStale(state,field,domain)?' · Veraltet':''}</small>`;
}
export function planetDossier(state,ui,p) {
  const view=planetView(state,p);
  if(!view)return '<p class="lede">Dieses System ist noch nicht kartiert. Ein Erkunder muss zunächst die Flugroute vermessen.</p>';
  if(view.destroyed)return '<div class="alert">Zerstörter Planet · dauerhaftes Trümmerfeld. Eine Besiedlung ist nicht mehr möglich.</div>';
  const k=view.knowledge,own=view.own;
  const rows=[['Bewohnung',k.occupancy,view.inhabited===null?'Unbekannt':view.inhabited?'Bewohnt':'Unbewohnt','occupancy'],
    ['Zugehörigkeit',k.identity,ownerLabel(state,p),'identity'],
    ['Bevölkerung',k.civil,k.civil?fmt(view.population):'Unbekannt','civil'],
    ['Zufriedenheit',k.civil,k.civil?`${fmt(view.happiness)} %`:'Unbekannt','civil'],
    ['Regierung',k.civil,k.civil?.value.ideology?IDEOLOGIES[k.civil.value.ideology].name:'Unbekannt','civil']];
  const probes=state.fleets.filter(f=>f.owner==='player'&&f.type==='probe'&&!f.mission&&!f.route&&getPlanet(state,f.planetId).owner==='player'&&f.planetId!==p.id);
  const probe=probes.find(f=>f.id===ui.analysisFleet)??probes[0];
  const analyzing=state.fleets.filter(f=>f.owner==='player'&&f.mission?.kind==='analyze'&&f.mission.target===p.id);
  const military=own?baseStats(state,p):null;
  return `<div class="eyebrow">PLANETENDOSSIER / ${esc(SYSTEMS.find(s=>s.id===p.system).name)}</div><p class="note">${esc(p.kind)} · Astronomischer Katalog.</p><details class="detail-card dossier-description" data-planet-description="${p.id}"><summary>Beschreibung des Planeten</summary><p class="lede">${esc(descriptions[p.id]??`${p.name} liegt im System ${SYSTEMS.find(s=>s.id===p.system).name}.`)} ${climates[p.kind]??''}</p><p class="note">Klimaaussagen sind aus dem Planetentyp abgeleitet.</p></details><div class="detail-card">${rows.map(([label,field,value,domain])=>`<div class="knowledge-row"><div class="stat-line"><span>${label}</span><strong class="${field?'':'knowledge-unknown'}">${esc(value)}</strong></div>${field?sourceLine(state,field,domain):''}</div>`).join('')}</div>${k.geology&&k.surface?`${sourceLine(state,k.geology,'geology')}${geologyMarkup(view)}`:'<div class="detail-card"><strong>Geologie & Oberfläche unbekannt</strong><p>Genaue Erträge, Erzadern, Wärmequellen und bebaubare Flächen benötigen einen Sondenscan oder einen tatsächlichen Zugang vor Ort.</p></div>'}${k.military?`<div class="detail-card"><strong>${own?'Planetare Verteidigung':'Gefechtsbeobachtung'}</strong>${sourceLine(state,k.military,'military')}<div class="stat-line"><span>Orbitalverteidigung</span><strong>${fmt(view.defense+(military?.orbital??0))}</strong></div><div class="stat-line"><span>Schilde${own?' / Maximum':''}</span><strong>${fmt(view.shield)}${own?` / ${fmt(military.capacity)}`:''}</strong></div><div class="stat-line"><span>Garnison${own?' + Festungen':''}</span><strong>${fmt(view.garrison+(military?.fortification??0))}</strong></div></div>`:view.inhabited!==false?'<p class="note">Militärische Stärke unbekannt. Ein Oberflächenscan liefert keine Garnisons-, Flotten- oder Schilddaten.</p>':''}${!own?`<div class="section-title">Manuelle Oberflächenanalyse</div>${analyzing.map(f=>`<p class="note">${esc(f.name)} · ${f.mission.phase==='scan'?'Analyse läuft':'Anflug'} · ${f.mission.remaining} Tage</p>`).join('')}${!state.tech.includes('planetaryAnalysis')?'<p class="research-condition unmet">Benötigt: Planetare Analyseverfahren und eine Analysesonde.</p>':probes.length?`<select class="select" data-field="analysisFleet" aria-label="Analysesonde auswählen">${opts(probes.map(f=>[f.id,`${f.name} · ${getPlanet(state,f.planetId).name}`]),probe.id)}</select><p class="note">${SCAN_COST.credits} ¢ · ${SCAN_COST.optics} Optik · ${SCAN_COST.energy+departureFuel(state,getPlanet(state,probe.planetId),p)} Energie einschließlich Startenergie.<br>${fleetTravelDays(state,getPlanet(state,probe.planetId),p,[probe])} Flugtage + ${SCAN_DAYS} Scantage. Die Sonde kehrt anschließend zurück.</p>${button(k.geology?'Geologie erneut analysieren':'Oberflächenanalyse starten','analysis-start',`data-id="${probe.id}" data-target="${p.id}"`,analyzing.length>0)}`:'<p class="note">Es fehlt eine freie Analysesonde an einem eigenen Startplaneten.</p>'}`:''}<div class="button-row">${button('Oberfläche öffnen','surface','',!view.surfaceKnown)}${button(view.owner&&view.owner!=='player'?'Diplomatie':'Flotte',view.owner&&view.owner!=='player'?'diplomacy-open':'fleet')}</div>`;
}
export function explorationPanel(state,ui) {
  const system=SYSTEMS.find(s=>s.id===ui.systemId);
  if(!system?.uncharted||systemKnown(state,system.id))return '<p class="lede">Dieses System ist kartiert. Seine bekannten Planeten sind auf der Karte zugänglich.</p>';
  const ships=state.fleets.filter(f=>f.owner==='player'&&f.type==='scout'&&!f.mission&&!f.route&&getPlanet(state,f.planetId).owner==='player');
  const ship=ships.find(f=>f.id===ui.explorationFleet)??ships[0],target=state.planets.find(p=>p.system===system.id),source=ship&&getPlanet(state,ship.planetId);
  const traveling=state.fleets.filter(f=>f.owner==='player'&&f.mission?.kind==='explore'&&getPlanet(state,f.mission.target).system===system.id);
  return `<p class="lede">${esc(system.description)} Die Position des Sterns ist bekannt; Planeten und Flugroute sind unvermessen.</p><div class="detail-card"><strong>Keine Raumtore</strong><p>Der Erstflug führt durch unkartierten Raum. Nach erfolgreicher Übertragung der Navigationsdaten können Kolonie- und Versorgungsschiffe folgen. Reisen bleiben hier länger und energieintensiver.</p></div>${traveling.map(f=>`<p class="note">${esc(f.name)} unterwegs · ${f.mission.remaining} Tage.</p>`).join('')}${ships.length?`<label class="form-label">Erkunder am eigenen Startplaneten</label><select class="select" data-field="explorationFleet">${opts(ships.map(f=>[f.id,`${f.name} · ${getPlanet(state,f.planetId).name}`]),ship.id)}</select><p class="note">${fleetTravelDays(state,source,target,[ship])} Flugtage · ${fmt(departureFuel(state,source,target))} Startenergie.<br>Ein Erkunder erfasst Flugroute, Planetentypen und Bewohnung. Bei fremden Bewohnern hält er Abstand.</p>${button('Erkundungsflug starten','exploration-start',`data-id="${ship.id}" data-system="${system.id}"`,traveling.length>0||source.stock.energy<departureFuel(state,source,target))}`:'<p class="research-condition unmet">Benötigt einen freien Erkunder. Sein Bauplan wird durch Antriebsabstimmung freigeschaltet.</p>'}${button('Raumwerft öffnen','shipyard-open')}`;
}
