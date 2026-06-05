import type { Insight } from "@/lib/insights/types";
import { formatCurrency } from "@/lib/insights/benchmarks";
import { futureValueAnnuity } from "@/lib/insights/projections";

export interface TimeToRetirementInputs {
  expenses:       number;
  current:        number;
  monthlySavings: number;
  returnRate:     number;
}

export interface TimeToRetirementOutputs {
  yearsToRetire:    number;
  retirementTarget: number;
  retirementGap?:        number;
  savingsProgress?:      number;
  projectedBalance10yr?: number;
  annualContribution?:   number;
}

export function generateTimeToRetirementInsights(
  inputs:  TimeToRetirementInputs,
  outputs: TimeToRetirementOutputs,
): Insight[] {
  const insights: Insight[] = [];

  const { expenses, current, monthlySavings, returnRate } = inputs;
  const {
    yearsToRetire,
    retirementTarget,
    retirementGap       = Math.max(0, retirementTarget - current),
    savingsProgress     = current / Math.max(retirementTarget, 1),
    projectedBalance10yr = 0,
    annualContribution  = monthlySavings * 12,
  } = outputs;

  const progressPct = Math.round(savingsProgress * 100);

  // 1. Already there
  if (progressPct >= 100) {
    insights.push({
      id:       "ttretire.savings-complete",
      severity: "positive",
      category: "savings",
      title:    `${formatCurrency(current)} — retirement target already reached`,
      body:     `Your current savings exceed the ${formatCurrency(retirementTarget)} target. At ${returnRate}% return and a 4% withdrawal rate, ${formatCurrency(current)} supports approximately ${formatCurrency(Math.round(current * 0.04 / 12))}/month in passive income indefinitely.`,
      metric:   { label: "Passive income at 4%", value: `${formatCurrency(Math.round(current * 0.04 / 12))}/mo` },
    });
    return insights;
  }

  // 2. Progress — always shown
  insights.push({
    id:       "ttretire.savings-progress",
    severity: progressPct >= 50 ? "neutral" : "neutral",
    category: "projection",
    title:    `${progressPct}% of the way to a ${formatCurrency(retirementTarget)} retirement target`,
    body:     `Your ${formatCurrency(current)} covers ${progressPct}% of your retirement number — ${formatCurrency(retirementGap)} still to close. At ${formatCurrency(monthlySavings)}/month and ${returnRate}% return, the projected timeline is ${yearsToRetire > 0 ? `${yearsToRetire} years` : "calculable once inputs are set"}.`,
    metric:   { label: "Gap to target", value: formatCurrency(retirementGap) },
    visualization: {
      type:           "benchmark-bar",
      userValue:      current,
      userLabel:      "Current savings",
      benchmarkValue: retirementTarget,
      benchmarkLabel: "Retirement target (25×)",
      format:         "currency",
    },
  });

  // 3. Long timeline — urgency is compounding math
  if (yearsToRetire > 35) {
    const extra300 = Math.round(futureValueAnnuity((monthlySavings + 300) * 12, yearsToRetire, returnRate));
    insights.push({
      id:       "ttretire.late-timeline",
      severity: "neutral",
      category: "projection",
      title:    `${yearsToRetire} years at current pace`,
      body:     `With ${yearsToRetire} years of compounding ahead, increasing contributions by ${formatCurrency(300)}/month today has an outsized effect. An extra ${formatCurrency(300)}/month from now would push the 10-year balance significantly higher because the extra amount compounds for the entire remaining horizon.`,
      metric:   { label: "Years to retire", value: `${yearsToRetire}yr` },
    });
  } else if (yearsToRetire <= 20 && yearsToRetire > 0) {
    insights.push({
      id:       "ttretire.on-track",
      severity: "positive",
      category: "projection",
      title:    `On track for retirement in ${yearsToRetire} years`,
      body:     `At ${formatCurrency(monthlySavings)}/month and ${returnRate}% annual return, you reach ${formatCurrency(retirementTarget)} in ${yearsToRetire} years. The Vanguard Center for Investor Research found consistent savers retire an average of 4 years earlier than irregular savers.`,
      metric:   { label: "Years to retirement", value: `${yearsToRetire}yr` },
    });
  }

  // 4. 10-year milestone
  if (projectedBalance10yr > 0) {
    const pct10yr = retirementTarget > 0 ? Math.round((projectedBalance10yr / retirementTarget) * 100) : 0;
    insights.push({
      id:       "ttretire.10yr-projection",
      severity: "neutral",
      category: "projection",
      title:    `${formatCurrency(projectedBalance10yr)} projected in 10 years — ${pct10yr}% of target`,
      body:     `${formatCurrency(monthlySavings)}/month at ${returnRate}% for 10 years from today produces ${formatCurrency(projectedBalance10yr)}. The remaining ${100 - pct10yr}% of the target is then reached through continued contributions and the compounding on this larger base.`,
      metric:   { label: "10-year balance", value: formatCurrency(projectedBalance10yr) },
      visualization: {
        type:   "projection-line",
        points: [1, 3, 5, 10, 20, Math.min(yearsToRetire, 30)].filter((y, i, a) => a.indexOf(y) === i && y <= yearsToRetire).sort((a, b) => a - b).map((yr) => {
          const pv = current * Math.pow(1 + returnRate / 100, yr);
          return { label: `Yr ${yr}`, value: Math.round(pv + futureValueAnnuity(annualContribution, yr, returnRate)) };
        }),
        format: "currency",
        yLabel: "Portfolio value",
        color:  "#6366f1",
      },
    });
  }

  return insights;
}
