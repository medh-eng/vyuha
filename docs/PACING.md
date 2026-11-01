# VYUHA — Calm pacing: budget, overlap rules, and the plan

Director, 1 November 2026. Supersedes the timing section of the Batch 3.0 brief.

## Why Calm took 6.7 s

The Batch 3.0 sequence was strictly serial: slide → **whole** effect file → **whole** voice line →
breath → AI "thinking" → preview. Measured on the shipped files:

| Waste | Cause | Size |
|---|---|---|
| Near-silent tail | `clash.mp3` is 2.56 s but falls 20 dB below peak at **1.2 s**; Calm waited for `ended` | ~1.4 s |
| Fake thinking after the voice | AI waited 0.9–1.4 s *after* Sanjaya and the breath | ~1.0 s |
| Card hold longer than its effect | AI volley: 0.67 s effect, voice waited for the 2.2 s card | ~1.5 s dead air |
| Voice cut short | Voice watchdog was a flat 3.5 s; **20 of 88** recordings are longer (median 3.0 s, max 5.1 s) | lines truncated |

"No overlap" had been read as "nothing may sound at the same time", which makes 4–5 s impossible
(2.56 + 2.08 + 0.4 + 0.9 ≥ 6 s before the slide).

## The overlap rules (what "no overlap" now means)

1. **One voice at a time.** Sanjaya never interrupts himself; higher priority replaces a *waiting* line only.
2. **Never two loud effects.** A beat's effect finishes, or is stopped, before the next beat's effect starts.
3. **Voice may enter over an effect's tail, never its body.** Each effect has a measured `SPEAK_AT`
   point (−20 dB from peak, `js/audio.js`). At that point the remaining tail is softened by ~10 dB
   and Sanjaya starts. Music is already ducked under voice.
4. **The card stays up while Sanjaya speaks** and closes when he finishes (or on tap).
5. **The opponent thinks while Sanjaya speaks.** A 0.7–1.1 s think timer starts with the voice; after
   the voice and a 250 ms breath, the AI acts at once if the timer has elapsed.
6. **Every step remains skippable** with one tap; leaving the battle cancels everything.

## The budget (implemented)

| Step | Before | Now |
|---|---:|---:|
| Slide | 400 ms | 300 ms |
| Card read before voice | effect end (2.6 s) | max(1.1 s, effect body) |
| Voice | ≤ 3.5 s (truncated) | full line, watchdog = length + 0.6 s |
| Breath | 400 ms | 250 ms |
| AI thinking | 0.9–1.4 s after breath | absorbed into the voice (1.0–1.4 s only when silent) |
| AI preview glow | 500 ms | 400 ms |

Expected: clash → AI preview ≈ 0.3 + 1.1 + voice + 0.25 → **3.6 s with a 2 s line, 4.6 s with the
median 3 s line, 5.6 s with the longest lines.**

**Measured (real Chromium, shipped audio, `tools/record-calm-turn.mjs`):** clash → AI preview
**3.81 s** (was 6.67 s); the whole player-plus-AI exchange **8.6 s** (was 12.9 s). Timeline in
`docs/evidence/calm-pace/timeline.json`. Eleven media-QA scenarios still pass (capture, trap,
breach, victory, volley, four astras, reduced motion, battery saver).

## Next steps, in order

| # | Task | Owner | Why |
|---|---|---|---|
| 1 | **Phone test** on the PR preview: play 3 battles on Calm, 1 on Quick. Note any line that feels rushed, any moment that feels slow, phone warmth after 10 min. | Commander | Only a person can judge feel and heat. |
| 2 | **Shorter narration for routine clashes.** Lines over ~3 s (20 files) push the clash past 5 s. Re-voice or rewrite routine-event lines (capture, volley, trap) to ≤ 2.5 s; keep long lines for fort, breach, astra, victory. List from `tools/sfx-envelope.py`-style measurement of `assets/audio/voice`. | Sarvam (text + Bulbul) | Biggest remaining lever; lines are the clock now. |
| 3 | **Narration budget.** In Calm, speak for every fort/breach/astra/major capture, but for an ordinary clash speak at most once every two turns (text still shows). | ChatGPT | Less repetition, faster rhythm. |
| 4 | **Slide start overhead.** Measured slide → impact is ~520 ms vs the 300 ms target; profile the card mount (`stage.js show`) on a 4× throttled phone. | ChatGPT | ~0.2 s per action. |
| 5 | Trim `clash.mp3` tail to ~1.6 s with a fade (master kept) and re-measure `SPEAK_AT`. | ChatGPT | Cleaner mix; smaller file. |
| 6 | Battle-idle busy is 2.5 % (limit 3 %). Find the 5 paints on idle battle before adding any animation. | ChatGPT | Heat headroom. |

When an effect file changes: run `python3 tools/sfx-envelope.py assets/audio/sfx/*.mp3` and update
`SPEAK_AT` in `js/audio.js` (the −20 dB column).
