"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalcDisclaimer } from "@/src/templates/take-home-pay";
import WorthulatorProgressLoader from "@/src/templates/shared/WorthulatorProgressLoader";
import WorthulatorResultReveal from "@/src/templates/shared/WorthulatorResultReveal";
import {
  useStagedReveal,
  ResultHeroCard,
  InsightList,
  type Insight,
  BreakdownBarChart,
  SectionLabel,
} from "@/src/templates/insights";
import { calculateDays, type DaysMode } from "@/lib/calculators/daysEngine";

const CALC_STEPS = [
  "Reading your dates...",
  "Counting the days...",
  "Separating weekdays from weekends...",
  "Building your breakdown...",
];

const MODE_LABEL: Record<DaysMode, string> = {
  until: "Days until",
  since: "Days since",
  between: "Days between",
};

function todayISO(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function plusDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <label className="mb-2 block text-xs font-semibold text-gray-500">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 focus:border-gray-400 focus:outline-none"
      />
    </div>
  );
}

export default function DaysCalculator() {
  const [mode, setMode] = useState<DaysMode>("until");
  const [targetDate, setTargetDate] = useState(plusDaysISO(30));
  const [pastDate, setPastDate] = useState(plusDaysISO(-30));
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(plusDaysISO(90));
  const [businessOnly, setBusinessOnly] = useState(false);
  const [includeEndDay, setIncludeEndDay] = useState(false);

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculateDays({
    mode,
    asOfDate: todayISO(),
    targetDate,
    pastDate,
    startDate,
    endDate,
    businessOnly,
    includeEndDay,
  });

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const heroUnit =
    mode === "until"
      ? result.reversed
        ? `${result.countedLabel} ago`
        : `${result.countedLabel} until`
      : mode === "since"
        ? result.reversed
          ? `${result.countedLabel} from now`
          : `${result.countedLabel} since`
        : result.countedLabel;

  const insights: Insight[] = [];
  if (result.valid) {
    if (mode === "until") {
      insights.push({
        tone: result.reversed ? "warning" : "positive",
        text: result.reversed
          ? `${result.toLabel} is in the past — that was ${result.totalDays.toLocaleString()} ${result.countedLabel} ago.`
          : `${result.totalDays.toLocaleString()} ${result.countedLabel} until ${result.toLabel}. It falls on a ${result.toWeekday}.`,
      });
    } else if (mode === "since") {
      insights.push({
        tone: result.reversed ? "warning" : "positive",
        text: result.reversed
          ? `That date hasn't happened yet — it's ${result.totalDays.toLocaleString()} ${result.countedLabel} from now.`
          : `${result.totalDays.toLocaleString()} ${result.countedLabel} have passed since ${result.fromLabel}.`,
      });
    } else {
      insights.push({
        tone: "positive",
        text: `${result.totalDays.toLocaleString()} ${result.countedLabel} between ${result.fromLabel} and ${result.toLabel}.`,
      });
    }
    insights.push({
      tone: "neutral",
      text: `That is ${result.wholeWeeks.toLocaleString()} week${result.wholeWeeks === 1 ? "" : "s"} and ${result.remainderDays} day${result.remainderDays === 1 ? "" : "s"} (${result.totalWeeks} weeks), or ${result.years}y ${result.months}m ${result.days}d in calendar terms.`,
    });
    insights.push({
      tone: "neutral",
      text: `Across the span there are ${result.businessDays.toLocaleString()} business days and ${result.weekendDays.toLocaleString()} weekend days. Public holidays vary by country and are not subtracted.`,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="What do you want to count?" sub="Pick a mode" />
            <div className="grid grid-cols-3 gap-2">
              {(["until", "since", "between"] as DaysMode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setMode(item);
                    pulse();
                  }}
                  className={
                    "rounded-lg border px-2 py-2 text-xs font-semibold transition sm:text-sm " +
                    (mode === item
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                  }
                >
                  {MODE_LABEL[item]}
                </button>
              ))}
            </div>

            {mode === "until" && (
              <>
                <SectionLabel text="Target date" sub="Counting from today" />
                <DateField label="Future date" value={targetDate} onChange={(v) => { setTargetDate(v); pulse(); }} />
              </>
            )}

            {mode === "since" && (
              <>
                <SectionLabel text="Past date" sub="Counting up to today" />
                <DateField label="Past date" value={pastDate} onChange={(v) => { setPastDate(v); pulse(); }} />
              </>
            )}

            {mode === "between" && (
              <>
                <SectionLabel text="Start date" sub="The date to count from" />
                <DateField label="Start date" value={startDate} onChange={(v) => { setStartDate(v); pulse(); }} />
                <SectionLabel text="End date" sub="The date to count to" />
                <DateField label="End date" value={endDate} onChange={(v) => { setEndDate(v); pulse(); }} />
              </>
            )}

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
              <input
                type="checkbox"
                checked={businessOnly}
                onChange={(e) => { setBusinessOnly(e.target.checked); pulse(); }}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm font-semibold text-gray-700">Count business days only (exclude weekends)</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
              <input
                type="checkbox"
                checked={includeEndDay}
                onChange={(e) => { setIncludeEndDay(e.target.checked); pulse(); }}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm font-semibold text-gray-700">Include the final day (inclusive count)</span>
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing"
            ? "Counting..."
            : revealState === "revealed"
              ? "Recalculate"
              : "Count the days"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Pick a date and click Count"
                subMessage="Your day count, business-day split, and week breakdown will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Crunching the calendar"
              />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              {!result.valid ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm font-semibold text-amber-700">
                  Please enter a valid date to count.
                </div>
              ) : (
                <ResultHeroCard
                  eyebrow={`${MODE_LABEL[result.mode]} · ${result.fromLabel} → ${result.toLabel}`}
                  primaryValue={result.totalDays}
                  primaryFormat={(v) => v.toLocaleString()}
                  primaryUnit={heroUnit}
                  accentColor="#34d399"
                  note={{
                    text: `${result.wholeWeeks} weeks ${result.remainderDays} days`,
                    tone: result.reversed ? "warning" : "positive",
                  }}
                  subStats={[
                    { label: "Calendar days", value: result.calendarDays, format: (v) => v.toLocaleString(), sub: "total span" },
                    { label: "Business days", value: result.businessDays, format: (v) => v.toLocaleString(), sub: "Mon–Fri" },
                    { label: "Weekend days", value: result.weekendDays, format: (v) => v.toLocaleString(), sub: "Sat–Sun" },
                  ]}
                  countUpActive={countUpActive}
                />
              )}

              {result.valid && <InsightList insights={insights} startIndex={1} />}

              {result.valid && result.calendarDays > 0 && (
                <BreakdownBarChart
                  title="Business days vs weekend days"
                  data={result.breakdown.map((d) => ({
                    label: d.label,
                    amount: d.amount,
                    pct: result.calendarDays > 0 ? Math.round((d.amount / result.calendarDays) * 100) : 0,
                    fill: d.colorHex,
                  }))}
                  valueFormat={(v) => `${Math.round(v).toLocaleString()} days`}
                />
              )}

              <CalcDisclaimer text="Counts use the Gregorian calendar in UTC and exclude public holidays, which vary by country. For payroll or legal deadlines, confirm against the applicable holiday calendar." />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
