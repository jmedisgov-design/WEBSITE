# EDIS website

**Economic Development Intelligence System (EDIS)** — a platform of the **African Institute for
Climate, Trade and Economic Modelling (AICTEM)**.

This is the public-facing website and the front-end shell of the authenticated platform, built to
the master brief in `EDIS_Website_Master_Claude_Code_Command.docx`. It is a static site: open
`index.html` in a browser, no build step, no server required.

---

## Design direction

The brief asked for two things at once: the feature set and information architecture of
palantir.com (a product platform sold to institutions, organised around platforms, solutions by
audience, and a visible technical mechanism), and the *format* of aictem.org.

**Format taken from aictem.org** — the site is built on the institute's own house layout so that
EDIS reads as an AICTEM product rather than a separate company:

- Navy `#123f63` / green `#3f9b46` palette, serif (Georgia) headings on a system sans body,
  17px base, the same `--soft` band alternation.
- The same shell: dark topbar with the institute name and social links, sticky white masthead with
  the logo lock-up and dropdown menus, `wrap` at 1200px, eyebrow + `h2` + muted lead section heads,
  bordered card grids, a navy statistics band, and the four-column dark footer.
- The same component vocabulary and class names — `.wrap`, `.eyebrow`, `.card`, `.grid.g2/.g3/.g4`,
  `.btn-primary/.btn-green/.btn-outline/.btn-ghost`, `.sec-soft`, `.stats`, `.pagehead`, `.subnav`,
  `.tag` — so the two sites can converge or merge later without a rewrite.

**Structure taken from palantir.com** — platform pages that explain the mechanism rather than the
benefit; solutions organised by institution type; a visible product surface (the run console, the
model chain, the response interface) instead of stock photography; capability matrices rather than
price cards; and copy that states what the system does and does not do.

**Specific to EDIS** — components that carry the brief's non-negotiables:

| Component | Why it exists |
|---|---|
| `.console` — the Ask EDIS run console | Shows the product working on the home page and the demo, rather than describing it. |
| `.chain` — the model chain | Section 39 of the brief: users must see FINEX complete, CDCGE running, Poverty waiting. The differentiator, made visible. |
| `.prov` — the provenance strip | Section 23: no numerical answer without data source, year, model, version, scenario, run ID, timestamp, parameters, transformations and validation status. |
| `.badge` — status badges | Section 24: READY / PARTIAL / DATA MISSING / MODEL ERROR / RUNNING / NON-CONVERGED / VALIDATED. |
| `.lanes` — the two-lane diagram | Section 47: the AI layer and the AICTEM analytical layer are separated, and the separation is shown on the home page, in the architecture page and in the About page. |
| `.flow`, `.arrowlist` | The eight-stage pipeline and the FINEX → MEL workflow. |
| `.ws` — the workspace shell | Section 9: sidebar, Ask EDIS, scenarios, projects, data, maps, reports, administration. |

---

## Pages

