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
import { stateTaxRates, stateNames, type StateCode } from "@/src/lib/stateTax";
import {
  calculatePaycheck,
  type PaycheckCountry,
  type FilingStatus,
  type PayFrequency,
} from "@/lib/calculators/paycheckEngine";

const CALC_STEPS = [
  "Reading your gross pay and pre-tax contributions...",
  "Applying federal income tax brackets...",
  "Adding payroll taxes and state withholding...",
  "Splitting take-home across your pay schedule...",
];

const FREQUENCY_LABEL: Record<PayFrequency, string> = {
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  semimonthly: "Semi-monthly",
  monthly: "Monthly",
  annual: "Annual",
};

// Per-paycheck unit suffix matching the chosen frequency (the hero value is
// netAnnual ÷ pay periods, so the label must track the frequency, not assume monthly).
const FREQUENCY_UNIT: Record<PayFrequency, string> = {
  weekly: "/week",
  biweekly: "/paycheck",
  semimonthly: "/paycheck",
  monthly: "/month",
  annual: "/year",
};

const DEDUCTION_COLOR_HEX: Record<string, string> = {
  "bg-emerald-400": "#34d399",
  "bg-red-400": "#f87171",
  "bg-blue-400": "#60a5fa",
  "bg-amber-400": "#fbbf24",
  "bg-orange-400": "#fb923c",
  "bg-violet-400": "#a78bfa",
};

const STATE_CODES = Object.keys(stateTaxRates) as StateCode[];

