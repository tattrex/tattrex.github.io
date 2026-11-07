import {readFile,stat} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
const base=new URL('../dist/',import.meta.url),manifest=JSON.parse(await readFile(new URL('build-manifest.json',base)));
const size=async path=>(await stat(new URL(path,base))).size;
const gzip=async path=>gzipSync(await readFile(new URL(path,base)),{level:9}).length;
// The 740px mobile artwork selects 2560px on a 3x Retina screen.
const metrics={htmlGzip:await gzip('index.html'),jsGzip:await gzip(manifest.js),cssGzip:await gzip(manifest.css),font:await size('assets/'+manifest.assets['manrope.woff2']),mobileHero:await size('assets/'+manifest.assets['hero-2560.webp'])};
metrics.firstViewBytes=metrics.htmlGzip+metrics.jsGzip+metrics.cssGzip+metrics.font+metrics.mobileHero+await size('assets/'+manifest.assets['logo.svg']);
assert.ok(metrics.jsGzip<15_000,'Main JS exceeds 15 KB gzip');
assert.ok(metrics.cssGzip<15_000,'CSS exceeds 15 KB gzip');
assert.ok(metrics.firstViewBytes<350_000,'Mobile first view exceeds 350 KB');
console.log(JSON.stringify(metrics,null,2));
