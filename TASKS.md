# VYUHA — tasks

The one working queue. **Owner:** C Commander · D Director (Claude) · G ChatGPT · S Sarvam.
Chapters and history stay in `docs/ROADMAP.md`; what the last session did is in `docs/HANDOFF.md`.
Rules: one line per task, an ID that never changes, "done when" in plain words. Tick it (`[x]`) and
move it to **Done** in the same pull request that finishes it. Add new work here first.

Last updated: 17 Nov 2026 (Director: Play Store readiness — Android app, store pictures, privacy page, Play guide `docs/PLAY-STORE.md`; big words and big buttons with `tools/readability.mjs`; lessons show only what they have taught; tablet field fix. Earlier, 16 Nov: T-34 progression system; 15 Nov: Sarvam Batch 6.x; Director: unmissable first battle).

## Now

| ID | Owner | Task | Done when |
|---|---|---|---|
| T-41 | C | **Play Store, your part** — follow `docs/PLAY-STORE.md` steps 1–7: merge the PR, make the upload key, add the four GitHub secrets, run *Actions → Android build*, install the test APK on your phone, then Play Console + closed test with 12 testers for 14 days | app live on Play |
| T-42 | C | On the phone with the **test APK**: Back button (card → Menu → Home → leaves), full screen, sound stops when you switch app, WhatsApp share opens WhatsApp, a lesson and a Quick battle | a yes/no each |
| T-43 | C | Read the store words in `incoming/text/store-listing.md` — the Director fixed the three out-of-date points on 24 Nov (lessons + drill, offline app, fields unlock) and dropped "backup export" (the buttons are gone) | listing approved |
| T-05 | C | **The gate for Part 3:** five people who have never seen the game, on their own phones, watched in silence for ten minutes (Home → first battle). Write where each one stops in `docs/ROADMAP.md` | notes added |
| T-25 | C | On the phone, sideways: is Yuddh karo on the first home screen? After a battle, are all the result buttons in view? Win a battle, tap **Challenge a friend**, send it to yourself on WhatsApp and open it — does the briefing appear? | a yes/no each |
| T-30 | C/S | A native reader checks the new Hindi and Marathi Daily share line (`share.cta`). Sarvam's pass added `का` to the Marathi question; the Hindi reads clean | ok or a correction |
| T-23 | C | Tidy GitHub: repository → **Branches** → delete the 26 old branches marked *Merged* (every commit is in `main`); then **Settings → General → Automatically delete head branches** on, so merged PR branches go by themselves. Claude sessions cannot delete branches | only `main` + open PR branches left |
| T-02 | C | On the phone: play a Quick battle on Sarvatobhadra and Kurukshetra sideways; say whether the turned field helps | a yes/no and any trouble |
| T-03 | C | On the phone: play Quick to round 5 on the wheel; do the dashed landing rings help or clutter? | a yes/no |
| T-16 | C | On the phone: open the log mid-battle, tap an entry; do the cell names (C4, outer 5:30) and the saffron mark help? | a yes/no |

## Next

