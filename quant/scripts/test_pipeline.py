"""
Self-test for both v4 pipelines.

Monkey-patches the network calls (FRED API and yfinance) to return
synthetic-but-realistic data, then runs both pipelines end-to-end and
verifies output shape, unit transforms, and TypeScript validity.

Does NOT hit the network. Pure local validation.
"""

import sys
import tempfile
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

import fetch_fred_data as fred_pipeline
import fetch_etf_data as etf_pipeline


# ============================================================================
# FRED test
# ============================================================================

def synth_fred(series_id: str, days: int = 90) -> list[fred_pipeline.Observation]:
    """Synthetic FRED data — values match real-world ballparks."""
    base = {
        # Long-history series
        "BAA10Y":  2.10,   # ~210 bps Baa-Treasury, current cycle
        "AAA10Y":  1.20,   # ~120 bps Aaa-Treasury
        "DBAA":    6.50,   # 6.5% Baa yield
        "VIXCLS":  18.0,
        "DGS10":   4.40,
        "T10Y2Y":  0.40,
        "T10YIE":  2.30,
        # Current-cycle series
        "BAMLH0A0HYM2": 2.84,   # ~284 bps HY OAS
        "BAMLH0A3HYC":  5.50,   # ~550 bps CCC
        "BAMLH0A1HYBB": 1.80,   # ~180 bps BB
        "BAMLC0A4CBBB": 1.20,   # ~120 bps BBB
    }.get(series_id, 1.0)

    today = date.today()
    out = []
    for i in range(days, 0, -1):
        d = today - timedelta(days=i)
        v = None if i == 5 else base * (1 + 0.02 * ((i % 7) - 3) / 10)
        out.append(fred_pipeline.Observation(obs_date=d, value=v))
    return out


def test_fred() -> bool:
    print("=" * 70)
    print("FRED PIPELINE TEST")
    print("=" * 70)

    original = fred_pipeline.fetch_series
    fred_pipeline.fetch_series = lambda series_id, *a, **kw: synth_fred(series_id)

    try:
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            data_dir = tmp_path / "data"
            ts_dir = tmp_path / "src" / "data"

            summary = fred_pipeline.run_pipeline(
                api_key="fake-key",
                out_data_dir=data_dir,
                out_ts_dir=ts_dir,
                long_lookback_days=90,
            )

            all_ok = True
            for sid, info in summary["series"].items():
                if info.get("status") != "ok":
                    all_ok = False
                    print(f"  ✗ {sid}: {info}")
                    continue
                cat = info.get("category", "?")
                print(
                    f"  ✓ {sid} [{cat}]: {info['row_count']} rows, "
                    f"latest {info['latest_date']} = {info['latest_value']:.2f}"
                )

            # Verify the long-history vs current-cycle architecture made it
            # into the summary
            categories = {sid: info.get("category") for sid, info in summary["series"].items()}
            assert categories.get("BAA10Y") == "long_history", "BAA10Y should be long_history"
            assert categories.get("BAMLH0A0HYM2") == "current_cycle", "HY OAS should be current_cycle"

            # Spot-check the BAA10Y file — primary signal, should be in bps
            baa_ts = ts_dir / "baaSpreadHistory.ts"
            assert baa_ts.exists(), "baaSpreadHistory.ts not generated"
            content = baa_ts.read_text()
            # 2.10 -> 210 bps
            assert "value: 21" in content, f"BAA10Y bps transform failed (expected ~210)"
            assert 'units: "bps"' in content, "BAA10Y should be in bps"

            # DBAA should NOT be transformed (raw percent yield)
            dbaa_ts = ts_dir / "baaYieldHistory.ts"
            assert dbaa_ts.exists()
            dbaa_content = dbaa_ts.read_text()
            # 6.50 -> 6.50, NOT 650
            data_lines = [l for l in dbaa_content.split("\n") if l.startswith("  { date:")]
            sample_val = float(data_lines[0].split("value:")[1].strip().rstrip(",").rstrip("}").strip())
            assert 6.0 < sample_val < 7.0, f"DBAA should be ~6.5 raw, got {sample_val}"

            # Verify CSVs exist
            assert (data_dir / "fred_BAA10Y.csv").exists()
            assert (data_dir / "fred_BAMLH0A0HYM2.csv").exists()

            return all_ok
    finally:
        fred_pipeline.fetch_series = original


# ============================================================================
# ETF test
# ============================================================================

def synth_etf(ticker: str, start: date, end: date) -> list[etf_pipeline.EtfRow]:
    base = {"HYG": 80.0, "USO": 130.0, "GLD": 430.0}.get(ticker, 100.0)
    out = []
    cur = start
    i = 0
    while cur <= end:
        # Skip weekends to mimic market data
        if cur.weekday() < 5:
            close = base * (1 + 0.001 * ((i % 7) - 3))
            out.append(etf_pipeline.EtfRow(obs_date=cur, close=close))
            i += 1
        cur += timedelta(days=1)
    return out


def test_etf() -> bool:
    print()
    print("=" * 70)
    print("ETF PIPELINE TEST")
    print("=" * 70)

    original = etf_pipeline.fetch_etf_via_yfinance
    etf_pipeline.fetch_etf_via_yfinance = synth_etf

    try:
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            data_dir = tmp_path / "data"
            ts_dir = tmp_path / "src" / "data"

            summary = etf_pipeline.run_pipeline(
                out_data_dir=data_dir,
                out_ts_dir=ts_dir,
            )

            all_ok = True
            for ticker, info in summary["etfs"].items():
                if info.get("status") != "ok":
                    all_ok = False
                    print(f"  ✗ {ticker}: {info}")
                    continue
                print(
                    f"  ✓ {ticker}: {info['row_count']:,} rows over "
                    f"{info['years_coverage']}y, latest ${info['latest_value']:.2f}"
                )

            # Spot-check HYG file
            hyg_ts = ts_dir / "hygHistory.ts"
            assert hyg_ts.exists()
            content = hyg_ts.read_text()
            assert "DailyDataPoint" in content
            assert 'ticker: "HYG"' in content

            # Verify the canonical schema matches what the FRED pipeline produces
            # Both should emit `export const {name}: DailyDataPoint[]`
            assert "export const hygHistory: DailyDataPoint[]" in content

            return all_ok
    finally:
        etf_pipeline.fetch_etf_via_yfinance = original


def main() -> int:
    fred_ok = test_fred()
    etf_ok = test_etf()

    print()
    print("=" * 70)
    if fred_ok and etf_ok:
        print("✓ ALL CHECKS PASSED")
        return 0
    else:
        print("✗ SOME CHECKS FAILED")
        return 1


if __name__ == "__main__":
    sys.exit(main())
