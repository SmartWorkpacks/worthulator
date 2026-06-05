// ─── WorthCore Insight Engine — Phone Addiction Generator ────────────────────
//
// PURPOSE:
//   State-aware visual insights for the phone-addiction calculator: opportunity
//   cost at the live state median wage, the share of your waking day (donut),
//   the checking/pickup frequency, an invested-opportunity projection, a one-hour
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
import { US_AVG_PHONE_HRS, US_AVG_PICKUPS, WAKING_HOURS } from "@/calculations/lifestyle/phoneAddiction";

export interface PhoneAddictionInputs {
  hoursPerDay: number;
  pickupsPerDay: number;
  yearsAhead: number;
  state: string;
  /** Optional user-entered hourly rate; when > 0 it overrides the state median. */
  hourlyRateOverride?: number;
}

export interface PhoneAddictionOutputs {
  annualCost: number;
  monthlyCost: number;
  dailyCost: number;
  yearlyHours: number;
  weeklyHours: number;
  daysPerYear: number;
  lifetimeDays: number;
  stateMedianWage: number;
  wakingPct: number;
  pickupsPerYear: number;
  minutesPerPickup: number;
  excessHoursPerDay: number;
  excessAnnualCost: number;
  oneHourAnnualSaving: number;
  oneHourInvested10yr: number;
  invested10yr: number;
  invested30yr: number;
}

export function phoneAddictionInsights(
  inputs: PhoneAddictionInputs,
  outputs: PhoneAddictionOutputs,
): Insight[] {
  const insights: Insight[] = [];

  const { hoursPerDay, pickupsPerDay, yearsAhead, state } = inputs;
  const {
    annualCost,
    stateMedianWage,
    daysPerYear,
    lifetimeDays,
    wakingPct,
    pickupsPerYear,
    minutesPerPickup,
    excessHoursPerDay,
    excessAnnualCost,
    oneHourAnnualSaving,
    oneHourInvested10yr,
    invested10yr,
    invested30yr,
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

  // ── 1. Annual opportunity cost — benchmark-bar vs US average ────────────
  insights.push({
    id: "phone.annual-cost",
    severity: hoursPerDay >= 6 ? "warning" : "neutral",
    category: "opportunity-cost",
    title: `${formatCurrency(annualCost)}/year — ${daysPerYear} full days on your phone`,
    body: `At ${rateLabel} of $${stateMedianWage.toFixed(2)}/hr, ${hoursPerDay} hours/day on your phone represents ${formatCurrency(annualCost)}/year in opportunity cost — ${outputs.yearlyHours} hours, or ${daysPerYear} full days each year. Over ${yearsAhead} years that's ${Math.round(lifetimeDays)} days.`,
    metric: { label: "Per year", value: formatCurrency(annualCost) },
    visualization: {
      type: "benchmark-bar",
      userValue: hoursPerDay,
      userLabel: "Your phone time",
      benchmarkValue: US_AVG_PHONE_HRS,
      benchmarkLabel: `US average (${US_AVG_PHONE_HRS}hr)`,
      format: "number",
      caption: liveCaption,
    } satisfies InsightVisualization,
  });

  // ── 2. Share of your waking day — donut ─────────────────────────────────
  const restOfDay = Math.max(0, WAKING_HOURS - hoursPerDay);
  insights.push({
    id: "phone.waking-share",
    severity: wakingPct >= 30 ? "warning" : "neutral",
    category: "comparison",
    title: `${wakingPct}% of your waking day is on a screen`,
    body: `Assuming about ${WAKING_HOURS} waking hours, ${hoursPerDay} hours on your phone is ${wakingPct}% of every day you're awake. The rest — ${restOfDay.toFixed(1)} hours — is everything else: work, people, food, movement, and rest.`,
    metric: { label: "Of waking hours", value: `${wakingPct}%` },
    visualization: {
      type: "donut",
      segments: [
        { label: "On phone", value: Math.round(hoursPerDay * 10) / 10, color: "#f43f5e" },
        { label: "Rest of waking day", value: Math.round(restOfDay * 10) / 10, color: "#e5e7eb" },
      ],
      centerLabel: `${wakingPct}%`,
      format: "number",
    } satisfies InsightVisualization,
  });

  // ── 3. Checking frequency — the fragmentation tell ──────────────────────
  if (pickupsPerDay > 0) {
    insights.push({
      id: "phone.pickups",
      severity: pickupsPerDay >= US_AVG_PICKUPS ? "warning" : "neutral",
      category: "habit",
      title: `${pickupsPerDay} pickups/day — ${pickupsPerYear.toLocaleString()} a year`,
      body: `That's roughly one check every ${minutesPerPickup.toFixed(1)} minutes of phone time, and ${pickupsPerYear.toLocaleString()} interruptions a year. Research links checking frequency — more than raw hours — to fragmented attention: each pickup carries a refocusing cost that pure screen-time totals miss.`,
      metric: { label: "Pickups / year", value: pickupsPerYear.toLocaleString() },
    });
  }

  // ── 4. Invested opportunity cost — projection-line ──────────────────────
  if (annualCost > 0) {
    insights.push({
      id: "phone.investment-projection",
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

  // ── 5. Above-average usage ──────────────────────────────────────────────
  if (excessHoursPerDay >= 0.5) {
    const excessDays = Math.round((excessHoursPerDay * 365) / 24 * 10) / 10;
    insights.push({
      id: "phone.above-average",
      severity: "warning",
      category: "comparison",
      title: `${excessHoursPerDay.toFixed(1)} hrs/day above average — ${formatCurrency(excessAnnualCost)}/year`,
      body: `The US average is ${US_AVG_PHONE_HRS} hours/day. Your ${hoursPerDay}hr is ${excessHoursPerDay.toFixed(1)} hours more — ${excessDays} extra days/year. At $${stateMedianWage.toFixed(2)}/hr those excess hours cost ${formatCurrency(excessAnnualCost)}/year on their own.`,
      metric: { label: "Excess cost/yr", value: formatCurrency(excessAnnualCost) },
    });
  }

  // ── 6. Cut one hour/day — delta-card ────────────────────────────────────
  if (hoursPerDay > 1) {
    insights.push({
      id: "phone.one-hour-cut",
      severity: "positive",
      category: "habit",
      title: `Cut 1 hour/day → ${formatCurrency(oneHourAnnualSaving)}/year reclaimed`,
      body: `One fewer hour per day is 365 hours/year — 15.2 full days. At $${stateMedianWage.toFixed(2)}/hr that's ${formatCurrency(oneHourAnnualSaving)}/year in reclaimed time value; invested at 7% for 10 years, ${formatCurrency(oneHourInvested10yr)}. Greyscale, app limits, and a charger outside the bedroom do most of the work.`,
      visualization: {
        type: "delta-card",
        before: { label: "Current / yr", value: formatCurrency(annualCost) },
        after: { label: "Minus 1hr/day", value: formatCurrency(Math.max(0, annualCost - oneHourAnnualSaving)) },
        delta: { label: "Reclaimed / yr", value: formatCurrency(oneHourAnnualSaving), positive: true },
      } satisfies InsightVisualization,
    });
  }

  return insights;
}
