import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";

// Offline technical SEO checks for the GitHub Pages professional portfolio.
// No claim about Google's indexed pages, rankings or impressions is made.
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const home=readFileSync(resolve(root,"index.html"),"utf8");
const sitemap=readFileSync(resolve(root,"sitemap.xml"),"utf8");
const page="https://ahmadibofficial.github.io/ahmadib-portfolio/";
const verifiedBio="https://ahmadib.onrender.com/profile.html";
assert.match(home,/<title>[^<]+<\/title>/i,"Page title missing");
assert.match(home,/<meta name="description" content="[^"]+"/i,"Page description missing");
assert.ok(!/<meta[^>]+noindex/i.test(home),"Indexing blocked by meta tag");
assert.ok(home.includes('<link rel="canonical" href="'+page+'">'),"Wrong GitHub Pages canonical");
assert.ok(home.includes('href="'+verifiedBio+'"'),"Missing official professional biography link");
assert.ok(home.includes('href="https://ahmadib.onrender.com/resume.html"'),"Missing direct CV link from professional portfolio");
const urls=[...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(m=>m[1].trim());
assert.deepEqual(urls,[page],"GitHub Pages sitemap mismatch");
const ld=home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(ld,"Person JSON-LD missing");
const data=JSON.parse(ld[1]),p=data["@graph"]?.find(n=>n["@type"]==="Person");
assert.equal(p?.name,"Ahmad Ibrahim","Wrong public identity");
assert.equal(p?.url,verifiedBio,"Person identity should link to the verified biography");
assert.ok(p?.sameAs?.includes("https://github.com/AhmadibOfficial"),"No public GitHub identity");
assert.ok(p?.sameAs?.includes("https://www.linkedin.com/in/ahmad-ib"),"No LinkedIn identity link");
assert.ok(existsSync(resolve(root,"assets/ahmad-ib-profile.jpg")),"Portrait asset missing");
console.log("PASS GitHub Pages discoverability: canonical URL, sitemap, personal identity, official biography and portrait.");
