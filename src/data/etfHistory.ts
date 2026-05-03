// Adapter that joins the bundled HYG / USO / GLD histories into the
// shape FulcrumIndex.tsx's regime-overlay and regime-performance panels
// expect, plus a simple interpolator that aligns ETF prices to the
// composite's daily index dates.
//
// Source histories (auto-generated):
//   hygHistory.ts — HYG (iShares iBoxx $ HY Corporate Bond), 2007-04-11+
//   usoHistory.ts — USO (United States Oil Fund), 2006-04-10+
//   gldHistory.ts — GLD (SPDR Gold Trust), 2004-11-18+

import { hygHistory } from './hygHistory';
import { usoHistory } from './usoHistory';
import { gldHistory } from './gldHistory';

export interface ETFDataPoint {
  date: string;
  hyg: number;
  uso: number;
  gld: number;
}

export interface RegimePerformance {
  regime: string;
  regimeMin: number;
  regimeMax: number;
  hygReturn: number;   // mean daily HYG % return during the regime
  usoReturn: number;   // mean daily USO % return
  gldReturn: number;   // mean daily GLD % return
  vixChange: number;   // mean daily VIX point change
  sampleDays: number;
}

const REGIMES: Array<{ name: string; min: number; max: number }> = [
  { name: 'Complacency', min: 0, max: 25 },
  { name: 'Latent Stress', min: 25, max: 50 },
  { name: 'Transmission Active', min: 50, max: 75 },
  { name: 'Cycle Imminent', min: 75, max: 101 },
];

// Build a date-keyed map for each history once at module load.
const hygMap = new Map(hygHistory.map(p => [p.date, p.value]));
const usoMap = new Map(usoHistory.map(p => [p.date, p.value]));
const gldMap = new Map(gldHistory.map(p => [p.date, p.value]));

// Sorted dates for forward-fill interpolation.
const hygSorted = hygHistory.map(p => p.date);
const usoSorted = usoHistory.map(p => p.date);
const gldSorted = gldHistory.map(p => p.date);

function lastOnOrBefore(sorted: string[], target: string): string | undefined {
  // binary-search for the rightmost date <= target.
  let lo = 0;
  let hi = sorted.length - 1;
  let best: string | undefined;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] <= target) {
      best = sorted[mid];
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}

/**
 * For each requested date, look up the ETF closing price on or before
 * that date. Used to align asset prices to the daily Fulcrum Index.
 */
export function interpolateETFData(dates: string[]): ETFDataPoint[] {
  return dates.map(date => {
    const hd = hygMap.get(date) ?? (() => {
      const d = lastOnOrBefore(hygSorted, date);
      return d !== undefined ? hygMap.get(d) ?? 0 : 0;
    })();
    const ud = usoMap.get(date) ?? (() => {
      const d = lastOnOrBefore(usoSorted, date);
      return d !== undefined ? usoMap.get(d) ?? 0 : 0;
    })();
    const gd = gldMap.get(date) ?? (() => {
      const d = lastOnOrBefore(gldSorted, date);
      return d !== undefined ? gldMap.get(d) ?? 0 : 0;
    })();
    return { date, hyg: hd, uso: ud, gld: gd };
  });
}

/**
 * For each regime band, compute mean daily % return across HYG/USO/GLD
 * and mean daily VIX point change while the index sat in that band.
 *
 * The index series carries a VIX value where one is available; missing
 * VIX days are dropped from the vixChange average.
 */
export function calculateRegimePerformance(
  indexData: Array<{ date: string; idx: number; vix?: number }>,
  etfData: ETFDataPoint[],
): RegimePerformance[] {
  // Pre-compute daily diffs for ETFs and VIX.
  const dailyHygPct: number[] = [];
  const dailyUsoPct: number[] = [];
  const dailyGldPct: number[] = [];
  const dailyVixDelta: Array<number | null> = [];

  for (let i = 0; i < indexData.length; i++) {
    if (i === 0) {
      dailyHygPct.push(0);
      dailyUsoPct.push(0);
      dailyGldPct.push(0);
      dailyVixDelta.push(null);
      continue;
    }
    const prevHyg = etfData[i - 1].hyg;
    const prevUso = etfData[i - 1].uso;
    const prevGld = etfData[i - 1].gld;
    dailyHygPct.push(prevHyg > 0 ? ((etfData[i].hyg - prevHyg) / prevHyg) * 100 : 0);
    dailyUsoPct.push(prevUso > 0 ? ((etfData[i].uso - prevUso) / prevUso) * 100 : 0);
    dailyGldPct.push(prevGld > 0 ? ((etfData[i].gld - prevGld) / prevGld) * 100 : 0);

    const v0 = indexData[i - 1].vix;
    const v1 = indexData[i].vix;
    dailyVixDelta.push(v0 !== undefined && v1 !== undefined ? v1 - v0 : null);
  }

  return REGIMES.map(r => {
    let hygSum = 0, usoSum = 0, gldSum = 0;
    let vixSum = 0, vixCount = 0;
    let n = 0;
    for (let i = 1; i < indexData.length; i++) {
      const idx = indexData[i].idx;
      if (idx >= r.min && idx < r.max) {
        hygSum += dailyHygPct[i];
        usoSum += dailyUsoPct[i];
        gldSum += dailyGldPct[i];
        const vd = dailyVixDelta[i];
        if (vd !== null) { vixSum += vd; vixCount += 1; }
        n += 1;
      }
    }
    return {
      regime: r.name,
      regimeMin: r.min,
      regimeMax: r.max === 101 ? 100 : r.max,
      hygReturn: n > 0 ? hygSum / n : 0,
      usoReturn: n > 0 ? usoSum / n : 0,
      gldReturn: n > 0 ? gldSum / n : 0,
      vixChange: vixCount > 0 ? vixSum / vixCount : 0,
      sampleDays: n,
    };
  });
}

// Combined ETF series for callers that want the raw stitched timeline.
export const etfHistory: ETFDataPoint[] = (() => {
  // Outer-join across all three histories on date.
  const dates = new Set<string>();
  for (const p of hygHistory) dates.add(p.date);
  for (const p of usoHistory) dates.add(p.date);
  for (const p of gldHistory) dates.add(p.date);
  const sorted = Array.from(dates).sort();
  return interpolateETFData(sorted);
})();
