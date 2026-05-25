// ─── VPPExchange Energy Engine — ROI Engine ───────────────────────────────────
//
// PURPOSE:
//   Pure financial calculation functions for all VPPExchange energy calculators.
//   No React. No async. No side-effects. SSR-safe.
//
// USAGE:
//   import { calcSolarRoi, calcBatteryRoi, calcVppAnnualRevenue } from "./roiEngine";
//
// ─────────────────────────────────────────────────────────────────────────────

import {
  SolarRoiInputs, SolarRoiOutputs,
  BatteryRoiInputs, BatteryRoiOutputs,
  VppParticipationInputs, VppParticipationOutputs,
} from "./types";
import { VED } from "./assumptions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Compound growth of a value over n years */
function compoundGrow(initial: number, rate: number, years: number): number {
  return initial * Math.pow(1 + rate, years);
}

/** Sum of geometric series: initial × (1 + rate)^0 + ... + (1 + rate)^(years-1) */
function geometricSum(initial: number, rate: number, years: number): number {
  if (Math.abs(rate) < 1e-9) return initial * years;
  return initial * (Math.pow(1 + rate, years) - 1) / rate;
}

/** Net Present Value of uniform annual cashflows */
function npvUniform(annualCashflow: number, discountRate: number, years: number): number {
  if (Math.abs(discountRate) < 1e-9) return annualCashflow * years;
  return annualCashflow * (1 - Math.pow(1 + discountRate, -years)) / discountRate;
}

/** Payback period in years given upfront cost and growing annual benefit */
function paybackYears(
  upfrontCost: number,
  year1Benefit: number,
  growthRate = 0,
): number {
  if (year1Benefit <= 0) return Infinity;
  if (Math.abs(growthRate) < 1e-9) return upfrontCost / year1Benefit;
  // Solve: upfrontCost = benefit × ((1+g)^n - 1) / g
  // n = log(1 + upfrontCost × g / benefit) / log(1+g)
  const n = Math.log(1 + (upfrontCost * growthRate) / year1Benefit) / Math.log(1 + growthRate);
  return n;
}

// ─── Solar ROI ────────────────────────────────────────────────────────────────

/**
 * Calculate 25-year solar ROI.
 * Accounts for: production degradation, electricity price inflation, net metering.
 */
export function calcSolarRoi(inputs: SolarRoiInputs): SolarRoiOutputs {
  const { system, utilityRate, peakSunHours, monthlyBaselineKwh } = inputs;
  const inflationRate = VED.electricityInflationRate;
  const exportRate    = utilityRate.netMeteringRate ?? utilityRate.flatRate ?? VED.utilityRatePerKwh;
  const importRate    = utilityRate.flatRate ?? VED.utilityRatePerKwh;
  const taxCredit     = system.taxCreditRate ?? VED.federalTaxCreditRate;
  const degradation   = system.annualDegradation ?? VED.solarDegradationRate;

  // Year-1 production
  const year1ProductionKwh = system.systemSizeKw * peakSunHours * 365
    * system.moduleEfficiency * system.performanceRatio;

  // Self-consumption vs export
  const annualBaselineKwh  = monthlyBaselineKwh * 12;
  const selfConsumedKwh    = Math.min(year1ProductionKwh, annualBaselineKwh);
  const exportedKwh        = Math.max(0, year1ProductionKwh - annualBaselineKwh);

  // Year-1 savings (import rate × self-consumed + export rate × exported)
  const year1Savings = selfConsumedKwh * importRate + exportedKwh * exportRate;

  // Effective cost after federal tax credit
  const effectiveCost = system.installedCost * (1 - taxCredit);

  // 25-year cumulative value (compound growth model)
  let cumulativeSavings = 0;
  let breakEvenYear     = Infinity;
  let runningCost       = effectiveCost;

  for (let yr = 1; yr <= 25; yr++) {
    const degraded    = year1Savings * Math.pow(1 - degradation, yr - 1);
    const inflated    = degraded * Math.pow(1 + inflationRate, yr - 1);
    cumulativeSavings += inflated;
    if (cumulativeSavings >= effectiveCost && breakEvenYear === Infinity) {
      breakEvenYear = yr;
    }
  }

  const co2PerYear = year1ProductionKwh * VED.gridCarbonIntensityKgPerKwh / 1000; // tonnes

  return {
    annualProductionKwh:      Math.round(year1ProductionKwh),
    annualSavings:            parseFloat(year1Savings.toFixed(2)),
    paybackPeriodYears:       parseFloat(paybackYears(effectiveCost, year1Savings, inflationRate).toFixed(1)),
    twentyFiveYearNetValue:   parseFloat((cumulativeSavings - effectiveCost).toFixed(2)),
    breakEvenYear:            breakEvenYear === Infinity ? 25 : breakEvenYear,
    co2OffsetTonnesPerYear:   parseFloat(co2PerYear.toFixed(2)),
    effectiveCostAfterCredit: parseFloat(effectiveCost.toFixed(2)),
  };
}

