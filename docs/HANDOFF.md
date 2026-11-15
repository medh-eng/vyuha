# Handoff — latest status

**13 November 2026 · Director.** Replace this file at the end of each session.

## State

The Commander uploaded the two scenario paintings and asked for a hard review of the whole game,
a plan, and the work done in parts. The review and plan are **`docs/REVIEW.md`** — read it first.
Branch **`claude/first-session-ladder-scenes`** (PR open, T-24) is Part 1 of that plan:

| Item | What changed | Where |
|---|---|---|
| Scenario paintings (T-20) | `card-duel` (two camps at dawn) and `card-abhimanyu` (the lone chariot in the closed wheel) are on the scenario cards, the story cards and the Daily card. Field crops and their position overrides removed | `assets/art/pata/scenes/card-*.webp`, `PATA_SLOTS` in `js/art.js`, `css/app.css`, `data/art.json` |
| **The ladder** | Yuddh karo picks the opponent: Sainik until two wins over him, Dronacharya until three, then Shakuni (`AC.ui.ladder(stats)`). Field and rules still come from the last Custom battle; Custom battle opens on the ladder rung until the player has chosen for themselves. Result card: "One more win over Sainik and Dronacharya comes for you", then on the clearing win a saffron note and **Face Dronacharya** in place of Rematch. Only for an ordinary battle against the rung's opponent; guests have no record, so they stay on Sainik | `js/ui.js` (`LADDER`, `ladder`, `quickSetup`), `js/game.js` (`handleGameOver`), `.ladder-note` |
| Home, sideways | Height ≤ 520 px: painting beside the title and Yuddh karo; the other doors in a column on the right, Daily first. Yuddh karo was at 461 px on a 411 px screen; now 152–211 px at 914 × 411, 830 × 318, and 167–226 at 640 × 360. Portrait and desktop unchanged | end of `css/app.css` |
| Result card, sideways | Verdict in one row, numbers on one line, buttons fixed at the foot of the card (they were cut off below the edge at 914 × 411) | end of `css/app.css` |
| `AC.game.conclude(winner, reason)` | Ends the battle now; `resign` uses it, and so do the new tests | `js/game.js` |
| Strings | Five `ladder.*` keys (whole sentences with `{a}` `{b}` `{n}`) added to the pending file — now 79 | `docs/i18n/pending-first-session.en.json` |

## Measured this session (seeded AI-v-AI on `main`; no person played)

- Wheel, Dronacharya v Dronacharya, 200 battles: 101–99; median 23 rounds; **63 ended with one side out of movers**, not a fort.
- Lotus, same, 150: 67–83; **82 ended out of movers**.
- Wheel, Sainik v Dronacharya, 100: Sainik won 17; 16 over by round 10.
- Kurukshetra: 39 of 60 (D v D) and 34 of 60 (S v D) ended at sunset. Sarvatobhadra D v D, 60: 19 sunset, 21 out of movers.

## Checks (this branch)

rules 166 · self-play 40 · Daily · languages · UI 195 (11 new, the ladder) · data 159 · assets ·
audio 44 · log 18 · shots · first-session 32 · landscape 122 · pace-budget (same four long lines as
before) · battle-log 987 · idle heat under 3 % portrait and 844 × 390 · Pata sweep both looks, no
errors · robot — see the PR for its last line. `tools/media-qa.mjs` not run (known failure, T-14).
**Not phone-tested; no real-person playtest.**

## Open

- Commander: merge the PR (T-24); **T-05 five first-session playtests — the gate for Part 3**;
  T-23 branches; T-08 wheel night field; phone checks T-02/T-03/T-16 and now T-25 (home and result sideways).
- Sarvam has still delivered nothing since Batch 3; 79 strings wait. `docs/REVIEW.md` Part 4 says stop waiting.

## Next (Director) — Part 2 of `docs/REVIEW.md`

T-26 endings (out-of-movers on the wheel and lotus; sunset on Kurukshetra), each screened on two
fresh seed banks · T-27 Daily briefing says the task · T-28 challenge-a-friend link.
T-21, T-17, T-22 stay behind these.
