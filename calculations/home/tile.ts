// ─── Tile Calculator — Pure Calculation Module ────────────────────────────────
//
// PURPOSE:
//   Work out how many tiles a room needs from its area and the tile size, adding
//   a waste allowance for cuts/breakage, and (optionally) the material cost at a
//   per-tile price. Tile size is supplied as area-per-tile in ft² so the engine's
//   dropdown can encode standard sizes directly.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

export interface TileInputs {
  roomLength:   number;  // ft
  roomWidth:    number;  // ft
  tileAreaSqFt: number;  // ft² per tile
  wastePct:     number;  // %
  pricePerTile: number;  // $ (0 = skip cost)
}

export interface TileResult {
  roomArea:      number;
  areaWithWaste: number;
  baseTiles:     number;
  tilesNeeded:   number;
  wasteTiles:    number;
  materialCost:  number;
  [key: string]: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateTile(inputs: TileInputs): TileResult {
  const roomLength   = Math.max(0, Number(inputs.roomLength) || 0);
  const roomWidth    = Math.max(0, Number(inputs.roomWidth) || 0);
  const tileAreaSqFt = Math.max(0.01, Number(inputs.tileAreaSqFt) || 1);
  const wastePct     = Math.max(0, Number(inputs.wastePct) || 0);
  const pricePerTile = Math.max(0, Number(inputs.pricePerTile) || 0);

  const roomArea      = roomLength * roomWidth;
  const wasteFactor   = 1 + wastePct / 100;
  const areaWithWaste = roomArea * wasteFactor;

  const baseTiles   = Math.ceil(roomArea / tileAreaSqFt);
  const tilesNeeded = Math.ceil((roomArea / tileAreaSqFt) * wasteFactor);
  const wasteTiles  = tilesNeeded - baseTiles;

  return {
    roomArea:      round2(roomArea),
    areaWithWaste: round2(areaWithWaste),
    baseTiles,
    tilesNeeded,
    wasteTiles:    Math.max(0, wasteTiles),
    materialCost:  round2(tilesNeeded * pricePerTile),
  };
}
