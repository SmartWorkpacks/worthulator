// ─── WorthCore Insight Engine — Screen Time Impact Generator ─────────────────
//
// PURPOSE:
//   State-aware visual insights for the screen-time-impact calculator. Surfaces
//   annual opportunity cost at state median wage, vs-average comparison,
//   one-hour reduction delta, and 10/30-year investment projection.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Live median wage carries a provenance caption with vintage
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { formatCurrency } from "@/lib/insights/benchmarks";
import { futureValueAnnuity } from "@/lib/insights/projections";
import { usStateMedianWageDataset, US_AVG_SCREEN_HRS } from "./screenTimeConstants";

export { US_AVG_SCREEN_HRS };

export interface ScreenTimeInputs {
  hoursPerDay: number;
  yearsAhead: number;
  state: string;
  /** Optional user-entered hourly rate; when > 0 it overrides the state median. */
  hourlyRateOverride?: number;
}

export interface ScreenTimeOutputs {
  annualCost: number;
  weeklyHours: number;
  lifetimeDays: number;
  monthlyCost: number;
  dailyCost: number;
  stateMedianWage: number;
  excessHoursPerDay: number;
  excessAnnualCost: number;
  oneHourAnnualSaving: number;
  oneHourInvested10yr: number;
  invested10yr: number;
  invested30yr: number;
  daysPerYear: number;
}

