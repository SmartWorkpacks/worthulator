/**
 * ─── ROI Calculator Engine ────────────────────────────────────────────────────
 * Computes gross ROI, net ROI after fees/taxes, inflation-adjusted real ROI,
 * benchmark comparison, annualised return (CAGR), and break-even timeline.
 */

export interface ROIInput {
  initialInvestment: number;      // Starting capital
  finalValue: number;             // End value (OR use annualReturn + years to derive)
  years: number;                  // Holding period in years
  annualContribution?: number;    // Recurring yearly top-up (default 0)
  annualFeePct?: number;          // Total annual fees/expenses % (default 0)
  taxRatePct?: number;            // Tax on gains % (default 0)
  inflationRatePct?: number;      // Annual inflation % (default 2.5)
  benchmarkReturnPct?: number;    // Benchmark annualised return % for comparison
}

export interface ROIResult {
  grossROIPct: number;            // (finalValue - invested) / invested × 100
  netROIPct: number;              // After fees + tax
  realROIPct: number;             // After inflation adjustment
  annualisedReturn: number;       // CAGR %
  netAnnualisedReturn: number;    // CAGR after fees
  realAnnualisedReturn: number;   // CAGR after fees + inflation
  investmentMultiple: number;     // finalValue / totalInvested
  totalInvested: number;          // initial + contributions
  totalProfit: number;            // finalValue - totalInvested
  feeDragTotal: number;           // Approximate cost of fees over period
  taxDragTotal: number;           // Tax on gains
  inflationErosion: number;       // Purchasing power lost to inflation
  realPurchasingPower: number;    // Final value in today's dollars
  benchmarkFinalValue: number;    // What benchmark would have grown to
  benchmarkOutperformance: number;// finalValue - benchmarkFinalValue
  breakEvenYears: number;         // Years until investment > totalInvested (0 if already)
  growthSeries: { year: number; gross: number; net: number; benchmark: number; real: number }[];
}

export function calculateROI(input: ROIInput): ROIResult {
  const {
    initialInvestment,
    finalValue,
    years,
    annualContribution = 0,
    annualFeePct = 0,
    taxRatePct = 0,
    inflationRatePct = 2.5,
    benchmarkReturnPct = 7,
  } = input;

  const totalInvested = initialInvestment + annualContribution * years;
  const totalProfit = Math.max(0, finalValue - totalInvested);
  const grossROIPct = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  // Derive implied gross CAGR from final value
  const impliedGrossRate = totalInvested > 0 && years > 0
    ? Math.pow(finalValue / initialInvestment, 1 / years) - 1
    : 0;

  // Net CAGR after annual fees
  const netRate = Math.max(0, impliedGrossRate - annualFeePct / 100);

  // Net final value
  let netFinalValue = initialInvestment;
  for (let y = 1; y <= years; y++) {
    netFinalValue = netFinalValue * (1 + netRate) + annualContribution;
  }
  const netProfit = Math.max(0, netFinalValue - totalInvested);
  const taxDragTotal = netProfit * (taxRatePct / 100);
  const afterTaxNetFinalValue = totalInvested + netProfit - taxDragTotal;
  const netROIPct = totalInvested > 0 ? ((afterTaxNetFinalValue - totalInvested) / totalInvested) * 100 : 0;

  // Real (inflation-adjusted) purchasing power
  const inflationFactor = Math.pow(1 + inflationRatePct / 100, years);
  const realPurchasingPower = afterTaxNetFinalValue / inflationFactor;
  const inflationErosion = afterTaxNetFinalValue - realPurchasingPower;
  const realROIPct = totalInvested > 0 ? ((realPurchasingPower - totalInvested) / totalInvested) * 100 : 0;

  // Fee drag visualisation: what gross final value minus net final value costs
  const feeDragTotal = Math.max(0, finalValue - netFinalValue);

  // Annualised (CAGR)
  const annualisedReturn = years > 0 && totalInvested > 0
    ? (Math.pow(finalValue / totalInvested, 1 / years) - 1) * 100
    : 0;
  const netAnnualisedReturn = years > 0 && totalInvested > 0
    ? (Math.pow(afterTaxNetFinalValue / totalInvested, 1 / years) - 1) * 100
    : 0;
  const realAnnualisedReturn = years > 0 && totalInvested > 0
    ? (Math.pow(realPurchasingPower / totalInvested, 1 / years) - 1) * 100
    : 0;

  const investmentMultiple = totalInvested > 0 ? finalValue / totalInvested : 1;

  // Benchmark growth
  const benchmarkRate = benchmarkReturnPct / 100;
  let benchmarkFinalValue = initialInvestment;
  for (let y = 1; y <= years; y++) {
    benchmarkFinalValue = benchmarkFinalValue * (1 + benchmarkRate) + annualContribution;
  }
  const benchmarkOutperformance = finalValue - benchmarkFinalValue;

  // Break-even year
  let breakEvenYears = 0;
  if (finalValue <= totalInvested) {
    breakEvenYears = years + 1; // never broke even in horizon
  }

  // Growth series for chart
  const growthSeries: ROIResult["growthSeries"] = [];
  let grossAcc = initialInvestment;
  let netAcc = initialInvestment;
  let benchAcc = initialInvestment;
  for (let y = 0; y <= years; y++) {
    const realAcc = grossAcc / Math.pow(1 + inflationRatePct / 100, y);
    growthSeries.push({
      year: y,
      gross: Math.round(grossAcc),
      net: Math.round(netAcc),
      benchmark: Math.round(benchAcc),
      real: Math.round(realAcc),
    });
    grossAcc = grossAcc * (1 + impliedGrossRate) + annualContribution;
    netAcc = netAcc * (1 + netRate) + annualContribution;
    benchAcc = benchAcc * (1 + benchmarkRate) + annualContribution;
  }

  return {
    grossROIPct:            Math.round(grossROIPct * 10) / 10,
    netROIPct:              Math.round(netROIPct * 10) / 10,
    realROIPct:             Math.round(realROIPct * 10) / 10,
    annualisedReturn:       Math.round(annualisedReturn * 10) / 10,
    netAnnualisedReturn:    Math.round(netAnnualisedReturn * 10) / 10,
    realAnnualisedReturn:   Math.round(realAnnualisedReturn * 10) / 10,
    investmentMultiple:     Math.round(investmentMultiple * 10) / 10,
    totalInvested:          Math.round(totalInvested),
    totalProfit:            Math.round(totalProfit),
    feeDragTotal:           Math.round(feeDragTotal),
    taxDragTotal:           Math.round(taxDragTotal),
    inflationErosion:       Math.round(inflationErosion),
    realPurchasingPower:    Math.round(realPurchasingPower),
    benchmarkFinalValue:    Math.round(benchmarkFinalValue),
    benchmarkOutperformance:Math.round(benchmarkOutperformance),
    breakEvenYears,
    growthSeries,
  };
}
