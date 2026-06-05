import { describe, expect, it } from "vitest";
import { calculateCalories, type CalorieInputs } from "./calorieEngine";

const base: CalorieInputs = {
  age: 30,
  sex: "male",
  heightIn: 70,
  weightLbs: 180,
  activityMultiplier: 1.55,
  goal: "maintain",
  pace: "moderate",
};

describe("calculateCalories", () => {
  it("matches Mifflin-St Jeor known-value baseline for male maintain", () => {
    const result = calculateCalories(base);
    expect(result.bmr).toBe(1783);
    expect(result.tdee).toBe(2763);
    expect(result.targetCalories).toBe(2763);
  });

  it("female baseline produces lower BMR than male at same stats", () => {
    const male = calculateCalories(base);
    const female = calculateCalories({ ...base, sex: "female" });
    expect(female.bmr).toBeLessThan(male.bmr);
  });

  it("aggressive loss target is lower than maintain target", () => {
    const maintain = calculateCalories({ ...base, goal: "maintain", pace: "moderate" });
    const loss = calculateCalories({ ...base, goal: "lose", pace: "aggressive" });
    expect(loss.targetCalories).toBeLessThan(maintain.targetCalories);
    expect(loss.dailyDeltaCalories).toBeLessThan(0);
  });

  it("aggressive gain target is higher than maintain target", () => {
    const maintain = calculateCalories({ ...base, goal: "maintain", pace: "moderate" });
    const gain = calculateCalories({ ...base, goal: "gain", pace: "aggressive" });
    expect(gain.targetCalories).toBeGreaterThan(maintain.targetCalories);
    expect(gain.dailyDeltaCalories).toBeGreaterThan(0);
  });

  it("applies calorie floor for very small female loss profile", () => {
    const result = calculateCalories({
      age: 45,
      sex: "female",
      heightIn: 60,
      weightLbs: 95,
      activityMultiplier: 1.2,
      goal: "lose",
      pace: "aggressive",
    });
    expect(result.calorieFloorApplied).toBe(true);
    expect(result.targetCalories).toBe(1200);
  });

  it("macro calories approximately sum to target calories", () => {
    const result = calculateCalories({ ...base, goal: "gain", pace: "moderate" });
    const sum = result.macroBreakdown.reduce((acc, item) => acc + item.amount, 0);
    expect(sum).toBeCloseTo(result.targetCalories, -1);
  });

  it("higher activity multiplier increases TDEE", () => {
    const low = calculateCalories({ ...base, activityMultiplier: 1.2 });
    const high = calculateCalories({ ...base, activityMultiplier: 1.9 });
    expect(high.tdee).toBeGreaterThan(low.tdee);
  });

  it("guards NaN and invalid inputs from producing non-finite values", () => {
    const result = calculateCalories({
      age: Number.NaN,
      sex: "male",
      heightIn: Number.NaN,
      weightLbs: Number.NaN,
      activityMultiplier: Number.NaN,
      goal: "maintain",
      pace: "moderate",
    });

    expect(Number.isFinite(result.bmr)).toBe(true);
    expect(Number.isFinite(result.tdee)).toBe(true);
    expect(Number.isFinite(result.targetCalories)).toBe(true);
    expect(result.targetCalories).toBeGreaterThan(0);
  });
});
