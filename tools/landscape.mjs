/* Phone-landscape acceptance (Batch 3.3, docs/LANDSCAPE.md).
 * CHROMIUM_PATH=/path/to/chrome node tools/landscape.mjs [outDir]
 * Real Chromium, touch emulation. Checks every field at three landscape sizes
 * and three interface languages, rotation in the middle of a turn, a clash
 * card, the lesson coach, and the one-time portrait hint. Screenshots are
 * evidence, not shipped assets. Ends with "Landscape passed" or throws.
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.argv[2] || '/tmp/vyuha-landscape';
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium',
  headless: 'shell',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--mute-audio']
});
const url = pathToFileURL(path.join(root, 'index.html')).href;
const view = (w, h) => ({ width: w, height: h, deviceScaleFactor: 2, isMobile: true, hasTouch: true, isLandscape: w > h });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
let checks = 0;

async function open(w, h, lang = 'en') {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(w + 'x' + h + ' ' + lang + ': ' + e.message));
  await page.setViewport(view(w, h));
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => { localStorage.clear(); });
  await page.reload({ waitUntil: 'load' });
  await page.waitForSelector('#boot', { hidden: true });
  await page.evaluate((lang) => AC.ui.patchSettings({ pace: 'quick', stories: false, uiLang: lang, narratorLang: 'en' }), lang);
  return page;
}

async function battle(page, board) {
  await page.evaluate((board) => {
    AC.app.modals.slice().forEach((m) => m.close());
    AC.game.start({ mode: 'ai', board, difficulty: 'veteran', timer: 60, rules: { gates: true, hours: true, vyuha: true, astras: true } });
  }, board);
  await wait(300);
  await page.evaluate(() => { const b = document.querySelector('#action-bar [data-deploy="lock"]'); if (b) b.click(); });
  await page.waitForFunction(() => AC.game.state.phase === 'battle' && AC.game.state.owner === 1 && !AC.game.busy, { timeout: 20000 });
  await page.evaluate(() => AC.app.modals.slice().forEach((m) => m.close()));
  await wait(250);
}

async function selectMover(page) {
  await page.evaluate(() => {
    const st = AC.game.state;
    const a = AC.engine.allLegalActions(st, 1).find((x) => x.type === 'move');
    document.querySelector('#board .cell[data-id="' + a.from + '"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await wait(200);
}

/* Layout audit: whole field visible, rails inside the screen, 44 px targets. */
async function audit(page, label) {
  const m = await page.evaluate(() => {
    const vw = innerWidth, vh = innerHeight;
    const rect = (el) => el.getBoundingClientRect();
    const shell = rect(document.querySelector('#board-shell'));
    let cells = [Infinity, Infinity, -Infinity, -Infinity];
    document.querySelectorAll('#board .cell').forEach((c) => {
      const q = rect(c);
      cells = [Math.min(cells[0], q.left), Math.min(cells[1], q.top), Math.max(cells[2], q.right), Math.max(cells[3], q.bottom)];
    });
    const visible = (el) => { const q = rect(el); const cs = getComputedStyle(el); return q.width > 0 && q.height > 0 && cs.visibility !== 'hidden' && !el.closest('[hidden], .intel-panel, .log-panel'); };
    const controls = [...document.querySelectorAll('#screen-game .game-hud button, #action-bar button, #rotate-hint button')].filter(visible);
    const small = controls.filter((b) => { const q = rect(b); return q.width < 43.5 || q.height < 43.5; }).map((b) => (b.id || b.dataset.mode || b.dataset.act || b.dataset.astra || b.className).slice(0, 24));
    const railOut = [...document.querySelectorAll('#screen-game .game-hud, #strip-top, #strip-bottom, #action-bar, #tip-bar')].filter(visible)
      .filter((el) => { const q = rect(el); return q.left < -1 || q.top < -1 || q.right > vw + 1 || q.bottom > vh + 1; }).map((el) => el.id || el.className);
    const bar = rect(document.querySelector('#action-bar'));
    const overlap = bar.left < shell.right - 1;
    return {
      // the rebuilt layer (6 Nov 2026) places the rails beside the field by position, not grid
      landscape: getComputedStyle(document.querySelector('#screen-game .game-hud')).position === 'absolute',
      fieldInside: cells[0] >= shell.left - 1 && cells[1] >= shell.top - 1 && cells[2] <= shell.right + 1 && cells[3] <= shell.bottom + 1 && cells[3] <= vh,
      shell: [Math.round(shell.width), Math.round(shell.height)], small, railOut, overlap,
      overflow: document.documentElement.scrollWidth > vw + 1 || document.documentElement.scrollHeight > vh + 1
    };
  });
  assert.ok(m.landscape, label + ': landscape layout active');
  assert.ok(m.fieldInside, label + ': whole field inside its shell');
  assert.deepEqual(m.small, [], label + ': touch targets under 44 px');
  assert.deepEqual(m.railOut, [], label + ': rail outside the screen');
  assert.ok(!m.overlap, label + ': action rail overlaps the field');
  assert.ok(!m.overflow, label + ': page overflow');
  checks += 6;
  return m;
}

