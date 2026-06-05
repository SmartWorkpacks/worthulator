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
import { calculateRentAffordability } from "@/lib/calculators/rentAffordabilityEngine";

const CALC_STEPS = [
  "Reading your income...",
  "Applying the 30% rule...",
  "Checking your debt load...",
  "Setting your rent range...",
];

function fmt(v: number) {
  const a = Math.round(Math.abs(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a.toLocaleString()}`;
}
const fmtFull = (v: number) => `$${Math.round(Math.abs(v)).toLocaleString()}`;

export default function RentCalculator() {
  const [grossAnnualIncome, setGrossAnnualIncome] = useState(72_000);
  const [monthlyDebt, setMonthlyDebt] = useState(0);
  const [targetRentPct, setTargetRentPct] = useState(30);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  const r = calculateRentAffordability({ grossAnnualIncome, monthlyDebt, targetRentPct });

  const cappedByDebt = monthlyDebt > 0 && r.recommendedRent < r.grossMonthly * (targetRentPct / 100) - 0.5;

  const insights: Insight[] = [];
  insights.push({
    tone: "positive",
    text: `On ${fmtFull(grossAnnualIncome)}/yr (${fmtFull(r.grossMonthly)}/mo), a comfortable rent is around ${fmtFull(r.recommendedRent)}/mo — about ${r.rentToIncomePct}% of your gross income.`,
  });
  if (cappedByDebt) {
    insights.push({
      tone: "warning",
      text: `Your ${fmtFull(monthlyDebt)}/mo of other debt pulls your safe ceiling down to ${fmtFull(r.debtAdjustedMax)}/mo (keeping rent + debts under 36% of income), below the usual ${targetRentPct}% target.`,
    });
  } else {
    insights.push({
      tone: "neutral",
      text: `Keeping rent plus debts under 36% of income, your ceiling is ${fmtFull(r.debtAdjustedMax)}/mo. You have room before you're overextended.`,
    });
  }
  insights.push({
    tone: "neutral",
    text: `Most landlords want income of at least 3× the rent — roughly ${fmtFull(r.incomeNeededForRecommended)}/yr for a ${fmtFull(r.recommendedRent)} place, which you meet.`,
  });
  insights.push({
    tone: "neutral",
    text: `Tight budget? Aim near ${fmtFull(r.conservativeRent)} (25%). Higher cost-of-living city? Up to ${fmtFull(r.stretchRent)} (35%) can work if your other expenses are low.`,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Your income" sub="Use gross (pre-tax) annual income" />
            <NumInput label="Gross annual income" prefix="$" value={grossAnnualIncome} onChange={setGrossAnnualIncome} step={2_000} min={0} max={5_000_000} wide />

            <SectionLabel text="Your debts" sub="Monthly minimums on loans, cards, car, etc." />
            <NumInput label="Monthly debt payments" prefix="$" value={monthlyDebt} onChange={setMonthlyDebt} step={50} min={0} max={50_000} wide />

            <SectionLabel text="Your target" sub="Share of gross income you'll spend on rent" />
            <RangeSliderCard
              label="Rent-to-income target"
              hint="30% is the classic rule of thumb"
              value={targetRentPct}
              min={15}
              max={50}
              step={1}
              unit="%"
              onChange={setTargetRentPct}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Calculate my rent budget"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your income and any monthly debts"
                subMessage="Your recommended rent budget and a safe range appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader steps={CALC_STEPS} step={calcStep} progress={calcProgress} subtitle="Sizing your rent budget" />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow="Recommended monthly rent"
                primaryValue={r.recommendedRent}
                primaryFormat={(n) => `$${n.toLocaleString()}`}
                primaryUnit="/mo"
                accentColor="#60a5fa"
                note={{
                  text: cappedByDebt
                    ? `Capped by your debts at ${r.rentToIncomePct}% of income (debt-adjusted ceiling)`
                    : `About ${r.rentToIncomePct}% of your ${fmtFull(r.grossMonthly)}/mo gross income`,
                  tone: cappedByDebt ? "warning" : "positive",
                }}
                subStats={[
                  { label: "Conservative (25%)", value: r.conservativeRent, format: fmt, sub: "/mo" },
                  { label: "Comfortable (30%)", value: r.comfortableRent, format: fmt, sub: "/mo" },
                  { label: "Stretch (35%)", value: r.stretchRent, format: fmt, sub: "/mo" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Affordable rent by income"
                subtitle={`Max rent at your ${targetRentPct}% target across income levels`}
                data={r.affordabilityByIncome}
                xFormat={(v) => fmt(v)}
                yFormat={(v) => fmt(v)}
                tooltipX={(v) => `${fmtFull(v)}/yr income`}
                tooltipY={(v) => `${fmtFull(v)}/mo rent`}
                referenceX={grossAnnualIncome}
                referenceXLabel="You"
                color="#60a5fa"
              />

              <BreakdownBarChart
                title="Your rent range"
                data={[
                  { label: "Conservative", amount: r.conservativeRent },
                  { label: "Comfortable", amount: r.comfortableRent },
                  { label: "Stretch", amount: r.stretchRent },
                ]}
                valueFormat={(v) => `${fmtFull(v)}/mo`}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer text="Guidelines, not hard limits. Rent affordability also depends on your other expenses, savings goals, location, and lifestyle. The 30% rule and 36% debt ceiling are common benchmarks lenders and landlords use, but your right number may be higher or lower." />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
