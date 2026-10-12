import { warMarkup } from './power-ui.js';
import { blocPartners } from './power.js';
import { INTERESTS, publicInterest, publicRelations } from './realm-relations.js';
import { realmName } from './space-news.js';
import { knownTargets } from './intelligence.js';
import { sourceLine } from './intelligence-ui.js';
import { effectValueMarkup } from './effect-ui.js';
import { researchNetwork, researchAgreementGain } from './diplomacy.js';
import { FACTIONS, IDEOLOGIES, RESOURCES } from './data.js';
import { serviceCount } from './infrastructure.js';
import { esc,fmt } from './ui-format.js';
const btn=(label,id,kind,disabled=false)=>`<button class="button secondary" data-action="diplomacy" data-faction="${id}" data-kind="${kind}" ${disabled?'disabled':''}>${label}</button>`;
const percent = value => (value*100).toFixed(2).replace('.',',');
function agreementResearchMarkup(state,id,field) {
 const r=state.relations[id];
 if(!r.trade||r.war||r.embargo)return 'Forschungsbonus benötigt Handel und Frieden ohne Sanktionen';
 const gain=researchAgreementGain(state,id,field);
 return `${r[field]?'Beitrag zum Forschungsnetz':'Bei Abschluss zusätzlich'}: ${effectValueMarkup('science',1+gain,`+${percent(gain)}`)} Prozentpunkte`;
}
export function diplomacyPanel(state,ui) {
 const network=researchNetwork(state);
 const researchOverview=`<div class="detail-card"><strong>Forschungsnetz</strong><p>${effectValueMarkup('science',network.factor,`+${percent(network.bonus)} %`)} Forschung aus eigenen Anlagen · ${network.partners} Partner</p><p class="note">Größere Netze teilen zunehmend bereits bekanntes Wissen. Weitere Abkommen helfen weiter; der Gesamtbonus bleibt unter 40 %. Der Beitrag zeigt den Unterschied mit und ohne dieses Abkommen. Forschungsabkommen wirken beidseitig.</p></div>`;
 const active=ui.diplomacyFaction??'ilyri';
 const advanced=state.tech.includes('advancedDiplomacy')&&state.planets.some(p=>p.owner==='player'&&serviceCount(p,'diplomacy'));
 return `${researchOverview}<p class="lede">Die Reiche verfolgen eigene wirtschaftliche Ziele. Eingehaltene Lieferverträge schaffen Vertrauen. Wähle ein Reich, um seine Märkte, Interessen und Abkommen zu verwalten.</p>${Object.entries(state.relations).map(([id,r])=>{
 const planets=knownTargets(state).filter(p=>p.owner===id&&!p.destroyed),exists=planets.length>0,pact=r.pactUntil>state.day,civil=planets.find(p=>p.knowledge.civil)?.knowledge.civil;

 return `<div class="detail-card faction-card"><button class="faction-focus" data-action="diplomacy-focus" data-faction="${id}"><strong style="color:${FACTIONS[id].color}">${FACTIONS[id].name}</strong><span class="status-badge">${!exists?'Keine bekannten Kolonien':r.war?'Krieg':r.embargo?'Sanktionen':r.cooperation?'Partner':r.trade?'Handel':'Frieden'}</span></button><p>${FACTIONS[id].species} · ${civil?.value.ideology?IDEOLOGIES[civil.value.ideology].name:'Regierung unbekannt'} · Beziehungen ${fmt(r.score)}</p><div ${active!==id?'hidden':''}><p><strong>${esc(INTERESTS[publicInterest(state,id).focus].name)}</strong><br>${esc(publicInterest(state,id).reason)}</p>${relationshipMarkup(state,id)}${civil?sourceLine(state,civil,'civil'):'<p class="note">Bevölkerung, Regierung, Zufriedenheit und militärische Stärke sind noch nicht bekannt.</p>'}<p class="note">Offiziell genanntes Handelsinteresse: ${RESOURCES[FACTIONS[id].priority].name}. Genaue Bestände und Produktionsketten sind nicht öffentlich.</p><p class="note">Handel ab 0 · Nichtangriffspakt ab 35 · Partnerschaft ab 50</p>${r.trade?'<p>Handel offen: Frachter können Waren verkaufen und Rückfracht einkaufen.</p>':''}${r.cooperation?`<p>Partnerschaft: ${agreementResearchMarkup(state,id,'cooperation')} · ${effectValueMarkup('trade',1.12,'+12 %')} Exporterlös.<br>Im Krieg alle 60 Tage: +12 Legierungen, +4 Waffen, +4 Verteidigung, sofern der Partner Vorräte hat.</p>`:`<p class="note">${agreementResearchMarkup(state,id,'cooperation')}. Partnerschaften verbessern auch Exporterlöse und leisten Hilfe im Krieg.</p>`}${pact?`<p>Nichtangriffspakt: noch ${r.pactUntil-state.day} Tage. Vor einer Kriegserklärung kündigen.</p>`:''}${r.embargo?'<p>Sanktionen: Produktion dieses Reichs −15 %; dein Haushalt −1,5 ¢ / Tag. Handel und Partnerschaft sind gesperrt.</p>':''}
 ${r.war?warMarkup(state,id):`${btn(r.envoyReady>state.day?`Gesandtschaft in ${r.envoyReady-state.day} Tagen`:'Gesandtschaft · 60 ¢',id,'envoy',state.credits<60||r.envoyReady>state.day)}${!r.trade?btn('Handelsabkommen · 50 ¢',id,'trade',!exists||r.embargo||r.score<0||state.credits<50):`<button class="button primary" data-action="trade-open" data-faction="${id}">Handelsroute einrichten</button>`}${btn(pact?'Pakt kündigen · −15 Beziehungen':'Nichtangriffspakt · 100 ¢',id,pact?'cancel-pact':'pact',!pact&&(!exists||r.embargo||r.score<35||state.credits<100))}${btn(r.cooperation?'Partnerschaft beenden':'Partnerschaft · 180 ¢',id,r.cooperation?'cancel-cooperation':'cooperation',!r.cooperation&&(!exists||!r.trade||r.embargo||r.score<50||state.credits<180))}`}
 <div class="section-title">Erweiterte Abkommen</div>${!advanced?'<p class="research-condition unmet">Benötigt: Interstellare Vertragsdiplomatie und aktives Diplomatisches Forum.</p>':''}${btn(r.portAccess?'Hafennutzung beenden':'Hafenabkommen · 80 ¢',id,r.portAccess?'cancel-ports':'ports',!r.portAccess&&(!advanced||!r.trade||r.score<15||state.credits<80))}<p class="note">Versorgung und Reparatur an fremden Häfen gegen Warenpreise und Servicekosten. Ausgaben erscheinen im laufenden Haushalt.</p>${btn(r.researchPact?'Forschungsaustausch beenden':'Forschungsaustausch · 160 ¢',id,r.researchPact?'cancel-research-pact':'research-pact',!r.researchPact&&(!advanced||!r.trade||r.score<35||state.credits<160))}<p class="note">${agreementResearchMarkup(state,id,'researchPact')}.</p>${btn(r.defensePact?'Beistandsabkommen beenden':'Beistandsabkommen · 120 ¢',id,r.defensePact?'cancel-defense-pact':'defense-pact',!r.defensePact&&(!advanced||!r.trade||r.score<50||state.credits<120))}<p class="note">2 ¢ Unterhalt / Tag. Bei eigenen Kriegen alle 30 Tage: +12 Legierungen, +4 Waffen und +12 Verteidigung, wenn der Partner Material besitzt.</p>
 ${ui.warConfirm===id?`<label class="form-label">Begrenzter planetarer Anspruch</label><select class="select" data-field="warTarget">${planets.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select><p class="note">Eroberung dieses Ziels ermöglicht frühe Verhandlungen; Frieden erkennt tatsächliche Gebietsstände an.</p>`:''}${(r.truceUntil??0)>state.day?`<p class="note">Waffenstillstand: noch ${r.truceUntil-state.day} Tage.</p>`:''}${btn(r.embargo?'Sanktionen aufheben':'Sanktionen · 1,5 ¢ / Tag',id,r.embargo?'lift-embargo':'embargo',!exists&&!r.embargo)}${!r.war?`<button class="button danger" data-action="war-confirm" data-faction="${id}" ${pact||(r.truceUntil??0)>state.day||blocPartners(state,'player',id)||!exists?'disabled':''}>${ui.warConfirm===id?'Kriegserklärung bestätigen':'Krieg erklären'}</button>`:''}</div></div>`;
 }).join('')}`;
}

function relationshipMarkup(state,id) {
 const groups=[['Kriege',r=>r.war],['Schutzbündnisse',r=>r.defensePact&&!r.war],['Handelspartner',r=>r.trade&&!r.war&&!r.defensePact],['Rivalen',r=>r.rivalry&&!r.war]];
 return groups.map(([label,predicate])=>{const names=publicRelations(state,id).filter(({r})=>predicate(r)).map(({id:other})=>esc(realmName(state,other)));return names.length?`<p class="note"><strong>${label}:</strong> ${names.join(' · ')}</p>`:'';}).join('')||'<p class="note">Noch keine öffentlich vereinbarten Beziehungen zu anderen Reichen.</p>';
}
