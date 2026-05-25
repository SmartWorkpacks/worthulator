import type { Insight } from "../index";
import type { InsightVisualization } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MealPrepInputs {
  meals:         number; // meals cooked per week
  takeoutCost:   number; // derived dining baseline cost per meal — already regional ($)
  diningStyle?:  string; // "fastfood" | "delivery" | "restaurant" | "takeout" | "convenience" | "mixed"
  diningRegion?: string; // state name or "National"
  extraMeals?:   number; // additional meals to model for incremental insight
}

interface MealPrepOutputs {
  costPerMeal?:        number; // $/meal after prep
  weeklySavings?:      number; // $/week vs takeout
  yearlySavings?:      number; // $/year
  tenYearIfInvested?:  number; // FV annuity @ 7% / 10yr
  monthlyFoodCost?:    number; // weekly grocery × 52/12
  mealsOutsourced?:    number; // 21 - meals — remaining outsourced per week
  extraWeeklySavings?: number; // savings from extraMeals more per week
  extraYearlySavings?: number; // annual version
}

// ─── Labels ───────────────────────────────────────────────────────────────────

const DINING_STYLE_LABEL: Record<string, string> = {
  fastfood:    "fast food",
  delivery:    "delivery",
  restaurant:  "restaurant",
  takeout:     "takeout",
  convenience: "convenience",
  mixed:       "dining out",
};

const REGION_LABEL: Record<string, string> = {
  National:  "US avg",
  // State names map to themselves — handled dynamically below
};

// ─── Generator ───────────────────────────────────────────────────────────────

