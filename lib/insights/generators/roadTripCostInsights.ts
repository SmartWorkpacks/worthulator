// ─── WorthCore Insight Engine — Road Trip Cost Generator ──────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for the "road-trip-cost" calculator.
//   Surfaces the round-trip fuel cost, per-mile cost vs national average (live),
//   carpool savings, highway vs city efficiency, and a drive-vs-fly comparison.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Live gas price carries provenance caption with its vintage
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency, formatCurrencyPrecise } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";
import {
  NATIONAL_AVG_MPG,
  AVG_FLIGHT_COST_ROUND_TRIP,
} from "@/calculations/travel/roadTripCost";
import { usStateFuelDataset } from "@/lib/datasets/usStateFuelPrices";

// ── Rule thresholds ───────────────────────────────────────────────────────────
const HIGH_DISTANCE_ONE_WAY = 500;

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface RoadTripInputs {
  state:         string;
  distanceMiles: number;
  mpg:           number;
  highwayPct:    number;
  tolls:         number;
  passengers:    number;
  /** Optional user-entered $/gal; when > 0 it overrides the live state price. */
  gasPriceOverride?: number;
}

export interface RoadTripOutputs {
  effectiveMpg:      number;
  gallonsOneWay:     number;
  gallonsRoundTrip:  number;
  oneWayFuelCost:    number;
  roundTripFuelCost: number;
  totalTripCost:     number;
  costPerPerson:     number;
  costPerMile:       number;
  allHighwayCost:    number;
  allCityCost:       number;
  gasPrice:          number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateRoadTripCostInsights(
  inputs: RoadTripInputs,
  outputs: RoadTripOutputs,
): Insight[] {
  if (outputs.roundTripFuelCost <= 0) return [];

  const insights: Insight[] = [];
  const customPrice = (inputs.gasPriceOverride ?? 0) > 0;
  const stateLabel =
    inputs.state && inputs.state !== "National" ? inputs.state : "the US average";
  const gasLabel = customPrice ? "your gas price" : `${stateLabel} gas`;

  const liveCaption = customPrice
    ? {
        text:  `Your gas $${outputs.gasPrice.toFixed(2)}/gal`,
        asOf:  usStateFuelDataset.currentPeriodLabel,
        live:  false,
      }
    : {
        text:  `${stateLabel} gas $${outputs.gasPrice.toFixed(2)}/gal`,
        asOf:  usStateFuelDataset.currentPeriodLabel,
        live:  true,
      };

  // ── 1. Fuel cost headline ─────────────────────────────────────────────────
  insights.push({
    id:       "road-trip.fuel-cost",
    severity: outputs.roundTripFuelCost >= 150 ? "warning" : "neutral",
    category: "spending",
    title:    `This trip uses ${outputs.gallonsRoundTrip.toFixed(1)} gallons — ${formatCurrency(outputs.roundTripFuelCost)} in fuel round trip.`,
    body:     `${inputs.distanceMiles} miles each way at ${outputs.effectiveMpg.toFixed(1)} effective MPG (${inputs.highwayPct}% highway blend of your ${inputs.mpg} MPG rating) and ${formatCurrencyPrecise(outputs.gasPrice)}/gal ${customPrice ? "(your price)" : `in ${stateLabel}`}. One way costs ${formatCurrency(outputs.oneWayFuelCost)}, round trip ${formatCurrency(outputs.roundTripFuelCost)}${inputs.tolls > 0 ? ` — plus $${inputs.tolls} in tolls for ${formatCurrency(outputs.totalTripCost)} total` : ""}.`,
    metric:   { label: "Round-trip fuel", value: formatCurrency(outputs.roundTripFuelCost) },
  });

  // ── 2. Per-mile cost vs national average — benchmark-bar (live) ───────────
  const nationalPerMile =
    Math.round((usStateFuelDataset.national / NATIONAL_AVG_MPG) * 1000) / 1000;
  if (outputs.costPerMile > 0 && nationalPerMile > 0) {
    const cheaper = outputs.costPerMile < nationalPerMile;
    insights.push({
      id:       "road-trip.per-mile",
      severity: cheaper ? "positive" : "neutral",
      category: "comparison",
      title:    cheaper
        ? `Your fuel cost per mile is below the national average.`
        : `Each mile of this trip costs ${formatCurrencyPrecise(outputs.costPerMile)} in fuel.`,
      body:     `At ${gasLabel} and ${outputs.effectiveMpg.toFixed(1)} effective MPG, your fuel cost is ${formatCurrencyPrecise(outputs.costPerMile)}/mile versus ${formatCurrencyPrecise(nationalPerMile)}/mile for the average US driver (${usStateFuelDataset.national.toFixed(2)}/gal ÷ ${NATIONAL_AVG_MPG} MPG). Over a ${(inputs.distanceMiles * 2).toLocaleString()}-mile round trip, that difference adds up.`,
      visualization: {
        type:           "benchmark-bar",
        userValue:      outputs.costPerMile,
        userLabel:      "You / mile",
        benchmarkValue: nationalPerMile,
        benchmarkLabel: "US avg / mile",
        format:         "currency",
        caption:        liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── 3. Carpool saving — delta-card ────────────────────────────────────────
  if (inputs.passengers > 1) {
    const soloCost = outputs.totalTripCost;
    insights.push({
      id:       "road-trip.carpool-saving",
      severity: "positive",
      category: "savings",
      title:    `Splitting ${inputs.passengers} ways saves each person ${formatCurrency(soloCost - outputs.costPerPerson)}.`,
      body:     `Solo, the trip costs ${formatCurrency(soloCost)} total. With ${inputs.passengers} passengers each person pays ${formatCurrency(outputs.costPerPerson)} — that's ${Math.round(((soloCost - outputs.costPerPerson) / soloCost) * 100)}% less than driving alone.`,
      visualization: {
        type:   "delta-card",
        before: { label: "Solo cost",   value: formatCurrency(soloCost) },
        after:  { label: `${inputs.passengers}-way split`, value: formatCurrency(outputs.costPerPerson) },
        delta:  { label: "Saved / person", value: formatCurrency(soloCost - outputs.costPerPerson), positive: true },
      } satisfies InsightVisualization,
    });
  } else {
    const with4 = Math.round(outputs.totalTripCost / 4 * 100) / 100;
    const saving = Math.round((outputs.totalTripCost - with4) * 100) / 100;
    insights.push({
      id:       "road-trip.carpool-upside",
      severity: "positive",
      category: "savings",
      title:    `With 4 passengers, each person pays just ${formatCurrency(with4)}.`,
      body:     `You're covering ${formatCurrency(outputs.totalTripCost)} alone. Adding 3 passengers drops each share to ${formatCurrency(with4)} — saving you ${formatCurrency(saving)} and splitting fuel fairly.`,
      visualization: {
        type:   "delta-card",
        before: { label: "Solo", value: formatCurrency(outputs.totalTripCost) },
        after:  { label: "4-way split", value: formatCurrency(with4) },
        delta:  { label: "You save", value: formatCurrency(saving), positive: true },
      } satisfies InsightVisualization,
    });
  }

  // ── 4. Highway vs city efficiency — delta-card ────────────────────────────
  if (outputs.allHighwayCost > 0 && outputs.allCityCost > 0) {
    const citySurcharge = Math.round(outputs.allCityCost - outputs.allHighwayCost);
    if (citySurcharge > 2) {
      insights.push({
        id:       "road-trip.highway-vs-city",
        severity: "neutral",
        category: "comparison",
        title:    `All-highway saves ${formatCurrency(citySurcharge)} vs all-city driving.`,
        body:     `At 100% highway your ${inputs.mpg} MPG car runs at ~${Math.round(inputs.mpg * 1.10)} effective MPG, costing ${formatCurrency(outputs.allHighwayCost)} round trip. In city traffic it drops to ~${Math.round(inputs.mpg * 0.85)} MPG, costing ${formatCurrency(outputs.allCityCost)}. Your ${inputs.highwayPct}% highway mix lands at ${formatCurrency(outputs.roundTripFuelCost)}.`,
        visualization: {
          type:   "delta-card",
          before: { label: "All city",    value: formatCurrency(outputs.allCityCost) },
          after:  { label: "All highway", value: formatCurrency(outputs.allHighwayCost) },
          delta:  { label: "Saved", value: formatCurrency(citySurcharge), positive: true },
        } satisfies InsightVisualization,
      });
    }
  }

  // ── 5. Drive vs fly (rough comparison) ────────────────────────────────────
  if (inputs.distanceMiles >= 150) {
    const flightPerPerson = AVG_FLIGHT_COST_ROUND_TRIP;
    const flightTotal = flightPerPerson * Math.max(1, inputs.passengers);
    const driveWins = outputs.totalTripCost < flightTotal;
    const breakEvenPax = Math.ceil(flightPerPerson / (outputs.totalTripCost > 0 ? outputs.totalTripCost : 1));
    insights.push({
      id:       "road-trip.vs-flight",
      severity: driveWins ? "positive" : "neutral",
      category: "comparison",
      title:    driveWins
        ? `Driving beats flying for this trip by ${formatCurrency(flightTotal - outputs.totalTripCost)}.`
        : `Flying may be cheaper — ${formatCurrency(flightTotal)} for ${inputs.passengers} ticket(s) vs ${formatCurrency(outputs.totalTripCost)} to drive.`,
      body:     driveWins
        ? `At ~$${flightPerPerson} per round-trip flight (BTS average), ${inputs.passengers} ticket(s) would cost ${formatCurrency(flightTotal)} vs ${formatCurrency(outputs.totalTripCost)} driving. Driving saves ${formatCurrency(flightTotal - outputs.totalTripCost)} — plus you have your car at the destination.`
        : `With ${inputs.passengers} ${inputs.passengers === 1 ? "person" : "people"}, driving costs ${formatCurrency(outputs.totalTripCost)} vs ~${formatCurrency(flightTotal)} flying. Driving becomes cheaper than flying at ${breakEvenPax}+ passengers.`,
      visualization: {
        type:           "benchmark-bar",
        userValue:      outputs.totalTripCost,
        userLabel:      `Drive (${inputs.passengers})`,
        benchmarkValue: flightTotal,
        benchmarkLabel: `Fly (${inputs.passengers})`,
        format:         "currency",
      } satisfies InsightVisualization,
    });
  }

  // ── 6. Long-distance fatigue/hotel reminder (conditional) ─────────────────
  if (inputs.distanceMiles >= HIGH_DISTANCE_ONE_WAY) {
    const hotelNights = Math.max(1, Math.floor(inputs.distanceMiles / 500));
    const hotelEstimate = hotelNights * 120;
    insights.push({
      id:       "road-trip.long-distance",
      severity: "warning",
      category: "hidden-cost",
      title:    `${inputs.distanceMiles} miles one-way — budget for ${hotelNights} overnight stop${hotelNights > 1 ? "s" : ""}.`,
      body:     `At ~500 miles/day before fatigue sets in, a ${inputs.distanceMiles}-mile one-way drive likely needs ${hotelNights} hotel night${hotelNights > 1 ? "s" : ""} (~$${hotelEstimate} at $120/night). That pushes the true trip cost to roughly ${formatCurrency(outputs.totalTripCost + hotelEstimate)} — worth factoring in when comparing against a flight.`,
      metric:   { label: "Est. hotel cost", value: formatCurrency(hotelEstimate) },
    });
  }

  return insights;
}
