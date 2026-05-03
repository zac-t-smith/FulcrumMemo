// Gate cross-check for Phase 4A — Path B' (workbook-aligned).
//
// Substitutes BAA10Y for HY OAS using the v4 workbook's fixed-range
// percentile (floor 145, ceiling 600 bps), recovers Brent into the
// historical pipeline, and keeps existing v3 weights.
//
// Weights (v3, retained for B' per user direction):
//   OAS percentile  : 0.40
//   Brent stress    : 0.25
//   VIX stress      : 0.20
//   DGS10 stress    : 0.15  (folded into existing pipeline below)
//
// NOTE the existing pipeline only has 0.40/0.30/0.30 (OAS/Brent/VIX) and
// no DGS10. Per "keep existing v3 weights", we mirror what the *current
// code actually computes*: 0.40 OAS / 0.30 Brent / 0.30 VIX, with
// graceful reweighting when components are missing.
//
// Run: node quant/scripts/gate_crosscheck.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');

function parseTsHistory(path) {
  const txt = readFileSync(path, 'utf8');
  const re = /\{\s*date:\s*"(\d{4}-\d{2}-\d{2})",\s*value:\s*([\d.\-]+)\s*\}/g;
  const out = [];
  let m;
  while ((m = re.exec(txt)) !== null) {
    out.push({ date: m[1], value: Number(m[2]) });
  }
  return out;
}

const baa = parseTsHistory(resolve(root, 'src/data/baaSpreadHistory.ts'));
const vix = parseTsHistory(resolve(root, 'src/data/vixHistory.ts'));
const brent = parseTsHistory(resolve(root, 'src/data/brentSpotHistory.ts'));

// Workbook-aligned fixed-range percentile parameters
const BAA_PCTL_FLOOR = 145;
const BAA_PCTL_CEILING = 600;

// Existing v3 stress parameters
const VIX_FLOOR = 15;
const VIX_CEILING = 40;
const BRENT_BASELINE = 73;

const baaPercentile = (bps) =>
  Math.min(Math.max((bps - BAA_PCTL_FLOOR) / (BAA_PCTL_CEILING - BAA_PCTL_FLOOR), 0), 1);

function calcComposite({ baaPctl, brentVal, vixVal }) {
  // Mirror calculateFulcrumIndex's reweighting behavior. OAS slot always 0.40.
  let totalWeight = 0.4;
  let weightedSum = baaPctl * 0.4;

  let brentStress = 0;
  if (brentVal !== undefined) {
    brentStress = Math.max(0, Math.min(1, (brentVal - BRENT_BASELINE) / BRENT_BASELINE));
    weightedSum += brentStress * 0.3;
    totalWeight += 0.3;
  }
  let vixStress = 0;
  if (vixVal !== undefined) {
    vixStress = Math.max(0, Math.min(1, (vixVal - VIX_FLOOR) / (VIX_CEILING - VIX_FLOOR)));
    weightedSum += vixStress * 0.3;
    totalWeight += 0.3;
  }
  const idx = Math.round((weightedSum / totalWeight) * 100);
  return { idx, baaPctl, brentStress, vixStress };
}

function buildSeries() {
  const vmap = new Map(vix.map(p => [p.date, p.value]));
  const bmap = new Map(brent.map(p => [p.date, p.value]));
  return baa.map(p => {
    const pctl = baaPercentile(p.value);
    const v = vmap.get(p.date);
    const b = bmap.get(p.date);
    const r = calcComposite({ baaPctl: pctl, brentVal: b, vixVal: v });
    return {
      date: p.date,
      baa: p.value,
      pctl,
      brent: b,
      vix: v,
      idx: r.idx,
      brentStress: r.brentStress,
      vixStress: r.vixStress,
    };
  });
}

const series = buildSeries();

function find(date) { return series.find(p => p.date === date); }

function peakBetween(fromDate, toDate) {
  const sub = series.filter(p => p.date >= fromDate && p.date <= toDate);
  let best = sub[0];
  for (const p of sub) if (p.idx > best.idx) best = p;
  return best;
}

function fmt(p) {
  if (!p) return 'NA';
  const pctl = (p.pctl * 100).toFixed(1);
  const b = p.brent !== undefined ? `$${p.brent.toFixed(2)}` : 'NA';
  const v = p.vix !== undefined ? p.vix.toFixed(2) : 'NA';
  const bs = (p.brentStress * 100).toFixed(0);
  const vs = (p.vixStress * 100).toFixed(0);
  return `${p.date}  baa=${p.baa.toFixed(0)}bps  pctl=${pctl}%  brent=${b} (str=${bs}%)  vix=${v} (str=${vs}%)  idx=${p.idx}`;
}

console.log('================================================================');
console.log('GATE CROSS-CHECK — Path B\'  (BAA10Y fixed-range pctl + Brent)');
console.log('================================================================');
console.log(`  BAA10Y percentile floor=${BAA_PCTL_FLOOR} bps  ceiling=${BAA_PCTL_CEILING} bps`);
console.log(`  Weights: OAS-slot 40% / Brent 30% / VIX 30%  (existing v3, reweighted on missing)`);
console.log('');
console.log(`  BAA10Y obs: ${baa.length}  (${baa[0].date} -> ${baa[baa.length-1].date})`);
console.log(`  VIX obs:    ${vix.length}  (${vix[0].date} -> ${vix[vix.length-1].date})`);
console.log(`  Brent obs:  ${brent.length}  (${brent[0].date} -> ${brent[brent.length-1].date})`);
console.log('');
console.log('  Feb 27, 2026:  ' + fmt(find('2026-02-27')));
const pk = peakBetween('2026-02-28', series[series.length - 1].date);
console.log('  Peak Feb 28+:  ' + fmt(pk));
console.log('  Apr 27, 2026:  ' + fmt(find('2026-04-27')));
console.log('  Latest:        ' + fmt(series[series.length - 1]));
console.log('');
console.log('  Reference (workbook v4 weights w/ inflation+dispersion): 13.2 / 53.3 / 25.2');
console.log('  Expected gap: B\' uses v3 weights w/o inflation+dispersion, so peak likely lower.');
console.log('================================================================');
