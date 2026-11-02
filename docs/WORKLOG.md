# VYUHA — worklog

What has been done, by area, newest first. Maintained by Sarvam AI (agent). If it is not in
this file and not ticked in `docs/prompts/ART.md`, it did not happen.

---

## 1 Nov 2026 — ChatGPT review proposals (not merged)

- PR #4: first-use Astra film and reduced-motion fixes; 125 UI assertions,
  eleven real-file media scenarios, refreshed 20-second recording. Full Calm
  clash sequence measures 6.67 s, above the brief's 4–5 s estimate; physical-phone
  review remains required. No claim that these changes are live.
- PR #3: sky/share fix refreshed against Director main, preserving later work.
- `chatgpt/audio-pack-20261101`: six supplied audio files recovered and processed;
  originals preserved. Night/Daily/lesson/Abhimanyu themes and short victory cue
  wired, trap precached and its melee trigger corrected. Music Off/redraw,
  recorded mute/zero volume and fanfare cleanup fixed. Detailed handoff:
  `docs/HANDOFF-2026-11-01-audio.md`.
- Walkthrough, four square portrait deliveries, landscape design, Daily retuning,
  localisation integration and approved voice re-recording remain pending.
## 31 Oct 2026 (Sarvam AI) — Hindi review batch 2, and the interface in Hindi and Marathi

- **Hindi review, batch 2** — the remaining 30 of Sanjaya's 44 lines checked for naturalness,
  grammar, matras, verb agreement and meaning. Seven fixes (टकरा के → टकराकर; दिव्य-दृष्टि →
  दिव्यदृष्टि; छुपता → छिपता; "exposed" as खुल गया not दिख गया; ढाल टूट गई → चटक गई; the
  entranced-pass line rewritten; मैदान बराबर → बराबरी का रहा), 22 unchanged, one held back
  because the Commander has not yet ruled on it. Longest line 12 words.
  → `incoming/text/sanjaya-review-2.csv`
- **Interface strings, Hindi and Marathi** — all 149 keys, same keys and same order as
  `strings.en.json`, numbers and `×2` / `+1` untouched, game terms in Devanagari spelled one way.
  → `incoming/i18n/strings.hi.json`, `incoming/i18n/strings.mr.json`
- **Not done:** the four re-recordings (no TTS available in this session) and the two flat lines
  (still waiting on the Commander). **No audio was generated or replaced.**
- **Not wired in.** The three files are drafts in `incoming/`; the Director applies them and the
  language switch still has to be built. The Marathi has not been read by a native speaker.
- Full detail, the glossary used and the open questions: `docs/HANDOFF-2026-10-31-sarvam.md`.

## 30 Oct 2026 (evening, Director) — a cool phone, a calm home, the profile hub

- **Heat:** idle main-thread time 20–42% → under 1% on every screen. Every infinite CSS loop on
  a resting screen removed or capped at 2–3 plays. Battery saver setting (auto on low-memory
  phones). Music and the audio engine pause in the background. Probe: `tools/perf-idle.mjs`.
- **Glitches:** cinematics fell behind the board (`.stage { position: relative }`) — fixed; the
  no-moves ending reworded; the tall Sanjaya portrait clipped to its avatar circle.
- **Robot player:** `tools/playtest-bot.mjs` — taps through real battles on two phone sizes.
- **Home:** record, quick settings and data blocks gone; backups and reset in Settings.
- **Profile hub:** name, record, level of play per opponent, ten avatars, frame/tint/badge,
  own photo kept on the device.
- **Daily catalogue II** from 1 Nov: 21 variants, `open` retired, past dates unchanged.
- **Sanjaya:** review batch 1 applied (one fix corrected); voice script regenerated.
- **Repo:** loose originals moved from the root and `incoming/` to `masters/`.
- Details and the two Sanjaya rewrites awaiting approval: `docs/HANDOFF-2026-10-30-director.md`.

## 30 Oct 2026 — art, voice, and the loading fix

### Fixed
- **The game stuck on its loading screen.** The service worker served JS and CSS cache-first,
  so after a deploy the browser ran fresh HTML against old scripts and boot threw. Now:
  network-first for `.js/.css/.json/.webmanifest` and directory requests, cache-first only for
  images and audio; cache bumped to `vyuha-v14`; a 6-second watchdog and a global error hook
  hide the loading mark so it can never hang again.
- **The board flashing empty mid-battle.** Every image that finished loading triggered a full
  re-render — on a phone that meant the board being rebuilt a dozen times while the player was
  tapping. Art loads are now coalesced to one render per frame and filtered to what the screen
  actually draws; `render()` is re-entrancy guarded and released in a `finally`.
- **Astra shelf colliding with the command row** on narrow screens — it takes its own row now.

### Added
- **88 voice lines** for Sanjaya — 44 Hindi, 44 English — Bulbul v3, speaker `ashutosh`, pace
  0.9, 64 kbps mono. 2.6 MB. Generator at `tools/voice-gen.py` (key read from the environment,
  never stored).
- **Sanjaya's portrait** — still (30 KB) replaces the vector mark on the narration strip; the
  30-frame loop is staged at `portraits/sanjaya-anim.webp`.
