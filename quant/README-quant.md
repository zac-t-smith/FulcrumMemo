# Fulcrum Memo v4 Data Pipeline

Automated FRED + ETF data ingestion for the v4 Fulcrum Index. Pivots the
primary credit signal from ICE BofA HY OAS (3-year ceiling on FRED) to
Moody's Baa-Treasury spread (40-year history) following Gilchrist-Zakrajšek
methodology.

## What changed v3 → v4

**The trigger.** As of April 2026, FRED restricted ICE BofA series
(including BAMLH0A0HYM2) to a rolling 3-year window for non-subscribers.
The previous v3 workbook had a 3-year ceiling baked in. The Cowen-style
scatter chart with rolling-percentile coloring couldn't distinguish
"2024 tights" from "actual cycle bottom" because the rolling window had
no broader regime to score against.

**The pivot.** v4 uses Moody's Baa Corporate over 10Y Treasury (FRED
series BAA10Y) as the primary credit signal. Daily data from January
1986 — 40 years covering every default cycle in modern markets. ICE
BofA HY OAS is retained as a current-cycle secondary signal for the
Iran period, Kalshi positioning, and the HY-IG dispersion calculation
(HY_OAS - BAA10Y) which captures capital structure tier breakage.

**Why this is correct, not a compromise.** Gilchrist-Zakrajšek (2012)
used Baa spreads precisely because of the long history. The shift from
HY to Baa changes spread *levels* but preserves *regime information*.
A fixed-range percentile on BAA10Y correctly identifies 2008 as
historic-wide and 2024 as historic-tight in a way the v3 HY OAS could
never do given the FRED ceiling.

## Series pulled

### Long-history (full inception, drives 40-year regime detection)

| FRED ID | Series | Inception | Site File | Role |
|---|---|---|---|---|
| BAA10Y | Moody's Baa-10Y spread | 1986-01-02 | baaSpreadHistory.ts | **PRIMARY signal** |
| AAA10Y | Moody's Aaa-10Y spread | 1983-01-03 | aaaSpreadHistory.ts | IG floor |
| DBAA | Moody's Baa yield | 1986-01-02 | baaYieldHistory.ts | Supplementary |
| VIXCLS | VIX | 1990-01-02 | vixHistory.ts | Vol signal |
| DGS10 | 10Y Treasury yield | 1962-01-02 | dgs10History.ts | Rates signal |
| T10Y2Y | 10Y-2Y curve | 1976-06-01 | yieldCurveHistory.ts | Recession indicator |
| T10YIE | 10Y breakeven | 2003-01-02 | breakevenHistory.ts | Inflation signal |

### Current-cycle (FRED 3-year ceiling, used for current period only)

| FRED ID | Series | Site File | Role |
|---|---|---|---|
| BAMLH0A0HYM2 | ICE BofA HY OAS | hyOasHistory.ts | Current HY signal |
| BAMLH0A3HYC | ICE BofA CCC OAS | cccOasHistory.ts | Canary tier |
| BAMLH0A1HYBB | ICE BofA BB OAS | bbOasHistory.ts | HY top tier |
| BAMLC0A4CBBB | ICE BofA BBB OAS | bbbOasHistory.ts | IG floor (current) |

### ETFs (yfinance, full inception)

| Ticker | Series | Inception | Site File |
|---|---|---|---|
| HYG | iShares HY Corporate Bond | 2007-04-04 | hygHistory.ts |
| USO | US Oil Fund | 2006-04-10 | usoHistory.ts |
| GLD | SPDR Gold Shares | 2004-11-18 | gldHistory.ts |

## Installation

Drop these files into your existing repo:

```
your-repo/
├── scripts/
│   ├── fetch_fred_data.py        ← v4, replaces old version
│   ├── fetch_etf_data.py         ← NEW
│   └── test_pipeline.py          ← NEW, tests both
├── .github/
│   └── workflows/
│       └── update-fulcrum-data.yml  ← v4, replaces old version
├── requirements.txt              ← NEW (yfinance only)
├── data/                         ← created on first run
└── src/data/                     ← existing, TS files written here
```

The `VITE_FRED_API_KEY` GitHub secret is already configured per the
project state file. The workflow uses it as `FRED_API_KEY`.

## First run — verification

```bash
# Install yfinance (one time)
pip install -r requirements.txt

# Set your API key
export FRED_API_KEY=<your_key>

# Run the FRED pipeline first
python3 scripts/fetch_fred_data.py

# Then the ETF pipeline
python3 scripts/fetch_etf_data.py

# Verify output
head -5 src/data/baaSpreadHistory.ts
tail -5 src/data/baaSpreadHistory.ts
```

**Sanity check the BAA10Y output:**
- Earliest date should be 1986-01-02 (or close to it)
- Latest date should be today or yesterday
- Latest value should be ~150-250 bps (current-cycle BAA10Y range)
- If you see a value <50 or >2000, something went wrong with the bps
  transform

