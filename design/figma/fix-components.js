await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:2'));
const markOutline='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -25 206 150"><path d="M5 -25V125M201 -25V125" fill="none" stroke="#16171c" stroke-width="10"/><circle cx="103" cy="50" r="70" fill="none" stroke="#16171c" stroke-width="10"/></svg>';
const wordSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -40 575 145"><g fill="none" stroke="#16171c" stroke-width="10"><path d="M22 -35V100M0 5H48"/><circle cx="112" cy="50" r="45"/><path d="M157 0V100"/><path d="M198 -35V100M176 5H224"/><path d="M254 -35V100M232 5H280"/><path d="M303 0V100M303 50A45 45 0 0 1 348 5H355"/><path d="M378 50H468A45 45 0 1 0 457.5 78.9"/></g><path fill="#16171c" d="M489 0H501.6L565 100H552.4ZM552.4 0H565L501.6 100H489Z"/></svg>';
const arrow='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"/></svg>';
for(const [id,dark] of [['6:150',false],['6:167',true]]){
 const logo=await figma.getNodeByIdAsync(id);for(const n of [...logo.children])n.remove();
 const mark=f('Brand / Scan focus',logo,41.2,0);mark.resize(41.2,30);mark.layoutSizingVertical='FIXED';
 const outer=svg(mark,'Brand / Mark outline',markOutline,41.2,30,'Icon/Default',dark);outer.layoutPositioning='ABSOLUTE';outer.x=0;outer.y=0;
 const dot=track(figma.createEllipse());dot.name='Brand / Focus point';mark.appendChild(dot);dot.layoutPositioning='ABSOLUTE';dot.resize(9.6,9.6);dot.x=15.8;dot.y=10.2;dot.fills=[paint('Icon/Accent',dark)];
 svg(logo,'Brand / Drawn wordmark',wordSvg,115,29,'Icon/Default',dark);mutatedNodeIds.push(id);
}
const set=await figma.getNodeByIdAsync('6:284');
for(const c of set.children){const n=c.children.find(x=>x.name==='Arrow up right / Phosphor');if(n)n.remove();svg(c,'Arrow up right / Phosphor',arrow,20,20,c.name.includes('Secondary')||c.name.includes('Tertiary')?'Icon/Default':'Text/OnAction');mutatedNodeIds.push(c.id);}
return {createdNodeIds,mutatedNodeIds};
