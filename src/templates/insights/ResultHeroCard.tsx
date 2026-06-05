"use client";

import { motion } from "framer-motion";
import { useCountUp } from "@/src/templates/shared/useCountUp";

/**
 * ─── ResultHeroCard ───────────────────────────────────────────────────────────
 *
 * Shared dark "headline result" card — generalised from the Freelance Rate
 * Calculator's hero. One big count-up number with an accent glow, an optional
 * status note, and a grid of up to four supporting count-up stats.
 *
 * Every number animates via the shared `useCountUp` hook once `countUpActive`
 * flips true (drive it from `useStagedReveal`).
 *
 * Usage:
 *   <ResultHeroCard
 *     eyebrow={`${modeLabel} mode`}
 *     primaryValue={Math.round(result.minimumHourlyRate)}
 *     primaryFormat={(n) => `$${n}`}
 *     primaryUnit="/hr"
 *     accentColor="#34d399"
 *     note={result.isUndercharging
 *       ? { text: `Undercharging by $${gap}/hr`, tone: "warning" }
 *       : { text: "Your current rate covers this", tone: "positive" }}
 *     subStats={[
 *       { label: "Monthly", value: monthly, format: fmt, sub: "revenue target" },
 *       { label: "Annual",  value: annual,  format: fmt, sub: "total needed" },
 *       { label: "Billed hrs", value: result.billableHoursPerYear, sub: "per year" },
 *     ]}
 *     countUpActive={countUpActive}
 *   />
 */

export interface HeroSubStat {
  label: string;
  value: number;
  format?: (n: number) => string;
  sub?: string;
}

interface ResultHeroCardProps {
  eyebrow: string;
  primaryValue: number;
  primaryFormat?: (n: number) => string;
  primaryUnit?: string;
  accentColor?: string;
  note?: { text: string; tone: "positive" | "warning" };
  subStats?: HeroSubStat[];
  countUpActive: boolean;
}

function SubStat({ stat, accentColor, active }: { stat: HeroSubStat; accentColor: string; active: boolean }) {
  const v = useCountUp(Math.round(stat.value), active, 1100);
  const fmt = stat.format ?? ((n: number) => `${n}`);
  return (
    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm sm:p-4">
      <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest" style={{ color: accentColor + "80" }}>
        {stat.label}
      </p>
      <p className="text-lg font-black leading-none tabular-nums sm:text-2xl">{fmt(v)}</p>
      {stat.sub && <p className="mt-1 text-[9px]" style={{ color: accentColor + "60" }}>{stat.sub}</p>}
    </div>
  );
}

export function ResultHeroCard({
  eyebrow,
  primaryValue,
  primaryFormat = (n) => `$${n}`,
  primaryUnit,
  accentColor = "#34d399",
  note,
  subStats = [],
  countUpActive,
}: ResultHeroCardProps) {
  const primary = useCountUp(Math.round(primaryValue), countUpActive, 1200);
  const cols = subStats.length >= 4 ? "grid-cols-2 sm:grid-cols-4" : subStats.length === 3 ? "grid-cols-3" : subStats.length === 2 ? "grid-cols-2" : "grid-cols-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl text-white shadow-2xl"
      style={{ background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{ background: `radial-gradient(ellipse at 30% 50%, ${accentColor} 0%, transparent 60%)` }}
      />

      <div className="relative z-10 p-6 sm:p-8">
        <div className="mb-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accentColor + "bb" }}>
            {eyebrow}
          </p>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black leading-none tabular-nums sm:text-6xl">{primaryFormat(primary)}</span>
            {primaryUnit && (
              <span className="pb-1.5 text-lg font-bold" style={{ color: accentColor + "99" }}>{primaryUnit}</span>
            )}
          </div>
          {note && (
            <p className={"mt-2 text-xs font-semibold " + (note.tone === "warning" ? "text-red-400" : "text-emerald-400/80")}>
              {note.text}
            </p>
          )}
        </div>

        {subStats.length > 0 && (
          <div className={"grid gap-2 sm:gap-3 " + cols}>
            {subStats.map((s) => (
              <SubStat key={s.label} stat={s} accentColor={accentColor} active={countUpActive} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
