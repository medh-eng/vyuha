# Handoff — latest status

**5 November 2026 · Director.** Replace this file at the end of each session.

## State

Gate 1 is passed in practice: the Commander chose **Sanjaya's Pata** by making its whole Phase 1
art set (27 pieces, both Chakravyuha fields, frame, home chamber, lamp, Sanjaya) with Gemini,
plus 11 sounds. This session wires it in on branch `claude/rang-phase-1-art` (PR open). Classic
stays the default look until Phase 1 is finished.

| What | Where |
|---|---|
| Masters, untouched | `incoming/art/pata/**`, `masters/audio/supplied-2026-11-05/` (+ `SOURCES.md`) |
| Shipped copies (WebP pieces 256 px ≈ 20 KB each; fields 1254 px; 2.0 MB music) | `assets/art/pata/**`, `assets/audio/sfx/pata_*.mp3`, `assets/audio/music/sanjaya_ravanhatta.mp3` — rebuild with `python3 tools/prepare-pata.py` |
| Painted pieces per army, hidden = ink sketch, fort shows the broken gate once breached | `js/art.js` (`paintedPiece`, `probePata`); vector figures stay as the fallback |
| Painted Chakravyuha under the cells, day and night; red rim set on the outer ring (1.60) | `js/game.js` `renderBoard` (kept `image.pata-field` node) |
| Home: chamber painting, marching border, one-shot lamp flare; Sanjaya's new portrait | end of `css/app.css`, `PATA_SLOTS` in `js/art.js` |
| Pata sounds: three pakhawaj clashes in turn, cloth tear on capture, cloth tap, ravanhatta home music | `js/audio.js` (`sampleKey`, `musicKey`, `setLook`) |
| Screenshot harness now checks 24 painted pieces, 12 hidden sketches and the field | `tools/shots.mjs` |

## Fixed on the way

- In Pata the board frame's 1.2 s background fade repainted the whole painting every frame
  (idle battle 3 %). The fade is off for the painted frame; idle is back to 1 %.
- The closed side drawers cast a dark shadow into the screen in the light looks.
- The old dark scene backdrop showed behind home and battle in the light looks.

## Checks (all passed)

rules 150 · self-play 40, 0 failures · Daily · languages · UI 157 · assets · desktop/phone
screenshots incl. the new Pata checks · idle < 3 % portrait and landscape for Classic, Pata,
Pahari, Bright · landscape 115 · Calm budget unchanged (33/46) · robot (see PR) · standalone
rebuilt · offline cache v27.

## Open

- **Sound licences:** the ravanhatta and pakhawaj files came from YouTube "copyright-free"
  uploads. Fill the links in `SOURCES.md`, or replace them before any store launch.
- Older CSS points at `css/assets/art/opt/ui/home.jpg` and `panel.jpg` (wrong relative path,
  404, existed before this work) — fix in the Phase 1 screen pass.
- Not in the Pata look yet: setup, profile, result screens, astra buttons and the clash
  cinematic still show the dark style. `pata_reveal.mp3` and `pata_sky.mp3` are loaded and
  waiting for the reveal flood and sky re-dye effects. Banners where pieces fell: not built.
- Not done by anyone: physical-phone feel and heat, real-player playtest, native Marathi review.

## Next

1. **Commander:** merge the PR; open `https://medh-eng.github.io/vyuha/?skin=pata` on the phone
   and play a battle; fill the sound links.
2. **Director — Phase 1, rest:** reveal colour-flood + sting, dropped banners where pieces fall,
   sky re-dye with `pata_sky`, every screen in cotton, then make Pata the default (Classic stays
   in Settings).
3. **ChatGPT:** hero-card styling may now start in the Pata style (use the reference pair).
4. **Sarvam:** Batch 4 and 5 as briefed.
