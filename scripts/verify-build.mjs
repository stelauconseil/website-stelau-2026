import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,join,relative} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('dist');const files=[];
async function walk(dir){for(const name of await readdir(dir)){const p=join(dir,name);if((await stat(p)).isDirectory())await walk(p);else files.push(p);}}
await walk(root);
const html=files.filter(f=>f.endsWith('.html'));let links=0,anchors=0;
const documents=new Map(await Promise.all(html.map(async file=>[file,await readFile(file,'utf8')])));
for(const file of html){
 const content=documents.get(file);
 assert.match(content,/<html[^>]*lang="(fr|en)"/,file);assert.match(content,/<title>/,file);
 const base=new URL(relative(root,file),'https://build.local/');
 for(const match of content.matchAll(/\b(?:href|src)="((?:\/|#)[^"]*)"/g)){
  const raw=match[1].replaceAll('&amp;','&');if(raw.startsWith('//'))continue;
  const url=new URL(raw,base);const target=url.pathname;
  const path=target.endsWith('/')?join(root,target,'index.html'):join(root,target);
  const targetFile=files.includes(path)?path:join(root,target,'index.html');
  assert.ok(files.includes(targetFile)||target==='/pagefind/',`Missing internal target ${target} from ${file}`);links++;
  if(url.hash&&documents.has(targetFile)){
   const id=decodeURIComponent(url.hash.slice(1));const targetContent=documents.get(targetFile);
   assert.ok(targetContent.includes(`id="${id}"`)||targetContent.includes(`name="${id}"`),`Missing anchor ${raw} from ${file}`);anchors++;
  }
 }
}
for(const route of ['.nojekyll','index.html','en/index.html','blog/index.html','en/blog/index.html','a-propos/index.html','en/about/index.html','contact/index.html','rss.xml','en/rss.xml','pagefind/pagefind.js'])assert.ok(files.includes(join(root,route)),`Missing ${route}`);
for(const lang of ['', 'en/'])for(const slug of ['mdoc-web-verifier-deep-dive','oid4vp-backend-implementation'])assert.ok(files.includes(join(root,`${lang}blog/${slug}/index.html`)),`Missing imported article ${lang}${slug}`);
const sitemap=await readFile(join(root,'sitemap-0.xml'),'utf8');
for(const prefix of ['/expertises/','/en/expertise/'])for(const group of ['conseil','audit','developpement']){
 const alias=prefix+group+'/';const content=documents.get(join(root,alias,'index.html'));
 assert.ok(content?.includes('0;url='+prefix+'#'+group),`Missing catalogue redirect ${alias}`);
 assert.ok(!sitemap.includes('https://www.stelau.com'+alias+'</loc>'),`Redirect present in sitemap: ${alias}`);
}
const articles=html.filter(f=>/\/blog\/[^/]+\/index.html$/.test(f)).length;
console.log(`Verified ${html.length} HTML pages, ${links} internal references, ${anchors} anchors, catalogue redirects, ${articles} article pages and both RSS feeds.`);
