import { circuitPanel } from './circuit-ui.js';
import { marketPanel, contractsPanel } from './market-ui.js';
import { SHIPS, RESOURCES, RESOURCE_KEYS, FACTIONS } from './data.js';
import { getPlanet } from './state.js';
import { cargoCapacity, departureFuel, fleetTravelDays } from './fleets.js';
import { exportPrice, quoteSale } from './trade.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>v.toLocaleString('de-DE',{maximumFractionDigits:1});
const opts=(items,selected)=>items.map(([id,name])=>`<option value="${id}" ${id===selected?'selected':''}>${esc(name)}</option>`).join('');
export function routeSelection(state,ui,p) {
 const ships=state.fleets.filter(f=>f.owner==='player'&&f.planetId===p.id&&SHIPS[f.type].cargo&&!f.mission&&!f.route);
 const targets=state.planets.filter(q=>q.id!==p.id&&!q.destroyed&&(q.owner==='player'||state.relations[q.owner]?.trade&&!state.relations[q.owner]?.war&&!state.relations[q.owner]?.embargo));
 const f=ships.find(f=>f.id===ui.routeFleet)??ships[0],target=targets.find(q=>q.id===ui.routeTarget)??targets[0];
 const capacity=f?cargoCapacity(state,f.type):80,amount=Math.max(1,Math.min(Number(ui.amount)||40,capacity)),resource=RESOURCE_KEYS.includes(ui.cargo)?ui.cargo:'ore';
 return {ships,targets,f,target,capacity,amount,resource};
}
function simpleTradePanel(state,ui,p) {
 const {ships,targets,f,target,capacity,amount,resource}=routeSelection(state,ui,p);
 const fuel=target?departureFuel(state,p,target):0,reserve=Math.max(0,Number(ui.tradeReserve)||0),available=p.stock[resource]-reserve-(resource==='energy'?fuel:0);
 const sale=target&&target.owner!=='player'?quoteSale(state,target,resource,amount):null;
 const valid=Boolean(f&&target&&p.stock.energy>=fuel&&available>=amount),selling=target&&target.owner!=='player';
 const intro=`<p class="lede">Abkommen öffnen fremde Märkte. Du transportierst die Ware selbst; erst bei Ankunft wird sie verkauft. Eigene Kolonien erhalten die Ware direkt.</p><div class="trade-steps"><span>1 Abkommen</span><span>2 Start & Frachter</span><span>3 Ware & Ziel</span><span>4 Lieferung</span></div>`;
 const form=ships.length&&targets.length?`<label class="form-label">Frachter auf ${esc(p.name)}</label><select class="select" data-field="routeFleet">${opts(ships.map(s=>[s.id,`${s.name} · ${cargoCapacity(state,s.type)} Fracht`]),f.id)}</select><label class="form-label">Zielplanet</label><select class="select" data-field="routeTarget">${opts(targets.map(q=>[q.id,`${q.name} · ${q.owner==='player'?'Eigene Kolonie':FACTIONS[q.owner].name}`]),target.id)}</select><label class="form-label">Ware aus ${esc(p.name)}</label><select class="select" data-field="cargo">${opts(RESOURCE_KEYS.map(k=>[k,`${RESOURCES[k].name} · ${num(p.stock[k])} im Vorrat`]),resource)}</select><label class="form-label">Frachtmenge</label><div class="range-row"><input type="range" min="1" max="${capacity}" value="${amount}" data-field="amount" aria-label="Frachtmenge"><output>${amount}</output></div><div class="detail-card trade-quote"><div class="eyebrow">VORSCHAU / EINE LIEFERUNG</div><p>${esc(p.name)} → ${esc(target.name)} · ${fleetTravelDays(state,p,target,[f])} Flugtage</p><div class="stat-line"><span>Lokale Ladung</span><strong>${amount} ${RESOURCES[resource].short}</strong></div><div class="stat-line"><span>Startenergie</span><strong>${num(fuel)} ENE</strong></div><div class="stat-line"><span>${selling?'Erwarteter Erlös':'Lieferung bei Ankunft'}</span><strong>${selling?`${num(sale.total)} ¢`:`${amount} ${RESOURCES[resource].short}`}</strong></div><p class="note">${selling?`Preis: ${num(sale.price)} ¢ je Einheit. Politik, Forschung, örtliche Vorräte und Partnerschaft beeinflussen den Preis. Heute absetzbar: ${num(sale.amount)} von ${amount} Einheiten; angezeigt ist der heutige Preis, abgerechnet wird bei Ankunft. Bei verlorenem Handelszugang kehrt die Fracht zurück.`:'Eigene Lieferungen erzeugen keine Credits.'} Flottenunterhalt ist bereits im laufenden Haushalt enthalten; für Rückflüge wird ebenfalls Energie gebraucht.</p>${!valid?'<div class="alert">Für diese Ladung fehlt Ware oder Startenergie.</div>':''}</div><label class="form-label">Geschützter Mindestbestand am Start</label><input class="text-input" type="number" min="0" data-field="tradeReserve" value="${reserve}"><label class="check-label"><input type="checkbox" data-field="repeat" ${ui.repeat?'checked':''}>Route mit Rückflug wiederholen</label><button class="button primary" data-action="route-start" ${!valid?'disabled':''}>${selling?'Waren zum Verkauf senden':'Kolonie beliefern'}</button>`:`<div class="alert">${!ships.length?'Am Startplaneten fehlt ein freier Frachter. Baue einen oder verlege ihn hierher.':'Kein erreichbarer Handelspartner. Schließe ein Handelsabkommen oder gründe eine zweite Kolonie.'}</div><div class="button-row"><button class="button secondary" data-action="shipyard-open">Raumwerft</button><button class="button secondary" data-action="diplomacy-open">Abkommen ansehen</button></div>`;
 const transit=state.fleets.filter(f=>f.owner==='player'&&(f.route||f.mission?.kind==='transport'||f.mission?.kind==='return-cargo'));
 return intro+form+`<div class="section-title">Lieferungen und Routen</div>${transit.map(f=>{const m=f.mission,r=f.route,source=getPlanet(state,r?.source??m.source),target=getPlanet(state,r?.target??m.target);return `<div class="detail-card"><strong>${esc(f.name)}</strong><p>${esc(source.name)} → ${esc(target.name)}<br>${m?`${m.kind==='transport'?'Lieferung':m.kind==='return-cargo'?'Fracht kehrt zurück':m.kind==='circuit'?`Reise zu ${esc(getPlanet(state,m.target).name)}`:'Rückflug'} · ${m.remaining} Tage`:esc(f.pauseReason||'Wartet auf Ware, Energie oder Versorgung')}${r?.type==='circuit'?` · ${r.stops.length} Stopps`:r?' · Wiederholung aktiv':''}</p>${m?.cargo?`<p class="note">${m.cargo.amount} ${RESOURCES[m.cargo.resource].name} an Bord</p>`:''}${r?`<button class="button secondary" data-action="route-stop" data-id="${f.id}">Wiederholung beenden</button>`:''}</div>`;}).join('')||'<p class="note">Noch keine laufenden Lieferungen.</p>'}`;
}

export function tradePanel(state,ui,p){
 const mode=ui.routeMode??'simple';
 const tabs=`<div class="subnav">${[['simple','Transport'],['circuit','Kreislauf'],['markets','Märkte'],['contracts','Verträge']].map(([id,label])=>`<button data-action="subtab" data-field="routeMode" data-value="${id}" class="${mode===id?'active':''}">${label}</button>`).join('')}</div>`;
 if(mode==='markets')return tabs+marketPanel(state,ui);
 if(mode==='contracts')return tabs+contractsPanel(state,ui);
 if(mode==='circuit')return tabs+circuitPanel(state,ui,p,routeSelection(state,ui,p));
 return tabs+simpleTradePanel(state,ui,p);
}
