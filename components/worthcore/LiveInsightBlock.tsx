"use client";

// ─── LiveInsightBlock ─────────────────────────────────────────────────────────
//
// PURPOSE:
//   Adapter between the engine's generic CalculatorValues/CalculatorOutputs
//   and the typed WorthCore insight generators. Renders live insight cards
//   from actual calculator state via the Phase 6B render-prop pattern.
//
// SYNCHRONIZATION PATTERN (Phase 6B):
//   CalculatorEngineInner renders:
//     afterResults={(outputs, values) => (
//       <LiveInsightBlock slug="commute-cost" outputs={outputs} values={values} />
//     )}
//
//   On every input change:
//     setValues → useMemo(outputs) → re-render → afterResults(outputs, values)
//     → generateXxxInsights(typed inputs, typed outputs) → InsightCard[]
//
//   This is a pure synchronous render-path call. No useEffect, no setState,
//   no async, no external store. Insights update live with zero architectural
//   coupling to WorthCore from the engine's perspective.
//
// ADDING NEW GENERATORS:
//   1. Write the generator in lib/insights/generators/<name>.ts
//   2. Add a casting adapter function below
//   3. Register the slug in GENERATOR_REGISTRY
//   Done — the engine needs no changes.
//
// SAFETY:
//   ✅ Synchronous — generators are pure O(1) functions
//   ✅ No render loops — no setState called
//   ✅ No stale closures — fresh outputs/values on every call
//   ✅ No hydration risk — engine is ssr:false, this is client-only
//   ✅ Backward compatible — existing afterResults?: React.ReactNode unchanged
//
// ─────────────────────────────────────────────────────────────────────────────

import InsightCard from "@/components/worthcore/InsightCard";
import {
  generateCommuteInsights,
  generateRoadTripCostInsights,
  generateLaundryCostInsights,
  generateGroceryUnitPriceInsights,
  generateTipInsights,
  generateSmokingInsights,
  generateLatteInsights,
  generateCarLoanInsights,
  generateEvVsGasInsights,
  generateHouseAffordabilityInsights,
  generateCreditCardPayoffInsights,
  generateCoastFireInsights,
  generateTimeToRetirementInsights,
  generateSavingsGoalInsights,
  generateDripInsights,
  generateSalaryToHourlyInsights,
  generatePtoInsights,
  generateTrueHourlyInsights,
  generateCreditCardInterestInsights,
  generateStudentLoanInsights,
  generateMortgageRefinanceInsights,
  generatePayRaiseInsights,
  generateBurnoutInsights,
  generateSalaryNegotiationInsights,
  generateInflationImpactInsights,
  generateFutureValueInsights,
  generateSavingsGrowthInsights,
  generateRetirement401kInsights,
  generateHomeEquityInsights,
  generateClosingCostInsights,
  generateDownPaymentInsights,
  generateSolarRoiInsights,
  generateApplianceEnergyInsights,
  generateEvChargingInsights,
  generateHeatingCostInsights,
  generateWaterBillInsights,
  fireInsights,
  millionaireInsights,
  missedInvestmentInsights,
  lotteryVsInvestingInsights,
  airbnbProfitInsights,
  selfEmployedTaxInsights,
  jobOfferComparisonInsights,
  sideHustleInsights,
  screenTimeInsights,
  streamingTimeInsights,
  phoneAddictionInsights,
  generateAlcoholCostInsights,
  generateVapingCostInsights,
  gamblingLossInsights,
  socialMediaTimeInsights,
  biologicalAgeInsights,
  lifeInWeeksInsights,
  lifeExpectancyInsights,
  procrastinationCostInsights,
  meetingCostInsights,
  cryptoLossInsights,
  budgetInsights,
  subscriptionAuditorInsights,
  wfhSavingsInsights,
  petCostInsights,
  weddingCostInsights,
  mealPrepInsights,
  generateSalesTaxInsights,
  profitMarginInsights,
  markupInsights,
  carAffordabilityInsights,
  childSupportInsights,
  commuteTimeValueInsights,
  generateGpaInsights,
  generateWorkHoursInsights,
  generateWorkingDaysInsights,
  generateTimeBetweenInsights,
  generatePomodoroInsights,
  generateProteinInsights,
  generateExpenseSplitInsights,
  generateTileInsights,
  generateFlooringInsights,
  generateMovingInsights,
  generateTaxBracketInsights,
  generatePayrollInsights,
  generateGlobalWealthPercentileInsights,
} from "@/lib/insights";
import type { Insight, InsightContext } from "@/lib/insights/types";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

// ─── Safe numeric coercion ────────────────────────────────────────────────────
// Converts any Record value to a number, falling back to a provided default.
// Handles: undefined, empty string, NaN, non-positive values for counts.

function n(v: number | string | undefined, fallback: number): number {
  const num = Number(v);
  return isFinite(num) ? num : fallback;
}

// ─── Per-calculator generator registry ───────────────────────────────────────

type GeneratorFn = (
  values:  CalculatorValues,
  outputs: CalculatorOutputs,
  context?: InsightContext,
) => Insight[];

