"use client";

// ── Range Bar Chart — CSS-based, fully SSR-safe ────────────────────────────
// No recharts dependency. Renders a horizontal range visualization showing
// how estimate tiers compare visually.

import { motion } from "framer-motion";

interface RangeBarChartProps {
  low: number;
  average: number;
  premium: number;
  confidenceRange: [number, number];
}

function Bar({
  label,
  value,
  maxValue,
  color,
  delay,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  delay: number;
}) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <p className="w-16 shrink-0 text-right text-[11px] font-medium text-gray-400">{label}</p>
      <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-white/[0.05]">
        <motion.div
          className={`h-full rounded-md ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay, ease: "easeOut" }}
        />
      </div>
      <p className="w-20 shrink-0 text-[11px] font-semibold text-white">
        ${value.toLocaleString()}
      </p>
    </div>
  );
}

export default function RangeBarChart({
  low,
  average,
  premium,
  confidenceRange,
}: RangeBarChartProps) {
  const max = premium * 1.05; // slight padding above premium bar

  return (
    <div className="rounded-2xl border border-white/8 bg-gray-900 p-6">
      <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
        Estimate Range Breakdown
      </p>

      <div className="space-y-3">
        <Bar label="Budget"   value={low}     maxValue={max} color="bg-sky-400/70"     delay={0.1} />
        <Bar label="Standard" value={average} maxValue={max} color="bg-emerald-400/80" delay={0.2} />
        <Bar label="Premium"  value={premium} maxValue={max} color="bg-amber-400/70"   delay={0.3} />
      </div>

      {/* Confidence range callout */}
      <div className="mt-5 rounded-xl border border-white/6 bg-white/[0.03] px-4 py-3">
        <p className="text-[10px] text-gray-500 mb-1">80% confidence interval</p>
        <p className="text-sm font-semibold text-white">
          ${confidenceRange[0].toLocaleString()} – ${confidenceRange[1].toLocaleString()}
        </p>
        <p className="text-[10px] text-gray-600 mt-0.5">
          Most projects fall within this range
        </p>
      </div>
    </div>
  );
}
