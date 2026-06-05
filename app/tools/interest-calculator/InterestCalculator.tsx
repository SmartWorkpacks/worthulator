"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import {
  calculateInterest,
  type InterestMode,
  type CompoundFrequency,
} from "@/lib/calculators/interestEngine";

const CALC_STEPS = [
  "Reading your starting balance and rate...",
  "Applying your compounding schedule...",
  "Adding monthly contributions...",
  "Projecting growth year by year...",
];

const FREQUENCY_LABEL: Record<CompoundFrequency, string> = {
  annually: "Annually",
  semiannually: "Semi-annually",
  quarterly: "Quarterly",
  monthly: "Monthly",
  daily: "Daily",
};

const BREAKDOWN_COLOR_HEX: Record<string, string> = {
  "bg-blue-400": "#60a5fa",
  "bg-violet-400": "#a78bfa",
  "bg-emerald-400": "#34d399",
};

export default function InterestCalculator() {
  const [mode, setMode] = useState<InterestMode>("compound");
  const [principal, setPrincipal] = useState(10_000);
  const [annualRatePct, setAnnualRatePct] = useState(5);
  const [years, setYears] = useState(10);
  const [compounding, setCompounding] = useState<CompoundFrequency>("monthly");
  const [monthlyContribution, setMonthlyContribution] = useState(0);

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculateInterest({
    mode,
    principal,
    annualRatePct,
    years,
    compounding,
    monthlyContribution,
  });

  const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const interestShare = result.finalBalance > 0 ? (result.totalInterest / result.finalBalance) * 100 : 0;

  const insights: Insight[] = [
    {
      tone: "positive",
      text: `Your ${money(result.totalDeposited)} of deposits grows to ${money(result.finalBalance)} — ${money(
        result.totalInterest,
      )} (${interestShare.toFixed(1)}%) of the final balance is interest.`,
    },
  ];

  if (mode === "compound") {
    insights.push({
      tone: "neutral",
      text: `${FREQUENCY_LABEL[compounding]} compounding turns a ${annualRatePct}% nominal rate into a ${result.effectiveAnnualRatePct}% effective annual yield (APY).`,
    });
  } else {
    insights.push({
      tone: "neutral",
      text: `Simple interest accrues only on your deposits, so your ${annualRatePct}% rate stays at ${result.effectiveAnnualRatePct}% — no compounding boost.`,
    });
  }

  if (monthlyContribution > 0) {
    insights.push({
      tone: "positive",
      text: `Your ${money(monthlyContribution)}/month adds ${money(
        result.totalContributions,
      )} in deposits over ${years} years on top of the starting ${money(principal)}.`,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Interest type" sub="How interest accrues" />
            <div className="grid grid-cols-2 gap-2">
              {(["compound", "simple"] as InterestMode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setMode(item);
                    pulse();
                  }}
                  className={
                    "rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition " +
                    (mode === item
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                  }
                >
                  {item}
                </button>
              ))}
            </div>

            <SectionLabel text="Starting amount" sub="Initial principal" />
            <NumInput
              label="Starting balance"
              value={principal}
              onChange={(v) => { setPrincipal(v); pulse(); }}
              min={0}
              max={100_000_000}
              step={500}
              prefix="$"
            />

            <SectionLabel text="Rate & term" sub="Annual rate and number of years" />
            <RangeSliderCard
              label="Annual interest rate"
              hint="The yearly rate before compounding"
              value={annualRatePct}
              min={0}
              max={20}
              step={0.1}
              unit="%"
              onChange={(v) => { setAnnualRatePct(v); pulse(); }}
            />
            <RangeSliderCard
              label="Term"
              hint="How long the balance grows"
              value={years}
              min={1}
              max={50}
              step={1}
              unit=" yr"
              onChange={(v) => { setYears(v); pulse(); }}
            />

            {mode === "compound" && (
              <>
                <SectionLabel text="Compounding" sub="How often interest is added" />
                <div className="grid grid-cols-3 gap-2">
                  {(["annually", "semiannually", "quarterly", "monthly", "daily"] as CompoundFrequency[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => { setCompounding(item); pulse(); }}
                      className={
                        "rounded-lg border px-2 py-2 text-xs font-semibold transition " +
                        (compounding === item
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                      }
                    >
                      {FREQUENCY_LABEL[item]}
                    </button>
                  ))}
                </div>
              </>
            )}

            <SectionLabel text="Contributions (optional)" sub="Recurring monthly deposit" />
            <NumInput
              label="Monthly contribution"
              value={monthlyContribution}
              onChange={(v) => { setMonthlyContribution(v); pulse(); }}
              min={0}
              max={100_000}
              step={50}
              prefix="$"
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
              : "Calculate interest"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your balance and rate, then click Calculate"
                subMessage="Your final balance, total interest, effective yield, and growth curve will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Projecting your growth"
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
                eyebrow={`${mode === "compound" ? FREQUENCY_LABEL[compounding] + " compound" : "Simple interest"} · ${years} yr`}
                primaryValue={result.finalBalance}
                primaryFormat={(v) => `$${Math.round(v).toLocaleString()}`}
                primaryUnit="final balance"
                accentColor="#34d399"
                note={{ text: `${money(result.totalInterest)} interest earned`, tone: "positive" }}
                subStats={[
                  { label: "Total interest", value: result.totalInterest, format: money, sub: "earned" },
                  { label: "Deposited", value: result.totalDeposited, format: money, sub: "principal + added" },
                  { label: "Effective APY", value: result.effectiveAnnualRatePct, format: (v) => `${v}%`, sub: "yearly yield" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Balance growth over time"
                subtitle="How your balance builds year by year"
                data={result.schedule.map((p) => ({ x: p.year, y: p.balance }))}
                xFormat={(v) => `${v}y`}
                yFormat={(v) => `$${Math.round(v / 1000)}k`}
                tooltipX={(v) => `Year ${v}`}
                tooltipY={(v) => money(v)}
                referenceValue={result.totalDeposited}
                referenceLabel="Deposited"
              />

              <BreakdownBarChart
                title="What makes up your final balance"
                data={result.breakdown.map((d) => ({
                  label: d.label,
                  amount: d.amount,
                  pct: result.finalBalance > 0 ? Math.round((d.amount / result.finalBalance) * 100) : 0,
                  fill: BREAKDOWN_COLOR_HEX[d.colorClass],
                }))}
                valueFormat={(v) => money(v)}
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
