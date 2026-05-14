/**
 * ─── Salary Increase Calculator Engine ───────────────────────────────────────
 * Calculates the true long-term value of a raise — monthly, annual,
 * inflation-adjusted, post-tax estimate, and cumulative lifetime impact.
 */

export interface SalaryIncreaseInput {
  currentSalary: number;         // Annual gross salary
  raiseType: "percentage" | "flat";
  raiseValue: number;            // % or flat $ amount
  years: number;                 // Projection horizon
  annualRaiseRepeat?: boolean;   // Compound the raise every year?
  annualRaisePct?: number;       // % raise applied each year (if repeating)
  inflationRatePct?: number;     // Annual inflation (default 2.5)
  taxRatePct?: number;           // Marginal tax rate estimate (default 22)
  annualBonus?: number;          // Flat bonus on top of salary
}

export interface SalaryIncreaseResult {
  newSalary: number;
  raiseAmount: number;
  monthlyIncrease: number;
  postTaxRaiseEstimate: number;  // After marginal tax
  postTaxMonthly: number;
  inflationAdjustedRaise: number; // Real purchasing power of the raise
  lifetimeEarningsDiff: number;   // Extra earnings over 'years' vs flat salary
  futureProjectedSalary: number;  // With repeated annual raises
  cumulativeEarningsNow: number;  // Total earnings at current salary over years
  cumulativeEarningsNew: number;  // Total earnings with raises over years
  salaryGrowthSeries: { year: number; current: number; raised: number; real: number }[];
}

export function calculateSalaryIncrease(input: SalaryIncreaseInput): SalaryIncreaseResult {
  const {
    currentSalary,
    raiseType,
    raiseValue,
    years,
    annualRaiseRepeat = false,
    annualRaisePct = raiseType === "percentage" ? raiseValue : 3,
    inflationRatePct = 2.5,
    taxRatePct = 22,
    annualBonus = 0,
  } = input;

  const raiseAmount = raiseType === "percentage"
    ? (currentSalary * raiseValue) / 100
    : raiseValue;

  const newSalary = currentSalary + raiseAmount;
  const monthlyIncrease = raiseAmount / 12;

  // Post-tax: marginal rate applies to the incremental raise
  const postTaxRaiseEstimate = raiseAmount * (1 - taxRatePct / 100);
  const postTaxMonthly = postTaxRaiseEstimate / 12;

  // Inflation-adjusted real value of the raise (year 1 only)
  const inflationFactor = 1 + inflationRatePct / 100;
  const inflationAdjustedRaise = raiseAmount / inflationFactor;

  // Cumulative projection
  let cumulativeNow = 0;
  let cumulativeNew = 0;
  let salaryCurrent = currentSalary;
  let salaryRaised = newSalary;
  const salaryGrowthSeries: SalaryIncreaseResult["salaryGrowthSeries"] = [];

  for (let y = 0; y <= years; y++) {
    const realRaised = salaryRaised / Math.pow(inflationFactor, y);
    salaryGrowthSeries.push({
      year: y,
      current: Math.round(salaryCurrent),
      raised: Math.round(salaryRaised),
      real: Math.round(realRaised),
    });
    if (y < years) {
      cumulativeNow += salaryCurrent + annualBonus;
      cumulativeNew += salaryRaised + annualBonus;
      if (annualRaiseRepeat) {
        salaryCurrent *= 1 + inflationRatePct / 100; // current keeps pace with inflation only
        salaryRaised *= 1 + annualRaisePct / 100;
      } else {
        // Both stay flat — simple comparison
      }
    }
  }

  const lifetimeEarningsDiff = cumulativeNew - cumulativeNow;
  const futureProjectedSalary = annualRaiseRepeat ? salaryRaised : newSalary;

  return {
    newSalary:               Math.round(newSalary),
    raiseAmount:             Math.round(raiseAmount),
    monthlyIncrease:         Math.round(monthlyIncrease),
    postTaxRaiseEstimate:    Math.round(postTaxRaiseEstimate),
    postTaxMonthly:          Math.round(postTaxMonthly),
    inflationAdjustedRaise:  Math.round(inflationAdjustedRaise),
    lifetimeEarningsDiff:    Math.round(lifetimeEarningsDiff),
    futureProjectedSalary:   Math.round(futureProjectedSalary),
    cumulativeEarningsNow:   Math.round(cumulativeNow),
    cumulativeEarningsNew:   Math.round(cumulativeNew),
    salaryGrowthSeries,
  };
}
