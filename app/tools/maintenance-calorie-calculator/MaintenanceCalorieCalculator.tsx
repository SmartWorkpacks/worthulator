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
import {
  calculateMaintenanceCalories,
  type MaintenanceSex,
} from "@/lib/calculators/maintenanceCalorieEngine";

const CALC_STEPS = [
  "Estimating your resting burn (BMR)...",
  "Applying your activity level...",
  "Calculating your maintenance calories...",
  "Building macro targets and insights...",
];

const MACRO_COLOR_HEX: Record<string, string> = {
  "bg-blue-400": "#60a5fa",
  "bg-emerald-400": "#34d399",
  "bg-amber-400": "#fbbf24",
};

const ACTIVITY_OPTIONS: { label: string; multiplier: number; hint: string }[] = [
  { label: "Sedentary", multiplier: 1.2, hint: "Little or no exercise" },
  { label: "Light", multiplier: 1.375, hint: "1–3 days/week" },
  { label: "Moderate", multiplier: 1.55, hint: "3–5 days/week" },
  { label: "Very active", multiplier: 1.725, hint: "6–7 days/week" },
  { label: "Extra active", multiplier: 1.9, hint: "Hard daily / physical job" },
];

const kcal = (n: number) => `${Math.round(n).toLocaleString()} kcal`;

export default function MaintenanceCalorieCalculator() {
  const [sex, setSex] = useState<MaintenanceSex>("male");
  const [age, setAge] = useState(30);
  const [heightIn, setHeightIn] = useState(70);
  const [weightLbs, setWeightLbs] = useState(175);
  const [activityMultiplier, setActivityMultiplier] = useState(1.55);

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculateMaintenanceCalories({ age, sex, heightIn, weightLbs, activityMultiplier });

  const pulse = () => {
    if (revealState === "revealed") pulseCountUp();
  };

  const activeLabel =
    ACTIVITY_OPTIONS.find((o) => o.multiplier === activityMultiplier)?.label ?? "Custom";

  const insights: Insight[] = [
    {
      tone: "positive",
      text: `Eating about ${kcal(result.maintenanceCalories)} a day keeps your weight steady at your current activity level.`,
    },
    {
      tone: "neutral",
      text: `Your resting burn (BMR) is ${kcal(result.bmr)} — the rest comes from moving. Maintenance is BMR × ${activityMultiplier.toFixed(3)}.`,
    },
    {
      tone: "neutral",
      text: `To lose ~1 lb/week, aim for ${kcal(result.mildCutCalories)}. For a lean gain, try ${kcal(result.leanBulkCalories)}.`,
    },
    {
      tone: "neutral",
      text: `A balanced split lands near ${result.proteinGrams}g protein, ${result.carbsGrams}g carbs, and ${result.fatGrams}g fat.`,
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="Profile" sub="Used for your BMR estimate" />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <p className="mb-2 text-xs font-semibold text-gray-500">Sex</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["male", "female"] as MaintenanceSex[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => { setSex(item); pulse(); }}
                      className={
                        "rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition " +
                        (sex === item
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <NumInput label="Age" value={age} onChange={(v) => { setAge(v); pulse(); }} min={16} max={90} step={1} />
            </div>

            <SectionLabel text="Body metrics" sub="Imperial units" />
            <div className="grid grid-cols-2 gap-3">
              <NumInput label="Height" value={heightIn} onChange={(v) => { setHeightIn(v); pulse(); }} min={48} max={84} step={1} suffix="in" />
              <NumInput label="Weight" value={weightLbs} onChange={(v) => { setWeightLbs(v); pulse(); }} min={70} max={450} step={1} suffix="lb" />
            </div>

            <SectionLabel text="Activity level" sub="How much you move on a typical week" />
            <div className="flex flex-col gap-2">
              {ACTIVITY_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => { setActivityMultiplier(opt.multiplier); pulse(); }}
                  className={
                    "flex items-center justify-between rounded-lg border px-3 py-2 text-left transition " +
                    (activityMultiplier === opt.multiplier
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 bg-white hover:border-gray-300")
                  }
                >
                  <span>
                    <span className={"block text-sm font-semibold " + (activityMultiplier === opt.multiplier ? "text-emerald-700" : "text-gray-800")}>
                      {opt.label}
                    </span>
                    <span className="text-xs text-gray-500">{opt.hint}</span>
                  </span>
                  <span className={"text-xs font-bold " + (activityMultiplier === opt.multiplier ? "text-emerald-700" : "text-gray-400")}>
                    ×{opt.multiplier}
                  </span>
                </button>
              ))}
            </div>
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
              : "Calculate maintenance calories"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Set your profile and click Calculate"
                subMessage="Your maintenance calories, BMR, macro split, and how activity changes the number will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Estimating your daily burn"
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
                eyebrow={`${activeLabel} · maintenance`}
                primaryValue={result.maintenanceCalories}
                primaryFormat={(v) => Math.round(v).toLocaleString()}
                primaryUnit="kcal/day"
                accentColor="#10b981"
                note={{ text: `Resting burn (BMR) ${kcal(result.bmr)}`, tone: "positive" }}
                subStats={[
                  { label: "Lose ~1 lb/wk", value: result.mildCutCalories, format: kcal, sub: "−500 kcal" },
                  { label: "Lean gain", value: result.leanBulkCalories, format: kcal, sub: "+300 kcal" },
                  { label: "Protein", value: result.proteinGrams, format: (v) => `${Math.round(v)} g`, sub: "per day" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <BreakdownBarChart
                title="Macro split at maintenance"
                data={result.macroBreakdown.map((d) => ({
                  label: d.label,
                  amount: d.amount,
                  pct: d.pct,
                  fill: MACRO_COLOR_HEX[d.colorClass],
                }))}
                valueFormat={kcal}
              />

              <ImpactLineChart
                title="Maintenance by activity level"
                subtitle="How your daily calories change as you move more"
                data={result.activityImpact.map((p) => ({ x: p.multiplier, y: p.calories }))}
                xFormat={(v) => `×${v}`}
                yFormat={(v) => `${Math.round(v).toLocaleString()}`}
                tooltipX={(v) => `Activity ×${v}`}
                tooltipY={kcal}
                referenceValue={result.maintenanceCalories}
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
