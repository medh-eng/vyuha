# Sarvam AI — agent brief

Sarvam AI works for the VYUHA team on **Indian languages and voice**: Hindi and Marathi text,
natural Hinglish, Sanjaya's spoken voice, and a cultural read of everything players see.
Sarvam's chat assistant handles the writing tasks; its text-to-speech tool (Bulbul) handles the
voice. The Commander (Pon) runs the tasks and drops results in `incoming/`; the Director
(Claude) wires them in.

## ▶ Batch 6 — from the Director, 7 Nov 2026 (one list, in this order)

Nothing new has arrived since Batch 3 — all of Batch 4 and 5 below is still owed. This list puts
it in order and adds the new interface strings. Put files at the exact paths; the Director wires
them in. Do not claim a native-speaker review or a recording that did not happen.

| # | Task | Deliver |
|---|---|---|
| 6.1 | **Hindi and Marathi for the 74 newer interface strings** in `docs/i18n/pending-first-session.en.json` (the wheel lessons, odds words, Confirm strike, the goal box, the battle log: `log.you` "You", `log.enemy` "Enemy", `log.hidden` "hidden piece", `log.ring1–3` inner/middle/outer, `log.hub`, `log.centre`). Same rules as `strings.hi.json`: keep every key and `{n}` placeholder; short enough for a phone button; game names stay as in the glossary. | `incoming/i18n/first-session.hi.json`, `incoming/i18n/first-session.mr.json` |
| 6.2 | **The four long lines** (was 4.2): shorten to ≤ 3.3 s, then record. Still over budget today: `volley_kill_1` (hi), `assassinate_1` (hi), `trap_defused_1` (en), `rotate_padma_1` (en). | `incoming/text/sanjaya-short-2026-11-01.csv` + voice files |
| 6.3 | **Record the 18 pending lines** (was 4.1). | `assets/audio/voice/<hi\|en>/<id>.mp3` (or `incoming/voice/…`) |
| 6.4 | **Vow strings** (was 5.1). | `incoming/i18n/pratigya.hi.json`, `incoming/i18n/pratigya.mr.json` |
| 6.5 | **Sanjaya's Chapter IV lines** (was 5.2) and the **respect read** of the hero texts (was 5.3). | `incoming/text/sanjaya-chapter4.csv`, `incoming/text/heroes-respect-read.md` |
| 6.6 | **A person reads `strings.mr.json`** (was 4.3) — only if a native Marathi speaker can. | corrections + reviewer named |

## ▶ Batch 5 — from the Director, 2 Nov 2026 (Chapter IV)

**Pratigya** (secret vows) is built. Its 45 interface strings are in English only; in Hindi and
Marathi they fall back to English until your translation lands. Batch 4 below is still owed —
4.1 and 4.2 first (they unblock the Calm budget), then Batch 5.

| # | Task | Deliver |
|---|---|---|
| 5.1 | **Translate the vow strings** in `incoming/text/pratigya-strings.en.json` into Hindi and Marathi. Same rules as the interface catalogues: keep every key, keep the Devanagari vow words (संयम, रक्षा, दृष्टि …) and the title names (व्रती, दृढ़व्रत, सत्यव्रत), keep ★ symbols, short enough for a phone card. `vow.secret` and `vow.newTitle` end with a space because a value follows. | `incoming/i18n/pratigya.hi.json`, `incoming/i18n/pratigya.mr.json` |
| 5.2 | **Sanjaya's lines for vows and heroes** — write, do not record yet. Ids: `vow_taken`, `vow_kept`, `vow_broken`, `hero_bhima_holds`, `hero_karna_armour`, `hero_ghatotkacha_night`, `hero_dhrishtadyumna_gate`. Two variants each (`_1`, `_2`), columns as in `docs/voice/sanjaya-lines.csv` (Hinglish screen, Hindi voice, English voice). Each must speak in **≤ 3.3 s** at pace 1.15. Heroes are spoken of with respect — as great warriors, never as jokes. The Director approves the text, then you record. | `incoming/text/sanjaya-chapter4.csv` |
| 5.3 | **Respect read of the hero texts.** Read the eight hero `quote` and `rule` lines in `incoming/text/heroes-vows.json` and the vow names. Flag anything that feels wrong for any Indian community or tradition, and give the natural Hindi for each hero quote. | `incoming/text/heroes-respect-read.md` |

## ▶ Batch 4 — from the Director, 1 Nov 2026 (do these first)

Batch 3.2–3.4 is merged: the Hindi review, both interface catalogues (now selectable in
Settings) and the two approved rewrites. Thank you — the glossary held throughout.

