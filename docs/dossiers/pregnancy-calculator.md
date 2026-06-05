# Pregnancy Calculator — Build Dossier

**Slug:** `pregnancy-calculator` · **Engine:** `lib/calculators/pregnancyEngine.ts`
**Volume/KD:** 201k/mo · KD 63 · Informational · Category: Pregnancy & Baby

## Identity
Estimate the **due date** and **current gestational age** of a pregnancy from any one
known reference point: last menstrual period (LMP), conception/ovulation date, a
known due date, or an ultrasound dating scan. Reports weeks + days pregnant, the
trimester, percentage complete, days remaining, and key milestone dates.

This is the flagship of the Pregnancy & Baby cluster. It is **date math only** —
no live data, no invented medical/biometric statistics (no fetal-weight or
fundal-height tables, which would be fabricated). Every figure is derived from the
standard obstetric date conventions below.

## Inputs
- `method`: `lmp` | `conception` | `dueDate` | `ultrasound` — which reference is known.
- `referenceDate` (ISO yyyy-mm-dd) — meaning depends on method:
  - `lmp` → first day of the last menstrual period
  - `conception` → known conception/ovulation date
  - `dueDate` → an already-known estimated due date (work backwards)
  - `ultrasound` → the date the dating ultrasound was performed
- `cycleLength` (days, **lmp** method only) — average menstrual cycle length. Default 28; clamped 20–45.
- `ultrasoundWeeks`, `ultrasoundDays` (**ultrasound** method only) — gestational age measured at the scan.
- `asOfDate` (ISO) — "today", passed explicitly so results are deterministic for SSR and tests.

## Formulas + sources
All gestational ages are measured **from the LMP** (obstetric convention), and the
fertilization-to-birth interval is the stable **266 days**, so conception is always
derived as `dueDate − 266`.

- **Naegele's rule** (ACOG): `dueDate = LMP + 280 days` (40 weeks).
- **Cycle adjustment** (lmp method): ovulation occurs ~14 days before the next period,
  so for a cycle of length *C*: `conception = LMP + (C − 14)` and therefore
  `dueDate = conception + 266 = LMP + 252 + C` (equals `LMP + 280` when C = 28).
- **conception method:** `dueDate = conception + 266`; `LMP = conception − 14`.
- **dueDate method:** `LMP = dueDate − 280`; `conception = dueDate − 266`.
- **ultrasound method:** `gaDays = weeks×7 + days` at the scan;
  `LMP = ultrasoundDate − gaDays`; `dueDate = LMP + 280`.
- **Gestational age now:** `gaDays = max(0, asOf − LMP)`; weeks = `floor(gaDays/7)`, days = remainder.
- **Days remaining:** `dueDate − asOf` (negative ⇒ overdue).
- **Progress:** `clamp(gaDays / 280 × 100, 0, 100)` %.
- **Trimesters** (ACOG common convention): 1st = 0–13w6d (days 0–97),
  2nd = 14w0d–27w6d (days 98–195), 3rd = 28w0d onward (days 196+).
- **Milestones** (gestational weeks from LMP): conception (estimated); end of first
  trimester (14w / day 98); viability, commonly cited around 24 weeks (day 168);
  third trimester begins (28w / day 196); full term (37w / day 259, ACOG term range
  37–42w); estimated due date (40w / day 280).

Sources: ACOG *Estimated Date of Delivery* / Committee Opinion 700 *Methods for
Estimating the Due Date*; Naegele's rule (standard obstetric dating).

## Outputs
- Anchor dates: LMP, conception, due date (ISO + human label + weekday).
- Current progress: gestational weeks + days, decimal weeks, days remaining (whole
  weeks + days), % complete, overdue flag + days overdue, `conceived` flag.
- Trimester (1/2/3) + label.
- Milestone list (label, ISO, date label, gestational weeks, passed flag).
- Chart breakdown: weeks per trimester (14 / 14 / 12 = 40), current trimester flagged.

## Guards / invariants
- All inputs guarded with `safeNum` + `clamp`; never returns NaN/Infinity.
- Invalid reference date ⇒ `valid: false` (UI shows a prompt, no numbers).
- `gaDays` clamped ≥ 0 (future LMP ⇒ "not yet conceived"); progress clamped 0–100.
- `dueDate = LMP + 280` in every method; `conception = dueDate − 266` in every method.
- Milestones are strictly increasing in date; `passed` is monotonic vs `asOf`.

## Worked examples (computed in tests + page from the engine)
- LMP 2025-01-01, 28-day cycle ⇒ due **2025-10-08**, conception 2025-01-15.
- Cycle 35 days, LMP 2025-01-01 ⇒ due **2025-10-15** (shifted +7).
- Ultrasound 2025-06-01 measuring 12w3d ⇒ LMP 2025-03-06, due **2025-12-11**.

## Distinctness
Not a duplicate of `date-calculator` (general date arithmetic) or
`pregnancy-due-date-calculator` (22k, due-date-only angle — a candidate to fold into
this flagship later). This page owns the full "where am I in the pregnancy" intent:
multiple input methods, gestational age, trimester, and milestone timeline.
