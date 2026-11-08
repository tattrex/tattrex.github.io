import {loadDemoVolumes} from './volume.js';
import {initialState,parseCommand,reduceCommand} from './commands.js';
import {drawViewport} from './renderer.js';
import {createReportPresenter,REPORT_DWELL,REPORT_WRITING_TIME} from './report.js';
import {createUtterance,voiceFrame,responseFrame,createMotionClock,easeOut} from './motion.js';
const $=id=>document.getElementById(id),$$=selector=>[...document.querySelectorAll(selector)];
const steps=[
 {command:'Open the most critical patient',response:'AI identified Demo patient 01 as the highest priority. Opening the study.',phase:'Prioritise',caption:'Priority study · Demo patient 01'},
 {command:'Change it to brain window',response:'Brain window applied. Stay with the subtle details.',phase:'Navigate',caption:'Brain window · W 80 / L 40'},
 {command:'Highlight acute infarct',response:'The published stroke-core mask, aligned to the real CT. Review the annotation in context.',phase:'Identify',caption:'Stroke core · Expert reference mask'},
 {command:'Create MIP on 15 mm',response:'A 15 millimetre maximum intensity projection. A new perspective on the same study.',phase:'Project',caption:'Maximum intensity · 15 mm'},
 {command:'Give me MPR',response:'Axial, coronal and sagittal. One finding, seen in three planes.',phase:'Reconstruct',caption:'Multiplanar reconstruction'},
 {command:'Pull up priors',response:'An illustrative prior, alongside the source CT. This dataset has no real earlier exam.',phase:'Recall',caption:'Source CT + illustrative prior'},
 {command:'Compare the ventricular region across time',response:'The same region, aligned to an illustrative prior. No real interval change is claimed.',phase:'Compare',caption:'Ventricular region · Illustrative comparison'},
 {command:'Draft the report',response:'The reference annotation carried into a draft. Ready for your review.',phase:'Report',caption:'From image to report · Review required'}
];
let volumes=null,state=initialState(),viewState=state,loading=false,currentStep=-1;
let active=false,manualPaused=false,playing=false,timer=null,deadline=0,remaining=7500,drawFrame=0,layoutKey='';
let profiles=[],moment=null,motion=null,wordIndex=-1;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),clock=createMotionClock();
$('spectrum').replaceChildren();
const bars=Array.from({length:54},()=>{const bar=document.createElement('i');$('spectrum').append(bar);return bar;});
const report=createReportPresenter($('report-sheet'));report.reset();
const silence={bars:Array(54).fill(0),energy:0,word:-1};
function wave(frame=silence){
 $('spectrum').classList.toggle('active',frame.energy>.025);
 bars.forEach((bar,i)=>{const value=reduced.matches?0:(frame.bars[i]||0);bar.style.transform=`scaleY(${.045+value*.955})`;bar.style.opacity=String(.34+value*.66);});
 $('voice-instrument').style.setProperty('--voice-energy',reduced.matches?0:frame.energy);
}
function updateControls(){
 $('play').textContent=playing?'Pause sequence Ⅱ':currentStep>=0?'Continue sequence ▷':'Play the sequence ▷';
 $('progress-fill').style.width=`${(currentStep+1)/steps.length*100}%`;
 $('progress-fill').parentElement.setAttribute('aria-valuenow',String(currentStep+1));
 $$('.chapters button').forEach((b,i)=>{b.classList.toggle('active',i===currentStep);b.setAttribute('aria-current',i===currentStep?'step':'false');});
 $('experience').dataset.mode=state.mode;$('experience').dataset.overlay=String(state.overlay);$('experience').dataset.open=String(state.open);$('experience').dataset.step=String(currentStep);
}
function pause(){
 if(timer)remaining=Math.max(0,deadline-performance.now());clearTimeout(timer);timer=null;playing=false;
 clock.pause();
 if(moment)moment.paused=true;
 if(moment&&!moment.done){$('experience').dataset.motion='paused';$('voice-state').textContent='Paused';}
 else $('voice-state').textContent=volumes?'Paused':'Preparing';
 $('experience').dataset.motion='paused';
 updateControls();
}
function clearEffects(){
 motion=null;$$('.slab-echo').forEach(el=>el.remove());
 $$('.scan-image').forEach(el=>{el.style.transform='';el.style.opacity='';el.style.filter='';});
 $('image-field').style.setProperty('--emphasis',0);$('voice-instrument').style.setProperty('--response-emphasis',0);
}
function cancelMoment({settle=true}={}){
 clock.stop();moment=null;clearEffects();wave();wordIndex=-1;report.reset();$('experience').dataset.report='false';
 $('experience').dataset.motion='settled';$('response-text').style.opacity='';$('response-text').style.transform='';
 $$('#command-text .word').forEach(el=>el.className='word spoken');
 if(settle&&volumes){viewState=state;render();}
}
function commandText(text){
 $('command-text').replaceChildren();$('command-text').setAttribute('aria-label',`“${text}”`);
 const quote=document.createElement('span');quote.textContent='“';quote.setAttribute('aria-hidden','true');$('command-text').append(quote);
 text.split(/\s+/).forEach((word,i)=>{if(i)$('command-text').append(document.createTextNode(' '));const el=document.createElement('span');el.className='word';el.textContent=word;el.setAttribute('aria-hidden','true');$('command-text').append(el);});
 const end=quote.cloneNode();end.textContent='”';$('command-text').append(end);wordIndex=-1;
}
function highlightWord(index,complete=false){
 if(index===wordIndex&&!complete)return;wordIndex=index;
 $$('#command-text .word').forEach((el,i)=>{el.classList.toggle('spoken',complete||i<index);el.classList.toggle('speaking',!complete&&i===index);});
}
function setCopy(command,response,phase,caption){commandText(command);$('response-text').textContent=response;$('phase-label').textContent=phase;$('image-caption').textContent=caption;}
function baseState(){return {...initialState(),point:[...volumes.meta.initialPoint]};}
function sequenceState(index){let next=baseState();for(let i=0;i<=index;i++){next=reduceCommand(next,parseCommand(steps[i].command),volumes.meta).state;if(i===5)next={...next,mode:'axial',slabMm:0};if(i===7)next={...next,mode:'axial',window:'brain',slabMm:0,priors:false,compare:false,overlay:true,maskMode:'core',point:[...volumes.meta.lesionPoint],zoom:1.15};}return next;}
function beginMoment({command,response,phase,caption,target,before=state,kind,profile=null,direct=false}){
 cancelMoment({settle:false});state=target;viewState=before;
 const track=createUtterance(command,profile),voiceDuration=direct?0:track.duration+160;
 moment={track,kind,before,target,voiceDuration,direct,elapsed:0,responseAt:null,applied:false,done:false,paused:false};
 setCopy(command,response,phase,caption);$('experience').dataset.operation=kind;
 if(reduced.matches||manualPaused){settleMoment();return;}
 render();$('response-text').style.opacity='0';$('response-text').style.transform='translateY(8px)';
 clock.start(advanceMoment);updateControls();
}
function settleMoment(){
 if(!moment)return;clock.stop();viewState=state;render();highlightWord(moment.track.words.length,true);wave();clearEffects();
 if(moment.kind==='report'){report.complete();$('experience').dataset.report='true';}
 moment.applied=true;moment.done=true;$('experience').dataset.motion='settled';$('voice-state').textContent=moment.kind==='report'?'Ready for review':'In context';
 $('response-text').style.opacity='';$('response-text').style.transform='';scheduleDraw();updateControls();
}
function addSlabEchoes(){
 // No viewer controls: these are adjacent source planes only.
 const view=$$('.scan-image')[0];if(!view)return;
 for(const offset of [-2,2]){const echo=document.createElement('canvas');echo.className='slab-echo';echo.dataset.offset=offset;echo.setAttribute('aria-hidden','true');view.append(echo);
  const s={...viewState,point:[...viewState.point],slabMm:0,overlay:false,clean:true,zoom:displayZoom(viewState)};s.point[2]=Math.max(0,Math.min(volumes.current.dims[2]-1,s.point[2]+offset));drawViewport(echo,volumes.current,s,'axial');}
}
function applyMoment(){
 if(!moment||moment.applied)return;moment.applied=true;viewState=state;render();
 if(moment.kind==='mip')addSlabEchoes();
 if(moment.kind==='report'){report.show();$('experience').dataset.report='true';}
}
function advanceMoment(elapsed){
 if(reduced.matches){settleMoment();return false;}
 if(!moment)return false;moment.elapsed=elapsed;
 const speaking=!moment.applied&&elapsed<moment.voiceDuration;
 if(speaking){
  const frame=voiceFrame(moment.track,elapsed);wave(frame);highlightWord(frame.word);
  $('experience').dataset.motion='speaking';$('voice-state').textContent='Listening';return true;
 }
 if(moment.responseAt===null)moment.responseAt=elapsed;
 applyMoment();
 if(moment.direct&&elapsed<Math.min(1800,moment.track.duration)){const frame=voiceFrame(moment.track,elapsed);wave(frame);highlightWord(frame.word);}
 else{highlightWord(moment.track.words.length,true);wave();}
 const age=elapsed-moment.responseAt,response=responseFrame(age);
 motion={...response,kind:moment.kind,fromWindow:moment.before.open?moment.before.window:'brain',fromMaskMode:moment.before.maskMode,hideOverlay:moment.kind==='overlay'&&!state.overlay};
 $('experience').dataset.motion=response.phase;$('voice-state').textContent=response.phase==='responding'?'Responding':response.phase==='settling'?'In context':'Ready when you are';
 $('response-text').style.opacity=String(easeOut(age/450));$('response-text').style.transform=`translateY(${(1-easeOut(age/650))*8}px)`;
 $('voice-instrument').style.setProperty('--response-emphasis',response.emphasis);
 $('image-field').style.setProperty('--emphasis',response.emphasis);
 if(response.phase!=='settled'||!moment.imageSettled){
  animateImages(response,age);scheduleDraw();
  if(response.phase==='settled'){moment.imageSettled=true;clearEffects();scheduleDraw();}
 }
 if(moment.kind==='report'){
  report.write(age/REPORT_WRITING_TIME);
  $('voice-state').textContent=age<REPORT_WRITING_TIME?'Drafting report':'Ready for review';
  if(age<REPORT_WRITING_TIME)return true;
 }
 if(response.phase==='settled'){moment.done=true;return false;}
 return true;
}
function animateImages({reveal,emphasis},age){
 const kind=moment.kind;
 $$('.scan-image').forEach((el,i)=>{
  let scale=1,x=0,y=0,rotate=0,opacity=1;
  if(kind==='open'){scale=.93+.07*reveal+.035*emphasis;y=24*(1-reveal)-8*emphasis;opacity=reveal;}
  if(kind==='window'){scale=1+.035*emphasis;y=-6*emphasis;}
  if(kind==='overlay'&&!motion.hideOverlay){scale=1+.018*emphasis;}
  if(kind==='mip'){scale=1+.04*emphasis;y=-8*emphasis;}
  if(kind==='mpr'||kind==='plane'){
   const r=easeOut((age-i*110)/750);x=(i?32:-12)*(1-r);y=(i?14:0)*(1-r)-8*emphasis;scale=.94+.06*r+.025*emphasis;rotate=(i?-8:3)*(1-r);opacity=r;
  }
  if(kind==='priors'){const prior=el.dataset.time==='prior';x=prior?40*(1-reveal):-8*emphasis;y=prior?-12*emphasis:0;scale=1+(prior?.045:.012)*emphasis;opacity=prior?reveal:1;}
  if(kind==='compare'){scale=1+.025*emphasis;y=-4*emphasis;}
  if(['slice','step','zoom'].includes(kind)){scale=1+.018*emphasis;y=-6*emphasis;}
  el.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale}) rotateY(${rotate}deg)`;el.style.opacity=String(opacity);
 });
 $$('.slab-echo').forEach(el=>{const sign=Math.sign(Number(el.dataset.offset)),fold=1-easeOut(age/1150);el.style.transform=`translate3d(${sign*22*fold}px,${sign*30*fold}px,0) scale(${1+sign*.045*fold})`;el.style.opacity=String(.32*fold);});
}
function showStep(index){
 if(!volumes)return;currentStep=index;remaining=index===7?REPORT_DWELL:7500;const step=steps[index];
 $('step-label').textContent=`${String(index+1).padStart(2,'0')} / 08`;
 beginMoment({...step,target:sequenceState(index),before:sequenceState(index-1),kind:parseCommand(step.command).type,profile:profiles[index]});
}
function schedule(ms=remaining){
 clearTimeout(timer);deadline=performance.now()+ms;
 timer=setTimeout(()=>{timer=null;if(!playing)return;if(moment&&!moment.done){schedule(300);return;}showStep((currentStep+1)%steps.length);schedule();},ms);
}
function resume(){
 if(playing||!volumes||!active||manualPaused)return;playing=true;
 if(currentStep<0)showStep(0);
 else if(moment?.paused){moment.paused=false;if(!moment.done)clock.resume();else{$('experience').dataset.motion='settled';$('voice-state').textContent=moment.kind==='report'?'Ready for review':'In context';}}
 schedule();updateControls();
}
function togglePlay(){
 if(playing){manualPaused=true;pause();return;}
 manualPaused=false;resume();
}
function selectChapter(index){
 if(!volumes||!Number.isInteger(index)||index<0||index>=steps.length)return;
 pause();showStep(index);if(active&&!manualPaused){playing=true;schedule();updateControls();}
}
function displayZoom(s){return s.compare?1.3:s.mode==='mpr'?.94:s.zoom;}
function scheduleDraw(){
 cancelAnimationFrame(drawFrame);drawFrame=requestAnimationFrame(()=>{
  if(!volumes)return;const drawState={...viewState,clean:true,thumbnail:viewState.report&&$('image-grid').clientWidth<100,zoom:displayZoom(viewState)};
  if(!viewState.open)drawState.window='brain';
  if(motion&&['compare','zoom'].includes(motion.kind))drawState.zoom=displayZoom(moment.before)+(drawState.zoom-displayZoom(moment.before))*motion.reveal;
  $$('.scan-image').forEach(view=>{const prior=view.dataset.time==='prior';drawViewport(view.querySelector('canvas'),prior?volumes.prior:volumes.current,drawState,view.dataset.axis,prior?null:volumes.mask,motion);});
 });
}
function render(){
 if(!volumes)return;const axes=viewState.mode==='mpr'?['axial','coronal','sagittal']:[viewState.mode],times=viewState.priors?['current','prior']:['current'],key=axes.join(',')+times.join(',');
 if(key!==layoutKey){
  layoutKey=key;$('image-grid').replaceChildren();$('image-grid').dataset.layout=viewState.priors?(viewState.mode==='mpr'?'paired-mpr':'paired'):(viewState.mode==='mpr'?'mpr':'single');
  for(const time of times)for(const axis of axes){const view=document.createElement('div');view.className='scan-image';view.dataset.time=time;view.dataset.axis=axis;
   const canvas=document.createElement('canvas');canvas.setAttribute('role','img');const label=document.createElement('span');label.className='scan-label';label.textContent=viewState.priors?time==='prior'?'Illustrative prior · Derived':'Source CT · CPAISD':viewState.mode==='mpr'?axis:'';view.append(canvas,label);$('image-grid').append(view);}
 }
 $$('.scan-image').forEach(view=>view.querySelector('canvas').setAttribute('aria-label',`${view.dataset.time==='prior'?'Illustrative derived prior':'CPAISD source CT'}, ${view.dataset.axis} brain CT${viewState.overlay&&view.dataset.time==='current'?', with expert reference mask':''}`));
 scheduleDraw();updateControls();
}
$('play').addEventListener('click',togglePlay);
$('restart').addEventListener('click',()=>selectChapter(0));
$$('.chapters button').forEach(button=>button.addEventListener('click',()=>selectChapter(Number(button.dataset.step))));
new ResizeObserver(scheduleDraw).observe($('image-grid'));
reduced.addEventListener('change',()=>{if(reduced.matches)settleMoment();});
async function load(){
 if(loading)return;loading=true;$('experience').setAttribute('aria-busy','true');$('retry').hidden=true;$('load-status').hidden=false;$('load-status').textContent='Preparing the imaging sequence…';$('play').disabled=true;
 try{[volumes,profiles]=await Promise.all([loadDemoVolumes(),fetch(new URL('../public/motion/spectrum.json',import.meta.url)).then(r=>r.ok?r.json():Promise.reject()).then(j=>j.tracks).catch(()=>[])]);state=baseState();viewState=state;$('load-status').hidden=true;$('voice-state').textContent='Ready when you are';$('play').disabled=false;wave();render();$('experience').dispatchEvent(new CustomEvent('studyready'));resume();return true;}
 catch(error){$('load-status').textContent='Images could not load. Please try again.';$('retry').hidden=false;$('voice-state').textContent='Images unavailable';$('experience').dispatchEvent(new CustomEvent('studyerror'));return false;}
 finally{loading=false;$('experience').setAttribute('aria-busy','false');}
}
$('retry').addEventListener('click',load);
export const ready=load();
export function setActive(value){active=value;if(active)resume();else if(playing)pause();}
// The standalone reference route shares the same visibility and playback rules.
if($('experience').hasAttribute('data-standalone')){
 const sync=()=>{const rect=$('demo').getBoundingClientRect();setActive(!document.hidden&&rect.bottom>0&&rect.top<innerHeight);};
 new IntersectionObserver(sync).observe($('demo'));document.addEventListener('visibilitychange',sync);sync();
}