| ID | Owner | Task | Done when |
|---|---|---|---|
| T-47 | S | Hindi + Marathi for the 69 strings in `incoming/text/primer-strings.en.json` (battlefield primer, 11 rule cards); keys `primer.*` and `rule.*`; keep each rule card under ~230 characters so it types in a few seconds | catalogues at 324 keys, `tests/languages.mjs` passes |
| T-48 | C | On the phone: the new primer (Pehla Yuddh → Know the battlefield → each warrior → Now the rules) — is every word readable, does the key sound feel right, is anything missing for a first-time player? | a yes/no and any trouble |
| T-44 | D | Tablets held sideways (1024 × 600, 1280 × 800) use the upright layout with a wide, short field; give them the phone's sideways rails | field ≥ 60 % of screen height on both |
| T-08 | C | New night painting for the wheel (`chakra-night`) in the same true-indigo style as the other three | file supplied |
| T-10 | C | Add the three new night masters to your masters zip and Release (`docs/MASTERS.md`) | done |
| T-17 | D | Battle-log prose (clash/astra sentences) is English-only engine text; give it keys for Sarvam | log readable in hi/mr |
| T-22 | D | Flakes: `tools/battle-log.mjs` failed once in six runs (7 Nov); the robot's phone Daily timed out on a tap 2 of 9 runs on PR #37 (17 Nov) — the robot now prints the action, last taps and what lay under the finger; find the cause | six clean runs of each |
| T-21 | D | Rang Phase 3, rest: festival days on the Daily and a sound pass (levels, overlaps) across every screen | PR |
| T-31 | D | `tools/language-shots.mjs` is flaky at `visible cell r1s0`: the cell has no layout box ~250 ms after `startPrepared`. Reproduced on `main` at `6849539` (2 of 2 runs) and on `sarvam/batch-6.1-strings` (3 of 5) — wait for the board to lay out instead of the fixed 250 ms | ten clean runs |
| T-35 | D | Progression (T-34) only gates the Setup screen's own board/scenario buttons. `AC.game.start()` and `quickBattle()`'s default still reach a locked board/scenario if called directly (Daily, Challenge-a-friend links, saved formations) — decide whether those should also respect level, or are meant to stay exempt (a shared link, for instance, has to open whatever the sender picked) | decision written here + enforced or explicitly exempted in code |
| T-36 | D | Progression (T-34) locks battlefields and the Abhimanyu scenario only. Difficulty (Sainik/Dronacharya/Shakuni) is already gated by the separate win-ladder in spirit, but Custom battle's Setup screen lets anyone pick Shakuni on turn one — decide whether to enforce the ladder there too, using the same locked-button treatment | decision written here + enforced or explicitly left open |
| T-37 | D | Progression (T-34) has no onboarding beat of its own: a new player only learns levels exist by bumping into a locked button. Consider a one-time banner or Sanjaya line the first time any option is locked, and/or a level-up toast the moment a battle's result pushes the profile to a new level | PR, or a written decision not to |
| T-38 | C | Phone check: open Custom battle as a brand-new profile and confirm Sarvatobhadra/Padmavyuha/Kurukshetra and Abhimanyu show locked with "Unlocks at Level N," that tapping one does nothing but a toast, and that winning/playing enough battles unlocks them for real (T-34) | a yes/no and any trouble |
| T-39 | D | T-34's level/unlock table (`LEVELS` in `js/ui.js`) is hand-tuned, not screened: nobody has checked whether level 2 (3 points) feels fast enough to avoid frustrating a new player, or whether level 6 (50 points) is reachable in a reasonable number of sessions. Balance-test once real players exist (ties to T-05) | thresholds confirmed or retuned |
| T-40 | D | T-34 deliberately left Pass & play, the Daily, Classic/VYUHA rules and the AI-difficulty picker unlocked from the start (see the design note in `docs/HANDOFF.md`). Revisit once T-38/T-39 give real signal on whether the locked set (fields + Abhimanyu) is enough to feel like progression, or too thin | decision confirmed or scope widened |

## Waiting on others

| ID | Owner | Task |
|---|---|---|
| T-11 | S | Sarvam Batch 6.6: a native Marathi speaker reads `docs/i18n/strings.mr.json` (only if one can be found; do not claim it otherwise) | corrections + reviewer named |
| T-32 | D | Approve the text in `incoming/text/sanjaya-chapter4.csv`; the 28 draft recordings are ready in `incoming/voice/chapter4/` (every line ≤ 3.24 s) and only need moving into `assets/audio/voice/` and the ids wired into `js/sanjaya.js` | lines speak in the game |
| T-12 | G | ChatGPT Batch 6.2 (four-hero balance screen) and 6.4 (AI hero awareness) remain; Batch 6.5 design delivered in incoming/text/hero-cards-design.md. Hero gameplay follows the campaign (docs/REVIEW.md) |
| T-13 | C | Respect review by three players from different backgrounds (`docs/DIRECTOR.md` §6) |

## Later

- Review Part 3 (after T-05): the Seven Vyuhas campaign that teaches one rule a battle, Abhimanyu Escape as its last chapter; heroes and vows wait behind it · Part 4: finish Hindi/Marathi, Android build · puzzles · festival days, haptics, sound pass ·
  hero cards in Pata · Android build (Capacitor) · store listing and art · replace Classic paintings that carry a corner star ·
  challenge-a-friend link · name/trademark search · IP review of the rules.

## Done (newest first)

