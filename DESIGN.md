# VYUHA — design rules

The one place that says **how VYUHA should look, feel and behave**, so every session (Commander,
Director, ChatGPT, Sarvam) makes the same choices. It states rules; the long reasoning lives in
`docs/LOOK.md` (the Pata look), `docs/LANDSCAPE.md` (sideways play), `docs/PACING.md` (Calm timing)
and `docs/DIRECTOR.md` (rules, respect charter). If this file and the code disagree, the code
wins today and this file is fixed in the same pull request.

Facts that can be checked by a program (pieces, astras, fields, sounds, art) are in `data/`.
Colours and sizes below are the values in `css/app.css`.

## 1. The look: Sanjaya's Pata

A painted cloth that Sanjaya unrolls for the blind king. Pata is the default look; Classic bronze
stays in Settings and as the fallback.

| Token | Value | Use |
|---|---|---|
| ink (lamp-black) | `#1c1510` | text, outlines |
| cotton / cotton-2 | `#f2e4c4` / `#f8efd9` | day cloth, panels |
| indigo cloth | `#1f2a5c` | night cloth |
| vermilion | `#c8341c` | Suryavansh main, primary buttons, warnings |
| saffron | `#ee8f1c` | Suryavansh second, Sanjaya |
| lapis | `#2c58a8` | Chandravansh main |
| conch | `#f7f1e3` | Chandravansh second |
| malachite | `#2e8a62` | good / likely win |
| ochre / gold leaf | `#c68a2e` / `#d6a23c` | highlights, exposed ranks |

- Flat mineral colour, bold outline, gold only on highlights. No glossy metal, no photographic shadow.
- A piece must read at 32 px. Every piece sits on its own cotton disc.
- **Hidden means unpainted:** every hidden enemy is the same ink sketch; a reveal floods it with colour.
- Suryavansh: vermilion and saffron, scalloped rim. Chandravansh: lapis and conch, crescent notch.
- One tradition per field: Chakravyuha Phad · Padmavyuha Pattachitra · Sarvatobhadra Kalamkari ·
  Kurukshetra Pahari miniature. Day fields are cotton; night fields are true indigo.
- Type: display `Rozha One`; Devanagari `Tiro Devanagari Hindi`; body `Inter`. Hindi and Marathi
  strings may wrap to two lines; never shrink a control to fit them.
- **No deity** as a piece, target or capture. Astras are wind, trance, fire and light — invoked, never drawn as gods.

## 2. Fields

| Field | Shape | In portrait | Sideways phone (landscape, ≥ 700 px wide) |
|---|---|---|---|
| Chakravyuha | wheel, 37 cells, rings turn every 5 rounds | as is | as is |
| Padmavyuha | lotus, 37 cells, rings turn | as is | as is |
| Sarvatobhadra | 6 × 8 | upright, your army at the bottom | **turned a quarter: your army on the left**, cells ≈ 20–30 % larger |
| Kurukshetra | 8 × 10 | upright | turned the same way |

- Turning is view only (`turnBoard` in `js/game.js`): cell ids, rules and the AI never change. The
  painting turns with the cells; coordinates and tokens stay upright.
- Under 700 px wide the turned field is width-limited and gains nothing, so it stays upright.
- Wheel and lotus never turn. Own army is at the bottom (square, portrait, you play bottom to top) or on the left (square, sideways, you play left to right).

## 3. Layout

- **Portrait:** header, field, action bar, tip bar. Controls under the field.
- **Landscape phone** (`max-height: 520px`): three columns, placed by position from `--x2`, `--x3`,
  `--board-w`, never sized by rail content. Left rail: labelled buttons, round, hour, GOAL box with
  the chakra countdown, clock. Centre: the whole field, centred, aspect-correct. Right rail: Shakti
  lamps, four astras (2 × 2), selected piece, Move / Strike / Confirm / Cancel, Sanjaya's line.
- Touch targets **≥ 44 × 44 px**. Nothing scrolls the field. Check at 914 × 411 (full screen) and
  830 × 318 (with the address bar), and 844 × 390.
- Battles on phones open full screen and sideways; if the browser refuses, nothing else changes.

## 4. Reading the battle (first-session clarity)

- **Odds are words first:** Likely win (≥ 60 %), Uncertain (35–59 %), Likely loss (< 35 %), based
  on enemy ranks you can't see yet. **Certain** once the outcome has one possibility. The % is detail.
- **Striking is two deliberate steps:** pick the target, then **Confirm strike** (or Invoke an astra)
  or **Cancel**. Tapping the target again also confirms.
- **The turn is never a surprise:** one round before the rings turn, every carried piece shows a
  dashed ring where it will land (your colour or theirs) plus a toast and a rail line. After the
  turn, for that round only: enemy ranks it exposed on solid gold, your own exposed pieces with a
  thin dashed gold ring.
- Gold dot = a move. Ring = a strike. Vermilion = urgent (the countdown, a warning).
- The four wheel lessons teach one idea each, from controlled starting positions, then point to
  Daily and Quick Battle. No long rules screen.

## 5. Motion, sound and heat

- **The phone stays cool.** No `infinite` CSS animation on anything that stays on screen; no
  animated box-shadow, filter or SVG stroke loop; pulses are finite (armed ×3, last move ×2,
  hint ×6). Idle < 3 % busy on every screen (`tools/perf-idle.mjs`), portrait and landscape.
- **Calm** is the default pace: one moment at a time — the move, the clash, Sanjaya's line, then
  the opponent. Every step skippable with one tap. **Quick** is in Settings. Timing budget and the
  six overlap rules are in `docs/PACING.md`; follow them for any sound, voice, card or animation.
- Sound is quiet by default: music about −17 LUFS, one-shots about −14, true peak below −1.5 dB.
  One voice at a time; never two loud effects. Every shipped sound is registered in `data/sounds.json`.
- Reduced-motion, colour-blind and high-contrast settings must keep working for anything new.

## 6. Words

- English first; Hindi and Marathi through `docs/i18n/` (Sarvam). A string not yet translated is
  listed in `docs/i18n/pending-*.json` and shows in English meanwhile.
- Names in play: **Chakravyuha, Padmavyuha, Sarvatobhadra, Kurukshetra**; **Surya / Chandra**
  hours; **Shakti** and the four astras (**Vayavyastra, Sammohanastra, Agneyastra, Brahmastra**);
  pieces from `data/pieces.json`; opponents **Sainik, Dronacharya, Shakuni**.
- Calm, specific, never preachy. Say what happened and what to do next in one sentence.
- No pay-for-power, no real-money mechanics, no tracking. Opt-in analytics only, written up first.

## 7. Keeping it consistent (the checklist)

Before a change goes to a pull request:

1. New colour, size, string, sound or painting? It follows this file, or this file changes in the same PR.
2. New sound or painting: register it in `data/sounds.json` / `data/art.json`; run `node tests/data.mjs`.
3. Changed a piece, astra, field or painting box? Run `node tools/export-data.mjs`; commit `data/`.
4. Anything that moves or repeats: heat rule (section 5) and the idle probe.
5. Screens that change: before/after screenshots at 914 × 411 and 830 × 318.
6. Update `TASKS.md` (tick, add) and replace `docs/HANDOFF.md`.
