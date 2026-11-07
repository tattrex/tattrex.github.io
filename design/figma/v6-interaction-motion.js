// Run after common.js, with captures (image hash + measured bar samples) and tracks.
const screens=await figma.getNodeByIdAsync('5:3'),components=await figma.getNodeByIdAsync('5:2');await figma.setCurrentPageAsync(screens);
for(const n of screens.children.filter(n=>n.name.startsWith('Motion 06 /')))n.remove();
const oldIds=['27:11430','27:11602','27:11774','27:11946','27:12118','27:12290','27:12462','27:12634'];
const names=['Prioritise','Window','Highlight','Project','Reconstruct','Recall','Compare','Report'];
const phases=['Utterance','Emphasis','Settled'];const frames=[],voiceComponents=[];
for(let step=0;step<8;step++){
 const source=await figma.getNodeByIdAsync(oldIds[step]);
 for(let p=0;p<3;p++){
  const capture=captures[step*3+p],root=source.clone();screens.appendChild(root);root.name=`Motion 06 / ${String(step+1).padStart(2,'0')} ${names[step]} / ${phases[p]}`;root.x=32500+p*1600;root.y=160+step*1120;root.reactions=[];
  const voiceInstance=root.findOne(n=>n.name==='Voice instrument / Imaging sequence');const voiceParent=voiceInstance.parent,voiceIndex=voiceParent.children.indexOf(voiceInstance),voiceX=voiceInstance.x,voiceY=voiceInstance.y;
  const voice=voiceInstance.detachInstance();voice.reactions=[];
  const signal=voice.findOne(n=>n.name==='Instrument / Signal');
  signal.children.forEach((bar,i)=>{const sample=capture.bars[i];bar.resize(bar.width,Math.max(3,sample.scale*64));bar.y=(64-bar.height)/2;bar.opacity=sample.opacity;});
  const state=voice.findOne(n=>n.name==='State');state.characters=p===0?'Listening':p===1?'Responding':'In context';
  voice.findOne(n=>n.name==='Instrument / Feedback').opacity=p===0?0:1;
  if(p===0){const command=voice.findOne(n=>n.name==='Instrument / Command');const end=command.characters.indexOf(' ',1);command.setRangeFills(0,end>0?end:command.characters.length,[paint('Text/Accent',true)]);}
  if(p===1)voice.strokes=[paint('Icon/Accent',true)];
  const vc=figma.createComponentFromNode(voice);vc.name=`Step=${String(step+1).padStart(2,'0')}, Phase=${phases[p]}`;components.appendChild(vc);vc.x=9000+p*560;vc.y=1500+step*500;
  for(const [label,layer] of [['Command','Instrument / Command'],['Feedback','Instrument / Feedback']]){const text=vc.findOne(n=>n.name===layer);const key=vc.addComponentProperty(`${String(step+1).padStart(2,'0')} ${label}`,'TEXT',text.characters);text.componentPropertyReferences={characters:key};}
  voiceComponents.push(vc);const vi=vc.createInstance();voiceParent.insertChild(voiceIndex,vi);vi.name='Voice instrument / Imaging sequence';vi.layoutPositioning='ABSOLUTE';vi.x=voiceX;vi.y=voiceY-(p===1?4:0);
  root.findOne(n=>n.name==='Scan / Animated image').fills=[{type:'IMAGE',imageHash:capture.hash,scaleMode:'FIT'}];
  root.findOne(n=>n.name==='Sequence / Progress').characters=`${String(step+1).padStart(2,'0')} / ${names[step].toUpperCase()} · ${phases[p].toUpperCase()}`;
  root.findOne(n=>n.name==='Sequence / Hint').characters=p===0?'Speak the next step':p===1?'The change comes forward':'Back in context';
  frames.push(root);
 }
}
const voiceSet=figma.combineAsVariants(voiceComponents,components);voiceSet.name='Voice instrument / Speak reveal settle';voiceSet.x=9000;voiceSet.y=1500;voiceSet.layoutMode='VERTICAL';spacing(voiceSet,32,32);voiceSet.description='Utterance spectra sampled from local narration. Emphasis lasts 0.7 seconds, settling 1.5 seconds. Live prototype provides continuous timing; Figma exposes editable key poses.';
const move=(id,duration)=>({type:'NODE',destinationId:id,navigation:'NAVIGATE',transition:{type:'SMART_ANIMATE',easing,duration},resetScrollPosition:false});
for(let i=0;i<frames.length;i++){
 const p=i%3,step=Math.floor(i/3),next=frames[(i+1)%frames.length];
 const timeout=p===0?tracks[step].duration/1000+.16:p===1?.3:Math.max(1,7.5-tracks[step].duration/1000-2.16);
 frames[i].reactions=[{trigger:{type:'AFTER_TIMEOUT',timeout},actions:[move(next.id,p===0?.5:p===1?1.2:.3)]}];
 if(i===frames.length-1)frames[i].reactions=[{trigger:{type:'ON_CLICK'},actions:[move(frames[0].id,.3)]}];
}
// Existing review links enter the revised sequence. Main page instances open it directly.
const oldStart=await figma.getNodeByIdAsync(oldIds[0]);oldStart.reactions=[{trigger:{type:'AFTER_TIMEOUT',timeout:.01},actions:[move(frames[0].id,.01)]}];
let linked=0;
for(const root of screens.children.filter(n=>n.name.startsWith('Concept 03'))){
 for(const voice of root.findAll(n=>n.name==='Voice instrument / Imaging sequence')){voice.reactions=[{trigger:{type:'ON_CLICK'},actions:[move(frames[0].id,.5)]}];linked++;}
}
const board=f('Motion direction / Speak, reveal, settle',null,1728,32,48,'Surface/Canvas',true);board.x=32500;board.y=-1800;
await t(board,'Title','Speak. Reveal. Settle.','Heading / Heading 3','Text/Primary',1632,true);
await t(board,'Direction','Every instruction brings its change forward, then gives the image room again.','Body / Body 3','Text/Secondary',1632,true);
const row=f('Motion / Key poses',board,1632,24,0,null,true,'HORIZONTAL');
const labels=['01 / The utterance','02 / The change emerges','03 / Back in context'];
const descriptions=['Measured speech cadence and word emphasis. The scan holds while the command is spoken.','The actual mask boundary appears first. Its fill strengthens briefly while remaining aligned to the CT.','The mask returns to its normal opacity. The spectrum quiets, leaving time to inspect.'];
for(let p=0;p<3;p++){
 const col=f('Motion / '+phases[p],row,528,16);await t(col,'Label',labels[p],'Title / Title 3','Text/Primary',528,true);
 const img=imageBox(col,'Scan / '+phases[p],528,426);img.fills=[{type:'IMAGE',imageHash:captures[6+p].hash,scaleMode:'FIT'}];
 await t(col,'Description',descriptions[p],'Body / Body 3','Text/Secondary',528,true);
}
await t(board,'Timing','Voice: phrase length  ·  Response: 0.7 s  ·  Settle: 1.5 s  ·  Then quiet inspection','Body / Body 3','Text/Primary',1632,true);
await t(board,'Operations','Window values interpolate. MIP gathers adjacent source slices. MPR unfolds into three planes. Priors arrive alongside the current CT. Comparison briefly brackets the linked region. Report feedback comes forward while the images remain.','Body / Body 3','Text/Secondary',1632,true);
const note=await t(board,'Preview','Play the live study for continuous speech spectra and exact canvas timing. These editable Figma key poses communicate the visual rhythm.','Body / Body 3','Text/Secondary',1632,true);note.setRangeHyperlink(0,note.characters.length,{type:'URL',value:'http://127.0.0.1:4173/'});
figma.currentPage.selection=[board];figma.viewport.scrollAndZoomIntoView([board]);
print('MOTION_RESULT:'+JSON.stringify({board:board.id,voiceSet:voiceSet.id,frames:frames.map((n,i)=>({id:n.id,step:Math.floor(i/3),phase:phases[i%3]})),mainScenesLinked:linked}));
