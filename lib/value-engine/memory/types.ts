// ─── WVE Estimation Memory — Types — Phase 13 ────────────────────────────────

import type { EstimationType, VerticalSlug } from "../types";

/** A single persisted estimate record */
export interface EstimateRecord {
  /** Registry entity id or intent slug */
  id: string;
  entityName: string;
  type: EstimationType;
  vertical: VerticalSlug;
  /** Formula engine key (service-estimate only) */
  serviceType?: string;
  /** Unix ms timestamp of most recent view */
  estimatedAt: number;
  /** Mid estimate in USD, if known at time of save */
  estimateAmount?: number;
  /** Region the estimate was run for */
  region?: string;
  /** Full result page URL */
  href: string;
  /** Total times this entity has been viewed across sessions */
  viewCount: number;
}

/** Shape of the full memory store persisted in localStorage */
export interface MemoryStore {
  /** Ordered newest-first */
  records: EstimateRecord[];
  /** ISO string — when the store was last written */
  lastUpdated: string;
}
