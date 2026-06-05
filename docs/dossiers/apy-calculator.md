# APY Calculator — Dossier

**Slug:** `apy-calculator`
**Owner:** A (Cursor)
**Category:** Finance / Savings
**Intent:** Commercial — "what's the real yield on this account?"

## What it does
Converts a stated (nominal) interest rate + compounding frequency into the APY
(effective annual yield) and projects how a deposit grows. Signature insight: how
compounding frequency lifts the effective yield above the headline rate, and why APY
is the only fair way to compare accounts.

## Inputs
- Deposit amount, Stated interest rate, Compounding frequency (annually / quarterly /
  monthly / daily), Years invested.

## Engine — `lib/calculators/apyEngine.ts`
- `APY = (1 + r/n)^n − 1`
- `Balance(t) = P · (1 + r/n)^(n·t)`
- Returns APY, compounding bonus (APY − nominal), first-year interest, balance after
  term, total interest, `apyByFrequency` (for the comparison bar), and `balanceCurve`.
- 8 tests passing (formula, annual=nominal, frequency monotonicity, balance, guards).

## Live data
No deposit-APY series in FRED, so the default stated rate is `fedFundsRate` — high-yield
savings tracks it closely. Fully live and "as of"-stamped via `currentPeriodLabel`.

## Visuals
- `ImpactLineChart` — balance growth over the term.
- `BreakdownBarChart` — APY at each compounding frequency.

## Differentiation
- vs `compound-interest-calculator`: that adds recurring contributions; this isolates
  the rate→APY conversion and the compounding-frequency comparison.

## Page copy
All numbers derive from one live worked example (`$10k at fed funds, daily, 5yr`).

## Status
- ✅ Engine + 8 tests passing
- ✅ tsc clean · eslint clean
- ✅ Page renders 200