- **The four astras move** — each split into a 4–6 KB still (shelf, badges) and a 640 px loop
  (646 KB–1 MB) played only when that astra fires, behind the Devanagari name and verdict.
- **Gate breach** — painted doors wired into the breach beat, same treatment as the astras.
- **Five hero portraits** (Arjuna, Karna, Bhima, Ghatotkacha, Abhimanyu), 512², staged in
  `opt/heroes/` with a `hero:` path registered — waiting for the Phase C hero cards.
- **Campaign map** and **temple hall** staged in `opt/ui/`.
- **New app icon** — brass chakra on indigo, live via the manifest.
- **Day/night skies**, **Padma board surface**, **daily card** backdrop, **arena courtyard**.
- **Sound pack III** — shankh, gate breach, dawn, dusk, four astra stingers, divya-drishti,
  shakti diya.
- **"Codex" renamed to "Rules"** throughout.

### Housekeeping
- **Repo 144 MB → 63 MB.** The 31 art masters were 2048 px PNGs (133 MB); they are archived in
  `masters/` at 1024–1280 px (28 MB) and the oversized originals were removed from
  `assets/art`, which now holds only what the game loads.
- `docs/prompts/ART.md` and `AUDIO.md` carry a STATUS section: delivered items ticked with
  paths, outstanding items with prompt, size and owner.
- `incoming/text/sanjaya-review.csv` — first review batch of the Hindi voice lines.


---

## 30 Oct 2026 (later) — audio measured, trimmed, re-voiced; the board stops vanishing

### Audio audit — measured every file, not trusted
Nine effects were outside their target length. Measured, then cut with a 120 ms fade:

| file | was | now | target |
|---|---|---|---|
| shakti_diya | 11.34 s | **0.70 s** | 0.4–0.7 |
| gate_breach | 8.18 s | **1.40 s** | 1.0–1.4 |
| astra_agneya | 5.59 s | **1.60 s** | 0.8–1.6 |
| astra_brahma | 4.66 s | **2.00 s** | 1.0–2.0 |
| shankh | 4.60 s | **2.00 s** | 1.2–2.0 |
| dusk | 4.01 s | **2.00 s** | 1.0–2.0 |
| astra_sammohana | 3.12 s | **1.60 s** | 0.8–1.6 |
| divya_drishti | 1.97 s | **1.20 s** | 0.6–1.2 |
| piece_place | 1.34 s | **0.60 s** | 0.2–0.6 |

