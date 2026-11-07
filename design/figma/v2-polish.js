await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:3'));
const out=[];
for(const id of ['27:3665','27:3881','27:4083']){
 const root=await figma.getNodeByIdAsync(id);
 const viewer=root.findOne(n=>n.name==='Workspace / Imaging viewport');
 const image=viewer.findOne(n=>n.name==='Viewport / Illustrative anatomy');
 const artWidth=viewer.height*1.75;image.resize(artWidth,viewer.height);image.x=viewer.width/2-artWidth*.75;image.y=0;image.fills=[{type:'IMAGE',imageHash:'1d52f8edbb34c02422ed99555f014c3340926a4e',scaleMode:'FILL'}];
 const prior=root.findOne(n=>n.name==='Prior / Concept anatomy');
 if(prior){const parent=prior.parent;const index=parent.children.indexOf(prior);const holder=f('Prior / Clipped volume',null,152,0);holder.resize(152,124);holder.layoutSizingVertical='FIXED';holder.clipsContent=true;parent.insertChild(index,holder);holder.appendChild(prior);prior.layoutPositioning='ABSOLUTE';prior.resize(217,124);prior.x=-80;prior.y=0;prior.fills=[{type:'IMAGE',imageHash:'1d52f8edbb34c02422ed99555f014c3340926a4e',scaleMode:'FILL'}];}
 const atlas=root.findOne(n=>n.name==='Labs / Spatial research atlas');
 for(const n of atlas.children.filter(n=>n.type==='FRAME'&&n.name.startsWith('Atlas / '))){n.fills=[];n.strokes=[];if(n.name==='Atlas / Imaging representations')n.y=520;const label=n.findOne(n=>n.type==='TEXT');label.fills=[paint('Text/Secondary',true)];line(n,248,true);}
 const text=root.findOne(n=>n.name==='Concept note');text.characters='Interface concept informed by the v0.1 demo. Anatomy is artistic, not a clinical image.';
 out.push({id,width:root.width,height:root.height});
}
print('V2_POLISH:'+JSON.stringify(out));
