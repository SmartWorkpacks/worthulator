// ─── WorthCore Insight Engine — Streaming Time Generator ─────────────────────
//
// PURPOSE:
//   State-aware visual insights for the streaming-time calculator: annual
//   opportunity cost at the live state median wage, subscription spend + the
//   cost-per-hour "value" read, an invested-opportunity projection, a one-hour
//   cut delta, and a lifetime perspective.
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
import { usStateMedianWageDataset } from "@/lib/datasets/regional/usStateMedianWages";
import { US_AVG_STREAM_HRS } from "@/calculations/lifestyle/streamingTime";

export interface StreamingTimeInputs {
  hoursPerDay: number;
  yearsAhead: number;
  monthlySubCost: number;
  state: string;
  /** Optional user-entered hourly rate; when > 0 it overrides the state median. */
  hourlyRateOverride?: number;
}

export interface StreamingTimeOutputs {
  annualCost: number;
  monthlyCost: number;
  dailyCost: number;
  weeklyHours: number;
  yearlyHours: number;
  daysPerYear: number;
  lifetimeDays: number;
  stateMedianWage: number;
  annualSubCost: number;
  subTotalCost: number;
  costPerHourWatched: number;
  combinedAnnualCost: number;
  excessHoursPerDay: number;
  excessAnnualCost: number;
  oneHourAnnualSaving: number;
  oneHourInvested10yr: number;
  invested10yr: number;
  invested30yr: number;
  subInvested10yr: number;
}

