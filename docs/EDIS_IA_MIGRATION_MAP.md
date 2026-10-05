# EDIS website — information architecture and migration map

October 2026 restructuring. The site is repositioned so that **EDIS is the primary commercial
product** — a subscription-based economic development intelligence platform for governments and
institutions — with **EDIS Academy** as the training, certification and adoption arm, and
**implementation and consulting** as the deployment revenue line. AICTEM remains the institute that
develops and maintains the models, data and analytical infrastructure.

No page, route, download, registry or dataset was removed. Two pages were added and the navigation,
the home page and the positioning were rebuilt around the platform.

---

## Business hierarchy as published

| Layer | Where it is stated |
| --- | --- |
| **AICTEM** — owner and developer of models, data, analytical infrastructure and IP | `about.html#aictem`, `about.html#hierarchy`, footer on every page |
| **EDIS** — primary commercial product, subscription platform | home page, `what-is-edis.html`, `models.html`, `pricing.html` |
| **EDIS Academy** — training, certification, institutional adoption | `academy.html`, `courses.html`, `academy-calendar.html` |
| **Implementation and consulting** — configuration, calibration, integration, deployment | `deploy.html`, `pricing.html#implementation` |

---

## Routes

### Added

| Route | Purpose |
| --- | --- |
| `deploy.html` | Government deployment: the adoption ladder, ministry / enterprise / national tiers, country configuration (`#configuration`), implementation (`#implementation`), integration (`#integration`), development-partner positioning |
| `countries.html` | EDIS country platforms: the eight national data layers, calibration, scope and how a country starts |

### Preserved (unchanged URLs)

`index.html`, `what-is-edis.html`, `how-it-works.html`, `agents.html`, `models.html`, `data.html`,
`gis.html`, `simulations.html`, `reports.html`, `api.html`, `demo.html`, `workspace.html`,
`solutions.html`, `sectors.html`, `government.html`, `government-ministry-of-finance.html`,
`government-central-bank.html`, `government-statistics.html`, `pricing.html`, `request-quote.html`,
`request-demo.html`, `academy.html`, `courses.html`, `academy-calendar.html`, `enrol.html`,
`partners.html`, `resources.html`, `about.html`, `contact.html`, `login.html`, `admin-login.html`,
`admin.html`.

No redirects are required: no route changed and no route was deleted.

### Anchors added

| Anchor | Page | Why |
| --- | --- | --- |
| `#certification` | `academy.html` | Academy nav entry; certification is now a named section |
| `#institutional` | `academy.html` | "Training that supports EDIS adoption" — the Academy's role inside a deployment |
| `#cohorts` | `academy.html` | Government cohort training |
| `#reports` | `resources.html` | Resources nav entry for report formats |
| `#research` | `resources.html` | Research, publications and case studies |
| `#hierarchy` | `about.html` | AICTEM → EDIS → implementation → Academy |
| `#ministry`, `#enterprise`, `#national`, `#configuration`, `#implementation`, `#integration` | `deploy.html` | Deployment nav entries |

---

## Navigation

Before: Technology · Solutions · Academy · Pricing · Resources · About, with "Ask EDIS" as the
masthead call to action.

After:

| Menu | Contents |
| --- | --- |
| **EDIS** | Platform, What EDIS does, Models, Sectors, AI agents, GIS and spatial planning, Reports and analytics, Countries, Data, Simulations, API, Live demonstration |
| **Solutions** | All solutions and the six institution routes (ministries of finance, planning ministries, central banks, sector ministries, development banks, development partners), plus all ten institution types |
| **For governments** | Government overview, ministry deployment, government enterprise, national platform, country configuration, implementation, integration, and the three institution workflow pages |
| **Pricing** | Plans, individual tiers, institutional and ministry, national and sovereign, implementation and services, estimator, configurator, request a quote |
| **Academy** | EDIS Academy, courses, certification, training calendar, government cohorts, institutional training, enrol, training partners |
| **Resources** | All resources, reports, model library and documentation, demonstrations, research and publications, about EDIS, about AICTEM, contact |

Masthead call to action: **Request a demo** (primary) with **Sign in** beside it. Academy no longer
competes for the primary action anywhere on the site.

---

## Home page architecture

1. **Hero** — "EDIS", "Economic Development Intelligence Infrastructure", "From data to decisions.",
   with *Request a demo* and *Explore the platform*, a quiet *Explore EDIS Academy* link, and the
   live demonstration console.
2. **The infrastructure band** — data, economic models, public finance, GIS, AI agents, sector
   planning, simulation, optimization → decisions a government can defend.
3. **What is EDIS?** — the integrated platform, with the four capability cards.
4. **Statistics band** — 21 models, 28 agents, 16 sectors, 9 report formats, 52 economies.
5. **The EDIS workflow** — the eleven-step pipeline from policy question to decision report.
6. **From a policy question to a decision** — the renewable-energy cross-model example and the live
   model chain.
7. **The EDIS model ecosystem** — macro and public finance, public investment and results, sector
   models, distributional analysis, climate and environment.
8. **Sectors** — the sixteen sector sheets.
9. **AI agents** — the eight agent steps, the AI / analytical separation, the question library.
10. **Built for government decision-making** — the six institution routes.
11. **Government deployment** — the adoption ladder.
12. **Pricing** — the four plan band plus subscription / implementation / Academy training / custom
    development.
13. **The adoption funnel** — explore, use, adopt, deploy, integrate, scale, sovereign.
14. **From model results to decision briefs** — the report spine and the provenance record.
15. **Why EDIS** — integrated, evidence-based, cross-sector, spatial, scenario-based, AI-enabled,
    government-oriented, failure is shown.
16. **EDIS Academy** — training that supports adoption, with the next cohorts.
17. **Call to action** — request a demo.

---

## Measurement

`assets/js/app.js` dispatches conversion events on outbound clicks: `request_demo`,
`institutional_inquiry`, `government_deployment_view`, `pricing_view`, `model_view`,
`academy_visit`, `academy_registration`, `signup_start`, `demonstration_open`. Each is emitted as a
DOM event (`edis:event`) and forwarded to `window.dataLayer` or `gtag` **if** the site owner has
installed an analytics tag. No third-party script, cookie or identifier is added by the site.

---

## Verification

- Link, anchor and asset check across all 34 pages: clean, apart from anchors that are generated at
  runtime from the registries (`solutions.html#<institution>`, `models.html#<model>`), which is the
  site's existing pattern.
- Headless-browser sweep of every page: no script errors; the shared shell and every dynamic
  container render.
- `docs/tests/source_of_truth_test.js`: all assertions pass. `pricing_test.js` and `prereq_test.js`
  require `jsdom`, which is not installed in this environment (unchanged by this work).
- No horizontal overflow at 390 px on the home, deployment, pricing, Academy, countries, courses and
  calendar pages.
