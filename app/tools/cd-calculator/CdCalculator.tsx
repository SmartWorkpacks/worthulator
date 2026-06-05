"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import { calculateCd } from "@/lib/calculators/cdEngine";

const CALC_STEPS = [
  "Locking in your deposit and APY...",
  "Compounding to your maturity date...",
  "Estimating the early-withdrawal penalty...",
  "Building your growth schedule...",
];

const BREAKDOWN_COLOR_HEX: Record<string, string> = {
  "bg-blue-400": "#60a5fa",
  "bg-emerald-400": "#34d399",
};

export default function CdCalculator() {
  const [deposit, setDeposit] = useState(10_000);
  const [apyPct, setApyPct] = useState(4);
  const [termMonths, setTermMonths] = useState(12);
  const [penaltyMonths, setPenaltyMonths] = useState(3);

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculateCd({ deposit, apyPct, termMonths, penaltyMonths });

  const money = (n: number) => `$${Math.round(n).toLocaleString()}`;
  const money2 = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const insights: Insight[] = [
    {
      tone: "positive",
      text: `Your ${money(result.deposit)} grows to ${money(result.maturityValue)} at maturity — ${money(
        result.totalInterest,
      )} of interest, ${result.interestSharePct}% of the final value.`,
    },
    {
      tone: "neutral",
      text: `A ${result.apyPct}% APY is equivalent to about ${result.monthlyRatePct}% compounded each month over the ${result.termMonths}-month term.`,
    },
  ];

  if (penaltyMonths > 0) {
    insights.push({
      tone: "warning",
      text: `Breaking this CD early could forfeit roughly ${money2(result.earlyWithdrawalPenalty)} (${penaltyMonths} months of interest) — confirm the exact penalty with your bank.`,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Deposit" sub="Amount locked into the CD" />
            <NumInput
              label="Initial deposit"
              value={deposit}
              onChange={(v) => { setDeposit(v); pulse(); }}
              min={0}
              max={10_000_000}
              step={500}
              prefix="$"
            />

            <SectionLabel text="Rate" sub="Advertised APY (you can edit this)" />
            <RangeSliderCard
              label="APY"
              hint="The annual percentage yield your bank advertises"
              value={apyPct}
              min={0}
              max={10}
              step={0.05}
              unit="%"
              onChange={(v) => { setApyPct(v); pulse(); }}
            />

            <SectionLabel text="Term" sub="How long the CD is held" />
            <RangeSliderCard
              label="Term"
              hint="Common CD terms run from 3 to 60 months"
              value={termMonths}
              min={1}
              max={120}
              step={1}
              unit=" mo"
              onChange={(v) => { setTermMonths(v); pulse(); }}
            />

            <SectionLabel text="Early withdrawal" sub="Penalty if you break the CD early" />
            <NumInput
              label="Penalty (months of interest)"
              value={penaltyMonths}
              onChange={(v) => { setPenaltyMonths(v); pulse(); }}
              min={0}
              max={Math.max(1, termMonths)}
              step={1}
              suffix="mo"
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
              : "Calculate CD value"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your deposit and APY, then click Calculate"
                subMessage="Your maturity value, interest earned, penalty estimate, and growth curve will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Projecting your CD"
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
                eyebrow={`${result.apyPct}% APY · ${result.termMonths} months`}
                primaryValue={result.maturityValue}
                primaryFormat={(v) => `$${Math.round(v).toLocaleString()}`}
                primaryUnit="at maturity"
                accentColor="#34d399"
                note={{ text: `${money(result.totalInterest)} interest earned`, tone: "positive" }}
                subStats={[
                  { label: "Interest", value: result.totalInterest, format: money, sub: "total earned" },
                  { label: "Deposit", value: result.deposit, format: money, sub: "locked in" },
                  {
                    label: "Early penalty",
                    value: result.earlyWithdrawalPenalty,
                    format: money,
                    sub: `${penaltyMonths} mo of interest`,
                  },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="CD balance over the term"
                subtitle="How your locked deposit grows month by month"
                data={result.schedule.map((p) => ({ x: p.month, y: p.balance }))}
                xFormat={(v) => `${v}mo`}
                yFormat={(v) => `$${Math.round(v / 1000)}k`}
                tooltipX={(v) => `Month ${v}`}
                tooltipY={(v) => money(v)}
                referenceValue={result.deposit}
                referenceLabel="Deposit"
              />

              <BreakdownBarChart
                title="Principal vs interest at maturity"
                data={result.breakdown.map((d) => ({
                  label: d.label,
                  amount: d.amount,
                  pct: result.maturityValue > 0 ? Math.round((d.amount / result.maturityValue) * 100) : 0,
                  fill: BREAKDOWN_COLOR_HEX[d.colorClass],
                }))}
                valueFormat={(v) => money(v)}
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
