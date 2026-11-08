import {samplePlane,sampleMaskPlane,windowValue,planeFromVoxel,voxelFromPlane} from './volume.js';
import {PRESETS} from './commands.js';
const cache=new WeakMap();
function sampled(volume,axis,index,slabMm){let map=cache.get(volume);if(!map){map=new Map();cache.set(volume,map);}const key=`${axis}:${index}:${slabMm}`;if(!map.has(key)){if(map.size>48)map.delete(map.keys().next().value);map.set(key,samplePlane(volume,axis,index,{slabMm}));}return map.get(key);}
function sampledMask(volume,axis,index,slabMm,mode){let map=cache.get(volume);if(!map){map=new Map();cache.set(volume,map);}const key=`mask:${axis}:${index}:${slabMm}:${mode}`;if(!map.has(key)){if(map.size>48)map.delete(map.keys().next().value);map.set(key,sampleMaskPlane(volume,axis,index,{slabMm,labels:mode==='both'?[1,2]:[1]}));}return map.get(key);}
export function drawViewport(canvas,volume,state,axis,mask=null,motion=null){
 const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;
 const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(box.width*ratio);canvas.height=Math.round(box.height*ratio);
 const ctx=canvas.getContext('2d');ctx.scale(ratio,ratio);ctx.fillStyle='#000';ctx.fillRect(0,0,box.width,box.height);
 const normal=axis==='axial'?2:axis==='coronal'?1:0,index=state.point[normal],slabMm=state.slabMm;
 const sample=sampled(volume,axis,index,slabMm),[w,h]=sample.size;
 let preset=PRESETS[state.window];
 if(motion?.kind==='window'&&motion.fromWindow){const from=PRESETS[motion.fromWindow];preset={width:from.width+(preset.width-from.width)*motion.reveal,level:from.level+(preset.level-from.level)*motion.reveal};}
 const maskMode=motion?.hideOverlay?motion.fromMaskMode||state.maskMode:state.maskMode;
 const overlay=mask&&(state.overlay||motion?.hideOverlay)?sampledMask(mask,axis,index,slabMm,maskMode).values:null;
 const off=document.createElement('canvas');off.width=w;off.height=h;const ox=off.getContext('2d'),image=ox.createImageData(w,h);
 for(let i=0;i<sample.values.length;i++){
  const grey=windowValue(sample.values[i],preset.width,preset.level),p=i*4;image.data[p]=image.data[p+1]=image.data[p+2]=grey;image.data[p+3]=255;
  if(overlay?.[i]){const cls=overlay[i]&1?1:2,color=cls===1?[236,112,82]:[224,190,112],same=j=>!!(overlay[j]&(1<<(cls-1)))&&(cls===1||!(overlay[j]&1));const x=i%w,y=Math.floor(i/w),edge=x===0||x===w-1||y===0||y===h-1||!same(i-1)||!same(i+1)||!same(i-w)||!same(i+w);let a=edge?.8:cls===1?.26:.18;
   if(motion?.kind==='overlay'){const reveal=motion.hideOverlay?1-motion.reveal:edge?Math.min(1,motion.reveal*2):Math.max(0,(motion.reveal-.2)/.8);a=Math.min(1,a+(edge?.2:.32)*motion.emphasis)*reveal;}
   for(let c=0;c<3;c++)image.data[p+c]=Math.round(grey*(1-a)+color[c]*a);}
 }
 ox.putImageData(image,0,0);
 const pw=w*sample.spacing[0],ph=h*sample.spacing[1],scale=Math.min((box.width-(state.thumbnail?8:32))/pw,(box.height-(state.thumbnail?8:48))/ph)*state.zoom;
 const width=pw*scale,height=ph*scale,focus=state.compare?planeFromVoxel(volume,axis,state.point):[w/2,h/2];
 const x=box.width/2-focus[0]/w*width,y=box.height/2-focus[1]/h*height;
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(off,x,y,width,height);
 canvas.viewTransform={x,y,width,height,w,h,axis,index};
 // These temporary brackets identify the linked anatomical location; they never
 // modify, detach or enlarge the reference mask independently of its source CT.
 if(motion?.kind==='compare'&&motion.emphasis>0){
  const [u,v]=planeFromVoxel(volume,axis,state.point),cx=x+(u+.5)/w*width,cy=y+(v+.5)/h*height;
  const rw=46/w*width,rh=64/h*height,len=Math.min(rw,rh)*.22;
  ctx.save();ctx.strokeStyle=`rgba(231,158,136,${motion.emphasis*.9})`;ctx.lineWidth=1.3;ctx.beginPath();
  for(const sx of [-1,1])for(const sy of [-1,1]){const bx=cx+sx*rw/2,by=cy+sy*rh/2;ctx.moveTo(bx-sx*len,by);ctx.lineTo(bx,by);ctx.lineTo(bx,by-sy*len);}ctx.stroke();ctx.restore();
 }
 if(!state.clean&&(state.mode==='mpr'||state.compare)){const [u,v]=planeFromVoxel(volume,axis,state.point),cx=x+(u+.5)/w*width,cy=y+(v+.5)/h*height;ctx.strokeStyle='rgba(223,122,96,.65)';ctx.lineWidth=1;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(cx,24);ctx.lineTo(cx,box.height-24);ctx.moveTo(24,cy);ctx.lineTo(box.width-24,cy);ctx.stroke();ctx.setLineDash([]);}
 if(!state.clean&&state.compare){const [u,v]=planeFromVoxel(volume,axis,volume.ventricularPoint);ctx.strokeStyle='#e5bcae';ctx.lineWidth=1;ctx.strokeRect(x+(u-23)/w*width,y+(v-32)/h*height,46/w*width,64/h*height);}
 if(state.clean)return;
 ctx.font='12px Manrope, sans-serif';ctx.fillStyle='#b8b7b1';ctx.textAlign='center';ctx.fillText(sample.labels[0],box.width/2,17);ctx.fillText(sample.labels[1],box.width/2,box.height-10);ctx.textAlign='left';ctx.fillText(sample.labels[2],10,box.height/2);ctx.textAlign='right';ctx.fillText(sample.labels[3],box.width-10,box.height/2);
}
export function pickVoxel(canvas,volume,clientX,clientY){const t=canvas.viewTransform;if(!t)return null;const box=canvas.getBoundingClientRect();return voxelFromPlane(volume,t.axis,t.index,(clientX-box.left-t.x)/t.width*t.w-.5,(clientY-box.top-t.y)/t.height*t.h-.5);}
