// Rebuild responsive exports from the preserved 4K Higgsfield masters.
// Requires libwebp's cwebp executable (brew install webp on macOS).
import {execFileSync} from 'node:child_process';
import {stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
for(const [name,master,widths] of [
 ['hero','tattrex-tomographic-sculpture-4k.png',[640,960,1440,1920,2560,2880,3840]],
 ['atlas','tattrex-research-atlas-4k.png',[800,1280,1920,2560,3840]]
])for(const width of widths){
 const source=fileURLToPath(new URL('design/assets/'+master,root));
 const output=fileURLToPath(new URL(`site/assets/${name}-${width}.webp`,root));
 execFileSync('cwebp',['-quiet','-q','92','-m','6','-sharp_yuv','-resize',String(width),'0',source,'-o',output]);
 console.log(`${name}-${width}.webp: ${Math.round((await stat(output)).size/1024)} KiB`);
}
