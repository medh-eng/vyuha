# Handoff — latest status

**5 November 2026, evening · Director.** Replace this file at the end of each session.

## State

**Rang Phase 1 is complete and Pata is now the default look**, on branch `claude/rang-complete`
(PR open). Players who never chose a look get the painted cloth; Classic bronze stays in
Settings → Look. Rules, engine, AI and Daily are unchanged.

| New this session | Where |
|---|---|
| Every screen in cotton: clash and event cinematics, result, loading screen, scenario-card frames; app colours (theme-color, manifest) | end of `css/app.css`, `index.html`, `manifest.webmanifest` |
| Reveal: a newly known enemy floods from grey to colour (0.9 s, once) with the ravanhatta sting | `pataMemory`, `tokenSvg` in `js/game.js` |
| The field remembers: the army's banner stays on the cell where a piece fell | `pataMemory` (view only; a loaded game starts clean) |
| Sky re-dye: the old painting fades over the new one (1.3 s, once) with the cloth swish | board commit in `renderBoard` |
| **Sanjaya's Scroll**: result screen → painted strip of up to 5 moments (opening blow, gate, astra, heaviest fall, the end) → Share (Android share sheet) or saved PNG | `js/scroll.js`, `noteMoment`, `openScroll` |
| **Charcoal notes**: hold (or right-click) a hidden enemy, pick a guess; a faint figure and "9?" show on it until the rank is revealed; one-time tip | `openNote`, `notesFor` |
| Default look = Pata | `js/storage.js`, `js/art.js`, `index.html` (`data-skin`) |

## Checks (all passed)

rules 150 · self-play 40, 0 failures · Daily · languages · UI 160 (3 new: notes, Scroll, default
look) · assets · desktop/phone screenshots incl. painted pieces · idle < 3 % portrait and
landscape for Pata (default), Classic, Pahari, Bright · landscape 115 · Calm budget unchanged
(33/46) · audio routing · robot (see PR) · standalone rebuilt · offline cache v28. The Scroll was
checked by playing a full battle in a real browser and rendering it (5 panels, correct fort states).

## Open

- **Sound licences:** fill the YouTube links in `masters/audio/supplied-2026-11-05/SOURCES.md`, or
  replace those sounds, before any store launch.
- The Scroll's words are English with Hindi titles; Hindi and Marathi lines are for Sarvam.
- Scenario cards on the setup screen still use the older dark paintings (framed in ink now).
- Other fields (Padmavyuha, Sarvatobhadra, Kurukshetra) have no painting yet: they show the plain
  cotton look. Prompts come next (Phase 2).
- Not done by anyone: physical-phone feel and heat, real-player playtest, native Marathi review.

## Next

1. **Commander:** merge the PR; play two battles on the phone (try holding a hidden enemy, and
   share a Scroll on WhatsApp); fill the sound links.
2. **Director — Phase 2:** prompt pack for the other three fields (Pattachitra lotus, Kalamkari
   rifts, Pahari plain), ten avatars and four astra stills in the Pata style; wire them as they
   arrive. Then Phase 3 rest (festival days, haptics) and Phase 4 (hero cards, banners, campaign scroll).
3. **ChatGPT:** hero-card styling in Pata (use the reference pair); Batch 4/5 as briefed.
4. **Sarvam:** Hindi/Marathi for the Scroll captions, the note picker and the new tip.
