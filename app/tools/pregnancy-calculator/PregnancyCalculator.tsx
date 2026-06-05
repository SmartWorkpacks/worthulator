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
import { calculatePregnancy, type PregnancyMethod } from "@/lib/calculators/pregnancyEngine";

const CALC_STEPS = [
  "Reading your dates...",
  "Applying Naegele's rule...",
  "Measuring gestational age...",
  "Mapping your trimester milestones...",
];

const METHOD_LABEL: Record<PregnancyMethod, string> = {
  lmp: "Last period",
  conception: "Conception",
  dueDate: "Due date",
  ultrasound: "Ultrasound",
};

const REF_LABEL: Record<PregnancyMethod, string> = {
  lmp: "First day of last period",
  conception: "Conception / ovulation date",
  dueDate: "Your known due date",
  ultrasound: "Date of dating ultrasound",
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

export default function PregnancyCalculator() {
  const [method, setMethod] = useState<PregnancyMethod>("lmp");
  const [referenceDate, setReferenceDate] = useState(plusDaysISO(-56)); // ~8 weeks ago
  const [cycleLength, setCycleLength] = useState(28);
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState(8);
  const [ultrasoundDays, setUltrasoundDays] = useState(0);
  const [asOfDate, setAsOfDate] = useState(todayISO());

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculatePregnancy({
    method,
    referenceDate,
    cycleLength,
    ultrasoundWeeks,
    ultrasoundDays,
    asOfDate,
  });

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const absRemaining = Math.abs(result.daysRemaining);

  const insights: Insight[] = [];
  if (result.valid) {
    insights.push({
      tone: result.overdue ? "warning" : "positive",
      text: result.overdue
        ? `The estimated due date of ${result.dueDateLabel} has passed — ${result.daysOverdue} day${result.daysOverdue === 1 ? "" : "s"} ago. Most providers discuss next steps once you go past 41 weeks.`
        : `Your estimated due date is ${result.dueDateLabel} — about ${result.weeksRemaining} week${result.weeksRemaining === 1 ? "" : "s"} and ${result.daysRemainderToGo} day${result.daysRemainderToGo === 1 ? "" : "s"} from now.`,
    });
    if (result.gestationalDays > 0) {
      insights.push({
        tone: "neutral",
        text: `You are ${result.gestationalWeeks} weeks ${result.gestationalDayRemainder} day${result.gestationalDayRemainder === 1 ? "" : "s"} along — ${result.progressPct}% of the way through a 40-week pregnancy, in the ${result.trimesterLabel.toLowerCase()}.`,
      });
    } else {
      insights.push({
        tone: "warning",
        text: `The reference date you entered is in the future, so the pregnancy hasn't started yet on your "as of" date. Estimated conception is ${result.conceptionLabel}.`,
      });
    }
    insights.push({
      tone: "neutral",
      text: `Estimated conception: ${result.conceptionLabel}. Dates are measured from a last period of ${result.lmpLabel} using a 280-day term.`,
    });
    const next = result.milestones.find((m) => !m.passed);
    if (next) {
      insights.push({
        tone: "neutral",
        text: `Next milestone: ${next.label} around week ${next.gestationalWeeks}, on ${next.dateLabel}.`,
      });
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="What do you know?" sub="Pick the date you can supply" />
            <div className="grid grid-cols-2 gap-2">
              {(["lmp", "conception", "dueDate", "ultrasound"] as PregnancyMethod[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setMethod(item);
                    pulse();
                  }}
                  className={
                    "rounded-lg border px-3 py-2 text-sm font-semibold transition " +
                    (method === item
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                  }
                >
                  {METHOD_LABEL[item]}
                </button>
              ))}
            </div>

            <SectionLabel text={REF_LABEL[method]} sub="Everything is derived from this date" />
            <DateField
              label={REF_LABEL[method]}
              value={referenceDate}
              onChange={(v) => {
                setReferenceDate(v);
                pulse();
              }}
            />

            {method === "lmp" && (
              <>
                <SectionLabel text="Cycle length" sub="Adjusts ovulation timing" />
                <NumInput
                  label="Average cycle length"
                  value={cycleLength}
                  onChange={(v) => {
                    setCycleLength(v);
                    pulse();
                  }}
                  min={20}
                  max={45}
                  step={1}
                  suffix="days"
                />
              </>
            )}

            {method === "ultrasound" && (
              <>
                <SectionLabel text="Gestational age at scan" sub="As measured on the ultrasound" />
                <div className="grid grid-cols-2 gap-3">
                  <NumInput
                    label="Weeks"
                    value={ultrasoundWeeks}
                    onChange={(v) => {
                      setUltrasoundWeeks(v);
                      pulse();
                    }}
                    min={0}
                    max={42}
                    step={1}
                    suffix="wks"
                  />
                  <NumInput
                    label="Days"
                    value={ultrasoundDays}
                    onChange={(v) => {
                      setUltrasoundDays(v);
                      pulse();
                    }}
                    min={0}
                    max={6}
                    step={1}
                    suffix="days"
                  />
                </div>
              </>
            )}

            <SectionLabel text="As of date" sub="Today, or any date to check" />
            <DateField
              label="Calculate as of"
              value={asOfDate}
              onChange={(v) => {
                setAsOfDate(v);
                pulse();
              }}
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
              : "Calculate due date"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter a date and click Calculate"
                subMessage="Your due date, gestational age, trimester, and milestone timeline will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Working out your timeline"
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
                  Please enter a valid date to calculate.
                </div>
              ) : (
                <ResultHeroCard
                  eyebrow={`${result.trimesterLabel} · from ${METHOD_LABEL[result.method].toLowerCase()}`}
                  primaryValue={result.gestationalWeeks}
                  primaryFormat={(v) => `${v}`}
                  primaryUnit="weeks pregnant"
                  accentColor="#ec4899"
                  note={{
                    text: result.overdue
                      ? `Past due — estimated ${result.dueDateLabel}`
                      : `Estimated due date: ${result.dueDateLabel}`,
                    tone: result.overdue ? "warning" : "positive",
                  }}
                  subStats={[
                    {
                      label: "How far along",
                      value: 0,
                      format: () => `${result.gestationalWeeks}w ${result.gestationalDayRemainder}d`,
                      sub: "gestational age",
                    },
                    {
                      label: result.overdue ? "Overdue by" : "Days to go",
                      value: absRemaining,
                      format: (v) => v.toLocaleString(),
                      sub: result.overdue ? "past due date" : "until due date",
                    },
                    {
                      label: "Progress",
                      value: result.progressPct,
                      format: (v) => `${v}%`,
                      sub: "of 40 weeks",
                    },
                  ]}
                  countUpActive={countUpActive}
                />
              )}

              {result.valid && <InsightList insights={insights} startIndex={1} />}

              {result.valid && (
                <BreakdownBarChart
                  title="Weeks in each trimester"
                  data={result.breakdown.map((d) => ({
                    label: d.current ? `${d.label} (you are here)` : d.label,
                    amount: d.amount,
                    pct: Math.round((d.amount / 40) * 100),
                    fill: d.colorHex,
                  }))}
                  valueFormat={(v) => `${Math.round(v)} weeks`}
                />
              )}

              {result.valid && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">
                    Milestone timeline
                  </h3>
                  <ol className="flex flex-col gap-3">
                    {result.milestones.map((m) => (
                      <li key={m.key} className="flex items-center gap-3">
                        <span
                          className={
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                            (m.passed
                              ? "bg-pink-500 text-white"
                              : "border border-gray-300 bg-white text-gray-400")
                          }
                        >
                          {m.passed ? "✓" : m.gestationalWeeks}
                        </span>
                        <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3">
                          <span className={"text-sm font-semibold " + (m.passed ? "text-gray-900" : "text-gray-600")}>
                            {m.label}
                          </span>
                          <span className="text-xs font-medium text-gray-500">
                            Week {m.gestationalWeeks} · {m.dateLabel}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <CalcDisclaimer text="Estimates use standard obstetric dating (Naegele's rule, 280-day term) and are for general information only. Your healthcare provider's dating — especially from an ultrasound — is the authority for your pregnancy." />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
