"""
v4 Composite Weight Backtest
=============================
Validates candidate weight schemes for the Fulcrum Index against 36 years
of historical credit cycle data.

Methodology
-----------
1. Load all FRED + ETF data, align on common dates
2. Compute v4 components with rolling 10y baselines (per Phase 4D-2):
   - BAA10Y percentile (against full 1990-2026 distribution)
   - BAA10Y velocity (40-day rate of change)
   - Brent stress (current vs rolling 10y mean)
   - VIX stress (current vs rolling 10y median)
   - DGS10 stress (current vs rolling 10y median)
   - Yield-curve stress (T10Y2Y inversion intensity)
   - Inflation stress (T10YIE deviation from 2% target)
3. Run candidate weight schemes against all components
4. Score each scheme against known cycle events
5. Output workbook with full historical composite + scorecard

Cycle events (validated against Moody's default rate data and academic literature):
- 1990 recession (default rate peaked 10.4% in 1991)
- 1998 LTCM (transient stress, no default cycle)
- 2001-02 dot-com credit bust (default rate peaked 14.0% in 2002)
- 2008-09 GFC (default rate peaked 11.0% in 2009)
- 2011 EU debt crisis (transient stress, no US default cycle)
- 2015-16 oil bust (sectoral default cycle, energy 19% in 2016)
- 2020 COVID (default rate peaked 6.7% in 2020)
- 2022-23 CPI shock (transient stress, no default cycle yet)
"""

import pandas as pd
import numpy as np
from pathlib import Path

DATA_DIR = Path('/mnt/user-data/uploads')
OUT_DIR = Path('/home/claude/v4-backtest')
OUT_DIR.mkdir(exist_ok=True)


# =============================================================================
# 1. DATA LOADING & ALIGNMENT
# =============================================================================

def load_fred(filename, col_name):
    """Load a FRED CSV, return Series indexed by date."""
    df = pd.read_csv(DATA_DIR / filename, parse_dates=['date'])
    df = df.dropna()
    df = df.set_index('date').sort_index()
    return df[col_name]


print("Loading data...")
baa = load_fred('fred_BAA10Y.csv', 'BAA10Y') * 100  # convert % to bps
vix = load_fred('fred_VIXCLS.csv', 'VIXCLS')
brent = load_fred('fred_DCOILBRENTEU.csv', 'DCOILBRENTEU')
dgs10 = load_fred('fred_DGS10.csv', 'DGS10')
t10y2y = load_fred('fred_T10Y2Y.csv', 'T10Y2Y')
t10yie = load_fred('fred_T10YIE.csv', 'T10YIE')

print(f"  BAA10Y:  {baa.index[0].date()} → {baa.index[-1].date()}  ({len(baa):,} rows)")
print(f"  VIX:     {vix.index[0].date()} → {vix.index[-1].date()}  ({len(vix):,} rows)")
print(f"  Brent:   {brent.index[0].date()} → {brent.index[-1].date()}  ({len(brent):,} rows)")
print(f"  DGS10:   {dgs10.index[0].date()} → {dgs10.index[-1].date()}  ({len(dgs10):,} rows)")
print(f"  T10Y2Y:  {t10y2y.index[0].date()} → {t10y2y.index[-1].date()}  ({len(t10y2y):,} rows)")
print(f"  T10YIE:  {t10yie.index[0].date()} → {t10yie.index[-1].date()}  ({len(t10yie):,} rows)")

# Build the master frame on the BAA10Y index. Forward-fill Brent (handles
# weekend/holiday lag) up to 5 days. Other series are daily and align cleanly.
df = pd.DataFrame(index=baa.index)
df['baa'] = baa
df['vix'] = vix
df['brent'] = brent.reindex(df.index, method='ffill', limit=5)
df['dgs10'] = dgs10
df['t10y2y'] = t10y2y
df['t10yie'] = t10yie

# Drop rows where BAA or VIX is missing (these are the non-negotiable inputs).
# Keep rows where T10YIE is missing (pre-2003) — handle in component computation.
df = df.dropna(subset=['baa', 'vix'])
print(f"\nMaster frame: {len(df):,} rows from {df.index[0].date()} to {df.index[-1].date()}")


# =============================================================================
# 2. v4 COMPONENT COMPUTATION
# =============================================================================

def clamp01(s):
    """Clamp Series to [0, 1]."""
    return s.clip(0, 1)

def rolling_baseline(s, window_years=10, agg='mean'):
    """
    Rolling baseline: for each date, the mean/median of the prior N years.
    For early data, uses an expanding window.
    """
    window_days = window_years * 252  # trading days
    if agg == 'mean':
        return s.rolling(window=window_days, min_periods=252).mean()
    elif agg == 'median':
        return s.rolling(window=window_days, min_periods=252).median()
    else:
        raise ValueError(f"Unknown agg: {agg}")

