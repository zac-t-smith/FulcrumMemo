# Claude Desktop Prompt — Fulcrum Index v4 Backtest Workbook

## Copy everything below this line into a fresh Claude Desktop conversation.

---

You're building the v4 Fulcrum Index Backtest Workbook for The Fulcrum Memo,
a distressed credit / restructuring research platform. This is a portfolio-grade
analytical artifact for RX investment banking recruiting — read carefully and
do not skip steps.

## Background context

The previous v3 workbook (May 2, 2023 → April 27, 2026, 783 daily observations,
21,235 formulas) produced three findings:

1. **Composite rarely fires** — 91% of days in 0-25 Complacency band. The
   framework as calibrated needed a cycle event to populate upper bands.
   When the Iran shock hit Feb 28, 2026, the composite climbed from 13 to
   53 within four weeks. Validated.

2. **Composite-HY positive correlation in this window** — ρ=+0.62, t=+21.4
   at 63d. In a buy-the-dip era with no real default cycle, every spike got
   bought. The framework would have whipsawed a credit short. This finding
   is window-specific and should resolve once 2008-09 is in-sample.

3. **OAS decile signal is the validated alpha** — D10 (widest spreads):
   +4.13% avg HYG 63d return, 97.5% win rate, N=80. D1 (tightest): +0.70%,
   86%. Robust asymmetric "buy when wide" signal.

The architectural problem v3 had: ICE BofA HY OAS data (BAMLH0A0HYM2) was
limited to Apr 2023 onward. As of April 2026, FRED has restricted ICE BofA
series to a rolling 3-year window for non-subscribers. This means the v3
3-year window IS the maximum we can ever get for HY OAS via FRED.

## v4 architectural pivot

We're switching the **primary credit signal** from ICE BofA HY OAS to
**Moody's Baa Corporate spread over 10Y Treasury (FRED series BAA10Y)**.

Why this is correct, not a compromise:

- BAA10Y has daily data from January 1986 — 40 years of credit history.
- It captures every default cycle in modern markets: 1990, 2001-02, 2008-09,
  2011 Euro crisis, 2015-16 energy defaults, 2020 COVID, 2022 inflation
  shock, and the current 2026 Iran period.
- This is the same series Gilchrist-Zakrajšek (2012) used in their
  foundational excess-bond-premium work, precisely because of the long
  history.
- ICE BofA HY OAS is retained as a **secondary current-cycle signal**
  for the Iran period, Kalshi positioning, and the HY-IG dispersion
  signal (HY_OAS - BAA10Y) which captures which part of the capital
  structure is cracking first.

The shift from HY to Baa changes spread *levels* (Baa runs ~150-300 bps
in normal times, ~600+ in 2008 vs HY OAS at 400/2000) but preserves the
*regime information*. A rolling-percentile or fixed-range percentile on
BAA10Y will correctly identify 2008 as historic-wide and 2024 as
historic-tight in a way that v3's HY OAS could never do given its 3-year
ceiling.

## Input files

You'll receive CSV files from `data/` directory of the Fulcrum Memo repo.
These were pulled fresh via `scripts/fetch_fred_data.py` and
`scripts/fetch_etf_data.py`:

**Long-history (full inception):**
- `fred_BAA10Y.csv` — Moody's Baa-10Y spread, percent (multiply ×100 for bps), 1986+
- `fred_AAA10Y.csv` — Moody's Aaa-10Y spread, percent, 1983+
- `fred_DBAA.csv` — Moody's Baa yield, raw percent, 1986+
- `fred_VIXCLS.csv` — VIX, 1990+
- `fred_DGS10.csv` — 10Y Treasury rate, percent, 1962+
- `fred_T10Y2Y.csv` — yield curve, percent, 1976+
- `fred_T10YIE.csv` — breakeven inflation, percent, 2003+

**Current cycle (FRED 3-year limit):**
- `fred_BAMLH0A0HYM2.csv` — HY OAS, percent (×100 for bps)
- `fred_BAMLH0A3HYC.csv` — CCC OAS
- `fred_BAMLH0A1HYBB.csv` — BB OAS
- `fred_BAMLC0A4CBBB.csv` — BBB OAS

