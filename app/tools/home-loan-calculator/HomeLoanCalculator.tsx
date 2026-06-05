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
import { calculateHomeLoan } from "@/lib/calculators/homeLoanEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

const RATE_DEFAULT = fredBenchmarks.mortgage30yr;
const AS_OF = fredBenchmarks.currentPeriodLabel;

const CALC_STEPS = [
  "Sizing your loan and down payment...",
  "Amortizing principal & interest...",
  "Projecting equity build-up...",
  "Totalling the true cost...",
];

function fmt(v: number) {
  const a = Math.round(Math.abs(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a.toLocaleString()}`;
}
const fmtFull = (v: number) => `$${Math.round(Math.abs(v)).toLocaleString()}`;

export default function HomeLoanCalculator() {
  const [homePrice, setHomePrice] = useState(400_000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [annualRatePct, setAnnualRatePct] = useState(RATE_DEFAULT);
  const [termYears, setTermYears] = useState(30);
  const [extra, setExtra] = useState(0);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  const r = calculateHomeLoan({ homePrice, downPaymentPct, annualRatePct, termYears, extraMonthlyPayment: extra });

  const insights: Insight[] = [];
  insights.push({
    tone: r.interestPctOfPrice >= 60 ? "warning" : "neutral",
    text: `This ${fmtFull(homePrice)} home actually costs ${fmtFull(r.totalCost)} with this loan — ${fmtFull(r.totalInterest)} of it is interest (${r.interestPctOfPrice}% of the price).`,
  });
  insights.push({
    tone: "neutral",
    text: r.yearsTo50Equity > 0
      ? `It takes about ${r.yearsTo50Equity} years to own half your home (50% equity) — equity builds slowly early because payments are mostly interest.`
      : `You already hold 50%+ equity from your down payment.`,
  });
  if (extra > 0 && r.interestSaved > 0) {
    const y = Math.floor(r.monthsSaved / 12);
    const mo = r.monthsSaved % 12;
    insights.push({
      tone: "positive",
      text: `Paying ${fmtFull(extra)}/mo extra saves ${fmtFull(r.interestSaved)} in interest and you own the home outright ${y > 0 ? `${y} yr ` : ""}${mo} mo sooner.`,
    });
  } else {
    insights.push({
      tone: "neutral",
      text: `Add an extra monthly payment below to build equity faster and cut total interest.`,
    });
  }
  insights.push({
    tone: "neutral",
    text: `Rate defaults to the current US 30-year fixed average of ${RATE_DEFAULT}% (${AS_OF}) — use your quoted rate for an exact figure.`,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="The home" sub="Price and your down payment" />
            <NumInput
              label="Home price"
              prefix="$"
              value={homePrice}
              onChange={setHomePrice}
              step={10_000}
              min={10_000}
              max={10_000_000}
              wide
            />
            <RangeSliderCard
              label="Down payment"
              hint={`${fmtFull(homePrice * (downPaymentPct / 100))} down · ${fmtFull(r.loanAmount)} financed`}
              value={downPaymentPct}
              min={0}
              max={50}
              step={1}
              unit="%"
              onChange={setDownPaymentPct}
            />

            <SectionLabel text="The loan" sub="Rate and term" />
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
              hint="15, 20, or 30 years are most common"
              value={termYears}
              min={5}
              max={40}
              step={1}
              unit=" yr"
              onChange={setTermYears}
            />

            <SectionLabel text="Build equity faster" sub="Optional — extra principal each month" />
            <NumInput
              label="Extra monthly payment"
              prefix="$"
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
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Calculate home loan"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your home price and loan details, then click Calculate"
                subMessage="Your monthly payment, the home's true total cost, and your equity build-up appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Mapping your home loan"
              />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow="Monthly payment (principal + interest)"
                primaryValue={r.monthlyPI}
                primaryFormat={(n) => `$${n.toLocaleString()}`}
                primaryUnit="/mo"
                accentColor="#34d399"
                note={{
                  text: `${fmtFull(r.totalCost)} true total cost · ${fmtFull(r.totalInterest)} interest over ${Math.round(termYears)} years`,
                  tone: r.interestPctOfPrice >= 60 ? "warning" : "positive",
                }}
                subStats={[
                  { label: "True total cost", value: r.totalCost, format: fmt, sub: "price + interest" },
                  { label: "Total interest", value: r.totalInterest, format: fmt, sub: `${r.interestPctOfPrice}% of price` },
                  { label: "Own half by", value: r.yearsTo50Equity, format: (n) => (n > 0 ? `Yr ${Math.round(n)}` : "Day 1"), sub: "50% equity" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Your equity build-up over time"
                subtitle="How much of the home you actually own, year by year (excludes price growth)"
                data={r.equityCurve}
                xFormat={(v) => `yr ${v}`}
                yFormat={(v) => fmt(v)}
                tooltipX={(v) => `Year ${v}`}
                tooltipY={(v) => `${fmtFull(v)} owned`}
                referenceValue={homePrice * 0.5}
                referenceLabel="50% equity"
                color="#34d399"
              />

              <BreakdownBarChart
                title="What the home really costs you"
                data={r.costBreakdown}
                valueFormat={(v) => fmtFull(v)}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer text="Shows principal and interest only; property tax, insurance, PMI, and HOA add to your real monthly payment (see the Mortgage Payment Calculator). Equity assumes a flat home value — actual appreciation would increase it. Confirm figures with your lender." />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
