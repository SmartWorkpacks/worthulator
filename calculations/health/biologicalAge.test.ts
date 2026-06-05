import { describe, it, expect } from "vitest";
import { calculateBiologicalAge } from "./biologicalAge";

describe("calculateBiologicalAge", () => {
  const healthy = { age: 35, sleep: 8, exercise: 5, bmi: 22, smoker: false };

  it("a healthy profile has no adjustment", () => {
    const r = calculateBiologicalAge(healthy);
    expect(r.biologicalAge).toBe(35);
    expect(r.ageDelta).toBe(0);
    expect(r.riskFactorCount).toBe(0);
    expect(r.riskScore).toBe(0);
  });

  it("short sleep adds 5 years", () => {
    const r = calculateBiologicalAge({ ...healthy, sleep: 5 });
    expect(r.ageDelta).toBe(5);
  });

  it("low exercise adds 4 years", () => {
    const r = calculateBiologicalAge({ ...healthy, exercise: 1 });
    expect(r.ageDelta).toBe(4);
  });

  it("smoking adds 8 years", () => {
    const r = calculateBiologicalAge({ ...healthy, smoker: true });
    expect(r.ageDelta).toBe(8);
  });

  it("high BMI adds 6 years", () => {
    const r = calculateBiologicalAge({ ...healthy, bmi: 32 });
    expect(r.ageDelta).toBe(6);
  });

  it("penalties stack across factors", () => {
    const r = calculateBiologicalAge({ age: 40, sleep: 5, exercise: 1, bmi: 33, smoker: true });
    expect(r.ageDelta).toBe(5 + 4 + 8 + 6);
    expect(r.biologicalAge).toBe(40 + 23);
    expect(r.riskFactorCount).toBe(4);
  });

  it("risk score is 10× the penalty, capped at 100", () => {
    const r = calculateBiologicalAge({ age: 40, sleep: 5, exercise: 1, bmi: 33, smoker: true });
    expect(r.riskScore).toBe(100);
  });

  it("a single factor scores 40-50 on the risk scale", () => {
    const r = calculateBiologicalAge({ ...healthy, smoker: true });
    expect(r.riskScore).toBe(80);
  });

  it("BMI exactly 30 is not penalised", () => {
    const r = calculateBiologicalAge({ ...healthy, bmi: 30 });
    expect(r.ageDelta).toBe(0);
  });

  it("sleep exactly 6 is not penalised", () => {
    const r = calculateBiologicalAge({ ...healthy, sleep: 6 });
    expect(r.ageDelta).toBe(0);
  });

  it("exercise exactly 2 is not penalised", () => {
    const r = calculateBiologicalAge({ ...healthy, exercise: 2 });
    expect(r.ageDelta).toBe(0);
  });

  it("improvement potential equals the total penalty", () => {
    const r = calculateBiologicalAge({ ...healthy, sleep: 5, smoker: true });
    expect(r.improvementPotential).toBe(r.ageDelta);
  });

  it("biological age is never below chronological age", () => {
    const r = calculateBiologicalAge({ ...healthy, sleep: 5, exercise: 0, bmi: 35, smoker: true });
    expect(r.biologicalAge).toBeGreaterThanOrEqual(35);
  });
});
