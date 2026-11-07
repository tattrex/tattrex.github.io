import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
const dist=new URL('../dist/',import.meta.url);
test('every local asset in the production HTML exists, including the font and social image',async()=>{
 const html=await readFile(new URL('index.html',dist),'utf8');
 const assets=[...html.matchAll(/(?:https:\/\/tattrex\.com\/)?(assets\/[a-zA-Z0-9.-]+)/g)].map(m=>m[1]);
 assert.ok(assets.length>15);
 for(const asset of new Set(assets))await access(new URL(asset,dist));
 assert.doesNotMatch(html,/__(STYLES|SCRIPT)__/);
});
test('the static page contains all sections and keeps study imports out of its initial dependencies',async()=>{
 const html=await readFile(new URL('index.html',dist),'utf8');
 for(const id of ['see','platform','labs','approach','contact'])assert.ok(html.includes(`id="${id}"`));
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.doesNotMatch(html,/<(?:script|link)[^>]*(?:cinema\.js|\.raw\.gz)/);
 assert.doesNotMatch(html,/<(?:audio|video)\b/);
});
