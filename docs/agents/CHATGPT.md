# ChatGPT — agent brief

ChatGPT works for the VYUHA team on **images, writing and ideas**. The Commander (Pon) pastes a
task below into ChatGPT, saves what comes back with the exact file name, and puts it in the
repo's `incoming/` folder (or hands it to the Director in chat). The Director (Claude) checks
it, wires it into the game, and says plainly if something needs another pass.

**Before any task**, paste the context block once per conversation.

## ▶ Note — 3 Nov 2026: new look *Sanjaya's Pata*

The game is moving to a painted-cloth look (`docs/LOOK.md`). In task 5.3, do the hero card's
**placement and the turn flows** as text and wire-frames now, but **hold its visual styling and
any card art until the Commander picks the look at Gate 1**, so hero art is made once. Image
prompts for the new look are in `docs/prompts/PATA.md` (figures on transparent or flat magenta,
never black). All other tasks go ahead.

## ▶ Batch 5 — from the Director, 2 Nov 2026 (Chapter IV starts)

Chapter IV is on branch `claude/chapter-4-pratigya-heroes`. Read its `docs/HANDOFF.md` first.
**Pratigya vows** are built and playable; the **hero engine** is built for four passive heroes
(Bhima, Karna, Ghatotkacha, Dhrishtadyumna) but **not shown to players** until they pass
balance screening — that screening is yours. Batch 4 below is still owed; do 4.1 first (it is
quick), then Batch 5.

| # | Task | Deliver |
|---|---|---|
| 5.1 | **Screen the four heroes.** Run `node tools/hero-sim.mjs 400 <board> <opponent>` for wheel and padma × veteran and archon (first run, 200 games, wheel/veteran: Karna on the Maharathi **60.5 %**, all others inside noise; baseline 52.5 %). A hero ships at **50–58 %** on every board/opponent pair and must actually fire in real games. For each hero that misses, propose **one** change (e.g. Karna: only on defence, or only on the Senapati) and re-screen it. Seed your runs and write the seed in the report. Do not change rules in `js/engine.js`; propose, the Director decides. | `docs/balance/heroes-2026-11.md` |
| 5.2 | **Teach the AI the heroes.** Today `E.predict`/`strikeOdds` and `js/ai.js` ignore hero traits, so the AI misjudges a clash with a hero host. Design decision (Director, 2 Nov): **each army's hero and its host rank are public** (shown on the hero card); the host piece itself stays hidden until revealed. Pass the hero into `predict` options so ties (Bhima), night +1 (Ghatotkacha) and Karna's one survival are valued — only when the host is revealed or the reasoning uses public information. Add rules tests; `tests/rules.mjs`, `tests/selfplay.mjs 40` and the robot must still pass. | PR on a branch |
| 5.3 | **Design the hero card and the four active heroes.** (a) Hero card: where it sits in portrait and landscape (deploy screen pick, battle HUD, result), using the existing portraits in `assets/art/opt/heroes/`. (b) Turn flows for Arjuna (one volley at three cells), Drona (one reveal instead of a move), Abhimanyu (cannot step back; ignores Padma) and Bhishma (Padma aura while unmoved) — which button, which preview, what the board shows. Rules text is in `incoming/text/heroes-vows.json`. Keep the phone-cool rules (no looping animation). Text and wire-frame sketches only. | `incoming/text/hero-cards-design.md` |

## ▶ Batch 4 — from the Director, 1 Nov 2026 (do these first)

