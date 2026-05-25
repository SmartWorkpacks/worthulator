// ─── Shared Calculator Core — Data Defaults ───────────────────────────────────
//
// PURPOSE:
//   Generic placeholder defaults object.
//   In Worthulator:  this is WorthCore Defaults (WCD) loaded from dataStore.ts
//   In VPPExchange:  this is VED (VPP Energy Defaults) from energy/assumptions.ts
//
//   This file provides a HOST-AGNOSTIC baseline for any calculator project.
//   Replace values at startup by calling mergeDefaults(yourValues).
//
// USAGE:
//   import { getDefaults, mergeDefaults } from "../data/defaults";
//   mergeDefaults({ discountRate: 0.06 });
//   const rate = getDefaults().discountRate;
//
// ─────────────────────────────────────────────────────────────────────────────

export interface SharedDefaults {
  // Financial
  discountRate:          number;   // NPV discount rate (decimal)
  inflationRate:         number;   // General inflation (decimal)
  stockMarketReturn:     number;   // Equity opportunity cost (decimal)
  // Cost of living (generic)
  monthlyFoodCost:       number;   // $/month per person baseline
  monthlyHousingCost:    number;   // $/month
  // Energy (populated by VPPExchange via VED)
  utilityRatePerKwh:     number;   // $/kWh
  electricityInflation:  number;   // annual rate (decimal)
  // Locale
  currencyCode:          string;   // "USD" | "GBP" etc.
  locale:                string;   // "en-US" | "en-GB" etc.
}

const BUILT_IN_DEFAULTS: SharedDefaults = {
  discountRate:         0.05,
  inflationRate:        0.032,
  stockMarketReturn:    0.07,
  monthlyFoodCost:      356,
  monthlyHousingCost:   1_500,
  utilityRatePerKwh:    0.1659,
  electricityInflation: 0.027,
  currencyCode:         "USD",
  locale:               "en-US",
};

// Module-level singleton — frozen after first access (Worthulator pattern)
let _defaults: SharedDefaults = { ...BUILT_IN_DEFAULTS };
let _frozen = false;

/** Merge host-project overrides BEFORE any calculator reads defaults. */
export function mergeDefaults(overrides: Partial<SharedDefaults>): void {
  if (_frozen) {
    console.warn("[shared-calculator-core] mergeDefaults() called after defaults were read. Ignored.");
    return;
  }
  _defaults = { ..._defaults, ...overrides };
}

/** Read the final defaults (freezes the object on first call). */
export function getDefaults(): Readonly<SharedDefaults> {
  _frozen = true;
  return Object.freeze({ ..._defaults });
}

/** Reset (for testing only — never call in production). */
export function _resetDefaults_TEST_ONLY(): void {
  _defaults = { ...BUILT_IN_DEFAULTS };
  _frozen = false;
}
