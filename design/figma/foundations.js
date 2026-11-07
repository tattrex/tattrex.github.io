// Design automation only. No website implementation.
const createdNodeIds = [];
const createdVariableIds = [];
const track = n => { createdNodeIds.push(n.id); return n; };
const page = figma.currentPage;
page.name = 'Foundations';
const components = track(figma.createPage()); components.name = 'Components';
const screens = track(figma.createPage()); screens.name = 'Screens';
await Promise.all(['Regular','Medium','SemiBold','Bold'].map(style => figma.loadFontAsync({family:'Manrope',style})));
const rgba = hex => ({r:parseInt(hex.slice(1,3),16)/255,g:parseInt(hex.slice(3,5),16)/255,b:parseInt(hex.slice(5,7),16)/255,a:1});
const collections = {};
for(const name of ['spacing','radius','Core Colors','Color System','Color System Dark']) {
  const c=figma.variables.createVariableCollection(name); collections[name]=c;
  c.renameMode(c.modes[0].modeId,name==='Color System'?'Light':name==='Color System Dark'?'Dark':'Value');
}
const semantic=collections['Color System'];
const light=semantic.modes[0].modeId;
const dark=collections['Color System Dark'].modes[0].modeId;
const vars={};
function variable(name,c,type,value,scopes){
  const v=figma.variables.createVariable(name,collections[c],type); v.scopes=scopes;
  v.setValueForMode(collections[c].modes[0].modeId,value);
  v.setVariableCodeSyntax('WEB','var(--'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+')');
  vars[name]=v; createdVariableIds.push(v.id); return v;
}
const spacePairs=[[0,0],[25,2],[50,4],[75,8],[100,12],[200,16],[300,24],[400,32],[500,40],[600,48],[700,64],[800,80],[900,96]];
for(const [key,val] of spacePairs) variable('spacing/'+key,'spacing','FLOAT',val,['GAP']);
for(const val of [0,2,4,6,8,12,16,24,9999]) variable('radius/'+(val===9999?'full':val),'radius','FLOAT',val,['CORNER_RADIUS']);
const shades=['00','50','100','150','200','250','300','350','400','450','500','600','700','750','800','850','870','900','950','1000'];
const bases={Primary:'#c8452f',Secondary:'#917463',Accent:'#c8452f',Grayscale:'#777771',Red:'#bd403a',Green:'#438467',Yellow:'#b18937'};
const gray={'00':'#ffffff','50':'#f6f5f1','100':'#eeeae4','150':'#e3dfd9','200':'#d7d2cc','250':'#c7c2bb','300':'#b9b4ac','350':'#aaa59e','400':'#9b9b9b','450':'#8b8882','500':'#777771','600':'#666666','700':'#4c4a45','750':'#313131','800':'#272727','850':'#1f1f1f','870':'#181818','900':'#131209','950':'#0c0c0c','1000':'#000000'};
for(const [name,hex] of Object.entries(bases)) {
  const base=rgba(hex);
  for(const key of shades) {
    const v=Number(key); const t=v<=500?v/500:(1000-v)/500;
    const target=v<=500?1:0;
    let color={r:target+(base.r-target)*t,g:target+(base.g-target)*t,b:target+(base.b-target)*t,a:1};
    if(name==='Grayscale') color=rgba(gray[key]);
    variable(name+'/'+key,'Core Colors','COLOR',color,[]);
  }
}
for(const a of [16,24,40,64,80]) variable('Grayscale-Alpha/700-'+a,'Core Colors','COLOR',{...rgba(gray['700']),a:a/100},[]);
const roles={
  'Surface/Primary':['Grayscale/50','Grayscale/870'],
  'Surface/Primary-Hover':['Grayscale/100','Grayscale/800'],
  'Surface/Primary-Selected':['Grayscale/150','Grayscale/700'],
  'Surface/Primary-subtle':['Grayscale/00','Grayscale/850'],
  'Surface/Secondary':['Grayscale/100','Grayscale/800'],
  'Surface/Secondary-Hover':['Grayscale/150','Grayscale/700'],
  'Surface/Secondary-Selected':['Grayscale/200','Grayscale/700'],
  'Surface/Secondary-Subtle':['Grayscale/00','Grayscale/750'],
  'Surface/Tertiary':['Grayscale/150','Grayscale/600'],
  'Surface/Tertiary-Hover':['Grayscale/200','Grayscale/450'],
  'Surface/Accent':['Accent/500','Accent/500'],
  'Surface/Accent-subtle':['Accent/50','Accent/200'],
  'Surface/Info':['Primary/400','Primary/400'],
  'Surface/Info-subtle':['Primary/50','Primary/150'],
  'Surface/Error':['Red/500','Red/500'],
  'Surface/Error-subtle':['Red/50','Red/100'],
  'Surface/Error - Darker':['Red/700','Red/700'],
  'Surface/Inverted':['Grayscale/870','Grayscale/00'],
  'Surface/Inverted-Hover':['Grayscale/800','Grayscale/250'],
  'Surface/Inverted-Disabled':['Grayscale/600','Grayscale/450'],
  'Surface/Warning':['Yellow/500','Yellow/500'],
  'Surface/Warning-subtle':['Yellow/50','Yellow/100'],
  'Surface/Warning - Hover':['Yellow/600','Yellow/700'],
  'Surface/Canvas':['Grayscale/50','Grayscale/1000'],
  'Surface/Transparent':['Grayscale-Alpha/700-16','Grayscale-Alpha/700-16'],
  'Text/Primary':['Grayscale/870','Grayscale/50'],
  'Text/Primary-Disabled':['Grayscale/400','Grayscale/750'],
  'Text/Primary-Subtle':['Grayscale/600','Grayscale/500'],
  'Text/Secondary':['Grayscale/600','Grayscale/200'],
  'Text/Secondary-Disabled':['Grayscale/450','Grayscale/500'],
  'Text/Tertiary':['Grayscale/600','Grayscale/400'],
  'Text/Inverted':['Grayscale/50','Grayscale/850'],
  'Text/OnAction':['Grayscale/00','Grayscale/00'],
  'Text/Accent':['Primary/600','Primary/300'],
  'Text/Hero-start':['Grayscale/1000','Grayscale/00'],
  'Text/Hero-end':['Grayscale/600','Grayscale/400'],
  'Icon/Default':['Grayscale/870','Grayscale/50'],
  'Icon/Secondary':['Grayscale/600','Grayscale/200'],
  'Icon/Subtle':['Grayscale/600','Grayscale/500'],
  'Icon/Inverted':['Grayscale/50','Grayscale/850'],
  'Icon/Disabled':['Grayscale/400','Grayscale/750'],
  'Icon/Accent':['Primary/500','Primary/400'],
  'Border/Primary':['Grayscale/200','Grayscale/750'],
  'Border/Primary-Disabled':['Grayscale/150','Grayscale/800'],
  'Border/Primary-light':['Grayscale/150','Grayscale/700'],
  'Border/Secondary':['Grayscale/200','Grayscale/750'],
  'Border/Tertiary':['Grayscale/400','Grayscale/600'],
  'Border/Action-Primary':['Primary/500','Primary/400'],
  'Border/Action-Disabled':['Primary/200','Primary/600'],
  'Border/Action-Secondary':['Grayscale/500','Grayscale/500'],
  'Border/Focus':['Primary/600','Primary/300']
};
for(const [group,palette] of [['Error','Red'],['Success','Green'],['Info','Primary'],['Warning','Yellow']]) {
  for(const category of ['Text','Icon']) {
    roles[category+'/'+group]=[palette+'/700',palette+'/300'];
    roles[category+'/'+group+'-Disabled']=[palette+'/200',palette+'/800'];
    roles[category+'/'+group+'-Inverted']=[palette+'/800',palette+'/700'];
    roles[category+'/'+group+'-Inverted-Disabled']=[palette+'/300',palette+'/300'];
  }
  roles['Border/'+group]=[palette+'/500',palette+'/400'];
  roles['Border/'+group+'-disabled']=[palette+'/200',palette+'/700'];
}
for(const [type,palette] of [['Primary','Primary'],['Secondary','Grayscale'],['Tertiary','Grayscale'],['Error','Red'],['Warning','Yellow']]) {
  const neutral=palette==='Grayscale';
  roles['Action/'+type]=neutral?['Grayscale/00','Grayscale/850']:[palette+'/500',palette+'/500'];
  roles['Action/'+type+'-Hover']=neutral?['Grayscale/100','Grayscale/800']:[palette+'/600',palette+'/600'];
  roles['Action/'+type+'-Click']=neutral?['Grayscale/150','Grayscale/750']:[palette+'/700',palette+'/700'];
  roles['Action/'+type+'-Disabled']=neutral?['Grayscale/100','Grayscale/800']:[palette+'/150',palette+'/850'];
}
for(const [suffix,a] of [['xs',16],['sm',24],['md',40],['lg',64],['xlg',80]]) roles['Overlay/'+suffix]=['Grayscale-Alpha/700-'+a,'Grayscale-Alpha/700-'+a];
for(const [name,aliases] of Object.entries(roles)) {
  const prefix=name.split('/')[0];
  const scopes=prefix==='Text'?['TEXT_FILL']:prefix==='Border'?['STROKE_COLOR','SHAPE_FILL']:prefix==='Icon'?['SHAPE_FILL','STROKE_COLOR']:['FRAME_FILL','SHAPE_FILL'];
  const v=variable(name,'Color System','COLOR',{type:'VARIABLE_ALIAS',id:vars[aliases[0]].id},scopes);
  const d=figma.variables.createVariable(name,collections['Color System Dark'],'COLOR');d.scopes=scopes;
  d.setValueForMode(dark,{type:'VARIABLE_ALIAS',id:vars[aliases[1]].id});d.setVariableCodeSyntax('WEB','var(--'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+')');vars['dark/'+name]=d;createdVariableIds.push(d.id);
}
const styleDefs=[];
[[60,60],[48,48],[36,40],[30,36],[24,32],[20,28]].forEach(([s,l],i)=>styleDefs.push(['Heading / Heading '+(i+1),s,l,'Regular']));
[[20,28],[18,28],[16,24],[14,20],[12,16]].forEach(([s,l],i)=>styleDefs.push(['Title / Title '+(i+1),s,l,'Medium']));
[['SemiBold',16,24],['Medium',16,24],['Regular',16,24],['SemiBold',14,20],['Medium',14,20],['Regular',14,20]].forEach(([w,s,l],i)=>styleDefs.push(['Body / Body '+(i+1),s,l,w]));
[['lg',18,28],['md',16,24],['sm',14,20],['Xsm',12,16]].forEach(([n,s,l])=>styleDefs.push(['Button / Button-'+n,s,l,'SemiBold']));
[['Medium',14,20],['Regular',14,20],['SemiBold',12,16],['Medium',12,16],['Regular',12,16]].forEach(([w,s,l],i)=>styleDefs.push(['Caption / Caption '+(i+1),s,l,w]));
styleDefs.push(['Heading / Heading 7',96,96,'Regular'],['Body / Body 7',18,28,'Regular']);
const styles={};
for(const [name,size,line,weight] of styleDefs){ const s=figma.createTextStyle(); s.name=name;s.fontName={family:'Manrope',style:weight};s.fontSize=size;s.lineHeight={unit:'PIXELS',value:line};s.letterSpacing={unit:'PIXELS',value:0}; styles[name]=s; }
const spacingByValue=Object.fromEntries(spacePairs.map(([k,v])=>[v,vars['spacing/'+k]]));
let activeDark=false;
function paint(name){return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',vars[(activeDark&&vars['dark/'+name]?'dark/':'')+name]);}
function frame(name,dir='VERTICAL',gap=24,pad=0){ const n=track(figma.createAutoLayout(dir)); n.name=name;n.fills=[];n.setBoundVariable('itemSpacing',spacingByValue[gap]); for(const side of ['Top','Right','Bottom','Left'])n.setBoundVariable('padding'+side,spacingByValue[pad]);for(const corner of ['topLeft','topRight','bottomLeft','bottomRight'])n.setBoundVariable(corner+'Radius',vars['radius/0']);return n;}
async function text(parent,name,copy,style='Body / Body 3',color='Text/Primary',width){const n=track(figma.createText()); n.name=name;n.fontName={family:'Manrope',style:styles[style].fontName.style};n.characters=copy; await n.setTextStyleIdAsync(styles[style].id);n.fills=[paint(color)];parent.appendChild(n);if(width){n.textAutoResize='HEIGHT';n.resize(width,n.height);}return n;}
const root=frame('Foundations','VERTICAL',48,64);root.x=160;root.y=160;root.resize(1440,100);root.layoutSizingVertical='HUG';root.fills=[paint('Surface/Primary')];
await text(root,'Foundations / Title','The Tattrex visual system','Heading / Heading 2');
await text(root,'Foundations / Introduction','Concept 01 · Reading room + research atlas\nManrope · Vermilion · Warm paper · Charcoal\nThe logo geometry and brand palette come from tattrex-logo.','Body / Body 7');
const coreSection=frame('Core Colors','VERTICAL',24);root.appendChild(coreSection);
await text(coreSection,'Core Colors / Title','Core Colors','Heading / Heading 4');
for(const name of Object.keys(bases)){
  const line=frame('Palette / '+name,'VERTICAL',8);coreSection.appendChild(line);await text(line,'Palette / '+name+' / Label',name,'Title / Title 3');
  const row=frame('Palette / '+name+' / Swatches','HORIZONTAL',8);line.appendChild(row);
  for(const shade of shades){const tile=frame('Swatch / '+name+'/'+shade,'VERTICAL',8);row.appendChild(tile);const sq=track(figma.createRectangle());sq.name=name+'/'+shade;sq.resize(52,40);sq.fills=[paint(name+'/'+shade)];sq.setBoundVariable('topLeftRadius',vars['radius/2']);sq.setBoundVariable('topRightRadius',vars['radius/2']);sq.setBoundVariable('bottomLeftRadius',vars['radius/2']);sq.setBoundVariable('bottomRightRadius',vars['radius/2']);tile.appendChild(sq);await text(tile,'Shade / '+shade,shade,'Caption / Caption 5');}
}
const systemSection=frame('Color System','VERTICAL',24);root.appendChild(systemSection);await text(systemSection,'Color System / Title','Color System · Light and Dark','Heading / Heading 4');
const cols=frame('Color System / Modes','HORIZONTAL',32);systemSection.appendChild(cols);
for(const [mode,mid] of [['Light',light],['Dark',dark]]){
  activeDark=mode==='Dark';
  const col=frame('Color System / '+mode,'VERTICAL',12,24);cols.appendChild(col);col.resize(608,100);col.layoutSizingVertical='HUG';col.fills=[paint('Surface/Primary')];await text(col,'Mode / '+mode,mode,'Title / Title 1');
  for(const [name,aliases] of Object.entries(roles)){
    const row=frame('Token / '+name,'HORIZONTAL',12);col.appendChild(row);row.counterAxisAlignItems='CENTER';
    const sw=track(figma.createRectangle());sw.name='Sample / '+name;sw.resize(24,24);sw.fills=[paint(name)];row.appendChild(sw);
    await text(row,'Label / '+name,name+' → '+aliases[mode==='Light'?0:1],'Caption / Caption 5','Text/Primary',510);
  }
}
activeDark=false;
const metrics=frame('Spacing and radius','HORIZONTAL',64);root.appendChild(metrics);
const sp=frame('spacing','VERTICAL',16);metrics.appendChild(sp);await text(sp,'spacing / Title','Spacing','Heading / Heading 4');
for(const [key,value] of spacePairs){const row=frame('spacing / '+key,'HORIZONTAL',16);sp.appendChild(row);await text(row,'spacing / '+key+' / Label','spacing/'+key+' · '+value,'Caption / Caption 2','Text/Primary',180);const bar=track(figma.createRectangle());bar.name='spacing/'+key+' / Bound sample';bar.resize(Math.max(value,0.01),16);bar.setBoundVariable('width',vars['spacing/'+key]);bar.fills=[paint('Surface/Accent')];row.appendChild(bar);}
const rad=frame('radius','VERTICAL',16);metrics.appendChild(rad);await text(rad,'radius / Title','Radius','Heading / Heading 4');
for(const value of [0,2,4,6,8,12,16,24,9999]){const key=value===9999?'full':value;const row=frame('radius / '+key,'HORIZONTAL',16);rad.appendChild(row);await text(row,'radius / '+key+' / Label','radius/'+key,'Caption / Caption 2','Text/Primary',150);const sq=track(figma.createRectangle());sq.name='radius/'+key+' / Bound sample';sq.resize(48,48);sq.fills=[paint('Surface/Accent')];for(const corner of ['topLeft','topRight','bottomLeft','bottomRight'])sq.setBoundVariable(corner+'Radius',vars['radius/'+key]);row.appendChild(sq);}
const type=frame('Text styles','VERTICAL',24);root.appendChild(type);await text(type,'Text styles / Title','Typography · Manrope','Heading / Heading 4');
for(const [name] of styleDefs)await text(type,name+' / Sample',name,name,'Text/Primary',1248);
return {createdNodeIds,mutatedNodeIds:[page.id],createdVariableIds,pages:{foundations:page.id,components:components.id,screens:screens.id},collections:Object.fromEntries(Object.entries(collections).map(([k,v])=>[k,{id:v.id,modes:v.modes}])),styles:Object.fromEntries(Object.entries(styles).map(([k,v])=>[k,v.id])),rootId:root.id,counts:{variables:createdVariableIds.length,textStyles:styleDefs.length,semanticTokens:Object.keys(roles).length}};