Your Batch 3 is integrated and live on `main` (PR #8): Calm pace (re-paced — see `docs/PACING.md`), sky and
share preview, the music pack, localisation, the four portraits (now live as 512 px WebPs), and
your landscape design, which is now **built** (CSS layer at the end of `css/app.css`, one-time
hint in `js/game.js`, acceptance harness `tools/landscape.mjs`).

| # | Task | Deliver |
|---|---|---|
| 4.1 | **Robot in landscape.** Extend `tools/playtest-bot.mjs` so it also plays four battles at 844 × 390 and 640 × 360 (all four fields), plus lesson and Daily, and still ends with `no problems`. Do not change game code to make it pass — report any failure instead. | PR on a branch |
| 4.3 | **Retune `quiet-gate`** (`docs/balance/daily-candidates.json`): it ran 58.3 % on the lotus in bank 4. One knob change, then screen in two fresh banks that miss banks 1–4 (`docs/balance/README.md`). | report in `docs/balance/` + note |
| 4.2 | **Design review of the built landscape** against `docs/LANDSCAPE.md`: run `node tools/landscape.mjs <dir>`, look at every screenshot, and list each difference from your design with a suggested fix (CSS selector + change). No code changes in this task. | `incoming/text/landscape-review.md` |

## Context block (paste first)

> You are helping build **VYUHA (व्यूह)**, a free mobile strategy game rooted in the Indian
> epics. Two armies of twelve hidden-rank pieces fight on battlefields shaped like war
> formations (the Chakravyuha wheel, the Padmavyuha lotus). The sky turns between the hour of
> Surya (day) and Chandra (night) every five rounds; formations (Makara pincer, Padma guard)
> give +1; and players spend Shakti on four astras — Vayavyastra (wind), Sammohanastra (trance),
> Agneyastra (fire), Brahmastra (light). Sanjaya narrates. The look is "temple-punk": carved
> brass and obsidian, saffron day, indigo night.
>
> Hard rules for everything you make: **no deity is ever shown as a piece, target or character**;
> astras are shown as their element only; warriors of the epic are human heroes drawn with
> dignity; no imitation of any living artist, comic, film or song; no text inside images unless
> asked. Indian audience first, written so a 16-year-old in Nagpur and a 60-year-old in Chennai
> both enjoy it.

---

## Task 1 — Art pack III (start here)

Open [`docs/prompts/ART.md`](../prompts/ART.md). Paste its **master style block**, then the
prompts one at a time, in the priority order listed there (astras → Sanjaya → Padmavyuha board →
daily card → skies → store art). Save each image with the exact file name from the table.

**Done when:** every Priority 1 file is in `incoming/art/` with the right name and size.

## Task 2 — 25 new Daily Chakravyuha modifiers

Paste:

> Write 25 new "modifiers of the day" for the Daily Chakravyuha. Each changes the day's puzzle
> using **only** these knobs: `startNight` (true/false), `startShakti` (raiders 0–5,
> defenders 0–5), `rotateEvery` (3–6 rounds), `turnLimit` (18–30 rounds), `gateOpen` (the
> defenders' fort gate starts broken: true/false), `defenders` (a list of 10 pieces chosen from
> 10, 9, 7, 6, 5, 3, 2, 1, B, F — must include exactly one F and at least one B),
> `raiders` (a list of 8 pieces from 9, 7, 6, 5, 3, 2, 1 — no F, no B).
> Give each a short evocative name drawn from the epics or Indian seasons and festivals (no
> deities as characters), a Devanagari word, and one plain sentence a player understands.
> Return **only** JSON: an array of objects with keys `key`, `deva`, `name`, `one`, `knobs`.

Save as `incoming/text/daily-drafts.json`. The Director simulates each one and keeps those
the raiders win 30–55% of the time.

## Task 3 — Store listing and launch words

Paste:

> Write the Google Play listing for VYUHA: (a) a title of at most 30 characters, (b) a short
> description of at most 80 characters, (c) a full description of 600–900 words with short
> paragraphs and a bulleted feature list, (d) 20 search keywords. Then write the same short and
> full description in natural Hinglish. Then write five Instagram Reels / YouTube Shorts
> captions (under 120 characters each) built around the hook "Abhimanyu got in. Can you get
> out?" and the Daily Chakravyuha. No exaggerated claims, no "best game ever".

Save as `incoming/text/store-listing.md`.

## Task 4 — The seven vyuhas (campaign lore, Phase C)

Paste:

> Write the campaign chapters for VYUHA: seven battle formations from the epic — Chakravyuha
> (wheel), Padmavyuha (lotus), Kraunchavyuha (crane), Makaravyuha (crocodile), Suchivyuha
> (needle), Shyenavyuha (hawk), Sarvatobhadra (auspicious on all sides). For each give: the
> name in Devanagari, a 90–120 word chapter intro told by Sanjaya to "Maharaj" (calm,
> storyteller, not purple), the one lesson the chapter teaches in a single sentence, and a
> 12-word line for the chapter's victory screen. Stay faithful to the epic where a formation is
> described there and say "a later tradition" where it is not. No deity fights or is captured.
> Return Markdown with one `##` heading per vyuha.

Save as `incoming/text/campaign.md`.

## Task 5 — Hero cards and vows (Phase C)

Paste:

> Design hero cards for VYUHA. A player's Senapati or Maharathi may take one hero's trait for a
> battle. Heroes are human warriors of the Mahabharata only: Arjuna, Karna, Bhima, Abhimanyu,
> Ghatotkacha, Drona, Bhishma, Draupadi's brother Dhrishtadyumna. For each: one rule in under 20
> words that fits a hidden-rank game (e.g. "Arjuna: his volley reaches three cells"), a
> one-line flavour quote written fresh (not a scripture quote), and a balance note. Then write
> 12 "Pratigya" secret vows a player can take before battle (e.g. "Bhishma's vow: win without
> your Senapati ever striking"), each with a reward suggestion.
> Return JSON with keys `heroes` (array of {name, deva, rule, quote, balance}) and `vows`
> (array of {name, deva, condition, reward}).

Save as `incoming/text/heroes-vows.json`.

## Task 6 — A playtest you can run with someone (any time)

Paste:

> I am going to watch a friend play a mobile strategy game for the first time. Give me a
> one-page playtest script: what to say before they start (and what not to say), 8 things to
> watch for silently, 6 questions to ask after (non-leading), and a simple table to write
> notes in. Keep it friendly; the friend is not a gamer.

Use it, then paste your notes into `docs/ROADMAP.md` under *Playtest notes* (or send them to
the Director).

---

## Quality bar the Director will check

- File names and sizes exactly as asked; JSON that parses.
- Images: no letters or numbers; reads at phone size; the same style across a set.
- Writing: short sentences, no invented scripture quotes presented as real, the respect rules
  above, Devanagari spelled correctly (Sarvam AI double-checks).
