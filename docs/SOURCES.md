# Sources — where the art and sound came from

The store listing and any legal review will ask for this. One file for every supplied batch
(moved here on 6 Nov 2026 from `masters/audio/…/SOURCES.md` and `incoming/audio/SOURCES.md`).
The original files are in the masters archive — see [`MASTERS.md`](MASTERS.md).

## Sound — source statement (Commander, 7 Nov 2026)

The Commander states that **all sound in the game comes from Gemini (generated) or Pixabay**, and that
both allow commercial use without payment. This replaces the earlier "YouTube, described as copyright-free"
wording in the tables below for the 5 Nov pack; if any of the pakhawaj or ravanhatta files did in fact
come from a YouTube upload, tell the Director so the row is corrected — that is the one case where the
statement would not hold. The register still does not name which file came from which of the two
sources, and no page links were captured. Pixabay's own licence (no payment, no attribution needed;
the sound may not be resold unchanged or registered with a Content ID system) is the one to cite for
those files; the generator's terms are the one to cite for the Gemini files.

Still useful before a store launch (not a blocker for play): per file, "Gemini" or the Pixabay page
link, filled into the tables below. Keep the page title and date for each Pixabay file.

## Sound — 30 Oct 2026 (Commander)

`trap.mp3`, `battle_night.mp3`, `daily_theme.mp3`, `lesson.mp3`, `abhimanyu.mp3`, `victory_big.mp3`,
received in the VYUHA conversation. Originals: `masters/audio/supplied-2026-10-30/`.
The generation tool, prompt, creator and licence terms were not supplied; this register does not
assert rights or invent a source.

Processing: `tools/prepare-audio-pack.py` (FFmpeg). Four music tracks use one-second loop
crossfades; victory and trap use short end fades. Runtime copies are MP3, 44.1 kHz, 96 kbps,
stereo except mono trap.

## Sound — 5 Nov 2026 (Commander's Pata pack)

Originals: `masters/audio/supplied-2026-11-05/`. The "Source (reported)" column is the 5 Nov note;
the 7 Nov statement above says Gemini or Pixabay. Fill in the per-file link or "Gemini".

| Master file | Shipped as | Source (reported) | Link and licence |
|---|---|---|---|
| `sanjaya-ravanhatta.mp3` | `music/sanjaya_ravanhatta.mp3` (home music, Pata) | YouTube, described as copyright-free | **TODO: video link + licence wording** |
| `pakhawaj-1.mp3` | `sfx/pata_clash_1.mp3` | YouTube, described as copyright-free | **TODO** |
| `pakhawaj-2.mp3` | `sfx/pata_clash_2.mp3` | YouTube, described as copyright-free | **TODO** |
| `pakhawaj-4.mp3` | `sfx/pata_clash_3.mp3` | YouTube, described as copyright-free | **TODO** |
| `pakhawaj-3.mp3` | not used (very quiet, kept) | YouTube | **TODO** |
| `pakhawaj-5-long.mp3`, `pakhawaj-vaidya-long.mp3`, `pakhawaj-sample-long.mp3` | not used yet (long performances; possible battle-drum layer later) | YouTube | **TODO** |
| `cloth-tearing.mp3` | `sfx/pata_fall.mp3` (1.25–2.1 s) | Pixabay | Pixabay Content License — **TODO: page link** |
| `clothes.mp3` | `sfx/pata_ui.mp3` (0.12–0.42 s) | Pixabay | Pixabay Content License — **TODO: page link** |
| `cloth-rustle.mp3` | `sfx/pata_sky.mp3` (7.4–8.7 s) | Pixabay | Pixabay Content License — **TODO: page link** |

## Sound — 6 Nov 2026

| Master file | Shipped as | Source (reported) | Link and licence |
|---|---|---|---|
| `reveal-brush.mp3` (6 s, two strokes) | `sfx/pata_reveal.mp3` (first stroke, 0.2–0.9 s). Replaces the 2 s ravanhatta sting on the reveal | not given | **TODO: page link + licence** (PATA.md asked for Pixabay or Freesound CC0) |

Originals: `masters/audio/supplied-2026-11-06/`.

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

- **If any file did come from YouTube, it is the risk.** Many "no copyright" uploads re-post other people's recordings, and
  a recording can carry a Content ID claim even when the upload says it is free. Keep the YouTube
  sounds as stand-ins only, unless the uploader's page gives a clear licence (CC0 or CC BY with the
  credit line) for that exact recording. Replacements: Pixabay or Freesound (CC0 filter) pakhawaj
  and ravanhatta, or — best — a short recording of a local player.
- Pixabay sounds may be used in a game without credit; they may not be sold or shared on their own.

All shipped Pata copies are made by `python3 tools/prepare-pata.py` (trim, fade, loudness: one-shots
around −14 to −20 LUFS, music −17 LUFS, true peak −1.5 dB).
