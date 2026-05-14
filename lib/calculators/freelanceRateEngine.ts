export type FreelanceMode = "survival" | "comfortable" | "premium";

export interface FreelanceRateInputs {
  desiredAnnualIncome: number;
  hoursPerWeek: number;
  weeksWorked: number;
  utilizationPct: number;          // % of working time that is actually billable (50–80% typical)
  annualBusinessExpenses: number;
  taxRatePct: number;
  profitMarginPct: number;
  currentHourlyRate: number;
  platformFeePct: number;          // Upwork/Fiverr cut (0–30%)
  scopeCreepBufferPct: number;     // extra buffer for revision/scope overrun (0–50%)
  mode: FreelanceMode;             // survival=1×, comfortable=1.2×, premium=1.5×
  estimatedProjectHours?: number;  // optional: for project rate calc
}

export interface FreelanceRateResult {
  billableHoursPerYear: number;
  totalHoursWorked: number;         // raw hours before utilization
  requiredRevenue: number;          // base revenue (before platform/scope)
  requiredRevenueWithFees: number;  // after platform fee + scope creep gross-up
  minimumHourlyRate: number;        // at current mode
  minimumDailyRate: number;
  minimumMonthlyRate: number;
  estimatedProjectRate: number | null;
  rateGap: number;
  isUndercharging: boolean;
  incomeAtCurrentRate: number;
  annualIncomeGap: number;
  // Per-hour breakdown
  incomePerHour: number;
  expensesPerHour: number;
  taxPerHour: number;
  marginPerHour: number;
  platformFeePerHour: number;
  scopeCreepPerHour: number;
  // Rate by mode (survival/comfortable/premium)
  rateByMode: { survival: number; comfortable: number; premium: number };
  // Cost breakdown bars (for chart)
  costBreakdown: { label: string; amount: number; pct: number; colorClass: string }[];
  // Rate scenarios
  scenarios: { label: string; hourlyRate: number; annualIncome: number }[];
  // Utilization impact: what rate would be needed at different utilization levels
  utilizationImpact: { utilizationPct: number; hourlyRate: number }[];
}

