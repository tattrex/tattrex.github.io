import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const browser=await chromium.connectOverCDP(process.env.BROWSER_CDP||'http://127.0.0.1:9324');
const base=process.env.SITE_URL||'http://127.0.0.1:4321',contexts=[];
try{
 for(const {width,dpr,hero,atlas} of [
  {width:1440,dpr:1,hero:1440,atlas:1280},
  {width:1440,dpr:2,hero:2880,atlas:2560},
  {width:1440,dpr:3,hero:3840,atlas:3840},
  {width:390,dpr:3,hero:2560,atlas:2560}
 ]){
  const c=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:dpr,reducedMotion:'reduce'});contexts.push(c);
  const page=await c.newPage();await page.goto(base);await page.locator('.hero-art img').evaluate(img=>img.decode());
  assert.match(await page.locator('.hero-art img').evaluate(img=>img.currentSrc),new RegExp(`hero-${hero}-`));
  await page.locator('.research-atlas').scrollIntoViewIfNeeded();await page.locator('.research-atlas>img').evaluate(img=>img.decode());
  assert.match(await page.locator('.research-atlas>img').evaluate(img=>img.currentSrc),new RegExp(`atlas-${atlas}-`));
  const sharp=await page.locator('.research-atlas>img').evaluate(async img=>{const source=new Image();source.src=img.currentSrc;await source.decode();return {pixels:source.naturalWidth,required:img.getBoundingClientRect().width*devicePixelRatio};});
  assert.ok(sharp.pixels>=Math.min(sharp.required,3840),'The cropped atlas must select enough pixels for its full rendered width');
  if(dpr===2)await page.locator('.research-atlas').screenshot({path:'artifacts/atlas-retina.png'});
  await c.close();
 }
 console.log('PASS: 1x/2x/3x artwork selection, 4K maximum and correctly sized cropped atlas; mobile uses a responsive variant.');
}finally{for(const c of contexts)await c.close();await browser.close();}
