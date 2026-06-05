import { describe, it, expect } from "vitest";
import { calculateMealPrep, TOTAL_WEEKLY_MEALS, type MealPrepData } from "@/calculations/lifestyle/mealPrep";

// Fixed benchmark fixture so expectations are exact and source-independent.
// homeMealCost = groceryMonthly / 60 = 360 / 60 = $6.00
const DATA: MealPrepData = {
  restaurantMeal: 20,
  fastFoodCombo:  10,
  deliveryMeal:   30,
  groceryMonthly: 360,
};

describe("calculateMealPrep — conserved-total constraints", () => {
  it("derives takeout count as 21 minus meals cooked (cook 7 -> 14 outsourced)", () => {
    const out = calculateMealPrep({ meals: 7, extraMeals: 1, diningStyle: "takeout" }, DATA);
    expect(out.mealsOutsourced).toBe(14);
  });

  it("keeps cooked + outsourced equal to 21 across the whole range", () => {
    for (let meals = 0; meals <= TOTAL_WEEKLY_MEALS; meals++) {
      const out = calculateMealPrep({ meals, extraMeals: 0, diningStyle: "takeout" }, DATA);
      expect(meals + out.mealsOutsourced).toBe(TOTAL_WEEKLY_MEALS);
    }
  });

  it("caps extra meals at what is left in the week (cook 7, ask for 20 -> 14)", () => {
    const out = calculateMealPrep({ meals: 7, extraMeals: 20, diningStyle: "takeout" }, DATA);
    expect(out.extraMeals).toBe(14);
    expect(out.extraMeals).toBeLessThanOrEqual(out.mealsOutsourced);
  });

  it("never lets extra meals push the total past 21", () => {
    for (let meals = 0; meals <= TOTAL_WEEKLY_MEALS; meals++) {
      const out = calculateMealPrep({ meals, extraMeals: 21, diningStyle: "mixed" }, DATA);
      expect(meals + out.extraMeals).toBeLessThanOrEqual(TOTAL_WEEKLY_MEALS);
    }
  });
});

describe("calculateMealPrep — blended takeout cost", () => {
  it("blends the selected dining styles as a simple average", () => {
    // restaurant ($20) + fastfood ($10) -> average $15
    const out = calculateMealPrep({ meals: 1, extraMeals: 0, diningStyle: "restaurant,fastfood" }, DATA);
    expect(out.takeoutCostDerived).toBe(15);
  });

  it("computes the derived 'takeout' style from restaurant and fast food", () => {
    // round((20*0.8 + 10) / 2) = round(26/2) = 13
    const out = calculateMealPrep({ meals: 1, extraMeals: 0, diningStyle: "takeout" }, DATA);
    expect(out.takeoutCostDerived).toBe(13);
  });
});

describe("calculateMealPrep — savings math", () => {
  it("computes weekly/yearly savings from per-meal delta", () => {
    // takeout $15, home $6 -> saving/meal $9; 7 meals -> $63/wk -> $3,276/yr
    const out = calculateMealPrep({ meals: 7, extraMeals: 14, diningStyle: "restaurant,fastfood" }, DATA);
    expect(out.costPerMeal).toBe(6);
    expect(out.weeklySavings).toBe(63);
    expect(out.yearlySavings).toBe(3276);
    expect(out.extraWeeklySavings).toBe(126);   // 14 * 9
    expect(out.extraYearlySavings).toBe(6552);  // 126 * 52
  });

  it("projects the 10-year invested value from yearly savings", () => {
    const out = calculateMealPrep({ meals: 7, extraMeals: 0, diningStyle: "restaurant,fastfood" }, DATA);
    expect(out.tenYearIfInvested).toBeCloseTo(out.yearlySavings * 13.8164, 1);
  });
});
