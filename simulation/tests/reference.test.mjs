import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {gunzipSync} from 'node:zlib';
import {sampleMaskPlane} from '../src/volume.js';import {initialState,parseCommand,reduceCommand} from '../src/commands.js';
test('mask projection preserves selected classes rather than taking the largest category',()=>{
 const mask={dims:[1,1,3],spacing:[1,1,1],data:new Uint8Array([1,2,0])};
 assert.deepEqual([...sampleMaskPlane(mask,'axial',1,{slabMm:3,labels:[1]}).values],[1]);
 assert.deepEqual([...sampleMaskPlane(mask,'axial',1,{slabMm:3,labels:[1,2]}).values],[3]);
});
test('the published volume carries real source provenance and separate core/penumbra labels',async()=>{
 const base=new URL('../public/data/',import.meta.url),meta=JSON.parse(await readFile(new URL('volume.json',base),'utf8'));
 assert.equal(meta.source,'CPAISD');assert.equal(meta.license,'CC-BY-4.0');assert.equal(meta.maskProvenance,'Expert reference annotation');assert.equal(meta.currentAltered,false);assert.equal(meta.priorIsSynthetic,true);
 const mask=gunzipSync(await readFile(new URL(meta.files.mask,base)));assert.equal(mask.length,meta.dims.reduce((a,b)=>a*b,1));assert.deepEqual([...new Set(mask)].sort(),[0,1,2]);
 const [x,y,z]=meta.lesionPoint;assert.equal(mask[x+meta.dims[0]*(y+meta.dims[1]*z)],1);
});
test('core and penumbra commands disclose reference annotations without calling them model predictions',()=>{
 const meta={dims:[256,256,113],initialPoint:[170,130,64],lesionPoint:[170,130,64],ventricularPoint:[127,130,64],maskProvenance:'Expert reference annotation'};
 let state=reduceCommand(initialState(),parseCommand('open patient'),meta).state;
 let result=reduceCommand(state,parseCommand('show core and penumbra'),meta);assert.equal(result.state.overlay,true);assert.equal(result.state.maskMode,'both');assert.match(result.message,/reference/i);
 result=reduceCommand(result.state,parseCommand('highlight acute infarct'),meta);assert.equal(result.state.maskMode,'core');
});
