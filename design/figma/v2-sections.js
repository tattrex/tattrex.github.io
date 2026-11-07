await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:3'));
const primary=await figma.getNodeByIdAsync('6:184'),secondary=await figma.getNodeByIdAsync('6:204');
const logoDark=await figma.getNodeByIdAsync('6:167');
function instance(parent,c,name){const n=track(c.createInstance());parent.appendChild(n);n.name=name;n.layoutPositioning='AUTO';return n;}
function button(parent,label,accent=false){const n=instance(parent,accent?primary:secondary,'Button / '+label);n.setProperties({'Label#6:26':label});return n;}
function abs(n,x,y){n.layoutPositioning='ABSOLUTE';n.x=x;n.y=y;return n;}
function picture(parent,name,w,h,hash,crop){const n=imageBox(parent,name,w,h);n.fills=[{type:'IMAGE',imageHash:hash,scaleMode:crop?'CROP':'FILL',...(crop?{imageTransform:crop}:{})}];return n;}
const out=[];
for(const [id,w,label] of [['27:3665',1440,'Desktop'],['27:3881',768,'Tablet'],['27:4083',390,'Mobile']]){
 const root=await figma.getNodeByIdAsync(id),small=w===390,stack=w<1000,g=small?24:stack?48:80,cw=w-2*g;
 const hs=small?'Heading / Heading 4':'Heading / Heading 2';
 function section(index,name,fill='Surface/Primary',dark=false,gap=48){const old=root.children[index];const n=f(name,null,w,gap,0,fill,dark);root.insertChild(index,n);old.remove();padding(n,small?64:96,g);return n;}
 const intro=section(1,'02 / Practice and possibility');
 await t(intro,'Heading','Built around how you see.',hs,'Text/Primary',Math.min(cw,680));
 const paths=f('Two equal ambitions',intro,cw,stack?48:64,0,null,false,stack?'VERTICAL':'HORIZONTAL');const pw=stack?cw:(cw-64)/2;
 for(const [name,title,copy,cta] of [['Tattrex platform','Read with intent.','Move through studies, priors and reports with voice and AI in the flow of your work.','Explore the platform'],['Tattrex Labs','Build from insight.','Bring the clinical question only you would think to ask. We work with you to turn it into something useful.','Explore the lab']]){
  const p=f(name,paths,pw,24);line(p,pw);await t(p,'Offering',name,'Caption / Caption 1','Text/Accent');await t(p,'Title',title,'Heading / Heading 3','Text/Primary',pw);await t(p,'Copy',copy,'Body / Body 7','Text/Secondary',pw);button(p,cta);
 }
 const platform=section(2,'03 / The voice workspace','Surface/Primary',true,48);
 const platformHeading=f('Platform / Opening',platform,cw,32,0,null,true,stack?'VERTICAL':'HORIZONTAL');
 await t(platformHeading,'Heading','One workspace.\nMoved by your voice.',hs,'Text/Primary',stack?cw:680,true);
 await t(platformHeading,'Introduction','Open the study. Bring in the prior. Capture the finding. Keep the clinical thought moving.','Body / Body 7','Text/Secondary',stack?cw:cw-712,true);
 const app=f('Platform / Immersive workspace concept',platform,cw,0,0,'Surface/Canvas',true);radius(app,8);app.clipsContent=true;app.strokes=[paint('Border/Primary',true)];app.strokeWeight=1;
 const appTop=f('Workspace / Top bar',app,cw,16,small?16:24,'Surface/Secondary',true,'HORIZONTAL');appTop.counterAxisAlignItems='CENTER';appTop.primaryAxisAlignItems='SPACE_BETWEEN';
 await t(appTop,'Product name','tattrex','Title / Title 1','Text/Primary',undefined,true);
 await t(appTop,'Current workspace','Reading room','Caption / Caption 1','Text/Secondary',undefined,true);
 if(!small)await t(appTop,'Concept label','Workspace concept','Caption / Caption 5','Text/Tertiary',undefined,true);
 const work=f('Workspace / Panes',app,cw,0,0,null,true,'HORIZONTAL');
 const sidebarW=stack?0:176,reportW=stack?0:280,viewerW=cw-sidebarW-reportW;
 if(!stack){const sidebar=f('Workspace / Worklist',work,sidebarW,24,24,'Surface/Primary',true);sidebar.resize(sidebarW,480);sidebar.layoutSizingVertical='FIXED';await t(sidebar,'Label','WORKLIST','Caption / Caption 3','Text/Tertiary',undefined,true);for(const [title,copy] of [['Current study','Reading'],['Prior study','Comparison'],['Report','In progress']]){const r=f(title,sidebar,128,8);await t(r,'Title',title,'Title / Title 4','Text/Primary',128,true);await t(r,'Status',copy,'Caption / Caption 5','Text/Secondary',128,true);line(r,128,true);}}
 const viewer=f('Workspace / Imaging viewport',work,viewerW,0,0,'Surface/Canvas',true);viewer.resize(viewerW,small?392:480);viewer.layoutSizingVertical='FIXED';viewer.clipsContent=true;
 const anatomy=picture(viewer,'Viewport / Illustrative anatomy',viewerW,small?392:480,'1d52f8edbb34c02422ed99555f014c3340926a4e',[[.45,0,.49],[0,1,0]]);abs(anatomy,0,0);
 const viewportTop=f('Viewport / Context',viewer,viewerW,16,24,null,true,'HORIZONTAL');viewportTop.primaryAxisAlignItems='SPACE_BETWEEN';abs(viewportTop,0,0);await t(viewportTop,'Study','Current study','Caption / Caption 1','Text/Primary',undefined,true);if(!small)await t(viewportTop,'Mode','Illustrative volume','Caption / Caption 5','Text/Tertiary',undefined,true);
 const scan=rect(viewer,'Viewport / Scan plane',viewerW,1,'Surface/Accent');abs(scan,0,small?208:248);scan.opacity=.7;
 if(!small){const inset=f('Viewport / Prior context',viewer,176,8,12,'Surface/Primary',true);abs(inset,24,264);radius(inset,4);inset.strokes=[paint('Border/Primary',true)];inset.strokeWeight=1;await t(inset,'Label','Prior comparison','Caption / Caption 1','Text/Primary',152,true);picture(inset,'Prior / Concept anatomy',152,124,'1d52f8edbb34c02422ed99555f014c3340926a4e',[[.35,0,.60],[0,.8,.08]]);}
 const viewportFoot=await t(viewer,'Viewport / Note','Illustrative anatomy · no patient data','Caption / Caption 5','Text/Tertiary',viewerW-48,true);abs(viewportFoot,24,small?352:440);
 if(!stack){const report=f('Workspace / Reporting',work,reportW,24,24,'Surface/Primary',true);report.resize(reportW,480);report.layoutSizingVertical='FIXED';await t(report,'Heading','Report workspace','Title / Title 3','Text/Primary',232,true);line(report,232,true);for(const [h,b] of [['Clinical context','Keep relevant context beside your study'],['Findings','Capture your observations by voice'],['Review','Refine the report before completing it']]){const p=f(h,report,232,12);await t(p,'Label',h,'Caption / Caption 1','Text/Tertiary',232,true);await t(p,'Copy',b,'Body / Body 3','Text/Secondary',232,true);}}
 const voice=f('Workspace / Voice layer',app,cw,24,small?24:32,'Surface/Secondary',true,small?'VERTICAL':'HORIZONTAL');voice.counterAxisAlignItems=small?'MIN':'CENTER';
 const waveform=f('Voice / Signal',voice,104,4,0,null,true,'HORIZONTAL');waveform.resize(104,40);waveform.layoutSizingVertical='FIXED';waveform.counterAxisAlignItems='CENTER';[8,16,24,40,24,12,32,16,8,24,12,8,16].forEach(h=>rect(waveform,'Signal / Bar',4,h,'Surface/Accent',false,2));
 const command=f('Voice / Intent',voice,small?cw-48:stack?cw-216:600,8);await t(command,'Command','“Bring up the prior and start my report”',small?'Heading / Heading 6':'Heading / Heading 5','Text/Primary',small?cw-48:stack?cw-216:600,true);await t(command,'Meaning','Your intent becomes the next action','Caption / Caption 2','Text/Secondary',undefined,true);
 await t(platform,'Concept note','Design concept informed by the v0.1 demo. Artwork is illustrative, not a clinical image.','Caption / Caption 5','Text/Tertiary',cw,true);
 const capabilities=f('Workflow / Capabilities',platform,cw,stack?24:48,0,null,true,stack?'VERTICAL':'HORIZONTAL');const bw=stack?cw:(cw-96)/3;
 for(const [h,b] of [['Navigate','Move through the worklist and study with your voice.'],['Compare','Bring available priors into the same reading flow.'],['Report','Dictate, review and refine findings in context.']]){const p=f(h,capabilities,bw,12);line(p,bw,true);await t(p,'Title',h,'Heading / Heading 5','Text/Primary',bw,true);await t(p,'Copy',b,'Body / Body 3','Text/Secondary',bw,true);}
 const labs=section(3,'04 / The research atlas','Surface/Canvas',true,48);
 const labTitle=f('Labs / Editorial opening',labs,cw,32,0,null,true,stack?'VERTICAL':'HORIZONTAL');
 await t(labTitle,'Heading','Tattrex Labs',small?'Heading / Heading 3':'Heading / Heading 1','Text/Primary',stack?cw:680,true);
 await t(labTitle,'Introduction','A place for the clinical ideas that do not fit inside today’s tools. Built hand in hand with radiologists.','Body / Body 7','Text/Secondary',stack?cw:cw-712,true);
 const atlas=f('Labs / Spatial research atlas',labs,cw,0,0,'Surface/Canvas',true);atlas.resize(cw,small?390:stack?510:720);atlas.layoutSizingVertical='FIXED';atlas.clipsContent=true;
 const atlasArt=picture(atlas,'Atlas / Full body and scan planes',small?720:stack?900:cw,small?403:stack?504:720,'16885fd5acbdc1f6ba5f836008f340259d73cfaf');abs(atlasArt,small?-185:stack?-114:0,0);
 if(!stack){for(const [copy,x,y] of [['Clinical questions',0,72],['Imaging representations',976,72],['Signals worth exploring',960,610]]){const tag=f('Atlas / '+copy,atlas,280,12,16,'Surface/Primary',true);abs(tag,x,y);tag.strokes=[paint('Border/Primary',true)];tag.strokeWeight=1;await t(tag,'Label',copy,'Caption / Caption 1','Text/Primary',248,true);}}
 const scope=f('Labs / Scope',labs,cw,24,0,null,true,stack?'VERTICAL':'HORIZONTAL');scope.primaryAxisAlignItems='SPACE_BETWEEN';await t(scope,'Statement','Every modality.\nThe whole body.',small?'Heading / Heading 4':'Heading / Heading 2','Text/Primary',stack?cw:680,true);await t(scope,'Scope note','Our research ambition spans imaging modalities and anatomy. Every collaboration starts with a defined question, dataset and validation scope.','Body / Body 3','Text/Secondary',stack?cw:440,true);
 const research=f('Labs / Research directions',labs,cw,0);
 for(const [num,title,copy] of [['01','Clinical ideas','A clinical observation becomes a focused question, then a tool worth testing.'],['02','Foundation models','Learn representations that can connect information across imaging tasks and modalities.'],['03','Novel biomarkers','Explore imaging signals that could reveal something new about disease and outcomes.']]){line(research,cw,true);const r=f(title,research,cw,small?16:32,0,null,true,stack?'VERTICAL':'HORIZONTAL');padding(r,24,0);await t(r,'Index',num,'Caption / Caption 3','Text/Accent',stack?cw:40,true);await t(r,'Title',title,'Heading / Heading 5','Text/Primary',stack?cw:340,true);await t(r,'Copy',copy,'Body / Body 3','Text/Secondary',stack?cw:cw-444,true);}line(research,cw,true);button(labs,'Bring an idea');
 const approach=section(4,'05 / From question to practice');
 await t(approach,'Heading','A question is\nonly the beginning.',hs,'Text/Primary',Math.min(cw,680));
 const stair=f('Partnership / Progression',approach,cw,stack?40:48,0,null,false,stack?'VERTICAL':'HORIZONTAL');const sw=stack?cw:(cw-96)/3;
 for(const [i,title,copy] of [[0,'Find the question','Begin with your clinical observation. Define the value and the intended use together.'],[1,'Build the evidence','Develop and validate with radiologists involved throughout. Test what matters in practice.'],[2,'Carry it through','Tattrex leads the path toward regulatory approval and productisation for the intended use.']]){const step=f(title,stair,sw,24);if(!stack)padding(step,i===0?0:i===1?48:96,0,0,0);await t(step,'Number','0'+(i+1),small?'Heading / Heading 2':'Heading / Heading 7','Text/Accent');line(step,sw);await t(step,'Title',title,'Heading / Heading 5','Text/Primary',sw);await t(step,'Copy',copy,'Body / Body 3','Text/Secondary',sw);}
 const statement=section(5,'06 / Your insight made real','Surface/Accent',false,32);
 const statementBody=f('Statement / Editorial split',statement,cw,stack?48:64,0,null,false,stack?'VERTICAL':'HORIZONTAL');
 const st=f('Statement / Words',statementBody,stack?cw:680,32);await t(st,'Tagline','Your insight.\nMade real.',small?'Heading / Heading 3':'Heading / Heading 1','Text/OnAction',stack?cw:680);await t(st,'Meaning','The next chapter of imaging should be written with the people who read it.','Body / Body 7','Text/OnAction',stack?cw:520);
 const markW=small?cw:stack?360:480,markH=markW*150/206;const symbol=f('Brand / Architectural scan frame',statementBody,markW,0);symbol.resize(markW,markH);symbol.layoutSizingVertical='FIXED';
 const src='<svg xmlns="http://www.w3.org/2000/svg" width="'+markW+'" height="'+markH+'" viewBox="0 -25 206 150"><path d="M5 -25V125M201 -25V125" fill="none" stroke="#ffffff" stroke-width="1"/><circle cx="103" cy="50" r="70" fill="none" stroke="#ffffff" stroke-width="1"/></svg>';const mark=figma.createNodeFromSvg(src);symbol.appendChild(mark);mark.name='Brand / Dotless scan symbol';for(const n of mark.findAll()){n.name='Brand / Symbol path';if('strokes'in n&&Array.isArray(n.strokes))n.strokes=n.strokes.map(p=>p.type==='SOLID'?paint('Text/OnAction'):p);}mark.opacity=.65;
 // Retain the reviewed FAQ content and its responsive interactive instances.
 const faq=root.children[6];faq.name='07 / Questions';
 const contact=section(7,'08 / The next conversation','Surface/Primary',true,48);
 await t(contact,'Heading','Where do you\nwant to take radiology?',hs,'Text/Primary',Math.min(cw,680),true);
 const contactPaths=f('Contact / Equal invitations',contact,cw,stack?40:64,0,null,true,stack?'VERTICAL':'HORIZONTAL');const cpw=stack?cw:(cw-64)/2;
 for(const [num,title,copy,cta] of [['01','Into your daily practice','See the current platform and talk through your reading workflow.','Request a demo'],['02','Into new territory','Bring a clinical question or a research direction to Tattrex Labs.','Bring an idea']]){const c=f(title,contactPaths,cpw,24);line(c,cpw,true);await t(c,'Index',num,'Caption / Caption 3','Text/Accent',undefined,true);await t(c,'Title',title,'Heading / Heading 5','Text/Primary',cpw,true);await t(c,'Copy',copy,'Body / Body 3','Text/Secondary',cpw,true);button(c,cta);}
 const footer=section(8,'09 / Tattrex signature','Surface/Canvas',true,48);padding(footer,48,g);
 const word=logoDark.children.find(n=>n.name==='Brand / Drawn wordmark artwork').clone();footer.appendChild(word);word.name='Brand / Monumental wordmark';word.rescale(cw/word.width);
 const foot=f('Footer / Details',footer,cw,24,0,null,true,stack?'VERTICAL':'HORIZONTAL');foot.primaryAxisAlignItems='SPACE_BETWEEN';await t(foot,'Positioning','Radiology, shaped by radiologists','Caption / Caption 2','Text/Secondary',undefined,true);await t(foot,'Legal destinations','Privacy    Terms','Caption / Caption 2','Text/Tertiary',undefined,true);
 out.push({label,rootId:id,width:w,height:root.height,heroId:root.children[0].id,introId:intro.id,platformId:platform.id,labsId:labs.id,approachId:approach.id,statementId:statement.id,faqId:faq.id,contactId:contact.id});
}
figma.viewport.scrollAndZoomIntoView([await figma.getNodeByIdAsync('27:3665')]);
print('V2_LAYOUTS:'+JSON.stringify(out));
