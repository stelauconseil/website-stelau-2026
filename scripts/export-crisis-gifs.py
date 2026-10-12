"""Optional GIF exports: python3 scripts/export-crisis-gifs.py (Pillow).

The Astro animation uses the same content. All events and timings are fictional.
No Python dependency is required for the production build.
"""
import json
import runpy
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
# Reuse the existing palette/font/wrapping helpers; its export main is not run.
HELPERS = runpy.run_path(str(ROOT / "scripts/export-audit-gifs.py"))
write, PALETTES = HELPERS["write"], HELPERS["PALETTES"]
COPY = json.loads((ROOT / "src/data/crisis-preparation.json").read_text())
OUT = ROOT / "public/media/exercices-crise-cyber"
W, H, FPS, SECONDS = 960, 540, 4, 4


def frame(lang, theme, step, progress):
    c, p = COPY[lang], PALETTES[theme]
    s = c["steps"][step]
    fr = lang == "fr"
    im = Image.new("RGB", (W, H), p["paper"])
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((12, 12, 948, 528), radius=18, fill=p["soft"], outline=p["line"])
    write(d, "STELAU / " + ("AVANT LA PREMIÈRE ALERTE" if fr else "BEFORE THE FIRST ALERT"), 36, 28, p["blue"], 12)
    write(d, c["title"], 36, 55, p["ink"], 28, bold=True)
    write(d, f"0{step + 1} / 04", 850, 35, p["blue"], 12)
    write(d, "Démonstration · scénario fictif" if fr else "Demonstration · fictional scenario", 36, 101, p["muted"], 12)

    # Every mock message carries the exercise marker at its start and end.
    d.rounded_rectangle((36, 137, 552, 359), radius=12, fill=p["surface"], outline=p["line"])
    write(d, c["marker"], 58, 153, p["blue"], 12)
    write(d, s[2], 58, 190, p["muted"], 14)
    write(d, s[3], 58, 222, p["ink"], 24, width=463, bold=True)
    write(d, s[4], 58, 299, p["muted"], 12, width=464)
    d.line((58, 330, 530, 330), fill=p["line"], width=1)
    write(d, c["marker"], 58, 338, p["blue"], 11)

    write(d, "Temps de la crise" if fr else "Crisis time", 594, 144, p["muted"], 12)
    write(d, "Temps du jeu" if fr else "Exercise time", 805, 144, p["muted"], 12)
    for j, (day, time) in enumerate(zip(c["crisisDays"], c["gameTimes"])):
        y = 195 + j * 35
        write(d, day, 594, y - 9, p["blue"] if j in [1, 2] else p["ink"], 14)
        write(d, time, 843, y - 9, p["ink"], 14)
        d.line((648, y, 824, y), fill=p["line"], width=2)
        x = 648 + int(176 * ((progress + j / 4) % 1))
        d.ellipse((x - 4, y - 4, x + 4, y + 4), fill=p["blue"])
    write(d, "Week-end inclus / horaires de jeu fictifs" if fr else "Weekend included / fictional exercise times", 594, 338, p["muted"], 11, width=320)

    for j, item in enumerate(c["steps"]):
        x = 36 + j * 226
        d.line((x, 385, x + 208, 385), fill=p["blue"] if j == step else p["line"], width=3)
        write(d, f"0{j + 1} / {item[0]}", x, 400, p["blue"] if j == step else p["muted"], 14, bold=True)
    write(d, s[1], 36, 435, p["ink"], 20, width=870)
    write(d, "Scénario → artefacts → chronogramme → revue" if fr else "Scenario → materials → event schedule → review", 36, 477, p["muted"], 12)
    d.line((36, 510, 924, 510), fill=p["line"], width=2)
    d.line((36, 510, 36 + int(888 * ((step + progress) / 4)), 510), fill=p["blue"], width=2)
    return im


def export(lang, theme):
    per_step = FPS * SECONDS
    rgb = [frame(lang, theme, step, n / per_step) for step in range(4) for n in range(per_step)]
    sheet = Image.new("RGB", (W, H * 4))
    for step in range(4):
        sheet.paste(rgb[step * per_step], (0, H * step))
    palette = sheet.quantize(colors=96)
    frames = [im.quantize(palette=palette) for im in rgb]
    path = OUT / f"preparation-{lang}-{theme}.gif"
    frames[0].save(path, save_all=True, append_images=frames[1:], duration=1000 // FPS,
                   loop=0, optimize=True, disposal=1)
    print(f"{path.relative_to(ROOT)} — {path.stat().st_size // 1024} KiB")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for lang in ["fr", "en"]:
        for theme in PALETTES:
            export(lang, theme)
