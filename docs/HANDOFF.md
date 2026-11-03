# Handoff — latest status

**3 November 2026, evening · Director.** Replace this file at the end of each session.

## State

PR #12 (Pratigya vows, hidden hero engine) and PR #13 (Rang look plan) are merged; `main` is live.
This session: **Rang Phase 0** on branch `claude/rang-phase-0` (PR open).

| What | Where |
|---|---|
| Skin system: `bronze` (Classic, default) · `pata` · `pahari` · `bright`; Settings → *Look (preview)*; `?skin=` link override | `js/art.js` (`setSkin`, `SKINS`), `js/ui.js` (`skinOf`), `js/storage.js` (`skin`) |
| Stand-in painted figures for all ten pieces, and the hidden-enemy ink sketch | `js/art.js` (`FIGURES`, `SKETCH`) |
| Three looks, day and night, for battle, home and panels | last block of `css/app.css` |
| Gate 1 landing page with the four links | `rang.html` → live at `/vyuha/rang.html` after merge |
| 32 px legibility sheet tool | `tools/legibility.mjs` |
| Heat probe can measure a look | `SKIN=pata node tools/perf-idle.mjs` |

## Checks (all passed)

rules 150 · self-play 40, 0 failures · Daily · languages · UI 157 (5 new look checks) · assets ·
desktop/phone screenshots · idle < 3 % portrait and landscape for Classic, Pata, Pahari and
Bright · landscape 115 · robot "no problems" · Calm line budget unchanged (33/46; same four
routine lines over, Sarvam 4.2) · standalone rebuilt · offline cache bumped to v26.

Not done: the Commander's phone look at the three skins (Gate 1); physical-phone heat; real
players. The figures are vector stand-ins, not final art.

## Known limits of the preview looks

- Setup, profile, rules and result screens get the cotton panels but were not individually
  restyled; some dark art (astra buttons, clash cinematics, hero portraits) still shows in the old style.
- "Yuddh Aarambh" and other banners are restyled only in Pata/Pahari.

## Next

1. **Commander — Gate 1:** merge the PR, open `https://medh-eng.github.io/vyuha/rang.html` on
   the phone, play a few turns in each look (the sky turns at round 5), and say which one wins.
   Also answer the seven decisions in `docs/LOOK.md`.
2. **Director, after Gate 1 — Phase 1:** the chosen look on Chakravyuha at full quality: reveal
   colour-flood, field memory banners, sky re-dye, cotton/lacquer kit for every screen, Sanjaya's
   chamber home, then wire the painted files from `docs/prompts/PATA.md` as they arrive.
3. **ChatGPT:** Batch 4 and 5 as briefed (hero-card styling waits for Gate 1).
4. **Sarvam:** Batch 4 and 5 as briefed; add the Settings label "Look (preview)" and the four
   look names in Hindi/Marathi when convenient.
