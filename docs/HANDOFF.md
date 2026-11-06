# Handoff — latest status

**6 November 2026 · Director.** Replace this file at the end of each session.

## State

**Rang Phase 2 art is in the game, and the repository is tidy**, on branch
`claude/pata-phase-2-tidy` (PR open). Rules, engine, AI and Daily are unchanged.

| New this session | Where |
|---|---|
| Padmavyuha, Sarvatobhadra, Kurukshetra painted under the cells, day and night (sky re-dye works on all four fields) | `A.PATA_FIELDS`, `A.PATA_FIELD_BOX` in `js/art.js`; placement in `renderBoard` (`js/game.js`) |
| Sarvatobhadra: the painted 6 × 8 grid lines up with the cells (stretched 8 % — its squares are painted taller than wide) · Kurukshetra: camps under each army's deploy rows · Padma: seed pod on the hub | measured on the shipped pixels; re-measure if a master is replaced |
| Night fields: corner star covered, cloth re-dyed toward indigo (40 %) | `unstar`, `night_dye` in `tools/prepare-pata.py` |
| Nine painted avatars (profile picker, home header) and four astra stills (action bar, invocation card, codex) in the Pata look; Classic keeps its own | `PATA_SLOTS` in `js/art.js`; CSS at the end of `css/app.css` |
| Invocation card in Pata: no dark loop behind it, the still at 140 px, readable words on cotton | `js/stage.js`, `css/app.css` |
| Reveal sound = one wet brush stroke (0.7 s) instead of the ravanhatta sting | `assets/audio/sfx/pata_reveal.mp3` |
| Fix: profile hub repaints when a Pata portrait lands | `artLanded` in `js/ui.js` |
| Repo 240 MB → 33 MB: `masters/`, Pata PNG masters, `assets/3d/`, `rang.html` out of the tree; originals in four zips | `docs/MASTERS.md`; provenance in `docs/SOURCES.md` |
| `perf-idle` can measure any field: `BOARD=padma|small|large` | `tools/perf-idle.mjs` |

## Checks (all passed)

rules 150 · self-play 40, 0 failures · Daily · languages · UI 160 · assets (now checks every Pata
file and the Classic fallback) · desktop/phone screenshots · landscape 115 · idle < 3 % on the
wheel and on padma/small/large, portrait and landscape · Calm budget unchanged (33/46) · audio
routing · robot "no problems" · standalone rebuilt · offline cache v29. The three new fields,
the avatar picker and two invocation cards were also checked by screenshot in headless Chrome.

## Open

- **Masters zips:** the Commander keeps them on his computer and, ideally, attaches them to a
  GitHub Release `masters-2026-11-06` (steps in `docs/MASTERS.md`; Claude sessions cannot create releases).
- **Night fields:** the masters carry Gemini's star; regenerate `padma-night`, `small-night`,
  `large-night` without it before a store launch. Supplied "night" paintings were lit like day;
  the 40 % indigo dye is the Director's call — change `night_dye(amount)` if the Commander prefers.
- **Sound licences:** links in `docs/SOURCES.md` (YouTube pack, Pixabay pages, the brush stroke).
- Scenario cards on the setup screen still use the older dark paintings.
- Hero cards (ChatGPT) can now use the Pata avatars in `assets/art/pata/portraits/`.
- Not done by anyone: physical-phone feel and heat, real-player playtest, native Marathi review,
  listening to the brush stroke on a phone speaker.

## Next

1. **Commander:** merge the PR; play one battle on each field on the phone (check the painted
   grid on Sarvatobhadra, the night dye, the reveal brush); save the four zips; fill sound links.
2. **Director:** Phase 2 rest — scenario cards and remaining dark screens in Pata; then Phase 3
   rest (festival days, haptics) and Phase 4 (hero cards, banners, campaign scroll).
3. **ChatGPT:** hero-card styling in Pata with the new avatars; Batch 4/5 as briefed.
4. **Sarvam:** Hindi/Marathi for the Scroll captions, the note picker and the tip.
