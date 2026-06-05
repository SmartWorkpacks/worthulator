// ─── WorthCore Insight Engine — 401(k) Generator ────────────────────────────
//
// PURPOSE:
//   Visual, live-captioned insights for the 401k-calculator. Leads with the
//   single highest-leverage idea in retirement saving — capturing the full
//   employer match (free money) — then shows the contribution/match/growth
//   split, the nominal→real gap via live FRED CPI, and the growth path.
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

export interface Retirement401kInsightInputs {
  currentBalance: number;
  salary: number;
  contributionPct: number;
  employerMatchPct: number;
  matchLimitPct: number;
  rate: number;
  years: number;
  annualRaisePct: number;
}

export interface Retirement401kInsightOutputs {
  balance: number;
  yourContributions: number;
  employerMatch: number;
  growth: number;
  realBalance: number;
  firstYearMatch: number;
  matchLeftOnTable: number;
  fullMatchCaptured: number;
}

const CPI_CAPTION = {
  text: `Deflated by US CPI ${fredBenchmarks.cpiInflationYoY}% YoY (FRED ${fredBenchmarks.currentPeriodLabel})`,
  asOf: fredBenchmarks.currentPeriodLabel,
  live: true,
};

/** Inline 401(k) balance at a horizon, mirroring the calc module (pure). */
function balanceAt(inp: Retirement401kInsightInputs, years: number): number {
  const monthlyRate = inp.rate / 100 / 12;
  const months = Math.round(years * 12);
  let bal = inp.currentBalance;
  let salary = inp.salary;
  for (let m = 0; m < months; m++) {
    if (m > 0 && m % 12 === 0) salary *= 1 + inp.annualRaisePct / 100;
    const annualEmployee = Math.min(salary * (inp.contributionPct / 100), 24_500);
    const matchedBasePct = Math.min(inp.contributionPct, inp.matchLimitPct);
    const annualMatch = salary * (matchedBasePct / 100) * (inp.employerMatchPct / 100);
    bal = bal * (1 + monthlyRate) + annualEmployee / 12 + annualMatch / 12;
  }
  return Math.round(bal);
}

