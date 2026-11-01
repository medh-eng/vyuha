# ChatGPT handoff — Batch 3.0, Calm pace

30 October 2026. Branch: `chatgpt/3.0-calm-pace`, based on `ce9c0de`.
This is a review proposal; `main` is unchanged. The Commander tests it on his phone before merge.
Only task 3.0 is in this branch. Tasks 3.1–3.4 remain separate.

## Behaviour

- Settings → **Battle pace: Calm (default) / Quick**, persisted through the existing settings store. Existing profiles without a pace key inherit Calm.
- Calm has one cancellable sequence per turn: 400 ms ease-out slide; effect and stage card; one highest-priority Sanjaya line; 400 ms breath; 900–1400 ms opponent thinking; 500 ms static preview; the opponent's move and moment; Your turn banner, then input and the turn clock.
- A clash card holds 2200 ms; fort, breach and Brahmastra hold 2600 ms. Other astra/volley cards hold 2200 ms. No End-turn button.
- Stage and board taps advance one step, stop the current effect/voice and close the card when applicable. They do not also issue a new order. Reduced motion removes slides but retains the gaps.
- Makara/Padma links draw once over 900 ms, hold still, and disappear with their card. The opponent's preview is a static gold rim, with no pulse loop.
- Effects expose metadata durations and a completion/stop handle. Decoded buffers, HTML audio fallback and synthesised cues use ended events; unknown HTML duration has a 600 ms fallback. Known effects finish before narration starts, including effects that outlast the card.
- Sanjaya returns a completion Promise, queues instead of interrupting, discards lower-priority waiting lines, and stops on ended/error/rejection or a 3500 ms watchdog. Priority: fort > breach > astra > capture > trap > sky. Only one selected event line is spoken per side's Calm turn; result narration does not add another line to a fort capture.
- A new match, load, concession or leaving the battle cancels old timers, audio, cards and continuations. Input, advisor orders and the turn clock stay locked while the moment plays. The HUD does not offer Your move during the AI's narration.
- Quick retains immediate action resolution, the 1500 ms stage cap (1100 ms with reduced motion) and the original difficulty think delay plus 0–260 ms jitter. Voice now uses the shared non-interrupting queue in both paces.

## Timing conflict in the brief — explicit review item

The detailed ordered sequence and the estimated **clash → AI in 4–5 s** are incompatible with the current full recordings. The clash file is about **2.56 s**, and Sanjaya's recorded lines are often another **2–3 s**, before the required breath and thinking time. The implementation preserves the specified order and waits for both the card and effect before speaking. It does not accelerate or truncate recordings to force the estimate (except the specified 3.5 s voice watchdog or an explicit skip).

The deterministic test measures **1.8 s** from a plain move to the AI preview and **4.9 s** for a clash with a one-second line. With shipped recordings, the captured clash takes roughly **7 s** to the AI preview; the exact timestamps are in `docs/evidence/calm-pace/timeline.json`. The estimate needs Director/Commander review before claiming every acceptance target is met. A shorter total would require shorter clips or permission to overlap narration with the card.

## Phone-cooling check

The initial idle probe found the existing finite 7–9 s home chakra turns and tutorial-card shadow pulse still repainting the screen heavily during its measurement window. Those home decorations are now static; battle pacing in Quick is unchanged. No new waiting animation loop was added.

`tools/perf-idle.mjs` now honours `CHROMIUM_PATH`, actually selects a movable cell (`data-id`), cracks the real fort (`key: 'F'`), sets the real turn field, checks `busy`/`thinking`, and fails if any screen reaches 3% busy or has a runtime error. The robot also honours `CHROMIUM_PATH` and explicitly selects Quick, as the brief allows.

Measured alone, at 390 × 844, device scale 2 and 4× CPU throttling:

| Screen | Main-thread busy | Paints |
|---|---:|---:|
| Home | 0.7% | 0 |
| Battle idle | 2.0% | 3 |
| Battle selected | 0.9% | 1 |
| Battle mid-game | 0.3% | 0 |

