# Dossier — 401(k) Calculator

**Slug:** `401k-calculator`
**Category:** finance
**Status:** flagship
**Differentiation:** A real 401(k) model, not a generic compounding tool. Contributions are a
percent of salary (capped at the IRS deferral limit), the employer match is capped at a % of
salary, salary grows with raises, and the headline insight is the **employer match left on the
table** when you contribute below the cap. Balance is shown in today's dollars via live CPI.

## Live data layer

- **FRED CPI (YoY inflation)** via `getCpiInflationYoY()` / `fredBenchmarks` → deflates the
  retirement balance to today's purchasing power (captioned `live: true`).
- Static constant: `EMPLOYEE_DEFERRAL_LIMIT_2026 = $24,500` (IRS 2026 elective-deferral limit).

## Fields

| field            | unit | default | range          |
|------------------|------|---------|----------------|
| salary           | $    | 65,000  | 20k – 300k     |
| contributionPct  | %    | 6       | 0 – 50         |
| employerMatchPct | %    | 50      | 0 – 200        |
| matchLimitPct    | %    | 6       | 0 – 15         |
| currentBalance   | $    | 15,000  | 0 – 1,000,000  |
| rate             | %    | 7       | 1 – 12         |
| years            | yr   | 30      | 1 – 50         |
| annualRaisePct   | %    | 3       | 0 – 8          |

## Outputs

`balance` (highlight), `realBalance` (today's $), `employerMatch` (free money + unclaimed-gap
sublabel), `growth`; internal `yourContributions`, `firstYearMatch`, `matchLeftOnTable`,
`fullMatchCaptured`.

## Formula

```
Employee/yr = min(Salary · Your%, $24,500)
Match/yr    = Salary · min(Your%, Cap%) · MatchRate%
Balance     = Σ monthly [ prev·(1+r/12) + (Employee+Match)/12 ]   (salary grows each year)
Today's $   = Balance / (1 + inflation)^years
```

## Worked example (defaults, CPI 3.2%)

- balance **$934,488**, contributions **$185,544**, match **$92,772**, growth **$641,172**
- today's $ **$363,231**
- first-year match **$1,950**, full match captured (matchLeftOnTable $0)
- contributing 3% instead of 6% → **$46,386** of match forfeited over 30 years

## Invariants (16 tests)

balance = current + contributions + match + growth (±2) · match > 0 and < contributions at 50% ·
full match captured when contribution ≥ cap (left-on-table = 0) · under-contributing leaves match
on the table · employee deferral clamped at the IRS limit · real < nominal · monotonic in
rate/years/contribution · no match when match rate 0 · year-0 returns current balance · higher
inflation lowers real balance · raises increase contributions vs flat salary.

## Insights (4)

1. **Free match** — benchmark-bar. If under-contributing: "X left on the table" + balance at full
   match (warning). If full: contributions vs employer-added (positive).
2. **Balance breakdown** — donut (contributions / match / growth)
3. **Nominal vs today's $** — delta-card (live CPI)
4. **Growth path** — projection-line

## Architecture

- `calculations/finance/retirement401k.ts` (+ `.test.ts`) — pure, data-injected, monthly sim
- config: `components/calculator-engine/calculatorConfigs.ts` → `401k-calculator`
- insights: `lib/insights/generators/retirement401kInsights.ts` → re-exported from `lib/insights/index.ts`
- registry: `components/worthcore/LiveInsightBlock.tsx` → `401k-calculator`
- wrapper: `components/worthcore/Retirement401kWithInsights.tsx`
- page: `app/tools/401k-calculator/page.tsx` (legacy `InsightsSection`/`InsightTable` removed)
