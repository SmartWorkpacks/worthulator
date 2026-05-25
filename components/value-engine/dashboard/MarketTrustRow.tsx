"use client";

// ── MarketTrustRow — compact single-row market trust signal ──────────────
// Replaces the two-panel ConfidenceCard + TrustLayer dashboard strip.
// Feels like a marketplace data-freshness indicator, not a SaaS KPI panel.

import { motion } from "framer-motion";
import type { EstimationType } from "@/lib/value-engine/types";

interface MarketTrustRowProps {
  confidenceRange:     [number, number];
  dataSource:          string;
  generatedAt:         string;
  type:                EstimationType;
  region:              string;
  regionalMultiplier?: number;
}

function rangeToConfidence(low: number, high: number): number {
  if (low === 0 && high === 0) return 40;
  const mid    = (low + high) / 2;
  const spread = (high - low) / mid;
  return Math.round(Math.max(30, Math.min(95, (1 - spread * 0.6) * 100)));
}

function timeAgo(iso: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000)    return "just now";
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)}m ago`;
  return `${Math.round(diff / 3_600_000)}h ago`;
}

const SOURCE_LABEL: Record<string, string> = {
  formula:          "Contractor pricing model",
  market:           "Live marketplace data",
  "registry-range": "Historical benchmarks",
  registry:         "Historical benchmarks",
};

export default function MarketTrustRow({
  confidenceRange,
  dataSource,
  generatedAt,
  type: _type,
  region,
  regionalMultiplier,
}: MarketTrustRowProps) {
  const pct = rangeToConfidence(confidenceRange[0], confidenceRange[1]);
  const dot =
    pct >= 80 ? "bg-emerald-500"
    : pct >= 60 ? "bg-sky-500"
    : "bg-amber-500";
  const label =
    pct >= 80 ? "High confidence"
    : pct >= 60 ? "Moderate confidence"
    : "Low confidence";
  const src = SOURCE_LABEL[dataSource] ?? SOURCE_LABEL["formula"];
  const ts  = timeAgo(generatedAt);

  const sep = <span className="text-zinc-300 select-none">·</span>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex flex-wrap items-center gap-x-3 gap-y-1.5"
    >
      {/* Quality indicator */}
      <span className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
        <span className="text-[12px] text-zinc-500">{label}</span>
      </span>

      {/* Expected range */}
      {confidenceRange[0] > 0 && (
        <>
          {sep}
          <span className="text-[12px] text-zinc-400">
            ${confidenceRange[0].toLocaleString()}–${confidenceRange[1].toLocaleString()} expected
          </span>
        </>
      )}

      {/* Source */}
      {sep}
      <span className="text-[12px] text-zinc-400">{src}</span>

      {/* Freshness */}
      {ts && (
        <>
          {sep}
          <span className="text-[12px] text-zinc-400">Updated {ts}</span>
        </>
      )}

      {/* Regional adjustment */}
      {regionalMultiplier && regionalMultiplier !== 1.0 && (
        <>
          {sep}
          <span className="text-[12px] text-zinc-400">
            Regional:{" "}
            <span className={regionalMultiplier > 1 ? "text-rose-600" : "text-emerald-600"}>
              {regionalMultiplier > 1 ? "+" : "−"}
              {Math.abs(Math.round((regionalMultiplier - 1) * 100))}%
            </span>
            {" "}for {region}
          </span>
        </>
      )}
    </motion.div>
  );
}
