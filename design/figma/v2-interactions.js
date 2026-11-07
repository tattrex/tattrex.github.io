const screens=await figma.getNodeByIdAsync('5:3'),components=await figma.getNodeByIdAsync('5:2');
await figma.setCurrentPageAsync(components);
function inst(parent,c,name){const n=track(c.createInstance());parent.appendChild(n);n.name=name;n.layoutPositioning='AUTO';return n;}
function click(n,dest,navigation='NAVIGATE'){n.reactions=[{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:dest.id,navigation,transition:navigation==='SCROLL_TO'?{type:'SCROLL_ANIMATE',easing,duration:.5}:null}]}];}
const darkNav=[];
for(const state of ['Default','Hover','Pressed','Focus','Disabled']){
 const c=figma.createComponent();c.name='State='+state;c.layoutMode='HORIZONTAL';spacing(c,8,12);c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.minHeight=44;radius(c,4);c.fills=state==='Hover'||state==='Pressed'?[paint(state==='Hover'?'Surface/Secondary':'Surface/Tertiary',true)]:[];
 if(state==='Focus'){c.strokes=[paint('Border/Focus',true)];c.strokeWeight=2;}
 await t(c,'Label','Platform','Title / Title 4',state==='Disabled'?'Text/Secondary-Disabled':'Text/Primary',undefined,true);darkNav.push(c);
}
const navSet=figma.combineAsVariants(darkNav,components);navSet.name='Navigation / Dark link';navSet.layoutMode='HORIZONTAL';spacing(navSet,24,24);navSet.fills=[paint('Surface/Primary',true)];navSet.x=3600;navSet.y=160;
const navKey=navSet.addComponentProperty('Label','TEXT','Platform');for(const c of darkNav)c.findOne(n=>n.name==='Label').componentPropertyReferences={characters:navKey};
darkNav[0].reactions=[{trigger:{type:'ON_HOVER'},actions:[{type:'NODE',destinationId:darkNav[1].id,navigation:'CHANGE_TO',transition:trans}]}];darkNav[1].reactions=[{trigger:{type:'MOUSE_LEAVE',delay:0},actions:[{type:'NODE',destinationId:darkNav[0].id,navigation:'CHANGE_TO',transition:trans}]},{trigger:{type:'ON_PRESS'},actions:[{type:'NODE',destinationId:darkNav[2].id,navigation:'CHANGE_TO',transition:trans}]}];
function nav(parent,label){const n=inst(parent,darkNav[0],'Navigation / '+label);n.setProperties({[navKey]:label});return n;}
// The motion study reuses editable workspace geometry.
const desktop=await figma.getNodeByIdAsync('27:3665');
const app=desktop.findOne(n=>n.name==='Platform / Immersive workspace concept');
const workflow=[];
for(const [index,state,command] of [[0,'Listening','“Open the current study”'],[1,'Comparing','“Bring up the prior”'],[2,'Reporting','“Start my report”']]){
 const cloned=app.clone();components.appendChild(cloned);const c=figma.createComponentFromNode(cloned);c.name='State='+state;
 c.findOne(n=>n.name==='Command').characters=command;
 c.findOne(n=>n.name==='Meaning').characters=['From intent to the study','Comparison arrives in context','Keep your findings in the flow'][index];
 c.findOne(n=>n.name==='Viewport / Prior context').opacity=index===0?0:index===1?1:.4;
 c.findOne(n=>n.name==='Workspace / Reporting').opacity=index===2?1:.5;
 c.findAll(n=>n.name==='Signal / Bar').forEach((n,i)=>n.opacity=(i+index)%3===0?.35:1);
 workflow.push(c);
}
const workflowSet=figma.combineAsVariants(workflow,components);workflowSet.name='Workspace / Voice sequence';workflowSet.layoutMode='VERTICAL';spacing(workflowSet,48,32);workflowSet.fills=[];workflowSet.x=3600;workflowSet.y=800;
for(let i=0;i<2;i++)workflow[i].reactions=[{trigger:{type:'AFTER_TIMEOUT',timeout:1.6},actions:[{type:'NODE',destinationId:workflow[i+1].id,navigation:'CHANGE_TO',transition:{...trans,duration:.5}}]}];workflow[2].reactions=[{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:workflow[0].id,navigation:'CHANGE_TO',transition:trans}]}];
const reveal=[];
for(let step=0;step<5;step++){
 const c=figma.createComponent();c.name='Step='+step;c.layoutMode='VERTICAL';spacing(c,0,48);c.resize(800,320);c.layoutSizingHorizontal='FIXED';c.layoutSizingVertical='FIXED';c.fills=[paint('Surface/Accent')];
 let index=0;for(const words of [['Your','insight.'],['Made','real.']]){const row=f('Line '+index,c,680,12,0,null,false,'HORIZONTAL');for(const word of words){const n=await t(row,'Word '+index,word,'Heading / Heading 1','Text/OnAction');n.opacity=index++<step?1:.3;}}reveal.push(c);
}
const revealSet=figma.combineAsVariants(reveal,components);revealSet.name='Statement / Insight reveal';revealSet.layoutMode='VERTICAL';spacing(revealSet,24,32);revealSet.fills=[];revealSet.x=5100;revealSet.y=160;
for(let i=0;i<4;i++)reveal[i].reactions=[{trigger:{type:'AFTER_TIMEOUT',timeout:.3},actions:[{type:'NODE',destinationId:reveal[i+1].id,navigation:'CHANGE_TO',transition:trans}]}];reveal[4].reactions=[{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:reveal[0].id,navigation:'CHANGE_TO',transition:trans}]}];
await figma.setCurrentPageAsync(screens);
for(const id of ['27:3665','27:3881','27:4083']){const root=await figma.getNodeByIdAsync(id);const holder=root.findOne(n=>n.name==='Navigation / Links');const labels=holder.children.map(n=>n.name.replace('Navigation / ',''));for(const n of [...holder.children])n.remove();for(const label of labels)nav(holder,label);}
const motion=f('Concept 02 / Motion / Voice sequence',null,1440,32,80,'Surface/Primary',true);motion.x=10500;motion.y=1280;
await t(motion,'Heading','Voice becomes action','Heading / Heading 3','Text/Primary',680,true);await t(motion,'Note','A prototype timing study. Click the workspace after the sequence to replay.','Body / Body 3','Text/Secondary',680,true);inst(motion,workflow[0],'Workspace / Voice sequence');
const taglineStudy=f('Concept 02 / Motion / Statement',null,960,32,48,'Surface/Primary');taglineStudy.x=10500;taglineStudy.y=2480;await t(taglineStudy,'Heading','Your insight, word by word','Heading / Heading 4');await t(taglineStudy,'Note','Scroll activates each word on the website. Reduced motion displays the final statement immediately.','Body / Body 3','Text/Secondary',864);inst(taglineStudy,reveal[0],'Statement / Reveal');
const result=[];
for(const [sourceId,x,mobile] of [['27:3665',10500,false],['27:4083',12100,true]]){
 const source=await figma.getNodeByIdAsync(sourceId);const proto=source.clone();proto.name='Concept 02 / Prototype / '+(mobile?'Mobile':'Desktop');proto.x=x;proto.y=160;proto.resize(mobile?390:1440,900);proto.layoutSizingVertical='FIXED';proto.clipsContent=true;proto.overflowDirection='VERTICAL';
 const contacts={};
 for(const [kind,sourceContact,sourceConfirmation,cy] of mobile?[['Demo','15:3228','15:3254',1280],['Idea','15:3261','15:3287',2480]]:[['Demo','15:2922','15:2948',3600],['Idea','15:2955','15:2981',4800]]){
  const form=(await figma.getNodeByIdAsync(sourceContact)).clone();form.name='Concept 02 / Contact / '+kind+' / '+(mobile?'Mobile':'Desktop');form.x=x;form.y=cy;
  const confirmation=(await figma.getNodeByIdAsync(sourceConfirmation)).clone();confirmation.name='Concept 02 / Contact / '+kind+' / Preview / '+(mobile?'Mobile':'Desktop');confirmation.x=x+(mobile?480:800);confirmation.y=cy;
  click(form.findOne(n=>n.name==='Link / Back to Tattrex'),proto);click(confirmation.findOne(n=>n.name==='Link / Back to Tattrex'),proto);click(form.findOne(n=>n.name==='Button / '+(kind==='Demo'?'Request a demo':'Bring an idea')),confirmation);contacts[kind]=form;
 }
 const targets={Platform:proto.findOne(n=>n.name==='03 / The voice workspace'),Labs:proto.findOne(n=>n.name==='04 / The research atlas'),'Our approach':proto.findOne(n=>n.name==='05 / From question to practice')};
 for(const n of proto.findAll(n=>n.type==='INSTANCE')){if(n.name==='Button / Request a demo')click(n,contacts.Demo);if(n.name==='Button / Bring an idea')click(n,contacts.Idea);if(n.name==='Button / Explore the platform')click(n,targets.Platform,'SCROLL_TO');if(n.name==='Button / Explore the lab')click(n,targets.Labs,'SCROLL_TO');for(const [label,dest] of Object.entries(targets))if(n.name==='Navigation / '+label)click(n,dest,'SCROLL_TO');}
 click(proto.findOne(n=>n.name==='Territory / Tattrex platform'),targets.Platform,'SCROLL_TO');click(proto.findOne(n=>n.name==='Territory / Tattrex Labs'),targets.Labs,'SCROLL_TO');
 if(!mobile)click(proto.findOne(n=>n.name==='Platform / Immersive workspace concept'),motion);
 if(mobile){
  const menu=f('Concept 02 / Navigation / Mobile panel',null,390,32,24,'Surface/Primary',true);menu.x=13060;menu.y=160;menu.resize(390,900);menu.layoutSizingVertical='FIXED';const close=nav(menu,'Close menu');close.reactions=[{trigger:{type:'ON_CLICK'},actions:[{type:'CLOSE'}]}];await t(menu,'Heading','Explore Tattrex','Heading / Heading 3','Text/Primary',342,true);
  let i=0;for(const [label,section] of Object.entries(targets)){const view=f('Concept 02 / Mobile destination / '+label,null,390,0,0,'Surface/Primary',true);view.x=13600;view.y=160+i++*1280;view.resize(390,900);view.layoutSizingVertical='FIXED';view.clipsContent=true;view.overflowDirection='VERTICAL';const top=f('Section navigation',view,390,0,24,'Surface/Primary',true);click(nav(top,'Back to Tattrex'),proto);view.appendChild(section.clone());const link=nav(menu,label);link.resize(342,64);click(link,view);}
  const primary=await figma.getNodeByIdAsync('6:184');for(const [label,dest] of [['Request a demo',contacts.Demo],['Bring an idea',contacts.Idea]]){const b=inst(menu,primary,'Button / '+label);b.setProperties({'Label#6:26':label});click(b,dest);}click(proto.findOne(n=>n.name==='Navigation / Menu'),menu,'OVERLAY');
 }
 result.push({name:proto.name,id:proto.id,contacts:Object.fromEntries(Object.entries(contacts).map(([k,n])=>[k,n.id]))});
}
const back=nav(motion,'Back to the website');click(back,await figma.getNodeByIdAsync(result[0].id));
screens.flowStartingPoints=[{nodeId:result[0].id,name:'Concept 02 · Desktop'},{nodeId:result[1].id,name:'Concept 02 · Mobile'},{nodeId:motion.id,name:'Concept 02 · Voice sequence'},{nodeId:taglineStudy.id,name:'Concept 02 · Word reveal'},...screens.flowStartingPoints];
print('V2_PROTOTYPES:'+JSON.stringify({flows:result,motion:motion.id,tagline:taglineStudy.id,darkNavSet:navSet.id,voiceSet:workflowSet.id,revealSet:revealSet.id}));
