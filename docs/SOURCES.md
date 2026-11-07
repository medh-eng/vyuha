# Sources — where the art and sound came from

The store listing and any legal review will ask for this. One file for every supplied batch
(moved here on 6 Nov 2026 from `masters/audio/…/SOURCES.md` and `incoming/audio/SOURCES.md`).
The original files are in the masters archive — see [`MASTERS.md`](MASTERS.md).

## Sound — where it came from (Commander, 7 Nov 2026 — settled)

| Kind | Source | Files |
|---|---|---|
| The ravanhatta and the pakhawaj | **Recorded and uploaded by the Commander himself** — his own recordings | `music/sanjaya_ravanhatta.mp3`; `sfx/pata_clash_1.mp3`, `pata_clash_2.mp3`, `pata_clash_3.mp3` (masters `sanjaya-ravanhatta.mp3`, `pakhawaj-1…5`, `pakhawaj-vaidya-long`, `pakhawaj-sample-long`) |
| The long music files | **Gemini** (made by the Commander) | every other file in `assets/audio/music/` |
| The sound effects | **Pixabay** (Pixabay Content License: free for commercial use, no attribution needed; not to be resold unchanged) | every other file in `assets/audio/sfx/` |

This is final. No page links are needed or kept. The per-file list is `data/sounds.json`.

Processing: `tools/prepare-audio-pack.py` and `tools/prepare-pata.py` (FFmpeg: trims, loop crossfades, end
fades, loudness; runtime copies are MP3, 44.1 kHz). Originals are in the masters archive —
see [`MASTERS.md`](MASTERS.md): `masters/audio/supplied-2026-10-30/`, `supplied-2026-11-05/`,
`supplied-2026-11-06/`.

Batches: 30 Oct (battle_night, daily_theme, lesson, abhimanyu, victory_big, trap) · 5 Nov Pata pack
(ravanhatta, pakhawaj, cloth sounds) · 6 Nov (reveal brush stroke → `sfx/pata_reveal.mp3`).

## Art

- **Pata paintings (5–6 Nov 2026):** made by the Commander with Gemini; he reports its terms allow
  commercial use. Phase 1 (pieces, Chakravyuha, frame, scenes, Sanjaya) had no visible watermark.
  Phase 2 (6 Nov): day fields `padma-day`, `small-day`, `large-day`. The first night fields carried
  Gemini's four-point star in a corner tile. **7 Nov:** the Commander supplied three new night fields
  (`padma-night`, `small-night`, `large-night`), painted in true indigo with no corner star; they
  replace the 6 Nov ones and ship as supplied (masters in `masters/pata/fields/`, not kept in git).
  The wheel's night field (`chakra-night`) is still the earlier painting.
- **Classic art (Oct 2026):** many of the older paintings carry a small corner star; replace before
  any store launch (ROADMAP).

## Before a store launch

- Sound: nothing outstanding.
- Art: replace the Classic paintings that carry a small corner star (ROADMAP).

All shipped Pata copies are made by `python3 tools/prepare-pata.py` (trim, fade, loudness: one-shots
around −14 to −20 LUFS, music −17 LUFS, true peak −1.5 dB).