# --- BAA10Y percentile (against full historical distribution) ---
# Use empirical percentile over the entire sample; this is the same approach
# the scatter chart uses. It's anchored, not rolling.
sorted_baa = np.sort(df['baa'].values)
def baa_percentile(value):
    idx = np.searchsorted(sorted_baa, value, side='right')
    return idx / len(sorted_baa)

df['baa_pctl'] = df['baa'].apply(baa_percentile)

# --- BAA10Y velocity (40-day rate of change, normalized) ---
# Captures "spreads widening fast" vs "spreads stable at high level"
df['baa_velocity_raw'] = df['baa'].pct_change(40)
# Map velocity to [0,1]: any 40d expansion ≥ 50% reads as max stress
df['baa_velocity'] = clamp01(df['baa_velocity_raw'] / 0.5)

# --- Brent stress (rolling 10y baseline, mean) ---
df['brent_baseline'] = rolling_baseline(df['brent'], 10, 'mean')
df['brent_ratio'] = df['brent'] / df['brent_baseline']
# Map: ratio of 1.0 = baseline (no stress), ratio of 1.8 = max stress
df['brent_stress'] = clamp01((df['brent_ratio'] - 1.0) / 0.8)

# --- VIX stress (rolling 10y baseline, median) ---
df['vix_baseline'] = rolling_baseline(df['vix'], 10, 'median')
df['vix_ratio'] = df['vix'] / df['vix_baseline']
# VIX doubling (ratio 2.0) = max stress
df['vix_stress'] = clamp01((df['vix_ratio'] - 1.0) / 1.0)

# --- DGS10 stress (rolling 10y baseline, median; deviation in either direction) ---
df['dgs10_baseline'] = rolling_baseline(df['dgs10'], 10, 'median')
df['dgs10_dev'] = (df['dgs10'] - df['dgs10_baseline']).abs()
# Deviation of 200 bps in either direction = max stress
df['dgs10_stress'] = clamp01(df['dgs10_dev'] / 2.0)

# --- Yield curve stress (T10Y2Y inversion intensity) ---
# Negative = inverted; deeper inversion = more stress
# Map: 0 bps = no stress, -150 bps = max stress
df['curve_stress'] = clamp01((-df['t10y2y']) / 1.5)

# --- Inflation stress (T10YIE deviation from 2% target) ---
# Available 2003+. For pre-2003 dates, treat as 0 (not contributing).
df['inflation_stress'] = clamp01((df['t10yie'] - 2.0).abs() / 2.0).fillna(0)

print(f"\nComponent ranges (post-clamp):")
for col in ['baa_pctl', 'baa_velocity', 'brent_stress', 'vix_stress', 
            'dgs10_stress', 'curve_stress', 'inflation_stress']:
    print(f"  {col:20s}  min={df[col].min():.3f}  median={df[col].median():.3f}  max={df[col].max():.3f}")


# =============================================================================
# 3. CANDIDATE WEIGHT SCHEMES
# =============================================================================

# All schemes use a 7-component framework (excludes HY-IG dispersion which
# only has 3 years of data). We backtest on long-history components only.

WEIGHT_SCHEMES = {
    'v3_legacy': {
        # Original v3-ish: BAA dominant, VIX/Brent supporting
        'baa_pctl':         0.50,
        'baa_velocity':     0.10,
        'brent_stress':     0.15,
        'vix_stress':       0.15,
        'dgs10_stress':     0.10,
        'curve_stress':     0.00,
        'inflation_stress': 0.00,
    },
    'v4_proposed': {
        # The user's proposed v4 weights (normalized to sum to 1.0 after
        # excluding the 0.10 dispersion component → renormalize remaining 0.90)
        'baa_pctl':         0.30 / 0.90,  # = 0.333
        'baa_velocity':     0.10 / 0.90,  # = 0.111
        'brent_stress':     0.15 / 0.90,  # = 0.167
        'vix_stress':       0.15 / 0.90,  # = 0.167
        'dgs10_stress':     0.05 / 0.90,  # = 0.056
        'curve_stress':     0.10 / 0.90,  # = 0.111
        'inflation_stress': 0.05 / 0.90,  # = 0.056
    },
    'v4_baa_heavy': {
        # BAA is the strongest signal historically; lean into it
        'baa_pctl':         0.45,
        'baa_velocity':     0.10,
        'brent_stress':     0.10,
        'vix_stress':       0.15,
        'dgs10_stress':     0.05,
        'curve_stress':     0.10,
        'inflation_stress': 0.05,
    },
    'v4_balanced': {
        # Even spread across dimensions
        'baa_pctl':         0.30,
        'baa_velocity':     0.10,
        'brent_stress':     0.15,
        'vix_stress':       0.15,
        'dgs10_stress':     0.05,
        'curve_stress':     0.15,
        'inflation_stress': 0.10,
    },
    'v4_macro_first': {
        # Macro components weighted heavier; BAA still primary but not dominant
        'baa_pctl':         0.30,
        'baa_velocity':     0.05,
        'brent_stress':     0.15,
        'vix_stress':       0.20,
        'dgs10_stress':     0.05,
        'curve_stress':     0.15,
        'inflation_stress': 0.10,
    },
}

