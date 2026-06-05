# Calculator Build Dossier — `vaping-cost-calculator`

## 1. Identity & intent
- **Slug:** `vaping-cost-calculator`
- **Category:** lifestyle / spending
- **The "wow" fact:** $6/day vaping = $2,190/yr. Cut to $3/day and you save
  $1,095/yr — $15,128 over 10 years invested. Meanwhile, smoking 1 pack/day at
  $10 costs $3,650/yr, so vaping saves $1,460 vs cigarettes but still isn't free.
- **Delivery model:** single-flow.

## 2. Fields

| name | label | type | unit | min | max | step | default | quickPicks |
|---|---|---|---|---|---|---|---|---|
| dailyCost | Daily vaping cost | slider | $ | 1 | 30 | 0.50 | 6 | 2, 4, 6, 8, 12 |
| cutDailyBy | What if you cut by | slider | $ | 0 | 15 | 0.50 | 2 | 0, 1, 2, 3, 5 |

## 3. Outputs

| key | label | format | highlight |
|---|---|---|---|
| yearlyCost | Annual cost | currency | ✅ |
| investedValue10yr | Invested instead (10yr) | currency | — |
| cutYearlySaving | Saving from cutting | currency | — |
| cutInvested10yr | Cut savings invested | currency | — |
| vsSmokingDiff | vs Smoking difference | currency | — |

## 4. Formulas

```
yearlyCost       = dailyCost × 365
monthlyCost      = yearlyCost / 12
investedValue10yr = FV annuity(yearlyCost, 10, 7%)
cutYearlySaving  = cutDailyBy × 365
cutInvested10yr  = FV annuity(cutYearlySaving, 10, 7%)
smokingAnnual    = $10 × 365 = $3,650  (1 pack/day at national avg)
vsSmokingDiff    = smokingAnnual - yearlyCost
```

## 5. Build checklist
- [ ] Pure calc module + tests
- [ ] Config rewrite
- [ ] Insight generator with visuals
- [ ] Wrapper + page
- [ ] Static content sync
- [ ] Verify
