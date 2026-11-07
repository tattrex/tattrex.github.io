const clamp=x=>Math.max(0,Math.min(1,x));
export const easeOut=x=>1-Math.pow(1-clamp(x),3);
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};

// Recorded tours use measured spectra. Arbitrary text uses a deterministic cadence,
// not a claim that microphone amplitudes or phonemes have been measured.
export function createUtterance(text,recording=null){
 const tokens=text.trim().split(/\s+/).filter(Boolean),weights=tokens.map(w=>Math.max(1.5,w.replace(/[^a-z0-9]/gi,'').length*.52));
 const duration=recording?.duration||Math.min(3600,Math.max(1450,weights.reduce((a,b)=>a+b,0)*115+320));
 const total=weights.reduce((a,b)=>a+b,0)||1;let cursor=100;
 const words=tokens.map((text,i)=>{const start=cursor;cursor+=weights[i]/total*(duration-200);return {text,start,end:cursor};});
 return {text,words,duration,recording};
}
export function voiceFrame(track,ms){
 const word=Math.max(0,track.words.findLastIndex(w=>ms>=w.start));
 if(ms<0||ms>=track.duration)return {bars:Array(54).fill(0),energy:0,word};
 if(track.recording){
  const r=track.recording,f=ms/1000*r.fps,index=Math.floor(f),a=r.frames[index]||[],b=r.frames[index+1]||a,t=f-index;
  const bars=a.map((v,i)=>(v+((b[i]??v)-v)*t)/255);
  return {bars,energy:bars.length?Math.max(...bars):0,word};
 }
 const cue=track.words[word],p=cue?(ms-cue.start)/(cue.end-cue.start):0;
 const envelope=p>0&&p<.88?Math.pow(Math.sin(p/.88*Math.PI),.7):0;
 const seed=[...(cue?.text||'')].reduce((a,c)=>a+c.charCodeAt(0),0);
 const bars=Array.from({length:54},(_,i)=>envelope*(.18+.82*Math.pow(Math.abs(Math.sin(i*.28+ms*.006+seed)*Math.cos(i*.11-ms*.003)),.65)));
 return {bars,energy:envelope,word};
}
export function responseFrame(ms){
 const reveal=smooth(ms/600);
 const emphasis=ms<440?smooth(ms/440):1-easeOut((ms-700)/1500);
 return {reveal,emphasis,phase:ms<700?'responding':ms<2200?'settling':'settled'};
}

// One owner for time. The generation guard also rejects callbacks already queued
// when a new instruction, visibility change or restart cancels the previous one.
export function createMotionClock({now=()=>performance.now(),request=fn=>requestAnimationFrame(fn),cancel=id=>cancelAnimationFrame(id)}={}){
 let generation=0,frame=0,origin=0,elapsed=0,running=false,callback=null;
 function loop(token){if(!running||token!==generation)return;elapsed=now()-origin;const keep=callback(elapsed);if(keep===false){running=false;return;}frame=request(()=>loop(token));}
 return {
  start(fn){this.stop();callback=fn;elapsed=0;origin=now();running=true;loop(generation);},
  pause(){if(!running)return;elapsed=now()-origin;running=false;cancel(frame);generation++;},
  resume(){if(running||!callback)return;origin=now()-elapsed;running=true;loop(++generation);},
  stop(){running=false;generation++;cancel(frame);callback=null;elapsed=0;},
  get elapsed(){return running?now()-origin:elapsed;},
  get running(){return running;}
 };
}
