# Handoff — latest status

**7 November 2026 (afternoon) · Director.** Replace this file at the end of each session.

## State

PR #21 (first-session clarity: four wheel lessons, odds in words, Confirm strike) is merged.
New branch **`claude/wheel-turn-preview`** (PR open) does step 3 of the review plan: the wheel
turn made visible. Rules, outcomes, AI and Daily unchanged; the engine's turn now uses one shared
map (`E.rotationMap`) for both the preview and the turn itself.

| Review plan step 3 | What changed | Where |
|---|---|---|
| Ghost preview of the next ring turn | One round before the inner rings turn ("Chakra/Lotus turns in 1"), every piece they will carry gets a **dashed ring where it will land** (your colour or theirs) and, where there is room, a short arrow along the ring. Recomputed every redraw, so it follows moves made that round. Works on the wheel and the lotus | `ghostLayer`, `turnSoon` in `js/game.js`; `E.rotationMap`, `E.rotationPreview` in `js/engine.js` (8 rules tests) |
| Warning one turn before | At the start of that round: one toast ("The chakra turns after this round. Dashed rings show where it will carry each piece."), the rail line says the same under "Your move", and the GOAL box already shows the countdown in vermilion. Calm and Quick both warn (Quick had a toast only) | `warnTurn`, `turnRailText` |
| Exposure highlight after | The turn event now lists `carried` and `exposed` cells. For that round, enemy pieces whose rank the turn exposed get a **solid gold cell**, your own exposed pieces a thin dashed gold ring; the rail says "The chakra turned. Gold cells: enemy ranks it exposed. N enemy ranks now showing. M of yours exposed (dashed)." Gone next round | `noteRotation`, `exposedNow` in `js/game.js`; `rotate` in `js/engine.js` |
| Lesson 2 | The preview stays hidden while the player predicts; after the right answer the dashed ring confirms it; the lesson's closing line now names the dashed and gold rings | `noGhost` hook in `js/modes.js` |

All static SVG/CSS: no animation, nothing loops.

## Checks (all passed, 7 Nov)

rules 166 · self-play 40, 0 failures · Daily · languages · UI 184 · assets · desktop/phone
screenshots · landscape 115 · first-session 32 · idle < 3 % at 390×844, 844×390, 830×318 (new
row battle-turn-soon 0.6–0.8 %) · Calm budget unchanged (33/46) · robot "no problems" ·
standalone rebuilt · offline cache v33. Before/after screenshots at 914×411 and 830×318 (and the
lotus) sent in chat.

## Open

- **Not phone-tested; no real-person playtest.**
- In an opening position most of both armies stand on the turning rings, so round 4 shows many
  dashed rings at once, and on the wheel the arrows are mostly hidden under neighbouring tokens
  (the rings carry the message). Watch on the phone whether it reads as clutter.
- New strings English-only: `turn.warn`, `turn.soon`, `turn.exposed`, `turn.exposed_theirs`,
  `turn.exposed_mine` (plus the 65 in `docs/i18n/pending-first-session.en.json`) → Sarvam.
- Unchanged: square-field sideways decision, night-field regenerations, sound licence links,
  masters release, scenario cards in Pata, hero screening, ChatGPT/Sarvam Batch 4/5.

## Next

1. **Commander:** merge; on the phone, play a Quick battle to round 5 and say whether the dashed
   rings help or clutter; play the four lessons (PR #21) if not done yet.
2. **Director:** review plan step 4 — a more useful battle log (cell names, own pieces), audio
   priority checks.
3. **Sarvam:** Hindi/Marathi for the step 2 and step 3 strings.
4. **Commander + friends:** 5–10 first-session playtests (Home → Pehla Yuddh → first battle).
