# Director handoff — 1 November 2026

Branch `claude/integrate-2026-11-01`. One PR replaces the four open agent PRs for review.

## Integrated

| PR | What | Resolution |
|---|---|---|
| #4 Calm pace (ChatGPT) | Calm/Quick setting, sequenced beats, astra film fixes | Merged, then re-paced (below) |
| #3 Sky + share (ChatGPT) | Day/night sky paths, OG/Twitter preview | Merged |
| #6 Audio pack (ChatGPT) | Trap, night/Daily/lesson/Abhimanyu/victory music, playback fixes | Merged; `tests/ui.mjs` keeps both music and Calm checks |
| #5 Sarvam 3.2–3.4 | Hindi review 2, `strings.hi/mr.json`, two approved rewrites, Codex → Rules | Merged as files in `incoming/` (not wired). In-battle button now says **Rules** |

Service-worker cache `vyuha-v22` (both skies and trap precached). Standalone rebuilt.

## Re-paced Calm

See `docs/PACING.md`. Clash → AI preview **6.67 s → 3.81 s** with real audio; voice lines are no
longer cut at 3.5 s. Files: `js/audio.js` (`SPEAK_AT`, `soften`), `js/sanjaya.js` (watchdog),
`js/stage.js` (`extend`), `js/game.js` (`PACE`, `calmBeat`, `performCalm`, `calmAi`),
`tests/ui.mjs`, `tools/record-calm-turn.mjs`, new `tools/sfx-envelope.py`.

## Checks run here

rules 121/0 · self-play 40, 0 failures · Daily passed · UI 135/0 · assets passed · desktop/phone
screenshots passed · idle: every screen < 3 % (battle-idle 2.5 %) · robot: no problems ·
media QA 11/11 · Calm recording passed overlap rules.

Not done: physical-phone feel/heat test, human listening to loop joins/trap/fanfare,
native Marathi review of `strings.mr.json`, Bulbul recordings for 3.1/3.4.

## Next

`docs/PACING.md` → "Next steps". Commander phone test first; then Sarvam shortens routine lines;
ChatGPT does the narration budget and slide-start profiling.
