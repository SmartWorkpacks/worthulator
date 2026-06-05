# Down Payment Countdown — Build Dossier

## Identity
- **Slug:** `down-payment-countdown`
- **Category:** finance
- **Promise:** The honest monthly savings number to buy a home — accounting for HYSA interest, the **moving target** of home-price appreciation, and the closing costs most calculators ignore.

## The accuracy moat
A naive calculator does `(price × down%) − saved ÷ months`. The flagship corrects three real-world factors:
1. **Interest while saving** — current savings and each monthly deposit grow at the HYSA APY, lowering the required monthly amount.
2. **Moving target** — the home appreciates while you save, so the down payment is sized off the *projected purchase price*, not today's price.
3. **Closing costs** — ~3% of the price is surfaced as true cash-to-close.

## Live / dataset layer
- **HYSA APY** (`HYSA_APY = 4.4`, shared with emergency-fund) — injected `hysaApyPct`. Drives interest-earned and the benchmark-bar.
- **FRED CPI (YoY inflation)** via `getCpiInflationYoY()` — injected `annualInflationPct`. Expresses the future target in today's dollars (live-captioned delta-card).

## Fields
| Field | Unit | Default | Notes |
|------|------|---------|-------|
| `homePrice` | $ | 400,000 | Target purchase price today |
| `downPct` | % | 20 | 20% avoids PMI |
| `currentSaved` | $ | 5,000 | Already set aside (grows in HYSA) |
| `months` | mo | 36 | Timeline to buy |
| `appreciationPct` | % | 4 | Expected annual home-price growth (new) |

## Module
`calculations/finance/downPayment.ts` — `calculateDownPayment(inputs, { hysaApyPct, annualInflationPct })`

Key outputs: `monthlySavings`, `monthlyNoInterest`, `monthlyInterestSavings`, `targetDown`, `targetDownToday`, `appreciationGap`, `futureHomePrice`, `interestEarned`, `closingCosts`, `cashToClose`, `remaining`, `progressPercent`, `avoidsPMI`, `pmiShortfall`, `realTargetDown`.

## Worked example (defaults; 4.4% HYSA, 4% appreciation, 3.2% CPI)
- Future home price ≈ **$449,946**; down payment at purchase ≈ **$89,989** (vs $80,000 today → +$9,989 gap)
- Monthly savings ≈ **$2,194** (vs $2,361 at 0% → $167/mo less); interest earned ≈ **$6,005**
- Closing costs ≈ **$13,498** → cash to close ≈ **$103,487**
- Target in today's dollars ≈ **$81,875**

## Invariants (15 Vitest tests)
- `targetDownToday = price × down%`; appreciation raises target; 0% appreciation flattens it.
- HYSA interest lowers monthly vs naive; equal at 0% APY.
- Contributing the monthly amount reaches the target (within rounding).
- Cash to close = down payment + closing costs; PMI flag/shortfall correct below 20%.
- Monthly falls with more months / more current savings; real target < nominal target.

## Insights (`lib/insights/generators/downPaymentInsights.ts`)
1. **Moving target** — `delta-card` (today vs at-purchase).
2. **HYSA interest** — `benchmark-bar` (HYSA vs 0% account).
3. **Cash to close** — `donut` (down payment + closing costs).
4. Timeline framing; **today's-dollars value** — `delta-card`, live CPI caption; progress milestone; PMI framing.

## Architecture
- Pure module (data injected).
- Config in `calculatorConfigs.ts` injects `HYSA_APY` + `getCpiInflationYoY()`.
- Page uses `DownPaymentWithInsights` wrapper (fixed: previously bare loader, so insights never mounted).
