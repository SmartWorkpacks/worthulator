// ─── Biological Age ───────────────────────────────────────────────────────────
//
// Estimates biological age by adding lifestyle penalties to chronological age:
// short sleep (<6h) +5, low exercise (<2 days/wk) +4, smoking +8, obesity
// (BMI>30) +6. Risk score scales the total penalty to 0–100. Pure module.
// ─────────────────────────────────────────────────────────────────────────────

export interface BiologicalAgeInputs {
  age: number;
  sleep: number;
  exercise: number;
  bmi: number;
  smoker: boolean;
}

export interface BiologicalAgeResult {
  biologicalAge: number;
  riskScore: number;
  ageDelta: number;
  riskFactorCount: number;
  improvementPotential: number;
  [key: string]: number;
}

const PENALTY_SLEEP = 5;
const PENALTY_EXERCISE = 4;
const PENALTY_SMOKER = 8;
const PENALTY_BMI = 6;

export function calculateBiologicalAge(
  inputs: BiologicalAgeInputs,
): BiologicalAgeResult {
  const lowSleep = inputs.sleep < 6;
  const lowExercise = inputs.exercise < 2;
  const obese = inputs.bmi > 30;

  let adjustment = 0;
  if (lowSleep) adjustment += PENALTY_SLEEP;
  if (lowExercise) adjustment += PENALTY_EXERCISE;
  if (inputs.smoker) adjustment += PENALTY_SMOKER;
  if (obese) adjustment += PENALTY_BMI;

  const riskFactorCount =
    (lowSleep ? 1 : 0) +
    (lowExercise ? 1 : 0) +
    (inputs.smoker ? 1 : 0) +
    (obese ? 1 : 0);

  return {
    biologicalAge: inputs.age + adjustment,
    riskScore: Math.min(adjustment * 10, 100),
    ageDelta: adjustment,
    riskFactorCount,
    improvementPotential: adjustment,
  };
}
