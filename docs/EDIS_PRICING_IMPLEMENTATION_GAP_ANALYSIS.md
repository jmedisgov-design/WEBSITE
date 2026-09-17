# EDIS pricing — implementation gap analysis

**Step 2 of the implementation sequence. Written before any file was modified.**
Date: 6 September 2026. Scope inspected: the whole of `D:/EDIP/WEBSITE`.

---

## 1. The finding that shapes everything else

**This website has no backend.** It is a static site, exactly as its own README states:
*"It is a static site: open `index.html` in a browser, no build step, no server required."*

Evidence from inspection:

| Looked for | Found |
|---|---|
| `package.json`, `node_modules` | none |
| Server, API directory, `Dockerfile`, `.env` | none |
| Database, migrations, ORM (prisma/sequelize/knex) | none |
| `fetch(`, `XMLHttpRequest`, `axios` anywhere in the site | **zero occurrences** |
| Authentication service | none — `login.html` is a preview form |
| Payment provider | none |
| Build step | none |

`login.html` says so in its own copy: *"role-based access control are enforced by the platform
services, not in the browser."* The sign-in form does not authenticate; it shows a note and links
to `workspace.html`, which is a static preview of an authenticated workspace.

Every form on the site (`request-demo.html`, `contact.html`, `enrol.html`) follows one pattern:
prevent submit, assemble the fields, and compose a `mailto:info@aictem.org` link. Nothing posts.

### What this means for the brief

The brief asks for a database schema, a backend entitlement engine, enforced user and AI-query
limits, an admin pricing console, a payment abstraction, a persistent quotation workflow, CRM
storage and an analytics dashboard. **None of those can be working software on a static site.**
Building a fake admin console that writes to `localStorage`, or a "backend entitlement engine"
that runs in the browser, would be worse than not building them: it would look like enforcement
while enforcing nothing, which is precisely the failure mode item 31 warns against
(*"Do not rely only on hidden frontend buttons"*).

The approach taken is therefore:

- **Build for real** everything the static site can genuinely do — the canonical pricing source of
  truth, every public page, the comparison table, the calculator, the configurator, the government
  solution pages, the quote and demo capture, the sector and homepage integration, and the tests.
- **Specify precisely** what needs a server — as a SQL schema, an entitlement contract and written
  documentation, so the backend team implements against a definition rather than a guess.
- **Never simulate enforcement.** Access control is documented as a server responsibility. The
  site presents entitlements as published information, not as a security boundary.

Each item in section 4 is marked accordingly.

---

## 2. What already exists, and must be preserved

### Routes (all flat `.html` at the site root — the site has no path-based routing)

`index.html`, `what-is-edis.html`, `how-it-works.html`, `agents.html`, `models.html`, `data.html`,
`gis.html`, `simulations.html`, `reports.html`, `api.html`, `solutions.html`, `sectors.html`,
`academy.html`, `courses.html`, `academy-calendar.html`, `enrol.html`, `pricing.html`,
`resources.html`, `partners.html`, `about.html`, `contact.html`, `demo.html`,
`request-demo.html`, `login.html`, `workspace.html`.

**Decision on URLs.** The brief asks for `/edis/pricing`, `/edis/government`,
`/edis/government/ministry-of-finance`, `/edis/government/central-bank`, `/edis/government/statistics`.
The site has no router and no server to rewrite paths; creating directories would break the
"open index.html, no server required" property and orphan the flat-file convention every other
page follows. The brief also permits preserving an existing pricing URL. So:

| Brief route | Implemented as | Why |
|---|---|---|
| `/edis/pricing` | **`pricing.html`** (preserved) | Already exists, already in the sitemap and nav |
| `/edis/government` | `government.html` | Matches the site's flat convention |
| `/edis/government/ministry-of-finance` | `government-ministry-of-finance.html` | " |
| `/edis/government/central-bank` | `government-central-bank.html` | " |
| `/edis/government/statistics` | `government-statistics.html` | " |

If the site later moves behind a server, these are one rewrite rule each.

### Existing pricing functionality

`pricing.html` (138 lines) presents **eight access levels** and an **18-row capability matrix**,
both read from `assets/js/data.js` as `TIERS` and `MATRIX`. It carries an explicit principle:

> **"No prices are hard-coded."** — README, and the page's own *"Packages are data, not code"* section.

**This is a direct conflict with the brief**, which asks for published figures (99, 299, 150000…).
Resolution: the principle is kept in spirit and made true in fact — no price literal appears in
any page. Every figure lives in one canonical record (`assets/js/pricing.js`) and is rendered from
there, which is what item 47 requires. The page copy is updated to say that published prices are
indicative and that institutional pricing is contracted, rather than claiming no prices exist.

The eight existing tiers are **not deleted**. They map onto the nine new plans in
`docs/EDIS_SUBSCRIPTION_ACCESS_MODEL.md` §Migration, and the capability matrix rows are carried
into the new comparison table.

### Data layer

`assets/js/data.js` (~68 KB) holds `AGENTS` (28), `MODELS` (21), `QUESTIONS` (24), `SECTORS` (16),
`SOLUTIONS` (10), `TIERS` (8), `MATRIX` (18 rows), `COURSES` (20 tracks), and the Academy calendar
registry added earlier this session. `assets/js/courses.js` and `assets/js/outlines.js` hold the
49 built courses and their outlines. Pages read from these; nothing is fetched.

### Shell, branding and SEO

