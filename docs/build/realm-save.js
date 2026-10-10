import { FACTIONS, SYSTEMS } from './data.js';
import { INTERESTS, pairKey } from './realm-relations.js';
import { NEWS_KINDS } from './space-news.js';

export function validateGalaxy(state,planetIds) {
  const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
  const finite=(v,min=0,max=1e12)=>Number.isFinite(v)&&v>=min&&v<=max;
  const day=(v,max=state.day)=>Number.isInteger(v)&&finite(v,0,max);
  const text=(v,max)=>typeof v==='string'&&v.length>0&&v.length<=max;
  const ids=Object.keys(FACTIONS).filter(id=>id!=='player'),g=state.galaxy;
  const fail=()=>{throw new Error('Ungültige Reichsinteressen, Beziehungen oder Nachrichten.');};
  if(!object(g)||!object(g.relations)||Object.keys(g.relations).length!==ids.length*(ids.length-1)/2||!object(g.strategies)||Object.keys(g.strategies).length!==ids.length||!Array.isArray(g.news)||g.news.length>120)fail();
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++) {
    const r=g.relations[pairKey(ids[i],ids[j])];
    if(!object(r)||!finite(r.score,-100,100)||['war','trade','embargo','defensePact','rivalry'].some(k=>typeof r[k]!=='boolean')||!day(r.pactUntil,state.day+180)||!day(r.truceUntil,state.day+180)||!day(r.warSince)||!day(r.nextAction,state.day+60)||!day(r.aidReady,state.day+30)||r.war&&(r.trade||r.defensePact||r.pactUntil>state.day)||r.embargo&&(r.trade||r.defensePact)||r.defensePact&&!r.trade)fail();
  }
  for(const id of ids) {
    const s=g.strategies[id],p=s?.warPlan;
    if(!object(s)||!INTERESTS[s.focus]||!INTERESTS[s.doctrine]||s.doctrine==='recovery'||!text(s.reason,300)||!day(s.nextPlan,state.day+36)||!day(s.lastCampaign)||p!==null&&(!object(p)||!FACTIONS[p.enemy]||p.enemy===id||!planetIds.has(p.target)||!day(p.declareAt,state.day+36)||state.intelligence[id]?.planets[p.target]?.identity?.value!==p.enemy))fail();
  }
  const seen=new Set();
  for(const n of g.news) {
    if(!object(n)||!text(n.id,64)||seen.has(n.id)||!day(n.day)||!NEWS_KINDS.includes(n.kind)||!text(n.title,160)||!text(n.body,800)||typeof n.read!=='boolean'||!Array.isArray(n.actors)||n.actors.length>2||new Set(n.actors).size!==n.actors.length||n.actors.some(id=>!FACTIONS[id])||n.system!==null&&!SYSTEMS.some(s=>s.id===n.system)||n.planet!==null&&(!planetIds.has(n.planet)||state.planets.find(p=>p.id===n.planet).system!==n.system)||!Array.isArray(n.audience)||!n.audience.length||new Set(n.audience).size!==n.audience.length||n.audience.some(id=>!FACTIONS[id]||n.system&&!state.intelligence[id].chartedSystems.includes(n.system)))fail();
    seen.add(n.id);
  }
  if(g.defeat!==null&&(!object(g.defeat)||!day(g.defeat.day)||!FACTIONS[g.defeat.conqueror]||g.defeat.conqueror==='player'||state.planets.some(p=>p.owner==='player')))fail();
  if(!state.planets.some(p=>p.owner==='player')&&!g.defeat)fail();
}
