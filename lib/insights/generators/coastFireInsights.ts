// ─── Coast FIRE Insight Generator ────────────────────────────────────────────
//
// Produces live WorthCore insights for the coast-fire-calculator.
// Called on every slider change via LiveInsightBlock → GENERATOR_REGISTRY.
//
// Rules:
//   coastfire.already-coasted   — current >= requiredNow → positive (done!)
//   coastfire.nearly-there      — coastRatio >= 0.75 → positive
//   coastfire.halfway            — coastRatio 0.5–0.75 → neutral
//   coastfire.large-gap          — coastRatio < 0.5 → warning
//   coastfire.portfolio-overshoot — coastValue >= target * 1.5 → positive
//   coastfire.low-rate-risk      — rate < 5% → warning (conservative assumption)
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight } from "@/lib/insights/types";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

export interface CoastFireInputs {
  current: number;  // $
  target:  number;  // $
  rate:    number;  // %
  years:   number;  // years
}

export interface CoastFireOutputs {
  coastValue:     number;
  requiredNow:    number;
  coastShortfall?: number;
  coastSurplus?:   number;
  coastRatio?:     number;
  requiredNowNominal?: number;
  inflationPenalty?:   number;
  realRatePct?:        number;
}

const CPI_CAPTION = {
  text: `Real return = ${fredBenchmarks.cpiInflationYoY}% CPI removed (FRED ${fredBenchmarks.currentPeriodLabel})`,
  asOf: fredBenchmarks.currentPeriodLabel,
  live: true,
};

