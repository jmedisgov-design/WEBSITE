# EDIS pricing administration guide

For EDIS administrators. What can be changed, where, and what it affects.

> **Status.** The admin console described in §3 is **not built** — it requires a server, and the
> EDIS website is currently static (see the gap analysis §1). §2 is how pricing is administered
> today. §3 is the specification for the console when the platform services exist.

---

## 1. What is administrable

| Setting | Where it lives | Effect |
|---|---|---|
| Seat bands | `pricing_plans.price_monthly_from/_to` | The published individual band and the derived annual band |
| Institutional bands | `pricing_plans.price_annual_from`, `typical_low/high` | The published institutional range and every estimate |
| Annual months | `ANNUAL_MONTHS` (10) | The months-free saving, computed not stored |
| Country adjustments | `country_pricing_adjustments` | Development access pricing |
| Modules in a plan | `plan_features` | The comparison table and what is enforced |
| Implementation fees | `implementation_packages` | The estimator's one-time range |
| Training fees | `training_packages` | The training table and estimates |
| Sector bands | `sector_packages` | Sector pricing and the sector page |
| Add-ons | `pricing_addons` | Optional module pricing |
| User limits | `pricing_plans.users_*` | Published limits and enforcement |
| AI allowances | `pricing_plans.ai_query_*` | Published allowances and metering |
| Per-subscription overrides | `subscription_features`, `*_override` | One institution only |
| Promotional codes | `promotional_codes` | Time-limited discounts |
| Donor sponsorship | `donor_sponsorships` | Shared financing |

---

## 2. Administering pricing today

The canonical record is **`assets/js/pricing.js`**. To change a price:

1. Edit the value in `pricing.js`. Nowhere else — there is no second copy.
2. Run the tests. Two will catch mistakes that matter:
   - `source_of_truth` fails if a figure has leaked into a page.
   - `pricing` fails if annual billing stops being exactly two months free, if a plan's floor
     changes unintentionally, or if the development-access arithmetic breaks.
3. Publish the site.

### Rules that must hold

- **Annual = ten months.** Seat plans publish a band (`monthlyFrom`–`monthlyTo`); the annual band
  is ten times each end, computed by `annualBand()`. Do not store an annual figure — it is derived,
  so the two can never drift apart.
- **Bands must be ordered.** `monthlyFrom` ≤ `monthlyTo`, and `typical[0]` ≤ `typical[1]`.
- **Plan floors must ascend.** Team < Sector < Ministry < Government Enterprise < National <
  Sovereign. A buyer comparing plans must never see a larger plan priced below a smaller one.
- **`typical` must bracket `annualFrom`.** The typical range's lower bound is the floor.
- **Never put a figure in a page.** Not in copy, not in a heading, not in a `<meta>` description.
  Meta descriptions must describe the shape of the pricing, not quote it.

### Hiding prices entirely

If EDIS decides published figures should not be public, set `is_public = FALSE` on the plans
(today: add the flag to `pricing.js` and have `priceLabel()` return "On request"). Every page,
the comparison, the estimator and the government pages follow, because none of them holds a
figure of its own.

---

## 3. The admin console (to build)

### Screens

1. **Plans** — list, edit, reorder, feature, publish. Editing a price shows a diff and requires a
   reason before saving.
2. **Features and access** — the `plan_features` grid: plan × feature × access level, with usage
   limits.
3. **Country pricing** — bands and country-specific adjustments, with validity dates and an
   approver.
4. **Implementation, training, sectors, add-ons** — the ancillary price tables.
5. **Subscriptions** — activate, suspend, extend, set an expiry, override user and AI limits,
   grant a feature beyond the plan.
6. **Quotes** — the lifecycle in `EDIS_INSTITUTIONAL_SALES_FLOW.md` §4, with proposal export.
7. **Donor sponsorships** — donor, beneficiary, the three financing shares, duration.
8. **Promotional codes** — create, cap redemptions, expire.
9. **Training credits** — allocate against an institutional subscription.
10. **Audit** — every change, filterable by entity and actor.

### Non-negotiables

- **Every write goes to `pricing_audit_log`** with actor, before, after and reason. A price change
  with no reason is not permitted.
- **Overrides are explicit and expiring.** A feature granted beyond the plan records who granted
  it, when, and — where appropriate — when it lapses.
- **Two-person approval** for any change to a published base price, and for any discount above the
  country band's maximum.
- **No destructive edits.** Retiring a plan sets `is_public = FALSE`; it never deletes a plan that
  subscriptions reference.
- **Regenerate `pricing.js`** on publish, so the public site and the database cannot disagree.

### Roles

| Role | May |
|---|---|
| Commercial admin | Edit prices, bands, add-ons; create quotes and codes |
| Sales | Create and progress quotes; request non-standard discounts |
| Finance | Approve discounts above band; view billing events |
| Platform admin | Activate subscriptions, set overrides and expiry |
| Auditor | Read everything, change nothing |

---

## 4. Common tasks

**Move the Professional band.** Edit `monthlyFrom` and `monthlyTo`. The annual band follows
automatically at ten months, so there is nothing else to change. Run the tests; publish.
Existing subscriptions keep `contracted_amount` until renewal.

**Give one ministry access to a model outside its plan.** Add a `subscription_features` row with
`access_level = 'full'` and a reason. Do not change the plan — that would affect every other
customer on it.

**Set up a donor-funded deployment.** Create the `institution_accounts` row for the beneficiary,
the `donor_sponsorships` row with the three shares, then the `subscriptions` row with
`payment_method = 'donor_funded'` linked to the sponsorship.

**Onboard a country at a non-standard discount.** If it is within the band, record it on the
subscription. If it exceeds the band's maximum, it needs finance approval and a
`country_pricing_adjustments` row scoped to that country, with an approver and validity dates.

---

## 5. Contact

Commercial and administrative questions: **info@edisgov.org** · **edisgov.org**
