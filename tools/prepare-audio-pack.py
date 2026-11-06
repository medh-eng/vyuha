"""Rebuild the Commander's October audio pack with FFmpeg (masters untouched).

The masters are outside git: unzip vyuha-masters-audio.zip at the repository
root first (docs/MASTERS.md).

python3 tools/prepare-audio-pack.py
Intermediate PCM files are separated before crossfading so trimming a shared
input cannot terminate a late tail when the early head reaches EOF.
"""
from pathlib import Path
import json
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "masters/audio/supplied-2026-10-30"
REPORT = Path(tempfile.gettempdir()) / "vyuha-audio-pack"
REPORT.mkdir(parents=True, exist_ok=True)
rows = []


def run(args):
    return subprocess.run(args, capture_output=True, text=True, check=True)


for name, seconds in [("battle_night", 120), ("daily_theme", 90),
                      ("lesson", 75), ("abhimanyu", 176),
                      ("victory_big", 8), ("trap", 1.1)]:
    source = SOURCE / (name + ".mp3")
    target = ROOT / "assets/audio" / ("sfx" if name == "trap" else "music") / source.name
    target_i = -14 if name == "trap" else -17
    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp)
        if name not in ("trap", "victory_big"):
            for part, start, end in [("body", 2, seconds - 2),
                                     ("tail", seconds - 2, seconds), ("head", 0, 2)]:
                run(["ffmpeg", "-v", "error", "-y", "-i", str(source), "-af",
                     f"atrim=start={start}:end={end},asetpts=PTS-STARTPTS", str(work / (part + ".wav"))])
            inputs = ["-i", str(work / "body.wav"), "-i", str(work / "tail.wav"), "-i", str(work / "head.wav")]
            chain = "[1:a][2:a]acrossfade=d=1:c1=tri:c2=tri[seam];[0:a][seam]concat=n=2:v=0:a=1"
            expected = seconds - 1
        else:
            inputs = ["-i", str(source)]
            fade = 0.08 if name == "trap" else 0.8
            chain = f"atrim=end={seconds},asetpts=PTS-STARTPTS,afade=t=out:st={seconds-fade}:d={fade}"
            expected = seconds
        # Leave headroom for lossy MP3 overshoot, then measure the encoded file.
        norm = f",loudnorm=I={target_i}:TP=-2.5:LRA=11"
        measured = run(["ffmpeg", "-hide_banner"] + inputs + ["-filter_complex", chain + norm + ":print_format=json", "-f", "null", "-"])
        stats = json.loads(measured.stderr[measured.stderr.rfind("{"):])
        norm += (f":measured_I={stats['input_i']}:measured_TP={stats['input_tp']}"
                 f":measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}"
                 f":offset={stats['target_offset']}:linear=true")
        run(["ffmpeg", "-v", "error", "-y"] + inputs + ["-filter_complex", chain + norm,
             "-ar", "44100", "-ac", "1" if name == "trap" else "2", "-c:a", "libmp3lame", "-b:a", "96k", str(target)])
        probe = json.loads(run(["ffprobe", "-v", "error", "-show_entries", "format=duration,size", "-of", "json", str(target)]).stdout)["format"]
        assert abs(float(probe["duration"]) - expected) < 0.1, (name, probe, expected)
        checked = run(["ffmpeg", "-hide_banner", "-i", str(target), "-af", norm.split(",", 1)[1].split(":measured_I", 1)[0] + ":print_format=json", "-f", "null", "-"])
        final = json.loads(checked.stderr[checked.stderr.rfind("{"):])
        assert float(final["input_tp"]) <= -1, (name, final)
        rows.append({"file": str(target.relative_to(ROOT)), "duration": float(probe["duration"]),
                     "bytes": int(probe["size"]), "lufs": float(final["input_i"]),
                     "true_peak_dbtp": float(final["input_tp"]), "loop_crossfade_seconds": 1 if expected == seconds - 1 else 0})
        print(name, rows[-1], flush=True)

(REPORT / "levels.json").write_text(json.dumps(rows, indent=2) + "\n")
