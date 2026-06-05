// ─── WorthCore Insight Engine — Time Between Dates Generator ──────────────────
//
// PURPOSE:
//   Deterministic insight rules for "time-between-dates-calculator". Reframes a
//   raw day count into the units people actually plan in — a weeks+days
//   breakdown, months/years, business days, and the average-month accuracy note.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightVisualization } from "@/lib/insights/types";

export interface TimeBetweenInsightInputs {
  days: number;
}

export interface TimeBetweenInsightOutputs {
  weeks:         number;
  months:        number;
  years:         number;
  businessDays:  number;
  hours:         number;
  fullWeeks:     number;
  remainderDays: number;
}

export function generateTimeBetweenInsights(
  inputs: TimeBetweenInsightInputs,
  outputs: TimeBetweenInsightOutputs,
): Insight[] {
  const { days } = inputs;
  const { weeks, months, years, businessDays, fullWeeks, remainderDays } = outputs;

  if (days <= 0) return [];

  const insights: Insight[] = [];

  // ── 1. Headline — the weeks + days breakdown ──────────────────────────────
  insights.push({
    id:       "timebetween.breakdown",
    severity: "neutral",
    category: "comparison",
    title:    `${days} days = ${fullWeeks} ${fullWeeks === 1 ? "week" : "weeks"}${remainderDays > 0 ? ` and ${remainderDays} ${remainderDays === 1 ? "day" : "days"}` : ""}`,
    body:     `That's ${weeks.toFixed(1)} weeks as a decimal, or about ${months.toFixed(1)} ${months === 1 ? "month" : "months"}. Expressing a span in weeks often makes a deadline feel more concrete than a raw day count.`,
    metric:   { label: "In weeks", value: `${weeks.toFixed(1)}` },
    priority: 90,
  });

  // ── 2. Months & years framing (benchmark-bar days vs business days) ───────
  insights.push({
    id:       "timebetween.business-days",
    severity: "neutral",
    category: "comparison",
    title:    `Only ${businessDays} of those are business days`,
    body:     `Roughly 5 in every 7 days are weekdays, so ${days} calendar days is about ${businessDays} business days. Contracts and SLAs usually count business days — that gap matters when a "30-day" window is really ~21 working days.`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      businessDays,
      userLabel:      "Business days",
      benchmarkValue: days,
      benchmarkLabel: "Calendar days",
      format:         "number",
    } satisfies InsightVisualization,
    priority: 70,
  });

  // ── 3. Year fraction for long spans ───────────────────────────────────────
  if (days >= 60) {
    insights.push({
      id:       "timebetween.years",
      severity: "neutral",
      category: "comparison",
      title:    `${years.toFixed(2)} years — using a true 365.25-day year`,
      body:     `${days} days is ${years.toFixed(2)} years and ${months.toFixed(1)} months. These use average lengths (365.25 days/year, 30.44 days/month) so conversions stay accurate — a flat "30 days/month" drifts 5 days over a full year.`,
      metric:   { label: "In months", value: `${months.toFixed(1)}` },
      priority: 50,
    });
  }

  // ── 4. Accuracy note for short ranges ─────────────────────────────────────
  if (days < 60) {
    insights.push({
      id:       "timebetween.short-range",
      severity: "neutral",
      category: "comparison",
      title:    `${days} days ≈ ${(days / 30.44).toFixed(1)} months`,
      body:     `For short countdowns, weeks are the most intuitive unit: ${fullWeeks} full ${fullWeeks === 1 ? "week" : "weeks"}${remainderDays > 0 ? ` plus ${remainderDays} ${remainderDays === 1 ? "day" : "days"}` : ""}. Round down for completed weeks remaining before an event.`,
      metric:   { label: "Full weeks", value: `${fullWeeks}` },
      priority: 40,
    });
  }

  return insights.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
