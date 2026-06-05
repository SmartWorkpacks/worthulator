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
  NumInput,
  SectionLabel,
} from "@/src/templates/insights";
import {
  calculateDate,
  type DateMode,
  type DateUnit,
  type AddDirection,
} from "@/lib/calculators/dateEngine";

const CALC_STEPS = [
  "Reading your dates...",
  "Counting calendar days...",
  "Separating weekdays from weekends...",
  "Building your duration breakdown...",
];

const UNIT_LABEL: Record<DateUnit, string> = {
  days: "Days",
  weeks: "Weeks",
  months: "Months",
  years: "Years",
};

const BREAKDOWN_COLOR_HEX: Record<string, string> = {
  "bg-blue-400": "#60a5fa",
  "bg-amber-400": "#fbbf24",
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

export default function DateCalculator() {
  const [mode, setMode] = useState<DateMode>("difference");
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(plusDaysISO(30));
  const [includeEndDay, setIncludeEndDay] = useState(false);
  const [amount, setAmount] = useState(90);
  const [unit, setUnit] = useState<DateUnit>("days");
  const [direction, setDirection] = useState<AddDirection>("add");

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculateDate({ mode, startDate, endDate, includeEndDay, amount, unit, direction });

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const isAdd = mode === "add";

  const insights: Insight[] = [];
  if (result.valid && !isAdd) {
    insights.push({
      tone: "neutral",
      text: `That is ${result.totalDays.toLocaleString()} total days, or ${result.years}y ${result.months}m ${result.days}d in calendar terms.`,
    });
    insights.push({
      tone: "positive",
      text: `${result.weekdays.toLocaleString()} business days vs ${result.weekends.toLocaleString()} weekend days — a ${(
        result.weekends > 0 ? result.weekdays / result.weekends : result.weekdays
      ).toFixed(1)}:1 split that matters for deadlines and payroll.`,
    });
    insights.push({
      tone: "neutral",
      text: `Restated: ${result.totalWeeks.toLocaleString()} weeks, ${result.totalHours.toLocaleString()} hours, or ${result.totalMinutes.toLocaleString()} minutes.`,
    });
    if (result.reversed) {
      insights.push({
        tone: "warning",
        text: "Your start date is after your end date, so the duration shown is the absolute difference.",
      });
    }
  } else if (result.valid && isAdd) {
    insights.push({
      tone: "positive",
      text: `${Math.abs(Math.round(amount))} ${unit} ${direction === "add" ? "after" : "before"} ${result.startLabel} lands on ${result.resultLabel}.`,
    });
    insights.push({
      tone: "neutral",
      text: `That is day ${result.resultDayOfYear} of the year, in ISO week ${result.resultWeekOfYear}, ${result.offsetDays.toLocaleString()} days from the start date.`,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Mode" sub="What you want to work out" />
            <div className="grid grid-cols-2 gap-2">
              {(["difference", "add"] as DateMode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setMode(item);
                    pulse();
                  }}
                  className={
                    "rounded-lg border px-3 py-2 text-sm font-semibold transition " +
                    (mode === item
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                  }
                >
                  {item === "difference" ? "Between dates" : "Add / subtract"}
                </button>
              ))}
            </div>

            <SectionLabel text="Start date" sub="The date to count from" />
            <DateField label="Start date" value={startDate} onChange={(v) => { setStartDate(v); pulse(); }} />

            {!isAdd && (
              <>
                <SectionLabel text="End date" sub="The date to count to" />
                <DateField label="End date" value={endDate} onChange={(v) => { setEndDate(v); pulse(); }} />

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
                  <input
                    type="checkbox"
                    checked={includeEndDay}
                    onChange={(e) => { setIncludeEndDay(e.target.checked); pulse(); }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-semibold text-gray-700">Include the end day (inclusive count)</span>
                </label>
              </>
            )}

            {isAdd && (
              <>
                <SectionLabel text="Span" sub="How much to add or subtract" />
                <div className="grid grid-cols-2 gap-3">
                  <NumInput label="Amount" value={amount} onChange={(v) => { setAmount(v); pulse(); }} min={0} max={100000} step={1} />
                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <label className="mb-2 block text-xs font-semibold text-gray-500" htmlFor="unit-select">Unit</label>
                    <select
                      id="unit-select"
                      value={unit}
                      onChange={(e) => { setUnit(e.target.value as DateUnit); pulse(); }}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 focus:border-gray-400 focus:outline-none"
                    >
                      {(["days", "weeks", "months", "years"] as DateUnit[]).map((u) => (
                        <option key={u} value={u}>{UNIT_LABEL[u]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <SectionLabel text="Direction" sub="Forward or backward in time" />
                <div className="grid grid-cols-2 gap-2">
                  {(["add", "subtract"] as AddDirection[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => { setDirection(item); pulse(); }}
                      className={
                        "rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition " +
                        (direction === item
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                      }
                    >
                      {item === "add" ? "Add (later)" : "Subtract (earlier)"}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing"
            ? "Calculating..."
            : revealState === "revealed"
              ? "Recalculate"
              : isAdd
                ? "Calculate new date"
                : "Calculate duration"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Pick your dates and click Calculate"
                subMessage="Your duration, business-day count, and unit breakdown will appear here"
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
                  Please enter valid date(s) to calculate.
                </div>
              ) : isAdd ? (
                <ResultHeroCard
                  eyebrow={`${Math.abs(Math.round(amount))} ${unit} ${direction === "add" ? "later" : "earlier"}`}
                  primaryValue={result.offsetDays}
                  primaryFormat={(v) => v.toLocaleString()}
                  primaryUnit={`days ${direction === "add" ? "later" : "earlier"}`}
                  accentColor="#34d399"
                  note={{ text: result.resultLabel, tone: "positive" }}
                  subStats={[
                    { label: "Day of year", value: result.resultDayOfYear, format: (v) => `${v}`, sub: "1–366" },
                    { label: "ISO week", value: result.resultWeekOfYear, format: (v) => `#${v}`, sub: "of the year" },
                    { label: "Weekday", value: 0, format: () => result.resultWeekday, sub: "lands on" },
                  ]}
                  countUpActive={countUpActive}
                />
              ) : (
                <ResultHeroCard
                  eyebrow={`${result.startLabel} → ${result.endLabel}`}
                  primaryValue={result.totalDays}
                  primaryFormat={(v) => v.toLocaleString()}
                  primaryUnit="days"
                  accentColor="#34d399"
                  note={{ text: `${result.years}y ${result.months}m ${result.days}d`, tone: "positive" }}
                  subStats={[
                    { label: "Weeks", value: result.totalWeeks, format: (v) => `${v}`, sub: "total" },
                    { label: "Business days", value: result.weekdays, format: (v) => v.toLocaleString(), sub: "Mon–Fri" },
                    { label: "Hours", value: result.totalHours, format: (v) => v.toLocaleString(), sub: "total" },
                  ]}
                  countUpActive={countUpActive}
                />
              )}

              {result.valid && <InsightList insights={insights} startIndex={1} />}

              {result.valid && !isAdd && (
                <BreakdownBarChart
                  title="Business days vs weekend days"
                  data={result.breakdown.map((d) => ({
                    label: d.label,
                    amount: d.amount,
                    pct: result.totalDays > 0 ? Math.round((d.amount / result.totalDays) * 100) : 0,
                    fill: BREAKDOWN_COLOR_HEX[d.colorClass],
                  }))}
                  valueFormat={(v) => `${Math.round(v).toLocaleString()} days`}
                />
              )}

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.45 }}
              >
                <CalcDisclaimer />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
