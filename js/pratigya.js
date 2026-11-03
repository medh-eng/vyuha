/* VYUHA — Pratigya (प्रतिज्ञा): secret vows (Chapter IV)
 * Before an AI duel the player may take one vow. Keeping it earns vow
 * stars toward cosmetic titles and stamps; nothing here changes combat.
 * Pure: reads the engine's per-side chronicle and the final state.
 * Text is English here; Hindi/Marathi arrive through the string catalogue
 * under `vow.<key>.name` / `vow.<key>.rule` (Sarvam, Batch 5).
 */
(function (root) {
  'use strict';
  const AC = (root.AC = root.AC || {});

  function chron(state, owner) {
    return (state.chronicle && state.chronicle[owner]) || {};
  }
  function myAstras(state, owner) {
    return (state.astraLog || []).filter(function (a) { return a.owner === owner; });
  }
  function aliveFighters(state, owner) {
    let n = 0;
    Object.keys(state.board || {}).forEach(function (id) {
      const u = state.board[id];
      if (u && u.owner === owner && u.key !== 'F' && u.key !== 'B') n++;
    });
    return n;
  }

  /* needs: the rule layers a vow depends on. stars: reward. stamp: cosmetic id.
   * test(state, owner) → true when kept (only asked after a win). */
  const VOWS = [
    { key: 'restraint', deva: 'संयम', name: 'Bhishma’s restraint', stars: 2, stamp: 'restraint',
      rule: 'Win without your Senapati ever striking.',
      test: function (s, o) { return !chron(s, o).senapatiStruck; } },
    { key: 'guarded', deva: 'रक्षा', name: 'The guarded fort', stars: 1, stamp: 'shield', needs: ['gates'],
      rule: 'Win with your own fort gate never broken.',
      test: function (s, o) { return !chron(s, o).gateBroken; } },
    { key: 'clear-eyes', deva: 'दृष्टि', name: 'Clear eyes', stars: 1, stamp: 'scout',
      rule: 'Win after your Divyadrishti reveals two different enemies.',
      test: function (s, o) { return (chron(s, o).scanned || []).length >= 2; } },
    { key: 'engineer', deva: 'यंत्रिक', name: 'The patient engineer', stars: 1, stamp: 'engineer',
      rule: 'Win after a Yantrik dismantles the Shataghni.',
      test: function (s, o) { return (chron(s, o).dismantled || 0) >= 1; } },
    { key: 'open-road', deva: 'पथ', name: 'The open road', stars: 1, stamp: 'chariot',
      rule: 'Win after one Rath makes two runs of three cells or more without striking.',
      test: function (s, o) {
        const runs = chron(s, o).rathRuns || {};
        return Object.keys(runs).some(function (k) { return runs[k] >= 2; });
      } },
    { key: 'dawn-watch', deva: 'प्रहर', name: 'Dawn watch', stars: 2, stamp: 'sky', needs: ['hours'],
      rule: 'Win after taking a piece by day and another by night.',
      test: function (s, o) { const c = chron(s, o); return c.capDay >= 1 && c.capNight >= 1; } },
    { key: 'joined-hands', deva: 'संगति', name: 'Joined hands', stars: 1, stamp: 'formation', needs: ['vyuha'],
      rule: 'Win after two captures with the Makara bonus.',
      test: function (s, o) { return (chron(s, o).makaraCaps || 0) >= 2; } },
    { key: 'petal-guard', deva: 'पद्म', name: 'Petal guard', stars: 1, stamp: 'lotus', needs: ['vyuha'],
      rule: 'Win after a piece guarded by Padma throws back an attack.',
      test: function (s, o) { return (chron(s, o).padmaHolds || 0) >= 1; } },
    { key: 'single-flame', deva: 'दीप', name: 'A single flame', stars: 2, stamp: 'lamp', needs: ['astras'],
      rule: 'Win after invoking exactly one astra.',
      test: function (s, o) { return myAstras(s, o).length === 1; } },
    { key: 'without-fire', deva: 'धैर्य', name: 'Without fire', stars: 1, stamp: 'brass', needs: ['astras'],
      rule: 'Win without invoking Agneyastra or Brahmastra.',
      test: function (s, o) {
        return !myAstras(s, o).some(function (a) { return a.astra === 'agneya' || a.astra === 'brahma'; });
      } },
    { key: 'companions', deva: 'साथ', name: 'Companions return', stars: 2, stamp: 'camp',
      rule: 'Win with at least six of your fighting pieces alive.',
      test: function (s, o) { return aliveFighters(s, o) >= 6; } },
    { key: 'breach-early', deva: 'प्रवेश', name: 'Breach before sunset', stars: 2, stamp: 'gate',
      rule: 'Win by taking the enemy fort within 20 rounds.',
      test: function (s, o) { return !!chron(s, o).tookFort && s.turn <= 20; } }
  ];

  const BY_KEY = {};
  VOWS.forEach(function (v) { BY_KEY[v.key] = v; });

  /* Titles earned by vow stars — never lost, cosmetic only. */
  const TITLES = [
    { stars: 3, key: 'vrati', name: 'Vrati', deva: 'व्रती' },
    { stars: 10, key: 'dridhavrata', name: 'Dridhavrata', deva: 'दृढ़व्रत' },
    { stars: 25, key: 'satyavrata', name: 'Satyavrata', deva: 'सत्यव्रत' }
  ];

  function eligible(rules) {
    rules = rules || {};
    return VOWS.filter(function (v) {
      return (v.needs || []).every(function (n) { return rules[n] !== false; });
    });
  }

  /* Three vows to choose from; `rng` is optional (tests pass a seeded one). */
  function offer(rules, rng, n) {
    const pool = eligible(rules).slice();
    const r = rng || Math.random;
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      const t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    return pool.slice(0, n || 3);
  }

  /* Only AI duels carry a vow: not the lesson, the Daily or a scenario. */
  function allowed(state) {
    return !!state && state.config && state.config.mode === 'ai' &&
      (!state.scenario || state.scenario === 'duel');
  }

  /* After the battle: { kept, vow }. A vow is kept only with a win. */
  function judge(state, owner, key) {
    const v = BY_KEY[key];
    if (!v) return null;
    const kept = state.phase === 'over' && state.winner === owner && !!v.test(state, owner);
    return { kept: kept, vow: v };
  }

  function titleFor(stars) {
    let t = null;
    TITLES.forEach(function (x) { if (stars >= x.stars) t = x; });
    return t;
  }

  function nextTitle(stars) {
    for (let i = 0; i < TITLES.length; i++) if (stars < TITLES[i].stars) return TITLES[i];
    return null;
  }

  AC.pratigya = {
    VOWS: VOWS,
    TITLES: TITLES,
    get: function (k) { return BY_KEY[k] || null; },
    eligible: eligible,
    offer: offer,
    allowed: allowed,
    judge: judge,
    titleFor: titleFor,
    nextTitle: nextTitle
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
