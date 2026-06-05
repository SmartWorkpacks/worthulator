// ─── WorthCore Insight Engine — Future Value Generator ───────────────────────
//
// PURPOSE:
//   Visual, live-captioned insights for the future-value calculator. Surfaces
//   the contributions-vs-compounding split, the nominal→real (today's dollars)
//   gap using the live FRED CPI, the growth curve, the money multiple, and the
//   accelerating late-stage compounding.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic
//   ✅ Live CPI carries a provenance caption
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { formatCurrency } from "@/lib/insights/benchmarks";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

export interface FutureValueInsightInputs {
  initial: number;
  monthly: number;
  rate: number;
  years: number;
}

export interface FutureValueInsightOutputs {
  futureValue: number;
  totalInvested: number;
  totalContributions: number;
  totalInterest: number;
  realFutureValue: number;
  inflationLoss: number;
  interestSharePct: number;
  growthMultiple: number;
  finalYearInterest: number;
  doublingYears: number;
}

const CPI_CAPTION = {
  text: `Deflated by US CPI ${fredBenchmarks.cpiInflationYoY}% YoY (FRED ${fredBenchmarks.currentPeriodLabel})`,
  asOf: fredBenchmarks.currentPeriodLabel,
  live: true,
};

/** Inline monthly-compounding balance (pure) for the projection curve. */
function fvAt(initial: number, monthly: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12;
  const n = Math.round(years * 12);
  if (r === 0) return initial + monthly * n;
  const pow = Math.pow(1 + r, n);
  return initial * pow + monthly * ((pow - 1) / r);
}

export function generateFutureValueInsights(
  inputs: FutureValueInsightInputs,
  outputs: FutureValueInsightOutputs,
): Insight[] {
  const insights: Insight[] = [];
  const { initial, monthly, rate, years } = inputs;
  const {
    futureValue, totalInvested, totalInterest, realFutureValue, inflationLoss,
    interestSharePct, growthMultiple, finalYearInterest, doublingYears,
  } = outputs;

  if (futureValue <= 0 || years <= 0) return [];

  // ── 1. Contributions vs compounding — donut ────────────────────────────────
  insights.push({
    id: "future-value.split",
    title: `${interestSharePct.toFixed(0)}% of your ${formatCurrency(futureValue)} is pure compounding`,
    body: `You contribute ${formatCurrency(totalInvested)} over ${years} years, but the balance reaches ${formatCurrency(futureValue)} — ${formatCurrency(totalInterest)} of that is growth you never deposited. The longer the horizon, the more this slice dominates.`,
    severity: "positive",
    category: "investment",
    metric: { label: "Compound growth", value: formatCurrency(totalInterest) },
    visualization: {
      type: "donut",
      segments: [
        { label: "You invested", value: Math.round(totalInvested), color: "#64748b" },
        { label: "Compound growth", value: Math.round(totalInterest), color: "#10b981" },
      ],
      centerLabel: formatCurrency(futureValue),
      format: "currency",
    } satisfies InsightVisualization,
  });

  // ── 2. Nominal vs real (today's dollars) — delta-card (live CPI) ────────────
  insights.push({
    id: "future-value.real",
    title: `${formatCurrency(futureValue)} then ≈ ${formatCurrency(realFutureValue)} in today's money`,
    body: `Inflation quietly shrinks the headline number. At the current ${fredBenchmarks.cpiInflationYoY}% CPI, your ${formatCurrency(futureValue)} would buy what ${formatCurrency(realFutureValue)} buys today — ${formatCurrency(inflationLoss)} of the nominal total is eaten by rising prices. This is why a return above inflation matters.`,
    severity: "neutral",
    category: "projection",
    visualization: {
      type: "delta-card",
      before: { label: "Nominal", value: formatCurrency(futureValue) },
      after: { label: "Today's $", value: formatCurrency(realFutureValue) },
      delta: { label: "Inflation drag", value: formatCurrency(inflationLoss), positive: false },
      caption: CPI_CAPTION,
    } satisfies InsightVisualization,
  });

  // ── 3. Growth curve — projection-line ──────────────────────────────────────
  const milestones = [0, Math.round(years * 0.25), Math.round(years * 0.5), Math.round(years * 0.75), years]
    .filter((v, i, a) => a.indexOf(v) === i);
  const points = milestones.map((yr) => ({
    label: yr === 0 ? "Start" : `Yr ${yr}`,
    value: Math.round(fvAt(initial, monthly, rate, yr)),
  }));
  insights.push({
    id: "future-value.curve",
    title: `The curve steepens — most growth lands late`,
    body: `Compounding is back-loaded: the balance barely moves early, then accelerates. By the final year alone you earn ${formatCurrency(finalYearInterest)} in growth — about ${formatCurrency(Math.round(finalYearInterest / 12))}/month, without lifting a finger.`,
    severity: "neutral",
    category: "projection",
    visualization: {
      type: "projection-line",
      points,
      format: "currency",
      yLabel: "Balance",
      color: "#10b981",
      caption: { text: `${formatCurrency(initial)} + ${formatCurrency(monthly)}/mo at ${rate.toFixed(1)}%` },
    } satisfies InsightVisualization,
  });

  // ── 4. Money in vs out — benchmark-bar ─────────────────────────────────────
  insights.push({
    id: "future-value.multiple",
    title: `Your money grows ${growthMultiple.toFixed(2)}× over ${years} years`,
    body: `Every $1 you put in becomes about $${growthMultiple.toFixed(2)} by the end. That multiple is the whole case for starting early — it's driven almost entirely by how long the money compounds, not by timing the market.`,
    severity: "positive",
    category: "investment",
    visualization: {
      type: "benchmark-bar",
      userValue: Math.round(futureValue),
      userLabel: "You get",
      benchmarkValue: Math.round(totalInvested),
      benchmarkLabel: "You put in",
      format: "currency",
    } satisfies InsightVisualization,
  });

  // ── 5. Doubling cadence ────────────────────────────────────────────────────
  if (doublingYears > 0) {
    insights.push({
      id: "future-value.doubling",
      title: `At ${rate.toFixed(1)}%, money doubles about every ${doublingYears.toFixed(0)} years`,
      body: `A lump sum left alone doubles roughly every ${doublingYears.toFixed(0)} years at this rate (the "rule of 72" in action). Over a ${years}-year horizon that's about ${Math.floor(years / doublingYears)} doublings — which is why decades matter far more than dollars early on.`,
      severity: "neutral",
      category: "investment",
      metric: { label: "Doubling time", value: `${doublingYears.toFixed(0)} yr` },
    });
  }

  // ── 6. Start-now framing — one extra year ──────────────────────────────────
  const plusOne = Math.round(fvAt(initial, monthly, rate, years + 1));
  const oneYearWorth = plusOne - futureValue;
  if (oneYearWorth > 0) {
    insights.push({
      id: "future-value.one-more-year",
      title: `One more year is worth ${formatCurrency(oneYearWorth)}`,
      body: `Extending the horizon by a single year lifts the balance from ${formatCurrency(futureValue)} to ${formatCurrency(plusOne)} — a ${formatCurrency(oneYearWorth)} gain from one extra year of compounding plus ${formatCurrency(monthly * 12)} of contributions. The flip side: every year you delay starting costs about this much.`,
      severity: "neutral",
      category: "opportunity-cost",
      metric: { label: "Value of +1 year", value: formatCurrency(oneYearWorth) },
    });
  }

  return insights;
}
