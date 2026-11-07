const arrowSource='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"/></svg>';
const buttons=await figma.getNodeByIdAsync('6:284');
for(const c of buttons.children){
 const old=c.children.find(n=>n.name==='Arrow up right / Phosphor');if(old)old.remove();
 const icon=figma.createNodeFromSvg(arrowSource);c.appendChild(icon);icon.name='Arrow up right / Phosphor';
 for(const n of icon.findAll()){n.name='Arrow / Path';if('fills' in n&&Array.isArray(n.fills))n.fills=n.fills.map(p=>p.type==='SOLID'?paint(c.name.includes('Secondary')||c.name.includes('Tertiary')?'Icon/Default':'Text/OnAction'):p);}
}
for(const id of ['7:88','15:3076']){
 const root=await figma.getNodeByIdAsync(id);const art=root.findOne(n=>n.name==='Hero / Cinematic volume artwork');art.resize(560,320);art.x=-150;art.y=580;
 const desc=root.findOne(n=>n.name==='Hero / Description');desc.characters='A voice and AI native platform\nfor your daily practice.\nA research partner for what comes next.';
}
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:3'));
figma.currentPage.selection=[await figma.getNodeByIdAsync('7:2')];
figma.viewport.scrollAndZoomIntoView([await figma.getNodeByIdAsync('7:3')]);
print('Polish complete');
