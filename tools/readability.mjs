/* Readability probe — big words, big buttons.
 * CHROMIUM_PATH=/path/to/chrome node tools/readability.mjs [outDir] [--report]
 * Walks Home, the lesson offer, Setup, deployment, a battle and a wheel lesson at
 * a portrait phone (390×844) and the Commander's landscape phone (914×411), and
 * fails if any visible words are smaller than MIN_TEXT px or any button is
 * smaller than MIN_TAP px on its short side. Words drawn inside the board SVG
 * are scaled with the field and are skipped; so are purely decorative marks.
 * --report lists everything found and never fails. Screenshots are evidence.
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const reportOnly = args.includes('--report');
const out = args.find(a => !a.startsWith('--')) || '/tmp/vyuha-readability';
fs.mkdirSync(out, { recursive: true });
const root = fileURLToPath(new URL('../', import.meta.url));
const MIN_TEXT = 12;
const MIN_TAP = 40;

const browser = await puppeteer.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium',
  headless: 'shell',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--mute-audio', '--force-device-scale-factor=1']
});
const wait = ms => new Promise(r => setTimeout(r, ms));
const problems = [];
const errors = [];

function probe(minText, minTap) {
  const seen = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
    }
    return true;
  };
  const name = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    const c = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.') : '';
    if (c) s += '.' + c;
    return s;
  };
  const where = (el) => (el.parentElement ? name(el.parentElement) + ' > ' : '') + name(el);
  const small = {};
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    const t = n.nodeValue.trim();
    if (t.length < 2) continue;
    const el = n.parentElement;
    if (!el || el.closest('svg, [aria-hidden="true"], #boot')) continue;
    if (!seen(el)) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < minText - 0.01) { const k = where(el); if (!small[k]) small[k] = { px: fs, text: t.slice(0, 40) }; }
  }
  const tiny = {};
  document.querySelectorAll('button, [role="button"], a[href], select, input').forEach((el) => {
    if (el.closest('svg') || el.disabled || !seen(el)) return;
    const r = el.getBoundingClientRect();
    if (Math.min(r.width, r.height) < minTap - 0.5) {
      const k = where(el);
      if (!tiny[k]) tiny[k] = { w: Math.round(r.width), h: Math.round(r.height), text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30) };
    }
  });
  return { small, tiny };
}

async function check(page, tag, screen) {
  await wait(350);
  await page.screenshot({ path: path.join(out, tag + '-' + screen + '.png') });
  const r = await page.evaluate(probe, MIN_TEXT, MIN_TAP);
  for (const [k, v] of Object.entries(r.small)) problems.push(tag + ' ' + screen + ': words ' + v.px + 'px  ' + k + '  “' + v.text + '”');
  for (const [k, v] of Object.entries(r.tiny)) problems.push(tag + ' ' + screen + ': button ' + v.w + '×' + v.h + '  ' + k + '  “' + v.text + '”');
}

try {
  for (const [tag, width, height] of [['portrait', 390, 844], ['landscape', 914, 411]]) {
    const page = await browser.newPage();
    page.on('pageerror', e => errors.push(tag + ': ' + e.message));
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await page.goto(pathToFileURL(path.join(root, 'index.html')).href, { waitUntil: 'load' });
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.reload({ waitUntil: 'load' });
    await page.waitForSelector('#screen-home:not([hidden])');
    await page.waitForSelector('#boot', { hidden: true });
    await check(page, tag, 'home');

    await page.tap('#btn-new-match');
    await page.waitForSelector('.modal-actions [data-act="1"]', { timeout: 5000 });
    await check(page, tag, 'lesson-offer');
    await page.tap('.modal-actions [data-act="1"]');
    await page.waitForSelector('#screen-setup:not([hidden])');
    await check(page, tag, 'setup');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.evaluate(() => { const s = document.querySelector('#screen-setup .screen-scroll, #screen-setup'); if (s) s.scrollTop = s.scrollHeight; });
    await check(page, tag, 'setup-end');

    await page.evaluate(() => document.getElementById('btn-start-match').click());
    await page.waitForFunction(() => AC.game.state && AC.game.state.phase === 'deploy1');
    await page.evaluate(() => AC.app.modals.slice().forEach(m => m.close()));
    await wait(2600);
    await check(page, tag, 'deploy');
    await page.evaluate(() => document.querySelector('#action-bar [data-deploy="lock"]').click());
    await page.waitForFunction(() => AC.game.state.phase === 'battle');
    await wait(3200);
    await check(page, tag, 'battle');
    await page.evaluate(() => AC.ui.openCodex());
    await check(page, tag, 'rules');
    await page.evaluate(() => AC.app.modals.slice().forEach(m => m.close()));
    await page.evaluate(() => AC.ui.openSettings && AC.ui.openSettings());
    await check(page, tag, 'settings');
    await page.evaluate(() => AC.app.modals.slice().forEach(m => m.close()));

    await page.evaluate(() => AC.modes.startWheelLesson(0));
    await page.waitForFunction(() => AC.game.state && AC.game.state.phase === 'battle');
    await wait(3200);
    await check(page, tag, 'lesson');
    await page.close();
  }
} finally { await browser.close(); }

if (errors.length) { console.error('Runtime errors:\n' + errors.join('\n')); process.exitCode = 1; }
if (problems.length) {
  console.log(problems.join('\n'));
  console.log('\n' + problems.length + ' readability findings (words under ' + MIN_TEXT + ' px, buttons under ' + MIN_TAP + ' px).');
  if (!reportOnly) process.exitCode = 1;
} else {
  console.log('Readability passed: no words under ' + MIN_TEXT + ' px and no buttons under ' + MIN_TAP + ' px on any checked screen.');
}
