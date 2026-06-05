// ─── WorthCore Insight Engine — Inflation Impact Generator ───────────────────
//
// PURPOSE:
//   Visual, live-captioned insights for the inflation-impact calculator. Surfaces
//   purchasing-power erosion, the mirror "amount needed to keep pace", the halving
//   horizon, the user's rate vs the live FRED CPI, and the break-even return.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic
//   ✅ Live CPI carries provenance caption
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { formatCurrency } from "@/lib/insights/benchmarks";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

export interface InflationImpactInputs {
  amount: number;
  rate: number;
  years: number;
}

export interface InflationImpactOutputs {
  futureValue: number;
  loss: number;
  lossPercent: number;
  requiredFuture: number;
  erosionMultiple: number;
  firstYearLoss: number;
  dailyLossFirstYear: number;
  yearsToHalve: number;
  realValueRatio: number;
  vsCurrentCpi: number;
}

const CPI_CAPTION = {
  text: `US CPI ${fredBenchmarks.cpiInflationYoY}% YoY (FRED ${fredBenchmarks.currentPeriodLabel})`,
  asOf: fredBenchmarks.currentPeriodLabel,
  live: true,
};

export function generateInflationImpactInsights(
  inputs: InflationImpactInputs,
  outputs: InflationImpactOutputs,
): Insight[] {
  const insights: Insight[] = [];
  const { amount, rate, years } = inputs;
  const {
    futureValue, loss, lossPercent, requiredFuture,
    firstYearLoss, dailyLossFirstYear, yearsToHalve, vsCurrentCpi,
  } = outputs;

  if (amount <= 0 || years <= 0) return [];

  // ── 1. Buying-power erosion — benchmark-bar (always) ───────────────────────
  insights.push({
    id: "inflation-impact.erosion",
    title: `${formatCurrency(amount)} today → ${formatCurrency(futureValue)} of buying power in ${years} years`,
    body: `At ${rate.toFixed(1)}% inflation, ${formatCurrency(amount)} loses ${lossPercent.toFixed(1)}% of its purchasing power over ${years} years — a ${formatCurrency(loss)} hit in real terms, without you spending a cent. Cash left idle is quietly shrinking.`,
    severity: lossPercent > 40 ? "warning" : "neutral",
    category: "hidden-cost",
    metric: { label: "Real value lost", value: formatCurrency(loss) },
    visualization: {
      type: "benchmark-bar",
      userValue: futureValue,
      userLabel: `In ${years} yr`,
      benchmarkValue: amount,
      benchmarkLabel: "Today",
      format: "currency",
      caption: CPI_CAPTION,
    } satisfies InsightVisualization,
  });

  // ── 2. The mirror — amount needed to keep pace — delta-card ────────────────
  insights.push({
    id: "inflation-impact.required-future",
    title: `You'd need ${formatCurrency(requiredFuture)} to match today's ${formatCurrency(amount)}`,
    body: `Inflation cuts both ways. To preserve the buying power of ${formatCurrency(amount)} today, you'd need ${formatCurrency(requiredFuture)} in ${years} years. That's the income or nest-egg target inflation quietly raises on you — ${formatCurrency(requiredFuture - amount)} more just to stand still.`,
    severity: "neutral",
    category: "opportunity-cost",
    visualization: {
      type: "delta-card",
      before: { label: "Today", value: formatCurrency(amount) },
      after: { label: `In ${years} yr`, value: formatCurrency(requiredFuture) },
      delta: { label: "Inflation gap", value: formatCurrency(requiredFuture - amount), positive: false },
      caption: CPI_CAPTION,
    } satisfies InsightVisualization,
  });

  // ── 3. Buying-power decline over time — projection-line ────────────────────
  const r = rate / 100;
  const pts = [0, Math.round(years * 0.25), Math.round(years * 0.5), Math.round(years * 0.75), years]
    .filter((v, i, a) => a.indexOf(v) === i)
    .map((yr) => ({ label: yr === 0 ? "Now" : `Yr ${yr}`, value: Math.round(amount / Math.pow(1 + r, yr)) }));
  insights.push({
    id: "inflation-impact.decline-curve",
    title: `Buying power decays toward ${formatCurrency(futureValue)}`,
    body: `Purchasing power erodes on a compounding curve — slow at first, then accelerating. The chart traces what ${formatCurrency(amount)} is really worth at each milestone if prices rise ${rate.toFixed(1)}% a year.`,
    severity: "neutral",
    category: "financial-stress",
    visualization: {
      type: "projection-line",
      points: pts,
      format: "currency",
      yLabel: "Real buying power",
      color: "#ef4444",
      caption: { text: `${formatCurrency(amount)} eroding at ${rate.toFixed(1)}%/yr` },
    } satisfies InsightVisualization,
  });

  // ── 4. Halving horizon ─────────────────────────────────────────────────────
  if (yearsToHalve > 0 && yearsToHalve < 60) {
    insights.push({
      id: "inflation-impact.halving",
      title: `Your money halves in ~${yearsToHalve.toFixed(0)} years`,
      body: `At ${rate.toFixed(1)}% inflation, purchasing power is cut in half roughly every ${yearsToHalve.toFixed(0)} years. Any money earning less than ${rate.toFixed(1)}% annually is losing the race — a "high-yield" savings account at less than that is still going backwards in real terms.`,
      severity: rate >= 5 ? "warning" : "neutral",
      category: "debt-burden",
      metric: { label: "Half-life of your cash", value: `${yearsToHalve.toFixed(0)} yr` },
    });
  }

  // ── 5. Your rate vs the live CPI — benchmark-bar ───────────────────────────
  insights.push({
    id: "inflation-impact.vs-cpi",
    title:
      Math.abs(vsCurrentCpi) < 0.2
        ? `Your ${rate.toFixed(1)}% assumption matches today's CPI`
        : vsCurrentCpi > 0
          ? `You're modelling ${vsCurrentCpi.toFixed(1)} pts above today's CPI`
          : `You're modelling ${Math.abs(vsCurrentCpi).toFixed(1)} pts below today's CPI`,
    body: `The current US CPI is ${fredBenchmarks.cpiInflationYoY}% year-over-year (FRED, ${fredBenchmarks.currentPeriodLabel}). Your ${rate.toFixed(1)}% assumption ${Math.abs(vsCurrentCpi) < 0.2 ? "is right in line with it" : vsCurrentCpi > 0 ? "is more pessimistic — useful for stress-testing" : "is more optimistic than the latest reading"}. The long-run US average is ~3.3%.`,
    severity: "neutral",
    category: "comparison",
    visualization: {
      type: "benchmark-bar",
      userValue: Math.round(rate * 10) / 10,
      userLabel: "Your rate",
      benchmarkValue: fredBenchmarks.cpiInflationYoY,
      benchmarkLabel: "Current CPI",
      format: "number",
      caption: CPI_CAPTION,
    } satisfies InsightVisualization,
  });

  // ── 6. Break-even / first-year framing ─────────────────────────────────────
  if (rate > 0) {
    insights.push({
      id: "inflation-impact.break-even",
      title: `Needs ${rate.toFixed(1)}%+ return just to break even`,
      body: `In year one alone, ${formatCurrency(amount)} loses about ${formatCurrency(firstYearLoss)} of real value (~${formatCurrency(dailyLossFirstYear)}/day). To preserve it, your money must grow at least ${rate.toFixed(1)}% a year; targeting ${(rate + 2).toFixed(1)}%+ via index funds or bonds earns a real return above inflation.`,
      severity: "neutral",
      category: "investment-opportunity",
      metric: { label: "Year-1 real loss", value: formatCurrency(firstYearLoss) },
    });
  }

  return insights;
}
