import { describe, it, expect } from "vitest";
import {
  calculatePregnancy,
  PREGNANCY_DAYS,
  GESTATION_FROM_CONCEPTION,
  type PregnancyInputs,
} from "./pregnancyEngine";

const base: PregnancyInputs = {
  method: "lmp",
  referenceDate: "2025-01-01",
  cycleLength: 28,
  ultrasoundWeeks: 0,
  ultrasoundDays: 0,
  asOfDate: "2025-06-01",
};

describe("calculatePregnancy — LMP method (Naegele's rule)", () => {
  it("LMP + 280 days gives the due date and LMP + 14 the conception", () => {
    const r = calculatePregnancy({ ...base, referenceDate: "2025-01-01" });
    expect(r.valid).toBe(true);
    expect(r.lmpISO).toBe("2025-01-01");
    expect(r.dueDateISO).toBe("2025-10-08"); // 2025-01-01 + 280d
    expect(r.conceptionISO).toBe("2025-01-15"); // LMP + 14
  });

  it("a longer cycle pushes the due date later by the extra days", () => {
    const r28 = calculatePregnancy({ ...base, cycleLength: 28 });
    const r35 = calculatePregnancy({ ...base, cycleLength: 35 });
    expect(r28.dueDateISO).toBe("2025-10-08");
    expect(r35.dueDateISO).toBe("2025-10-15"); // +7 days
  });

  it("clamps an out-of-range cycle length instead of returning NaN", () => {
    const r = calculatePregnancy({ ...base, cycleLength: 999 });
    expect(r.valid).toBe(true);
    expect(Number.isFinite(r.daysRemaining)).toBe(true);
    // cycle clamped to 45 ⇒ due = LMP + 252 + 45 = LMP + 297
    expect(r.dueDateISO).toBe("2025-10-25");
  });
});

describe("calculatePregnancy — other input methods", () => {
  it("conception method: due = conception + 266, LMP = conception − 14", () => {
    const r = calculatePregnancy({ ...base, method: "conception", referenceDate: "2025-01-15" });
    expect(r.conceptionISO).toBe("2025-01-15");
    expect(r.lmpISO).toBe("2025-01-01");
    expect(r.dueDateISO).toBe("2025-10-08");
  });

  it("dueDate method: works backwards to LMP and conception", () => {
    const r = calculatePregnancy({ ...base, method: "dueDate", referenceDate: "2025-10-08" });
    expect(r.dueDateISO).toBe("2025-10-08");
    expect(r.lmpISO).toBe("2025-01-01"); // due − 280
    expect(r.conceptionISO).toBe("2025-01-15"); // due − 266
  });

  it("ultrasound method: GA at scan sets the LMP and due date", () => {
    const r = calculatePregnancy({
      ...base,
      method: "ultrasound",
      referenceDate: "2025-06-01",
      ultrasoundWeeks: 12,
      ultrasoundDays: 3,
    });
    expect(r.lmpISO).toBe("2025-03-06"); // scan − 87 days
    expect(r.dueDateISO).toBe("2025-12-11"); // LMP + 280
  });
});

describe("calculatePregnancy — invariants", () => {
  it("due = LMP + 280 and conception = due − 266 across every method", () => {
    const cases: PregnancyInputs[] = [
      { ...base, method: "lmp", referenceDate: "2025-02-10" },
      { ...base, method: "conception", referenceDate: "2025-03-20" },
      { ...base, method: "dueDate", referenceDate: "2025-11-30" },
      { ...base, method: "ultrasound", referenceDate: "2025-07-15", ultrasoundWeeks: 8, ultrasoundDays: 0 },
    ];
    for (const c of cases) {
      const r = calculatePregnancy(c);
      const lmp = Date.parse(r.lmpISO);
      const due = Date.parse(r.dueDateISO);
      const con = Date.parse(r.conceptionISO);
      expect(Math.round((due - lmp) / 86_400_000)).toBe(PREGNANCY_DAYS);
      expect(Math.round((due - con) / 86_400_000)).toBe(GESTATION_FROM_CONCEPTION);
    }
  });

  it("milestone dates are strictly increasing and progress stays within 0–100", () => {
    const r = calculatePregnancy(base);
    for (let i = 1; i < r.milestones.length; i++) {
      expect(Date.parse(r.milestones[i].iso)).toBeGreaterThan(Date.parse(r.milestones[i - 1].iso));
    }
    expect(r.progressPct).toBeGreaterThanOrEqual(0);
    expect(r.progressPct).toBeLessThanOrEqual(100);
  });
});

describe("calculatePregnancy — gestational age, trimesters & overdue", () => {
  it("computes weeks+days, trimester and progress for a mid-pregnancy date", () => {
    const r = calculatePregnancy({ ...base, referenceDate: "2025-01-01", asOfDate: "2025-06-01" });
    expect(r.gestationalDays).toBe(151); // Jan 1 → Jun 1
    expect(r.gestationalWeeks).toBe(21);
    expect(r.gestationalDayRemainder).toBe(4); // 21w4d
    expect(r.trimester).toBe(2);
    expect(r.progressPct).toBeCloseTo(53.9, 1); // 151/280*100
  });

  it("flags overdue when today is past the due date", () => {
    const r = calculatePregnancy({ ...base, referenceDate: "2025-01-01", asOfDate: "2025-10-20" });
    expect(r.overdue).toBe(true);
    expect(r.daysOverdue).toBe(12); // 2025-10-20 − 2025-10-08
    expect(r.daysRemaining).toBe(-12);
    expect(r.trimester).toBe(3);
    expect(r.progressPct).toBe(100);
  });

  it("treats a future LMP as not yet conceived (GA floored at 0)", () => {
    const r = calculatePregnancy({ ...base, referenceDate: "2026-01-01", asOfDate: "2025-06-01" });
    expect(r.gestationalDays).toBe(0);
    expect(r.gestationalWeeks).toBe(0);
    expect(r.progressPct).toBe(0);
    expect(r.conceived).toBe(false);
  });
});

describe("calculatePregnancy — guards", () => {
  it("returns invalid for an unparseable reference date", () => {
    const r = calculatePregnancy({ ...base, referenceDate: "not-a-date" });
    expect(r.valid).toBe(false);
    expect(r.milestones).toHaveLength(0);
  });

  it("never returns NaN/Infinity even with NaN numeric inputs", () => {
    const r = calculatePregnancy({
      ...base,
      cycleLength: NaN,
      ultrasoundWeeks: NaN,
      ultrasoundDays: NaN,
    });
    expect(r.valid).toBe(true);
    expect(Number.isFinite(r.gestationalDays)).toBe(true);
    expect(Number.isFinite(r.daysRemaining)).toBe(true);
    expect(Number.isFinite(r.progressPct)).toBe(true);
    // NaN cycle falls back to 28 ⇒ standard 280-day due date
    expect(r.dueDateISO).toBe("2025-10-08");
  });
});
