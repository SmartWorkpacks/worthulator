"use client";

// ── EstimateNarrative — consumer-language interpretation of the estimate ───
// Replaces technical card stacking with one flowing explanation.
// Tone: economically intelligent, calm, financially literate.

import { motion } from "framer-motion";
import type { EstimationType } from "@/lib/value-engine/types";

interface EstimateNarrativeProps {
  low:                number;
  average:            number;
  premium:            number;
  type:               EstimationType;
  entityName:         string;
  region:             string;
  regionalMultiplier: number;
  dataSource:         string;
  serviceType?:       string;
}

function fmt(n: number) {
  return "$" + n.toLocaleString();
}

function regionalSentence(multiplier: number, region: string): string {
  if (multiplier === 1.0 || region === "United States") return "";
  const pct = Math.abs(Math.round((multiplier - 1) * 100));
  const dir = multiplier > 1 ? "above" : "below";
  return `Labour and material costs in ${region} run approximately ${pct}% ${dir} the national average, which is reflected in this estimate.`;
}

export default function EstimateNarrative({
  low,
  average,
  premium,
  type,
  entityName,
  region,
  regionalMultiplier,
  dataSource,
}: EstimateNarrativeProps) {
  if (average === 0) return null;

  const regNote = regionalSentence(regionalMultiplier, region);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.22 }}
    >
      <p className="mb-4 text-[11px] font-medium text-zinc-500">
        What this means
      </p>

      <div className="space-y-4 text-[1rem] leading-[1.85] text-zinc-600 max-w-2xl">

        {/* ── Service estimates ────────────────────────────────────── */}
        {type === "service-estimate" && (
          <>
            <p>
              A typical{" "}
              <span className="text-gray-900 font-semibold">{entityName}</span>{" "}
              runs between{" "}
              <span className="text-sky-700 font-medium">{fmt(low)}</span> and{" "}
              <span className="text-amber-700 font-medium">{fmt(premium)}</span>,
              with most projects landing around{" "}
              <span className="text-emerald-700 font-medium">{fmt(average)}</span>.
            </p>
            {regNote && <p className="text-gray-500">{regNote}</p>}
            <p>
              The lower end reflects budget materials and a straightforward installation.
              Premium estimates include higher-grade equipment, more complex scenarios, and
              additional contractor margin for specialized work.
            </p>
            <p className="text-[13px] text-zinc-400">
              Labour typically accounts for 40–60% of total project cost. Get 2–3 quotes from
              licensed contractors before committing to any number.
            </p>
          </>
        )}

        {/* ── Market values ─────────────────────────────────────────── */}
        {type === "market-value" && (
          <>
            <p>
              A used{" "}
              <span className="text-gray-900 font-semibold">{entityName}</span>{" "}
              is currently trading between{" "}
              <span className="text-sky-700 font-medium">{fmt(low)}</span> and{" "}
              <span className="text-amber-700 font-medium">{fmt(premium)}</span>{" "}
              across major resale platforms. The mid-range of{" "}
              <span className="text-emerald-700 font-medium">{fmt(average)}</span>{" "}
              reflects typical condition and demand.
            </p>
            {dataSource === "registry" ? (
              <p className="text-[13px] text-zinc-400">
                This is a reference estimate based on historical market research. Live
                marketplace prices may vary. Check current listings before buying or selling.
              </p>
            ) : (
              <p className="text-[13px] text-zinc-400">
                Prices shift based on condition, storage, original packaging, and current
                supply. Check active listings on StockX, eBay, and Amazon before transacting.
              </p>
            )}
          </>
        )}

        {/* ── Appreciation / collectibles ───────────────────────────── */}
        {type === "appreciation" && (
          <>
            <p>
              The{" "}
              <span className="text-gray-900 font-semibold">{entityName}</span>{" "}
              has demonstrated consistent market demand, with authenticated sales ranging from{" "}
              <span className="text-sky-700 font-medium">{fmt(low)}</span> to{" "}
              <span className="text-amber-700 font-medium">{fmt(premium)}</span>.
              Current mid-market value is approximately{" "}
              <span className="text-emerald-700 font-medium">{fmt(average)}</span>.
            </p>
            <p>
              Appreciation in this category is driven by brand recognition, limited supply, and
              collector demand. Condition, dial originality, and provenance significantly affect
              final value.
            </p>
            <p className="text-[13px] text-zinc-400">
              For precise valuations, reference recent authenticated sales or consult a
              certified appraiser. All estimates are indicative.
            </p>
          </>
        )}

      </div>
    </motion.div>
  );
}
