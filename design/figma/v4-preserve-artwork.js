const page=await figma.getNodeByIdAsync('5:3');await figma.setCurrentPageAsync(page);
function abs(n,x,y){n.layoutPositioning='ABSOLUTE';n.x=x;n.y=y;return n;}
let restored=0;
for(const atlas of page.findAll(n=>n.name==='Labs / A living atlas'&&n.findOne(c=>c.name==='Atlas / Modalities'))){
 for(const child of [...atlas.children])child.remove();const aw=atlas.width,ah=aw<400?416:aw<700?620:720;spacing(atlas,0,0);atlas.resize(aw,ah);atlas.layoutSizingVertical='FIXED';atlas.clipsContent=true;
 const pic=imageBox(atlas,'Atlas / Whole body research sculpture',ah*1.75,ah);pic.fills=[{type:'IMAGE',imageHash:'16885fd5acbdc1f6ba5f836008f340259d73cfaf',scaleMode:'FILL'}];abs(pic,(aw-ah*1.75)/2,0);
 const top=f('Atlas / Coordinates',atlas,aw-48,16,0,null,true,'HORIZONTAL');abs(top,24,24);top.primaryAxisAlignItems='SPACE_BETWEEN';await t(top,'Identity','Tattrex Labs','Caption / Caption 1','Text/Primary',undefined,true);await t(top,'Index','[ 03 ]','Caption / Caption 3','Text/Accent',undefined,true);
 for(let i=0;i<17;i++){const tick=rect(atlas,'Atlas / Index tick '+i,i%4===0?16:8,1,i===8?'Surface/Accent':'Border/Primary',i!==8);abs(tick,24,80+i*(ah-160)/16);}
 const lower=f('Atlas / Scope caption',atlas,aw-48,8);abs(lower,24,ah-72);await t(lower,'Title','A field of possibilities','Title / Title 3','Text/Primary',aw-48,true);await t(lower,'Caption','Artistic research visualisation','Caption / Caption 5','Text/Secondary',aw-48,true);restored++;
}
const discover=await figma.getNodeByIdAsync('27:9785');for(const n of [...discover.children])if(n.name.startsWith('Imaging /'))n.remove();if(!discover.findOne(n=>n.name==='Atlas / Full body research world')){const img=imageBox(discover,'Atlas / Full body research world',1440,806.5);img.fills=[{type:'IMAGE',imageHash:'16885fd5acbdc1f6ba5f836008f340259d73cfaf',scaleMode:'FILL'}];abs(img,0,96);discover.insertChild(0,img);}
const territories=discover.findOne(n=>n.name==='Discover / Research territories');territories.x=1080;territories.y=552;territories.fills=[paint('Surface/Primary',true)];
const board=await figma.getNodeByIdAsync('27:9954');board.findOne(n=>n.name==='Direction').characters='Sculptural imaging gives the opening and research atlas their character. The platform sequence brings familiar scan imagery into focus, paired with the voice spectrum and changing instructions. Platform and Labs remain equally prominent.';
const hero=await figma.getNodeByIdAsync('27:6361');const hash=figma.createImage(await hero.exportAsync({format:'PNG',constraint:{type:'WIDTH',value:1344}})).hash;board.findOne(n=>n.name==='Review / Opening preview').fills=[{type:'IMAGE',imageHash:hash,scaleMode:'FIT'}];
print('Restored research artwork in '+restored+' layouts; refreshed review hero.');
