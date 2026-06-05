// ─── Inflation Impact — Pure Calculation Module ──────────────────────────────
//
// Models how inflation erodes purchasing power, framed two ways most calculators
// miss:
//   1. What today's money will be WORTH later (buying power falls).
//   2. What you'll NEED later to maintain today's buying power (the mirror).
// Plus the intuitive "your money halves in N years" anchor.
//
// Live data injected via `data.currentCpiRate` (FRED CPI YoY) for benchmarking
// the user's assumed rate against the current real number.
//
// Result assignable to CalculatorOutputs (index signature present).
//
// ─────────────────────────────────────────────────────────────────────────────

export interface InflationImpactInputs {
  amount: number;
  rate: number;   // assumed annual inflation %
  years: number;
}

export interface InflationImpactData {
  /** Current CPI YoY inflation (%) — FRED. */
  currentCpiRate: number;
}

export interface InflationImpactResult {
  futureValue: number;       // buying power of `amount` after `years`
  loss: number;              // amount − futureValue
  lossPercent: number;       // % of purchasing power eroded
  requiredFuture: number;    // amount needed later to match today's buying power
  erosionMultiple: number;   // (1+r)^years
  firstYearLoss: number;     // value lost in year 1
  dailyLossFirstYear: number;
  yearsToHalve: number;      // exact ln(2)/ln(1+r)
  realValueRatio: number;    // futureValue / amount
  vsCurrentCpi: number;      // assumed rate − current CPI
  [key: string]: number;
}

export function calculateInflationImpact(
  inputs: InflationImpactInputs,
  data: InflationImpactData,
): InflationImpactResult {
  const amount = Math.max(0, inputs.amount);
  const r = Math.max(0, inputs.rate) / 100;
  const years = Math.max(0, inputs.years);

  const growth = Math.pow(1 + r, years); // erosion multiple
  const futureValue = growth > 0 ? Math.round(amount / growth) : amount;
  const loss = Math.max(0, amount - futureValue);
  const lossPercent = amount > 0 ? Math.round((loss / amount) * 1000) / 10 : 0;

  const requiredFuture = Math.round(amount * growth);
  const erosionMultiple = Math.round(growth * 100) / 100;

  const firstYearLoss = r > 0 ? Math.round(amount - amount / (1 + r)) : 0;
  const dailyLossFirstYear = Math.round((firstYearLoss / 365) * 100) / 100;

  const yearsToHalve = r > 0 ? Math.round((Math.log(2) / Math.log(1 + r)) * 10) / 10 : 0;
  const realValueRatio = amount > 0 ? Math.round((futureValue / amount) * 1000) / 1000 : 1;

  const vsCurrentCpi = Math.round((inputs.rate - data.currentCpiRate) * 10) / 10;

  return {
    futureValue,
    loss,
    lossPercent,
    requiredFuture,
    erosionMultiple,
    firstYearLoss,
    dailyLossFirstYear,
    yearsToHalve,
    realValueRatio,
    vsCurrentCpi,
  };
}
