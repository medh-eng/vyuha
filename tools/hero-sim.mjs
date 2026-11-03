/* Chapter IV hero screening: AI vs AI, one side carries a hero trait.
 *   node tools/hero-sim.mjs [games=200] [board=wheel] [difficulty=veteran]
 * Each hero is played on Suryavansh and on Chandravansh (half the games
 * each) against an army with no hero, so the first-move edge cancels.
 * Reports the hero side's win rate; a no-hero baseline row comes first.
 * Target before a hero ships: hero side 50–58 % (a trait, not a trump).
 */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
['js/units.js', 'js/geometry.js', 'js/engine.js', 'js/ai.js'].forEach((f) =>
  vm.runInThisContext(fs.readFileSync(path.join(root, f), 'utf8'), { filename: f }));
const { engine: E, ai: AI } = globalThis.AC;

const games = +(process.argv[2] || 200);
const board = process.argv[3] || 'wheel';
const diff = process.argv[4] || 'veteran';
const rows = [['none', null], ...Object.keys(E.HEROES).flatMap((k) => [[k + ' (9)', { key: k, host: '9' }], [k + ' (10)', { key: k, host: '10' }]])];

function play(heroes) {
  const s = E.newState({ mode: 'ai', board, difficulty: diff, heroes, startNight: true });
  E.beginBattle(s);
  let guard = 0;
  while (s.phase === 'battle' && guard++ < 1000) {
    const act = AI.chooseAction(s, s.owner, diff);
    if (!act) break;
    if (!E.applyAction(s, act).ok) break;
  }
  return s;
}

console.log('board ' + board + ' · ' + diff + ' · ' + games + ' games per row');
for (const [label, hero] of rows) {
  let heroWins = 0, shared = 0, used = 0;
  for (let i = 0; i < games; i++) {
    const side = i % 2 ? 2 : 1;
    const s = play(hero ? { [side]: hero } : null);
    if (s.winner === 0 || s.winner == null) shared++;
    else if (s.winner === side) heroWins++;
    if (hero && s.heroes[side] && s.heroes[side].used) used++;
  }
  const pct = (n) => (100 * n / games).toFixed(1) + '%';
  console.log(label.padEnd(22) + ' hero side ' + pct(heroWins).padStart(6) + ' · shared ' + pct(shared).padStart(5) + (hero ? ' · once-traits fired ' + pct(used) : ''));
}
