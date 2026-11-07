await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:3'));const page=figma.currentPage;
const lightNav=await figma.getNodeByIdAsync('6:307'),darkSet=await figma.getNodeByIdAsync('27:4973'),darkNav=darkSet.children.find(n=>n.name==='State=Default'),darkKey=Object.keys(darkSet.componentPropertyDefinitions).find(k=>k.startsWith('Label'));
const logo=await figma.getNodeByIdAsync('6:167'),secondary=await figma.getNodeByIdAsync('6:204');
function inst(p,c,name){const n=c.createInstance();p.appendChild(n);n.layoutPositioning='AUTO';n.name=name;return n;}
function abs(n,x,y){n.layoutPositioning='ABSOLUTE';n.x=x;n.y=y;return n;}
function click(n,dest,kind='NAVIGATE',animate=false){n.reactions=[{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:dest.id,navigation:kind,transition:kind==='SCROLL_TO'?{type:'SCROLL_ANIMATE',easing,duration:.5}:animate?{...trans,duration:.5}:null}]}];}
function nav(p,label,dark=true){const n=inst(p,dark?darkNav:lightNav,'Navigation / '+label);n.setProperties({[dark?darkKey:'Label#6:52']:label});return n;}
function button(p,label){const n=inst(p,secondary,'Button / '+label);n.setProperties({'Label#6:26':label});return n;}
const flows=[];
for(const [sourceId,x,mobile] of [['27:6128',18100,false],['27:6679',19680,true]]){
 const proto=(await figma.getNodeByIdAsync(sourceId)).clone();proto.name='Concept 03 / Prototype / '+(mobile?'Mobile':'Desktop');proto.x=x;proto.y=160;proto.resize(mobile?390:1440,mobile?844:1000);proto.layoutSizingVertical='FIXED';proto.clipsContent=true;proto.overflowDirection='VERTICAL';
 const contacts={};
 for(const [kind,formId,confirmationId,y] of mobile?[['Demo','15:3228','15:3254',1400],['Idea','15:3261','15:3287',3000]]:[['Demo','15:2922','15:2948',1400],['Idea','15:2955','15:2981',3000]]){
  const form=(await figma.getNodeByIdAsync(formId)).clone();form.name='Concept 03 / Contact / '+kind+' / '+(mobile?'Mobile':'Desktop');form.x=x;form.y=y;
  const confirmation=(await figma.getNodeByIdAsync(confirmationId)).clone();confirmation.name='Concept 03 / Contact / '+kind+' / Preview / '+(mobile?'Mobile':'Desktop');confirmation.x=x;confirmation.y=y+880;
  click(form.findOne(n=>n.name==='Link / Back to Tattrex'),proto);click(confirmation.findOne(n=>n.name==='Link / Back to Tattrex'),proto);click(form.findOne(n=>n.name==='Button / '+(kind==='Demo'?'Request a demo':'Bring an idea')),confirmation);contacts[kind]=form;
 }
 const targets={Platform:proto.children[2],Labs:proto.children[3],'Our approach':proto.children[4]};
 for(const n of proto.findAll(n=>n.type==='INSTANCE')){if(n.name==='Button / Request a demo')click(n,contacts.Demo);if(n.name==='Button / Bring an idea')click(n,contacts.Idea);for(const [label,dest] of Object.entries(targets))if(n.name==='Navigation / '+label)click(n,dest,'SCROLL_TO');}
 for(const [name,dest] of [['Work',targets.Platform],['Discover',targets.Labs]]){const n=proto.findOne(n=>n.name==='Chapter / '+name);if(n)click(n,dest,'SCROLL_TO');}
 if(mobile){
  const menu=f('Concept 03 / Mobile menu',null,390,32,24,'Surface/Primary',true);menu.x=20200;menu.y=5800;menu.resize(390,844);menu.layoutSizingVertical='FIXED';const close=nav(menu,'Close menu');close.reactions=[{trigger:{type:'ON_CLICK'},actions:[{type:'CLOSE'}]}];await t(menu,'Heading','Explore Tattrex','Heading / Heading 3','Text/Primary',342,true);
  let i=0;for(const [label,section] of Object.entries(targets)){const view=f('Concept 03 / Mobile section / '+label,null,390,0,0,'Surface/Primary',true);view.x=20700+i++*480;view.y=5800;view.resize(390,844);view.layoutSizingVertical='FIXED';view.clipsContent=true;view.overflowDirection='VERTICAL';const top=f('Section / Navigation',view,390,0,24,'Surface/Primary',true);click(nav(top,'Back to Tattrex'),proto);view.appendChild(section.clone());const n=nav(menu,label);n.resize(342,64);click(n,view);for(const b of view.findAll(n=>n.name==='Button / Request a demo'||n.name==='Button / Bring an idea'))click(b,contacts[b.name.includes('demo')?'Demo':'Idea']);}
  for(const [label,dest] of [['Request a demo',contacts.Demo],['Bring an idea',contacts.Idea]])click(button(menu,label),dest);click(proto.findOne(n=>n.name==='Navigation / Menu'),menu,'OVERLAY');
 }
 flows.push({name:proto.name,id:proto.id,contacts:Object.fromEntries(Object.entries(contacts).map(([k,n])=>[k,n.id]))});
}
const see=(await figma.getNodeByIdAsync('27:6361')).clone();see.name='Concept 03 / Story / 01 See';see.x=20200;see.y=160;
const scenes=[see];
for(const [index,name] of [[1,'Work'],[2,'Discover']]){
 const s=f('Concept 03 / Story / 0'+(index+1)+' '+name,null,1440,0,0,'Surface/Canvas',true);s.x=20200+index*1600;s.y=160;s.resize(1440,1000);s.layoutSizingVertical='FIXED';s.clipsContent=true;
 if(index===1){const stage=(await figma.getNodeByIdAsync('27:7037')).clone();s.appendChild(stage);abs(stage,80,160);const voice=stage.findOne(n=>n.name==='Voice instrument / Interactive workflow');if(voice){const set=await figma.getNodeByIdAsync((await voice.getMainComponentAsync()).parent.id);voice.swapComponent(set.children.find(n=>n.name==='Mode=Navigate'));}}
 else{
  const image=imageBox(s,'Atlas / Full body research world',1440,806.5);image.fills=[{type:'IMAGE',imageHash:'16885fd5acbdc1f6ba5f836008f340259d73cfaf',scaleMode:'FILL'}];abs(image,0,96);
  const copy=f('Discover / Invitation',s,480,32);abs(copy,80,192);await t(copy,'Heading','What will\nyou discover?','Heading / Heading 1','Text/Primary',480,true);await t(copy,'Copy','Bring the clinical question only you would think to ask. Build what comes next with Tattrex Labs.','Body / Body 7','Text/Secondary',352,true);button(copy,'Bring an idea');
  const topics=f('Discover / Research territories',s,280,24,24,'Surface/Primary',true);abs(topics,1080,552);for(const [number,title] of [['01','Clinical ideas'],['02','Foundation models'],['03','Novel biomarkers']]){const row=f(title,topics,232,12);await t(row,'Index',number,'Caption / Caption 3','Text/Accent',232,true);await t(row,'Name',title,'Title / Title 1','Text/Primary',232,true);}
 }
 abs(inst(s,logo,'Brand / Tattrex without centre dot'),80,40);
 const navbox=f('Navigation / Floating chapter bar',s,undefined,8,8,'Surface/Primary',true,'HORIZONTAL');radius(navbox,8);navbox.strokes=[paint('Border/Primary',true)];navbox.strokeWeight=1;for(const label of ['Platform','Labs','Our approach'])nav(navbox,label);abs(navbox,1008,24);
 const id=await t(s,'Atlas / Index','0'+(index+1)+' / 03','Caption / Caption 3','Text/Accent',80,true);abs(id,1280,112);
 const rail=f('Chapter index / See Work Discover',s,1280,0);abs(rail,80,912);line(rail,1280,true);const row=f('Chapter index / Entries',rail,1280,32,0,null,true,'HORIZONTAL');padding(row,8,0);
 for(const [i,title] of ['See','Work','Discover'].entries()){const n=nav(row,'0'+(i+1)+' '+title+(index===i?' / Current':''));n.name='Chapter / '+title;n.resize(405.33,48);}
 scenes.push(s);
}
for(const s of scenes){for(const [i,title] of ['See','Work','Discover'].entries()){const n=s.findOne(n=>n.name==='Chapter / '+title);if(s.id!==scenes[i].id)click(n,scenes[i],'NAVIGATE',true);}for(const n of s.findAll(n=>n.type==='INSTANCE')){if(n.name==='Button / Request a demo')click(n,await figma.getNodeByIdAsync(flows[0].contacts.Demo));if(n.name==='Button / Bring an idea')click(n,await figma.getNodeByIdAsync(flows[0].contacts.Idea));if(n.name==='Navigation / Platform'&&s.id!==scenes[1].id)click(n,scenes[1],'NAVIGATE',true);if(n.name==='Navigation / Labs'&&s.id!==scenes[2].id)click(n,scenes[2],'NAVIGATE',true);if(n.name==='Navigation / Our approach')click(n,await figma.getNodeByIdAsync(flows[0].id));}}
const word=(await figma.getNodeByIdAsync('27:5286')).clone();word.name='Concept 03 / Motion / Word reveal';word.x=21800;word.y=1400;
const back=nav(word,'Back to Tattrex',false);click(back,await figma.getNodeByIdAsync(flows[0].id));
const starts=[{nodeId:scenes[0].id,name:'Concept 03 · Chapter storyboard'},{nodeId:flows[0].id,name:'Concept 03 · Desktop'},{nodeId:flows[1].id,name:'Concept 03 · Mobile'},{nodeId:word.id,name:'Concept 03 · Word reveal'},...page.flowStartingPoints];
page.flowStartingPoints=starts.filter((x,i)=>starts.findIndex(y=>y.nodeId===x.nodeId)===i);
print('V3_PROTOTYPES:'+JSON.stringify({flows,scenes:scenes.map(n=>({id:n.id,name:n.name})),wordReveal:word.id}));
