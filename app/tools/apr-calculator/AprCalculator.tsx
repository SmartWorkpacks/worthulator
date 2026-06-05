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
import { calculateApr } from "@/lib/calculators/aprEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

const CALC_STEPS = [
  "Reading your loan and fees...",
  "Pricing the upfront costs...",
  "Solving for the true rate...",
  "Confirming your APR...",
];

const DEFAULT_RATE = fredBenchmarks.mortgage30yr;

function fmt(v: number) {
  const a = Math.round(Math.abs(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a.toLocaleString()}`;
}
const fmtFull = (v: number) => `$${Math.round(Math.abs(v)).toLocaleString()}`;

export default function AprCalculator() {
  const [loanAmount, setLoanAmount] = useState(300_000);
  const [noteRatePct, setNoteRatePct] = useState(DEFAULT_RATE);
  const [fees, setFees] = useState(6_000);
  const [termYears, setTermYears] = useState(30);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  const r = calculateApr({ loanAmount, noteRatePct, fees, termYears });

  const insights: Insight[] = [];
  insights.push({
    tone: "positive",
    text: `Your ${noteRatePct}% note rate has a true APR of ${r.aprPct}% once ${fmtFull(fees)} in fees are folded in — a gap of ${r.aprPremiumPct.toFixed(2)} points.`,
  });
  insights.push({
    tone: "neutral",
    text: `You borrow ${fmtFull(loanAmount)} but only receive ${fmtFull(r.netReceived)} after fees, while still repaying based on the full ${fmtFull(loanAmount)}.`,
  });
  insights.push({
    tone: r.aprPremiumPct > 0.5 ? "warning" : "neutral",
    text: `Over ${termYears} years the loan costs ${fmtFull(r.totalCost)} — ${fmtFull(r.totalInterest)} interest plus ${fmtFull(fees)} fees.`,
  });
  insights.push({
    tone: "neutral",
    text: `When comparing offers, use APR, not the headline rate. A lower rate with high fees can cost more than a higher rate with none.`,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="The loan" sub="Amount, stated rate, and term" />
            <NumInput label="Loan amount" prefix="$" value={loanAmount} onChange={setLoanAmount} step={5_000} min={0} max={10_000_000} wide />
            <NumInput
              label="Note (interest) rate"
              suffix="%"
              hint={`Defaults to the live 30-yr mortgage rate (${fredBenchmarks.currentPeriodLabel})`}
              value={noteRatePct}
              onChange={setNoteRatePct}
              step={0.1}
              min={0}
              max={30}
              wide
            />
            <NumInput label="Term (years)" value={termYears} onChange={setTermYears} step={1} min={1} max={40} wide />

            <SectionLabel text="Upfront costs" sub="Origination, points, and closing fees" />
            <NumInput label="Total fees & points" prefix="$" value={fees} onChange={setFees} step={500} min={0} max={1_000_000} wide />
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing" ? "Solving..." : revealState === "revealed" ? "Recalculate" : "Calculate my APR"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your loan amount, note rate, term, and upfront fees"
                subMessage="We'll fold the fees into the true APR you're really paying"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader steps={CALC_STEPS} step={calcStep} progress={calcProgress} subtitle="Solving for your true APR" />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow="True APR (rate + fees)"
                primaryValue={r.aprPct}
                primaryFormat={(n) => `${n.toFixed(2)}`}
                primaryUnit="% APR"
                accentColor="#f59e0b"
                note={{
                  text: `${noteRatePct}% note rate + ${fmtFull(fees)} fees → ${r.aprPremiumPct.toFixed(2)} pts higher`,
                  tone: r.aprPremiumPct > 0.5 ? "warning" : "positive",
                }}
                subStats={[
                  { label: "Monthly payment", value: r.monthlyPayment, format: fmt, sub: "/mo" },
                  { label: "Net received", value: r.netReceived, format: fmt, sub: "after fees" },
                  { label: "Total cost", value: r.totalCost, format: fmt, sub: "interest + fees" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="How fees push up your APR"
                subtitle="Same loan and rate — more upfront fees means a higher true cost"
                data={r.aprByFees}
                xFormat={(v) => fmt(v)}
                yFormat={(v) => `${v}%`}
                tooltipX={(v) => `${fmtFull(v)} fees`}
                tooltipY={(v) => `${v}% APR`}
                referenceX={fees}
                referenceXLabel="Your fees"
                color="#f59e0b"
              />

              <BreakdownBarChart
                title="What you pay beyond principal"
                data={r.breakdown}
                valueFormat={(v) => fmtFull(v)}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer text="This estimates APR for a simple fixed-rate, fully-amortizing loan by spreading upfront fees over the term. Lenders' official APR may differ slightly due to which fees are included and specific federal calculation rules. Always compare the APR on each lender's Loan Estimate." />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
