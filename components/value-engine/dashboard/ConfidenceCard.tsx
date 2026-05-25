"use client";

import { motion } from "framer-motion";

interface ConfidenceCardProps {
  confidenceRange: [number, number];
  dataSource: string;
}

function ConfidenceBar({ pct }: { pct: number }) {
  const color =
    pct >= 80 ? "bg-emerald-400"
    : pct >= 60 ? "bg-sky-400"
    : "bg-amber-400";

  return (
    <div className="relative h-1 w-full overflow-hidden rounded-full bg-black/[0.08]">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

// Derive a confidence percentage from the range spread relative to midpoint
function rangeToConfidence(low: number, high: number): number {
  if (low === 0 && high === 0) return 40;
  const mid     = (low + high) / 2;
  const spread  = (high - low) / mid; // coefficient of variation
  // Tight spread → high confidence. Spread > 1.0 → low confidence.
  const pct = Math.round(Math.max(30, Math.min(95, (1 - spread * 0.6) * 100)));
  return pct;
}

export default function ConfidenceCard({
  confidenceRange,
  dataSource,
}: ConfidenceCardProps) {
  const pct = rangeToConfidence(confidenceRange[0], confidenceRange[1]);

  const confidenceLabel =
    pct >= 80 ? "High Confidence"
    : pct >= 60 ? "Moderate Confidence"
    : "Low Confidence";

  const confidenceColor =
    pct >= 80 ? "text-emerald-700"
    : pct >= 60 ? "text-sky-700"
    : "text-amber-600";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="shrink-0"
    >
      <p className="mb-3 text-[11px] font-medium text-zinc-400">Estimate confidence</p>

      <div className="flex items-baseline gap-2">
        <p className={`text-[2.8rem] font-semibold leading-none tracking-tight ${confidenceColor}`}>{pct}%</p>
      </div>
      <p className={`mt-1 text-[11px] ${confidenceColor}`}>{confidenceLabel}</p>

      <div className="mt-4 w-24">
        <ConfidenceBar pct={pct} />
      </div>

      <p className="mt-4 text-[11px] text-zinc-400">
        ${confidenceRange[0].toLocaleString()}–${confidenceRange[1].toLocaleString()} expected
      </p>
    </motion.div>
  );
}
