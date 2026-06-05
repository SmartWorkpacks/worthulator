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
import { calculateOneRepMax, type WeightUnit } from "@/lib/calculators/oneRepMaxEngine";

const CALC_STEPS = [
  "Running your set through six strength formulas...",
  "Averaging the one-rep-max estimates...",
  "Building your training-percentage table...",
  "Mapping the rep-max curve...",
];

const FORMULA_HEX = "#8b5cf6";

export default function OneRepMaxCalculator() {
  const [weight, setWeight] = useState(225);
  const [reps, setReps] = useState(5);
  const [unit, setUnit] = useState<WeightUnit>("lb");

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculateOneRepMax({ weight, reps, unit });

  const u = result.unit;
  const load = (n: number) => `${Math.round(n).toLocaleString()} ${u}`;

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const spreadPct = result.oneRepMax > 0 ? Math.round(((result.spreadHigh - result.spreadLow) / result.oneRepMax) * 100) : 0;

  const insights: Insight[] = [
    {
      tone: "positive",
      text: `Lifting ${load(result.weight)} for ${result.reps} reps points to an estimated 1RM of about ${load(result.oneRepMax)}.`,
    },
    {
      tone: "neutral",
      text: `The six formulas range from ${load(result.spreadLow)} to ${load(result.spreadHigh)} — a ${spreadPct}% spread, so treat the number as an estimate, not a guarantee.`,
    },
    {
      tone: reps >= 10 ? "warning" : "neutral",
      text:
        reps >= 10
          ? `Above ~10 reps these formulas lose accuracy. For a tighter estimate, test a heavier set in the 3–6 rep range.`
          : `Train off percentages: ${load(result.percentTable[3].weight)} (85%) is a solid ${result.percentTable[3].reps}-rep working set without maxing out.`,
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Your set" sub="A set you actually completed" />

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Unit</span>
              <div className="grid grid-cols-2 gap-2">
                {(["lb", "kg"] as WeightUnit[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { setUnit(opt); pulse(); }}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                      unit === opt
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {opt === "lb" ? "Pounds (lb)" : "Kilograms (kg)"}
                  </button>
                ))}
              </div>
            </div>

            <NumInput
              label="Weight lifted"
              value={weight}
              onChange={(v) => { setWeight(v); pulse(); }}
              min={0}
              max={2_000}
              step={5}
              suffix={u}
            />
            <NumInput
              label="Reps performed"
              value={reps}
              onChange={(v) => { setReps(v); pulse(); }}
              min={1}
              max={20}
              step={1}
              suffix="reps"
            />
            <p className="text-xs text-gray-500">
              Most accurate at 1–10 reps. Enter your best honest set — not a grind to failure with broken form.
            </p>
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
              : "Estimate my 1RM"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter a set you lifted, then click Estimate"
                subMessage="Your one-rep max, a training-percentage table, rep-max targets, and the per-formula spread will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Estimating your max"
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
                eyebrow={`${load(result.weight)} × ${result.reps} reps`}
                primaryValue={result.oneRepMax}
                primaryFormat={(v) => `${Math.round(v).toLocaleString()}`}
                primaryUnit={`${u} estimated 1RM`}
                accentColor={FORMULA_HEX}
                note={{ text: `Range ${load(result.spreadLow)}–${load(result.spreadHigh)}`, tone: "positive" }}
                subStats={[
                  { label: "5-rep max", value: result.repMaxes[2].weight, format: load, sub: "~87% of 1RM" },
                  { label: "Formulas", value: result.formulaEstimates.length, format: (v) => `${v}`, sub: "averaged" },
                  { label: "Set lifted", value: result.weight, format: load, sub: `${result.reps} reps` },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Estimated load by rep target"
                subtitle="How much you can expect to lift for a given number of reps"
                data={result.repCurve.map((p) => ({ x: p.reps, y: p.weight }))}
                xFormat={(v) => `${v}`}
                yFormat={(v) => `${Math.round(v)}`}
                tooltipX={(v) => `${v}-rep max`}
                tooltipY={(v) => load(v)}
                referenceValue={result.oneRepMax}
                referenceLabel="1RM"
              />

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold tracking-wide text-gray-500 uppercase">Training percentages</h3>
                <div className="overflow-hidden rounded-xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        <th className="px-4 py-2.5">% of 1RM</th>
                        <th className="px-4 py-2.5">Weight</th>
                        <th className="px-4 py-2.5">Approx. reps</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.percentTable.map((row, i) => (
                        <tr key={row.pct} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                          <td className="px-4 py-2.5 font-semibold text-gray-900">{row.pct}%</td>
                          <td className="px-4 py-2.5 text-gray-700">{load(row.weight)}</td>
                          <td className="px-4 py-2.5 text-gray-500">{row.reps}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <BreakdownBarChart
                title="What each formula predicts"
                data={result.formulaEstimates.map((f) => ({
                  label: f.name,
                  amount: f.value,
                  pct: result.spreadHigh > 0 ? Math.round((f.value / result.spreadHigh) * 100) : 0,
                  fill: FORMULA_HEX,
                }))}
                valueFormat={(v) => load(v)}
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
