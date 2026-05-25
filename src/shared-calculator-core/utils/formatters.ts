// ─── Shared Calculator Core — Formatters ──────────────────────────────────────
//
// PURPOSE:
//   Generic display helpers for all calculator output values.
//   No site-specific logic. All functions are pure.
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── Currency ─────────────────────────────────────────────────────────────────

/**
 * Format a number as currency.
 * @example formatCurrency(1234.5) → "$1,235"
 */
export function formatCurrency(
  value: number,
  locale = "en-US",
  currency = "USD",
  decimals = 0,
): string {
  return new Intl.NumberFormat(locale, {
    style:                 "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Compact currency format for large values.
 * @example formatCurrencyCompact(12500) → "$12.5K"
 */
export function formatCurrencyCompact(value: number, locale = "en-US", currency = "USD"): string {
  if (Math.abs(value) >= 1_000_000) {
    return formatCurrency(value / 1_000_000, locale, currency, 2).replace(/\.?0+$/, "") + "M";
  }
  if (Math.abs(value) >= 1_000) {
    return formatCurrency(value / 1_000, locale, currency, 1).replace(/\.?0+$/, "") + "K";
  }
  return formatCurrency(value, locale, currency, 0);
}

// ─── Energy ──────────────────────────────────────────────────────────────────

/**
 * Format kWh value with appropriate unit.
 * @example formatKwh(1234) → "1,234 kWh"
 */
export function formatKwh(value: number, decimals = 0): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(2)} GWh`;
  if (Math.abs(value) >= 1_000)     return `${(value / 1_000).toFixed(1)} MWh`;
  return `${value.toLocaleString("en-US", { maximumFractionDigits: decimals })} kWh`;
}

/**
 * Format kW power value.
 * @example formatKw(5.5) → "5.5 kW"
 */
export function formatKw(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)} kW`;
}

/**
 * Format $/kWh rate.
 * @example formatRatePerKwh(0.1659) → "$0.166/kWh"
 */
export function formatRatePerKwh(value: number): string {
  return `$${value.toFixed(3)}/kWh`;
}

// ─── Percent ─────────────────────────────────────────────────────────────────

/**
 * Format decimal as percent.
 * @example formatPercent(0.075) → "7.5%"
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a whole-number percentage (already multiplied).
 * @example formatPercentWhole(75) → "75%"
 */
export function formatPercentWhole(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

// ─── Time ────────────────────────────────────────────────────────────────────

/**
 * Format a year count with fractional part.
 * @example formatYears(8.3) → "8.3 years"
 */
export function formatYears(value: number, decimals = 1): string {
  if (value === Infinity || value > 100) return "Never";
  return `${value.toFixed(decimals)} years`;
}

/**
 * Format years as "X yrs Y mo".
 * @example formatYearsMonths(8.5) → "8 yrs 6 mo"
 */
export function formatYearsMonths(value: number): string {
  if (value === Infinity || value > 100) return "Never";
  const years  = Math.floor(value);
  const months = Math.round((value - years) * 12);
  if (months === 0) return `${years} yr${years !== 1 ? "s" : ""}`;
  return `${years} yr${years !== 1 ? "s" : ""} ${months} mo`;
}

// ─── Generic number ───────────────────────────────────────────────────────────

/**
 * Format a plain number with locale separators.
 * @example formatNumber(12345.67, 2) → "12,345.67"
 */
export function formatNumber(value: number, decimals = 0, locale = "en-US"): string {
  return value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format CO₂ tonnes.
 * @example formatCo2(1.23) → "1.23 t CO₂"
 */
export function formatCo2(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)} t CO₂`;
}
