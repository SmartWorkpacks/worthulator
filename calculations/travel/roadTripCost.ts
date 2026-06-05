// ─── Road Trip Cost — Pure Calculation Module ─────────────────────────────────
//
// PURPOSE:
//   Deterministic fuel-cost math for the "road-trip-cost" calculator.
//   Blends highway/city efficiency for a real-world MPG estimate, then
//   computes one-way + round-trip fuel cost, tolls, and per-person split.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Every constant documented with a source
//   ❌ Never import React · never call fetch()
//   ❌ Never read datasets directly — gasPrice is INJECTED so this stays testable
//
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Highway driving typically yields ~10% better fuel economy than the EPA
 * combined rating.
 * Source: EPA "Your MPG Will Vary" — fueleconomy.gov tips page; real-world
 * data shows 5–15% highway bonus over combined.
 */
export const EPA_HWY_BONUS = 0.10;

/**
 * City driving typically yields ~15% worse fuel economy than the EPA combined
 * rating.
 * Source: same EPA methodology; stop-and-go, idling, and short trips degrade
 * efficiency by 10–20% vs combined.
 */
export const EPA_CITY_PENALTY = 0.15;

/**
 * US EPA/NHTSA average fuel economy for MY 2023–24 passenger vehicles.
 * Used as the national benchmark for per-mile cost comparisons.
 * Source: EPA Automotive Trends Report 2024.
 */
export const NATIONAL_AVG_MPG = 28.0;

/**
 * Rough per-person one-way domestic flight cost for the "drive vs fly"
 * comparison insight. This is an order-of-magnitude benchmark, not a live
 * feed — flight prices swing wildly by route, date, and class.
 * Source: BTS average domestic airfare 2023–24 ≈ $350–400 round trip.
 */
export const AVG_FLIGHT_COST_ROUND_TRIP = 380;

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface RoadTripInputs {
  /** One-way distance in miles */
  distanceMiles: number;
  /** EPA combined fuel economy in MPG */
  mpg: number;
  /** Percentage of trip that is highway driving (50–100) */
  highwayPct: number;
  /** Round-trip toll estimate in $ */
  tolls: number;
  /** Number of passengers sharing the cost (≥ 1) */
  passengers: number;
}

export interface RoadTripData {
  /** Live state gasoline price in $/gal (injected from dataset) */
  gasPrice: number;
}

export interface RoadTripResult {
  /** Effective real-world MPG after highway/city blending */
  effectiveMpg: number;
  /** Gallons needed one way */
  gallonsOneWay: number;
  /** Gallons needed round trip */
  gallonsRoundTrip: number;
  /** Fuel cost one way ($) */
  oneWayFuelCost: number;
  /** Fuel cost round trip ($) */
  roundTripFuelCost: number;
  /** Round-trip fuel + tolls ($) */
  totalTripCost: number;
  /** Total trip cost ÷ passengers ($) */
  costPerPerson: number;
  /** Fuel cost per mile, round trip ($/mi) */
  costPerMile: number;
  /** Cost if all highway (best case) */
  allHighwayCost: number;
  /** Cost if all city (worst case) */
  allCityCost: number;
  /** Echoed gas price for sublabels */
  gasPrice: number;
  /** Required for CalculatorOutputs assignability */
  [key: string]: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const round2 = (n: number) => Math.round(n * 100) / 100;
const round1 = (n: number) => Math.round(n * 10) / 10;
const round3 = (n: number) => Math.round(n * 1000) / 1000;

// ─── Calculation ──────────────────────────────────────────────────────────────

export function calculateRoadTripCost(
  inputs: RoadTripInputs,
  data: RoadTripData,
): RoadTripResult {
  const dist      = Math.max(0, Number(inputs.distanceMiles) || 0);
  const mpg       = Math.max(1, Number(inputs.mpg) || 1);
  const hwyFrac   = Math.min(1, Math.max(0, (Number(inputs.highwayPct) || 0) / 100));
  const tolls     = Math.max(0, Number(inputs.tolls) || 0);
  const pax       = Math.max(1, Math.round(Number(inputs.passengers) || 1));
  const price     = Math.max(0, Number(data.gasPrice) || 0);

  const cityFrac     = 1 - hwyFrac;
  const effectiveMpg = round1(
    mpg * (hwyFrac * (1 + EPA_HWY_BONUS) + cityFrac * (1 - EPA_CITY_PENALTY)),
  );
  const safeMpg = Math.max(1, effectiveMpg);

  const gallonsOneWay    = round1(dist / safeMpg);
  const gallonsRoundTrip = round1(gallonsOneWay * 2);
  const oneWayFuelCost   = round2(gallonsOneWay * price);
  const roundTripFuelCost = round2(gallonsRoundTrip * price);
  const totalTripCost    = round2(roundTripFuelCost + tolls);
  const costPerPerson    = round2(totalTripCost / pax);
  const costPerMile      = dist > 0 ? round3(roundTripFuelCost / (dist * 2)) : 0;

  const allHwyMpg  = Math.max(1, round1(mpg * (1 + EPA_HWY_BONUS)));
  const allCityMpg = Math.max(1, round1(mpg * (1 - EPA_CITY_PENALTY)));
  const allHighwayCost = round2((dist * 2 / allHwyMpg) * price);
  const allCityCost    = round2((dist * 2 / allCityMpg) * price);

  return {
    effectiveMpg,
    gallonsOneWay,
    gallonsRoundTrip,
    oneWayFuelCost,
    roundTripFuelCost,
    totalTripCost,
    costPerPerson,
    costPerMile,
    allHighwayCost,
    allCityCost,
    gasPrice: price,
  };
}
