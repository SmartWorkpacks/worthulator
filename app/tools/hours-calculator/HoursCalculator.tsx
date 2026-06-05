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
import { calculateHours } from "@/lib/calculators/hoursEngine";

const CALC_STEPS = [
  "Reading your clock-in and clock-out...",
  "Adjusting for overnight shifts...",
  "Subtracting your break...",
  "Converting to decimal hours and pay...",
];

const BREAKDOWN_COLOR_HEX: Record<string, string> = {
  "bg-emerald-400": "#34d399",
  "bg-amber-400": "#fbbf24",
};

function minutesToHHMM(min: number): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(min / 60))}:${p(min % 60)}`;
}

function hhmmToMinutes(value: string): number {
  const [h, m] = value.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
  return h * 60 + m;
}

function TimeField({
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
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 focus:border-gray-400 focus:outline-none"
      />
    </div>
  );
}

export default function HoursCalculator() {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [breakMinutes, setBreakMinutes] = useState(30);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [overtimeThresholdHours, setOvertimeThresholdHours] = useState(8);

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculateHours({
    startMinutes: hhmmToMinutes(start),
    endMinutes: hhmmToMinutes(end),
    breakMinutes,
    hourlyRate,
    overtimeThresholdHours,
  });

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const insights: Insight[] = [
    {
      tone: "neutral",
      text: `${result.clockLabel} worked equals ${result.workedHours} decimal hours — the format payroll systems use.`,
    },
  ];

  if (result.isOvernight) {
    insights.push({
      tone: "warning",
      text: "Your end time is at or before your start time, so this is treated as an overnight shift across midnight.",
    });
  }

  if (result.overtimeHours > 0) {
    insights.push({
      tone: "positive",
      text: `${result.overtimeHours} of your ${result.workedHours} hours are overtime (past ${overtimeThresholdHours}h)${
        result.hasPay ? `, worth ${result.overtimePay.toFixed(2)} at 1.5x` : ""
      }.`,
    });
  }

  if (breakMinutes > 0) {
    insights.push({
      tone: "neutral",
      text: `Your ${breakMinutes}-minute break (${result.breakHours}h) is unpaid and already removed from the worked total.`,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Shift" sub="Clock-in and clock-out" />
            <div className="grid grid-cols-2 gap-3">
              <TimeField label="Start time" value={start} onChange={(v) => { setStart(v); pulse(); }} />
              <TimeField label="End time" value={end} onChange={(v) => { setEnd(v); pulse(); }} />
            </div>

            <SectionLabel text="Break" sub="Unpaid minutes removed from the total" />
            <NumInput
              label="Unpaid break"
              value={breakMinutes}
              onChange={(v) => { setBreakMinutes(v); pulse(); }}
              min={0}
              max={480}
              step={5}
              suffix="min"
            />

            <SectionLabel text="Pay (optional)" sub="Add a rate to see earnings" />
            <NumInput
              label="Hourly rate"
              value={hourlyRate}
              onChange={(v) => { setHourlyRate(v); pulse(); }}
              min={0}
              max={1000}
              step={0.5}
              prefix="$"
            />

            <NumInput
              label="Overtime after"
              value={overtimeThresholdHours}
              onChange={(v) => { setOvertimeThresholdHours(v); pulse(); }}
              min={0}
              max={24}
              step={1}
              suffix="h/day"
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
              : "Calculate hours"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your times and click Calculate"
                subMessage="Your worked hours, decimal total, overtime split, and pay will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Adding up your time"
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
                eyebrow={`${minutesToHHMM(hhmmToMinutes(start))} → ${minutesToHHMM(hhmmToMinutes(end))}${
                  result.isOvernight ? " (overnight)" : ""
                }`}
                primaryValue={result.workedHours}
                primaryFormat={(v) => `${v}`}
                primaryUnit="hours"
                accentColor="#34d399"
                note={{ text: `${result.clockLabel} worked`, tone: "positive" }}
                subStats={[
                  { label: "Clock time", value: result.grossMinutes / 60, format: (v) => `${Math.round(v * 100) / 100}h`, sub: "before break" },
                  { label: "Overtime", value: result.overtimeHours, format: (v) => `${v}h`, sub: `past ${overtimeThresholdHours}h` },
                  result.hasPay
                    ? { label: "Pay", value: result.totalPay, format: (v) => `$${v.toFixed(2)}`, sub: "for the shift" }
                    : { label: "Break", value: result.breakHours, format: (v) => `${v}h`, sub: "unpaid" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <BreakdownBarChart
                title="Worked time vs break"
                data={result.breakdown.map((d) => ({
                  label: d.label,
                  amount: d.amount,
                  pct: result.grossMinutes > 0 ? Math.round((d.amount / result.grossMinutes) * 100) : 0,
                  fill: BREAKDOWN_COLOR_HEX[d.colorClass],
                }))}
                valueFormat={(v) => `${Math.round(v)} min`}
              />

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
