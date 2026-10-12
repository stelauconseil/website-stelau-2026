"""Optional illustration export: python3 scripts/export-audit-gifs.py.

Requires Pillow. Production builds do not require Python. The shared JSON also
drives the accessible Astro animation. The diagram is an original educational
interpretation of the audit process, not a reproduction of ISO illustrations.
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
COPY = json.loads((ROOT / "src/data/audit-cycle.json").read_text())
OUT = ROOT / "public/media/audits-certification"
W, H, FPS, SECONDS = 960, 540, 4, 4
PALETTES = {
    "light": {"paper": "#f8f9fa", "surface": "#ffffff", "soft": "#eaf0f5", "ink": "#212529", "muted": "#5d6771", "line": "#d9dfe5", "blue": "#0069b4"},
    "dark": {"paper": "#181d22", "surface": "#242a30", "soft": "#2b333c", "ink": "#f3f5f7", "muted": "#b8c1ca", "line": "#414a54", "blue": "#75baf0"},
}


def font(size, bold=False):
    for path in [f"/System/Library/Fonts/Supplemental/Arial{' Bold' if bold else ''}.ttf",
                 f"/usr/share/fonts/truetype/dejavu/DejaVuSans{'-Bold' if bold else ''}.ttf"]:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default(size=size)


FONTS = {n: font(n) for n in [11, 12, 13, 14, 16, 20, 24, 28, 30]}
BOLD = {n: font(n, True) for n in [14, 20, 24, 28, 30]}


def write(draw, text, x, y, color, size=16, width=None, bold=False):
    f = (BOLD if bold else FONTS)[size]
    lines, line = [], ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if width and line and draw.textlength(trial, font=f) > width:
            lines.append(line)
            line = word
        else:
            line = trial
    lines.append(line)
    for line in lines:
        draw.text((x, y), line, fill=color, font=f)
        y += size * 1.4
    return y


def frame(lang, theme, phase, progress):
    c, p = COPY[lang], PALETTES[theme]
    s = c["steps"][phase]
    fr = lang == "fr"
    im = Image.new("RGB", (W, H), p["paper"])
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((12, 12, 948, 528), radius=18, fill=p["soft"], outline=p["line"])
    write(d, "STELAU / ISO 19011 / " + ("LA DÉMARCHE D’AUDIT" if fr else "THE AUDIT PROCESS"), 36, 28, p["blue"], 12)
    write(d, c["title"], 36, 55, p["ink"], 28, bold=True)
    write(d, f"0{phase + 1} / 06", 850, 35, p["blue"], 12)
    write(d, "Illustration pédagogique · aucune donnée d’audit réel" if fr else "Educational illustration · no actual audit data", 36, 101, p["muted"], 12)

    # A generic audit document, connected to a reasoned result.
    d.rounded_rectangle((36, 138, 403, 342), radius=12, fill=p["surface"], outline=p["line"])
    write(d, f"0{phase + 1} / {s[0]}", 60, 156, p["blue"], 13)
    write(d, s[2], 60, 184, p["ink"], 24, width=320, bold=True)
    d.line((60, 231, 375, 231), fill=p["line"], width=1)
    for j, label in enumerate(["Exigence", "Preuve", "Constat"] if fr else ["Requirement", "Evidence", "Finding"]):
        y = 254 + j * 25
        d.rounded_rectangle((60, y, 160 - j * 14, y + 5), radius=2, fill=p["blue"])
        write(d, label, 184, y - 7, p["muted"], 13)
    d.line((428, 245, 507, 245), fill=p["line"], width=2)
    x = 428 + int(progress * 79)
    d.ellipse((x - 4, 241, x + 4, 249), fill=p["blue"])
    d.line((500, 239, 508, 245, 500, 251), fill=p["blue"], width=2)
    write(d, s[3], 538, 175, p["muted"], 13, width=355)
    write(d, s[4], 538, 217, p["ink"], 30, width=350, bold=True)
    write(d, "Comprendre → Vérifier → Documenter" if fr else "Understand → Verify → Document", 538, 304, p["muted"], 12, width=355)

    # Six phases stay visible while the highlight and progress move.
    for i, step in enumerate(c["steps"]):
        x = 36 + i * 148
        d.line((x, 368, x + 132, 368), fill=p["blue"] if i == phase else p["line"], width=3)
        write(d, f"0{i + 1} / {step[0]}", x, 382, p["blue"] if i == phase else p["muted"], 14, bold=True)
    write(d, s[1], 36, 420, p["ink"], 20, width=860)
    write(d, "Constats et rapport : équipe d’audit. Décision de certification : LSTI." if fr else "Findings and report: audit team. Certification decision: LSTI.", 36, 475, p["muted"], 12)
    d.line((36, 510, 924, 510), fill=p["line"], width=2)
    d.line((36, 510, 36 + int(888 * ((phase + progress) / 6)), 510), fill=p["blue"], width=2)
    return im


def export(lang, theme):
    per_phase = FPS * SECONDS
    rgb = [frame(lang, theme, phase, n / per_phase) for phase in range(6) for n in range(per_phase)]
    sheet = Image.new("RGB", (W, H * 6))
    for phase in range(6):
        sheet.paste(rgb[phase * per_phase], (0, H * phase))
    palette = sheet.quantize(colors=96)
    frames = [im.quantize(palette=palette) for im in rgb]
    path = OUT / f"demarche-audit-{lang}-{theme}.gif"
    frames[0].save(path, save_all=True, append_images=frames[1:], duration=1000 // FPS,
                   loop=0, optimize=True, disposal=1)
    print(f"{path.relative_to(ROOT)} — {path.stat().st_size // 1024} KiB")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for lang in ["fr", "en"]:
        for theme in PALETTES:
            export(lang, theme)