| # | Task | Deliver |
|---|---|---|
| 4.1 | **Record the 18 pending lines** listed in `docs/voice/pending-recordings.json` (16 Hindi, 2 English; their text changed in review). Speaker **rahul**, pace **1.15**. Until then they show as text only. | `assets/audio/voice/<hi\|en>/<id>.mp3` |
| 4.2 | **Four lines run too long for Calm.** Each must be **≤ 3.3 seconds**: `volley_kill_1` (Hindi, now 3.76 s), `assassinate_1` (Hindi, 3.47 s), `trap_defused_1` (English, 3.53 s), `rotate_padma_1` (English, 3.40 s). Shorten the wording first (keep the meaning, keep Sanjaya's voice), give the new text in all three columns, then record. Check: `node tools/pace-budget.mjs --strict` passes. | `incoming/text/sanjaya-short-2026-11-01.csv` + voice files |
| 4.3 | **A person reads `strings.mr.json`.** If a native Marathi speaker can review it, record their corrections in the same file and name the reviewer in the handoff. Do not claim a review that did not happen. | `docs/i18n/strings.mr.json` |

## Context block (paste first in the chat)

> You are the language and culture reviewer for **VYUHA (व्यूह)**, a free mobile strategy game
> rooted in the Mahabharata's war formations, made in Nagpur for Indian players. A narrator,
> Sanjaya, speaks to the player as "Maharaj". The game never shows a deity as a playing piece.
> Your job is to make every Hindi and Marathi line sound natural to a modern Indian player —
> clear, warm, a little epic, never stiff Sanskritised officialese and never slangy. Keep the
> game's Sanskrit terms (Senapati, Maharathi, Divyadrishti, Shataghni, Durg, Chakravyuha,
> Padmavyuha, Makara, Padma, Agneyastra, Sammohanastra, Vayavyastra, Brahmastra, Shakti) and
> spell them consistently in Devanagari.

---

## Task 1 — Review Sanjaya's Hindi (do this before recording)

Open `docs/voice/sanjaya-lines.csv`. Paste:

> Here are 44 short lines a narrator says in a game. For each row, check the Hindi
> (`hindi_voice_text`) for naturalness, grammar, matras and nukta, and that it means the same as
> the English. Keep each line under 14 words and easy to say aloud in 2–4 seconds. Return a CSV
> with columns `id`, `hindi_voice_text` (corrected or unchanged), `note` (what you changed and
> why, or "ok"). Then do the same for `hinglish_screen_text`, returning `id`,
> `hinglish_screen_text`, `note` — natural Hinglish as a young Indian would text it, Latin script.
> [paste the CSV]

Save as `incoming/text/sanjaya-review.csv`. The Director updates `js/sanjaya.js` and regenerates
the script, so the voice is recorded from the corrected words.

## Task 2 — Translate the interface (Hindi and Marathi)

Open `docs/i18n/strings.en.json` (115 strings: pieces, astras, hours, formations, the lesson,
the daily modifiers, buttons). Paste:

> Translate this game interface JSON into Hindi. Keep every key exactly as it is; translate only
> the values. Keep game terms in Devanagari as listed in the context. Keep numbers, "+1" and
> "×2" as they are. Short and clear: these appear on phone buttons and cards. Return only the
> JSON.
> [paste the file]

Save as `incoming/i18n/strings.hi.json` (the Director moves it to `docs/i18n/`). Then the same prompt with **Marathi** → save as
`incoming/i18n/strings.mr.json`.

The Director then adds a language switch (English / हिन्दी / मराठी) to the game — that wiring is
on the roadmap and starts as soon as the first translation lands.

## Task 3 — Sanjaya in Marathi

> Translate these 44 narrator lines into natural spoken Marathi for a Maharashtrian player. Keep
> "महाराज" as the form of address. Same rules as before: under 14 words, 2–4 seconds aloud.
> Return CSV `id`, `marathi_voice_text`.
> [paste the corrected Hindi CSV from Task 1]

Save as `incoming/text/sanjaya-marathi.csv`.

## Task 4 — Record Sanjaya's voice (Bulbul text-to-speech)

Follow [`docs/prompts/VOICE.md`](../prompts/VOICE.md): pick one calm, mature male voice, pace
about 0.9, Hindi (hi-IN), MP3; generate each line from the corrected Hindi text; save as
`incoming/voice/hi/<id>.mp3`. Start with the eight most-heard lines listed there. Write the
chosen speaker name in `incoming/voice/VOICE.md` so later batches match.

Then the English set (en-IN) into `incoming/voice/en/<id>.mp3`, and — once Task 3 is done —
Marathi (mr-IN) into `incoming/voice/mr/<id>.mp3`.

## Task 5 — Cultural read of the whole game

Paste the context block, then the contents of `docs/DIRECTOR.md` sections 1, 3 and 6, then:

> Read this game design as a thoughtful Indian player from any community. List anything that
> could feel disrespectful, inaccurate to the epic, or awkward in Hindi or Marathi — the
> exact phrase, why it might land badly, and a better alternative. Also list three things that
> would make it feel *more* authentically Indian without touching anything sacred.

Save as `incoming/text/cultural-review.md`. The Director brings every point to the Commander
before changing anything.

---

## Quality bar the Director will check

- Keys and ids untouched; files parse (JSON / CSV, UTF-8).
- Devanagari spelled consistently with the terms above.
- Voice: one speaker throughout, no clipped endings, each line under 4 seconds.
