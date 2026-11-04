/* Rang Phase 0 — the 32 px legibility sheet (docs/LOOK.md, Gate 2).
 * CHROMIUM_PATH=/path/to/chrome node tools/legibility.mjs [outDir] [skin]
 * Draws every piece of both armies, and the hidden sketch, on its token disc at
 * 32 px (the size a phone shows) and at 64 px, in day and night, for a skin
 * (default pata). Writes legibility-<skin>.png. Show the 32 px rows to five
 * people: each should name 8 of the 10 pieces. Screenshots are test evidence,
 * not shipped assets.
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const out = process.argv[2] || '/tmp/vyuha-legibility';
const skin = process.argv[3] || 'pata';
fs.mkdirSync(out, { recursive: true });
const root = fileURLToPath(new URL('../', import.meta.url));

const browser = await puppeteer.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium',
  headless: 'shell',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--force-device-scale-factor=1']
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 600, deviceScaleFactor: 1 });
  const html = '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="' +
    pathToFileURL(path.join(root, 'css/app.css')).href + '"><style>' +
    'body{margin:0;padding:16px;font:13px Inter,sans-serif;overflow:visible;height:auto}' +
    '.row{display:flex;align-items:center;gap:10px;margin:6px 0}.lab{width:150px}' +
    '.night{background:#1f2a5c;color:#f7f1e3;padding:6px 16px;margin:0 -16px}' +
    'svg.tok{overflow:visible}.names{display:flex;gap:10px;margin-left:160px}.names span{width:64px;text-align:center;font-size:11px}' +
    '</style></head><body><div id="sheet"></div>' +
    '<script>window.AC={};</script><script src="' + pathToFileURL(path.join(root, 'js/art.js')).href + '"></script></body></html>';
  const tmp = path.join(out, '_sheet.html');
  fs.writeFileSync(tmp, html);
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
  await page.evaluate(function (skinName) {
    const A = AC.art;
    A.setSkin(skinName);
    const keys = ['10', '9', '7', '6', '5', '3', '2', '1', 'B', 'F', '?'];
    const names = ['Senapati', 'Maharathi', 'Ashvarohi', 'Dhanurdhar', 'Divyadrishti', 'Yantrik', 'Rath', 'Chara', 'Shataghni', 'Durg', 'hidden'];
    function tok(key, cls, px) {
      const R = 1;
      const hidden = key === '?';
      return '<svg class="tok" width="' + px + '" height="' + px + '" viewBox="-1.1 -1.1 2.2 2.2"><g class="token ' + cls + (hidden ? ' hidden-unit' : '') + '">' +
        '<circle class="tok-disc" r="' + R + '"/>' + A.figureInner(key, R) + '</g></svg>';
    }
    function row(label, cls, px, night) {
      return '<div class="row' + (night ? ' night' : '') + '"><span class="lab">' + label + '</span>' +
        keys.map(function (k) { return '<span style="width:' + Math.max(px, 64) + 'px;display:inline-grid;place-items:center">' + tok(k, cls, px) + '</span>'; }).join('') + '</div>';
    }
    document.getElementById('sheet').innerHTML =
      '<h3 style="margin:0 0 8px">Legibility sheet · skin: ' + skinName + '</h3>' +
      '<div class="names">' + names.map(function (n) { return '<span>' + n + '</span>'; }).join('') + '</div>' +
      row('Surya · 32 px', 'solar', 32) + row('Chandra · 32 px', 'void', 32) +
      row('Surya · 64 px', 'solar', 64) + row('Chandra · 64 px', 'void', 64) +
      row('Surya · 32 px night', 'solar', 32, true) + row('Chandra · 32 px night', 'void', 32, true);
  }, skin);
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const file = path.join(out, 'legibility-' + skin + '.png');
  await page.screenshot({ path: file, fullPage: true });
  fs.unlinkSync(tmp);
  console.log('Legibility sheet written: ' + file);
} finally {
  await browser.close();
}
