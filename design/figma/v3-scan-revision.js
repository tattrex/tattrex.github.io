// Replace abstract anatomy with generated scan imagery. Preserve native layouts and flows.
const screens=await figma.getNodeByIdAsync('5:3'),components=await figma.getNodeByIdAsync('5:2');
const assets=[['ct-chest','CT / Chest','Axial · Lung window','82fc0bd7a5e54e1dcaca4233a0b70cdf98db5e5f'],['mri-brain','MR / Brain','Axial · T2','e5924669157af58467ea80c11543f741a1001cee'],['mri-spine','MR / Lumbar spine','Sagittal · T2','c1bf6809aaf75b1bfce6561981b12c689a74de9b'],['xray-chest','X ray / Chest','Frontal','b7b108924c21d7cfaa6d321fc959e01d549f7e0e']];
const masters={},keys={};
await figma.setCurrentPageAsync(components);
for(let i=0;i<assets.length;i++){
 const [key,title,sequence,hash]=assets[i];const frame=f('Scan / '+key,null,400,12,16,'Surface/Canvas',true);frame.resize(400,432);frame.layoutSizingVertical='FIXED';frame.strokes=[paint('Border/Primary',true)];frame.strokeWeight=1;radius(frame,4);
 const header=f('Scan / Header',frame,368,16,0,null,true,'HORIZONTAL');header.layoutSizingHorizontal='FILL';header.counterAxisAlignItems='CENTER';
 const label=await t(header,'Scan / Title',title,'Caption / Caption 3','Text/Primary',undefined,true);label.layoutSizingHorizontal='FILL';const detail=await t(header,'Scan / Sequence',sequence,'Caption / Caption 5','Text/Secondary',undefined,true);
 const img=imageBox(frame,'Scan / Synthetic image',368,368);img.fills=[{type:'IMAGE',imageHash:hash,scaleMode:'FIT'}];img.layoutSizingHorizontal='FILL';img.layoutSizingVertical='FILL';
 const c=figma.createComponentFromNode(frame);c.name='Imaging / '+title;c.x=7100+(i%2)*480;c.y=160+Math.floor(i/2)*520;
 const titleKey=c.addComponentProperty('Title','TEXT',title),detailKey=c.addComponentProperty('Sequence','TEXT',sequence),showKey=c.addComponentProperty('Show sequence','BOOLEAN',true);
 c.findOne(n=>n.name==='Scan / Title').componentPropertyReferences={characters:titleKey};c.findOne(n=>n.name==='Scan / Sequence').componentPropertyReferences={characters:detailKey,visible:showKey};masters[key]=c;keys[key]={titleKey,detailKey,showKey};
}
await figma.setCurrentPageAsync(screens);
function abs(n,x,y){n.layoutPositioning='ABSOLUTE';n.x=x;n.y=y;return n;}
function pane(parent,key,w,x,y,h=w+32){const n=masters[key].createInstance();parent.appendChild(n);n.name='Imaging / '+key;n.layoutPositioning='AUTO';n.resize(w,h);n.setProperties({[keys[key].showKey]:w>=300});if(x!==undefined)abs(n,x,y);return n;}
function fit(n,hash){n.fills=[{type:'IMAGE',imageHash:hash,scaleMode:'FIT'}];}
const roots=screens.children.filter(n=>n.name.startsWith('Concept 03')&&!n.name.includes('/ Review /'));
let heroCount=0,viewerCount=0,atlasCount=0;
for(const root of roots){
 const heroes=root.name.includes('/ Story / 01')?[root]:root.findAll(n=>n.name==='01 / See / The living atlas');
 for(const h of heroes){
  const old=h.findOne(n=>n.name==='Hero / Porcelain tomography sculpture');if(!old)continue;old.remove();const w=h.width,small=w===390,tablet=w===768;
  const primary=pane(h,'mri-brain',small?342:tablet?448:560,small?24:tablet?272:800,small?224:tablet?344:144);h.insertChild(0,primary);
  const inset=pane(h,'ct-chest',small?144:tablet?240:248,small?222:tablet?48:584,small?408:tablet?512:216);h.insertChild(1,inset);
  h.findOne(n=>n.name==='Hero / Artistic caption').characters='Generated imaging examples · no patient data';heroCount++;
 }
 for(const viewport of root.findAll(n=>n.name==='Stage / Active imaging viewport')){
  const img=viewport.findOne(n=>n.name==='Viewport / Artistic full body volume');if(!img)continue;const w=viewport.width,h=viewport.height,desktop=w>700,size=desktop?512:Math.min(w-32,h-104);fit(img,assets[0][3]);img.name='Viewport / Synthetic axial chest CT';img.resize(size,size);img.x=desktop?16:(w-size)/2;img.y=desktop?96:64;
  const scan=viewport.findOne(n=>n.name==='Viewport / Active scan plane');if(scan)scan.remove();viewport.findOne(n=>n.name==='Study').characters='CT / Chest';viewport.findOne(n=>n.name==='Label').characters='Axial · Lung window';viewport.findOne(n=>n.name==='Viewport / Annotation').characters='Synthetic example · no patient data';
  const scene=viewport.parent,prior=scene.findOne(n=>n.name==='Stage / Prior inset');if(prior){prior.x=1056;prior.y=448;prior.resize(224,prior.height);const holder=prior.findOne(n=>n.name==='Prior / Image crop');holder.resize(192,144);const a=holder.children[0];a.resize(144,144);a.x=24;a.y=0;fit(a,assets[0][3]);prior.findOne(n=>n.name==='Label').characters='Prior view · demo';}
  viewerCount++;
 }
 for(const atlas of root.findAll(n=>n.name==='Labs / A living atlas')){
  for(const child of [...atlas.children])child.remove();const small=atlas.width<400;spacing(atlas,24,24);atlas.layoutSizingVertical='HUG';atlas.clipsContent=false;
  const cw=atlas.width-48;const heading=f('Atlas / Label',atlas,cw,16,0,null,true,'HORIZONTAL');heading.primaryAxisAlignItems='SPACE_BETWEEN';await t(heading,'Title','Imaging is our medium','Caption / Caption 1','Text/Primary',undefined,true);await t(heading,'Index','[ 03 ]','Caption / Caption 3','Text/Accent',undefined,true);
  const grid=f('Atlas / Modalities',atlas,cw,16);for(let row=0;row<2;row++){const r=f('Atlas / Row '+row,grid,cw,16,0,null,true,'HORIZONTAL');for(let col=0;col<2;col++){const key=assets[row*2+col][0];pane(r,key,(cw-16)/2,undefined,undefined,small?180:280);}}
  await t(atlas,'Caption','Generated imaging examples · not patient data','Caption / Caption 5','Text/Secondary',cw,true);atlasCount++;
 }
 for(const note of root.findAll(n=>n.name==='Platform / Concept note'))note.characters='Interface concept informed by v0.1. Generated scans are illustrative, not patient data.';
}
const discover=await figma.getNodeByIdAsync('27:9785');discover.findOne(n=>n.name==='Atlas / Full body research world').remove();const territories=discover.findOne(n=>n.name==='Discover / Research territories');territories.x=80;territories.y=584;territories.fills=[];
pane(discover,'mri-brain',448,576,144);pane(discover,'ct-chest',280,1080,144);pane(discover,'mri-spine',216,656,648);pane(discover,'xray-chest',280,1080,520);
const caption=await t(discover,'Imaging / Provenance','Generated imaging examples · no patient data','Caption / Caption 5','Text/Secondary',600,true);abs(caption,576,888);
const board=await figma.getNodeByIdAsync('27:9954');board.findOne(n=>n.name==='Direction').characters='The revised concept grounds the brand in familiar CT, MRI and radiography. Generated scan examples replace the abstract sculptures in the opening, the study viewer and the research atlas. Platform and Labs remain equally prominent.';
const hero=await figma.getNodeByIdAsync('27:6361');const hash=figma.createImage(await hero.exportAsync({format:'PNG',constraint:{type:'WIDTH',value:1344}})).hash;board.findOne(n=>n.name==='Review / Opening preview').fills=[{type:'IMAGE',imageHash:hash,scaleMode:'FIT'}];
figma.currentPage.selection=[hero];figma.viewport.scrollAndZoomIntoView([hero]);
print('SCAN_REVISION:'+JSON.stringify({heroCount,viewerCount,atlasCount,masters:Object.fromEntries(Object.entries(masters).map(([k,v])=>[k,v.id]))}));
