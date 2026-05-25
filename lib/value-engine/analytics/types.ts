// ─── WVE Analytics — Event Types — Phase 13 ──────────────────────────────────
// All strongly-typed events emitted by the Value Engine.
// No runtime dependencies — pure TypeScript types only.

import type { EstimationType, VerticalSlug } from "../types";

// ── Base ─────────────────────────────────────────────────────────────────────
interface BaseEvent {
  /** Auto-filled by emitter if not provided */
  timestamp?: number;
  /** Session ID for cross-page attribution (auto-filled) */
  sessionId?: string;
}

// ── Search ───────────────────────────────────────────────────────────────────
export interface EstimateSearchedEvent extends BaseEvent {
  name: "estimate_searched";
  query: string;
  resultCount: number;
  /** Whether results came from live recon or registry fallback */
  source: "recon" | "registry" | "unknown";
}

export interface EstimateSelectedEvent extends BaseEvent {
  name: "estimate_selected";
  entityId: string;
  entityName: string;
  vertical: VerticalSlug;
  /** 0-indexed position in the results list */
  rank: number;
}

// ── Page views ───────────────────────────────────────────────────────────────
export interface EstimateViewedEvent extends BaseEvent {
  name: "estimate_viewed";
  entityId: string;
  entityName: string;
  estimationType: EstimationType;
  vertical: VerticalSlug;
  estimateAmount?: number;
  isRepeatVisit: boolean;
}

// ── On-page interactions ──────────────────────────────────────────────────────
export interface EstimateEngagementEvent extends BaseEvent {
  name: "estimate_engagement";
  entityId: string;
  action: "region_toggle" | "range_adjust" | "expand_details" | "share" | "copy_link";
  /** Free-form detail e.g. region code, value */
  detail?: string;
}

// ── Related estimates ─────────────────────────────────────────────────────────
export interface RelatedClickedEvent extends BaseEvent {
  name: "related_clicked";
  fromEntityId: string;
  toEntityId: string;
  toEntityName: string;
  strength?: number;
  /** 0-indexed position in the related list */
  position: number;
}

// ── Lead / conversion ─────────────────────────────────────────────────────────
export interface LeadFormStartedEvent extends BaseEvent {
  name: "lead_form_started";
  entityId: string;
  estimateAmount?: number;
  triggerSource: "cta_button" | "escalation_modal" | "floating_cta" | "page_scroll";
}

export interface LeadFormSubmittedEvent extends BaseEvent {
  name: "lead_form_submitted";
  entityId: string;
  serviceType?: string;
  estimateAmount?: number;
}

// ── Comparison / affiliate ────────────────────────────────────────────────────
export interface ComparisonViewedEvent extends BaseEvent {
  name: "comparison_viewed";
  entityId: string;
  vertical: VerticalSlug;
}

export interface AffiliateClickedEvent extends BaseEvent {
  name: "affiliate_clicked";
  entityId: string;
  href: string;
  label: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────
export type WVEEvent =
  | EstimateSearchedEvent
  | EstimateSelectedEvent
  | EstimateViewedEvent
  | EstimateEngagementEvent
  | RelatedClickedEvent
  | LeadFormStartedEvent
  | LeadFormSubmittedEvent
  | ComparisonViewedEvent
  | AffiliateClickedEvent;

export type WVEEventName = WVEEvent["name"];

// ── GTM dataLayer declaration (no external dep) ───────────────────────────────
declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}
