await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:2'));
const arrowSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"/></svg>';
const markSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -25 206 150"><path d="M5 -25V125M201 -25V125" fill="none" stroke="#16171c" stroke-width="10"/><circle cx="103" cy="50" r="70" fill="none" stroke="#16171c" stroke-width="10"/><circle cx="103" cy="50" r="24" fill="#c8452f"/></svg>';
const wordSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -40 575 145"><g fill="none" stroke="#16171c" stroke-width="10"><path d="M22 -35V100M0 5H48"/><circle cx="112" cy="50" r="45"/><path d="M157 0V100"/><path d="M198 -35V100M176 5H224"/><path d="M254 -35V100M232 5H280"/><path d="M303 0V100M303 50A45 45 0 0 1 348 5H355"/><path d="M378 50H468A45 45 0 1 0 457.5 78.9"/></g><path fill="#16171c" d="M489 0H501.6L565 100H552.4ZM552.4 0H565L501.6 100H489Z"/></svg>';
const board=f('Components / Review',null,1440,48,64,'Surface/Primary');board.x=160;board.y=160;
await t(board,'Components / Title','Designed to stay coherent','Heading / Heading 2');
await t(board,'Components / Caption','Shared geometry, named text styles and bound semantic colours.\nButton states: Default, Hover, Pressed, Focus and Disabled.','Body / Body 7');
const logoRow=f('Brand / Lockups',board,undefined,64,32,null,false,'HORIZONTAL');
const logos=[];
for(const dark of [false,true]){
 const box=f('Brand / '+(dark?'Dark':'Light'),logoRow,560,24,32,'Surface/Primary',dark);
 await t(box,'Brand / Title',dark?'On charcoal':'On warm paper','Caption / Caption 1','Text/Secondary',undefined,dark);
 const c=track(figma.createComponent()); c.name='Theme='+(dark?'Dark':'Light');c.layoutMode='HORIZONTAL';spacing(c,12,0);c.fills=[];c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';box.appendChild(c);
 const mark=svg(c,'Brand / Scan focus',markSvg,41.2,30,'Icon/Default',dark);const paths=mark.findAll();const dot=paths[paths.length-1];if(dot&&'fills' in dot)dot.fills=[paint('Icon/Accent',dark)];
 svg(c,'Brand / Drawn wordmark',wordSvg,115,29,'Icon/Default',dark);logos.push(c);
}
// Components remain separate so each preserves its original source palette.
logos[0].name='Brand / Logo / Light';logos[1].name='Brand / Logo / Dark';
const buttonArea=f('Buttons / States',board,1312,24);await t(buttonArea,'Buttons / Title','Buttons','Heading / Heading 4');
const variants=[];const lookup={};
for(const [ri,type] of ['Primary','Secondary','Tertiary','Error','Warning'].entries()){
 for(const [ci,state] of ['Default','Hover','Pressed','Focus','Disabled'].entries()){
  const c=track(figma.createComponent());c.name='Type='+type+', State='+state;c.layoutMode='HORIZONTAL';spacing(c,12,0);padding(c,8,12);radius(c,4);c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';
  const suffix=state==='Hover'?'-Hover':state==='Pressed'?'-Click':state==='Disabled'?'-Disabled':'';
  c.fills=type==='Tertiary'?[]:[paint('Action/'+type+suffix)];
  if(type==='Secondary'){c.strokes=[paint('Border/Action-Secondary')];c.strokeWeight=1;}
  if(state==='Focus'){c.strokes=[paint('Border/Focus')];c.strokeWeight=2;c.strokeAlign='OUTSIDE';}
  const neutral=type==='Secondary'||type==='Tertiary';const color=state==='Disabled'?'Text/Secondary-Disabled':neutral?'Text/Primary':'Text/OnAction';
  await t(c,'Label','Request a demo','Button / Button-md',color);
  svg(c,'Arrow up right / Phosphor',arrowSvg,20,20,neutral?'Icon/Default':'Text/OnAction');
  c.minHeight=44;variants.push(c);lookup[type+'/'+state]=c;
 }
}
const buttons=track(figma.combineAsVariants(variants,buttonArea));buttons.name='Button / Medium';buttons.layoutMode='VERTICAL';spacing(buttons,16,24);buttons.fills=[];
buttons.resize(1264,400);buttons.layoutSizingHorizontal='FIXED';buttons.layoutSizingVertical='FIXED';
for(const [i,c] of variants.entries()){c.layoutPositioning='ABSOLUTE';c.x=24+(i%5)*240;c.y=24+Math.floor(i/5)*72;}
const labelKey=buttons.addComponentProperty('Label','TEXT','Request a demo');
for(const c of variants)c.findOne(n=>n.type==='TEXT'&&n.name==='Label').componentPropertyReferences={characters:labelKey};
for(const type of ['Primary','Secondary','Tertiary','Error','Warning']){
 await lookup[type+'/Default'].setReactionsAsync([{trigger:{type:'ON_HOVER'},actions:[{type:'NODE',destinationId:lookup[type+'/Hover'].id,navigation:'CHANGE_TO',transition:trans}]}]);
 await lookup[type+'/Hover'].setReactionsAsync([{trigger:{type:'MOUSE_LEAVE',delay:0},actions:[{type:'NODE',destinationId:lookup[type+'/Default'].id,navigation:'CHANGE_TO',transition:trans}]},{trigger:{type:'ON_PRESS'},actions:[{type:'NODE',destinationId:lookup[type+'/Pressed'].id,navigation:'CHANGE_TO',transition:trans}]}]);
 await lookup[type+'/Pressed'].setReactionsAsync([{trigger:{type:'MOUSE_UP',delay:0},actions:[{type:'NODE',destinationId:lookup[type+'/Hover'].id,navigation:'CHANGE_TO',transition:trans}]}]);
}
const navArea=f('Navigation / States',board,1312,24);await t(navArea,'Navigation / Title','Navigation links','Heading / Heading 4');
const navs=[];
for(const state of ['Default','Hover','Pressed','Focus','Disabled']){
 const c=track(figma.createComponent());c.name='State='+state;c.layoutMode='HORIZONTAL';spacing(c,8,12);c.fills=state==='Hover'||state==='Pressed'?[paint('Surface/Primary-Hover')]:[];radius(c,4);c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.minHeight=44;
 if(state==='Focus'){c.strokes=[paint('Border/Focus')];c.strokeWeight=2;}
 await t(c,'Label','Platform','Title / Title 4',state==='Disabled'?'Text/Secondary-Disabled':'Text/Primary');navs.push(c);
}
const navSet=track(figma.combineAsVariants(navs,navArea));navSet.name='Navigation / Link';navSet.layoutMode='HORIZONTAL';spacing(navSet,24,24);navSet.fills=[];const navKey=navSet.addComponentProperty('Label','TEXT','Platform');for(const c of navs)c.findOne(n=>n.type==='TEXT').componentPropertyReferences={characters:navKey};
const faqArea=f('FAQ / States',board,1312,24);await t(faqArea,'FAQ / Title','Questions, with room for answers','Heading / Heading 4');
const faqs=[];
for(const state of ['Default','Hover','Pressed','Focus','Disabled','Expanded']){
 const c=track(figma.createComponent());c.name='State='+state;c.layoutMode='VERTICAL';spacing(c,16,24);c.resize(600,100);c.layoutSizingVertical='HUG';c.fills=[paint(state==='Hover'||state==='Pressed'?'Surface/Secondary':'Surface/Primary')];
 if(state==='Focus'){c.strokes=[paint('Border/Focus')];c.strokeWeight=2;}
 const row=f('Question row',c,552,16,0,null,false,'HORIZONTAL');row.counterAxisAlignItems='CENTER';
 await t(row,'Question','What can I do with the demo?','Title / Title 3',state==='Disabled'?'Text/Secondary-Disabled':'Text/Primary',512);
 await t(row,'Expand',state==='Expanded'?'−':'+','Heading / Heading 5');
 const answer=await t(c,'Answer','Explore voice commands for the worklist and viewer, retrieve priors, and work with dictation and reports. We can walk you through the current v0.1 platform.','Body / Body 3','Text/Secondary',552);answer.visible=state==='Expanded';faqs.push(c);
}
const faqSet=track(figma.combineAsVariants(faqs,faqArea));faqSet.name='FAQ / Item';faqSet.layoutMode='VERTICAL';spacing(faqSet,24,0);faqSet.fills=[];
const qKey=faqSet.addComponentProperty('Question','TEXT','What can I do with the demo?');const aKey=faqSet.addComponentProperty('Answer','TEXT','Explore the current platform with us.');
for(const c of faqs){c.findOne(n=>n.type==='TEXT'&&n.name==='Question').componentPropertyReferences={characters:qKey};c.findOne(n=>n.type==='TEXT'&&n.name==='Answer').componentPropertyReferences={characters:aKey};}
for(const c of faqs.filter(n=>n.name!=='State=Disabled')) await c.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:(c.name==='State=Expanded'?faqs[0]:faqs[5]).id,navigation:'CHANGE_TO',transition:{...trans,duration:0.5}}]}]);
return {createdNodeIds,rootId:board.id,logos:{light:logos[0].id,dark:logos[1].id},buttons:{set:buttons.id,primary:lookup['Primary/Default'].id,secondary:lookup['Secondary/Default'].id,tertiary:lookup['Tertiary/Default'].id,labelKey},nav:{set:navSet.id,default:navs[0].id,labelKey:navKey},faq:{set:faqSet.id,default:faqs[0].id,expanded:faqs[5].id,questionKey:qKey,answerKey:aKey},counts:{buttonVariants:variants.length,navVariants:navs.length,faqVariants:faqs.length}};
