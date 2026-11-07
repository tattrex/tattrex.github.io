const screens=await figma.getNodeByIdAsync('5:3'),components=await figma.getNodeByIdAsync('5:2');
const journey=[
 ['Prioritise','Open the most critical patient','AI identified Demo patient 01 as highest priority. Opening the study.'],
 ['Navigate','Change it to brain window','Brain window applied. Stay with the subtle details.'],
 ['Identify','Highlight acute infarct','A simulated infarct is highlighted. Review the finding in context.'],
 ['Project','Create MIP on 15 mm','A 15 millimetre maximum intensity projection.'],
 ['Reconstruct','Give me MPR','One finding, seen in axial, coronal and sagittal planes.'],
 ['Recall','Pull up priors','The prior exam, alongside the current study.'],
 ['Compare','Compare the ventricular region across time','The same region, aligned across a simulated interval.'],
 ['Report','Draft the report','Findings carried into a draft, ready for your review.']
];
function abs(n,x,y){n.layoutPositioning='ABSOLUTE';n.x=x;n.y=y;return n;}
await figma.setCurrentPageAsync(components);
const source=await figma.getNodeByIdAsync('27:7577'),states=[];
for(let i=0;i<journey.length;i++){
 const [phase,command,response]=journey[i];const c=source.clone();components.appendChild(c);c.name='Step='+String(i+1).padStart(2,'0');c.reactions=[];
 for(const n of c.findAll())if(n.componentPropertyReferences&&Object.keys(n.componentPropertyReferences).length)n.componentPropertyReferences={};
 c.findOne(n=>n.name==='State').characters=phase;c.findOne(n=>n.name==='Instrument / Command').characters='“'+command+'”';c.findOne(n=>n.name==='Instrument / Feedback').characters=response;
 for(const bar of c.findOne(n=>n.name==='Instrument / Signal').children)bar.opacity=1;
 const footer=c.findOne(n=>n.name==='Instrument / Workflow sequence');for(const n of [...footer.children])n.remove();await t(footer,'Moment',String(i+1).padStart(2,'0')+' / 08','Caption / Caption 3','Text/Secondary',undefined,true);await t(footer,'Phase',phase,'Caption / Caption 3','Text/Secondary',undefined,true);footer.primaryAxisAlignItems='SPACE_BETWEEN';states.push(c);
}
const set=figma.combineAsVariants(states,components);set.name='Voice instrument / Imaging sequence';set.layoutMode='VERTICAL';spacing(set,32,32);set.fills=[];set.x=8200;set.y=160;
for(let i=0;i<states.length;i++)for(const field of ['Command','Feedback']){const n=states[i].findOne(n=>n.name==='Instrument / '+field);const key=set.addComponentProperty(String(i+1).padStart(2,'0')+' '+field,'TEXT',n.characters);n.componentPropertyReferences={characters:key};}
await figma.setCurrentPageAsync(screens);
function setScene(scene,index){
 for(const n of [...scene.children])if(n.name==='Stage / Prior inset'||n.name==='Stage / Report context')n.remove();
 const viewport=scene.findOne(n=>n.name==='Stage / Active imaging viewport');viewport.name='Stage / Imaging sequence';viewport.strokes=[];
 const img=viewport.findOne(n=>n.type==='RECTANGLE'&&n.name.startsWith('Viewport /'));img.name='Scan / Animated image';img.fills=[{type:'IMAGE',imageHash:hashes[index].hash,scaleMode:'FIT'}];img.resize(viewport.width,viewport.height-90);abs(img,0,58);
 viewport.findOne(n=>n.name==='Study').characters='CT / Brain';viewport.findOne(n=>n.name==='Label').characters=index===2?'Simulated AI overlay':index===3?'MIP · 15 mm':index===4?'MPR':index>=5?'Current and prior':'Brain study';viewport.findOne(n=>n.name==='Viewport / Annotation').characters='Illustrative workflow · Simulated AI';
 const old=scene.findOne(n=>n.name.startsWith('Voice instrument /'));const {x,y,width}=old;const voice=states[index].createInstance();scene.appendChild(voice);voice.name='Voice instrument / Imaging sequence';voice.layoutPositioning='ABSOLUTE';voice.resize(width,voice.height);voice.layoutSizingVertical='HUG';voice.x=x;voice.y=y;old.remove();return voice;
}
const scenes=screens.findAll(n=>n.name==='Platform / Reading room stage');const voices=[];for(const scene of scenes){voices.push(setScene(scene,2));}
for(const note of screens.findAll(n=>n.name==='Platform / Concept note'))note.characters='Imaging and voice sequence. AI findings and interval change are simulated for this concept.';
const origin=await figma.getNodeByIdAsync('27:9665');const flow=[];
for(let i=0;i<8;i++){
 const frame=origin.clone();screens.appendChild(frame);frame.name='Concept 04 / Voice sequence / '+String(i+1).padStart(2,'0')+' '+journey[i][0];frame.x=25400+(i%4)*1600;frame.y=160+Math.floor(i/4)*1200;frame.reactions=[];
 const scene=frame.findOne(n=>n.name==='Platform / Reading room stage');const vp=scene.findOne(n=>n.name==='Stage / Imaging sequence');vp.name='Stage / Active imaging viewport';vp.findOne(n=>n.name==='Scan / Animated image').name='Viewport / Existing image';const voice=setScene(scene,i);
 const rail=frame.findOne(n=>n.name==='Chapter index / See Work Discover');for(const n of [...rail.children])n.remove();const cap=await t(rail,'Sequence / Progress',String(i+1).padStart(2,'0')+' / 08  ·  '+journey[i][0],'Caption / Caption 1','Text/Secondary',undefined,true);cap.layoutSizingHorizontal='FILL';await t(rail,'Sequence / Hint',i===7?'Click to replay the sequence':'The next thought, in motion','Caption / Caption 3','Text/Secondary',undefined,true);
 const nav=frame.findOne(n=>n.name==='Navigation / Floating chapter bar');if(nav)nav.remove();const index=frame.findOne(n=>n.name==='Atlas / Index');index.characters='[ VOICE ]';flow.push({frame,voice});
}
for(let i=0;i<flow.length;i++){
 const destination=flow[(i+1)%flow.length].frame.id,action={type:'NODE',destinationId:destination,navigation:'NAVIGATE',transition:{type:'DISSOLVE',easing:{type:'EASE_IN_AND_OUT'},duration:.6}};
 flow[i].frame.reactions=i<7?[{trigger:{type:'AFTER_TIMEOUT',timeout:7.5},actions:[action]}]:[{trigger:{type:'ON_CLICK'},actions:[action]}];
}
for(const voice of voices)voice.reactions=[{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:flow[0].frame.id,navigation:'NAVIGATE',transition:{type:'DISSOLVE',easing:{type:'EASE_IN_AND_OUT'},duration:.4}}]}];
const existing=screens.flowStartingPoints.filter(p=>p.name!=='Concept 04 / Image and voice sequence');screens.flowStartingPoints=[...existing,{nodeId:flow[0].frame.id,name:'Concept 04 / Image and voice sequence'}];
figma.currentPage.selection=[flow[2].frame];figma.viewport.scrollAndZoomIntoView([flow[2].frame]);
print('VOICE_SEQUENCE:'+JSON.stringify({component:set.id,states:states.map(n=>n.id),frames:flow.map(o=>({id:o.frame.id,name:o.frame.name})),scenesUpdated:voices.length}));
