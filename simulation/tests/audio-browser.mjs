import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'/private/tmp/tattrex-design-tools/node_modules/playwright-core');
const browser=await chromium.connectOverCDP(process.env.BROWSER_CDP||'http://127.0.0.1:9324'),context=await browser.newContext({viewport:{width:1440,height:1100}});
const url=process.env.DEMO_URL||'http://127.0.0.1:4173';
await context.addInitScript(()=>{const AudioClass=window.Audio;window.Audio=function(...args){const a=new AudioClass(...args);window.testAudio=a;return a;};});
const ready=async page=>{await page.goto(url);await page.waitForFunction(()=>!document.querySelector('#play').disabled);};
try{
 const page=await context.newPage();await page.route('**/command-01.mp3',async route=>{await new Promise(r=>setTimeout(r,1100));await route.continue();});await ready(page);
 await page.locator('#sound').click();await page.locator('#play').click();await page.waitForFunction(()=>window.testAudio?.currentTime>.4);
 let sample=await page.evaluate(()=>({time:testAudio.currentTime,phase:document.querySelector('#experience').dataset.motion,bars:[...document.querySelectorAll('#spectrum i')].some(e=>Number(e.style.opacity)>.5)}));
 assert.ok(sample.time<1.4);assert.equal(sample.phase,'speaking');assert.equal(sample.bars,true);await page.waitForFunction(()=>document.querySelector('#experience').dataset.motion==='settling');assert.equal(await page.evaluate(()=>testAudio.ended),true);
 await page.locator('#play').click();await page.close();
 const reduced=await context.newPage();await reduced.emulateMedia({reducedMotion:'reduce'});await ready(reduced);await reduced.locator('#sound').click();await reduced.locator('#play').click();await reduced.waitForFunction(()=>window.testAudio?.currentTime>.15);
 await reduced.locator('#play').click();const stopped=await reduced.evaluate(()=>testAudio.currentTime);await reduced.waitForTimeout(250);assert.equal(await reduced.evaluate(()=>testAudio.currentTime),stopped);
 await reduced.locator('#play').click();await reduced.waitForFunction(t=>testAudio.currentTime>t+.2,stopped);assert.equal(await reduced.evaluate(()=>testAudio.paused),false);await reduced.close();
 const muted=await context.newPage();await ready(muted);await muted.locator('#play').click();await muted.waitForTimeout(450);await muted.locator('#sound').click();await muted.waitForFunction(()=>window.testAudio?.currentTime>.5);await muted.locator('#sound').click();const position=await muted.evaluate(()=>testAudio.currentTime);assert.equal(await muted.evaluate(()=>testAudio.paused),true);await muted.waitForTimeout(200);await muted.locator('#sound').click();await muted.waitForFunction(t=>testAudio.currentTime>t+.12,position);await muted.waitForFunction(()=>document.querySelector('#experience').dataset.motion==='settled');assert.ok(position<1.8);await muted.close();
 const failed=await context.newPage();await failed.route('**/command-01.mp3',r=>r.abort());await ready(failed);await failed.locator('#sound').click();await failed.locator('#play').click();await failed.waitForFunction(()=>document.querySelector('#experience').dataset.motion==='settled');assert.match(await failed.locator('#sound').innerText(),/unavailable/);await failed.close();
 console.log('PASS: delayed audio drives voice phase; reduced-motion narration resumes; mute transfers elapsed time; failed audio falls back without blocking.');
}finally{await context.close();await browser.close();}
