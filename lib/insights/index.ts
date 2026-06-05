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
export { generateEvChargingInsights } from "./generators/evChargingInsights";
export type {
  EvChargingInsightInputs,
  EvChargingInsightOutputs,
} from "./generators/evChargingInsights";

export { generateHeatingCostInsights } from "./generators/heatingCostInsights";
export type {
  HeatingCostInsightInputs,
  HeatingCostInsightOutputs,
} from "./generators/heatingCostInsights";

export { generateWaterBillInsights } from "./generators/waterBillInsights";
export type {
  WaterBillInsightInputs,
  WaterBillInsightOutputs,
} from "./generators/waterBillInsights";

export { generateCommuteInsights } from "./generators/commuteInsights";
export type {
  CommuteInputs,
  CommuteOutputs,
} from "./generators/commuteInsights";

export { generateRoadTripCostInsights } from "./generators/roadTripCostInsights";
export type {
  RoadTripInputs,
  RoadTripOutputs,
} from "./generators/roadTripCostInsights";

export { generateLaundryCostInsights } from "./generators/laundryCostInsights";
export type {
  LaundryInputs,
  LaundryOutputs,
} from "./generators/laundryCostInsights";

export { generateGroceryUnitPriceInsights } from "./generators/groceryUnitPriceInsights";
export type {
  GroceryInputs,
  GroceryOutputs,
} from "./generators/groceryUnitPriceInsights";

export { generateTipInsights } from "./generators/tipCalculatorInsights";
export type {
  TipInsightInputs,
  TipInsightOutputs,
} from "./generators/tipCalculatorInsights";

export { generateGpaInsights } from "./generators/gpaInsights";
export type {
  GpaInsightInputs,
  GpaInsightOutputs,
} from "./generators/gpaInsights";

export { generateWorkHoursInsights } from "./generators/workHoursInsights";
export type {
  WorkHoursInsightInputs,
  WorkHoursInsightOutputs,
} from "./generators/workHoursInsights";

export { generateWorkingDaysInsights } from "./generators/workingDaysInsights";
export type {
  WorkingDaysInsightInputs,
  WorkingDaysInsightOutputs,
} from "./generators/workingDaysInsights";

export { generateTimeBetweenInsights } from "./generators/timeBetweenDatesInsights";
export type {
  TimeBetweenInsightInputs,
  TimeBetweenInsightOutputs,
} from "./generators/timeBetweenDatesInsights";

export { generatePomodoroInsights } from "./generators/pomodoroInsights";
export type {
  PomodoroInsightInputs,
  PomodoroInsightOutputs,
} from "./generators/pomodoroInsights";

export { generateProteinInsights } from "./generators/proteinIntakeInsights";
export type {
  ProteinInsightInputs,
  ProteinInsightOutputs,
} from "./generators/proteinIntakeInsights";

export { generateExpenseSplitInsights } from "./generators/expenseSplitInsights";
export type {
  ExpenseSplitInsightInputs,
  ExpenseSplitInsightOutputs,
} from "./generators/expenseSplitInsights";

export { generateTileInsights } from "./generators/tileInsights";
export type {
  TileInsightInputs,
  TileInsightOutputs,
} from "./generators/tileInsights";

export { generateFlooringInsights } from "./generators/flooringCostInsights";
export type {
  FlooringInsightInputs,
  FlooringInsightOutputs,
} from "./generators/flooringCostInsights";

export { generateMovingInsights } from "./generators/movingCostInsights";
export type {
  MovingInsightInputs,
  MovingInsightOutputs,
} from "./generators/movingCostInsights";

export { generateTaxBracketInsights } from "./generators/taxBracketInsights";
export type {
  TaxBracketInsightInputs,
  TaxBracketInsightOutputs,
} from "./generators/taxBracketInsights";

export { generatePayrollInsights } from "./generators/payrollInsights";
export type {
  PayrollInsightInputs,
  PayrollInsightOutputs,
} from "./generators/payrollInsights";

