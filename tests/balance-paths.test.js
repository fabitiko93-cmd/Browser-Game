import assert from 'node:assert/strict';
import test from 'node:test';
import {createGame,getPlanet} from '../src/state.js';
import {TECHNOLOGIES} from '../src/data.js';
import {placeBuilding} from '../src/economy.js';
import {stepDay} from '../src/simulation.js';
import {startResearch} from '../src/research.js';
import {buildShip,orderFleet} from '../src/fleets.js';
import {changeGovernment,diplomaticAction} from '../src/politics.js';
import {forecastDay} from '../src/budget.js';
import {validateSave} from '../src/save.js';

const build=(s,p,type)=>{for(let y=0;y<14;y++)for(let x=0;x<12;x++)if(!p.buildings.some(b=>b.x===x&&b.y===y)&&!placeBuilding(s,p,type,x,y))return true;return false;};
test('paid growth, trade and conquest offer distinct viable returns from identical real starts',()=>{
 const results=[];
for(const path of ['passive','civil','trade','military']){
 const s=createGame({legacy:true}),p=getPlanet(s,'nereid');let attacked=false,sales=0,revenue=0,invested=0,history=[];
 const payBuild=type=>{const before=s.credits;if(build(s,p,type)){invested+=before-s.credits;return true;}return false;};
 if(path==='civil'){payBuild('habitat');payBuild('habitat');payBuild('farm');payBuild('solar');}
 
 if(path==='trade'){assert.equal(diplomaticAction(s,'khepri','envoy'),null);invested+=60;}
 if(path==='military'){assert.equal(changeGovernment(s,'military'),null);s.player.tax=.22;payBuild('crystal');payBuild('laser');}
 const techPlan=['targeting','lasers','fortification'];
 for(let day=0;day<360;day++){
  if(path==='trade'){
   
   if(day===20){assert.equal(diplomaticAction(s,'khepri','trade'),null);invested+=50;const target=s.planets.find(q=>q.owner==='khepri');assert.equal(orderFleet(s,['starter-f'],target.id,'transport',{resource:'food',amount:40,reserve:60,repeat:true}),null);}
  }
  if(path==='military'){
   if(!s.research){const id=techPlan.find(id=>!s.tech.includes(id));if(id&&s.science>=TECHNOLOGIES[id].cost)startResearch(s,id);}
   for(const [type,reserve,key] of [['mine',120,'ore'],['foundry',210,'alloy'],['optics',60,'optics']]){const b=p.buildings.find(b=>b.type===type);if(b)b.enabled=p.stock[key]<reserve;}
   if(s.tech.includes('fortification'))p.buildings.find(b=>b.type==='lab').enabled=false;
   const wanted=[['destroyer',2],['lander',2]];
   for(const [type,count]of wanted){const actual=s.fleets.filter(f=>f.owner==='player'&&f.type===type).length+p.queues.filter(q=>q.type===type).length;
    if(!attacked&&actual<count){const before=s.credits;if(!buildShip(s,p,type)){invested+=before-s.credits;break;}}
   }
   const attack=s.fleets.filter(f=>f.owner==='player'&&f.planetId===p.id&&!f.mission&&['destroyer','lander','corvette'].includes(f.type));
   if(!attacked&&attack.filter(f=>f.type==='destroyer').length===2&&attack.filter(f=>f.type==='lander').length===2){
    assert.equal(diplomaticAction(s,'ilyri','war',{target:'thalassa'}),null);assert.equal(orderFleet(s,attack.map(f=>f.id),'thalassa','attack'),null);attacked=true;history.push({event:'attack',day});
   }
  }
  const opening=new Set(s.tradeLedger);stepDay(s);
  for(const e of s.tradeLedger)if(!opening.has(e)&&e.revenue>0){sales++;revenue+=e.revenue;}
  if(day%60===59){validateSave(structuredClone(s));history.push({day:s.day,cash:s.credits,worlds:s.planets.filter(p=>p.owner==='player').length,pop:p.population,net:forecastDay(s).budget.net});}
  if(s.galaxy.defeat||s.galaxy.hegemony.winner)break;
 }
 results.push({path,cash:s.credits,pop:p.population,worlds:s.planets.filter(p=>p.owner==='player').length,net:forecastDay(s).budget.net,sales,revenue,invested,history,defeat:s.galaxy.defeat});
}
assert.ok(results[1].pop>results[0].pop);assert.ok(results[1].net>results[0].net);assert.ok(results[2].revenue>results[2].invested);assert.ok(results[3].worlds>1);assert.ok(results.every(r=>!r.defeat&&r.cash>0));
});
