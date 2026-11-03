# Handoff — latest status

**3 November 2026 · Director.** Replace this file at the end of each session.

## State

Chapter III is complete and live on `main` (797226e). Chapter IV first slice (Pratigya vows,
hidden hero engine) waits in **PR #12** for the Commander's phone look and merge.

**New this session — Chapter IV · Rang (the look).** The Commander accepted the plan to move
VYUHA from dark "temple-punk" to *Sanjaya's Pata*: the battle as a painted narrative cloth,
hidden enemies unpainted until revealed, painted pieces, cotton by day and indigo by night,
Sanjaya's Scroll share strip. Rules, engine, AI, Daily and tests stay untouched.

| File | What it is |
|---|---|
| `docs/LOOK.md` | The plan: idea, style rules, palette, phases and gates, seven Commander decisions |
| `docs/prompts/PATA.md` | Prompt pack for Phase 1: 20 pieces, hidden sketch, fort states, banners, Chakravyuha day/night, frame, home, Sanjaya, 8 sounds |
| `docs/ROADMAP.md` | New *Rang* section with gates |
| `docs/DIRECTOR.md` §4 | Note that the look is changing; temple-punk becomes "Classic bronze" |
| `docs/agents/CHATGPT.md` | Hold hero-card design until Gate 1 |
| `incoming/README.md` | New drop path `incoming/art/pata/` |

Full plan with screenshots and roadmap: <https://claude.ai/artifact/D1JS6qLuZEVKt3zEiFppy2>.

Docs-only session: no runtime file changed, so the game checks were not re-run here (they all
passed on 797226e on 1 Nov). Screenshots of today's build were taken with `tools/shots.mjs` for
the plan.

## Found in the current art

- Many paintings in `assets/art/opt/` carry a small four-point star at bottom right that looks
  like an image generator's visible watermark — must be replaced before a store launch.
- Yantrik emblem is a wrench and gear, Chara an Egyptian-style eye (off-period).

## Next

1. **Commander:** answer the seven decisions in `docs/LOOK.md`; phone look + merge of PR #12;
   start Phase 1 art from `docs/prompts/PATA.md` if you want to work ahead.
2. **Director, Phase 0:** 32 px legibility sheet, skin system (today's art = "Classic bronze"),
   three phone mockups of the battle screen (A Pata, B Pahari, C bright bronze) → **Gate 1**.
3. **ChatGPT:** Batch 4 and Batch 5 as briefed, except hero-card design (waits for Gate 1).
4. **Sarvam:** Batch 4 and Batch 5 as briefed.
5. Still not done by anyone: physical-phone feel and heat, real-player playtest, native Marathi review.
