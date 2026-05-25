// ─── VPPExchange Energy Engine — Insight Rules ────────────────────────────────
//
// PURPOSE:
//   Energy-domain insight generators. Plug directly into the shared
//   LiveInsightBlock via GENERATOR_REGISTRY.
//
// USAGE:
//   import { generateSolarRoiInsights, generateVppRoiInsights } from "./insightRules";
//   GENERATOR_REGISTRY["solar-roi"] = generateSolarRoiInsights;
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightGenerator } from "../insights/types";
import { SolarRoiInputs, SolarRoiOutputs, BatteryRoiInputs, BatteryRoiOutputs, VppParticipationInputs, VppParticipationOutputs } from "./types";
import { VED, getBenchmark } from "./assumptions";

// ─── Solar ROI Insights ───────────────────────────────────────────────────────

export const generateSolarRoiInsights: InsightGenerator<SolarRoiInputs, SolarRoiOutputs> =
  (inputs, outputs) => {
    const insights: Insight[] = [];
    const region = inputs.region ?? "National Average";
    const benchmark = getBenchmark(region);

    // Payback period benchmark
    const goodPayback = 8;
    const okPayback   = 12;
    if (outputs.paybackPeriodYears <= goodPayback) {
      insights.push({
        id:         "solar-payback-excellent",
        title:      "Excellent payback period",
        body:       `Your system pays back in ${outputs.paybackPeriodYears} years — well below the ${goodPayback}-year benchmark for ${region}.`,
        severity:   "positive",
        category:   "roi",
        value:      outputs.paybackPeriodYears,
        unit:       "years",
        confidence: 0.9,
      });
    } else if (outputs.paybackPeriodYears <= okPayback) {
      insights.push({
        id:       "solar-payback-average",
        title:    "Average payback period",
        body:     `A ${outputs.paybackPeriodYears}-year payback is typical for ${region}. Consider pairing with a battery for faster ROI.`,
        severity: "neutral",
        category: "roi",
        value:    outputs.paybackPeriodYears,
        unit:     "years",
        confidence: 0.85,
      });
    } else {
      insights.push({
        id:       "solar-payback-slow",
        title:    "Payback period is longer than average",
        body:     `${outputs.paybackPeriodYears} years is above the regional average. Lower system cost or higher utility rates could improve this.`,
        severity: "warning",
        category: "roi",
        value:    outputs.paybackPeriodYears,
        unit:     "years",
        confidence: 0.8,
      });
    }

    // 25-year net value
    if (outputs.twentyFiveYearNetValue > 20_000) {
      insights.push({
        id:       "solar-25yr-value",
        title:    "Strong 25-year return",
        body:     `Your system generates $${outputs.twentyFiveYearNetValue.toLocaleString()} in net value over 25 years — equivalent to a ${((outputs.twentyFiveYearNetValue / outputs.effectiveCostAfterCredit) * 100).toFixed(0)}% total return.`,
        severity: "positive",
        category: "projection",
        value:    outputs.twentyFiveYearNetValue,
        unit:     "$",
        confidence: 0.8,
      });
    }

    // High utility rate region
    if (benchmark.averageRatePerKwh > 0.20) {
      insights.push({
        id:       "solar-high-rate-region",
        title:    `${region} has above-average electricity rates`,
        body:     `At $${benchmark.averageRatePerKwh.toFixed(3)}/kWh, ${region} is in the top tier for solar ROI. Your system captures maximum savings.`,
        severity: "positive",
        category: "benchmark",
        value:    benchmark.averageRatePerKwh,
        unit:     "$/kWh",
        confidence: 0.95,
      });
    }

    // CO₂ impact
    insights.push({
      id:       "solar-co2",
      title:    "Annual carbon offset",
      body:     `Your system offsets ${outputs.co2OffsetTonnesPerYear} tonnes of CO₂ per year — equivalent to planting about ${Math.round(outputs.co2OffsetTonnesPerYear * 40)} trees.`,
      severity: "positive",
      category: "projection",
      value:    outputs.co2OffsetTonnesPerYear,
      unit:     "tonnes CO₂/yr",
      confidence: 0.9,
    });

    return insights;
  };

// ─── Battery ROI Insights ─────────────────────────────────────────────────────

