# Handoff — latest status

**7 November 2026 · Director.** Replace this file at the end of each session.

## State

PR #19 (landscape rebuild) and PR #20 (fresh-code cache) are merged and live. New branch
**`claude/first-session-clarity`** (PR open) does step 2 of the review plan: first-session
clarity. Rules, engine outcomes, AI and Daily are unchanged; the engine only gains a
presentation helper (`E.strikeVerdict`).

| Commander's brief | What changed | Where |
|---|---|---|
| Four short lessons on the wheel before any full battle | **Chakra Shiksha**, four lessons on the Chakravyuha, one idea each, controlled positions, enemy held still: (1) *First move, first strike* — your Maharathi and a revealed Rath, step in then strike; (2) *The wheel turns* — round 4, tap the cell where your Rath on ring 2 will be carried (wrong taps explain; after two misses the answer glows), then end the round and watch it land there; (3) *The hidden warrior* — strike a "?" enemy that reads Likely win (75 %), it was a Divyadrishti; (4) *One astra* — 3 Shakti, Agneyastra on a hidden Yantrik (other astras refused in this lesson). Each ends with one line and **Next lesson**; the last ends with **Daily Chakravyuha** and **Quick battle**. No rules screen; the coach in the rail carries one instruction at a time | `WHEEL_LESSONS`, `startWheelLesson`, `openLessons` in `js/modes.js`; hooks `onCellTap`, `allowAction`, `customResult` in `js/game.js` |
| …before any full battle | Home "Pehla Yuddh" card now opens the lessons (straight into lesson 1 the first time, a 4-row list after). A brand-new player who taps **Yuddh karo** is offered the lessons **once** ("Start the lessons" / "Fight now"). Progress in `settings.wheelLessons`; all four sets `tutorialDone`. `#learn` opens lesson 1. The old six-step square drill (look, volley, trap, fort) stays as "Field drill" in the list and at `#drill` | `js/ui.js`, `js/storage.js` |
| Odds in plain words | Board tags say **Likely win / Uncertain / Likely loss** (≥ 60 % / 35–59 % / < 35 %), and when only one outcome is possible **Certain win / Certain loss / Both fall / Breaks the gate / Takes the fort**. Note under the verdict: "Based on enemy ranks you can't see yet." or "Both ranks are known, so the result is certain." The % stays as detail ("chance to win 58 %") in the rail and in Intel | `E.strikeVerdict` in `js/engine.js` (8 rules tests); `oddsTag`, `strikeCard`, `oddsBlock` in `js/game.js` |
| Confirm strike / Cancel instead of only tap twice | First tap on a target arms it; the rail shows the target, the verdict, the note and **Confirm strike** + **Cancel** (Confirm volley for archers; **Invoke ‹astra›** + Cancel for astras). Tapping the target again still works. At 830×318 the lesson coach shrinks to 30 % while confirming so both buttons are in view without scrolling | `confirmArmed`, action bar in `js/game.js`; end of `css/app.css` |
| Phone heat | The armed-cell pulse used to loop forever; with the Confirm card it now plays 3 times and holds still. Idle probe gains two screens (battle-confirm, lesson-confirm) | `css/app.css`; `tools/perf-idle.mjs` |

## Checks (all passed, 7 Nov)

rules 158 · self-play 40, 0 failures · Daily · languages (149 keys) · UI 180 (confirm/cancel,
verdict words, all four lessons) · assets · desktop/phone screenshots · landscape 115 · idle
< 3 % at 390×844, 844×390 and 830×318 (battle-confirm 0.4–0.6 %, lesson-confirm 1.2–1.8 %,
measured after the finite pulses stop) · Calm budget unchanged (33/46) · robot "no problems"
· **new `tools/first-session.mjs`**: four lessons in Calm at 914×411 and 830×318, Confirm
visible without scrolling, 32 checks · standalone rebuilt · offline cache v32.

Before/after screenshots at 914×411 and 830×318 were sent to the Commander in chat (not in git).

## Open

- **Not phone-tested, no real-person playtest.** The lessons are the funnel for the
  first-session playtest (5–10 people) that the review plan asks for next.
- **Translations:** 65 new strings are English-only (Hindi/Marathi fall back to English):
  `docs/i18n/pending-first-session.en.json` → Sarvam, plus the 5 short "allow" hints in
  `WHEEL_LESSONS` (`wheel.<lesson>.<step>.allow`). Old `lesson.strike.text` still says
  "tap again" (still true; the drill only).
- Lesson pieces held still show the trance mark, as in the old drill.
- The rail says "Your move · Tap a piece…" under the prediction question in lesson 2 (harmless; could be hidden).
- Unchanged: square-field sideways decision, night-field regenerations, sound licence links,
  masters release, scenario cards in Pata, hero screening, Batch 4/5 for ChatGPT and Sarvam.

## Next

1. **Commander:** merge; on the phone: Home → Pehla Yuddh, play the four lessons in Calm; check
   the Confirm strike card in a Quick battle; say if any lesson line is too long.
2. **Director:** review plan step 3 — ghost preview of the next ring turn, warning one turn before,
   exposure highlight after (lesson 2 is the natural place to show it first).
3. **Sarvam:** Hindi/Marathi for `docs/i18n/pending-first-session.en.json` and the `hud.*`, `goal.*`, `astra.shakti` strings.
