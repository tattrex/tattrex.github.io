const createdNodeIds=[]; const mutatedNodeIds=[];
const track=n=>{createdNodeIds.push(n.id);return n;};
await Promise.all(['Regular','Medium','SemiBold','Bold'].map(style=>figma.loadFontAsync({family:'Manrope',style})));
const allVars=await figma.variables.getLocalVariablesAsync();
const V={},D={};
for(const v of allVars){if(v.variableCollectionId==='VariableCollectionId:5:8')D[v.name]=v;else V[v.name]=v;}
const TS=Object.fromEntries((await figma.getLocalTextStylesAsync()).map(s=>[s.name,s]));
const sp={0:0,2:25,4:50,8:75,12:100,16:200,24:300,32:400,40:500,48:600,64:700,80:800,96:900};
function paint(name,dark=false){return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',(dark?D:V)[name]);}
function radius(n,value=0){for(const c of ['topLeft','topRight','bottomLeft','bottomRight'])n.setBoundVariable(c+'Radius',V['radius/'+value]);}
function spacing(n,gap=0,pad=0){n.setBoundVariable('itemSpacing',V['spacing/'+sp[gap]]);for(const side of ['Top','Right','Bottom','Left'])n.setBoundVariable('padding'+side,V['spacing/'+sp[pad]]);radius(n);}
function padding(n,top,right=top,bottom=top,left=right){for(const [s,v] of [['Top',top],['Right',right],['Bottom',bottom],['Left',left]])n.setBoundVariable('padding'+s,V['spacing/'+sp[v]]);}
function f(name,parent,width=undefined,gap=24,pad=0,fill=null,dark=false,dir='VERTICAL'){
 const n=track(figma.createAutoLayout(dir));n.name=name;n.fills=fill?[paint(fill,dark)]:[];spacing(n,gap,pad);
 if(parent)parent.appendChild(n);
 if(width!==undefined){n.resize(width,100);n.layoutSizingHorizontal='FIXED';}else n.layoutSizingHorizontal='HUG';
 n.layoutSizingVertical='HUG';return n;
}
async function t(parent,name,copy,style='Body / Body 3',color='Text/Primary',width=undefined,dark=false){
 const n=track(figma.createText());n.name=name;n.fontName=TS[style].fontName;n.characters=copy;await n.setTextStyleIdAsync(TS[style].id);n.fills=[paint(color,dark)];parent.appendChild(n);
 if(width!==undefined){n.textAutoResize='HEIGHT';n.resize(width,Math.max(n.height,1));n.layoutSizingHorizontal='FIXED';}return n;
}
function rect(parent,name,w,h,color,dark=false,r=0){const n=track(figma.createRectangle());n.name=name;n.resize(w,h);n.fills=[paint(color,dark)];radius(n,r);parent.appendChild(n);return n;}
function line(parent,w,dark=false){return rect(parent,'Divider',w,1,'Border/Primary',dark);}
function imageBox(parent,name,w,h){const n=track(figma.createRectangle());n.name=name;n.resize(w,h);n.fills=[];radius(n);parent.appendChild(n);return n;}
function svg(parent,name,source,w,h,color='Icon/Default',dark=false){
 const n=track(figma.createNodeFromSvg(source));n.name=name;n.rescale(w/n.width);parent.appendChild(n);
 const geo=n.children.map(c=>({n:c,x:c.x,y:c.y}));n.layoutMode='HORIZONTAL';spacing(n);for(const g of geo){g.n.layoutPositioning='ABSOLUTE';g.n.x=g.x;g.n.y=g.y;}n.resize(w,h);
 for(const c of n.findAll()){createdNodeIds.push(c.id);c.name=name+' / Path';if('fills' in c&&Array.isArray(c.fills))c.fills=c.fills.map(p=>p.type==='SOLID'?paint(color,dark):p);if('strokes' in c&&Array.isArray(c.strokes))c.strokes=c.strokes.map(p=>p.type==='SOLID'?paint(color,dark):p);}return n;
}
const easing={type:'CUSTOM_CUBIC_BEZIER',easingFunctionCubicBezier:{x1:0.22,y1:1,x2:0.36,y2:1}};
const trans={type:'SMART_ANIMATE',easing,duration:0.3};
