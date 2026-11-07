import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.connectOverCDP(process.env.BROWSER_CDP||'http://127.0.0.1:9324');
const base=process.env.SITE_URL||'http://127.0.0.1:4321';
await mkdir('artifacts',{recursive:true});
const contexts=[],errors=[],mediaRequests=[];
async function create(width,motion='reduce'){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:motion});contexts.push(context);
 await context.addInitScript(()=>{const forbidden=()=>{throw new Error('Actual audio or microphone API used');};for(const key of ['Audio','AudioContext','webkitAudioContext','SpeechRecognition','webkitSpeechRecognition'])window[key]=forbidden;if(window.speechSynthesis)window.speechSynthesis.speak=forbidden;if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia=forbidden;});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\.(mp3|wav|m4a)(?:$|\?)/.test(r.url()))mediaRequests.push(r.url());});return page;
}
try{
 for(const width of [360,390,768,1440]){
  const page=await create(width);const initial=[];page.on('request',r=>initial.push(r.url()));await page.goto(base);await page.evaluate(()=>document.fonts.ready);
  assert.equal(initial.some(x=>/simulation\//.test(x)),false,'Study assets must wait for activation');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow at ${width}`);
  assert.ok(await page.locator('.hero-art img').evaluate(el=>el.complete&&el.naturalWidth>0));
  assert.equal(await page.locator('.hero-art').evaluate(el=>getComputedStyle(el).zIndex),'0');
  await page.screenshot({path:`artifacts/site-${width}.png`,fullPage:true});
  if(width===390){await page.locator('.menu-toggle').click();assert.equal(await page.locator('#mobile-menu').evaluate(el=>el.open),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#mobile-menu').evaluate(el=>el.open),false);assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');await page.locator('.menu-toggle').click();await page.locator('#mobile-menu a[href="#labs"]').click();assert.equal(await page.locator('#mobile-menu').evaluate(el=>el.open),false);}
  const faq=page.locator('.faq details').first();await faq.locator('summary').focus();await page.keyboard.press('Enter');assert.ok(await faq.evaluate(el=>el.open));
  const research=page.locator('.research-directions details');await research.nth(1).locator('summary').click();assert.equal(await research.first().evaluate(el=>el.open),false);assert.equal(await research.nth(1).evaluate(el=>el.open),true);
  if(width===1440){
   const metrics=await page.evaluate(()=>performance.getEntriesByType('resource').filter(e=>!e.name.includes('/simulation/')).map(e=>({name:e.name.split('/').pop(),bytes:e.transferSize})));await writeFile('artifacts/site-transfer.json',JSON.stringify(metrics,null,2));
   // Hold the initial study request so the real loading state can be inspected.
   let release;const gate=new Promise(resolve=>release=resolve);await page.route('**/public/data/volume.json',async route=>{await gate;await route.continue();});
   await page.locator('#play').click();await page.waitForFunction(()=>!document.querySelector('#study-loading').hidden);assert.equal(await page.locator('#play').isDisabled(),true);assert.equal(await page.locator('.scanner-ring').evaluate(el=>getComputedStyle(el).animationName),'none');release();
   await page.waitForFunction(()=>document.querySelector('#study-poster').hidden,{},{timeout:30000});assert.equal(await page.locator('#study-loading').isVisible(),false);await page.locator('#play').click();
   await page.locator('.chapters [data-step="2"]').click();assert.equal(await page.locator('#experience').getAttribute('data-overlay'),'true');await page.locator('#experience').screenshot({path:'artifacts/site-infarct.png'});
   await page.locator('.chapters [data-step="4"]').click();assert.equal(await page.locator('canvas').count(),3);
   await page.locator('.try-it summary').click();await page.locator('#command-input').fill('compare ventricular region across time');await page.locator('#command-input').press('Enter');await page.waitForFunction(()=>document.querySelectorAll('canvas').length===2);
   await page.locator('#experience').screenshot({path:'artifacts/site-compare.png'});
   await page.locator('#play').click();await page.locator('#see').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('#play').textContent.includes('Continue'));
  }
  await page.close();
 }
 const failure=await create(390,'no-preference');await failure.route('**/public/data/current.raw.gz',r=>r.abort());await failure.goto(base);await failure.locator('#play').click();await failure.waitForFunction(()=>!document.querySelector('#retry').hidden);assert.equal(await failure.locator('#play').isDisabled(),true);await failure.unroute('**/public/data/current.raw.gz');await failure.locator('#retry').click();await failure.waitForFunction(()=>document.querySelector('#study-loading').hidden,{},{timeout:30000});assert.equal(await failure.locator('#play').isDisabled(),false);await failure.locator('.chapters [data-step="2"]').click();await failure.locator('#experience').screenshot({path:'artifacts/site-mobile-study.png'});
 assert.deepEqual(errors,[]);assert.deepEqual(mediaRequests,[]);
 console.log('PASS: four responsive sizes, deferred scan loading, visible loading/retry, mobile navigation and keyboard disclosures, real scans/MPR/masks/compare, offscreen pause, reduced motion and no actual speech.');
}finally{for(const context of contexts)await context.close();await browser.close();}
