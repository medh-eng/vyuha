/* Google Play pictures: the 1024×500 feature graphic and phone screenshots.
 * CHROMIUM_PATH=/path/to/chrome node tools/store-assets.mjs [outDir=store]
 * Screenshots are 1688×860 (sideways, the phone layout) and 860×1688 (upright),
 * inside Play's 320–3840 px and 2:1 limits. They are real screens of the current build.
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.resolve(root, process.argv[2] || 'store');
fs.mkdirSync(out, { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium',
  headless: 'shell',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--mute-audio']
});
const errors = [];

try {
  // feature graphic: the two camps facing each other, the name in the open ground
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 500, deviceScaleFactor: 1 });
    const art = pathToFileURL(path.join(root, 'assets/art/pata/scenes/card-duel.webp')).href;
    const fonts = pathToFileURL(path.join(root, 'css/fonts.css')).href;
    const tmp = path.join(root, 'store', '.feature.html');
    fs.mkdirSync(path.dirname(tmp), { recursive: true });
    fs.writeFileSync(tmp, `<!doctype html><html><head><link rel="stylesheet" href="${fonts}"><style>
      html,body{margin:0;width:1024px;height:500px;overflow:hidden}
      .bg{position:absolute;inset:0;background:url('${art}') center 62%/cover}
      .t{position:absolute;left:50%;top:96px;transform:translateX(-50%);width:520px;padding:22px 0 26px;text-align:center;color:#2a1d12;background:radial-gradient(closest-side,rgba(246,234,208,.97) 62%,rgba(246,234,208,0));border-radius:50%}
      .t b{display:block;font:400 104px/1 'Rozha One',serif;letter-spacing:.08em;text-shadow:0 2px 0 #f6ead0,0 0 26px #f6ead0,0 0 40px #f6ead0}
      .t i{display:block;margin-top:6px;font:400 48px/1.1 'Tiro Devanagari Hindi',serif;font-style:normal;color:#a8321f;text-shadow:0 0 18px #f6ead0,0 0 30px #f6ead0}
      .t span{display:inline-block;margin-top:16px;padding:7px 18px;border-radius:999px;background:rgba(42,29,18,.86);color:#f6ead0;font:600 22px/1.2 Inter,sans-serif;letter-spacing:.04em}
    </style></head><body><div class="bg"></div><div class="t"><b>VYUHA</b><i>व्यूह</i><span>Break the formation. Take the fort.</span></div></body></html>`);
    await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await wait(300);
    await page.screenshot({ path: path.join(out, 'feature-graphic-1024x500.png') });
    await page.close();
    fs.rmSync(tmp);
  }

  for (const [tag, width, height] of [['landscape', 844, 430], ['portrait', 430, 844]]) {
    const page = await browser.newPage();
    page.on('pageerror', e => errors.push(tag + ': ' + e.message));
    // show the screens as the Android app draws them (no browser full-screen button)
    await page.evaluateOnNewDocument(() => { window.Capacitor = { isNativePlatform: () => true, Plugins: {} }; });
    await page.setViewport({ width, height, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto(pathToFileURL(path.join(root, 'index.html')).href, { waitUntil: 'load' });
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.reload({ waitUntil: 'load' });
    await page.waitForSelector('#screen-home:not([hidden])');
    await page.waitForSelector('#boot', { hidden: true });
    await wait(600);
    const shot = (n) => page.screenshot({ path: path.join(out, tag + '-' + n + '.png') });
    await shot('1-home');

    await page.evaluate(() => AC.modes.startWheelLesson(2));
    await page.waitForFunction(() => AC.game.state && AC.game.state.phase === 'battle');
    await wait(3400);
    await shot('2-lesson');
    await page.evaluate(() => AC.app.modals.slice().forEach(m => m.close()));

    // a real battle, a few rounds in, with a piece chosen
    await page.evaluate(() => AC.ui.show('home'));
    await page.evaluate(() => document.getElementById('btn-new-match').click());
    await page.waitForSelector('.modal-actions [data-act="1"]', { timeout: 5000 });
    await page.tap('.modal-actions [data-act="1"]');
    await page.waitForSelector('#screen-setup:not([hidden])');
    await page.evaluate(() => document.getElementById('btn-start-match').click());
    await page.waitForFunction(() => AC.game.state && AC.game.state.phase === 'deploy1');
    await page.evaluate(() => AC.app.modals.slice().forEach(m => m.close()));
    await wait(2600);
    await shot('3-deploy');
    await page.evaluate(() => document.querySelector('#action-bar [data-deploy="lock"]').click());
    await page.waitForFunction(() => AC.game.state.phase === 'battle');
    await wait(3400);
    await page.evaluate(() => AC.app.modals.slice().forEach(m => m.close()));
    await page.evaluate(() => { const c = document.querySelector('.board [data-cell] .unit.mine, .board .unit.mine'); if (c) c.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    await wait(900);
    await shot('4-battle');
    await page.evaluate(() => AC.ui.openCodex());
    await wait(500);
    await shot('5-rules');
    await page.close();
  }
} finally { await browser.close(); }
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
console.log('store pictures in ' + path.relative(root, out) + '/');
