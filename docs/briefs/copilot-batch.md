# Build Batch — Owner B (Copilot) (129 calculators)

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

**Date & Time** (11)
- `date-calculator` — "date calculator" · 368k/mo · KD 83 · Informational, Transactional
- `hours-calculator` — "hours calculator" · 201k/mo · KD 82 · Informational
- `square-footage-calculator` — "square footage calculator" · 74k/mo · KD 42 · Informational
- `timecard-calculator` — "timecard calculator" · 61k/mo · KD 62 · Informational
- `days-calculator` — "days calculator" · 50k/mo · KD 72 · Informational, Transactional
- `timesheet-calculator` — "timesheet calculator" · 41k/mo · KD 65 · Informational
- `date-and-time-calculator` — "date and time calculator" · 41k/mo · KD 94 · Informational, Transactional
- `mileage-calculator` — "mileage calculator" · 27k/mo · KD 63 · Commercial
- `hours-worked-calculator` — "hours worked calculator" · 18k/mo · KD 77 · Informational
- `days-between-dates-calculator` — "days between dates calculator" · 18k/mo · KD 66 · Informational, Transactional
- `time-and-a-half-calculator` — "time and a half calculator" · 10k/mo · KD 29 · Informational

**Finance & Loans** (61)
- `paycheck-calculator` — "paycheck calculator" · 450k/mo · KD 87 · Informational, Commercial
- `car-payment-calculator` — "car payment calculator" · 450k/mo · KD 80 · Informational
- `cd-calculator` — "cd calculator" · 165k/mo · KD 42 · Informational
- `interest-calculator` — "interest calculator" · 165k/mo · KD 73 · Transactional
- `tax-calculator` — "tax calculator" · 165k/mo · KD 78 · Informational, Commercial
- `how-much-house-can-i-afford-calculator` — "how much house can i afford" · 135k/mo · KD 68 · Informational
- `income-tax-calculator` — "income tax calculator" · 91k/mo · KD 79 · Informational
- `personal-loan-calculator` — "personal loan calculator" · 61k/mo · KD 65 · Commercial
- `car-loan-payment-calculator` — "car loan payment calculator" · 61k/mo · KD 77 · Commercial
- `heloc-calculator` — "heloc calculator" · 50k/mo · KD 62 · Informational
- `mortgage-payoff-calculator` — "mortgage payoff calculator" · 50k/mo · KD 65 · Informational
- `social-security-calculator` — "social security calculator" · 50k/mo · KD 92 · Informational, Navigational
- `refinance-calculator` — "refinance calculator" · 41k/mo · KD 75 · Commercial
- `mortgage-affordability-calculator` — "mortgage affordability calculator" · 41k/mo · KD 71 · Informational
- `compounding-interest-calculator` — "compounding interest calculator" · 41k/mo · KD 63 · Commercial
- `annual-income-calculator` — "annual income calculator" · 41k/mo · KD 69 · Informational
- `high-yield-savings-account-calculator` — "high yield savings account calculator" · 33k/mo · KD 47 · Commercial
- `loan-amortization-calculator` — "loan amortization calculator" · 33k/mo · KD 71 · Informational
- `mortgage-amortization-calculator` — "mortgage amortization calculator" · 33k/mo · KD 66 · Informational, Transactional
- `mortgage-rate-calculator` — "mortgage rate calculator" · 33k/mo · KD 80 · Commercial
- `cd-rate-calculator` — "cd rate calculator" · 27k/mo · KD 46 · Commercial
- `crypto-calculator` — "crypto calculator" · 27k/mo · KD 66 · Informational
- `paycheck-tax-calculator` — "paycheck tax calculator" · 27k/mo · KD 78 · Commercial
- `boat-loan-calculator` — "boat loan calculator" · 27k/mo · KD 63 · Commercial
- `square-feet-calculator` — "square feet calculator" · 27k/mo · KD 50 · Informational
- `ebay-fee-calculator` — "ebay fee calculator" · 22k/mo · KD 48 · Informational, Transactional
- `heloc-payment-calculator` — "heloc payment calculator" · 22k/mo · KD 64 · Commercial
- `savings-bond-calculator` — "savings bond calculator" · 22k/mo · KD 55 · Informational
- `rv-loan-calculator` — "rv loan calculator" · 22k/mo · KD 51 · Commercial
- `monthly-payment-calculator` — "monthly payment calculator" · 22k/mo · KD 78 · Transactional
- `federal-tax-calculator` — "federal tax calculator" · 22k/mo · KD 85 · Informational
- `hourly-paycheck-calculator` — "hourly paycheck calculator" · 18k/mo · KD 48 · Informational, Commercial
- `cd-interest-calculator` — "cd interest calculator" · 18k/mo · KD 45 · Commercial
- `capital-gains-tax-calculator` — "capital gains tax calculator" · 18k/mo · KD 51 · Informational
- `loan-repayment-calculator` — "loan repayment calculator" · 18k/mo · KD 68 · Commercial
- `wage-calculator` — "wage calculator" · 18k/mo · KD 88 · Informational, Commercial
- `investment-growth-calculator` — "investment growth calculator" · 18k/mo · KD 65 · Informational
- `yearly-salary-calculator` — "yearly salary calculator" · 18k/mo · KD 60 · Informational
- `compound-calculator` — "compound calculator" · 18k/mo · KD 70 · Informational
- `reverse-mortgage-calculator` — "reverse mortgage calculator" · 15k/mo · KD 33 · Informational
- `new-york-salary-calculator` — "new york salary calculator" · 15k/mo · KD 51 · Informational
- `rent-affordability-calculator` — "rent affordability calculator" · 15k/mo · KD 23 · Informational
- `lease-calculator` — "lease calculator" · 15k/mo · KD 58 · Commercial
- `taxable-social-security-benefits-calculator` — "taxable social security benefits calculator" · 15k/mo · KD 33 · Informational
- `cpi-inflation-calculator` — "cpi inflation calculator" · 15k/mo · KD 89 · Informational
- `amortization-schedule-calculator` — "amortization schedule calculator" · 15k/mo · KD 74 · Informational
- `cash-out-refinance-calculator` — "cash out refinance calculator" · 12k/mo · KD 55 · Commercial
- `after-tax-income-calculator` — "after tax income calculator" · 12k/mo · KD 76 · Informational, Commercial
- `fers-retirement-calculator` — "fers retirement calculator" · 12k/mo · KD 42 · Informational
- `motorcycle-loan-calculator` — "motorcycle loan calculator" · 12k/mo · KD 54 · Commercial
- `no-tax-on-overtime-calculator` — "no tax on overtime calculator" · 10k/mo · KD 27 · Informational
- `sba-loan-calculator` — "sba loan calculator" · 10k/mo · KD 52 · Commercial
- `for-payroll-tax-calculator` — "calculator for payroll tax" · 10k/mo · KD 57 · Commercial
- `inherited-ira-rmd-calculator` — "inherited ira rmd calculator" · 10k/mo · KD 50 · Informational
- `interest-only-calculator` — "interest only calculator" · 10k/mo · KD 51 · Commercial
- `cap-rate-calculator` — "cap rate calculator" · 10k/mo · KD 24 · Informational
- `commercial-mortgage-calculator` — "commercial mortgage calculator" · 10k/mo · KD 54 · Commercial
- `paycheckcity-calculator` — "paycheckcity calculator" · 8k/mo · KD 29 · Navigational
- `new-york-paycheck-calculator` — "new york paycheck calculator" · 7k/mo · KD 31 · Informational
- `paypal-fees-calculator` — "paypal fees calculator" · 5k/mo · KD 48 · Informational
- `reverse-tax-calculator` — "reverse tax calculator" · 4k/mo · KD 14 · Commercial

