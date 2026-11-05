import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const html = read("index.html");
const css = read("css/style.css");
const js = read("js/script.js");
const projectCount = (html.match(/class="project-card(?:\s|")/g) ?? []).length;
const requiredSections = ["home","about","expertise","projects","research","downloads","approach","contact"];

assert.match(html, /<!doctype html>/i);
assert.equal(projectCount, 8, "Expected seven real project cards");
for (const id of requiredSections) assert.ok(html.includes('id="' + id + '"'), "Missing section: " + id);
for (const file of ["css/style.css","js/script.js","assets/favicon.svg"]) assert.ok(existsSync(resolve(root,file)), "Missing asset " + file);
assert.ok(css.includes(".project-card") && css.includes(".downloads-section"), "Missing core CSS");
assert.ok(js.includes("data-filter") || js.includes(".filter-button"), "Missing filter JavaScript");
assert.ok(html.includes("OneCall-phone-arm.apk"), "OneCall Android build download link missing");
assert.ok(html.includes("android-security-toolkit/archive/refs/heads/main.zip"), "Toolkit source link missing");
assert.ok(!html.includes("Ahmad_Ibrahim_CV"), "Unverified CV link must not return");
assert.ok(!html.includes('href="#"'), "Dead placeholder link found");
assert.ok(!html.includes("/MetaAutomate/archive/"), "Private MetaAutomate source must not be linked");
assert.ok(!html.includes("/Safwa-Quran/archive/"), "Private Safwa source must not be linked");

