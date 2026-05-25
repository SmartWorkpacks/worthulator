// ─── WVE Analytics — Emitter — Phase 13 ──────────────────────────────────────
// Thin SSR-safe event emitter. Fires to:
//   1. window.dataLayer   — Google Tag Manager (if present)
//   2. CustomEvent        — for any internal DOM subscribers
//   3. console.debug      — in development only
// No external dependencies. Never throws — analytics must never break UX.

import type { WVEEvent } from "./types";

const SESSION_KEY = "wve_analytics_sid";

// ── Session ID ────────────────────────────────────────────────────────────────
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return stored;
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return "";
  }
}

// ── Core emit ─────────────────────────────────────────────────────────────────

/**
 * Emit a WVE analytics event.
 * SSR-safe: silently returns when called server-side.
 */
export function emit(event: WVEEvent): void {
  if (typeof window === "undefined") return;

  const enriched: WVEEvent = {
    ...event,
    timestamp: event.timestamp ?? Date.now(),
    sessionId: event.sessionId ?? getSessionId(),
  };

  // 1. Google Tag Manager dataLayer
  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event:     `wve_${enriched.name}`,
      wve:       enriched,
    });
  } catch {
    // dataLayer may be blocked by privacy extensions — ignore
  }

  // 2. Custom DOM event for internal subscribers
  try {
    window.dispatchEvent(
      new CustomEvent("wve:event", { detail: enriched }),
    );
  } catch {
    // ignore — CustomEvent not supported in test environments
  }

  // 3. Dev logging
  if (process.env.NODE_ENV === "development") {
    console.debug("[WVE analytics]", enriched.name, enriched);
  }
}

/**
 * Subscribe to WVE events via the DOM CustomEvent bus.
 * Returns an unsubscribe function.
 */
export function onEvent(
  handler: (event: WVEEvent) => void,
): () => void {
  if (typeof window === "undefined") return () => undefined;

  function listener(e: Event) {
    handler((e as CustomEvent<WVEEvent>).detail);
  }
  window.addEventListener("wve:event", listener);
  return () => window.removeEventListener("wve:event", listener);
}
