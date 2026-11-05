# incoming/art/pata — the new look's art (Sanjaya's Pata)

Drop files here with the exact names from `docs/prompts/PATA.md`. The Director checks each one,
makes the small fast copy for `assets/` and wires it in. Masters stay here; they never ship.

Rules: transparent PNG (or flat magenta `#FF00FF`), never black · no text · no deity ·
one figure filling about 80 % of the frame · no watermark.

## Pieces checklist — `pieces/`

Surya = vermilion + saffron + gold. Chandra = lapis blue + conch white + silver-grey.

| Piece | Surya | Chandra |
|---|---|---|
| Senapati | ✅ `surya-senapati.png` (5 Nov) | ✅ `chandra-senapati.png` |
| Maharathi | ✅ `surya-maharathi.png` (5 Nov) | ✅ `chandra-maharathi.png` |
| Ashvarohi | ✅ `surya-ashvarohi.png` | `chandra-ashvarohi.png` |
| Dhanurdhar | ✅ `surya-dhanurdhar.png` | `chandra-dhanurdhar.png` |
| Divyadrishti | ✅ `surya-divyadrishti.png` | `chandra-divyadrishti.png` |
| Yantrik | ✅ `surya-yantrik.png` | `chandra-yantrik.png` |
| Rath | ✅ `surya-rath.png` | `chandra-rath.png` |
| Chara | ✅ `surya-chara.png` | `chandra-chara.png` |
| Shataghni | ✅ `surya-shataghni.png` | `chandra-shataghni.png` |
| Durg | ✅ `surya-durg.png` | `chandra-durg.png` |
| Durg, gate broken | ✅ `surya-durg-broken.png` | `chandra-durg-broken.png` |
| Durg, fallen | ✅ `surya-durg-fallen.png` | `chandra-durg-fallen.png` |
| Dropped banner | ✅ `surya-banner.png` | `chandra-banner.png` |
| Hidden enemy (one for both) | ✅ `hidden.png` | |

**All 27 piece files arrived on 5 Nov 2026**, plus every file below; all are in the game
(made small by `tools/prepare-pata.py`).

Phase 2 adds `fields/` padma, small, large (day and night), `portraits/` ten avatars and `astras/` four stills — see `docs/prompts/PATA.md`.

The other folders: `fields/` (chakra-day, chakra-night), `frame/` (border-chakra, cloth-cotton,
cloth-indigo), `scenes/` (home-chamber, home-lamp), `portraits/` (sanjaya). Sizes in `PATA.md`.

## Style reference

`surya-senapati.png` and `surya-maharathi.png` are the **reference pair**: match their line
weight, ornament, skin tone, cream animals and gold trim in every later piece. Generate the rest
in the same chat/session, and attach one of these two as the style image.
