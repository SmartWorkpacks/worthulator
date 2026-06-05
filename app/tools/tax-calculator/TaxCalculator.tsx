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
import { calculateTax, type TaxCountry, type TaxFilingStatus } from "@/lib/calculators/taxEngine";
import { stateTaxRates, stateNames, type StateCode } from "@/src/lib/stateTax";

const CALC_STEPS = [
  "Applying your deduction and brackets...",
  "Adding payroll tax...",
  "Layering in any state income tax...",
  "Totalling your effective rate...",
];

const BREAKDOWN_COLOR_HEX: Record<string, string> = {
  "bg-blue-400": "#60a5fa",
  "bg-amber-400": "#fbbf24",
  "bg-rose-400": "#fb7185",
};

const STATE_CODES = Object.keys(stateTaxRates) as StateCode[];

export default function TaxCalculator({ taxYear }: { taxYear: string }) {
  const [country, setCountry] = useState<TaxCountry>("US");
  const [annualIncome, setAnnualIncome] = useState(75_000);
  const [filingStatus, setFilingStatus] = useState<TaxFilingStatus>("single");
  const [stateCode, setStateCode] = useState<StateCode>("TX");

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const stateRatePct = country === "US" ? stateTaxRates[stateCode] : 0;
  const result = calculateTax({ country, annualIncome, filingStatus, stateRatePct });

  const isUK = country === "UK";
  const sym = isUK ? "£" : "$";
  const money = (n: number) => `${sym}${Math.round(n).toLocaleString()}`;
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const insights: Insight[] = [
    {
      tone: "warning",
      text: `On ${money(result.grossIncome)} you owe about ${money(result.totalTax)} in tax — an effective rate of ${pct(result.effectiveTaxRate)}, leaving ${money(result.afterTaxIncome)} after tax.`,
    },
    {
      tone: "neutral",
      text: `Your top bracket is ${pct(result.marginalRate)}, but your effective income-tax rate is only ${pct(result.incomeTaxEffectiveRate)} — the difference is how marginal brackets work.`,
    },
    isUK
      ? {
          tone: "neutral",
          text: `National Insurance adds ${money(result.nationalInsurance)} on top of ${money(result.incomeTax)} of income tax.`,
        }
      : {
          tone: "neutral",
          text: `Payroll tax (Social Security + Medicare) is ${money(result.socialSecurity + result.medicare)}${result.stateTax > 0 ? `, and ${stateNames[stateCode]} adds ${money(result.stateTax)} of state income tax` : ""}.`,
        },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <div>
              <SectionLabel text="Country" sub="US federal + state, or UK" />
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
                {(["US", "UK"] as TaxCountry[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setCountry(c); pulse(); }}
                    className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${
                      country === c ? "bg-white text-gray-950 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {c === "US" ? "🇺🇸 United States" : "🇬🇧 United Kingdom"}
                  </button>
                ))}
              </div>
            </div>

            <SectionLabel text="Income" sub={`Gross income · ${taxYear} tax year`} />
            <NumInput
              label="Annual income (gross)"
              value={annualIncome}
              onChange={(v) => { setAnnualIncome(v); pulse(); }}
              min={0}
              max={10_000_000}
              step={1_000}
              prefix={sym}
            />

            {!isUK && (
              <>
                <div>
                  <SectionLabel text="Filing status" sub="Selects brackets + standard deduction" />
                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
                    {(["single", "married"] as TaxFilingStatus[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => { setFilingStatus(f); pulse(); }}
                        className={`rounded-lg py-2.5 text-sm font-semibold capitalize transition-all ${
                          filingStatus === f ? "bg-white text-gray-950 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {f === "married" ? "Married" : "Single"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionLabel text="State" sub="Top marginal state income tax rate" />
                  <select
                    value={stateCode}
                    onChange={(e) => { setStateCode(e.target.value as StateCode); pulse(); }}
                    className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm focus:border-gray-400 focus:outline-none"
                  >
                    {STATE_CODES.map((code) => (
                      <option key={code} value={code}>
                        {stateNames[code]} ({stateTaxRates[code]}%)
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
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
              : "Estimate my tax"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your income and filing details, then click Calculate"
                subMessage="Your total tax, effective and marginal rates, after-tax income, and a tax-by-income curve will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Estimating your tax"
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
                eyebrow={`${isUK ? "UK" : "US"} · ${result.taxYear} tax year`}
                primaryValue={result.totalTax}
                primaryFormat={(v) => `${sym}${Math.round(v).toLocaleString()}`}
                primaryUnit="total tax"
                accentColor="#fb7185"
                note={{ text: `${pct(result.effectiveTaxRate)} effective rate`, tone: "warning" }}
                subStats={[
                  { label: "After-tax income", value: result.afterTaxIncome, format: money, sub: `${result.takeHomePct}% kept` },
                  { label: "Marginal rate", value: result.marginalRate * 100, format: (v) => `${v.toFixed(1)}%`, sub: "top bracket" },
                  { label: "Income tax", value: result.incomeTax, format: money, sub: isUK ? "UK income tax" : "federal" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Total tax as income rises"
                subtitle="How your tax bill scales across income levels"
                data={result.incomeImpact.map((p) => ({ x: p.income, y: p.totalTax }))}
                xFormat={(v) => `${sym}${Math.round(v / 1000)}k`}
                yFormat={(v) => `${sym}${Math.round(v / 1000)}k`}
                tooltipX={(v) => `${money(v)} income`}
                tooltipY={(v) => money(v)}
                referenceValue={result.totalTax}
                referenceLabel="You"
              />

              <BreakdownBarChart
                title="What makes up your tax bill"
                data={result.breakdown.map((d) => ({
                  label: d.label,
                  amount: d.amount,
                  pct: result.totalTax > 0 ? Math.round((d.amount / result.totalTax) * 100) : 0,
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
