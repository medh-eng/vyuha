# Sanjaya's voice — batch 1 (generated)

- **Tool:** Sarvam AI Bulbul, model `bulbul:v3` (v2 is deprecated)
- **Speaker:** `ashutosh` — one calm male voice used for both Hindi and English, so Sanjaya is
  the same person in either language
- **Language codes:** `hi-IN` (Hindi set) · `en-IN` (English set)
- **Pace:** 0.9 · **Sample rate:** 44100 · mono · MP3 64 kbps
- **Generated:** 29 Oct 2026 · 44 Hindi + 44 English lines, 0 failures, 2.6 MB total

Files live where the game looks for them:

```
assets/audio/voice/hi/<id>.mp3    used with Hinglish or Hindi text
assets/audio/voice/en/<id>.mp3    used with English text
```

## Changing the voice

Other male speakers on `bulbul:v3`: `aditya`, `rahul`, `rohan`, `amit`, `dev`.
Re-generate the whole set with one command (the speaker is a single argument):

```
SARVAM_API_KEY=... python3 tools/voice-gen.py --speaker rahul --lang both
```

Never mix speakers between batches — one voice for the whole game.

## Still to do

- Task 1 in `docs/agents/SARVAM.md`: have the Hindi lines reviewed by a native speaker before
  this is treated as final; any corrected line is a one-file re-record
  (`tools/voice-gen.py --ids <id>`).
- Task 3: Marathi set, after the Hindi review.

## Batch 2 — 15 November 2026

- **Tool:** same endpoint, model `bulbul:v3`
- **Speaker:** `rahul` (the Director's Batch 4.1/6.3 note) · **Pace:** 1.15 · 44100 Hz, mono, MP3 64 kbps
- **Files:** 22 — 18 Hindi, 4 English. The 18 pending re-records, the four shortened routine lines, and
  `astra_vayavya_enemy_1` (shortened from a 6.14 s line to 3.92 s)
- **Result:** 22 generated, 0 failures

**This makes two speakers in the game.** Batch 1 above is `ashutosh` at 0.9; batch 2 is `rahul` at 1.15.
Pick one before release: either regenerate the whole set with

```
SARVAM_API_KEY=... python3 tools/voice-gen.py --speaker rahul --pace 1.15 --lang both
```

or re-record this batch with `--speaker ashutosh --pace 0.9 --ids <the 22 ids>`. Never ship a mix.

## Chapter IV drafts — 15 November 2026

The 14 Chapter IV lines are recorded as drafts (28 files, `rahul` at 1.15, every line ≤ 3.24 s) in
`incoming/voice/chapter4/{hi,en}/`. They are **not wired into the game** — the Director approves the
text first. See the README in that folder.
