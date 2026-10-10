import { offerEvaluation } from './realm-ai.js';
import { unreadNews, readNews } from './space-news.js';
import { FACTIONS } from './data.js';
import { uid, log } from './state.js';
import { diplomaticAction } from './politics.js';
import { recordContact } from './intelligence.js';

export const OFFER_DAYS = 30;
export const OFFER_TERMS = { trade: { cost: 50, title: 'Handelsabkommen' }, pact: { cost: 100, title: 'Nichtangriffspakt', duration: 180 } };
export const centers = (state, owner = 'player') => state.planets.filter(p => p.owner === owner && !p.destroyed).flatMap(p => p.buildings.filter(b => b.type === 'commCenter' && !b.remaining && b.enabled).map(b => ({ p, b })));
export const communicationReady = (state, owner = 'player') => centers(state,owner).some(({b})=>b.status==='aktiv');
export const openRequests = state => state.communications.messages.filter(m => m.to==='player' && m.status==='open' && m.expires>state.day);
export const unreadCorrespondence = state => state.communications.messages.some(m=>!m.read&&(m.to==='player'&&m.type==='declaration'||m.from==='player'&&m.status!=='open'));
export function inboxSignal(state) {
  const pending=openRequests(state);
  return { count:pending.length, urgent:pending.some(m=>m.expires-state.day<=7), unread:unreadCorrespondence(state)||unreadNews(state) };
}
function append(state, message) {
  const c=state.communications;
  const m={id:uid(state,'message'),created:state.day,read:false,resolved:null,expires:null,...message};
  c.messages.unshift(m);
  // Keep every active offer; only the oldest resolved correspondence is pruned.
  while(c.messages.length>120){const i=c.messages.findLastIndex(m=>m.status!=='open');if(i<0)break;c.messages.splice(i,1);}
  if(m.to==='player'&&centers(state).length) log(state,m.type==='declaration'?'Neue Erklärung eingegangen.':'Neue Anfrage eingegangen.','communication');
  return m;
}
export function declareMessage(state, faction, title, body, incoming = false) {
  return append(state,{from:incoming?faction:'player',to:incoming?'player':faction,type:'declaration',status:'information',title,body,read:!incoming});
}
export function offerIssue(state, faction, type) {
  const r=state.relations[faction],terms=OFFER_TERMS[type];
  if(!r||!terms)return 'Unbekanntes Angebot.';
  if(r.war||r.embargo)return 'Dieses Angebot benötigt Frieden und offene diplomatische Beziehungen.';
  if(type==='trade'&&r.trade||type==='pact'&&r.pactUntil>state.day)return 'Dieses Abkommen besteht bereits.';
  if(r.score<(type==='pact'?35:0))return `Benötigt Beziehungen von mindestens ${type==='pact'?35:0}.`;
  if(!state.planets.some(p=>p.owner===faction&&!p.destroyed))return 'Der Vertragspartner besitzt keine Kolonien mehr.';
  return null;
}
export function createOffer(state, faction, type, incoming = true) {
  const issue=offerIssue(state,faction,type);if(issue)return issue;
  const from=incoming?faction:'player',to=incoming?'player':faction;
  if(state.communications.messages.filter(m=>m.status==='open').length>=12)return 'Es laufen bereits zu viele Verhandlungen.';
  if(state.communications.messages.some(m=>m.status==='open'&&[m.from,m.to].includes(faction)))return 'Mit diesem Reich läuft bereits eine Verhandlung.';
  const terms=OFFER_TERMS[type];
  append(state,{from,to,type,read:!incoming,status:'open',expires:state.day+OFFER_DAYS,title:terms.title,
    body:type==='trade'?'Gegenseitiger Marktzugang für Frachter. Preise und Abnahme richten sich nach den örtlichen Märkten.':'Beide Reiche verzichten für 180 Tage auf Kriegserklärungen. Eine Kündigung bleibt möglich und belastet die Beziehungen.'});
  return null;
}
export function sendOffer(state, faction, type) {
  if(!communicationReady(state))return 'Eine fertiggestellte, versorgte Kommunikationszentrale wird benötigt.';
  if(state.communications.cooldowns[faction]>state.day)return 'Dieses Reich kann erst später erneut angefragt werden.';
  if(state.credits<OFFER_TERMS[type]?.cost)return 'Das Budget reicht für dieses Abkommen nicht aus.';
  const issue=createOffer(state,faction,type,false);if(issue)return issue;
  state.communications.cooldowns[faction]=state.day+60;
  return null;
}
function finish(state,m,status,reason='') { m.status=status;m.resolved=state.day;m.reason=reason;m.read=true; }
function agree(state,m) {
  const faction=m.from==='player'?m.to:m.from,issue=offerIssue(state,faction,m.type);
  if(issue)return issue;
  const terms=OFFER_TERMS[m.type],foreign=state.factions[faction];
  if(foreign.credits<terms.cost)return 'Der Vertragspartner kann das Abkommen derzeit nicht finanzieren.';
  if(state.credits<terms.cost)return `Für dieses Abkommen fehlen ${terms.cost} Credits.`;
  const result=diplomaticAction(state,faction,m.type);if(result)return result;
  foreign.credits-=terms.cost;
  const capital=state.planets.find(p=>p.owner===faction&&!p.destroyed);
  const home=state.planets.find(p=>p.owner==='player'&&!p.destroyed);
  if(capital)recordContact(state,'player',capital);if(home)recordContact(state,faction,home);
  finish(state,m,'accepted');return null;
}
export function answerMessage(state,id,choice) {
  if(!communicationReady(state))return 'Die Kommunikationszentrale ist nicht versorgt.';
  const m=state.communications.messages.find(m=>m.id===id);
  if(!m||m.status!=='open'||m.to!=='player')return 'Diese Anfrage ist nicht mehr offen.';
  if(m.expires<=state.day){finish(state,m,'expired');return 'Die Antwortfrist ist abgelaufen.';}
  if(!['accept','reject'].includes(choice))return 'Unbekannte Antwort.';
  if(choice==='accept')return agree(state,m);
  finish(state,m,'rejected');return null;
}
export function withdrawMessage(state,id) {
  const m=state.communications.messages.find(m=>m.id===id&&m.from==='player'&&m.status==='open');
  if(!m)return 'Dieses Angebot kann nicht zurückgezogen werden.';
  finish(state,m,'withdrawn');return null;
}
export function readInbox(state,mode='all') { if(mode==='news'){readNews(state);return;} for(const m of state.communications.messages)if(mode==='all'||mode==='archive'&&m.status!=='open'||mode==='open'&&m.status==='open')m.read=true; }
export function tickCommunications(state) {
  const c=state.communications;
  for(const m of c.messages.filter(m=>m.status==='open')) {
    if(m.expires<=state.day){finish(state,m,'expired','Unbeantwortet zurückgegeben.');continue;}
    const faction=m.from==='player'?m.to:m.from,issue=offerIssue(state,faction,m.type);
    if(issue){finish(state,m,'withdrawn',issue);continue;}
    if(m.from==='player'&&state.day>=m.created+3) {
      // The other government evaluates its own budget and the shared diplomatic terms.
      const result=offerEvaluation(state,faction,m.type)??agree(state,m);
      if(result)finish(state,m,'rejected',result);
      m.read=false;
      if(centers(state).length)log(state,'Antwort auf dein Angebot eingegangen.','communication');
    }
  }
  // A working receiving channel controls delivery, not the AI's knowledge of player stocks.
  if(!communicationReady(state)||state.day<c.nextOffer)return;
  const ids=Object.keys(state.relations);
  for(let offset=0;offset<ids.length;offset++) {
    const index=(c.cursor+offset)%ids.length,id=ids[index],r=state.relations[id];
    const type=!r.trade?'trade':r.pactUntil<=state.day&&r.score>=35?'pact':null;
    if(!type||offerEvaluation(state,id,type)||c.cooldowns[id]>state.day||!communicationReady(state,id)||state.factions[id].credits<OFFER_TERMS[type].cost)continue;
    if(createOffer(state,id,type,true))continue;
    c.cooldowns[id]=state.day+120;c.nextOffer=state.day+48;c.cursor=(index+1)%ids.length;break;
  }
}
