# Calm pace — evidence

`timeline.json` — real effect, voice and phase timestamps for one Calm clash and the AI's reply
(Chromium, 390 × 844, shipped audio, no skip taps): clash → AI preview **3.81 s**.
`line-budget.txt` — `node tools/pace-budget.mjs` for every battle line. Screenshots are from the
same run.

Reproduce: `CHROMIUM_PATH=/path/to/chrome node tools/record-calm-turn.mjs [outDir]` (needs
ffmpeg; the 20-second video is written to `/tmp/vyuha-calm-turn` and not committed). Rules and
budget: `docs/PACING.md`. Browser evidence only; no physical-phone claim.
