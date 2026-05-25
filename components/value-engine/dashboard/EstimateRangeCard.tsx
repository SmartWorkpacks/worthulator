"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import type { EstimationType } from "@/lib/value-engine/types";

interface EstimateRangeCardProps {
  low: number;
  average: number;
  premium: number;
  type: EstimationType;
  entityName: string;
  region: string;
}

function CountUp({ target, duration = 1200, prefix = "$" }: { target: number; duration?: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const start     = performance.now();
    const startVal  = 0;

    function tick(now: number) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(startVal + (target - startVal) * eased);
      if (ref.current) {
        ref.current.textContent = prefix + current.toLocaleString();
      }
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [target, duration, prefix]);

  return <span ref={ref}>{prefix}0</span>;
}

const TYPE_LABEL: Record<string, string> = {
  "service-estimate": "Project Cost Estimate",
  "market-value":     "Market Resale Value",
  "appreciation":     "Estimated Value",
};

export default function EstimateRangeCard({
  low,
  average,
  premium,
  type,
  entityName,
  region,
}: EstimateRangeCardProps) {
  const label = TYPE_LABEL[type] ?? "Estimate";

  // Tier labels depend on type — quality tiers for projects, price range for market values
  const tierLabels: [string, string, string] = type === "service-estimate"
    ? ["Budget", "Standard", "Premium"]
    : ["Low",    "Mid",      "High"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={[
        "rounded-2xl border border-white/8 bg-gray-900",
        "p-6 shadow-[0_0_40px_rgba(52,211,153,0.07)]",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
            {label}
          </p>
          <p className="mt-0.5 text-sm font-medium text-gray-300 truncate max-w-[240px]">
            {entityName}
          </p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
        </div>
      </div>

      {/* Hero average */}
      <div className="mb-6">
        <p className="text-[11px] text-gray-500 mb-1">
          {type === "service-estimate" ? "National average estimate" : "Mid-range market value"}
        </p>
        <p className="text-[clamp(2.4rem,6vw,3.5rem)] font-bold leading-none tracking-tight text-white">
          <CountUp target={average} duration={900} />
        </p>
        {region && region !== "United States" && (
          <p className="mt-1.5 text-xs text-gray-500">{region}</p>
        )}
      </div>

      {/* Low / Mid / High row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: tierLabels[0], value: low,     accent: "text-sky-400",     bg: "bg-sky-500/8",     border: "border-sky-500/15" },
          { label: tierLabels[1], value: average, accent: "text-emerald-400", bg: "bg-emerald-500/8", border: "border-emerald-500/20" },
          { label: tierLabels[2], value: premium, accent: "text-amber-400",   bg: "bg-amber-500/8",   border: "border-amber-500/15" },
        ].map(({ label: tl, value, accent, bg, border }) => (
          <div
            key={tl}
            className={`rounded-xl border ${border} ${bg} px-3 py-2.5 text-center`}
          >
            <p className={`text-base font-bold ${accent}`}>
              ${value.toLocaleString()}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500">{tl}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
