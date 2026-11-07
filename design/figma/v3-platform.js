await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:3'));
const secondary=await figma.getNodeByIdAsync('6:204');
function abs(n,x,y){n.layoutPositioning='ABSOLUTE';n.x=x;n.y=y;return n;}
function button(parent,label){const n=secondary.createInstance();parent.appendChild(n);n.layoutPositioning='AUTO';n.name='Button / '+label;n.setProperties({'Label#6:26':label});return n;}
function picture(parent,name,w,h,hash){const n=imageBox(parent,name,w,h);n.fills=[{type:'IMAGE',imageHash:hash,scaleMode:'FILL'}];return n;}
const out=[];
for(const [id,w] of [['27:6128',1440],['27:6445',768],['27:6679',390]]){
 const root=await figma.getNodeByIdAsync(id),small=w===390,stack=w<1000,g=small?24:stack?48:80,cw=w-2*g;
 const oldIntro=root.children[1];const intro=f('02 / Two paths from clinical perspective',null,w,48,0,'Surface/Primary');root.insertChild(1,intro);oldIntro.remove();padding(intro,small?64:96,g);
 const opening=f('Introduction / Editorial split',intro,cw,stack?40:96,0,null,false,stack?'VERTICAL':'HORIZONTAL');
 await t(opening,'Introduction / Heading','Built around\nhow you see.',small?'Heading / Heading 3':'Heading / Heading 1','Text/Primary',stack?cw:560);
 const paths=f('Introduction / Two equal paths',opening,stack?cw:624,32);
 for(const [num,label,copy] of [['01','In your reading room','A voice and AI native platform that brings studies, priors and reports into your flow.'],['02','Beyond today’s tools','A research partnership that starts with your clinical idea and builds toward practice.']]){
  const p=f(label,paths,stack?cw:624,16);line(p,stack?cw:624);const row=f('Path / Identity',p,stack?cw:624,16,0,null,false,'HORIZONTAL');await t(row,'Index',num,'Caption / Caption 3','Text/Accent',24);await t(row,'Name',label,'Heading / Heading 5','Text/Primary',stack?cw-40:584);await t(p,'Copy',copy,'Body / Body 7','Text/Secondary',stack?cw:560);
 }
 const old=root.children[2];const section=f('03 / Work / The voice instrument',null,w,48,0,'Surface/Canvas',true);root.insertChild(2,section);old.remove();padding(section,small?64:96,g);
 const title=f('Platform / Chapter heading',section,cw,24,0,null,true,stack?'VERTICAL':'HORIZONTAL');
 await t(title,'Platform / Index','02 / Work','Caption / Caption 1','Text/Accent',stack?cw:200,true);
 await t(title,'Platform / Heading','Stay with the study.\nSpeak the next step.',small?'Heading / Heading 3':'Heading / Heading 1','Text/Primary',stack?cw:680,true);
 const scene=f('Platform / Reading room stage',section,cw,0,0,'Surface/Canvas',true);scene.resize(cw,small?944:stack?1064:720);scene.layoutSizingVertical='FIXED';scene.clipsContent=true;
 const vw=small?cw:stack?cw:784,vh=small?500:stack?640:720;
 const viewport=f('Stage / Active imaging viewport',scene,vw,0,0,'Surface/Canvas',true);abs(viewport,stack?0:496,0);viewport.resize(vw,vh);viewport.layoutSizingVertical='FIXED';viewport.clipsContent=true;
 const vol=picture(viewport,'Viewport / Artistic full body volume',vh*1.75,vh,'1d52f8edbb34c02422ed99555f014c3340926a4e');abs(vol,vw/2-vh*1.75*.75,0);
 const context=f('Viewport / Context',viewport,vw-32,16,0,null,true,'HORIZONTAL');abs(context,16,16);context.primaryAxisAlignItems='SPACE_BETWEEN';await t(context,'Study','Current study','Caption / Caption 1','Text/Primary',undefined,true);await t(context,'Label','Illustrative volume','Caption / Caption 5','Text/Secondary',undefined,true);
 const plane=rect(viewport,'Viewport / Active scan plane',vw,1,'Surface/Accent');abs(plane,0,vh*.46);
 const annotation=await t(viewport,'Viewport / Annotation','No patient data','Caption / Caption 5','Text/Secondary',200,true);abs(annotation,16,vh-32);
 if(!stack){
  const explanation=f('Stage / Clinical context',scene,400,24);abs(explanation,0,32);await t(explanation,'Heading','Your intent is\nthe interface.','Heading / Heading 2','Text/Primary',400,true);await t(explanation,'Copy','Navigate the study, compare a prior and shape the report without breaking your train of thought.','Body / Body 7','Text/Secondary',368,true);
  const prior=f('Stage / Prior inset',scene,192,12,16,'Surface/Primary',true);abs(prior,512,472);radius(prior,4);prior.strokes=[paint('Border/Primary',true)];prior.strokeWeight=1;await t(prior,'Label','Prior comparison','Caption / Caption 1','Text/Primary',160,true);const holder=f('Prior / Image crop',prior,160,0);holder.resize(160,144);holder.layoutSizingVertical='FIXED';holder.clipsContent=true;const a=picture(holder,'Prior / Illustrative volume',252,144,'1d52f8edbb34c02422ed99555f014c3340926a4e');abs(a,-109,0);
  const report=f('Stage / Report context',scene,224,24,24,'Surface/Primary',true);abs(report,1056,144);radius(report,4);report.strokes=[paint('Border/Primary',true)];report.strokeWeight=1;await t(report,'Title','Report','Title / Title 1','Text/Primary',176,true);line(report,176,true);await t(report,'Findings label','Findings','Caption / Caption 1','Text/Secondary',176,true);await t(report,'Findings copy','Your observations, captured in context.','Body / Body 3','Text/Primary',176,true);await t(report,'Review status','Ready for your review','Caption / Caption 5','Text/Secondary',176,true);
 }
 const instrument=f('Voice instrument / Compare',scene,stack?cw:496,24,small?24:32,'Surface/Primary',true);abs(instrument,0,small?528:stack?680:328);radius(instrument,8);instrument.strokes=[paint('Border/Primary',true)];instrument.strokeWeight=1;
 const iw=stack?cw-(small?48:64):432;
 const status=f('Instrument / Status',instrument,iw,16,0,null,true,'HORIZONTAL');status.primaryAxisAlignItems='SPACE_BETWEEN';await t(status,'Mode','Voice workspace','Caption / Caption 1','Text/Primary',undefined,true);await t(status,'State','Comparing','Caption / Caption 1','Text/Accent',undefined,true);
 const signal=f('Instrument / Signal',instrument,iw,4,0,null,true,'HORIZONTAL');signal.resize(iw,64);signal.layoutSizingVertical='FIXED';signal.counterAxisAlignItems='CENTER';
 const bars=Math.floor(iw/8);for(let i=0;i<bars;i++){const hs=[8,12,24,40,56,32,16,8,24,48,64,32,16,24,40,16];rect(signal,'Voice / Signal '+i,4,hs[i%hs.length],'Surface/Accent',false,2);}
 await t(instrument,'Instrument / Command','“Bring up the prior”',small?'Heading / Heading 5':'Heading / Heading 4','Text/Primary',iw,true);
 await t(instrument,'Instrument / Feedback','Comparison in the same reading flow.','Body / Body 6','Text/Secondary',iw,true);
 line(instrument,iw,true);
 const modes=f('Instrument / Workflow sequence',instrument,iw,0,0,null,true,'HORIZONTAL');for(const label of ['01 Navigate','02 Compare','03 Report'])await t(modes,'Step / '+label,label,'Caption / Caption 3',label.includes('Compare')?'Text/Primary':'Text/Secondary',iw/3,true);
 const note=f('Platform / Explanation and action',section,cw,stack?24:48,0,null,true,stack?'VERTICAL':'HORIZONTAL');
 await t(note,'Platform / Description',small?'Your study and your next action,\nin one place.\nA workflow that feels like yours.':'One place for your study, your context and your next action.\nShape the workflow around the way you practise.','Body / Body 7','Text/Secondary',stack?cw:800,true);button(note,'Request a demo');
 await t(section,'Platform / Concept note','Interface direction informed by the v0.1 demo. Anatomy is artistic, not a clinical image.','Caption / Caption 5','Text/Tertiary',cw,true);
 out.push({id,introId:intro.id,platformId:section.id,sceneId:scene.id,instrumentId:instrument.id});
}
print('V3_PLATFORM:'+JSON.stringify(out));
