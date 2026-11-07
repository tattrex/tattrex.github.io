import test from 'node:test';import assert from 'node:assert/strict';
import {parseCommand,reduceCommand,initialState} from '../src/commands.js';
const meta={dims:[160,232,160],initialPoint:[70,137,65],lesionPoint:[43,111,82],ventricularPoint:[70,137,65]};
const run=(s,text)=>reduceCommand(s,parseCommand(text),meta);
test('recognises the requested workflow including spoken MIP and MPR',()=>{
 assert.deepEqual(parseCommand('create MIP on 15mm'),{type:'mip',mm:15});
 assert.deepEqual(parseCommand('create a maximum intensity projection at fifteen millimeters'),{type:'mip',mm:15});
 assert.equal(parseCommand('give me M P R').type,'mpr');assert.equal(parseCommand('change it to brain window').preset,'brain');
 assert.equal(parseCommand('highlight acute infarct in the scan').type,'overlay');
});
test('opening the most critical case produces the priority notification',()=>{
 const r=run(initialState(),'open the most critical patient');assert.equal(r.state.open,true);assert.equal(r.state.priority,true);assert.match(r.notification,/Demo patient 01/);
});
test('does not claim a viewer operation succeeded before opening a case',()=>{
 const r=run(initialState(),'give me MPR');assert.equal(r.state.mode,'axial');assert.match(r.message,/Open/);
});
test('full sequence preserves window and activates linked comparison and report',()=>{
 let s=initialState();for(const cmd of ['open the most critical patient','brain window','MIP 15 mm','give me MPR','pull up priors','compare ventricular region across time','draft a report'])s=run(s,cmd).state;
 assert.equal(s.window,'brain');assert.equal(s.priors,true);assert.equal(s.compare,true);assert.deepEqual(s.point,meta.ventricularPoint);assert.equal(s.report,true);assert.equal(s.slabMm,0);
});
test('infarct overlay focuses on the reference lesion location and can be hidden',()=>{
 let s=run(initialState(),'open patient').state;s=run(s,'highlight acute infarct').state;assert.equal(s.overlay,true);assert.deepEqual(s.point,meta.lesionPoint);assert.equal(s.window,'brain');
 s=run(s,'hide overlay').state;assert.equal(s.overlay,false);
});
test('rejects negated, unsupported and out-of-range commands without mutation',()=>{
 let s=run(initialState(),'open patient').state;
 for(const command of ['do not open priors','MIP 200 mm','delete this patient','banana'])assert.deepEqual(run(s,command).state,s);
 assert.equal(parseCommand('show MIP').mm,15);
});
test('slice movement clamps and reset restores a clean state',()=>{
 let s=run(initialState(),'open patient').state;s=run(s,'slice 9999').state;assert.equal(s.point[2],159);
 assert.deepEqual(run(s,'reset demo').state,initialState());
});
test('dictated report text remains plain data',()=>{
 assert.deepEqual(parseCommand('Add to findings: <script>test</script>'),{type:'dictate',text:'<script>test</script>'});
});
test('opening a prior study retrieves the prior rather than reopening the patient',()=>{assert.deepEqual(parseCommand('open prior study'),{type:'priors'});});