export default function PaycheckCalculator() {
  const [country, setCountry] = useState<PaycheckCountry>("US");
  const [grossAnnual, setGrossAnnual] = useState(65_000);
  const [payFrequency, setPayFrequency] = useState<PayFrequency>("biweekly");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [stateCode, setStateCode] = useState<StateCode>("CA");
  const [retirementPct, setRetirementPct] = useState(5);

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculatePaycheck({
    country,
    grossAnnual,
    payFrequency,
    filingStatus,
    stateCode,
    retirementPct,
  });

  const isUK = country === "UK";
  const sym = isUK ? "£" : "$";
  const money = (n: number) => `${sym}${Math.round(n).toLocaleString()}`;

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  // Largest single deduction (excluding take-home) for an insight.
  const taxLines = result.deductions.filter((d) => d.label !== "Take-home");
  const biggest = taxLines.reduce(
    (max, d) => (d.annual > max.annual ? d : max),
    taxLines[0] ?? { label: "", annual: 0, pct: 0, perPaycheck: 0, colorClass: "" },
  );

  const insights: Insight[] = [
    {
      tone: "neutral",
      text: `You keep ${result.takeHomePct}% of your ${money(result.grossAnnual)} gross — that is ${money(
        result.netPerPaycheck,
      )} per ${FREQUENCY_LABEL[payFrequency].toLowerCase()} paycheck.`,
    },
    {
      tone: "warning",
      text: `${biggest.label} is your biggest deduction at ${money(biggest.annual)}/yr (${biggest.pct.toFixed(
        1,
      )}% of gross).`,
    },
    {
      tone: "neutral",
      text: `Your marginal income-tax rate is ${(result.marginalRate * 100).toFixed(
        0,
      )}%, but your effective tax rate is only ${(result.effectiveTaxRate * 100).toFixed(1)}% of gross.`,
    },
  ];

  if (!isUK) {
    insights.push({
      tone: "neutral",
      text: `Social Security and Medicare are charged on your full ${money(
        result.grossAnnual,
      )} — pre-tax 401(k) dollars do not reduce ${money(result.socialSecurity + result.medicare)} of FICA.`,
    });
    if (result.retirementContribution > 0) {
      insights.push({
        tone: "positive",
        text: `Your ${retirementPct}% 401(k) puts ${money(
          result.retirementContribution,
        )}/yr into retirement before tax, trimming your taxable income.`,
      });
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Region" sub="Tax model used" />
            <div className="grid grid-cols-2 gap-2">
              {(["US", "UK"] as PaycheckCountry[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCountry(item);
                    pulse();
                  }}
                  className={
                    "rounded-lg border px-3 py-2 text-sm font-semibold transition " +
                    (country === item
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                  }
                >
                  {item === "US" ? "United States" : "United Kingdom"}
                </button>
              ))}
            </div>

            <SectionLabel text="Pay" sub="Gross salary before deductions" />
            <NumInput
              label="Gross annual pay"
              value={grossAnnual}
              onChange={setGrossAnnual}
              min={0}
              max={2_000_000}
              step={1_000}
              prefix={sym}
            />

            <SectionLabel text="Pay frequency" sub="How often you are paid" />
            <div className="grid grid-cols-3 gap-2">
              {(["weekly", "biweekly", "semimonthly", "monthly", "annual"] as PayFrequency[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPayFrequency(item)}
                  className={
                    "rounded-lg border px-2 py-2 text-xs font-semibold transition " +
                    (payFrequency === item
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                  }
                >
                  {FREQUENCY_LABEL[item]}
                </button>
              ))}
            </div>

            {!isUK && (
              <>
                <SectionLabel text="Filing status" sub="Federal brackets + standard deduction" />
                <div className="grid grid-cols-2 gap-2">
                  {(["single", "married"] as FilingStatus[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setFilingStatus(item);
                        pulse();
                      }}
                      className={
                        "rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition " +
                        (filingStatus === item
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                      }
                    >
                      {item === "married" ? "Married (joint)" : "Single"}
                    </button>
                  ))}
                </div>

                <SectionLabel text="State" sub="Applies top marginal state rate" />
                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <label className="mb-2 block text-xs font-semibold text-gray-500" htmlFor="state-select">
                    State of residence
                  </label>
                  <select
                    id="state-select"
                    value={stateCode}
                    onChange={(e) => {
                      setStateCode(e.target.value as StateCode);
                      pulse();
                    }}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 focus:border-gray-400 focus:outline-none"
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

            <SectionLabel text={isUK ? "Pension" : "Retirement"} sub="Pre-tax contribution" />
            <RangeSliderCard
              label={isUK ? "Pension contribution" : "401(k) contribution"}
              hint={isUK ? "Pre-tax pension as a % of gross" : "Traditional 401(k) as a % of gross (pre-tax)"}
              value={retirementPct}
              min={0}
              max={30}
              step={1}
              unit="%"
              onChange={(v) => {
                setRetirementPct(v);
                pulse();
              }}
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
              : "Calculate paycheck"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your pay details and click Calculate"
                subMessage="Your take-home paycheck, full tax breakdown, and salary impact curve will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Running your payroll model"
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
                eyebrow={`${FREQUENCY_LABEL[payFrequency]} take-home · ${result.taxYear} ${isUK ? "UK" : "US"}`}
                primaryValue={result.netPerPaycheck}
                primaryFormat={(v) => `${sym}${v.toLocaleString()}`}
                primaryUnit={FREQUENCY_UNIT[payFrequency]}
                accentColor="#34d399"
                note={{
                  text: `${result.takeHomePct}% take-home · ${(result.effectiveTaxRate * 100).toFixed(1)}% effective tax`,
                  tone: "positive",
                }}
                subStats={[
                  { label: "Net annual", value: result.netAnnual, format: money, sub: "after all deductions" },
                  { label: "Gross/paycheck", value: result.grossPerPaycheck, format: money, sub: "before deductions" },
                  {
                    label: "Total tax",
                    value: result.totalTax,
                    format: money,
                    sub: `${(result.effectiveTaxRate * 100).toFixed(1)}% of gross`,
                  },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <BreakdownBarChart
                title={`Where each ${sym}1 of your ${money(result.grossAnnual)} goes`}
                data={result.deductions.map((d) => ({
                  label: d.label,
                  amount: d.annual,
                  pct: d.pct,
                  fill: DEDUCTION_COLOR_HEX[d.colorClass],
                }))}
                valueFormat={(v) => money(v)}
              />

              <ImpactLineChart
                title="Take-home pay vs salary"
                subtitle="How your per-paycheck net changes across a salary range"
                data={result.incomeImpact.map((p) => ({ x: p.grossAnnual, y: p.netPerPaycheck }))}
                xFormat={(v) => `${sym}${Math.round(v / 1000)}k`}
                yFormat={(v) => `${sym}${v.toLocaleString()}`}
                tooltipX={(v) => `${money(v)} salary`}
                tooltipY={(v) => `${money(v)}/paycheck`}
                referenceValue={result.netPerPaycheck}
                referenceLabel="Your paycheck"
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
