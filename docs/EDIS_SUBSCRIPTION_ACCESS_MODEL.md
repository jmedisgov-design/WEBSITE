# EDIS subscription and access model

Entitlements, limits, enforcement and migration.

> **Read this first.** The website is static and has no backend. Nothing in this document is
> enforced by the site. The site *publishes* entitlements so a buyer knows what a licence
> includes; the platform services *enforce* them. A browser check is not a security boundary, and
> nothing in `assets/js/pricing.js` should ever be treated as one.

---

## 1. Entitlement codes

25 codes, defined in `pricing_features` and mirrored in `pricing.js:FEATURES`. Each maps to an
authorisation constant:

| Code | Constant | What it gates |
|---|---|---|
| `public_dashboards` | `CAN_VIEW_PUBLIC` | Published indicators and sample dashboards |
| `edis_ai` | `CAN_USE_EDIS_AI` | Agent calls, subject to a query allowance |
| `saved_scenarios` | `CAN_SAVE_SCENARIOS` | Persisting scenarios against an account |
| `reports` | `CAN_GENERATE_REPORTS` | Report generation |
| `data_export` | `CAN_EXPORT_DATA` | Excel, Word, PDF, CSV export |
| `sector_models` | `CAN_USE_SECTOR_MODELS` | The sector planning estate |
| `finex` | `CAN_USE_FINEX` | The macro-fiscal framework |
| `cdcge` | `CAN_USE_CDCGE` | The economy-wide CGE |
| `mtef` | `CAN_USE_MTEF` | Ceilings and allocation |
| `budget_output` | `CAN_USE_BUDGET_OUTPUT` | Budget to physical outputs |
| `ucsn` | `CAN_USE_UCSN` | Unit costs and service norms |
| `public_investment` | `CAN_USE_PUBLIC_INVESTMENT` | PIMAPS appraisal and portfolio |
| `mel` | `CAN_USE_MEL` | Monitoring, evaluation and learning |
| `gis` | `CAN_USE_GIS` | Spatial analysis |
| `climate` | `CAN_USE_CLIMATE` | Climate risk, adaptation, mitigation |
| `advanced_scenarios` | `CAN_RUN_ADVANCED_SCENARIOS` | Multi-scenario and sensitivity |
| `api` | `CAN_USE_API` | Programmatic access |
| `workspaces` | `CAN_USE_WORKSPACES` | Shared institutional workspaces |
| `user_management` | `CAN_MANAGE_USERS` | Institutional administration |
| `custom_data` | `CAN_INTEGRATE_DATA` | Institutional data integration |
| `country_calibration` | `CAN_CALIBRATE_COUNTRY` | Country-specific calibration |
| `training` | `CAN_ACCESS_TRAINING` | Academy entitlement |
| `support` | — | Support tier |
| `dedicated_support` | — | Named account team |
| `national_deployment` | `CAN_DEPLOY_NATIONAL` | Whole-of-government configuration |

**Access levels:** `none`, `limited`, `full`, `addon`, `custom`.

---

## 2. The model access matrix

Not every subscription gets every model. The rule, as published on `pricing.html#compare`:

| Plan | Model access |
|---|---|
| Explorer | Public only. No FINEX, no CDCGE, no confidential data, no bulk export. |
| Professional | Selected sector analysis. No FINEX, no CDCGE. |
| Professional Plus | Advanced sector, plus **limited** FINEX, CDCGE, budget-output and public investment. |
| Team | Sector modelling and MEL at a limited level; shared workspace and basic API. |
| Sector | One sector model in full, plus CDCGE linkage, UCSN, MEL, GIS and reporting. |
| Ministry | Ministry-specific modules in full: MTEF, budget output, UCSN, public investment, MEL, GIS; FINEX and CDCGE limited. |
| Government Enterprise | Broad macro and sector access — FINEX, CDCGE, MTEF and the rest in full. |
| National Platform | Everything in Government Enterprise, plus national deployment. |
| Sovereign Premium | National, with FINEX, CDCGE, custom data and calibration marked `custom`. |

