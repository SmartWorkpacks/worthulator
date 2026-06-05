# Dossier — Salary Increase Calculator

**Slug:** `salary-increase-calculator`
**Archetype:** Custom-loader finance flagship (own engine + area chart +
what-if buttons + breakdown), like `salary` / `take-home-pay`.
**Live-data moat:** FRED CPI-U YoY inflation (`getCpiInflationYoY`) drives the
default inflation rate, so the real-raise figure and copy auto-refresh (Step 5c).

## Identity / promise
Show the *true* long-term value of a raise: after-tax monthly increase,
inflation-adjusted (real) value, and the compounding lifetime earnings impact —
the number that actually matters in a negotiation. Clever under the surface
(live CPI default, compounding projection, inflation-deflated real series);
simple on top (salary + raise + years, one Calculate action).

## Fields
- **currentSalary** — gross annual base everything solves from.
- **raiseType / raiseValue** — percentage (e.g. 5%) or flat ($) raise.
- **years** — projection horizon for lifetime impact.
- **annualBonus** — flat bonus on top (optional).
- **taxRatePct** — marginal rate, applied only to the incremental raise.
- **inflationRatePct** — **defaults to live US CPI** (FRED CPI-U YoY); user can adjust.
- **annualRaiseRepeat** — compound the raise every year vs one-time.

## Formulas
- raiseAmount = pct ? salary×pct% : flatValue ; newSalary = salary + raiseAmount
- afterTaxRaise = raiseAmount × (1 − tax%)
- realRaise = raiseAmount ÷ (1 + inflation%)
- lifetimeDiff = Σ over N years (salaryRaised − salaryCurrent); one-time ⇒ raiseAmount × years; compounding ⇒ raised grows at raise%, current at inflation%.

## Live data
- **CPI-U YoY** via `lib/datasets/finance/fredBenchmarks.ts` → `getCpiInflationYoY()`. Refreshed by `scripts/updateFredBenchmarks.ts` (FRED CSV, no key); weekly workflow. Static fallback retained.
- Step 5c: inflation slider hint, FAQ "real value of a raise", and the inflation content card all recompute from the live CPI rate + vintage label.

## Insights / visuals (bespoke, in-component)
- Hero new-salary card (after-tax monthly, lifetime diff, raise split bar).
- Metric cards (monthly / after-tax / real raise) + breakdown table.
- **Salary growth area chart** (with raise / without / real inflation-adjusted).
- Lifetime earnings comparison panel + What-if scenario buttons.

## Status
✅ Engine + 18 tests added · live CPI default wired (Step 5c) · legacy
`InsightTable` removed · dossier added.
