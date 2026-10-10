import { FACTIONS, SYSTEMS, BUILDINGS, IDEOLOGIES, GRID } from './data.js';
import { KNOWLEDGE_DOMAINS, KNOWLEDGE_SOURCES } from './intelligence.js';
import { OFFER_DAYS, OFFER_TERMS } from './communications.js';

export function validateExploration(state,ids) {
  const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
  const finite=(v,min=0,max=1e12)=>Number.isFinite(v)&&v>=min&&v<=max;
  const day=(v,min=0,max=state.day)=>Number.isInteger(v)&&finite(v,min,max);
  const text=(v,max)=>typeof v==='string'&&v.length>0&&v.length<=max;
  const exactKeys=(v,keys)=>object(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
  const system=id=>SYSTEMS.some(s=>s.id===id);
  const fail=message=>{throw new Error(message);};
  if(!exactKeys(state.intelligence,Object.keys(FACTIONS)))fail('Ungültige Wissensarchive.');
  for(const [viewer,book] of Object.entries(state.intelligence)) {
    if(!object(book)||!Array.isArray(book.chartedSystems)||book.chartedSystems.length>SYSTEMS.length||new Set(book.chartedSystems).size!==book.chartedSystems.length||book.chartedSystems.some(id=>!system(id))||!Array.isArray(book.routes)||book.routes.length>66||!day(book.nextMission,0,state.day+60)||!object(book.planets)||Object.keys(book.planets).length>ids.size)fail('Ungültige Sternenkartierung.');
    if(state.planets.some(p=>p.owner===viewer&&!book.chartedSystems.includes(p.system)))fail('Eigene Kolonien müssen kartiert sein.');
    const routes=new Set();
    for(const r of book.routes){const key=[r.from,r.to].sort().join(':');if(!object(r)||!system(r.from)||!system(r.to)||r.from===r.to||!book.chartedSystems.includes(r.from)||!book.chartedSystems.includes(r.to)||!day(r.day)||routes.has(key))fail('Ungültige Erkundungsroute.');routes.add(key);}
    for(const [pid,record] of Object.entries(book.planets)) {
      if(!ids.has(pid)||!object(record)||!book.chartedSystems.includes(state.planets.find(p=>p.id===pid).system)||Object.keys(record).some(k=>!KNOWLEDGE_DOMAINS.includes(k)))fail('Ungültiges Planetendossier.');
      for(const [domain,field] of Object.entries(record)) {
        if(!object(field)||!day(field.day)||!Object.hasOwn(KNOWLEDGE_SOURCES,field.source)||!['observed','reported','estimate','exact'].includes(field.precision))fail('Ungültige Informationsquelle.');
        const v=field.value;
        if(domain==='occupancy'&&typeof v!=='boolean'||domain==='identity'&&v!==null&&!Object.hasOwn(FACTIONS,v))fail('Ungültige Bewohnungsdaten.');
        if(domain==='geology'&&(!exactKeys(v,['oreFactor','solarFactor'])||!finite(v.oreFactor,.1,10)||!finite(v.solarFactor,.1,10)))fail('Ungültige Geologiedaten.');
        if(domain==='surface'&&(!exactKeys(v,['seed','kind'])||!Number.isInteger(v.seed)||!finite(v.seed,0,1e9)||!text(v.kind,40)))fail('Ungültige Oberflächendaten.');
        if(domain==='civil'&&(!exactKeys(v,['population','happiness','aliens','ideology'])||!finite(v.population)||!finite(v.happiness,0,100)||!finite(v.aliens,0,1)||v.ideology!==null&&!Object.hasOwn(IDEOLOGIES,v.ideology)))fail('Ungültige Gesellschaftsdaten.');
        if(domain==='military'&&(!object(v)||!['defense','shield','garrison'].every(k=>finite(v[k]))||Object.keys(v).some(k=>!['defense','shield','garrison','orbital','fortification','fleetStrength'].includes(k))||Object.values(v).some(n=>!finite(n))))fail('Ungültige Militärbeobachtung.');
        if(domain==='installations') {
          if(!Array.isArray(v)||v.length>GRID.width*GRID.height)fail('Ungültige Anlagenbeobachtung.');
          const tiles=new Set();
          for(const b of v){const key=`${b.x},${b.y}`;if(!object(b)||!BUILDINGS[b.type]||!text(b.id,64)||!Number.isInteger(b.x)||!finite(b.x,0,GRID.width-1)||!Number.isInteger(b.y)||!finite(b.y,0,GRID.height-1)||!finite(b.remaining,0,30)||typeof b.enabled!=='boolean'||!text(b.status,64)||tiles.has(key))fail('Ungültige Anlagenbeobachtung.');tiles.add(key);}
        }
      }
    }
  }
  const c=state.communications;
  if(!object(c)||!Array.isArray(c.messages)||c.messages.length>120||!object(c.cooldowns)||Object.entries(c.cooldowns).some(([id,d])=>!state.relations[id]||!day(d,0,state.day+120))||!day(c.nextOffer,0,state.day+48)||!Number.isInteger(c.cursor)||!finite(c.cursor,0,Object.keys(state.relations).length-1))fail('Ungültiger Posteingang.');
  const messages=new Set(),negotiations=new Set();
  for(const m of c.messages){
    const info=m.type==='declaration',other=m.from==='player'?m.to:m.from;
    if(!object(m)||!text(m.id,64)||messages.has(m.id)||!FACTIONS[m.from]||!FACTIONS[m.to]||m.from===m.to||!(m.from==='player'||m.to==='player')||!day(m.created)||typeof m.read!=='boolean'||!text(m.title,100)||!text(m.body,800)||m.reason!=null&&(typeof m.reason!=='string'||m.reason.length>600))fail('Ungültige Nachricht.');
    if(info?(m.status!=='information'||m.expires!==null||m.resolved!==null):(!OFFER_TERMS[m.type]||!['open','accepted','rejected','expired','withdrawn'].includes(m.status)||m.expires!==m.created+OFFER_DAYS||m.status==='open'&&(m.expires<=state.day||m.resolved!==null)||m.status!=='open'&&!day(m.resolved,m.created)))fail('Ungültige Antwortfrist.');
    if(m.status==='open'){if(negotiations.has(other))fail('Doppelte Verhandlung.');negotiations.add(other);}
    messages.add(m.id);
  }
}
