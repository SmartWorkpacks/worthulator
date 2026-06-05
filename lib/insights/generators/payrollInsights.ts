// ─── WorthCore Insight Engine — Payroll Generator ─────────────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for "payroll-calculator". Shows the gap
//   between salary and true cost (delta card), the salary/tax/benefits split
//   (donut), the burden rate vs the typical 25–40% band, and an all-in cost per
//   billable hour to anchor pricing.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";

export interface PayrollInsightInputs {
  employees:           number;
  avgSalary:           number;
  employerTaxPct:      number;
  benefitsPerEmployee: number;
  billableHours:       number;
}

export interface PayrollInsightOutputs {
  grossPayroll:        number;
  employerTaxes:       number;
  benefitsTotal:       number;
  totalCost:           number;
  costPerEmployee:     number;
  burdenPct:           number;
  costPerBillableHour: number;
}

export function generatePayrollInsights(
  inputs: PayrollInsightInputs,
  outputs: PayrollInsightOutputs,
): Insight[] {
  const { employees, avgSalary, billableHours } = inputs;
  const { grossPayroll, employerTaxes, benefitsTotal, totalCost, costPerEmployee, burdenPct, costPerBillableHour } = outputs;

  if (employees <= 0 || totalCost <= 0) return [];

  const insights: Insight[] = [];

  // ── 1. Salary vs true cost (delta-card) ───────────────────────────────────
  insights.push({
    id:       "payroll.true-cost",
    severity: "warning",
    category: "spending",
    title:    `A ${formatCurrency(avgSalary)} salary really costs ${formatCurrency(costPerEmployee)}`,
    body:     `Once you add employer taxes and benefits, each hire costs ${Math.round(burdenPct)}% more than the offer-letter number. Budget for the burden, not the base.`,
    visualization: {
      type:   "delta-card",
      before: { label: "Base salary",   value: formatCurrency(avgSalary) },
      after:  { label: "True cost",     value: formatCurrency(costPerEmployee) },
      delta:  { label: "Burden",        value: `+${Math.round(burdenPct)}%`, positive: false },
    } satisfies InsightVisualization,
    priority: 90,
  });

  // ── 2. Total workforce cost split (donut) ─────────────────────────────────
  insights.push({
    id:       "payroll.split",
    severity: "neutral",
    category: "spending",
    title:    `${formatCurrency(totalCost)} total for ${employees} ${employees === 1 ? "person" : "people"}`,
    body:     `Salaries are ${formatCurrency(grossPayroll)}, employer taxes ${formatCurrency(employerTaxes)}, and benefits ${formatCurrency(benefitsTotal)}.`,
    visualization: {
      type:        "donut",
      segments: [
        { label: "Salaries",       value: grossPayroll,  color: "#3b82f6" },
        { label: "Employer taxes", value: employerTaxes, color: "#ef4444" },
        { label: "Benefits",       value: benefitsTotal, color: "#10b981" },
      ].filter((s) => s.value > 0),
      centerLabel: formatCurrency(totalCost),
      format:      "currency",
    } satisfies InsightVisualization,
    priority: 70,
  });

  // ── 3. Burden rate benchmark ──────────────────────────────────────────────
  insights.push({
    id:       "payroll.burden",
    severity: burdenPct > 40 ? "warning" : "neutral",
    category: "comparison",
    title:    `${Math.round(burdenPct)}% payroll burden`,
    body:     burdenPct > 40
      ? `Your burden is above the typical 25–40% band — usually driven by a rich benefits package or high state unemployment (SUTA) rates.`
      : `The typical US payroll burden runs 25–40% on top of salary. Yours sits ${burdenPct < 25 ? "below" : "within"} that range.`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      burdenPct,
      userLabel:      "Your burden",
      benchmarkValue: 33,
      benchmarkLabel: "Typical (~33%)",
      format:         "percent",
    } satisfies InsightVisualization,
    priority: 55,
  });

  // ── 4. Cost per billable hour → pricing anchor ────────────────────────────
  if (billableHours > 0 && costPerBillableHour > 0) {
    insights.push({
      id:       "payroll.billable",
      severity: "neutral",
      category: "comparison",
      title:    `${formatCurrency(costPerBillableHour)} per billable hour`,
      body:     `Spread across ${billableHours.toLocaleString()} billable hours, each employee costs ${formatCurrency(costPerBillableHour)}/hr before overhead or profit. Your billing rate must clear this just to break even — service businesses typically mark up 2–3×.`,
      metric:   { label: "Break-even rate", value: `${formatCurrency(costPerBillableHour)}/hr` },
      priority: 40,
    });
  }

  return insights.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
