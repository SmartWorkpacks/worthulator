# Dossier — HELOC Calculator

**Slug:** `heloc-calculator` · **Category:** Finance & Loans
**Volume:** ~50k/mo · **Owner:** A (Cursor) · **Pattern:** Flagship custom-loader + Insight Kit

## Identity
Home Equity Line of Credit calculator. Answers the two borrower questions: how big
a line can I get (from equity + CLTV cap), and what's the **payment shock** when the
interest-only draw period ends and amortizing repayment begins. Complements
`home-equity-calculator` (how much equity) and the mortgage tools.

## Inputs
| Field | Default | Range | Notes |
|---|---|---|---|
| Home value | $500,000 | 10k–10M | |
| Mortgage balance | $300,000 | 0–10M | 0 if paid off |
| Max combined LTV | 85% | 50–100% | Lender cap (commonly 80–85%) |
| Amount to draw | $100,000 | 0–5M | Clamped to the qualifying line |
| Interest rate (APR) | **live** Prime (`fedFundsRate + 3.0`) | 0–20% | Variable; near Prime |
| Draw period | 10 yr | 1–15 | Interest-only |
| Repayment period | 20 yr | 5–30 | Amortizing |

## Formulas (engine: `lib/calculators/helocEngine.ts`)
```
currentEquity = value − mortgage
maxLine = value·CLTV% − mortgage   (≥ 0)
borrowed = min(draw, maxLine) ; exceedsLimit = draw > maxLine
draw payment (interest-only) = borrowed · APR/12
repay payment = calculateAmortization(borrowed, APR, repayYears).monthlyPayment
paymentShockMultiple = repayPayment / interestOnlyPayment
paymentTimeline: flat interest-only for drawYears, then repayPayment for repayYears
```
Guards: value/balance/draw ≤ 0 → zeros; underwater → maxLine 0; no NaN.

## Live data
- **Source:** FRED `FEDFUNDS` via `fredBenchmarks.fedFundsRate`. HELOCs price near
  **Prime = effective Fed Funds + 3.0** (`PRIME_OVER_FED_FUNDS`), a documented spread.
- Default APR + **all page copy** (stat chips, FAQ, content cards, InsightStrip, hero)
  computed at render from a `$500k home / $300k mortgage / 85% CLTV / $100k draw / Prime`
  example, stamped `(AS_OF)`. Auto-updates with the weekly FRED pull.

## Insights (in-component)
- Equity + % of value and the max line at the CLTV cap.
- Over-limit warning when the requested draw exceeds the qualifying line.
- Payment shock: interest-only vs repayment payment and the multiple (warning if ≥1.8×).
- Live-rate provenance (Prime = Fed Funds + 3.0), stamped "as of".

## Visuals
- `ImpactLineChart` — monthly payment over draw + repayment, vertical `referenceX` at "Draw ends".
- `BreakdownBarChart` — interest-only vs repayment monthly payment (the shock).

## Status
✅ Engine reuses amortization · 8 tests · live Prime (Fed Funds + 3.0) default · copy synced + auto-updating · dossier added.
