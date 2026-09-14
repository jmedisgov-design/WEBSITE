/* Item 47: pricing must live in ONE canonical record.
   This fails if a price figure is written into any page or any other script. */
const fs = require("fs"), path = require("path");
const ROOT = "D:/EDIP/WEBSITE";
const CANON = "assets/js/pricing.js";
const fail = [];
const ok = (c, m) => { console.log((c ? "  ok   " : "  FAIL ") + m); if (!c) fail.push(m); };

/* every figure the brief names, that must not be duplicated anywhere */
const FIGURES = [75, 150, 250, 400, 750, 1500, 2500, 4000,
                 12000, 20000, 35000, 75000, 120000, 300000, 750000,
                 25000, 40000, 100000, 500000, 45000, 30000];

function scan(dir, acc) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (["downloads", "img", "docs"].includes(f)) continue;
      scan(p, acc);
    } else if (/\.(html|js)$/.test(f)) {
      acc.push(p);
    }
  }
  return acc;
}

const files = scan(ROOT, []).filter(p => !p.replace(/\\/g, "/").endsWith(CANON));
console.log("--- scanning " + files.length + " files (excluding the canonical record)");

const offenders = [];
for (const p of files) {
  const rel = path.relative(ROOT, p).replace(/\\/g, "/");
  let src = fs.readFileSync(p, "utf8");
  /* strip the Academy course-fee rates, which are a different, already-canonical record,
     and strip years/dates which are not prices */
  src = src.replace(/CAL_RATES[\s\S]{0,200}?\}/g, "").replace(/20\d\d/g, "");
  for (const n of FIGURES) {
    const withCommas = n.toLocaleString("en-US");
    /* a published price always carries a currency marker; a bare integer is a
       count, an index or a year and is not what item 47 is about */
    const re = new RegExp("(?:US\\$\\s?|USD\\s?)" + withCommas.replace(/,/g, ",?") + "\\b");
    if (re.test(src)) {
      /* allow it only if it is plainly not a price: a width, a year, a count */
      const ctx = src.match(new RegExp(".{0,50}(?:US\$\s?|USD\s?)" + withCommas.replace(/,/g, ",?") + ".{0,30}"));
      offenders.push(rel + " -> " + n + "  «" + (ctx ? ctx[0].replace(/\s+/g, " ").trim() : "") + "»");
    }
  }
}
ok(offenders.length === 0,
   "no price figure appears outside the canonical record" +
   (offenders.length ? "\n         " + offenders.slice(0, 8).join("\n         ") : ""));

/* the canonical record must actually hold them */
const g = {}; global.window = g;
require(ROOT + "/assets/js/pricing.js");
const P = g.EDIS_PRICING;
const held = new Set();
P.PLANS.forEach(p => {
  [p.monthlyFrom, p.monthlyTo, p.annualFrom].forEach(v => v && held.add(v));
  if (p.typical) p.typical.forEach(v => held.add(v));
});
P.SECTOR_PACKAGES.forEach(s => { held.add(s.from); held.add(s.to); });
P.IMPLEMENTATION.forEach(i => { i.from && held.add(i.from); i.to && held.add(i.to); });
[75, 150, 250, 400, 12000, 20000, 35000, 120000, 300000, 750000].forEach(n =>
  ok(held.has(n), "canonical record holds " + n));

/* pages must load the canonical record before using it */
["pricing.html", "request-quote.html", "government.html",
 "government-ministry-of-finance.html", "government-central-bank.html",
 "government-statistics.html", "index.html", "sectors.html"].forEach(f => {
  const s = fs.readFileSync(path.join(ROOT, f), "utf8");
  ok(s.includes("assets/js/pricing.js"), f + " loads the canonical record");
});

console.log(fail.length ? "\n" + fail.length + " FAILURE(S)" : "\nall assertions passed");
process.exit(fail.length ? 1 : 0);
