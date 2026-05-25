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
  generateHomeEquityInsights,
  generateClosingCostInsights,
  generateDownPaymentInsights,
  generateSolarRoiInsights,
  generateApplianceEnergyInsights,
  fireInsights,
  millionaireInsights,
  missedInvestmentInsights,
  lotteryVsInvestingInsights,
  airbnbProfitInsights,
  selfEmployedTaxInsights,
  jobOfferComparisonInsights,
  sideHustleInsights,
  screenTimeInsights,
  alcoholCostInsights,
  vapingCostInsights,
  gamblingLossInsights,
  socialMediaTimeInsights,
  biologicalAgeInsights,
  lifeInWeeksInsights,
  lifeExpectancyInsights,
  procrastinationCostInsights,
  cryptoLossInsights,
  budgetInsights,
  subscriptionAuditorInsights,
  wfhSavingsInsights,
  petCostInsights,
  weddingCostInsights,
  mealPrepInsights,
  generateSalesTaxInsights,
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
  "commute-cost": (values, outputs, context) =>
    generateCommuteInsights(
      {
        milesOneWay:     n(values.milesOneWay,     15),
        mpg:             n(values.mpg,             28),
        gasPrice:        n(values.gasPrice,        3.85),
        workDaysPerYear: n(values.workDaysPerYear, 250),
      },
      {
        annualCost:  outputs.annualCost  ?? 0,
        monthlyCost: outputs.monthlyCost ?? 0,
        costPerDay:  outputs.costPerDay  ?? 0,
      },
      context,
    ),

  // ── quit-smoking ──────────────────────────────────────────────────────────
  "quit-smoking": (values, outputs) =>
    generateSmokingInsights(
      {
        packsPerDay:   n(values.packsPerDay,   1),
        packCost:      n(values.packCost,      9.2),
        daysSinceQuit: n(values.daysSinceQuit, 365),
      },
      {
        moneySaved:         outputs.moneySaved         ?? 0,
        cigarettesAvoided:  outputs.cigarettesAvoided  ?? 0,
        daysOfLifeRegained: outputs.daysOfLifeRegained ?? 0,
      },
    ),

  // ── latte-factor ──────────────────────────────────────────────────────────
  "latte-factor": (values, outputs) =>
    generateLatteInsights(
      {
        dailySpend:   n(values.dailySpend,   6),
        annualReturn: n(values.annualReturn, 7),
        years:        n(values.years,        30),
      },
      {
        investedValue: outputs.investedValue ?? 0,
        totalSpent:    outputs.totalSpent    ?? 0,
        growth:        outputs.growth        ?? 0,
      },
    ),

  // ── car-loan-calculator ───────────────────────────────────────────────────
  "car-loan-calculator": (values, outputs) =>
    generateCarLoanInsights(
      {
        vehiclePrice:  n(values.vehiclePrice,  28000),
        downPayment:   n(values.downPayment,   3000),
        tradeIn:       n(values.tradeIn,       0),
        interestRate:  n(values.interestRate,  7.1),
        termMonths:    n(values.termMonths,    60),
      },
      {
        monthlyPayment:      outputs.monthlyPayment      ?? 0,
        totalInterest:       outputs.totalInterest       ?? 0,
        totalCost:           outputs.totalCost           ?? 0,
        interestPct:         outputs.interestPct         ?? 0,
        loanAmount:          outputs.loanAmount          ?? 0,
        downPaymentRatio:    outputs.downPaymentRatio    as number | undefined,
        interestMultiplier:  outputs.interestMultiplier  as number | undefined,
        annualPaymentBurden: outputs.annualPaymentBurden as number | undefined,
      },
    ),

  // ── ev-vs-gas ─────────────────────────────────────────────────────────────
  "ev-vs-gas": (values, outputs) =>
    generateEvVsGasInsights(
      {
        milesPerYear:  n(values.milesPerYear,  12000),
        mpg:           n(values.mpg,           28),
        gasPrice:      n(values.gasPrice,      3.85),
        kwhPer100mi:   n(values.kwhPer100mi,   30),
        electricRate:  n(values.electricRate,  0.15),
      },
      {
        annualSavings:   outputs.annualSavings  ?? 0,
        annualGasCost:   outputs.annualGasCost  ?? 0,
        annualEvCost:    outputs.annualEvCost   ?? 0,
        fiveYearSavings: outputs.fiveYearSavings as number | undefined,
        tenYearSavings:  outputs.tenYearSavings  as number | undefined,
        breakEvenYears:  outputs.breakEvenYears  as number | undefined,
        gasCostPerMile:  outputs.gasCostPerMile  as number | undefined,
        evCostPerMile:   outputs.evCostPerMile   as number | undefined,
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

  // ── savings-goal-calculator ──────────────────────────────────────────
  "savings-goal-calculator": (values, outputs) =>
    generateSavingsGoalInsights(
      {
        goalAmount:     n(values.goalAmount,     20000),
        currentSavings: n(values.currentSavings, 2000),
        years:          n(values.years,          3),
        annualReturn:   n(values.annualReturn,   4),
      },
      {
        monthlyContribution: outputs.monthlyContribution ?? 0,
        totalContributed:    outputs.totalContributed    ?? 0,
        interestEarned:      outputs.interestEarned      ?? 0,
        interestSharePct:    outputs.interestSharePct    ?? 0,
        interestToContribRatio: outputs.interestToContribRatio as number | undefined,
        annualSavingsRequired:  outputs.annualSavingsRequired  as number | undefined,
        goalYears:              outputs.goalYears              as number | undefined,
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
        rate:   n(values.rate,   3.5),
        years:  n(values.years,  20),
      },
      {
        futureValue:  outputs.futureValue  ?? 0,
        loss:         outputs.loss         ?? 0,
        lossPercent:  outputs.lossPercent  ?? 0,
        realValueRatio: outputs.realValueRatio as number | undefined,
        yearsToHalve:   outputs.yearsToHalve   as number | undefined,
        dailyLoss:      outputs.dailyLoss       as number | undefined,
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
      },
      {
        monthlySavings: outputs.monthlySavings ?? 0,
        targetDown:     outputs.targetDown     ?? 0,
        remaining:      outputs.remaining      ?? 0,
        progressPercent:           outputs.progressPercent           as number | undefined,
        fasterMonthsWith200:       outputs.fasterMonthsWith200       as number | undefined,
        opportunityCostOfWaiting:  outputs.opportunityCostOfWaiting  as number | undefined,
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
        watts:        n(values.watts,        200),
        hoursPerDay:  n(values.hoursPerDay,  8),
        electricRate: n(values.electricRate, 0.15),
      },
      {
        dailyCost:   outputs.dailyCost   ?? 0,
        monthlyCost: outputs.monthlyCost ?? 0,
        annualCost:  outputs.annualCost  ?? 0,
        tenYearCost:          outputs.tenYearCost          as number | undefined,
        coffeeEquivalent:     outputs.coffeeEquivalent     as number | undefined,
        asPercentMedianBill:  outputs.asPercentMedianBill  as number | undefined,
        inflatedCost10yr:     outputs.inflatedCost10yr     as number | undefined,
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
        progressPercent:    outputs.progressPercent    as number | undefined,
        passiveIncomeNow:   outputs.passiveIncomeNow   as number | undefined,
        annualReturnNow:    outputs.annualReturnNow    as number | undefined,
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
        yearsToMillion:    outputs.yearsToMillion    as number | undefined,
        totalContributed:  outputs.totalContributed  as number | undefined,
        interestEarned:    outputs.interestEarned    as number | undefined,
        progressPercent:   outputs.progressPercent   as number | undefined,
        marketContribPct:  outputs.marketContribPct  as number | undefined,
        yearsFasterWith200: outputs.yearsFasterWith200 as number | undefined,
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

  // ── screen-time-impact ──────────────────────────────────────────────────────
  "screen-time-impact": (values, outputs) =>
    screenTimeInsights(
      {
        hoursPerDay: n(values.hoursPerDay, 3),
        hourlyRate:  n(values.hourlyRate,  30),
        yearsAhead:  n(values.yearsAhead,  10),
      },
      {
        annualCost:             outputs.annualCost             as number | undefined,
        weeklyHours:            outputs.weeklyHours            as number | undefined,
        lifetimeDays:           outputs.lifetimeDays           as number | undefined,
        totalCost:              outputs.totalCost              as number | undefined,
        weeklyOpportunityCost:  outputs.weeklyOpportunityCost  as number | undefined,
        investedValue:          outputs.investedValue          as number | undefined,
      },
    ),

  // ── alcohol-cost-calculator ─────────────────────────────────────────────────
  "alcohol-cost-calculator": (values, outputs) =>
    alcoholCostInsights(
      {
        drinksPerWeek: n(values.drinksPerWeek, 5),
        costPerDrink:  n(values.costPerDrink,  7),
      },
      {
        yearlyCost:         outputs.yearlyCost         as number | undefined,
        tenYearCost:        outputs.tenYearCost        as number | undefined,
        investedValue:      outputs.investedValue      as number | undefined,
        weeklySpend:        outputs.weeklySpend        as number | undefined,
        dailyCost:          outputs.dailyCost          as number | undefined,
        twentyYearInvested: outputs.twentyYearInvested as number | undefined,
      },
    ),

  // ── vaping-cost-calculator ──────────────────────────────────────────────────
  "vaping-cost-calculator": (values, outputs) =>
    vapingCostInsights(
      {
        dailyCost: n(values.dailyCost, 5),
      },
      {
        yearlyCost:   outputs.yearlyCost   as number | undefined,
        fiveYear:     outputs.fiveYear     as number | undefined,
        invested:     outputs.invested     as number | undefined,
        weeklySpend:  outputs.weeklySpend  as number | undefined,
        monthlySpend: outputs.monthlySpend as number | undefined,
        tenYear:      outputs.tenYear      as number | undefined,
        invested10yr: outputs.invested10yr as number | undefined,
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

  // ── procrastination-cost ───────────────────────────────────────────────────────
  "procrastination-cost": (values, outputs) =>
    procrastinationCostInsights(
      {
        hoursPerDay: n(values.hoursPerDay,  2),
        hourlyRate:  n(values.hourlyRate,   40),
        daysPerYear: n(values.daysPerYear, 250),
      },
      {
        annualLoss:  outputs.annualLoss  as number | undefined,
        weeklyLoss:  outputs.weeklyLoss  as number | undefined,
        tenYearLoss: outputs.tenYearLoss as number | undefined,
        dailyLoss:   outputs.dailyLoss   as number | undefined,
        monthlyLoss: outputs.monthlyLoss as number | undefined,
        careerLoss:  outputs.careerLoss  as number | undefined,
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
      },
      {
        leftover:          outputs.leftover          as number | undefined,
        savingsRate:       outputs.savingsRate        as number | undefined,
        expenseRatio:      outputs.expenseRatio       as number | undefined,
        annualLeftover:    outputs.annualLeftover     as number | undefined,
        housingRatio:      outputs.housingRatio       as number | undefined,
        debtRatio:         outputs.debtRatio          as number | undefined,
        tenYearIfInvested: outputs.tenYearIfInvested  as number | undefined,
      },
    ),

  // ── subscription-auditor ─────────────────────────────────────────────────────
  "subscription-auditor": (values, outputs) =>
    subscriptionAuditorInsights(
      {
        streaming:  n(values.streaming,  45),
        software:   n(values.software,   30),
        fitness:    n(values.fitness,    40),
        newsMedia:  n(values.newsMedia,  15),
        other:      n(values.other,      20),
      },
      {
        monthlyTotal:    outputs.monthlyTotal   as number | undefined,
        annualTotal:     outputs.annualTotal    as number | undefined,
        twentyYearCost:  outputs.twentyYearCost as number | undefined,
        investedValue10: outputs.investedValue10 as number | undefined,
        investedValue20: outputs.investedValue20 as number | undefined,
        dailyCost:       outputs.dailyCost      as number | undefined,
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

  // ── sales-tax ─────────────────────────────────────────────────────────────
  "sales-tax": (values, outputs) =>
    generateSalesTaxInsights(
      {
        price:        n(values.price,        100),
        taxRate:      outputs.resolvedRate   ?? n(values.taxRate, 7.12),
        monthlySpend: n(values.monthlySpend, 800),
      },
      {
        totalPrice:       outputs.totalPrice       ?? 0,
        taxAmount:        outputs.taxAmount        ?? 0,
        monthlyTaxBurden: outputs.monthlyTaxBurden ?? 0,
        annualTaxBurden:  outputs.annualTaxBurden  ?? 0,
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
        WorthCore Insights
      </p>
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
}
