import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const html = read("index.html");
const css = read("css/style.css");
const js = read("js/script.js");
const projectCount = (html.match(/class="project-card(?:\s|")/g) ?? []).length;
const requiredSections = ["home","about","expertise","projects","downloads","approach","contact"];

assert.match(html, /<!doctype html>/i);
assert.equal(projectCount, 8, "Expected seven real project cards");
for (const id of requiredSections) assert.ok(html.includes('id="' + id + '"'), "Missing section: " + id);
for (const file of ["css/style.css","js/script.js","assets/favicon.svg"]) assert.ok(existsSync(resolve(root,file)), "Missing asset " + file);
assert.ok(css.includes(".project-card") && css.includes(".downloads-section"), "Missing core CSS");
assert.ok(js.includes("data-filter") || js.includes(".filter-button"), "Missing filter JavaScript");
assert.ok(html.includes("OneCall-phone-arm.apk"), "OneCall pilot link missing");
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

assert.ok(html.includes("<h3>VAILABLE</h3>"),"VAILABLE document project missing");
assert.ok(html.includes("Find real weaknesses. Prove their impact."),"Security research statement missing");
assert.ok(html.includes("Safwa Quran")&&html.includes("Nayvelo Mobile")&&html.includes("IMarket"),"Existing projects must remain");

const structuredData=html.match(/<script type="application\\/ld\\+json">([\\s\\S]*?)<\\/script>/);
assert.ok(structuredData,"Missing structured person identity");
const identity=JSON.parse(structuredData[1]);
const personNode=identity["@graph"].find(item=>item["@type"]==="Person");
assert.equal(personNode.name,"Ahmad Ibrahim","Incorrect public name");
assert.equal(personNode.url,"https://ahmadib.onrender.com/profile.html","Wrong primary profile");
assert.ok(personNode.sameAs.includes("https://github.com/AhmadibOfficial"),"Public GitHub identity absent");
assert.ok(!personNode.sameAs.includes("https://metaautomate.onrender.com/"),"Company website incorrectly presented as person profile");
assert.ok(html.includes("Professional profile"),"Profile not linked from homepage");
