/** Calibrated voxel operations for the demonstration, independent of the UI. */
export function windowValue(hu,width,level){
 if(!Number.isFinite(width)||width<1||!Number.isFinite(level))throw new RangeError('Invalid window');
 if(width===1)return hu<=level-.5?0:255;
 return Math.round(Math.min(1,Math.max(0,(hu-(level-.5))/(width-1)+.5))*255);
}
export function slabIndices(center,spacing,thickness,count){
 if(!Number.isFinite(spacing)||spacing<=0||!Number.isFinite(thickness)||thickness<0||!Number.isInteger(count)||count<1||!Number.isFinite(center))throw new RangeError('Invalid slab geometry');
 center=Math.max(0,Math.min(count-1,Math.round(center)));
 const half=thickness/(2*spacing),start=Math.max(0,Math.ceil(center-half)),end=Math.min(count-1,Math.floor(center+half));
 return Array.from({length:end-start+1},(_,i)=>start+i);
}
export function planeGeometry(volume,axis){
 const {dims:d,spacing:s}=volume;
 if(axis==='axial')return {size:[d[0],d[1]],spacing:[s[0],s[1]],normal:2,labels:['A','P','R','L']};
 if(axis==='coronal')return {size:[d[0],d[2]],spacing:[s[0],s[2]],normal:1,labels:['S','I','R','L']};
 if(axis==='sagittal')return {size:[d[1],d[2]],spacing:[s[1],s[2]],normal:0,labels:['S','I','A','P']};
 throw new RangeError('Unknown plane');
}
export function voxelFromPlane(volume,axis,index,u,v){
 const d=volume.dims,g=planeGeometry(volume,axis);
 u=Math.max(0,Math.min(g.size[0]-1,Math.round(u)));v=Math.max(0,Math.min(g.size[1]-1,Math.round(v)));index=Math.max(0,Math.min(d[g.normal]-1,Math.round(index)));
 if(axis==='axial')return [d[0]-1-u,d[1]-1-v,index];
 if(axis==='coronal')return [d[0]-1-u,index,d[2]-1-v];
 return [index,d[1]-1-u,d[2]-1-v];
}
export function planeFromVoxel(volume,axis,[x,y,z]){
 const [nx,ny,nz]=volume.dims;
 if(axis==='axial')return [nx-1-x,ny-1-y];
 if(axis==='coronal')return [nx-1-x,nz-1-z];
 if(axis==='sagittal')return [ny-1-y,nz-1-z];
 throw new RangeError('Unknown plane');
}
export function samplePlane(volume,axis,index,{slabMm=0}={}){
 const g=planeGeometry(volume,axis),[w,h]=g.size,[nx,ny]=volume.dims;
 const indices=slabIndices(index,volume.spacing[g.normal],slabMm,volume.dims[g.normal]);
 const values=new Float32Array(w*h);
 // The x, y, z axes are canonical RAS. Pixel axes follow radiological viewing.
 for(let v=0;v<h;v++)for(let u=0;u<w;u++){
  let max=-Infinity;
  for(const i of indices){let x,y,z;if(axis==='axial'){x=nx-1-u;y=ny-1-v;z=i;}else if(axis==='coronal'){x=nx-1-u;y=i;z=volume.dims[2]-1-v;}else{x=i;y=ny-1-u;z=volume.dims[2]-1-v;}
   max=Math.max(max,volume.data[x+nx*(y+ny*z)]);
  }values[u+v*w]=max;
 }
 return {...g,values,indices};
}
/** A categorical mask uses a union across the slab, never a numeric maximum. */
export function sampleMaskPlane(volume,axis,index,{slabMm=0,labels=[1]}={}){
 const g=planeGeometry(volume,axis),[w,h]=g.size,[nx,ny,nz]=volume.dims;
 const indices=slabIndices(index,volume.spacing[g.normal],slabMm,volume.dims[g.normal]);const values=new Uint8Array(w*h);
 for(let v=0;v<h;v++)for(let u=0;u<w;u++)for(const i of indices){let x,y,z;if(axis==='axial'){x=nx-1-u;y=ny-1-v;z=i;}else if(axis==='coronal'){x=nx-1-u;y=i;z=nz-1-v;}else{x=i;y=ny-1-u;z=nz-1-v;}const label=volume.data[x+nx*(y+ny*z)];if(labels.includes(label))values[u+v*w]|=1<<(label-1);}
 return {...g,values,indices};
}
export async function loadDemoVolumes(base=new URL('../public/data/',import.meta.url),fetcher=fetch){
 const response=await fetcher(new URL('volume.json',base));if(!response.ok)throw new Error('The demo volume metadata could not be loaded.');
 const meta=await response.json();
 const voxels=meta.dims.reduce((a,b)=>a*b,1);
 async function download(file,bytes){
  const r=await fetcher(new URL(file,base));if(!r.ok)throw new Error('The demo images could not be loaded.');
  const stream=r.body.pipeThrough(new DecompressionStream('gzip'));
  const buffer=await new Response(stream).arrayBuffer();
  if(buffer.byteLength!==bytes)throw new Error('The demo image download is incomplete.');
  return buffer;
 }
 const [currentBuffer,priorBuffer,maskBuffer]=await Promise.all([
  download(meta.files.current,voxels*2),download(meta.files.priorDelta||meta.files.prior,voxels*2),download(meta.files.mask,voxels)
 ]);
 const current=new Int16Array(currentBuffer),prior=new Int16Array(priorBuffer);
 // XOR restores the exact signed 16-bit values, without resampling or quantising.
 if(meta.files.priorDelta)for(let i=0;i<voxels;i++)prior[i]^=current[i];
 return {meta,current:{...meta,data:current},prior:{...meta,data:prior},mask:{...meta,data:new Uint8Array(maskBuffer)}};
}
