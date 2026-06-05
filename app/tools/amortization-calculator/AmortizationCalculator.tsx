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
import { calculateAmortization } from "@/lib/calculators/amortizationEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

// Live default rate (30-yr fixed) from FRED — refreshes with the dataset.
const RATE_DEFAULT = fredBenchmarks.mortgage30yr;
const AS_OF = fredBenchmarks.currentPeriodLabel;

const CALC_STEPS = [
  "Computing your monthly payment...",
  "Building the amortization schedule...",
  "Splitting principal vs interest...",
  "Generating payoff insights...",
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

export default function AmortizationCalculator() {
  const [loanAmount, setLoanAmount] = useState(300_000);
  const [annualRatePct, setAnnualRatePct] = useState(RATE_DEFAULT);
  const [termYears, setTermYears] = useState(30);
  const [extra, setExtra] = useState(0);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  const r = calculateAmortization({
    loanAmount,
    annualRatePct,
    termYears,
    extraMonthlyPayment: extra,
  });

  const insights: Insight[] = [];
  insights.push({
    tone: r.interestPctOfPrincipal >= 50 ? "warning" : "neutral",
    text: `${fmtFull(r.totalInterest)} in total interest — that's ${r.interestPctOfPrincipal}% of the ${fmtFull(loanAmount)} you borrow, on top of the principal.`,
  });
  if (r.schedule.length > 0) {
    const first = r.schedule[0];
    insights.push({
      tone: "neutral",
      text: `${fmtFull(first.interestPaid)} of your first year's payments goes to interest vs ${fmtFull(first.principalPaid)} to principal — early payments are interest-heavy.`,
    });
  }
  if (extra > 0 && r.interestSaved > 0) {
    insights.push({
      tone: "positive",
      text: `${fmtFull(r.interestSaved)} saved and paid off ${monthsToYrMo(r.monthsSaved)} sooner by adding ${fmtFull(extra)}/mo to every payment.`,
    });
  } else {
    insights.push({
      tone: "neutral",
      text: `Add an extra monthly payment below to see how much interest and time you could cut off the loan.`,
    });
  }
  insights.push({
    tone: "neutral",
    text: `Rate defaults to the current US 30-year fixed average of ${RATE_DEFAULT}% (${AS_OF}) — override it with your actual rate for an exact figure.`,
  });

  const payoffYears = r.payoffMonths > 0 ? r.payoffMonths / 12 : termYears;

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Loan" sub="The amount you borrow and how long to repay it" />
            <NumInput
              label="Loan amount"
              prefix="$"
              hint="Principal borrowed (price minus down payment)"
              value={loanAmount}
              onChange={setLoanAmount}
              step={5000}
              min={1000}
              max={5_000_000}
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
              label="Loan term"
              hint="Common terms: 15, 20, or 30 years"
              value={termYears}
              min={1}
              max={40}
              step={1}
              unit=" yr"
              onChange={setTermYears}
            />

            <SectionLabel text="Pay it off faster" sub="Optional — extra principal every month" />
            <NumInput
              label="Extra monthly payment"
              prefix="$"
              hint="Added to every payment, straight to principal"
              value={extra}
              onChange={setExtra}
              step={50}
              min={0}
              max={20_000}
              wide
            />
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Calculate payment"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your loan details and click Calculate"
                subMessage="Your monthly payment, total interest, schedule, and payoff insights will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Amortizing your loan"
              />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow="Monthly payment (principal + interest)"
                primaryValue={r.monthlyPayment}
                primaryFormat={(n) => `$${n.toLocaleString()}`}
                primaryUnit="/mo"
                accentColor="#34d399"
                note={{
                  text: `${fmtFull(r.totalInterest)} total interest over the loan (${r.interestPctOfPrincipal}% of principal)`,
                  tone: r.interestPctOfPrincipal >= 50 ? "warning" : "positive",
                }}
                subStats={[
                  { label: "Total interest", value: r.totalInterest, format: fmt, sub: "over the loan" },
                  { label: "Total paid", value: r.totalPaid, format: fmt, sub: "principal + interest" },
                  { label: "Payoff", value: payoffYears, format: (n) => `${n.toFixed(n % 1 ? 1 : 0)}`, sub: "years" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Balance over time"
                subtitle="How your remaining balance falls each year"
                data={r.balanceCurve}
                xFormat={(v) => `yr ${v}`}
                yFormat={(v) => fmt(v)}
                tooltipX={(v) => `Year ${v}`}
                tooltipY={(v) => `${fmtFull(v)} remaining`}
                color="#34d399"
              />

              <BreakdownBarChart
                title="Where your money goes: principal vs interest"
                data={r.principalVsInterest}
                valueFormat={(v) => fmtFull(v)}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer text="This estimate covers principal and interest only. It does not include property tax, homeowners or mortgage insurance (PMI), HOA dues, or loan fees, which can significantly increase your true monthly cost. Confirm exact figures with your lender." />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
