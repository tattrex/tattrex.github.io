import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const browser=await chromium.connectOverCDP(process.env.BROWSER_CDP||'http://127.0.0.1:9324');
const base=process.env.SITE_URL||'http://127.0.0.1:4321';
const contexts=[];
async function page(){const c=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});contexts.push(c);return c.newPage();}
try{
 for(const selector of ['#play','.chapters [data-step="2"]']){
  const p=await page();let release;const gate=new Promise(resolve=>release=resolve);
  await p.route('**/public/data/volume.json',async route=>{await gate;await route.continue();});
  await p.goto(base);await p.locator(selector).click();await p.waitForFunction(()=>!document.querySelector('#study-loading').hidden);
  await p.locator('#contact').scrollIntoViewIfNeeded();const scroll=await p.evaluate(()=>scrollY);
  release();await p.waitForFunction(()=>document.querySelector('#study-loading').hidden,{},{timeout:30000});
  await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  assert.equal(await p.evaluate(()=>scrollY),scroll,'Completing a study download must not pull a visitor back after they leave');
  assert.doesNotMatch(await p.locator('#play').textContent(),/Pause/,'Playback must not start while offscreen');
  assert.notEqual(await p.locator('#experience').getAttribute('data-motion'),'speaking','A pending chapter must not animate offscreen');
  await p.locator('#play').click();await p.waitForFunction(()=>document.querySelector('#play').textContent.includes('Pause'));
 }
 const p=await page();await p.route('**/simulation/src/cinema.js',route=>route.abort());await p.goto(base);await p.locator('#play').click();await p.waitForFunction(()=>!document.querySelector('#retry').hidden);
 assert.equal(await p.locator('#experience').getAttribute('aria-busy'),'false','A failed module request must end its busy state');
 await p.unroute('**/simulation/src/cinema.js');await p.locator('#retry').click();await p.waitForFunction(()=>document.querySelector('#study-loading').hidden,{},{timeout:30000});assert.equal(await p.locator('#play').isDisabled(),false);
 console.log('PASS: navigation during deferred Play/chapter loads, deliberate resume, module-download failure and retry.');
}finally{for(const c of contexts)await c.close();await browser.close();}
