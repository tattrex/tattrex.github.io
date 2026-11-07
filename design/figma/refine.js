await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('5:3'));
const rawWord='<svg xmlns="http://www.w3.org/2000/svg" width="115" height="29" viewBox="-5 -40 575 145"><g fill="none" stroke="#16171c" stroke-width="10"><path d="M22 -35V100M0 5H48"/><circle cx="112" cy="50" r="45"/><path d="M157 0V100"/><path d="M198 -35V100M176 5H224"/><path d="M254 -35V100M232 5H280"/><path d="M303 0V100M303 50A45 45 0 0 1 348 5H355"/><path d="M378 50H468A45 45 0 1 0 457.5 78.9"/></g><path fill="#16171c" d="M489 0H501.6L565 100H552.4ZM552.4 0H565L501.6 100H489Z"/></svg>';
const rawMark='<svg xmlns="http://www.w3.org/2000/svg" width="41.2" height="30" viewBox="0 -25 206 150"><path d="M5 -25V125M201 -25V125" fill="none" stroke="#16171c" stroke-width="10"/><circle cx="103" cy="50" r="70" fill="none" stroke="#16171c" stroke-width="10"/></svg>';
for(const [id,dark] of [['6:150',false],['6:167',true]]){
 const logo=await figma.getNodeByIdAsync(id);for(const c of [...logo.children])c.remove();
 const mark=f('Brand / Scan focus',logo,41.2,0);mark.resize(41.2,30);mark.layoutSizingVertical='FIXED';
 const outline=figma.createNodeFromSvg(rawMark);mark.appendChild(outline);outline.layoutPositioning='ABSOLUTE';outline.x=0;outline.y=0;outline.name='Brand / Scan focus artwork';
 for(const n of outline.findAll()){n.name='Brand / Scan focus path';if('fills' in n&&Array.isArray(n.fills))n.fills=n.fills.map(p=>p.type==='SOLID'?paint('Icon/Default',dark):p);if('strokes' in n&&Array.isArray(n.strokes))n.strokes=n.strokes.map(p=>p.type==='SOLID'?paint('Icon/Default',dark):p);}
 const dot=figma.createEllipse();mark.appendChild(dot);dot.name='Brand / Focus point';dot.layoutPositioning='ABSOLUTE';dot.resize(9.6,9.6);dot.x=15.8;dot.y=10.2;dot.fills=[paint('Icon/Accent',dark)];
 const word=figma.createNodeFromSvg(rawWord);logo.appendChild(word);word.name='Brand / Drawn wordmark artwork';
 for(const n of word.findAll()){n.name='Brand / Letter path';if('fills' in n&&Array.isArray(n.fills))n.fills=n.fills.map(p=>p.type==='SOLID'?paint('Icon/Default',dark):p);if('strokes' in n&&Array.isArray(n.strokes))n.strokes=n.strokes.map(p=>p.type==='SOLID'?paint('Icon/Default',dark):p);}
}
const stray=await figma.getNodeByIdAsync('15:857');if(stray)stray.remove();
const output=[];
for(const [id,w] of [['7:2',1440],['7:45',768],['7:88',390]]){
 const root=await figma.getNodeByIdAsync(id),small=w===390;
 const tag=root.findOne(n=>n.name==='Tagline');
 tag.characters=small?'You bring the\nclinical insight.\nWe build what\ncomes next.':'You bring the\nclinical insight.\nWe build what\ncomes next.';
 const image=root.findOne(n=>n.name==='Cinematic volume study');
 if(image){image.fills=[{type:'IMAGE',imageHash:'1d52f8edbb34c02422ed99555f014c3340926a4e',scaleMode:'CROP',imageTransform:[[0.45,0,0.46],[0,0.60,0.10]]}];}
 const faqs=root.findAll(n=>n.type==='INSTANCE'&&n.name.startsWith('FAQ / '));
 for(const item of faqs){for(const n of item.findAll(n=>n.type==='FRAME')){if(n.name==='Question row'){n.layoutSizingHorizontal='FILL';n.resize(item.width-48,n.height);}}
  for(const n of item.findAll(n=>n.type==='TEXT')){if(n.name==='Question'){n.resize(item.width-96,n.height);n.textAutoResize='HEIGHT';}}
 }
 output.push({id,w,height:root.height,faqStructure:faqs[0]?.children.map(n=>({name:n.name,w:n.width,children:n.children?.map(c=>({name:c.name,w:c.width}))}))});
}
print('TATTREX_REFINED:'+JSON.stringify(output));
