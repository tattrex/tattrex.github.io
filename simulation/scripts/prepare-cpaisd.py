"""Prepare the selected CC BY 4.0 CPAISD case and its reference masks.

Usage: python prepare-cpaisd.py /path/to/extracted/case
No synthetic pathology is added to the current scan. The prior is explicitly
illustrative, because this dataset does not supply longitudinal examinations.
"""
import gzip, hashlib, json, pathlib, sys
import numpy as np
import pydicom
from scipy.ndimage import map_coordinates
source=pathlib.Path(sys.argv[1]);target=pathlib.Path(__file__).resolve().parents[1]/'public/data'
slices=[];hashes=[]
for file in source.glob('*/raw.dcm'):
 d=pydicom.dcmread(file);maskfile=file.parent/'mask.npz';mask=np.load(maskfile)['mask'];hu=d.pixel_array.astype(np.float32)*float(d.RescaleSlope)+float(d.RescaleIntercept)
 assert np.allclose(d.ImageOrientationPatient,[1,0,0,0,1,0]),'Unexpected orientation'
 assert mask.shape==hu.shape==(512,512) and set(np.unique(mask))<=set([0,1,2])
 assert np.array_equal(hu,np.load(file.parent/'image.npz')['image'])
 slices.append((float(d.ImagePositionPatient[2]),hu,mask,d))
 hashes.extend([{'file':file.parent.name+'/raw.dcm','sha256':hashlib.sha256(file.read_bytes()).hexdigest()},{'file':file.parent.name+'/mask.npz','sha256':hashlib.sha256(maskfile.read_bytes()).hexdigest()}])
slices.sort(key=lambda item:item[0]);z_spacing=float(np.median(np.diff([s[0] for s in slices])))
assert np.allclose(np.diff([s[0] for s in slices]),z_spacing),'Nonuniform slice spacing'
d0=slices[0][3]
assert all(np.allclose(s[3].ImagePositionPatient[:2],d0.ImagePositionPatient[:2]) and np.allclose(s[3].PixelSpacing,d0.PixelSpacing) for s in slices)
# Sample the same native voxel centres for CT and labels, then flip L/P to R/A.
# No smoothing, intensity reduction or invented lesion is applied to this scan.
current=np.stack([s[1][::2,::2] for s in slices])[:,::-1,::-1].copy().astype('<i2')
mask=np.stack([s[2][::2,::2] for s in slices])[:,::-1,::-1].copy().astype('uint8')
z0=int(np.argmax((mask==1).sum(axis=(1,2))));ys,xs=np.where(mask[z0]==1);cx,cy=xs.mean(),ys.mean();j=np.argmin((xs-cx)**2+(ys-cy)**2);lesion=[int(xs[j]),int(ys[j]),z0]
ventricular=[127,132,z0];z,y,x=np.indices(current.shape,dtype=np.float32)
# This companion is only an illustrative earlier timepoint. The source stays intact.
vx,vy,vz=ventricular;weight=np.exp(-.5*(((x-vx)/22)**2+((y-vy)/28)**2+((z-vz)/11)**2))
prior=np.rint(map_coordinates(current.astype(np.float32),[z,vy+(y-vy)*(1+.10*weight),vx+(x-vx)*(1+.16*weight)],order=1,mode='nearest')).astype('<i2')
target.mkdir(exist_ok=True,parents=True)
prior_delta=np.bitwise_xor(current.view('<u2'),prior.view('<u2'))
for filename,a in [('current.raw.gz',current),('prior-delta.raw.gz',prior_delta),('infarct-mask.raw.gz',mask)]:
 (target/filename).write_bytes(gzip.compress(a.tobytes(order='C'),compresslevel=9,mtime=0))
meta={'dims':list(reversed(current.shape)),'spacing':[float(d0.PixelSpacing[1])*2,float(d0.PixelSpacing[0])*2,z_spacing],'orientation':'RAS','units':'HU','files':{'current':'current.raw.gz','prior':'prior.raw.gz','mask':'infarct-mask.raw.gz'},'initialPoint':lesion,'lesionPoint':lesion,'ventricularPoint':ventricular,'source':'CPAISD','sourceCase':'validation/2.25.292842437493243996825712901028408554321','sourceUrl':'https://zenodo.org/records/10892316','license':'CC-BY-4.0','attribution':'Umerenkov D., Kudin S., Peksheva M., Pavlov D. (2024). CPAISD: Core-Penumbra Acute Ischemic Stroke Dataset. Zenodo. doi:10.5281/zenodo.10892316.','maskProvenance':'Expert reference annotation','maskLabels':{'0':'Background','1':'Ischaemic core','2':'Penumbra'},'currentAltered':False,'priorIsSynthetic':True,'preprocessing':'Original HU and masks sampled at identical native voxel centres with stride 2 in-plane; native z spacing retained; LPS to RAS flips. No synthetic lesion or lesion-intensity modification.','scenario':'Real source CT and published expert reference masks. Priority and reporting actions are scripted. Prior is an explicitly derived illustration, not a real follow-up scan.','maskVoxelCounts':{str(v):int((mask==v).sum()) for v in [0,1,2]},'nativeDims':[512,512,len(slices)],'nativeSpacing':[float(d0.PixelSpacing[1]),float(d0.PixelSpacing[0]),z_spacing]}
meta['files'].pop('prior');meta['files']['priorDelta']='prior-delta.raw.gz'
meta['priorEncoding']='Lossless 16-bit XOR against the current volume, then gzip; decoded voxels are unchanged.'
(target/'volume.json').write_text(json.dumps(meta,indent=2)+'\n')
(target/'source-manifest.json').write_text(json.dumps({'archive':'https://zenodo.org/records/10892316/files/dataset.zip','archiveMD5':'a034be2cc6e93b5fb696231c59df900c','selectedFiles':hashes},indent=2)+'\n')
print(json.dumps({'dims':meta['dims'],'spacing':meta['spacing'],'lesionPoint':lesion,'maskVoxelCounts':meta['maskVoxelCounts'],'assetBytes':{p.name:p.stat().st_size for p in target.glob('*.raw.gz')}},indent=2))
