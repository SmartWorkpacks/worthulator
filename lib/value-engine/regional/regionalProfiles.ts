// ─── WVE Regional Intelligence — Profiles ─────────────────────────────────────
// Economic environment profiles for key US regions + UK.
// These are NOT simple price multipliers — they describe the economic context
// of the region, used for trust framing, monetization weighting, and AI context.
//
// Pure data — no runtime side-effects, SSR-safe.
// Adding a region: copy the `nationwide` entry, update all fields.

import type { RegionalEconomicProfile } from "../types";

export const REGIONAL_PROFILES: Record<string, RegionalEconomicProfile> = {

  // ── National fallback ────────────────────────────────────────────────────
  nationwide: {
    regionId: "nationwide",
    label: "National Average",
    laborTier: "average",
    materialVolatility: 5,
    financingPressure: 5,
    inflationPressure: 5,
    disasterExposure: "low",
    regulationIntensity: "moderate",
    insurancePressure: 5,
    monetizationMultiplier: 1.0,
    regionalConfidence: 8,
  },

  // ── California ───────────────────────────────────────────────────────────
  CA: {
    regionId: "CA",
    label: "California",
    laborTier: "premium",
    materialVolatility: 7,
    financingPressure: 8,
    inflationPressure: 8,
    disasterExposure: "high",         // wildfire, earthquake
    regulationIntensity: "strict",    // Title 24, CARB, solar mandates
    insurancePressure: 9,
    monetizationMultiplier: 1.6,
    regionalConfidence: 9,
  },

  // ── Texas ────────────────────────────────────────────────────────────────
  TX: {
    regionId: "TX",
    label: "Texas",
    laborTier: "above-average",
    materialVolatility: 5,
    financingPressure: 6,
    inflationPressure: 6,
    disasterExposure: "moderate",     // hurricane coast, hail, ice storms
    regulationIntensity: "light",
    insurancePressure: 7,
    monetizationMultiplier: 1.5,
    regionalConfidence: 9,
  },

  // ── Florida ──────────────────────────────────────────────────────────────
  FL: {
    regionId: "FL",
    label: "Florida",
    laborTier: "above-average",
    materialVolatility: 6,
    financingPressure: 7,
    inflationPressure: 7,
    disasterExposure: "high",         // hurricane corridor
    regulationIntensity: "moderate",  // FL building code post-Andrew
    insurancePressure: 10,
    monetizationMultiplier: 1.55,
    regionalConfidence: 9,
  },

  // ── New York ─────────────────────────────────────────────────────────────
  NY: {
    regionId: "NY",
    label: "New York",
    laborTier: "premium",
    materialVolatility: 6,
    financingPressure: 7,
    inflationPressure: 8,
    disasterExposure: "low",
    regulationIntensity: "strict",
    insurancePressure: 7,
    monetizationMultiplier: 1.5,
    regionalConfidence: 8,
  },

  // ── Arizona ──────────────────────────────────────────────────────────────
  AZ: {
    regionId: "AZ",
    label: "Arizona",
    laborTier: "average",
    materialVolatility: 5,
    financingPressure: 6,
    inflationPressure: 6,
    disasterExposure: "moderate",     // extreme heat, wildfire fringe
    regulationIntensity: "light",
    insurancePressure: 5,
    monetizationMultiplier: 1.3,
    regionalConfidence: 8,
  },

  // ── Georgia ──────────────────────────────────────────────────────────────
  GA: {
    regionId: "GA",
    label: "Georgia",
    laborTier: "below-average",
    materialVolatility: 4,
    financingPressure: 5,
    inflationPressure: 5,
    disasterExposure: "moderate",     // tornado corridor fringe, occasional hurricane
    regulationIntensity: "light",
    insurancePressure: 6,
    monetizationMultiplier: 1.2,
    regionalConfidence: 8,
  },

  // ── South Carolina ───────────────────────────────────────────────────────
  SC: {
    regionId: "SC",
    label: "South Carolina",
    laborTier: "below-average",
    materialVolatility: 4,
    financingPressure: 5,
    inflationPressure: 5,
    disasterExposure: "moderate",
    regulationIntensity: "light",
    insurancePressure: 6,
    monetizationMultiplier: 1.15,
    regionalConfidence: 7,
  },

  // ── Illinois ─────────────────────────────────────────────────────────────
  IL: {
    regionId: "IL",
    label: "Illinois",
    laborTier: "above-average",
    materialVolatility: 5,
    financingPressure: 6,
    inflationPressure: 6,
    disasterExposure: "low",
    regulationIntensity: "moderate",
    insurancePressure: 5,
    monetizationMultiplier: 1.25,
    regionalConfidence: 8,
  },

  // ── Colorado ─────────────────────────────────────────────────────────────
  CO: {
    regionId: "CO",
    label: "Colorado",
    laborTier: "above-average",
    materialVolatility: 5,
    financingPressure: 6,
    inflationPressure: 6,
    disasterExposure: "moderate",     // hail, wildfire interface
    regulationIntensity: "moderate",
    insurancePressure: 7,
    monetizationMultiplier: 1.3,
    regionalConfidence: 8,
  },

  // ── Washington ───────────────────────────────────────────────────────────
  WA: {
    regionId: "WA",
    label: "Washington",
    laborTier: "premium",
    materialVolatility: 6,
    financingPressure: 7,
    inflationPressure: 7,
    disasterExposure: "moderate",     // earthquake zone
    regulationIntensity: "strict",
    insurancePressure: 6,
    monetizationMultiplier: 1.45,
    regionalConfidence: 8,
  },

  // ── United Kingdom ───────────────────────────────────────────────────────
  UK: {
    regionId: "UK",
    label: "United Kingdom",
    laborTier: "above-average",
    materialVolatility: 6,
    financingPressure: 6,
    inflationPressure: 7,             // post-2022 inflationary environment
    disasterExposure: "minimal",
    regulationIntensity: "strict",    // Building Regulations, Part L
    insurancePressure: 5,
    monetizationMultiplier: 1.2,
    regionalConfidence: 7,
  },
};

/** Ordered list of US state codes in the registry (for UI dropdowns) */
export const SUPPORTED_REGIONS = Object.keys(REGIONAL_PROFILES);
