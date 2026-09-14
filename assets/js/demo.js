/* ===========================================================================
   EDIS public demonstration
   Three registered questions with PRECOMPUTED ILLUSTRATIVE results. Nothing
   here is a policy estimate: the numbers are fixed demonstration values used
   to show the response interface, the model chain and the provenance record.
   No proprietary data and no live model is exposed by this file.
   =========================================================================== */
(function () {
  "use strict";

  var SCENARIOS = [
    {
      id: "Q-AGR-003",
      q: "What would happen if Utopia invested an additional UTD 1 trillion in agriculture?",
      country: "Utopia", region: "National", base: 2024, horizon: 2032,
      scenario: "AGR-CAPEX-1T", currency: "UTD", agent: "Agriculture Agent",
      chain: [
        { name: "FINEX", note: "Fiscal envelope and financing mix" },
        { name: "MTEF", note: "Ceilings and multi-year profile" },
        { name: "Agriculture", note: "Yields, area, value chains" },
        { name: "UCSN", note: "Unit costs and service norms" },
        { name: "PIAS", note: "Project appraisal and ranking" },
        { name: "CDCGE", note: "Economy-wide closure" },
        { name: "Poverty microsimulation", note: "Distributional incidence" },
        { name: "MEL Framework", note: "Results-framework mapping" }
      ],
      kpis: [
        ["GDP", "+0.61%", "up", "by 2032, against baseline"],
        ["Employment", "+1.9%", "up", "184,000 additional jobs"],
        ["Poverty", "-1.1 pp", "up", "headcount, national"],
        ["Imports", "+0.4%", "down", "input and equipment demand"]
      ],
      results: [
        ["Agricultural output", "+7.8%", "Index, 2032 vs baseline"],
        ["Farm household income", "+5.2%", "Mean, rural households"],
        ["Food price index", "-2.4%", "Domestic staples"],
        ["Agricultural exports", "+11.3%", "Value, constant prices"],
        ["Government revenue", "+UTD 214bn", "Cumulative to 2032"],
        ["Recurrent cost created", "UTD 96bn / year", "From 2029"]
      ],
      bars: [["Crops", 42], ["Livestock", 17], ["Agro-processing", 26], ["Irrigation", 9], ["Extension", 6]],
      barFmt: function (v) { return v + "%"; },
      barTitle: "Allocation of the UTD 1 trillion, by programme",
      lines: [
        { name: "Scenario", color: "#3f9b46", points: [[2024, 0], [2025, .09], [2026, .21], [2027, .33], [2028, .44], [2029, .52], [2030, .57], [2031, .60], [2032, .61]] },
        { name: "Baseline", color: "#9fb0bf", points: [[2024, 0], [2025, 0], [2026, 0], [2027, 0], [2028, 0], [2029, 0], [2030, 0], [2031, 0], [2032, 0]] }
      ],
      lineTitle: "GDP deviation from baseline, per cent",
      map: [["Central", 0.9], ["Eastern", 1.4], ["Northern", 1.7], ["Western", 1.2],
            ["West Nile", 1.5], ["Karamoja", 1.9], ["Butopia", 0.8], ["Busoga", 1.3],
            ["Bukedi", 1.5], ["Bugisu", 1.1], ["Teso", 1.6], ["Lango", 1.4],
            ["Acholi", 1.7], ["Ankole", 1.0], ["Kigezi", 1.2], ["Toro", 1.1]],
      mapFmt: function (v) { return "-" + v.toFixed(1) + " pp"; },
      mapTitle: "Poverty headcount change by region, percentage points",
      budget: [
        ["Development budget, agriculture", "UTD 1,000bn", "Additional, phased over four years"],
        ["Recurrent cost created", "UTD 96bn / year", "Extension, maintenance, scheme operation"],
        ["Financing", "60% domestic revenue, 40% concessional", "FINEX financing mix"],
        ["Effect on deficit", "+0.31 pp of GDP", "Peak year 2027"],
        ["Debt path", "+1.4 pp of GDP", "Peak 2029, declining thereafter"]
      ],
      macro: [
        ["GDP", "+0.61%", "2032 deviation from baseline"],
        ["Employment", "+1.9%", "Total, all sectors"],
        ["Agricultural value added", "+7.8%", "Sector"],
        ["Manufacturing value added", "+1.6%", "Agro-processing linkage"],
        ["Exports", "+3.1%", "Total, constant prices"],
        ["Imports", "+0.4%", "Capital and input goods"],
        ["Real wage, unskilled", "+2.2%", "Rural labour market"]
      ],
      poverty: [
        ["National headcount", "-1.1 pp", "From 20.3% to 19.2%"],
        ["Rural headcount", "-1.6 pp", "Concentrated in the north and east"],
        ["Poverty gap", "-0.7 pp", "Depth of poverty"],
        ["Bottom decile income", "+4.1%", "Mean consumption"],
        ["Top decile income", "+0.9%", "Mean consumption"]
      ],
      mel: [
        ["NDP outcome: increased household incomes", "On track", "Rural income +5.2%"],
        ["NDP output: irrigated area expanded", "On track", "+38,000 ha by 2030"],
        ["NDP output: agro-processing capacity", "Partially on track", "Constrained by power supply"],
        ["SDG 1.2 poverty reduction", "Contributing", "-1.1 pp national headcount"],
        ["SDG 2.3 agricultural productivity", "Contributing", "+7.8% output index"]
      ],
      methods: "The additional envelope is entered in FINEX as a development-budget increase with a financing mix, phased by MTEF across four years. The Agriculture model converts programme spending into area, yield and value-chain effects using UCSN unit costs; PIAS ranks the candidate investments and returns a portfolio. CDCGE closes the economy, returning GDP, employment, prices and trade. The poverty microsimulation passes the CDCGE price and income vectors through the household survey. MEL maps outputs onto the national results framework.",
      assume: ["Real prices, 2024 base", "No change in tariff or tax policy", "Absorption capacity at 85 per cent of allocation", "Rainfall at long-run average", "Concessional financing available at current terms"],
      limits: ["Illustrative demonstration values, not a policy estimate", "Sub-national results are modelled at region rather than district level", "Agro-processing constrained by an energy assumption held fixed", "Climate variability is not stochastic in this run"],
      sources: [
        ["Utopia National Household Survey", "UBOS", "2019/20"],
        ["Annual Agricultural Survey", "UBOS", "2022"],
        ["Approved Estimates and Budget Framework Paper", "MoFPED", "2024/25"],
        ["Social Accounting Matrix", "AICTEM", "2022 base"],
        ["Population projections", "UBOS / AICTEM Demography", "2024"]
      ],
      prov: { run: "EDIS-DEMO-2026-0413", ver: "CDCGE 5.1 / Agriculture 3.0 / FINEX 4.2",
              status: "Validated", conf: "Medium-high", time: "Precomputed demonstration record" }
    },

    {
      id: "Q-HLT-007",
      q: "What is the impact of increasing health spending by 20 per cent?",
      country: "Utopia", region: "National", base: 2024, horizon: 2030,
      scenario: "HLT-BUDGET-20", currency: "UTD", agent: "Health Agent",
      chain: [
        { name: "FINEX", note: "Fiscal space check" },
        { name: "MTEF", note: "Ceiling revision by vote" },
        { name: "Health", note: "Coverage, facilities, workforce" },
        { name: "UCSN", note: "Facility and staffing unit costs" },
        { name: "GIS", note: "Siting and catchments" },
        { name: "CDCGE", note: "Economy-wide closure" },
        { name: "Poverty microsimulation", note: "Out-of-pocket incidence" },
        { name: "MEL Framework", note: "Results-framework mapping" }
      ],
      kpis: [
        ["GDP", "+0.42%", "up", "by 2030, against baseline"],
        ["Employment", "+1.2%", "up", "health and induced sectors"],
        ["Poverty", "-0.7 pp", "up", "largely via out-of-pocket costs"],
        ["Expenditure", "+UTD 780bn", "down", "annual, from 2027"]
      ],
      results: [
        ["Outpatient coverage", "+8.4 pp", "Population within standard access"],
        ["Skilled birth attendance", "+6.1 pp", "National"],
        ["New health centres III", "142", "Constructed and equipped"],
        ["Additional nurses and midwives", "9,850", "Trained, deployed and funded"],
        ["Out-of-pocket share", "-5.3 pp", "Of total health expenditure"],
        ["Recurrent cost created", "UTD 512bn / year", "From 2028"]
      ],
      bars: [["Facilities", 34], ["Workforce", 31], ["Commodities", 19], ["Referral transport", 9], ["Systems and data", 7]],
      barFmt: function (v) { return v + "%"; },
      barTitle: "Allocation of the additional health budget",
      lines: [
        { name: "Coverage, scenario", color: "#3f9b46", points: [[2024, 61], [2025, 63], [2026, 65.4], [2027, 67.1], [2028, 68.3], [2029, 69.1], [2030, 69.4]] },
        { name: "Coverage, baseline", color: "#9fb0bf", points: [[2024, 61], [2025, 61.2], [2026, 61.3], [2027, 61.1], [2028, 61.0], [2029, 61.0], [2030, 61.0]] }
      ],
      lineTitle: "Population within standard access to care, per cent",
      map: [["Central", 4.1], ["Eastern", 9.2], ["Northern", 11.4], ["Western", 7.3],
            ["West Nile", 10.8], ["Karamoja", 13.1], ["Butopia", 3.8], ["Busoga", 8.9],
            ["Bukedi", 9.6], ["Bugisu", 7.7], ["Teso", 10.1], ["Lango", 9.8],
            ["Acholi", 11.9], ["Ankole", 6.2], ["Kigezi", 6.8], ["Toro", 7.1]],
      mapFmt: function (v) { return "+" + v.toFixed(1) + " pp"; },
      mapTitle: "Change in population within standard access, percentage points",
      budget: [
        ["Health vote, additional", "+20%", "UTD 780bn per year at steady state"],
        ["Capital share", "43%", "Facilities, equipment, transport"],
        ["Recurrent share", "57%", "Workforce, commodities, operations"],
        ["Recurrent cost created", "UTD 512bn / year", "Permanent, from 2028"],
        ["Effect on deficit", "+0.42 pp of GDP", "Peak year 2028"]
      ],
      macro: [
        ["GDP", "+0.42%", "2030 deviation from baseline"],
        ["Employment", "+1.2%", "Total, all sectors"],
        ["Public services value added", "+4.6%", "Sector"],
        ["Household consumption", "+0.9%", "Real"],
        ["Imports", "+0.6%", "Equipment and pharmaceuticals"],
        ["Real wage, skilled", "+1.4%", "Health labour market tightens"]
      ],
      poverty: [
        ["National headcount", "-0.7 pp", "From 20.3% to 19.6%"],
        ["Catastrophic health expenditure", "-2.9 pp", "Share of households"],
        ["Poverty gap", "-0.4 pp", "Depth of poverty"],
        ["Bottom decile income", "+2.3%", "Effective, after health costs"],
        ["Rural-urban gap", "-1.2 pp", "Access differential"]
      ],
      mel: [
        ["NDP outcome: improved health status", "On track", "Coverage +8.4 pp"],
        ["NDP output: functional health centres III", "On track", "142 new facilities"],
        ["NDP output: health workforce density", "Partially on track", "Training pipeline binds to 2028"],
        ["SDG 3.8 universal health coverage", "Contributing", "Out-of-pocket share -5.3 pp"],
        ["SDG 1.2 poverty reduction", "Contributing", "-0.7 pp headcount"]
      ],
      methods: "The 20 per cent increase is applied to the health vote in MTEF after FINEX confirms the fiscal space. The Health model converts the allocation into service volumes, facility and workforce requirements using UCSN norms and unit costs. GIS sites the new facilities against population and travel-time surfaces and returns coverage by region. CDCGE closes the economy. The poverty microsimulation applies the change in out-of-pocket costs and income to the household survey. MEL maps the outputs onto the results framework.",
      assume: ["Real prices, 2024 base", "Training pipeline expands from 2026", "No change in user-fee policy", "Absorption capacity at 80 per cent in the first two years", "Commodity prices at long-run average"],
      limits: ["Illustrative demonstration values, not a policy estimate", "Workforce supply is modelled at national rather than cadre-by-district level", "Quality of care is not modelled, only access and volume", "Private sector provision is held constant"],
      sources: [
        ["Health Facility Master List", "MoH", "2024"],
        ["Demographic and Health Survey", "UBOS", "2022"],
        ["National Health Accounts", "MoH", "2021/22"],
        ["Approved Estimates", "MoFPED", "2024/25"],
        ["Population projections", "UBOS / AICTEM Demography", "2024"]
      ],
      prov: { run: "EDIS-DEMO-2026-0417", ver: "Health 3.3 / UCSN 3.1 / CDCGE 5.1",
              status: "Validated", conf: "Medium-high", time: "Precomputed demonstration record" }
    },

    {
      id: "Q-BUD-002",
      q: "What is the best allocation of an additional $1 billion development budget?",
      country: "Utopia", region: "National", base: 2024, horizon: 2035,
      scenario: "BUD-OPT-1B", currency: "USD", agent: "Budget Prioritisation Agent",
      chain: [
        { name: "FINEX", note: "Envelope and financing" },
        { name: "MTEF", note: "Phasing across the framework" },
        { name: "Sector models", note: "Agriculture, health, education, energy, transport" },
        { name: "UCSN", note: "Common unit costs" },
        { name: "PIAS", note: "Appraisal, ranking, optimisation" },
        { name: "CDCGE", note: "Economy-wide closure" },
        { name: "Poverty microsimulation", note: "Distributional incidence" },
        { name: "MEL Framework", note: "Results-framework mapping" }
      ],
      kpis: [
        ["GDP", "+1.34%", "up", "by 2035, against baseline"],
        ["Jobs", "+412,000", "up", "net, all sectors"],
        ["Poverty", "-2.3 pp", "up", "national headcount"],
        ["Revenue", "+$186m", "up", "annual, at steady state"]
      ],
      results: [
        ["Recommended: transport", "$265m", "Rural feeder and corridor rehabilitation"],
        ["Recommended: energy", "$220m", "Transmission, last-mile access"],
        ["Recommended: agriculture", "$210m", "Irrigation, agro-processing, extension"],
        ["Recommended: health", "$160m", "Facilities and workforce in underserved districts"],
        ["Recommended: education", "$95m", "Lower-secondary classrooms and teachers"],
        ["Recommended: water", "$50m", "Rural supply in the highest-gap districts"]
      ],
      bars: [["Transport", 265], ["Energy", 220], ["Agriculture", 210], ["Health", 160], ["Education", 95], ["Water", 50]],
      barFmt: function (v) { return "$" + v + "m"; },
      barTitle: "Recommended allocation under the growth-with-equity objective",
      lines: [
        { name: "Optimised allocation", color: "#3f9b46", points: [[2024, 0], [2026, .28], [2028, .66], [2030, .96], [2032, 1.17], [2035, 1.34]] },
        { name: "Pro-rata allocation", color: "#c1611f", points: [[2024, 0], [2026, .19], [2028, .44], [2030, .66], [2032, .81], [2035, .92]] }
      ],
      lineTitle: "GDP deviation from baseline, per cent",
      map: [["Central", 1.2], ["Eastern", 2.6], ["Northern", 3.4], ["Western", 2.1],
            ["West Nile", 3.1], ["Karamoja", 3.9], ["Butopia", 1.1], ["Busoga", 2.5],
            ["Bukedi", 2.8], ["Bugisu", 2.2], ["Teso", 3.0], ["Lango", 2.9],
            ["Acholi", 3.5], ["Ankole", 1.8], ["Kigezi", 2.0], ["Toro", 2.1]],
      mapFmt: function (v) { return "-" + v.toFixed(1) + " pp"; },
      mapTitle: "Poverty headcount change by region, percentage points",
      budget: [
        ["Additional development budget", "$1,000m", "Phased over five years"],
        ["Recurrent cost created", "$118m / year", "Maintenance, staffing, operations"],
        ["Financing", "55% concessional, 45% domestic", "FINEX financing mix"],
        ["Effect on deficit", "+0.48 pp of GDP", "Peak year 2028"],
        ["Debt path", "+2.1 pp of GDP", "Peak 2031, declining thereafter"],
        ["Revenue return", "+$186m / year", "At steady state, 2035"]
      ],
      macro: [
        ["GDP", "+1.34%", "2035 deviation from baseline"],
        ["Employment", "+412,000", "Net jobs, all sectors"],
        ["Manufacturing value added", "+3.2%", "Energy and transport linkage"],
        ["Agricultural value added", "+4.1%", "Irrigation and market access"],
        ["Exports", "+4.4%", "Constant prices"],
        ["Imports", "+1.9%", "Capital goods during construction"],
        ["Real wage, unskilled", "+3.1%", "Labour demand in construction and agriculture"]
      ],
      poverty: [
        ["National headcount", "-2.3 pp", "From 20.3% to 18.0%"],
        ["Rural headcount", "-3.1 pp", "Largest falls in the north"],
        ["Poverty gap", "-1.4 pp", "Depth of poverty"],
        ["Bottom decile income", "+7.6%", "Mean consumption"],
        ["Regional disparity index", "-0.041", "Narrowing, from 0.318"]
      ],
      mel: [
        ["NDP outcome: sustainable industrialisation", "On track", "Manufacturing +3.2%"],
        ["NDP outcome: reduced poverty", "On track", "-2.3 pp headcount"],
        ["NDP output: paved and maintained road network", "On track", "2,140 km rehabilitated"],
        ["NDP output: electricity access", "Partially on track", "Last-mile connections lag the grid build"],
        ["SDG 8.1 economic growth", "Contributing", "GDP +1.34%"],
        ["SDG 10.1 reduced inequality", "Contributing", "Regional disparity narrowing"]
      ],
      methods: "PIAS appraises the candidate pipeline from every sector model on a common basis, using UCSN unit costs and shadow prices. The optimiser allocates the envelope to maximise the stated objective - here growth with an equity constraint on regional distribution - subject to the MTEF phasing, absorption limits and readiness filters. CDCGE closes the economy on the selected portfolio, and the poverty microsimulation returns the distributional incidence. A pro-rata allocation is run alongside as the comparison case.",
      assume: ["Real prices, 2024 base", "Objective: GDP growth with a regional equity constraint", "Absorption capacity at 80 per cent", "Readiness filter excludes projects without completed feasibility", "Concessional financing available at current terms"],
      limits: ["Illustrative demonstration values, not a policy estimate", "The candidate pipeline is a demonstration set, not the actual national pipeline", "Project-level risk is scored, not simulated stochastically", "Political and institutional feasibility is outside the model"],
      sources: [
        ["Public Investment Management Information System", "MoFPED", "2024"],
        ["National Development Plan", "NPA", "Current cycle"],
        ["Utopia National Household Survey", "UBOS", "2019/20"],
        ["Social Accounting Matrix", "AICTEM", "2022 base"],
        ["Sector investment plans", "Sector ministries", "2023-2024"]
      ],
      prov: { run: "EDIS-DEMO-2026-0428", ver: "PIAS 2.2 / CDCGE 5.1 / MTEF 2.9",
              status: "Validated", conf: "Medium", time: "Precomputed demonstration record" }
    }
  ];

  /* ------------------------------------------------------------- run engine */
  /* Animates the typing of a question and then walks the model chain, calling
     back on each state change. Everything is local; nothing is requested. */
  function Runner(scenario, opts) {
    this.s = scenario;
    this.o = opts || {};
    this.timers = [];
    this.states = scenario.chain.map(function () { return "wait"; });
  }

  Runner.prototype.stop = function () {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  };

  Runner.prototype.at = function (ms, fn) {
    this.timers.push(setTimeout(fn, ms));
  };

  Runner.prototype.type = function (done) {
    var self = this, text = this.s.q, i = 0;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { if (this.o.onType) this.o.onType(text, true); return done(); }
    (function step() {
      i += 2;
      if (self.o.onType) self.o.onType(text.slice(0, i), i >= text.length);
      if (i < text.length) self.at(14, step);
      else self.at(320, done);
    })();
  };

  Runner.prototype.walk = function (done) {
    var self = this, n = this.s.chain.length, i = 0;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var step = reduced ? 40 : 420;
    (function next() {
      if (i > 0) self.states[i - 1] = "ok";
      if (i < n) {
        self.states[i] = "run";
        if (self.o.onChain) self.o.onChain(self.states.slice());
        i++;
        self.at(step, next);
      } else {
        if (self.o.onChain) self.o.onChain(self.states.slice());
        self.at(200, done);
      }
    })();
  };

  Runner.prototype.start = function () {
    var self = this;
    this.stop();
    this.states = this.s.chain.map(function () { return "wait"; });
    if (this.o.onReset) this.o.onReset();
    this.type(function () {
      self.walk(function () { if (self.o.onDone) self.o.onDone(self.s); });
    });
  };

  window.EDIS_DEMO = { SCENARIOS: SCENARIOS, Runner: Runner };
})();
