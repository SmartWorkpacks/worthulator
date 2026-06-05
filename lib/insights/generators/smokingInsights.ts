// ─── WorthCore Insight Engine — Quit Smoking Generator ───────────────────────
//
// PURPOSE:
//   Deterministic insight rules for the "quit-smoking" engine calculator.
//   Celebrates quit milestones, benchmarks pack cost, and projects investment
//   opportunity from the money no longer spent on cigarettes.
//
// CALCULATOR OUTPUT SCHEMA (from calculatorConfigs.ts "quit-smoking"):
//   inputs:  packsPerDay, packCost, daysSinceQuit
//   outputs: moneySaved, cigarettesAvoided, daysOfLifeRegained
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Consumes outputs — NEVER runs new core calculations
//   ✅ All insight IDs are stable and unique: "smoking.<rule-name>"
//   ❌ Never import React
//   ❌ Never call fetch() or async operations
//
// ─────────────────────────────────────────────────────────────────────────────

import {
  formatCurrency,
  formatCurrencyPrecise,
} from "@/lib/insights/benchmarks";
import { futureValueAnnuity } from "@/lib/insights/projections";
import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { usStateCigaretteDataset } from "@/lib/datasets/regional/usStateCigarettePrices";

// ─── Rule thresholds ─────────────────────────────────────────────────────────

/**
 * US average annual spend for a 1 pack/day smoker at the live national average
 * pack price. Derived from the cigarette dataset so it stays in sync with the
 * Apify-refreshed prices (national × 365).
 */
const AVG_ANNUAL_SMOKER_SPEND = Math.round(usStateCigaretteDataset.national * 365);

/** Pack cost 15%+ above the state avg → "warning" severity on the benchmark. */
const HIGH_PACK_PRICE_THRESHOLD = 15;

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface SmokingInputs {
  state?:        string;
  packsPerDay:   number;
  packCost:      number;
  daysSinceQuit: number;
}

export interface SmokingOutputs {
  moneySaved:           number;
  cigarettesAvoided:    number;
  daysOfLifeRegained:   number;
  annualSaving:         number;
  investedValue10yr:    number;
  investedValue20yr:    number;
  totalContributed10yr: number;
  compoundGrowth10yr:   number;
  stateAvgPackPrice:    number;
  vsStateAvgPct:        number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

/**
 * Generate all applicable smoking cessation insights.
 * Focuses on: annual savings context, investment projections, pack price
 * comparisons, and milestone recognition.
 *
 * @param inputs   Calculator inputs  (packsPerDay, packCost, daysSinceQuit)
 * @param outputs  Calculator outputs (moneySaved, cigarettesAvoided, daysOfLifeRegained)
 */
export function generateSmokingInsights(
  inputs: SmokingInputs,
  outputs: SmokingOutputs,
): Insight[] {
  if (outputs.moneySaved <= 0) return [];

  const insights: Insight[] = [];

  const annualSpend = outputs.annualSaving;

  // ── Rule 1: Annual habit cost vs national average — benchmark-bar ─────────
  const aboveAvg = annualSpend > AVG_ANNUAL_SMOKER_SPEND * 1.2;
  insights.push({
    id:       aboveAvg ? "smoking.above-avg-annual-spend" : "smoking.annual-spend",
    category: "spending",
    severity: aboveAvg ? "warning" : "neutral",
    title:    aboveAvg
      ? `Your habit was costing ${formatCurrency(annualSpend)}/year — above average.`
      : `Your habit was costing ${formatCurrency(annualSpend)}/year.`,
    body:     `${aboveAvg ? "That's above" : "The US average is"} ${formatCurrency(AVG_ANNUAL_SMOKER_SPEND)}/year for a 1 pack/day smoker at the national average of ${formatCurrencyPrecise(usStateCigaretteDataset.national)}/pack. Every dollar of that now stays in your pocket.`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      annualSpend,
      userLabel:      "Your habit cost / yr",
      benchmarkValue: AVG_ANNUAL_SMOKER_SPEND,
      benchmarkLabel: "National avg / yr",
      format:         "currency",
    },
  });

  // ── Rule 2: 10-year investment projection of continued savings ─────────────
  const tenYearFV   = Math.round(futureValueAnnuity(annualSpend, 10));
  const tenYearGain = tenYearFV - annualSpend * 10;

  insights.push({
    id:       "smoking.investment-projection",
    category: "investment",
    severity: "positive",
    title:    `${formatCurrency(annualSpend)}/year invested at 7% is ${formatCurrency(tenYearFV)} in 10 years`,
    body:     `Investing the ${formatCurrency(annualSpend)}/year you are no longer spending on cigarettes at a 7% return produces ${formatCurrency(tenYearFV)} in 10 years. Of that, ${formatCurrency(Math.round(tenYearGain))} is compound growth on top of your contributions.`,
    metric:   { label: "10-yr investment value", value: formatCurrency(tenYearFV) },
    visualization: {
      type:   "projection-line",
      points: [1, 3, 5, 10, 20, 30].map((yr) => ({
        label: `Yr ${yr}`,
        value: Math.round(futureValueAnnuity(annualSpend, yr)),
      })),
      format: "currency",
      yLabel: "Invested value",
      color:  "#10b981",
    },
  });

