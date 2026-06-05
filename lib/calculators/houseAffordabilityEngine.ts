export interface HouseAffordabilityInputs {
  annualIncome: number; // gross household income
  monthlyDebts: number; // recurring non-housing debt payments (car, student, cards)
  downPayment: number; // cash toward the purchase
  mortgageRatePct: number; // annual mortgage rate (live default, user-editable)
  termYears: number; // loan term
  propertyTaxRatePct: number; // annual property tax as % of home value
  insuranceAnnual: number; // homeowner's insurance, $/year
  hoaMonthly: number; // HOA dues, $/month
  frontDtiPct: number; // housing-to-income cap (front-end ratio)
  backDtiPct: number; // total-debt-to-income cap (back-end ratio)
}

export interface HouseAffordabilityResult {
  maxHomePrice: number;
  loanAmount: number;
  downPayment: number;
  monthlyIncome: number;
  maxHousingBudget: number; // PITI + HOA the ratios allow
  monthlyPayment: number; // actual PITI + HOA at the max price
  principalInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  frontCap: number;
  backCap: number;
  bindingConstraint: "front" | "back";
  frontDtiPct: number;
  backDtiPct: number;
  mortgageRatePct: number;
  breakdown: { label: string; amount: number; colorClass: string }[];
  rateImpact: { ratePct: number; maxHomePrice: number }[];
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

// Monthly principal-and-interest factor per $1 of loan (standard amortization).
function piFactor(monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate <= 0) return 1 / months;
  const pow = Math.pow(1 + monthlyRate, -months);
  return monthlyRate / (1 - pow);
}

// Solve the max home price for a given mortgage rate, holding everything else fixed.
function maxPriceForRate(
  ratePct: number,
  ctx: {
    maxHousingBudget: number;
    downPayment: number;
    termMonths: number;
    insuranceAnnual: number;
    hoaMonthly: number;
    taxFactor: number;
  },
): { price: number; loan: number; factor: number } {
  const monthlyRate = ratePct / 100 / 12;
  const factor = piFactor(monthlyRate, ctx.termMonths);
  const available = ctx.maxHousingBudget - ctx.insuranceAnnual / 12 - ctx.hoaMonthly;
  // available = (H - D)*factor + H*taxFactor  ⇒  H = (available + D*factor) / (factor + taxFactor)
  const denom = factor + ctx.taxFactor;
  let price = denom > 0 ? (available + ctx.downPayment * factor) / denom : ctx.downPayment;
  // You can always buy at least what your cash covers; price never goes below the down payment.
  price = Math.max(price, ctx.downPayment);
  const loan = Math.max(0, price - ctx.downPayment);
  return { price, loan, factor };
}

export function calculateHouseAffordability(input: HouseAffordabilityInputs): HouseAffordabilityResult {
  const annualIncome = Math.max(0, safeNum(input.annualIncome));
  const monthlyDebts = Math.max(0, safeNum(input.monthlyDebts));
  const downPayment = Math.max(0, safeNum(input.downPayment));
  const mortgageRatePct = clamp(safeNum(input.mortgageRatePct), 0, 25);
  const termYears = clamp(Math.round(safeNum(input.termYears)), 1, 40);
  const propertyTaxRatePct = clamp(safeNum(input.propertyTaxRatePct), 0, 10);
  const insuranceAnnual = Math.max(0, safeNum(input.insuranceAnnual));
  const hoaMonthly = Math.max(0, safeNum(input.hoaMonthly));
  const frontDtiPct = clamp(safeNum(input.frontDtiPct, 28), 1, 60);
  const backDtiPct = clamp(safeNum(input.backDtiPct, 36), 1, 60);

  const termMonths = termYears * 12;
  const monthlyIncome = annualIncome / 12;
  const taxFactor = propertyTaxRatePct / 100 / 12;

  const frontCap = monthlyIncome * (frontDtiPct / 100);
  const backCap = monthlyIncome * (backDtiPct / 100) - monthlyDebts;
  const maxHousingBudget = Math.max(0, Math.min(frontCap, backCap));
  const bindingConstraint: "front" | "back" = frontCap <= backCap ? "front" : "back";

  const ctx = { maxHousingBudget, downPayment, termMonths, insuranceAnnual, hoaMonthly, taxFactor };
  const { price, loan, factor } = maxPriceForRate(mortgageRatePct, ctx);

  const principalInterest = loan * factor;
  const monthlyPropertyTax = price * taxFactor;
  const monthlyInsurance = insuranceAnnual / 12;
  const monthlyPayment = principalInterest + monthlyPropertyTax + monthlyInsurance + hoaMonthly;

  // Rate-sensitivity band: how the max price moves with the mortgage rate.
  const ratePoints = [
    mortgageRatePct - 2,
    mortgageRatePct - 1,
    mortgageRatePct - 0.5,
    mortgageRatePct,
    mortgageRatePct + 0.5,
    mortgageRatePct + 1,
    mortgageRatePct + 2,
  ].filter((r) => r >= 0);
  const rateImpact = Array.from(new Set(ratePoints.map((r) => round2(r)))).map((r) => ({
    ratePct: r,
    maxHomePrice: round2(maxPriceForRate(r, ctx).price),
  }));

  return {
    maxHomePrice: round2(price),
    loanAmount: round2(loan),
    downPayment: round2(downPayment),
    monthlyIncome: round2(monthlyIncome),
    maxHousingBudget: round2(maxHousingBudget),
    monthlyPayment: round2(monthlyPayment),
    principalInterest: round2(principalInterest),
    monthlyPropertyTax: round2(monthlyPropertyTax),
    monthlyInsurance: round2(monthlyInsurance),
    monthlyHoa: round2(hoaMonthly),
    frontCap: round2(frontCap),
    backCap: round2(Math.max(0, backCap)),
    bindingConstraint,
    frontDtiPct: round2(frontDtiPct),
    backDtiPct: round2(backDtiPct),
    mortgageRatePct: round2(mortgageRatePct),
    breakdown: [
      { label: "Principal & interest", amount: round2(principalInterest), colorClass: "bg-blue-400" },
      { label: "Property tax", amount: round2(monthlyPropertyTax), colorClass: "bg-amber-400" },
      { label: "Insurance", amount: round2(monthlyInsurance), colorClass: "bg-violet-400" },
      { label: "HOA", amount: round2(hoaMonthly), colorClass: "bg-emerald-400" },
    ],
    rateImpact,
  };
}
