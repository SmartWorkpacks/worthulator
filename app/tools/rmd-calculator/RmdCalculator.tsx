"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import { calculateRmd } from "@/lib/calculators/rmdEngine";

const CALC_STEPS = [
  "Looking up your IRS life-expectancy factor...",
  "Dividing your balance by the factor...",
  "Working out the monthly equivalent...",
  "Projecting your RMDs over the next decade...",
];

const BREAKDOWN_COLOR_HEX: Record<string, string> = {
  "bg-rose-400": "#fb7185",
  "bg-emerald-400": "#34d399",
};

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export default function RmdCalculator() {
  const [accountBalance, setAccountBalance] = useState(500_000);
  const [age, setAge] = useState(73);
  const [expectedReturnPct, setExpectedReturnPct] = useState(5);

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculateRmd({ accountBalance, age, expectedReturnPct });

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const insights: Insight[] = [
    {
      tone: result.isRequiredAge ? "warning" : "neutral",
      text: result.isRequiredAge
        ? `At age ${result.age} you must withdraw at least ${money(result.rmdAmount)} this year — about ${money(result.monthlyEquivalent)}/month if you spread it out.`
        : `RMDs don't begin until age 73, so at ${result.age} this ${money(result.rmdAmount)} is an estimate, not yet required.`,
    },
    {
      tone: "neutral",
      text: `Your IRS Uniform Lifetime factor is ${result.distributionPeriod}, so you withdraw 1 ÷ ${result.distributionPeriod} = ${result.rmdPct}% of your balance this year.`,
    },
    {
      tone: "neutral",
      text: `After the RMD, ${money(result.remainingBalance)} stays invested. As you age the factor shrinks, so the required percentage rises each year.`,
    },
    {
      tone: "warning",
      text: `Miss an RMD and the IRS excise tax is 25% of the shortfall (10% if corrected promptly). The deadline is December 31 each year.`,
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Your account" sub="Prior year-end (Dec 31) balance" />
            <NumInput
              label="Retirement account balance"
              value={accountBalance}
              onChange={(v) => { setAccountBalance(v); pulse(); }}
              min={0}
              max={100_000_000}
              step={1_000}
              prefix="$"
            />

            <SectionLabel text="Your age" sub="Age you reach this calendar year" />
            <NumInput
              label="Age"
              value={age}
              onChange={(v) => { setAge(v); pulse(); }}
              min={72}
              max={120}
              step={1}
            />

            <SectionLabel text="Projection" sub="Assumed growth for future years" />
            <NumInput
              label="Expected annual return"
              value={expectedReturnPct}
              onChange={(v) => { setExpectedReturnPct(v); pulse(); }}
              min={-20}
              max={20}
              step={0.5}
              suffix="%"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing"
            ? "Calculating..."
            : revealState === "revealed"
              ? "Recalculate"
              : "Calculate my RMD"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your balance and age, then click Calculate"
                subMessage="Your required minimum distribution, life-expectancy factor, monthly equivalent, and a 10-year projection will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Calculating your distribution"
              />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              <ResultHeroCard
                eyebrow={`Age ${result.age} · ${result.isRequiredAge ? "required this year" : "not yet required"}`}
                primaryValue={result.rmdAmount}
                primaryFormat={(v) => `$${Math.round(v).toLocaleString()}`}
                primaryUnit="this year"
                accentColor="#f43f5e"
                note={{
                  text: `Factor ${result.distributionPeriod} · ${result.rmdPct}% of balance`,
                  tone: result.isRequiredAge ? "warning" : "positive",
                }}
                subStats={[
                  { label: "Monthly", value: result.monthlyEquivalent, format: money, sub: "if spread evenly" },
                  { label: "Stays invested", value: result.remainingBalance, format: money, sub: "after the RMD" },
                  { label: "Withdrawal rate", value: result.rmdPct, format: (v) => `${v.toFixed(2)}%`, sub: "of balance" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <BreakdownBarChart
                title="This year's balance"
                data={result.breakdown.map((d) => ({
                  label: d.label,
                  amount: d.amount,
                  pct: accountBalance > 0 ? Math.round((d.amount / accountBalance) * 100) : 0,
                  fill: BREAKDOWN_COLOR_HEX[d.colorClass],
                }))}
                valueFormat={money}
              />

              <ImpactLineChart
                title="Projected RMDs by age"
                subtitle={`Assuming ${expectedReturnPct}% annual growth on the balance that stays invested`}
                data={result.projection.map((p) => ({ x: p.age, y: p.rmd }))}
                xFormat={(v) => `${v}`}
                yFormat={(v) => `$${Math.round(v).toLocaleString()}`}
                tooltipX={(v) => `Age ${v}`}
                tooltipY={money}
                referenceValue={result.rmdAmount}
                referenceLabel="This year"
              />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.45 }}
              >
                <CalcDisclaimer />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
