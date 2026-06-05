export interface MonthlyExpenses {
  rent: number;
  food: number;
  utilities: number;
  transport: number;
  insurance: number;
  subscriptions: number;
  other: number;
}

export interface EmergencyFundInputs {
  expenses: MonthlyExpenses;
  targetMonths: number;
  currentSavings: number;
  monthlySavingsRate: number;
}

export interface EmergencyFundData {
  /** Live annual inflation rate (%), injected from FRED CPI. */
  annualInflationPct: number;
  /** Optional user-entered HYSA APY (%); when > 0 it overrides the default. */
  hysaApyPct?: number;
}

/** Documented benchmark: representative top high-yield savings APY (2026). */
export const HYSA_APY = 4.4;

export interface EmergencyFundResult {
  totalMonthlyExpenses: number;
  targetAmount: number;
  amountNeeded: number;
  currentCoverageMonths: number;
  isFullyFunded: boolean;
  monthsToGoal: number | null;
  completionDate: string;
  fundingPct: number;
  savingsProgress: { month: number; balance: number; target: number }[];
  expenseBreakdown: { category: string; amount: number; pct: number; colorClass: string }[];
  /** Extra dollars needed next year to keep the same coverage at live inflation. */
  inflationDriftPerYear: number;
  /** Interest the target fund earns in a HYSA over a year. */
  annualHysaInterest: number;
  /** 1 if HYSA interest covers the inflation drift on the target, else 0. */
  hysaCoversInflation: number;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function formatDate(monthsFromNow: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsFromNow);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function calculateEmergencyFund(
  inputs: EmergencyFundInputs,
  data: EmergencyFundData = { annualInflationPct: 3.2 },
): EmergencyFundResult {
  const { expenses, targetMonths, currentSavings, monthlySavingsRate } = inputs;

  const totalMonthlyExpenses =
    expenses.rent + expenses.food + expenses.utilities +
    expenses.transport + expenses.insurance + expenses.subscriptions + expenses.other;

  const targetAmount         = totalMonthlyExpenses * targetMonths;
  const amountNeeded         = Math.max(0, targetAmount - currentSavings);
  const currentCoverageMonths = totalMonthlyExpenses > 0
    ? parseFloat((currentSavings / totalMonthlyExpenses).toFixed(1))
    : 0;
  const isFullyFunded        = currentSavings >= targetAmount;
  const fundingPct           = targetAmount > 0
    ? Math.min(100, Math.round((currentSavings / targetAmount) * 100))
    : 100;

  let monthsToGoal: number | null = null;
  let completionDate = "Already funded";
  if (!isFullyFunded) {
    if (monthlySavingsRate > 0) {
      monthsToGoal   = Math.ceil(amountNeeded / monthlySavingsRate);
      completionDate = formatDate(monthsToGoal);
    } else {
      completionDate = "Set a monthly savings amount";
    }
  }

  // Progress series (up to goal or 36 months cap)
  const maxMonths = monthsToGoal ? Math.min(monthsToGoal + 3, 36) : 12;
  const savingsProgress: { month: number; balance: number; target: number }[] = [];
  for (let m = 0; m <= maxMonths; m++) {
    const balance = Math.min(targetAmount, currentSavings + monthlySavingsRate * m);
    savingsProgress.push({ month: m, balance: Math.round(balance), target: Math.round(targetAmount) });
  }

  // Expense breakdown
  const expenseItems = [
    { category: "Rent / housing",  amount: expenses.rent,          colorClass: "bg-blue-400"    },
    { category: "Food",            amount: expenses.food,           colorClass: "bg-emerald-400" },
    { category: "Utilities",       amount: expenses.utilities,      colorClass: "bg-amber-400"   },
    { category: "Transport",       amount: expenses.transport,       colorClass: "bg-violet-400"  },
    { category: "Insurance",       amount: expenses.insurance,       colorClass: "bg-orange-400"  },
    { category: "Subscriptions",   amount: expenses.subscriptions,   colorClass: "bg-pink-400"    },
    { category: "Other",           amount: expenses.other,           colorClass: "bg-gray-400"    },
  ].filter((i) => i.amount > 0).map((i) => ({
    ...i,
    pct: totalMonthlyExpenses > 0 ? Math.round((i.amount / totalMonthlyExpenses) * 100) : 0,
  }));

  const apy = data.hysaApyPct != null && data.hysaApyPct > 0 ? data.hysaApyPct : HYSA_APY;
  const inflationDriftPerYear = Math.round(targetAmount * (Math.max(0, data.annualInflationPct) / 100));
  const annualHysaInterest    = Math.round(targetAmount * (apy / 100));
  const hysaCoversInflation   = annualHysaInterest >= inflationDriftPerYear ? 1 : 0;

  return {
    totalMonthlyExpenses, targetAmount, amountNeeded,
    currentCoverageMonths, isFullyFunded, monthsToGoal,
    completionDate, fundingPct, savingsProgress,
    expenseBreakdown: expenseItems,
    inflationDriftPerYear, annualHysaInterest, hysaCoversInflation,
  };
}
