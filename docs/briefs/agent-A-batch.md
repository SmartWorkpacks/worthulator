# Build Batch — Owner A (me) (129 calculators)

**You are building a batch of Worthulator calculators to the flagship standard.**
Work top-down by search volume (highest first). Do the whole batch; one calculator at a time.

> ⛔ **PROTECTED FILES — Cursor (Owner A) only.** You may READ (and import from)
> but must NOT edit `src/**`, `lib/datasets/**`, `lib/dataStore.ts`, `scripts/**`,
> `.github/workflows/**`, the rollout docs (`docs/FLAGSHIP-CALCULATOR-STANDARD.md`,
> `docs/PHASE2-ROLLOUT-BRIEFS.md`, `docs/research/**`, `docs/briefs/**`), or
> `AGENTS.md`. If you need a change there, **STOP and ask Cursor for permission** —
> do not work around it. See `AGENTS.md` → "Protected files".

## Read first, in order
1. `AGENTS.md` — this is Next.js 16 with breaking changes. Before any Next-specific code, read the relevant guide in `node_modules/next/dist/docs/`.
2. `docs/FLAGSHIP-CALCULATOR-STANDARD.md` — the canonical standard + Definition of Done. Follow it exactly.
3. The gold reference (copy its structure): `app/tools/freelance-rate-calculator/{page.tsx,FreelanceRateCalculator.tsx,FreelanceRateCalculatorLoader.tsx}` and `lib/calculators/freelanceRateEngine.ts` (+ `.test.ts`).
4. The shared Insight Kit: `src/templates/insights/` — USE these (`useStagedReveal`, `ResultHeroCard`, `InsightList`, `ImpactLineChart`, `BreakdownBarChart`, `NumInput`, `SectionLabel`). Do NOT re-implement count-up hooks, hero cards, insight cards, charts, or the staged-reveal loop.

## For EACH calculator below
- Write a dossier `docs/dossiers/<slug>.md` (identity, inputs, formulas + sources, insights).
- Build a pure engine `lib/calculators/<name>Engine.ts` with **≥6 Vitest tests** (known values, invariants, zero/NaN guards). Document every constant with a source.
- Build `app/tools/<slug>/<Name>Calculator.tsx` (client) + `<Name>CalculatorLoader.tsx` (dynamic, ssr:false) using the Insight Kit: `useStagedReveal` + loaders, `ResultHeroCard`, `InsightList`, and ≥1 chart where it adds real insight.
- Build `app/tools/<slug>/page.tsx` (server): metadata, hero, SEO block, FAQ, JSON-LD — **all copy must match the engine exactly** (formula, steps, stat chips, recomputed FAQ numbers). This is Step 5b in the standard.

## Live data (read §4 of the standard before building any finance/energy calc)
- If your calculator's default depends on a market rate or regional price (mortgage/loan/CD/HYSA APR, gas/electricity/water/tax, wages, inflation/CPI), CONSUME the existing dataset in `lib/datasets/**` (e.g. `fredBenchmarks`, `getUSStateFuelPrice`). Calculators NEVER fetch at runtime.
- **Derive, never hardcode.** Any data-derived number in page copy (stat chips, FAQ, content cards, JSON-LD) must be computed at render from the dataset and stamped "as of" `currentPeriodLabel`/`lastUpdated`. Copy the `app/tools/ev-vs-gas/page.tsx` pattern. Hardcoded live numbers go stale and break the moat.
- Need a data series that doesn't exist yet (e.g. live mortgage rate)? Do NOT add a runtime fetch — flag Owner A to add it to `lib/datasets/refreshRegistry.ts`, and use a clearly-sourced static default meanwhile.

## Hard rules (collision safety)
- Touch ONLY your assigned slugs' files. Do NOT edit `src/**` (Owner A owns all shared infra), `lib/datasets/**`, or any other owner's calculators.
- No invented statistics — every figure in copy is defensible/sourced or framed as a typical range.
- No misleading "Live" badge unless a real live dataset is wired in.
- Before finishing: `npx tsc --noEmit` clean, `npm run lint` clean, `npm test` green.
- If you need a new shared component or dataset series, STOP and request it from Owner A — don't fork the kit or add runtime fetches.

## Your slugs (build highest-volume first)

