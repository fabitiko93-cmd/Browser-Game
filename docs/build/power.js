import { FACTIONS, RESOURCES, RESOURCE_KEYS, SHIPS } from './data.js';
import { getPlanet, uid, log } from './state.js';
import { systemsOf } from './world.js';
import { relationBetween, realmExists, realmAtWar, endWar } from './realm-relations.js';
import { knowledgeOf, knownTargets, recordContact, chartSystem } from './intelligence.js';
import { departureFuel, fleetTravelDays } from './fleets.js';
import { technologyEffects } from './technology.js';
import { declareMessage, communicationReady, createOffer } from './communications.js';
import { realmName, reportTreaty, publishNews } from './space-news.js';

const owned=(s,id)=>s.planets.filter(p=>p.owner===id&&!p.destroyed);
const wallet=(s,id)=>id==='player'?s:s.factions[id];
const techs=(s,id)=>id==='player'?s.tech:s.factions[id].tech;
export const blocOf=(s,id)=>s.galaxy?.blocs?.find(b=>b.leader===id||b.members.includes(id))??null;
export const blocPartners=(s,a,b)=>a!==b&&Boolean(blocOf(s,a)&&blocOf(s,a)===blocOf(s,b));
const potential=p=>({Industriewelt:1.25,Vulkanisch:1.2,Kristallwelt:1.2,Ozeanisch:1.1,Eiswelt:1}[p.kind]??1);
export function initializePower(state) {
 const g=state.galaxy;g.blocs=[];g.blocCooldowns={};g.wars=[];
 g.hegemony={planetWeights:Object.fromEntries(state.planets.map(p=>[p.id,potential(p)])),leader:null,streak:0,winner:null,continued:false};
 for(const a of Object.keys(FACTIONS))for(const b of Object.keys(FACTIONS).filter(b=>b>a))if(relationBetween(state,a,b)?.war)recordWar(state,a,b,null,relationBetween(state,a,b).warSince??state.day);
}
export function blocCosts(state,id) {
 const b=blocOf(state,id);if(!b)return {income:0,cost:0};
 if(b.leader!==id)return {income:0,cost:2};
 return {income:b.members.filter(m=>wallet(state,m).credits>=2).length*2,cost:b.members.length*4};
}
export function runBlocBudget(state) {
 const result=Object.fromEntries(Object.keys(FACTIONS).map(id=>[id,{income:0,cost:0}]));
 for(const b of state.galaxy.blocs){result[b.leader].cost+=b.members.length*4;
  for(const m of b.members){if(wallet(state,m).credits>=2){result[m].cost+=2;result[b.leader].income+=2;b.terms[m].paidDays++;}}
 }
 for(const[id,r]of Object.entries(result))wallet(state,id).credits+=r.income-r.cost;
 return result;
}
export const blocScience=(state,id)=>blocOf(state,id)?.members.length?1.06:1;
export function createBloc(state,leader='player') {
 if(blocOf(state,leader))return 'Dieses Reich gehört bereits zu einem Machtblock.';
 if((state.galaxy.blocCooldowns[leader]??0)>state.day)return 'Nach einem Austritt ist die Blockgründung für 180 Tage gesperrt.';
 if(owned(state,leader).length<2||!techs(state,leader).includes('advancedDiplomacy')||!communicationReady(state,leader)||!owned(state,leader).some(p=>p.buildings.some(b=>b.type==='embassy'&&b.enabled&&!b.remaining&&b.status==='aktiv')))return 'Benötigt zwei Kolonien, Vertragsdiplomatie, eine Kommunikationszentrale und ein aktives Diplomatisches Forum.';
 if(wallet(state,leader).credits<250)return 'Eine Blockgründung kostet 250 Credits.';
 wallet(state,leader).credits-=250;state.galaxy.blocs.push({id:uid(state,'bloc'),leader,name:`${realmName(state,leader)} · Machtbund`,created:state.day,members:[],terms:{},autoSupply:false});
 if(leader==='player')log(state,'Machtbund gegründet. Mitglieder erhalten Hafenrechte und +6 % Forschung; deine Führung kostet 4 Credits je Mitglied und Tag.','politics');
 return null;
}
export function joinIssue(state,leader,member) {
 const b=blocOf(state,leader),r=relationBetween(state,leader,member);
 if(!b||b.leader!==leader||leader===member||!realmExists(state,leader)||!realmExists(state,member))return 'Es fehlt eine unabhängige Blockführung.';
 if(blocOf(state,member))return 'Dieses Reich ist bereits an einen Machtblock gebunden.';
 if((state.galaxy.blocCooldowns[member]??0)>state.day)return 'Nach einem Austritt gilt eine Sperrfrist von 180 Tagen.';
 if(!r?.trade||r.war||r.embargo||r.score<55||!communicationReady(state,member))return 'Benötigt eine Kommunikationszentrale, Handel, Frieden und Beziehungen von mindestens 55.';
 if(b.members.some(id=>relationBetween(state,id,member)?.war||relationBetween(state,id,member)?.embargo))return 'Ein Konflikt mit einem Mitglied verhindert den Beitritt.';
 if(b.members.length>=8)return 'Dieser Machtblock hat bereits acht Mitglieder.';
 if(wallet(state,member).credits<280||wallet(state,leader).credits<300)return 'Die laufenden Verpflichtungen sind derzeit nicht finanzierbar.';
 return null;
}
export function joinBloc(state,leader,member) {
 const issue=joinIssue(state,leader,member);if(issue)return issue;
 const b=blocOf(state,leader);wallet(state,member).credits-=100;b.members.push(member);
 b.terms[member]={joined:state.day,periodStart:state.day,paidDays:0,misses:0,request:null};
 // Membership explicitly discloses settlement addresses, not civil or military analyses.
 for(const a of [b.leader,...b.members])for(const c of [b.leader,...b.members].filter(c=>c!==a)){
  const r=relationBetween(state,a,c);r.trade=true;r.war=false;r.embargo=false;
  for(const p of owned(state,c)){chartSystem(state,a,p.system);recordContact(state,a,p,'contact');}
 }
 if(leader==='player'||member==='player')log(state,`${realmName(state,member)} tritt ${b.name} bei. Beitrag: 2 Credits / Tag; Versorgungsersuchen werden verbindlich.`, 'politics');
 publishNews(state,'alliance',{actors:[leader,member],title:`${realmName(state,member)} tritt einem Machtbund bei`,body:`Verbindliche Mitgliedschaft in ${b.name}. Quelle: öffentliche Regierungserklärung.`});return null;
}
export function leaveBloc(state,member,reason='Mitgliedschaft beendet.') {
 const b=blocOf(state,member);if(!b)return 'Dieses Reich gehört keinem Machtblock an.';
 const affected=b.leader===member?[b.leader,...b.members]:[member];
 for(const id of affected)state.galaxy.blocCooldowns[id]=state.day+180;
 if(b.leader===member)state.galaxy.blocs=state.galaxy.blocs.filter(q=>q!==b);
 else {b.members=b.members.filter(id=>id!==member);delete b.terms[member];}
 if(affected.includes('player')||b.leader==='player')log(state,`${realmName(state,member)}: ${reason}`,'politics');
 if(member!=='player'&&b.leader==='player')declareMessage(state,member,'Machtbund verlassen',reason,true);
 return null;
}
export function recordBlocDelivery(state,from,to,key,amount) {
 const b=blocOf(state,from);if(!b||b.leader!==from)return;
 const request=b.terms[to]?.request;if(request?.resource===key&&request.until>=state.day)request.delivered+=Math.min(amount,Math.max(0,request.amount-request.delivered));
}
export function orderBlocSupply(state,member,fleetId=null) {
 const b=blocOf(state,member),r=b?.terms[member]?.request;if(!b||!r||r.delivered>=r.amount)return 'Es besteht kein offenes Versorgungsersuchen.';
 const committed=state.fleets.filter(f=>f.owner===b.leader&&f.mission?.kind==='bloc-aid'&&f.mission.buyer===member&&f.mission.target===r.planet&&f.mission.cargo.resource===r.resource&&state.day+f.mission.remaining<=r.until).reduce((n,f)=>n+f.mission.cargo.amount,0);
 if(r.delivered+committed>=r.amount)return 'Die zugesagte Versorgung ist bereits unterwegs.';
 const free=state.fleets.filter(f=>f.owner===b.leader&&SHIPS[f.type].cargo&&!f.mission&&!f.route&&getPlanet(state,f.planetId)?.owner===b.leader);
 const f=free.find(f=>f.id===fleetId)??free[0],source=f&&getPlanet(state,f.planetId),target=getPlanet(state,r.planet);
 if(!f||!target||target.owner!==member||target.destroyed)return 'Es fehlt ein freier Frachter am eigenen Hafen oder der Empfänger ist verloren.';
 const amount=Math.min(r.amount-r.delivered-committed,Math.floor(SHIPS[f.type].cargo*technologyEffects(state,b.leader).cargoCapacity)-RESOURCE_KEYS.reduce((n,k)=>n+(f.cargo[k]??0),0)),fuel=departureFuel(state,source,target,b.leader)*2;
 if(amount<1||source.stock[r.resource]<amount+(r.resource==='energy'?fuel:0)||source.stock.energy<fuel)return 'Am Starthafen fehlen Fracht, freier Frachtraum oder Energie für Hin- und Rückflug.';
 source.stock[r.resource]-=amount;source.stock.energy-=fuel;
 const days=fleetTravelDays(state,source,target,[f]);f.mission={kind:'bloc-aid',group:uid(state,'bloc-aid'),source:source.id,target:target.id,buyer:member,remaining:days,total:days,cargo:{resource:r.resource,amount}};
 return null;
}
export function arriveBlocSupply(state,f,m,target) {
 if(target.owner===m.buyer&&blocPartners(state,f.owner,m.buyer)&&!target.destroyed){target.stock[m.cargo.resource]+=m.cargo.amount;recordBlocDelivery(state,f.owner,m.buyer,m.cargo.resource,m.cargo.amount);}
 else f.cargo[m.cargo.resource]+=m.cargo.amount;
 const home=owned(state,f.owner).find(p=>p.id===m.source)??owned(state,f.owner)[0];if(!home||home.id===target.id)return;
 const days=fleetTravelDays(state,target,home,[f]);f.mission={kind:'move',group:uid(state,'aid-return'),source:target.id,target:home.id,remaining:days,total:days,cargo:null};
}
function memberNeed(state,id) {
 for(const p of owned(state,id))for(const resource of ['food','energy'])if((p.net[resource]??0)<0&&p.stock[resource]<-(p.net[resource]??0)*12)return {planet:p.id,resource,amount:resource==='food'?48:40};
 if(realmAtWar(state,id)){const p=owned(state,id).find(p=>p.stock.weapons<16);if(p)return {planet:p.id,resource:'weapons',amount:16};}
 return null;
}
export function tickBlocs(state) {
 for(const w of state.galaxy.wars.filter(w=>w.ended===null))if(!realmExists(state,w.a)||!realmExists(state,w.b))endWar(state,w.a,w.b);
 for(const b of [...state.galaxy.blocs]){
  if(!realmExists(state,b.leader)){leaveBloc(state,b.leader,'Die Blockführung hat ihre letzte Kolonie verloren.');continue;}
  for(const member of [...b.members]){
   const t=b.terms[member],r=relationBetween(state,b.leader,member);
   if(!realmExists(state,member)||r.war||r.embargo||!r.trade){leaveBloc(state,member,'Die Grundlagen der Mitgliedschaft bestehen nicht mehr.');continue;}
   if(state.day>=t.periodStart+30){if(t.paidDays<24||wallet(state,b.leader).credits<0)t.misses++;else t.misses=Math.max(0,t.misses-1);t.paidDays=0;t.periodStart=state.day;}
   if(t.request&&t.request.until<=state.day){if(t.request.delivered<t.request.amount){t.misses++;r.score=Math.max(-100,r.score-8);}else t.misses=Math.max(0,t.misses-1);t.request=null;}
   if(t.misses>=3){leaveBloc(state,member,'Wiederholte Beitrags- oder Versorgungsbrüche haben das Vertrauen zerstört.');continue;}
   if(!t.request&&state.day%60===Object.keys(FACTIONS).indexOf(member)%60){const need=memberNeed(state,member);if(need){t.request={...need,delivered:0,until:state.day+60};if(b.leader==='player')declareMessage(state,member,'Versorgungsersuchen im Machtbund',`${realmName(state,member)} bittet um ${need.amount} ${RESOURCES[need.resource].name} bis Tag ${state.day+60}. Sende die Lieferung über Flotte → Macht → Machtbund. Wiederholte Vertragsbrüche können zum Austritt führen.`,true);}}
   if(t.request&&(b.leader!=='player'||b.autoSupply&&techs(state,'player').includes('smartLogistics')))orderBlocSupply(state,member);
  }
 }
 if(state.day%60!==0)return;
 // Blocs grow from actual communication, trade and consent. The player receives an offer.
 for(const id of Object.keys(state.factions)){
  if(!realmExists(state,id))continue;
  if(!blocOf(state,id)&&owned(state,id).length>=2&&wallet(state,id).credits>650)createBloc(state,id);
  const b=blocOf(state,id);if(!b||b.leader!==id)continue;
  const candidate=Object.keys(FACTIONS).filter(m=>m!==id&&!joinIssue(state,id,m)).sort((a,c)=>relationBetween(state,id,c).score-relationBetween(state,id,a).score)[0];
  if(!candidate)continue;
  if(candidate==='player'){if(communicationReady(state)&&!(state.communications.cooldowns[id]>state.day)&&!createOffer(state,id,'bloc',true))state.communications.cooldowns[id]=state.day+180;}
  else joinBloc(state,id,candidate);
 }
}
export function hegemonyProgress(state,id) {
 const h=state.galaxy.hegemony,b=blocOf(state,id),leader=b?.leader??id,members=b?[b.leader,...b.members]:[id],weights=h.planetWeights;
 const systems=systemsOf(state).map(s=>{const planets=state.planets.filter(p=>p.system===s.id),weight=planets.reduce((n,p)=>n+weights[p.id],0),held=planets.filter(p=>!p.destroyed&&members.includes(p.owner)&&p.population>=40).reduce((n,p)=>n+weights[p.id],0);return {id:s.id,weight,held,controlled:weight>0&&held>=weight*.55};});
 const total=systems.reduce((n,s)=>n+s.weight,0),held=systems.filter(s=>s.controlled).reduce((n,s)=>n+s.weight,0);
 const worlds=owned(state,leader),healthy=wallet(state,leader).credits>=0&&worlds.length>0&&worlds.every(p=>p.happiness>=30&&p.stock.food>=p.population*.065);
 return {leader,systems,total,held,share:total?held/total:0,healthy,eligible:total>0&&held>=total*2/3&&healthy};
}
export function tickHegemony(state) {
 const h=state.galaxy.hegemony;if(h.winner)return;
 const leaders=Object.keys(FACTIONS).filter(id=>!blocOf(state,id)||blocOf(state,id).leader===id);
 const qualified=leaders.map(id=>hegemonyProgress(state,id)).filter(p=>p.eligible).sort((a,b)=>b.share-a.share)[0];
 if(!qualified){h.leader=null;h.streak=0;return;}
 h.streak=h.leader===qualified.leader?h.streak+1:1;h.leader=qualified.leader;
 if(h.streak>=120){h.winner={owner:h.leader,day:state.day};h.continued=false;log(state,`${realmName(state,h.leader)} hat die Vorherrschaft über den Sektor errungen.`,h.leader==='player'?'success':'war');}
}
export const activeWar=(state,a,b)=>state.galaxy.wars.find(w=>w.ended===null&&[w.a,w.b].includes(a)&&[w.a,w.b].includes(b));
export function recordWar(state,a,b,target=null,started=state.day) {
 if(activeWar(state,a,b))return;
 if(target&&!knownTargets(state,a).some(p=>p.id===target&&p.owner===b))target=null;
 state.galaxy.wars.push({id:uid(state,'war'),a,b,attacker:a,target,started,ended:null,initial:{[a]:owned(state,a).map(p=>p.id),[b]:owned(state,b).map(p=>p.id)}});
 while(state.galaxy.wars.length>100){const i=state.galaxy.wars.findIndex(w=>w.ended!==null);if(i<0)break;state.galaxy.wars.splice(i,1);}
}
export function closeWar(state,a,b) {const w=activeWar(state,a,b);if(w)w.ended=state.day;}
export function peaceTerms(state,proposer,other) {
 const r=relationBetween(state,proposer,other),w=activeWar(state,proposer,other);if(!r?.war)return {accepted:false,reason:'Es besteht kein Krieg.'};
 const age=state.day-(w?.started??r.warSince),ours=w?.initial[proposer]??[],theirs=w?.initial[other]??[];
 const lost=ours.filter(id=>getPlanet(state,id)?.owner===other).length,won=theirs.filter(id=>getPlanet(state,id)?.owner===proposer).length;
 const claimant=w?.attacker,claim=w?.target&&getPlanet(state,w.target),resolved=claim&&(claim.destroyed||claim.owner===claimant);
 if(age<24&&!resolved)return {accepted:false,reason:'Die Gegenseite verfolgt noch ihr Kriegsziel. Frühe Zahlung allein erzwingt keinen Frieden.'};
 if(!resolved&&age<90&&!lost&&!won)return {accepted:false,reason:'Ohne entschiedene Gebietsansprüche ist ein gegenseitiger Waffenstillstand erst nach 90 Kriegstagen tragfähig.'};
 const payment=lost>won?150+(lost-won)*100:0,cost=payment+(lost>won?0:60);
 if(wallet(state,proposer).credits<cost)return {accepted:false,reason:`Für die Friedensbedingungen fehlen ${cost} Credits.`,cost,payment};
 return {accepted:true,cost,payment,reason:lost>won?`Besetzte Gebiete bleiben bei der Gegenseite; ${payment} Credits Reparationen.`:won>lost?'Die eroberten Gebiete bleiben unter deiner Kontrolle. 60 Credits für die Friedensverwaltung.':'Beide Seiten stellen die Kämpfe ein; bestehende Gebietsstände gelten. 60 Credits Friedensverwaltung.'};
}
export function settlePeace(state,a,b) {
 const terms=peaceTerms(state,a,b);if(!terms.accepted)return terms.reason;
 wallet(state,a).credits-=terms.cost;wallet(state,b).credits+=terms.payment;endWar(state,a,b);reportTreaty(state,a,b,'peace');return null;
}
