await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:3'));
const page=figma.currentPage;
const logo=await figma.getNodeByIdAsync('6:150'),primary=await figma.getNodeByIdAsync('6:184'),secondary=await figma.getNodeByIdAsync('6:204'),nav=await figma.getNodeByIdAsync('6:307');
function inst(parent,c,name){const n=c.createInstance();parent.appendChild(n);n.layoutPositioning='AUTO';n.name=name;return n;}
function abs(n,x,y){n.layoutPositioning='ABSOLUTE';n.x=x;n.y=y;return n;}
function button(parent,label){const n=inst(parent,secondary,'Button / '+label);n.setProperties({'Label#6:26':label});return n;}
function picture(parent,name,w,h,hash){const n=imageBox(parent,name,w,h);n.fills=[{type:'IMAGE',imageHash:hash,scaleMode:'FILL'}];return n;}
const out=[];
for(const [sourceId,w,x,label] of [['27:3665',1440,14500,'Desktop'],['27:3881',768,16100,'Tablet'],['27:4083',390,17050,'Mobile']]){
 if(page.children.some(n=>n.name==='Concept 03 / '+label))throw Error('Concept 03 already exists');
 const root=(await figma.getNodeByIdAsync(sourceId)).clone();root.name='Concept 03 / '+label;root.x=x;root.y=160;
 const small=w===390,stack=w<1000,g=small?24:stack?48:80,cw=w-g*2,H=small?912:stack?1280:1000;
 root.children[0].remove();const hero=f('01 / See / The living atlas',null,w,0,0,'Surface/Canvas');root.insertChild(0,hero);hero.resize(w,H);hero.layoutSizingVertical='FIXED';hero.clipsContent=true;
 const image=picture(hero,'Hero / Porcelain tomography sculpture',small?740:stack?1120:1440,small?414.44:stack?627.28:806.5,'ac5291cc93ac48a2ef282bdd305f8905ae3bd04f');abs(image,small?-328:stack?-320:0,small?222:stack?328:80);
 const brand=inst(hero,logo,'Brand / Tattrex without centre dot');abs(brand,g,small?24:40);
 const navbox=f('Navigation / Floating chapter bar',hero,undefined,8,8,'Surface/Primary');navbox.layoutMode='HORIZONTAL';radius(navbox,8);navbox.strokes=[paint('Border/Primary')];navbox.strokeWeight=1;
 for(const label of small?['Menu']:['Platform','Labs','Our approach']){const n=inst(navbox,nav,'Navigation / '+label);n.setProperties({'Label#6:52':label});}
 abs(navbox,small?270:stack?370:1008,small?16:24);
 const headline=await t(hero,'Hero / Heading','Radiology,\nshaped by you',small?'Heading / Heading 2':stack?'Heading / Heading 1':'Heading / Heading 7','Text/Primary',small?cw:680);
 headline.fills=[{type:'GRADIENT_LINEAR',gradientTransform:[[1,0,0],[0,1,0]],gradientStops:[{position:0,color:{r:0,g:0,b:0,a:1},boundVariables:{color:{type:'VARIABLE_ALIAS',id:V['Text/Hero-start'].id}}},{position:1,color:{r:.4,g:.4,b:.4,a:1},boundVariables:{color:{type:'VARIABLE_ALIAS',id:V['Text/Hero-end'].id}}}]}];
 abs(headline,g,small?112:stack?152:568);
 const explanation=f('Hero / Purpose and equal invitations',hero,small?cw:stack?cw:376,24);abs(explanation,g,small?648:stack?1016:176);
 await t(explanation,'Hero / Introduction','A voice and AI native platform for radiologists. A research partner for what comes next.',small?'Body / Body 3':'Body / Body 7','Text/Secondary',small?cw:stack?560:376);
 const actions=f('Hero / Equal invitations',explanation,small?342:undefined,12,0,null,false,'HORIZONTAL');for(const label of ['Request a demo','Bring an idea']){const b=button(actions,label);if(small){b.findOne(n=>n.name==='Arrow up right / Phosphor').visible=false;b.resize(165,44);}}
 if(!small){const evidence=await t(hero,'Hero / Current work','Platform v0.1\nBuilt with radiologists','Caption / Caption 2','Text/Secondary',240);abs(evidence,g,stack?744:388);}
 const caption=await t(hero,'Hero / Artistic caption','Imaging, reimagined as a material','Caption / Caption 5','Text/Tertiary',small?cw:320);abs(caption,small?g:stack?g:1008,small?620:stack?976:880);
 if(!stack){for(let i=0;i<33;i++){const tick=rect(hero,'Atlas / Calibration tick '+i,i%4===0?16:8,1,i===16?'Surface/Accent':'Border/Primary');abs(tick,1400-(i%4===0?16:8),160+i*20);}const label=await t(hero,'Atlas / Index','01 / 03','Caption / Caption 3','Text/Accent',80);abs(label,1280,112);}
 const rail=f('Chapter index / See Work Discover',hero,cw,0);abs(rail,g,H-88);line(rail,cw);
 const chapters=f('Chapter index / Entries',rail,cw,small?16:32,0,null,false,'HORIZONTAL');padding(chapters,16,0);
 for(const [num,title] of [['01','See'],['02','Work'],['03','Discover']]){const cell=f('Chapter / '+title,chapters,(cw-(small?32:64))/3,small?8:16,0,null,false,'HORIZONTAL');await t(cell,'Number',num,'Caption / Caption 3',num==='01'?'Text/Accent':'Text/Tertiary');await t(cell,'Label',title,small?'Caption / Caption 1':'Title / Title 3','Text/Primary');cell.resize(cell.width,44);cell.layoutSizingVertical='FIXED';cell.counterAxisAlignItems='CENTER';}
 out.push({label,rootId:root.id,heroId:hero.id,width:w});
}
figma.currentPage.selection=[await figma.getNodeByIdAsync(out[0].rootId)];figma.viewport.scrollAndZoomIntoView([await figma.getNodeByIdAsync(out[0].heroId)]);
print('V3_ROOTS:'+JSON.stringify(out));
