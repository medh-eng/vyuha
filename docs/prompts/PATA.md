# VYUHA — art prompt pack: *Sanjaya's Pata* (Chapter IV · Rang, Phase 0–1)

For the Commander (or ChatGPT / Gemini image generation). Make the image, save it with the
**exact file name**, put it in `incoming/art/pata/` (keep the sub-folders), or attach it in chat.
The Director checks every file against the reference sheet and the 32 px legibility sheet,
makes the optimised copy and wires it in. The plan is in `docs/LOOK.md`.

Phase 1 needs only the files in sections 1–5 (about 35 images, Chakravyuha only). Fields 2–4,
heroes and astras come in Phase 2, after Gate 1.

## Four rules that matter more than any prompt

1. **Background: transparent PNG, or pure flat magenta `#FF00FF`.** Never black — the new style
   has black outlines and keying black would eat them. (Fields, textures and scenes fill the frame.)
2. **No text, letters or numbers inside the image.** The game prints names and ranks.
3. **No deity, no god's face, no temple idol, no religious symbol on flags.** Warriors are human
   and drawn with dignity.
4. **One figure, one silhouette.** It must be recognisable at the size of a fingernail (32 px).
   Shrink your result to 32 px before sending — if you can't tell what it is, try again.

Do not imitate any living artist, comic (e.g. Amar Chitra Katha), film or TV look. The traditional
styles named here belong to everyone. Check that your image tool allows commercial use and that
the file has **no visible watermark** (today's art has a small star in the corner — that must not
come back).

## Master style block

Paste this before every prompt (or once, then say *"same style"*):

> Indian narrative cloth painting in the tradition of Rajasthani Phad and Odisha Pattachitra,
> made as clean game art: flat areas of mineral colour, bold even lamp-black outlines, figures in
> strong profile, large expressive eyes, decorative but simple patterns, touches of gold leaf only
> on highlights. No glossy metal, no 3D rendering, no photographic light or shadow, no gradients
> except a faint cloth texture. Palette: unbleached cotton cream #F2E4C4, vermilion #C8341C,
> saffron #EE8F1C, lapis blue #2C58A8, conch white #F7F1E3, malachite green #2E8A62, ochre
> #C68A2E, gold #D6A23C, lamp-black #1C1510. Heroic, dignified, bright, readable from far away.
> No text or letters anywhere.

**Army colours** — add one of these lines to every piece prompt:

- **Surya** (Suryavansh): *"Clothing, turban and horse trappings in vermilion and saffron with gold."*
- **Chandra** (Chandravansh): *"Clothing, turban and horse trappings in lapis blue and conch white with silver-grey."*

## Style reference (5 Nov 2026)

The Commander's first two pieces, `incoming/art/pata/pieces/surya-senapati.png` and
`surya-maharathi.png`, are approved as the **reference pair**. Attach one of them to every later
prompt and add: *"Match this image exactly in style: line weight, ornament, skin tone, cream
animals, gold trim, transparent background."* They are richer than the plain style block
below — follow the pair, not the block, where they differ.

**Chandra versions:** attach the Surya image and ask: *"Redraw this exact image, same pose
and drawing, but recolour all clothing, turban, parasol, cloths and trappings from red and
orange to lapis blue #2C58A8 and conch white #F7F1E3, with silver-grey instead of gold. Keep
skin, animals and outlines the same. Transparent background."*

## 1. Pieces — 20 files

`incoming/art/pata/pieces/<army>-<piece>.png` with `<army>` = `surya` or `chandra`.
**1024 × 1024 PNG**, transparent or flat `#FF00FF`, one figure centred, filling the middle 70 %,
seen from the side, no ground, no frame (the game draws the disc and rim).

| File stem | Prompt (after the style block and army line) |
|---|---|
| `senapati` | A commander seated on a war elephant, a royal parasol (chhatra) held high above him; the parasol is the biggest, clearest shape. Elephant in profile walking right. |
| `maharathi` | A great warrior standing in a chariot, drawing a long bow at full stretch, the bow raised above the chariot rail. One horse shown, in profile. |
| `ashvarohi` | A rider on a rearing horse, spear raised; the horse's head and front legs are the clearest shapes. |
| `dhanurdhar` | A kneeling archer with a tall bow, arrow nocked and aimed up and right; the long arc of the bow dominates. |
| `divyadrishti` | A calm seer standing, holding up a small oil lamp whose flame glows gold; wide, open eyes. Plain robe, no religious marks. |
| `yantrik` | A siege sapper carrying a long-handled axe over his shoulder and a coil of rope at his hip; sturdy, practical clothes. No modern tools. |
| `rath` | An empty racing chariot pulled by two horses at a gallop; the two spoked wheels are bold and clear. |
| `chara` | A hooded spy half turned away, a curved dagger held low; the hood and shadowed face are the clearest shape. |
| `shataghni` | A heavy wooden log studded with iron spikes, hanging from two ropes, ready to fall. No person. |
| `durg` | A small hill fort seen from the front: two towers, battlements and a big carved wooden gate in the middle, shut. |

