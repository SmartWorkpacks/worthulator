// ─── WorthCore Insight Engine — Tile Calculator Generator ─────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for "tile-calculator". Shows the count
//   with the waste allowance broken out, the material cost, a buy-an-extra-box
//   nudge, and how tile size changes the count.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";

export interface TileInsightInputs {
  roomLength:   number;
  roomWidth:    number;
  tileAreaSqFt: number;
  wastePct:     number;
  pricePerTile: number;
}

export interface TileInsightOutputs {
  roomArea:      number;
  areaWithWaste: number;
  baseTiles:     number;
  tilesNeeded:   number;
  wasteTiles:    number;
  materialCost:  number;
}

export function generateTileInsights(
  inputs: TileInsightInputs,
  outputs: TileInsightOutputs,
): Insight[] {
  const { wastePct, pricePerTile } = inputs;
  const { roomArea, baseTiles, tilesNeeded, wasteTiles, materialCost } = outputs;

  if (tilesNeeded <= 0) return [];

  const insights: Insight[] = [];

  // ── 1. Headline — count with waste broken out (delta-card) ────────────────
  insights.push({
    id:       "tile.headline",
    severity: "neutral",
    category: "comparison",
    title:    `Order ${tilesNeeded} tiles for ${roomArea} ft²`,
    body:     `The bare floor needs ${baseTiles} tiles. Adding a ${wastePct}% waste allowance for cuts, breakage, and pattern-matching brings it to ${tilesNeeded} — ${wasteTiles} spare tiles that keep you from re-ordering mid-job from a different dye lot.`,
    visualization: {
      type:   "delta-card",
      before: { label: "Bare floor",  value: `${baseTiles}` },
      after:  { label: `With ${wastePct}% waste`, value: `${tilesNeeded}` },
      delta:  { label: "Spare tiles", value: `+${wasteTiles}`, positive: true },
    } satisfies InsightVisualization,
    priority: 90,
  });

  // ── 2. Material cost ──────────────────────────────────────────────────────
  if (pricePerTile > 0 && materialCost > 0) {
    const costPerSqFt = roomArea > 0 ? materialCost / roomArea : 0;
    insights.push({
      id:       "tile.cost",
      severity: "neutral",
      category: "spending",
      title:    `${formatCurrency(materialCost)} in tiles`,
      body:     `At ${formatCurrency(pricePerTile)} per tile, ${tilesNeeded} tiles is ${formatCurrency(materialCost)} — about ${formatCurrency(costPerSqFt)}/ft² for tile alone. Budget extra for adhesive, grout, spacers, and trim, plus labour if you're not laying them yourself.`,
      metric:   { label: "Tile cost / ft²", value: formatCurrency(costPerSqFt) },
      priority: 70,
    });
  }

  // ── 3. Buy-an-extra-box / dye-lot nudge ───────────────────────────────────
  insights.push({
    id:       "tile.dye-lot",
    severity: "positive",
    category: "savings",
    title:    `Keep a few spares from this batch`,
    body:     `Dye lots vary between production batches, so a tile bought next year rarely matches today's. Your ${wasteTiles}-tile waste margin doubles as a repair stash — store the leftovers rather than returning every last one.`,
    metric:   { label: "Spares to keep", value: `${wasteTiles}` },
    priority: 50,
  });

  // ── 4. Pattern / waste guidance ───────────────────────────────────────────
  if (wastePct < 15) {
    insights.push({
      id:       "tile.pattern-waste",
      severity: "neutral",
      category: "comparison",
      title:    `Bump waste to 15% for diagonal or herringbone`,
      body:     `A ${wastePct}% allowance suits straight-lay, large-format tiles. Diagonal, herringbone, or chevron layouts need far more cutting — 15% is the safer margin there, which on this room would be a handful more tiles.`,
      metric:   { label: "Current allowance", value: `${wastePct}%` },
      priority: 30,
    });
  }

  return insights.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
