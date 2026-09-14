const http = require("http"), fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const ROOT = "D:/EDIP/WEBSITE";
const T = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
const srv = http.createServer((q, s) => {
  const u = decodeURIComponent(q.url.split("?")[0]);
  const f = path.join(ROOT, u === "/" ? "index.html" : u);
  fs.readFile(f, (e, b) => {
    e ? (s.writeHead(404), s.end())
      : (s.writeHead(200, { "Content-Type": T[path.extname(f)] || "application/octet-stream" }), s.end(b));
  });
});
const fail = [];
const ok = (c, m) => { console.log((c ? "  ok   " : "  FAIL ") + m); if (!c) fail.push(m); };

srv.listen(0, async () => {
  const base = "http://127.0.0.1:" + srv.address().port + "/";
  const load = u => JSDOM.fromURL(base + u, {
    runScripts: "dangerously", resources: "usable",
    beforeParse(w) {
      w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = () => {};
      w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
    }
  }).then(d => new Promise(r => d.window.addEventListener("load", () => r(d))));

  try {
    const g = {}; global.window = g; require(ROOT + "/assets/js/pricing.js");
    const P = g.EDIS_PRICING;

    console.log("--- canonical record");
    ok(P.PLANS.length === 9, "nine plans (got " + P.PLANS.length + ")");
    ok(P.PLANS.map(p => p.id).join(",") ===
       "explorer,professional,professional_plus,team,sector,ministry,government_enterprise,national,sovereign",
       "plans in the specified order");
    ok(P.plan("explorer").billing === "free", "Explorer is free");
    ok(P.plan("professional").monthlyFrom === 75 && P.plan("professional").monthlyTo === 150,
       "Professional band 75-150 a month");
    ok(P.plan("professional_plus").monthlyFrom === 250 && P.plan("professional_plus").monthlyTo === 400,
       "Professional Plus band 250-400 a month");
    ok(P.plan("explorer").monthlyTo === 25, "Explorer free, with an optional band to 25 a month");
    const pa = P.annualBand(P.plan("professional")), pp = P.annualBand(P.plan("professional_plus"));
    ok(pa.from === 750 && pa.to === 1500, "Professional annual 750-1,500 (got " + pa.from + "-" + pa.to + ")");
    ok(pp.from === 2500 && pp.to === 4000, "Plus annual 2,500-4,000 (got " + pp.from + "-" + pp.to + ")");
    ok(P.plan("team").annualFrom === 12000 && P.plan("team").typical[1] === 25000, "Team 12,000-25,000");
    ok(P.plan("sector").annualFrom === 20000, "Sector from 20,000");
    ok(P.plan("ministry").annualFrom === 35000 && P.plan("ministry").typical[1] === 75000,
       "Ministry 35,000-75,000");
    ok(P.plan("government_enterprise").annualFrom === 120000 &&
       P.plan("government_enterprise").typical[1] === 300000,
       "Government Enterprise 120,000-300,000");
    ok(P.plan("national").annualFrom === 300000 && P.plan("national").typical[1] === 750000,
       "National 300,000-750,000");
    ok(P.plan("sovereign").typical[0] === 750000 && P.plan("sovereign").typical[1] === 1500000,
       "Sovereign 750,000-1,500,000");
    /* the ladder must ascend, or a buyer sees a bigger plan priced below a smaller one */
    const ladder = ["team","sector","ministry","government_enterprise","national","sovereign"];
    let asc = true, prev = 0;
    ladder.forEach(id => { const f = P.plan(id).typical[0]; if (f < prev) asc = false; prev = f; });
    ok(asc, "institutional plan floors ascend across the ladder");
    ok(P.plan("sovereign").billing === "custom", "Sovereign is custom");

    console.log("--- annual savings");
    P.PLANS.filter(p => p.billing === "seat").forEach(p => {
      const s2 = P.annualSaving(p), ab = P.annualBand(p);
      ok(s2.months === 2, p.name + " annual = 2 months free");
      ok(ab.from === p.monthlyFrom * 10 && ab.to === p.monthlyTo * 10,
         p.name + " annual is ten months at both ends of the band");
    });

    console.log("--- development access");
    const d = P.developmentAccess(100000, "low");
    ok(d.low === 40000 && d.high === 60000, "low income 40-60% (got " + d.low + "-" + d.high + ")");
    ok(P.developmentAccess(100000, "high").low === 100000, "high income pays standard price");
    const lm = P.developmentAccess(100000, "lower_mid");
    ok(lm.low === 60000 && lm.high === 80000, "lower-middle 20-40% (got " + lm.low + "-" + lm.high + ")");

    console.log("--- user limits and entitlements");
    ok(P.plan("explorer").users.max === 1 && P.plan("professional").users.max === 1, "individual plans are 1 user");
    ok(P.plan("team").users.max === 25 && P.plan("ministry").users.min === 25, "Team to 25, Ministry from 25");
    ok(P.plan("government_enterprise").users.max === 200, "Government Enterprise to 200 users");
    ok(!P.plan("explorer").entitlements.finex && !P.plan("explorer").entitlements.cdcge,
       "Explorer has no FINEX or CDCGE");
    ok(P.plan("government_enterprise").entitlements.finex === "full" &&
       P.plan("government_enterprise").entitlements.cdcge === "full",
       "Government Enterprise has full FINEX and CDCGE");
    ok(P.plan("professional_plus").entitlements.finex === "limited",
       "Professional Plus FINEX is limited, not full");
    ok(P.FEATURES.length === 25, "25 comparison features (got " + P.FEATURES.length + ")");

    console.log("--- pricing page renders");
    const dom = await load("pricing.html"), doc = dom.window.document;
    ok(doc.querySelectorAll("#plans-individual .plan").length === 3, "3 individual plan cards");
    ok(doc.querySelectorAll("#plans-institutional .plan").length === 4, "4 institutional plan cards");
    ok(doc.querySelectorAll("#plans-national .plan").length === 2, "2 national plan cards");
    ok(doc.querySelectorAll(".plan").length === 9, "9 plan cards in total");
    ok(doc.querySelectorAll(".plan--featured").length === 2, "2 plans visually featured");
    ok(/Recommended for Ministries of Finance/.test(doc.getElementById("plans-institutional").textContent),
       "Government Enterprise carries its badge");
    ok(/Best for advanced analysts/.test(doc.getElementById("plans-individual").textContent),
       "Professional Plus carries its badge");

    console.log("--- billing toggle");
    const amt = doc.querySelectorAll("#plans-individual .plan")[1].querySelector(".amt");
    ok(/75/.test(amt.textContent) && /150/.test(amt.textContent),
       "monthly shows the 75-150 band (got " + amt.textContent + ")");
    doc.querySelectorAll(".billtoggle button")[1]
       .dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
    ok(/750/.test(amt.textContent) && /1,500/.test(amt.textContent),
       "annual shows the 750-1,500 band (got " + amt.textContent + ")");
    ok(/2 months free/.test(doc.getElementById("bill-note").textContent), "annual note states the saving");

    console.log("--- comparison table");
    ok(doc.querySelectorAll("#cmp tbody tr").length === 25,
       "25 comparison rows (got " + doc.querySelectorAll("#cmp tbody tr").length + ")");
    ok(doc.querySelectorAll("#cmp thead th").length === 10, "1 label + 9 plan columns");
    ok(doc.querySelectorAll("#cmp .tipbox").length === 25, "every capability has a tooltip");
    ok(doc.querySelectorAll("#cmp .lim").length > 0 && doc.querySelectorAll("#cmp .cus").length > 0,
       "Limited and Custom markers appear");

    console.log("--- calculator");
    const out = doc.getElementById("calc-out");
    ok(/Indicative estimate/i.test(out.textContent), "estimator carries the non-binding label");
    ok(/subject to EDIS review/i.test(out.textContent), "label names EDIS review");
    ok(/Indicative first year/.test(out.textContent), "first-year total shown");
    ok(/Indicative recurring/.test(out.textContent), "recurring total shown");
    const before = out.textContent;
    doc.getElementById("calc-users").value = "500";
    doc.getElementById("calc-users").dispatchEvent(new dom.window.Event("input"));
    ok(out.textContent !== before, "changing users changes the estimate");
    doc.getElementById("calc-band").value = "high";
    doc.getElementById("calc-band").dispatchEvent(new dom.window.Event("change"));
    const high = out.textContent;
    doc.getElementById("calc-band").value = "low";
    doc.getElementById("calc-band").dispatchEvent(new dom.window.Event("change"));
    ok(out.textContent !== high, "development access changes the estimate");
    ok(/development access applied/i.test(out.textContent), "and says so");

    console.log("--- configurator");
    const cfg = doc.getElementById("cfg-out");
    ok(/Recommended package/.test(cfg.textContent), "configurator shows a recommendation");
    doc.getElementById("cfg-inst").value = "mof";
    doc.getElementById("cfg-inst").dispatchEvent(new dom.window.Event("change"));
    ok(/Ministry of Finance/.test(cfg.textContent), "Ministry of Finance selected");
    ["FINEX", "MTEF", "CDCGE", "Budget Output Engine", "UCSN", "Public Investment"]
      .forEach(m => ok(cfg.textContent.indexOf(m) > -1, "MoF recommendation includes " + m));
    doc.getElementById("cfg-inst").value = "central_bank";
    doc.getElementById("cfg-inst").dispatchEvent(new dom.window.Event("change"));
    ok(/Central Bank/.test(cfg.textContent) && /Financial sector/.test(cfg.textContent),
       "Central Bank recommendation differs");

    console.log("--- FAQ and preserved content");
    ok(doc.querySelectorAll("#faq details").length === 14,
       "14 FAQ entries (got " + doc.querySelectorAll("#faq details").length + ")");
    ok(doc.querySelectorAll("#tiers .card").length === 8, "the 8 original access levels are preserved");
    ok(doc.querySelectorAll("#matrix-body tr").length === 18, "the original 18-row matrix is preserved");

    console.log("--- quote page");
    const dq = await load("request-quote.html?plan=ministry&intent=demo&users=40");
    const qd = dq.window.document;
    ok(qd.getElementById("f-plan").value === "ministry", "plan pre-filled from the query");
    ok(qd.getElementById("f-intent").value === "demo", "intent pre-filled");
    ok(qd.getElementById("f-users").value === "40", "users pre-filled");
    ok(/Request an EDIS demonstration/.test(qd.getElementById("page-title").textContent),
       "title follows intent");
    ok(qd.getElementById("chosen").hidden === false, "the chosen plan is summarised");
    ["country", "institution", "department", "name", "job_title", "email", "phone",
     "users", "modules", "deployment_date", "funding_source", "procurement_method", "comments"]
      .forEach(f => ok(!!qd.querySelector('[name="' + f + '"]'), "procurement field captured: " + f));
    const di = qd.getElementById("f-intent");
    di.value = "donor"; di.dispatchEvent(new dq.window.Event("change"));
    ok(qd.getElementById("wrap-donor").hidden === false, "donor mode reveals the partner field");
    ok(qd.getElementById("wrap-beneficiary").hidden === false, "donor mode reveals the beneficiary field");
    ok(/Fund EDIS for a government/.test(qd.getElementById("page-title").textContent), "donor title");
  } catch (e) {
    console.error("ERROR", e); fail.push(String(e));
  }
  console.log(fail.length ? "\n" + fail.length + " FAILURE(S)" : "\nall assertions passed");
  srv.close(); process.exit(fail.length ? 1 : 0);
});