export function mealPrepInsights(
  inputs:  MealPrepInputs,
  outputs: MealPrepOutputs,
): Insight[] {
  const results: Insight[] = [];

  const costPerMeal     = outputs.costPerMeal       ?? 0;
  const weeklySavings   = outputs.weeklySavings     ?? 0;
  const yearlySavings   = outputs.yearlySavings     ?? 0;
  const tenYear         = outputs.tenYearIfInvested ?? 0;

  const meals       = Number(inputs.meals)       || 10;
  const takeoutCost = Number(inputs.takeoutCost) || 15;

  // Regional context — takeoutCost is already the state-adjusted value from calculate()
  const diningStyle  = inputs.diningStyle  ?? "takeout";
  const diningRegion = inputs.diningRegion ?? "National";
  // Handle multi-select: "delivery,restaurant" → "delivery & restaurant"
  const styleLabel = diningStyle
    .split(",")
    .filter(Boolean)
    .map((s) => DINING_STYLE_LABEL[s.trim()] ?? "dining out")
    .join(" & ");

  // Benchmark label: "California fast food" or "US avg fast food"
  const regionPrefix   = (diningRegion === "National" || diningRegion === "national")
    ? "US avg"
    : diningRegion;
  const benchmarkLabel = `${regionPrefix} ${styleLabel}`;

  if (costPerMeal <= 0) return results;

  const savingPerMeal    = takeoutCost - costPerMeal;
  const annualVsBaseline = Math.round(savingPerMeal * meals * 52);

  const extraMealsCount    = Number(inputs.extraMeals ?? 1);
  const mealsOutsourced    = outputs.mealsOutsourced ?? Math.max(0, 21 - meals);
  const extraWeeklySavings = outputs.extraWeeklySavings ?? 0;
  const extraYearlySavings = outputs.extraYearlySavings ?? 0;

  // ── 1. Incremental Habit Gain ── hero emotional hook ─────────────────────
  // "I'm already doing okay… but one small improvement changes the picture."
  if (extraMealsCount > 0 && extraYearlySavings > 0 && mealsOutsourced > 0) {
    results.push({
      id:       "meal-prep.incremental-habit",
      severity: "positive",
      category: "habit",
      title:    `Cooking just ${extraMealsCount} more meal${extraMealsCount !== 1 ? "s" : ""}/week could save you another $${extraYearlySavings.toLocaleString()}/year.`,
      body:     `Right now, ${mealsOutsourced} of your 21 weekly meals are still somebody else's to cook — and yours to pay for. Swap just ${extraMealsCount} of them and you keep $${extraWeeklySavings.toFixed(2)} this week, $${extraYearlySavings.toLocaleString()} over the year. ${extraMealsCount === 1 ? "One meal. That's the whole ask." : "Small shifts. Real money."}`,
      visualization: {
        type:   "delta-card",
        before: { label: "Currently saving",             value: `$${yearlySavings.toLocaleString()}/yr` },
        after:  { label: `+${extraMealsCount} meals/wk`, value: `$${(yearlySavings + extraYearlySavings).toLocaleString()}/yr` },
        delta:  { label: "Extra savings",                value: `+$${extraYearlySavings.toLocaleString()}`, positive: true },
      } satisfies InsightVisualization,
    });
  }

  // ── 2. vs Your Dining Lifestyle Benchmark ── context ─────────────────────
  results.push({
    id:       "meal-prep.dining-baseline-benchmark",
    severity: savingPerMeal > 0 ? "positive" : "neutral",
    category: "comparison",
    title:
      savingPerMeal > 0
        ? `You're already saving $${savingPerMeal.toFixed(2)} every single meal.`
        : `Your prep cost is close to eating out — not saving much yet.`,
    body:
      savingPerMeal > 0
        ? `Every time you cook instead of ordering ${styleLabel} (${regionPrefix}), you're pocketing $${savingPerMeal.toFixed(2)}. At ${meals} meals a week, that's $${Math.round(meals * takeoutCost)}/week you'd be handing over — vs the $${Math.round(meals * costPerMeal)} it actually costs you. The gap over a year: $${annualVsBaseline.toLocaleString()}.`
        : `Once you're under $6/meal, the savings stack fast. Bulk basics — eggs, rice, lentils, frozen veg — can get you to $4–5/meal without sacrificing anything.`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      costPerMeal,
      userLabel:      "Your meal",
      benchmarkValue: takeoutCost,
      benchmarkLabel,
      format:         "currency",
    } satisfies InsightVisualization,
  });

  // ── Early exit if no savings ──────────────────────────────────────────────
  if (weeklySavings <= 0) return results;

  // ── 3. 10-Year Investment Projection ── visual: projection-line ───────────
  if (tenYear > 0) {
    const r = 0.07;
    const investPoints = [1, 2, 3, 5, 7, 10].map((yr) => ({
      label: `Yr ${yr}`,
      value: Math.round(yearlySavings * ((Math.pow(1 + r, yr) - 1) / r)),
    }));

    results.push({
      id:       "meal-prep.ten-year-invested",
      severity: "positive",
      category: "investment",
      title:    `If you invested this instead, you'd have $${tenYear.toLocaleString()} in 10 years.`,
      body:     `$${yearlySavings.toLocaleString()}/year invested at 7% doesn't grow in a straight line — it accelerates. The last 3 years of that curve add more than the first 6 combined.`,
      visualization: {
        type:   "projection-line",
        points: investPoints,
        format: "currency",
        yLabel: "Portfolio value",
        color:  "#10b981",
      } satisfies InsightVisualization,
    });
  }

  // ── 4. Hours of Work Freed ── validation ─────────────────────────────────
  const usMedianHourlyWage = 29.76;
  const hoursFreed  = Math.round(yearlySavings / usMedianHourlyWage);
  const weeksFreed  = Math.round(hoursFreed / 40 * 10) / 10;
  const tenYrWeeks  = Math.round(hoursFreed * 10 / 40);

  results.push({
    id:       "meal-prep.hours-freed",
    severity: "positive",
    category: "impact",
    title:    `That's ${weeksFreed} work weeks of income you'll never have to earn — just from cooking at home.`,
    body:     `$${yearlySavings.toLocaleString()}/year converts to ${hoursFreed} hours at the US median wage. Keep this habit for 10 years and you've effectively pre-paid ${tenYrWeeks} weeks of your life back.`,
    visualization: {
      type:   "delta-card",
      before: { label: "Annual savings",   value: `$${yearlySavings.toLocaleString()}` },
      after:  { label: "Hours freed / yr", value: `${hoursFreed} hrs` },
      delta:  { label: "Work weeks saved", value: `${weeksFreed} wks`, positive: true },
    } satisfies InsightVisualization,
  });

  return results;
}