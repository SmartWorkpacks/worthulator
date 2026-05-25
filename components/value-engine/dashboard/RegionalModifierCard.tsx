"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface RegionalModifierCardProps {
  multiplier: number;
  region: string;
  adjustments: { name: string; multiplier: number; reason: string }[];
}

export default function RegionalModifierCard({
  multiplier,
  region,
  adjustments,
}: RegionalModifierCardProps) {
  const isAbove    = multiplier > 1.0;
  const isBelow    = multiplier < 1.0;
  const pctDiff    = Math.abs(Math.round((multiplier - 1) * 100));
  const direction  = isAbove ? "above" : isBelow ? "below" : "at";

  const accentColor = isAbove
    ? "text-rose-400"
    : isBelow
    ? "text-emerald-400"
    : "text-gray-400";

  const bgColor = isAbove
    ? "bg-rose-500/8 border-rose-500/15"
    : isBelow
    ? "bg-emerald-500/8 border-emerald-500/15"
    : "bg-white/5 border-white/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className="rounded-2xl border border-white/8 bg-gray-900 p-5"
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
          Regional Adjustment
        </p>
        <MapPin className="h-4 w-4 text-gray-500" />
      </div>

      {/* Multiplier hero */}
      <div className={`rounded-xl border px-4 py-3 mb-4 ${bgColor}`}>
        <p className={`text-2xl font-bold ${accentColor}`}>
          {multiplier.toFixed(2)}×
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {direction === "at"
            ? "National average — no regional adjustment"
            : `${pctDiff}% ${isAbove ? "above" : "below"} national average`}
        </p>
      </div>

      {/* Region label */}
      <div className="flex items-center gap-1.5 mb-4">
        <MapPin className="h-3 w-3 text-gray-500" />
        <p className="text-xs text-gray-400">{region}</p>
      </div>

      {/* Adjustments list */}
      {adjustments.length > 0 && (
        <div className="space-y-2">
          {adjustments.map((adj, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-500" />
              <p className="text-[11px] text-gray-500">{adj.reason}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
