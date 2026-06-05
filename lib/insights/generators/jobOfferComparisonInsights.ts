import type { Insight } from "../index";
import { formatCurrency } from "../benchmarks";

interface JobOfferInputs {
  salaryA:        number;
  salaryB:        number;
  commuteCostA:   number;
  commuteCostB:   number;
  benefitsValueA: number;
  benefitsValueB: number;
}

interface JobOfferOutputs {
  effectiveA?:         number;
  effectiveB?:         number;
  difference?:         number;
  monthlyGap?:         number;
  fiveYearGap?:        number;
  tenYearGap?:         number;
  benefitsGap?:        number;
  commuteGap?:         number;
  tenYearInvestedGap?: number;
}

export function jobOfferComparisonInsights(
  inputs: JobOfferInputs,
  outputs: JobOfferOutputs
): Insight[] {
  const results: Insight[] = [];

  const effA    = outputs.effectiveA  ?? 0;
  const effB    = outputs.effectiveB  ?? 0;
  const diff    = outputs.difference  ?? 0;
  const monthly = outputs.monthlyGap  ?? 0;
  const fiveYr  = outputs.fiveYearGap ?? 0;
  const tenYr   = outputs.tenYearGap  ?? 0;
  const benGap  = outputs.benefitsGap ?? 0;
  const commGap = outputs.commuteGap  ?? 0;
  const invested10 = outputs.tenYearInvestedGap ?? 0;
  const salaryA = Number(inputs.salaryA);
  const salaryB = Number(inputs.salaryB);
  const absDiff = Math.abs(diff);
  const winner  = diff >= 0 ? "A" : "B";
  const loser   = diff >= 0 ? "B" : "A";

  // 1. Headline comparison — always shown
  if (absDiff < 1000) {
    results.push({
      id:       "job.effectively-tied",
      severity: "neutral",
      category: "comparison",
      title:    `These offers are within ${formatCurrency(absDiff)}/year of each other in total compensation`,
      body:     `Job A effective comp: ${formatCurrency(effA)}. Job B effective comp: ${formatCurrency(effB)}. At this level of parity, non-financial factors — growth trajectory, manager quality, flexibility, culture — should drive the decision.`,
      metric:   { label: "Compensation gap", value: formatCurrency(absDiff) },
      visualization: {
        type:           "benchmark-bar",
        userValue:      Math.max(effA, effB),
        userLabel:      `Job ${winner}`,
        benchmarkValue: Math.min(effA, effB),
        benchmarkLabel: `Job ${loser}`,
        format:         "currency",
        caption:        { text: "Total effective compensation (salary + benefits − commute)" },
      },
    });
  } else {
    results.push({
      id:       "job.winner",
      severity: "positive",
      category: "comparison",
      title:    `Job ${winner} is worth ${formatCurrency(absDiff)}/year more — ${formatCurrency(Math.abs(monthly))}/month more in take-home`,
      body:     `Job A total compensation: ${formatCurrency(effA)}. Job B: ${formatCurrency(effB)}. The headline salary on Job ${loser} can be misleading — effective compensation is salary plus benefits value minus commute cost.`,
      metric:   { label: "Annual advantage (Job " + winner + ")", value: formatCurrency(absDiff) },
      visualization: {
        type:           "benchmark-bar",
        userValue:      Math.max(effA, effB),
        userLabel:      `Job ${winner}`,
        benchmarkValue: Math.min(effA, effB),
        benchmarkLabel: `Job ${loser}`,
        format:         "currency",
        caption:        { text: "Total effective compensation (salary + benefits − commute)" },
      },
    });
  }

  // 2. Multi-year wealth gap — projection visual
  if (absDiff >= 2000) {
    results.push({
      id:       "job.multi-year-gap",
      severity: "neutral",
      category: "projection",
      title:    `${formatCurrency(Math.abs(fiveYr))} gap at 5 years, ${formatCurrency(Math.abs(invested10))} at 10 years if invested`,
      body:     `The ${formatCurrency(Math.abs(monthly))}/month difference adds up to ${formatCurrency(Math.abs(tenYr))} over a decade — and ${formatCurrency(Math.abs(invested10))} if invested at 7%. Career decisions compound far beyond the first paycheck.`,
      metric:   { label: "10-year wealth gap (invested)", value: formatCurrency(Math.abs(invested10)) },
      visualization: {
        type:    "projection-line",
        format:  "currency",
        yLabel:  `Cumulative gap (Job ${winner})`,
        points:  [
          { label: "Now", value: 0 },
          { label: "1yr", value: Math.abs(diff) },
          { label: "3yr", value: Math.abs(diff) * 3 },
          { label: "5yr", value: Math.abs(fiveYr) },
          { label: "10yr", value: Math.abs(tenYr) },
        ],
        caption: { text: "Nominal cumulative gap — investing the monthly difference compounds it further" },
      },
    });
  }

  // 3. Benefits are the hidden differentiator — delta-card visual
  const absBenGap = Math.abs(benGap);
  if (absBenGap >= 2000) {
    const benWinner = benGap >= 0 ? "A" : "B";
    results.push({
      id:       "job.benefits-gap",
      severity: "neutral",
      category: "hidden-cost",
      title:    `Job ${benWinner} has ${formatCurrency(absBenGap)}/year more in benefits`,
      body:     `Health insurance, 401(k) match, equity, and PTO routinely add 20–30% to total compensation, and most are tax-advantaged — making them worth even more than the headline figure. These never appear in the salary offer.`,
      metric:   { label: "Benefits advantage", value: formatCurrency(absBenGap) },
      visualization: {
        type:   "delta-card",
        before: { label: "Job A benefits", value: formatCurrency(Number(inputs.benefitsValueA)) },
        after:  { label: "Job B benefits", value: formatCurrency(Number(inputs.benefitsValueB)) },
        delta:  { label: `Job ${benWinner} edge`, value: formatCurrency(absBenGap), positive: true },
      },
    });
  }

  // 4. Commute cost — paid in after-tax dollars
  const absCommGap = Math.abs(commGap);
  if (absCommGap >= 1000) {
    const commWinner = commGap >= 0 ? "B" : "A";
    const grossNeeded = Math.round(absCommGap / 0.75);
    results.push({
      id:       "job.commute-tax",
      severity: "neutral",
      category: "hidden-cost",
      title:    `Commute difference: ${formatCurrency(absCommGap)}/year — a hidden salary cut`,
      body:     `Job ${commWinner} has the commute advantage. Commute costs are paid with after-tax dollars — at a 25% marginal rate, ${formatCurrency(absCommGap)} in commute costs takes ${formatCurrency(grossNeeded)} of gross income to cover. That never appears on an offer letter.`,
      metric:   { label: "Annual commute gap", value: formatCurrency(absCommGap) },
    });
  }

  // 5. Salary vs effective comp divergence — the headline trap
  const salaryDiff = salaryB - salaryA;
  if (salaryDiff > 0 && diff > 0) {
    results.push({
      id:       "job.salary-deception",
      severity: "warning",
      category: "hidden-cost",
      title:    `Job B pays ${formatCurrency(Math.abs(salaryDiff))} more in salary — but Job A wins on total compensation`,
      body:     `A higher salary does not always mean higher total value. Once benefits and commute are factored in, Job A delivers more actual money. Always compare effective compensation, not headline figures.`,
      metric:   { label: "Salary vs comp flip", value: formatCurrency(Math.abs(salaryDiff)) },
    });
  } else if (salaryDiff < 0 && diff < 0) {
    results.push({
      id:       "job.salary-deception",
      severity: "warning",
      category: "hidden-cost",
      title:    `Job A pays ${formatCurrency(Math.abs(salaryDiff))} more in salary — but Job B wins on total compensation`,
      body:     `Job B's lower salary is offset by superior benefits and commute savings. The number that matters is effective total compensation, not the salary on the offer letter.`,
      metric:   { label: "Salary vs comp flip", value: formatCurrency(Math.abs(salaryDiff)) },
    });
  }

  return results;
}
