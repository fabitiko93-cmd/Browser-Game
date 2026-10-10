import test from 'node:test';
import assert from 'node:assert/strict';
import { SpaceAudio, SOUND_CUES, audioPreferences, AUDIO_DEFAULTS } from '../src/audio.js';
import { synthTone } from '../src/audio-score.js';
class Param {
 constructor(){this.value=0;this.events=[];}
 event(kind,v,t){assert.ok(Number.isFinite(v));assert.ok(Number.isFinite(t));this.events.push({kind,value:v,time:t});}
 setValueAtTime(v,t){this.event('set',v,t);}
 linearRampToValueAtTime(v,t){this.event('linear',v,t);}
 exponentialRampToValueAtTime(v,t){assert.ok(v>0);this.event('exponential',v,t);}
 setTargetAtTime(v,t){this.value=v;this.event('target',v,t);}
}
class Node {
 constructor(){for(const k of['gain','frequency','detune','pan','threshold','knee','ratio','attack','release'])this[k]=new Param();this.started=[];this.stopped=[];this.connections=[];}
 connect(node){this.connections.push(node);}disconnect(){this.disconnected=true;}start(...args){this.started.push(args);}stop(t){this.stopped.push(t);}
}
class Context {
 constructor(){this.state='suspended';this.currentTime=0;this.sampleRate=8000;this.destination={};this.osc=[];this.sources=[];this.gains=[];}
 transition(state){this.state=state;this.onstatechange?.();}
 resume(){this.transition('running');return Promise.resolve();}
 suspend(){this.transition('suspended');return Promise.resolve();}
 createGain(){const n=new Node();this.gains.push(n);return n;}
 createDynamicsCompressor(){return new Node();}createConvolver(){return new Node();}createBiquadFilter(){return new Node();}createStereoPanner(){return new Node();}
 createBuffer(channels,length,rate){const data=Array.from({length:channels},()=>new Float32Array(length));return {duration:length/rate,getChannelData:i=>data[i]};}
 createOscillator(){const n=new Node();this.osc.push(n);return n;}
 createBufferSource(){const n=new Node();this.sources.push(n);return n;}
}
const setup=(options={})=>{
 const storage={value:null,getItem(){return this.value;},setItem(k,v){this.value=v;}},jobs=new Map();let next=0;
 const audio=new SpaceAudio({storage,Context,timer:fn=>{const id=next++;jobs.set(id,fn);return id;},clear:id=>jobs.delete(id),renderScore:async()=>null,...options});
 return {audio,storage,jobs};
};
test('music waits for a gesture, uses one scheduler and respects separate persisted volume controls',async()=>{
 const {audio,jobs,storage}=setup();assert.equal(await audio.recover(),false);assert.equal(audio.ctx,null);assert.equal(jobs.size,0);
 assert.equal(await audio.unlock(),true);assert.equal(jobs.size,1);const oscillators=audio.ctx.osc.length;
 await audio.unlock();assert.equal(jobs.size,1);assert.equal(audio.ctx.osc.length,oscillators);
 audio.update('musicVolume',.2);audio.update('effectsVolume',.7);assert.equal(JSON.parse(storage.value).effectsVolume,.7);
 audio.update('music',false);assert.equal(jobs.size,0);assert.equal(audio.nodes.size,0);
 audio.play('research');assert.ok(audio.ctx.osc.length>oscillators);
 audio.update('effects',false);const count=audio.ctx.osc.length;audio.play('research');assert.equal(audio.ctx.osc.length,count);
});
test('backgrounding stops music and effects; foreground recovery resumes previously enabled audio',async()=>{
 const {audio,jobs}=setup();await audio.unlock();audio.play('ship');assert.ok(audio.effects.size);
 audio.setHidden(true);assert.equal(audio.ctx.state,'suspended');assert.equal(jobs.size,0);assert.equal(audio.effects.size,0);
 const count=audio.ctx.osc.length;audio.play('ship');assert.equal(audio.ctx.osc.length,count);
 audio.setHidden(false);await audio.recover();assert.equal(audio.ctx.state,'running');assert.equal(jobs.size,1);
 const before=new SpaceAudio({Context});before.setHidden(true);before.setHidden(false);assert.equal(before.ctx,null);
});
test('native score loops without timer ticks for many cycles and resumes at its paused position',async()=>{
 let renders=0;const {audio,jobs}=setup({renderScore:async()=>{renders++;return {duration:120};}});
 await audio.unlock();await audio.scoreTask;const source=audio.scoreSource;assert.ok(source);assert.equal(source.loop,true);assert.equal(source.loopEnd,120);
 assert.ok([...audio.nodes].every(n=>n.stopped.at(-1)===1.3));assert.equal(jobs.size,1);
 const count=audio.ctx.osc.length;audio.ctx.currentTime=120*12+43;audio.sync();for(const fn of jobs.values())fn();
 assert.equal(audio.scoreSource,source);assert.equal(audio.ctx.osc.length,count);assert.equal(renders,1);
 audio.setHidden(true);assert.equal(audio.scoreOffset,43);assert.equal(audio.scoreSource,null);
 audio.setHidden(false);await audio.recover();assert.notEqual(audio.scoreSource,source);assert.equal(audio.scoreSource.started[0][1],43);
 await audio.unlock();assert.equal(jobs.size,1);assert.equal(renders,1);
});
test('late score rendering cannot start muted or background music',async()=>{
 let finish;const {audio,jobs}=setup({renderScore:()=>new Promise(resolve=>{finish=resolve;})});
 await audio.unlock();audio.setHidden(true);finish({duration:120});await audio.scoreTask;
 assert.equal(audio.scoreSource,null);assert.equal(jobs.size,0);
 audio.update('music',false);audio.setHidden(false);await audio.recover();assert.equal(audio.scoreSource,null);
 audio.update('music',true);assert.ok(audio.scoreSource);assert.equal(jobs.size,1);
});
test('Safari interrupted state recovers once and reuses the existing loop',async()=>{
 const {audio,jobs}=setup({renderScore:async()=>({duration:120})});await audio.unlock();await audio.scoreTask;
 const source=audio.scoreSource;audio.ctx.transition('interrupted');assert.equal(audio.unlocked,false);
 for(const fn of jobs.values())fn();await audio.recover();
 assert.equal(audio.ctx.state,'running');assert.equal(audio.scoreSource,source);assert.equal(jobs.size,1);
});
test('failed automatic resume is retried by a gesture without duplicating music',async()=>{
 class RestrictedContext extends Context{resume(){if(this.blocked)return Promise.reject(Error('Gesture required'));return super.resume();}}
 const {audio,jobs}=setup({Context:RestrictedContext,renderScore:async()=>({duration:120})});await audio.unlock();await audio.scoreTask;
 audio.setHidden(true);audio.ctx.blocked=true;audio.setHidden(false);assert.equal(await audio.recover(),false);assert.equal(audio.scoreSource,null);
 audio.ctx.blocked=false;assert.equal(await audio.unlock(),true);assert.ok(audio.scoreSource);assert.equal(jobs.size,1);
});
test('a delayed background suspension cannot silence a page already returned to foreground',async()=>{
 let suspend;class SlowContext extends Context{suspend(){return new Promise(resolve=>{suspend=()=>{this.transition('suspended');resolve();};});}}
 const {audio,jobs}=setup({Context:SlowContext});await audio.unlock();audio.setHidden(true);audio.setHidden(false);await audio.recover();
 suspend();await Promise.resolve();await audio.recover();assert.equal(audio.ctx.state,'running');assert.equal(jobs.size,1);
});
test('backgrounding while an earlier resume is settling does not block foreground recovery',async()=>{
 const {audio,jobs}=setup();const first=audio.unlock();audio.setHidden(true);audio.setHidden(false);
 assert.equal(await audio.recover(),true);await first;assert.equal(audio.ctx.state,'running');assert.equal(jobs.size,1);
});
test('a closed context is replaced while the prepared score and pause position survive',async()=>{
 const {audio,jobs}=setup({renderScore:async()=>({duration:120})});await audio.unlock();await audio.scoreTask;
 const old=audio.ctx;old.currentTime=31;old.transition('closed');assert.equal(jobs.size,0);
 assert.equal(await audio.unlock(),true);assert.notEqual(audio.ctx,old);assert.equal(audio.scoreSource.started[0][1],31);assert.equal(jobs.size,1);
 old.transition('running');assert.equal(jobs.size,1);
});
test('fallback pads sustain until the crossfade, rather than almost vanishing between chords',()=>{
 const c=new Context();synthTone(c,c.destination,45,0,18,.1,{attack:3,release:4});
 const envelope=c.gains[0].gain.events;assert.deepEqual(envelope[2],{kind:'linear',value:.1*.8,time:14});
 assert.equal(envelope[3].time,18);assert.equal(envelope.at(-1).value,0);
});
test('all completion cues are finite; bursts pick one important cue and do not sound for ordinary logs',async()=>{
 const {audio}=setup();await audio.unlock();audio.update('music',false);
 for(const cue of SOUND_CUES){audio.ctx.currentTime+=10;audio.play(cue);}
 assert.ok(audio.ctx.osc.every(o=>o.started.every(a=>a.every(Number.isFinite))&&o.stopped.some(Number.isFinite)));
 assert.ok(audio.ctx.sources.every(o=>o.stopped.every(Number.isFinite)));
 audio.ctx.currentTime+=10;const before=audio.ctx.osc.length;
 audio.notify([{sound:'build'},{sound:'research'},{type:'war'}]);assert.equal(audio.ctx.osc.length-before,2);
 audio.notify([{sound:'build'}]);assert.equal(audio.ctx.osc.length-before,2);
 audio.ctx.currentTime+=10;audio.notify([{type:'info',text:'A routine entry'}]);assert.equal(audio.ctx.osc.length-before,2);
 audio.notify([{type:'communication'}]);assert.equal(audio.ctx.osc.length-before,4);
 audio.ctx.currentTime+=.4;audio.notify([{type:'communication'}]);assert.equal(audio.ctx.osc.length-before,4);
});
test('unsupported audio, rendering failures and malformed preferences cannot break game controls',async()=>{
 assert.deepEqual(audioPreferences({music:'yes',musicVolume:99,effectsVolume:-3}),{...AUDIO_DEFAULTS,musicVolume:1,effectsVolume:0});
 const a=new SpaceAudio({Context:null,storage:{getItem(){throw Error('Unavailable');}}});assert.equal(await a.unlock(),false);
 assert.doesNotThrow(()=>a.play('research'));assert.doesNotThrow(()=>a.update('music',false));
 const {audio,jobs}=setup({renderScore:async()=>{throw Error('No renderer');}});await audio.unlock();await audio.scoreTask;
 assert.equal(audio.scoreSource,null);assert.equal(jobs.size,1);assert.ok(audio.nodes.size>0);
});
