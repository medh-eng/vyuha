/* Audio priority checks (review plan step 4, 7 Nov 2026).
 * Which of Sanjaya's lines speaks when several moments fall in one turn, and how his queue
 * behaves: one voice at a time, nothing cuts a playing line, a more important line replaces
 * waiting lesser ones, at most three wait. Runs in Node with a fake clock (no audio device).
 *   node tests/audio.mjs
 */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);

// fake clock: sanjaya reads setTimeout and Date.now at call time
let now = 1e6;
let timers = [];
let nextId = 1;
globalThis.setTimeout = (fn, ms) => { const id = nextId++; timers.push({ id, fn, at: now + (ms || 0) }); return id; };
globalThis.clearTimeout = (id) => { timers = timers.filter((t) => t.id !== id); };
const realNow = Date.now;
Date.now = () => now;
async function advance(ms) {
  const end = now + ms;
  for (;;) {
    timers.sort((a, b) => a.at - b.at);
    const t = timers[0];
    if (!t || t.at > end) break;
    timers.shift();
    now = t.at;
    t.fn();
    await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
  }
  now = end;
  for (let i = 0; i < 5; i++) await Promise.resolve();
}

globalThis.AC = {};
for (const name of ['units', 'sanjaya']) vm.runInThisContext(fs.readFileSync(new URL('js/' + name + '.js', root), 'utf8'));
const SJ = globalThis.AC.sanjaya;

let passed = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); passed++; console.log('  ✓ ' + msg); };

console.log('Every line has a tier');
const lineKeys = Object.keys(SJ.LINES).sort();
const tierKeys = Object.keys(SJ.PRIORITY).sort();
ok(lineKeys.every((k) => SJ.PRIORITY[k] != null), 'each of the ' + lineKeys.length + ' line keys has an explicit priority (missing: ' + lineKeys.filter((k) => SJ.PRIORITY[k] == null).join(', ') + ')');
ok(tierKeys.every((k) => SJ.LINES[k]), 'no priority for a line that does not exist');
ok(lineKeys.every((k) => SJ.priority(k) === SJ.PRIORITY[k]), 'priority() reads the table, not a pattern');

console.log('Tiers in order');
const tier = (k) => SJ.priority(k);
const above = (a, b) => ok(tier(a) > tier(b), a + ' (' + tier(a) + ') outranks ' + b + ' (' + tier(b) + ')');
above('fort_won', 'victory');
above('victory', 'breach_enemy');
above('defeat', 'lose_capture');
above('breach_own', 'astra_brahma_enemy');
above('astra_agneya', 'last_rounds');
above('sunset_near', 'win_capture');
above('win_capture', 'trap_hit');
above('trap_defused', 'rotate');
ok(tier('rotate_padma') === tier('rotate'), 'the lotus turning ranks with the wheel turning (was 4 by a /padma/ pattern)');
ok(tier('padma') === tier('makara'), 'the lotus defence ranks with the makara jaws');
above('dusk', 'shakti_full');
ok(['victory', 'defeat', 'draw'].every((k) => tier(k) === 8), 'every result line shares one tier');
for (const a of ['vayavya', 'sammohana', 'agneya', 'brahma']) {
  ok(tier('astra_' + a) === tier('astra_' + a + '_enemy'), a + ': your astra and the enemy astra rank alike');
}

