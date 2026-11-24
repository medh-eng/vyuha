/* VYUHA — the primer: "Know the battlefield" and "The rules, one at a time".
 *
 * Two guided screens that come before the lessons (Commander, 24 Nov 2026):
 *   1. The battlefield — what the board is, the two armies, and every warrior:
 *      tap an icon, see its painting large beside a panel that explains it.
 *   2. The rules — one rule per card, zoomed in, with a picture.
 * Text is typed out letter by letter with a soft key sound. A tap on the text
 * finishes the line at once; Reduced motion and Mute are respected.
 * No infinite animation anywhere: the typing is a timer that stops by itself.
 * Strings are English with tr() keys; Hindi and Marathi go to Sarvam.
 * Attaches to global AC.primer
 */
(function (root) {
  'use strict';
  const AC = (root.AC = root.AC || {});
  const U = AC.units, L = AC.i18n, A = AC.art;
  const tr = function (key, fallback) { return L.text(key, fallback); };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function sfx(name) { try { AC.audio.play(name); } catch (e) { /* audio must never break the screen */ } }

  /* ── typewriter ─────────────────────────────────────────────── */
  const CHAR_MS = 22, PAUSE_MS = 150;

  /* `host` holds a ghost (the whole text, invisible, so the box never changes size)
     and the typed copy on top. Returns nothing; tap the host to finish early. */
  function typeInto(host, text) {
    const typed = host.querySelector('.pm-typed');
    const ghost = host.querySelector('.pm-ghost');
    ghost.textContent = text;
    const token = {};
    host._tw = token;
    const finish = function () {
      if (host._tw !== token) return;
      host._tw = null;
      typed.textContent = text;
      host.classList.remove('typing');
    };
    host._finish = finish;
    if (document.documentElement.classList.contains('reduce-motion')) { typed.textContent = text; return; }
    host.classList.add('typing');
    typed.textContent = '';
    let i = 0;
    (function step() {
      if (host._tw !== token) return;
      if (!host.isConnected) { host._tw = null; return; }
      i++;
      typed.textContent = text.slice(0, i);
      const ch = text.charAt(i - 1);
      if (ch.trim() && i % 2 === 0) sfx('type');
      if (i >= text.length) { finish(); return; }
      setTimeout(step, /[.,;:—?!]/.test(ch) ? PAUSE_MS : CHAR_MS);
    })();
  }
  function typeHtml(id, text) {
    return '<div class="pm-line" id="' + id + '"><span class="pm-ghost" aria-hidden="true"></span><span class="pm-typed" aria-label="' + esc(text) + '"></span></div>';
  }

  /* ── pictures ───────────────────────────────────────────────── */
  const SLUG = {
    '10': 'senapati', '9': 'maharathi', '7': 'ashvarohi', '6': 'dhanurdhar', '5': 'divyadrishti',
    '3': 'yantrik', '2': 'rath', '1': 'chara', 'B': 'shataghni', 'F': 'durg'
  };
  function pieceSrc(key, army, state) {
    return 'assets/art/pata/pieces/' + (army === 2 ? 'chandra' : 'surya') + '-' + SLUG[key] + (state ? '-' + state : '') + '.webp';
  }
  function fig(src, caption, cls) {
    return '<figure class="pm-fig ' + (cls || '') + '"><img src="' + src + '" alt="" draggable="false"><figcaption>' + esc(caption) + '</figcaption></figure>';
  }
  function piece(key, army, caption, state) { return fig(pieceSrc(key, army, state), caption); }
  function hiddenPiece(caption) { return fig('assets/art/pata/pieces/hidden.webp', caption); }
  function arrow() { return '<span class="pm-arrow" aria-hidden="true">→</span>'; }

  function dots(n, at) {
    let h = '';
    for (let i = 0; i < n; i++) h += '<i class="' + (i === at ? 'on' : i < at ? 'done' : '') + '"></i>';
    return '<span class="pm-dots" aria-hidden="true">' + h + '</span>';
  }

  function nav(n, at, last) {
    return '<div class="pm-nav">' +
      '<button class="btn btn-ghost" data-pm="back"' + (at === 0 ? ' disabled' : '') + '>' + esc(tr('primer.back', 'Back')) + '</button>' +
      dots(n, at) +
      '<button class="btn btn-primary" data-pm="next">' + esc(last) + '</button></div>';
  }

  /* ══ 1. The battlefield ═══════════════════════════════════════ */
  const FIELD_PAGES = ['board', 'armies', 'warriors'];

  function openBattlefield(opts) {
    opts = opts || {};
    let page = 0;
    let army = 1;                 // which army's paintings the warriors page shows
    let pick = '10';
    const seen = {};
    let m = null;

    function warriorsBody() {
      const u = L.unit(pick);
      const def = U.UNIT_DEFS[pick];
      const strength = def.rank > 0 ? tr('primer.strength', 'Strength') + ' ' + def.rank : (pick === 'B' ? tr('primer.trap', 'Trap') : tr('primer.fort', 'Fort'));
      const count = def.count > 1 ? '×' + def.count + ' ' + tr('primer.in_army', 'in each army') : '×1 ' + tr('primer.in_army', 'in each army');
      const move = !def.movable ? tr('primer.never_moves', 'Never moves')
        : def.moveRange >= 99 ? tr('primer.slides', 'Slides as far as the lane is open')
        : def.moveRange === 2 ? tr('primer.two_cells', 'Moves up to two cells')
        : tr('primer.one_cell', 'Moves one cell');
      const count10 = Object.keys(seen).filter(function (k) { return seen[k]; }).length;
      return '<div class="pm-split pm-warriors">' +
        '<div class="pm-pick">' +
          '<div class="pm-army-switch" role="group">' +
            '<button class="' + (army === 1 ? 'on' : '') + '" data-army="1">' + esc(U.FACTIONS[1].name) + '</button>' +
            '<button class="' + (army === 2 ? 'on' : '') + '" data-army="2">' + esc(U.FACTIONS[2].name) + '</button></div>' +
          '<div class="pm-icons">' + U.RANK_ORDER.map(function (k) {
            const d = U.UNIT_DEFS[k];
            return '<button class="pm-icon' + (k === pick ? ' on' : '') + (seen[k] ? ' seen' : '') + '" data-pick="' + k + '" aria-label="' + esc(d.name) + '">' +
              '<img src="' + pieceSrc(k, army) + '" alt="" draggable="false"><span>' + esc(d.short) + '</span></button>';
          }).join('') + '</div>' +
          '<p class="pm-progress">' + esc(tr('primer.tap_each', 'Tap each warrior.')) + ' <b>' + count10 + ' / ' + U.RANK_ORDER.length + '</b></p>' +
        '</div>' +
        '<aside class="pm-panel">' +
          '<div class="pm-big"><img src="' + pieceSrc(pick, army) + '" alt="" draggable="false"></div>' +
          '<div class="pm-info">' +
            '<div class="pm-name">' + esc(u.name) + (u.deva ? ' <span class="deva">' + esc(u.deva) + '</span>' : '') + '</div>' +
            '<div class="pm-tags"><span>' + esc(u.role) + '</span><span>' + esc(strength) + '</span><span>' + esc(count) + '</span><span>' + esc(move) + '</span></div>' +
            typeHtml('pm-type', (u.one ? u.one + ' ' : '') + u.desc) +
            '<p class="pm-tip">▸ ' + esc(u.tip) + '</p>' +
          '</div>' +
        '</aside></div>';
    }

    function pageBody() {
      const k = FIELD_PAGES[page];
      if (k === 'board') {
        return '<div class="pm-split">' +
          '<div class="pm-pic pm-pic-field"><img src="assets/art/pata/fields/chakra-day.webp" alt="" draggable="false"></div>' +
          '<div class="pm-text">' +
            '<h3>' + esc(tr('primer.board.h', 'The board')) + ' <span class="deva">चक्रव्यूह</span></h3>' +
            typeHtml('pm-type', tr('primer.board.t', 'This painted wheel is the board, the Chakravyuha. Every piece stands on a cell. Spokes run in towards the centre and rings run around it, and pieces travel along these lanes. Two armies face each other, one on each half. You arrange yours first, in secret, then the battle begins.')) +
            '<ul class="pm-points">' +
              '<li>' + esc(tr('primer.board.p1', 'Cells hold one piece each.')) + '</li>' +
              '<li>' + esc(tr('primer.board.p2', 'Move along the lanes, one piece per turn.')) + '</li>' +
              '<li>' + esc(tr('primer.board.p3', 'Every fifth round the two inner rings turn.')) + '</li>' +
            '</ul>' +
          '</div></div>';
      }
      if (k === 'armies') {
        const s = U.FACTIONS[1], c = U.FACTIONS[2];
        return '<div class="pm-armies">' +
          '<div class="pm-army sun">' + fig(pieceSrc('10', 1), s.name) +
            '<div><h3>' + esc(s.name) + ' <span class="deva">' + esc(s.deva) + '</span></h3>' +
            '<p>' + esc(tr('primer.sun.t', 'Warriors of the sun, painted in vermilion. Their hour is the day: in full battles every Suryavansh strike lands at +1 while the sun is up.')) + '</p></div></div>' +
          '<div class="pm-army moon">' + fig(pieceSrc('10', 2), c.name) +
            '<div><h3>' + esc(c.name) + ' <span class="deva">' + esc(c.deva) + '</span></h3>' +
            '<p>' + esc(tr('primer.moon.t', 'Warriors of the moon, painted in indigo. Their hour is the night: in full battles every Chandravansh strike lands at +1 after dark.')) + '</p></div></div>' +
          '<div class="pm-armies-note">' +
            hiddenPiece(tr('primer.hidden', 'A rank you cannot see')) +
            '<div>' + typeHtml('pm-type', tr('primer.armies.t', 'Each army has the same twelve warriors. You always see your own ranks. The enemy shows only a veiled figure with a ? until it fights, or you look at it. That is the whole game: guess well.')) + '</div>' +
          '</div></div>';
      }
      return warriorsBody();
    }

    function render(first) {
      const last = page === FIELD_PAGES.length - 1;
      const title = [tr('primer.board.k', 'The board'), tr('primer.armies.k', 'The two armies'), tr('primer.warriors.k', 'Your warriors')][page];
      m.setBody('<div class="pm" data-page="' + FIELD_PAGES[page] + '">' + pageBody() +
        nav(FIELD_PAGES.length, page, last ? tr('primer.to_rules', 'Now the rules') : tr('primer.next', 'Next')) + '</div>');
      m.el.querySelector('.modal-kicker').textContent = tr('primer.kicker', 'Pehla Yuddh · know the battlefield') + ' · ' + (page + 1) + ' / ' + FIELD_PAGES.length;
      m.el.querySelector('.modal-title').textContent = title;
      const line = m.el.querySelector('#pm-type');
      if (line) typeInto(line, line.querySelector('.pm-typed').getAttribute('aria-label'));
      if (!first) sfx('select');
    }

    m = AC.ui.modal({
      kicker: '·', title: '·', wide: true, body: '',
      actions: [],
      onClose: function () { if (opts.onClose) opts.onClose(); }
    });
    m.el.classList.add('primer');
    m.el.addEventListener('click', function (e) {
      const line = e.target.closest('.pm-line');
      if (line && line._finish) { line._finish(); }
      const a = e.target.closest('[data-army]');
      if (a) { army = +a.getAttribute('data-army'); sfx('select'); render(true); return; }
      const p = e.target.closest('[data-pick]');
      if (p) { pick = p.getAttribute('data-pick'); seen[pick] = true; sfx('select'); render(true); return; }
      const b = e.target.closest('[data-pm]');
      if (!b) return;
      const what = b.getAttribute('data-pm');
      if (what === 'back' && page > 0) { page--; render(); return; }
      if (what === 'next') {
        if (page < FIELD_PAGES.length - 1) { page++; if (FIELD_PAGES[page] === 'warriors') seen[pick] = true; render(); return; }
        try { AC.ui.patchSettings({ primerSeen: true }); } catch (err) { /* ignore */ }
        m.close();
        openRules({ onDone: opts.onDone });
      }
    });
    render(true);
    return m;
  }

  /* ══ 2. The rules, one at a time ══════════════════════════════ */
  const RULES = [
    { key: 'goal', deva: 'दुर्ग', title: 'The goal: take the fort',
      text: 'Every army guards a Durg, its fort. Strike the enemy fort and its gate breaks. Strike it again and the fort falls, and the battle is yours. If the enemy has no move left at all, they must give up.',
      pic: function () { return '<div class="pm-row">' + piece('F', 2, tr('primer.gate_stands', 'Gate stands')) + arrow() + piece('F', 2, tr('primer.gate_broken', 'First blow: gate breaks'), 'broken') + arrow() + piece('F', 2, tr('primer.fort_taken', 'Second blow: fort taken'), 'fallen') + '</div>'; } },
    { key: 'move', deva: 'चाल', title: 'Moving',
      text: 'On your turn, move one piece along the lanes. Most pieces step one cell. The Rath slides as far as the lane is open, and the Ashvarohi goes up to two cells. The Shataghni and the Durg never move. A piece may not shuttle between the same two cells more than three times in a row.',
      pic: function () { return '<div class="pm-row">' + piece('9', 1, tr('primer.one_cell', 'Moves one cell')) + piece('7', 1, tr('primer.two_cells', 'Moves up to two cells')) + piece('2', 1, tr('primer.slides_short', 'Slides')) + '</div>'; } },
    { key: 'hidden', deva: 'गुप्त', title: 'Hidden ranks',
      text: 'You see your own ranks. An enemy piece shows only a veiled figure with a ? until it is revealed. A piece is revealed when it fights, when your Divyadrishti looks at it, or when a Rath runs two cells or more. Use the Intel button to see what is still hidden.',
      pic: function () { return '<div class="pm-row">' + piece('9', 1, tr('primer.yours', 'Yours: you see it')) + hiddenPiece(tr('primer.theirs', 'Theirs: a mystery')) + arrow() + piece('5', 2, tr('primer.revealed', 'Revealed')) + '</div>'; } },
    { key: 'clash', deva: 'संघर्ष', title: 'The clash',
      text: 'When you strike, the two ranks are compared. The higher rank wins and the other piece is removed. When the ranks are equal, the battle setting decides: either the attacker wins with a cracked shield, or both fall. The hour and formations can add up to +2.',
      pic: function () { return '<div class="pm-row">' + piece('9', 1, tr('primer.rank9', 'Rank 9')) + '<span class="pm-vs">vs</span>' + piece('5', 2, tr('primer.rank5', 'Rank 5')) + arrow() + piece('9', 1, tr('primer.wins', 'Higher rank wins')) + '</div>'; } },
    { key: 'trap', deva: 'शतघ्नी', title: 'Traps and the engineer',
      text: 'The Shataghni is a trap. It never moves, and any piece that strikes it dies. Only the Yantrik, the engineer, can take it apart. So a piece that has never moved may be a trap or the fort. Send a cheap piece to find out, not a commander.',
      pic: function () { return '<div class="pm-row">' + piece('B', 2, tr('primer.trap_dies', 'Kills what strikes it')) + '<span class="pm-vs">×</span>' + piece('3', 1, tr('primer.engineer', 'Yantrik clears it')) + '</div>'; } },
    { key: 'spy', deva: 'चर', title: 'The spy',
      text: 'The Chara is weak, but if it strikes first it kills the Senapati or the Maharathi, whatever the hour. Against anything else it loses. Guard your commanders from it.',
      pic: function () { return '<div class="pm-row">' + piece('1', 1, tr('primer.rank1', 'Chara, rank 1')) + arrow() + piece('10', 2, tr('primer.falls', 'Senapati falls')) + '</div>'; } },
    { key: 'sky', deva: 'दिनमान · रात्रि', title: 'Day and night',
      text: 'In full battles the sky has two hours. By day, Suryavansh strikes land at +1. By night, Chandravansh strikes land at +1. The sky turns every fifth round. The top of the screen shows whose hour it is and how long it lasts.',
      pic: function () { return '<div class="pm-row pm-sky"><figure class="pm-fig sun">' + A.icon('sun') + '<figcaption>' + esc(U.FACTIONS[1].name + ' +1') + '</figcaption></figure>' + arrow() +
        '<figure class="pm-fig moon">' + A.icon('moon') + '<figcaption>' + esc(U.FACTIONS[2].name + ' +1') + '</figcaption></figure></div>'; } },
    { key: 'form', deva: 'मकर · पद्म', title: 'Formations',
      text: 'Fight together. Makara, the jaws: strike an enemy that another of your pieces already touches and you hit at +1. Padma, the lotus: a piece touched by two of its friends defends at +1. Hour and formation together never add more than +2.',
      pic: function () { return '<div class="pm-row">' + piece('6', 1, 'Makara +1') + piece('9', 1, tr('primer.pincer', 'Two jaws')) + arrow() + piece('3', 2, tr('primer.caught', 'The enemy')) + '</div>'; } },
    { key: 'wheel', deva: 'चक्र', title: 'The turning wheel',
      text: 'On the Chakravyuha, every fifth round the two inner rings turn one cell clockwise. They carry whatever stands on them, and a piece carried round is revealed. Dashed rings show where each piece will land.',
      pic: function () { return '<div class="pm-pic pm-pic-field small"><img src="assets/art/pata/fields/chakra-day.webp" alt="" draggable="false"></div>'; } },
    { key: 'shakti', deva: 'शक्ति · अस्त्र', title: 'Shakti and astras',
      text: 'Shakti is a row of lamps, five at most. You gain one for every piece you take, and both armies gain one when the sky turns. Spend it on an astra, once per battle, using your whole turn. No deity is ever a piece: the astras are only called.',
      pic: function () {
        return '<div class="pm-row pm-astras">' + ['vayavya', 'sammohana', 'agneya', 'brahma'].map(function (k) {
          const a = L.astra(k);
          return fig('assets/art/pata/astras/' + k + '.webp', a.name + ' · ' + a.cost, 'astra');
        }).join('') + '</div>';
      } },
    { key: 'end', deva: 'विराम', title: 'Ceasefire',
      text: 'If no piece falls for a long stretch, or the last round ends, the stronger army holds the field. Add up the ranks of the fighting pieces, with +5 for a fort whose gate still stands. The Intel button shows both sums.',
      pic: function () { return '<div class="pm-row">' + piece('F', 1, tr('primer.gate_stands', 'Gate stands') + ' +5') + '</div>'; } }
  ];

  function openRules(opts) {
    opts = opts || {};
    let at = Math.max(0, Math.min(RULES.length - 1, opts.at || 0));
    let m = null;

    function render(first) {
      const r = RULES[at];
      const last = at === RULES.length - 1;
      m.el.querySelector('.modal-kicker').textContent = tr('primer.rules.k', 'The rules, one at a time') + ' · ' + (at + 1) + ' / ' + RULES.length;
      m.el.querySelector('.modal-title').textContent = tr('rule.' + r.key + '.h', r.title);
      m.setBody('<div class="pm pm-rule" data-rule="' + r.key + '"><div class="pm-split">' +
        '<div class="pm-pic">' + r.pic() + '</div>' +
        '<div class="pm-text"><div class="pm-deva deva">' + esc(r.deva) + '</div>' + typeHtml('pm-type', tr('rule.' + r.key + '.t', r.text)) + '</div></div>' +
        nav(RULES.length, at, last ? (opts.onDone ? tr('primer.to_lessons', 'Start the lessons') : tr('primer.done', 'Done')) : tr('primer.next', 'Next')) + '</div>');
      const line = m.el.querySelector('#pm-type');
      typeInto(line, line.querySelector('.pm-typed').getAttribute('aria-label'));
      if (!first) sfx('select');
    }

    m = AC.ui.modal({ kicker: '·', title: '·', wide: true, body: '', actions: [] });
    m.el.classList.add('primer');
    m.el.addEventListener('click', function (e) {
      const line = e.target.closest('.pm-line');
      if (line && line._finish) line._finish();
      const b = e.target.closest('[data-pm]');
      if (!b) return;
      if (b.getAttribute('data-pm') === 'back' && at > 0) { at--; render(); return; }
      if (b.getAttribute('data-pm') === 'next') {
        if (at < RULES.length - 1) { at++; render(); return; }
        m.close();
        if (opts.onDone) opts.onDone();
      }
    });
    render(true);
    return m;
  }

  AC.primer = { openBattlefield: openBattlefield, openRules: openRules, RULES: RULES, typeInto: typeInto };
})(typeof window !== 'undefined' ? window : globalThis);