| File | What it is |
|---|---|
| `index.html` | Home. Hero with a live demonstration run console, what EDIS does, statistics band, the eight-stage pipeline, question preview, the cross-model workflow, sector index, audiences, the AI/analytical separation, provenance, Academy and access. |
| `what-is-edis.html` | The platform in plain language, the value proposition, positioning, the six engineering principles, country architecture. |
| `how-it-works.html` | Architecture: the eight-stage pipeline, the twelve routing checks, the FINEX→MEL chain, the job queue and run states, provenance fields, executive and expert modes, security. |
| `agents.html` | Agent explorer — 28 registered agents filterable by group and access level, each with what it does, the questions it answers, the models it calls, the data it uses, its scenarios and its access level. Plus the searchable **question library** (24 registered questions). |
| `models.html` | Model explorer, master–detail. 21 model services with purpose, questions, inputs, outputs, method, scenario options, integrations, version and status. |
| `data.html` | What EDIS organises, dataset quality control, the provenance record, institutional data isolation, open data. |
| `gis.html` | Maps workspace: layers, catchments, travel time, siting, gap analysis, investment mapping, scenario overlays. |
| `simulations.html` | Scenario builder — sixteen shock families, scenario operations, comparison, the run queue and failure behaviour. |
| `reports.html` | Nine report formats, download formats, the mandatory annex, confidence and limitations. |
| `api.html` | Six endpoint families, administrator controls, a request example, and the rule that the API cannot exceed the licence. |
| `solutions.html` | **The Solutions hub** — the single top-level entry that combines what used to be the separate Sectors and Government menus. Three routes in: `#government` (the six government institutions), `#sectors` (all sixteen sector chips), `#institutions` (the ten institution-type sheets: problem → capabilities → example questions → models → outputs → benefit → licence). The institution-type anchors (`#finance`, `#development-banks`, `#universities`, …) are unchanged, so existing deep links still resolve. |
| `government.html` | EDIS for governments — what each institution runs, how a deployment runs, procurement. Detail pages: `government-ministry-of-finance.html`, `government-central-bank.html`, `government-statistics.html`. All four now sit under Solutions in the menu and the breadcrumbs; their URLs are unchanged. |
| `sectors.html` | Sixteen sector and cross-cutting sheets — coverage, questions, models, data and status — as a filterable table and as cards, plus sector-package pricing. Sits under Solutions; the URL is unchanged. |
| `academy.html` | Delivery formats, the fourteen-course table (filterable by length and status), certification, fellowships, laboratories, training partners, enrolment. |
| `courses.html` | Course catalogue, master–detail. **Fourteen courses, one per numbered directory of `D:/EDIP/Training/EDIS_Academy`.** Each shows its length and the reason for it, its four cohorts as cards (Nairobi, Accra, virtual East Africa time, virtual West Africa time) with fees and deadlines, its modules — each expanding to the module's own published summary, learning outcomes, prerequisites and outline — modules still to be written, a day-by-day plan, the certificate and materials counts. Deep-links as `courses.html#C04`; older module links such as `courses.html#MOD_309` open the course containing that module. |
| `academy-calendar.html` | The training year, 15 Jan 2027 (first cohorts Monday 18 Jan) to 25 Jan 2028 — a 55-week grid in four lanes (Nairobi, Accra, virtual East Africa time, virtual West Africa time), coloured by course family, with provisional cohorts hatched. All 56 cohorts filterable by course, place and month, the scheduling rules, closures, certification boards, holiday extensions and the build queue. |
| `enrol.html` | Enrolment. Course and cohort selects, pre-filled from `enrol.html?course=C04&cohort=04-NBO-2704`; the cohort determines the mode and the fee. Older module links (`?course=MOD_309`) select the course that contains the module. |
| `pricing.html` | Eight access levels, an 18-row capability matrix, the configurable-licensing model and its database objects. **No prices are hard-coded.** |
| `resources.html` | Academy resources (catalogue, calendar, `.ics` feed, `.csv` register), platform documentation, case studies and FAQs. The earlier AICTEM publications section and the course technical-manual downloads have both been removed at the client's request. |
| `partners.html` | Training partners, research partners, development institutions and universities. |
| `about.html` | About EDIS, about AICTEM, leadership and governance, continuity with the institute's existing site. |
| `contact.html` | Contact details, routing table and a message form. |
| `demo.html` | Public demonstration. Three registered questions, animated routing and model chain, and the full response interface: Summary, Results, Charts, Maps, Budget, Macro effects, Poverty, MEL, Methods, Data, Downloads — every figure stamped as demonstration data. |
| `request-demo.html` | Demonstration request form with every field the brief specifies. |
| `login.html` | Sign-in and the seven-step product access flow. |
| `workspace.html` | Authenticated workspace preview: sidebar, Ask EDIS with country/region/baseline/horizon/currency/scenario/mode controls and a live run, scenario builder with shock sliders and a live scenario definition, projects, saved analysis, data, maps, reports, organisation administration, the role matrix and usage. |
| `admin-login.html` | Administrator sign-in for the Super Admin portal. Prints the demonstration credential on the page and states plainly that the gate is not security. Linked from `login.html`, not from the public menu; `noindex` and disallowed in `robots.txt`. |
| `admin.html` | **EDIS Super Admin portal** (brief §35–36). Overview KPIs, organisations, subscriptions and revenue by category, usage analytics (most-used agents and models, questions per day), model and data failures with diagnostics, API usage against quota, storage, Academy enrolments and the administrator audit trail. Shows a locked panel unless the sign-in step has been completed in this browser session. |

