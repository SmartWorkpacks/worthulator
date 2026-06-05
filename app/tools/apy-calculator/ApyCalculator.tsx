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
import { calculateApy, type CompoundingFrequency } from "@/lib/calculators/apyEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

const CALC_STEPS = [
  "Reading your stated rate...",
  "Applying the compounding formula...",
  "Computing your effective yield...",
  "Projecting your balance...",
];

// High-yield savings tracks the fed funds rate closely — use it as a live default.
const DEFAULT_RATE = fredBenchmarks.fedFundsRate;

const FREQS: { id: CompoundingFrequency; label: string }[] = [
  { id: "annually", label: "Annually" },
  { id: "quarterly", label: "Quarterly" },
  { id: "monthly", label: "Monthly" },
  { id: "daily", label: "Daily" },
];

function fmt(v: number) {
  const a = Math.round(Math.abs(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a.toLocaleString()}`;
}
const fmtFull = (v: number) => `$${Math.round(Math.abs(v)).toLocaleString()}`;

export default function ApyCalculator() {
  const [principal, setPrincipal] = useState(10_000);
  const [nominalRatePct, setNominalRatePct] = useState(DEFAULT_RATE);
  const [compounding, setCompounding] = useState<CompoundingFrequency>("daily");
  const [termYears, setTermYears] = useState(5);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  const r = calculateApy({ principal, nominalRatePct, compounding, termYears });

  const insights: Insight[] = [];
  insights.push({
    tone: "positive",
    text: `Your ${nominalRatePct}% stated rate compounds to a ${r.apyPct}% APY — that's ${r.compoundingBonusPct > 0 ? `+${r.compoundingBonusPct.toFixed(3)} pts of free yield` : "the same"} from compounding ${compounding}.`,
  });
  insights.push({
    tone: "neutral",
    text: `On ${fmtFull(principal)}, that's about ${fmtFull(r.firstYearInterest)} earned in the first year.`,
  });
  insights.push({
    tone: "neutral",
    text: `Left for ${termYears} years, your balance grows to ${fmtFull(r.balanceAfterTerm)} — ${fmtFull(r.interestEarned)} of interest on top of your deposit.`,
  });
  insights.push({
    tone: "neutral",
    text: `Always compare accounts by APY, not the stated rate: APY already bakes in how often interest compounds, so it's the true apples-to-apples number.`,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Your deposit" sub="What you're putting in and the stated rate" />
            <NumInput label="Deposit amount" prefix="$" value={principal} onChange={setPrincipal} step={1_000} min={0} max={100_000_000} wide />
            <NumInput
              label="Stated interest rate"
              suffix="%"
              hint={`Default is the live federal funds rate, which high-yield savings tracks (${fredBenchmarks.currentPeriodLabel})`}
              value={nominalRatePct}
              onChange={setNominalRatePct}
              step={0.1}
              min={0}
              max={30}
              wide
            />

            <SectionLabel text="Compounding" sub="How often interest is added to your balance" />
            <div className="grid grid-cols-2 gap-2">
              {FREQS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCompounding(f.id)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                    compounding === f.id
                      ? "border-gray-950 bg-gray-950 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <SectionLabel text="Time horizon" />
            <RangeSliderCard
              label="Years invested"
              value={termYears}
              min={1}
              max={40}
              step={1}
              unit=" yr"
              onChange={setTermYears}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Calculate my APY"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your deposit, stated rate, and compounding frequency"
                subMessage="Your true effective yield (APY) and balance growth appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader steps={CALC_STEPS} step={calcStep} progress={calcProgress} subtitle="Computing your effective yield" />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow="Effective annual yield (APY)"
                primaryValue={r.apyPct}
                primaryFormat={(n) => `${n.toFixed(3)}`}
                primaryUnit="% APY"
                accentColor="#34d399"
                note={{
                  text: `${nominalRatePct}% stated rate, compounded ${compounding} → +${r.compoundingBonusPct.toFixed(3)} pts from compounding`,
                  tone: "positive",
                }}
                subStats={[
                  { label: "1st-year interest", value: r.firstYearInterest, format: fmt },
                  { label: `Balance after ${termYears}y`, value: r.balanceAfterTerm, format: fmt },
                  { label: "Total interest", value: r.interestEarned, format: fmt },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="How your balance grows"
                subtitle={`${fmtFull(principal)} at ${r.apyPct}% APY, compounded ${compounding}`}
                data={r.balanceCurve}
                xFormat={(v) => `${v}y`}
                yFormat={(v) => fmt(v)}
                tooltipX={(v) => `Year ${v}`}
                tooltipY={(v) => fmtFull(v)}
                color="#34d399"
              />

              <BreakdownBarChart
                title="APY by compounding frequency"
                data={r.apyByFrequency.map((f) => ({ label: f.label, amount: f.amount }))}
                valueFormat={(v) => `${v.toFixed(3)}%`}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer text="Estimates assume a fixed rate and no withdrawals, deposits, or taxes. Real savings and CD rates change over time, and interest is generally taxable. APY is the standardized figure US banks must disclose (Truth in Savings Act) so you can compare accounts fairly." />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
