import { researchBlock, technologyEffects } from './technology.js';
import { policyEffects } from './governance.js';
import { TECHNOLOGIES } from './data.js';
import { log } from './state.js';
const EPSILON=1e-9;
const wallets=state=>[['player',state],...Object.entries(state.factions??{})];
export function startResearch(state, id) {
  const def = TECHNOLOGIES[id];
  if (state.credits < 0) return 'Forschung wartet auf die Finanzierung: tilge zuerst die Schulden.';
  if (!Object.hasOwn(TECHNOLOGIES, id)) return 'Unbekannte Technologie.';
  if (state.tech.includes(id)) return 'Diese Technologie ist bereits erforscht.';
  if (state.research) return 'Es läuft bereits ein Forschungsprojekt.';
  const blocked = researchBlock(state, id);
  if (blocked) return blocked;
  if (state.science < def.cost) return 'Es fehlen Forschungspunkte.';
  state.science -= def.cost;
  const total = researchDays(state, id);
  state.research = { id, remaining: total, total };
  log(state, `Forschung begonnen: ${def.name}.`);
  return null;
}
export function finishResearch(state) {
  for(const [owner,wallet]of wallets(state)) {
    if(!wallet.research||wallet.research.remaining>EPSILON)continue;
    const id=wallet.research.id;
    if(!wallet.tech.includes(id))wallet.tech.push(id);
    wallet.research=null;
    if(owner==='player')log(state,`Forschung abgeschlossen: ${TECHNOLOGIES[id].name}.`,'success','research');
  }
}
export function nextResearchCompletion(state) {
  const owners=new Set(state.planets.filter(p=>!p.destroyed).map(p=>p.owner));
  return Math.min(Infinity,...wallets(state).filter(([owner,w])=>owners.has(owner)&&w.credits>=0&&w.research).map(([,w])=>w.research.remaining));
}
export function advanceResearch(state,days,{deferBoundary=false}={}) {
  const owners=new Set(state.planets.filter(p=>!p.destroyed).map(p=>p.owner));
  for(const [owner,w]of wallets(state)) {
    if(!owners.has(owner)||!w.research||w.credits<0)continue;
    const before=w.research.remaining;
    w.research.remaining=Math.max(0,before-days);
    if(w.research.remaining<=EPSILON&&(!deferBoundary||before<days-EPSILON)) {
      const id=w.research.id;
      if(!w.tech.includes(id))w.tech.push(id);
      w.research=null;
      if(owner==='player')log(state,`Forschung abgeschlossen: ${TECHNOLOGIES[id].name}.`,'success','research');
    }
  }
}
export const tickResearch=(state,days=1)=>advanceResearch(state,days);

export function researchDays(state,id,owner='player') { return TECHNOLOGIES[id].days*policyEffects(state,owner).researchTime*technologyEffects(state,owner).researchTime; }
