import { HarbingerScene } from './harbinger-scene.js';
import { createDemoBattle, advanceDemoBattle, selectDemoShip, commandDemo, activeShip, DEMO_CLASSES, fleetDistanceKm } from './battle-demo.js';
import { commandDisplay } from './harbinger-display.js';
import { TargetPanel } from './battle-targets-ui.js';
import { CONTACT_GROUPS, contactInfo } from './battle-targets.js';
import { MediaAudio } from './audio-media.js';
import { BattleAudio } from './battle-audio.js';

const $=id=>document.getElementById(id),number=new Intl.NumberFormat('de-DE',{minimumFractionDigits:1,maximumFractionDigits:1});
const audio=new MediaAudio(),sound=new BattleAudio(()=>audio.settings),frames=[],markers=new Map(),ownButtons=new Map();
let battle,view,ready=false,paused=false,generation=0,lastFrame=0,lastRender=0,lastHud=0,visualTime=0,pending=[],noticeTimer;
function text(id,value){const node=$(id);if(node.textContent!==String(value))node.textContent=value;}
function pressed(node,value){node.setAttribute('aria-pressed',String(value));}
function viewport(){if(!view)return;view.resize();$('battle-notice').style.top=`${view.viewportTop+30}px`;$('view-caption').style.top=`${view.viewportTop+5}px`;$('tactical-legend').style.top=`${view.viewportBottom-20}px`;}
function notice(message){clearTimeout(noticeTimer);text('battle-notice',message);noticeTimer=setTimeout(()=>text('battle-notice',''),3200);}
function setCamera(mode,animated=true){
  view.setMode(mode,battle,animated);for(const node of document.querySelectorAll('[data-camera]'))pressed(node,node.dataset.camera===mode);
  pressed($('target-view'),mode==='target');text('target-view',mode==='target'?'Zurück':'Ansehen');
  text('camera-caption',({ship:'SCHIFFSKAMERA',fleet:'EIGENE FORMATION',overview:'TAKTIK · 3D-RAUM',target:'GEGNERKAMERA'})[mode]);
  $('tactical-legend').hidden=mode!=='overview';viewport();lastRender=0;
}
function selectContact(id){
  if(!selectDemoShip(battle,id))return false;
  const ship=battle.ships.find(s=>s.id===id);
  if(ship.side==='friendly'){$('own-dialog').close();if(!['fleet','overview'].includes(view.mode))setCamera('ship');}
  else if(view.mode==='target')setCamera('target');
  paint();lastRender=0;return true;
}
const contacts=new TargetPanel($('contacts-dialog'),{getBattle:()=>battle,onSelect:selectContact,onInspect:()=>setCamera('target'),onPriority:type=>{
  if(!commandDemo(battle,'priority',type))return false;
  const target=battle.ships.find(s=>s.side==='enemy'&&s.type===type&&activeShip(s));if(target)selectContact(target.id);
  notice(`Angriffspriorität: ${CONTACT_GROUPS[type]}.`);paint();return true;
}});
function initializeHud(){
  ownButtons.clear();markers.clear();$('ship-selector').replaceChildren();$('ship-labels').replaceChildren();
  for(const ship of battle.ships.filter(s=>s.side==='friendly')){
    const button=document.createElement('button');button.dataset.ship=ship.id;
    const name=document.createElement('span'),detail=document.createElement('small'),hull=document.createElement('span');
    name.textContent=ship.name;detail.textContent=DEMO_CLASSES[ship.type].name;name.append(detail);button.append(name,hull);$('ship-selector').append(button);ownButtons.set(ship.id,button);
  }
}
function failed(error){ready=false;paused=true;$('battle-loading').hidden=true;$('battle-error').hidden=false;text('battle-error-text',error.message?.includes('WebGL')?'Die 3D-Ansicht konnte nicht starten. Bitte in aktuellem Safari erneut öffnen.':'Modell oder Materialien konnten nicht vollständig geladen werden. Bitte Verbindung prüfen und erneut versuchen.');console.error('Harbinger initialization:',error);}
async function start(){
  const run=++generation;ready=false;paused=false;lastFrame=lastRender=lastHud=visualTime=0;pending=[];frames.length=0;
  view?.dispose();view=null;const old=$('battle-canvas');old.replaceWith(old.cloneNode(false));
  battle=createDemoBattle();battle.ships.find(s=>s.id==='aurora').name='Harbinger';contacts.reset();initializeHud();text('battle-notice','');
  for(const id of ['own-dialog','graphics-dialog'])if($(id).open)$(id).close();
  $('battle-error').hidden=true;$('battle-loading').hidden=false;$('load-bar').style.width='5%';text('loading-progress','Schiffsmodell laden …');
  try{
    const next=new HarbingerScene($('battle-canvas'),{onSelect:id=>{if(ready)selectContact(id);},onUnavailable:message=>failed(new Error(message)),onAssetProgress:(loaded,total)=>{
      if(run!==generation)return;const percent=Math.round(loaded/total*100);text('loading-progress',percent===100?'Materialien und Licht vorbereiten …':`Harbinger laden · ${percent} %`);$('load-bar').style.width=`${5+loaded/total*85}%`;
    }});view=next;await next.load(battle);if(run!==generation){next.dispose();return;}
    ready=true;$('battle-loading').hidden=true;setCamera('ship',false);paint();view.render(battle,0);labels();
  }catch(error){if(run!==generation)return;view?.dispose();view=null;failed(error);}
}
function paint(){
  const own=battle.ships.filter(s=>s.side==='friendly'),selected=own.find(s=>s.id===battle.selected),def=DEMO_CLASSES[selected.type];
  const target=battle.ships.find(s=>s.id===battle.target),info=target&&contactInfo(target,selected),display=commandDisplay(battle);
  text('friendly-count',own.filter(activeShip).length);text('enemy-count',battle.ships.filter(s=>s.side==='enemy'&&activeShip(s)).length);
  text('battle-day',`Tag ${number.format(battle.day)}`);text('battle-range',`${number.format(fleetDistanceKm(battle))} km`);
  text('selected-name',selected.name);text('selected-class',def.name.toUpperCase());text('selected-order',display.label);
  const hull=Math.round(selected.hull/def.hull*100),shield=Math.round(selected.shield/def.shield*100);
  text('hull-value',hull);text('shield-value',shield);$('hull-bar').style.width=`${hull}%`;$('shield-bar').style.width=`${shield}%`;
  text('target-name',target?.name??'Kein Gegner');text('target-distance',info?`${number.format(info.distance)} km`:'');text('target-state',display.chosenState);
  $('attack-target').disabled=!display.canAttack;$('auto-target').disabled=$('retreat').disabled=!display.canCommand;
  $('target-picker').disabled=!battle.ships.some(s=>s.side==='enemy'&&activeShip(s));$('target-view').disabled=!info?.active&&view?.mode!=='target';pressed($('auto-target'),display.auto);
  $('attack-target').setAttribute('aria-label',`${battle.scope==='fleet'?'Eigene Flotte':selected.name}: ${target?.name??'Gegner'} angreifen`);
  for(const node of document.querySelectorAll('[data-scope]'))pressed(node,node.dataset.scope===battle.scope);
  for(const ship of own){const button=ownButtons.get(ship.id);button.disabled=!activeShip(ship);pressed(button,ship.id===selected.id);button.lastElementChild.textContent=`${Math.round(ship.hull/DEMO_CLASSES[ship.type].hull*100)} %`;}
  text('battle-pause',paused?'▶':'Ⅱ');$('battle-pause').setAttribute('aria-label',paused?'Gefechtszeit fortsetzen':'Gefechtszeit pausieren');$('battle-pause').disabled=battle.phase!=='engaged';
  if($('contacts-dialog').open)contacts.paint();
  if($('graphics-dialog').open&&view){const median=frames.length?[...frames].sort((a,b)=>a-b)[Math.floor(frames.length/2)]:0;const state=paused?'Pausiert':battle.phase!=='engaged'?'Gefechtsende':median?`${Math.round(1/median)} Bilder/s`:'Messung läuft';text('performance-readout',`${state} · ${view.graphics==='auto'?'Automatische Auflösung':view.graphics==='detail'?'Mehr Details':'Flüssiger'}`);for(const node of document.querySelectorAll('[data-graphics]'))pressed(node,node.dataset.graphics===view.graphics);}
}
function labels(){
  const overview=view.mode==='overview',fleet=view.mode==='fleet';
  const list=overview?['fleet:friendly','fleet:enemy']:fleet?battle.ships.filter(s=>s.side==='friendly'&&activeShip(s)).map(s=>s.id):[view.mode==='target'?'fleet:friendly':'fleet:enemy'];
  const visible=new Set();
  for(const id of list){
    const p=view.labelPosition(id,battle);if(!p)continue;visible.add(id);let node=markers.get(id);
    if(!node){node=document.createElement('button');node.dataset.marker=id;node.append(document.createElement('span'),document.createElement('small'));$('ship-labels').append(node);markers.set(id,node);}
    const ship=battle.ships.find(s=>s.id===id),side=ship?.side??id.split(':')[1];node.hidden=false;node.className=`lab-marker ${side==='enemy'?'enemy':''}`;
    node.firstElementChild.textContent=`${p.offscreen?p.arrow+' ':''}${ship?.name??(side==='friendly'?'EIGENE FLOTTE':'GEGNER')}`;
    const living=battle.ships.filter(s=>s.side===side&&activeShip(s));
    node.lastElementChild.textContent=overview?`${living.length} Schiffe · H ${Math.round(living.reduce((n,s)=>n+s.hull/DEMO_CLASSES[s.type].hull,0)/Math.max(1,living.length)*100)} %`:fleet?'':`${number.format(fleetDistanceKm(battle))} km`;
    const margin=overview?85:67;node.style.left=`${Math.max(margin,Math.min(innerWidth-margin,p.x))}px`;node.style.top=`${Math.max(view.viewportTop+50,Math.min(view.viewportBottom-35,p.y))}px`;
  }
  for(const[id,node]of markers)if(!visible.has(id))node.hidden=true;
}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.close){$(button.dataset.close).close();return;}
  if(['restart','retry'].includes(button.id)){void start();return;}
  if(!ready)return;
  if(button.dataset.ship){selectContact(button.dataset.ship);return;}
  if(button.dataset.marker){if(button.dataset.marker==='fleet:friendly')setCamera('fleet');else if(button.dataset.marker==='fleet:enemy')setCamera('target');else{selectContact(button.dataset.marker);setCamera('ship');}}
  else if(button.dataset.camera)setCamera(button.dataset.camera);
  else if(button.dataset.scope)commandDemo(battle,'scope',button.dataset.scope);
  else if(button.dataset.graphics)view.setGraphics(button.dataset.graphics);
  else if(button.id==='battle-pause'){paused=!paused;lastFrame=0;}
  else if(button.id==='own-picker')$('own-dialog').showModal();
  else if(button.id==='graphics-open')$('graphics-dialog').showModal();
  else if(button.id==='target-picker')contacts.open();
  else if(button.id==='target-view')setCamera(view.mode==='target'?'ship':'target');
  else if(button.id==='attack-target'&&commandDemo(battle,'attack'))notice(`${battle.scope==='fleet'?'Flotte':battle.ships.find(s=>s.id===battle.selected).name} greift ${battle.ships.find(s=>s.id===battle.target).name} an.`);
  else if(button.id==='auto-target'&&commandDemo(battle,'auto'))notice('Automatische Zielwahl aktiv.');
  else if(button.id==='retreat'&&commandDemo(battle,'retreat'))notice('Rückzug unter Deckungsfeuer.');
  paint();lastRender=0;
});
for(const event of ['pointerdown','pointerup','touchend','click','keydown'])document.addEventListener(event,()=>{void audio.unlock();sound.unlock();},{capture:true,passive:true});
document.addEventListener('visibilitychange',()=>{audio.setHidden(document.hidden);sound.hidden(document.hidden);lastFrame=0;if(document.hidden){paused=true;if(battle)paint();}});
window.addEventListener('pagehide',event=>{paused=true;sound.hidden(true);audio.setHidden(true);if(!event.persisted||!ready){++generation;ready=false;view?.dispose();sound.dispose();}});
window.addEventListener('pageshow',()=>{audio.setHidden(document.hidden);lastFrame=0;if(view?.disposed)void start();else viewport();});
new ResizeObserver(()=>{if(view){viewport();if(ready)setCamera(view.mode,false);}}).observe($('battle-app'));
function frame(now){
  const raw=lastFrame?Math.max(0,(now-lastFrame)/1000):0,seconds=Math.min(.1,raw);lastFrame=now;
  if(ready&&!document.hidden){
    const running=!paused&&battle.phase==='engaged';if(running&&raw>0&&raw<1){frames.push(raw);if(frames.length>180)frames.shift();}
    const events=running?advanceDemoBattle(battle,seconds/3):[];pending.push(...events);if(!paused)visualTime+=seconds;
    if(view.graphics==='auto')view.observeQuality(raw,running);
    if(running||!paused&&view.animating||view.transition||view.dirty||!lastRender||pending.length){view.render(battle,visualTime,pending,paused?0:Math.min(.1,(now-(lastRender||now))/1000));pending.length=0;lastRender=now;labels();}
    if(events.length){sound.play(events,battle,view.mode==='target'?battle.target:battle.selected);if(events.some(e=>e.kind==='order-complete'))notice('Angriffsziel zerstört · Zielwahl wieder automatisch.');if(battle.phase!=='engaged')notice(({victory:'Gegnerische Flotte ausgeschaltet.',defeat:'Eigene Flotte verloren.',withdrawn:'Rückzug abgeschlossen.'})[battle.phase]);}
    if(now-lastHud>200){paint();lastHud=now;}
  }
  requestAnimationFrame(frame);
}
void start();requestAnimationFrame(frame);
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
if(new URLSearchParams(location.search).has('debug'))globalThis.ORBIT_HARBINGER_DEBUG={get battle(){return battle;},get view(){return view;},get ready(){return ready;},get paused(){return paused;},get frameDurations(){return [...frames];},setCamera,selectContact,paint,start};
