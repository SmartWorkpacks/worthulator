export type CalorieSex = "male" | "female";
export type CalorieGoal = "lose" | "maintain" | "gain";
export type CaloriePace = "gentle" | "moderate" | "aggressive";

export interface CalorieInputs {
  age: number;
  sex: CalorieSex;
  heightIn: number;
  weightLbs: number;
  activityMultiplier: number;
  goal: CalorieGoal;
  pace: CaloriePace;
}

export interface CalorieResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  dailyDeltaCalories: number;
  weeklyWeightChangeLbs: number;
  calorieFloorApplied: boolean;
  minCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  macroBreakdown: { label: string; amount: number; pct: number; colorClass: string }[];
  goalTargets: { goal: CalorieGoal; calories: number }[];
  activityImpact: { label: string; multiplier: number; targetCalories: number }[];
}

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;
const KCAL_PER_GRAM_PROTEIN = 4;
const KCAL_PER_GRAM_CARB = 4;
const KCAL_PER_GRAM_FAT = 9;

const CALORIES_PER_POUND_FAT = 3500;

const GOAL_FACTOR: Record<CalorieGoal, Record<CaloriePace, number>> = {
  lose: { gentle: -0.1, moderate: -0.2, aggressive: -0.25 },
  maintain: { gentle: 0, moderate: 0, aggressive: 0 },
  gain: { gentle: 0.08, moderate: 0.12, aggressive: 0.15 },
};

const PROTEIN_PER_LB: Record<CalorieGoal, number> = {
  lose: 0.9,
  maintain: 0.75,
  gain: 0.82,
};

const FAT_CALORIE_SHARE: Record<CalorieGoal, number> = {
  lose: 0.28,
  maintain: 0.3,
  gain: 0.27,
};

const ACTIVITY_LEVELS: { label: string; multiplier: number }[] = [
  { label: "Sedentary", multiplier: 1.2 },
  { label: "Light", multiplier: 1.375 },
  { label: "Moderate", multiplier: 1.55 },
  { label: "Very active", multiplier: 1.725 },
  { label: "Extra active", multiplier: 1.9 },
];

function safeNum(n: number, fallback = 0) {
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function calculateCalories(input: CalorieInputs): CalorieResult {
  const age = clamp(safeNum(input.age), 1, 120);
  const heightIn = clamp(safeNum(input.heightIn), 1, 120);
  const weightLbs = clamp(safeNum(input.weightLbs), 1, 1400);
  const activityMultiplier = clamp(safeNum(input.activityMultiplier, 1.55), 1.2, 1.9);

  const weightKg = weightLbs * LB_TO_KG;
  const heightCm = heightIn * IN_TO_CM;

  // Mifflin-St Jeor equation (1990) is commonly used for resting energy estimates.
  const bmrRaw =
    input.sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const bmr = Math.max(0, bmrRaw);
  const tdee = Math.max(0, bmr * activityMultiplier);

  const calorieDeltaPct = GOAL_FACTOR[input.goal][input.pace];
  const rawTargetCalories = tdee * (1 + calorieDeltaPct);

  // Common clinical guard rails used in consumer planning tools.
  const minCalories = input.sex === "male" ? 1500 : 1200;
  const calorieFloorApplied = rawTargetCalories < minCalories;
  const targetCalories = Math.max(minCalories, rawTargetCalories);

  const dailyDeltaCalories = targetCalories - tdee;
  const weeklyWeightChangeLbs = (dailyDeltaCalories * 7) / CALORIES_PER_POUND_FAT;

  const proteinGrams = Math.max(0, weightLbs * PROTEIN_PER_LB[input.goal]);
  const fatCalories = Math.max(0, targetCalories * FAT_CALORIE_SHARE[input.goal]);
  const fatGrams = fatCalories / KCAL_PER_GRAM_FAT;
  const proteinCalories = proteinGrams * KCAL_PER_GRAM_PROTEIN;
  const remainingCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
  const carbsGrams = remainingCalories / KCAL_PER_GRAM_CARB;

  const macroBreakdownRaw = [
    { label: "Protein", amount: proteinCalories, colorClass: "bg-blue-400" },
    { label: "Carbs", amount: carbsGrams * KCAL_PER_GRAM_CARB, colorClass: "bg-emerald-400" },
    { label: "Fat", amount: fatGrams * KCAL_PER_GRAM_FAT, colorClass: "bg-amber-400" },
  ];

  const macroBreakdown = macroBreakdownRaw.map((item) => ({
    ...item,
    pct: targetCalories > 0 ? Math.round((item.amount / targetCalories) * 100) : 0,
  }));

  const goalList: CalorieGoal[] = ["lose", "maintain", "gain"];
  const goalTargets: { goal: CalorieGoal; calories: number }[] = goalList.map((goal) => {
    const pct = GOAL_FACTOR[goal][input.pace];
    const raw = tdee * (1 + pct);
    return { goal, calories: Math.round(Math.max(minCalories, raw)) };
  });

  const activityImpact = ACTIVITY_LEVELS.map((level) => {
    const levelTdee = bmr * level.multiplier;
    const rawTarget = levelTdee * (1 + calorieDeltaPct);
    return {
      label: level.label,
      multiplier: level.multiplier,
      targetCalories: Math.round(Math.max(minCalories, rawTarget)),
    };
  });

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    dailyDeltaCalories: Math.round(dailyDeltaCalories),
    weeklyWeightChangeLbs: Math.round(weeklyWeightChangeLbs * 100) / 100,
    calorieFloorApplied,
    minCalories,
    proteinGrams: Math.round(proteinGrams),
    carbsGrams: Math.round(carbsGrams),
    fatGrams: Math.round(fatGrams),
    macroBreakdown,
    goalTargets,
    activityImpact,
  };
}
