export type VehicleCondition = "new" | "used";

export interface CarPaymentInputs {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxPct: number; // sales/use tax rate applied to the purchase
  aprPct: number; // annual percentage rate on the loan
  termMonths: number; // loan term
}

export interface CarPaymentSchedulePoint {
  month: number;
  balance: number;
  interestPaid: number; // cumulative interest to this month
}

export interface CarPaymentResult {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxPct: number;
  salesTax: number;
  aprPct: number;
  termMonths: number;
  amountFinanced: number;
  monthlyPayment: number;
  totalLoanPaid: number; // monthlyPayment × term
  totalInterest: number;
  totalCost: number; // vehiclePrice + salesTax + totalInterest
  schedule: CarPaymentSchedulePoint[];
  breakdown: { label: string; amount: number; colorClass: string }[];
}

function safeNum(n: number, fallback = 0) {
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// Monthly payment per the standard amortization formula.
function amortizedPayment(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate <= 0) return principal / months;
  const pow = Math.pow(1 + monthlyRate, -months);
  return (principal * monthlyRate) / (1 - pow);
}

export function calculateCarPayment(input: CarPaymentInputs): CarPaymentResult {
  const vehiclePrice = Math.max(0, safeNum(input.vehiclePrice));
  const downPayment = Math.max(0, safeNum(input.downPayment));
  const tradeInValue = Math.max(0, safeNum(input.tradeInValue));
  const salesTaxPct = clamp(safeNum(input.salesTaxPct), 0, 25);
  const aprPct = clamp(safeNum(input.aprPct), 0, 40);
  const termMonths = clamp(Math.round(safeNum(input.termMonths)), 1, 120);

  // Most states tax the price net of the trade-in credit.
  const taxableBase = Math.max(0, vehiclePrice - tradeInValue);
  const salesTax = taxableBase * (salesTaxPct / 100);

  const amountFinanced = Math.max(0, vehiclePrice + salesTax - downPayment - tradeInValue);
  const monthlyRate = aprPct / 100 / 12;
  const monthlyPayment = amortizedPayment(amountFinanced, monthlyRate, termMonths);
  const totalLoanPaid = monthlyPayment * termMonths;
  const totalInterest = Math.max(0, totalLoanPaid - amountFinanced);
  const totalCost = vehiclePrice + salesTax + totalInterest;

  // Amortization schedule (loan balance declining to ~0).
  const schedule: CarPaymentSchedulePoint[] = [{ month: 0, balance: round2(amountFinanced), interestPaid: 0 }];
  let balance = amountFinanced;
  let cumulativeInterest = 0;
  for (let m = 1; m <= termMonths; m++) {
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(balance, monthlyPayment - interest);
    cumulativeInterest += interest;
    balance = Math.max(0, balance - principalPaid);
    schedule.push({ month: m, balance: round2(balance), interestPaid: round2(cumulativeInterest) });
  }

  return {
    vehiclePrice: round2(vehiclePrice),
    downPayment: round2(downPayment),
    tradeInValue: round2(tradeInValue),
    salesTaxPct: round2(salesTaxPct),
    salesTax: round2(salesTax),
    aprPct: round2(aprPct),
    termMonths,
    amountFinanced: round2(amountFinanced),
    monthlyPayment: round2(monthlyPayment),
    totalLoanPaid: round2(totalLoanPaid),
    totalInterest: round2(totalInterest),
    totalCost: round2(totalCost),
    schedule,
    breakdown: [
      { label: "Vehicle price", amount: round2(vehiclePrice), colorClass: "bg-blue-400" },
      { label: "Sales tax", amount: round2(salesTax), colorClass: "bg-amber-400" },
      { label: "Interest", amount: round2(totalInterest), colorClass: "bg-rose-400" },
    ],
  };
}
