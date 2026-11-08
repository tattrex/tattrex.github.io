import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.connectOverCDP(process.env.BROWSER_CDP||'http://127.0.0.1:9324');
const base=process.env.SITE_URL||'http://127.0.0.1:4321';
const {tracks}=JSON.parse(await readFile(new URL('../simulation/public/motion/spectrum.json',import.meta.url)));
const contexts=[],errors=[],media=[];
await mkdir('artifacts',{recursive:true});
async function create(width=1440,motion='no-preference'){
 const c=await browser.newContext({viewport:{width,height:1000},reducedMotion:motion});contexts.push(c);
 await c.addInitScript(()=>{const fail=()=>{throw Error('Actual audio API used');};for(const key of ['Audio','AudioContext','webkitAudioContext','SpeechRecognition','webkitSpeechRecognition'])window[key]=fail;if(window.speechSynthesis)window.speechSynthesis.speak=fail;if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia=fail;});
 const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/\.(mp3|wav|m4a)(?:$|\?)/.test(r.url()))media.push(r.url());});return p;
}
async function open(p,url=base){await p.goto(url);await p.locator('#experience').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.querySelector('#play').textContent.includes('Pause'));}
const frame=p=>p.evaluate(()=>new Promise(requestAnimationFrame));
try{
 const p=await create();await open(p);await p.clock.install();await p.clock.pauseAt(new Date(Date.now()+100));
 const tick=ms=>p.clock.runFor(ms),step=i=>p.locator(`.chapters [data-step="${i}"]`).click();
 const phase=()=>p.locator('#experience').getAttribute('data-motion');
 const bars=()=>p.locator('#spectrum i').evaluateAll(es=>es.map(e=>e.style.transform));
 const pixels=()=>p.locator('.scan-image>canvas').first().evaluate(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let hash=0,coral=0;for(let i=0;i<d.length;i+=4){hash=(hash+d[i]*3+d[i+1]*5+d[i+2]*7)>>>0;if(d[i]>d[i+1]+20&&d[i]>d[i+2]+20)coral+=d[i]-d[i+1];}return {hash,coral};});
 const response=async(i,age)=>{await step(i);await tick(tracks[i].duration+160+age);};
 assert.equal(await p.locator('.try-it,#command-form,#command-input,audio,video').count(),0);
 await step(2);await tick(400);const a=await bars();await tick(180);assert.notDeepEqual(await bars(),a,'Waveform evolves during the utterance');
 await tick(tracks[2].duration+160+460-580);const peak=await pixels();assert.equal(await phase(),'responding');assert.ok(peak.coral>0);
 await tick(2100);const settled=await pixels();assert.ok(peak.coral>settled.coral,'Mask emphasis settles into the image');
 await p.emulateMedia({reducedMotion:'reduce'});await step(2);await tick(32);assert.deepEqual(await pixels(),settled,'The final mask rendering stays exact');
 await p.emulateMedia({reducedMotion:'no-preference'});
 await response(4,450);assert.equal(await p.locator('.scan-image').count(),3);assert.notEqual(await p.locator('.scan-image').last().evaluate(e=>e.style.transform),'');
 await response(3,400);assert.equal(await p.locator('.slab-echo').count(),2);await tick(2200);assert.equal(await p.locator('.slab-echo').count(),0);
 await response(5,400);assert.equal(await p.locator('.scan-image').count(),2);
 await response(6,450);const compare=await pixels();await tick(2200);assert.notEqual((await pixels()).hash,compare.hash);
 // The report waits for the utterance, writes progressively, and pauses on the same clock.
 await step(7);assert.equal(await p.locator('#report-sheet').isVisible(),false);await tick(tracks[7].duration+160+450);
 const written=()=>p.locator('#report-sheet').evaluate(e=>Number(e.dataset.written));
 const first=await written();assert.ok(first>0);assert.equal(await p.locator('#report-sheet').getAttribute('data-complete'),'false');
 await tick(900);assert.ok(await written()>first);assert.equal(await p.locator('.scan-image').count(),1);assert.ok((await pixels()).coral>0);
 await p.locator('#play').click();const frozen=await written(),wave=await bars();await tick(9000);assert.equal(await written(),frozen);assert.deepEqual(await bars(),wave);assert.equal(await phase(),'paused');
 await p.locator('#play').click();await tick(6000);assert.equal(await p.locator('#report-sheet').getAttribute('data-complete'),'true');
 await p.locator('#experience').screenshot({path:'artifacts/report-desktop.png'});
 const text=await p.locator('#report-sheet').textContent();assert.match(text,/Findings.*Right cerebral hemispheric infarction/);assert.match(text,/Impression.*Acute right hemispheric ischaemic infarct/);assert.match(text,/Illustrative draft/);assert.match(text,/No genuine prior/);
 await tick(4500);assert.equal(await p.locator('#experience').getAttribute('data-step'),'7','The complete report remains available to read');
 await tick(7000);assert.equal(await p.locator('#experience').getAttribute('data-step'),'0','The sequence wraps automatically');assert.equal(await p.locator('#report-sheet').isVisible(),false);assert.equal(await written(),0);
 await step(7);await tick(tracks[7].duration+160+1000);await step(1);await tick(6000);assert.equal(await p.locator('#report-sheet').isVisible(),false);assert.equal(await written(),0,'An interrupted report cannot write into later scenes');
 await step(7);await tick(tracks[7].duration+160+500);await p.emulateMedia({reducedMotion:'reduce'});await tick(32);assert.equal(await p.locator('#report-sheet').getAttribute('data-complete'),'true','Switching to reduced motion completes the current report');
 // Complete two full cycles to catch stale timers or report state.
 await p.locator('#restart').click();for(let cycle=0;cycle<2;cycle++){for(let i=1;i<8;i++){await tick(7500);assert.equal(await p.locator('#experience').getAttribute('data-step'),String(i));}await tick(18000);assert.equal(await p.locator('#experience').getAttribute('data-step'),'0');assert.equal(await written(),0);}
 for(const width of [360,390,768,1024,1440]){
  const mobile=await create(width,'reduce');await open(mobile);await mobile.locator('.chapters [data-step="7"]').click();await mobile.locator('#image-field').scrollIntoViewIfNeeded();await frame(mobile);
  assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`No overflow at ${width}`);
  const fit=await mobile.locator('#report-sheet').evaluate(e=>{const f=e.querySelector('footer').getBoundingClientRect(),b=e.getBoundingClientRect();return {overflow:e.scrollHeight>e.clientHeight,footer:f.bottom<=b.bottom};});assert.equal(fit.overflow,false,`Report fits at ${width}`);assert.equal(fit.footer,true);
  assert.equal(await mobile.locator('#report-sheet').getAttribute('data-complete'),'true');await mobile.screenshot({path:`artifacts/report-${width}.png`});await mobile.close();
 }
 for(const width of [360,601,700,760,768,900,1440]){
  const standalone=await create(width,'reduce');await open(standalone,process.env.DEMO_URL||base+'/simulation/index.html');assert.equal(await standalone.locator('.try-it,#command-form').count(),0);await standalone.locator('.chapters [data-step="7"]').click();await frame(standalone);
  assert.equal(await standalone.locator('#report-sheet').isVisible(),true);
  const fits=await standalone.locator('#report-sheet').evaluate(e=>e.scrollHeight<=e.clientHeight&&e.querySelector('footer').getBoundingClientRect().bottom<=e.getBoundingClientRect().bottom);
  assert.equal(fits,true,`Standalone report fits at ${width}px`);await standalone.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(media,[]);
 console.log('PASS: waveform/image response motion, progressive report, pause/resume, reading dwell, two full loops, interruption/reduced-motion reset, five responsive report sizes, standalone parity and no audio.');
}finally{for(const c of contexts)await c.close();await browser.close();}
