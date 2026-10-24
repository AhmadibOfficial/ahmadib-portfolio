import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";

const folder=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=(name)=>readFileSync(resolve(folder,name),"utf8");
const html=read("index.html"),css=read("assets/style.css"),js=read("assets/app.js");
const articles=["intelligence-2026-10-17","android-security-toolkit","exported-android-components","api-authorization-boundaries"];
const ids=["main","home","about","expertise","projects","research","downloads","ventures","approach","contact"];
assert.match(html,/^<!doctype html>/i,"Missing HTML doctype");
assert.match(html,/https:\/\/ahmadib\.onrender\.com\//,"Wrong personal site canonical");
assert.match(html,/https:\/\/metaautomate\.onrender\.com\//,"MetaAutomate link missing");
assert.ok(html.includes('href="feed.xml"'),"Preserve RSS discoverability");
for(const id of ids)assert.ok(html.includes('id="'+id+'"'),"Missing #"+id);
for(const id of articles){
  assert.ok(existsSync(resolve(folder,"articles",id+".html")),"Missing journal article "+id);
  assert.ok(html.includes('href="articles/'+id+'.html"'),"Missing article link "+id);
}
for(const asset of ["assets/style.css","assets/app.js","assets/favicon.svg","feed.xml","sitemap.xml","robots.txt","404.html"])assert.ok(existsSync(resolve(folder,asset)),"Missing asset "+asset);
assert.equal((html.match(/class="project-card(?:\s|")/g)||[]).length,7,"Expect 7 project showcases");
assert.equal((html.match(/data-article-card\b/g)||[]).length,4,"Expect 4 research previews");
assert.equal((html.match(/class="venture-card"/g)||[]).length,3,"Expect 3 venture spotlights");
assert.ok(html.includes("OneCall-phone-arm.apk")&&html.includes("main.zip"),"Verified downloads missing");
assert.ok(html.includes("USB/ADB reverse")&&html.includes("standalone cloud-connected app"),"OneCall prerelease limitations missing");
assert.ok(!html.includes("/MetaAutomate/archive/")&&!html.includes("/Safwa-Quran/archive/"),"Must not expose private code downloads");
assert.ok(!html.includes('href="#"')&&!html.includes("YOUR-EMAIL"),"Placeholder links found");
assert.ok(css.includes(".ventures-grid")&&css.includes(".journal-grid")&&css.includes(".expertise-grid"),"CSS sections missing");
assert.ok(js.includes("data-filter")||js.includes(".filter-button"),"Project filter script missing");
assert.ok(js.includes("[data-article-search]"),"Journal filter script missing");
const allIds=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(allIds).size,allIds.length,"Duplicate element ids");
for(const href of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
 const ref=href[1];
 if(ref.startsWith("#")){assert.ok(allIds.includes(ref.slice(1)),"Missing anchor "+ref);continue;}
 if(/^(https?:|mailto:|data:)/.test(ref))continue;
 const name=ref.split(/[?#]/)[0];
 if(name==="assets/ahmad-ib-profile.jpg"&&!existsSync(resolve(folder,name)))continue; // Original binary JPG is published separately.
 if(name)assert.ok(existsSync(resolve(folder,name)),"Broken relative link "+name);
}
for(const name of ["index.html","assets/style.css","assets/app.js"]){
  assert.ok(!/^\s*\x60{3}/m.test(read(name)),"Copied Markdown fence in "+name);
}
const feed=read("feed.xml"),sitemap=read("sitemap.xml");
assert.ok(feed.includes("<rss"),"RSS feed missing");
assert.ok(sitemap.includes("https://ahmadib.onrender.com/"),"Sitemap canonical missing");
for(const id of articles)assert.ok(sitemap.includes(id+".html"),"Sitemap article missing: "+id);
console.log("PASS personal site: 7 projects, 4 journal articles, 3 ventures, 2 verified download links.");

// Verify all seven user-supplied workflow illustrations and local image asset.
assert.equal((html.match(/class="workflow-image workflow-image--/g) || []).length, 7, "Expected seven workflow photographs");
assert.ok(css.includes("./workflow-gallery.svg"), "Broken workflow asset path in CSS");
const sprite = read("assets/workflow-gallery.svg");
assert.ok(sprite.includes("data:image/webp;base64,") && sprite.length > 5000, "Workflow photo sprite missing");
assert.ok(!html.includes("Illustrative workflow photography"), "Unwanted gallery disclosure remains");


assert.ok(!html.includes("Illustrative workflow photography. The images do not represent identified team members"),"Unwanted gallery caption remains");
assert.ok(html.includes('id="connect"'),"Social section missing");
for(const network of ["GitHub","LinkedIn","Instagram","TikTok","Facebook","Fiverr","Freelancer","YouTube","WhatsApp"]){
  assert.ok(html.includes('social-'+network.toLowerCase()),"Missing social logo: "+network);
}
assert.ok(css.includes("background-size:cover,200% 400%"),"High-resolution photo display with fallback missing");

assert.ok(html.includes("https://wa.me/2348069514047"),"Verified WhatsApp contact link missing");

assert.equal((html.match(/data-photo-path="assets\/workflow\//g)||[]).length,7,"Missing original-resolution photo references");
assert.ok(js.includes("loadOriginalWorkflowImages"),"Original-resolution photo loader missing");
assert.ok(css.includes(".workflow-image.has-original img"),"Natural-aspect-ratio original photo styling missing");

assert.ok(html.includes('class="hero-portrait-card"'),"Original-portrait hero missing");
assert.ok(html.includes('src="assets/ahmad-ib-profile.jpg"'),"Original portrait image path incorrect");
assert.ok(!html.includes("SYSTEM / OVERVIEW"),"Obsolete system overview is still on page");
assert.ok(css.includes(".hero-portrait-card.is-loaded .hero-portrait-image"),"Portrait display styling missing");
assert.ok(js.includes("prepareHeroPortrait"),"Portrait loading fallback missing");
