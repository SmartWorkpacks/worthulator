# Calculator Build Dossier — CD Calculator

## 1. Identity
- **Slug:** `cd-calculator`
- **Route:** `/tools/cd-calculator`
- **Primary keyword:** "cd calculator" · 165k/mo · KD 42 · Informational
- **One-line value:** Project a certificate of deposit (CD) to maturity from its
  advertised APY and term — final value, interest earned, a growth schedule, and an
  estimate of the early-withdrawal penalty if you break it early.
- **Owner:** Owner B (Copilot)

## 2. Inputs
| Field | Type | Default | Notes |
|---|---|---|---|
| Deposit | number | 10,000 | Initial principal locked in the CD |
| APY | % | 4.0 | Advertised annual percentage yield (user-set; editable) |
| Term | months | 12 | 1–120 |
| Early-withdrawal penalty | months of interest | 3 | Typical CD penalty; 0 = none |

## 3. Outputs
- Maturity value (hero).
- Total interest earned.
- Effective APY (echoed) and monthly growth rate.
- Early-withdrawal penalty estimate (in $).
- Month-by-month balance schedule.
- Principal vs interest breakdown; maturity-vs-APY curve.

## 4. Formulas + sources
APY is already an **effective** annual rate (it includes compounding), so:
```
years          = termMonths ÷ 12
maturityValue  = deposit × (1 + APY)^years
totalInterest  = maturityValue − deposit
monthlyRate    = (1 + APY)^(1/12) − 1
penalty        ≈ deposit × monthlyRate × penaltyMonths   (months-of-interest rule)
```
- Standard CD/APY definition (APY = effective annual yield).
- Early-withdrawal penalties are commonly quoted as "N months of interest"; the
  estimate uses the CD's own monthly interest. Real penalties vary by bank/term and
  are shown as an estimate.
- **APY is a user input**, not a market rate the tool fetches.

## 5. Live data
- There is **no live CD/deposit-rate series** in `lib/datasets/**` (fredBenchmarks
  covers auto/credit/personal/mortgage/fed-funds/CPI only).
- The CD APY default is therefore a clearly-labelled, **editable static default** —
  **no "Live" badge** is shown on the rate.
- The page does surface one genuinely-live, date-stamped figure for context: the
  **federal funds rate** from `fredBenchmarks` (`fedFundsRate`, `currentPeriodLabel`),
  computed at render — framed explicitly as the fed funds rate, *not* a CD rate.
- **➡️ Owner A request:** add a live CD / national-deposit-rate series (e.g. FDIC
  national rates or a FRED CD series) to `lib/datasets/refreshRegistry.ts` so the CD
  APY default can become live and "as of"-stamped.

## 6. Invariants / guardrails
- `totalInterest = maturityValue − deposit` (always ≥ 0 for APY ≥ 0).
- Zero APY → maturity equals deposit, interest 0.
- Higher APY or longer term → higher maturity (monotonic).
- Penalty scales with penalty-months; 0 months → 0 penalty; capped so it never
  exceeds interest earned in the schedule context.
- All outputs finite for NaN/empty inputs; term/APY/penalty clamped.

## 7. Insights
- Interest as a share of the maturity value.
- APY restated as an equivalent monthly rate.
- Early-withdrawal penalty in dollars (what breaking the CD early costs).
- Fed-funds context (dated, live) for "is this APY competitive right now?".

## 8. Visuals
- `ResultHeroCard`: maturity value with interest/APY/penalty sub-stats.
- `ImpactLineChart`: balance growth month by month.
- `BreakdownBarChart`: principal vs interest.

## 9. Build checklist
- [x] Pure engine `lib/calculators/cdEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD (+ dated fed-funds context)
- [x] `npx tsc --noEmit`, lint, tests green