**ETFs (yfinance, full inception):**
- `etf_HYG.csv` — credit ETF, 2007-04-04 onward
- `etf_USO.csv` — oil, 2006-04-10 onward
- `etf_GLD.csv` — gold, 2004-11-18 onward

**Brent crude:** Use FRED series DCOILBRENTEU (request a fresh pull if
not in the data/ directory yet — unrestricted, 1987+ daily). If a prior
.xls download is provided, verify the values match the API before using.

## Workbook architecture (formulas everywhere, blue inputs, IBD/PE convention)

### Sheet 1: Cover / Methodology

Header treatment matching v3 (red block, bold title, italic subtitle).
Lay out:
- The architectural pivot (HY OAS → BAA10Y as primary, why)
- Date range used for each window (see "Two-window design" below)
- Citation: Gilchrist & Zakrajšek (2012) "Credit Spreads and Business
  Cycle Fluctuations," American Economic Review
- Disclaimer about FRED's April 2026 ICE BofA restriction and how we
  worked around it

### Sheet 2: Raw Data (Window LH — Long History)

Outer-join on date for the long-history series:
`Date | BAA10Y_bps | AAA10Y_bps | DBAA | VIXCLS | DGS10 | T10Y2Y | T10YIE`

Hardcoded values from CSV (blue text). Forward-fill weekend/holiday gaps
within ≤5 days (do NOT forward-fill across longer gaps — that smooths
crisis dynamics). The HY-IG dispersion calculation later will require
both BAA10Y and HY OAS aligned, but HY OAS only exists for the last ~3
years; that gets handled in Sheet 3.

Truncate at the earliest common date where all REQUIRED series are
present. Required: BAA10Y, VIXCLS, DGS10. So start = max(BAA10Y inception
1986-01-02, VIXCLS inception 1990-01-02) = 1990-01-02. T10Y2Y is fine
(1976+). T10YIE only starts 2003 — leave blank for pre-2003 rows; the
v4 composite handles missing components gracefully.

Expected length: ~1990-01-02 to today = ~9,100 daily rows.

### Sheet 3: Raw Data (Window CC — Current Cycle)

Outer-join the four ICE BofA OAS series + ETFs + Brent for the last
~3 years. This is the v3-equivalent dataset, kept intact for current-
period analysis:
`Date | HY_OAS_bps | CCC_OAS_bps | BB_OAS_bps | BBB_OAS_bps | HYG | USO | GLD | Brent`

This sheet drives the current-cycle dashboard: HY-IG dispersion, capital
structure tier analysis, and Kalshi-positioning context.

### Sheet 4: Fulcrum Index v4 (the model)

Editable inputs block (yellow background, blue text, named ranges):
```
Weights:
  baa_pctl_weight         = 0.30
  baa_velocity_weight     = 0.10
  brent_stress_weight     = 0.15
  vix_stress_weight       = 0.15
  dgs10_stress_weight     = 0.05
  yield_curve_weight      = 0.10
  inflation_weight        = 0.05
  hy_ig_dispersion_weight = 0.10  (only computes when HY OAS available, else
                                   reweighted across remaining components)

Thresholds:
  brent_baseline    = 73   (USD/bbl, edit to recalibrate stress origin)
  vix_baseline      = 15
  vix_ceiling       = 40
  dgs10_baseline    = 4.0
  dgs10_ceiling     = 6.0
  baa_pctl_floor    = 145  (bps, BAA10Y historic 1st-percentile floor)
  baa_pctl_ceiling  = 600  (bps, BAA10Y historic 99th-percentile ceiling)
```

Daily calculations (formulas referencing Sheet 2/3, NOT hardcoded):

1. **BAA10Y Fixed-Range Percentile**
   = MIN(MAX((BAA10Y_bps - baa_pctl_floor) / (baa_pctl_ceiling - baa_pctl_floor), 0), 1)
   This is calibrated against the FULL 1986-2026 historical extremes,
   NOT a rolling 252-day window. Fixes v3's "everything looks red"
   problem from the Cowen-style chart you sent.

2. **BAA10Y Velocity (21d)**
   = (BAA10Y_bps - BAA10Y_bps[-21]) / BAA10Y_bps[-21]
   Captures acceleration of credit stress. Clip to [-0.5, +0.5] then
   normalize to [0, 1] via (velocity + 0.5).

