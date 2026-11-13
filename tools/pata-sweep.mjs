/* Pata look sweep (T-09): screenshots of every screen that is not the board, so dark leftovers
 * from the Classic look can be found. Evidence only.
 *   CHROMIUM_PATH=… node tools/pata-sweep.mjs [outDir] [skin]
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.argv[2] || '/tmp/vyuha-pata-sweep';
const skin = process.argv[3] || '';
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium', headless: 'shell',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--mute-audio'] });
const url = pathToFileURL(path.join(root, 'index.html')).href + (skin ? '?skin=' + skin : '');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
const sizes = [['p', 390, 844], ['l', 914, 411]];
for (const [tag, w, h] of sizes) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(tag + ': ' + e.message));
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: true, hasTouch: true, isLandscape: w > h });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForSelector('#boot', { hidden: true });
  await page.evaluate(() => AC.ui.patchSettings({ pace: 'quick', narrator: false, stories: true }));
  const snap = async (name) => { await wait(700); await page.screenshot({ path: path.join(out, tag + '-' + name + '.png') }); };
  const close = () => page.evaluate(() => AC.app.modals.slice().forEach((m) => m.close()));
  await snap('home');
  await page.evaluate(() => AC.ui.go ? AC.ui.go('setup') : AC.ui.renderSetup && (AC.app.screen = 'setup', AC.ui.showScreen ? AC.ui.showScreen('setup') : null));
  await page.evaluate(() => { const b = document.querySelector('#btn-new-match'); if (b) b.click(); });
  await snap('setup');
  for (const sc of ['duel', 'abhimanyu']) {
    await page.evaluate((sc) => { AC.game.start({ mode: 'ai', board: 'wheel', difficulty: 'veteran', scenario: sc }); }, sc);
    await snap('story-' + sc);
    await close();
  }
  await page.evaluate(() => AC.modes.startDaily());
  await snap('daily');
  await close();
  await page.evaluate(() => AC.game.start({ mode: 'pass', board: 'small', difficulty: 'veteran' }));
  await wait(400); await close();
  await page.evaluate(() => { const b = document.querySelector('#action-bar [data-deploy="lock"]'); if (b) b.click(); });
  await snap('pass-curtain');
  await close();
  await page.evaluate(() => {
    AC.game.start({ mode: 'ai', board: 'wheel', difficulty: 'veteran' });
  });
  await wait(400); await close();
  await page.evaluate(() => { const b = document.querySelector('#action-bar [data-deploy="lock"]'); if (b) b.click(); });
  await wait(600); await close();
  await page.evaluate(() => { const st = AC.game.state; AC.engine.endGame(st, 1, 'Test win.', []); AC.game.render(); if (AC.game.handleGameOver) AC.game.handleGameOver(); });
  await snap('result');
  await close();
  await page.evaluate(() => AC.ui.openProfile());
  await snap('profile');
  await close();
  await page.evaluate(() => AC.ui.openSettings());
  await snap('settings');
  await page.close();
}
await browser.close();
console.log('swept', errors.length ? errors : 'no errors', out);
