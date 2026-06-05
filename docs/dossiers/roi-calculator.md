# ROI Calculator — Build Dossier

## Identity
- **Slug:** `roi-calculator`
- **Category:** finance
- **Architecture:** Bespoke custom UI (`app/tools/roi-calculator/ROICalculator.tsx`) on the shared SEO section templates. Engine: `lib/calculators/roiCalculatorEngine.ts`.
- **Promise:** Investor-grade ROI — gross, net (after fees + tax), real (after inflation), CAGR, fee drag, and benchmark comparison, with a 4-curve growth chart.

## Flagship audit (this pass)
- **Added tests** — `lib/calculators/roiCalculatorEngine.test.ts` (17 tests). Engine previously had zero coverage.
- **Fixed loss handling (real logic bug)** — a final value below the invested amount used to clamp to **0% ROI**. It now shows a genuine **negative ROI / loss**: `totalProfit` is unclamped, the `netRate` floor is −99%/yr (so the growth factor stays positive), and `afterTaxNetFinalValue = netFinalValue − tax` (correct for losses; identical for gains). Tax still applies to gains only. The breakdown row flips to "Gross loss" in red.
- **Hybrid auto-reveal** — loader plays once on mount, then results update live (was click-gated).
- **Live CPI** — inflation default now reads `getCpiInflationYoY()` (FRED); reset uses it too; SEO copy notes the live source.
- **Removed legacy `<InsightTable>`** from the page.

## Live data layer
- **FRED CPI (YoY inflation)** via `getCpiInflationYoY()` — default for the inflation slider. Static fallback via the FRED dataset.

## Fields
Initial investment, final value, holding period (yrs), annual contribution, annual fees %, capital-gains tax %, inflation % (live CPI default), benchmark return % (7% default).

## Engine outputs
`grossROIPct`, `netROIPct`, `realROIPct`, `annualisedReturn` (CAGR), net/real CAGR, `investmentMultiple`, `totalInvested`, `totalProfit` (can be negative), `feeDragTotal`, `taxDragTotal`, `inflationErosion`, `realPurchasingPower`, `benchmarkFinalValue`, `benchmarkOutperformance`, `growthSeries` (gross/net/real/benchmark).

## Invariants (17 Vitest tests)
- Gross ROI / CAGR / multiple correct for the doubling default; contributions counted in invested.
- Ordering holds: net < gross (fees + tax), real < net (inflation); higher fees → more drag, lower net; higher inflation → more erosion, lower real purchasing power.
- Zero fees/tax/inflation → net ≈ gross ≈ real.
- **Losses:** final < invested → negative gross ROI, negative profit, real PP < invested, tax drag = 0.
- Benchmark outperformance sign correct; benchmark grows initial at benchmark rate.
- Growth series length = years + 1, starts at initial, real ≤ gross at every point.

## Notes
- Custom UI/chart (recharts); not on the shared `CalculatorEngine` or `LiveInsightBlock` registry.
