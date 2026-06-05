// ─── GPA Calculator — Pure Calculation Module ─────────────────────────────────
//
// PURPOSE:
//   Given a current cumulative GPA, credits completed, credits remaining, and a
//   target cumulative GPA, compute the average GPA the student must earn across
//   their remaining credits to hit the target — plus the best/worst possible
//   final GPA and a feasibility verdict.
//
// METHOD (standard 4.0 quality-point system):
//   qualityPoints      = GPA × credits
//   requiredGpa        = (targetGPA × totalCredits − currentGPA × creditsDone)
//                        ÷ remainingCredits
//   A result > 4.0 means the target is mathematically impossible; ≤ 0 means it
//   is already locked in regardless of remaining performance.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

/** Highest grade point on the standard US 4.0 scale (A / A+ both cap at 4.0). */
export const MAX_GPA = 4.0;

export interface GpaInputs {
  /** Current cumulative GPA (0–4.0) */
  currentGpa:       number;
  /** Credit hours already completed */
  creditsDone:      number;
  /** Credit hours still to be taken */
  remainingCredits: number;
  /** Desired final cumulative GPA (0–4.0) */
  targetGpa:        number;
}

export interface GpaResult {
  /** Average GPA needed across remaining credits to hit the target */
  requiredGpa:           number;
  /** Best possible final GPA (all remaining credits at 4.0) */
  maxAchievableGpa:      number;
  /** Worst possible final GPA (all remaining credits at 0.0) */
  minPossibleGpa:        number;
  /** creditsDone + remainingCredits */
  totalCredits:          number;
  /** Quality points already banked (currentGpa × creditsDone) */
  currentQualityPoints:  number;
  /** Quality points required at the target (targetGpa × totalCredits) */
  targetQualityPoints:   number;
  /** Quality points still to earn (target − current), floored at 0 */
  neededQualityPoints:   number;
  /** Target − current GPA */
  gpaGap:                number;
  /** 1 if the target is reachable (0 ≤ requiredGpa ≤ 4.0), else 0 */
  feasible:              number;
  /** 1 if already guaranteed (requiredGpa ≤ 0), else 0 */
  alreadyLocked:         number;
  [key: string]: number;
}

const round = (n: number, dp = 2) => {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
};

export function calculateGpa(inputs: GpaInputs): GpaResult {
  const currentGpa  = Math.min(MAX_GPA, Math.max(0, Number(inputs.currentGpa) || 0));
  const targetGpa   = Math.min(MAX_GPA, Math.max(0, Number(inputs.targetGpa) || 0));
  const creditsDone = Math.max(0, Number(inputs.creditsDone) || 0);
  const remaining   = Math.max(1, Number(inputs.remainingCredits) || 1);

  const totalCredits         = creditsDone + remaining;
  const currentQualityPoints = currentGpa * creditsDone;
  const targetQualityPoints  = targetGpa * totalCredits;
  const rawNeeded            = targetQualityPoints - currentQualityPoints;
  const requiredGpa          = rawNeeded / remaining;

  const maxAchievableGpa = (currentQualityPoints + MAX_GPA * remaining) / totalCredits;
  const minPossibleGpa   = currentQualityPoints / totalCredits;

  const feasible      = requiredGpa <= MAX_GPA + 1e-9 && requiredGpa >= 0 ? 1 : 0;
  const alreadyLocked = requiredGpa <= 0 ? 1 : 0;

  return {
    requiredGpa:          round(requiredGpa),
    maxAchievableGpa:     round(maxAchievableGpa),
    minPossibleGpa:       round(minPossibleGpa),
    totalCredits,
    currentQualityPoints: round(currentQualityPoints, 1),
    targetQualityPoints:  round(targetQualityPoints, 1),
    neededQualityPoints:  round(Math.max(0, rawNeeded), 1),
    gpaGap:               round(targetGpa - currentGpa),
    feasible,
    alreadyLocked,
  };
}

/** Maps a GPA value to the nearest letter grade on the 4.0 scale. */
export function gpaToLetter(gpa: number): string {
  if (gpa >= 3.85) return "A";
  if (gpa >= 3.5)  return "A−";
  if (gpa >= 3.15) return "B+";
  if (gpa >= 2.85) return "B";
  if (gpa >= 2.5)  return "B−";
  if (gpa >= 2.15) return "C+";
  if (gpa >= 1.85) return "C";
  if (gpa >= 1.0)  return "D";
  return "F";
}