// ─── Battery ROI ──────────────────────────────────────────────────────────────

/**
 * Calculate battery storage ROI.
 * Models daily arbitrage savings (off-peak charge / on-peak discharge).
 */
export function calcBatteryRoi(inputs: BatteryRoiInputs): BatteryRoiOutputs {
  const { system, utilityRate, dailyLoadKwh, dailyDischargeHours } = inputs;
  const inflationRate  = VED.electricityInflationRate;
  const importRate     = utilityRate.flatRate ?? VED.utilityRatePerKwh;
  const peakMultiplier = (utilityRate.touTiers?.length ?? 0) > 0 ? VED.peakRateMultiplier : 1.0;
  const degradation    = system.annualDegradation ?? VED.batteryDegradationRate;

  // Usable kWh per cycle
  const usableKwh = Math.min(
    system.capacityKwh * system.efficiency,
    dailyLoadKwh * dailyDischargeHours,
  );

  // Arbitrage benefit: save peak rate, pay off-peak rate
  const offPeakRate   = importRate / peakMultiplier;
  const dailyArbitrage = usableKwh * (importRate - offPeakRate);
  const year1Savings  = dailyArbitrage * 365;

  const effectiveCost = system.installedCost ?? VED.batteryInstalledCost10Kwh;

  // 20-year NPV
  let cumulative10yr = 0;
  let cumulative20yr = 0;
  let lifetimeKwh    = 0;

  for (let yr = 1; yr <= 20; yr++) {
    const degraded  = year1Savings * Math.pow(1 - degradation, yr - 1);
    const inflated  = degraded * Math.pow(1 + inflationRate, yr - 1);
    if (yr <= 10) cumulative10yr += inflated;
    cumulative20yr += inflated;
    lifetimeKwh    += usableKwh * 365 * Math.pow(1 - degradation, yr - 1);
  }

  const co2Offset = lifetimeKwh * VED.gridCarbonIntensityKgPerKwh / 1000; // tonnes

  return {
    annualSavingsEstimate: parseFloat(year1Savings.toFixed(2)),
    paybackPeriodYears:    parseFloat(paybackYears(effectiveCost, year1Savings, inflationRate).toFixed(1)),
    tenYearNetValue:       parseFloat((cumulative10yr - effectiveCost).toFixed(2)),
    twentyYearNetValue:    parseFloat((cumulative20yr - effectiveCost).toFixed(2)),
    lifetimeKwhGenerated:  Math.round(lifetimeKwh),
    co2OffsetTonnes:       parseFloat(co2Offset.toFixed(2)),
  };
}

// ─── VPP Revenue ─────────────────────────────────────────────────────────────

/**
 * Calculate annual + multi-year VPP program revenue.
 * Combines dispatch event payments + grid arbitrage + capacity enrollment.
 */