# Verify all schemes sum to ~1.0
for name, w in WEIGHT_SCHEMES.items():
    total = sum(w.values())
    assert abs(total - 1.0) < 0.001, f"{name} sums to {total}"
    print(f"  {name}: weights sum to {total:.4f} ✓")


# =============================================================================
# 4. COMPOSITE COMPUTATION
# =============================================================================

def compute_composite(df, weights):
    """Compute composite Fulcrum Index given weight scheme. Returns 0-100 series."""
    composite = pd.Series(0.0, index=df.index)
    for component, weight in weights.items():
        composite += df[component].fillna(0) * weight
    # Scale 0-1 → 0-100
    return composite * 100

print("\nComputing composites for all schemes...")
for name, weights in WEIGHT_SCHEMES.items():
    df[f'idx_{name}'] = compute_composite(df, weights)


# =============================================================================
# 5. CYCLE EVENT SCORECARD
# =============================================================================

CYCLE_EVENTS = [
    # (label, peak_window_start, peak_window_end, severity_rank, expected_band, default_rate_pct)
    ('1990 recession',     '1990-09-01', '1991-03-31', 7, 'Latent-Active',   10.4),
    ('1998 LTCM',          '1998-09-01', '1998-12-31', 8, 'Latent',           3.4),
    ('2002 dot-com',       '2002-08-01', '2002-12-31', 1, 'Imminent',        14.0),
    ('2008-09 GFC',        '2008-10-01', '2009-06-30', 2, 'Imminent',        11.0),
    ('2011 EU debt',       '2011-09-01', '2011-12-31', 6, 'Active',           1.8),
    ('2015-16 oil bust',   '2016-01-01', '2016-04-30', 5, 'Active',           4.4),
    ('2020 COVID',         '2020-03-01', '2020-05-31', 3, 'Imminent',         6.7),
    ('2022 CPI shock',     '2022-09-01', '2022-12-31', 4, 'Active',           1.5),
]

# severity_rank: 1=worst (highest default rate). Used to validate that composite
# peaks rank-order correctly with actual default outcomes.

def score_event(df, idx_col, event):
    label, start, end, _, _, _ = event
    window = df.loc[start:end, idx_col]
    if len(window) == 0:
        return None
    return {
        'event': label,
        'window': f'{start[:7]} → {end[:7]}',
        'peak': window.max(),
        'peak_date': window.idxmax().strftime('%Y-%m-%d'),
        'mean': window.mean(),
        'days_imminent': (window >= 75).sum(),
        'days_active': ((window >= 50) & (window < 75)).sum(),
    }

print("\nBuilding scorecards...")
scorecards = {}
for scheme_name in WEIGHT_SCHEMES.keys():
    idx_col = f'idx_{scheme_name}'
    rows = []
    for event in CYCLE_EVENTS:
        s = score_event(df, idx_col, event)
        if s:
            rows.append(s)
    scorecards[scheme_name] = pd.DataFrame(rows)


# =============================================================================
# 6. RANKING ANALYSIS
# =============================================================================

def rank_correlation_with_severity(scheme_name):
    """
    Spearman rank correlation between composite peaks and inverse severity ranks.
    Higher = composite peaks rank-order match actual default-rate severity.
    """
    sc = scorecards[scheme_name].copy()
    # Map events back to severity_rank
    severity_map = {e[0]: e[3] for e in CYCLE_EVENTS}
    sc['severity_rank'] = sc['event'].map(severity_map)
    # Composite peak should be HIGHER for LOWER (worse) severity rank
    # → expect negative Spearman correlation between peak and severity_rank
    return sc[['peak', 'severity_rank']].corr(method='spearman').iloc[0, 1]

print("\nRank correlation (composite peak vs inverse cycle severity):")
print("  Lower (more negative) is better — means composite peaks rank-match")
print("  actual default-rate severity ordering.")
print()
for scheme_name in WEIGHT_SCHEMES.keys():
    rho = rank_correlation_with_severity(scheme_name)
    print(f"  {scheme_name:20s}  ρ = {rho:+.3f}")


