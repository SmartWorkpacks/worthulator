// ─── WorthCore Insight Engine — Procrastination Cost Generator ───────────────
//
// PURPOSE:
//   State-aware visual insights for the procrastination-cost calculator. Uses
//   BLS median wage, workplace benchmark comparison, compound projection,
//   and marginal improvement delta-card.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Live median wage carries provenance caption
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { formatCurrency } from "@/lib/insights/benchmarks";
import { futureValueAnnuity } from "@/lib/insights/projections";
import { usStateMedianWageDataset } from "@/lib/datasets/regional/usStateMedianWages";

/** Salary.com 2012: employees waste avg 2.09 hrs/day. */
const US_AVG_PROCRASTINATION = 2.09;

export interface ProcrastinationInputs {
  hoursPerDay: number;
  daysPerYear: number;
  state: string;
  /** Optional user-entered hourly rate; when > 0 it overrides the state median. */
  hourlyRateOverride?: number;
}

export interface ProcrastinationOutputs {
  dailyLoss: number;
  weeklyLoss: number;
  monthlyLoss: number;
  annualLoss: number;
  tenYearLoss: number;
  careerLoss: number;
  stateMedianWage: number;
  halfHourSaving: number;
  excessHoursPerDay: number;
  excessAnnualLoss: number;
  annualHoursLost: number;
  daysLostPerYear: number;
}

