import {readFile,writeFile,mkdir,rm,cp,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {gzipSync,brotliCompressSync,constants} from 'node:zlib';
import {transform} from 'esbuild';
const hash=b=>createHash('sha256').update(b).digest('hex').slice(0,10),root=new URL('../',import.meta.url),dist=new URL('dist/',root);
await rm(dist,{recursive:true,force:true});await mkdir(new URL('assets/',dist),{recursive:true});
const assetMap={};for(const name of await readdir(new URL('site/assets/',root))){const bytes=await readFile(new URL('site/assets/'+name,root));const dot=name.lastIndexOf('.'),versioned=name.slice(0,dot)+'-'+hash(bytes)+name.slice(dot);assetMap[name]=versioned;await writeFile(new URL('assets/'+versioned,dist),bytes);}
let css=await readFile(new URL('site/styles.css',root),'utf8')+'\n'+await readFile(new URL('site/simulation.css',root),'utf8')+'\n'+await readFile(new URL('simulation/report.css',root),'utf8');
css=css.replace('./manrope.woff2','./'+assetMap['manrope.woff2']);css=(await transform(css,{loader:'css',minify:true,target:'es2022'})).code;
const js=(await transform(await readFile(new URL('site/main.js',root),'utf8'),{loader:'js',format:'esm',minify:true,target:'es2022'})).code;
const cssName='site-'+hash(css)+'.css',jsName='site-'+hash(js)+'.js';await writeFile(new URL('assets/'+cssName,dist),css);await writeFile(new URL('assets/'+jsName,dist),js);
const config=JSON.parse(await readFile(new URL('site/config.json',root),'utf8'));
function replaceAssets(html){for(const [name,target] of Object.entries(assetMap))html=html.replaceAll('assets/'+name,'assets/'+target);return html.replaceAll('__SITE_URL__',config.url).replaceAll('__STYLES__','assets/'+cssName).replaceAll('__SCRIPT__','assets/'+jsName);}
let html=await readFile(new URL('site/index.html',root),'utf8');
for(const [key,target] of [['demo',config.demoContact],['idea',config.ideaContact]])if(target){const escaped=target.replaceAll('&','&amp;').replaceAll('"','&quot;');html=html.replaceAll(`href="#contact" data-contact="${key}"`,`href="${escaped}" data-contact="${key}"`);}
await writeFile(new URL('index.html',dist),replaceAssets(html));
for(const page of ['privacy.html','terms.html'])await writeFile(new URL(page,dist),replaceAssets(await readFile(new URL('site/'+page,root),'utf8')));
for(const file of ['index.html','cinema.css','report.css','src','public'])await cp(new URL('simulation/'+file,root),new URL('simulation/'+file,dist),{recursive:true});
await writeFile(new URL('robots.txt',dist),`User-agent: *\nAllow: /\nDisallow: /simulation/\nSitemap: ${config.url}/sitemap.xml\n`);
await writeFile(new URL('sitemap.xml',dist),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${config.url}/</loc></url></urlset>`);
await writeFile(new URL('_headers',dist),'/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n');
await writeFile(new URL('.nojekyll',dist),'');
async function compress(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const path=new URL(entry.name+(entry.isDirectory()?'/':''),dir);if(entry.isDirectory())await compress(path);else if(/\.(html|css|js|json|svg|xml|txt)$/.test(entry.name)){const data=await readFile(path);if(data.length>400){await writeFile(new URL(path.href+'.gz'),gzipSync(data,{level:9}));await writeFile(new URL(path.href+'.br'),brotliCompressSync(data,{params:{[constants.BROTLI_PARAM_QUALITY]:9}}));}}}}
await compress(dist);
await writeFile(new URL('build-manifest.json',dist),JSON.stringify({assets:assetMap,css:'assets/'+cssName,js:'assets/'+jsName,contactConfigured:!!config.demoContact&&!!config.ideaContact},null,2));
console.log(`Built static site: CSS ${gzipSync(css).length} B gzip, JS ${gzipSync(js).length} B gzip. Contact routes ${config.demoContact&&config.ideaContact?'configured':'pending'}.`);
