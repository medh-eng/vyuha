# Portrait delivery — 1 November 2026

Task 3.1 delivered on `chatgpt/3.1-portrait-delivery-20261101`, based on main
`ce9c0de`. Four 1024 × 1024 PNGs are in `incoming/art/heroes/`, with exact names
from the Director's brief. Source uploads were reused and remain unchanged.

Checked: PNG decoding, exact square dimensions, pure-black background samples,
no lettering/frame, subject/style consistency and circular crops at 46/76 px.
The evidence folder contains a preview and hashes. Game code, cache, runtime
assets and standalone are unchanged, so gameplay/performance suites were not
re-run for this draft-only handoff. No live integration or device test claimed.

The Commander asked for the remaining tasks one by one: portrait delivery,
localisation integration, then a landscape design note. Calm clash adjustments
are reserved for Claude. The next task is localisation wiring from Sarvam's
reviewed PR #5, with runtime checks and explicit handling of missing recordings.
