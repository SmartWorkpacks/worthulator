import type { Insight } from "../types";
import { formatCurrency } from "../benchmarks";
import { futureValueAnnuity } from "../projections";

interface AirbnbInputs {
  nightlyRate:     number;
  occupancyPct:    number;
  platformFeePct:  number;
  monthlyExpenses: number;
}

interface AirbnbOutputs {
  monthlyRevenue?:        number;
  monthlyProfit?:         number;
  annualProfit?:          number;
  breakEvenOcc?:          number;
  profitMarginPct?:       number;
  tenYearProfit?:         number;
  revenueToExpenseRatio?: number;
}

// AirDNA 2024: US average short-term rental occupancy 55–65%.
// Average Airbnb host annual revenue: $13,800 (Airbnb 2023 host report).
// Platform fee: 3% host fee (standard Airbnb), 15–20% guest fee.

export function airbnbProfitInsights(
  inputs: AirbnbInputs,
  outputs: AirbnbOutputs,
): Insight[] {
  const results: Insight[] = [];

  const occ       = Number(inputs.occupancyPct);
  const nightly   = Number(inputs.nightlyRate);
  const expenses  = Number(inputs.monthlyExpenses);
  const monthly   = outputs.monthlyProfit         ?? 0;
  const annual    = outputs.annualProfit           ?? 0;
  const revenue   = outputs.monthlyRevenue         ?? 0;
  const breakEven = outputs.breakEvenOcc           ?? 0;
  const margin    = outputs.profitMarginPct        ?? 0;
  const tenYear   = outputs.tenYearProfit          ?? 0;
  const ratio     = outputs.revenueToExpenseRatio  ?? 0;

  // 1. Core profit or loss fact
  if (monthly > 0) {
    const invested10yr = Math.round(futureValueAnnuity(annual, 10));
    results.push({
      id:       "airbnb.profit",
      severity: "positive",
      category: "savings",
      title:    `${formatCurrency(monthly)}/month net — ${formatCurrency(annual)}/year at ${occ}% occupancy`,
      body:     `${formatCurrency(revenue)}/month gross revenue minus expenses produces ${formatCurrency(monthly)}/month — a ${margin.toFixed(1)}% profit margin. AirDNA puts US average host revenue at $13,800/year. At ${formatCurrency(annual)}/year, this listing is ${annual > 13800 ? `${formatCurrency(annual - 13800)} above` : `${formatCurrency(13800 - annual)} below`} that average.`,
      metric:   { label: "Annual net profit", value: formatCurrency(annual) },
      visualization: {
        type:           "benchmark-bar",
        userValue:      annual,
        userLabel:      "Your annual profit",
        benchmarkValue: 13800,
        benchmarkLabel: "US avg host (AirDNA)",
        format:         "currency",
      },
    });
  } else {
    results.push({
      id:       "airbnb.losing-money",
      severity: "warning",
      category: "warning",
      title:    `${formatCurrency(Math.abs(monthly))}/month loss at ${occ}% occupancy`,
      body:     `At ${occ}% occupancy, gross revenue of ${formatCurrency(revenue)}/month falls short of the ${formatCurrency(expenses)}/month in expenses. Break-even requires either higher occupancy, a higher nightly rate, or lower operating costs.`,
      metric:   { label: "Monthly loss", value: formatCurrency(Math.abs(monthly)) },
    });
  }

  // 2. Break-even occupancy
  if (breakEven > 0 && breakEven < 100) {
    const cushion = occ - breakEven;
    results.push({
      id:       "airbnb.break-even",
      severity: cushion >= 15 ? "positive" : cushion >= 5 ? "neutral" : "warning",
      category: "comparison",
      title:    `Break-even occupancy: ${breakEven.toFixed(1)}% — you are ${cushion >= 0 ? `${cushion.toFixed(0)}% above` : `${Math.abs(cushion).toFixed(0)}% below`}`,
      body:     `At ${breakEven.toFixed(1)}% occupancy, the listing exactly covers its ${formatCurrency(expenses)}/month in expenses. You are currently ${occ}% — a ${Math.abs(cushion).toFixed(0)}% ${cushion >= 0 ? "buffer" : "shortfall"}. A slow month dropping to ${breakEven.toFixed(0)}% would leave you at exactly breakeven.`,
      metric:   { label: "Break-even occupancy", value: `${breakEven.toFixed(1)}%` },
    });
  }

  // 3. Ten-year framing with investment context
  if (tenYear > 20_000) {
    const invested10yr = Math.round(futureValueAnnuity(annual, 10));
    results.push({
      id:       "airbnb.ten-year",
      severity: "neutral",
      category: "projection",
      title:    `${formatCurrency(tenYear)} in net profit over 10 years — ${formatCurrency(invested10yr)} if invested`,
      body:     `At current occupancy and rates, 10 years of this listing generates ${formatCurrency(tenYear)} in net profit. That cash flow reinvested at 7% annually would compound to ${formatCurrency(invested10yr)}. This excludes any rent appreciation — Airbnb host revenues have grown approximately 3–5%/year historically.`,
      metric:   { label: "10-year net profit", value: formatCurrency(tenYear) },
    });
  }

  // 4. Rate optimisation
  if (monthly > 0 && nightly < 120) {
    const extra20 = Math.round(20 * 30 * occ / 100);
    results.push({
      id:       "airbnb.rate-nudge",
      severity: "positive",
      category: "opportunity-cost",
      title:    `A $20/night rate increase adds ~${formatCurrency(extra20)}/month in gross revenue`,
      body:     `At ${occ}% occupancy, a $20 nightly rate increase generates approximately ${formatCurrency(extra20)}/month (${Math.round(30 * occ / 100)} booked nights × $20). Dynamic pricing tools (Wheelhouse, PriceLabs) can capture seasonal and weekend rate premiums automatically.`,
      metric:   { label: "Revenue from +$20/night", value: formatCurrency(extra20) },
    });
  }

  return results;
}
