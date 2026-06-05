import type { Insight } from "../types";
import { futureValueAnnuity } from "../projections";
import { formatCurrency } from "../benchmarks";

interface LotteryInputs {
  weekly: number;
  years:  number;
  return: number;
}

interface LotteryOutputs {
  invested?:     number;
  spent?:        number;
  gap?:          number;
  lossMultiple?: number;
  monthlySpend?: number;
  dailyCost?:    number;
}

// Powerball odds of jackpot: 1 in 292,201,338 (Powerball official).
// Mega Millions jackpot: 1 in 302,575,350.
// State lottery payout ratio: ~47–53 cents per dollar (varies by state).
// S&P 500 historical: ~10.7% nominal / ~7% real over 30 years.

export function lotteryVsInvestingInsights(
  inputs: LotteryInputs,
  outputs: LotteryOutputs,
): Insight[] {
  const results: Insight[] = [];

  const weekly   = Number(inputs.weekly);
  const years    = Number(inputs.years);
  const rate     = Number(inputs.return);
  const annual   = weekly * 52;
  const invested = outputs.invested  ?? Math.round(futureValueAnnuity(annual, years, rate));
  const spent    = outputs.spent     ?? Math.round(annual * years);
  const gap      = outputs.gap       ?? Math.max(0, invested - spent);
  const monthly  = outputs.monthlySpend ?? Math.round(weekly * 52 / 12);
  const daily    = outputs.dailyCost    ?? Math.round(weekly / 7 * 100) / 100;

  if (weekly <= 0) return results;

  const expectedReturn  = Math.round(spent * 0.5);   // ~50 cents per dollar returned on avg
  const expectedLoss    = spent - expectedReturn;
  const investedVsSpent = Math.round((invested / spent) * 10) / 10;

  // 1. The expected value math — what the lottery actually returns
  results.push({
    id:       "lottery.expected-value",
    severity: "neutral",
    category: "hidden-cost",
    title:    `State lotteries return about 50 cents per dollar wagered`,
    body:     `Lottery payout ratios range from 47–53% of total ticket sales — the rest funds government programs. Over ${years} years at ${formatCurrency(weekly)}/week, you spend ${formatCurrency(spent)} and the statistical expected return is ${formatCurrency(expectedReturn)}. The expected loss: ${formatCurrency(expectedLoss)}. Powerball jackpot odds are 1 in 292 million.`,
    metric:   { label: "Expected loss over period", value: formatCurrency(expectedLoss) },
    visualization: {
      type:           "benchmark-bar",
      userValue:      spent,
      userLabel:      "Total spent",
      benchmarkValue: expectedReturn,
      benchmarkLabel: "Statistical return (~50%)",
      format:         "currency",
    },
  });

  // 2. Invested alternative
  results.push({
    id:       "lottery.invested-alternative",
    severity: "neutral",
    category: "opportunity-cost",
    title:    `Invested instead at ${rate}%: ${formatCurrency(invested)} over ${years} years`,
    body:     `${formatCurrency(weekly)}/week invested in an index fund at ${rate}% annually becomes ${formatCurrency(invested)} in ${years} years. You contribute ${formatCurrency(spent)} — the remaining ${formatCurrency(gap)} is compound growth. The lottery alternative: statistically ${formatCurrency(expectedReturn)}.`,
    metric:   { label: `${years}-year invested value`, value: formatCurrency(invested) },
    visualization: {
      type:   "projection-line",
      points: [1, 3, 5, 10, 20, Math.min(years, 30)].filter((y, i, a) => a.indexOf(y) === i && y <= years).sort((a, b) => a - b).map((yr) => ({
        label: `Yr ${yr}`,
        value: Math.round(futureValueAnnuity(annual, yr, rate)),
      })),
      format: "currency",
      yLabel: "Invested value",
      color:  "#10b981",
    },
  });

  // 3. Monthly framing
  if (monthly > 30) {
    results.push({
      id:       "lottery.monthly",
      severity: "neutral",
      category: "spending",
      title:    `${formatCurrency(monthly)}/month on lottery tickets`,
      body:     `${formatCurrency(weekly)}/week is ${formatCurrency(monthly)}/month and ${formatCurrency(annual)}/year. The 2024 max Roth IRA contribution is $7,000/year — at ${formatCurrency(monthly)}/month, that limit would be reached in ${Math.ceil(7000 / monthly)} months of redirected lottery spending.`,
      metric:   { label: "Monthly spend", value: formatCurrency(monthly) },
    });
  }

  // 4. Multiplication factor — what investing does vs lottery
  if (investedVsSpent >= 1.5) {
    results.push({
      id:       "lottery.multiplier",
      severity: "positive",
      category: "comparison",
      title:    `Investing turns ${formatCurrency(spent)} into ${formatCurrency(invested)} — a ${investedVsSpent.toFixed(1)}× multiple`,
      body:     `Every dollar you contribute grows to ${investedVsSpent.toFixed(1)} dollars through compound interest over ${years} years at ${rate}%. The lottery's expected return on the same money is ${formatCurrency(expectedReturn)} — a 0.5× multiple.`,
      metric:   { label: "Investment multiple", value: `${investedVsSpent.toFixed(1)}×` },
    });
  }

  return results;
}
