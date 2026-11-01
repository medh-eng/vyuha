# Supplied audio pack — 1 November 2026

Review branch `chatgpt/audio-pack-20261101`, based on Director main `ce9c0de`.
No merge or deployment. Review with Calm PR #4 and sky/share PR #3.

## Delivered and wired

The Commander's six supplied files were missing from main. Their byte-identical
originals are preserved at `masters/audio/supplied-2026-10-30/`. Runtime MP3s use
44.1 kHz, 96 kbps; stereo music, mono trap. Total added runtime audio is about
5.4 MiB, loaded on demand; original masters are not precached or played.

| File | Runtime duration | Selection |
|---|---:|---|
| battle_night.mp3 | 119.04 s | Ordinary duel during Chandra's hour |
| daily_theme.mp3 | 89.05 s | Daily, through both hours |
| lesson.mp3 | 74.03 s | Pehla Yuddh |
| abhimanyu.mp3 | 175.05 s | Abhimanyu scenario |
| victory_big.mp3 | 8.05 s | Human victory; one-shot, never a loop |
| trap.mp3 | 1.15 s encoded / 1.10 s decoded | Shataghni hit, replaces the synth fallback |

Four loops have a one-second crossfade across their join, retaining continuous
source audio on either side. Victory fades over its final 800 ms; the trap fades
over its final 80 ms. `tools/prepare-audio-pack.py` rebuilds from the masters,
asserts duration and measures the final encoded files. Music measures about
−17.2 to −17.4 LUFS. Final true peaks are all below −1 dBTP; the short trap
measures −19.61 LUFS (measurement retained, not claimed as −14). Exact values:
[`evidence/audio-pack-2026-11-01/levels.json`](evidence/audio-pack-2026-11-01/levels.json).
The old nine trimmed effects are unchanged; no duplicate trimming or re-voicing.

## Behaviour fixes

- One score-routing function serves battle redraws, audio unlock and Settings.
  Special modes retain their themes when the sky turns; ordinary duels switch
  between the existing day score and the supplied night score.
- Music Off now reaches the audio engine, so a board redraw cannot restart it.
- Turning music back on uses the battle's current theme rather than menu music.
- Mute and zero music volume apply to recorded HTML music, including fanfares.
- Starting a score or leaving for Home stops the previous fanfare. Visibility
  pause/resume also covers the fanfare.
- Trap is precached; music caches on first use. Cache `vyuha-v21`.
- Melee trap hits now emit `mine`, which selects the delivered recording.
  They previously emitted generic `clash-lose`; merely adding the file did not
  fix that trigger. A Yantrik safely dismantling a trap still emits `clash-win`.
  Two engine regressions check that distinction without changing combat rules.

## Verification and limits

`tools/audio-qa.mjs` uses real playback at 390 × 844: day/night and three special
mode themes, exactly one active score, Music Off through redraw, restoring the
correct theme, mute/zero volume, victory stopping on Home and a single decoded
1.1-second trap buffer. No runtime errors. JSON evidence is alongside levels.
Seven new UI assertions cover shared routing and Music Off propagation.

The final local combination of PR #4, PR #3 and this audio work passed **121
rules, 40 self-play games, Daily, 132 UI checks, asset checks, desktop/phone
screenshots, eleven real-file media scenarios and audio control checks**.
Every idle screen stayed under 3% busy (maximum 0.7%). Eight robot battles at
two phone sizes plus lesson/Daily/Settings ended with `no problems`. See
`INTEGRATION-2026-11-01.md` and `evidence/integration-2026-11-01/` for raw results
and the source hashes actually tested. Standalone was regenerated for both the
audio branch and the combined QA branch.

This branch adds files/routing; **Calm event sequencing comes from PR #4**. Main's
Quick behaviour is not advertised as sequential. Review and test the combined
branches before release, regenerate the standalone, and keep the newest cache
name when resolving `sw.js`. Standalone output naturally conflicts across these
runtime PRs and must be generated after integration.

No physical-phone heat measurement, native-language review or subjective
listening approval is claimed. The Commander should listen to the loop joins,
short fanfare and trap on his phone before merge. Source tool/licence details
remain unprovided; see `incoming/audio/SOURCES.md`.

## Today's remaining queue

PR #4 now includes first-use Astra film and reduced-motion fixes, real media QA
and a fresh 20-second phone-sized recording. Its actual clash still takes about
6.7 seconds rather than the brief's 4–5-second estimate. PR #3 has been refreshed
against current main. Neither is merged.

The walkthrough branch currently has no implementation commits beyond main;
task 3.2 still needs building. Four portrait source images exist in the previous
chat but are not yet delivered at the requested square incoming paths. Landscape
design, Daily retuning, localisation integration and approved-line re-recording
also remain pending. Today's work prioritised pacing, media QA and audio gaps.