export function generateCoastFireInsights(
  inputs:  CoastFireInputs,
  outputs: CoastFireOutputs,
): Insight[] {
  const insights: Insight[] = [];

  const { current, target, rate, years } = inputs;
  const {
    coastValue,
    requiredNow,
    coastShortfall = 0,
    coastSurplus   = 0,
    coastRatio     = current / Math.max(requiredNow, 1),
    requiredNowNominal,
    inflationPenalty,
    realRatePct,
  } = outputs;

  // ── 0. Real vs naive coast number — the accuracy correction (live CPI) ─────
  if (
    requiredNowNominal !== undefined &&
    inflationPenalty !== undefined &&
    realRatePct !== undefined &&
    inflationPenalty > 0
  ) {
    insights.push({
      id:       "coastfire.real-vs-naive",
      severity: "warning",
      category: "projection",
      title:    `Your real Coast FIRE number is $${requiredNow.toLocaleString()} — not $${requiredNowNominal.toLocaleString()}`,
      body:     `Most coast calculators grow your savings at the full ${rate}% nominal return, but your $${target.toLocaleString()} target is in today's dollars — so the growth that counts is the REAL return of about ${realRatePct.toFixed(1)}% after ${fredBenchmarks.cpiInflationYoY}% inflation. That raises the amount you actually need today from $${requiredNowNominal.toLocaleString()} to $${requiredNow.toLocaleString()} — an extra $${inflationPenalty.toLocaleString()} the naive number quietly ignores.`,
      metric:   { label: "Inflation penalty", value: `$${inflationPenalty.toLocaleString()}` },
      visualization: {
        type:   "delta-card",
        before: { label: "Naive (nominal)",    value: `$${requiredNowNominal.toLocaleString()}` },
        after:  { label: "Real (inflation-adj)", value: `$${requiredNow.toLocaleString()}` },
        delta:  { label: "Extra needed",        value: `$${inflationPenalty.toLocaleString()}`, positive: false },
        caption: CPI_CAPTION,
      },
    });
  }

  // ── 1. Already coasted ──────────────────────────────────────────────────
  if (current >= requiredNow) {
    insights.push({
      id:       "coastfire.already-coasted",
      severity: "positive",
      category: "savings",
      title:    `Coast FIRE reached — $${current.toLocaleString()} exceeds the $${requiredNow.toLocaleString()} needed`,
      body:     `Your portfolio has passed your Coast FIRE number. You could stop all contributions today and your investments alone — growing at ${rate}% annually — would reach your $${target.toLocaleString()} target in ${years} years.`,
      metric:   { label: "Coast FIRE surplus", value: `$${(current - requiredNow).toLocaleString()}` },
      visualization: {
        type:           "benchmark-bar",
        userValue:      current,
        userLabel:      "Your portfolio",
        benchmarkValue: requiredNow,
        benchmarkLabel: "Coast FIRE number",
        format:         "currency",
      },
    });
  }

  // ── 2. Nearly there ─────────────────────────────────────────────────────
  if (current < requiredNow && coastRatio >= 0.75) {
    insights.push({
      id:       "coastfire.nearly-there",
      severity: "positive",
      category: "projection",
      title:    `${Math.round(coastRatio * 100)}% of the way to Coast FIRE — $${coastShortfall.toLocaleString()} to go`,
      body:     `You are $${coastShortfall.toLocaleString()} away from your Coast FIRE number of $${requiredNow.toLocaleString()}. Once you cross that line, every additional dollar invested is optional — your existing portfolio compounds the rest of the way to $${target.toLocaleString()}.`,
      metric:   { label: "Shortfall to coast", value: `$${coastShortfall.toLocaleString()}` },
    });
  }

  // ── 3. Halfway ──────────────────────────────────────────────────────────
  if (coastRatio >= 0.5 && coastRatio < 0.75) {
    insights.push({
      id:       "coastfire.halfway",
      severity: "neutral",
      category: "projection",
      title:    `${Math.round(coastRatio * 100)}% to Coast FIRE — $${coastShortfall.toLocaleString()} remaining`,
      body:     `Your $${current.toLocaleString()} portfolio is ${Math.round(coastRatio * 100)}% of the $${requiredNow.toLocaleString()} needed to coast. The remaining $${coastShortfall.toLocaleString()} is the last hurdle — once crossed, the market does the heavy lifting for the remaining ${years} years.`,
      metric:   { label: "Coast FIRE progress", value: `${Math.round(coastRatio * 100)}%` },
      visualization: {
        type:           "benchmark-bar",
        userValue:      current,
        userLabel:      "Your portfolio",
        benchmarkValue: requiredNow,
        benchmarkLabel: "Coast FIRE number",
        format:         "currency",
      },
    });
  }

  // ── 4. Large gap ────────────────────────────────────────────────────────
  if (coastRatio < 0.5) {
    insights.push({
      id:       "coastfire.large-gap",
      severity: "neutral",
      category: "projection",
      title:    `$${coastShortfall.toLocaleString()} needed to reach Coast FIRE`,
      body:     `Your Coast FIRE number is $${requiredNow.toLocaleString()} — the amount that, invested today at ${rate}%, would grow to your $${target.toLocaleString()} target in ${years} years without further contributions. You are $${coastShortfall.toLocaleString()} short. Front-loading contributions now means compound interest does exponentially more work over the remaining horizon.`,
      metric:   { label: "Shortfall to coast", value: `$${coastShortfall.toLocaleString()}` },
      visualization: {
        type:           "benchmark-bar",
        userValue:      current,
        userLabel:      "Your portfolio",
        benchmarkValue: requiredNow,
        benchmarkLabel: "Coast FIRE number",
        format:         "currency",
      },
    });
  }

  // ── 5. Portfolio overshoot ───────────────────────────────────────────────
  if (coastValue >= target * 1.5) {
    insights.push({
      id:       "coastfire.portfolio-overshoot",
      severity: "positive",
      category: "projection",
      title:    `Projected to reach $${coastValue.toLocaleString()} — ${Math.round((coastValue / target - 1) * 100)}% above your $${target.toLocaleString()} target`,
      body:     `At ${rate}% annual return over ${years} years, your current portfolio projects to $${coastValue.toLocaleString()} — well above the $${target.toLocaleString()} retirement target. This suggests either the target is conservative, or the return assumption is generous — worth stress-testing with a lower rate.`,
      metric:   { label: "Projected overshoot", value: `$${(coastValue - target).toLocaleString()}` },
    });
  }

  // ── 6. Low return rate risk ──────────────────────────────────────────────
  if (rate < 5) {
    insights.push({
      id:       "coastfire.low-rate-risk",
      severity: "neutral",
      category: "comparison",
      title:    `${rate}% is a conservative return assumption`,
      body:     `The long-run S&P 500 average is approximately 10% nominal and 7% inflation-adjusted. At ${rate}%, your Coast FIRE number is higher than it would be at 7% — a deliberate safety margin. The gap between a ${rate}% and a 7% projection is a useful measure of your downside buffer.`,
      metric:   { label: "Conservative return rate", value: `${rate}%` },
    });
  }

  // ── 7. Surplus framing ───────────────────────────────────────────────────
  if (coastSurplus > 50000) {
    insights.push({
      id:       "coastfire.coast-surplus",
      severity: "positive",
      category: "savings",
      title:    `$${coastSurplus.toLocaleString()} above your Coast FIRE number`,
      body:     `You have a $${coastSurplus.toLocaleString()} cushion above the minimum needed to coast. Every dollar contributed beyond this point accelerates your retirement date or increases the lifestyle your portfolio can support.`,
      metric:   { label: "Surplus above coast", value: `$${coastSurplus.toLocaleString()}` },
    });
  }

  return insights;
}
