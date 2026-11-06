# Handoff — latest status

**6 November 2026 (evening) · Director.** Replace this file at the end of each session.

## State

PR #18 (Pata Phase 2 + tidy) is merged. New branch **`claude/landscape-big-board`** (PR open)
answers the Commander's phone test of the Pata wheel in landscape. Rules, engine, AI and Daily
are unchanged.

| Commander's report | What changed | Where |
|---|---|---|
| Sanjaya's "Abhimanyu knew how to break in…" plays twice | The story card ran its callback from both "Take the field" and the modal's close; now once | `showStory` in `js/game.js` |
| Board changes size on clicks/turns | The landscape field is placed by position, sized only from the screen and `--board-aspect`; rails scroll inside themselves and cannot push it. Measured constant over 14 turns on wheel, padma, large. (Could not reproduce the old jitter in headless Chrome: likely the address bar or enlarged phone text; both are now irrelevant.) | landscape layer in `css/app.css` (rebuilt); `renderBoard` sets `--board-aspect` |
| Landscape default, board as big as possible | On a phone, entering a battle requests full screen + landscape lock (setting "Full screen, sideways, in battle", default on). Leaving the battle unlocks and exits. A "Full screen / Exit full" rail button. Wheel at 830×318 grows 306 → 310 px; in full screen the address bar's ~60 px also goes to the field | `canFull/enterFull/leaveFull` in `js/game.js`; `show()` in `js/ui.js`; `fullscreen` in `js/storage.js` |
| New player can't find the buttons | Every left-rail button has its name (Menu, Settings, Intel, Log, Full screen; hour chip says Surya/Chandra); astras show their names in landscape | `.hud-label`, `.astra-name` |
| Pieces too small, power not visible | Token radius per cell: wheel rings 0.15/0.19/0.21 (was 0.145), squares 0.42 (0.33), lotus 0.64 (0.5), hub 0.25; rank on a solid army-coloured seal; chosen piece shown as a 76 px painting with a rank seal and its full description in the rail | `tr` in `js/geometry.js` (display only); `rankBadge` in `js/game.js` |
| (found) "Move / Strike" text invisible when on, in Pata | vermilion fill, cotton text | end of `css/app.css` |

## Checks (all passed)

rules 150 · self-play 40, 0 failures · Daily · languages · UI 160 · assets · desktop/phone
screenshots · landscape 115 (harness now detects the layout by the rail's position, not grid) ·
idle < 3 % portrait, 844×390 and 830×318 · Calm budget unchanged (33/46) · robot "no problems" ·
standalone rebuilt · offline cache v30. Extra: board box measured across turns and selections.

## Open

- **Not phone-tested.** Full screen and orientation lock work only after a tap and only in
  browsers that allow them (Android Chrome yes; iPhone Safari no — there the layout still fits).
- Square fields stay taller than wide in landscape (own army at the bottom). Turning them sideways
  would make their cells ~20 % larger; needs the Commander's call (painted camps would lie sideways).
- New strings (`hud.*`) are English only: Sarvam to add Hindi/Marathi.
- Unchanged from before: night-field regenerations, sound licence links, masters release,
  scenario cards in Pata, hero work, five-person playtest.

## Next

1. **Commander:** merge; on the phone, start a battle (should go full screen and sideways), check
   piece size, the labels, and that the board no longer resizes; Settings has the toggle to turn it off.
2. **Director:** Phase 2 rest (scenario cards, dark screens in Pata), Phase 3 rest, Phase 4.
3. **Sarvam:** Hindi/Marathi for `hud.menu/settings/intel/log/full/exit_full`.
