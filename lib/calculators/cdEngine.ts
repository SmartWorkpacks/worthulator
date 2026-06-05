export interface CdInputs {
  deposit: number; // initial principal locked in the CD
  apyPct: number; // advertised annual percentage yield (effective annual rate)
  termMonths: number; // CD term
  penaltyMonths: number; // early-withdrawal penalty, expressed in months of interest
}

export interface CdSchedulePoint {
  month: number;
  balance: number;
  interest: number; // cumulative interest to this month
}

export interface CdResult {
  deposit: number;
  apyPct: number; // echoed effective APY
  termMonths: number;
  termYears: number;
  monthlyRatePct: number; // APY restated as an equivalent monthly rate
  maturityValue: number;
  totalInterest: number;
  interestSharePct: number; // interest as a share of maturity value
  earlyWithdrawalPenalty: number; // dollar estimate
  netIfBrokenEarly: number; // principal + accrued − penalty, modelled at the penalty horizon
  schedule: CdSchedulePoint[];
  breakdown: { label: string; amount: number; colorClass: string }[];
  apyImpact: { apyPct: number; maturityValue: number }[];
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

function maturityFor(deposit: number, apy: number, months: number): number {
  return deposit * Math.pow(1 + apy, months / 12);
}

export function calculateCd(input: CdInputs): CdResult {
  const deposit = Math.max(0, safeNum(input.deposit));
  const apyPct = clamp(safeNum(input.apyPct), 0, 100);
  const termMonths = clamp(Math.round(safeNum(input.termMonths)), 1, 1200);
  const penaltyMonths = clamp(Math.round(safeNum(input.penaltyMonths)), 0, termMonths);
  const apy = apyPct / 100;

  // APY is an effective annual rate, so its equivalent monthly compounding rate is:
  const monthlyRate = Math.pow(1 + apy, 1 / 12) - 1;

  const maturityValue = maturityFor(deposit, apy, termMonths);
  const totalInterest = Math.max(0, maturityValue - deposit);
  const interestShare = maturityValue > 0 ? (totalInterest / maturityValue) * 100 : 0;

  // Early-withdrawal penalty is commonly quoted as N months of interest. Use the
  // CD's own monthly interest on the principal as the per-month figure.
  const perMonthInterest = deposit * monthlyRate;
  const earlyWithdrawalPenalty = perMonthInterest * penaltyMonths;

  // Value if broken at the penalty horizon: accrued value there, less the penalty.
  const accruedAtHorizon = maturityFor(deposit, apy, penaltyMonths);
  const netIfBrokenEarly = Math.max(deposit - earlyWithdrawalPenalty, accruedAtHorizon - earlyWithdrawalPenalty);

  // Month-by-month schedule (sampled to keep the series light for long terms).
  const sampleEvery = termMonths > 120 ? Math.ceil(termMonths / 120) : 1;
  const schedule: CdSchedulePoint[] = [{ month: 0, balance: round2(deposit), interest: 0 }];
  for (let m = 1; m <= termMonths; m++) {
    if (m % sampleEvery === 0 || m === termMonths) {
      const balance = maturityFor(deposit, apy, m);
      schedule.push({ month: m, balance: round2(balance), interest: round2(balance - deposit) });
    }
  }

  // Maturity across a band of APYs for the impact chart.
  const apyPoints = [
    Math.max(0, apyPct - 2),
    Math.max(0, apyPct - 1),
    apyPct,
    apyPct + 1,
    apyPct + 2,
    apyPct + 3,
  ];
  const apyImpact = Array.from(new Set(apyPoints)).map((p) => ({
    apyPct: round2(p),
    maturityValue: round2(maturityFor(deposit, p / 100, termMonths)),
  }));

  return {
    deposit: round2(deposit),
    apyPct: round2(apyPct),
    termMonths,
    termYears: round2(termMonths / 12),
    monthlyRatePct: round2(monthlyRate * 100),
    maturityValue: round2(maturityValue),
    totalInterest: round2(totalInterest),
    interestSharePct: round2(interestShare),
    earlyWithdrawalPenalty: round2(earlyWithdrawalPenalty),
    netIfBrokenEarly: round2(netIfBrokenEarly),
    schedule,
    breakdown: [
      { label: "Principal", amount: round2(deposit), colorClass: "bg-blue-400" },
      { label: "Interest", amount: round2(totalInterest), colorClass: "bg-emerald-400" },
    ],
    apyImpact,
  };
}
