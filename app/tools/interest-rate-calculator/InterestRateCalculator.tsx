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
  BreakdownBarChart,
  NumInput,
  SectionLabel,
} from "@/src/templates/insights";
import { calculateInterestRate } from "@/lib/calculators/interestRateEngine";

const CALC_STEPS = [
  "Reading your loan terms...",
  "Searching for the rate...",
  "Solving the payment equation...",
  "Confirming the result...",
];

function fmt(v: number) {
  const a = Math.round(Math.abs(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a.toLocaleString()}`;
}
const fmtFull = (v: number) => `$${Math.round(Math.abs(v)).toLocaleString()}`;

export default function InterestRateCalculator() {
  const [loanAmount, setLoanAmount] = useState(25_000);
  const [monthlyPayment, setMonthlyPayment] = useState(500);
  const [termYears, setTermYears] = useState(5);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  const r = calculateInterestRate({ loanAmount, monthlyPayment, termYears });

  const insights: Insight[] = [];
  if (r.paymentTooLow) {
    insights.push({
      tone: "warning",
      text: `A ${fmtFull(monthlyPayment)}/mo payment is too small to ever pay off ${fmtFull(loanAmount)} in ${termYears} years — even at 0% interest you'd need at least ${fmtFull(loanAmount / (termYears * 12))}/mo.`,
    });
  } else {
    insights.push({
      tone: r.annualRatePct > 15 ? "warning" : "positive",
      text: `Those terms imply an interest rate of about ${r.annualRatePct}% APR.${r.annualRatePct > 15 ? " That's high — worth shopping around or refinancing." : ""}`,
    });
    insights.push({
      tone: "neutral",
      text: `Over ${termYears} years you'd pay ${fmtFull(r.totalPaid)} in total — ${fmtFull(r.totalInterest)} of it interest, or ${r.interestPctOfPrincipal}% of what you borrowed.`,
    });
    insights.push({
      tone: "neutral",
      text: `Use this to reverse-engineer a rate a lender didn't state clearly, or to check whether a quoted "low monthly payment" actually hides a high rate.`,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Loan terms" sub="Enter what you know — we solve for the rate" />
            <NumInput label="Loan amount" prefix="$" value={loanAmount} onChange={setLoanAmount} step={1_000} min={0} max={10_000_000} wide />
            <NumInput label="Monthly payment" prefix="$" value={monthlyPayment} onChange={setMonthlyPayment} step={25} min={0} max={1_000_000} wide />
            <NumInput label="Term (years)" value={termYears} onChange={setTermYears} step={1} min={1} max={40} wide />
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing" ? "Solving..." : revealState === "revealed" ? "Recalculate" : "Find my interest rate"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your loan amount, monthly payment, and term"
                subMessage="We'll solve for the interest rate hidden in those numbers"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader steps={CALC_STEPS} step={calcStep} progress={calcProgress} subtitle="Solving for your rate" />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow="Implied interest rate"
                primaryValue={r.annualRatePct}
                primaryFormat={(n) => `${n.toFixed(2)}`}
                primaryUnit="% APR"
                accentColor="#f59e0b"
                note={{
                  text: r.paymentTooLow
                    ? `Payment too low — it can't repay ${fmtFull(loanAmount)} in ${termYears} years`
                    : `${fmtFull(loanAmount)} at ${fmtFull(monthlyPayment)}/mo over ${termYears} years`,
                  tone: r.paymentTooLow || r.annualRatePct > 15 ? "warning" : "positive",
                }}
                subStats={[
                  { label: "Total paid", value: r.totalPaid, format: fmt },
                  { label: "Total interest", value: r.totalInterest, format: fmt },
                  { label: "Interest vs loan", value: r.interestPctOfPrincipal, format: (n) => `${n}%` },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              {!r.paymentTooLow && r.rateByPayment.length > 0 && (
                <ImpactLineChart
                  title="How the rate changes with your payment"
                  subtitle="Same loan and term — a higher monthly payment implies a higher rate"
                  data={r.rateByPayment}
                  xFormat={(v) => fmt(v)}
                  yFormat={(v) => `${v}%`}
                  tooltipX={(v) => `${fmtFull(v)}/mo`}
                  tooltipY={(v) => `${v}% APR`}
                  referenceX={monthlyPayment}
                  referenceXLabel="Your payment"
                  color="#f59e0b"
                />
              )}

              <BreakdownBarChart
                title="Principal vs interest"
                data={r.breakdown}
                valueFormat={(v) => fmtFull(v)}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer text="This solves for the nominal APR implied by a simple fixed-rate, fully-amortizing loan. Real loans may include fees, points, or compounding conventions that shift the true APR. Use it as a close estimate and confirm the exact rate with your lender's disclosures." />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
