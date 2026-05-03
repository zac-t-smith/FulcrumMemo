# Deferred work — Fulcrum Memo

Maintenance memory for things the project knows it needs to do later but
isn't doing now. Each entry should explain *what* to do, *why* it's
deferred (not just "future work"), and *what triggers* the work.

---

## Sector rotation backtest re-run cadence

The Panel 2 backtest summary on the Fulcrum Index page (header bar +
metrics card + GFC case study) is driven by static constants in
`src/pages/FulcrumIndex.tsx` — see `BACKTEST_METRICS`. Today's values:

- Window: 2006–2026 (20 years)
- Fulcrum Rotation Portfolio: Sharpe 0.51 / Max DD -31% / CAGR 9.6%
- SPY Buy-and-Hold: Sharpe 0.41 / Max DD -55% / CAGR 11.0%
- GFC case study: Fulcrum +9.6% vs SPY -19.8% (Oct 2007 → Mar 2010)

These are framework-level facts derived from
`quant/data/fulcrum_sector_rotation_backtest.xlsx` and won't change
unless the backtest is re-run.

**Re-run trigger:** when the v4 pipeline accumulates significant new
data (≥12 months of additional history) or when a new cycle event
materializes (a new credit shock, recession, or significant Brent
dislocation), re-run `quant/scripts/backtest_sector_rotation.py` and
update `BACKTEST_METRICS` if results drift materially (>10% change in
any of Sharpe, Max DD, CAGR, or GFC case-study numbers).

**Why this matters:** without an explicit re-run cadence, the page's
headline credibility claim ("validated against 20-year backtest") will
go stale silently. A page that asserts a 2006–2026 backtest in 2030
without re-validation is exactly the kind of artifact that erodes trust
when a careful reader notices the date gap.

**Light-touch alternative:** if a full re-run isn't warranted, at
minimum extend the window string in the page (e.g., "2006–2027") only
after running the script with the new end date and confirming the
metrics still hold within rounding.

---

## v4 weight rebalance (workbook-pending)

The composite uses v3-style weights (0.40 credit / 0.30 Brent / 0.30 VIX)
with BAA10Y substituted for HY OAS. The v4 weight backtest at
`quant/data/v4_weight_backtest.xlsx` validated this choice against the
proposed alternative weights (0.30 baa / 0.10 baa-velocity / 0.15 brent
/ 0.15 vix / 0.05 dgs10 / 0.10 yield-curve / 0.05 inflation / 0.10
dispersion).

**Status:** v3-style retained based on backtest. The MD callout's
methodology footnote cites this finding.

**When to revisit:** if a new cycle reveals a structural failure of the
current weights (e.g., a credit cycle that fires without VIX or Brent
participation, or a regime where the credit slot saturates while the
composite reads benign), revisit the alternative weights with fresh
backtest evidence.

---

## DGS10 stress component (parked)

`DGS10_BASELINES` is computed (rolling 10y median + 95th percentile) and
exported from `src/data/fulcrumIndex.ts` but not consumed by the
composite calculation. Wiring it in would be a v4 weight rebalance,
which is out of scope per the workbook backtest.

**When to act:** if the v4 weight rebalance is ever revisited (see
above), DGS10 stress would naturally come along with it. Until then,
the export stays as a hook for downstream callers (e.g., the workbook
session) without changing live page behavior.

---

## CCC-BB structural finding (analytical project)

The CCC-BB ratio has sat above the 3.5× canary threshold for the entire
3-year FRED window (median 4.48×). Two competing explanations:

1. **Structural shift in HY composition** — reach-for-yield era diluted
   the BB tier with downgraded former-IG, narrowing BB beta and raising
   the ratio mechanically.
2. **Sustained early-warning of a default cycle that hasn't fully
   materialized** — the framework is correctly flagging stress that the
   headline index has not priced.

**Status:** the page acknowledges both possibilities in the Canary
banner copy. Resolving which is correct requires academic CDS-tier
data and DealStats — not bundled in the current pipeline.

**When to act:** during a workbook session that has access to the
extended data sources. Outcome would be a fifth Finding in the v4
backtest workbook, not a page change.

---

## Brent forward-fill in pipeline

`brentSpotHistory.ts` lags BAA10Y / VIX by 2–3 trading days. The page
truncates `indexData` to `min(latest BAA, latest VIX, latest Brent)` to
avoid a misleadingly low credit-only readout for the latest rows.

**Cleaner alternative:** add a forward-fill rule (≤2 trading days) in
`quant/scripts/fetch_fred_data.py` so Brent's last observation can be
carried into the next BAA observation date.

**Why deferred:** cosmetic. Current truncation handles the case
correctly; the page just shows "as of N-3" instead of "as of N." Not
worth a pipeline change today.
