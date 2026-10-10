// Original score "Transit 3077". Render once; the audio thread loops the result.
export const SCORE_SECONDS = 120;
export const SCORE_RATE = 24000;
export const MUSIC_CHORDS = [[40,47,55,59],[36,43,50,55],[43,50,57,62],[38,45,52,57],[40,47,54,59],[45,52,59,64],[36,43,52,59],[38,45,54,57]];
export const frequency = midi => 440 * 2 ** ((midi-69)/12);

export function synthTone(c,bus,midi,time,duration,volume,{type='sine',detune=0,attack=.015,release=duration*.7,pan=0,cutoff=2200,endMidi=null,ended=()=>{}}={}) {
 const osc=c.createOscillator(),gain=c.createGain(),filter=c.createBiquadFilter();
 osc.type=type;osc.frequency.setValueAtTime(frequency(midi),time);osc.detune.value=detune;
 if(endMidi!==null)osc.frequency.exponentialRampToValueAtTime(frequency(endMidi),time+duration);
 filter.type='lowpass';filter.frequency.value=cutoff;
 const rise=Math.min(attack,duration*.4),fall=Math.max(rise,duration-Math.min(release,duration));
 gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume,time+rise);
 gain.gain.linearRampToValueAtTime(volume*.8,time+fall);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);gain.gain.linearRampToValueAtTime(0,time+duration+.02);
 osc.connect(filter);filter.connect(gain);
 let panner=null;if(c.createStereoPanner){panner=c.createStereoPanner();panner.pan.value=pan;gain.connect(panner);panner.connect(bus);}else gain.connect(bus);
 osc.onended=()=>{osc.disconnect();filter.disconnect();gain.disconnect();panner?.disconnect();ended(osc);};
 osc.start(time);osc.stop(time+duration+.03);return osc;
}

export function noiseBuffer(c,seconds=1,seed=3077) {
 const buffer=c.createBuffer(1,Math.ceil(c.sampleRate*seconds),c.sampleRate),data=buffer.getChannelData(0);
 for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=seed/2147483647*2-1;}return buffer;
}

export function synthNoise(c,bus,buffer,time,duration,volume,{attack=.01,cutoff=1300,endCutoff=cutoff,pan=0,ended=()=>{}}={}) {
 const source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();source.buffer=buffer;source.loop=true;
 filter.type='lowpass';filter.frequency.setValueAtTime(cutoff,time);filter.frequency.exponentialRampToValueAtTime(Math.max(20,endCutoff),time+duration);
 const rise=Math.min(attack,duration*.4);gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume,time+rise);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);gain.gain.linearRampToValueAtTime(0,time+duration+.02);
 source.connect(filter);filter.connect(gain);
 let panner=null;if(c.createStereoPanner){panner=c.createStereoPanner();panner.pan.value=pan;gain.connect(panner);panner.connect(bus);}else gain.connect(bus);
 source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();panner?.disconnect();ended(source);};
 source.start(time);source.stop(time+duration+.03);return source;
}

export function spaceReverb(c,seconds=3.1) {
 const reverb=c.createConvolver(),buffer=c.createBuffer(2,Math.ceil(c.sampleRate*seconds),c.sampleRate);
 for(let channel=0;channel<2;channel++){const data=buffer.getChannelData(channel);let seed=3077+channel;
  for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=(seed/2147483647*2-1)*Math.pow(1-i/data.length,3);}
 }reverb.buffer=buffer;return reverb;
}

export async function renderSpaceScore(Offline=globalThis.OfflineAudioContext??globalThis.webkitOfflineAudioContext) {
 if(!Offline)return null;
 // Render release/reverb tails past the endpoint, then wrap them into the start.
 const c=new Offline(2,(SCORE_SECONDS+12)*SCORE_RATE,SCORE_RATE),mix=c.createGain(),space=spaceReverb(c),wet=c.createGain(),bells=c.createGain();
 mix.connect(c.destination);wet.gain.value=.23;space.connect(wet);wet.connect(mix);
 const pads=c.createGain();pads.connect(mix);pads.connect(space);bells.connect(mix);bells.connect(space);
 const delay=c.createDelay(1),feedback=c.createGain(),echo=c.createGain();delay.delayTime.value=.46875;feedback.gain.value=.22;echo.gain.value=.23;
 bells.connect(delay);delay.connect(feedback);feedback.connect(delay);delay.connect(echo);echo.connect(mix);
 const beat=.9375,bar=beat*4,noise=noiseBuffer(c);
 MUSIC_CHORDS.forEach((chord,index)=>{
  const start=index*bar*4;
  chord.forEach((note,voice)=>{
   synthTone(c,pads,note,start,18,.085,{type:voice?'triangle':'sine',detune:voice%2?4:-4,attack:3,release:4,pan:(voice-1.5)*.4,cutoff:500+voice*190});
   if(voice>0)synthTone(c,pads,note,start,18,.035,{type:'sine',detune:voice%2?-5:5,attack:3.5,release:4,pan:(1.5-voice)*.4});
  });
  if(index>1&&index<6)synthTone(c,pads,chord[3]+12,start+bar,bar*3,.026,{attack:2,release:3,pan:index%2?.6:-.6,cutoff:2700});
 });
 for(let measure=0;measure<32;measure++){
  const chord=MUSIC_CHORDS[Math.floor(measure/4)],time=measure*bar,full=measure>=8&&measure<24;
  const pattern=full?[0,2,1,3,2,1,3,2]:[0,2,3,1];
  pattern.forEach((note,index)=>{
   if(!full&&measure%2&&index>1)return;
   const at=time+index*bar/pattern.length;
   synthTone(c,bells,chord[note]+12,at,1.8,full?.036:.027,{type:'triangle',release:1.5,pan:Math.sin(measure+index)*.65,cutoff:2400});
   synthTone(c,bells,chord[note]+24,at,.85,.006,{release:.75,pan:-Math.sin(measure+index)*.65,cutoff:3500});
  });
  if(full){
   for(const offset of[0,2])synthTone(c,mix,chord[0],time+offset*beat,.9,.065,{release:.8,cutoff:250});
   for(const offset of[1,3])synthNoise(c,mix,noise,time+offset*beat,.13,.016,{cutoff:3200,endCutoff:1000,pan:offset===1?-.25:.25});
  }
  if(measure%4===2){
   const melody=[chord[3]+12,chord[2]+12,chord[1]+12];
   melody.forEach((note,index)=>synthTone(c,bells,note,time+index*beat,3.2,.052,{attack:.12,release:2.8,pan:.1,cutoff:2100}));
  }
  if(measure%8===0)synthNoise(c,pads,noise,time,3,.022,{attack:1,cutoff:500,endCutoff:1500,pan:measure%16?-.4:.4});
 }
 const rendered=await c.startRendering(),length=SCORE_SECONDS*SCORE_RATE,loop=c.createBuffer(2,length,SCORE_RATE);
 for(let channel=0;channel<2;channel++){
  const src=rendered.getChannelData(channel),out=loop.getChannelData(channel);out.set(src.subarray(0,length));
  for(let i=length;i<src.length;i++)out[i-length]+=src[i];
  for(let i=0;i<length;i++)out[i]=.72*Math.tanh(out[i]*1.4);
 }
 return loop;
}
