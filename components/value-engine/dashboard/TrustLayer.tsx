"use client";

// ── TrustLayer — methodology section with consumer financial language ─────
// No developer terminology. No bullet lists. No source tag pills.
// Feels like a footnote in a premium financial report.

import { motion } from "framer-motion";
import type { EstimationType } from "@/lib/value-engine/types";

interface TrustLayerProps {
  type: EstimationType;
  dataSource: string;
  generatedAt: string;
  region: string;
  regionalMultiplier?: number;
  serviceType?: string;
}

// ── Consumer-language methodology copy ────────────────────────────────────
// Written for financial intelligence, not technical validation.
const METHODOLOGY_COPY: Record<string, { lead: string; detail: string }> = {
  "service-estimate": {
    lead:   "Based on contractor pricing trends and regional labour costs.",
    detail: "This estimate combines material costs, installation complexity, and local market conditions. The budget tier reflects standard materials; premium accounts for higher-grade equipment and experienced contractors. Always get 2–3 quotes before committing.",
  },
  "market-value": {
    lead:   "Sourced from current resale activity across major platforms.",
    detail: "Price reflects typical condition and current buyer demand. Rare editions, original packaging, or mint-condition items may command a premium above this range. Check active listings before buying or selling.",
  },
  "appreciation": {
    lead:   "Based on historical resale performance for this category.",
    detail: "Value is influenced by brand recognition, supply constraints, and collector demand. Condition, dial originality, and provenance significantly affect final price. For precise valuations, consult an authenticated dealer.",
  },
  "registry": {
    lead:   "Reference estimate based on historical market research.",
    detail: "Live marketplace data is not yet available for this item. This estimate reflects typical market ranges as of the last review period. Verify against current listings before making any decisions.",
  },
};

// ── Quality signal — one word, one dot ────────────────────────────────────
const QUALITY: Record<string, { word: string; dot: string }> = {
  formula:          { word: "Reliable",  dot: "bg-emerald-500"  },
  market:           { word: "Live data", dot: "bg-sky-500"       },
  "registry-range": { word: "Reference", dot: "bg-amber-500"    },
  registry:         { word: "Reference", dot: "bg-amber-500"    },
};

function timeAgo(iso: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000)    return "just now";
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)}m ago`;
  return `${Math.round(diff / 3_600_000)}h ago`;
}

export default function TrustLayer({
  type,
  dataSource,
  generatedAt,
  region,
}: TrustLayerProps) {
  const copyKey = dataSource === "registry" ? "registry" : type;
  const copy    = METHODOLOGY_COPY[copyKey] ?? METHODOLOGY_COPY["service-estimate"];
  const quality = QUALITY[dataSource] ?? QUALITY["formula"];
  const ts      = timeAgo(generatedAt);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
    >
      {/* Quality signal */}
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${quality.dot}`} />
        <p className="text-[11px] font-medium text-zinc-400">{quality.word}</p>
      </div>

      <p className="text-[13px] font-medium leading-[1.6] text-zinc-700">
        {copy.lead}
      </p>

      <p className="mt-2 text-[12px] leading-[1.7] text-zinc-500">
        {copy.detail}
      </p>

      {ts && (
        <p className="mt-4 text-[11px] text-zinc-400">
          Updated {ts}
          {region && region !== "United States" && <> · {region}</>}
        </p>
      )}
    </motion.div>
  );
}



