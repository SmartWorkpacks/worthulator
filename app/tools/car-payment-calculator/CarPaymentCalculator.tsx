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
import { calculateCarPayment, type VehicleCondition } from "@/lib/calculators/carPaymentEngine";

const CALC_STEPS = [
  "Adding sales tax and your trade-in credit...",
  "Sizing the amount you need to finance...",
  "Amortizing the loan at your APR...",
  "Totalling the interest and cost...",
];

const BREAKDOWN_COLOR_HEX: Record<string, string> = {
  "bg-blue-400": "#60a5fa",
  "bg-amber-400": "#fbbf24",
  "bg-rose-400": "#fb7185",
};

export default function CarPaymentCalculator({
  newApr,
  usedApr,
  rateAsOf,
}: {
  newApr: number;
  usedApr: number;
  rateAsOf: string;
}) {
  const [condition, setCondition] = useState<VehicleCondition>("new");
  const [vehiclePrice, setVehiclePrice] = useState(35_000);
  const [downPayment, setDownPayment] = useState(5_000);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [salesTaxPct, setSalesTaxPct] = useState(7);
  const [aprPct, setAprPct] = useState(newApr);
  const [termMonths, setTermMonths] = useState(60);

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculateCarPayment({ vehiclePrice, downPayment, tradeInValue, salesTaxPct, aprPct, termMonths });

  const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const pickCondition = (c: VehicleCondition) => {
    setCondition(c);
    setAprPct(c === "new" ? newApr : usedApr);
    pulse();
  };

  const insights: Insight[] = [
    {
      tone: "positive",
      text: `Financing ${money(result.amountFinanced)} over ${result.termMonths} months at ${result.aprPct}% works out to ${money(result.monthlyPayment)} per month.`,
    },
    {
      tone: "neutral",
      text: `Interest adds ${money(result.totalInterest)} over the life of the loan, bringing the all-in cost of the car to ${money(result.totalCost)}.`,
    },
    {
      tone: result.salesTax > 0 ? "neutral" : "positive",
      text: `Sales tax of ${money(result.salesTax)} (${result.salesTaxPct}% on ${money(Math.max(0, vehiclePrice - tradeInValue))}) is rolled into the amount financed.`,
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <div>
              <SectionLabel text="Vehicle condition" sub="Sets today's typical APR" />
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
                {(["new", "used"] as VehicleCondition[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => pickCondition(c)}
                    className={`rounded-lg py-2.5 text-sm font-semibold capitalize transition-all ${
                      condition === c ? "bg-white text-gray-950 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <SectionLabel text="Price & cash" sub="What you pay and put down" />
            <NumInput
              label="Vehicle price"
              value={vehiclePrice}
              onChange={(v) => { setVehiclePrice(v); pulse(); }}
              min={0}
              max={500_000}
              step={500}
              prefix="$"
            />
            <NumInput
              label="Down payment"
              value={downPayment}
              onChange={(v) => { setDownPayment(v); pulse(); }}
              min={0}
              max={500_000}
              step={500}
              prefix="$"
            />
            <NumInput
              label="Trade-in value"
              value={tradeInValue}
              onChange={(v) => { setTradeInValue(v); pulse(); }}
              min={0}
              max={500_000}
              step={500}
              prefix="$"
            />

            <SectionLabel text="Loan terms" sub="Rate, length, and local tax" />
            <RangeSliderCard
              label="APR"
              hint={`Live default: new ${newApr}% · used ${usedApr}% (FRED, ${rateAsOf})`}
              value={aprPct}
              min={0}
              max={30}
              step={0.1}
              unit="%"
              onChange={(v) => { setAprPct(v); pulse(); }}
            />
            <RangeSliderCard
              label="Loan term"
              hint="Common auto loans run 36 to 72 months"
              value={termMonths}
              min={12}
              max={96}
              step={6}
              unit=" mo"
              onChange={(v) => { setTermMonths(v); pulse(); }}
            />
            <RangeSliderCard
              label="Sales tax rate"
              hint="Varies by state and locality — edit to match yours"
              value={salesTaxPct}
              min={0}
              max={15}
              step={0.25}
              unit="%"
              onChange={(v) => { setSalesTaxPct(v); pulse(); }}
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
              : "Calculate my car payment"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter the price, down payment, and APR, then click Calculate"
                subMessage="Your monthly payment, total interest, amortization curve, and full cost breakdown will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Working out your payment"
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
                eyebrow={`${result.aprPct}% APR · ${result.termMonths} months`}
                primaryValue={result.monthlyPayment}
                primaryFormat={(v) => `$${Math.round(v).toLocaleString()}`}
                primaryUnit="per month"
                accentColor="#3b82f6"
                note={{ text: `${money(result.totalInterest)} total interest`, tone: "warning" }}
                subStats={[
                  { label: "Amount financed", value: result.amountFinanced, format: money, sub: "after down & trade" },
                  { label: "Total interest", value: result.totalInterest, format: money, sub: "over the loan" },
                  { label: "Total cost", value: result.totalCost, format: money, sub: "price + tax + interest" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Loan balance over the term"
                subtitle="How your financed balance is paid down each month"
                data={result.schedule.map((p) => ({ x: p.month, y: p.balance }))}
                xFormat={(v) => `${v}mo`}
                yFormat={(v) => `$${Math.round(v / 1000)}k`}
                tooltipX={(v) => `Month ${v}`}
                tooltipY={(v) => money(v)}
                referenceValue={result.amountFinanced}
                referenceLabel="Financed"
              />

              <BreakdownBarChart
                title="What the car really costs"
                data={result.breakdown.map((d) => ({
                  label: d.label,
                  amount: d.amount,
                  pct: result.totalCost > 0 ? Math.round((d.amount / result.totalCost) * 100) : 0,
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
