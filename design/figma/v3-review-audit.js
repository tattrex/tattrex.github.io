await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:3'));const page=figma.currentPage;
// Make chapter controls generous enough for touch in layouts and presentation copies.
for(const root of page.children.filter(n=>n.name.startsWith('Concept 03'))){
 const heroes=root.name.includes('/ Story / 01')?[root]:root.findAll(n=>n.name==='01 / See / The living atlas');
 for(const h of heroes){const rail=h.findOne(n=>n.name==='Chapter index / See Work Discover');if(!rail)continue;rail.y=h.height-88;const entries=rail.findOne(n=>n.name==='Chapter index / Entries');for(const c of entries.children){c.resize(c.width,44);c.layoutSizingVertical='FIXED';c.counterAxisAlignItems='CENTER';}}
}
const board=f('Concept 03 / Review / The living imaging atlas',null,1440,32,48,'Surface/Primary');board.x=20200;board.y=1400;
await t(board,'Heading','The living imaging atlas','Heading / Heading 2','Text/Primary',1280);
await t(board,'Direction','Concept 03 uses a sculptural opening, a layered voice workspace and an expansive research atlas. The platform and Labs remain equally prominent. The logo has no centre dot.','Body / Body 7','Text/Secondary',1000);
const links=f('Review / Prototype links',board,1344,12,0,null,false,'HORIZONTAL');const button=await figma.getNodeByIdAsync('6:204');
for(const [label,id] of [['Chapter storyboard','27:9604'],['Desktop page','27:8598'],['Mobile page','27:9027'],['Word reveal','27:9941']]){const n=button.createInstance();links.appendChild(n);n.name='Review / '+label;n.layoutPositioning='AUTO';n.setProperties({'Label#6:26':label});n.reactions=[{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:id,navigation:'NAVIGATE',transition:null}]}];}
const hero=await figma.getNodeByIdAsync('27:6361');const hash=figma.createImage(await hero.exportAsync({format:'PNG',constraint:{type:'WIDTH',value:1344}})).hash;const poster=imageBox(board,'Review / Opening preview',1344,933.33);poster.fills=[{type:'IMAGE',imageHash:hash,scaleMode:'FILL'}];
await t(board,'Reference heading','What the references contributed','Heading / Heading 4','Text/Primary',1000);
for(const [name,url,copy] of [
 ['Lando Norris','https://landonorris.com/','Monumental scale, an object that owns the frame, and changing compositions as the story unfolds.'],
 ['FMI Industries','https://www.fmi-industries.com/','Full scene storytelling and deliberate contrast between immersive imagery and quieter editorial sections.'],
 ['LinusBio','https://www.linusbio.com/','A clear scientific proposition and a focused research index beside a strong visual.'],
 ['A. P. J. Abdul Kalam','https://param.design/abdulkalam/','A persistent chapter structure and a subject that changes role as the narrative advances.'],
 ['Tour Kyrgyzstan','https://tour-kyrgyzstan.com/','Cinematic framing, precise edge marks, small captions and asymmetrical hierarchy.'],
 ['Aquirin','https://aquirin.com/SR','A tactile instrument as the interaction metaphor for the voice workspace.'],
 ['Ezera','https://ezeratech.ae/','Restrained warm neutrals and typography. The site rendered a text fallback during review; its motion was not evaluated.']
]){line(board,1344);const row=f('Reference / '+name,board,1344,32,0,null,false,'HORIZONTAL');const title=await t(row,'Source',name,'Title / Title 2','Text/Accent',256);title.hyperlink={type:'URL',value:url};await t(row,'Application',copy,'Body / Body 3','Text/Secondary',1056);}
await t(board,'Motion heading','Movement to review','Heading / Heading 4','Text/Primary',1000);
await t(board,'Motion explanation','The chapter storyboard previews See → Work → Discover with linked scenes. The voice instrument advances through navigation, comparison and reporting; click the final state to replay. A separate word reveal shows the statement timing.','Body / Body 3','Text/Secondary',1000);
await t(board,'Implementation boundary','This is a Figma design review, not the website implementation. Chapter clicks stand in for the proposed scroll progression. Scroll coupled 3D movement, asset loading and reduced motion behaviour will be implemented after the visual direction is agreed.','Body / Body 3','Text/Secondary',1000);
await t(board,'Scope note','Generated anatomy is artistic. Interface scenes are design concepts informed by the demo, not clinical outputs. Contact forms are previews and send no data. No performance, clearance or customer claims have been added.','Caption / Caption 2','Text/Secondary',1000);
const roots=[];
for(const id of ['27:6128','27:6445','27:6679']){
 const root=await figma.getNodeByIdAsync(id),nodes=root.findAll(),overflow=[],unboundSpacing=[];
 for(const n of nodes.filter(n=>'layoutMode'in n&&n.layoutMode!=='NONE'&&'children'in n)){
  if(!n.clipsContent)for(const c of n.children)if(c.visible&&c.layoutPositioning!=='ABSOLUTE'&&c.x+c.width>n.width+.5)overflow.push({parent:n.name,child:c.name,right:c.x+c.width,width:n.width});
  for(const field of ['itemSpacing','paddingTop','paddingRight','paddingBottom','paddingLeft'])if(!n.boundVariables?.[field])unboundSpacing.push({name:n.name,field});
 }
 roots.push({id,name:root.name,width:root.width,height:root.height,sections:root.children.map(n=>({id:n.id,name:n.name,height:n.height})),unstyledText:nodes.filter(n=>n.type==='TEXT'&&!n.textStyleId).map(n=>n.name),horizontalOverflow:overflow,unboundSpacing,voiceCommand:root.findOne(n=>n.name==='Voice instrument / Interactive workflow').findOne(n=>n.name==='Instrument / Command').characters});
}
const logoAudit=[];for(const id of ['6:150','6:167']){const n=await figma.getNodeByIdAsync(id);logoAudit.push({id,centreDots:n.findAll(n=>n.name==='Brand / Focus point').length});}
const scenes=[];for(const id of ['27:9604','27:9665','27:9785']){const n=await figma.getNodeByIdAsync(id);scenes.push({id,clickTargets:n.findAll(n=>'reactions'in n&&n.reactions.some(r=>r.trigger?.type==='ON_CLICK')).length});}
figma.currentPage.selection=[await figma.getNodeByIdAsync('27:6128')];figma.viewport.scrollAndZoomIntoView([await figma.getNodeByIdAsync('27:6361')]);
print('V3_AUDIT:'+JSON.stringify({roots,logoAudit,scenes,reviewFrame:board.id,voiceSet:'27:7949'}));
