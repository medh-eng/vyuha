# Chapter IV — draft recordings

**Not shipped. Not wired into the game.** These are drafts of Sanjaya's Chapter IV lines, recorded from
`incoming/text/sanjaya-chapter4.csv` on 15 November 2026 so that nothing waits on the recording once the
Director approves the text.

- **Speaker:** `rahul` · **Pace:** 1.15 · `bulbul:v3` · 44100 Hz, mono, MP3 64 kbps
- **Files:** 28 — 14 ids × Hindi and English, in `hi/` and `en/`
- **Length:** every line is 3.24 s or shorter, inside the Calm budget

The ids (`vow_taken_1`, `hero_karna_armour_1`, …) do not exist in `js/sanjaya.js` yet, so nothing here plays.
When the Director approves the text and wires the ids in, move these files to
`assets/audio/voice/hi/` and `assets/audio/voice/en/` and delete this folder.

If the text changes before approval, re-record with:

```
SARVAM_API_KEY=... python3 tools/voice-gen.py --speaker rahul --pace 1.15 --ids <id>
```

once the lines are in `docs/voice/sanjaya-lines.csv` — or the same script that produced these drafts, which
reads the CSV in `incoming/text/`.