The distinction that matters commercially: **Professional Plus gets `limited` FINEX and CDCGE, not
`full`.** A senior analyst can do macro work; only an institution licenses the calibrated national
estate.

---

## 3. User limits

| Plan | Users |
|---|---|
| Explorer, Professional, Professional Plus | 1 |
| Team | 10, configurable to 15 or 25 |
| Sector | 10–25 |
| Ministry | 25–50 |
| Government Enterprise | 50–200 by contract |
| National | 200–1,000+ |
| Sovereign | Custom |

Administrators override with `subscriptions.user_limit_override`, which beats the plan default and
is written to the audit log.

---

## 4. AI query limits

| Plan | Allowance |
|---|---|
| Explorer | 20 questions a month |
| Professional | 500 a month |
| Professional Plus | 2,000 a month |
| Team, Sector, Ministry | Pooled across the institution |
| Government Enterprise | Institutional fair use |
| National, Sovereign | Custom fair-use arrangement |

Stored in `pricing_plans.ai_query_limit`, overridable per subscription. **Not hard-coded** anywhere
in the site or, when built, in the services.

---

## 5. Enforcement contract

The authorisation layer resolves an entitlement in this order:

1. `subscriptions.status` must be `active` or `trial`, and `ends_on` must not have passed.
2. Read `effective_entitlements` — plan defaults overlaid by subscription grants.
3. Apply admin overrides.
4. Check the usage allowance for metered features.
5. Deny by default.

**Every model run, export, API call and agent call is checked server-side.** The interface may hide
what a licence does not include, but hiding is a courtesy, never the control. An API key can never
exceed the permissions of the licence it belongs to.

### On expiry

A lapsed subscription drops to Explorer entitlements. It does not delete data. Work produced in a
workspace remains exportable for a contracted retention period.

---

## 6. Trials

| Plan | Trial |
|---|---|
| Explorer | Permanently free, no trial needed |
| Professional / Plus | Optional 7–14 day trial |
| Institutional | Guided demonstration, not a self-serve trial |
| Government | Sandbox demonstration on sample data |

**National models are never offered on an unrestricted free trial.** A government evaluation runs
on the sandbox with sample data until a contract exists.

---

## 7. Payment architecture

No provider is wired, and none should be assumed. The abstraction to implement:

```
PaymentMethod = card | bank_transfer | invoice | purchase_order | donor_funded | none
```

- **Individual plans** may use online card payment.
- **Institutional contracts** must support invoice, purchase order, framework agreement and
  development-partner procurement, with manual approval. A government buyer must never be required
  to produce a credit card.
- `billing_events` records every invoice, payment, failure, refund, renewal and cancellation with
  an external reference, so reconciliation does not depend on the provider's dashboard.

---

## 8. Migration (item 49)

**No user accounts exist**, so nothing is being migrated and nobody can be locked out. The site's
eight legacy access levels in `data.js:TIERS` are preserved on `pricing.html#licensing` and map
forward as follows:

| Legacy tier | Maps to | Note |
|---|---|---|
| Public | Explorer | Same entitlement, now named |
| Registered | Explorer | Free account, same access |
| Professional | Professional | Direct |
| Institutional | Team or Sector | By size and whether a sector model is licensed |
| Government | Ministry or Government Enterprise | By breadth of the model estate |
| Enterprise | National Platform | Multi-country and portfolio work |
| Academy | Unchanged | Course-linked temporary access, orthogonal to plans |
| API | Unchanged | An add-on to a licence, not a licence |

**Migration rule.** When accounts exist, grant the legacy entitlement explicitly through
`subscription_features` rather than downgrading anyone to their new plan's default. Nobody loses
access at migration; differences are resolved at renewal, in conversation.
