/* ===========================================================================
   EDIS Super Admin - preview gate and demonstration metrics

   IMPORTANT, AND DELIBERATE:
   The gate below is a NAVIGATION GATE, NOT SECURITY. It runs in the browser,
   the demonstration credential is printed on the sign-in page, and anyone can
   read this file. It exists so the admin portal is not stumbled into from the
   public site, and so the sign-in step is visible in the prototype.

   Real administrator authentication belongs in the platform services:
   server-side session, role check on every request, and an audit entry per
   action. Nothing here may be relied on to protect anything.

   Every figure in METRICS is a fixed illustrative value. No user, no
   organisation and no run on this page is real.
   =========================================================================== */
(function () {
  "use strict";

  var KEY = "edis.admin.preview";

  /* The demonstration credential is intentionally public - see the note above. */
  var DEMO = {
    email: "admin@aictem.org",
    pass: "edis-admin-2026",
    name: "Platform Administrator",
    initials: "PA",
    role: "Super Admin"
  };

  function unlocked() {
    try { return sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function unlock(email, pass) {
    if (String(email).trim().toLowerCase() !== DEMO.email) return false;
    if (String(pass) !== DEMO.pass) return false;
    try { sessionStorage.setItem(KEY, "1"); } catch (e) { /* private mode */ }
    return true;
  }
  function lock() {
    try { sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ }
  }

  /* ------------------------------------------------------ demonstration data */
  var METRICS = {
    generated: "2026-09-06 08:00 UTC",

    headline: [
      ["Active users", "1,284", "up", "30-day active, all organisations"],
      ["Organisations", "63", "up", "9 government, 54 other"],
      ["Active subscriptions", "58", "up", "5 in renewal negotiation"],
      ["Questions asked", "41,907", "up", "last 30 days"],
      ["Active simulations", "17", "", "queued or running now"],
      ["Reports generated", "2,164", "up", "last 30 days"],
      ["Model failures", "38", "down", "0.6% of runs, last 30 days"],
      ["Training enrolments", "412", "up", "current cohorts"]
    ],

    /* revenue by category, indicative annualised, in USD thousands */
    revenue: [
      ["National platform", 2450],
      ["Ministry", 1310],
      ["Sector", 880],
      ["Institutional", 540],
      ["Enterprise / partner", 470],
      ["Academy", 260],
      ["Professional", 95]
    ],

    agents: [
      ["Budget Prioritisation", 5120], ["Fiscal Policy", 4380], ["Health", 3910],
      ["Macroeconomic", 3640], ["Public Investment", 2870], ["Agriculture", 2410],
      ["Transport", 1980], ["Energy", 1760], ["Poverty Reduction", 1520], ["Climate", 940]
    ],

    models: [
      ["CDCGE", 6840], ["MTEF", 5210], ["FINEX", 4970], ["PIMAPS", 3480],
      ["UCSN", 3120], ["Health", 2660], ["Budget Output Engine", 2240],
      ["Poverty microsimulation", 1810], ["GIS", 1490], ["Transport", 1120]
    ],

    questionsPerDay: [
      { name: "Questions", color: "#123f63", points: [
        [1, 980], [4, 1120], [7, 1340], [10, 1290], [13, 1510],
        [16, 1620], [19, 1440], [22, 1380], [25, 1710], [28, 1660], [30, 1580]
      ]}
    ],

    apiCalls: [
      { name: "API requests", color: "#2e7d39", points: [
        [1, 42], [4, 51], [7, 63], [10, 58], [13, 71],
        [16, 84], [19, 79], [22, 76], [25, 92], [28, 88], [30, 90]
      ]}
    ],

    organisations: [
      ["Ministry of Finance, Utopia", "Government", "National Platform", 84, "Utopia", "Active", "2027-06-30"],
      ["National Planning Authority, Utopia", "Government", "Ministry", 31, "Utopia", "Active", "2027-06-30"],
      ["Central Bank of Utopia", "Government", "Ministry", 22, "Utopia", "Active", "2027-03-31"],
      ["Bureau of Statistics, Utopia", "Government", "Ministry", 27, "Utopia", "Active", "2027-06-30"],
      ["Ministry of Health, Utopia", "Government", "Sector", 19, "Utopia", "Active", "2027-06-30"],
      ["Ministry of Energy, Utopia", "Government", "Sector", 14, "Utopia", "In renewal", "2026-10-31"],
      ["Regional Development Bank", "Development bank", "Enterprise", 46, "Multi-country", "Active", "2027-12-31"],
      ["Continental Research Institute", "Research", "Institutional", 23, "Multi-country", "Active", "2027-01-31"],
      ["University of Utopia", "University", "Academy", 118, "Utopia", "Active", "2027-08-31"],
      ["Northern Economics Advisory", "Consulting", "Institutional", 11, "Utopia", "Suspended", "2026-09-30"]
    ],

    failures: [
      ["EDIS-RUN-2026-4471", "CDCGE", "Non-converged", "Closure rule infeasible at the requested deficit path", "Ministry of Finance, Utopia", "2026-09-05"],
      ["EDIS-RUN-2026-4468", "ICT and digital", "Data missing", "Broadband coverage layer absent for 2026", "Ministry of Energy, Utopia", "2026-09-05"],
      ["EDIS-RUN-2026-4460", "Climate risk", "Model error", "Hazard raster projection mismatch", "Continental Research Institute", "2026-09-04"],
      ["EDIS-RUN-2026-4452", "Minerals", "Data missing", "Commodity price series stale beyond tolerance", "Regional Development Bank", "2026-09-04"],
      ["EDIS-RUN-2026-4441", "CDCGE", "Non-converged", "Elasticity set outside calibration range", "National Planning Authority, Utopia", "2026-09-03"]
    ],

    storage: [
      ["Run results", "412 GB", "68% of allocation"],
      ["Institutional datasets", "1.9 TB", "47% of allocation"],
      ["Generated reports", "86 GB", "22% of allocation"],
      ["Academy laboratories", "310 GB", "51% of allocation"],
      ["Audit and logs", "44 GB", "retained 24 months"]
    ],

    api: [
      ["Ministry of Finance, Utopia", "Indicators, Model results, Scenario runs", "2.1M / 3.0M", "Within quota"],
      ["Regional Development Bank", "Indicators, Model results, Reports", "840k / 1.5M", "Within quota"],
      ["Bureau of Statistics, Utopia", "Indicators, GIS", "1.4M / 1.5M", "Approaching quota"],
      ["Continental Research Institute", "Model results, Forecasts", "220k / 500k", "Within quota"],
      ["Northern Economics Advisory", "Indicators", "0 / 250k", "Key revoked"]
    ],

    academy: [
      ["Currently enrolled", "412"],
      ["Cohorts running", "9"],
      ["Certificates issued, year to date", "1,047"],
      ["Assessment pass rate", "83%"],
      ["Training partners active", "6"]
    ],

    audit: [
      ["2026-09-06 07:41", "Platform Administrator", "Licence extended", "Ministry of Energy, Utopia to 2026-12-31"],
      ["2026-09-05 16:02", "Platform Administrator", "API key revoked", "Northern Economics Advisory"],
      ["2026-09-05 11:19", "Platform Administrator", "Model published", "CDCGE 5.1 to Utopia instance"],
      ["2026-09-04 09:55", "Platform Administrator", "Organisation suspended", "Northern Economics Advisory, non-payment"],
      ["2026-09-03 14:27", "Platform Administrator", "Seat allocation changed", "University of Utopia, 96 to 118"]
    ]
  };

  window.EDIS_ADMIN = {
    DEMO: DEMO,
    METRICS: METRICS,
    unlocked: unlocked,
    unlock: unlock,
    lock: lock
  };
})();