3. **Brent Stress** (same as v3)
   = MIN(MAX((Brent - brent_baseline) / brent_baseline, 0), 1)

4. **VIX Stress** (same as v3, parameterized)
   = MIN(MAX((VIX - vix_baseline) / (vix_ceiling - vix_baseline), 0), 1)

5. **DGS10 Stress** (same as v3, parameterized)
   = MIN(MAX((DGS10 - dgs10_baseline) / (dgs10_ceiling - dgs10_baseline), 0), 1)

6. **Yield Curve Signal**
   = IF(T10Y2Y < 0, 1, MAX(0, (1 - T10Y2Y/2)))
   Inverted curve = max stress, steep curve = no stress.

7. **Inflation Stress**
   = MIN(MAX((T10YIE - 2.0) / 2.0, 0), 1)
   2% Fed target as origin. NA for pre-2003 dates.

8. **HY-IG Dispersion** (only for current cycle)
   = (HY_OAS_bps - BAA10Y_bps) / BAA10Y_bps
   Normal range 1.5-3x. Above 4x = HY breaking ahead of IG. Normalize:
   stress = MIN(MAX((dispersion - 1.5) / (4.0 - 1.5), 0), 1)
   For pre-2023 dates where HY OAS is unavailable: skip this component
   and reweight remaining components to sum to 1.

9. **Composite Fulcrum Index v4** (0-100)
   Weighted sum of available components × 100. Use SUMPRODUCT logic that
   handles missing inflation_stress (pre-2003) and HY-IG dispersion
   (pre-2023) by reweighting active components.

10. **Regime Band**
    Same v3 thresholds initially: 0-25 Complacency, 25-50 Latent,
    50-75 Active, 75-100 Imminent. **Document explicitly that these
    are review-pending after the v4 backtest** — with 36 years of
    history the empirical distribution should drive the bands.

### Sheet 5: Forward Returns

For each day, calculate forward returns for HYG (and BAA spread
forward changes, since HYG only exists 2007+):
- HYG: 5d, 10d, 21d, 63d forward returns (when HYG available)
- BAA spread: 5d, 10d, 21d, 63d forward CHANGE in bps (full window)

The BAA forward-change column is critical for the long-history
analysis. HYG-based analysis covers 2007+; BAA-spread analysis
covers 1990+. The framework should be tested on both.

### Sheet 6: Regime Summary

Pivot-style table by regime band × asset × horizon:
```
Regime          | N    | Days % | HYG +21d | HYG +63d | HYG Win% | BAA Δ+63d | Sharpe-like
0-25 Complacency| ?    | ?      | ?        | ?        | ?        | ?         | ?
25-50 Latent    | ?    | ?      | ?        | ?        | ?        | ?         | ?
50-75 Active    | ?    | ?      | ?        | ?        | ?        | ?         | ?
75-100 Imminent | ?    | ?      | ?        | ?        | ?        | ?         | ?
```

Compute on the FULL window (1990-2026) using BAA-based metrics, AND
on the HYG-available window (2007-2026) for HYG-based metrics. Show
both. The 75-100 Imminent band SHOULD have meaningful N now (2008,
2020, possibly 2022). If it doesn't, surface that finding immediately.

### Sheet 7: Correlation

Pearson ρ, R², t-stat with significance flags:
- Composite Fulcrum Index vs HYG forward returns (5d/10d/21d/63d)
- Composite Fulcrum Index vs BAA spread forward Δ (5d/10d/21d/63d)
- BAA Pctl alone vs HYG forward returns (decile validation)
- BAA Pctl alone vs BAA spread forward Δ

The critical question for v3 → v4: does the inverted correlation
(composite predicts POSITIVE forward returns) reverse when 2008-09
is in-sample? If yes, the framework is validated and v3's finding #2
is correctly explained as a buy-the-dip-era artifact. If not, the
weights or component selection need revision.

### Sheet 8: BAA Decile Backtest

Same structure as v3's OAS Signal Backtest, but on BAA10Y for the
full 1990-2026 window:
- Compute fixed-range percentile of BAA10Y on each day
- Bin into 10 deciles
- Compute forward 5/10/21/63d HYG returns (where available) and BAA
  spread changes (full window)
