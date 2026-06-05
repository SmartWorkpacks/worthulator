import { describe, expect, it } from "vitest";
import {
  calculateMaintenanceCalories,
  type MaintenanceCalorieInputs,
} from "./maintenanceCalorieEngine";

const BASE: MaintenanceCalorieInputs = {
  age: 30,
  sex: "male",
  heightIn: 70,
  weightLbs: 175,
  activityMultiplier: 1.55,
};

describe("calculateMaintenanceCalories", () => {
  it("computes BMR and maintenance for a known profile", () => {
    const r = calculateMaintenanceCalories(BASE);
    // Mifflin-St Jeor: male, 79.38 kg, 177.8 cm, 30 yr ≈ 1760 BMR.
    expect(r.bmr).toBeCloseTo(1760, -1);
    // Maintenance = BMR × 1.55 ≈ 2728.
    expect(r.maintenanceCalories).toBeCloseTo(2728, -1);
  });

  it("ties maintenance to BMR × activity multiplier", () => {
    const r = calculateMaintenanceCalories(BASE);
    expect(r.maintenanceCalories).toBeCloseTo(r.bmr * 1.55, 0);
  });

  it("derives cut and bulk targets around maintenance", () => {
    const r = calculateMaintenanceCalories(BASE);
    expect(r.mildCutCalories).toBe(r.maintenanceCalories - 500);
    expect(r.leanBulkCalories).toBe(r.maintenanceCalories + 300);
  });

  it("increases maintenance monotonically with activity level", () => {
    const r = calculateMaintenanceCalories(BASE);
    for (let i = 1; i < r.activityImpact.length; i++) {
      expect(r.activityImpact[i].calories).toBeGreaterThan(r.activityImpact[i - 1].calories);
    }
  });

  it("splits macros that sum back to maintenance calories", () => {
    const r = calculateMaintenanceCalories(BASE);
    const fromMacros = r.proteinGrams * 4 + r.carbsGrams * 4 + r.fatGrams * 9;
    expect(fromMacros).toBeCloseTo(r.maintenanceCalories, -2);
    const pctSum = r.macroBreakdown.reduce((acc, m) => acc + m.pct, 0);
    expect(pctSum).toBeGreaterThan(95);
    expect(pctSum).toBeLessThan(105);
  });

  it("gives a lower BMR for female than male with identical stats", () => {
    const male = calculateMaintenanceCalories({ ...BASE, sex: "male" });
    const female = calculateMaintenanceCalories({ ...BASE, sex: "female" });
    expect(female.bmr).toBeLessThan(male.bmr);
    // The Mifflin constant differs by 166 kcal.
    expect(male.bmr - female.bmr).toBeCloseTo(166, 0);
  });

  it("scales protein with bodyweight", () => {
    const light = calculateMaintenanceCalories({ ...BASE, weightLbs: 140 });
    const heavy = calculateMaintenanceCalories({ ...BASE, weightLbs: 220 });
    expect(heavy.proteinGrams).toBeGreaterThan(light.proteinGrams);
  });

  it("guards NaN inputs from producing non-finite values", () => {
    const r = calculateMaintenanceCalories({
      age: Number.NaN,
      sex: "male",
      heightIn: Number.NaN,
      weightLbs: Number.NaN,
      activityMultiplier: Number.NaN,
    });
    expect(Number.isFinite(r.bmr)).toBe(true);
    expect(Number.isFinite(r.maintenanceCalories)).toBe(true);
    expect(r.maintenanceCalories).toBeGreaterThanOrEqual(0);
  });
});
