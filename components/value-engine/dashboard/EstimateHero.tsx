"use client";

// ── EstimateHero — typographic estimate presentation, no card borders ──────
// The number is the emotional anchor. Space and hierarchy do the work.

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { EstimationType } from "@/lib/value-engine/types";

interface EstimateHeroProps {
  low:             number;
  average:         number;
  premium:         number;
  type:            EstimationType;
  region:          string;
  confidenceRange: [number, number];
  genAt:           string;
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

function CountUp({
  target,
  duration = 900,
  prefix   = "$",
}: {
  target:    number;
  duration?: number;
  prefix?:   string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || target === 0) return;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      if (ref.current) {
        ref.current.textContent = prefix + Math.round(target * eased).toLocaleString();
      }
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration, prefix]);

  return <span ref={ref}>{prefix}0</span>;
}

const HERO_SUBLABEL: Record<string, string> = {
  "service-estimate": "national average estimate",
  "market-value":     "mid-range market value",
  "appreciation":     "estimated current value",
};

const TIER_LABELS: Record<string, readonly [string, string, string]> = {
  "service-estimate": ["Budget",  "Standard", "Premium"] as const,
  "market-value":     ["Low",     "Mid",      "High"]    as const,
  "appreciation":     ["Low",     "Mid",      "High"]    as const,
};

export default function EstimateHero({
  low,
  average,
  premium,
  type,
  region,
  confidenceRange,
  genAt,
}: EstimateHeroProps) {
  const sublabel = HERO_SUBLABEL[type] ?? "estimate";
  const tiers    = TIER_LABELS[type]   ?? (["Low", "Mid", "High"] as const);

  const pct      = rangeToConfidence(confidenceRange[0], confidenceRange[1]);
  const confDot  = pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-sky-500" : "bg-amber-500";
  const confText = pct >= 80 ? "text-emerald-700" : pct >= 60 ? "text-sky-700" : "text-amber-600";
  const confLabel = pct >= 80 ? "High confidence" : pct >= 60 ? "Moderate confidence" : "Low confidence";
  const ts       = timeAgo(genAt);

  return (
    <div className="pb-10 pt-2">
      {/* ── Central figure ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mb-3"
      >
        <p className="text-[clamp(3.5rem,9vw,6rem)] font-bold leading-none tracking-[-0.04em] text-[#111111]">
          <CountUp target={average} duration={950} />
        </p>
      </motion.div>

      {/* ── Sublabel ───────────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8 text-sm text-gray-400"
      >
        {sublabel}
        {region && region !== "United States" && (
          <>
            <span className="mx-2 text-gray-300">·</span>
            <span className="text-gray-500">{region}</span>
          </>
        )}
      </motion.p>

      {/* ── Tier cards — Amazon-style pricing options ────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        className="flex flex-wrap gap-3"
      >
        {/* Budget */}
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 min-w-[110px]">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-500 mb-1">{tiers[0]}</p>
          <p className="text-[1.25rem] font-bold leading-none text-sky-700">${low.toLocaleString()}</p>
        </div>

        {/* Standard — featured */}
        <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50 px-4 py-3 min-w-[110px] shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 mb-1 flex items-center gap-1">
            {tiers[1]} <span className="text-emerald-500">✓</span>
          </p>
          <p className="text-[1.25rem] font-bold leading-none text-emerald-700">${average.toLocaleString()}</p>
        </div>

        {/* Premium */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 min-w-[110px]">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-500 mb-1">{tiers[2]}</p>
          <p className="text-[1.25rem] font-bold leading-none text-amber-700">${premium.toLocaleString()}</p>
        </div>
      </motion.div>

      {/* ── Market vitals — Zillow/KBB confidence row ──────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.28 }}
        className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5"
      >
        <span className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${confDot}`} />
          <span className={`text-[12px] font-medium ${confText}`}>{confLabel}</span>
        </span>
        {confidenceRange[0] > 0 && (
          <>
            <span className="text-zinc-300 select-none">·</span>
            <span className="text-[12px] text-zinc-400">
              ${confidenceRange[0].toLocaleString()}–${confidenceRange[1].toLocaleString()} expected
            </span>
          </>
        )}
        {ts && (
          <>
            <span className="text-zinc-300 select-none">·</span>
            <span className="text-[12px] text-zinc-400">Updated {ts}</span>
          </>
        )}
      </motion.div>
    </div>
  );
}
