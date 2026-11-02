# Handoff — latest status

**2 November 2026 · Director.** Replace this file at the end of each session.

## State

Chapter III is live on `main`. Chapter IV has begun on branch
**`claude/chapter-4-pratigya-heroes`** (pull request open, not yet merged).

| Area | What is on the branch | Where |
|---|---|---|
| Pratigya (vows) | 12 vows; three offered at lock-in of an AI duel once the player has won once; static HUD seal (tap for the rule); kept/not-kept line on the result card; stars, three titles (Vrati 3 · Dridhavrata 10 · Satyavrata 25) and stamps in the profile; Settings → "Offer a vow before battle". Cosmetic only. | `js/pratigya.js`, `js/game.js` (search `Pratigya`), `js/ui.js` (`vowSection`), `js/storage.js` (`recordVow`), end of `css/app.css` |
| Chronicle | Per-side record of what happened, read by the vows | `js/engine.js` (`chron`, `newChronicle`) |
| Heroes (engine only) | Bhima (wins equal clashes), Karna (once survives a lost ranked clash), Ghatotkacha (+1 at night), Dhrishtadyumna (+1 Shakti on his own first breach). Off unless `config.heroes = {1: {key, host: '9'\|'10'}}`. **No UI yet.** | `js/engine.js` (`HEROES`, `heroOf`), `tools/hero-sim.mjs` |

Vow wording differs slightly from the draft where the draft could not be judged by the engine
(e.g. "Bhishma's restraint" = the Senapati never strikes; "The patient engineer" = a Yantrik
dismantles the trap). A clash Karna survives emits `outcome: 'none'`, which the clash cinematic
does not yet draw specially — handle it when the hero UI is built.

## Checks on the branch (all passed)

rules 150 (19 hero/chronicle + 10 vow tests new) · self-play 40, 0 failures · Daily · languages ·
UI 152 (5 vow tests new) · assets · desktop/phone screenshots · idle < 3 % portrait and
landscape · landscape 115 · robot "no problems" (now takes the offered vow) · standalone rebuilt.
Calm line budget unchanged: 33/46 within 5 s, same four routine lines over (Sarvam 4.2).

Not done by anyone yet: physical-phone feel and heat, human listening, real-player playtest,
native Marathi review, Hindi/Marathi vow text.

## Next

1. **Commander:** merge the PR after a look on the phone (win one battle, then lock a
   formation — the vow offer appears). Phone test and five-person playtest still open. Art:
   vow stamps and title seals (`docs/prompts/ART.md`, *Chapter IV*).
2. **ChatGPT Batch 5** (`docs/agents/CHATGPT.md`): screen the four heroes; teach the AI the
   heroes; design the hero card and the four active heroes. Batch 4 still owed.
3. **Sarvam Batch 5** (`docs/agents/SARVAM.md`): vow strings in Hindi/Marathi; Sanjaya's vow and
   hero lines (text first); respect read of hero texts. Batch 4 still owed.
4. **Director, next session:** integrate whatever lands; adjust heroes from 5.1; build the hero
   card and pick from 5.3; then Arjuna, Drona, Abhimanyu, Bhishma; then the seven-vyuha campaign
   (`incoming/text/campaign.md`).
