export type AreaShape = "rectangle" | "square" | "circle" | "triangle";
export type LinearUnit = "ft" | "in" | "yd" | "m";

export interface SquareFootageInputs {
  shape: AreaShape;
  dimA: number; // length / side / diameter / base (in the chosen unit)
  dimB: number; // width / height (rectangle & triangle only)
  unit: LinearUnit;
  quantity: number; // number of identical areas
  wastePct: number; // waste allowance for material
  pricePerSqFt: number; // optional material price
}

export interface SquareFootageResult {
  shape: AreaShape;
  unit: LinearUnit;
  quantity: number;
  areaPerUnitSqFt: number; // area of one shape, in sq ft
  totalSqFt: number; // × quantity
  withWasteSqFt: number; // total + waste allowance
  wasteSqFt: number; // the added allowance alone
  totalSqM: number;
  totalSqYd: number;
  pricePerSqFt: number;
  materialCost: number; // withWaste × price
  breakdown: { label: string; amount: number; colorClass: string }[];
  priceImpact: { pricePerSqFt: number; cost: number }[];
}

// 1 meter = 3.280839895 feet (exact-ish); 1 sq ft = 0.09290304 m².
const FEET_PER_UNIT: Record<LinearUnit, number> = {
  ft: 1,
  in: 1 / 12,
  yd: 3,
  m: 3.280839895,
};
const SQFT_PER_SQM = 10.76391041671; // 1 / 0.09290304

function safeNum(n: number, fallback = 0) {
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function areaInSqFt(shape: AreaShape, aFt: number, bFt: number): number {
  switch (shape) {
    case "rectangle":
      return aFt * bFt;
    case "square":
      return aFt * aFt;
    case "circle":
      return Math.PI * (aFt / 2) ** 2; // A = diameter
    case "triangle":
      return 0.5 * aFt * bFt; // A = base, B = height
    default:
      return 0;
  }
}

export function calculateSquareFootage(input: SquareFootageInputs): SquareFootageResult {
  const dimA = Math.max(0, safeNum(input.dimA));
  const dimB = Math.max(0, safeNum(input.dimB));
  const unit = input.unit;
  const feetPer = FEET_PER_UNIT[unit] ?? 1;
  const quantity = clamp(Math.round(safeNum(input.quantity, 1)), 1, 100_000);
  const wastePct = clamp(safeNum(input.wastePct), 0, 100);
  const pricePerSqFt = Math.max(0, safeNum(input.pricePerSqFt));

  const aFt = dimA * feetPer;
  const bFt = dimB * feetPer;

  const areaPerUnitSqFt = areaInSqFt(input.shape, aFt, bFt);
  const totalSqFt = areaPerUnitSqFt * quantity;
  const withWasteSqFt = totalSqFt * (1 + wastePct / 100);
  const wasteSqFt = withWasteSqFt - totalSqFt;
  const totalSqM = totalSqFt / SQFT_PER_SQM;
  const totalSqYd = totalSqFt / 9;
  const materialCost = withWasteSqFt * pricePerSqFt;

  // Material cost across a band of prices per sq ft.
  const base = pricePerSqFt > 0 ? pricePerSqFt : 4;
  const pricePoints = [base * 0.5, base * 0.75, base, base * 1.5, base * 2, base * 3];
  const priceImpact = Array.from(new Set(pricePoints.map((p) => round2(p)))).map((p) => ({
    pricePerSqFt: p,
    cost: round2(withWasteSqFt * p),
  }));

  return {
    shape: input.shape,
    unit,
    quantity,
    areaPerUnitSqFt: round2(areaPerUnitSqFt),
    totalSqFt: round2(totalSqFt),
    withWasteSqFt: round2(withWasteSqFt),
    wasteSqFt: round2(wasteSqFt),
    totalSqM: round2(totalSqM),
    totalSqYd: round2(totalSqYd),
    pricePerSqFt: round2(pricePerSqFt),
    materialCost: round2(materialCost),
    breakdown: [
      { label: "Usable area", amount: round2(totalSqFt), colorClass: "bg-emerald-400" },
      { label: "Waste allowance", amount: round2(wasteSqFt), colorClass: "bg-amber-400" },
    ],
    priceImpact,
  };
}
