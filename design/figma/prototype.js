const screens=await figma.getNodeByIdAsync('5:3');
const components=await figma.getNodeByIdAsync('5:2');
for(const n of [...screens.children])if(n.name.startsWith('Prototype /')||n.name.startsWith('Contact /')||n.name==='Navigation / Mobile panel'||n.name==='Review / Read me first')n.remove();
for(const n of [...components.children])if(n.name==='Input / Field'||n.name==='Statement / Word reveal')n.remove();
await figma.setCurrentPageAsync(components);
function instance(parent,c,name){const n=c.createInstance();parent.appendChild(n);n.name=name;n.layoutPositioning='AUTO';return n;}
const primary=await figma.getNodeByIdAsync('6:184');
const nav=await figma.getNodeByIdAsync('6:307');
function btn(parent,label){const n=instance(parent,primary,'Button / '+label);n.setProperties({'Label#6:26':label});return n;}
function link(parent,label){const n=instance(parent,nav,'Link / '+label);n.setProperties({'Label#6:52':label});return n;}
async function react(n,dest,navigation='NAVIGATE'){n.reactions=[{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:dest.id,navigation,transition:navigation==='SCROLL_TO'?{type:'SCROLL_ANIMATE',easing,duration:.5}:null}]}];}
// Form components are visual prototypes; no data leaves Figma.
const fieldVariants=[];
for(const kind of ['Short','Long'])for(const state of ['Default','Hover','Pressed','Focus','Disabled','Error','Filled']){
 const c=figma.createComponent();c.name='Type='+kind+', State='+state;c.layoutMode='VERTICAL';spacing(c,8);c.resize(544,100);c.layoutSizingHorizontal='FIXED';c.layoutSizingVertical='HUG';c.fills=[];
 await t(c,'Label','Work email','Title / Title 4','Text/Primary');
 const box=f('Input surface',c,544,8,16,'Surface/Primary-subtle');box.layoutSizingHorizontal='FILL';radius(box,4);box.strokes=[paint(state==='Error'?'Border/Error':state==='Focus'?'Border/Focus':'Border/Primary')];box.strokeWeight=state==='Focus'?2:1;
 if(kind==='Long'){box.resize(544,112);box.layoutSizingVertical='FIXED';}
 const value=await t(box,'Value',state==='Filled'?'Name entered':'you@hospital.org','Body / Body 3',state==='Filled'?'Text/Primary':'Text/Tertiary',512);value.layoutSizingHorizontal='FILL';
 const error=await t(c,'Error','Enter a valid work email address','Caption / Caption 2','Text/Error');error.visible=state==='Error';if(state==='Disabled')c.opacity=.5;
 fieldVariants.push(c);
}
const inputSet=figma.combineAsVariants(fieldVariants,components);inputSet.name='Input / Field';inputSet.x=1760;inputSet.y=160;inputSet.layoutMode='VERTICAL';spacing(inputSet,24,32);inputSet.fills=[paint('Surface/Primary')];
const labelKey=inputSet.addComponentProperty('Label','TEXT','Work email'),valueKey=inputSet.addComponentProperty('Value','TEXT','you@hospital.org');
for(const c of fieldVariants){c.findOne(n=>n.name==='Label').componentPropertyReferences={characters:labelKey};c.findOne(n=>n.name==='Value').componentPropertyReferences={characters:valueKey};}
// Word reveal study: ten distinct word activations with the shared motion curve.
const words=['You','bring','the','clinical','insight.','We','build','what','comes','next.'];
const motion=[];
for(let step=0;step<=words.length;step++){
 const c=figma.createComponent();c.name='Step='+String(step).padStart(2,'0');c.layoutMode='VERTICAL';spacing(c,0,48);c.resize(800,480);c.layoutSizingHorizontal='FIXED';c.layoutSizingVertical='FIXED';c.fills=[paint('Surface/Accent')];
 let index=0;
 for(const rowWords of [['You','bring','the'],['clinical','insight.'],['We','build','what'],['comes','next.']]){const row=f('Line '+index,c,680,12,0,null,false,'HORIZONTAL');for(const word of rowWords){const n=await t(row,'Word '+index,word,'Heading / Heading 1','Text/OnAction');n.opacity=index<step?1:.3;index++;}}
 motion.push(c);
}
const motionSet=figma.combineAsVariants(motion,components);motionSet.name='Statement / Word reveal';motionSet.layoutMode='VERTICAL';spacing(motionSet,24,32);motionSet.x=2520;motionSet.y=160;motionSet.fills=[];
for(let i=0;i<motion.length-1;i++)await motion[i].setReactionsAsync([{trigger:{type:'AFTER_TIMEOUT',timeout:.18},actions:[{type:'NODE',destinationId:motion[i+1].id,navigation:'CHANGE_TO',transition:trans}]}]);
await motion[motion.length-1].setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:motion[0].id,navigation:'CHANGE_TO',transition:trans}]}]);
await figma.setCurrentPageAsync(screens);
const study=f('Prototype / Word reveal',null,960,32,48,'Surface/Primary');study.x=3400;study.y=160;
await t(study,'Motion study heading','A measured word reveal','Heading / Heading 4');
await t(study,'Motion study note','Prototype timing study. On the website, words respond to scroll position. Reduced motion shows the complete statement immediately.','Body / Body 3','Text/Secondary',864);
instance(study,motion[0],'Statement / Word reveal');
const flows=[];
for(const [sourceId,w,x] of [['7:2',1440,3400],['7:88',390,5000]]){
 const source=await figma.getNodeByIdAsync(sourceId),mobile=w===390;
 const proto=source.clone();proto.name='Prototype / '+(mobile?'Mobile':'Desktop');proto.x=x;proto.y=1120;proto.resize(w,900);proto.layoutSizingVertical='FIXED';proto.clipsContent=true;proto.overflowDirection='VERTICAL';
 const contacts={};
 for(const [kind,title,intro] of [['Demo','A demo around\nyour daily practice','Tell us a little about your work. We will use it to shape a useful conversation about the current platform.'],['Idea','Start with a\nclinical question','You do not need a finished proposal. Tell us what you have noticed and what you would like to explore.']]){
  const frame=f('Contact / '+kind+' / '+(mobile?'Mobile':'Desktop'),null,mobile?390:720,32,mobile?24:48,'Surface/Primary');frame.x=x;frame.y=2280+(kind==='Idea'?1100:0);const fw=mobile?342:624;
  const back=link(frame,'Back to Tattrex');await react(back,proto);
  await t(frame,'Heading',title,mobile?'Heading / Heading 3':'Heading / Heading 2','Text/Primary',fw);
  await t(frame,'Introduction',intro,'Body / Body 3','Text/Secondary',fw);
  for(const [label,placeholder,long] of [['Name','Your name',false],['Work email','you@hospital.org',false],kind==='Demo'?['Organisation','Hospital or practice',false]:['Your clinical idea','The observation or question you want to explore',true]]){
   const field=instance(frame,fieldVariants[long?7:0],'Field / '+label);field.resize(fw,field.height);field.setProperties({[labelKey]:label,[valueKey]:placeholder});
  }
  const submit=btn(frame,kind==='Demo'?'Request a demo':'Bring an idea');if(mobile)submit.resize(fw,44);
  await t(frame,'Privacy note','Your details are used to respond to this enquiry.','Caption / Caption 2','Text/Secondary',fw);
  const confirmation=f('Contact / '+kind+' / Preview confirmation / '+(mobile?'Mobile':'Desktop'),null,mobile?390:720,32,mobile?24:48,'Surface/Primary');confirmation.x=x+(mobile?480:800);confirmation.y=frame.y;
  await t(confirmation,'Heading','This is the design preview','Heading / Heading 3','Text/Primary',fw);
  await t(confirmation,'Explanation','The contact flow is ready to review. This prototype does not send information. The final website will connect this form to Tattrex.','Body / Body 3','Text/Secondary',fw);
  const returnLink=link(confirmation,'Back to Tattrex');await react(returnLink,proto);await react(submit,confirmation);contacts[kind]=frame;
 }
 const platform=proto.findOne(n=>n.name==='02 / Platform'),labs=proto.findOne(n=>n.name==='03 / Tattrex Labs'),approach=proto.findOne(n=>n.name==='04 / Our approach');
 for(const n of proto.findAll(n=>n.type==='INSTANCE')){
  if(n.name==='Button / Request a demo')await react(n,contacts.Demo);
  if(n.name==='Button / Bring an idea')await react(n,contacts.Idea);
  if(n.name==='Button / Explore the platform'||n.name==='Navigation / Platform')await react(n,platform,'SCROLL_TO');
  if(n.name==='Button / Explore the lab'||n.name==='Navigation / Labs')await react(n,labs,'SCROLL_TO');
  if(n.name==='Navigation / Our approach')await react(n,approach,'SCROLL_TO');
 }
 if(mobile){
  const menu=f('Navigation / Mobile panel',null,390,40,24,'Surface/Primary');menu.x=5480;menu.y=1120;menu.resize(390,900);menu.layoutSizingVertical='FIXED';
  const close=link(menu,'Close menu');close.reactions=[{trigger:{type:'ON_CLICK'},actions:[{type:'CLOSE'}]}];
  await t(menu,'Menu heading','Explore Tattrex','Heading / Heading 3','Text/Primary',342);
  let menuIndex=0;
  for(const [label,destination] of [['Platform',platform],['Labs',labs],['Our approach',approach]]){
   const view=f('Prototype / Mobile / '+label,null,390,0,0,'Surface/Primary');view.x=6000;view.y=1120+menuIndex++*1280;view.resize(390,900);view.layoutSizingVertical='FIXED';view.clipsContent=true;view.overflowDirection='VERTICAL';
   const top=f('Section navigation',view,390,0,24,'Surface/Primary');await react(link(top,'Back to Tattrex'),proto);view.appendChild(destination.clone());
   const n=link(menu,label);n.resize(342,64);await react(n,view);
  }
  await t(menu,'Menu descriptor','A platform for your practice.\nA partner for your next idea.','Body / Body 7','Text/Secondary',342);
  await react(btn(menu,'Request a demo'),contacts.Demo);await react(btn(menu,'Bring an idea'),contacts.Idea);
  const menuText=proto.findOne(n=>n.name==='Navigation / Menu');const parent=menuText.parent;menuText.remove();const menuButton=link(parent,'Menu');await react(menuButton,menu,'OVERLAY');
 }
 flows.push({name:proto.name,nodeId:proto.id,contacts:Object.fromEntries(Object.entries(contacts).map(([k,v])=>[k,v.id]))});
}
const notes=f('Review / Read me first',null,960,32,48,'Surface/Primary');notes.x=3400;notes.y=4700;
await t(notes,'Heading','Tattrex · Concept 01','Heading / Heading 2');
for(const [heading,copy] of [
 ['Reading room + research atlas','Equal paths into the platform and Labs. Original logo geometry, warm paper, charcoal and vermilion. Manrope throughout. The cinematic artwork is an artistic study, not a clinical output.'],
 ['What to review','The balance between platform and Labs, the headline and tone, the imaging art direction, and the level of detail in the partnership story. Desktop, tablet and mobile are on this page.'],
 ['Prototype scope','Desktop and mobile flows include navigation, contact form previews and FAQ expansion. The word reveal has a separate timing study. Forms do not submit information.'],
 ['Before implementation','Confirm contact routing, privacy and terms content, and product availability language. No regulatory clearance, clinical performance, customer or outcome claims are assumed.'],
 ['Figma plan limitation','The current plan supports one mode per collection. Light and Dark semantic collections both alias shared Core Colors. They can be consolidated into two modes on a plan that supports them.'],
 ['Artwork exception','The logo retains its imported vector artwork frames to preserve the original paths. Interface containers use auto layout. Artwork fills and strokes are bound to semantic tokens.']]){const b=f(heading,notes,864,12);await t(b,'Title',heading,'Title / Title 1');await t(b,'Copy',copy,'Body / Body 3','Text/Secondary',864);}
figma.currentPage.selection=[await figma.getNodeByIdAsync('7:2')];figma.viewport.scrollAndZoomIntoView([await figma.getNodeByIdAsync('7:2')]);
print('TATTREX_PROTOTYPE:'+JSON.stringify({flows,motion:study.id,notes:notes.id,inputSet:inputSet.id}));
