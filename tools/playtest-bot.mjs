/* A robot player on a phone screen: plays real battles by tapping, the way a
 * person does, with cinematics and sound on, and watches for anything that
 * breaks — runtime errors, a turn that never comes back, a board that loses
 * pieces, a stage that never closes, anything that spills off the screen.
 *   node tools/playtest-bot.mjs [outDir] [battles]
 * Portrait and landscape, four fields per viewport, then the field drill and
 * a complete Daily. Quick pace; cinematic cards are tapped to skip, as before.
 * ROBOT_SEED (uint32) sets the initial RNG seed; summary.json records it.
 * Cosmetic effects share that RNG, so timing can still change the exact match.
 * ROBOT_VIEWPORT selects one label for diagnosis; omit it for acceptance.
 */
import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require(require('node:child_process').execSync('npm root -g').toString().trim() + '/playwright')); }

const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.argv[2] || path.join(root, '.playtest');
const battles = +(process.argv[3] || 4);
if (!Number.isInteger(battles) || battles < 4) throw new Error('Use at least four battles to cover every field.');
const seed = Number(process.env.ROBOT_SEED || 0x410711);
if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new Error('ROBOT_SEED must be a uint32.');
const viewports = [['phone', 390, 844], ['small-phone', 360, 640], ['landscape', 844, 390], ['small-landscape', 640, 360]];
const selected = viewports.filter(([label]) => !process.env.ROBOT_VIEWPORT || label === process.env.ROBOT_VIEWPORT);
if (!selected.length) throw new Error('Unknown ROBOT_VIEWPORT.');
const results = [];
fs.mkdirSync(out, { recursive: true });
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0].split('#')[0]).replace(/\/$/, '/index.html'));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const base = 'http://127.0.0.1:' + server.address().port + '/';
let browser;
const problems = [];
const note = (m) => { problems.push(m); console.log('  ! ' + m); };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function shot(page, name) { await page.screenshot({ path: path.join(out, name + '.png') }); }
async function closeModals(page) { await page.evaluate(() => AC.app.modals && AC.app.modals.slice().forEach((m) => m.close())); }
async function tapCell(page, id) {
  // the board can redraw between finding a cell and measuring it, so look it up again (3 tries)
  let box = null;
  for (let i = 0; i < 3 && !box; i++) {
    const el = await page.$('#board .cell[data-id="' + id + '"]');
    if (el) box = await el.boundingBox();
    if (!box) await sleep(120);
  }
  if (!box) throw new Error('Missing or invisible cell: ' + id);
  const { width, height } = page.viewportSize();
  if (box.x < -1 || box.y < -1 || box.x + box.width > width + 1 || box.y + box.height > height + 1) {
    throw new Error('Cell outside viewport: ' + id + ' ' + JSON.stringify(box));
  }
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  return true;
}
async function waitMyTurn(page, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const s = await page.evaluate(() => {
      const g = AC.game, st = g.state;
      if (document.querySelector('.stage')) { document.querySelector('.stage').click(); return 'stage'; }
      if (!st) return 'none';
      if (st.phase === 'over' || st.winner) return 'over';
      return (!g.thinking && !g.busy && st.owner === 1 && st.phase === 'battle') ? 'mine' : 'wait';
    });
    if (s === 'mine' || s === 'over') return s;
    await sleep(120);
  }
  return 'timeout';
}

async function playAction(page, act) {
  const before = await page.evaluate(() => AC.game.state.log.length);
  if (act.type === 'astra') {
    await page.locator('#action-bar [data-astra="' + act.astra + '"]').tap();
    if (act.from) await tapCell(page, act.from);
  } else {
    await tapCell(page, act.from);
    if (act.type === 'barrage' || act.type === 'scan') {
      await page.locator('#action-bar [data-mode="special"]').tap();
    }
  }
  await tapCell(page, act.to);
  const confirm = page.locator('#action-bar [data-act="confirm"]');
  if (await confirm.count()) await confirm.tap();
  // A failed tap is a failure, never silently replaced by game.perform().
  await page.waitForFunction(n => AC.game.state.log.length !== n, before, { timeout: 3000 });
}

async function audit(page, tag) {
  const chk = await page.evaluate(() => {
    const st = AC.game.state;
    const cells = [...document.querySelectorAll('#board .cell')];
    const outside = cells.filter(el => {
      const r = el.getBoundingClientRect();
      return r.width <= 0 || r.height <= 0 || r.left < -1 || r.top < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1;
    }).map(el => el.dataset.id);
    return { horizontal: document.documentElement.scrollWidth > innerWidth + 1,
      vertical: innerWidth > innerHeight && document.documentElement.scrollHeight > innerHeight + 1,
      tokens: document.querySelectorAll('#board .token').length,
      pieces: Object.values(st.board).filter(Boolean).length, cells: cells.length, outside };
  });
  if (chk.horizontal || chk.vertical) throw new Error(tag + ': page overflow ' + JSON.stringify(chk));
  if (!chk.cells || chk.outside.length) throw new Error(tag + ': field clipped ' + JSON.stringify(chk));
  if (chk.tokens !== chk.pieces) throw new Error(tag + ': missing tokens ' + JSON.stringify(chk));
}

