// ─── Dividend Income Engine ───────────────────────────────────────────────────
//
// Projects the INCOME from a dividend-paying investment: how much cash it pays now,
// how that payment grows as the company raises its dividend, your yield-on-cost over
// time, and the split between dividends collected and price appreciation.
//
// (Contrast with the DRIP calculator, which focuses on reinvestment-vs-cash final
//  value. This tool's hero is the income stream and yield-on-cost.)
//
// Annual model:
//   priceₜ  = price₀ · (1 + gPrice)^(t−1)
//   dpsₜ    = dps₀   · (1 + gDiv)^(t−1)     (dps₀ = price₀ · yield)
//   incomeₜ = shares · dpsₜ
//   if reinvesting: shares += incomeₜ / priceₜ
//
// Pure & synchronous. Guards zero/negative/NaN.

export interface DividendInputs {
  investmentAmount: number;
  /** Starting annual dividend yield, in percent (e.g. 3.5) */
  dividendYieldPct: number;
  /** Annual dividend growth (the company raising its payout), in percent */
  dividendGrowthPct: number;
  /** Annual share-price appreciation, in percent */
  priceGrowthPct: number;
  years: number;
  /** Reinvest dividends into more shares (DRIP) */
  reinvest: boolean;
}

export interface DividendResult {
  annualIncomeYear1: number;
  monthlyIncomeYear1: number;
  finalAnnualIncome: number;
  totalDividends: number;
  /** Final annual income ÷ original investment, % */
  yieldOnCostPct: number;
  finalValue: number;          // portfolio value (+ cash dividends if not reinvesting)
  totalReturn: number;         // finalValue − investmentAmount
  /** Annual dividend income by year, for a line chart */
  incomeByYear: { x: number; y: number }[];
  /** Dividends collected vs price appreciation, for a breakdown bar */
  returnBreakdown: { label: string; amount: number }[];
}

const round = (n: number) => Math.round(n);
const round2 = (n: number) => Math.round(n * 100) / 100;

const PRICE0 = 100;

export function calculateDividend(inputs: DividendInputs): DividendResult {
  const investmentAmount = Math.max(0, inputs.investmentAmount || 0);
  const yld = Math.max(0, inputs.dividendYieldPct || 0) / 100;
  const gDiv = Math.max(-1, (inputs.dividendGrowthPct || 0) / 100);
  const gPrice = Math.max(-1, (inputs.priceGrowthPct || 0) / 100);
  const years = Math.max(1, Math.round(inputs.years || 1));
  const reinvest = !!inputs.reinvest;

  let shares = investmentAmount / PRICE0;
  const dps0 = PRICE0 * yld;

  let totalDividends = 0;
  let income1 = 0;
  let incomeFinal = 0;
  const incomeByYear: { x: number; y: number }[] = [];

  for (let t = 1; t <= years; t++) {
    const price = PRICE0 * Math.pow(1 + gPrice, t - 1);
    const dps = dps0 * Math.pow(1 + gDiv, t - 1);
    const income = shares * dps;

    totalDividends += income;
    if (t === 1) income1 = income;
    incomeFinal = income;
    incomeByYear.push({ x: t, y: round(income) });

    if (reinvest && price > 0) {
      shares += income / price;
    }
  }

  const finalPrice = PRICE0 * Math.pow(1 + gPrice, years);
  const portfolioValue = shares * finalPrice;
  // If not reinvesting, dividends were taken as cash — count them in total value.
  const finalValue = reinvest ? portfolioValue : portfolioValue + totalDividends;

  // Appreciation of the original capital (independent of dividends collected).
  const appreciation = investmentAmount * (Math.pow(1 + gPrice, years) - 1);

  return {
    annualIncomeYear1: round(income1),
    monthlyIncomeYear1: round(income1 / 12),
    finalAnnualIncome: round(incomeFinal),
    totalDividends: round(totalDividends),
    yieldOnCostPct: investmentAmount > 0 ? round2((incomeFinal / investmentAmount) * 100) : 0,
    finalValue: round(finalValue),
    totalReturn: round(finalValue - investmentAmount),
    incomeByYear,
    returnBreakdown: [
      { label: "Dividends collected", amount: round(totalDividends) },
      { label: "Price appreciation", amount: round(Math.max(0, appreciation)) },
    ],
  };
}
