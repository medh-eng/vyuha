/* Real Chromium media regression: legal prepared positions, shipped audio and
 * unscaled Calm timings. No physical-device or listening test is implied.
 * CHROMIUM_PATH=/path/to/chrome node tools/media-qa.mjs [output-directory]
 */
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.argv[2] || '/tmp/vyuha-media-qa';
fs.mkdirSync(out, { recursive: true });
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(0);
let browser;
const results = [], errors = [];
try {
  browser = await puppeteer.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium', headless: 'shell',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
  for (const scenario of ['capture', 'trap', 'breach', 'victory', 'volley', 'vayavya', 'sammohana', 'agneya', 'brahma', 'reduced', 'battery']) {
    const page = await browser.newPage();
    page.on('pageerror', e => errors.push(scenario + ': ' + e.message));
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await page.setBypassServiceWorker(true);
    await page.goto('http://127.0.0.1:' + server.address().port + '/index.html');
    await page.waitForSelector('#boot', { hidden: true });
    await page.tap('#btn-new-match');
    await page.evaluate((scenario) => {
      AC.ui.patchSettings({ pace: 'calm', stories: false, musicOn: false, narrator: true, narratorLang: 'en', voice: true,
        cinematics: true, batterySaver: scenario === 'battery', reducedMotion: scenario === 'reduced' });
      const E = AC.engine, st = E.newState({ mode: 'pass', board: 'small', rules: { gates: true, hours: false, vyuha: false, astras: true } });
      st.board = {};
      const put = (cell, owner, key) => { st.board[cell] = E.createArmy(owner).find(u => u.key === key); };
      put('7,2', 1, 'F'); put('5,1', 1, '2'); put('1,4', 2, '2');
      put('5,2', 1, scenario === 'volley' ? '6' : '9');
      const fort = scenario === 'breach' || scenario === 'victory';
      const target = scenario === 'volley' ? '3,2' : '4,2';
      put(target, 2, fort ? 'F' : scenario === 'trap' ? 'B' : '3');
      if (!fort) put('0,4', 2, 'F');
      if (scenario === 'victory') st.board[target].breached = true;
      E.beginBattle(st); st.shakti[1] = 5;
      AC.game.startPrepared(st, { save: false });
      const astra = ['vayavya', 'sammohana', 'agneya', 'brahma'].includes(scenario) ? scenario
        : scenario === 'reduced' || scenario === 'battery' ? 'agneya' : null;
      window.qaAction = astra ? { type: 'astra', astra, to: astra === 'vayavya' ? '5,1' : target,
        ...(astra === 'vayavya' ? { from: '5,2' } : {}) } : { type: scenario === 'volley' ? 'barrage' : 'attack', from: '5,2', to: target };
      if (!E.applyAction(E.clone(st), window.qaAction).ok) throw new Error('Illegal QA fixture: ' + scenario);
      window.qa = { scenario, events: [], films: [] };
      const t0 = performance.now(), note = (kind, more = {}) => qa.events.push({ ms: Math.round(performance.now() - t0), kind, ...more });
      const cue = AC.audio.cue;
      AC.audio.cue = function (name) { const c = cue(name); note('effect-start', { name, duration: c.duration }); c.finished.then(() => note('effect-end', { name })); return c; };
      const say = AC.sanjaya.say;
      AC.sanjaya.say = function (key, opts) { note('voice-start', { key }); const p = say(key, opts); p.then(() => note('voice-end', { key })); return p; };
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        if (this.src.includes('/voice/')) {
          const src = this.src.split('/').pop();
          this.addEventListener('playing', () => note('voice-playing', { src }), { once: true });
          this.addEventListener('ended', () => note('voice-ended', { src }), { once: true });
        }
        return play.call(this);
      };
      const observer = new MutationObserver(() => {
        document.querySelectorAll('.st-astra-anim').forEach(img => {
          if (img.dataset.checked) return;
          img.dataset.checked = 'yes';
          const stage = img.closest('.stage'), r = stage.getBoundingClientRect();
          const item = { src: img.getAttribute('src'), loaded: false, aboveBoard: +getComputedStyle(stage).zIndex > (+getComputedStyle(document.querySelector('#board-shell')).zIndex || 0),
            fixed: getComputedStyle(stage).position === 'fixed', width: r.width, height: r.height };
          qa.films.push(item);
          img.addEventListener('load', () => { item.loaded = img.naturalWidth > 0; });
          if (img.complete) item.loaded = img.naturalWidth > 0;
        });
      });
      observer.observe(document.body, { subtree: true, childList: true });
    }, scenario);
    // Wait for actual decoding; no timers or sound are mocked.
    await page.waitForFunction(() => AC.audio.duration('clash-win') > 0);
    await page.evaluate(() => AC.game.perform(qaAction));
    await page.waitForSelector('.stage');
    await new Promise(r => setTimeout(r, 450));
    await page.screenshot({ path: path.join(out, scenario + '.png') });
    await page.waitForFunction(() => qa.events.some(e => e.kind === 'voice-start'), { timeout: 20000 });
    await page.waitForFunction(() => !AC.game.busy, { timeout: 20000 });
    const row = await page.evaluate(() => qa);
    let effectEnd = 0, activeVoice = false;
    for (const e of row.events) {
      if (e.kind === 'effect-end') effectEnd = e.ms;
      if (e.kind === 'voice-start') { assert.ok(e.ms >= effectEnd, scenario + ': voice overlaps effect'); assert.ok(!activeVoice, scenario + ': voices overlap'); activeVoice = true; }
      if (e.kind === 'voice-end') activeVoice = false;
    }
    assert.equal(row.events.filter(e => e.kind === 'voice-start').length, 1, scenario + ': one line for the turn');
    assert.ok(row.events.some(e => e.kind === 'voice-playing'), scenario + ': real voice played');
    const filmExpected = ['vayavya', 'sammohana', 'agneya', 'brahma'].includes(scenario);
    assert.equal(row.films.length, filmExpected ? 1 : 0, scenario + ': correct motion gate');
    for (const film of row.films) assert.ok(film.loaded && film.fixed && film.aboveBoard && film.width === 390 && film.height === 844, scenario + ': first film loaded above the board: ' + JSON.stringify(film));
    results.push(row);
    console.log(scenario + ': passed');
    await page.close();
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ viewport: '390x844', physicalPhone: false, errors, results }, null, 2) + '\n');
  console.log('Media QA passed: real audio, first-use films, reduced motion and battery saver.');
} finally {
  if (browser) await browser.close();
  server.close();
}
