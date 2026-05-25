// ─── WorthCore Insight Engine — Public API ────────────────────────────────────
//
// Single import point for all insight infrastructure.
//
// Usage:
//   import { generateCommuteInsights, formatCurrency, futureValueAnnuity }
//     from "@/lib/insights";
//   import type { Insight, InsightSeverity } from "@/lib/insights";
//
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────────────────
export type {
  Insight,
  InsightSeverity,
  InsightCategory,
  InsightContext,
  InsightMetric,
} from "./types";

// ── Benchmark helpers ─────────────────────────────────────────────────────────
export {
  calculatePercentDiff,
  compareToReference,
  compareToNationalFuelAverage,
  compareToStateFuelAverage,
  compareToNationalCigarettePrice,
  compareToNationalCityCost,
  formatCurrency,
  formatCurrencyPrecise,
} from "./benchmarks";
export type { ComparisonResult } from "./benchmarks";

// ── Projection helpers ────────────────────────────────────────────────────────
export {
  futureValueAnnuity,
  opportunityCostDaily,
  futureValueLumpSum,
  inflationAdjustedValue,
  yearsToTarget,
} from "./projections";

// ── Insight generators ────────────────────────────────────────────────────────
export { generateCommuteInsights } from "./generators/commuteInsights";
export type {
  CommuteInputs,
  CommuteOutputs,
} from "./generators/commuteInsights";

export { generateSmokingInsights } from "./generators/smokingInsights";
export type {
  SmokingInputs,
  SmokingOutputs,
} from "./generators/smokingInsights";

export { generateLatteInsights } from "./generators/latteInsights";
export type {
  LatteInputs,
  LatteOutputs,
} from "./generators/latteInsights";

export { generateCarLoanInsights } from "./generators/carLoanInsights";
export type {
  CarLoanInputs,
  CarLoanOutputs,
} from "./generators/carLoanInsights";

export { generateEvVsGasInsights } from "./generators/evVsGasInsights";
export type {
  EvVsGasInputs,
  EvVsGasOutputs,
} from "./generators/evVsGasInsights";

export { generateHouseAffordabilityInsights } from "./generators/houseAffordabilityInsights";
export type {
  HouseAffordabilityInputs,
  HouseAffordabilityOutputs,
} from "./generators/houseAffordabilityInsights";

export { generateCreditCardPayoffInsights } from "./generators/creditCardPayoffInsights";
export type {
  CreditCardPayoffInputs,
  CreditCardPayoffOutputs,
} from "./generators/creditCardPayoffInsights";

export { generateCoastFireInsights } from "./generators/coastFireInsights";
export type {
  CoastFireInputs,
  CoastFireOutputs,
} from "./generators/coastFireInsights";

export { generateTimeToRetirementInsights } from "./generators/timeToRetirementInsights";
export type {
  TimeToRetirementInputs,
  TimeToRetirementOutputs,
} from "./generators/timeToRetirementInsights";

export { generateSavingsGoalInsights } from "./generators/savingsGoalInsights";
export type {
  SavingsGoalInputs,
  SavingsGoalOutputs,
} from "./generators/savingsGoalInsights";

export { generateDripInsights } from "./generators/dripInsights";
export type {
  DripInputs,
  DripOutputs,
} from "./generators/dripInsights";

export { generateSalaryToHourlyInsights } from "./generators/salaryToHourlyInsights";
export type {
  SalaryToHourlyInputs,
  SalaryToHourlyOutputs,
} from "./generators/salaryToHourlyInsights";

export { generatePtoInsights } from "./generators/ptoInsights";
export type {
  PtoInputs,
  PtoOutputs,
} from "./generators/ptoInsights";

export { generateTrueHourlyInsights } from "./generators/trueHourlyInsights";
export type {
  TrueHourlyInputs,
  TrueHourlyOutputs,
} from "./generators/trueHourlyInsights";

export { generateCreditCardInterestInsights } from "./generators/creditCardInterestInsights";
export type {
  CreditCardInterestInputs,
  CreditCardInterestOutputs,
} from "./generators/creditCardInterestInsights";

