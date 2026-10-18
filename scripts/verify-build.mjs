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
// The vision article must remain complete and discoverable in both languages,
// including when its optional animations have not loaded.
for(const lang of ['fr','en']){
 const prefix=lang==='fr'?'':'en/';
 const route=`${prefix}blog/identite-numerique-rupture-majeure/`;
 const page=documents.get(join(root,route,'index.html'));
 assert.ok(page,`Missing vision article (${lang})`);
 assert.match(page,/"author":\[\{"@type":"Person","name":"Benoit Leger-Derville"/,`Wrong vision author (${lang})`);
 assert.equal([...page.matchAll(/data-document-card(?:\s|>)/g)].length,10,`Incomplete document collection (${lang})`);
 assert.ok(page.includes('id="presentation-oid4vp"')&&page.includes('flow-transcript'),`Missing accessible presentation (${lang})`);
 assert.equal([...page.matchAll(/data-flow-select="\d"/g)].length,5,`Presentation should have five protocol steps (${lang})`);
 assert.equal([...page.matchAll(/data-flow-actor="\d"/g)].length,3,`Presentation should show issuer, wallet and RP (${lang})`);
 assert.ok(page.includes('cnf.jwk')&&page.includes('sd_hash')&&page.includes('OID4VCI'),`Missing key binding and issuance protocol (${lang})`);
 assert.ok(page.includes('data-identity-roadmap')&&page.includes('data-icon="shish-kebab"'),`Missing illustrated roadmap (${lang})`);
 assert.ok(page.includes('hreflang="fr"')&&page.includes('hreflang="en"'),`Missing language alternatives (${lang})`);
 assert.ok(sitemap.includes('/'+route+'</loc>'),`Vision article missing from sitemap (${lang})`);
 const rss=await readFile(join(root,prefix,'rss.xml'),'utf8');
 assert.ok(rss.includes('/'+route),`Vision article missing from RSS (${lang})`);
 for(const theme of ['light','dark']){
  const gif=await readFile(join(root,`media/vision-identite/documents-${lang}-${theme}.gif`));
  assert.equal(gif.subarray(0,6).toString(),'GIF89a',`Invalid document GIF (${lang}, ${theme})`);
 }
}
assert.ok(!documents.get(join(root,'index.html')).includes('gsap.'),'GSAP should not load on the homepage');
for(const prefix of ['realisations/','en/work/']){
 const page=documents.get(join(root,prefix,'rebop/index.html'));
 assert.ok(page?.includes('id="decodeur"'),'Missing reBop decoder section');
 assert.ok(page?.includes('client="visible"'),'Missing deferred React decoder island');
 assert.ok(sitemap.includes('/'+prefix+'rebop/</loc>'),'Missing reBop sitemap entry');
}
for(const prefix of ['/expertises/','/en/expertise/'])for(const group of ['conseil','audit','developpement']){
 const alias=prefix+group+'/';const content=documents.get(join(root,alias,'index.html'));
 assert.ok(content?.includes('0;url='+prefix+'#'+group),`Missing catalogue redirect ${alias}`);
 assert.ok(!sitemap.includes('https://www.stelau.com'+alias+'</loc>'),`Redirect present in sitemap: ${alias}`);
}
const articles=html.filter(f=>/\/blog\/[^/]+\/index.html$/.test(f)).length;
console.log(`Verified ${html.length} HTML pages, ${links} internal references, ${anchors} anchors, catalogue redirects, ${articles} article pages and both RSS feeds.`);
