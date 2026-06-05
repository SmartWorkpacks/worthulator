// ─── Flooring Cost Calculator — Pure Calculation Module ───────────────────────
//
// PURPOSE:
//   Estimate a flooring project's total installed cost from room area, a material
//   price per ft² (waste applied), and a labor price per ft² (on actual area).
//   Splitting material and labor as independent rates is far more honest than a
//   fixed labor-as-%-of-material rule, which varies wildly by flooring type.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

export interface FlooringInputs {
  roomLength:      number;  // ft
  roomWidth:       number;  // ft
  materialPerSqFt: number;  // $
  laborPerSqFt:    number;  // $ (0 = DIY / materials only)
  wastePct:        number;  // %
}

export interface FlooringResult {
  area:                  number;
  areaWithWaste:         number;
  materialCost:          number;
  laborCost:             number;
  totalCost:             number;
  costPerSqFtInstalled:  number;
  /** Labor as a % of the total */
  laborShare:            number;
  [key: string]: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateFlooringCost(inputs: FlooringInputs): FlooringResult {
  const roomLength      = Math.max(0, Number(inputs.roomLength) || 0);
  const roomWidth       = Math.max(0, Number(inputs.roomWidth) || 0);
  const materialPerSqFt = Math.max(0, Number(inputs.materialPerSqFt) || 0);
  const laborPerSqFt    = Math.max(0, Number(inputs.laborPerSqFt) || 0);
  const wastePct        = Math.max(0, Number(inputs.wastePct) || 0);

  const area          = roomLength * roomWidth;
  const areaWithWaste = area * (1 + wastePct / 100);

  const materialCost = areaWithWaste * materialPerSqFt;
  const laborCost    = area * laborPerSqFt;
  const totalCost    = materialCost + laborCost;

  return {
    area:                 round2(area),
    areaWithWaste:        round2(areaWithWaste),
    materialCost:         round2(materialCost),
    laborCost:            round2(laborCost),
    totalCost:            round2(totalCost),
    costPerSqFtInstalled: area > 0 ? round2(totalCost / area) : 0,
    laborShare:           totalCost > 0 ? round2((laborCost / totalCost) * 100) : 0,
  };
}
