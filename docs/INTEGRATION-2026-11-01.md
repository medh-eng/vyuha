# Review and integration — 1 November 2026

The three gameplay-quality proposals remain unmerged:

1. Calm pace / Astra first-use and reduced-motion fixes: PR #4,
   `chatgpt/3.0-calm-pace` (reviewed head `1ce6966`).
2. Day/night sky and share metadata: PR #3,
   `chatgpt/asset-sky-share-audit-20261030` (reviewed head `3eae912`).
3. Supplied trap/music and playback controls:
   `chatgpt/audio-pack-20261101`, including the melee trap event fix.

Main was rechecked and remains `ce9c0de`. All three were combined on a local QA
branch without changing main. Final evidence belongs in
`docs/evidence/integration-2026-11-01/`.

## Combined verification

| Check | Result |
|---|---|
| Rules | 121 passed, zero failures |
| Self-play | 40 games, zero failures |
| Daily regressions | Passed |
| UI | 132 passed, zero failures |
| Assets | Six art slots, share metadata and 88 voice files passed |
| Screenshots | Desktop and phone passed, no runtime errors |
| Idle probe, 4× CPU slowdown | Home 0.2%, battle 0.7%, selected 0.4%, mid-game 0.2% busy |
| Real-file media scenarios | All 11 passed; four first-use films, motion/cooling settings, capture, trap, breach, victory, volley |
| Audio controls | Correct themes, one active score, mute/zero volume, Music Off through redraw, fanfare cleanup and actual melee trap playback passed |
| Robot | Eight battles at 390 × 844 and 360 × 640, lesson, Daily and Settings; ended with `no problems` |
| Standalone and diff | Rebuilt; `git diff --check` passed |

The final trap trace records `mine`, duration 1.10 s, finishing before
`trap_hit` narration starts. No effect/voice or voice/voice overlap occurred in
the eleven tested Calm scenarios. These are automated browser checks, not a
physical-device or human playtest. JSON traces, source SHA-256 values and full
command output are in the evidence folder.

## Resolution instructions for the Director

- In `tests/ui.mjs`, retain **both** `await calmPaceChecks()` and the new music
  routing assertions. They share an insertion point; discarding either side
  would silently remove useful regression coverage.
- In `sw.js`, choose one fresh cache name and retain **both skies and trap** in
  `SHELL`. The tested local combination uses `vyuha-v22`; if a later cache already
  exists, advance it instead of reverting it.
- Run `node tools/build-standalone.mjs` after combining runtime files. Never
  select one branch's generated HTML as the final resolution.
- Re-run the mandatory AGENTS.md checks after integration. The runtime sources
  merged without semantic code conflicts in the local combination.

## What remains a human decision

The ordered Calm clash with full recordings measures about **6.7 seconds** to
the AI preview. It exceeds the brief's separate 4–5-second estimate. No voice or
effect was accelerated to conceal that conflict. The Commander should choose
the final feel on his phone and listen to the trimmed trap, fanfare and loop
joins. Browser CPU measurements do not establish physical-phone temperature.

The walkthrough branch contains no implementation beyond main. Four portrait
sources already exist in the earlier conversation but still need the specified
1024 × 1024 delivery and art review. Landscape design, Daily retuning and PR #5's
localisation/recording follow-up remain separate work. No release or PR merge is
performed in this session.
