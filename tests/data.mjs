/* data/ registers stay in step with the game and with the files on disk.
 *   node tests/data.mjs
 * - pieces, astras, fields: must equal a fresh export from js/units.js and js/art.js
 * - sounds: every mp3 in assets/audio/music and sfx is registered, every registered file exists
 * - art: every folder and file named exists
 * - fields: every painting named exists
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
let checks = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); checks++; };

const exp = spawnSync('node', [path.join(root, 'tools/export-data.mjs'), '--check'], { encoding: 'utf8' });
ok(exp.status === 0, 'data/pieces, astras, fields match the code (run: node tools/export-data.mjs)\n' + exp.stdout);

const sounds = read('data/sounds.json');
const registered = new Set(sounds.sounds.map((s) => s.file));
ok(registered.size === sounds.sounds.length, 'no sound is registered twice');
for (const dir of ['music', 'sfx']) {
  for (const f of fs.readdirSync(path.join(root, 'assets/audio', dir)).filter((n) => n.endsWith('.mp3'))) {
    ok(registered.has(`assets/audio/${dir}/${f}`), `sound registered in data/sounds.json: ${dir}/${f}`);
  }
}
for (const s of sounds.sounds) {
  ok(fs.existsSync(path.join(root, s.file)), 'registered sound exists: ' + s.file);
  ok(['gemini', 'pixabay', 'gemini-or-pixabay', 'other'].includes(s.origin), 'sound origin is a known value: ' + s.file);
  if (s.verified) ok(s.link || s.origin === 'gemini', 'a verified sound names its source page: ' + s.file);
}

const art = read('data/art.json');
for (const set of art.sets) {
  ok(fs.existsSync(path.join(root, set.path)), 'art folder exists: ' + set.path);
  for (const f of set.files || []) ok(fs.existsSync(path.join(root, set.path, f)), 'art file exists: ' + set.path + '/' + f);
}

for (const f of read('data/fields.json').fields) {
  if (!f.painting) continue;
  ok(fs.existsSync(path.join(root, f.painting.day)), 'field painting exists: ' + f.painting.day);
  ok(fs.existsSync(path.join(root, f.painting.night)), 'field painting exists: ' + f.painting.night);
}

console.log(`Data registers: ${checks} checks passed.`);
