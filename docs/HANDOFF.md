# Handoff — latest status

**7 November 2026 (late) · Director.** Replace this file at the end of each session.

## State

PR #23 (night fields, sideways squares, registers) is merged and live. Branch
**`claude/battle-log-audio-priority`** (PR open) finishes **T-04, review plan step 4**. Rules, AI,
Daily and balance unchanged: the engine only records more detail in its log.

| Item | What changed | Where |
|---|---|---|
| Battle log from your side | Each action: **You** / **Enemy** chip, cells by name, then the piece (yours always; an enemy piece only if it could be seen when it moved, else "hidden piece") or the clash/astra sentence. Tap an entry → its cells get a still saffron ring for 2.4 s; on phones (≤ 1080 px) the drawer closes first. Pass-and-play: log blank during the handover. Old saves fall back to the stored English text | `logLine`, `renderLog`, `markCells` in `js/game.js`; CSS at the end of `css/app.css` |
| Cell names | `G.cellName(board, id)`: squares = printed coordinates (A1 top-left; same names when turned sideways); wheel and lotus = ring + clock position on screen to the half hour (`outer 5:30`, `middle 12:00`, `hub` / `centre`). Unique on all four fields. Also lead each cell's aria-label | `js/geometry.js` |
| Engine log data | `E.log(state, kind, text, at, extra)`; entries now carry `who`, `from`, `piece`, `seen` (visible after the move), `foe`, `outcome`, `astra`. `text` unchanged | `js/engine.js` |
| Audio priority | Explicit `PRIORITY` table + `SJ.rank` (stable). Tiers: 9 fort · 8 result · 7 breach · 6 astra · 5 clock warnings · 4 captures/formations · 3 traps · 2 sky/rings · 1 routine. **Fixed:** `rotate_padma` was 4 by a regex accident (now 2); victory/defeat/draw were 1 (now 8 — the result beats the final capture; a taken fort still leads); last-rounds/sunset warnings and Shakti-full were 1 *and* marked said before a line was chosen, so a capture that turn silenced them for the battle (warnings now 5, all said only when spoken, warnings fire anywhere in the last 4 / 3 rounds); Quick kept the 3 oldest queued lines and dropped new ones (now the 3 most important) | `js/sanjaya.js`, `speak`/`narrate`/`performCalm` in `js/game.js` |
| Strings | 9 new `log.*` keys, English only for now, added to `docs/i18n/pending-first-session.en.json` (T-06). The clash/astra sentences in the log are still English engine prose (T-17) | |
| Docs | `DESIGN.md` §4 (log) and §5 (which line speaks); AGENTS.md lists the three new checks | |

## Checks (7 Nov, this branch)

rules 166 · self-play 40, 0 failures · Daily · languages · UI 184 · data 159 · assets ·
**audio 44 (new)** · **log 18 (new)** · **battle-log ≈ 930 (new; every field at 914×411, 830×318,
390×844; three clean runs)** · desktop/phone screenshots · landscape 122 · first-session 32 ·
idle < 3 % (portrait and 844×390) · Calm budget unchanged (33/46) · robot "no problems" ·
audio-qa passed · standalone rebuilt · cache stays v34 (code revalidates on load).
`tools/media-qa.mjs` (not in the required list) fails at the astra-film gate — **on `main` too**:
in Pata the astra moment is a still, the harness expects the Classic film (T-14).

## Open

- **Not phone-tested; no real-person playtest.** T-16: are the names and the tap-to-mark useful?
- Wheel/lotus names are clock positions because those fields print no coordinates; if the
  Commander prefers printed spoke numbers on the rim, that is a design change to the painted field.
- T-02/T-03 phone checks from the last PR still wanted.

## Next

`TASKS.md`: T-15 merge · T-02/T-03/T-16 phone checks · T-05 playtests · Director next: **T-09**
(scenario cards and dark screens in Pata), T-14 (media-qa in both looks), T-17 (log prose keys).
