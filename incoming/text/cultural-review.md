# A cultural read of VYUHA

**Sarvam AI · 15 November 2026 · `docs/agents/SARVAM.md` Task 5** (the cultural review of the whole game — never delivered until now)

Read: `docs/DIRECTOR.md` §1 (the game in one breath), §3 (the rules) and §6 (the respect charter), the
narrator's 44 lines in `docs/voice/sanjaya-lines.csv`, the three opponents in `js/ai.js`, the four fields,
the twelve vows, and the eight heroes.

**Honesty first.** This is one Indian reader's pass — mine. It is not a review by a scholar, a priest, or
a named community elder, and I have not seen the paintings. Where I say a thing *may* land badly, I mean
exactly that. Nothing here is a demand; every item is a proposal for the Director and the Commander.

---

## What the charter gets right, and I checked

The respect charter in §6 is unusually careful, and the code holds to it:

- **No deity is a piece, a target or a capture.** I searched the whole runtime: no deity name appears in
  any piece, astra, field, opponent or achievement. The only "deva" in the codebase is the Devanagari font
  variable in `css/app.css`.
- **The eight heroes are all epic warriors**, never gods — including Arjuna and Karna, whose fathers are
  deities. That line is held correctly and should not drift.
- **Astras are elements, not gods** — wind, trance, fire, light — exactly as §6.1 asks.
- **No caste word appears anywhere** in the pieces, the vows or the narrator's lines. The pieces are named
  by role (चर, रथ, यंत्रिक, धनुर्धर, दिव्यदृष्टि, महारथी, सेनापति, शतघ्नी, दुर्ग), which is the right call.
- **No real-money mechanic**, no power for sale. Cosmetics only, as promised.

## Where it could land wrong

### 1. Dronacharya is both a guru and a beatable opponent

He is the middle opponent in `js/ai.js` and also a hero piece. For many families — brahmin households
especially — a guru is not a figure you defeat on a board, and the epic itself is uneasy about his death.
His trait (revealing instead of moving) is the respectful reading; keep it.

*Alternative:* in help text and the ladder, call him **आचार्य** / **Dronacharya**, never a target to be
taken; and no achievement should read "defeated Dronacharya". This is the single item worth an outside
opinion before release. It is also the top flag in `incoming/text/heroes-respect-read.md`.

### 2. Shakuni is the hardest opponent, and he is a villain from a named region

Using the epic's great schemer as the strongest AI is apt and I would keep it. Two cautions: his cunning
must never be tied to a people or a place — in the epic he is from Gandhara, which is in present-day
Pakistan and Afghanistan, and a game made for Indian players should not let a villain's traits attach to a
region or a community. And no art should make his dice into a gambling motif that reads as a betting game
(the Daily share card must never look like a lottery slip).

*Alternative:* keep him as the master of the vyūha and the dice, and let his help text say what he is good
at — reading your habits — rather than "he cheats".

### 3. The turning wheel is the game's invention, and Sanjaya should not claim it as the epic's

The Chakravyuha and Padmavyuha here rotate every fifth round and expose what they carry. That is a good
mechanic and a legitimate liberty — but in the epic the formations do not turn. The narrator speaks in the
epic's voice, so a line like "the lotus turns, Maharaj" is fine as *your* battlefield report, while a line
that says the *Chakravyuha of the Mahabharata* turned would be a factual error a knowledgeable player would
catch. Today the lines stay on the right side of that. Keep the explanation of rotation in the rules and
lesson text, never in a line that sounds like scripture.

### 4. A twelve-spoked turning wheel can read as the Sudarshana Chakra

A wheel, twelve spokes, turning, divine weapons in play — an Indian player may see Vishnu's Sudarshana
Chakra in it. That is not a problem in itself, but it becomes one the moment the game *names* it so, or puts
a deity's face or an auspicious mark at the hub.

*Alternative:* never use the word Sudarshana anywhere; keep the hub as the fort (which it already is), and
keep the spokes as plain geometry.

### 5. Sacred symbols in the Pata paintings

Pata painting, the look the game now defaults to, often carries the swastika, the om, the mangal kalash or a
row of deities along the border. Those are auspicious marks, not decoration. If one appears on a piece, a
capture marker, a trap, the fort, or a "target" highlight, it will read as a sacred symbol being destroyed —
the worst possible accident for this game.

*Alternative:* brief the artist explicitly — sacred symbols stay out of the board, the pieces, the markers and
the UI chrome; they may appear only in a scene painting where they are being honoured, never touched.

### 6. Brahmastra must not look like a bomb

It is the most sacred weapon in the epic, invoked once and never again. A mushroom cloud, a blast radius icon
or a "nuke" joke would be flippant about something people revere.

*Alternative:* light, a hush, everything on the field going still — the game already leans this way; make sure
the achievement text and any future art follow.

### 7. Small wording items

- **Bhishma's restraint** as a vow name is a loose echo of the Bhishma pratigya (which was about the throne
  and celibacy, not about refusing to fight). It reads well; a tooltip saying the vow is named after his
  self-control settles it.
- **यंत्रिक** as a *vow* name reads like a person rather than a quality — यंत्र-सूझ is better for the vow,
  यंत्रिक stays right for the piece. In the paintings, make the Yantrik an artisan-scholar (शिल्पी), not a
  labourer.
- **Abhimanyu** is a boy killed unfairly. The escape mode's "Abhimanyu got in. Can you get out?" is the
  respectful framing because it makes the player feel the trap. Never phrase an objective as killing him.
- **"Maharaj"** as the form of address is authentic — it is how Sanjaya speaks to the blind king — and it
  flatters the player without touching anything religious. Keep it, in both Hindi and Marathi.

## Three things that would feel more Indian without touching anything sacred

1. **A dhvaja for each army.** A banner beside each side's name, in Devanagari, changing with the field —
   the epic's armies fought under standards, and it costs nothing but a strip of cloth in the art.
2. **The result as a dispatch.** Sanjaya's job in the epic was to report the war to a blind king. A result
   card written as his dispatch — field, season, rounds, what was lost — would feel more authentic than a
   scoreboard, and it is only words.
3. **Credit the Pata painters.** One line in About or Credits naming the folk tradition the look comes from.
   Indian players notice when a folk form is used well and credited; they notice more when it is not.

## What I could not check

- No community consultation, no scholar, no priest. The Drona and Shakuni points in particular deserve a
  real conversation, not my judgement.
- I have not seen the Pata paintings or the hero cards, so points 4, 5 and 6 are about naming and briefing,
  not about what is on the canvas today.
- No native Marathi reader has seen this or the catalogue (see `incoming/text/marathi-consistency-pass.md`).
