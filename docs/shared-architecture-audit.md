# Shared Architecture Audit — Worthulator → VPPEXCHANGE
<!-- Generated: May 2026 -->

## Purpose
Identify every reusable infrastructure file in Worthulator that can be safely
copied into a shared calculator core layer for VPPEXCHANGE, **without modifying
or breaking any Worthulator production file**.

---

## 1 — Calculator Engine

### Fully Generic (copy verbatim, update import paths only)

| File | Path | Notes |
|---|---|---|
| Engine types | `components/calculator-engine/types.ts` | No Worthulator content. Pure TS interfaces. |
| State hook | `components/calculator-engine/useCalculator.ts` | Pure React hook. No site-specific deps. |
| Input renderer | `components/calculator-engine/InputField.tsx` | Imports `@/components/ui/slider` — needs path swap. |
| Output card | `components/calculator-engine/OutputCard.tsx` | Zero site-specific content. Pure UI component. |

### Needs Stripping Before Copy

| File | Path | What to Remove |
|---|---|---|
| Engine renderer | `components/calculator-engine/CalculatorEngine.tsx` | Imports `WorthulatorProgressLoader`, `WorthulatorResultReveal`, `take-home-pay` templates. Replace with generic equivalents. |
| Engine loader | `components/calculator-engine/CalculatorEngineLoader.tsx` | Import of `CALCULATOR_CONFIGS` (Worthulator-specific config registry). Replace with generic dynamic registry. |
| Calculator configs | `components/calculator-engine/calculatorConfigs.ts` | **NOT COPYABLE** — 100% Worthulator-specific. VPPExchange creates its own config file. |

### SSR Notes
- `CalculatorEngineLoader` uses `dynamic(..., { ssr: false })` — **required for all calc engines**.
- All `useState` initializers use `WCD` defaults frozen at module load — VPPExchange replaces WCD with its own defaults object.

---

## 2 — Insight System

### Fully Generic (copy verbatim, update import paths only)

| File | Path | Notes |
|---|---|---|
| Insight types | `lib/insights/types.ts` | Pure TS. No site deps. 100% portable. |
| Math projections | `lib/insights/projections.ts` | Pure math functions. Import of `getFinanceValue` needs swapping to a generic defaults object. |
| Insight card UI | `components/worthcore/InsightCard.tsx` | Remove `bg-linear-to-r from-emerald-400 to-emerald-600` brand stripe or make it theme-configurable. |
| Insight visual | `components/worthcore/visuals/InsightVisual.tsx` | Generic dispatch component. No site content. |
| Index barrel | `lib/insights/index.ts` | Update re-export paths. |

### Needs Stripping Before Copy

| File | Path | What to Remove |
|---|---|---|
| Benchmark helpers | `lib/insights/benchmarks.ts` | Remove `usStateFuelDataset` + `usCostDataset` Worthulator-specific fuel/cost imports. Keep generic `compareToReference`, `calculatePercentDiff`, `formatCurrency` utilities. |
| Live insight block | `components/worthcore/LiveInsightBlock.tsx` | Remove all 50+ Worthulator generator imports. Keep the orchestration pattern and GENERATOR_REGISTRY structure — VPPExchange registers its own generators. |

### Insight Generators (NOT copied — Worthulator-specific)

| Folder | Path | Status |
|---|---|---|
| 50+ generators | `lib/insights/generators/*.ts` | All finance/lifestyle-specific. VPPExchange writes its own energy generators. |
| 50+ wrappers | `components/worthcore/*WithInsights.tsx` | All Worthulator calculator wrappers. Not portable. |

---

## 3 — Chart System

### Fully Generic (copy verbatim, update import paths only)

| File | Path | Notes |
|---|---|---|
| Line/area chart | `components/worthcore/visuals/RechartsLineChart.tsx` | Zero site content. Pure Recharts wrapper. |
| Bar chart | `components/worthcore/visuals/RechartsBarChart.tsx` | Zero site content. |
| Donut chart | `components/worthcore/visuals/RechartsDonutChart.tsx` | Zero site content. |
| ApexCharts variants | `components/worthcore/visuals/Apex*.tsx` | Optional — ApexCharts is an additional dependency. |

### Dependencies Required
```
recharts ^3
# OR
apexcharts + react-apexcharts (optional)
```

---

