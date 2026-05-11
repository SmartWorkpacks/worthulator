// ─── Rent vs Buy Calculator — Config & Calculation Engine ───────────────────
// Pure TypeScript — zero React / UI dependencies.
// All functions are deterministic and testable in isolation.

// ─── Config ──────────────────────────────────────────────────────────────────

export interface RentVsBuyConfig {
  defaults: {
    homePrice: number;
    monthlyRent: number;
    downPaymentPct: number;
    mortgageRate: number;
    loanTermYears: number;
    propertyTaxPct: number;
    homeInsurancePct: number;
    hoaMonthly: number;
    maintenancePct: number;
    homeAppreciationPct: number;
    rentIncreasePct: number;
    investmentReturnPct: number;
    yearsToStay: number;
    closingCostPct: number;
    sellingCostPct: number;
  };
  ranges: {
    homePrice: { min: number; max: number; step: number };
    monthlyRent: { min: number; max: number; step: number };
    downPaymentPct: { min: number; max: number; step: number };
    mortgageRate: { min: number; max: number; step: number };
    loanTermYears: { options: number[] };
    propertyTaxPct: { min: number; max: number; step: number };
    homeInsurancePct: { min: number; max: number; step: number };
    hoaMonthly: { min: number; max: number; step: number };
    maintenancePct: { min: number; max: number; step: number };
    homeAppreciationPct: { min: number; max: number; step: number };
    rentIncreasePct: { min: number; max: number; step: number };
    investmentReturnPct: { min: number; max: number; step: number };
    yearsToStay: { min: number; max: number; step: number };
    closingCostPct: { min: number; max: number; step: number };
    sellingCostPct: { min: number; max: number; step: number };
  };
}

export const rentVsBuyConfig: RentVsBuyConfig = {
  defaults: {
    homePrice: 400000,
    monthlyRent: 2000,
    downPaymentPct: 20,
    mortgageRate: 6.99,
    loanTermYears: 30,
    propertyTaxPct: 1.1,
    homeInsurancePct: 0.5,
    hoaMonthly: 0,
    maintenancePct: 1.0,
    homeAppreciationPct: 3.5,
    rentIncreasePct: 3.0,
    investmentReturnPct: 0,
    yearsToStay: 10,
    closingCostPct: 3.0,
    sellingCostPct: 6.0,
  },
  ranges: {
    homePrice: { min: 50000, max: 2000000, step: 5000 },
    monthlyRent: { min: 500, max: 10000, step: 50 },
    downPaymentPct: { min: 3, max: 50, step: 1 },
    mortgageRate: { min: 2.0, max: 12.0, step: 0.05 },
    loanTermYears: { options: [10, 15, 20, 25, 30] },
    propertyTaxPct: { min: 0.1, max: 3.5, step: 0.1 },
    homeInsurancePct: { min: 0.1, max: 2.0, step: 0.05 },
    hoaMonthly: { min: 0, max: 2000, step: 25 },
    maintenancePct: { min: 0.5, max: 3.0, step: 0.1 },
    homeAppreciationPct: { min: -2.0, max: 8.0, step: 0.1 },
    rentIncreasePct: { min: 0.0, max: 8.0, step: 0.1 },
    investmentReturnPct: { min: 0, max: 15.0, step: 0.5 },
    yearsToStay: { min: 1, max: 30, step: 1 },
    closingCostPct: { min: 1.0, max: 6.0, step: 0.25 },
    sellingCostPct: { min: 2.0, max: 10.0, step: 0.25 },
  },
};

// ─── Input / Output Types ─────────────────────────────────────────────────────

export interface RentVsBuyInputs {
  homePrice: number;
  monthlyRent: number;
  downPaymentPct: number;       // e.g. 20 → 20%
  mortgageRate: number;         // e.g. 6.99 → 6.99%
  loanTermYears: number;
  propertyTaxPct: number;       // annual % of home value
  homeInsurancePct: number;     // annual % of home value
  hoaMonthly: number;
  maintenancePct: number;       // annual % of home value
  homeAppreciationPct: number;  // annual %
  rentIncreasePct: number;      // annual %
  investmentReturnPct: number;  // annual %
  yearsToStay: number;
  closingCostPct: number;       // % of home price at purchase
  sellingCostPct: number;       // % of home value at sale
  rentStartingCapital?: number; // override for renter's lump sum (defaults to downPayment + closing)
  reinvestSavingsPct?: number;  // 0–100: % of monthly savings over buying the renter reinvests (0 = keep as cash)
}

