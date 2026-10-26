import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";

// Offline checks of files actually published from the Render "publication" directory.
// Search Console indexing status and impressions are external data and are not guessed here.
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const base="https://ahmadib.onrender.com/";
const read=(p)=>readFileSync(resolve(root,p),"utf8");
const pages=["","profile.html","resume.html","articles/android-security-toolkit.html","articles/redacted-apk-evidence-reports.html","articles/exported-android-components.html","articles/api-authorization-boundaries.html","articles/intelligence-2026-10-17.html"];
const sitemap=read("sitemap.xml");
const urls=[...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(x=>x[1].trim());
assert.equal(new Set(urls).size,urls.length,"Duplicate sitemap entries");
assert.deepEqual(new Set(urls),new Set(pages.map(p=>base+p)),"Sitemap and supported public pages differ");
function structured(html){
  return [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
}
for(const slug of pages){
  const path=slug||"index.html";
  assert.ok(existsSync(resolve(root,path)),"Sitemap target missing: "+path);
  const html=read(path),canonical=base+slug;
  assert.match(html,/<!doctype html>/i,"Missing doctype: "+path);
  const link=html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  assert.equal(link?.[1],canonical,"Wrong canonical: "+path);
  assert.match(html,/<title>[^<]+<\/title>/i,"Missing title: "+path);
  assert.match(html,/<meta\s+name="description"\s+content="[^"]+"/i,"Missing meta description: "+path);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html),"Blocked indexing: "+path);
  assert.ok(!/<meta[^>]+content="[^"]*noindex[^"]*"[^>]+name="robots"/i.test(html),"Blocked indexing: "+path);
  const graphs=structured(html);
  assert.ok(graphs.length,"Missing structured data: "+path);
  if(slug.startsWith("articles/")){
    const article=graphs.find(x=>["TechArticle","Article","BlogPosting"].includes(x["@type"]));
    assert.ok(article,"Missing research-article schema: "+path);
    assert.equal(article.author?.["@id"],base+"profile.html#person","Unlinked article author: "+path);
    assert.equal(article.mainEntityOfPage,canonical,"Wrong article URL: "+path);
    assert.ok(html.includes('href="../profile.html"'),"Missing author profile link: "+path);
  }
  if(slug==="resume.html"){
    assert.ok(html.includes('onclick="window.print()"'),"Printable resume control missing");
    assert.ok(html.includes("Software Engineer")&&html.includes("Application Security"),"Resume missing relevant engineering/security expertise");
    assert.ok(html.includes("github.com/AhmadibOfficial"),"Resume must link publicly verifiable work");
    assert.ok(html.includes("profile.html#person"),"Resume author must be linked to official identity");
  }
  if(slug==="profile.html"){
    const nodes=graphs.flatMap(x=>x["@graph"]||[x]);
    assert.ok(nodes.some(n=>n["@type"]==="ProfilePage"),"ProfilePage schema missing");
    const person=nodes.find(n=>n["@type"]==="Person");
    assert.equal(person?.["@id"],base+"profile.html#person","Person identity mismatch");
    assert.ok(person?.sameAs?.includes("https://github.com/AhmadibOfficial"),"Missing GitHub identity");
  }
}
const home=read("index.html");
assert.ok(home.includes('href="profile.html"'),"Homepage does not link to profile");
assert.ok(home.includes('href="resume.html"'),"Homepage does not link to resume");
assert.ok(read("profile.html").includes('href="resume.html"'),"Professional biography does not link to CV");
const robots=read("robots.txt");
assert.ok(robots.includes("Sitemap: "+base+"sitemap.xml"),"Robots sitemap missing");
assert.ok(!/^Disallow:\s*\/$/m.test(robots),"Root robots.txt disallows crawling");
assert.equal(read("google01fc58e199c13771.html").trim(),"google-site-verification: google01fc58e199c13771.html","Google ownership file changed");
assert.ok(read("feed.xml").includes("<rss"),"Research feed missing");
console.log("PASS search discoverability gate: 8 public pages, canonical URLs, author identities, sitemap, robots, and Google ownership token.");

const officialX="https://x.com/AhmadibOfficial";
for(const p of ["index.html","profile.html","resume.html"]){
  assert.ok(read(p).includes('href="'+officialX+'"'),"X profile link missing in "+p);
}
for(const p of ["index.html","profile.html"]){
  const nodes=structured(read(p)).flatMap(x=>x["@graph"]||[x]);
  const person=nodes.find(x=>x["@type"]==="Person");
  assert.ok(person?.sameAs?.includes(officialX),"Missing X account in Person identity: "+p);
}
