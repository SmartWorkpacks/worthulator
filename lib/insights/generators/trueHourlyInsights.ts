// ─── True Hourly Wage Insight Generator ──────────────────────────────────────
//
// Produces live WorthCore insights for the true-hourly-wage calculator.
// Called on every slider change via LiveInsightBlock → GENERATOR_REGISTRY.
//
// Rules:
//   truehourly.rate-ratio   — always fires — % of advertised rate they actually earn
//   truehourly.large-gap    — hourlyLoss > $10 → warning
//   truehourly.moderate-gap — hourlyLoss $5–10 → neutral
//   truehourly.time-robbed  — extraHoursPerYear > 200 → warning (5+ extra weeks)
//   truehourly.no-commute   — commuteHrsDay === 0 → positive
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight } from "@/lib/insights/types";

export interface TrueHourlyInputs {
  salary:         number;   // $
  hoursPerWeek:   number;   // hrs
  commuteHrsDay:  number;   // hrs each way
  decompressHrs:  number;   // hrs/day
}

export interface TrueHourlyOutputs {
  trueHourly:         number;
  advertisedHourly:   number;
  extraHoursPerYear:  number;
  hourlyLoss?:            number;
  trueVsAdvertisedRatio?: number;
  timeRobbedWeeks?:       number;
}

export function generateTrueHourlyInsights(
  inputs:  TrueHourlyInputs,
  outputs: TrueHourlyOutputs,
): Insight[] {
  const insights: Insight[] = [];

  const { salary, hoursPerWeek, commuteHrsDay, decompressHrs } = inputs;
  const {
    trueHourly,
    advertisedHourly,
    extraHoursPerYear,
    hourlyLoss            = Math.round((advertisedHourly - trueHourly) * 100) / 100,
    trueVsAdvertisedRatio = advertisedHourly > 0 ? trueHourly / advertisedHourly : 1,
    timeRobbedWeeks       = Math.round((extraHoursPerYear / 40) * 10) / 10,
  } = outputs;

  const effectivePct = Math.round(trueVsAdvertisedRatio * 100);

  // ── 1. Rate ratio (always fires) ─────────────────────────────────────────
  insights.push({
    id:       "truehourly.rate-ratio",
    severity: effectivePct >= 90 ? "positive" : effectivePct >= 75 ? "neutral" : "warning",
    category: "hidden-cost",
    title:    `True hourly: $${trueHourly.toFixed(2)} — ${effectivePct}% of the advertised $${advertisedHourly.toFixed(2)}/hr`,
    body:     `Once commute and decompression time are included, your effective rate drops from $${advertisedHourly.toFixed(2)} to $${trueHourly.toFixed(2)} — a $${hourlyLoss.toFixed(2)}/hr reduction. Over a year, that is ${extraHoursPerYear} hours of job-related time that does not appear on your pay stub (${timeRobbedWeeks} work weeks).`,
    metric:   { label: "True vs advertised", value: `${effectivePct}%` },
    visualization: {
      type:           "benchmark-bar",
      userValue:      trueHourly,
      userLabel:      "True hourly rate",
      benchmarkValue: advertisedHourly,
      benchmarkLabel: "Advertised hourly",
      format:         "currency",
    },
  });

  // ── 2. Large gap ──────────────────────────────────────────────────────────
  if (hourlyLoss > 10) {
    const annualLoss = Math.round(hourlyLoss * extraHoursPerYear);
    insights.push({
      id:       "truehourly.large-gap",
      severity: "warning",
      category: "hidden-cost",
      title:    `${extraHoursPerYear} job-related hours/year at $0 — worth $${annualLoss.toLocaleString()} at your advertised rate`,
      body:     `If those ${extraHoursPerYear} commute and decompression hours were compensated at your advertised rate, that is $${annualLoss.toLocaleString()}/year. A remote arrangement or shorter commute delivers this as an effective pay increase — no negotiation required.`,
      metric:   { label: "Uncompensated hours value", value: `$${annualLoss.toLocaleString()}/yr` },
    });
  }

  // ── 3. Moderate gap ───────────────────────────────────────────────────────
  if (hourlyLoss >= 5 && hourlyLoss <= 10) {
    insights.push({
      id:       "truehourly.moderate-gap",
      severity: "neutral",
      category: "hidden-cost",
      title:    `$${hourlyLoss.toFixed(2)}/hr gap from job-related time`,
      body:     `Your ${commuteHrsDay > 0 ? `${commuteHrsDay}hr commute` : ""}${commuteHrsDay > 0 && decompressHrs > 0 ? " and " : ""}${decompressHrs > 0 ? `${decompressHrs}hr decompression` : ""} adds ${extraHoursPerYear} hours annually to the job's real time cost. Two remote days per week typically recovers a significant portion of this gap.`,
      metric:   { label: "Effective rate reduction", value: `$${hourlyLoss.toFixed(2)}/hr` },
    });
  }

  // ── 4. Heavy time burden ──────────────────────────────────────────────────
  if (extraHoursPerYear > 200) {
    insights.push({
      id:       "truehourly.time-robbed",
      severity: "warning",
      category: "time-loss",
      title:    `${extraHoursPerYear} unpaid job-adjacent hours/year — ${timeRobbedWeeks} extra work weeks`,
      body:     `More than ${Math.floor(timeRobbedWeeks)} full work weeks per year spent on commuting and decompression — with no compensation. Remote-first roles, closer offices, or flex-time arrangements directly reclaim this time and should be factored into any job comparison as part of total compensation.`,
      metric:   { label: "Unpaid weeks/yr", value: `${timeRobbedWeeks}wks` },
    });
  }

  // ── 5. No commute bonus ───────────────────────────────────────────────────
  if (commuteHrsDay === 0) {
    insights.push({
      id:       "truehourly.no-commute",
      severity: "positive",
      category: "savings",
      title:    `Zero commute — true rate $${trueHourly.toFixed(2)} vs advertised $${advertisedHourly.toFixed(2)}`,
      body:     `With no commute, your true hourly is very close to your advertised rate. The average US commute of 27 minutes each way costs workers $3–5/hr in effective rate reduction — you avoid that entirely.`,
      metric:   { label: "Rate efficiency", value: `${effectivePct}%` },
    });
  }

  // ── 6. Annual true compensation context ──────────────────────────────────
  const trueAnnual = Math.round(trueHourly * hoursPerWeek * 52);
  if (trueAnnual < salary * 0.85) {
    insights.push({
      id:       "truehourly.annual-context",
      severity: "neutral",
      category: "comparison",
      title:    `True economic value: ~$${trueAnnual.toLocaleString()}/year vs $${salary.toLocaleString()} salary`,
      body:     `When all job-related hours are priced at your true rate, the economic value of the role is ~$${trueAnnual.toLocaleString()}/year. Use this as the baseline when comparing offers — a $5,000 salary increase at a remote company is often worth significantly more in real terms.`,
      metric:   { label: "True annual value", value: `$${trueAnnual.toLocaleString()}` },
    });
  }

  return insights;
}