## 2. Hidden enemy — 1 file

`incoming/art/pata/pieces/hidden.png` · 1024 × 1024 · transparent or `#FF00FF`

> Same style, but an **unfinished ink drawing**: only lamp-black outlines on nothing, no colour at
> all. A standing warrior wrapped in a veil or cloak so that no weapon, animal or shape shows — it
> could be anyone. Loose, confident brush lines, like the first sketch on a cloth before painting.

## 3. Fort states — 4 files

`incoming/art/pata/pieces/<army>-durg-broken.png`, `<army>-durg-fallen.png` · 1024 × 1024

- **broken:** the same fort as `durg`, gate splintered and hanging open, a few burning embers, towers intact.
- **fallen:** the same fort, one tower collapsed, gate gone, the army's banner torn down on the ground.

Make them from the `durg` image (same angle and size) so the swap is seamless.

## 4. Dropped banners — 2 files

`incoming/art/pata/pieces/<army>-banner.png` · 512 × 512 · transparent or `#FF00FF`

> A small triangular war banner on a broken pole, lying on the ground at an angle, cloth in the
> army colours, plain pattern — no symbol, no letters. Very flat and simple; it marks where a
> warrior fell.

## 5. Chakravyuha field, frame and home — 9 files

All fill the frame (no magenta needed). Keep the middle quiet: the game draws the cells on top.

| File | Size | Prompt (after the style block) |
|---|---|---|
| `fields/chakra-day.png` | 3072 × 3072 | Seen straight from above: a vast chariot wheel painted on a cotton cloth, saffron and vermilion, with three rings and twelve spokes like roads; the hub is a small painted pavilion. Between spokes, soft ochre earth and malachite grass, very low detail. Around the outside, a border frieze of tiny marching soldiers, horses and elephants. Bright midday light, flat. |
| `fields/chakra-night.png` | 3072 × 3072 | **The same picture, exactly the same layout**, but the cloth dyed deep indigo #1F2A5C, figures and lines in conch white and silver, a few gold stars. Make it from the day image. |
| `frame/border-chakra.png` | 2048 × 256 | A horizontal border strip of marching soldiers, horses and elephants in profile, Phad style, that **tiles seamlessly** left to right. |
| `frame/cloth-cotton.png` | 1024 × 1024 | A very subtle unbleached cotton cloth texture, cream #F2E4C4, fine weave, almost flat. Must tile seamlessly. |
| `frame/cloth-indigo.png` | 1024 × 1024 | The same texture dyed indigo #1F2A5C. Must tile seamlessly. |
| `scenes/home-chamber.png` | 3840 × 2160 | Sanjaya's chamber at night, painted in this style: Sanjaya (a calm man in his 50s, cream and saffron shawl) seated, speaking, beside the blind old king on a low throne; between them a large painted cloth hangs on a frame, showing a tiny battle on a wheel. One oil lamp on a stand at the left. Leave the right third quieter for menu buttons. |
| `scenes/home-lamp.png` | 1024 × 1024 | Only the lamp's flame and its glow from the picture above, on `#FF00FF`, for the arrival flare. |
| `portraits/sanjaya.png` | 2048 × 2048 | Sanjaya, head and shoulders, three-quarter profile facing right, calm and warm, cream and saffron shawl, in this cloth-painting style; transparent or `#FF00FF`. |

## 6. Sound — Phase 1

Put files in `incoming/audio/`. WAV, 48 kHz, 24-bit, no reverb, no clipping (levels as in
`docs/prompts/AUDIO.md`: music around −17 LUFS, one-shots around −14 LUFS).

| File | Length | Brief |
|---|---|---|
| `music/sanjaya-ravanhatta.wav` | 60–90 s, loopable | Sanjaya's theme on the ravanhatta (bowed folk fiddle of Rajasthan), slow and warm, over a soft tanpura drone. The first 2 s should work alone as the reveal sting. |
| `sfx/reveal-brush.wav` | ≤ 0.6 s | One wet brush stroke on cloth. |
| `sfx/fall-cloth.wav` | ≤ 0.8 s | Soft cloth tearing. |
| `sfx/clash-pakhawaj-1.wav` … `-3.wav` | ≤ 0.5 s each | Three different single pakhawaj strikes, one heavy. |
| `sfx/sky-dye.wav` | 1–1.5 s | A low cloth swish with a faint bell, for the cotton ↔ indigo change. |
| `sfx/ui-cloth.wav` | ≤ 0.2 s | A tiny cloth rustle for menu taps. |

A sampled ravanhatta is fine as a stand-in; a live recording is the dream.

## Phase 2 files (after Gate 1 — do not start yet)

Padmavyuha (Pattachitra lotus, deep red ground), Sarvatobhadra (Kalamkari indigo and madder,
rift rivers), Kurukshetra (Pahari green plain, river, hills) — day and night each, plus their
borders; ten heroes and avatars repainted; four astra stills. Prompts follow after Gate 1.
