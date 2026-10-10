import { FACTIONS, SHIPS, BUILDINGS } from './data.js';
import { policyEffects } from './governance.js';
import { technologyEffects } from './technology.js';
import { buildShip, fleetStrength, fleetUpkeep, orderFleet } from './fleets.js';
import { knownTargets, knowledgeOf } from './intelligence.js';
import { communicationReady, declareMessage } from './communications.js';
import { INTERESTS, relationBetween, realmAtWar, realmExists, beginWar, endWar } from './realm-relations.js';
import { publishNews, reportTreaty, realmName } from './space-news.js';
import { getPlanet } from './state.js';

const owned = (s,id) => s.planets.filter(p=>p.owner===id&&!p.destroyed);
export function realmBalance(state,id) {
  return owned(state,id).reduce((n,p)=>n+(p.lastReport?.income??0)-(p.lastReport?.upkeep??0),0)-fleetUpkeep(state,id)-Object.keys(FACTIONS).filter(other=>relationBetween(state,id,other)?.defensePact).length*2;
}
const military = (s,id) => s.fleets.filter(f=>f.owner===id&&(SHIPS[f.type].strength>0||f.type==='lander'));
const queued = (s,id) => owned(s,id).flatMap(p=>p.queues).filter(q=>SHIPS[q.type].strength>0||q.type==='lander');
export function refreshInterest(state,id) {
  const strategy=state.galaxy.strategies[id],worlds=owned(state,id),f=state.factions[id];
  const foodNet=worlds.reduce((n,p)=>n+(p.net.food??0),0),energyNet=worlds.reduce((n,p)=>n+(p.net.energy??0),0);
  const foodDays=worlds.reduce((n,p)=>n+p.stock.food,0)/Math.max(1,worlds.reduce((n,p)=>n+(p.lastReport?.demandByResource?.food??p.population*.05),0));
  const energyDays=worlds.reduce((n,p)=>n+p.stock.energy,0)/Math.max(1,worlds.reduce((n,p)=>n+(p.lastReport?.demandByResource?.energy??5),0));
  strategy.focus=f.credits<120||foodDays<8&&foodNet<0||energyDays<6&&energyNet<0?'recovery':realmAtWar(state,id)?'security':strategy.doctrine;
  strategy.reason=INTERESTS[strategy.focus].description;
  return strategy;
}
export function offerEvaluation(state,id,type) {
  const r=state.relations[id],s=state.galaxy?.strategies[id];
  if(!r||state.factions[id].credits<(type==='pact'?220:130))return 'Die Regierung muss ihre eigene Versorgung finanzieren.';
  if(s?.warPlan?.enemy==='player'&&r.score<0)return 'Die Regierung hält an ihren regionalen Ansprüchen fest.';
  if(type==='trade'&&r.score<0)return 'Die Regierung sieht derzeit keine verlässliche Grundlage für Handel.';
  if(type==='pact'&&r.score<35)return 'Für einen Sicherheitsvertrag fehlt das Vertrauen.';
  return null;
}
function militaryBuild(state,id,strategy) {
  const worlds=owned(state,id),f=state.factions[id],ships=military(state,id),queue=queued(state,id);
  const war=realmAtWar(state,id),ambitious=strategy.doctrine==='expansion';
  const cap=war?7:ambitious?5:strategy.doctrine==='security'?3:2;
  if(strategy.focus==='recovery'||ships.length+queue.length>=cap||worlds.some(p=>p.queues.length))return;
  const yard=worlds.find(p=>p.buildings.some(b=>b.type==='shipyard'&&!b.remaining&&b.enabled&&b.status==='aktiv'));
  if(!yard)return;
  const landers=ships.filter(f=>f.type==='lander').length+queue.filter(q=>q.type==='lander').length;
  const combat=ships.filter(f=>f.type!=='lander').length+queue.filter(q=>q.type!=='lander').length;
  let type=(war||ambitious)&&combat>=3&&landers<(war?2:1)&&f.tech.includes('fortification')?'lander':f.tech.includes('coordination')&&war&&combat>=3?'cruiser':f.tech.includes('lasers')?'destroyer':'corvette';
  const def=SHIPS[type],upkeep=(def.upkeep??1)*policyEffects(state,id).fleetUpkeep*technologyEffects(state,id).fleetUpkeep;
  const pending=queue.reduce((n,q)=>n+(SHIPS[q.type].upkeep??1),0)*policyEffects(state,id).fleetUpkeep*technologyEffects(state,id).fleetUpkeep;
  // Leave enough treasury for civilian development and pay for future maintenance too.
  if(f.credits<def.cost.credits+220||realmBalance(state,id)<upkeep+pending+3)return;
  buildShip(state,yard,type,id);
}
function sharedSystem(state,id,view) { return owned(state,id).some(p=>p.system===view.system); }
export function knownWarTarget(state,id,enemy) {
  return knownTargets(state,id).filter(p=>p.owner===enemy&&!p.destroyed).sort((a,b)=>Number(sharedSystem(state,id,b))-Number(sharedSystem(state,id,a))||(a.defense??60)-(b.defense??60)||a.id.localeCompare(b.id))[0]??null;
}
function estimateDefense(state,id,view) {
  const m=knowledgeOf(state,getPlanet(state,view.id),id).military;
  if(!m)return 84; // Unknown military data is treated conservatively, never read from the live target.
  const age=state.day-m.day;
  return m.value.defense+(m.value.orbital??20)+(m.value.fleetStrength??24)+m.value.shield+Math.min(36,age*1.5);
}
function readyArmy(state,id) {
  return military(state,id).filter(f=>!f.mission&&!f.route&&f.hp>=75&&f.supply>=75&&getPlanet(state,f.planetId)?.owner===id);
}
function strongestGroup(state,id) {
  const groups=new Map();for(const f of readyArmy(state,id)){if(!groups.has(f.planetId))groups.set(f.planetId,[]);groups.get(f.planetId).push(f);}
  return [...groups.values()].sort((a,b)=>b.reduce((n,f)=>n+fleetStrength(state,f),0)-a.reduce((n,f)=>n+fleetStrength(state,f),0))[0]??[];
}
function enoughArmy(state,id,view) {
  const group=strongestGroup(state,id),power=group.reduce((n,f)=>n+fleetStrength(state,f),0);
  return power>=Math.max(30,estimateDefense(state,id,view)*1.15)&&group.some(f=>f.type==='lander');
}
function attackKnownEnemy(state,id,enemy) {
  const view=knownWarTarget(state,id,enemy);if(!view)return;
  const home=owned(state,id).find(p=>p.buildings.some(b=>b.type==='shipyard'&&b.enabled&&!b.remaining));if(!home)return;
  for(const f of readyArmy(state,id).filter(f=>f.planetId!==home.id))orderFleet(state,[f.id],home.id,'move',{owner:id});
  const group=strongestGroup(state,id);
  if(!enoughArmy(state,id,view)||state.day-state.galaxy.strategies[id].lastCampaign<45)return;
  const issue=orderFleet(state,group.map(f=>f.id),view.id,'attack',{owner:id});
  if(!issue){state.galaxy.strategies[id].lastCampaign=state.day;publishNews(state,'movement',{actors:[id],system:view.system,title:`Flottenbewegungen im System ${view.system}`,body:`Ein bewaffneter Verband von ${realmName(state,id)} ist auf öffentlicher Flugroute beobachtet worden. Stärke und Auftrag sind unbekannt.`});}
}
function treaty(state,a,b,r,type) {
  const cost={trade:50,pact:100,alliance:120}[type];
  if(state.factions[a].credits<cost+160||state.factions[b].credits<cost+160)return false;
  state.factions[a].credits-=cost;state.factions[b].credits-=cost;
  if(type==='trade')r.trade=true;
  else if(type==='pact')r.pactUntil=state.day+180;
  else {r.defensePact=true;r.aidReady=state.day+30;}
  r.score=Math.min(100,r.score+4);reportTreaty(state,a,b,type);return true;
}
const forum = (s,id) => s.factions[id].tech.includes('advancedDiplomacy')&&owned(s,id).some(p=>p.buildings.some(b=>BUILDINGS[b.type].service==='diplomacy'&&!b.remaining&&b.enabled&&b.status==='aktiv'));
const tradeCount = (s,id) => Object.keys(FACTIONS).filter(other=>relationBetween(s,id,other)?.trade).length;
const tradeCap = (s,id) => s.galaxy.strategies[id].doctrine==='trade'?7:4;
const allianceCount = (s,id) => Object.keys(FACTIONS).filter(other=>relationBetween(s,id,other)?.defensePact).length;
function aidAlliance(state,a,b,r) {
  if(!r.defensePact||r.war||r.aidReady>state.day)return;
  for(const [supplier,receiver] of [[a,b],[b,a]])if(realmAtWar(state,receiver)&&!realmAtWar(state,supplier)) {
    const from=owned(state,supplier).find(p=>p.stock.alloy>=24&&p.stock.weapons>=8),to=owned(state,receiver)[0];
    if(from&&to){from.stock.alloy-=12;from.stock.weapons-=4;to.stock.alloy+=12;to.stock.weapons+=4;to.defense+=12;r.aidReady=state.day+30;return;}
  }
}
function bilateral(state,a,b,r) {
  if(!realmExists(state,a)||!realmExists(state,b)){r.war=false;r.trade=false;r.defensePact=false;r.pactUntil=0;r.warSince=0;return;}
  if(r.pactUntil&&r.pactUntil<=state.day)r.pactUntil=0;
  aidAlliance(state,a,b,r);
  if(state.day<r.nextAction)return;r.nextAction=state.day+30;
  const sa=state.galaxy.strategies[a],sb=state.galaxy.strategies[b];
  if(r.war) {
    if(state.day-r.warSince>=120&&(sa.focus==='recovery'||sb.focus==='recovery'||state.day-r.warSince>=300)) {endWar(state,a,b);reportTreaty(state,a,b,'peace');}
    return;
  }
  if(!state.factions[a].tech.includes('communications')||!state.factions[b].tech.includes('communications'))return;
  const neighbor=knownWarTarget(state,a,b),contest=neighbor&&sharedSystem(state,a,neighbor)&&(sa.doctrine==='expansion'||sb.doctrine==='expansion');
  if(contest&&!r.trade&&!r.defensePact&&r.pactUntil<=state.day&&r.truceUntil<=state.day) {
    r.score=Math.max(-65,r.score-4);
    if(r.score<=-30&&!r.rivalry){r.rivalry=true;reportTreaty(state,a,b,'rivalry');}
  }else if(!r.rivalry||r.trade)r.score=Math.min(100,r.score+2);
  if(r.score>=0&&!r.trade&&!r.embargo&&tradeCount(state,a)<tradeCap(state,a)&&tradeCount(state,b)<tradeCap(state,b))treaty(state,a,b,r,'trade');
  else if(r.trade&&r.score>=50&&!r.defensePact&&allianceCount(state,a)<2&&allianceCount(state,b)<2&&forum(state,a)&&forum(state,b)&&realmBalance(state,a)>4&&realmBalance(state,b)>4)treaty(state,a,b,r,'alliance');
  else if(r.trade&&r.score>=35&&!r.pactUntil&&(sa.doctrine==='security'||sb.doctrine==='security'||sa.doctrine==='science'||sb.doctrine==='science'))treaty(state,a,b,r,'pact');
}
function planConflict(state,id,strategy) {
  const active=Object.keys(FACTIONS).filter(other=>relationBetween(state,id,other)?.war);
  if(active.length){strategy.warPlan=null;for(const enemy of active)attackKnownEnemy(state,id,enemy);return;}
  const plan=strategy.warPlan;
  if(plan) {
    const r=relationBetween(state,id,plan.enemy),view=knownWarTarget(state,id,plan.enemy);
    if(!r||r.score>-35||r.pactUntil>state.day||r.trade||r.defensePact||!view||strategy.focus==='recovery'){strategy.warPlan=null;return;}
    if(state.day>=plan.declareAt&&enoughArmy(state,id,view)) {
      if(beginWar(state,id,plan.enemy)){reportTreaty(state,id,plan.enemy,'war');if(plan.enemy==='player')declareMessage(state,id,'Kriegserklärung','Unsere Regierung erklärt den Krieg. Die zuvor angekündigten regionalen Ansprüche bestehen fort.',true);}
      strategy.warPlan=null;
    }
    return;
  }
  if(state.day<180||strategy.focus==='recovery'||!['expansion','security'].includes(strategy.doctrine)||!communicationReady(state,id)||realmBalance(state,id)<3)return;
  const candidate=Object.keys(FACTIONS).filter(other=>other!==id&&realmExists(state,other)).map(enemy=>({enemy,r:relationBetween(state,id,enemy),view:knownWarTarget(state,id,enemy)})).filter(({r,view})=>r&&view&&r.score<=-35&&!r.trade&&!r.defensePact&&r.pactUntil<=state.day&&(r.truceUntil??0)<=state.day&&sharedSystem(state,id,view)).sort((a,b)=>a.r.score-b.r.score)[0];
  if(!candidate||!enoughArmy(state,id,candidate.view))return;
  strategy.warPlan={enemy:candidate.enemy,target:candidate.view.id,declareAt:state.day+36};
  if(candidate.enemy==='player')declareMessage(state,id,'Regionale Ansprüche','Unsere Regierung beansprucht eine Neuordnung des gemeinsamen Heimatsystems. Ohne diplomatische Annäherung bereiten wir einen Konflikt vor. Ein Handelsabkommen, ein Pakt oder verbesserte Beziehungen können die Eskalation verhindern.',true);
}
export function tickRealmAI(state) {
  if(!state.galaxy)return;
  for(const [id,strategy] of Object.entries(state.galaxy.strategies)) {
    if(!realmExists(state,id)){strategy.warPlan=null;continue;}
    if(state.day<strategy.nextPlan)continue;strategy.nextPlan=state.day+18;
    refreshInterest(state,id);militaryBuild(state,id,strategy);planConflict(state,id,strategy);
  }
  for(const [key,r] of Object.entries(state.galaxy.relations)){const [a,b]=key.split(':');bilateral(state,a,b,r);}
}
