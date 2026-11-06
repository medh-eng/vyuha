/* VYUHA — asset path and voice-coverage regressions.
 * Read-only: checks the existing media files, not their subjective quality.
 */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'js/art.js'), 'utf8');
const loaded = [];
class FakeImage {
  set src(value) {
    loaded.push(value);
    if (existsSync(join(root, value))) this.onload?.();
    else this.onerror?.();
  }
}
const context = {
  Image: FakeImage,
  console,
  document: {
    documentElement: { style: { setProperty() {} }, setAttribute() {} },
    body: { classList: { add() {} } },
  },
};
vm.runInNewContext(source, context, { filename: 'js/art.js' });
const art = context.AC.art;

for (const [slot, expected] of [
  ['sky:day', 'assets/art/opt/ui/day.jpg'],
  ['sky:night', 'assets/art/opt/ui/night.jpg'],
  ['ui:breach', 'assets/art/opt/ui/breach.jpg'],
  ['portrait:sanjaya-anim', 'assets/art/opt/portraits/sanjaya-anim.webp'],
  // the Painted cloth look (default) swaps in the Phase 2 avatars and astra stills
  ['hero:arjuna', 'assets/art/pata/portraits/arjuna.webp'],
  ['astra:vayavya', 'assets/art/pata/astras/vayavya.webp'],
  ['astra:agneya-anim', 'assets/art/opt/astras/agneya-anim.webp'],
  ['pata:fields/padma-night', 'assets/art/pata/fields/padma-night.webp'],
]) {
  const resolved = art.artFor(slot);
  assert.equal(loaded.at(-1), expected, `${slot} must request the shipped asset path`);
  assert.equal(resolved, expected, `${slot} must resolve to an existing asset`);
}
// Classic keeps its own paintings
art.setSkin('bronze');
for (const [slot, expected] of [
  ['hero:karna', 'assets/art/opt/heroes/karna.webp'],
  ['astra:brahma', 'assets/art/opt/astras/brahma.webp'],
]) {
  assert.equal(art.artFor(slot), expected, `${slot} (Classic) must resolve to its own painting`);
}
art.setSkin('pata');
// every Pata file the game can ask for exists
const pataFiles = [];
for (const f of ['chakra', 'padma', 'small', 'large']) for (const h of ['day', 'night']) pataFiles.push(`fields/${f}-${h}`);
for (const k of ['sanjaya', 'arjuna', 'karna', 'bhima', 'abhimanyu', 'ghatotkach', 'drona', 'bhishma', 'draupadi', 'dhrishtadyumna']) pataFiles.push('portraits/' + k);
for (const k of ['vayavya', 'sammohana', 'agneya', 'brahma']) pataFiles.push('astras/' + k);
for (const f of pataFiles) assert.ok(existsSync(join(root, 'assets/art/pata', f + '.webp')), 'missing Pata art: ' + f);
for (const k of art.PATA_FIELDS) assert.ok(art.PATA_FIELD_BOX[k], 'field painting without a placement box: ' + k);

const html = readFileSync(join(root, 'index.html'), 'utf8');
const og = html.match(/<meta property="og:image" content="([^"]+)"/);
assert.ok(og, 'share preview must declare an og:image');
assert.ok(og[1].startsWith('https://'), 'social crawlers need an absolute image URL');
const imagePath = new URL(og[1]).pathname.replace(/^\/vyuha\//, '');
assert.ok(existsSync(join(root, imagePath)), 'share preview must point to shipped image');

const csv = readFileSync(join(root, 'docs/voice/sanjaya-lines.csv'), 'utf8');
const voiceIds = csv.split(/\r?\n/).slice(1).map(line => /^"([^"]+)"/.exec(line)?.[1]).filter(Boolean);
assert.equal(voiceIds.length, 44, 'voice script declares 44 cues');
for (const language of ['hi', 'en']) {
  for (const id of voiceIds) {
    assert.ok(existsSync(join(root, 'assets/audio/voice', language, id + '.mp3')), `missing ${language} narration: ${id}`);
  }
}

console.log(`Asset paths: 8 resolved, 2 Classic, ${pataFiles.length} Pata files; OG preview: valid; narration: ${voiceIds.length * 2} files found.`);
