# Four profile portrait deliveries — 1 November 2026

Batch 3.1, delivered for Director review:

- `drona.png`
- `bhishma.png`
- `draupadi.png`
- `dhrishtadyumna.png`

Each is an RGB PNG, exactly **1024 × 1024**, with a black background. These use
the four portraits already supplied in the 30 October conversation. No new
generation, face change or compositional crop was made: the square 1254-pixel
sources were downsampled with Lanczos, and near-black pixels (all channels ≤3)
were normalised to pure black. The original source uploads remain unchanged.

Visual check: warm brass light, indigo shadows, chest-up human characters, no
text or frame. Drona carries a bow; Bhishma wears silver armour; Draupadi wears
crimson and gold; Dhrishtadyumna carries an upright sword. Circle crops were
inspected at 76 and 46 pixels, with a larger reference row.

Evidence: `docs/evidence/portraits-2026-11-01/circle-proof.png` and `manifest.json`
(dimensions, sizes and source/delivery SHA-256 values).

These files are **draft deliveries**, not live avatar integration. As specified
in `docs/prompts/ART.md`, the Director can key/crop and export 512-pixel WebPs to
`assets/art/opt/heroes/<name>.webp`. Existing avatar slots already use those
names and retain their sigils until the runtime art is supplied. Confirm each
face in the real profile picker before merging the optimised assets.
