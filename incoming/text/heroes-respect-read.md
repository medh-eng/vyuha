# Heroes and vows — a respect read

**Sarvam AI · 15 November 2026 · Batch 6.5 (was 5.3)**

Read: the eight hero `quote` and `rule` lines and the twelve vow names in `incoming/text/heroes-vows.json`.
This is a language and culture pass by Sarvam's writing assistant. It is **not** a review by a
religious scholar, a priest, or a named community elder — for the Drona point below, someone like
that should be asked before release.

Nothing here is a demand. Every item is a proposal; the Director decides and the Commander signs off.

---

## What already reads well

- **No deity is a piece.** The eight heroes are all warriors of the epic — Arjuna, Karna, Bhima,
  Abhimanyu, Ghatotkacha, Drona, Bhishma, Dhrishtadyumna. That is the right line to hold, and it holds.
- **Karna is written with dignity.** "Let my armour buy one more chance to stand" honours the
  kavach-kundal without a word about his birth. For many communities Karna is the epic's argument
  against birth-based contempt, and the game never undercuts that. Keep it exactly as it is.
- **Bhima's line is in character** — plain, physical, generous: "Hold your ground; I will open the road."
- **Ghatotkacha's night strength is faithful.** In the epic he fights at night and grows; the trait
  is drawn from the source, not invented.
- **The vow names use ordinary, warm Hindi words** (संयम, रक्षा, दृष्टि, धैर्य, साथ) rather than
  Sanskritised officialese. That is the right register for a phone game.

---

## Flags, most important first

### 1. Drona as a piece is the one real risk

Dronacharya is a *guru* — the teacher of both the Pandavas and the Kauravas — and for many Indian
families, especially in brahmin households, a guru is not something you move around a board and
capture. The epic itself is uncomfortable about his death: he is killed while in despair, by
Dhrishtadyumna, and that killing is treated as a tragedy, not a triumph.

The design already avoids the worst version of this — Drona's trait ("reveals one adjacent hidden
enemy instead of moving") is a *teaching* trait, which is the respectful reading. Two suggestions:

- Keep the ladder opponent's name as **Dronacharya** and address him as **आचार्य** in help text, not
  as a piece to be taken. `Dronacharya` already appears in the measured-endings table; that is good.
- Do not let any Sanjaya line, art or achievement frame **Drona's capture as a victory over a guru**.
  If a hero card ever shows Drona being taken, it needs a line of respect, not a cheer.

If you want one external check before release, this is the item to spend it on.

### 2. Dhrishtadyumna and Drona must never be staged as the killing

Dhrishtadyumna exists in the epic for one act: he is born to kill Drona, and he does. In the game
both can stand on the same field, which is fine as a wargame, but:

- no art, line or achievement should put the two in a tableau together;
- Sanjaya's two lines for him (in `incoming/text/sanjaya-chapter4.csv`) speak only of the gate and
  the army — keep them that way.

### 3. Ghatotkacha must not be drawn as a monster

He is a rakshasa, and rakshasa art slides easily into horned, fanged caricature. In the epic he is a
beloved son, enormous and gentle until the war, and his death is mourned. The existing balance note
already says "Depict the epic warrior with dignity" — hold that in the paintings and in any Hindi
that describes him. Avoid the words राक्षस and दानव in player-facing text; "घटोत्कच" alone is enough.

### 4. Abhimanyu: a boy killed unfairly

His trait (ignoring the Padma defence, never stepping back) is faithful, and the escape mode's
headline — "Abhimanyu got in. Can you get out?" — is the respectful framing, because it makes the
player feel the trap rather than spring it on him. Two cautions: never phrase an objective as
"kill Abhimanyu", and in Hindi keep him as अभिमन्यु, not a diminutive.

### 5. "Bhishma's restraint" is a loose echo of the Bhishma pratigya

Bhishma's vow was about the throne and celibacy, not about refusing to fight — he fought, and
refused only against Shikhandi. Using संयम for "your Senapati never strikes" is defensible and reads
well, but if anyone asks, the vow is *named after his self-control*, not after his vow. A one-line
tooltip saying so would settle it.

