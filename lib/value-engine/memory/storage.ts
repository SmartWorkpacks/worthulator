// ─── WVE Estimation Memory — Storage — Phase 13 ──────────────────────────────
// Pure localStorage/sessionStorage functions. All reads/writes are SSR-guarded.
// No React, no side-effects at module level.

import type { EstimateRecord, MemoryStore } from "./types";
import type { VerticalSlug } from "../types";

const MEMORY_KEY   = "wve_estimate_history";
const SESSION_KEY  = "wve_session_views";
const MAX_HISTORY  = 20;

// ── SSR guards ────────────────────────────────────────────────────────────────
const canUseLocal   = typeof window !== "undefined" && !!window.localStorage;
const canUseSession = typeof window !== "undefined" && !!window.sessionStorage;

// ── Store read/write ──────────────────────────────────────────────────────────
function readStore(): MemoryStore {
  if (!canUseLocal) return { records: [], lastUpdated: "" };
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (!raw) return { records: [], lastUpdated: "" };
    return JSON.parse(raw) as MemoryStore;
  } catch {
    return { records: [], lastUpdated: "" };
  }
}

function writeStore(store: MemoryStore): void {
  if (!canUseLocal) return;
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(store));
  } catch {
    // localStorage may be full or disabled — fail silently
  }
}

// ── Session view tracking ─────────────────────────────────────────────────────
function readSessionViews(): Set<string> {
  if (!canUseSession) return new Set();
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function writeSessionViews(views: Set<string>): void {
  if (!canUseSession) return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(Array.from(views)));
  } catch {
    // fail silently
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Record (or update) a viewed estimate.
 * If the entity already exists in history, bumps viewCount and timestamp.
 * Returns the saved record.
 */
export function saveEstimate(
  input: Omit<EstimateRecord, "viewCount" | "estimatedAt">,
): EstimateRecord {
  const store  = readStore();
  const now    = Date.now();
  const idx    = store.records.findIndex((r) => r.id === input.id);

  let record: EstimateRecord;

  if (idx !== -1) {
    // Update existing record
    record = {
      ...store.records[idx]!,
      ...input,
      estimatedAt: now,
      viewCount:   (store.records[idx]!.viewCount ?? 0) + 1,
    };
    store.records.splice(idx, 1);
  } else {
    // New record
    record = { ...input, estimatedAt: now, viewCount: 1 };
  }

  // Prepend and cap at MAX_HISTORY
  store.records = [record, ...store.records].slice(0, MAX_HISTORY);
  store.lastUpdated = new Date(now).toISOString();
  writeStore(store);

  // Also mark as seen this session
  const sessionViews = readSessionViews();
  sessionViews.add(input.id);
  writeSessionViews(sessionViews);

  return record;
}

/** Load all stored estimate records, newest first */
export function loadHistory(): EstimateRecord[] {
  return readStore().records;
}

/** Load records filtered by vertical */
export function loadHistoryByVertical(vertical: VerticalSlug): EstimateRecord[] {
  return readStore().records.filter((r) => r.vertical === vertical);
}

/**
 * Returns true if this entity was already viewed in the current session.
 * Feeds directly into EscalationContext.repeatVisit.
 */
export function isRepeatVisit(id: string): boolean {
  return readSessionViews().has(id);
}

/** Clear all stored estimate history */
export function clearHistory(): void {
  if (!canUseLocal) return;
  try { localStorage.removeItem(MEMORY_KEY); } catch { /* silent */ }
}

/** Clear session view set (e.g. on logout or explicit reset) */
export function clearSessionViews(): void {
  if (!canUseSession) return;
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* silent */ }
}
