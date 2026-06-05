# Calculator Build Dossier — RMD Calculator

## 1. Identity
- **Slug:** `rmd-calculator`
- **Route:** `/tools/rmd-calculator`
- **Primary keyword:** "rmd calculator" · 74k/mo · KD 50 · Informational
- **One-line value:** Work out the required minimum distribution from a traditional
  IRA/401(k) for the year, the withdrawal percentage, monthly equivalent, and how the
  requirement trends over the next decade.
- **Owner:** Owner B (Copilot)
- **Category:** Finance / Retirement.

## 2. Inputs
| Field | Type | Default | Notes |
|---|---|---|---|
| Account balance | number | 500,000 | Prior year-end (Dec 31) balance |
| Age | number | 73 | Age reached this calendar year (clamped 72–120) |
| Expected return | % | 5 | Growth assumption — projection only |

## 3. Outputs
- This year's RMD (hero).
- Distribution period (IRS factor), withdrawal % (1 ÷ factor), monthly equivalent.
- RMD vs balance that stays invested.
- 10-year projection of RMDs by age.

## 4. Formulas + sources
```
factor = IRS Uniform Lifetime Table[age]
RMD    = priorYearEndBalance ÷ factor
rate   = (1 ÷ factor) × 100
projection (each year):
   rmd     = balance ÷ factor(age)
   balance = (balance − rmd) × (1 + return)
```
- **IRS Uniform Lifetime Table**, effective 2022 (Pub. 590-B, Appendix B, Table III),
  embedded as a static constant in the engine with source comment. Ages clamp to
  72–120. Required beginning age 73 (SECURE 2.0, 2023–2032). Excise tax 25% (10% if
  corrected promptly). No live data — this is statutory reference data.

## 5. Invariants / guardrails
- `RMD = balance ÷ factor`; `rate = 1 ÷ factor`.
- Withdrawal % and RMD rise with age (factor decreases monotonically).
- `RMD + staysInvested = balance`.
- Projection has fixed length (10), ages ascending, all finite.
- `isRequiredAge = age ≥ 73`.
- Zero balance → zero RMD; all outputs finite on NaN inputs; age/return clamped.

## 6. Live datasets
- **None.** Uses static IRS statutory table; no market data.

## 7. Insights
- The required dollar amount and what it is as a percentage of the balance.
- That the percentage rises with age as the factor shrinks.
- The 25% / 10% missed-RMD excise tax and the Dec 31 deadline.

## 8. Visuals
- `ResultHeroCard`: this year's RMD, with monthly / stays-invested / rate sub-stats.
- `BreakdownBarChart`: RMD vs balance that stays invested.
- `ImpactLineChart`: projected RMD by age over 10 years.

## 9. Build checklist
- [x] Pure engine `lib/calculators/rmdEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD
- [x] `npx tsc --noEmit`, lint, tests green