- [x] T-46 Primer (24 Nov, PR #40): Pehla Yuddh's Field drill and the wheel lessons both open with the primer the first time (`AC.modes.startDrill`); Settings loses Export/Import/Reset; Intel's army chip is solid and readable; Pehla Yuddh opens with *Know the battlefield* (board, the two armies, tap-each-warrior panel) then *The rules, one at a time* (11 cards), typed out with a soft key sound (`js/primer.js`, `AC.audio` `type`). Also in the lessons list and the Rules tab. Not phone-tested.

- [x] T-45 Play Store readiness (17 Nov): Capacitor Android app targeting API 36, build workflow, icons and splash, Back button, background silence, bundled fonts, privacy page, store pictures, `docs/PLAY-STORE.md`; readability floor (12 px words, 40 px buttons) with every battle icon labelled; lessons show only what they have taught; the 781–1080 px tablet field fix.
- [x] T-34 Progression system: a free level (1–6) from matches played + wins×2 unlocks Sarvatobhadra at level 2, Padmavyuha at 3, Kurukshetra at 4, the Abhimanyu scenario at 5 — shown locked with a lock icon and "Unlocks at Level N" on the Setup screen, tapping does nothing but a toast. Home screen shows the current level. No payment path anywhere; a paid Play Store edition, if ever built, stays cosmetic-only per `docs/ROADMAP.md`. Follow-ups opened as T-35 through T-40 (16 Nov).
- [x] T-33 Unmissable first battle: the wheel-lesson offer now gates Custom battle and the Daily too, not only Quick; it cannot be dismissed by a stray tap; the decline is an honest claim ("Skip — I've played before") instead of an equally tempting "Fight now"; Sanjaya's ambient lines stay quiet while a coached step is open. Found by a real (informal) playtest — see `docs/ROADMAP.md` Playtest notes (15 Nov, PR #34).
- [x] Sarvam, 15 Nov, second pass (PR #33) — every one of the 88 recordings is now under 4.0 s (longest 3.97 s, median 2.95 s): `defeat_1`, `sunset_near_1`, `dawn_1`, `dawn_enemy_1`, `start_abhimanyu_1`, `astra_sammohana_enemy_1` shortened and re-recorded; Chapter IV draft recordings (28 files, ≤ 3.24 s); the cultural read of the whole game (`incoming/text/cultural-review.md`, Task 5); a Marathi consistency pass for Batch 6.6; `docs/WORKLOG.md` and `docs/PACING.md` brought up to date
- [x] Sarvam Batch 6.2-6.5 (15 Nov, PR #31) — the 18 pending recordings re-voiced and the stale-audio guard cleared; the four over-budget routine lines shortened (`volley_kill_1`, `assassinate_1`, `trap_defused_1`, `rotate_padma_1`) plus `astra_vayavya_enemy_1`, which ran 6.14 s; vow strings in Hindi and Marathi (`incoming/i18n/pratigya.*.json`); Sanjaya's Chapter IV lines (`incoming/text/sanjaya-chapter4.csv`); the hero respect read (`incoming/text/heroes-respect-read.md`)
- [x] T-06 Sarvam Batch 6.1: Hindi and Marathi for the 102 pending strings — wheel lessons, odds words, Confirm strike, goal box, battle log, ladder, Challenge a friend; catalogues at 251 keys, `tests/languages.mjs` and the hi/mr layout harness pass (15 Nov, PR #29)
- [x] T-12 / Batch 6.5: Pata hero-card placements and four future active hero flows specified in incoming/text/hero-cards-design.md; written design only, not playable (15 Nov, PR #32)
- [x] T-12 / Batch 6.3: Quiet Gate retuned and screened on two fresh banks, four raider win rates in target range (15 Nov, PR #30)
- [x] T-14 ChatGPT Batch 6.1: media QA checks all four Pata paintings and Classic bronze films, reduced motion and battery saver (15 Nov, PR #28)
- [x] T-24 and T-29: Parts 1 and 2 merged in PRs #26 and #27 (15 Nov)
- [x] T-26 endings shown (fort-fall card, sunset + bala in the GOAL box); T-27 Daily wording; T-28 Challenge a friend; stage-card text fixed in Pata (13 Nov, PR #27)
- [x] T-20 Scenario paintings `card-duel`, `card-abhimanyu` supplied by the Commander and wired in (13 Nov)
- [x] Hard review and plan `docs/REVIEW.md`; Part 1: the ladder, home and result card sideways (13 Nov)
- [x] T-19 PR #25 merged (7 Nov)
- [x] T-09 Scenario cards, story cards (painting band; the story paintings had never loaded in either look — url() inside a CSS variable resolved against `css/`) and the pass-and-play curtain in Pata; sweep harness `tools/pata-sweep.mjs` (7 Nov)
- [x] T-18 ChatGPT Batch 4.1: robot in landscape (844×390, 640×360), all four fields, drill and Daily, real taps only, seeded; CI workflow on every PR (7 Nov). It found the centre-cell tap bug — fixed
- [x] Cleanup: `masters/audio/` (36 MB) out of git (in `vyuha-masters-audio.zip`); superseded 1 Nov evidence folders removed (7 Nov)
- [x] T-15 PR #24 merged (7 Nov)
- [x] T-04 Review plan step 4: battle log from your side (You/Enemy, cell names, your pieces by name, hidden enemy pieces hidden, tap to mark cells) and audio priority table + checks (`tests/audio.mjs`, `tests/log.mjs`, `tools/battle-log.mjs`, 7 Nov)
- [x] T-01 PR #23 merged (7 Nov)
- [x] Night fields for lotus, Sarvatobhadra, Kurukshetra in true indigo, no corner star (7 Nov)
- [x] Square fields turn sideways on phones ≥ 700 px wide, your army on the left (7 Nov)
- [x] Sound sources settled: ravanhatta and pakhawaj recorded by the Commander, long music Gemini, effects Pixabay (`docs/SOURCES.md`, `data/sounds.json`, 7 Nov)
- [x] `DESIGN.md`, `TASKS.md`, `data/` registers and `tests/data.mjs` (7 Nov)
- [x] Step 3: wheel turn made visible — landing rings, warning, exposed ranks (PR #22, 7 Nov)
- [x] Step 2: four wheel lessons, odds in words, Confirm strike / Cancel (PR #21, 7 Nov)
- [x] Step 1 and the landscape rebuild (PR #19), fresh-code offline cache (PR #20)
