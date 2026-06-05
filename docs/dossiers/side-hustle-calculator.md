# Dossier — Side Hustle Calculator

**Slug:** `side-hustle-calculator`
**Archetype:** Engine-config flagship (`SideHustleWithInsights`).
**Live data:** N/A — pure income calculator (SE tax 15.3% is statutory).

## Identity / promise
Gross revenue lies. This shows your real net take-home from a side gig after
expenses and self-employment tax, your true effective hourly rate, the annual
tax to set aside, and a 5-year projection. Clever under the surface (4.33
weeks/month so monthly↔annual reconcile, SE-tax framing, rate-leverage math);
simple on top (four sliders).

## Fields
- **hoursPerWeek** · **rate** · **expensePct** · **taxRate** (self-employment, 25–30% typical).

## Formulas
- monthlyRevenue = hours × rate × (52/12)
- net = revenue × (1 − expense%) × (1 − tax%)
- yearlyNet = net × 12 ; fiveYearNet = net × 60
- hourlyEffective = net ÷ (hours × 52/12) ; annualTaxPaid = monthlyTax × 12

## Insights / visuals (`sideHustleInsights`)
True-rate (benchmark-bar effective vs advertised), income milestone (Roth/FT
equivalent), tax reality check, rate-increase leverage, 5-year framing, hours
burnout risk. 6 rules.

## Step 5c
Config now returns the full output set (`monthlyRevenue`, `annualTaxPaid`,
`fiveYearNet`) — previously the tax-burden and 5-year insights never fired. SEO
worked example recomputes from default inputs via `calculateSideHustle`.

## Status
✅ Pure module `calculations/work/sideHustle.ts` + 13 tests · config delegates to
it (now feeds all insight outputs) · wired via `SideHustleWithInsights` (was
unrendered) · Step 5c worked example · dossier added.
