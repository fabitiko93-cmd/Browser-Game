import { maneuverSpec } from './battle-formations.js';
export { maneuverSpec } from './battle-formations.js';

export const MANEUVERS = { fleet: 'Bei Flotte bleiben', hold: 'Position halten', attack: 'Selbstständig angreifen', 'flank-left': 'Links flankieren', 'flank-right': 'Rechts flankieren', regroup: 'Zur Flotte sammeln' };
const active = s => s.hull > 0 && !s.escaped && s.order !== 'retreat';
const mean = points => points.length ? [0,1,2].map(i => points.reduce((n,p)=>n+p[i],0)/points.length) : [0,0,0];
const distance = (a,b) => Math.hypot(...a.map((v,i)=>v-b[i]));
const add = (a,b) => a.map((v,i)=>v+b[i]);
const delta = (a,b) => a.map((v,i)=>v-b[i]);
const scale = (a,n) => a.map(v=>v*n);
const unit = v => scale(v,1/(Math.hypot(...v)||1));

export function initializeManeuvers(battle) {
  if (battle.mode!=='trial'||!battle.formations||battle.navigation) return;
  const fleets=['friendly','enemy'].map(side=>{
    const ships=battle.ships.filter(s=>s.side===side),home=mean(ships.map(s=>s.home));
    return {side,mode:'hold',anchor:[...home],home:[...home],target:null,tracked:null,stage:0,route:[]};
  });
  const groups=battle.formations.map(g=>{
    const members=battle.ships.filter(s=>s.group===g.id),home=mean(members.map(s=>s.home)),fleet=fleets.find(f=>f.side===g.side);
    return {id:g.id,side:g.side,mode:'fleet',home,anchor:[...home],offset:delta(home,fleet.home),target:null,tracked:null,stage:0,route:[]};
  });
  battle.navigation={fleets,groups};
}
function opponent(battle,nav) {
  const previous=battle.ships.find(s=>s.id===nav.target&&s.side!==nav.side&&active(s));
  if(previous)return previous;
  let best=null,bestDistance=Infinity;
  for(const s of battle.ships)if(s.side!==nav.side&&s.hull>0&&!s.escaped){const d=distance(s.position,nav.anchor);if(d<bestDistance){best=s;bestDistance=d;}}
  return best;
}
function routeFor(battle,nav,target) {
  if(!target)return [];
  const forward=unit([target.position[0]-nav.anchor[0],0,target.position[2]-nav.anchor[2]]),right=[-forward[2],0,forward[0]];
  if(nav.mode.startsWith('flank')){
    const flank=nav.mode==='flank-left'?-1:1;
    const enemies=battle.ships.filter(s=>s.side!==nav.side&&s.hull>0&&!s.escaped);
    const width=enemies.reduce((n,s)=>Math.max(n,Math.abs(delta(s.position,target.position).reduce((sum,v,i)=>sum+v*right[i],0))+(s.length??36)/2),0);
    const ownWidth=battle.ships.filter(s=>s.side===nav.side&&s.hull>0&&!s.escaped&&(!nav.id||s.group===nav.id)).reduce((n,s)=>Math.max(n,Math.abs(delta(s.home,nav.home).reduce((sum,v,i)=>sum+v*right[i],0))+(s.length??36)/2),0);
    const reach=Math.max(420,width+ownWidth+200);
    return [add(add(nav.anchor,scale(right,flank*reach)),scale(forward,Math.min(600,distance(nav.anchor,target.position)*.30))),add(target.position,scale(right,flank*reach))];
  }
  return [add(target.position,scale(forward,-Math.min(850,(target.combat?.range??3600)*.30)))];
}
export function commandManeuver(battle,mode) {
  if(battle.phase!=='engaged'||!Object.hasOwn(MANEUVERS,mode)||!['group','fleet'].includes(battle.scope)||!battle.navigation)return false;
  const selected=battle.navigation.groups.filter(g=>g.side==='friendly'&&(battle.scope==='fleet'||g.id===battle.selectedGroup));
  if(!selected.length||!selected.some(g=>battle.ships.some(s=>s.group===g.id&&active(s))))return false;
  const fleet=battle.navigation.fleets.find(f=>f.side==='friendly');
  const target=battle.ships.find(s=>s.id===battle.target&&s.side==='enemy'&&s.hull>0&&!s.escaped);
  if(['attack','flank-left','flank-right'].includes(mode)&&!target)return false;
  if(battle.scope==='fleet'){
    fleet.mode=['fleet','regroup','hold'].includes(mode)?'hold':mode;fleet.stage=0;fleet.target=target?.id??null;fleet.tracked=target?[...target.position]:null;fleet.route=routeFor(battle,fleet,target);
    for(const g of selected){g.mode=mode==='hold'?'hold':'fleet';g.stage=0;g.route=[];g.target=null;if(mode==='hold')g.anchor=mean(battle.ships.filter(s=>s.group===g.id&&active(s)).map(s=>s.position));}
  }else for(const g of selected){
    g.mode=mode;g.stage=0;g.target=target?.id??null;g.tracked=target?[...target.position]:null;
    g.anchor=mean(battle.ships.filter(s=>s.group===g.id&&active(s)).map(s=>s.position));
    g.route=['attack','flank-left','flank-right'].includes(mode)?routeFor(battle,g,target):[];
  }
  return true;
}
function travel(nav,goal,speed,dt) {
  const d=delta(goal,nav.anchor),length=Math.hypot(...d),step=Math.min(length,speed*dt);
  if(length>1e-7)nav.anchor=add(nav.anchor,scale(d,step/length));
  return length<=Math.max(8,speed*dt);
}
function navigate(battle,nav,speed,dt) {
  if(!['attack','flank-left','flank-right'].includes(nav.mode))return;
  const target=opponent(battle,nav);if(!target)return;
  if(nav.target!==target.id){nav.target=target.id;nav.stage=0;nav.route=routeFor(battle,nav,target);nav.tracked=[...target.position];}
  if(nav.mode.startsWith('flank')&&nav.route.length>1&&nav.tracked)nav.route[1]=add(nav.route[1],delta(target.position,nav.tracked));
  nav.tracked=[...target.position];
  if(!nav.route.length)nav.route=routeFor(battle,nav,target);
  if(nav.mode==='attack')nav.route[0]=routeFor(battle,nav,target)[0];
  const goal=nav.route[Math.min(nav.stage,nav.route.length-1)];
  if(goal&&travel(nav,goal,speed,dt)&&nav.stage<nav.route.length-1)nav.stage++;
}