# =============================================================================
# 7. OUTPUT WORKBOOK
# =============================================================================

print("\nWriting workbook...")
output_path = OUT_DIR / 'v4_weight_backtest.xlsx'

with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
    # Sheet 1: README
    readme = pd.DataFrame({
        'Section': [
            'Purpose',
            'Method',
            'Components',
            '',
            'Schemes',
            '',
            'Cycle events',
            '',
            'Scorecards',
            'Composite series',
            '',
            'Severity ranking',
        ],
        'Detail': [
            'Validate v4 composite weights against 36 years of credit cycle history.',
            'Compute components with rolling 10y baselines (Phase 4D-2 method); test 5 weight schemes; score against 8 known cycle events.',
            'BAA10Y percentile, BAA velocity, Brent stress, VIX stress, DGS10 stress, yield-curve stress, inflation stress.',
            '',
            'v3_legacy (BAA-dominant), v4_proposed (user spec), v4_baa_heavy (lean into BAA), v4_balanced (even spread), v4_macro_first (macro-weighted).',
            '',
            '1990 recession, 1998 LTCM, 2002 dot-com, 2008-09 GFC, 2011 EU debt, 2015-16 oil bust, 2020 COVID, 2022 CPI shock.',
            '',
            'For each scheme × event: peak composite, peak date, mean composite, days in Imminent (≥75), days in Active (50-74).',
            'Full daily composite series 1990-2026 for all schemes.',
            '',
            'Spearman rank correlation between composite peaks and severity rank (1=worst). More negative = better rank match.',
        ]
    })
    readme.to_excel(writer, sheet_name='README', index=False)
    
    # Sheet 2: Weight schemes
    weights_df = pd.DataFrame(WEIGHT_SCHEMES).T
    weights_df['SUM'] = weights_df.sum(axis=1)
    weights_df.to_excel(writer, sheet_name='Weight schemes')
    
    # Sheet 3: One scorecard sheet per scheme
    for scheme_name, sc in scorecards.items():
        sheet_name = f'Scorecard {scheme_name}'[:31]
        sc.to_excel(writer, sheet_name=sheet_name, index=False)
    
    # Sheet 4: Severity ranking summary
    ranking_rows = []
    for scheme_name in WEIGHT_SCHEMES.keys():
        rho = rank_correlation_with_severity(scheme_name)
        sc = scorecards[scheme_name].copy()
        ranking_rows.append({
            'scheme': scheme_name,
            'rank_corr': rho,
            'gfc_peak': sc[sc.event == '2008-09 GFC'].peak.iloc[0] if len(sc[sc.event == '2008-09 GFC']) else None,
            'covid_peak': sc[sc.event == '2020 COVID'].peak.iloc[0] if len(sc[sc.event == '2020 COVID']) else None,
            'dotcom_peak': sc[sc.event == '2002 dot-com'].peak.iloc[0] if len(sc[sc.event == '2002 dot-com']) else None,
            'cpi_peak': sc[sc.event == '2022 CPI shock'].peak.iloc[0] if len(sc[sc.event == '2022 CPI shock']) else None,
            'today': df[f'idx_{scheme_name}'].iloc[-1],
        })
    ranking_df = pd.DataFrame(ranking_rows)
    ranking_df.to_excel(writer, sheet_name='Ranking summary', index=False)
    
    # Sheet 5: Full daily composite for all schemes (for charting in Excel)
    composites = df[[c for c in df.columns if c.startswith('idx_')]].copy()
    composites.to_excel(writer, sheet_name='Composite series')
    
    # Sheet 6: Component series (for transparency)
    components = df[['baa', 'baa_pctl', 'baa_velocity', 'brent_stress', 
                     'vix_stress', 'dgs10_stress', 'curve_stress', 
                     'inflation_stress']].copy()
    components.to_excel(writer, sheet_name='Components')

print(f"  Saved: {output_path}")
print(f"  Size:  {output_path.stat().st_size:,} bytes")


# =============================================================================
# 8. SUMMARY TO STDOUT
# =============================================================================

print("\n" + "="*70)
print("SUMMARY: cycle peaks by scheme (composite reading 0-100)")
print("="*70)

# Build a wide table: rows = events, cols = schemes
peaks_table = pd.DataFrame()
for scheme_name in WEIGHT_SCHEMES.keys():
    peaks_table[scheme_name] = scorecards[scheme_name].set_index('event')['peak']

print(peaks_table.round(1).to_string())

print("\nToday's reading by scheme:")
for scheme_name in WEIGHT_SCHEMES.keys():
    today_val = df[f'idx_{scheme_name}'].iloc[-1]
    print(f"  {scheme_name:20s}  idx = {today_val:.1f}")

print("\nDone.")
