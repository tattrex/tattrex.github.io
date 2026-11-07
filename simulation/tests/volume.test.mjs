import test from 'node:test';
import assert from 'node:assert/strict';
import {windowValue,slabIndices,samplePlane,planeGeometry,voxelFromPlane} from '../src/volume.js';

const volume={dims:[3,4,5],spacing:[2,3,4],data:Int16Array.from({length:60},(_,i)=>i)};
test('windowing maps HU to the display interval and clamps air and bone',()=>{
 assert.equal(windowValue(-1000,80,40),0);assert.equal(windowValue(40,80,40),129);assert.equal(windowValue(80,80,40),255);
 assert.notEqual(windowValue(500,80,40),windowValue(500,2000,500));assert.throws(()=>windowValue(0,0,40));
});
test('15 mm slabs select voxel centres by physical spacing and clip to bounds',()=>{
 assert.deepEqual(slabIndices(10,1,15,30),[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]);
 assert.deepEqual(slabIndices(2,3,15,10),[0,1,2,3,4]);assert.deepEqual(slabIndices(0,1,15,4),[0,1,2,3]);
 assert.throws(()=>slabIndices(1,0,15,20));
});
test('radiological planes use the same physical voxel with explicit orientation',()=>{
 assert.deepEqual(planeGeometry(volume,'axial').size,[3,4]);assert.deepEqual(planeGeometry(volume,'coronal').spacing,[2,4]);
 assert.deepEqual(voxelFromPlane(volume,'axial',1,0,0),[2,3,1]);
 assert.deepEqual(voxelFromPlane(volume,'coronal',2,0,0),[2,2,4]);
 assert.deepEqual(voxelFromPlane(volume,'sagittal',1,0,0),[1,3,4]);
 assert.equal(samplePlane(volume,'axial',1).values[0],23);
});
test('MIP chooses the highest calibrated voxel along the selected slab',()=>{
 const v={dims:[1,1,5],spacing:[1,1,2],data:Int16Array.of(-30,10,80,20,100)};
 assert.equal(samplePlane(v,'axial',2,{slabMm:4}).values[0],80);
 assert.equal(samplePlane(v,'axial',2,{slabMm:8}).values[0],100);
 assert.equal(samplePlane(v,'axial',0,{slabMm:4}).values[0],10);
});
