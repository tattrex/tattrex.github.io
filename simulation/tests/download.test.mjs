import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {loadDemoVolumes} from '../src/volume.js';
const base=new URL('../public/data/',import.meta.url);
test('the compressed prior delta recreates the original comparison voxel for voxel',async()=>{
 const meta=JSON.parse(await readFile(new URL('volume.json',base)));
 assert.ok(meta.files.priorDelta,'The duplicate prior must use a lossless delta');
 const requested=[];
 const fetcher=async url=>{requested.push(url.pathname.split('/').pop());return new Response(await readFile(url));};
 const volumes=await loadDemoVolumes(base,fetcher);
 const actual=createHash('sha256').update(Buffer.from(volumes.prior.data.buffer)).digest('hex');
 assert.equal(actual,'820584063b7ce6126a8d64505a18dacc9baabf7696459a58663325f616f237d0');
 const current=gunzipSync(await readFile(new URL(meta.files.current,base)));
 assert.deepEqual(Buffer.from(volumes.current.data.buffer),current);
 assert.ok(!requested.includes('prior.raw.gz'));
 const total=(await Promise.all(requested.map(async file=>(await readFile(new URL(file,base))).length))).reduce((a,b)=>a+b,0);
 assert.ok(total<10_000_000,'The complete study should transfer less than 10 MB');
});
test('an incomplete prior delta rejects instead of rendering corrupted anatomy',async()=>{
 const meta=JSON.parse(await readFile(new URL('volume.json',base)));
 const fetcher=async url=>{if(url.pathname.endsWith(meta.files.priorDelta))return new Response(await readFile(new URL(meta.files.mask,base)));return new Response(await readFile(url));};
 await assert.rejects(loadDemoVolumes(base,fetcher),/incomplete/);
});
