# Sources — Commander's sound pack, 5 Nov 2026 (Chapter IV · Rang)

Where each file came from, as the Commander reported it. The store listing and any legal review
will ask for this. **Fill in the links** — "copyright-free on YouTube" is not a licence by itself.

| Master file | Shipped as | Source (reported) | Link and licence |
|---|---|---|---|
| `sanjaya-ravanhatta.mp3` | `music/sanjaya_ravanhatta.mp3` (home music, Pata), `sfx/pata_reveal.mp3` (first 2 s) | YouTube, described as copyright-free | **TODO: video link + licence wording** |
| `pakhawaj-1.mp3` | `sfx/pata_clash_1.mp3` | YouTube, described as copyright-free | **TODO** |
| `pakhawaj-2.mp3` | `sfx/pata_clash_2.mp3` | YouTube, described as copyright-free | **TODO** |
| `pakhawaj-4.mp3` | `sfx/pata_clash_3.mp3` | YouTube, described as copyright-free | **TODO** |
| `pakhawaj-3.mp3` | not used (very quiet, kept) | YouTube | **TODO** |
| `pakhawaj-5-long.mp3`, `pakhawaj-vaidya-long.mp3`, `pakhawaj-sample-long.mp3` | not used yet (long performances; possible battle-drum layer later) | YouTube | **TODO** |
| `cloth-tearing.mp3` | `sfx/pata_fall.mp3` (1.25–2.1 s) | Pixabay | Pixabay Content License — **TODO: page link** |
| `clothes.mp3` | `sfx/pata_ui.mp3` (0.12–0.42 s) | Pixabay | Pixabay Content License — **TODO: page link** |
| `cloth-rustle.mp3` | `sfx/pata_sky.mp3` (7.4–8.7 s) | Pixabay | Pixabay Content License — **TODO: page link** |

## Before a store launch

- **YouTube files are the risk.** Many "no copyright" uploads re-post other people's recordings, and
  a recording can carry a Content ID claim even when the upload says it is free. Keep the YouTube
  sounds as stand-ins only, unless the uploader's page gives a clear licence (CC0 or CC BY with the
  credit line) for that exact recording. Replacements: Pixabay or Freesound (CC0 filter) pakhawaj
  and ravanhatta, or — best — a short recording of a local player.
- Pixabay sounds may be used in a game without credit; they may not be sold or shared on their own.
- Art: the Commander made the Pata paintings with Gemini and reports that its terms allow
  commercial use. No visible watermark was found on any file (checked 5 Nov).

All shipped copies are made by `python3 tools/prepare-pata.py` (trim, fade, loudness: one-shots
around −14 to −20 LUFS, music −17 LUFS, true peak −1.5 dB).
