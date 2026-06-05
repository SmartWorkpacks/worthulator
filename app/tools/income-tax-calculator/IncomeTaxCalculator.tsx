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
import { calculateIncomeTax, type IncomeTaxCountry, type IncomeTaxFilingStatus } from "@/lib/calculators/incomeTaxEngine";
import { stateTaxRates, stateNames, type StateCode } from "@/src/lib/stateTax";

const CALC_STEPS = [
  "Subtracting your deduction...",
  "Taxing each bracket in turn...",
  "Adding any state income tax...",
  "Working out your effective rate...",
];

const BRACKET_FILL_HEX: Record<string, string> = {
  "bg-sky-300": "#7dd3fc",
  "bg-sky-400": "#38bdf8",
  "bg-blue-400": "#60a5fa",
  "bg-blue-500": "#3b82f6",
  "bg-indigo-500": "#6366f1",
  "bg-violet-500": "#8b5cf6",
  "bg-purple-600": "#9333ea",
  "bg-rose-400": "#fb7185",
};

const STATE_CODES = Object.keys(stateTaxRates) as StateCode[];

export default function IncomeTaxCalculator({ taxYear }: { taxYear: string }) {
  const [country, setCountry] = useState<IncomeTaxCountry>("US");
  const [annualIncome, setAnnualIncome] = useState(80_000);
  const [filingStatus, setFilingStatus] = useState<IncomeTaxFilingStatus>("single");
  const [stateCode, setStateCode] = useState<StateCode>("TX");

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const stateRatePct = country === "US" ? stateTaxRates[stateCode] : 0;
  const result = calculateIncomeTax({ country, annualIncome, filingStatus, stateRatePct });

  const isUK = country === "UK";
  const sym = isUK ? "£" : "$";
  const money = (n: number) => `${sym}${Math.round(n).toLocaleString()}`;
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const topBand = result.brackets.reduce(
    (max, b) => (b.tax > max.tax ? b : max),
    result.brackets[0] ?? { ratePct: 0, tax: 0, lower: 0, upper: 0, taxedAmount: 0 },
  );

  const insights: Insight[] = [
    {
      tone: "warning",
      text: `On ${money(result.grossIncome)} of income you owe about ${money(result.totalIncomeTax)} in income tax — an effective rate of ${pct(result.effectiveTaxRate)}.`,
    },
    {
      tone: "neutral",
      text: `Your ${pct(result.marginalRate)} top bracket only applies to your highest dollars; the ${topBand.ratePct}% band contributes the most tax at ${money(topBand.tax)}.`,
    },
    !isUK && result.stateTax > 0
      ? {
          tone: "neutral",
          text: `${stateNames[stateCode]} state income tax adds ${money(result.stateTax)} on top of ${money(result.federalTax)} of federal tax.`,
        }
      : {
          tone: "positive",
          text: `After income tax you keep ${money(result.afterTaxIncome)} — ${result.afterTaxPct}% of your gross (before any payroll tax).`,
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
                {(["US", "UK"] as IncomeTaxCountry[]).map((c) => (
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
                    {(["single", "married"] as IncomeTaxFilingStatus[]).map((f) => (
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
              : "Calculate my income tax"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your income and filing details, then click Calculate"
                subMessage="Your income tax, a bracket-by-bracket breakdown, effective and marginal rates, and income after tax will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Working through the brackets"
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
                eyebrow={`${isUK ? "UK" : "US"} income tax · ${result.taxYear}`}
                primaryValue={result.totalIncomeTax}
                primaryFormat={(v) => `${sym}${Math.round(v).toLocaleString()}`}
                primaryUnit="income tax"
                accentColor="#6366f1"
                note={{ text: `${pct(result.effectiveTaxRate)} effective rate`, tone: "warning" }}
                subStats={[
                  { label: "After income tax", value: result.afterTaxIncome, format: money, sub: `${result.afterTaxPct}% kept` },
                  { label: "Marginal rate", value: result.marginalRate * 100, format: (v) => `${v.toFixed(1)}%`, sub: "top bracket" },
                  { label: "Taxable income", value: result.taxableIncome, format: money, sub: "after deduction" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <BreakdownBarChart
                title="Income tax by bracket"
                data={result.breakdown.map((d) => ({
                  label: d.label,
                  amount: d.amount,
                  pct: result.totalIncomeTax > 0 ? Math.round((d.amount / result.totalIncomeTax) * 100) : 0,
                  fill: BRACKET_FILL_HEX[d.colorClass],
                }))}
                valueFormat={(v) => money(v)}
              />

              <ImpactLineChart
                title="Income tax as income rises"
                subtitle="How your income-tax bill scales across income levels"
                data={result.incomeImpact.map((p) => ({ x: p.income, y: p.incomeTax }))}
                xFormat={(v) => `${sym}${Math.round(v / 1000)}k`}
                yFormat={(v) => `${sym}${Math.round(v / 1000)}k`}
                tooltipX={(v) => `${money(v)} income`}
                tooltipY={(v) => money(v)}
                referenceValue={result.totalIncomeTax}
                referenceLabel="You"
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