export function updateManeuvers(battle,dt) {
  if(!battle.navigation)return;
  const members=new Map();for(const s of battle.ships)if(active(s)){if(!members.has(s.group))members.set(s.group,[]);members.get(s.group).push(s);}
  for(const f of battle.navigation.fleets){
    const attached=battle.navigation.groups.filter(g=>g.side===f.side&&['fleet','regroup'].includes(g.mode)).flatMap(g=>members.get(g.id)??[]);
    if(attached.length)navigate(battle,f,Math.min(...attached.map(s=>maneuverSpec(s).speed))*.72,dt);
  }
  const proposals=[];
  for(const g of battle.navigation.groups){
    const ships=members.get(g.id)??[];if(!ships.length)continue;
    const f=battle.navigation.fleets.find(f=>f.side===g.side),speed=Math.min(...ships.map(s=>maneuverSpec(s).speed))*.72;
    if(['fleet','regroup'].includes(g.mode)){const goal=add(f.anchor,g.offset);const arrived=travel(g,goal,speed,dt);if(arrived&&g.mode==='regroup')g.mode='fleet';}
    else navigate(battle,g,speed,dt);
    for(const s of ships){
      const goal=add(g.anchor,delta(s.home,g.home)),d=delta(goal,s.position),length=Math.hypot(...d),step=Math.min(length,maneuverSpec(s).speed*dt);
      const position=length>1e-8?add(s.position,scale(d,step/length)):[...s.position];
      proposals.push({ship:s,position,moving:step>1e-7});
    }
  }
  // Spatial neighborhoods keep collision checks local even for many independent groups.
  const cell=Math.max(24,...proposals.map(p=>(p.ship.length??36)+12));
  for(let iteration=0;iteration<3;iteration++){
    const bins=new Map(),corrections=new Map(proposals.map(p=>[p.ship.id,[0,0,0]]));
    for(const p of proposals){const key=p.position.map(v=>Math.floor(v/cell)).join(':');if(!bins.has(key))bins.set(key,[]);bins.get(key).push(p);}
    for(const p of proposals){const c=p.position.map(v=>Math.floor(v/cell));for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++)for(const q of bins.get(`${c[0]+x}:${c[1]+y}:${c[2]+z}`)??[]){
      if(p.ship.id>=q.ship.id||!p.moving&&!q.moving)continue;
      const d=delta(p.position,q.position),length=Math.hypot(...d),clearance=((p.ship.length??36)+(q.ship.length??36))/2+12;
      if(length>=clearance)continue;const direction=length>1e-8?scale(d,1/length):[p.ship.id<q.ship.id?-1:1,0,0],push=scale(direction,(clearance-length)*.505);
      const a=corrections.get(p.ship.id),b=corrections.get(q.ship.id);for(let i=0;i<3;i++){if(p.moving)a[i]+=push[i]*(q.moving?1:2);if(q.moving)b[i]-=push[i]*(p.moving?1:2);}
    }}
    for(const p of proposals)if(p.moving)p.position=add(p.position,corrections.get(p.ship.id));
  }
  for(const p of proposals){p.ship.velocity=scale(delta(p.position,p.ship.position),1/dt);p.ship.position=p.position;}
}

