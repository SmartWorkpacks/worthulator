// ─── Quit Smoking — Pure Calculation Module ───────────────────────────────────
//
// PURPOSE:
//   Calculate money saved, cigarettes avoided, life regained, and the
//   investment value of continued savings after quitting smoking.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

/** Minutes of life lost per cigarette (Doll et al., BMJ 2000) */
export const MINUTES_PER_CIGARETTE = 11;

/** Cigarettes per standard pack */
export const CIGS_PER_PACK = 20;

/** Default annual return for investment projection */
const RETURN_RATE = 0.07;

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface QuitSmokingInputs {
  packsPerDay:   number;
  packCost:      number;
  daysSinceQuit: number;
}

/** Live regional data injected by the config layer. */
export interface QuitSmokingData {
  /** Average pack price ($) for the selected state — drives the benchmark. */
  stateAvgPackPrice?: number;
}

export interface QuitSmokingResult {
  moneySaved:          number;
  cigarettesAvoided:   number;
  daysOfLifeRegained:  number;
  annualSaving:        number;
  investedValue10yr:   number;
  investedValue20yr:   number;
  /** Total amount contributed (not compounded) over 10 years */
  totalContributed10yr: number;
  /** Compound growth portion of 10-year invested value */
  compoundGrowth10yr:  number;
  /** State (or national) average pack price used for the benchmark */
  stateAvgPackPrice:   number;
  /** User pack cost vs state average, as a signed % (negative = below avg) */
  vsStateAvgPct:       number;
  [key: string]: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const round2 = (n: number) => Math.round(n * 100) / 100;

function futureValueAnnuity(annual: number, years: number): number {
  if (annual <= 0 || years <= 0) return 0;
  return annual * ((Math.pow(1 + RETURN_RATE, years) - 1) / RETURN_RATE);
}

// ─── Calculation ──────────────────────────────────────────────────────────────

export function calculateQuitSmoking(
  inputs: QuitSmokingInputs,
  data: QuitSmokingData = {},
): QuitSmokingResult {
  const packs = Math.max(0, Number(inputs.packsPerDay) || 0);
  const cost  = Math.max(0, Number(inputs.packCost) || 0);
  const days  = Math.max(0, Math.round(Number(inputs.daysSinceQuit) || 0));

  const moneySaved         = round2(packs * cost * days);
  const cigarettesAvoided  = Math.round(packs * CIGS_PER_PACK * days);
  const daysOfLifeRegained = round2((cigarettesAvoided * MINUTES_PER_CIGARETTE) / 60 / 24);
  const annualSaving       = round2(packs * cost * 365);

  const investedValue10yr   = Math.round(futureValueAnnuity(annualSaving, 10));
  const investedValue20yr   = Math.round(futureValueAnnuity(annualSaving, 20));
  const totalContributed10yr = round2(annualSaving * 10);
  const compoundGrowth10yr  = Math.round(investedValue10yr - totalContributed10yr);

  const stateAvgPackPrice = round2(Math.max(0, Number(data.stateAvgPackPrice) || 0));
  const vsStateAvgPct = stateAvgPackPrice > 0 && cost > 0
    ? round2(((cost - stateAvgPackPrice) / stateAvgPackPrice) * 100)
    : 0;

  return {
    moneySaved,
    cigarettesAvoided,
    daysOfLifeRegained,
    annualSaving,
    investedValue10yr,
    investedValue20yr,
    totalContributed10yr,
    compoundGrowth10yr,
    stateAvgPackPrice,
    vsStateAvgPct,
  };
}