export function procrastinationCostInsights(
  inputs: ProcrastinationInputs,
  outputs: ProcrastinationOutputs,
): Insight[] {
  const insights: Insight[] = [];

  const { hoursPerDay, daysPerYear, state } = inputs;
  const {
    dailyLoss,
    annualLoss,
    monthlyLoss,
    tenYearLoss,
    careerLoss,
    stateMedianWage,
    halfHourSaving,
    excessHoursPerDay,
    excessAnnualLoss,
    annualHoursLost,
    daysLostPerYear,
  } = outputs;

  if (hoursPerDay <= 0) return insights;

  const isCustomRate = (inputs.hourlyRateOverride ?? 0) > 0;
  const stateLabel =
    state && state !== "National" ? state : "the US average";
  const isSpecificState = state && state !== "National";
  // When the user supplies their own rate, the value isn't BLS-sourced — say so.
  const rateLabel = isCustomRate ? "your rate" : `${stateLabel}'s median wage`;

  const liveCaption = isCustomRate
    ? {
        text: `Your entered rate $${stateMedianWage.toFixed(2)}/hr`,
        asOf: usStateMedianWageDataset.currentPeriodLabel,
        live: false,
      }
    : {
        text: `${stateLabel} median wage $${stateMedianWage.toFixed(2)}/hr (BLS OEWS)`,
        asOf: usStateMedianWageDataset.currentPeriodLabel,
        live: true,
      };

  // ── 1. Annual cost — benchmark-bar vs workplace avg ─────────────────────
  insights.push({
    id: "procrastination.annual",
    severity: annualLoss > 15000 ? "warning" : "neutral",
    category: "time-loss",
    title: `${formatCurrency(annualLoss)}/year — ${annualHoursLost} hours, ${daysLostPerYear} full days`,
    body: `At ${rateLabel} of $${stateMedianWage.toFixed(2)}/hr, ${hoursPerDay} hours/day × ${daysPerYear} working days costs ${formatCurrency(dailyLoss)}/day — ${formatCurrency(annualLoss)}/year. Salary.com research found employees average 2.09 hours of procrastination per day, costing US employers an estimated $544 billion annually.`,
    metric: { label: "Annual cost", value: formatCurrency(annualLoss) },
    visualization: {
      type: "benchmark-bar",
      userValue: hoursPerDay,
      userLabel: "Your procrastination",
      benchmarkValue: US_AVG_PROCRASTINATION,
      benchmarkLabel: "Workplace avg (2.1hr)",
      format: "number",
      caption: liveCaption,
    } satisfies InsightVisualization,
  });

  // ── 2. 10-year and career compound cost — projection-line ───────────────
  if (annualLoss > 2000) {
    insights.push({
      id: "procrastination.compound",
      severity: "neutral",
      category: "opportunity-cost",
      title: `${formatCurrency(tenYearLoss)} over 10 years — ${formatCurrency(careerLoss)} over a 20-year career`,
      body: `${formatCurrency(annualLoss)}/year invested at 7% instead of being wasted grows to ${formatCurrency(tenYearLoss)} in 10 years and ${formatCurrency(careerLoss)} in 20. This isn't hypothetical — it's the compounding value of hours spent on low-value avoidance rather than productive output.`,
      visualization: {
        type: "projection-line",
        points: [1, 3, 5, 10, 15, 20].map((yr) => ({
          label: `Yr ${yr}`,
          value: Math.round(futureValueAnnuity(annualLoss, yr)),
        })),
        format: "currency",
        yLabel: "Invested value of time wasted",
        color: "#f97316",
        caption: liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── 3. 30-minute improvement — delta-card ───────────────────────────────
  if (hoursPerDay >= 1) {
    insights.push({
      id: "procrastination.marginal",
      severity: "positive",
      category: "habit",
      title: `Cut 30 minutes/day → ${formatCurrency(halfHourSaving)}/year reclaimed`,
      body: `30 minutes less procrastination per day — at $${stateMedianWage.toFixed(2)}/hr — reclaims ${formatCurrency(halfHourSaving)}/year. That's ${formatCurrency(Math.round(halfHourSaving / 12))}/month without changing working hours. The 2-minute rule (do anything under 2 minutes immediately) is one of the most effective ways to shave this time.`,
      visualization: {
        type: "delta-card",
        before: { label: "Current / yr", value: formatCurrency(annualLoss) },
        after: {
          label: "Minus 30min/day",
          value: formatCurrency(annualLoss - halfHourSaving),
        },
        delta: {
          label: "Recovered / yr",
          value: formatCurrency(halfHourSaving),
          positive: true,
        },
      } satisfies InsightVisualization,
    });
  }

  // ── 4. Above-average procrastinator ─────────────────────────────────────
  if (excessHoursPerDay > 0 && excessAnnualLoss > 0) {
    insights.push({
      id: "procrastination.above-average",
      severity: "warning",
      category: "comparison",
      title: `${excessHoursPerDay}hr/day above the workplace average — ${formatCurrency(excessAnnualLoss)}/year extra`,
      body: `The average employee procrastinates 2.09 hours/day (Salary.com). Your ${hoursPerDay}hr is ${excessHoursPerDay}hr more. At $${stateMedianWage.toFixed(2)}/hr, those excess hours cost ${formatCurrency(excessAnnualLoss)}/year beyond what even average procrastination costs. Cutting just the excess would be a major win.`,
      metric: {
        label: "Excess cost/yr",
        value: formatCurrency(excessAnnualLoss),
      },
    });
  }

  // ── 5. Monthly framing — Roth IRA comparison ───────────────────────────
  if (monthlyLoss > 200) {
    const monthsToRoth = Math.ceil(7000 / monthlyLoss);
    insights.push({
      id: "procrastination.monthly",
      severity: "neutral",
      category: "spending",
      title: `${formatCurrency(monthlyLoss)}/month — a max Roth IRA in ${monthsToRoth} months`,
      body: `${formatCurrency(annualLoss)}/year is ${formatCurrency(monthlyLoss)}/month. The 2024 max Roth IRA contribution is $7,000 — at your procrastination rate, you lose that equivalent in ${monthsToRoth} months. Treating procrastination cost like a recurring bill makes the number impossible to ignore.`,
      metric: {
        label: "Monthly procrastination cost",
        value: formatCurrency(monthlyLoss),
      },
    });
  }

  // ── 6. State wage context ──────────────────────────────────────────────
  // Skip when a custom rate overrides the state median — the comparison
  // to the national median would be meaningless.
  if (isSpecificState && !isCustomRate) {
    const nationalLoss = Math.round(
      hoursPerDay * usStateMedianWageDataset.national * daysPerYear,
    );
    const diff = annualLoss - nationalLoss;
    if (Math.abs(diff) > 500) {
      insights.push({
        id: "procrastination.state-context",
        severity: "neutral",
        category: "comparison",
        title:
          diff > 0
            ? `${state}'s higher wages make procrastination cost ${formatCurrency(diff)}/year more`
            : `${state}'s lower wages reduce procrastination cost by ${formatCurrency(Math.abs(diff))}/year`,
        body: `${state}'s median wage of $${stateMedianWage.toFixed(2)}/hr ${diff > 0 ? "exceeds" : "falls below"} the national median of $${usStateMedianWageDataset.national.toFixed(2)}/hr. In a higher-wage state, every wasted hour costs more — making time management proportionally more valuable here.`,
        metric: {
          label: `${state} median wage`,
          value: `$${stateMedianWage.toFixed(2)}/hr`,
        },
      });
    }
  }

  return insights;
}
