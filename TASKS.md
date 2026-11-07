# VYUHA — tasks

The one working queue. **Owner:** C Commander · D Director (Claude) · G ChatGPT · S Sarvam.
Chapters and history stay in `docs/ROADMAP.md`; what the last session did is in `docs/HANDOFF.md`.
Rules: one line per task, an ID that never changes, "done when" in plain words. Tick it (`[x]`) and
move it to **Done** in the same pull request that finishes it. Add new work here first.

Last updated: 7 Nov 2026 (battle log, audio priority).

## Now

| ID | Owner | Task | Done when |
|---|---|---|---|
| T-15 | C | Merge the pull request for the battle log and audio priority (T-04) | merged, live |
| T-02 | C | On the phone: play a Quick battle on Sarvatobhadra and Kurukshetra sideways; say whether the turned field helps | a yes/no and any trouble |
| T-03 | C | On the phone: play Quick to round 5 on the wheel; do the dashed landing rings help or clutter? | a yes/no |
| T-16 | C | On the phone: open the log mid-battle, tap an entry; do the cell names (C4, outer 5:30) and the saffron mark help? | a yes/no |

## Next

| ID | Owner | Task | Done when |
|---|---|---|---|
| T-05 | C | 5–10 first-session playtests (Home → Pehla Yuddh → first battle) on friends' phones; notes in `docs/ROADMAP.md` | notes added |
| T-06 | S | Hindi and Marathi for the ~80 first-session strings (`docs/i18n/pending-first-session.en.json` incl. 9 `log.*`, `turn.*`, `hud.*`, `goal.*`, `astra.shakti`) | catalogues merged, `tests/languages.mjs` passes |
| T-08 | C | New night painting for the wheel (`chakra-night`) in the same true-indigo style as the other three | file supplied |
| T-09 | D | Scenario cards and remaining dark screens in the Pata look | PR |
| T-10 | C | Add the three new night masters to your masters zip and Release (`docs/MASTERS.md`) | done |
| T-14 | D | `tools/media-qa.mjs` expects Classic astra films; in Pata (default) the moment shows a still, so the astra scenarios fail (on `main` too). Test both looks | harness passes in Pata and Classic |
| T-17 | D | Battle-log prose (clash/astra sentences) is English-only engine text; give it keys for Sarvam | log readable in hi/mr |

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

- [x] T-04 Review plan step 4: battle log from your side (You/Enemy, cell names, your pieces by name, hidden enemy pieces hidden, tap to mark cells) and audio priority table + checks (`tests/audio.mjs`, `tests/log.mjs`, `tools/battle-log.mjs`, 7 Nov)
- [x] T-01 PR #23 merged (7 Nov)
- [x] Night fields for lotus, Sarvatobhadra, Kurukshetra in true indigo, no corner star (7 Nov)
- [x] Square fields turn sideways on phones ≥ 700 px wide, your army on the left (7 Nov)
- [x] Sound sources settled: ravanhatta and pakhawaj recorded by the Commander, long music Gemini, effects Pixabay (`docs/SOURCES.md`, `data/sounds.json`, 7 Nov)
- [x] `DESIGN.md`, `TASKS.md`, `data/` registers and `tests/data.mjs` (7 Nov)
- [x] Step 3: wheel turn made visible — landing rings, warning, exposed ranks (PR #22, 7 Nov)
- [x] Step 2: four wheel lessons, odds in words, Confirm strike / Cancel (PR #21, 7 Nov)
- [x] Step 1 and the landscape rebuild (PR #19), fresh-code offline cache (PR #20)
