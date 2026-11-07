/* Battle log harness (review plan step 4, 7 Nov 2026). Real Chromium, touch emulation.
 * Plays a few AI-vs-AI plies on each field at phone sizes, opens the log and checks: every
 * action names its side and cells; your own moves name the piece; a hidden enemy move never
 * names its piece; tapping an entry marks its cells and the mark clears. Saves screenshots.
 *   CHROMIUM_PATH=/path/to/chrome node tools/battle-log.mjs [outDir]
 * Ends with "Battle log passed" or throws.
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.argv[2] || '/tmp/vyuha-battle-log';
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium',
  headless: 'shell',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--mute-audio']
});
const url = pathToFileURL(path.join(root, 'index.html')).href;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
let checks = 0;
const hiddenSeen = {};   // a quick battle can end before an enemy moves unseen, so count per screen size
const ok = (cond, msg) => { assert.ok(cond, msg); checks++; };

async function run(w, h, board) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(w + 'x' + h + ' ' + board + ': ' + e.message));
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: true, hasTouch: true, isLandscape: w > h });
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.waitForSelector('#boot', { hidden: true });
  await page.evaluate(() => AC.ui.patchSettings({ pace: 'quick', stories: false, narrator: false, uiLang: 'en' }));
  await page.evaluate((board) => {
    AC.app.modals.slice().forEach((m) => m.close());
    AC.game.start({ mode: 'ai', board, difficulty: 'veteran', timer: 0, rules: { gates: true, hours: true, vyuha: true, astras: true } });
  }, board);
  await wait(300);
  await page.evaluate(() => { const b = document.querySelector('#action-bar [data-deploy="lock"]'); if (b) b.click(); });
  await page.waitForFunction(() => AC.game.state.phase === 'battle' && AC.game.state.owner === 1 && !AC.game.busy, { timeout: 20000 });
  await page.evaluate(() => AC.app.modals.slice().forEach((m) => m.close()));
  // a short battle played straight through the engine, then drawn once
  await page.evaluate(() => {
    const st = AC.game.state;
    // play until the shown entries hold your own moves and a hidden enemy move (≥ 24 plies)
    const enough = () => { const l = st.log.slice(-60); return l.some((x) => x.kind === 'move' && x.who === 1) && l.some((x) => x.kind === 'move' && x.who === 2 && !x.seen); };
    for (let i = 0; (i < 24 || !enough()) && i < 120 && st.phase === 'battle'; i++) {
      const a = AC.ai.chooseAction(st, st.owner, 'veteran');
      if (!a || !AC.engine.applyAction(st, a).ok) break;
    }
    st.viewer = 1;
    AC.game.render();
  });
  await page.tap('#btn-hud-log');
  await wait(400);
  const r = await page.evaluate(() => {
    const st = AC.game.state;
    const shown = st.log.slice(-60).reverse();
    const els = [...document.querySelectorAll('#battle-log .log-entry')];
    const rows = shown.map((l, i) => {
      const el = els[i];
      const u = l.piece ? AC.units.UNIT_DEFS[l.piece] : null;
      return { kind: l.kind, who: l.who, seen: l.seen, from: l.from, at: l.at, name: u ? u.name : null,
        text: el ? el.textContent : '', cls: el ? el.className : '', cells: el ? el.getAttribute('data-cells') : null,
        fromName: l.from ? AC.game.cellText(l.from) : '', atName: l.at ? AC.game.cellText(l.at) : '' };
    });
    const panel = document.querySelector('#log-panel').getBoundingClientRect();
    return { rows, count: els.length, open: document.querySelector('#log-panel').classList.contains('open'), panelW: panel.width };
  });
  ok(r.open && r.count === r.rows.length && r.count > 10, board + ' ' + w + 'x' + h + ': the log opens with every entry (' + r.count + ')');
  let own = 0, hidden = 0;
  for (const row of r.rows) {
    if (['move', 'clash', 'barrage', 'scan'].includes(row.kind)) {
      ok(row.text.includes(row.who === 1 ? 'You' : 'Enemy'), board + ': ' + row.kind + ' says whose it was: ' + row.text);
      ok(row.text.includes(row.atName) && (row.from === row.at || row.text.includes(row.fromName)), board + ': ' + row.kind + ' names its cells: ' + row.text);
      ok(row.cells && row.cells.includes(row.at), board + ': ' + row.kind + ' entry can be tapped to show its cells');
    }
    if (row.kind === 'move' && row.who === 1) { ok(row.text.includes(row.name), board + ': your move names your piece: ' + row.text); own++; }
    if (row.kind === 'move' && row.who === 2 && !row.seen) {
      ok(row.text.includes('hidden piece') && !row.text.includes(row.name), board + ': a hidden enemy move keeps its piece hidden: ' + row.text);
      hidden++;
    }
  }
  ok(own > 0, board + ': at least one of your own moves was checked (' + own + ')');
  hiddenSeen[w + 'x' + h] = (hiddenSeen[w + 'x' + h] || 0) + hidden;
  const tag = board + '-' + w + 'x' + h;
  await page.screenshot({ path: path.join(out, tag + '-log.png') });
  // tap the newest entry with cells: its cells are marked, then cleared
  const want = await page.evaluate(() => {
    const el = document.querySelector('#battle-log [data-cells]');
    el.scrollIntoView({ block: 'center' });
    const q = el.getBoundingClientRect();
    return { cells: el.getAttribute('data-cells').split(' '), x: q.left + q.width / 2, y: q.top + q.height / 2 };
  });
  await page.touchscreen.tap(want.x, want.y);
  await wait(250);
  const marked = await page.evaluate(() => [...document.querySelectorAll('#board .cell.log-mark')].map((c) => c.getAttribute('data-id')));
  ok(want.cells.every((c) => marked.includes(c)) && marked.length === new Set(want.cells).size, tag + ': tapping an entry marks its cells ' + want.cells.join(' '));
  const drawer = await page.evaluate(() => document.querySelector('#log-panel').classList.contains('open'));
  ok(innerWidthOk(w) ? !drawer : true, tag + ': the drawer steps aside so the marked cells show');
  await page.screenshot({ path: path.join(out, tag + '-mark.png') });
  const anim = await page.evaluate(() => {
    const c = document.querySelector('#board .cell.log-mark .cell-fill');
    return c ? getComputedStyle(c).animationName : 'none';
  });
  ok(anim === 'none', tag + ': the mark does not animate (heat rule)');
  await wait(2600);
  ok(await page.evaluate(() => !document.querySelector('#board .cell.log-mark')), tag + ': the mark clears by itself');
  await page.close();
}
function innerWidthOk(w) { return w <= 1080; }

for (const [w, h] of [[914, 411], [830, 318], [390, 844]]) {
  for (const board of ['small', 'wheel', 'padma', 'large']) await run(w, h, board);
  ok(hiddenSeen[w + 'x' + h] > 0, w + 'x' + h + ': hidden enemy moves were checked (' + hiddenSeen[w + 'x' + h] + ')');
}
await browser.close();
assert.deepEqual(errors, [], 'no page errors');
console.log('Battle log passed: ' + checks + ' checks; screenshots in ' + out);
