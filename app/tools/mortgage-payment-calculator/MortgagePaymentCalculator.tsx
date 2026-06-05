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
import {
  calculateMortgagePayment,
  MORTGAGE_DEFAULTS,
} from "@/lib/calculators/mortgagePaymentEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

const RATE_DEFAULT = fredBenchmarks.mortgage30yr;
const AS_OF = fredBenchmarks.currentPeriodLabel;

const CALC_STEPS = [
  "Sizing your loan and down payment...",
  "Amortizing principal & interest...",
  "Adding tax, insurance & PMI...",
  "Building your payment breakdown...",
];

function fmt(v: number) {
  const a = Math.round(Math.abs(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a.toLocaleString()}`;
}
const fmtFull = (v: number) => `$${Math.round(Math.abs(v)).toLocaleString()}`;

export default function MortgagePaymentCalculator() {
  const [homePrice, setHomePrice] = useState(400_000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [annualRatePct, setAnnualRatePct] = useState(RATE_DEFAULT);
  const [termYears, setTermYears] = useState(30);
  const [propertyTaxRatePct, setPropertyTaxRatePct] = useState<number>(MORTGAGE_DEFAULTS.propertyTaxRatePct);
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState<number>(MORTGAGE_DEFAULTS.homeInsuranceAnnual);
  const [hoaMonthly, setHoaMonthly] = useState(0);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  const r = calculateMortgagePayment({
    homePrice,
    downPaymentPct,
    annualRatePct,
    termYears,
    propertyTaxRatePct,
    homeInsuranceAnnual,
    hoaMonthly,
  });

  const insights: Insight[] = [];
  insights.push({
    tone: "neutral",
    text: `Principal & interest is ${fmtFull(r.monthlyPI)}/mo — just ${r.piShareOfTotalPct}% of your true ${fmtFull(r.totalMonthly)}/mo payment once tax, insurance${r.monthlyPMI > 0 ? ", PMI" : ""}${r.monthlyHOA > 0 ? ", HOA" : ""} are added.`,
  });
  if (r.pmiActive) {
    insights.push({
      tone: "warning",
      text: `${fmtFull(r.monthlyPMI)}/mo goes to PMI because you're putting down under 20%. Reaching 20% equity (${fmtFull(homePrice * 0.2)} down) removes it entirely.`,
    });
  } else {
    insights.push({
      tone: "positive",
      text: `No PMI — your ${downPaymentPct}% down payment is at or above 20%, so you skip mortgage insurance entirely.`,
    });
  }
  insights.push({
    tone: "neutral",
    text: `Tax + insurance${r.monthlyHOA > 0 ? " + HOA" : ""} add ${fmtFull(r.monthlyTax + r.monthlyInsurance + r.monthlyHOA)}/mo on top of P&I — escrow costs people routinely underestimate.`,
  });
  insights.push({
    tone: "neutral",
    text: `Rate defaults to the current US 30-year fixed average of ${RATE_DEFAULT}% (${AS_OF}) — set your actual quoted rate for an exact payment.`,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="The home & loan" sub="Price, down payment, rate, and term" />
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
              hint={`${fmtFull(homePrice * (downPaymentPct / 100))} down · ${r.ltvPct}% LTV`}
              value={downPaymentPct}
              min={0}
              max={50}
              step={1}
              unit="%"
              onChange={setDownPaymentPct}
            />
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

            <SectionLabel text="Escrow & dues" sub="Taxes, insurance, and HOA" />
            <RangeSliderCard
              label="Property tax rate"
              hint="Annual % of home value (US avg ≈ 1.1%)"
              value={propertyTaxRatePct}
              min={0}
              max={4}
              step={0.05}
              unit="%"
              onChange={setPropertyTaxRatePct}
            />
            <NumInput
              label="Home insurance (per year)"
              prefix="$"
              hint="US average ≈ $1,800/yr"
              value={homeInsuranceAnnual}
              onChange={setHomeInsuranceAnnual}
              step={100}
              min={0}
              max={50_000}
              wide
            />
            <NumInput
              label="HOA dues (per month)"
              prefix="$"
              hint="Leave 0 if none"
              value={hoaMonthly}
              onChange={setHoaMonthly}
              step={25}
              min={0}
              max={5_000}
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
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Calculate payment"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your home and loan details, then click Calculate"
                subMessage="Your full monthly payment (PITI), breakdown, and PMI insights will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Building your payment"
              />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow="Total monthly payment (PITI)"
                primaryValue={r.totalMonthly}
                primaryFormat={(n) => `$${n.toLocaleString()}`}
                primaryUnit="/mo"
                accentColor="#34d399"
                note={{
                  text: `${fmtFull(r.loanAmount)} loan · ${fmtFull(r.downPaymentAmount)} down (${downPaymentPct}%)`,
                  tone: r.pmiActive ? "warning" : "positive",
                }}
                subStats={[
                  { label: "Principal & interest", value: r.monthlyPI, format: fmt, sub: "/mo" },
                  { label: "Tax + insurance", value: r.monthlyTax + r.monthlyInsurance, format: fmt, sub: "/mo escrow" },
                  { label: r.monthlyPMI > 0 ? "PMI" : "Total interest", value: r.monthlyPMI > 0 ? r.monthlyPMI : r.totalInterest, format: fmt, sub: r.monthlyPMI > 0 ? "/mo" : "life of loan" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <BreakdownBarChart
                title="Where your monthly payment goes"
                data={r.monthlyBreakdown}
                valueFormat={(v) => `${fmtFull(v)}/mo`}
              />

              <ImpactLineChart
                title="Monthly payment by down payment"
                subtitle="Watch the PMI cliff: the payment drops once you hit 20% down"
                data={r.paymentByDownPayment}
                xFormat={(v) => `${v}%`}
                yFormat={(v) => fmt(v)}
                tooltipX={(v) => `${v}% down`}
                tooltipY={(v) => `${fmtFull(v)}/mo`}
                referenceX={20}
                referenceXLabel="20% · PMI ends"
                color="#34d399"
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer text="Estimates use typical US defaults for property tax (≈1.1%/yr), home insurance (≈$1,800/yr), and PMI (≈0.5%/yr of the loan). Your actual escrow, PMI, and rate are set by your lender, county, and insurer — confirm exact figures with them." />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
