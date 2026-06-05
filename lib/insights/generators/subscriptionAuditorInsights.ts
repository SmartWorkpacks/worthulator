// ─── WorthCore Insight Engine — Subscription Auditor Generator ────────────────
//
// PURPOSE:
//   Visual insights for subscription spend: live national benchmark comparison,
//   category breakdown, opportunity cost projection, and realistic cut scenario.
//
// RULES:
//   ✅ Pure TypeScript — live benchmark captions from costBenchmarks
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightVisualization } from "../types";
import { formatCurrency } from "../benchmarks";
import { monthlyAnnuityFV } from "@/calculations/finance/subscriptionAuditor";
import { costBenchmarks } from "@/lib/datasets/costs/costBenchmarks";

export interface SubscriptionInputs {
  streaming:    number;
  software:     number;
  fitness:      number;
  newsMedia:    number;
  other:        number;
  annualReturn: number;
}

export interface SubscriptionOutputs {
  monthlyTotal?:          number;
  annualTotal?:           number;
  twentyYearCost?:        number;
  investedValue10?:       number;
  investedValue20?:       number;
  dailyCost?:             number;
  cutTwentyAnnualSaving?: number;
  cutTwentyInvested10?:   number;
  vsAvgMonthly?:          number;
  vsAvgPct?:              number;
  streamingPct?:          number;
  softwarePct?:           number;
  fitnessPct?:            number;
  newsMediaPct?:          number;
  otherPct?:              number;
  annualReturn?:          number;
}

// C+R Research (2023): median estimate $86/mo vs actual ~$219/mo.
const CR_UNDERESTIMATE_FACTOR = 2.5;

