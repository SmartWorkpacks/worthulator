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
import { calculateMortgagePayoff } from "@/lib/calculators/mortgagePayoffEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

const RATE_DEFAULT = fredBenchmarks.mortgage30yr;
const AS_OF = fredBenchmarks.currentPeriodLabel;

const CALC_STEPS = [
  "Reading your current mortgage...",
  "Running your baseline payoff...",
  "Applying your payoff plan...",
  "Totalling interest saved...",
];

function fmt(v: number) {
  const a = Math.round(Math.abs(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a.toLocaleString()}`;
}
const fmtFull = (v: number) => `$${Math.round(Math.abs(v)).toLocaleString()}`;

function monthsToYrMo(m: number) {
  const y = Math.floor(m / 12);
  const mo = m % 12;
  if (y > 0 && mo > 0) return `${y} yr ${mo} mo`;
  if (y > 0) return `${y} yr`;
  return `${mo} mo`;
}

export default function MortgagePayoffCalculator() {
  const [currentBalance, setCurrentBalance] = useState(280_000);
  const [annualRatePct, setAnnualRatePct] = useState(RATE_DEFAULT);
  const [remainingTermYears, setRemainingTermYears] = useState(25);
  const [extraMonthly, setExtraMonthly] = useState(200);
  const [lumpSum, setLumpSum] = useState(0);
  const [biweekly, setBiweekly] = useState(false);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  const r = calculateMortgagePayoff({ currentBalance, annualRatePct, remainingTermYears, extraMonthly, lumpSum, biweekly });

  const hasPlan = extraMonthly > 0 || lumpSum > 0 || biweekly;
  const newPayoffYears = r.newPayoffMonths / 12;

  const insights: Insight[] = [];
  if (hasPlan && r.monthsSaved > 0) {
    insights.push({
      tone: "positive",
      text: `Your plan pays the mortgage off ${monthsToYrMo(r.monthsSaved)} sooner — ${monthsToYrMo(r.newPayoffMonths)} instead of ${monthsToYrMo(r.baselinePayoffMonths)}.`,
    });
    insights.push({
      tone: "positive",
      text: `You'd save ${fmtFull(r.interestSaved)} in interest (${r.interestSavedPct}% of the ${fmtFull(r.baselineTotalInterest)} you'd otherwise pay).`,
    });
  } else {
    insights.push({
      tone: "neutral",
      text: `At ${fmtFull(r.monthlyPayment)}/mo you'd pay off in ${monthsToYrMo(r.baselinePayoffMonths)} and ${fmtFull(r.baselineTotalInterest)} of interest. Add a plan below to beat that.`,
    });
  }
  if (biweekly) {
    insights.push({
      tone: "neutral",
      text: `Biweekly payments add roughly one extra monthly payment per year — a low-effort way to shave years off without a big budget change.`,
    });
  }
  insights.push({
    tone: "neutral",
    text: `Rate defaults to the current US 30-year fixed average of ${RATE_DEFAULT}% (${AS_OF}) — use your actual mortgage rate for an exact figure.`,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Your current mortgage" sub="What you owe today" />
            <NumInput
              label="Current balance"
              prefix="$"
              hint="Remaining principal, not the original loan"
              value={currentBalance}
              onChange={setCurrentBalance}
              step={5_000}
              min={1_000}
              max={10_000_000}
              wide
            />
            <RangeSliderCard
              label="Interest rate (APR)"
              hint={`Defaults to the live US 30-yr fixed average (${AS_OF})`}
              value={annualRatePct}
              min={0}
              max={15}
              step={0.1}
              unit="%"
              onChange={setAnnualRatePct}
            />
            <RangeSliderCard
              label="Years remaining"
              hint="Time left on your current schedule"
              value={remainingTermYears}
              min={1}
              max={40}
              step={1}
              unit=" yr"
              onChange={setRemainingTermYears}
            />

            <SectionLabel text="Your payoff plan" sub="Combine any of these to pay off faster" />
            <NumInput
              label="Extra monthly payment"
              prefix="$"
              value={extraMonthly}
              onChange={setExtraMonthly}
              step={50}
              min={0}
              max={50_000}
              wide
            />
            <NumInput
              label="One-time lump sum"
              prefix="$"
              hint="Applied to principal now"
              value={lumpSum}
              onChange={setLumpSum}
              step={1_000}
              min={0}
              max={5_000_000}
              wide
            />
            <button
              type="button"
              onClick={() => setBiweekly((b) => !b)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                biweekly ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              <span>
                Biweekly payments
                <span className="block text-xs font-normal text-gray-400">Half-payment every 2 weeks (≈ 1 extra/yr)</span>
              </span>
              <span className={`ml-3 flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors ${biweekly ? "bg-emerald-500" : "bg-gray-300"}`}>
                <span className={`h-4 w-4 rounded-full bg-white transition-transform ${biweekly ? "translate-x-4" : ""}`} />
              </span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Calculate payoff"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your current mortgage and a payoff plan, then click Calculate"
                subMessage="How much sooner you'll be mortgage-free and the interest you'll save appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Running your payoff plan"
              />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow={hasPlan ? "Interest saved with your plan" : "Total interest on your current plan"}
                primaryValue={hasPlan ? r.interestSaved : r.baselineTotalInterest}
                primaryFormat={(n) => `$${n.toLocaleString()}`}
                accentColor="#34d399"
                note={{
                  text: hasPlan
                    ? `Mortgage-free ${monthsToYrMo(r.monthsSaved)} sooner — in ${monthsToYrMo(r.newPayoffMonths)} instead of ${monthsToYrMo(r.baselinePayoffMonths)}`
                    : `Paid off in ${monthsToYrMo(r.baselinePayoffMonths)} at ${fmtFull(r.monthlyPayment)}/mo`,
                  tone: "positive",
                }}
                subStats={[
                  { label: "Monthly payment", value: r.monthlyPayment, format: fmt, sub: "current P&I" },
                  { label: "New payoff", value: newPayoffYears, format: (n) => `${n.toFixed(n % 1 ? 1 : 0)}`, sub: "years" },
                  { label: "Interest saved", value: r.interestSavedPct, format: (n) => `${Math.round(n)}%`, sub: "vs current" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Months saved by extra monthly payment"
                subtitle="How much sooner you finish for each added dollar per month"
                data={r.savingsByExtra}
                xFormat={(v) => `$${v}`}
                yFormat={(v) => `${Math.round(v / 12)}y`}
                tooltipX={(v) => `+$${v}/mo`}
                tooltipY={(v) => `${monthsToYrMo(Math.round(v))} sooner`}
                referenceX={extraMonthly}
                referenceXLabel="Your extra"
                color="#34d399"
              />

              <BreakdownBarChart
                title="Total interest: current plan vs payoff plan"
                data={r.interestComparison}
                valueFormat={(v) => fmtFull(v)}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer text="Assumes a fixed rate and that extra payments apply fully to principal. Check your loan has no prepayment penalty, and confirm your servicer applies biweekly or extra payments to principal (not just held). Property tax and insurance are not included." />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
