import { describe, expect, it } from "vitest";
import { calculatePaycheck, type PaycheckInputs } from "./paycheckEngine";

const US_BASE: PaycheckInputs = {
  country: "US",
  grossAnnual: 60_000,
  payFrequency: "biweekly",
  filingStatus: "single",
  stateCode: "TX", // 0% state income tax
  retirementPct: 0,
  year: 2026,
};

const UK_BASE: PaycheckInputs = {
  country: "UK",
  grossAnnual: 50_000,
  payFrequency: "monthly",
  filingStatus: "single",
  stateCode: "TX",
  retirementPct: 0,
  year: 2026,
};

describe("calculatePaycheck", () => {
  it("matches a hand-computed US single filer (60k, TX, no retirement)", () => {
    const r = calculatePaycheck(US_BASE);
    // taxable = 60000 - 14600 standard deduction = 45400
    // federal = 12200*.10 + (45400-12200)*.12 = 1220 + 3984 = 5204
    expect(r.federalIncomeTax).toBe(5204);
    expect(r.socialSecurity).toBe(3720); // 60000 * 0.062
    expect(r.medicare).toBe(870); // 60000 * 0.0145
    expect(r.stateTax).toBe(0);
    expect(r.netAnnual).toBe(50_206); // 60000 - 9794 total tax
    expect(r.payPeriods).toBe(26);
    expect(r.marginalRate).toBeCloseTo(0.12, 5);
  });

  it("matches a hand-computed UK earner (50k, no pension)", () => {
    const r = calculatePaycheck(UK_BASE);
    // PA 12570 (no taper), taxable 37430 @20% = 7486
    expect(r.federalIncomeTax).toBe(7486);
    // NI: (50000 - 12570) * 0.08 = 2994.4
    expect(r.nationalInsurance).toBe(2994);
    expect(r.socialSecurity).toBe(0);
    expect(r.medicare).toBe(0);
    expect(r.netAnnual).toBe(39_520);
    expect(r.currency).toBe("GBP");
  });

  it("a higher-tax state lowers net pay at equal gross", () => {
    const tx = calculatePaycheck({ ...US_BASE, grossAnnual: 100_000, stateCode: "TX" });
    const ca = calculatePaycheck({ ...US_BASE, grossAnnual: 100_000, stateCode: "CA" });
    expect(ca.stateTax).toBeGreaterThan(0);
    expect(ca.netAnnual).toBeLessThan(tx.netAnnual);
  });

  it("caps the US retirement contribution at the 401(k) limit", () => {
    const r = calculatePaycheck({ ...US_BASE, grossAnnual: 1_000_000, retirementPct: 50 });
    expect(r.retirementContribution).toBe(23_500);
  });

  it("net annual rises monotonically with gross (US)", () => {
    const lo = calculatePaycheck({ ...US_BASE, grossAnnual: 60_000 });
    const hi = calculatePaycheck({ ...US_BASE, grossAnnual: 80_000 });
    expect(hi.netAnnual).toBeGreaterThan(lo.netAnnual);
  });

  it("deduction lines plus take-home sum to gross", () => {
    const r = calculatePaycheck({ ...US_BASE, grossAnnual: 90_000, stateCode: "CA", retirementPct: 6 });
    const sum = r.deductions.reduce((acc, d) => acc + d.annual, 0);
    expect(Math.abs(sum - r.grossAnnual)).toBeLessThanOrEqual(2);
  });

  it("guards NaN and invalid inputs from producing non-finite values", () => {
    const r = calculatePaycheck({ ...US_BASE, grossAnnual: Number.NaN, retirementPct: Number.NaN });
    expect(Number.isFinite(r.netAnnual)).toBe(true);
    expect(Number.isFinite(r.netPerPaycheck)).toBe(true);
    expect(r.netAnnual).toBe(0);
    expect(r.takeHomePct).toBe(0);
  });

  it("respects pay frequency for per-paycheck math", () => {
    const weekly = calculatePaycheck({ ...US_BASE, payFrequency: "weekly" });
    expect(weekly.payPeriods).toBe(52);
    expect(weekly.grossPerPaycheck).toBe(Math.round(60_000 / 52));
    expect(weekly.netPerPaycheck).toBe(Math.round(weekly.netAnnual / 52));
  });

  it("keeps effective tax rate between 0 and 1 and below the marginal rate", () => {
    const r = calculatePaycheck({ ...US_BASE, grossAnnual: 120_000, stateCode: "NY" });
    expect(r.effectiveTaxRate).toBeGreaterThan(0);
    expect(r.effectiveTaxRate).toBeLessThan(1);
    expect(r.takeHomePct).toBeGreaterThan(0);
    expect(r.takeHomePct).toBeLessThan(100);
  });
});