export const generateBatteryRoiInsights: InsightGenerator<BatteryRoiInputs, BatteryRoiOutputs> =
  (inputs, outputs) => {
    const insights: Insight[] = [];
    const region = inputs.region ?? "National Average";
    const benchmark = getBenchmark(region);
    const hasTou = (inputs.utilityRate.touTiers?.length ?? 0) > 0;

    // TOU advisory
    if (!hasTou) {
      insights.push({
        id:       "battery-no-tou",
        title:    "Switch to TOU rates to maximise savings",
        body:     `Without time-of-use pricing, your battery's arbitrage benefit is limited. Contact ${region} utilities about TOU rate plans.`,
        severity: "warning",
        category: "benchmark",
        value:    0,
        unit:     "",
        confidence: 0.85,
      });
    }

    // 20-year net value
    if (outputs.twentyYearNetValue > 0) {
      insights.push({
        id:       "battery-positive-npv",
        title:    "Battery achieves positive 20-year return",
        body:     `Net value over 20 years: $${outputs.twentyYearNetValue.toLocaleString()}. Pairing with solar can shorten your payback by 2–4 years.`,
        severity: "positive",
        category: "projection",
        value:    outputs.twentyYearNetValue,
        unit:     "$",
        confidence: 0.8,
      });
    } else {
      insights.push({
        id:       "battery-negative-npv",
        title:    "Battery may not pay back in 20 years",
        body:     `In ${region} at $${benchmark.averageRatePerKwh.toFixed(3)}/kWh, standalone battery economics are challenging. VPP enrollment could add $${(VED.vppDispatchRatePerKwh * VED.vppDispatchEventsPerYear * VED.batteryCapacityKwh * VED.vppEventDurationHours).toFixed(0)}/yr revenue.`,
        severity: "warning",
        category: "roi",
        value:    outputs.twentyYearNetValue,
        unit:     "$",
        confidence: 0.75,
      });
    }

    // CO₂ insight
    insights.push({
      id:       "battery-co2",
      title:    "Lifetime grid emissions avoided",
      body:     `Your battery shifts ${outputs.lifetimeKwhGenerated.toLocaleString()} kWh off-peak over its lifetime, avoiding approximately ${outputs.co2OffsetTonnes.toFixed(1)} tonnes of CO₂.`,
      severity: "neutral",
      category: "projection",
      value:    outputs.co2OffsetTonnes,
      unit:     "tonnes CO₂",
      confidence: 0.85,
    });

    return insights;
  };

// ─── VPP Revenue Insights ─────────────────────────────────────────────────────

export const generateVppRoiInsights: InsightGenerator<VppParticipationInputs, VppParticipationOutputs> =
  (inputs, outputs) => {
    const insights: Insight[] = [];
    const region = inputs.region ?? "National Average";
    const benchmark = getBenchmark(region);

    // VPP program availability
    if (!benchmark.vppProgramsActive) {
      insights.push({
        id:       "vpp-no-programs",
        title:    `VPP programs limited in ${region}`,
        body:     `Active VPP programs are not currently reported in ${region}. Check with your utility — new programs launch frequently under the Inflation Reduction Act.`,
        severity: "warning",
        category: "benchmark",
        value:    0,
        unit:     "",
        confidence: 0.7,
      });
    } else {
      insights.push({
        id:       "vpp-programs-available",
        title:    `${region} has active VPP programs`,
        body:     `You're in a strong VPP market. Enrolling could earn an additional $${outputs.annualVppRevenue.toFixed(0)}/year on top of arbitrage savings.`,
        severity: "positive",
        category: "benchmark",
        value:    outputs.annualVppRevenue,
        unit:     "$/yr",
        confidence: 0.85,
      });
    }

    // Total annual benefit
    insights.push({
      id:       "vpp-total-benefit",
      title:    "Total annual energy monetisation",
      body:     `VPP dispatch + grid arbitrage + capacity payments = $${outputs.totalAnnualBenefit.toFixed(0)}/year. That's $${(outputs.totalAnnualBenefit / 12).toFixed(0)}/month from your battery.`,
      severity: "positive",
      category: "roi",
      value:    outputs.totalAnnualBenefit,
      unit:     "$/yr",
      confidence: 0.85,
    });

    // 10-year outlook
    if (outputs.tenYearBenefit > 0) {
      insights.push({
        id:       "vpp-10yr-projection",
        title:    "10-year revenue projection",
        body:     `Your battery generates $${outputs.tenYearBenefit.toLocaleString()} in total benefits over 10 years, assuming ${(VED.electricityInflationRate * 100).toFixed(1)}% annual electricity price growth.`,
        severity: "neutral",
        category: "projection",
        value:    outputs.tenYearBenefit,
        unit:     "$",
        confidence: 0.75,
      });
    }

    // Payback
    const warrantyYears = inputs.battery.warrantyYears ?? 10;
    if (outputs.paybackPeriodYears <= warrantyYears) {
      insights.push({
        id:       "vpp-payback-within-warranty",
        title:    "Pays back within battery warranty",
        body:     `Payback at ${outputs.paybackPeriodYears} years is within the manufacturer warranty period — your earnings after that are pure profit.`,
        severity: "positive",
        category: "roi",
        value:    outputs.paybackPeriodYears,
        unit:     "years",
        confidence: 0.9,
      });
    }

    return insights;
  };
