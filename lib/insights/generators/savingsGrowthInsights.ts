// ─── WorthCore Insight Engine — Savings Growth Generator ─────────────────────
//
// PURPOSE:
//   Visual, live-captioned insights for the savings-calculator. Framed around
//   the question that matters for a savings account: does your APY actually
//   beat inflation, and how much does a high-yield account add over a legacy
//   bank? Surfaces the real (today's-dollars) balance via live FRED CPI.
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
import { LEGACY_BANK_APY } from "@/calculations/finance/savingsGrowth";

export interface SavingsGrowthInsightInputs {
  initial: number;
  monthly: number;
  rate: number;
  years: number;
}

export interface SavingsGrowthInsightOutputs {
  balance: number;
  totalDeposited: number;
  interestEarned: number;
  realBalance: number;
  inflationLoss: number;
  interestSharePct: number;
  realReturnPct: number;
  beatsInflation: number;
  hysaAdvantage: number;
}

const CPI_CAPTION = {
  text: `Deflated by US CPI ${fredBenchmarks.cpiInflationYoY}% YoY (FRED ${fredBenchmarks.currentPeriodLabel})`,
  asOf: fredBenchmarks.currentPeriodLabel,
  live: true,
};

const RATE_CAPTION = {
  text: `vs US CPI ${fredBenchmarks.cpiInflationYoY}% YoY (FRED ${fredBenchmarks.currentPeriodLabel})`,
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

export function generateSavingsGrowthInsights(
  inputs: SavingsGrowthInsightInputs,
  outputs: SavingsGrowthInsightOutputs,
): Insight[] {
  const insights: Insight[] = [];
  const { initial, monthly, rate, years } = inputs;
  const {
    balance, totalDeposited, interestEarned, realBalance, inflationLoss,
    interestSharePct, realReturnPct, beatsInflation, hysaAdvantage,
  } = outputs;

  if (balance <= 0 || years <= 0) return [];

  const cpi = fredBenchmarks.cpiInflationYoY;

  // ── 1. Beat inflation? — benchmark-bar (live CPI) ──────────────────────────
  insights.push({
    id: "savings.real-return",
    title:
      beatsInflation === 1
        ? `Your ${rate.toFixed(2)}% APY beats inflation by ${realReturnPct.toFixed(1)} points`
        : `Your ${rate.toFixed(2)}% APY is losing to ${cpi}% inflation`,
    body:
      beatsInflation === 1
        ? `A savings account only builds wealth when its rate clears inflation. At ${rate.toFixed(2)}% against ${cpi}% CPI, your money grows about ${realReturnPct.toFixed(1)}% per year in real terms — slow, but genuinely ahead of rising prices.`
        : `At ${rate.toFixed(2)}% your balance grows on paper, but ${cpi}% inflation is rising faster — so each year your savings buy a little less. A high-yield account (4–5% APY) would flip this to a positive real return.`,
    severity: beatsInflation === 1 ? "positive" : "warning",
    category: "investment",
    metric: { label: "Real return", value: `${realReturnPct.toFixed(1)}%` },
    visualization: {
      type: "benchmark-bar",
      userValue: Number(rate.toFixed(2)),
      userLabel: "Your APY",
      benchmarkValue: cpi,
      benchmarkLabel: "Inflation (CPI)",
      format: "percent",
      caption: RATE_CAPTION,
    } satisfies InsightVisualization,
  });

  // ── 2. Nominal vs real balance — delta-card (live CPI) ─────────────────────
  insights.push({
    id: "savings.real-balance",
    title: `${formatCurrency(balance)} then ≈ ${formatCurrency(realBalance)} in today's money`,
    body: `Your balance reaches ${formatCurrency(balance)} after ${years} years, but inflation keeps working too. At ${cpi}% CPI, that pot would buy what ${formatCurrency(realBalance)} buys today — ${formatCurrency(inflationLoss)} of the headline figure is erased by rising prices.`,
    severity: "neutral",
    category: "projection",
    visualization: {
      type: "delta-card",
      before: { label: "Balance", value: formatCurrency(balance) },
      after: { label: "Today's $", value: formatCurrency(realBalance) },
      delta: { label: "Inflation drag", value: formatCurrency(inflationLoss), positive: false },
      caption: CPI_CAPTION,
    } satisfies InsightVisualization,
  });

  // ── 3. Deposits vs interest — donut ────────────────────────────────────────
  insights.push({
    id: "savings.split",
    title: `${interestSharePct.toFixed(0)}% of your balance is interest you never deposited`,
    body: `You put in ${formatCurrency(totalDeposited)} over ${years} years, and the account adds ${formatCurrency(interestEarned)} on top. The longer you leave it, the larger that green slice grows relative to what you deposit.`,
    severity: "positive",
    category: "investment",
    metric: { label: "Interest earned", value: formatCurrency(interestEarned) },
    visualization: {
      type: "donut",
      segments: [
        { label: "You deposited", value: Math.round(totalDeposited), color: "#64748b" },
        { label: "Interest", value: Math.round(interestEarned), color: "#10b981" },
      ],
      centerLabel: formatCurrency(balance),
      format: "currency",
    } satisfies InsightVisualization,
  });

  // ── 4. High-yield vs legacy bank — benchmark-bar ───────────────────────────
  if (hysaAdvantage > 0) {
    const legacyInterest = Math.max(0, interestEarned - hysaAdvantage);
    insights.push({
      id: "savings.hysa-advantage",
      title: `A high-yield account earns ${formatCurrency(hysaAdvantage)} more than a legacy bank`,
      body: `The average legacy savings account pays just ${LEGACY_BANK_APY}% APY. On these same deposits it would earn only ${formatCurrency(legacyInterest)} in interest — versus ${formatCurrency(interestEarned)} at your ${rate.toFixed(2)}% rate. That ${formatCurrency(hysaAdvantage)} gap is free money for moving accounts.`,
      severity: "positive",
      category: "opportunity-cost",
      metric: { label: "HYSA bonus", value: formatCurrency(hysaAdvantage) },
      visualization: {
        type: "benchmark-bar",
        userValue: Math.round(interestEarned),
        userLabel: `Your ${rate.toFixed(2)}% APY`,
        benchmarkValue: Math.round(legacyInterest),
        benchmarkLabel: `Legacy ${LEGACY_BANK_APY}% bank`,
        format: "currency",
      } satisfies InsightVisualization,
    });
  }

  // ── 5. Growth path — projection-line ───────────────────────────────────────
  const milestones = [0, Math.round(years * 0.25), Math.round(years * 0.5), Math.round(years * 0.75), years]
    .filter((v, i, a) => a.indexOf(v) === i);
  const points = milestones.map((yr) => ({
    label: yr === 0 ? "Start" : `Yr ${yr}`,
    value: Math.round(fvAt(initial, monthly, rate, yr)),
  }));
  insights.push({
    id: "savings.path",
    title: `From ${formatCurrency(initial)} to ${formatCurrency(balance)} — the path`,
    body: `Steady deposits plus compounding turn a ${formatCurrency(initial)} start and ${formatCurrency(monthly)}/mo into ${formatCurrency(balance)} over ${years} years. The line bends upward as interest starts earning interest of its own.`,
    severity: "neutral",
    category: "projection",
    visualization: {
      type: "projection-line",
      points,
      format: "currency",
      yLabel: "Balance",
      color: "#10b981",
      caption: { text: `${formatCurrency(initial)} + ${formatCurrency(monthly)}/mo at ${rate.toFixed(2)}% APY` },
    } satisfies InsightVisualization,
  });

  return insights;
}
