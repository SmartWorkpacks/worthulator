export type MaintenanceSex = "male" | "female";

export interface MaintenanceCalorieInputs {
  age: number;
  sex: MaintenanceSex;
  heightIn: number;
  weightLbs: number;
  activityMultiplier: number;
}

export interface ActivityMaintenancePoint {
  label: string;
  multiplier: number;
  calories: number;
}

export interface MaintenanceCalorieResult {
  bmr: number;
  maintenanceCalories: number; // TDEE at the chosen activity level
  activityMultiplier: number;
  mildCutCalories: number; // ~ -1 lb/week
  leanBulkCalories: number; // gentle surplus
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  macroBreakdown: { label: string; amount: number; pct: number; colorClass: string }[];
  activityImpact: ActivityMaintenancePoint[];
}

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;
const KCAL_PER_GRAM_PROTEIN = 4;
const KCAL_PER_GRAM_CARB = 4;
const KCAL_PER_GRAM_FAT = 9;

// A 500 kcal/day deficit ≈ 1 lb/week; a 300 kcal/day surplus is a common lean-gain pace.
const MILD_CUT_DELTA = 500;
const LEAN_BULK_DELTA = 300;

// Balanced maintenance split: ~0.75 g protein per lb, 30% of calories from fat, rest carbs.
const PROTEIN_PER_LB = 0.75;
const FAT_CALORIE_SHARE = 0.3;

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

export function calculateMaintenanceCalories(input: MaintenanceCalorieInputs): MaintenanceCalorieResult {
  const age = clamp(safeNum(input.age), 1, 120);
  const heightIn = clamp(safeNum(input.heightIn), 1, 120);
  const weightLbs = clamp(safeNum(input.weightLbs), 1, 1400);
  const activityMultiplier = clamp(safeNum(input.activityMultiplier, 1.55), 1.2, 1.9);

  const weightKg = weightLbs * LB_TO_KG;
  const heightCm = heightIn * IN_TO_CM;

  // Mifflin-St Jeor equation (1990), the standard resting energy estimate.
  const bmrRaw =
    input.sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const bmr = Math.max(0, bmrRaw);
  const maintenanceCalories = Math.max(0, bmr * activityMultiplier);

  // Floors used by consumer planning tools to avoid unsafe targets.
  const minCalories = input.sex === "male" ? 1500 : 1200;
  const mildCutCalories = Math.max(minCalories, maintenanceCalories - MILD_CUT_DELTA);
  const leanBulkCalories = maintenanceCalories + LEAN_BULK_DELTA;

  const proteinGrams = Math.max(0, weightLbs * PROTEIN_PER_LB);
  const fatCalories = Math.max(0, maintenanceCalories * FAT_CALORIE_SHARE);
  const fatGrams = fatCalories / KCAL_PER_GRAM_FAT;
  const proteinCalories = proteinGrams * KCAL_PER_GRAM_PROTEIN;
  const remainingCalories = Math.max(0, maintenanceCalories - proteinCalories - fatCalories);
  const carbsGrams = remainingCalories / KCAL_PER_GRAM_CARB;

  const macroBreakdownRaw = [
    { label: "Protein", amount: proteinCalories, colorClass: "bg-blue-400" },
    { label: "Carbs", amount: carbsGrams * KCAL_PER_GRAM_CARB, colorClass: "bg-emerald-400" },
    { label: "Fat", amount: fatGrams * KCAL_PER_GRAM_FAT, colorClass: "bg-amber-400" },
  ];
  const macroBreakdown = macroBreakdownRaw.map((item) => ({
    ...item,
    pct: maintenanceCalories > 0 ? Math.round((item.amount / maintenanceCalories) * 100) : 0,
  }));

  const activityImpact: ActivityMaintenancePoint[] = ACTIVITY_LEVELS.map((level) => ({
    label: level.label,
    multiplier: level.multiplier,
    calories: Math.round(bmr * level.multiplier),
  }));

  return {
    bmr: Math.round(bmr),
    maintenanceCalories: Math.round(maintenanceCalories),
    activityMultiplier,
    mildCutCalories: Math.round(mildCutCalories),
    leanBulkCalories: Math.round(leanBulkCalories),
    proteinGrams: Math.round(proteinGrams),
    carbsGrams: Math.round(carbsGrams),
    fatGrams: Math.round(fatGrams),
    macroBreakdown,
    activityImpact,
  };
}
