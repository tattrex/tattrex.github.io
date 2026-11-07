await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:3'));
const screenPage=figma.currentPage;
const logoDark=await figma.getNodeByIdAsync('6:167');
const secondary=await figma.getNodeByIdAsync('6:204');
const navMaster=await figma.getNodeByIdAsync('6:307');
function instance(parent,c,name){const n=track(c.createInstance());parent.appendChild(n);n.name=name;n.layoutPositioning='AUTO';return n;}
function button(parent,label){const n=instance(parent,secondary,'Button / '+label);n.setProperties({'Label#6:26':label});return n;}
function abs(n,x,y){n.layoutPositioning='ABSOLUTE';n.x=x;n.y=y;return n;}
function art(parent,name,w,h,hash){const n=imageBox(parent,name,w,h);n.fills=[{type:'IMAGE',imageHash:hash,scaleMode:'FILL'}];return n;}
const roots=[];
for(const [sourceId,w,x,label] of [['7:2',1440,7000,'Desktop'],['7:45',768,8600,'Tablet'],['7:88',390,9550,'Mobile']]){
 const existing=screenPage.children.find(n=>n.name==='Concept 02 / '+label);if(existing)throw new Error('Concept 02 already exists: '+existing.id);
 const source=await figma.getNodeByIdAsync(sourceId);const root=source.clone();root.name='Concept 02 / '+label;root.x=x;root.y=160;
 const old=root.children[0];old.remove();
 const mobile=w===390,tablet=w===768,stack=w<1000,g=mobile?24:tablet?48:80,cw=w-2*g,H=tablet?1160:1040;
 const hero=f('01 / The imaging observatory',null,w,0,0,'Surface/Canvas',true);root.insertChild(0,hero);hero.resize(w,H);hero.layoutSizingVertical='FIXED';hero.clipsContent=true;
 const image=art(hero,'Hero / Scan sculpture',mobile?700:tablet?1000:1440,mobile?392:tablet?560:806,'97b8be18c7a649cae398db3a78fa97279ffd3749');abs(image,mobile?-210:tablet?-316:0,mobile?520:tablet?448:64);
 const nav=f('Navigation / Floating observatory bar',hero,mobile?342:tablet?672:960,24,16,'Surface/Primary',true,'HORIZONTAL');abs(nav,mobile?24:tablet?48:240,mobile?24:32);nav.counterAxisAlignItems='CENTER';nav.primaryAxisAlignItems='SPACE_BETWEEN';radius(nav,8);nav.strokes=[paint('Border/Primary',true)];nav.strokeWeight=1;
 instance(nav,logoDark,'Brand / Tattrex without centre dot');
 const links=f('Navigation / Links',nav,undefined,8,0,null,true,'HORIZONTAL');
 for(const label of mobile?['Menu']:['Platform','Labs','Our approach']){const n=instance(links,navMaster,'Navigation / '+label);n.setProperties({'Label#6:52':label});for(const t of n.findAll(n=>n.type==='TEXT'))t.fills=[paint('Text/Primary',true)];}
 const content=f('Hero / Editorial composition',hero,stack?cw:680,mobile?24:tablet?32:96);abs(content,g,mobile?144:tablet?160:224);
 const headline=await t(content,'Hero / Heading','Radiology,\nshaped by you',mobile?'Heading / Heading 3':tablet?'Heading / Heading 2':'Heading / Heading 1','Text/Primary',stack?cw:680,true);
 headline.fills=[{type:'GRADIENT_LINEAR',gradientTransform:[[1,0,0],[0,1,0]],gradientStops:[{position:0,color:{r:1,g:1,b:1,a:1},boundVariables:{color:{type:'VARIABLE_ALIAS',id:D['Text/Hero-start'].id}}},{position:1,color:{r:.608,g:.608,b:.608,a:1},boundVariables:{color:{type:'VARIABLE_ALIAS',id:D['Text/Hero-end'].id}}}]}];
 const body=f('Hero / Meaning and actions',content,stack?cw:460,24);
 await t(body,'Hero / Description',mobile?'A voice and AI native platform\nfor your daily practice.\nA research partner for what comes next.':'A voice and AI native platform for your practice.\nA research partner for what comes next.',mobile?'Body / Body 3':'Body / Body 7','Text/Secondary',stack?cw:460,true);
 const actions=f('Hero / Equal actions',body,stack?cw:undefined,12,0,null,true,mobile?'VERTICAL':'HORIZONTAL');
 for(const label of ['Request a demo','Bring an idea']){const n=button(actions,label);if(mobile)n.resize(cw,48);}
 if(!stack){
  const cue=f('Hero / Voice intent',hero,328,16,16,'Surface/Primary',true,'HORIZONTAL');abs(cue,970,744);radius(cue,8);cue.strokes=[paint('Border/Primary',true)];cue.strokeWeight=1;cue.counterAxisAlignItems='CENTER';
  const wave=f('Voice / Waveform',cue,80,4,0,null,true,'HORIZONTAL');wave.counterAxisAlignItems='CENTER';wave.resize(80,32);wave.layoutSizingVertical='FIXED';
  [8,16,24,32,16,8,24,16,8].forEach(h=>rect(wave,'Voice / Bar',4,h,'Surface/Accent',false,2));
  await t(cue,'Voice / Command','“Show me the prior”','Body / Body 5','Text/Primary',184,true);
 }
 const caption=await t(hero,'Hero / Artwork caption','An artistic study of imaging','Caption / Caption 5','Text/Tertiary',cw,true);abs(caption,g,tablet?976:mobile?904:840);
 const lower=f('Hero / Two territories',hero,w,stack?16:48,0,'Surface/Primary',true,stack?'VERTICAL':'HORIZONTAL');abs(lower,0,tablet?1008:928);padding(lower,24,g);lower.resize(w,tablet?152:112);lower.layoutSizingVertical='FIXED';
 for(const [num,label,copy] of [['01','The reading room','Tattrex platform'],['02','The research frontier','Tattrex Labs']]){
  const row=f('Territory / '+copy,lower,stack?cw:(cw-48)/2,16,0,null,true,'HORIZONTAL');row.counterAxisAlignItems='CENTER';
  await t(row,'Index',num,'Caption / Caption 3','Text/Accent',24,true);
  await t(row,'Title',label,mobile?'Title / Title 3':'Title / Title 1','Text/Primary',stack?cw-40:300,true);
  if(!stack)await t(row,'Offering',copy,'Caption / Caption 1','Text/Tertiary',undefined,true);
 }
 roots.push({label,rootId:root.id,heroId:hero.id,width:w,height:root.height});
}
figma.currentPage.selection=[await figma.getNodeByIdAsync(roots[0].rootId)];figma.viewport.scrollAndZoomIntoView([await figma.getNodeByIdAsync(roots[0].heroId)]);
print('V2_ROOTS:'+JSON.stringify(roots));
