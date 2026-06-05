# Compound Interest Calculator — Build Dossier

## Identity
- **Slug:** `compound-interest-calculator`
- **Category:** finance
- **Architecture:** Bespoke custom UI (`components/calculators/CompoundInterestCalculator.tsx`) — NOT the shared engine. Includes charts, scenario comparison, year-by-year schedule, and advanced inputs.
- **Promise:** The most complete compound-growth view on the web — monthly contributions, compounding frequency, contribution growth, inflation, and tax in one tool.

## Flagship audit (this pass)
- **Added tests** — `lib/configs/compoundInterestConfig.test.ts` (17 tests). The pure logic previously had zero coverage.
- **Live CPI wiring** — the inflation default now reads `getCpiInflationYoY()` (FRED) instead of the static dataStore value, and the UI stamps the source/vintage (`Default 3.2% from live FRED CPI (Q1 2026)`).
- **Removed legacy `<InsightTable>`** — the stray dark-theme static table that clashed with the light page; the calculator already carries rich inline insights.
- Metadata year bumped 2025 → 2026; Tailwind v4 gradient class fixed.

## Live data layer
- **FRED CPI (YoY inflation)** via `getCpiInflationYoY()` — default for the inflation field, stamped in the UI. Static fallback via the FRED dataset.

## Fields
| Field | Default | Notes |
|------|---------|-------|
| Initial investment | $10,000 | Lump sum |
| Monthly contribution | $200 | |
| Annual rate | 7% (`stockMarketReturn`) | Presets: 4 / 7 / 10% |
| Years | 20 | 1–50 |
| Compounding | Monthly | Monthly / Quarterly / Annually |
| Inflation (advanced) | live CPI (3.2%) | today's-dollars view |
| Contribution growth (advanced) | 0% | salary-linked increases |
| Tax on gains (advanced) | off / 22% | taxes interest only |

## Pure functions (`lib/configs/compoundInterestConfig.ts`)
`buildCompoundSchedule`, `buildCompoundScheduleAdvanced` (contribution growth), `calcFinalBalance` (closed-form annuity), `adjustForInflation`, `calcAfterTax`.

## Invariants (17 Vitest tests)
- Year 0 = principal, no interest; schedule length = years + 1.
- Total contributions = principal + monthly × 12 × years; final = contributions + interest.
- 0% rate → interest 0; balance monotonic; higher rate → higher balance.
- Schedule ≈ closed-form annuity formula.
- Advanced schedule == basic when growth = 0; growth raises final monthly + balance.
- Inflation deflates value (0% → unchanged, higher → more drag); tax hits gains only.

## Insights
Rich inline insights in the component (compounding share bar, doubling year / Rule of 72, lump-sum vs contributions delta, contribution-growth, tax, inflation real value) plus charts and scenario comparison. No engine insight generator (custom architecture).

## Notes
- This calculator does not use the shared `CalculatorEngine` or `LiveInsightBlock` registry; it is self-contained.