/** One row in the year-by-year schedule */
export interface RentVsBuyYearRow {
  year: number;
  // Buying side
  homeValue: number;
  loanBalance: number;
  equity: number;
  cumulativeBuyingCost: number;   // all out-of-pocket costs (mortgage P+I+extras)
  cumulativeInterestPaid: number;
  buyNetWorth: number;            // equity − cumulative non-mortgage costs − remaining selling cost
  // Renting side
  monthlyRent: number;
  cumulativeRentPaid: number;
  rentInvestmentPortfolio: number; // down-payment + monthly savings invested
  rentNetWorth: number;            // portfolio value
  // Delta
  netWorthDelta: number;           // buyNetWorth − rentNetWorth (positive = buying ahead)
}

export interface RentVsBuySummary {
  // Break-even
  breakEvenYear: number | null;    // null = never breaks even within 30 yrs
  breakEvenMonth: number | null;   // fractional month estimate
  // At chosen yearsToStay
  buyNetWorth: number;
  rentNetWorth: number;
  netWorthDelta: number;           // positive = buying wins
  winner: "buy" | "rent" | "tie";
  // Buying totals
  downPayment: number;
  closingCostUpfront: number;
  totalMortgagePayments: number;
  totalInterestPaid: number;
  totalPropertyTax: number;
  totalInsurance: number;
  totalMaintenance: number;
  totalHoa: number;
  sellingCostAtExit: number;
  finalHomeValue: number;
  finalEquity: number;
  totalBuyingCostOfOwnership: number;  // every dollar out-of-pocket incl. down + closing
  // Renting totals
  totalRentPaid: number;
  finalInvestmentPortfolio: number;
  // Renter "what if invested?" overlay scenarios (always computed, revealed optionally in UI)
  renterMonthlySurplus: number;      // monthly amount renter saves vs buying (0 if renting costs more)
  renterDisciplinedNetWorth: number; // deposit + monthly surplus invested at investmentReturnPct
  renterAggressiveNetWorth: number;  // deposit + monthly surplus invested at investmentReturnPct + 3%
  willReinvest: boolean;             // true when reinvestSavingsPct > 0
  reinvestSavingsPct: number;        // 0–100 as entered by user
  // Schedule
  schedule: RentVsBuyYearRow[];
  // Monthly snapshot (year 1)
  monthlyMortgagePI: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyMaintenance: number;
  totalMonthlyBuying: number;
  monthlySavingsVsRent: number;   // (totalMonthlyBuying − monthlyRent): positive = buying costs more
  totalInsuranceAndHoa: number;
}

// ─── Core helpers ─────────────────────────────────────────────────────────────

