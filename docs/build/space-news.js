import { FACTIONS, SYSTEMS } from './data.js';
import { systemKnown, recordContact } from './intelligence.js';

export const NEWS_KINDS=['war','peace','trade','pact','alliance','rivalry','colony','conquest','destruction','movement'];
export function newsReady(state,owner='player') {
  const tech=owner==='player'?state.tech:state.factions[owner]?.tech;
  return Boolean(tech?.includes('newsNetwork')&&state.planets.some(p=>p.owner===owner&&!p.destroyed&&p.buildings.some(b=>b.type==='commCenter'&&b.enabled&&!b.remaining&&b.status==='aktiv')));
}
// The audience is fixed at broadcast time. Discovery never reveals a system's private history.
export function publishNews(state,kind,{actors=[],system=null,planet=null,title,body}) {
  if(!state.galaxy||!NEWS_KINDS.includes(kind))return;
  const audience=Object.keys(FACTIONS).filter(id=>newsReady(state,id)&&(!system||systemKnown(state,system,id)));
  if(!audience.length)return;
  const recent=state.galaxy.news.find(n=>n.kind===kind&&n.system===system&&n.actors.join(':')===actors.join(':')&&state.day-n.day<12);
  if(recent)return;
  const n={id:`news${state.nextId++}`,day:state.day,kind,actors,system,planet,title,body,audience,read:false};
  state.galaxy.news.unshift(n);state.galaxy.news.length=Math.min(120,state.galaxy.news.length);
  if(planet&&['colony','conquest','destruction'].includes(kind)) {
    const p=state.planets.find(p=>p.id===planet);
    if(p)for(const viewer of audience)recordContact(state,viewer,p,'news');
  }
}
export const newsFor = (state,viewer='player') => (viewer==='player'?state.tech:state.factions[viewer]?.tech)?.includes('newsNetwork')?state.galaxy.news.filter(n=>n.audience.includes(viewer)):[];
export const unreadNews = state => newsFor(state).some(n=>!n.read);
export function readNews(state) { for(const n of newsFor(state))n.read=true; }
export const realmName = (state,id) => id==='player'?state.player.name:FACTIONS[id].name;
export const systemName = id => SYSTEMS.find(s=>s.id===id)?.name??'Interstellar';
export function reportTreaty(state,a,b,kind) {
  const labels={war:'Krieg erklärt',peace:'Waffenstillstand vereinbart',trade:'Handelsabkommen geschlossen',pact:'Nichtangriffspakt geschlossen',alliance:'Schutzbündnis geschlossen',rivalry:'Rivalität erklärt'};
  publishNews(state,kind,{actors:[a,b],title:`${realmName(state,a)} · ${realmName(state,b)}`,body:labels[kind]+'. Quelle: öffentliche Regierungserklärungen.'});
}
