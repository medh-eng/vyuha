# Landscape design handoff — 1 November 2026

The Commander requested portrait delivery, localisation integration and
landscape design in that order, and assigned Calm clash adjustment to Claude.

- Portrait masters and circle proof: PR #7.
- Localisation integration and browser evidence: PR #9. Director PR #8 owns the
  combined Calm/audio work; retain its sequence when integrating localisation.
- This task delivers Batch 3.3 at `incoming/text/landscape.md` with the optional
  `incoming/text/landscape.svg` schematic. It is based on main `ce9c0de` and
  changes no runtime code, rules, timing, stylesheet or live layout.

The proposal moves player strips and HUD into the left rail, action controls
and narration into the right rail, and reserves full height for the board.
Its 844×390 and 640×360 budgets include 8 px outer padding and column gaps but
must still subtract device safe insets. A circular board is height-limited;
landscape improves control placement rather than guaranteeing a larger board.
Both orientations remain usable, and the one-time hint makes rotation optional.

The SVG uses labelled boxes and a formation diagram; it is not a screenshot or
an interactive prototype. Geometry, XML and rendered readability were checked.
No runtime tests or physical Android tests are claimed for this writing-only
proposal. The note lists the acceptance checks for a later implementation.

Next: Commander/Director review the rail placement and hint; Claude implements
the chosen layout on a separate code branch, preserving the final localisation
and Calm input/voice lifecycle. No merge or release was performed here.