**Sanity check the HY OAS output:**
- Earliest date should be ~3 years ago (FRED's ceiling)
- Latest value should be ~280-310 bps (per project state, not the
  fabricated 600+ that's currently on the site)

**Sanity check the ETF outputs:**
- HYG inception 2007-04, latest ~$80
- USO inception 2006-04, latest ~$130 (real, reflects Iran shock)
- GLD inception 2004-11, latest ~$430 (real, safe-haven bid)

If any of these are wildly off, stop and verify against
[FRED](https://fred.stlouisfed.org) directly before letting the data
flow downstream.

## Self-test (no API access required)

```bash
python3 scripts/test_pipeline.py
```

Validates both pipelines using mocked data — verifies unit transforms,
TypeScript schema, long-history vs current-cycle architecture, and CSV
shape. Run this on a new machine before trusting the live pipeline.

## Wiring into the site

After the first successful run, you'll have ~12 new TypeScript data
files in `src/data/`. The Fulcrum Index page needs three updates:

**1. Switch the primary chart from HY OAS to BAA10Y.**
   The Cowen-style scatter chart should consume `baaSpreadHistory.ts`
   for the historical 1990-2026 view. The wide red band from the
   current chart will redistribute properly because the percentile
   now scores against 40 years of regime variation.

**2. Add a current-cycle dashboard panel.**
   New section showing `hyOasHistory.ts`, `cccOasHistory.ts`,
   `bbOasHistory.ts`, `bbbOasHistory.ts` for the last 3 years. This
   is where the Iran period analysis and Kalshi positioning context
   lives.

**3. Compute the HY-IG dispersion.**
   New chart: (hyOasHistory.value - baaSpreadHistory.value) over the
   last 3 years where both are available. Reference lines at 1.5x,
   3.0x, 4.0x ratios. Above 3x = HY breaking ahead of IG. This is
   the new RX-desk-watch signal v4 introduces.

## v4 backtest workbook

See `CLAUDE_DESKTOP_PROMPT_v4_workbook.md` for the comprehensive
prompt to paste into a fresh Claude Desktop session. Run that *after*
the data pipeline has produced fresh CSVs in `data/`.

The Desktop session builds an ~11-tab Excel workbook that:
- Re-runs the v3 model against the extended 1990-2026 dataset
- Reports cycle-by-cycle composite performance (1990, 2001, 2008,
  2011, 2015, 2020, 2022, 2026)
- Tests whether v3's inverted correlation finding holds when 2008-09
  is in-sample
- Validates the BAA decile signal across the full window
- Adds new components (BAA velocity, HY-IG dispersion, fixed-range
  percentile)

## Daily automation

The GitHub Actions workflow runs at 6:30 AM Central, weekdays. Pulls
both FRED and ETF data, commits any changes to `data/` and `src/data/`.
Once merged into your default branch, the site updates itself daily
with zero manual intervention.

The first run after deployment will take longer (~2-3 minutes) because
ETF inception-to-present pulls are large. Subsequent runs only fetch
the last few days of changes if FRED/Yahoo signal that's all that
changed (FRED API supports observation_start filtering — the script
currently always pulls full history for simplicity; this can be
optimized later if the daily run is slow).

## Limitations / known issues

**yfinance reliability.** Yahoo Finance occasionally returns truncated
data for ETFs over weekends or during periods of Yahoo infrastructure
issues. The CI workflow exits with non-zero status if any ticker
returns empty data, so you'll see the failure rather than committing
bad data. Re-run the workflow manually from the Actions tab if this
happens.

**Brent crude.** Not in the FRED pipeline yet because DCOILBRENTEU
behavior under FRED's April 2026 restrictions wasn't tested in this
session. Add it in a follow-on if v4 backtest needs daily Brent
across the full window. The series goes back to 1987 and (per FRED's
public license) should NOT be subject to the ICE BofA restriction.

**Schema canonicalization.** All output TypeScript files use the same
`{ date, value }` shape. If your existing site files use different
field names, EITHER update the writers in both scripts to match, OR
update the site's chart components to consume the canonical shape.
Don't maintain two shapes — that's how bugs hide.

## What this delivers vs v3

| Capability | v3 | v4 |
|---|---|---|
| Primary credit signal | ICE BofA HY OAS | Moody's Baa10Y |
| Credit history coverage | 3 years (FRED ceiling) | 40 years |
| Default cycles in-sample | 0 | 7 (1990, 2001, 2008, 2011, 2015, 2020, 2022) |
| Cowen-chart calibration | Rolling 252d (broken) | Fixed-range on 40yr extremes |
| Cycle validation | Impossible | Per-cycle in Sheet 9 of workbook |
| Capital structure tier signal | None | HY-IG dispersion (4 tiers tracked) |
| Daily automation | Manual | GitHub Actions cron |
| Methodology defense | "3 years is what FRED gives" | Gilchrist-Zakrajšek tradition |

The architectural pivot is the work. Once the data pipeline runs
clean, the v4 workbook and site corrections fall out as mechanical
consequences.
