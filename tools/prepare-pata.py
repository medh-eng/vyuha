"""Rang — make the shipped copies of the Sanjaya's Pata art and sound.

python3 tools/prepare-pata.py

Reads each master from the first place it is found:
  1. incoming/art/pata/<path>  and incoming/audio/<file>   (new uploads)
  2. masters/pata/<path>       and masters/audio/...        (local copy of the
     masters archive; masters/ is not kept in git — see masters-README.md)
A master that is in neither place is skipped and its shipped copy is left as
it is, so the script is safe to run with only the new files present.

Writes assets/art/pata/** (WebP) and assets/audio/{sfx,music}/pata_*.mp3, then
prints a size report.
"""
from pathlib import Path
import subprocess
from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ART_SEARCH = [ROOT / "incoming/art/pata", ROOT / "masters/pata"]
SND_SEARCH = [ROOT / "incoming/audio", ROOT / "masters/audio/supplied-2026-11-05", ROOT / "masters/audio/supplied-2026-11-06"]
ART_OUT = ROOT / "assets/art/pata"
SFX_OUT = ROOT / "assets/audio/sfx"
MUS_OUT = ROOT / "assets/audio/music"
report = []
skipped = []


def find(search, rel):
    for base in search:
        p = base / rel
        if p.exists():
            return p
    skipped.append(rel)
    return None


def art(rel):
    return find(ART_SEARCH, rel)


def save_webp(im, out, quality=82):
    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out, "WEBP", quality=quality, method=6)
    report.append((out.relative_to(ROOT), out.stat().st_size // 1024))


def piece(src, out, size=256, thicken=0):
    """Crop to the figure, centre it on a square, shrink for a phone token."""
    im = Image.open(src).convert("RGBA")
    if thicken:
        # the hidden sketch is thin brush line: spread the ink so it reads at 32 px
        r, g, b, a = im.split()
        a = a.filter(ImageFilter.MaxFilter(thicken))
        rgb = Image.merge("RGB", (r, g, b)).filter(ImageFilter.MinFilter(thicken))
        im = Image.merge("RGBA", (*rgb.split(), a))
    bbox = im.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox()
    im = im.crop(bbox)
    side = max(im.size)
    sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    sq.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    save_webp(sq.resize((size, size), Image.LANCZOS), out, 86)


def key_magenta(im):
    """Flat #FF00FF background to transparency, with a soft edge."""
    im = im.convert("RGBA")
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            d = abs(r - 255) + g + abs(b - 255)
            if d < 90:
                px[x, y] = (r, g, b, 0)
            elif d < 180:
                px[x, y] = (r, g, b, int(255 * (d - 90) / 90))
    return im


def scaled(src, width):
    im = Image.open(src)
    im = im.convert("RGBA" if im.mode in ("RGBA", "P", "LA") else "RGB")
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width), ), Image.LANCZOS)
    return im


def unstar(im, frac):
    """The 6 Nov night fields carry the generator's four-point star in the
    bottom-right corner tile. The borders are mirror-symmetric, so the
    bottom-left corner tile, flipped, covers it."""
    w, h = im.size
    s = int(w * frac)
    patch = im.crop((0, h - s, s, h)).transpose(Image.FLIP_LEFT_RIGHT)
    im = im.copy()
    im.paste(patch, (w - s, h - s))
    return im


def night_dye(im, amount=0.4):
    """Re-dye a night field towards indigo so the Chandra hour reads at a glance
    (the supplied night paintings are recoloured, but still lit like day)."""
    indigo = Image.new("RGB", im.size, (70, 84, 150))
    return Image.blend(im, ImageChops.multiply(im, indigo), amount)


# ── art ──────────────────────────────────────────────────────────────
for src_dir in [b / "pieces" for b in ART_SEARCH]:
    for src in sorted(src_dir.glob("*.png")):
        piece(src, ART_OUT / "pieces" / (src.stem + ".webp"), thicken=9 if src.stem == "hidden" else 0)

for name in ("chakra-day", "chakra-night"):
    if (src := art(f"fields/{name}.png")):
        save_webp(scaled(src, 1254).convert("RGB"), ART_OUT / "fields" / (name + ".webp"), 80)

# Phase 2 fields (6 Nov 2026). Each is painted to its board's shape; the game
# places it with A.PATA_FIELD_BOX in js/art.js, measured on these exact pixels —
# if a master is replaced, re-measure there. Night is resized onto the day's
# pixels (the two line up exactly). The 7 Nov 2026 night masters are painted in
# true indigo and have no corner star, so they ship as they are. Older night
# masters (6 Nov) need NIGHT_REPAIR = True: cover the star, re-dye the cloth.
NIGHT_REPAIR = False
STAR_TILE = {"padma": 0.085, "small": 0.08, "large": 0.085}
for field in ("padma", "small", "large"):
    day_src, night_src = art(f"fields/{field}-day.png"), art(f"fields/{field}-night.png")
    if day_src:
        day = Image.open(day_src).convert("RGB")
        save_webp(day, ART_OUT / "fields" / f"{field}-day.webp", 78)
    else:  # no day master here: line the night up on the shipped day copy
        shipped = ART_OUT / "fields" / f"{field}-day.webp"
        if not (night_src and shipped.exists()):
            continue
        day = Image.open(shipped).convert("RGB")
    if night_src:
        night = Image.open(night_src).convert("RGB").resize(day.size, Image.LANCZOS)
        if NIGHT_REPAIR:
            night = night_dye(unstar(night, STAR_TILE[field]))
        save_webp(night, ART_OUT / "fields" / f"{field}-night.webp", 78)

