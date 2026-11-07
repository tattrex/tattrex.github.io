const screens=await figma.getNodeByIdAsync('5:3'),components=await figma.getNodeByIdAsync('5:2');await figma.setCurrentPageAsync(screens);
const set=await figma.getNodeByIdAsync('27:10974');
const feedback={
 '03':'The published stroke core mask, aligned to the real CT. Review the annotation in context.',
 '06':'An illustrative prior beside the source CT. This dataset has no real earlier exam.',
 '07':'The same region, aligned to an illustrative prior. No real interval change is claimed.',
 '08':'The reference annotation carried into a draft, ready for your review.'
};
for(const [key,definition] of Object.entries(set.componentPropertyDefinitions))for(const [step,text] of Object.entries(feedback))if(key.startsWith(step+' Feedback'))set.editComponentProperty(key,{defaultValue:text});
let updated=0;
for(const root of screens.children.filter(n=>n.name.startsWith('Concept 03')||n.name.startsWith('Concept 04 / Voice sequence'))){
 const match=root.name.match(/Voice sequence \/ (\d+)/);const step=match?Number(match[1])-1:2;
 for(const scene of root.findAll(n=>n.name==='Stage / Imaging sequence')){
  scene.findOne(n=>n.name==='Scan / Animated image').fills=[{type:'IMAGE',imageHash:hashes[step].hash,scaleMode:'FIT'}];
  scene.findOne(n=>n.name==='Label').characters=step===2?'Core reference mask':step===3?'MIP · 15 mm':step===4?'MPR':step>=5?'Source + illustrative prior':'CT brain';
  const note=scene.findOne(n=>n.name==='Viewport / Annotation');note.characters='CPAISD · Expert reference mask · CC BY 4.0';note.setRangeHyperlink(0,note.characters.length,{type:'URL',value:'https://zenodo.org/records/10892316'});updated++;
 }
 for(const note of root.findAll(n=>n.name==='Platform / Concept note')){note.characters='Source CT and expert masks: CPAISD, Umerenkov et al. (2024), CC BY 4.0. Resampled for display. AI actions and the prior comparison are illustrative.';note.setRangeHyperlink(0,note.characters.length,{type:'URL',value:'https://zenodo.org/records/10892316'});}
}
const both=(await figma.getNodeByIdAsync('27:11774')).clone();screens.appendChild(both);both.name='Concept 04 / Reference masks / Core and penumbra';both.x=27400;both.y=2560;both.reactions=[];
both.findOne(n=>n.name==='Scan / Animated image').fills=[{type:'IMAGE',imageHash:hashes[8].hash,scaleMode:'FIT'}];both.findOne(n=>n.name==='Label').characters='Core + penumbra';
const voice=both.findOne(n=>n.name==='Voice instrument / Imaging sequence');const props={};for(const key of Object.keys(voice.componentProperties)){if(key.startsWith('03 Command'))props[key]='“Show core and penumbra”';if(key.startsWith('03 Feedback'))props[key]='Published reference annotations: coral for core, gold for penumbra. These are not live model predictions.';}voice.setProperties(props);voice.reactions=[];
const heading=both.findOne(n=>n.name==='Sequence / Progress');heading.characters='REFERENCE MASKS / CPAISD';both.findOne(n=>n.name==='Sequence / Hint').characters='Original CT with matched expert annotations';
await figma.setCurrentPageAsync(components);
const raw=f('Imaging / CPAISD / Source with reference layers',null,512,0,0,'Surface/Canvas',true);raw.resize(512,512);raw.layoutSizingVertical='FIXED';raw.x=9000;raw.y=160;
const layers=[];for(const [name,hash] of [['Source CT',sourceHashes[0]],['Penumbra reference',sourceHashes[2]],['Core reference',sourceHashes[1]]]){const n=imageBox(raw,name,512,512);n.fills=[{type:'IMAGE',imageHash:hash,scaleMode:'FIT'}];n.layoutPositioning='ABSOLUTE';n.x=0;n.y=0;layers.push(n);}
const component=figma.createComponentFromNode(raw);component.name='Imaging / CPAISD / Source and expert masks';
for(const [name,node,on] of [['Show core',layers[2],true],['Show penumbra',layers[1],false]]){const key=component.addComponentProperty(name,'BOOLEAN',on);node.componentPropertyReferences={visible:key};node.visible=on;}
await figma.setCurrentPageAsync(screens);
const board=f('Reference imagery / CPAISD provenance',null,1728,32,48,'Surface/Canvas',true);board.x=25400;board.y=2560;
await t(board,'Title','Real abnormalities. Matched reference masks.','Heading / Heading 3','Text/Primary',1632,true);
await t(board,'Source','CPAISD · Non contrast CT · Umerenkov et al. (2024) · CC BY 4.0','Body / Body 3','Text/Secondary',1632,true);
const row=f('Reference / Comparisons',board,1632,24,0,null,true,'HORIZONTAL');
for(const [title,core,penumbra] of [['Source CT',false,false],['Expert core annotation',true,false],['Core and penumbra',true,true]]){const col=f('Reference / '+title,row,512,16);await t(col,'Label',title,'Title / Title 3','Text/Primary',512,true);const instance=component.createInstance();col.appendChild(instance);instance.layoutPositioning='AUTO';const props={};for(const key of Object.keys(component.componentPropertyDefinitions))props[key]=key.startsWith('Show core')?core:penumbra;instance.setProperties(props);}
const note=await t(board,'Attribution','Original CT and published expert masks are pixel aligned. Masks were drawn by the dataset radiologist with CT perfusion as reference. No synthetic lesion is added. These are dataset annotations, not Tattrex predictions.','Body / Body 3','Text/Secondary',1632,true);note.setRangeHyperlink(0,note.characters.length,{type:'URL',value:'https://zenodo.org/records/10892316'});
figma.currentPage.selection=[both];figma.viewport.scrollAndZoomIntoView([both]);
print('REFERENCE_UPDATE:'+JSON.stringify({scenesUpdated:updated,bothFrame:both.id,sourceComponent:component.id,referenceBoard:board.id}));
