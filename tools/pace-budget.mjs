/* Calm timing budget per Sanjaya line, from the shipped recordings.
 *   node tools/pace-budget.mjs            → table of every battle line
 *   node tools/pace-budget.mjs --strict   → also fail if a routine clash line
 *                                           puts clash → AI preview over 5.0 s
 * Reads the pacing constants from js/game.js and the effect entry points from
 * js/audio.js, so the table follows the code (see docs/PACING.md).
 * Requires ffprobe.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const game = read('js/game.js'), audio = read('js/audio.js'), sanjaya = read('js/sanjaya.js');

const pace = Function('return ' + game.match(/const PACE = (\{[^}]*\})/)[1])();
const speakAt = Function('return ' + audio.match(/const SPEAK_AT = (\{[\s\S]*?\});/)[1])();
const pending = JSON.parse(sanjaya.match(/const VOICE_PENDING = (\{.*?\});/)[1]);
const ids = [...sanjaya.matchAll(/\['([a-z0-9_]+_\d+)',/g)].map((m) => m[1]);

// Which effect plays under each kind of line (first match wins).
const EFFECT = [
  [/^fort_/, 'shankh'], [/^breach_/, 'breach'], [/^astra_(vayavya|sammohana|agneya|brahma)/, (k) => k.match(/^astra_(\w+?)(_|$)/)[1]],
  [/^volley/, 'volley'], [/^trap_/, 'trap'], [/^(dawn|dusk)/, (k) => k.match(/^(dawn|dusk)/)[1]], [/rotate/, 'chakra'],
  [/capture|assassinate|both_fell|makara|padma|shield_break/, 'clash']
];
const ROUTINE = /capture|assassinate|both_fell|makara|padma|shield_break|volley|trap_/;

function seconds(file) {
  if (!fs.existsSync(file)) return null;
  const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  return r.status === 0 ? +(+r.stdout.trim()).toFixed(2) : null;
}

const rows = [];
for (const id of ids) {
  const rule = EFFECT.find(([re]) => re.test(id));
  if (!rule) continue;                      // start, result and other non-battle lines
  const fx = typeof rule[1] === 'function' ? rule[1](id) : rule[1];
  const entry = Math.max(pace.read, (speakAt[fx] || 0) * 1000) / 1000;
  for (const lang of ['hi', 'en']) {
    const silent = pending[lang] && pending[lang].includes(id);
    const len = silent ? 1.0 : seconds(path.join(root, 'assets/audio/voice', lang, id + '.mp3'));
    if (len == null) continue;
    const total = +(pace.slide / 1000 + entry + len + pace.breath / 1000).toFixed(2);
    rows.push({ id, lang, fx, len, total, routine: ROUTINE.test(id), silent });
  }
}
rows.sort((a, b) => b.total - a.total);
console.log('Calm: slide ' + pace.slide + ' ms · card read ' + pace.read + ' ms · breath ' + pace.breath + ' ms (AI thinks during the line)\n');
console.log('line'.padEnd(26) + 'voice  effect     line s  → AI preview s');
for (const r of rows) {
  const flag = r.total > 5 ? (r.routine ? '  OVER (routine)' : '  over (major moment)') : '';
  console.log(r.id.padEnd(26) + r.lang.padEnd(7) + r.fx.padEnd(11) + String(r.len).padStart(6) + (r.silent ? '*' : ' ') + String(r.total).padStart(9) + flag);
}
const over = rows.filter((r) => r.routine && r.total > 5);
const within = rows.filter((r) => r.total <= 5).length;
console.log('\n' + within + ' of ' + rows.length + ' line/voice pairs reach the AI within 5.0 s. * = text only until re-voiced.');
if (over.length) console.log('Routine lines over budget (re-voice to ≤ ' + (5 - pace.slide / 1000 - pace.read / 1000 - pace.breath / 1000).toFixed(2) + ' s): ' + [...new Set(over.map((r) => r.id + ' (' + r.lang + ')'))].join(', '));
if (process.argv.includes('--strict') && over.length) process.exit(1);