async function playBattle(page, tag) {
  let moves = 0;
  for (; moves < 160; moves++) {
    const status = await waitMyTurn(page, 20000);
    if (status === 'over') break;
    if (status === 'timeout') throw new Error(tag + ': turn never came back at move ' + moves);
    await closeModals(page);
    await audit(page, tag + ' move ' + moves);
    const act = await page.evaluate(() => AC.ai.chooseAction(AC.game.state, 1, 'veteran'));
    if (!act) throw new Error(tag + ': no legal action for player');
    await playAction(page, act);
    if (moves === 6 || moves === 30) await shot(page, tag + (moves === 6 ? '-early' : '-mid'));
  }
  await sleep(1800);
  const end = await page.evaluate(() => ({ phase: AC.game.state.phase, winner: AC.game.state.winner,
    round: AC.game.state.turn, reason: AC.game.state.endReason || (AC.game.state.log.at(-1) || {}).text }));
  if (end.phase !== 'over' || ![0, 1, 2].includes(end.winner)) throw new Error(tag + ': battle did not finish after ' + moves + ' moves');
  await audit(page, tag + ' end');
  results.push({ tag, moves, ...end });
  console.log(tag, 'moves', moves, JSON.stringify(end));
  await shot(page, tag + '-end');
  await closeModals(page);
}

async function scenario(page, tag, run) {
  console.log('Starting', tag);
  try { await run(); }
  catch (e) {
    note(tag + ': ' + e.message);
    results.push({ tag, error: e.message });
    await shot(page, tag + '-failed');
    await closeModals(page);
  }
}

try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
for (const [label, w, h] of selected) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  await ctx.addInitScript(seed => {
    let n = seed;
    Math.random = () => { n = (Math.imul(n, 1664525) + 1013904223) >>> 0; return n / 4294967296; };
  }, seed);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => note(label + ' pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.g|ERR_|404|Failed to load resource/.test(m.text())) note(label + ' console: ' + m.text()); });
  await page.goto(base + 'index.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('#screen-home:not([hidden])');
  await page.waitForSelector('#boot', { state: 'hidden' });
  await page.evaluate(lang => AC.ui.patchSettings({ pace: 'quick', uiLang: lang }), process.env.UI_LANG || 'en');
  await sleep(600);
  await shot(page, label + '-0-home');
  const boards = ['wheel', 'padma', 'small', 'large'];
  for (let b = 0; b < battles; b++) {
    const board = boards[b % boards.length];
    const tag = label + '-' + (b + 1) + '-' + board;
    await scenario(page, tag, async () => {
    await page.evaluate(({ board, difficulty }) => AC.game.start({ mode: 'ai', board, difficulty }), { board, difficulty: ['veteran', 'archon', 'recruit'][b % 3] });
    await sleep(400); await closeModals(page);
    const lock = await page.$('#action-bar [data-deploy="lock"]');
    if (lock) { await lock.tap(); } else throw new Error('no lock button');
    await sleep(500);
    const vow = await page.$('.vow-card');            // Chapter IV: take the offered vow
    if (vow) { await vow.tap(); await sleep(300); }
    await closeModals(page);
    await playBattle(page, tag);
    });
  }
  await scenario(page, label + '-lesson', async () => {
    await page.evaluate(() => AC.modes.startTutorial());
    await closeModals(page);
    // The six-step square field drill: move, scan, volley, strike, trap, fort.
    const actions = [
      ['move', '5,0', '4,0'], ['scan', '5,2', '3,2'],
      ['barrage', '5,3', '3,3'], ['attack', '4,2', '3,2'],
      ['move', '3,5', '2,5'], ['move', '2,5', '1,5'],
      ['attack', '1,5', '1,4'], ['attack', '1,4', '0,4']
    ];
    for (const [type, from, to] of actions) {
      if (await waitMyTurn(page, 20000) !== 'mine') throw new Error('lesson turn unavailable');
      await audit(page, label + ' lesson');
      await playAction(page, { type, from, to });
    }
    if (await waitMyTurn(page, 20000) !== 'over') throw new Error('lesson did not finish');
    const complete = await page.evaluate(() => AC.game.state.winner === 1 && document.querySelectorAll('#coach .coach-steps i.done').length === 6);
    if (!complete) throw new Error('not all six lesson steps completed');
    results.push({ tag: label + '-lesson', steps: 6 });
    await shot(page, label + '-lesson-end');
    await closeModals(page);
  });
  await scenario(page, label + '-daily', async () => {
    await page.evaluate(() => AC.modes.startDaily());
    await closeModals(page);
    const daily = await page.evaluate(() => ({ key: AC.game.state.daily?.key, board: AC.game.state.boardKey }));
    console.log(label, 'Daily', JSON.stringify(daily));
    await playBattle(page, label + '-daily');
  });
  await page.evaluate(() => AC.ui.openSettings ? AC.ui.openSettings() : null); await sleep(400); await shot(page, label + '-settings'); await closeModals(page);
  await ctx.close();
}
 } catch (e) {
  note('Harness: ' + e.stack);
} finally {
  await browser?.close(); server.close();
  fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify({ seed, viewports: selected, battles, results, problems }, null, 2) + '\n');
}
console.log('Coverage:', selected.map(([label, w, h]) => label + ' ' + w + 'x' + h).join(', '));
console.log(problems.length ? problems.length + ' problems' : 'no problems');
process.exitCode = problems.length ? 1 : 0;
