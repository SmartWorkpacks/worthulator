import { describe, it, expect } from "vitest";
import { calculateAge, US_LIFE_EXPECTANCY_YEARS, type AgeInputs } from "./ageEngine";

const base: AgeInputs = { birthDateISO: "1990-06-15", asOfDateISO: "2026-06-05" };

describe("calculateAge — known calendar values", () => {
  it("computes exact years/months/days with day borrowing (1990-06-15 → 2026-06-05)", () => {
    const r = calculateAge(base);
    expect(r.valid).toBe(true);
    expect(r.years).toBe(35);
    expect(r.months).toBe(11);
    expect(r.days).toBe(21);
  });

  it("counts whole days within a month (2000-01-01 → 2000-01-31 = 30 days)", () => {
    const r = calculateAge({ birthDateISO: "2000-01-01", asOfDateISO: "2000-01-31" });
    expect(r.daysLived).toBe(30);
    expect(r.years).toBe(0);
    expect(r.months).toBe(0);
    expect(r.days).toBe(30);
  });

  it("handles the Feb 29, 2000 leap day (1999-12-31 → 2000-03-01 = 61 days)", () => {
    const r = calculateAge({ birthDateISO: "1999-12-31", asOfDateISO: "2000-03-01" });
    expect(r.daysLived).toBe(61);
  });

  it("knows the weekday of birth (1990-06-15 = Friday, 2000-01-01 = Saturday)", () => {
    expect(calculateAge(base).dayOfWeekBorn).toBe("Friday");
    expect(calculateAge({ birthDateISO: "2000-01-01", asOfDateISO: "2026-01-01" }).dayOfWeekBorn).toBe("Saturday");
  });
});

describe("calculateAge — birthday logic", () => {
  it("flags the birthday itself (turning = years, 0 days until)", () => {
    const r = calculateAge({ birthDateISO: "1990-06-15", asOfDateISO: "2026-06-15" });
    expect(r.years).toBe(36);
    expect(r.months).toBe(0);
    expect(r.days).toBe(0);
    expect(r.nextBirthday.isToday).toBe(true);
    expect(r.nextBirthday.daysUntil).toBe(0);
    expect(r.nextBirthday.turning).toBe(36);
  });

  it("next birthday is always within 366 days, on/after the as-of date", () => {
    const r = calculateAge(base);
    expect(r.nextBirthday.daysUntil).toBeGreaterThanOrEqual(0);
    expect(r.nextBirthday.daysUntil).toBeLessThanOrEqual(366);
    expect(r.nextBirthday.turning).toBe(r.years + 1);
  });

  it("Feb 29 births celebrate Feb 28 in common years (calendar diff stays pure)", () => {
    const r = calculateAge({ birthDateISO: "2000-02-29", asOfDateISO: "2025-02-28" });
    // Pure calendar diff: 25 years complete only after Feb ends.
    expect(r.years).toBe(24);
    expect(r.months).toBe(11);
    expect(r.days).toBe(30);
    // Celebrated birthday: today, turning 25.
    expect(r.nextBirthday.dateISO).toBe("2025-02-28");
    expect(r.nextBirthday.isToday).toBe(true);
    expect(r.nextBirthday.turning).toBe(25);
  });

  it("Feb 29 births get their true date back in leap years", () => {
    const r = calculateAge({ birthDateISO: "2000-02-29", asOfDateISO: "2024-02-29" });
    expect(r.years).toBe(24);
    expect(r.months).toBe(0);
    expect(r.days).toBe(0);
    expect(r.nextBirthday.dateISO).toBe("2024-02-29");
  });

  it("projects 10 consecutive birthdays with consistent day math", () => {
    const r = calculateAge(base);
    expect(r.birthdays).toHaveLength(10);
    expect(r.birthdays[0].turning).toBe(r.nextBirthday.turning);
    for (let i = 0; i < r.birthdays.length; i++) {
      const b = r.birthdays[i];
      expect(b.totalDaysLived).toBe(r.daysLived + b.daysFromNow);
      if (i > 0) {
        expect(b.turning).toBe(r.birthdays[i - 1].turning + 1);
        expect(b.daysFromNow).toBeGreaterThan(r.birthdays[i - 1].daysFromNow);
      }
    }
  });
});

