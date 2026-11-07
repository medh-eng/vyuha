/* First-session clarity harness (7 Nov 2026).
 * CHROMIUM_PATH=/path/to/chrome node tools/first-session.mjs [outDir]
 * Plays the four wheel lessons at the Commander's phone sizes (914×411 full
 * screen, 830×318 with the address bar) in Calm pace, and checks that every
 * Confirm strike / Invoke button is on screen without scrolling. Screenshots
 * are evidence, not shipped assets. Ends with "First session passed" or throws.
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.argv[2] || '/tmp/vyuha-first-session';
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium', headless: 'shell',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--mute-audio']
});
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
let checks = 0;
try {
  for (const [W, H] of [[914, 411], [830, 318]]) {
    const tag = W + 'x' + H;
    const page = await browser.newPage();
    page.on('pageerror', (e) => errors.push(tag + ': ' + e.message));
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 2, isMobile: true, hasTouch: true, isLandscape: true });
    await page.goto(pathToFileURL(path.join(root, 'index.html')).href, { waitUntil: 'load' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'load' });
    await page.waitForSelector('#boot', { hidden: true });
    await page.evaluate(() => AC.ui.patchSettings({ pace: 'calm', stories: false, narrator: false }));
    const tap = (id) => page.evaluate((id) => document.querySelector('#board .cell[data-id="' + id + '"]').dispatchEvent(new MouseEvent('click', { bubbles: true })), id);
    const idle = () => page.waitForFunction(() => !AC.game.busy && !document.querySelector('.stage'), { timeout: 30000 });
    const shot = (n) => page.screenshot({ path: path.join(out, tag + '-' + n + '.png') });
    const clickModal = (re) => page.evaluate((re) => { const b = [...document.querySelectorAll('.modal button')].find((x) => new RegExp(re).test(x.textContent)); if (b) b.click(); return !!b; }, re);
    const confirmVisible = async (label) => {
      const r = await page.evaluate(() => {
        const b = document.querySelector('#action-bar [data-act="confirm"]'); if (!b) return null;
        const q = b.getBoundingClientRect(), bar = document.querySelector('#action-bar').getBoundingClientRect();
        return { inBar: q.top >= bar.top - 1 && q.bottom <= bar.bottom + 1, onScreen: q.bottom <= innerHeight, tall: q.height >= 43.5 };
      });
      assert.ok(r, tag + ' ' + label + ': Confirm is shown');
      assert.ok(r.inBar && r.onScreen && r.tall, tag + ' ' + label + ': Confirm visible without scrolling, 44 px tall ' + JSON.stringify(r));
      checks += 2;
    };
    const press = async () => { await page.evaluate(() => document.querySelector('#action-bar [data-act="confirm"]').click()); await idle(); await wait(1200); };

    // first Quick battle offers the lessons, once
    await page.evaluate(() => document.getElementById('btn-quick').click()); await wait(400);
    assert.ok(await clickModal('Start the lessons'), tag + ': first Quick battle offers the lessons'); checks++;
    await wait(1800);
    // 1 · first move and strike
    await tap('r3s0'); await wait(150); await tap('r2s0'); await idle(); await wait(500);
    await tap('r2s0'); await wait(150); await tap('r1s0'); await wait(250);
    assert.match(await page.evaluate(() => document.querySelector('#action-bar').innerText), /Certain win/); checks++;
    await confirmVisible('lesson 1'); await shot('1-confirm'); await press();
    assert.ok(await clickModal('Next lesson'), tag + ': lesson 1 complete'); checks++; await wait(1800);
    // 2 · the wheel turns
    await tap('r2s11'); await wait(150); await tap('r2s1'); await wait(250); await shot('2-marked');
    await tap('r3s11'); await wait(150); await tap('r3s10'); await idle(); await wait(1200);
    assert.equal(await page.evaluate(() => AC.engine.findUnit(AC.game.state, (u) => u.owner === 1 && u.key === '2')), 'r2s1'); checks++;
    assert.ok(await clickModal('Next lesson'), tag + ': lesson 2 complete'); checks++; await wait(1800);
    // 3 · the hidden warrior
    await tap('r2s0'); await wait(150); await tap('r1s0'); await wait(250);
    assert.match(await page.evaluate(() => document.querySelector('#action-bar').innerText), /Likely win[\s\S]*can’t see yet[\s\S]*75%/); checks++;
    await confirmVisible('lesson 3'); await shot('3-confirm'); await press();
    assert.ok(await clickModal('Next lesson'), tag + ': lesson 3 complete'); checks++; await wait(1800);
    // 4 · one astra
    await page.evaluate(() => document.querySelector('#action-bar [data-astra="agneya"]').click()); await wait(200);
    await tap('r1s0'); await wait(250);
    await confirmVisible('lesson 4'); await shot('4-invoke'); await press();
    const end = await page.evaluate(() => document.querySelector('.modal').innerText);
    assert.match(end, /Daily Chakravyuha/); assert.match(end, /Quick battle/); checks += 2;
    await shot('5-end');
    assert.deepEqual(await page.evaluate(() => AC.app.settings.wheelLessons), ['first', 'wheel', 'hidden', 'astra']); checks++;
    console.log(tag, 'four lessons played');
    await page.close();
  }
} finally {
  await browser.close();
}
assert.deepEqual(errors, [], 'runtime errors');
console.log('First session passed: ' + checks + ' checks, no runtime errors.');
