"use client";
// ─── WVE: useAnalytics — Phase 13 ────────────────────────────────────────────
// React hook that provides a stable `track` function bound to the WVE emitter.
// SSR-safe: emit() itself guards against window access.

import { useCallback } from "react";
import { emit } from "@/lib/value-engine/analytics/emitter";
import type { WVEEvent } from "@/lib/value-engine/analytics/types";

export interface UseAnalyticsResult {
  /** Fire a WVE analytics event */
  track: (event: WVEEvent) => void;
}

export function useAnalytics(): UseAnalyticsResult {
  const track = useCallback((event: WVEEvent) => emit(event), []);
  return { track };
}