export function generateRetirement401kInsights(
  inputs: Retirement401kInsightInputs,
  outputs: Retirement401kInsightOutputs,
): Insight[] {
  const insights: Insight[] = [];
  const { contributionPct, employerMatchPct, matchLimitPct, rate, years } = inputs;
  const {
    balance, yourContributions, employerMatch, growth, realBalance,
    matchLeftOnTable, fullMatchCaptured,
  } = outputs;

  if (balance <= 0 || years <= 0) return [];

  // ── 1. Free money: the employer match (the headline lever) ─────────────────
  if (matchLeftOnTable > 0) {
    const fullBalance = balanceAt({ ...inputs, contributionPct: Math.max(contributionPct, matchLimitPct) }, years);
    insights.push({
      id: "401k.match-gap",
      title: `You're leaving ${formatCurrency(matchLeftOnTable)} of free match on the table`,
      body: `Your employer matches up to ${matchLimitPct}% of salary, but you only contribute ${contributionPct}%. Raising your contribution to ${matchLimitPct}% would claim ${formatCurrency(matchLeftOnTable)} of extra match over ${years} years — and, compounded, push your balance from ${formatCurrency(balance)} to about ${formatCurrency(fullBalance)}. It's the closest thing to free money in personal finance.`,
      severity: "warning",
      category: "opportunity-cost",
      metric: { label: "Unclaimed match", value: formatCurrency(matchLeftOnTable) },
      visualization: {
        type: "benchmark-bar",
        userValue: Math.round(fullBalance),
        userLabel: `At ${matchLimitPct}% (full match)`,
        benchmarkValue: Math.round(balance),
        benchmarkLabel: `At your ${contributionPct}%`,
        format: "currency",
      } satisfies InsightVisualization,
    });
  } else {
    insights.push({
      id: "401k.match-captured",
      title: `You're capturing the full match — ${formatCurrency(employerMatch)} of free money`,
      body: `By contributing ${contributionPct}% you claim the entire employer match (up to ${matchLimitPct}% of salary). Over ${years} years that's ${formatCurrency(employerMatch)} you never had to earn — an instant ${employerMatchPct}% return on every matched dollar before the market does anything.`,
      severity: "positive",
      category: "investment",
      metric: { label: "Employer match", value: formatCurrency(employerMatch) },
      visualization: {
        type: "benchmark-bar",
        userValue: Math.round(yourContributions),
        userLabel: "You contribute",
        benchmarkValue: Math.round(employerMatch),
        benchmarkLabel: "Employer adds",
        format: "currency",
      } satisfies InsightVisualization,
    });
  }

  // ── 2. Where the balance comes from — donut ────────────────────────────────
  insights.push({
    id: "401k.split",
    title: `${((growth / balance) * 100).toFixed(0)}% of your balance is pure growth`,
    body: `Your ${formatCurrency(balance)} at retirement is built from three parts: ${formatCurrency(yourContributions)} you contributed, ${formatCurrency(employerMatch)} of employer match, and ${formatCurrency(growth)} of compound growth on top. The growth slice dominates because it has decades to work.`,
    severity: "positive",
    category: "investment",
    metric: { label: "Compound growth", value: formatCurrency(growth) },
    visualization: {
      type: "donut",
      segments: [
        { label: "Your contributions", value: Math.round(yourContributions), color: "#64748b" },
        { label: "Employer match", value: Math.round(employerMatch), color: "#3b82f6" },
        { label: "Growth", value: Math.round(growth), color: "#10b981" },
      ],
      centerLabel: formatCurrency(balance),
      format: "currency",
    } satisfies InsightVisualization,
  });

  // ── 3. Nominal vs real (today's dollars) — delta-card (live CPI) ───────────
  const inflationLoss = balance - realBalance;
  insights.push({
    id: "401k.real",
    title: `${formatCurrency(balance)} then ≈ ${formatCurrency(realBalance)} in today's money`,
    body: `A seven-figure-looking balance buys less than it appears decades out. At the current ${fredBenchmarks.cpiInflationYoY}% CPI, your ${formatCurrency(balance)} would have the buying power of about ${formatCurrency(realBalance)} today — roughly ${formatCurrency(inflationLoss)} eroded by inflation. Plan your retirement income off the real number.`,
    severity: "neutral",
    category: "projection",
    visualization: {
      type: "delta-card",
      before: { label: "At retirement", value: formatCurrency(balance) },
      after: { label: "Today's $", value: formatCurrency(realBalance) },
      delta: { label: "Inflation drag", value: formatCurrency(inflationLoss), positive: false },
      caption: CPI_CAPTION,
    } satisfies InsightVisualization,
  });

  // ── 4. Growth path — projection-line ───────────────────────────────────────
  const milestones = [0, Math.round(years * 0.25), Math.round(years * 0.5), Math.round(years * 0.75), years]
    .filter((v, i, a) => a.indexOf(v) === i);
  const points = milestones.map((yr) => ({
    label: yr === 0 ? "Now" : `Yr ${yr}`,
    value: balanceAt(inputs, yr),
  }));
  insights.push({
    id: "401k.path",
    title: `The balance accelerates as compounding takes over`,
    body: `Early on, most of the growth is your own contributions plus the match. In the final stretch, compounding does the heavy lifting — which is exactly why starting (and capturing the match) early matters far more than the rate you pick.`,
    severity: "neutral",
    category: "projection",
    visualization: {
      type: "projection-line",
      points,
      format: "currency",
      yLabel: "Balance",
      color: "#10b981",
      caption: { text: `${contributionPct}% of salary at ${rate.toFixed(1)}% return${fullMatchCaptured ? ", full match" : ""}` },
    } satisfies InsightVisualization,
  });

  return insights;
}