/** Standard amortisation monthly P+I payment */
export function calcMonthlyMortgage(
  loanAmount: number,
  annualRatePct: number,
  termYears: number,
): number {
  if (loanAmount <= 0 || annualRatePct <= 0) return loanAmount / (termYears * 12);
  const r = annualRatePct / 100 / 12;
  const n = termYears * 12;
  return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/** Remaining loan balance after `monthsPaid` payments */
function loanBalance(
  principal: number,
  annualRatePct: number,
  termYears: number,
  monthsPaid: number,
): number {
  if (annualRatePct <= 0) return Math.max(0, principal - (principal / (termYears * 12)) * monthsPaid);
  const r = annualRatePct / 100 / 12;
  const n = termYears * 12;
  const p = Math.pow(1 + r, n);
  const m = Math.pow(1 + r, monthsPaid);
  return principal * ((p - m) / (p - 1));
}

/** Compound growth: value × (1 + rate)^years */
function grow(value: number, annualRatePct: number, years: number): number {
  return value * Math.pow(1 + annualRatePct / 100, years);
}

/** Future value of a series of growing monthly payments invested at a rate.
 *  Each month: payment grows by monthlyGrowthRate, invested at monthlyInvestRate.
 *  Uses the growing annuity FV formula approximated month-by-month for accuracy.
 */
function growingAnnuityFV(
  initialMonthlyPayment: number,
  annualPaymentGrowthPct: number,
  annualInvestReturnPct: number,
  months: number,
): number {
  const g = annualPaymentGrowthPct / 100 / 12;
  const r = annualInvestReturnPct / 100 / 12;
  let fv = 0;
  let payment = initialMonthlyPayment;
  for (let m = 0; m < months; m++) {
    fv = (fv + payment) * (1 + r);
    if (m > 0 && m % 12 === 11) payment *= 1 + annualPaymentGrowthPct / 100; // grow annually
  }
  return fv;
}

// ─── Main calculation function ────────────────────────────────────────────────

export function calcRentVsBuy(inputs: RentVsBuyInputs): RentVsBuySummary {
  const {
    homePrice,
    monthlyRent,
    downPaymentPct,
    mortgageRate,
    loanTermYears,
    propertyTaxPct,
    homeInsurancePct,
    hoaMonthly,
    maintenancePct,
    homeAppreciationPct,
    rentIncreasePct,
    investmentReturnPct,
    yearsToStay,
    closingCostPct,
    sellingCostPct,
  } = inputs;

  // ── Upfront buying costs ──────────────────────────────────────────────────
  const downPayment = (homePrice * downPaymentPct) / 100;
  const loanAmount = homePrice - downPayment;
  const closingCostUpfront = (homePrice * closingCostPct) / 100;
  const totalUpfront = downPayment + closingCostUpfront;

  // ── Monthly buying costs (year 1) ─────────────────────────────────────────
  const monthlyMortgagePI = calcMonthlyMortgage(loanAmount, mortgageRate, loanTermYears);
  const monthlyPropertyTax = (homePrice * propertyTaxPct) / 100 / 12;
  const monthlyInsurance = (homePrice * homeInsurancePct) / 100 / 12;
  const monthlyMaintenance = (homePrice * maintenancePct) / 100 / 12;
  const totalMonthlyBuying =
    monthlyMortgagePI + monthlyPropertyTax + monthlyInsurance + hoaMonthly + monthlyMaintenance;

  // ── Renter's investable monthly savings ───────────────────────────────────
  // Renter invests down payment + closing costs immediately, then invests the
  // monthly difference between buying cost and rent (if buying costs more).
  // If rent costs more, the buyer invests the difference.
  const monthlySavingsVsRent = totalMonthlyBuying - monthlyRent; // positive = buying costs more → renter invests diff
  const renterMonthlyInvestment = Math.max(0, monthlySavingsVsRent);
  const buyerMonthlyInvestment = Math.max(0, -monthlySavingsVsRent);

  // Allow user to override the renter's starting lump sum (defaults to deposit only)
  const renterLumpSum = inputs.rentStartingCapital ?? downPayment;

  // Reinvestment settings: how much of the monthly surplus the renter invests
  const reinvestSavingsPct = inputs.reinvestSavingsPct ?? 0; // 0–100
  const willReinvest = reinvestSavingsPct > 0 && renterMonthlyInvestment > 0;

  // Base return for the renter's lump sum (down payment + closing costs held in cash/savings).
  // Uses the long-run average savings account rate rather than today's elevated HYSA rate,
  // since this needs to hold over 5–30 year horizons.
  const SAVINGS_FLOOR_PCT = 2; // % — long-term average standard savings account
  const baseReturnPct = investmentReturnPct > 0 ? investmentReturnPct : SAVINGS_FLOOR_PCT;

  // Rate to use for reinvested monthly savings: user's investmentReturnPct if set, else 7%
  const reinvestRate = investmentReturnPct > 0 ? investmentReturnPct : 7;

  // ─── Year-by-year schedule (up to max of yearsToStay or 30 for chart) ────
  const maxYears = Math.max(yearsToStay, 30);
  const schedule: RentVsBuyYearRow[] = [];

  let cumulativeBuyingCost = totalUpfront; // tracks all money ever spent on buying path
  let cumulativeInterestPaid = 0;
  let cumulativeRentPaid = 0;
  let cumulativePropTax = 0;
  let cumulativeInsurance = 0;
  let cumulativeMaintenance = 0;
  let cumulativeHoa = 0;
  // Running reinvested-savings portfolio — grows each year using that year's rent-adjusted surplus.
  // When rent exceeds buying cost, surplusThisYear becomes 0 so contributions simply stop —
  // no additional penalty is applied; the existing portfolio continues compounding.
  let reinvestedPortfolio = 0;

  let currentRent = monthlyRent;
  // Property-related costs grow with appreciation (simplified: tax on current value)

  let breakEvenYear: number | null = null;
  let breakEvenMonth: number | null = null;
  let prevBuyNetWorth = 0;
  let prevRentNetWorth = 0;

  for (let yr = 1; yr <= maxYears; yr++) {
    const monthsElapsed = yr * 12;

    // ── Home value ─────────────────────────────────────────────────────────
    const homeValue = grow(homePrice, homeAppreciationPct, yr);
    const remainingLoan = yr <= loanTermYears
      ? Math.max(0, loanBalance(loanAmount, mortgageRate, loanTermYears, monthsElapsed))
      : 0;
    const equity = homeValue - remainingLoan;

    // ── Selling cost at this year (only realised if they sell) ─────────────
    const sellingCostAtYear = (homeValue * sellingCostPct) / 100;

    // ── Cumulative costs (year-over-year deltas) ───────────────────────────
    // Interest paid this year
    const balancePrev = yr <= loanTermYears && yr > 1
      ? Math.max(0, loanBalance(loanAmount, mortgageRate, loanTermYears, (yr - 1) * 12))
      : yr === 1 ? loanAmount : 0;
    const balanceCurr = remainingLoan;
    const principalPaidThisYear = Math.max(0, balancePrev - balanceCurr);
    const mortgagePaymentsThisYear = monthlyMortgagePI * 12;
    const interestThisYear = yr <= loanTermYears
      ? Math.max(0, mortgagePaymentsThisYear - principalPaidThisYear)
      : 0;
    cumulativeInterestPaid += interestThisYear;

    // Property tax, insurance, maintenance grow with home value
    const currentHomeValue = homeValue;
    const propTaxThisYear = (currentHomeValue * propertyTaxPct) / 100;
    const insuranceThisYear = (currentHomeValue * homeInsurancePct) / 100;
    const maintenanceThisYear = (currentHomeValue * maintenancePct) / 100;
    const hoaThisYear = hoaMonthly * 12;

    cumulativePropTax += propTaxThisYear;
    cumulativeInsurance += insuranceThisYear;
    cumulativeMaintenance += maintenanceThisYear;
    cumulativeHoa += hoaThisYear;

    // Total out-of-pocket for buyer this year (mortgage + running costs)
    const buyingCostThisYear =
      (yr <= loanTermYears ? mortgagePaymentsThisYear : 0) +
      propTaxThisYear +
      insuranceThisYear +
      maintenanceThisYear +
      hoaThisYear;
    cumulativeBuyingCost += buyingCostThisYear - (yr === 1 ? 0 : 0); // already added upfront in init

    // Adjust: upfront was added to cumulativeBuyingCost at init, so just add annual running costs
    // Reset approach: track separately
    // ─ Re-derive cleanly ─
    const totalMortgagePayments = yr <= loanTermYears
      ? monthlyMortgagePI * 12 * Math.min(yr, loanTermYears)
      : monthlyMortgagePI * 12 * loanTermYears;

    // ── Buyer's net worth at this year ─────────────────────────────────────
    // equity minus selling costs only — monthly cost differences shown separately
    const buyNetWorth = equity - sellingCostAtYear;

    // ── Renter's portfolio at this year ───────────────────────────────────
    // Current year's rent (rises with inflation each year)
    const currentYearRent = monthlyRent * Math.pow(1 + rentIncreasePct / 100, yr - 1);
    // Monthly surplus the renter can invest: positive only when buying costs more than renting.
    // When rent overtakes buying cost, surplusThisYear = 0 — contributions stop naturally.
    // No additional penalty is applied; the portfolio simply receives no new contributions.
    const surplusThisYear = Math.max(0, totalMonthlyBuying - currentYearRent);
    // Reinvested amount this year (only when willReinvest and there is a surplus)
    const monthlyReinvestedThisYear = willReinvest ? surplusThisYear * (reinvestSavingsPct / 100) : 0;
    // Compound the reinvested portfolio for one more year, then add this year's contributions
    const mRate = reinvestRate / 100 / 12;
    reinvestedPortfolio = reinvestedPortfolio * Math.pow(1 + reinvestRate / 100, 1)
      + (mRate > 0
          ? monthlyReinvestedThisYear * (Math.pow(1 + mRate, 12) - 1) / mRate
          : monthlyReinvestedThisYear * 12);

    // Lump sum (down payment) grows at baseReturnPct — long-term average savings account rate.
    const lumpSumGrown = grow(renterLumpSum, baseReturnPct, yr);
    const rentPortfolioValue = lumpSumGrown + reinvestedPortfolio;

    // ── Cumulative rent paid ───────────────────────────────────────────────
    // Rent grows annually — sum each year's rent
    let totalRentThisPath = 0;
    let tempRent = monthlyRent;
    for (let r = 1; r <= yr; r++) {
      totalRentThisPath += tempRent * 12;
      tempRent *= 1 + rentIncreasePct / 100;
    }
    cumulativeRentPaid = totalRentThisPath;

    const rentNetWorth = rentPortfolioValue;
    const netWorthDelta = buyNetWorth - rentNetWorth;

    // ── Break-even detection ──────────────────────────────────────────────
    if (breakEvenYear === null && yr > 1) {
      if (
        (prevBuyNetWorth <= prevRentNetWorth && buyNetWorth > rentNetWorth) ||
        (prevBuyNetWorth >= prevRentNetWorth && buyNetWorth < rentNetWorth && yr === 2)
      ) {
        breakEvenYear = yr;
        // Linear interpolation to estimate fractional month
        const delta0 = prevBuyNetWorth - prevRentNetWorth;
        const delta1 = buyNetWorth - rentNetWorth;
        const fraction = delta0 / (delta0 - delta1); // 0–1
        breakEvenMonth = Math.round((yr - 1 + fraction) * 12);
      }
    }

    prevBuyNetWorth = buyNetWorth;
    prevRentNetWorth = rentNetWorth;

    schedule.push({
      year: yr,
      homeValue: Math.round(homeValue),
      loanBalance: Math.round(remainingLoan),
      equity: Math.round(equity),
      cumulativeBuyingCost: Math.round(
        totalUpfront +
          (yr <= loanTermYears ? monthlyMortgagePI * 12 * yr : monthlyMortgagePI * 12 * loanTermYears) +
          cumulativePropTax +
          cumulativeInsurance +
          cumulativeMaintenance +
          cumulativeHoa,
      ),
      cumulativeInterestPaid: Math.round(cumulativeInterestPaid),
      buyNetWorth: Math.round(buyNetWorth),
      monthlyRent: Math.round(currentYearRent),
      cumulativeRentPaid: Math.round(cumulativeRentPaid),
      rentInvestmentPortfolio: Math.round(rentPortfolioValue),
      rentNetWorth: Math.round(rentNetWorth),
      netWorthDelta: Math.round(netWorthDelta),
    });
  }

  // ── At chosen yearsToStay ─────────────────────────────────────────────────
  const atYear = schedule[yearsToStay - 1] ?? schedule[schedule.length - 1];
  const finalHomeValue = atYear.homeValue;
  const finalEquity = atYear.equity;
  const sellingCostAtExit = (finalHomeValue * sellingCostPct) / 100;
  const buyNetWorthAtExit = atYear.buyNetWorth;
  const rentNetWorthAtExit = atYear.rentNetWorth;
  const netWorthDeltaAtExit = buyNetWorthAtExit - rentNetWorthAtExit;

  const winner: "buy" | "rent" | "tie" =
    Math.abs(netWorthDeltaAtExit) < 1000
      ? "tie"
      : netWorthDeltaAtExit > 0
      ? "buy"
      : "rent";

  // ── Total rent paid at chosen years ──────────────────────────────────────
  let totalRentPaid = 0;
  let tempRent = monthlyRent;
  for (let r = 1; r <= yearsToStay; r++) {
    totalRentPaid += tempRent * 12;
    tempRent *= 1 + rentIncreasePct / 100;
  }

  // ── Totals for buying ─────────────────────────────────────────────────────
  const totalMortgagePayments =
    monthlyMortgagePI * 12 * Math.min(yearsToStay, loanTermYears);
  const totalInterestPaid = atYear.cumulativeInterestPaid;

  // Prop tax, insurance, maintenance — from schedule
  let totalPropertyTax = 0;
  let totalInsurance = 0;
  let totalMaintenance = 0;
  let totalHoa = 0;
  for (let i = 0; i < yearsToStay; i++) {
    const row = schedule[i];
    if (!row) break;
    const hv = row.homeValue;
    totalPropertyTax += (hv * propertyTaxPct) / 100;
    totalInsurance += (hv * homeInsurancePct) / 100;
    totalMaintenance += (hv * maintenancePct) / 100;
    totalHoa += hoaMonthly * 12;
  }

  const totalBuyingCostOfOwnership =
    totalUpfront +
    totalMortgagePayments +
    totalPropertyTax +
    totalInsurance +
    totalMaintenance +
    totalHoa +
    sellingCostAtExit;

  // ── Renter "what if invested?" overlay scenarios ──────────────────────────
  // Monthly surplus the renter saves vs buying (year-1 figure, conservative)
  const renterMonthlySurplus = Math.max(0, monthlySavingsVsRent);
  const n = yearsToStay * 12;

  // Disciplined: deposit + monthly surplus invested at 7%
  const disciplinedRate = 7;
  const renterDisciplinedNetWorth =
    grow(renterLumpSum, disciplinedRate, yearsToStay) +
    (renterMonthlySurplus > 0
      ? growingAnnuityFV(renterMonthlySurplus, 0, disciplinedRate, n)
      : 0);

  // Aggressive: deposit + monthly surplus invested at 10%
  const aggressiveRate = 10;
  const renterAggressiveNetWorth =
    grow(renterLumpSum, aggressiveRate, yearsToStay) +
    (renterMonthlySurplus > 0
      ? growingAnnuityFV(renterMonthlySurplus, 0, aggressiveRate, n)
      : 0);

  return {
    breakEvenYear,
    breakEvenMonth,
    buyNetWorth: buyNetWorthAtExit,
    rentNetWorth: rentNetWorthAtExit,
    netWorthDelta: netWorthDeltaAtExit,
    winner,
    downPayment,
    closingCostUpfront,
    totalMortgagePayments,
    totalInterestPaid,
    totalPropertyTax,
    totalInsurance,
    totalMaintenance,
    totalHoa,
    sellingCostAtExit,
    finalHomeValue,
    finalEquity,
    totalBuyingCostOfOwnership,
    totalRentPaid,
    finalInvestmentPortfolio: atYear.rentInvestmentPortfolio,
    renterMonthlySurplus,
    renterDisciplinedNetWorth: Math.round(renterDisciplinedNetWorth),
    renterAggressiveNetWorth: Math.round(renterAggressiveNetWorth),
    willReinvest,
    reinvestSavingsPct,
    schedule,
    monthlyMortgagePI,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyHoa: hoaMonthly,
    monthlyMaintenance,
    totalMonthlyBuying,
    monthlySavingsVsRent,
    totalInsuranceAndHoa: totalInsurance + totalHoa,
  };
}

// ─── Key findings generator ───────────────────────────────────────────────────
// Derives strictly factual, verifiable data points from the calculated output.
// No inference, no hedging — every sentence maps directly to a computed figure.

export interface RentVsBuyInsight {
  type: "positive" | "warning" | "neutral";
  text: string;
}

export function generateKeyFindings(
  inputs: RentVsBuyInputs,
  summary: RentVsBuySummary,
): RentVsBuyInsight[] {
  const findings: RentVsBuyInsight[] = [];

  // Formats dollar amounts correctly at any scale, including small monthly figures
  const fmtAmt = (n: number): string => {
    const abs = Math.abs(n);
    if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 10_000)    return `$${Math.round(abs / 1_000)}k`;
    return `$${Math.round(abs).toLocaleString()}`;
  };

  // ── 1. Net worth outcome — the single most important number ──────────────
  const gap = Math.abs(summary.netWorthDelta);
  if (summary.winner === "buy") {
    findings.push({
      type: "positive",
      text: `${fmtAmt(gap)} more wealth from buying — buying path ends at ${fmtAmt(summary.buyNetWorth)} vs renting path at ${fmtAmt(summary.rentNetWorth)} after ${inputs.yearsToStay} years.`,
    });
  } else if (summary.winner === "rent") {
    findings.push({
      type: "warning",
      text: `${fmtAmt(gap)} more wealth from renting — renting path ends at ${fmtAmt(summary.rentNetWorth)} vs buying path at ${fmtAmt(summary.buyNetWorth)} after ${inputs.yearsToStay} years.`,
    });
  } else {
    findings.push({
      type: "neutral",
      text: `Both paths end within ${fmtAmt(gap)} of each other after ${inputs.yearsToStay} years — buying: ${fmtAmt(summary.buyNetWorth)}, renting: ${fmtAmt(summary.rentNetWorth)}.`,
    });
  }

  // ── 2. Break-even / crossover ─────────────────────────────────────────────
  if (summary.breakEvenYear !== null) {
    if (summary.breakEvenYear <= inputs.yearsToStay) {
      findings.push({
        type: "positive",
        text: `Year ${summary.breakEvenYear} crossover — buying overtakes renting at this point, which is within your ${inputs.yearsToStay}-year timeline.`,
      });
    } else {
      findings.push({
        type: "warning",
        text: `Year ${summary.breakEvenYear} crossover — buying doesn't overtake renting until after your ${inputs.yearsToStay}-year plan ends.`,
      });
    }
  } else if (summary.winner === "buy") {
    findings.push({
      type: "positive",
      text: `Buying leads from year one and stays ahead for the entire ${inputs.yearsToStay}-year period.`,
    });
  } else if (summary.winner === "rent") {
    findings.push({
      type: "warning",
      text: `Renting leads from year one and stays ahead for the entire ${inputs.yearsToStay}-year period.`,
    });
  }

  // ── 3. Year-one monthly cost comparison ───────────────────────────────────
  const monthly = Math.round(Math.abs(summary.monthlySavingsVsRent));
  if (monthly > 50) {
    if (summary.monthlySavingsVsRent > 0) {
      findings.push({
        type: "warning",
        text: `${fmtAmt(monthly)}/month more to buy in year one — mortgage plus costs exceed the ${fmtAmt(inputs.monthlyRent)} rent by this amount.`,
      });
    } else {
      findings.push({
        type: "positive",
        text: `${fmtAmt(monthly)}/month cheaper to buy in year one — mortgage is below the ${fmtAmt(inputs.monthlyRent)} rent from the start.`,
      });
    }
  }

  // ── 4. Contextual finding — interest burden or short-stay upfront cost ────
  if (inputs.yearsToStay <= 4) {
    const upfront = summary.downPayment + summary.closingCostUpfront;
    findings.push({
      type: "warning",
      text: `${fmtAmt(upfront)} committed upfront (down payment + closing costs) over just ${inputs.yearsToStay} year${inputs.yearsToStay === 1 ? "" : "s"} — a short hold makes this harder to recover through equity.`,
    });
  } else if (summary.totalInterestPaid > 10_000) {
    const pct = Math.round((summary.totalInterestPaid / inputs.homePrice) * 100);
    findings.push({
      type: "neutral",
      text: `${fmtAmt(summary.totalInterestPaid)} paid in mortgage interest over ${inputs.yearsToStay} years — ${pct}% of the ${fmtAmt(inputs.homePrice)} purchase price.`,
    });
  }

  return findings.slice(0, 4);
}
