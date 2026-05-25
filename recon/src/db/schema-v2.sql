-- ─── Recon DB Schema v2 — Phases 7 & 8 ─────────────────────────────────────
-- Run this AFTER schema.sql (v1). All tables are prefixed recon_ for isolation.
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS throughout.

-- ──────────────────────────────────────────────────────────────────────────────
-- PHASE 7 — ENTITY GRAPH
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS recon_entities (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name   TEXT NOT NULL,
  brand            TEXT NOT NULL,
  model            TEXT NOT NULL,
  category         TEXT NOT NULL,
  subcategory      TEXT NOT NULL DEFAULT '',
  vertical         TEXT NOT NULL,
  aliases          JSONB NOT NULL DEFAULT '[]',
  price_range_low  NUMERIC,
  price_range_high NUMERIC,
  is_deleted       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS recon_entities_canonical_name_idx
  ON recon_entities (LOWER(canonical_name));

CREATE INDEX IF NOT EXISTS recon_entities_vertical_idx
  ON recon_entities (vertical);

CREATE INDEX IF NOT EXISTS recon_entities_brand_idx
  ON recon_entities (brand);

-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS recon_entity_aliases (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id   UUID NOT NULL REFERENCES recon_entities(id) ON DELETE CASCADE,
  alias       TEXT NOT NULL,
  source      TEXT NOT NULL,
  confidence  NUMERIC NOT NULL DEFAULT 0.5,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS recon_entity_aliases_unique_idx
  ON recon_entity_aliases (entity_id, LOWER(alias));

CREATE INDEX IF NOT EXISTS recon_entity_aliases_alias_idx
  ON recon_entity_aliases (LOWER(alias));

-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS recon_entity_merges (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_entity_id UUID NOT NULL REFERENCES recon_entities(id),
  target_entity_id UUID NOT NULL REFERENCES recon_entities(id),
  reason           TEXT,
  confidence       NUMERIC NOT NULL DEFAULT 0.8,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- PHASE 8 — HISTORICAL STORAGE
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS recon_market_listings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id   UUID REFERENCES recon_entities(id),
  run_id      UUID REFERENCES recon_runs(id),
  source      TEXT NOT NULL,
  price_usd   NUMERIC NOT NULL,
  condition   TEXT NOT NULL DEFAULT 'unknown',
  region      TEXT NOT NULL DEFAULT 'US',
  url         TEXT,
  scraped_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS recon_market_listings_entity_id_idx
  ON recon_market_listings (entity_id);

CREATE INDEX IF NOT EXISTS recon_market_listings_scraped_at_idx
  ON recon_market_listings (scraped_at DESC);

CREATE INDEX IF NOT EXISTS recon_market_listings_condition_idx
  ON recon_market_listings (entity_id, condition);

-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS recon_normalized_prices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id     UUID NOT NULL REFERENCES recon_entities(id),
  condition     TEXT NOT NULL DEFAULT 'unknown',
  p25           NUMERIC,
  median        NUMERIC,
  p75           NUMERIC,
  mean          NUMERIC,
  std_dev       NUMERIC,
  cv            NUMERIC,
  confidence    TEXT NOT NULL DEFAULT 'low',
  sample_count  INTEGER NOT NULL DEFAULT 0,
  computed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS recon_normalized_prices_entity_condition_idx
  ON recon_normalized_prices (entity_id, condition);

-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS recon_historical_snapshots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id     UUID NOT NULL REFERENCES recon_entities(id),
  snapshot_date DATE NOT NULL,
  price_usd     NUMERIC NOT NULL,
  source        TEXT NOT NULL,
  condition     TEXT NOT NULL DEFAULT 'unknown',
  region        TEXT NOT NULL DEFAULT 'US',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS recon_historical_snapshots_entity_date_idx
  ON recon_historical_snapshots (entity_id, snapshot_date DESC);

-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS recon_confidence_scores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id   UUID NOT NULL REFERENCES recon_entities(id),
  condition   TEXT NOT NULL DEFAULT 'unknown',
  score       NUMERIC NOT NULL,
  band        TEXT NOT NULL,
  reason      TEXT,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS recon_confidence_scores_entity_condition_idx
  ON recon_confidence_scores (entity_id, condition);

-- ──────────────────────────────────────────────────────────────────────────────
-- PHASE 6 — DEDUP FINGERPRINT STORE (cross-run dedup)
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS recon_listing_fingerprints (
  fingerprint  TEXT PRIMARY KEY,
  listing_id   TEXT NOT NULL,
  source       TEXT NOT NULL,
  vertical     TEXT NOT NULL,
  seen_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS recon_listing_fingerprints_vertical_idx
  ON recon_listing_fingerprints (vertical);
