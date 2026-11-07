const pages={screens:await figma.getNodeByIdAsync('5:3'),components:await figma.getNodeByIdAsync('5:2')};
await figma.setCurrentPageAsync(pages.components);
const source=await figma.getNodeByIdAsync('27:7058'),navSet=await figma.getNodeByIdAsync('27:4973');
const nav=navSet.children.find(n=>n.name==='State=Default'),navKey=Object.keys(navSet.componentPropertyDefinitions).find(k=>k.startsWith('Label'));
const states=[];
for(const [mode,label,command,feedback] of [['Navigate','Listening','“Open the current study”','From your intent to the study.'],['Compare','Comparing','“Bring up the prior”','Comparison in the same reading flow.'],['Report','Reporting','“Start my report”','Capture the thought, then review it.'],['Loading','Connecting','Opening the workspace','Your study context is being prepared.'],['Empty','Ready when you are','Start with a study','Open a study to begin your voice workflow.'],['Error','Connection interrupted','Voice is unavailable','Reconnect to continue, or use the workspace controls.']]){
 const clone=source.clone();pages.components.appendChild(clone);const c=figma.createComponentFromNode(clone);c.name='Mode='+mode;c.layoutSizingVertical='HUG';
 c.findOne(n=>n.name==='State').characters=label;c.findOne(n=>n.name==='Instrument / Command').characters=command;c.findOne(n=>n.name==='Instrument / Feedback').characters=feedback;
 const wave=c.findOne(n=>n.name==='Instrument / Signal');wave.clipsContent=true;for(const n of wave.children)n.opacity=mode==='Loading'?.25:mode==='Empty'?.15:mode==='Error'?.1:1;
 for(const child of c.children)child.layoutSizingHorizontal='FILL';
 const modes=c.findOne(n=>n.name==='Instrument / Workflow sequence');for(const n of [...modes.children])n.remove();
 for(const label of ['01 Navigate','02 Compare','03 Report']){const n=await t(modes,'Step / '+label,label,'Caption / Caption 3','Text/Secondary',undefined,true);n.layoutSizingHorizontal='FILL';}
 states.push(c);
}
const set=figma.combineAsVariants(states,pages.components);set.name='Voice instrument / Workflow and data states';set.layoutMode='VERTICAL';spacing(set,32,32);set.fills=[];set.x=6300;set.y=160;
for(const c of states)for(const field of ['Command','Feedback']){const node=c.findOne(n=>n.name==='Instrument / '+field);const key=set.addComponentProperty(c.name.split('=')[1]+' '+field.toLowerCase(),'TEXT',node.characters);node.componentPropertyReferences={characters:key};}
for(let i=0;i<3;i++)states[i].reactions=[{trigger:i===2?{type:'ON_CLICK'}:{type:'AFTER_TIMEOUT',timeout:2},actions:[{type:'NODE',destinationId:states[(i+1)%3].id,navigation:'CHANGE_TO',transition:{...trans,duration:.5}}]}];
await figma.setCurrentPageAsync(pages.screens);
const replacements=[];
for(const id of ['27:7058','27:7159','27:7282']){const old=await figma.getNodeByIdAsync(id),parent=old.parent,pos={x:old.x,y:old.y,w:old.width};const n=states[1].createInstance();parent.appendChild(n);n.layoutPositioning='ABSOLUTE';n.name='Voice instrument / Interactive workflow';n.resize(pos.w,n.height);n.layoutSizingVertical='HUG';n.x=pos.x;n.y=pos.y;old.remove();replacements.push({id:n.id,parent:parent.id});}
print('V3_VOICE:'+JSON.stringify({setId:set.id,modes:states.map(n=>({id:n.id,name:n.name})),replacements}));
