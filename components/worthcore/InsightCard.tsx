"use client";

// ─── InsightCard ──────────────────────────────────────────────────────────────
//
// Renders a single WorthCore Insight as a styled card.
// Severity controls the color scheme. Category is not visually distinguished
// at this level — Phase 6C will add category icons.
//
// SAFETY:
//   ✅ No async rendering
//   ✅ Pure props → UI mapping
//   ✅ No hydration risk (static structure, no useEffect)
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightSeverity } from "@/lib/insights/types";
import InsightVisual from "@/components/worthcore/visuals/InsightVisual";

// ─── Severity → dot color only ──────────────────────────────────────────────────
// All cards are white with a thin emerald top accent stripe. Severity is
// signalled only by the indicator dot — no pastel tinting.

const SEVERITY_DOT: Record<InsightSeverity, string> = {
  positive: "bg-emerald-500",
  neutral:  "bg-gray-400",
  warning:  "bg-amber-400",
  critical: "bg-red-400",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface InsightCardProps {
  insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  // Support both new-format (severity) and legacy-format (type) generators
  const severityKey: InsightSeverity =
    insight.severity ??
    (insight.type === "warning" || insight.type === "critical"
      ? (insight.type as InsightSeverity)
      : "neutral");
  const dot = SEVERITY_DOT[severityKey] ?? "bg-gray-400";
  const title = insight.title ?? insight.message;
  const body  = insight.body  ?? insight.detail;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Thin emerald top stripe — unified WorthCore brand signal */}
      <div className="h-0.5 bg-linear-to-r from-emerald-400 to-emerald-600" />

      {/* Visual block — rendered above text */}
      {insight.visualization && (
        <div className="px-4 pt-4">
          <InsightVisual vis={insight.visualization} />
        </div>
      )}

      {/* Text block */}
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span
            className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${dot}`}
            aria-hidden="true"
          />
          <div className="min-w-0 space-y-1.5">
            <p className="text-sm font-semibold leading-snug text-gray-900">
              {title}
            </p>
            <p className="text-sm leading-relaxed text-gray-500">
              {body}
            </p>
          </div>
        </div>

        {insight.metric && (
          <div className="shrink-0 text-right">
            <p className="text-lg font-bold leading-tight text-emerald-600">
              {insight.metric.value}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {insight.metric.label}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
