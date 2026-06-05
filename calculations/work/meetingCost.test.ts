import { describe, it, expect } from "vitest";
import {
  calculateMeetingCost,
  LOADED_COST_MULTIPLIER,
  SENIORITY_MULTIPLIERS,
  FREQUENCY_PER_YEAR,
  REFOCUS_MINUTES_PER_ATTENDEE,
  HOURS_PER_WORKDAY,
} from "./meetingCost";

const base = {
  inputs: {
    attendees: 8,
    durationMinutes: 60,
    seniority: "mixed",
    frequency: "weekly",
    state: "National",
  },
  data: { medianWage: 23.11 },
};

describe("calculateMeetingCost", () => {
  it("loadedHourlyRate = median × seniority × loaded multiplier", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    const expected =
      Math.round(23.11 * SENIORITY_MULTIPLIERS.mixed * LOADED_COST_MULTIPLIER * 100) /
      100;
    expect(r.loadedHourlyRate).toBeCloseTo(expected, 2);
  });

  it("totalCost = attendees × loadedRate × hours", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    const expected = Math.round(8 * r.loadedHourlyRate * 1);
    expect(r.totalCost).toBe(expected);
  });

  it("60-min mixed 8-person meeting at national wage is in a sane range ($350-$450)", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    // 23.11 × 1.5 × 1.4 = $48.53/hr loaded × 8 = $388
    expect(r.totalCost).toBeGreaterThan(350);
    expect(r.totalCost).toBeLessThan(450);
  });

  it("annualizedCost = totalCost × meetings per year (weekly = 52)", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    expect(r.annualizedCost).toBe(r.totalCost * 52);
    expect(r.meetingsPerYear).toBe(52);
  });

  it("one-off frequency → annualizedCost = totalCost", () => {
    const r = calculateMeetingCost(
      { ...base.inputs, frequency: "one-off" },
      base.data,
    );
    expect(r.annualizedCost).toBe(r.totalCost);
    expect(r.meetingsPerYear).toBe(1);
  });

  it("costPerAttendee = totalCost / attendees", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    expect(r.costPerAttendee).toBe(Math.round(r.totalCost / 8));
  });

  it("costPerMinute = totalCost / durationMinutes", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    expect(r.costPerMinute).toBeCloseTo(r.totalCost / 60, 1);
  });

  it("attendeeHours = attendees × hours", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    expect(r.attendeeHours).toBe(8);
  });

  // ── Seniority scaling ────────────────────────────────────────────────────

  it("leadership meeting costs more than junior meeting", () => {
    const junior = calculateMeetingCost(
      { ...base.inputs, seniority: "junior" },
      base.data,
    );
    const leadership = calculateMeetingCost(
      { ...base.inputs, seniority: "leadership" },
      base.data,
    );
    expect(leadership.totalCost).toBeGreaterThan(junior.totalCost * 2);
  });

  // ── State wage injection ─────────────────────────────────────────────────

  it("higher state wage → higher meeting cost", () => {
    const low = calculateMeetingCost(base.inputs, { medianWage: 17.3 });
    const high = calculateMeetingCost(base.inputs, { medianWage: 29.88 });
    expect(high.totalCost).toBeGreaterThan(low.totalCost);
  });

  // ── Savings levers ───────────────────────────────────────────────────────

  it("trim15Saving > 0 for a recurring meeting", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    expect(r.trim15Saving).toBeGreaterThan(0);
  });

  it("dropOneAttendeeSaving = loadedRate × hours × meetingsPerYear", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    expect(r.dropOneAttendeeSaving).toBe(
      Math.round(r.loadedHourlyRate * 1 * 52),
    );
  });

  it("asyncSaving = 90% of annualized cost", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    expect(r.asyncSaving).toBe(Math.round(r.annualizedCost * 0.9));
  });

  // ── Monotonicity ─────────────────────────────────────────────────────────

  it("more attendees → higher total cost", () => {
    const small = calculateMeetingCost(
      { ...base.inputs, attendees: 3 },
      base.data,
    );
    const large = calculateMeetingCost(
      { ...base.inputs, attendees: 20 },
      base.data,
    );
    expect(large.totalCost).toBeGreaterThan(small.totalCost);
  });

  it("longer duration → higher total cost", () => {
    const short = calculateMeetingCost(
      { ...base.inputs, durationMinutes: 30 },
      base.data,
    );
    const long = calculateMeetingCost(
      { ...base.inputs, durationMinutes: 120 },
      base.data,
    );
    expect(long.totalCost).toBeGreaterThan(short.totalCost);
  });

  it("weekly costs 2× biweekly annualized", () => {
    const weekly = calculateMeetingCost(base.inputs, base.data);
    const biweekly = calculateMeetingCost(
      { ...base.inputs, frequency: "biweekly" },
      base.data,
    );
    expect(weekly.annualizedCost).toBe(biweekly.annualizedCost * 2);
  });

  it("FREQUENCY_PER_YEAR mapping is correct", () => {
    expect(FREQUENCY_PER_YEAR.weekly).toBe(52);
    expect(FREQUENCY_PER_YEAR.biweekly).toBe(26);
    expect(FREQUENCY_PER_YEAR.monthly).toBe(12);
    expect(FREQUENCY_PER_YEAR["one-off"]).toBe(1);
  });

  // ── Daily frequency (standups) ───────────────────────────────────────────

  it("daily frequency annualizes over 260 working days", () => {
    const r = calculateMeetingCost(
      { ...base.inputs, frequency: "daily" },
      base.data,
    );
    expect(r.meetingsPerYear).toBe(260);
    expect(r.annualizedCost).toBe(r.totalCost * 260);
  });

  // ── Context-switch (refocus) tax ──────────────────────────────────────────

  it("refocus cost = attendees × 23min × loaded rate", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    const expected = Math.round(
      8 * (REFOCUS_MINUTES_PER_ATTENDEE / 60) * r.loadedHourlyRate,
    );
    expect(r.refocusCostPerMeeting).toBe(expected);
  });

  it("true cost = in-meeting cost + refocus tax, and exceeds totalCost", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    expect(r.trueCostPerMeeting).toBe(r.totalCost + r.refocusCostPerMeeting);
    expect(r.trueCostPerMeeting).toBeGreaterThan(r.totalCost);
  });

  it("true annualized cost = true per-meeting × meetings per year", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    expect(r.trueAnnualizedCost).toBe(r.trueCostPerMeeting * 52);
  });

  // ── Workday framing ───────────────────────────────────────────────────────

  it("annual workdays = annual attendee-hours ÷ 8", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    const expected =
      Math.round(((r.attendeeHours * r.meetingsPerYear) / HOURS_PER_WORKDAY) * 10) / 10;
    expect(r.annualWorkdays).toBe(expected);
    // 8 people × 1hr × 52 = 416 attendee-hrs ÷ 8 = 52 workdays
    expect(r.annualWorkdays).toBeCloseTo(52, 1);
  });

  it("all outputs are finite numbers", () => {
    const r = calculateMeetingCost(base.inputs, base.data);
    for (const [key, val] of Object.entries(r)) {
      expect(Number.isFinite(val), `${key} should be finite`).toBe(true);
    }
  });
});
