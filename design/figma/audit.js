await figma.loadAllPagesAsync();
const variables=await figma.variables.getLocalVariablesAsync();
const styles=await figma.getLocalTextStylesAsync();
const collections=await figma.variables.getLocalVariableCollectionsAsync();
const screens=await figma.getNodeByIdAsync('5:3');
const audit=[];
for(const id of ['7:2','7:45','7:88']){
 const root=await figma.getNodeByIdAsync(id);const nodes=root.findAll();
 const visibleText=nodes.filter(n=>n.type==='TEXT'&&n.visible);
 const unstylised=visibleText.filter(n=>!n.textStyleId).map(n=>({id:n.id,name:n.name}));
 const overflows=[];
 for(const n of nodes.filter(n=>n.type==='FRAME'&&n.layoutMode!=='NONE'&&!n.clipsContent)){
  for(const c of n.children)if(c.visible&&c.layoutPositioning!=='ABSOLUTE'&&c.x+c.width>n.width+.5)overflows.push({parent:n.name,child:c.name,right:c.x+c.width,width:n.width});
 }
 audit.push({id,name:root.name,width:root.width,height:root.height,sectionCount:root.children.length,unstyledText:unstylised,horizontalOverflow:overflows,faqWidths:root.findAll(n=>n.type==='INSTANCE'&&n.name.startsWith('FAQ /')).map(n=>({width:n.width,questionWidth:n.findOne(x=>x.name==='Question').width}))});
}
const components=await figma.getNodeByIdAsync('5:2');
print('TATTREX_AUDIT:'+JSON.stringify({collections:collections.map(c=>({name:c.name,modes:c.modes.map(m=>m.name),variables:c.variableIds.length})),variables:variables.length,textStyles:styles.length,audit,components:components.findAll(n=>n.type==='COMPONENT_SET').map(n=>({name:n.name,count:n.children.length})),screens:screens.children.map(n=>({id:n.id,name:n.name,width:n.width,height:n.height}))}));
