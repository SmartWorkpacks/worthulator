# Calculator Build Dossier — `subscription-auditor`

> Flagship upgrade — pure calc module, live cost benchmarks, visual insights, page rewire.

---

## 1. Identity & intent

- **Slug:** `subscription-auditor` · `/tools/subscription-auditor`
- **Category:** finance
- **Wow fact:** C+R Research: Americans estimate $86/mo on subscriptions but actually spend ~$219/mo — a 2.5× blind spot. $150/mo invested at 7% → ~$25,900 in 10 years.
- **Moat:** Live `costBenchmarks.subscriptionsMonthlyUs` + `streamingOnlyMonthlyUs` (Apify/Expatistan refresh pipeline).

## 2. Fields

| name | type | default | notes |
|---|---|---|---|
| streaming | slider $/mo | 45 | Netflix, Spotify, etc. |
| software | slider $/mo | 30 | Adobe, M365, cloud |
| fitness | slider $/mo | 40 | Gym, Peloton, apps |
| newsMedia | slider $/mo | 15 | News, newsletters |
| other | slider $/mo | 20 | Meal kits, boxes |
| annualReturn | slider % | 7 | Investment return for opportunity cost (3–12%) |

## 3. Outputs

monthlyTotal (highlight), annualTotal, dailyCost, twentyYearCost, investedValue10, investedValue20, cutTwentyAnnualSaving, cutTwentyInvested10

## 4. Formulas

```
monthlyTotal = Σ categories
annualTotal  = monthlyTotal × 12
dailyCost    = annualTotal / 365
twentyYearCost = annualTotal × 20
investedValueN = monthly FV annuity at annualReturn/12 for N×12 months
cutTwentyAnnualSaving = annualTotal × 0.20
```

## 5. Build checklist

- [x] Pure calc + tests
- [x] Config uses calc + costBenchmarks injection
- [x] Insights upgraded (donut, delta-card, live benchmark caption)
- [x] Page wired to SubscriptionAuditorWithInsights; legacy removed
- [x] Step 5b static sync
