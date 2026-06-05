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
import { calculateHouseAffordability } from "@/lib/calculators/houseAffordabilityEngine";

const CALC_STEPS = [
  "Checking your income against lender ratios...",
  "Subtracting your existing monthly debts...",
  "Backing out the loan today's rate supports...",
  "Adding taxes, insurance, and your down payment...",
];

const BREAKDOWN_COLOR_HEX: Record<string, string> = {
  "bg-blue-400": "#60a5fa",
  "bg-amber-400": "#fbbf24",
  "bg-violet-400": "#a78bfa",
  "bg-emerald-400": "#34d399",
};

export default function HouseAffordabilityCalculator({
  defaultRatePct,
  rateAsOf,
}: {
  defaultRatePct: number;
  rateAsOf: string;
}) {
  const [annualIncome, setAnnualIncome] = useState(90_000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(40_000);
  const [mortgageRatePct, setMortgageRatePct] = useState(defaultRatePct);
  const [termYears, setTermYears] = useState(30);
  const [propertyTaxRatePct, setPropertyTaxRatePct] = useState(1.1);
  const [insuranceAnnual, setInsuranceAnnual] = useState(1_800);
  const [hoaMonthly, setHoaMonthly] = useState(0);

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculateHouseAffordability({
    annualIncome,
    monthlyDebts,
    downPayment,
    mortgageRatePct,
    termYears,
    propertyTaxRatePct,
    insuranceAnnual,
    hoaMonthly,
    frontDtiPct: 28,
    backDtiPct: 36,
  });

  const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const constraintText =
    result.bindingConstraint === "front"
      ? `Your budget is capped by the 28% housing-to-income ratio (${money(result.frontCap)}/mo). You have about ${money(result.backCap - result.frontCap)}/mo of headroom on the total-debt ratio.`
      : `Your existing debts make the 36% total-debt ratio the binding limit (${money(result.maxHousingBudget)}/mo) — below the ${money(result.frontCap)}/mo the housing ratio alone would allow.`;

  const insights: Insight[] = [
    {
      tone: "positive",
      text: `On ${money(annualIncome)} of income with ${money(downPayment)} down, you can target a home up to about ${money(result.maxHomePrice)} — a ${money(result.loanAmount)} loan at ${result.mortgageRatePct}%.`,
    },
    { tone: "neutral", text: constraintText },
    {
      tone: "neutral",
      text: `Principal & interest is ${money(result.principalInterest)} of the ${money(result.monthlyPayment)} monthly payment; taxes, insurance${hoaMonthly > 0 ? ", and HOA" : ""} make up the rest.`,
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Income & debts" sub="What lenders weigh first" />
            <NumInput
              label="Annual income (gross)"
              value={annualIncome}
              onChange={(v) => { setAnnualIncome(v); pulse(); }}
              min={0}
              max={5_000_000}
              step={1_000}
              prefix="$"
            />
            <NumInput
              label="Monthly debt payments"
              value={monthlyDebts}
              onChange={(v) => { setMonthlyDebts(v); pulse(); }}
              min={0}
              max={50_000}
              step={50}
              prefix="$"
            />

            <SectionLabel text="Cash & loan" sub="Your down payment and the rate" />
            <NumInput
              label="Down payment"
              value={downPayment}
              onChange={(v) => { setDownPayment(v); pulse(); }}
              min={0}
              max={5_000_000}
              step={1_000}
              prefix="$"
            />
            <RangeSliderCard
              label="Mortgage rate"
              hint={`30-yr fixed default ${defaultRatePct}% — Freddie Mac, as of ${rateAsOf}`}
              value={mortgageRatePct}
              min={0}
              max={15}
              step={0.05}
              unit="%"
              onChange={(v) => { setMortgageRatePct(v); pulse(); }}
            />
            <RangeSliderCard
              label="Loan term"
              hint="Most buyers use a 30-year mortgage"
              value={termYears}
              min={10}
              max={40}
              step={1}
              unit=" yr"
              onChange={(v) => { setTermYears(v); pulse(); }}
            />

            <SectionLabel text="Ownership costs" sub="Folded into the monthly budget" />
            <RangeSliderCard
              label="Property tax rate"
              hint="Annual property tax as a share of home value"
              value={propertyTaxRatePct}
              min={0}
              max={4}
              step={0.05}
              unit="%"
              onChange={(v) => { setPropertyTaxRatePct(v); pulse(); }}
            />
            <NumInput
              label="Home insurance (per year)"
              value={insuranceAnnual}
              onChange={(v) => { setInsuranceAnnual(v); pulse(); }}
              min={0}
              max={50_000}
              step={100}
              prefix="$"
            />
            <NumInput
              label="HOA dues (per month)"
              value={hoaMonthly}
              onChange={(v) => { setHoaMonthly(v); pulse(); }}
              min={0}
              max={5_000}
              step={25}
              prefix="$"
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
              : "See how much I can afford"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your income, debts, and down payment, then click Calculate"
                subMessage="Your maximum home price, loan amount, monthly payment breakdown, and a rate-sensitivity curve will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Sizing your budget"
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
                eyebrow={`${result.mortgageRatePct}% rate · ${termYears}-yr loan`}
                primaryValue={result.maxHomePrice}
                primaryFormat={(v) => `$${Math.round(v).toLocaleString()}`}
                primaryUnit="max home price"
                accentColor="#3b82f6"
                note={{
                  text: `${result.bindingConstraint === "front" ? "Capped by the 28% housing ratio" : "Capped by the 36% debt ratio"}`,
                  tone: result.bindingConstraint === "front" ? "positive" : "warning",
                }}
                subStats={[
                  { label: "Loan amount", value: result.loanAmount, format: money, sub: "after down payment" },
                  { label: "Monthly payment", value: result.monthlyPayment, format: money, sub: "PITI + HOA" },
                  { label: "Down payment", value: result.downPayment, format: money, sub: "cash in" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Buying power vs mortgage rate"
                subtitle="How your maximum home price moves as the rate changes"
                data={result.rateImpact.map((p) => ({ x: p.ratePct, y: p.maxHomePrice }))}
                xFormat={(v) => `${v}%`}
                yFormat={(v) => `$${Math.round(v / 1000)}k`}
                tooltipX={(v) => `${v}% rate`}
                tooltipY={(v) => money(v)}
                referenceValue={result.maxHomePrice}
                referenceLabel="Your rate"
              />

              <BreakdownBarChart
                title="Monthly payment breakdown"
                data={result.breakdown.map((d) => ({
                  label: d.label,
                  amount: d.amount,
                  pct: result.monthlyPayment > 0 ? Math.round((d.amount / result.monthlyPayment) * 100) : 0,
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
