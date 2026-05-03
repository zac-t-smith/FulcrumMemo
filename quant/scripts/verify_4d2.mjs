// 4D-2 verification: replicate the new calculator logic against bundled
// histories and report composite values at known cycle peaks.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');

function parse(p) {
  const t = readFileSync(p, 'utf8');
  const re = /\{\s*date:\s*"(\d{4}-\d{2}-\d{2})",\s*value:\s*([\d.\-]+)\s*\}/g;
  const out = []; let m;
  while ((m = re.exec(t)) !== null) out.push({ date: m[1], value: Number(m[2]) });
  return out;
}

const baa = parse(resolve(root, 'src/data/baaSpreadHistory.ts'));
const vix = parse(resolve(root, 'src/data/vixHistory.ts'));
const brent = parse(resolve(root, 'src/data/brentSpotHistory.ts'));

// Replicate buildRollingBaselines.
const YEARS = 10;
const MS = YEARS * 365.25 * 24 * 3600 * 1000;
function lower(arr, v) { let lo=0, hi=arr.length; while(lo<hi){const m=(lo+hi)>>1; if(arr[m]<v) lo=m+1; else hi=m;} return lo; }
function upper(arr, v) { let lo=0, hi=arr.length; while(lo<hi){const m=(lo+hi)>>1; if(arr[m]<=v) lo=m+1; else hi=m;} return lo; }

function rollingMeanX2(series) {
  const out = new Map();
  const ts = series.map(p => Date.parse(p.date));
  let sum = 0, lo = 0;
  for (let i = 0; i < series.length; i++) {
    const cutoff = ts[i] - MS;
    while (lo < i && ts[lo] < cutoff) { sum -= series[lo].value; lo++; }
    sum += series[i].value;
    const baseline = sum / (i - lo + 1);
    out.set(series[i].date, { baseline, ceiling: baseline * 2 });
  }
  return out;
}

function rollingMedian95(series) {
  const out = new Map();
  const ts = series.map(p => Date.parse(p.date));
  const sorted = [];
  let lo = 0;
  for (let i = 0; i < series.length; i++) {
    const cutoff = ts[i] - MS;
    while (lo < i && ts[lo] < cutoff) {
      const v = series[lo].value;
      const idx = lower(sorted, v);
      if (sorted[idx] === v) sorted.splice(idx, 1);
      lo++;
    }
    const cur = series[i].value;
    sorted.splice(upper(sorted, cur), 0, cur);
    const n = sorted.length;
    const median = n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2])/2 : sorted[Math.floor(n/2)];
    const pIdx = Math.min(n-1, Math.max(0, Math.ceil(n*0.95)-1));
    out.set(series[i].date, { baseline: median, ceiling: sorted[pIdx] });
  }
  return out;
}

const brentBL = rollingMeanX2(brent);
const vixBL = rollingMedian95(vix);

// BAA fixed-range pctl.
const FLOOR = 145, CEILING = 600;
const baaPct = v => Math.min(1, Math.max(0, (v - FLOOR) / (CEILING - FLOOR)));

const vixMap = new Map(vix.map(p => [p.date, p.value]));
const brentMap = new Map(brent.map(p => [p.date, p.value]));

function compositeFor(date, baaVal) {
  const credit = baaPct(baaVal);
  let sum = credit * 0.4;
  let total = 0.4;
  const v = vixMap.get(date);
  const bb = brentMap.get(date);
  const bbb = brentBL.get(date);
  const vbb = vixBL.get(date);
  let brentStress = null, vixStress = null;
  if (bb !== undefined && bbb !== undefined) {
    const span = bbb.ceiling - bbb.baseline;
    // 4D-3-A symmetric: dislocation in either direction.
    brentStress = span > 0 ? Math.min(1, Math.max(0, Math.abs(bb - bbb.baseline) / span)) : 0;
    sum += brentStress * 0.3; total += 0.3;
  }
  if (v !== undefined && vbb !== undefined) {
    const span = vbb.ceiling - vbb.baseline;
    vixStress = span > 0 ? Math.min(1, Math.max(0, (v - vbb.baseline) / span)) : 0;
    sum += vixStress * 0.3; total += 0.3;
  }
  return {
    idx: Math.round(sum / total * 100),
    credit, brentStress, vixStress,
    brentBL: bbb, vixBL: vbb, brent: bb, vix: v
  };
}

function showPeak(label, fromDate, toDate) {
  const sub = baa.filter(p => p.date >= fromDate && p.date <= toDate);
  let best = null;
  for (const p of sub) {
    const c = compositeFor(p.date, p.value);
    if (!best || c.idx > best.idx) best = { date: p.date, baa: p.value, ...c };
  }
  if (!best) { console.log(`${label}: no data in window`); return; }
  const fmt = x => x === null ? 'NA' : x.toFixed(0);
  console.log(`${label}  peak ${best.date}  idx=${best.idx}`);
  console.log(`    baa=${best.baa.toFixed(0)}  credit=${(best.credit*100).toFixed(1)}%`);
  console.log(`    brent=${best.brent ? `$${best.brent.toFixed(2)}` : 'NA'} stress=${best.brentStress!==null ? (best.brentStress*100).toFixed(0)+'%' : 'NA'}` +
    `  baseline=${best.brentBL ? `$${best.brentBL.baseline.toFixed(2)}` : 'NA'}/${best.brentBL ? `$${best.brentBL.ceiling.toFixed(2)}` : 'NA'}`);
  console.log(`    vix=${best.vix ? best.vix.toFixed(2) : 'NA'} stress=${best.vixStress!==null ? (best.vixStress*100).toFixed(0)+'%' : 'NA'}` +
    `  baseline=${best.vixBL ? best.vixBL.baseline.toFixed(2) : 'NA'}/${best.vixBL ? best.vixBL.ceiling.toFixed(2) : 'NA'}`);
}

console.log('=== Phase 4D-2 cycle-peak verification ===\n');
showPeak('GFC (2008-Q3 to 2009-Q2)', '2008-09-01', '2009-06-30');
showPeak('COVID (2020-Q1)', '2020-02-01', '2020-04-30');
showPeak('EU debt crisis (2011)', '2011-07-01', '2011-12-31');
showPeak('Dot-com credit (2002)', '2002-07-01', '2002-12-31');
showPeak('1998 LTCM', '1998-09-01', '1998-12-31');
showPeak('Today (last week)', '2026-04-23', '2026-04-30');

// Also show today specifically
const last = baa[baa.length - 1];
const c = compositeFor(last.date, last.value);
console.log(`\nLatest BAA observation: ${last.date}  baa=${last.value}  composite idx=${c.idx}`);

// True-historical pctl for today
const sortedBaa = baa.map(p => p.value).slice().sort((a,b)=>a-b);
const lo = lower(sortedBaa, last.value);
let hi = lo;
while (hi < sortedBaa.length && sortedBaa[hi] === last.value) hi++;
const truePctl = (lo + hi) / 2 / sortedBaa.length;
console.log(`True-historical BAA percentile: ${(truePctl*100).toFixed(1)}%`);
console.log(`Fixed-range BAA percentile (composite slot): ${(baaPct(last.value)*100).toFixed(1)}%`);

console.log('\n=== 4D-3-A additional spot-checks ===\n');
showPeak('Oil bust (2014-Q4 to 2016-Q1)', '2014-10-01', '2016-03-31');
showPeak('China devaluation (2015-08)', '2015-08-15', '2015-09-30');
showPeak('CPI shock (2022)', '2022-04-01', '2022-12-31');
showPeak('SVB (2023-Q1)', '2023-03-01', '2023-04-30');
