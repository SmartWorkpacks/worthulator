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
import { calculateLoanPayment } from "@/lib/calculators/loanPaymentEngine";
import {
  fredBenchmarks,
  getAutoLoanNewAPR,
  getAutoLoanUsedAPR,
} from "@/lib/datasets/finance/fredBenchmarks";

const AS_OF = fredBenchmarks.currentPeriodLabel;

// Loan-type presets — each pulls a live FRED APR so the calculator opens with a
// real current rate for the chosen loan type. "Custom" lets the user set their own.
const PRESETS: { id: string; label: string; rate: number; term: number; amount: number }[] = [
  { id: "personal", label: "Personal", rate: fredBenchmarks.personalLoan24moAPR, term: 5, amount: 25_000 },
  { id: "auto-new", label: "Auto (new)", rate: getAutoLoanNewAPR(), term: 5, amount: 35_000 },
  { id: "auto-used", label: "Auto (used)", rate: getAutoLoanUsedAPR(), term: 5, amount: 22_000 },
  { id: "mortgage", label: "Mortgage", rate: fredBenchmarks.mortgage30yr, term: 30, amount: 320_000 },
];

const CALC_STEPS = [
  "Reading your loan terms...",
  "Computing the monthly payment...",
  "Comparing term lengths...",
  "Building payoff insights...",
];

function fmt(v: number) {
  const a = Math.round(Math.abs(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a.toLocaleString()}`;
}
const fmtFull = (v: number) => `$${Math.round(Math.abs(v)).toLocaleString()}`;

export default function LoanPaymentCalculator() {
  const [loanType, setLoanType] = useState("personal");
  const [loanAmount, setLoanAmount] = useState(25_000);
  const [annualRatePct, setAnnualRatePct] = useState(fredBenchmarks.personalLoan24moAPR);
  const [termYears, setTermYears] = useState(5);
  const [extra, setExtra] = useState(0);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  function applyPreset(id: string) {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setLoanType(id);
    setAnnualRatePct(p.rate);
    setTermYears(p.term);
    setLoanAmount(p.amount);
  }

  const r = calculateLoanPayment({ loanAmount, annualRatePct, termYears, extraMonthlyPayment: extra });

  // Compare the chosen term to the next-shorter option for a concrete trade-off.
  const chosen = r.paymentByTerm.find((p) => p.termYears === Math.round(termYears));
  const shorter = [...r.paymentByTerm].reverse().find((p) => p.termYears < Math.round(termYears));

  const insights: Insight[] = [];
  insights.push({
    tone: r.interestPctOfPrincipal >= 40 ? "warning" : "neutral",
    text: `${fmtFull(r.totalInterest)} in total interest over the loan — ${r.interestPctOfPrincipal}% on top of the ${fmtFull(loanAmount)} you borrow.`,
  });
  if (chosen && shorter) {
    const saved = chosen.totalInterest - shorter.totalInterest;
    const higher = shorter.monthlyPayment - chosen.monthlyPayment;
    insights.push({
      tone: "positive",
      text: `Choosing ${shorter.termYears} years instead of ${Math.round(termYears)} raises the payment by ${fmtFull(higher)}/mo but saves ${fmtFull(saved)} in total interest.`,
    });
  }
  if (extra > 0 && r.interestSaved > 0) {
    const y = Math.floor(r.monthsSaved / 12);
    const mo = r.monthsSaved % 12;
    insights.push({
      tone: "positive",
      text: `Paying ${fmtFull(extra)}/mo extra saves ${fmtFull(r.interestSaved)} and clears the loan ${y > 0 ? `${y} yr ` : ""}${mo} mo sooner.`,
    });
  } else {
    insights.push({
      tone: "neutral",
      text: `Add an extra monthly payment below to see how much interest and time you could cut.`,
    });
  }
  if (loanType !== "custom") {
    const p = PRESETS.find((x) => x.id === loanType);
    insights.push({
      tone: "neutral",
      text: `Rate defaults to the current US ${p?.label.toLowerCase()} loan average of ${annualRatePct}% (${AS_OF}, FRED) — set your quoted APR for an exact figure.`,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Loan type" sub="Presets load the current average APR (FRED)" />
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id)}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                    loanType === p.id
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {p.label}
                  <span className={`ml-1 text-xs font-normal ${loanType === p.id ? "text-gray-300" : "text-gray-400"}`}>
                    {p.rate}%
                  </span>
                </button>
              ))}
            </div>

            <SectionLabel text="Your loan" sub="Amount, rate, and term" />
            <NumInput
              label="Loan amount"
              prefix="$"
              value={loanAmount}
              onChange={(v) => { setLoanAmount(v); setLoanType("custom"); }}
              step={1000}
              min={500}
              max={5_000_000}
              wide
            />
            <RangeSliderCard
              label="Interest rate (APR)"
              hint={loanType === "custom" ? "Your quoted annual rate" : `Live US average for this loan type (${AS_OF})`}
              value={annualRatePct}
              min={0}
              max={30}
              step={0.1}
              unit="%"
              onChange={(v) => { setAnnualRatePct(v); setLoanType("custom"); }}
            />
            <RangeSliderCard
              label="Loan term"
              hint="How long to repay"
              value={termYears}
              min={1}
              max={40}
              step={1}
              unit=" yr"
              onChange={(v) => { setTermYears(v); setLoanType("custom"); }}
            />

            <SectionLabel text="Pay it off faster" sub="Optional — extra principal each month" />
            <NumInput
              label="Extra monthly payment"
              prefix="$"
              value={extra}
              onChange={setExtra}
              step={25}
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
                message="Pick a loan type or enter your terms, then click Calculate"
                subMessage="Your monthly payment, total interest, term comparison, and payoff insights appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Computing your payment"
              />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow="Monthly payment"
                primaryValue={r.monthlyPayment}
                primaryFormat={(n) => `$${n.toLocaleString()}`}
                primaryUnit="/mo"
                accentColor="#34d399"
                note={{
                  text: `${fmtFull(r.totalPaid)} total over ${Math.round(termYears)} years · ${fmtFull(r.totalInterest)} interest`,
                  tone: r.interestPctOfPrincipal >= 40 ? "warning" : "positive",
                }}
                subStats={[
                  { label: "Total interest", value: r.totalInterest, format: fmt, sub: "over the loan" },
                  { label: "Total paid", value: r.totalPaid, format: fmt, sub: "principal + interest" },
                  { label: "Interest", value: r.interestPctOfPrincipal, format: (n) => `${Math.round(n)}%`, sub: "of principal" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Monthly payment by loan term"
                subtitle="Longer terms lower the payment but cost much more in total interest"
                data={r.paymentByTerm.map((p) => ({ x: p.termYears, y: p.monthlyPayment }))}
                xFormat={(v) => `${v}y`}
                yFormat={(v) => fmt(v)}
                tooltipX={(v) => `${v}-year term`}
                tooltipY={(v) => `${fmtFull(v)}/mo`}
                referenceX={Math.round(termYears)}
                referenceXLabel="Your term"
                color="#34d399"
              />

              <BreakdownBarChart
                title="What you repay: principal vs interest"
                data={r.principalVsInterest}
                valueFormat={(v) => fmtFull(v)}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer text="Assumes a fixed rate and equal monthly payments. Origination fees, insurance, and variable-rate terms can change your actual cost — confirm the APR and total cost of credit with your lender." />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