export function streamingTimeInsights(
  inputs: StreamingTimeInputs,
  outputs: StreamingTimeOutputs,
): Insight[] {
  const insights: Insight[] = [];

  const { hoursPerDay, yearsAhead, state } = inputs;
  const {
    annualCost,
    stateMedianWage,
    daysPerYear,
    lifetimeDays,
    annualSubCost,
    subTotalCost,
    costPerHourWatched,
    combinedAnnualCost,
    oneHourAnnualSaving,
    oneHourInvested10yr,
    invested10yr,
    invested30yr,
    subInvested10yr,
  } = outputs;

  if (hoursPerDay <= 0) return insights;

  const isCustomRate = (inputs.hourlyRateOverride ?? 0) > 0;
  const stateLabel = state && state !== "National" ? state : "the US average";
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

  // ── 1. Annual opportunity cost — benchmark-bar vs US average streaming ──
  insights.push({
    id: "streaming.annual-cost",
    severity: hoursPerDay >= 5 ? "warning" : "neutral",
    category: "opportunity-cost",
    title: `${formatCurrency(annualCost)}/year — ${daysPerYear} full days streaming`,
    body: `At ${rateLabel} of $${stateMedianWage.toFixed(2)}/hr, ${hoursPerDay} hours/day of streaming represents ${formatCurrency(annualCost)}/year in opportunity cost — ${outputs.yearlyHours} hours, or ${daysPerYear} full days every year. Over ${yearsAhead} years that's ${Math.round(lifetimeDays)} days of your life.`,
    metric: { label: "Per year", value: formatCurrency(annualCost) },
    visualization: {
      type: "benchmark-bar",
      userValue: hoursPerDay,
      userLabel: "Your streaming",
      benchmarkValue: US_AVG_STREAM_HRS,
      benchmarkLabel: `US average (${US_AVG_STREAM_HRS}hr)`,
      format: "number",
      caption: liveCaption,
    } satisfies InsightVisualization,
  });

  // ── 2. Subscription spend + value read — delta-card ─────────────────────
  if (annualSubCost > 0) {
    const heavyValue = costPerHourWatched <= 0.5;
    insights.push({
      id: "streaming.subscription-spend",
      severity: heavyValue ? "positive" : "warning",
      category: "hidden-cost",
      title: `${formatCurrency(annualSubCost)}/year in subscriptions — ${formatCurrency(subTotalCost)} over ${yearsAhead} years`,
      body: heavyValue
        ? `Your subscriptions cost about $${costPerHourWatched.toFixed(2)} per hour watched — heavy use means you're getting genuine value from the spend. The bigger cost here is the time, not the money.`
        : `Your subscriptions work out to about $${costPerHourWatched.toFixed(2)} per hour actually watched. The lighter your viewing, the more you're paying for content you don't use — this is exactly where unused services hide. Invested at 7%, that ${formatCurrency(annualSubCost)}/year would grow to ${formatCurrency(subInvested10yr)} in 10 years.`,
      metric: { label: "Per hour watched", value: `$${costPerHourWatched.toFixed(2)}` },
      visualization: {
        type: "delta-card",
        before: { label: "Subs / yr", value: formatCurrency(annualSubCost) },
        after: { label: `Over ${yearsAhead} yr`, value: formatCurrency(subTotalCost) },
        delta: { label: "Per hour watched", value: `$${costPerHourWatched.toFixed(2)}`, positive: heavyValue },
      } satisfies InsightVisualization,
    });
  }

  // ── 3. Invested opportunity cost — projection-line ──────────────────────
  if (annualCost > 0) {
    insights.push({
      id: "streaming.investment-projection",
      severity: "neutral",
      category: "projection",
      title: `${formatCurrency(invested10yr)} over 10 years — ${formatCurrency(invested30yr)} over 30`,
      body: `Redirect even half this time to income at $${stateMedianWage.toFixed(2)}/hr and invest it at 7%: ${formatCurrency(Math.round(annualCost / 2))}/year becomes ${formatCurrency(Math.round(futureValueAnnuity(annualCost / 2, 10)))} in a decade. The full opportunity cost invested reaches ${formatCurrency(invested10yr)} at 10 years and ${formatCurrency(invested30yr)} at 30.`,
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

  // ── 4. Cut one hour/day — delta-card ────────────────────────────────────
  if (hoursPerDay > 1) {
    insights.push({
      id: "streaming.one-hour-cut",
      severity: "positive",
      category: "habit",
      title: `Cut 1 hour/day → ${formatCurrency(oneHourAnnualSaving)}/year reclaimed`,
      body: `One fewer hour per day is 365 hours/year — 15.2 full days. At $${stateMedianWage.toFixed(2)}/hr that's ${formatCurrency(oneHourAnnualSaving)}/year in reclaimed time value; invested at 7% for 10 years, ${formatCurrency(oneHourInvested10yr)}. Swapping autoplay for one chosen episode is usually enough.`,
      visualization: {
        type: "delta-card",
        before: { label: "Current / yr", value: formatCurrency(annualCost) },
        after: { label: "Minus 1hr/day", value: formatCurrency(Math.max(0, annualCost - oneHourAnnualSaving)) },
        delta: { label: "Reclaimed / yr", value: formatCurrency(oneHourAnnualSaving), positive: true },
      } satisfies InsightVisualization,
    });
  }

  // ── 5. Combined drain — time value + subscription together ──────────────
  if (annualSubCost > 0 && annualCost > 0) {
    insights.push({
      id: "streaming.combined-drain",
      severity: "neutral",
      category: "spending",
      title: `${formatCurrency(combinedAnnualCost)}/year all in — time value plus subscriptions`,
      body: `Counting both the opportunity cost of the hours (${formatCurrency(annualCost)}) and the hard subscription spend (${formatCurrency(annualSubCost)}), streaming draws about ${formatCurrency(combinedAnnualCost)}/year. Money you can earn back; the ${Math.round(daysPerYear)} days a year you can't.`,
      metric: { label: "All-in / yr", value: formatCurrency(combinedAnnualCost) },
    });
  }

  // ── 6. Lifetime perspective — long horizons ─────────────────────────────
  if (yearsAhead >= 20 && lifetimeDays > 300) {
    const lifetimeYears = Math.round((lifetimeDays / 365) * 10) / 10;
    insights.push({
      id: "streaming.lifetime-perspective",
      severity: lifetimeYears >= 3 ? "warning" : "neutral",
      category: "time-loss",
      title: `${Math.round(lifetimeDays)} days — ${lifetimeYears} years in front of a screen`,
      body: `At ${hoursPerDay} hours/day over ${yearsAhead} years you'll spend ${Math.round(lifetimeDays)} full days — ${lifetimeYears} years — streaming. Enough time to learn an instrument, reach conversational fluency in a language, or read several hundred books. The time isn't missing; it's allocated.`,
      metric: { label: "Lifetime streaming days", value: `${Math.round(lifetimeDays)}` },
    });
  }

  return insights;
}
