# Pension Calculator – Federal Government Employees of Pakistan

A simple, dependency-free web app (HTML, CSS and vanilla JavaScript) that estimates the monthly pension, commutation and gratuity of federal government employees of Pakistan.

> **Disclaimer:** This is an unofficial estimator for guidance only. Pension rules change often. The final pension is sanctioned by the AGPR / concerned Accounts Office. Always verify against the latest Finance Division notifications.

## Features

- Automatically applies the correct averaging period:
  - Retirement on or after **1 July 2024**: average of the last **24 months** of pensionable emoluments
  - Retirement before 1 July 2024: average of the last **12 months**
- Enter several pay periods (e.g. before and after an increment) and get a weighted average
- Optional notional/usual increment added **after** averaging (per Finance Division OM of 4 March 2025)
- Qualifying service worked out from dates of birth, appointment and retirement
  - Service before age 18 is not counted
  - Optional non-qualifying period deduction (e.g. extraordinary leave)
  - Optional rounding of a 6-month-or-more fraction to a full year
  - Service above 30 years is capped at 30
- Gross pension, commutation (0–35%), net pension, and commutation lump sum
- Gratuity estimate when qualifying service is under 10 years
- Voluntary retirement reduction (default 3% per year before age 60, editable)
- Optional preview of a post-retirement pension increase (e.g. 7%)
- Print / Save as PDF of the result
- Responsive layout, works offline

## Formulas

```
Qualifying years  = completed years of qualifying service (max 30)
Pension fraction  = qualifying years x 7 / 300          (30 years = 70%)
Gross pension     = average emoluments x pension fraction
Voluntary reduction = rate% x (months before age 60 / 12)   [retirement on/after 1 Jul 2024]
Surrendered       = gross pension x commutation %        (max 35%)
Net pension       = gross pension - surrendered
Lump sum          = surrendered x 12 x commutation factor
Gratuity (<10 yrs) = 1/2 month's emoluments per completed 6 months
```

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and form |
| `style.css` | Styling (responsive and print) |
| `app.js` | Calculation logic and UI behaviour |
| `tests.js` | Node tests for the calculation logic |

## Running

No build step is needed. Open `index.html` in any modern browser.

To run the tests (requires Node.js):

```bash
node tests.js
```

## Assumptions to check

These points rely on rules that are either changing or not fully verified. Check them against current notifications and adjust the constants at the top of `app.js` (`RULES`) if needed.

1. **Voluntary retirement reduction.** The 2024 reforms introduced a reduction for voluntary retirement, reported as 3% per year in the draft rules. Later reports mention other rates and an age-55 minimum. The rate is editable under *Advanced options*.
2. **Commutation factor.** The Finance Division commutation table (factor by age next birthday) is not built in. Enter the factor from the current table to see the lump sum.
3. **Rounding of service.** A fraction of six months or more is counted as a completed year by default. Turn this off if your case is treated differently.
4. **Gratuity.** The under-10-years gratuity is an approximation.
5. **Pension increases.** Annual increases (7% from 1 July 2026 according to the Finance Division OM dated 29 July 2026) apply to net pension; the preview field applies one increase only.
6. **Not covered:** family pension, disability/invalid pension, minimum pension floors, and the contributory scheme for new entrants.

## Cross-check

The AGPR provides an official online calculator: <https://pension.agpr.gov.pk/pensioncal/pencal.html>

## Sources used for the rules

- Dawn and The News reports on the pension reforms effective 1 July 2024 (70% of the last 24 months' average pensionable emoluments)
- Finance Division OM of 4 March 2025 (emoluments for pension, notional increment)
- Finance Division OM of 29 July 2026 (7% pension increase from 1 July 2026)

## License

Free to use and modify.