`assets/js/app.js` injects the masthead and footer on every page and owns the `NAV` array —
the single place navigation is defined. `assets/css/style.css` is the whole design system: navy
`#123f63`, green `#3f9b46`, Georgia headings on a system sans body, `.card`, `.tbl`, `.badge`,
`.prov`, `.pagehead`, `.stats`, `.filters`. `sitemap.xml` lists 25 URLs; every page carries a
`<title>` and `<meta name="description">`. All of this is extended, not replaced.

---

## 3. What does not exist and is being created

| Need | Status before | Created |
|---|---|---|
| Canonical pricing record | none — no prices anywhere | `assets/js/pricing.js` |
| Plan catalogue (9 plans) | 8 qualitative tiers, no prices | in `pricing.js` |
| Sector price bands | none | in `pricing.js` |
| Add-ons, implementation, training fees | none | in `pricing.js` |
| Country/development-access adjustment | none | in `pricing.js` |
| Entitlement codes | none | in `pricing.js` + docs |
| Monthly/annual toggle | none | `pricing.html` |
| Comparison table (25 rows) | 18-row matrix, no plans | `pricing.html` |
| Institutional calculator | none | `pricing.html` |
| Ministry configurator | none | `pricing.html` |
| Quote / proforma / demo capture | one generic demo form | `request-quote.html` |
| Donor-supported route | none | `request-quote.html` |
| Government solution pages | none | 4 new pages |
| SQL schema | none | `docs/schema/edis_pricing_schema.sql` |
| Documentation | none | 5 docs in `docs/` |

---

## 4. Item-by-item disposition

**Legend** — ✅ built and working · 📄 specified in docs + schema, needs a server · ⚠️ partial

| § | Item | Disposition |
|---|---|---|
| 1–9 | Nine pricing tiers | ✅ all nine, rendered from the canonical record |
| 10 | Development access pricing | ✅ in config and calculator; ⚠️ admin configuration is 📄 |
| 11 | Implementation fees | ✅ separated from subscription throughout |
| 12 | Training pricing | ✅ linked to the real EDIS Academy pricing built earlier |
| 13 | Pricing page design | ✅ `pricing.html` rebuilt in the AICTEM house style |
| 14 | Monthly/annual toggle | ✅ with computed annual saving |
| 15 | Comparison table | ✅ 25 rows × 9 plans, ✓ / Limited / Add-on / Custom |
| 16 | Model access matrix | ✅ as published data; 📄 enforcement is server-side |
| 17 | User limits | ✅ published per plan; 📄 enforcement |
| 18 | AI query limits | ✅ published per plan; 📄 enforcement |
| 19 | Add-ons | ✅ in config, calculator and comparison |
| 20 | Procurement mode | ✅ quote / proforma / proposal / demo / procurement contact |
| 21 | Donor mode | ✅ donor-supported deployment route |
| 22 | CTA routing | ✅ every plan routes as specified |
| 23 | Contact information | ✅ `info@aictem.org` and `aictem.org` only — no invented addresses |
| 24 | Pricing calculator | ✅ indicative estimate, labelled non-binding |
| 25 | Ministry configurator | ✅ with recommended packages per institution type |
| 26 | Feature explanations | ✅ tooltips on every model term |
| 27 | Pricing FAQ | ✅ all 14 questions |
| 28 | Trial strategy | ✅ presented; 📄 trial provisioning |
| 29 | Admin pricing console | 📄 **not built** — needs a server. Specified in the admin guide |
| 30 | Database model | 📄 full SQL schema written, not executed anywhere |
| 31 | Authorization | 📄 entitlement contract documented; enforcement is server-side |
| 32 | Payment architecture | 📄 abstraction documented; no provider wired |
| 33 | Quotation engine | ⚠️ capture + structured payload built; state machine 📄 |
| 34 | CRM integration | ⚠️ every field captured and transmitted; storage 📄 |
| 35 | Analytics | ⚠️ event contract defined and emitted to a no-op sink; dashboard 📄 |
| 36 | Positioning | ✅ infrastructure language throughout |
| 37 | Homepage integration | ✅ three-audience pricing band |
| 38 | Sector page integration | ✅ price band and CTA per sector |
| 39–42 | Government pages | ✅ four pages |
| 43 | Visual design | ✅ existing AICTEM system, no new framework |
| 44 | Trust signals | ✅ six, no fabricated logos or testimonials |
| 45 | Sales material | ✅ content components reusable in proposals |
| 46 | SEO | ✅ metadata per page, sitemap updated |
| 47 | Source of truth | ✅ **enforced by a test** that fails if a price literal appears in any page |
| 48 | Testing | ✅ automated suite |
| 49 | Migration | 📄 mapping documented; no users exist to migrate |
| 50 | Deliverables | see final report |

---

## 5. Risks and decisions recorded

1. **Published prices vs "no prices are hard-coded."** Resolved as above: one canonical record,
   no literals in pages, copy updated to say prices are indicative and institutional pricing is
   contracted. If AICTEM does not want figures public at all, deleting one config file's `public`
   flag hides every figure without touching a page.
2. **Flat URLs instead of `/edis/...` paths.** Recorded in §2. Reversible with rewrite rules.
3. **No enforcement.** The site must not imply that a browser check protects a model. All
   entitlement display is labelled as published licence information.
4. **Indicative estimates only.** The calculator carries the required non-binding label and never
   produces a contractable figure.
5. **Existing eight tiers.** Preserved in `data.js` and mapped, not deleted, so `pricing.html`'s
   historical content and any external links to it keep meaning.
