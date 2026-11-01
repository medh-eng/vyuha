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

`daily-candidates.json` holds drafts that are not live: `quiet-gate` (58.3 % on the lotus in bank 4).
Screen with `node tools/simulate-daily.mjs 120 --seed=<new bank> --output=docs/balance/<name>.json`.
Pick a seed base whose 120 seeds `(base + i·0x9e3779b9) >>> 0` miss every bank above.
