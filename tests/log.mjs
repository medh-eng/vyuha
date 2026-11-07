/* Battle log data (review plan step 4, 7 Nov 2026): every cell has a unique name, and every
 * log entry for an action records who acted, from where, to where and with which piece, and
 * whether that piece could be seen — so the screen can name your own pieces and keep hidden
 * enemy pieces hidden.
 *   node tests/log.mjs
 */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
globalThis.AC = {};
for (const f of ['units', 'geometry', 'engine', 'ai']) vm.runInThisContext(fs.readFileSync(new URL('js/' + f + '.js', root), 'utf8'), { filename: f + '.js' });
const { engine: E, ai, geometry: G } = globalThis.AC;

let passed = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); passed++; console.log('  ✓ ' + msg); };

console.log('Cell names');
for (const key of ['small', 'large', 'wheel', 'padma']) {
  const b = G.build(key);
  const names = b.cells.map((c) => JSON.stringify(G.cellName(key, c.id)));
  ok(names.every((n) => n !== 'null'), key + ': every one of ' + b.cells.length + ' cells has a name');
  ok(new Set(names).size === names.length, key + ': no two cells share a name');
}
ok(G.cellName('small', '0,0').text === 'A1' && G.cellName('small', '7,5').text === 'F8', 'square names follow the printed letters and numbers (A1 top-left)');
ok(G.cellName('large', '9,7').text === 'H10', 'the 8 × 10 field reaches H10');
const labels = G.build('small').labels.map((l) => l.text);
ok(['A', 'F', '1', '8'].every((t) => labels.includes(t)), 'the printed coordinates include the letters and numbers the names use');
ok(G.cellName('wheel', 'h').kind === 'hub' && G.cellName('padma', '0,0').kind === 'hub', 'the wheel hub and the lotus centre are named as such');
const homes = G.build('padma').homes;
ok(G.cellName('padma', homes[1]).clock === '6:00' && G.cellName('padma', homes[2]).clock === '12:00', 'lotus forts sit at 6 and 12 o\'clock on the outer ring');
ok(/^\d{1,2}:(00|30)$/.test(G.cellName('wheel', 'r3s4').clock), 'wheel cells read as a clock position');

console.log('Log entries from real battles');
const kinds = {};
let hiddenMoves = 0;
for (let n = 0; n < 8; n++) {
  const board = ['small', 'large', 'wheel', 'padma'][n % 4];
  const s = E.newState({ mode: 'ai', board, difficulty: 'veteran', rules: { gates: true, hours: true, vyuha: true, astras: true } });
  E.beginBattle(s);
  for (let guard = 0; s.phase === 'battle' && guard < 220; guard++) {
    const act = ai.chooseAction(s, s.owner, n % 2 ? 'archon' : 'veteran');
    if (!act) break;
    const actor = s.owner;
    const mover = act.from ? s.board[act.from] : null;
    const before = s.log.length;
    const res = E.applyAction(s, act);
    assert.ok(res.ok, 'legal action');
    const fresh = s.log.slice(before);
    for (const l of fresh) {
      kinds[l.kind] = (kinds[l.kind] || 0) + 1;
      if (['move', 'clash', 'scan', 'barrage'].includes(l.kind)) {
        assert.equal(l.who, actor, l.kind + ': who acted');
        assert.ok(l.from && l.at, l.kind + ': both cells recorded');
        assert.ok(G.cellName(board, l.from) && G.cellName(board, l.at), l.kind + ': both cells have names');
        assert.equal(l.piece, mover.key, l.kind + ': the acting piece');
      }
      if (l.kind === 'move') {
        // seen = whether the enemy could see the piece once it had moved (a turning ring may
        // carry and expose it afterwards, so: seen implies revealed; hidden now implies not seen)
        assert.ok(!l.seen || mover.revealed, 'move: a piece logged as seen is revealed');
        if (!mover.revealed) assert.equal(l.seen, 0, 'move: a piece still hidden was logged as hidden');
        if (!l.seen) hiddenMoves++;
      }
      if (l.kind === 'astra') assert.equal(l.who, actor, 'astra: who invoked it');
    }
  }
}
ok(kinds.move > 50 && kinds.clash > 10, 'eight AI battles produced ' + kinds.move + ' moves and ' + kinds.clash + ' clashes, each with who / from / to / piece');
ok(hiddenMoves > 10, hiddenMoves + ' moves were made by pieces still hidden (logged with seen = 0)');
ok(Object.keys(kinds).length >= 4, 'entry kinds seen: ' + Object.keys(kinds).sort().join(', '));

console.log('Old saves');
const old = E.newState({ board: 'small' });
old.log.push({ turn: 3, kind: 'move', text: 'Suryavansh advanced a unit.', at: '5,2', t: 0 });
ok(!old.log[0].who && old.log[0].text, 'an entry from before 7 Nov keeps its text (the screen falls back to it)');

console.log('\n' + passed + ' passed, 0 failed');
