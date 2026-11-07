# VYUHA — tasks

The one working queue. **Owner:** C Commander · D Director (Claude) · G ChatGPT · S Sarvam.
Chapters and history stay in `docs/ROADMAP.md`; what the last session did is in `docs/HANDOFF.md`.
Rules: one line per task, an ID that never changes, "done when" in plain words. Tick it (`[x]`) and
move it to **Done** in the same pull request that finishes it. Add new work here first.

Last updated: 7 Nov 2026 (night fields, sideways squares, registers).

## Now

| ID | Owner | Task | Done when |
|---|---|---|---|
| T-01 | C | Merge the pull request for night fields, sideways squares, DESIGN/TASKS/data | merged, live |
| T-02 | C | On the phone: play a Quick battle on Sarvatobhadra and Kurukshetra sideways; say whether the turned field helps | a yes/no and any trouble |
| T-03 | C | On the phone: play Quick to round 5 on the wheel; do the dashed landing rings help or clutter? | a yes/no |
| T-14 | G | Batch 4.1: robot at 844×390 and 640×360, all four fields, lesson and Daily | full run ends with `no problems`; failures reported without game changes |
| T-04 | D | Review plan step 4: a more useful battle log (cell names, own pieces) and audio priority checks | PR with log + checks |

## Next

| ID | Owner | Task | Done when |
|---|---|---|---|
| T-05 | C | 5–10 first-session playtests (Home → Pehla Yuddh → first battle) on friends' phones; notes in `docs/ROADMAP.md` | notes added |
| T-06 | S | Hindi and Marathi for the ~70 first-session strings (`docs/i18n/pending-first-session.en.json`, `turn.*`, `hud.*`, `goal.*`, `astra.shakti`) | catalogues merged, `tests/languages.mjs` passes |
| T-08 | C | New night painting for the wheel (`chakra-night`) in the same true-indigo style as the other three | file supplied |
| T-09 | D | Scenario cards and remaining dark screens in the Pata look | PR |
| T-10 | C | Add the three new night masters to your masters zip and Release (`docs/MASTERS.md`) | done |

## Waiting on others

| ID | Owner | Task |
|---|---|---|
| T-11 | S | Record 18 changed lines + 4 routine lines (Sarvam Batch 4); native-speaker read of the Marathi interface |
| T-12 | G | Screen the four heroes (50–58 %), AI hero awareness, hero-card design (Batch 5) |
| T-13 | C | Respect review by three players from different backgrounds (`docs/DIRECTOR.md` §6) |

## Later

- Puzzles, seven-vyuha campaign, Abhimanyu Escape (after playtests) · festival days, haptics, sound pass ·
  hero cards in Pata · Android build (Capacitor) · store listing and art · replace Classic paintings that carry a corner star ·
  challenge-a-friend link · name/trademark search · IP review of the rules.

## Done (newest first)

- [x] Night fields for lotus, Sarvatobhadra, Kurukshetra in true indigo, no corner star (7 Nov)
- [x] Square fields turn sideways on phones ≥ 700 px wide, your army on the left (7 Nov)
- [x] Sound sources settled: ravanhatta and pakhawaj recorded by the Commander, long music Gemini, effects Pixabay (`docs/SOURCES.md`, `data/sounds.json`, 7 Nov)
- [x] `DESIGN.md`, `TASKS.md`, `data/` registers and `tests/data.mjs` (7 Nov)
- [x] Step 3: wheel turn made visible — landing rings, warning, exposed ranks (PR #22, 7 Nov)
- [x] Step 2: four wheel lessons, odds in words, Confirm strike / Cancel (PR #21, 7 Nov)
- [x] Step 1 and the landscape rebuild (PR #19), fresh-code offline cache (PR #20)