const GENERATOR_REGISTRY: Partial<Record<string, GeneratorFn>> = {
  // ── commute-cost ──────────────────────────────────────────────────────────
  "commute-cost": (values, outputs) =>
    generateCommuteInsights(
      {
        state:             String(values.state ?? "National"),
        milesOneWay:       n(values.milesOneWay,       15),
        mpg:               n(values.mpg,               28),
        officeDaysPerWeek: n(values.officeDaysPerWeek,  5),
        weeksPerYear:      n(values.weeksPerYear,      49),
        gasPriceOverride:  n(values.gasPriceOverride,   0),
      },
      {
        annualFuelCost:          outputs.annualFuelCost          ?? 0,
        monthlyCost:             outputs.monthlyCost             ?? 0,
        costPerDay:              outputs.costPerDay              ?? 0,
        annualMiles:             outputs.annualMiles             ?? 0,
        fuelCostPerMile:         outputs.fuelCostPerMile         ?? 0,
        wearCostPerYear:         outputs.wearCostPerYear         ?? 0,
        totalCostPerYear:        outputs.totalCostPerYear        ?? 0,
        effectiveDaysPerYear:    outputs.effectiveDaysPerYear    ?? 0,
        fiveDay52AnnualFuelCost: outputs.fiveDay52AnnualFuelCost ?? 0,
        wfhSavingVs5Days:        outputs.wfhSavingVs5Days        ?? 0,
        tenYearInflatedCost:     outputs.tenYearInflatedCost     ?? 0,
        gasPrice:                outputs.gasPrice                ?? 0,
      },
    ),

  // ── road-trip-cost ────────────────────────────────────────────────────────
  "road-trip-cost": (values, outputs) =>
    generateRoadTripCostInsights(
      {
        state:         String(values.state ?? "National"),
        distanceMiles: n(values.distanceMiles, 300),
        mpg:           n(values.mpg,           28),
        highwayPct:    n(values.highwayPct,    85),
        tolls:         n(values.tolls,          0),
        passengers:    n(values.passengers,     1),
        gasPriceOverride: n(values.gasPriceOverride, 0),
      },
      {
        effectiveMpg:      outputs.effectiveMpg      ?? 0,
        gallonsOneWay:     outputs.gallonsOneWay      ?? 0,
        gallonsRoundTrip:  outputs.gallonsRoundTrip   ?? 0,
        oneWayFuelCost:    outputs.oneWayFuelCost     ?? 0,
        roundTripFuelCost: outputs.roundTripFuelCost  ?? 0,
        totalTripCost:     outputs.totalTripCost      ?? 0,
        costPerPerson:     outputs.costPerPerson      ?? 0,
        costPerMile:       outputs.costPerMile        ?? 0,
        allHighwayCost:    outputs.allHighwayCost     ?? 0,
        allCityCost:       outputs.allCityCost        ?? 0,
        gasPrice:          outputs.gasPrice           ?? 0,
      },
    ),

  // ── laundry-cost-calculator ─────────────────────────────────────────────
  "laundry-cost-calculator": (values, outputs) =>
    generateLaundryCostInsights(
      {
        state:         String(values.state ?? "National"),
        loadsPerWeek:  n(values.loadsPerWeek,  5),
        machineType:   String(values.machineType ?? "standard"),
        waterTemp:     String(values.waterTemp ?? "warm"),
        detergentCost: n(values.detergentCost, 0.25),
        electricRateOverride: n(values.electricRateOverride, 0),
      },
      {
        costPerLoad:            outputs.costPerLoad            ?? 0,
        weeklyCost:             outputs.weeklyCost             ?? 0,
        annualCost:             outputs.annualCost             ?? 0,
        electricityCostPerLoad: outputs.electricityCostPerLoad ?? 0,
        electricityPct:         outputs.electricityPct         ?? 0,
        waterCostPerLoad:       outputs.waterCostPerLoad       ?? 0,
        detergentCostPerLoad:   outputs.detergentCostPerLoad   ?? 0,
        annualKwh:              outputs.annualKwh              ?? 0,
        totalKwhPerLoad:        outputs.totalKwhPerLoad        ?? 0,
        washerKwhAdj:           outputs.washerKwhAdj           ?? 0,
        dryerKwh:               outputs.dryerKwh               ?? 0,
        electricRate:           outputs.electricRate            ?? 0,
        heFrontColdAnnual:      outputs.heFrontColdAnnual      ?? 0,
        laundromatAnnual:       outputs.laundromatAnnual       ?? 0,
      },
    ),

  // ── grocery-unit-price ──────────────────────────────────────────────────
  "grocery-unit-price": (values, outputs) =>
    generateGroceryUnitPriceInsights(
      {
        item1Price:       n(values.item1Price,       3.50),
        item1Size:        n(values.item1Size,        16),
        item2Price:       n(values.item2Price,       8.00),
        item2Size:        n(values.item2Size,        48),
        purchasesPerYear: n(values.purchasesPerYear, 24),
      },
      {
        unitPriceA:      outputs.unitPriceA      ?? 0,
        unitPriceB:      outputs.unitPriceB      ?? 0,
        savingsPct:      outputs.savingsPct       ?? 0,
        savingsPerUnit:  outputs.savingsPerUnit   ?? 0,
        winner:          outputs.winner            ?? 0,
        annualSavings:   outputs.annualSavings    ?? 0,
        annualCostA:     outputs.annualCostA      ?? 0,
        annualCostB:     outputs.annualCostB      ?? 0,
        tenStapleSaving: outputs.tenStapleSaving  ?? 0,
      },
    ),

  // ── tip-calculator ──────────────────────────────────────────────────────
  "tip-calculator": (values, outputs) =>
    generateTipInsights(
      {
        bill:             n(values.bill,            60),
        tipPct:           n(values.tipPct,           20),
        people:           n(values.people,           2),
        diningFrequency:  n(values.diningFrequency,  8),
      },
      {
        tipAmount:       outputs.tipAmount       ?? 0,
        totalBill:       outputs.totalBill       ?? 0,
        tipPerPerson:    outputs.tipPerPerson     ?? 0,
        totalPerPerson:  outputs.totalPerPerson   ?? 0,
        roundedTotal:    outputs.roundedTotal     ?? 0,
        roundUpCost:     outputs.roundUpCost      ?? 0,
        annualTipSpend:  outputs.annualTipSpend   ?? 0,
        annualDining:    outputs.annualDining     ?? 0,
        tip15:           outputs.tip15            ?? 0,
        tip20:           outputs.tip20            ?? 0,
        tip25:           outputs.tip25            ?? 0,
      },
    ),

  // ── quit-smoking ──────────────────────────────────────────────────────────
  "quit-smoking": (values, outputs) =>
    generateSmokingInsights(
      {
        state:         String(values.state ?? "National"),
        packsPerDay:   n(values.packsPerDay,   1),
        packCost:      n(values.packCost,      10),
        daysSinceQuit: n(values.daysSinceQuit, 365),
      },
      {
        moneySaved:           outputs.moneySaved           ?? 0,
        cigarettesAvoided:    outputs.cigarettesAvoided    ?? 0,
        daysOfLifeRegained:   outputs.daysOfLifeRegained   ?? 0,
        annualSaving:         outputs.annualSaving          ?? 0,
        investedValue10yr:    outputs.investedValue10yr     ?? 0,
        investedValue20yr:    outputs.investedValue20yr     ?? 0,
        totalContributed10yr: outputs.totalContributed10yr  ?? 0,
        compoundGrowth10yr:   outputs.compoundGrowth10yr    ?? 0,
        stateAvgPackPrice:    outputs.stateAvgPackPrice     ?? 0,
        vsStateAvgPct:        outputs.vsStateAvgPct         ?? 0,
      },
    ),

  // ── latte-factor ──────────────────────────────────────────────────────────
  "latte-factor": (values, outputs) =>
    generateLatteInsights(
      {
        dailySpend:   n(values.dailySpend,   6),
        daysPerWeek:  n(values.daysPerWeek,  5),
        costGrowth:   n(values.costGrowth,   3),
        annualReturn: n(values.annualReturn, 7),
        years:        n(values.years,        30),
      },
      {
        investedValue:     outputs.investedValue     ?? 0,
        totalSpent:        outputs.totalSpent         ?? 0,
        compoundGrowth:    outputs.compoundGrowth     ?? 0,
        growthPct:         outputs.growthPct           ?? 0,
        annualSpendNow:    outputs.annualSpendNow     ?? 0,
        annualSpendFinal:  outputs.annualSpendFinal   ?? 0,
        halfHabitInvested: outputs.halfHabitInvested  ?? 0,
      },
    ),

  // ── car-loan-calculator ───────────────────────────────────────────────────
  "car-loan-calculator": (values, outputs) =>
    generateCarLoanInsights(
      {
        vehiclePrice:  n(values.vehiclePrice,  28000),
        downPayment:   n(values.downPayment,   3000),
        tradeIn:       n(values.tradeIn,       0),
        interestRate:  n(values.interestRate,  7.9),
        termMonths:    n(values.termMonths,    60),
        state:         String(values.state ?? "US Average"),
        salesTaxOverride: n(values.salesTaxOverride, 0),
      },
      {
        monthlyPayment:      outputs.monthlyPayment      ?? 0,
        totalInterest:       outputs.totalInterest       ?? 0,
        totalCost:           outputs.totalCost           ?? 0,
        interestPct:         outputs.interestPct         ?? 0,
        loanAmount:          outputs.loanAmount          ?? 0,
        salesTax:            outputs.salesTax            ?? 0,
        outTheDoorPrice:     outputs.outTheDoorPrice     ?? 0,
        downPaymentRatio:    outputs.downPaymentRatio    ?? 0,
        annualPaymentBurden: outputs.annualPaymentBurden ?? 0,
        taxFinancedInterest: outputs.taxFinancedInterest ?? 0,
        resolvedRate:        outputs.resolvedRate        as number | undefined,
      },
    ),

  // ── ev-vs-gas ─────────────────────────────────────────────────────────────
  "ev-vs-gas": (values, outputs) =>
    generateEvVsGasInsights(
      {
        state:             String(values.state ?? "National"),
        milesPerYear:      n(values.milesPerYear,      12000),
        mpg:               n(values.mpg,               28),
        kwhPer100mi:       n(values.kwhPer100mi,        30),
        publicChargingPct: n(values.publicChargingPct,  10),
        gasPriceOverride:     n(values.gasPriceOverride,     0),
        electricRateOverride: n(values.electricRateOverride, 0),
      },
      {
        annualSavings:    outputs.annualSavings    ?? 0,
        annualGasCost:    outputs.annualGasCost    ?? 0,
        annualEvCost:     outputs.annualEvCost     ?? 0,
        gasCostPerMile:   outputs.gasCostPerMile   ?? 0,
        evCostPerMile:    outputs.evCostPerMile    ?? 0,
        effectiveKwhRate: outputs.effectiveKwhRate ?? 0,
        gasPrice:         outputs.gasPrice         ?? 0,
        homeElectricRate: outputs.homeElectricRate ?? 0,
        tenYearSavings:           outputs.tenYearSavings           as number | undefined,
        breakEvenYears:           outputs.breakEvenYears           as number | undefined,
        fuelInflationSavings10yr: outputs.fuelInflationSavings10yr as number | undefined,
        maintenanceSavings10yr:   outputs.maintenanceSavings10yr   as number | undefined,
        totalAdvantage10yr:       outputs.totalAdvantage10yr       as number | undefined,
      },
    ),

  // ── house-affordability-calculator ───────────────────────────────────────
  "house-affordability-calculator": (values, outputs) =>
    generateHouseAffordabilityInsights(
      {
        income:      n(values.income,      7000),
        downPayment: n(values.downPayment, 60000),
        rate:        n(values.rate,        6.7),
        term:        n(values.term,        360),
      },
      {
        maxHomePrice:          outputs.maxHomePrice          ?? 0,
        monthlyBudget:         outputs.monthlyBudget         ?? 0,
        loanAmount:            outputs.loanAmount            as number | undefined,
        totalInterestEstimate: outputs.totalInterestEstimate as number | undefined,
        totalCostEstimate:     outputs.totalCostEstimate     as number | undefined,
        affordabilityRatio:    outputs.affordabilityRatio    as number | undefined,
        downPaymentRatio:      outputs.downPaymentRatio      as number | undefined,
        annualMortgageBurden:  outputs.annualMortgageBurden  as number | undefined,
      },
    ),

  // ── credit-card-payoff-calculator ────────────────────────────────────────
  "credit-card-payoff-calculator": (values, outputs) =>
    generateCreditCardPayoffInsights(
      {
        balance: n(values.balance, 5000),
        apr:     n(values.apr,     22),
        payment: n(values.payment, 200),
      },
      {
        months:                 outputs.months    ?? 0,
        interest:               outputs.interest  ?? 0,
        totalPaid:              outputs.totalPaid ?? 0,
        dailyInterestCost:      outputs.dailyInterestCost      as number | undefined,
        monthlyInterestFirst:   outputs.monthlyInterestFirst   as number | undefined,
        interestToBalanceRatio: outputs.interestToBalanceRatio as number | undefined,
        payoffYears:            outputs.payoffYears            as number | undefined,
      },
    ),

  // ── coast-fire-calculator ────────────────────────────────────────────────
  "coast-fire-calculator": (values, outputs) =>
    generateCoastFireInsights(
      {
        current: n(values.current, 100000),
        target:  n(values.target,  1500000),
        rate:    n(values.rate,    7),
        years:   n(values.years,   25),
      },
      {
        coastValue:    outputs.coastValue    ?? 0,
        requiredNow:   outputs.requiredNow   ?? 0,
        coastShortfall: outputs.coastShortfall as number | undefined,
        coastSurplus:   outputs.coastSurplus   as number | undefined,
        coastRatio:     outputs.coastRatio     as number | undefined,
        requiredNowNominal: outputs.requiredNowNominal as number | undefined,
        inflationPenalty:   outputs.inflationPenalty   as number | undefined,
        realRatePct:        outputs.realRatePct         as number | undefined,
      },
    ),

  // ── time-to-retirement-calculator ───────────────────────────────────────
  "time-to-retirement-calculator": (values, outputs) =>
    generateTimeToRetirementInsights(
      {
        expenses:       n(values.expenses,       4000),
        current:        n(values.current,        50000),
        monthlySavings: n(values.monthlySavings, 1000),
        returnRate:     n(values.returnRate,     7),
      },
      {
        yearsToRetire:       outputs.yearsToRetire    ?? 0,
        retirementTarget:    outputs.retirementTarget ?? 0,
        retirementGap:        outputs.retirementGap        as number | undefined,
        savingsProgress:      outputs.savingsProgress      as number | undefined,
        projectedBalance10yr: outputs.projectedBalance10yr as number | undefined,
        annualContribution:   outputs.annualContribution   as number | undefined,
      },
    ),

  // ── drip-calculator ───────────────────────────────────────────────
  "drip-calculator": (values, outputs) =>
    generateDripInsights(
      {
        initial:       n(values.initial,       10000),
        monthlyAdd:    n(values.monthlyAdd,    200),
        dividendYield: n(values.dividendYield, 4),
        priceGrowth:   n(values.priceGrowth,   5),
        years:         n(values.years,         20),
      },
      {
        finalValue:       outputs.finalValue       ?? 0,
        totalContributed: outputs.totalContributed ?? 0,
        totalGain:        outputs.totalGain        ?? 0,
        returnMultiple:       outputs.returnMultiple       as number | undefined,
        annualDividendAtEnd:  outputs.annualDividendAtEnd  as number | undefined,
        doubleTimeYears:      outputs.doubleTimeYears      as number | undefined,
        reinvestedDividends:  outputs.reinvestedDividends  as number | undefined,
        noReinvestValue:      outputs.noReinvestValue      as number | undefined,
        dripAdvantage:        outputs.dripAdvantage        as number | undefined,
        realValue:            outputs.realValue            as number | undefined,
      },
    ),

  // ── salary-to-hourly ──────────────────────────────────────────────
  "salary-to-hourly": (values, outputs) =>
    generateSalaryToHourlyInsights(
      {
        annualSalary: n(values.annualSalary,  65000),
        hoursPerWeek: n(values.hoursPerWeek,  40),
        weeksPerYear: n(values.weeksPerYear,  52),
      },
      {
        hourlyRate:  outputs.hourlyRate  ?? 0,
        dailyRate:   outputs.dailyRate   ?? 0,
        weeklyRate:  outputs.weeklyRate  ?? 0,
        monthlyRate: outputs.monthlyRate ?? 0,
        hoursPerYear:     outputs.hoursPerYear     as number | undefined,
        perMinuteRate:    outputs.perMinuteRate     as number | undefined,
        minutesPerDollar: outputs.minutesPerDollar  as number | undefined,
      },
    ),

  // ── pto-calculator ─────────────────────────────────────────────────
  "pto-calculator": (values, outputs) =>
    generatePtoInsights(
      {
        hourlyRate:        n(values.hourlyRate,        35),
        ptoHoursRemaining: n(values.ptoHoursRemaining, 80),
        hoursPerDay:       n(values.hoursPerDay,       8),
      },
      {
        cashValue:         outputs.cashValue         ?? 0,
        daysRemaining:     outputs.daysRemaining     ?? 0,
        weeklyEarningRate: outputs.weeklyEarningRate ?? 0,
        dailyCashValue: outputs.dailyCashValue as number | undefined,
        ptoDaysAsWeeks: outputs.ptoDaysAsWeeks as number | undefined,
      },
    ),

  // ── true-hourly-wage ───────────────────────────────────────────────
  "true-hourly-wage": (values, outputs) =>
    generateTrueHourlyInsights(
      {
        salary:        n(values.salary,        65000),
        hoursPerWeek:  n(values.hoursPerWeek,  40),
        commuteHrsDay: n(values.commuteHrsDay, 0.5),
        decompressHrs: n(values.decompressHrs, 0.5),
      },
      {
        trueHourly:        outputs.trueHourly        ?? 0,
        advertisedHourly:  outputs.advertisedHourly  ?? 0,
        extraHoursPerYear: outputs.extraHoursPerYear ?? 0,
        hourlyLoss:            outputs.hourlyLoss            as number | undefined,
        trueVsAdvertisedRatio: outputs.trueVsAdvertisedRatio as number | undefined,
        timeRobbedWeeks:       outputs.timeRobbedWeeks       as number | undefined,
      },
    ),
  // ── credit-card-interest ───────────────────────────────────────────────────
  "credit-card-interest": (values, outputs) =>
    generateCreditCardInterestInsights(
      {
        balance:        n(values.balance,        3000),
        apr:            n(values.apr,            22),
        monthlyPayment: n(values.monthlyPayment, 100),
      },
      {
        monthsToPayoff:  outputs.monthsToPayoff  ?? 0,
        totalInterest:   outputs.totalInterest   ?? 0,
        totalPaid:       outputs.totalPaid       ?? 0,
        interestOfTotal: outputs.interestOfTotal ?? 0,
        interestToBalanceRatio: outputs.interestToBalanceRatio as number | undefined,
        yearsToPayoff:          outputs.yearsToPayoff          as number | undefined,
        dailyInterestCost:      outputs.dailyInterestCost      as number | undefined,
      },
    ),

  // ── student-loan-calculator ────────────────────────────────────────────────
  "student-loan-calculator": (values, outputs) =>
    generateStudentLoanInsights(
      {
        loan: n(values.loan, 35000),
        rate: n(values.rate, 5.5),
        term: n(values.term, 120),
      },
      {
        payment:   outputs.payment   ?? 0,
        totalPaid: outputs.totalPaid ?? 0,
        interest:  outputs.interest  ?? 0,
        interestToLoanRatio: outputs.interestToLoanRatio as number | undefined,
        totalCostMultiple:   outputs.totalCostMultiple   as number | undefined,
        dailyInterestCost:   outputs.dailyInterestCost   as number | undefined,
      },
    ),

  // ── mortgage-refinance-calculator ─────────────────────────────────────────
  "mortgage-refinance-calculator": (values, outputs) =>
    generateMortgageRefinanceInsights(
      {
        oldPayment:   n(values.oldPayment,   2200),
        newPayment:   n(values.newPayment,   1900),
        closingCosts: n(values.closingCosts, 4500),
        years:        n(values.years,        10),
      },
      {
        savingsPerMonth: outputs.savingsPerMonth ?? 0,
        breakEvenMonths: outputs.breakEvenMonths ?? 9999,
        totalSavings:    outputs.totalSavings    ?? 0,
        breakEvenYears:  outputs.breakEvenYears  as number | undefined,
        savingsRatio:    outputs.savingsRatio    as number | undefined,
        annualSavings:   outputs.annualSavings   as number | undefined,
      },
    ),

  // ── pay-raise ─────────────────────────────────────────────────────────────
  "pay-raise": (values, outputs) =>
    generatePayRaiseInsights(
      {
        currentSalary: n(values.currentSalary, 65000),
        raisePercent:  n(values.raisePercent,  5),
      },
      {
        newSalary:       outputs.newSalary       ?? 0,
        annualIncrease:  outputs.annualIncrease  ?? 0,
        monthlyIncrease: outputs.monthlyIncrease ?? 0,
        realRaisePercent:       outputs.realRaisePercent       as number | undefined,
        inflationAdjustedGain:  outputs.inflationAdjustedGain  as number | undefined,
        fiveYearCumulativeLoss: outputs.fiveYearCumulativeLoss as number | undefined,
      },
    ),

  // ── burnout-calculator ────────────────────────────────────────────────────
  "burnout-calculator": (values, outputs) =>
    generateBurnoutInsights(
      {
        hours:  n(values.hours,  45),
        stress: n(values.stress, 6),
        sleep:  n(values.sleep,  6.5),
      },
      {
        burnoutRisk:          outputs.burnoutRisk          ?? 0,
        overworkHoursPerYear: outputs.overworkHoursPerYear as number | undefined,
        sleepDebtWeekly:      outputs.sleepDebtWeekly      as number | undefined,
        recoveryWeeksNeeded:  outputs.recoveryWeeksNeeded  as number | undefined,
      },
    ),

  // ── salary-negotiation-calculator ────────────────────────────────────────
  "salary-negotiation-calculator": (values, outputs) =>
    generateSalaryNegotiationInsights(
      {
        currentOffer:    n(values.currentOffer,    65000),
        marketLow:       n(values.marketLow,       60000),
        marketHigh:      n(values.marketHigh,      85000),
        experienceYears: n(values.experienceYears, 5),
        skillMatch:      n(values.skillMatch,      75),
        offerUrgency:    String(values.offerUrgency ?? "low"),
      },
      {
        marketMid:       outputs.marketMid       ?? 0,
        recommendedAsk:  outputs.recommendedAsk  ?? 0,
        confidenceScore: outputs.confidenceScore ?? 0,
        annualGap:       outputs.annualGap        as number | undefined,
        percentageGap:   outputs.percentageGap    as number | undefined,
        gapToMarketHigh: outputs.gapToMarketHigh  as number | undefined,
      },
    ),

  // ── inflation-impact-calculator ───────────────────────────────────────────
  "inflation-impact-calculator": (values, outputs) =>
    generateInflationImpactInsights(
      {
        amount: n(values.amount, 10000),
        rate:   n(values.rate,   3.2),
        years:  n(values.years,  20),
      },
      {
        futureValue:        outputs.futureValue        ?? 0,
        loss:               outputs.loss               ?? 0,
        lossPercent:        outputs.lossPercent        ?? 0,
        requiredFuture:     outputs.requiredFuture     ?? 0,
        erosionMultiple:    outputs.erosionMultiple    ?? 0,
        firstYearLoss:      outputs.firstYearLoss      ?? 0,
        dailyLossFirstYear: outputs.dailyLossFirstYear ?? 0,
        yearsToHalve:       outputs.yearsToHalve       ?? 0,
        realValueRatio:     outputs.realValueRatio     ?? 0,
        vsCurrentCpi:       outputs.vsCurrentCpi       ?? 0,
      },
    ),

  // ── future-value ───────────────────────────────────────────────────────────
  "future-value": (values, outputs) =>
    generateFutureValueInsights(
      {
        initial: n(values.initial, 10000),
        monthly: n(values.monthly, 500),
        rate:    n(values.rate,    7),
        years:   n(values.years,   20),
      },
      {
        futureValue:        outputs.futureValue        ?? 0,
        totalInvested:      outputs.totalInvested      ?? 0,
        totalContributions: outputs.totalContributions ?? 0,
        totalInterest:      outputs.totalInterest      ?? 0,
        realFutureValue:    outputs.realFutureValue    ?? 0,
        inflationLoss:      outputs.inflationLoss      ?? 0,
        interestSharePct:   outputs.interestSharePct   ?? 0,
        growthMultiple:     outputs.growthMultiple     ?? 0,
        finalYearInterest:  outputs.finalYearInterest  ?? 0,
        doublingYears:      outputs.doublingYears      ?? 0,
      },
    ),

  // ── 401k-calculator ────────────────────────────────────────────────────────
  "401k-calculator": (values, outputs) =>
    generateRetirement401kInsights(
      {
        currentBalance:   n(values.currentBalance,   15000),
        salary:           n(values.salary,           65000),
        contributionPct:  n(values.contributionPct,  6),
        employerMatchPct: n(values.employerMatchPct, 50),
        matchLimitPct:    n(values.matchLimitPct,    6),
        rate:             n(values.rate,             7),
        years:            n(values.years,            30),
        annualRaisePct:   n(values.annualRaisePct,   3),
      },
      {
        balance:           outputs.balance           ?? 0,
        yourContributions: outputs.yourContributions ?? 0,
        employerMatch:     outputs.employerMatch     ?? 0,
        growth:            outputs.growth            ?? 0,
        realBalance:       outputs.realBalance       ?? 0,
        firstYearMatch:    outputs.firstYearMatch    ?? 0,
        matchLeftOnTable:  outputs.matchLeftOnTable  ?? 0,
        fullMatchCaptured: outputs.fullMatchCaptured ?? 0,
      },
    ),

  // ── savings-calculator ─────────────────────────────────────────────────────
  "savings-calculator": (values, outputs) =>
    generateSavingsGrowthInsights(
      {
        initial: n(values.initial, 5000),
        monthly: n(values.monthly, 300),
        rate:    n(values.rate,    4.5),
        years:   n(values.years,   10),
      },
      {
        balance:          outputs.balance          ?? 0,
        totalDeposited:   outputs.totalDeposited   ?? 0,
        interestEarned:   outputs.interestEarned   ?? 0,
        realBalance:      outputs.realBalance      ?? 0,
        inflationLoss:    outputs.inflationLoss    ?? 0,
        interestSharePct: outputs.interestSharePct ?? 0,
        realReturnPct:    outputs.realReturnPct    ?? 0,
        beatsInflation:   outputs.beatsInflation   ?? 0,
        hysaAdvantage:    outputs.hysaAdvantage    ?? 0,
      },
    ),

  // ── savings-goal-calculator ────────────────────────────────────────────────
  "savings-goal-calculator": (values, outputs) =>
    generateSavingsGoalInsights(
      {
        goalAmount:     n(values.goalAmount,     20000),
        currentSavings: n(values.currentSavings, 2000),
        years:          n(values.years,          3),
        annualReturn:   n(values.annualReturn,   4),
      },
      {
        monthlyContribution:   outputs.monthlyContribution   ?? 0,
        totalContributed:      outputs.totalContributed      ?? 0,
        interestEarned:        outputs.interestEarned        ?? 0,
        interestSharePct:      outputs.interestSharePct      ?? 0,
        monthlyNoGrowth:       outputs.monthlyNoGrowth       ?? 0,
        monthlySavedByGrowth:  outputs.monthlySavedByGrowth  ?? 0,
        inflationAdjustedGoal: outputs.inflationAdjustedGoal ?? 0,
        monthlyForRealGoal:    outputs.monthlyForRealGoal    ?? 0,
      },
    ),

  // ── home-equity-calculator ─────────────────────────────────────────────────
  "home-equity-calculator": (values, outputs) =>
    generateHomeEquityInsights(
      {
        homeValue: n(values.homeValue, 450000),
        mortgage:  n(values.mortgage,  280000),
      },
      {
        equity:       outputs.equity    ?? 0,
        ltv:          outputs.ltv       ?? 0,
        borrowable:   outputs.borrowable ?? 0,
        equityPercent:         outputs.equityPercent         as number | undefined,
        toHeloc80ltv:          outputs.toHeloc80ltv          as number | undefined,
        equityAnnualSalaries:  outputs.equityAnnualSalaries  as number | undefined,
      },
    ),

  // ── closing-cost-calculator ────────────────────────────────────────────────
  "closing-cost-calculator": (values, outputs) =>
    generateClosingCostInsights(
      {
        homePrice: n(values.homePrice, 350000),
        percent:   n(values.percent,   3),
      },
      {
        closingCost:    outputs.closingCost ?? 0,
        rangeLow:       outputs.rangeLow    ?? 0,
        rangeHigh:      outputs.rangeHigh   ?? 0,
        asMonthsRent:     outputs.asMonthsRent     as number | undefined,
        asWeeksIncome:    outputs.asWeeksIncome     as number | undefined,
        breakEvenMonths:  outputs.breakEvenMonths   as number | undefined,
      },
    ),

  // ── down-payment-countdown ─────────────────────────────────────────────────
  "down-payment-countdown": (values, outputs) =>
    generateDownPaymentInsights(
      {
        homePrice:    n(values.homePrice,    400000),
        downPct:      n(values.downPct,      20),
        currentSaved: n(values.currentSaved, 5000),
        months:       n(values.months,       36),
        appreciationPct: n(values.appreciationPct, 4),
        hysaApyOverride: n(values.hysaApyOverride, 0),
        closingCostPct:  n(values.closingCostPct, 0),
      },
      {
        monthlySavings: outputs.monthlySavings ?? 0,
        targetDown:     outputs.targetDown     ?? 0,
        remaining:      outputs.remaining      ?? 0,
        progressPercent:           outputs.progressPercent           as number | undefined,
        fasterMonthsWith200:       outputs.fasterMonthsWith200       as number | undefined,
        opportunityCostOfWaiting:  outputs.opportunityCostOfWaiting  as number | undefined,
        monthlyNoInterest:         outputs.monthlyNoInterest         as number | undefined,
        monthlyInterestSavings:    outputs.monthlyInterestSavings    as number | undefined,
        targetDownToday:           outputs.targetDownToday           as number | undefined,
        appreciationGap:           outputs.appreciationGap           as number | undefined,
        futureHomePrice:           outputs.futureHomePrice           as number | undefined,
        interestEarned:            outputs.interestEarned            as number | undefined,
        closingCosts:              outputs.closingCosts              as number | undefined,
        cashToClose:               outputs.cashToClose               as number | undefined,
        avoidsPMI:                 outputs.avoidsPMI                 as number | undefined,
        pmiShortfall:              outputs.pmiShortfall              as number | undefined,
        realTargetDown:            outputs.realTargetDown            as number | undefined,
      },
    ),

  // ── solar-roi ───────────────────────────────────────────────────────────────
  "solar-roi": (values, outputs) =>
    generateSolarRoiInsights(
      {
        systemCost:       n(values.systemCost,       20000),
        monthlyBill:      n(values.monthlyBill,      150),
        solarOffset:      n(values.solarOffset,      85),
        utilityInflation: n(values.utilityInflation, 3),
      },
      {
        paybackMonths: outputs.paybackMonths ?? 0,
        year1Savings:  outputs.year1Savings  ?? 0,
        savings25yr:   outputs.savings25yr   ?? 0,
        paybackYears:             outputs.paybackYears             as number | undefined,
        roiMultiple:              outputs.roiMultiple              as number | undefined,
        profitYears:              outputs.profitYears              as number | undefined,
        co2TonsPerYear:           outputs.co2TonsPerYear           as number | undefined,
        inflationProtectionValue: outputs.inflationProtectionValue as number | undefined,
        gridIndependenceScore:    outputs.gridIndependenceScore    as number | undefined,
        utilityBillIn10yrs:       outputs.utilityBillIn10yrs       as number | undefined,
        year25MonthlySaving:      outputs.year25MonthlySaving      as number | undefined,
      },
    ),

  // ── appliance-energy-cost ────────────────────────────────────────────────────
  "appliance-energy-cost": (values, outputs) =>
    generateApplianceEnergyInsights(
      {
        state:       String(values.state ?? "National"),
        watts:       n(values.watts,       200),
        hoursPerDay: n(values.hoursPerDay, 8),
        daysPerWeek: n(values.daysPerWeek, 7),
        quantity:    n(values.quantity,    1),
        electricRateOverride: n(values.electricRateOverride, 0),
      },
      {
        dailyCost:         outputs.dailyCost         ?? 0,
        weeklyCost:        outputs.weeklyCost        ?? 0,
        monthlyCost:       outputs.monthlyCost       ?? 0,
        annualCost:        outputs.annualCost        ?? 0,
        kWhPerYear:        outputs.kWhPerYear        ?? 0,
        tenYearCost:       outputs.tenYearCost       ?? 0,
        inflatedCost10yr:  outputs.inflatedCost10yr  ?? 0,
        asPercentHomeBill: outputs.asPercentHomeBill ?? 0,
        efficientSavings:  outputs.efficientSavings  ?? 0,
        electricRate:      outputs.electricRate      ?? 0,
      },
    ),

  // ── heating-cost ─────────────────────────────────────────────────────────────
  "heating-cost": (values, outputs) =>
    generateHeatingCostInsights(
      {
        state:       String(values.state       ?? "National"),
        heatingDays: n(values.heatingDays,  150),
        homeSqFt:    n(values.homeSqFt,    1500),
        heatSource:  String(values.heatSource  ?? "gas"),
        insulation:  String(values.insulation  ?? "average"),
        fuelPriceOverride: n(values.fuelPriceOverride, 0),
      },
      {
        annualHeatingCost:       outputs.annualHeatingCost       ?? 0,
        monthlyCost:             outputs.monthlyCost             ?? 0,
        costPerHeatingDay:       outputs.costPerHeatingDay       ?? 0,
        annualKBtu:              outputs.annualKBtu              ?? 0,
        annualGasCost:           outputs.annualGasCost           ?? 0,
        annualElecCost:          outputs.annualElecCost          ?? 0,
        annualPropaneCost:       outputs.annualPropaneCost       ?? 0,
        thermsEquivalent:        outputs.thermsEquivalent        ?? 0,
        insulationUpgradeSaving: outputs.insulationUpgradeSaving ?? 0,
        tenYearCost:             outputs.tenYearCost             ?? 0,
        inflatedCost10yr:        outputs.inflatedCost10yr        ?? 0,
        gasPrice:                outputs.gasPrice                ?? 0,
        electricRate:            outputs.electricRate            ?? 0,
      },
    ),

  // ── ev-charging-cost ─────────────────────────────────────────────────────────
  "ev-charging-cost": (values, outputs) =>
    generateEvChargingInsights(
      {
        state:             String(values.state             ?? "National"),
        milesPerYear:      n(values.milesPerYear,      12000),
        kwhPer100mi:       n(values.kwhPer100mi,       30),
        publicChargingPct: n(values.publicChargingPct, 10),
        touPlan:           String(values.touPlan        ?? "none") as "none" | "basic" | "ev_rate",
        homeRateOverride:  n(values.homeRateOverride,   0),
      },
      {
        annualTotalCost:      outputs.annualTotalCost      ?? 0,
        homeAnnualCost:       outputs.homeAnnualCost       ?? 0,
        publicAnnualCost:     outputs.publicAnnualCost     ?? 0,
        monthlyCost:          outputs.monthlyCost          ?? 0,
        costPerMileCents:     outputs.costPerMileCents     ?? 0,
        noTouAnnualCost:      outputs.noTouAnnualCost      ?? 0,
        touAnnualSaving:      outputs.touAnnualSaving      ?? 0,
        homeOnlyAnnualCost:   outputs.homeOnlyAnnualCost   ?? 0,
        publicOnlyAnnualCost: outputs.publicOnlyAnnualCost ?? 0,
        effectiveHomeRate:    outputs.effectiveHomeRate     ?? 0,
        homeRateRaw:          outputs.homeRateRaw           ?? 0,
        inflatedCost10yr:     outputs.inflatedCost10yr      ?? 0,
        tenYearCost:          outputs.tenYearCost           ?? 0,
      },
    ),

  // ── water-bill-calculator ────────────────────────────────────────────────────
  "water-bill-calculator": (values, outputs) =>
    generateWaterBillInsights(
      {
        state:           String(values.state           ?? "National"),
        householdSize:   n(values.householdSize,   3),
        usageLevel:      String(values.usageLevel      ?? "average"),
        outdoorWatering: String(values.outdoorWatering ?? "none"),
        billingType:     String(values.billingType     ?? "combined"),
        rateOverride:    n(values.rateOverride, 0),
      },
      {
        annualWaterCost:   outputs.annualWaterCost   ?? 0,
        monthlyCost:       outputs.monthlyCost       ?? 0,
        dailyCost:         outputs.dailyCost         ?? 0,
        gallonsPerDay:     outputs.gallonsPerDay     ?? 0,
        annualGallons:     outputs.annualGallons     ?? 0,
        effectiveRate:     outputs.effectiveRate     ?? 0,
        costPerPerson:     outputs.costPerPerson     ?? 0,
        lowUsageSaving:    outputs.lowUsageSaving    ?? 0,
        leakFixSaving:     outputs.leakFixSaving     ?? 0,
        nationalRefAnnual: outputs.nationalRefAnnual ?? 0,
        vsNationalPct:     outputs.vsNationalPct     ?? 0,
        tenYearCost:       outputs.tenYearCost       ?? 0,
        inflatedCost10yr:  outputs.inflatedCost10yr  ?? 0,
        indoorGallonsPct:  outputs.indoorGallonsPct  ?? 0,
        combinedRate:      outputs.combinedRate      ?? 0,
      },
    ),

  // ── fire-calculator ──────────────────────────────────────────────────────────
  "fire-calculator": (values, outputs) =>
    fireInsights(
      {
        monthlyExpenses: n(values.monthlyExpenses, 4000),
        currentSavings:  n(values.currentSavings,  50000),
        monthlySavings:  n(values.monthlySavings,  2000),
        annualReturn:    n(values.annualReturn,     7),
      },
      {
        fireNumber:         outputs.fireNumber         as number | undefined,
        yearsToFire:        outputs.yearsToFire        as number | undefined,
        savingsRate:        outputs.savingsRate         as number | undefined,
        percentFunded:      outputs.percentFunded       as number | undefined,
        passiveIncomeNow:   outputs.passiveIncomeNow   as number | undefined,
        yearsFasterWith500: outputs.yearsFasterWith500 as number | undefined,
      },
    ),

  // ── millionaire-calculator ───────────────────────────────────────────────────
  "millionaire-calculator": (values, outputs) =>
    millionaireInsights(
      {
        currentSavings: n(values.currentSavings, 10000),
        monthlySavings: n(values.monthlySavings, 500),
        annualReturn:   n(values.annualReturn,   7),
      },
      {
        yearsToMillion:     outputs.yearsToMillion     as number | undefined,
        totalContributed:   outputs.totalContributed   as number | undefined,
        interestEarned:     outputs.interestEarned     as number | undefined,
        progressPercent:    outputs.progressPercent    as number | undefined,
        marketContribPct:   outputs.marketContribPct   as number | undefined,
        yearsFasterWith200: outputs.yearsFasterWith200 as number | undefined,
        realValueAtMillion: outputs.realValueAtMillion as number | undefined,
        yearsToRealMillion: outputs.yearsToRealMillion as number | undefined,
        extraYearsForReal:  outputs.extraYearsForReal  as number | undefined,
      },
    ),

  // ── missed-investment ────────────────────────────────────────────────────────
  "missed-investment": (values, outputs) =>
    missedInvestmentInsights(
      {
        amount:       n(values.amount,       1000),
        yearsAgo:     n(values.yearsAgo,     5),
        annualReturn: n(values.annualReturn, 10),
      },
      {
        currentValue:      outputs.currentValue      as number | undefined,
        totalGain:         outputs.totalGain         as number | undefined,
        multiplier:        outputs.multiplier        as number | undefined,
        growthLostPct:     outputs.growthLostPct     as number | undefined,
        monthlyEquivalent: outputs.monthlyEquivalent as number | undefined,
        futureProjection:  outputs.futureProjection  as number | undefined,
        weeklyLoss:        outputs.weeklyLoss        as number | undefined,
      },
    ),

  // ── lottery-vs-investing ─────────────────────────────────────────────────────
  "lottery-vs-investing": (values, outputs) =>
    lotteryVsInvestingInsights(
      {
        weekly: n(values.weekly, 20),
        years:  n(values.years,  20),
        return: n(values.return, 7),
      },
      {
        invested:     outputs.invested     as number | undefined,
        spent:        outputs.spent        as number | undefined,
        gap:          outputs.gap          as number | undefined,
        lossMultiple: outputs.lossMultiple as number | undefined,
        monthlySpend: outputs.monthlySpend as number | undefined,
        dailyCost:    outputs.dailyCost    as number | undefined,
      },
    ),

  // ── airbnb-profit ────────────────────────────────────────────────────────────
  "airbnb-profit": (values, outputs) =>
    airbnbProfitInsights(
      {
        nightlyRate:     n(values.nightlyRate,     150),
        occupancyPct:    n(values.occupancyPct,    70),
        platformFeePct:  n(values.platformFeePct,  15),
        monthlyExpenses: n(values.monthlyExpenses, 800),
      },
      {
        monthlyRevenue:        outputs.monthlyRevenue        as number | undefined,
        monthlyProfit:         outputs.monthlyProfit         as number | undefined,
        annualProfit:          outputs.annualProfit          as number | undefined,
        breakEvenOcc:          outputs.breakEvenOcc          as number | undefined,
        profitMarginPct:       outputs.profitMarginPct       as number | undefined,
        tenYearProfit:         outputs.tenYearProfit         as number | undefined,
        revenueToExpenseRatio: outputs.revenueToExpenseRatio as number | undefined,
      },
    ),

  // ── self-employed-tax ────────────────────────────────────────────────────────
  "self-employed-tax": (values, outputs) =>
    selfEmployedTaxInsights(
      {
        grossIncome:      n(values.grossIncome,      80000),
        businessExpenses: n(values.businessExpenses, 8000),
        federalRate:      n(values.federalRate,      22),
      },
      {
        annualTaxEstimate: outputs.annualTaxEstimate as number | undefined,
        quarterlyPayment:  outputs.quarterlyPayment  as number | undefined,
        monthlyReserve:    outputs.monthlyReserve    as number | undefined,
        effectiveTaxRate:  outputs.effectiveTaxRate  as number | undefined,
        netAfterTax:       outputs.netAfterTax       as number | undefined,
        netMonthly:        outputs.netMonthly        as number | undefined,
        seTaxAmount:       outputs.seTaxAmount       as number | undefined,
      },
    ),

  // ── job-offer-comparison ─────────────────────────────────────────────────────
  "job-offer-comparison": (values, outputs) =>
    jobOfferComparisonInsights(
      {
        salaryA:        n(values.salaryA,        85000),
        salaryB:        n(values.salaryB,        95000),
        commuteCostA:   n(values.commuteCostA,   3000),
        commuteCostB:   n(values.commuteCostB,   500),
        benefitsValueA: n(values.benefitsValueA, 12000),
        benefitsValueB: n(values.benefitsValueB, 8000),
      },
      {
        effectiveA:  outputs.effectiveA  as number | undefined,
        effectiveB:  outputs.effectiveB  as number | undefined,
        difference:  outputs.difference  as number | undefined,
        monthlyGap:  outputs.monthlyGap  as number | undefined,
        fiveYearGap: outputs.fiveYearGap as number | undefined,
        tenYearGap:  outputs.tenYearGap  as number | undefined,
        benefitsGap: outputs.benefitsGap as number | undefined,
        commuteGap:  outputs.commuteGap  as number | undefined,
      },
    ),

  // ── side-hustle-calculator ───────────────────────────────────────────────────
  "side-hustle-calculator": (values, outputs) =>
    sideHustleInsights(
      {
        hoursPerWeek: n(values.hoursPerWeek, 10),
        rate:         n(values.rate,         35),
        expensePct:   n(values.expensePct,   15),
        taxRate:      n(values.taxRate,      25),
      },
      {
        netMonthly:      outputs.netMonthly      as number | undefined,
        yearlyNet:       outputs.yearlyNet       as number | undefined,
        hourlyEffective: outputs.hourlyEffective as number | undefined,
        monthlyRevenue:  outputs.monthlyRevenue  as number | undefined,
        annualTaxPaid:   outputs.annualTaxPaid   as number | undefined,
        fiveYearNet:     outputs.fiveYearNet     as number | undefined,
      },
    ),

  // ── screen-time-impact (live state wage data) ──────────────────────────────
  "screen-time-impact": (values, outputs) =>
    screenTimeInsights(
      {
        hoursPerDay: n(values.hoursPerDay, 4),
        yearsAhead:  n(values.yearsAhead,  10),
        state:       String(values.state ?? "National"),
        hourlyRateOverride: n(values.hourlyRateOverride, 0),
      },
      {
        annualCost:          outputs.annualCost          ?? 0,
        weeklyHours:         outputs.weeklyHours         ?? 0,
        lifetimeDays:        outputs.lifetimeDays        ?? 0,
        monthlyCost:         outputs.monthlyCost         ?? 0,
        dailyCost:           outputs.dailyCost           ?? 0,
        stateMedianWage:     outputs.stateMedianWage     ?? 23.11,
        excessHoursPerDay:   outputs.excessHoursPerDay   ?? 0,
        excessAnnualCost:    outputs.excessAnnualCost    ?? 0,
        oneHourAnnualSaving: outputs.oneHourAnnualSaving ?? 0,
        oneHourInvested10yr: outputs.oneHourInvested10yr ?? 0,
        invested10yr:        outputs.invested10yr        ?? 0,
        invested30yr:        outputs.invested30yr        ?? 0,
        daysPerYear:         outputs.daysPerYear         ?? 0,
      },
    ),

  // ── streaming-time-calculator ───────────────────────────────────────────────
  "streaming-time-calculator": (values, outputs) =>
    streamingTimeInsights(
      {
        hoursPerDay:    n(values.hoursPerDay, 3),
        yearsAhead:     n(values.yearsAhead, 10),
        monthlySubCost: n(values.monthlySubCost, 50),
        state:          String(values.state ?? "National"),
        hourlyRateOverride: n(values.hourlyRateOverride, 0),
      },
      {
        annualCost:          outputs.annualCost          ?? 0,
        monthlyCost:         outputs.monthlyCost         ?? 0,
        dailyCost:           outputs.dailyCost           ?? 0,
        weeklyHours:         outputs.weeklyHours         ?? 0,
        yearlyHours:         outputs.yearlyHours         ?? 0,
        daysPerYear:         outputs.daysPerYear         ?? 0,
        lifetimeDays:        outputs.lifetimeDays        ?? 0,
        stateMedianWage:     outputs.stateMedianWage     ?? 23.11,
        annualSubCost:       outputs.annualSubCost       ?? 0,
        subTotalCost:        outputs.subTotalCost        ?? 0,
        costPerHourWatched:  outputs.costPerHourWatched  ?? 0,
        combinedAnnualCost:  outputs.combinedAnnualCost  ?? 0,
        excessHoursPerDay:   outputs.excessHoursPerDay   ?? 0,
        excessAnnualCost:    outputs.excessAnnualCost    ?? 0,
        oneHourAnnualSaving: outputs.oneHourAnnualSaving ?? 0,
        oneHourInvested10yr: outputs.oneHourInvested10yr ?? 0,
        invested10yr:        outputs.invested10yr        ?? 0,
        invested30yr:        outputs.invested30yr        ?? 0,
        subInvested10yr:     outputs.subInvested10yr     ?? 0,
      },
    ),

  // ── phone-addiction-calculator ──────────────────────────────────────────────
  "phone-addiction-calculator": (values, outputs) =>
    phoneAddictionInsights(
      {
        hoursPerDay:   n(values.hoursPerDay, 4.5),
        pickupsPerDay: n(values.pickupsPerDay, 86),
        yearsAhead:    n(values.yearsAhead, 10),
        state:         String(values.state ?? "National"),
        hourlyRateOverride: n(values.hourlyRateOverride, 0),
      },
      {
        annualCost:          outputs.annualCost          ?? 0,
        monthlyCost:         outputs.monthlyCost         ?? 0,
        dailyCost:           outputs.dailyCost           ?? 0,
        yearlyHours:         outputs.yearlyHours         ?? 0,
        weeklyHours:         outputs.weeklyHours         ?? 0,
        daysPerYear:         outputs.daysPerYear         ?? 0,
        lifetimeDays:        outputs.lifetimeDays        ?? 0,
        stateMedianWage:     outputs.stateMedianWage     ?? 23.11,
        wakingPct:           outputs.wakingPct           ?? 0,
        pickupsPerYear:      outputs.pickupsPerYear      ?? 0,
        minutesPerPickup:    outputs.minutesPerPickup    ?? 0,
        excessHoursPerDay:   outputs.excessHoursPerDay   ?? 0,
        excessAnnualCost:    outputs.excessAnnualCost    ?? 0,
        oneHourAnnualSaving: outputs.oneHourAnnualSaving ?? 0,
        oneHourInvested10yr: outputs.oneHourInvested10yr ?? 0,
        invested10yr:        outputs.invested10yr        ?? 0,
        invested30yr:        outputs.invested30yr        ?? 0,
      },
    ),

  // ── alcohol-cost-calculator ─────────────────────────────────────────────────
  "alcohol-cost-calculator": (values, outputs) =>
    generateAlcoholCostInsights(
      {
        drinksPerWeek:  n(values.drinksPerWeek,  10),
        costPerDrink:   n(values.costPerDrink,    8),
        reduceDrinksBy: n(values.reduceDrinksBy,  3),
      },
      {
        weeklySpend:       outputs.weeklySpend        ?? 0,
        yearlyCost:        outputs.yearlyCost         ?? 0,
        monthlyCost:       outputs.monthlyCost        ?? 0,
        tenYearCost:       outputs.tenYearCost        ?? 0,
        dailyCost:         outputs.dailyCost          ?? 0,
        investedValue10yr: outputs.investedValue10yr  ?? 0,
        investedValue20yr: outputs.investedValue20yr  ?? 0,
        cutYearlySaving:   outputs.cutYearlySaving    ?? 0,
        cutInvested10yr:   outputs.cutInvested10yr    ?? 0,
        reducedYearlyCost: outputs.reducedYearlyCost  ?? 0,
      },
    ),

  // ── vaping-cost-calculator ──────────────────────────────────────────────────
  "vaping-cost-calculator": (values, outputs) =>
    generateVapingCostInsights(
      {
        dailyCost:  n(values.dailyCost,  6),
        cutDailyBy: n(values.cutDailyBy, 2),
      },
      {
        yearlyCost:        outputs.yearlyCost        ?? 0,
        monthlyCost:       outputs.monthlyCost       ?? 0,
        tenYearCost:       outputs.tenYearCost       ?? 0,
        investedValue10yr: outputs.investedValue10yr  ?? 0,
        investedValue20yr: outputs.investedValue20yr  ?? 0,
        cutYearlySaving:   outputs.cutYearlySaving    ?? 0,
        cutInvested10yr:   outputs.cutInvested10yr    ?? 0,
        reducedYearlyCost: outputs.reducedYearlyCost  ?? 0,
        smokingAnnual:     outputs.smokingAnnual      ?? 0,
        vsSmokingDiff:     outputs.vsSmokingDiff      ?? 0,
      },
    ),

  // ── gambling-loss-calculator ─────────────────────────────────────────────────
  "gambling-loss-calculator": (values, outputs) =>
    gamblingLossInsights(
      {
        weeklySpend: n(values.weeklySpend, 50),
        years:       n(values.years,       5),
      },
      {
        totalLoss:            outputs.totalLoss            as number | undefined,
        investedValue:        outputs.investedValue        as number | undefined,
        opportunityCost:      outputs.opportunityCost      as number | undefined,
        weeklyInMonthlyTerms: outputs.weeklyInMonthlyTerms as number | undefined,
        dailyCost:            outputs.dailyCost            as number | undefined,
        returnMultiple:       outputs.returnMultiple       as number | undefined,
      },
    ),

  // ── social-media-time-calculator ─────────────────────────────────────────────
  "social-media-time-calculator": (values, outputs) =>
    socialMediaTimeInsights(
      {
        dailyHours: n(values.dailyHours, 2),
        years:      n(values.years,      10),
      },
      {
        yearlyHours:       outputs.yearlyHours       as number | undefined,
        lifetimeHours:     outputs.lifetimeHours     as number | undefined,
        yearsLost:         outputs.yearsLost         as number | undefined,
        daysLost:          outputs.daysLost          as number | undefined,
        workingYearsLost:  outputs.workingYearsLost  as number | undefined,
        yearsLostDecimal:  outputs.yearsLostDecimal  as number | undefined,
      },
    ),

  // ── biological-age-calculator ─────────────────────────────────────────────────
  "biological-age-calculator": (values, outputs) =>
    biologicalAgeInsights(
      {
        age:      n(values.age,      35),
        sleep:    n(values.sleep,    7),
        exercise: n(values.exercise, 3),
        bmi:      n(values.bmi,      24),
        smoker:   n(values.smoker,   0),
      },
      {
        biologicalAge:        outputs.biologicalAge        as number | undefined,
        riskScore:            outputs.riskScore            as number | undefined,
        ageDelta:             outputs.ageDelta             as number | undefined,
        riskFactorCount:      outputs.riskFactorCount      as number | undefined,
        improvementPotential: outputs.improvementPotential as number | undefined,
      },
    ),

  // ── life-in-weeks-calculator ─────────────────────────────────────────────────
  "life-in-weeks-calculator": (values, outputs) =>
    lifeInWeeksInsights(
      {
        age:            n(values.age,            30),
        lifeExpectancy: n(values.lifeExpectancy, 80),
      },
      {
        weeksRemaining:       outputs.weeksRemaining       as number | undefined,
        weeksLived:           outputs.weeksLived           as number | undefined,
        percentUsed:          outputs.percentUsed          as number | undefined,
        yearsRemaining:       outputs.yearsRemaining       as number | undefined,
        daysRemaining:        outputs.daysRemaining        as number | undefined,
        summerWeeksRemaining: outputs.summerWeeksRemaining as number | undefined,
      },
    ),

  // ── life-expectancy-calculator ───────────────────────────────────────────────
  "life-expectancy-calculator": (values, outputs) =>
    lifeExpectancyInsights(
      {
        age:      n(values.age,      35),
        smoker:   n(values.smoker,   0),
        exercise: n(values.exercise, 2),
        bmi:      n(values.bmi,      24),
      },
      {
        lifeExpectancy:           outputs.lifeExpectancy           as number | undefined,
        yearsRemaining:           outputs.yearsRemaining           as number | undefined,
        weeksRemaining:           outputs.weeksRemaining           as number | undefined,
        improvementPotential:     outputs.improvementPotential     as number | undefined,
        daysRemaining:            outputs.daysRemaining            as number | undefined,
        productiveYearsRemaining: outputs.productiveYearsRemaining as number | undefined,
      },
    ),

  // ── meeting-cost (live state wage data) ─────────────────────────────────────
  "meeting-cost": (values, outputs) =>
    meetingCostInsights(
      {
        attendees:       n(values.attendees, 8),
        durationMinutes: n(values.durationMinutes, 60),
        seniority:       String(values.seniority ?? "mixed"),
        frequency:       String(values.frequency ?? "weekly"),
        state:           String(values.state ?? "National"),
        wageOverride:    n(values.wageOverride, 0),
      },
      {
        totalCost:             outputs.totalCost             ?? 0,
        costPerMinute:         outputs.costPerMinute         ?? 0,
        costPerAttendee:       outputs.costPerAttendee       ?? 0,
        annualizedCost:        outputs.annualizedCost        ?? 0,
        loadedHourlyRate:      outputs.loadedHourlyRate      ?? 0,
        attendeeHours:         outputs.attendeeHours         ?? 0,
        trim15Saving:          outputs.trim15Saving          ?? 0,
        dropOneAttendeeSaving: outputs.dropOneAttendeeSaving ?? 0,
        asyncSaving:           outputs.asyncSaving           ?? 0,
        meetingsPerYear:       outputs.meetingsPerYear       ?? 1,
        refocusCostPerMeeting: outputs.refocusCostPerMeeting as number | undefined,
        trueCostPerMeeting:    outputs.trueCostPerMeeting    as number | undefined,
        trueAnnualizedCost:    outputs.trueAnnualizedCost    as number | undefined,
        annualWorkdays:        outputs.annualWorkdays        as number | undefined,
      },
    ),

  // ── procrastination-cost (live state wage data) ─────────────────────────────
  "procrastination-cost": (values, outputs) =>
    procrastinationCostInsights(
      {
        hourlyRateOverride: n(values.hourlyRateOverride, 0),
        hoursPerDay: n(values.hoursPerDay, 2),
        daysPerYear: n(values.daysPerYear, 250),
        state:       String(values.state ?? "National"),
      },
      {
        dailyLoss:         outputs.dailyLoss         ?? 0,
        weeklyLoss:        outputs.weeklyLoss        ?? 0,
        monthlyLoss:       outputs.monthlyLoss       ?? 0,
        annualLoss:        outputs.annualLoss        ?? 0,
        tenYearLoss:       outputs.tenYearLoss       ?? 0,
        careerLoss:        outputs.careerLoss        ?? 0,
        stateMedianWage:   outputs.stateMedianWage   ?? 23.11,
        halfHourSaving:    outputs.halfHourSaving    ?? 0,
        excessHoursPerDay: outputs.excessHoursPerDay ?? 0,
        excessAnnualLoss:  outputs.excessAnnualLoss  ?? 0,
        annualHoursLost:   outputs.annualHoursLost   ?? 0,
        daysLostPerYear:   outputs.daysLostPerYear   ?? 0,
      },
    ),

  // ── crypto-loss-calculator ───────────────────────────────────────────────────
  "crypto-loss-calculator": (values, outputs) =>
    cryptoLossInsights(
      {
        invested:     n(values.invested,     10000),
        currentValue: n(values.currentValue,  4000),
        yearsHeld:    n(values.yearsHeld,        3),
      },
      {
        pnl:               outputs.pnl               as number | undefined,
        pnlPercent:        outputs.pnlPercent         as number | undefined,
        indexAlternative:  outputs.indexAlternative   as number | undefined,
        opportunityGap:    outputs.opportunityGap     as number | undefined,
        breakEvenMultiple: outputs.breakEvenMultiple  as number | undefined,
        indexGainPercent:  outputs.indexGainPercent   as number | undefined,
      },
    ),

  // ── gpa-calculator ────────────────────────────────────────────────────────────
  "gpa-calculator": (values, outputs) =>
    generateGpaInsights(
      {
        currentGpa:       n(values.currentGpa,       3.2),
        creditsDone:      n(values.creditsDone,       60),
        remainingCredits: n(values.remainingCredits,  30),
        targetGpa:        n(values.targetGpa,        3.5),
      },
      {
        requiredGpa:         outputs.requiredGpa         ?? 0,
        maxAchievableGpa:    outputs.maxAchievableGpa    ?? 0,
        minPossibleGpa:      outputs.minPossibleGpa      ?? 0,
        totalCredits:        outputs.totalCredits        ?? 0,
        neededQualityPoints: outputs.neededQualityPoints ?? 0,
        gpaGap:              outputs.gpaGap              ?? 0,
        feasible:            outputs.feasible            ?? 0,
        alreadyLocked:       outputs.alreadyLocked       ?? 0,
      },
    ),

  // ── work-hours-calculator ───────────────────────────────────────────────────
  "work-hours-calculator": (values, outputs) =>
    generateWorkHoursInsights(
      {
        hoursPerDay: n(values.hoursPerDay, 8),
        daysPerWeek: n(values.daysPerWeek, 5),
        weeksWorked: n(values.weeksWorked, 52),
        hourlyRate:  n(values.hourlyRate,  25),
      },
      {
        totalHours:    outputs.totalHours    ?? 0,
        weeklyHours:   outputs.weeklyHours   ?? 0,
        daysWorked:    outputs.daysWorked    ?? 0,
        regularHours:  outputs.regularHours  ?? 0,
        overtimeHours: outputs.overtimeHours ?? 0,
        regularPay:    outputs.regularPay    ?? 0,
        overtimePay:   outputs.overtimePay   ?? 0,
        grossPay:      outputs.grossPay      ?? 0,
        fte:           outputs.fte           ?? 0,
      },
    ),

  // ── working-days-calculator ─────────────────────────────────────────────────
  "working-days-calculator": (values, outputs) =>
    generateWorkingDaysInsights(
      {
        calendarDays:    n(values.calendarDays,    90),
        holidays:        n(values.holidays,         0),
        workDaysPerWeek: n(values.workDaysPerWeek,  5),
      },
      {
        workingDays:     outputs.workingDays     ?? 0,
        weekendDays:     outputs.weekendDays     ?? 0,
        workingWeeks:    outputs.workingWeeks    ?? 0,
        pctWorking:      outputs.pctWorking      ?? 0,
        weekdayEstimate: outputs.weekdayEstimate ?? 0,
      },
    ),

  // ── time-between-dates-calculator ───────────────────────────────────────────
  "time-between-dates-calculator": (values, outputs) =>
    generateTimeBetweenInsights(
      { days: n(values.days, 90) },
      {
        weeks:         outputs.weeks         ?? 0,
        months:        outputs.months        ?? 0,
        years:         outputs.years         ?? 0,
        businessDays:  outputs.businessDays  ?? 0,
        hours:         outputs.hours         ?? 0,
        fullWeeks:     outputs.fullWeeks     ?? 0,
        remainderDays: outputs.remainderDays ?? 0,
      },
    ),

  // ── pomodoro-calculator ─────────────────────────────────────────────────────
  "pomodoro-calculator": (values, outputs) =>
    generatePomodoroInsights(
      {
        hoursAvailable: n(values.hoursAvailable, 6),
        sessionMinutes: n(values.sessionMinutes, 25),
        breakMinutes:   n(values.breakMinutes,    5),
        daysPerWeek:    n(values.daysPerWeek,      5),
      },
      {
        sessions:        outputs.sessions        ?? 0,
        deepWorkHours:   outputs.deepWorkHours    ?? 0,
        deepWorkMinutes: outputs.deepWorkMinutes  ?? 0,
        breakMinutes:    outputs.breakMinutes     ?? 0,
        focusDensity:    outputs.focusDensity     ?? 0,
        weeklySessions:  outputs.weeklySessions   ?? 0,
        weeklyDeepHours: outputs.weeklyDeepHours  ?? 0,
        longBreaks:      outputs.longBreaks       ?? 0,
      },
    ),

  // ── protein-intake-calculator ───────────────────────────────────────────────
  "protein-intake-calculator": (values, outputs) =>
    generateProteinInsights(
      {
        weight:      n(values.weight,      160),
        weightIsKg:  n(values.weightIsKg,    0),
        multiplier:  n(values.multiplier,  1.6),
        mealsPerDay: n(values.mealsPerDay,   4),
      },
      {
        weightKg:            outputs.weightKg            ?? 0,
        proteinGrams:        outputs.proteinGrams        ?? 0,
        caloriesFromProtein: outputs.caloriesFromProtein ?? 0,
        perMealGrams:        outputs.perMealGrams        ?? 0,
        rangeLow:            outputs.rangeLow            ?? 0,
        rangeHigh:           outputs.rangeHigh           ?? 0,
        rdaMultiple:         outputs.rdaMultiple         ?? 0,
      },
    ),

  // ── expense-split-calculator ────────────────────────────────────────────────
  "expense-split-calculator": (values, outputs) =>
    generateExpenseSplitInsights(
      {
        amount: n(values.amount, 200),
        people: n(values.people,   4),
        tipPct: n(values.tipPct,  18),
        taxPct: n(values.taxPct,   0),
      },
      {
        tip:              outputs.tip              ?? 0,
        tax:              outputs.tax              ?? 0,
        grandTotal:       outputs.grandTotal       ?? 0,
        perPersonBase:    outputs.perPersonBase    ?? 0,
        perPersonTotal:   outputs.perPersonTotal   ?? 0,
        tipPerPerson:     outputs.tipPerPerson     ?? 0,
        taxPerPerson:     outputs.taxPerPerson     ?? 0,
        roundedPerPerson: outputs.roundedPerPerson ?? 0,
        collectionBuffer: outputs.collectionBuffer ?? 0,
      },
    ),

  // ── tile-calculator ──────────────────────────────────────────────────────────
  "tile-calculator": (values, outputs) =>
    generateTileInsights(
      {
        roomLength:   n(values.roomLength,   12),
        roomWidth:    n(values.roomWidth,    10),
        tileAreaSqFt: n(values.tileAreaSqFt,  1),
        wastePct:     n(values.wastePct,     10),
        pricePerTile: n(values.pricePerTile,  0),
      },
      {
        roomArea:      outputs.roomArea      ?? 0,
        areaWithWaste: outputs.areaWithWaste ?? 0,
        baseTiles:     outputs.baseTiles     ?? 0,
        tilesNeeded:   outputs.tilesNeeded   ?? 0,
        wasteTiles:    outputs.wasteTiles    ?? 0,
        materialCost:  outputs.materialCost  ?? 0,
      },
    ),

  // ── flooring-cost-calculator ─────────────────────────────────────────────────
  "flooring-cost-calculator": (values, outputs) =>
    generateFlooringInsights(
      {
        roomLength:      n(values.roomLength,      15),
        roomWidth:       n(values.roomWidth,       12),
        materialPerSqFt: n(values.materialPerSqFt,  4),
        laborPerSqFt:    n(values.laborPerSqFt,     3),
        wastePct:        n(values.wastePct,        10),
      },
      {
        area:                 outputs.area                 ?? 0,
        areaWithWaste:        outputs.areaWithWaste        ?? 0,
        materialCost:         outputs.materialCost         ?? 0,
        laborCost:            outputs.laborCost            ?? 0,
        totalCost:            outputs.totalCost            ?? 0,
        costPerSqFtInstalled: outputs.costPerSqFtInstalled ?? 0,
        laborShare:           outputs.laborShare           ?? 0,
      },
    ),

  // ── moving-cost-calculator ───────────────────────────────────────────────────
  "moving-cost-calculator": (values, outputs) =>
    generateMovingInsights(
      {
        moversCost:  n(values.moversCost,  1200),
        fuelCost:    n(values.fuelCost,     150),
        packingCost: n(values.packingCost,  120),
        storageCost: n(values.storageCost,    0),
        miscCost:    n(values.miscCost,     180),
        bufferPct:   n(values.bufferPct,     15),
        miles:       n(values.miles,          0),
      },
      {
        subtotal:         outputs.subtotal         ?? 0,
        buffer:           outputs.buffer           ?? 0,
        total:            outputs.total            ?? 0,
        costPerMile:      outputs.costPerMile      ?? 0,
        topLineItem:      outputs.topLineItem      ?? 0,
        topLineItemShare: outputs.topLineItemShare ?? 0,
      },
    ),

  // ── tax-bracket-calculator ───────────────────────────────────────────────────
  "tax-bracket-calculator": (values, outputs) =>
    generateTaxBracketInsights(
      {
        grossIncome:         n(values.grossIncome,         75000),
        filingStatus:        String(values.filingStatus ?? "single"),
        pretaxContributions: n(values.pretaxContributions,     0),
      },
      {
        taxableIncome:      outputs.taxableIncome      ?? 0,
        federalTax:         outputs.federalTax         ?? 0,
        effectiveRate:      outputs.effectiveRate      ?? 0,
        marginalRate:       outputs.marginalRate       ?? 0,
        afterTaxIncome:     outputs.afterTaxIncome     ?? 0,
        standardDeduction:  outputs.standardDeduction  ?? 0,
        effectiveOnTaxable: outputs.effectiveOnTaxable ?? 0,
      },
    ),

  // ── payroll-calculator ───────────────────────────────────────────────────────
  "payroll-calculator": (values, outputs) =>
    generatePayrollInsights(
      {
        employees:           n(values.employees,           10),
        avgSalary:           n(values.avgSalary,         60000),
        employerTaxPct:      n(values.employerTaxPct,        10),
        benefitsPerEmployee: n(values.benefitsPerEmployee, 15000),
        billableHours:       n(values.billableHours,      1800),
      },
      {
        grossPayroll:        outputs.grossPayroll        ?? 0,
        employerTaxes:       outputs.employerTaxes       ?? 0,
        benefitsTotal:       outputs.benefitsTotal       ?? 0,
        totalCost:           outputs.totalCost           ?? 0,
        costPerEmployee:     outputs.costPerEmployee     ?? 0,
        burdenPct:           outputs.burdenPct           ?? 0,
        costPerBillableHour: outputs.costPerBillableHour ?? 0,
      },
    ),

  // ── global-wealth-percentile ─────────────────────────────────────────────────
  "global-wealth-percentile": (values, outputs) =>
    generateGlobalWealthPercentileInsights(
      {
        netWorth:     n(values.netWorth,     250000),
        annualIncome: n(values.annualIncome,  60000),
      },
      {
        wealthPercentile:  outputs.wealthPercentile  ?? 0,
        incomePercentile:  outputs.incomePercentile  ?? 0,
        wealthTopPct:      outputs.wealthTopPct      ?? 0,
        incomeTopPct:      outputs.incomeTopPct      ?? 0,
        dailyIncome:       outputs.dailyIncome       ?? 0,
        adultsBelowWealth: outputs.adultsBelowWealth ?? 0,
      },
    ),

  // ── budget-calculator ────────────────────────────────────────────────────────
  "budget-calculator": (values, outputs) =>
    budgetInsights(
      {
        income:    n(values.income,    5000),
        housing:   n(values.housing,   1500),
        food:      n(values.food,       600),
        transport: n(values.transport,  400),
        debt:      n(values.debt,       300),
        other:     n(values.other,      500),
        state:     String(values.state ?? "US Average"),
        rateOverride: n(values.rateOverride, 0),
      },
      {
        leftover:          outputs.leftover          as number | undefined,
        savingsRate:       outputs.savingsRate        as number | undefined,
        expenseRatio:      outputs.expenseRatio       as number | undefined,
        annualLeftover:    outputs.annualLeftover     as number | undefined,
        housingRatio:      outputs.housingRatio       as number | undefined,
        debtRatio:         outputs.debtRatio          as number | undefined,
        tenYearIfInvested: outputs.tenYearIfInvested  as number | undefined,
        needsRatio:        outputs.needsRatio         as number | undefined,
        wantsRatio:        outputs.wantsRatio         as number | undefined,
        salesTaxAnnual:    outputs.salesTaxAnnual     as number | undefined,
        salesTaxMonthly:   outputs.salesTaxMonthly    as number | undefined,
        resolvedRate:      outputs.resolvedRate       as number | undefined,
      },
    ),

  // ── subscription-auditor ─────────────────────────────────────────────────────
  "subscription-auditor": (values, outputs) =>
    subscriptionAuditorInsights(
      {
        streaming:    n(values.streaming,    45),
        software:     n(values.software,     30),
        fitness:      n(values.fitness,      40),
        newsMedia:    n(values.newsMedia,    15),
        other:        n(values.other,        20),
        annualReturn: n(values.annualReturn,  7),
      },
      {
        monthlyTotal:          outputs.monthlyTotal          ?? 0,
        annualTotal:           outputs.annualTotal           ?? 0,
        twentyYearCost:        outputs.twentyYearCost        ?? 0,
        investedValue10:       outputs.investedValue10       ?? 0,
        investedValue20:       outputs.investedValue20       ?? 0,
        dailyCost:             outputs.dailyCost             ?? 0,
        cutTwentyAnnualSaving: outputs.cutTwentyAnnualSaving ?? 0,
        cutTwentyInvested10:   outputs.cutTwentyInvested10   ?? 0,
        vsAvgMonthly:          outputs.vsAvgMonthly          ?? 0,
        vsAvgPct:              outputs.vsAvgPct              ?? 0,
        streamingPct:          outputs.streamingPct          ?? 0,
        softwarePct:           outputs.softwarePct           ?? 0,
        fitnessPct:            outputs.fitnessPct            ?? 0,
        newsMediaPct:          outputs.newsMediaPct          ?? 0,
        otherPct:              outputs.otherPct              ?? 0,
        annualReturn:          outputs.annualReturn          ?? 0,
      },
    ),

  // ── wfh-savings-calculator ───────────────────────────────────────────────────
  "wfh-savings-calculator": (values, outputs) =>
    wfhSavingsInsights(
      {
        dailyCommuteCost: n(values.dailyCommuteCost, 15),
        officeDays:       n(values.officeDays,        3),
        dailyFood:        n(values.dailyFood,         18),
        commuteMinutes:   n(values.commuteMinutes,    45),
      },
      {
        yearlySavings:        outputs.yearlySavings        as number | undefined,
        monthlySavings:       outputs.monthlySavings       as number | undefined,
        timeSavedHours:       outputs.timeSavedHours       as number | undefined,
        tenYearSavings:       outputs.tenYearSavings       as number | undefined,
        investedSavings10yr:  outputs.investedSavings10yr  as number | undefined,
        hourlyValueRecovered: outputs.hourlyValueRecovered as number | undefined,
      },
    ),

  // ── pet-cost-calculator ──────────────────────────────────────────────────────
  "pet-cost-calculator": (values, outputs) =>
    petCostInsights(
      {
        food:      n(values.food,       800),
        vet:       n(values.vet,        600),
        insurance: n(values.insurance,  400),
        misc:      n(values.misc,       300),
        years:     n(values.years,       12),
      },
      {
        yearlyCost:          outputs.yearlyCost          as number | undefined,
        lifetimeCost:        outputs.lifetimeCost        as number | undefined,
        monthlyCost:         outputs.monthlyCost         as number | undefined,
        dailyCost:           outputs.dailyCost           as number | undefined,
        investedAlternative: outputs.investedAlternative as number | undefined,
      },
    ),

  // ── wedding-cost-calculator ──────────────────────────────────────────────────
  "wedding-cost-calculator": (values, outputs) =>
    weddingCostInsights(
      {
        guests:       n(values.guests,       100),
        costPerGuest: n(values.costPerGuest,  100),
        venue:        n(values.venue,        5000),
        photography:  n(values.photography,  3000),
        misc:         n(values.misc,         3000),
      },
      {
        total:               outputs.total               as number | undefined,
        allInPerGuest:       outputs.allInPerGuest       as number | undefined,
        cateringTotal:       outputs.cateringTotal       as number | undefined,
        nonCateringTotal:    outputs.nonCateringTotal    as number | undefined,
        investedAlternative: outputs.investedAlternative as number | undefined,
      },
    ),

  // ── meal-prep-calculator ─────────────────────────────────────────────────
  "meal-prep-calculator": (values, outputs) =>
    mealPrepInsights(
      {
        meals:        n(values.meals,                  10),
        takeoutCost:  n(outputs.takeoutCostDerived,    15),
        diningStyle:  String(values.diningStyle  ?? "takeout"),
        diningRegion: String(values.diningRegion ?? "National"),
        extraMeals:   n(values.extraMeals, 1),
      },
      {
        costPerMeal:         outputs.costPerMeal        as number | undefined,
        weeklySavings:       outputs.weeklySavings      as number | undefined,
        yearlySavings:       outputs.yearlySavings      as number | undefined,
        tenYearIfInvested:   outputs.tenYearIfInvested  as number | undefined,
        monthlyFoodCost:     outputs.monthlyFoodCost    as number | undefined,
        mealsOutsourced:     outputs.mealsOutsourced    as number | undefined,
        extraWeeklySavings:  outputs.extraWeeklySavings as number | undefined,
        extraYearlySavings:  outputs.extraYearlySavings as number | undefined,
      },
    ),

  // ── sales-tax (live state data) ──────────────────────────────────────────
  "sales-tax": (values, outputs) =>
    generateSalesTaxInsights(
      {
        price:        n(values.price,        100),
        taxRate:      outputs.resolvedRate   ?? n(values.taxRate, 7.12),
        monthlySpend: n(values.monthlySpend, 800),
        state:        String(values.state ?? "US Average"),
        rateOverride: n(values.rateOverride, 0),
      },
      {
        totalPrice:          outputs.totalPrice          ?? 0,
        taxAmount:           outputs.taxAmount           ?? 0,
        monthlyTaxBurden:    outputs.monthlyTaxBurden    ?? 0,
        annualTaxBurden:     outputs.annualTaxBurden     ?? 0,
        resolvedRate:        outputs.resolvedRate        ?? 0,
        neighborAvgRate:     outputs.neighborAvgRate     ?? 0,
        vsNeighborsDelta:    outputs.vsNeighborsDelta    ?? 0,
        grocerySaving:       outputs.grocerySaving       ?? 0,
        effectiveOnGroceries: outputs.effectiveOnGroceries ?? 0,
        dailyTaxBurden:      outputs.dailyTaxBurden      ?? 0,
        annualIfInvested10yr: outputs.annualIfInvested10yr ?? 0,
      },
    ),

  // ── profit-margin ──────────────────────────────────────────────────────────
  "profit-margin": (values, outputs) =>
    profitMarginInsights(
      {
        revenue: n(values.revenue, 10000),
        cost:    n(values.cost,     7000),
      },
      {
        grossProfit:   outputs.grossProfit   ?? 0,
        marginPercent: outputs.marginPercent ?? 0,
        markupPercent: outputs.markupPercent ?? 0,
      },
    ),

  // ── markup-calculator ────────────────────────────────────────────────────────
  "markup-calculator": (values, outputs) =>
    markupInsights(
      {
        costPrice:     n(values.costPrice,     50),
        markupPercent: n(values.markupPercent, 50),
      },
      {
        sellingPrice:  outputs.sellingPrice  ?? 0,
        profitAmount:  outputs.profitAmount  ?? 0,
        marginPercent: outputs.marginPercent ?? 0,
      },
    ),

  // ── car-affordability ────────────────────────────────────────────────────────
  "car-affordability": (values, outputs) =>
    carAffordabilityInsights(
      {
        monthlyIncome:  n(values.monthlyIncome,  6000),
        loanTermMonths: n(values.loanTermMonths, 60),
        annualRate:     n(values.annualRate,     7),
      },
      {
        maxMonthlyPayment:   outputs.maxMonthlyPayment   ?? 0,
        maxLoanAmount:       outputs.maxLoanAmount       ?? 0,
        recommendedCarPrice: outputs.recommendedCarPrice ?? 0,
      },
    ),

  // ── child-support-calculator ─────────────────────────────────────────────────
  "child-support-calculator": (values, outputs) =>
    childSupportInsights(
      {
        payerIncome:    n(values.payerIncome,    5000),
        receiverIncome: n(values.receiverIncome, 3000),
        children:       n(values.children,       2),
        custodySplit:   n(values.custodySplit,   50),
      },
      {
        support:       outputs.support       ?? 0,
        annualSupport: outputs.annualSupport ?? 0,
      },
    ),

  // ── commute-time-value ───────────────────────────────────────────────────────
  "commute-time-value": (values, outputs) =>
    commuteTimeValueInsights(
      {
        dailyMins:  n(values.dailyMins,  45),
        hourlyWage: n(values.hourlyWage, 30),
        workDays:   n(values.workDays,   235),
      },
      {
        annualHours:         outputs.annualHours         ?? 0,
        annualCost:          outputs.annualCost          ?? 0,
        salaryLostPct:       outputs.salaryLostPct       ?? 0,
        effectiveHourlyRate: outputs.effectiveHourlyRate ?? 0,
      },
    ),
};

// ─── Component ────────────────────────────────────────────────────────────────

interface LiveInsightBlockProps {
  /** Engine calculator slug — used to route to the correct generator */
  slug: string;
  /** Live calculator values from the engine render prop */
  values: CalculatorValues;
  /** Live calculator outputs from the engine render prop */
  outputs: CalculatorOutputs;
  /** Optional regional context (e.g. selected US state) */
  context?: InsightContext;
}

/**
 * Renders live WorthCore insight cards driven by actual engine state.
 * Called synchronously via the Phase 6B render-prop pattern.
 *
 * Returns null silently when no generator is registered for the slug.
 */
export default function LiveInsightBlock({
  slug,
  values,
  outputs,
  context,
}: LiveInsightBlockProps) {
  const generator = GENERATOR_REGISTRY[slug];
  if (!generator) return null;

  const insights = generator(values, outputs, context);
  if (insights.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        Insights
      </p>
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
}