const attrs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)];
for (const match of attrs) {
  const link = match[1];
  if (/^(https?:|mailto:|#)/.test(link)) continue;
  const local = link.split(/[?#]/, 1)[0];
  if (local === "assets/ahmad-ib-profile.jpg" && !existsSync(resolve(root,local))) continue; // Publisher uploads exact original JPG separately.
  assert.ok(existsSync(resolve(root,local)), "Broken local asset: " + local);
}
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(html.includes('id="' + match[1] + '"'), "Broken in-page link " + match[1]);
}
for (const [name,content] of [["HTML",html],["CSS",css],["JavaScript",js]]) {
  assert.ok(!/^\s*\x60\x60\x60/m.test(content), name + " contains copied Markdown code fences");
}
console.log("Portfolio static validation passed: " + projectCount + " projects; " + attrs.length + " references; " + requiredSections.length + " sections.");

// Verify all seven user-supplied workflow illustrations and local image asset.
assert.equal((html.match(/class="workflow-image workflow-image--/g) || []).length, 7, "Expected seven workflow photographs");
assert.ok(css.includes("../assets/workflow-gallery.svg"), "Broken workflow asset path in CSS");
const sprite = read("assets/workflow-gallery.svg");
assert.ok(sprite.includes("data:image/webp;base64,") && sprite.length > 5000, "Workflow photo sprite missing");
assert.ok(!html.includes("Illustrative workflow photography"), "Unwanted gallery disclosure remains");


assert.ok(!html.includes("Illustrative workflow photography. The images do not represent identified team members"),"Unwanted gallery caption remains");
assert.ok(html.includes('id="connect"'),"Social section missing");
for(const network of ["GitHub","LinkedIn","X","Instagram","TikTok","Facebook","Fiverr","Freelancer","YouTube","WhatsApp"]){
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

assert.ok(html.includes("<h3>VAILABLE</h3>"),"VAILABLE document project missing");
assert.ok(html.includes("Find real weaknesses. Prove their impact."),"Security research statement missing");
assert.ok(html.includes("My focus is on practical findings and fixes that help make software safer."),"Research copy update missing");
assert.ok(!html.includes("My ambition is to"),"Outdated research ambition remains");
assert.ok(html.includes("Safwa Quran")&&html.includes("Nayvelo Mobile")&&html.includes("IMarket"),"Existing projects must remain");

const ldOpen='<script type="application/ld+json">';
const ldClose='</script>';
const ldStart=html.indexOf(ldOpen);
const ldEnd=html.indexOf(ldClose,ldStart);
assert.ok(ldStart>=0&&ldEnd>ldStart,"Missing structured person identity");
const identity=JSON.parse(html.slice(ldStart+ldOpen.length,ldEnd));
const personNode=identity["@graph"].find(item=>item["@type"]==="Person");
assert.equal(personNode.name,"Ahmad Ibrahim","Incorrect public name");
assert.equal(personNode.url,"https://ahmadib.onrender.com/profile.html","Wrong primary profile");
assert.ok(personNode.sameAs.includes("https://github.com/AhmadibOfficial"),"Public GitHub identity absent");
assert.ok(!personNode.sameAs.includes("https://metaautomate.onrender.com/"),"Company website incorrectly presented as person profile");
assert.ok(html.includes("Professional profile"),"Profile not linked from homepage");

// Validate canonical identity and the link to the official biography.
await import("./verify-discoverability.mjs");

assert.ok(html.includes('href="https://x.com/AhmadibOfficial"'),"Official X social profile missing");
assert.ok(css.includes(".social-x .social-logo"),"X social icon styling missing");


// Public research index must link to existing published evidence without arrow decoration.
assert.ok(html.includes('class="research-preview-grid"'),"Missing research index");
assert.ok(html.includes("https://ahmadib.onrender.com/articles/redacted-apk-evidence-reports.html"),"Published code-backed article missing");
assert.ok(html.includes("https://ahmadib.onrender.com/#research"),"Dedicated research journal missing");
for(const name of ["exported-android-components","api-authorization-boundaries","android-security-toolkit","intelligence-2026-10-17"]){
 assert.ok(html.includes(name+".html"),"Research article omitted: "+name);
}
assert.ok(!/[↗↖↘↙←→↓↑➜➝➔➤➞⟶⟵]/u.test(html),"Decorative arrow remains on portfolio");


// Site-wide check: enforce arrow-free published pages, not just the homepage.
// Visit all static HTML/CSS/JS/XML/SVG sources (skip build-time test scripts).
const UI_ARROW = /[\u2190-\u21ff\u27a0-\u27bf\u27f0-\u27ff\u2900-\u297f\u2b00-\u2bff]/u;
const NAMED_ARROW = /&(?:larr|rarr|uarr|darr|harr|nearr|searr|swarr|nwarr|leftarrow|rightarrow|LeftArrow|RightArrow|longleftarrow|longrightarrow|LongLeftArrow|LongRightArrow);/iu;
const CSS_ARROW_ESCAPE = /\\0*(?:21[0-9a-f]{2}|27[af][0-9a-f]|29[0-7][0-9a-f]|2b[0-9a-f]{2})(?![0-9a-f])/iu;
const UI_EXTENSIONS = /\.(?:html|css|js|svg|xml)$/i;
function publishedSources(dir) {
  let paths=[];
  for(const entry of readdirSync(dir,{withFileTypes:true})){
    if(entry.isDirectory()){
      if([".git",".github","docs","scripts"].includes(entry.name))continue;
      paths.push(...publishedSources(resolve(dir,entry.name)));
    }else if(entry.isFile()&&UI_EXTENSIONS.test(entry.name)){
      paths.push(resolve(dir,entry.name));
    }
  }
  return paths;
}
const uiFiles=publishedSources(root);
for(const path of uiFiles){
  const source=readFileSync(path,"utf8");
  assert.ok(!UI_ARROW.test(source),"Decorative arrow character in "+path);
  assert.ok(!NAMED_ARROW.test(source),"HTML arrow entity in "+path);
  assert.ok(!CSS_ARROW_ESCAPE.test(source),"CSS arrow escape in "+path);
  for(const entity of source.matchAll(/&#(?:x([0-9a-f]+)|([0-9]+));/gi)){
    const cp=parseInt(entity[1]??entity[2],entity[1]?16:10);
    if(cp>=0 && cp<=0x10ffff){
      assert.ok(!UI_ARROW.test(String.fromCodePoint(cp)),"Encoded arrow entity in "+path);
    }
  }
}
console.log("PASS no decorative arrows across "+uiFiles.length+" published static files.");


// Release copy: clear technical prerequisites without alarm-style or outdated labels.
const oneCallMarkup = html.match(/<article class="download-card"><div class="download-icon">APK<\/div>[\s\S]*?<\/article>/)?.[0];
assert.ok(oneCallMarkup, "OneCall Android download card missing");
for (const term of ["OneCall for Android","Download Android APK","Installation instructions","Verify SHA-256","USB/ADB","backend on your computer"]) {
  assert.ok(oneCallMarkup.includes(term), "OneCall copy must retain: "+term);
}
const visibleCopy = html.replace(/<[^>]*>/g, " ");
assert.ok(!/\b(?:pilot|prerelease|warnings)\b/i.test(visibleCopy), "Outdated status or alarming copy remains in visible portfolio text");
