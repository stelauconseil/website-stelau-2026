"""Export the two VDS teaching animations, FR/EN and light/dark.

Optional asset tool: python3 scripts/export-vds-gifs.py (requires Pillow).
No Python dependency is needed by Astro or CI. Content comes from the same
JSON as the accessible interactive diagrams. All illustrated data is fictional.
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
CONTENT = json.loads((ROOT / "src/data/vds-simulations.json").read_text())
OUTPUT = ROOT / "public/media/vds-verify"
WIDTH, HEIGHT, FPS, PHASE_SECONDS = 900, 540, 4, 4
PALETTES = {
    "light": {"paper": "#f8f9fa", "surface": "#ffffff", "soft": "#eaf0f5", "ink": "#212529", "muted": "#5d6771", "line": "#d9dfe5", "blue": "#0069b4", "warning": "#965118"},
    "dark": {"paper": "#181d22", "surface": "#242a30", "soft": "#2b333c", "ink": "#f3f5f7", "muted": "#b8c1ca", "line": "#414a54", "blue": "#75baf0", "warning": "#ffba80"},
}


def font(size, bold=False):
    candidates = [
        f"/System/Library/Fonts/Supplemental/Arial{' Bold' if bold else ''}.ttf",
        f"/usr/share/fonts/truetype/dejavu/DejaVuSans{'-Bold' if bold else ''}.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default(size=size)


FONTS = {s: font(s) for s in [11, 12, 13, 14, 16, 18, 20, 22, 28, 30]}
TITLE = font(28, True)
BOLD = font(20, True)
NAME = font(30, True)


def wrapped(draw, text, box_width, text_font):
    lines, line = [], ""
    for word in text.split():
        candidate = f"{line} {word}".strip()
        if line and draw.textlength(candidate, font=text_font) > box_width:
            lines.append(line)
            line = word
        else:
            line = candidate
    return lines + ([line] if line else [])


def write(draw, text, x, y, color, size=16, width=None, center=False, text_font=None):
    text_font = text_font or FONTS[size]
    lines = wrapped(draw, text, width, text_font) if width else [text]
    for line in lines:
        pos_x = x - draw.textlength(line, font=text_font) / 2 if center else x
        draw.text((pos_x, y), line, font=text_font, fill=color)
        y += size * 1.4
    return y


def frame(kind, lang, theme, phase, progress):
    p = PALETTES[theme]
    content = CONTENT[kind][lang]
    step = content["steps"][phase]
    fr = lang == "fr"
    image = Image.new("RGB", (WIDTH, HEIGHT), p["paper"])
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((12, 12, 888, 528), radius=18, fill=p["soft"], outline=p["line"])
    write(draw, "STELAU / VDS VERIFY", 38, 30, p["blue"], 12)
    write(draw, content["title"], 38, 53, p["ink"], 28, text_font=TITLE)
    write(draw, f"0{phase + 1} / 04", 820, 40, p["blue"], 13)
    write(draw, "Simulation pédagogique · données fictives · code non scannable" if fr else "Educational simulation · fictional data · non-scannable code", 38, 96, p["muted"], 12)

    # A document and its signature. The decorative pattern is not a real seal.
    draw.rounded_rectangle((38, 132, 325, 373), radius=12, fill=p["surface"], outline=p["line"])
    write(draw, step[3], 60, 150, p["muted"], 14)
    write(draw, "NOM" if fr else "NAME", 60, 185, p["muted"], 11)
    changed = kind == "integrity" and phase > 1
    write(draw, step[2], 60, 205, p["warning"] if changed else p["ink"], 30, text_font=NAME)
    write(draw, "2D-DOC / CEV", 60, 252, p["muted"], 11)
    for y in range(12):
        for x in range(12):
            if (x * 7 + y * 11 + x * y + (1 if changed else 0)) % 5 < 2:
                draw.rectangle((60 + x * 6, 276 + y * 6, 64 + x * 6, 280 + y * 6), fill=p["blue"])
    write(draw, "signature /", 155, 283, p["muted"], 12)
    write(draw, "7b9e…42af", 155, 305, p["muted"], 14)

    write(draw, "Une donnée change" if fr and changed else ("One field changes" if changed else ("Données + signature" if fr else "Data + signature")), 450, 214, p["muted"], 12, center=True)
    draw.line((352, 254, 548, 254), fill=p["line"], width=2)
    for j in range(3):
        x = 352 + int(196 * ((progress + j / 3) % 1))
        draw.ellipse((x - 4, 250, x + 4, 258), fill=p["blue"])
    draw.line((540, 248, 549, 254, 540, 260), fill=p["blue"], width=2)
    write(draw, "Papier / écran" if fr and kind == "paper" else ("Paper / screen" if kind == "paper" else ("Empreinte recalculée" if fr else "Recomputed digest")), 450, 276, p["muted"], 12, center=True)

    warning = phase == 3 or (kind == "integrity" and phase == 2)
    color = p["warning"] if warning else p["blue"]
    draw.rounded_rectangle((575, 132, 862, 373), radius=12, fill=p["surface"], outline=color if warning else p["line"])
    write(draw, step[4], 718, 150, p["muted"], 14, center=True)
    draw.ellipse((693, 193, 743, 243), outline=color, width=2)
    if phase == 3 and kind == "integrity":
        draw.line((706, 205, 730, 230), fill=color, width=3)
        draw.line((730, 205, 706, 230), fill=color, width=3)
    elif warning:
        write(draw, "?", 718, 198, color, 30, center=True, text_font=NAME)
    else:
        draw.line((706, 219, 716, 228, 731, 209), fill=color, width=3)
    write(draw, step[5], 718, 270, p["ink"], 20, width=250, center=True, text_font=BOLD)
    hint = ("Signature ≠ lien au détenteur" if fr else "Signature ≠ holder binding") if kind == "paper" and warning else ("Signature / 7b9e…42af")
    write(draw, hint, 718, 338, p["muted"], 12, width=250, center=True)

    # Four steps remain present, with one highlighted and a moving progress line.
    for i, item in enumerate(content["steps"]):
        x = 38 + i * 208
        draw.line((x, 395, x + 195, 395), fill=p["blue"] if phase == i else p["line"], width=3)
        write(draw, f"0{i + 1} / {item[0]}", x, 407, p["blue"] if phase == i else p["muted"], 14)
    write(draw, step[1], 38, 443, p["ink"], 16, width=805)
    draw.line((38, 504, 862, 504), fill=p["line"], width=2)
    draw.line((38, 504, 38 + int(824 * ((phase + progress) / 4)), 504), fill=p["blue"], width=2)
    return image


def export(kind, lang, theme):
    rgb_frames = [frame(kind, lang, theme, phase, i / (FPS * PHASE_SECONDS))
                  for phase in range(4) for i in range(FPS * PHASE_SECONDS)]
    # Shared palette keeps colours stable and lets GIF optimise frame differences.
    colour_sheet = Image.new("RGB", (WIDTH, HEIGHT * 4))
    for phase in range(4):
        colour_sheet.paste(rgb_frames[phase * FPS * PHASE_SECONDS], (0, HEIGHT * phase))
    palette = colour_sheet.quantize(colors=96)
    frames = [image.quantize(palette=palette) for image in rgb_frames]
    destination = OUTPUT / f"{kind}-{lang}-{theme}.gif"
    frames[0].save(destination, save_all=True, append_images=frames[1:], duration=1000 // FPS,
                   loop=0, optimize=True, disposal=1)
    print(f"{destination.relative_to(ROOT)} — {destination.stat().st_size // 1024} KiB")


if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for kind in CONTENT:
        for lang in ["fr", "en"]:
            for theme in PALETTES:
                export(kind, lang, theme)