export function maneuverInfo(battle) {
  const groups=battle.navigation?.groups.filter(g=>g.side==='friendly'&&(battle.scope==='fleet'||battle.scope==='group'&&g.id===battle.selectedGroup))??[];
  const fleetMode=battle.navigation?.fleets.find(f=>f.side==='friendly')?.mode;
  const modes=new Set(groups.map(g=>g.mode==='fleet'&&battle.scope==='fleet'&&fleetMode!=='hold'?fleetMode:g.mode));
  return {groups,mode:modes.size===1?[...modes][0]:null,label:modes.size>1?'Unterschiedliche Manöver':MANEUVERS[[...modes][0]]??'Bei Flotte bleiben',available:battle.phase==='engaged'&&groups.some(g=>battle.ships.some(s=>s.group===g.id&&active(s)))};
}

export function validateNavigation(battle) {
  if(battle.navigation===undefined)return;
  const n=battle.navigation,num=v=>Number.isFinite(v)&&Math.abs(v)<=1e6,vector=v=>Array.isArray(v)&&v.length===3&&v.every(num),fail=()=>{throw new Error('Ungültige Verbandsmanöver.');};
  if(!n||!Array.isArray(n.fleets)||n.fleets.length!==2||!Array.isArray(n.groups)||n.groups.length!==battle.formations?.length)fail();
  const ids=new Set();
  for(const nav of [...n.fleets,...n.groups]){
    if(!nav||!['friendly','enemy'].includes(nav.side)||!Object.hasOwn(MANEUVERS,nav.mode)||!vector(nav.anchor)||!vector(nav.home)||!Number.isInteger(nav.stage)||nav.stage<0||nav.stage>1||!Array.isArray(nav.route)||nav.route.length>2||!nav.route.every(vector)||nav.target!==null&&!battle.ships.some(s=>s.id===nav.target&&s.side!==nav.side))fail();
    const key=nav.id??nav.side;if(ids.has(key))fail();ids.add(key);
    if(nav.tracked!==undefined&&nav.tracked!==null&&!vector(nav.tracked))fail();
    if(nav.id&&(!battle.formations.some(g=>g.id===nav.id&&g.side===nav.side)||!vector(nav.offset)))fail();
  }
  if(!n.fleets.some(f=>f.side==='friendly')||!n.fleets.some(f=>f.side==='enemy'))fail();
}