## 4 — Data Layer

### Fully Generic

| File | Path | Notes |
|---|---|---|
| Data store pattern | `lib/dataStore.ts` | **Architecture is reusable** — the getter/setter pattern. VPPExchange creates its own store with energy keys. |
| Regional benchmarks pattern | `lib/datasets/regional/usRegionalBenchmarks.ts` | Pattern is reusable — VPPExchange creates `regionalUtilityBenchmarks.ts` following same structure. |

### Worthulator-Specific (DO NOT COPY)

| File | Path | Reason |
|---|---|---|
| Cost benchmarks | `lib/datasets/costs/costBenchmarks.ts` | Finance-specific. |
| US cost of living | `lib/datasets/usCostOfLiving.ts` | Lifestyle data. |
| US state fuel prices | `lib/datasets/usStateFuelPrices.ts` | Fuel-specific. |
| WCD defaults | `lib/worthcoreDefaults.ts` | Worthulator finance defaults. |
| Calculator configs | `components/calculator-engine/calculatorConfigs.ts` | 150+ Worthulator calculators. |
| Tax data | `lib/datasets/tax/*` | Worthulator-specific. |
| Salary data | `lib/datasets/salary/*` | Worthulator-specific. |

---

## 5 — Utility Helpers

### Portable

| File | Path | Notes |
|---|---|---|
| General utils | `lib/utils.ts` | Check for Worthulator-specific content first. |
| Country config | `lib/countryConfig.ts` | Locale/currency helpers — generic. |
| Region registry | `lib/regionRegistry.ts` | Pattern reusable. Content may need updating. |

---

## 6 — UI Primitives

### Portable (shadcn/ui — config-driven)

All components in `components/ui/` are generated from **shadcn/ui** — they are
generic by definition. VPPExchange runs `npx shadcn@latest add <component>` to
get the same components independently. **Do not copy** — regenerate fresh.

Required components: `slider`, `button`, `card`, `tabs`, `dialog`, `badge`

---

## 7 — Hooks

### Portable

| File | Path | Notes |
|---|---|---|
| Enhancement hooks | `hooks/enhancements/` | Check individual files for Worthulator imports. |

---

## 8 — Dynamic Import / SSR Sensitivity Map

| File | SSR-Safe? | Dynamic Import Required? |
|---|---|---|
| `useCalculator.ts` | ✅ (hooks require client) | Via `CalculatorEngineLoader` |
| `CalculatorEngine.tsx` | ❌ (uses useState) | Yes — `dynamic(..., { ssr: false })` |
| `InputField.tsx` | ❌ (uses useState) | Loaded via engine loader |
| `InsightCard.tsx` | ✅ | No |
| `LiveInsightBlock.tsx` | ✅ (client-only pattern) | No |
| `RechartsLineChart.tsx` | ✅ | No |
| `RechartsBarChart.tsx` | ✅ | No |
| `lib/insights/types.ts` | ✅ | No |
| `lib/insights/projections.ts` | ✅ | No |
| `lib/dataStore.ts` | ✅ | No |

---

## 9 — Reusability Classification Summary

| Classification | File Count | Action |
|---|---|---|
| Copy verbatim + update imports | ~10 files | Safe copy |
| Copy + strip branding/site content | ~5 files | Surgical edit |
| Pattern reusable, content replaced | ~4 files | Recreate from pattern |
| Worthulator-specific — DO NOT copy | ~50+ files | Leave untouched |

---

## 10 — What VPPEXCHANGE Must Build Fresh

1. **Calculator configs** — `vppexchange-calculator-configs.ts` with energy calc definitions
2. **WCD equivalent** — `VED` (VPP Energy Defaults) object with energy/utility rate defaults
3. **Data store** — energy-domain dataStore with `getEnergyRate()`, `getUtilityRate()` getters
4. **Insight generators** — energy-specific: `vppRoiInsights.ts`, `batteryRoiInsights.ts`, `solarRoiInsights.ts`, etc.
5. **Regional data** — `regionalUtilityBenchmarks.ts` with per-state utility rates
6. **Page templates** — VPPExchange hero, layout, lead gen sections
7. **Brand tokens** — replace emerald (`#10b981`) with VPPExchange brand color in copied UI components

---

*This audit covers Worthulator as of May 2026. No production files were modified.*
