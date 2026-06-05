// ─── Meal Prep Savings calculation module ────────────────────────────────────
// Pure functions only. No UI, no data fetching, no module-level state.
// Regional food costs are injected via `data` (from getRegionalBenchmarks),
// keeping this module deterministic and unit-testable.
//
// QUIET-REALISM CONSTRAINTS (verified by tests):
//   - A week has a fixed TOTAL_WEEKLY_MEALS = 21 meal slots.
//   - Meals you do not cook are eaten out: mealsOutsourced = max(0, 21 - meals).
//   - Extra meals you could add are capped by what is left: extraMeals is
//     clamped to mealsOutsourced, so cooking 7 leaves at most 14 to add.
//   - Takeout cost is the BLENDED AVERAGE of the dining styles actually
//     selected, never a single flat assumption.

import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

/** Total meal slots in a week — the conserved total all counts derive from. */
export const TOTAL_WEEKLY_MEALS = 21;

/**
 * 10-year future value factor for $1/yr invested at 7% (annual compounding,
 * end-of-year contributions): ((1.07^10 − 1) / 0.07) ≈ 13.8164.
 * Kept as a named constant so the meal-prep projection stays in lockstep
 * with the future-value module's assumptions.
 */
export const TEN_YEAR_FV_FACTOR = 13.8164;

/** Regional food benchmarks required by the meal-prep model (USD). */
export interface MealPrepData {
  /** Inexpensive sit-down restaurant meal, 1 person */
  restaurantMeal: number;
  /** Fast food combo meal */
  fastFoodCombo: number;
  /** Delivery app meal including fees & tip */
  deliveryMeal: number;
  /** Monthly grocery budget for 1 person */
  groceryMonthly: number;
}

/**
 * Blends the per-style dining costs into one average takeout cost for the
 * styles the user selected. Unknown styles fall back to $15.
 */
function blendedTakeoutCost(diningStyleRaw: string, data: MealPrepData): number {
  const diningCosts: Record<string, number> = {
    fastfood:    data.fastFoodCombo,
    delivery:    data.deliveryMeal,
    restaurant:  data.restaurantMeal,
    takeout:     Math.round((data.restaurantMeal * 0.8 + data.fastFoodCombo) / 2 * 100) / 100,
    convenience: Math.round(data.fastFoodCombo * 1.1 * 100) / 100,
    mixed:       Math.round((data.restaurantMeal + data.fastFoodCombo) / 2 * 100) / 100,
  };
  const styles = String(diningStyleRaw ?? "takeout").split(",").filter(Boolean);
  const costs = styles.map((s) => diningCosts[s] ?? 15);
  const safe = costs.length > 0 ? costs : [15];
  return Math.round((safe.reduce((a, b) => a + b, 0) / safe.length) * 100) / 100;
}

/**
 * Meal-prep savings model.
 * Compares the blended cost of eating out against the per-meal grocery cost,
 * then projects current savings and the marginal savings of cooking N more
 * meals per week (capped by the meals not already cooked).
 */
export function calculateMealPrep(
  inputs: CalculatorValues,
  data: MealPrepData,
): CalculatorOutputs {
  const meals = Math.max(0, Math.min(TOTAL_WEEKLY_MEALS, Number(inputs.meals ?? 10)));

  if (!isFinite(meals)) {
    return {
      costPerMeal: 0, weeklySavings: 0, yearlySavings: 0, tenYearIfInvested: 0,
      weeklyEatingOutCost: 0, monthlyFoodCost: 0, takeoutCostDerived: 0,
      mealsOutsourced: 0, extraMeals: 0, extraWeeklySavings: 0, extraYearlySavings: 0,
    };
  }

  const takeoutCostDerived = blendedTakeoutCost(String(inputs.diningStyle ?? "takeout"), data);
  const homeMealCost  = Math.round(data.groceryMonthly / 60 * 100) / 100;
  const savingPerMeal = takeoutCostDerived - homeMealCost;

  const weeklySavings = meals * savingPerMeal;
  const yearlySavings = Math.round(weeklySavings * 52 * 100) / 100;
  const tenYearIfInvested   = Math.round(yearlySavings * TEN_YEAR_FV_FACTOR * 100) / 100;
  const weeklyEatingOutCost = Math.round(meals * takeoutCostDerived * 100) / 100;
  const monthlyFoodCost     = Math.round(meals * homeMealCost * (52 / 12) * 100) / 100;

  // Conserved-total constraints: meals you don't cook are eaten out, and the
  // extra meals you could add can never exceed what's left in the 21-slot week.
  const mealsOutsourced    = Math.max(0, TOTAL_WEEKLY_MEALS - meals);
  const extraMeals         = Math.max(0, Math.min(Number(inputs.extraMeals ?? 1), mealsOutsourced));
  const extraWeeklySavings = Math.round(extraMeals * savingPerMeal * 100) / 100;
  const extraYearlySavings = Math.round(extraWeeklySavings * 52 * 100) / 100;

  return {
    costPerMeal: homeMealCost,
    weeklySavings: Math.round(weeklySavings * 100) / 100,
    yearlySavings,
    tenYearIfInvested,
    weeklyEatingOutCost,
    monthlyFoodCost,
    takeoutCostDerived,
    mealsOutsourced,
    extraMeals,
    extraWeeklySavings,
    extraYearlySavings,
  };
}