export function screenTimeInsights(
  inputs: ScreenTimeInputs,
  outputs: ScreenTimeOutputs,
): Insight[] {
  const insights: Insight[] = [];

  const { hoursPerDay, yearsAhead, state } = inputs;
  const {
    annualCost,
    stateMedianWage,
    excessHoursPerDay,
    excessAnnualCost,
    oneHourAnnualSaving,
    oneHourInvested10yr,
    invested10yr,
    invested30yr,
    daysPerYear,
    lifetimeDays,
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

  // ── 1. Annual cost with time context — benchmark-bar vs US avg ──────────
  const yearlyHours = Math.round(hoursPerDay * 365);
  insights.push({
    id: "screen.annual-cost",
    severity: hoursPerDay >= 6 ? "warning" : "neutral",
    category: "opportunity-cost",
    title: `${formatCurrency(annualCost)}/year — ${daysPerYear} full days consumed`,
    body: `At ${rateLabel} of $${stateMedianWage.toFixed(2)}/hr, ${hoursPerDay} hours/day of non-work screen time represents ${formatCurrency(annualCost)}/year in opportunity cost — ${yearlyHours} hours or ${daysPerYear} full days. Over ${yearsAhead} years, that's ${Math.round(lifetimeDays)} days of your life.`,
    metric: { label: "Per year", value: formatCurrency(annualCost) },
    visualization: {
      type: "benchmark-bar",
      userValue: hoursPerDay,
      userLabel: "Your screen time",
      benchmarkValue: US_AVG_SCREEN_HRS,
      benchmarkLabel: "US average (4.4hr)",
      format: "number",
      caption: liveCaption,
    } satisfies InsightVisualization,
  });

  // ── 2. 10-year and 30-year investment projection — projection-line ──────
  if (annualCost > 0) {
    insights.push({
      id: "screen.investment-projection",
      severity: "neutral",
      category: "projection",
      title: `${formatCurrency(invested10yr)} over 10 years — ${formatCurrency(invested30yr)} over 30`,
      body: `If you could redirect even half this time to income-generating work at $${stateMedianWage.toFixed(2)}/hr and invest the difference at 7%, ${formatCurrency(Math.round(annualCost / 2))}/year grows to ${formatCurrency(Math.round(futureValueAnnuity(annualCost / 2, 10)))} in 10 years. The full opportunity cost invested: ${formatCurrency(invested10yr)} at 10 years, ${formatCurrency(invested30yr)} at 30.`,
      visualization: {
        type: "projection-line",
        points: [1, 3, 5, 10, 20, 30].map((yr) => ({
          label: `Yr ${yr}`,
          value: Math.round(futureValueAnnuity(annualCost, yr)),
        })),
        format: "currency",
        yLabel: "Invested opportunity cost",
        color: "#6366f1",
        caption: liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── 3. Above-average usage — fires only when measurably above avg ───────
  if (excessHoursPerDay >= 0.5) {
    const excessDays = Math.round((excessHoursPerDay * 365) / 24 * 10) / 10;
    insights.push({
      id: "screen.above-average",
      severity: "warning",
      category: "comparison",
      title: `${excessHoursPerDay.toFixed(1)} hours/day above the US average — ${formatCurrency(excessAnnualCost)}/year`,
      body: `The average American spends ${US_AVG_SCREEN_HRS} hours/day on non-work screens. Your ${hoursPerDay}hr is ${excessHoursPerDay.toFixed(1)} hours more — ${excessDays} extra days/year. At $${stateMedianWage.toFixed(2)}/hr, those excess hours cost ${formatCurrency(excessAnnualCost)}/year. Even cutting just the excess would reclaim ${formatCurrency(excessAnnualCost)}.`,
      metric: {
        label: "Excess cost/yr",
        value: formatCurrency(excessAnnualCost),
      },
    });
  }

  // ── 4. One-hour reduction — delta-card ──────────────────────────────────
  if (hoursPerDay > 1) {
    insights.push({
      id: "screen.one-hour-cut",
      severity: "positive",
      category: "habit",
      title: `Cut 1 hour/day → ${formatCurrency(oneHourAnnualSaving)}/year reclaimed`,
      body: `One hour less per day is 365 hours/year — 15.2 full days. At $${stateMedianWage.toFixed(2)}/hr, that's ${formatCurrency(oneHourAnnualSaving)}/year in reclaimed time value. Invested at 7% for 10 years: ${formatCurrency(oneHourInvested10yr)}. Most people who track screen time reduce it by 1–2 hours within the first week.`,
      visualization: {
        type: "delta-card",
        before: {
          label: "Current / yr",
          value: formatCurrency(annualCost),
        },
        after: {
          label: "Minus 1hr/day",
          value: formatCurrency(annualCost - oneHourAnnualSaving),
        },
        delta: {
          label: "Reclaimed / yr",
          value: formatCurrency(oneHourAnnualSaving),
          positive: true,
        },
      } satisfies InsightVisualization,
    });
  }

  // ── 5. State wage context — when a specific state is selected ───────────
  // Skip when a custom rate overrides the state median — comparison is moot.
  if (isSpecificState && !isCustomRate) {
    const nationalCost = Math.round(
      hoursPerDay * 365 * usStateMedianWageDataset.national,
    );
    const diff = annualCost - nationalCost;
    const pct = Math.round(
      ((stateMedianWage / usStateMedianWageDataset.national) - 1) * 100,
    );
    if (Math.abs(pct) >= 10) {
      insights.push({
        id: "screen.state-wage-context",
        severity: "neutral",
        category: "comparison",
        title:
          diff > 0
            ? `${state}'s higher wages make screen time cost ${formatCurrency(Math.abs(diff))}/year more`
            : `${state}'s lower wages reduce screen time cost by ${formatCurrency(Math.abs(diff))}/year`,
        body: `${state}'s median wage of $${stateMedianWage.toFixed(2)}/hr is ${Math.abs(pct)}% ${pct > 0 ? "above" : "below"} the national median of $${usStateMedianWageDataset.national.toFixed(2)}/hr. That means every hour of screen time has a ${pct > 0 ? "higher" : "lower"} opportunity cost here — ${formatCurrency(Math.round(stateMedianWage))}/hr vs the national ${formatCurrency(Math.round(usStateMedianWageDataset.national))}/hr.`,
        metric: {
          label: `${state} median wage`,
          value: `$${stateMedianWage.toFixed(2)}/hr`,
        },
      });
    }
  }

  // ── 6. Lifetime perspective — when years > 20 ──────────────────────────
  if (yearsAhead >= 20 && lifetimeDays > 300) {
    const lifetimeYears = Math.round((lifetimeDays / 365) * 10) / 10;
    insights.push({
      id: "screen.lifetime-perspective",
      severity: lifetimeYears >= 3 ? "warning" : "neutral",
      category: "time-loss",
      title: `${Math.round(lifetimeDays)} days — ${lifetimeYears} years of your life`,
      body: `At ${hoursPerDay} hours/day over ${yearsAhead} years, you'll spend ${Math.round(lifetimeDays)} full days — ${lifetimeYears} years — on non-work screens. That's enough time to earn a degree, master a skill, build a business, or read 1,000 books. The question isn't whether you have time — it's where you're spending it.`,
      metric: {
        label: "Lifetime screen days",
        value: `${Math.round(lifetimeDays)}`,
      },
    });
  }

  return insights;
}
