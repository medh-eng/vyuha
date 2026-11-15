# Interface localisation

The runtime bundles the 251-key English catalogue and Sarvam's matching Hindi
and Marathi catalogues. The first 149 keys are unchanged from PR #5 (`c52bb2b`);
the 102 keys added on 15 Nov are Sarvam Batch 6.1 (wheel lessons, odds words,
Confirm strike, the goal box, the battle log, the ladder and Challenge a friend).

- English: `docs/i18n/strings.en.json`
- Hindi/Marathi: `docs/i18n/strings.hi.json`, `strings.mr.json`
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

`docs/voice/pending-recordings.json` is now **empty**: all 16 Hindi and 2 English
lines whose old recordings no longer matched reviewed text were re-voiced on
15 Nov 2026 (Sarvam Batch 6.3, speaker `rahul`, pace 1.15), and the four routine
lines that ran over the Calm budget were shortened and re-recorded (Batch 6.2).
The guard itself stays in `js/sanjaya.js` and is still tested — add an id to
`VOICE_PENDING` if a recording ever has to be pulled again.

Keep the queued Promise/ended-event narration implementation from PR #4 when
integrating: retain this pending-recording guard inside that implementation.
This proposal does not change the slide/card/voice-watchdog/AI timing constants.
