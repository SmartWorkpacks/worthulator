# Dossier — Car Loan Calculator

> **Slug:** `car-loan-calculator` · **Domain:** finance · **Engine:** single-flow config
> **Calc core:** `calculations/finance/carLoan.ts` (+ `carLoan.test.ts`, 20 tests)
> **Insights:** `lib/insights/generators/carLoanInsights.ts`
> **Status:** Flagship · **dual live-data layer**

---

## 1. Identity

Shows the **true out-the-door** monthly car payment — the number most calculators
miss because they quote the sticker price and ignore sales tax. Builds the
out-the-door price (price + state sales tax), then finances it at the live
auto-loan APR, so the payment reflects what you'll actually sign for.

## 2. Live data layers (two, for "bazooka accuracy")

| Layer | Source | Getter | Use |
|---|---|---|---|
| Auto-loan APR | FRED `TERMCBAUTO48NS` (48-mo new-car commercial-bank avg) | `getAutoLoanNewAPR()` | Default APR (~7.9%, Q1 2026). User overrides with their offer; used cars ≈ +3 pts. |
| State sales tax | Tax Foundation 2026 (`salesTaxRates.ts`) | `SALES_TAX_RATE_BY_NAME` | Combined rate applied to the taxable price; financed into the loan. |

**Clever interconnection:** in ~42 states the **trade-in reduces the taxable base**
(`tradeInReducesTax`); a small documented set (CA, HI, KY, MD, VA, DC) does not.
The trade-in credit can be worth $800+ before it touches the loan.

## 3. Fields

| Field | Type | Default | Notes |
|---|---|---|---|
| state | dropdown (SALES_TAX_STATE_OPTIONS) | US Average | Drives the sales-tax layer + trade-in rule |
| vehiclePrice | slider $5k–100k | 28,000 | Negotiated price before tax |
| downPayment | slider, `maxFn = price` | 3,000 | Lowers loan, not taxable price |
| tradeIn | slider, `maxFn = price` | 0 | Lowers loan AND (usually) taxable price |
| interestRate | slider 0.5–25% | `getAutoLoanNewAPR()` | Live FRED default, overridable |
| termMonths | select | 60 | 24–84 months |

## 4. Formulas / constants

```
taxableBase   = tradeInReducesTax ? max(0, price − tradeIn) : price
salesTax      = round(taxableBase × stateRate/100)
outTheDoor    = price + salesTax
loanAmount    = max(0, outTheDoor − down − tradeIn)
monthly       = amortize(loanAmount, APR, term)      # standard annuity
totalInterest = monthly × term − loanAmount
totalCost     = down + monthly × term                # cash out of pocket (trade-in = asset swap)
taxFinancedInterest = totalInterest × (salesTax / loanAmount)
```

## 5. Worked example (defaults: $28k, US-avg 7.12%, $3k down, 7.9% APR, 60mo)

| Output | Value |
|---|---|
| Sales tax | $1,994 |
| Out-the-door | $29,994 |
| Amount financed | $26,994 |
| **Monthly payment** | **$546.05** |
| Total interest | $5,769 |
| Total cash cost | $35,763 |
| Interest on the financed tax | ~$426 |

## 6. Invariants (tested)

- Trade-in reduces salesTax iff `tradeInReducesTax`; zero-tax state → salesTax 0.
- `outTheDoor = price + salesTax`; `loanAmount = outTheDoor − down − tradeIn` (floored at 0).
- Zero APR → monthly = loan/term, interest 0.
- Monotonic: ↑APR → ↑interest; ↑term → ↓monthly, ↑interest; ↑tax → ↑loan & monthly; ↑down → ↓loan.
- `taxFinancedInterest = 0` in a no-tax state.
- All outputs finite; down+trade-in ≥ out-the-door → loan/monthly = 0.

## 7. Insights (6, live-captioned)

financed-sales-tax delta-card (Tax Foundation caption) · APR vs FRED benchmark-bar
(FRED caption) · long-term depreciation warning · interest-burden delta-card ·
down-payment adequacy · monthly-payment opportunity-cost projection-line.
