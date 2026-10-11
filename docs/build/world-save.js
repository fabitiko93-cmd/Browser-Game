import { RESOURCE_KEYS, FACTIONS } from './data.js';
export const validDeposits = d => d && !Array.isArray(d) && Object.keys(d).length === 5 && ['ore','crystal','fuel'].every(k=>Number.isInteger(d[k])&&d[k]>=1&&d[k]<=168) && ['crystalYield','fuelYield'].every(k=>Number.isFinite(d[k])&&d[k]>=.25&&d[k]<=2);
export function validateWorld(state) {
  const w=state.world,fail=()=>{throw new Error('Ungültige erzeugte Spielwelt.');};
  if(!w||typeof w.generated!=='boolean')fail();
  if(w.generated? !Number.isInteger(w.seed)||w.seed<0||w.seed>0xffffffff : w.seed!==null)fail();
  if(!Array.isArray(w.systems)||w.systems.length<3||w.systems.length>24||!Array.isArray(w.anchors)||w.anchors.length>12)fail();
  const ids=new Set();
  for(const s of w.systems){if(!s||typeof s.id!=='string'||!s.id.length||s.id.length>40||ids.has(s.id)||typeof s.name!=='string'||!s.name.length||s.name.length>40||!Number.isFinite(s.x)||s.x<0||s.x>1||!Number.isFinite(s.y)||s.y<0||s.y>1||!/^#[a-f0-9]{6}$/i.test(s.color)||typeof s.description!=='string'||s.description.length>300||s.uncharted!=null&&typeof s.uncharted!=='boolean')fail();ids.add(s.id);}
  const anchors=new Set();
  for(const p of w.anchors){if(!p?.anchor||p.id!==`anchor-${p.system}`||!ids.has(p.system)||anchors.has(p.system)||state.planets.some(q=>q.system===p.system)||p.population!==0||p.buildings.length||p.queues.length||p.owner!==null&&!FACTIONS[p.owner]||RESOURCE_KEYS.some(k=>!Number.isFinite(p.stock[k])||p.stock[k]<0))fail();anchors.add(p.system);}
  for(const p of [...state.planets,...w.anchors]) {
    if(p.active!=null&&typeof p.active!=='boolean')fail();
    if(p.deposits&&!validDeposits(p.deposits))fail();
    const r=p.ruin;
    if(r&&(!['depot','observatory'].includes(r.type)||!['sealed','restoring','active','salvaged'].includes(r.status)||!Number.isInteger(r.remaining)||r.remaining<0||r.remaining>12||r.operator!==null&&!FACTIONS[r.operator]||r.status==='active'&&!r.operator||r.status==='restoring'&&(!r.operator||r.remaining<1)||r.buildingId!=null&&!p.buildings.some(b=>b.id===r.buildingId)))fail();
  }
}