export { generateGlobalWealthPercentileInsights } from "./generators/globalWealthPercentileInsights";
export type {
  WealthPercentileInsightInputs,
  WealthPercentileInsightOutputs,
} from "./generators/globalWealthPercentileInsights";

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
  SavingsGoalInsightInputs,
  SavingsGoalInsightOutputs,
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

export { generateFutureValueInsights } from "./generators/futureValueInsights";
export type {
  FutureValueInsightInputs,
  FutureValueInsightOutputs,
} from "./generators/futureValueInsights";

export { generateSavingsGrowthInsights } from "./generators/savingsGrowthInsights";
export type {
  SavingsGrowthInsightInputs,
  SavingsGrowthInsightOutputs,
} from "./generators/savingsGrowthInsights";

export { generateRetirement401kInsights } from "./generators/retirement401kInsights";
export type {
  Retirement401kInsightInputs,
  Retirement401kInsightOutputs,
} from "./generators/retirement401kInsights";

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
export { streamingTimeInsights } from "./generators/streamingTimeInsights";
export type {
  StreamingTimeInputs,
  StreamingTimeOutputs,
} from "./generators/streamingTimeInsights";
export { phoneAddictionInsights } from "./generators/phoneAddictionInsights";
export type {
  PhoneAddictionInputs,
  PhoneAddictionOutputs,
} from "./generators/phoneAddictionInsights";
export { generateAlcoholCostInsights } from "./generators/alcoholCostInsights";
export type {
  AlcoholInsightInputs,
  AlcoholInsightOutputs,
} from "./generators/alcoholCostInsights";
export { generateVapingCostInsights } from "./generators/vapingCostInsights";
export type {
  VapingInsightInputs,
  VapingInsightOutputs,
} from "./generators/vapingCostInsights";
export { gamblingLossInsights } from "./generators/gamblingLossInsights";
export { socialMediaTimeInsights } from "./generators/socialMediaTimeInsights";

export { biologicalAgeInsights } from "./generators/biologicalAgeInsights";
export { lifeInWeeksInsights } from "./generators/lifeInWeeksInsights";
export { lifeExpectancyInsights } from "./generators/lifeExpectancyInsights";
export { procrastinationCostInsights } from "./generators/procrastinationCostInsights";
export { meetingCostInsights } from "./generators/meetingCostInsights";
export { cryptoLossInsights } from "./generators/cryptoLossInsights";
export { budgetInsights } from "./generators/budgetInsights";
export { subscriptionAuditorInsights } from "./generators/subscriptionAuditorInsights";
export type {
  SubscriptionInputs,
  SubscriptionOutputs,
} from "./generators/subscriptionAuditorInsights";
export { wfhSavingsInsights } from "./generators/wfhSavingsInsights";
export { petCostInsights } from "./generators/petCostInsights";
export { weddingCostInsights } from "./generators/weddingCostInsights";
export { mealPrepInsights } from "./generators/mealPrepInsights";
export { generateSalesTaxInsights } from "./generators/salesTaxInsights";
export type {
  SalesTaxInputs,
  SalesTaxOutputs,
} from "./generators/salesTaxInsights";

export { profitMarginInsights } from "./generators/profitMarginInsights";
export type {
  ProfitMarginInsightInputs,
  ProfitMarginInsightOutputs,
} from "./generators/profitMarginInsights";

export { markupInsights } from "./generators/markupInsights";
export type {
  MarkupInsightInputs,
  MarkupInsightOutputs,
} from "./generators/markupInsights";

export { carAffordabilityInsights } from "./generators/carAffordabilityInsights";
export type {
  CarAffordabilityInsightInputs,
  CarAffordabilityInsightOutputs,
} from "./generators/carAffordabilityInsights";

export { childSupportInsights } from "./generators/childSupportInsights";
export type {
  ChildSupportInsightInputs,
  ChildSupportInsightOutputs,
} from "./generators/childSupportInsights";

export { commuteTimeValueInsights } from "./generators/commuteTimeValueInsights";
export type {
  CommuteTimeValueInsightInputs,
  CommuteTimeValueInsightOutputs,
} from "./generators/commuteTimeValueInsights";