  // ── Rule 3: Pack price vs YOUR STATE average — live benchmark-bar ───────────
  const stateAvg   = outputs.stateAvgPackPrice;
  const stateLabel = inputs.state && inputs.state !== "National" ? inputs.state : "the US average";
  if (stateAvg > 0 && inputs.packCost > 0) {
    const pctDiff = outputs.vsStateAvgPct;
    const above   = pctDiff > 0;
    const liveCaption = {
      text: `${stateLabel} avg ${formatCurrencyPrecise(stateAvg)}/pack`,
      asOf: usStateCigaretteDataset.currentPeriodLabel,
      live: true,
    };
    insights.push({
      id:       above ? "smoking.above-state-pack-price" : "smoking.vs-state-pack-price",
      category: "comparison",
      severity: above && pctDiff >= HIGH_PACK_PRICE_THRESHOLD ? "warning" : "neutral",
      title:    above
        ? `Your pack cost is ${Math.abs(pctDiff).toFixed(0)}% above ${stateLabel}`
        : pctDiff < 0
          ? `Your pack cost is ${Math.abs(pctDiff).toFixed(0)}% below ${stateLabel}`
          : `Your pack cost matches ${stateLabel}`,
      body:     `At ${formatCurrencyPrecise(inputs.packCost)}/pack you're paying ${
        above ? `more than` : pctDiff < 0 ? `less than` : `about`
      } the ${formatCurrencyPrecise(stateAvg)}/pack average for ${stateLabel}. State excise taxes are the biggest driver of pack price — and the higher your price, the more quitting puts back in your pocket.`,
      metric:   { label: `vs. ${stateLabel}`, value: `${above ? "+" : ""}${pctDiff.toFixed(0)}%` },
      visualization: {
        type:           "benchmark-bar",
        userValue:      Math.round(inputs.packCost * 100) / 100,
        userLabel:      "Your pack cost",
        benchmarkValue: stateAvg,
        benchmarkLabel: `${stateLabel} avg`,
        format:         "currency",
        caption:        liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── Rule 4: Milestone recognition — with delta-card visual ─────────────
  const wouldHaveSpent = outputs.moneySaved;
  let milestoneId: string;
  let milestoneTitle: string;
  let milestoneBody: string;

  if (inputs.daysSinceQuit >= 3_650) {
    milestoneId    = "smoking.milestone-10yr";
    milestoneTitle = "10 years smoke-free";
    milestoneBody  = `Ten years without cigarettes. The American Cancer Society states that at the 10-year mark, the risk of dying from lung cancer is roughly half that of someone who kept smoking. You have avoided ${outputs.cigarettesAvoided.toLocaleString()} cigarettes and reclaimed ${outputs.daysOfLifeRegained.toFixed(1)} days of life expectancy.`;
  } else if (inputs.daysSinceQuit >= 1_825) {
    milestoneId    = "smoking.milestone-5yr";
    milestoneTitle = "5 years smoke-free";
    milestoneBody  = `Five years smoke-free. The American Heart Association notes that after 5–15 years of not smoking, the risk of stroke returns to that of a non-smoker. You have avoided ${outputs.cigarettesAvoided.toLocaleString()} cigarettes.`;
  } else if (inputs.daysSinceQuit >= 365) {
    milestoneId    = "smoking.milestone-1yr";
    milestoneTitle = "One year smoke-free";
    milestoneBody  = `One year smoke-free. The CDC states that after one year, the excess risk of coronary heart disease is half that of a smoker. You have avoided ${outputs.cigarettesAvoided.toLocaleString()} cigarettes.`;
  } else if (inputs.daysSinceQuit >= 100) {
    milestoneId    = "smoking.milestone-100d";
    milestoneTitle = "100 days smoke-free";
    milestoneBody  = `100 days without cigarettes. Nicotine cravings typically peak in the first 3 weeks and weaken significantly after 3 months. You have avoided ${outputs.cigarettesAvoided.toLocaleString()} cigarettes.`;
  } else if (inputs.daysSinceQuit >= 30) {
    milestoneId    = "smoking.milestone-30d";
    milestoneTitle = "One month smoke-free";
    milestoneBody  = `One month without cigarettes. Within 2–12 weeks of quitting, circulation improves and lung function increases by up to 30%. You have avoided ${outputs.cigarettesAvoided.toLocaleString()} cigarettes.`;
  } else {
    milestoneId    = "smoking.milestone-early";
    milestoneTitle = "Every day counts";
    milestoneBody  = `${inputs.daysSinceQuit} days smoke-free. Within 20 minutes of your last cigarette, heart rate and blood pressure dropped. Within 12 hours, blood carbon monoxide levels returned to normal.`;
  }

  insights.push({
    id:       milestoneId,
    category: "savings",
    severity: "positive",
    title:    milestoneTitle,
    body:     milestoneBody,
    visualization: {
      type:   "delta-card",
      before: { label: "Would have spent", value: formatCurrency(wouldHaveSpent) },
      after:  { label: "Money kept",       value: formatCurrency(wouldHaveSpent) },
      delta:  { label: "Saved",            value: formatCurrency(wouldHaveSpent), positive: true },
    },
  });

  return insights;
}
