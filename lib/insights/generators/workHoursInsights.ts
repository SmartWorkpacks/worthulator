// ─── WorthCore Insight Engine — Work Hours Calculator Generator ───────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for "work-hours-calculator". Frames the
//   total against a full-time year, flags FLSA overtime and its premium pay,
//   surfaces gross earnings at the entered rate, and contextualises long weeks.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { FULL_TIME_YEAR_HOURS, OVERTIME_THRESHOLD } from "@/calculations/work/workHours";

export interface WorkHoursInsightInputs {
  hoursPerDay: number;
  daysPerWeek: number;
  weeksWorked: number;
  hourlyRate:  number;
}

export interface WorkHoursInsightOutputs {
  totalHours:    number;
  weeklyHours:   number;
  daysWorked:    number;
  regularHours:  number;
  overtimeHours: number;
  regularPay:    number;
  overtimePay:   number;
  grossPay:      number;
  fte:           number;
}

const fmtHrs = (h: number) => `${h.toLocaleString(undefined, { maximumFractionDigits: 1 })}h`;

export function generateWorkHoursInsights(
  inputs: WorkHoursInsightInputs,
  outputs: WorkHoursInsightOutputs,
): Insight[] {
  const { hoursPerDay, weeksWorked, hourlyRate } = inputs;
  const { totalHours, weeklyHours, overtimeHours, regularPay, overtimePay, grossPay, fte } = outputs;

  if (totalHours <= 0) return [];

  const insights: Insight[] = [];

  // ── 1. Headline — total vs a full-time year (benchmark-bar) ───────────────
  insights.push({
    id:       "workhours.total",
    severity: "neutral",
    category: "comparison",
    title:    `${fmtHrs(totalHours)} over this period — ${fte.toFixed(2)}× a full-time year`,
    body:     `At ${fmtHrs(weeklyHours)}/week across ${weeksWorked} ${weeksWorked === 1 ? "week" : "weeks"}, you log ${fmtHrs(totalHours)}. A standard full-time year is ${FULL_TIME_YEAR_HOURS.toLocaleString()} hours (40 h/week × 52), so this is ${fte.toFixed(2)} full-time years of work.`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      totalHours,
      userLabel:      "Your hours",
      benchmarkValue: FULL_TIME_YEAR_HOURS,
      benchmarkLabel: "Full-time year (2,080h)",
      format:         "number",
    } satisfies InsightVisualization,
    priority: 90,
  });

  // ── 2. Overtime — FLSA weekly basis ───────────────────────────────────────
  if (overtimeHours > 0) {
    insights.push({
      id:       "workhours.overtime",
      severity: "warning",
      category: "warning",
      title:    `${fmtHrs(overtimeHours)} of that is overtime`,
      body:     `Your ${fmtHrs(weeklyHours)} week is ${fmtHrs(weeklyHours - OVERTIME_THRESHOLD)} over the 40-hour FLSA threshold. Federal law treats hours over 40 per week as overtime, payable at 1.5× — so those ${fmtHrs(overtimeHours)} are worth more per hour than your regular time.`,
      metric:   { label: "Overtime hours", value: fmtHrs(overtimeHours) },
      priority: 80,
    });
  }

  // ── 3. Earnings — gross pay at the entered rate (delta-card) ──────────────
  if (hourlyRate > 0 && grossPay > 0) {
    insights.push({
      id:       "workhours.earnings",
      severity: "positive",
      category: "savings",
      title:    `${formatCurrency(grossPay)} gross at ${formatCurrency(hourlyRate)}/hr`,
      body:     overtimePay > 0
        ? `${fmtHrs(outputs.regularHours)} of regular time pays ${formatCurrency(regularPay)}; the ${fmtHrs(overtimeHours)} of overtime adds ${formatCurrency(overtimePay)} at time-and-a-half — ${formatCurrency(grossPay)} in total before tax.`
        : `${fmtHrs(totalHours)} at ${formatCurrency(hourlyRate)}/hr is ${formatCurrency(grossPay)} of gross pay for this period, before taxes and deductions.`,
      visualization: {
        type:   "delta-card",
        before: { label: "Regular pay",  value: formatCurrency(regularPay) },
        after:  { label: "Overtime pay", value: formatCurrency(overtimePay) },
        delta:  { label: "Gross total",  value: formatCurrency(grossPay), positive: true },
      } satisfies InsightVisualization,
      priority: 70,
    });
  }

  // ── 4. Long-day / sustainability framing ──────────────────────────────────
  if (hoursPerDay >= 10) {
    insights.push({
      id:       "workhours.long-days",
      severity: "warning",
      category: "warning",
      title:    `${hoursPerDay}-hour days are above the productive ceiling`,
      body:     `Research on focused work (K. Anders Ericsson) finds most people sustain only 4–6 hours of genuinely productive effort per day. ${hoursPerDay}-hour days tend to trade output quality for hours on the clock — track results, not just time.`,
      metric:   { label: "Hours per day", value: `${hoursPerDay}h` },
      priority: 40,
    });
  }

  // ── 5. FTE framing for partial schedules ──────────────────────────────────
  if (fte < 0.75 && weeklyHours < OVERTIME_THRESHOLD) {
    insights.push({
      id:       "workhours.part-time",
      severity: "neutral",
      category: "comparison",
      title:    `This is ${Math.round(fte * 100)}% of a full-time load`,
      body:     `At ${fmtHrs(weeklyHours)}/week this period works out to ${fte.toFixed(2)} FTE. For reference, the ACA part-time threshold is 30 h/week and most employers treat under 30–35 h/week as part-time.`,
      metric:   { label: "Full-time equivalent", value: `${fte.toFixed(2)} FTE` },
      priority: 30,
    });
  }

  return insights.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
