# Calculator Build Dossier — Interest Calculator

## 1. Identity
- **Slug:** `interest-calculator`
- **Route:** `/tools/interest-calculator`
- **Primary keyword:** "interest calculator" · 165k/mo · KD 73 · Transactional
- **One-line value:** Grow a starting balance with simple or compound interest, add
  optional monthly contributions, and see the final balance, total interest, and a
  year-by-year growth curve.
- **Owner:** Owner B (Copilot)

## 2. Inputs
| Field | Type | Default | Notes |
|---|---|---|---|
| Mode | enum | `compound` | `simple` / `compound` |
| Starting amount | number | 10,000 | Initial principal |
| Annual interest rate | % | 5 | User-supplied (not a market default) |
| Term | years | 10 | 0–100 |
| Compounding | enum | `monthly` | annually / semiannually / quarterly / monthly / daily (compound mode) |
| Monthly contribution | number | 0 | Optional recurring deposit (end of month) |

## 3. Outputs
- Final balance (hero).
- Total interest earned, total deposited (principal + contributions).
- Effective annual rate (APY).
- Year-by-year balance schedule.
- Principal vs contributions vs interest breakdown.

## 4. Formulas + sources
Computed by **month-by-month simulation** for accuracy with contributions.
```
Compound: monthlyRate = (1 + r/n)^(n/12) − 1
          balanceₜ    = balanceₜ₋₁ × (1 + monthlyRate) + contribution
Simple:   interest    += base × (r/12)   each month (no compounding)
          base        += contribution
          final        = principal + Σcontributions + interest
APY (compound) = (1 + monthlyRate)^12 − 1 ;  APY (simple) = r
```
- Standard time-value-of-money / compound interest formulas (no external data).
- The interest rate is a **user input**, not a live market rate — no dataset needed.

## 5. Invariants / guardrails
- `totalInterest = finalBalance − totalDeposited` (always).
- Zero rate → final balance equals total deposited, interest 0.
- More frequent compounding ≥ less frequent at the same nominal rate.
- Higher rate → higher final balance (compound).
- All outputs finite for NaN/empty inputs; term/rate clamped; months capped at 1,200.

## 6. Live datasets
- **None.** Rate is user-entered. No "Live" badge.

## 7. Insights
- Interest as a share of the final balance (compounding's contribution).
- Effective APY vs the nominal rate.
- Effect of monthly contributions on the total.

## 8. Visuals
- `ResultHeroCard`: final balance, with interest/deposited/APY sub-stats.
- `ImpactLineChart`: balance growth by year.
- `BreakdownBarChart`: principal vs contributions vs interest.

## 9. Build checklist
- [x] Pure engine `lib/calculators/interestEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD
- [x] `npx tsc --noEmit`, lint, tests green
