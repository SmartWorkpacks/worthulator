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
import { calculateAnnuity } from "@/lib/calculators/annuityEngine";

const CALC_STEPS = [
  "Reading your premium...",
  "Crediting interest...",
  "Amortizing your payout...",
  "Building your income stream...",
];

function fmt(v: number) {
  const a = Math.round(Math.abs(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a.toLocaleString()}`;
}
const fmtFull = (v: number) => `$${Math.round(Math.abs(v)).toLocaleString()}`;

export default function AnnuityCalculator() {
  const [principal, setPrincipal] = useState(500_000);
  const [annualRatePct, setAnnualRatePct] = useState(5);
  const [payoutYears, setPayoutYears] = useState(20);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  const r = calculateAnnuity({ principal, annualRatePct, payoutYears });

  const insights: Insight[] = [];
  insights.push({
    tone: "positive",
    text: `A ${fmtFull(principal)} premium at ${annualRatePct}% pays about ${fmtFull(r.monthlyPayout)}/mo — ${fmtFull(r.annualPayout)}/yr — guaranteed for ${payoutYears} years.`,
  });
  insights.push({
    tone: "neutral",
    text: `Over the full term you'd receive ${fmtFull(r.totalPayout)} — that's ${r.payoutMultiple}× your premium, of which ${fmtFull(r.interestEarned)} is interest earned.`,
  });
  insights.push({
    tone: "neutral",
    text: `Stretching the payout to a longer term lowers each check but pays for more years; a shorter term front-loads bigger payments. The chart shows the trade-off.`,
  });
  insights.push({
    tone: "warning",
    text: `This models a fixed period-certain annuity. Real annuities vary widely — lifetime vs period-certain, fixed vs variable, plus fees and surrender charges. Compare quotes carefully.`,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Your annuity" sub="A lump sum that pays you a fixed income" />
            <NumInput label="Premium (lump sum)" prefix="$" value={principal} onChange={setPrincipal} step={10_000} min={0} max={100_000_000} wide />
            <NumInput label="Crediting rate" suffix="%" hint="The annual rate the annuity earns" value={annualRatePct} onChange={setAnnualRatePct} step={0.1} min={0} max={20} wide />

            <SectionLabel text="Payout period" sub="How many years it pays you (period certain)" />
            <RangeSliderCard label="Payout length" value={payoutYears} min={1} max={40} step={1} unit=" yr" onChange={setPayoutYears} />
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Calculate my payout"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your premium, crediting rate, and payout length"
                subMessage="Your guaranteed monthly income and total payout appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader steps={CALC_STEPS} step={calcStep} progress={calcProgress} subtitle="Calculating your annuity income" />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow="Guaranteed monthly income"
                primaryValue={r.monthlyPayout}
                primaryFormat={(n) => `$${n.toLocaleString()}`}
                primaryUnit="/mo"
                accentColor="#a78bfa"
                note={{
                  text: `${fmtFull(r.annualPayout)}/yr for ${payoutYears} years · ${r.payoutMultiple}× your premium in total`,
                  tone: "positive",
                }}
                subStats={[
                  { label: "Annual income", value: r.annualPayout, format: fmt },
                  { label: "Total payout", value: r.totalPayout, format: fmt },
                  { label: "Interest earned", value: r.interestEarned, format: fmt },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Monthly income by payout length"
                subtitle="A shorter period pays more each month; a longer one pays for more years"
                data={r.payoutByTerm}
                xFormat={(v) => `${v}y`}
                yFormat={(v) => fmt(v)}
                tooltipX={(v) => `${v}-year payout`}
                tooltipY={(v) => `${fmtFull(v)}/mo`}
                referenceX={payoutYears}
                referenceXLabel="Your term"
                color="#a78bfa"
              />

              <BreakdownBarChart
                title="What you get back"
                data={r.breakdown}
                valueFormat={(v) => fmtFull(v)}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer text="Illustrative estimate for a fixed, period-certain annuity. Actual annuity payouts depend on the product type (immediate, deferred, fixed, variable, indexed), your age, interest rates at purchase, riders, and fees. Lifetime annuities use mortality-based pricing not modelled here. Not financial advice — get personalized quotes." />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