try {
  const sizes = [[640, 360], [844, 390], [896, 414]];
  const boards = ['wheel', 'padma', 'small', 'large'];
  // 1. every field at every size, English, with a piece selected
  for (const [w, h] of sizes) {
    const page = await open(w, h);
    for (const board of boards) {
      await battle(page, board);
      await selectMover(page);
      const m = await audit(page, w + 'x' + h + ' ' + board);
      if (board === 'wheel' || board === 'large') await page.screenshot({ path: path.join(out, `land-${w}x${h}-${board}.png`) });
      console.log(w + 'x' + h, board, 'field shell', m.shell.join('×'));
    }
    await page.close();
  }

  // 1b. Square fields turn sideways (7 Nov 2026): your army on the left, cells larger than portrait,
  //     and turning the phone back restores the upright field and the same cell ids
  {
    const page = await open(844, 390);
    for (const board of ['small', 'large']) {
      await battle(page, board);
      const side = await page.evaluate(() => {
        const mid = (id) => { const q = document.querySelector('#board .cell[data-id="' + id + '"]').getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2, q.width]; };
        const st = AC.game.state, mine = Object.keys(st.board).find((c) => st.board[c] && st.board[c].owner === 1), theirs = Object.keys(st.board).find((c) => st.board[c] && st.board[c].owner === 2);
        let b = [Infinity, Infinity, -Infinity, -Infinity];
        document.querySelectorAll('#board .cell').forEach((c) => { const q = c.getBoundingClientRect(); b = [Math.min(b[0], q.left), Math.min(b[1], q.top), Math.max(b[2], q.right), Math.max(b[3], q.bottom)]; });
        return { mine: mid(mine), theirs: mid(theirs), wide: b[2] - b[0] > b[3] - b[1], field: !!document.querySelector('#board image.pata-field[transform]') || !document.querySelector('#board image.pata-field') };
      });
      assert.ok(side.mine[0] < side.theirs[0], board + ': your army is on the left when sideways');
      assert.ok(side.wide, board + ': the sideways field is wider than tall');
      assert.ok(side.field, board + ': the painting turns with the cells');
      checks += 3;
      if (board === 'small') {
        await page.setViewport(view(360, 640)); await wait(400);
        const up = await page.evaluate(() => {
          const st = AC.game.state, mine = Object.keys(st.board).find((c) => st.board[c] && st.board[c].owner === 1), theirs = Object.keys(st.board).find((c) => st.board[c] && st.board[c].owner === 2);
          const y = (id) => document.querySelector('#board .cell[data-id="' + id + '"]').getBoundingClientRect().top;
          let b = [Infinity, Infinity, -Infinity, -Infinity];
          document.querySelectorAll('#board .cell').forEach((c) => { const q = c.getBoundingClientRect(); b = [Math.min(b[0], q.left), Math.min(b[1], q.top), Math.max(b[2], q.right), Math.max(b[3], q.bottom)]; });
          return { mineBelow: y(mine) > y(theirs), tall: b[3] - b[1] > b[2] - b[0] };
        });
        assert.ok(up.mineBelow && up.tall, 'portrait: the field is upright again, your army at the bottom');
        checks += 1;
        await page.setViewport(view(844, 390)); await wait(400);
      }
    }
    await page.close();
  }

  // 2. Hindi and Marathi wrap inside the rails without shrinking controls
  for (const lang of ['hi', 'mr']) {
    for (const [w, h] of [[640, 360], [844, 390]]) {
      const page = await open(w, h, lang);
      await battle(page, 'wheel');
      await selectMover(page);
      await audit(page, w + 'x' + h + ' ' + lang);
      await page.screenshot({ path: path.join(out, `land-${w}x${h}-${lang}.png`) });
      await page.close();
    }
  }

  // 3. Turning the phone mid-turn keeps the selection, clock, turn and actions
  {
    const page = await open(390, 844);
    await battle(page, 'wheel');
    await selectMover(page);
    const before = await page.evaluate(() => ({ sel: AC.game.sel, mode: AC.game.mode, turn: AC.game.state.turn, owner: AC.game.state.owner, actions: AC.game.state.stats.actions, clock: AC.game.timeLeft, voice: AC.sanjaya.idle ? 1 : 0 }));
    let rendersDuring = 0;
    await page.evaluate(() => { window.__renders = 0; const r = AC.game.render; AC.game.__r = r; });
    await page.setViewport(view(844, 390)); await wait(400);
    await audit(page, 'rotated to landscape');
    const after = await page.evaluate(() => ({ sel: AC.game.sel, mode: AC.game.mode, turn: AC.game.state.turn, owner: AC.game.state.owner, actions: AC.game.state.stats.actions, clock: AC.game.timeLeft, selected: !!document.querySelector('#board .cell.selected') }));
    assert.equal(after.sel, before.sel, 'rotation keeps the selected piece');
    assert.equal(after.mode, before.mode, 'rotation keeps the order mode');
    assert.equal(after.actions, before.actions, 'rotation spends no action');
    assert.equal(after.turn, before.turn, 'rotation keeps the round');
    assert.ok(after.clock <= before.clock && after.clock >= before.clock - 2, 'rotation keeps the running clock');
    assert.ok(after.selected, 'selection still drawn after rotation');
    await page.setViewport(view(360, 640)); await wait(400);
    const back = await page.evaluate(() => ({ grid: getComputedStyle(document.querySelector('#screen-game .game-hud')).position === 'absolute' ? 'grid' : 'stack', sel: AC.game.sel, actions: AC.game.state.stats.actions }));
    assert.notEqual(back.grid, 'grid', 'portrait returns to the stacked layout');
    assert.equal(back.sel, before.sel, 'rotating back keeps the selection');
    assert.equal(back.actions, before.actions, 'rotating back spends no action');
    checks += 9;
    void rendersDuring;
    await page.close();
  }

  // 4. A clash card in landscape fits on screen and stays skippable
  {
    const page = await open(844, 390);
    await battle(page, 'small');
    await page.evaluate(() => {
      const st = AC.game.state;
      const a = AC.engine.allLegalActions(st, 1).find((x) => x.type === 'move' && !st.board[x.to]);
      st.board[a.to] = AC.engine.createArmy(2).find((u) => u.key === '3');
      AC.game.render();
      AC.game.perform(a);
    });
    await page.waitForSelector('.stage', { timeout: 4000 });
    await wait(300);
    const card = await page.evaluate(() => { const q = document.querySelector('.stage-card').getBoundingClientRect(); return { top: q.top, bottom: q.bottom, left: q.left, right: q.right }; });
    assert.ok(card.top >= 0 && card.bottom <= 390 && card.left >= 0 && card.right <= 844, 'clash card fits the landscape screen');
    await page.screenshot({ path: path.join(out, 'land-844x390-clash.png') });
    checks += 1;
    await page.close();
  }

  // 5. The lesson coach takes the top of the action rail
  {
    const page = await open(844, 390);
    await page.evaluate(() => AC.modes.startTutorial());
    await wait(900);
    await page.evaluate(() => AC.app.modals.slice().forEach((m) => m.close()));
    const c = await page.evaluate(() => {
      const coach = document.querySelector('#coach'), bar = document.querySelector('#action-bar'), shell = document.querySelector('#board-shell');
      const q = coach.getBoundingClientRect(), b = bar.getBoundingClientRect(), s = shell.getBoundingClientRect();
      return { shown: !coach.hidden, inRail: q.left >= s.right, above: q.bottom <= b.top + 1, onScreen: q.bottom <= innerHeight };
    });
    if (c.shown) {
      assert.ok(c.inRail && c.above && c.onScreen, 'lesson coach sits above the orders in the rail');
      checks += 1;
    }
    await page.screenshot({ path: path.join(out, 'land-844x390-lesson.png') });
    await page.close();
  }

  // 6. The one-time hint: portrait touch battle only, retired by rotating
  {
    const page = await open(390, 844);
    await battle(page, 'wheel');
    const shown = await page.evaluate(() => !document.querySelector('#rotate-hint').hidden);
    assert.ok(shown, 'portrait battle offers the landscape hint once');
    await page.setViewport(view(844, 390)); await wait(400);
    await page.setViewport(view(390, 844)); await wait(300);
    await page.evaluate(() => AC.game.render());
    const after = await page.evaluate(() => ({ hidden: document.querySelector('#rotate-hint').hidden, saved: AC.storage.getSettings().landscapeHintDismissed }));
    assert.ok(after.hidden && after.saved, 'turning the phone retires the hint for good');
    checks += 2;
    await page.close();
  }

  assert.equal(errors.length, 0, errors.join('\n'));
  console.log('Landscape passed: ' + checks + ' checks, no runtime errors.');
} finally {
  await browser.close();
}
