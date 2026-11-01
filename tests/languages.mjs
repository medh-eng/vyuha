/* Reviewed dictionaries must remain presentation-only and offline-safe. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
for (const name of ['units', 'languages', 'geometry', 'engine', 'sanjaya']) vm.runInThisContext(fs.readFileSync(new URL('js/' + name + '.js', root), 'utf8'));
const { i18n: L, units: U, engine: E, sanjaya: SJ } = globalThis.AC;
assert.equal(L.keys.length, 149);
const originalDefinitions = JSON.stringify(U);
const state = E.newState({ board: 'wheel', mode: 'ai' });
const before = JSON.stringify(state);
for (const lang of ['hi', 'mr']) {
  const dict = JSON.parse(fs.readFileSync(new URL('incoming/i18n/strings.' + lang + '.json', root)));
  L.setLang(lang);
  for (const key of L.keys) assert.equal(L.text(key), dict[key], lang + ': ' + key);
  for (const key of U.RANK_ORDER) for (const field of ['role', 'one', 'desc', 'tip']) {
    assert.equal(L.unit(key)[field], dict['unit.' + key + '.' + field]);
    assert.equal(L.unit(key).rank, U.UNIT_DEFS[key].rank);
  }
  for (const key of ['vayavya', 'sammohana', 'agneya', 'brahma']) {
    assert.equal(L.astra(key).desc, dict['astra.' + key + '.desc']);
    assert.equal(L.astra(key).cost, U.ASTRA_DEFS[key].cost);
  }
  const mod = { key: 'sharad', name: 'Sharad patience', one: 'old copy', knobs: { turnLimit: 28 } };
  assert.equal(L.daily(mod).name, dict['daily.sharad.name']);
  assert.equal(mod.name, 'Sharad patience'); assert.equal(L.daily(mod).knobs, mod.knobs);
  assert.equal(L.text('missing.key', 'English fallback'), 'English fallback');
  assert.equal(JSON.stringify(state), before, 'language never changes the battle');
}
assert.equal(JSON.stringify(U), originalDefinitions);
assert.equal(L.setLang('xx'), 'en'); assert.equal(L.text('home.codex'), 'Rules');
assert.equal(L.text('lesson.move.title', 'Existing English'), 'Existing English');
const played = [];
globalThis.Audio = class { constructor(url) { this.url = url; } play() { played.push(this.url); return Promise.resolve(); } pause() {} };
SJ.setLang('hi'); SJ.say('scan', { force: true }); assert.equal(played.length, 0);
SJ.say('fort_won', { force: true }); assert.ok(played.at(-1).endsWith('/hi/fort_won_1.mp3'));
SJ.setLang('en'); SJ.say('astra_vayavya_enemy', { force: true }); assert.equal(played.length, 1);
assert.equal(SJ.voicePending.hi.length, 16); assert.equal(SJ.voicePending.en.length, 2);
console.log('149-key catalogues, state separation, fallbacks and stale voice guards passed.');
