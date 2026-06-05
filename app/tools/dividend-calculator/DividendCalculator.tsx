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
import { calculateDividend } from "@/lib/calculators/dividendEngine";

const CALC_STEPS = [
  "Reading your yield...",
  "Growing the dividend...",
  "Projecting your income...",
  "Measuring yield on cost...",
];

function fmt(v: number) {
  const a = Math.round(Math.abs(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a.toLocaleString()}`;
}
const fmtFull = (v: number) => `$${Math.round(Math.abs(v)).toLocaleString()}`;

export default function DividendCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState(100_000);
  const [dividendYieldPct, setDividendYieldPct] = useState(3.5);
  const [dividendGrowthPct, setDividendGrowthPct] = useState(6);
  const [priceGrowthPct, setPriceGrowthPct] = useState(4);
  const [years, setYears] = useState(20);
  const [reinvest, setReinvest] = useState(true);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  const r = calculateDividend({ investmentAmount, dividendYieldPct, dividendGrowthPct, priceGrowthPct, years, reinvest });

  const insights: Insight[] = [];
  insights.push({
    tone: "positive",
    text: `Right now this pays about ${fmtFull(r.annualIncomeYear1)}/yr — roughly ${fmtFull(r.monthlyIncomeYear1)}/mo in dividend income.`,
  });
  insights.push({
    tone: "positive",
    text: `After ${years} years of ${dividendGrowthPct}% annual dividend hikes${reinvest ? " plus reinvestment" : ""}, your income grows to ${fmtFull(r.finalAnnualIncome)}/yr — a ${r.yieldOnCostPct}% yield on your original cost.`,
  });
  insights.push({
    tone: "neutral",
    text: `Over the period you collect ${fmtFull(r.totalDividends)} in dividends${reinvest ? ", all reinvested into more shares" : " as cash"}.`,
  });
  insights.push({
    tone: reinvest ? "positive" : "neutral",
    text: reinvest
      ? `Reinvesting compounds your share count — each new share pays its own future dividends, the "dividend snowball."`
      : `Taking dividends as cash gives you income today but skips the compounding boost. Toggle reinvest to compare.`,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Your investment" sub="Amount and the current dividend yield" />
            <NumInput label="Investment amount" prefix="$" value={investmentAmount} onChange={setInvestmentAmount} step={5_000} min={0} max={100_000_000} wide />
            <NumInput label="Dividend yield" suffix="%" hint="Annual cash payout ÷ share price (e.g. SCHD ~3.5%)" value={dividendYieldPct} onChange={setDividendYieldPct} step={0.1} min={0} max={20} wide />

            <SectionLabel text="Growth assumptions" sub="How the payout and share price grow each year" />
            <NumInput label="Dividend growth rate" suffix="%/yr" hint="How fast the company raises its dividend" value={dividendGrowthPct} onChange={setDividendGrowthPct} step={0.5} min={0} max={30} wide />
            <NumInput label="Share price growth" suffix="%/yr" value={priceGrowthPct} onChange={setPriceGrowthPct} step={0.5} min={0} max={30} wide />

            <SectionLabel text="Horizon" />
            <RangeSliderCard label="Years held" value={years} min={1} max={40} step={1} unit=" yr" onChange={setYears} />

            <button
              type="button"
              onClick={() => setReinvest((v) => !v)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                reinvest ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              <span>Reinvest dividends (DRIP)</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs ${reinvest ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                {reinvest ? "ON" : "OFF"}
              </span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Project my dividends"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your investment, yield, and growth assumptions"
                subMessage="Your dividend income, yield on cost, and income growth appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader steps={CALC_STEPS} step={calcStep} progress={calcProgress} subtitle="Projecting your dividend income" />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow={`Annual dividend income after ${years} years`}
                primaryValue={r.finalAnnualIncome}
                primaryFormat={(n) => `$${n.toLocaleString()}`}
                primaryUnit="/yr"
                accentColor="#34d399"
                note={{
                  text: `${r.yieldOnCostPct}% yield on cost · ${fmtFull(Math.round(r.finalAnnualIncome / 12))}/mo · started at ${fmtFull(r.annualIncomeYear1)}/yr`,
                  tone: "positive",
                }}
                subStats={[
                  { label: "Income year 1", value: r.annualIncomeYear1, format: fmt, sub: "/yr" },
                  { label: "Total dividends", value: r.totalDividends, format: fmt },
                  { label: "Final value", value: r.finalValue, format: fmt },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Your annual dividend income, year by year"
                subtitle={reinvest ? "Reinvestment + dividend hikes compound the income" : "Dividend hikes grow the payout each year"}
                data={r.incomeByYear}
                xFormat={(v) => `${v}y`}
                yFormat={(v) => fmt(v)}
                tooltipX={(v) => `Year ${v}`}
                tooltipY={(v) => `${fmtFull(v)}/yr`}
                color="#34d399"
              />

              <BreakdownBarChart
                title="Where your total return comes from"
                data={r.returnBreakdown}
                valueFormat={(v) => fmtFull(v)}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer text="Projections assume your yield, dividend growth, and price growth hold steady — real markets vary, dividends can be cut, and figures ignore taxes and fees. Past performance doesn't guarantee future results. Not investment advice." />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
