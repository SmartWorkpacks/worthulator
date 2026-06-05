// ─── Expense Split Calculator — Pure Calculation Module ───────────────────────
//
// PURPOSE:
//   Split a shared bill equally across a group, layering an optional tip and tax,
//   and a "round up to whole dollars" collection mode that shows the small buffer
//   the rounding creates (handy for cash collection / covering the tip).
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

export interface ExpenseSplitInputs {
  amount: number;
  people: number;
  tipPct: number;
  taxPct: number;
}

export interface ExpenseSplitResult {
  tip:               number;
  tax:               number;
  grandTotal:        number;
  perPersonBase:     number;
  perPersonTotal:    number;
  tipPerPerson:      number;
  taxPerPerson:      number;
  /** Per-person total rounded up to the next whole dollar */
  roundedPerPerson:  number;
  /** Surplus collected when everyone pays the rounded amount */
  collectionBuffer:  number;
  [key: string]: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateExpenseSplit(inputs: ExpenseSplitInputs): ExpenseSplitResult {
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const people = Math.max(1, Math.round(Number(inputs.people) || 1));
  const tipPct = Math.max(0, Number(inputs.tipPct) || 0);
  const taxPct = Math.max(0, Number(inputs.taxPct) || 0);

  const tip        = amount * (tipPct / 100);
  const tax        = amount * (taxPct / 100);
  const grandTotal = amount + tip + tax;

  const perPersonBase  = amount / people;
  const perPersonTotal = grandTotal / people;
  const roundedPerPerson = Math.ceil(perPersonTotal);
  const collectionBuffer = roundedPerPerson * people - grandTotal;

  return {
    tip:              round2(tip),
    tax:              round2(tax),
    grandTotal:       round2(grandTotal),
    perPersonBase:    round2(perPersonBase),
    perPersonTotal:   round2(perPersonTotal),
    tipPerPerson:     round2(tip / people),
    taxPerPerson:     round2(tax / people),
    roundedPerPerson,
    collectionBuffer: round2(collectionBuffer),
  };
}