All 14 effects now sit inside their range. (ChatGPT's report said eight; I measured nine.)

### Sanjaya re-voiced
The first take was lethargic — 44 lines with a median of 3.63 s and 13 over four seconds.
Re-recorded with speaker **rahul** at **pace 1.15** (was `ashutosh` at 0.9): median **3.00 s**,
max 5.09 s, 88 lines, 0 failures. Swapping again is one command:
`tools/voice-gen.py --lang both --speaker <name> --pace <n>`.

### The board no longer disappears when you strike
The stage that carries a clash, an astra or a breach was a near-opaque full-screen scrim
(0.45–0.78 alpha) with a card up to 520 px — on a phone that hid the wheel entirely. Now the
scrim is 0.10–0.42 with a 1.5 px blur, the card is 440 px, and every beat is capped at
**1.5 s** instead of 2–2.6 s. You can still see the field behind the verdict.

---

## 29 Oct 2026 — the Padmavyuha hex field (phase 1)

- `js/geometry.js`: `padmaBoard()` — 37 cells on an axial hex lattice (eye + rings of 6/12/18),
  six rays per cell, six petals, 15-cell deployment zones, forts on the outer ring, rotation
  order for rings 1–2.
- `js/engine.js`: rotation generalised to any geometry with a `rotationOrder`; homes always come
  from geometry; the facing rule written (a rear strike ignores rank) but left off until its ray
  plumbing is finished.
- `js/units.js`: `padma` registered as a board and added to the duel scenario's list.
- Self-play on the hex terminates cleanly, median ~51 orders.

**Known gaps, deliberately left:** deployment presets still use the square slot logic, so the
hex places 9–11 of 12 pieces; facing is inert (`config.facing = false`); no hex-specific AI
tuning.

---

## 28 Oct 2026 — name, voice, understanding, and the board as hero

- **Renamed to VYUHA (व्यूह)** with Devanagari under the Latin wordmark, subtitle "the seven
  formations"; title, manifest, description and in-app copy updated.
- **"Learn in one screen"** — six cards, each with its Devanagari term and one plain sentence
  (Deploy, Move, Strike, Powers, The turn / The clock, Win), adaptive to the board in play.
- **Every class in the Rules sheet opens with a one-line summary** before the detail.
- **The board became the hero** — intel and log became drawers at every width, the board sits in
  a brass frame with corner bosses, the turn indicator is a chamfered nameplate, a tip plate
  rotates advice every 14 s, and a legend opens each match with three lines of story.

## Earlier — the foundation

- Rebuilt the prototype as a modular app: DOM-free rules engine, cell-graph geometry, three AI
  tiers with a belief model, Web Audio score and effects, local profiles with hashed PINs,
  save slots, PWA/offline, SVG art, accessibility modes.
- The Chakravyuha wheel: 37 cells, rotation every fifth round, hub exposure, arcs one cell and
  spokes as lanes.
- Fixed: attacks were impossible to execute by tapping (a regression of mine); the wheel's rim
  was a motorway (8 sectors → 12); the large arena drew too often.

---

## Pending — my queue

| # | Task | State |
|---|---|---|
| 1 | Sanjaya's 44 Hindi lines — full review | **done** — batch 1 (14 lines) and batch 2 (the other 30, in `incoming/text/sanjaya-review-2.csv`) |
| 2 | 149 interface strings → Hindi and Marathi | **drafts delivered** in `incoming/i18n/`; needs the Director's language switch, and a native Marathi reader |
| 3 | Sanjaya's lines → Marathi | waiting on the Commander's ruling on the two flat lines |
| 4 | Bulbul voice re-record after review | one command: `tools/voice-gen.py --ids <id>` — no TTS available in my sessions |
| 5 | Cultural read of the whole design | not started |

## Pending — not mine

- Hex deployment (full 12 pieces), facing wiring, hex AI tuning.
- Hero cards, campaign map screen, Dvandva, Pratigya (Phase C — the art is staged and waiting).
- Store screenshots and the 30 s trailer (record from the game).
## 1 Nov 2026 (ChatGPT) — localisation integration proposal
- Wired the unchanged 149-key Hindi/Marathi catalogues into a persisted UI
  language selector, independent of narrator language; generated bundle works
  offline and in the standalone. Applied reviewed Sanjaya text and suppressed
  superseded recordings pending 16 Hindi and two English replacements.
- Rules 119, UI 94, 40 self-play games, Daily and language suites passed. Both
  languages passed touch/overflow/reload/offline checks at two phone sizes;
  idle maximum 0.8%; Marathi robot completed eight battles with `no problems`.
- Draft integration proposal only. Existing English fallback copy, native
  Marathi review and replacement recordings remain. No Calm timing changes.
- See `docs/HANDOFF-2026-11-01-localisation.md` and saved evidence.
## 1 Nov 2026 (ChatGPT) — landscape design proposal
- Batch 3.3 delivered at `incoming/text/landscape.md` with a dimensioned SVG
  sketch. Three columns keep the board at full height, status/player strips
  left and actions/narration right; rotation hint is optional and shown once.
- Budgets checked at 844×390 and 640×360; SVG parsed and rendered for visual
  review. No runtime files changed. Implementation, regression and physical
  Android checks remain with the later code work.
- Portrait delivery is PR #7, localisation integration PR #9. This separate
  design proposal preserves Claude's ownership of Calm pacing in PR #8.
- See `docs/HANDOFF-2026-11-01-landscape.md`.
| 1 | Sanjaya's 44 Hindi lines — full review | **batch 1 done** (14 highest-frequency lines in `incoming/text/sanjaya-review.csv`); 30 remain |
| 2 | 115 interface strings → Hindi and Marathi | not started — blocks the language switch |
| 3 | Sanjaya's lines → Marathi | waiting on 1 |
| 4 | Bulbul voice re-record after review | one command: `tools/voice-gen.py --ids <id>` |

## 1 Nov 2026 (night) — Director: Chapter III complete

- Integrated ChatGPT 3.4 (Daily retune, PR #11). Ran the second fresh bank (`0xc4e7d3`, 120 games/board): 7 of 8 retunes pass on both boards → **Catalogue III from 3 Nov** (28 variants); `quiet-gate` held (58.3 % lotus). Past Dailies unchanged.
- Narrator: a stop now frees the floor immediately, so a line said right after it starts at once.
- Repo clean-up: superseded handoffs/plans/evidence and integrated drafts removed (in git history); `docs/balance/`, `docs/i18n/` hold the live sources; single living `docs/HANDOFF.md`; harness outputs to `/tmp`.
- PR #8 merged to `main` (all agent work through #11); stale branches deleted.

## 2 Nov 2026 — Director: Chapter IV, first slice

- **Pratigya** built (`js/pratigya.js`): 12 vows from `incoming/text/heroes-vows.json` (wording tightened to what the engine can judge), offered three at a time at lock-in of an AI duel once the player has a win; HUD seal (static), result line, profile stars/titles/stamps, Settings toggle. Closing the offer by any route starts the battle with no vow.
- Engine **chronicle** per side (Senapati strikes, gate broken, scans, dismantles, Rath runs, captures by hour, Makara captures, Padma holds, fort taken); old saves get an empty one.
- **Hero engine** for Bhima, Karna, Ghatotkacha, Dhrishtadyumna behind `config.heroes`; not in any UI. First screen (`tools/hero-sim.mjs`, 200 games, wheel/veteran): Karna (9) 60.5 %, others in noise.
- Robot player now takes the offered vow (it was stuck behind the offer from battle 2 on).
- Briefs: ChatGPT Batch 5 (hero screening, AI hero awareness, hero-card design), Sarvam Batch 5 (vow strings, Chapter IV lines, respect read), Commander art (vow stamps).
