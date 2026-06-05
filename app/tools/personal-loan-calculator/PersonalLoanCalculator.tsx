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
import { calculatePersonalLoan } from "@/lib/calculators/personalLoanEngine";

const CALC_STEPS = [
  "Amortizing your loan at the chosen APR...",
  "Totalling the interest over the term...",
  "Folding in the origination fee...",
  "Solving the true cost of borrowing...",
];

const BREAKDOWN_COLOR_HEX: Record<string, string> = {
  "bg-blue-400": "#60a5fa",
  "bg-rose-400": "#fb7185",
  "bg-amber-400": "#fbbf24",
};

export default function PersonalLoanCalculator({
  defaultAprPct,
  rateAsOf,
}: {
  defaultAprPct: number;
  rateAsOf: string;
}) {
  const [loanAmount, setLoanAmount] = useState(15_000);
  const [aprPct, setAprPct] = useState(defaultAprPct);
  const [termMonths, setTermMonths] = useState(36);
  const [originationFeePct, setOriginationFeePct] = useState(0);

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculatePersonalLoan({ loanAmount, aprPct, termMonths, originationFeePct });

  const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const insights: Insight[] = [
    {
      tone: "positive",
      text: `A ${money(loanAmount)} loan at ${result.aprPct}% over ${termMonths} months costs ${money(result.monthlyPayment)}/mo — ${money(result.totalInterest)} of interest on top of the principal.`,
    },
    {
      tone: "neutral",
      text: `You repay ${money(result.totalRepaid)} in total, or about ${result.loanAmount > 0 ? Math.round((result.totalInterest / result.loanAmount) * 100) : 0}% more than you borrowed.`,
    },
  ];

  if (originationFeePct > 0) {
    insights.push({
      tone: "warning",
      text: `The ${result.originationFeePct}% origination fee (${money(result.originationFee)}) means you receive ${money(result.netDisbursed)} but repay on the full ${money(loanAmount)} — lifting the true cost to ${result.effectiveAprPct}% APR.`,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Loan" sub="What you want to borrow" />
            <NumInput
              label="Loan amount"
              value={loanAmount}
              onChange={(v) => { setLoanAmount(v); pulse(); }}
              min={0}
              max={1_000_000}
              step={500}
              prefix="$"
            />

            <SectionLabel text="Rate & term" sub="Today's bank rate, your payoff window" />
            <RangeSliderCard
              label="APR"
              hint={`24-mo personal-loan default ${defaultAprPct}% — commercial banks, FRED, as of ${rateAsOf}`}
              value={aprPct}
              min={0}
              max={36}
              step={0.1}
              unit="%"
              onChange={(v) => { setAprPct(v); pulse(); }}
            />
            <RangeSliderCard
              label="Loan term"
              hint="Personal loans usually run 12 to 60 months"
              value={termMonths}
              min={6}
              max={84}
              step={1}
              unit=" mo"
              onChange={(v) => { setTermMonths(v); pulse(); }}
            />

            <SectionLabel text="Fees" sub="Many lenders deduct this up front" />
            <RangeSliderCard
              label="Origination fee"
              hint="Common on personal loans — typically 1% to 8%"
              value={originationFeePct}
              min={0}
              max={10}
              step={0.25}
              unit="%"
              onChange={(v) => { setOriginationFeePct(v); pulse(); }}
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
              : "Calculate loan payment"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your loan amount, rate, and term, then click Calculate"
                subMessage="Your monthly payment, total interest, true APR with fees, and an amortization curve will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Pricing your loan"
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
                eyebrow={`${result.aprPct}% APR · ${termMonths} months`}
                primaryValue={result.monthlyPayment}
                primaryFormat={(v) => `$${Math.round(v).toLocaleString()}`}
                primaryUnit="per month"
                accentColor="#60a5fa"
                note={{
                  text:
                    originationFeePct > 0
                      ? `${result.effectiveAprPct}% true APR with the fee`
                      : `${money(result.totalInterest)} total interest`,
                  tone: originationFeePct > 0 ? "warning" : "positive",
                }}
                subStats={[
                  { label: "Total interest", value: result.totalInterest, format: money, sub: "over the term" },
                  { label: "Total repaid", value: result.totalRepaid, format: money, sub: "principal + interest" },
                  { label: "True APR", value: result.effectiveAprPct, format: (v) => `${v.toFixed(2)}%`, sub: "fee included" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Loan balance over the term"
                subtitle="How your payments pay down the principal"
                data={result.schedule.map((p) => ({ x: p.month, y: p.balance }))}
                xFormat={(v) => `${v}mo`}
                yFormat={(v) => `$${Math.round(v / 1000)}k`}
                tooltipX={(v) => `Month ${v}`}
                tooltipY={(v) => money(v)}
                referenceValue={result.loanAmount}
                referenceLabel="Borrowed"
              />

              <BreakdownBarChart
                title="What the loan costs you"
                data={result.breakdown.map((d) => ({
                  label: d.label,
                  amount: d.amount,
                  pct:
                    result.loanAmount + result.totalInterest + result.originationFee > 0
                      ? Math.round(
                          (d.amount / (result.loanAmount + result.totalInterest + result.originationFee)) * 100,
                        )
                      : 0,
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
