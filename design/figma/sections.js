// Native Figma authoring. Appends to the existing, approved-for-review concept.
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:3'));
const primary=await figma.getNodeByIdAsync('6:184');
const secondary=await figma.getNodeByIdAsync('6:204');
const logoLight=await figma.getNodeByIdAsync('6:150');
const logoDark=await figma.getNodeByIdAsync('6:167');
const faqDefault=await figma.getNodeByIdAsync('6:320');
const imageHash='1d52f8edbb34c02422ed99555f014c3340926a4e';
function inst(parent,c,name){const n=track(c.createInstance());parent.appendChild(n);n.name=name;n.layoutPositioning='AUTO';return n;}
function button(parent,label,accent=false){const n=inst(parent,accent?primary:secondary,'Button / '+label);n.setProperties({'Label#6:26':label});return n;}
const faqCopy=[
 ['What can I explore in the current demo?','The v0.1 demo brings voice commands, study navigation and reporting into one workspace. A demo is the best way to see the current scope and discuss your workflow.'],
 ['Can I shape the way the platform works?','Yes. Tattrex is being built with radiologists. Bring the routines, reporting preferences and clinical questions that matter in your practice.'],
 ['Do I need a finished research proposal for Labs?','No. Start with a clinical observation or a question about imaging. We work together to define the problem and a useful next step.'],
 ['Which imaging areas does Labs work on?','Our research ambition spans imaging modalities and the whole body. Individual collaborations have a defined clinical question, dataset and validation scope.'],
 ['How do ideas become clinical products?','We work together on development and validation. Tattrex takes responsibility for the path toward regulatory approval and productisation. Requirements depend on the intended use and market.'],
 ['Are the research models already cleared for clinical use?','Research and clinical deployment are separate stages. Availability, validation and regulatory status are assessed for each product and intended use.']
];
const result=[];
for(const [id,w,label] of [['7:2',1440,'Desktop'],['7:45',768,'Tablet'],['7:88',390,'Mobile']]){
 const root=await figma.getNodeByIdAsync(id),small=w===390,stack=w<1000;
 // Idempotent: preserve the existing hero only.
 for(const child of [...root.children].slice(1))child.remove();
 const gutter=small?24:stack?48:80,cw=w-gutter*2;
 const hstyle=small?'Heading / Heading 4':'Heading / Heading 2';
 const section=(name,bg='Surface/Primary',dark=false,gap=48)=>{const n=f(name,root,w,gap,0,bg,dark);padding(n,small?64:96,gutter);return n;};
 const intro=section('01 / Two ways to build with Tattrex');
 await t(intro,'Section heading','Your practice today.\nYour ideas for tomorrow.',hstyle,'Text/Primary',Math.min(cw,680));
 const pathways=f('Equal pathways',intro,cw,stack?48:64,0,null,false,stack?'VERTICAL':'HORIZONTAL');
 const pathW=stack?cw:(cw-64)/2;
 for(const [num,title,copy,cta] of [
  ['01','Tattrex platform','Keep studies, voice and AI in the same workflow. Build a workspace around how you read, compare and report.','Explore the platform'],
  ['02','Tattrex Labs','Turn a clinical observation into a research direction. Work with our team to develop, validate and bring useful ideas into practice.','Explore the lab']]){
  const p=f(title,pathways,pathW,24);line(p,pathW);await t(p,'Index',num,'Caption / Caption 3','Text/Accent');
  await t(p,'Title',title,'Heading / Heading 4','Text/Primary',pathW);
  await t(p,'Description',copy,'Body / Body 7','Text/Secondary',pathW);button(p,cta);
 }
 const platform=section('02 / Platform','Surface/Primary',true);
 await t(platform,'Platform heading','Stay with the study.\nSpeak the next step.',hstyle,'Text/Primary',Math.min(cw,680),true);
 await t(platform,'Platform description','A voice and AI native workspace for the moments between opening a study and completing a report.','Body / Body 7','Text/Secondary',Math.min(cw,600),true);
 const workspace=f('Illustrative voice workflow',platform,cw,0,0,'Surface/Canvas',true);radius(workspace,8);workspace.clipsContent=true;
 const bar=f('Workspace title bar',workspace,cw,16,24,'Surface/Secondary',true,'HORIZONTAL');bar.primaryAxisAlignItems='SPACE_BETWEEN';
 await t(bar,'Workspace title','Tattrex workspace','Title / Title 3','Text/Primary',undefined,true);
 if(!small)await t(bar,'Workspace context','Voice + AI · v0.1 concept','Caption / Caption 2','Text/Secondary',undefined,true);
 const panes=f('Workspace panes',workspace,cw,stack?32:48,small?24:32,null,true,stack?'VERTICAL':'HORIZONTAL');
 const paneW=stack?cw-(small?48:64):(cw-64-48)*.54;
 const transcript=f('Voice transcript',panes,paneW,24);
 await t(transcript,'Voice label','A conversation with your workflow','Caption / Caption 1','Text/Secondary',paneW,true);
 for(const [command,outcome] of [['“Open the latest chest CT”','Move from the worklist to the study'],['“Show the prior”','Bring comparison into the reading flow'],['“Start the report”','Capture your findings in context']]){
  const turn=f('Voice turn',transcript,paneW,8);await t(turn,'Command',command,small?'Heading / Heading 6':'Heading / Heading 5','Text/Primary',paneW,true);
  await t(turn,'Outcome',outcome,'Body / Body 6','Text/Secondary',paneW,true);line(turn,paneW,true);
 }
 const reportW=stack?paneW:cw-64-48-paneW;
 const report=f('Report context',panes,reportW,24,24,'Surface/Primary',true);radius(report,4);
 await t(report,'Label','The report stays in view','Title / Title 3','Text/Primary',reportW-48,true);
 for(const [title,copy] of [['Study','Chest CT'],['Context','Current study and available priors'],['Report','Dictate, review and refine your findings']]){
  const block=f(title,report,reportW-48,8);await t(block,'Label',title,'Caption / Caption 1','Text/Tertiary',undefined,true);await t(block,'Value',copy,'Body / Body 3','Text/Secondary',reportW-48,true);
 }
 await t(platform,'Concept note','Illustrative workflow based on the demo. No patient information is shown.','Caption / Caption 5','Text/Tertiary',cw,true);
 const benefits=f('Workflow benefits',platform,cw,stack?32:48,0,null,true,stack?'VERTICAL':'HORIZONTAL');
 const bw=stack?cw:(cw-96)/3;
 for(const [title,copy] of [['Navigate by voice','Keep your attention on the study while moving through the workspace.'],['Bring context together','Review available priors and your current report in the same reading flow.'],['Shape your routine','Help define the workflows and clinical tools your practice needs next.']]){
  const b=f(title,benefits,bw,12);await t(b,'Title',title,'Title / Title 1','Text/Primary',bw,true);await t(b,'Copy',copy,'Body / Body 3','Text/Secondary',bw,true);
 }
 const labs=section('03 / Tattrex Labs');
 const labsRow=f('Labs editorial split',labs,cw,stack?40:64,0,null,false,stack?'VERTICAL':'HORIZONTAL');
 const lw=stack?cw:(cw-64)/2;
 const labText=f('Labs story',labsRow,lw,32);
 await t(labText,'Labs heading','The next advance\ncould start with\nyour observation.',hstyle,'Text/Primary',lw);
 await t(labText,'Labs introduction','Tattrex Labs works hand in hand with individual radiologists to bring clinical ideas to life. You bring the insight. We bring the engineering and research partnership.','Body / Body 7','Text/Secondary',lw);
 button(labText,'Bring an idea',true);
 const atlas=f('Labs research atlas',labsRow,lw,24,small?24:32,'Surface/Canvas',true);
 await t(atlas,'Atlas title','A research atlas for imaging','Title / Title 3','Text/Primary',lw-(small?48:64),true);
 const art=imageBox(atlas,'Cinematic volume study',lw-(small?48:64),small?220:320);
 art.fills=[{type:'IMAGE',imageHash,scaleMode:'FILL',imageTransform:[[1,0,0],[0,1,0]]}];
 await t(atlas,'Atlas scope','Across modalities. Across the body.','Caption / Caption 1','Text/Secondary',lw-(small?48:64),true);
 const research=f('Research directions',labs,cw,0);
 for(const [num,title,copy] of [['01','Clinical ideas','Start with a question from practice and define a focused path to a useful tool.'],['02','Foundation models','Develop imaging representations with a research ambition spanning modalities and the whole body.'],['03','Novel biomarkers','Explore imaging signals that could reveal new information about disease and patient outcomes.']]){
  line(research,cw);const row=f(title,research,cw,small?16:32,0,null,false,stack?'VERTICAL':'HORIZONTAL');padding(row,24,0);
  await t(row,'Index',num,'Caption / Caption 3','Text/Accent',stack?cw:48);
  await t(row,'Title',title,'Heading / Heading 5','Text/Primary',stack?cw:340);
  await t(row,'Copy',copy,'Body / Body 3','Text/Secondary',stack?cw:cw-48-340-64);
 }line(research,cw);
 const approach=section('04 / Our approach','Surface/Secondary');
 await t(approach,'Approach heading','Built together.\nCarried through.',hstyle,'Text/Primary',Math.min(cw,680));
 await t(approach,'Approach introduction','A close partnership from the first clinical question to the work needed for a product.','Body / Body 7','Text/Secondary',Math.min(cw,600));
 const steps=f('Partnership steps',approach,cw,stack?40:48,0,null,false,stack?'VERTICAL':'HORIZONTAL');const sw=stack?cw:(cw-96)/3;
 for(const [num,title,copy] of [['01','Define the question','Start with the workflow problem or imaging insight you want to investigate. Agree on the clinical value and the scope together.'],['02','Develop and validate','Build with radiologists involved throughout. Refine the tool, evaluate it against the intended use and test what matters in practice.'],['03','Work toward deployment','Tattrex leads the path toward regulatory approval and productisation, with the evidence and requirements shaped by each intended use.']]){
  const step=f(title,steps,sw,24);await t(step,'Number',num,'Heading / Heading 2','Text/Accent');line(step,sw);await t(step,'Title',title,'Heading / Heading 5','Text/Primary',sw);await t(step,'Copy',copy,'Body / Body 3','Text/Secondary',sw);
 }
 const tagline=section('05 / Shared ambition','Surface/Accent',false,32);
 await t(tagline,'Tagline','You bring the clinical insight.\nWe build what comes next.',small?'Heading / Heading 3':'Heading / Heading 1','Text/OnAction',Math.min(cw,680));
 await t(tagline,'Supporting statement','Your expertise belongs at the centre of what imaging becomes.','Body / Body 7','Text/OnAction',Math.min(cw,600));
 const faq=section('06 / Questions');
 await t(faq,'FAQ heading','Before we begin',hstyle,'Text/Primary',Math.min(cw,680));
 const faqList=f('FAQ list',faq,cw,8);
 for(const [q,a] of faqCopy){const item=inst(faqList,faqDefault,'FAQ / '+q);item.resize(cw,item.height);item.setProperties({'Question#6:58':q,'Answer#6:65':a});
  for(const c of item.findAll(n=>n.type==='TEXT')){if(c.name.includes('Question')){c.resize(cw-96,c.height);c.textAutoResize='HEIGHT';}if(c.name.includes('Answer')){c.resize(cw-48,c.height);c.textAutoResize='HEIGHT';}}
  for(const c of item.children){if(c.type==='FRAME')c.resize(cw-48,c.height);}
 }
 const contact=section('07 / Start a conversation','Surface/Primary',true);
 await t(contact,'Contact heading','What will you\nbuild with Tattrex?',hstyle,'Text/Primary',Math.min(cw,680),true);
 const contacts=f('Contact paths',contact,cw,stack?32:64,0,null,true,stack?'VERTICAL':'HORIZONTAL');const ctw=stack?cw:(cw-64)/2;
 for(const [title,copy,cta] of [['Explore the platform','See the current demo and talk through your daily reading workflow.','Request a demo'],['Start with an idea','Bring a clinical question, an observation or a research direction.','Bring an idea']]){const p=f(title,contacts,ctw,24);line(p,ctw,true);await t(p,'Title',title,'Heading / Heading 5','Text/Primary',ctw,true);await t(p,'Description',copy,'Body / Body 3','Text/Secondary',ctw,true);button(p,cta);}
 const footer=section('08 / Footer','Surface/Primary',true,32);padding(footer,48,gutter);
 line(footer,cw,true);const foot=f('Footer content',footer,cw,24,0,null,true,stack?'VERTICAL':'HORIZONTAL');foot.primaryAxisAlignItems='SPACE_BETWEEN';inst(foot,logoDark,'Brand / Tattrex');
 await t(foot,'Footer note','Radiology, shaped by radiologists','Caption / Caption 2','Text/Secondary',undefined,true);
 await t(foot,'Legal destinations','Privacy    Terms','Caption / Caption 2','Text/Tertiary',undefined,true);
 result.push({label,rootId:root.id,platform:platform.id,labs:labs.id,approach:approach.id,tagline:tagline.id,faq:faq.id,contact:contact.id,width:root.width,height:root.height});
}
figma.viewport.scrollAndZoomIntoView([await figma.getNodeByIdAsync('7:2')]);
print('TATTREX_RESULT:'+JSON.stringify(result));