export function calcVppAnnualRevenue(inputs: VppParticipationInputs): VppParticipationOutputs {
  const { battery, program, utilityRate } = inputs;
  const inflationRate  = VED.electricityInflationRate;
  const degradation    = battery.annualDegradation ?? VED.batteryDegradationRate;

  // kWh dispatched per event (limited by battery rating)
  const kwhPerEvent = Math.min(
    program.maxExportPerEventKwh,
    battery.powerKw * program.eventDurationHours * battery.efficiency,
  );

  // Dispatch revenue
  const dispatchRevenue = kwhPerEvent * program.dispatchRatePerKwh * program.dispatchEventsPerYear;

  // Grid arbitrage (charge off-peak, discharge into home at peak)
  const importRate     = utilityRate.flatRate ?? VED.utilityRatePerKwh;
  const peakMultiplier = VED.peakRateMultiplier;
  const offPeakRate    = importRate / peakMultiplier;
  const dailyCycleKwh  = Math.min(battery.capacityKwh * battery.efficiency, battery.powerKw * 4);
  const arbitrageRevenue = dailyCycleKwh * (importRate - offPeakRate) * 365;

  // Capacity payment
  const capacityPayment = program.annualCapacityPayment ?? VED.vppAnnualCapacityPayment;

  const year1Total = dispatchRevenue + arbitrageRevenue + capacityPayment;

  // Multi-year (degrading battery)
  let fiveYearBenefit = 0;
  let tenYearBenefit  = 0;
  for (let yr = 1; yr <= 10; yr++) {
    const degraded  = year1Total * Math.pow(1 - degradation, yr - 1);
    const inflated  = degraded * Math.pow(1 + inflationRate, yr - 1);
    if (yr <= 5) fiveYearBenefit += inflated;
    tenYearBenefit += inflated;
  }

  const installedCost = battery.installedCost ?? VED.batteryInstalledCost10Kwh;

  return {
    annualVppRevenue:           parseFloat(dispatchRevenue.toFixed(2)),
    annualGridArbitrageSavings: parseFloat(arbitrageRevenue.toFixed(2)),
    totalAnnualBenefit:         parseFloat(year1Total.toFixed(2)),
    fiveYearBenefit:            parseFloat(fiveYearBenefit.toFixed(2)),
    tenYearBenefit:             parseFloat(tenYearBenefit.toFixed(2)),
    paybackPeriodYears:         parseFloat(paybackYears(installedCost, year1Total, inflationRate).toFixed(1)),
    revenuePerKwh:              parseFloat((dispatchRevenue / (kwhPerEvent * program.dispatchEventsPerYear || 1)).toFixed(4)),
  };
}

// ─── NPV helper (exported for charts) ────────────────────────────────────────

/**
 * Generate year-by-year cashflow table for charting.
 * Returns array of { year, cumulative, annual, npv } objects.
 */
export function buildCashflowTable(
  installedCost:    number,
  year1Benefit:     number,
  benefitGrowthRate = VED.electricityInflationRate,
  degradationRate   = VED.solarDegradationRate,
  discountRate      = VED.discountRate,
  years             = 25,
): { year: number; annual: number; cumulative: number; npvCumulative: number }[] {
  const rows: { year: number; annual: number; cumulative: number; npvCumulative: number }[] = [];
  let cumulative    = -installedCost;
  let npvCumulative = -installedCost;

  for (let yr = 1; yr <= years; yr++) {
    const degraded = year1Benefit * Math.pow(1 - degradationRate, yr - 1);
    const inflated = degraded    * Math.pow(1 + benefitGrowthRate, yr - 1);
    const discounted = inflated / Math.pow(1 + discountRate, yr);
    cumulative    += inflated;
    npvCumulative += discounted;
    rows.push({ year: yr, annual: parseFloat(inflated.toFixed(2)), cumulative: parseFloat(cumulative.toFixed(2)), npvCumulative: parseFloat(npvCumulative.toFixed(2)) });
  }
  return rows;
}
