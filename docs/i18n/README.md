# Interface localisation

The runtime bundles the 149-key English catalogue and Sarvam's matching Hindi
and Marathi catalogues. Source translations are unchanged from PR #5 (`c52bb2b`).

- English: `docs/i18n/strings.en.json`
- Hindi/Marathi: `incoming/i18n/strings.hi.json`, `strings.mr.json`
- Generator: `node tools/build-languages.mjs`
- Runtime: generated `js/languages.js`
- Portable build: `node tools/build-standalone.mjs` rebuilds the bundle first.

Settings → **Interface language / भाषा** chooses English, हिन्दी or मराठी.
The preference is `uiLang`; `narratorLang` remains a separate choice. Selecting a
UI language does not replay a narration preview or change the spoken language.
No Marathi voice option is offered because that recording set is not supplied.

The catalogue covers home actions, board/opponent/scenario descriptions, piece
help, Astra summaries, hours/formations, lessons, Daily modifier names/rules,
core battle controls and result headings/actions. Proper names remain paired
with their existing Devanagari names. Ranks, costs, identifiers, seeds, saves and
engine definitions remain unchanged. Localised definitions are display copies.

**Coverage boundary:** this integrates the supplied catalogue; it is not a claim
that every legacy sentence in the app is translated. Older Settings/profile
labels, some help-tab labels, greetings, tips, event/log prose and dynamic
status templates still use English. A further Sarvam catalogue pass is needed
for those categories. Missing keys use English fallback; the UI never prints
an internal key as player-facing text. Native Marathi human review is pending.

The bundle is synchronous and precached, with no runtime translation fetch,
MutationObserver, frame loop or external translation service. Both the PWA and
portable `file://` build retain the translations without a network connection.

## Reviewed narration

Ten Hindi rows differ from current runtime text in the 30-row review CSV (the
older PR description counted seven). Those exact corrections and the two
Commander-approved three-language rewrites are applied. The voice script was
regenerated. No recording was generated, renamed or replaced.

`docs/voice/pending-recordings.json` lists **16 Hindi and 2 English** files whose
old recordings no longer match reviewed text. Hindi serves Hinglish as well.
Those lines display their text without the stale voice; unchanged clips still
play. The Hindi list includes the four earlier pending re-records from the
Director's handoff. Clear each pending entry only when its new file is supplied.

Keep the queued Promise/ended-event narration implementation from PR #4 when
integrating: retain this pending-recording guard inside that implementation.
This proposal does not change the slide/card/voice-watchdog/AI timing constants.