export function subscriptionAuditorInsights(
  inputs: SubscriptionInputs,
  outputs: SubscriptionOutputs,
): Insight[] {
  const streaming  = Number(inputs.streaming);
  const software   = Number(inputs.software);
  const fitness    = Number(inputs.fitness);
  const newsMedia  = Number(inputs.newsMedia);
  const other      = Number(inputs.other);
  const annualReturn = outputs.annualReturn ?? Number(inputs.annualReturn) ?? 7;

  const monthly = outputs.monthlyTotal ?? Math.round(streaming + software + fitness + newsMedia + other);
  if (monthly <= 0) return [];

  const annual  = outputs.annualTotal     ?? monthly * 12;
  const daily   = outputs.dailyCost       ?? Math.round((annual / 365) * 100) / 100;
  const inv10   = outputs.investedValue10 ?? monthlyAnnuityFV(monthly, 120, annualReturn);
  const inv20   = outputs.investedValue20 ?? monthlyAnnuityFvSafe(monthly, 240, annualReturn);
  const avgMonthly = costBenchmarks.subscriptionsMonthlyUs;
  const vsAvg = outputs.vsAvgMonthly ?? monthly - avgMonthly;

  const liveCaption = {
    text: `US avg household subscriptions ${formatCurrency(avgMonthly)}/mo`,
    asOf: costBenchmarks.currentPeriodLabel,
    live: true,
  };

  const insights: Insight[] = [];

  // ── 1. Monthly total vs live US benchmark — benchmark-bar ─────────────────
  insights.push({
    id:       "subs.total-vs-average",
    severity: monthly > avgMonthly * 1.5 ? "warning" : monthly > avgMonthly ? "neutral" : "positive",
    category: "comparison",
    title:    `${formatCurrency(monthly)}/month — ${vsAvg > 0 ? `${formatCurrency(vsAvg)} above the US household average` : vsAvg < 0 ? `${formatCurrency(Math.abs(vsAvg))} below average` : "right at the US average"}`,
    body:     `Live benchmark data puts the average US household at ${formatCurrency(avgMonthly)}/month across all digital subscriptions (Forbes/Chase 2025). C+R Research found people underestimate spend by ${CR_UNDERESTIMATE_FACTOR}× — guessing ~$86/mo while actually paying ~$219/mo.`,
    metric:   { label: "Your monthly total", value: formatCurrency(monthly) },
    visualization: {
      type:           "benchmark-bar",
      userValue:      Math.round(monthly),
      userLabel:      "Your subscriptions",
      benchmarkValue: Math.round(avgMonthly),
      benchmarkLabel: "US avg (live)",
      format:         "currency",
      caption:        liveCaption,
    } satisfies InsightVisualization,
  });

  // ── 2. Category breakdown — donut ─────────────────────────────────────────
  if (monthly >= 20) {
    const segments = [
      { label: "Streaming", value: Math.round(streaming),  color: "#8b5cf6" },
      { label: "Software",  value: Math.round(software),   color: "#3b82f6" },
      { label: "Fitness",   value: Math.round(fitness),    color: "#10b981" },
      { label: "News",      value: Math.round(newsMedia),  color: "#f59e0b" },
      { label: "Other",     value: Math.round(other),      color: "#6b7280" },
    ].filter((s) => s.value > 0);

    const top = segments.reduce((a, b) => (b.value > a.value ? b : a), segments[0]);
    insights.push({
      id:       "subs.category-breakdown",
      severity: "neutral",
      category: "spending",
      title:    `${top.label} is your biggest line item at ${formatCurrency(top.value)}/month.`,
      body:     `${formatCurrency(monthly)}/month splits across ${segments.length} categories. Streaming-only averages ${formatCurrency(costBenchmarks.streamingOnlyMonthlyUs)}/mo nationally — you're at ${formatCurrency(streaming)}/mo. Overlapping streaming services are the most common duplicate to cut.`,
      visualization: {
        type:        "donut",
        segments,
        centerLabel: formatCurrency(monthly),
        format:      "currency",
        caption:     liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── 3. 20% audit cut — delta-card ───────────────────────────────────────────
  const cutSaving = outputs.cutTwentyAnnualSaving ?? Math.round(annual * 0.2);
  if (cutSaving >= 100) {
    const afterCut = Math.round((monthly * 0.8) * 100) / 100;
    insights.push({
      id:       "subs.cut-twenty",
      severity: "positive",
      category: "investment-opportunity",
      title:    `A focused audit cutting 20% saves ${formatCurrency(cutSaving)}/year.`,
      body:     `Cancel duplicates, downgrade unused tiers, and switch eligible software to annual billing. Dropping from ${formatCurrency(monthly)} to ${formatCurrency(afterCut)}/month frees ${formatCurrency(cutSaving)}/year — ${formatCurrency(cutSaving * 10)} over a decade without losing core access.`,
      visualization: {
        type:   "delta-card",
        before: { label: "Current / mo", value: formatCurrency(monthly) },
        after:  { label: "After 20% cut", value: formatCurrency(afterCut) },
        delta:  { label: "Saved / yr", value: formatCurrency(cutSaving), positive: true },
      } satisfies InsightVisualization,
    });
  }

  // ── 4. Investment alternative — projection-line ────────────────────────────
  {
    const years = [1, 3, 5, 10, 15, 20];
    insights.push({
      id:       "subs.investment-alternative",
      severity: inv10 > annual * 5 ? "warning" : "neutral",
      category: "opportunity-cost",
      title:    `${formatCurrency(inv10)} in 10 years if invested at ${annualReturn}% instead.`,
      body:     `${formatCurrency(monthly)}/month (${formatCurrency(daily)}/day) invested monthly at ${annualReturn}% grows to ${formatCurrency(inv10)} in 10 years and ${formatCurrency(inv20)} in 20. That's ${formatCurrency(inv20 - annual * 20)} more than the ${formatCurrency(annual * 20)} you'd spend over 20 years at today's prices.`,
      metric:   { label: "10-year invested", value: formatCurrency(inv10) },
      visualization: {
        type:    "projection-line",
        points:  years.map((yr) => ({
          label: `Yr ${yr}`,
          value: Math.round(monthlyAnnuityFvSafe(monthly, yr * 12, annualReturn)),
        })),
        format:  "currency",
        yLabel:  "Invested value",
        color:   "#f59e0b",
        caption: { text: `${annualReturn}% annual return · monthly contributions`, asOf: costBenchmarks.currentPeriodLabel, live: false },
      } satisfies InsightVisualization,
    });
  }

  // ── 5. Fitness category — conditional ───────────────────────────────────────
  if (fitness > 50) {
    insights.push({
      id:       "subs.fitness",
      severity: "neutral",
      category: "spending",
      title:    `${formatCurrency(fitness)}/month on fitness — ${formatCurrency(fitness * 12)}/year.`,
      body:     `Fitness is the most frequently cancelled category — industry data suggests ~67% of gym memberships go underused. At ${formatCurrency(fitness)}/month, each unused week costs ~${formatCurrency(fitness / 4)}. Compare cost per actual visit before renewing.`,
      metric:   { label: "Annual fitness", value: formatCurrency(fitness * 12) },
    });
  }

  // ── 6. Software annual billing — conditional ────────────────────────────────
  if (software > 30) {
    const annualSoftware = Math.round(software * 12);
    const billingSave  = Math.round(annualSoftware * 0.2);
    insights.push({
      id:       "subs.software-arbitrage",
      severity: "positive",
      category: "savings",
      title:    `${formatCurrency(software)}/mo in software — annual billing often saves ~20%.`,
      body:     `Adobe, Microsoft 365, and most SaaS tools charge a monthly premium vs annual plans. At ${formatCurrency(software)}/month, switching eligible tools saves roughly ${formatCurrency(billingSave)}/year without cancelling anything.`,
      metric:   { label: "Potential saving", value: `${formatCurrency(billingSave)}/yr` },
    });
  }

  return insights;
}

function monthlyAnnuityFvSafe(monthly: number, months: number, rate: number): number {
  return monthlyAnnuityFV(monthly, months, rate);
}
