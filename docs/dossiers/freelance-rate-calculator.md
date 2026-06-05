# Dossier — Freelance Rate Calculator

**Slug:** `freelance-rate-calculator`
**Archetype:** Custom-loader finance flagship (own engine + charts + bespoke
insight cards), like `debt-payoff` / `emergency-fund`. Pure-calc — no live
dataset applies (rates are user inputs or the statutory SE tax), so Step 5c
auto-refresh is N/A.

## Identity / promise
Stop guessing what to charge. Compute the **minimum viable hourly rate** a
freelancer needs to hit a target take-home after tax, business expenses, profit
buffer, platform fees, and scope creep — across survival / comfortable / premium
modes, with a utilization-impact curve and a per-billed-dollar cost breakdown.
Clever under the surface (full cost-stack gross-up, utilization realism,
platform/scope buffers); simple on top (one "Calculate" action, sensible
defaults, tap-a-mode scenarios).

## Fields (and why each matters)
- **desiredAnnualIncome** — the take-home target everything is solved back from.
- **hoursPerWeek / weeksWorked** — total working capacity.
- **utilizationPct** — % of working time actually billable (50–70% realistic; 100% is a myth). The field most people get wrong.
- **annualBusinessExpenses** — overhead to earn back before profit.
- **taxRatePct** — effective rate incl. ~15.3% self-employment tax.
- **profitMarginPct** — buffer for reinvestment/slow months.
- **platformFeePct** — Upwork/Fiverr cut (grosses revenue up).
- **scopeCreepBufferPct** — covers unpaid revisions/overrun.
- **currentHourlyRate** — for the undercharging gap comparison.

## Formulas
- billableHours = hoursPerWeek × weeksWorked × utilization%
- grossIncomeNeeded = desiredIncome ÷ (1 − tax%)
- requiredRevenue = (grossIncomeNeeded + expenses) ÷ (1 − margin%)
- revenueWithFees = requiredRevenue × 1/(1−platformFee%) × (1 + scopeCreep%)
- survivalRate = revenueWithFees ÷ billableHours ; comfortable ×1.2 ; premium ×1.5
- Cost breakdown components provably sum to the survival rate (tested invariant).

## Constants (sourced)
- Self-employment tax ~15.3% (7.65% employee + 7.65% employer) — IRS; surfaced in copy, entered via the effective tax field.
- Mode multipliers: survival 1.0×, comfortable 1.2×, premium 1.5×.

## Insights / visuals (bespoke, in-component)
- Dark hero rate card (rate, monthly/annual targets, billed hrs, undercharging gap).
- Undercharging / surplus insight, billable-hours insight, platform-fee insight.
- Survival→Premium scenario table (interactive).
- **Utilization-impact line chart** and **per-billed-dollar cost-breakdown bar chart**.

## Status
✅ Engine + 17 tests added · legacy `InsightTable` removed from page · dossier added.
Pure-calc flagship (no live dataset / Step 5c by design).
