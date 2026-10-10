import { FACTIONS } from './data.js';

export const INTERESTS = {
  recovery: { name: 'Versorgung sichern', description: 'Grundversorgung und tragfähiger Haushalt haben Vorrang.' },
  trade: { name: 'Handelsräume öffnen', description: 'Zuverlässige Abnehmer und offene Häfen für die eigene Wirtschaft gewinnen.' },
  science: { name: 'Technischen Vorsprung ausbauen', description: 'Forschung und verlässliche Partner vor territorialem Wettbewerb.' },
  settlement: { name: 'Neue Siedlungsräume erschließen', description: 'Unbewohnte Welten erkunden und die Versorgung neuer Kolonien sichern.' },
  security: { name: 'Heimatsystem absichern', description: 'Versorgte Schutzflotten, Befestigungen und verlässliche Nachbarn aufbauen.' },
  expansion: { name: 'Regionalen Einfluss ausweiten', description: 'Rohstoffzugänge und strategische Welten im eigenen Umfeld beanspruchen.' }
};
const DOCTRINES = { ilyri:'settlement', khepri:'science', aster:'expansion', corona:'security', collective:'trade', vanguard:'security', nexus:'trade', concord:'settlement', houses:'expansion', sanctum:'science', union:'settlement', guild:'trade', clans:'expansion', archive:'science', mandate:'security', commons:'trade', nomads:'settlement', forge:'expansion' };
export const pairKey = (a,b) => [a,b].sort().join(':');
export function relationBetween(state,a,b) {
  if (!a || !b || a===b) return null;
  if (a==='player'||b==='player') return state.relations[a==='player'?b:a]??null;
  return state.galaxy?.relations[pairKey(a,b)]??null;
}
export const atWar = (state,a,b) => Boolean(relationBetween(state,a,b)?.war);
export const canTrade = (state,a,b) => a===b || Boolean(relationBetween(state,a,b)?.trade&&!relationBetween(state,a,b).war&&!relationBetween(state,a,b).embargo);
export const realmAtWar = (state,owner) => Object.keys(FACTIONS).some(id=>atWar(state,owner,id));
export const realmExists = (state,owner) => state.planets.some(p=>p.owner===owner&&!p.destroyed);
export function initializeGalaxy(state) {
  const ids=Object.keys(FACTIONS).filter(id=>id!=='player'),relations={};
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++) {
    const a=ids[i],b=ids[j];
    const shared=state.planets.some(p=>p.owner===a&&state.intelligence?.[b]?.planets[p.id]?.identity?.value===a&&state.planets.some(q=>q.owner===b&&q.system===p.system));
    const competitive=shared&&(DOCTRINES[a]==='expansion'||DOCTRINES[b]==='expansion');
    const score=competitive?-32:8+((i*11+j*7)%35)+(FACTIONS[a].ideology===FACTIONS[b].ideology?8:0);
    relations[pairKey(a,b)]={score,war:false,trade:false,embargo:false,pactUntil:0,defensePact:false,rivalry:false,warSince:0,truceUntil:0,nextAction:state.day+24+(i+j)%18,aidReady:0};
  }
  state.galaxy={relations,strategies:Object.fromEntries(ids.map((id,i)=>[id,{doctrine:DOCTRINES[id],focus:DOCTRINES[id],reason:INTERESTS[DOCTRINES[id]].description,nextPlan:state.day+18+i,warPlan:null,lastCampaign:0}])),news:[],defeat:null};
}
export function endWar(state,a,b) {
  const r=relationBetween(state,a,b);if(!r)return;
  r.war=false;r.score=Math.min(10,Math.max(-15,r.score+20));
  r.warSince=0;r.truceUntil=state.day+180;
  if(a!=='player'&&b!=='player')r.nextAction=state.day+30;
  for(const id of [a,b])if(state.galaxy?.strategies[id]?.warPlan?.enemy===(id===a?b:a))state.galaxy.strategies[id].warPlan=null;
}
export function beginWar(state,a,b) {
  const r=relationBetween(state,a,b);if(!r)return false;
  if(r.war||r.pactUntil>state.day||r.embargo)return false;
  Object.assign(r,{war:true,trade:false,defensePact:false,score:-70});
  if(a==='player'||b==='player')Object.assign(r,{cooperation:false,portAccess:false,researchPact:false});
  else r.nextAction=state.day+30;
  r.warSince=state.day;
  return true;
}
export const publicInterest = (state,id) => state.galaxy?.strategies[id]??{focus:'trade',reason:FACTIONS[id].goal};
export function publicRelations(state,id) {
  return Object.keys(FACTIONS).filter(other=>other!==id).map(other=>({id:other,r:relationBetween(state,id,other)})).filter(({r})=>r&&(r.war||r.trade||r.defensePact||r.rivalry||r.pactUntil>state.day));
}
