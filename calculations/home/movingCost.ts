// ─── Moving Cost Calculator — Pure Calculation Module ─────────────────────────
//
// PURPOSE:
//   Roll up the real cost of a move from its line items (movers/truck, fuel,
//   packing supplies, storage, tips & misc), add a contingency buffer, and —
//   when distance is supplied — express the move as a cost per mile.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

export interface MovingInputs {
  moversCost:  number;  // $ professional movers or truck rental
  fuelCost:    number;  // $
  packingCost: number;  // $ boxes, tape, wrap
  storageCost: number;  // $
  miscCost:    number;  // $ tips, food, permits, cleaning
  bufferPct:   number;  // % contingency
  miles:       number;  // distance (0 = skip cost/mile)
}

export interface MovingResult {
  subtotal:    number;
  buffer:      number;
  total:       number;
  costPerMile: number;
  /** Largest single line item, $ */
  topLineItem:      number;
  /** Largest line item as a % of subtotal */
  topLineItemShare: number;
  [key: string]: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateMovingCost(inputs: MovingInputs): MovingResult {
  const moversCost  = Math.max(0, Number(inputs.moversCost)  || 0);
  const fuelCost    = Math.max(0, Number(inputs.fuelCost)    || 0);
  const packingCost = Math.max(0, Number(inputs.packingCost) || 0);
  const storageCost = Math.max(0, Number(inputs.storageCost) || 0);
  const miscCost    = Math.max(0, Number(inputs.miscCost)    || 0);
  const bufferPct   = Math.max(0, Number(inputs.bufferPct)   || 0);
  const miles       = Math.max(0, Number(inputs.miles)       || 0);

  const subtotal = moversCost + fuelCost + packingCost + storageCost + miscCost;
  const buffer   = subtotal * (bufferPct / 100);
  const total    = subtotal + buffer;

  const topLineItem = Math.max(moversCost, fuelCost, packingCost, storageCost, miscCost);

  return {
    subtotal:         round2(subtotal),
    buffer:           round2(buffer),
    total:            round2(total),
    costPerMile:      miles > 0 ? round2(total / miles) : 0,
    topLineItem:      round2(topLineItem),
    topLineItemShare: subtotal > 0 ? round2((topLineItem / subtotal) * 100) : 0,
  };
}
