# Marathi catalogue — a consistency pass, and what is left for a native reader

**Sarvam AI · 15 November 2026 · support for Batch 6.6**

Batch 6.6 asks for a native Marathi speaker to read `docs/i18n/strings.mr.json`. **I am not that reader and
I am not claiming that review.** What I can do is the mechanical half: check the catalogue against itself,
find the places where it contradicts itself, and leave the native reader a short list instead of 296 strings
to read cold. Every item below is a proposal, not a correction made in the file.

Covered: the 251 keys in `docs/i18n/strings.mr.json` plus the 45 vow strings in
`incoming/i18n/pratigya.mr.json` — 296 strings.

---

## What is already consistent (so the reader can skip it)

| Check | Result |
|---|---|
| Keys and order against English | identical, 251 / 251 |
| Latin letters left in the Marathi text | none |
| Devanagari digits mixed with Latin digits | none — all numbers are Latin, as the English source |
| Dandas | none; Marathi uses the full stop throughout (120 strings end in one) |
| Double spaces | none |
| Register | `तुम्ही` throughout, with `करा`-type imperatives; no mixing with `आपण` or the familiar `तू` |
| The eyelash ऱ | correct everywhere: `मोहऱ्यापासून`, `मोहऱ्याने`, `मोहऱ्याला` (12 strings). The plain `मोहर्या` never appears |
| Singular / plural of मोहरा | `मोहरा` singular, `मोहरे` plural — correct |
| आहे / आहेत | agreeing with the subject in every case I read |
| Game terms | शतघ्नी, दिव्यदृष्टी, अग्न्यस्त्र, ब्रह्मास्त्र, संमोहनास्त्र, वायव्यास्त्र, चक्रव्यूह, पद्मव्यूह, मकर, पद्म, शक्ती, महारथी, सेनापती, दुर्ग — spelled the same way every time |

## Three things that are actually wrong, or close to it

### 1. `कडे` is doing two jobs, and one of them is ambiguous — the biggest item

`कडे` is used for the **rings** of the wheel (13 strings) *and* as the postposition "towards" in the same
catalogue (`बचावाकडे`, `तुमच्याकडे`, `रक्षकांकडे`). In `board.wheel.blurb` — "चक्र · कडे दर 5 डावांनी
फिरतात" — a Marathi player can read "कडे" as "towards" and stall for a beat.

*Proposal:* use **घेर** for a ring, reserving `कडे` for "towards". So "आतील घेर", "दोन घेर एका घराने
फिरतात". It is one word, changed in 13 strings, and it removes the ambiguity. The Hindi catalogue uses
`घेरे`, so the two languages would also match.

### 2. `मधे` once, `मध्ये` once

`unit.6.desc` has "मधे जे असेल", `challenge.slower` has "मध्ये". Standard written Marathi is **मध्ये**.

*Proposal:* change the one occurrence in `unit.6.desc` to `मध्ये`.

### 3. `त्यांवर` once, `त्यावर` five times

`wheel.wheel.predict.text` has "त्यांवर उभे असलेले"; the rest of the catalogue uses `त्यावर`. `त्यांवर` is
not standard.

*Proposal:* change that one occurrence to `त्यावर`.

## Smaller things a native reader should decide

- **`साफ` vs `स्वच्छ`** — `साफ` appears three times (`unit.3.one`, `unit.3.tip`, `lesson.trap.text`), and I
  introduced `स्वच्छ` once in `vow.clear-eyes.name`. Both are current Marathi; pick one. I would keep `साफ`
  in the lesson text (it is the warmer word) and use `स्वच्छ दृष्टी` only as the vow name.
- **`डाव` for a round** — correct and idiomatic for a game. No change.
- **`बळ` for Bala and `शक्ती` for Shakti** — good choices; they read as game resources, not as the Goddess.
  Worth a check that no future line capitalises them into personification.
- **`व्रत` vs `प्रतिज्ञा`** — the vow screen is `प्रतिज्ञा · व्रत` and the individual vows are `व्रत`. That
  is a deliberate pairing, not an inconsistency; a reader should just confirm it reads as one idea.
- **Two English drafts changed today** — `hero_dhrishtadyumna_gate_1` and `vow_broken_1` were shortened to
  fit 3.3 s in `incoming/text/sanjaya-chapter4.csv`. Those are Sanjaya's lines, not the interface, but a
  Marathi reader may want to see them before the Marathi voice set is ever recorded.

## How this was checked

Mechanical: key-by-key comparison with `strings.en.json`, then regex passes for Latin letters, Devanagari
digits, dandas, double spaces, and every variant pair above, over both Marathi files. Then a read of all 296
strings for the three findings. The script is not committed; it is three lines of Python against the two JSON
files if anyone wants to re-run it.

## What is still owed

Batch 6.6 itself: **a named person reads these 296 strings and says ok or corrects them.** When that happens,
name the reviewer in `docs/HANDOFF.md` and record their corrections in the same file, as the brief asks. If
the ring change in item 1 is accepted, the native reader should see the file after it, not before.
