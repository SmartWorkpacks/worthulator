# Coast FIRE Calculator — Build Dossier

## Identity
- **Slug:** `coast-fire-calculator`
- **Category:** finance
- **Promise:** The amount you need invested *today* so compound growth alone reaches your FIRE target — calculated honestly, using the **real (inflation-adjusted) return** rather than the nominal rate most calculators use.

## The accuracy moat
Your FIRE target (typically 25× annual expenses) is denominated in **today's dollars**. To preserve that purchasing power, your savings must grow at the **real return**, not the nominal rate. Most coast calculators discount the target at the full nominal rate and report a number that is materially too low.

- Naive (nominal) coast number: `target ÷ (1 + nominal)^years`
- Honest (real) coast number: `target ÷ (1 + real)^years`, where `real = (1 + nominal) ÷ (1 + inflation) − 1` (Fisher)

The UI shows both and surfaces the gap (the "inflation penalty").

## Live data layer
- **FRED CPI (YoY inflation)** via `getCpiInflationYoY()` — injected as `annualInflationPct`. Drives the real-return conversion and the live-captioned `delta-card` insight.
- Static fallback retained through the FRED benchmark dataset.

## Fields
| Field | Unit | Default | Notes |
|------|------|---------|-------|
| `current` | $ | 100,000 | Current invested assets |
| `target`  | $ | 1,500,000 | FIRE target (today's dollars, 25× expenses) |
| `rate`    | % | 7 | **Nominal** return before inflation |
| `years`   | yrs | 25 | Years until retirement |

## Module
`calculations/finance/coastFire.ts` — `calculateCoastFire(inputs, { annualInflationPct })`

Outputs: `realRatePct`, `requiredNow` (real), `requiredNowNominal` (naive), `inflationPenalty`, `coastValue` (current grown at real rate), `coastRatio`, `coastShortfall`, `coastSurplus`, `alreadyCoasting`.

## Worked example (defaults, 3.2% CPI)
- Real return ≈ **3.7%**
- Coast number (real) ≈ **$607,420**
- Naive nominal figure ≈ **$276,374** → inflation penalty ≈ **$331,046**
- Current $100,000 grows (real) to ≈ **$246,946** → shortfall ≈ **$507,420**

## Invariants (13 Vitest tests)
- Real rate < nominal under inflation; equal at 0% inflation.
- Real coast number > naive; `inflationPenalty = requiredNow − requiredNowNominal`.
- Coast number discounts target back below target; rises with inflation, falls with more years / higher return.
- Shortfall and surplus mutually exclusive; `alreadyCoasting` flag correct.
- At `current = requiredNow`, projected `coastValue ≈ target` (within 1%).

## Insights (`lib/insights/generators/coastFireInsights.ts`)
1. **Real vs naive coast number** — `delta-card`, live CPI caption (the accuracy correction).
2. Already coasting / nearly there / halfway / large gap — `benchmark-bar`.
3. Portfolio overshoot, conservative-rate note, surplus framing.

## Architecture
- Pure module (data injected, never read inside).
- Config wired in `calculatorConfigs.ts` injecting `getCpiInflationYoY()`.
- Page uses `CoastFireWithInsights` wrapper (fixed: previously used the bare loader, so insights never mounted).
