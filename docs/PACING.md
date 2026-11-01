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

## Every line, measured (1 Nov, second pass)

`node tools/pace-budget.mjs` computes clash → AI preview for every battle line in both voices
from the shipped recordings and the constants in the code:

- **33 of 46** line/voice pairs reach the AI within 5.0 s; typical routine clash **4.0–4.6 s**;
  shortest 3.5 s.
- **Four routine lines** are over by 0.05–0.4 s: `volley_kill_1` (hi 3.76 s),
  `trap_defused_1` (en 3.53 s), `assassinate_1` (hi 3.47 s), `rotate_padma_1` (en 3.40 s).
  These need re-voicing at **≤ 3.3 s** (Sarvam Batch 4). Nothing is sped up in code.
- The rest of the over-5 s pairs are **major moments** (gate breach, astras, dusk) where a
  longer beat is intended.
- The "520 ms slide" seen in the recording was screen-capture overhead: without capture the card
  and effect start 315 ms after the slide begins (446 ms at 4× CPU throttle).
- Re-check after any new recording: `node tools/pace-budget.mjs --strict` fails if a routine line
  is over budget.

## Next steps

| # | Task | Owner |
|---|---|---|
| 1 | Phone test of PR #8: three Calm battles, one Quick, portrait **and** landscape. Note any line that feels rushed, any moment that feels slow, warmth after 10 min. | Commander |
| 2 | Re-voice the four routine lines above to ≤ 3.3 s (rewrite text shorter if needed), plus the 18 pending recordings in `docs/voice/pending-recordings.json`. | Sarvam |
| 3 | Only if the Commander still finds ordinary clashes slow after #1: speak on an ordinary clash every other turn (text still shows). Not built — decide from the phone test. | Director |

When an effect file changes: run `python3 tools/sfx-envelope.py assets/audio/sfx/*.mp3` and update
`SPEAK_AT` in `js/audio.js` (the −20 dB column).
