// Paired fixed-step battles: same participants, research, hull, supply and weapons.
// Compare four formations on both sides; no actor receives extra combat stats.
import {execFileSync} from 'node:child_process';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve, join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const root=resolve(import.meta.dirname,'..'), baselineRevision='2411acc61d6c52937c2348e9307e6685ccc99e10';
const snapshot=await mkdtemp(join(tmpdir(),'orbit-formation-baseline-'));
const archive=execFileSync('git',['archive',baselineRevision,'src'],{cwd:root,maxBuffer:24*1024*1024});
execFileSync('tar',['-xf','-','-C',snapshot],{input:archive});
await writeFile(join(snapshot,'package.json'),JSON.stringify({type:'module'}));
const {createPreparation,trialBaseline}=await import('../src/battle-preparation.js');
const candidate=await import(pathToFileURL((process.env.ORBIT_BENCH_CANDIDATE??resolve(root,'src'))+'/battle-trial.js')), planner=await import('../src/battle-planner.js');
const baseline=await import(pathToFileURL(join(snapshot,'src/battle-trial.js')));
const forms=process.env.ORBIT_BENCH_FORMS?.split(',')??['auto','line','wedge','screen'], seeds=process.env.ORBIT_BENCH_SEEDS?.split(',').map(Number)??[123457,334477,971123,119437,420001,7368874];
const counts=(...pairs)=>pairs.flatMap(([type,n])=>Array(n).fill(type));
const cases=[
 {id:'convoy-front',own:counts(['cruiser',1],['destroyer',2],['corvette',4],['freighter',3]),enemy:counts(['destroyer',2],['corvette',7]),days:45},
 {id:'convoy-flank',own:counts(['cruiser',1],['destroyer',2],['corvette',4],['freighter',3]),enemy:counts(['destroyer',2],['corvette',7]),days:45,flank:true},
 {id:'mixed-duel',own:counts(['cruiser',2],['destroyer',4],['corvette',8]),enemy:counts(['cruiser',2],['destroyer',4],['corvette',8]),days:45},
 {id:'wide-front',own:counts(['cruiser',2],['destroyer',4],['corvette',8]),enemy:counts(['cruiser',2],['destroyer',4],['corvette',8]),days:45,wide:true},
 {id:'damaged-escort',own:counts(['cruiser',2],['destroyer',3],['corvette',6],['freighter',2]),enemy:counts(['cruiser',1],['destroyer',3],['corvette',7]),days:45,damaged:true},
 {id:'pure-corvettes',own:counts(['corvette',12]),enemy:counts(['cruiser',2],['destroyer',3],['corvette',4]),days:45}
];
const roster=(types,side)=>types.map((type,i)=>({id:`${side}-${i}`,name:`${type} ${i}`,type}));
function planFor(c,seed,form,side){
 const p=planner.planFromRosters({friendly:roster(side==='friendly'?c.own:c.enemy,'friendly'),enemy:roster(side==='friendly'?c.enemy:c.own,'enemy')},'20v20',seed);
 p.sides[side].formation=form;
 if(process.env.ORBIT_BENCH_LEVEL==='both')for(const g of p.sides[side].groups)g.formation=form;
 if(c.wide){const other=p.sides[side==='friendly'?'enemy':'friendly'];other.formation='line';for(const g of other.groups)g.formation='line';}
 return p;
}
function prepare(engine,plan,c,side){
 const preparation=createPreparation(trialBaseline(),'Formation benchmark');
 preparation.ships=['friendly','enemy'].flatMap(owner=>plan.sides[owner].ships.map(s=>({id:s.id,side:owner,type:s.type,hp:c.damaged&&owner===side&&s.type==='cruiser'?35:100,supply:100})));
 const b=engine.createBattleTrial({plan,preparation});
 if(c.flank){
   const foe=side==='friendly'?'enemy':'friendly',g=b.navigation.groups.find(g=>g.side===foe&&b.ships.some(s=>s.group===g.id&&s.strategicType==='corvette'));
   const cargo=b.ships.find(s=>s.side===side&&s.strategicType==='freighter');
   const sign=foe==='enemy'?-1:1;
   g.mode='flank-left';g.target=cargo.id;g.tracked=[...cargo.position];g.route=[[1100*sign,0,200*sign],[1100*sign,0,cargo.position[2]]];g.stage=0;
 }
 return b;
}
function signature(b){return b.ships.map(s=>({id:s.id,type:s.strategicType,combat:s.combat,hull:s.hull,supply:s.supply})).sort((a,b)=>a.id.localeCompare(b.id));}
function run(engine,plan,c,side){
 const b=prepare(engine,plan,c,side),before=signature(b);let firstKill=null,hostileKills=0,cargoLoss=0,shots=0;
 const enemies=new Set(b.ships.filter(s=>s.side!==side).map(s=>s.id)),cargo=new Set(b.ships.filter(s=>s.side===side&&s.strategicType==='freighter').map(s=>s.id));
 while(b.day<c.days&&b.phase==='engaged')for(const e of engine.advanceBattleTrial(b,1/6)){
   if(e.kind==='destroy'&&enemies.has(e.ship)){hostileKills++;firstKill??=e.day;}
   if(e.kind==='destroy'&&cargo.has(e.ship))cargoLoss++;
   if(e.kind==='fire'&&b.ships.find(s=>s.id===e.ship)?.side===side)shots++;
 }
 const own=b.ships.filter(s=>s.side===side),dead=own.filter(s=>!s.hull&&!s.escaped).length;
 return {before,dead,hostileKills,cargoLoss,firstKill:firstKill??c.days,shots,remainingHull:own.reduce((n,s)=>n+s.hull,0),day:b.day,phase:b.phase};
}
const selectedCases=cases.filter(c=>!process.env.ORBIT_BENCH_CASES||process.env.ORBIT_BENCH_CASES.split(',').includes(c.id));
const rows=[];const start=Date.now();
for(const c of selectedCases)for(const seed of seeds)for(const side of ['friendly','enemy'])for(const form of forms){
 const plan=planFor(c,seed,form,side),old=run(baseline,plan,c,side),next=run(candidate,plan,c,side);
 assert.deepEqual(next.before,old.before);delete old.before;delete next.before;
 rows.push({case:c.id,seed,side,formation:form,baseline:old,candidate:next});
}
const summary=[];
for(const c of selectedCases)for(const form of forms){const values=rows.filter(r=>r.case===c.id&&r.formation===form),avg=(engine,key)=>values.reduce((n,r)=>n+r[engine][key],0)/values.length;summary.push({case:c.id,form,n:values.length,oldLoss:+avg('baseline','dead').toFixed(2),loss:+avg('candidate','dead').toFixed(2),oldCargoLoss:+avg('baseline','cargoLoss').toFixed(2),cargoLoss:+avg('candidate','cargoLoss').toFixed(2),oldKills:+avg('baseline','hostileKills').toFixed(2),kills:+avg('candidate','hostileKills').toFixed(2),oldFirstKill:+avg('baseline','firstKill').toFixed(2),firstKill:+avg('candidate','firstKill').toFixed(2)});}
console.table(summary);console.log('Elapsed seconds',((Date.now()-start)/1000).toFixed(1));
await writeFile(process.env.ORBIT_BENCH_OUTPUT??join(tmpdir(),'orbit-formation-results.json'),JSON.stringify({baselineRevision,level:process.env.ORBIT_BENCH_LEVEL==='both'?'fleet-and-groups':'fleet',seeds,cases:selectedCases.map(c=>c.id),rows,summary},null,2));

await rm(snapshot,{recursive:true,force:true});
