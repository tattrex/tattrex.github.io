import test from 'node:test';
import assert from 'node:assert/strict';
import {createUtterance,voiceFrame,responseFrame,createMotionClock} from '../src/motion.js';

test('voice cadence varies with words and returns to silence',()=>{
 const track=createUtterance('Highlight acute infarct');
 assert.equal(track.words.length,3);
 assert.notDeepEqual(voiceFrame(track,400).bars,voiceFrame(track,700).bars);
 assert.equal(voiceFrame(track,track.duration+10).energy,0);
 assert.equal(voiceFrame(track,track.duration+10).word,2);
});
test('recorded spectrum follows samples, including the silent gaps',()=>{
 const track=createUtterance('Give me MPR',{duration:1000,fps:4,frames:[[0,0],[120,180],[20,40],[0,0]]});
 assert.equal(voiceFrame(track,0).energy,0);
 assert.ok(voiceFrame(track,250).energy>.5);
 assert.equal(voiceFrame(track,750).energy,0);
});
test('response emerges, peaks, then settles to exactly the ordinary rendering',()=>{
 assert.equal(responseFrame(0).reveal,0);
 assert.ok(responseFrame(450).emphasis>.9);
 assert.ok(responseFrame(1200).emphasis<responseFrame(450).emphasis);
 assert.deepEqual(responseFrame(2400),{reveal:1,emphasis:0,phase:'settled'});
});
test('clock freezes at pause, resumes remaining time and ignores stale callbacks after cancellation',()=>{
 let now=0,id=0;const callbacks=new Map(),frames=[];
 const clock=createMotionClock({now:()=>now,request:fn=>{callbacks.set(++id,fn);return id;},cancel:id=>callbacks.delete(id)});
 clock.start(ms=>frames.push(ms));now=400;callbacks.get(id)();
 clock.pause();const count=frames.length;now=2000;assert.equal(frames.length,count);
 clock.resume();now=2100;callbacks.get(id)();assert.equal(frames.at(-1),500);
 const stale=callbacks.get(id);clock.stop();stale();assert.equal(frames.at(-1),500);
 clock.start(ms=>frames.push(ms));assert.equal(frames.at(-1),0);
});
