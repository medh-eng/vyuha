/* VYUHA — battle screen (v4)
 * Renders any cell graph as SVG, so the square arenas, the Chakravyuha wheel
 * and the Padmavyuha lotus share one renderer, one input path and one set of
 * animations. Chapter III adds the sky, Shakti and astras, formation links,
 * odds on the board in plain words, a Confirm strike step, the stage beats
 * and Sanjaya.
 */
(function (root) {
  'use strict';
  const AC = (root.AC = root.AC || {});
  const L = AC.i18n;
  const tr = function (key, fallback) { return L.text(key, fallback); };
  const E = AC.engine;
  const AI = AC.ai;
  const U = AC.units;
  const A = AC.art;
  const AU = AC.audio;
  const FX = AC.fx;
  const S = AC.storage;
  const G = AC.geometry;
  const ST = AC.stage;
  const SJ = AC.sanjaya;

  const g = (AC.game = AC.game || {});
  g.state = null;
  g.sel = null;
  g.mode = 'move';
  g.astra = null;
  g.astraFirst = null;
  g.armed = null;
  g.thinking = false;
  g.focus = null;
  g.slot = null;
  g.timerId = null;
  g.timeLeft = 0;
  g.aiTimer = null;
  g.busy = false;
  g.over = false;
  g.hinted = false;
  g.links = null;
  g.said = {};

  const $ = function (s) { return document.querySelector(s); };
  const esc = function (s) { return AC.ui.esc(s); };
  const sfx = function (n) { AU.play(n); };
  const buzz = function (p) { AU.buzz(p); };

  function settings() { return AC.app.settings; }
  function modes() { return AC.modes || null; }
  function modeHook(name, arg) {
    const m = modes();
    if (m && typeof m[name] === 'function') return m[name](g.state, arg);
    return undefined;
  }

  const TIPS = [
    'A piece that has never moved can still be the fort or a trap. Probe with something cheap.',
    'The archer kills from two cells away — keep your fort out of a clear lane.',
    'Select a piece and every target says Likely win, Uncertain or Likely loss. Tap it, then Confirm strike.',
    'Every fifth round the sky turns. In your hour your blows land at +1.',
    'Two of your pieces touching one enemy make Makara — the jaws. +1 to the strike.',
    'A piece with two friends beside it is Padma — the petals. It defends at +1.',
    'A fort’s gate breaks on the first blow. The second blow takes it.',
    'Shakti grows with every piece you take. Spend it on astras — each once per match.',
    'Brahmastra destroys any one fighting piece within two cells of yours. Choose well.',
    'The hub touches every spoke: fastest crossing on the wheel, worst place to stand.',
    'Losing the Chara early costs you your best answer to the enemy Senapati.',
    'At sunset the stronger army holds the field — count what is left, not what you lost.'
  ];
  let tipTimer = null;
  let tipIndex = 0;
  let lastLineAt = 0;

  function paintStrip(html, kind) {
    const el = document.getElementById('tip-text');
    const bar = document.getElementById('tip-bar');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(function () {
      el.innerHTML = html;
      el.style.opacity = '1';
      if (bar) bar.className = 'tip-bar' + (kind ? ' ' + kind : '');
    }, 160);
  }

  function startTips() {
    if (tipTimer) clearInterval(tipTimer);
    tipIndex = Math.floor(Math.random() * TIPS.length);
    const paint = function () {
      // Sanjaya's latest line stays up for a while before tips return
      if (Date.now() - lastLineAt < 12000) return;
      paintStrip('<span class="tip-ico">◆</span>' + esc(TIPS[tipIndex % TIPS.length]), '');
      tipIndex++;
    };
    paint();
    tipTimer = setInterval(paint, 14000);
  }

  // Sanjaya speaks through the strip under the board
  if (SJ) {
    SJ.onLine(function (text) {
      lastLineAt = Date.now();
      paintStrip('<span class="sanjaya-face">' + A.sanjayaMark() + '</span><span class="sanjaya-text"><b>Sanjaya</b> ' + esc(text) + '</span>', 'sanjaya');
    });
  }
  let sayQueue = [];
  let sayTimer = null;
  function speak(keys) {
    if (!SJ || settings().narrator === false) return;
    keys = keys.filter(Boolean);
    if (!keys.length) return;
    // the three most important waiting lines, newest moments not crowded out by older ones
    sayQueue = SJ.rank(sayQueue.concat(keys)).slice(0, 3);
    markSaid(sayQueue);
    const pump = function () {
      if (!sayQueue.length) { sayTimer = null; return; }
      const k = sayQueue.shift();
      SJ.say(k, { force: true });
      sayTimer = setTimeout(pump, 2600);
    };
    if (!sayTimer) pump();
  }
  function speakOnce(key) {
    if (g.said[key]) return;
    speak([key]);
  }
  // once-a-battle lines count as said only when they were actually chosen to be spoken
  const ONCE = ['shakti_full', 'last_rounds', 'sunset_near'];
  function markSaid(keys) {
    keys.forEach(function (k) { if (ONCE.indexOf(k) !== -1) g.said[k] = true; });
  }

  /* ── the legend that opens a match ── */
  const LEGEND = {
    duel: {
      title: 'Two houses, one field',
      text: 'Neither army knows the other’s order of battle. Twelve pieces a side, ten hidden ranks, and one fort whose gate must be broken before it falls. The battle opens in the last hour of night — Chandra’s hour.'
    },
    abhimanyu: {
      title: 'The wheel is closed',
      text: 'A single breach, eight companions, and the formation sealing behind you. Break the gate and take the fort before the rounds run out — or be remembered as the one who nearly did.'
    }
  };

  function showStory(done) {
    const st = g.state;
    const sc = L.scenario(st.scenario) || U.SCENARIOS.duel;
    const legend = LEGEND[st.scenario] || LEGEND.duel;
    // The button and the modal's close both end the card; the opening line must play once.
    const finish = done;
    let finished = false;
    done = function () { if (finished) return; finished = true; if (finish) finish(); };
    if (settings().stories === false || !L.scenario(st.scenario)) { done(); return; }
    const art = A.artFor('card:' + st.scenario);
    const m = AC.ui.modal({
      kicker: sc.label + (sc.deva ? ' · ' + sc.deva : ''),
      title: legend.title,
      art: art,
      artKey: st.scenario,
      wide: false,
      body: '<p style="font-size:13px;line-height:1.65;color:var(--dim);margin:0 0 12px">' + esc(legend.text) + '</p>' +
        '<div class="legend-facts">' +
          '<span><b>' + st.rosters[1].length + '</b> your pieces</span>' +
          '<span><b>' + st.rosters[2].length + '</b> theirs</span>' +
          '<span><b>' + (st.turnLimit || '—') + '</b> rounds</span>' +
        '</div>',
      actions: [
        { label: 'Skip stories', cls: 'btn-ghost', onClick: function () {
            AC.ui.patchSettings({ stories: false });
          } },
        { label: 'Take the field', cls: 'btn-primary', onClick: function () { if (done) done(); } }
      ],
      onClose: function () { if (done) done(); }
    });
    return m;
  }

  g.showStory = showStory;

  let bannerTimer = null;
  function banner(title, sub, kind, ms) {
    const el = document.getElementById('turn-banner');
    if (!el) return;
    el.className = 'turn-banner' + (kind ? ' ' + kind : '');
    el.innerHTML = esc(title) + (sub ? '<small>' + esc(sub) + '</small>' : '');
    void el.offsetWidth;
    el.classList.add('show');
    if (bannerTimer) clearTimeout(bannerTimer);
    bannerTimer = setTimeout(function () { el.classList.remove('show'); }, ms || 1250);
  }
  g.banner = banner;

  function spinRings() {
    Array.prototype.forEach.call(document.querySelectorAll('#board .ring-1, #board .ring-2'), function (el) {
      el.classList.remove('chakra-spin');
      void el.getBoundingClientRect();
      el.classList.add('chakra-spin');
    });
  }
  function isPass() { return g.state && g.state.config.mode === 'pass'; }
  function isAi() { return g.state && g.state.config.mode === 'ai'; }
  /* Sideways fields (Commander, 7 Nov 2026): the 6 × 8 and 8 × 10 fields are taller than wide, but a
   * phone held sideways is wider than tall, so there the field is turned a quarter, your army on the
   * left. View only: the rules and every cell id are unchanged; only where a cell is drawn. */
  const turnedCache = {};
  function turnBoard(b) {
    if (turnedCache[b.key]) return turnedCache[b.key];
    const bd = b.bounds, X0 = bd.x + bd.w / 2, Y0 = bd.y + bd.h / 2;
    const P = function (x, y) { return [X0 - (y - Y0), Y0 + (x - X0)]; };
    const cells = b.cells.map(function (c) {
      const p = P(c.x, c.y);
      return Object.assign({}, c, { x: p[0], y: p[1], points: c.points.map(function (q) { return P(q[0], q[1]); }) });
    });
    const out = Object.assign({}, b, {
      cells: cells, byId: {}, turned: true, src: b,
      bounds: { x: X0 - bd.h / 2, y: Y0 - bd.w / 2, w: bd.h, h: bd.w },
      labels: (b.labels || []).map(function (l) {
        const p = P(l.x, l.y);
        return Object.assign({}, l, { x: p[0], y: p[1], anchor: 'middle', baseline: 'middle' });
      })
    });
    cells.forEach(function (c) { out.byId[c.id] = c; });
    return (turnedCache[b.key] = out);
  }
  function board() {
    const b = G.build(g.state.boardKey);
    return b.kind === 'square' && turnedNow() ? turnBoard(b) : b;
  }
  /* sideways only where it gains: from 700 px wide the turned field is width-limited no longer */
  const TURN_Q = '(orientation: landscape) and (max-height: 520px) and (min-width: 700px)';
  function turnedNow() { return typeof matchMedia === 'function' && matchMedia(TURN_Q).matches; }
  function viewerOf(st) { return st.viewer === 3 || st.viewer === 0 ? 1 : st.viewer; }

  function oppName(st) {
    st = st || g.state;
    if (!st) return '';
    if (st.config.mode !== 'ai') return 'Commander 2';
    const d = L.opponent(st.config.difficulty) || U.DIFFICULTIES.veteran;
    return d.label;
  }
  g.oppName = oppName;

  /* ══ lifecycle ═════════════════════════════════════════════════ */

  function clearOverlays() {
    clearTimers();
    g.busy = false;
    g.thinking = false;
    Array.prototype.forEach.call(document.querySelectorAll('.curtain'), function (n) { n.remove(); });
    const scrim = document.getElementById('scrim');
    if (scrim) scrim.classList.remove('on');
    ['intel-panel', 'log-panel'].forEach(function (id) {
      const p = document.getElementById(id);
      if (p) p.classList.remove('open');
    });
    if (ST) ST.close(false);
    const coach = document.getElementById('coach');
    if (coach && !(g.state && modeHook('wantsCoach'))) coach.hidden = true;
  }
  g.clearOverlays = clearOverlays;

  function resetSelection() {
    g.sel = null;
    g.mode = 'move';
    g.astra = null;
    g.astraFirst = null;
    g.armed = null;
    g.focus = null;
  }

  function resetMatchFlags() {
    resetSelection();
    g.slot = null;
    g.over = false;
    g.calmResultNarrated = false;
    g.busy = false;
    g.thinking = false;
    g.hinted = false;
    g.links = null;
    g.said = {};
    g.lastShakti = { 1: 0, 2: 0 };
    sayQueue = [];
    if (sayTimer) { clearTimeout(sayTimer); sayTimer = null; }
    lastLineAt = 0;
  }

  g.start = function (config) {
    clearTimers();
    if (AC.modes && AC.modes.clear) AC.modes.clear();
    clearOverlays();
    if (AC.app.configFromSetup && !config.rules) config = AC.app.configFromSetup(config);
    g.state = E.newState(Object.assign({}, config, {
      playerName: AC.app.profile ? AC.app.profile.name : 'Commander'
    }));
    resetMatchFlags();
    AC.ui.show('game');
    render();
    startTips();
    showStory(function () { speak([g.state.scenario === 'abhimanyu' ? 'start_abhimanyu' : 'start_duel']); });
    autosave();
    FX.toast(g.state.turnLimit
      ? 'Abhimanyu — break in and take the fort before round ' + g.state.turnLimit + '.'
      : 'Arrange your formation, then lock it in.', 'info');
  };

  /* Start from a state a mode has already prepared (tutorial, daily). */
  g.startPrepared = function (state, opts) {
    opts = opts || {};
    clearTimers();
    clearOverlays();
    g.state = state;
    resetMatchFlags();
    AC.ui.show('game');
    render();
    startTips();
    if (opts.line) speak([opts.line]);
    if (g.state.phase === 'battle') {
      banner(opts.bannerTitle || 'Battle begins', opts.bannerSub || '', 'gold', 1500);
      if (g.state.owner === 2 && isAi()) scheduleAi();
    }
    if (opts.save !== false) autosave();
  };

  g.load = function (raw, slot) {
    clearTimers();
    clearOverlays();
    try {
      g.state = E.deserialize(raw);
    } catch (err) {
      FX.toast('That save could not be read.', 'error');
      return;
    }
    resetMatchFlags();
    if (AC.modes && AC.modes.resume) AC.modes.resume(g.state);
    g.slot = slot || null;
    g.over = g.state.phase === 'over';
    if (g.state.phase === 'deploy2') g.state.viewer = 2;
    else if (g.state.phase === 'battle') g.state.viewer = isPass() ? g.state.owner : 1;
    else if (g.state.phase === 'deploy1') g.state.viewer = 1;
    g.lastShakti = { 1: g.state.shakti[1], 2: g.state.shakti[2] };
    AC.ui.show('game');
    render();
    startTips();
    FX.toast('Match restored.', 'success');
    if (g.state.phase === 'battle' && isAi() && g.state.owner === 2) scheduleAi();
  };

  g.onShow = function () {
    if (settings().fullscreen !== false) enterFull();
    render();
  };
  g.isActive = function () { return !!g.state; };
  g.canSave = function () { return !!g.state && g.state.phase !== 'over' && !modeHook('noSave'); };
  g.onSettingsChange = function () { render(); };
  g.updateResumeState = function () { /* home reads storage directly */ };

  function saveMeta(st) {
    return {
      mode: st.config.mode,
      board: st.boardKey,
      difficulty: st.config.difficulty,
      tie: st.config.tie,
      timer: st.config.timer,
      turn: st.turn,
      phase: st.phase,
      owner: st.owner,
      scenario: st.scenario
    };
  }

  g.saveTo = function (slot) {
    if (!g.canSave()) return null;
    const st = g.state;
    const label = (L.board(st.boardKey) || U.BOARDS.small).label + ' · ' +
      (st.config.mode === 'pass' ? 'Pass & play' : 'vs ' + oppName(st)) +
      ' · round ' + st.turn;
    const entry = S.saveGame(slot, st, Object.assign({ label: label }, saveMeta(st)));
    return entry ? label : null;
  };

  function autosave() {
    if (!g.canSave()) return;
    const st = g.state;
    S.saveGame('auto', st, Object.assign({ label: 'Autosave' }, saveMeta(st)));
  }
  g.autosave = autosave;

  function clearTimers() {
    cancelPace();
    sayQueue = [];
    if (sayTimer) { clearTimeout(sayTimer); sayTimer = null; }
    if (SJ && SJ.stop) SJ.stop();
    if (g.timerId) { clearInterval(g.timerId); g.timerId = null; }
    if (g.aiTimer) { clearTimeout(g.aiTimer); g.aiTimer = null; }
  }

  /* ══ rendering ═════════════════════════════════════════════════ */

  let rendering = false;
  let renderAgain = false;

  // Special modes keep their theme across sky changes. Settings and audio
  // unlock use the same route, so they cannot replace the score with menu music.
  g.musicMode = function () {
    const st = g.state;
    if (!st) return null;
    if (st.phase === 'deploy1' || st.phase === 'deploy2') return 'tabla';
    if (st.phase !== 'battle') return null;
    if (st.scenario === 'daily') return 'daily';
    if (st.scenario === 'shiksha') return 'lesson';
    if (st.scenario === 'abhimanyu') return 'abhimanyu';
    return E.hourOf(st) === 'night' ? 'battle_night' : 'battle';
  };

  function render() {
    if (!g.state) return;
    if (rendering) { renderAgain = true; return; }   // never rebuild the board mid-build
    rendering = true;
    try {
    // deployment gets the tabla score, battle gets the war drums
    const score = g.musicMode();
    if (score) AU.startMusic(score);
    renderHud();
    renderStrips();
    renderBoard();
    renderActionBar();
    renderIntel();
    renderLog();
    startClockIfNeeded();
    rotateHint();
    modeHook('afterRender');
    } finally {
      rendering = false;
      if (renderAgain) { renderAgain = false; setTimeout(render, 0); }
    }
  }

  /* Once, on a first ordinary portrait battle while the player is free to act:
   * suggest landscape. Dismissing it, or turning the phone, retires it. */
  function landscapeNow() {
    return typeof matchMedia === 'function' && matchMedia('(orientation: landscape) and (max-height: 520px) and (min-width: 560px)').matches;
  }
  function retireRotateHint() {
    const el = $('#rotate-hint');
    if (el) el.hidden = true;
    if (!settings().landscapeHintDismissed && AC.ui && AC.ui.patchSettings) AC.ui.patchSettings({ landscapeHintDismissed: true });
  }
  function rotateHint() {
    const el = $('#rotate-hint');
    if (!el) return;
    const st = g.state;
    if (!el.dataset.wired) {
      el.dataset.wired = '1';
      const btn = $('#btn-rotate-hint');
      if (btn) { btn.innerHTML = A.icon('close'); btn.addEventListener('click', function () { sfx('ui'); retireRotateHint(); }); }
      if (typeof matchMedia === 'function') {
        const mq = matchMedia('(orientation: landscape) and (max-height: 520px) and (min-width: 560px)');
        const onTurn = function () { if (mq.matches && !el.hidden) retireRotateHint(); };
        if (mq.addEventListener) mq.addEventListener('change', onTurn); else if (mq.addListener) mq.addListener(onTurn);
      }
    }
    const touch = typeof matchMedia === 'function' && matchMedia('(pointer: coarse) and (orientation: portrait) and (max-width: 560px)').matches;
    const idle = st.phase === 'battle' && !g.busy && !g.thinking && st.viewer !== 0 && (!st.scenario || st.scenario === 'duel') && !$('#coach:not([hidden])');
    el.hidden = !(touch && idle && !settings().landscapeHintDismissed && !landscapeNow());
  }

  /* Battles on a phone open full screen and sideways (Commander, 6 Nov 2026):
   * the browser's own bars cost the field a fifth of its height. Needs the tap
   * that started the battle; if the browser refuses, nothing else changes. */
  function canFull() {
    const d = typeof document !== 'undefined' ? document : null;
    return !!(d && d.fullscreenEnabled && d.documentElement.requestFullscreen &&
      typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches);
  }
  function lockSideways() {
    try {
      if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {});
    } catch (e) { /* not supported */ }
  }
  function enterFull() {
    if (!canFull() || document.fullscreenElement) { if (document.fullscreenElement) lockSideways(); return; }
    try {
      const p = document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      if (p && p.then) p.then(function () { lockSideways(); renderHud(); }, function () {});
    } catch (e) { /* refused without a tap */ }
  }
  function leaveFull() {
    try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) { /* ignore */ }
    if (typeof document !== 'undefined' && document.fullscreenElement && document.exitFullscreen) {
      const p = document.exitFullscreen();
      if (p && p.catch) p.catch(function () {});
    }
  }
  g.leaveFull = leaveFull;

  function skyIcon(hour) { return A.icon(hour === 'day' ? 'sun' : 'moon'); }

  /* The objective and the next turn of the field, always in view (landscape rail).
   * Uses the engine's own counters; nothing new is timed here. */
  function objectiveText(st) {
    if (st.phase === 'deploy1' || st.phase === 'deploy2') return tr('goal.deploy', 'Arrange your army, then lock it.');
    const viewer = viewerOf(st);
    let broken = false;
    E.forEachUnit(st, function (u) { if (u.key === 'F' && u.owner !== viewer && u.breached) broken = true; });
    let text = !E.rules(st).gates ? tr('goal.take', 'Take the enemy fort.')
      : broken ? tr('goal.broken', 'Their gate is broken. Take the fort!')
        : tr('goal.gate', 'Break their gate, then take their fort.');
    if (st.turnLimit) text += ' ' + tr('goal.by', 'By round') + ' ' + st.turnLimit + '.';
    return text;
  }
  function renderGoal(st) {
    const el = $('#hud-goal');
    if (!el) return;
    if (st.phase === 'over') { el.hidden = true; return; }
    el.hidden = false;
    let html = '<div class="goal-line"><b>' + esc(tr('goal.title', 'Goal')) + '</b> ' + esc(objectiveText(st)) + '</div>';
    if (st.phase === 'battle') {
      const b = board();
      // the hour: whose strikes land at +1, and how long it lasts
      const hour = E.hourOf(st);
      if (hour) {
        const mine = E.hourOwner(st) === viewerOf(st);
        const hl = E.roundsUntilHourTurns(st);
        html += '<div class="goal-turn sky' + (mine ? ' mine' : '') + '"><span>' + skyIcon(hour) +
          esc(hour === 'day' ? 'Surya' : 'Chandra') + ' <b>+1</b> ' + esc(tr('goal.for', 'for')) + ' <b>' + hl + '</b> ' +
          esc(hl === 1 ? tr('goal.round', 'round') : tr('goal.rounds', 'rounds')) + '</span></div>';
      }
      if (E.hasRotation(st)) {
        const left = E.turnsUntilRotation(st);
        const total = Math.max(left, b.rotateEvery || 5);
        let pips = '';
        for (let i = 0; i < total; i++) pips += '<i' + (i < total - left ? ' class="on"' : '') + '></i>';
        html += '<div class="goal-turn chakra' + (left <= 1 ? ' soon' : '') + '">' +
          '<span>' + esc(b.kind === 'hex' ? tr('goal.lotus', 'Lotus turns in') : tr('goal.chakra', 'Chakra turns in')) + ' <b>' + left + '</b></span>' +
          '<span class="goal-pips">' + pips + '</span></div>';
      }
    }
    el.innerHTML = html;
  }

  function renderHud() {
    const st = g.state;
    const pill = $('#hud-turn');
    const sub = $('#hud-sub');
    const clock = $('#hud-clock');
    const skyEl = $('#hud-sky');
    // every rail button carries its name (shown beside the board in landscape)
    const lab = function (key, text) { return '<span class="hud-label">' + esc(tr(key, text)) + '</span>'; };
    $('#btn-game-menu').innerHTML = A.icon('menu') + lab('hud.menu', 'Menu');
    $('#btn-hud-intel').innerHTML = A.icon('eye') + lab('hud.intel', 'Intel');
    $('#btn-hud-log').innerHTML = A.icon('book') + lab('hud.log', 'Log');
    $('#btn-hud-settings').innerHTML = A.icon('settings') + lab('hud.settings', 'Settings');
    const full = $('#btn-hud-full');
    if (full) {
      full.hidden = !canFull();
      const on = !!document.fullscreenElement;
      full.innerHTML = A.icon(on ? 'shrink' : 'expand') + lab(on ? 'hud.exit_full' : 'hud.full', on ? 'Exit full' : 'Full screen');
      full.setAttribute('aria-label', on ? 'Leave full screen' : 'Full screen');
    }
    $('#btn-log-close').innerHTML = A.icon('close');

    const hour = E.hourOf(st);
    if (skyEl) {
      if (hour && st.phase === 'battle') {
        const left = E.roundsUntilHourTurns(st);
        const mine = E.hourOwner(st) === viewerOf(st);
        skyEl.hidden = false;
        skyEl.className = 'sky-chip ' + hour + (mine ? ' mine' : '');
        skyEl.innerHTML = skyIcon(hour) + '<span>' + left + '</span>' +
          '<span class="hud-label">' + esc(hour === 'day' ? 'Surya' : 'Chandra') + '</span>';
        skyEl.title = tr('sky.' + hour, hour === 'day' ? 'Dinman — the hour of Surya' : 'Ratri — the hour of Chandra') +
          '. The sky turns in ' + left + ' round' + (left === 1 ? '' : 's') + '.';
      } else {
        skyEl.hidden = true;
      }
    }

    const vowEl = $('#hud-vow');
    if (vowEl) {
      const v = st.pratigya && PR && PR.get(st.pratigya.key);
      vowEl.hidden = !(v && st.phase === 'battle');
      if (v) {
        vowEl.textContent = v.deva;
        vowEl.title = vowText(v, 'name') + ' — ' + vowText(v, 'rule');
      }
    }

    renderGoal(st);
    pill.className = 'turn-pill';
    if (st.phase === 'deploy1' || st.phase === 'deploy2') {
      const owner = st.phase === 'deploy1' ? 1 : 2;
      pill.classList.add(owner === 1 ? 'solar' : 'void');
      pill.textContent = 'Vyuha rachna · ' + U.FACTIONS[owner].short;
      sub.textContent = 'Arrange your formation: tap two cells to swap them, then lock it.';
    } else if (st.phase === 'battle') {
      const roundsLeft = st.turnLimit ? Math.max(0, st.turnLimit - st.turn + 1) : 0;
      if (g.thinking) {
        pill.classList.add('void');
        pill.textContent = oppName(st) + ' ' + tr('battle.thinking', 'is thinking');
        sub.textContent = 'Weighing what it has seen of your army.';
      } else if (g.calmActive && g.busy) {
        pill.classList.add('gold');
        pill.textContent = 'The move unfolds';
        sub.textContent = 'Watch the field · tap the board to continue';
      } else {
        const owner = st.owner;
        pill.classList.add(owner === 1 ? 'solar' : 'void');
        const narrow = (window.innerWidth || 900) < 560;
        if (st.turnLimit) {
          pill.textContent = narrow
            ? tr('battle.round', 'Round') + ' ' + st.turn + '/' + st.turnLimit
            : tr('battle.round', 'Round') + ' ' + st.turn + '/' + st.turnLimit + ' · ' + U.FACTIONS[owner].short;
        } else {
          pill.textContent = tr('battle.round', 'Round') + ' ' + st.turn + (narrow ? '' : ' · ' + U.FACTIONS[owner].short);
        }
        const bits = [];
        if (st.turnLimit) bits.push(roundsLeft + ' rounds left');
        if (E.hasRotation(st)) bits.push((board().kind === 'hex' ? 'lotus' : 'chakra') + ' turns in ' + E.turnsUntilRotation(st));
        else if (hour) bits.push('sky turns in ' + E.roundsUntilHourTurns(st));
        const who = isPass()
          ? U.FACTIONS[owner].name + ' to move'
          : (owner === 1 ? tr('battle.your_move', 'Your move') : oppName(st) + ' is moving');
        sub.textContent = who + (bits.length ? ' · ' + bits.join(' · ') : '');
      }
    } else {
      pill.classList.add('gold');
      pill.textContent = st.winner === 0 ? tr('result.shared', 'The field is shared') : (st.winner === 1 ? 'Suryavansh victory' : 'Chandravansh victory');
      sub.textContent = 'Match complete — all ranks revealed.';
    }

    const timerOn = st.config.timer > 0 && st.phase === 'battle' && !g.thinking;
    clock.classList.toggle('hidden', !timerOn);
    if (timerOn) {
      clock.textContent = formatClock(g.timeLeft);
      clock.classList.toggle('warn', g.timeLeft <= 10);
    }
  }

  function formatClock(sec) {
    const s = Math.max(0, Math.round(sec));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  function aliveCount(owner) {
    let n = 0;
    E.forEachUnit(g.state, function (u) { if (u.owner === owner) n++; });
    return n;
  }

  /* Five lamps: lit ones are Shakti in hand. */
  function diyas(owner) {
    const st = g.state;
    if (!E.rules(st).astras) return '';
    const n = (st.shakti && st.shakti[owner]) || 0;
    let out = '<span class="diyas" title="Shakti ' + n + ' of 5">';
    for (let i = 0; i < E.SHAKTI_MAX; i++) {
      out += '<span class="diya' + (i < n ? ' lit' : '') + '">' + A.icon('diya') + '</span>';
    }
    return out + '</span>';
  }

  function renderStrips() {
    const st = g.state;
    const topLabel = 'Chandravansh · ' + (st.config.mode === 'ai' ? oppName(st) : 'Commander 2');
    const botLabel = 'Suryavansh · ' + (st.config.mode === 'ai' ? (AC.app.profile ? AC.app.profile.name : 'You') : 'Commander 1');

    $('#strip-top').className = 'player-strip' + (st.phase === 'battle' && st.owner === 2 ? ' active-void' : '');
    $('#strip-bottom').className = 'player-strip' + (st.phase === 'battle' && st.owner === 1 ? ' active-solar' : '') +
      (st.phase === 'deploy1' ? ' active-solar' : '');

    $('#strip-top').innerHTML = A.banner(2) +
      '<span class="strip-name" style="color:var(--void)">' + esc(topLabel) + '</span>' +
      '<span class="strip-count">' + aliveCount(2) + '/' + E.rosterOf(st, 2).length + '</span>' + diyas(2) + captureTray(2);
    $('#strip-bottom').innerHTML = A.banner(1) +
      '<span class="strip-name" style="color:var(--solar)">' + esc(botLabel) + '</span>' +
      '<span class="strip-count">' + aliveCount(1) + '/' + E.rosterOf(st, 1).length + '</span>' + diyas(1) + captureTray(1);
  }

  function captureTray(victimOwner) {
    const byOther = victimOwner === 2 ? 1 : 2;
    const dead = g.state.captured[byOther] || [];
    if (!dead.length) return '<span class="capture-tray"><span class="tray-empty">no losses</span></span>';
    return '<span class="capture-tray">' + dead.map(function (d) {
      const cls = d.owner === 1 ? 'solar' : 'void';
      return '<span class="capture-chip ' + cls + '" title="' + esc(d.name) + '">' + A.emblem(d.key, '', d.owner) +
        '<span class="cap-rank">' + esc(d.badge) + '</span></span>';
    }).join('') + '</span>';
  }

  /* ── the board ─────────────────────────────────────────────── */

  function visibleToViewer(u) {
    if (!u) return false;
    const st = g.state;
    return st.viewer === 3 || u.owner === st.viewer || u.revealed;
  }

  function shapeSvg(cell, withTexture) {
    const geo = function (cls) {
      if (cell.shape === 'hub') return '<circle class="' + cls + '" cx="0" cy="0" r="' + cell.r + '"/>';
      if (cell.shape === 'sector') return '<path class="' + cls + '" d="' + cell.path + '"/>';
      return '<polygon class="' + cls + '" points="' + cell.points.map(function (p) {
        return p[0].toFixed(2) + ',' + p[1].toFixed(2);
      }).join(' ') + '"/>';
    };
    return geo('cell-fill') + (withTexture ? geo('cell-tex') : '');
  }

  function statusMarks(u, R) {
    let out = '';
    if (u.stun > 0) {
      out += '<g class="tok-trance"><circle r="' + (R * 1.12) + '"/>' +
        '<path d="M0 ' + (-R * 0.95) + ' A' + (R * 0.95) + ' ' + (R * 0.95) + ' 0 1 1 ' + (-R * 0.6) + ' ' + (R * 0.74) + '"/></g>' +
        (u.stun <= 9 ? '<text class="tok-stun" x="' + (-R * 0.62) + '" y="' + (-R * 0.5) + '" font-size="' + (R * 0.5) + '" text-anchor="middle">' + u.stun + '</text>' : '');
    }
    if (u.key === 'F' && u.breached) {
      out += '<g class="tok-crack"><path d="M' + (-R * 0.2) + ' ' + (-R * 0.9) + ' L' + (R * 0.08) + ' ' + (-R * 0.3) + ' L' + (-R * 0.16) + ' ' + (R * 0.1) +
        ' L' + (R * 0.22) + ' ' + (R * 0.85) + '"/><circle r="' + (R * 1.1) + '"/></g>';
    }
    return out;
  }

  /* Rang · Pata: what the painted field remembers between redraws. View only —
     nothing here touches the rules, and a loaded game starts with a clean cloth.
     · a hidden enemy that becomes known floods with colour once (and a short
       ravanhatta sting plays)
     · a piece that falls leaves its army's banner on the cell where it stood */
  const REVEAL_MS = 900;
  function pataMemory(st, viewer) {
    if (!g.pataMem || g.pataMem.state !== st) g.pataMem = { state: st, viewer: viewer, prev: null, at: {}, fallen: {} };
    const mem = g.pataMem;
    const now = {};
    Object.keys(st.board).forEach(function (id) {
      const u = st.board[id];
      if (u) now[u.id] = { cell: id, owner: u.owner, hidden: !visibleToViewer(u) };
    });
    let revealed = false;
    const live = st.phase === 'battle' && mem.viewer === viewer;
    if (mem.prev && live) {
      Object.keys(mem.prev).forEach(function (uid) {
        const was = mem.prev[uid];
        const is = now[uid];
        if (!is) mem.fallen[was.cell] = was.owner;            // fell here: the last to fall marks the cell
        else if (was.hidden && !is.hidden) { mem.at[uid] = Date.now(); revealed = true; }
      });
    }
    mem.prev = now;
    mem.viewer = viewer;
    return { mem: mem, revealed: revealed };
  }

  /* Sanjaya's Scroll: the moments worth painting, kept as the battle goes */
  function noteMoment(st, ev) {
    if (!st || ['clash', 'breach', 'astra', 'core'].indexOf(ev.kind) === -1) return;
    if (g.momentsState !== st) { g.momentsState = st; g.moments = []; }
    const copy = function (u) { return u ? { key: u.key, owner: u.owner, name: u.name } : null; };
    const m = { seq: g.moments.length, kind: ev.kind, round: st.turn, hour: E.hourOf ? E.hourOf(st) : null,
      att: copy(ev.unit), def: copy(ev.target), outcome: ev.outcome, astra: ev.astra, owner: ev.owner };
    m.fallen = ev.outcome === 'att' ? m.def : ev.outcome === 'def' ? m.att : ev.outcome === 'both' ? m.def : null;
    if (g.moments.length < 120) g.moments.push(m);
  }
  function openScroll(st, outcome, title) {
    if (!AC.scroll || !g.moments || g.momentsState !== st || !g.moments.length) return;
    const b = L.board(st.boardKey) || U.BOARDS.wheel;
    const when = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    AC.scroll.make({
      moments: g.moments, outcome: outcome, result: title,
      title: b.label + ' · vs ' + oppName(st), sub: when + ' · ' + st.turn + ' rounds'
    }).then(function (res) {
      AC.ui.modal({
        kicker: 'Sanjaya ka pat',
        title: 'The battle, as Sanjaya painted it',
        body: '<img class="scroll-preview" src="' + res.url + '" alt="Sanjaya\'s Scroll: ' + res.panels + ' painted moments of this battle">',
        actions: [
          { label: 'Close', cls: 'btn-ghost' },
          { label: tr('result.share', 'Share'), cls: 'btn-primary', icon: 'share', close: false,
            onClick: function () { AC.scroll.share(res, shareLine(st, outcome)).then(function (how) {
              if (how === 'saved') FX.toast('Saved as vyuha-sanjaya-scroll.png', 'info'); }); } }
        ]
      });
    });
  }

  /* Charcoal notes: long-press (or right-click) a hidden enemy to pencil a guess.
     View only, per battle and per viewer; a note wipes itself when the rank is seen. */
  function notesFor(st, viewer) {
    if (!g.notes || g.notes.state !== st) g.notes = { state: st, by: {} };
    if (!g.notes.by[viewer]) g.notes.by[viewer] = {};
    return g.notes.by[viewer];
  }
  function openNote(uid) {
    const st = g.state;
    if (!st || st.phase !== 'battle') return;
    const u = Object.values(st.board).find(function (x) { return x && x.id === uid; });
    if (!u || visibleToViewer(u)) return;
    const notes = notesFor(st, viewerOf(st));
    const keys = ['10', '9', '7', '6', '5', '3', '2', '1', 'B', 'F'];
    const m = AC.ui.modal({
      kicker: 'Charcoal note',
      title: 'What do you think it is?',
      body: '<p class="fineprint">Only you see this mark. It wipes itself when the rank is revealed.</p>' +
        '<div class="note-grid">' + keys.map(function (k) {
          const def = L.unit(k);
          return '<button class="note-pick' + (notes[uid] === k ? ' on' : '') + '" data-note="' + k + '">' + A.emblem(k, '', u.owner) +
            '<span>' + esc(def.badge || k) + ' · ' + esc(def.name) + '</span></button>';
        }).join('') + '</div>',
      actions: [{ label: 'Clear the mark', cls: 'btn-ghost', onClick: function () { delete notes[uid]; renderBoard(); } }]
    });
    m.el.addEventListener('click', function (e) {
      const b = e.target.closest('[data-note]');
      if (!b) return;
      notes[uid] = b.getAttribute('data-note');
      sfx('ui');
      m.close();
      renderBoard();
    });
  }

  /* The rank on a token: a solid seal on the lower right, large enough to read
   * on a phone without the painting underneath fighting it. */
  function rankBadge(text, R) {
    const r = R * 0.4;
    const cx = R * 0.66;
    const cy = R * 0.66;
    const t = String(text);
    return '<g class="tok-badge">' +
      '<circle class="tok-seal" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>' +
      '<text class="tok-rank" x="' + cx + '" y="' + (cy + r * 0.38) + '" font-size="' + (r * (t.length > 1 ? 1.0 : 1.18)) +
      '" text-anchor="middle">' + esc(t) + '</text></g>';
  }

  /* Under every token: a soft ground shadow (a plain circle — no SVG filter, so
   * it costs nothing to paint). The rim is drawn in proportion to the token, so
   * the army reads at any size: rays for Surya, a solid ring for Chandra. */
  function tokenBase(R, owner, lifted) {
    const painted = A.getSkin() === 'pata' || A.getSkin() === 'pahari';
    const rim = painted
      ? ' style="stroke-width:' + (R * 0.2).toFixed(4) + (owner === 1 ? ';stroke-dasharray:' + (R * 0.34).toFixed(4) + ' ' + (R * 0.16).toFixed(4) : '') + '"'
      : '';
    return '<circle class="tok-shadow" cx="' + (R * 0.05) + '" cy="' + (R * (lifted ? 0.34 : 0.13)) + '" r="' + (R * (lifted ? 1.06 : 1.02)) + '"/>' +
      '<circle class="tok-disc" r="' + R + '"' + rim + '/>';
  }

  function tokenSvg(u, cell, isSel) {
    const R = cell.tr;
    const cls = u.owner === 1 ? 'solar' : 'void';
    const moved = u.hasMoved ? '<circle class="tok-moved" cx="' + (-R * 0.62) + '" cy="' + (R * 0.62) + '" r="' + (R * 0.14) + '"/>' : '';
    const extra = (u.stun > 0 ? ' entranced' : '') + (u.key === 'F' && u.breached ? ' breached' : '');
    if (!visibleToViewer(u)) {
      // Rang preview skins: every hidden enemy is the same bare ink sketch
      const back = A.figuresOn() ? null : A.artFor('faction:' + u.owner);
      const face = A.figuresOn() ? A.tokenInner('?', R, u.owner) : back
        ? '<image class="tok-crest" href="' + back + '" x="' + (-R * 0.74) + '" y="' + (-R * 0.74) + '" width="' + (R * 1.48) +
          '" height="' + (R * 1.48) + '" opacity="0.95" preserveAspectRatio="xMidYMid meet"/>' +
rankBadge('?', R)
        : '<text class="tok-q" y="' + (R * 0.33) + '" font-size="' + (R * 0.92) + '" text-anchor="middle">?</text>';
      const guess = g.notes && g.notes.state === g.state && g.notes.by[viewerOf(g.state)] ? g.notes.by[viewerOf(g.state)][u.id] : null;
      const note = guess
        ? '<g class="tok-note">' + (A.paintedPiece(guess, u.owner)
            ? '<image class="tok-note-art" href="' + A.paintedPiece(guess, u.owner) + '" x="' + (-R * 0.86) + '" y="' + (-R * 0.9) + '" width="' + (R * 1.72) + '" height="' + (R * 1.72) + '" preserveAspectRatio="xMidYMid meet"/>'
            : '') +
          '<text class="tok-note-rank" x="' + (-R * 0.5) + '" y="' + (R * 0.78) + '" font-size="' + (R * 0.5) + '" text-anchor="middle">' + esc((L.unit(guess).badge || guess)) + '?</text></g>'
        : '';
      return '<g class="token hidden-unit ' + cls + extra + (guess ? ' noted' : '') + '" data-uid="' + u.id + '" transform="translate(' + cell.x + ',' + cell.y + ')">' +
        tokenBase(R, u.owner, false) + face + (A.figuresOn() && !guess ? rankBadge('?', R) : '') + note + moved + statusMarks(u, R) + '</g>';
    }
    const sel = isSel ? '<circle class="sel-ring" r="' + (R * 1.14) + '"/>' : '';
    const revealT = g.pataMem && g.pataMem.at[u.id] ? Date.now() - g.pataMem.at[u.id] : Infinity;
    const flood = revealT < REVEAL_MS ? ' just-revealed" style="--reveal-delay:' + (-revealT) + 'ms' : '';
    const eye = (u.revealed && u.owner === g.state.viewer && g.state.phase !== 'over')
      ? '<circle class="tok-eye" cx="' + (R * 0.6) + '" cy="' + (-R * 0.6) + '" r="' + (R * 0.15) + '"/>' : '';
    return '<g class="token ' + cls + extra + (isSel ? ' selected-token' : '') + (u.shieldBroken ? ' shield-broken' : '') + flood +
      '" data-uid="' + u.id + '" transform="translate(' + cell.x + ',' + cell.y + ')' +
      // the chosen piece rises off the cloth (static: no animation)
      (isSel ? ' translate(0,' + (-R * 0.14).toFixed(4) + ') scale(1.12)' : '') + '">' +
      tokenBase(R, u.owner, isSel) +
      sel +
      A.tokenInner(u.key, R, u.owner, u.breached) +
      rankBadge(u.badge, R) +
      moved + eye + statusMarks(u, R) + '</g>';
  }

  function targetMarker(type, R) {
    if (type === 'move') return '<circle class="target-dot" r="' + (R * 0.3) + '"/>';
    const glyph = type === 'attack' ? '×' : type === 'scan' ? '◉' : type === 'astra' ? '✦' : '⌖';
    return '<circle class="target-ring" r="' + (R * 1.0) + '"/>' +
      '<text class="target-glyph" y="' + (R * 0.34) + '" font-size="' + (R * 1.05) + '" text-anchor="middle">' + glyph + '</text>';
  }

  /* Odds in plain words (first-session clarity, 7 Nov 2026). The board says
   * the verdict; the percentage stays as detail in the rail and in Intel. */
  const VERDICT = {
    likely_win: 'Likely win', uncertain: 'Uncertain', likely_loss: 'Likely loss',
    sure_win: 'Certain win', sure_loss: 'Certain loss', both: 'Both fall',
    core: 'Takes the fort', breach: 'Breaks the gate', noop: 'No effect'
  };
  function verdictWord(v) { return tr('odds.' + v.key, VERDICT[v.key]); }
  function verdictNote(v, revealed) {
    if (!v.certain) return tr('odds.note_hidden', 'Based on enemy ranks you can’t see yet.');
    return revealed
      ? tr('odds.note_known', 'Both ranks are known, so the result is certain.')
      : tr('odds.note_any', 'Whatever its hidden rank, this is the result.');
  }

  /* A small tag above a strike target: the verdict for this blow. */
  function oddsTag(cell, odds, armed) {
    const v = E.strikeVerdict(odds);
    if (!v) return '';
    const R = cell.tr;
    const label = verdictWord(v);
    const h = R * (armed ? 0.74 : 0.62);
    const fs = h * 0.56;
    const w = Math.max(R * 1.7, label.length * fs * 0.56 + h * 0.9);
    const y = cell.y - R * 1.6;
    return '<g class="odds-tag ' + v.tone + (armed ? ' armed' : '') + '" transform="translate(' + cell.x + ',' + y + ')">' +
      '<rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="' + (h / 2) + '"/>' +
      '<text y="' + (h * 0.18) + '" font-size="' + fs + '" text-anchor="middle">' + esc(label) + '</text></g>';
  }

  /* The confirm step: what will happen, in words, with Confirm and Cancel. */
  function strikeCard(st, selUnit) {
    const target = st.board[g.armed];
    if (!target) return null;
    const viewer = viewerOf(st);
    const isBarrage = g.mode === 'special' && L.unit(selUnit.key).hasRanged;
    const odds = E.strikeOdds(st, viewer, g.sel, g.armed, isBarrage);
    const v = E.strikeVerdict(odds);
    if (!v) return null;
    const who = target.revealed ? target.name + ' · ' + target.badge : tr('odds.unknown', 'hidden enemy');
    const detail = v.certain ? '' : ' · ' + tr('odds.chance', 'chance to win') + ' ' + v.pct + '%';
    const info = '<span class="sel-badge ' + (selUnit.owner === 1 ? 'solar' : 'void') + '">' + A.emblem(selUnit.key, '', selUnit.owner) +
        '<span class="sel-rank">' + esc(selUnit.badge) + '</span></span>' +
      '<span class="sel-text"><span class="sel-name">' + esc((isBarrage ? tr('confirm.volley_on', 'Volley on') : tr('confirm.strike_on', 'Strike')) + ' ' + who) + '</span>' +
      '<span class="verdict ' + v.tone + '">' + esc(verdictWord(v)) + '</span>' +
      '<span class="sel-desc">' + esc(verdictNote(v, target.revealed) + detail) + '</span></span>';
    const buttons = '<button class="btn btn-primary confirm-btn" data-act="confirm">' + A.icon('sword') + esc(isBarrage ? tr('confirm.volley', 'Confirm volley') : tr('confirm.strike', 'Confirm strike')) + '</button>' +
      '<button class="mode-btn" data-act="cancel-strike">' + A.icon('close') + esc(tr('confirm.cancel', 'Cancel')) + '</button>';
    return { info: info, buttons: buttons };
  }

  function currentTargets() {
    const st = g.state;
    const out = {};
    if (st.phase !== 'battle' || g.thinking) return out;
    if (g.mode === 'astra' && g.astra) {
      if (g.astra === 'vayavya' && !g.astraFirst) {
        E.astraTargets(st, st.owner, 'vayavya').forEach(function (id) { out[id] = 'pick'; });
      } else {
        E.astraTargets(st, st.owner, g.astra, g.astraFirst).forEach(function (id) { out[id] = 'astra'; });
      }
      return out;
    }
    if (g.sel) {
      E.computeValidTargets(st, g.sel, g.mode).forEach(function (t) { out[t.id] = t.type; });
    }
    return out;
  }

  /* ── the wheel turn, made visible (review plan step 3, 7 Nov 2026) ──
   * One round before the inner rings turn, every piece they will carry gets a
   * dashed ring where it will land and a short arrow along the ring. After the
   * turn, what it carried keeps a gold ring for that round, solid where a
   * hidden rank was exposed. All static: no animation, nothing loops. */
  function turnSoon(st) {
    return st.phase === 'battle' && E.hasRotation(st) && E.turnsUntilRotation(st) === 1 && !modeHook('noGhost');
  }
  function ringName() { return board().kind === 'hex' ? 'lotus' : 'chakra'; }

  function ghostLayer(st, b) {
    if (!turnSoon(st)) return '';
    const viewer = viewerOf(st);
    let out = '<g class="turn-ghosts" aria-hidden="true">';
    E.rotationPreview(st).forEach(function (p) {
      const a = b.byId[p.from], c = b.byId[p.to];
      if (!a || !c) return;
      const side = p.owner === viewer ? 'mine' : 'theirs';
      const R = c.tr;
      let path;
      if (b.kind === 'wheel') {
        // along the ring, from the edge of the piece to the edge of its landing ring
        const r = Math.hypot(a.x, a.y);
        const a0 = Math.atan2(a.y, a.x), a1raw = Math.atan2(c.y, c.x);
        let d = a1raw - a0;
        while (d <= 0) d += Math.PI * 2;
        const trim = (a.tr * 1.05) / r, trim1 = (R * 1.2) / r;
        const s0 = a0 + trim, s1 = a0 + d - trim1;
        if (s1 > s0) {
          path = 'M' + (Math.cos(s0) * r).toFixed(3) + ' ' + (Math.sin(s0) * r).toFixed(3) +
            ' A' + r.toFixed(3) + ' ' + r.toFixed(3) + ' 0 0 1 ' + (Math.cos(s1) * r).toFixed(3) + ' ' + (Math.sin(s1) * r).toFixed(3);
        }
      } else {
        const dx = c.x - a.x, dy = c.y - a.y, L = Math.hypot(dx, dy) || 1;
        const f0 = (a.tr * 1.05) / L, f1 = 1 - (R * 1.2) / L;
        if (f1 > f0) path = 'M' + (a.x + dx * f0).toFixed(3) + ' ' + (a.y + dy * f0).toFixed(3) + ' L' + (a.x + dx * f1).toFixed(3) + ' ' + (a.y + dy * f1).toFixed(3);
      }
      out += '<g class="turn-ghost ' + side + '">' +
        '<circle class="ghost-land" cx="' + c.x + '" cy="' + c.y + '" r="' + (R * 1.12).toFixed(3) + '" stroke-width="' + (R * 0.12).toFixed(3) + '"/>' +
        (path ? '<path class="ghost-arrow" d="' + path + '" stroke-width="' + (R * 0.14).toFixed(3) + '" marker-end="url(#ghost-head-' + side + ')"/>' : '') +
        '</g>';
    });
    return out + '</g>';
  }
  function ghostDefs() {
    const head = function (side) {
      return '<marker id="ghost-head-' + side + '" class="ghost-head ' + side + '" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse">' +
        '<path d="M0 0 L10 5 L0 10 z"/></marker>';
    };
    return '<defs>' + head('mine') + head('theirs') + '</defs>';
  }

  /* After the turn: which pieces it carried, and which ranks it exposed. */
  function noteRotation(st, events) {
    const ev = (events || []).filter(function (e) { return e.kind === 'rotate'; })[0];
    if (!ev) return;
    const ids = {}, fresh = {};
    (ev.carried || []).forEach(function (id) { const u = st.board[id]; if (u) ids[u.id] = true; });
    (ev.exposed || []).forEach(function (id) { const u = st.board[id]; if (u) fresh[u.id] = true; });
    g.exposed = { ids: ids, fresh: fresh, count: st.rotation.count, turn: st.turn };
  }
  function exposedNow(st) {
    const x = g.exposed;
    return x && st.phase === 'battle' && st.rotation && st.rotation.count === x.count && st.turn === x.turn ? x : null;
  }
  function exposedSummary(st) {
    const x = exposedNow(st);
    if (!x) return null;
    const viewer = viewerOf(st);
    let theirs = 0, mine = 0;
    E.forEachUnit(st, function (u) {
      if (!x.fresh[u.id]) return;
      if (u.owner === viewer) mine++; else theirs++;
    });
    return { theirs: theirs, mine: mine };
  }

  function turnRailText(st) {
    const x = exposedSummary(st);
    if (x && (x.theirs || x.mine)) {
      return esc(tr('turn.exposed', 'The ' + ringName() + ' turned. Gold cells: enemy ranks it exposed.') + ' ' +
        (x.theirs ? x.theirs + ' ' + tr('turn.exposed_theirs', 'enemy rank' + (x.theirs === 1 ? '' : 's') + ' now showing.') : '') +
        (x.mine ? ' ' + x.mine + ' ' + tr('turn.exposed_mine', 'of yours exposed (dashed).') : ''));
    }
    if (turnSoon(st)) return esc(tr('turn.soon', 'The ' + ringName() + ' turns after this round: dashed rings show where each piece will be carried.'));
    return tr('battle.tap_hint', 'Tap a piece, then a glowing cell. Or invoke an astra.');
  }

  function warnTurn(st) {
    if (!turnSoon(st) || g.warnedAt === st.turn) return;
    g.warnedAt = st.turn;
    FX.toast(tr('turn.warn', 'The ' + ringName() + ' turns after this round. Dashed rings show where it will carry each piece.'), 'warn');
  }

  /* line the painted field up with its cells, turned a quarter along with them when the field is sideways */
  function placeField(img, b, st) {
    const src = b.src || b;
    const box = (A.PATA_FIELD_BOX && A.PATA_FIELD_BOX[st.boardKey]) || { x: src.bounds.x, y: src.bounds.y, w: src.bounds.w, h: src.bounds.h, cover: true };
    let cx = box.x + box.w / 2, cy = box.y + box.h / 2;
    if (b.turned) {
      const bd = src.bounds, X0 = bd.x + bd.w / 2, Y0 = bd.y + bd.h / 2;
      const nx = X0 - (cy - Y0), ny = Y0 + (cx - X0);
      cx = nx; cy = ny;
      img.setAttribute('transform', 'rotate(90 ' + cx.toFixed(4) + ' ' + cy.toFixed(4) + ')');
    } else {
      img.removeAttribute('transform');
    }
    img.setAttribute('x', cx - box.w / 2); img.setAttribute('y', cy - box.h / 2);
    img.setAttribute('width', box.w); img.setAttribute('height', box.h);
    img.setAttribute('preserveAspectRatio', box.cover ? 'xMidYMid slice' : (box.stretch ? 'none' : 'xMidYMid meet'));
    img.setAttribute('data-turned', b.turned ? '1' : '0');
  }

  function renderBoard() {
    const st = g.state;
    const svg = $('#board');
    if (!svg) return;
    const b = board();
    const bounds = b.bounds;
    svg.setAttribute('viewBox', bounds.x + ' ' + bounds.y + ' ' + bounds.w + ' ' + bounds.h);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    // the landscape layout sizes the field from this alone, never from the rails' content
    document.documentElement.style.setProperty('--board-aspect', (bounds.w / bounds.h).toFixed(4));

    // the field takes the colour of the hour
    const shell = $('#board-shell');
    A.artFor('ui:day'); A.artFor('ui:night'); A.artFor('ui:sanjaya');
    if (shell) {
      const hour = st.phase === 'battle' ? E.hourOf(st) : null;
      shell.classList.toggle('sky-day', hour === 'day');
      shell.classList.toggle('sky-night', hour === 'night');
      shell.classList.toggle('astra-mode', g.mode === 'astra');
      // a painted sky behind the field, when the art exists (docs/prompts/ART.md)
      const skyArt = hour && !A.figuresOn() ? A.artFor('sky:' + hour) : null;
      shell.style.backgroundImage = skyArt
        ? 'linear-gradient(180deg, rgba(6,5,10,.45), rgba(6,5,10,.72)), url("' + skyArt + '")'
        : '';
      shell.setAttribute('data-astra', g.mode === 'astra' && g.astra ? g.astra : '');
    }

    const targets = currentTargets();
    const viewer = viewerOf(st);
    const deployOwner = st.phase === 'deploy1' ? 1 : st.phase === 'deploy2' ? 2 : 0;
    const last = st.lastMove;
    let out = '';
    let tags = '';

    const tex = A.getSkin() === 'bronze' || A.getSkin() === 'bright' ? A.artFor('board:' + st.boardKey) : null;
    if (tex) {
      out += '<defs><pattern id="af-tex" patternUnits="userSpaceOnUse" patternContentUnits="objectBoundingBox" ' +
        'x="0" y="0" width="1.15" height="1.15">' +
        '<image href="' + tex + '" width="1" height="1" preserveAspectRatio="xMidYMid slice"/></pattern></defs>';
    }

    // Rang · Pata: the painted wheel under the cells. Its open field (0.29–0.73 of
    // the painting's radius) is set so the red rim meets the outer ring at 1.60.
    const fieldHour = st.phase === 'battle' && E.hourOf(st) === 'night' ? 'night' : 'day';
    // the wheel's painting is chakra-*; every other field is <board key>-* once it is listed in A.PATA_FIELDS
    const fieldName = b.kind === 'wheel' ? 'chakra' : (A.PATA_FIELDS && A.PATA_FIELDS.indexOf(st.boardKey) !== -1 ? st.boardKey : null);
    const field = fieldName ? A.pataArt('fields/' + fieldName + '-' + fieldHour) : null;
    if (shell) shell.classList.toggle('has-field', !!field);
    // (the painting is a kept node, added after the commit below: re-creating a
    // 1254 px image on every redraw cost the phone ~15 extra paints a second)

    const pataOn = A.getSkin() === 'pata';
    const memo = pataOn ? pataMemory(st, viewer) : null;
    if (memo && memo.revealed) setTimeout(function () { AU.play('reveal'); }, 320);
    if (st.phase === 'battle' && st.turn >= 2 && !settings().noteHinted && !g.noteHintQueued) {
      // once per player, after the opening: settings are written outside this render
      g.noteHintQueued = true;
      setTimeout(function () {
        AC.ui.patchSettings({ noteHinted: true });
        FX.toast('Tip: hold a hidden enemy to pencil your guess on it.', 'info');
      }, 1200);
    }
    const bannerArt = pataOn ? { 1: A.pataArt('pieces/surya-banner'), 2: A.pataArt('pieces/chandra-banner') } : null;

    // the yantra frame: rings, ticks and kolam dots around the chakra
    if ((b.kind === 'wheel' || b.kind === 'hex') && !field) {
      const R0 = Math.min(bounds.w, bounds.h) / 2 - (b.kind === 'hex' ? 0.12 : 0.05);
      const cx = bounds.x + bounds.w / 2;
      const cy = bounds.y + bounds.h / 2;
      const n = b.kind === 'hex' ? 6 : 12;
      let y = '<g class="yantra" aria-hidden="true" transform="translate(' + cx.toFixed(3) + ',' + cy.toFixed(3) + ')">';
      [1.02, 1.07, 1.14].forEach(function (f) {
        y += '<circle cx="0" cy="0" r="' + (R0 * f).toFixed(3) + '"/>';
      });
      for (let i = 0; i < n * 2; i++) {
        const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
        const long = i % 2 === 0;
        y += '<line x1="' + (Math.cos(a) * R0 * 1.02).toFixed(3) + '" y1="' + (Math.sin(a) * R0 * 1.02).toFixed(3) +
          '" x2="' + (Math.cos(a) * R0 * (long ? 1.07 : 1.045)).toFixed(3) + '" y2="' + (Math.sin(a) * R0 * (long ? 1.07 : 1.045)).toFixed(3) + '"/>';
        if (long) {
          y += '<circle class="dot" cx="' + (Math.cos(a) * R0 * 1.105).toFixed(3) + '" cy="' +
            (Math.sin(a) * R0 * 1.105).toFixed(3) + '" r="' + (R0 * 0.012).toFixed(3) + '"/>';
        }
      }
      y += '</g>';
      out += y;
    }
    const rings = { 1: '', 2: '' };

    b.cells.forEach(function (cell) {
      const id = cell.id;
      const u = st.board[id] || null;
      const rift = E.isRift(st, id);
      const isSel = g.sel === id || g.astraFirst === id;
      const isFocus = g.focus === id;
      const target = targets[id];
      const inZone = deployOwner && cell.zone === deployOwner;
      const isLast = last && (last.from === id || last.to === id);

      let cls = 'cell';
      if (cell.shape === 'hub' || (b.kind === 'hex' && cell.ring === 0)) cls += ' hub';
      if (rift) cls += ' rift';
      if (inZone) cls += ' zone-' + deployOwner;
      if (isSel) cls += ' selected';
      if (isFocus && !isSel) cls += ' hint';
      if (isLast) cls += ' last-move';
      if (g.logMark && g.logMark.indexOf(id) !== -1) cls += ' log-mark';
      if (target) cls += ' target-' + target;
      if (target === 'astra' || target === 'pick') cls += ' astra-' + g.astra;
      if (g.armed === id) cls += ' armed';
      const exp = u ? exposedNow(st) : null;
      // enemy ranks the turn just exposed: solid gold; your own exposed pieces: a thin dashed ring
      if (exp && exp.fresh[u.id]) cls += u.owner === viewer ? ' exposed' : ' exposed exposed-new';

      const label = rift ? 'rift'
        : u ? (visibleToViewer(u) ? u.name + ', rank ' + u.badge : 'unknown enemy piece')
          : 'empty cell';

      let hubArt = '';
      if (cell.shape === 'hub') {
        const icon = A.artFor('app');
        if (icon) {
          hubArt = '<image href="' + icon + '" x="' + (-cell.r * 0.72) + '" y="' + (-cell.r * 0.72) +
            '" width="' + (cell.r * 1.44) + '" height="' + (cell.r * 1.44) + '" opacity="1" preserveAspectRatio="xMidYMid meet"/>';
        }
      }
      const markerType = target === 'pick' ? 'astra' : target;
      const markup = '<g class="' + cls + '" data-id="' + id + '" tabindex="0" role="gridcell" aria-label="' + esc(cellText(id) + ', ' + label) + '">' +
        shapeSvg(cell, !!tex) + hubArt +
        (memo && memo.mem.fallen[id] && bannerArt[memo.mem.fallen[id]]
          ? '<image class="pata-banner" href="' + bannerArt[memo.mem.fallen[id]] + '" x="' + (cell.x - cell.tr * 1.25) + '" y="' + (cell.y - cell.tr * 1.25) +
            '" width="' + (cell.tr * 2.5) + '" height="' + (cell.tr * 2.5) + '" preserveAspectRatio="xMidYMid meet"/>' : '') +
        (u ? tokenSvg(u, cell, isSel) : '') +
        (markerType && (markerType !== 'move' || !u) ? '<g transform="translate(' + cell.x + ',' + cell.y + ')">' + targetMarker(markerType, cell.tr) + '</g>' : '') +
        '</g>';
      if (cell.ring === 1 || cell.ring === 2) rings[cell.ring] += markup;
      else out += markup;

      // odds over every strike target
      if (g.sel && u && (target === 'attack' || target === 'barrage') && u.owner !== st.owner) {
        tags += oddsTag(cell, E.strikeOdds(st, viewer, g.sel, id, target === 'barrage'), g.armed === id);
      } else if (g.armed === id && (target === 'astra')) {
        const R = cell.tr;
        tags += '<g class="odds-tag even armed" transform="translate(' + cell.x + ',' + (cell.y - R * 1.55) + ')">' +
          '<rect x="' + (-R * 1.6) + '" y="' + (-R * 0.31) + '" width="' + (R * 3.2) + '" height="' + (R * 0.62) + '" rx="' + (R * 0.31) + '"/>' +
          '<text y="' + (R * 0.11) + '" font-size="' + (R * 0.35) + '" text-anchor="middle">' + esc(tr('confirm.target', 'Target')) + '</text></g>';
      }
    });
    // the inner rings live in their own groups so the wheel can turn
    if (rings[2]) out += '<g class="ring ring-2">' + rings[2] + '</g>';
    if (rings[1]) out += '<g class="ring ring-1">' + rings[1] + '</g>';
    const ghosts = ghostLayer(st, b);
    if (ghosts) out += ghostDefs() + ghosts;

    // formation links from the last clash: the jaws, the petals
    if (g.links && Date.now() < g.links.until) {
      out += '<g class="' + (g.calmActive ? 'calm-links' : '') + '">';
      const to = b.byId[g.links.to];
      if (to) {
        const pathLength = g.calmActive ? ' pathLength="1"' : '';
        (g.links.jaws || []).forEach(function (j) {
          const c = b.byId[j];
          if (c) out += '<line class="vyuha-link jaws"' + pathLength + ' x1="' + c.x + '" y1="' + c.y + '" x2="' + to.x + '" y2="' + to.y + '"/>';
        });
        (g.links.petals || []).forEach(function (j) {
          const c = b.byId[j];
          if (c) out += '<line class="vyuha-link petals"' + pathLength + ' x1="' + c.x + '" y1="' + c.y + '" x2="' + to.x + '" y2="' + to.y + '"/>';
        });
      }
      out += '</g>';
    }
    out += tags;

    (b.labels || []).forEach(function (l) {
      if (settings().coordinates === false) return;
      out += '<text class="coord" x="' + l.x + '" y="' + l.y + '" font-size="0.3" text-anchor="' + (l.anchor || 'middle') +
        '" dominant-baseline="' + (l.baseline || 'auto') + '">' + l.text + '</text>';
    });

    // Parse through an HTML <template>: the HTML parser understands SVG
    // foreign content, creates the right namespace, and tolerates the repeated
    // presentation attributes our emblem art uses.
    const tpl = document.createElement('template');
    tpl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + out + '</svg>';
    const parsed = tpl.content.firstElementChild;
    let keep = svg.querySelector('image.pata-field:not(.field-out)');
    let fadeOut = null;
    if (keep && (!field || keep.getAttribute('href') !== field)) {
      // the sky turned: keep the old cloth for one fade over the new one
      if (field && st.phase === 'battle') fadeOut = keep;
      keep = null;
    }
    const fading = svg.querySelector('image.pata-field.field-out');
    Array.prototype.slice.call(svg.childNodes).forEach(function (n) { if (n !== keep && n !== fadeOut && n !== fading) svg.removeChild(n); });
    if (field && !keep) {
      keep = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      keep.setAttribute('class', 'pata-field');
      keep.setAttribute('href', field);
      if (b.kind === 'wheel') {
        // the painted wheel's open field (0.29–0.73 of its radius): the red rim meets the outer ring at 1.60
        const FH = 1.6 / 0.73;
        keep.setAttribute('x', -FH); keep.setAttribute('y', -FH);
        keep.setAttribute('width', 2 * FH); keep.setAttribute('height', 2 * FH);
        keep.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      } else {
        // the other fields are painted to the board's own shape (docs/prompts/PATA.md);
        // A.PATA_FIELD_BOX lines each painting up with its cells
        placeField(keep, b, st);
      }
      svg.insertBefore(keep, svg.firstChild);
    }
    if (fadeOut) {
      fadeOut.setAttribute('class', 'pata-field field-out');
      svg.insertBefore(fadeOut, keep.nextSibling);
      AU.play('sky');
      setTimeout(function () { if (fadeOut.parentNode) fadeOut.parentNode.removeChild(fadeOut); }, 1400);
    }
    if (keep && b.kind !== 'wheel' && keep.getAttribute('data-turned') !== (b.turned ? '1' : '0')) placeField(keep, b, st);
    const lastField = svg.querySelector('image.pata-field.field-out') || keep;
    const after = lastField ? lastField.nextSibling : null;
    if (parsed) {
      while (parsed.firstChild) svg.insertBefore(parsed.firstChild, after);
    }
  }

  /* ── action bar ────────────────────────────────────────────── */

  function astraButtons(owner) {
    const st = g.state;
    if (!E.rules(st).astras) return '';
    return '<span class="astra-row"><span class="astra-shakti">' + esc(tr('astra.shakti', 'Shakti')) + ' <b>' + st.shakti[owner] + '</b>/5</span>' +
      E.ASTRA_ORDER.map(function (key) {
      const def = L.astra(key);
      const used = st.astrasUsed[owner] && st.astrasUsed[owner][key];
      const ready = E.astraReady(st, owner, key);
      const cls = used ? 'spent' : ready ? 'ready' : 'locked';
      let pips = '';
      for (let i = 0; i < def.cost; i++) pips += '<i></i>';
      return '<button class="astra-btn ' + cls + ' el-' + def.element + '" data-astra="' + key + '"' +
        ' title="' + esc(def.name + ' — ' + def.one + ' Costs ' + def.cost + ' Shakti' + (used ? ' (used)' : '')) + '"' +
        ' aria-label="' + esc(def.name) + '"' + (used ? ' disabled' : '') + '>' +
        A.astraMark(key) + '<span class="astra-name">' + esc(def.name) + '</span><span class="astra-cost">' + pips + '</span></button>';
    }).join('') + '</span>';
  }

  function renderActionBar() {
    const st = g.state;
    const bar = $('#action-bar');
    if (!bar) return;

    if (st.phase === 'deploy1' || st.phase === 'deploy2') {
      const owner = st.phase === 'deploy1' ? 1 : 2;
      const formations = S.listFormations().filter(function (f) { return f.board === st.boardKey; });
      bar.innerHTML =
        '<div class="action-info">' +
          '<span class="sel-badge ' + (owner === 1 ? 'solar' : 'void') + '">' + A.icon('grid') + '</span>' +
          '<span class="sel-text"><span class="sel-name">' + U.FACTIONS[owner].name + ' · vyuha rachna</span>' +
          '<span class="sel-desc">Tap two cells in your ground to swap them. Presets are a starting point.</span></span>' +
        '</div>' +
        '<div class="action-buttons">' +
          presetBtn('citadel', 'Durg') + presetBtn('blitz', 'Aakraman') + presetBtn('lattice', 'Jaal') + presetBtn('shuffle', 'Shuffle') +
          (formations.length ? '<button class="mode-btn" data-formation="1">' + A.icon('folder') + 'Saved</button>' : '') +
          '<button class="mode-btn" data-deploy="save">' + A.icon('save') + 'Keep</button>' +
          '<button class="btn btn-primary btn-sm" data-deploy="lock">' + (st.phase === 'deploy1' && isPass() ? 'Lock &amp; pass' : tr('battle.lock', 'Lock formation')) + '</button>' +
        '</div>';
      return;
    }

    if (st.phase === 'over') {
      bar.innerHTML =
        '<div class="action-info"><span class="sel-text"><span class="sel-name">Match complete</span>' +
        '<span class="sel-desc">All ranks are revealed. Review the board, or fight again.</span></span></div>' +
        '<div class="action-buttons">' +
          '<button class="mode-btn" data-over="codex">' + A.icon('book') + esc(tr('home.codex', 'Rules')) + '</button>' +
          '<button class="mode-btn" data-over="home">' + A.icon('back') + 'Home</button>' +
          (modeHook('noRematch') ? '' : '<button class="btn btn-primary btn-sm" data-over="rematch">' + A.icon('refresh') + esc(tr('result.rematch', 'Rematch')) + '</button>') +
        '</div>';
      return;
    }

    const selUnit = g.sel ? st.board[g.sel] : null;
    const isHumanTurn = !g.thinking && !(g.calmActive && g.busy) && (isPass() || st.owner === 1);
    let info;
    let buttons = '';

    if (isHumanTurn && g.mode === 'astra' && g.astra) {
      const def = L.astra(g.astra);
      const hint = g.astra === 'vayavya'
        ? (g.armed ? 'These two pieces trade places.' : g.astraFirst ? 'Now tap the second piece to trade places with.' : 'Tap the first of your pieces to move.')
        : (g.armed ? def.one : 'Tap a glowing target within two cells of your army.');
      info = '<span class="sel-badge astra el-' + def.element + '">' + A.astraMark(g.astra) + '</span>' +
        '<span class="sel-text"><span class="sel-name">' + esc(def.name) + ' <span class="deva">' + esc(def.deva) + '</span></span>' +
        '<span class="sel-desc">' + esc(hint) + '</span></span>';
      buttons = (g.armed ? '<button class="btn btn-primary confirm-btn" data-act="confirm">' + A.astraMark(g.astra) + esc(tr('confirm.astra', 'Invoke') + ' ' + def.name) + '</button>' : '') +
        '<button class="mode-btn" data-act="cancel-astra">' + A.icon('close') + esc(tr('confirm.cancel', 'Cancel')) + '</button>';
      bar.innerHTML = '<div class="action-info' + (g.armed ? ' confirm-info' : '') + '">' + info + '</div>' +
        '<div class="action-buttons' + (g.armed ? ' confirm-buttons' : '') + '">' + buttons + '</div>';
      return;
    }

    const card = isHumanTurn && selUnit && g.armed ? strikeCard(st, selUnit) : null;
    if (card) {
      bar.innerHTML = '<div class="action-info confirm-info">' + card.info + '</div><div class="action-buttons confirm-buttons">' + card.buttons + '</div>';
      return;
    }

    if (selUnit) {
      const def = L.unit(selUnit.key);
      const trance = selUnit.stun > 0 ? ' Entranced for ' + selUnit.stun + ' more turn' + (selUnit.stun === 1 ? '' : 's') + '.' : '';
      info = '<span class="sel-badge ' + (selUnit.owner === 1 ? 'solar' : 'void') + '">' + A.emblem(selUnit.key, '', selUnit.owner) +
          '<span class="sel-rank">' + esc(selUnit.badge) + '</span></span>' +
        '<span class="sel-text"><span class="sel-name">' + esc(selUnit.name) + ' · rank ' + esc(selUnit.badge) + '</span>' +
        '<span class="sel-desc">' + esc(g.armed ? tr('battle.tap_again', 'Tap the target again to strike.') : def.desc + trance) + '</span></span>';
    } else {
      info = '<span class="sel-badge">' + A.icon('sword') + '</span>' +
        '<span class="sel-text"><span class="sel-name">' + (isHumanTurn ? tr('battle.your_move', 'Your move') : g.calmActive && g.busy && !g.thinking ? 'Watching the move' : 'Waiting') + '</span>' +
        '<span class="sel-desc">' + (isHumanTurn
          ? turnRailText(st)
          : g.calmActive && g.busy && !g.thinking ? 'Tap the board to continue.' : oppName(st) + ' is choosing a move.') + '</span></span>';
    }

    if (isHumanTurn) {
      if (selUnit) {
        buttons += '<button class="mode-btn' + (g.mode === 'move' ? ' on' : '') + '" data-mode="move">' + A.icon('sword') + esc(tr('battle.move_strike', 'Move / Strike')) + '</button>';
        const def = L.unit(selUnit.key);
        if (def.hasScan) buttons += '<button class="mode-btn special' + (g.mode === 'special' ? ' on' : '') + '" data-mode="special">' + A.icon('eye') + esc(tr('battle.look', 'Drishti')) + '</button>';
        if (def.hasRanged) buttons += '<button class="mode-btn special' + (g.mode === 'special' ? ' on' : '') + '" data-mode="special">' + A.icon('bolt') + esc(tr('battle.volley', 'Volley')) + '</button>';
        buttons += '<button class="mode-btn" data-act="deselect" aria-label="Deselect">' + A.icon('close') + '</button>';
      } else {
        buttons += astraButtons(st.owner);
      }
      buttons += '<button class="mode-btn" data-act="advisor">' + A.icon('brain') + esc(tr('battle.advisor', 'Advisor')) + '</button>';
    }
    bar.innerHTML = '<div class="action-info">' + info + '</div><div class="action-buttons">' + buttons + '</div>';
  }

  function presetBtn(key, label) {
    return '<button class="mode-btn" data-preset="' + key + '">' + label + '</button>';
  }

  /* ── intel ─────────────────────────────────────────────────── */

  function renderIntel() {
    const host = $('#intel-panel');
    if (!host) return;
    const st = g.state;
    if (st.viewer === 0) {
      host.innerHTML = '<div class="intel-head"><span class="intel-title">Intel</span></div>' +
        '<p class="intel-note">Sealed by the privacy curtain.</p>';
      return;
    }
    if (settings().showIntel === false || st.phase === 'over') {
      host.innerHTML = '<div class="intel-head"><span class="intel-title">Intel</span></div>' +
        '<p class="intel-note">' + (st.phase === 'over' ? 'The match is over — every rank is on the board.' : 'Intel panel is hidden in settings.') + '</p>';
      return;
    }

    const viewer = viewerOf(st);
    const foe = viewer === 1 ? 2 : 1;
    const pool = E.unknownPool(st, viewer);
    const unknowns = Object.keys(pool).filter(function (k) { return pool[k] > 0; });

    const known = [];
    const exposed = [];
    E.forEachUnit(st, function (u) {
      if (u.owner === foe && u.revealed) known.push(u);
      if (u.owner === viewer && u.revealed) exposed.push(u);
    });

    let html = '<div class="intel-head"><span class="intel-title">Intel</span>' +
      '<span class="chip chip-' + (viewer === 1 ? 'solar' : 'void') + '">' + U.FACTIONS[foe].short + '</span></div>';

    const odds = oddsBlock();
    if (odds) html += odds;

    // the hour, the formations, the strength
    if (st.phase === 'battle') {
      const hour = E.hourOf(st);
      if (hour) {
        const mine = E.hourOwner(st) === viewer;
        const left = E.roundsUntilHourTurns(st);
        html += '<div class="intel-section"><div class="intel-label">The sky</div>' +
          '<div class="intel-sky ' + hour + '">' + skyIcon(hour) + '<span><b>' + (hour === 'day' ? 'Dinman · दिनमान' : 'Ratri · रात्रि') + '</b>' +
          (mine ? 'Your hour: your strikes land at +1.' : 'Their hour: their strikes land at +1.') +
          ' Turns in ' + left + ' round' + (left === 1 ? '' : 's') + '.</span></div></div>';
      }
      if (E.rules(st).vyuha) {
        html += '<div class="intel-section"><div class="intel-label">Formations</div>' +
          '<p class="intel-note"><b>Makara</b> — strike a piece another of yours already touches: +1.<br><b>Padma</b> — a piece touched by two friends defends at +1.</p></div>';
      }
      if (E.rules(st).astras) {
        html += '<div class="intel-section"><div class="intel-label">Shakti</div>' +
          '<div class="odds-row"><span style="color:var(--solar)">' + U.FACTIONS[1].short + '</span>' +
          '<span class="odds-bar"><span style="width:' + (st.shakti[1] * 20) + '%;background:var(--solar)"></span></span><span class="odds-val">' + st.shakti[1] + '/5</span></div>' +
          '<div class="odds-row"><span style="color:var(--void)">' + U.FACTIONS[2].short + '</span>' +
          '<span class="odds-bar"><span style="width:' + (st.shakti[2] * 20) + '%;background:var(--void)"></span></span><span class="odds-val">' + st.shakti[2] + '/5</span></div>' +
          '<p class="intel-note">One per piece taken, one each time the sky turns.</p></div>';
      }
      const s1 = E.strengthOf(st, viewer);
      const s2 = E.strengthOf(st, foe);
      html += '<div class="intel-section"><div class="intel-label">Strength on the field (bala)</div>' +
        '<p class="intel-note">You <b style="color:var(--txt)">' + s1 + '</b> · They <b style="color:var(--txt)">' + s2 + '</b> — sum of ranks, +5 for a fort whose gate stands. It decides a ceasefire.</p></div>';
    }

    html += '<div class="intel-section"><div class="intel-label">Still hidden (' +
      unknowns.reduce(function (a, k) { return a + pool[k]; }, 0) + ' pieces)</div>' +
      '<div class="intel-chips">' +
      (unknowns.length
        ? unknowns.map(function (k) {
          return '<span class="intel-chip unknown" title="' + esc(L.unit(k).name) + '">' + A.emblem(k) +
            esc(L.unit(k).badge) + (pool[k] > 1 ? '×' + pool[k] : '') + '</span>';
        }).join('')
        : '<span class="intel-note">Every enemy piece is accounted for.</span>') +
      '</div></div>';

    if (known.length) {
      html += '<div class="intel-section"><div class="intel-label">Identified on the field</div><div class="intel-chips">' +
        known.map(function (u) {
          return '<span class="intel-chip" title="' + esc(L.unit(u.key).name) + '">' + A.emblem(u.key, '', u.owner) + esc(u.badge) + '</span>';
        }).join('') + '</div></div>';
    }
    if (exposed.length) {
      html += '<div class="intel-section"><div class="intel-label">Your exposed pieces</div><div class="intel-chips">' +
        exposed.map(function (u) {
          return '<span class="intel-chip" title="' + esc(L.unit(u.key).name) + '">' + A.emblem(u.key, '', u.owner) + esc(u.badge) + '</span>';
        }).join('') + '</div><p class="intel-note">These ranks are known to the enemy.</p></div>';
    }

    if (st.phase === 'battle') {
      const left = E.drawCountdown(st);
      const limit = st.config.drawAfter || 100;
      html += '<div class="intel-section"><div class="intel-label">Ceasefire clock</div>' +
        '<div class="odds-row"><span style="color:var(--dim)">Orders left</span>' +
        '<span class="odds-bar"><span style="width:' + Math.round((left / limit) * 100) + '%;background:' +
        (left <= 10 ? 'var(--void)' : 'linear-gradient(90deg,var(--solar),var(--green))') + '"></span></span>' +
        '<span class="odds-val">' + left + '</span></div>' +
        '<p class="intel-note">If no piece falls for ' + limit + ' orders, or the sun sets on round ' + capOf(st) + ', the stronger army holds the field.</p></div>';

      if (E.hasRotation(st)) {
        const until = E.turnsUntilRotation(st);
        html += '<div class="intel-section"><div class="intel-label">The ' + (board().kind === 'hex' ? 'lotus' : 'chakra') + '</div>' +
          '<p class="intel-note">The two inner rings turn one cell every 5 rounds, carrying whatever stands on them — and exposing it. Turns in <b style="color:var(--gold)">' +
          until + '</b>.</p></div>';
      }
    }

    html += '<div class="intel-section">' +
      '<button class="mode-btn" data-act="advisor" style="width:100%;justify-content:center">' + A.icon('brain') + 'Ask the advisor</button>' +
      '<p class="intel-note">Odds are averaged over every rank the enemy could still be hiding, and include the hour and the formations. A piece that has moved can no longer be a fort or a trap.</p>' +
      '</div>';

    host.innerHTML = html;
  }

  function capOf(st) {
    if (st.turnLimit) return st.turnLimit;
    if (st.config.roundCap) return st.config.roundCap;
    return (U.BOARDS[st.boardKey] && U.BOARDS[st.boardKey].roundCap) || 40;
  }

  function oddsBlock() {
    const st = g.state;
    const viewer = viewerOf(st);
    const selUnit = g.sel ? st.board[g.sel] : null;
    const focusId = g.armed || g.focus;
    const focus = focusId ? st.board[focusId] : null;
    if (!focus || focus.owner === viewer) return '';

    if (selUnit && selUnit.owner === viewer && g.mode !== 'astra') {
      // Divya-drishti is reconnaissance, not a strike. A focused enemy may
      // be out of scan range, so never present combat odds while in this mode.
      if (g.mode === 'special' && L.unit(selUnit.key).hasScan) {
        return '<div class="intel-section"><div class="intel-label">Divya-drishti · ' +
          (focus.revealed ? esc(focus.name) : 'unknown enemy') + '</div>' +
          '<div class="intel-note">Reveal without combat. Tap a marked enemy within two cells to scan; no piece is harmed.</div></div>';
      }
      const isBarrage = g.mode === 'special' && L.unit(selUnit.key).hasRanged;
      const o = E.strikeOdds(st, viewer, g.sel, focusId, isBarrage);
      if (!o) return '';
      const rows = [];
      if (o.core > 0.001) rows.push(['Take fort', o.core, 'var(--gold)']);
      if (o.breach > 0.001) rows.push(['Break gate', o.breach, 'var(--gold)']);
      if (o.win > 0.001) rows.push(['You win', o.win, 'var(--green)']);
      if (o.both > 0.001) rows.push(['Both fall', o.both, 'var(--gold)']);
      if (o.lose > 0.001) rows.push(['You lose', o.lose, 'var(--void)']);
      if (o.noop > 0.001) rows.push(['No effect', o.noop, 'var(--dim)']);
      const parts = (o.ctx.attParts || []).map(function (p) { return '+' + p.v + ' ' + p.key; })
        .concat((o.ctx.defParts || []).map(function (p) { return 'them +' + p.v + ' ' + p.key; }));
      const v = E.strikeVerdict(o);
      return '<div class="intel-section"><div class="intel-label">' + (isBarrage ? 'Volley odds' : 'Strike odds') +
        ' · ' + esc(selUnit.short) + ' → ' + (focus.revealed ? esc(focus.name) : 'unknown') + '</div>' +
        '<div class="intel-verdict"><span class="verdict ' + v.tone + '">' + esc(verdictWord(v)) + '</span> ' +
        esc(verdictNote(v, focus.revealed)) + '</div><div class="intel-odds">' +
        rows.map(function (r) {
          return '<div class="odds-row"><span style="color:' + r[2] + '">' + r[0] + '</span>' +
            '<span class="odds-bar"><span style="width:' + Math.round(r[1] * 100) + '%"></span></span>' +
            '<span class="odds-val">' + Math.round(r[1] * 100) + '%</span></div>';
        }).join('') + '</div>' +
        (parts.length ? '<div class="intel-note">Bonuses: ' + esc(parts.join(' · ')) + '</div>' : '') +
        (focus.revealed ? '' : '<div class="intel-note">It could be: ' + topBeliefs(st, viewer, focusId) + '</div>') +
        '</div>';
    }

    if (!focus.revealed) {
      const dist = E.beliefFor(st, viewer, focusId);
      if (!dist) return '';
      return '<div class="intel-section"><div class="intel-label">Tapped piece — what it could be</div>' +
        '<div class="intel-odds">' + Object.keys(dist).sort(function (a, b) { return dist[b] - dist[a]; })
          .slice(0, 4).map(function (k) {
            return '<div class="odds-row"><span>' + esc(L.unit(k).short) + '</span>' +
              '<span class="odds-bar"><span style="width:' + Math.round(dist[k] * 100) + '%"></span></span>' +
              '<span class="odds-val">' + Math.round(dist[k] * 100) + '%</span></div>';
          }).join('') + '</div></div>';
    }
    return '';
  }

  function topBeliefs(st, viewer, id) {
    const dist = E.beliefFor(st, viewer, id) || {};
    const ranked = Object.keys(dist).sort(function (a, b) { return dist[b] - dist[a]; }).slice(0, 3);
    if (!ranked.length) return '';
    return ranked.map(function (k) {
      return L.unit(k).short + ' ' + Math.round(dist[k] * 100) + '%';
    }).join(' · ');
  }

  /* ── battle log (review plan step 4) ──
   * Each entry is written from the viewer's side: "You" or "Enemy", the cells by name, your own
   * piece by name, an enemy piece only if it was visible when it acted. Entries with cells are
   * buttons: tapping one marks those cells on the field for a moment (no animation). */
  function cellText(id) {
    const n = id && G.cellName ? G.cellName(g.state.boardKey, id) : null;
    if (!n) return '';
    if (n.kind === 'square') return n.text;
    if (n.kind === 'hub') return board().kind === 'hex' ? tr('log.centre', 'centre') : tr('log.hub', 'hub');
    return tr('log.ring' + n.ring, ['', 'inner', 'middle', 'outer'][n.ring] || '') + ' ' + n.clock;
  }
  g.cellText = cellText;
  function pieceText(key) {
    const d = L.unit(key) || U.UNIT_DEFS[key];
    if (!d) return '';
    return d.name + (d.badge && /^\d+$/.test(d.badge) ? ' ' + d.badge : '');
  }
  function logLine(l, viewer) {
    const route = function (from, to) {
      const a = cellText(from), b = cellText(to);
      return a && b && a !== b ? a + ' → ' + b : (b || a);
    };
    const mine = l.who === viewer;
    let who = '', body = esc(l.text), where = '';
    if (l.who === 1 || l.who === 2) who = mine ? tr('log.you', 'You') : tr('log.enemy', 'Enemy');
    if (l.kind === 'move' && l.who) {
      const piece = mine || l.seen ? pieceText(l.piece) : tr('log.hidden', 'hidden piece');
      body = '<b>' + esc(piece) + '</b> ' + esc(route(l.from, l.at));
    } else if ((l.kind === 'clash' || l.kind === 'barrage' || l.kind === 'scan' || (l.kind === 'core' && l.from)) && l.who) {
      where = route(l.from, l.at);
    } else if (l.at || l.from) {
      where = l.from && l.from !== l.at ? cellText(l.from) + ' ↔ ' + cellText(l.at) : cellText(l.at);
    }
    const cells = [l.from, l.at].filter(Boolean).join(' ');
    const side = who ? (mine ? ' side-mine' : ' side-theirs') : '';
    return '<' + (cells ? 'button type="button"' : 'div') + ' class="log-entry kind-' + esc(l.kind) + side + '"' +
      (cells ? ' data-cells="' + esc(cells) + '"' : '') + '>' +
      '<span class="log-turn">R' + l.turn + '</span>' +
      (who ? '<span class="log-who">' + esc(who) + '</span>' : '') +
      (where ? '<span class="log-where">' + esc(where) + '</span>' : '') +
      '<span class="log-text">' + body + '</span>' +
      '</' + (cells ? 'button' : 'div') + '>';
  }
  function renderLog() {
    const host = $('#battle-log');
    if (!host) return;
    const st = g.state;
    if (!st.log.length) {
      host.innerHTML = '<div class="log-entry empty">' + esc(tr('log.empty', 'No actions yet.')) + '</div>';
      return;
    }
    // in pass-and-play the log is hidden while the device changes hands
    if (st.viewer === 0) { host.innerHTML = ''; return; }
    const viewer = viewerOf(st);
    host.innerHTML = st.log.slice(-60).reverse().map(function (l) { return logLine(l, viewer); }).join('');
  }
  function markCells(ids) {
    clearTimeout(g.logMarkTimer);
    g.logMark = ids;
    render();
    g.logMarkTimer = setTimeout(function () { g.logMark = null; if (g.state) render(); }, 2400);
  }
  g.markCells = markCells;

  /* ══ interaction ═══════════════════════════════════════════════ */

  function onCell(id) {
    const st = g.state;
    if (!st || g.busy) return;
    if (st.phase === 'over') { g.focus = id; renderIntel(); return; }

    if (st.phase === 'deploy1' || st.phase === 'deploy2') {
      const owner = st.phase === 'deploy1' ? 1 : 2;
      if (!E.inDeployZone(st, owner, id)) {
        FX.toast('Deploy inside your own ground.', 'warn');
        sfx('error');
        return;
      }
      const unit = st.board[id];
      if (unit && unit.owner !== owner) return;
      if (!g.sel) {
        g.sel = id;
        sfx('select');
      } else if (g.sel === id) {
        g.sel = null;
        sfx('deselect');
      } else if (E.swapSlots(st, owner, g.sel, id)) {
        sfx('swap');
        buzz(10);
        g.sel = null;
      }
      render();
      return;
    }

    if (g.thinking) return;
    const humanTurn = isPass() || st.owner === 1;
    if (!humanTurn) return;
    // a lesson may ask the player to tap a cell as an answer (the wheel turns)
    if (modeHook('onCellTap', id)) { render(); return; }

    /* astra targeting */
    if (g.mode === 'astra' && g.astra) {
      onAstraCell(id);
      return;
    }

    // a highlighted target wins over everything else
    if (g.sel) {
      const hit = E.computeValidTargets(st, g.sel, g.mode).filter(function (t) { return t.id === id; })[0];
      if (hit) {
        commitAction(g.sel, id, hit.type);
        return;
      }
    }

    const unit = st.board[id];
    if (unit && unit.owner !== st.owner) {
      g.focus = id;
      g.armed = null;
      renderIntel();
      render();
      sfx('ui');
      return;
    }

    if (unit && unit.owner === st.owner) {
      g.armed = null;
      if (!E.isMovable(unit)) {
        FX.toast(unit.name + ' never moves — it holds that cell for the whole battle.', 'warn');
        sfx('error');
        g.sel = null;
        render();
        return;
      }
      if (unit.stun > 0) {
        FX.toast('Entranced — this piece cannot act for ' + unit.stun + ' more turn' + (unit.stun === 1 ? '' : 's') + '.', 'warn');
        sfx('error');
      }
      if (g.sel === id) {
        g.sel = null;
        sfx('deselect');
        render();
        return;
      }
      g.sel = id;
      g.mode = 'move';
      sfx('select');
      buzz(8);
      if (!g.hinted) {
        g.hinted = true;
        FX.toast('Gold dot = move. Ring = strike, with your chances above it.', 'info');
      }
      render();
      return;
    }

    g.sel = null;
    g.focus = null;
    g.armed = null;
    render();
  }

  /* Strikes on a hidden piece arm on the first tap and land on the second,
   * so a slip of the thumb never throws away a Senapati. */
  function commitAction(from, to, type) {
    const st = g.state;
    const target = st.board[to];
    if (modeHook('allowAction', { from: from, to: to, type: type }) === false) { sfx('error'); return; }
    const risky = (type === 'attack' || type === 'barrage') && target && settings().confirmActions !== false;
    if (risky && g.armed !== to) {
      g.armed = to;
      g.focus = to;
      sfx('arm');
      buzz(6);
      render();
      return;
    }
    g.armed = null;
    performAction({ from: from, to: to, type: type });
  }

  /* Confirm strike / Invoke: the same as tapping the armed target again. */
  function confirmArmed() {
    const st = g.state;
    if (!st || !g.armed || g.busy || g.thinking) return;
    if (g.mode === 'astra' && g.astra) { onAstraCell(g.armed); return; }
    if (!g.sel) return;
    const hit = E.computeValidTargets(st, g.sel, g.mode).filter(function (t) { return t.id === g.armed; })[0];
    if (!hit) { g.armed = null; render(); return; }
    commitAction(g.sel, g.armed, hit.type);
  }

  function enterAstra(key) {
    const st = g.state;
    if (!st || st.phase !== 'battle' || g.thinking || g.busy) return;
    if (!E.astraReady(st, st.owner, key)) {
      const def = L.astra(key);
      const used = st.astrasUsed[st.owner] && st.astrasUsed[st.owner][key];
      FX.toast(used ? def.name + ' has already been used this match.' : def.name + ' needs ' + def.cost + ' Shakti — you have ' + st.shakti[st.owner] + '.', 'warn');
      sfx('error');
      return;
    }
    if (modeHook('allowAction', { type: 'astra', astra: key }) === false) { sfx('error'); return; }
    if (!E.astraTargets(st, st.owner, key).length) {
      FX.toast('No target in reach — astras strike within two cells of your army.', 'warn');
      sfx('error');
      return;
    }
    g.sel = null;
    g.armed = null;
    g.mode = 'astra';
    g.astra = key;
    g.astraFirst = null;
    sfx('select');
    render();
  }

  function cancelAstra() {
    g.mode = 'move';
    g.astra = null;
    g.astraFirst = null;
    g.armed = null;
    sfx('deselect');
    render();
  }

  function onAstraCell(id) {
    const st = g.state;
    const key = g.astra;
    if (key === 'vayavya' && !g.astraFirst) {
      if (E.astraTargets(st, st.owner, key).indexOf(id) === -1) { sfx('error'); return; }
      g.astraFirst = id;
      sfx('select');
      render();
      return;
    }
    const legal = E.astraTargets(st, st.owner, key, g.astraFirst);
    if (legal.indexOf(id) === -1) {
      if (key === 'vayavya' && id === g.astraFirst) { g.astraFirst = null; render(); return; }
      sfx('error');
      return;
    }
    if (g.armed !== id) {
      g.armed = id;
      sfx('arm');
      render();
      return;
    }
    const action = key === 'vayavya'
      ? { type: 'astra', astra: key, from: g.astraFirst, to: id }
      : { type: 'astra', astra: key, to: id };
    g.mode = 'move';
    g.astra = null;
    g.astraFirst = null;
    g.armed = null;
    performAction(action);
  }

  function cellCenter(id) {
    const el = document.querySelector('.cell[data-id="' + id + '"]');
    return FX.centerOf(el);
  }

  /* Which line Sanjaya says for a batch of events, from the point of view of
   * `me` (the human in an AI game; the acting side in pass & play). */
  function narrate(events, me, st) {
    const keys = [];
    events.forEach(function (ev) {
      if (ev.kind === 'clash') {
        const att = ev.unit;
        const def = ev.target;
        if (ev.core) keys.push(att.owner === me ? 'fort_won' : 'fort_lost');
        else if (ev.assassinate) keys.push('assassinate');
        else if (ev.mine) keys.push(ev.outcome === 'def' ? 'trap_hit' : 'trap_defused');
        else if (ev.outcome === 'att' && (ev.attParts || []).some(function (p) { return p.key === 'makara'; })) keys.push('makara');
        else if (ev.outcome === 'def' && (ev.defParts || []).length) keys.push('padma');
        else if (ev.shieldBreak) keys.push('shield_break');
        else if (ev.outcome === 'both') keys.push('both_fell');
        else if (ev.outcome === 'att') keys.push(att.owner === me ? 'win_capture' : 'lose_capture');
        else if (ev.outcome === 'def') keys.push(def.owner === me ? 'win_capture' : 'lose_capture');
      } else if (ev.kind === 'core') {
        keys.push(ev.unit && ev.unit.owner === me ? 'fort_won' : 'fort_lost');
      } else if (ev.kind === 'barrage') {
        keys.push(ev.kill ? 'volley_kill' : 'volley_turned');
      } else if (ev.kind === 'scan') {
        if (Math.random() < 0.5) keys.push('scan');
      } else if (ev.kind === 'breach') {
        keys.push(ev.target.owner === me ? 'breach_own' : 'breach_enemy');
      } else if (ev.kind === 'astra') {
        keys.push('astra_' + ev.astra + (ev.owner === me ? '' : '_enemy'));
      } else if (ev.kind === 'rotate') {
        keys.push(board().kind === 'hex' ? 'rotate_padma' : 'rotate');
      } else if (ev.kind === 'sky') {
        const mine = (ev.hour === 'day' ? 1 : 2) === me;
        keys.push(ev.hour === 'day' ? (mine ? 'dawn' : 'dawn_enemy') : (mine ? 'dusk' : 'dusk_enemy'));
      } else if (ev.kind === 'pass') {
        keys.push('entranced_pass');
      }
    });
    if (st.shakti && st.shakti[me] >= 5 && !g.said.shakti_full && E.rules(st).astras && !(st.astrasUsed[me] || {}).brahma) {
      keys.push('shakti_full');
    }
    if (st.phase === 'battle') {
      // from four rounds (or three before sunset) to the end, until it has been spoken once
      const left = st.turnLimit ? st.turnLimit - st.turn : capOf(st) - st.turn;
      const warning = st.turnLimit && left <= 4 && left >= 1 ? 'last_rounds'
        : !st.turnLimit && left <= 3 && left >= 1 ? 'sunset_near' : null;
      if (warning && !g.said[warning]) keys.push(warning);
    }
    return keys;
  }

  function updateTension() {
    const st = g.state;
    if (!st || st.phase !== 'battle') { AU.setTension(0); return; }
    let level = 0;
    E.forEachUnit(st, function (u) { if (u.key === 'F' && u.breached) level = Math.max(level, 1); });
    if (st.turnLimit && st.turnLimit - st.turn <= 4) level = 2;
    else if (!st.turnLimit && capOf(st) - st.turn <= 3) level = Math.max(level, 1);
    AU.setTension(level);
    const shell = $('#board-shell');
    if (shell) shell.classList.toggle('tension', level > 0);
  }

  function shaktiChime(st) {
    if (!st.shakti || !g.lastShakti) return;
    [1, 2].forEach(function (o) {
      if (st.shakti[o] > (g.lastShakti[o] || 0) && (o === 1 || isPass())) sfx('shakti');
      g.lastShakti[o] = st.shakti[o];
    });
  }

  // A cancellable, skippable sequence. Each wait uses a timer or an audio
  // ended event; there is no frame loop while the player watches or thinks.
  // Calm budget (see docs/PACING.md): slide → impact → Sanjaya enters where the
  // effect's body ends (its tail is softened, never two loud sounds) → breath.
  // The opponent "thinks" while Sanjaya speaks, so a clash reaches the AI
  // preview in about 3.6 s with a 2 s line and about 4.6 s with a 3 s line.
  const PACE = { slide: 300, read: 1100, breath: 250, preview: 400, thinkMin: 700, thinkJitter: 400, alone: 1000 };
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  let paceRun = null;
  function alive(run) { return paceRun === run && !run.cancelled && g.state === run.state; }
  function cancelPace() {
    const run = paceRun;
    paceRun = null;
    if (run) { run.cancelled = true; if (run.skip) run.skip(); }
    g.calmActive = false;
    g.paceStep = null;
    g.links = null;
  }
  g.skipPace = function () {
    if (!paceRun || !paceRun.skip) return false;
    if (SJ) SJ.skip();
    if (g.paceStep === 'moment') paceRun.skippedMoment = true;
    paceRun.skip();
    return true;
  };
  function waitPace(run, step, ms, promise, cleanup) {
    if (!alive(run)) return Promise.resolve();
    g.paceStep = step;
    return new Promise(function (resolve) {
      let done = false;
      const finish = function () {
        if (done) return;
        done = true;
        clearTimeout(timer);
        if (run.skip === finish) run.skip = null;
        if (cleanup) cleanup();
        resolve();
      };
      const timer = ms == null ? null : setTimeout(finish, ms);
      run.skip = finish;
      if (promise) Promise.resolve(promise).then(finish, finish);
    });
  }
  function newPaceRun() {
    cancelPace();
    sayQueue = [];
    if (sayTimer) { clearTimeout(sayTimer); sayTimer = null; }
    const run = { state: g.state, cancelled: false, skip: null };
    paceRun = run;
    g.calmActive = true;
    return run;
  }
  async function seeMove(run, action, ai) {
    const st = run.state;
    const id = action.from || action.to;
    let token = document.querySelector('#board .cell[data-id="' + id + '"] .token');
    if (ai && token) {
      token.classList.add('calm-preview');
      await waitPace(run, 'preview', PACE.preview, null, function () { token.classList.remove('calm-preview'); });
      if (!alive(run)) return;
    }
    if (action.type !== 'move' && action.type !== 'attack') return;
    const b = board(), from = b.byId[action.from], to = b.byId[action.to];
    token = document.querySelector('#board .cell[data-id="' + action.from + '"] .token');
    let animation;
    if (!settings().reducedMotion && token && from && to && token.animate) {
      animation = token.animate([
        { transform: 'translate(' + from.x + 'px,' + from.y + 'px)' },
        { transform: 'translate(' + to.x + 'px,' + to.y + 'px)' }
      ], { duration: PACE.slide, easing: 'ease-out', fill: 'forwards' });
    }
    await waitPace(run, 'slide', PACE.slide, null, function () { if (animation) animation.cancel(); });
  }
  async function calmBeat(run, ev, me, voiced) {
    if (!alive(run)) return;
    const st = run.state;
    function clearLinks() {
      if (g.links) { g.links = null; if (g.state === st) renderBoard(); }
    }
    let cue = null;
    let cardDone = Promise.resolve();
    if (ev.kind === 'clash' && ((ev.jaws || []).length || (ev.petals || []).length)) {
      g.links = { jaws: (ev.attParts || []).some(function (p) { return p.key === 'makara'; }) ? ev.jaws : [], petals: ev.petals || [], to: ev.at, until: Infinity };
      renderBoard();
    }
    if (ST && settings().cinematics !== false) {
      cardDone = new Promise(function (resolve) {
        const closed = function () { clearLinks(); resolve(); };
        const fn = { clash: 'clash', barrage: 'volley', scan: 'scan', breach: 'breach', astra: 'astra', core: 'clash' }[ev.kind];
        if (fn) ST[fn](ev.kind === 'core' ? Object.assign({ outcome: 'att', core: true }, ev) : ev, me, closed);
        else if (ev.kind === 'sky') ST.sky(ev.hour, E.hourOwner(st) === viewerOf(st), closed);
        else resolve();
      });
    }
    cue = ev.sfx && AU.cue ? AU.cue(ev.sfx) : null;
    if (voiced) {
      // The last beat before a line: hold the card for a minimum read, let the
      // effect's body play out, then hand the floor to Sanjaya with the card up.
      const body = cue ? (cue.speakable || cue.finished) : Promise.resolve();
      let skipped = false;
      await waitPace(run, 'moment', null, Promise.all([sleep(PACE.read), body]), function () {
        if (run.skippedMoment) { skipped = true; }
      });
      if (!alive(run) || skipped) { if (cue) cue.stop(); if (ST) ST.close(false); clearLinks(); return null; }
      if (ST && ST.extend) ST.extend();
      return { cue: cue, clearLinks: clearLinks };
    }
    await waitPace(run, 'moment', null, Promise.all([cardDone, cue ? cue.finished : Promise.resolve()]), function () {
      if (cue) cue.stop();
      if (ST) ST.close(false);
      clearLinks();
    });
    return null;
  }
  async function performCalm(action, existingRun) {
    const run = existingRun || newPaceRun(), st = run.state;
    if (!alive(run)) return;
    g.busy = true;
    stopClock();
    // An introduction still speaking finishes before any battle effect starts.
    if (SJ) await waitPace(run, 'previous-line', null, SJ.idle(), function () { SJ.stop(); });
    if (!alive(run)) return;
    const actor = st.owner, me = isAi() ? 1 : actor;
    // Validate without changing the live board before the slide has finished.
    const check = E.applyAction(E.clone(st), action);
    if (!check.ok) {
      cancelPace(); g.busy = false;
      FX.toast(check.error || 'That action is not legal.', 'error'); sfx('error'); render(); return;
    }
    resetSelection();
    await seeMove(run, action, isAi() && actor === 2);
    if (!alive(run)) return;
    const res = E.applyAction(st, action);
    noteRotation(st, res.events);
    render();
    updateTension();
    const events = res.events;
    // A fort/breach can also emit a generic clash. One card tells that moment;
    // ancillary Shakti is shown silently so chimes never pile onto a voice.
    const major = events.some(function (ev) { return ev.kind === 'breach' || ev.kind === 'core'; });
    const hasAstra = events.some(function (ev) { return ev.kind === 'astra'; });
    const beats = events.filter(function (ev) {
      if (ev.kind === 'move') return !events.some(function (x) { return x.kind === 'clash'; });
      if (ev.kind === 'clash' && (major || hasAstra)) return false;
      return ['clash', 'barrage', 'scan', 'breach', 'astra', 'core', 'sky', 'rotate'].indexOf(ev.kind) !== -1;
    });
    const moments = narrate(events, me, st);
    // the battle's result outranks the blow that ended it (a fort taken outranks both)
    if (st.phase === 'over') moments.push(st.winner === 0 ? 'draw' : st.winner === me ? 'victory' : 'defeat');
    const keys = SJ ? SJ.rank(moments) : moments;
    const voiced = !!(keys.length && SJ && settings().narrator !== false);
    if (voiced) markSaid(keys.slice(0, 1));
    let tail = null;
    for (let i = 0; i < beats.length; i++) {
      const ev = beats[i];
      if (ev.kind === 'rotate' && !settings().reducedMotion) spinRings();
      run.skippedMoment = false;
      tail = await calmBeat(run, ev, me, voiced && i === beats.length - 1);
      if (!alive(run)) return;
    }
    g.lastShakti = { 1: st.shakti[1], 2: st.shakti[2] };
    const aiNext = isAi() && st.owner === 2 && st.phase !== 'over';
    if (voiced) {
      // The opponent decides while Sanjaya speaks; the wait is only what is left.
      if (aiNext) run.thought = sleep(PACE.thinkMin + Math.random() * PACE.thinkJitter);
      if (tail && tail.cue && tail.cue.soften) tail.cue.soften();
      const closeTail = function () {
        if (tail && tail.cue) tail.cue.stop();
        if (tail) { if (ST) ST.close(false); tail.clearLinks(); }
      };
      await waitPace(run, 'voice', null, SJ.say(keys[0], { force: true }), function () { SJ.stop(); closeTail(); });
      closeTail();
      if (!alive(run)) return;
    }
    if (st.phase === 'over') g.calmResultNarrated = true;
    modeHook('onEvents', { events: events, actor: actor, action: action });
    if (!alive(run)) return;
    autosave();
    if (st.phase === 'over') { cancelPace(); g.busy = false; handleGameOver(); return; }
    if (isAi() && st.owner === 2) {
      await waitPace(run, 'breath', PACE.breath);
      if (!alive(run)) return;
      await calmAi(run);
    } else {
      // Show the handover before accepting a second order (or starting its clock).
      banner('Your turn', U.FACTIONS[st.owner].deva + ' · round ' + st.turn, st.owner === 1 ? 'solar' : 'void');
      await waitPace(run, 'your-turn', 400);
      if (!alive(run)) return;
      cancelPace(); g.busy = false; g.thinking = false;
      render();
      warnTurn(st);
      if (isPass()) showCurtain(st.owner, 'battle');
      startClockIfNeeded();
    }
  }
  async function calmAi(run) {
    const st = run.state;
    g.thinking = true; g.busy = true; render();
    const thought = run.thought;
    run.thought = null;
    if (thought) await waitPace(run, 'thinking', null, thought);
    else await waitPace(run, 'thinking', PACE.alone + Math.random() * PACE.thinkJitter);
    if (!alive(run)) return;
    const act = AI.chooseAction(st, 2, st.config.difficulty || 'veteran', modeHook('aiRng'));
    g.thinking = false;
    if (!act) { cancelPace(); g.busy = false; E.endGame(st, 1, 'Chandravansh has no legal action left.', []); handleGameOver(); return; }
    await performCalm(act, run);
  }
  function startCalmAi() { calmAi(newPaceRun()); }

  function performAction(action) {
    if (!g.state || g.busy) return;
    if (settings().pace !== 'quick') { performCalm(action); return; }
    const st = g.state;
    const mover = action.from ? st.board[action.from] : null;
    const actor = st.owner;
    const moverWasAi = isAi() && actor === 2;
    g.busy = true;
    const res = E.applyAction(st, action);
    if (!res.ok) {
      g.busy = false;
      FX.toast(res.error || 'That action is not legal.', 'error');
      sfx('error');
      render();
      return;
    }
    resetSelection();
    stopClock();
    noteRotation(st, res.events);

    const me = isAi() ? 1 : actor;
    const at = action.to ? cellCenter(action.to) : FX.centerOf($('#board'));
    const beats = [];
    let rotated = false;
    let skyEv = null;

    res.events.forEach(function (ev) {
      if (ev.sfx) sfx(ev.sfx);
      if (ev.kind === 'rotate') {
        rotated = true;
        const c = FX.centerOf($('#board'));
        FX.burst(c.x, c.y, { count: 40, color: '#f2cf8b', speed: 6, size: 3 });
        FX.shake(8);
      }
      if (ev.kind === 'sky') skyEv = ev;
      noteMoment(st, ev);
      if (ev.kind === 'clash' || ev.kind === 'barrage' || ev.kind === 'scan' || ev.kind === 'breach' || ev.kind === 'astra' || ev.kind === 'core') {
        beats.push(ev);
      }
      if (ev.kind === 'clash') {
        const win = ev.outcome === 'att';
        const color = win ? '#f2cf8b' : ev.outcome === 'def' ? '#8b8ff0' : '#c8452b';
        FX.burst(at.x, at.y, { count: win ? 26 : 20, color: color, speed: 4 });
        FX.shake(win ? 7 : 5);
        if ((ev.jaws && ev.jaws.length) || (ev.petals && ev.petals.length)) {
          g.links = { jaws: ev.attParts.some(function (p) { return p.key === 'makara'; }) ? ev.jaws : [], petals: ev.petals || [], to: ev.at, until: Date.now() + 2200 };
          setTimeout(function () { if (g.state === st) renderBoard(); }, 2300);
        }
      } else if (ev.kind === 'barrage') {
        FX.burst(at.x, at.y, { count: 22, color: ev.kill ? '#f2cf8b' : '#8b8ff0', speed: 5 });
        FX.shake(4);
      } else if (ev.kind === 'scan') {
        FX.spawn(at.x, at.y, { count: 26, color: '#b9a8ff', speed: 2.4, size: 3 });
      } else if (ev.kind === 'move') {
        FX.spawn(at.x, at.y, { count: 8, color: '#e0a94a', speed: 1.4, size: 1.8, gravity: 0.02 });
      } else if (ev.kind === 'breach') {
        FX.burst(at.x, at.y, { count: 34, color: '#c8452b', speed: 5 });
        FX.shake(10);
      }
    });

    shaktiChime(st);
    render();
    updateTension();
    if (rotated) spinRings();
    if (moverWasAi && !beats.length && mover) {
      FX.toast(oppName(st) + ' moved a ' + (mover.revealed ? mover.name : 'piece') + '.', 'info');
    }
    speak(narrate(res.events, me, st));
    modeHook('onEvents', { events: res.events, actor: actor, action: action });

    const finish = function () {
      g.busy = false;
      autosave();
      render();
      if (skyEv && ST) ST.sky(skyEv.hour, E.hourOwner(st) === viewerOf(st));
      if (st.phase === 'over') { handleGameOver(); return; }
      if (isAi() && st.owner === 2) scheduleAi();
      else if (isPass()) showCurtain(st.owner, 'battle');
      else banner('Your turn', U.FACTIONS[st.owner].deva + ' · round ' + st.turn, st.owner === 1 ? 'solar' : 'void');
      if (st.phase === 'battle' && (!isAi() || st.owner === 1)) warnTurn(st);
      startClockIfNeeded();
    };

    playBeats(beats, me, finish);
  }

  /* Play the stage beats one after another, then carry on. */
  function playBeats(list, viewer, done) {
    if (!ST || !list.length || settings().cinematics === false) { done(); return; }
    const ev = list.shift();
    const next = function () { playBeats(list, viewer, done); };
    if (ev.kind === 'clash') ST.clash(ev, viewer, next);
    else if (ev.kind === 'barrage') ST.volley(ev, viewer, next);
    else if (ev.kind === 'scan') ST.scan(ev, viewer, next);
    else if (ev.kind === 'breach') ST.breach(ev, viewer, next);
    else if (ev.kind === 'astra') ST.astra(ev, viewer, next);
    else if (ev.kind === 'core') ST.clash(Object.assign({ outcome: 'att', core: true }, ev), viewer, next);
    else next();
  }

  /* ── AI turn ───────────────────────────────────────────────── */

  function scheduleAi() {
    if (g.aiTimer) clearTimeout(g.aiTimer);
    g.thinking = true;
    render();
    if (settings().pace !== 'quick') { startCalmAi(); return; }
    const diff = g.state.config.difficulty || 'veteran';
    const delay = (U.DIFFICULTIES[diff] || U.DIFFICULTIES.veteran).think + Math.random() * 260;
    g.aiTimer = setTimeout(function () {
      g.aiTimer = null;
      const st = g.state;
      if (!st || st.phase !== 'battle' || st.owner !== 2) { g.thinking = false; render(); return; }
      const act = AI.chooseAction(st, 2, diff, modeHook('aiRng'));
      g.thinking = false;
      if (!act) {
        render();
        if (st.phase === 'battle') {
          E.endGame(st, 1, 'Chandravansh has no legal action left.', []);
          handleGameOver();
        }
        return;
      }
      render();
      performAction(act);
    }, delay);
  }

  /* ── turn clock ────────────────────────────────────────────── */

  function startClockIfNeeded() {
    const st = g.state;
    if (!st) return;
    if (!st.config.timer || st.phase !== 'battle' || g.thinking || (g.calmActive && g.busy)) { stopClock(); return; }
    const humanTurn = isPass() || st.owner === 1;
    if (!humanTurn) { stopClock(); return; }
    if (g.timerId) return;
    if (!g.timeLeft || g.timeLeft <= 0) g.timeLeft = st.config.timer;
    g.timerId = setInterval(function () {
      g.timeLeft -= 1;
      const clock = document.getElementById('hud-clock');
      if (clock) {
        clock.textContent = formatClock(g.timeLeft);
        clock.classList.toggle('warn', g.timeLeft <= 10);
      }
      if (g.timeLeft <= 5 && g.timeLeft > 0) sfx('tick');
      if (g.timeLeft <= 0) { stopClock(); autoMoveOnTimeout(); }
    }, 1000);
  }

  function stopClock() {
    if (g.timerId) { clearInterval(g.timerId); g.timerId = null; }
    g.timeLeft = g.state && g.state.config.timer ? g.state.config.timer : 0;
  }

  function autoMoveOnTimeout() {
    const st = g.state;
    if (!st || st.phase !== 'battle') return;
    const act = AI.chooseAction(st, st.owner, 'veteran');
    if (!act) return;
    FX.toast('Time — the advisor played your best move.', 'warn');
    sfx('warn');
    resetSelection();
    performAction(act);
  }

  /* ── privacy curtain ──────────────────────────────────────── */

  function showCurtain(nextOwner, kind) {
    const st = g.state;
    st.viewer = 0;
    render();
    const isDeploy = kind === 'deploy';
    const title = isDeploy ? 'Pass to ' + U.FACTIONS[nextOwner].name : 'Pass to ' + U.FACTIONS[nextOwner].short + ' — round ' + st.turn;
    const sub = isDeploy
      ? 'The previous commander has locked their formation. Hand the device over before continuing.'
      : 'Hide the screen from your opponent, then hand over the device.';

    const overlay = document.createElement('div');
    overlay.className = 'curtain';
    overlay.innerHTML =
      '<div class="curtain-card">' +
        '<div class="curtain-icon">' + A.icon('lock') + '</div>' +
        '<div class="curtain-count">PARDA · पर्दा</div>' +
        '<div class="curtain-title">' + esc(title) + '</div>' +
        '<div class="curtain-sub">' + esc(sub) + '</div>' +
        '<button class="btn btn-gold" id="curtain-go">I am ' + esc(U.FACTIONS[nextOwner].short) + ' — reveal</button>' +
      '</div>';
    document.body.appendChild(overlay);
    sfx('curtain');
    const reveal = function () {
      overlay.remove();
      st.viewer = nextOwner;
      render();
      startClockIfNeeded();
      sfx('unlock');
      if (kind !== 'deploy') {
        banner('Your turn', U.FACTIONS[nextOwner].deva + ' · round ' + st.turn, nextOwner === 1 ? 'solar' : 'void');
      }
    };
    overlay.querySelector('#curtain-go').addEventListener('click', reveal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) reveal(); });
  }

  /* ── deployment actions ──────────────────────────────────── */

  const PRESET_NAMES = { citadel: 'Durg (guard the fort)', blitz: 'Aakraman (strike first)', lattice: 'Jaal (the net)', shuffle: 'Shuffle' };

  function deployPreset(style) {
    const st = g.state;
    const owner = st.phase === 'deploy1' ? 1 : 2;
    E.deployPreset(st, owner, style);
    g.sel = null;
    sfx('deploy');
    render();
    FX.toast((PRESET_NAMES[style] || style) + ' formation applied.', 'info');
  }

  /* ── Pratigya: one optional secret vow before an AI duel ──── */

  const PR = AC.pratigya;
  function vowText(v, field) { return tr('vow.' + v.key + '.' + field, v[field]); }

  function vowOffered(st) {
    const p = AC.app.profile;
    return !!(PR && PR.allowed(st) && !st.pratigya && settings().vows !== false &&
      p && !AC.app.guest && p.stats && (p.stats.wins || 0) >= 1);
  }

  function offerVow(st, done) {
    const choices = PR.offer(st.rules);
    let picked = false;
    const card = function (v, i) {
      return '<button class="vow-card" data-vow="' + i + '">' +
        '<span class="vow-deva deva">' + esc(v.deva) + '</span>' +
        '<span class="vow-name">' + esc(vowText(v, 'name')) + '</span>' +
        '<span class="vow-rule">' + esc(vowText(v, 'rule')) + '</span>' +
        '<span class="vow-stars">' + '★'.repeat(v.stars) + '</span>' +
      '</button>';
    };
    const m = AC.ui.modal({
      kicker: tr('vow.kicker', 'Pratigya · प्रतिज्ञा'),
      title: tr('vow.title', 'Take a vow?'),
      sub: '<span>' + esc(tr('vow.sub', 'Keep it and win to earn vow stars. It changes nothing on the field.')) + '</span>',
      dismissible: false,
      body: '<div class="vow-list">' + choices.map(card).join('') + '</div>',
      actions: [{ label: tr('vow.none', 'Fight without a vow'), cls: 'btn-ghost' }],
      // any way out of the dialog (button, back, Escape) begins the battle
      onClose: function () { if (!picked) { picked = true; done(); } }
    });
    m.el.querySelector('.vow-list').addEventListener('click', function (e) {
      const b = e.target.closest('[data-vow]');
      if (!b || picked) return;
      picked = true;
      st.pratigya = { key: choices[Number(b.getAttribute('data-vow'))].key };
      sfx('lock');
      m.close();
      done();
    });
  }

  function showVow() {
    const st = g.state;
    const v = st && st.pratigya && PR && PR.get(st.pratigya.key);
    if (!v) return;
    AC.ui.modal({
      kicker: tr('vow.kicker', 'Pratigya · प्रतिज्ञा'),
      title: vowText(v, 'name'),
      body: '<p class="vow-rule-big"><span class="deva">' + esc(v.deva) + '</span> ' + esc(vowText(v, 'rule')) + '</p>' +
        '<p class="fineprint">' + esc(tr('vow.secret', 'Only you know this vow. Win and keep it to earn ')) + '★'.repeat(v.stars) + '</p>',
      actions: [{ label: 'Back to battle', cls: 'btn-primary' }]
    });
  }
  g.showVow = showVow;

  function lockFormation() {
    const st = g.state;
    if (st.phase === 'deploy1') {
      if (!E.armyComplete(st, 1)) { FX.toast('Your army is not complete.', 'error'); return; }
      sfx('lock');
      if (isPass()) {
        st.phase = 'deploy2';
        autosave();
        showCurtain(2, 'deploy');
      } else if (vowOffered(st)) {
        offerVow(st, function () { if (g.state === st && st.phase === 'deploy1') beginAiBattle(st); });
      } else {
        beginAiBattle(st);
      }
      return;
    }
    if (st.phase === 'deploy2') {
      if (!E.armyComplete(st, 2)) { FX.toast('Your army is not complete.', 'error'); return; }
      sfx('lock');
      E.beginBattle(st);
      sfx('shankh');
      render();
      autosave();
      if (isPass()) showCurtain(1, 'battle');
      startClockIfNeeded();
    }
  }

  function beginAiBattle(st) {
    E.beginBattle(st);
    sfx('shankh');
    render();
    banner(st.turnLimit ? 'The breach begins' : 'Yuddh aarambh',
      (st.turnLimit ? st.turnLimit + ' rounds to take the fort' : 'break the gate, take the fort'), 'gold', 1600);
    autosave();
    startClockIfNeeded();
  }

  function keepFormation() {
    const st = g.state;
    const owner = st.phase === 'deploy1' ? 1 : 2;
    const map = {};
    board().zones[owner].forEach(function (id) {
      const u = st.board[id];
      if (u && u.owner === owner) map[id] = u.key;
    });
    AC.ui.promptText({ kicker: 'Formation', title: 'Save this formation', label: 'Formation name', value: 'My vyuha' })
      .then(function (name) {
        if (!name) return;
        S.saveFormation(name, map, st.boardKey);
        FX.toast('Formation saved.', 'success');
        sfx('save');
        render();
      });
  }

  function applySavedFormation() {
    const st = g.state;
    const owner = st.phase === 'deploy1' ? 1 : 2;
    const list = S.listFormations().filter(function (f) { return f.board === st.boardKey; });
    if (!list.length) { FX.toast('No saved formations for this board.', 'warn'); return; }
    const m = AC.ui.modal({
      kicker: 'Formations',
      title: 'Load a formation',
      body: '<div class="save-list">' + list.map(function (f, i) {
        return '<div class="save-card"><div class="save-info"><div class="save-title">' + esc(f.name) + '</div>' +
          '<div class="save-meta">' + (L.board(f.board) || U.BOARDS.small).label + ' · saved ' + AC.ui.timeAgo(f.createdAt) + '</div></div>' +
          '<div class="save-actions"><button class="btn btn-primary btn-xs" data-use="' + i + '">Use</button>' +
          '<button class="btn btn-danger btn-xs" data-drop="' + i + '">' + A.icon('trash') + '</button></div></div>';
      }).join('') + '</div>',
      actions: [{ label: 'Close', cls: 'btn-ghost' }]
    });
    m.el.addEventListener('click', function (e) {
      const use = e.target.closest('[data-use]');
      const drop = e.target.closest('[data-drop]');
      if (use) {
        const f = list[Number(use.getAttribute('data-use'))];
        if (f) { applyLayout(f.layout, owner); m.close(); }
      } else if (drop) {
        const f = list[Number(drop.getAttribute('data-drop'))];
        if (f) { S.deleteFormation(f.id); m.close(); FX.toast('Formation deleted.', 'success'); render(); }
      }
    });
  }

  function applyLayout(map, owner) {
    const st = g.state;
    const army = [];
    E.forEachUnit(st, function (u) { if (u.owner === owner) army.push(u); });
    board().zones[owner].forEach(function (id) { st.board[id] = null; });

    const byKey = {};
    army.forEach(function (u) { (byKey[u.key] = byKey[u.key] || []).push(u); });
    Object.keys(map || {}).forEach(function (id) {
      if (!E.inDeployZone(st, owner, id)) return;
      const pool = byKey[map[id]];
      if (pool && pool.length) st.board[id] = pool.pop();
    });
    // anything unplaced goes to a free zone cell
    const placed = {};
    E.forEachUnit(st, function (u, id) { placed[u.id] = id; });
    const leftovers = army.filter(function (u) { return !placed[u.id]; });
    const free = board().zones[owner].filter(function (id) { return !st.board[id]; });
    leftovers.forEach(function (u, i) { if (free[i]) st.board[free[i]] = u; });

    sfx('deploy');
    render();
  }

  /* ── advisor ──────────────────────────────────────────────── */

  function openAdvisor() {
    const st = g.state;
    if (!st || st.phase !== 'battle') { FX.toast('The advisor only speaks during battle.', 'warn'); return; }
    if (g.thinking || g.busy) return;
    if (!(isPass() || st.owner === 1)) return;
    const advice = AI.advise(st, st.owner, 3);
    if (!advice.length) { FX.toast('No legal moves available.', 'warn'); return; }
    const m = AC.ui.modal({
      kicker: 'Mantri · ' + U.FACTIONS[st.owner].short,
      title: 'Three good orders',
      sub: 'Ranked by the same reading of the field the AI uses. Tap one to see it on the board.',
      body: '<div class="advice-list">' + advice.map(function (a, i) {
        return '<button class="advice-item" data-adv="' + i + '">' +
          '<span class="advice-score">' + (i === 0 ? '★' : (i + 1)) + '</span>' +
          '<span><span class="advice-label">' + esc(a.label) + '</span>' +
          '<span class="advice-note">' + esc(a.note) + '</span></span></button>';
      }).join('') + '</div>',
      actions: [{ label: 'Close', cls: 'btn-ghost' }]
    });
    m.el.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-adv]');
      if (!btn) return;
      const a = advice[Number(btn.getAttribute('data-adv'))];
      if (!a) return;
      m.close();
      if (a.action.type === 'astra') {
        enterAstra(a.action.astra);
        if (a.action.astra === 'vayavya' && a.action.from) g.astraFirst = a.action.from;
        g.armed = a.action.to;
        render();
      } else {
        g.sel = a.action.from;
        g.mode = (a.action.type === 'scan' || a.action.type === 'barrage') ? 'special' : 'move';
        render();
      }
      const at = cellCenter(a.action.to);
      FX.spawn(at.x, at.y, { count: 14, color: '#34d399', speed: 2 });
    });
  }

  function openHelp() {
    const st = g.state;
    const turning = st && E.hasRotation(st);
    const cards = [
      ['व्यूह रचना', 'Deploy', 'Twelve pieces in your own ground. Tap one, then another, to swap them. Presets are only a starting point.'],
      ['चाल', 'Move', 'Tap your piece, then a glowing cell. One step, two for the cavalry, a whole lane for the chariot.'],
      ['संघर्ष', 'Strike', 'Tap a ringed enemy: it says Likely win, Uncertain or Likely loss, based on ranks you can’t see yet. Then Confirm strike.'],
      ['दुर्ग', 'The fort', 'The first blow breaks its gate and reveals it. The second blow takes it — and the match.'],
      ['पहर', 'The hours', 'Every fifth round the sky turns. Suryavansh strikes at +1 by day, Chandravansh at +1 by night.'],
      ['व्यूह', 'Formations', 'Makara: strike a piece another of yours touches, +1. Padma: a piece with two friends beside it defends at +1.'],
      ['शक्ति', 'Shakti & astras', 'Every piece you take lights a lamp. Spend lamps on four divine weapons — each once per match.'],
      turning ? ['चक्र', 'The turn', 'Every fifth round the inner rings turn one cell, and whatever they carry is exposed.'] : ['सूर्यास्त', 'Sunset', 'If the war runs long, at sunset the stronger army holds the field.']
    ];
    AC.ui.modal({
      kicker: 'Learn in one screen',
      title: 'Eight things to know',
      wide: true,
      body: '<div class="learn-grid">' + cards.map(function (c) {
        return '<div class="learn-card"><span class="deva">' + c[0] + '</span><b>' + esc(c[1]) + '</b><p>' + esc(c[2]) + '</p></div>';
      }).join('') + '</div>',
      actions: [
        { label: 'Full rules', cls: 'btn-ghost', onClick: function () { AC.ui.openCodex(); } },
        { label: 'Got it', cls: 'btn-primary' }
      ]
    });
  }

  g.openHelp = openHelp;

  g.openIntel = function () {
    const panel = document.getElementById('intel-panel');
    if (panel) panel.classList.add('open');
    const scrim = document.getElementById('scrim');
    if (scrim) scrim.classList.add('on');
  };

  /* ── game over ────────────────────────────────────────────── */

  function shareLine(st, outcome) {
    const b = L.board(st.boardKey) || U.BOARDS.wheel;
    if (outcome === 'win') return 'I broke ' + oppName(st) + '’s army on the ' + b.label + ' in ' + st.turn + ' rounds. Can you?';
    if (outcome === 'loss') return oppName(st) + ' took my fort on the ' + b.label + '. Avenge me.';
    return 'The field was shared on the ' + b.label + ' after ' + st.turn + ' rounds.';
  }

  function handleGameOver() {
    if (g.over) return;
    g.over = true;
    stopClock();
    clearTimers();
    AU.setTension(0);
    const st = g.state;
    st.viewer = 3;
    render();

    const winner = st.winner;
    const isAiGame = isAi();
    let outcome = 'draw';
    if (winner === 1) outcome = 'win';
    else if (winner === 2) outcome = 'loss';

    // the ladder (Yuddh karo): where the player stood before this result, and after it
    let rungBefore = null, rungAfter = null;
    if (isAiGame && AC.app.profile && !AC.app.guest && !modeHook('noRecord')) {
      rungBefore = AC.ui.ladder(AC.app.profile.stats);
      S.recordResult(AC.app.profile.id, {
        outcome: outcome,
        captures: (st.captured[1] || []).length,
        cores: (st.captured[1] || []).filter(function (d) { return d.key === 'F'; }).length,
        plies: st.stats.actions,
        difficulty: st.config && st.config.difficulty
      });
      AC.app.profile = S.getProfile(AC.app.profile.id);
      rungAfter = AC.ui.ladder(AC.app.profile.stats);
    }
    S.deleteSave('auto');
    // a lesson that ends in a win tells its own outcome, not "the field is conceded"
    if (modeHook('customResult', { outcome: outcome })) return;

    // Pratigya: judge the vow once, record it, show it under the result
    let vowHtml = '';
    if (st.pratigya && PR && !st.pratigya.judged) {
      const j = PR.judge(st, 1, st.pratigya.key);
      st.pratigya.judged = true;
      if (j) {
        st.pratigya.kept = j.kept;
        let line = '';
        if (AC.app.profile && !AC.app.guest) {
          const before = (AC.app.profile.vows && AC.app.profile.vows.stars) || 0;
          const rec = S.recordVow(AC.app.profile.id, j.vow.key, j.kept, j.vow.stars, j.vow.stamp);
          AC.app.profile = S.getProfile(AC.app.profile.id);
          const t = rec && PR.titleFor(rec.stars);
          if (j.kept && t && !(PR.titleFor(before) && PR.titleFor(before).key === t.key)) {
            line = tr('vow.newTitle', 'New title: ') + t.name + ' · ' + t.deva;
          } else if (rec) {
            line = '★ ' + rec.stars;
          }
        }
        vowHtml = '<div class="vow-result ' + (j.kept ? 'kept' : 'broken') + '">' +
          '<span class="vow-deva deva">' + esc(j.vow.deva) + '</span>' +
          '<div><b>' + esc(vowText(j.vow, 'name')) + '</b> — ' +
          esc(j.kept ? tr('vow.kept', 'vow kept') + ' ' + '★'.repeat(j.vow.stars) : tr('vow.broken', 'vow not kept')) +
          (line ? '<div class="fineprint">' + esc(line) + '</div>' : '') + '</div></div>';
      }
    }

    const englishTitle = winner === 0 ? 'The field is shared' : (winner === 1 ? 'Suryavansh triumphs' : 'Chandravansh conquers');
    const title = tr(winner === 0 ? 'result.shared' : isAiGame && outcome !== 'win' ? 'result.defeat' : 'result.victory', englishTitle);
    const deva = winner === 0 ? 'समान' : ((isAiGame ? outcome === 'win' : true) ? 'विजय' : 'पराजय');
    const cls = winner === 0 ? 'draw' : (isAiGame ? (outcome === 'win' ? 'win' : 'lose') : 'win');
    sfx(winner === 0 ? 'draw' : isAiGame ? (outcome === 'win' ? 'win' : 'lose') : 'win');
    if (winner === 0) AU.sting('defeat');
    else if (!isAiGame || outcome === 'win') { AU.sting('victory_big'); sfx('shankh'); }
    else AU.sting('defeat');
    if (winner !== 0) FX.shake(9);
    if (!g.calmResultNarrated) speak([winner === 0 ? 'draw' : (isAiGame ? (outcome === 'win' ? 'victory' : 'defeat') : 'victory')]);

    const extra = modeHook('resultExtras', { outcome: outcome }) || null;
    // Ladder: only for an ordinary battle against the opponent the player currently stands on
    const diffKey = st.config && st.config.difficulty;
    const onRung = !extra && rungBefore && rungAfter && st.scenario === 'duel' && diffKey === rungBefore.key;
    const promoted = !!(onRung && outcome === 'win' && rungAfter.rung > rungBefore.rung);
    const beaten = onRung ? (L.opponent(diffKey) || U.DIFFICULTIES[diffKey]) : null;
    const nextOpp = promoted ? (L.opponent(rungAfter.key) || U.DIFFICULTIES[rungAfter.key]) : null;
    const astrasUsed = (st.astraLog || []).filter(function (a) { return a.owner === 1; }).length;
    const actions = [
      { label: 'Home', cls: 'btn-ghost', onClick: function () { g.state = null; AC.ui.show('home'); } },
      { label: 'Review board', cls: 'btn-ghost', onClick: function () { render(); } }
    ];
    if (extra && extra.actions) extra.actions.forEach(function (a) { actions.push(a); });
    else {
      if (isAiGame && outcome !== 'draw' && AC.share) {
        actions.push({ label: tr('result.share', 'Share'), cls: 'btn-ghost', icon: 'share', close: false, onClick: function () { AC.share.text(shareLine(st, outcome)); } });
      }
      if (AC.scroll && g.moments && g.momentsState === st && g.moments.length) {
        actions.push({ label: 'Sanjaya’s Scroll', cls: 'btn-ghost', icon: 'share', close: false, onClick: function () { openScroll(st, outcome, title); } });
      }
      if (promoted) {
        // the win that clears a rung: the next opponent takes the place of Rematch
        // (Rematch stays on the bar under the board)
        actions.push({ label: tr('ladder.face', 'Face {b}').replace('{b}', nextOpp.label), cls: 'btn-primary', icon: 'sword',
          onClick: function () { g.start(Object.assign({}, st.config, { difficulty: nextOpp.key })); } });
      } else {
        actions.push({ label: tr('result.rematch', 'Rematch'), cls: 'btn-primary', onClick: function () { g.start(st.config); } });
      }
    }

    // whole sentences with {a} {b} {n}, so Hindi and Marathi can order the words their own way
    const fill = function (key, fallback, v) { return tr(key, fallback).replace(/\{(\w)\}/g, function (m, k) { return v[k] == null ? m : v[k]; }); };
    let ladderHtml = '';
    if (promoted) {
      ladderHtml = '<div class="ladder-note up"><b>' + esc(fill('ladder.beaten', '{a} is beaten.', { a: beaten.label })) + '</b> ' +
        esc(fill('ladder.next', '{b} takes the field against you next.', { b: nextOpp.label })) + '</div>';
    } else if (onRung && outcome === 'win' && rungAfter.next) {
      const left = rungAfter.need - rungAfter.wins;
      const v = { a: beaten.label, b: (L.opponent(rungAfter.next) || U.DIFFICULTIES[rungAfter.next]).label, n: left };
      ladderHtml = '<div class="ladder-note">' + esc(left === 1
        ? fill('ladder.one_more', 'One more win over {a} and {b} comes for you.', v)
        : fill('ladder.more', '{n} more wins over {a} and {b} comes for you.', v)) + '</div>';
    }

    AC.ui.modal({
      kicker: 'Yuddh samaapt',
      title: '',
      art: A.artFor(cls === 'win' ? 'ui:victory' : cls === 'lose' ? 'ui:defeat' : 'ui:combat'),
      dismissible: false,
      wide: !!(extra && extra.wide),
      body:
        '<div class="result-hero">' +
          '<div class="result-deva deva ' + cls + '">' + deva + '</div>' +
          '<div class="result-title ' + cls + '">' + esc(title) + '</div>' +
          '<div class="result-reason">' + esc(st.reason || '') + '</div>' +
        '</div>' +
        '<div class="result-stats">' +
          '<div class="result-stat"><b>' + st.turn + '</b><span>rounds</span></div>' +
          '<div class="result-stat"><b>' + (st.captured[1] || []).length + '</b><span>taken</span></div>' +
          '<div class="result-stat"><b>' + (st.captured[2] || []).length + '</b><span>lost</span></div>' +
          '<div class="result-stat"><b>' + astrasUsed + '</b><span>astras</span></div>' +
        '</div>' +
        ladderHtml +
        vowHtml +
        (extra && extra.html ? extra.html : ''),
      actions: actions
    });
  }

  g.resign = function () {
    if (!g.state || g.state.phase === 'over') return;
    // against the AI the player is always the one leaving, even mid-AI-turn
    const loser = isAi() ? 1 : g.state.owner;
    g.conclude(loser === 1 ? 2 : 1, U.FACTIONS[loser].name + ' left the field.');
  };

  /* End the battle now with a given winner (resign uses it; so do the tests and harnesses). */
  g.conclude = function (winner, reason) {
    if (!g.state || g.state.phase === 'over') return;
    clearTimers();
    g.busy = false;
    g.thinking = false;
    if (AC.stage && AC.stage.close) AC.stage.close();
    E.endGame(g.state, winner, reason || '', []);
    handleGameOver();
  };

  /* ── wiring ───────────────────────────────────────────────── */

  function wire() {
    const svg = document.getElementById('board');
    // charcoal notes: hold a hidden enemy (or right-click it) to pencil a guess
    let press = null;
    const hiddenUid = function (target) {
      const t = target.closest && target.closest('.token.hidden-unit');
      return t ? t.getAttribute('data-uid') : null;
    };
    svg.addEventListener('pointerdown', function (e) {
      const uid = hiddenUid(e.target);
      if (!uid) return;
      press = { uid: uid, x: e.clientX, y: e.clientY, timer: setTimeout(function () { press.fired = true; openNote(uid); }, 480) };
    });
    const cancelPress = function (e) {
      if (!press) return;
      if (e && e.type === 'pointermove' && Math.hypot(e.clientX - press.x, e.clientY - press.y) < 10) return;
      clearTimeout(press.timer);
      if (!press.fired) press = null;
    };
    ['pointerup', 'pointercancel', 'pointerleave', 'pointermove'].forEach(function (t) { svg.addEventListener(t, cancelPress); });
    svg.addEventListener('contextmenu', function (e) {
      const uid = hiddenUid(e.target);
      if (!uid) return;
      e.preventDefault();
      if (press && press.fired) return;
      openNote(uid);
    });
    svg.addEventListener('click', function (e) {
      if (press && press.fired) { press = null; return; }   // the hold opened a note; this is its release
      if (g.skipPace()) return;
      const cell = e.target.closest('[data-id]');
      if (!cell) return;
      onCell(cell.getAttribute('data-id'));
    });
    svg.addEventListener('pointerover', function (e) {
      const cell = e.target.closest('[data-id]');
      if (!cell || !g.state || g.state.phase !== 'battle') return;
      const id = cell.getAttribute('data-id');
      const u = g.state.board[id];
      const viewer = viewerOf(g.state);
      if (u && u.owner !== viewer && !u.revealed && g.focus !== id) {
        g.focus = id;
        renderIntel();
      }
    });
    // turning the phone turns the square fields with it (see turnBoard); wheel and lotus never change
    if (typeof matchMedia === 'function') {
      const mqSide = matchMedia(TURN_Q);
      const redrawTurned = function () {
        if (g.state && G.build(g.state.boardKey).kind === 'square' && $('#board')) renderBoard();
      };
      if (mqSide.addEventListener) mqSide.addEventListener('change', redrawTurned); else if (mqSide.addListener) mqSide.addListener(redrawTurned);
    }
    svg.addEventListener('keydown', function (e) {
      const cell = e.target.closest('[data-id]');
      if (!cell) return;
      const id = cell.getAttribute('data-id');
      const b = board();
      const c = b.byId[id];
      if (!c) return;
      let nextId = null;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const dx = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
        const dy = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
        let best = null;
        let bestScore = 1e9;
        b.cells.forEach(function (other) {
          if (other.id === id) return;
          const vx = other.x - c.x;
          const vy = other.y - c.y;
          const along = vx * dx + vy * dy;
          if (along <= 0.05) return;
          const off = Math.abs(vx * dy - vy * dx);
          const score = off * 2 + along;
          if (score < bestScore) { bestScore = score; best = other.id; }
        });
        nextId = best;
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onCell(id);
        return;
      } else {
        return;
      }
      e.preventDefault();
      if (nextId) {
        const el = svg.querySelector('[data-id="' + nextId + '"]');
        if (el) el.focus();
      }
    });

    const bar = document.getElementById('action-bar');
    bar.addEventListener('click', function (e) {
      if (g.busy) return;
      const preset = e.target.closest('[data-preset]');
      if (preset) { deployPreset(preset.getAttribute('data-preset')); return; }
      const deploy = e.target.closest('[data-deploy]');
      if (deploy) {
        const what = deploy.getAttribute('data-deploy');
        if (what === 'lock') lockFormation();
        if (what === 'save') keepFormation();
        return;
      }
      if (e.target.closest('[data-formation]')) { applySavedFormation(); return; }
      const astraBtn = e.target.closest('[data-astra]');
      if (astraBtn) { enterAstra(astraBtn.getAttribute('data-astra')); return; }
      const mode = e.target.closest('[data-mode]');
      if (mode) { g.mode = mode.getAttribute('data-mode'); g.armed = null; sfx('ui'); render(); return; }
      const act = e.target.closest('[data-act]');
      if (act) {
        const what = act.getAttribute('data-act');
        if (what === 'deselect') { resetSelection(); sfx('deselect'); render(); }
        if (what === 'cancel-astra') cancelAstra();
        if (what === 'confirm') confirmArmed();
        if (what === 'cancel-strike') { g.armed = null; sfx('deselect'); render(); }
        if (what === 'advisor') { sfx('ui'); openAdvisor(); }
        return;
      }
      const over = e.target.closest('[data-over]');
      if (over) {
        const what = over.getAttribute('data-over');
        if (what === 'home') { g.state = null; AC.ui.show('home'); }
        if (what === 'codex') AC.ui.openCodex();
        if (what === 'rematch') g.start(g.state.config);
      }
    });

    document.getElementById('btn-game-menu').addEventListener('click', function () { sfx('ui'); AC.ui.openPause(); });
    document.getElementById('btn-hud-settings').addEventListener('click', function () { sfx('ui'); AC.ui.openSettings(); });
    const fullBtn = document.getElementById('btn-hud-full');
    if (fullBtn) fullBtn.addEventListener('click', function () {
      sfx('ui');
      if (document.fullscreenElement) leaveFull(); else enterFull();
    });
    document.addEventListener('fullscreenchange', function () { if (g.state) renderHud(); });
    document.getElementById('btn-hud-intel').addEventListener('click', function () {
      sfx('ui');
      const panel = document.getElementById('intel-panel');
      const scrim = document.getElementById('scrim');
      const open = panel.classList.toggle('open');
      if (scrim) scrim.classList.toggle('on', open);
    });
    document.getElementById('btn-hud-log').addEventListener('click', function () {
      sfx('ui');
      const panel = document.getElementById('log-panel');
      const scrim = document.getElementById('scrim');
      const open = panel.classList.toggle('open');
      if (scrim) scrim.classList.toggle('on', open);
    });
    document.getElementById('battle-log').addEventListener('click', function (e) {
      const entry = e.target.closest('[data-cells]');
      if (!entry || !g.state) return;
      sfx('ui');
      // where the drawer covers the field, step it aside so the marked cells can be seen
      if (window.matchMedia && window.matchMedia('(max-width: 1080px)').matches) {
        document.getElementById('log-panel').classList.remove('open');
        document.getElementById('scrim').classList.remove('on');
      }
      markCells(entry.getAttribute('data-cells').split(' '));
    });
    document.getElementById('btn-log-close').addEventListener('click', function () {
      sfx('ui');
      document.getElementById('log-panel').classList.remove('open');
      document.getElementById('scrim').classList.remove('on');
    });
    document.getElementById('scrim').addEventListener('click', function () {
      document.getElementById('log-panel').classList.remove('open');
      document.getElementById('intel-panel').classList.remove('open');
      document.getElementById('scrim').classList.remove('on');
    });
    const sky = document.getElementById('hud-sky');
    if (sky) sky.addEventListener('click', function () { sfx('ui'); g.openIntel(); });
    const vow = document.getElementById('hud-vow');
    if (vow) vow.addEventListener('click', function () { sfx('ui'); showVow(); });
  }

  g.wire = wire;
  g.render = render;
  g.tile = onCell;
  g.advisor = openAdvisor;
  g.perform = performAction;
  g.enterAstra = enterAstra;
  g.speak = speak;

  AC.game = g;
})(typeof globalThis !== 'undefined' ? globalThis : this);
