await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:3'));
const secondary=await figma.getNodeByIdAsync('6:204'),faq=await figma.getNodeByIdAsync('6:320'),expanded=await figma.getNodeByIdAsync('6:345');
function abs(n,x,y){n.layoutPositioning='ABSOLUTE';n.x=x;n.y=y;return n;}
function inst(parent,c,name){const n=c.createInstance();parent.appendChild(n);n.layoutPositioning='AUTO';n.name=name;return n;}
function button(parent,label){const n=inst(parent,secondary,'Button / '+label);n.setProperties({'Label#6:26':label});return n;}
const out=[];
for(const [id,w] of [['27:6128',1440],['27:6445',768],['27:6679',390]]){
 const root=await figma.getNodeByIdAsync(id),small=w===390,stack=w<1000,g=small?24:stack?48:80,cw=w-2*g;
 const old=root.children[3];const labs=f('04 / Discover / The research field',null,w,64,0,'Surface/Primary');root.insertChild(3,labs);old.remove();padding(labs,small?64:96,g);
 const heading=f('Labs / Chapter heading',labs,cw,24,0,null,false,stack?'VERTICAL':'HORIZONTAL');await t(heading,'Labs / Index','03 / Discover','Caption / Caption 1','Text/Accent',stack?cw:200);await t(heading,'Labs / Heading','Your questions.\nA wider field.',small?'Heading / Heading 3':'Heading / Heading 1','Text/Primary',stack?cw:680);
 const body=f('Labs / Atlas and research index',labs,cw,stack?40:64,0,null,false,stack?'VERTICAL':'HORIZONTAL');
 const aw=stack?cw:736,ah=small?416:stack?620:720;
 const atlas=f('Labs / A living atlas',body,aw,0,0,'Surface/Canvas',true);atlas.resize(aw,ah);atlas.layoutSizingVertical='FIXED';atlas.clipsContent=true;
 const pic=imageBox(atlas,'Atlas / Whole body research sculpture',ah*1.75,ah);pic.fills=[{type:'IMAGE',imageHash:'16885fd5acbdc1f6ba5f836008f340259d73cfaf',scaleMode:'FILL'}];abs(pic,(aw-ah*1.75)/2,0);
 const top=f('Atlas / Coordinates',atlas,aw-48,16,0,null,true,'HORIZONTAL');abs(top,24,24);top.primaryAxisAlignItems='SPACE_BETWEEN';await t(top,'Identity','Tattrex Labs','Caption / Caption 1','Text/Primary',undefined,true);await t(top,'Index','[ 03 ]','Caption / Caption 3','Text/Accent',undefined,true);
 for(let i=0;i<17;i++){const tick=rect(atlas,'Atlas / Index tick '+i,i%4===0?16:8,1,i===8?'Surface/Accent':'Border/Primary',i!==8);abs(tick,24,80+i*(ah-160)/16);}
 const lower=f('Atlas / Scope caption',atlas,aw-48,8);abs(lower,24,ah-72);await t(lower,'Title','A field of possibilities','Title / Title 3','Text/Primary',aw-48,true);await t(lower,'Caption','Artistic research visualisation','Caption / Caption 5','Text/Secondary',aw-48,true);
 const research=f('Labs / Research index',body,stack?cw:480,32);
 await t(research,'Labs / Name','Tattrex Labs','Heading / Heading 3','Text/Primary',stack?cw:480);
 await t(research,'Labs / Description','The most useful ideas often begin with something a radiologist notices. We work with you to explore it, build it and bring it toward clinical practice.','Body / Body 7','Text/Secondary',stack?cw:480);
 const topics=f('Labs / Expandable research directions',research,stack?cw:480,0);
 const entries=[['Clinical ideas','Start with an observation from your practice. Together, define the clinical question, build a focused tool and test its value.'],['Foundation models','Develop imaging representations that can support tasks across modalities and anatomy. Each project has a defined data and validation scope.'],['Novel biomarkers','Explore imaging signals that may reveal new information about disease and outcomes. Discovery starts with a testable clinical hypothesis.']];
 for(let i=0;i<entries.length;i++){const [q,a]=entries[i];const n=inst(topics,i===0?expanded:faq,'Research direction / '+q);n.setProperties({'Question#6:58':q,'Answer#6:65':a});n.resize(stack?cw:480,n.height);n.layoutSizingVertical='HUG';}
 button(research,'Bring an idea');
 const breadth=f('Labs / Research ambition',labs,cw,32,0,null,false,stack?'VERTICAL':'HORIZONTAL');
 await t(breadth,'Labs / Breadth','Every modality.\nThe whole body.',small?'Heading / Heading 4':'Heading / Heading 2','Text/Primary',stack?cw:736);
 const scope=f('Labs / Scope',breadth,stack?cw:512,16);await t(scope,'Scope / Label','Our research ambition','Caption / Caption 1','Text/Accent',stack?cw:512);await t(scope,'Scope / Meaning','From a specific clinical question to models that learn across imaging data. Each collaboration begins with a defined intended use, dataset and validation plan.','Body / Body 3','Text/Secondary',stack?cw:512);
 out.push({rootId:id,labsId:labs.id,atlasId:atlas.id,topicsId:topics.id});
}
print('V3_LABS:'+JSON.stringify(out));
