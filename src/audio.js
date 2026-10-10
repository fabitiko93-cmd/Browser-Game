import { MUSIC_CHORDS, frequency, renderSpaceScore, spaceReverb, synthTone, synthNoise, noiseBuffer } from './audio-score.js';
export { MUSIC_CHORDS, frequency };
export const SOUND_CUES = ['confirm','error','build','research','ship','delivery','colony','attack','warning','message'];
export const AUDIO_DEFAULTS = {music:true,effects:true,musicVolume:.35,effectsVolume:.5};
export function audioPreferences(value) {
 const result={...AUDIO_DEFAULTS};
 for(const k of ['music','effects'])if(typeof value?.[k]==='boolean')result[k]=value[k];
 for(const k of ['musicVolume','effectsVolume'])if(Number.isFinite(value?.[k]))result[k]=Math.max(0,Math.min(1,value[k]));
 return result;
}
const KEY='orbit3077-audio';
export class SpaceAudio {
 constructor({storage=globalThis.localStorage,Context=globalThis.AudioContext??globalThis.webkitAudioContext,timer=globalThis.setInterval,clear=globalThis.clearInterval,renderScore=renderSpaceScore}={}) {
  this.storage=storage;this.Context=Context;this.timer=timer;this.clear=clear;this.renderScore=renderScore;
  this.ctx=null;this.interval=null;this.nodes=new Set();this.effects=new Set();this.hidden=false;this.unlocked=false;this.activated=false;
  this.scoreBuffer=null;this.scoreTask=null;this.scoreSource=null;this.scoreOffset=0;this.scoreStart=0;this.resumeTask=null;
  this.nextPad=0;this.nextArp=0;this.bar=0;this.arp=0;this.lastCue=-100;this.cueTimes=new Map();
  try{this.settings=audioPreferences(JSON.parse(storage?.getItem(KEY)??'null'));}catch{this.settings={...AUDIO_DEFAULTS};}
 }
 unlock() {this.activated=true;return this.resume(true);}
 recover() {return this.activated?this.resume():Promise.resolve(false);}
 resume(gesture=false) {
  if(!this.Context||this.hidden||(!this.settings.music&&!this.settings.effects))return Promise.resolve(false);
  if(!gesture&&this.resumeTask)return this.resumeTask;
  try{
   if(!this.ctx||this.ctx.state==='closed'){this.stopMusic();this.stopEffects();this.initialize();}
   const c=this.ctx;
   if(c.state==='running'){this.unlocked=true;this.sync();return Promise.resolve(true);}
   // Call resume within the gesture, before awaiting score rendering or any other work.
   const resumed=c.resume(),task=Promise.resolve(resumed).then(()=>{
    if(this.ctx!==c||this.hidden)return false;this.unlocked=c.state==='running';
    if(this.unlocked)this.sync();return this.unlocked;
   }).catch(()=>false).finally(()=>{if(this.resumeTask===task)this.resumeTask=null;});
   this.resumeTask=task;return task;
  }catch{return Promise.resolve(false);}
 }
 initialize() {
  this.ctx=new this.Context();const c=this.ctx;this.lastCue=-100;this.cueTimes.clear();
  this.music=c.createGain();this.music.gain.value=0;this.sfx=c.createGain();this.sfx.gain.value=0;this.master=c.createDynamicsCompressor();
  this.liveMusic=c.createGain();this.liveMusic.connect(this.music);this.scoreGain=c.createGain();this.scoreGain.connect(this.music);
  this.master.threshold.value=-16;this.master.knee.value=18;this.master.ratio.value=3;this.master.attack.value=.01;this.master.release.value=.3;
  this.music.connect(this.master);this.sfx.connect(this.master);this.master.connect(c.destination);
  this.reverb=spaceReverb(c,2.2);this.wet=c.createGain();this.wet.gain.value=.16;this.reverb.connect(this.wet);this.wet.connect(this.master);
  this.sfx.connect(this.reverb);this.noise=noiseBuffer(c);
  c.onstatechange=()=>{
   if(this.ctx!==c)return;this.unlocked=this.activated&&!this.hidden&&c.state==='running';
   if(this.unlocked)this.sync();else if(c.state==='closed'){this.resumeTask=null;this.stopMusic();this.stopEffects();}
  };
 }
 prepareScore() {
  if(this.scoreTask)return;
  this.scoreTask=Promise.resolve().then(()=>this.renderScore()).then(buffer=>{
   if(buffer){this.scoreBuffer=buffer;this.sync();}
  }).catch(()=>{}); // The continuous live score remains available if rendering fails.
 }
 update(key,value) {
  if(!Object.hasOwn(AUDIO_DEFAULTS,key))return;
  this.settings=audioPreferences({...this.settings,[key]:value});
  try{this.storage?.setItem(KEY,JSON.stringify(this.settings));}catch{}
  this.sync();
 }
 sync() {
  if(!this.ctx)return;const c=this.ctx,now=c.currentTime;
  this.music.gain.setTargetAtTime(this.settings.music&&!this.hidden?this.settings.musicVolume*.8:0,now,.25);
  this.sfx.gain.setTargetAtTime(this.settings.effects&&!this.hidden?this.settings.effectsVolume*.65:0,now,.03);
  this.wet.gain.setTargetAtTime(this.settings.effects&&!this.hidden?.16:0,now,.03);
  if(this.settings.music&&this.unlocked&&!this.hidden&&c.state==='running'){
   this.prepareScore();
   if(this.scoreBuffer&&!this.scoreSource){
    const source=c.createBufferSource();source.buffer=this.scoreBuffer;source.loop=true;source.loopStart=0;source.loopEnd=this.scoreBuffer.duration;
    source.connect(this.scoreGain);source.onended=()=>source.disconnect();
    this.scoreGain.gain.setValueAtTime(0,now);this.scoreGain.gain.linearRampToValueAtTime(1,now+1.2);this.liveMusic.gain.setTargetAtTime(0,now,.2);
    this.scoreStart=now;source.start(now,this.scoreOffset%this.scoreBuffer.duration);this.scoreSource=source;
    // Only the initial fallback fades out; score playback never depends on a timer.
    for(const node of this.nodes)try{node.stop(now+1.3);}catch{}
   }
   if(this.interval===null){
    this.nextPad=now+.05;this.nextArp=now+.3;if(!this.scoreSource)this.schedule();
    this.interval=this.timer(()=>{if(this.hidden)return;if(c.state==='running'){if(!this.scoreSource)this.schedule();}else void this.recover();},500);
   }
  }else if(!this.settings.music||this.hidden)this.stopMusic();
 }
 tone(midi,time,duration,volume,bus,options={}) {
  const set=options.music?this.nodes:this.effects;
  const node=synthTone(this.ctx,bus,midi,time,duration,volume,{...options,ended:n=>set.delete(n)});set.add(node);return node;
 }
 whoosh(time,duration,volume,options={}) {
  const node=synthNoise(this.ctx,this.sfx,this.noise,time,duration,volume,{...options,ended:n=>this.effects.delete(n)});this.effects.add(node);return node;
 }
 schedule() {
  if(!this.ctx||this.ctx.state!=='running'||this.hidden||!this.settings.music||this.scoreSource)return;const now=this.ctx.currentTime;
  if(this.nextPad<now-.5)this.nextPad=now+.05;if(this.nextArp<now-.5)this.nextArp=now+.1;
  while(this.nextPad<now+1.5){
   const chord=MUSIC_CHORDS[this.bar%MUSIC_CHORDS.length];
   chord.forEach((note,i)=>this.tone(note,this.nextPad,18,.1,this.liveMusic,{type:i?'triangle':'sine',detune:i%2?4:-4,attack:3,release:4,pan:(i-1.5)*.3,cutoff:650+i*180,music:true}));
   this.bar++;this.nextPad+=15;
  }
  while(this.nextArp<now+1.5){
   const chord=MUSIC_CHORDS[Math.max(0,this.bar-1)%MUSIC_CHORDS.length],index=[0,2,1,3,2,1,3,0][this.arp%8];
   if(this.arp%3!==1)this.tone(chord[index]+12,this.nextArp,2,.035,this.liveMusic,{type:'triangle',pan:Math.sin(this.arp)*.5,cutoff:2100,music:true});
   this.arp++;this.nextArp+=1.875;
  }
 }
 play(cue) {
  if(!SOUND_CUES.includes(cue)||!this.unlocked||this.hidden||!this.settings.effects||this.ctx?.state!=='running')return;
  try{
   const now=this.ctx.currentTime,cooldown={warning:8,attack:2,delivery:2,message:2,ship:1}[cue]??.15;
   if(now-this.lastCue<.09||now-(this.cueTimes.get(cue)??-100)<cooldown)return;this.lastCue=now;this.cueTimes.set(cue,now);
   const note=(midi,offset,duration,volume,options)=>this.tone(midi,now+offset,duration,volume,this.sfx,options);
   if(cue==='confirm')note(76,0,.1,.12,{cutoff:2000});
   if(cue==='error'||cue==='warning')for(const[i,midi]of(cue==='error'?[49,45]:[69,69]).entries())note(midi,i*.18,.3,.12,{type:'triangle',cutoff:1400});
   if(cue==='build'){this.whoosh(now,.4,.1,{cutoff:850,endCutoff:250});note(60,.07,.35,.12);note(67,.17,.55,.1);}
   if(cue==='research')for(const[i,midi]of[72,79,83,88].entries())note(midi,i*.095,.85,.105,{attack:.015,release:.8,pan:(i-1.5)*.2,cutoff:3000});
   if(cue==='ship'){this.whoosh(now,.9,.13,{attack:.12,cutoff:220,endCutoff:2200});note(40,0,.8,.15,{type:'triangle',endMidi:64,cutoff:900});note(67,.68,.4,.09);}
   if(cue==='delivery'){this.whoosh(now,.16,.09,{cutoff:1200});for(const[i,midi]of[79,72,67].entries())note(midi,.05+i*.1,.3,.1);}
   if(cue==='colony')for(const[i,midi]of[60,64,67,74].entries())note(midi,i*.08,1.8,.095,{attack:.2,release:1.4,pan:(i-1.5)*.3});
   if(cue==='attack'){this.whoosh(now,.65,.28,{cutoff:1200,endCutoff:120});note(48,0,.7,.22,{type:'triangle',endMidi:28,cutoff:850});note(43,.15,.65,.16,{type:'triangle',endMidi:26,cutoff:700});}
   if(cue==='message'){note(81,0,.18,.08);note(74,.13,.3,.09);}
  }catch{}
 }
 notify(entries) {
  const cues=entries.map(e=>e.sound??({war:'attack',warning:'warning',communication:'message'}[e.type]));
  const cue=['attack','warning','research','colony','ship','build','delivery','message'].find(c=>cues.includes(c));if(cue)this.play(cue);
 }
 stopMusic() {
  if(this.interval!==null){this.clear(this.interval);this.interval=null;}
  if(this.scoreSource){
   this.scoreOffset=(this.scoreOffset+Math.max(0,this.ctx.currentTime-this.scoreStart))%this.scoreBuffer.duration;
   try{this.scoreSource.stop();}catch{}this.scoreSource=null;
  }
  for(const node of this.nodes)try{node.stop();}catch{}this.nodes.clear();
 }
 stopEffects() {for(const node of this.effects)try{node.stop();}catch{}this.effects.clear();}
 setHidden(hidden) {
  this.hidden=hidden;
  if(hidden){
   this.resumeTask=null;this.stopMusic();this.stopEffects();this.unlocked=false;const c=this.ctx;
   try{Promise.resolve(c?.suspend()).then(()=>{if(c===this.ctx&&!this.hidden)void this.recover();}).catch(()=>{});}catch{}
  }else void this.recover();
 }
}
export function audioPanel(settings) {
 return `<div class="section-title">Klangraum</div><p class="lede">„Transit 3077“ · Space-Ambient mit Synth-Flächen, Melodien und sanften Rhythmen. Läuft auch bei pausiertem Spiel und setzt nach Appwechseln fort.</p>${[['music','Hintergrundmusik','musicVolume'],['effects','Aktionssounds','effectsVolume']].map(([id,label,volume])=>`<label class="check-label"><input type="checkbox" data-field="audio-${id}" ${settings[id]?'checked':''}>${label}</label><div class="range-row"><input type="range" min="0" max="100" value="${Math.round(settings[volume]*100)}" data-field="audio-${volume}" aria-label="${label}: Lautstärke"><output>${Math.round(settings[volume]*100)} %</output></div>`).join('')}<button class="button secondary" data-action="audio-test">Aktionssound testen</button>`;
}
