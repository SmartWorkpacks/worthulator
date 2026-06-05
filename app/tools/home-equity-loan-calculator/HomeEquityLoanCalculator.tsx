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
import { calculateHomeEquityLoan, HE_LOAN_SPREAD_OVER_MORTGAGE } from "@/lib/calculators/homeEquityLoanEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

const CALC_STEPS = [
  "Measuring your home equity...",
  "Checking the lender's CLTV cap...",
  "Building your fixed payment...",
  "Comparing loan terms...",
];

// Home equity loans price above first mortgages; derive a live fixed default.
const DEFAULT_APR = Math.round((fredBenchmarks.mortgage30yr + HE_LOAN_SPREAD_OVER_MORTGAGE) * 10) / 10;

function fmt(v: number) {
  const a = Math.round(Math.abs(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a.toLocaleString()}`;
}
const fmtFull = (v: number) => `$${Math.round(Math.abs(v)).toLocaleString()}`;

export default function HomeEquityLoanCalculator() {
  const [homeValue, setHomeValue] = useState(500_000);
  const [mortgageBalance, setMortgageBalance] = useState(250_000);
  const [loanAmount, setLoanAmount] = useState(100_000);
  const [annualRatePct, setAnnualRatePct] = useState(DEFAULT_APR);
  const [termYears, setTermYears] = useState(15);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  const r = calculateHomeEquityLoan({ homeValue, mortgageBalance, loanAmount, annualRatePct, termYears });

  const insights: Insight[] = [];
  insights.push({
    tone: "neutral",
    text: `You have ${fmtFull(r.availableEquity)} in home equity. At an 85% combined loan-to-value cap, you can borrow up to ${fmtFull(r.maxLoan)} as a home equity loan.`,
  });
  if (r.exceedsMax) {
    insights.push({
      tone: "warning",
      text: `Your requested ${fmtFull(loanAmount)} exceeds the ${fmtFull(r.maxLoan)} most lenders allow at 85% CLTV. Lower the amount or you may be declined.`,
    });
  } else {
    insights.push({
      tone: "positive",
      text: `Borrowing ${fmtFull(r.loanAmount)} puts your combined loan-to-value at ${r.combinedLtvPct}% — within the typical 85% limit.`,
    });
  }
  insights.push({
    tone: r.totalInterest > r.loanAmount * 0.5 ? "warning" : "neutral",
    text: `Over ${termYears} years you'll pay ${fmtFull(r.totalInterest)} in interest — ${Math.round((r.totalInterest / Math.max(1, r.loanAmount)) * 100)}% of what you borrow — for a total cost of ${fmtFull(r.totalCost)}.`,
  });
  insights.push({
    tone: "neutral",
    text: `Unlike a HELOC, this is a fixed-rate lump sum: your ${fmtFull(r.monthlyPayment)}/mo payment never changes, so there's no payment shock if rates rise.`,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Your home" sub="Equity is value minus what you still owe" />
            <NumInput label="Home value" prefix="$" value={homeValue} onChange={setHomeValue} step={10_000} min={0} max={10_000_000} wide />
            <NumInput label="Mortgage balance" prefix="$" value={mortgageBalance} onChange={setMortgageBalance} step={10_000} min={0} max={10_000_000} wide />

            <SectionLabel text="The loan" sub="A fixed-rate lump sum repaid over a set term" />
            <NumInput label="Loan amount" prefix="$" value={loanAmount} onChange={setLoanAmount} step={5_000} min={0} max={5_000_000} wide />
            <NumInput
              label="Interest rate (APR)"
              suffix="%"
              hint={`Default derived from the live 30-yr mortgage rate + ${HE_LOAN_SPREAD_OVER_MORTGAGE} pts (${fredBenchmarks.currentPeriodLabel})`}
              value={annualRatePct}
              onChange={setAnnualRatePct}
              step={0.1}
              min={0}
              max={30}
              wide
            />
            <NumInput label="Term (years)" value={termYears} onChange={setTermYears} step={1} min={1} max={30} wide />
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Calculate my loan"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your home value, mortgage balance, and the amount you want to borrow"
                subMessage="Your fixed monthly payment, total interest, and borrowing limit appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader steps={CALC_STEPS} step={calcStep} progress={calcProgress} subtitle="Sizing your home equity loan" />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow="Fixed monthly payment"
                primaryValue={r.monthlyPayment}
                primaryFormat={(n) => `$${n.toLocaleString()}`}
                primaryUnit="/mo"
                accentColor="#60a5fa"
                note={{
                  text: r.exceedsMax
                    ? `Heads up: ${fmtFull(loanAmount)} exceeds your ${fmtFull(r.maxLoan)} limit at 85% CLTV`
                    : `${fmtFull(r.loanAmount)} borrowed · ${r.combinedLtvPct}% combined LTV · ${termYears}-yr fixed`,
                  tone: r.exceedsMax ? "warning" : "positive",
                }}
                subStats={[
                  { label: "Available equity", value: r.availableEquity, format: fmt },
                  { label: "Max loan (85% CLTV)", value: r.maxLoan, format: fmt },
                  { label: "Total interest", value: r.totalInterest, format: fmt },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Monthly payment by loan term"
                subtitle="A shorter term raises the payment but slashes total interest"
                data={r.paymentByTerm}
                xFormat={(v) => `${v}y`}
                yFormat={(v) => fmt(v)}
                tooltipX={(v) => `${v}-year term`}
                tooltipY={(v) => `${fmtFull(v)}/mo`}
                referenceX={termYears}
                referenceXLabel="Your term"
                color="#60a5fa"
              />

              <BreakdownBarChart
                title="What the loan really costs"
                data={[
                  { label: "Amount borrowed", amount: r.loanAmount },
                  { label: "Interest", amount: r.totalInterest },
                ]}
                valueFormat={(v) => fmtFull(v)}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer text="Estimates only. Actual rates, the maximum CLTV, closing costs, and approval depend on your credit, income, and lender. A home equity loan is secured by your home — missing payments can lead to foreclosure." />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
