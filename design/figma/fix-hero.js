await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:3'));
for(const id of ['7:34','7:38','7:77','7:81','7:114','7:118']){const n=await figma.getNodeByIdAsync(id);n.layoutPositioning='AUTO';mutatedNodeIds.push(id);}
const mobileArt=await figma.getNodeByIdAsync('7:90');mobileArt.resize(620,354);mobileArt.x=-190;mobileArt.y=546;mutatedNodeIds.push(mobileArt.id);
const mobileInner=await figma.getNodeByIdAsync('7:91');const caption=mobileInner.children.find(n=>n.name==='Hero / Caption');padding(caption,64,0,0,0);mutatedNodeIds.push(caption.id);
const tabletArt=await figma.getNodeByIdAsync('7:47');tabletArt.resize(1280,731);tabletArt.x=-320;tabletArt.y=169;mutatedNodeIds.push(tabletArt.id);
return {mutatedNodeIds};
