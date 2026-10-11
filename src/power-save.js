import { FACTIONS, RESOURCE_KEYS } from './data.js';

const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const finite=(v,min=0,max=1e12)=>Number.isFinite(v)&&v>=min&&v<=max;
const text=(v,max)=>typeof v==='string'&&v.length>0&&v.length<=max;
export function validateTradeBoards(state) {
 for(const p of state.planets){const b=p.tradeBoard;
  if(!object(b)||typeof b.exports!=='boolean'||!finite(b.budget,0,10000)||!finite(b.escrow,0,b.budget)||!Number.isInteger(b.periodStart)||!finite(b.periodStart,0,state.day)||!object(b.orders)||Object.keys(b.orders).some(k=>!RESOURCE_KEYS.includes(k)||!object(b.orders[k])||!finite(b.orders[k].target,1,10000)||!finite(b.orders[k].maxPrice,.01,100)))throw new Error('Ungültige öffentliche Handelsaufträge.');
 }
}
export function validatePower(state,planetIds) {
 const g=state.galaxy,seen=new Set(),seenIds=new Set(),day=(v,max=state.day)=>Number.isInteger(v)&&finite(v,0,max),faction=id=>typeof id==='string'&&Object.hasOwn(FACTIONS,id);
 const fail=()=>{throw new Error('Ungültige Machtblöcke, Kriegsziele oder Vorherrschaft.');};
 if(!Array.isArray(g.blocs)||g.blocs.length>19||!object(g.blocCooldowns)||Object.entries(g.blocCooldowns).some(([id,d])=>!faction(id)||!day(d,state.day+180))||!Array.isArray(g.wars)||g.wars.length>171)fail();
 for(const b of g.blocs){
  if(!object(b)||!text(b.id,64)||seenIds.has(b.id)||!faction(b.leader)||seen.has(b.leader)||!text(b.name,160)||!day(b.created)||typeof b.autoSupply!=='boolean'||!Array.isArray(b.members)||b.members.length>8||!object(b.terms)||Object.keys(b.terms).length!==b.members.length)fail();
  seen.add(b.leader);seenIds.add(b.id);
  for(const id of b.members){const t=b.terms[id],r=t?.request;
   if(!faction(id)||seen.has(id)||!object(t)||!day(t.joined)||!day(t.periodStart)||!day(t.paidDays,30)||!day(t.misses,2)||r!==null&&(!object(r)||!planetIds.has(r.planet)||!RESOURCE_KEYS.includes(r.resource)||!finite(r.amount,1,2000)||!finite(r.delivered,0,r.amount+.000001)||!day(r.until,state.day+60)))fail();seen.add(id);
  }
 }
 const wars=new Set();for(const w of g.wars){
  if(!object(w)||!text(w.id,64)||wars.has(w.id)||!faction(w.a)||!faction(w.b)||w.a===w.b||w.attacker!==w.a||w.target!==null&&!planetIds.has(w.target)||!day(w.started)||w.ended!==null&&(!day(w.ended)||w.ended<w.started)||!object(w.initial)||Object.keys(w.initial).length!==2)fail();
  for(const id of[w.a,w.b])if(!Array.isArray(w.initial[id])||w.initial[id].length>49||new Set(w.initial[id]).size!==w.initial[id].length||w.initial[id].some(p=>!planetIds.has(p)))fail();wars.add(w.id);
 }
 const h=g.hegemony;
 if(!object(h)||!object(h.planetWeights)||Object.keys(h.planetWeights).length!==state.planets.length||state.planets.some(p=>h.planetWeights[p.id]!==({Industriewelt:1.25,Vulkanisch:1.2,Kristallwelt:1.2,Ozeanisch:1.1,Eiswelt:1}[p.kind]??1))||h.leader!==null&&!faction(h.leader)||!day(h.streak,120)||h.streak>0&&!h.leader||typeof h.continued!=='boolean'||h.winner!==null&&(!object(h.winner)||!faction(h.winner.owner)||!day(h.winner.day)))fail();
}
