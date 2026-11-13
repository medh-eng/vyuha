# VYUHA — a hard review and the plan from it

**13 November 2026 · Director.** Asked for by the Commander: judge the game as a veteran
developer would, say what is wrong, change what needs changing, and do the work in parts.
Every number below was measured this session on `main` (seeded battles between the game's own
opponents; no person played). Where a sample is small it says so.

## The verdict in four lines

1. **The game is worth finishing.** A hidden-rank war on a turning Chakravyuha, told by Sanjaya,
   painted like a pata: nobody else has this. The battle screen is the best thing in the repo.
2. **It has no players, and it has never had one.** The repo records no human playtest. Two
   weeks of work by four AIs has been polish on guesses.
3. **It asks a new player to learn too much, then gives them nothing to come back for** except
   the Daily. There is no campaign, no unlocks, no friend to beat.
4. **"Viral" cannot be promised by anyone.** What can be built is the loop that makes it possible:
   one tap in, a win within ten minutes, a result worth posting, a link that opens straight into
   the same wheel. Two of those four were broken until today.

## What is good — keep it

| | Evidence |
|---|---|
| The look and the battle screen | Pata fields, painted pieces, the sideways layout at 914 × 411 |
| Battle length on the wheel | 200 Dronacharya-v-Dronacharya battles: median 23 rounds (19–27 for the middle half). That is the chai break |
| First-move fairness on the wheel | Same 200 battles: 101 to 99 |
| The Daily and its share card | The right shape for WhatsApp: one wheel a day, a grid, a streak |
| The ethics | No deity as a piece, no pay-for-power, offline, no tracking, an AI that does not peek |

## What is wrong — worst first

| # | Problem | Evidence | Status |
|---|---|---|---|
| 1 | **Nobody has played it.** | `docs/ROADMAP.md` playtest notes are empty; T-05 open since 6 Nov | Commander only — see "The gate" |
| 2 | **The first battle was a defeat by design.** Yuddh karo sent a new player against Dronacharya | Sainik-level play beat Dronacharya 17 times in 100 on the wheel | **Fixed today** (the ladder) |
| 3 | **Sideways, the home screen had no play button.** Sideways is the game's default | Yuddh karo sat at 461 px on a 411 px screen | **Fixed today** |
| 4 | **Sideways, the result card's buttons were cut off** | Buttons ended at 409 px inside a card that ended at 394 px | **Fixed today** |
| 5 | **Too many rules at once.** Ten kinds of piece, hidden ranks, turning rings, two hours, Makara and Padma, Shakti, four astras, gates — and vows and heroes on the way | Four lessons teach four of these; the first real battle uses all of them | Part 3 (campaign) |
| 6 | **Nothing to come back for but the Daily.** A record and a title is not a reason to return | — | Part 3 |
| 7 | **A third of wheel battles end without the fort falling.** One side runs out of pieces that can move and the field is "conceded" | 63 of 200 on the wheel, 82 of 150 on the lotus | **Done (Part 2):** rule kept — it is the Stratego rule and decisive. The ending is now *shown*: the fort-fall card, burst and Sanjaya's "fort" line, and the result card says so from your side |
| 8 | **Kurukshetra rarely finishes.** The sun sets and points decide | 39 of 60 Dronacharya-v-Dronacharya battles, 34 of 60 Sainik-v-Dronacharya. On Sarvatobhadra only 20 of 60 ended at a fort | **Done (Part 2):** rule kept — stopping at sunset is how Kurukshetra was fought. The score that decides it (bala) and the countdown are now in the GOAL box for the last ten rounds. Revisit after playtests |
| 9 | **The headline promises a mode that does not exist.** "Abhimanyu got in. Can you get out?" — every mode is about getting *in*, and the Daily card uses that line for a break-in | `js/modes.js` Daily briefing | **Words done (Part 2):** the Daily says "The wheel is closed. Break in." and its share line "Same wheel for everyone today. Can you break in?". The mode itself: Part 3 |
| 10 | **You cannot play a friend who is not in the room.** In a bluffing game, people are the content | Pass-and-play only | **Done (Part 2):** Challenge a friend — the link carries field, opponent, rules, the enemy's formation (a seed) and the rounds to beat. Live online needs a server — a launch decision |
| 11 | **Hindi and Marathi are half done.** 79 newer strings are English only; battle-log prose is English only | `docs/i18n/pending-first-session.en.json`; Sarvam has delivered nothing since Batch 3 | Part 4 — stop waiting for Sarvam |
| 12 | **The process is heavier than the game needs.** Fifteen check harnesses, four layers of documents, 28 old branches, for a game with no players | The robot player alone takes over ten minutes | Trim after the gate |
| 13 | **Fast defeats.** Some battles are over before the player has done anything | 16 of 100 Sainik-v-Dronacharya battles ended by round 10 | Watch in playtests; the ladder softens it |

Not problems, though they were suspected: the first move on the wheel is fair (101–99); the lotus
ran 67–83 over 150 battles, which is inside chance but worth another bank before any change.

## The plan, in parts

**Part 1 — the first ten minutes (done, this pull request).**
The two scenario paintings in the game. The ladder: Sainik → Dronacharya → Shakuni, with the
promotion shown on the result card. Home and the result card rebuilt for a phone held sideways.

**Part 2 — endings and a friend (done 13 Nov, PR #27).** What was decided, and why the rules stayed:
a rule change to endings needs two seed banks and would change every balance number; the endings
were right, they were just *invisible*. So they are now shown. Also found and fixed: every stage
card's sentence was cream on cream in the Pata look (unreadable since Pata became the default).
The original Part 2 list:
- A rule so a battle ends at the fort, not by running out of movers; a shorter Kurukshetra or a
  different sunset rule. Each screened on two fresh seed banks before it ships, like the Daily.
- The Daily briefing says what the task is. The headline line is kept for the mode that earns it.
- **Challenge a friend**: a link that carries the field, the opponent and the seed — "I took the
  fort in 17 rounds. Same wheel, same enemy. Beat it." No server needed.

**Part 3 — a reason to return (after the gate).**
- **The Seven Vyuhas**: a campaign that is also the tutorial. Battle 1 is plain hidden ranks;
  each vyuha adds one rule (the engine already switches gates, hours, formations and astras per
  battle). The four lessons fold into it.
- **Abhimanyu Escape** as its last chapter — the mode the headline has promised since day one.
- Heroes and vows wait until this is in. More systems before a campaign make problem 5 worse.

**Part 4 — India, then the store.**
Finish Hindi and Marathi with whatever tool delivers (a native reader still signs off), then the
Android build and the listing. Makar Sankranti is a good date only if the gate has been passed.

## The gate — the one thing only the Commander can do

**Five people who have never seen the game, on their own phones, watched in silence for ten
minutes.** Write down where each one stops. Nothing in Part 3 should be built before this,
because Part 3 is the largest work on the board and the playtests decide its shape. Everything
in Parts 1 and 2 is safe to build first.

## What was not done

No phone test, no human playtest, no native-language review. The measurements are the game's own
opponents playing each other; they show length, balance and how battles end — not whether the
game is fun.
