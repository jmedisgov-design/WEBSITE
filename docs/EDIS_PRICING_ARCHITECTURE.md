# EDIS pricing architecture

How EDIS is priced, where the figures live, and what changes when.

---

## 1. The commercial principle

EDIS Government Enterprise is not 150 seats at a seat price. An institutional licence carries
model configuration, national data integration, calibration, technical support, economic
modelling, training, scenario infrastructure, institutional administration and model maintenance.
None of that scales with logins, so **institutional pricing is by institution, not by seat.**

Individual plans are the exception: one analyst, one seat, paid online.

This is why the plan table has two billing models — `seat` for the individual plans and
`annual_from` for the institutional ones — rather than one price multiplied by a user count.

---

## 2. The nine plans

| Plan | Group | Published price | Users | CTA |
|---|---|---|---|---|
| EDIS Explorer | Individual | Free (optional extended access to 25 / month) | 1 | Start free |
| EDIS Professional | Individual | 75–150 / user / month · 750–1,500 / year | 1 | Start Professional |
| EDIS Professional Plus | Individual | 250–400 / user / month · 2,500–4,000 / year | 1 | Upgrade to Professional Plus |
| EDIS Team | Institutional | 12,000–25,000 / year | 10–25 | Request team quote |
| EDIS Sector | Institutional | 20,000–50,000 / year | 10–25 | Configure sector package |
| EDIS Ministry | Institutional | 35,000–75,000 / year | 25–50 | Request ministry demo |
| EDIS Government Enterprise | Institutional | 120,000–300,000 / year | 50–200 | Request government demo |
| EDIS National Platform | National | 300,000–750,000 / year | 200–1,000+ | Discuss national deployment |
| EDIS Sovereign Premium | National | Custom, 750,000–1.5m+ | Custom | Contact EDIS |

All figures USD. **Two plans are visually prominent:** Professional Plus carries *Best for advanced
analysts*, and Government Enterprise carries *Recommended for Ministries of Finance & Central
Banks* and is the flagship institutional product.

**Individual plans are published as indicative bands, not single figures**, because the seat price
is set at contract within the band. The site renders the band and never invents a point price.

**Annual billing is ten months**, so it is exactly two months free at either end of a band:
750–1,500 against 12 × 75–150, and 2,500–4,000 against 12 × 250–400. The site computes and states
the saving rather than asserting it, and a test fails if the ratio ever stops being two months.

**EDIS Sector is not in the headline tier table** but is retained: it was specified in detail
earlier, it carries the twelve per-sector packages, and `sectors.html` depends on it. Its band
(20,000–50,000) overlaps Ministry (35,000–75,000), which is deliberate — a large sector package
can legitimately cost as much as a small ministry deployment.

---

## 3. Where the figures live

**One record: `assets/js/pricing.js`.** It holds plans, entitlements, sector bands, add-ons,
implementation fees, training bands, development access bands, institution packages, procurement
vocabulary and the EDIS contact.

No page contains a price. `tests/source_of_truth` scans every HTML and JS file except the
canonical record and **fails if any currency-marked figure appears anywhere else** — including in
a `<meta>` description, which is why the meta descriptions describe the shape of the pricing
rather than quoting numbers that would go stale.

`pricing.js` is the browser-side mirror of the tables in `docs/schema/edis_pricing_schema.sql`.
When the platform services exist, it is generated from those tables and stops being hand-edited.

### Changing a price

1. Today (static site): edit `assets/js/pricing.js`, run the tests, publish.
2. With a backend: update `pricing_plans` through the admin console, which writes
   `pricing_audit_log`, and regenerate `pricing.js`.

Never edit a figure into a page.

---

## 4. What is separated from the subscription

**Implementation** is a one-time engagement, quoted from scope: country configuration, data setup,
account and role setup, model setup, calibration, API integration, training, deployment and
testing. Bands run from included on the individual and team plans to 150,000–500,000+ on a
national platform. Always presented as *from*.