export { generateStudentLoanInsights } from "./generators/studentLoanInsights";
export type {
  StudentLoanInputs,
  StudentLoanOutputs,
} from "./generators/studentLoanInsights";

export { generateMortgageRefinanceInsights } from "./generators/mortgageRefinanceInsights";
export type {
  MortgageRefinanceInputs,
  MortgageRefinanceOutputs,
} from "./generators/mortgageRefinanceInsights";

export { generatePayRaiseInsights } from "./generators/payRaiseInsights";
export type {
  PayRaiseInputs,
  PayRaiseOutputs,
} from "./generators/payRaiseInsights";

export { generateBurnoutInsights } from "./generators/burnoutInsights";
export type {
  BurnoutInputs,
  BurnoutOutputs,
} from "./generators/burnoutInsights";

export { generateSalaryNegotiationInsights } from "./generators/salaryNegotiationInsights";
export type {
  SalaryNegotiationInputs,
  SalaryNegotiationOutputs,
} from "./generators/salaryNegotiationInsights";

export { generateInflationImpactInsights } from "./generators/inflationImpactInsights";
export type {
  InflationImpactInputs,
  InflationImpactOutputs,
} from "./generators/inflationImpactInsights";

export { generateHomeEquityInsights } from "./generators/homeEquityInsights";
export type {
  HomeEquityInputs,
  HomeEquityOutputs,
} from "./generators/homeEquityInsights";

export { generateClosingCostInsights } from "./generators/closingCostInsights";
export type {
  ClosingCostInputs,
  ClosingCostOutputs,
} from "./generators/closingCostInsights";

export { generateDownPaymentInsights } from "./generators/downPaymentInsights";
export type {
  DownPaymentInputs,
  DownPaymentOutputs,
} from "./generators/downPaymentInsights";

export { generateSolarRoiInsights } from "./generators/solarRoiInsights";
export type {
  SolarRoiInputs,
  SolarRoiOutputs,
} from "./generators/solarRoiInsights";

export { generateApplianceEnergyInsights } from "./generators/applianceEnergyInsights";
export type {
  ApplianceEnergyInputs,
  ApplianceEnergyOutputs,
} from "./generators/applianceEnergyInsights";

export { fireInsights } from "./generators/fireInsights";
export { millionaireInsights } from "./generators/millionaireInsights";
export { missedInvestmentInsights } from "./generators/missedInvestmentInsights";
export { lotteryVsInvestingInsights } from "./generators/lotteryVsInvestingInsights";

export { airbnbProfitInsights } from "./generators/airbnbProfitInsights";
export { selfEmployedTaxInsights } from "./generators/selfEmployedTaxInsights";
export { jobOfferComparisonInsights } from "./generators/jobOfferComparisonInsights";
export { sideHustleInsights } from "./generators/sideHustleInsights";

export { screenTimeInsights } from "./generators/screenTimeInsights";
export { alcoholCostInsights } from "./generators/alcoholCostInsights";
export { vapingCostInsights } from "./generators/vapingCostInsights";
export { gamblingLossInsights } from "./generators/gamblingLossInsights";
export { socialMediaTimeInsights } from "./generators/socialMediaTimeInsights";

export { biologicalAgeInsights } from "./generators/biologicalAgeInsights";
export { lifeInWeeksInsights } from "./generators/lifeInWeeksInsights";
export { lifeExpectancyInsights } from "./generators/lifeExpectancyInsights";
export { procrastinationCostInsights } from "./generators/procrastinationCostInsights";
export { cryptoLossInsights } from "./generators/cryptoLossInsights";
export { budgetInsights } from "./generators/budgetInsights";
export { subscriptionAuditorInsights } from "./generators/subscriptionAuditorInsights";
export { wfhSavingsInsights } from "./generators/wfhSavingsInsights";
export { petCostInsights } from "./generators/petCostInsights";
export { weddingCostInsights } from "./generators/weddingCostInsights";
export { mealPrepInsights } from "./generators/mealPrepInsights";
export { generateSalesTaxInsights } from "./generators/salesTaxInsights";
export type {
  SalesTaxInputs,
  SalesTaxOutputs,
} from "./generators/salesTaxInsights";
