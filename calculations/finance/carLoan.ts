// ─── Car Loan — Pure Calculation Module ──────────────────────────────────────
//
// TWO live-data layers injected via `data`:
//   1. APR default — FRED auto-loan rate (new/used)
//   2. State sales tax rate — salesTaxRates dataset
//
// Real-world accuracy details most calculators miss:
//   - Sales tax applies to the vehicle price MINUS the trade-in in ~42 states
//     (the trade-in credit reduces the taxable base).
//   - The financed amount is the OUT-THE-DOOR price (incl. tax) minus down and
//     trade-in — so tax is itself financed and accrues interest.
//
// Result assignable to CalculatorOutputs (index signature present).
//
// ─────────────────────────────────────────────────────────────────────────────

export interface CarLoanInputs {
  vehiclePrice: number;
  downPayment: number;
  tradeIn: number;
  interestRate: number;
  termMonths: number;
  state: string;
}

export interface CarLoanData {
  /** Combined state sales tax rate (%) for the selected state. */
  salesTaxRate: number;
  /** Whether the trade-in reduces the taxable base in this state. */
  tradeInReducesTax: boolean;
}

export interface CarLoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  interestPct: number;
  loanAmount: number;
  salesTax: number;
  outTheDoorPrice: number;
  downPaymentRatio: number;
  annualPaymentBurden: number;
  taxFinancedInterest: number;
  [key: string]: number;
}

/** Standard amortized monthly payment. */
function amortize(principal: number, annualRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1);
}

export function calculateCarLoan(
  inputs: CarLoanInputs,
  data: CarLoanData,
): CarLoanResult {
  const price = Math.max(0, inputs.vehiclePrice);
  const down = Math.max(0, inputs.downPayment);
  const tradeIn = Math.max(0, inputs.tradeIn);
  const term = inputs.termMonths;

  // ── Layer 2: sales tax (trade-in reduces base in most states) ──
  const taxableBase = data.tradeInReducesTax
    ? Math.max(0, price - tradeIn)
    : price;
  const salesTax = Math.round(taxableBase * (data.salesTaxRate / 100));
  const outTheDoorPrice = price + salesTax;

  // Amount financed = out-the-door price minus cash down and trade-in value.
  const loanAmount = Math.max(0, outTheDoorPrice - down - tradeIn);

  const monthlyPayment = Math.round(amortize(loanAmount, inputs.interestRate, term) * 100) / 100;
  const totalLoanPaid = monthlyPayment * term;
  const totalInterest = Math.max(0, Math.round((totalLoanPaid - loanAmount) * 100) / 100);

  // Cash out of pocket over the life of the deal (trade-in is a non-cash asset swap).
  const totalCost = Math.round((down + totalLoanPaid) * 100) / 100;
  const interestPct = totalCost > 0 ? Math.round((totalInterest / totalCost) * 1000) / 10 : 0;

  const downPaymentRatio = price > 0 ? Math.round((down / price) * 1000) / 10 : 0;
  const annualPaymentBurden = Math.round(monthlyPayment * 12);

  // Interest attributable specifically to financing the sales tax.
  const taxFinancedInterest =
    loanAmount > 0
      ? Math.round((totalInterest * (salesTax / loanAmount)) * 100) / 100
      : 0;

  return {
    monthlyPayment,
    totalInterest,
    totalCost,
    interestPct,
    loanAmount,
    salesTax,
    outTheDoorPrice,
    downPaymentRatio,
    annualPaymentBurden,
    taxFinancedInterest,
  };
}
