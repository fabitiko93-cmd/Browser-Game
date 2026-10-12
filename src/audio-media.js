import { AUDIO_DEFAULTS, SOUND_CUES, audioPreferences } from './audio.js';

const KEY='orbit3077-audio';
export const audioAsset = name => new URL(`../audio/${name}.mp3`,import.meta.url).href;

// Media elements play the same score and cues without an AudioContext or an offline render.
export class MediaAudio {
 constructor({storage=globalThis.localStorage,Audio=globalThis.Audio,document=globalThis.document,
  session=globalThis.navigator?.audioSession,onChange=()=>{},clock=()=>performance.now(),
  timer=(...args)=>globalThis.setInterval(...args),clear=id=>globalThis.clearInterval(id),
  delay=(...args)=>globalThis.setTimeout(...args),cancel=id=>globalThis.clearTimeout(id),wait=8000}={}) {
  Object.assign(this,{storage,Audio,document,session,onChange,clock,timer,clear,delay,cancel,wait});
  this.hidden=false;this.activated=false;this.music=null;this.effects=new Map();this.interval=null;
  this.lastCue=-10000;this.cueTimes=new Map();this.detail='';this.lastProgress=0;this.lastPosition=0;this.musicOffset=0;
  try{this.settings=audioPreferences(JSON.parse(storage?.getItem(KEY)??'null'));}catch{this.settings={...AUDIO_DEFAULTS};}
 }
 get wantsMusic(){return this.settings.music&&this.settings.musicVolume>0;}
 get wantsEffects(){return this.settings.effects&&this.settings.effectsVolume>0;}
 get status(){
  if(!this.Audio)return 'unsupported';
  if(!this.wantsMusic&&!this.wantsEffects)return 'muted';
  if(this.hidden)return 'background';
  if(!this.activated)return 'waiting';
  const channels=this.wantsMusic?[this.music]:[...this.effects.values()];
  if(channels.some(c=>(c?.state==='playing'&&!c.media.paused)||(!this.wantsMusic&&c?.primed)))return 'ready';
  if(channels.some(c=>c?.state==='failed'))return 'failed';
  if(channels.some(c=>c?.state==='starting'))return 'loading';
  return 'blocked';
 }
 changed(){this.onChange(this.status,this.detail);}
 channel(name,loop=false){
  const media=new this.Audio(audioAsset(name));
  media.loop=loop;media.preload='auto';media.playsInline=true;media.hidden=true;
  const c={media,state:'idle',primed:false,live:true,attempt:0,task:null,timer:null,cancelStart:null};
  if(media.nodeType===1)this.document?.body?.appendChild(media);
  media.addEventListener?.('error',()=>{
   if(!c.live)return;c.state='failed';c.primed=false;
   this.detail='Die Audiodatei konnte nicht geladen werden. Prüfe die Verbindung und lade das Spiel neu.';this.changed();
  });
  media.addEventListener?.('ended',()=>{if(c.live&&!loop){c.state='idle';this.changed();}});
  return c;
 }
 initialize(){
  if(this.music)return;
  try{
   this.music=this.channel('transit-3077',true);
   for(const cue of SOUND_CUES)this.effects.set(cue,this.channel(cue));
  }catch(error){
   for(const c of [this.music,...this.effects.values()])if(c){c.live=false;this.pause(c);c.media.remove?.();}
   this.music=null;this.effects.clear();throw error;
  }
 }
 playChannel(c,{prime=false,rewind=false}={}){
  const attempt=++c.attempt;let task;
  c.cancelStart?.();c.cancelStart=null;
  if(c.timer!==null){this.cancel(c.timer);c.timer=null;}
  try{
   if(rewind)c.media.currentTime=0;
   c.media.muted=prime;c.media.volume=prime?0:c===this.music?this.settings.musicVolume*.8:this.settings.effectsVolume;
   c.state='starting';
   // play() is called synchronously in the input handler, without waiting for anything else.
   const played=c.media.play();
   const native=Promise.resolve(played).then(()=>{
    if(!c.live||c.attempt!==attempt)return false;
    if(this.hidden){c.media.pause();c.state='idle';return false;}
    c.primed=true;
    if(prime){c.media.pause();c.media.currentTime=0;c.media.volume=this.settings.effectsVolume;c.state='idle';}
    else c.state='playing';
    if(c===this.music){
     if(this.musicOffset>0){try{c.media.currentTime=this.musicOffset;}catch{}this.musicOffset=0;}
     this.lastPosition=c.media.currentTime;this.lastProgress=this.clock();
    }
    if(c===this.music||!this.wantsMusic)this.detail='';this.changed();return true;
   }).catch(error=>{
    if(c.live&&c.attempt===attempt){
     c.state=error?.name==='NotSupportedError'?'failed':'blocked';
     this.detail=error?.name==='NotSupportedError'?'Der Browser kann die Audiodatei nicht abspielen.':'Der Browser hat den Tonstart nicht freigegeben. Nutze den direkten Audiotest unten.';
     this.changed();
    }
    return false;
   });
   const timeout=new Promise(resolve=>{c.cancelStart=()=>{resolve(false);};c.timer=this.delay(()=>{
    if(c.live&&c.attempt===attempt&&c.state==='starting'){
     c.state='blocked';this.detail='Der Tonstart antwortet nicht. Nutze den direkten Audiotest unten.';this.changed();
    }
    resolve(false);
   },this.wait);});
   task=Promise.race([native,timeout]).finally(()=>{
    if(c.attempt===attempt){if(c.timer!==null)this.cancel(c.timer);c.timer=null;c.cancelStart=null;if(c.task===task)c.task=null;}
   });
   c.task=task;return task;
  }catch(error){
   c.state='failed';this.detail='Die Audioausgabe konnte nicht gestartet werden. Nutze den direkten Audiotest unten.';this.changed();return Promise.resolve(false);
  }
 }
 unlock(){
  this.activated=true;if(this.document)this.hidden=Boolean(this.document.hidden);
  return this.resume(true);
 }
 recover(){return this.activated?this.resume():Promise.resolve(false);}
 resume(gesture=false){
  if(!this.Audio||this.hidden||(!this.wantsMusic&&!this.wantsEffects)){this.changed();return Promise.resolve(false);}
  try{
   try{if(this.session&&this.session.type!=='playback')this.session.type='playback';}catch{}
   this.initialize();this.sync();const tasks=[];
   if(this.wantsMusic&&(this.music.state!=='playing'||this.music.media.paused))tasks.push(!gesture&&this.music.task?this.music.task:this.playChannel(this.music));
   if(this.wantsEffects)for(const c of this.effects.values())if(!c.primed)tasks.push(!gesture&&c.task?c.task:this.playChannel(c,{prime:true}));
   this.watch();this.changed();
   return tasks.length?Promise.all(tasks).then(()=>this.status==='ready'):Promise.resolve(this.status==='ready');
  }catch{this.detail='Die Audioausgabe konnte nicht vorbereitet werden. Nutze den direkten Audiotest unten.';this.changed();return Promise.resolve(false);}
 }
 watch(){
  if(this.interval!==null)return;
  this.interval=this.timer(()=>{
   const c=this.music;if(this.hidden||!this.wantsMusic||c?.state!=='playing')return;
   if(c.media.currentTime!==this.lastPosition){this.lastPosition=c.media.currentTime;this.lastProgress=this.clock();}
   else if(this.clock()-this.lastProgress>4000){c.state='blocked';c.primed=false;this.detail='Die Wiedergabe steht still. Tippe auf „Ton neu starten“.';this.changed();}
  },500);
 }
 sync(){
  if(this.music){this.music.media.volume=this.settings.musicVolume*.8;if(!this.wantsMusic||this.hidden)this.pause(this.music);}
  for(const c of this.effects.values()){
   if(c.state!=='starting')c.media.volume=this.settings.effectsVolume;
   if(!this.wantsEffects||this.hidden)this.pause(c);
  }
  if(this.hidden||(!this.wantsMusic&&!this.wantsEffects)){if(this.interval!==null)this.clear(this.interval);this.interval=null;}
 }
 update(key,value){
  if(!Object.hasOwn(AUDIO_DEFAULTS,key))return;
  this.settings=audioPreferences({...this.settings,[key]:value});
  try{this.storage?.setItem(KEY,JSON.stringify(this.settings));}catch{}
  this.sync();this.changed();if(this.activated&&!this.hidden)void this.recover();
 }
 play(cue,{test=false}={}){
  if(!SOUND_CUES.includes(cue)||this.hidden||!this.activated||!this.wantsEffects)return Promise.resolve(false);
  const c=this.effects.get(cue);if(!c)return Promise.resolve(false);
  const now=this.clock(),cooldown=({warning:8,attack:2,delivery:2,message:2,ship:1}[cue]??.15)*1000;
  if(!test&&(now-this.lastCue<90||now-(this.cueTimes.get(cue)??-10000)<cooldown))return Promise.resolve(false);
  this.lastCue=now;this.cueTimes.set(cue,now);return this.playChannel(c,{rewind:true});
 }
 test(){void this.unlock();return this.play('research',{test:true});}
 notify(entries){
  const cues=entries.map(e=>e.sound??({war:'attack',warning:'warning',communication:'message'}[e.type]));
  const cue=['attack','warning','research','colony','ship','build','delivery','message'].find(c=>cues.includes(c));if(cue)void this.play(cue);
 }
 pause(c){
  ++c.attempt;c.cancelStart?.();c.cancelStart=null;if(c.timer!==null)this.cancel(c.timer);c.timer=null;c.task=null;
  try{c.media.pause();}catch{}c.state='idle';
 }
 setHidden(hidden){this.hidden=hidden;if(hidden){for(const c of this.effects.values())c.primed=false;this.sync();}else void this.recover();this.changed();}
 restart(){
  if(this.music)this.musicOffset=this.music.media.currentTime;
  if(this.interval!==null)this.clear(this.interval);this.interval=null;
  for(const c of [this.music,...this.effects.values()])if(c){
   c.live=false;this.pause(c);try{c.media.removeAttribute?.('src');c.media.load?.();c.media.remove?.();}catch{}
  }
  this.music=null;this.effects.clear();this.lastCue=-10000;this.cueTimes.clear();this.detail='';
  return this.unlock();
 }
}
