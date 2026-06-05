import { describe, it, expect } from "vitest";
import { calculateSalaryNegotiation } from "./salaryNegotiation";

describe("calculateSalaryNegotiation", () => {
  const base = {
    currentOffer: 65000,
    marketLow: 60000,
    marketHigh: 85000,
    experienceYears: 5,
    skillMatch: 75,
    offerUrgencyHigh: false,
  };

  it("market midpoint is the average of low and high", () => {
    const r = calculateSalaryNegotiation(base);
    expect(r.marketMid).toBe((60000 + 85000) / 2);
  });

  it("recommended ask is at least the market midpoint", () => {
    const r = calculateSalaryNegotiation(base);
    expect(r.recommendedAsk).toBeGreaterThanOrEqual(r.marketMid);
  });

  // A light profile so the leverage blend stays below the 100 cap and the
  // individual factor effects remain observable.
  const light = { ...base, experienceYears: 2, skillMatch: 50, offerUrgencyHigh: false };

  it("leverage score blends experience, skill, and urgency", () => {
    const r = calculateSalaryNegotiation(light);
    expect(r.confidenceScore).toBeCloseTo((2 / 10 + 50 / 100) * 100, 4);
  });

  it("high urgency increases leverage", () => {
    const low = calculateSalaryNegotiation({ ...light, offerUrgencyHigh: false });
    const high = calculateSalaryNegotiation({ ...light, offerUrgencyHigh: true });
    expect(high.confidenceScore).toBeGreaterThan(low.confidenceScore);
  });

  it("more experience raises the leverage score", () => {
    const low = calculateSalaryNegotiation({ ...light, experienceYears: 1 });
    const high = calculateSalaryNegotiation({ ...light, experienceYears: 4 });
    expect(high.confidenceScore).toBeGreaterThan(low.confidenceScore);
  });

  it("better skill match raises the leverage score", () => {
    const low = calculateSalaryNegotiation({ ...light, skillMatch: 30 });
    const high = calculateSalaryNegotiation({ ...light, skillMatch: 70 });
    expect(high.confidenceScore).toBeGreaterThan(low.confidenceScore);
  });

  it("confidence score is capped at 100", () => {
    const r = calculateSalaryNegotiation({ ...base, experienceYears: 30, skillMatch: 100, offerUrgencyHigh: true });
    expect(r.confidenceScore).toBeLessThanOrEqual(100);
  });

  it("a strong candidate with a high offer asks above the offer", () => {
    const r = calculateSalaryNegotiation({ ...base, currentOffer: 120000, marketLow: 60000, marketHigh: 85000 });
    expect(r.recommendedAsk).toBeGreaterThan(120000);
  });

  it("a low offer is pulled up to at least the market midpoint", () => {
    const r = calculateSalaryNegotiation({ ...base, currentOffer: 40000 });
    expect(r.recommendedAsk).toBe(r.marketMid);
  });

  it("higher current offer yields a higher or equal ask", () => {
    const low = calculateSalaryNegotiation({ ...base, currentOffer: 90000 });
    const high = calculateSalaryNegotiation({ ...base, currentOffer: 110000 });
    expect(high.recommendedAsk).toBeGreaterThanOrEqual(low.recommendedAsk);
  });

  it("ask is a whole-dollar figure", () => {
    const r = calculateSalaryNegotiation(base);
    expect(Number.isInteger(r.recommendedAsk)).toBe(true);
  });
});