**Health & Fitness** (9)
- `calorie-calculator` — "calorie calculator" · 2.2M/mo · KD 100 · Informational
- `maintenance-calorie-calculator` — "maintenance calorie calculator" · 74k/mo · KD 54 · Informational
- `1-rep-max-calculator` — "1 rep max calculator" · 61k/mo · KD 38 · Informational
- `calorie-burn-calculator` — "calorie burn calculator" · 18k/mo · KD 58 · Informational
- `macros-calculator` — "macros calculator" · 18k/mo · KD 51 · Informational
- `calorie-intake-calculator` — "calorie intake calculator" · 18k/mo · KD 58 · Informational
- `puppy-weight-calculator` — "puppy weight calculator" · 12k/mo · KD 17 · Informational
- `blood-alcohol-level-calculator` — "blood alcohol level calculator" · 8k/mo · KD 42 · Informational
- `alcohol-calculator` — "alcohol calculator" · 8k/mo · KD 42 · Informational

**Home & Construction** (7)
- `mulch-calculator` — "mulch calculator" · 33k/mo · KD 27 · Informational
- `asphalt-calculator` — "asphalt calculator" · 22k/mo · KD 19 · Informational
- `drywall-calculator` — "drywall calculator" · 12k/mo · KD 27 · Informational
- `concrete-slab-calculator` — "concrete slab calculator" · 12k/mo · KD 38 · Informational
- `stone-calculator` — "stone calculator" · 10k/mo · KD 18 · Informational
- `rock-calculator` — "rock calculator" · 10k/mo · KD 20 · Informational
- `pool-salt-calculator` — "pool salt calculator" · 7k/mo · KD 9 · Informational

