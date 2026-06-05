// ─── WorthCore Insight Engine — EV Charging Cost Generator ───────────────────
//
// PURPOSE:
//   Visual, state-aware insights for the "ev-charging-cost" calculator.
//   Surfaces the annual cost in context, home vs. public cost split, the
//   opportunity from switching to a TOU/overnight rate plan, a 10-year
//   inflation-adjusted projection, and a high-rate-state flag.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Live electricity rate carries a provenance caption with its vintage
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency, formatCurrencyPrecise } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization }     from "@/lib/insights/types";
import {
  ELECTRICITY_INFLATION,
  TOU_BASIC_DISCOUNT,
  TOU_EV_RATE_DISCOUNT,
  PUBLIC_DCFC_RATE,
  type TouPlan,
} from "@/calculations/energy/evChargingCost";
import { usStateElectricityDataset } from "@/lib/datasets/regional/usStateElectricityPrices";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EvChargingInsightInputs {
  state:             string;
  milesPerYear:      number;
  kwhPer100mi:       number;
  publicChargingPct: number;
  touPlan:           TouPlan | string;
  /** Optional user-entered home $/kWh; when > 0 it overrides the live state rate. */
  homeRateOverride?: number;
}

export interface EvChargingInsightOutputs {
  annualTotalCost:     number;
  homeAnnualCost:      number;
  publicAnnualCost:    number;
  monthlyCost:         number;
  costPerMileCents:    number;
  noTouAnnualCost:     number;
  touAnnualSaving:     number;
  homeOnlyAnnualCost:  number;
  publicOnlyAnnualCost: number;
  effectiveHomeRate:   number;
  homeRateRaw:         number;
  inflatedCost10yr:    number;
  tenYearCost:         number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateEvChargingInsights(
  inputs:  EvChargingInsightInputs,
  outputs: EvChargingInsightOutputs,
): Insight[] {
  if (outputs.annualTotalCost <= 0) return [];

  const insights: Insight[] = [];
  const customRate = (inputs.homeRateOverride ?? 0) > 0;
  const stateLabel = inputs.state && inputs.state !== "National"
    ? inputs.state
    : "the US average";
  const rateLabel = customRate ? "your" : `${stateLabel}'s`;

  const liveCaption = customRate
    ? {
        text: `Your home power $${outputs.homeRateRaw.toFixed(3)}/kWh`,
        asOf: usStateElectricityDataset.currentPeriodLabel,
        live: false,
      }
    : {
        text: `${stateLabel} residential power $${outputs.homeRateRaw.toFixed(3)}/kWh`,
        asOf: usStateElectricityDataset.currentPeriodLabel,
        live: true,
      };

  // ── 1. Annual cost headline — benchmark-bar (your rate vs national avg) ───
  const nationalAnnual = Math.round(
    inputs.milesPerYear * (inputs.kwhPer100mi / 100) * usStateElectricityDataset.national,
  );
  const aboveNational = outputs.annualTotalCost > nationalAnnual * 1.1;

  insights.push({
    id:       "ev-charging.annual-cost",
    severity: aboveNational ? "warning" : "neutral",
    category: "spending",
    title:    `Your EV costs ${formatCurrency(outputs.annualTotalCost)}/year to charge.`,
    body:     `At ${rateLabel} residential rate of $${outputs.homeRateRaw.toFixed(3)}/kWh, driving ${Number(inputs.milesPerYear).toLocaleString()} miles/yr at ${inputs.kwhPer100mi} kWh/100mi works out to ${formatCurrency(outputs.monthlyCost)}/month — ${formatCurrency(outputs.costPerMileCents / 100)} per mile for the home-charging portion.`,
    metric:   { label: "Per year", value: formatCurrency(outputs.annualTotalCost) },
    visualization: {
      type:           "benchmark-bar",
      userValue:      Math.round(outputs.annualTotalCost),
      userLabel:      `${stateLabel} blend`,
      benchmarkValue: nationalAnnual,
      benchmarkLabel: "US avg (home only)",
      format:         "currency",
      caption:        liveCaption,
    } satisfies InsightVisualization,
  });

  // ── 2. Home vs. public split — donut ──────────────────────────────────────
  if (outputs.publicAnnualCost > 0 && outputs.homeAnnualCost > 0) {
    const pubPct = Math.round((outputs.publicAnnualCost / outputs.annualTotalCost) * 100);
    insights.push({
      id:       "ev-charging.home-vs-public",
      severity: pubPct >= 40 ? "warning" : "neutral",
      category: "comparison",
      title:    `Public fast-charging makes up ${pubPct}% of your charging bill.`,
      body:     `DC fast-chargers average ~$${PUBLIC_DCFC_RATE}/kWh — roughly ${Math.round(PUBLIC_DCFC_RATE / outputs.homeRateRaw)}× your home rate of $${outputs.homeRateRaw.toFixed(3)}/kWh. Your ${inputs.publicChargingPct}% public-charging share costs ${formatCurrency(outputs.publicAnnualCost)}/yr vs. ${formatCurrency(outputs.homeAnnualCost)}/yr for home.${pubPct >= 40 ? " Shifting more charging home (or finding free workplace charging) pays back fast." : ""}`,
      visualization: {
        type: "donut",
        segments: [
          { label: "Home charging",   value: Math.round(outputs.homeAnnualCost),   color: "#10b981" },
          { label: "Public charging", value: Math.round(outputs.publicAnnualCost), color: "#f59e0b" },
        ],
        centerLabel: `${100 - Number(inputs.publicChargingPct)}% home`,
        format:      "currency",
        caption:     liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── 3. TOU opportunity — delta-card ───────────────────────────────────────
  const plan = (inputs.touPlan ?? "none") as TouPlan;
  if (plan === "none") {
    // No TOU plan — show what they're leaving on the table
    const basicSaving   = Math.round(outputs.homeAnnualCost * TOU_BASIC_DISCOUNT / (1 - TOU_BASIC_DISCOUNT) * (1 - TOU_BASIC_DISCOUNT));
    const evRateSaving  = Math.round(outputs.homeAnnualCost * TOU_EV_RATE_DISCOUNT / (1 - TOU_EV_RATE_DISCOUNT) * (1 - TOU_EV_RATE_DISCOUNT));
    insights.push({
      id:       "ev-charging.tou-opportunity",
      severity: "positive",
      category: "investment-opportunity",
      title:    `A TOU overnight plan could save ${formatCurrency(basicSaving)}–${formatCurrency(evRateSaving)}/year.`,
      body:     `Many US utilities offer time-of-use (TOU) or dedicated EV overnight rate plans. A basic off-peak plan typically saves ~20% on home charging; dedicated EV rider plans (PG&E E-ELEC, Xcel EV Accelerate, SCE TOU-D-PRIME) save ~35%. On your home-charging bill of ${formatCurrency(outputs.homeAnnualCost)}/yr, that's ${formatCurrency(basicSaving)}–${formatCurrency(evRateSaving)}/yr — worth a 15-minute call to your utility.`,
      metric:   { label: "Potential saving / yr", value: `${formatCurrency(basicSaving)}–${formatCurrency(evRateSaving)}` },
    });
  } else {
    // On TOU — validate their saving with a delta-card
    const discountLabel = plan === "ev_rate"
      ? `EV overnight rate (${Math.round(TOU_EV_RATE_DISCOUNT * 100)}% off)`
      : `Basic TOU plan (${Math.round(TOU_BASIC_DISCOUNT * 100)}% off)`;
    insights.push({
      id:       "ev-charging.tou-saving",
      severity: "positive",
      category: "savings",
      title:    `Your ${discountLabel} saves ${formatCurrency(outputs.touAnnualSaving)}/year.`,
      body:     `Without the TOU discount you'd pay ${formatCurrency(outputs.noTouAnnualCost)}/yr. Your plan cuts the home-charging portion to an effective $${outputs.effectiveHomeRate.toFixed(4)}/kWh, saving ${formatCurrency(outputs.touAnnualSaving)}/yr — ${formatCurrency(outputs.touAnnualSaving * 10)} over 10 years.`,
      visualization: {
        type:   "delta-card",
        before: { label: "Standard rate / yr",  value: formatCurrencyPrecise(outputs.noTouAnnualCost) },
        after:  { label: "With TOU plan / yr",   value: formatCurrencyPrecise(outputs.annualTotalCost) },
        delta:  { label: "Saved / yr", value: formatCurrencyPrecise(outputs.touAnnualSaving), positive: true },
      } satisfies InsightVisualization,
    });
  }

  // ── 4. 10-year inflation-adjusted projection — projection-line ────────────
  {
    const sampleYears = [1, 2, 3, 5, 7, 10];
    let cumulative = 0;
    const cumByYear: number[] = [];
    for (let y = 1; y <= 10; y++) {
      cumulative += outputs.annualTotalCost * Math.pow(1 + ELECTRICITY_INFLATION, y - 1);
      cumByYear[y] = cumulative;
    }
    const points = sampleYears.map((y) => ({ label: `Yr ${y}`, value: Math.round(cumByYear[y]) }));
    const inflationExtra = Math.round(outputs.inflatedCost10yr - outputs.tenYearCost);

    insights.push({
      id:       "ev-charging.ten-year-projection",
      severity: outputs.inflatedCost10yr > 3000 ? "warning" : "neutral",
      category: "projection",
      title:    `Over 10 years this works out to about ${formatCurrency(outputs.inflatedCost10yr)}.`,
      body:     `Flat over 10 years: ${formatCurrency(outputs.tenYearCost)}. Factoring in ~${Math.round(ELECTRICITY_INFLATION * 100)}%/yr electricity inflation, it rises to ${formatCurrency(outputs.inflatedCost10yr)} — about ${formatCurrency(inflationExtra)} more. Locking in a TOU plan or improving efficiency compounds these savings over time.`,
      visualization: {
        type:    "projection-line",
        points,
        format:  "currency",
        yLabel:  "Cumulative charging cost",
        color:   "#6366f1",
        caption: {
          text: `${customRate ? "Your rate" : `${stateLabel} rate`} · ~${Math.round(ELECTRICITY_INFLATION * 100)}%/yr inflation`,
          asOf: usStateElectricityDataset.currentPeriodLabel,
          live: !customRate,
        },
      } satisfies InsightVisualization,
    });
  }

  // ── 5. High-rate-state context (skip when a custom rate is entered) ───────
  if (
    !customRate &&
    outputs.homeRateRaw > usStateElectricityDataset.national * 1.25 &&
    inputs.state !== "National"
  ) {
    const abovePct = Math.round((outputs.homeRateRaw / usStateElectricityDataset.national - 1) * 100);
    insights.push({
      id:       "ev-charging.high-rate-state",
      severity: "neutral",
      category: "comparison",
      title:    `${inputs.state} electricity runs ${abovePct}% above the US average.`,
      body:     `At $${outputs.homeRateRaw.toFixed(3)}/kWh, ${inputs.state} is ${abovePct}% above the national residential average of ${formatCurrencyPrecise(usStateElectricityDataset.national)}/kWh. Every kWh costs proportionally more here, which makes TOU rate plans and high-efficiency EVs pay back faster than they would in a lower-rate state.`,
      metric:   { label: `${inputs.state} rate`, value: `$${outputs.homeRateRaw.toFixed(3)}/kWh` },
    });
  }

  return insights;
}
