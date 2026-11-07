await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:3'));
const page=figma.currentPage;
const notes=f('Concept 02 / Review / Imaging observatory',null,1280,32,48,'Surface/Primary');notes.x=10500;notes.y=6200;
await t(notes,'Heading','Concept 02 · Imaging observatory','Heading / Heading 2','Text/Primary',1184);
await t(notes,'Changes','A more cinematic visual identity, with the centre dot removed from the shared logo. The page combines a scan sculpture, a detailed voice workspace, a spatial research atlas and a monumental wordmark.','Body / Body 7','Text/Secondary',900);
const movie=imageBox(notes,'Hero film / Poster',1184,666);movie.fills=[{type:'IMAGE',imageHash:'97b8be18c7a649cae398db3a78fa97279ffd3749',scaleMode:'FILL'}];
const viewFilm=await t(notes,'Hero film / Link','Watch the six second hero film ↗','Title / Title 1','Text/Accent',900);viewFilm.hyperlink={type:'URL',value:'https://d8j0ntlcm91z4.cloudfront.net/user_3LIeevDBNaqTkqlQfQJAnXBXVQG/hf_20261107_094536_56dd5b43-54ad-4274-9a85-5fbf6c6a6324.mp4'};
await t(notes,'Film note','The film is linked separately because this Starter file cannot upload video. The main designs retain the still poster. Generated anatomy is artistic, not a clinical output.','Body / Body 3','Text/Secondary',900);
await t(notes,'Motion heading','Movement with a purpose','Heading / Heading 4');
await t(notes,'Motion notes','Hero: subtle camera parallax and a travelling scan plane. Workspace: listening, comparison and reporting states. Statement: one word at a time as it enters view. Reduced motion uses the final static composition.','Body / Body 3','Text/Secondary',900);
await t(notes,'Scope','Desktop, tablet and mobile remain editable Figma layers with existing tokens, styles and components. Equal entry points for the platform and Labs are retained. Contact forms are design previews and do not send data.','Body / Body 3','Text/Secondary',900);
const roots=[];
for(const id of ['27:3665','27:3881','27:4083']){
 const root=await figma.getNodeByIdAsync(id),nodes=root.findAll(),overflow=[];
 for(const n of nodes.filter(n=>n.type==='FRAME'&&n.layoutMode!=='NONE'&&!n.clipsContent))for(const c of n.children)if(c.visible&&c.layoutPositioning!=='ABSOLUTE'&&c.x+c.width>n.width+.5)overflow.push({parent:n.name,child:c.name,right:c.x+c.width,width:n.width});
 roots.push({id,name:root.name,width:root.width,height:root.height,sections:root.children.length,unstyledText:nodes.filter(n=>n.type==='TEXT'&&n.visible&&!n.textStyleId).map(n=>n.name),horizontalOverflow:overflow});
}
const logos=[];for(const id of ['6:150','6:167']){const n=await figma.getNodeByIdAsync(id);logos.push({id,name:n.name,centreDotCount:n.findAll(n=>n.name==='Brand / Focus point').length});}
const flows=[];for(const id of ['27:5296','27:5670']){const n=await figma.getNodeByIdAsync(id);flows.push({id,name:n.name,clickTargets:n.findAll(n=>'reactions'in n&&n.reactions.some(r=>r.trigger?.type==='ON_CLICK')).length});}
figma.currentPage.selection=[await figma.getNodeByIdAsync('27:3665')];figma.viewport.scrollAndZoomIntoView([await figma.getNodeByIdAsync('27:3821')]);
print('V2_AUDIT:'+JSON.stringify({roots,logos,flows,reviewFrame:notes.id}));
