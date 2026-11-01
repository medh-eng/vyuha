# Landscape battle — design proposal

1 November 2026 · Batch 3.3 · For Commander/Director review

**Aim:** give a 6.5-inch phone a clear battlefield with controls beside it.
Physical screen size does not determine browser space; size this layout in
available CSS pixels. This is a design proposal; the sketch is a schematic.

## Board and rails

Use three columns: **status rail · battlefield · action rail**. Keep the centre
free of a global header/footer and player strips. Preserve the current brass,
obsidian and day/night palette with static surfaces.

| Region | Contents and order |
|---|---|
| Left, 96–112 px | Menu/Settings; round, hour and optional clock; opponent strip above own strip; Intel; Rules/Log; Advisor. Strips retain side colour, active-turn mark, short name and surviving count. Tap for full name, captures and the opponent's Shakti. |
| Centre, remaining width | The entire battlefield, centred and aspect-correct. Own army stays at the bottom; rotating the phone never rotates the logical field. No narration or action shelf covers targets. |
| Right, 136–176 px | Own five Shakti lamps; four Astras in a 2×2 shelf with cost/spent/disabled states; selected-piece/target summary; existing Move/Strike and relevant Drishti/Volley or Cancel/Deselect controls; Sanjaya's latest line below. |

Show contextual actions only when relevant. Preserve the existing tap-a-piece,
tap-a-cell and strike-confirmation interaction. A disabled Astra explains why
on tap; the shelf cannot issue a second action during AI/cinematic input locks.
Intel and Rules/Log open dismissible sheets rather than squeezing the field.
Keep both armies' Shakti accessible and the current player's lamps always visible.

## Space budget and access

Use 8 px outer padding and two 8 px column gaps, after safe-area insets.
Choose the narrow rails at 640 px and the wider rails at 844 px; interpolate
between. Board square = the lesser of centre width and available height.

| Available viewport | Left / centre / right | Maximum square board shell |
|---|---|---|
| 844×390 | 112 / 524 / 176 px | 374×374 px |
| 640×360 | 96 / 376 / 136 px | 344×344 px |

These are budgets before notch/navigation insets and internal board decoration;
actual art fits inside them. A circular board remains height-limited: promise
clearer controls, not a fourfold board-area increase. Square fields retain their
native aspect ratio and may need a smaller scale.

Keep touch controls at least 44×44 px, visible focus and accessible names.
Allow English/Hindi/Marathi labels two lines and full text in the detail sheet.
If text enlargement needs more room, switch the Astra shelf to one column and
let rails scroll independently, with a visible scroll cue. Sanjaya's full line
must remain readable by scrolling or opening its detail, not clipped forever.
The board never scrolls with a rail. Below 320 px usable height, offer a compact
rail view and keep portrait available; never shrink controls to force a fit.

## Rotation, hint and fallback

On the first ordinary portrait battle, when input is idle and no narration,
tutorial or cinematic is active, show a dismissible inline hint:

> Turn your phone sideways to place the controls beside the board. Portrait works too.

Show it once; dismissal or rotation records a proposed
`landscapeHintDismissed` preference. No modal, forced orientation or repeated
prompt. Portrait keeps the present stacked layout with all controls available.

Respect notch/navigation insets and the visible browser height. Reflow on size
change without replaying entry animations or using a frame loop. Retain the
selected piece, armed target, turn, remaining clock, audio queue and cinematic
progress. Rotation must not restart a battle, replay a voice or spend an action.
Stage effects remain above the board with the existing skip/reduced-motion
behaviour; Calm/Quick timing belongs to Claude's pacing work.

**Implementation acceptance:** test 640×360, 844×390 and 896×414, then rotate to
360×640 portrait; English/Hindi/Marathi and enlarged text; wheel, lotus and both
square fields; selection, targeting, narration, pass-and-play curtain and lesson.
No overflow, lost action, hidden clock, accidental double move or focus trap.
Then run the required regression, screenshot, idle (<3%) and robot suites, plus
physical-phone reach/heat checks. These checks are proposed, not completed here.

Built 1 Nov 2026: CSS layer at the end of `css/app.css`; acceptance `node tools/landscape.mjs`. The original sketch is in git history (PR #10).
