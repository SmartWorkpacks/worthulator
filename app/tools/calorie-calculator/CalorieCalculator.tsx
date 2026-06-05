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
import {
  calculateCalories,
  type CalorieGoal,
  type CaloriePace,
  type CalorieSex,
} from "@/lib/calculators/calorieEngine";

const CALC_STEPS = [
  "Estimating your resting burn (BMR)...",
  "Applying your activity multiplier...",
  "Calculating calorie target and weekly change...",
  "Building macro targets and insights...",
];

const GOAL_LABEL: Record<CalorieGoal, string> = {
  lose: "Fat loss",
  maintain: "Maintenance",
  gain: "Muscle gain",
};

const GOAL_ACCENT: Record<CalorieGoal, string> = {
  lose: "#ef4444",
  maintain: "#10b981",
  gain: "#3b82f6",
};

const PACE_LABEL: Record<CaloriePace, string> = {
  gentle: "Gentle",
  moderate: "Moderate",
  aggressive: "Aggressive",
};

const MACRO_COLOR_HEX: Record<string, string> = {
  "bg-blue-400": "#60a5fa",
  "bg-emerald-400": "#34d399",
  "bg-amber-400": "#fbbf24",
};

function kcal(n: number) {
  return `${Math.round(n).toLocaleString()} kcal`;
}

export default function CalorieCalculator() {
  const [sex, setSex] = useState<CalorieSex>("male");
  const [age, setAge] = useState(30);
  const [heightIn, setHeightIn] = useState(70);
  const [weightLbs, setWeightLbs] = useState(180);
  const [activityMultiplier, setActivityMultiplier] = useState(1.55);
  const [goal, setGoal] = useState<CalorieGoal>("maintain");
  const [pace, setPace] = useState<CaloriePace>("moderate");

  const { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp } = useStagedReveal(CALC_STEPS);

  const result = calculateCalories({
    age,
    sex,
    heightIn,
    weightLbs,
    activityMultiplier,
    goal,
    pace,
  });

  const onGoalChange = (next: CalorieGoal) => {
    setGoal(next);
    if (revealState === "revealed") pulseCountUp();
  };

  const onPaceChange = (next: CaloriePace) => {
    setPace(next);
    if (revealState === "revealed") pulseCountUp();
  };

  const insights: Insight[] = [];
  if (goal === "lose") {
    insights.push({
      tone: "warning",
      text: `${Math.abs(result.dailyDeltaCalories)} kcal/day deficit projects ${Math.abs(result.weeklyWeightChangeLbs)} lb/week change using the 3,500 kcal rule.`,
    });
  } else if (goal === "gain") {
    insights.push({
      tone: "positive",
      text: `${result.dailyDeltaCalories} kcal/day surplus supports about ${result.weeklyWeightChangeLbs} lb/week gain before training quality and recovery effects.`,
    });
  } else {
    insights.push({
      tone: "neutral",
      text: `${result.targetCalories.toLocaleString()} kcal/day is your maintenance estimate at activity multiplier ${activityMultiplier.toFixed(3)}.`,
    });
  }

  insights.push({
    tone: "neutral",
    text: `${result.proteinGrams}g protein, ${result.carbsGrams}g carbs, ${result.fatGrams}g fat aligns your macro split to the ${GOAL_LABEL[goal].toLowerCase()} target.`,
  });

  if (result.calorieFloorApplied) {
    insights.push({
      tone: "warning",
      text: `Your calculated target fell below ${result.minCalories} kcal/day, so a minimum floor was applied to avoid an extreme intake plan.`,
    });
  }

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
                  {(["male", "female"] as CalorieSex[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSex(item)}
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
              <NumInput label="Age" value={age} onChange={setAge} min={16} max={90} step={1} />
            </div>

            <SectionLabel text="Body metrics" sub="Imperial units" />
            <div className="grid grid-cols-2 gap-3">
              <NumInput label="Height" value={heightIn} onChange={setHeightIn} min={48} max={84} step={1} suffix="in" />
              <NumInput label="Weight" value={weightLbs} onChange={setWeightLbs} min={70} max={450} step={1} suffix="lb" />
            </div>

            <SectionLabel text="Activity" sub="Multiplier applied to BMR" />
            <RangeSliderCard
              label="Activity multiplier"
              hint="1.2 sedentary, 1.375 light, 1.55 moderate, 1.725 very active, 1.9 extra active"
              value={activityMultiplier}
              min={1.2}
              max={1.9}
              step={0.025}
              unit="x"
              onChange={setActivityMultiplier}
            />

            <SectionLabel text="Goal" sub="Calorie target direction" />
            <div className="grid grid-cols-3 gap-2">
              {(["lose", "maintain", "gain"] as CalorieGoal[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onGoalChange(item)}
                  className={
                    "rounded-lg border px-3 py-2 text-xs font-bold uppercase tracking-wide transition " +
                    (goal === item
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                  }
                >
                  {GOAL_LABEL[item]}
                </button>
              ))}
            </div>

            <SectionLabel text="Pace" sub="How aggressive your target should be" />
            <div className="grid grid-cols-3 gap-2">
              {(["gentle", "moderate", "aggressive"] as CaloriePace[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPaceChange(item)}
                  className={
                    "rounded-lg border px-3 py-2 text-xs font-semibold transition " +
                    (pace === item
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                  }
                >
                  {PACE_LABEL[item]}
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
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Calculate calories"}
        </button>
      </div>

      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Set your profile and click Calculate"
                subMessage="Your BMR, maintenance calories, macro split, and activity impact will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Running your calorie model"
              />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow={`${GOAL_LABEL[goal]} · ${PACE_LABEL[pace]} pace`}
                primaryValue={result.targetCalories}
                primaryFormat={(v) => `${v.toLocaleString()}`}
                primaryUnit="kcal/day"
                accentColor={GOAL_ACCENT[goal]}
                note={
                  result.calorieFloorApplied
                    ? { text: `Safety floor applied at ${result.minCalories} kcal/day`, tone: "warning" as const }
                    : goal === "lose"
                      ? { text: `${result.dailyDeltaCalories} kcal/day vs maintenance`, tone: "warning" as const }
                      : { text: `+${result.dailyDeltaCalories} kcal/day vs maintenance`, tone: "positive" as const }
                }
                subStats={[
                  { label: "BMR", value: result.bmr, format: kcal, sub: "resting burn" },
                  { label: "TDEE", value: result.tdee, format: kcal, sub: "maintenance" },
                  {
                    label: "Weekly change",
                    value: Math.abs(result.weeklyWeightChangeLbs),
                    format: (v) => `${v} lb`,
                    sub: goal === "maintain" ? "estimated" : goal === "lose" ? "loss estimate" : "gain estimate",
                  },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Target calories vs activity level"
                subtitle="Same profile and goal, different activity multipliers"
                data={result.activityImpact.map((item) => ({ x: item.multiplier, y: item.targetCalories }))}
                xFormat={(v) => `${Number(v).toFixed(3)}x`}
                yFormat={(v) => `${v.toLocaleString()} kcal`}
                tooltipX={(v) => `${Number(v).toFixed(3)} activity`}
                tooltipY={(v) => `${v.toLocaleString()} kcal/day`}
                referenceValue={result.targetCalories}
                referenceLabel="Current target"
              />

              <BreakdownBarChart
                title="Macro calorie split"
                data={result.macroBreakdown.map((item) => ({
                  label: item.label,
                  amount: item.amount,
                  pct: item.pct,
                  fill: MACRO_COLOR_HEX[item.colorClass],
                }))}
                valueFormat={(v) => `${Math.round(v)} kcal`}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
