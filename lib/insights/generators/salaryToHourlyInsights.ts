// ─── Salary to Hourly Insight Generator ──────────────────────────────────────
//
// Produces live WorthCore insights for the salary-to-hourly calculator.
// Called on every slider change via LiveInsightBlock → GENERATOR_REGISTRY.
//
// Rules:
//   salary.per-minute     — always fires — $/minute earned (relatability anchor)
//   salary.below-median   — hourlyRate < 25 → neutral (below US median ~$30)
//   salary.strong-rate    — hourlyRate >= 50 → positive
//   salary.overtime-dilution — hoursPerWeek > 45 → neutral
//   salary.vacation-cost  — weeksPerYear < 50 → neutral (cost of vacation weeks)
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight } from "@/lib/insights/types";

// US median hourly wage 2026 (~$30/hr)
const US_MEDIAN_HOURLY = 30;

export interface SalaryToHourlyInputs {
  annualSalary:  number;   // $
  hoursPerWeek:  number;   // hours
  weeksPerYear:  number;   // weeks
}

export interface SalaryToHourlyOutputs {
  hourlyRate:    number;
  dailyRate:     number;
  weeklyRate:    number;
  monthlyRate:   number;
  hoursPerYear?:     number;
  perMinuteRate?:    number;
  minutesPerDollar?: number;
}

export function generateSalaryToHourlyInsights(
  inputs:  SalaryToHourlyInputs,
  outputs: SalaryToHourlyOutputs,
): Insight[] {
  const insights: Insight[] = [];

  const { annualSalary, hoursPerWeek, weeksPerYear } = inputs;
  const {
    hourlyRate,
    dailyRate,
    hoursPerYear     = hoursPerWeek * weeksPerYear,
    perMinuteRate    = hourlyRate / 60,
    minutesPerDollar = hourlyRate > 0 ? 60 / hourlyRate : 0,
  } = outputs;

  // ── 1. Per-minute rate (always fires) ────────────────────────────────────
  insights.push({
    id:       "salary.per-minute",
    severity: "neutral",
    category: "comparison",
    title:    `$${hourlyRate.toFixed(2)}/hour — $${perMinuteRate.toFixed(2)} every minute you work`,
    body:     `At $${hourlyRate.toFixed(2)}/hour, one minute of your work time is worth $${perMinuteRate.toFixed(2)}. Your daily rate is $${dailyRate.toFixed(0)} across ${Math.round(hoursPerWeek / 5)} hours. You work ${hoursPerYear.toLocaleString()} hours per year.`,
    metric:   { label: "Hourly rate", value: `$${hourlyRate.toFixed(2)}` },
  });

  // ── 2. Below US median ────────────────────────────────────────────────────
  if (hourlyRate < US_MEDIAN_HOURLY) {
    const gap = Math.round((US_MEDIAN_HOURLY - hourlyRate) * hoursPerYear);
    insights.push({
      id:       "salary.below-median",
      severity: "neutral",
      category: "comparison",
      title:    `$${hourlyRate.toFixed(2)}/hr is below the US median of ~$${US_MEDIAN_HOURLY}/hr`,
      body:     `The US median wage is approximately $${US_MEDIAN_HOURLY}/hour. Closing that gap would add $${gap.toLocaleString()} to your annual income. In the same field, a role change, certification, or negotiation at next review commonly produces the fastest movement.`,
      metric:   { label: "Gap to US median/yr", value: `$${gap.toLocaleString()}` },
      visualization: {
        type:           "benchmark-bar",
        userValue:      hourlyRate,
        userLabel:      "Your hourly rate",
        benchmarkValue: US_MEDIAN_HOURLY,
        benchmarkLabel: "US median hourly",
        format:         "currency",
      },
    });
  }

  // ── 3. Strong rate ────────────────────────────────────────────────────────
  if (hourlyRate >= 50) {
    insights.push({
      id:       "salary.strong-rate",
      severity: "positive",
      category: "comparison",
      title:    `$${hourlyRate.toFixed(2)}/hr — ${Math.round((hourlyRate / US_MEDIAN_HOURLY - 1) * 100)}% above the US median`,
      body:     `At $${hourlyRate.toFixed(2)}/hour, you are in the upper quartile of US earners. At this income level, maxing tax-advantaged accounts (401k, HSA, backdoor Roth) has the largest impact on long-term wealth relative to after-tax alternatives.`,
      metric:   { label: "Above median", value: `+${Math.round((hourlyRate / US_MEDIAN_HOURLY - 1) * 100)}%` },
    });
  }

  // ── 4. Overtime hour dilution ─────────────────────────────────────────────
  if (hoursPerWeek > 45) {
    const standardHourly = Math.round(annualSalary / (40 * weeksPerYear) * 100) / 100;
    insights.push({
      id:       "salary.overtime-dilution",
      severity: "neutral",
      category: "hidden-cost",
      title:    `${hoursPerWeek}h/week reduces your effective hourly from $${standardHourly.toFixed(2)} to $${hourlyRate.toFixed(2)}`,
      body:     `If your role were 40 hours/week, your hourly would be $${standardHourly.toFixed(2)}. The extra ${hoursPerWeek - 40} hours/week cuts your effective rate by ${Math.round((1 - hourlyRate / standardHourly) * 100)}%. Those additional hours are compensated at $0/hr — a hidden salary reduction.`,
      metric:   { label: "Rate dilution", value: `-${Math.round((1 - hourlyRate / standardHourly) * 100)}%` },
    });
  }

  // ── 5. Vacation cost awareness ────────────────────────────────────────────
  if (weeksPerYear < 50) {
    const vacationWeeks = 52 - weeksPerYear;
    const vacationValue = Math.round(hourlyRate * hoursPerWeek * vacationWeeks);
    insights.push({
      id:       "salary.vacation-cost",
      severity: "neutral",
      category: "hidden-cost",
      title:    `${vacationWeeks} week${vacationWeeks > 1 ? "s" : ""} off = $${vacationValue.toLocaleString()} in foregone earnings`,
      body:     `You are calculating on ${weeksPerYear} worked weeks. Those ${vacationWeeks} week${vacationWeeks > 1 ? "s" : ""} off represent $${vacationValue.toLocaleString()} of earnings at your rate. Roles without paid leave absorb this cost directly — it is a real factor in total compensation comparisons.`,
      metric:   { label: "Value of time off", value: `$${vacationValue.toLocaleString()}` },
    });
  }

  return insights;
}
