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

**15 November 2026 · Sarvam (second batch).** Batches 6.2–6.5 done (PR #31): the 18 pending recordings, the four short lines, the vow strings, Chapter IV, the respect read.

## Sarvam Batch 6.2–6.5 — what changed

| Item | What changed | Where |
|---|---|---|
| The 18 pending recordings (6.3) | Re-voiced: 16 Hindi and 2 English. The stale-audio guard is now **empty** (`VOICE_PENDING`), so these lines speak again instead of showing text only | `assets/audio/voice/{hi,en}/…`, `js/sanjaya.js`, `docs/voice/pending-recordings.json` |
| The four long lines (6.2) | Shortened, then re-recorded, all now inside 3.3 s at pace 1.15: `volley_kill_1` 2.56 s, `assassinate_1` 2.64 s, `trap_defused_1` (en) 3.03 s, `rotate_padma_1` (en) 2.80 s | `js/sanjaya.js` → `docs/voice/sanjaya-lines.csv`; record in `incoming/text/sanjaya-short-2026-11-01.csv` |
| A fifth line, found by measuring | `astra_vayavya_enemy_1` ran **6.14 s** (English) / 5.62 s (Hindi) — the longest line in the game, far past the 4 s bar. Shortened and re-recorded: 3.92 s both | same |
| Vow strings (6.4) | 45 Pratigya keys in Hindi and Marathi; the Deva vow words and the title names kept | `incoming/i18n/pratigya.hi.json`, `pratigya.mr.json` |
| Chapter IV lines (6.5) | 14 lines written, **not recorded** (2 per id, `vow_taken`, `vow_kept`, `vow_broken`, `hero_bhima_holds`, `hero_karna_armour`, `hero_ghatotkacha_night`, `hero_dhrishtadyumna_gate`). Columns as in `sanjaya-lines.csv`; every line is 11 words or fewer | `incoming/text/sanjaya-chapter4.csv` |
| Respect read (6.5) | Hero quotes and vow names read for what could land wrong; natural Hindi given for all eight hero quotes. Top flag: **Drona as a capturable piece** — get one external opinion before release | `incoming/text/heroes-respect-read.md` |

### Read this before release: the narrator is now two voices

The Director's Batch 4.1/6.3 note specifies **speaker `rahul`, pace 1.15**, and that is what I recorded —
22 files. The 88 older files are **speaker `ashutosh`, pace 0.9** (`incoming/voice/VOICE.md`). So Sanjaya
is currently two different men, and `VOICE.md`'s own rule is one voice for the whole game. Either accept
rahul as the voice and regenerate everything (`SARVAM_API_KEY=… python3 tools/voice-gen.py --speaker rahul
--pace 1.15`), or tell me to re-record these 22 with ashutosh at 0.9 — the four short lines would then need
checking against the Calm budget again. I did not regenerate the other 88 without approval.

Measured after recording: longest line in the game is now `dawn_1` (Hindi) at 4.36 s; four Hindi lines sit
between 4.2 and 4.4 s (`dawn_1`, `start_abhimanyu_1`, `lose_capture_1`, `astra_sammohana_enemy_1`), all with
text that was not in scope to shorten. Everything else is under 4 s; the median is 2.9 s.

Checks: `tests/languages.mjs` (the guard is still tested, now by injecting a pending id) · `tests/rules.mjs`
166 · self-play 40 · Daily · UI 212 · data 159 · audio 44 · log 18 · pace-budget (46 line/voice pairs, no routine line over budget) · the hi/mr layout harness, which passed Hindi at 390 and 360 and Marathi at 390 before hitting the known T-31 flake (`visible cell r1s0`) — nothing to do with this batch.
No native-speaker review; no human phone test; Batch 6.6 still open.

---

**15 November 2026 · Sarvam (third pass, PR #33).** The last of the Sarvam queue, and the paperwork that was owed.

## Sarvam, third pass — what changed

| Item | What changed | Where |
|---|---|---|
| The last long lines | Six more shortened and re-recorded: `defeat_1`, `sunset_near_1`, `dawn_1`, `dawn_enemy_1`, `start_abhimanyu_1`, `astra_sammohana_enemy_1`. **All 88 recordings are now under 4.0 s** — longest 3.97 s, median 2.95 s, was 6.14 s | `js/sanjaya.js`, `docs/voice/sanjaya-lines.csv`, `assets/audio/voice/` |
| Chapter IV drafts (T-32) | 28 draft recordings of the 14 Chapter IV lines, every one ≤ 3.24 s, sitting in `incoming/voice/chapter4/` **unwired** because the text is not approved. Two English lines were shortened to fit the budget | `incoming/voice/chapter4/`, `incoming/text/sanjaya-chapter4.csv` |
| The cultural read (Task 5) | Delivered at last: the whole game read against §6 of `docs/DIRECTOR.md`. Seven flags, the biggest being sacred symbols in Pata art and the twelve-spoked wheel reading as the Sudarshana Chakra; three suggestions that touch nothing sacred | `incoming/text/cultural-review.md` |
| Batch 6.6 support | A consistency pass over all 296 Marathi strings: three real findings (`कडे` doing double duty for "ring" and "towards", `मधे` vs `मध्ये`, `त्यांवर` vs `त्यावर`) and a list of what is already consistent, so the native reader starts with a shortlist. **Not a native review** | `incoming/text/marathi-consistency-pass.md` |
| Paperwork | The worklog had no entry for either batch (it is Sarvam's file to maintain); `docs/PACING.md` still said the four routine lines needed re-voicing | `docs/WORKLOG.md`, `docs/PACING.md` |

Checks: languages · rules 166 · self-play 40 · Daily · UI 212 · data 159 · assets 88 narration files · audio 44 · log 18 · `pace-budget --strict` (38 of 46 pairs within 5.0 s; the rest are major moments).

Still owed, and not claimed: **Batch 6.6** — a named native Marathi speaker reads the 296 strings. T-32 now sits with the Director: approve the Chapter IV text and the recordings are ready to move.

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
