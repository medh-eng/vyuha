# Handoff — latest status

**13 November 2026 (evening) · Director.** Replace this file at the end of each session.

**15 November 2026 · Sarvam.** Batch 6.1 landed — Hindi and Marathi for the 102 pending strings (T-06, PR #29).

## Sarvam Batch 6.1 — what changed

| Item | What changed | Where |
|---|---|---|
| 102 keys | Hindi and Marathi for the wheel lessons, the odds words, Confirm strike / Cancel / Invoke, the goal box (`goal.sunset`, `goal.bala`), the battle log (`log.*`), the ladder (`ladder.*`), the endings (`fall.*`, `end.movers_*`), the Daily title and Challenge a friend (`challenge.*`, `result.challenge`) | `docs/i18n/strings.hi.json`, `strings.mr.json` and `strings.en.json` — all three at 251 keys, same order |
| Bundle | `js/languages.js` and `vyuha-standalone.html` regenerated | `node tools/build-languages.mjs`, `node tools/build-standalone.mjs` |
| Test | `tests/languages.mjs` pins 251 keys and also asserts the bundle covers every English key | `tests/languages.mjs` |
| Glossary held | रैंक / दर्जा · खाना / घर · दाँव / डाव · घेरे / कडे · दुश्मन / शत्रू · दुर्ग · द्वार / दरवाजा · मोहरा · बौछार / वर्षाव · दृष्टि / दृष्टी · सेनापति / सेनापती · महारथी · दिव्यदृष्टि / दिव्यदृष्टी · अग्न्यस्त्र · ब्रह्मास्त्र · शक्ति / शक्ती | — |
| Register | Hindi stays polite (करें / कीजिए) with dandas; Marathi keeps तुम्ही with full stops, as in the existing catalogue | — |
| share.cta (T-30) | The Marathi question gets its particle: “तुम्ही आत घुसू शकाल का?” The Hindi reads clean | `docs/i18n/strings.mr.json` |

Checks: rules 166 · self-play 40 · Daily · languages (251 keys) · UI 212 · data 159 · assets · audio 44 · log 18 ·
pace-budget · `tools/language-shots.mjs` in Hindi and Marathi at 390 and 360 (real touch, no sideways overflow,
result title translated, preference persists, offline standalone). `tools/language-shots.mjs` is flaky at
`visible cell r1s0` (the cell exists but has no layout box ~250 ms after `startPrepared`): it failed 3 of 5
runs on this branch and 2 of 2 runs on `main` at `6849539`, so it predates Batch 6.1 — logged as T-31.

Honest limits: **no native-speaker review** of the new Hindi or Marathi (T-30 is still owed); no human
phone test; older engine prose outside the catalogue (help and coach lines, event log sentences) is still
English — that is T-17 and the coverage boundary in `docs/i18n/README.md`.

## State

The hard review and its four-part plan are **`docs/REVIEW.md`** — read it first.

- **PR #26** (Part 1, branch `claude/first-session-ladder-scenes`): scenario paintings, the ladder, home and result card sideways. CI green; waiting for the Commander.
- **PR #27** (Part 2, branch `claude/review-part2-endings-challenge`, **stacked on #26** — merge #26 first): endings shown, Daily wording, Challenge a friend.

### Part 2 — what changed

| Item | What changed | Where |
|---|---|---|
| How a battle ended | The engine records `state.endKind`: `fort`, `movers`, `limit`, `sunset`, `quiet`, `stalemate`, `conceded` | `endGame(…, kind)` in `js/engine.js` |
| The undefended fort (T-26) | Rule unchanged (a side with no movers loses). It now emits an `abandon` event at the loser's fort: a fort card ("The fort is taken" / "has fallen"), a burst at the fort, Sanjaya's fort line (priority 9); the result card says "Their last fighter fell on round N. Nothing stood at the fort — it is taken." | `js/engine.js` finishTurn, `AC.stage.fall`, `narrate`, `endLine` in `js/game.js` |
| Sunset (T-26) | Rule unchanged. In the last ten rounds before sunset the GOAL box shows "Sunset in N · Bala 24 – 19" (yours first, coloured when ahead/behind) | `renderGoal`, `.goal-turn.sunset` |
| Daily wording (T-27) | Briefing title "The wheel is closed. Break in."; share line `share.cta` "Same wheel for everyone today. Can you break in?" in English, Hindi and Marathi (Hindi/Marathi by the Director — **needs a native read**). "Abhimanyu got in. Can you get out?" stays as the home headline for the escape mode | `js/modes.js`, `js/languages.js`, `docs/i18n/strings.*.json` |
| Challenge a friend (T-28) | Every AI battle has `config.seed`, which fixes the enemy formation (fresh each battle; kept only in a challenge). Result card: **Challenge a friend** shares `#c=<field>.<opponent>.<v\|c>.<seed36>.<rounds>` (rounds 0 after a defeat = "avenge me"). Opening the link (or receiving it in an open tab): a briefing, then the same field, opponent and enemy formation; the player still deploys their own army. Result note: beaten / matched / slower / failed / avenged. Challenge battles do not move the ladder note | `newState` seed in `js/engine.js`; `challengeHash`, `challengeNote` in `js/game.js`; `parseChallenge`, `startChallenge` in `js/modes.js`; `deepLink` + `hashchange` in `js/ui.js` |
| Bug found | Every stage card's sentence (clash, volley, gate, fort) was cream on cream in the Pata look — unreadable since Pata became the default. Now ink | end of `css/app.css` |
| Bug found | `handleGameOver` could set `AC.app.profile` to null if storage was cleared mid-session | `js/game.js` |
| Strings | 23 more pending keys (`fall.*`, `end.movers_*`, `goal.sunset`, `goal.bala`, `daily.title`, `result.challenge`, `challenge.*`) — **102 pending** | `docs/i18n/pending-first-session.en.json` |

Honest limit of the challenge: the AI's moves depend on the player's moves, so it is "same field, same
opponent, same enemy formation" — not a replay. The text says exactly that.

## Measured (seeded AI-v-AI, 40 battles per field, Dronacharya v Dronacharya)

wheel fort 31 / movers 9 · lotus movers 28 / fort 11 / sunset 1 · Sarvatobhadra movers 17 / sunset 12 / fort 11 ·
Kurukshetra sunset 25 / fort 12 / movers 3. Every movers ending carried a correct fort event (57 of 57).

## Checks (Part 2 branch)

rules 166 · self-play 40 · Daily · languages · UI 212 (17 new) · data 159 · assets · audio 44 · log 18 ·
shots · first-session 32 · landscape 122 · pace-budget (same four long lines as before) · battle-log ·
idle heat — see the PR · robot — see the PR. **Not phone-tested; no real-person playtest; Hindi/Marathi share line not natively reviewed.**

## Open — Commander

Merge #26 then #27 · **T-05 five silent first-session playtests — the gate for Part 3** · T-25 phone check
(home and result sideways; also: send yourself a challenge on WhatsApp and open it) · T-23 branches ·
T-08 wheel night field · T-02/T-03/T-16.

## Next — Director

Part 3 waits for T-05. Until then: T-21 (festival days, sound pass), T-17 (log prose keys), T-22
(battle-log flake). Part 4 prep: the 102 pending strings — Sarvam has delivered nothing since
Batch 3; the review says stop waiting.