**Date & Time** (13)
- `age-calculator` — "age calculator" · 823k/mo · KD 76 · Navigational
- `time-calculator` — "time calculator" · 550k/mo · KD 84 · Informational, Transactional
- `time-card-calculator` — "time card calculator" · 110k/mo · KD 61 · Informational
- `average-calculator` — "average calculator" · 74k/mo · KD 59 · Transactional
- `chronological-age-calculator` — "chronological age calculator" · 41k/mo · KD 29 · Informational
- `time-sheet-calculator` — "time sheet calculator" · 33k/mo · KD 63 · Informational
- `dog-age-calculator` — "dog age calculator" · 27k/mo · KD 42 · Informational
- `mortage-calculator` — "mortage calculator" · 27k/mo · KD 84 · Commercial
- `work-time-calculator` — "work time calculator" · 22k/mo · KD 65 · Informational
- `morgage-calculator` — "morgage calculator" · 22k/mo · KD 83 · Commercial
- `gas-mileage-calculator` — "gas mileage calculator" · 12k/mo · KD 73 · Transactional
- `time-to-decimal-calculator` — "time to decimal calculator" · 8k/mo · KD 27 · Informational
- `hours-to-decimal-calculator` — "hours to decimal calculator" · 5k/mo · KD 20 · Informational

**Finance & Loans** (56)
- `amortization-calculator` — "amortization calculator" · 246k/mo · KD 70 · Informational
- `mortgage-payment-calculator` — "mortgage payment calculator" · 201k/mo · KD 81 · Commercial
- `salary-calculator` — "salary calculator" · 165k/mo · KD 80 · Informational, Commercial
- `loan-payment-calculator` — "loan payment calculator" · 110k/mo · KD 80 · Informational
- `home-loan-calculator` — "home loan calculator" · 74k/mo · KD 79 · Commercial
- `home-equity-loan-calculator` — "home equity loan calculator" · 50k/mo · KD 68 · Commercial
- `apy-calculator` — "apy calculator" · 41k/mo · KD 61 · Commercial
- `rent-calculator` — "rent calculator" · 41k/mo · KD 59 · Informational
- `mortgage-loan-calculator` — "mortgage loan calculator" · 41k/mo · KD 83 · Commercial
- `dividend-calculator` — "dividend calculator" · 33k/mo · KD 35 · Informational
- `annuity-calculator` — "annuity calculator" · 33k/mo · KD 60 · Commercial
- `interest-rate-calculator` — "interest rate calculator" · 33k/mo · KD 77 · Commercial
- `tax-refund-2025-calculator` — "tax refund calculator 2025" · 33k/mo · KD 62 · Commercial
- `cars-car-payment-calculator` — "cars car payment calculator" · 33k/mo · KD 78 · Informational
- `cubic-feet-calculator` — "cubic feet calculator" · 27k/mo · KD 42 · Informational
- `loan-payoff-calculator` — "loan payoff calculator" · 27k/mo · KD 57 · Commercial
- `apr-calculator` — "apr calculator" · 27k/mo · KD 59 · Informational
- `fha-loan-calculator` — "fha loan calculator" · 27k/mo · KD 74 · Commercial
- `home-affordability-calculator` — "home affordability calculator" · 27k/mo · KD 72 · Informational
- `house-payment-calculator` — "house payment calculator" · 27k/mo · KD 83 · Commercial
- `payment-home-equity-line-calculator` — "payment calculator home equity line" · 22k/mo · KD 67 · Commercial
- `options-profit-calculator` — "options profit calculator" · 22k/mo · KD 59 · Transactional
- `tax-withholding-calculator` — "tax withholding calculator" · 22k/mo · KD 79 · Informational, Commercial
- `home-mortgage-calculator` — "home mortgage calculator" · 22k/mo · KD 82 · Commercial
- `annual-salary-calculator` — "annual salary calculator" · 22k/mo · KD 78 · Informational
- `income-calculator` — "income calculator" · 18k/mo · KD 77 · Informational, Commercial
- `loan-interest-calculator` — "loan interest calculator" · 18k/mo · KD 80 · Commercial
- `debt-to-income-ratio-calculator` — "debt to income ratio calculator" · 18k/mo · KD 69 · Informational
- `federal-income-tax-calculator` — "federal income tax calculator" · 18k/mo · KD 82 · Commercial
- `overtime-calculator` — "overtime calculator" · 15k/mo · KD 35 · Informational
- `business-loan-calculator` — "business loan calculator" · 15k/mo · KD 64 · Commercial
- `land-loan-calculator` — "land loan calculator" · 15k/mo · KD 49 · Commercial
- `net-income-calculator` — "net income calculator" · 15k/mo · KD 77 · Informational, Commercial
- `figure-simple-interest-calculator` — "figure simple interest calculator" · 15k/mo · KD 71 · Commercial
- `federal-income-tax-rate-calculator` — "federal income tax rate calculator" · 15k/mo · KD 50 · Informational
- `finding-cubic-feet-calculator` — "finding cubic feet calculator" · 12k/mo · KD 20 · Informational
- `heloc-loan-calculator` — "heloc loan calculator" · 12k/mo · KD 70 · Commercial
- `student-loan-repayment-calculator` — "student loan repayment calculator" · 12k/mo · KD 81 · Informational
- `interest-only-loan-calculator` — "interest only loan calculator" · 12k/mo · KD 52 · Commercial
- `savings-account-calculator` — "savings account calculator" · 12k/mo · KD 57 · Informational
- `auto-lease-calculator` — "auto lease calculator" · 12k/mo · KD 56 · Commercial
- `commercial-loan-calculator` — "commercial loan calculator" · 12k/mo · KD 55 · Commercial
- `property-tax-calculator` — "property tax calculator" · 12k/mo · KD 43 · Informational
- `board-feet-calculator` — "board feet calculator" · 12k/mo · KD 19 · Informational
- `car-refinance-calculator` — "car refinance calculator" · 12k/mo · KD 58 · Commercial
- `return-on-investment-calculator` — "return on investment calculator" · 12k/mo · KD 70 · Informational, Transactional
- `crypto-profit-calculator` — "crypto profit calculator" · 10k/mo · KD 33 · Informational
- `credit-card-payment-calculator` — "credit card payment calculator" · 10k/mo · KD 43 · Commercial
- `home-equity-line-of-credit-calculator` — "home equity line of credit calculator" · 10k/mo · KD 65 · Informational
- `student-loan-payment-calculator` — "student loan payment calculator" · 10k/mo · KD 77 · Informational
- `option-profit-calculator` — "option profit calculator" · 10k/mo · KD 52 · Transactional
- `debt-calculator` — "debt calculator" · 10k/mo · KD 75 · Commercial
- `mit-living-wage-calculator` — "mit living wage calculator" · 8k/mo · KD 31 · Navigational
- `fidelity-ira-minimum-distribution-calculator` — "fidelity ira minimum distribution calculator" · 8k/mo · KD 70 · Navigational, Transactional
- `rocket-mortgage-calculator` — "rocket mortgage calculator" · 8k/mo · KD 55 · Navigational
- `raise-calculator` — "raise calculator" · 7k/mo · KD 23 · Informational