---

## Assets

| File | What it is |
|---|---|
| `assets/css/style.css` | The whole design system. One file, no preprocessor. |
| `assets/js/app.js` | Site configuration, masthead and footer injection, mobile menu, tab controller, status-badge helper, and SVG chart helpers (`bar`, `line`, `gridMap`, `chain`). The `NAV` array is the single place navigation is defined: **Technology · Sectors · Government · Academy · Pricing · Resources · About**. |
| `assets/js/data.js` | The registries — agents, models, questions, sectors, solutions, access tiers, capability matrix, and the Academy: `COURSES` (catalogue table), `CALENDAR` (one object per cohort), `CAL_LANES`, `CAL_FAMILIES`, `CAL_CLOSED`, `CAL_HOLIDAYS` (Kenya and Ghana), `CAL_BOARDS`, `CAL_RATES` and `CAL_QUEUE`. The Academy blocks are generated — see *Rebuilding the Academy* below. |
| `assets/js/outlines.js` | Each module's own `00_Course_Outline.md`, converted to HTML in full and shown inside its course on `courses.html`. Includes the eight MEL modules. The matching PDFs, where published, are in `assets/downloads/outlines/`. |
| `assets/js/courses.js` | The course registry behind `courses.html` and `enrol.html`: fourteen courses, each carrying its modules with their published summary, outcomes, audience, prerequisites, model and materials counts, plus length, contact-hour allocation per module, day-by-day plan, planned modules and certificate. Generated — do not edit by hand. |
| `assets/js/demo.js` | The three demonstration scenarios and the run engine (typing, chain walk, readout). |
| `assets/img/` | AICTEM logo from `AICTEM_logo_pack` — `logo.png` (masthead), `favicon.png`, and `logo-footer.png`, the transparent mark composited onto the footer navy so it sits flush. |
| `assets/img/icons/` | Social icons. |

Navigation and the footer are injected by `app.js` from the `NAV` and `SITE` objects, so there is
one place to change them. Contact details (`info@aictem.org`, `aictem.org`, Nairobi, the phone
number) also live in `SITE` and are not hard-coded into pages.

---

## Rebuilding the Academy

The catalogue and calendar are generated from the directories, not typed. The rules:

- **One course per numbered directory** in `D:/EDIP/Training/EDIS_Academy` (`01_…` to `14_…`). A
  sub-folder holding `COURSE_VERSION.json` (directly, or one level down) is a module; an empty
  sub-folder is a module still to be written. `Shared_Code`, `Shared_Data` and `_Reference_Library`
  are support folders, not modules.
- **Length, 5 to 10 contact days:** four days plus one per module, bounded 5–10, plus one day where
  the modules average ≥ 50 specified hours. A course with no built modules counts its planned ones.
  Executive Programmes run eight audience tracks side by side, so take the 5-day minimum.
  Result: 01, 02, 03, 04 and 13 run 10 days; 06, 10 and 11 run 7; 05, 07, 08 and 09 run 6; 12 and 14 run 5.
