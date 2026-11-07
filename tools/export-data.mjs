/* Write the code-derived JSON registers in data/ from the game's own files.
 *   node tools/export-data.mjs          rewrite data/pieces.json, astras.json, fields.json
 *   node tools/export-data.mjs --check  exit 1 if any of them is out of date (tests/data.mjs uses this)
 * The runtime never reads data/: the game's constants stay in js/units.js and js/art.js, and these
 * files are the readable, diffable copy that docs, tools and other agents work from.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = {
  console,
  Image: class { set src(v) { this.onerror && this.onerror(); } },
  document: { documentElement: { style: { setProperty() {} }, setAttribute() {} }, body: { classList: { add() {} } } }
};
vm.createContext(ctx);
for (const f of ['js/units.js', 'js/art.js']) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
const { units: U, art: A } = ctx.AC;

const pieces = {
  _about: 'Generated from js/units.js by tools/export-data.mjs. Do not edit by hand.',
  deployOrder: U.ROSTER_ORDER,
  pieces: U.RANK_ORDER.concat(['B', 'F']).filter((k, i, a) => a.indexOf(k) === i).map((k) => {
    const d = U.UNIT_DEFS[k];
    return { key: d.key, rank: d.rank, count: d.count, name: d.name, deva: d.deva, one: d.one };
  })
};
const astras = {
  _about: 'Generated from js/units.js by tools/export-data.mjs. Do not edit by hand.',
  astras: Object.values(U.ASTRA_DEFS).map((d) => ({ key: d.key, cost: d.cost, name: d.name, deva: d.deva, element: d.element, one: d.one }))
};
const painted = new Set(A.PATA_FIELDS);
const fields = {
  _about: 'Generated from js/units.js and js/art.js by tools/export-data.mjs. Do not edit by hand.',
  fields: Object.values(U.BOARDS).map((b) => {
    const key = b.key === 'wheel' ? 'chakra' : b.key;
    const square = b.cols > 0;
    return {
      key: b.key, label: b.label, deva: b.deva, blurb: b.blurb,
      kind: b.key === 'wheel' ? 'wheel' : b.key === 'padma' ? 'lotus' : 'square',
      cols: b.cols, rows: b.rows, cells: square ? b.cols * b.rows : b.cells, roundCap: b.roundCap,
      riftCells: b.rifts.length,
      sidewaysInLandscape: square,
      painting: b.key === 'wheel' || painted.has(b.key)
        ? { day: `assets/art/pata/fields/${key}-day.webp`, night: `assets/art/pata/fields/${key}-night.webp`, box: A.PATA_FIELD_BOX[b.key] || null }
        : null
    };
  })
};

const out = { 'data/pieces.json': pieces, 'data/astras.json': astras, 'data/fields.json': fields };
let stale = 0;
for (const [rel, obj] of Object.entries(out)) {
  const text = JSON.stringify(obj, null, 2) + '\n';
  const file = path.join(root, rel);
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text) { console.log('out of date: ' + rel); stale++; }
  } else {
    fs.writeFileSync(file, text);
    console.log('wrote ' + rel);
  }
}
if (stale) { console.log('Run: node tools/export-data.mjs'); process.exit(1); }
