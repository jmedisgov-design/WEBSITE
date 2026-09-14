/* Every course whose stated prerequisite is itself on the calendar must start
   after that prerequisite has finished. Front-loading a course must never jump
   it ahead of something it depends on. */
const fs = require("fs");
const CAL = "D:/EDIP/Training/EDIS_Academy/00_Academy_Core/Academy_Calendar/training_calendar_2026_2027.json";
const rows = JSON.parse(fs.readFileSync(CAL, "utf8"));
const fail = [];
const ok = (c, m) => { console.log((c ? "  ok   " : "  FAIL ") + m); if (!c) fail.push(m); };

const byCode = {};
rows.forEach(r => { byCode[r.code] = r; });

/* Pull the REQUIRED course codes out of a prose prerequisite.

   The prose mixes three things, and only the first is a constraint:
     required   "MOD 303 and MOD 304."
     advisory   "MOD 302 is recommended but not required."
     forward    "It should be taken before MAC 202."   (MAC 201 saying what
                 comes after it - the opposite of a prerequisite)
   So read sentence by sentence and drop any sentence that is advisory or
   points forward, rather than truncating at the first advisory word - which
   would leave "MOD 302 is" behind and read it as a requirement. */
const ADVISORY = /recommend|preferab|useful|optional|may be taken|before or after|not required/i;
const FORWARD  = /should be taken before|assume this course|is a prerequisite for|before any of/i;

const codes = t => [...new Set((t.match(/\b[A-Z]{3}\s?\d{3}\b/g) || [])
  .map(x => x.length === 6 ? x.slice(0, 3) + " " + x.slice(3) : x.replace(/\s+/, " ")))];

function required(r) {
  const sentences = (r.prereq || "").split(/(?<=[.;:])\s+/);
  const hard = codes(sentences.filter(s => !ADVISORY.test(s) && !FORWARD.test(s)).join(" "));
  /* a course named in any advisory or forward clause is not a hard requirement,
     even where a later sentence explains it - PIA 404 says PIA 406 "may be taken
     before or after", then says why, and the second sentence must not re-impose it */
  const soft = codes(sentences.filter(s => ADVISORY.test(s) || FORWARD.test(s)).join(" "));
  return hard.filter(c => c !== r.code && byCode[c] && soft.indexOf(c) === -1);
}

console.log("--- prerequisite ordering across all " + rows.length + " cohorts");
let checked = 0, violations = [];
rows.forEach(r => {
  required(r).forEach(p => {
    checked++;
    if (byCode[p].end >= r.start) {
      violations.push(r.code + " (" + r.start + ") starts before " + p + " ends (" + byCode[p].end + ")");
    }
  });
});
ok(violations.length === 0,
   checked + " in-calendar prerequisite links all respected" +
   (violations.length ? "\n         " + violations.join("\n         ") : ""));

console.log("--- the four courses asked for, and what constrains each");
const want = { "MAC 202": "FINEX", "MOD 306": "CDCGE", "HLT 501": "Health", "EDU 501": "Education" };
const sorted = rows.slice().sort((a, b) => a.start < b.start ? -1 : 1);
Object.keys(want).forEach(code => {
  const r = byCode[code];
  const pos = sorted.findIndex(x => x.code === code) + 1;
  const reqs = required(r);
  const blockers = reqs.map(p => p + " ends " + byCode[p].end).join(", ") || "nothing on this calendar";
  console.log("  " + code.padEnd(9) + want[code].padEnd(11) + "starts " + r.start +
              "  #" + pos + " of " + rows.length + "   after: " + blockers);
  /* each must start in the first third of the programme */
  ok(pos <= Math.ceil(rows.length / 3),
     want[code] + " runs in the first third of the programme (position " + pos + ")");
});

/* CDCGE is taught before FINEX, across the two lanes */
ok(byCode["MOD 306"].end < byCode["MAC 202"].start,
   "CDCGE finishes before FINEX starts (" + byCode["MOD 306"].end +
   " -> " + byCode["MAC 202"].start + ")");

/* and CDCGE sits as early as its own chain allows: nothing but its three
   prerequisites and the closures may precede it in its lane */
const lane1 = rows.filter(r => r.lane === byCode["MOD 306"].lane)
                  .sort((a, b) => a.start < b.start ? -1 : 1);
const beforeCdcge = lane1.slice(0, lane1.findIndex(r => r.code === "MOD 306"))
                         .map(r => r.code);
ok(beforeCdcge.join(",") === "MOD 301,MOD 303,MOD 304",
   "only the CGE chain precedes CDCGE in its lane (got " + beforeCdcge.join(",") + ")");

console.log("--- regional hubs");
const hubs = {};
rows.forEach(r => {
  const h = hubs[r.hub] || (hubs[r.hub] = { n: 0, d: 0, w: 0 });
  h.n++; h.d += r.days; h.w += r.weeks;
});
const names = Object.keys(hubs).sort();
ok(names.length === 2 && names.join(",") === "Accra,Nairobi",
   "in-person delivery is split between Accra and Nairobi (got " + names.join(",") + ")");
names.forEach(h => console.log("  " + h.padEnd(9) + hubs[h].n + " sessions, " +
                               hubs[h].d + " contact days, " + hubs[h].w + " weeks on site"));
const [a, b] = names.map(h => hubs[h]);
ok(Math.abs(a.n - b.n) <= 1,
   "sessions split as evenly as " + rows.length + " allows (gap " + Math.abs(a.n - b.n) + ")");
ok(Math.abs(a.d - b.d) <= 5,
   "contact days within five of even (gap " + Math.abs(a.d - b.d) + ")");
ok(rows.every(r => r.hub && r.venue_full && r.venue_full.indexOf(r.hub) > -1),
   "every cohort names its hub and its full venue");

/* neither hub may host two cohorts on overlapping dates */
const byDate = rows.slice().sort((x, y) => x.start < y.start ? -1 : 1);
const dbl = [];
byDate.forEach((x, i) => {
  for (let j = i + 1; j < byDate.length && byDate[j].start <= x.end; j++) {
    if (byDate[j].hub === x.hub) dbl.push(x.code + " / " + byDate[j].code + " both in " + x.hub);
  }
});
ok(dbl.length === 0, "neither hub hosts two cohorts at once" +
   (dbl.length ? "\n         " + dbl.slice(0, 5).join("\n         ") : ""));

/* nothing may spill past the year, and lanes must stay clash-free */
ok(rows.every(r => r.end <= "2027-12-31"), "every cohort still ends inside 2027");
["1", "2"].forEach(ln => {
  const lane = rows.filter(r => r.lane === ln).sort((a, b) => a.start < b.start ? -1 : 1);
  const clash = lane.filter((r, i) => i && lane[i - 1].end >= r.start);
  ok(clash.length === 0, "lane " + ln + " has no internal overlap");
});

console.log(fail.length ? "\n" + fail.length + " FAILURE(S)" : "\nall assertions passed");
process.exit(fail.length ? 1 : 0);
