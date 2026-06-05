import { describe, expect, it } from "vitest";
import { calculateHouseAffordability, type HouseAffordabilityInputs } from "./houseAffordabilityEngine";

const BASE: HouseAffordabilityInputs = {
  annualIncome: 90_000,
  monthlyDebts: 500,
  downPayment: 40_000,
  mortgageRatePct: 6.7,
  termYears: 30,
  propertyTaxRatePct: 1.1,
  insuranceAnnual: 1_800,
  hoaMonthly: 0,
  frontDtiPct: 28,
  backDtiPct: 36,
};

describe("calculateHouseAffordability", () => {
  it("applies the 28/36 rule and reports the binding constraint", () => {
    const r = calculateHouseAffordability(BASE);
    // monthlyIncome 7,500 → front cap 2,100, back cap 2,200 ⇒ front-end binding at 2,100.
    expect(r.monthlyIncome).toBeCloseTo(7_500, 1);
    expect(r.frontCap).toBeCloseTo(2_100, 1);
    expect(r.backCap).toBeCloseTo(2_200, 1);
    expect(r.maxHousingBudget).toBeCloseTo(2_100, 1);
    expect(r.bindingConstraint).toBe("front");
    // Solved max price lands in the high-290k range with a ~6.7% rate.
    expect(r.maxHomePrice).toBeGreaterThan(290_000);
    expect(r.maxHomePrice).toBeLessThan(310_000);
  });

  it("switches to the back-end ratio when debts are high", () => {
    const r = calculateHouseAffordability({ ...BASE, monthlyDebts: 1_500 });
    // back cap = 2,700 − 1,500 = 1,200 < front cap 2,100 ⇒ back-end binding.
    expect(r.bindingConstraint).toBe("back");
    expect(r.maxHousingBudget).toBeCloseTo(1_200, 1);
    expect(r.maxHomePrice).toBeLessThan(calculateHouseAffordability(BASE).maxHomePrice);
  });

  it("makes the monthly payment components sum to the housing budget", () => {
    const r = calculateHouseAffordability(BASE);
    const sum = r.principalInterest + r.monthlyPropertyTax + r.monthlyInsurance + r.monthlyHoa;
    expect(sum).toBeCloseTo(r.monthlyPayment, 1);
    // When affordability-constrained, the payment uses the full housing budget.
    expect(r.monthlyPayment).toBeCloseTo(r.maxHousingBudget, 0);
  });

  it("reduces buying power as the mortgage rate rises", () => {
    const low = calculateHouseAffordability({ ...BASE, mortgageRatePct: 4 });
    const high = calculateHouseAffordability({ ...BASE, mortgageRatePct: 9 });
    expect(high.maxHomePrice).toBeLessThan(low.maxHomePrice);
    // The rate-sensitivity series is monotonically decreasing in rate.
    const series = calculateHouseAffordability(BASE).rateImpact;
    for (let i = 1; i < series.length; i++) {
      expect(series[i].maxHomePrice).toBeLessThanOrEqual(series[i - 1].maxHomePrice);
    }
  });

  it("increases buying power with income and decreases it with debt", () => {
    const richer = calculateHouseAffordability({ ...BASE, annualIncome: 140_000 });
    const indebted = calculateHouseAffordability({ ...BASE, monthlyDebts: 1_200 });
    expect(richer.maxHomePrice).toBeGreaterThan(calculateHouseAffordability(BASE).maxHomePrice);
    expect(indebted.maxHomePrice).toBeLessThan(calculateHouseAffordability(BASE).maxHomePrice);
  });

  it("keeps the loan equal to price minus down payment and never negative", () => {
    const r = calculateHouseAffordability(BASE);
    expect(r.maxHomePrice).toBeGreaterThanOrEqual(r.downPayment);
    expect(r.loanAmount).toBeCloseTo(r.maxHomePrice - r.downPayment, 1);
    // With almost no income, the price floors at the cash on hand and the loan is zero.
    const cashOnly = calculateHouseAffordability({ ...BASE, annualIncome: 0 });
    expect(cashOnly.loanAmount).toBe(0);
    expect(cashOnly.maxHomePrice).toBeGreaterThanOrEqual(cashOnly.downPayment);
  });

  it("guards NaN inputs from producing non-finite values", () => {
    const r = calculateHouseAffordability({
      annualIncome: Number.NaN,
      monthlyDebts: Number.NaN,
      downPayment: Number.NaN,
      mortgageRatePct: Number.NaN,
      termYears: Number.NaN,
      propertyTaxRatePct: Number.NaN,
      insuranceAnnual: Number.NaN,
      hoaMonthly: Number.NaN,
      frontDtiPct: Number.NaN,
      backDtiPct: Number.NaN,
    });
    expect(Number.isFinite(r.maxHomePrice)).toBe(true);
    expect(Number.isFinite(r.monthlyPayment)).toBe(true);
    expect(r.maxHomePrice).toBeGreaterThanOrEqual(0);
    expect(r.loanAmount).toBeGreaterThanOrEqual(0);
  });
});
