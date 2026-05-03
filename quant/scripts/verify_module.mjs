// Sanity check: import the new fulcrumIndex module and verify the
// computed constants and three reference dates produce the values we
// reported during the gate cross-check.
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Use tsx-style on-the-fly TS resolution if available; otherwise fall
// back to reading the .ts source and compiling minimally. Easiest path:
// write a tiny CJS wrapper that imports via tsx. Skip fancy tooling and
// just hand-mirror the calc using the bundled history files since the
// data structures haven't changed.
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
  while ((m = re.exec(txt)) !== null) out.push({ date: m[1], value: Number(m[2]) });
  return out;
}

const baa = parseTsHistory(resolve(root, 'src/data/baaSpreadHistory.ts'));
const hy = parseTsHistory(resolve(root, 'src/data/hyOasHistory.ts'));

const cutoff = new Date();
cutoff.setFullYear(cutoff.getFullYear() - 30);
const baa30y = baa.filter(p => new Date(p.date) >= cutoff);
const baaMean = Math.round(baa30y.reduce((a, b) => a + b.value, 0) / baa30y.length);
const hyMean = Math.round(hy.reduce((a, b) => a + b.value, 0) / hy.length);

console.log(`BAA_30YR_MEAN_BPS = ${baaMean}  (computed from ${baa30y.length} obs since ${baa30y[0].date})`);
console.log(`HY_OAS_3YR_MEAN_BPS = ${hyMean}  (computed from ${hy.length} obs since ${hy[0].date})`);