console.log('Choosing the line for one turn');
const first = (keys, want, why) => ok(SJ.rank(keys)[0] === want, why + ': ' + JSON.stringify(keys) + ' → ' + want);
first(['win_capture', 'rotate'], 'win_capture', 'a capture beats the wheel turning');
first(['trap_hit', 'rotate_padma'], 'trap_hit', 'a trap beats the lotus turning');
first(['win_capture', 'dusk'], 'win_capture', 'a capture beats dusk');
first(['win_capture', 'last_rounds'], 'last_rounds', 'the four-rounds warning is not lost under a routine capture');
first(['lose_capture', 'sunset_near'], 'sunset_near', 'the sunset warning is not lost under a routine loss');
first(['win_capture', 'victory'], 'victory', 'the result beats the blow that ended it');
first(['fort_won', 'victory'], 'fort_won', 'taking the fort is the result line itself');
first(['fort_lost', 'defeat'], 'fort_lost', 'losing the fort is the result line itself');
first(['breach_enemy', 'win_capture', 'rotate'], 'breach_enemy', 'a gate breaking beats the capture and the turn');
first(['astra_brahma', 'win_capture'], 'astra_brahma', 'an astra beats a capture');
first(['scan', 'shakti_full'], 'scan', 'equal tiers keep the order the moments happened in');
ok(JSON.stringify(SJ.rank(['rotate', 'win_capture', 'dawn', 'trap_hit'])) === JSON.stringify(['win_capture', 'trap_hit', 'rotate', 'dawn']),
  'a full ranking is stable within a tier');

console.log('Sanjaya\'s queue (text-only, fake clock)');
const spoken = [];
SJ.setVoice(false);
SJ.onLine((text, line, key) => spoken.push({ key, at: now }));
const results = [];
const say = (k) => { const p = SJ.say(k, { force: true }); p.then((r) => results.push({ k, r: r ? 'spoken' : 'dropped' })); return p; };

say('rotate');
await advance(10);
ok(spoken.length === 1 && spoken[0].key === 'rotate', 'a line starts at once when the floor is free');
say('win_capture');
await advance(10);
ok(spoken.length === 1, 'a more important line does not cut a playing line off');
say('dawn');
await advance(10);
ok(spoken.length === 1, 'a lesser line waits behind the capture');
say('breach_enemy');
await advance(10);
await advance(1100);
ok(spoken[1] && spoken[1].key === 'breach_enemy', 'the gate breaking replaced the waiting lesser lines and spoke next');
ok(results.some((x) => x.k === 'win_capture' && x.r === 'dropped') && results.some((x) => x.k === 'dawn' && x.r === 'dropped'),
  'the replaced lines resolve as dropped, so the game does not wait on them');
await advance(3000);
ok(spoken.length === 2, 'nothing else speaks after the queue empties');

spoken.length = 0; results.length = 0;
say('fort_won'); await advance(10);
for (const k of ['dawn', 'dusk', 'rotate', 'scan']) say(k);
await advance(10);
ok(results.some((x) => x.k === 'scan' && x.r === 'dropped'), 'at most three lines wait; the fourth is dropped');
await advance(5000);
ok(spoken.map((s) => s.key).join(',') === 'fort_won,dawn,dusk,rotate', 'waiting lines of one tier speak in order, one at a time');
ok(spoken.every((s, i) => i === 0 || s.at - spoken[i - 1].at >= 1000), 'no two lines start within a line\'s reading time');

spoken.length = 0;
say('win_capture'); await advance(10);
say('lose_capture'); await advance(10);
SJ.stop();
await advance(10);
say('dawn'); await advance(10);
ok(spoken.map((s) => s.key).join(',') === 'win_capture,dawn', 'stop() frees the floor at once and clears the waiting line');
await advance(2000);

console.log('Quick-mode queue in the game');
const gameJs = fs.readFileSync(new URL('js/game.js', root), 'utf8');
ok(/sayQueue = SJ\.rank\(sayQueue\.concat\(keys\)\)\.slice\(0, 3\)/.test(gameJs), 'Quick keeps the three most important waiting lines, not the three oldest');
ok(!/g\.said\.shakti_full = true/.test(gameJs) && /function markSaid/.test(gameJs), 'once-a-battle lines are marked said only when chosen to speak');
ok(/SJ\.rank\(moments\)/.test(gameJs), 'Calm ranks the turn\'s moments through the same table');

Date.now = realNow;
console.log('\n' + passed + ' passed, 0 failed');
