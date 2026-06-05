// ─── Protein Intake Calculator — Pure Calculation Module ──────────────────────
//
// PURPOSE:
//   Compute a daily protein target (grams) from body weight × an activity-based
//   g/kg multiplier, plus calories from protein, a per-meal split, and the
//   evidence-based muscle-building range (1.6–2.2 g/kg) for context.
//
// SOURCES:
//   - WHO RDA minimum: 0.8 g/kg/day.
//   - ISSN position stand (Jäger et al., 2017): 1.4–2.0 g/kg for active people;
//     up to ~2.2 g/kg during a calorie deficit to preserve lean mass.
//   - ~20–40 g per meal maximises muscle protein synthesis (Schoenfeld & Aragon).
//   - Protein = 4 kcal/g.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

export const KCAL_PER_GRAM_PROTEIN = 4;
export const LB_PER_KG = 2.2046226218;
/** g/kg bounds of the evidence-based muscle-building range. */
export const MUSCLE_RANGE_LOW = 1.6;
export const MUSCLE_RANGE_HIGH = 2.2;
/** Practical upper bound of protein usefully used per meal (g). */
export const PER_MEAL_CEILING = 40;

export interface ProteinInputs {
  weight:      number;
  /** 1 = kilograms, 0 = pounds */
  weightIsKg:  number;
  /** g/kg multiplier from the chosen activity level */
  multiplier:  number;
  mealsPerDay: number;
}

export interface ProteinResult {
  weightKg:           number;
  proteinGrams:       number;
  caloriesFromProtein: number;
  perMealGrams:       number;
  rangeLow:           number;
  rangeHigh:          number;
  /** Multiple of the 0.8 g/kg RDA minimum */
  rdaMultiple:        number;
  [key: string]: number;
}

const round = (n: number, dp = 0) => {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
};

export function calculateProtein(inputs: ProteinInputs): ProteinResult {
  const weight      = Math.max(0, Number(inputs.weight) || 0);
  const weightIsKg  = Number(inputs.weightIsKg) === 1 ? 1 : 0;
  const multiplier  = Math.max(0, Number(inputs.multiplier) || 0);
  const mealsPerDay = Math.max(1, Math.round(Number(inputs.mealsPerDay) || 1));

  const weightKg     = weightIsKg ? weight : weight / LB_PER_KG;
  const proteinGrams = weightKg * multiplier;

  return {
    weightKg:            round(weightKg, 1),
    proteinGrams:        round(proteinGrams),
    caloriesFromProtein: round(proteinGrams * KCAL_PER_GRAM_PROTEIN),
    perMealGrams:        round(proteinGrams / mealsPerDay),
    rangeLow:            round(weightKg * MUSCLE_RANGE_LOW),
    rangeHigh:           round(weightKg * MUSCLE_RANGE_HIGH),
    rdaMultiple:         round(multiplier / 0.8, 2),
  };
}