for name in ("cloth-cotton", "cloth-indigo"):
    if (src := art(f"frame/{name}.png")):
        save_webp(scaled(src, 512).convert("RGB"), ART_OUT / "frame" / (name + ".webp"), 78)
if (src := art("frame/border-chakra.png")):
    save_webp(scaled(src, 1086).convert("RGB"), ART_OUT / "frame/border-chakra.webp", 80)
if (src := art("scenes/home-chamber.png")):
    save_webp(scaled(src, 1672).convert("RGB"), ART_OUT / "scenes/home-chamber.webp", 78)
for name in ("card-duel", "card-abhimanyu"):   # T-20: scenario cards (docs/prompts/PATA.md 5b)
    if (src := art(f"scenes/{name}.png")):
        save_webp(scaled(src, 1200).convert("RGB"), ART_OUT / f"scenes/{name}.webp", 80)
if (src := art("scenes/home-lamp.png")):
    save_webp(key_magenta(scaled(src, 384)), ART_OUT / "scenes/home-lamp.webp", 86)

# portraits: Sanjaya (narration strip) and the nine avatars, head and shoulders
for name in ("sanjaya", "arjuna", "karna", "bhima", "abhimanyu", "ghatotkach", "drona", "bhishma", "draupadi", "dhrishtadyumna"):
    if (src := art(f"portraits/{name}.png")):
        save_webp(scaled(src, 768 if name == "sanjaya" else 512), ART_OUT / "portraits" / (name + ".webp"), 84)

# astra stills: badges on the astra buttons and the invocation card
for name in ("vayavya", "sammohana", "agneya", "brahma"):
    if (src := art(f"astras/{name}.png")):
        save_webp(scaled(src, 384), ART_OUT / "astras" / (name + ".webp"), 84)


# ── sound ────────────────────────────────────────────────────────────
def snd(name):
    return find(SND_SEARCH, name)


def ff(args):
    subprocess.run(["ffmpeg", "-v", "error", "-y"] + args, check=True)


def oneshot(src, out, start=None, length=None, fade=0.08, lufs=-14, kbps=128, fade_in=0.004):
    """Trim, fade the tail, normalise (two-pass loudnorm is overkill for a
    sub-second hit, so a single pass with a true-peak ceiling)."""
    if not src:
        return
    chain = []
    if start is not None:
        chain.append(f"atrim=start={start}:duration={length},asetpts=PTS-STARTPTS")
    chain.append(f"afade=t=in:d={fade_in}")
    if length:
        chain.append(f"afade=t=out:st={max(0, length - fade)}:d={fade}")
    chain.append(f"loudnorm=I={lufs}:TP=-1.5:LRA=11")
    ff(["-i", str(src), "-vn", "-map_metadata", "-1", "-af", ",".join(chain), "-ar", "44100", "-ac", "2", "-b:a", f"{kbps}k", str(out)])
    report.append((out.relative_to(ROOT), out.stat().st_size // 1024))


SFX_OUT.mkdir(parents=True, exist_ok=True)
oneshot(snd("pakhawaj-1.mp3"), SFX_OUT / "pata_clash_1.mp3", 0, 0.75)
oneshot(snd("pakhawaj-2.mp3"), SFX_OUT / "pata_clash_2.mp3", 0, 0.55)
oneshot(snd("pakhawaj-4.mp3"), SFX_OUT / "pata_clash_3.mp3", 0, 0.55)
oneshot(snd("cloth-tearing.mp3"), SFX_OUT / "pata_fall.mp3", 1.25, 0.85, fade=0.2, lufs=-16)
oneshot(snd("clothes.mp3"), SFX_OUT / "pata_ui.mp3", 0.12, 0.3, fade=0.1, lufs=-20, kbps=96)
oneshot(snd("cloth-rustle.mp3"), SFX_OUT / "pata_sky.mp3", 7.4, 1.3, fade=0.4, lufs=-18)
# the reveal: one wet brush stroke (6 Nov), the first stroke of the take, 0.2–0.9 s.
# Before it arrived the reveal used the first 2 s of the ravanhatta theme.
if (brush := snd("reveal-brush.mp3")):
    oneshot(brush, SFX_OUT / "pata_reveal.mp3", 0.2, 0.7, fade=0.25, lufs=-18, fade_in=0.03)
else:
    oneshot(snd("sanjaya-ravanhatta.mp3"), SFX_OUT / "pata_reveal.mp3", 0.0, 2.0, fade=0.6, lufs=-17)

MUS_OUT.mkdir(parents=True, exist_ok=True)
if (src := snd("sanjaya-ravanhatta.mp3")):
    out = MUS_OUT / "sanjaya_ravanhatta.mp3"
    ff(["-i", str(src), "-vn", "-map_metadata", "-1", "-af",
        "atrim=0:165,afade=t=in:d=1.5,afade=t=out:st=161:d=4,loudnorm=I=-17:TP=-1.5:LRA=11",
        "-ar", "44100", "-ac", "2", "-b:a", "96k", str(out)])
    report.append((out.relative_to(ROOT), out.stat().st_size // 1024))

total = 0
for path, kb in report:
    total += kb
    print(f"{kb:6d} KB  {path}")
print(f"{total:6d} KB  total")
if skipped:
    print("skipped (master not found, shipped copy left as it is): " + ", ".join(sorted(set(skipped))))
