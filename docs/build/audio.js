// Original procedural score: slow minor/add9 pads, a sparse arpeggio and soft sub pulses.
// No downloads or external audio services. Audio is unlocked by a user gesture.
export const SOUND_CUES = ['confirm','error','build','research','ship','delivery','colony','attack','warning'];
export const AUDIO_DEFAULTS = {music:true,effects:true,musicVolume:.35,effectsVolume:.5};
export const MUSIC_CHORDS = [[45,52,59,64],[41,48,55,60],[48,55,62,67],[43,50,57,62],[45,52,60,67],[40,47,54,59]];
export const frequency = midi => 440 * 2 ** ((midi-69)/12);
export function audioPreferences(value) {
 const result={...AUDIO_DEFAULTS};
 for(const k of ['music','effects'])if(typeof value?.[k]==='boolean')result[k]=value[k];
 for(const k of ['musicVolume','effectsVolume'])if(Number.isFinite(value?.[k]))result[k]=Math.max(0,Math.min(1,value[k]));
 return result;
}
const KEY='orbit3077-audio';
export class SpaceAudio {
 constructor({storage=globalThis.localStorage,Context=globalThis.AudioContext??globalThis.webkitAudioContext,timer=globalThis.setInterval,clear=globalThis.clearInterval}={}) {
  this.storage=storage;this.Context=Context;this.timer=timer;this.clear=clear;this.ctx=null;this.interval=null;this.nodes=new Set();this.hidden=false;this.unlocked=false;this.nextPad=0;this.nextArp=0;this.bar=0;this.arp=0;this.lastCue=-100;
  try{this.settings=audioPreferences(JSON.parse(storage?.getItem(KEY)??'null'));}catch{this.settings={...AUDIO_DEFAULTS};}
 }
 async unlock() {
  if(!this.Context||this.hidden||(!this.settings.music&&!this.settings.effects))return false;
  try{
   if(!this.ctx||this.ctx.state==='closed'){this.stopMusic();this.initialize();}
   await this.ctx.resume();this.unlocked=this.ctx.state==='running';
   if(this.unlocked)this.sync();return this.unlocked;
  }catch{return false;}
 }
 initialize() {
  this.ctx=new this.Context();const c=this.ctx;
  this.music=c.createGain();this.music.gain.value=0;this.sfx=c.createGain();this.sfx.gain.value=0;this.master=c.createDynamicsCompressor();
  this.master.threshold.value=-16;this.master.knee.value=18;this.master.ratio.value=3;this.master.attack.value=.01;this.master.release.value=.3;
  this.music.connect(this.master);this.sfx.connect(this.master);this.master.connect(c.destination);
  this.reverb=c.createConvolver();const impulse=c.createBuffer(2,Math.floor(c.sampleRate*2.8),c.sampleRate);
  for(let channel=0;channel<2;channel++){const data=impulse.getChannelData(channel);let seed=3077+channel;for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=(seed/2147483647*2-1)*Math.pow(1-i/data.length,3);}}
  this.reverb.buffer=impulse;this.wet=c.createGain();this.wet.gain.value=.24;this.reverb.connect(this.wet);this.wet.connect(this.master);
  this.music.connect(this.reverb);this.sfxSend=c.createGain();this.sfxSend.gain.value=.12;this.sfx.connect(this.sfxSend);this.sfxSend.connect(this.reverb);
 }
 update(key,value) {
  if(!Object.hasOwn(AUDIO_DEFAULTS,key))return;
  this.settings=audioPreferences({...this.settings,[key]:value});
  try{this.storage?.setItem(KEY,JSON.stringify(this.settings));}catch{}
  this.sync();
 }
 sync() {
  if(!this.ctx)return;const now=this.ctx.currentTime;
  this.music.gain.setTargetAtTime(this.settings.music?this.settings.musicVolume*.8:0,now,.15);
  this.sfx.gain.setTargetAtTime(this.settings.effects?this.settings.effectsVolume*.55:0,now,.03);
  if(this.settings.music&&this.unlocked&&!this.hidden&&this.ctx.state==='running') {
   if(this.interval===null){this.nextPad=now+.05;this.nextArp=now+.3;this.schedule();this.interval=this.timer(()=>this.schedule(),250);}
  }else this.stopMusic();
 }
 tone(midi,time,duration,volume,bus,{type='sine',detune=0,attack=.02,pan=0,cutoff=1600,music=false}={}) {
  const c=this.ctx,osc=c.createOscillator(),gain=c.createGain(),filter=c.createBiquadFilter();
  osc.type=type;osc.frequency.value=frequency(midi);osc.detune.value=detune;filter.type='lowpass';filter.frequency.value=cutoff;
  gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume,time+Math.min(attack,duration*.4));gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
  osc.connect(filter);filter.connect(gain);
  let panner=null;if(c.createStereoPanner){panner=c.createStereoPanner();panner.pan.value=pan;gain.connect(panner);panner.connect(bus);}else gain.connect(bus);
  if(music)this.nodes.add(osc);
  osc.onended=()=>{this.nodes.delete(osc);osc.disconnect();filter.disconnect();gain.disconnect();panner?.disconnect();};
  osc.start(time);osc.stop(time+duration+.05);return osc;
 }
 schedule() {
  if(!this.ctx||this.ctx.state!=='running'||this.hidden)return;const now=this.ctx.currentTime;
  // Recover cleanly from a foreground scheduling stall without playing a backlog.
  if(this.nextPad<now-.5)this.nextPad=now+.05;if(this.nextArp<now-.5)this.nextArp=now+.1;
  while(this.nextPad<now+.8) {
   const chord=MUSIC_CHORDS[this.bar%MUSIC_CHORDS.length];
   chord.forEach((note,i)=>this.tone(note,this.nextPad,17,.15,this.music,{type:i===0?'sine':'triangle',detune:i%2?4:-4,attack:4,pan:(i-1.5)*.3,cutoff:650+i*180,music:true}));
   this.bar++;this.nextPad+=12;
  }
  while(this.nextArp<now+.8) {
   const chord=MUSIC_CHORDS[Math.max(0,this.bar-1)%MUSIC_CHORDS.length],index=[0,2,1,3,2,1,3,0][this.arp%8];
   if(this.arp%3!==1)this.tone(chord[index]+12,this.nextArp,2.5,.09,this.music,{pan:Math.sin(this.arp)*.5,cutoff:2100,music:true});
   if(this.arp%4===0)this.tone(chord[0]-12,this.nextArp,1.8,.12,this.music,{cutoff:160,music:true});
   this.arp++;this.nextArp+=1.5;
  }
 }
 play(cue) {
  if(!SOUND_CUES.includes(cue)||!this.unlocked||this.hidden||!this.settings.effects||this.ctx?.state!=='running')return;
  try{
   const now=this.ctx.currentTime;if(now-this.lastCue<.09)return;this.lastCue=now;
   const patterns={confirm:[72],error:[49,45],build:[60,67,72],research:[72,76,83,88],ship:[48,60,67],delivery:[67,72,79],colony:[60,64,67,74],attack:[36,33,29],warning:[69,69]};
   patterns[cue].forEach((midi,i)=>this.tone(midi,now+i*.12,cue==='attack'?.65:.32,cue==='attack'?.2:.15,this.sfx,{type:cue==='attack'?'triangle':'sine',cutoff:cue==='attack'?250:2400}));
  }catch{}
 }
 notify(entries) {
  if(!entries.length)return;
  const priority=entries.find(e=>e.sound==='attack'||e.type==='war'||e.type==='warning');
  const completion=entries.find(e=>e.sound);
  this.play(priority?(priority.sound??'warning'):completion?.sound??'confirm');
 }
 stopMusic() {
  if(this.interval!==null){this.clear(this.interval);this.interval=null;}
  for(const node of this.nodes)try{node.stop();}catch{}this.nodes.clear();
 }
 setHidden(hidden) {
  this.hidden=hidden;if(hidden){this.stopMusic();this.unlocked=false;try{this.ctx?.suspend()?.catch(()=>{});}catch{}}
  // Returning to the page requires the next tap to resume; never autoplay on visibility.
 }
}
export function audioPanel(settings) {
 return `<div class="section-title">Klangraum</div><p class="lede">Space-Ambient mit langsamen Synth-Flächen, schwebenden Arpeggios und tiefen Pulsen. Musik läuft unabhängig von der Spielgeschwindigkeit und pausiert im Hintergrund.</p>${[['music','Hintergrundmusik','musicVolume'],['effects','Aktionssounds','effectsVolume']].map(([id,label,volume])=>`<label class="check-label"><input type="checkbox" data-field="audio-${id}" ${settings[id]?'checked':''}>${label}</label><div class="range-row"><input type="range" min="0" max="100" value="${Math.round(settings[volume]*100)}" data-field="audio-${volume}" aria-label="${label}: Lautstärke"><output>${Math.round(settings[volume]*100)} %</output></div>`).join('')}<button class="button secondary" data-action="audio-test">Aktionssound testen</button>`;
}
