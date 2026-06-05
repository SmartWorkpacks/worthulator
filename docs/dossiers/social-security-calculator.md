# Social Security Calculator — Dossier

**Slug:** `social-security-calculator`
**Owner:** A (Cursor)
**Category:** Retirement / Finance
**Intent:** Informational + tool — "how much Social Security will I get, and when should I claim?"

## What it does
Estimates the user's monthly Social Security retirement benefit from a steady-career
income, then shows how that benefit changes across every claiming age from 62 to 70.
The signature insight is the **claiming-age trade-off**: claim early at 62 (permanent
reduction), at full retirement age (100%), or delay to 70 (delayed credits).

## Inputs
- **Birth year** — determines Full Retirement Age (FRA).
- **Current annual income** — used to approximate AIME (capped at the taxable wage base).
- **Claiming age** (62–70 slider).

## Engine — `lib/calculators/socialSecurityEngine.ts`
- **FRA rules:** 66 (1943–1954), +2 mo/yr (1955–1959), 67 (1960+).
- **AIME ≈** min(income, wage base) ÷ 12 (steady-career approximation).
- **PIA bend-point formula:** 90% / 32% / 15% across the two bend points.
- **Early reduction:** 5/9 of 1%/mo for first 36 months, then 5/12 of 1%/mo.
- **Delayed credits:** 2/3 of 1%/mo (8%/yr) from FRA to age 70.
- Returns: FRA, AIME, PIA, benefit at chosen age, % of PIA, benefit at 62/FRA/70,
  and `benefitByAge` (62–70 series for the chart).

## Constants (NOT live data)
Social Security parameters are **not** in the FRED dataset, so this calculator uses
clearly-sourced **SSA 2025** constants in `SSA` (bend points $1,226 / $7,391; wage
base $176,100). These update annually — bump them when SSA publishes new figures.
No "Live" badge; copy is labelled "SSA 2025 formula", not "as of FRED".

## Visuals
- `ImpactLineChart` — monthly benefit by claiming age (62–70), with a vertical
  reference line at the user's chosen age.
- `BreakdownBarChart` — age 62 vs FRA vs age 70 monthly benefit.

## Page copy
All numbers in stats / FAQ / SEO derive from a single worked example
(`EX = calculateSocialSecurity({ birthYear: 1975, annualIncome: 75_000, claimingAge: 67 })`)
so copy never drifts from the engine. Strong push toward verifying at ssa.gov/myaccount.

## Disclaimer
Explicitly an estimate: real benefits use 35 years of indexed earnings; taxes on
benefits, spousal/survivor rules, and COLA are not modelled.

## Status
- ✅ Engine + 8 tests passing
- ✅ tsc clean · eslint clean
- ✅ Page renders 200
