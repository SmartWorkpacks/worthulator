import { describe, it, expect } from "vitest";
import { calculateGpa, gpaToLetter, GpaInputs, MAX_GPA } from "./gpa";

const base: GpaInputs = {
  currentGpa: 3.0,
  creditsDone: 60,
  remainingCredits: 60,
  targetGpa: 3.5,
};

describe("core required-GPA math", () => {
  const r = calculateGpa(base);

  it("totalCredits = done + remaining", () => {
    expect(r.totalCredits).toBe(120);
  });

  it("banks current quality points (gpa × creditsDone)", () => {
    expect(r.currentQualityPoints).toBe(180);
  });

  it("target quality points = targetGpa × totalCredits", () => {
    expect(r.targetQualityPoints).toBe(420);
  });

  it("requiredGpa = (targetQP − currentQP) ÷ remaining", () => {
    // (420 − 180) / 60 = 4.0
    expect(r.requiredGpa).toBe(4.0);
    expect(r.feasible).toBe(1);
  });
});

describe("ceiling and floor", () => {
  it("maxAchievableGpa = all remaining at 4.0", () => {
    const r = calculateGpa(base);
    // (180 + 4×60) / 120 = 3.5
    expect(r.maxAchievableGpa).toBe(3.5);
  });

  it("minPossibleGpa = all remaining at 0.0", () => {
    const r = calculateGpa(base);
    // 180 / 120 = 1.5
    expect(r.minPossibleGpa).toBe(1.5);
  });

  it("when feasible, the required per-credit average is within the 4.0 ceiling", () => {
    const r = calculateGpa(base);
    expect(r.feasible).toBe(1);
    expect(r.requiredGpa).toBeLessThanOrEqual(MAX_GPA + 1e-9);
  });
});

describe("feasibility verdicts", () => {
  it("flags impossible targets (requiredGpa > 4.0)", () => {
    const r = calculateGpa({ currentGpa: 2.0, creditsDone: 90, remainingCredits: 30, targetGpa: 3.8 });
    expect(r.requiredGpa).toBeGreaterThan(MAX_GPA);
    expect(r.feasible).toBe(0);
  });

  it("flags already-locked targets (target below current floor)", () => {
    const r = calculateGpa({ currentGpa: 3.8, creditsDone: 100, remainingCredits: 20, targetGpa: 3.0 });
    expect(r.requiredGpa).toBeLessThanOrEqual(0);
    expect(r.alreadyLocked).toBe(1);
    expect(r.neededQualityPoints).toBe(0);
  });
});

describe("monotonicity", () => {
  it("higher target ⇒ higher required GPA", () => {
    const lo = calculateGpa({ ...base, targetGpa: 3.2 });
    const hi = calculateGpa({ ...base, targetGpa: 3.8 });
    expect(hi.requiredGpa).toBeGreaterThan(lo.requiredGpa);
  });

  it("more remaining credits ⇒ easier (lower) required GPA for same gap", () => {
    const few  = calculateGpa({ currentGpa: 3.0, creditsDone: 60, remainingCredits: 15, targetGpa: 3.4 });
    const many = calculateGpa({ currentGpa: 3.0, creditsDone: 60, remainingCredits: 60, targetGpa: 3.4 });
    expect(many.requiredGpa).toBeLessThan(few.requiredGpa);
  });

  it("gpaGap = target − current", () => {
    expect(calculateGpa(base).gpaGap).toBe(0.5);
  });
});

describe("edge cases", () => {
  it("clamps GPAs into the 0–4 range", () => {
    const r = calculateGpa({ currentGpa: 9, creditsDone: 30, remainingCredits: 30, targetGpa: 9 });
    expect(r.currentQualityPoints).toBe(4 * 30);
  });

  it("guards remainingCredits ≥ 1 (no divide by zero)", () => {
    const r = calculateGpa({ ...base, remainingCredits: 0 });
    expect(Number.isFinite(r.requiredGpa)).toBe(true);
  });

  it("handles a fresh student (0 credits done)", () => {
    const r = calculateGpa({ currentGpa: 0, creditsDone: 0, remainingCredits: 30, targetGpa: 3.5 });
    expect(r.requiredGpa).toBe(3.5);
    expect(r.currentQualityPoints).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateGpa({ currentGpa: 0, creditsDone: 0, remainingCredits: 0, targetGpa: 0 });
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });
});

describe("gpaToLetter", () => {
  it("maps boundary values to letters", () => {
    expect(gpaToLetter(4.0)).toBe("A");
    expect(gpaToLetter(3.6)).toBe("A−");
    expect(gpaToLetter(3.0)).toBe("B");
    expect(gpaToLetter(2.0)).toBe("C");
    expect(gpaToLetter(0.5)).toBe("F");
  });
});
