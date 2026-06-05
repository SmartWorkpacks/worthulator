"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalcDisclaimer } from "@/src/templates/take-home-pay";
import WorthulatorProgressLoader from "@/src/templates/shared/WorthulatorProgressLoader";
import WorthulatorResultReveal from "@/src/templates/shared/WorthulatorResultReveal";
import {
  useStagedReveal,
  ResultHeroCard,
  InsightList,
  type Insight,
  ImpactLineChart,
  SectionLabel,
} from "@/src/templates/insights";
import { calculateAge, US_LIFE_EXPECTANCY_YEARS } from "@/lib/calculators/ageEngine";

/* --- helpers --------------------------------------------------------------- */

function fmtNum(v: number) {
  return Math.round(v).toLocaleString("en-US");
}
function fmtCompact(v: number) {
  const a = Math.abs(Math.round(v));
  if (a >= 1_000_000) return `${(a / 1_000_000).toFixed(1)}M`;
  if (a >= 10_000) return `${(a / 1_000).toFixed(0)}k`;
  return a.toLocaleString("en-US");
}
function localTodayISO() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${mm}-${dd}`;
}
function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

const CALC_STEPS = [
  "Reading your birth date...",
  "Counting every day since...",
  "Finding your next birthday...",
  "Projecting your milestones...",
];

const ACCENT = "#a78bfa";

/* --- local date field (no kit equivalent — calculator-specific) ----------- */

function DateField({
  label,
  hint,
  value,
  onChange,
  max,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  max?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">{label}</p>
      {hint && <p className="-mt-0.5 mb-1 text-[11px] leading-snug text-gray-400">{hint}</p>}
      <input
        type="date"
        value={value}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold text-gray-900 transition-colors focus:border-gray-400 focus:outline-none"
      />
    </div>
  );
}

/* --- birthday weekday table (calculator-specific) -------------------------- */

function BirthdayTable({ result }: { result: ReturnType<typeof calculateAge> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-xl border border-gray-100 bg-white"
    >
      <div className="border-b border-gray-50 px-4 pb-2 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your next 5 birthdays</p>
        <p className="mt-0.5 text-xs text-gray-400">Which weekday each one lands on</p>
      </div>
      <div className="divide-y divide-gray-50">
        {result.birthdays.slice(0, 5).map((b) => {
          const isWeekend = b.weekday === "Saturday" || b.weekday === "Sunday";
          return (
            <div key={b.turning} className="flex w-full items-center gap-4 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900">Turning {b.turning}</p>
                <p className="mt-0.5 text-xs text-gray-400">{b.label}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className={"text-sm font-black " + (isWeekend ? "text-violet-600" : "text-gray-700")}>
                  {b.weekday}
                  {isWeekend ? " 🎉" : ""}
                </p>
                <p className="mt-0.5 text-[10px] text-gray-400">
                  {b.daysFromNow === 0 ? "today" : `in ${fmtNum(b.daysFromNow)} days`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ========================================================================== */

export default function AgeCalculator() {
  const [today] = useState(localTodayISO);
  const [birthDate, setBirthDate] = useState("1990-06-15");
  const [asOf, setAsOf] = useState(today);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  const result = calculateAge({ birthDateISO: birthDate, asOfDateISO: asOf });
  const { nextBirthday: nb, nextThousandDayMilestone: milestone, billionSeconds: billion } = result;

  const insights: Insight[] = [];
  if (result.valid) {
    insights.push({
      tone: "neutral",
      text: `${fmtNum(result.daysLived)} days on Earth — ${fmtNum(result.weeksLived)} weeks, or about ${fmtCompact(result.hoursLived)} hours, since ${result.birthDateLabel} (a ${result.dayOfWeekBorn}).`,
    });
    insights.push(
      nb.isToday
        ? { tone: "positive", text: `🎂 It's your birthday — you turn ${nb.turning} today, ${nb.label}.` }
        : { tone: "neutral", text: `${fmtNum(nb.daysUntil)} days until your ${ordinal(nb.turning)} birthday — ${nb.label} falls on a ${nb.weekday}.` },
    );
    insights.push({
      tone: "neutral",
      text: `${fmtNum(milestone.days)}-day milestone on ${milestone.label} — ${fmtNum(milestone.daysUntil)} days away.`,
    });
    insights.push(
      billion.crossed
        ? { tone: "neutral", text: `1,000,000,000 seconds — you crossed it on ${billion.label}, around age ${billion.ageAtCrossYears}. Most people never notice it happen.` }
        : { tone: "positive", text: `1,000,000,000 seconds arrives on ${billion.label} — you'll be about ${billion.ageAtCrossYears} years old.` },
    );
    insights.push(
      result.lifespanSharePct > 100
        ? { tone: "positive", text: `${result.lifespanSharePct}% of the typical US lifespan (${US_LIFE_EXPECTANCY_YEARS} yrs, CDC 2024 data) — you're past the average, and every year now beats the curve.` }
        : { tone: "neutral", text: `${result.lifespanSharePct}% of a typical US lifespan (${US_LIFE_EXPECTANCY_YEARS} yrs, CDC 2024 data) — a population average, not a prediction.` },
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Date of birth" sub="The day you were born" />
            <DateField label="Birth date" value={birthDate} onChange={setBirthDate} max={asOf} />

            <SectionLabel text="Measure on" sub="Today by default — set any date to see your age then" />
            <DateField label="As-of date" hint="e.g. a wedding date, an anniversary, a deadline"
              value={asOf} onChange={setAsOf} />
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Calculate my age"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your birth date and click Calculate"
                subMessage="Your exact age, next-birthday countdown, and milestones will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Working out your exact age"
              />
            </motion.div>
          )}

          {revealState === "revealed" && !result.valid && (
            <motion.div key="invalid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <p className="text-sm font-bold text-amber-800">Check your dates</p>
                <p className="mt-1 text-sm text-amber-700">
                  The birth date must be a real calendar date on or before the as-of date.
                </p>
              </div>
            </motion.div>
          )}

          {revealState === "revealed" && result.valid && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow="Your exact age"
                primaryValue={result.years}
                primaryFormat={(n) => `${n}`}
                primaryUnit={`yrs ${result.months} mo ${result.days} d`}
                accentColor={ACCENT}
                note={
                  nb.isToday
                    ? { text: `🎂 Happy birthday — you turn ${nb.turning} today!`, tone: "positive" }
                    : { text: `${fmtNum(nb.daysUntil)} days until you turn ${nb.turning}`, tone: "positive" }
                }
                subStats={[
                  { label: "Months", value: result.totalMonths, format: fmtNum, sub: "in total" },
                  { label: "Weeks", value: result.weeksLived, format: fmtNum, sub: `+ ${result.weekRemainderDays} days` },
                  { label: "Days", value: result.daysLived, format: fmtNum, sub: "and counting" },
                  { label: "Hours", value: result.hoursLived, format: fmtCompact, sub: "approx." },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <BirthdayTable result={result} />

              <ImpactLineChart
                title="Days lived at your next 10 birthdays"
                subtitle={`Where your ${fmtNum(milestone.days)}-day milestone falls`}
                data={result.birthdays.map((b) => ({ x: b.turning, y: b.totalDaysLived }))}
                xFormat={(v) => `${v}`}
                yFormat={(v) => `${Math.round(v / 1000)}k`}
                tooltipX={(v) => `Turning ${v}`}
                tooltipY={(v) => `${fmtNum(v)} days lived`}
                referenceValue={milestone.days}
                referenceLabel={`${fmtNum(milestone.days)} days`}
                color={ACCENT}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
