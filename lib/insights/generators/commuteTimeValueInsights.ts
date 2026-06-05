import type { Insight } from "../types";
import { formatCurrency } from "../benchmarks";
import { futureValueAnnuity } from "../projections";

export interface CommuteTimeValueInsightInputs {
  dailyMins:  number;
  hourlyWage: number;
  workDays:   number;
}

export interface CommuteTimeValueInsightOutputs {
  annualHours?:         number;
  annualCost?:          number;
  salaryLostPct?:       number;
  effectiveHourlyRate?: number;
}

// A typical US commute consumes roughly this share of salary value.
const TYPICAL_SALARY_LOSS_PCT = 10;
const CAREER_YEARS = 40;

export function commuteTimeValueInsights(
  inputs:  CommuteTimeValueInsightInputs,
  outputs: CommuteTimeValueInsightOutputs,
): Insight[] {
  const dailyMins = Number(inputs.dailyMins);
  const wage      = Number(inputs.hourlyWage);
  const hours     = outputs.annualHours         ?? (dailyMins / 60) * Number(inputs.workDays);
  const cost      = outputs.annualCost          ?? hours * wage;
  const pct       = outputs.salaryLostPct       ?? 0;
  const effRate   = outputs.effectiveHourlyRate ?? wage;
  const fullDays  = hours / 8;

  const results: Insight[] = [];

  // 1. Headline — hours and dollars lost
  results.push({
    id:       "commute-time-value.headline",
    severity: "warning",
    category: "time-loss",
    title:    `Your commute costs ${hours.toFixed(0)} hours a year — ${fullDays.toFixed(1)} working days`,
    body:     `A ${dailyMins}-minute daily commute adds ${hours.toFixed(0)} unpaid hours over the year, worth ${formatCurrency(cost)} at your ${formatCurrency(wage)}/hour rate. That is time and money your salary never accounts for.`,
    metric:   { label: "Time value lost", value: formatCurrency(cost) },
    priority: 100,
  });

  // 2. Effective rate drop — the headline trap
  results.push({
    id:       "commute-time-value.effective-rate",
    severity: "neutral",
    category: "hidden-cost",
    title:    `Your real rate is ${formatCurrency(effRate)}/hr, not ${formatCurrency(wage)}/hr`,
    body:     `Once unpaid commute hours are folded in, your effective hourly rate drops from ${formatCurrency(wage)} to ${formatCurrency(effRate)}. This is the number to use when comparing job offers — a higher salary with a longer commute can pay less per real hour.`,
    metric:   { label: "Effective rate", value: `${formatCurrency(effRate)}/hr` },
    priority: 80,
    visualization: {
      type:   "delta-card",
      before: { label: "Stated rate", value: `${formatCurrency(wage)}/hr` },
      after:  { label: "Effective rate", value: `${formatCurrency(effRate)}/hr` },
      delta:  { label: "Per-hour cut", value: `${formatCurrency(wage - effRate)}/hr`, positive: false },
    },
  });

  // 3. Salary % consumed vs typical
  if (pct > 0) {
    results.push({
      id:       "commute-time-value.salary-pct",
      severity: pct >= 15 ? "warning" : "neutral",
      category: "benchmark-comparison",
      title:    `${pct.toFixed(1)}% of your salary value disappears into transit`,
      body:     `A typical US commute eats around ${TYPICAL_SALARY_LOSS_PCT}% of salary value. Yours runs ${pct.toFixed(1)}% — ${pct >= TYPICAL_SALARY_LOSS_PCT ? "above" : "below"} that benchmark. Long commutes effectively price workers out of jobs that look fine on paper.`,
      metric:   { label: "Salary consumed", value: `${pct.toFixed(1)}%` },
      priority: 60,
      visualization: {
        type:           "benchmark-bar",
        userValue:      pct,
        userLabel:      "Your commute",
        benchmarkValue: TYPICAL_SALARY_LOSS_PCT,
        benchmarkLabel: "Typical commute",
        format:         "percent",
      },
    });
  }

  // 4. Investment opportunity — the dollars compounded
  if (cost > 0) {
    const invested10 = futureValueAnnuity(cost, 10);
    const invested30 = futureValueAnnuity(cost, 30);
    results.push({
      id:       "commute-time-value.invested",
      severity: "neutral",
      category: "investment-opportunity",
      title:    `That lost time value is ${formatCurrency(invested30)} over a career if invested`,
      body:     `Redirecting the ${formatCurrency(cost)}/year time cost into investments at 7% would build ${formatCurrency(invested10)} in 10 years and ${formatCurrency(invested30)} in 30. Cutting your commute is one of the few raises you can give yourself.`,
      metric:   { label: "30-year value", value: formatCurrency(invested30) },
      priority: 50,
      visualization: {
        type:    "projection-line",
        format:  "currency",
        yLabel:  "If invested",
        points:  [
          { label: "Now", value: 0 },
          { label: "5yr", value: futureValueAnnuity(cost, 5) },
          { label: "10yr", value: invested10 },
          { label: "30yr", value: invested30 },
        ],
        caption: { text: "Annual commute time value invested at 7%" },
      },
    });
  }

  // 5. Remote-day lever
  if (cost > 0) {
    const oneDaySaving = cost * 0.2;
    results.push({
      id:       "commute-time-value.remote-day",
      severity: "positive",
      category: "savings",
      title:    `One remote day a week hands back ${formatCurrency(oneDaySaving)}/year`,
      body:     `Each day you skip the commute is a day of reclaimed time and money. A single weekly work-from-home day cuts the cost by 20% — ${formatCurrency(oneDaySaving)} a year — and fully remote eliminates it entirely.`,
      metric:   { label: "Per remote day/wk", value: formatCurrency(oneDaySaving) },
      priority: 40,
    });
  }

  // 6. Career-scale total
  if (cost > 0) {
    results.push({
      id:       "commute-time-value.career",
      severity: "neutral",
      category: "projection",
      title:    `Over a ${CAREER_YEARS}-year career that is ${(fullDays * CAREER_YEARS / 365).toFixed(1)} years of life in transit`,
      body:     `At ${hours.toFixed(0)} hours a year, a ${CAREER_YEARS}-year career spends roughly ${(hours * CAREER_YEARS / 24 / 365).toFixed(1)} full years of waking life commuting — before counting the ${formatCurrency(cost * CAREER_YEARS)} of nominal time value.`,
      metric:   { label: "Career time value", value: formatCurrency(cost * CAREER_YEARS) },
      priority: 30,
    });
  }

  return results.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
