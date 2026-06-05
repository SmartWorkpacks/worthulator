"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RangeSliderCard, CalcDisclaimer } from "@/src/templates/take-home-pay";
import WorthulatorProgressLoader from "@/src/templates/shared/WorthulatorProgressLoader";
import WorthulatorResultReveal from "@/src/templates/shared/WorthulatorResultReveal";
import {
  useStagedReveal,
  ResultHeroCard,
  InsightList,
  type Insight,
  ImpactLineChart,
  BreakdownBarChart,
  NumInput,
  SectionLabel,
} from "@/src/templates/insights";
import { calculateFreelanceRate, type FreelanceMode } from "@/lib/calculators/freelanceRateEngine";

/* --- helpers --------------------------------------------------------------- */

function fmt(v: number) {
  const a = Math.abs(Math.round(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(1)}M`;
  if (a >= 1_000) return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a}`;
}
function fmtFull(v: number) {
  return (v < 0 ? "-$" : "$") + Math.abs(Math.round(v)).toLocaleString();
}

const CALC_STEPS = [
  "Calculating billable hours...",
  "Factoring in tax and platform fees...",
  "Modelling survival vs premium gap...",
  "Generating rate insights...",
];

const ACCENT: Record<FreelanceMode, string> = {
  survival: "#f59e0b",
  comfortable: "#34d399",
  premium: "#a78bfa",
};

// Maps the engine's cost-breakdown colour tokens to chart hex values.
const COST_COLOR_HEX: Record<string, string> = {
  "bg-emerald-400": "#34d399",
  "bg-red-400": "#f87171",
  "bg-blue-400": "#60a5fa",
  "bg-violet-400": "#a78bfa",
  "bg-amber-400": "#fbbf24",
  "bg-orange-400": "#fb923c",
};

/* --- mode comparison table (calculator-specific) -------------------------- */

function ScenarioTable({
  result,
  mode,
  onModeChange,
}: {
  result: ReturnType<typeof calculateFreelanceRate>;
  mode: FreelanceMode;
  onModeChange: (m: FreelanceMode) => void;
}) {
  const rows: { key: FreelanceMode; label: string; desc: string; color: string }[] = [
    { key: "survival", label: "Survival", desc: "Bare minimum - covers your costs", color: "text-amber-600" },
    { key: "comfortable", label: "Comfortable", desc: "+20% buffer for savings and growth", color: "text-emerald-700" },
    { key: "premium", label: "Premium", desc: "+50% for exceptional positioning", color: "text-violet-700" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-xl border border-gray-100 bg-white"
    >
      <div className="border-b border-gray-50 px-4 pb-2 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Survival to Premium range</p>
        <p className="mt-0.5 text-xs text-gray-400">Tap a mode to update your rate above</p>
      </div>
      <div className="divide-y divide-gray-50">
        {rows.map((r) => {
          const isActive = mode === r.key;
          const scenarioRate = result.rateByMode[r.key];
          const scenarioIncome = result.scenarios.find((s) => s.label === r.label)?.annualIncome ?? 0;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => onModeChange(r.key)}
              className={
                "flex w-full items-center gap-4 px-4 py-3.5 text-left transition-all " +
                (isActive ? "bg-gray-950 text-white" : "bg-white hover:bg-gray-50")
              }
            >
              <div className="min-w-0 flex-1">
                <p className={"text-sm font-bold " + (isActive ? "text-white" : r.color)}>{r.label}</p>
                <p className={"mt-0.5 text-xs " + (isActive ? "text-white/50" : "text-gray-400")}>{r.desc}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className={"text-base font-black tabular-nums " + (isActive ? "text-emerald-400" : "text-gray-900")}>
                  ${scenarioRate}/hr
                </p>
                <p className={"mt-0.5 text-[10px] " + (isActive ? "text-white/40" : "text-gray-400")}>
                  {fmtFull(scenarioIncome)}/yr take-home
                </p>
              </div>
              {isActive && <div className="h-8 w-1.5 shrink-0 rounded-full bg-emerald-500" />}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ========================================================================== */

export default function FreelanceRateCalculator() {
  const [desiredIncome, setDesiredIncome] = useState(80000);
  const [expenses, setExpenses] = useState(12000);
  const [taxRate, setTaxRate] = useState(28);
  const [marginRate, setMarginRate] = useState(15);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksWorked, setWeeksWorked] = useState(48);
  const [utilization, setUtilization] = useState(70);
  const [platformFee, setPlatformFee] = useState(0);
  const [scopeCreep, setScopeCreep] = useState(20);
  const [currentRate, setCurrentRate] = useState(75);
  const [mode, setMode] = useState<FreelanceMode>("comfortable");

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculateFreelanceRate({
    desiredAnnualIncome: desiredIncome,
    hoursPerWeek,
    weeksWorked,
    utilizationPct: utilization,
    annualBusinessExpenses: expenses,
    taxRatePct: taxRate,
    profitMarginPct: marginRate,
    currentHourlyRate: currentRate,
    platformFeePct: platformFee,
    scopeCreepBufferPct: scopeCreep,
    mode,
  });

  const handleModeChange = (m: FreelanceMode) => {
    setMode(m);
    if (revealState === "revealed") pulseCountUp();
  };

  const modeLabel = mode === "premium" ? "Premium" : mode === "comfortable" ? "Comfortable" : "Survival";

  const insights: Insight[] = [];
  if (result.isUndercharging) {
    const gap = Math.abs(Math.round(result.rateGap));
    insights.push({
      tone: "warning",
      text: `$${gap}/hr undercharging gap - at $${Math.round(currentRate)}/hr you are missing ${fmtFull(result.annualIncomeGap)} annually.`,
    });
  } else {
    insights.push({
      tone: "positive",
      text: `$${Math.round(result.rateGap)}/hr above minimum - your rate covers all costs with surplus in ${mode} mode.`,
    });
  }
  const nonBillableHrs = Math.round(result.totalHoursWorked - result.billableHoursPerYear);
  insights.push({
    tone: "neutral",
    text: `${result.billableHoursPerYear} truly billable hours/yr - ${nonBillableHrs} hrs lost to admin, sales, and non-billable work at ${utilization}% utilization.`,
  });
  if (platformFee > 0) {
    insights.push({
      tone: "neutral",
      text: `$${Math.round(result.platformFeePerHour)}/hr in platform fees - the ${platformFee}% cut means you need to gross ${fmt(result.requiredRevenueWithFees)} to net your target.`,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Income goal" sub="Your target take-home after all taxes" />
            <NumInput label="Desired annual income" prefix="$" hint="Personal take-home, not revenue"
              value={desiredIncome} onChange={setDesiredIncome} step={1000} min={10000} max={2000000} wide />

            <SectionLabel text="Business costs" sub="Annual overhead to earn back" />
            <NumInput label="Annual expenses" prefix="$" hint="Software, insurance, equipment, accountant"
              value={expenses} onChange={setExpenses} step={500} min={0} max={500000} wide />

            <SectionLabel text="Tax and profit buffer" />
            <RangeSliderCard label="Effective tax rate"
              hint="Self-employment approx 15.3% + income tax. Most freelancers: 25-35%"
              value={taxRate} min={0} max={55} step={1} unit="%" onChange={setTaxRate} />
            <RangeSliderCard label="Profit buffer"
              hint="Margin on top of costs for reinvestment and slow months"
              value={marginRate} min={0} max={50} step={1} unit="%" onChange={setMarginRate} />

            <SectionLabel text="Working time" sub="How much time you actually have to bill" />
            <div className="grid grid-cols-2 gap-3">
              <NumInput label="Hours / week" value={hoursPerWeek} onChange={setHoursPerWeek} step={1} min={1} max={80} />
              <NumInput label="Weeks worked" value={weeksWorked} onChange={setWeeksWorked} step={1} min={1} max={52} />
            </div>
            <RangeSliderCard label="Utilization rate"
              hint="% of working time you can actually bill. 50-70% is realistic; 100% is a myth"
              value={utilization} min={10} max={100} step={5} unit="%" onChange={setUtilization} />

            <SectionLabel text="Platform and scope" sub="Real-world deductions most freelancers ignore" />
            <RangeSliderCard label="Platform fee"
              hint="Upwork = 10-20%, Fiverr = 20%, direct = 0%"
              value={platformFee} min={0} max={30} step={1} unit="%" onChange={setPlatformFee} />
            <RangeSliderCard label="Scope creep buffer"
              hint="Add this % to cover unpaid revisions and scope changes"
              value={scopeCreep} min={0} max={50} step={5} unit="%" onChange={setScopeCreep} />

            <SectionLabel text="Comparison" />
            <NumInput label="Current hourly rate" prefix="$" suffix="/hr" hint="What you charge today"
              value={currentRate} onChange={setCurrentRate} step={5} min={0} max={5000} wide />
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Calculate my rate"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your details and click Calculate"
                subMessage="Your minimum viable rate, insights, and mode scenarios will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Calculating your freelance rate"
              />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              {/* Mode selector */}
              <div className="flex gap-2">
                {(["survival", "comfortable", "premium"] as FreelanceMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleModeChange(m)}
                    className={
                      "flex-1 rounded-xl border py-2.5 text-sm font-bold capitalize transition-all " +
                      (mode === m
                        ? "border-gray-900 bg-gray-950 text-white shadow-md"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300")
                    }
                  >
                    {m}
                  </button>
                ))}
              </div>

              <ResultHeroCard
                eyebrow={`${modeLabel} mode`}
                primaryValue={result.minimumHourlyRate}
                primaryFormat={(n) => `$${n}`}
                primaryUnit="/hr"
                accentColor={ACCENT[mode]}
                note={
                  result.isUndercharging
                    ? { text: `You are undercharging by $${Math.abs(Math.round(result.rateGap))}/hr`, tone: "warning" }
                    : { text: "Your current rate covers this scenario", tone: "positive" }
                }
                subStats={[
                  { label: "Monthly", value: result.minimumMonthlyRate, format: fmt, sub: "revenue target" },
                  { label: "Annual", value: result.requiredRevenueWithFees, format: fmt, sub: "total needed" },
                  { label: "Billed hrs", value: result.billableHoursPerYear, sub: "per year" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ScenarioTable result={result} mode={mode} onModeChange={handleModeChange} />

              <ImpactLineChart
                title="Rate vs utilization"
                subtitle="How your required rate rises as billable % falls"
                data={result.utilizationImpact.map((u) => ({ x: u.utilizationPct, y: u.hourlyRate }))}
                xFormat={(v) => `${v}%`}
                yFormat={(v) => `$${v}`}
                tooltipX={(v) => `${v}% utilization`}
                tooltipY={(v) => `$${v}/hr needed`}
                referenceValue={currentRate}
                referenceLabel="Your rate"
              />

              <BreakdownBarChart
                title="What each billed dollar covers"
                data={result.costBreakdown.map((c) => ({
                  label: c.label,
                  amount: c.amount,
                  pct: c.pct,
                  fill: COST_COLOR_HEX[c.colorClass],
                }))}
                valueFormat={(v) => `$${Math.round(v)}/hr`}
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