**Training** is per participant or per cohort: online courses 300–750, advanced model courses
1,000–2,500, government cohorts 15,000–40,000, custom quoted. The dated EDIS Academy cohorts have
their own published fees in `data.js` (`CAL_RATES`) — that is the authority for a specific cohort,
and the bands here are the commercial envelope around it.

**Add-ons** are added mid-contract: an additional sector at 10,000–25,000 a year, and advanced
GIS, data integration, advanced CDCGE, custom agents, custom API, a dedicated environment and
premium support, all custom.

---

## 5. Development access pricing

Published as **development access pricing**, never as country cheapness.

| Classification | Adjustment |
|---|---|
| Low income | up to 40–60 % |
| Lower-middle income | up to 20–40 % |
| Upper-middle income | up to 10–20 % |
| High income | standard price |

Applied at contract, not at checkout, and recorded on the subscription as `discount_applied` so
the reason for a non-standard price is auditable. Administrators configure the bands, and may set
a country-specific adjustment inside a band.

**Donor-supported deployment** allows a donor, the government and EDIS to share financing;
`donor_sponsorships` records the three shares and enforces that they do not exceed the total.

---

## 6. Sector packages

EDIS Sector is priced by the sector's model estate and data burden, not uniformly:

| Package | Indicative a year |
|---|---|
| Energy, Transport | 35,000–50,000 |
| Agriculture, Climate | 30,000–45,000 |
| Health, Education, Water, Trade | 25,000–40,000 |
| ICT, Industry, Minerals, Forestry | 20,000–35,000 |

Each carries the sector model, its EDIS agents, dashboard, data, scenario analysis, costing,
budget linkage, GIS where relevant, MEL, CDCGE linkage, reporting and sector training.

---

## 7. The estimator and the configurator

**The estimator** (`pricing.html#calculator`) takes country income band, institution type, users,
sectors, implementation level, training participants and options, and returns an indicative
subscription range, implementation range, training range, first-year total and recurring total.

It selects the plan from the institution's recommendation and **raises it if the user count
exceeds that plan's band**, so a 500-user request does not return a Team price. Development access
is applied to the subscription only, never to implementation or training.

Every output carries: **INDICATIVE ESTIMATE — FINAL COMMERCIAL PROPOSAL SUBJECT TO EDIS REVIEW.**
It never produces a binding offer, and a test asserts that label is present.

**The configurator** (`pricing.html#configurator`) shows the package EDIS recommends for an
institution type and lets the buyer adjust it:

| Institution | Recommended |
|---|---|
| Ministry of Finance | FINEX, MTEF, CDCGE, Budget Output Engine, UCSN, Public Investment, MEL, EDIS AI |
| Central Bank | FINEX, CDCGE, Trade, Macro forecasting, Financial sector, EDIS AI |
| Statistics Bureau | Data platform, National accounts, Household data, CDCGE calibration, EDIS AI |
| Ministry of Energy | Energy, PyPSA, CDCGE, MTEF, Public Investment, GIS, MEL |

Both hand off to `request-quote.html` with the selection in the query string, so the buyer never
re-types what they have already chosen.

---

## 8. Positioning

The pricing pages describe EDIS as economic development intelligence infrastructure, integrated
policy modelling, national economic decision support, public investment and budget intelligence,
sector planning and economy-wide analysis. **Not** as an AI, a chatbot or a dashboard.

Trust signals are the six things a licence actually carries — integrated models, country
configuration, data integration, institutional security, technical training and evidence-based
modelling. **No customer logos or testimonials are shown, because none have been provided.**

---

## 9. Files

| File | Role |
|---|---|
| `assets/js/pricing.js` | The canonical record. Every figure. |
| `assets/js/pricing-ui.js` | Renders the pricing page from that record. |
| `pricing.html` | Plans, comparison, implementation, training, development access, add-ons, estimator, configurator, trust signals, FAQ, and the preserved licence architecture. |
| `request-quote.html` | Quote, proforma, proposal, demo, sandbox, procurement and donor capture. |
| `government.html` + 3 product pages | Government solution pages. |
| `docs/schema/edis_pricing_schema.sql` | The backend specification. |
