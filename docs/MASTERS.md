# Masters — the original files, kept outside the repository

Since 6 Nov 2026 the repository holds only what the game ships (`assets/`) plus code and docs.
The full-size originals (≈ 215 MB) live in four zip files instead:

| Zip | What is inside | Size |
|---|---|---|
| `vyuha-masters-pata-art.zip` | every Pata painting as delivered: pieces, fields, frame, scenes, portraits, astras (`masters/pata/…`) | ≈ 130 MB |
| `vyuha-masters-classic-art.zip` | the Classic (bronze) look's paintings: units, boards, ui, heroes, astras, cards, banners, sky, app icon (`masters/…`) | ≈ 50 MB |
| `vyuha-masters-audio.zip` | every supplied sound: 30 Oct pack, 5 Nov Pata pack, 6 Nov brush, older sfx (`masters/audio/…`) | ≈ 36 MB |
| `vyuha-3d-pieces.zip` | the starter 3D pieces: GLB for renders, STL for printing (`assets/3d/…`) | ≈ 1 MB |

**Where they are:** sent to the Commander in the Claude chat of 6 Nov 2026 — keep them in a folder
on the computer (e.g. `Documents/VYUHA masters/`). **Recommended:** also attach them to a GitHub
Release so they stay with the project: repository page → **Releases** → **Draft a new release** →
tag `masters-2026-11-06` → drag the four zips in → **Publish**. (Claude's sessions cannot create
releases.) Everything was also in git history up to commit `2504f77`, so nothing is lost either way.

## To rebuild the game's copies

Unzip at the repository root — the zips already contain the `masters/` (and `assets/3d/`) folders:

```bash
unzip vyuha-masters-pata-art.zip && unzip vyuha-masters-audio.zip
python3 tools/prepare-pata.py          # Pata art + sound → assets/art/pata, assets/audio
python3 tools/prepare-audio-pack.py    # the 30 Oct music pack
```

`masters/` is in `.gitignore`, so unzipped originals are never committed by accident.

## New art and sound

New uploads still go to `incoming/` with the names from `docs/prompts/` (see `incoming/README.md`).
The Director makes the game copies, then removes the big originals from the repository and adds
them to the next masters zip.
