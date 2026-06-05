# Dossier — Self-Employed Tax Calculator

**Slug:** `self-employed-tax`
**Archetype:** Engine-config flagship (`EngineWithInsights`).
**Live data:** N/A — statutory rates (SE 15.3% on 92.35% of net).

## Identity / promise
Quarterly and monthly tax reserve for 1099 workers, with the SE-tax surprise
made explicit. Clever under the surface (half-SE-tax federal deduction,
effective-rate and take-home framing); simple on top (three sliders).

## Fields
- **grossIncome** · **businessExpenses** · **federalRate** (marginal bracket).

## Formulas
- net = max(0, gross − expenses) ; seTax = net × 0.9235 × 0.153.
- fed = (net − seTax/2) × federalRate ; total = seTax + fed.
- quarterly = total ÷ 4 ; monthly = total ÷ 12.
- effectiveTaxRate = total ÷ gross ; netAfterTax = net − total.

## Insights / visuals (`selfEmployedTaxInsights`)
Reserve cadence, SE-tax share, effective rate, and take-home — the
seTaxAmount/effectiveRate/take-home outputs were previously missing from config.

## Step 5c
Content card ($5k extra deductions → ~$1,729 saved) and SEO worked example
($80k/$8k @ 22% → total tax, effective rate, quarterly/monthly, take-home)
recompute at render via `calculateSelfEmployedTax` (fixed inaccurate $1,865).

## Status
✅ Pure module `calculations/finance/selfEmployedTax.ts` + 12 tests · config
delegates to it (now feeds all insight outputs) · wired via `EngineWithInsights`
· Step 5c worked examples · dossier added.
