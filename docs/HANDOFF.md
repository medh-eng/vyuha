# Handoff — latest status

**3 November 2026 · Director.** Replace this file at the end of each session.

## State

Chapter III is live on `main`. Two Chapter IV tracks run side by side:

1. **Heroes and vows** — branch **`claude/chapter-4-pratigya-heroes`** (PR #12, now merged up
   with `main`, waiting for the Commander's phone look).
2. **Rang, the new look** — *Sanjaya's Pata*, plan merged in PR #13 (`docs/LOOK.md`,
   `docs/prompts/PATA.md`). Full plan with pictures: <https://claude.ai/artifact/D1JS6qLuZEVKt3zEiFppy2>.

### Heroes and vows (PR #12)

| Area | What is on the branch | Where |
|---|---|---|
| Pratigya (vows) | 12 vows; three offered at lock-in of an AI duel once the player has won once; static HUD seal (tap for the rule); kept/not-kept line on the result card; stars, three titles (Vrati 3 · Dridhavrata 10 · Satyavrata 25) and stamps in the profile; Settings → "Offer a vow before battle". Cosmetic only. | `js/pratigya.js`, `js/game.js` (search `Pratigya`), `js/ui.js` (`vowSection`), `js/storage.js` (`recordVow`), end of `css/app.css` |
| Chronicle | Per-side record of what happened, read by the vows | `js/engine.js` (`chron`, `newChronicle`) |
| Heroes (engine only) | Bhima (wins equal clashes), Karna (once survives a lost ranked clash), Ghatotkacha (+1 at night), Dhrishtadyumna (+1 Shakti on his own first breach). Off unless `config.heroes = {1: {key, host: '9'\|'10'}}`. **No UI yet.** | `js/engine.js` (`HEROES`, `heroOf`), `tools/hero-sim.mjs` |

Vow wording differs slightly from the draft where the draft could not be judged by the engine
(e.g. "Bhishma's restraint" = the Senapati never strikes; "The patient engineer" = a Yantrik
dismantles the trap). A clash Karna survives emits `outcome: 'none'`, which the clash cinematic
does not yet draw specially — handle it when the hero UI is built.

Checks on the branch before the merge-up (all passed): rules 150 · self-play 40, 0 failures ·
Daily · languages · UI 152 · assets · desktop/phone screenshots · idle < 3 % portrait and
landscape · landscape 115 · robot "no problems" · standalone rebuilt. The merge-up from `main`
touched docs only; tests re-run after it are listed in the PR.

### Rang (PR #13, merged)

Docs only: `docs/LOOK.md` (idea, palette, phases, gates, seven Commander decisions) and
`docs/prompts/PATA.md` (Phase 1 art and sound briefs). Found in today's art: a small four-point
star at bottom right of many paintings (looks like a generator watermark — replace before a
store launch); Yantrik emblem is a wrench and gear, Chara an Egyptian-style eye.

Not done by anyone yet: physical-phone feel and heat, human listening, real-player playtest,
native Marathi review, Hindi/Marathi vow text.

## Next

1. **Commander:** merge PR #12 after a look on the phone (win one battle, then lock a formation
   — the vow offer appears); answer the seven decisions in `docs/LOOK.md`; Phase 1 art from
   `docs/prompts/PATA.md` if you want to work ahead. Phone test and five-person playtest still open.
2. **Director:** Rang Phase 0 — 32 px legibility sheet, skin system ("Classic bronze"), three
   phone mockups → **Gate 1**. Then integrate agent work; adjust heroes from 5.1; build the
   hero card (styled after Gate 1) and pick; Arjuna, Drona, Abhimanyu, Bhishma; then the
   seven-vyuha campaign.
3. **ChatGPT Batch 5** (`docs/agents/CHATGPT.md`): screen the four heroes; teach the AI the
   heroes; hero-card placement and flows as text (styling waits for Gate 1). Batch 4 still owed.
4. **Sarvam Batch 5** (`docs/agents/SARVAM.md`): vow strings in Hindi/Marathi; Sanjaya's vow and
   hero lines; respect read. Batch 4 still owed.
