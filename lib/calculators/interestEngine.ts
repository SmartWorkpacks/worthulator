export type InterestMode = "simple" | "compound";
export type CompoundFrequency = "annually" | "semiannually" | "quarterly" | "monthly" | "daily";

export interface InterestInputs {
  mode: InterestMode;
  principal: number; // starting amount
  annualRatePct: number; // nominal annual rate, user-supplied
  years: number; // term
  compounding: CompoundFrequency; // compound mode only
  monthlyContribution: number; // optional recurring deposit (end of month)
}

export interface InterestSchedulePoint {
  year: number;
  balance: number;
  deposited: number; // cumulative principal + contributions
  interest: number; // cumulative interest
}

export interface InterestResult {
  mode: InterestMode;
  finalBalance: number;
  totalPrincipal: number;
  totalContributions: number;
  totalDeposited: number;
  totalInterest: number;
  effectiveAnnualRatePct: number; // APY
  schedule: InterestSchedulePoint[];
  breakdown: { label: string; amount: number; colorClass: string }[];
}

const FREQUENCY_N: Record<CompoundFrequency, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

function safeNum(n: number, fallback = 0) {
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function calculateInterest(input: InterestInputs): InterestResult {
  const principal = Math.max(0, safeNum(input.principal));
  const annualRatePct = clamp(safeNum(input.annualRatePct), 0, 1000);
  const years = clamp(safeNum(input.years), 0, 100);
  const monthlyContribution = Math.max(0, safeNum(input.monthlyContribution));
  const r = annualRatePct / 100;
  const months = Math.round(years * 12);

  // Effective monthly rate.
  const n = FREQUENCY_N[input.compounding] ?? 12;
  const monthlyRate = input.mode === "compound" ? Math.pow(1 + r / n, n / 12) - 1 : r / 12;

  const schedule: InterestSchedulePoint[] = [
    { year: 0, balance: round2(principal), deposited: round2(principal), interest: 0 },
  ];

  let balance = principal;
  let deposited = principal;
  let simpleInterest = 0;

  for (let m = 1; m <= months; m++) {
    if (input.mode === "compound") {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    } else {
      // Simple interest accrues on the deposited base; it does not compound.
      simpleInterest += deposited * (r / 12);
      balance = deposited + monthlyContribution + simpleInterest;
    }
    deposited += monthlyContribution;

    if (m % 12 === 0 || m === months) {
      const interest = balance - deposited;
      schedule.push({
        year: Math.round((m / 12) * 100) / 100,
        balance: round2(balance),
        deposited: round2(deposited),
        interest: round2(interest),
      });
    }
  }

  const totalContributions = monthlyContribution * months;
  const totalDeposited = principal + totalContributions;
  const finalBalance = balance;
  const totalInterest = finalBalance - totalDeposited;

  const effectiveAnnualRatePct =
    input.mode === "compound" ? (Math.pow(1 + monthlyRate, 12) - 1) * 100 : annualRatePct;

  return {
    mode: input.mode,
    finalBalance: round2(finalBalance),
    totalPrincipal: round2(principal),
    totalContributions: round2(totalContributions),
    totalDeposited: round2(totalDeposited),
    totalInterest: round2(totalInterest),
    effectiveAnnualRatePct: round2(effectiveAnnualRatePct),
    schedule,
    breakdown: [
      { label: "Principal", amount: round2(principal), colorClass: "bg-blue-400" },
      { label: "Contributions", amount: round2(totalContributions), colorClass: "bg-violet-400" },
      { label: "Interest", amount: round2(Math.max(0, totalInterest)), colorClass: "bg-emerald-400" },
    ],
  };
}
