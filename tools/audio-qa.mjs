/* Real-file browser checks for score routing, playback controls and the trap.
 * CHROMIUM_PATH=/path/to/chrome node tools/audio-qa.mjs [output.json]
 */
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  const type = { '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.html': 'text/html', '.webp': 'image/webp' }[path.extname(p)];
  res.writeHead(200, { 'content-type': type || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
}).listen(0);
let browser;
const errors = [];
try {
  browser = await puppeteer.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium', headless: 'shell', args: ['--no-sandbox', '--disable-dev-shm-usage', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.setBypassServiceWorker(true);
  await page.goto('http://127.0.0.1:' + server.address().port);
  await page.waitForSelector('#boot', { hidden: true });
  await page.evaluate(() => {
    window.mediaEls = new Set(); window.startedBuffers = [];
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { mediaEls.add(this); return play.call(this); };
    const start = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...args) { if (this.buffer) startedBuffers.push(this.buffer.duration); return start.apply(this, args); };
  });
  await page.tap('#btn-new-match');
  await page.evaluate(() => {
    AC.ui.patchSettings({ stories: false, narrator: false, musicOn: true, music: 0.35, muted: false });
    const st = AC.engine.newState({ mode: 'pass', board: 'wheel', rules: { hours: true } });
    AC.engine.beginBattle(st); AC.game.startPrepared(st, { save: false });
    window.qaState = st;
  });
  const routes = [];
  for (const [scenario, turn, mode, file] of [
    ['duel', 1, 'battle_night', 'battle_night.mp3'], ['duel', 5, 'battle', 'battle.mp3'],
    ['daily', 1, 'daily', 'daily_theme.mp3'], ['daily', 5, 'daily', 'daily_theme.mp3'],
    ['shiksha', 1, 'lesson', 'lesson.mp3'], ['abhimanyu', 5, 'abhimanyu', 'abhimanyu.mp3']]) {
    await page.evaluate((scenario, turn) => { qaState.scenario = scenario; qaState.turn = turn; AC.game.render(); }, scenario, turn);
    await page.waitForFunction((mode, file) => AC.audio.state().mode === mode && [...mediaEls].some(el => el.src.endsWith('/' + file) && el.readyState >= 2 && !el.paused), {}, mode, file);
    await new Promise(r => setTimeout(r, 1000));
    const playing = await page.evaluate(() => [...mediaEls].filter(el => !el.paused && !el.ended).map(el => el.src.split('/').pop()));
    assert.deepEqual(playing, [file], scenario + ': exactly the requested score plays');
    routes.push({ scenario, turn, mode, playing });
  }
  await page.evaluate(() => { AC.ui.openSettings(); document.querySelector('[data-toggle="musicOn"]').click(); AC.game.render(); });
  await new Promise(r => setTimeout(r, 650));
  assert.equal(await page.evaluate(() => [...mediaEls].filter(el => !el.paused && !el.ended).length), 0, 'Music Off survives redraw');
  await page.evaluate(() => document.querySelector('[data-toggle="musicOn"]').click());
  await page.waitForFunction(() => AC.audio.state().mode === 'abhimanyu');
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => AC.ui.patchSettings({ muted: true }));
  assert.ok(await page.evaluate(() => [...mediaEls].filter(el => !el.paused).every(el => el.muted)), 'Mute applies to recorded music');
  await page.evaluate(() => AC.ui.patchSettings({ muted: false, music: 0 }));
  assert.ok(await page.evaluate(() => [...mediaEls].filter(el => !el.paused).every(el => el.volume === 0)), 'zero volume stays silent');
  await page.evaluate(() => { AC.ui.patchSettings({ music: 0.35 }); AC.audio.sting('victory_big'); });
  await page.waitForFunction(() => [...mediaEls].some(el => el.src.endsWith('/victory_big.mp3') && !el.paused && el.readyState >= 2));
  await page.evaluate(() => AC.ui.show('home'));
  await new Promise(r => setTimeout(r, 1000));
  assert.ok(await page.evaluate(() => [...mediaEls].filter(el => el.src.endsWith('/victory_big.mp3')).every(el => el.paused)), 'victory cue stops on Home');
  // A decoded buffer (rather than a procedural fallback) must back the trap.
  await page.evaluate(() => { AC.audio.stopMusic(); startedBuffers.length = 0; AC.audio.play('mine'); });
  await page.waitForFunction(() => startedBuffers.length > 0);
  const trap = await page.evaluate(() => startedBuffers);
  assert.equal(trap.length, 1, 'trap is a single recorded buffer');
  assert.ok(trap[0] > 1 && trap[0] < 1.3, 'recorded trap duration');
  assert.deepEqual(errors, []);
  const result = { viewport: '390x844', routes, musicOffSurvivesRedraw: true, settingsRestoreCorrectTheme: true,
    recordedMusicMuteAndZeroVolume: true, victoryStopsOnHome: true, trapBufferSeconds: trap[0], errors, physicalPhone: false };
  if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2)); console.log('Audio routing/control QA passed.');
} finally { if (browser) await browser.close(); server.close(); }
