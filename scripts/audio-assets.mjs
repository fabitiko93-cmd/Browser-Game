// Optional asset generation; neither the renderer nor ffmpeg is needed to play or build.
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {renderSpaceScore,SCORE_RATE} from '../src/audio-score.js';
import {SpaceAudio,SOUND_CUES} from '../src/audio.js';

let engine;
try{engine=(await import(process.env.ORBIT_AUDIO_ENGINE?pathToFileURL(resolve(process.env.ORBIT_AUDIO_ENGINE)).href:'web-audio-engine')).default;}
catch{throw Error('Audio generation needs web-audio-engine and ffmpeg. The checked-in MP3 files need no dependencies.');}
const output=resolve(import.meta.dirname,'../web/audio');await mkdir(output,{recursive:true});
const scratch=await mkdtemp(join(tmpdir(),'orbit-audio-'));
async function encode(name,buffer){
 const channels=Array.from({length:buffer.numberOfChannels},(_,i)=>buffer.getChannelData(i));
 if(channels.some(data=>!data.every(Number.isFinite)))throw Error(`Invalid audio: ${name}`);
 const wav=join(scratch,`${name}.wav`);
 await writeFile(wav,Buffer.from(await engine.encoder.encode({sampleRate:buffer.sampleRate,channelData:channels},{bitDepth:16})));
 execFileSync('ffmpeg',['-v','error','-y','-i',wav,'-ar','44100','-ac','2','-codec:a','libmp3lame','-q:a','4',join(output,`${name}.mp3`)]);
 console.log(`Rendered ${name} (${buffer.duration}s).`);
}
try{
 await encode('transit-3077',await renderSpaceScore(engine.OfflineAudioContext));
 for(const cue of SOUND_CUES){
  class RenderContext extends engine.OfflineAudioContext{constructor(){super(2,SCORE_RATE*4.5,SCORE_RATE);}get state(){return 'running';}}
  const audio=new SpaceAudio({Context:RenderContext,storage:null});audio.initialize();audio.unlocked=true;audio.settings.music=false;audio.sfx.gain.value=.7;audio.play(cue);
  await encode(cue,await audio.ctx.startRendering());
 }
}finally{await rm(scratch,{recursive:true,force:true});}