- **Contact time:** 6 hours a day, shared between modules in proportion to their specified hours.
- **Four cohorts per course:** in person in Nairobi, in person in Accra, live virtual on East Africa
  time (UTC+3), live virtual on West Africa time (UTC+0). Each lane holds one cohort at a time; a
  course's cohorts never overlap and start at least four weeks apart, targeted about 13 weeks apart.
- **Holidays:** a cohort skips its hub's weekday public holidays (Kenya for Nairobi and East Africa
  time, Ghana for Accra and West Africa time) and runs on. Eid dates are estimates subject to sighting.
- **Courses with no materials** (11 Industry Modelling, 14 Executive Programmes) are scheduled from
  July 2027 and flagged *In development* — their dates are provisional.
- **Fees:** US$200 a contact day in person, US$80 live virtual.

PFM 206, PFM 209 and MOD 312 are no longer in any directory, so they are not in any course. Their
outline PDFs remain in `assets/downloads/outlines/` but nothing links to them.

---

## Rules the site follows

These come from the brief and are worth keeping when the site is extended:

0. **The admin gate is not authentication.** `assets/js/admin.js` holds a fixed credential,
   checked in the browser and printed on the sign-in page. It keeps the portal out of the way;
   it protects nothing. Administrator access must become a server-side session with a role
   check on every request, an audit entry per action and MFA before this is used for real.
1. **No hard-coded prices.** Access levels describe what a licence includes; commercial terms are
   agreed per institution. `pricing.html` says so explicitly.
2. **No number without provenance.** Every demonstration figure is accompanied by model, version,
   data source, scenario and run ID.
3. **Demonstration data is labelled.** `demo.html` carries a page-level strip, a per-figure
   `.demo-flag`, and copy stating that these are not policy estimates for any country.
4. **No live model, no proprietary data.** Nothing in this front end reaches a model service or a
   dataset. `demo.js` holds fixed illustrative values only.
5. **Failure is shown.** Non-converged and data-missing states appear in the workspace preview and
   in the status system, because hiding them would misrepresent the product.
6. **Country is not hard-coded.** Utopia is the demonstration instance; country, region, year and
   scenario are presented as first-class dimensions throughout.
7. **AICTEM's existing site is preserved.** Publications, research papers, diagnostics and the blog
   link out to `aictem.org` rather than being duplicated here.

---

## Deployment

The site is plain HTML, CSS and JavaScript with no dependencies and no build.

- **Primary domain:** serve this directory at `edisgov.org`, leaving `aictem.org` untouched.
  Existing AICTEM URLs, reports, publications and SEO are unaffected.
- **Redirect:** point `edis.aictem.org` (and `www.edisgov.org`) to `https://edisgov.org` with a
  301 redirect so AICTEM links keep working.

`sitemap.xml`, `robots.txt` and the canonical URLs in the page heads already use
`edisgov.org`. Relative paths are used throughout, so the site also works under any other host.

### Connecting it to the platform

The front end is intentionally separable from the services behind it. When the Genie.jl application
is connected:

1. Replace the form handlers in `login.html`, `request-demo.html` and `contact.html` with posts to
   the platform endpoints.
2. Replace `data.js` with registry endpoints (`/v1/agents`, `/v1/models`, `/v1/questions`), keeping
   the same object shapes so the rendering code is unchanged.
3. Point `workspace.html` at the authenticated session; the run chain, scenario builder and usage
   panels already model the states the job queue emits (`queued`, `running`, `validating`,
   `completed`, `failed`, `non-converged`).
4. Leave `demo.js` as it is. The public demonstration must stay precomputed so that no model or
   dataset is exposed without a licence.

---

## Checks performed

- HTML tag balance and every internal link resolved, across all 22 pages.
- Rendered headless in Chrome at 500, 768, 1024 and 1440px: no horizontal overflow on any page
  (`scrollWidth == clientWidth` at every width).
- Every page's JavaScript executed with no console errors, and every dynamic container
  (agent grid, model explorer, question library, capability matrix, response tabs, charts, model
  chains, scenario definition) confirmed populated.
