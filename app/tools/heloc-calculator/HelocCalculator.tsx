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
import { calculateHeloc, PRIME_OVER_FED_FUNDS } from "@/lib/calculators/helocEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

// HELOCs are priced near Prime. Prime ≈ effective Fed Funds + 3.0 (live via FRED).
const PRIME = Math.round((fredBenchmarks.fedFundsRate + PRIME_OVER_FED_FUNDS) * 10) / 10;
const AS_OF = fredBenchmarks.currentPeriodLabel;

const CALC_STEPS = [
  "Measuring your home equity...",
  "Sizing your available credit line...",
  "Modelling draw vs repayment...",
  "Checking for payment shock...",
];

function fmt(v: number) {
  const a = Math.round(Math.abs(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a.toLocaleString()}`;
}
const fmtFull = (v: number) => `$${Math.round(Math.abs(v)).toLocaleString()}`;

export default function HelocCalculator() {
  const [homeValue, setHomeValue] = useState(500_000);
  const [mortgageBalance, setMortgageBalance] = useState(300_000);
  const [maxCltvPct, setMaxCltvPct] = useState(85);
  const [drawAmount, setDrawAmount] = useState(100_000);
  const [annualRatePct, setAnnualRatePct] = useState(PRIME);
  const [drawYears, setDrawYears] = useState(10);
  const [repayYears, setRepayYears] = useState(20);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  const r = calculateHeloc({
    homeValue,
    mortgageBalance,
    maxCltvPct,
    drawAmount,
    annualRatePct,
    drawYears,
    repayYears,
  });

  const insights: Insight[] = [];
  insights.push({
    tone: "neutral",
    text: `You have ${fmtFull(r.currentEquity)} in home equity (${r.currentEquityPct}% of value). At a ${maxCltvPct}% CLTV cap, your largest possible line is ${fmtFull(r.maxLine)}.`,
  });
  if (r.exceedsLimit) {
    insights.push({
      tone: "warning",
      text: `Your ${fmtFull(drawAmount)} request is above the ${fmtFull(r.maxLine)} you qualify for — the figures below use the ${fmtFull(r.borrowed)} maximum.`,
    });
  }
  insights.push({
    tone: r.paymentShockMultiple >= 1.8 ? "warning" : "neutral",
    text: `Payment shock: ${fmtFull(r.interestOnlyPayment)}/mo interest-only during the ${drawYears}-yr draw jumps to ${fmtFull(r.repaymentPayment)}/mo (${r.paymentShockMultiple}×) when repayment begins.`,
  });
  insights.push({
    tone: "neutral",
    text: `Rate defaults to the current Prime Rate of ${PRIME}% (Fed Funds + ${PRIME_OVER_FED_FUNDS}, ${AS_OF}). HELOCs are variable and usually priced near Prime, often plus a margin.`,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Your home" sub="Value and what you still owe" />
            <NumInput
              label="Home value"
              prefix="$"
              value={homeValue}
              onChange={setHomeValue}
              step={10_000}
              min={10_000}
              max={10_000_000}
              wide
            />
            <NumInput
              label="Mortgage balance"
              prefix="$"
              hint="Remaining on your current mortgage (0 if paid off)"
              value={mortgageBalance}
              onChange={setMortgageBalance}
              step={10_000}
              min={0}
              max={10_000_000}
              wide
            />
            <RangeSliderCard
              label="Max combined LTV"
              hint={`Lender cap on mortgage + HELOC vs value (often 80–85%) · max line ${fmtFull(r.maxLine)}`}
              value={maxCltvPct}
              min={50}
              max={100}
              step={1}
              unit="%"
              onChange={setMaxCltvPct}
            />

            <SectionLabel text="The line of credit" sub="How much, at what rate, over what periods" />
            <NumInput
              label="Amount to draw"
              prefix="$"
              value={drawAmount}
              onChange={setDrawAmount}
              step={5_000}
              min={0}
              max={5_000_000}
              wide
            />
            <RangeSliderCard
              label="Interest rate (APR)"
              hint={`Variable; defaults to current Prime (${AS_OF})`}
              value={annualRatePct}
              min={0}
              max={20}
              step={0.1}
              unit="%"
              onChange={setAnnualRatePct}
            />
            <RangeSliderCard
              label="Draw period"
              hint="Interest-only phase"
              value={drawYears}
              min={1}
              max={15}
              step={1}
              unit=" yr"
              onChange={setDrawYears}
            />
            <RangeSliderCard
              label="Repayment period"
              hint="Fully-amortizing phase"
              value={repayYears}
              min={5}
              max={30}
              step={1}
              unit=" yr"
              onChange={setRepayYears}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Calculate HELOC"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your home value, mortgage, and draw, then click Calculate"
                subMessage="Your available credit line, payments, and the draw-to-repayment payment shock appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Modelling your line of credit"
              />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow="Available credit line"
                primaryValue={r.maxLine}
                primaryFormat={(n) => `$${n.toLocaleString()}`}
                accentColor="#34d399"
                note={{
                  text: `${fmtFull(r.currentEquity)} equity (${r.currentEquityPct}%) · drawing ${fmtFull(r.borrowed)}`,
                  tone: r.exceedsLimit ? "warning" : "positive",
                }}
                subStats={[
                  { label: "Interest-only", value: r.interestOnlyPayment, format: fmt, sub: `/mo · ${drawYears}-yr draw` },
                  { label: "Repayment P&I", value: r.repaymentPayment, format: fmt, sub: `/mo · ${repayYears}-yr` },
                  { label: "Total interest", value: r.totalInterest, format: fmt, sub: "draw + repay" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Your monthly payment over time"
                subtitle="Interest-only during the draw, then a jump when repayment begins"
                data={r.paymentTimeline}
                xFormat={(v) => `yr ${v}`}
                yFormat={(v) => fmt(v)}
                tooltipX={(v) => `Year ${v}`}
                tooltipY={(v) => `${fmtFull(v)}/mo`}
                referenceX={drawYears}
                referenceXLabel="Draw ends"
                color="#34d399"
              />

              <BreakdownBarChart
                title="Payment shock: draw vs repayment"
                data={r.paymentByPhase}
                valueFormat={(v) => `${fmtFull(v)}/mo`}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer text="HELOC rates are variable and tied to the Prime Rate, so payments can rise or fall over time. Lenders set their own CLTV limits, margins, fees, and minimum draws, and qualification depends on credit and income. Figures here are estimates — confirm terms with your lender." />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