### 6. Shakti and Bala are also names of the Goddess

Using शक्ति for the astra resource and बल for strength is fine and idiomatic, and the game says
"lamps of Shakti", never "the Goddess". Just keep it that way: no art, icon or line should
personify शक्ति as a woman, or बल as a deity.

### 7. Small wording notes

- **यंत्रिक as a vow name** reads like a person ("the engineer"), not a quality. Consider
  **यंत्र-सूझ** (Hindi) / **यंत्रचातुर्य** (Marathi) for the vow title, keeping यंत्रिक for the piece.
- **गुप्तचर / हेर** for the Scout stamp: both are neutral and clean. In Marathi, **हेर** is the
  everyday word and reads warmer than गुप्तचर.
- **"प्रहर"** for Dawn watch is right in Hindi; in Marathi **प्रहर** is understood but **पहाट** is
  warmer — "पहाटेची चौकी" is what I used in the Marathi catalogue.
- No hero text uses a caste word, and none should. Keep it that way — it is the single easiest way
  to keep the game safe for every community.

---

## The natural Hindi for each hero quote

Ready to use as-is; each fits a hero card.

| Hero | English | Hindi |
|---|---|---|
| Arjuna | A clear line is worth more than a hurried arrow. | साफ़ निशाना, जल्दबाज़ तीर से बेहतर। |
| Karna | Let my armour buy one more chance to stand. | मेरा कवच मुझे एक और बार टिकने का मौक़ा दे। |
| Bhima | Hold your ground; I will open the road. | तुम डटे रहो, रास्ता मैं खोलता हूँ। |
| Abhimanyu | Show me the opening, and keep the road behind me. | मुझे द्वार दिखाओ, और पीछे का रास्ता खुला रखो। |
| Ghatotkacha | The dark is quiet enough to hear your next step. | अंधेरा इतना शांत है कि तुम्हारा अगला क़दम सुन लूँ। |
| Drona | First learn what stands before you; then choose your answer. | पहले देखो सामने क्या खड़ा है, फिर उत्तर चुनो। |
| Bhishma | An army is held together by those who remember the whole field. | सेना उनसे बँधी रहती है, जिन्हें पूरा मैदान याद रहता है। |
| Dhrishtadyumna | The opening is ours; now bring the army through. | द्वार हमारा है; अब सेना आगे बढ़ाओ। |

## The twelve vow names in Hindi and Marathi

| English | Hindi | Marathi |
|---|---|---|
| Bhishma's restraint | भीष्म का संयम | भीष्माचे संयम |
| The guarded fort | सुरक्षित दुर्ग | रक्षित दुर्ग |
| Clear eyes | साफ़ दृष्टि | स्वच्छ दृष्टी |
| The patient engineer | धैर्यवान यंत्रिक | संयमी यंत्रिक |
| The open road | खुला मार्ग | मोकळा मार्ग |
| Dawn watch | भोर की चौकी | पहाटेची चौकी |
| Joined hands | जुड़े हाथ | जोडलेले हात |
| Petal guard | पंखुड़ी रक्षा | पाकळी रक्षण |
| A single flame | एक ही ज्योति | एकच ज्योत |
| Without fire | बिना अग्नि | अग्नीशिवाय |
| Companions return | साथी लौटे | सोबती परतले |
| Breach before sunset | सूर्यास्त से पहले प्रवेश | सूर्यास्तापूर्वी प्रवेश |

These are the same strings delivered in `incoming/i18n/pratigya.hi.json` and `pratigya.mr.json`
(Batch 6.4), so the card and the catalogue cannot drift.

---

## What I could not check

- No native speaker has read this document, the Hindi above, or the Marathi catalogue. Batch 6.6
  (a person reads `strings.mr.json`) is still open and I have not claimed it.
- I have not seen the hero paintings, so the art cautions in points 3 and 6 are about wording and
  staging only.
