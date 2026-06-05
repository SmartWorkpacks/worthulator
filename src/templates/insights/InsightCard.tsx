"use client";

import { motion } from "framer-motion";

/**
 * ─── InsightCard / InsightList ────────────────────────────────────────────────
 *
 * Shared "smart insight" card — the colour-coded, stat-led insight blocks
 * pioneered by the Freelance Rate Calculator. Each insight states one plain
 * fact with a leading figure (e.g. "$42/hr undercharging gap — …").
 *
 * Tone:
 *   - positive  → emerald, for surplus / good-news facts
 *   - warning   → red, for a gap / risk / overspend
 *   - neutral   → blue, for a contextual fact
 *
 * The leading stat (currency / %, /hr, k, etc.) is auto-extracted and rendered
 * larger so the number leads. Cards self-animate (fade-up, staggered by index).
 *
 * Usage:
 *   const insights: Insight[] = [
 *     { tone: "warning",  text: `$${gap}/hr undercharging gap — you are missing ${fmt(annualGap)} a year.` },
 *     { tone: "neutral",  text: `${billable} billable hours/yr — ${lost} hrs lost to admin at ${util}% utilisation.` },
 *   ];
 *   <InsightList insights={insights} />
 */

export type InsightTone = "positive" | "warning" | "neutral";

export interface Insight {
  tone: InsightTone;
  text: string;
}

const TONE = {
  positive: { wrap: "border-emerald-100 bg-white", bar: "bg-emerald-500", stat: "text-emerald-700", body: "text-gray-600" },
  warning:  { wrap: "border-red-100 bg-red-50",    bar: "bg-red-500",     stat: "text-red-700",     body: "text-red-700"  },
  neutral:  { wrap: "border-blue-100 bg-white",    bar: "bg-blue-400",    stat: "text-blue-700",    body: "text-gray-600" },
} as const;

export function InsightCard({ tone, text, index = 0 }: Insight & { index?: number }) {
  // Pull the leading figure (e.g. "$42/hr", "1,400 hrs", "23%") so it can lead.
  const statMatch = text.match(/^([^]+?[$\d][\w,%.k/hr]+)/);
  const stat = statMatch ? statMatch[1].trim() : null;
  const body = stat ? text.slice(stat.length).replace(/^[\s\-—,]+/, "") : text;
  const s = TONE[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={"flex items-stretch overflow-hidden rounded-xl border " + s.wrap}
    >
      <div className={"w-1 shrink-0 " + s.bar} />
      <div className="flex-1 px-4 py-3.5">
        {stat && <p className={"mb-0.5 text-base font-black tabular-nums " + s.stat}>{stat}</p>}
        <p className={"text-sm leading-relaxed " + s.body}>{body}</p>
      </div>
    </motion.div>
  );
}

export function InsightList({ insights, startIndex = 0 }: { insights: Insight[]; startIndex?: number }) {
  return (
    <>
      {insights.map((ins, i) => (
        <InsightCard key={i} tone={ins.tone} text={ins.text} index={startIndex + i} />
      ))}
    </>
  );
}
