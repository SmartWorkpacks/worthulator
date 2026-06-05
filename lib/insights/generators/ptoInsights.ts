// ─── PTO Calculator Insight Generator ────────────────────────────────────────
//
// Produces live WorthCore insights for the pto-calculator.
// Called on every slider change via LiveInsightBlock → GENERATOR_REGISTRY.
//
// Rules:
//   pto.daily-value      — always fires — shows daily PTO value
//   pto.high-balance     — daysRemaining > 15 → neutral (use-it-or-lose-it risk)
//   pto.large-cash-value — cashValue > 5000 → neutral (asset awareness)
//   pto.weeks-framing    — ptoDaysAsWeeks ≥ 2 → neutral (reframe in weeks)
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight } from "@/lib/insights/types";

export interface PtoInputs {
  hourlyRate:        number;  // $/hour
  ptoHoursRemaining: number;  // hours
  hoursPerDay:       number;  // hours/day
}

export interface PtoOutputs {
  cashValue:         number;
  daysRemaining:     number;
  weeklyEarningRate: number;
  dailyCashValue?:   number;
  ptoDaysAsWeeks?:   number;
}

export function generatePtoInsights(
  inputs:  PtoInputs,
  outputs: PtoOutputs,
): Insight[] {
  const insights: Insight[] = [];

  const { hourlyRate, ptoHoursRemaining, hoursPerDay } = inputs;
  const {
    cashValue,
    daysRemaining,
    weeklyEarningRate,
    dailyCashValue = Math.round(hourlyRate * hoursPerDay),
    ptoDaysAsWeeks = Math.round((daysRemaining / 5) * 10) / 10,
  } = outputs;

  // ── 1. Daily value framing (always fires) ────────────────────────────────
  insights.push({
    id:       "pto.daily-value",
    severity: "neutral",
    category: "comparison",
    title:    `Each PTO day is worth $${dailyCashValue.toLocaleString()} — you have ${daysRemaining} days ($${cashValue.toLocaleString()}) remaining`,
    body:     `At $${hourlyRate}/hour for a ${hoursPerDay}-hour day, each vacation day carries a $${dailyCashValue.toLocaleString()} cash value. Your ${daysRemaining} remaining days equal $${cashValue.toLocaleString()} total — ${ptoDaysAsWeeks} work weeks of paid time.`,
    metric:   { label: "Total PTO value", value: `$${cashValue.toLocaleString()}` },
  });

  // ── 2. High balance warning ───────────────────────────────────────────────
  if (daysRemaining > 15) {
    insights.push({
      id:       "pto.high-balance",
      severity: "warning",
      category: "hidden-cost",
      title:    `${daysRemaining} days is a large balance — $${cashValue.toLocaleString()} at risk under use-it-or-lose-it policies`,
      body:     `Many employers cap PTO accrual or cancel unused balances at year end. With ${daysRemaining} days, that is $${cashValue.toLocaleString()} at risk. Review your company's policy and start booking — unused PTO that expires is compensation you earned but did not receive.`,
      metric:   { label: "PTO at risk", value: `$${cashValue.toLocaleString()}` },
    });
  }

  // ── 3. Large cash value awareness ────────────────────────────────────────
  if (cashValue >= 5000) {
    insights.push({
      id:       "pto.large-cash-value",
      severity: "neutral",
      category: "savings",
      title:    `$${cashValue.toLocaleString()} in PTO value — a real financial asset`,
      body:     `That is equivalent to $${weeklyEarningRate.toLocaleString()}/week of your pay. Some employers offer PTO buy-back programs, carryover caps, or payout on separation. Unused PTO should be tracked and managed as an asset, not treated as an afterthought.`,
      metric:   { label: "Weekly earning rate", value: `$${weeklyEarningRate.toLocaleString()}` },
    });
  }

  // ── 4. Weeks framing ─────────────────────────────────────────────────────
  if (ptoDaysAsWeeks >= 2) {
    insights.push({
      id:       "pto.weeks-framing",
      severity: "positive",
      category: "comparison",
      title:    `${daysRemaining} days = ${ptoDaysAsWeeks} full work weeks of paid time off`,
      body:     `That is a meaningful amount of flexibility. Research consistently shows employees who take more vacation are more productive in the hours they work. The ROI on rest is real — and your employer has already paid for it.`,
      metric:   { label: "PTO in weeks", value: `${ptoDaysAsWeeks}wks` },
    });
  }

  return insights;
}
