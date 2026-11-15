# Daily balance

Dronacharya-vs-Dronacharya self-play, raider win rate per board. A variant goes live only if it
stays in **30–55 %** on both the wheel and the lotus in **two fresh, disjoint seed banks**.
AI screening, not human win rates.

| Report | Seed bank | What it screened |
|---|---|---|
| `bank1-0x51f15e.json` | 60 games/board | original 5 + 25 drafts |
| `bank2-0x6f31a9.json` | 120 games/board | same → 17 drafts promoted (Catalogue II, 1 Nov) |
| `bank3-0x92d04b-retunes.json` | 120 games/board | 8 retuned drafts + controls (ChatGPT 3.4) |
| `bank4-0xc4e7d3-retunes.json` | 120 games/board | same 8, fixed → 7 promoted (Catalogue III, 3 Nov) |
| [Bank 5](bank5-0x15b5a1-quiet-gate.json) | 120 games/board | Quiet Gate with four starting Shakti for the defenders |
| [Bank 6](bank6-0x16c6b2-quiet-gate.json) | 120 games/board | independent repeat of the same candidate |

## Quiet Gate · 15 November 2026

The defenders start with four Shakti, up from three. The fort still starts open, the raiders
still have their two scouts and zero Shakti, and the limit is 22 rounds. The previous
candidate reached 70/120 raider wins (58.3%) on the lotus in bank 4.

| Fresh bank | Field | Original (3 Shakti) | Candidate (4 Shakti) |
|---|---|---:|---:|
| 5 · `0x15b5a1` | Wheel | 64/120 (53.3%) | 61/120 (50.8%) |
| 5 · `0x15b5a1` | Lotus | 64/120 (53.3%) | 62/120 (51.7%) |
| 6 · `0x16c6b2` | Wheel | 53/120 (44.2%) | 54/120 (45.0%) |
| 6 · `0x16c6b2` | Lotus | 58/120 (48.3%) | 59/120 (49.2%) |

All four candidate results meet the 30–55% rule. Both versions also meet the rule in
these two banks, and the paired differences are only one to three wins. These runs
qualify the candidate for the Director's catalogue review. They do not establish that
the extra Shakti consistently reduces raider wins. Quiet Gate remains in the draft list.

Each bank uses 120 unique seeds, `(seedBase + i * 0x9e3779b9) >>> 0` for i = 0…119.
Their sets were checked against each other and all seeds in banks 1–4. Within a bank
the two versions use identical seeds on each field. All 960 battles ran to completion.
To replay the candidate:

```sh
node tools/simulate-daily.mjs 120 --modifier=quiet-gate --seed=0x15b5a1
node tools/simulate-daily.mjs 120 --modifier=quiet-gate --seed=0x16c6b2
```

To replay the control, use the same commands in a scratch checkout with the original
three-Shakti candidate from main commit `6849539`. Omitting `--modifier` screens the full catalogue.
