# VYUHA — roadmap and status

The live status board. Ticked = on `main` and playable. Owner tags: **[C]** Commander (Pon),
**[D]** Director (Claude), **[G]** ChatGPT, **[S]** Sarvam AI.

Last updated: **2 Nov 2026** — Chapter IV begun on `claude/chapter-4-pratigya-heroes`: Pratigya
vows playable; hero engine for four passive heroes (hidden until screened). History: `docs/WORKLOG.md`.

---

## Chapter III — complete ✅ (1 Nov 2026)

- [x] **[D]** Foundations: gate (two blows), first-move balance, fort never on the front line, honest AI, ceasefire instead of draws, no sci-fi strings
- [x] **[D]** Cool phone: no idle animation loops (every screen < 3 % busy, portrait and landscape); battery saver; audio pauses in the background
- [x] **[D]** The hook: no login wall, **Yuddh karo**, Pehla Yuddh lesson, Daily Chakravyuha with streaks and WhatsApp share
- [x] **[D]** Hours, Makara/Padma formations, Shakti and four astras with films, clash cinematics, odds on the board
- [x] **[D][G]** **Calm pace** (default) and Quick: one moment at a time, Sanjaya over the effect's tail, AI thinks while he speaks — clash → AI 6.7 s → 3.8 s (`docs/PACING.md`)
- [x] **[D][G]** **Phone landscape**: status rail · field · action rail; rotation keeps the turn (`docs/LANDSCAPE.md`)
- [x] **[G][S]** **Interface in English, हिन्दी, मराठी** (Settings); Sanjaya in Hinglish / हिन्दी / English with 88 recorded lines
- [x] **[C][G]** Art: ten hero/Sanjaya avatars, Padma board, day/night skies, astra stills and films, Daily card, share preview
- [x] **[C][S]** Sound: core pack, trap, day/night/Daily/lesson/Abhimanyu/victory music
- [x] **[D]** Profile hub: record, level per opponent, avatar, frame/tint/badge, own photo (on device)
- [x] **[D][G]** Daily Catalogue II (1 Nov, 21 variants) and **III (3 Nov, 28 variants)** — each passed two fresh seed banks (`docs/balance/`)

## Waiting on people (not code)

- [ ] **[C]** Phone test: three Calm battles, one Quick, portrait and landscape; warmth after 10–20 min
- [ ] **[C]** Five real people play Pehla Yuddh and one Daily on their own phones (`incoming/text/playtest.md`); notes below
- [ ] **[S]** Record 18 lines whose text changed in review + 4 shorter routine lines (`docs/agents/SARVAM.md` Batch 4)
- [ ] **[S]** A native speaker reads the Marathi interface
- [ ] **[C][G]** Art still open: full-screen effects, gate-breach art, store art (`docs/prompts/ART.md`)
- [ ] **[C]** Respect review by at least three players from different backgrounds (`DIRECTOR.md` §6)

## Chapter IV — depth and heroes (next)

- [x] **[D]** **Pratigya** — 12 secret vows (after the first win, AI duels only), stars, three titles (Vrati · Dridhavrata · Satyavrata), stamps; Settings toggle. Cosmetic only (`js/pratigya.js`)
- [x] **[D]** Hero engine: Bhima, Karna, Ghatotkacha, Dhrishtadyumna (`state.heroes`, off unless named; 19 rules tests; `tools/hero-sim.mjs`)
- [ ] **[G]** Screen the four heroes (50–58 % target) — Karna on the Maharathi ran 60.5 % in the first bank
- [ ] **[G]** AI values hero traits (`predict`, `strikeOdds`)
- [ ] **[G]→[D]** Hero card design (`incoming/text/hero-cards-design.md`), then the Director builds the card, the pick and the four active heroes (Arjuna, Drona, Abhimanyu, Bhishma)
- [ ] **[S]** Vow strings in Hindi/Marathi; Sanjaya's vow and hero lines
- [ ] **[C]** Vow stamps and title seals (`docs/prompts/ART.md`, Chapter IV)
- [ ] **[D]** Campaign map: the seven vyuhas, one lesson each (drafts: `incoming/text/campaign.md`)
- [ ] **[D]** Facing, introduced in the Krauncha chapter
- [ ] **[D]** Marathi narrator (text drafted: `incoming/text/sanjaya-marathi.csv`)
- [ ] **[D][G]** Retune `quiet-gate` and screen it in two fresh banks

## Chapter V — social

- [ ] **[D]** Challenge-a-friend link (seeded battle from WhatsApp)
- [ ] **[D]** Replay clip — the best moment as a 10-second vertical video
- [ ] **[D]** Vyuha codes — share a formation as a short code
- [ ] **[D]** Seasons and leaderboards / online play (need a server — decide at launch)

## Launch

- [ ] **[D]** Android build with Capacitor; ship only `assets/` (≈25 MB), never `masters/`
- [ ] **[C]** Play Store listing (`incoming/text/store-listing.md`), icon, feature graphic, screenshots, trailer
- [ ] **[C]** Name/trademark search for "VYUHA"; IP review of the rules before going commercial (not legal advice)
- [ ] **[C]** Launch week — Makar Sankranti is the natural moment
- [ ] **[D]** Monetisation, if any: cosmetic folk-art editions only; never power, never real money

---

## What to measure once real players arrive

| Signal | Target | Why |
|---|---|---|
| Pehla Yuddh finished | > 80% of new players | The lesson is the funnel. |
| First real battle finished | > 60% | Is the first battle too long or too hard? |
| Daily played on day 2 | > 30% | The habit loop. |
| Daily shares per 100 players | > 15 | The viral loop. |
| Median battle length | 8–12 minutes | Fits a break. |

The game has no analytics today (no server, nothing uploaded). Adding any must be opt-in and
written up here first.

## Playtest notes

*(Add a dated line per session: who played, device, what confused them, what they loved.)*