- Hit rate, mean, median, Sharpe-like by decile

Expected result given Gilchrist-Zakrajšek's findings: D10 (widest
spreads) → mean-reverting credit, positive HYG forward returns
(when available). D1 (tightest spreads) → vulnerable to widening,
weaker forward returns.

The asymmetric "buy when wide" signal from v3 should hold and
strengthen with the longer window. The "sell when tight" signal
should now have legitimate test cases (2007 pre-Lehman, 2019 pre-
COVID, 2022 pre-inflation-shock).

### Sheet 9: Cycle Performance

NEW for v4. Tag each day with its NBER recession dummy (or proxy:
DGS10-T3M inverted by ≥6mo) and compute composite Fulcrum Index
performance during each:
- Pre-2008 setup (Jan 2007 - Sep 2008)
- 2008-09 cycle (Sep 2008 - Jun 2009)
- 2011 Euro crisis (Jul 2011 - Oct 2011)
- 2015-16 energy defaults (Oct 2015 - Mar 2016)
- 2020 COVID (Feb 2020 - Apr 2020)
- 2022 inflation shock (Jan 2022 - Oct 2022)
- 2026 Iran period (Feb 2026 - present)

For each window: did the composite cross 50? 75? How many days
in advance of the spread peak? This is the cycle-by-cycle
validation that v3 fundamentally couldn't do.

### Sheet 10: Charts

5-7 native charts:
1. BAA10Y time series 1990-2026 with regime-colored background bands
2. Cowen-style scatter of BAA10Y inverted log with fixed-range
   percentile coloring (THE chart that motivated v4 — the wide red
   band from v3 should be properly distributed across the spectrum
   now)
3. Composite Fulcrum Index time series 1990-2026 with regime bands
4. Decile bars: forward HYG/BAA returns by BAA percentile
5. Cycle-by-cycle composite peaks vs spread peaks (timing chart)
6. HY-IG dispersion ratio time series (current cycle only, with
   horizontal lines at 2.0x, 3.0x, 4.0x reference levels)

### Sheet 11: Summary / Findings

Three findings, written AFTER the data is computed. Honest framing:
what changed v3 → v4, what got validated, what got overturned, what
remains uncertain. Use the same intellectual-honesty tone v3 used —
this is a credibility signal, not a marketing brochure.

## Critical methodology rules

1. **Formulas everywhere except raw data.** Anyone auditing must be
   able to change a weight or threshold and watch the workbook
   recalculate. Hardcoding analytical results breaks this.

2. **No fabrication.** If a value isn't in the CSVs, it's blank.
   Never fill from priors or memory. The previous Desktop session
   famously called real data fictional three times — the inverse
   failure (filling missing data with synthesized "plausible"
   values) is just as bad. Use IFERROR / ISBLANK gracefully.

3. **Units discipline.** BAA10Y FRED data is in PERCENT (e.g., 2.10
   means 210 bps). Multiply by 100 for bps display. Sanity check:
   if your "BAA10Y bps" column reads 2.5, you forgot the multiply;
   if it reads 25,000, you doubled-up the multiply.

4. **Two-window honesty.** State explicitly when an analysis uses
   1990-2026 vs 2007-2026 vs 2023-2026. Different statistics live
   in different sub-windows; the workbook should make this obvious
   to any reader.

5. **Zero formula errors at delivery.** Run a recalc-check pass.
   #N/A is acceptable for chart-skip purposes only; #REF, #VALUE,
   #NAME, #DIV/0 are not.

## Deliverable

A single .xlsx file: `fulcrum_index_v4_backtest.xlsx`

Cell-level formula audit trail. ~25,000-35,000 formulas expected
given the longer window. Structurally identical to v3 but with the
expanded scope. The findings text in Sheet 11 should be the LAST
thing you write, after computing every analysis.

When done, present the workbook AND write a brief summary (4-6
paragraphs) of:
1. What the data showed for each cycle (1990, 2001, 2008, 2011,
   2015, 2020, 2022, 2026)
2. Which v3 findings held, weakened, or reversed
3. What the new BAA-based composite does that v3 couldn't
4. Open questions / next iteration hooks

Don't soften findings that contradict prior framing. The v3 → v4
revision is itself the credibility story — we're following the
data, not the narrative.
