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
import { calculateSquareFootage, type AreaShape, type LinearUnit } from "@/lib/calculators/squareFootageEngine";

const CALC_STEPS = [
  "Converting your measurements to feet...",
  "Calculating the area...",
  "Adding your waste allowance...",
  "Estimating the material and cost...",
];

const BREAKDOWN_COLOR_HEX: Record<string, string> = {
  "bg-emerald-400": "#34d399",
  "bg-amber-400": "#fbbf24",
};

const SHAPES: { id: AreaShape; label: string; icon: string }[] = [
  { id: "rectangle", label: "Rectangle", icon: "▭" },
  { id: "square", label: "Square", icon: "◻" },
  { id: "circle", label: "Circle", icon: "◯" },
  { id: "triangle", label: "Triangle", icon: "△" },
];

const UNITS: { id: LinearUnit; label: string }[] = [
  { id: "ft", label: "Feet" },
  { id: "in", label: "Inches" },
  { id: "yd", label: "Yards" },
  { id: "m", label: "Meters" },
];

const A_LABEL: Record<AreaShape, string> = {
  rectangle: "Length",
  square: "Side",
  circle: "Diameter",
  triangle: "Base",
};

export default function SquareFootageCalculator() {
  const [shape, setShape] = useState<AreaShape>("rectangle");
  const [dimA, setDimA] = useState(12);
  const [dimB, setDimB] = useState(10);
  const [unit, setUnit] = useState<LinearUnit>("ft");
  const [quantity, setQuantity] = useState(1);
  const [wastePct, setWastePct] = useState(10);
  const [pricePerSqFt, setPricePerSqFt] = useState(4);

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculateSquareFootage({ shape, dimA, dimB, unit, quantity, wastePct, pricePerSqFt });

  const needsB = shape === "rectangle" || shape === "triangle";
  const num = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 1 });
  const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const insights: Insight[] = [
    {
      tone: "positive",
      text: `Your ${shape}${quantity > 1 ? ` × ${quantity}` : ""} covers ${num(result.totalSqFt)} sq ft — that's ${num(result.totalSqM)} m² or ${num(result.totalSqYd)} sq yd.`,
    },
    {
      tone: "neutral",
      text: `Add a ${wastePct}% waste allowance and you should buy material for ${num(result.withWasteSqFt)} sq ft (${num(result.wasteSqFt)} sq ft of that is spare for cuts).`,
    },
    pricePerSqFt > 0
      ? {
          tone: "neutral",
          text: `At ${money(pricePerSqFt)}/sq ft, the material works out to about ${money(result.materialCost)}.`,
        }
      : { tone: "neutral", text: "Add a price per square foot to estimate material cost." },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <div>
              <SectionLabel text="Shape" sub="Pick the area you're measuring" />
              <div className="mt-3 grid grid-cols-4 gap-2 rounded-xl bg-gray-100 p-1">
                {SHAPES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => { setShape(s.id); pulse(); }}
                    className={`flex flex-col items-center gap-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                      shape === s.id ? "bg-white text-gray-950 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span className="text-base leading-none">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel text="Unit" sub="Measurement unit of your inputs" />
              <div className="mt-3 grid grid-cols-4 gap-2 rounded-xl bg-gray-100 p-1">
                {UNITS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => { setUnit(u.id); pulse(); }}
                    className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                      unit === u.id ? "bg-white text-gray-950 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            <SectionLabel text="Dimensions" sub={`Measured in ${unit}`} />
            <NumInput
              label={A_LABEL[shape]}
              value={dimA}
              onChange={(v) => { setDimA(v); pulse(); }}
              min={0}
              max={1_000_000}
              step={1}
              suffix={unit}
            />
            {needsB && (
              <NumInput
                label={shape === "triangle" ? "Height" : "Width"}
                value={dimB}
                onChange={(v) => { setDimB(v); pulse(); }}
                min={0}
                max={1_000_000}
                step={1}
                suffix={unit}
              />
            )}

            <SectionLabel text="Material" sub="Quantity, waste, and price" />
            <NumInput
              label="Number of identical areas"
              value={quantity}
              onChange={(v) => { setQuantity(v); pulse(); }}
              min={1}
              max={10_000}
              step={1}
            />
            <NumInput
              label="Waste allowance"
              value={wastePct}
              onChange={(v) => { setWastePct(v); pulse(); }}
              min={0}
              max={100}
              step={1}
              suffix="%"
            />
            <NumInput
              label="Price per sq ft"
              value={pricePerSqFt}
              onChange={(v) => { setPricePerSqFt(v); pulse(); }}
              min={0}
              max={1_000}
              step={0.25}
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
              : "Calculate square footage"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your dimensions, then click Calculate"
                subMessage="Your total square footage, material to buy with waste, cost estimate, and metric conversions will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Measuring the area"
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
                eyebrow={`${shape}${quantity > 1 ? ` × ${quantity}` : ""}`}
                primaryValue={result.totalSqFt}
                primaryFormat={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                primaryUnit="sq ft"
                accentColor="#10b981"
                note={{ text: `Buy material for ${num(result.withWasteSqFt)} sq ft`, tone: "positive" }}
                subStats={[
                  { label: "With waste", value: result.withWasteSqFt, format: (v) => `${num(v)} sq ft`, sub: `${wastePct}% spare` },
                  { label: "Material cost", value: result.materialCost, format: money, sub: `at ${money(pricePerSqFt)}/sq ft` },
                  { label: "Metric", value: result.totalSqM, format: (v) => `${num(v)} m²`, sub: `${num(result.totalSqYd)} sq yd` },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <BreakdownBarChart
                title="Usable area vs waste allowance"
                data={result.breakdown.map((d) => ({
                  label: d.label,
                  amount: d.amount,
                  pct: result.withWasteSqFt > 0 ? Math.round((d.amount / result.withWasteSqFt) * 100) : 0,
                  fill: BREAKDOWN_COLOR_HEX[d.colorClass],
                }))}
                valueFormat={(v) => `${num(v)} sq ft`}
              />

              <ImpactLineChart
                title="Material cost by price per sq ft"
                subtitle="How your budget moves with the material you choose"
                data={result.priceImpact.map((p) => ({ x: p.pricePerSqFt, y: p.cost }))}
                xFormat={(v) => `$${v}`}
                yFormat={(v) => `$${Math.round(v).toLocaleString()}`}
                tooltipX={(v) => `$${v}/sq ft`}
                tooltipY={(v) => money(v)}
                referenceValue={result.materialCost}
                referenceLabel="Your price"
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
