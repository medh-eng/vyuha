# VYUHA — roadmap and status

The live status board. Ticked = on `main` and playable. Owner tags: **[C]** Commander (Pon),
**[D]** Director (Claude), **[G]** ChatGPT, **[S]** Sarvam AI.

The working queue is [`TASKS.md`](../TASKS.md); this file is the chapter board.

Last updated: **13 Nov 2026** — hard review and four-part plan (`docs/REVIEW.md`); Part 1 in a PR: scenario paintings, the ladder, home and result card sideways.
Earlier: **7 Nov 2026** — new night fields, sideways square fields, `DESIGN.md`/`TASKS.md`/`data/`; first-session clarity (PR #21, merged) and the wheel turn made visible (step 3, PR open).
Earlier: **3 Nov 2026** — *Rang* look plan accepted (`docs/LOOK.md`); Chapter IV first slice
in PR #12: Pratigya vows playable, hero engine for four passive heroes (hidden until screened).
History: `docs/WORKLOG.md`.

---

## Chapter III — complete ✅ (1 Nov 2026)

- [x] **[D]** Foundations: gate (two blows), first-move balance, fort never on the front line, honest AI, ceasefire instead of draws, no sci-fi strings
- [x] **[D]** Cool phone: no idle animation loops (every screen < 3 % busy, portrait and landscape); battery saver; audio pauses in the background
- [x] **[D]** The hook: no login wall, **Yuddh karo**, Pehla Yuddh lesson, Daily Chakravyuha with streaks and WhatsApp share
- [x] **[D]** Hours, Makara/Padma formations, Shakti and four astras with films, clash cinematics, odds on the board
- [x] **[D][G]** **Calm pace** (default) and Quick: one moment at a time, Sanjaya over the effect's tail, AI thinks while he speaks — clash → AI 6.7 s → 3.8 s (`docs/PACING.md`)
- [x] **[D][G]** **Phone landscape**: status rail · field · action rail; rotation keeps the turn (`docs/LANDSCAPE.md`)
- [x] **[G][S]** **Interface in English, हिन्दी, मराठी** (Settings); Sanjaya in Hinglish / हिन्दी / English with 88 recorded lines
- [x] **[C][G]** Art: ten hero/Sanjaya avatars, Padma board, day/night skies, astra stills and films, Daily card, share preview
- [x] **[C][S]** Sound: core pack, trap, day/night/Daily/lesson/Abhimanyu/victory music
- [x] **[D]** Profile hub: record, level per opponent, avatar, frame/tint/badge, own photo (on device)
- [x] **[D][G]** Daily Catalogue II (1 Nov, 21 variants) and **III (3 Nov, 28 variants)** — each passed two fresh seed banks (`docs/balance/`)

## Waiting on people (not code)

- [ ] **[C]** Phone test: three Calm battles, one Quick, portrait and landscape; warmth after 10–20 min
- [ ] **[C]** Five real people play Pehla Yuddh and one Daily on their own phones (`incoming/text/playtest.md`); notes below
- [x] **[S]** Record 18 lines whose text changed in review + 4 shorter routine lines — done 15 Nov, guard cleared (Batch 6.2-6.3)
- [ ] **[S]** A native speaker reads the Marathi interface
- [ ] **[C][G]** Art still open: full-screen effects, gate-breach art, store art (`docs/prompts/ART.md`)
- [ ] **[C]** Respect review by at least three players from different backgrounds (`DIRECTOR.md` §6)

## Chapter IV · Rang — the new look, *Sanjaya's Pata* (accepted 3 Nov 2026)

Plan: `docs/LOOK.md` (full doc with pictures: <https://claude.ai/artifact/D1JS6qLuZEVKt3zEiFppy2>).
Engine and rules untouched; runs beside the hero work.

- [x] **[D]** Plan and prompt pack `docs/prompts/PATA.md`
- [ ] **[C]** Seven decisions in `docs/LOOK.md` (confirm or change)
- [x] **[D]** Phase 0: skin system (Settings → Look (preview), `?skin=`), "Classic bronze" default, three looks to try on a phone (`rang.html`, removed 6 Nov — in git history), stand-in painted figures, 32 px sheet (`tools/legibility.mjs`)
- [x] **[C]** **Gate 1** — Pata chosen: the Commander made its full Phase 1 art set (5 Nov)
- [x] **[C]** Phase 1 art and sound (`PATA.md` §1–6): 35 images + 11 sounds arrived 5 Nov
- [x] **[D]** Phase 1 wiring: painted pieces, hidden sketch, fort gate states, painted Chakravyuha day/night, home chamber + lamp, Sanjaya portrait, pakhawaj clashes, cloth sounds, ravanhatta home music (`tools/prepare-pata.py`)
- [x] **[C]** Sound sources settled 7 Nov: ravanhatta and pakhawaj recorded by the Commander, long music Gemini, effects Pixabay (`docs/SOURCES.md`, `data/sounds.json`)
- [x] **[D]** Phase 1, rest: reveal colour-flood + sting, banners where pieces fall, sky re-dye, every screen in cotton, **Pata is the default look** (Classic bronze in Settings)
- [ ] **[C]** **Gate 2** — beats today's build; 5 people name 8 of 10 pieces at 32 px; idle < 3 %
- [x] **[C]** Phase 2 art: Padmavyuha, Sarvatobhadra, Kurukshetra day/night, nine avatars, four astra stills, reveal brush (6 Nov)
- [x] **[D]** Phase 2 wiring: each field lined up with its cells, avatars and astra stills in the Pata look, brush stroke on reveal, night fields re-dyed and the corner star covered (6 Nov)
- [x] **[C]** Three new night fields in true indigo, no corner star (7 Nov); wheel night field still the earlier painting
- [x] **[D]** Phase 2, rest: scenario cards, story cards and the pass-and-play curtain in Pata (7 Nov; field crops until the Commander's two scenario paintings, T-20)
- [x] **[D]** Phase 3, first part: Sanjaya's Scroll (result screen → painted share image, `js/scroll.js`), charcoal notes (hold or right-click a hidden enemy)
- [ ] **[D]** Phase 3, rest: festival days, haptics on clashes, sound pass
- [ ] **[C]** **Gate 3** — five-person playtest + respect review
- [ ] **[D]** Phase 4: hero cards in the new style, dhvaja banners, folk-art edition, campaign scroll
- [ ] **[C]** Replace today's paintings that carry a corner watermark before any store launch

## Hard review (13 Nov 2026) — `docs/REVIEW.md`

- [x] **[D]** Part 1: scenario paintings in; Yuddh karo ladder Sainik → Dronacharya → Shakuni with the promotion on the result card; home and result card rebuilt for a phone held sideways (PR open)
- [x] **[D]** Part 2: endings shown (fort-fall card for out-of-movers; sunset countdown with bala), Daily briefing wording, Challenge a friend link (PR #27)
- [ ] **[C]** **The gate:** five silent first-session playtests (T-05)
- [ ] **[D]** Part 3: the Seven Vyuhas campaign (one rule a battle), Abhimanyu Escape
- [ ] **[D][C]** Part 4: Hindi/Marathi finished, Android build, store

## First-session clarity — review plan (Gemini + ChatGPT, 6 Nov 2026)

- [x] **[D]** Step 1: board size, labels, goal + chakra countdown in view, contrast, astra states (PR #19)
- [x] **[D]** Step 2: four wheel lessons before the first battle; odds in words (Likely win / Uncertain / Likely loss, Certain once ranks are known); Confirm strike / Cancel (7 Nov, PR #21)
- [x] **[S]** Hindi/Marathi for the 102 pending strings (Sarvam Batch 6.1) — merged 15 Nov, catalogues at 251 keys
- [x] **[D]** Step 3: dashed landing rings one round before the turn, warning, gold cells for exposed enemy ranks after (7 Nov, PR open)
- [x] **[D]** Step 4: battle log from your side — You/Enemy, cell names, your pieces by name, tap to mark cells; Sanjaya's priority table with checks (7 Nov, PR open)
- [ ] **[C]** 5–10 real first-session playtests (lessons → first battle), then puzzles, seven-vyuha campaign, Abhimanyu Escape

## Chapter IV — depth and heroes (next)

- [x] **[D]** **Pratigya** — 12 secret vows (after the first win, AI duels only), stars, three titles (Vrati · Dridhavrata · Satyavrata), stamps; Settings toggle. Cosmetic only (`js/pratigya.js`)
- [x] **[D]** Hero engine: Bhima, Karna, Ghatotkacha, Dhrishtadyumna (`state.heroes`, off unless named; 19 rules tests; `tools/hero-sim.mjs`)
- [ ] **[G]** Screen the four heroes (50–58 % target) — Karna on the Maharathi ran 60.5 % in the first bank
- [ ] **[G]** AI values hero traits (`predict`, `strikeOdds`)
- [ ] **[G]→[D]** Hero card design (`incoming/text/hero-cards-design.md`), then the Director builds the card, the pick and the four active heroes (Arjuna, Drona, Abhimanyu, Bhishma); the card's art and styling wait for Gate 1 of *Rang*
- [x] **[S]** Vow strings in Hindi/Marathi; Sanjaya's vow and hero lines written, respect read done (15 Nov); recordings wait for the Director's approval of the text
- [ ] **[C]** Vow stamps and title seals (`docs/prompts/ART.md`, Chapter IV)
- [ ] **[D]** Campaign map: the seven vyuhas, one lesson each (drafts: `incoming/text/campaign.md`)
- [ ] **[D]** Facing, introduced in the Krauncha chapter
- [ ] **[D]** Marathi narrator (text drafted: `incoming/text/sanjaya-marathi.csv`)
- [x] **[G]** Retuned `quiet-gate` and screened it in two fresh banks. Candidate qualified on both fields. [Results and reproduction](balance/README.md#quiet-gate--15-november-2026). Director to decide catalogue integration.

## Chapter V — social

- [ ] **[D]** Challenge-a-friend link (seeded battle from WhatsApp)
- [ ] **[D]** Replay clip — the best moment as a 10-second vertical video
- [ ] **[D]** Vyuha codes — share a formation as a short code
- [ ] **[D]** Seasons and leaderboards / online play (need a server — decide at launch)

## Launch

- [ ] **[D]** Android build with Capacitor; ship only `assets/` (≈30 MB); masters are outside git (`docs/MASTERS.md`)
- [ ] **[C]** Play Store listing (`incoming/text/store-listing.md`), icon, feature graphic, screenshots, trailer
- [ ] **[C]** Name/trademark search for "VYUHA"; IP review of the rules before going commercial (not legal advice)
- [ ] **[C]** Launch week — Makar Sankranti is the natural moment
- [ ] **[D]** Monetisation, if any: cosmetic folk-art editions only; never power, never real money
- [x] **[D]** Progression (T-34, built 16 Nov): a free level (1–6, from matches played + wins×2) unlocks
  Sarvatobhadra, Padmavyuha, Kurukshetra and the Abhimanyu scenario one at a time on the Setup screen —
  locked options show a lock icon and "Unlocks at Level N," tapping does nothing. No payment path: this
  is the retention loop, not a monetisation one, so none of it sits behind payment — that would be
  pay-for-power or close enough to read as it. A paid Play Store "edition" (if ever built) stays inside
  the line above: extra cosmetic looks/art only, never a mode, field or feature. `js/ui.js` (`LEVELS`,
  `levelFor`, `unlockLevel`) is the source of truth — no runtime `data/` file, matching how the existing
  win-ladder and rank titles already work in that file. Left unlocked from the start, by design: Pass &
  play, the Daily, Classic/VYUHA rules, the turn clock and the AI-difficulty picker — see `docs/HANDOFF.md`
  for why. Follow-ups: T-35 (does a direct `AC.game.start()` call, e.g. a shared link, bypass the lock on
  purpose or by oversight), T-36 (should Setup also enforce the existing difficulty ladder), T-37 (no
  onboarding beat explains levels exist yet), T-38 (a real phone check is still owed), T-39 (the
  thresholds are hand-tuned, not screened), T-40 (revisit the locked set's scope once T-38/T-39 land).

---

## What to measure once real players arrive

| Signal | Target | Why |
|---|---|---|
| Pehla Yuddh finished | > 80% of new players | The lesson is the funnel. |
| First real battle finished | > 60% | Is the first battle too long or too hard? |
| Daily played on day 2 | > 30% | The habit loop. |
| Daily shares per 100 players | > 15 | The viral loop. |
| Median battle length | 8–12 minutes | Fits a break. |

The game has no analytics today (no server, nothing uploaded). Adding any must be opt-in and
written up here first.

## Playtest notes

*(Add a dated line per session: who played, device, what confused them, what they loved.)*

- **15 Nov 2026 · the Commander, informally, one new boy, phone unrecorded.** No Mahabharat
  knowledge, no Stratego-style background. The Commander explained every card, every step and
  the objective by hand; it took about 15 minutes before the first real battle began, and the
  boy was hard to keep interested. Not one of the five silent T-05 playtests (the Commander
  explained throughout, so this does not count toward the gate) — but it is the first real
  evidence anyone outside this repo has touched the game, and it confirmed exactly what
  `docs/REVIEW.md` problem 5 predicted. **Fixed the same day:** the four-lesson offer had only
  ever appeared on Quick battle, could be dismissed by a stray tap, and never asked twice; a
  player who tapped Custom battle or the Daily first met the full rule set with nobody there to
  explain it. Every primary entry point now offers the lessons, the offer cannot be dismissed
  by accident, and ambient narration stays quiet while a coached step is open. See
  `docs/HANDOFF.md`.
