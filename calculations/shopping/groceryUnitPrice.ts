// ─── Grocery Unit Price — Pure Calculation Module ─────────────────────────────
//
// PURPOSE:
//   Compare two grocery items by price per unit, determine the winner, and
//   compute the annual savings from choosing the cheaper option consistently.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface GroceryUnitPriceInputs {
  item1Price: number;
  item1Size:  number;
  item2Price: number;
  item2Size:  number;
  /** How many times per year you buy this product */
  purchasesPerYear: number;
}

export interface GroceryUnitPriceResult {
  /** Price per unit for Item A */
  unitPriceA: number;
  /** Price per unit for Item B */
  unitPriceB: number;
  /** % cheaper the winning item is vs the losing item */
  savingsPct: number;
  /** Absolute $/unit difference */
  savingsPerUnit: number;
  /** 1 = A wins, 2 = B wins, 0 = tied */
  winner: number;
  /** Annual $ saved by always buying the cheaper item */
  annualSavings: number;
  /** Annual cost if always buying Item A */
  annualCostA: number;
  /** Annual cost if always buying Item B */
  annualCostB: number;
  /** Projected 10-staple annual saving (annualSavings × 10) */
  tenStapleSaving: number;
  [key: string]: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const round3 = (n: number) => Math.round(n * 1000) / 1000;
const round4 = (n: number) => Math.round(n * 10000) / 10000;
const round2 = (n: number) => Math.round(n * 100) / 100;

// ─── Calculation ──────────────────────────────────────────────────────────────

export function calculateGroceryUnitPrice(
  inputs: GroceryUnitPriceInputs,
): GroceryUnitPriceResult {
  const p1   = Math.max(0, Number(inputs.item1Price) || 0);
  const s1   = Math.max(1, Number(inputs.item1Size) || 1);
  const p2   = Math.max(0, Number(inputs.item2Price) || 0);
  const s2   = Math.max(1, Number(inputs.item2Size) || 1);
  const buys = Math.max(0, Math.round(Number(inputs.purchasesPerYear) || 0));

  const unitPriceA = round3(p1 / s1);
  const unitPriceB = round3(p2 / s2);

  const cheaper = Math.min(unitPriceA, unitPriceB);
  const dearer  = Math.max(unitPriceA, unitPriceB);
  const savingsPerUnit = round4(dearer - cheaper);
  const savingsPct = dearer > 0 ? round2((savingsPerUnit / dearer) * 100) : 0;

  let winner: number;
  if (unitPriceA < unitPriceB) winner = 1;
  else if (unitPriceB < unitPriceA) winner = 2;
  else winner = 0;

  const annualCostA = round2(p1 * buys);
  const annualCostB = round2(p2 * buys);

  const winnerSize = winner === 1 ? s1 : winner === 2 ? s2 : s1;
  const annualSavings = round2(savingsPerUnit * winnerSize * buys);
  const tenStapleSaving = round2(annualSavings * 10);

  return {
    unitPriceA,
    unitPriceB,
    savingsPct,
    savingsPerUnit,
    winner,
    annualSavings,
    annualCostA,
    annualCostB,
    tenStapleSaving,
  };
}
