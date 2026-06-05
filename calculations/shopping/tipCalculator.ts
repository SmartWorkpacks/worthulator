// ─── Tip Calculator — Pure Calculation Module ─────────────────────────────────
//
// PURPOSE:
//   Calculate the tip amount, per-person split, cash-friendly round-up, and
//   annual tipping spend based on dining-out frequency.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface TipInputs {
  bill:             number;
  tipPct:           number;
  people:           number;
  diningFrequency:  number;
}

export interface TipResult {
  tipAmount:       number;
  totalBill:       number;
  tipPerPerson:    number;
  totalPerPerson:  number;
  /** Total per person rounded up to the nearest $5 — cash friendly */
  roundedTotal:    number;
  /** Extra cost per person from round-up */
  roundUpCost:     number;
  /** Annual tip spend at this dining frequency */
  annualTipSpend:  number;
  /** Annual total dining spend (food + tip) */
  annualDining:    number;
  /** Tip at 15% for bracket comparison */
  tip15:           number;
  /** Tip at 20% for bracket comparison */
  tip20:           number;
  /** Tip at 25% for bracket comparison */
  tip25:           number;
  [key: string]: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const round2 = (n: number) => Math.round(n * 100) / 100;

// ─── Calculation ──────────────────────────────────────────────────────────────

export function calculateTip(inputs: TipInputs): TipResult {
  const bill    = Math.max(0, Number(inputs.bill) || 0);
  const tipPct  = Math.max(0, Number(inputs.tipPct) || 0);
  const people  = Math.max(1, Math.round(Number(inputs.people) || 1));
  const freq    = Math.max(0, Math.round(Number(inputs.diningFrequency) || 0));

  const tipAmount      = round2(bill * (tipPct / 100));
  const totalBill      = round2(bill + tipAmount);
  const tipPerPerson   = round2(tipAmount / people);
  const totalPerPerson = round2(totalBill / people);
  const roundedTotal   = Math.ceil(totalPerPerson / 5) * 5;
  const roundUpCost    = round2(roundedTotal - totalPerPerson);

  const annualTipSpend = round2(tipAmount * freq * 12);
  const annualDining   = round2(totalBill * freq * 12);

  const tip15 = round2(bill * 0.15);
  const tip20 = round2(bill * 0.20);
  const tip25 = round2(bill * 0.25);

  return {
    tipAmount,
    totalBill,
    tipPerPerson,
    totalPerPerson,
    roundedTotal,
    roundUpCost,
    annualTipSpend,
    annualDining,
    tip15,
    tip20,
    tip25,
  };
}
