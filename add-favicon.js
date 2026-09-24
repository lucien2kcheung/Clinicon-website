/* Adds favicon <link> tags to every .html file in the repo (after the canonical tag).
   Safe to re-run: skips files that already have rel="icon".
   Run from the repo root:  node add-favicon.js */
const fs = require("fs");
const path = require("path");
const TAGS = [
  '<link rel="icon" href="/favicon.ico" sizes="48x48">',
  '<link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48">',
  '<link rel="icon" type="image/png" href="/favicon-192x192.png" sizes="192x192">',
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
].join("\n");
let changed = 0, skipped = 0, missing = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.name === ".git" || f.name === "node_modules") continue;
    const p = path.join(dir, f.name);
    if (f.isDirectory()) { walk(p); continue; }
    if (!f.name.endsWith(".html")) continue;
    let s = fs.readFileSync(p, "utf8");
    if (s.includes('rel="icon"')) { skipped++; continue; }
    const re = /(<link rel="canonical"[^>]*>)(\r?\n)/;
    if (!re.test(s)) { missing.push(p); continue; }
    s = s.replace(re, (m, tag, nl) => tag + nl + TAGS.split("\n").join(nl) + nl);
    fs.writeFileSync(p, s);
    changed++;
  }
})(".");
console.log(`Updated ${changed}, already had icon ${skipped}, no canonical tag: ${missing.length}`);
missing.forEach(m => console.log("  needs manual edit:", m));
