import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const browser=await chromium.connectOverCDP(process.env.BROWSER_CDP||'http://127.0.0.1:9324');
const base=process.env.SITE_URL||'http://127.0.0.1:4321';
const contexts=[];
async function page(){const c=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});contexts.push(c);return c.newPage();}
const loaded=p=>p.waitForFunction(()=>document.querySelector('#study-loading').hidden,{},{timeout:30000});
const playing=p=>p.waitForFunction(()=>document.querySelector('#play').textContent.includes('Pause'));
try{
 const p=await page();let release;const gate=new Promise(resolve=>release=resolve);
 await p.route('**/public/data/volume.json',async route=>{await gate;await route.continue();});
 await p.goto(base);await p.locator('#experience').scrollIntoViewIfNeeded();await p.waitForFunction(()=>!document.querySelector('#study-loading').hidden);
 await p.locator('#contact').scrollIntoViewIfNeeded();const scroll=await p.evaluate(()=>scrollY);
 release();await loaded(p);
 assert.equal(await p.evaluate(()=>scrollY),scroll,'A deferred download must not pull a visitor back');
 assert.doesNotMatch(await p.locator('#play').textContent(),/Pause/,'Playback must not begin offscreen');
 assert.equal(await p.locator('#experience').getAttribute('data-step'),'-1');
 await p.locator('#experience').scrollIntoViewIfNeeded();await playing(p);
 await p.locator('#contact').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.querySelector('#play').textContent.includes('Continue'));
 await p.locator('#experience').scrollIntoViewIfNeeded();await playing(p);
 await p.locator('#play').click();await p.locator('#contact').scrollIntoViewIfNeeded();await p.locator('#experience').scrollIntoViewIfNeeded();
 await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 assert.match(await p.locator('#play').textContent(),/Continue/,'An explicit pause survives leaving and returning');
 await p.locator('#play').click();await playing(p);
 // Module failures must be retryable without an automatic request loop.
 const failed=await page();let attempts=0;await failed.route('**/simulation/src/cinema.js',route=>{attempts++;return route.abort();});
 await failed.goto(base);await failed.locator('#experience').scrollIntoViewIfNeeded();await failed.waitForFunction(()=>!document.querySelector('#retry').hidden);
 assert.equal(await failed.locator('#experience').getAttribute('aria-busy'),'false');assert.equal(attempts,1);
 await failed.unroute('**/simulation/src/cinema.js');await failed.locator('#retry').click();await loaded(failed);await playing(failed);
 console.log('PASS: viewport autoplay, deferred-load navigation, offscreen suspension/automatic return, persistent manual pause, module failure/retry.');
}finally{for(const c of contexts)await c.close();await browser.close();}
