"use client";

// ── MarketBreakdown — structured market intelligence, KBB/Zillow-style ───
// Replaces the flowing editorial narrative.
// Concise factual rows. Market-aware. Not "What this means" — "Market breakdown".

import { motion } from "framer-motion";
import type { EstimationType } from "@/lib/value-engine/types";

interface MarketBreakdownProps {
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

type Factor = { label: string; value: string };

function serviceFactors(
  region: string,
  multiplier: number,
): Factor[] {
  const factors: Factor[] = [
    { label: "Labour",       value: "Typically 40–60% of total project cost" },
    { label: "Materials",    value: "Standard vs. premium-grade equipment and parts" },
    { label: "Installation", value: "Scope, site access, and project complexity" },
    { label: "Permits",      value: "May be required depending on jurisdiction" },
  ];
  if (multiplier !== 1.0 && region !== "United States") {
    const pct = Math.abs(Math.round((multiplier - 1) * 100));
    const dir = multiplier > 1 ? "above" : "below";
    factors.push({ label: "Your region", value: `${region} — ${pct}% ${dir} the national average` });
  }
  return factors;
}

function marketFactors(): Factor[] {
  return [
    { label: "Condition",  value: "Used / good condition reflects typical buyer expectations" },
    { label: "Demand",     value: "Current buyer activity across major resale platforms" },
    { label: "Platform",   value: "Prices vary 15–25% between eBay, StockX, and specialty markets" },
    { label: "Timing",     value: "Recent sold listings are weighted more heavily" },
  ];
}

function appreciationFactors(): Factor[] {
  return [
    { label: "Collectibility", value: "Brand recognition, scarcity, and desirability index" },
    { label: "Condition",      value: "Original parts, dial integrity, box and papers" },
    { label: "Provenance",     value: "Service history and ownership documentation" },
    { label: "Market",         value: "Secondary market demand and recent auction results" },
  ];
}

const CONTEXT_NOTE: Record<EstimationType, (ds: string) => string> = {
  "service-estimate": () =>
    "Get 2–3 quotes from licensed contractors before committing to any number.",
  "market-value": (ds) =>
    ds === "registry"
      ? "Live marketplace data is not yet available for this item. Verify against current listings before transacting."
      : "Check active listings on eBay, StockX, or specialty resale platforms before buying or selling.",
  "appreciation": () =>
    "For precise valuations, consult an authenticated dealer or reputable auction house.",
};

export default function MarketBreakdown({
  type,
  entityName: _entityName,
  region,
  regionalMultiplier,
  dataSource,
}: MarketBreakdownProps) {
  const factors =
    type === "service-estimate" ? serviceFactors(region, regionalMultiplier)
    : type === "appreciation"   ? appreciationFactors()
    :                             marketFactors();

  const note = CONTEXT_NOTE[type]?.(dataSource) ?? "";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.22 }}
    >
      {/* Section label */}
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
        Market breakdown
      </p>

      {/* Factor rows — KBB / Carfax-style structured data */}
      <div className="divide-y divide-black/[0.05] border-y border-black/[0.05]">
        {factors.map((f) => (
          <div key={f.label} className="flex items-baseline gap-4 py-3">
            <span className="w-28 shrink-0 text-[12px] font-medium text-zinc-400">
              {f.label}
            </span>
            <span className="text-[14px] leading-snug text-[#111111]">
              {f.value}
            </span>
          </div>
        ))}
      </div>

      {/* Actionable context note */}
      {note && (
        <p className="mt-4 text-[13px] leading-relaxed text-zinc-400">{note}</p>
      )}
    </motion.section>
  );
}
