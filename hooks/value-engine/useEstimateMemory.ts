"use client";
// ─── WVE: useEstimateMemory — Phase 13 ───────────────────────────────────────
// React hook for the estimation memory layer.
// Reads/writes localStorage; exposes history and repeat-visit signal.
// SSR-safe: storage operations only run in useEffect (client-only).

import { useState, useEffect, useCallback } from "react";
import {
  saveEstimate,
  loadHistory,
  loadHistoryByVertical,
  isRepeatVisit,
  clearHistory as clearStore,
} from "@/lib/value-engine/memory/storage";
import type { EstimateRecord } from "@/lib/value-engine/memory/types";
import type { EstimationType, VerticalSlug } from "@/lib/value-engine/types";

// ── Hook input ────────────────────────────────────────────────────────────────
export interface UseEstimateMemoryOptions {
  /** When provided, auto-records a view on mount */
  autoRecord?: {
    id: string;
    entityName: string;
    type: EstimationType;
    vertical: VerticalSlug;
    serviceType?: string;
    estimateAmount?: number;
    region?: string;
    href: string;
  };
  /** Filter history to a specific vertical */
  filterVertical?: VerticalSlug;
}

// ── Hook output ───────────────────────────────────────────────────────────────
export interface UseEstimateMemoryResult {
  /** All stored estimate records (newest first), or vertical-filtered if provided */
  history: EstimateRecord[];
  /** Whether the current entity was viewed in a prior session */
  isRepeat: boolean;
  /** Current session view count for the auto-recorded entity */
  viewCount: number;
  /** Manually record an estimate */
  record: (input: Omit<EstimateRecord, "viewCount" | "estimatedAt">) => void;
  /** Clear all history */
  clearHistory: () => void;
}

export function useEstimateMemory(
  options: UseEstimateMemoryOptions = {},
): UseEstimateMemoryResult {
  const { autoRecord, filterVertical } = options;

  const [history, setHistory]   = useState<EstimateRecord[]>([]);
  const [isRepeat, setIsRepeat] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  // Load + optionally auto-record on mount
  useEffect(() => {
    // Check repeat before recording (so first-session flag is accurate)
    if (autoRecord) {
      const repeat = isRepeatVisit(autoRecord.id);
      setIsRepeat(repeat);

      const saved = saveEstimate(autoRecord);
      setViewCount(saved.viewCount);
    }

    // Reload history after potential write
    const records = filterVertical
      ? loadHistoryByVertical(filterVertical)
      : loadHistory();
    setHistory(records);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const record = useCallback(
    (input: Omit<EstimateRecord, "viewCount" | "estimatedAt">) => {
      saveEstimate(input);
      const records = filterVertical
        ? loadHistoryByVertical(filterVertical)
        : loadHistory();
      setHistory(records);
    },
    [filterVertical],
  );

  const clearHistory = useCallback(() => {
    clearStore();
    setHistory([]);
    setViewCount(0);
  }, []);

  return { history, isRepeat, viewCount, record, clearHistory };
}
