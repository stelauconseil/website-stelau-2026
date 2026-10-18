"""Optional document-collection GIF exports (Pillow); not part of the site build.

The shared document list also drives the accessible HTML animation. No user
documents, personal information or source photographs are embedded in the files.
"""
import json
import runpy
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
H = runpy.run_path(str(ROOT / "scripts/export-audit-gifs.py"))
write, font, PALETTES = H["write"], H["font"], H["PALETTES"]
COPY = json.loads((ROOT / "src/data/vision-documents.json").read_text())
OUT = ROOT / "public/media/vision-identite"
W, HEIGHT = 960, 800


def documents(lang, theme, count):
    c, p = COPY[lang], PALETTES[theme]
    im = Image.new("RGB", (W, HEIGHT), p["paper"])
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((14, 14, W-14, HEIGHT-14), radius=20, fill=p["soft"], outline=p["line"])
    write(d, "STELAU / " + ("LE RÉFLEXE DU DOSSIER" if lang == "fr" else "THE FILE-COLLECTION REFLEX"), 38, 36, p["blue"], 12)
    write(d, f"{count:02d} / 10", 839, 36, p["blue"], 12)
    write(d, c["title"], 38, 70, p["ink"], 30, bold=True)
    write(d, c["intro"], 38, 115, p["muted"], 14)
    for i, item in enumerate(c["items"]):
        x, y = 38 + (i % 2)*450, 162 + (i // 2)*107
        active = i < count
        d.rounded_rectangle((x, y, x+434, y+94), radius=10, fill=p["surface"] if active else p["paper"], outline=p["line"])
        write(d, f"{i+1:02d}", x+15, y+15, p["blue"] if active else p["line"], 12)
        write(d, item[0] if active else "···", x+54, y+15, p["ink"] if active else p["muted"], 20, width=359, bold=True)
        for k in range(3):
            yy = y+72+k*5
            d.rounded_rectangle((x+54, yy, x+54+130-k*32, yy+2), radius=1, fill=p["line"])
    write(d, "Une demande. Dix familles de pièces." if lang == "fr" else "One request. Ten document categories.", 38, 720, p["ink"], 20, bold=True)
    write(d, "Exemple reçu par Benoit · pièces variables selon le statut" if lang == "fr" else "A request received by Benoit · documents vary with status", 38, 756, p["muted"], 12)
    return im


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for lang in ["fr", "en"]:
        for theme in PALETTES:
            frames=[documents(lang,theme,n) for n in range(11)]
            sheet=Image.new("RGB",(W,HEIGHT*2))
            sheet.paste(frames[0],(0,0));sheet.paste(frames[-1],(0,HEIGHT))
            palette=sheet.quantize(colors=96)
            frames=[im.quantize(palette=palette) for im in frames]
            path=OUT/f"documents-{lang}-{theme}.gif"
            frames[0].save(path, save_all=True, append_images=frames[1:], duration=[1000]+[1800]*9+[4500], loop=0, optimize=True, disposal=1)
            print(f"{path.relative_to(ROOT)} — {path.stat().st_size//1024} KiB")
