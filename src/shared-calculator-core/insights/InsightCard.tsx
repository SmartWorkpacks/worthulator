"use client";

// ─── Shared Calculator Core — InsightCard ────────────────────────────────────
//
// ORIGIN:  Extracted from Worthulator (components/worthcore/InsightCard.tsx)
// CHANGES: Brand stripe color made configurable via `accentColor` prop.
//          Default is blue (VPPExchange) — override with any Tailwind gradient.
// USAGE:   Renders a single Insight. Severity controls indicator dot color.
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightSeverity } from "./types";

const SEVERITY_DOT: Record<InsightSeverity, string> = {
  positive: "bg-emerald-500",
  neutral:  "bg-gray-400",
  warning:  "bg-amber-400",
  critical: "bg-red-400",
};

interface InsightCardProps {
  insight:      Insight;
  /** Tailwind gradient classes for the top accent stripe. Defaults to blue. */
  accentClass?: string;
}

export default function InsightCard({
  insight,
  accentClass = "from-blue-400 to-blue-600",
}: InsightCardProps) {
  const severityKey: InsightSeverity =
    insight.severity ??
    (insight.type === "warning" || insight.type === "critical"
      ? (insight.type as InsightSeverity)
      : "neutral");

  const dot   = SEVERITY_DOT[severityKey] ?? "bg-gray-400";
  const title = insight.title   ?? insight.message;
  const body  = insight.body    ?? insight.detail;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Thin accent top stripe — swap `accentClass` for your brand */}
      <div className={`h-0.5 bg-linear-to-r ${accentClass}`} />

      {/* Text block */}
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
          <div className="min-w-0 space-y-1.5">
            <p className="text-sm font-semibold leading-snug text-gray-900">{title}</p>
            <p className="text-sm leading-relaxed text-gray-500">{body}</p>
          </div>
        </div>

        {insight.metric && (
          <div className="shrink-0 text-right">
            <p className="text-lg font-bold leading-tight text-blue-600">
              {insight.metric.value}
            </p>
            <p className="text-xs text-gray-400">{insight.metric.label}</p>
          </div>
        )}
      </div>
    </div>
  );
}
