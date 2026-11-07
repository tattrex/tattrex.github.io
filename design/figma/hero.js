await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:3'));
const logoLight=await figma.getNodeByIdAsync('6:150');
const buttonPrimary=await figma.getNodeByIdAsync('6:184');
const buttonSecondary=await figma.getNodeByIdAsync('6:204');
const navLink=await figma.getNodeByIdAsync('6:307');
function inst(parent,component,name){const n=track(component.createInstance());n.name=name;parent.appendChild(n);n.layoutPositioning='AUTO';return n;}
function button(parent,label,kind='secondary'){const n=inst(parent,kind==='primary'?buttonPrimary:buttonSecondary,'Button / '+label);n.setProperties({'Label#6:26':label});return n;}
const layouts=[];
for(const [name,w,x] of [['Desktop',1440,160],['Tablet',768,1760],['Mobile',390,2688]]){
 const mobile=w===390,tablet=w===768;const gutter=mobile?24:tablet?48:80;const cw=w-gutter*2;
 const root=f('Home / '+name,null,w,0,0,'Surface/Primary');root.x=x;root.y=160;
 const hero=f('Hero / Radiology shaped by radiologists',root,w,0,0,'Surface/Canvas',true);hero.clipsContent=true;
 const bg=imageBox(hero,'Hero / Cinematic volume artwork',w,mobile?860:tablet?900:860);bg.layoutPositioning='ABSOLUTE';bg.x=0;bg.y=0;
 const inner=f('Hero / Content',hero,w,0,0);padding(inner,mobile?24:32,gutter,48,gutter);
 const navWrap=f('Navigation / Alignment',inner,cw,0);navWrap.counterAxisAlignItems='CENTER';
 const nav=f('Navigation / Floating bar',navWrap,mobile?cw:tablet?cw:960,24,16,'Surface/Primary',false,'HORIZONTAL');nav.counterAxisAlignItems='CENTER';nav.primaryAxisAlignItems='SPACE_BETWEEN';radius(nav,8);
 const logo=inst(nav,logoLight,'Brand / Tattrex');if(mobile)logo.rescale(0.8);
 const navs=[];
 if(!mobile){const links=f('Navigation / Links',nav,undefined,8,0,null,false,'HORIZONTAL');for(const label of ['Platform','Labs','Our approach']){const n=inst(links,navLink,'Navigation / '+label);n.setProperties({'Label#6:52':label});navs.push(n.id);}}
 else{const menu=await t(nav,'Navigation / Menu','Menu','Button / Button-sm');navs.push(menu.id);}
 const content=f('Hero / Editorial content',inner,cw,mobile?24:32,0);padding(content,mobile?64:96,0,0,0);
 const heading=await t(content,'Hero / Heading','Radiology, shaped\nby radiologists',mobile?'Heading / Heading 3':'Heading / Heading 1','Text/Primary',mobile?cw:Math.min(680,cw),true);
 heading.fills=[{type:'GRADIENT_LINEAR',gradientTransform:[[1,0,0],[0,1,0]],gradientStops:[{position:0,color:{r:1,g:1,b:1,a:1},boundVariables:{color:{type:'VARIABLE_ALIAS',id:D['Text/Hero-start'].id}}},{position:1,color:{r:.608,g:.608,b:.608,a:1},boundVariables:{color:{type:'VARIABLE_ALIAS',id:D['Text/Hero-end'].id}}}]}];
 await t(content,'Hero / Description','A voice and AI native platform for your daily practice.\nA research partner for what comes next.',mobile?'Body / Body 3':'Body / Body 7','Text/Secondary',mobile?cw:520,true);
 const actions=f('Hero / Equal pathways',content,undefined,12,0,null,false,mobile?'VERTICAL':'HORIZONTAL');
 const demo=button(actions,'Request a demo');const idea=button(actions,'Bring an idea');
 if(mobile){demo.resize(cw,48);idea.resize(cw,48);}
 const quiet=f('Hero / Caption',inner,cw,8,0);padding(quiet,mobile?96:96,0,0,0);
 await t(quiet,'Hero / Proof line','Explore the v0.1 platform. Shape what comes next.','Caption / Caption 2','Text/Secondary',mobile?cw:480,true);
 await t(quiet,'Hero / Image caption','An artistic study of imaging. Not a clinical output.','Caption / Caption 5','Text/Tertiary',mobile?cw:480,true);
 hero.resize(w,mobile?900:tablet?900:860);hero.layoutSizingVertical='FIXED';inner.layoutSizingVertical='HUG';
 layouts.push({name,width:w,rootId:root.id,heroId:hero.id,artId:bg.id,demoId:demo.id,ideaId:idea.id,navIds:navs});
}
return {createdNodeIds,layouts};