describe("calculateAge — totals & invariants", () => {
  it("weeks/hours/minutes/seconds derive exactly from days lived", () => {
    const r = calculateAge(base);
    expect(r.weeksLived * 7 + r.weekRemainderDays).toBe(r.daysLived);
    expect(r.hoursLived).toBe(r.daysLived * 24);
    expect(r.minutesLived).toBe(r.daysLived * 1440);
    expect(r.secondsLived).toBe(r.daysLived * 86_400);
  });

  it("totalMonths = years × 12 + months", () => {
    const r = calculateAge(base);
    expect(r.totalMonths).toBe(r.years * 12 + r.months);
  });

  it("a later as-of date never decreases days lived (monotonicity)", () => {
    const a = calculateAge({ ...base, asOfDateISO: "2026-06-05" });
    const b = calculateAge({ ...base, asOfDateISO: "2027-06-05" });
    expect(b.daysLived).toBeGreaterThan(a.daysLived);
    expect(b.daysLived - a.daysLived).toBe(365); // 2026-06-05 → 2027-06-05 spans no Feb 29
  });

  it("next 1,000-day milestone is a future multiple of 1,000, date-consistent", () => {
    const r = calculateAge(base);
    const m = r.nextThousandDayMilestone;
    expect(m.days % 1000).toBe(0);
    expect(m.days).toBeGreaterThan(r.daysLived);
    expect(m.daysUntil).toBe(m.days - r.daysLived);
    // The milestone date really is birth + m.days:
    const check = calculateAge({ birthDateISO: base.birthDateISO, asOfDateISO: m.dateISO });
    expect(check.daysLived).toBe(m.days);
  });

  it("billion-second date = birth + 11,574 whole days, crossed iff seconds ≥ 1e9", () => {
    const r = calculateAge(base);
    expect(r.billionSeconds.crossed).toBe(r.secondsLived >= 1_000_000_000);
    expect(r.billionSeconds.crossed).toBe(true); // 35yo has long crossed it
    const check = calculateAge({ birthDateISO: base.birthDateISO, asOfDateISO: r.billionSeconds.dateISO });
    expect(check.daysLived).toBe(11_574); // floor(1e9 s / 86,400)
    expect(r.billionSeconds.ageAtCrossYears).toBeCloseTo(31.7, 1);
  });

  it("lifespan share hits ~100% at exactly the CDC life-expectancy age", () => {
    const r = calculateAge({ birthDateISO: "1947-06-05", asOfDateISO: "2026-06-05" }); // 79 years
    expect(US_LIFE_EXPECTANCY_YEARS).toBe(79.0);
    expect(r.lifespanSharePct).toBeGreaterThan(99.5);
    expect(r.lifespanSharePct).toBeLessThan(100.5);
  });
});

describe("calculateAge — guards (no NaN, ever)", () => {
  it("birth after as-of returns an invalid, zeroed result", () => {
    const r = calculateAge({ birthDateISO: "2030-01-01", asOfDateISO: "2026-01-01" });
    expect(r.valid).toBe(false);
    expect(r.daysLived).toBe(0);
    expect(r.years).toBe(0);
    expect(r.birthdays).toHaveLength(0);
  });

  it("malformed and impossible dates return invalid results", () => {
    expect(calculateAge({ birthDateISO: "not-a-date", asOfDateISO: "2026-01-01" }).valid).toBe(false);
    expect(calculateAge({ birthDateISO: "2026-13-01", asOfDateISO: "2026-01-01" }).valid).toBe(false);
    expect(calculateAge({ birthDateISO: "2025-02-29", asOfDateISO: "2026-01-01" }).valid).toBe(false); // 2025 not leap
    expect(calculateAge({ birthDateISO: "", asOfDateISO: "" }).valid).toBe(false);
  });

  it("every numeric field is finite in valid and invalid results alike", () => {
    for (const r of [calculateAge(base), calculateAge({ birthDateISO: "x", asOfDateISO: "y" })]) {
      const nums = [
        r.years, r.months, r.days, r.totalMonths, r.weeksLived, r.weekRemainderDays,
        r.daysLived, r.hoursLived, r.minutesLived, r.secondsLived, r.ageDecimalYears,
        r.nextBirthday.daysUntil, r.nextBirthday.turning,
        r.nextThousandDayMilestone.days, r.nextThousandDayMilestone.daysUntil,
        r.billionSeconds.ageAtCrossYears, r.lifespanSharePct,
        ...r.birthdays.flatMap((b) => [b.turning, b.daysFromNow, b.totalDaysLived]),
      ];
      nums.forEach((n) => expect(Number.isFinite(n)).toBe(true));
    }
  });
});
