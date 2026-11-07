# Handoff — latest status

**7 November 2026 (night) · Director.** Replace this file at the end of each session.

## State

PR #24 (battle log, audio priority) is merged and live. Branch **`claude/agents-review-scenarios`**
(PR open, T-19) holds four things:

| Item | What changed | Where |
|---|---|---|
| ChatGPT Batch 4.1 merged in | Robot plays portrait 390×844 / 360×640 and landscape 844×390 / 640×360, all four fields, the field drill and a full Daily, through real taps only, seeded (`ROBOT_SEED`), `summary.json`. CI workflow runs the whole check list on **every PR** (widened by the Director; audio, log, battle-log added). Director's tweak: `tapCell` looks a cell up again (3 tries) when the board redraws mid-tap | `tools/playtest-bot.mjs`, `.github/workflows/landscape-robot.yml` |
| **Bug fix: centre cell ignored taps** | Pata (since 6 Nov) drew the wheel hub / lotus centre with `fill: none` so the painted field shows; SVG then ignores taps there, so a piece on the centre could not be picked by touch. `.board-svg .cell .cell-fill { pointer-events: all }`. `tools/battle-log.mjs` now checks every cell takes a tap at its centre (fails without the fix) | `css/app.css` |
| T-09 Pata cards | Scenario cards: painting in a top band with an ink rule, words in ink on cotton (the Pata panel rule had wiped the painting and left Classic's black shade). Story cards and the Daily card: painting band across the top. **Story paintings had never loaded in either look** — `url()` inside `--modal-art` resolved against `css/`; now absolute. Pass-and-play curtain: indigo cloth + cotton card. Until the Commander's scenario paintings land, `PATA_SLOTS` crops the fields: Yuddh → Kurukshetra camp, Abhimanyu and Daily → the wheel | `js/art.js` (`PATA_SLOTS card:*`), `js/ui.js` (`.mode-card-art`, `.modal-band`, `artKey`), `js/main.js`, CSS at the end of `css/app.css` |
| Cleanup | `masters/audio/` (36 MB) out of git — it was still tracked despite `.gitignore`; same files as `vyuha-masters-audio.zip`, in history to `28b4fe6`. Superseded `docs/evidence/landscape-2026-11-01`, `portraits-2026-11-01` removed. 26 fully merged branches deleted on GitHub. Tracked tree ≈ 32 MB | |
| Agents | Sarvam: nothing new since Batch 3. ChatGPT: only 4.1. Both briefs now start with **Batch 6** (one ordered list each). ChatGPT 4.2 dropped (landscape rebuilt 6 Nov) | `docs/agents/*.md` |

## Checks (this branch)

rules 166 · self-play 40 · Daily · languages · UI 184 · data 159 · assets · audio 44 · log 18 ·
battle-log ≈ 1 050 (incl. every-cell tap) · Pata sweep both looks, no errors · robot full run
(all four viewports) — see the PR for the final line · plus the browser checks listed in the PR.
`tools/media-qa.mjs` still fails at the astra-film gate on `main` too → ChatGPT 6.1 (T-14).

## When the scenario paintings arrive (T-20)

Upload to `incoming/art/pata/scenes/card-duel.png`, `card-abhimanyu.png` → `python3 tools/prepare-pata.py`
(already writes `assets/art/pata/scenes/card-*.webp`) → point `PATA_SLOTS['card:duel']` and
`['card:abhimanyu']` (and `card:daily` → abhimanyu) at `'pata:scenes/card-…'` in `js/art.js` →
drop the `background-position` overrides for `[data-val="duel"]` / `[data-art="duel"]` if the new
pictures are centred → `node tools/pata-sweep.mjs` and look.

## Open

- **Not phone-tested; no real-person playtest.** On the phone: a piece on the wheel hub can now be picked.
- Commander: T-20 (two paintings), T-08 (wheel night field), T-02/T-03/T-16 phone checks, T-05 playtests.

## Next

Director: **T-21** (festival days on the Daily, sound pass), T-17 (log prose keys). Agents: Batch 6.