These are browser measurements, not phone temperature or battery measurements.

## Validation

| Required command | Result |
|---|---|
| `node tests/rules.mjs` | 119 passed, 0 failed |
| `node tests/selfplay.mjs 40` | 40 games, 0 failures |
| `node tests/daily.mjs` | Passed |
| `node tests/ui.mjs` | 115 passed, 0 failed |
| `node tools/shots.mjs` | Desktop and phone passed; no runtime errors |
| `node tools/perf-idle.mjs` | All four screens under 3% busy |
| `node tools/playtest-bot.mjs` | 8 battles at 390 × 844 and 360 × 640, lesson, Daily and Settings; `no problems` |
| `node tools/build-standalone.mjs` | Rebuilt `vyuha-standalone.html` |
| `git diff --check` | Passed |

The UI suite includes fake-timer coverage of effect/card/voice ordering, a long effect, the complete AI handover, default/persisted settings, one-step skipping, reduced-motion gaps, clock gating, cancellation, narration priorities/watchdog and unchanged Quick delays. Browser recording uses real assets and actual Shakuni decisions, with no timing scale or forced AI action.

Service-worker cache: **`vyuha-v18`**. The standalone was rebuilt after the last runtime change.

## Evidence and next action

- `docs/evidence/calm-pace/calm-turn.mp4` — exactly 20 seconds, 390 × 844, silent real-time screen capture.
- `docs/evidence/calm-pace/calm-turn.gif` — smaller-dimension GIF of that capture for the PR.
- `docs/evidence/calm-pace/timeline.json` — real effect/voice completion and phase timestamps.
- `tools/record-calm-turn.mjs` — reproducible recording harness; requires Chromium, FFmpeg and ffprobe.

The recording uses a prepared wheel position with a Yantrik in reach, followed by Shakuni's real response. It is automated browser evidence, not an uncoached human playtest, native-language review or test on a physical phone.

Next: review the timing conflict, then the Commander tries Calm, Quick and skip on his own phone before deciding whether to merge. No merge was performed here.

## Review and media QA — 1 November 2026

First-use Astra films previously depended on a completed lazy image probe: the
first invocation got null and omitted its film. The stage now mounts the film
directly, behind the card and above the board, with a still-emblem fallback on
load failure. Reduced motion (setting or OS preference) and effective battery
saver avoid creating the animated image. CSS also hides it when reduced motion
changes during a card. Ten new UI assertions cover the four first-use films,
missing-media fallback and the two motion/cooling settings.

`tools/media-qa.mjs` runs eleven legal prepared positions in real Chromium at
390 × 844, with shipped audio and unscaled timings: capture, trap, gate breach,
fort victory, volley, four astras, reduced motion and battery saver. All passed;
each turn produced one played voice line, after its tracked effect completed.
All four first-use films loaded above the board. Results and card screenshots:
[`evidence/media-qa-2026-11-01/`](evidence/media-qa-2026-11-01/).
The trap still uses its synthesised fallback in this branch; the supplied
recording and five extra music tracks are being integrated separately.

Fresh 20-second recording replaces the previous evidence. Its real clash takes
**6.67 seconds from slide start to AI preview**, including a 2.59-second effect
and a 2.08-second voice line. No phase was skipped. This confirms the documented
timing conflict; the 4–5-second estimate is **not** claimed. Quick retains its
original action/card/think delays. The recording encoder now pads to exactly
20 seconds even if Chromium delivers fewer screencast frames.

Rechecked: 119 rules, 40 self-play games (zero failures), Daily regressions,
125 UI assertions, desktop/phone screenshot harness. Idle probe: home 0.3%,
battle 1.0%, selected 0.4%, mid-game 0.4%; all below 3%. The standalone is rebuilt;
cache `vyuha-v19`. Real-phone temperature, touch comfort and listening approval
remain the Commander's review. Nothing is merged or deployed.
