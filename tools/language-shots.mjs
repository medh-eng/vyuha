/* Real touch, persisted preferences, layout and portable offline checks.
 * CHROMIUM_PATH=/path/to/chrome node tools/language-shots.mjs [output-dir]
 */
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.argv[2] || '/tmp/vyuha-language-shots';
fs.mkdirSync(out, { recursive: true });
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg' }[path.extname(p)];
  res.writeHead(200, { 'content-type': type || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
}).listen(0);
let browser;
const errors = [], results = [];
const wait = ms => new Promise(r => setTimeout(r, ms));
try {
  browser = await puppeteer.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium', headless: 'shell', args: ['--no-sandbox', '--disable-dev-shm-usage', '--mute-audio', '--allow-file-access-from-files'] });
  for (const lang of ['hi', 'mr']) for (const [width, height] of [[390, 844], [360, 640]]) {
    const page = await browser.newPage();
    page.on('pageerror', e => errors.push(lang + ': ' + e.message));
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await page.setBypassServiceWorker(true);
    await page.goto('http://127.0.0.1:' + server.address().port);
    await page.waitForSelector('#boot', { hidden: true });
    await page.evaluate(() => { AC.ui.patchSettings({ narratorLang: 'en', narrator: false, musicOn: false, stories: false }); AC.ui.openSettings(); });
    await wait(300); // aim after the existing modal entrance has settled
    await page.tap('[data-seg="uiLang"] [data-segval="' + lang + '"]');
    await page.waitForFunction(lang => document.documentElement.lang === lang, { timeout: 5000 }, lang);
    assert.equal(await page.evaluate(() => AC.app.settings.narratorLang), 'en');
    await page.evaluate(() => AC.app.modals.slice().forEach(m => m.close())); await wait(300);
    await page.screenshot({ path: path.join(out, lang + '-' + width + '-home.png'), fullPage: true });
    await page.evaluate(() => AC.ui.openCodex('units')); await wait(300);
    await page.screenshot({ path: path.join(out, lang + '-' + width + '-units.png') });
    await page.evaluate(() => AC.app.modals.slice().forEach(m => m.close()));
    await page.evaluate(() => AC.modes.startTutorial()); await wait(1700);
    await page.screenshot({ path: path.join(out, lang + '-' + width + '-lesson.png'), fullPage: true });
    const action = await page.evaluate(() => {
      AC.game.clearOverlays(); AC.modes.clear();
      const st = AC.engine.newState({ mode: 'ai', board: 'wheel', difficulty: 'recruit', timer: 0 });
      AC.engine.beginBattle(st); AC.game.startPrepared(st, { save: false });
      return AC.engine.allLegalActions(st, 1).find(a => a.type === 'move' && !st.board[a.to]);
    });
    await wait(250);
    for (const id of [action.from, action.to]) {
      const el = await page.$('#board .cell[data-id="' + id + '"]'), box = await el.boundingBox();
      assert.ok(box, 'visible cell ' + id);
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); await wait(100);
    }
    await page.waitForFunction(() => !AC.game.busy && !AC.game.thinking && AC.game.state.owner === 1 && AC.game.state.stats.actions >= 2, { timeout: 30000 });
    await wait(1700);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, lang + ': no sideways overflow');
    await page.screenshot({ path: path.join(out, lang + '-' + width + '-battle.png'), fullPage: true });
    await page.evaluate(() => AC.game.resign());
    const title = await page.$eval('.result-title', el => el.textContent);
    const dict = JSON.parse(fs.readFileSync(path.join(root, 'incoming/i18n/strings.' + lang + '.json')));
    assert.equal(title, dict['result.defeat']);
    await page.reload(); await page.waitForSelector('#boot', { hidden: true });
    assert.equal(await page.evaluate(() => AC.app.settings.uiLang), lang);
    results.push({ lang, width, height, realTouchOrder: true, aiReplied: true, noOverflow: true, translatedResult: title, persists: true });
    await page.close(); console.log(lang + ' ' + width + ': passed');
  }
  const offline = await browser.newPage(); offline.on('pageerror', e => errors.push('standalone: ' + e.message));
  await offline.setOfflineMode(true); await offline.goto(pathToFileURL(path.join(root, 'vyuha-standalone.html')).href);
  await offline.waitForSelector('#boot', { hidden: true });
  const portable = await offline.evaluate(() => { AC.ui.patchSettings({ uiLang: 'mr' }); return { lang: document.documentElement.lang, button: document.querySelector('#ci-quick').textContent.trim(), expected: AC.i18n.text('home.quick') }; });
  assert.equal(portable.lang, 'mr'); assert.equal(portable.button, portable.expected); assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ results, standaloneOffline: true, errors, physicalPhone: false }, null, 2) + '\n');
  console.log('Hindi/Marathi touch, reload, result, layout and offline standalone checks passed.');
} finally { if (browser) await browser.close(); server.close(); }
