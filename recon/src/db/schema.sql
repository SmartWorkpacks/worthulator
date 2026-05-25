-- ─── Recon system tables ─────────────────────────────────────────────────────
-- Run once against your Supabase project via the SQL editor.
-- All tables are prefixed "recon_" to stay isolated from the Worthulator app.

-- Recon runs metadata
CREATE TABLE IF NOT EXISTS recon_runs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  mode         TEXT        NOT NULL CHECK (mode IN ('mock', 'live')),
  verticals    TEXT[]      NOT NULL,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status       TEXT        NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'done', 'failed'))
);

-- Raw ingested listings
CREATE TABLE IF NOT EXISTS recon_listings_raw (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id       UUID        REFERENCES recon_runs(id) ON DELETE CASCADE,
  source       TEXT        NOT NULL,
  vertical     TEXT        NOT NULL,
  title        TEXT        NOT NULL,
  price        NUMERIC(12,2),
  currency     TEXT        DEFAULT 'USD',
  condition    TEXT,
  url          TEXT,
  region       TEXT,
  ingested_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_data     JSONB
);

-- Normalized listings
CREATE TABLE IF NOT EXISTS recon_listings_normalized (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id            UUID        REFERENCES recon_runs(id) ON DELETE CASCADE,
  entity            TEXT        NOT NULL,
  brand             TEXT,
  model             TEXT,
  category          TEXT,
  subcategory       TEXT,
  source            TEXT        NOT NULL,
  vertical          TEXT        NOT NULL,
  price             NUMERIC(12,2) NOT NULL,
  currency          TEXT        DEFAULT 'USD',
  condition         TEXT        DEFAULT 'unknown',
  region            TEXT,
  entity_confidence NUMERIC(4,3),
  normalized_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Feasibility reports (one JSON blob per run)
CREATE TABLE IF NOT EXISTS recon_reports (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id       UUID        REFERENCES recon_runs(id) ON DELETE CASCADE,
  report       JSONB       NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_raw_vertical    ON recon_listings_raw(vertical);
CREATE INDEX IF NOT EXISTS idx_raw_run         ON recon_listings_raw(run_id);
CREATE INDEX IF NOT EXISTS idx_norm_entity     ON recon_listings_normalized(entity);
CREATE INDEX IF NOT EXISTS idx_norm_vertical   ON recon_listings_normalized(vertical);
CREATE INDEX IF NOT EXISTS idx_norm_run        ON recon_listings_normalized(run_id);
