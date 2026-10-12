import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {MediaAudio,audioAsset} from '../src/audio-media.js';
import {SOUND_CUES,AUDIO_DEFAULTS,audioPanel} from '../src/audio.js';
import {mediaRange} from '../src/media-range.js';

class Media {
 static instances=[];
 constructor(src){this.src=src;this.currentTime=0;this.paused=true;this.volume=1;this.muted=false;this.events={};this.calls=[];Media.instances.push(this);}
 addEventListener(name,fn){this.events[name]=fn;}
 play(){this.calls.push({time:this.currentTime,muted:this.muted,volume:this.volume});if(this.failure)return Promise.reject(this.failure);if(this.hanging)return new Promise(()=>{});this.paused=false;return Promise.resolve();}
 pause(){this.paused=true;}load(){}remove(){this.removed=true;}removeAttribute(){}
}
const setup=(options={})=>{
 const jobs=new Map(),delays=new Map(),storage={value:null,getItem(){return this.value;},setItem(k,v){this.value=v;}};let next=0,now=0;
 const audio=new MediaAudio({Audio:Media,storage,clock:()=>now,
  timer:fn=>{jobs.set(++next,fn);return next;},clear:id=>jobs.delete(id),
  delay:fn=>{delays.set(++next,fn);return next;},cancel:id=>delays.delete(id),...options});
 return {audio,jobs,delays,storage,tick:time=>{now=time;for(const fn of jobs.values())fn();}};
};
test('native audio waits for a gesture, starts files in that gesture and primes effects silently',async()=>{
 const {audio,jobs}=setup();assert.equal(await audio.recover(),false);assert.equal(audio.music,null);
 const start=audio.unlock();assert.equal(audio.music.media.calls.length,1);assert.equal(audio.music.media.loop,true);
 for(const c of audio.effects.values())assert.equal(c.media.calls[0].muted,true);
 assert.equal(await start,true);assert.equal(audio.status,'ready');assert.equal(jobs.size,1);
 for(const c of audio.effects.values())assert.equal(c.media.paused,true);
 await audio.unlock();assert.equal(audio.music.media.calls.length,1);assert.equal(jobs.size,1);
});
test('default browser timers keep the Window receiver required by WebKit',async()=>{
 const names=['setInterval','clearInterval','setTimeout','clearTimeout'],original=Object.fromEntries(names.map(name=>[name,globalThis[name]]));
 try{
  for(const name of names)globalThis[name]=function(){assert.equal(this,globalThis,name);return 1;};
  const audio=new MediaAudio({Audio:Media,storage:null});assert.equal(await audio.unlock(),true);assert.equal(audio.status,'ready');
  audio.setHidden(true);assert.equal(audio.interval,null);
 }finally{for(const name of names)globalThis[name]=original[name];}
});
test('test cue plays directly without awaiting music startup and duplicate cues are throttled',async()=>{
 const {audio,tick}=setup();await audio.unlock();audio.music.media.hanging=true;audio.music.state='blocked';
 const c=audio.effects.get('research'),before=c.media.calls.length;const testing=audio.test();
 assert.equal(c.media.calls.length,before+1);assert.equal(c.media.calls.at(-1).muted,false);assert.equal(await testing,true);
 assert.equal(await audio.play('research'),false);tick(1000);assert.equal(await audio.play('research'),true);
 audio.setHidden(true);
});
test('backgrounding cancels every start and pauses all files; returning preserves music position',async()=>{
 const {audio,jobs,delays}=setup({document:{hidden:false}});await audio.unlock();audio.music.media.currentTime=33;
 audio.setHidden(true);assert.equal(audio.status,'background');assert.equal(jobs.size,0);assert.equal(delays.size,0);
 assert.ok([audio.music,...audio.effects.values()].every(c=>c.media.paused));
 audio.setHidden(false);assert.equal(await audio.recover(),true);assert.equal(audio.music.media.currentTime,33);assert.equal(jobs.size,1);
});
test('a blocked media play reports the failure and the next real gesture retries',async()=>{
 const {audio}=setup();audio.initialize();audio.music.media.failure=Object.assign(Error('Policy'),{name:'NotAllowedError'});
 assert.equal(await audio.unlock(),false);assert.equal(audio.status,'blocked');assert.match(audio.detail,/freigegeben/);
 audio.music.media.failure=null;assert.equal(await audio.unlock(),true);assert.equal(audio.status,'ready');assert.equal(audio.detail,'');
});
test('a hung native play is bounded, and cancellation does not leave the old recovery pending',async()=>{
 const {audio,delays}=setup();audio.initialize();audio.music.media.hanging=true;
 const old=audio.unlock();const retry=audio.unlock();assert.equal(await old,false);
 for(const fn of [...delays.values()])fn();assert.equal(await retry,false);assert.equal(audio.status,'blocked');assert.match(audio.detail,/antwortet nicht/);
 audio.music.media.hanging=false;assert.equal(await audio.unlock(),true);
});
test('native output restart reuses preferences and keeps the music position',async()=>{
 const {audio,jobs,storage}=setup();await audio.unlock();audio.update('musicVolume',.2);audio.update('effectsVolume',.7);
 audio.music.media.currentTime=42;const old=audio.music.media;await audio.restart();
 assert.notEqual(audio.music.media,old);assert.equal(old.paused,true);assert.equal(old.removed,true);
 assert.equal(audio.music.media.currentTime,42);assert.equal(audio.settings.effectsVolume,.7);assert.equal(JSON.parse(storage.value).musicVolume,.2);assert.equal(jobs.size,1);
});
test('turning off both outputs or setting both volumes to zero stops playback without undoing preferences',async()=>{
 const {audio,jobs}=setup();await audio.unlock();audio.update('musicVolume',0);audio.update('effectsVolume',0);
 assert.equal(audio.status,'muted');assert.equal(jobs.size,0);assert.equal(audio.music.media.paused,true);
 await audio.restart();assert.equal(audio.music,null);assert.equal(audio.status,'muted');
 audio.update('musicVolume',.35);assert.equal(await audio.unlock(),true);
 audio.update('music',false);audio.update('effects',false);assert.equal(audio.status,'muted');assert.equal(jobs.size,0);
});
test('a media clock that stops advancing is detected instead of reporting ready forever',async()=>{
 const {audio,tick}=setup();await audio.unlock();audio.music.media.currentTime=2;tick(1000);assert.equal(audio.status,'ready');
 tick(6000);assert.equal(audio.status,'blocked');assert.match(audio.detail,/steht still/);
});
test('a system pause is resumed by the next gesture even before the clock watchdog runs',async()=>{
 const {audio}=setup();await audio.unlock();const c=audio.music.media,before=c.calls.length;
 c.pause();assert.equal(audio.status,'blocked');assert.equal(await audio.unlock(),true);assert.equal(c.calls.length,before+1);assert.equal(c.paused,false);
});
test('missing or undecodable media is distinguishable from a gesture policy block',async()=>{
 const {audio}=setup();await audio.unlock();audio.music.media.events.error();assert.equal(audio.status,'failed');assert.match(audio.detail,/geladen/);
 audio.music.media.failure=Object.assign(Error('Decoder'),{name:'NotSupportedError'});assert.equal(await audio.unlock(),false);assert.equal(audio.status,'failed');
 const absent=new MediaAudio({Audio:null,storage:null});assert.equal(await absent.unlock(),false);assert.equal(absent.status,'unsupported');
});
test('all original score and cue files ship as MP3 and settings expose an independent native player',async()=>{
 for(const name of ['transit-3077',...SOUND_CUES]){
  const data=await readFile(new URL(`../web/audio/${name}.mp3`,import.meta.url));assert.ok(data.length>1000,name);assert.equal(data.subarray(0,3).toString(),'ID3');assert.ok(audioAsset(name).endsWith(`/audio/${name}.mp3`));
 }
 assert.match(audioPanel(AUDIO_DEFAULTS,'blocked'),/<audio controls preload="none"/);
});
test('cached Safari media ranges return exact binary slices, including suffix and open-ended ranges',async()=>{
 const bytes=new Uint8Array([0,255,128,65,2,7]);
 for(const [range,expected,contentRange]of [['bytes=0-1',[0,255],'bytes 0-1/6'],['bytes=2-',[128,65,2,7],'bytes 2-5/6'],['bytes=-2',[2,7],'bytes 4-5/6'],['bytes=4-99',[2,7],'bytes 4-5/6']]){
  const r=await mediaRange(new Request('https://game.test/audio/test.mp3',{headers:{Range:range}}),new Response(bytes,{headers:{'Content-Type':'audio/mpeg'}}));
  assert.equal(r.status,206);assert.equal(r.headers.get('Content-Range'),contentRange);assert.equal(r.headers.get('Content-Type'),'audio/mpeg');assert.deepEqual([...new Uint8Array(await r.arrayBuffer())],expected);
 }
});
test('invalid media ranges return 416 and ordinary requests or upstream partial responses stay intact',async()=>{
 for(const range of ['bytes=9-','bytes=3-1','bytes=-0','bytes=a-b','bytes=0-1,3-4']){
  const r=await mediaRange(new Request('https://game.test/',{headers:{Range:range}}),new Response(new Uint8Array(6)));
  assert.equal(r.status,416);assert.equal(r.headers.get('Content-Range'),'bytes */6');
 }
 const original=new Response('full');assert.equal(await mediaRange(new Request('https://game.test/'),original),original);
 const partial=new Response('slice',{status:206});assert.equal(await mediaRange(new Request('https://game.test/',{headers:{Range:'bytes=0-1'}}),partial),partial);
});
test('the generated classic worker uses the same range helper and binary assets are copied intact',async()=>{
 const worker=await readFile(new URL('../docs/sw.js',import.meta.url),'utf8');assert.match(worker,/importScripts\('\.\/media-range.js'\)/);assert.match(worker,/return mediaRange\(event.request/);
 const sandbox={Request,Response,Headers};vm.runInNewContext(await readFile(new URL('../docs/media-range.js',import.meta.url),'utf8'),sandbox);
 const r=await sandbox.mediaRange(new Request('https://game.test/',{headers:{Range:'bytes=0-1'}}),new Response(new Uint8Array([0,255,2])));assert.equal(r.status,206);
 for(const name of ['transit-3077',...SOUND_CUES])assert.deepEqual(await readFile(new URL(`../docs/audio/${name}.mp3`,import.meta.url)),await readFile(new URL(`../web/audio/${name}.mp3`,import.meta.url)));
});
