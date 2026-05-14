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
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function formatDate(monthsFromNow: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsFromNow);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function calculateEmergencyFund(inputs: EmergencyFundInputs): EmergencyFundResult {
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

  return {
    totalMonthlyExpenses, targetAmount, amountNeeded,
    currentCoverageMonths, isFullyFunded, monthsToGoal,
    completionDate, fundingPct, savingsProgress,
    expenseBreakdown: expenseItems,
  };
}