**Health & Fitness** (16)
- `bmi-calculator` — "bmi calculator" · 4.1M/mo · KD 95 · Informational
- `bac-calculator` — "bac calculator" · 135k/mo · KD 48 · Informational
- `pace-calculator` — "pace calculator" · 91k/mo · KD 68 · Commercial
- `sleep-calculator` — "sleep calculator" · 74k/mo · KD 68 · Informational
- `one-rep-max-calculator` — "one rep max calculator" · 74k/mo · KD 68 · Informational
- `weight-loss-calculator` — "weight loss calculator" · 61k/mo · KD 62 · Informational
- `1rm-calculator` — "1rm calculator" · 61k/mo · KD 50 · Informational
- `protein-calculator` — "protein calculator" · 50k/mo · KD 57 · Informational
- `body-fat-percentage-calculator` — "body fat percentage calculator" · 33k/mo · KD 55 · Informational
- `calories-burned-calculator` — "calories burned calculator" · 22k/mo · KD 52 · Informational
- `calorie-for-weight-loss-calculator` — "calorie calculator for weight loss" · 22k/mo · KD 59 · Informational
- `ideal-body-weight-calculator` — "ideal body weight calculator" · 18k/mo · KD 57 · Informational
- `kcal-weight-loss-calculator` — "kcal weight loss calculator" · 18k/mo · KD 71 · Informational
- `weight-calculator` — "weight calculator" · 18k/mo · KD 84 · Informational
- `blood-alcohol-calculator` — "blood alcohol calculator" · 15k/mo · KD 45 · Informational
- `recipe-calorie-calculator` — "recipe calorie calculator" · 12k/mo · KD 55 · Informational

