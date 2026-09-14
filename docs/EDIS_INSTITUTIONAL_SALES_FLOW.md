# EDIS institutional sales flow

From a pricing-page visit to a contracted national deployment.

---

## 1. The flow

```
   Pricing page  ─┬─►  Estimator      ─┐
                  ├─►  Configurator   ─┼─►  request-quote.html  ─►  EDIS  ─►  Proposal  ─►  Contract
   Government pg ─┤                    │        (structured)
   Sector page   ─┘                    │
                                        └─►  Demonstration / sandbox
```

Every route carries its context forward in the query string, so a buyer never re-types a choice:

| From | Query passed |
|---|---|
| Plan card CTA | `plan`, `intent` |
| Estimator | `plan`, `users`, `sectors`, `band`, `intent=quote` |
| Configurator | `plan`, `institution`, `modules`, `intent=proposal` |
| Government pages | `plan`, `institution`, `intent=demo` |
| Sector page | `plan=sector`, `sectors`, `intent=quote` |

---

## 2. Request types (item 20)

Government buyers frequently cannot purchase with a card, so the request type is the first field
on the form, not an afterthought:

`quote` · `proforma` · `proposal` · `demo` · `sandbox` · `procurement` · `donor` ·
`subscribe` · `national` · `sovereign`

The page title, lede and visible fields change with the selection. Choosing **donor** reveals the
development partner, the government beneficiary, the duration and the estimated budget.

---

## 3. What is captured

Every field item 20 requires, plus the routing context:

country · institution · institution type · department · contact name · job title ·
institutional email · phone · number of users · modules required · estimated deployment date ·
funding source · procurement method · training participants · comments · plan · income band ·
request type · source URL

Donor mode adds: development partner · government beneficiary · duration · estimated budget.

**Today** these are assembled into a structured `mailto:info@edisgov.org` payload — the same pattern
every other form on the static site uses, so a request is never silently lost.

**With a backend** the same payload posts to `crm_leads` and, where a plan and user count are
present, opens a `quotes` row in `DRAFT`. The field names in the form already match the column
names in the schema, so the mapping is one-to-one.

---

## 4. Quote lifecycle (item 33)

```
DRAFT ─► SUBMITTED ─► UNDER_REVIEW ─► PROPOSAL_SENT ─► NEGOTIATION ─┬─► APPROVED ─► CONTRACTED
                                                                     └─► DECLINED
```

| Status | Owner | Meaning |
|---|---|---|
| `DRAFT` | System | Created from an estimator or configurator hand-off |
| `SUBMITTED` | Buyer | The institution has sent the request |
| `UNDER_REVIEW` | EDIS | Commercial review of scope, country band and discount |
| `PROPOSAL_SENT` | EDIS | A written proposal has gone to the institution |
| `NEGOTIATION` | Both | Scope, phasing or financing under discussion |
| `APPROVED` | EDIS | Internally approved, awaiting signature |
| `CONTRACTED` | EDIS | Signed; a `subscriptions` row is created |
| `DECLINED` | Either | Closed, with a reason recorded |

A quote holds `quote_items` typed as `plan`, `sector`, `addon`, `implementation`, `training` or
`support`, so a proposal separates the subscription from the one-time fees on its face.

**Export.** The quote data is proposal-ready. The site has no document service, so PDF, Word and
Excel export is left to the backend; `quotes` + `quote_items` carry everything a template needs.

---

## 5. Donor-supported deployments (item 21)

A development partner can fund EDIS for a government. `donor_sponsorships` records the donor, the
beneficiary institution and country, and the three financing shares — donor, government, EDIS —
with a constraint that they cannot exceed the total.

Partners the route is written for: World Bank, AfDB, UNDP, EU, FCDO, GIZ, foundations and regional
institutions.

The scoping conversation always includes the beneficiary. A deployment financed over a government's
head does not get used.

---

## 6. CRM (item 34)

`crm_leads` holds country, institution, institution type, ministry, contact, email, phone,
selected product, estimated annual value, status, next action, owner and lead source, linked to
the quote it produced.

**No pricing enquiry is discarded.** A request that arrives without a plan selected is still a
lead; the plan is resolved in the scoping call.

Lead sources to distinguish: `pricing_page`, `calculator`, `configurator`, `government_page`,
`sector_page`, `homepage_band`, `academy`, `direct`.

---

## 7. Analytics (item 35)

The event contract the commercial dashboard is built on:

| Event | Payload |
|---|---|
| `pricing_view` | country, referrer |
| `plan_click` | plan_id, billing period |
| `billing_toggle` | period |
| `comparison_view` | — |
| `calculator_run` | institution type, users, sectors, band, estimated value |
| `configurator_run` | institution, modules |
| `quote_request` | plan, request type, country, users, estimated value |
| `demo_request` | plan, country, institution type |
| `sandbox_request` | country, institution type |
| `donor_enquiry` | partner, beneficiary country |
| `trial_start` | plan |
| `sector_interest` | sector_id |

Reported by: country, institution type, plan, module, lead source, conversion rate and annual
contract value.

**Not yet emitting.** The static site has no analytics sink and none should be invented; the
contract above is what to implement when one exists.

---

## 8. Sales material reuse (item 45)

These components are written to be lifted into proposals and brochures without rewriting:

- **Plan cards** — name, tagline, price, users, AI allowance, inclusions, audience.
- **The comparison table** — 25 capabilities × 9 plans.
- **Government workflows** — the model chains on the Finance, Central Bank and Statistics pages.
- **Trust signals** — the six things a licence carries.
- **The FAQ** — 14 answers written for a procurement audience.
- **Implementation inclusions** — the ten-item scope list.

All render from `pricing.js`, so a proposal built from them cannot quote a stale price.

---

## 9. Contact

All commercial enquiry routes to **info@edisgov.org** and **edisgov.org**. No other address exists
and none has been invented.
