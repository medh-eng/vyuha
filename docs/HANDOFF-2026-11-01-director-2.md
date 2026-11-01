# Director handoff — 1 November 2026, second pass

Branch `claude/integrate-2026-11-01` → **PR #8** (draft). It now carries all seven open agent
PRs; close #3, #4, #5, #6, #7, #9, #10 when #8 merges.

## Integrated this pass

| PR | What | Director changes |
|---|---|---|
| #9 localisation (ChatGPT) | Hindi/Marathi interface from Settings, reviewed narration text, 18 recordings held back | Kept #8's Calm sequence; moved the pending-voice guard into the queued voice; `tr()` kept in the Calm HUD text and breach card. Cache **vyuha-v24**. |
| #7 portraits (ChatGPT) | Drona, Bhishma, Draupadi, Dhrishtadyumna 1024² PNGs | Exported **512 px WebPs (32–42 KB)** to `assets/art/opt/heroes/`; PNGs moved to `masters/heroes/`. Fixed the picker showing sigils on first open (it now repaints as portraits load). Evidence: `docs/evidence/portraits-2026-11-01/avatar-picker-live.png`. |
| #10 landscape design (ChatGPT) | Design + sketch | **Built** — below. |

## Landscape (built)

- Phone landscape (`orientation: landscape`, height ≤ 520, width ≥ 560): status rail · field ·
  action rail, per `incoming/text/landscape.md`. Rails 96/136 px at 640 wide, 112/176 at 844.
  Field shell 376×348 at 640×360, 524×378 at 844×390, 576×402 at 896×414.
- CSS only (end of `css/app.css`), so turning the phone is a pure reflow: selection, mode, clock,
  voice and cards are untouched. Sanjaya sits in a fixed plate at the foot of the action rail;
  toasts show one at a time above it; the lesson coach takes the top of the rail.
- One-time portrait hint (`#rotate-hint`, `landscapeHintDismissed` setting): first ordinary
  battle, touch phone, input idle. Dismiss or rotate retires it for good.
- `tools/landscape.mjs`: 115 checks — four fields × three sizes, Hindi and Marathi, 44 px
  targets, field fully visible, no overlap/overflow, rotation mid-turn (and back) keeps
  selection/clock/actions, clash card fits, lesson coach placement, hint lifecycle.

## Calm timing

`tools/pace-budget.mjs` now measures every battle line (see `docs/PACING.md`). Routine clashes
reach the AI in **4.0–4.6 s** typically; 33 of 46 line/voice pairs are within 5 s. Four routine
lines are 0.05–0.4 s over and go to Sarvam for shorter recordings (Batch 4.2). The 520 ms
"slide" in the recording was screen-capture overhead, not the game.

## Checks run here

rules 121/0 · self-play 40, 0 failures · Daily · UI 147/0 · assets · desktop/phone screenshots ·
idle < 3 % portrait (max 1.7 %) and landscape (max 1.5 %) · robot "no problems" · media QA ·
landscape 115/0 · line budget.

Not done: physical phone (feel, heat, reach in landscape), human listening, native Marathi
review, the 18 + 4 recordings.

## Next

Commander phone test (portrait and landscape) → Sarvam Batch 4 (recordings) → ChatGPT Batch 4
(robot in landscape, design review of the built layout).