**Home & Construction** (12)
- `concrete-calculator` — "concrete calculator" · 368k/mo · KD 28 · Informational
- `gravel-calculator` — "gravel calculator" · 41k/mo · KD 44 · Informational
- `cubic-yard-calculator` — "cubic yard calculator" · 27k/mo · KD 49 · Informational
- `stair-calculator` — "stair calculator" · 22k/mo · KD 43 · Informational
- `paint-calculator` — "paint calculator" · 22k/mo · KD 39 · Informational
- `fuel-cost-calculator` — "fuel cost calculator" · 18k/mo · KD 69 · Transactional
- `soil-calculator` — "soil calculator" · 15k/mo · KD 44 · Informational
- `roofing-calculator` — "roofing calculator" · 10k/mo · KD 33 · Commercial
- `mpg-calculator` — "mpg calculator" · 10k/mo · KD 66 · Informational
- `stair-stringer-calculator` — "stair stringer calculator" · 10k/mo · KD 33 · Informational
- `fence-calculator` — "fence calculator" · 8k/mo · KD 25 · Informational
- `sod-calculator` — "sod calculator" · 7k/mo · KD 19 · Informational

**Other & Misc** (28)
- `math-calculator` — "math calculator" · 91k/mo · KD 100 · Informational
- `calendar-calculator` — "calendar calculator" · 50k/mo · KD 69 · Informational
- `square-foot-calculator` — "square foot calculator" · 50k/mo · KD 43 · Informational
- `financial-calculator` — "financial calculator" · 50k/mo · KD 81 · Informational, Transactional
- `day-calculator` — "day calculator" · 50k/mo · KD 66 · Informational, Transactional
- `car-finance-calculator` — "car finance calculator" · 41k/mo · KD 75 · Commercial
- `gas-calculator` — "gas calculator" · 27k/mo · KD 67 · Transactional
- `irs-withholding-calculator` — "irs withholding calculator" · 27k/mo · KD 82 · Navigational, Transactional
- `max-bench-calculator` — "max bench calculator" · 22k/mo · KD 28 · Informational
- `sqft-calculator` — "sqft calculator" · 22k/mo · KD 67 · Informational
- `racine-carree-calculator` — "racine carree calculator" · 18k/mo · KD 14 · Informational
- `stock-calculator` — "stock calculator" · 18k/mo · KD 53 · Informational
- `cagr-calculator` — "cagr calculator" · 18k/mo · KD 50 · Informational
- `abv-calculator` — "abv calculator" · 18k/mo · KD 28 · Informational
- `bench-calculator` — "bench calculator" · 18k/mo · KD 34 · Informational
- `cpi-calculator` — "cpi calculator" · 18k/mo · KD 92 · Informational
- `net-calculator` — "calculator net calculator" · 18k/mo · KD 61 · Navigational
- `car-insurance-calculator` — "car insurance calculator" · 15k/mo · KD 52 · Commercial
- `strength-calculator` — "strength calculator" · 15k/mo · KD 24 · Navigational
- `net-pay-calculator` — "net pay calculator" · 15k/mo · KD 88 · Navigational
- `nutrition-calculator` — "nutrition calculator" · 15k/mo · KD 86 · Informational
- `construction-calculator` — "construction calculator" · 12k/mo · KD 48 · Commercial
- `decimal-calculator` — "decimal calculator" · 12k/mo · KD 40 · Informational
- `increase-calculator` — "increase calculator" · 10k/mo · KD 66 · Informational
- `golf-handicap-calculator` — "golf handicap calculator" · 10k/mo · KD 43 · Informational
- `change-calculator` — "change calculator" · 8k/mo · KD 52 · Informational
- `insurance-calculator` — "insurance calculator" · 7k/mo · KD 60 · Commercial
- `whole-life-insurance-calculator` — "whole life insurance calculator" · 7k/mo · KD 40 · Informational

**Pregnancy & Baby** (4)
- `due-date-calculator` — "due date calculator" · 368k/mo · KD 69 · Informational
- `ovulation-calculator` — "ovulation calculator" · 165k/mo · KD 73 · Informational
- `conception-calculator` — "conception calculator" · 61k/mo · KD 63 · Informational
- `conception-date-calculator` — "conception date calculator" · 18k/mo · KD 69 · Informational

