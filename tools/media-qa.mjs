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
const astras = ['vayavya', 'sammohana', 'agneya', 'brahma'];
const scenarios = ['capture', 'trap', 'breach', 'victory', 'volley', ...astras, 'reduced', 'battery'];
// The settings menu calls this look "Classic bronze". Its URL key is bronze.
const cases = ['pata', 'bronze'].flatMap(skin => scenarios.map(scenario => ({ skin, scenario })));
let browser;
const results = [], errors = [];
try {
  browser = await puppeteer.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium', headless: 'shell',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
  for (const { skin, scenario } of cases) {
    const label = skin + '/' + scenario;
    const motionLimited = scenario === 'reduced' || scenario === 'battery';
    const astra = motionLimited ? 'agneya' : astras.find(key => key === scenario);
    const page = await browser.newPage();
    page.on('pageerror', e => errors.push(label + ': ' + e.message));
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await page.setBypassServiceWorker(true);
    await page.goto('http://127.0.0.1:' + server.address().port + '/index.html' + (skin === 'bronze' ? '?skin=bronze' : ''));
    await page.waitForSelector('#boot', { hidden: true });
    assert.equal(await page.evaluate(() => AC.art.getSkin()), skin, label + ': active look');
    await page.tap('#btn-new-match');
    await page.evaluate(({ scenario, astra }) => {
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
      window.qaAction = astra ? { type: 'astra', astra, to: astra === 'vayavya' ? '5,1' : target,
        ...(astra === 'vayavya' ? { from: '5,2' } : {}) } : { type: scenario === 'volley' ? 'barrage' : 'attack', from: '5,2', to: target };
      if (!E.applyAction(E.clone(st), window.qaAction).ok) throw new Error('Illegal QA fixture: ' + scenario);
      window.qa = { skin: AC.art.getSkin(), scenario, events: [], films: [], stills: [] };
      const t0 = performance.now(), note = (kind, more = {}) => qa.events.push({ ms: Math.round(performance.now() - t0), kind, ...more });
      const cue = AC.audio.cue;
      AC.audio.cue = function (name) { const c = cue(name); note('effect-start', { name, duration: c.duration }); c.finished.then(() => note('effect-end', { name })); return c; };
      const say = AC.sanjaya.say;
      AC.sanjaya.say = function (key, opts) { note('voice-start', { key }); const p = say(key, opts); p.then((line) => note('voice-end', { key, id: line && line[0] })); return p; };
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        if (this.src.includes('/voice/')) {
          const src = this.src.split('/').pop();
          this.addEventListener('playing', () => note('voice-playing', { src }), { once: true });
          this.addEventListener('ended', () => note('voice-ended', { src }), { once: true });
        }
        return play.call(this);
      };
      const seen = new WeakSet();
      const observer = new MutationObserver(() => {
        document.querySelectorAll('.stage-astra .st-astra-anim, .stage-astra .st-astra-mark img.astra-art').forEach(img => {
          if (seen.has(img)) return;
          seen.add(img);
          const stage = img.closest('.stage'), r = stage.getBoundingClientRect();
          const item = { src: img.getAttribute('src'), loaded: false, aboveBoard: +getComputedStyle(stage).zIndex > (+getComputedStyle(document.querySelector('#board-shell')).zIndex || 0),
            visible: img.checkVisibility() && img.offsetWidth > 0 && img.offsetHeight > 0,
            fixed: getComputedStyle(stage).position === 'fixed', width: r.width, height: r.height };
          const group = img.matches('.st-astra-anim') ? qa.films : qa.stills;
          group.push(item);
          img.addEventListener('load', () => { item.loaded = img.naturalWidth > 0; });
          if (img.complete) item.loaded = img.naturalWidth > 0;
        });
      });
      observer.observe(document.body, { subtree: true, childList: true });
    }, { scenario, astra });
    // Wait for actual decoding; no timers or sound are mocked.
    await page.waitForFunction(() => AC.audio.duration('clash-win') > 0);
    await page.evaluate(() => AC.game.perform(qaAction));
    await page.waitForSelector('.stage');
    await new Promise(r => setTimeout(r, 450));
    await page.screenshot({ path: path.join(out, skin + '-' + scenario + '.png') });
    await page.waitForFunction(() => qa.events.some(e => e.kind === 'voice-start'), { timeout: 20000 });
    await page.waitForFunction(() => !AC.game.busy, { timeout: 20000 });
    const row = await page.evaluate(() => qa);
    // docs/PACING.md: one voice at a time, entering only after the card's 1.1 s read
    // (over the softened tail of the effect, never its body).
    let effectStart = null, activeVoice = false;
    for (const e of row.events) {
      if (e.kind === 'effect-start' && effectStart == null) effectStart = e.ms;
      if (e.kind === 'voice-start') { assert.ok(effectStart == null || e.ms >= effectStart + 1050, label + ': voice entered over the effect body'); assert.ok(!activeVoice, label + ': voices overlap'); activeVoice = true; }
      if (e.kind === 'voice-end') activeVoice = false;
    }
    assert.equal(row.events.filter(e => e.kind === 'voice-start').length, 1, label + ': one line for the turn');
    // A line held for re-recording (docs/voice/pending-recordings.json) is text only.
    const spoken = row.events.find(e => e.kind === 'voice-end');
    const held = await page.evaluate((id) => !!id && Object.values(AC.sanjaya.voicePending).some(list => list.includes(id)), spoken && spoken.id);
    assert.ok(held || row.events.some(e => e.kind === 'voice-playing'), label + ': real voice played');
    const filmExpected = skin === 'bronze' && astras.includes(scenario);
    assert.equal(row.films.length, filmExpected ? 1 : 0, label + ': film count');
    if (filmExpected) assert.equal(row.films[0].src, 'assets/art/opt/astras/' + astra + '-anim.webp', label + ': correct film');
    if (skin === 'pata' && astra) {
      assert.equal(row.stills.length, 1, label + ': one painted still');
      assert.equal(row.stills[0].src, 'assets/art/pata/astras/' + astra + '.webp', label + ': correct painting');
    }
    for (const media of [...row.films, ...row.stills]) {
      assert.ok(media.loaded && media.visible && media.fixed && media.aboveBoard && media.width === 390 && media.height === 844,
        label + ': media loaded on the full-screen stage above the board: ' + JSON.stringify(media));
    }
    results.push(row);
    console.log(label + ': passed');
    await page.close();
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ viewport: '390x844', physicalPhone: false, errors, results }, null, 2) + '\n');
  console.log('Media QA passed: real audio, Pata paintings, Classic films, reduced motion and battery saver.');
} finally {
  if (browser) await browser.close();
  server.close();
}
