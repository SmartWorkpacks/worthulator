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
import { calculateTimecard, type TimecardDay } from "@/lib/calculators/timecardEngine";

const CALC_STEPS = [
  "Adding up each day's clock time...",
  "Subtracting unpaid breaks...",
  "Splitting weekly overtime past 40 hours...",
  "Totalling your gross pay...",
];

function hhmmToMinutes(value: string): number {
  const [h, m] = value.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
  return h * 60 + m;
}

interface DayRow {
  label: string;
  enabled: boolean;
  start: string;
  end: string;
  breakMin: number;
}

const DEFAULT_DAYS: DayRow[] = [
  { label: "Mon", enabled: true, start: "09:00", end: "17:00", breakMin: 30 },
  { label: "Tue", enabled: true, start: "09:00", end: "17:00", breakMin: 30 },
  { label: "Wed", enabled: true, start: "09:00", end: "17:00", breakMin: 30 },
  { label: "Thu", enabled: true, start: "09:00", end: "17:00", breakMin: 30 },
  { label: "Fri", enabled: true, start: "09:00", end: "17:00", breakMin: 30 },
  { label: "Sat", enabled: false, start: "09:00", end: "13:00", breakMin: 0 },
  { label: "Sun", enabled: false, start: "09:00", end: "13:00", breakMin: 0 },
];

export default function TimecardCalculator() {
  const [days, setDays] = useState<DayRow[]>(DEFAULT_DAYS);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [threshold, setThreshold] = useState(40);

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const updateDay = (index: number, patch: Partial<DayRow>) => {
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
    pulse();
  };

  const engineDays: TimecardDay[] = days.map((d) => ({
    label: d.label,
    enabled: d.enabled,
    startMinutes: hhmmToMinutes(d.start),
    endMinutes: hhmmToMinutes(d.end),
    breakMinutes: Math.max(0, d.breakMin),
  }));

  const result = calculateTimecard({ days: engineDays, hourlyRate, weeklyOvertimeThresholdHours: threshold });

  const money = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const hours = (n: number) => `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} h`;

  const insights: Insight[] = [
    {
      tone: "positive",
      text: `You worked ${hours(result.totalWorkedHours)} across ${result.daysWorked} day${result.daysWorked === 1 ? "" : "s"} this week — averaging ${hours(result.averageDailyHours)} a day.`,
    },
    {
      tone: result.overtimeHours > 0 ? "warning" : "neutral",
      text:
        result.overtimeHours > 0
          ? `${hours(result.overtimeHours)} of that is overtime past the ${threshold}-hour line, paid at time-and-a-half.`
          : `You're ${hours(Math.max(0, threshold - result.totalWorkedHours))} short of the ${threshold}-hour overtime line.`,
    },
  ];

  if (result.hasPay) {
    insights.push({
      tone: "positive",
      text: `At ${money(result.hourlyRate)}/hr that's ${money(result.totalPay)} gross${result.overtimeHours > 0 ? ` — including ${money(result.overtimePay)} of overtime pay` : ""}.`,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <SectionLabel text="Your week" sub="Toggle days and set each day's hours" />

            {days.map((d, i) => (
              <div
                key={d.label}
                className={`rounded-xl border p-3 transition-all ${
                  d.enabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => updateDay(i, { enabled: !d.enabled })}
                    className="flex items-center gap-2"
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded border text-xs ${
                        d.enabled ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <span className={`text-sm font-bold ${d.enabled ? "text-gray-900" : "text-gray-400"}`}>{d.label}</span>
                  </button>
                  {d.enabled && (
                    <input
                      type="number"
                      min={0}
                      max={480}
                      step={5}
                      value={d.breakMin}
                      onChange={(e) => updateDay(i, { breakMin: Math.max(0, Number(e.target.value)) })}
                      className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1 text-right text-xs font-semibold text-gray-700 focus:border-gray-400 focus:outline-none"
                      aria-label={`${d.label} break minutes`}
                      title="Unpaid break (minutes)"
                    />
                  )}
                </div>
                {d.enabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="time"
                      value={d.start}
                      onChange={(e) => updateDay(i, { start: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm font-semibold text-gray-800 focus:border-gray-400 focus:outline-none"
                      aria-label={`${d.label} start time`}
                    />
                    <input
                      type="time"
                      value={d.end}
                      onChange={(e) => updateDay(i, { end: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm font-semibold text-gray-800 focus:border-gray-400 focus:outline-none"
                      aria-label={`${d.label} end time`}
                    />
                  </div>
                )}
              </div>
            ))}

            <SectionLabel text="Pay & overtime" sub="Optional — leave rate at 0 to skip pay" />
            <NumInput
              label="Hourly rate"
              value={hourlyRate}
              onChange={(v) => { setHourlyRate(v); pulse(); }}
              min={0}
              max={2_000}
              step={1}
              prefix="$"
            />
            <NumInput
              label="Weekly overtime after"
              value={threshold}
              onChange={(v) => { setThreshold(v); pulse(); }}
              min={0}
              max={80}
              step={1}
              suffix="h"
            />
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
              : "Total my timecard"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Set your week's hours, then click Total"
                subMessage="Your weekly hours, daily breakdown, overtime split, and gross pay will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Totalling your week"
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
              <ResultHeroCard
                eyebrow={`${result.daysWorked} day${result.daysWorked === 1 ? "" : "s"} · ${threshold}h OT line`}
                primaryValue={result.totalWorkedHours}
                primaryFormat={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                primaryUnit="hours this week"
                accentColor="#3b82f6"
                note={
                  result.overtimeHours > 0
                    ? { text: `${result.overtimeHours.toFixed(2)} h overtime`, tone: "warning" }
                    : { text: "No overtime this week", tone: "positive" }
                }
                subStats={[
                  { label: "Regular", value: result.regularHours, format: (v) => `${v.toFixed(2)} h`, sub: "straight time" },
                  { label: "Overtime", value: result.overtimeHours, format: (v) => `${v.toFixed(2)} h`, sub: "at 1.5×" },
                  result.hasPay
                    ? { label: "Gross pay", value: result.totalPay, format: money, sub: "this week" }
                    : { label: "Avg/day", value: result.averageDailyHours, format: (v) => `${v.toFixed(2)} h`, sub: "worked days" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              {result.breakdown.length > 0 && (
                <BreakdownBarChart
                  title="Hours worked by day"
                  data={result.breakdown.map((d) => ({
                    label: d.label,
                    amount: d.amount,
                    pct: result.totalWorkedHours > 0 ? Math.round((d.amount / result.totalWorkedHours) * 100) : 0,
                    fill: "#60a5fa",
                  }))}
                  valueFormat={(v) => `${v.toFixed(2)} h`}
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
