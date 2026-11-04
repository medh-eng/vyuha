# VYUHA — Look & Feel plan: *Sanjaya's Pata* (Chapter IV · Rang)

Proposed 3 Nov 2026 by the Director; accepted for implementation by the Commander the same day.
The full plan with pictures, tables and the roadmap lives in the Claude Doc
<https://claude.ai/artifact/D1JS6qLuZEVKt3zEiFppy2>. This file is the repo copy that sessions work from.

## The idea

VYUHA plays well but looks like a dark-mode app: navy panels, near-black paintings, 32 px brass
coins. The new look turns the battle into a **painted narrative cloth** that Sanjaya unrolls for
the blind king — the way a Phad singer performs an epic in front of a painted cloth, playing the
ravanhatta.

- **Hidden means unpainted.** Every hidden enemy is the same bare ink sketch. A reveal floods
  colour into it. Your own pieces are always fully painted.
- **Pieces become people:** painted warriors, horses, chariots; a fort with three states.
- **The field remembers:** each fallen piece leaves a dropped banner on its cell.
- **Sanjaya's Scroll:** every battle ends as a painted strip of 4–6 moments, ready for WhatsApp.
- **Cotton by day, indigo by night:** each field painted twice; the sky turn re-dyes the cloth once.

Rules, engine, AI, Daily, modes and every test stay untouched. No WebGL switch: today's page/SVG
board plus the one effects canvas, one-shot effects only, idle < 3 % on every screen.

## Style rules

- Flat mineral colour, bold lamp-black outline, gold leaf only on highlights. No glossy metal,
  no photographic shadow. A piece must read at 32 px.
- Palette tokens: cotton `#F2E4C4`, indigo cloth `#1F2A5C`, vermilion `#C8341C`, saffron
  `#EE8F1C`, lapis `#2C58A8`, conch white `#F7F1E3`, malachite `#2E8A62`, ochre `#C68A2E`,
  gold leaf `#D6A23C`, lamp-black `#1C1510`.
- Suryavansh: vermilion + saffron, scalloped sun rim. Chandravansh: lapis + conch white, crescent
  notch rim. Every piece sits on its own cotton disc.
- One tradition per field: Chakravyuha — Phad; Padmavyuha — Pattachitra; Sarvatobhadra —
  Kalamkari; Kurukshetra — Pahari miniature.
- No deity anywhere. Astras stay wind, trance, fire, light.
- Today's art stays as the **Classic bronze** skin in Settings and as the fallback.

## Phases and gates

| Phase | Sessions | Work | Gate after |
|---|---|---|---|
| 0 Direction ✅ | 1–2 | Prompt pack (`docs/prompts/PATA.md`), 32 px legibility sheet (`tools/legibility.mjs`), three looks to try on a phone (`rang.html`: A Pata, B Pahari, C Bright), skin system | **Gate 1:** Commander picks the look on his phone |
| 1 One field | 4–5 | Chakravyuha day/night, 20 pieces + hidden sketch + fort states + banners, reveal/clash/fall/sky effects, cotton & lacquer UI kit, Sanjaya's chamber home, ravanhatta theme | **Gate 2:** beats today's build side by side; 5 people name 8 of 10 pieces at 32 px; idle < 3 % |
| 2 Fields | 3–4 | Other three fields, astra films and ten avatars repainted, every screen, hi/mr strings | — |
| 3 New feel | 3–4 | Sanjaya's Scroll, charcoal notes, festival days, phone buzz, sound pass | **Gate 3:** five-person playtest + respect review |
| 4 Heroes | 3–5 | Hero cards in the new style, dhvaja banners, first folk-art edition, campaign scroll | then launch art |

## How the skins work (Phase 0)

- `html[data-skin]` = `bronze` (Classic, the default) · `pata` · `pahari` · `bright`. Chosen in
  Settings → *Look (preview)*, or for a quick look with `index.html?skin=pata` (the link wins).
  Landing page for Gate 1: `rang.html`.
- Pata and Pahari draw every piece as a stand-in vector figure (`FIGURES` in `js/art.js`, 64-unit
  grid, colours from CSS classes so one drawing serves both armies and every skin). Hidden enemies
  are the same ink sketch (`SKETCH`). The painted files from `PATA.md` replace the figures later.
- Skin CSS is the last block of `css/app.css`; nothing in it animates. The fort shows a broken
  gate once breached. Board stone texture and sky photos are off in Pata and Pahari.
- Checks: `tests/ui.mjs` has five look checks; `SKIN=pata node tools/perf-idle.mjs` measures a
  look's idle heat (all three under 3 % portrait and landscape on 3 Nov);
  `node tools/legibility.mjs <dir> pata` writes the 32 px sheet.

## Commander decisions (recommendations; confirm or change)

1. Art direction: Sanjaya's Pata — confirmed at Gate 1 from the mockups.
2. Default theme: light cotton by day, indigo at night.
3. Keep today's look as "Classic bronze".
4. Repaint ten avatars, Sanjaya and the four astras in the new style.
5. Art source: Commander with AI tools from `PATA.md`; optionally commission one traditional
   Phad or Pattachitra painter for the home painting and Sanjaya (after a quote).
6. Hold ChatGPT's Batch 5 hero-card design until Gate 1.
7. Merge PR #12 before Phase 1.

## Known problems in today's art

- Many paintings carry a small four-point star at bottom right that looks like an image
  generator's visible watermark — replace before any store launch.
- Yantrik emblem is a wrench and gear; Chara is an Egyptian-style eye — both off-period.
- Three styles at once: engraved emblems, near-black scenes, semi-realistic portraits.
