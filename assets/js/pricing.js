/* ===========================================================================
   EDIS pricing — the canonical record
   ---------------------------------------------------------------------------
   Every figure the website publishes about price, user limits, quotas,
   entitlements, implementation, training and country adjustment lives here and
   nowhere else. No page contains a price literal; pages render what this file
   says. A test (tests/no_price_literals) fails the build if a figure leaks into
   a page.

   This file is the browser-side mirror of the `pricing_plans`, `pricing_features`,
   `plan_features`, `pricing_addons`, `implementation_packages`,
   `training_packages` and `country_pricing_adjustments` tables defined in
   docs/schema/edis_pricing_schema.sql. When a server exists, this file is
   generated from those tables and stops being edited by hand.

   IMPORTANT — this file is published information, not a security boundary.
   Entitlements are shown so buyers know what a licence includes. They are
   enforced server-side. See docs/EDIS_SUBSCRIPTION_ACCESS_MODEL.md.
   =========================================================================== */
(function () {
  "use strict";

  var CURRENCY = "USD";

  /* ------------------------------------------------------------- entitlements
     Codes the platform authorises against. Mirrors pricing_features.feature_code.
     access: "full" | "limited" | "addon" | "custom" | "none"                */
  var FEATURES = [
    ["public_dashboards",  "Public dashboards",            "Published indicators, sector dashboards and sample simulations, open to anyone."],
    ["edis_ai",            "EDIS AI agents",               "Registered agents that interpret a policy question, route it to the models that can answer it and assemble the workflow."],
    ["saved_scenarios",    "Saved scenarios",              "Scenarios kept against your account or workspace and re-run as assumptions change."],
    ["reports",            "Report generation",            "Generated policy briefs and technical reports, each carrying its models, data, assumptions and run ID."],
    ["data_export",        "Data export",                  "Download results to Excel, Word, PDF and CSV."],
    ["sector_models",      "Sector models",                "The sector planning models: agriculture, health, education, energy, transport, water and the rest."],
    ["finex",              "FINEX",                        "The macroeconomic and fiscal forecasting framework: growth, inflation, external balance and the medium-term macro-fiscal path."],
    ["cdcge",              "CDCGE",                        "The climate-development computable general equilibrium model: economy-wide effects with the economy closed."],
    ["mtef",               "MTEF",                         "Medium-Term Expenditure Framework: ceilings, votes and the allocation of the envelope across the MTEF period."],
    ["budget_output",      "Budget Output Engine",         "Transforms a budget into the physical outputs it is expected to buy."],
    ["ucsn",               "UCSN",                         "The Unit Cost and Service Norm database that prices every sector plan on a common basis."],
    ["public_investment",  "Public Investment (PIMAPS)",   "Public Investment Management, Appraisal and Portfolio System: appraisal, ranking and portfolio selection under a budget constraint."],
    ["mel",                "MEL",                          "Monitoring, Evaluation and Learning: results frameworks, indicators and what the programme actually delivered."],
    ["gis",                "GIS and spatial planning",     "Population, settlements, networks, facilities, hazard and projects — what is needed, where, and who it reaches."],
    ["climate",            "Climate and adaptation",       "Physical climate risk, adaptation appraisal, mitigation and NDC costing."],
    ["advanced_scenarios", "Advanced scenario comparison", "Multi-scenario comparison, sensitivity analysis and switching values across models."],
    ["api",                "API access",                   "Programmatic access to indicators, runs and results, within the licence."],
    ["workspaces",         "Institutional workspaces",     "Shared, access-controlled workspaces with a project history and an audit trail."],
    ["user_management",    "User and role management",     "An institutional administrator who provisions users, sets roles and sees usage."],
    ["custom_data",        "Custom data integration",      "Your own registers, surveys and administrative data, integrated and governed."],
    ["country_calibration","Country calibration",          "The models calibrated to your country's accounts, SAM, prices and parameters."],
    ["training",           "Training",                     "EDIS Academy places, cohorts and institutional programmes."],
    ["support",            "Technical support",            "Support against the licence, with a response commitment."],
    ["dedicated_support",  "Dedicated support team",       "A named account and implementation team."],
    ["national_deployment","National deployment",          "Whole-of-government configuration across ministries, agencies and the statistics office."]
  ];

  /* ------------------------------------------------------------------- plans
     price: null = free, number = per user per period, "from"/"custom" = quoted.
     Mirrors pricing_plans.                                                  */
  var PLANS = [
    {
      id: "explorer", name: "EDIS Explorer", group: "individual",
      tagline: "Open access to the published evidence base",
      billing: "free", monthlyFrom: 0, monthlyTo: 25,
      users: { min: 1, max: 1, label: "1 user" },
      aiQueries: { period: "month", limit: 20, label: "20 questions a month" },
      cta: { label: "Start free", href: "login.html" },
      audience: ["Students", "Researchers", "Journalists", "Public users",
                 "Prospective customers", "Development practitioners"],
      includes: ["Selected public dashboards", "Selected public economic indicators",
                 "Sample sector dashboards", "Sample policy simulations",
                 "Selected EDIS publications", "Limited EDIS AI questions",
                 "Sample reports", "Limited data visualisation",
                 "EDIS Academy course information"],
      excludes: ["Full FINEX", "Full CDCGE", "Confidential national datasets",
                 "Advanced portfolio tools", "Bulk downloads", "Institutional workspaces"],
      entitlements: {
        public_dashboards: "full", edis_ai: "limited", reports: "limited",
        training: "limited"
      }
    },
    {
      id: "professional", name: "EDIS Professional", group: "individual",
      tagline: "The working analyst's licence",
      billing: "seat", monthlyFrom: 75, monthlyTo: 150,
      users: { min: 1, max: 1, label: "1 user" },
      aiQueries: { period: "month", limit: 500, label: "500 questions a month" },
      cta: { label: "Start Professional", href: "request-quote.html?plan=professional&intent=subscribe" },
      audience: ["Economists", "Consultants", "Academics", "Researchers",
                 "Policy analysts", "Independent professionals"],
      includes: ["Full analytical dashboards", "Selected sector modules",
                 "Enhanced EDIS AI agents", "Policy scenario analysis",
                 "Report generation", "Saved scenarios", "Data exports",
                 "Selected model results", "Professional workspace",
                 "Public and licensed datasets, subject to rights"],
      entitlements: {
        public_dashboards: "full", edis_ai: "full", saved_scenarios: "full",
        reports: "full", data_export: "full", sector_models: "limited",
        gis: "limited", support: "limited", training: "limited"
      }
    },
    {
      id: "professional_plus", name: "EDIS Professional Plus", group: "individual",
      tagline: "Macro and cross-sector analysis for the senior analyst",
      badge: "Best for advanced analysts", featured: true,
      billing: "seat", monthlyFrom: 250, monthlyTo: 400,
      users: { min: 1, max: 1, label: "1 user" },
      aiQueries: { period: "month", limit: 2000, label: "2,000 questions a month" },
      cta: { label: "Upgrade to Professional Plus", href: "request-quote.html?plan=professional_plus&intent=subscribe" },
      audience: ["Senior economists", "Economic advisory firms", "Research institutions",
                 "Specialist consultants", "Think tanks"],
      inherits: "professional",
      includes: ["Advanced CDCGE scenario access", "FINEX analytical access",
                 "Expanded sector models", "Public investment analysis",
                 "Budget-output analysis", "Advanced scenario comparison",
                 "Larger data downloads", "More report generation",
                 "Advanced AI agents", "Cross-sector analysis",
                 "Model sensitivity analysis", "Priority technical support"],
      entitlements: {
        public_dashboards: "full", edis_ai: "full", saved_scenarios: "full",
        reports: "full", data_export: "full", sector_models: "full",
        finex: "limited", cdcge: "limited", budget_output: "limited",
        public_investment: "limited", gis: "limited", climate: "limited",
        advanced_scenarios: "full", support: "full", training: "limited"
      }
    },
    {
      id: "team", name: "EDIS Team", group: "institutional",
      tagline: "A shared workspace for a research or advisory team",
      billing: "annual_from", annualFrom: 12000, typical: [12000, 25000],
      users: { min: 10, max: 25, label: "10 users, configurable to 15 or 25",
               options: [10, 15, 25] },
      aiQueries: { period: "month", limit: null, label: "Pooled across the team" },
      cta: { label: "Request team quote", href: "request-quote.html?plan=team&intent=quote" },
      audience: ["Research institutes", "NGOs", "Universities", "Consulting firms",
                 "Small public agencies"],
      includes: ["Shared institutional workspace", "Team scenario library",
                 "Administrator account", "Sector modelling", "EDIS AI", "Reports",
                 "Shared data", "Basic API usage", "Technical support",
                 "Training credits"],
      entitlements: {
        public_dashboards: "full", edis_ai: "full", saved_scenarios: "full",
        reports: "full", data_export: "full", sector_models: "limited",
        gis: "limited", mel: "limited", advanced_scenarios: "limited",
        api: "limited", workspaces: "full", user_management: "full",
        support: "full", training: "limited"
      }
    },
    {
      id: "sector", name: "EDIS Sector", group: "institutional",
      tagline: "One line ministry, its model and its data",
      billing: "annual_from", annualFrom: 20000, typical: [20000, 50000],
      users: { min: 10, max: 25, label: "10 to 25 users" },
      aiQueries: { period: "month", limit: null, label: "Pooled across the institution" },
      cta: { label: "Configure sector package", href: "pricing.html#configurator" },
      audience: ["Line ministries", "Specialist institutions", "Sector agencies"],
      includes: ["The relevant sector model", "EDIS sector AI agents", "Sector dashboard",
                 "Sector data", "Scenario analysis", "Costing", "Budget linkage",
                 "GIS where relevant", "MEL", "CDCGE linkage", "Reporting",
                 "Sector training"],
      entitlements: {
        public_dashboards: "full", edis_ai: "full", saved_scenarios: "full",
        reports: "full", data_export: "full", sector_models: "full",
        cdcge: "limited", ucsn: "full", mtef: "limited", mel: "full",
        gis: "full", advanced_scenarios: "full", api: "limited",
        workspaces: "full", user_management: "full", custom_data: "limited",
        country_calibration: "limited", training: "full", support: "full"
      }
    },
    {
      id: "ministry", name: "EDIS Ministry", group: "institutional",
      tagline: "A ministry's planning, budgeting and investment estate",
      billing: "annual_from", annualFrom: 35000, typical: [35000, 75000],
      users: { min: 25, max: 50, label: "25 to 50 users" },
      aiQueries: { period: "month", limit: null, label: "Pooled across the ministry" },
      cta: { label: "Request ministry demo", href: "request-quote.html?plan=ministry&intent=demo" },
      audience: ["Ministries of Finance", "Planning ministries", "Sector ministries",
                 "Public investment authorities", "Central government agencies"],
      includes: ["Institutional workspace", "Ministry dashboards", "Sector models",
                 "Budget analysis", "Public investment analysis", "MEL", "GIS",
                 "Advanced EDIS agents", "Institutional reporting",
                 "Controlled data access", "User-role management", "Training",
                 "Implementation support"],
      entitlements: {
        public_dashboards: "full", edis_ai: "full", saved_scenarios: "full",
        reports: "full", data_export: "full", sector_models: "full",
        finex: "limited", cdcge: "limited", mtef: "full", budget_output: "full",
        ucsn: "full", public_investment: "full", mel: "full", gis: "full",
        climate: "limited", advanced_scenarios: "full", api: "limited",
        workspaces: "full", user_management: "full", custom_data: "full",
        country_calibration: "full", training: "full", support: "full"
      }
    },
    {
      id: "government_enterprise", name: "EDIS Government Enterprise", group: "institutional",
      tagline: "The national macro-fiscal and planning estate, whole",
      badge: "Recommended for Ministries of Finance & Central Banks",
      flagship: true, featured: true,
      billing: "annual_from", annualFrom: 120000, typical: [120000, 300000],
      users: { min: 50, max: 200, label: "50 to 200 users, by contract" },
      aiQueries: { period: "month", limit: null, label: "Institutional fair use" },
      cta: { label: "Request government demo", href: "request-quote.html?plan=government_enterprise&intent=demo" },
      audience: ["Ministries of Finance", "Ministries of Planning", "Central Banks",
                 "Statistics Offices", "National policy institutions"],
      includes: ["FINEX", "MTEF", "CDCGE", "Budget Output Engine", "UCSN",
                 "Public Investment Management", "Climate", "Trade", "Sector models",
                 "MEL", "GIS", "EDIS AI agents", "Advanced reports",
                 "Institutional APIs", "Scenario management", "Government workspaces",
                 "Dedicated implementation support", "Staff onboarding",
                 "Model configuration", "Technical training", "Annual model review",
                 "Priority support", "Institutional administration",
                 "Secure data integration"],
      entitlements: {
        public_dashboards: "full", edis_ai: "full", saved_scenarios: "full",
        reports: "full", data_export: "full", sector_models: "full",
        finex: "full", cdcge: "full", mtef: "full", budget_output: "full",
        ucsn: "full", public_investment: "full", mel: "full", gis: "full",
        climate: "full", advanced_scenarios: "full", api: "full",
        workspaces: "full", user_management: "full", custom_data: "full",
        country_calibration: "full", training: "full", support: "full",
        dedicated_support: "full"
      }
    },
    {
      id: "national", name: "EDIS National Platform", group: "national",
      tagline: "Whole-of-government economic decision infrastructure",
      billing: "annual_from", annualFrom: 300000, typical: [300000, 750000],
      users: { min: 200, max: null, label: "200 to 1,000+ users" },
      aiQueries: { period: "month", limit: null, label: "Custom fair-use arrangement" },
      cta: { label: "Discuss national deployment", href: "request-quote.html?plan=national&intent=national" },
      audience: ["Whole-of-government implementations", "Multiple ministries",
                 "Departments and agencies", "Statistics offices", "Planning agencies",
                 "Central bank integration"],
      includes: ["National EDIS configuration", "FINEX", "MTEF", "CDCGE",
                 "All purchased sectors", "Public investment", "Budget", "MEL", "GIS",
                 "National data warehouse connectivity", "National dashboards",
                 "Role-based access", "API integrations", "EDIS AI",
                 "Institutional training", "Technical support"],
      entitlements: {
        public_dashboards: "full", edis_ai: "full", saved_scenarios: "full",
        reports: "full", data_export: "full", sector_models: "full",
        finex: "full", cdcge: "full", mtef: "full", budget_output: "full",
        ucsn: "full", public_investment: "full", mel: "full", gis: "full",
        climate: "full", advanced_scenarios: "full", api: "full",
        workspaces: "full", user_management: "full", custom_data: "full",
        country_calibration: "full", training: "full", support: "full",
        dedicated_support: "full", national_deployment: "full"
      }
    },
    {
      id: "sovereign", name: "EDIS Sovereign Premium", group: "national",
      tagline: "EDIS as core national economic-management infrastructure",
      billing: "custom", annualFrom: 750000, typical: [750000, 1500000],
      users: { min: null, max: null, label: "Custom" },
      aiQueries: { period: "month", limit: null, label: "Custom" },
      cta: { label: "Contact the EDIS team", href: "request-quote.html?plan=sovereign&intent=sovereign" },
      audience: ["Governments requiring EDIS as core national economic-management infrastructure"],
      inherits: "national",
      includes: ["Extensive national customisation", "Dedicated infrastructure",
                 "Advanced security", "Customised national datasets", "Custom models",
                 "Additional CDCGE calibration", "FINEX customisation",
                 "Model integration", "Government data pipelines", "API integrations",
                 "Custom reports", "Custom EDIS agents", "Dedicated account team",
                 "Priority development", "Institutional capacity building",
                 "Annual economic modelling programme"],
      entitlements: {
        public_dashboards: "full", edis_ai: "full", saved_scenarios: "full",
        reports: "full", data_export: "full", sector_models: "full",
        finex: "custom", cdcge: "custom", mtef: "full", budget_output: "full",
        ucsn: "full", public_investment: "full", mel: "full", gis: "full",
        climate: "full", advanced_scenarios: "full", api: "full",
        workspaces: "full", user_management: "full", custom_data: "custom",
        country_calibration: "custom", training: "full", support: "full",
        dedicated_support: "full", national_deployment: "custom"
      }
    }
  ];

  /* ------------------------------------------------------------ sector bands
     EDIS Sector is priced by the sector's model estate and data burden.     */
  var SECTOR_PACKAGES = [
    { id: "energy",      name: "EDIS Energy",      from: 35000, to: 50000, models: ["Energy system", "PyPSA", "CDCGE linkage", "GIS", "MEL"] },
    { id: "transport",   name: "EDIS Transport",   from: 35000, to: 50000, models: ["Transport network", "Accessibility", "CDCGE linkage", "GIS", "MEL"] },
    { id: "agriculture", name: "EDIS Agriculture", from: 30000, to: 45000, models: ["Agriculture", "UCSN", "CDCGE linkage", "GIS", "MEL"] },
    { id: "health",      name: "EDIS Health",      from: 25000, to: 40000, models: ["Health", "UCSN", "PIMAPS", "GIS", "MEL"] },
    { id: "education",   name: "EDIS Education",   from: 25000, to: 40000, models: ["Education cohort", "UCSN", "GIS", "MEL"] },
    { id: "water",       name: "EDIS Water",       from: 25000, to: 40000, models: ["Water", "UCSN", "GIS", "MEL"] },
    { id: "climate",     name: "EDIS Climate",     from: 30000, to: 45000, models: ["Climate risk", "Adaptation", "Mitigation and NDC", "CDCGE linkage"] },
    { id: "trade",       name: "EDIS Trade",       from: 25000, to: 40000, models: ["Gravity trade", "MRIO", "CDCGE linkage"] },
    { id: "ict",         name: "EDIS ICT",         from: 20000, to: 35000, models: ["ICT infrastructure", "UCSN", "GIS"] },
    { id: "industry",    name: "EDIS Industry",    from: 20000, to: 35000, models: ["Industrial policy", "Input-output", "CDCGE linkage"] },
    { id: "minerals",    name: "EDIS Minerals",    from: 20000, to: 35000, models: ["Minerals", "Fiscal regime", "CDCGE linkage"] },
    { id: "forestry",    name: "EDIS Forestry",    from: 20000, to: 35000, models: ["Forestry", "Land use", "Climate linkage", "GIS"] }
  ];

  /* ---------------------------------------------------------------- add-ons */
  var ADDONS = [
    { id: "extra_sector",   name: "Additional sector",              from: 10000, to: 25000, unit: "year" },
    { id: "advanced_gis",   name: "Advanced GIS",                   custom: true },
    { id: "data_integration", name: "Additional national data integration", custom: true },
    { id: "advanced_cdcge", name: "Advanced CDCGE calibration",     custom: true },
    { id: "custom_agents",  name: "Custom EDIS agents",             custom: true },
    { id: "custom_api",     name: "Custom API integration",         custom: true },
    { id: "dedicated_cloud",name: "Dedicated cloud environment",    custom: true },
    { id: "premium_support",name: "Premium support",                custom: true }
  ];

  /* ----------------------------------------------------- implementation fees
     Charged once, separately from the subscription.                        */
  var IMPLEMENTATION = [
    { plan: "professional",         from: 0,      to: 0,      label: "Included" },
    { plan: "professional_plus",    from: 0,      to: 0,      label: "Included" },
    { plan: "team",                 from: 0,      to: 0,      label: "Minimal or included" },
    { plan: "sector",               from: 10000,  to: 25000,  label: "One-time" },
    { plan: "ministry",             from: 20000,  to: 50000,  label: "One-time" },
    { plan: "government_enterprise",from: 40000,  to: 100000, label: "One-time" },
    { plan: "national",             from: 150000, to: 500000, label: "One-time, from" },
    { plan: "sovereign",            custom: true,             label: "Custom" }
  ];

  var IMPLEMENTATION_INCLUDES = [
    "Country configuration", "Data setup", "Institutional account setup",
    "User-role configuration", "Model setup", "Calibration", "API integration",
    "Training", "Deployment", "Testing"
  ];

  /* --------------------------------------------------------------- training
     The per-participant bands. The dated EDIS Academy cohort fees live in
     data.js as CAL_RATES and are the authority for a specific cohort.      */
  var TRAINING = [
    { id: "online",     name: "Online courses",              from: 300,   to: 750,   unit: "participant" },
    { id: "advanced",   name: "Advanced model courses",      from: 1000,  to: 2500,  unit: "participant" },
    { id: "cohort",     name: "Government cohort training",  from: 15000, to: 40000, unit: "cohort" },
    { id: "custom",     name: "Custom institutional training", custom: true }
  ];

  var TRAINING_TOPICS = ["FINEX", "CDCGE", "MTEF", "Public Investment", "Energy and PyPSA",
                         "Health", "Education", "Agriculture", "Transport", "Climate",
                         "GIS", "MEL", "EDIS AI"];

  /* ------------------------------------------------- development access
     Published as Development Access Pricing. Never as country-cheapness.   */
  var COUNTRY_BANDS = [
    { id: "low",    name: "Low income",          discount: [0.40, 0.60] },
    { id: "lower_mid", name: "Lower-middle income", discount: [0.20, 0.40] },
    { id: "upper_mid", name: "Upper-middle income", discount: [0.10, 0.20] },
    { id: "high",   name: "High income",         discount: [0, 0] }
  ];

  /* ------------------------------- recommended packages by institution type */
  var INSTITUTION_PACKAGES = [
    { id: "mof", name: "Ministry of Finance", plan: "government_enterprise",
      modules: ["finex", "mtef", "cdcge", "budget_output", "ucsn", "public_investment", "mel", "edis_ai"] },
    { id: "central_bank", name: "Central Bank", plan: "government_enterprise",
      modules: ["finex", "cdcge", "trade", "macro_forecasting", "financial_sector", "edis_ai"] },
    { id: "statistics", name: "Statistics Bureau", plan: "government_enterprise",
      modules: ["data_platform", "national_accounts", "household_data", "cdcge_calibration", "edis_ai"] },
    { id: "planning", name: "Ministry of Planning", plan: "ministry",
      modules: ["mtef", "public_investment", "cdcge", "mel", "gis", "edis_ai"] },
    { id: "energy", name: "Ministry of Energy", plan: "sector",
      modules: ["energy", "pypsa", "cdcge", "mtef", "public_investment", "gis", "mel"] },
    { id: "health", name: "Ministry of Health", plan: "sector",
      modules: ["health", "ucsn", "public_investment", "gis", "mel", "edis_ai"] },
    { id: "education", name: "Ministry of Education", plan: "sector",
      modules: ["education", "ucsn", "public_investment", "gis", "mel", "edis_ai"] },
    { id: "agriculture", name: "Ministry of Agriculture", plan: "sector",
      modules: ["agriculture", "ucsn", "cdcge", "gis", "mel", "edis_ai"] },
    { id: "research", name: "Research institute or university", plan: "team",
      modules: ["cdcge", "sector_models", "data_platform", "edis_ai"] },
    { id: "consulting", name: "Consulting or advisory firm", plan: "team",
      modules: ["sector_models", "public_investment", "edis_ai", "reports"] }
  ];

  /* Modules offered in the configurator, beyond the entitlement codes above. */
  var CONFIGURATOR_MODULES = [
    ["finex", "Macro & Fiscal (FINEX)"], ["mtef", "Budget (MTEF)"],
    ["public_investment", "Public Investment"], ["climate", "Climate"],
    ["trade", "Trade"], ["energy", "Energy"], ["health", "Health"],
    ["education", "Education"], ["agriculture", "Agriculture"], ["water", "Water"],
    ["transport", "Transport"], ["ict", "ICT"], ["forestry", "Forestry"],
    ["industry", "Industry"], ["minerals", "Minerals"], ["poverty", "Poverty"],
    ["gis", "GIS"], ["mel", "MEL"], ["cdcge", "CDCGE"], ["ucsn", "UCSN"],
    ["budget_output", "Budget Output Engine"], ["edis_ai", "EDIS AI agents"],
    ["macro_forecasting", "Macro forecasting"], ["financial_sector", "Financial sector"],
    ["data_platform", "Data platform"], ["national_accounts", "National accounts"],
    ["household_data", "Household data"], ["cdcge_calibration", "CDCGE calibration tools"],
    ["pypsa", "PyPSA power system"], ["sector_models", "Sector models"],
    ["reports", "Reports"]
  ];

  /* ------------------------------------------------------- procurement modes */
  var PROCUREMENT_INTENTS = [
    ["quote",     "Request a quote"],
    ["proforma",  "Request a proforma invoice"],
    ["proposal",  "Request a formal proposal"],
    ["demo",      "Request a demonstration"],
    ["sandbox",   "Request a sandbox demonstration"],
    ["procurement", "Contact the procurement team"],
    ["donor",     "Donor-supported deployment"],
    ["subscribe", "Start a subscription"],
    ["national",  "Discuss national deployment"],
    ["sovereign", "Contact the EDIS team"]
  ];

  var FUNDING_SOURCES = ["Government budget", "Development partner / donor",
                         "Project financing", "Institutional own funds",
                         "Mixed government and donor", "Not yet identified"];

  var PROCUREMENT_METHODS = ["Direct procurement", "Restricted tender", "Open tender",
                             "Framework agreement", "Development-partner procurement",
                             "Sole source / proprietary", "Not yet determined"];

  var DONOR_PARTNERS = ["World Bank", "African Development Bank", "UNDP",
                        "European Union", "FCDO", "GIZ", "Foundation",
                        "Regional institution", "Other development partner"];

  var CONTACT = { email: "info@edisgov.org", website: "edisgov.org", org: "EDIS" };

  /* ------------------------------------------------------------------ helpers */
  function plan(id) {
    for (var i = 0; i < PLANS.length; i++) if (PLANS[i].id === id) return PLANS[i];
    return null;
  }

  function money(n) {
    return "US$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /* Seat plans are published as an indicative band, not a single figure. Annual
     billing is ten months of the same band, so a year costs ten months and the
     buyer gets two months free at either end of the range. */
  var ANNUAL_MONTHS = 10;

  function annualBand(p) {
    if (p.billing !== "seat") return null;
    return { from: p.monthlyFrom * ANNUAL_MONTHS, to: p.monthlyTo * ANNUAL_MONTHS };
  }

  /* What annual billing saves against twelve monthly payments. */
  function annualSaving(p) {
    if (p.billing !== "seat") return null;
    var a = annualBand(p);
    return { from: p.monthlyFrom * 12 - a.from, to: p.monthlyTo * 12 - a.to,
             months: 12 - ANNUAL_MONTHS,
             pct: Math.round((12 - ANNUAL_MONTHS) / 12 * 100) };
  }

  /* A band as a string: one figure when the ends coincide, otherwise a range. */
  function band(lo, hi) {
    return lo === hi ? money(lo) : money(lo) + " to " + money(hi);
  }

  /* The published price of a plan, as a string, for a given billing period. */
  function priceLabel(p, period) {
    if (p.billing === "free") {
      return p.monthlyTo ? "Free, or up to " + money(p.monthlyTo) + " / month" : "Free";
    }
    if (p.billing === "custom") return "Custom";
    if (p.billing === "seat") {
      var a = annualBand(p);
      return period === "annual"
        ? band(a.from, a.to) + " / user / year"
        : band(p.monthlyFrom, p.monthlyTo) + " / user / month";
    }
    return "From " + money(p.annualFrom) + " / year";
  }

  /* Development access: a band's discount applied to a figure, as a range. */
  function developmentAccess(amount, bandId) {
    var b = null, i;
    for (i = 0; i < COUNTRY_BANDS.length; i++) {
      if (COUNTRY_BANDS[i].id === bandId) b = COUNTRY_BANDS[i];
    }
    if (!b) return { low: amount, high: amount, band: null };
    return { low: Math.round(amount * (1 - b.discount[1])),
             high: Math.round(amount * (1 - b.discount[0])), band: b };
  }

  window.EDIS_PRICING = {
    currency: CURRENCY,
    FEATURES: FEATURES, PLANS: PLANS, SECTOR_PACKAGES: SECTOR_PACKAGES,
    ADDONS: ADDONS, IMPLEMENTATION: IMPLEMENTATION,
    IMPLEMENTATION_INCLUDES: IMPLEMENTATION_INCLUDES,
    TRAINING: TRAINING, TRAINING_TOPICS: TRAINING_TOPICS,
    COUNTRY_BANDS: COUNTRY_BANDS, INSTITUTION_PACKAGES: INSTITUTION_PACKAGES,
    CONFIGURATOR_MODULES: CONFIGURATOR_MODULES,
    PROCUREMENT_INTENTS: PROCUREMENT_INTENTS, FUNDING_SOURCES: FUNDING_SOURCES,
    PROCUREMENT_METHODS: PROCUREMENT_METHODS, DONOR_PARTNERS: DONOR_PARTNERS,
    CONTACT: CONTACT,
    plan: plan, money: money, annualSaving: annualSaving,
    annualBand: annualBand, band: band, ANNUAL_MONTHS: 10,
    priceLabel: priceLabel, developmentAccess: developmentAccess
  };
})();
