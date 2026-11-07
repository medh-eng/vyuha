# data/ — the game's registers as JSON

The runtime does **not** read these files. The game's constants stay in `js/units.js` and
`js/art.js`; these are the readable, diffable copy for docs, tools and other agents, kept honest by
`node tests/data.mjs`.

| File | Kept by | What it holds |
|---|---|---|
| `pieces.json` | generated | the ten piece kinds: key, rank, count, name, Devanagari, one-line rule; deployment order |
| `astras.json` | generated | the four astras: cost, element, one-line rule |
| `fields.json` | generated | the four fields: shape, size, cells, round cap, painting paths and placement box, sideways flag |
| `sounds.json` | by hand | every shipped sound: where it plays, batch, origin, link, verified flag |
| `art.json` | by hand | every painted set: made with, date supplied, corner-star status, notes |

**Generated** files: change `js/units.js` or `js/art.js`, then `node tools/export-data.mjs`, and commit
the result. Never edit them by hand — the test fails if they differ from the code.

**By hand:** add a line when a sound or painting is added. The test fails if an `.mp3` in
`assets/audio/music` or `sfx` is not in `sounds.json`, or a registered file is missing.
`verified: true` only after the origin and Pixabay link were checked against the source page.
