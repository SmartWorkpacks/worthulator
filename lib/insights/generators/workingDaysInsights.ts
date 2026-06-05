// ─── WorthCore Insight Engine — Working Days Calculator Generator ─────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for "working-days-calculator". Frames the
//   working-day estimate against the calendar span, isolates the holiday impact,
//   and benchmarks long spans against the 249-day US work year.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { US_WORK_YEAR_DAYS } from "@/calculations/time/workingDays";

export interface WorkingDaysInsightInputs {
  calendarDays:    number;
  holidays:        number;
  workDaysPerWeek: number;
}

export interface WorkingDaysInsightOutputs {
  workingDays:     number;
  weekendDays:     number;
  workingWeeks:    number;
  pctWorking:      number;
  weekdayEstimate: number;
}

export function generateWorkingDaysInsights(
  inputs: WorkingDaysInsightInputs,
  outputs: WorkingDaysInsightOutputs,
): Insight[] {
  const { calendarDays, holidays, workDaysPerWeek } = inputs;
  const { workingDays, weekendDays, workingWeeks, pctWorking, weekdayEstimate } = outputs;

  if (calendarDays <= 0) return [];

  const insights: Insight[] = [];

  // ── 1. Headline — working days vs the calendar span (benchmark-bar) ───────
  insights.push({
    id:       "workingdays.headline",
    severity: "neutral",
    category: "comparison",
    title:    `${workingDays} working days inside ${calendarDays} calendar days`,
    body:     `On a ${workDaysPerWeek}-day work week, about ${Math.round(pctWorking)}% of this ${calendarDays}-day span is working time — roughly ${workingWeeks.toFixed(1)} working weeks. The rest is weekends and holidays.`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      workingDays,
      userLabel:      "Working days",
      benchmarkValue: calendarDays,
      benchmarkLabel: "Calendar days",
      format:         "number",
    } satisfies InsightVisualization,
    priority: 90,
  });

  // ── 2. Holiday impact (delta-card) ────────────────────────────────────────
  if (holidays > 0) {
    insights.push({
      id:       "workingdays.holidays",
      severity: "neutral",
      category: "comparison",
      title:    `${holidays} ${holidays === 1 ? "holiday" : "holidays"} trims it to ${workingDays} days`,
      body:     `Before holidays there are about ${Math.round(weekdayEstimate)} weekdays in this range. Subtracting your ${holidays} public ${holidays === 1 ? "holiday" : "holidays"} leaves ${workingDays} actual working days.`,
      visualization: {
        type:   "delta-card",
        before: { label: "Weekdays",     value: `${Math.round(weekdayEstimate)}` },
        after:  { label: "Working days", value: `${workingDays}` },
        delta:  { label: "Holidays off", value: `−${holidays}`, positive: false },
      } satisfies InsightVisualization,
      priority: 70,
    });
  }

  // ── 3. Weekend / non-working time ─────────────────────────────────────────
  if (weekendDays > 0) {
    insights.push({
      id:       "workingdays.weekends",
      severity: "neutral",
      category: "comparison",
      title:    `${weekendDays} non-working days in the span`,
      body:     `With a ${workDaysPerWeek}-day week, roughly ${weekendDays} of the ${calendarDays} calendar days fall on weekends. Deadlines quoted in "business days" exclude these — always confirm whether a deadline means calendar or working days.`,
      metric:   { label: "Weekend days", value: `${weekendDays}` },
      priority: 50,
    });
  }

  // ── 4. Year benchmark for long spans ──────────────────────────────────────
  if (calendarDays >= 200) {
    const yearsEquivalent = workingDays / US_WORK_YEAR_DAYS;
    insights.push({
      id:       "workingdays.year-benchmark",
      severity: "neutral",
      category: "comparison",
      title:    `That's ${yearsEquivalent.toFixed(2)} standard work years`,
      body:     `A standard US work year is ${US_WORK_YEAR_DAYS} working days (260 weekdays minus 11 federal holidays). Your ${workingDays} working days is ${yearsEquivalent.toFixed(2)}× that — useful for capacity and headcount planning.`,
      metric:   { label: "Work-year equivalent", value: `${yearsEquivalent.toFixed(2)}×` },
      priority: 40,
    });
  }

  return insights.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
