export type WeightUnit = "lb" | "kg";

export interface OneRepMaxInputs {
  weight: number; // load lifted for the set
  reps: number; // reps performed
  unit: WeightUnit; // display unit only — the math is unit-agnostic
}

export interface FormulaEstimate {
  name: string;
  value: number;
}

export interface PercentRow {
  pct: number; // percentage of 1RM
  weight: number; // load at that percentage
  reps: number; // approximate reps achievable at that load
}

export interface RepMaxRow {
  reps: number; // target rep max (e.g. a 5-rep max)
  weight: number; // estimated load for that rep max
}

export interface OneRepMaxResult {
  weight: number;
  reps: number;
  unit: WeightUnit;
  oneRepMax: number; // averaged estimate
  formulaEstimates: FormulaEstimate[];
  spreadLow: number; // lowest formula estimate
  spreadHigh: number; // highest formula estimate
  percentTable: PercentRow[];
  repMaxes: RepMaxRow[];
  repCurve: { reps: number; weight: number }[]; // estimated load across a rep range
}

function safeNum(n: number, fallback = 0) {
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

// Published 1RM prediction equations (w = weight, r = reps).
function epley(w: number, r: number) {
  return w * (1 + r / 30);
}
function brzycki(w: number, r: number) {
  // Guard the asymptote at r = 37.
  return r >= 37 ? w * 36 : (w * 36) / (37 - r);
}
function lombardi(w: number, r: number) {
  return w * Math.pow(r, 0.1);
}
function mayhew(w: number, r: number) {
  return (100 * w) / (52.2 + 41.9 * Math.exp(-0.055 * r));
}
function oconner(w: number, r: number) {
  return w * (1 + r / 40);
}
function wathan(w: number, r: number) {
  return (100 * w) / (48.8 + 53.8 * Math.exp(-0.075 * r));
}

// Estimated load for a target number of reps, via the Epley inverse.
function weightForReps(oneRepMax: number, r: number): number {
  return oneRepMax / (1 + r / 30);
}

export function calculateOneRepMax(input: OneRepMaxInputs): OneRepMaxResult {
  const weight = Math.max(0, safeNum(input.weight));
  const reps = clamp(Math.round(safeNum(input.reps, 1)), 1, 20);
  const unit: WeightUnit = input.unit === "kg" ? "kg" : "lb";

  // At a single rep the lift IS the one-rep max — all formulas collapse to the weight.
  let formulaEstimates: FormulaEstimate[];
  if (reps <= 1) {
    formulaEstimates = [
      { name: "Epley", value: weight },
      { name: "Brzycki", value: weight },
      { name: "Lombardi", value: weight },
      { name: "Mayhew", value: weight },
      { name: "O'Conner", value: weight },
      { name: "Wathan", value: weight },
    ];
  } else {
    formulaEstimates = [
      { name: "Epley", value: epley(weight, reps) },
      { name: "Brzycki", value: brzycki(weight, reps) },
      { name: "Lombardi", value: lombardi(weight, reps) },
      { name: "Mayhew", value: mayhew(weight, reps) },
      { name: "O'Conner", value: oconner(weight, reps) },
      { name: "Wathan", value: wathan(weight, reps) },
    ];
  }

  const values = formulaEstimates.map((f) => f.value);
  const oneRepMax = values.reduce((acc, v) => acc + v, 0) / values.length;
  const spreadLow = Math.min(...values);
  const spreadHigh = Math.max(...values);

  // Training-percentage table (load and approximate reps at each % of 1RM).
  const pcts = [100, 95, 90, 85, 80, 75, 70, 65, 60];
  const percentTable: PercentRow[] = pcts.map((pct) => ({
    pct,
    weight: round1((oneRepMax * pct) / 100),
    reps: Math.max(1, Math.round(30 * (100 / pct - 1))),
  }));

  // Rep-max targets (estimated load for common rep maxes).
  const repMaxTargets = [2, 3, 5, 8, 10, 12];
  const repMaxes: RepMaxRow[] = repMaxTargets.map((r) => ({
    reps: r,
    weight: round1(weightForReps(oneRepMax, r)),
  }));

  // Rep curve for the chart: estimated load from 1 to 12 reps.
  const repCurve = Array.from({ length: 12 }, (_, i) => {
    const r = i + 1;
    return { reps: r, weight: round1(weightForReps(oneRepMax, r)) };
  });

  return {
    weight: round1(weight),
    reps,
    unit,
    oneRepMax: round1(oneRepMax),
    formulaEstimates: formulaEstimates.map((f) => ({ name: f.name, value: round1(f.value) })),
    spreadLow: round1(spreadLow),
    spreadHigh: round1(spreadHigh),
    percentTable,
    repMaxes,
    repCurve,
  };
}
