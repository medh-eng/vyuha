"""Rang Phase 1 — make the shipped copies of the Sanjaya's Pata art and sound.

python3 tools/prepare-pata.py
Masters stay untouched: art in incoming/art/pata/, sound in
masters/audio/supplied-2026-11-05/. Writes assets/art/pata/** (WebP) and
assets/audio/{sfx,music}/pata_*.mp3, then prints a size report. Re-run it
whenever a master is replaced.
"""
from pathlib import Path
import subprocess
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ART_IN = ROOT / "incoming/art/pata"
ART_OUT = ROOT / "assets/art/pata"
SND_IN = ROOT / "masters/audio/supplied-2026-11-05"
SFX_OUT = ROOT / "assets/audio/sfx"
MUS_OUT = ROOT / "assets/audio/music"
report = []


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
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    return im


# ── art ──────────────────────────────────────────────────────────────
for src in sorted((ART_IN / "pieces").glob("*.png")):
    piece(src, ART_OUT / "pieces" / (src.stem + ".webp"), thicken=9 if src.stem == "hidden" else 0)
for name in ("chakra-day", "chakra-night"):
    save_webp(scaled(ART_IN / "fields" / (name + ".png"), 1254).convert("RGB"), ART_OUT / "fields" / (name + ".webp"), 80)
for name in ("cloth-cotton", "cloth-indigo"):
    save_webp(scaled(ART_IN / "frame" / (name + ".png"), 512).convert("RGB"), ART_OUT / "frame" / (name + ".webp"), 78)
save_webp(scaled(ART_IN / "frame/border-chakra.png", 1086).convert("RGB"), ART_OUT / "frame/border-chakra.webp", 80)
save_webp(scaled(ART_IN / "scenes/home-chamber.png", 1672).convert("RGB"), ART_OUT / "scenes/home-chamber.webp", 78)
save_webp(key_magenta(scaled(ART_IN / "scenes/home-lamp.png", 384)), ART_OUT / "scenes/home-lamp.webp", 86)
save_webp(scaled(ART_IN / "portraits/sanjaya.png", 768), ART_OUT / "portraits/sanjaya.webp", 84)


# ── sound ────────────────────────────────────────────────────────────
def ff(args):
    subprocess.run(["ffmpeg", "-v", "error", "-y"] + args, check=True)


def oneshot(src, out, start=None, length=None, fade=0.08, lufs=-14, kbps=128):
    """Trim, fade the tail, normalise (two-pass loudnorm is overkill for a
    sub-second hit, so a single pass with a true-peak ceiling)."""
    chain = []
    if start is not None:
        chain.append(f"atrim=start={start}:duration={length},asetpts=PTS-STARTPTS")
    chain.append("afade=t=in:d=0.004")
    if length:
        chain.append(f"afade=t=out:st={max(0, length - fade)}:d={fade}")
    chain.append(f"loudnorm=I={lufs}:TP=-1.5:LRA=11")
    ff(["-i", str(src), "-vn", "-map_metadata", "-1", "-af", ",".join(chain), "-ar", "44100", "-ac", "2", "-b:a", f"{kbps}k", str(out)])
    report.append((out.relative_to(ROOT), out.stat().st_size // 1024))


SFX_OUT.mkdir(parents=True, exist_ok=True)
oneshot(SND_IN / "pakhawaj-1.mp3", SFX_OUT / "pata_clash_1.mp3", 0, 0.75)
oneshot(SND_IN / "pakhawaj-2.mp3", SFX_OUT / "pata_clash_2.mp3", 0, 0.55)
oneshot(SND_IN / "pakhawaj-4.mp3", SFX_OUT / "pata_clash_3.mp3", 0, 0.55)
oneshot(SND_IN / "cloth-tearing.mp3", SFX_OUT / "pata_fall.mp3", 1.25, 0.85, fade=0.2, lufs=-16)
oneshot(SND_IN / "clothes.mp3", SFX_OUT / "pata_ui.mp3", 0.12, 0.3, fade=0.1, lufs=-20, kbps=96)
oneshot(SND_IN / "cloth-rustle.mp3", SFX_OUT / "pata_sky.mp3", 7.4, 1.3, fade=0.4, lufs=-18)
oneshot(SND_IN / "sanjaya-ravanhatta.mp3", SFX_OUT / "pata_reveal.mp3", 0.0, 2.0, fade=0.6, lufs=-17)

MUS_OUT.mkdir(parents=True, exist_ok=True)
out = MUS_OUT / "sanjaya_ravanhatta.mp3"
ff(["-i", str(SND_IN / "sanjaya-ravanhatta.mp3"), "-vn", "-map_metadata", "-1", "-af",
    "atrim=0:165,afade=t=in:d=1.5,afade=t=out:st=161:d=4,loudnorm=I=-17:TP=-1.5:LRA=11",
    "-ar", "44100", "-ac", "2", "-b:a", "96k", str(out)])
report.append((out.relative_to(ROOT), out.stat().st_size // 1024))

total = 0
for path, kb in report:
    total += kb
    print(f"{kb:6d} KB  {path}")
print(f"{total:6d} KB  total")
