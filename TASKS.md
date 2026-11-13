# VYUHA — tasks

The one working queue. **Owner:** C Commander · D Director (Claude) · G ChatGPT · S Sarvam.
Chapters and history stay in `docs/ROADMAP.md`; what the last session did is in `docs/HANDOFF.md`.
Rules: one line per task, an ID that never changes, "done when" in plain words. Tick it (`[x]`) and
move it to **Done** in the same pull request that finishes it. Add new work here first.

Last updated: 13 Nov 2026 (hard review `docs/REVIEW.md`, Part 1: ladder, home and result sideways, scenario paintings).

## Now

| ID | Owner | Task | Done when |
|---|---|---|---|
| T-24 | C | Merge the pull request: review Part 1 — scenario paintings, the ladder (Sainik → Dronacharya → Shakuni), home and result card sideways | merged, live |
| T-05 | C | **The gate for Part 3:** five people who have never seen the game, on their own phones, watched in silence for ten minutes (Home → first battle). Write where each one stops in `docs/ROADMAP.md` | notes added |
| T-25 | C | On the phone, sideways: is Yuddh karo on the first home screen? After a battle, are all the result buttons in view? Win a battle, tap **Challenge a friend**, send it to yourself on WhatsApp and open it — does the briefing appear? | a yes/no each |
| T-29 | C | Merge PR #27 (Part 2: endings shown, Daily wording, Challenge a friend) — after #26, it is stacked on it | merged, live |
| T-30 | C/S | A native reader checks the new Hindi and Marathi Daily share line (`share.cta`) | ok or a correction |
| T-23 | C | Tidy GitHub: repository → **Branches** → delete the 26 old branches marked *Merged* (every commit is in `main`); then **Settings → General → Automatically delete head branches** on, so merged PR branches go by themselves. Claude sessions cannot delete branches | only `main` + open PR branches left |
| T-02 | C | On the phone: play a Quick battle on Sarvatobhadra and Kurukshetra sideways; say whether the turned field helps | a yes/no and any trouble |
| T-03 | C | On the phone: play Quick to round 5 on the wheel; do the dashed landing rings help or clutter? | a yes/no |
| T-16 | C | On the phone: open the log mid-battle, tap an entry; do the cell names (C4, outer 5:30) and the saffron mark help? | a yes/no |

## Next

| ID | Owner | Task | Done when |
|---|---|---|---|
| T-06 | S | Sarvam Batch 6.1: Hindi and Marathi for the 102 strings in `docs/i18n/pending-first-session.en.json` | catalogues merged, `tests/languages.mjs` passes |
| T-08 | C | New night painting for the wheel (`chakra-night`) in the same true-indigo style as the other three | file supplied |
| T-10 | C | Add the three new night masters to your masters zip and Release (`docs/MASTERS.md`) | done |
| T-14 | G | ChatGPT Batch 6.1: `tools/media-qa.mjs` expects Classic astra films; in Pata (default) the moment shows a still, so the astra scenarios fail (on `main` too). Test both looks | harness passes in Pata and Classic |
| T-17 | D | Battle-log prose (clash/astra sentences) is English-only engine text; give it keys for Sarvam | log readable in hi/mr |
| T-22 | D | `tools/battle-log.mjs` failed once in six runs (7 Nov, message not kept): make it log every failed check to a file, then find the flake | six clean runs |
| T-21 | D | Rang Phase 3, rest: festival days on the Daily and a sound pass (levels, overlaps) across every screen | PR |

## Waiting on others

| ID | Owner | Task |
|---|---|---|
| T-11 | S | Sarvam Batch 6.2–6.6: shorten + record the 4 long lines, record the 18 pending, vow strings, Chapter IV lines, respect read, Marathi read |
| T-12 | G | ChatGPT Batch 6.2–6.5: screen the four heroes (50–58 %), retune quiet-gate, AI hero awareness, hero-card design in Pata |
| T-13 | C | Respect review by three players from different backgrounds (`docs/DIRECTOR.md` §6) |

## Later

- Review Part 3 (after T-05): the Seven Vyuhas campaign that teaches one rule a battle, Abhimanyu Escape as its last chapter; heroes and vows wait behind it · Part 4: finish Hindi/Marathi, Android build · puzzles · festival days, haptics, sound pass ·
  hero cards in Pata · Android build (Capacitor) · store listing and art · replace Classic paintings that carry a corner star ·
  challenge-a-friend link · name/trademark search · IP review of the rules.

## Done (newest first)

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
