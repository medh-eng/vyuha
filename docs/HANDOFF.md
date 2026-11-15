# Handoff — latest status

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

---

**15 November 2026 · ChatGPT · T-12, Batch 6.5 (on top of 6.3).** Batch 6.5's **written design** is
delivered at [incoming/text/hero-cards-design.md](../incoming/text/hero-cards-design.md).
It specifies portrait/landscape Pata placement for the hero picker, battle HUD
and result screen; turn-by-turn previews for Arjuna, Drona, Abhimanyu and Bhishma;
the four implemented passive traits; hidden-information fairness; accessibility,
language keys, balance requirements, and integration acceptance tests. The existing
hero portraits were checked by filename (not visually approved). No gameplay,
art, translation or runtime code changed on this branch. Local browser tests were
not run: only the repository instructions and source files were reviewed.

**Sequencing:** The 13 November hard review still holds: T-05 five real first-time
phone playtests, then the Seven Vyuhas campaign, before implementing/shipping
heroes. Batch 6.2 (the reproducible four-hero balance screen) and 6.4 (hero-aware
AI and fair odds) therefore remain pending for that stage. Existing PR #28
(media QA) and #30 (Quiet Gate) must be merged in that order before this
stacked design branch. PRs #29/#31 are Sarvam's separate stacked translation
work. Do not enable heroes on main from this design alone.

---

**Earlier 15 November 2026 · ChatGPT · T-12, Batch 6.3**

Quiet Gate passed its two-bank screen with four starting Shakti for the defenders.
The four raider win rates were 50.8% and 51.7% in bank 5, and 45.0% and 49.2% in bank 6
(wheel, then lotus). The Director can review the draft for inclusion in the Daily rotation.
The [balance report](balance/README.md#quiet-gate--15-november-2026) includes paired controls,
the seed bases, and replay commands. No catalogue or game behaviour changed.

PR #28 delivers Batch 6.1. Both skins passed all media checks in GitHub Actions. In its
first CI attempt the unrelated battle-log harness stopped at “padma: at least one of
your own moves was checked (0)”. The simulated battle did not supply the move the test
requires. [Job log](https://github.com/medh-eng/vyuha/actions/runs/43699342760/job/132766806259).
This is evidence for the Director’s existing T-22 harness task.

The newer [review plan](REVIEW.md) places heroes after the campaign. The remaining
ChatGPT items within T-12 are the four-hero balance screen, AI hero awareness and
the Pata hero-card design. The campaign awaits T-05, five first-time players on
their own phones. Record observations in the roadmap. Parts 1 and 2 are on main.
Sarvam’s translation submission is in PR #29, with its native review still pending.