export function calculateFreelanceRate(inputs: FreelanceRateInputs): FreelanceRateResult {
  const {
    desiredAnnualIncome,
    hoursPerWeek,
    weeksWorked,
    utilizationPct,
    annualBusinessExpenses,
    taxRatePct,
    profitMarginPct,
    currentHourlyRate,
    platformFeePct,
    scopeCreepBufferPct,
    mode,
    estimatedProjectHours = 0,
  } = inputs;

  const modeMultiplier = mode === "premium" ? 1.5 : mode === "comfortable" ? 1.2 : 1.0;

  const totalHoursWorked     = hoursPerWeek * Math.max(1, weeksWorked);
  const billableHoursPerYear = totalHoursWorked * (utilizationPct / 100);

  // Build up full cost stack
  const taxMultiplier    = taxRatePct / 100;
  const marginMultiplier = profitMarginPct / 100;

  // gross income needed before tax to net desired after tax
  const grossIncomeNeeded = desiredAnnualIncome / (1 - taxMultiplier);
  // total base revenue needed = gross income + expenses + profit margin on top
  const revenueBeforeMargin = grossIncomeNeeded + annualBusinessExpenses;
  const requiredRevenue     = revenueBeforeMargin / (1 - marginMultiplier);

  // Gross up for platform fee (e.g. Upwork takes 20% → need to earn 1/(1-0.2)× more)
  const platformFeeMultiplier = platformFeePct > 0 ? 1 / (1 - platformFeePct / 100) : 1;
  // Gross up for scope creep buffer (add X% on top so revisions are covered)
  const scopeCreepMultiplier = 1 + scopeCreepBufferPct / 100;

  const requiredRevenueWithFees = requiredRevenue * platformFeeMultiplier * scopeCreepMultiplier;

  // Survival rate = base minimum; comfortable & premium apply multiplier
  const survivalRate    = billableHoursPerYear > 0 ? requiredRevenueWithFees / billableHoursPerYear : 0;
  const comfortableRate = survivalRate * 1.2;
  const premiumRate     = survivalRate * 1.5;
  const rateByMode      = {
    survival:    Math.round(survivalRate),
    comfortable: Math.round(comfortableRate),
    premium:     Math.round(premiumRate),
  };

  const minimumHourlyRate  = survivalRate * modeMultiplier;
  const minimumDailyRate   = minimumHourlyRate * 8;
  const minimumMonthlyRate = minimumHourlyRate * (billableHoursPerYear / 12);
  const estimatedProjectRate = estimatedProjectHours > 0 ? minimumHourlyRate * estimatedProjectHours : null;

  const rateGap         = currentHourlyRate - minimumHourlyRate;
  const isUndercharging = rateGap < 0;

  const incomeAtCurrentRate = currentHourlyRate * billableHoursPerYear;
  const annualIncomeGap     = Math.abs(
    (incomeAtCurrentRate * (1 - taxMultiplier) - annualBusinessExpenses) - desiredAnnualIncome
  );

  // Per-hour breakdown (all based on survivalRate baseline)
  const incomePerHour      = billableHoursPerYear > 0 ? (desiredAnnualIncome / billableHoursPerYear) : 0;
  const expensesPerHour    = billableHoursPerYear > 0 ? (annualBusinessExpenses / billableHoursPerYear) : 0;
  const taxPerHour         = billableHoursPerYear > 0 ? (grossIncomeNeeded - desiredAnnualIncome) / billableHoursPerYear : 0;
  const marginPerHour      = billableHoursPerYear > 0 ? (requiredRevenue - revenueBeforeMargin) / billableHoursPerYear : 0;
  const platformFeePerHour = billableHoursPerYear > 0 ? (requiredRevenue * (platformFeeMultiplier - 1)) / billableHoursPerYear : 0;
  const scopeCreepPerHour  = billableHoursPerYear > 0 ? (requiredRevenue * platformFeeMultiplier * (scopeCreepMultiplier - 1)) / billableHoursPerYear : 0;

  const costBreakdown = [
    { label: "Take-home income", amount: incomePerHour,      colorClass: "bg-emerald-400" },
    { label: "Tax provision",    amount: taxPerHour,          colorClass: "bg-red-400"     },
    { label: "Business costs",   amount: expensesPerHour,     colorClass: "bg-blue-400"    },
    { label: "Profit buffer",    amount: marginPerHour,       colorClass: "bg-violet-400"  },
    { label: "Platform fee",     amount: platformFeePerHour,  colorClass: "bg-amber-400"   },
    { label: "Scope creep",      amount: scopeCreepPerHour,   colorClass: "bg-orange-400"  },
  ].filter((i) => i.amount > 0).map((i) => ({
    ...i,
    pct: minimumHourlyRate > 0 ? Math.round((i.amount / minimumHourlyRate) * 100) : 0,
  }));

  const scenarios = [
    { label: "Survival",    hourlyRate: rateByMode.survival    },
    { label: "Comfortable", hourlyRate: rateByMode.comfortable },
    { label: "Premium",     hourlyRate: rateByMode.premium     },
  ].map((s) => ({
    ...s,
    annualIncome: Math.round(s.hourlyRate * billableHoursPerYear * (1 - taxMultiplier) - annualBusinessExpenses),
  }));

  // Utilization impact: how hourly rate changes at 40%, 50%, 60%, 70%, 80%, 90%, 100%
  const utilizationImpact = [40, 50, 60, 70, 80, 90, 100].map((u) => {
    const hrs = totalHoursWorked * (u / 100);
    const rate = hrs > 0 ? requiredRevenueWithFees / hrs : 0;
    return { utilizationPct: u, hourlyRate: Math.round(rate) };
  });

  return {
    billableHoursPerYear: Math.round(billableHoursPerYear),
    totalHoursWorked,
    requiredRevenue,
    requiredRevenueWithFees,
    minimumHourlyRate,
    minimumDailyRate,
    minimumMonthlyRate,
    estimatedProjectRate,
    rateGap,
    isUndercharging,
    incomeAtCurrentRate,
    annualIncomeGap,
    incomePerHour,
    expensesPerHour,
    taxPerHour,
    marginPerHour,
    platformFeePerHour,
    scopeCreepPerHour,
    rateByMode,
    costBreakdown,
    scenarios,
    utilizationImpact,
  };
}
