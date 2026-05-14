/**
 * ─── Debt Payoff Calculator Engine ───────────────────────────────────────────
 * Models debt payoff using avalanche (highest interest first) and snowball
 * (lowest balance first) strategies, with extra payments and lump sums.
 */

export interface DebtEntry {
  id: string;
  name: string;
  balance: number;         // Current outstanding balance
  interestRate: number;    // Annual interest rate %
  minimumPayment: number;  // Required minimum monthly payment
}

export interface DebtPayoffInput {
  debts: DebtEntry[];
  extraMonthlyPayment?: number;  // Extra on top of all minimums
  lumpSumPayment?: number;       // One-time extra payment applied immediately
  strategy: "avalanche" | "snowball" | "minimum";
}

export interface MonthlySnapshot {
  month: number;
  totalBalance: number;
  totalInterestPaid: number;
  principalPaid: number;
}

export interface DebtPayoffResult {
  debtFreeMonths: number;
  debtFreeDate: string;
  totalInterestPaid: number;
  totalPaid: number;
  totalDebt: number;
  monthlyInterestBurn: number;    // Current monthly interest across all debts
  payoffOrder: string[];          // Debt names in order they get paid off
  monthlySnapshots: MonthlySnapshot[];
  // Comparison: minimum only
  minimumOnlyMonths: number;
  minimumOnlyInterest: number;
  interestSaved: number;          // vs minimum only
  monthsSaved: number;            // vs minimum only
}

function runSimulation(
  debts: DebtEntry[],
  extraMonthly: number,
  lumpSum: number,
  strategy: "avalanche" | "snowball" | "minimum",
): Pick<DebtPayoffResult, "debtFreeMonths" | "totalInterestPaid" | "totalPaid" | "monthlySnapshots" | "payoffOrder"> {
  // Deep-copy
  const state = debts.map((d) => ({
    ...d,
    balance: Math.max(0, d.balance - lumpSum / debts.length), // distribute lump sum proportionally
  }));

  const snapshots: MonthlySnapshot[] = [];
  const payoffOrder: string[] = [];
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;
  const MAX_MONTHS = 600; // 50-year safety cap

  while (state.some((d) => d.balance > 0.01) && month < MAX_MONTHS) {
    month++;

    // Sort for priority
    const active = state.filter((d) => d.balance > 0.01);
    if (strategy === "avalanche") {
      active.sort((a, b) => b.interestRate - a.interestRate);
    } else if (strategy === "snowball") {
      active.sort((a, b) => a.balance - b.balance);
    }

    // Apply interest + minimums to all
    let freed = 0;
    for (const debt of state) {
      if (debt.balance <= 0.01) continue;
      const monthlyInterest = (debt.balance * debt.interestRate) / 100 / 12;
      debt.balance += monthlyInterest;
      totalInterest += monthlyInterest;

      const payment = Math.min(debt.balance, debt.minimumPayment);
      debt.balance -= payment;
      totalPaid += payment;

      if (debt.balance <= 0.01) {
        freed += debt.minimumPayment; // freed up to roll into next debt
        if (!payoffOrder.includes(debt.name)) payoffOrder.push(debt.name);
      }
    }

    // Apply extra monthly payment to highest-priority active debt
    let remaining = extraMonthly + freed;
    for (const debt of strategy === "minimum" ? [] : active) {
      if (remaining <= 0) break;
      if (debt.balance <= 0.01) continue;
      const pay = Math.min(debt.balance, remaining);
      debt.balance -= pay;
      totalPaid += pay;
      remaining -= pay;
      if (debt.balance <= 0.01 && !payoffOrder.includes(debt.name)) {
        payoffOrder.push(debt.name);
      }
    }

    const totalBalance = state.reduce((s, d) => s + Math.max(0, d.balance), 0);
    snapshots.push({
      month,
      totalBalance: Math.round(totalBalance),
      totalInterestPaid: Math.round(totalInterest),
      principalPaid: Math.round(totalPaid - totalInterest),
    });
  }

  return {
    debtFreeMonths: month,
    totalInterestPaid: Math.round(totalInterest),
    totalPaid: Math.round(totalPaid),
    monthlySnapshots: snapshots,
    payoffOrder,
  };
}

export function calculateDebtPayoff(input: DebtPayoffInput): DebtPayoffResult {
  const { debts, extraMonthlyPayment = 0, lumpSumPayment = 0, strategy } = input;

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
  const monthlyInterestBurn = debts.reduce(
    (s, d) => s + (d.balance * d.interestRate) / 100 / 12,
    0,
  );

  const chosen = runSimulation(debts, extraMonthlyPayment, lumpSumPayment, strategy);
  const minimumOnly = runSimulation(debts, 0, 0, "minimum");

  const debtFreeDate = new Date();
  debtFreeDate.setMonth(debtFreeDate.getMonth() + chosen.debtFreeMonths);
  const debtFreeDateStr = debtFreeDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const interestSaved = Math.max(0, minimumOnly.totalInterestPaid - chosen.totalInterestPaid);
  const monthsSaved = Math.max(0, minimumOnly.debtFreeMonths - chosen.debtFreeMonths);

  return {
    debtFreeMonths: chosen.debtFreeMonths,
    debtFreeDate: debtFreeDateStr,
    totalInterestPaid: chosen.totalInterestPaid,
    totalPaid: chosen.totalPaid,
    totalDebt: Math.round(totalDebt),
    monthlyInterestBurn: Math.round(monthlyInterestBurn),
    payoffOrder: chosen.payoffOrder,
    monthlySnapshots: chosen.monthlySnapshots,
    minimumOnlyMonths: minimumOnly.debtFreeMonths,
    minimumOnlyInterest: minimumOnly.totalInterestPaid,
    interestSaved,
    monthsSaved,
  };
}