**Other & Misc** (37)
- `height-calculator` — "height calculator" · 91k/mo · KD 55 · Informational
- `hour-calculator` — "hour calculator" · 91k/mo · KD 79 · Informational
- `rmd-calculator` — "rmd calculator" · 74k/mo · KD 50 · Informational
- `cost-of-living-calculator` — "cost of living calculator" · 50k/mo · KD 77 · Informational
- `car-calculator` — "car calculator" · 50k/mo · KD 81 · Informational
- `finance-calculator` — "finance calculator" · 33k/mo · KD 80 · Informational
- `mathematical-calculator` — "mathematical calculators" · 33k/mo · KD 95 · Commercial
- `bench-press-calculator` — "bench press calculator" · 27k/mo · KD 26 · Informational
- `sq-ft-calculator` — "sq ft calculator" · 27k/mo · KD 53 · Informational
- `money-calculator` — "money calculator" · 27k/mo · KD 95 · Informational
- `system-of-equations-calculator` — "system of equations calculator" · 22k/mo · KD 43 · Informational
- `clock-calculator` — "clock calculator" · 22k/mo · KD 80 · Informational, Transactional
- `board-foot-calculator` — "board foot calculator" · 22k/mo · KD 27 · Informational
- `work-calculator` — "work calculator" · 22k/mo · KD 72 · Informational
- `final-calculator` — "final calculator" · 22k/mo · KD 44 · Informational
- `how-much-water-to-drink-a-day-calculator` — "how much water to drink a day calculator" · 22k/mo · KD 58 · Informational
- `finals-calculator` — "finals calculator" · 18k/mo · KD 47 · Informational
- `mean-calculator` — "mean calculator" · 18k/mo · KD 48 · Informational
- `bitumen-calculator` — "bitumen calculator" · 15k/mo · KD 15 · Informational
- `petrol-expense-calculator` — "petrol expense calculator" · 15k/mo · KD 48 · Informational
- `roof-pitch-calculator` — "roof pitch calculator" · 15k/mo · KD 21 · Informational
- `trig-calculator` — "trig calculator" · 15k/mo · KD 65 · Informational
- `median-calculator` — "median calculator" · 15k/mo · KD 41 · Informational
- `body-shape-calculator` — "body shape calculator" · 12k/mo · KD 19 · Informational
- `options-calculator` — "options calculator" · 12k/mo · KD 47 · Informational
- `credit-card-calculator` — "credit card calculator" · 12k/mo · KD 52 · Commercial
- `ebay-charges-calculator` — "ebay charges calculator" · 12k/mo · KD 46 · Informational
- `tvm-calculator` — "tvm calculator" · 12k/mo · KD 47 · Informational
- `529-calculator` — "529 calculator" · 12k/mo · KD 35 · Informational
- `present-value-calculator` — "present value calculator" · 12k/mo · KD 58 · Informational
- `ffmi-calculator` — "ffmi calculator" · 12k/mo · KD 18 · Informational
- `adp-hourly-calculator` — "adp hourly calculator" · 10k/mo · KD 55 · Navigational, Transactional
- `home-insurance-calculator` — "home insurance calculator" · 8k/mo · KD 46 · Informational
- `pay-increase-calculator` — "pay increase calculator" · 8k/mo · KD 29 · Informational
- `cost-of-petrol-calculator` — "cost of petrol calculator" · 8k/mo · KD 50 · Informational
- `life-insurance-calculator` — "life insurance calculator" · 7k/mo · KD 45 · Informational
- `share-incentive-plan-calculator` — "share incentive plan calculator" · 7k/mo · KD 5 · Informational

**Pregnancy & Baby** (4)
- `pregnancy-calculator` — "pregnancy calculator" · 201k/mo · KD 63 · Informational
- `period-calculator` — "period calculator" · 50k/mo · KD 38 · Informational
- `pregnancy-due-date-calculator` — "pregnancy due date calculator" · 22k/mo · KD 63 · Informational
- `ivf-due-date-calculator` — "ivf due date calculator" · 18k/mo · KD 37 · Informational

