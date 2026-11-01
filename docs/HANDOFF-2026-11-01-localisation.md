# Localisation integration — 1 November 2026

Branch `chatgpt/localisation-integration-20261101`, based on Sarvam PR #5 head
`c52bb2b` (itself based on main `ce9c0de`). Main and existing PRs are unchanged.
The Commander asked for portraits, localisation and landscape design one by
one, and reserved Calm clash adjustment for Claude.

Portraits are delivered in PR #7 at the exact incoming PNG paths. This next
proposal wires the 149-key UI catalogues, a persisted language selector, the
reviewed narration text and guards against playing superseded recordings.
See `docs/i18n/README.md` for coverage, build instructions and the remaining
English-copy categories. Native Marathi human review and new recordings remain
pending; neither is claimed as completed.

UI language and narrator language are independent. Switching the interface
does not change game state, costs, ranks, RNG or save identifiers, and does not
play an unrelated narration preview. English labels retain the previous view's
wording where supplied, except the approved Codex → Rules correction.

`js/languages.js` is generated and precached; the standalone builder regenerates
it before inlining. Cache `vyuha-v23`. The shared static home decoration fix and
Chromium-aware mandatory test harnesses from PR #4 are retained so the idle probe
can enforce the same <3% requirement; no battle pacing values are adjusted.

## Integration notes for Claude

- This branch contains PR #5's source text commits; do not discard its catalogues
  or recreate different copies when combining proposals.
- Keep PR #4's narration queue and `finished` Promise; insert the pending voice
  guard after determining the voice language, while retaining a skippable
  text-only completion path. Do not restore main's interrupting `playVoice`.
- Retain the UI-language test block alongside the Calm test block in `tests/ui.mjs`.
- Keep the language-aware text at the overlapping HUD/action/stage lines when
  integrating the Calm and audio branches. No rules-engine modification is
  part of this proposal.
- Keep `languages.js` in `index.html` before UI/game/modes, and in the service
  worker shell. Choose a fresh combined cache and regenerate the standalone.

## Remaining after this integration proposal

Landscape is a design note first (`incoming/text/landscape.md`), not a runtime
layout change. Portrait optimisation/live avatar integration remains with the
Director. Further legacy-English catalogue coverage, native Marathi review and
the 18 pending language/voice-file re-records remain content follow-up. Calm
clash adjustment is Claude's task per the Commander's latest instruction.
