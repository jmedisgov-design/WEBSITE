-- ===========================================================================
-- EDIS pricing, subscription and entitlement schema
-- ---------------------------------------------------------------------------
-- PostgreSQL. This file is a specification, not a migration that has been run:
-- the EDIS website is currently a static site with no backend (see
-- docs/EDIS_PRICING_IMPLEMENTATION_GAP_ANALYSIS.md §1). Nothing here has been
-- executed against a database.
--
-- It defines the tables that assets/js/pricing.js currently mirrors by hand.
-- When the platform services exist, pricing.js is generated from these tables
-- and stops being edited directly.
--
-- Money is stored in minor units (cents) as BIGINT to avoid float error.
-- ===========================================================================

BEGIN;

-- ------------------------------------------------------------------ plans
CREATE TABLE pricing_plans (
    plan_id             TEXT PRIMARY KEY,              -- 'government_enterprise'
    name                TEXT        NOT NULL,
    plan_group          TEXT        NOT NULL CHECK (plan_group IN ('individual','institutional','national')),
    tagline             TEXT,
    billing_model       TEXT        NOT NULL CHECK (billing_model IN ('free','seat','annual_from','custom')),
    currency            CHAR(3)     NOT NULL DEFAULT 'USD',
    price_monthly       BIGINT,                        -- minor units, per seat
    price_annual        BIGINT,                        -- minor units, per seat
    price_annual_from   BIGINT,                        -- minor units, institutional floor
    typical_low         BIGINT,
    typical_high        BIGINT,
    users_min           INTEGER,
    users_max           INTEGER,                       -- NULL = unbounded / custom
    ai_query_limit      INTEGER,                       -- NULL = pooled or custom
    ai_query_period     TEXT DEFAULT 'month',
    badge               TEXT,
    is_featured         BOOLEAN     NOT NULL DEFAULT FALSE,
    is_public           BOOLEAN     NOT NULL DEFAULT TRUE,   -- FALSE hides every figure
    inherits_plan_id    TEXT REFERENCES pricing_plans(plan_id),
    sort_order          INTEGER     NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------- features and access
CREATE TABLE pricing_features (
    feature_code        TEXT PRIMARY KEY,              -- 'finex', matches CAN_USE_FINEX
    name                TEXT        NOT NULL,
    description         TEXT        NOT NULL,          -- the tooltip text
    category            TEXT,
    sort_order          INTEGER     NOT NULL DEFAULT 0
);

CREATE TABLE plan_features (
    plan_id             TEXT NOT NULL REFERENCES pricing_plans(plan_id) ON DELETE CASCADE,
    feature_code        TEXT NOT NULL REFERENCES pricing_features(feature_code) ON DELETE CASCADE,
    access_level        TEXT NOT NULL CHECK (access_level IN ('none','limited','full','addon','custom')),
    usage_limit         INTEGER,                       -- NULL = unlimited within fair use
    usage_period        TEXT,
    is_enabled          BOOLEAN NOT NULL DEFAULT TRUE,
    notes               TEXT,
    PRIMARY KEY (plan_id, feature_code)
);

-- ------------------------------------------------------------ sectors, add-ons
CREATE TABLE sector_packages (
    sector_id           TEXT PRIMARY KEY,
    name                TEXT   NOT NULL,
    price_from          BIGINT NOT NULL,
    price_to            BIGINT NOT NULL,
    included_models     TEXT[] NOT NULL DEFAULT '{}',
    is_active           BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE pricing_addons (
    addon_id            TEXT PRIMARY KEY,
    name                TEXT   NOT NULL,
    price_from          BIGINT,
    price_to            BIGINT,
    is_custom           BOOLEAN NOT NULL DEFAULT FALSE,
    billing_unit        TEXT   NOT NULL DEFAULT 'year',
    is_active           BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE implementation_packages (
    plan_id             TEXT PRIMARY KEY REFERENCES pricing_plans(plan_id) ON DELETE CASCADE,
    fee_from            BIGINT,
    fee_to              BIGINT,
    is_custom           BOOLEAN NOT NULL DEFAULT FALSE,
    label               TEXT,
    includes            TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE training_packages (
    training_id         TEXT PRIMARY KEY,
    name                TEXT   NOT NULL,
    price_from          BIGINT,
    price_to            BIGINT,
    is_custom           BOOLEAN NOT NULL DEFAULT FALSE,
    billing_unit        TEXT   NOT NULL CHECK (billing_unit IN ('participant','cohort','custom'))
);

-- --------------------------------------------------- development access pricing
-- Published as "development access pricing". Never as country cheapness.
CREATE TABLE country_pricing_adjustments (
    adjustment_id       BIGSERIAL PRIMARY KEY,
    country_iso3        CHAR(3),                       -- NULL = applies to the whole band
    income_band         TEXT NOT NULL CHECK (income_band IN ('low','lower_mid','upper_mid','high')),
    discount_min        NUMERIC(4,3) NOT NULL CHECK (discount_min BETWEEN 0 AND 1),
    discount_max        NUMERIC(4,3) NOT NULL CHECK (discount_max BETWEEN 0 AND 1),
    applies_to_group    TEXT CHECK (applies_to_group IN ('individual','institutional','national')),
    valid_from          DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to            DATE,
    approved_by         TEXT,
    CHECK (discount_max >= discount_min)
);
CREATE INDEX ON country_pricing_adjustments (income_band, country_iso3);

-- ------------------------------------------------------------- institutions
CREATE TABLE institution_accounts (
    institution_id      BIGSERIAL PRIMARY KEY,
    name                TEXT NOT NULL,
    institution_type    TEXT,                          -- 'mof', 'central_bank', ...
    country_iso3        CHAR(3) NOT NULL,
    income_band         TEXT,
    department          TEXT,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------ subscriptions
CREATE TABLE subscriptions (
    subscription_id     BIGSERIAL PRIMARY KEY,
    plan_id             TEXT NOT NULL REFERENCES pricing_plans(plan_id),
    institution_id      BIGINT REFERENCES institution_accounts(institution_id),
    user_id             BIGINT,                        -- individual plans; FK to the existing users table
    status              TEXT NOT NULL CHECK (status IN
                          ('trial','active','past_due','suspended','expired','cancelled')),
    billing_period      TEXT NOT NULL CHECK (billing_period IN ('monthly','annual','contract')),
    contracted_amount   BIGINT,                        -- what was actually agreed, minor units
    currency            CHAR(3) NOT NULL DEFAULT 'USD',
    discount_applied    NUMERIC(4,3) NOT NULL DEFAULT 0,
    user_limit_override INTEGER,                       -- admin override, beats the plan
    ai_limit_override   INTEGER,
    starts_on           DATE NOT NULL,
    ends_on             DATE,
    auto_renew          BOOLEAN NOT NULL DEFAULT FALSE,
    payment_method      TEXT CHECK (payment_method IN
                          ('card','bank_transfer','invoice','purchase_order','donor_funded','none')),
    donor_sponsorship_id BIGINT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (institution_id IS NOT NULL OR user_id IS NOT NULL)
);
CREATE INDEX ON subscriptions (status, ends_on);
CREATE INDEX ON subscriptions (institution_id);

CREATE TABLE subscription_users (
    subscription_id     BIGINT NOT NULL REFERENCES subscriptions(subscription_id) ON DELETE CASCADE,
    user_id             BIGINT NOT NULL,
    role                TEXT NOT NULL DEFAULT 'member'
                          CHECK (role IN ('admin','analyst','member','viewer')),
    added_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    removed_at          TIMESTAMPTZ,
    PRIMARY KEY (subscription_id, user_id)
);

-- Per-subscription entitlement overrides. The effective entitlement is
-- plan_features, overlaid by these, overlaid by admin overrides.
CREATE TABLE subscription_features (
    subscription_id     BIGINT NOT NULL REFERENCES subscriptions(subscription_id) ON DELETE CASCADE,
    feature_code        TEXT NOT NULL REFERENCES pricing_features(feature_code),
    access_level        TEXT NOT NULL CHECK (access_level IN ('none','limited','full','addon','custom')),
    usage_limit         INTEGER,
    is_enabled          BOOLEAN NOT NULL DEFAULT TRUE,
    granted_by          TEXT,
    granted_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (subscription_id, feature_code)
);

CREATE TABLE subscription_addons (
    subscription_id     BIGINT NOT NULL REFERENCES subscriptions(subscription_id) ON DELETE CASCADE,
    addon_id            TEXT NOT NULL REFERENCES pricing_addons(addon_id),
    quantity            INTEGER NOT NULL DEFAULT 1,
    contracted_amount   BIGINT,
    PRIMARY KEY (subscription_id, addon_id)
);

-- ------------------------------------------------------------------ quotes
CREATE TABLE quotes (
    quote_id            BIGSERIAL PRIMARY KEY,
    reference           TEXT UNIQUE NOT NULL,          -- 'EDIS-Q-2026-0147'
    institution_id      BIGINT REFERENCES institution_accounts(institution_id),
    plan_id             TEXT REFERENCES pricing_plans(plan_id),
    status              TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN
                          ('DRAFT','SUBMITTED','UNDER_REVIEW','PROPOSAL_SENT',
                           'NEGOTIATION','APPROVED','DECLINED','CONTRACTED')),
    request_type        TEXT CHECK (request_type IN
                          ('quote','proforma','proposal','demo','sandbox',
                           'procurement','donor','subscribe','national','sovereign')),
    users_requested     INTEGER,
    income_band         TEXT,
    discount_applied    NUMERIC(4,3) NOT NULL DEFAULT 0,
    subtotal            BIGINT,
    implementation_fee  BIGINT,
    training_fee        BIGINT,
    total_first_year    BIGINT,
    total_recurring     BIGINT,
    currency            CHAR(3) NOT NULL DEFAULT 'USD',
    valid_until         DATE,
    funding_source      TEXT,
    procurement_method  TEXT,
    deployment_date     DATE,
    owner               TEXT,                          -- AICTEM account owner
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON quotes (status, created_at DESC);

CREATE TABLE quote_items (
    quote_item_id       BIGSERIAL PRIMARY KEY,
    quote_id            BIGINT NOT NULL REFERENCES quotes(quote_id) ON DELETE CASCADE,
    item_type           TEXT NOT NULL CHECK (item_type IN
                          ('plan','sector','addon','implementation','training','support')),
    item_code           TEXT NOT NULL,
    description         TEXT,
    quantity            INTEGER NOT NULL DEFAULT 1,
    unit_amount         BIGINT,
    amount              BIGINT,
    sort_order          INTEGER NOT NULL DEFAULT 0
);

-- ------------------------------------------------------ donor sponsorship
CREATE TABLE donor_sponsorships (
    sponsorship_id      BIGSERIAL PRIMARY KEY,
    donor_name          TEXT NOT NULL,                 -- World Bank, AfDB, UNDP, EU, FCDO, GIZ...
    beneficiary_institution_id BIGINT REFERENCES institution_accounts(institution_id),
    beneficiary_country CHAR(3),
    donor_share         NUMERIC(4,3) NOT NULL DEFAULT 1.000,
    government_share    NUMERIC(4,3) NOT NULL DEFAULT 0.000,
    aictem_share        NUMERIC(4,3) NOT NULL DEFAULT 0.000,
    amount              BIGINT,
    duration_years      INTEGER,
    training_included   BOOLEAN NOT NULL DEFAULT TRUE,
    status              TEXT NOT NULL DEFAULT 'proposed',
    starts_on           DATE,
    ends_on             DATE,
    CHECK (donor_share + government_share + aictem_share <= 1.001)
);

-- ---------------------------------------------------------------- CRM leads
CREATE TABLE crm_leads (
    lead_id             BIGSERIAL PRIMARY KEY,
    country             TEXT,
    institution         TEXT,
    institution_type    TEXT,
    department          TEXT,
    contact_name        TEXT,
    job_title           TEXT,
    email               TEXT,
    phone               TEXT,
    selected_plan       TEXT,
    selected_modules    TEXT[],
    users_requested     INTEGER,
    estimated_annual_value BIGINT,
    funding_source      TEXT,
    procurement_method  TEXT,
    deployment_date     DATE,
    status              TEXT NOT NULL DEFAULT 'new',
    next_action         TEXT,
    next_action_due     DATE,
    owner               TEXT,
    lead_source         TEXT,                          -- 'pricing_page', 'calculator', ...
    quote_id            BIGINT REFERENCES quotes(quote_id),
    comments            TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON crm_leads (status, created_at DESC);

-- ------------------------------------------------------------- billing, audit
CREATE TABLE billing_events (
    event_id            BIGSERIAL PRIMARY KEY,
    subscription_id     BIGINT REFERENCES subscriptions(subscription_id),
    event_type          TEXT NOT NULL CHECK (event_type IN
                          ('invoice_issued','payment_received','payment_failed',
                           'refund','credit_note','renewal','cancellation')),
    amount              BIGINT,
    currency            CHAR(3) NOT NULL DEFAULT 'USD',
    payment_method      TEXT,
    external_reference  TEXT,                          -- provider or PO reference
    occurred_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    payload             JSONB
);

CREATE TABLE pricing_audit_log (
    audit_id            BIGSERIAL PRIMARY KEY,
    actor               TEXT NOT NULL,
    action              TEXT NOT NULL,                 -- 'plan.price.update', 'discount.set', ...
    entity_type         TEXT NOT NULL,
    entity_id           TEXT NOT NULL,
    before_value        JSONB,
    after_value         JSONB,
    reason              TEXT,
    occurred_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON pricing_audit_log (entity_type, entity_id, occurred_at DESC);

CREATE TABLE promotional_codes (
    code                TEXT PRIMARY KEY,
    description         TEXT,
    discount_pct        NUMERIC(4,3),
    applies_to_plan     TEXT REFERENCES pricing_plans(plan_id),
    max_redemptions     INTEGER,
    redemptions         INTEGER NOT NULL DEFAULT 0,
    valid_from          DATE,
    valid_to            DATE,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE
);

-- --------------------------------------------------------------- analytics
CREATE TABLE pricing_analytics_events (
    event_id            BIGSERIAL PRIMARY KEY,
    event_name          TEXT NOT NULL,                 -- see EDIS_INSTITUTIONAL_SALES_FLOW.md
    country             TEXT,
    plan_id             TEXT,
    modules             TEXT[],
    lead_source         TEXT,
    session_id          TEXT,
    occurred_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    payload             JSONB
);
CREATE INDEX ON pricing_analytics_events (event_name, occurred_at DESC);

-- ===========================================================================
-- The effective entitlement of a subscription: plan defaults, overlaid by any
-- subscription-level grant. This view is what the authorisation layer reads.
-- ===========================================================================
CREATE VIEW effective_entitlements AS
SELECT s.subscription_id,
       f.feature_code,
       COALESCE(sf.access_level, pf.access_level, 'none') AS access_level,
       COALESCE(sf.usage_limit,  pf.usage_limit)          AS usage_limit,
       COALESCE(sf.is_enabled,   pf.is_enabled, FALSE)    AS is_enabled,
       s.status,
       s.ends_on
FROM   subscriptions s
CROSS JOIN pricing_features f
LEFT JOIN plan_features pf
       ON pf.plan_id = s.plan_id AND pf.feature_code = f.feature_code
LEFT JOIN subscription_features sf
       ON sf.subscription_id = s.subscription_id AND sf.feature_code = f.feature_code;

COMMIT;

-- ===========================================================================
-- Migration note (item 49)
-- ---------------------------------------------------------------------------
-- No user accounts exist yet, so nothing is migrated and nobody is locked out.
-- When accounts do exist, map the eight legacy access levels in data.js:TIERS
-- onto the nine plans as documented in EDIS_SUBSCRIPTION_ACCESS_MODEL.md
-- §Migration, and grant the legacy entitlement through subscription_features
-- rather than downgrading anyone silently.
-- ===========================================================================
