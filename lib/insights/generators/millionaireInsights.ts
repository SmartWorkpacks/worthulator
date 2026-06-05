import type { Insight } from "../types";
import { futureValueAnnuity } from "../projections";
import { formatCurrency } from "../benchmarks";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

interface MillionaireInputs {
  currentSavings: number;
  monthlySavings: number;
  annualReturn:   number;
}

interface MillionaireOutputs {
  yearsToMillion?:    number;
  totalContributed?:  number;
  interestEarned?:    number;
  progressPercent?:   number;
  marketContribPct?:  number;
  yearsFasterWith200?: number;
  realValueAtMillion?: number;
  yearsToRealMillion?: number;
  extraYearsForReal?:  number;
}

const CPI_CAPTION = {
  text: `Deflated by US CPI ${fredBenchmarks.cpiInflationYoY}% YoY (FRED ${fredBenchmarks.currentPeriodLabel})`,
  asOf: fredBenchmarks.currentPeriodLabel,
  live: true,
};

// Federal Reserve Survey of Consumer Finances (2022): only 12% of US families
// have a net worth exceeding $1M. Median net worth of US household: $192,700.

export function millionaireInsights(
  inputs: MillionaireInputs,
  outputs: MillionaireOutputs,
): Insight[] {
  const results: Insight[] = [];

  const savings     = Number(inputs.currentSavings);
  const contrib     = Number(inputs.monthlySavings);
  const rate        = Number(inputs.annualReturn);
  const years       = outputs.yearsToMillion   ?? 0;
  const contributed = outputs.totalContributed ?? 0;
  const interest    = outputs.interestEarned   ?? 0;
  const progress    = outputs.progressPercent  ?? (savings / 1_000_000 * 100);
  const mktPct      = outputs.marketContribPct ?? (contributed > 0 ? Math.round((interest / 1_000_000) * 100) : 0);
  const faster200   = outputs.yearsFasterWith200 ?? 0;
  const realValue   = outputs.realValueAtMillion ?? 0;
  const realYears   = outputs.yearsToRealMillion ?? 0;
  const extraYears  = outputs.extraYearsForReal  ?? 0;

  // 1. Already there
  if (savings >= 1_000_000) {
    results.push({
      id:       "millionaire.already-there",
      severity: "positive",
      category: "savings",
      title:    `${formatCurrency(savings)} — already past $1 million`,
      body:     `At a 4% withdrawal rate, ${formatCurrency(savings)} produces ${formatCurrency(Math.round(savings * 0.04 / 12))}/month in passive income. The Federal Reserve Survey of Consumer Finances (2022) found that only 12% of US families have a net worth above $1M.`,
      metric:   { label: "Monthly at 4% rule", value: formatCurrency(Math.round(savings * 0.04 / 12)) },
    });
    return results;
  }

  // 2. Progress bar — always shown
  results.push({
    id:       "millionaire.progress",
    severity: progress >= 75 ? "positive" : "neutral",
    category: "projection",
    title:    `${progress.toFixed(1)}% of the way to $1,000,000`,
    body:     `You have ${formatCurrency(savings)} invested — ${progress.toFixed(1)}% of $1,000,000. At ${formatCurrency(contrib)}/month at ${rate}%, you hit the $1M mark in ${years} years. Of the $1,000,000 total, ${formatCurrency(Math.round(contributed))} will come from your contributions and ${formatCurrency(Math.round(interest))} from compound growth.`,
    metric:   { label: "Current savings", value: formatCurrency(savings) },
    visualization: {
      type:           "benchmark-bar",
      userValue:      savings,
      userLabel:      "Current savings",
      benchmarkValue: 1_000_000,
      benchmarkLabel: "$1 million target",
      format:         "currency",
    },
  });

  // 2b. What the million is actually worth — live CPI
  if (realValue > 0 && years > 0 && years < 100) {
    results.push({
      id:       "millionaire.real-value",
      severity: "warning",
      category: "projection",
      title:    `Your $1M in ${years} years ≈ ${formatCurrency(realValue)} today`,
      body:     `Hitting $1,000,000 feels like the finish line, but inflation moves it. At the current ${fredBenchmarks.cpiInflationYoY}% CPI, a million dollars ${years} years from now will buy only what ${formatCurrency(realValue)} buys today. To bank a million in real, present-day spending power you'd need about ${realYears} years — roughly ${extraYears} years longer.`,
      metric:   { label: "Real value of $1M", value: formatCurrency(realValue) },
      visualization: {
        type:   "delta-card",
        before: { label: "$1M nominal",     value: formatCurrency(1_000_000) },
        after:  { label: "In today's $",     value: formatCurrency(realValue) },
        delta:  { label: "Lost to inflation", value: formatCurrency(1_000_000 - realValue), positive: false },
        caption: CPI_CAPTION,
      },
    });
  }

  // 3. Market does the heavy lifting
  if (mktPct >= 40) {
    results.push({
      id:       "millionaire.market-contribution",
      severity: "positive",
      category: "investment",
      title:    `${mktPct}% of your million comes from compound growth`,
      body:     `You will personally contribute ${formatCurrency(Math.round(contributed))} to reach $1,000,000. The remaining ${formatCurrency(Math.round(interest))} — ${mktPct}% of the total — comes from compound interest. The proportion that the market contributes grows every year as the balance increases.`,
      metric:   { label: "Growth above contributions", value: formatCurrency(Math.round(interest)) },
      visualization: {
        type:   "delta-card",
        before: { label: "Your contributions",   value: formatCurrency(Math.round(contributed)) },
        after:  { label: "Final portfolio",       value: formatCurrency(1_000_000) },
        delta:  { label: "Compound growth",       value: formatCurrency(Math.round(interest)), positive: true },
      },
    });
  }

  // 4. $200 accelerator
  if (faster200 >= 1) {
    results.push({
      id:       "millionaire.accelerator-200",
      severity: "positive",
      category: "opportunity-cost",
      title:    `${formatCurrency(200)}/month extra reaches $1M ${faster200} year${faster200 === 1 ? "" : "s"} sooner`,
      body:     `An extra ${formatCurrency(200)}/month — ${formatCurrency(200 * 12)}/year — moves your millionaire date forward by ${faster200} year${faster200 === 1 ? "" : "s"}. Because compound interest accelerates over time, saving those ${faster200} years near the end of the timeline has an outsized effect on total wealth.`,
      metric:   { label: "Years saved with +$200/mo", value: `${faster200}yr` },
    });
  }

  // 5. Projection line
  if (years > 0) {
    results.push({
      id:       "millionaire.projection",
      severity: "neutral",
      category: "projection",
      title:    `${years} year trajectory to $1,000,000`,
      body:     `${formatCurrency(contrib)}/month at ${rate}% annually, starting with ${formatCurrency(savings)}.`,
      metric:   { label: "Years to $1M", value: `${years}yr` },
      visualization: {
        type:   "projection-line",
        points: [1, 5, 10, 15, 20, Math.min(years, 30)].filter((y, i, a) => a.indexOf(y) === i && y <= (years + 1)).sort((a, b) => a - b).map((yr) => {
          const pv = savings * Math.pow(1 + rate / 100, yr);
          const contributions = Math.round(futureValueAnnuity(contrib * 12, yr, rate));
          return { label: `Yr ${yr}`, value: Math.round(pv + contributions) };
        }),
        format: "currency",
        yLabel: "Portfolio value",
        color:  "#f59e0b",
      },
    });
  }

  return results;
}
